"use client";

import { useCallback, useState, useEffect } from "react";
import { Upload, FileImage, ShieldCheck, Search } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface FileUploadProps {
    onUpload: (file: File) => void;
    isAnalyzing: boolean;
}

export default function FileUpload({ onUpload, isAnalyzing }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [loadingStage, setLoadingStage] = useState(0);
    const stages = [
        "Escaneando circuitos...",
        "Consultando archivos históricos...",
        "Analizando firma sonora...",
        "Generando reporte técnico..."
    ];

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isAnalyzing) {
            interval = setInterval(() => {
                setLoadingStage((prev) => (prev + 1) % stages.length);
            }, 2000);
        } else {
            setLoadingStage(0);
        }
        return () => clearInterval(interval);
    }, [isAnalyzing]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onUpload(e.dataTransfer.files[0]);
        }
    }, [onUpload]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };

    return (
        <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
                "relative group cursor-pointer rounded-lg p-1 transition-all duration-700",
                isDragging
                    ? "bg-fonica-blue/10 scale-[1.02]"
                    : "bg-fonica-offwhite border border-fonica-border hover:border-fonica-blue/30 shadow-sm"
            )}
        >
            <div className={cn(
                "p-12 border-2 border-dashed rounded-lg flex flex-col items-center justify-center space-y-6 text-center transition-all duration-500",
                isDragging ? "border-fonica-blue" : "border-black/5 group-hover:border-fonica-blue/20"
            )}>
                {isAnalyzing ? (
                    <div className="space-y-6">
                        <div className="relative">
                            <div className="w-20 h-20 border-t-2 border-fonica-blue rounded-full animate-spin" />
                            <Search className="absolute inset-0 m-auto w-6 h-6 text-fonica-blue animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-bold tracking-tight text-black uppercase animate-in fade-in duration-500" key={loadingStage}>
                                {stages[loadingStage]}
                            </p>
                            <p className="text-fonica-muted text-[10px] tracking-[0.3em] font-bold uppercase">Procesamiento IA en curso</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="p-6 bg-fonica-blue/5 rounded-full group-hover:scale-110 transition-transform duration-500">
                            <Upload className="w-10 h-10 text-fonica-blue" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-black group-hover:text-fonica-blue transition-colors">Identifica tu equipo</h3>
                            <p className="text-fonica-muted text-sm max-w-xs mx-auto leading-relaxed">
                                Sube una foto de tu amplificador, tornamesa o parlantes. <span className="text-black">La IA reconocerá el modelo al instante.</span>
                            </p>
                        </div>
                        <div className="flex items-center space-x-4 pt-4 text-[9px] font-bold uppercase tracking-[0.2em] text-fonica-muted">
                            <span className="flex items-center space-x-1">
                                <FileImage className="w-3 h-3" />
                                <span>Formatos JPG/PNG</span>
                            </span>
                            <span className="flex items-center space-x-1">
                                <ShieldCheck className="w-3 h-3" />
                                <span>Identificación IA</span>
                            </span>
                        </div>
                    </>
                )}

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                    disabled={isAnalyzing}
                />
            </div>
        </div>
    );
}
