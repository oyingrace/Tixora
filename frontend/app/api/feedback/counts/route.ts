import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [all, open, in_progress, resolved, closed] = await Promise.all([
      prisma.feedback.count(),
      prisma.feedback.count({ where: { status: 'open' } }),
      prisma.feedback.count({ where: { status: 'in_progress' } }),
      prisma.feedback.count({ where: { status: 'resolved' } }),
      prisma.feedback.count({ where: { status: 'closed' } }),
    ]);

    return NextResponse.json({
      all,
      open,
      in_progress,
      resolved,
      closed,
    });
  } catch (error) {
    console.error('Error fetching feedback counts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback counts' },
      { status: 500 }
    );
  }
}
