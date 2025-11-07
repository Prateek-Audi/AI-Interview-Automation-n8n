import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Mail, CheckCircle2, ArrowRight, ExternalLink } from "lucide-react";
import { Badge } from "./ui/badge";

export function EmailNotificationBanner() {
  const scrollToEmailSetup = () => {
    const element = document.querySelector('[data-email-guide]');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Alert className="bg-gradient-to-r from-green-50 to-blue-50 border-green-300">
      <Mail className="h-5 w-5 text-green-600" />
      <AlertDescription>
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-green-900">
                ✨ NEW: Email Notifications Now Available!
              </h3>
              <Badge className="bg-green-600">Just Added</Badge>
            </div>
            <p className="text-green-800 text-sm">
              Your system now automatically sends professional emails to both candidates 
              and recruiters after every evaluation completes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="flex gap-2 text-green-900">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
              <div>
                <p className="font-medium">Candidate Emails</p>
                <p className="text-xs text-green-700">
                  Personalized results with score and feedback
                </p>
              </div>
            </div>

            <div className="flex gap-2 text-green-900">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
              <div>
                <p className="font-medium">Recruiter Notifications</p>
                <p className="text-xs text-green-700">
                  Complete details with action reminders
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button 
              size="sm" 
              onClick={scrollToEmailSetup}
              className="bg-green-600 hover:bg-green-700"
            >
              Set Up Email Notifications
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button 
              size="sm" 
              variant="outline"
              asChild
            >
              <a 
                href="https://resend.com/signup" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Get Free Resend Account
              </a>
            </Button>
          </div>

          <div className="pt-2 border-t border-green-200">
            <p className="text-xs text-green-700">
              <strong>Quick Setup:</strong> Get Resend API key → Add to Supabase → Redeploy Edge Function. 
              Takes less than 5 minutes! 3,000 free emails/month included.
            </p>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
