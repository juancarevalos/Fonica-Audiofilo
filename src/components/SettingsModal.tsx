"use client";

import { useUser } from "@/context/UserContext";
import { X, User, Mail, Globe, Phone, Crown, LogOut, Camera } from "lucide-react";

export default function SettingsModal({ onClose, onOpenPremium }: { onClose: () => void, onOpenPremium: () => void }) {
    const { user, logout } = useUser();

    if (!user) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-xl" onClick={onClose}></div>

            <div className="relative w-full max-w-md bg-white border border-fonica-border rounded-[48px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                {/* Decorative Top Accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-fonica-blue/40 to-transparent"></div>

                <div className="p-10 space-y-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-serif font-black text-black">Perfil</h2>
                        <button onClick={onClose} className="p-2 bg-fonica-offwhite hover:bg-fonica-border rounded-full text-fonica-muted hover:text-black transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Avatar Section */}
                    <div className="flex flex-col items-center space-y-4 pt-2">
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-full bg-fonica-offwhite border-4 border-fonica-blue/10 flex items-center justify-center overflow-hidden shadow-2xl">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-fonica-offwhite to-white">
                                        <User className="w-14 h-14 text-fonica-blue/20" />
                                    </div>
                                )}
                            </div>
                            <button className="absolute bottom-0 right-0 p-3 bg-fonica-blue text-white rounded-full shadow-2xl transform group-hover:scale-110 transition-all">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-black tracking-tight">{user.name}</h3>
                            <div className="flex items-center justify-center space-x-2 mt-1">
                                {user.isPremium ? (
                                    <div className="flex items-center space-x-1 px-3 py-1 bg-premium-gold/10 border border-premium-gold/20 rounded-full">
                                        <Crown className="w-3 h-3 text-premium-gold" />
                                        <span className="text-[9px] text-premium-gold font-black uppercase tracking-[0.2em]">SOCIO PREMIUM</span>
                                    </div>
                                ) : (
                                    <span className="text-[9px] text-fonica-muted font-black uppercase tracking-[0.2em]">ACCESO ESTÁNDAR</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Personal Info */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-4 p-5 bg-fonica-offwhite rounded-3xl border border-fonica-border shadow-inner">
                            <Mail className="w-4 h-4 text-fonica-blue/30" />
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.3em] font-black text-fonica-blue/40 mb-0.5">Email Registrado</p>
                                <p className="text-sm text-black font-medium">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 p-5 bg-fonica-offwhite rounded-3xl border border-fonica-border shadow-inner">
                            <Globe className="w-4 h-4 text-fonica-blue/30" />
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.3em] font-black text-fonica-blue/40 mb-0.5">Localización</p>
                                <p className="text-sm text-black font-medium">{user.country}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-fonica-border">
                        {!user.isPremium && (
                            <button
                                onClick={() => {
                                    onOpenPremium();
                                    onClose();
                                }}
                                className="w-full py-5 bg-fonica-blue text-white rounded-[32px] font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center space-x-3 hover:bg-fonica-blue-deep hover:shadow-2xl transition-all"
                            >
                                <Crown className="w-4 h-4" />
                                <span>Mejorar a Maestro</span>
                            </button>
                        )}
                        <button
                            onClick={() => {
                                logout();
                                onClose();
                            }}
                            className="w-full py-4 text-fonica-red/40 hover:text-fonica-red text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center space-x-3 group"
                        >
                            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>Cerrar Sesión Técnica</span>
                        </button>
                    </div>
                </div>

                <div className="p-8 bg-fonica-offwhite border-t border-fonica-border text-center">
                    <p className="text-[10px] text-fonica-muted font-bold uppercase tracking-[0.5em]">Fónica Systems // Account Central</p>
                </div>
            </div>
        </div>
    );
}
