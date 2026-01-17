import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { createAdminClient } from '@/lib/supabase/server';
import { analyzeDocument } from '@/lib/claude';
import {
  getAuthenticatedUser,
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
  serverErrorResponse,
} from '@/lib/api-utils';
import { DocumentCategory, AnalysisStatus } from '@prisma/client';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/documents/[id] - Get document details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { dbUser, error } = await getAuthenticatedUser();
    if (error || !dbUser) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    const document = await prisma.document.findFirst({
      where: {
        id,
        userId: dbUser.id,
      },
    });

    if (!document) {
      return notFoundResponse('Document not found');
    }

    // Generate signed URL for download
    const supabase = createAdminClient();
    const { data: signedUrl } = await supabase.storage
      .from('documents')
      .createSignedUrl(document.storagePath, 3600); // 1 hour expiry

    return successResponse({
      ...document,
      downloadUrl: signedUrl?.signedUrl || null,
    });
  } catch (err) {
    console.error('Error fetching document:', err);
    return serverErrorResponse();
  }
}

// PATCH /api/documents/[id] - Update document metadata or trigger analysis
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { dbUser, error } = await getAuthenticatedUser();
    if (error || !dbUser) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const body = await request.json();

    const document = await prisma.document.findFirst({
      where: { id, userId: dbUser.id },
    });

    if (!document) {
      return notFoundResponse('Document not found');
    }

    // Check if this is a request to trigger analysis
    if (body.analyze === true) {
      if (document.analysisStatus === AnalysisStatus.PROCESSING) {
        return errorResponse('Analysis already in progress');
      }

      // Download file from storage for analysis
      const supabase = createAdminClient();
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('documents')
        .download(document.storagePath);

      if (downloadError || !fileData) {
        return errorResponse('Failed to retrieve document for analysis');
      }

      // Update status to processing
      await prisma.document.update({
        where: { id },
        data: { analysisStatus: AnalysisStatus.PROCESSING },
      });

      // Run analysis
      try {
        const arrayBuffer = await fileData.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const mediaType = document.fileType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' | 'application/pdf';

        const analysis = await analyzeDocument(base64, mediaType, document.fileName);

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

        const updatedDocument = await prisma.document.update({
          where: { id },
          data: {
            analysisStatus: AnalysisStatus.COMPLETED,
            analysisResult: JSON.parse(JSON.stringify(analysis)),
            analyzedAt: new Date(),
            category: category || document.category,
          },
        });

        return successResponse(updatedDocument);
      } catch (analysisError) {
        console.error('Analysis failed:', analysisError);

        await prisma.document.update({
          where: { id },
          data: { analysisStatus: AnalysisStatus.FAILED },
        });

        return errorResponse('Document analysis failed');
      }
    }

    // Regular metadata update
    const updateData: Record<string, unknown> = {};

    if (body.category !== undefined) {
      if (body.category && !Object.values(DocumentCategory).includes(body.category)) {
        return errorResponse(`Invalid category: ${body.category}`);
      }
      updateData.category = body.category;
    }
    if (body.description !== undefined) {
      updateData.description = body.description;
    }

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: updateData,
    });

    return successResponse(updatedDocument);
  } catch (err) {
    console.error('Error updating document:', err);
    return serverErrorResponse();
  }
}

// DELETE /api/documents/[id] - Delete document
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { dbUser, error } = await getAuthenticatedUser();
    if (error || !dbUser) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    const document = await prisma.document.findFirst({
      where: { id, userId: dbUser.id },
    });

    if (!document) {
      return notFoundResponse('Document not found');
    }

    // Delete from storage
    const supabase = createAdminClient();
    await supabase.storage.from('documents').remove([document.storagePath]);

    // Delete from database
    await prisma.document.delete({
      where: { id },
    });

    return successResponse({ deleted: true });
  } catch (err) {
    console.error('Error deleting document:', err);
    return serverErrorResponse();
  }
}
