import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Layers, FileText, ArrowRight, 
  Database, Box, Play, Pause, RefreshCw, Component, 
  Fingerprint, Link as LinkIcon, Lock, Users
} from 'lucide-react';

// --- DATA & CONSTANTS ---

const CODE_STRING = `class Dog {
    String name;
    int age;

    // Constructor
    Dog(String n, int a) {
        this.name = n;
        this.age = a;
    }

    void bark() {
        System.out.println(this.name + " barks!");
    }
}

public class Main {
    public static void main(String[] args) {
        // 1. Instantiation
        Dog myDog = new Dog("Rex", 3);
        
        // 2. Method Call on Object
        myDog.bark();
    }
}`;

const STEPS = [
  {
    line: 0,
    phase: "1. JVM Startup",
    desc: "The JVM loads the blueprints (classes 'Main' and 'Dog') into the Method Area. The main() method starts executing.",
    frames: [{ name: "main(String[] args)", active: true, vars: [] }],
    heap: []
  },
  {
    line: 19,
    phase: "2. Allocation (new Dog)",
    desc: "new Dog(); The JVM allocates space in the Heap for a Dog object. It creates internal slots for 'name' and 'age', filled with default values (null and 0).",
    frames: [{ name: "main(String[] args)", active: true, vars: [] }],
    heap: [{ id: "dog1", type: "Dog", refAddr: "@H1", color: "amber", active: true, fields: [
        { name: "name", val: "null", type: "String" },
        { name: "age", val: "0", type: "int" }
    ] }]
  },
  {
    line: 6,
    phase: "3. The Constructor Call",
    desc: "The JVM pushes a frame for the Dog() constructor. CRITICAL: It silently passes a hidden variable called 'this', which holds the address (@H1) of the newly allocated Heap object!",
    frames: [
        { name: "main(String[] args)", active: false, paused: true, vars: [] },
        { name: "Dog(String n, int a)", active: true, vars: [
            { id: "this", val: "@H1", type: "Dog", isRef: true, color: "amber", highlight: true },
            { id: "n", val: "\"Rex\"", type: "String", isRef: true, color: "rose" },
            { id: "a", val: "3", type: "int" }
        ]}
    ],
    heap: [{ id: "dog1", type: "Dog", refAddr: "@H1", color: "amber", fields: [
        { name: "name", val: "null", type: "String" },
        { name: "age", val: "0", type: "int" }
    ] }]
  },
  {
    line: 7,
    phase: "4. Setting Instance Variables",
    desc: "this.name = n; The JVM follows the 'this' pointer (@H1) into the Heap and updates the 'name' slot of that specific object to \"Rex\".",
    frames: [
        { name: "main(String[] args)", active: false, paused: true, vars: [] },
        { name: "Dog(String n, int a)", active: true, vars: [
            { id: "this", val: "@H1", type: "Dog", isRef: true, color: "amber" },
            { id: "n", val: "\"Rex\"", type: "String", isRef: true, color: "rose", highlight: true },
            { id: "a", val: "3", type: "int" }
        ]}
    ],
    heap: [{ id: "dog1", type: "Dog", refAddr: "@H1", color: "amber", active: true, fields: [
        { name: "name", val: "\"Rex\"", type: "String", highlight: true },
        { name: "age", val: "0", type: "int" }
    ] }]
  },
  {
    line: 8,
    phase: "5. Setting Instance Variables",
    desc: "this.age = a; The JVM again uses the 'this' pointer to find the object and sets its 'age' slot to 3. The object is now fully initialized.",
    frames: [
        { name: "main(String[] args)", active: false, paused: true, vars: [] },
        { name: "Dog(String n, int a)", active: true, vars: [
            { id: "this", val: "@H1", type: "Dog", isRef: true, color: "amber" },
            { id: "n", val: "\"Rex\"", type: "String", isRef: true, color: "rose" },
            { id: "a", val: "3", type: "int", highlight: true }
        ]}
    ],
    heap: [{ id: "dog1", type: "Dog", refAddr: "@H1", color: "amber", active: true, fields: [
        { name: "name", val: "\"Rex\"", type: "String" },
        { name: "age", val: "3", type: "int", highlight: true }
    ] }]
  },
  {
    line: 19,
    phase: "6. Returning the Reference",
    desc: "The constructor finishes and its frame is destroyed. The memory address (@H1) is returned to main() and saved inside the 'myDog' variable.",
    frames: [{ name: "main(String[] args)", active: true, vars: [
        { id: "myDog", val: "@H1", type: "Dog", isRef: true, color: "amber", highlight: true }
    ] }],
    heap: [{ id: "dog1", type: "Dog", refAddr: "@H1", color: "amber", highlight: true, fields: [
        { name: "name", val: "\"Rex\"", type: "String" },
        { name: "age", val: "3", type: "int" }
    ] }]
  },
  {
    line: 22,
    phase: "7. Instance Method Call",
    desc: "myDog.bark(); When you call a method ON an object, the JVM pushes the bark() frame and silently passes 'myDog's address (@H1) into the hidden 'this' parameter.",
    frames: [
        { name: "main(String[] args)", active: false, paused: true, vars: [
            { id: "myDog", val: "@H1", type: "Dog", isRef: true, color: "amber" }
        ]},
        { name: "bark()", active: true, vars: [
            { id: "this", val: "@H1", type: "Dog", isRef: true, color: "amber", highlight: true }
        ]}
    ],
    heap: [{ id: "dog1", type: "Dog", refAddr: "@H1", color: "amber", fields: [
        { name: "name", val: "\"Rex\"", type: "String" },
        { name: "age", val: "3", type: "int" }
    ] }]
  },
  {
    line: 12,
    phase: "8. Reading via 'this'",
    desc: "System.out.println(this.name...); The bark() method uses its 'this' pointer (@H1) to jump to the Heap, retrieve the name \"Rex\", and print it!",
    frames: [
        { name: "main(String[] args)", active: false, paused: true, vars: [
            { id: "myDog", val: "@H1", type: "Dog", isRef: true, color: "amber" }
        ]},
        { name: "bark()", active: true, vars: [
            { id: "this", val: "@H1", type: "Dog", isRef: true, color: "amber" }
        ]}
    ],
    heap: [{ id: "dog1", type: "Dog", refAddr: "@H1", color: "amber", active: true, fields: [
        { name: "name", val: "\"Rex\"", type: "String", highlight: true },
        { name: "age", val: "3", type: "int" }
    ] }],
    console: "Rex barks!"
  }
];

