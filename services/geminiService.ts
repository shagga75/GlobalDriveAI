import { GoogleGenAI } from "@google/genai";
import { SearchResult, GroundingChunk } from '../types';

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing in process.env");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const fetchDrivingRegulations = async (
  originCountry: string,
  destCountry: string,
  type: 'TOURIST' | 'RESIDENT'
): Promise<SearchResult> => {
  
  const modelId = 'gemini-3-flash-preview';
  
  let prompt = "";

  if (type === 'TOURIST') {
    prompt = `
      Act as an international transport and legal consultant.
      I have a driver's license from **${originCountry}**.
      I am planning to visit **${destCountry}** as a **tourist** (short-term stay).

      Please find the most recent and official regulations regarding driving requirements.
      
      Structure your response in Markdown:
      1. **IDP Requirement**: Clearly state if an International Driving Permit (IDP) is REQUIRED, RECOMMENDED, or NOT NEEDED.
      2. **Key Rules**: Briefly explain the specific rule (e.g., "Drivers from EU do not need...", "Must carry translation...").
      3. **Driving Side**: Clearly state if they drive on the **LEFT** or **RIGHT** side of the road.
      4. **Validity**: How long can I drive with my foreign license?
      5. **Emergency Numbers**: List the main emergency numbers (Police, Ambulance) for ${destCountry}.
      6. **Essential Vocabulary**: Create a Markdown Table with 5 key driving words in the local language of ${destCountry} (e.g., Exit, Toll, Danger, One Way) and their English translation.
      7. **Pro Tip**: One specific, non-obvious advice for driving in ${destCountry} (e.g., specific right-of-way rules, flashes, or fines).
      
      Use Google Search to ensure the information is current.
    `;
  } else {
    prompt = `
      Act as an immigration and vehicle licensing expert.
      I have a driver's license from **${originCountry}**.
      I am moving to **${destCountry}** to become a **resident**.

      Please find the official reciprocal license exchange agreements.

      Structure your response in Markdown:
      1. **Exchange Agreement**: Is there a direct exchange agreement? (YES / NO / CONDITIONAL).
      2. **The Process**: Detailed steps to exchange the license without taking a new test (if possible). 
      3. **Driving Side**: Clearly state if they drive on the **LEFT** or **RIGHT** side of the road.
      4. **Requirements**: What documents are needed? (e.g., Translation, Certificate of Authenticity, Medical check).
      5. **Deadlines**: Is there a specific timeframe after arrival when I MUST exchange it?
      6. **Essential Vocabulary**: Create a Markdown Table with 5 key driving words in the local language of ${destCountry} (e.g., License, Insurance, Penalty) and their English translation.
      7. **Alternatives**: If no agreement exists, what is the process to get a local license?
      
      Use Google Search to verify the latest treaties or transport ministry guidelines.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No information found.";
    
    // Extract grounding chunks safely
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Filter chunks that have web URIs
    const validSources: GroundingChunk[] = groundingChunks.filter((chunk: any) => chunk.web?.uri && chunk.web?.title);

    return {
      markdown: text,
      sources: validSources
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch driving regulations. Please try again.");
  }
};