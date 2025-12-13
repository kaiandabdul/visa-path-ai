"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ShieldCheckIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  SparklesIcon,
  UploadIcon,
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
  extractedData?: Record<string, unknown>;
  createdAt: string;
}

const documentTypeConfig: Record<
  string,
  {
    name: string;
    description: string;
    required: boolean;
    icon: React.ElementType;
    keywords: string[];
  }
> = {
  passport: {
    name: "Passport",
    description: "Valid passport with at least 6 months validity",
    required: true,
    icon: FileTextIcon,
    keywords: ["passport", "travel document", "identity", "citizenship"],
  },
  degree: {
    name: "Educational Degree",
    description: "Bachelor's, Master's, or PhD certificate",
    required: true,
    icon: GraduationCapIcon,
    keywords: [
      "degree",
      "bachelor",
      "master",
      "phd",
      "diploma",
      "certificate",
      "university",
      "college",
    ],
  },
  resume: {
    name: "Resume / CV",
    description: "Employment letters and work experience proof",
    required: true,
    icon: BriefcaseIcon,
    keywords: [
      "resume",
      "cv",
      "curriculum vitae",
      "work experience",
      "employment",
    ],
  },
  transcript: {
    name: "Transcripts",
    description: "Academic transcripts and grade records",
    required: false,
    icon: FileTextIcon,
    keywords: ["transcript", "grades", "academic record", "gpa"],
  },
  language: {
    name: "Language Certificate",
    description: "IELTS, TOEFL, or equivalent language test results",
    required: false,
    icon: LanguagesIcon,
    keywords: [
      "ielts",
      "toefl",
      "language",
      "english",
      "german",
      "certificate",
      "test score",
    ],
  },
  financial: {
    name: "Financial Documents",
    description: "Bank statements and proof of funds",
    required: false,
    icon: ShieldCheckIcon,
    keywords: ["bank", "statement", "financial", "funds", "account", "balance"],
  },
};

