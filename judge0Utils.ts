import axios from 'axios';

const JUDGE0_API_KEY = '1e56935394mshc53fc58227a9182p151a36jsn7c8ed5974db8'; // ⚠ Hardcoded as requested

interface Judge0PollResponse {
    stdout?: string; // Plain text output
    stderr?: string; // Plain text error message
    time: string; // Execution time as a string (e.g., "0.01")
    memory: number; // Memory usage in KB
    status: {
        id: number; // Status ID (e.g., 1 = In Queue, 2 = Processing, 3 = Accepted)
        description: string; // Status description
    };
}

// 🔹 Submit code to Judge0
export async function submitToJudge0(code: string, languageId: number, stdin?: string): Promise<string> {
    const requestData = {
        language_id: languageId,
        source_code: code, // Send plain text, not Base64
        stdin: stdin || "",
        base64_encoded: false // ✅ Consistent setting
    };

    try {
        const response = await axios.post<{ token: string }>(
            'https://judge0-ce.p.rapidapi.com/submissions',
            requestData,
            {
                headers: {
                    'content-type': 'application/json',
                    'x-rapidapi-key': JUDGE0_API_KEY,
                    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
                }
            }
        );

        if (!response.data.token) {
            throw new Error("No token received from Judge0");
        }

        return response.data.token;
    } catch (error) {
        console.error('Error submitting to Judge0:', error);
        throw new Error('Failed to submit code to Judge0');
    }
}

// 🔄 Long polling for results (with exponential backoff)
export async function longPollForResults(tokens: string[]) {
    const results = [];
    const MAX_POLL_ATTEMPTS = 30; // Max attempts
    const BASE_INTERVAL = 1000; // Start with 1s
    const BACKOFF_FACTOR = 1.5; // Increase by 1.5x each attempt

    for (const token of tokens) {
        let result: Judge0PollResponse | null = null;
        let pollAttempts = 0;

        console.log(`⏳ Polling started for token: ${token}`);

        do {
            try {
                console.log(`🔍 Attempt ${pollAttempts + 1} for token: ${token}`);
                const response = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
                    params: { base64_encoded: 'false', fields: '*' }, // ✅ Fixed Base64 inconsistency
                    headers: {
                        'x-rapidapi-key': JUDGE0_API_KEY,
                        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
                    }
                });

                result = response.data as Judge0PollResponse;

                console.log(`✅ Status for ${token}: ${result.status.description}`);

                // Log errors from Judge0
                if (result.stderr) {
                    console.error(`🚨 Judge0 stderr for token ${token}: ${result.stderr}`);
                }

                // Exit if execution is complete (status >= 3)
                if (result.status.id >= 3) {
                    console.log(`🎯 Execution completed for token ${token}`);
                    break;
                }

                // Wait before polling again (exponential backoff)
                const delay = BASE_INTERVAL * Math.pow(BACKOFF_FACTOR, pollAttempts);
                await new Promise(resolve => setTimeout(resolve, delay));
            } catch (error) {
                console.error(`❌ Error polling token ${token}:`, error);
                break; // Exit the loop if there's an error
            }

            pollAttempts++;
        } while ((result?.status.id || 0) < 3 && pollAttempts < MAX_POLL_ATTEMPTS);

        // Handle timeout or incomplete results
        if (!result || pollAttempts >= MAX_POLL_ATTEMPTS) {
            console.error(`⏳ Polling timed out for token ${token}`);
            results.push({
                actualOutput: '',
                errorMessage: 'Polling timed out or failed',
                timeTaken: 0,
                memoryUsed: 0
            });
            continue;
        }

        // Store results
        results.push({
            actualOutput: result.stdout || '',
            errorMessage: result.stderr || null,
            timeTaken: parseFloat(result.time),
            memoryUsed: result.memory
        });
    }

    return results;
}
