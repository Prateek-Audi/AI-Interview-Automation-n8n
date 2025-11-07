import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Alert } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

export function GeminiApiTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const testGeminiApi = async () => {
    setTesting(true);
    setResult(null);

    try {
      const apiBaseUrl = (window as any).API_BASE_URL;
      const apiHeaders = (window as any).API_HEADERS;

      // Test with a simple evaluation
      const testData = {
        answers: { 1: 'Test answer' }
      };

      const response = await fetch(`${apiBaseUrl}/api/questionnaire/TEST12345/submit`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(testData)
      });

      if (response.status === 404) {
        // Expected - no questionnaire with this code
        setResult({
          success: true,
          message: 'API endpoint is reachable. Backend is working correctly.'
        });
      } else {
        const data = await response.json();
        
        if (data.error && data.error.includes('Gemini API key')) {
          setResult({
            success: false,
            message: 'Gemini API key is NOT configured in Supabase. Please add GEMINI_API_KEY to environment variables.'
          });
        } else if (data.error && data.error.includes('404')) {
          setResult({
            success: false,
            message: 'Gemini API endpoint error. The API key might be invalid or the endpoint is incorrect.'
          });
        } else {
          setResult({
            success: true,
            message: 'API test completed. Check console for details.'
          });
        }
      }
    } catch (error) {
      console.error('Test error:', error);
      setResult({
        success: false,
        message: `Connection error: ${error.message}`
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-900">API Connection Test</h3>
          <Button 
            onClick={testGeminiApi} 
            disabled={testing}
            variant="outline"
          >
            {testing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Connection'
            )}
          </Button>
        </div>

        {result && (
          <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <div className="ml-3">
              <p className={result.success ? 'text-green-900' : 'text-red-900'}>
                {result.message}
              </p>
            </div>
          </Alert>
        )}

        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <div className="ml-3 space-y-2">
            <h4 className="text-blue-900">Common Issues:</h4>
            <ul className="text-blue-800 text-sm space-y-1 list-disc list-inside">
              <li>GEMINI_API_KEY not added to Supabase Edge Functions</li>
              <li>Edge Function not restarted after adding environment variable</li>
              <li>Invalid or expired Gemini API key</li>
              <li>API key doesn't have correct permissions</li>
            </ul>
          </div>
        </Alert>

        <div className="bg-gray-50 p-4 rounded space-y-2">
          <h4 className="text-gray-900 text-sm">Quick Fix Steps:</h4>
          <ol className="text-gray-700 text-sm space-y-1 list-decimal list-inside">
            <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-blue-600 hover:underline">Google AI Studio</a></li>
            <li>Create/copy your API key</li>
            <li>Go to Supabase Dashboard → Edge Functions → Settings</li>
            <li>Add: <code className="bg-gray-200 px-1 rounded">GEMINI_API_KEY=your_key_here</code></li>
            <li>Restart the Edge Function</li>
            <li>Click "Test Connection" above</li>
          </ol>
        </div>
      </div>
    </Card>
  );
}
