"use client";

import { Check, Star, Zap, ShieldCheck, Crown } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function PremiumModule({ onUpgrade }: { onUpgrade: () => void }) {
    const { user } = useUser();

    if (user?.isPremium) return null;

    return (
        <div className="bg-netflix-dark p-8 rounded-lg border border-netflix-border/50 space-y-6 relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-netflix-red/5 blur-3xl -mr-16 -mt-16 group-hover:bg-netflix-red/10 transition-colors duration-700"></div>

            <div className="flex items-center justify-between relative z-10">
                <div className="p-3 bg-netflix-red rounded-lg shadow-lg shadow-netflix-red/20">
                    <Crown className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-netflix-muted">Suscripción Maestro</p>
                    <p className="text-2xl font-bold text-white leading-none mt-1">$3<span className="text-sm font-normal text-netflix-muted">/mes</span></p>
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                <h3 className="text-xl font-bold text-white"><span className="text-netflix-red">Fónica</span> Maestro</h3>
                <p className="text-xs text-netflix-muted leading-relaxed">
                    Desbloquea asesoría técnica ilimitada con Gemini 2.5, análisis de esquemas y exportación de reportes HD sin límites.
                </p>
            </div>

            <div className="space-y-3 relative z-10">
                {[
                    "Consultas técnicas ilimitadas",
                    "Análisis de sinergia avanzado",
                    "Exportación PDF Premium",
                    "Sin límites de mensajes/día"
                ].map(item => (
                    <div key={item} className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-wider text-netflix-text/80">
                        <Check className="w-3 h-3 text-netflix-red" />
                        <span>{item}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={onUpgrade}
                className="w-full py-4 bg-white text-black rounded font-bold uppercase text-xs tracking-widest hover:bg-white/90 transition-all relative z-10"
            >
                Actualizar Ahora
            </button>
        </div>
    );
}
