import express, { json } from "express"
import axios from "axios";
import cors from "cors"
import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import { input, z } from "zod"
import * as jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import { Middleware } from "./middleware";
import { generateBoilerplate } from "./boilerplate";
mongoose.connect("mongodb+srv://kolasaiprabhas:rOcAwZjlczi4neQe@cluster0.xt5d1.mongodb.net/mini-project")
import { UserModel, SubmissionModel, LeaderboardModel } from './db'
import { ProblemModel } from "./problemschema";
import { submitToJudge0, longPollForResults } from './judge0Utils';
import { TestCase } from "./problemschema";
import { TestCaseResult } from "./db";
import { DefaultClause } from "typescript";
const app = express();
app.use(express.json());
app.use(cors())

const JWT_SECRET = "snonfiq"

interface CustomRequest extends Request {
    userId?: string; // Optional userId property
}


app.post("/api/v1/signup", async (req: Request, res: Response) => {
    try {
        const signupSchema = z.object({
            username: z.string().min(3, "The min size for username is 3").max(18, "The max size is 18"),
            password: z.string().min(6, "The password must be 6 chars long").max(18, "The max size is 18"),
            email: z.string().email("Invalid email address"),
        });

        const validationResult = signupSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(422).json({
                errors: validationResult.error.errors.map((err) => ({
                    path: err.path,
                    message: err.message,
                })),
            });
        }

        const { username, password, email } = validationResult.data;

        const checkUser = await UserModel.findOne({ email });

        if (checkUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPass = await bcrypt.hash(password, 8);

        const newUser = await UserModel.create({
            username,
            password: hashedPass,
            email
        });

        res.status(200).json({
            message: `You're signed up, ${username}!`,
            userId: newUser._id,
        });
    } catch (error) {
        if (error instanceof Error) {
            if ("code" in error && error.code === 11000) {
                res.status(400).json({ error: "Username already exists. Please use a different username." });
            } else {
                res.status(500).json({ error: `An error occurred: ${error.message}` });
            }
        } else {
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    }
});

app.post("/api/v1/signin", async (req, res) => {

    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (!user) {
        return res.status(404).json({
            message: "User does not exist",
        });
    }
    const verifiedPass = await bcrypt.compare(password, user.password);
    if (!verifiedPass) {
        res.status(401).json({
            message: "invalid creds"
        })
    }
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET);
    res.status(200).json({
        Message: `hello ${username}`,
        token: token
    })
})


