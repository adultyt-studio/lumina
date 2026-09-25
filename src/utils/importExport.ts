import type { Frame, DesignElement } from '../types/design';

// --- EXPORT AS JSON ---
export function exportAsJSON(frames: Frame[], filename = 'lumina-design.json') {
  const dataStr = JSON.stringify(frames, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// --- IMPORT FROM JSON ---
export function importFromJSON(file: File): Promise<Frame[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const frames = JSON.parse(e.target?.result as string);
        if (!Array.isArray(frames)) {
          throw new Error('Invalid frame format');
        }
        resolve(frames);
      } catch (err) {
        reject(new Error('Invalid Lumina JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// --- IMPORT IMAGE FILE ---
export function importImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('Failed to load image'));
    reader.readAsDataURL(file);
  });
}

// --- EXPORT AS SVG ---
export function generateSVGFromFrame(frame: Frame): string {
  const elementsSvg = frame.elements
    .map((el) => {
      if (el.type === 'text') {
        return `<text x="${el.x}" y="${el.y + el.fontSize}" font-family="${el.fontFamily}" font-size="${el.fontSize}" font-weight="${el.fontWeight}" fill="${el.color}">${el.content}</text>`;
      }
      if (el.type === 'glass-panel') {
        return `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="${el.cornerRadius}" fill="rgba(255,255,255,0.2)" stroke="${el.borderColor}" stroke-width="${el.borderWidth}" />`;
      }
      if (el.type === 'shape') {
        if (el.shapeType === 'circle') {
          return `<circle cx="${el.x + el.width / 2}" cy="${el.y + el.height / 2}" r="${el.width / 2}" fill="${el.fillColor}" stroke="${el.strokeColor}" stroke-width="${el.strokeWidth}" />`;
        }
        return `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="${el.borderRadius}" fill="${el.fillColor}" stroke="${el.strokeColor}" stroke-width="${el.strokeWidth}" />`;
      }
      if (el.type === 'image') {
        return `<image x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" href="${el.src}" />`;
      }
      return '';
    })
    .join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${frame.width}" height="${frame.height}" viewBox="0 0 ${frame.width} ${frame.height}">
  <rect width="100%" height="100%" fill="${frame.backgroundColor}" />
  ${elementsSvg}
</svg>`;
}

export function exportAsSVG(frame: Frame) {
  const svgMarkup = generateSVGFromFrame(frame);
  const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${frame.name.toLowerCase().replace(/\s+/g, '-')}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// --- EXPORT AS PNG VIA HTML5 CANVAS ---
export function exportAsPNG(frame: Frame) {
  const canvas = document.createElement('canvas');
  canvas.width = frame.width * 2;
  canvas.height = frame.height * 2;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(2, 2);
  ctx.fillStyle = frame.backgroundColor || '#0f172a';
  ctx.fillRect(0, 0, frame.width, frame.height);

  frame.elements.forEach((el) => {
    ctx.save();
    ctx.globalAlpha = el.opacity;

    if (el.type === 'text') {
      ctx.font = `${el.fontWeight} ${el.fontSize}px "${el.fontFamily}", sans-serif`;
      ctx.fillStyle = el.color;
      ctx.fillText(el.content, el.x, el.y + el.fontSize);
    } else if (el.type === 'glass-panel' || el.type === 'shape') {
      const radius = (el as any).cornerRadius || (el as any).borderRadius || 16;
      ctx.fillStyle = (el as any).fillColor || 'rgba(255, 255, 255, 0.2)';
      ctx.strokeStyle = (el as any).borderColor || (el as any).strokeColor || 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = (el as any).borderWidth || (el as any).strokeWidth || 1;

      ctx.beginPath();
      ctx.roundRect(el.x, el.y, el.width, el.height, radius);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  });

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${frame.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}
