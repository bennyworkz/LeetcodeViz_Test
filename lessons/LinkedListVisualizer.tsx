import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Layers, FileText, ArrowRight, 
  Database, Box, Link as LinkIcon, Info,
  Play, Pause, RefreshCw, GitCommit, GitPullRequest, FastForward, Navigation
} from 'lucide-react';

// --- DATA & CONSTANTS ---

const CODE_STRING = `class Node {
    int val;
    Node next;
    Node(int val) { this.val = val; }
}

public class Main {
    public static void main(String[] args) {
        // 1. Create the Head Node
        Node head = new Node(10);
        
        // 2. Link a second Node directly
        head.next = new Node(20);
        
        // 3. Create a detached Node
        Node temp = new Node(30);
        
        // 4. Link the detached Node to the chain
        head.next.next = temp;
        
        // 5. Traversal Pointers
        Node curr = head;
        curr = curr.next; // Move forward
    }
}`;

const STEPS = [
  {
    line: 0,
    phase: "JVM Initialization",
    desc: "Program begins. Stack and Heap are ready. No nodes exist yet.",
    stack: [],
    heap: []
  },
  {
    line: 10,
    phase: "Head Node Creation",
    desc: "Node head = new Node(10); The JVM creates a Node object in the Heap. 'val' is 10, 'next' defaults to null. The Stack variable 'head' holds its address (@0x1A).",
    stack: [{ id: 'head', type: 'Node', val: '@0x1A', isRef: true, color: 'emerald', active: true }],
    heap: [{ id: 'node1', type: 'Node', val: 10, nextAddr: 'null', refAddr: '@0x1A', color: 'emerald', active: true }]
  },
  {
    line: 13,
    phase: "Linking Node 2",
    desc: "head.next = new Node(20); A new Node is created at @0x2B. We go to the object 'head' points to, and update its 'next' pointer to hold @0x2B. They are now linked!",
    stack: [{ id: 'head', type: 'Node', val: '@0x1A', isRef: true, color: 'emerald' }],
    heap: [
        { id: 'node1', type: 'Node', val: 10, nextAddr: '@0x2B', refAddr: '@0x1A', color: 'emerald', highlightNext: true },
        { id: 'node2', type: 'Node', val: 20, nextAddr: 'null', refAddr: '@0x2B', color: 'teal', active: true }
    ]
  },
  {
    line: 16,
    phase: "Detached Node Creation",
    desc: "Node temp = new Node(30); We create a 3rd Node at @0x3C and point a new Stack variable 'temp' to it. It is currently completely disconnected from our main list.",
    stack: [
        { id: 'head', type: 'Node', val: '@0x1A', isRef: true, color: 'emerald' },
        { id: 'temp', type: 'Node', val: '@0x3C', isRef: true, color: 'amber', active: true }
    ],
    heap: [
        { id: 'node1', type: 'Node', val: 10, nextAddr: '@0x2B', refAddr: '@0x1A', color: 'emerald' },
        { id: 'node2', type: 'Node', val: 20, nextAddr: 'null', refAddr: '@0x2B', color: 'teal' },
        { id: 'node3', type: 'Node', val: 30, nextAddr: 'null', refAddr: '@0x3C', color: 'amber', active: true }
    ]
  },
  {
    line: 19,
    phase: "Chaining the Detached Node",
    desc: "head.next.next = temp; JVM evaluates left-to-right: go to head (@0x1A), read its next (@0x2B), go to THAT node, and set ITS next to temp's address (@0x3C).",
    stack: [
        { id: 'head', type: 'Node', val: '@0x1A', isRef: true, color: 'emerald' },
        { id: 'temp', type: 'Node', val: '@0x3C', isRef: true, color: 'amber' }
    ],
    heap: [
        { id: 'node1', type: 'Node', val: 10, nextAddr: '@0x2B', refAddr: '@0x1A', color: 'emerald' },
        { id: 'node2', type: 'Node', val: 20, nextAddr: '@0x3C', refAddr: '@0x2B', color: 'teal', highlightNext: true },
        { id: 'node3', type: 'Node', val: 30, nextAddr: 'null', refAddr: '@0x3C', color: 'amber' }
    ]
  },
  {
    line: 22,
    phase: "Traversal Pointer Setup",
    desc: "Node curr = head; We create a 'curr' pointer. We do NOT copy the list! We just copy the reference @0x1A. 'curr' now points to the same first node as 'head'.",
    stack: [
        { id: 'head', type: 'Node', val: '@0x1A', isRef: true, color: 'emerald' },
        { id: 'temp', type: 'Node', val: '@0x3C', isRef: true, color: 'amber' },
        { id: 'curr', type: 'Node', val: '@0x1A', isRef: true, color: 'emerald', active: true }
    ],
    heap: [
        { id: 'node1', type: 'Node', val: 10, nextAddr: '@0x2B', refAddr: '@0x1A', color: 'emerald', highlight: true },
        { id: 'node2', type: 'Node', val: 20, nextAddr: '@0x3C', refAddr: '@0x2B', color: 'teal' },
        { id: 'node3', type: 'Node', val: 30, nextAddr: 'null', refAddr: '@0x3C', color: 'amber' }
    ]
  },
  {
    line: 23,
    phase: "Moving the Pointer",
    desc: "curr = curr.next; We look inside the Node that 'curr' currently points to, read its 'next' value (@0x2B), and update 'curr' to that address. We moved forward!",
    stack: [
        { id: 'head', type: 'Node', val: '@0x1A', isRef: true, color: 'emerald' },
        { id: 'temp', type: 'Node', val: '@0x3C', isRef: true, color: 'amber' },
        { id: 'curr', type: 'Node', val: '@0x2B', isRef: true, color: 'teal', active: true }
    ],
    heap: [
        { id: 'node1', type: 'Node', val: 10, nextAddr: '@0x2B', refAddr: '@0x1A', color: 'emerald' },
        { id: 'node2', type: 'Node', val: 20, nextAddr: '@0x3C', refAddr: '@0x2B', color: 'teal', highlight: true },
        { id: 'node3', type: 'Node', val: 30, nextAddr: 'null', refAddr: '@0x3C', color: 'amber' }
    ]
  }
];

