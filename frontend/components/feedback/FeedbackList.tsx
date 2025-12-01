'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Check, Clock, MessageSquare, RefreshCw, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

type Feedback = {
  id: string;
  type: string;
  message: string;
  screenshot: string | null;
  url: string | null;
  userAgent: string | null;
  viewport: string | null;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
};

const statusOptions = [
  { value: 'open', label: 'Open', icon: <MessageSquare className="h-4 w-4 mr-2" /> },
  { value: 'in_progress', label: 'In Progress', icon: <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> },
  { value: 'resolved', label: 'Resolved', icon: <Check className="h-4 w-4 mr-2" /> },
  { value: 'closed', label: 'Closed', icon: <X className="h-4 w-4 mr-2" /> },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-blue-100 text-blue-800';
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'resolved':
      return 'bg-green-100 text-green-800';
    case 'closed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'bug':
      return 'bg-red-100 text-red-800';
    case 'suggestion':
      return 'bg-blue-100 text-blue-800';
    case 'feature':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface FeedbackListProps {
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  onStatusChange: (id: string, newStatus: string) => void;
}

export function FeedbackList({ status, onStatusChange }: FeedbackListProps) {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    fetchFeedback();
  }, [status]);

  const fetchFeedback = async () => {
    try {
      setIsLoading(true);
      const url = status 
        ? `/api/feedback?status=${status}`
        : '/api/feedback';
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setFeedback(data);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  const getBrowserInfo = (userAgent: string | null) => {
    if (!userAgent) return 'Unknown';
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    
    return 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading feedback...</span>
      </div>
    );
  }

  if (feedback.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No feedback found</h3>
        <p className="text-sm text-muted-foreground">
          {status === 'open' 
            ? 'No open feedback items. Great job!'
            : `No feedback marked as ${status?.replace('_', ' ') || 'available'}.`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedback.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id}`} />
                  <AvatarFallback>{item.type.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getTypeColor(item.type)}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getBrowserInfo(item.userAgent)}
                    </Badge>
                    {item.url && (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View Page
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(item.status)}>
                  {item.status.replace('_', ' ')}
                </Badge>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {statusOptions.map((option) => (
                      <DropdownMenuItem 
                        key={option.value}
                        onClick={() => onStatusChange(item.id, option.value)}
                        className="flex items-center"
                      >
                        {option.icon}
                        <span>Mark as {option.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="prose prose-sm max-w-none">
              <p>{item.message}</p>
            </div>
            
            {item.screenshot && (
              <div className="mt-4 border rounded-md overflow-hidden">
                <img 
                  src={item.screenshot} 
                  alt="Screenshot" 
                  className="w-full h-auto max-h-60 object-contain bg-gray-50"
                  onClick={() => window.open(item.screenshot || '', '_blank')}
                  style={{ cursor: 'zoom-in' }}
                />
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t flex justify-between items-center text-xs text-muted-foreground">
              <span>ID: {item.id}</span>
              <span>Updated: {formatDate(item.updatedAt)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
