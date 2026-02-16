import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: "API Key no configurada." }, { status: 500 });
    }

    try {
        const { query } = await req.json();

        if (!query || query.trim() === "") {
            return NextResponse.json({ error: "Consulta vacía." }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
        });

        const prompt = `
            Actúa como un experto historiador de audio Hi-Fi. 
            El usuario está buscando en una base de datos de "Componentes Legendarios".
            Consulta del usuario: "${query}"

            Genera una lista de 4 equipos de audio (reales e históricos) que coincidan con la búsqueda (marca, modelo o tipo).
            Si la búsqueda es muy específica, devuelve ese equipo y 3 similares.
            Si la búsqueda es general (ej. "Sony"), devuelve 4 equipos icónicos de esa marca.

            Responde estrictamente en formato JSON con el siguiente esquema (un array de objetos):
            [
              {
                "id": "string único",
                "brand": "Marca",
                "model": "Modelo",
                "type": "Tipo de equipo (ej: Receiver, Parlantes, Tornamesa)",
                "year": "Año (ej: 1975)",
                "description": "Breve descripción histórica (máximo 150 caracteres)",
                "specs": ["Espec 1", "Espec 2", "Espec 3"]
              }
            ]

            IMPORTANTE:
            - Todo en ESPAÑOL profesional.
            - Solo devuelve el JSON, sin texto adicional.
            - Los equipos deben ser reales y famosos en el mundo audiófilo.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        let cleanJson = responseText.trim();

        // Find the first [ and last ] to extract the JSON array
        const start = cleanJson.indexOf("[");
        const end = cleanJson.lastIndexOf("]") + 1;

        if (start !== -1 && end !== -1) {
            cleanJson = cleanJson.substring(start, end);
        } else {
            // Fallback for when [ ] are missing (unlikely but possible)
            cleanJson = cleanJson.replace(/```json|```/g, "").trim();
        }

        const data = JSON.parse(cleanJson);

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Archive Search API Error:", error);
        return NextResponse.json({ error: "Error al buscar en el archivo." }, { status: 500 });
    }
}
