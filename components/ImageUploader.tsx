import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Translations } from '../types';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  texts: Translations;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, texts }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      onImageSelected(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative group cursor-pointer flex flex-col items-center justify-center w-full h-80 
        rounded-2xl border-2 border-dashed transition-all duration-300
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-50 scale-[1.01]' 
          : 'border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      
      <div className="flex flex-col items-center gap-4 text-center p-6 transition-transform duration-300 group-hover:-translate-y-1">
        <div className={`
          p-4 rounded-full transition-colors duration-300
          ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'}
        `}>
          {isDragging ? <Upload size={32} /> : <ImageIcon size={32} />}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {texts.uploadTitle}
          </h3>
          <p className="text-sm text-gray-500">
            {texts.uploadDesc}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;