import { Card } from './ui/card';
import { Alert } from './ui/alert';
import { Button } from './ui/button';
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface SetupStep {
  name: string;
  status: 'complete' | 'pending' | 'error';
  description: string;
  action?: string;
  link?: string;
}

export function SetupStatusCard() {
  const steps: SetupStep[] = [
    {
      name: 'Frontend Deployed',
      status: 'complete',
      description: 'Web application is live and accessible'
    },
    {
      name: 'Backend Deployed',
      status: 'complete',
      description: 'Supabase Edge Functions deployed'
    },
    {
      name: 'Gemini API Key',
      status: 'error',
      description: 'Add GEMINI_API_KEY to Supabase environment variables',
      action: 'Configure Now',
      link: 'https://supabase.com/dashboard'
    },
    {
      name: 'n8n Webhook',
      status: 'complete',
      description: 'Webhook URL configured in Settings'
    }
  ];

  const hasErrors = steps.some(s => s.status === 'error');
  const hasPending = steps.some(s => s.status === 'pending');

  return (
    <Card className="p-6 mb-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-900">System Setup Status</h3>
          {hasErrors && (
            <Alert className="border-red-200 bg-red-50 py-2 px-3 inline-flex items-center">
              <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
              <span className="text-red-900 text-sm">Action Required</span>
            </Alert>
          )}
          {!hasErrors && !hasPending && (
            <Alert className="border-green-200 bg-green-50 py-2 px-3 inline-flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-green-900 text-sm">All Set!</span>
            </Alert>
          )}
        </div>

        <div className="space-y-3">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded border border-gray-200 bg-gray-50">
              <div className="mt-0.5">
                {step.status === 'complete' && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                {step.status === 'pending' && (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
                {step.status === 'error' && (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm ${
                    step.status === 'complete' ? 'text-gray-900' : 
                    step.status === 'error' ? 'text-red-900' : 
                    'text-yellow-900'
                  }`}>
                    {step.name}
                  </h4>
                  {step.action && step.link && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(step.link, '_blank')}
                      className="text-xs"
                    >
                      {step.action}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {hasErrors && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <div className="ml-3">
              <h4 className="text-orange-900">Setup Incomplete</h4>
              <p className="text-orange-800 mt-1 text-sm">
                The system will not work properly until you add the Gemini API key. 
                See <strong>/GEMINI_API_SETUP.md</strong> for detailed instructions.
              </p>
            </div>
          </Alert>
        )}
      </div>
    </Card>
  );
}
