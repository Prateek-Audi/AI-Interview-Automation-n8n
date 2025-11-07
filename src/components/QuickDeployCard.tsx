import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Terminal, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

export function QuickDeployCard() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const commands = [
    {
      step: 1,
      title: 'Login to Supabase',
      command: 'npx supabase login',
      description: 'Authenticate with your Supabase account'
    },
    {
      step: 2,
      title: 'Deploy Edge Function',
      command: 'npx supabase functions deploy server --no-verify-jwt',
      description: 'Upload the updated evaluation code'
    },
    {
      step: 3,
      title: 'Set API Key',
      command: 'npx supabase secrets set GEMINI_API_KEY=AIzaSyDK6iPTYz_2iQ1vWiOiPRPYph3_jwrciMA',
      description: 'Configure Gemini API authentication'
    }
  ];

  const copyCommand = (command: string, step: number) => {
    navigator.clipboard.writeText(command);
    setCopiedStep(step);
    toast.success(`Step ${step} command copied!`);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const copyAllCommands = () => {
    const allCommands = commands.map(c => c.command).join('\n');
    navigator.clipboard.writeText(allCommands);
    toast.success('All commands copied! Paste in terminal.');
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Terminal className="h-6 w-6 text-emerald-600" />
          <div>
            <h3 className="text-emerald-900">🚀 Deploy in 3 Commands (Use Terminal!)</h3>
            <p className="text-sm text-emerald-700">Don't use Figma deploy button - use terminal instead</p>
          </div>
        </div>
        <Button 
          onClick={copyAllCommands}
          className="bg-emerald-600 hover:bg-emerald-700"
          size="sm"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy All
        </Button>
      </div>

      <div className="space-y-3">
        {commands.map(({ step, title, command, description }) => (
          <div 
            key={step}
            className="bg-white rounded-lg p-4 border border-emerald-200 hover:border-emerald-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <Badge className="bg-emerald-600 h-8 w-8 rounded-full flex items-center justify-center p-0">
                  {step}
                </Badge>
                <div>
                  <p className="text-emerald-900">{title}</p>
                  <p className="text-xs text-emerald-600">{description}</p>
                </div>
              </div>
              <Button
                onClick={() => copyCommand(command, step)}
                variant="outline"
                size="sm"
                className="border-emerald-300 hover:bg-emerald-100"
              >
                {copiedStep === step ? (
                  <><CheckCircle className="h-4 w-4 mr-1 text-green-600" /> Copied</>
                ) : (
                  <><Copy className="h-4 w-4 mr-1" /> Copy</>
                )}
              </Button>
            </div>
            
            <div className="bg-gray-900 rounded p-3 mt-2">
              <code className="text-green-400 text-xs font-mono break-all">
                {command}
              </code>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-2">
          <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-900 text-sm">
              <strong>After deployment:</strong>
            </p>
            <ul className="text-blue-800 text-xs mt-1 space-y-1">
              <li>• Answer evaluation will use <code className="bg-blue-100 px-1 rounded">gemini-2.0-flash-exp</code></li>
              <li>• No more 404 or 403 errors when submitting answers</li>
              <li>• Candidates get instant scores and feedback</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-orange-900 text-xs">
              <strong>⚠️ Important:</strong> If you see a "Deploy" button in Figma Make, <strong>don't use it</strong>. It causes 403 errors. Always use the terminal commands above instead.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
