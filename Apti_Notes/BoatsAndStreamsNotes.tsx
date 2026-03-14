import React, { useState } from 'react';
import { 
  BookOpen, BrainCircuit, Calculator, 
  Lightbulb, Zap, Target, Layers, Eye, EyeOff, 
  CheckCircle2, ArrowRight, ArrowLeft, 
  Ship, Waves, Wind, Compass, Sigma, Clock, MapPin, Anchor
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

const FormulaBox = ({ title, formula, subtext, colorClass, bgClass, borderClass }) => (
  <div className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow bg-white ${borderClass}`}>
    <h4 className={`font-black text-lg mb-3 uppercase tracking-widest ${colorClass}`}>{title}</h4>
    <div className={`px-4 py-3 rounded-xl font-mono text-xl md:text-2xl font-black mb-3 w-full border ${bgClass} ${colorClass} border-current`}>
      {formula}
    </div>
    <p className="text-xs text-slate-500 font-medium leading-relaxed">{subtext}</p>
  </div>
);

// --- Custom Boat & Stream Infographic ---
const BoatSimulationGraphic = () => (
  <div className="bg-gradient-to-b from-sky-50 to-white rounded-[2rem] border-2 border-cyan-200 p-8 shadow-inner overflow-hidden relative">
    <div className="text-center mb-10">
      <h3 className="font-black text-3xl text-slate-800 tracking-tight">Boats and Streams</h3>
      <p className="text-sm font-bold text-slate-500 mt-2 uppercase tracking-widest">Visualizing Relative Speed</p>
    </div>

    <div className="grid md:grid-cols-2 gap-12 relative z-10">
      
      {/* Downstream */}
      <div className="flex flex-col items-center">
        <div className="text-center mb-8">
           <h4 className="font-black text-xl text-emerald-600 mb-2">Downstream</h4>
           <div className="font-mono text-lg font-bold text-slate-700 bg-white px-4 py-2 rounded-xl shadow-sm border border-emerald-100">
              Speed = B <span className="text-emerald-500 font-black">+</span> S
           </div>
        </div>

        <div className="relative w-full h-40 flex flex-col items-center justify-end pb-8">
           {/* Water */}
           <div className="absolute bottom-0 w-full h-16 bg-cyan-400/30 rounded-t-2xl border-t-4 border-cyan-400 flex items-center justify-center overflow-hidden">
              <div className="flex gap-4 opacity-50">
                  <Waves size={24} className="text-cyan-700 animate-pulse"/>
                  <Waves size={24} className="text-cyan-700 animate-pulse delay-75"/>
                  <Waves size={24} className="text-cyan-700 animate-pulse delay-150"/>
              </div>
           </div>
           
           {/* Boat */}
           <div className="relative z-10 flex flex-col items-center transform translate-x-4">
              <Ship size={64} className="text-slate-800" strokeWidth={1.5}/>
              <div className="flex items-center gap-2 mt-2 bg-slate-800 text-white px-3 py-1 rounded-full text-xs font-bold">
                 Boat <ArrowRight size={14} className="text-emerald-400"/>
              </div>
           </div>

           {/* Stream Arrow */}
           <div className="absolute bottom-2 flex items-center gap-2 bg-cyan-100 text-cyan-800 px-4 py-1 rounded-full text-xs font-black shadow-sm z-20">
              Stream <ArrowRight size={14} className="text-cyan-600" strokeWidth={3}/>
           </div>
        </div>
      </div>

      {/* Upstream */}
      <div className="flex flex-col items-center">
        <div className="text-center mb-8">
           <h4 className="font-black text-xl text-rose-600 mb-2">Upstream</h4>
           <div className="font-mono text-lg font-bold text-slate-700 bg-white px-4 py-2 rounded-xl shadow-sm border border-rose-100">
              Speed = B <span className="text-rose-500 font-black">-</span> S
           </div>
        </div>

        <div className="relative w-full h-40 flex flex-col items-center justify-end pb-8">
           {/* Water */}
           <div className="absolute bottom-0 w-full h-16 bg-cyan-400/30 rounded-t-2xl border-t-4 border-cyan-400 flex items-center justify-center overflow-hidden">
              <div className="flex gap-4 opacity-50">
                  <Waves size={24} className="text-cyan-700 animate-pulse"/>
                  <Waves size={24} className="text-cyan-700 animate-pulse delay-75"/>
                  <Waves size={24} className="text-cyan-700 animate-pulse delay-150"/>
              </div>
           </div>
           
           {/* Boat */}
           <div className="relative z-10 flex flex-col items-center transform translate-x-4">
              <Ship size={64} className="text-slate-800" strokeWidth={1.5}/>
              <div className="flex items-center gap-2 mt-2 bg-slate-800 text-white px-3 py-1 rounded-full text-xs font-bold">
                 <ArrowLeft size={14} className="text-rose-400"/> Boat
              </div>
           </div>

           {/* Stream Arrow */}
           <div className="absolute bottom-2 flex items-center gap-2 bg-cyan-100 text-cyan-800 px-4 py-1 rounded-full text-xs font-black shadow-sm z-20">
              Stream <ArrowRight size={14} className="text-cyan-600" strokeWidth={3}/>
           </div>
        </div>
      </div>

    </div>
  </div>
);

// --- Dynamic Graphic Renderer for Questions ---
const GraphicRenderer = ({ type, data }) => {
    if (!data) return (
        <div className="flex flex-col items-center justify-center h-full text-slate-500/50 space-y-2 py-10">
             <Calculator size={48} />
             <span className="text-[10px] font-bold uppercase tracking-widest">Calculation Mode</span>
        </div>
    );

    switch(type) {
      case 'speeds':
        return (
          <div className="flex flex-col items-center w-full h-full justify-center space-y-6 py-4">
            <div className="flex gap-6 w-full px-4">
               <div className="flex-1 bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex flex-col items-center text-center">
                  <span className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-2">Downstream (D)</span>
                  <span className="font-mono text-2xl text-white font-bold">{data.D}</span>
               </div>
               <div className="flex-1 bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl flex flex-col items-center text-center">
                  <span className="text-rose-400 font-black text-xs uppercase tracking-widest mb-2">Upstream (U)</span>
                  <span className="font-mono text-2xl text-white font-bold">{data.U}</span>
               </div>
            </div>
            <div className="w-full h-px bg-slate-700 relative flex justify-center items-center">
               <span className="bg-slate-900 px-3 text-slate-400 text-xs font-mono">B = (D+U)/2 | S = (D-U)/2</span>
            </div>
            <div className="flex gap-6 w-full px-4">
               <div className="flex-1 bg-slate-800 border border-slate-600 p-4 rounded-xl flex flex-col items-center text-center shadow-lg">
                  <Ship size={20} className="text-cyan-400 mb-2"/>
                  <span className="text-cyan-300 font-black text-[10px] uppercase tracking-widest mb-1">Boat Speed</span>
                  <span className="font-mono text-xl text-white font-bold">{data.B}</span>
               </div>
               <div className="flex-1 bg-slate-800 border border-slate-600 p-4 rounded-xl flex flex-col items-center text-center shadow-lg">
                  <Waves size={20} className="text-cyan-400 mb-2"/>
                  <span className="text-cyan-300 font-black text-[10px] uppercase tracking-widest mb-1">Stream Speed</span>
                  <span className="font-mono text-xl text-white font-bold">{data.S}</span>
               </div>
            </div>
          </div>
        );
      case 'ratio':
        return (
          <div className="flex flex-col items-center w-full h-full justify-center space-y-4 py-4">
            <div className="text-cyan-400 font-bold text-[10px] tracking-widest uppercase mb-2 flex items-center gap-2"><Anchor size={14}/> Ratio Logic</div>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-600 text-center text-sm font-mono text-white shadow-inner flex justify-between px-6">
                <span className="text-slate-400">D =</span> <span className="text-emerald-400 font-bold">{data.D}</span>
              </div>
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-600 text-center text-sm font-mono text-white shadow-inner flex justify-between px-6">
                <span className="text-slate-400">U =</span> <span className="text-rose-400 font-bold">{data.U}</span>
              </div>
            </div>
            <div className="text-yellow-400 font-bold text-sm bg-yellow-400/10 px-4 py-2 rounded-xl border border-yellow-400/30 mt-4 text-center font-mono w-full max-w-xs">
                {data.ans}
            </div>
          </div>
        );
      default:
        return (
           <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50 space-y-2 py-10">
               <Calculator size={48} />
               <span className="text-[10px] font-bold uppercase tracking-widest">Calculation Mode</span>
           </div>
        );
    }
  }

const QuestionCard = ({ qNum, badge = "Practice", question, options = [], solution, ans = "", visualType, visualData }) => {
  const [showSol, setShowSol] = useState(false);
  
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group flex flex-col h-full">
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-cyan-500"></div>
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
                  ? 'bg-cyan-50 border-cyan-300 text-cyan-700' 
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                showSol && ans && opt.startsWith(ans) ? 'bg-cyan-200' : 'bg-slate-100'
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
          className="flex items-center gap-2 text-sm font-black text-cyan-600 hover:text-cyan-700 uppercase tracking-widest transition-colors outline-none"
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
                        
                        const isEquation = trimmedLine.startsWith('=') || trimmedLine.startsWith('=>') || trimmedLine.startsWith('➔') || trimmedLine.startsWith('Speed') || trimmedLine.startsWith('Distance');
                        const isFinalLine = idx === solution.split('\n').length - 1;

                        let lineClass = "text-slate-300";
                        let prefix = null;

                        if (isEquation) {
                           lineClass = "text-cyan-300 font-bold ml-4";
                           prefix = <span className="mr-3 text-cyan-500/70 select-none">↳</span>;
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
                <div className="w-full xl:w-2/5 p-5 bg-slate-900 flex flex-col items-center justify-center border-t xl:border-t-0 border-slate-800 relative">
                    <div className="absolute top-5 left-5 right-5 flex items-center gap-2 text-sky-400 font-bold mb-4 uppercase tracking-widest text-[10px] border-b border-slate-700/80 pb-2">
                      <Zap size={14} /> Diagram Explanation
                    </div>
                    <div className="w-full mt-10 h-full flex flex-col justify-center">
                        <GraphicRenderer type={visualType} data={visualData} />
                    </div>
                </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Application ---
export default function BoatsAndStreamsNotes() {
  const [activeTab, setActiveTab] = useState('concepts');
  
  return (
    <div className="bg-[#f0f9ff] text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 flex flex-col xl:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10 w-full xl:w-auto">
            <div className="p-4 rounded-[1.5rem] shadow-lg flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600">
              <Ship className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">
                Boats and Streams
              </h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono uppercase tracking-widest">
                <span className="font-bold px-2 py-0.5 rounded text-cyan-800 bg-cyan-100 border border-cyan-200">
                  Master Notes
                </span>
                <span>•</span>
                <span>Quantitative Aptitude</span>
              </div>
            </div>
          </div>
          
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-inner z-10 w-full overflow-x-auto scrollbar-hide">
            <TabButton active={activeTab === 'concepts'} onClick={() => setActiveTab('concepts')} icon={<BookOpen size={16}/>} label="Visual Concepts" />
            <TabButton active={activeTab === 'formulas'} onClick={() => setActiveTab('formulas')} icon={<Sigma size={16}/>} label="Master Formulas" />
            <TabButton active={activeTab === 'patterns'} onClick={() => setActiveTab('patterns')} icon={<Zap size={16}/>} label="Exam Patterns" />
            <TabButton active={activeTab === 'mcq'} onClick={() => setActiveTab('mcq')} icon={<BrainCircuit size={16}/>} label="MCQ Vault" />
            <TabButton active={activeTab === 'practice'} onClick={() => setActiveTab('practice')} icon={<Target size={16}/>} label="Practice Vault" />
          </div>
        </div>

        {/* --- TAB 1: CORE CONCEPTS --- */}
        {activeTab === 'concepts' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-10">
            <SectionTitle icon={<BookOpen size={28}/>} title="The Core Engine: Water Dynamics" colorClass="text-cyan-600" />
            
            <p className="text-slate-600 text-sm font-medium">
              Boats and streams problems are based on the standard Time, Speed, and Distance concepts. However, we must account for the <strong>movement of the water itself</strong>.
            </p>

            <BoatSimulationGraphic />

            {/* Variable Glossary */}
            <div className="bg-slate-800 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden mt-8">
                <div className="absolute right-0 top-0 opacity-10"><Compass size={200}/></div>
                <h3 className="font-black text-cyan-400 text-xl uppercase tracking-widest mb-6 border-b border-slate-700 pb-2 relative z-10">
                  The Vocabulary of the River
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6 relative z-10 font-mono text-sm">
                    <div className="bg-slate-700/50 p-5 rounded-2xl border border-slate-600 flex items-start gap-4">
                        <div className="bg-cyan-500/20 text-cyan-300 p-2 rounded-lg font-black text-lg">u</div>
                        <div>
                            <strong className="text-white block mb-1">Speed of Boat in Still Water</strong>
                            The natural speed of the boat or swimmer when there is no water current.
                        </div>
                    </div>
                    <div className="bg-slate-700/50 p-5 rounded-2xl border border-slate-600 flex items-start gap-4">
                        <div className="bg-cyan-500/20 text-cyan-300 p-2 rounded-lg font-black text-lg">v</div>
                        <div>
                            <strong className="text-white block mb-1">Speed of Stream / Current</strong>
                            The rate at which the river or water is flowing.
                        </div>
                    </div>
                    <div className="bg-slate-700/50 p-5 rounded-2xl border border-slate-600 flex items-start gap-4">
                        <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg font-black text-lg">D</div>
                        <div>
                            <strong className="text-white block mb-1">Downstream Speed (u + v)</strong>
                            Moving along with the direction of the stream. The water pushes you faster.
                        </div>
                    </div>
                    <div className="bg-slate-700/50 p-5 rounded-2xl border border-slate-600 flex items-start gap-4">
                        <div className="bg-rose-500/20 text-rose-400 p-2 rounded-lg font-black text-lg">U</div>
                        <div>
                            <strong className="text-white block mb-1">Upstream Speed (u - v)</strong>
                            Moving against the direction of the stream. The water slows you down.
                        </div>
                    </div>
                </div>
            </div>

          </div>
        )}

        {/* --- TAB 2: MASTER FORMULAS --- */}
        {activeTab === 'formulas' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-10">
            <SectionTitle icon={<Sigma size={28}/>} title="Shortcut Formulas" colorClass="text-blue-600" />

            {/* Basic Formulas */}
            <div className="grid lg:grid-cols-2 gap-6">
                <FormulaBox 
                    title="Boat Speed (Still Water)" 
                    formula="u = (D + U) / 2" 
                    subtext="If Downstream (D) and Upstream (U) speeds are given."
                    colorClass="text-cyan-600"
                    bgClass="bg-cyan-50"
                    borderClass="border-cyan-200"
                />
                <FormulaBox 
                    title="Stream / Current Speed" 
                    formula="v = (D - U) / 2" 
                    subtext="Half the difference of Downstream and Upstream speeds."
                    colorClass="text-blue-600"
                    bgClass="bg-blue-50"
                    borderClass="border-blue-200"
                />
            </div>

            <div className="w-full h-px bg-slate-200 my-8"></div>

            {/* Additional Advanced Formulas */}
            <div className="space-y-6">
                <h3 className="font-black text-slate-800 text-xl uppercase tracking-widest flex items-center gap-2">
                    <Zap size={24} className="text-amber-500"/> The 4 Pro-Shortcut Formulas
                </h3>
                <p className="text-sm text-slate-600">These formulas bypass complex linear algebra and directly solve standard exam questions in seconds.</p>

                <div className="grid md:grid-cols-2 gap-6 font-mono text-sm">
                    {/* Shortcut 1 */}
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm relative">
                        <div className="bg-amber-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold absolute -top-3 left-6 shadow-sm">SHORTCUT 1</div>
                        <strong className="text-slate-800 block mb-2 mt-2">Average Speed for Round Trip</strong>
                        <p className="text-xs text-slate-500 mb-4 font-sans">A man rows up and down a stream covering the same distance both ways.</p>
                        <div className="text-lg font-black text-blue-600 bg-white p-3 rounded-xl border border-blue-100 text-center">
                            Avg Speed = (u² - v²) / u
                        </div>
                    </div>

                    {/* Shortcut 2 */}
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm relative">
                        <div className="bg-amber-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold absolute -top-3 left-6 shadow-sm">SHORTCUT 2</div>
                        <strong className="text-slate-800 block mb-2 mt-2">Distance from Time Difference</strong>
                        <p className="text-xs text-slate-500 mb-4 font-sans">If he takes <span className="font-bold">t hours more</span> to go upstream than downstream for the same distance.</p>
                        <div className="text-lg font-black text-blue-600 bg-white p-3 rounded-xl border border-blue-100 text-center">
                            Distance = t(u² - v²) / 2v
                        </div>
                    </div>

                    {/* Shortcut 3 */}
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm relative">
                        <div className="bg-amber-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold absolute -top-3 left-6 shadow-sm">SHORTCUT 3</div>
                        <strong className="text-slate-800 block mb-2 mt-2">Speed in Still Water from Time</strong>
                        <p className="text-xs text-slate-500 mb-4 font-sans">Downstream time = t₁, Upstream time = t₂, Stream speed = v.</p>
                        <div className="text-lg font-black text-blue-600 bg-white p-3 rounded-xl border border-blue-100 text-center">
                            u = v(t₂ + t₁) / (t₂ - t₁)
                        </div>
                    </div>

                    {/* Shortcut 4 */}
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm relative">
                        <div className="bg-amber-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold absolute -top-3 left-6 shadow-sm">SHORTCUT 4</div>
                        <strong className="text-slate-800 block mb-2 mt-2">Distance from Total Time</strong>
                        <p className="text-xs text-slate-500 mb-4 font-sans">If it takes him <span className="font-bold">t total hours</span> to row a place and come back.</p>
                        <div className="text-lg font-black text-blue-600 bg-white p-3 rounded-xl border border-blue-100 text-center">
                            Distance = t(u² - v²) / 2u
                        </div>
                    </div>
                </div>
            </div>

          </div>
        )}

        {/* --- TAB 3: EXAM PATTERNS --- */}
        {activeTab === 'patterns' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-8">
            <SectionTitle icon={<Zap size={28}/>} title="Common Exam Archetypes" colorClass="text-cyan-600" />
            
            <div className="bg-cyan-50 border border-cyan-200 rounded-3xl p-6 text-cyan-800 flex gap-4 items-center shadow-sm">
              <BrainCircuit size={40} className="shrink-0 text-cyan-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">Mastering the Core Patterns</h3>
                <p className="text-sm font-medium mt-1">
                  Almost all Boats and Streams questions are variations of these 3 standard patterns. Learn to identify the core variables (u, v, D, U).
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
                
                {/* Pattern 1: Find Speed of Boat/Stream */}
                <QuestionCard 
                    qNum="Pattern 1" badge="Core Averages"
                    question={`A man rows a boat at 12 km/h along the stream and 8 km/h against the stream. Find the speed of the boat in still water.`}
                    options={["A. 12 km/h", "B. 10 km/h", "C. 15 km/h", "D. 8 km/h"]}
                    ans="B"
                    visualType="speeds"
                    visualData={{ D: '12 km/h', U: '8 km/h', B: '(12+8)/2 = 10', S: '(12-8)/2 = 2' }}
                    solution={`Identify given variables:
Downstream speed (D) = 12 km/h
Upstream speed (U) = 8 km/h

Formula for Boat Speed in still water (u):
u = 1/2 * (D + U)
u = 1/2 * (12 + 8)
u = 1/2 * 20
u = 10 km/h`}
                />

                <QuestionCard 
                    qNum="Pattern 1B" badge="Algebraic Setup"
                    question={`A boat whose speed is 15 km/hr in still water goes 30 km downstream and it takes 4 hours 30 minutes to come back. Find the speed of the stream?`}
                    options={["A. 25 km/hr", "B. 15 km/hr", "C. 20 km/hr", "D. 5 km/hr"]}
                    ans="D"
                    visualType="formula-time"
                    visualData={{ g1: '30 / (15+x)', g2: '30 / (15-x)', ans: 'Total Time = 4.5 hrs' }}
                    solution={`Given:
Boat speed (u) = 15 km/hr
Total Time (t) = 4.5 hours (4 hrs 30 mins)
Distance (d) = 30 km (one way)

Let stream speed = x.
Downstream Time = Distance / Downstream Speed = 30 / (15 + x)
Upstream Time = Distance / Upstream Speed = 30 / (15 - x)

Equation:
30/(15 + x) + 30/(15 - x) = 4.5
Divide by 30:
1/(15 + x) + 1/(15 - x) = 4.5 / 30 = 0.15 = 15/100 = 3/20

(15 - x + 15 + x) / (225 - x²) = 3/20
30 / (225 - x²) = 3/20
3(225 - x²) = 600
225 - x² = 200
x² = 25
x = 5 km/hr`}
                />

                {/* Pattern 2: Ratios and Multipliers */}
                <QuestionCard 
                    qNum="Pattern 2" badge="Ratio & Multipliers"
                    question={`A sailor can row 6 km/h in still water. It takes him twice as long to row up as to row down the river. Find the speed of the stream.`}
                    options={["A. 6 km/h", "B. 5 km/h", "C. 3 km/h", "D. 2 km/h"]}
                    ans="D"
                    visualType="ratio"
                    visualData={{ D: '2k (Faster)', U: '1k (Slower)', ans: 'u = 3k/2 ➔ 6 = 3k/2 ➔ k=4. v = 4/2 = 2' }}
                    solution={`Given:
Boat speed (u) = 6 km/h.
Time Upstream = 2 * Time Downstream.

Since Time is inversely proportional to Speed (for same distance):
Downstream Speed (D) = 2 * Upstream Speed (U)
Let U = x, then D = 2x.

Formula for Boat Speed:
u = (D + U) / 2
6 = (2x + x) / 2
12 = 3x
x = 4.

So, Upstream Speed (U) = 4 km/h.
Downstream Speed (D) = 8 km/h.

Stream Speed (v) = (D - U) / 2
= (8 - 4) / 2
= 4 / 2
= 2 km/h.`}
                />

                <QuestionCard 
                    qNum="Pattern 2B" badge="Direct Ratios"
                    question={`Find the ratio of the speed of the boat and the stream if Rakesh takes twice as long to row a distance against the stream as to row in favour of the stream.`}
                    options={["A. 1:2", "B. 3:1", "C. 4:5", "D. 1:1"]}
                    ans="B"
                    visualType="ratio"
                    visualData={{ D: '2x', U: '1x', ans: 'Ratio = (2x+x) / (2x-x) = 3:1' }}
                    solution={`Time Upstream = 2 * Time Downstream
Therefore, Downstream Speed (D) = 2 * Upstream Speed (U).
Let U = x, then D = 2x.

Boat Speed (u) = (D + U) / 2 = (2x + x) / 2 = 3x / 2
Stream Speed (v) = (D - U) / 2 = (2x - x) / 2 = x / 2

Ratio (u : v):
(3x / 2) : (x / 2)
= 3 : 1`}
                />

                {/* Pattern 3: Segment Calculation */}
                <QuestionCard 
                    qNum="Pattern 3" badge="Segments"
                    question={`A man sails a boat to a place 24 km far and comes back in 7 hours. He finds he can sail 3 km downstream in the same time as 2 km upstream. Find the rate of the stream?`}
                    options={["A. 1.43 km/h", "B. 2 km/h", "C. 6 km/h", "D. 5 km/h"]}
                    ans="A"
                    visualType="ratio"
                    visualData={{ D: '3k', U: '2k', ans: '24/3k + 24/2k = 7 ➔ k = 20/7' }}
                    solution={`Condition: 3 km downstream takes same time as 2 km upstream.
Time = Distance / Speed
3 / D = 2 / U
D / U = 3 / 2
Let D = 3k and U = 2k.

Total trip is 24 km each way, taking 7 hours total.
Time downstream + Time upstream = 7
24 / 3k + 24 / 2k = 7
8/k + 12/k = 7
20/k = 7
k = 20/7.

Calculate D and U:
D = 3k = 60/7 ≈ 8.57 km/h
U = 2k = 40/7 ≈ 5.71 km/h

Rate of stream (v) = (D - U) / 2
v = (60/7 - 40/7) / 2
v = (20/7) / 2
v = 10/7 ≈ 1.43 km/h`}
                />

            </div>
          </div>
        )}

        {/* --- TAB 4: MCQ VAULT --- */}
        {activeTab === 'mcq' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-8">
            <SectionTitle 
              icon={<BrainCircuit size={28}/>} 
              title="MCQ Solved Vault" 
              colorClass="text-blue-600" 
            />
            
            <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 text-blue-800 flex gap-4 items-center shadow-sm">
              <Target size={40} className="shrink-0 text-blue-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">Standard Exam MCQs</h3>
                <p className="text-sm font-medium mt-1">
                  These problems cover unit conversions and basic variable extraction. Pay attention to the visual hints!
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                
                <QuestionCard 
                    qNum="Q1" badge="Basic Math"
                    question={`What is the speed of the stream, if the speed of the boat against the stream is 6 km/hr and the speed of a boat in still water is 10km/hr?`}
                    options={["A. 4 km/hr", "B. 2 km/hr", "C. 10 km/hr", "D. 5 km/hr"]}
                    ans="A"
                    visualType="speeds"
                    visualData={{ D: '10 + v', U: '6', B: '10', S: '?' }}
                    solution={`Given:
Upstream Speed (U) = 6 km/hr
Boat Speed (u) = 10 km/hr
Let stream speed = v.

We know:
U = u - v
6 = 10 - v
v = 10 - 6
v = 4 km/hr`}
                />

                <QuestionCard 
                    qNum="Q2" badge="Total Time"
                    question={`A man can row a boat upto 30 km down a river in 3 hours with the stream and can return back in 5 hours. What is the speed of the stream?`}
                    options={["A. 4 km/hr", "B. 2 km/hr", "C. 6 km/hr", "D. 5 km/hr"]}
                    ans="B"
                    visualType="speeds"
                    visualData={{ D: '30/3 = 10', U: '30/5 = 6', B: '(10+6)/2', S: '(10-6)/2' }}
                    solution={`Calculate D and U speeds from Distance and Time:
Downstream Speed (D) = Distance / Time = 30 / 3 = 10 km/hr.
Upstream Speed (U) = Distance / Time = 30 / 5 = 6 km/hr.

Speed of stream (v) = (D - U) / 2
v = (10 - 6) / 2
v = 4 / 2
v = 2 km/hr`}
                />

                <QuestionCard 
                    qNum="Q3" badge="Unit Conversion"
                    question={`Rahul can sail a boat 3 quarters of a kilometer upstream in 11(1/4) minutes and downstream in 7(1/2) minutes. Find out the speed of Rahul in still water?`}
                    options={["A. 9 km/hr", "B. 5 km/hr", "C. 4 km/hr", "D. 3 km/hr"]}
                    ans="B"
                    visualType="speeds"
                    visualData={{ D: '5/3 m/s', U: '10/9 m/s', B: '25/18 m/s', S: '?' }}
                    solution={`Convert to meters and seconds:
Distance = 3/4 km = 750 meters.
Upstream Time = 11.25 mins = 11.25 * 60 = 675 sec.
Downstream Time = 7.5 mins = 7.5 * 60 = 450 sec.

Upstream Speed (U) = 750 / 675 = 10/9 m/s
Downstream Speed (D) = 750 / 450 = 5/3 m/s

Speed in still water (u) = (D + U) / 2
u = (5/3 + 10/9) / 2
u = (15/9 + 10/9) / 2
u = (25/9) / 2 = 25/18 m/s

Convert to km/h:
(25/18) * (18/5) = 5 km/hr`}
                />

                <QuestionCard 
                    qNum="Q4" badge="Basic Math"
                    question={`A man's speed with the current is 20 km/hr and the speed of the current is 5 km/hr. What is the man's speed against the current?`}
                    options={["A. 20 km/hr", "B. 15 km/hr", "C. 5 km/hr", "D. 10 km/hr"]}
                    ans="D"
                    visualType="speeds"
                    visualData={{ D: '20', U: '?', B: '15', S: '5' }}
                    solution={`Given:
Downstream Speed (D) = 20 km/hr
Stream Speed (v) = 5 km/hr

We know D = u + v
20 = u + 5
u = 15 km/hr (Man's speed in still water)

Speed against current (Upstream U) = u - v
U = 15 - 5
U = 10 km/hr`}
                />

                <QuestionCard 
                    qNum="Q5" badge="Basic Math"
                    question={`If a man sails a boat at the rate of 5 km/hr in still water. His upstream rate is 3 km/hr, then find the man's speed along the current?`}
                    options={["A. 7 km/hr", "B. 5 km/hr", "C. 8 km/hr", "D. 10 km/hr"]}
                    ans="A"
                    visualType="speeds"
                    visualData={{ D: '?', U: '3', B: '5', S: '2' }}
                    solution={`Given:
Boat Speed (u) = 5 km/hr
Upstream Speed (U) = 3 km/hr

We know U = u - v
3 = 5 - v
v = 2 km/hr (Stream Speed)

Speed along current (Downstream D) = u + v
D = 5 + 2
D = 7 km/hr`}
                />

                <QuestionCard 
                    qNum="Q6" badge="Unit Mismatch"
                    question={`The speed of a ship in still water is 20 km/hr and the rate of current is 15 km/hr. The distance travelled downstream in 4 minutes is:`}
                    options={["A. 2.333 km", "B. 3.5 km", "C. 1.2 km", "D. 4 km"]}
                    ans="A"
                    visualType="speeds"
                    visualData={{ D: '35 km/h', U: '5 km/h', B: '20', S: '15' }}
                    solution={`Given:
u = 20 km/h, v = 15 km/h

Downstream Speed (D) = u + v
D = 20 + 15 = 35 km/h

Time = 4 minutes. Convert to hours = 4 / 60 hours.

Distance = Speed * Time
Distance = 35 * (4 / 60)
= 140 / 60
= 14 / 6
= 7 / 3 ≈ 2.333 km`}
                />

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
              <BrainCircuit size={40} className="shrink-0 text-cyan-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">Intensive Application</h3>
                <p className="text-sm font-medium mt-1">
                  These 10 practice questions cover every angle, from evaluating ratios to complex quadratic equation setups. Visual insights are provided.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                
                <QuestionCard 
                    qNum="Q1" badge="Basic Math"
                    question="Alex can row a boat at 7 kmph downstream and 3 kmph upstream. Calculate her rowing speed in still water and the rate of the current?"
                    options={["A. 5, 2", "B. 7.5, 3", "C. 6.4, 14", "D. None"]}
                    ans="A"
                    visualType="speeds"
                    visualData={{ D: '7', U: '3', B: '(7+3)/2 = 5', S: '(7-3)/2 = 2' }}
                    solution={`Downstream (D) = 7
Upstream (U) = 3

Speed in still water (u) = (D + U) / 2
= (7 + 3) / 2 = 10 / 2 = 5 kmph.

Rate of current (v) = (D - U) / 2
= (7 - 3) / 2 = 4 / 2 = 2 kmph.`}
                />

                <QuestionCard 
                    qNum="Q2" badge="Ratio Trick"
                    question="Sam's rowing speed is 10 kmph, but he takes double time in rowing the boat upstream in comparison to downstream. Calculate the rate of the stream?"
                    options={["A. 2.18", "B. 3.33", "C. 1.56", "D. 4.36"]}
                    ans="B"
                    visualType="ratio"
                    visualData={{ D: '2a', U: 'a', ans: '(2a+a)/2 = 10 ➔ a=6.66' }}
                    solution={`Time Upstream = 2 * Time Downstream.
So, Downstream Speed = 2 * Upstream Speed.
Let U = a, then D = 2a.

Boat Speed (u) = (D + U) / 2
10 = (2a + a) / 2
20 = 3a
a = 20/3 ≈ 6.66 kmph.

So, U = 6.66, D = 13.33.
Stream Speed (v) = (D - U) / 2
= (13.33 - 6.66) / 2
= 6.66 / 2
= 3.33 kmph.`}
                />

                <QuestionCard 
                    qNum="Q3" badge="Time to Speed"
                    question="What will be the speed of the boat if the river flows at 2 km/hr, and it takes 12 minutes to cover 4 km upstream?"
                    options={["A. 21", "B. 16", "C. 22", "D. 30"]}
                    ans="C"
                    visualType="speeds"
                    visualData={{ D: '?', U: '20', B: '20+2=22', S: '2' }}
                    solution={`River Speed (v) = 2 km/hr.
Upstream Time = 12 mins = 12/60 = 1/5 hour.
Distance = 4 km.

Upstream Speed (U) = Distance / Time
= 4 / (1/5) = 20 km/hr.

We know U = u - v
20 = u - 2
u = 22 km/hr.`}
                />

                <QuestionCard 
                    qNum="Q4" badge="Quadratic Setup"
                    question="Calculate the speed of a motorboat in still water if river flows at 2 kmph, and the boat takes 40 mins to cover 10 km upstream and back again."
                    options={["A. 19", "B. 30.13", "C. 26", "D. None"]}
                    ans="B"
                    visualType="formula-time"
                    visualData={{ g1: '10/(a-2)', g2: '10/(a+2)', ans: 'Total Time = 40/60 = 2/3' }}
                    solution={`Let boat speed = a.
Stream (v) = 2.
D = a + 2, U = a - 2.

Total Time = 40 mins = 40/60 = 2/3 hours.
Distance = 10 km one way.
10/(a + 2) + 10/(a - 2) = 2/3

10(a - 2 + a + 2) / (a² - 4) = 2/3
10(2a) / (a² - 4) = 2/3
20a / (a² - 4) = 2/3
60a = 2(a² - 4)
30a = a² - 4
a² - 30a - 4 = 0

Solve using quadratic formula: a = [30 ± √(900 - 4(-4))] / 2
a = [30 ± √916] / 2
a ≈ (30 + 30.26) / 2 ≈ 30.13 kmph.`}
                />

                <QuestionCard 
                    qNum="Q5" badge="Basic Math"
                    question="Sam rows a boat at 6 kmph in still water. River speed is 2 kmph. In how much time will Sam take to cover 36 km downstream?"
                    options={["A. 7", "B. 4.5", "C. 6.2", "D. 3"]}
                    ans="B"
                    visualType="speeds"
                    visualData={{ D: '6+2 = 8', U: '6-2 = 4', B: '6', S: '2' }}
                    solution={`Boat Speed (u) = 6 kmph.
Stream Speed (v) = 2 kmph.

Downstream Speed (D) = u + v
D = 6 + 2 = 8 kmph.

Time = Distance / Downstream Speed
Time = 36 / 8
= 4.5 hours.`}
                />

                <QuestionCard 
                    qNum="Q6" badge="Fractions"
                    question="Tom takes 2 hours to sail 4 km against the stream and can cover 2 km in 20 minutes along the current. Calculate the time taken to cover 10 km in stagnant water?"
                    options={["A. 2.5", "B. 3.3", "C. 4.7", "D. None"]}
                    ans="A"
                    visualType="speeds"
                    visualData={{ D: '2/(1/3) = 6', U: '4/2 = 2', B: '(6+2)/2 = 4', S: '2' }}
                    solution={`Upstream Speed (U):
Distance = 4 km, Time = 2 hours.
U = 4 / 2 = 2 kmph.

Downstream Speed (D):
Distance = 2 km, Time = 20 mins = 1/3 hour.
D = 2 / (1/3) = 6 kmph.

Speed in still water (u) = (D + U) / 2
u = (6 + 2) / 2 = 4 kmph.

Time for 10 km in still water = 10 / 4 = 2.5 hours.`}
                />

                <QuestionCard 
                    qNum="Q7" badge="Unit Conversions"
                    question="Sam takes 12.5 minutes to cover 900m upstream and 7.5 minutes to row downstream. Calculate Sam's speed in still water in kmph?"
                    options={["A. 5.76", "B. 4.75", "C. 2.65", "D. 3.22"]}
                    ans="A"
                    visualType="speeds"
                    visualData={{ D: '900/450 = 2 m/s', U: '900/750 = 1.2', B: '1.6 m/s', S: '?' }}
                    solution={`Upstream Time = 12.5 mins = 750 seconds.
Upstream Speed (U) = 900 / 750 = 1.2 m/s.

Downstream Time = 7.5 mins = 450 seconds.
Downstream Speed (D) = 900 / 450 = 2.0 m/s.

Boat Speed in still water (u) = (D + U) / 2
u = (2 + 1.2) / 2 = 1.6 m/s.

Convert to kmph:
1.6 * (18 / 5) = 1.6 * 3.6 = 5.76 kmph.`}
                />

                <QuestionCard 
                    qNum="Q8" badge="Total Time"
                    question="The speed of a boat in still water is 4.5 kmph, and the rate of river flow is 3 kmph. Calculate the total time taken to cover a distance of 7.5 km to and fro."
                    options={["A. 6 hrs", "B. 5 hrs", "C. 4 hrs", "D. 5.5 hrs"]}
                    ans="A"
                    visualType="formula-time"
                    visualData={{ g1: '7.5 / 7.5', g2: '7.5 / 1.5', ans: 'Time = 1 + 5 = 6' }}
                    solution={`Downstream Speed (D) = 4.5 + 3 = 7.5 kmph.
Upstream Speed (U) = 4.5 - 3 = 1.5 kmph.

Time Downstream = Distance / D
= 7.5 / 7.5 = 1 hour.

Time Upstream = Distance / U
= 7.5 / 1.5 = 5 hours.

Total Time = 1 + 5 = 6 hours.`}
                />

                <QuestionCard 
                    qNum="Q9" badge="Complex Ratio"
                    question="Sam takes triple the time to row upstream than he takes downstream for the same distance. Ratio between the speed of the boat in still water to the flow?"
                    options={["A. 3:2", "B. 2:1", "C. 3:1", "D. 4:3"]}
                    ans="B"
                    visualType="ratio"
                    visualData={{ D: '3a', U: 'a', ans: 'Ratio = (3a+a)/2 : (3a-a)/2 = 2:1' }}
                    solution={`Time Upstream = 3 * Time Downstream.
Therefore, Downstream Speed (D) = 3 * Upstream Speed (U).
Let U = a, then D = 3a.

Boat Speed (u) = (D + U) / 2 = 4a / 2 = 2a.
Stream Speed (v) = (D - U) / 2 = 2a / 2 = a.

Ratio (u : v) = 2a : a
= 2 : 1`}
                />

                <QuestionCard 
                    qNum="Q10" badge="Basic Math"
                    question="Alex can row in still water at 5 km/h. He rows upstream for 2 hours (covers 10 km). Then, he rows downstream for 1.5 hours (covers 12 km). Speed of the stream?"
                    options={["A. 2/7", "B. 1.5", "C. 1.4", "D. 4"]}
                    ans="B"
                    visualType="speeds"
                    visualData={{ D: '12/1.5 = 8', U: '10/2 = 5', B: '5', S: '(8-5)/2 = 1.5' }}
                    solution={`Upstream Speed (U) = Distance / Time
= 10 / 2 = 5 km/h.

Downstream Speed (D) = Distance / Time
= 12 / 1.5 = 8 km/h.

Speed of Stream (v) = (D - U) / 2
= (8 - 5) / 2
= 3 / 2
= 1.5 km/h.`}
                />

            </div>
          </div>
        )}
      </div>
    </div>
  );
}