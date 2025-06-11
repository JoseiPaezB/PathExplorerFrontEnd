"use client";

import { useState } from "react";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import CVUploadModal from "./CVUploadModal";

interface CVUploadButtonProps {
    onUploadSuccess?: () => void;
    className?: string;
}

export default function CVUploadButton({
                                           onUploadSuccess,
                                           className = ""
                                       }: CVUploadButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleUploadSuccess = () => {
        setIsModalOpen(false);
        onUploadSuccess?.();
    };

    return (
        <>
            <Button
                onClick={() => setIsModalOpen(true)}
                className={`bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 ${className}`}
                size="lg"
            >
                <div className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    <span className="font-semibold">Cargar CV</span>
                    <FileText className="h-4 w-4 opacity-70" />
                </div>
            </Button>

            <CVUploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUploadSuccess={handleUploadSuccess}
            />
        </>
    );
}