import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Layers, FileText, ArrowRight, 
  Database, Cpu, Box, Network, Link as LinkIcon, Info,
  Play, Pause, RefreshCw, Trash2, ShieldAlert, Zap
} from 'lucide-react';

// --- DATA & CONSTANTS ---

const CODE_STRING = `public class Main {
    public static void main(String[] args) {
        int age = 25;
        String name = "Alice";
        
        // Both point to the same object
        String copyName = name;
        
        // Reassign 'name' to a NEW object
        name = new String("Bob");
        
        // Remove the last reference to "Alice"
        copyName = null;
        
        // System.gc() - Garbage Collector runs!
    }
}`;

const STEPS = [
  {
    line: 0,
    phase: "JVM Initialization",
    desc: "The JVM invokes the main() method. An empty Stack frame is created to hold local variables. The Heap is ready for dynamic allocation.",
    stack: [],
    heap: []
  },
  {
    line: 3,
    phase: "Primitive Allocation",
    desc: "int age = 25; 'int' is a primitive. The literal value 25 is stored directly inside the variable's slot on the Stack.",
    stack: [{ id: 'age', type: 'int', val: '25', isRef: false, active: true }],
    heap: []
  },
  {
    line: 4,
    phase: "Reference & Object Creation",
    desc: "String name = \"Alice\"; The JVM creates the String object containing \"Alice\" in the Heap. The Stack variable 'name' only stores the reference address (@0x1A) pointing to it.",
    stack: [
        { id: 'age', type: 'int', val: '25', isRef: false },
        { id: 'name', type: 'String', val: '@0x1A', isRef: true, refId: 'obj1', color: 'purple', active: true }
    ],
    heap: [{ id: 'obj1', type: 'String', val: '"Alice"', refAddr: '@0x1A', color: 'purple', active: true }]
  },
  {
    line: 7,
    phase: "Copying a Reference",
    desc: "String copyName = name; We copy the reference, NOT the object! 'copyName' gets the exact same address (@0x1A). Two Stack pointers now share one Heap object.",
    stack: [
        { id: 'age', type: 'int', val: '25', isRef: false },
        { id: 'name', type: 'String', val: '@0x1A', isRef: true, refId: 'obj1', color: 'purple' },
        { id: 'copyName', type: 'String', val: '@0x1A', isRef: true, refId: 'obj1', color: 'purple', active: true }
    ],
    heap: [{ id: 'obj1', type: 'String', val: '"Alice"', refAddr: '@0x1A', color: 'purple', highlight: true }]
  },
  {
    line: 10,
    phase: "Reassignment (New Object)",
    desc: "name = new String(\"Bob\"); A NEW object is created in the Heap at @0x2B. The 'name' variable's address is updated to point to it. 'copyName' still points to the old object.",
    stack: [
        { id: 'age', type: 'int', val: '25', isRef: false },
        { id: 'name', type: 'String', val: '@0x2B', isRef: true, refId: 'obj2', color: 'blue', active: true },
        { id: 'copyName', type: 'String', val: '@0x1A', isRef: true, refId: 'obj1', color: 'purple' }
    ],
    heap: [
        { id: 'obj1', type: 'String', val: '"Alice"', refAddr: '@0x1A', color: 'purple' },
        { id: 'obj2', type: 'String', val: '"Bob"', refAddr: '@0x2B', color: 'blue', active: true }
    ]
  },
  {
    line: 13,
    phase: "Nullifying a Reference",
    desc: "copyName = null; We wipe the address from 'copyName'. Notice what happened to \"Alice\" in the Heap: ZERO stack variables are pointing to it anymore. It is now UNREACHABLE.",
    stack: [
        { id: 'age', type: 'int', val: '25', isRef: false },
        { id: 'name', type: 'String', val: '@0x2B', isRef: true, refId: 'obj2', color: 'blue' },
        { id: 'copyName', type: 'String', val: 'null', isRef: true, isNull: true, active: true }
    ],
    heap: [
        { id: 'obj1', type: 'String', val: '"Alice"', refAddr: '@0x1A', color: 'purple', isOrphaned: true },
        { id: 'obj2', type: 'String', val: '"Bob"', refAddr: '@0x2B', color: 'blue' }
    ]
  },
  {
    line: 15,
    phase: "Garbage Collection Sweep",
    desc: "The Java Garbage Collector runs periodically in the background. It finds the unreachable \"Alice\" object, destroys it, and reclaims that Heap memory for future use!",
    stack: [
        { id: 'age', type: 'int', val: '25', isRef: false },
        { id: 'name', type: 'String', val: '@0x2B', isRef: true, refId: 'obj2', color: 'blue' },
        { id: 'copyName', type: 'String', val: 'null', isRef: true, isNull: true }
    ],
    heap: [
        { id: 'obj2', type: 'String', val: '"Bob"', refAddr: '@0x2B', color: 'blue', highlight: true }
    ]
  }
];

