import mongoose, { mongo } from "mongoose";
const Schema = mongoose.Schema;
const model = mongoose.model;
const Document = mongoose.Document

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    problemsSolved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
    submissionHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
});



export interface TestCaseResult {
    testCaseId: Number;
    input?: string | null;
    expectedOutput?: string | null;
    actualOutput?: string | null;
    status: 'passed' | 'failed' | 'error';
    timeTaken: number;
    memoryUsed: number;
}

export interface ISubmission extends Document {
    user: mongoose.Types.ObjectId;
    problem: mongoose.Types.ObjectId;
    code: string;
    language: string;
    tokens: string[];
    testCaseResults: TestCaseResult[];
    status: 'Accepted' | 'Wrong Answer' | 'Error';
    createdAt: Date;
    updatedAt: Date;
}

const submissionSchema = new Schema<ISubmission>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    tokens: [{ type: String }],
    testCaseResults: [
        {
            testCaseId: { type: Number, required: true },
            input: { type: String, default: null },
            expectedOutput: { type: String, default: null },
            actualOutput: { type: String, default: null },
            status: { type: String, enum: ['passed', 'failed', 'error'], default: 'Pending' },
            timeTaken: { type: Number, default: 0 },
            memoryUsed: { type: Number, default: 0 },
        }
    ],
    status: {
        type: String,
        enum: ['Accepted', 'Wrong Answer', 'Error', 'Pending'],
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


const leaderboardSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    problemsSolved: { type: Number, default: 0 },
    totalTime: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
})



export const UserModel = mongoose.model('User', userSchema);
export const SubmissionModel = mongoose.model<ISubmission>('Submission', submissionSchema);
export const LeaderboardModel = mongoose.model('leaderboard', leaderboardSchema);

