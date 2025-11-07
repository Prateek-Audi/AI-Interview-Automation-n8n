import { Alert } from './ui/alert';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle, XCircle, AlertCircle, Rocket, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SystemStatusProps {
  onNavigateToDeploy: () => void;
}

export function SystemStatus({ onNavigateToDeploy }: SystemStatusProps) {
  const [edgeFunctionStatus, setEdgeFunctionStatus] = useState<'checking' | 'deployed' | 'not-deployed'>('checking');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    checkEdgeFunctionStatus();
  }, []);

  const checkEdgeFunctionStatus = async () => {
    try {
      const response = await fetch('https://ybivtovbzxyzxklgjnsp.supabase.co/functions/v1/make-server-beba9171/health');
      if (response.ok) {
        setEdgeFunctionStatus('deployed');
        // Hide the banner after 5 seconds if everything is working
        setTimeout(() => setIsVisible(false), 5000);
      } else {
        setEdgeFunctionStatus('not-deployed');
      }
    } catch (error) {
      setEdgeFunctionStatus('not-deployed');
    }
  };

  if (!isVisible) {
    return null;
  }

  if (edgeFunctionStatus === 'checking') {
    return (
      <div className="bg-blue-50 border-b border-blue-200 py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 animate-pulse" />
              <span className="text-sm text-blue-900">Checking system status...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (edgeFunctionStatus === 'deployed') {
    return (
      <div className="bg-green-50 border-b border-green-200 py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-900">
                ✅ System Ready - Edge Function deployed and running
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a 
                href="/POST_DEPLOYMENT_TESTING.md" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-700 hover:text-green-900 hover:underline flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                Testing Guide
              </a>
              <span className="text-gray-300">|</span>
              <a 
                href="/LATEST_UPDATES.md" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-700 hover:text-green-900 hover:underline flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                What's New
              </a>
              <span className="text-gray-300">|</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsVisible(false)}
                className="text-green-700 hover:text-green-900 h-6 px-2"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not deployed
  return (
    <div className="bg-yellow-50 border-b border-yellow-200 py-3">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <XCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-yellow-900">
                  <strong>Edge Function Not Deployed</strong> - System won't work until deployed
                </span>
                <Badge className="bg-yellow-200 text-yellow-900 border-yellow-300">
                  5 min setup
                </Badge>
              </div>
              <p className="text-xs text-yellow-800 mt-1">
                The 403 error you see is normal - Figma Make can't auto-deploy. Manual deployment required.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={onNavigateToDeploy}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Rocket className="h-3 w-3 mr-1" />
              Deploy Now
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsVisible(false)}
              className="text-yellow-700 hover:text-yellow-900 h-7 px-2"
            >
              Hide
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
