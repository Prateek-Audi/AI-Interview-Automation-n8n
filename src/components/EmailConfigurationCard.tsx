import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { CheckCircle2, XCircle, Mail, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

interface EmailConfigurationCardProps {
  className?: string;
}

export function EmailConfigurationCard({ className }: EmailConfigurationCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Notifications
            </CardTitle>
            <CardDescription>
              Automated emails sent to candidates and recruiters after evaluation
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Setup Alert */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Email notifications require configuration:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Create a free account at <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Resend.com</a></li>
                <li>Get your API key from Resend dashboard</li>
                <li>Add environment variables to Supabase Edge Functions</li>
                <li>Redeploy the Edge Function</li>
              </ol>
            </div>
          </AlertDescription>
        </Alert>

        {/* Required Environment Variables */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            Required Environment Variables
          </h4>
          
          <div className="space-y-2">
            <EnvironmentVariable
              name="RESEND_API_KEY"
              description="Your Resend API key (starts with re_)"
              example="re_123abc456def..."
              required
            />
            <EnvironmentVariable
              name="FROM_EMAIL"
              description="Email address that sends notifications"
              example="noreply@yourdomain.com"
              required
            />
            <EnvironmentVariable
              name="RECRUITER_EMAIL"
              description="Default recruiter email (optional fallback)"
              example="recruiter@company.com"
              required={false}
            />
          </div>
        </div>

        {/* What Gets Sent */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-medium">What Gets Sent Automatically</h4>
          
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Candidate Email</p>
                <p className="text-sm text-muted-foreground">
                  Personalized result email with score, feedback, and next steps (different template for shortlisted vs rejected)
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Recruiter Email</p>
                <p className="text-sm text-muted-foreground">
                  Complete candidate details, score, AI feedback, and action required reminder
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Email Templates Preview */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-medium">Email Templates</h4>
          
          <div className="grid gap-3">
            <EmailTemplate
              title="Shortlisted Candidate (Score ≥ 18)"
              subject="🎉 Congratulations! You've cleared the first round"
              preview="Includes congratulations message, score, feedback, and next steps"
              variant="success"
            />
            <EmailTemplate
              title="Rejected Candidate (Score < 18)"
              subject="Thank you for your application"
              preview="Polite thank you message with feedback and encouragement"
              variant="neutral"
            />
            <EmailTemplate
              title="Recruiter Notification"
              subject="Candidate Evaluation Complete: [Name] - [STATUS]"
              preview="Complete details with action required for shortlisted candidates"
              variant="info"
            />
          </div>
        </div>

        {/* Quick Setup Link */}
        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full" asChild>
            <a href="#" onClick={(e) => {
              e.preventDefault();
              // Scroll to the email setup guide
              const guide = document.querySelector('[data-email-guide]');
              if (guide) guide.scrollIntoView({ behavior: 'smooth' });
            }}>
              <ExternalLink className="w-4 h-4 mr-2" />
              View Complete Setup Guide
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface EnvironmentVariableProps {
  name: string;
  description: string;
  example: string;
  required?: boolean;
}

function EnvironmentVariable({ name, description, example, required = true }: EnvironmentVariableProps) {
  return (
    <div className="p-3 border rounded-lg bg-muted/50">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <code className="text-sm font-mono bg-background px-2 py-1 rounded">
              {name}
            </code>
            {required ? (
              <Badge variant="destructive" className="text-xs">Required</Badge>
            ) : (
              <Badge variant="outline" className="text-xs">Optional</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          <p className="text-xs text-muted-foreground mt-1 font-mono">
            Example: {example}
          </p>
        </div>
      </div>
    </div>
  );
}

interface EmailTemplateProps {
  title: string;
  subject: string;
  preview: string;
  variant: 'success' | 'neutral' | 'info';
}

function EmailTemplate({ title, subject, preview, variant }: EmailTemplateProps) {
  const variantStyles = {
    success: 'border-green-200 bg-green-50',
    neutral: 'border-gray-200 bg-gray-50',
    info: 'border-blue-200 bg-blue-50',
  };

  return (
    <div className={`p-3 border rounded-lg ${variantStyles[variant]}`}>
      <p className="font-medium text-sm">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">
        <span className="font-medium">Subject:</span> {subject}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{preview}</p>
    </div>
  );
}
