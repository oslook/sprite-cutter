
import React from 'react';
import { X, Upload, Grid, Scissors, Download } from 'lucide-react';
import { Translations } from '../types';
import Button from './Button';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  texts: Translations;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, texts }) => {
  if (!isOpen) return null;

  const steps = [
    { icon: <Upload size={20} />, title: texts.step1, color: "bg-blue-100 text-blue-600" },
    { icon: <Grid size={20} />, title: texts.step2, color: "bg-indigo-100 text-indigo-600" },
    { icon: <Scissors size={20} />, title: texts.step3, color: "bg-orange-100 text-orange-600" },
    { icon: <Download size={20} />, title: texts.step4, color: "bg-green-100 text-green-600" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">{texts.howToUse}</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`p-3 rounded-xl shrink-0 ${step.color}`}>
                  {step.icon}
                </div>
                <div className="pt-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Step {index + 1}</span>
                    <p className="text-gray-700 font-medium leading-tight">{step.title}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button fullWidth onClick={onClose}>
              {texts.gotIt}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
