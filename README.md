# Favicon Generator

Generate favicon and app icon files in 17 standard sizes from any image, entirely in the browser.

**Live Demo:** https://file-converter-free.com/en/image-tools/favicon-generator

## How It Works

When an image is loaded, the tool renders it onto separate canvases at each of 17 target sizes using `ctx.drawImage`. The sizes are organized into three groups: Browser Favicons (16, 32, 48, 64, 128, 256 px), Android/PWA Icons (192, 512 px), and iOS Touch Icons (57, 60, 72, 76, 114, 120, 144, 152, 180 px). Each canvas produces a PNG Blob via `canvas.toBlob()`. Individual sizes can be downloaded separately, or all outputs can be bundled into a single ZIP file using JSZip.

## Features

- 17 output sizes covering browser favicons, Android/PWA, and iOS touch icons
- Three size groups with labeled previews
- Individual per-size PNG download
- Download all as a ZIP bundle via JSZip

## Browser APIs Used

- Canvas API (2D context, `drawImage`, `toBlob`)
- FileReader API
- JSZip for ZIP bundle
- Blob / URL.createObjectURL

## Code Structure

| File | Description |
|------|-------------|
| `favicon-generator.js` | IIFE — 17 canvas resize targets, three size groups, individual and ZIP download |

## Usage

| Element ID | Purpose |
|------------|---------|
| `dropZone` | Drag-and-drop target for source image |
| `fileInput` | File picker input |
| `previewGrid` | Grid of all 17 sized icon previews |
| `downloadAllBtn` | Download all sizes as a ZIP file |

## License

MIT
