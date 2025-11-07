import { Card } from './ui/card';
import { Alert } from './ui/alert';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertTriangle, Copy, Terminal, ExternalLink, CheckCircle, Upload, Code } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';
import { safeCopyToClipboard, showCopyModal } from '../utils/clipboard';

export function DeploymentInstructions() {
  const [copiedItem, setCopiedItem] = useState<string>('');

  const copyToClipboard = async (text: string, label: string) => {
    const success = await safeCopyToClipboard(text);
    
    if (success) {
      setCopiedItem(label);
      toast.success(`${label} copied!`);
      setTimeout(() => setCopiedItem(''), 2000);
    } else {
      // Fallback: Show modal with selectable text
      showCopyModal(text, label);
      toast.info(`Select and copy the ${label}`);
    }
  };

  const projectRef = 'ybivtovbzxyzxklgjnsp';
  const functionName = 'make-server-beba9171';

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Critical Warning */}
      <Alert className="border-red-300 bg-red-50">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <div className="ml-3">
          <h3 className="text-red-900">⚠️ Ignore the 403 Error - It's Expected!</h3>
          <p className="text-red-800 mt-2">
            <strong>The 403 deployment error you see is NORMAL and EXPECTED.</strong> Figma Make's web interface 
            does not have permission to deploy Supabase Edge Functions - this is a platform limitation, not a bug. 
            <strong className="block mt-2">✅ Solution: Deploy manually using the instructions below (5 minutes).</strong>
          </p>
        </div>
      </Alert>

      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-gray-900 mb-2">Edge Function Deployment Guide</h1>
        <p className="text-gray-600">
          Follow these steps to deploy the backend Edge Function to Supabase
        </p>
      </div>

      {/* Method Selection */}
      <Card className="p-6">
        <h2 className="text-gray-900 mb-4">Choose Your Deployment Method</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border-2 border-blue-300 rounded-lg bg-blue-50">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="h-5 w-5 text-blue-600" />
              <h3 className="text-blue-900">Method 1: Supabase CLI</h3>
              <Badge className="bg-green-100 text-green-800">Recommended</Badge>
            </div>
            <p className="text-blue-800 text-sm">
              Deploy using command line. Best for developers familiar with terminal.
            </p>
          </div>
          <div className="p-4 border-2 border-purple-300 rounded-lg bg-purple-50">
            <div className="flex items-center gap-2 mb-2">
              <Upload className="h-5 w-5 text-purple-600" />
              <h3 className="text-purple-900">Method 2: Supabase Dashboard</h3>
            </div>
            <p className="text-purple-800 text-sm">
              Upload files manually through web interface. Easier for beginners.
            </p>
          </div>
        </div>
      </Card>

      {/* Method 1: CLI Deployment */}
      <Card className="p-6 border-l-4 border-l-blue-500">
        <div className="flex items-center gap-3 mb-4">
          <Terminal className="h-6 w-6 text-blue-600" />
          <h2 className="text-gray-900">Method 1: Deploy via Supabase CLI</h2>
        </div>

        <div className="space-y-6">
          {/* Step 1: Install CLI */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">Step 1</Badge>
              <h3 className="text-gray-900">Install Supabase CLI</h3>
            </div>
            <p className="text-gray-600 text-sm">
              If you haven't already, install the Supabase CLI:
            </p>
            <div className="bg-gray-900 p-4 rounded">
              <code className="text-green-400 text-sm">npm install -g supabase</code>
              <Button
                size="sm"
                variant="outline"
                className="ml-4 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                onClick={() => copyToClipboard('npm install -g supabase', 'Install command')}
              >
                <Copy className="h-3 w-3 mr-1" />
                {copiedItem === 'Install command' ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Step 2: Login */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">Step 2</Badge>
              <h3 className="text-gray-900">Login to Supabase</h3>
            </div>
            <div className="bg-gray-900 p-4 rounded">
              <code className="text-green-400 text-sm">supabase login</code>
              <Button
                size="sm"
                variant="outline"
                className="ml-4 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                onClick={() => copyToClipboard('supabase login', 'Login command')}
              >
                <Copy className="h-3 w-3 mr-1" />
                {copiedItem === 'Login command' ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <Alert className="border-yellow-200 bg-yellow-50">
              <p className="text-yellow-900 text-sm">
                This will open your browser for authentication. Login with your Supabase account.
              </p>
            </Alert>
          </div>

          {/* Step 3: Link Project */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">Step 3</Badge>
              <h3 className="text-gray-900">Link Your Project</h3>
            </div>
            <div className="bg-gray-900 p-4 rounded">
              <code className="text-green-400 text-sm">{`supabase link --project-ref ${projectRef}`}</code>
              <Button
                size="sm"
                variant="outline"
                className="ml-4 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                onClick={() => copyToClipboard(`supabase link --project-ref ${projectRef}`, 'Link command')}
              >
                <Copy className="h-3 w-3 mr-1" />
                {copiedItem === 'Link command' ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Step 4: Set Environment Variables */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">Step 4</Badge>
              <h3 className="text-gray-900">Set Gemini API Key</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Get your Gemini API key from{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                Google AI Studio <ExternalLink className="h-3 w-3" />
              </a>
              , then set it:
            </p>
            <div className="bg-gray-900 p-4 rounded">
              <code className="text-green-400 text-sm">supabase secrets set GEMINI_API_KEY=your_api_key_here</code>
              <Button
                size="sm"
                variant="outline"
                className="ml-4 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                onClick={() => copyToClipboard('supabase secrets set GEMINI_API_KEY=', 'Secrets command')}
              >
                <Copy className="h-3 w-3 mr-1" />
                {copiedItem === 'Secrets command' ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <Alert className="border-orange-200 bg-orange-50">
              <p className="text-orange-900 text-sm">
                <strong>Important:</strong> Replace <code>your_api_key_here</code> with your actual Gemini API key
              </p>
            </Alert>
          </div>

          {/* Step 5: Create Function Directory */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">Step 5</Badge>
              <h3 className="text-gray-900">Create Local Function Files</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Create the function directory structure:
            </p>
            <div className="bg-gray-900 p-4 rounded space-y-2">
              <div>
                <code className="text-green-400 text-sm block">mkdir -p supabase/functions/{functionName}</code>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                copyToClipboard(`mkdir -p supabase/functions/${functionName}`, 'Directory command');
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Command
            </Button>
          </div>

          {/* Step 6: Copy Function Code */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">Step 6</Badge>
              <h3 className="text-gray-900">Copy Function Files</h3>
            </div>
            <p className="text-gray-600 text-sm mb-2">
              Copy the Edge Function code from this project to your local directory.
              You need 2 files:
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open('#view-index', '_self')}
              >
                <Code className="h-4 w-4 mr-2" />
                View index.ts (main function code) ✅
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open('#view-kv', '_self')}
              >
                <Code className="h-4 w-4 mr-2" />
                View kv_store.ts (database helper) ✅
              </Button>
            </div>
            <Alert className="border-blue-200 bg-blue-50">
              <p className="text-blue-900 text-sm">
                Copy these files to: <code>supabase/functions/{functionName}/index.ts</code> and <code>kv_store.ts</code>
              </p>
            </Alert>
          </div>

          {/* Step 7: Deploy */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">Step 7</Badge>
              <h3 className="text-gray-900">Deploy the Function</h3>
            </div>
            <div className="bg-gray-900 p-4 rounded">
              <code className="text-green-400 text-sm">{`supabase functions deploy ${functionName}`}</code>
              <Button
                size="sm"
                variant="outline"
                className="ml-4 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                onClick={() => copyToClipboard(`supabase functions deploy ${functionName}`, 'Deploy command')}
              >
                <Copy className="h-3 w-3 mr-1" />
                {copiedItem === 'Deploy command' ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="text-green-900 ml-3 text-sm">
                If successful, you'll see "Function deployed successfully!"
              </p>
            </Alert>
          </div>

          {/* All Commands at Once */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-2 border-blue-200">
            <h4 className="text-gray-900 mb-3 flex items-center gap-2">
              <Terminal className="h-5 w-5 text-blue-600" />
              Quick Copy: All Commands
            </h4>
            <pre className="bg-gray-900 p-4 rounded text-sm text-green-400 overflow-x-auto">
{`# Install CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref ${projectRef}

# Set API key (replace with your actual key)
supabase secrets set GEMINI_API_KEY=your_api_key_here

# Create directory
mkdir -p supabase/functions/${functionName}

# (Copy index.ts and kv_store.ts to the directory)

# Deploy
supabase functions deploy ${functionName}`}
            </pre>
            <Button
              variant="outline"
              className="mt-3"
              onClick={() => {
                const allCommands = `npm install -g supabase\nsupabase login\nsupabase link --project-ref ${projectRef}\nsupabase secrets set GEMINI_API_KEY=your_api_key_here\nmkdir -p supabase/functions/${functionName}\nsupabase functions deploy ${functionName}`;
                copyToClipboard(allCommands, 'All commands');
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy All Commands
            </Button>
          </div>
        </div>
      </Card>

      {/* Method 2: Dashboard Upload */}
      <Card className="p-6 border-l-4 border-l-purple-500">
        <div className="flex items-center gap-3 mb-4">
          <Upload className="h-6 w-6 text-purple-600" />
          <h2 className="text-gray-900">Method 2: Deploy via Supabase Dashboard</h2>
        </div>

        <div className="space-y-4">
          <Alert className="border-purple-200 bg-purple-50">
            <p className="text-purple-900 text-sm">
              This method is simpler but requires manual file uploads through the web interface.
            </p>
          </Alert>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-800">Step 1</Badge>
              <h3 className="text-gray-900">Open Supabase Dashboard</h3>
            </div>
            <Button
              variant="outline"
              onClick={() => window.open(`https://supabase.com/dashboard/project/${projectRef}/functions`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Edge Functions Dashboard
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-800">Step 2</Badge>
              <h3 className="text-gray-900">Create New Function</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Click "Create a new function" and name it: <code className="bg-gray-100 px-2 py-1 rounded">{functionName}</code>
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-800">Step 3</Badge>
              <h3 className="text-gray-900">Upload Function Files</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Copy the code from index.ts and kv_store.ts (see buttons above) and paste into the editor.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-800">Step 4</Badge>
              <h3 className="text-gray-900">Set Environment Variables</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Go to Settings → Edge Functions → Add secret:
            </p>
            <div className="bg-gray-100 p-3 rounded">
              <p className="text-sm"><strong>Name:</strong> GEMINI_API_KEY</p>
              <p className="text-sm"><strong>Value:</strong> [Your Gemini API key]</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">Step 5</Badge>
              <h3 className="text-gray-900">Deploy</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Click "Deploy" button and wait for deployment to complete.
            </p>
          </div>
        </div>
      </Card>

      {/* Verification */}
      <Card className="p-6 bg-green-50 border-green-200">
        <h3 className="text-green-900 mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Verify Deployment
        </h3>
        <div className="space-y-3">
          <p className="text-green-900 text-sm">
            After deployment, test if the function is working:
          </p>
          <Button
            onClick={() => {
              fetch(`https://${projectRef}.supabase.co/functions/v1/${functionName}/health`)
                .then(res => res.json())
                .then(data => {
                  toast.success('✅ Edge Function is deployed and running!');
                  console.log('Health check response:', data);
                })
                .catch(err => {
                  toast.error('❌ Edge Function not accessible. Check deployment.');
                  console.error('Health check error:', err);
                });
            }}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Test Edge Function Health
          </Button>
        </div>
      </Card>

      {/* Function Code Preview */}
      <Card className="p-6" id="view-index">
        <h3 className="text-gray-900 mb-4">📄 index.tsx (Main Function Code)</h3>
        <div className="bg-gray-900 p-4 rounded max-h-96 overflow-y-auto">
          <pre className="text-green-400 text-xs">
            {`// This is the main Edge Function code
// Copy this entire file to: supabase/functions/${functionName}/index.tsx

See the full code in: /supabase/functions/server/index.tsx`}
          </pre>
        </div>
        <Button
          variant="outline"
          className="mt-3"
          onClick={() => {
            toast.info('Open /supabase/functions/server/index.tsx in your code editor to see the full code');
          }}
        >
          <Code className="h-4 w-4 mr-2" />
          View Full Code in Editor
        </Button>
      </Card>

      <Card className="p-6" id="view-kv">
        <h3 className="text-gray-900 mb-4">📄 kv_store.tsx (Database Helper)</h3>
        <div className="bg-gray-900 p-4 rounded max-h-96 overflow-y-auto">
          <pre className="text-green-400 text-xs">
            {`// Database helper for key-value storage
// Copy this file to: supabase/functions/${functionName}/kv_store.tsx

See the full code in: /supabase/functions/server/kv_store.tsx`}
          </pre>
        </div>
        <Button
          variant="outline"
          className="mt-3"
          onClick={() => {
            toast.info('Open /supabase/functions/server/kv_store.tsx in your code editor to see the full code');
          }}
        >
          <Code className="h-4 w-4 mr-2" />
          View Full Code in Editor
        </Button>
      </Card>

      {/* Help Section */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-blue-900 mb-4">Need Help?</h3>
        <div className="space-y-2 text-sm text-blue-900">
          <p>• Check the <a href="#" onClick={() => window.location.hash = 'troubleshooting'} className="underline">Troubleshooting Guide</a> for common issues</p>
          <p>• Visit <a href="https://supabase.com/docs/guides/functions" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1">Supabase Edge Functions Docs <ExternalLink className="h-3 w-3" /></a></p>
          <p>• Review the <a href="https://github.com/supabase/cli" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1">Supabase CLI Documentation <ExternalLink className="h-3 w-3" /></a></p>
        </div>
      </Card>
    </div>
  );
}
