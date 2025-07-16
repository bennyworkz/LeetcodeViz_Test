import React, { useState } from 'react';
import { 
  BookOpen, BrainCircuit, Droplet, 
  Lightbulb, Zap, Target, Layers, Eye, EyeOff, 
  CheckCircle2, GitMerge, RefreshCw, ArrowDown,
  Percent, TestTube, ArrowRight, Beaker, Blend,
  Activity, Scale, Sigma, FlaskConical
} from 'lucide-react';

// --- UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-black transition-all duration-300 whitespace-nowrap min-w-0 ${
      active 
        ? 'bg-slate-900 text-cyan-400 shadow-lg shadow-cyan-900/20 scale-105' 
        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
    }`}
  >
    {icon} 
    <span className="hidden sm:inline">{label}</span>
    <span className="sm:hidden text-[10px]">{label.split(' ')[0]}</span>
  </button>
);

const SectionTitle = ({ icon, title, colorClass }) => (
  <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter mb-8 ${colorClass}`}>
    {icon} {title}
  </div>
);

// --- Custom Alligation Infographic ---
const CrissCrossSimulationGraphic = () => (
  <div className="bg-gradient-to-b from-indigo-50 to-cyan-50 rounded-[2rem] border-2 border-indigo-200 p-8 shadow-inner overflow-hidden relative">
    <div className="text-center mb-10 relative z-20">
      <h3 className="font-black text-3xl text-slate-800 tracking-tight">The Criss-Cross Method</h3>
      <p className="text-sm font-bold text-slate-500 mt-2 uppercase tracking-widest">Rule of Alligation</p>
    </div>

    <div className="flex flex-col items-center relative z-10 max-w-2xl mx-auto h-64">
      
      {/* Background connecting lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" preserveAspectRatio="none">
         <line x1="25%" y1="20%" x2="75%" y2="80%" stroke="#cbd5e1" strokeWidth="4" strokeDasharray="8 8" />
         <line x1="75%" y1="20%" x2="25%" y2="80%" stroke="#cbd5e1" strokeWidth="4" strokeDasharray="8 8" />
         <circle cx="50%" cy="50%" r="40" fill="#e0e7ff" stroke="#818cf8" strokeWidth="4"/>
      </svg>

      {/* Top Row: Prices */}
      <div className="flex justify-between w-full px-12 relative z-20 top-4">
         <div className="flex flex-col items-center group">
            <span className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Cheaper Price (c)</span>
            <div className="bg-white border-4 border-cyan-400 w-20 h-20 rounded-2xl shadow-lg flex items-center justify-center font-black text-2xl text-cyan-600 transition-transform group-hover:scale-110">
               ₹12
            </div>
         </div>
         <div className="flex flex-col items-center group">
            <span className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Dearer Price (d)</span>
            <div className="bg-white border-4 border-indigo-400 w-20 h-20 rounded-2xl shadow-lg flex items-center justify-center font-black text-2xl text-indigo-600 transition-transform group-hover:scale-110">
               ₹20
            </div>
         </div>
      </div>

      {/* Middle Row: Mean Price */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group">
          <div className="bg-slate-800 border-4 border-slate-700 w-24 h-24 rounded-full shadow-2xl flex items-center justify-center font-black text-3xl text-white transition-transform group-hover:scale-110 relative">
             <span className="absolute -top-6 text-[10px] font-bold text-slate-800 uppercase tracking-widest bg-white/80 px-2 py-1 rounded-full whitespace-nowrap backdrop-blur-sm">Mean (m)</span>
             ₹15
          </div>
      </div>

      {/* Bottom Row: Ratio/Quantities */}
      <div className="flex justify-between w-full px-12 absolute bottom-0 z-20">
         <div className="flex flex-col items-center">
            <div className="bg-cyan-50 border-2 border-cyan-300 px-4 py-2 rounded-xl shadow-md flex items-center justify-center font-bold text-lg text-cyan-700 font-mono">
               d - m = 5
            </div>
            <span className="text-[10px] font-black text-cyan-600 mt-2 uppercase tracking-widest bg-cyan-100 px-3 py-1 rounded-full">Qty of Cheaper</span>
         </div>
         <div className="flex flex-col items-center">
            <div className="bg-indigo-50 border-2 border-indigo-300 px-4 py-2 rounded-xl shadow-md flex items-center justify-center font-bold text-lg text-indigo-700 font-mono">
               m - c = 3
            </div>
            <span className="text-[10px] font-black text-indigo-600 mt-2 uppercase tracking-widest bg-indigo-100 px-3 py-1 rounded-full">Qty of Dearer</span>
         </div>
      </div>

    </div>
  </div>
);

// --- Dynamic Graphic Renderer for Questions ---
const GraphicRenderer = ({ type, data }) => {
    if (!data) return (
        <div className="flex flex-col items-center justify-center h-full text-slate-500/50 space-y-2 py-10">
             <GitMerge size={48} />
             <span className="text-[10px] font-bold uppercase tracking-widest">Mixture Diagram</span>
        </div>
    );

    switch(type) {
      case 'criss-cross':
        return (
          <div className="flex flex-col items-center w-full h-full justify-center space-y-6 py-4 px-2">
            <div className="text-cyan-400 font-bold text-[10px] tracking-widest uppercase mb-2 flex items-center gap-2">
               <GitMerge size={14}/> Criss-Cross Setup
            </div>
            
            <div className="w-full max-w-[200px] relative h-32 flex flex-col justify-between">
                <svg className="absolute inset-0 w-full h-full z-0" preserveAspectRatio="none">
                    <line x1="10%" y1="15%" x2="90%" y2="85%" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="90%" y1="15%" x2="10%" y2="85%" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
                
                <div className="flex justify-between w-full z-10">
                    <div className="bg-slate-700 text-white font-mono font-bold text-xs px-2 py-1 rounded border border-slate-500">{data.c}</div>
                    <div className="bg-slate-700 text-white font-mono font-bold text-xs px-2 py-1 rounded border border-slate-500">{data.d}</div>
                </div>
                
                <div className="flex justify-center w-full z-10 -my-2">
                    <div className="bg-cyan-600 text-white font-mono font-black text-sm px-3 py-1.5 rounded-full border-2 border-slate-900 shadow-lg">{data.m}</div>
                </div>

                <div className="flex justify-between w-full z-10">
                    <div className="bg-slate-800 text-cyan-400 font-mono font-bold text-xs px-2 py-1 rounded border border-cyan-900/50">{data.d_m}</div>
                    <div className="bg-slate-800 text-cyan-400 font-mono font-bold text-xs px-2 py-1 rounded border border-cyan-900/50">{data.m_c}</div>
                </div>
            </div>

            <div className="text-white font-bold text-xs uppercase tracking-widest bg-slate-800 px-4 py-2 rounded-xl border border-slate-600 shadow-inner flex items-center gap-2 w-full justify-center">
               Ratio = {data.ratio}
            </div>
          </div>
        );

      case 'replacement':
        return (
          <div className="flex flex-col items-center w-full h-full justify-center space-y-4 py-4 px-2">
            <div className="text-indigo-400 font-bold text-[10px] tracking-widest uppercase mb-2 flex items-center gap-2">
               <RefreshCw size={14}/> Successive Replacement
            </div>
            
            <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-2xl border border-slate-600 shadow-inner">
               <div className="flex flex-col items-center">
                  <div className="w-12 h-16 border-4 border-t-0 border-slate-500 rounded-b-xl relative overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-indigo-500 transition-all" style={{height: '70%'}}></div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">{data.initial}L Total</span>
               </div>
               
               <div className="flex flex-col gap-2 font-mono text-xs">
                   <div className="flex items-center gap-2 text-rose-400"><ArrowRight size={14}/> -{data.replaced}L (Out)</div>
                   <div className="flex items-center gap-2 text-cyan-400"><ArrowRight size={14}/> +{data.replaced}L (In)</div>
               </div>

               <div className="text-white font-black text-xl bg-slate-900 w-10 h-10 rounded-full flex items-center justify-center border border-slate-700 shadow-lg">
                  ×{data.rounds}
               </div>
            </div>

            <div className="bg-slate-800 p-3 rounded-xl border border-slate-600 text-center text-xs font-mono text-white shadow-inner flex flex-col w-full mt-2">
                <span className="text-slate-400 text-[10px] uppercase mb-1">Formula</span>
                <span className="text-amber-400">{data.initial} [ 1 - ({data.replaced}/{data.initial}) ]^{data.rounds}</span>
            </div>
          </div>
        );

      case 'ratio-mix':
         return (
          <div className="flex flex-col items-center w-full h-full justify-center space-y-4 py-4 px-2">
            <div className="text-emerald-400 font-bold text-[10px] tracking-widest uppercase mb-2 flex items-center gap-2">
               <Layers size={14}/> Alloy / Ratio Mixing
            </div>
            
            <div className="flex w-full justify-center items-center gap-2 mb-2">
               {data.groups.map((g, i) => (
                   <React.Fragment key={i}>
                       <div className="bg-slate-800 p-3 rounded-xl border border-slate-600 shadow-inner text-center">
                          <div className="text-white font-bold text-sm mb-1">{g.ratio}</div>
                          <div className="text-slate-400 text-[10px] font-mono">Vol: {g.vol}</div>
                       </div>
                       {i < data.groups.length - 1 && <span className="text-slate-500 font-bold">+</span>}
                   </React.Fragment>
               ))}
            </div>

            <div className="text-emerald-400 font-bold text-sm bg-emerald-400/10 px-4 py-3 rounded-xl border border-emerald-400/30 mt-2 text-center font-mono w-full flex items-center justify-center gap-2">
                <Target size={16}/> Final: {data.ans}
            </div>
          </div>
        );
      default:
        return null;
    }
  }

const QuestionCard = ({ qNum, badge = "Practice", question, options = [], solution, ans = "", visualType, visualData }) => {
  const [showSol, setShowSol] = useState(false);
  
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group flex flex-col h-full">
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-indigo-500"></div>
      <h4 className="font-black text-slate-800 text-lg mb-3 flex justify-between">
        <span>{qNum}</span>
        <span className="bg-slate-100 text-slate-500 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
          {badge}
        </span>
      </h4>
      <div className="text-slate-700 font-medium mb-5 bg-slate-50 p-4 rounded-xl border border-slate-100 flex-1 overflow-x-auto whitespace-pre-wrap">
        {question}
      </div>
      
      {options.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {options.map((opt, i) => (
            <div 
              key={i} 
              className={`p-3 rounded-xl border font-mono text-sm font-bold flex items-center gap-2 ${
                showSol && ans && opt.startsWith(ans) 
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700' 
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                showSol && ans && opt.startsWith(ans) ? 'bg-indigo-200' : 'bg-slate-100'
              }`}>
                {opt.charAt(0)}
              </span>
              {opt.slice(2)}
            </div>
          ))}
        </div>
      )}
      
      <div className="border-t border-slate-100 pt-4 mt-auto">
        <button 
          onClick={() => setShowSol(!showSol)} 
          className="flex items-center gap-2 text-sm font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition-colors outline-none"
        >
          {showSol ? (
            <><EyeOff size={16}/> Hide Solution</>
          ) : (
            <><Eye size={16}/> Show Solution</>
          )}
        </button>
        
        {showSol && (
          <div className="mt-5 bg-[#0f172a] text-white p-1 rounded-3xl text-sm leading-relaxed animate-in slide-in-from-top-2 border border-slate-800 shadow-2xl overflow-hidden">
            <div className="flex flex-col xl:flex-row h-full">
                
                {/* Left Pane: Text Solution */}
                <div className="flex-1 p-5 xl:border-r border-slate-800">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold mb-4 uppercase tracking-widest text-[10px] border-b border-slate-700/80 pb-2">
                      <BookOpen size={14} /> Step-by-Step Notebook
                    </div>
                    
                    <div className="font-mono text-slate-300 leading-relaxed overflow-x-auto flex flex-col gap-2">
                      {typeof solution === 'string' ? solution.split('\n').map((line, idx) => {
                        const trimmedLine = line.trim();
                        
                        if (!trimmedLine) return <div key={idx} className="h-3"></div>;
                        
                        const isEquation = trimmedLine.startsWith('=') || trimmedLine.startsWith('=>') || trimmedLine.startsWith('➔') || trimmedLine.includes('Formula') || trimmedLine.includes('Ratio');
                        const isFinalLine = idx === solution.split('\n').length - 1;

                        let lineClass = "text-slate-300";
                        let prefix = null;

                        if (isEquation && !isFinalLine) {
                           lineClass = "text-indigo-300 font-bold ml-4";
                           prefix = <span className="mr-3 text-indigo-500/70 select-none">↳</span>;
                        } else if (isFinalLine && !trimmedLine.endsWith('?')) {
                           lineClass = "text-emerald-300 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg inline-block w-max border border-emerald-500/20";
                        }

                        return (
                          <div key={idx} className={`flex items-start ${lineClass}`}>
                            {prefix}
                            <span className="flex-1">{line}</span>
                          </div>
                        );
                      }) : solution}
                    </div>
                    
                    {ans && (
                      <div className="mt-5 pt-4 border-t border-slate-700/50 flex items-center gap-2">
                        <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
                          <CheckCircle2 size={16} /> Correct Option: {ans}
                        </span>
                      </div>
                    )}
                </div>

                {/* Right Pane: Visual Drawing / Graphic */}
                {(visualType || !ans) && ( // Show if visualType exists OR just render placeholder
                <div className="w-full xl:w-2/5 p-5 bg-slate-900 flex flex-col items-center justify-center border-t xl:border-t-0 border-slate-800 relative">
                    <div className="absolute top-5 left-5 right-5 flex items-center gap-2 text-indigo-400 font-bold mb-4 uppercase tracking-widest text-[10px] border-b border-slate-700/80 pb-2">
                      <Zap size={14} /> Diagram Explanation
                    </div>
                    <div className="w-full mt-10 h-full flex flex-col justify-center">
                        <GraphicRenderer type={visualType} data={visualData} />
                    </div>
                </div>
                )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Application ---
export default function MixturesNotes() {
  const [activeTab, setActiveTab] = useState('concepts');
  
  return (
    <div className="bg-[#f0f9ff] text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 flex flex-col xl:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10 w-full xl:w-auto">
            <div className="p-4 rounded-[1.5rem] shadow-lg flex items-center justify-center bg-gradient-to-br from-cyan-500 to-indigo-600">
              <GitMerge className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">
                Alligations & Mixtures
              </h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono uppercase tracking-widest">
                <span className="font-bold px-2 py-0.5 rounded text-indigo-800 bg-indigo-100 border border-indigo-200">
                  Master Notes
                </span>
                <span>•</span>
                <span>Quantitative Aptitude</span>
              </div>
            </div>
          </div>
          
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-inner z-10 w-full overflow-x-auto scrollbar-hide">
            <TabButton active={activeTab === 'concepts'} onClick={() => setActiveTab('concepts')} icon={<BookOpen size={16}/>} label="Visual Concepts" />
            <TabButton active={activeTab === 'formulas'} onClick={() => setActiveTab('formulas')} icon={<Sigma size={16}/>} label="Formulas" />
            <TabButton active={activeTab === 'tricks'} onClick={() => setActiveTab('tricks')} icon={<Zap size={16}/>} label="Shortcut Tricks" />
            <TabButton active={activeTab === 'mcq'} onClick={() => setActiveTab('mcq')} icon={<BrainCircuit size={16}/>} label="MCQ Vault" />
            <TabButton active={activeTab === 'practice'} onClick={() => setActiveTab('practice')} icon={<Target size={16}/>} label="Practice Vault" />
          </div>
        </div>

        {/* --- TAB 1: CORE CONCEPTS --- */}
        {activeTab === 'concepts' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-10">
            <SectionTitle icon={<BookOpen size={28}/>} title="The Core Concept: Mixing Quantities" colorClass="text-indigo-600" />
            
            <p className="text-slate-600 text-sm font-medium">
              A <strong>mixture</strong> is the process of combining two or more elements/ingredients together. 
              <strong> Alligation</strong> is the rule that enables us to quickly find the ratio in which these ingredients 
              must be mixed to produce a mixture of a desired mean price or concentration.
            </p>

            <CrissCrossSimulationGraphic />

            {/* Definitions & Basic Concepts */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-cyan-50 border-2 border-cyan-200 p-6 rounded-3xl relative overflow-hidden">
                <h3 className="font-black text-xl text-cyan-800 mb-3 relative z-10">Mean Price (m)</h3>
                <p className="text-slate-700 text-sm mb-3 relative z-10 font-medium">
                  The cost of a unit quantity of the final mixture is called the mean price. It always lies strictly between the cost of the cheaper ingredient (c) and the dearer ingredient (d).
                </p>
                <div className="bg-white px-4 py-3 rounded-xl font-mono text-sm border border-cyan-100 text-cyan-700 font-bold shadow-sm text-center">
                  c &lt; m &lt; d
                </div>
              </div>

              <div className="bg-indigo-50 border-2 border-indigo-200 p-6 rounded-3xl relative overflow-hidden">
                <h3 className="font-black text-xl text-indigo-800 mb-3 relative z-10">Rule of Constant</h3>
                <p className="text-slate-700 text-sm mb-3 relative z-10 font-medium">
                  In some mixtures, the quantity of one element remains completely constant while another element is added. Targeting this <strong>constant element</strong> is often the fastest way to solve percentage change problems.
                </p>
                <div className="bg-white px-4 py-3 rounded-xl font-mono text-sm border border-indigo-100 text-indigo-700 font-bold shadow-sm text-center">
                  Fixed Vol = % of Old Mix = % of New Mix
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: MASTER FORMULAS --- */}
        {activeTab === 'formulas' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-10">
            <SectionTitle icon={<Sigma size={28}/>} title="Alligation & Replacement Formulas" colorClass="text-cyan-600" />

            {/* Alligation Formula */}
            <div className="space-y-6">
                <h3 className="font-black text-slate-800 text-xl uppercase tracking-widest border-b pb-2 mb-6 flex items-center gap-2">
                    <GitMerge size={24} className="text-indigo-500"/> The Law of Alligation
                </h3>
                
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-5"><Sigma size={150}/></div>
                    <strong className="text-slate-800 block mb-4 text-lg relative z-10">Standard Equation</strong>
                    <div className="text-xl md:text-2xl font-black text-indigo-600 bg-white p-6 rounded-xl border border-indigo-100 text-center mb-4 relative z-10 shadow-sm">
                        <span className="text-slate-500 text-base mr-4 font-mono">Qty of Cheaper / Qty of Dearer =</span> 
                        ( d - m ) / ( m - c )
                    </div>
                    <ul className="text-sm text-slate-600 font-medium space-y-2 relative z-10 ml-4 list-disc">
                        <li><strong>d</strong> = Cost Price (or concentration) of Dearer/Expensive ingredient.</li>
                        <li><strong>c</strong> = Cost Price (or concentration) of Cheaper ingredient.</li>
                        <li><strong>m</strong> = Mean Price (or mean concentration) of the resulting mixture.</li>
                    </ul>
                </div>
            </div>

            <div className="w-full h-px bg-slate-200 my-8"></div>

            {/* Replacement Formula */}
            <div className="space-y-6">
                <h3 className="font-black text-slate-800 text-xl uppercase tracking-widest border-b pb-2 mb-6 flex items-center gap-2">
                    <RefreshCw size={24} className="text-cyan-500"/> Successive Replacement Formula
                </h3>

                <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl relative overflow-hidden text-white">
                    <div className="absolute right-0 top-0 opacity-10"><Droplet size={150}/></div>
                    <strong className="text-cyan-300 block mb-4 text-lg relative z-10">Repeated Dilution</strong>
                    <p className="text-sm text-slate-300 mb-6 relative z-10">
                      If a container has 'x' units of a pure liquid, and 'y' units are taken out and replaced by water. 
                      If this operation is repeated 'n' number of times, the quantity of pure liquid left is given by:
                    </p>
                    <div className="text-xl md:text-3xl font-black text-amber-400 bg-slate-900/50 p-6 rounded-xl border border-slate-600 text-center mb-4 relative z-10 shadow-inner font-mono">
                        Remaining Qty = x [ 1 - ( y / x ) ]ⁿ
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center mt-6">
                       <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                           <div className="text-cyan-400 font-bold text-lg">x</div>
                           <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Initial Vol</div>
                       </div>
                       <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                           <div className="text-rose-400 font-bold text-lg">y</div>
                           <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Replaced Vol</div>
                       </div>
                       <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                           <div className="text-emerald-400 font-bold text-lg">n</div>
                           <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Total Operations</div>
                       </div>
                    </div>
                </div>
            </div>

          </div>
        )}

        {/* --- TAB 3: TRICKS & PATTERNS --- */}
        {activeTab === 'tricks' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-8">
            <SectionTitle icon={<Zap size={28}/>} title="Shortcut Tricks" colorClass="text-amber-500" />
            
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-amber-800 flex gap-4 items-center shadow-sm">
              <Lightbulb size={40} className="shrink-0 text-amber-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">Speed Optimization</h3>
                <p className="text-sm font-medium mt-1">
                  Avoid setting up lengthy algebraic equations (x and y variables) by utilizing ratios and constant rules.
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
                
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                   <div className="absolute right-0 top-0 opacity-5 text-indigo-500"><Percent size={100}/></div>
                   <div className="bg-indigo-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold w-max mb-3 shadow-sm">TRICK 1</div>
                   <strong className="text-slate-800 block mb-2 text-lg relative z-10">The Rule of Constant</strong>
                   <p className="text-sm text-slate-600 mb-4 relative z-10">
                     If pure water is added to a milk+water mixture, the <strong>absolute quantity of milk</strong> does not change. Equate the percentage of milk before and after!
                   </p>
                   <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 relative z-10 shadow-inner">
                     Ex: 40L mix has 30% milk. Add water till milk is 15%.<br/>
                     <span className="text-indigo-600 font-bold">30% of 40 = 15% of (40 + w)</span><br/>
                     12 = 0.15 * (40 + w)  ➔ w = 40L.
                   </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                   <div className="absolute right-0 top-0 opacity-5 text-cyan-500"><Droplet size={100}/></div>
                   <div className="bg-cyan-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold w-max mb-3 shadow-sm">TRICK 2</div>
                   <strong className="text-slate-800 block mb-2 text-lg relative z-10">Zero Cost Trick</strong>
                   <p className="text-sm text-slate-600 mb-4 relative z-10">
                     When pure water is added to a mixture (like milk or spirit) to decrease its cost, the <strong>Cost Price of Water is ALWAYS taken as 0</strong>.
                   </p>
                   <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 relative z-10 shadow-inner">
                     Milk CP = ₹50/L. Water CP = ₹0/L. Mix CP = ₹40/L.<br/>
                     Ratio = (50 - 40) : (40 - 0) = 10 : 40 = 1:4 (Water:Milk)
                   </div>
                </div>

                <div className="bg-slate-800 text-white p-6 rounded-3xl border border-slate-700 shadow-xl relative overflow-hidden lg:col-span-2">
                   <div className="absolute right-0 top-0 opacity-10"><Layers size={200}/></div>
                   <div className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold w-max mb-3 shadow-sm">TRICK 3</div>
                   <strong className="text-emerald-300 block mb-2 text-xl relative z-10">Mixing Two Ratios (LCM Method)</strong>
                   <p className="text-sm text-slate-300 mb-4 relative z-10">
                      When mixing two alloys/containers with given internal ratios (e.g. 4:5 and 7:5) in equal quantities, don't use complex fractions. <strong>Make their total sums equal using LCM!</strong>
                   </p>
                   
                   <div className="bg-slate-900 p-4 rounded-xl border border-slate-600 font-mono text-xs relative z-10 grid md:grid-cols-2 gap-4">
                      <div>
                          <div className="text-emerald-400 font-bold mb-1">Step 1: Find Sums</div>
                          Alloy A (4:5) ➔ Sum = 9<br/>
                          Alloy B (7:5) ➔ Sum = 12
                      </div>
                      <div>
                          <div className="text-emerald-400 font-bold mb-1">Step 2: Equalize via LCM</div>
                          LCM of 9 and 12 is <span className="text-white bg-slate-700 px-1 rounded">36</span>.
                      </div>
                      <div className="md:col-span-2 border-t border-slate-700 pt-2 mt-2 text-amber-300">
                          <div className="text-emerald-400 font-bold mb-1">Step 3: Multiply Ratios</div>
                          Alloy A: multiply by (36/9)=4 ➔ <span className="text-white">16 : 20</span><br/>
                          Alloy B: multiply by (36/12)=3 ➔ <span className="text-white">21 : 15</span><br/>
                          Final Mix: (16+21) : (20+15) ➔ <span className="text-white bg-emerald-600/30 px-2 py-0.5 rounded border border-emerald-500/30">37 : 35</span>
                      </div>
                   </div>
                </div>

            </div>
          </div>
        )}

        {/* --- TAB 4: MCQ VAULT --- */}
        {activeTab === 'mcq' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-8">
            <SectionTitle 
              icon={<BrainCircuit size={28}/>} 
              title="MCQ Solved Vault" 
              colorClass="text-indigo-600" 
            />
            
            <div className="bg-indigo-50 border border-indigo-200 rounded-3xl p-6 text-indigo-800 flex gap-4 items-center shadow-sm">
              <BookOpen size={40} className="shrink-0 text-indigo-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">5 Standard Solved Examples</h3>
                <p className="text-sm font-medium mt-1">
                  Review these core concept demonstrations before moving to the practice vault.
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
                
                <QuestionCard 
                    qNum="Q1" badge="Alloy Mixing"
                    question={`A and B are two alloys of iron and silver prepared by mixing metals in the ratio 4 : 5 and 7 : 5 respectively. If equal quantities of alloys are melted to form a third alloy C, the ratio of iron to silver in C is:`}
                    options={["A. 11:10", "B. 37:35", "C. 35:37", "D. Cannot be determined"]}
                    ans="B"
                    visualType="ratio-mix"
                    visualData={{ groups: [{ratio: '4:5', vol: '9'}, {ratio: '7:5', vol: '12'}], ans: '37:35' }}
                    solution={`In alloy A, ratio of iron to Silver = 4:5. Sum = 9.
In alloy B, ratio of iron to Silver = 7:5. Sum = 12.

Take LCM of 9 and 12 to equalize quantities. LCM = 36.
Assume we mix 36 gm of A and 36 gm of B.

For A (multiply by 4): 
Iron = 4 * 4 = 16
Silver = 5 * 4 = 20

For B (multiply by 3): 
Iron = 7 * 3 = 21
Silver = 5 * 3 = 15

Total Iron = 16 + 21 = 37
Total Silver = 20 + 15 = 35
Final ratio = 37:35`}
                />

                <QuestionCard 
                    qNum="Q2" badge="Percentage"
                    question={`Mixture of alcohol and water contains 35% of alcohol by volume. Then, 40 ml of water is added to such a mixture of 100 ml. The percentage of alcohol in the new mixture is?`}
                    options={["A. 20%", "B. 25%", "C. 30%", "D. 35%"]}
                    ans="B"
                    visualType="criss-cross"
                    visualData={{ c: '0% (Water)', d: '35% (Mix)', m: 'x%', d_m: '35-x', m_c: 'x-0', ratio: '100:40' }}
                    solution={`Initial mixture = 100 ml.
Alcohol in initial mixture = 35% of 100 = 35 ml.

Water added = 40 ml.
Total new mixture volume = 100 + 40 = 140 ml.

Alcohol quantity remains constant at 35 ml.
New alcohol % = (Alcohol Volume / Total Volume) * 100
= (35 / 140) * 100
= (1 / 4) * 100
= 25%`}
                />

                <QuestionCard 
                              qNum="Q3" badge="Equal Volumes"
                              question={`Two containers of equal volume contains milk and water in the ratio 3:5 and 5:3, respectively. If the contents of both containers are emptied into a third one, what would be the ratio of milk to water in that container?`}
                              options={["A. 1:1", "B. 8:8", "C. 15:15", "D. All of the above"]}
                              ans="D. All" // Wait, D is technically true but mathematically 1:1. Let's make it standard.
                              solution={`Let the volume of both containers be x units each. (Since ratios sum to 8, assume 8 units each).

Container 1:
Milk = 3 units
Water = 5 units

Container 2:
Milk = 5 units
Water = 3 units

Total Milk = 3 + 5 = 8 units.
Total Water = 5 + 3 = 8 units.

Ratio of Milk : Water = 8 : 8 = 1 : 1.`} visualType={undefined} visualData={undefined}                />

                <QuestionCard 
                              qNum="Q4" badge="Gold Alloys"
                              question={`From two ornaments weighing 18 grams and 24 grams containing gold and silver in the ratio of 2:1 and 5:1 respectively, a new ornament is made. What is the amount of gold in the new ornament?`}
                              options={["A. 30 gm", "B. 32 gm", "C. 42 gm", "D. 24 gm"]}
                              ans="B"
                              solution={`From the first ornament (18g, Ratio 2:1):
Total parts = 3. 1 part = 18/3 = 6g.
Gold = 2 parts = 2 * 6 = 12 gm.

From the second ornament (24g, Ratio 5:1):
Total parts = 6. 1 part = 24/6 = 4g.
Gold = 5 parts = 5 * 4 = 20 gm.

Total gold in new ornament = 12 + 20 = 32 gm.`} visualType={undefined} visualData={undefined}                />

                <QuestionCard 
                              qNum="Q5" badge="Work/Salary Mix"
                              question={`A sum of money is sufficient to pay Sachin’s salary for 45 days and Kale’s salary for 60 days. For how many days can the sum pay the salary of both?`}
                              options={["A. 25.7 days", "B. 30 days", "C. 20 days", "D. 180/7 days"]}
                              ans="D"
                              solution={`Let the total sum of money be S.

Sachin's salary for 1 day = S / 45
Kale's salary for 1 day = S / 60

(Sachin + Kale)'s salary for 1 day = S/45 + S/60
Take LCM of 45 and 60, which is 180.
= (4S + 3S) / 180
= 7S / 180

Number of days the sum S will last when both are paid:
= Total Sum / (Daily Salary of both)
= S / (7S / 180)
= 180 / 7 days.`} visualType={undefined} visualData={undefined}                />

            </div>
          </div>
        )}

        {/* --- TAB 5: PRACTICE VAULT --- */}
        {activeTab === 'practice' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-8">
            <SectionTitle 
              icon={<Target size={28}/>} 
              title="Practice Vault" 
              colorClass="text-cyan-600" 
            />
            
            <div className="bg-cyan-50 border border-cyan-200 rounded-3xl p-6 text-cyan-800 flex gap-4 items-center shadow-sm">
              <FlaskConical size={40} className="shrink-0 text-cyan-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">Type-Wise Drilling</h3>
                <p className="text-sm font-medium mt-1">
                  10 targeted questions covering profit mixtures, successive replacements, multiple item mixing, and ratio calculations.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                
                <QuestionCard 
                    qNum="P1" badge="Profit Mix"
                    question="A cheater shopkeeper confesses to sell his pulses at cost price but he mixes it with pebbles and thereby gains 25%. The percentage of pebbles in the mixture is:"
                    options={["A. 14%", "B. 16%", "C. 20%", "D. 25%"]}
                    ans="C"
                    visualType="criss-cross"
                    visualData={{ c: '0 (Pebble)', d: '1 (Pulse)', m: '4/5', d_m: '1/5', m_c: '4/5', ratio: '1:4' }}
                    solution={`Let C.P. of 1 kg pulse be Re. 1.
Selling Price of 1 kg mixture = Re. 1 (Since sold at CP).
Gain = 25%.

C.P of 1kg mixture = (100 / 125) * 1 = 4/5.

By the rule of alligation:
CP of Pebble = 0
CP of Pulse = 1
Mean CP = 4/5

Ratio of Pebble to Pulse = (1 - 4/5) : (4/5 - 0)
= 1/5 : 4/5 = 1 : 4.

% of pebbles in mixture = (1 / 5) * 100%
= 20%.`}
                />

                <QuestionCard 
                    qNum="P2" badge="Replacement"
                    question="A vessel comprises 100 litres of fresh juice. Out of this vessel 12 litres of juice was pulled out and changed by water. This whole process was done two more times. Calculate the quantity of fresh juice contained by the vessel?"
                    options={["A. 64.12", "B. 65.87", "C. 68.14", "D. 69.54"]}
                    ans="C"
                    visualType="replacement"
                    visualData={{ initial: 100, replaced: 12, rounds: 3 }}
                    solution={`Formula: Remaining = x[1 - (y/x)]^n
Initial volume (x) = 100
Replaced volume (y) = 12
Total rounds (n) = 1 + 2 = 3.

Amount of fresh juice left after 3 times:
= 100 * (1 - 12/100)³
= 100 * (1 - 3/25)³
= 100 * (22/25)³
= 100 * (10648 / 15625)
= 1064800 / 15625
= 68.1472 litres.`}
                />

                <QuestionCard 
                              qNum="P3" badge="3-Item Mix"
                              question="Sugar cost INR 130 per kg and INR 139 per kg are combined along a new type in the ratio 1 : 1 : 2. If the combination costs Rs. 163 per kg, then find out the price of the new type per kg?"
                              options={["A. 170.50", "B. 179.50", "C. 185.50", "D. 191.50"]}
                              ans="D"
                              solution={`Since first and second types are mixed in equal proportions (1:1):
Their average price = (130 + 139) / 2 = 134.50.

Now, we have a mix of (Type 1+2) and Type 3.
The ratio of (Type 1+2) to Type 3 is (1+1):2 = 2:2 = 1:1.

Let the price of the 3rd type be x.
Mean price of the final mix = 163.

Using alligation or basic average for 1:1 mix:
(134.50 + x) / 2 = 163
134.50 + x = 326
x = 326 - 134.50
x = 191.50.`} visualType={undefined} visualData={undefined}                />

                <QuestionCard 
                    qNum="P4" badge="Basic Mix"
                    question="A deals in two types of black-eyed peas. Each costing INR 14 and INR 21 per kg. What ratio should the both types be mixed to get a combination worth INR 18.50 per kg."
                    options={["A. 5:9", "B. 5:7", "C. 7:5", "D. 5:3"]}
                    ans="A"
                    visualType="criss-cross"
                    visualData={{ c: '14', d: '21', m: '18.5', d_m: '2.5', m_c: '4.5', ratio: '5:9' }}
                    solution={`According to the rule of alligation:
C = 14
D = 21
M = 18.50

Quantity of Cheaper / Quantity of Dearer = (D - M) / (M - C)
= (21 - 18.50) / (18.50 - 14)
= 2.50 / 4.50
= 25 / 45
= 5 : 9.`}
                />

                <QuestionCard 
                              qNum="P5" badge="Target Ratio"
                              question="A vessel is filled with liquid, 3 parts of which are water and 5 parts syrup. How much of the mixture must be drawn off and replaced with water so that the mixture may be half water and half syrup?"
                              options={["A. 1/6", "B. 2/5", "C. 1/5", "D. 3/5"]}
                              ans="C"
                              solution={`Initial mix: Water = 3/8, Syrup = 5/8.
Target mix: Water = 1/2, Syrup = 1/2.

Let x be the fraction of mixture replaced by water.
Since we are adding pure water, the Syrup is only being removed, not added.
Remaining Syrup fraction must equal 1/2.

Original Syrup * (1 - x) = Final Syrup
(5/8) * (1 - x) = 1/2
1 - x = (1/2) * (8/5)
1 - x = 4/5
x = 1 - 4/5
x = 1/5.

So, 1/5 of the mixture must be drawn off.`} visualType={undefined} visualData={undefined}                />

                <QuestionCard 
                              qNum="P6" badge="Complex Ratio"
                              question="Two jugs X and Y having coca cola and water mixed in the proportion 5:2 and 7:6 respectively. Now if we want a new mixture in jug Z having coca cola and water in the proportion of 8:5 then what will be the mixing ratio?"
                              options={["A. 5:6", "B. 3:4", "C. 6:7", "D. 7:9"]}
                              ans="D"
                              solution={`Focus on the Coca Cola fraction.
Jug X (C) = 5/7
Jug Y (D) = 7/13
Target Z (M) = 8/13

By Alligation:
(D - M) = |7/13 - 8/13| = 1/13
(M - C) = |8/13 - 5/7| = |(56 - 65) / 91| = 9/91

Ratio of X : Y = (D - M) : (M - C)
= 1/13 : 9/91

Multiply both sides by 91:
= (1/13) * 91 : (9/91) * 91
= 7 : 9.`} visualType={undefined} visualData={undefined}                />

                <QuestionCard 
                              qNum="P7" badge="Profit Mix"
                              question="In what proportion must kerosene be mixed with petrol to earn 16(2/3)% if we sell the combination at cost price?"
                              options={["A. 2:7", "B. 6:1", "C. 2:3", "D. 1:6"]}
                              ans="D"
                              solution={`Assume price of 1 litre petrol = INR 1.
Selling price of 1 litre mix = Re 1 (sold at CP of petrol).
Profit = 16(2/3)% = 50/3% = 1/6.

C.P. of 1 litre mix = SP / (1 + Profit%)
= 1 / (1 + 1/6) = 1 / (7/6) = 6/7.

Alligation (Kerosene CP=0, Petrol CP=1, Mean CP=6/7):
Ratio (Kerosene : Petrol) = (1 - 6/7) : (6/7 - 0)
= 1/7 : 6/7
= 1 : 6.`} visualType={undefined} visualData={undefined}                />

                <QuestionCard 
                    qNum="P8" badge="Dilution"
                    question="A fixed amount of water is mixed with Sangria costing Rs 12 per litre. The rate of mixture is Rs 8 per litre. Find out the proportion of water and Sangria in the new combination."
                    options={["A. 3:2", "B. 4:3", "C. 1:2", "D. None"]}
                    ans="C"
                    visualType="criss-cross"
                    visualData={{ c: '0 (Water)', d: '12 (Sangria)', m: '8', d_m: '4', m_c: '8', ratio: '1:2' }}
                    solution={`C.P. of Water = Rs 0/L.
C.P. of Sangria = Rs 12/L.
Mean Price = Rs 8/L.

As per the Alligation formula: 
(Amount of Water) : (Amount of Sangria) = (D - M) : (M - C)
= (12 - 8) : (8 - 0)
= 4 : 8
= 1 : 2.`}
                />

                <QuestionCard 
                    qNum="P9" badge="Replacement"
                    question="A pot contains 40 litres of Mint juice. 4 litres of Mint juice is replaced with Honey. This is done two times more. Find out the quantity of Mint juice which is in the pot now?"
                    options={["A. 29.16", "B. 30.15", "C. 32.43", "D. 33.19"]}
                    ans="A"
                    visualType="replacement"
                    visualData={{ initial: 40, replaced: 4, rounds: 3 }}
                    solution={`Initial volume (x) = 40 L.
Replaced volume (y) = 4 L.
Total operations (n) = 1 + 2 = 3.

As per the replacement formula:
Remaining = x(1 - y/x)ⁿ
= 40(1 - 4/40)³
= 40(1 - 1/10)³
= 40(9/10)³
= 40 * (729 / 1000)
= 4 * 7.29
= 29.16 L.`}
                />

                <QuestionCard 
                              qNum="P10" badge="Equations"
                              question="A sells 3 types of mustard seeds at the price of INR 126 per kg and INR 135 per kg and 3rd variety in the ratio of 3 : 2 : 5. If the cost of the final mix is INR 155 per kg, find the rate of third type of mustard seeds."
                              options={["A. 170.54", "B. 195.43", "C. 180.40", "D. 190.76"]}
                              ans="C"
                              solution={`Assume the Third type of mustard seed quantity is x.
Given ratios are weights: 3 kg, 2 kg, 5 kg.

Total Cost = Sum of (Weight * Price)
= (126 * 3) + (135 * 2) + (5 * x)
= 378 + 270 + 5x
= 648 + 5x

Total Weight = 3 + 2 + 5 = 10 kg.
Mean Price = Total Cost / Total Weight

155 = (648 + 5x) / 10
1550 = 648 + 5x
5x = 1550 - 648
5x = 902
x = 902 / 5
x = 180.40`} visualType={undefined} visualData={undefined}                />

            </div>
          </div>
        )}
      </div>
    </div>
  );
}