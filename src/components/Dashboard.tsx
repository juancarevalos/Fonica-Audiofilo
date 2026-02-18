"use client";

import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Crown, Loader2, Download, RotateCcw } from "lucide-react";
import Logo from "./Logo";
import { useUser } from "@/context/UserContext";
import ExecutiveSummary from "./ExecutiveSummary";
import SpecsTable from "./SpecsTable";
import InternalTopology from "./InternalTopology";
import ExpertVoice from "./ExpertVoice";
import MarketComparison from "./MarketComparison";
import PremiumModule from "./PremiumModule";

interface DashboardProps {
    data: any;
    onReset: () => void;
    onUpgrade?: () => void;
}

export default function Dashboard({ data, onReset, onUpgrade }: DashboardProps) {
    const { user } = useUser();
    const [isExporting, setIsExporting] = useState(false);
    const dashboardRef = useRef<HTMLDivElement>(null);

    const handleExport = async () => {
        if (!dashboardRef.current) return;
        setIsExporting(true);

        try {
            // Force a desktop-like width for the capture to avoid mobile layout compression
            const captureWidth = 1200;
            const originalStyle = dashboardRef.current.style.width;
            dashboardRef.current.style.width = `${captureWidth}px`;

            const canvas = await html2canvas(dashboardRef.current, {
                scale: window.innerWidth < 768 ? 1.5 : 2,
                backgroundColor: "#FFFFFF",
                logging: false,
                useCORS: true,
                width: captureWidth,
                windowWidth: captureWidth,
                onclone: (clonedDoc: Document) => {
                    const buttons = clonedDoc.querySelector('.action-buttons');
                    if (buttons) (buttons as HTMLElement).style.display = 'none';

                    // Ensure the cloned element also has the fixed width
                    const clonedTarget = clonedDoc.querySelector('[ref="dashboardRef"]') || clonedDoc.body.querySelector('div');
                    if (clonedTarget) (clonedTarget as HTMLElement).style.width = `${captureWidth}px`;
                }
            });

            // Restore original style
            dashboardRef.current.style.width = originalStyle;

            const imgData = canvas.toDataURL("image/png", 0.9);
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            // If it's taller than one page, we could add pages, but usually these reports are single-page or short
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            pdf.save(`Ficha_Fonica_${data?.brand || "Equipo"}_${new Date().getTime()}.pdf`);
        } catch (error) {
            console.error("PDF Export Error:", error);
            alert("Error al generar PDF. Intenta de nuevo.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div ref={dashboardRef} className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000 p-8 md:p-12 rounded-lg bg-white border border-fonica-border shadow-sm">
            {/* Premium Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-12 border-b border-fonica-border">
                <div className="flex items-center space-x-8">
                    <Logo className="w-20 h-20" />
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Crown className="w-5 h-5 text-fonica-blue" />
                            <span className="text-lg md:text-xl font-black uppercase tracking-[0.4em] text-black">
                                Informe Maestro de <span className="text-fonica-blue underline decoration-fonica-blue/30 underline-offset-8">Fónica</span>
                            </span>
                        </div>
                        <h2 className="text-5xl font-bold tracking-tight text-black uppercase">
                            {data?.brand || "Equipo"} <span className="text-fonica-blue">{data?.model || "Desconocido"}</span>
                        </h2>
                        <div className="flex items-center space-x-4">
                            {user && <p className="text-fonica-muted font-medium text-sm">Consultor: <span className="text-black font-bold">{user.name}</span></p>}
                            <span className="text-fonica-border font-bold">•</span>
                            <p className="text-fonica-muted font-bold text-xs uppercase tracking-tighter">ID ANÁLISIS: {Math.floor(Math.random() * 900000 + 100000)}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-6 action-buttons">
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center space-x-3 px-10 py-4 bg-fonica-blue text-white font-bold uppercase text-xs tracking-widest rounded hover:bg-fonica-blue-deep transition-all disabled:opacity-50 shadow-md"
                    >
                        {isExporting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Exportando...</span>
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                <span>Reporte HD</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={onReset}
                        className="p-4 bg-fonica-offwhite border border-fonica-border rounded hover:bg-fonica-border transition-all text-black shadow-sm"
                        title="Nueva Consulta"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Grid: 8/4 Split */}
            <div className="flex flex-col lg:flex-row gap-12 pt-4">
                <div className="flex-1 space-y-16">
                    {/* Executive Summary Section */}
                    <div className="rounded-lg overflow-hidden border border-fonica-border bg-fonica-offwhite">
                        <ExecutiveSummary data={data} />
                    </div>

                    {/* Specs Table Section */}
                    <div className="space-y-8">
                        <SpecsTable specs={data?.specs} />
                    </div>

                    {/* Topology Section */}
                    <div className="space-y-8">
                        <InternalTopology topology={data?.topology} />
                    </div>
                </div>

                {/* Right Sidebar */}
                <aside className="lg:w-[400px] space-y-12">
                    <div className="bg-fonica-offwhite p-1 rounded-lg border border-fonica-border">
                        <ExpertVoice brand={data?.brand} insights={data?.expertInsights} />
                    </div>
                    <MarketComparison marketData={data?.marketData} />

                    <PremiumModule onUpgrade={onUpgrade || (() => { })} />

                    <div className="p-8 border border-fonica-border rounded-lg bg-fonica-offwhite font-bold text-[10px] text-fonica-muted uppercase tracking-widest text-center leading-loose">
                        * LA PRECISIÓN TÉCNICA ES NUESTRA PRIORIDAD. ESTE INFORME UTILIZA DATOS VERIFICADOS DE INGENIERÍA Y ARCHIVOS HISTÓRICOS.
                    </div>
                </aside>
            </div>
        </div>
    );
}
