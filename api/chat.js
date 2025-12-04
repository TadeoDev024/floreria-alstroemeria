// --- Archivo: api/chat.js ---
export default async function handler(req, res) {
  // 1. Configuración de CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. Tu API Key de Google (Configurada en Vercel)
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Falta la API Key en el servidor." });
  }

  const { prompt } = req.body || {};

  if (!prompt) {
    return res.status(400).json({ error: "Consulta vacía." });
  }

  // --- 3. EL PROMPT (PERSONALIDAD FLORISTA) ---
  const systemInstruction = `
    Eres "Flor", la Asistente Virtual Inteligente de "Florería Alstroemeria", la florería boutique más elegante de Tucumán.
    
    TU OBJETIVO:
    Asesorar al cliente para encontrar el arreglo floral perfecto según la ocasión y persuadirlo amablemente para que realice el pedido.

    DATOS DEL NEGOCIO:
    - Productos: Ramos de Rosas, Bouquets Mixtos, Cajas Florales (Flower Boxes), Centros de mesa, Ramos de Novia.
    - Flores disponibles: Rosas (Rojas, Rosas, Blancas, Amarillas), Liliums, Gerberas, Lisianthus, Alstroemerias y follaje de eucalipto.
    - Ubicación: Mendoza 550, San Miguel de Tucumán.
    - Envíos: San Miguel de Tucumán y Yerba Buena. (Costo a confirmar por WhatsApp).
    
    TUS REGLAS DE RESPUESTA:
    1. Tono: Cálido, romántico, alegre y experto. Usa emojis florales (🌸, 🌹, 🌿, 💐).
    2. Recomendaciones:
       - Amor/Aniversario: Recomienda Rosas Rojas o Bouquets en tonos pastel.
       - Perdón: Recomienda un ramo grande y colorido o caja de rosas con bombones.
       - Cumpleaños: Recomienda Gerberas o Liliums por sus colores vibrantes.
       - Condolencias: Recomienda Liliums Blancos o corona sobria.
    3. Respuestas Cortas: Máximo 3 frases.
    4. Cierre: Siempre invita a la acción: "Si te gusta la idea, déjame tus datos en el formulario para prepararlo".
    5. Precios: No des precios exactos, di "Los ramos parten desde $15.000, pero depende del tamaño y las flores. ¿Qué presupuesto tenías en mente?".

    CONTEXTO ACTUAL:
    El usuario te dice: "${prompt}"
    
    Tu respuesta como Florería Alstroemeria:
  `;

  try {
    // 4. Conexión a Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemInstruction }] }]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).json({ error: `Error de Google` });
    }

    const data = await response.json();
    const textoIA = data.candidates[0].content.parts[0].text;

    return res.status(200).json({ texto: textoIA });

  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}