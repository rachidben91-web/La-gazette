
import { GoogleGenAI } from "@google/genai";

export const geminiService = {
  async refineArticleSuggestion(topic: string, description: string) {
    // Always initialize GoogleGenAI with the apiKey in a named parameter using process.env.API_KEY directly.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `L'utilisateur souhaite proposer un article pour la gazette de l'agence.
    Sujet : ${topic}
    Description : ${description}

    En tant que rédacteur en chef, analyse cette proposition. Donne des conseils pour rendre l'article plus percutant, suggère 3 sous-titres intéressants et évalue l'intérêt pour les collaborateurs de l'agence. Réponds de manière constructive et encourageante en français.`;

    try {
      // Use 'gemini-3-flash-preview' for basic text tasks.
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      // Use the .text property directly (not a method).
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Désolé, l'assistant éditorial est temporairement indisponible.";
    }
  },

  async summarizeIssue(content: string) {
    // Re-initialize for each call to ensure the latest API key is used.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Résume le contenu suivant de notre gazette interne en 3 points clés percutants pour un affichage rapide.
    Contenu : ${content}`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      // Accessing the extracted string output via .text property.
      return response.text;
    } catch (error) {
      return "Résumé non disponible.";
    }
  }
};
