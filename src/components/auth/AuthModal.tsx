"use client";

import { useState } from "react";
import { X, Mail, Globe, Phone, ArrowRight, Loader2, Key, CreditCard, ShieldCheck, MapPin } from "lucide-react";
import { useUser } from "@/context/UserContext";

const countryCodes = [
    { code: "+1", country: "USA", flag: "🇺🇸" },
    { code: "+57", country: "Colombia", flag: "🇨🇴" },
    { code: "+34", country: "España", flag: "🇪🇸" },
    { code: "+52", country: "México", flag: "🇲🇽" },
    { code: "+54", country: "Argentina", flag: "🇦🇷" },
    { code: "+56", country: "Chile", flag: "🇨🇱" },
    { code: "+51", country: "Perú", flag: "🇵🇪" },
];

type AuthStep = "register" | "verify" | "payment";

export default function AuthModal({ onClose }: { onClose: () => void }) {
    const { login } = useUser();
    const [step, setStep] = useState<AuthStep>("register");
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        country: "Colombia",
        city: "",
        phone: "",
        countryCode: "+57"
    });

    const [cardData, setCardData] = useState({
        number: "",
        expiry: "",
        cvv: ""
    });

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate sending email
        await new Promise(r => setTimeout(r, 1200));
        setIsLoading(false);
        setStep("verify");
    };

    const handleVerifySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate OTP check
        await new Promise(r => setTimeout(r, 1200));
        setIsLoading(false);
        setStep("payment");
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate payment processing
        await new Promise(r => setTimeout(r, 2000));

        login({
            name: formData.email.split('@')[0], // Use email prefix as name for now
            email: formData.email,
            country: formData.country,
            city: formData.city,
            phone: `${formData.countryCode} ${formData.phone}`,
            isPremium: true // Once paid, they are premium
        });

        setIsLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-2xl" onClick={onClose}></div>

            <div className="relative w-full max-w-lg bg-[#0f0f0f] border border-[#2a2a2a] rounded-[48px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                {/* Decorative Top Accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-netflix-red/40 to-transparent"></div>

                <div className="p-10 sm:p-12 space-y-10">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none uppercase">
                                {step === "register" && <>Bienvenido a <span className="text-netflix-red tracking-tighter">Fónica</span></>}
                                {step === "verify" && <>Verifica tu <span className="text-netflix-red tracking-tighter">Acceso</span></>}
                                {step === "payment" && <>Suscripción <span className="text-netflix-red tracking-tighter">Maestro</span></>}
                            </h2>
                            <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.3em]">
                                {step === "register" && "Inteligencia Artificial para Audiofilos"}
                                {step === "verify" && "Hemos enviado un código a tu correo"}
                                {step === "payment" && "Acceso Seguro con Tarjeta de Crédito"}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white/40 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Step Content */}
                    {step === "register" && (
                        <form onSubmit={handleRegisterSubmit} className="space-y-6">
                            <div className="space-y-5">
                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-5">Correo Electrónico</label>
                                    <div className="relative">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input
                                            required
                                            type="email"
                                            placeholder="tu@correo.com"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-[#1a1a1a] border border-white/5 rounded-3xl py-4 pl-14 pr-8 text-white placeholder:text-white/10 focus:outline-none focus:border-netflix-red/30 transition-all font-bold text-sm shadow-inner"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Country */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-5">País</label>
                                        <div className="relative">
                                            <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                                            <select
                                                value={formData.country}
                                                onChange={e => setFormData({ ...formData, country: e.target.value })}
                                                className="w-full bg-[#1a1a1a] border border-white/5 rounded-3xl py-4 pl-14 pr-8 text-white appearance-none focus:outline-none focus:border-netflix-red/30 transition-all font-bold text-sm shadow-inner cursor-pointer"
                                            >
                                                {countryCodes.map(c => (
                                                    <option key={c.country} value={c.country} className="bg-[#0f0f0f]">{c.flag} {c.country}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {/* City */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-5">Ciudad</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                            <input
                                                required
                                                type="text"
                                                placeholder="Ej: Bogotá"
                                                value={formData.city}
                                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full bg-[#1a1a1a] border border-white/5 rounded-3xl py-4 pl-14 pr-8 text-white placeholder:text-white/10 focus:outline-none focus:border-netflix-red/30 transition-all font-bold text-sm shadow-inner"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-5">Número Móvil</label>
                                    <div className="flex space-x-3">
                                        <select
                                            value={formData.countryCode}
                                            onChange={e => setFormData({ ...formData, countryCode: e.target.value })}
                                            className="w-24 bg-[#1a1a1a] border border-white/5 rounded-2xl py-2 px-2 text-white text-xs text-center focus:outline-none focus:border-netflix-red/30 transition-all font-black cursor-pointer"
                                        >
                                            {countryCodes.map(c => (
                                                <option key={c.code} value={c.code} className="bg-[#0f0f0f]">{c.code}</option>
                                            ))}
                                        </select>
                                        <div className="relative flex-1">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
                                            <input
                                                required
                                                type="tel"
                                                placeholder="300 000 0000"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl py-4 pl-10 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-netflix-red/30 transition-all font-bold text-sm shadow-inner"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 bg-netflix-red text-white rounded-[32px] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center space-x-4 hover:shadow-[0_20px_40px_rgba(229,9,20,0.2)] transition-all disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Inscribirse</span>}
                            </button>
                        </form>
                    )}

                    {step === "verify" && (
                        <form onSubmit={handleVerifySubmit} className="space-y-8 py-4">
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 bg-netflix-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ShieldCheck className="w-10 h-10 text-netflix-red animate-pulse" />
                                </div>
                                <p className="text-white text-sm font-bold leading-relaxed px-4">
                                    Para activar el servicio debe validar su correo.<br />
                                    <span className="text-white/40 font-medium">Ingrese la clave numerica de 6 dígitos que enviamos.</span>
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="relative">
                                    <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                    <input
                                        required
                                        type="text"
                                        maxLength={6}
                                        placeholder="0 0 0 0 0 0"
                                        value={otp}
                                        onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-3xl py-6 pl-16 pr-8 text-white text-center text-2xl tracking-[0.5em] font-black placeholder:text-white/5 focus:outline-none focus:border-netflix-red/50 transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || otp.length < 6}
                                    className="w-full py-5 bg-white text-black rounded-[32px] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center space-x-4 transition-all disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Validar Clave</span>}
                                </button>

                                <p className="text-center text-[10px] text-white/30 font-bold uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
                                    ¿No recibiste nada? Reenviar código
                                </p>
                            </div>
                        </form>
                    )}

                    {step === "payment" && (
                        <form onSubmit={handlePaymentSubmit} className="space-y-6">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-netflix-red">Resumen de Pago</span>
                                    <CreditCard className="w-5 h-5 text-white/40" />
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-xl font-bold text-white uppercase">Membresía Maestro</p>
                                        <p className="text-xs text-white/40">Acceso ilimitado a Fónica IA</p>
                                    </div>
                                    <p className="text-3xl font-black text-white">$3<span className="text-sm font-medium text-white/40">/mes</span></p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="relative">
                                    <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Número de Tarjeta"
                                        className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl py-4 pl-14 pr-8 text-white placeholder:text-white/10 focus:outline-none focus:border-netflix-red/30 transition-all font-bold text-sm shadow-inner"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        required
                                        type="text"
                                        placeholder="MM / YY"
                                        className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-white/10 focus:outline-none focus:border-netflix-red/30 transition-all font-bold text-sm shadow-inner text-center"
                                    />
                                    <input
                                        required
                                        type="text"
                                        maxLength={3}
                                        placeholder="CVV"
                                        className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-white/10 focus:outline-none focus:border-netflix-red/30 transition-all font-bold text-sm shadow-inner text-center"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 bg-netflix-red text-white rounded-[32px] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center space-x-4 hover:shadow-[0_20px_40px_rgba(229,9,20,0.2)] transition-all disabled:opacity-50 group"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Confirmar Pago Maestro</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <p className="text-[10px] text-center text-white/20 flex items-center justify-center space-x-2">
                                <ShieldCheck className="w-3 h-3" />
                                <span>Pago seguro encriptado // 256-bit SSL</span>
                            </p>
                        </form>
                    )}
                </div>

                <div className="p-8 bg-[#141414] border-t border-white/5 text-center">
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.5em]">Fónica // Audiofilo Experiencia</p>
                </div>
            </div>
        </div>
    );
}
