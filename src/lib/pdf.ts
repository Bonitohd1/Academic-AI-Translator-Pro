import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set up the worker with correct URL
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export class PDFService {
  async extractTextFromPDF(file: File): Promise<{
    content: string;
    pageCount: number;
    metadata: Record<string, any>;
  }> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
        useWorkerFetch: false,
      }).promise;
      
      let fullText = '';
      const pageTexts: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          pageTexts.push(pageText);
          fullText += pageText + '\n\n';
        } catch (pageError) {
          console.warn(`Error extracting page ${i}:`, pageError);
          // Continue with next page
        }
      }

      // Extract metadata
      const metadata = await pdf.getMetadata().catch(() => ({}));

      return {
        content: fullText.trim(),
        pageCount: pdf.numPages,
        metadata: metadata || {},
      };
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error(`Failed to extract PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async validatePDFFile(file: File): Promise<{
    valid: boolean;
    error?: string;
  }> {
    // Check file extension (more flexible than MIME type)
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return {
        valid: false,
        error: 'File must be a PDF (.pdf extension)',
      };
    }

    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size must be less than 50MB',
      };
    }

    // Try to parse to ensure it's valid PDF
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
        useWorkerFetch: false,
      }).promise;
      
      if (pdf.numPages === 0) {
        return {
          valid: false,
          error: 'PDF has no pages',
        };
      }

      return { valid: true };
    } catch (error) {
      console.error('PDF validation error:', error);
      return {
        valid: false,
        error: `Invalid PDF file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
}

export const pdfService = new PDFService();
