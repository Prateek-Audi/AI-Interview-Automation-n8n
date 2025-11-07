import { Card } from './ui/card';
import { Button } from './ui/button';
import { Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { safeCopyToClipboard, showCopyModal } from '../utils/clipboard';

export function ApiRequestExamples() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    const success = await safeCopyToClipboard(text);
    
    if (success) {
      setCopiedIndex(index);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      showCopyModal(text, 'API Request Example');
      toast.info('Select and copy the text');
    }
  };

  const geminiRequest = `{
  "contents": [{
    "parts": [{
      "text": "Generate 10 technical interview questions for {{ $json.position }} position. Consider the candidate's experience: {{ $json.resumeText }}. Return ONLY a JSON array in this exact format: [{\\"id\\": 1, \\"question\\": \\"Your question here?\\"}, ...]. No markdown, no code blocks, just pure JSON array."
    }]
  }],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 1000
  }
}`;

  const parseCode = `const response = $input.item.json;
const geminiText = response.candidates[0].content.parts[0].text;

// Remove markdown code blocks if present
let cleanText = geminiText.trim();
if (cleanText.startsWith('\`\`\`json')) {
  cleanText = cleanText.replace(/\`\`\`json\\n?/g, '').replace(/\`\`\`/g, '');
} else if (cleanText.startsWith('\`\`\`')) {
  cleanText = cleanText.replace(/\`\`\`\\n?/g, '');
}

const questions = JSON.parse(cleanText);

return { json: { questions: questions } };`;

  const accessCodeGen = `const accessCode = Math.random().toString(36).substring(2, 12).toUpperCase();
return { json: { accessCode: accessCode } };`;

  const dbRequest = `{
  "candidateName": "{{ $('Webhook').item.json.candidateName }}",
  "candidateEmail": "{{ $('Webhook').item.json.candidateEmail }}",
  "position": "{{ $('Webhook').item.json.position }}",
  "resumeText": "{{ $('Webhook').item.json.resumeText }}",
  "submittedAt": "{{ $('Webhook').item.json.timestamp }}",
  "accessCode": "{{ $('Generate Access Code').item.json.accessCode }}",
  "questions": {{ $('Parse Gemini Response').item.json.questions }},
  "questionnaireStatus": "ready",
  "status": "pending",
  "score": null
}`;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-gray-900 mb-6">Copy-Paste Ready Code Snippets</h2>

      {/* Gemini Request */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-900">Step 2: Gemini API Request Body</h3>
            <p className="text-sm text-gray-600 mt-1">HTTP Request node → POST method → Body (JSON format)</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard(geminiRequest, 1)}
          >
            {copiedIndex === 1 ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
          {geminiRequest}
        </pre>
        <div className="mt-3 text-sm text-gray-600">
          <strong>URL:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-xs">
            https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=YOUR_API_KEY
          </code>
        </div>
      </Card>

      {/* Parse Response */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-900">Step 3: Parse Gemini Response</h3>
            <p className="text-sm text-gray-600 mt-1">Code node → JavaScript mode</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard(parseCode, 2)}
          >
            {copiedIndex === 2 ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
          {parseCode}
        </pre>
      </Card>

      {/* Access Code Generator */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-900">Step 4: Generate Access Code</h3>
            <p className="text-sm text-gray-600 mt-1">Code node → JavaScript mode</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard(accessCodeGen, 3)}
          >
            {copiedIndex === 3 ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
          {accessCodeGen}
        </pre>
      </Card>

      {/* Database Request */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-900">Step 5: Create Database Entry (CRITICAL)</h3>
            <p className="text-sm text-gray-600 mt-1">HTTP Request node → POST method → Body (JSON format)</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard(dbRequest, 4)}
          >
            {copiedIndex === 4 ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
          {dbRequest}
        </pre>
        <div className="mt-3 space-y-2 text-sm text-gray-600">
          <div>
            <strong>Method:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-xs">POST</code>
          </div>
          <div>
            <strong>URL:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-xs">
              https://ybivtovbzxyzxklgjnsp.supabase.co/functions/v1/make-server-beba9171/api/candidates
            </code>
          </div>
          <div>
            <strong>Headers:</strong>
            <div className="ml-4 mt-1">
              <code className="bg-gray-100 px-2 py-1 rounded text-xs block mb-1">
                Content-Type: application/json
              </code>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs block">
                apikey: YOUR_SUPABASE_ANON_KEY
              </code>
            </div>
          </div>
        </div>
      </Card>

      {/* Important Note */}
      <Card className="p-6 bg-yellow-50 border-yellow-200">
        <h3 className="text-yellow-900 mb-3">⚠️ Critical Points</h3>
        <ul className="space-y-2 text-sm text-yellow-800 list-disc list-inside">
          <li>Node names must match exactly in the expressions (e.g., "Generate Access Code", "Parse Gemini Response")</li>
          <li>The <code className="bg-yellow-100 px-1 rounded">questions</code> field uses double curly braces WITHOUT quotes</li>
          <li>All other string fields use double curly braces WITH quotes</li>
          <li>Make sure each node is connected in the correct order</li>
          <li>Test with n8n's "Execute Node" feature before activating workflow</li>
        </ul>
      </Card>
    </div>
  );
}
