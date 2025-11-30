import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FileUpload } from './components/FileUpload';
import { AnalysisResult } from './components/AnalysisResult';
import { analyzeMatchImage } from './services/gemini';
import { MatchAnalysis, AnalysisState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    data: null,
    error: null,
  });

  const handleImageUpload = async (base64: string, mimeType: string) => {
    setState({ isLoading: true, data: null, error: null });

    try {
      const result = await analyzeMatchImage(base64, mimeType);
      setState({ isLoading: false, data: result, error: null });
    } catch (error) {
      console.error(error);
      setState({
        isLoading: false,
        data: null,
        error: "No se pudo analizar la imagen. Asegúrate de que es una imagen clara de un partido de fútbol e intenta de nuevo.",
      });
    }
  };

  const handleReset = () => {
    setState({ isLoading: false, data: null, error: null });
  };

  return (
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black text-slate-100 p-4 md:p-8 font-sans">
      
      {/* Navbar */}
      <nav className="max-w-4xl mx-auto flex items-center justify-between mb-12 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
            Fútbol Analytics AI
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto min-h-[600px]">
        
        {state.error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6 flex items-center gap-3 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            {state.error}
          </div>
        )}

        {!state.data ? (
          <div className="flex flex-col items-center justify-center h-full pt-12 md:pt-24 transition-all duration-500">
             <div className="text-center mb-12">
               <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
                 Analiza partidos con <span className="text-emerald-400">IA</span>
               </h1>
             </div>
             
             <FileUpload onFileSelect={handleImageUpload} isLoading={state.isLoading} />
             
             {state.isLoading && (
               <div className="mt-8 flex flex-col items-center space-y-2">
                 <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                 <p className="text-emerald-400 font-medium text-sm animate-pulse">Procesando modelos estadísticos...</p>
               </div>
             )}
          </div>
        ) : (
          <AnalysisResult data={state.data} onReset={handleReset} />
        )}
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);