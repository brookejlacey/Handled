'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, Button, Badge } from '@/components/ui';
import api from '@/lib/api';
import { formatDate, cn } from '@/lib/utils';
import {
  Upload,
  FileText,
  Image,
  File,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  Eye,
  Download,
  X,
  Sparkles,
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'uploading' | 'processing' | 'analyzed' | 'failed';
  createdAt: string;
  analysis?: {
    summary: string;
    insights: string[];
    recommendations: string[];
  };
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([
    // Mock data for demo
    {
      id: '1',
      name: 'Bank Statement - January 2024.pdf',
      type: 'bank_statement',
      status: 'analyzed',
      createdAt: '2024-01-15T10:30:00Z',
      analysis: {
        summary: 'Monthly bank statement showing regular income deposits and expenses.',
        insights: [
          'Average monthly spending: $3,450',
          'Largest expense category: Dining ($680)',
          'Recurring subscriptions: $127/month',
        ],
        recommendations: [
          'Consider reviewing subscription services for potential savings',
          'Your dining expenses are 20% of total spending - consider meal planning',
        ],
      },
    },
    {
      id: '2',
      name: 'Credit Card Statement.pdf',
      type: 'credit_card_statement',
      status: 'processing',
      createdAt: '2024-01-20T14:20:00Z',
    },
  ]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);

    for (const file of acceptedFiles) {
      const newDoc: Document = {
        id: Date.now().toString(),
        name: file.name,
        type: 'unknown',
        status: 'uploading',
        createdAt: new Date().toISOString(),
      };

      setDocuments((prev) => [newDoc, ...prev]);

      try {
        // Simulate upload
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setDocuments((prev) =>
          prev.map((d) =>
            d.id === newDoc.id ? { ...d, status: 'processing' } : d
          )
        );

        // Simulate processing
        await new Promise((resolve) => setTimeout(resolve, 3000));

        setDocuments((prev) =>
          prev.map((d) =>
            d.id === newDoc.id
              ? {
                  ...d,
                  status: 'analyzed',
                  analysis: {
                    summary: 'Document has been analyzed successfully.',
                    insights: ['Analysis complete'],
                    recommendations: ['Review the extracted information'],
                  },
                }
              : d
          )
        );
      } catch (error) {
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === newDoc.id ? { ...d, status: 'failed' } : d
          )
        );
      }
    }

    setIsUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const getFileIcon = (type: string) => {
    if (type.startsWith('image')) return <Image className="w-5 h-5" />;
    if (type === 'pdf' || type.includes('pdf')) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const getStatusBadge = (status: Document['status']) => {
    const config = {
      uploading: { variant: 'info' as const, icon: Clock, text: 'Uploading' },
      processing: { variant: 'warning' as const, icon: Clock, text: 'Analyzing' },
      analyzed: { variant: 'success' as const, icon: CheckCircle2, text: 'Analyzed' },
      failed: { variant: 'error' as const, icon: AlertCircle, text: 'Failed' },
    };

    const { variant, icon: Icon, text } = config[status];
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {text}
      </Badge>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Documents</h1>
        <p className="text-text-secondary">Upload financial documents for AI analysis</p>
      </div>

      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
          isDragActive
            ? 'border-brand-green bg-brand-green-lighter/30'
            : 'border-border hover:border-brand-green hover:bg-surface-muted'
        )}
      >
        <input {...getInputProps()} />
        <div className="w-16 h-16 bg-brand-green-lighter rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Upload className={cn('w-8 h-8 text-brand-green', isDragActive && 'animate-bounce')} />
        </div>
        {isDragActive ? (
          <p className="text-lg font-medium text-brand-green">Drop your files here</p>
        ) : (
          <>
            <p className="text-lg font-medium text-text-primary mb-1">
              Drag & drop files here, or click to browse
            </p>
            <p className="text-text-secondary text-sm">
              Supports PDF, PNG, JPG up to 10MB
            </p>
          </>
        )}
      </div>

      {/* Document List */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Your Documents</h2>

          {documents.length === 0 ? (
            <Card padding="lg" className="text-center">
              <div className="w-12 h-12 bg-surface-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-text-muted" />
              </div>
              <h3 className="font-semibold text-text-primary mb-1">No documents yet</h3>
              <p className="text-text-secondary text-sm">
                Upload your first document to get AI-powered insights
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <Card
                  key={doc.id}
                  hover
                  padding="md"
                  className={cn(
                    'cursor-pointer transition-all',
                    selectedDoc?.id === doc.id && 'ring-2 ring-brand-green'
                  )}
                  onClick={() => setSelectedDoc(doc)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-green-lighter rounded-lg flex items-center justify-center text-brand-green flex-shrink-0">
                      {getFileIcon(doc.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-text-primary truncate">{doc.name}</h3>
                        {getStatusBadge(doc.status)}
                      </div>
                      <p className="text-sm text-text-secondary">
                        Uploaded {formatDate(doc.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.status === 'analyzed' && (
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-status-error hover:text-status-error">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Analysis Panel */}
        <div className="lg:col-span-1">
          {selectedDoc ? (
            <Card padding="none" className="sticky top-24">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-text-primary">Analysis</h3>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-1 hover:bg-surface-muted rounded-lg"
                >
                  <X className="w-4 h-4 text-text-muted" />
                </button>
              </div>

              {selectedDoc.status === 'analyzed' && selectedDoc.analysis ? (
                <div className="p-4 space-y-4">
                  {/* Summary */}
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-2">Summary</h4>
                    <p className="text-sm text-text-secondary">{selectedDoc.analysis.summary}</p>
                  </div>

                  {/* Insights */}
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-2">Key Insights</h4>
                    <ul className="space-y-2">
                      {selectedDoc.analysis.insights.map((insight, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                          <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-brand-green-lighter/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-brand-green" />
                      <h4 className="text-sm font-medium text-text-primary">Recommendations</h4>
                    </div>
                    <ul className="space-y-2">
                      {selectedDoc.analysis.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-text-secondary">
                          • {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="flex-1">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    <Button size="sm" className="flex-1">
                      Discuss with AI
                    </Button>
                  </div>
                </div>
              ) : selectedDoc.status === 'processing' ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-text-secondary">Analyzing document...</p>
                  <p className="text-sm text-text-muted mt-1">This may take a few moments</p>
                </div>
              ) : selectedDoc.status === 'failed' ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-6 h-6 text-status-error" />
                  </div>
                  <p className="text-text-primary font-medium mb-1">Analysis Failed</p>
                  <p className="text-sm text-text-secondary mb-4">
                    We couldn&apos;t analyze this document. Please try again.
                  </p>
                  <Button variant="secondary" size="sm">Retry Analysis</Button>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Clock className="w-8 h-8 text-text-muted mx-auto mb-2" />
                  <p className="text-text-secondary">Uploading...</p>
                </div>
              )}
            </Card>
          ) : (
            <Card padding="lg" className="bg-gradient-to-br from-brand-green-lighter to-surface-cream border-brand-green/20">
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-green rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">AI Document Analysis</h3>
                <p className="text-sm text-text-secondary">
                  Upload bank statements, credit card bills, tax documents, and more. Our AI will extract insights and provide personalized recommendations.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
