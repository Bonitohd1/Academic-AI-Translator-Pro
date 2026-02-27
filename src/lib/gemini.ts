import { GoogleGenAI } from '@google/genai';

let genAI: GoogleGenAI | null = null;

function getGenAI() {
  if (!genAI) {
    // Try to get API key from localStorage first (for client-side usage)
    // Fallback to environment variable (for development/server configuration)
    const apiKey = localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
    
    if (!apiKey) {
      throw new Error('API key must be set when using the Gemini API.');
    }

    genAI = new GoogleGenAI({
      apiKey: apiKey,
    });
  }
  return genAI;
}

// Reset the client when API key changes
export function resetGenAIClient() {
  genAI = null;
}

export class GeminiService {
  private async generateContent(prompt: string): Promise<string> {
    const ai = getGenAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      return response.text || '';
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  async translateDocument(
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<string> {
    const prompt = `You are an expert academic translator specializing in research documents and scientific papers.

Translate the following ${sourceLanguage} text to ${targetLanguage}. Maintain:
- Technical terminology accuracy
- Academic tone and formality
- Citation format preservation
- Paragraph structure and formatting

Original text:
"""
${text}
"""

Provide only the translated text without any explanations.`;

    const result = await this.generateContent(prompt);
    return result;
  }

  async answerQuestion(
    documentText: string,
    question: string
  ): Promise<{ answer: string; excerpts: string[] }> {
    const prompt = `You are an expert research assistant analyzing an academic document.

Document:
"""
${documentText}
"""

User Question: ${question}

Instructions:
1. Answer the question based ONLY on the provided document
2. Be specific and reference relevant parts of the document
3. If the answer is not in the document, say "The document does not contain information about this topic"
4. Keep the answer concise but comprehensive

Provide your answer:`;

    const result = await this.generateContent(prompt);
    
    // Extract relevant excerpts (simple implementation)
    const excerpts = this.extractExcerpts(documentText, question);
    
    return {
      answer: result,
      excerpts: excerpts.slice(0, 3),
    };
  }

  async summarizeDocument(
    text: string,
    length: 'brief' | 'medium' | 'comprehensive' = 'medium'
  ): Promise<{ summary: string; keyPoints: string[] }> {
    const lengthGuide = {
      brief: '2-3 paragraphs (150-200 words)',
      medium: '4-6 paragraphs (300-400 words)',
      comprehensive: '8-10 paragraphs (500-700 words)',
    };

    const prompt = `You are an expert academic researcher. Summarize the following research document with professional precision.

Document:
"""
${text}
"""

Please provide:
1. A ${lengthGuide[length]} summary that captures the main concepts, methodology, findings, and implications
2. Follow with exactly 5-8 key points as a bulleted list

Format your response as:
SUMMARY:
[Your summary here]

KEY POINTS:
- [Point 1]
- [Point 2]
... etc`;

    const responseText = await this.generateContent(prompt);
    
    // Parse the response
    const summaryMatch = responseText.match(/SUMMARY:\s*([\s\S]*?)(?=KEY POINTS:|$)/);
    const keyPointsMatch = responseText.match(/KEY POINTS:\s*([\s\S]*?)$/);
    
    const summary = summaryMatch ? summaryMatch[1].trim() : responseText;
    const keyPointsText = keyPointsMatch ? keyPointsMatch[1] : '';
    const keyPoints = keyPointsText
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace(/^-\s*/, '').trim())
      .filter(Boolean);

    return {
      summary,
      keyPoints: keyPoints.length > 0 ? keyPoints : ['Summary provided above'],
    };
  }

  private extractExcerpts(text: string, query: string): string[] {
    const words = query.toLowerCase().split(/\s+/);
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    
    return sentences
      .filter(sentence =>
        words.some(word => sentence.toLowerCase().includes(word))
      )
      .map(s => s.trim())
      .slice(0, 5);
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const result = await this.generateContent('test');
      return !!result && result.length > 0;
    } catch (error) {
      console.error('API validation failed:', error);
      return false;
    }
  }
}

export const geminiService = new GeminiService();
