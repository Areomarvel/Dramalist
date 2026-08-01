/**
 * generatePoster.js
 * Creates a canvas-based poster image for dramas/movies that have no poster_path.
 * Returns a data:image/png URL string.
 */

const GRADIENTS = [
  ['#1a1a2e', '#16213e', '#0f3460'],
  ['#2d1b69', '#11998e', '#38ef7d'],
  ['#1e3c72', '#2a5298', '#6dd5fa'],
  ['#0f0c29', '#302b63', '#24243e'],
  ['#141e30', '#243b55', '#c94b4b'],
  ['#1f1c18', '#8b5e3c', '#f7971e'],
  ['#0d0d0d', '#862d86', '#e056fd'],
  ['#002244', '#00468b', '#a8e6cf'],
];

export function generatePoster(title = 'No Title', width = 500, height = 750) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Pick a deterministic gradient based on title
  const idx = title.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % GRADIENTS.length;
  const [c1, c2, c3] = GRADIENTS[idx];

  // Draw gradient background
  const grd = ctx.createLinearGradient(0, 0, width, height);
  grd.addColorStop(0, c1);
  grd.addColorStop(0.5, c2);
  grd.addColorStop(1, c3);
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, width, height);

  // Decorative geometric element
  ctx.globalAlpha = 0.15;
  ctx.beginPath();
  ctx.arc(width * 0.8, height * 0.2, 180, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(width * 0.2, height * 0.8, 120, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.globalAlpha = 1;

  // Dark overlay for text readability
  const overlay = ctx.createLinearGradient(0, height * 0.4, 0, height);
  overlay.addColorStop(0, 'rgba(0,0,0,0)');
  overlay.addColorStop(1, 'rgba(0,0,0,0.85)');
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, width, height);

  // "No Poster" label
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = `500 ${Math.floor(width * 0.045)}px Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('ASIAN DRAMA WIKI', width / 2, height * 0.45);

  // Title text (wrapped)
  ctx.fillStyle = '#ffffff';
  const fontSize = Math.min(Math.floor(width * 0.085), 52);
  ctx.font = `700 ${fontSize}px Inter, sans-serif`;
  ctx.textAlign = 'center';

  const words = title.split(' ');
  const maxWidth = width * 0.8;
  const lineHeight = fontSize * 1.3;
  let lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Limit to 4 lines
  if (lines.length > 4) lines = [...lines.slice(0, 3), lines.slice(3).join(' ').slice(0, 20) + '…'];

  const totalTextHeight = lines.length * lineHeight;
  let startY = height * 0.62 - totalTextHeight / 2;

  lines.forEach(line => {
    ctx.fillText(line, width / 2, startY);
    startY += lineHeight;
  });

  // Decorative line under title
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width * 0.3, startY + 8);
  ctx.lineTo(width * 0.7, startY + 8);
  ctx.stroke();

  return canvas.toDataURL('image/png');
}
