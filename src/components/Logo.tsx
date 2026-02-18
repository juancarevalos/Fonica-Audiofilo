"use client";

import { Zap } from "lucide-react";

export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <div className={`relative flex items-center justify-center group ${className}`}>
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-fonica-blue/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

            <div className="relative z-10 w-full h-full bg-gradient-to-br from-fonica-blue via-fonica-blue-deep to-black flex items-center justify-center rounded-[20%] shadow-2xl shadow-fonica-blue/30 transform group-hover:scale-105 transition-all duration-700 ease-out overflow-hidden">
                {/* SVG Symbol */}
                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[70%] h-[70%] text-white"
                >
                    <path
                        d="M50 20C33.4315 20 20 33.4315 20 50C20 66.5685 33.4315 80 50 80C66.5685 80 80 66.5685 80 50C80 33.4315 66.5685 20 50 20Z"
                        stroke="currentColor"
                        strokeWidth="8"
                    />
                    <path
                        d="M50 35V65M35 50H65"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                    />
                </svg>
                {/* Inner Shine Effect */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent"></div>
            </div>
            {/* Orbiting Ring */}
            <div className="absolute inset-[-6px] border border-fonica-blue/10 rounded-[22%] group-hover:inset-[-10px] group-hover:border-fonica-blue/30 transition-all duration-1000"></div>
            <div className="absolute inset-[-12px] border border-fonica-blue/5 group-hover:border-fonica-blue/10 rounded-full transition-all duration-1000 animate-[spin_20s_linear_infinite]"></div>
        </div>
    );
}
