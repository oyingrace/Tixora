import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'open' | 'in_progress' | 'resolved' | 'closed' | null;
    
    const where = status ? { status } : {};
    
    const feedback = await prisma.feedback.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, message, screenshot, url, userAgent, viewport } = body;

    // Save feedback to database
    const feedback = await prisma.feedback.create({
      data: {
        type,
        message,
        screenshot,
        url,
        userAgent,
        viewport: JSON.stringify(viewport),
        status: 'open',
      },
    });

    // In a real app, you might want to:
    // 1. Send email notification to support
    // 2. Post to a Slack/Teams channel
    // 3. Create a ticket in your support system

    return NextResponse.json({ success: true, id: feedback.id });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
