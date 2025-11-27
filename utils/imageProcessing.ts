
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { SlicedImage, OutputFormat } from '../types';

export const sliceImage = async (
  imageSrc: string,
  rows: number,
  cols: number,
  format: OutputFormat,
  trimX: number = 0,
  trimY: number = 0
): Promise<SlicedImage[]> => {
  return new Promise((resolve, reject) => {
    // Basic validation to prevent errors if input is cleared (0)
    if (!rows || rows < 1 || !cols || cols < 1) {
        resolve([]);
        return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    
    // Better implementation of the loop handling
    img.onload = async () => {
       const pieceWidth = img.width / cols;
       const pieceHeight = img.height / rows;
       const promises: Promise<SlicedImage | null>[] = [];
       let idCounter = 0;

       for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const currentId = idCounter++;
          
          const sX = x * pieceWidth + trimX;
          const sY = y * pieceHeight + trimY;
          const sW = pieceWidth - (trimX * 2);
          const sH = pieceHeight - (trimY * 2);

          if (sW <= 0 || sH <= 0) {
            promises.push(Promise.resolve(null));
            continue;
          }

          const p = new Promise<SlicedImage | null>((res) => {
              const canvas = document.createElement('canvas');
              canvas.width = sW;
              canvas.height = sH;
              const ctx = canvas.getContext('2d');
              if (!ctx) { res(null); return; }

              ctx.drawImage(img, sX, sY, sW, sH, 0, 0, sW, sH);
              
              const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
              const ext = format === 'png' ? '.png' : '.jpg';

              canvas.toBlob((blob) => {
                if (blob) {
                  res({
                    id: currentId,
                    url: URL.createObjectURL(blob),
                    blob,
                    fileName: `slice_${y}_${x}${ext}`
                  });
                } else {
                  res(null);
                }
              }, mimeType, 0.9);
          });
          promises.push(p);
        }
       }

       try {
         const results = await Promise.all(promises);
         const validImages = results.filter((i): i is SlicedImage => i !== null);
         validImages.sort((a, b) => a.id - b.id);
         resolve(validImages);
       } catch (e) {
         reject(e);
       }
    };

    img.onerror = (err) => reject(err);
    img.src = imageSrc;
  });
};

export const downloadAsZip = async (images: SlicedImage[], zipName: string = 'sprites.zip') => {
  const zip = new JSZip();
  const folder = zip.folder("slices");

  if (!folder) return;

  images.forEach((img) => {
    folder.file(img.fileName, img.blob);
  });

  const content = await zip.generateAsync({ type: "blob" });
  
  // Handle different export patterns for file-saver
  const save = (FileSaver as any).saveAs || FileSaver;
  save(content, zipName);
};
