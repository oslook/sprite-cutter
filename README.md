# SpriteCutter - Intelligent Image Slicing Tool

SpriteCutter is a powerful, browser-based tool designed to split sprite sheets, sticker packs, and multi-action images into individual files. With a focus on user experience, it offers real-time previews, smart trimming capabilities, and instant batch downloads.

## 🚀 Features

- **Visual Slicing**: Upload any image and instantly see a grid overlay. Real-time updates as you adjust rows and columns.
- **Smart Trimming**: Automatically crop pixels from the edges of each slice to remove unwanted grid lines or padding.
- **Batch Export**: Download all generated slices as a single, organized ZIP file with one click.
- **Format Control**: Export slices as high-quality PNGs (transparency supported) or optimized JPGs.
- **Privacy First**: All image processing happens locally in your browser. No images are ever uploaded to a server.
- **Responsive Design**: Fully responsive interface built with Tailwind CSS, optimized for both desktop and mobile use.
- **Multilingual Support**: Built-in support for English and Chinese (Simplified) interfaces.

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Core Libraries**:
  - [`jszip`](https://stuk.github.io/jszip/): For generating ZIP archives in the browser.
  - [`file-saver`](https://github.com/eligrey/FileSaver.js/): For triggering file downloads.

## 📦 Getting Started

This project is built as a standard React application.

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/oslook/sprite-cutter.git
   cd sprite-cutter
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 📖 How to Use

1. **Upload Image**: Drag and drop your sprite sheet or image file onto the upload area.
2. **Configure Grid**:
   - Use the **Rows** and **Columns** presets (or type a custom number) to define your grid.
   - The preview will update instantly to show how the image will be divided.
3. **Refine Slices**:
   - If your sprite sheet has grid lines or spacing between items, use the **Trim Settings**.
   - Adjust **Horizontal (X)** and **Vertical (Y)** trim values to crop pixels from the edges of each cell.
   - The red dashed box in the preview shows exactly what will be kept.
4. **Download**:
   - Choose your output format (PNG or JPG).
   - Click **Download All as ZIP** to save your files.

## 📂 Project Structure

```
├── components/          # Reusable UI components
│   ├── Button.tsx       # Standard button component
│   ├── HelpModal.tsx    # Usage instructions modal
│   ├── ImageUploader.tsx# Drag-and-drop file input
│   └── PresetInput.tsx  # Numeric input with quick-select presets
├── utils/
│   └── imageProcessing.ts # Core logic for canvas slicing and zipping
├── App.tsx              # Main application controller
├── constants.ts         # Configuration and Translation strings
├── types.ts             # TypeScript interfaces
├── index.html           # Entry HTML
└── index.tsx            # React root
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
