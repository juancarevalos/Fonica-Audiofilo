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
    const [showPremium, setShowPremium] = useState(false);

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
        <main className="min-h-screen bg-netflix-black text-white selection:bg-netflix-red">
            {/* Global Navigation - Netflix Style */}
            <nav className="fixed top-0 left-0 right-0 z-[100] netflix-gradient h-20 transition-all duration-300">
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
                            <span className="text-2xl md:text-3xl font-black text-netflix-red tracking-tighter leading-none uppercase">Fónica</span>
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
                                        "flex flex-col md:flex-row items-center md:space-x-2 transition-all hover:text-netflix-muted",
                                        activeTab === item.id ? "text-white font-bold" : "text-white/80"
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
                                    className="flex items-center space-x-2 text-sm text-white hover:text-netflix-muted transition-colors"
                                >
                                    <span className="hidden sm:inline">{user.name}</span>
                                    <div className="w-8 h-8 rounded bg-netflix-red flex items-center justify-center">
                                        <UserIcon className="w-5 h-5" />
                                    </div>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAuth(true)}
                                className="px-4 py-1.5 bg-netflix-red text-white text-sm font-bold rounded hover:bg-netflix-red/90 transition-all"
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
                            {/* Hero Section - Netflix Style */}
                            <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden flex items-center pt-24">
                                {/* Background Image placeholder - Premium Hi-Fi */}
                                <div className="absolute inset-0 z-0">
                                    <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/40 to-transparent z-10" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/20 to-transparent z-10" />
                                    <img
                                        src="https://images.unsplash.com/photo-1545453303-122997921159?q=80&w=2000&auto=format&fit=crop"
                                        alt="Fónica Hero"
                                        className="w-full h-full object-cover opacity-60"
                                    />
                                </div>

                                <div className="relative z-20 max-w-7xl mx-auto px-6 w-full space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-netflix-red uppercase tracking-[0.4em]">Hi-Fi Equipment</p>
                                        <h1 className="text-3xl md:text-4xl font-black tracking-tight max-w-3xl leading-none">
                                            <span className="text-netflix-red">Fónica</span> - Tu Guía <span className="text-netflix-red">Hi-Fi</span>
                                        </h1>
                                    </div>
                                    <p className="text-lg text-netflix-text max-w-xl font-medium opacity-80 leading-relaxed">
                                        Experiencia audiófila definitiva. Identifica, optimiza y descubre la verdadera alma de tu sistema de sonido.
                                    </p>
                                    <div className="flex space-x-4 pt-4">
                                        <button
                                            onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                                            className="px-8 py-3 bg-white text-black font-bold rounded flex items-center space-x-2 hover:bg-white/80 transition-all"
                                        >
                                            <Zap className="fill-black" />
                                            <span>Comenzar Análisis Gratis</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content Areas in Carousels/Rows */}
                            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-30 space-y-20 pb-20 w-full">
                                {/* Upload/Identificar Section */}
                                <section id="upload-section" className="space-y-6">
                                    <h2 className="text-2xl font-bold text-white">Identificar Equipos</h2>
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                        <div className="lg:col-span-8">
                                            <div className="glass p-8 rounded-lg space-y-6">
                                                <p className="text-netflix-muted">
                                                    Sube una foto de tu equipo para obtener un análisis técnico detallado,
                                                    incluyendo su firma sonora y valor de mercado.
                                                </p>
                                                <FileUpload onUpload={handleUpload} isAnalyzing={isAnalyzing} />
                                            </div>
                                        </div>
                                        <div className="lg:col-span-4">
                                            <PremiumModule onUpgrade={() => setShowPremium(true)} />
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    )}

                    {activeTab === "connect" && <SystemConnect />}
                    {activeTab === "archive" && <Archive />}

                    <footer className="mt-40 pb-20 border-t border-netflix-border/50 text-center space-y-6 pt-12">
                        <div className="flex justify-center space-x-8 text-netflix-muted text-sm font-medium">
                            <a href="#" className="hover:text-white transition-colors">Audiofilo Pro</a>
                            <a href="#" className="hover:text-white transition-colors">Soporte Técnico</a>
                            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                            <a href="#" className="hover:text-white transition-colors">Términos de Uso</a>
                        </div>
                        <p className="text-xs font-medium text-netflix-muted uppercase tracking-[0.4em] opacity-40">
                            Fónica Systems // © 2026 EXPERIENCIA AUDIÓFILA PREMIUM
                        </p>
                    </footer>
                </div>
            ) : (
                <div className="pt-24 px-6 md:px-12 bg-netflix-black min-h-screen">
                    <Dashboard
                        data={analysisData}
                        onReset={() => {
                            setAnalysisData(null);
                            setErrorMsg(null);
                        }}
                        onUpgrade={() => setShowPremium(true)}
                    />
                </div>
            )}

            {/* Modals - Netflix style */}
            {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} onOpenPremium={() => setShowPremium(true)} />}

            {/* Premium Upgrade Modal */}
            {showPremium && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0a0a0a]/98 backdrop-blur-md" onClick={() => setShowPremium(false)}></div>
                    <div className="relative bg-[#0f0f0f] border border-[#2a2a2a] p-12 rounded-[48px] max-w-lg w-full text-center space-y-10 animate-in zoom-in-95 duration-300 shadow-2xl">
                        {/* Decorative Top Accent */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-32 bg-[#FFD700] rounded-b-full shadow-[0_0_20px_rgba(255,215,0,0.3)]"></div>

                        <div className="w-24 h-24 bg-gradient-to-br from-[#FFD700] to-[#B8860B] rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(255,215,0,0.2)] transform -rotate-6">
                            <Crown className="w-12 h-12 text-black" />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl font-serif font-black text-white leading-tight">Suscripción <span className="text-[#FFD700]">Maestro</span></h2>
                            <p className="text-[#FFD700]/70 text-sm font-bold uppercase tracking-[0.2em]">Acceso de Élite Ilimitado</p>
                        </div>

                        <div className="bg-[#1a1a1a] rounded-[32px] p-8 space-y-6 border border-white/5 shadow-inner text-left">
                            <p className="text-white/80 text-center text-sm font-medium">
                                Confirmar membresía para desbloquear el máximo potencial de la IA por solo <span className="text-white font-black text-lg">$3 USD</span>/mes.
                            </p>

                            <div className="space-y-4 pt-2">
                                <div className="flex items-start space-x-4">
                                    <div className="p-1.5 bg-[#FFD700]/10 rounded-lg">
                                        <Zap className="w-4 h-4 text-[#FFD700]" />
                                    </div>
                                    <p className="text-xs text-white/70 leading-relaxed"><span className="text-white font-bold">Consultas Ilimitadas:</span> Sin cuotas diarias en identificación y chat técnico.</p>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="p-1.5 bg-[#FFD700]/10 rounded-lg">
                                        <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
                                    </div>
                                    <p className="text-xs text-white/70 leading-relaxed"><span className="text-white font-bold">Análisis Pro:</span> Acceso a esquemas de conexión y topologías complejas.</p>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="p-1.5 bg-[#FFD700]/10 rounded-lg">
                                        <Crown className="w-4 h-4 text-[#FFD700]" />
                                    </div>
                                    <p className="text-xs text-white/70 leading-relaxed"><span className="text-white font-bold">Sinergia VIP:</span> Recomendaciones personalizadas de cables y componentes.</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => {
                                    updateProfile({ isPremium: true });
                                    setShowPremium(false);
                                }}
                                className="w-full py-5 bg-[#FFD700] text-black rounded-[32px] font-black uppercase text-xs tracking-[0.4em] hover:bg-white hover:shadow-2xl transition-all transform hover:-translate-y-1"
                            >
                                Confirmar y Activar
                            </button>
                            <button
                                onClick={() => setShowPremium(false)}
                                className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-white transition-all"
                            >
                                Quizás más tarde
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
