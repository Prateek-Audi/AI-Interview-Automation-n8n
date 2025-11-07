import { useState } from 'react';
import { Card } from './ui/card';
import { Alert } from './ui/alert';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, AlertCircle, Copy, Terminal, Zap } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { safeCopyToClipboard, showCopyModal } from '../utils/clipboard';

export function EdgeFunctionDeploymentGuide() {
  const [copiedItem, setCopiedItem] = useState<string>('');

  const copyToClipboard = async (text: string, label: string) => {
    const success = await safeCopyToClipboard(text);
    
    if (success) {
      setCopiedItem(label);
      toast.success(`${label} copied!`);
      setTimeout(() => setCopiedItem(''), 2000);
    } else {
      showCopyModal(text, label);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <Zap className="h-5 w-5 text-blue-600" />
        <div className="ml-3">
          <h3 className="text-blue-900">Edge Function Updated</h3>
          <p className="text-blue-800 text-sm mt-1">
            The Edge Function code has been updated to use more reliable Gemini models. You need to redeploy it.
          </p>
        </div>
      </Alert>

      <Card className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <Terminal className="h-5 w-5 text-purple-600 mt-0.5" />
          <div>
            <h3>Redeploy Edge Function</h3>
            <p className="text-gray-600 text-sm mt-1">
              Follow these steps to deploy the updated Edge Function
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-purple-600">Step 1</Badge>
              <h4>Ensure Supabase CLI is installed</h4>
            </div>
            <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs flex items-center justify-between">
              <code>npm install -g supabase</code>
              <Button
                size="sm"
                variant="outline"
                className="ml-4 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                onClick={() => copyToClipboard('npm install -g supabase', 'Install command')}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-purple-600">Step 2</Badge>
              <h4>Link to your Supabase project</h4>
            </div>
            <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs flex items-center justify-between">
              <code>supabase link --project-ref kioibbpfgikmyibhhxfp</code>
              <Button
                size="sm"
                variant="outline"
                className="ml-4 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                onClick={() => copyToClipboard('supabase link --project-ref kioibbpfgikmyibhhxfp', 'Link command')}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-green-600">Step 3</Badge>
              <h4>Deploy the updated Edge Function</h4>
            </div>
            <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs flex items-center justify-between">
              <code>supabase functions deploy make-server-beba9171</code>
              <Button
                size="sm"
                variant="outline"
                className="ml-4 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                onClick={() => copyToClipboard('supabase functions deploy make-server-beba9171', 'Deploy command')}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <Alert className="mt-3 bg-white border-green-300">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="ml-3">
                <p className="text-green-900 text-xs">
                  This will deploy the updated code with the new Gemini model endpoints
                </p>
              </div>
            </Alert>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gray-50">
        <h3 className="mb-3">What Changed?</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>✓ Updated Gemini model names to use stable versions</p>
          <p>✓ Added fallback models: gemini-1.5-flash-latest, gemini-1.5-pro-latest, gemini-pro</p>
          <p>✓ Improved error logging for better debugging</p>
          <p>✓ Removed experimental model that was causing 404 errors</p>
        </div>
      </Card>

      <Alert className="bg-orange-50 border-orange-200">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        <div className="ml-3">
          <p className="text-orange-900 text-sm">
            <strong>Important:</strong> After deployment, test the questionnaire submission again to verify the 404 error is fixed.
          </p>
        </div>
      </Alert>
    </div>
  );
}
