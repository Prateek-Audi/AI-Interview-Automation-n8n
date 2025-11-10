import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';
import { RefreshCw, User, Mail, Briefcase, Award, Search, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';

interface Question {
  id: number;
  question: string;
  points?: number;
}

interface Candidate {
  candidateName: string;
  candidateEmail: string;
  position: string;
  resumeText: string;
  submittedAt: string;
  status: 'pending' | 'shortlisted' | 'rejected';
  score: number | null;
  accessCode?: string;
  questions?: Question[];
  questionnaireStatus?: 'waiting_for_questions' | 'ready' | 'completed';
  answers?: { [key: number]: string };
  feedback?: string;
  completedAt?: string;
}

export function AdminDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCandidates, setExpandedCandidates] = useState<Set<number>>(new Set());

  const loadCandidates = async () => {
    setIsLoading(true);
    try {
      const apiBaseUrl = (window as any).API_BASE_URL;
      const apiHeaders = (window as any).API_HEADERS;

      const response = await fetch(`${apiBaseUrl}/api/candidates`, {
        headers: apiHeaders
      });

      if (!response.ok) {
        throw new Error('Failed to load candidates');
      }
      const data = await response.json();
      // Filter out any null or undefined values
      const validCandidates = (data.candidates || []).filter((c: any) => c !== null && c !== undefined);
      setCandidates(validCandidates);
    } catch (error) {
      console.error('Error loading candidates:', error);
      toast.error('Failed to load candidates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const filteredCandidates = candidates.filter(candidate => {
    if (!candidate) return false;
    const search = searchTerm.toLowerCase();
    return (
      candidate.candidateName?.toLowerCase().includes(search) ||
      candidate.candidateEmail?.toLowerCase().includes(search) ||
      candidate.position?.toLowerCase().includes(search)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const stats = {
    total: candidates.filter(c => c !== null && c !== undefined).length,
    shortlisted: candidates.filter(c => c && c.status === 'shortlisted').length,
    rejected: candidates.filter(c => c && c.status === 'rejected').length,
    completed: candidates.filter(c => c && c.questionnaireStatus === 'completed').length,
  };

  const toggleExpanded = (index: number) => {
    setExpandedCandidates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getQuestionnaireStatusBadge = (candidate: Candidate) => {
    if (candidate.questionnaireStatus === 'completed') {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    }
    if (candidate.questionnaireStatus === 'ready') {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <Clock className="h-3 w-3 mr-1" />
          Ready
        </Badge>
      );
    }
    if (candidate.questionnaireStatus === 'waiting_for_questions') {
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Waiting
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="text-gray-500 text-sm mb-1">Total Candidates</div>
          <div className="text-gray-900 text-2xl">{stats.total}</div>
        </Card>
        <Card className="p-6">
          <div className="text-gray-500 text-sm mb-1">Completed</div>
          <div className="text-blue-600 text-2xl">{stats.completed}</div>
        </Card>
        <Card className="p-6">
          <div className="text-gray-500 text-sm mb-1">Shortlisted (12+)</div>
          <div className="text-green-600 text-2xl">{stats.shortlisted}</div>
        </Card>
        <Card className="p-6">
          <div className="text-gray-500 text-sm mb-1">Rejected</div>
          <div className="text-red-600 text-2xl">{stats.rejected}</div>
        </Card>
      </div>

      {/* Search and Refresh */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, email, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={loadCandidates}
          disabled={isLoading}
          variant="outline"
          className="sm:w-auto"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Candidates List */}
      {isLoading ? (
        <Card className="p-12 text-center text-gray-500">
          <div className="inline-block h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p>Loading candidates...</p>
        </Card>
      ) : filteredCandidates.length === 0 ? (
        <Card className="p-12 text-center text-gray-500">
          <p>No candidates found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredCandidates.map((candidate, index) => (
            <Card key={index} className="overflow-hidden">
              <Collapsible
                open={expandedCandidates.has(index)}
                onOpenChange={() => toggleExpanded(index)}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-gray-900">{candidate.candidateName}</h3>
                        <Badge className={getStatusColor(candidate.status)}>
                          {candidate.status}
                        </Badge>
                        {getQuestionnaireStatusBadge(candidate)}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {candidate.candidateEmail}
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          {candidate.position}
                        </div>
                        {candidate.score !== null && candidate.score !== undefined && (
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Score: {candidate.score}/20
                          </div>
                        )}
                      </div>
                    </div>

                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="sm">
                        {expandedCandidates.has(index) ? 'Hide Details' : 'View Details'}
                      </Button>
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent className="mt-6 space-y-4">
                    {/* Resume */}
                    <div className="border-t pt-4">
                      <h4 className="text-gray-700 mb-2">Resume / Experience</h4>
                      <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">
                        {candidate.resumeText}
                      </p>
                    </div>

                    {/* Questions and Answers */}
                    {candidate.questions && candidate.questions.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="text-gray-700 mb-3">Questions & Answers</h4>
                        <div className="space-y-3">
                          {candidate.questions.map((q, qIndex) => (
                            <div key={qIndex} className="bg-gray-50 p-4 rounded">
                              <p className="text-gray-900 mb-2">
                                <span className="font-medium">Q{qIndex + 1}:</span> {q.question}
                                {q.points !== undefined && (
                                  <span className="text-gray-500 text-sm ml-2">({q.points} points)</span>
                                )}
                              </p>
                              {candidate.answers && candidate.answers[q.id] && (
                                <p className="text-gray-700 text-sm pl-4 border-l-2 border-gray-300">
                                  <span className="font-medium">Answer:</span> {candidate.answers[q.id]}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Feedback */}
                    {candidate.feedback && (
                      <div className="border-t pt-4">
                        <h4 className="text-gray-700 mb-2">AI Feedback</h4>
                        <p className="text-gray-600 text-sm bg-blue-50 p-3 rounded border border-blue-200">
                          {candidate.feedback}
                        </p>
                      </div>
                    )}

                    {/* Access Code */}
                    {candidate.accessCode && (
                      <div className="border-t pt-4">
                        <h4 className="text-gray-700 mb-2">Access Code</h4>
                        <code className="text-sm bg-gray-100 px-3 py-1 rounded">
                          {candidate.accessCode}
                        </code>
                      </div>
                    )}
                  </CollapsibleContent>
                </div>
              </Collapsible>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
