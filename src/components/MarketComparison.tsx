"use client";

import { TrendingUp, DollarSign, Globe2, BarChart3 } from "lucide-react";

export default function MarketComparison({ marketData }: { marketData: any }) {
    if (!marketData) return null;

    return (
        <section className="bg-white rounded-lg border border-fonica-border p-6 space-y-6 shadow-sm">
            <div className="flex items-center space-x-2 text-fonica-blue">
                <Globe2 className="w-5 h-5" />
                <h3 className="text-xl font-bold uppercase tracking-tight text-black">Contexto de Mercado</h3>
            </div>

            <div className="space-y-4">
                <div className="p-5 bg-fonica-offwhite rounded border border-fonica-border">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase font-bold text-fonica-muted tracking-[0.2em]">Rango de Valor Estimado</span>
                        <TrendingUp className="w-4 h-4 text-fonica-blue" />
                    </div>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold text-black">{marketData.priceRange}</span>
                        <span className="text-sm font-bold text-fonica-muted uppercase">USD</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-fonica-offwhite rounded border border-fonica-border">
                        <div className="flex items-center space-x-2 text-fonica-muted mb-2">
                            <DollarSign className="w-3.5 h-3.5" />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Liquidez</span>
                        </div>
                        <p className="text-sm font-bold text-black uppercase">{marketData.liquidity}</p>
                    </div>
                    <div className="p-4 bg-fonica-offwhite rounded border border-fonica-border">
                        <div className="flex items-center space-x-2 text-fonica-muted mb-2">
                            <BarChart3 className="w-3.5 h-3.5" />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Tendencia</span>
                        </div>
                        <p className="text-sm font-bold text-black uppercase">{marketData.trend}</p>
                    </div>
                </div>

                <div className="pt-6 border-t border-fonica-border">
                    <h4 className="text-[10px] font-bold uppercase text-fonica-muted tracking-[0.2em] mb-3">Análisis de Inversión</h4>
                    <p className="text-xs font-medium text-black leading-relaxed">
                        "{marketData.investmentInsight}"
                    </p>
                </div>
            </div>
        </section>
    );
}
