"use client";

import { Table } from "lucide-react";

export default function SpecsTable({ specs }: { specs: any[] }) {
    return (
        <section className="bg-white rounded overflow-hidden border border-fonica-border shadow-sm">
            <div className="p-6 border-b border-fonica-border flex items-center space-x-3 bg-fonica-offwhite">
                <Table className="w-5 h-5 text-fonica-blue" />
                <h3 className="text-xl font-bold uppercase tracking-tight text-black">Especificaciones Técnicas</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="bg-fonica-offwhite text-fonica-muted text-[10px] font-bold uppercase tracking-[0.2em]">
                            <th className="px-8 py-4">Parámetro</th>
                            <th className="px-8 py-4">Detalle Técnico</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-fonica-border">
                        {specs?.map((spec, i) => (
                            <tr key={i} className="group hover:bg-black/[0.01] transition-colors">
                                <td className="px-8 py-5 text-fonica-blue font-bold tracking-tight uppercase text-xs">
                                    {spec.label}
                                </td>
                                <td className="px-8 py-5 text-black font-medium">
                                    {spec.value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
