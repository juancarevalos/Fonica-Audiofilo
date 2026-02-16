"use client";

import { useState, useRef, useEffect } from "react";
import { Zap, Cable, Radio, Speaker, CheckCircle2, RotateCcw, FileText, Loader2, Sparkles, Send, User as UserIcon, MessageCircle, ShieldCheck } from "lucide-react";
import { clsx } from "clsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useUser } from "@/context/UserContext";
import Logo from "./Logo";
import ReactMarkdown from "react-markdown";

export default function SystemConnect() {
    const { user } = useUser();
    const [chatMessages, setChatMessages] = useState<{ role: string, content: string }[]>([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const isInitialLoad = useRef(true);
    const [msgCount, setMsgCount] = useState(0);

    // Manual Advisor States
    const [isManualMode, setIsManualMode] = useState(false);
    const [selections, setSelections] = useState({
        amplifier: "",
        turntable: "",
        speakers: "",
        cables: "",
        other: ""
    });
    const [isAdvisorLoading, setIsAdvisorLoading] = useState(false);
    const [advisorResult, setAdvisorResult] = useState<any>(null);
    const diagramRef = useRef<HTMLDivElement>(null);

    const exportToPDF = async () => {
        if (!diagramRef.current) {
            alert("No hay esquema generado para exportar.");
            return;
        }

        try {
            const canvas = await html2canvas(diagramRef.current, {
                backgroundColor: '#121212',
                scale: 3, // Higher scale for better quality
                logging: false,
                useCORS: true,
                allowTaint: true
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Calculate height while maintaining aspect ratio
            const imgHeight = (canvas.height * pageWidth) / canvas.width;

            // Background color for the whole page
            pdf.setFillColor(18, 18, 18);
            pdf.rect(0, 0, pageWidth, pageHeight, 'F');

            // Project Title Header
            pdf.setTextColor(255, 215, 0); // Gold
            pdf.setFontSize(22);
            pdf.setFont("helvetica", "bold");
            pdf.text("FÓNICA", pageWidth / 2, 20, { align: "center" });

            pdf.setTextColor(150, 150, 150);
            pdf.setFontSize(10);
            pdf.text("REPORTE TÉCNICO DE CONFIGURACIÓN", pageWidth / 2, 28, { align: "center" });

            // Add the diagram image
            pdf.addImage(imgData, 'PNG', 0, 35, pageWidth, imgHeight);

            // Footer
            const footerY = 35 + imgHeight + 10;
            if (footerY < pageHeight - 20) {
                pdf.setDrawColor(64, 64, 64);
                pdf.line(20, footerY, pageWidth - 20, footerY);

                pdf.setTextColor(100, 100, 100);
                pdf.setFontSize(8);
                pdf.text("© 2026 FÓNICA - Inteligencia Artificial para Audiófilos", pageWidth / 2, footerY + 10, { align: "center" });
            }

            pdf.save(`Fonica_Reporte_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (err) {
            console.error("PDF Export Error:", err);
            alert("Error al generar el PDF. Asegúrate de que el esquema sea visible.");
        }
    };

    // Persistence and Initialize
    useEffect(() => {
        // Handle persistence
        const savedChat = localStorage.getItem("fonica_chat_history_v2");
        const containsColega = savedChat && savedChat.toLowerCase().includes("colega");
        const shouldReset = savedChat && (savedChat.includes("Oráculo") || containsColega);

        if (savedChat && !shouldReset) {
            try {
                const parsed = JSON.parse(savedChat);
                if (Array.isArray(parsed)) {
                    setChatMessages(parsed);
                }
            } catch (e) {
                console.error("Failed to parse chat history:", e);
            }
        }

        if (chatMessages.length === 0 || shouldReset) {
            const welcomeMsg = {
                role: "assistant",
                content: "Hola audiófilo. Escribe tu consulta y hablemos de música y técnica.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setChatMessages([welcomeMsg]);
            if (shouldReset) localStorage.removeItem("fonica_chat_history_v2");
        }

        const count = localStorage.getItem("fonica_msg_count_v2");
        if (count) setMsgCount(parseInt(count));
    }, []);

    useEffect(() => {
        if (chatMessages.length > 0) {
            const limitedHistory = chatMessages.slice(-50);
            localStorage.setItem("fonica_chat_history_v2", JSON.stringify(limitedHistory));

            // Auto-scroll ONLY for user messages and NOT on initial load
            if (isInitialLoad.current) {
                isInitialLoad.current = false;
                return;
            }

            const lastMsg = chatMessages[chatMessages.length - 1];
            if (lastMsg.role === "user") {
                chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [chatMessages]);

    useEffect(() => {
        localStorage.setItem("fonica_msg_count_v2", msgCount.toString());
    }, [msgCount]);

    const sendMessage = async (messageOverride?: string) => {
        const msgToSend = messageOverride || currentMessage;
        if (!msgToSend.trim() || isChatLoading) return;

        const maxFree = 15;
        if (msgCount >= maxFree && !user?.isPremium) {
            setChatMessages(prev => [...prev, {
                role: "assistant",
                content: "Has alcanzado el límite de consultas gratuitas de hoy. Actualiza a Premium para mantener una línea abierta ilimitada conmigo.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            return;
        }

        const userMsg = {
            role: "user",
            content: msgToSend,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, userMsg]);
        setCurrentMessage("");
        setIsChatLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: chatMessages.concat(userMsg).slice(-10),
                    userName: user?.name || "Audiófilo"
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Error en la conexión con el asesor.");
            }

            const content = await response.text();

            const aiMsg = {
                role: "assistant",
                content: content,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setChatMessages(prev => [...prev, aiMsg]);
            setMsgCount(prev => prev + 1);

        } catch (error: any) {
            console.error("Chat Error Detailed:", error);

            let displayMessage = "Disculpa, audiófilo. He tenido una pequeña interferencia técnica. Probemos de nuevo en un momento.";

            if (error.message === "QUOTA_EXCEEDED") {
                displayMessage = "⚠️ **Límite de Consultas Alcanzado**\n\nEl asesor está atendiendo a muchos audiófilos en este momento. Por favor, espera unos segundos o intenta más tarde.";
            }

            setChatMessages(prev => [...prev, {
                role: "assistant",
                content: displayMessage,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleAdvisorSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAdvisorLoading(true);
        setAdvisorResult(null);

        try {
            const response = await fetch("/api/advisor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    selections,
                    userName: user?.name || "Audiófilo"
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al obtener la asesoría.");
            }
            const data = await response.json();
            setAdvisorResult(data);
        } catch (error: any) {
            console.error("Advisor Error:", error);
            const errorMsg = error.message === "QUOTA_EXCEEDED"
                ? "Disculpa, audiófilo. He agotado mis recursos de cálculo por hoy. Por favor, intenta de nuevo en unos momentos o actualiza a Premium."
                : "No se pudo generar la asesoría técnica. Por favor, verifica tu conexión o intenta con otros componentes.";
            alert(errorMsg);
        } finally {
            setIsAdvisorLoading(false);
        }
    };

    const clearChat = () => {
        localStorage.removeItem("fonica_chat_history_v2");
        const welcomeMsg = {
            role: "assistant",
            content: "Bienvenido de nuevo. ¿En qué aspecto de tu viaje audiófilo nos enfocamos ahora?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages([welcomeMsg]);
        setMsgCount(0);
    };

    const suggestions = [
        "¿Cuáles son los mejores altavoces para Clase A?",
        "Explícame el factor de amortiguamiento (Damping Factor)",
        "¿Cómo influye el VTA en la reproducción de vinilos?",
        "Recomiéndame un DAC con sonido analógico"
    ];

    return (
        <div className="fixed top-20 left-0 right-0 bottom-0 bg-netflix-black z-40 flex flex-col p-4 md:p-6 animate-in fade-in duration-1000 overflow-hidden">
            <div className="max-w-4xl mx-auto w-full h-full flex flex-col bg-[#1a1a1a] rounded-xl border border-[#404040] overflow-hidden relative shadow-2xl bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f]">
                {/* Chat Tabs */}
                <div className="flex bg-[#121212] border-b border-[#404040]">
                    <button
                        onClick={() => setIsManualMode(false)}
                        className={clsx(
                            "flex-1 py-4 text-[11px] font-bold uppercase tracking-[0.3em] transition-all",
                            !isManualMode ? "text-[#FFD700] border-b-2 border-[#FFD700] bg-[#1a1a1a]" : "text-netflix-muted hover:text-white"
                        )}
                    >
                        Chat con Experto
                    </button>
                    <button
                        onClick={() => setIsManualMode(true)}
                        className={clsx(
                            "flex-1 py-4 text-[11px] font-bold uppercase tracking-[0.3em] transition-all",
                            isManualMode ? "text-[#FFD700] border-b-2 border-[#FFD700] bg-[#1a1a1a]" : "text-netflix-muted hover:text-white"
                        )}
                    >
                        Configurar Sistema
                    </button>
                </div>

                {/* Dashboard Header Overlay (only for chat) */}
                {!isManualMode && (
                    <div className="px-6 py-4 bg-[#1a1a1a] border-b border-[#404040] flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-[#2d2d2d] border border-[#FFD700]/30 flex items-center justify-center">
                                <Logo className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">Experto Audiofilo</h4>
                                <div className="flex items-center space-x-1.5">
                                    <span className="text-[10px] text-[#FFD700] font-bold uppercase tracking-widest">Súper-Especialista de Élite</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {!user?.isPremium && (
                                <span className="text-[10px] font-bold text-netflix-muted uppercase tracking-tighter">
                                    {msgCount}/15 consultas hoy
                                </span>
                            )}
                            <button
                                onClick={clearChat}
                                className="p-2 text-netflix-muted hover:text-white transition-colors"
                                title="Limpiar Conversación"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto scrollbar-hide relative bg-[#1a1a1a]">
                    {!isManualMode ? (
                        /* Messages Area */
                        <div className="p-4 md:p-8 space-y-8">
                            {chatMessages.map((msg, i) => (
                                <div
                                    key={i}
                                    id={`msg-${i}`}
                                    className={clsx(
                                        "flex flex-col space-y-2 max-w-[85%] md:max-w-[70%]",
                                        msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                                    )}
                                >
                                    <div className={clsx(
                                        "px-5 py-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-lg markdown-content",
                                        msg.role === "user"
                                            ? "bg-[#3a3a3a] text-white rounded-tr-none whitespace-pre-wrap"
                                            : "bg-[#2d2d2d] text-white border-l-[4px] border-l-[#FFD700] rounded-tl-none"
                                    )}>
                                        {msg.role === "user" ? (
                                            msg.content
                                        ) : (
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2 px-2">
                                        <span className="text-[10px] text-netflix-muted font-bold uppercase tracking-widest">
                                            {(msg as any).timestamp}
                                        </span>
                                        <span className="text-[10px] text-[#FFD700]/40 font-bold uppercase tracking-widest">•</span>
                                        <span className="text-[10px] text-netflix-muted font-bold uppercase tracking-widest">
                                            {msg.role === "user" ? (user?.name || "Tú") : "Experto Audiofilo"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {isChatLoading && (
                                <div className="flex flex-col items-start mr-auto space-y-3 px-2">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce"></div>
                                    </div>
                                    <span className="text-[10px] text-[#FFD700] font-bold uppercase tracking-[0.2em] animate-pulse">Analizando circuitos...</span>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                    ) : (
                        /* Manual Config Form & Results */
                        <div className="p-6 md:p-10 space-y-10">
                            {advisorResult ? (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="flex items-center justify-between border-b border-[#404040] pb-4">
                                        <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{advisorResult.title}</h3>
                                        <button
                                            onClick={() => setAdvisorResult(null)}
                                            className="text-[10px] font-bold text-[#FFD700] uppercase tracking-widest hover:underline"
                                        >
                                            Editar Configuración
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="bg-[#252525] p-6 rounded-xl border border-[#404040]">
                                                <h5 className="text-[10px] font-bold text-[#FFD700] uppercase tracking-[0.3em] mb-4">Veredicto Inicial</h5>
                                                <p className="text-white text-sm leading-relaxed italic">"{advisorResult.intro}"</p>
                                            </div>

                                            <div className="bg-[#252525] p-6 rounded-xl border border-[#404040]">
                                                <h5 className="text-[10px] font-bold text-[#FFD700] uppercase tracking-[0.3em] mb-4">Tips de Experto</h5>
                                                <ul className="space-y-3">
                                                    {advisorResult.expertTips?.map((tip: string, idx: number) => (
                                                        <li key={idx} className="flex items-start space-x-3 text-sm text-netflix-text">
                                                            <div className="w-1.5 h-1.5 bg-[#FFD700] rounded-full mt-1.5 shrink-0" />
                                                            <span>{tip}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div ref={diagramRef} className="bg-[#121212] p-8 rounded-xl border border-[#FFD700]/20 flex flex-col items-center space-y-8">
                                                <h5 className="text-[12px] font-bold text-[#FFD700] uppercase tracking-[0.4em] w-full text-center mb-2">Esquema de Flujo de Señal</h5>

                                                <div className="w-full max-w-sm space-y-0 flex flex-col items-center">
                                                    {advisorResult.connectionScheme?.visual?.nodes?.map((node: any, idx: number) => (
                                                        <div key={node.id} className="flex flex-col items-center w-full">
                                                            <div className="w-full p-4 bg-[#232323] border border-[#404040] rounded-xl text-center shadow-xl group hover:border-[#FFD700]/50 transition-all relative overflow-hidden">
                                                                <div className="absolute top-0 left-0 w-1 h-full bg-[#FFD700]/20 group-hover:bg-[#FFD700]/40 transition-all" />
                                                                <span className="text-[10px] font-black text-netflix-muted uppercase tracking-[0.2em] block mb-1">{node.type}</span>
                                                                <span className="text-base font-bold text-white mb-1 block">{node.label}</span>
                                                                {idx < advisorResult.connectionScheme.visual.nodes.length - 1 && (
                                                                    <div className="mt-2 text-[8px] text-[#FFD700] font-black uppercase tracking-widest bg-[#FFD700]/5 py-1 px-2 rounded-full inline-block border border-[#FFD700]/10">
                                                                        Salida: {advisorResult.connectionScheme.visual.connections[idx]?.cable || "RCA Hi-End"}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {idx < advisorResult.connectionScheme.visual.nodes.length - 1 && (
                                                                <div className="py-4 flex flex-col items-center">
                                                                    <div className="w-0.5 h-8 bg-gradient-to-b from-[#FFD700] to-transparent shrink-0" />
                                                                    <Cable className="w-3 h-3 text-[#FFD700] animate-pulse my-1" />
                                                                    <div className="w-0.5 h-8 bg-gradient-to-t from-[#FFD700] to-transparent shrink-0" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="w-full bg-[#1a1a1a] p-5 rounded-xl border border-[#333] shadow-inner">
                                                    <h6 className="text-[10px] font-bold text-[#FFD700] uppercase tracking-[0.2em] mb-4 flex items-center">
                                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                                        Flujo Paso a Paso
                                                    </h6>
                                                    <div className="space-y-4">
                                                        <div className="flex items-start space-x-4">
                                                            <div className="w-6 h-6 rounded-full bg-[#FFD700] text-black text-[10px] font-black flex items-center justify-center shrink-0">1</div>
                                                            <p className="text-[11px] text-netflix-text font-medium leading-relaxed">{advisorResult.connectionScheme?.sourceToAmp}</p>
                                                        </div>
                                                        <div className="flex items-start space-x-4">
                                                            <div className="w-6 h-6 rounded-full bg-[#333] text-white border border-[#444] text-[10px] font-black flex items-center justify-center shrink-0">2</div>
                                                            <p className="text-[11px] text-netflix-text font-medium leading-relaxed">{advisorResult.connectionScheme?.ampToSpeakers}</p>
                                                        </div>
                                                        {advisorResult.connectionScheme?.grounding && (
                                                            <div className="flex items-start space-x-4">
                                                                <div className="w-6 h-6 rounded-full bg-[#333] text-white border border-[#444] text-[10px] font-black flex items-center justify-center shrink-0">3</div>
                                                                <p className="text-[11px] text-netflix-text font-medium leading-relaxed">{advisorResult.connectionScheme?.grounding}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="w-full text-[9px] text-netflix-muted uppercase tracking-[0.3em] text-center border-t border-white/5 pt-4">
                                                    * Reporte Técnico Generado por Fónica AI *
                                                </div>
                                            </div>

                                            <div className="flex justify-center">
                                                <button
                                                    onClick={exportToPDF}
                                                    className="flex items-center space-x-3 px-8 py-3 bg-white text-black hover:bg-[#FFD700] transition-all rounded-full font-bold uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 active:scale-95"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    <span>Descargar Reporte en PDF</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#2d2d2d]/30 p-6 rounded-xl border-l-4 border-[#FFD700]">
                                        <h5 className="text-[10px] font-bold text-[#FFD700] uppercase tracking-[0.3em] mb-2">Análisis de Sinergia</h5>
                                        <p className="text-white text-sm leading-relaxed">{advisorResult.synergyDetails}</p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleAdvisorSubmit} className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
                                    <div className="text-center space-y-2 mb-10">
                                        <h3 className="text-3xl font-bold text-white">Mapa de Conexión Maestro</h3>
                                        <p className="text-netflix-muted text-sm">Define tu sistema y deja que el Experto trace la ruta de señal perfecta.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-netflix-muted uppercase tracking-widest ml-1">Amplificador / Receiver</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ej: Sansui AU-D11"
                                                    value={selections.amplifier}
                                                    onChange={e => setSelections({ ...selections, amplifier: e.target.value })}
                                                    className="w-full bg-[#252525] border border-[#404040] rounded-lg px-4 py-3 text-sm text-white focus:border-[#FFD700] outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-netflix-muted uppercase tracking-widest ml-1">Tornamesa / Fuente</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ej: Thorens TD-124"
                                                    value={selections.turntable}
                                                    onChange={e => setSelections({ ...selections, turntable: e.target.value })}
                                                    className="w-full bg-[#252525] border border-[#404040] rounded-lg px-4 py-3 text-sm text-white focus:border-[#FFD700] outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-netflix-muted uppercase tracking-widest ml-1">Parlantes</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ej: JBL L100 Century"
                                                    value={selections.speakers}
                                                    onChange={e => setSelections({ ...selections, speakers: e.target.value })}
                                                    className="w-full bg-[#252525] border border-[#404040] rounded-lg px-4 py-3 text-sm text-white focus:border-[#FFD700] outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-netflix-muted uppercase tracking-widest ml-1">Cables</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ej: Kimber Kable 8TC"
                                                    value={selections.cables}
                                                    onChange={e => setSelections({ ...selections, cables: e.target.value })}
                                                    className="w-full bg-[#252525] border border-[#404040] rounded-lg px-4 py-3 text-sm text-white focus:border-[#FFD700] outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-netflix-muted uppercase tracking-widest ml-1">Otros Componentes</label>
                                        <input
                                            type="text"
                                            placeholder="Ej: DAC Chord Hugo, Ecualizador..."
                                            value={selections.other}
                                            onChange={e => setSelections({ ...selections, other: e.target.value })}
                                            className="w-full bg-[#252525] border border-[#404040] rounded-lg px-4 py-3 text-sm text-white focus:border-[#FFD700] outline-none transition-all"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isAdvisorLoading}
                                        className="w-full py-4 bg-[#FFD700] text-black font-bold uppercase tracking-[0.2em] rounded-lg hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] disabled:opacity-50 transition-all flex items-center justify-center space-x-3"
                                    >
                                        {isAdvisorLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Calculando Sinergia...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-5 h-5" />
                                                <span>Generar Esquema Maestro</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>

                {/* Chat Input Area (only for chat) */}
                {!isManualMode && (
                    <div className="p-4 md:p-6 space-y-4 bg-[#1a1a1a]/80 backdrop-blur-md border-t border-[#404040]">
                        {/* Quick Suggestions */}
                        {chatMessages.length < 3 && (
                            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                                {suggestions.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => sendMessage(s)}
                                        className="whitespace-nowrap px-4 py-2 bg-[#2d2d2d] border border-[#404040] rounded-full text-[11px] font-bold text-white hover:border-[#FFD700] hover:text-[#FFD700] transition-all"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="relative flex items-end space-x-2">
                            <div className="flex-1 relative">
                                <textarea
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                    rows={1}
                                    placeholder="Haz una consulta de nivel experto..."
                                    className="w-full bg-[#252525] border border-[#404040] rounded-xl px-4 py-4 pr-14 text-sm md:text-base text-white focus:outline-none focus:border-[#FFD700] transition-all placeholder:text-gray-500 resize-none min-h-[56px] max-h-32"
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    disabled={!currentMessage.trim() || isChatLoading}
                                    className={clsx(
                                        "absolute right-2 bottom-2 w-10 h-10 rounded-lg flex items-center justify-center transition-all disabled:opacity-30",
                                        currentMessage.trim() ? "bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.3)]" : "bg-[#3a3a3a] text-gray-500"
                                    )}
                                >
                                    {isChatLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
