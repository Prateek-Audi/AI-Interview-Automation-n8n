import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Alert } from './ui/alert';
import { GeminiApiTest } from './GeminiApiTest';
import { toast } from 'sonner@2.0.3';
import { Key, AlertCircle, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { safeCopyToClipboard, showCopyModal } from '../utils/clipboard';

export function ApiKeySettings() {
  const [geminiKey, setGeminiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState(
    localStorage.getItem('n8n_webhook_url') || 'https://prateek1234-audi.app.n8n.cloud/webhook/candidate-interview'
  );
  const [copied, setCopied] = useState(false);

  const handleWebhookSave = () => {
    localStorage.setItem('n8n_webhook_url', webhookUrl);
    toast.success('Webhook URL saved!');
  };

  const handleCopyGeminiInstructions = async () => {
    const instructions = `GEMINI_API_KEY=${geminiKey || 'YOUR_GEMINI_API_KEY'}`;
    const success = await safeCopyToClipboard(instructions);

    if (success) {
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      showCopyModal(instructions, 'Gemini API Key Setup');
      toast.info('Select and copy the text');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Info Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <div className="ml-3">
          <h3 className="text-blue-900">Configuration Required</h3>
          <p className="text-blue-800 mt-1">
            Set up your Gemini API key and n8n webhook URL to enable the automated interview workflow.
          </p>
        </div>
      </Alert>

      {/* API Connection Test */}
      <GeminiApiTest />

      {/* Gemini API Key */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-purple-600" />
            <h2 className="text-purple-900">Gemini API Configuration</h2>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="geminiKey">Gemini API Key</Label>
              <Input
                id="geminiKey"
                type="password"
                placeholder="Enter your Gemini API key"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
              />
              <p className="text-gray-600 text-sm">
                Get your API key from{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Google AI Studio
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>

            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <div className="ml-3">
                <h4 className="text-orange-900">Add to Supabase Environment</h4>
                <div className="text-orange-800 mt-2 space-y-2">
                  <p>1. Go to your Supabase Dashboard → Edge Functions → Settings</p>
                  <p>2. Add this environment variable:</p>
                  <div className="bg-orange-100 p-3 rounded mt-2 flex items-center justify-between gap-2">
                    <code className="text-sm flex-1">
                      GEMINI_API_KEY={geminiKey || 'YOUR_GEMINI_API_KEY'}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyGeminiInstructions}
                      className="shrink-0"
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm">3. Restart your Edge Function for changes to take effect</p>
                </div>
              </div>
            </Alert>
          </div>
        </div>
      </Card>

      {/* Webhook URL */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-blue-600" />
            <h2 className="text-blue-900">n8n Webhook URL</h2>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                type="url"
                placeholder="https://your-n8n-instance.app.n8n.cloud/webhook/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <p className="text-gray-600 text-sm">
                Your n8n workflow webhook URL that handles candidate submissions
              </p>
            </div>

            <Button onClick={handleWebhookSave} className="bg-blue-600 hover:bg-blue-700">
              Save Webhook URL
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Setup Checklist */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-gray-900 mb-4">Quick Setup Checklist</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            <span>Get Gemini API key from Google AI Studio</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            <span>Add GEMINI_API_KEY to Supabase Edge Functions environment variables</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            <span>Deploy backend code to Supabase (see /supabase/functions/server/)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            <span>Create and activate n8n workflow</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            <span>Save n8n webhook URL in this settings panel</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
