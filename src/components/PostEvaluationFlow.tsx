import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { CheckCircle2, Mail, Database, Zap } from "lucide-react";
import { Badge } from "./ui/badge";

export function PostEvaluationFlow() {
  return (
    <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-green-600" />
          What Happens After Answer Submission
        </CardTitle>
        <CardDescription>
          Complete automated workflow from submission to notification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Step 1 */}
          <FlowStep
            number={1}
            icon={<Zap className="w-5 h-5 text-purple-600" />}
            title="AI Evaluation"
            description="Gemini AI analyzes all answers and generates a score out of 20"
            status="automatic"
          />

          {/* Step 2 */}
          <FlowStep
            number={2}
            icon={<Database className="w-5 h-5 text-blue-600" />}
            title="Status Updated"
            description="Candidate status is set to 'shortlisted' (≥18) or 'rejected' (<18)"
            status="automatic"
          />

          {/* Step 3 */}
          <FlowStep
            number={3}
            icon={<Mail className="w-5 h-5 text-green-600" />}
            title="Email to Candidate"
            description="Personalized result email with score and feedback"
            status="automatic"
            details={[
              "✅ Shortlisted: Congratulations message with next steps",
              "📋 Rejected: Thank you message with constructive feedback"
            ]}
          />

          {/* Step 4 */}
          <FlowStep
            number={4}
            icon={<Mail className="w-5 h-5 text-orange-600" />}
            title="Email to Recruiter"
            description="Complete candidate details and AI evaluation results"
            status="automatic"
            details={[
              "📊 Candidate information and final score",
              "💬 AI-generated feedback and insights",
              "⚡ Action required reminder for shortlisted candidates"
            ]}
          />

          {/* Summary */}
          <div className="mt-6 p-4 bg-green-100 border-2 border-green-300 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">100% Automated Workflow</p>
                <p className="text-sm text-green-800 mt-1">
                  No manual intervention required. Candidates and recruiters are automatically 
                  notified within seconds of submission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface FlowStepProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  status: 'automatic' | 'manual';
  details?: string[];
}

function FlowStep({ number, icon, title, description, status, details }: FlowStepProps) {
  return (
    <div className="flex gap-4 relative">
      {/* Connector Line */}
      {number < 4 && (
        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-300"></div>
      )}
      
      {/* Number Badge */}
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center font-bold text-gray-700 shadow-sm relative z-10">
          {number}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              {icon}
              <h4 className="font-medium">{title}</h4>
            </div>
            <Badge 
              variant={status === 'automatic' ? 'default' : 'secondary'}
              className={status === 'automatic' ? 'bg-green-600' : ''}
            >
              {status === 'automatic' ? '⚡ Automatic' : '👤 Manual'}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground">{description}</p>
          
          {details && details.length > 0 && (
            <div className="mt-3 space-y-1">
              {details.map((detail, idx) => (
                <p key={idx} className="text-xs text-muted-foreground pl-3 border-l-2 border-gray-200">
                  {detail}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
