import { Card } from './ui/card';
import { Alert } from './ui/alert';
import { Badge } from './ui/badge';
import { MessageSquare, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

export function DirectAnswerCard() {
  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <div className="flex items-start gap-3">
        <MessageSquare className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-blue-900 mb-3">Your Question Answered</h3>
          
          {/* The Question */}
          <div className="bg-white p-4 rounded-lg border border-blue-200 mb-4">
            <p className="text-gray-700 mb-2">
              <strong>You asked:</strong> "Should I test all the Gemini models with this URL?"
            </p>
            <code className="text-xs bg-gray-100 p-2 rounded block break-all text-gray-800">
              https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent
            </code>
          </div>

          {/* The Answer */}
          <Alert className="mb-4 bg-orange-50 border-orange-200">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <div className="ml-3">
              <p className="text-orange-900">
                <strong>Almost, but needs 2 fixes:</strong>
              </p>
              <ul className="text-orange-800 text-sm mt-2 space-y-1">
                <li>1. Add <code className="bg-orange-100 px-1 rounded">?key=YOUR_API_KEY</code> at the end</li>
                <li>2. Change <code className="bg-orange-100 px-1 rounded">gemini-2.5-flash</code> to <code className="bg-orange-100 px-1 rounded">gemini-1.5-flash</code> (2.5 doesn't exist)</li>
                <li>3. Change <code className="bg-orange-100 px-1 rounded">v1</code> to <code className="bg-orange-100 px-1 rounded">v1beta</code></li>
              </ul>
            </div>
          </Alert>

          {/* Corrected Version */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="text-green-900"><strong>✅ Correct URL:</strong></p>
            </div>
            <code className="text-xs bg-white p-2 rounded block break-all text-green-800 border border-green-200">
              https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDK6iPTYz_2iQ1vWiOiPRPYph3_jwrciMA
            </code>
            <div className="mt-3 flex items-center gap-2 text-xs text-green-700">
              <ArrowRight className="h-3 w-3" />
              <span>This is what the diagnostic tool tests below!</span>
            </div>
          </div>

          {/* What to Do */}
          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-purple-900 mb-2">
              <strong>🎯 What You Should Do:</strong>
            </p>
            <ol className="text-purple-800 text-sm space-y-1 ml-4">
              <li>1. Scroll down to the diagnostic tool</li>
              <li>2. Click "Test All Models"</li>
              <li>3. It will test <Badge className="bg-purple-600 text-xs mx-1">8 different URLs</Badge></li>
              <li>4. Shows which one returns <Badge className="bg-green-600 text-xs mx-1">HTTP 200</Badge></li>
              <li>5. That's the URL your Edge Function will use!</li>
            </ol>
          </div>
        </div>
      </div>
    </Card>
  );
}
