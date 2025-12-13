"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  PencilIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentDetails {
  // Passport
  fullName?: string;
  nationality?: string;
  passportNumber?: string;
  dateOfBirth?: string;
  expiryDate?: string;
  // Degree
  degreeType?: string;
  fieldOfStudy?: string;
  institution?: string;
  graduationDate?: string;
  // Resume
  currentTitle?: string;
  yearsExperience?: string;
  skills?: string;
  // Language
  testType?: string;
  overallScore?: string;
  testDate?: string;
  // Financial
  bankName?: string;
  accountBalance?: string;
  currency?: string;
}

interface Document {
  id: string;
  type: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string | null;
  status: string;
  aiAnalysis: string | null;
  details?: DocumentDetails;
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
    fields: Array<{
      key: keyof DocumentDetails;
      label: string;
      type: string;
      placeholder: string;
    }>;
  }
> = {
  passport: {
    name: "Passport",
    description: "Valid passport with at least 6 months validity",
    required: true,
    icon: FileTextIcon,
    keywords: ["passport", "travel document", "identity", "citizenship"],
    fields: [
      {
        key: "fullName",
        label: "Full Name",
        type: "text",
        placeholder: "As shown on passport",
      },
      {
        key: "nationality",
        label: "Nationality",
        type: "text",
        placeholder: "e.g., United States",
      },
      {
        key: "passportNumber",
        label: "Passport Number",
        type: "text",
        placeholder: "e.g., 123456789",
      },
      {
        key: "dateOfBirth",
        label: "Date of Birth",
        type: "date",
        placeholder: "",
      },
      {
        key: "expiryDate",
        label: "Expiry Date",
        type: "date",
        placeholder: "",
      },
    ],
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
    fields: [
      {
        key: "fullName",
        label: "Name on Certificate",
        type: "text",
        placeholder: "Your full name",
      },
      {
        key: "degreeType",
        label: "Degree Type",
        type: "text",
        placeholder: "e.g., Bachelor of Science",
      },
      {
        key: "fieldOfStudy",
        label: "Field of Study",
        type: "text",
        placeholder: "e.g., Computer Science",
      },
      {
        key: "institution",
        label: "Institution",
        type: "text",
        placeholder: "University name",
      },
      {
        key: "graduationDate",
        label: "Graduation Date",
        type: "date",
        placeholder: "",
      },
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
    fields: [
      {
        key: "fullName",
        label: "Full Name",
        type: "text",
        placeholder: "Your full name",
      },
      {
        key: "currentTitle",
        label: "Current Job Title",
        type: "text",
        placeholder: "e.g., Software Engineer",
      },
      {
        key: "yearsExperience",
        label: "Years of Experience",
        type: "text",
        placeholder: "e.g., 5 years",
      },
      {
        key: "skills",
        label: "Key Skills",
        type: "text",
        placeholder: "e.g., JavaScript, Python, AWS",
      },
    ],
  },
  transcript: {
    name: "Transcripts",
    description: "Academic transcripts and grade records",
    required: false,
    icon: FileTextIcon,
    keywords: ["transcript", "grades", "academic record", "gpa"],
    fields: [
      {
        key: "institution",
        label: "Institution",
        type: "text",
        placeholder: "University name",
      },
      {
        key: "fieldOfStudy",
        label: "Program/Major",
        type: "text",
        placeholder: "e.g., Computer Science",
      },
      {
        key: "overallScore",
        label: "GPA / Grade",
        type: "text",
        placeholder: "e.g., 3.8/4.0",
      },
    ],
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
    fields: [
      {
        key: "fullName",
        label: "Candidate Name",
        type: "text",
        placeholder: "Name on certificate",
      },
      {
        key: "testType",
        label: "Test Type",
        type: "text",
        placeholder: "e.g., IELTS Academic",
      },
      {
        key: "overallScore",
        label: "Overall Score",
        type: "text",
        placeholder: "e.g., 7.5",
      },
      { key: "testDate", label: "Test Date", type: "date", placeholder: "" },
      {
        key: "expiryDate",
        label: "Expiry Date",
        type: "date",
        placeholder: "",
      },
    ],
  },
  financial: {
    name: "Financial Documents",
    description: "Bank statements and proof of funds",
    required: false,
    icon: ShieldCheckIcon,
    keywords: ["bank", "statement", "financial", "funds", "account", "balance"],
    fields: [
      {
        key: "bankName",
        label: "Bank Name",
        type: "text",
        placeholder: "e.g., Chase Bank",
      },
      {
        key: "accountBalance",
        label: "Account Balance",
        type: "text",
        placeholder: "e.g., 50,000",
      },
      {
        key: "currency",
        label: "Currency",
        type: "text",
        placeholder: "e.g., USD",
      },
    ],
  },
};

// AI-based document classification using filename
function classifyDocument(fileName: string): string {
  const lowerName = fileName.toLowerCase();

  for (const [type, config] of Object.entries(documentTypeConfig)) {
    for (const keyword of config.keywords) {
      if (lowerName.includes(keyword.toLowerCase())) {
        return type;
      }
    }
  }

  if (lowerName.includes("pass") || lowerName.includes("travel"))
    return "passport";
  if (lowerName.includes("cv") || lowerName.includes("resume")) return "resume";
  if (
    lowerName.includes("cert") ||
    lowerName.includes("diploma") ||
    lowerName.includes("degree")
  )
    return "degree";
  if (lowerName.includes("bank") || lowerName.includes("statement"))
    return "financial";
  if (lowerName.includes("ielts") || lowerName.includes("toefl"))
    return "language";
  if (lowerName.includes("grade") || lowerName.includes("transcript"))
    return "transcript";

  return "other";
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [scanningProgress, setScanningProgress] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [editDetails, setEditDetails] = useState<DocumentDetails>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("userDocuments");
    if (stored) {
      setDocuments(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) await uploadFiles(files);
  };

  // Scan document with AI and extract data
  const scanDocumentWithAI = async (
    file: File,
    suggestedType: string
  ): Promise<{
    type: string;
    details: DocumentDetails;
    summary: string;
    confidence: number;
  }> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", suggestedType);

      const response = await fetch("/api/documents/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Scan failed");
      }

      const result = await response.json();

      if (result.success && result.data) {
        const { documentType, extractedData, summary, confidence } =
          result.data;

        // Map extracted data to our DocumentDetails format
        const details: DocumentDetails = {};
        if (extractedData) {
          if (extractedData.fullName) details.fullName = extractedData.fullName;
          if (extractedData.nationality)
            details.nationality = extractedData.nationality;
          if (extractedData.passportNumber)
            details.passportNumber = extractedData.passportNumber;
          if (extractedData.dateOfBirth)
            details.dateOfBirth = extractedData.dateOfBirth;
          if (extractedData.expiryDate)
            details.expiryDate = extractedData.expiryDate;
          if (extractedData.degreeType)
            details.degreeType = extractedData.degreeType;
          if (extractedData.fieldOfStudy)
            details.fieldOfStudy = extractedData.fieldOfStudy;
          if (extractedData.institution)
            details.institution = extractedData.institution;
          if (extractedData.graduationDate)
            details.graduationDate = extractedData.graduationDate;
          if (extractedData.currentTitle)
            details.currentTitle = extractedData.currentTitle;
          if (extractedData.yearsExperience)
            details.yearsExperience = extractedData.yearsExperience;
          if (extractedData.skills) details.skills = extractedData.skills;
          if (extractedData.testType) details.testType = extractedData.testType;
          if (extractedData.overallScore)
            details.overallScore = extractedData.overallScore;
          if (extractedData.testDate) details.testDate = extractedData.testDate;
          if (extractedData.bankName) details.bankName = extractedData.bankName;
          if (extractedData.accountBalance)
            details.accountBalance = extractedData.accountBalance;
          if (extractedData.currency) details.currency = extractedData.currency;
        }

        return {
          type: documentType || suggestedType,
          details,
          summary: summary || "Document scanned successfully",
          confidence: confidence || 0,
        };
      }

      throw new Error("Invalid response");
    } catch (error) {
      console.error("AI scan failed:", error);
      return {
        type: suggestedType,
        details: {},
        summary: "Could not auto-scan. Please enter details manually.",
        confidence: 0,
      };
    }
  };

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    const newDocs: Document[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const classifiedType = classifyDocument(file.name);

      setScanningProgress(
        `Scanning ${file.name} with AI... (${i + 1}/${files.length})`
      );

      // Call AI to scan and extract data
      const scanResult = await scanDocumentWithAI(file, classifiedType);

      const config = documentTypeConfig[scanResult.type];
      const typeName = config?.name || "Other Document";

      const hasDetails = Object.values(scanResult.details).some(
        (v) => v && v.toString().trim() !== ""
      );

      const newDoc: Document = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: scanResult.type,
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        fileSize: file.size,
        mimeType: file.type,
        status: hasDetails ? "completed" : "pending_details",
        aiAnalysis: scanResult.summary,
        details: scanResult.details,
        createdAt: new Date().toISOString(),
      };

      newDocs.push(newDoc);

      // Open edit dialog so user can review/edit the extracted data
      if (newDocs.length === 1) {
        setEditingDoc(newDoc);
        setEditDetails(scanResult.details);
      }
    }

    const updatedDocs = [...documents, ...newDocs];
    saveDocuments(updatedDocs);
    setIsUploading(false);
    setScanningProgress("");
  };

  const handleDelete = (docId: string) => {
    const updatedDocs = documents.filter((d) => d.id !== docId);
    saveDocuments(updatedDocs);
  };

  const openEditDialog = (doc: Document) => {
    setEditingDoc(doc);
    setEditDetails(doc.details || {});
  };

  const saveDetails = () => {
    if (!editingDoc) return;

    const hasDetails = Object.values(editDetails).some(
      (v) => v && v.toString().trim() !== ""
    );

    const updatedDocs = documents.map((d) => {
      if (d.id === editingDoc.id) {
        return {
          ...d,
          details: editDetails,
          status: hasDetails ? "completed" : "pending_details",
          aiAnalysis: hasDetails
            ? `Document verified with details: ${Object.entries(editDetails)
                .filter(([, v]) => v)
                .map(([k, v]) => `${k}: ${v}`)
                .join(", ")}`
            : d.aiAnalysis,
        };
      }
      return d;
    });

    saveDocuments(updatedDocs);
    setEditingDoc(null);
    setEditDetails({});
  };

  const handleReclassify = (docId: string, newType: string) => {
    const updatedDocs = documents.map((d) => {
      if (d.id === docId) {
        return { ...d, type: newType, details: {} };
      }
      return d;
    });
    saveDocuments(updatedDocs);
  };

  const getStatusBadge = (status: string, hasDetails: boolean) => {
    if (status === "completed" && hasDetails) {
      return (
        <Badge variant="default" className="bg-green-500">
          <CheckCircleIcon className="mr-1 h-3 w-3" /> Verified
        </Badge>
      );
    }
    if (status === "pending_details") {
      return (
        <Badge variant="secondary" className="bg-orange-500/20 text-orange-500">
          <ClockIcon className="mr-1 h-3 w-3" /> Needs Details
        </Badge>
      );
    }
    return <Badge variant="outline">Uploaded</Badge>;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const requiredTypes = Object.entries(documentTypeConfig)
    .filter(([, config]) => config.required)
    .map(([type]) => type);

  const completedRequiredTypes = new Set(
    documents
      .filter((d) => requiredTypes.includes(d.type) && d.status === "completed")
      .map((d) => d.type)
  );
  const requiredProgress =
    (completedRequiredTypes.size / requiredTypes.length) * 100;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Spinner className="size-8" />
        <p className="text-muted-foreground">Loading documents...</p>
      </div>
    );
  }

  const editConfig = editingDoc ? documentTypeConfig[editingDoc.type] : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-serif">Document Management</h1>
        <p className="text-muted-foreground">
          Upload your documents and add details for AI-powered assistance
        </p>
      </div>

      {/* Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-all duration-200 cursor-pointer rounded-2xl",
          dragOver
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border/50 hover:border-primary/50 hover:bg-muted/30"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-14">
          {isUploading ? (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-5">
                <Spinner className="size-8 text-primary" />
              </div>
              <p className="font-semibold mb-1">
                {scanningProgress || "Processing documents..."}
              </p>
              <p className="text-sm text-muted-foreground">
                AI is extracting data from your document
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                  <CloudUploadIcon className="h-7 w-7 text-muted-foreground" />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <SparklesIcon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-lg font-semibold mb-1">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-muted-foreground mb-5">
                AI will automatically scan and extract document details
              </p>
              <Button variant="outline" size="sm" className="rounded-full px-5">
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

      {/* Progress */}
      <Card className="border-2 border-border/50 rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Document Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-muted-foreground">
              {completedRequiredTypes.size} of {requiredTypes.length} required
              documents verified
            </span>
            <span className="font-semibold text-primary">{Math.round(requiredProgress)}%</span>
          </div>
          <Progress value={requiredProgress} className="h-2.5 rounded-full" />
          {documents.filter((d) => d.status === "pending_details").length >
            0 && (
            <p className="text-sm text-amber-600 mt-3 flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              {documents.filter((d) => d.status === "pending_details").length}{" "}
              document(s) need details added
            </p>
          )}
        </CardContent>
      </Card>

      {/* Documents */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Your Documents</h2>

        {documents.length === 0 ? (
          <Card className="border-2 border-dashed border-border/50 rounded-2xl">
            <CardContent className="flex flex-col items-center justify-center py-14">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 mb-5">
                <FileTextIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-medium text-muted-foreground mb-1">No documents uploaded yet</p>
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
                <Card key={type} className="border-2 border-border/50 rounded-2xl card-hover">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold">
                          {config.name}
                        </CardTitle>
                        {config.required && (
                          <Badge variant="outline" className="text-[10px] mt-0.5 rounded-full px-2">
                            Required
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {docsOfType.map((doc) => {
                      const hasDetails =
                        doc.details &&
                        Object.values(doc.details).some((v) => v);
                      return (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                        >
                          <div className="flex-1 min-w-0 mr-2">
                            {getStatusBadge(doc.status, !!hasDetails)}
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              {doc.fileName} ({formatFileSize(doc.fileSize)})
                            </p>
                            {hasDetails && doc.details?.fullName && (
                              <p className="text-xs text-primary mt-0.5">
                                {doc.details.fullName}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEditDialog(doc)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDelete(doc.id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}

            {/* Other/unclassified documents */}
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
                      <div key={doc.id} className="p-2 rounded-md bg-muted/50">
                        <p className="text-xs truncate">{doc.fileName}</p>
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
                    ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Tips */}
      <Card className="bg-primary/5 border-2 border-primary/10 rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 text-primary" />
            How Documents Help AI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-background/50">
              <CheckCircleIcon className="h-5 w-5 text-primary shrink-0" />
              <span>AI Chat can see your document details</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-background/50">
              <CheckCircleIcon className="h-5 w-5 text-primary shrink-0" />
              <span>Passport info helps with visa eligibility</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-background/50">
              <CheckCircleIcon className="h-5 w-5 text-primary shrink-0" />
              <span>Degree details help with work visa points</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-background/50">
              <CheckCircleIcon className="h-5 w-5 text-primary shrink-0" />
              <span>Language scores affect visa options</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Details Dialog */}
      <Dialog
        open={!!editingDoc}
        onOpenChange={(open) => !open && setEditingDoc(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add {editConfig?.name} Details</DialogTitle>
            <DialogDescription>
              Enter details from your document so AI can reference them when
              answering questions.
            </DialogDescription>
          </DialogHeader>

          {editConfig && (
            <div className="grid gap-4 py-4">
              {editConfig.fields.map((field) => (
                <div key={field.key} className="grid gap-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <Input
                    id={field.key}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={(editDetails[field.key] as string) || ""}
                    onChange={(e) =>
                      setEditDetails({
                        ...editDetails,
                        [field.key]: e.target.value,
                      })
                    }
                  />
                </div>
              ))}

              {/* Document type selector */}
              <div className="grid gap-2">
                <Label>Document Type</Label>
                <Select
                  value={editingDoc?.type}
                  onValueChange={(value) => {
                    if (editingDoc) {
                      const updatedDocs = documents.map((d) =>
                        d.id === editingDoc.id ? { ...d, type: value } : d
                      );
                      saveDocuments(updatedDocs);
                      setEditingDoc({ ...editingDoc, type: value });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(documentTypeConfig).map(
                      ([type, config]) => (
                        <SelectItem key={type} value={type}>
                          {config.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingDoc(null)}>
              Cancel
            </Button>
            <Button onClick={saveDetails}>Save Details</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
