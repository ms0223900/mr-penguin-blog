import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create canvas (for thumbnail)
const canvas = createCanvas(800, 600);
const ctx = canvas.getContext('2d');

// Fill background
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, 800, 600);

// Draw ID card layout example
// Header
ctx.fillStyle = '#3b82f6'; // blue color
ctx.fillRect(0, 0, 800, 80);
ctx.fillStyle = 'white';
ctx.font = 'bold 24px Arial';
ctx.textAlign = 'center';
ctx.fillText('身分證影印產生器', 400, 45);

// Draw upload areas
ctx.fillStyle = '#f3f4f6'; // light gray
ctx.fillRect(50, 100, 320, 150);
ctx.fillRect(430, 100, 320, 150);

// Draw dotted borders
ctx.strokeStyle = '#9ca3af';
ctx.setLineDash([5, 5]);
ctx.lineWidth = 2;
ctx.strokeRect(60, 110, 300, 130);
ctx.strokeRect(440, 110, 300, 130);

// Add text to upload areas
ctx.fillStyle = '#6b7280';
ctx.font = '16px Arial';
ctx.textAlign = 'center';
ctx.fillText('身分證正面', 210, 170);
ctx.fillText('身分證背面', 590, 170);

// Draw preview area
ctx.fillStyle = '#f9fafb';
ctx.fillRect(50, 280, 700, 260);
ctx.setLineDash([]);
ctx.lineWidth = 1;
ctx.strokeStyle = '#d1d5db';
ctx.strokeRect(50, 280, 700, 260);

// Draw ID card examples in preview (simplified)
const cardWidth = 120;
const cardHeight = 80;
const positions = [
    { x: 90, y: 300 }, { x: 230, y: 300 },
    { x: 90, y: 400 }, { x: 230, y: 400 },
    { x: 370, y: 300 }, { x: 510, y: 300 },
    { x: 370, y: 400 }, { x: 510, y: 400 },
];

// Draw ID cards (front in blue, back in green)
positions.forEach((pos, index) => {
    // Alternate between "front" and "back"
    if (index % 2 === 0) {
        ctx.fillStyle = '#eff6ff'; // light blue for front
        ctx.fillRect(pos.x, pos.y, cardWidth, cardHeight);
        ctx.fillStyle = '#1e40af'; // dark blue
        ctx.font = 'bold 14px Arial';
        ctx.fillText('正面', pos.x + cardWidth / 2, pos.y + cardHeight / 2 + 5);
    } else {
        ctx.fillStyle = '#f0fdf4'; // light green for back
        ctx.fillRect(pos.x, pos.y, cardWidth, cardHeight);
        ctx.fillStyle = '#166534'; // dark green
        ctx.font = 'bold 14px Arial';
        ctx.fillText('反面', pos.x + cardWidth / 2, pos.y + cardHeight / 2 + 5);
    }
    // Draw card border
    ctx.strokeStyle = '#9ca3af';
    ctx.strokeRect(pos.x, pos.y, cardWidth, cardHeight);
});

// Draw download button
ctx.fillStyle = '#2563eb'; // blue
ctx.fillRect(350, 560, 100, 30);
ctx.fillStyle = 'white';
ctx.font = '14px Arial';
ctx.fillText('下載', 400, 580);

// Save to file
const outputPath = path.join(__dirname, '../public/assets/side-projects/id-card-printer.png');
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(outputPath, buffer);

console.log(`Thumbnail created at: ${outputPath}`); 