import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2.49.8';
import * as kv from './kv_store.ts';

const app = new Hono();

// Helper function to get key-value pairs with keys (workaround for kv_store)
async function getByPrefixWithKeys(prefix: string): Promise<Array<{ key: string; value: any }>> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
  
  const { data, error } = await supabase
    .from("kv_store_beba9171")
    .select("key, value")
    .like("key", `${prefix}%`);
    
  if (error) {
    console.error('Error in getByPrefixWithKeys:', error);
    throw new Error(error.message);
  }
  
  return data ?? [];
}

app.use('*', cors());
app.use('*', logger(console.log));

// Helper function to generate unique access code
function generateAccessCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Helper function to evaluate answers using Gemini API
async function evaluateAnswers(questions: any[], answers: any, position: string, resumeText: string): Promise<{ score: number; feedback: string }> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  
  if (!geminiApiKey) {
    console.error('GEMINI_API_KEY not found in environment');
    console.error('Available env vars:', Object.keys(Deno.env.toObject()));
    throw new Error('Gemini API key not configured. Please add GEMINI_API_KEY to Supabase Edge Functions environment variables.');
  }

  console.log('GEMINI_API_KEY found:', geminiApiKey.substring(0, 10) + '...');

  // Construct the evaluation prompt
  const qaText = questions.map((q, idx) => {
    return `Question ${idx + 1}: ${q.question}\nAnswer: ${answers[q.id] || 'No answer provided'}`;
  }).join('\n\n');

  const prompt = `You are an expert technical interviewer. Evaluate the following candidate's answers for the position of "${position}".

Candidate Resume Summary:
${resumeText}

Interview Questions and Answers:
${qaText}

Scoring Guidelines:
- Each question is worth equal points
- Total score must be out of 20
- Consider: relevance, technical accuracy, depth of knowledge, clarity, and practical experience
- Be objective and fair

Provide your evaluation in the following JSON format (respond with ONLY valid JSON, no markdown):
{
  "score": <number between 0-20>,
  "feedback": "<brief overall feedback about the candidate's performance>"
}`;

  // Use the confirmed working model: gemini-2.0-flash-exp
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`;

  try {
    console.log('Using Gemini API endpoint: gemini-2.0-flash-exp (confirmed working)');
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error (${response.status}):`, errorText);
      throw new Error(`Gemini API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response received');
    
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultText) {
      console.error('No text in Gemini response:', JSON.stringify(data));
      throw new Error('No response from Gemini API');
    }

    // Extract JSON from the response (remove markdown code blocks if present)
    let jsonText = resultText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    const evaluation = JSON.parse(jsonText);
    console.log('Evaluation successful:', evaluation);
    
    return {
      score: Math.min(20, Math.max(0, Math.round(evaluation.score))),
      feedback: evaluation.feedback || 'No feedback provided'
    };
  } catch (error) {
    console.error('Error evaluating with Gemini:', error);
    throw new Error(`Failed to evaluate answers: ${error.message}`);
  }
}

// Store candidate submission
app.post('/make-server-beba9171/api/candidates', async (c) => {
  try {
    console.log('Received request to create candidate');
    const body = await c.req.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    // Support both old format (with candidateData wrapper) and new format (direct fields)
    let candidateData;
    let timestamp;
    if (body.candidateData) {
      // Old format from frontend (being phased out)
      candidateData = body.candidateData;
      timestamp = body.timestamp;
    } else {
      // New format from n8n (direct fields)
      candidateData = body;
      timestamp = body.submittedAt || new Date().toISOString();
    }
    if (!candidateData.candidateEmail) {
      console.error('Missing candidateEmail');
      console.error('Received data:', JSON.stringify(candidateData, null, 2));
      return c.json({
        error: 'Missing candidateEmail',
        receivedFields: Object.keys(candidateData)
      }, 400);
    }
    // Check if access code is provided (from n8n) or generate new one
    const accessCode = candidateData.accessCode || generateAccessCode();
    console.log(`Access code: ${accessCode}`);
    // Check if questions are provided (from n8n)
    const hasQuestions = candidateData.questions && Array.isArray(candidateData.questions) && candidateData.questions.length > 0;
    // Determine questionnaire status
    const questionnaireStatus = hasQuestions ? 'ready' : 'waiting_for_questions';
    console.log(`Questions provided: ${hasQuestions}, Status: ${questionnaireStatus}`);
    // Store candidate with key: candidate:{timestamp}:{email}
    const key = `candidate:${timestamp}:${candidateData.candidateEmail}`;
    const candidateWithCode = {
      ...candidateData,
      key,
      accessCode,
      questionnaireStatus,
      submittedAt: timestamp
    };
    console.log(`Storing candidate with key: ${key}`);
    await kv.set(key, candidateWithCode);
    console.log(`Successfully stored candidate: ${key} with access code: ${accessCode}`);
    return c.json({
      success: true,
      key,
      accessCode
    });
  } catch (error) {
    console.error('Error storing candidate:', error);
    console.error('Error stack:', error.stack);
    return c.json({
      error: 'Failed to store candidate data',
      details: String(error),
      message: error.message
    }, 500);
  }
});

// Get all candidates
app.get('/make-server-beba9171/api/candidates', async (c)=>{
  try {
    // Get all candidates by prefix
    const candidateEntries = await getByPrefixWithKeys('candidate:');
    // Filter out any null/undefined entries and ensure they have valid keys
    const validEntries = candidateEntries.filter((entry)=>entry && entry.key && entry.value);
    // Sort by timestamp (descending - newest first)
    const candidates = validEntries.sort((a, b)=>{
      const keyPartsA = a.key.split(':');
      const keyPartsB = b.key.split(':');
      const timestampA = parseInt(keyPartsA[1] || '0');
      const timestampB = parseInt(keyPartsB[1] || '0');
      return timestampB - timestampA;
    }).map((entry)=>{
      // Include the key and ensure email tracking fields exist
      return {
        key: entry.key,
        ...entry.value,
        email_sent: entry.value.email_sent ?? false,
        email_sent_at: entry.value.email_sent_at ?? null,
        recruiter_notified: entry.value.recruiter_notified ?? false,
        recruiter_notified_at: entry.value.recruiter_notified_at ?? null
      };
    });
    return c.json({
      candidates
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return c.json({
      error: 'Failed to fetch candidates',
      details: String(error)
    }, 500);
  }
});

// Update candidate status/score (for when n8n sends back results)
app.patch('/make-server-beba9171/api/candidates/:email', async (c) => {
  try {
    const email = c.req.param('email');
    const body = await c.req.json();
    const { status, score } = body;

    // Find the candidate by email
    const candidateEntries = await getByPrefixWithKeys('candidate:');
    const candidateEntry = candidateEntries.find(entry => 
      entry && entry.value && entry.value.candidateEmail === email
    );

    if (!candidateEntry) {
      return c.json({ error: 'Candidate not found' }, 404);
    }

    // Update the candidate data
    const updatedCandidate = {
      ...candidateEntry.value,
      ...(status && { status }),
      ...(score !== undefined && { score })
    };

    await kv.set(candidateEntry.key, updatedCandidate);

    console.log(`Updated candidate ${email}: status=${status}, score=${score}`);

    return c.json({ success: true, candidate: updatedCandidate });
  } catch (error) {
    console.error('Error updating candidate:', error);
    return c.json({ error: 'Failed to update candidate', details: String(error) }, 500);
  }
});

// Store questions from n8n (after Gemini generates them)
app.post('/make-server-beba9171/api/candidates/:email/questions', async (c) => {
  try {
    const email = c.req.param('email');
    const body = await c.req.json();
    const { questions } = body;

    if (!questions || !Array.isArray(questions)) {
      console.error('Invalid questions format:', questions);
      return c.json({ error: 'Invalid questions format' }, 400);
    }

    // Find the candidate
    const candidateEntries = await getByPrefixWithKeys('candidate:');
    const candidateEntry = candidateEntries.find(entry => 
      entry && entry.value && entry.value.candidateEmail === email
    );

    if (!candidateEntry) {
      console.error(`Candidate not found: ${email}`);
      console.log('Available candidates:', candidateEntries.map(e => e.value?.candidateEmail));
      return c.json({ error: 'Candidate not found' }, 404);
    }

    // Add IDs to questions if not present, preserve all fields
    const questionsWithIds = questions.map((q, idx) => ({
      id: idx + 1,
      question: typeof q === 'string' ? q : q.question,
      points: typeof q === 'object' && q.points ? q.points : 0
    }));

    // Update candidate with questions
    const updatedCandidate = {
      ...candidateEntry.value,
      questions: questionsWithIds,
      questionnaireStatus: 'ready'
    };

    await kv.set(candidateEntry.key, updatedCandidate);

    console.log(`Stored ${questionsWithIds.length} questions for candidate: ${email}`);

    return c.json({ 
      success: true, 
      accessCode: candidateEntry.value.accessCode,
      questionCount: questionsWithIds.length 
    });
  } catch (error) {
    console.error('Error storing questions:', error);
    return c.json({ error: 'Failed to store questions', details: String(error) }, 500);
  }
});

// Get questionnaire by access code
app.get('/make-server-beba9171/api/questionnaire/:accessCode', async (c) => {
  try {
    const accessCode = c.req.param('accessCode').toUpperCase();

    // Find candidate by access code
    const candidateEntries = await getByPrefixWithKeys('candidate:');
    const candidateEntry = candidateEntries.find(entry => 
      entry && entry.value && entry.value.accessCode === accessCode
    );

    if (!candidateEntry) {
      return c.json({ error: 'Invalid access code' }, 404);
    }

    const candidate = candidateEntry.value;

    // Check if questionnaire is ready
    if (candidate.questionnaireStatus === 'waiting_for_questions') {
      return c.json({ 
        error: 'Questionnaire is being prepared. Please try again in a few moments.' 
      }, 404);
    }

    if (candidate.questionnaireStatus === 'completed') {
      return c.json({ 
        message: 'You have already completed this questionnaire',
        candidateName: candidate.candidateName,
        candidateEmail: candidate.candidateEmail,
        position: candidate.position,
        questions: [],
        status: 'completed'
      }, 410);
    }

    return c.json({
      candidateName: candidate.candidateName,
      candidateEmail: candidate.candidateEmail,
      position: candidate.position,
      questions: candidate.questions || [],
      status: candidate.questionnaireStatus
    });
  } catch (error) {
    console.error('Error fetching questionnaire:', error);
    return c.json({ error: 'Failed to fetch questionnaire', details: String(error) }, 500);
  }
});

// Submit questionnaire answers
app.post('/make-server-beba9171/api/questionnaire/:accessCode/submit', async (c) => {
  try {
    const accessCode = c.req.param('accessCode').toUpperCase();
    const body = await c.req.json();
    const { answers } = body;

    // Find candidate by access code
    const candidateEntries = await getByPrefixWithKeys('candidate:');
    const candidateEntry = candidateEntries.find(entry => 
      entry && entry.value && entry.value.accessCode === accessCode
    );

    if (!candidateEntry) {
      return c.json({ error: 'Invalid access code' }, 404);
    }

    const candidate = candidateEntry.value;

    // Check if already completed
    if (candidate.questionnaireStatus === 'completed') {
      return c.json({ error: 'Questionnaire already completed' }, 400);
    }

    // Evaluate answers using Gemini
    console.log('Evaluating answers with Gemini API...');
    const evaluation = await evaluateAnswers(candidate.questions, answers, candidate.position, candidate.resumeText);
    // Determine status based on score (12 out of 20 to qualify)
    const status = evaluation.score >= 12 ? 'shortlisted' : 'rejected';
    // Update candidate
    const updatedCandidate = {
      ...candidate,
      key: candidateEntry.key,
      answers,
      score: evaluation.score,
      feedback: evaluation.feedback,
      status,
      questionnaireStatus: 'completed',
      completedAt: new Date().toISOString()
    };

    await kv.set(candidateEntry.key, updatedCandidate);

    console.log(`Candidate ${candidate.candidateEmail} scored ${evaluation.score}/20 - ${status}`);

    return c.json({
      success: true,
      score: evaluation.score,
      status,
      feedback: evaluation.feedback
    });
  } catch (error) {
    console.error('Error submitting questionnaire:', error);
    return c.json({ error: 'Failed to submit questionnaire', details: String(error) }, 500);
  }
});

// Health check
app.get('/make-server-beba9171/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);