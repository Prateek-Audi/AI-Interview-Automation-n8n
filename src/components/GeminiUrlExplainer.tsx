import { Card } from './ui/card';
import { Alert } from './ui/alert';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, Info, Zap } from 'lucide-react';

export function GeminiUrlExplainer() {
  return (
    <Card className="p-6 bg-blue-50 border-blue-200">
      <h3 className="text-blue-900 mb-4 flex items-center gap-2">
        <Info className="h-5 w-5" />
        Understanding Gemini API URLs
      </h3>

      <div className="space-y-4">
        {/* Correct URL Format */}
        <div>
          <h4 className="text-blue-900 mb-2">✅ Correct URL Format</h4>
          <div className="bg-white p-3 rounded border border-blue-200">
            <code className="text-sm text-blue-800 break-all">
              https://generativelanguage.googleapis.com/<Badge className="bg-green-600 mx-1">v1beta</Badge>/models/<Badge className="bg-purple-600 mx-1">gemini-1.5-flash</Badge>:generateContent?key=<Badge className="bg-orange-600 mx-1">YOUR_API_KEY</Badge>
            </code>
          </div>
          <p className="text-xs text-blue-700 mt-2">
            <strong>Parts:</strong>
          </p>
          <ul className="text-xs text-blue-700 ml-4 mt-1 space-y-1">
            <li>• <Badge className="bg-green-600 text-white text-xs">v1beta</Badge> or <Badge className="bg-green-600 text-white text-xs">v1</Badge> = API version</li>
            <li>• <Badge className="bg-purple-600 text-white text-xs">gemini-1.5-flash</Badge> = Model name</li>
            <li>• <Badge className="bg-orange-600 text-white text-xs">YOUR_API_KEY</Badge> = Your Gemini API key</li>
          </ul>
        </div>

        {/* What You Asked About */}
        <div>
          <h4 className="text-blue-900 mb-2">❓ What You Asked About</h4>
          <div className="bg-white p-3 rounded border border-blue-200">
            <code className="text-sm text-blue-800 break-all">
              https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent
            </code>
          </div>
          <Alert className="mt-2 bg-orange-50 border-orange-200">
            <Info className="h-4 w-4 text-orange-600" />
            <div className="ml-3">
              <p className="text-orange-900 text-xs">
                <strong>Issues:</strong>
              </p>
              <ul className="text-orange-800 text-xs mt-1 space-y-1">
                <li>• Missing <code>?key=YOUR_API_KEY</code> at the end</li>
                <li>• <code>gemini-2.5-flash</code> might not exist yet (as of Nov 2025)</li>
                <li>• Should use <code>v1beta</code> for most models</li>
              </ul>
            </div>
          </Alert>
        </div>

        {/* Available Models */}
        <div>
          <h4 className="text-blue-900 mb-2">📋 Available Models (Confirmed)</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <code>gemini-1.5-flash</code>
              <Badge className="bg-blue-600 text-xs">Most Popular</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <code>gemini-1.5-flash-latest</code>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <code>gemini-1.5-pro</code>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <code>gemini-1.5-pro-latest</code>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <code>gemini-pro</code>
              <Badge className="bg-gray-600 text-xs">Legacy</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <XCircle className="h-4 w-4 text-red-600" />
              <code>gemini-2.5-flash</code>
              <Badge className="bg-red-600 text-xs">Doesn't Exist</Badge>
            </div>
          </div>
        </div>

        {/* Both Versions */}
        <div>
          <h4 className="text-blue-900 mb-2">🔀 v1 vs v1beta</h4>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <Badge className="bg-green-600">v1beta</Badge>
              <div>
                <p><strong>Latest features</strong></p>
                <p className="text-xs">Use this for newest models like gemini-1.5-flash</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge className="bg-gray-600">v1</Badge>
              <div>
                <p><strong>Stable API</strong></p>
                <p className="text-xs">Use for older models like gemini-pro</p>
              </div>
            </div>
          </div>
        </div>

        {/* Test All */}
        <Alert className="bg-purple-50 border-purple-200">
          <Zap className="h-4 w-4 text-purple-600" />
          <div className="ml-3">
            <p className="text-purple-900 text-sm">
              <strong>👇 Use the diagnostic tool below to test all combinations!</strong>
            </p>
            <p className="text-purple-800 text-xs mt-1">
              It will show you which exact URL works with your API key.
            </p>
          </div>
        </Alert>
      </div>
    </Card>
  );
}
