import { Alert } from './ui/alert';
import { Button } from './ui/button';
import { AlertCircle } from 'lucide-react';

interface ConfigurationBannerProps {
  onNavigateToSettings: () => void;
}

export function ConfigurationBanner({ onNavigateToSettings }: ConfigurationBannerProps) {
  return (
    <Alert className="border-red-200 bg-red-50 mb-6">
      <AlertCircle className="h-5 w-5 text-red-600" />
      <div className="ml-3 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-red-900">⚠️ Configuration Required</h3>
            <p className="text-red-800 mt-1">
              Gemini API key is not configured. The system cannot evaluate questionnaire answers without it. 
              Please add <code className="bg-red-100 px-1 rounded">GEMINI_API_KEY</code> to Supabase Edge Functions.
            </p>
          </div>
          <Button 
            onClick={onNavigateToSettings}
            className="bg-red-600 hover:bg-red-700 ml-4 whitespace-nowrap"
          >
            Fix in Settings
          </Button>
        </div>
      </div>
    </Alert>
  );
}
