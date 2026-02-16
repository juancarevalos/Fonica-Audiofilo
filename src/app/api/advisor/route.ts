import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API Key no configurada." },
      { status: 500 }
    );
  }

  try {
    const { selections, userName = "Audiófilo" } = await req.json();
    const { amplifier, turntable, speakers, cables, other } = selections;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json"
      }
    });

    const prompt = `
      Eres el "Maestro Senior de Fónica", una autoridad mundial inspirada en la sobriedad técnica de Santiago de León Audio, la pasión por la musicalidad de Francisco del Pozo y el espíritu comunitario de la Asociación de Audiófilos.
      
      OBJETIVO: Generar un reporte técnico de conexión de ALTA PRECISIÓN para ${userName}.
      
      SISTEMA A ANALIZAR:
      - Amplificador: ${amplifier}
      - Fuente (Digital/Análoga): ${turntable || "No especificada"}
      - Parlantes: ${speakers}
      - Cables: ${cables || "Genéricos"}
      - Otros: ${other || "Ninguno"}

      INSTRUCCIONES DE IDENTIDAD:
      1. SANTIAGO DE LEÓN: Analiza la topología (ej. si el Sansui AU-717 es Direct-FET) y advierte sobre ruidos de bucle o ajustes de bias si es equipo vintage.
      2. FRANCISCO DEL POZO: Evalúa la escena sonora y la transparencia que esta combinación específica producirá.
      3. ASOCIACIÓN DE AUDIÓFILOS: Menciona cómo este sistema se comportaría en una sala compartida o su valor como pieza de colección.

      ESTRUCTURA DE RESPUESTA (JSON ESTRICTO):
      {
        "title": "Configuración Maestro: ${amplifier} + ${speakers}",
        "intro": "Veredicto ejecutivo corto y contundente.",
        "synergyDetails": "Análisis profundo de cómo interactúan eléctricamente y acústicamente estos componentes.",
        "expertTips": ["Mínimo 3 tips técnicos cortos y accionables"],
        "connectionScheme": {
          "sourceToAmp": "Instrucción de cableado desde la fuente al amplificador (puerto exacto).",
          "ampToSpeakers": "Instrucción de cableado del amplificador a los parlantes (fase y terminales).",
          "grounding": "Instrucción de tierra si es necesario (especialmente si hay tornamesa).",
          "visual": {
            "nodes": [
              {"id": "source", "label": "${turntable || 'Fuente'}", "type": "SOURCE"},
              {"id": "amp", "label": "${amplifier}", "type": "AMPLIFIER"},
              {"id": "speakers", "label": "${speakers}", "type": "SPEAKERS"}
            ],
            "connections": [
              {"from": "source", "to": "amp", "cable": "RCA Phono / Line", "desc": "Señal"},
              {"from": "amp", "to": "speakers", "cable": "Speaker Wire", "desc": "Potencia"}
            ]
          }
        }
      }

      REGLA DE ORO: Los nodos del diagrama DEBEN usar exactamente los nombres de los equipos que el usuario proporcionó.
      Idioma: ESPAÑOL.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Safety check for parsing
    try {
      const advisoryData = JSON.parse(responseText.trim());
      return NextResponse.json(advisoryData);
    } catch (parseError) {
      console.error("JSON Parsing Error in Advisor:", responseText);
      // Fallback or retry logic could go here, but let's try to clean it first
      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      return NextResponse.json(JSON.parse(cleanJson));
    }

  } catch (error: any) {
    console.error("Advisor API Error:", error);
    // Return specific quota error if detected
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      return NextResponse.json({ error: "QUOTA_EXCEEDED" }, { status: 429 });
    }
    return NextResponse.json(
      { error: "Error en la asesoría técnica: " + error.message },
      { status: 500 }
    );
  }
}
