import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Mail, MailCheck, MailX, AlertCircle } from "lucide-react";

interface EmailStatusIndicatorProps {
  status: 'sent' | 'pending' | 'failed' | 'not-configured';
  type?: 'candidate' | 'recruiter';
}

export function EmailStatusIndicator({ status, type = 'candidate' }: EmailStatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'sent':
        return {
          icon: <MailCheck className="w-3 h-3" />,
          label: 'Email Sent',
          variant: 'default' as const,
          color: 'bg-green-600',
          tooltip: `${type === 'candidate' ? 'Candidate' : 'Recruiter'} email successfully sent`
        };
      case 'pending':
        return {
          icon: <Mail className="w-3 h-3" />,
          label: 'Pending',
          variant: 'secondary' as const,
          color: 'bg-yellow-600',
          tooltip: 'Email notification pending'
        };
      case 'failed':
        return {
          icon: <MailX className="w-3 h-3" />,
          label: 'Failed',
          variant: 'destructive' as const,
          color: 'bg-red-600',
          tooltip: 'Email delivery failed - check logs'
        };
      case 'not-configured':
        return {
          icon: <AlertCircle className="w-3 h-3" />,
          label: 'Not Configured',
          variant: 'outline' as const,
          color: 'bg-gray-400',
          tooltip: 'Email notifications not configured - add RESEND_API_KEY'
        };
      default:
        return {
          icon: <Mail className="w-3 h-3" />,
          label: 'Unknown',
          variant: 'outline' as const,
          color: 'bg-gray-400',
          tooltip: 'Unknown email status'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={config.variant}
            className={`${status === 'sent' ? config.color : ''} gap-1 text-xs cursor-help`}
          >
            {config.icon}
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface EmailNotificationBadgeProps {
  hasEmailConfig: boolean;
  candidateName?: string;
  candidateEmail?: string;
  recruiterEmail?: string;
}

export function EmailNotificationBadge({ 
  hasEmailConfig,
  candidateName,
  candidateEmail,
  recruiterEmail
}: EmailNotificationBadgeProps) {
  if (!hasEmailConfig) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center gap-1 text-xs text-muted-foreground cursor-help">
              <AlertCircle className="w-3 h-3" />
              <span>Emails not configured</span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-xs">
              Email notifications are not configured. Add RESEND_API_KEY, FROM_EMAIL, 
              and RECRUITER_EMAIL to Supabase environment variables to enable automated emails.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1 text-xs text-green-600 cursor-help">
            <MailCheck className="w-3 h-3" />
            <span>Emails configured</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="text-xs space-y-1">
            <p className="font-medium">Automated emails will be sent to:</p>
            {candidateName && candidateEmail && (
              <p>✅ Candidate: {candidateName} ({candidateEmail})</p>
            )}
            {recruiterEmail && (
              <p>✅ Recruiter: {recruiterEmail}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
