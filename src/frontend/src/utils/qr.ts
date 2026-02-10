export function generateQRCodeDataURL(text: string, size = 256): string {
  // Simple QR code generation using a data URL approach
  // For production, consider using a library like 'qrcode' or 'qr-code-styling'
  // This is a placeholder that creates a canvas-based QR representation
  
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  // Simple grid-based QR-like pattern (placeholder)
  // In production, use a proper QR library
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  
  ctx.fillStyle = '#000000';
  const gridSize = 25;
  const cellSize = size / gridSize;
  
  // Create a simple pattern based on text hash
  const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const shouldFill = ((i * gridSize + j + hash) % 3) === 0;
      if (shouldFill) {
        ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
      }
    }
  }
  
  return canvas.toDataURL('image/png');
}

// Better approach: Use this function with a proper QR library
export function getQRCodeURL(text: string): string {
  // Using a free QR code API service
  const encodedText = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodedText}`;
}
