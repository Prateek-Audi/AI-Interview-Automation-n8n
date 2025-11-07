import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

export function UrlComparisonCard() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* What You Asked */}
      <Card className="p-6 border-red-200 bg-red-50">
        <div className="flex items-center gap-2 mb-4">
          <XCircle className="h-5 w-5 text-red-600" />
          <h3 className="text-red-900">❌ What You Asked About</h3>
        </div>
        
        <div className="bg-white p-3 rounded border border-red-200 mb-4">
          <code className="text-xs text-red-800 break-all">
            https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent
          </code>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm text-red-800">
            <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Missing API key</strong>
              <p className="text-xs text-red-700">Should end with <code>?key=YOUR_API_KEY</code></p>
            </div>
          </div>
          
          <div className="flex items-start gap-2 text-sm text-red-800">
            <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Model doesn't exist</strong>
              <p className="text-xs text-red-700"><code>gemini-2.5-flash</code> not available yet</p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm text-red-800">
            <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Wrong version</strong>
              <p className="text-xs text-red-700">Should use <code>v1beta</code> for newer models</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-red-200">
          <Badge className="bg-red-600">
            Result: HTTP 404 Error
          </Badge>
        </div>
      </Card>

      {/* Correct Version */}
      <Card className="p-6 border-green-200 bg-green-50">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <h3 className="text-green-900">✅ Correct Version</h3>
        </div>
        
        <div className="bg-white p-3 rounded border border-green-200 mb-4">
          <code className="text-xs text-green-800 break-all">
            https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDK...
          </code>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm text-green-800">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
            <div>
              <strong>Has API key</strong>
              <p className="text-xs text-green-700">Includes <code>?key=...</code> parameter</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2 text-sm text-green-800">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
            <div>
              <strong>Valid model</strong>
              <p className="text-xs text-green-700"><code>gemini-1.5-flash</code> exists and works</p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm text-green-800">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
            <div>
              <strong>Correct version</strong>
              <p className="text-xs text-green-700">Uses <code>v1beta</code> for latest features</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-green-200">
          <Badge className="bg-green-600">
            Result: HTTP 200 Success ✓
          </Badge>
        </div>
      </Card>
    </div>
  );
}
