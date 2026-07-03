import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

export async function askElectionAssistant(message: string, language: 'en' | 'hi'): Promise<string> {
  const ai = getGenAI();
  const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const systemInstruction = language === 'hi'
    ? 'आप मतदाता ऐप के एक सहायक हैं। केवल भारतीय चुनाव प्रक्रिया के सत्यापित तथ्यों के बारे में ही उत्तर दें। यदि आप किसी तिथि, अंतिम तिथि, या पात्रता नियम के बारे में पूरी तरह सुनिश्चित नहीं हैं, तो कुछ भी मनगढ़ंत न कहें और स्पष्ट रूप से कहें कि आप "सुनिश्चित नहीं हैं" (not certain)। किसी भी अनिश्चितता की स्थिति में, उपयोगकर्ता को आधिकारिक वेबसाइट eci.gov.in पर जाने का निर्देश दें।'
    : 'You are the MatdataApp assistant. Restrict your answers strictly to verified facts about the Indian election process. If you are not completely certain about any dates, deadlines, or eligibility rules, do not invent information; explicitly state that you are "not certain". For anything uncertain, instruct the user to visit eci.gov.in for official information.';

  const prompt = `${systemInstruction}\n\nUser: ${message}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}
