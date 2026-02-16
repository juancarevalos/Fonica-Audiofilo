import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_key_here") {
    return NextResponse.json(
      { error: "Falta la API Key de Gemini. Por favor, configúrala en el archivo .env.local" },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No se proporcionó ninguna imagen." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const buffer = Buffer.from(await image.arrayBuffer());
    const base64Image = buffer.toString("base64");

    const prompt = `
      Actúa como un experto mundial en audio de alta fidelidad (Hi-Fi) y vintage. 
      Identifica el equipo en esta imagen. Devuelve estrictamente un objeto JSON con la siguiente estructura, sin texto adicional:
      {
        "brand": "Marca",
        "model": "Modelo exacto",
        "era": "Años de producción (ej. 1970-1974)",
        "origin": "Lugar de fabricación",
        "statusLabel": "Un título corto y épico (ej. Santo Grial, Gama Alta, Joya Oculta)",
        "cultFactor": 5,
        "specs": [
          {"label": "Potencia", "value": "Detalle técnico"},
          {"label": "Peso", "value": "Peso en kg"},
          ... (mínimo 5 especificaciones relevantes)
        ],
        "topology": {
          "architecture": "Breve descripción de la arquitectura",
          "criticalParts": ["Parte 1", "Parte 2", "Parte 3"],
          "signalFlow": "Descripción corta del flujo de señal"
        },
        "expertInsights": {
          "mainComment": "Comentario apasionado.",
          "commonIssues": ["Fallo 1", "Fallo 2", "Fallo 3"],
          "synergyTip": "Consejo de emparejamiento."
        },
        "marketData": {
          "priceRange": "$XXX - $XXX",
          "liquidity": "Baja/Media/Alta",
          "trend": "Alza/Estable/Baja",
          "investmentInsight": "Comentario corto sobre su valor de reventa."
        }
      }
      Toda la información debe estar en ESPAÑOL.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: image.type,
        },
      },
    ]);

    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const equipmentData = JSON.parse(cleanJson);

    return NextResponse.json(equipmentData);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Error en la identificación: " + (error.message || "La IA no pudo procesar esta imagen") },
      { status: 500 }
    );
  }
}
