import html2canvas from 'html2canvas-pro';
import {jsPDF} from 'jspdf';

export interface PdfExportOptions {
  filename: string;
  documentTitle?: string;
}

export interface PdfExportResult {
  pageCount: number;
  filename: string;
  savedTo: string;
  usedNativeBridge: boolean;
}

export interface QuadraAndroidBridge {
  saveBase64File?: (
    base64Data: string,
    filename: string,
    mimeType: string,
  ) => string;
  ensureCameraPermission?: () => boolean;
  ensureStoragePermission?: () => boolean;
}

declare global {
  interface Window {
    QuadraAndroid?: QuadraAndroidBridge;
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const commaIdx = result.indexOf(',');
      if (commaIdx === -1) {
        reject(new Error('Failed to encode PDF binary data.'));
        return;
      }
      resolve(result.slice(commaIdx + 1));
    };
    reader.onerror = () => reject(new Error('Failed to read exported file data.'));
    reader.readAsDataURL(blob);
  });
}

export async function saveBlobToDevice(
  blob: Blob,
  filename: string,
  mimeType = 'application/pdf',
): Promise<{savedTo: string; usedNativeBridge: boolean}> {
  const androidBridge =
    typeof window !== 'undefined' ? window.QuadraAndroid : undefined;

  if (androidBridge?.saveBase64File) {
    const base64Data = await blobToBase64(blob);
    const result = androidBridge.saveBase64File(base64Data, filename, mimeType);
    if (typeof result === 'string' && result.startsWith('ERROR:')) {
      throw new Error(result.slice(6).trim() || 'Could not save file on device.');
    }
    const savedPath =
      typeof result === 'string' && result.startsWith('OK:')
        ? result.slice(3).trim()
        : `Downloads/Quadra12/${filename}`;
    return {savedTo: savedPath, usedNativeBridge: true};
  }

  triggerBlobDownload(blob, filename);
  return {savedTo: filename, usedNativeBridge: false};
}

/**
 * Rasterizes an embedded data:image/svg+xml <img> into a crisp high-DPI PNG data URL
 * so html2canvas-pro never skips or blurs vector diagrams across mobile WebViews.
 */
async function rasterizeSvgImageElement(img: HTMLImageElement): Promise<void> {
  const src = img.getAttribute('src') || '';
  if (!src.startsWith('data:image/svg+xml')) {
    if (typeof img.decode === 'function') {
      await img.decode().catch(() => undefined);
    }
    return;
  }

  await new Promise<void>((resolve) => {
    const loader = new Image();
    loader.onload = () => {
      try {
        const naturalW = loader.naturalWidth || img.clientWidth || 420;
        const naturalH = loader.naturalHeight || img.clientHeight || 240;
        const scale = 2.5;
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(naturalW * scale));
        canvas.height = Math.max(1, Math.round(naturalH * scale));
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(loader, 0, 0, canvas.width, canvas.height);
          const pngUrl = canvas.toDataURL('image/png');
          img.setAttribute('src', pngUrl);
        }
      } catch {
        // Keep original SVG data URL if rasterization fails
      }
      resolve();
    };
    loader.onerror = () => resolve();
    loader.src = src;
  });
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 60_000);
}

/**
 * Exports a printable HTML element into a paginated A4 PDF file using block-aware pagination
 * so no question, text line, or SVG diagram is sliced across page breaks.
 */
