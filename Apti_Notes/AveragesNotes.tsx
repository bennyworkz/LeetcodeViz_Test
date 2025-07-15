import React, { useState } from 'react';
import { 
  BookOpen, BrainCircuit, Calculator, 
  Lightbulb, Zap, Target, Layers, Eye, EyeOff, 
  CheckCircle2, ArrowRight, ArrowLeft, ArrowDown,
  Sigma, Clock, TrendingUp, Users, Scale, Activity,
  LineChart, Plus, MapPin
} from 'lucide-react';

// --- UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-black transition-all duration-300 whitespace-nowrap min-w-0 ${
      active 
        ? 'bg-slate-900 text-fuchsia-400 shadow-lg shadow-fuchsia-900/20 scale-105' 
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

// --- Custom Averages Infographic ---
const BalanceSimulationGraphic = () => (
  <div className="bg-gradient-to-b from-fuchsia-50 to-pink-50 rounded-[2rem] border-2 border-fuchsia-200 p-8 shadow-inner overflow-hidden relative">
    <div className="text-center mb-16 relative z-20">
      <h3 className="font-black text-3xl text-slate-800 tracking-tight">The Balance Scale of Averages</h3>
      <p className="text-sm font-bold text-slate-500 mt-2 uppercase tracking-widest">The Mean acts as the central fulcrum</p>
    </div>

    <div className="flex flex-col items-center relative z-10 max-w-lg mx-auto">
      
      {/* Weights */}
      <div className="flex justify-between w-full px-4 relative z-20 top-[2px]">
         <div className="flex flex-col items-center transform -translate-y-4">
            <div className="bg-white border-4 border-sky-400 w-16 h-16 rounded-xl shadow-lg flex items-center justify-center font-black text-xl text-sky-600">
               10
            </div>
            <span className="text-xs font-bold text-slate-500 mt-2 uppercase">Data 1</span>
         </div>
         <div className="flex flex-col items-center transform -translate-y-12">
            <div className="bg-white border-4 border-amber-400 w-12 h-12 rounded-xl shadow-lg flex items-center justify-center font-black text-lg text-amber-600">
               20
            </div>
            <span className="text-xs font-bold text-slate-500 mt-2 uppercase">Data 2</span>
         </div>
         <div className="flex flex-col items-center transform translate-y-2">
            <div className="bg-white border-4 border-emerald-400 w-20 h-20 rounded-xl shadow-lg flex items-center justify-center font-black text-2xl text-emerald-600">
               30
            </div>
            <span className="text-xs font-bold text-slate-500 mt-2 uppercase">Data 3</span>
         </div>
      </div>

      {/* The Seesaw Plank */}
      <div className="w-full h-4 bg-slate-800 rounded-full relative shadow-lg">
          {/* Central Fulcrum Point */}
          <div className="absolute left-1/2 top-4 -translate-x-1/2 w-0 h-0 border-l-[30px] border-r-[30px] border-b-[40px] border-l-transparent border-r-transparent border-b-fuchsia-500">
             <div className="absolute top-10 -left-16 w-32 text-center mt-2">
                 <span className="bg-fuchsia-600 text-white font-black px-4 py-1.5 rounded-full text-sm shadow-md border-2 border-fuchsia-300">
                    Mean = 20
                 </span>
             </div>
          </div>
      </div>
      
      {/* Ground */}
      <div className="w-full max-w-md h-2 bg-slate-200 rounded-full mt-[40px]"></div>

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
      case 'balance':
        return (
          <div className="flex flex-col items-center w-full h-full justify-center space-y-6 py-4">
            <div className="text-fuchsia-400 font-bold text-[10px] tracking-widest uppercase mb-2 flex items-center gap-2"><Scale size={14}/> Balance Distribution</div>
            
            <div className="flex justify-center gap-4 w-full flex-wrap px-2 items-end border-b-4 border-slate-700 pb-2">
              {data.entities.map((e, i) => (
                  <div key={i} className={`flex flex-col items-center bg-slate-800 p-3 rounded-xl border border-slate-600 min-w-[70px] shadow-lg`}>
                    <div className="text-white font-bold text-sm mb-1">{e.val}</div>
                    <div className="text-slate-400 text-[10px]">{e.label}</div>
                  </div>
              ))}
            </div>

            <div className="text-pink-400 font-bold text-xs uppercase tracking-widest bg-slate-800 px-4 py-3 rounded-xl border border-slate-600 shadow-inner flex items-center gap-2 w-full justify-center mt-2">
              <Zap size={16}/> {data.ans}
            </div>
          </div>
        );
      case 'speed':
        return (
          <div className="flex flex-col items-center w-full h-full justify-center space-y-4 py-4 px-2">
            <div className="text-fuchsia-400 font-bold text-[10px] tracking-widest uppercase mb-2 flex items-center gap-2"><Activity size={14}/> Average Speed</div>
            
            <div className="flex w-full justify-between items-center bg-slate-800 p-4 rounded-2xl border border-slate-600 shadow-inner relative">
               <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-600 -translate-y-1/2 z-0"></div>
               <div className="z-10 bg-sky-500 text-white font-bold px-3 py-1 rounded-lg text-xs">{data.s1}</div>
               <div className="z-10 bg-emerald-500 text-white font-bold px-3 py-1 rounded-lg text-xs">{data.s2}</div>
            </div>

            <div className="bg-slate-800 p-3 rounded-xl border border-slate-600 text-center text-sm font-mono text-white shadow-inner flex flex-col gap-1 w-full mt-4">
                <span className="text-slate-400 text-[10px] uppercase">Formula Used</span>
                <span className="text-amber-400 font-bold">{data.formula}</span>
            </div>

            <div className="text-pink-400 font-bold text-sm bg-pink-400/10 px-4 py-2 rounded-xl border border-pink-400/30 mt-2 text-center font-mono w-full">
                {data.ans}
            </div>
          </div>
        );
      case 'series':
         return (
          <div className="flex flex-col items-center w-full h-full justify-center space-y-4 py-4 px-2">
            <div className="text-fuchsia-400 font-bold text-[10px] tracking-widest uppercase mb-2 flex items-center gap-2"><LineChart size={14}/> Number Series</div>
            
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-600 w-full flex items-center justify-center gap-2 shadow-inner overflow-x-auto">
               {data.numbers.map((n, i) => (
                   <div key={i} className={`font-mono font-bold text-sm px-2 py-1 rounded ${i === Math.floor(data.numbers.length/2) ? 'bg-fuchsia-500 text-white scale-125 mx-2 shadow-lg border border-fuchsia-300' : 'text-slate-400'}`}>
                       {n}
                   </div>
               ))}
            </div>

            <div className="text-yellow-400 font-bold text-sm bg-yellow-400/10 px-4 py-3 rounded-xl border border-yellow-400/30 mt-2 text-center font-mono w-full flex items-center justify-center gap-2">
                <Target size={16}/> {data.ans}
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
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-fuchsia-500"></div>
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
                  ? 'bg-fuchsia-50 border-fuchsia-300 text-fuchsia-700' 
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                showSol && ans && opt.startsWith(ans) ? 'bg-fuchsia-200' : 'bg-slate-100'
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
          className="flex items-center gap-2 text-sm font-black text-fuchsia-600 hover:text-fuchsia-700 uppercase tracking-widest transition-colors outline-none"
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
                    <div className="flex items-center gap-2 text-fuchsia-400 font-bold mb-4 uppercase tracking-widest text-[10px] border-b border-slate-700/80 pb-2">
                      <BookOpen size={14} /> Step-by-Step Notebook
                    </div>
                    
                    <div className="font-mono text-slate-300 leading-relaxed overflow-x-auto flex flex-col gap-2">
                      {typeof solution === 'string' ? solution.split('\n').map((line, idx) => {
                        const trimmedLine = line.trim();
                        
                        if (!trimmedLine) return <div key={idx} className="h-3"></div>;
                        
                        const isEquation = trimmedLine.startsWith('=') || trimmedLine.startsWith('=>') || trimmedLine.startsWith('➔') || trimmedLine.startsWith('Speed') || trimmedLine.startsWith('Total') || trimmedLine.startsWith('Average') || trimmedLine.startsWith('Sum');
                        const isFinalLine = idx === solution.split('\n').length - 1;

                        let lineClass = "text-slate-300";
                        let prefix = null;

                        if (isEquation) {
                           lineClass = "text-pink-300 font-bold ml-4";
                           prefix = <span className="mr-3 text-pink-500/70 select-none">↳</span>;
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
export default function AveragesNotes() {
  const [activeTab, setActiveTab] = useState('concepts');
  
  return (
    <div className="bg-[#fdf4ff] text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 flex flex-col xl:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10 w-full xl:w-auto">
            <div className="p-4 rounded-[1.5rem] shadow-lg flex items-center justify-center bg-gradient-to-br from-fuchsia-500 to-pink-600">
              <Scale className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">
                Averages Mastery
              </h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono uppercase tracking-widest">
                <span className="font-bold px-2 py-0.5 rounded text-fuchsia-800 bg-fuchsia-100 border border-fuchsia-200">
                  Master Notes
                </span>
                <span>•</span>
                <span>Quantitative Aptitude</span>
              </div>
            </div>
          </div>
          
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-inner z-10 w-full overflow-x-auto scrollbar-hide">
            <TabButton active={activeTab === 'concepts'} onClick={() => setActiveTab('concepts')} icon={<BookOpen size={16}/>} label="Visual Concepts" />
            <TabButton active={activeTab === 'formulas'} onClick={() => setActiveTab('formulas')} icon={<Sigma size={16}/>} label="Formulas & Series" />
            <TabButton active={activeTab === 'tricks'} onClick={() => setActiveTab('tricks')} icon={<Zap size={16}/>} label="Shortcut Tricks" />
            <TabButton active={activeTab === 'mcq'} onClick={() => setActiveTab('mcq')} icon={<BrainCircuit size={16}/>} label="MCQ Vault" />
            <TabButton active={activeTab === 'practice'} onClick={() => setActiveTab('practice')} icon={<Target size={16}/>} label="Practice Vault" />
          </div>
        </div>

        {/* --- TAB 1: CORE CONCEPTS --- */}
        {activeTab === 'concepts' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-10">
            <SectionTitle icon={<BookOpen size={28}/>} title="The Core Concept: Balancing Data" colorClass="text-fuchsia-600" />
            
            <p className="text-slate-600 text-sm font-medium">
              An average is a way of summarizing a set of numbers by finding a representative value that is in some sense the "middle" of the data. Think of the average as the fulcrum on a seesaw that perfectly balances all the data points.
            </p>

            <BalanceSimulationGraphic />

            {/* Definitions & Basic Formulas */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-fuchsia-50 border-2 border-fuchsia-200 p-6 rounded-3xl relative overflow-hidden">
                <h3 className="font-black text-xl text-fuchsia-800 mb-3 relative z-10">Mathematical Definition</h3>
                <p className="text-slate-700 text-sm mb-3 relative z-10 font-medium">
                  An average is defined as the sum of n different units divided by n numbers of the units. It is also known as the Mean.
                </p>
                <div className="bg-white px-4 py-3 rounded-xl font-mono text-sm border border-fuchsia-100 text-fuchsia-700 font-bold shadow-sm text-center">
                  Average = Sum of Observations / Total Number of Observations
                </div>
              </div>

              <div className="bg-pink-50 border-2 border-pink-200 p-6 rounded-3xl relative overflow-hidden">
                <h3 className="font-black text-xl text-pink-800 mb-3 relative z-10">Real-World Application</h3>
                <p className="text-slate-700 text-sm mb-3 relative z-10 font-medium">
                  <strong>Example:</strong> A school trip has 160 girls, 40 boys, and 100 teachers. If they want to ride a roller coaster but cannot board at once, what is the average number of people boarding?
                </p>
                <div className="bg-white px-4 py-3 rounded-xl font-mono text-sm border border-pink-100 text-pink-700 font-bold shadow-sm text-center">
                  Avg = (160 + 40 + 100) / 3 = 300 / 3 = 100
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: MASTER FORMULAS --- */}
        {activeTab === 'formulas' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-10">
            <SectionTitle icon={<Sigma size={28}/>} title="Series & Speed Formulas" colorClass="text-pink-600" />

            {/* Speed Averages */}
            <div className="space-y-6">
                <h3 className="font-black text-slate-800 text-xl uppercase tracking-widest border-b pb-2 mb-6 flex items-center gap-2">
                    <Activity size={24} className="text-sky-500"/> Average Speed & Velocity
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6 font-mono text-sm">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <strong className="text-slate-800 block mb-2 text-lg">General Speed</strong>
                        <div className="text-lg font-black text-sky-600 bg-white p-4 rounded-xl border border-sky-100 text-center mb-2">
                            Total Distance / Total Time
                        </div>
                        <p className="text-xs text-slate-500 font-sans">Base formula applicable to all scenarios.</p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <strong className="text-slate-800 block mb-2 text-lg">Same Time (2 Speeds)</strong>
                        <div className="text-lg font-black text-sky-600 bg-white p-4 rounded-xl border border-sky-100 text-center mb-2">
                            (a + b) / 2
                        </div>
                        <p className="text-xs text-slate-500 font-sans">Travels at speed 'a' for half the time, and speed 'b' for other half.</p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <strong className="text-slate-800 block mb-2 text-lg">Same Distance (2 Speeds)</strong>
                        <div className="text-lg font-black text-sky-600 bg-white p-4 rounded-xl border border-sky-100 text-center mb-2">
                            2ab / (a + b)
                        </div>
                        <p className="text-xs text-slate-500 font-sans">Travels at speed 'a' for half distance, and speed 'b' for other half.</p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm md:col-span-1">
                        <strong className="text-slate-800 block mb-2 text-lg">3 Equal Distances</strong>
                        <div className="text-lg font-black text-sky-600 bg-white p-4 rounded-xl border border-sky-100 text-center mb-2">
                            3abc / (ab + bc + ca)
                        </div>
                        <p className="text-xs text-slate-500 font-sans">Travels equal 1/3 distances at speeds a, b, c.</p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm md:col-span-2 flex flex-col justify-center">
                        <strong className="text-slate-800 block mb-2 text-lg">Average Velocity</strong>
                        <div className="text-lg font-black text-emerald-600 bg-white p-4 rounded-xl border border-emerald-100 text-center mb-2">
                            Total Displacement / Total Time
                        </div>
                        <p className="text-xs text-slate-500 font-sans text-center">Velocity is a vector. If you return to start, displacement is 0, so velocity is 0.</p>
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-slate-200 my-8"></div>

            {/* Number Series Formulas */}
            <div className="space-y-6">
                <h3 className="font-black text-slate-800 text-xl uppercase tracking-widest border-b pb-2 mb-6 flex items-center gap-2">
                    <LineChart size={24} className="text-fuchsia-500"/> Formulas Related to Numbers
                </h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-sm font-bold">
                    <div className="bg-white p-4 rounded-xl border border-fuchsia-100 shadow-sm flex flex-col justify-between h-full">
                        <span className="text-slate-600 text-xs mb-2 uppercase">Avg of 1st 'n' Natural Nums</span>
                        <span className="text-xl text-fuchsia-600">(n + 1) / 2</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-fuchsia-100 shadow-sm flex flex-col justify-between h-full">
                        <span className="text-slate-600 text-xs mb-2 uppercase">Avg of 1st 'n' Even Nums</span>
                        <span className="text-xl text-fuchsia-600">(n + 1)</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-fuchsia-100 shadow-sm flex flex-col justify-between h-full">
                        <span className="text-slate-600 text-xs mb-2 uppercase">Avg of 1st 'n' Odd Nums</span>
                        <span className="text-xl text-fuchsia-600">n</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-sm flex flex-col justify-between h-full">
                        <span className="text-slate-600 text-xs mb-2 uppercase">Avg of squares of 1st 'n' Nums</span>
                        <span className="text-xl text-pink-600">(n+1)(2n+1) / 6</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-sm flex flex-col justify-between h-full">
                        <span className="text-slate-600 text-xs mb-2 uppercase">Avg of cubes of 1st 'n' Nums</span>
                        <span className="text-xl text-pink-600">n(n+1)² / 4</span>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm flex flex-col justify-between h-full text-white">
                        <span className="text-amber-400 text-xs mb-2 uppercase">Sum Formulas</span>
                        <span>Sum of 1st 'n' even = n(n+1) <br/> Sum of 1st 'n' odd = n²</span>
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
              <BrainCircuit size={40} className="shrink-0 text-amber-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">Mastering the 5 Core Tricks</h3>
                <p className="text-sm font-medium mt-1">
                  You can avoid unwanted, calculation-intensive equations by applying these logical shortcuts.
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
                
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                   <div className="absolute right-0 top-0 opacity-10"><Plus size={100}/></div>
                   <div className="bg-amber-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold w-max mb-3 shadow-sm">TRICK 1 & 2</div>
                   <strong className="text-slate-800 block mb-2 text-lg relative z-10">Universal Alteration</strong>
                   <p className="text-sm text-slate-600 mb-4 relative z-10">
                     If the value of EACH unit in a class is increased/decreased/multiplied/divided by some value 'x', then the average of the class undergoes the exact same operation with 'x'.
                   </p>
                   <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 relative z-10">
                     Ex: Avg of 10 nums is 23. Each num increased by 4. New Avg = 23 + 4 = 27.
                   </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                   <div className="absolute right-0 top-0 opacity-10"><MapPin size={100}/></div>
                   <div className="bg-amber-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold w-max mb-3 shadow-sm">TRICK 3</div>
                   <strong className="text-slate-800 block mb-2 text-lg relative z-10">The Boundaries</strong>
                   <p className="text-sm text-slate-600 mb-4 relative z-10">
                     The average of any number series or group is ALWAYS strictly between its smallest and largest value.
                   </p>
                   <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 relative z-10">
                     Ex: Avg of [6, 9, 10, 11] must be between 6 and 11.
                   </div>
                </div>

                <div className="bg-slate-800 text-white p-6 rounded-3xl border border-slate-700 shadow-xl relative overflow-hidden lg:col-span-2">
                   <div className="absolute right-0 top-0 opacity-10"><Users size={200}/></div>
                   <div className="bg-fuchsia-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold w-max mb-3 shadow-sm">TRICK 4 & 5</div>
                   <strong className="text-fuchsia-300 block mb-2 text-xl relative z-10">Replacement & Joining Group Logic</strong>
                   
                   <div className="grid md:grid-cols-2 gap-6 mt-4 relative z-10">
                      <div>
                         <div className="font-bold text-white border-b border-slate-600 pb-2 mb-2">When someone Replaces another:</div>
                         <div className="text-sm space-y-2 font-mono">
                             <div>If avg increases: <br/><span className="text-emerald-400">New = Old_Person + (Increase × Total Persons)</span></div>
                             <div>If avg decreases: <br/><span className="text-rose-400">New = Old_Person - (Decrease × Total Persons)</span></div>
                         </div>
                      </div>
                      <div>
                         <div className="font-bold text-white border-b border-slate-600 pb-2 mb-2">When someone Joins the group:</div>
                         <div className="text-sm space-y-2 font-mono">
                             <div>If avg increases: <br/><span className="text-emerald-400">New = Old_Avg + (Increase × New Total Persons)</span></div>
                             <div>If avg decreases: <br/><span className="text-rose-400">New = Old_Avg - (Decrease × New Total Persons)</span></div>
                         </div>
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
              colorClass="text-fuchsia-600" 
            />
            
            <div className="bg-fuchsia-50 border border-fuchsia-200 rounded-3xl p-6 text-fuchsia-800 flex gap-4 items-center shadow-sm">
              <Target size={40} className="shrink-0 text-fuchsia-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">10 Standard Prompt Questions</h3>
                <p className="text-sm font-medium mt-1">
                  These problems cover the standard scenarios provided in the curriculum. Look at the visual diagrams for context!
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                
                <QuestionCard 
                    qNum="Q1" badge="Run Rate"
                    question={`The run rate in cricket for the first 10 overs was 3.2. Calculate the run rate in the rest of the 40 overs to score 282 runs.`}
                    options={["A. 3.5", "B. 4.0", "C. 6.25", "D. Cannot be determined"]}
                    ans="C"
                    visualType="balance"
                    visualData={{ entities: [{val: 32, label: 'First 10'}, {val: '?', label: 'Next 40'}], ans: 'Total = 282' }}
                    solution={`Runs scored in 10 overs = 10 × 3.2 = 32 runs.
Total runs required = 282.

Runs needed in next 40 overs = 282 - 32 = 250.
Required run rate = Runs / Overs
= 250 / 40
= 6.25`}
                />

                <QuestionCard 
                    qNum="Q2" badge="Weighted Avg"
                    question={`In a family: two grandparents (avg 67 yrs), two parents (avg 35 yrs), three grandchildren (avg 6 yrs). Calculate the average age of the family.`}
                    options={["A. 25", "B. 40", "C. 31.71", "D. Cannot be determined"]}
                    ans="C"
                    visualType="balance"
                    visualData={{ entities: [{val: '2×67', label: 'GP'}, {val: '2×35', label: 'P'}, {val: '3×6', label: 'GC'}], ans: 'Divide by 7' }}
                    solution={`Total sum of ages:
Grandparents = 2 × 67 = 134
Parents = 2 × 35 = 70
Children = 3 × 6 = 18

Total Sum = 134 + 70 + 18 = 222.
Total People = 2 + 2 + 3 = 7.

Family Average = 222 / 7
= 31.71 years.`}
                />

                <QuestionCard 
                              qNum="Q3" badge="Missing Value"
                              question={`A shopkeeper has sales of Rs. 6359, 2365, 5698, 5690, and 4560 for 5 successive months. Calculate his sale in the sixth month to make an average sale of Rs. 6400.`}
                              options={["A. 12348", "B. 13728", "C. 23614", "D. Cannot be determined"]}
                              ans="B"
                              solution={`Required Total Sale for 6 months:
= 6400 × 6 = 38400

Sum of sales for 5 months:
= 6359 + 2365 + 5698 + 5690 + 4560
= 24672

Required 6th month sale = 38400 - 24672
= 13728`} visualType={undefined} visualData={undefined}                />

                <QuestionCard 
                              qNum="Q4" badge="Logic Check"
                              question={`If zero is the average of 20 numbers, then how many of them, at most, must be greater than zero?`}
                              options={["A. 19", "B. 5", "C. 10", "D. Cannot be determined"]}
                              ans="A"
                              solution={`Average = 0 means Sum = 0.

To maximize the number of positive numbers, we can have 19 positive numbers. 
Their sum will be some positive number 'a'.
The 20th number can simply be '-a' to make the total sum 0.

Therefore, at most 19 numbers can be greater than zero.`} visualType={undefined} visualData={undefined}                />

                <QuestionCard 
                    qNum="Q5" badge="Replacement"
                    question={`When a new man joins a group of 8 people, replacing a man weighing 55 kg, their average weight increases by 2.5 kg. How much does he weigh?`}
                    options={["A. 80", "B. 75", "C. 65", "D. Cannot be determined"]}
                    ans="B"
                    visualType="balance"
                    visualData={{ entities: [{val: 'Old = 55', label: 'Leaving'}], ans: 'New = 55 + (8 × 2.5) = 75' }}
                    solution={`Use Shortcut Rule 4:
Since average increases, the new person is heavier.
New Weight = Old Weight + (Increase × Total Members)
= 55 + (2.5 × 8)
= 55 + 20
= 75 kg.`}
                />

                <QuestionCard 
                              qNum="Q6" badge="Group Avg"
                              question={`11 players make a football team. Captain's age is 25. Goalkeeper is 4 years older. The average age of the remaining 9 members is one year less than the entire team's average. What is the average age of the team?`}
                              options={["A. 31.5", "B. 32", "C. 26", "D. Cannot be determined"]}
                              ans="A"
                              solution={`Let team average = x.
Sum of 11 players = 11x.

Captain = 25.
GK = 25 + 4 = 29.
Sum of remaining 9 = 9 × (x - 1) = 9x - 9.

Equation:
11x = 25 + 29 + (9x - 9)
11x = 54 - 9 + 9x
11x - 9x = 45
2x = 63
x = 63 / 2
x = 31.5 years.`} visualType={undefined} visualData={undefined}                />

                <QuestionCard 
                              qNum="Q7" badge="Equations"
                              question={`The average monthly income of A and B is Rs. 5050, B and C is Rs. 6250, and A and C is Rs. 5200. Calculate the monthly income of A.`}
                              options={["A. 3000", "B. 5000", "C. 4000", "D. Cannot be determined"]}
                              ans="C"
                              solution={`Avg(A, B) = 5050 ➔ A + B = 10100  ---(1)
Avg(B, C) = 6250 ➔ B + C = 12500  ---(2)
Avg(A, C) = 5200 ➔ A + C = 10400  ---(3)

Add all equations:
2(A + B + C) = 10100 + 12500 + 10400
2(A + B + C) = 33000
A + B + C = 16500

To find A, subtract (B+C) from total:
A = (A + B + C) - (B + C)
A = 16500 - 12500
A = 4000.`} visualType={undefined} visualData={undefined}                />

                <QuestionCard 
                              qNum="Q8" badge="Age Past/Present"
                              question={`The average age of Alice, Bob, and Mike three years ago was 35 years. 5 years back the average age of Bob and Mike was 20 years. Determine Alice's present age.`}
                              options={["A. 64", "B. 20", "C. 35", "D. Cannot be determined"]}
                              ans="A"
                              solution={`Three years ago, sum of A+B+M = 35 * 3 = 105.
Present sum of A+B+M = 105 + (3 * 3) = 114.

5 years ago, sum of B+M = 20 * 2 = 40.
Present sum of B+M = 40 + (5 * 2) = 50.

Alice's present age = (A+B+M) - (B+M)
= 114 - 50
= 64 years.`} visualType={undefined} visualData={undefined}                />

                <QuestionCard 
                              qNum="Q9" badge="Purchasing"
                              question={`Ravi buys petrol at Rs. 7.50, Rs. 8, and Rs. 8.50 for 3 months. Calculate the approximate average cost per liter if he spends Rs. 4000 each month.`}
                              options={["A. 8.0", "B. 7.98", "C. 10", "D. Cannot be determined"]}
                              ans="B"
                              solution={`Total money spent = 4000 * 3 = 12000.

Total liters bought:
= (4000 / 7.5) + (4000 / 8) + (4000 / 8.5)
= 4000 * (2/15 + 1/8 + 2/17)
= 4000 * (136 + 127.5 + 120) / 1020 ... (Using common denoms)
From text: = 4000 * (767 / 5100) = 76700 / 51 liters.

Average cost = Total Cost / Total Liters
= 12000 / (76700 / 51)
= (12000 * 51) / 76700
= 6120 / 767
≈ 7.98`} visualType={undefined} visualData={undefined}                />

                <QuestionCard 
                              qNum="Q10" badge="Logic Check"
                              question={`Ajay thinks his weight is 65 < x < 72. Sister says 60 < x < 70. Father says x <= 68. If all are correct, what is the average possible integer weight of Ajay?`}
                              options={["A. 59", "B. 80", "C. 67", "D. Cannot be determined"]}
                              ans="C"
                              solution={`Find the intersection of all conditions:
Ajay: 66, 67, 68, 69, 70, 71
Sister: 61, 62, 63, 64, 65, 66, 67, 68, 69
Father: <= 68

Common values matching ALL conditions:
66, 67, 68

Average of these values:
(66 + 67 + 68) / 3
= 201 / 3
= 67 kg.`} visualType={undefined} visualData={undefined}                />

            </div>
          </div>
        )}

        {/* --- TAB 5: PRACTICE VAULT --- */}
        {activeTab === 'practice' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-8">
            <SectionTitle 
              icon={<Target size={28}/>} 
              title="Practice Vault" 
              colorClass="text-pink-600" 
            />
            
            <div className="bg-pink-50 border border-pink-200 rounded-3xl p-6 text-pink-800 flex gap-4 items-center shadow-sm">
              <BrainCircuit size={40} className="shrink-0 text-pink-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">Type-Wise Drilling</h3>
                <p className="text-sm font-medium mt-1">
                  15 targeted questions covering consecutive numbers, batting averages, speed averages, and group alterations.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                
                {/* Consecutive Nums */}
                <QuestionCard 
                    qNum="P1" badge="Consecutive"
                    question="The average of 7 consecutive numbers is 20. What is the largest of these numbers?"
                    visualType="series"
                    visualData={{ numbers: ['17', '18', '19', '20', '21', '22', '23'], ans: 'Largest = 23' }}
                    solution={`Let the 7 consecutive numbers be x, x+1, x+2, x+3, x+4, x+5, x+6.
Average = Middle number = x + 3.

x + 3 = 20
x = 17.

Largest number = x + 6
= 17 + 6
= 23.

(Shortcut: For 7 numbers, the 4th is the average. The largest is 3 steps ahead: 20 + 3 = 23).`}
                />

                <QuestionCard 
                              qNum="P2" badge="Consecutive"
                              question="The average of N consecutive natural numbers is 7. Find out the value of n."
                              solution={`Average of n consecutive natural numbers = (n + 1) / 2
7 = (n + 1) / 2
14 = n + 1
n = 13.`} visualType={undefined} visualData={undefined}                />

                <QuestionCard 
                              qNum="P3" badge="Consecutive"
                              question="The average of the square of N consecutive natural numbers is 20. Find out the value of n."
                              solution={`Formula: Average of squares = (n+1)(2n+1) / 6
20 = (n+1)(2n+1) / 6
120 = (n+1)(2n+1)

Test factors of 120: 8 * 15 = 120.
Let's see if n=7 fits: (7+1)(2*7+1) = 8 * 15 = 120.
Therefore, n = 7.`} visualType={undefined} visualData={undefined}                />

                <QuestionCard 
                    qNum="P4" badge="Consecutive"
                    question="Calculate the average of 5 consecutive odd numbers greater than 15."
                    visualType="series"
                    visualData={{ numbers: ['17', '19', '21', '23', '25'], ans: 'Middle = 21' }}
                    solution={`Odd numbers greater than 15:
17, 19, 21, 23, 25

Since they are at equal intervals (AP), the average is simply the middle term.
Middle term = 21.`}
                />

                <QuestionCard 
                    qNum="P5" badge="Consecutive"
                    question="The average of 5 consecutive numbers is 50. Find the numbers."
                    visualType="series"
                    visualData={{ numbers: ['48', '49', '50', '51', '52'], ans: 'Middle = 50' }}
                    solution={`Let numbers be n-2, n-1, n, n+1, n+2.
Sum = 5n.
Average = n = 50.

So the numbers are 48, 49, 50, 51, 52.`}
                />

                {/* Number Trick */}
                <QuestionCard 
                              qNum="P6" badge="Universal Shift"
                              question="The average of 10 numbers is 23. If each number is increased by 4, what will the new average be?"
                              solution={`Trick: If each value increases by x, the average increases by x.
Old Average = 23.
Increase = 4.
New Average = 23 + 4 = 27.

(Proof: Total sum increases by 10*4 = 40. New sum = 230+40=270. 270/10 = 27).`} visualType={undefined} visualData={undefined}                />

                <QuestionCard 
                              qNum="P7" badge="Universal Shift"
                              question="If the Marks of Each student is 70 and it is increased by 20, then the average of the class will be?"
                              solution={`Trick: If every value is the same, the average is that value (70).
If each value increases by 20, the average increases by 20.
New Average = 70 + 20 = 90.`} visualType={undefined} visualData={undefined}                />

                {/* Sub-groups */}
                <QuestionCard 
                              qNum="P8" badge="Missing Member"
                              question="The average weight of 7 boys is 56 kg. The weights of six of them are 52, 57, 55, 60, 59 and 55. Find the weight of the 7th boy."
                              solution={`Total weight of 7 boys = 56 * 7 = 392 kg.

Sum of 6 boys = 52 + 57 + 55 + 60 + 59 + 55
= 338 kg.

Weight of 7th boy = Total - Sum of 6
= 392 - 338
= 54 kg.`} visualType={undefined} visualData={undefined}                />

                <QuestionCard 
                              qNum="P9" badge="Overlap"
                              question="The mean of 25 numbers is 36. If the mean of the first 13 numbers is 32 and that of the last 13 numbers is 39, find the 13th number."
                              solution={`Sum of all 25 numbers = 25 * 36 = 900.

Sum of first 13 = 13 * 32 = 416.
Sum of last 13 = 13 * 39 = 507.

The 13th number is counted twice in these two sums.
13th number = (Sum of first 13 + Sum of last 13) - Sum of 25
= (416 + 507) - 900
= 923 - 900
= 23.`} visualType={undefined} visualData={undefined}                />

                <QuestionCard 
                              qNum="P10" badge="Sub-groups"
                              question="The average of 5 numbers is 50. The average of the first two is 40. The average of the last two is 25. Find the third term."
                              solution={`Total sum of 5 numbers = 50 * 5 = 250.
Sum of first two = 40 * 2 = 80.
Sum of last two = 25 * 2 = 50.

Third term = Total - (First two + Last two)
= 250 - (80 + 50)
= 250 - 130
= 120.`} visualType={undefined} visualData={undefined}                />

                {/* Replacing / Joing */}
                <QuestionCard 
                              qNum="P11" badge="Age Change"
                              question="The average age of 39 boys and a girl is 11 years. If the girl is excluded, the average age is reduced by 1. What is the age of the girl?"
                              solution={`Method 1 (Basic):
Sum of 40 people = 40 * 11 = 440.
Sum of 39 boys (avg 10) = 39 * 10 = 390.
Girl's age = 440 - 390 = 50.

Method 2 (Trick):
When she leaves, avg drops by 1 for 39 boys.
She took her average (11) + the drop (1 * 39).
Age = 11 + 39 = 50 years.`} visualType={undefined} visualData={undefined}                />

                <QuestionCard 
                              qNum="P12" badge="Excluding"
                              question="The average age of 4 monkeys is 20 years. The youngest is 8 years old. When he was born, the average age of the remaining monkeys was N years. Calculate the average age of monkeys excluding the youngest monkey?"
                              solution={`Sum of all 4 monkeys = 4 * 20 = 80 years.

Sum excluding the youngest = 80 - 8 = 72 years.
Average of remaining 3 monkeys (currently) = 72 / 3 = 24 years.`} visualType={undefined} visualData={undefined}                />

                <QuestionCard 
                              qNum="P13" badge="Correction"
                              question="The average marks of a class gets increased by 5 when Shikha's marks are wrongly entered as 75 instead of 55. Find the number of students in the class."
                              solution={`Difference in marks = 75 - 55 = +20 (Extra marks added).
This extra 20 marks caused an increase of 5 in the average.

Number of students (n) = Total Error / Avg Error
n = 20 / 5
n = 4 students.`} visualType={undefined} visualData={undefined}                />

                {/* Sports / Batsman */}
                <QuestionCard 
                              qNum="P14" badge="Sports Avg"
                              question="A batsman makes a score of 87 runs in the 17th inning and thus increases his average by 3. Find his average after 17th inning?"
                              solution={`Let average after 16th inning = x.
Total runs after 16th = 16x.

In 17th inning, he scores 87.
New average = x + 3.
Total runs = 17(x + 3).

16x + 87 = 17x + 51
x = 87 - 51 = 36.

Avg after 17th inning = x + 3 = 36 + 3 = 39.`} visualType={undefined} visualData={undefined}                />

                <QuestionCard 
                              qNum="P15" badge="Sports Avg"
                              question="Batting avg of Sachin in 15 innings is 55. Difference between best and worst is 65. Excluding best and worst, avg of 13 innings is 50. Calculate Sachin's best score."
                              solution={`Total score (15 innings) = 15 * 55 = 825.
Total score (13 innings) = 13 * 50 = 650.

Sum of Best + Worst (B + W) = 825 - 650 = 175.
Given Difference (B - W) = 65.

Add equations:
2B = 175 + 65 = 240
B = 120.
Best score is 120 runs.`} visualType={undefined} visualData={undefined}                />

                {/* Speeds */}
                <QuestionCard 
                    qNum="P16" badge="Speed Avg"
                    question="Tushar travels to office at 20 Kmph. Returning home his speed increases by 20%. Calculate Tushar's average speed."
                    visualType="speed"
                    visualData={{ s1: '20 kmph', s2: '24 kmph', formula: '2ab / (a+b)', ans: 'Avg = 21.81 kmph' }}
                    solution={`Speed going (a) = 20 kmph.
Speed returning (b) = 20 + 20% of 20 = 24 kmph.

Since distance is same, use formula:
Avg Speed = 2ab / (a + b)
= 2 * 20 * 24 / (20 + 24)
= 960 / 44
= 21.81 kmph.`}
                />

            </div>
          </div>
        )}
      </div>
    </div>
  );
}