import { Card } from './ui/card';
import { ArrowRight, CheckCircle, XCircle } from 'lucide-react';

export function WorkflowDiagram() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-gray-900 mb-6 text-center">Current vs Fixed Workflow</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* BROKEN WORKFLOW */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="h-6 w-6 text-red-600" />
            <h3 className="text-red-900">❌ Current (Broken)</h3>
          </div>
          
          <div className="space-y-3">
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="text-sm">
                <div className="text-red-900 mb-1">1. Webhook Receives Data</div>
                <code className="text-xs text-red-700">candidateName, email, position...</code>
              </div>
            </Card>
            
            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 text-red-400 rotate-90" />
            </div>
            
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="text-sm">
                <div className="text-red-900 mb-1">2. Create DB Entry</div>
                <code className="text-xs text-red-700">status: "waiting"</code>
                <div className="text-xs text-red-700 mt-1">❌ No questions yet!</div>
              </div>
            </Card>
            
            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 text-red-400 rotate-90" />
            </div>
            
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="text-sm">
                <div className="text-red-900 mb-1">3. Generate Questions</div>
                <code className="text-xs text-red-700">Call Gemini API</code>
              </div>
            </Card>
            
            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 text-red-400 rotate-90" />
            </div>
            
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="text-sm">
                <div className="text-red-900 mb-1">4. Try to Update Entry</div>
                <code className="text-xs text-red-700">❌ Different endpoint?</code>
                <div className="text-xs text-red-700 mt-1">❌ Creates 2nd entry?</div>
              </div>
            </Card>
            
            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 text-red-400 rotate-90" />
            </div>
            
            <Card className="p-4 bg-red-100 border-red-300">
              <div className="text-sm">
                <div className="text-red-900 mb-2">❌ RESULT:</div>
                <div className="text-xs space-y-1">
                  <div>• Entry 1: status="waiting", no questions</div>
                  <div>• Entry 2: status="ready", has questions</div>
                  <div>• Email has wrong access code</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* FIXED WORKFLOW */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h3 className="text-green-900">✅ Fixed (Correct)</h3>
          </div>
          
          <div className="space-y-3">
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-sm">
                <div className="text-green-900 mb-1">1. Webhook Receives Data</div>
                <code className="text-xs text-green-700">candidateName, email, position...</code>
              </div>
            </Card>
            
            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 text-green-400 rotate-90" />
            </div>
            
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-sm">
                <div className="text-green-900 mb-1">2. Generate Questions FIRST</div>
                <code className="text-xs text-green-700">Call Gemini API</code>
                <div className="text-xs text-green-700 mt-1">✅ Get 10 questions</div>
              </div>
            </Card>
            
            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 text-green-400 rotate-90" />
            </div>
            
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-sm">
                <div className="text-green-900 mb-1">3. Parse Response</div>
                <code className="text-xs text-green-700">Extract questions array</code>
              </div>
            </Card>
            
            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 text-green-400 rotate-90" />
            </div>
            
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-sm">
                <div className="text-green-900 mb-1">4. Generate Access Code</div>
                <code className="text-xs text-green-700">ABC123XYZ</code>
              </div>
            </Card>
            
            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 text-green-400 rotate-90" />
            </div>
            
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-sm">
                <div className="text-green-900 mb-1">5. Create DB Entry ONCE</div>
                <code className="text-xs text-green-700">With ALL data:</code>
                <div className="text-xs text-green-700 mt-1">
                  • questions: [...]<br/>
                  • status: "ready"<br/>
                  • accessCode: "ABC123"
                </div>
              </div>
            </Card>
            
            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 text-green-400 rotate-90" />
            </div>
            
            <Card className="p-4 bg-green-100 border-green-300">
              <div className="text-sm">
                <div className="text-green-900 mb-2">✅ RESULT:</div>
                <div className="text-xs space-y-1">
                  <div>• ONE entry only</div>
                  <div>• status="ready"</div>
                  <div>• Has all 10 questions</div>
                  <div>• Email has correct access code</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Key Differences */}
      <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
        <h3 className="text-blue-900 mb-4">🔑 Key Differences</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-blue-900 mb-2">Timing</div>
            <div className="text-blue-700">
              ❌ Create DB → Then questions<br/>
              ✅ Questions → Then create DB
            </div>
          </div>
          <div>
            <div className="text-blue-900 mb-2">Database Calls</div>
            <div className="text-blue-700">
              ❌ 2 calls (create + update)<br/>
              ✅ 1 call (create with data)
            </div>
          </div>
          <div>
            <div className="text-blue-900 mb-2">Entries Created</div>
            <div className="text-blue-700">
              ❌ 2 entries (duplicate)<br/>
              ✅ 1 entry (correct)
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