export async function exportElementToA4Pdf(
  sourceElement: HTMLElement,
  options: PdfExportOptions,
): Promise<PdfExportResult> {
  const A4_WIDTH_PX = 794; // 210mm @ 96 DPI
  const A4_HEIGHT_PX = 1123; // 297mm @ 96 DPI
  const PAD_TOP_PX = 32;
  const PAD_BOTTOM_PX = 48;
  const PAD_SIDE_PX = 38;
  const MAX_CONTENT_HEIGHT_PX = A4_HEIGHT_PX - PAD_TOP_PX - PAD_BOTTOM_PX; // ~1043px

  // Wait for web fonts to be ready
  if (document.fonts?.ready) {
    await document.fonts.ready.catch(() => undefined);
  }

  // Offscreen light-mode staging container
  const stagingRoot = document.createElement('div');
  stagingRoot.setAttribute('aria-hidden', 'true');
  stagingRoot.style.position = 'fixed';
  stagingRoot.style.left = '-14000px';
  stagingRoot.style.top = '0';
  stagingRoot.style.width = `${A4_WIDTH_PX}px`;
  stagingRoot.style.backgroundColor = '#FFFFFF';
  stagingRoot.style.color = '#111827';
  stagingRoot.style.pointerEvents = 'none';
  stagingRoot.style.zIndex = '-1';
  // Force light mode inside staging root even if app dark mode is active
  stagingRoot.className = 'light';
  document.body.appendChild(stagingRoot);

  try {
    const cloned = sourceElement.cloneNode(true) as HTMLElement;
    cloned.removeAttribute('id');
    cloned.querySelectorAll('.print\\:hidden').forEach((el) => el.remove());

    // Strip Tailwind dark:* classes from the cloned tree so PDF exports always render cleanly on white paper without touching live document theme
    const stripDarkClasses = (node: Element) => {
      const cls = node.getAttribute('class');
      if (cls && cls.includes('dark:')) {
        node.setAttribute(
          'class',
          cls
            .split(/\s+/)
            .filter((token) => !token.startsWith('dark:'))
            .join(' '),
        );
      }
    };
    stripDarkClasses(cloned);
    cloned.querySelectorAll('*').forEach(stripDarkClasses);

    // Strip dark-only shadows/borders and normalize width for measurement
    const measureHost = document.createElement('div');
    measureHost.style.width = `${A4_WIDTH_PX - PAD_SIDE_PX * 2}px`;
    measureHost.style.backgroundColor = '#FFFFFF';
    measureHost.style.color = '#111827';
    measureHost.style.fontFamily = '"Playfair Display", Georgia, serif';
    measureHost.style.fontSize = '13px';
    measureHost.style.lineHeight = '1.55';

    // Collect atomic blocks marked with [data-pdf-block]
    let blocks = Array.from(
      cloned.querySelectorAll<HTMLElement>('[data-pdf-block]'),
    );

    if (blocks.length === 0) {
      // Fallback: wrap direct children of cloned root
      blocks = Array.from(cloned.children) as HTMLElement[];
    }

    // Move blocks into measureHost to accurately measure height at fixed width & convert SVG imgs
    const preparedBlocks: {el: HTMLElement; forceBreakBefore: boolean; height: number}[] = [];

    for (const block of blocks) {
      const forceBreakBefore = block.getAttribute('data-pdf-page-break') === 'true';
      const wrapper = document.createElement('div');
      wrapper.style.marginBottom = '12px';
      wrapper.style.backgroundColor = '#FFFFFF';
      wrapper.style.color = '#111827';
      // Reset outer card styling if cloned directly
      block.style.boxShadow = 'none';
      wrapper.appendChild(block);
      measureHost.appendChild(wrapper);
      preparedBlocks.push({el: wrapper, forceBreakBefore, height: 0});
    }

    stagingRoot.appendChild(measureHost);

    // Pre-rasterize all SVG data URLs inside staging DOM so every diagram renders crisply
    const allImgs = Array.from(measureHost.querySelectorAll('img'));
    await Promise.all(allImgs.map((img) => rasterizeSvgImageElement(img)));

    // Measure heights after images settle
    for (const item of preparedBlocks) {
      item.height = Math.ceil(item.el.getBoundingClientRect().height) + 12;
    }

    // Pack blocks cleanly into A4 page buckets
    const pageBuckets: HTMLElement[][] = [];
    let currentBucket: HTMLElement[] = [];
    let currentHeight = 0;

    for (const item of preparedBlocks) {
      if (item.forceBreakBefore && currentBucket.length > 0) {
        pageBuckets.push(currentBucket);
        currentBucket = [];
        currentHeight = 0;
      }

      if (currentBucket.length > 0 && currentHeight + item.height > MAX_CONTENT_HEIGHT_PX) {
        pageBuckets.push(currentBucket);
        currentBucket = [];
        currentHeight = 0;
      }

      currentBucket.push(item.el);
      currentHeight += item.height;
    }

    if (currentBucket.length > 0) {
      pageBuckets.push(currentBucket);
    }

    // Clear measureHost and render each A4 page sequentially
    stagingRoot.innerHTML = '';

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const totalPages = pageBuckets.length;

    for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
      const pageEl = document.createElement('div');
      pageEl.style.width = `${A4_WIDTH_PX}px`;
      pageEl.style.height = `${A4_HEIGHT_PX}px`;
      pageEl.style.backgroundColor = '#FFFFFF';
      pageEl.style.color = '#111827';
      pageEl.style.padding = `${PAD_TOP_PX}px ${PAD_SIDE_PX}px ${PAD_BOTTOM_PX}px ${PAD_SIDE_PX}px`;
      pageEl.style.boxSizing = 'border-box';
      pageEl.style.position = 'relative';
      pageEl.style.overflow = 'hidden';

      const contentBody = document.createElement('div');
      contentBody.style.width = '100%';
      for (const blockEl of pageBuckets[pageIdx]) {
        contentBody.appendChild(blockEl);
      }
      pageEl.appendChild(contentBody);

      // Clean A4 footer with document label + page counter
      const footer = document.createElement('div');
      footer.style.position = 'absolute';
      footer.style.left = `${PAD_SIDE_PX}px`;
      footer.style.right = `${PAD_SIDE_PX}px`;
      footer.style.bottom = '16px';
      footer.style.paddingTop = '6px';
      footer.style.borderTop = '1px solid #D1D5DB';
      footer.style.display = 'flex';
      footer.style.justifyContent = 'space-between';
      footer.style.alignItems = 'center';
      footer.style.fontFamily = '"DM Sans", system-ui, sans-serif';
      footer.style.fontSize = '10px';
      footer.style.color = '#4B5563';

      const leftSpan = document.createElement('span');
      leftSpan.textContent = options.documentTitle || 'Quadra 12 · CBSE Class 12 PCMB';
      const rightSpan = document.createElement('span');
      rightSpan.textContent = `Page ${pageIdx + 1} of ${totalPages}`;
      footer.appendChild(leftSpan);
      footer.appendChild(rightSpan);
      pageEl.appendChild(footer);

      stagingRoot.appendChild(pageEl);

      // Render single A4 page canvas (safe resolution on both mobile & desktop)
      const canvas = await html2canvas(pageEl, {
        scale: 1.8,
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false,
        width: A4_WIDTH_PX,
        height: A4_HEIGHT_PX,
        windowWidth: A4_WIDTH_PX,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      if (pageIdx > 0) {
        pdf.addPage('a4', 'portrait');
      }
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

      stagingRoot.removeChild(pageEl);
    }

    const pdfBlob = pdf.output('blob');
    const savedResult = await saveBlobToDevice(
      pdfBlob,
      options.filename,
      'application/pdf',
    );

    return {
      pageCount: totalPages,
      filename: options.filename,
      savedTo: savedResult.savedTo,
      usedNativeBridge: savedResult.usedNativeBridge,
    };
  } finally {
    if (stagingRoot.parentNode) {
      stagingRoot.parentNode.removeChild(stagingRoot);
    }
  }
}
