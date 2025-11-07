import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Alert } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import { Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Question {
  question: string;
  id: number;
}

interface QuestionnaireData {
  candidateName: string;
  candidateEmail: string;
  position: string;
  questions: Question[];
  status: string;
}

export function QuestionnaireAccess() {
  const [accessCode, setAccessCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireData | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);

  const handleVerifyCode = async () => {
    if (!accessCode.trim()) {
      toast.error('Please enter your access code');
      return;
    }

    setIsVerifying(true);
    try {
      const apiBaseUrl = (window as any).API_BASE_URL;
      const apiHeaders = (window as any).API_HEADERS;

      const response = await fetch(`${apiBaseUrl}/api/questionnaire/${accessCode}`, {
        headers: apiHeaders
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          // Show the actual error message from backend
          toast.error(data.error || 'Invalid access code. Please check and try again.');
        } else if (response.status === 410) {
          toast.error(data.message || 'This questionnaire is no longer available');
        } else {
          toast.error(data.error || 'Failed to retrieve questionnaire');
        }
        return;
      }

      const data = await response.json();
      setQuestionnaire(data);
      
      // Initialize answers object
      const initialAnswers: { [key: number]: string } = {};
      data.questions.forEach((q: Question) => {
        initialAnswers[q.id] = '';
      });
      setAnswers(initialAnswers);
      
      toast.success('Questionnaire loaded successfully!');
    } catch (error) {
      console.error('Error verifying access code:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitAnswers = async () => {
    // Validate all questions are answered
    const unanswered = questionnaire?.questions.filter(q => !answers[q.id]?.trim());
    if (unanswered && unanswered.length > 0) {
      toast.error('Please answer all questions before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const apiBaseUrl = (window as any).API_BASE_URL;
      const apiHeaders = (window as any).API_HEADERS;

      const response = await fetch(`${apiBaseUrl}/api/questionnaire/${accessCode}/submit`, {
        method: 'POST',
        headers: {
          ...apiHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Submit error:', errorData);
        
        // Check if it's a Gemini API key issue
        if (errorData.error && errorData.error.includes('Gemini API key not configured')) {
          toast.error('Configuration Error: Gemini API key not set. Please contact administrator.');
        } else if (errorData.details && errorData.details.includes('404')) {
          toast.error('Gemini 404 Error: Click the "Fix 404 Error" tab to redeploy Edge Function with correct endpoint.', {
            duration: 8000,
          });
        } else {
          toast.error(errorData.error || errorData.message || 'Failed to submit answers');
        }
        return;
      }

      const result = await response.json();
      setSubmissionComplete(true);
      
      if (result.status === 'shortlisted') {
        toast.success(`Congratulations! You scored ${result.score}/20 and have been shortlisted! 🎉`);
      } else {
        toast.info(`Thank you for your submission. You scored ${result.score}/20.`);
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-green-600 mb-4">Submission Complete!</h2>
          <p className="text-gray-700 mb-6">
            Thank you for completing the questionnaire. You will receive an email notification 
            with the results shortly.
          </p>
          <Button 
            onClick={() => {
              setSubmissionComplete(false);
              setQuestionnaire(null);
              setAccessCode('');
              setAnswers({});
            }}
            variant="outline"
          >
            Submit Another Response
          </Button>
        </Card>
      </div>
    );
  }

  if (!questionnaire) {
    return (
      <div className="max-w-xl mx-auto">
        <Card className="p-8">
          <div className="text-center mb-6">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-gray-900 mb-2">Access Your Questionnaire</h2>
            <p className="text-gray-600">
              Enter the access code sent to your email to begin the interview questionnaire.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="accessCode">Access Code</Label>
              <Input
                id="accessCode"
                placeholder="Enter your 8-character access code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                className="font-mono text-center uppercase"
                maxLength={8}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleVerifyCode();
                  }
                }}
              />
            </div>

            <Button 
              onClick={handleVerifyCode} 
              disabled={isVerifying || !accessCode.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isVerifying ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                'Access Questionnaire'
              )}
            </Button>
          </div>

          <Alert className="mt-6 border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <div className="ml-3 text-blue-800 text-sm">
              Check your email for the access code. If you haven't received it, please check your spam folder.
            </div>
          </Alert>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-8">
        {/* Header */}
        <div className="border-b pb-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-gray-900 mb-1">Interview Questionnaire</h2>
              <p className="text-gray-600">Position: {questionnaire.position}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Candidate</div>
              <div className="text-gray-900">{questionnaire.candidateName}</div>
            </div>
          </div>
          
          {questionnaire.status === 'completed' ? (
            <Alert className="border-amber-200 bg-amber-50">
              <Clock className="h-4 w-4 text-amber-600" />
              <div className="ml-3 text-amber-800 text-sm">
                You have already completed this questionnaire. Duplicate submissions are not allowed.
              </div>
            </Alert>
          ) : (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <div className="ml-3 text-blue-800 text-sm">
                Please answer all questions thoughtfully. Your responses will be evaluated automatically.
              </div>
            </Alert>
          )}
        </div>

        {/* Questions */}
        {questionnaire.status !== 'completed' && (
          <div className="space-y-6 mb-8">
            {questionnaire.questions.map((q, index) => (
              <div key={q.id} className="space-y-2">
                <Label htmlFor={`q-${q.id}`}>
                  <span className="text-blue-600 mr-2">Question {index + 1}:</span>
                  {q.question}
                </Label>
                <Textarea
                  id={`q-${q.id}`}
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  placeholder="Type your answer here..."
                  rows={4}
                  className="resize-none"
                />
                <div className="text-xs text-gray-500 text-right">
                  {answers[q.id]?.length || 0} characters
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        {questionnaire.status !== 'completed' && (
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setQuestionnaire(null);
                setAccessCode('');
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitAnswers}
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Answers
                </>
              )}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
