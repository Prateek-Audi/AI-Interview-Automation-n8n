import { AlertCircle, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Card } from './ui/card';

export function Fix404Banner() {
  return (
    <div className="fixed bottom-4 right-4 max-w-md z-50 animate-in slide-in-from-bottom-5">
      <Card className="border-red-500 bg-red-50 shadow-lg">
        <Alert variant="destructive" className="border-0">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg mb-2">🚨 Getting 404 Error on Submit?</AlertTitle>
          <AlertDescription className="space-y-3">
            <p className="text-sm">
              Your Edge Function is using the wrong Gemini API endpoint version.
            </p>
            
            <div className="bg-white/50 p-3 rounded space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="font-bold min-w-[60px]">Problem:</span>
                <span>Using <code className="bg-red-100 px-1 rounded">v1</code> instead of <code className="bg-green-100 px-1 rounded">v1beta</code></span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold min-w-[60px]">Fix:</span>
                <span>Change 3 lines in Supabase Edge Function</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold min-w-[60px]">Time:</span>
                <span>2 minutes</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-sm">Quick Fix Steps:</p>
              <ol className="text-xs space-y-1 pl-4 list-decimal">
                <li>Go to Supabase Dashboard → Functions → server</li>
                <li>Click "Edit function"</li>
                <li>Find line ~80: <code className="bg-white px-1 rounded">v1/models/gemini</code></li>
                <li>Change all <code className="bg-red-100 px-1 rounded">v1</code> to <code className="bg-green-100 px-1 rounded">v1beta</code></li>
                <li>Click "Deploy"</li>
              </ol>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="default"
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={() => {
                  window.open('https://supabase.com/dashboard/project/kioibbpfgikmyibhhxfp/functions', '_blank');
                }}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Open Supabase
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  window.open('/FIX_404_ERROR.txt', '_blank');
                }}
              >
                View Guide
              </Button>
            </div>

            <p className="text-xs italic mt-2">
              💡 See <code className="bg-white px-1 rounded">/FIX_404_ERROR.txt</code> or <code className="bg-white px-1 rounded">/QUICK_FIX_VISUAL_GUIDE.md</code> for detailed instructions
            </p>
          </AlertDescription>
        </Alert>
      </Card>
    </div>
  );
}

export function SystemHealthIndicator() {
  const [status, setStatus] = React.useState<'checking' | 'healthy' | 'error'>('checking');
  
  React.useEffect(() => {
    // Check system health
    const checkHealth = async () => {
      try {
        const response = await fetch(
          'https://kioibbpfgikmyibhhxfp.supabase.co/functions/v1/make-server-beba9171/health'
        );
        if (response.ok) {
          setStatus('healthy');
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
      }
    };
    
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  if (status === 'checking') return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      {status === 'healthy' ? (
        <Alert className="border-green-500 bg-green-50 max-w-xs">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-sm text-green-800">System Healthy</AlertTitle>
          <AlertDescription className="text-xs text-green-700">
            Edge Functions are responding normally
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-yellow-500 bg-yellow-50 max-w-xs">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-sm text-yellow-800">Edge Function Issue</AlertTitle>
          <AlertDescription className="text-xs text-yellow-700">
            Check Supabase deployment
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

import React from 'react';
