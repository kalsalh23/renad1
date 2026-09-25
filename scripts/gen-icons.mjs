/** توليد أيقونات PWA من SVG الشعار — هوية Sangria البنفسجية */
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'icons')
mkdirSync(outDir, { recursive: true })

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="128" fill="#4A1F52"/>
  <text x="256" y="345" font-family="'Segoe UI', Arial, sans-serif" font-weight="900" font-size="260" fill="#F6EEF7" text-anchor="middle">ر</text>
</svg>`

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'maskable-512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180 },
]

for (const s of sizes) {
  const inner = s.maskable
    ? svg.replace('font-size="260"', 'font-size="208"').replace('y="345"', 'y="322"').replace('rx="128"', 'rx="0"')
    : svg
  await sharp(Buffer.from(inner)).resize(s.size, s.size).png().toFile(path.join(outDir, s.name))
  console.log('✓', s.name)
}
