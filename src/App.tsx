import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { CandidateForm } from './components/CandidateForm';
import { AdminDashboard } from './components/AdminDashboard';
import { QuestionnaireAccess } from './components/QuestionnaireAccess';
import { Button } from './components/ui/button';
import { Users, FileText, ClipboardList } from 'lucide-react';
import { projectId, publicAnonKey } from './utils/supabase/info';

type View = 'form' | 'admin' | 'questionnaire';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('form');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Load webhook URL from localStorage on mount
  useEffect(() => {
    // Use production webhook URL
    const productionUrl = 'https://prateek1234-audi.app.n8n.cloud/webhook/candidate-interview';
    setWebhookUrl(productionUrl);
    localStorage.setItem('n8n_webhook_url', productionUrl);
  }, []);

  const handleWebhookUrlChange = (url: string) => {
    setWebhookUrl(url);
  };

  const handleSubmitSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Make API base URL available globally for components
  useEffect(() => {
    (window as any).API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-beba9171`;
    (window as any).API_HEADERS = {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json'
    };
  }, []);

  // Handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash && ['form', 'admin', 'questionnaire'].includes(hash)) {
        setCurrentView(hash as View);
      }
    };

    handleHashChange(); // Check on mount
    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-blue-600 mb-1">
                AI Interview Screening System
              </h1>
              <p className="text-gray-600 text-sm">
                Automated candidate screening powered by n8n & Gemini AI
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={currentView === 'form' ? 'default' : 'outline'}
                onClick={() => setCurrentView('form')}
                className={currentView === 'form' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                <FileText className="h-4 w-4 mr-2" />
                Candidate Form
              </Button>
              <Button
                variant={currentView === 'questionnaire' ? 'default' : 'outline'}
                onClick={() => setCurrentView('questionnaire')}
                className={currentView === 'questionnaire' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Take Questionnaire
              </Button>
              <Button
                variant={currentView === 'admin' ? 'default' : 'outline'}
                onClick={() => setCurrentView('admin')}
                className={currentView === 'admin' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                <Users className="h-4 w-4 mr-2" />
                Admin Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 px-4">
        {currentView === 'form' && (
          <CandidateForm
            webhookUrl={webhookUrl}
            onSubmitSuccess={handleSubmitSuccess}
          />
        )}
        {currentView === 'questionnaire' && (
          <QuestionnaireAccess />
        )}
        {currentView === 'admin' && (
          <AdminDashboard key={refreshKey} />
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p>Powered by n8n Workflow Automation & Gemini AI</p>
          <p className="mt-2">
            Candidates scoring 18+ out of 20 marks are automatically shortlisted
          </p>
        </div>
      </div>
    </div>
  );
}