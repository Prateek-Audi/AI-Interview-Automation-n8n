import { Card } from './ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

export function QuickReferenceCard() {
  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <h3 className="text-gray-900 mb-6 text-center">Quick Reference: n8n Workflow</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* DO */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h4 className="text-green-900">✅ DO THIS</h4>
          </div>
          <div className="space-y-3 text-sm">
            <div className="bg-white p-3 rounded border border-green-200">
              <div className="text-green-900 mb-1">1. Generate Questions First</div>
              <code className="text-xs text-green-700">Call Gemini API before DB</code>
            </div>
            
            <div className="bg-white p-3 rounded border border-green-200">
              <div className="text-green-900 mb-1">2. Parse the Response</div>
              <code className="text-xs text-green-700">Extract questions array</code>
            </div>
            
            <div className="bg-white p-3 rounded border border-green-200">
              <div className="text-green-900 mb-1">3. Generate Access Code</div>
              <code className="text-xs text-green-700">Create unique code</code>
            </div>
            
            <div className="bg-white p-3 rounded border border-green-200">
              <div className="text-green-900 mb-1">4. Create DB Entry Once</div>
              <code className="text-xs text-green-700">Include questions + code</code>
            </div>
            
            <div className="bg-white p-3 rounded border border-green-200">
              <div className="text-green-900 mb-1">5. Send Email</div>
              <code className="text-xs text-green-700">With access code</code>
            </div>
          </div>
        </div>

        {/* DON'T */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="h-5 w-5 text-red-600" />
            <h4 className="text-red-900">❌ DON'T DO THIS</h4>
          </div>
          <div className="space-y-3 text-sm">
            <div className="bg-white p-3 rounded border border-red-200">
              <div className="text-red-900 mb-1">❌ Create DB Entry First</div>
              <code className="text-xs text-red-700">Will have no questions</code>
            </div>
            
            <div className="bg-white p-3 rounded border border-red-200">
              <div className="text-red-900 mb-1">❌ Set Status to "waiting"</div>
              <code className="text-xs text-red-700">Should be "ready"</code>
            </div>
            
            <div className="bg-white p-3 rounded border border-red-200">
              <div className="text-red-900 mb-1">❌ Try to Update Later</div>
              <code className="text-xs text-red-700">Creates duplicates</code>
            </div>
            
            <div className="bg-white p-3 rounded border border-red-200">
              <div className="text-red-900 mb-1">❌ Create Without Questions</div>
              <code className="text-xs text-red-700">Entry will be stuck</code>
            </div>
            
            <div className="bg-white p-3 rounded border border-red-200">
              <div className="text-red-900 mb-1">❌ Email Before DB Entry</div>
              <code className="text-xs text-red-700">Code won't work</code>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="mt-6 p-4 bg-white rounded border-2 border-blue-300">
        <div className="text-center">
          <div className="text-gray-900 mb-2">📋 Correct Order</div>
          <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">Webhook</span>
            <span className="text-gray-400">→</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded">Gemini API</span>
            <span className="text-gray-400">→</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded">Parse</span>
            <span className="text-gray-400">→</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded">Gen Code</span>
            <span className="text-gray-400">→</span>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded">Create DB</span>
            <span className="text-gray-400">→</span>
            <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded">Email</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
