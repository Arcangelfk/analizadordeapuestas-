import React from 'react';
import { MatchAnalysis } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface AnalysisResultProps {
  data: MatchAnalysis;
  onReset: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, onReset }) => {
  
  const winData = [
    { name: data.teamHome, value: data.winProbability.home },
    { name: 'Empate', value: data.winProbability.draw },
    { name: data.teamAway, value: data.winProbability.away },
  ];

  const COLORS = ['#10b981', '#64748b', '#3b82f6']; // Emerald, Slate, Blue

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-20 animate-fade-in">
      
      {/* Header & Nav */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Reporte del Partido</h2>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Análisis generado por IA
          </p>
        </div>
        
        <button 
          onClick={onReset}
          className="group flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-all duration-300 border border-slate-700 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-900/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <span className="font-medium">Analizar otra imagen</span>
        </button>
      </div>

      {/* Match Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
           <div className="flex-1">
              <h3 className="text-2xl md:text-4xl font-black text-white">{data.teamHome}</h3>
              <span className="text-slate-400 uppercase text-xs tracking-wider font-semibold">Local</span>
           </div>
           
           <div className="px-8 py-4 bg-black/40 rounded-xl border border-white/10 backdrop-blur-sm">
              <div className="text-3xl font-mono font-bold text-emerald-400 tracking-widest">{data.score || "VS"}</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">{data.competition}</div>
           </div>

           <div className="flex-1 md:text-right">
              <h3 className="text-2xl md:text-4xl font-black text-white">{data.teamAway}</h3>
              <span className="text-slate-400 uppercase text-xs tracking-wider font-semibold">Visitante</span>
           </div>
        </div>
      </div>

      {/* MAIN 3 CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CARD 1: RECOMENDADO (Green) */}
        <div className="bg-emerald-500 rounded-2xl p-6 shadow-xl shadow-emerald-900/30 relative overflow-hidden flex flex-col justify-between min-h-[220px] transition-transform hover:-translate-y-1 duration-300">
           <div className="absolute top-0 right-0 p-4 opacity-20">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-24 h-24 rotate-12">
               <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
             </svg>
           </div>
           
           <div>
             <div className="inline-block px-3 py-1 bg-white/20 rounded-md backdrop-blur-md border border-white/30 text-xs font-bold text-white uppercase tracking-wider mb-4">
               Recomendado
             </div>
             <h3 className="text-3xl font-black text-white leading-tight">{data.recommendation.market}</h3>
             <p className="text-emerald-100 font-medium">{data.recommendation.selection}</p>
           </div>

           <div className="mt-6">
             <div className="flex items-end gap-2 mb-3">
               <span className="text-5xl font-bold text-white">{data.recommendation.probability}%</span>
               <span className="text-sm text-emerald-100 mb-2 font-medium">Prob. Estimada</span>
             </div>
             <p className="text-xs text-emerald-900/80 bg-white/20 p-2 rounded-lg backdrop-blur-sm leading-snug font-medium border border-emerald-400/20">
               <span className="font-bold mr-1">Motivo:</span> {data.recommendation.insight}
             </p>
           </div>
        </div>

        {/* CARD 2: MARCADOR PROBABLE */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[220px]">
           <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center mb-4 text-slate-400">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
             </svg>
           </div>
           
           <h4 className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Marcador Probable</h4>
           <div className="text-5xl font-black text-white tracking-widest mb-4">{data.predictedScore}</div>
           
           <div className="px-4 py-1.5 rounded-full bg-slate-700/50 border border-slate-600 text-slate-300 text-sm font-medium">
             Probabilidad: <span className="text-emerald-400">{data.predictedScoreProbability}%</span>
           </div>
        </div>

        {/* CARD 3: AMBOS MARCAN */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[220px]">
           <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center mb-4 text-slate-400">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
             </svg>
           </div>

           <h4 className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Ambos Marcan</h4>
           
           <div className={`text-5xl font-black mb-4 ${data.btts > 50 ? 'text-emerald-400' : 'text-red-400'}`}>
             {data.btts > 50 ? 'SÍ' : 'NO'}
           </div>
           
           <div className="px-4 py-1.5 rounded-full bg-slate-700/50 border border-slate-600 text-slate-300 text-sm font-medium">
             Probabilidad: <span className={data.btts > 50 ? 'text-emerald-400' : 'text-red-400'}>{data.btts > 50 ? data.btts : 100 - data.btts}%</span>
           </div>
        </div>
      </div>

      {/* STRATEGY SECTION: RESERVADA & ARRIESGADA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD: RESERVADA (Blue) */}
        <div className="group bg-slate-800 rounded-xl p-6 border-l-4 border-blue-500 shadow-lg hover:bg-slate-750 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-2 py-1 rounded">Reservada</span>
              <h3 className="text-xl font-bold text-white mt-2">{data.conservativePrediction.market}</h3>
              <p className="text-slate-400 text-sm">{data.conservativePrediction.selection}</p>
            </div>
            <div className="text-right">
              <span className="block text-2xl font-bold text-blue-400">{data.conservativePrediction.probability}%</span>
              <span className="text-[10px] text-slate-500 uppercase">Probabilidad</span>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-700">
             <p className="text-sm text-slate-300 italic">
               <span className="font-semibold text-blue-400 not-italic mr-1">Motivo:</span> 
               {data.conservativePrediction.insight}
             </p>
          </div>
        </div>

        {/* CARD: ARRIESGADA (Purple/Orange) */}
        <div className="group bg-slate-800 rounded-xl p-6 border-l-4 border-purple-500 shadow-lg hover:bg-slate-750 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider bg-purple-500/10 px-2 py-1 rounded">Arriesgada</span>
              <h3 className="text-xl font-bold text-white mt-2">{data.riskyPrediction.market}</h3>
              <p className="text-slate-400 text-sm">{data.riskyPrediction.selection}</p>
            </div>
            <div className="text-right">
              <span className="block text-2xl font-bold text-purple-400">{data.riskyPrediction.probability}%</span>
              <span className="text-[10px] text-slate-500 uppercase">Probabilidad</span>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-700">
             <p className="text-sm text-slate-300 italic">
               <span className="font-semibold text-purple-400 not-italic mr-1">Motivo:</span> 
               {data.riskyPrediction.insight}
             </p>
          </div>
        </div>

      </div>

      {/* Detailed Analysis Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        
        {/* Win Prob Chart */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-slate-200 font-semibold mb-4 border-l-4 border-emerald-500 pl-3">Distribución de Victoria</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={winData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {winData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2 text-sm">
             {winData.map((d, i) => (
               <div key={i} className="flex flex-col items-center">
                 <span className="font-bold text-white text-lg">{d.value}%</span>
                 <span className="text-xs font-medium uppercase tracking-wide" style={{ color: COLORS[i] }}>{d.name}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Tips List */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-slate-200 font-semibold mb-4 border-l-4 border-yellow-500 pl-3">Claves del Partido</h3>
          <ul className="space-y-4">
            {data.statisticalTips.map((tip, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-slate-300">
                <span className="font-mono text-emerald-500/50 font-bold select-none">0{idx + 1}.</span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
};
