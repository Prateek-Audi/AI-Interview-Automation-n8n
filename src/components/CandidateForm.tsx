import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Alert } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import { Send, CheckCircle, AlertCircle, Mail, Briefcase, User, FileText } from 'lucide-react';

interface CandidateFormProps {
  webhookUrl: string;
  onSubmitSuccess: () => void;
}

export function CandidateForm({ webhookUrl, onSubmitSuccess }: CandidateFormProps) {
  const [formData, setFormData] = useState({
    candidateName: '',
    candidateEmail: '',
    position: '',
    resumeText: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) {
      return;
    }
    
    // Validation
    if (!formData.candidateName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!formData.candidateEmail.trim() || !formData.candidateEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!formData.position.trim()) {
      toast.error('Please enter the position you\'re applying for');
      return;
    }
    if (!formData.resumeText.trim()) {
      toast.error('Please provide your resume/experience details');
      return;
    }

    setIsSubmitting(true);

    try {
      // Send to n8n webhook ONLY (let n8n handle everything)
      if (webhookUrl && webhookUrl !== 'YOUR_N8N_WEBHOOK_URL_HERE') {
        // Prepare payload in the required format
        const now = new Date();
        const payload = {
          candidateData: {
            ...formData,
            submittedAt: now.toISOString(),
            status: 'pending',
            email_sent: false,
            email_sent_at: null,
            recruiter_notified: false,
            recruiter_notified_at: null
          },
          timestamp: now.getTime()
        };
        
        console.log('Sending to n8n webhook:', webhookUrl);
        console.log('Payload:', payload);
        
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        if (!webhookResponse.ok) {
          const errorText = await webhookResponse.text();
          console.error('n8n webhook error:', webhookResponse.status, errorText);
          throw new Error(`Webhook error: ${webhookResponse.status} - ${errorText}`);
        }
        
        const responseData = await webhookResponse.json();
        console.log('n8n webhook response:', responseData);
      } else {
        throw new Error('Webhook URL not configured. Please configure it in Settings.');
      }

      toast.success('Application submitted successfully! Check your email for the questionnaire.');
      setSubmitted(true);
      
      // Reset form
      setFormData({
        candidateName: '',
        candidateEmail: '',
        position: '',
        resumeText: ''
      });

      // Reset submitted state after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
      
      // Notify parent component
      onSubmitSuccess();

    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestWithExample = () => {
    setFormData({
      candidateName: 'Prateek Audichya',
      candidateEmail: 'prateek.audi.pa@gmail.com',
      position: 'Software Engineer',
      resumeText: '5 years experience in React, Node.js, and PostgreSQL. Built scalable web applications. Strong in system design.'
    });
    toast.success('Example data loaded!');
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Info Alert */}
      <Alert className="mb-8 border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <div className="ml-3">
          <h3 className="text-blue-900">How it works</h3>
          <p className="text-blue-800 mt-1">
            After submitting your details, an access code will be generated and sent to your registered email. 
            Enter this code in the Questionnaire tab to unlock the questions. 
            Make sure to check your spam folder if you don't see the email.
            Try to answer the questions in brief and to the point for the best results.
            </p>
        </div>
      </Alert>

      {/* Success Message */}
      {submitted && (
        <Alert className="mb-8 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <div className="ml-3">
            <h3 className="text-green-900">Application Submitted!</h3>
            <p className="text-green-800 mt-1">
              Check your email inbox for the questionnaire. Make sure to check your spam folder if you don't see it.
            </p>
          </div>
        </Alert>
      )}

      {/* Main Form Card */}
      <Card className="p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Candidate Name */}
          <div className="space-y-2">
            <Label htmlFor="candidateName" className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              Full Name
            </Label>
            <Input
              id="candidateName"
              name="candidateName"
              type="text"
              placeholder="Enter your full name"
              value={formData.candidateName}
              onChange={handleInputChange}
              className="w-full"
              disabled={isSubmitting}
            />
          </div>

          {/* Candidate Email */}
          <div className="space-y-2">
            <Label htmlFor="candidateEmail" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              Email Address
            </Label>
            <Input
              id="candidateEmail"
              name="candidateEmail"
              type="email"
              placeholder="your.email@example.com"
              value={formData.candidateEmail}
              onChange={handleInputChange}
              className="w-full"
              disabled={isSubmitting}
            />
            <p className="text-gray-500 text-sm">
              You'll receive the questionnaire at this email address
            </p>
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label htmlFor="position" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-gray-500" />
              Position Applying For
            </Label>
            <Input
              id="position"
              name="position"
              type="text"
              placeholder="e.g., Software Engineer, Data Scientist, Product Manager"
              value={formData.position}
              onChange={handleInputChange}
              className="w-full"
              disabled={isSubmitting}
            />
          </div>

          {/* Resume Text */}
          <div className="space-y-2">
            <Label htmlFor="resumeText" className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              Resume Summary / Experience
            </Label>
            <Textarea
              id="resumeText"
              name="resumeText"
              placeholder="Provide a summary of your experience, skills, and qualifications. Include years of experience, key technologies, projects, and achievements."
              value={formData.resumeText}
              onChange={handleInputChange}
              className="w-full min-h-[150px] resize-y"
              disabled={isSubmitting}
            />
            <p className="text-gray-500 text-sm">
              The more detailed your resume, the better tailored your questionnaire will be
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleTestWithExample}
              disabled={isSubmitting}
              className="sm:w-auto"
            >
              Load Example Data
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}