app.get("/problem/:id", Middleware("user"), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let language = req.query.language as string | undefined; // Handle undefined case

        if (!language) {
            language = 'js'
        }

        const problem = await ProblemModel.findById(id);
        if (!problem) {
            return res.status(404).json({ error: "Problem not found" });
        }

        // Ensure userBoilerplate and mainBoilerplate exist and have the requested language
        if (!problem.userBoilerplate || !problem.executionBoilerplate) {
            return res.status(400).json({ error: "Boilerplate code not available for this problem" });
        }

        if (!(language in problem.userBoilerplate) || !(language in problem.executionBoilerplate)) {
            return res.status(400).json({ error: "Invalid language" });
        }

        res.json({
            title: problem.title,
            description: problem.description,
            functionName: problem.functionName,
            returnType: problem.returnType,
            parameters: problem.parameters,
            testCases: problem.testCases,
            userBoilerplate: problem.userBoilerplate[language as keyof typeof problem.userBoilerplate],
        });

    } catch (error) {
        console.error("Error fetching problem:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/problems", Middleware("user"), async (req: Request, res: Response) => {
    try {
        const problems = await ProblemModel.find({}, "title"); // Fetch only titles

        // Format response with indexes
        const formattedProblems = problems.map((problem, index) => ({
            index: index + 1,
            title: problem.title,
            id: problem.id
        }));

        res.json(formattedProblems);
    } catch (error) {
        console.error("Error fetching problems:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// POST /submit


app.post('/submit', Middleware('user'), async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const userId = req.userId
        const { problemId, code, language }: { userId: string; problemId: string; code: string; language: 'js' | 'py' | 'cpp' | 'java' } = req.body;

        // Validate request body
        if (!userId || !problemId || !code || !language) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Fetch problem details from the database
        const problem = await ProblemModel.findById(problemId);
        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        // Fetch execution boilerplate for the selected language
        const executionBoilerplate = problem.executionBoilerplate[language];
        if (!executionBoilerplate) {
            return res.status(500).json({ error: 'Boilerplate not found for the selected language' });
        }

        // Combine user code with execution boilerplate
        const finalCode = executionBoilerplate.replace('{{usercode}}', code);

        // Prepare stdin for Judge0
        const stdin = problem.testCases
            .map(tc => tc.input.replace(/[\[\]]/g, '')) // Remove brackets from inputs like "[1, 2]"
            .join('\n'); // Join test case inputs with newlines
        const finalStdin = `${problem.testCases.length}\n${stdin}`;

        // Submit code to Judge0
        const judge0LanguageId = getJudge0LanguageId(language);
        const token = await submitToJudge0(finalCode, judge0LanguageId, finalStdin);

        // Poll Judge0 for results
        const results = await longPollForResults([token]);

        // Process Judge0 results
        const outputs = results[0]?.actualOutput?.split('\n') || [];
        const testCaseResults = problem.testCases.map((tc, index) => {
            const actualOutput = outputs[index] || '';
            const expectedOutput = tc.output.trim();
            const status = actualOutput === expectedOutput ? 'passed' : 'failed';
            return {
                testCaseId: tc._id,
                input: tc.input,
                expectedOutput: expectedOutput,
                actualOutput: actualOutput,
                status: status,
                timeTaken: parseFloat(results[0]?.timeTaken?.toString() || '0'),
                memoryUsed: results[0]?.memoryUsed || 0
            };
        });

        // Determine overall submission status
        const allPassed = testCaseResults.every(result => result.status === 'passed');
        const submissionStatus = allPassed ? 'Accepted' : 'Wrong Answer';

        // Create a new submission record in MongoDB
        const submission = new SubmissionModel({
            user: new mongoose.Types.ObjectId(userId),
            problem: new mongoose.Types.ObjectId(problemId),
            code: finalCode,
            language: language,
            tokens: [token],
            testCaseResults: testCaseResults,
            status: submissionStatus
        });

        await submission.save();

        // Return the final result to the user
        return res.json({
            status: submissionStatus,
            testCaseResults: testCaseResults
        });
    } catch (error) {
        console.error('Error during submission:', error);
        return res.status(500).json({ error: 'An error occurred while processing your submission' });
    }
});



// Helper function to map language to Judge0 language ID
function getJudge0LanguageId(language: string): number {
    const languageMap: { [key: string]: number } = {
        js: 63, // JavaScript (Node.js)
        py: 71, // Python
        cpp: 54, // C++
        java: 62 // Java
    };
    return languageMap[language.toLowerCase()];
}









// Admin Endpoints
app.post("/api/v1/admin/login", (req, res) => {
    try {
        const { username, password } = req.body;
        if (username === 'admin' && password === 'securePassword123') {
            const token = jwt.sign({ id: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ message: 'Login successful', token });
        } else {
            return res.status(403).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.log(error);
        return res.json({
            message: "Error while logging you in"
        });
    }
});

app.post("/problems", Middleware("admin"), async (req: Request, res: Response) => {
    try {
        const { title, description, functionName, returnType, parameters, testCases } = req.body;

        // **Validate input types**
        if (
            !title ||
            !description ||
            !functionName ||
            !returnType ||
            !Array.isArray(parameters) ||
            !Array.isArray(testCases)
        ) {
            return res.status(400).json({ error: "Invalid input: All fields are required and must be correctly formatted" });
        }

        if (!parameters.every(param => param.name && param.type)) {
            return res.status(400).json({ error: "Each parameter must have a 'name' and 'type'" });
        }

        if (!testCases.every(tc => tc._id !== undefined && tc.input && tc.output)) {
            return res.status(400).json({ error: "Each test case must have '_id', 'input', and 'output'" });
        }

        // **Auto-generate `_id` for test cases if missing**
        const formattedTestCases = testCases.map((tc, index) => ({
            _id: tc._id ?? index + 1,
            input: tc.input,
            output: tc.output
        }));

        // **Generate boilerplates automatically**
        let userBoilerplate, executionBoilerplate;
        try {
            const paramTypes = parameters.map(param => param.type); // Extract param types

            ({ userBoilerplate, executionBoilerplate } = generateBoilerplate(functionName, paramTypes));

        } catch (boilerplateError) {
            console.error("Error generating boilerplate:", boilerplateError);
            return res.status(500).json({ error: "Failed to generate boilerplate code" });
        }

        // **Create and save problem**
        const problem = new ProblemModel({
            title,
            description,
            functionName,
            returnType,
            parameters,
            testCases: formattedTestCases,
            userBoilerplate,
            executionBoilerplate
        });

        await problem.save();
        return res.status(201).json({ message: "Problem created successfully", problem });

    } catch (error) {
        console.error("Error creating problem:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});




app.listen(3000)