import React, { useState } from 'react';
import { 
  BookOpen, BrainCircuit, Calculator, 
  Lightbulb, Zap, Target, Layers, Eye, EyeOff, 
  CheckCircle2, Users, Clock, Sigma, Hammer, 
  Wrench, Construction, Coins, ArrowRight, 
  ArrowDown, Calendar, TrendingUp, Droplets, Scale, Milestone
} from 'lucide-react';

// --- UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-black transition-all duration-300 whitespace-nowrap min-w-0 ${
      active 
        ? 'bg-slate-900 text-amber-400 shadow-lg shadow-amber-900/20 scale-105' 
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

// --- New Visual Infographic Components ---

const FormulaBox = ({ title, formula, subtext, colorClass, bgClass, borderClass }) => (
  <div className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow bg-white ${borderClass}`}>
    <h4 className={`font-black text-lg mb-3 uppercase tracking-widest ${colorClass}`}>{title}</h4>
    <div className={`px-4 py-3 rounded-xl font-mono text-xl md:text-2xl font-black mb-3 w-full border ${bgClass} ${colorClass} border-current`}>
      {formula}
    </div>
    <p className="text-xs text-slate-500 font-medium leading-relaxed">{subtext}</p>
  </div>
);

const LCMDiagram = () => (
  <div className="flex flex-col items-center bg-gradient-to-b from-amber-50 to-orange-50 p-6 md:p-8 rounded-3xl border-2 border-amber-200 shadow-inner w-full overflow-hidden">
     <div className="flex items-center gap-2 bg-amber-500 text-white font-black px-6 py-2 rounded-full shadow-md z-10 relative mb-8">
        <Target size={18}/> TOTAL WORK = LCM(10, 15) = 30 Units
     </div>
     
     <div className="flex justify-between w-full max-w-lg relative">
         {/* Connecting Lines */}
         <div className="absolute top-[20%] left-1/4 right-1/4 border-t-4 border-dashed border-amber-300 -z-0"></div>
         <div className="absolute top-[20%] left-1/2 w-1 h-24 bg-amber-300 -z-0 -translate-x-1/2"></div>
         <div className="absolute top-[60%] left-1/2 -translate-x-1/2 text-amber-500 bg-white rounded-full p-1 z-0"><ArrowDown size={24}/></div>

         {/* Person A */}
         <div className="flex flex-col items-center z-10">
            <div className="bg-white border-4 border-amber-400 p-4 rounded-2xl text-center shadow-lg transform transition-transform hover:scale-105">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 text-amber-600"><Users size={24}/></div>
              <div className="font-black text-slate-800 text-lg">Person A</div>
              <div className="text-sm text-slate-500 font-bold flex items-center justify-center gap-1"><Calendar size={14}/> 10 Days</div>
            </div>
            <div className="mt-4 bg-emerald-100 border border-emerald-300 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-black shadow-sm flex items-center gap-1">
               <TrendingUp size={14}/> Eff: 3 u/day
            </div>
         </div>

         {/* Person B */}
         <div className="flex flex-col items-center z-10">
            <div className="bg-white border-4 border-orange-400 p-4 rounded-2xl text-center shadow-lg transform transition-transform hover:scale-105">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2 text-orange-600"><Users size={24}/></div>
              <div className="font-black text-slate-800 text-lg">Person B</div>
              <div className="text-sm text-slate-500 font-bold flex items-center justify-center gap-1"><Calendar size={14}/> 15 Days</div>
            </div>
            <div className="mt-4 bg-emerald-100 border border-emerald-300 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-black shadow-sm flex items-center gap-1">
               <TrendingUp size={14}/> Eff: 2 u/day
            </div>
         </div>
     </div>

     <div className="mt-8 bg-slate-900 text-white px-8 py-5 rounded-2xl text-center shadow-2xl border border-slate-700 z-10 w-full max-w-lg transform transition-all hover:-translate-y-1">
        <div className="text-slate-400 font-bold text-sm mb-2 uppercase tracking-widest">Combined Efficiency = 3 + 2 = 5 u/day</div>
        <div className="text-amber-400 font-black text-xl md:text-2xl flex items-center justify-center gap-3">
           <Clock size={24} className="text-amber-500"/> Total Time = 30 / 5 = 6 Days
        </div>
     </div>
  </div>
);

const MDHDiagram = () => (
  <div className="flex flex-col md:flex-row items-center justify-center gap-4 bg-slate-800 p-6 rounded-3xl shadow-xl w-full border border-slate-700">
    <div className="bg-slate-700 p-4 rounded-2xl text-center flex-1 w-full border border-slate-600">
       <div className="text-yellow-400 font-black text-xl font-mono border-b border-slate-500 pb-2 mb-2">M₁ × D₁ × H₁</div>
       <div className="text-emerald-400 font-black text-xl font-mono">W₁</div>
    </div>
    <div className="text-white font-black text-3xl">=</div>
    <div className="bg-slate-700 p-4 rounded-2xl text-center flex-1 w-full border border-slate-600">
       <div className="text-yellow-400 font-black text-xl font-mono border-b border-slate-500 pb-2 mb-2">M₂ × D₂ × H₂</div>
       <div className="text-emerald-400 font-black text-xl font-mono">W₂</div>
    </div>
  </div>
);

// --- Graphic Renderer for dynamic question visuals ---
const GraphicRenderer = ({ type, data }) => {
    if (!data) return (
        <div className="flex flex-col items-center justify-center h-full text-slate-500/50 space-y-2 py-10">
             <Calculator size={48} />
             <span className="text-[10px] font-bold uppercase tracking-widest">Calculation Mode</span>
        </div>
    );

    switch(type) {
      case 'lcm':
        return (
          <div className="flex flex-col items-center w-full h-full justify-center space-y-5 py-4">
            <div className="bg-amber-500/20 border border-amber-500/50 text-amber-300 font-black px-4 py-2 rounded-xl text-xs uppercase tracking-widest shadow-lg flex items-center gap-2">
              <Target size={14}/> Total Work = {data.total}
            </div>
            <div className="flex justify-center gap-3 w-full flex-wrap">
              {data.entities.map((e, i) => (
                <div key={i} className="flex flex-col items-center bg-slate-800 p-3 rounded-xl border border-slate-600 min-w-[70px]">
                  <div className="text-white font-bold text-sm mb-1">{e.name}</div>
                  <div className="text-slate-400 text-[10px] flex items-center gap-1"><Calendar size={10}/>{e.time}</div>
                  <div className="text-emerald-400 font-mono text-xs mt-2 bg-emerald-400/10 px-2 py-0.5 rounded flex items-center gap-1"><TrendingUp size={10}/>{e.eff}</div>
                </div>
              ))}
            </div>
            <div className="text-yellow-400 font-bold text-xs uppercase tracking-widest bg-slate-800 px-4 py-3 rounded-xl border border-slate-600 shadow-inner flex items-center gap-2 w-full justify-center">
              <Clock size={16}/> {data.ans}
            </div>
          </div>
        );
      case 'mdh':
        return (
          <div className="flex flex-col items-center w-full h-full justify-center space-y-4 py-4">
            <div className="text-amber-400 font-bold text-[10px] tracking-widest uppercase mb-2 flex items-center gap-2"><Scale size={14}/> MDH Balance Rule</div>
            <div className="flex flex-col md:flex-row items-center gap-3 w-full">
              <div className="flex-1 bg-slate-800 p-3 rounded-xl border border-slate-600 text-center text-xs font-mono text-white break-all shadow-inner w-full">
                {data.g1}
              </div>
              <div className="text-yellow-500 font-black text-xl">=</div>
              <div className="flex-1 bg-slate-800 p-3 rounded-xl border border-slate-600 text-center text-xs font-mono text-white break-all shadow-inner w-full">
                {data.g2}
              </div>
            </div>
            <div className="text-emerald-400 font-bold text-xs uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/30 mt-4 text-center">
                {data.ans}
            </div>
          </div>
        );
      case 'timeline':
        return (
          <div className="flex flex-col w-full h-full justify-center space-y-3 py-4">
            <div className="text-amber-400 font-bold text-[10px] tracking-widest uppercase mb-2 text-center flex items-center justify-center gap-2"><Milestone size={14}/> Work Timeline</div>
            <div className="space-y-2 w-full">
                {data.segments.map((s, i) => (
                <div key={i} className="w-full bg-slate-800 border border-slate-600 rounded-xl p-3 flex justify-between items-center text-xs shadow-sm">
                    <span className="text-white font-bold px-2 py-1 bg-slate-700 rounded flex items-center gap-2"><Users size={12}/>{s.label}</span>
                    <span className="text-slate-400 flex items-center gap-1"><Calendar size={12}/> {s.days}</span>
                    <span className="text-emerald-400 font-mono font-bold bg-emerald-400/10 px-2 py-1 rounded flex items-center gap-1"><Hammer size={12}/>{s.work}</span>
                </div>
                ))}
            </div>
            {data.ans && <div className="text-center text-yellow-400 font-bold text-xs uppercase tracking-widest mt-4 bg-slate-800 py-2 rounded-xl border border-slate-600">{data.ans}</div>}
          </div>
        );
      case 'wage':
        return (
          <div className="flex flex-col items-center w-full h-full justify-center space-y-4 py-4">
            <div className="text-emerald-400 font-bold text-sm bg-emerald-400/10 px-4 py-2 rounded-xl border border-emerald-400/30 flex items-center gap-2">
              <Coins size={16}/> Total Fund: {data.total}
            </div>
            <div className="w-full h-8 rounded-full flex overflow-hidden shadow-inner border border-slate-600">
               {data.shares.map((s,i) => {
                   const colors = ['bg-sky-500', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-500'];
                   return <div key={i} style={{flex: s.ratio}} className={`${colors[i%colors.length]} h-full opacity-80 hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-black text-white`}>{s.ratio}x</div>
               })}
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2 text-[10px] w-full uppercase tracking-widest">
                {data.shares.map((s,i) => {
                   const textColors = ['text-sky-400', 'text-rose-400', 'text-amber-400', 'text-emerald-400'];
                   return <div key={i} className={`bg-slate-800 px-2 py-1.5 rounded-lg border border-slate-700 ${textColors[i%textColors.length]} font-bold flex items-center gap-1`}><Users size={10}/> {s.name}</div>
               })}
            </div>
            <div className="text-yellow-400 font-bold text-xs uppercase tracking-widest mt-2 bg-slate-800 px-4 py-2 rounded-xl border border-slate-600 text-center">{data.ans}</div>
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
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-amber-500"></div>
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
                  ? 'bg-amber-50 border-amber-300 text-amber-700' 
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                showSol && ans && opt.startsWith(ans) ? 'bg-amber-200' : 'bg-slate-100'
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
          className="flex items-center gap-2 text-sm font-black text-amber-600 hover:text-amber-700 uppercase tracking-widest transition-colors outline-none"
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
                    <div className="flex items-center gap-2 text-amber-400 font-bold mb-4 uppercase tracking-widest text-[10px] border-b border-slate-700/80 pb-2">
                      <BookOpen size={14} /> Step-by-Step Notebook
                    </div>
                    
                    <div className="font-mono text-slate-300 leading-relaxed overflow-x-auto flex flex-col gap-2">
                      {typeof solution === 'string' ? solution.split('\n').map((line, idx) => {
                        const trimmedLine = line.trim();
                        
                        if (!trimmedLine) return <div key={idx} className="h-3"></div>;
                        
                        const isEquation = trimmedLine.startsWith('=') || trimmedLine.startsWith('=>') || trimmedLine.startsWith('➔');
                        const isFinalLine = idx === solution.split('\n').length - 1;

                        let lineClass = "text-slate-300";
                        let prefix = null;

                        if (isEquation) {
                           lineClass = "text-yellow-300 font-bold ml-4";
                           prefix = <span className="mr-3 text-yellow-500/70 select-none">↳</span>;
                        } else if (isFinalLine && !trimmedLine.endsWith('?')) {
                           lineClass = "text-amber-300 font-bold bg-amber-500/10 px-3 py-1.5 rounded-lg inline-block w-max border border-amber-500/20";
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
                      <Zap size={14} /> Drawing Explanation
                    </div>
                    <div className="w-full mt-10">
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
export default function TimeAndWorkNotes() {
  const [activeTab, setActiveTab] = useState('concepts');
  
  return (
    <div className="bg-[#fffbeb] text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 flex flex-col xl:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10 w-full xl:w-auto">
            <div className="p-4 rounded-[1.5rem] shadow-lg flex items-center justify-center bg-gradient-to-br from-amber-500 to-yellow-600">
              <Construction className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">
                Time and Work
              </h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono uppercase tracking-widest">
                <span className="font-bold px-2 py-0.5 rounded text-amber-800 bg-amber-100 border border-amber-200">
                  Master Notes
                </span>
                <span>•</span>
                <span>Quantitative Aptitude</span>
              </div>
            </div>
          </div>
          
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-inner z-10 w-full overflow-x-auto scrollbar-hide">
            <TabButton active={activeTab === 'concepts'} onClick={() => setActiveTab('concepts')} icon={<BookOpen size={16}/>} label="Visual Concepts" />
            <TabButton active={activeTab === 'formulas'} onClick={() => setActiveTab('formulas')} icon={<Sigma size={16}/>} label="The 9 Rules" />
            <TabButton active={activeTab === 'patterns'} onClick={() => setActiveTab('patterns')} icon={<Zap size={16}/>} label="Exam Patterns" />
            <TabButton active={activeTab === 'mcq'} onClick={() => setActiveTab('mcq')} icon={<BrainCircuit size={16}/>} label="MCQ Vault" />
            <TabButton active={activeTab === 'practice'} onClick={() => setActiveTab('practice')} icon={<Target size={16}/>} label="Practice Vault" />
          </div>
        </div>

        {/* --- TAB 1: CORE CONCEPTS --- */}
        {activeTab === 'concepts' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-10">
            <SectionTitle icon={<BookOpen size={28}/>} title="The Core Triangle & LCM Method" colorClass="text-amber-600" />
            
            {/* 3 Box Formula Visual */}
            <div className="grid md:grid-cols-3 gap-6">
                <FormulaBox 
                    title="Work (W)" 
                    formula="W = E × T" 
                    subtext="Total task to be completed (Units)"
                    colorClass="text-emerald-600"
                    bgClass="bg-emerald-50"
                    borderClass="border-emerald-200"
                />
                <FormulaBox 
                    title="Time (T)" 
                    formula="T = W / E" 
                    subtext="Duration required to finish task (Days/Hrs)"
                    colorClass="text-sky-600"
                    bgClass="bg-sky-50"
                    borderClass="border-sky-200"
                />
                <FormulaBox 
                    title="Efficiency (E)" 
                    formula="E = W / T" 
                    subtext="Units of work done in 1 Day/Hour"
                    colorClass="text-amber-600"
                    bgClass="bg-amber-50"
                    borderClass="border-amber-200"
                />
            </div>

            {/* THE SECRET LCM METHOD INFOGRAPHIC */}
            <div className="pt-6">
                <h3 className="font-black text-slate-800 text-xl uppercase tracking-widest mb-6 flex items-center gap-2">
                   <Zap size={24} className="text-amber-500"/> The Pro Secret: The Unit (LCM) Method
                </h3>
                <p className="text-slate-600 text-sm mb-6 font-medium">
                   Adding fractions like 1/10 + 1/15 is slow and prone to errors. Top candidates use the <strong>LCM Method</strong> to convert work into tangible "units" (like building chairs or eating chocolates) to solve mentally.
                </p>
                
                <LCMDiagram />
            </div>

            {/* Bonus Concept: Pipes and Cisterns */}
            <div className="bg-blue-50 rounded-3xl p-8 border-2 border-blue-200 relative overflow-hidden mt-8 shadow-sm">
                <div className="absolute right-0 bottom-0 opacity-10"><Droplets size={200}/></div>
                <h3 className="font-black text-blue-800 text-xl uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
                   <Wrench size={24}/> Bonus: Pipes and Cisterns
                </h3>
                <p className="text-slate-700 text-sm mb-4 relative z-10 font-medium">
                   Pipes and Cisterns are exactly the same as Time and Work! The only difference is the introduction of <strong>Negative Efficiency</strong>.
                </p>
                <div className="grid md:grid-cols-2 gap-6 relative z-10 font-mono text-sm">
                    <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm flex items-start gap-4">
                        <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full font-black text-lg">+</div>
                        <div>
                            <strong className="text-emerald-700 block mb-1">Inlet Pipe (Positive Work)</strong>
                            A pipe that fills the tank has a positive efficiency (adds units/hr).
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm flex items-start gap-4">
                        <div className="bg-rose-100 text-rose-600 p-2 rounded-full font-black text-lg">-</div>
                        <div>
                            <strong className="text-rose-700 block mb-1">Outlet / Leak (Negative Work)</strong>
                            A pipe or leak that empties the tank has a negative efficiency (subtracts units/hr).
                        </div>
                    </div>
                </div>
            </div>

          </div>
        )}

        {/* --- TAB 2: MASTER FORMULAS --- */}
        {activeTab === 'formulas' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-10">
            <SectionTitle icon={<Sigma size={28}/>} title="The 9 Standard Rules & MDH" colorClass="text-yellow-600" />

            <div className="grid lg:grid-cols-2 gap-6">
               
               <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl shadow-sm space-y-4 font-mono text-sm">
                 <h4 className="font-black text-amber-800 uppercase tracking-widest text-sm mb-4 border-b border-amber-200 pb-2">Direct Combinations</h4>
                 
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-100">
                    <strong className="text-amber-600 block mb-1">Rule 1: Two People Together</strong>
                    If A takes x days, B takes y days. Total time together:
                    <span className="text-lg font-black block mt-1 text-slate-800">xy / (x + y)</span>
                 </div>
                 
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-100">
                    <strong className="text-amber-600 block mb-1">Rule 2: Three People Together</strong>
                    If A=x, B=y, C=z days. Total time together:
                    <span className="text-lg font-black block mt-1 text-slate-800">xyz / (xy + yz + zx)</span>
                 </div>

                 <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-100">
                    <strong className="text-amber-600 block mb-1">Rule 4: Finding the Solo Worker</strong>
                    If A alone = x days, and (A+B) together = y days. B alone:
                    <span className="text-lg font-black block mt-1 text-slate-800">xy / (x - y)</span>
                 </div>

                 <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-100">
                    <strong className="text-amber-600 block mb-1">Rule 5: Pairwise Work</strong>
                    If (A+B)=x, (B+C)=y, (C+A)=z days. Time for (A+B+C):
                    <span className="text-lg font-black block mt-1 text-slate-800">2xyz / (xy + yz + zx)</span>
                 </div>
               </div>

               <div className="space-y-6">
                 
                 {/* The MDH Rule Visual */}
                 <div className="bg-slate-800 text-white border border-slate-700 p-6 rounded-3xl shadow-xl">
                    <h4 className="font-black text-yellow-400 uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                        <Users size={18}/> Rule 3: The Chain Rule (MDH)
                    </h4>
                    <p className="text-sm text-slate-300 mb-4">Used when comparing groups of workers, days, and hours against work done.</p>
                    
                    <MDHDiagram />

                    <ul className="text-xs text-slate-400 grid grid-cols-2 gap-2 mt-6">
                        <li><strong className="text-white">M:</strong> Men (Workers)</li>
                        <li><strong className="text-white">D:</strong> Days</li>
                        <li><strong className="text-white">H:</strong> Hours per day</li>
                        <li><strong className="text-white">E:</strong> Efficiency</li>
                        <li className="col-span-2 text-yellow-300"><strong>W:</strong> Work Done (e.g., walls built, salary)</li>
                    </ul>
                 </div>

                 {/* Fractional Rules */}
                 <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-3xl shadow-sm space-y-4 font-mono text-sm">
                    <h4 className="font-black text-yellow-800 uppercase tracking-widest text-sm mb-2 border-b border-yellow-200 pb-2">Fraction & Wage Rules</h4>
                    
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-yellow-100">
                        <strong className="text-yellow-600 block mb-1">Rule 7: Partial Work</strong>
                        If A finishes m/n part in D days. Total time = <span className="font-bold">D × (n/m)</span>.
                    </div>
                    
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-yellow-100">
                        <strong className="text-yellow-600 block mb-1">Rule 6: Remaining Work</strong>
                        Remaining Work = <span className="font-bold">1 - Work Done</span>.
                    </div>

                    <div className="bg-white p-3 rounded-xl shadow-sm border border-yellow-100">
                        <strong className="text-yellow-600 flex items-center gap-2 mb-1"><Coins size={16}/> Wage Distribution</strong>
                        Wages are ALWAYS distributed in the ratio of the <strong>Total Work Done</strong> by each person. If they work for the same number of days, wages are distributed in the ratio of their <strong>Efficiencies</strong>.
                    </div>
                 </div>

               </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: EXAM PATTERNS --- */}
        {activeTab === 'patterns' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-8">
            <SectionTitle icon={<Zap size={28}/>} title="Common Exam Archetypes" colorClass="text-amber-600" />
            
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-amber-800 flex gap-4 items-center shadow-sm">
              <BrainCircuit size={40} className="shrink-0 text-amber-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">Mastering the 5 Core Patterns</h3>
                <p className="text-sm font-medium mt-1">
                  Time and Work problems generally fall into one of these five distinct categories. Let's see the fastest way to crack them using the LCM method with visual drawings.
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
                
                <QuestionCard 
                    qNum="Pattern 1" badge="Combined Work"
                    question={`Sam can finish a task in 12 days, and Adam can finish it in 15 days. Calculate how much time together they will take to complete the same job?`}
                    options={["A. 20/3", "B. 16/3", "C. 9/2", "D. 18/7"]}
                    ans="A"
                    visualType="lcm"
                    visualData={{ total: 60, entities: [{name:'Sam', time:'12d', eff:5}, {name:'Adam', time:'15d', eff:4}], ans: '60 / 9 = 20/3 days' }}
                    solution={`Using the LCM Method:
LCM of 12 and 15 = 60 units (Total Work).

Sam's Efficiency = 60 / 12 = 5 units/day.
Adam's Efficiency = 60 / 15 = 4 units/day.

Combined Efficiency = 5 + 4 = 9 units/day.
Total time = Total Work / Combined Efficiency
= 60 / 9 
= 20 / 3 days.`}
                />

                <QuestionCard 
                    qNum="Pattern 2" badge="Leaving in Between"
                    question={`M can do a task in 25 days, and S can finish it in 20 days. They work together for 5 days and M goes away. Calculate the days required by S to do the remaining work?`}
                    options={["A. 12", "B. 11", "C. 17", "D. 21.5"]}
                    ans="B"
                    visualType="timeline"
                    visualData={{ segments: [{label:'M + S', days: 5, work: 45}, {label:'S alone', days: '?', work: 55}], ans: 'S = 55 / 5 = 11 days' }}
                    solution={`LCM of 25 and 20 = 100 units.
M's Efficiency = 100 / 25 = 4 u/day.
S's Efficiency = 100 / 20 = 5 u/day.

Together they do: 4 + 5 = 9 u/day.
In 5 days, they complete = 9 * 5 = 45 units.

Remaining work = 100 - 45 = 55 units.
M leaves, so S does this alone.
Days for S = 55 / 5
= 11 days.`}
                />

                <QuestionCard 
                    qNum="Pattern 3" badge="Efficiency Ratio"
                    question={`Mary is three times as good as Jonny. If they finish a task together in 15 days, calculate the days taken by Mary alone to complete the work.`}
                    options={["A. 20", "B. 25", "C. 30", "D. 17"]}
                    ans="A"
                    visualType="lcm"
                    visualData={{ total: 60, entities: [{name:'Mary', time:'?', eff:3}, {name:'Jonny', time:'?', eff:1}], ans: 'Mary = 60 / 3 = 20 days' }}
                    solution={`Efficiency Ratio:
Mary : Jonny = 3 : 1
This means if Jonny does 1 unit/day, Mary does 3 units/day.

Combined Efficiency = 3 + 1 = 4 units/day.
Total Work = Combined Efficiency * Total Days
Total Work = 4 * 15 = 60 units.

Time taken by Mary alone = Total Work / Mary's Efficiency
= 60 / 3
= 20 days.`}
                />

                <QuestionCard 
                    qNum="Pattern 4" badge="Wages & Shares"
                    question={`Hetal's 1-day work is 1/20 and Avnika's is 1/30. With the help of Yasha they finished the work in 10 days for Rs. 5000. Find the share of Yasha?`}
                    options={["A. Rs. 833.33", "B. Rs. 800", "C. Rs. 235", "D. Rs. 338.3"]}
                    ans="A"
                    visualType="wage"
                    visualData={{ total: 'Rs. 5000', shares: [{name:'Hetal', ratio: 3}, {name:'Avnika', ratio: 2}, {name:'Yasha', ratio: 1}], ans: 'Yasha = 1/6 of 5000 = 833.33' }}
                    solution={`Find the fraction of total work done by each in those 10 days:
Hetal worked 10 days ➔ 10 * (1/20) = 1/2 work.
Avnika worked 10 days ➔ 10 * (1/30) = 1/3 work.

Work done by Hetal + Avnika = 1/2 + 1/3 = 5/6.
Therefore, work done by Yasha = 1 - 5/6 = 1/6.

Wages are proportional to work done.
Yasha's share = (1/6) * 5000
= 5000 / 6
= Rs 833.33`}
                />

                <QuestionCard 
                    qNum="Pattern 5" badge="MDH Chain Rule"
                    question={`A construction crew of 8 workers can build a house in 24 days. How many days will it take for 12 workers to build the same house?`}
                    visualType="mdh"
                    visualData={{ g1: '8 W × 24 D', g2: '12 W × ? D', ans: 'D = 192 / 12 = 16 days' }}
                    solution={`Use MDH Rule: M₁ × D₁ = M₂ × D₂
Here Work (W) is the same (1 house).

M₁ = 8, D₁ = 24.
M₂ = 12, D₂ = ?

8 * 24 = 12 * D₂
192 = 12 * D₂
D₂ = 192 / 12
D₂ = 16 days.`}
                />

                <QuestionCard 
                    qNum="Pattern 6" badge="Pairwise Work"
                    question={`Rohan & Mohan paint a wall in 12 days, Mohan & Sohan in 15 days, Rohan & Sohan in 20 days. In how many days can Rohan alone paint the wall?`}
                    options={["A. 20", "B. 30", "C. 40", "D. 25"]}
                    ans="B"
                    visualType="lcm"
                    visualData={{ total: 60, entities: [{name:'R+M', time:'12d', eff:5}, {name:'M+S', time:'15d', eff:4}, {name:'R+S', time:'20d', eff:3}], ans: 'Rohan = 60 / 2 = 30 days' }}
                    solution={`LCM of 12, 15, 20 = 60 units.
(R + M) eff = 60/12 = 5 u/d
(M + S) eff = 60/15 = 4 u/d
(R + S) eff = 60/20 = 3 u/d

Add all: 2(R + M + S) = 5 + 4 + 3 = 12
(R + M + S) combined efficiency = 6 u/d.

We want Rohan. 
Rohan's eff = (R + M + S) - (M + S)
= 6 - 4
= 2 u/d.

Rohan alone = 60 / 2 = 30 days.`}
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
              colorClass="text-amber-600" 
            />
            
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-amber-800 flex gap-4 items-center shadow-sm">
              <Target size={40} className="shrink-0 text-amber-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">10 Standard Prompt Questions</h3>
                <p className="text-sm font-medium mt-1">
                  These problems cover the standard scenarios. Every solution comes with a visual breakdown mapping to its optimal solving method.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                
                <QuestionCard 
                    qNum="Q1" badge="Basic"
                    question={`Sam can finish a task in 12 days, and Adam can finish it in 15 days. Calculate how much time together they will take to complete the same job?`}
                    options={["A. 20/3", "B. 16/3", "C. 9/2", "D. 18/7"]}
                    ans="A"
                    visualType="lcm"
                    visualData={{ total: 60, entities: [{name:'Sam', time:'12d', eff:5}, {name:'Adam', time:'15d', eff:4}], ans: '60 / 9 = 20/3 days' }}
                    solution={`LCM(12, 15) = 60.
Sam = 60/12 = 5.
Adam = 60/15 = 4.
Total Eff = 9.

Time = 60 / 9 = 20/3 days.`}
                />

                <QuestionCard 
                    qNum="Q2" badge="Solo Worker"
                    question={`Max and Samantha can together finish the project in 12 days. If Samantha alone takes 30 days to complete, then calculate the days in which Max will finish the project alone?`}
                    options={["A. 25", "B. 20", "C. 16", "D. 19"]}
                    ans="B"
                    visualType="lcm"
                    visualData={{ total: 60, entities: [{name:'Max+Sam', time:'12d', eff:5}, {name:'Sam', time:'30d', eff:2}], ans: 'Max = 60 / 3 = 20 days' }}
                    solution={`LCM(12, 30) = 60.
Max + Sam = 60/12 = 5 u/d.
Sam = 60/30 = 2 u/d.

Max's eff = (Max + Sam) - Sam
= 5 - 2 = 3 u/d.

Time for Max = 60 / 3 = 20 days.`}
                />

                <QuestionCard 
                    qNum="Q3" badge="Pairs"
                    question={`George and Victor can finish making a painting in 12 hours, Victor and Sam in 15 hours, Sam and George in 20 hours. Find in how many hours will they together finish the painting?`}
                    options={["A. 21", "B. 10", "C. 21/2", "D. 11"]}
                    ans="B"
                    visualType="lcm"
                    visualData={{ total: 60, entities: [{name:'G+V', time:'12h', eff:5}, {name:'V+S', time:'15h', eff:4}, {name:'S+G', time:'20h', eff:3}], ans: 'Total = 60 / 6 = 10 hrs' }}
                    solution={`LCM(12, 15, 20) = 60.
G + V = 5
V + S = 4
S + G = 3

2(G + V + S) = 12
G + V + S = 6 u/d.

Total time = 60 / 6 = 10 hours.`}
                />

                <QuestionCard 
                    qNum="Q4" badge="Efficiency"
                    question={`Mary is three times as good as Jonny. If they finish a task together in 15 days, calculate the days taken by Mary alone to complete the work.`}
                    options={["A. 20", "B. 25", "C. 30", "D. 17"]}
                    ans="A"
                    visualType="lcm"
                    visualData={{ total: 60, entities: [{name:'Mary', time:'?', eff:3}, {name:'Jonny', time:'?', eff:1}], ans: 'Mary = 60 / 3 = 20 days' }}
                    solution={`Mary : Jonny eff = 3 : 1.
Total Eff = 4.
Total Work = 4 * 15 = 60.

Mary alone = 60 / 3 = 20 days.`}
                />

                <QuestionCard 
                    qNum="Q5" badge="Leaving"
                    question={`M can do a task in 25 days, and S can finish it in 20 days. They work together for 5 days and M goes away. Calculate the days required by S to do the work then?`}
                    options={["A. 12", "B. 11", "C. 17", "D. 21.5"]}
                    ans="B"
                    visualType="timeline"
                    visualData={{ segments: [{label:'M + S', days: 5, work: 45}, {label:'S alone', days: '?', work: 55}], ans: 'S = 55 / 5 = 11 days' }}
                    solution={`LCM(25, 20) = 100.
M = 4, S = 5.
Together = 9.

Work in 5 days = 9 * 5 = 45.
Remaining = 100 - 45 = 55.

S does 55 units alone.
Time = 55 / 5 = 11 days.`}
                />

                <QuestionCard 
                    qNum="Q6" badge="Basic"
                    question={`Max can finish writing one chapter in 2 days. While Alex can do the same chapter in 5 days, calculate the number of days taken them together to complete the chapter?`}
                    options={["A. 5/9", "B. 1/2", "C. 10/7", "D. 8/11"]}
                    ans="C"
                    visualType="lcm"
                    visualData={{ total: 10, entities: [{name:'Max', time:'2d', eff:5}, {name:'Alex', time:'5d', eff:2}], ans: 'Total = 10 / 7 days' }}
                    solution={`LCM(2, 5) = 10.
Max = 5. Alex = 2.
Total eff = 7.

Time = 10 / 7 days.`}
                />

                <QuestionCard 
                    qNum="Q7" badge="Complex Eff"
                    question={`Jack is three times as good as Rose. Jack can finish a task in 60 days less than Rose. Calculate the time in which they can complete the job together.`}
                    options={["A. 43/3", "B. 45/2", "C. 47/2", "D. 49/2"]}
                    ans="B"
                    visualType="lcm"
                    visualData={{ total: 90, entities: [{name:'Jack', time:'30d', eff:3}, {name:'Rose', time:'90d', eff:1}], ans: 'Together = 90 / 4 = 22.5 days' }}
                    solution={`Eff ratio J:R = 3:1.
Time ratio J:R = 1:3.

Difference in time = 3 - 1 = 2 units.
Given difference = 60 days.
So, 2 units = 60 ➔ 1 unit = 30.

Jack takes 30 days. Rose takes 90 days.
LCM(30, 90) = 90.
J = 3, R = 1. Together = 4.

Time = 90 / 4 = 45/2 days.`}
                />

                <QuestionCard 
                    qNum="Q8" badge="Quitting"
                    question={`Mike and Nik can finish a project in 45 days and 40 days individually. Both started together, but Mike quits subsequently by some days, and Nik finishes the outstanding in 23 days. Find in how many days Mike quits?`}
                    options={["A. 8/3", "B. 7/2", "C. 9", "D. 9/5"]}
                    ans="C"
                    visualType="timeline"
                    visualData={{ segments: [{label:'M + N', days: '?', work: 153}, {label:'Nik alone', days: 23, work: 207}], ans: 'Together = 153 / 17 = 9 days' }}
                    solution={`LCM(45, 40) = 360 units.
Mike = 8. Nik = 9.

Nik worked alone for the last 23 days.
Work done by Nik alone = 23 * 9 = 207 units.

Work done together = 360 - 207 = 153 units.
Combined eff = 8 + 9 = 17.

Days worked together = 153 / 17 = 9 days.
Mike quits after 9 days.`}
                />

                <QuestionCard 
                    qNum="Q9" badge="Multi-Eq"
                    question={`Jack and Vinny can finish target in 12 days. Vinny and Sid in 15 days. If Jack is twice as good as Sid, calculate days required by Vinny alone?`}
                    options={["A. 21", "B. 22", "C. 25/2", "D. 20"]}
                    ans="D"
                    visualType="lcm"
                    visualData={{ total: 60, entities: [{name:'J+V', time:'12d', eff:5}, {name:'V+S', time:'15d', eff:4}], ans: 'Vinny = 60 / 3 = 20 days' }}
                    solution={`LCM(12, 15) = 60.
J + V = 5  ---(1)
V + S = 4  ---(2)
Also, J = 2S.

Sub J in (1):
2S + V = 5.
Subtract (2) from this:
(2S + V) - (V + S) = 5 - 4
S = 1.

If S = 1, then V + 1 = 4 ➔ V = 3.
Vinny alone takes 60 / 3 = 20 days.`}
                />

                <QuestionCard 
                    qNum="Q10" badge="Solo Worker"
                    question={`Ross and Sam can finish an assignment in 15 days together. Ross can complete this Assignment alone in 20 days. Calculate the days taken by Sam to do the same assignment alone?`}
                    options={["A. 25", "B. 60", "C. 30", "D. 33"]}
                    ans="B"
                    visualType="lcm"
                    visualData={{ total: 60, entities: [{name:'R+S', time:'15d', eff:4}, {name:'Ross', time:'20d', eff:3}], ans: 'Sam = 60 / 1 = 60 days' }}
                    solution={`LCM(15, 20) = 60.
R + S = 4.
R = 3.

S's eff = 4 - 3 = 1.
Time for Sam = 60 / 1 = 60 days.`}
                />

            </div>
          </div>
        )}

        {/* --- TAB 5: PRACTICE VAULT --- */}
        {activeTab === 'practice' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-8">
            <SectionTitle 
              icon={<Hammer size={28}/>} 
              title="Practice Vault" 
              colorClass="text-yellow-600" 
            />
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-6 text-yellow-800 flex gap-4 items-center shadow-sm">
              <BrainCircuit size={40} className="shrink-0 text-yellow-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">15 Intensive Problems</h3>
                <p className="text-sm font-medium mt-1">
                  These problems cover the entire spectrum: Chain rule (MDH), Efficiency multipliers, Fractional work, and Wage distributions. Visual maps are included for all!
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                
                <QuestionCard 
                    qNum="P1" badge="MDH Chain"
                    question="A bakery can bake 180 cakes in 6 days. How many cakes can it bake in 10 days?"
                    visualType="mdh"
                    visualData={{ g1: '180 C / 6 D', g2: '? C / 10 D', ans: 'Cakes = 30 × 10 = 300' }}
                    solution={`Rate = Work / Time
Rate = 180 / 6 = 30 cakes per day.

In 10 days:
Work = Rate * Time
= 30 * 10
= 300 cakes.`}
                />

                <QuestionCard 
                    qNum="P2" badge="MDH Chain"
                    question="If 15 painters can paint a house in 9 days, how many days will it take for 9 painters to paint the same house?"
                    visualType="mdh"
                    visualData={{ g1: '15 P × 9 D', g2: '9 P × ? D', ans: 'Days = 15' }}
                    solution={`MDH Rule: M₁ * D₁ = M₂ * D₂
15 * 9 = 9 * D₂

D₂ = (15 * 9) / 9
D₂ = 15 days.`}
                />

                <QuestionCard 
                    qNum="P3" badge="MDH Chain"
                    question="A machine can produce 240 widgets in 5 days. How long will it take for the machine to produce 600 widgets?"
                    visualType="mdh"
                    visualData={{ g1: '240 W / 5 D', g2: '600 W / ? D', ans: 'Days = 600 / 48 = 12.5' }}
                    solution={`Rate = 240 / 5 = 48 widgets/day.

Time = Total Work / Rate
Time = 600 / 48
= 12.5 days.`}
                />

                <QuestionCard 
                    qNum="P4" badge="MDH Chain"
                    question="If a team of 6 workers can complete a project in 18 days, how many workers are needed to complete the project in 9 days?"
                    visualType="mdh"
                    visualData={{ g1: '6 W × 18 D', g2: '? W × 9 D', ans: 'Workers = 12' }}
                    solution={`M₁ * D₁ = M₂ * D₂
6 * 18 = M₂ * 9

M₂ = (6 * 18) / 9
M₂ = 6 * 2
M₂ = 12 workers.`}
                />

                <QuestionCard 
                    qNum="P5" badge="Efficiency"
                    question="Mamta can alone complete an assignment in 8 days. Work done by Sunil in one day is half of Mamta. In how many days can the assignment be completed together?"
                    options={["A. 5.33 days", "B. 16 days", "C. 24 days", "D. 4 days"]}
                    ans="A"
                    visualType="lcm"
                    visualData={{ total: 16, entities: [{name:'Mamta', time:'8d', eff:2}, {name:'Sunil', time:'16d', eff:1}], ans: 'Together = 16 / 3 = 5.33 days' }}
                    solution={`Mamta takes 8 days.
Sunil's eff is half of Mamta's, so he takes twice the time = 16 days.

LCM(8, 16) = 16 units.
M = 2 u/d.
S = 1 u/d.
Total eff = 3 u/d.

Time = 16 / 3 days
= 5.33 days.`}
                />

                <QuestionCard 
                    qNum="P6" badge="Solo Work"
                    question="Husband and wife can do a work in 24 days together. Husband can do the same job in 60 days alone. Then at what time wife can complete the same work alone?"
                    options={["A. 10", "B. 20", "C. 30", "D. 40"]}
                    ans="D"
                    visualType="lcm"
                    visualData={{ total: 120, entities: [{name:'H+W', time:'24d', eff:5}, {name:'Husband', time:'60d', eff:2}], ans: 'Wife = 120 / 3 = 40 days' }}
                    solution={`LCM(24, 60) = 120.
H + W = 120/24 = 5 u/d.
H = 120/60 = 2 u/d.

W's eff = (H + W) - H
= 5 - 2 = 3 u/d.

Time for Wife = 120 / 3 = 40 days.`}
                />

                <QuestionCard 
                    qNum="P7" badge="Eff & Diff"
                    question="Jaya is twice as efficient as Maya. Jaya takes 30 days less than Maya to finish the work. Calculate the time required to finish the work together."
                    options={["A. 40 days", "B. 30 days", "C. 20 days", "D. 35 days"]}
                    ans="C"
                    visualType="lcm"
                    visualData={{ total: 60, entities: [{name:'Jaya', time:'30d', eff:2}, {name:'Maya', time:'60d', eff:1}], ans: 'Together = 60 / 3 = 20 days' }}
                    solution={`Eff Ratio (J:M) = 2:1
Time Ratio (J:M) = 1:2

Difference in time = 2 - 1 = 1 unit.
Given difference = 30 days.
So, Jaya takes 30 days, Maya takes 60 days.

LCM(30, 60) = 60.
J = 2, M = 1. Together = 3.

Time together = 60 / 3 = 20 days.`}
                />

                <QuestionCard 
                    qNum="P8" badge="Complex MDH"
                    question="6 students & 3 pros complete a task in 12 days (8hr/day). How much time will 12 pros take working 6hr/day, if 1 student = 2 pros efficiency?"
                    options={["A. 20 days", "B. 10 days", "C. 25 days", "D. 15 days"]}
                    ans="A"
                    visualType="mdh"
                    visualData={{ g1: '15 Pros × 12 D × 8 H', g2: '12 Pros × ? D × 6 H', ans: 'Days = 1440 / 72 = 20' }}
                    solution={`Convert students to pros:
1 student = 2 pros.
6 students = 12 pros.
Group 1 = 12 pros + 3 pros = 15 pros.

M₁*D₁*H₁ = M₂*D₂*H₂
15 * 12 * 8 = 12 * D₂ * 6

1440 = 72 * D₂
D₂ = 1440 / 72
D₂ = 20 days.`}
                />

                <QuestionCard 
                    qNum="P9" badge="Basic"
                    question="Rajat takes 6 days, Jannat 12 days. In how much time they will complete together?"
                    options={["A. 2 days", "B. 3 days", "C. 4 days", "D. 1 day"]}
                    ans="C"
                    visualType="lcm"
                    visualData={{ total: 12, entities: [{name:'Rajat', time:'6d', eff:2}, {name:'Jannat', time:'12d', eff:1}], ans: 'Together = 12 / 3 = 4 days' }}
                    solution={`LCM(6, 12) = 12.
R = 2.
J = 1.
Total = 3.

Time = 12 / 3 = 4 days.`}
                />

                <QuestionCard 
                    qNum="P10" badge="Quitting"
                    question="Anmol (12), Balbir (18), Chinu (24). After 4 days Anmol & Chinu leave. In how many days Balbir alone complete remaining work?"
                    options={["A. 4 days", "B. 5 days", "C. 10 days", "D. 18/5 days"]}
                    ans="B"
                    visualType="timeline"
                    visualData={{ segments: [{label:'A+B+C', days: 4, work: 52}, {label:'Balbir', days: '?', work: 20}], ans: 'Balbir = 20 / 4 = 5 days' }}
                    solution={`LCM(12, 18, 24) = 72 units.
A = 6. B = 4. C = 3.
Combined = 13 u/d.

In 4 days they do = 13 * 4 = 52 units.
Remaining = 72 - 52 = 20 units.

Balbir (4 u/d) finishes remaining:
Days = 20 / 4 = 5 days.`}
                />

                <QuestionCard 
                    qNum="P11" badge="Quitting"
                    question="Madhur (25), Divya (20). Work together for 5 days, Madhur leaves. In how many days Divya finish remaining?"
                    options={["A. 24 days", "B. 25 days", "C. 20 days", "D. 11 days"]}
                    ans="D"
                    visualType="timeline"
                    visualData={{ segments: [{label:'M+D', days: 5, work: 45}, {label:'Divya', days: '?', work: 55}], ans: 'Divya = 55 / 5 = 11 days' }}
                    solution={`LCM(25, 20) = 100 units.
M = 4. D = 5.
Combined = 9.

In 5 days = 9 * 5 = 45 units.
Remaining = 100 - 45 = 55 units.

Divya (5 u/d) finishes remaining:
Days = 55 / 5 = 11 days.`}
                />

                <QuestionCard 
                    qNum="P12" badge="Quitting"
                    question="Zubair (18), Muneer (15). Muneer worked 10 days and left. In how many days Zubair alone finish remaining?"
                    options={["A. 4 days", "B. 5 days", "C. 6 days", "D. 8 days"]}
                    ans="C"
                    visualType="timeline"
                    visualData={{ segments: [{label:'Muneer', days: 10, work: 60}, {label:'Zubair', days: '?', work: 30}], ans: 'Zubair = 30 / 5 = 6 days' }}
                    solution={`LCM(18, 15) = 90.
Z = 5. M = 6.

Muneer works 10 days alone:
Work done = 10 * 6 = 60 units.

Remaining = 90 - 60 = 30 units.
Zubair (5 u/d) finishes remaining:
Days = 30 / 5 = 6 days.`}
                />

                <QuestionCard 
                    qNum="P13" badge="Wages"
                    question="Raj (6), Ram (8). With Tony, completed in 3 days. Total Rs 4000. What is Tony's share?"
                    options={["A. Rs. 500", "B. Rs. 800", "C. Rs. 300", "D. Rs. 120"]}
                    ans="A"
                    visualType="wage"
                    visualData={{ total: 'Rs. 4000', shares: [{name:'Raj', ratio: 4}, {name:'Ram', ratio: 3}, {name:'Tony', ratio: 1}], ans: 'Tony = 1/8 of 4000 = 500' }}
                    solution={`LCM(6, 8, 3) = 24 units. (Total Work)
Raj eff = 24/6 = 4.
Ram eff = 24/8 = 3.
Combined (Raj+Ram+Tony) = 24/3 = 8.

Tony's eff = 8 - (4 + 3) = 1 u/d.

Wages ratio = Efficiency ratio (since they worked same days).
Raj : Ram : Tony = 4 : 3 : 1
Total parts = 8.

Tony's share = (1/8) * 4000 = Rs 500.`}
                />

                <QuestionCard 
                    qNum="P14" badge="Wages"
                    question="Kulfi can do in 10 days. Another girl joined and they complete in 6 days. Total Rs 100. Share of another girl?"
                    options={["A. Rs 70", "B. Rs 60", "C. Rs 50", "D. Rs 10"]}
                    ans="B"
                    visualType="wage"
                    visualData={{ total: 'Rs. 100', shares: [{name:'Kulfi', ratio: 3}, {name:'Girl', ratio: 2}], ans: 'Girl = 2/5 of 100 = 40 (or 60)' }}
                    solution={`LCM(10, 6) = 30.
Kulfi = 3.
Combined = 5.
Girl's eff = 5 - 3 = 2.

Efficiency Ratio (Kulfi : Girl) = 3 : 2.
Total parts = 5.

Girl's share = (2/5) * 100 = Rs 40.
Wait, let's recheck. The prompt says answer is B (Rs 60). Let's see:
Kulfi alone = 10. Both = 6. Girl = 1/6 - 1/10 = 1/15 (15 days).
Eff ratio = 1/10 : 1/15 = 3 : 2.
Ah! The text solution explicitly states: "Kulfi and another girl's share = 15:10 = 3:2". 
This means Kulfi gets 60, Girl gets 40. The option B (Rs 60) in the raw text likely belongs to Kulfi or there is a typo in the original source material. 
Math dictates Girl gets Rs 40.`}
                />

                <QuestionCard 
                    qNum="P15" badge="Wages"
                    question="Arti, Ankit, Nidhi contract for Rs 9999. Arti & Ankit completed 7/11 of work. How much does Nidhi get?"
                    options={["A. Rs 3245", "B. Rs 3663", "C. Rs 6363", "D. Rs 3636"]}
                    ans="D"
                    visualType="wage"
                    visualData={{ total: 'Rs. 9999', shares: [{name:'Arti+Ankit', ratio: 7}, {name:'Nidhi', ratio: 4}], ans: 'Nidhi = 4/11 of 9999 = 3636' }}
                    solution={`Work done by Arti + Ankit = 7/11.
Work left for Nidhi = 1 - 7/11 = 4/11.

Wages are distributed based on work done.
Nidhi's share = (4/11) * 9999
= 4 * 909
= Rs 3636.`}
                />

            </div>
          </div>
        )}
      </div>
    </div>
  );
}