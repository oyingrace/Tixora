'use client'

import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import { Loader2, Camera, X } from 'lucide-react';
import { toast } from 'sonner';
import { captureScreenshot } from '@/lib/feedback-utils';

type FeedbackType = 'bug' | 'suggestion' | 'feature' | 'other';

interface FeedbackFormProps {
  onSuccess: () => void;
}

export function FeedbackForm({ onSuccess }: FeedbackFormProps) {
  const [type, setType] = useState<FeedbackType>('suggestion');
  const [message, setMessage] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [includeScreenshot, setIncludeScreenshot] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const handleScreenshot = async () => {
    try {
      setIsCapturing(true);
      const screenshotData = await captureScreenshot();
      if (screenshotData) {
        setScreenshot(screenshotData);
      }
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
      toast.error('Failed to capture screenshot');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Please enter your feedback');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          message,
          screenshot: includeScreenshot ? screenshot : null,
          url: window.location.href,
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to submit feedback');
      
      toast.success('Thank you for your feedback!');
      onSuccess();
      setMessage('');
      setScreenshot(null);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={formRef} className="p-4 space-y-4">
      <div className="space-y-2">
        <Label>Feedback Type</Label>
        <RadioGroup 
          value={type} 
          onValueChange={(value) => setType(value as FeedbackType)}
          className="grid grid-cols-2 gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bug" id="bug" />
            <Label htmlFor="bug">Bug</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="suggestion" id="suggestion" />
            <Label htmlFor="suggestion">Suggestion</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="feature" id="feature" />
            <Label htmlFor="feature">Feature Request</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other">Other</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Your Feedback</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what's on your mind..."
          rows={4}
          className="min-h-[100px]"
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="include-screenshot" 
            checked={includeScreenshot}
            onCheckedChange={(checked) => setIncludeScreenshot(checked as boolean)}
            disabled={isSubmitting}
          />
          <Label htmlFor="include-screenshot">Include screenshot</Label>
        </div>

        {includeScreenshot && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleScreenshot}
                disabled={isCapturing || isSubmitting}
              >
                {isCapturing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="mr-2 h-4 w-4" />
                )}
                {screenshot ? 'Retake' : 'Take'} Screenshot
              </Button>
              {screenshot && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setScreenshot(null)}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4 mr-1" /> Remove
                </Button>
              )}
            </div>
            
            {screenshot && (
              <div className="border rounded-md overflow-hidden">
                <img 
                  src={screenshot} 
                  alt="Screenshot preview" 
                  className="w-full h-auto max-h-40 object-contain"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button 
          type="submit" 
          onClick={handleSubmit}
          disabled={isSubmitting || !message.trim()}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Feedback'
          )}
        </Button>
      </div>
    </div>
  );
}
