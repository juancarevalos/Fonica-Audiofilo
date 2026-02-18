"use client";

import { useState, useEffect } from "react";
import FileUpload from "@/components/FileUpload";
import Dashboard from "@/components/Dashboard";
import SystemConnect from "@/components/SystemConnect";
import AuthModal from "@/components/auth/AuthModal";
import SettingsModal from "@/components/SettingsModal";
import PremiumModule from "@/components/PremiumModule";
import Archive from "@/components/Archive";
import Logo from "@/components/Logo";
import { useUser } from "@/context/UserContext";
import { mockEquipmentData } from "@/lib/mockData";
import { AlertCircle, ShieldCheck, Zap, Cable, Settings, Crown, User as UserIcon, MessageCircle, Archive as ArchiveIcon } from "lucide-react";
import { clsx } from "clsx";

export default function Home() {
    const { user, updateProfile } = useUser();
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"advisor" | "connect" | "archive">("advisor");

    // UI States
    const [showAuth, setShowAuth] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    /* Removing automatic auth trigger - only shows on manual click now */
    /*
    useEffect(() => {
        if (!user) {
            const timer = setTimeout(() => setShowAuth(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [user]);
    */

    const handleUpload = async (file: File) => {
        setIsAnalyzing(true);
        setErrorMsg(null);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("/api/identify", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Fallo inesperado del servidor");
            }

            setAnalysisData(data);
        } catch (error: any) {
            console.error("Error al identificar:", error);
            setErrorMsg(error.message);
        } finally {
            setIsAnalyzing(false);
        }
    };


    return (
        <main className="min-h-screen bg-white text-black selection:bg-fonica-blue/20">
            {/* Global Navigation - Clean Light Style */}
            <nav className="fixed top-0 left-0 right-0 z-[100] fonica-header-gradient border-b border-fonica-border h-20 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
                    <div className="flex items-center space-x-3 md:space-x-8">
                        {/* Logo / Home Link */}
                        <div
                            className="flex items-center cursor-pointer group"
                            onClick={() => {
                                setActiveTab("advisor");
                                setAnalysisData(null);
                            }}
                        >
                            <span className="text-2xl md:text-3xl font-black text-fonica-blue tracking-tighter leading-none uppercase">Fónica</span>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex items-center space-x-4 md:space-x-6">
                            {[
                                { id: "advisor", label: "Identificar", icon: Zap },
                                { id: "connect", label: "Asesoría", icon: MessageCircle },
                                { id: "archive", label: "Archivo", icon: ArchiveIcon },
                            ].map((item: any) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setAnalysisData(null);
                                    }}
                                    className={clsx(
                                        "flex flex-col md:flex-row items-center md:space-x-2 transition-all hover:text-fonica-blue",
                                        activeTab === item.id ? "text-fonica-blue font-bold" : "text-fonica-muted"
                                    )}
                                >
                                    <item.icon className="w-5 h-5 md:w-4 md:h-4 mb-0.5 md:mb-0" />
                                    <span className="text-[10px] md:text-sm font-medium">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setShowSettings(true)}
                                    className="flex items-center space-x-2 text-sm text-black hover:text-fonica-blue transition-colors"
                                >
                                    <span className="hidden sm:inline">{user.name}</span>
                                    <div className="w-8 h-8 rounded bg-fonica-blue flex items-center justify-center">
                                        <UserIcon className="w-5 h-5 text-white" />
                                    </div>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAuth(true)}
                                className="px-4 py-1.5 bg-fonica-blue text-white text-sm font-bold rounded hover:bg-fonica-blue-deep transition-all"
                            >
                                Inscribirse
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {!analysisData ? (
                <div className="relative">
                    {activeTab === "advisor" && (
                        <div className="flex flex-col">
                            {/* Hero Section - Clean Light Style */}
                            <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden flex items-center pt-24">
                                {/* Background Image placeholder - Premium Hi-Fi */}
                                <div className="absolute inset-0 z-0">
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent z-10" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent z-10" />
                                    <img
                                        src="https://images.unsplash.com/photo-1545453303-122997921159?q=80&w=2000&auto=format&fit=crop"
                                        alt="Fónica Hero"
                                        className="w-full h-full object-cover opacity-30"
                                    />
                                </div>

                                <div className="relative z-20 max-w-7xl mx-auto px-6 w-full space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-fonica-blue uppercase tracking-[0.4em]">Hi-Fi Equipment</p>
                                        <h1 className="text-3xl md:text-4xl font-black tracking-tight max-w-3xl leading-none text-black">
                                            <span className="text-fonica-blue">Fónica</span> - Tu Guía <span className="text-fonica-blue">Hi-Fi</span>
                                        </h1>
                                    </div>
                                    <p className="text-lg text-black max-w-xl font-medium opacity-80 leading-relaxed">
                                        Experiencia audiófila definitiva. Identifica, optimiza y descubre la verdadera alma de tu sistema de sonido.
                                    </p>
                                </div>
                            </div>

                            {/* Main Content Areas in Carousels/Rows */}
                            <div className="max-w-7xl mx-auto px-6 mt-8 md:mt-12 relative z-30 space-y-16 pb-20 w-full">
                                {/* Upload/Identificar Section */}
                                <section id="upload-section" className="space-y-6">
                                    <h2 className="text-2xl font-bold text-black">Identificar Equipos</h2>
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                        <div className="lg:col-span-8">
                                            <div className="glass p-8 rounded-lg space-y-6">
                                                <p className="text-fonica-muted">
                                                    Sube una foto de tu equipo para obtener un análisis técnico detallado,
                                                    incluyendo su firma sonora y valor de mercado.
                                                </p>
                                                <FileUpload onUpload={handleUpload} isAnalyzing={isAnalyzing} />
                                            </div>
                                        </div>
                                        <div className="lg:col-span-4">
                                            <PremiumModule onUpgrade={() => setShowAuth(true)} />
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    )}

                    {activeTab === "connect" && <SystemConnect />}
                    {activeTab === "archive" && <Archive />}

                    <footer className="mt-40 pb-20 border-t border-fonica-border text-center space-y-6 pt-12">
                        <div className="flex justify-center space-x-8 text-fonica-muted text-sm font-medium">
                            <a href="#" className="hover:text-fonica-blue transition-colors">Audiofilo Pro</a>
                            <a href="#" className="hover:text-fonica-blue transition-colors">Soporte Técnico</a>
                            <a href="#" className="hover:text-fonica-blue transition-colors">Privacidad</a>
                            <a href="#" className="hover:text-fonica-blue transition-colors">Términos de Uso</a>
                        </div>
                        <p className="text-xs font-medium text-fonica-muted uppercase tracking-[0.4em] opacity-40">
                            Fónica Systems // © 2026 EXPERIENCIA AUDIÓFILA PREMIUM
                        </p>
                    </footer>
                </div>
            ) : (
                <div className="pt-24 px-6 md:px-12 bg-white min-h-screen">
                    <Dashboard
                        data={analysisData}
                        onReset={() => {
                            setAnalysisData(null);
                            setErrorMsg(null);
                        }}
                        onUpgrade={() => setShowAuth(true)}
                    />
                </div>
            )}

            {/* Modals */}
            {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} onOpenPremium={() => setShowAuth(true)} />}


        </main>
    );
}
