import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

let prisma: PrismaClient;

if (typeof window === 'undefined') {
  // Server-side
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} else {
  // Client-side (shouldn't happen, but for safety)
  prisma = new PrismaClient();
}

export { prisma };

// Helper functions
export async function getCases() {
  return await prisma.case.findMany({
    include: {
      zone: true,
      inspector: true,
      auditLogs: true
    }
  });
}

export async function createCase(data: {
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  status?: string;
  severity?: string;
  imageUrlBefore?: string;
  imageUrlAfter?: string;
  zoneId?: number;
}) {
  return await prisma.case.create({
    data
  });
}

export async function updateCase(id: number, data: Partial<{
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: string;
  severity: string;
  imageUrlBefore: string;
  imageUrlAfter: string;
  zoneId: number;
  inspectorId: number;
}>) {
  return await prisma.case.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date()
    }
  });
}

export async function deleteCase(id: number) {
  return await prisma.case.delete({
    where: { id }
  });
}

export async function getCaseById(id: number) {
  return await prisma.case.findUnique({
    where: { id },
    include: {
      zone: true,
      inspector: true,
      auditLogs: true
    }
  });
}
