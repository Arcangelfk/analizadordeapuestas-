import React, { useState, useRef, useEffect } from 'react';

interface FileUploadProps {
  onFileSelect: (base64: string, mimeType: string) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Por favor sube una imagen válida.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Extract base64 data and mime type
      // result format: "data:image/png;base64,....."
      const base64Data = result.split(',')[1];
      const mimeType = file.type;
      onFileSelect(base64Data, mimeType);
    };
    reader.readAsDataURL(file);
  };

  // Listen for paste events
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isLoading) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            processFile(file);
            e.preventDefault(); // Prevent default paste behavior
            break; // Stop after first image
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [isLoading]); // Re-bind if isLoading changes

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div 
      className={`relative w-full max-w-xl mx-auto p-8 border-2 border-dashed rounded-xl transition-all duration-300 ${
        dragActive ? 'border-emerald-400 bg-slate-800' : 'border-slate-600 bg-slate-900/50'
      } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        ref={inputRef}
        type="file" 
        className="hidden" 
        multiple={false} 
        accept="image/*"
        onChange={handleChange} 
      />
      
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="p-4 bg-slate-800 rounded-full text-emerald-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
          </svg>
        </div>
        <div>
          <p className="text-lg font-medium text-slate-200">Sube una captura del partido</p>
          <p className="text-sm text-slate-400 mt-1">
            Arrastra, <span className="text-emerald-400 font-semibold">pega (Ctrl+V)</span> o selecciona un archivo
          </p>
        </div>
        <button 
          onClick={onButtonClick}
          disabled={isLoading}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
        >
          {isLoading ? 'Analizando...' : 'Seleccionar Imagen'}
        </button>
      </div>
    </div>
  );
};