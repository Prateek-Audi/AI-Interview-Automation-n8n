import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle2, Circle, Copy, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

export function EmailSetupSteps() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, stepNumber: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepNumber);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <Card data-email-guide>
      <CardHeader>
        <CardTitle>📧 Email Notification Setup</CardTitle>
        <CardDescription>
          Follow these steps to enable automated email notifications for candidates and recruiters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Step 1 */}
        <SetupStep
          number={1}
          title="Create Resend Account"
          description="Sign up for a free Resend account to send emails"
        >
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Resend offers 3,000 free emails per month - perfect for interview workflows.
            </p>
            <Button variant="outline" size="sm" asChild>
              <a href="https://resend.com/signup" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Sign up at Resend.com
              </a>
            </Button>
          </div>
        </SetupStep>

        {/* Step 2 */}
        <SetupStep
          number={2}
          title="Get Your API Key"
          description="Generate an API key from your Resend dashboard"
        >
          <div className="space-y-3">
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Log in to your Resend account</li>
              <li>Go to the "API Keys" section</li>
              <li>Click "Create API Key"</li>
              <li>Copy the key (starts with <code className="bg-muted px-1 rounded">re_</code>)</li>
            </ol>
          </div>
        </SetupStep>

        {/* Step 3 */}
        <SetupStep
          number={3}
          title="Configure Email Domain"
          description="Set up your sending domain (or use test domain)"
        >
          <div className="space-y-3">
            <div className="p-3 border rounded-lg bg-muted/50">
              <p className="font-medium text-sm mb-2">Option A: Test Domain (Quick)</p>
              <code className="text-xs bg-background px-2 py-1 rounded block">
                onboarding@resend.dev
              </code>
              <p className="text-xs text-muted-foreground mt-2">
                ✅ Works immediately • ⚠️ May go to spam
              </p>
            </div>

            <div className="p-3 border rounded-lg bg-muted/50">
              <p className="font-medium text-sm mb-2">Option B: Custom Domain (Recommended)</p>
              <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground">
                <li>Add your domain in Resend dashboard</li>
                <li>Add DNS records (Resend provides these)</li>
                <li>Wait for verification (few minutes)</li>
                <li>Use emails like <code className="bg-background px-1 rounded">noreply@yourdomain.com</code></li>
              </ol>
            </div>
          </div>
        </SetupStep>

        {/* Step 4 */}
        <SetupStep
          number={4}
          title="Add Environment Variables to Supabase"
          description="Configure your Supabase Edge Function with email credentials"
        >
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Add these environment variables to your Supabase project:
            </p>

            <div className="space-y-2">
              <EnvironmentVariableCommand
                name="RESEND_API_KEY"
                value="re_your_actual_api_key_here"
                onCopy={() => copyToClipboard("supabase secrets set RESEND_API_KEY=re_your_actual_api_key_here", 1)}
                isCopied={copiedStep === 1}
              />
              <EnvironmentVariableCommand
                name="FROM_EMAIL"
                value="noreply@yourdomain.com"
                onCopy={() => copyToClipboard("supabase secrets set FROM_EMAIL=noreply@yourdomain.com", 2)}
                isCopied={copiedStep === 2}
              />
              <EnvironmentVariableCommand
                name="RECRUITER_EMAIL"
                value="recruiter@yourcompany.com"
                onCopy={() => copyToClipboard("supabase secrets set RECRUITER_EMAIL=recruiter@yourcompany.com", 3)}
                isCopied={copiedStep === 3}
                optional
              />
            </div>

            <div className="p-3 border rounded-lg bg-blue-50 border-blue-200">
              <p className="text-sm font-medium text-blue-900">Via Supabase Dashboard:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs text-blue-800 mt-2">
                <li>Go to Project Settings → Edge Functions</li>
                <li>Scroll to "Environment Variables"</li>
                <li>Add each variable with its value</li>
              </ol>
            </div>
          </div>
        </SetupStep>

        {/* Step 5 */}
        <SetupStep
          number={5}
          title="Redeploy Edge Function"
          description="Deploy the updated function with email capabilities"
        >
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              After adding environment variables, redeploy your Edge Function:
            </p>

            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm bg-muted px-3 py-2 rounded font-mono">
                supabase functions deploy server --no-verify-jwt
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  copyToClipboard("supabase functions deploy server --no-verify-jwt", 4);
                }}
              >
                {copiedStep === 4 ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Or deploy via Supabase Dashboard: Edge Functions → server → Deploy
            </p>
          </div>
        </SetupStep>

        {/* Step 6 */}
        <SetupStep
          number={6}
          title="Test Email Notifications"
          description="Verify emails are being sent correctly"
        >
          <div className="space-y-3">
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Submit a test candidate through your form</li>
              <li>Wait for questions to be generated</li>
              <li>Access questionnaire with the access code</li>
              <li>Submit answers</li>
              <li>Check both candidate and recruiter emails</li>
            </ol>

            <div className="p-3 border rounded-lg bg-green-50 border-green-200">
              <p className="text-sm font-medium text-green-900">✅ Check Resend Dashboard:</p>
              <p className="text-xs text-green-800 mt-1">
                Go to Emails tab in Resend to see delivery status and logs
              </p>
            </div>
          </div>
        </SetupStep>

        {/* Success Message */}
        <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">You're All Set! 🎉</p>
              <p className="text-sm text-green-800 mt-1">
                Your interview system will now automatically send professional email notifications 
                to both candidates and recruiters after every evaluation. The entire workflow 
                is fully automated!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SetupStepProps {
  number: number;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SetupStep({ number, title, description, children }: SetupStepProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
          {number}
        </div>
      </div>
      <div className="flex-1 space-y-2 pb-6 border-b">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

interface EnvironmentVariableCommandProps {
  name: string;
  value: string;
  onCopy: () => void;
  isCopied: boolean;
  optional?: boolean;
}

function EnvironmentVariableCommand({ 
  name, 
  value, 
  onCopy, 
  isCopied, 
  optional = false 
}: EnvironmentVariableCommandProps) {
  return (
    <div className="flex items-start gap-2">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <code className="text-xs font-mono font-medium">{name}</code>
          {optional && (
            <Badge variant="outline" className="text-xs">Optional</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs bg-muted px-2 py-1.5 rounded font-mono overflow-x-auto">
            supabase secrets set {name}={value}
          </code>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopy}
            className="flex-shrink-0"
          >
            {isCopied ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