// --- COMPONENTS ---

const TabButton = ({ active, onClick, icon, label, color = "emerald" }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color?: string }) => {
    const colorMap: Record<string, string> = {
        emerald: 'text-emerald-600',
        teal: 'text-teal-600',
        amber: 'text-amber-600',
        blue: 'text-blue-600'
    };
    const activeColor = colorMap[color] || 'text-emerald-600';

    return (
      <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? `bg-white ${activeColor} shadow-sm border border-slate-200 scale-105` : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
        {icon} {label}
      </button>
    );
};

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\b(?:public|static|class|void|int|new|Node|null)\b|\b\d+\b)/g).filter(Boolean);
  
  return (
    <div className={`flex relative z-10 min-h-[22px] items-center transition-colors duration-200 ${active ? 'bg-emerald-500/15' : 'hover:bg-slate-800/50'}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]`} />}
      <span className={`w-10 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-xs ${active ? `text-emerald-400 font-bold` : 'text-slate-600'}`}>{num}</span>
      <pre className={`font-mono text-xs transition-opacity duration-300 ${active ? 'opacity-100 text-slate-100' : 'opacity-70 text-slate-300'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (['public', 'static', 'class', 'void', 'new'].includes(part)) return <span key={i} className="text-pink-500 font-bold">{part}</span>;
          if (part === 'int') return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (part === 'Node') return <span key={i} className="text-amber-300 font-bold">{part}</span>;
          if (part === 'null') return <span key={i} className="text-rose-400 font-bold italic">{part}</span>;
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
        timer = setTimeout(() => { setCurrentStep(prev => prev + 1); }, 3500);
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
            <div className="bg-gradient-to-br from-emerald-500 to-teal-700 p-4 rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center relative overflow-hidden group">
                <GitCommit className="text-white relative z-10" size={28} />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Linked Lists</h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono">
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded tracking-widest uppercase border border-emerald-100">Java DSA Basics</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase tracking-wider">Dynamic Nodes</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto w-full lg:w-auto">
            <TabButton active={activeTab === 'lesson'} onClick={() => setActiveTab('lesson')} icon={<FileText size={16}/>} label="Lesson" color="emerald" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Simulator" color="emerald" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen size={16}/>} label="Theory" color="teal" />
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
                      <Code2 size={16} className="text-emerald-400" />
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
                <div className={`rounded-3xl p-7 shadow-lg border transition-all duration-300 relative overflow-hidden flex-1 flex flex-col bg-white border-slate-200`}>
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-2">
                        <Activity size={16} className="text-emerald-500"/>
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
                  <p className="text-sm leading-relaxed border-l-4 pl-4 relative z-10 flex-1 text-slate-600 border-emerald-300">
                      {cur.desc}
                  </p>
                  
                  {/* Progress Bar inside Log */}
                  <div className="mt-6">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                          <span>Progress</span>
                          <span>{currentStep + 1} / {STEPS.length}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-600 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
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
                    <button onClick={togglePlay} className={`px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${isPlaying ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200'}`}>
                      {isPlaying ? <Pause size={18}/> : <Play size={18}/>}
                    </button>
                    <button onClick={handleNext} disabled={currentStep === STEPS.length - 1} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
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
                            <Database size={20} className="text-emerald-500"/> Node Allocation & Pointers
                        </h3>
                    </div>

                    <div className="flex flex-col md:flex-row flex-1 gap-8 relative">
                        
                        {/* THE STACK */}
                        <div className="flex-[3] flex flex-col bg-slate-50 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="bg-slate-100 border-b border-slate-200 p-4 flex items-center justify-between relative z-10">
                                <span className="text-sm font-black text-slate-700 uppercase tracking-widest font-mono flex items-center gap-2"><Layers size={16}/> Stack (Vars)</span>
                            </div>
                            
                            <div className="p-4 flex flex-col-reverse justify-start gap-3 flex-1 overflow-y-auto z-10">
                                {cur.stack.length > 0 && (
                                    <div className="border border-slate-200 rounded-2xl p-2 pb-3 bg-white/50 relative mt-4">
                                        <div className="absolute -top-3 left-3 bg-slate-100 px-2 text-[9px] font-black uppercase text-slate-400 tracking-widest font-mono rounded border border-slate-200">main() variables</div>
                                        
                                        <div className="flex flex-col-reverse gap-2 mt-2">
                                            {cur.stack.map((item, idx) => {
                                                const colorClasses = item.color === 'emerald' ? 'border-emerald-300 text-emerald-700 bg-emerald-50' : item.color === 'teal' ? 'border-teal-300 text-teal-700 bg-teal-50' : 'border-amber-300 text-amber-700 bg-amber-50';
                                                
                                                return (
                                                <div key={idx} className={`relative flex items-center p-3 rounded-xl border-2 transition-all duration-500 animate-in slide-in-from-bottom-4 shadow-sm ${item.active ? 'bg-white border-slate-800 scale-[1.02] shadow-md z-20' : 'bg-white border-slate-200'}`}>
                                                    
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className={`text-[9px] font-black uppercase tracking-widest font-mono text-slate-500`}>{item.type} Reference</span>
                                                        </div>
                                                        <div className="font-mono font-bold flex flex-wrap items-center gap-2">
                                                            <span className="text-slate-800 text-sm">{item.id}</span>
                                                            <span className="text-slate-300 text-xs">=</span>
                                                            <span className={`px-2 py-0.5 rounded text-xs border flex items-center gap-1 ${colorClasses}`}>
                                                                <LinkIcon size={10}/> {item.val}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Pointer dashed line */}
                                                    {item.isRef && (
                                                        <div className={`hidden lg:block absolute -right-6 top-1/2 w-6 border-t-2 border-dashed ${item.active ? 'border-slate-800' : 'border-slate-300'}`}></div>
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
                            {cur.stack.length > 0 && (
                                <ArrowRight className="text-emerald-300 animate-pulse" size={24}/>
                            )}
                        </div>

                        {/* THE HEAP (Linked List Specific UI) */}
                        <div className="flex-[6] flex flex-col bg-emerald-50/30 rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden">
                            <div className="bg-emerald-100/50 border-b border-emerald-200/50 p-4 flex items-center justify-between relative z-10">
                                <span className="text-sm font-black text-emerald-900 uppercase tracking-widest font-mono flex items-center gap-2"><Box size={16}/> Heap (Scattered Nodes)</span>
                            </div>
                            
                            <div className="p-5 flex flex-wrap content-start gap-5 flex-1 overflow-y-auto z-10 relative">
                                {cur.heap.map((obj, idx) => {
                                    const headerColor = obj.color === 'emerald' ? 'text-emerald-700 bg-emerald-100 border-emerald-200' : obj.color === 'teal' ? 'text-teal-700 bg-teal-100 border-teal-200' : 'text-amber-700 bg-amber-100 border-amber-200';
                                    const borderColor = obj.color === 'emerald' ? 'border-emerald-300' : obj.color === 'teal' ? 'border-teal-300' : 'border-amber-300';
                                    
                                    return (
                                    <div key={idx} className={`w-full lg:w-44 shrink-0 relative flex flex-col rounded-2xl border-2 transition-all duration-500 animate-in zoom-in bg-white shadow-sm overflow-hidden ${obj.active ? 'border-slate-800 shadow-xl scale-[1.05] z-20' : obj.highlight ? 'border-emerald-500 shadow-md ring-4 ring-emerald-50' : borderColor}`}>
                                        
                                        <div className="flex justify-between items-center bg-slate-50 border-b border-slate-100 px-3 py-2">
                                            <div className="flex items-center gap-1.5">
                                                <GitCommit size={14} className="text-slate-400"/>
                                                <span className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-500">Object</span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black font-mono border tracking-wider ${headerColor}`}>
                                                {obj.refAddr}
                                            </span>
                                        </div>
                                        
                                        {/* NODE RENDERER (Value | Next) */}
                                        <div className="flex flex-col p-4 bg-white">
                                            <div className="flex border-2 border-slate-200 rounded-lg overflow-hidden divide-x-2 divide-slate-200">
                                                {/* Value Compartment */}
                                                <div className="flex-1 flex flex-col items-center justify-center p-2 bg-slate-50">
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">val</span>
                                                    <span className="font-mono font-black text-xl text-slate-800">{obj.val}</span>
                                                </div>
                                                {/* Next Compartment */}
                                                <div className={`flex-1 flex flex-col items-center justify-center p-2 transition-colors duration-300 ${obj.highlightNext ? 'bg-emerald-100' : 'bg-white'}`}>
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">next</span>
                                                    <span className={`font-mono font-bold text-xs ${obj.nextAddr === 'null' ? 'text-rose-400 italic' : 'text-emerald-600'}`}>
                                                        {obj.nextAddr}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {/* Visual pointer out of 'next' */}
                                            {obj.nextAddr !== 'null' && (
                                                <div className="mt-3 flex justify-center text-emerald-400 animate-pulse">
                                                    <ArrowRight size={20} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )})}
                                {cur.heap.length === 0 && (
                                    <div className="flex-1 flex items-center justify-center text-emerald-300 text-xs font-mono italic uppercase tracking-widest opacity-60">Heap empty</div>
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
                  <GitCommit className="text-emerald-500" size={32}/> Linked Lists: Breaking the Blocks
              </h2>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 space-y-6">
                <p>
                  Arrays are great, but their <strong>fixed size</strong> and <strong>contiguous memory</strong> requirement can be limiting. What if you don't know how much data you'll have? What if there's no single chunk of memory big enough for a massive array?
                </p>

                <p>
                  Enter the <strong>Linked List</strong>. Instead of one giant block, we create tiny individual objects called <strong>Nodes</strong>. Each Node holds its data, plus a <em>reference pointer</em> to the memory address of the next Node in the sequence.
                </p>

                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex flex-col">
                    <div className="font-mono font-bold text-sm text-slate-800 space-y-1">
                        <div><span className="text-pink-600">class</span> <span className="text-amber-600">Node</span> {'{'}</div>
                        <div className="pl-4"><span className="text-sky-600">int</span> val; <span className="text-slate-400 italic">// The data</span></div>
                        <div className="pl-4"><span className="text-amber-600">Node</span> next; <span className="text-slate-400 italic">// The pointer to the next Node</span></div>
                        <div>{'}'}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-800 flex items-center gap-2 text-xl border-b pb-2">Scattered Memory</h3>
                        <p className="text-sm">
                            Unlike Arrays, Nodes do not sit next to each other in memory. The first Node might be at <code>@0x11</code>, the second at <code>@0x99</code>, and the third at <code>@0x42</code>. The computer knows the order solely by following the <code>next</code> pointers, like a treasure hunt.
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-800 flex items-center gap-2 text-xl border-b pb-2">The "Head"</h3>
                        <p className="text-sm">
                            Because the objects are scattered, you can't just access <code>list[5]</code>. You must keep a variable pointing to the very first node (the <strong>Head</strong>). To find the 5th element, you start at the Head and follow the pointers 4 times. If you lose the Head reference, the Garbage Collector will destroy your entire list!
                        </p>
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
                <GitPullRequest className="text-teal-600"/> Arrays vs Linked Lists
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-teal-200 pl-6">
                Choosing between an Array and a Linked List is the most fundamental design decision in programming. They have exact opposite strengths.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Linked List Pros */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="font-black text-xl text-emerald-900 tracking-tight mb-4 flex items-center gap-2">
                            <Check className="text-emerald-500" /> Linked List Superpowers
                        </h3>
                        <ul className="space-y-4 text-emerald-800 text-sm leading-relaxed">
                            <li className="flex items-start gap-3">
                                <span className="font-black bg-emerald-200 text-emerald-800 px-2 rounded mt-0.5">O(1)</span>
                                <span><strong>Instant Insertion/Deletion:</strong> If you are already at a specific node, inserting a new node right after it is instant. You just change two <code>next</code> pointers. Arrays require shifting everything.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="font-black bg-emerald-200 text-emerald-800 px-2 rounded mt-0.5">Dyn</span>
                                <span><strong>Dynamic Size:</strong> It can grow infinitely as long as your computer has RAM. You never need to "resize" it.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Array Pros */}
                <div className="bg-sky-50 border border-sky-100 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="font-black text-xl text-sky-900 tracking-tight mb-4 flex items-center gap-2">
                            <Check className="text-sky-500" /> Array Superpowers
                        </h3>
                        <ul className="space-y-4 text-sky-800 text-sm leading-relaxed">
                            <li className="flex items-start gap-3">
                                <span className="font-black bg-sky-200 text-sky-800 px-2 rounded mt-0.5">O(1)</span>
                                <span><strong>Instant Random Access:</strong> You can instantly ask for <code>arr[1000]</code> because of contiguous memory math. A linked list forces you to start at 0 and walk 1000 steps to get there (O(N)).</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="font-black bg-sky-200 text-sky-800 px-2 rounded mt-0.5">Mem</span>
                                <span><strong>Memory Efficient:</strong> Arrays only store the data. Linked Lists waste extra memory because every single item also has to store a memory address (the <code>next</code> pointer).</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
                <Navigation size={64} className="text-teal-500 mb-4 opacity-50" />
                <h3 className="text-xl font-black mb-2">The Pointer Traversal Loop</h3>
                <p className="text-slate-400 text-sm max-w-lg mb-6">
                    Because you can't use an index like <code>i</code>, this `while` loop is the most important piece of code you will write for Linked Lists. It stops when the pointer falls off the end of the list into <code>null</code>.
                </p>
                <div className="bg-black/50 p-4 rounded-xl border border-slate-700 font-mono text-sm text-left inline-block w-full max-w-md">
                    <span className="text-amber-400">Node</span> curr = head;<br/>
                    <span className="text-pink-500">while</span> (curr != <span className="text-rose-400">null</span>) {'{'}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;System.out.println(curr.val);<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;curr = curr.next; <span className="text-slate-500 italic">// Move forward</span><br/>
                    {'}'}
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
                        <Trophy size={28} /> NullPointerException
                    </h3>
                    
                    <div className="relative z-10 space-y-6">
                        <div className="bg-black/40 border border-slate-700 p-5 rounded-xl text-emerald-400 text-sm shadow-inner">
                            <span className="text-slate-500 block text-xs mb-2 uppercase tracking-widest font-black">The Silent Killer:</span>
                            The most common bug candidates hit during interviews when coding Linked Lists.
                        </div>
                        <div className="border-l-4 border-rose-500 pl-6 space-y-4">
                            <p className="text-sm text-slate-300 leading-relaxed">
                                A <code>NullPointerException</code> happens when you try to access properties (like <code>.val</code> or <code>.next</code>) on a variable that is currently pointing to <code>null</code>. 
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                If <code>curr</code> is sitting on the very last node of the list, <code>curr.next</code> is <code>null</code>. If you do <code>curr = curr.next;</code>, <code>curr</code> becomes <code>null</code>. If your code then tries to check <code>curr.next</code> on the next iteration of a loop, the program crashes immediately.
                            </p>
                            <p className="text-sm text-amber-300 font-bold leading-relaxed bg-amber-900/30 p-2 rounded inline-block">
                                Always check `if (curr == null)` before trying to read `curr.val` or `curr.next`.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-8 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                           <FastForward size={18} className="text-emerald-500"/> The "Runner" Technique
                        </h4>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                A classic interview pattern. How do you find the middle of a Linked List in one pass?
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                <strong>Fast & Slow Pointers:</strong> You create two pointers at the head. The slow pointer moves 1 step (<code>slow = slow.next</code>). The fast pointer moves 2 steps (<code>fast = fast.next.next</code>). 
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed font-bold">
                                When the fast pointer hits the end of the list, the slow pointer will be sitting exactly in the middle!
                            </p>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-8 shadow-sm hover:border-teal-300 hover:shadow-md transition-all">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                           <RefreshCw size={18} className="text-teal-500"/> Dummy Nodes
                        </h4>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                What happens if you need to delete the very first node (the Head) of the list? Your logic often gets messy with edge cases like <code>if (node == head)</code>.
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                <strong>Pro Tip:</strong> Create a fake "Dummy" node before the head: <code>Node dummy = new Node(0); dummy.next = head;</code>
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Now every real node is guaranteed to have a node preceding it. You can write your logic normally, and at the end, simply <code>return dummy.next;</code>.
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