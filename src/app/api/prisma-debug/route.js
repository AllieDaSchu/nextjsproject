import { PrismaClient } from '@prisma/client'
import pkg from '@prisma/client/package.json'

const prisma = new PrismaClient();

export const runtime = 'nodejs';

export async function GET() {
    return Response.json({
        prismaClientVersion: pkg.version,
        nodeEnv: process.env.NODE_ENV,
        prismaCliBinaryTargets: process.env.PRISMA_CLI_BINARY_TARGETS ?? null,
        cwd: process.cwd(),
    });
}