// --- COMPONENTS ---

const TabButton = ({ active, onClick, icon, label, color = "blue" }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color?: string }) => {
    const colorMap: Record<string, string> = {
        blue: 'text-blue-600',
        purple: 'text-purple-600',
        emerald: 'text-emerald-600',
        amber: 'text-amber-600'
    };
    const activeColor = colorMap[color] || 'text-blue-600';

    return (
      <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? `bg-white ${activeColor} shadow-sm border border-slate-200 scale-105` : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
        {icon} {label}
      </button>
    );
};

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|static|class|void|int|double|String|boolean|new|null)\b|\b\d+\.?\d*\b)/g).filter(Boolean);
  
  return (
    <div className={`flex relative z-10 min-h-[22px] items-center transition-colors duration-200 ${active ? 'bg-blue-500/15' : 'hover:bg-slate-800/50'}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]`} />}
      <span className={`w-10 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-xs ${active ? `text-blue-400 font-bold` : 'text-slate-600'}`}>{num}</span>
      <pre className={`font-mono text-xs transition-opacity duration-300 ${active ? 'opacity-100 text-slate-100' : 'opacity-70 text-slate-300'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"') || part.startsWith("'")) return <span key={i} className="text-emerald-400">{part}</span>;
          if (['public', 'static', 'class', 'void', 'new'].includes(part)) return <span key={i} className="text-pink-500 font-bold">{part}</span>;
          if (['int', 'double', 'boolean'].includes(part)) return <span key={i} className="text-blue-400 font-bold">{part}</span>;
          if (part === 'String') return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (part === 'null') return <span key={i} className="text-rose-400 font-bold italic">{part}</span>;
          if (!isNaN(parseFloat(part)) && part.trim() !== '') return <span key={i} className="text-amber-400">{part}</span>;
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

  // Auto-play logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      if (currentStep < STEPS.length - 1) {
        timer = setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, 3500); // 3.5 seconds per step for reading
      } else {
        setIsPlaying(false); // Stop at the end
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep]);

  const handleNext = () => { setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1)); setIsPlaying(false); };
  const handlePrev = () => { setCurrentStep(prev => Math.max(0, prev - 1)); setIsPlaying(false); };
  const handleReset = () => { setCurrentStep(0); setIsPlaying(false); };
  const togglePlay = () => {
      if (currentStep === STEPS.length - 1) setCurrentStep(0); // Restart if at end
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
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center relative overflow-hidden group">
                <Box className="text-white relative z-10" size={28} />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">JVM Memory & GC</h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono">
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded tracking-widest uppercase border border-blue-100">Java Foundations</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase tracking-wider">Stack vs Heap</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto w-full lg:w-auto">
            <TabButton active={activeTab === 'lesson'} onClick={() => setActiveTab('lesson')} icon={<FileText size={16}/>} label="Lesson" color="blue" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Simulator" color="blue" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen size={16}/>} label="Theory" color="purple" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" color="amber" />
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
                      <Code2 size={16} className="text-blue-400" />
                      <span className="font-bold uppercase tracking-widest text-[10px] text-slate-300 font-mono">Main.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors text-slate-400">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-4 py-6 font-mono text-[13px] leading-relaxed relative overflow-auto">
                      {CODE_STRING.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} />
                      ))}
                  </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-lg border transition-all duration-300 relative overflow-hidden flex-1 flex flex-col ${cur.line === 15 ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}>
                  {cur.line === 15 && <Trash2 size={120} className="absolute -right-10 -bottom-10 text-emerald-500/10 pointer-events-none" />}
                  
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-2">
                        <Activity size={16} className={cur.line === 15 ? "text-emerald-500" : "text-blue-500"}/>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     {cur.line > 0 && (
                        <div className={`px-2.5 py-1 rounded text-[10px] font-black uppercase font-mono tracking-wider border ${cur.line === 15 ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                            Line {cur.line}
                        </div>
                     )}
                  </div>
                  <div className="text-xl font-black tracking-tight mb-3 text-slate-800 flex items-center gap-3 relative z-10">
                      {cur.phase}
                  </div>
                  <p className={`text-sm leading-relaxed border-l-4 pl-4 relative z-10 flex-1 ${cur.line === 15 ? 'text-emerald-800 border-emerald-400' : 'text-slate-600 border-blue-200'}`}>
                      {cur.desc}
                  </p>
                  
                  {/* Progress Bar inside Log */}
                  <div className="mt-6">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                          <span>Progress</span>
                          <span>{currentStep + 1} / {STEPS.length}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
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
                    <button onClick={togglePlay} className={`px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${isPlaying ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'}`}>
                      {isPlaying ? <Pause size={18}/> : <Play size={18}/>}
                    </button>
                    <button onClick={handleNext} disabled={currentStep === STEPS.length - 1} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all flex items-center justify-center gap-2">
                      Next <ChevronRight size={18}/>
                    </button>
                </div>
              </div>

              {/* Right Col: JVM Memory Arena (7/12) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 md:p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner h-full min-h-[600px]">
                    
                    {/* Arena Header */}
                    <div className="flex flex-wrap items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 font-mono uppercase tracking-tight">
                            <Database size={20} className="text-blue-500"/> JVM Memory Allocation
                        </h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono"><div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div> Primitive</div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-600 uppercase tracking-widest font-mono"><div className="w-2.5 h-2.5 rounded-full bg-purple-400"></div> Ref 1</div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 uppercase tracking-widest font-mono"><div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div> Ref 2</div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row flex-1 gap-8 relative">
                        
                        {/* THE STACK */}
                        <div className="flex-[4] flex flex-col bg-slate-50 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="bg-slate-100 border-b border-slate-200 p-4 flex items-center justify-between relative z-10">
                                <span className="text-sm font-black text-slate-700 uppercase tracking-widest font-mono flex items-center gap-2"><Layers size={16}/> The Stack</span>
                                <Info size={14} className="text-slate-400 cursor-help" title="Local variables and references. Cleared when method ends."/>
                            </div>
                            
                            <div className="p-4 flex flex-col-reverse justify-start gap-3 flex-1 overflow-y-auto z-10">
                                {/* Simulated Stack Frame container */}
                                {cur.stack.length > 0 && (
                                    <div className="border border-slate-200 rounded-2xl p-2 pb-3 bg-white/50 relative mt-4">
                                        <div className="absolute -top-3 left-3 bg-slate-100 px-2 text-[9px] font-black uppercase text-slate-400 tracking-widest font-mono rounded border border-slate-200">main() frame</div>
                                        
                                        <div className="flex flex-col-reverse gap-2 mt-2">
                                            {cur.stack.map((item, idx) => {
                                                const colorClasses = item.color === 'purple' ? 'border-purple-300 text-purple-700 bg-purple-50' : item.color === 'blue' ? 'border-blue-300 text-blue-700 bg-blue-50' : 'border-slate-300 text-slate-700 bg-slate-50';
                                                
                                                return (
                                                <div key={idx} className={`relative flex items-center p-3 rounded-xl border-2 transition-all duration-500 animate-in slide-in-from-bottom-4 shadow-sm ${item.active ? 'bg-white border-slate-800 scale-[1.02] shadow-md z-20' : item.highlight ? 'bg-blue-50/50 border-blue-300' : 'bg-white border-slate-200'}`}>
                                                    
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className={`text-[9px] font-black uppercase tracking-widest font-mono text-slate-500`}>{item.type}</span>
                                                        </div>
                                                        <div className="font-mono font-bold flex flex-wrap items-center gap-2">
                                                            <span className="text-slate-800 text-sm">{item.id}</span>
                                                            <span className="text-slate-300 text-xs">=</span>
                                                            
                                                            {item.isNull ? (
                                                                <span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded text-xs border border-rose-200 font-bold italic">null</span>
                                                            ) : item.isRef ? (
                                                                <span className={`px-2 py-0.5 rounded text-xs border flex items-center gap-1 ${colorClasses}`}>
                                                                    <LinkIcon size={10}/> {item.val}
                                                                </span>
                                                            ) : (
                                                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs border border-slate-200">
                                                                    {item.val}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Pointer dashed line */}
                                                    {item.isRef && !item.isNull && (
                                                        <div className={`hidden lg:block absolute -right-6 top-1/2 w-6 border-t-2 border-dashed ${item.active ? 'border-slate-800' : item.color === 'purple' ? 'border-purple-300' : 'border-blue-300'}`}></div>
                                                    )}
                                                </div>
                                            )})}
                                        </div>
                                    </div>
                                )}
                                {cur.stack.length === 0 && (
                                    <div className="flex-1 flex items-center justify-center text-slate-400 text-xs font-mono italic uppercase tracking-widest opacity-60">Stack empty</div>
                                )}
                            </div>
                        </div>

                        {/* Arrow connector area */}
                        <div className="hidden lg:flex flex-col justify-center items-center w-8 relative">
                            {cur.stack.some(s => s.isRef && !s.isNull) && (
                                <ArrowRight className="text-slate-300 animate-pulse" size={24}/>
                            )}
                        </div>

                        {/* THE HEAP */}
                        <div className="flex-[5] flex flex-col bg-indigo-50/30 rounded-3xl border border-indigo-100 shadow-sm relative overflow-hidden">
                            <div className="bg-indigo-100/50 border-b border-indigo-200/50 p-4 flex items-center justify-between relative z-10">
                                <span className="text-sm font-black text-indigo-900 uppercase tracking-widest font-mono flex items-center gap-2"><Box size={16}/> The Heap</span>
                                <Info size={14} className="text-indigo-400 cursor-help" title="Dynamic memory. Objects live here until Garbage Collected."/>
                            </div>
                            
                            <div className="p-5 flex flex-wrap content-start gap-5 flex-1 overflow-y-auto z-10 relative">
                                {cur.heap.map((obj, idx) => {
                                    const headerColor = obj.color === 'purple' ? 'text-purple-700 bg-purple-100 border-purple-200' : 'text-blue-700 bg-blue-100 border-blue-200';
                                    const borderColor = obj.color === 'purple' ? 'border-purple-300' : 'border-blue-300';
                                    const activeBorder = obj.active ? 'border-slate-800 shadow-xl scale-[1.02]' : obj.highlight ? 'border-indigo-400 shadow-md bg-indigo-50/50' : borderColor;
                                    
                                    // Garbage collection specific styles
                                    const isOrphaned = obj.isOrphaned;
                                    const orphanStyles = isOrphaned ? 'border-rose-300 bg-rose-50 grayscale-[50%] opacity-80 animate-pulse' : '';

                                    return (
                                    <div key={idx} className={`w-full relative flex flex-col p-4 rounded-2xl border-2 transition-all duration-500 animate-in zoom-in bg-white shadow-sm ${activeBorder} ${orphanStyles}`}>
                                        
                                        {/* Status Icon */}
                                        {isOrphaned && (
                                            <div className="absolute -top-3 -right-3 bg-rose-500 text-white p-1.5 rounded-full shadow-lg z-20 tooltip" title="Unreachable! Ready for GC">
                                                <Trash2 size={14} />
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-3">
                                            <div className="flex items-center gap-2">
                                                <Box size={16} className={isOrphaned ? 'text-rose-400' : 'text-slate-400'}/>
                                                <span className={`text-[10px] font-black uppercase tracking-widest font-mono ${isOrphaned ? 'text-rose-600 line-through' : 'text-slate-700'}`}>Object ({obj.type})</span>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded text-[10px] font-black font-mono border tracking-wider ${headerColor} ${isOrphaned ? 'opacity-50' : ''}`}>
                                                ADDR: {obj.refAddr}
                                            </span>
                                        </div>
                                        
                                        <div className={`font-mono text-center py-3 rounded-xl border font-bold text-lg shadow-inner ${isOrphaned ? 'bg-rose-100/50 border-rose-200 text-rose-800/60' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                                            {obj.val}
                                        </div>

                                        {isOrphaned && (
                                            <div className="mt-3 text-center text-[10px] font-black uppercase text-rose-500 tracking-widest bg-rose-100 rounded py-1">
                                                Orphaned / Unreachable
                                            </div>
                                        )}
                                    </div>
                                )})}
                                {cur.heap.length === 0 && (
                                    <div className="flex-1 flex items-center justify-center text-indigo-300 text-xs font-mono italic uppercase tracking-widest opacity-60">Heap empty</div>
                                )}
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
                  <FileText className="text-blue-600" size={32}/> Variables & Containers
              </h2>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 space-y-6">
                <p>
                  In Java, data doesn't float around randomly. It must be stored in a <strong>variable</strong>. Think of a variable as a labeled container. Because Java is a <em>statically typed</em> language, you must explicitly tell Java exactly what size and shape of box you need before you put anything inside.
                </p>

                <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1 font-mono font-bold text-center md:text-left text-blue-900">
                        <span className="text-pink-600">DataType</span> <span className="text-slate-700">variableName</span> = <span className="text-emerald-600">value</span>;
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-sm flex-1">
                        Must specify the type (e.g., <code>int</code>) first, give it a unique name, and assign it a matching value.
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-800 flex items-center gap-2 text-xl border-b pb-2"><Cpu size={24} className="text-slate-400"/> Primitive Types</h3>
                        <p className="text-sm">The simplest forms of data. They store actual values directly inside the variable box itself.</p>
                        <ul className="space-y-2 text-sm font-mono text-slate-700">
                            <li className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 shadow-sm"><span className="text-blue-600 font-bold">int</span> score = 100;</li>
                            <li className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 shadow-sm"><span className="text-blue-600 font-bold">double</span> price = 19.99;</li>
                            <li className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 shadow-sm"><span className="text-blue-600 font-bold">boolean</span> isTrue = false;</li>
                            <li className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 shadow-sm"><span className="text-blue-600 font-bold">char</span> grade = 'A';</li>
                        </ul>
                    </div>
                    
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-800 flex items-center gap-2 text-xl border-b pb-2"><Network size={24} className="text-purple-500"/> Reference Types</h3>
                        <p className="text-sm">Complex objects. The variable box doesn't hold the object; it holds a <em>memory address</em> pointing to the object.</p>
                        <ul className="space-y-2 text-sm font-mono text-slate-700">
                            <li className="bg-purple-50/50 px-3 py-2 rounded-lg border border-purple-100 shadow-sm"><span className="text-purple-600 font-bold">String</span> name = "Java";</li>
                            <li className="bg-purple-50/50 px-3 py-2 rounded-lg border border-purple-100 shadow-sm"><span className="text-purple-600 font-bold">Scanner</span> scan = new Scanner();</li>
                            <li className="bg-purple-50/50 px-3 py-2 rounded-lg border border-purple-100 shadow-sm"><span className="text-purple-600 font-bold">int[]</span> numbers = {'{'}1, 2{'}'};</li>
                        </ul>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Clue: Starts with a Capital Letter</div>
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
                <BookOpen className="text-purple-600"/> Stack vs. Heap Memory
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-purple-200 pl-6">
                Understanding where Java puts your data is the key to mastering the language. It controls performance, memory leaks, and how data is passed between methods.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Primitive Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-300 transition-colors">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                        <Layers size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-white p-2.5 rounded-xl text-blue-600 shadow-sm border border-slate-100"><Layers size={24}/></div>
                            <h3 className="font-black text-xl text-slate-800 tracking-tight">The Stack</h3>
                        </div>
                        <ul className="space-y-4 text-slate-600 text-sm leading-relaxed">
                            <li className="flex items-start gap-3">
                                <ArrowRight size={16} className="shrink-0 mt-0.5 text-blue-400"/>
                                <span><strong>Execution Focused:</strong> Holds method frames, local primitive variables, and references (pointers).</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <ArrowRight size={16} className="shrink-0 mt-0.5 text-blue-400"/>
                                <span><strong>LIFO Structure:</strong> Last-In, First-Out. When a method finishes, its entire stack frame is instantly popped and destroyed.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <ArrowRight size={16} className="shrink-0 mt-0.5 text-blue-400"/>
                                <span><strong>Fast & Tiny:</strong> Memory allocation is extremely fast, but the overall size of the Stack is small (can cause `StackOverflowError`).</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Reference Card */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 relative overflow-hidden group hover:border-indigo-300 transition-colors">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                        <Box size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-white p-2.5 rounded-xl text-indigo-600 shadow-sm border border-indigo-50"><Box size={24}/></div>
                            <h3 className="font-black text-xl text-indigo-900 tracking-tight">The Heap</h3>
                        </div>
                        <ul className="space-y-4 text-indigo-800 text-sm leading-relaxed">
                            <li className="flex items-start gap-3">
                                <ArrowRight size={16} className="shrink-0 mt-0.5 text-indigo-400"/>
                                <span><strong>Object Storage:</strong> Stores all dynamically allocated Objects and Arrays created with the <code>new</code> keyword.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <ArrowRight size={16} className="shrink-0 mt-0.5 text-indigo-400"/>
                                <span><strong>Global Access:</strong> Objects here can be accessed from anywhere in the application, provided you have a valid reference to them.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <ArrowRight size={16} className="shrink-0 mt-0.5 text-indigo-400"/>
                                <span><strong>Garbage Collected:</strong> Memory is managed automatically. If an object loses all its pointers, it is flagged for deletion.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* GC Highlight */}
            <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Trash2 size={200}/>
                </div>
                <div className="flex-1 space-y-4 relative z-10">
                    <h4 className="font-black text-emerald-400 uppercase tracking-widest text-sm flex items-center gap-2">
                        <ShieldAlert size={18}/> The Garbage Collector (GC)
                    </h4>
                    <p className="text-emerald-50 text-sm leading-relaxed">
                        In older languages like C or C++, programmers must manually allocate and free memory. If they forget, it causes a "memory leak" and the program crashes.
                    </p>
                    <p className="text-emerald-50 text-sm leading-relaxed font-bold">
                        Java handles this automatically. The JVM runs a background thread called the Garbage Collector. It constantly sweeps the Heap, looking for objects that no longer have any active references pointing to them from the Stack. If an object is "unreachable", the GC destroys it and frees the memory.
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
                    <h3 className="text-2xl font-black flex items-center gap-3 mb-6 text-amber-400 relative z-10 uppercase tracking-tight">
                        <Trophy size={28} /> The Ultimate Trick Question
                    </h3>
                    
                    <div className="relative z-10 space-y-6">
                        <div className="bg-black/40 border border-slate-700 p-5 rounded-xl text-emerald-400 text-sm shadow-inner">
                            <span className="text-slate-500 block text-xs mb-2 uppercase tracking-widest font-black">Interviewer asks:</span>
                            "Is Java Pass-by-Value or Pass-by-Reference?"
                        </div>
                        <div className="border-l-4 border-amber-500 pl-6 space-y-4">
                            <p className="text-lg text-white font-bold tracking-wide uppercase">
                                Java is strictly PASS-BY-VALUE. Always. 
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                This is confusing because of Objects. When you pass a primitive (like int), the exact number is copied. When you pass an Object to a method, the <em>value</em> that gets copied is the <strong>reference</strong> (the memory address).
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Because the method receives a copy of the address, it can use that address to mutate the original object in the Heap. BUT, if you reassign the variable inside the method to <code>new Object()</code>, you are only changing the local copied address. The original variable outside the method still points to the old object.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-8 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                           <Layers size={18} className="text-blue-500"/> Wrapper Classes
                        </h4>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Primitives are fast but they aren't Objects. Data structures like <code>ArrayList</code> can <em>only</em> store Objects. To fix this, Java provides "Wrapper Classes" to wrap primitives in a Heap Object.
                            </p>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-700 font-bold space-y-2 font-sans">
                                <div className="flex justify-between"><code>int</code> <span>➔</span> <code>Integer</code></div>
                                <div className="flex justify-between"><code>double</code> <span>➔</span> <code>Double</code></div>
                                <div className="flex justify-between"><code>char</code> <span>➔</span> <code>Character</code></div>
                            </div>
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest bg-slate-100 inline-block px-2 py-1 rounded">Autoboxing handles conversion automatically.</p>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-8 shadow-sm hover:border-purple-300 hover:shadow-md transition-all">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                           <Box size={18} className="text-purple-500"/> The String Pool
                        </h4>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Strings are so common that Java optimizes them. Instead of throwing every String randomly in the Heap, Java uses a special, separate area called the <strong>String Pool</strong>.
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                If you declare <code>String a = "Cat"</code> and <code>String b = "Cat"</code>, Java doesn't create two objects. It creates "Cat" once in the pool, and both variables point to the same reference to save memory.
                            </p>
                            <div className="bg-amber-50 text-amber-800 p-3 rounded-xl border border-amber-200 text-xs font-bold leading-relaxed">
                                Tip: Using <code>new String("Cat")</code> bypasses the pool and forces a completely new, redundant object creation in standard Heap space.
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        )}

      </div>
    </div>
  );
}