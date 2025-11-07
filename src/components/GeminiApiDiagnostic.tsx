import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Alert } from './ui/alert';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, AlertCircle, Loader2, Terminal } from 'lucide-react';

export function GeminiApiDiagnostic() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [currentModel, setCurrentModel] = useState('');

  const testConfigs = [
    { model: 'gemini-2.0-flash-exp', version: 'v1beta', inUse: true },
    { model: 'gemini-1.5-flash-latest', version: 'v1beta', inUse: false },
    { model: 'gemini-1.5-flash', version: 'v1beta', inUse: false },
    { model: 'gemini-1.5-flash', version: 'v1', inUse: false },
    { model: 'gemini-1.5-pro-latest', version: 'v1beta', inUse: false },
    { model: 'gemini-1.5-pro', version: 'v1beta', inUse: false },
    { model: 'gemini-pro', version: 'v1beta', inUse: false },
    { model: 'gemini-pro', version: 'v1', inUse: false },
  ];

  const testGeminiApi = async () => {
    setTesting(true);
    setResults([]);
    
    const apiKey = 'AIzaSyDK6iPTYz_2iQ1vWiOiPRPYph3_jwrciMA';

    for (const config of testConfigs) {
      setCurrentModel(`${config.model} (${config.version})`);
      
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/${config.version}/models/${config.model}:generateContent?key=${apiKey}`;
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: 'Say "test successful" if you receive this.'
              }]
            }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 50,
            }
          })
        });

        const data = await response.json();

        if (response.ok) {
          const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          setResults(prev => [...prev, {
            model: config.model,
            version: config.version,
            status: 'success',
            statusCode: response.status,
            response: responseText,
            url: apiUrl.replace(apiKey, 'YOUR_API_KEY'),
            inUse: config.inUse
          }]);
        } else {
          setResults(prev => [...prev, {
            model: config.model,
            version: config.version,
            status: 'error',
            statusCode: response.status,
            error: data.error?.message || JSON.stringify(data).substring(0, 200),
            url: apiUrl.replace(apiKey, 'YOUR_API_KEY'),
            inUse: config.inUse
          }]);
        }
      } catch (error: any) {
        setResults(prev => [...prev, {
          model: config.model,
          version: config.version,
          status: 'error',
          error: error.message,
          url: `https://generativelanguage.googleapis.com/${config.version}/models/${config.model}:generateContent?key=YOUR_API_KEY`,
          inUse: config.inUse
        }]);
      }

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setTesting(false);
    setCurrentModel('');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="mb-4 flex items-center gap-2">
          <Terminal className="h-5 w-5 text-blue-600" />
          Gemini API Diagnostic Tool
        </h3>
        
        <p className="text-sm text-gray-600 mb-4">
          This tool tests different Gemini models to find which one works with your API key.
        </p>

        <Button 
          onClick={testGeminiApi} 
          disabled={testing}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {testing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing {currentModel}...
            </>
          ) : (
            'Test All Models'
          )}
        </Button>
      </Card>

      {results.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4">Test Results</h3>
          
          <div className="space-y-3">
            {results.map((result, idx) => (
              <div key={idx} className={`border rounded-lg p-4 ${result.inUse ? 'border-2 border-blue-500 bg-blue-50' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {result.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <code className="text-sm font-mono">{result.model}</code>
                      <Badge className="ml-2 bg-gray-600" variant="outline">
                        {result.version}
                      </Badge>
                      {result.inUse && (
                        <Badge className="ml-2 bg-blue-600">
                          ✓ Currently Used in Edge Function
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge 
                    className={result.status === 'success' ? 'bg-green-600' : 'bg-red-600'}
                  >
                    {result.statusCode || 'Network Error'}
                  </Badge>
                </div>

                {/* Show URL being tested */}
                <div className="mb-2 bg-gray-100 p-2 rounded">
                  <p className="text-xs text-gray-600 mb-1">URL tested:</p>
                  <code className="text-xs text-gray-800 break-all">{result.url}</code>
                </div>

                {result.status === 'success' ? (
                  <div className="bg-green-50 p-3 rounded text-sm">
                    <p className="text-green-900"><strong>✓ Success!</strong></p>
                    <p className="text-green-700 text-xs mt-1">Response: {result.response}</p>
                  </div>
                ) : (
                  <div className="bg-red-50 p-3 rounded text-sm">
                    <p className="text-red-900"><strong>✗ Failed</strong></p>
                    <p className="text-red-700 text-xs mt-1 font-mono break-all">{result.error}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-4 border-t">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <div className="ml-3">
                <p className="text-blue-900 text-sm">
                  <strong>Working Models:</strong> {results.filter(r => r.status === 'success').length} / {results.length}
                </p>
                {results.find(r => r.status === 'success') && (
                  <p className="text-blue-700 text-xs mt-2">
                    ✓ Your API key works! Use model: <code className="bg-blue-100 px-2 py-0.5 rounded">
                      {results.find(r => r.status === 'success')?.model}
                    </code>
                  </p>
                )}
              </div>
            </Alert>
          </div>
        </Card>
      )}

      <Card className="p-6 bg-gray-50">
        <h3 className="mb-3">What This Tests</h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>• Tests {testConfigs.length} different model/version combinations</li>
          <li>• Tests both <code className="bg-gray-200 px-1 rounded">/v1/</code> and <code className="bg-gray-200 px-1 rounded">/v1beta/</code> endpoints</li>
          <li>• Uses your actual API key: AIzaSyDK6iPTYz_2iQ1vWiOiPRPYph3_jwrciMA</li>
          <li>• Checks which models return HTTP 200 (success)</li>
          <li>• Shows the exact URL being tested</li>
          <li>• Shows error messages for failed requests</li>
          <li>• Helps identify which model to use in Edge Function</li>
        </ul>
      </Card>
    </div>
  );
}
