import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export const exportToWord = async (text: string, title: string = 'Document') => {
  // Split text into paragraphs based on double newlines
  const paragraphs = text.split('\n\n').map(p => p.trim()).filter(Boolean);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs.map(p => 
          new Paragraph({
            children: [
              new TextRun({
                text: p,
                size: 24, // 12pt
                font: "Times New Roman",
              }),
            ],
            spacing: {
              after: 240, // 12pt
            },
          })
        ),
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${title.replace(/\s+/g, '-').toLowerCase()}.docx`);
};
