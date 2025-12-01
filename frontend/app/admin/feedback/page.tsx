'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, MessageSquare, Check, X, Inbox, Clock, CheckCircle, XCircle } from 'lucide-react';
import { FeedbackList } from '@/components/feedback/FeedbackList';

type FeedbackStatus = 'all' | 'open' | 'in_progress' | 'resolved' | 'closed';

export default function FeedbackAdminPage() {
  const [activeTab, setActiveTab] = useState<FeedbackStatus>('open');
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackCounts, setFeedbackCounts] = useState({
    all: 0,
    open: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
  });

  const statusIcons = {
    open: <Inbox className="h-4 w-4" />,
    in_progress: <RefreshCw className="h-4 w-4 animate-spin" />,
    resolved: <CheckCircle className="h-4 w-4 text-green-500" />,
    closed: <XCircle className="h-4 w-4 text-gray-500" />,
  };

  const statusLabels = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
  };

  const statusColors = {
    open: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
  };

  useEffect(() => {
    fetchFeedbackCounts();
  }, []);

  const fetchFeedbackCounts = async () => {
    try {
      const response = await fetch('/api/feedback/counts');
      if (response.ok) {
        const data = await response.json();
        setFeedbackCounts(data);
      }
    } catch (error) {
      console.error('Error fetching feedback counts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchFeedbackCounts();
      }
    } catch (error) {
      console.error('Error updating feedback status:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Feedback Dashboard</h1>
          <p className="text-muted-foreground">
            Review and manage user feedback
          </p>
        </div>
        <Button variant="outline" onClick={fetchFeedbackCounts} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {Object.entries(feedbackCounts).map(([key, count]) => {
          if (key === 'all') return null;
          return (
            <Card key={key}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {statusLabels[key as keyof typeof statusLabels]}
                </CardTitle>
                <div className={`p-2 rounded-full ${statusColors[key as keyof typeof statusColors].split(' ')[0]}`}>
                  {statusIcons[key as keyof typeof statusIcons]}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">
                  {key === 'open' ? 'Needs attention' : `Marked as ${key.replace('_', ' ')}`}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FeedbackStatus)}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  All
                  <Badge variant="secondary" className="ml-1">
                    {feedbackCounts.all}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="open" className="flex items-center gap-2">
                  <Inbox className="h-4 w-4" />
                  Open
                  <Badge variant="secondary" className="ml-1">
                    {feedbackCounts.open}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="in_progress" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  In Progress
                  <Badge variant="secondary" className="ml-1">
                    {feedbackCounts.in_progress}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="resolved" className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Resolved
                  <Badge variant="secondary" className="ml-1">
                    {feedbackCounts.resolved}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="closed" className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Closed
                  <Badge variant="secondary" className="ml-1">
                    {feedbackCounts.closed}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-6">
              <FeedbackList 
                status={activeTab === 'all' ? undefined : activeTab} 
                onStatusChange={handleStatusChange}
              />
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
}
