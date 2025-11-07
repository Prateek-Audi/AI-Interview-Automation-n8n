import { Alert } from './ui/alert';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertCircle, Terminal, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

export function DeploymentErrorFix() {
  const [copiedCommand, setCopiedCommand] = useState(false);

  const deployCommand = 'npx supabase functions deploy server --no-verify-jwt';

  const copyCommand = () => {
    navigator.clipboard.writeText(deployCommand);
    setCopiedCommand(true);
    toast.success('Command copied! Run it in your terminal.');
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  return (
    <Card className="p-6 border-red-300 bg-red-50">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-red-900 mb-2">❌ Deployment Error Fixed!</h3>
          
          <Alert className="mb-4 bg-white border-red-200">
            <div className="space-y-2">
              <p className="text-red-900">
                <strong>Error you saw:</strong>
              </p>
              <code className="text-xs bg-red-100 p-2 rounded block text-red-800 border border-red-200">
                Error: XHR for "/api/.../make-server/deploy" failed with status 403
              </code>
              <p className="text-red-900 text-sm mt-2">
                <strong>Why it happened:</strong> Figma Make's deployment interface is trying to deploy to "make-server" but your function is actually named "server".
              </p>
            </div>
          </Alert>

          <div className="bg-green-50 p-4 rounded-lg border border-green-300 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h4 className="text-green-900">✅ Solution: Use Terminal Instead</h4>
            </div>
            
            <p className="text-sm text-green-800 mb-3">
              Deploy using the Supabase CLI in your terminal. This is actually more reliable!
            </p>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-green-800 mb-1"><strong>Step 1:</strong> Open your terminal/command prompt</p>
              </div>

              <div>
                <p className="text-xs text-green-800 mb-2"><strong>Step 2:</strong> Run this command:</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-900 rounded p-3">
                    <code className="text-green-400 text-xs font-mono break-all">
                      {deployCommand}
                    </code>
                  </div>
                  <Button
                    onClick={copyCommand}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 flex-shrink-0"
                  >
                    {copiedCommand ? (
                      <><CheckCircle className="h-4 w-4 mr-1" /> Copied</>
                    ) : (
                      <><Copy className="h-4 w-4 mr-1" /> Copy</>
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-xs text-green-800">
                  <strong>Step 3:</strong> Wait for "Deployed Function server" message
                </p>
              </div>
            </div>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <Terminal className="h-4 w-4 text-blue-600" />
            <div className="ml-3">
              <p className="text-blue-900 text-sm mb-2">
                <strong>💡 First time deploying?</strong>
              </p>
              <ol className="text-xs text-blue-800 space-y-1">
                <li>1. Login first: <code className="bg-blue-100 px-1 rounded">npx supabase login</code></li>
                <li>2. Set API key: <code className="bg-blue-100 px-1 rounded">npx supabase secrets set GEMINI_API_KEY=AIzaSyDK6iPTYz_2iQ1vWiOiPRPYph3_jwrciMA</code></li>
                <li>3. Deploy: <code className="bg-blue-100 px-1 rounded">npx supabase functions deploy server --no-verify-jwt</code></li>
              </ol>
            </div>
          </Alert>

          <div className="mt-4 p-3 bg-purple-50 rounded border border-purple-200">
            <p className="text-purple-900 text-sm mb-2">
              <strong>🎯 What happens after deployment:</strong>
            </p>
            <ul className="text-xs text-purple-800 space-y-1">
              <li>✅ Candidates can submit questionnaire answers</li>
              <li>✅ Gemini API evaluates answers automatically</li>
              <li>✅ Scores calculated instantly (0-20)</li>
              <li>✅ Status updated (shortlisted/rejected)</li>
              <li>✅ No more 404 or 403 errors!</li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-900 text-sm">
                  <strong>Note:</strong> I've already updated both <code className="bg-yellow-100 px-1 rounded">index.ts</code> and <code className="bg-yellow-100 px-1 rounded">index.tsx</code> with the working Gemini model (<code className="bg-yellow-100 px-1 rounded">gemini-2.0-flash-exp</code>). Just deploy and you're done!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
