import { Alert } from './ui/alert';
import { Button } from './ui/button';
import { AlertTriangle, Rocket, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DeploymentAlertProps {
  onNavigateToDeploy: () => void;
}

export function DeploymentAlert({ onNavigateToDeploy }: DeploymentAlertProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the alert before
    const dismissed = localStorage.getItem('deployment_alert_dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('deployment_alert_dismissed', 'true');
  };

  const handleDismissTemporary = () => {
    setIsVisible(false);
  };

  const handleGoToDeploy = () => {
    setIsVisible(false);
    onNavigateToDeploy();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4 animate-in slide-in-from-top-5">
      <Alert className="border-red-300 bg-red-50 shadow-2xl border-2">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-red-900 mb-2">🚨 Manual Deployment Required - Ignore 403 Errors</h3>
                <p className="text-red-800 text-sm mb-3">
                  <strong>The 403 error is expected and normal.</strong> Figma Make cannot deploy Edge Functions automatically. 
                  You must deploy manually (takes 5 minutes). The system won't work until deployed.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={handleGoToDeploy}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    Deploy Now (5 minutes)
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDismissTemporary}
                    className="border-red-300"
                  >
                    Remind Me Later
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDismiss}
                    className="text-red-700 hover:text-red-900"
                  >
                    Don't Show Again
                  </Button>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismissTemporary}
                className="text-red-700 hover:text-red-900"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Alert>
    </div>
  );
}
