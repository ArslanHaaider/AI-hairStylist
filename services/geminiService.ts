import { GoogleGenAI, Modality } from "@google/genai";
import { GeneratedImage } from "../types";

// Do not instantiate GoogleGenAI in the global scope when using API key selection.
// In this app, since we are not using API key selection, it's fine.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const views = [
  { label: "Front View", promptSuffix: ", front view of the head and shoulders" },
  { label: "Left Side View", promptSuffix: ", side profile view from the left" },
  { label: "Right Side View", promptSuffix: ", side profile view from the right" },
  { label: "Back View", promptSuffix: ", view from the back of the head" }
];

export async function generateHairstyles(
    base64Image: string,
    mimeType: string,
    basePrompt: string
): Promise<GeneratedImage[]> {
    const imagePart = {
        inlineData: { data: base64Image, mimeType },
    };

    const promises = views.map(async (view) => {
        const fullPrompt = `On this person's headshot, give them a new hairstyle: ${basePrompt}. The view should be a ${view.promptSuffix}. Maintain the person's facial features.`;
        
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [imagePart, { text: fullPrompt }] },
                config: { responseModalities: [Modality.IMAGE] },
            });
            
            if (response.candidates && response.candidates.length > 0) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        const base64Bytes = part.inlineData.data;
                        return {
                            label: view.label,
                            url: `data:${part.inlineData.mimeType};base64,${base64Bytes}`,
                        };
                    }
                }
            }
             throw new Error(`No image data received for ${view.label}. The response may have been blocked.`);

        } catch (error) {
            console.error(`Error generating style for ${view.label}:`, error);
            // Re-throw a more user-friendly error
            if (error instanceof Error) {
                 throw new Error(`Failed to generate the hairstyle for the ${view.label}. Details: ${error.message}`);
            }
            throw new Error(`Failed to generate the hairstyle for the ${view.label}. The request might have been blocked due to safety policies.`);
        }
    });

    return Promise.all(promises);
}