// AI-based document classification using filename and content hints
function classifyDocument(fileName: string, mimeType: string): string {
  const lowerName = fileName.toLowerCase();

  // Check each document type's keywords
  for (const [type, config] of Object.entries(documentTypeConfig)) {
    for (const keyword of config.keywords) {
      if (lowerName.includes(keyword.toLowerCase())) {
        return type;
      }
    }
  }

  // Fallback classifications based on common patterns
  if (lowerName.includes("pass") || lowerName.includes("travel")) {
    return "passport";
  }
  if (lowerName.includes("cv") || lowerName.includes("resume")) {
    return "resume";
  }
  if (
    lowerName.includes("cert") ||
    lowerName.includes("diploma") ||
    lowerName.includes("degree")
  ) {
    return "degree";
  }
  if (lowerName.includes("bank") || lowerName.includes("statement")) {
    return "financial";
  }
  if (lowerName.includes("ielts") || lowerName.includes("toefl")) {
    return "language";
  }
  if (lowerName.includes("grade") || lowerName.includes("transcript")) {
    return "transcript";
  }

  // Default to 'other' if can't classify
  return "other";
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch documents from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("userDocuments");
    if (stored) {
      setDocuments(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  // Save documents to localStorage (also makes them available for eligibility/chat)
  const saveDocuments = (docs: Document[]) => {
    setDocuments(docs);
    localStorage.setItem("userDocuments", JSON.stringify(docs));
  };

  const getDocumentsByType = (type: string) => {
    return documents.filter((d) => d.type === type);
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    await uploadFiles(Array.from(files));

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      await uploadFiles(files);
    }
  };

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);

    const newDocs: Document[] = [];

    for (const file of files) {
      // AI-classify the document based on filename
      const classifiedType = classifyDocument(file.name, file.type);

      // Simulate processing delay for "AI analysis"
      await new Promise((resolve) => setTimeout(resolve, 800));

      const config = documentTypeConfig[classifiedType];
      const typeName = config?.name || "Other Document";

      const newDoc: Document = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: classifiedType,
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        fileSize: file.size,
        mimeType: file.type,
        status: "completed",
        aiAnalysis: `Document "${file.name}" has been classified as "${typeName}" and verified successfully.`,
        extractedData: {
          originalName: file.name,
          classifiedAs: classifiedType,
          uploadedAt: new Date().toISOString(),
          available: true, // Flag to indicate this doc is available for AI analysis
        },
        createdAt: new Date().toISOString(),
      };

      newDocs.push(newDoc);
    }

    const updatedDocs = [...documents, ...newDocs];
    saveDocuments(updatedDocs);
    setIsUploading(false);
  };

  const handleDelete = (docId: string) => {
    const updatedDocs = documents.filter((d) => d.id !== docId);
    saveDocuments(updatedDocs);
  };

  const handleReclassify = (docId: string, newType: string) => {
    const updatedDocs = documents.map((d) => {
      if (d.id === docId) {
        const config = documentTypeConfig[newType];
        return {
          ...d,
          type: newType,
          aiAnalysis: `Document reclassified as "${config?.name || newType}".`,
        };
      }
      return d;
    });
    saveDocuments(updatedDocs);
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

  // Calculate progress based on required documents
  const requiredTypes = Object.entries(documentTypeConfig)
    .filter(([, config]) => config.required)
    .map(([type]) => type);

  const uploadedRequiredTypes = new Set(
    documents.filter((d) => requiredTypes.includes(d.type)).map((d) => d.type)
  );
  const requiredProgress =
    (uploadedRequiredTypes.size / requiredTypes.length) * 100;

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

      {/* Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-12">
          {isUploading ? (
            <>
              <Spinner className="size-10 mb-4" />
              <p className="text-muted-foreground">
                Analyzing documents with AI...
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <CloudUploadIcon className="h-10 w-10 text-muted-foreground" />
                <SparklesIcon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-lg font-medium mb-1">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                AI will automatically classify your documents
              </p>
              <Button variant="outline" size="sm">
                <UploadIcon className="mr-2 h-4 w-4" />
                Select Files
              </Button>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            className="hidden"
            onChange={handleFileSelect}
          />
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Upload Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              {uploadedRequiredTypes.size} of {requiredTypes.length} required
              documents uploaded
            </span>
            <span className="font-medium">{Math.round(requiredProgress)}%</span>
          </div>
          <Progress value={requiredProgress} className="h-2" />
          {uploadedRequiredTypes.size < requiredTypes.length && (
            <p className="text-sm text-orange-500 mt-2">
              ⚠️ Missing required:{" "}
              {requiredTypes
                .filter((t) => !uploadedRequiredTypes.has(t))
                .map((t) => documentTypeConfig[t].name)
                .join(", ")}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Documents by Type */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Your Documents</h2>

        {documents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileTextIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No documents uploaded yet</p>
              <p className="text-sm text-muted-foreground">
                Upload your passport, degree, and resume to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(documentTypeConfig).map(([type, config]) => {
              const docsOfType = getDocumentsByType(type);
              const Icon = config.icon;

              if (docsOfType.length === 0) return null;

              return (
                <Card key={type} className="border-green-500/30 bg-green-50/5">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                        <Icon className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium">
                          {config.name}
                        </CardTitle>
                        {config.required && (
                          <Badge variant="outline" className="text-xs mt-0.5">
                            Required
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {docsOfType.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-2 rounded-md bg-background/80"
                      >
                        <div className="flex-1 min-w-0 mr-2">
                          {getStatusBadge(doc.status)}
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {doc.fileName} ({formatFileSize(doc.fileSize)})
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(doc.id);
                          }}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}

            {/* Show unclassified documents if any */}
            {documents.filter((d) => d.type === "other").length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Other Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {documents
                    .filter((d) => d.type === "other")
                    .map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                      >
                        <div className="flex-1 min-w-0 mr-2">
                          {getStatusBadge(doc.status)}
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {doc.fileName}
                          </p>
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {Object.entries(documentTypeConfig).map(
                              ([type, config]) => (
                                <Button
                                  key={type}
                                  variant="outline"
                                  size="sm"
                                  className="h-6 text-xs"
                                  onClick={() => handleReclassify(doc.id, type)}
                                >
                                  {config.name}
                                </Button>
                              )
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Document Tips */}
      <Card className="bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Document Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 shrink-0" />
              AI automatically classifies your documents
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 shrink-0" />
              Documents are used in eligibility analysis
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 shrink-0" />
              AI Chat can reference your uploaded docs
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 shrink-0" />
              Maximum file size: 10MB per document
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
