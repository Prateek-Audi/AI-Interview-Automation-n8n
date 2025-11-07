import { Card } from './ui/card';
import { Alert } from './ui/alert';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle, XCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useState, useEffect } from 'react';
import { safeCopyToClipboard, showCopyModal } from '../utils/clipboard';

interface TroubleshootingGuideProps {
  webhookUrl: string;
  geminiApiKey?: string;
}

export function TroubleshootingGuide({ webhookUrl, geminiApiKey }: TroubleshootingGuideProps) {
  const [testResults, setTestResults] = useState({
    webhookConfigured: false,
    webhookReachable: false,
    geminiConfigured: false,
    edgeFunctionDeployed: false,
  });
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    checkConfiguration();
  }, [webhookUrl, geminiApiKey]);

  const checkConfiguration = () => {
    setTestResults({
      webhookConfigured: webhookUrl !== 'YOUR_N8N_WEBHOOK_URL_HERE' && webhookUrl.length > 0,
      webhookReachable: false, // Will be tested separately
      geminiConfigured: !!geminiApiKey && geminiApiKey.length > 0,
      edgeFunctionDeployed: false, // Will be tested separately
    });
  };

  const testWebhook = async () => {
    if (!testResults.webhookConfigured) {
      toast.error('Webhook URL not configured');
      return;
    }

    setIsTesting(true);
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateName: 'Test User',
          candidateEmail: 'test@example.com',
          position: 'Test Position',
          resumeText: 'Test resume text',
        })
      });

      if (response.ok) {
        setTestResults(prev => ({ ...prev, webhookReachable: true }));
        toast.success('Webhook is reachable!');
      } else {
        const errorText = await response.text();
        setTestResults(prev => ({ ...prev, webhookReachable: false }));
        toast.error(`Webhook error: ${response.status}`);
        console.error('Webhook error:', errorText);
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, webhookReachable: false }));
      toast.error('Failed to reach webhook');
      console.error('Webhook test error:', error);
    } finally {
      setIsTesting(false);
    }
  };

  const testEdgeFunction = async () => {
    setIsTesting(true);
    try {
      const response = await fetch('https://ybivtovbzxyzxklgjnsp.supabase.co/functions/v1/make-server-beba9171/health');
      
      if (response.ok) {
        setTestResults(prev => ({ ...prev, edgeFunctionDeployed: true }));
        toast.success('Edge function is deployed and running!');
      } else {
        setTestResults(prev => ({ ...prev, edgeFunctionDeployed: false }));
        toast.error('Edge function not accessible');
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, edgeFunctionDeployed: false }));
      toast.error('Failed to reach edge function');
      console.error('Edge function test error:', error);
    } finally {
      setIsTesting(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    const success = await safeCopyToClipboard(text);
    
    if (success) {
      toast.success(`${label} copied to clipboard!`);
    } else {
      showCopyModal(text, label);
      toast.info(`Select and copy the ${label}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-gray-900 mb-2">Troubleshooting Guide</h1>
        <p className="text-gray-600">Diagnose and fix common issues with your automated interview workflow</p>
      </div>

      {/* Quick Status Check */}
      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">System Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              {testResults.webhookConfigured ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="text-gray-900">n8n Webhook URL Configured</span>
            </div>
            {testResults.webhookConfigured && (
              <Button size="sm" variant="outline" onClick={testWebhook} disabled={isTesting}>
                Test Connection
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              {testResults.geminiConfigured ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="text-gray-900">Gemini API Key Configured</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span className="text-gray-900">Edge Function Deployed</span>
            </div>
            <Button size="sm" variant="outline" onClick={testEdgeFunction} disabled={isTesting}>
              Test Health
            </Button>
          </div>
        </div>
      </Card>

      {/* Error 1: n8n Webhook 500 Error */}
      <Card className="p-6 border-l-4 border-l-red-500">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Badge className="bg-red-100 text-red-800">ERROR</Badge>
            <div className="flex-1">
              <h3 className="text-gray-900 mb-2">n8n Webhook Error: 500 (Internal Server Error)</h3>
              <p className="text-gray-600 mb-4">
                This means your n8n workflow is failing when it receives candidate data.
              </p>
            </div>
          </div>

          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <div className="ml-3">
              <p className="text-orange-900">
                <strong>Most Common Cause:</strong> The workflow is trying to create a database entry before generating questions.
              </p>
            </div>
          </Alert>

          <div className="space-y-3">
            <h4 className="text-gray-900">Fix Steps:</h4>
            <div className="bg-gray-900 text-gray-100 p-4 rounded space-y-2 text-sm">
              <div>1. Open your n8n workflow editor</div>
              <div>2. Check the execution log to see which node failed</div>
              <div>3. Make sure the workflow order is:</div>
              <div className="ml-4 text-yellow-400">
                Webhook → Generate Questions (Gemini) → Parse Response → Generate Access Code → Create DB Entry → Send Email
              </div>
              <div>4. The "Create DB Entry" node should include the questions in the request body</div>
            </div>

            <div className="bg-blue-50 p-4 rounded">
              <p className="text-blue-900 text-sm mb-2">
                <strong>Correct Webhook Payload Format:</strong>
              </p>
              <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`{
  "candidateName": "John Doe",
  "candidateEmail": "john@example.com",
  "position": "Software Engineer",
  "resumeText": "5 years experience..."
}`}
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => copyToClipboard(JSON.stringify({
                  candidateName: "John Doe",
                  candidateEmail: "john@example.com",
                  position: "Software Engineer",
                  resumeText: "5 years experience..."
                }, null, 2), 'Example payload')}
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Error 2: Gemini API 404 */}
      <Card className="p-6 border-l-4 border-l-purple-500">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Badge className="bg-purple-100 text-purple-800">ERROR</Badge>
            <div className="flex-1">
              <h3 className="text-gray-900 mb-2">Gemini API Request Failed: 404</h3>
              <p className="text-gray-600 mb-4">
                The Gemini API is returning a 404 error. This usually means the API key is invalid or the endpoint is wrong.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-gray-900">Fix Steps:</h4>
            
            <div className="bg-yellow-50 p-4 rounded">
              <p className="text-yellow-900 mb-2">
                <strong>Step 1:</strong> Verify your Gemini API key
              </p>
              <ol className="text-yellow-900 text-sm space-y-1 list-decimal list-inside">
                <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">Google AI Studio <ExternalLink className="h-3 w-3" /></a></li>
                <li>Create or copy your API key</li>
                <li>Add it to your Supabase Edge Function environment variables</li>
              </ol>
            </div>

            <div className="bg-blue-50 p-4 rounded">
              <p className="text-blue-900 mb-2">
                <strong>Step 2:</strong> Set environment variable in Supabase
              </p>
              <div className="space-y-2">
                <p className="text-blue-900 text-sm">Run this command in your terminal:</p>
                <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
supabase secrets set GEMINI_API_KEY=your_actual_api_key_here
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard('supabase secrets set GEMINI_API_KEY=your_actual_api_key_here', 'Command')}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Command
                </Button>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded">
              <p className="text-green-900 mb-2">
                <strong>Step 3:</strong> Use correct API endpoint in n8n
              </p>
              <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY`}
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => copyToClipboard('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY', 'API endpoint')}
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy Endpoint
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Error 3: Deploy 403 */}
      <Card className="p-6 border-l-4 border-l-yellow-500">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Badge className="bg-yellow-100 text-yellow-800">ERROR</Badge>
            <div className="flex-1">
              <h3 className="text-gray-900 mb-2">Deploy Error: 403 Forbidden</h3>
              <p className="text-gray-600 mb-4">
                This is a Supabase deployment permission issue.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-gray-900">Fix Steps:</h4>
            
            <div className="bg-orange-50 p-4 rounded space-y-2">
              <p className="text-orange-900">
                <strong>Option 1:</strong> Deploy via Supabase CLI (Recommended)
              </p>
              <ol className="text-orange-900 text-sm space-y-2 list-decimal list-inside ml-4">
                <li>Install Supabase CLI if you haven't: <code className="bg-white px-2 py-1 rounded">npm install -g supabase</code></li>
                <li>Login: <code className="bg-white px-2 py-1 rounded">supabase login</code></li>
                <li>Link your project: <code className="bg-white px-2 py-1 rounded">supabase link --project-ref ybivtovbzxyzxklgjnsp</code></li>
                <li>Set the Gemini API key: <code className="bg-white px-2 py-1 rounded">supabase secrets set GEMINI_API_KEY=your_key</code></li>
                <li>Deploy: <code className="bg-white px-2 py-1 rounded">supabase functions deploy make-server-beba9171</code></li>
              </ol>
            </div>

            <div className="bg-blue-50 p-4 rounded">
              <p className="text-blue-900 mb-2">
                <strong>Option 2:</strong> Deploy via Supabase Dashboard
              </p>
              <ol className="text-blue-900 text-sm space-y-1 list-decimal list-inside ml-4">
                <li>Go to your Supabase project dashboard</li>
                <li>Navigate to Edge Functions</li>
                <li>Upload the function files manually</li>
                <li>Set environment variables in the dashboard</li>
              </ol>
            </div>
          </div>
        </div>
      </Card>

      {/* Testing Checklist */}
      <Card className="p-6 bg-green-50 border-green-200">
        <h3 className="text-green-900 mb-4">✅ Testing Checklist</h3>
        <div className="space-y-2 text-sm text-green-900">
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <label>n8n webhook URL is configured in Settings</label>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <label>Gemini API key is set in Supabase Edge Function environment</label>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <label>n8n workflow generates questions BEFORE creating database entry</label>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <label>Edge function is deployed and accessible</label>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <label>Test submission works end-to-end</label>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <label>Email with access code is received</label>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <label>Questionnaire can be accessed with access code</label>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <label>Answers are evaluated and status is updated</label>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={testWebhook}
            disabled={!testResults.webhookConfigured || isTesting}
          >
            Test n8n Webhook
          </Button>
          <Button
            variant="outline"
            onClick={testEdgeFunction}
            disabled={isTesting}
          >
            Test Edge Function
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Get Gemini API Key
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open('https://supabase.com/dashboard/project/ybivtovbzxyzxklgjnsp/functions', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Supabase Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}