// --- COMPONENTS ---

const TabButton = ({ active, onClick, icon, label, color = "amber" }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color?: string }) => {
    const colorMap: Record<string, string> = {
        amber: 'text-amber-600',
        orange: 'text-orange-600',
        sky: 'text-sky-600',
        indigo: 'text-indigo-600'
    };
    const activeColor = colorMap[color] || 'text-amber-600';

    return (
      <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? `bg-white ${activeColor} shadow-sm border border-slate-200 scale-105` : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
        {icon} {label}
      </button>
    );
};

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|static|class|void|int|new|this)\b|\b\d+\b)/g).filter(Boolean);
  
  return (
    <div className={`flex relative z-10 min-h-[22px] items-center transition-colors duration-200 ${active ? 'bg-amber-500/15' : 'hover:bg-slate-800/50'}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]`} />}
      <span className={`w-10 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-xs ${active ? `text-amber-400 font-bold` : 'text-slate-600'}`}>{num}</span>
      <pre className={`font-mono text-xs transition-opacity duration-300 ${active ? 'opacity-100 text-slate-100' : 'opacity-70 text-slate-300'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-emerald-400">{part}</span>;
          if (['public', 'static', 'class', 'void', 'new'].includes(part)) return <span key={i} className="text-pink-500 font-bold">{part}</span>;
          if (part === 'this') return <span key={i} className="text-amber-400 font-bold italic">{part}</span>;
          if (part === 'String') return <span key={i} className="text-sky-300 font-bold">{part}</span>;
          if (part === 'int') return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-purple-400">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'lesson' | 'visualizer' | 'theory' | 'interview'>('visualizer');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      if (currentStep < STEPS.length - 1) {
        timer = setTimeout(() => { setCurrentStep(prev => prev + 1); }, 4500); 
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep]);

  const handleNext = () => { setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1)); setIsPlaying(false); };
  const handlePrev = () => { setCurrentStep(prev => Math.max(0, prev - 1)); setIsPlaying(false); };
  const handleReset = () => { setCurrentStep(0); setIsPlaying(false); };
  const togglePlay = () => {
      if (currentStep === STEPS.length - 1) setCurrentStep(0);
      setIsPlaying(!isPlaying);
  };
  
  const handleCopy = () => { 
    navigator.clipboard.writeText(CODE_STRING); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = STEPS[currentStep];
  const progressPercent = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-2xl shadow-lg shadow-amber-200 flex items-center justify-center relative overflow-hidden group">
                <Component className="text-white relative z-10" size={28} />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Classes & Objects</h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono">
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded tracking-widest uppercase border border-amber-100">Java OOP Core</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase tracking-wider">The 'this' Pointer</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto w-full lg:w-auto">
            <TabButton active={activeTab === 'lesson'} onClick={() => setActiveTab('lesson')} icon={<FileText size={16}/>} label="Lesson" color="amber" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Simulator" color="amber" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen size={16}/>} label="Blueprint vs Obj" color="sky" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Static vs Instance" color="indigo" />
          </div>
        </div>

        {/* --- VISUALIZER TAB --- */}
        {activeTab === 'visualizer' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Col: Code & Log (5/12) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Code Window */}
                <div className="bg-[#0f172a] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={16} className="text-amber-400" />
                      <span className="font-bold uppercase tracking-widest text-[10px] text-slate-300 font-mono">Main.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors text-slate-400">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-4 py-6 font-mono text-[13px] leading-relaxed relative overflow-auto h-[380px]">
                      {CODE_STRING.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} />
                      ))}
                  </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-lg border transition-all duration-300 relative overflow-hidden flex-1 flex flex-col bg-white border-slate-200`}>
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-2">
                        <Activity size={16} className="text-amber-500"/>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     {cur.line > 0 && (
                        <div className="px-2.5 py-1 rounded text-[10px] font-black uppercase font-mono tracking-wider border bg-slate-100 text-slate-600 border-slate-200">
                            Line {cur.line}
                        </div>
                     )}
                  </div>
                  <div className="text-xl font-black tracking-tight mb-3 text-slate-800 flex items-center gap-3 relative z-10">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed border-l-4 pl-4 relative z-10 flex-1 text-slate-600 border-amber-300">
                      {cur.desc}
                  </p>
                  
                  {/* Console Output (if any) */}
                  {cur.console && (
                      <div className="mt-4 bg-slate-900 rounded-xl p-3 border border-slate-800 flex items-center gap-3 animate-in zoom-in-95">
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest font-mono">Console:</span>
                          <span className="text-emerald-400 font-mono text-sm">{cur.console}</span>
                      </div>
                  )}

                  {/* Progress Bar inside Log */}
                  <div className="mt-6">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                          <span>Progress</span>
                          <span>{currentStep + 1} / {STEPS.length}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
                      </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex gap-3">
                    <button onClick={handleReset} className="px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors tooltip" title="Reset">
                      <RefreshCw size={18}/>
                    </button>
                    <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-slate-600">
                      <ChevronLeft size={18}/> Prev
                    </button>
                    <button onClick={togglePlay} className={`px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${isPlaying ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200' : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200'}`}>
                      {isPlaying ? <Pause size={18}/> : <Play size={18}/>}
                    </button>
                    <button onClick={handleNext} disabled={currentStep === STEPS.length - 1} className="flex-1 py-4 bg-amber-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-200 hover:bg-amber-700 transition-all flex items-center justify-center gap-2">
                      Next <ChevronRight size={18}/>
                    </button>
                </div>
              </div>

              {/* Right Col: JVM Memory Arena (7/12) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 md:p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner h-full min-h-[600px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-50/50 via-white to-white">
                    
                    {/* Arena Header */}
                    <div className="flex flex-wrap items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 font-mono uppercase tracking-tight">
                            <Database size={20} className="text-amber-500"/> Object Topology
                        </h3>
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row gap-6 relative">
                        
                        {/* THE STACK */}
                        <div className="flex-[3] flex flex-col bg-slate-50 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="bg-slate-100 border-b border-slate-200 p-4 flex items-center justify-between relative z-10">
                                <span className="text-sm font-black text-slate-700 uppercase tracking-widest font-mono flex items-center gap-2"><Layers size={16}/> The Stack</span>
                            </div>
                            
                            <div className="p-4 flex flex-col-reverse justify-start gap-4 flex-1 overflow-y-auto z-10">
                                {cur.frames.map((frame, idx) => {
                                    const isTopFrame = idx === cur.frames.length - 1;

                                    return (
                                    <div key={idx} className={`w-full relative flex flex-col rounded-2xl border-2 transition-all duration-500 shadow-lg overflow-hidden bg-white z-20 ${isTopFrame && !frame.paused ? 'border-amber-500 ring-4 ring-amber-50 scale-[1.02]' : 'border-slate-300 opacity-70 scale-95'}`}>
                                        <div className={`px-4 py-2 border-b flex justify-between items-center ${isTopFrame && !frame.paused ? 'bg-amber-100' : 'bg-slate-200'}`}>
                                            <span className={`text-[12px] font-black font-mono ${isTopFrame && !frame.paused ? 'text-amber-900' : 'text-slate-600'}`}>{frame.name}</span>
                                            {frame.paused && <Pause size={12} className="text-slate-400"/>}
                                        </div>
                                        
                                        <div className="p-3 flex flex-col gap-2 min-h-[80px]">
                                            {frame.vars.map((v, vIdx) => {
                                                const isThis = v.id === "this";
                                                const varColor = isThis ? 'amber' : v.color === 'rose' ? 'rose' : v.color === 'sky' ? 'sky' : 'slate';
                                                
                                                return (
                                                <div key={vIdx} className={`relative flex flex-col border rounded-xl overflow-hidden shadow-sm transition-all duration-500 ${v.highlight ? `border-${varColor}-400 scale-[1.05] shadow-md z-10` : 'border-slate-200'}`}>
                                                    <div className={`text-[9px] font-mono font-black px-2 py-1 flex justify-between border-b ${isThis ? 'bg-amber-200 text-amber-900 border-amber-300' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                                        <span>{v.type}</span>
                                                        <span>{isThis ? <Fingerprint size={10} className="inline mr-1 -mt-0.5 text-amber-700"/> : ''}{v.id}</span>
                                                    </div>
                                                    <div className={`font-mono font-black text-center py-1.5 px-2 text-xs flex items-center justify-center gap-1 bg-${varColor}-50 text-${varColor}-700 ${isThis ? 'bg-amber-100/50' : ''}`}>
                                                        {v.isRef && <LinkIcon size={10} className="opacity-50"/>}
                                                        {v.val}
                                                    </div>
                                                </div>
                                            )})}
                                            {frame.vars.length === 0 && <div className="text-xs text-slate-400 italic text-center mt-2 font-mono">No local vars</div>}
                                        </div>
                                    </div>
                                )})}
                            </div>
                        </div>

                        {/* Arrow connector area */}
                        <div className="hidden lg:flex flex-col justify-center items-center w-6 relative">
                            {cur.frames.some(f => f.vars.some(v => v.isRef)) && <ArrowRight className="text-amber-300 animate-pulse" size={24}/>}
                        </div>

                        {/* THE HEAP (Custom Objects) */}
                        <div className="flex-[5] flex flex-col bg-amber-50/30 rounded-3xl border border-amber-100 shadow-sm relative overflow-hidden">
                            <div className="bg-amber-100/50 border-b border-amber-200/50 p-4 flex items-center justify-between relative z-10">
                                <span className="text-sm font-black text-amber-900 uppercase tracking-widest font-mono flex items-center gap-2"><Box size={16}/> The Heap</span>
                            </div>
                            
                            <div className="p-5 flex flex-wrap content-start justify-center gap-5 flex-1 overflow-y-auto z-10 relative">
                                {cur.heap.map((obj, idx) => (
                                    <div key={idx} className={`w-full max-w-[220px] relative flex flex-col rounded-2xl border-2 transition-all duration-500 animate-in zoom-in bg-white shadow-xl overflow-hidden ${obj.active ? 'border-amber-500 scale-[1.02] shadow-amber-200' : obj.highlight ? 'border-amber-400 ring-4 ring-amber-50' : 'border-amber-200'}`}>
                                        
                                        {/* Object Header */}
                                        <div className="bg-slate-800 px-4 py-3 flex justify-between items-center border-b-4 border-amber-400">
                                            <div className="flex items-center gap-1.5">
                                                <Component size={16} className="text-amber-400"/>
                                                <span className="text-[12px] font-black uppercase tracking-widest font-mono text-white">{obj.type} Obj</span>
                                            </div>
                                            <span className="px-2 py-0.5 rounded text-[9px] font-black font-mono bg-white/10 text-amber-300 border border-white/20 tracking-wider">
                                                {obj.refAddr}
                                            </span>
                                        </div>
                                        
                                        {/* Instance Variables (Fields) */}
                                        <div className="p-4 flex flex-col gap-3 bg-slate-50">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1">Instance Fields</span>
                                            
                                            {obj.fields.map((field, fIdx) => (
                                                <div key={fIdx} className={`flex justify-between items-center p-2 rounded-lg border transition-all duration-300 bg-white ${field.highlight ? 'border-amber-400 ring-2 ring-amber-100 scale-105 shadow-md' : 'border-slate-200 shadow-sm'}`}>
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-black uppercase text-slate-400 font-mono">{field.type}</span>
                                                        <span className="text-xs font-bold text-slate-700 font-mono">{field.name}</span>
                                                    </div>
                                                    <div className={`font-mono font-black text-sm px-3 py-1 rounded bg-slate-100 border ${field.val === 'null' ? 'text-rose-400 italic' : 'text-slate-800'}`}>
                                                        {field.val}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {cur.heap.length === 0 && <div className="flex items-center text-amber-300 text-xs font-mono italic uppercase tracking-widest opacity-60">Heap Empty (No Objects)</div>}
                            </div>
                        </div>

                    </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- LESSON TAB --- */}
        {activeTab === 'lesson' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 animate-in fade-in duration-500 min-h-[600px] flex flex-col items-center">
            <div className="max-w-3xl w-full">
              <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tight">
                  <Component className="text-amber-500" size={32}/> Custom Objects & Memory
              </h2>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 space-y-6">
                <p>
                  Until now, we've used built-in types like <code>int</code> and <code>String</code>. But Java allows you to create your own complex data types using <strong>Classes</strong>. A Class is just a blueprint. An Object is the actual house built from that blueprint.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-800 flex items-center gap-2 text-xl border-b pb-2"><Database className="text-amber-500"/> Instance Variables</h3>
                        <p className="text-sm">
                            When you declare variables directly inside a class (like <code>String name;</code>), they are called <strong>Instance Variables</strong>. 
                        </p>
                        <p className="text-sm font-bold bg-amber-50 p-3 rounded-lg border border-amber-100 text-amber-800">
                            Unlike local variables that live briefly on the Stack, Instance Variables live permanently *inside* the Object on the Heap. They survive as long as the object survives!
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-800 flex items-center gap-2 text-xl border-b pb-2"><Code2 className="text-rose-500"/> The 'new' Keyword</h3>
                        <p className="text-sm">
                            Writing <code>Dog myDog = new Dog();</code> does three massive things instantly:
                        </p>
                        <ul className="text-sm space-y-2 list-decimal pl-4">
                            <li><strong>Allocates</strong> a chunk of Heap memory big enough to hold all instance variables.</li>
                            <li><strong>Executes</strong> the Constructor method to fill those variables with starting values.</li>
                            <li><strong>Returns</strong> the memory address to your Stack variable.</li>
                        </ul>
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- THEORY TAB --- */}
        {activeTab === 'theory' && (
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-12">
            
            <div className="max-w-4xl space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Fingerprint className="text-sky-500"/> Demystifying 'this'
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-sky-200 pl-6">
                The <code>this</code> keyword confuses almost every beginner. But once you understand the Stack and Heap, it becomes incredibly simple. <strong><code>this</code> is just a hidden method parameter.</strong>
              </p>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden group border border-slate-800 shadow-xl">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                    <Fingerprint size={150} />
                </div>
                <div className="relative z-10 flex flex-col lg:flex-row gap-10">
                    <div className="flex-1 space-y-4">
                        <h3 className="font-black text-xl text-sky-400 tracking-tight mb-2">The Hidden Argument</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            If you have 100 <code>Dog</code> objects in the Heap, and you call <code>dog7.bark()</code>, how does the `bark()` method know to print "Dog 7 barks" instead of Dog 1's name?
                        </p>
                        <p className="text-slate-300 text-sm leading-relaxed font-bold bg-white/10 p-3 rounded border border-white/20">
                            When you write: <code>myDog.bark()</code><br/>
                            Java translates it to: <code>Dog.bark(myDog_Address)</code>
                        </p>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Java secretly passes the memory address of the specific object into the method. Inside the method, that secret address is stored in a local Stack variable named <code>this</code>.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="border border-slate-200 rounded-3xl p-6 shadow-sm bg-sky-50/30">
                    <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                        Variable Shadowing
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed mb-3">
                        Why do we write <code>this.name = name;</code> in constructors?
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        If a method parameter and an instance variable have the exact same name, the local parameter "shadows" (hides) the instance variable. Using <code>this.name</code> explicitly tells the JVM: <em>"Don't use the local variable, follow the pointer to the Heap object and use its variable!"</em>
                    </p>
                </div>
            </div>

          </div>
        )}
        
        {/* --- INTERVIEW TAB --- */}
        {activeTab === 'interview' && (
             <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-8 font-mono">
                
                <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden group border border-slate-800">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Trophy size={140} />
                    </div>
                    <h3 className="text-2xl font-black flex items-center gap-3 mb-6 text-indigo-400 relative z-10 uppercase tracking-tight">
                        <Trophy size={28} /> Static vs. Instance
                    </h3>
                    
                    <div className="relative z-10 space-y-6">
                        <div className="bg-black/40 border border-slate-700 p-5 rounded-xl text-emerald-400 text-sm shadow-inner">
                            <span className="text-slate-500 block text-xs mb-2 uppercase tracking-widest font-black">Interviewer Asks:</span>
                            "Why can't you use the <code>this</code> keyword inside a <code>static</code> method?"
                        </div>
                        <div className="border-l-4 border-indigo-500 pl-6 space-y-4">
                            <p className="text-lg text-white font-bold tracking-wide">
                                Because 'static' means it belongs to the Blueprint, not the House!
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                An <strong>Instance Method</strong> (like <code>bark()</code>) requires a specific object to exist in the Heap. You call it via an object reference (<code>myDog.bark()</code>), which populates the <code>this</code> pointer.
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                A <strong>Static Method</strong> (like <code>Math.max()</code> or <code>main()</code>) can be called directly on the Class itself, before any objects are ever created! Since there is no specific object in the Heap, there is no memory address to pass. 
                            </p>
                            <p className="text-sm text-amber-300 bg-amber-900/30 p-2 rounded inline-block font-bold">
                                Therefore, the JVM does not create a 'this' variable for static methods. It doesn't exist!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-8 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                           <Lock size={18} className="text-indigo-500"/> Encapsulation (Private)
                        </h4>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Why do we make instance variables <code>private</code> and use Getters/Setters?
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                If <code>dog.age</code> is public, any part of the program can follow the pointer to the Heap and maliciously set it to <code>-999</code>.
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Making it private locks the Heap variable. The only way to change it is by calling a Setter method, which allows the Class to validate the data (e.g., <code>if (newAge &lt; 0) reject;</code>) before updating memory.
                            </p>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-8 shadow-sm hover:border-amber-300 hover:shadow-md transition-all">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                           <Users size={18} className="text-amber-500"/> Module Complete!
                        </h4>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600 leading-relaxed font-bold">
                                Congratulations! You have completed the Java Memory Foundation Module.
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                You now understand exactly how the Stack, Heap, Pointers, Arrays, Strings, and Objects physically exist in memory. 
                            </p>
                            <p className="text-sm text-emerald-600 font-bold bg-emerald-50 p-2 rounded">
                                You are now officially ready to conquer real Data Structures and Algorithms!
                            </p>
                        </div>
                    </div>
                </div>

             </div>
        )}

      </div>
    </div>
  );
}