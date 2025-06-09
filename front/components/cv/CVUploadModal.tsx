"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    Upload,
    FileText,
    CheckCircle,
    AlertCircle,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import CVDataPreview from "./CVDataPreview";

interface CVUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess?: () => void;
}

export default function CVUploadModal({
                                          isOpen,
                                          onClose,
                                          onUploadSuccess
                                      }: CVUploadModalProps) {
    const { extractCVPreview, uploadCV } = useAuth();
    const [dragActive, setDragActive] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedData, setExtractedData] = useState<any>(null);
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const [step, setStep] = useState<'upload' | 'preview' | 'success'>('upload');

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setCurrentFile(file);
        setIsProcessing(true);
        setStep('upload');

        try {
            const response = await extractCVPreview(file);

            if (response.success) {
                setExtractedData(response.data);
                setStep('preview');
                toast.success("CV procesado exitosamente");
            } else {
                throw new Error(response.message || "Error procesando CV");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error procesando CV");
        } finally {
            setIsProcessing(false);
        }
    }, [extractCVPreview]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024,
        onDragEnter: () => setDragActive(true),
        onDragLeave: () => setDragActive(false)
    });

    const handleSaveCV = async (editedData: any) => {
        if (!currentFile) return;

        setIsProcessing(true);
        try {
            const response = await uploadCV(currentFile);

            if (response.success) {
                setStep('success');
                toast.success("CV guardado exitosamente");

                setTimeout(() => {
                    onUploadSuccess?.();
                    handleClose();
                }, 2000);
            } else {
                throw new Error(response.message || "Error guardando CV");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error guardando CV");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        setStep('upload');
        setExtractedData(null);
        setCurrentFile(null);
        setIsProcessing(false);
        onClose();
    };

    const handleBackToUpload = () => {
        setStep('upload');
        setExtractedData(null);
        setCurrentFile(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-6xl w-[90vw] h-[85vh] max-h-[85vh] p-0 flex flex-col">
                <DialogHeader className="px-6 py-4 border-b shrink-0">
                    <DialogTitle className="flex items-center gap-2 text-purple-800">
                        <FileText className="h-6 w-6 text-purple-600" />
                        Upload CV
                        {step === 'preview' && <span className="text-sm text-purple-600 ml-2">- Vista Previa y Edición</span>}
                        {step === 'success' && <span className="text-sm text-green-600 ml-2">- Completado</span>}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-hidden">
                    {step === 'upload' && (
                        <div className="h-full flex flex-col justify-center p-6">
                            <div
                                {...getRootProps()}
                                className={`
                  border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300
                  ${isDragActive || dragActive
                                    ? 'border-purple-500 bg-purple-50'
                                    : 'border-purple-300 hover:border-purple-400'
                                }
                  ${isProcessing ? 'pointer-events-none opacity-50' : ''}
                `}
                            >
                                <input {...getInputProps()} />

                                <div className="flex flex-col items-center gap-6">
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="h-20 w-20 text-purple-600 animate-spin" />
                                            <div className="text-xl font-semibold text-purple-800">
                                                Procesando CV con IA...
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="p-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full">
                                                <Upload className="h-16 w-16 text-purple-600" />
                                            </div>
                                            <div className="text-xl font-semibold text-purple-800">
                                                {isDragActive ? "Suelta tu CV aquí" : "Arrastra tu CV o haz clic para seleccionar"}
                                            </div>
                                            <div className="text-sm text-purple-600">
                                                Formatos soportados: PDF, DOCX (máx. 10MB)
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'preview' && extractedData && (
                        <CVDataPreview
                            data={extractedData}
                            onSave={handleSaveCV}
                            onBack={handleBackToUpload}
                            isLoading={isProcessing}
                        />
                    )}

                    {step === 'success' && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6">
                            <CheckCircle className="h-24 w-24 text-green-500 mb-6" />
                            <div className="text-3xl font-bold text-purple-800 mb-3">
                                ¡CV guardado exitosamente!
                            </div>
                            <Button onClick={handleClose} size="lg">
                                Continuar
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}