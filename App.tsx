
import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, X, Grid, Layers, Settings2, Image as ImageIcon, Scissors, HelpCircle } from 'lucide-react';
import { TEXTS } from './constants';
import { Language, SlicedImage, SliceConfig } from './types';
import { sliceImage, downloadAsZip } from './utils/imageProcessing';
import Button from './components/Button';
import ImageUploader from './components/ImageUploader';
import PresetInput from './components/PresetInput';
import HelpModal from './components/HelpModal';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('zh'); // Default to Chinese as per likely preference or keep 'en'
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [config, setConfig] = useState<SliceConfig>({
    rows: 2,
    cols: 2,
    format: 'png',
    trimX: 0,
    trimY: 0
  });
  const [slicedImages, setSlicedImages] = useState<SlicedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  const texts = TEXTS[lang];

  // Debounce slice generation
  useEffect(() => {
    if (!imageSrc) return;

    const generateSlices = async () => {
      setIsProcessing(true);
      try {
        // Add a small delay to prevent freezing UI on rapid inputs
        await new Promise(r => setTimeout(r, 100)); 
        const slices = await sliceImage(imageSrc, config.rows, config.cols, config.format, config.trimX, config.trimY);
        setSlicedImages(slices);
      } catch (error) {
        console.error("Failed to slice image:", error);
      } finally {
        setIsProcessing(false);
      }
    };

    const timer = setTimeout(generateSlices, 300);
    return () => clearTimeout(timer);
  }, [imageSrc, config]);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);
      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    setSlicedImages([]);
  };

  const handleReset = () => {
    setImageFile(null);
    setImageSrc(null);
    setImageSize(null);
    setSlicedImages([]);
    setConfig({ rows: 2, cols: 2, format: 'png', trimX: 0, trimY: 0 });
  };

  const handleDownload = async () => {
    if (slicedImages.length === 0) return;
    await downloadAsZip(slicedImages, imageFile ? `sliced_${imageFile.name}.zip` : 'sprites.zip');
  };

  const sliceWidth = imageSize ? Math.floor(imageSize.width / config.cols) : 0;
  const sliceHeight = imageSize ? Math.floor(imageSize.height / config.rows) : 0;
  
  const actualWidth = Math.max(0, sliceWidth - (config.trimX * 2));
  const actualHeight = Math.max(0, sliceHeight - (config.trimY * 2));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} texts={texts} />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm/50 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-2 rounded-lg shadow-sm">
              <Layers className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 hidden sm:block">
              {texts.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowHelp(true)}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              title={texts.howToUse}
            >
              <HelpCircle size={22} />
            </button>
            <div className="h-6 w-px bg-gray-200 mx-1"></div>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${lang === 'en' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('zh')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${lang === 'zh' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                中
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {!imageSrc ? (
          <div className="max-w-4xl mx-auto mt-8 sm:mt-16 fade-in duration-500">
             <div className="text-center mb-12 space-y-4">
                <div className="inline-flex items-center justify-center p-2 bg-indigo-50 rounded-2xl mb-4">
                  <span className="bg-white text-indigo-600 shadow-sm px-3 py-1 rounded-xl text-sm font-semibold border border-indigo-100">
                    New
                  </span>
                  <span className="text-indigo-900 text-sm font-medium px-3">
                     v1.0 Release
                  </span>
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 sm:text-6xl tracking-tight">
                  {texts.heroTitle}
                </h2>
                <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                  {texts.heroSubtitle}
                </p>
                <div className="flex justify-center pt-4">
                   <button 
                     onClick={() => setShowHelp(true)}
                     className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline underline-offset-4 flex items-center gap-1"
                   >
                     {texts.howToUse} <HelpCircle size={16} />
                   </button>
                </div>
             </div>
             
             <div className="bg-white p-2 rounded-3xl shadow-xl shadow-indigo-100 border border-gray-100">
               <ImageUploader onImageSelected={handleImageSelect} texts={texts} />
             </div>
             
             <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-4">
                <div className="space-y-2">
                   <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto text-blue-600 mb-4">
                      <Grid />
                   </div>
                   <h3 className="font-semibold text-gray-900">Custom Grid</h3>
                   <p className="text-sm text-gray-500">Slice any sprite sheet by defining custom rows and columns.</p>
                </div>
                <div className="space-y-2">
                   <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto text-indigo-600 mb-4">
                      <Scissors />
                   </div>
                   <h3 className="font-semibold text-gray-900">Smart Trimming</h3>
                   <p className="text-sm text-gray-500">Remove unwanted padding or spacing between sprites automatically.</p>
                </div>
                <div className="space-y-2">
                   <div className="bg-green-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto text-green-600 mb-4">
                      <Download />
                   </div>
                   <h3 className="font-semibold text-gray-900">Instant ZIP</h3>
                   <p className="text-sm text-gray-500">Download all your sliced assets in a single, organized ZIP file.</p>
                </div>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full animate-in slide-in-from-bottom-4 duration-500">
            
            {/* Left Column: Image Preview with Grid */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-all hover:shadow-md">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Grid size={18} className="text-indigo-500" />
                    {texts.slicePreview}
                  </h3>
                  <div className="text-xs font-medium text-gray-500 flex gap-4 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                    {imageSize && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        {texts.originalSize}: <span className="font-mono text-gray-700">{imageSize.width} x {imageSize.height}</span>
                      </span>
                    )}
                    <div className="w-px bg-gray-200 h-full"></div>
                    {imageSize && (
                      <span title="Size after trim" className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        {texts.sliceSize}: <span className="font-mono text-indigo-600">{actualWidth} x {actualHeight}</span>
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50 p-8 flex items-center justify-center min-h-[400px] overflow-auto">
                   {/* Main Image Container */}
                  <div className="relative shadow-2xl ring-1 ring-black/5 rounded-sm bg-white/50 backdrop-blur-sm">
                    <img 
                      src={imageSrc} 
                      alt="Original" 
                      className="max-w-full max-h-[60vh] object-contain block"
                    />
                    {/* Grid Overlay */}
                    <div 
                      className="absolute inset-0 pointer-events-none border border-indigo-500/50"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
                        gridTemplateRows: `repeat(${config.rows}, 1fr)`
                      }}
                    >
                      {Array.from({ length: config.rows * config.cols }).map((_, i) => (
                         <div key={i} className="border-r border-b border-indigo-400/60 shadow-[inset_0_0_2px_rgba(99,102,241,0.2)] relative overflow-hidden group">
                           {/* Highlight on hover */}
                           <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-colors"></div>
                           
                           {/* Trim Visualization */}
                           {(config.trimX > 0 || config.trimY > 0) && (
                             <div 
                              className="absolute border border-red-500/60 border-dashed bg-red-500/10 z-10"
                              style={{
                                top: `${(config.trimY / sliceHeight) * 100}%`,
                                bottom: `${(config.trimY / sliceHeight) * 100}%`,
                                left: `${(config.trimX / sliceWidth) * 100}%`,
                                right: `${(config.trimX / sliceWidth) * 100}%`,
                              }}
                             ></div>
                           )}
                         </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

               {/* Generated Slices Preview */}
               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                      <ImageIcon size={18} className="text-indigo-500" />
                      {texts.generated} 
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full ml-2 border border-indigo-100">
                        {slicedImages.length}
                      </span>
                    </h3>
                    
                    {slicedImages.length > 0 && (
                      <div className="text-xs text-gray-400">
                        {config.format.toUpperCase()} • {Math.round(slicedImages[0].blob.size / 1024)} KB avg
                      </div>
                    )}
                  </div>
                  
                  {isProcessing ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <RefreshCw className="animate-spin mb-3 text-indigo-500" size={32} />
                      <p className="font-medium text-gray-500">{texts.processing}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-[300px] overflow-y-auto p-2 custom-scrollbar bg-gray-50/50 rounded-xl border border-gray-100">
                      {slicedImages.map((img) => (
                        <div key={img.id} className="aspect-square bg-white rounded-lg overflow-hidden border border-gray-200 relative group shadow-sm hover:shadow-md transition-all">
                          <img src={img.url} alt={`Slice ${img.id}`} className="w-full h-full object-contain p-1" />
                          <div className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                             <a 
                              href={img.url} 
                              download={img.fileName} 
                              className="text-white bg-white/20 p-2 rounded-full hover:bg-white/40 hover:scale-110 transition-all" 
                              title="Download"
                             >
                                <Download size={16} />
                             </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
               </div>
            </div>

            {/* Right Column: Controls */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                 <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Settings2 size={20} className="text-gray-700" />
                      {texts.settings}
                    </h3>
                    <button onClick={handleReset} className="text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1.5">
                      <X size={14} /> {texts.reset}
                    </button>
                 </div>

                 <div className="space-y-8">
                    {/* Rows / Cols with Presets */}
                    <div className="grid grid-cols-2 gap-5">
                      <PresetInput 
                        label={texts.cols}
                        value={config.cols}
                        onChange={(val) => setConfig({ ...config, cols: val })}
                        presets={[2, 3, 4, 5, 6, 8]}
                      />
                      <PresetInput 
                        label={texts.rows}
                        value={config.rows}
                        onChange={(val) => setConfig({ ...config, rows: val })}
                        presets={[2, 3, 4, 5, 6, 8]}
                      />
                    </div>
                    
                    {/* Trim Settings */}
                    <div className="bg-gray-50/80 p-5 rounded-xl border border-gray-200/60 relative overflow-hidden">
                      {/* Decorative background element */}
                      <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-50 rounded-full blur-xl pointer-events-none"></div>
                      
                      <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Scissors size={16} className="text-indigo-500" />
                        {texts.trimSettings}
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{texts.trimX}</label>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              value={config.trimX}
                              onChange={(e) => setConfig({ ...config, trimX: Math.max(0, parseInt(e.target.value) || 0) })}
                              className="w-full pl-3 pr-8 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm font-medium"
                            />
                            <span className="absolute right-3 top-2 text-xs text-gray-400">px</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{texts.trimY}</label>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              value={config.trimY}
                              onChange={(e) => setConfig({ ...config, trimY: Math.max(0, parseInt(e.target.value) || 0) })}
                              className="w-full pl-3 pr-8 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm font-medium"
                            />
                            <span className="absolute right-3 top-2 text-xs text-gray-400">px</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">{texts.format}</label>
                      <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-xl">
                        <button
                          onClick={() => setConfig({ ...config, format: 'png' })}
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            config.format === 'png'
                              ? 'bg-white text-indigo-600 shadow-sm'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                          }`}
                        >
                          PNG
                        </button>
                        <button
                          onClick={() => setConfig({ ...config, format: 'jpg' })}
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            config.format === 'jpg'
                              ? 'bg-white text-indigo-600 shadow-sm'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                          }`}
                        >
                          JPG
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button 
                        onClick={handleDownload} 
                        fullWidth 
                        disabled={slicedImages.length === 0 || isProcessing}
                        icon={<Download size={20} />}
                        className="h-12 text-lg shadow-indigo-200 hover:shadow-indigo-300"
                      >
                         {texts.downloadAll}
                      </Button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      {!imageSrc && (
          <footer className="py-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} SpriteCutter. All rights reserved.</p>
          </footer>
      )}
    </div>
  );
};

export default App;
