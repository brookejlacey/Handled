import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { createAdminClient } from '@/lib/supabase/server';
import { analyzeDocument } from '@/lib/claude';
import {
  getAuthenticatedUser,
  successResponse,
  errorResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@/lib/api-utils';
import { DocumentCategory, AnalysisStatus } from '@prisma/client';

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// GET /api/documents - List documents
export async function GET(request: NextRequest) {
  try {
    const { dbUser, error } = await getAuthenticatedUser();
    if (error || !dbUser) {
      return unauthorizedResponse();
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') as DocumentCategory | null;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = { userId: dbUser.id };
    if (category) where.category = category;

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.document.count({ where }),
    ]);

    return successResponse({ documents, total, limit, offset });
  } catch (err) {
    console.error('Error fetching documents:', err);
    return serverErrorResponse();
  }
}

// POST /api/documents - Upload document
export async function POST(request: NextRequest) {
  try {
    const { dbUser, error } = await getAuthenticatedUser();
    if (error || !dbUser) {
      return unauthorizedResponse();
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as DocumentCategory | null;
    const description = formData.get('description') as string | null;
    const autoAnalyze = formData.get('autoAnalyze') === 'true';

    if (!file) {
      return errorResponse('No file provided');
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse(`Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`);
    }

    if (file.size > MAX_FILE_SIZE) {
      return errorResponse(`File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    // Upload to Supabase Storage
    const supabase = createAdminClient();
    const fileExtension = file.name.split('.').pop();
    const storagePath = `${dbUser.id}/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return errorResponse('Failed to upload file');
    }

    // Create document record
    const document = await prisma.document.create({
      data: {
        userId: dbUser.id,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        storagePath,
        category: category || null,
        description: description || null,
        analysisStatus: autoAnalyze ? AnalysisStatus.PROCESSING : AnalysisStatus.PENDING,
      },
    });

    // If auto-analyze is requested, start analysis in background
    if (autoAnalyze) {
      // Start async analysis (don't await)
      analyzeDocumentAsync(document.id, file, storagePath).catch((err) => {
        console.error('Background analysis error:', err);
      });
    }

    return successResponse(document, 201);
  } catch (err) {
    console.error('Error uploading document:', err);
    return serverErrorResponse();
  }
}

// Background document analysis
async function analyzeDocumentAsync(
  documentId: string,
  file: File,
  storagePath: string
) {
  try {
    // Read file as base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    // Analyze with Claude
    const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' | 'application/pdf';
    const analysis = await analyzeDocument(base64, mediaType, file.name);

    // Map document type to category
    let category: DocumentCategory | null = null;
    const typeMapping: Record<string, DocumentCategory> = {
      'tax_return': DocumentCategory.TAX_RETURN,
      'bank_statement': DocumentCategory.BANK_STATEMENT,
      'investment_statement': DocumentCategory.INVESTMENT_STATEMENT,
      'insurance_policy': DocumentCategory.INSURANCE_POLICY,
      'will_estate': DocumentCategory.WILL_ESTATE,
      'employment': DocumentCategory.EMPLOYMENT,
      'identification': DocumentCategory.IDENTIFICATION,
    };
    if (analysis.documentType && typeMapping[analysis.documentType]) {
      category = typeMapping[analysis.documentType];
    }

    // Update document with analysis
    await prisma.document.update({
      where: { id: documentId },
      data: {
        analysisStatus: AnalysisStatus.COMPLETED,
        analysisResult: analysis as unknown as Record<string, unknown>,
        analyzedAt: new Date(),
        category: category || undefined,
      },
    });
  } catch (err) {
    console.error('Document analysis failed:', err);

    await prisma.document.update({
      where: { id: documentId },
      data: {
        analysisStatus: AnalysisStatus.FAILED,
      },
    });
  }
}
