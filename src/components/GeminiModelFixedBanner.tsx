import { Alert } from './ui/alert';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, Rocket, Terminal, ArrowRight } from 'lucide-react';
import { QuickDeployCard } from './QuickDeployCard';

export function GeminiModelFixedBanner() {
  return (
    <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-300">
      <div className="flex items-start gap-3">
        <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-green-900 mb-3 flex items-center gap-2">
            ✅ Edge Function Updated!
            <Badge className="bg-green-600">gemini-2.0-flash-exp</Badge>
          </h3>
          
          <Alert className="mb-4 bg-white border-green-200">
            <div>
              <p className="text-green-900 mb-2">
                <strong>Perfect! I've updated the Edge Function to use ONLY the model that works for you:</strong>
              </p>
              <code className="text-xs bg-green-50 p-2 rounded block break-all text-green-800 border border-green-200">
                https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent
              </code>
            </div>
          </Alert>

          <div className="space-y-4">
            {/* What Changed */}
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="text-green-900 mb-2 flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                What Changed in the Code
              </h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>❌ <strong>Before:</strong> Tried 8 different models (some failed with 404)</li>
                <li>✅ <strong>Now:</strong> Uses ONLY <code className="bg-green-100 px-1 rounded">gemini-2.0-flash-exp</code></li>
                <li>✅ No more fallback attempts - direct call to working model</li>
                <li>✅ Faster evaluation (no retry delays)</li>
              </ul>
            </div>

            {/* Deployment Steps */}
            <QuickDeployCard />

            {/* Test After Deployment */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="text-purple-900 mb-2">🧪 Test After Deployment</h4>
              <ol className="text-sm text-purple-800 space-y-2">
                <li className="flex items-start gap-2">
                  <Badge className="bg-purple-600 text-xs">1</Badge>
                  <span>Go to <strong>Questionnaire Access</strong> tab</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge className="bg-purple-600 text-xs">2</Badge>
                  <span>Enter an access code (e.g., from Admin Dashboard)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge className="bg-purple-600 text-xs">3</Badge>
                  <span>Answer the questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge className="bg-purple-600 text-xs">4</Badge>
                  <span>Click <strong>"Submit Answers"</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Expected:</strong> Should see score and feedback instantly! No 404 error!</span>
                </li>
              </ol>
            </div>

            {/* Success Indicator */}
            <div className="bg-green-100 p-4 rounded-lg border-2 border-green-300">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h4 className="text-green-900">✅ What Success Looks Like</h4>
              </div>
              <p className="text-sm text-green-800">
                After submitting answers, you should see:
              </p>
              <ul className="text-sm text-green-800 mt-2 space-y-1">
                <li>• <strong>Score:</strong> X/20</li>
                <li>• <strong>Status:</strong> Shortlisted or Rejected</li>
                <li>• <strong>Feedback:</strong> Brief evaluation from Gemini</li>
                <li>• <strong>No errors</strong> in browser console</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
