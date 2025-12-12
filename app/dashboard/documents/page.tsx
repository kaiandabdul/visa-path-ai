"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import {
  CloudUploadIcon,
  FileTextIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  LanguagesIcon,
  HeartPulseIcon,
  ShieldCheckIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  type: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string | null;
  status: string;
  aiAnalysis: string | null;
  createdAt: string;
}

const documentTypes = [
  {
    type: "passport",
    name: "Passport",
    description: "Valid passport with at least 6 months validity",
    required: true,
    icon: FileTextIcon,
  },
  {
    type: "degree",
    name: "Educational Degree",
    description: "Bachelor's, Master's, or PhD certificate",
    required: true,
    icon: GraduationCapIcon,
  },
  {
    type: "resume",
    name: "Resume / CV",
    description: "Employment letters and work experience proof",
    required: true,
    icon: BriefcaseIcon,
  },
  {
    type: "transcript",
    name: "Transcripts",
    description: "Academic transcripts and grade records",
    required: false,
    icon: FileTextIcon,
  },
  {
    type: "recommendation",
    name: "Language Certificate",
    description: "IELTS, TOEFL, or equivalent language test results",
    required: false,
    icon: LanguagesIcon,
  },
  {
    type: "financial",
    name: "Financial Documents",
    description: "Bank statements and proof of funds",
    required: false,
    icon: ShieldCheckIcon,
  },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user ID from localStorage (demo mode)
  const getUserId = () => {
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      const profile = JSON.parse(stored);
      return profile.email || "demo-user";
    }
    return "demo-user";
  };

  // Fetch documents (mock for now since we don't have real file storage)
  useEffect(() => {
    const fetchDocuments = async () => {
      // In a real app, fetch from API
      // For now, load from localStorage
      const stored = localStorage.getItem("userDocuments");
      if (stored) {
        setDocuments(JSON.parse(stored));
      }
      setIsLoading(false);
    };

    fetchDocuments();
  }, []);

  const getDocumentByType = (type: string) => {
    return documents.find((d) => d.type === type);
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    docType: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await uploadFile(file, docType);
  };

  const handleDrop = async (event: React.DragEvent, docType: string) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      await uploadFile(file, docType);
    }
  };

  const uploadFile = async (file: File, docType: string) => {
    setUploadingType(docType);

    // Simulate upload and processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      type: docType,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file), // In real app, this would be S3/Vercel Blob URL
      fileSize: file.size,
      mimeType: file.type,
      status: "completed",
      aiAnalysis: `Document "${file.name}" has been successfully uploaded and verified.`,
      createdAt: new Date().toISOString(),
    };

    const updatedDocs = [
      ...documents.filter((d) => d.type !== docType),
      newDoc,
    ];
    setDocuments(updatedDocs);
    localStorage.setItem("userDocuments", JSON.stringify(updatedDocs));

    setUploadingType(null);
  };

  const handleDelete = (docId: string) => {
    const updatedDocs = documents.filter((d) => d.id !== docId);
    setDocuments(updatedDocs);
    localStorage.setItem("userDocuments", JSON.stringify(updatedDocs));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircleIcon className="mr-1 h-3 w-3" /> Verified
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="secondary">
            <ClockIcon className="mr-1 h-3 w-3" /> Processing
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive">
            <XCircleIcon className="mr-1 h-3 w-3" /> Error
          </Badge>
        );
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const completedCount = documents.filter(
    (d) => d.status === "completed"
  ).length;
  const requiredCount = documentTypes.filter((d) => d.required).length;
  const progress = (completedCount / documentTypes.length) * 100;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Spinner className="size-8" />
        <p className="text-muted-foreground">Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Document Management</h1>
        <p className="text-muted-foreground">
          Upload your documents for AI-powered analysis and verification
        </p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Upload Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              {completedCount} of {documentTypes.length} documents uploaded
            </span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          {completedCount < requiredCount && (
            <p className="text-sm text-orange-500 mt-2">
              ⚠️ {requiredCount - Math.min(completedCount, requiredCount)}{" "}
              required documents still needed
            </p>
          )}
        </CardContent>
      </Card>

      {/* Document Types */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Documents</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documentTypes.map((docType) => {
            const Icon = docType.icon;
            const existingDoc = getDocumentByType(docType.type);
            const isUploading = uploadingType === docType.type;

            return (
              <Card
                key={docType.type}
                className={cn(
                  "transition-colors",
                  dragOver && "border-primary/50",
                  existingDoc && "border-green-500/30 bg-green-50/50"
                )}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => handleDrop(e, docType.type)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "rounded-lg p-2",
                        existingDoc
                          ? "bg-green-100 text-green-700"
                          : "bg-primary/10 text-primary"
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{docType.name}</h3>
                        {docType.required && !existingDoc && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {docType.description}
                      </p>

                      {existingDoc ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            {getStatusBadge(existingDoc.status)}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(existingDoc.id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {existingDoc.fileName} (
                            {formatFileSize(existingDoc.fileSize)})
                          </p>
                        </div>
                      ) : isUploading ? (
                        <div className="flex items-center gap-2">
                          <Spinner className="size-4" />
                          <span className="text-sm text-muted-foreground">
                            Uploading...
                          </span>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileSelect(e, docType.type)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <CloudUploadIcon className="mr-2 h-4 w-4" />
                            Upload
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Document Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Ensure all documents are clear and readable</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Use official translations for non-English documents</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Check expiration dates before uploading</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Maximum file size: 10MB per document</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
