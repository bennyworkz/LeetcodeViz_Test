import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp, ArrowLeft,
  ChevronLeft, ChevronRight, Network, Database, RotateCcw, 
  ListOrdered, RefreshCw, Zap, Goal, Info, Layers, 
  ZoomIn, ZoomOut, Maximize, Hash, Trash2, Search,
  Scissors, ShieldAlert, Cpu, Lightbulb, PlayCircle,
  MonitorPlay, PartyPopper, CheckCircle2, XCircle, X,
  Filter, Terminal, Braces, Layout, Minimize, Repeat,
  GitCommit, Split, GitMerge, Share2, MousePointer2, 
  Binary, Layers as LayersIcon, CircleDashed, CheckSquare, PlusSquare, ArrowLeftToLine, AlignVerticalSpaceAround,
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Combine, Dices, BoxSelect, ArrowDownUp, Maximize2, Variable,
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  bitByBit: {
    id: 'bitByBit',
    title: '1. Bit-by-Bit Evaluation',
    icon: <ToggleLeft size={16} />,
    complexity: 'Time: O(log(Max)) | Space: O(1)',
    theme: 'indigo',
    code: `public int minFlips(int a, int b, int c) {
    int flips = 0;
    while (a > 0 || b > 0 || c > 0) {
        int bitA = a & 1;
        int bitB = b & 1;
        int bitC = c & 1;
        if (bitC == 1) {
            if (bitA == 0 && bitB == 0) flips++;
        } else {
            flips += (bitA + bitB);
        }
        a >>= 1;
        b >>= 1;
        c >>= 1;
    }
    return flips;
}`,
    desc: "The Bit-by-Bit Evaluation approach. We process the numbers one bit at a time from right to left (Least Significant Bit to Most Significant Bit) using a while loop. At each step, we check the rightmost bit using '& 1'. If the target bit in 'c' is 1, we need at least one 1-bit in 'a' or 'b'. If both are 0, we flip one of them (1 flip). If the target bit in 'c' is 0, we need both 'a' and 'b' bits to be 0. We add however many 1s they currently have to our flip count. Finally, we shift a, b, and c right by 1 (>> 1) to process the next bit."
  },
  bitCountMagic: {
    id: 'bitCountMagic',
    title: '2. O(1) BitCount Magic',
    icon: <Cpu size={16} />,
    complexity: 'Time: O(1) | Space: O(1)',
    theme: 'violet',
    code: `public int minFlips(int a, int b, int c) {
    int diff = (a | b) ^ c;
    int bothOnes = a & b & diff;
    return Integer.bitCount(diff) + Integer.bitCount(bothOnes);
}`,
    desc: "The hyper-optimized BitCount approach. We can solve this without looping through bits manually! First, we find all mismatched bits by doing '(a | b) ^ c'. Every mismatched bit represents at least 1 flip needed. However, if 'c' is 0 and BOTH 'a' and 'b' are 1, we need to flip BOTH of them (2 flips). We isolate these specific double-flip bits using 'a & b & diff'. The total minimum flips is simply the bit count of the differences plus the bit count of the double-flip bits."
  }
};

// --- Helper UI Components ---

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  themeColor: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label, themeColor }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? `bg-${themeColor}-600 text-white shadow-md scale-105 border border-white/10` : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
  theme?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'indigo' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|boolean|char|return|if|else|while|for|continue|break|new|String|minFlips|bitCount|Integer|a|b|c|flips|bitA|bitB|bitC|diff|bothOnes)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
  const activeStyles = { bg: `bg-${theme}-500/20`, border: `border-${theme}-500`, text: `text-${theme}-400` };
  
  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `${activeStyles.text} font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre 
        className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] whitespace-pre-wrap break-words ${active ? 'opacity-100' : 'opacity-60'}`}
        style={{ paddingLeft: `${leadingSpaces}ch`, textIndent: `-${leadingSpaces}ch` }}
      >
        {parts.map((part, idx) => {
            const isKeyword = ['public', 'private', 'void', 'int', 'boolean', 'char', 'return', 'if', 'else', 'while', 'for', 'continue', 'break', 'new'].includes(part);
            const isObject = ['String', 'Integer'].includes(part);
            const isPointer = ['a', 'b', 'c', 'flips', 'bitA', 'bitB', 'bitC', 'diff', 'bothOnes'].includes(part);
            const isMapCall = ['minFlips', 'bitCount'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^'].includes(part.trim());
            
            return (
              <span 
                key={idx} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-emerald-400 font-bold' : 
                  isMapCall ? 'text-amber-300' :
                  isOperator ? 'text-slate-400 font-bold' :
                  isPointer ? `text-${theme}-300` : 
                  isNaN(parseInt(part)) ? (part.startsWith('"') || part.startsWith("'") ? 'text-emerald-300' : '') : 'text-emerald-400'
                }
              >
                {part}
              </span>
            );
        })}
      </pre>
    </div>
  );
};

// --- Main Application ---

export default function MinimumFlipsVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('bitByBit');
  
  const [aInput, setAInput] = useState('2');
  const [bInput, setBInput] = useState('6');
  const [cInput, setCInput] = useState('5');
  
  const [baseA, setBaseA] = useState<number>(2);
  const [baseB, setBaseB] = useState<number>(6);
  const [baseC, setBaseC] = useState<number>(5);

  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85); 
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  // --- Effects for Data Processing ---

  useEffect(() => {
    const timer = setTimeout(() => {
      let pa = parseInt(aInput.trim(), 10);
      let pb = parseInt(bInput.trim(), 10);
      let pc = parseInt(cInput.trim(), 10);
      
      if (isNaN(pa) || pa < 0) pa = 2;
      if (isNaN(pb) || pb < 0) pb = 6;
      if (isNaN(pc) || pc < 0) pc = 5;

      if (pa > 1000) pa = 1000;
      if (pb > 1000) pb = 1000;
      if (pc > 1000) pc = 1000;
      
      setBaseA(pa);
      setBaseB(pb);
      setBaseC(pc);

      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [aInput, bInput, cInput, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Helper to format binary string safely
  const toBinary = (num: number, pad: number = 6) => {
      if (num === undefined || num === null) return "0".padStart(pad, '0');
      return (num >>> 0).toString(2).padStart(pad, '0').slice(-pad); // Force fixed length visually
  }

  // Count bits helper
  const bitCount = (n: number) => n.toString(2).split('0').join('').length;

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    const maxBits = Math.max(Math.max(baseA, baseB, baseC).toString(2).length, 4); 

    if (selectedOpId === 'bitByBit') {
        let ta = baseA;
        let tb = baseB;
        let tc = baseC;
        let flips = 0;
        
        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { ta, tb, tc, flips, maxBits, ...st } 
        });

        add("Function Call", `public int minFlips(int a=${ta}, int b=${tb}, int c=${tc})`, 1, {});
        
        add("Init Variable", `int flips = 0;\nInitialize flips counter.`, 2, { hlInit: true });

        while (ta > 0 || tb > 0 || tc > 0) {
            add("Loop Condition", `while (a > 0 || b > 0 || c > 0)\nAre there any bits left to process? (Yes)`, 3, { isCheckingLoop: true });
            
            let bitA = ta & 1;
            let bitB = tb & 1;
            let bitC = tc & 1;

            add("Extract LSBs", `int bitA = a & 1;\nint bitB = b & 1;\nint bitC = c & 1;\nExtracting the Least Significant Bits (rightmost).`, 6, { bitA, bitB, bitC, hlLsb: true });

            add("Check bitC", `if (bitC == 1)\nIs target bitC a 1? (${bitC === 1 ? 'Yes' : 'No'})`, 7, { bitA, bitB, bitC, hlLsb: true });

            if (bitC === 1) {
                let added = (bitA === 0 && bitB === 0) ? 1 : 0;
                add("bitC == 1 Logic", `if (bitA == 0 && bitB == 0) flips++;\nWe need at least one 1-bit. A=${bitA}, B=${bitB}. Flips needed: ${added}.`, 8, { bitA, bitB, bitC, hlLogic: true, added });
                flips += added;
            } else {
                let added = bitA + bitB;
                add("bitC == 0 Logic", `flips += (bitA + bitB);\nWe need both bits to be 0. A=${bitA}, B=${bitB}. Flips needed: ${added}.`, 10, { bitA, bitB, bitC, hlLogic: true, added });
                flips += added;
            }

            add("Shift Right", `a >>= 1;\nb >>= 1;\nc >>= 1;\nShifting bits right to process the next position.`, 14, { bitA, bitB, bitC, hlShift: true });
            
            ta >>= 1;
            tb >>= 1;
            tc >>= 1;
        }

        add("Loop Condition", `while (a > 0 || b > 0 || c > 0)\nAll numbers are 0. Loop terminates.`, 3, { isCheckingLoop: true });
        add("Return Final Result", `return flips;\nTotal minimum flips needed is ${flips}.`, 16, { isSuccess: true, finalAns: flips });

    } else if (selectedOpId === 'bitCountMagic') {
        let diff = (baseA | baseB) ^ baseC;
        let bothOnes = baseA & baseB & diff;
        let ans = bitCount(diff) + bitCount(bothOnes);
        
        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { a: baseA, b: baseB, c: baseC, maxBits, diff, bothOnes, ans, ...st } 
        });

        add("Function Call", `public int minFlips(int a=${baseA}, int b=${baseB}, int c=${baseC})`, 1, {});
        
        add("Calculate Diff", `int diff = (a | b) ^ c;\nFinds bits where (a | b) does not match target 'c'. Diff = ${diff}.`, 2, { hlDiff: true });
        
        add("Calculate Double Flips", `int bothOnes = a & b & diff;\nFinds mismatched bits where c=0 but both a=1 AND b=1 (needs 2 flips). BothOnes = ${bothOnes}.`, 3, { hlBoth: true });
        
        add("Return Result", `return Integer.bitCount(diff) + Integer.bitCount(bothOnes);\nTotal flips = ${bitCount(diff)} + ${bitCount(bothOnes)} = ${ans}.`, 4, { isSuccess: true, finalAns: ans });
    }

    return steps;
  }, [baseA, baseB, baseC, selectedOpId]);

  // Derived state
  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  // --- UI Handlers ---
  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 0, y: 0 }); 
    setZoom(0.85); 
  };

  const handleNext = () => { 
    if (currentStep < trace.length - 1) setCurrentStep(prev => prev + 1); 
  };
  
  const handlePrev = () => { 
    if (currentStep > 0) setCurrentStep(prev => prev - 1); 
  };

  const toggleFullscreen = () => setIsFullscreen(prev => !prev);
  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => { 
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handlePointerUp = () => setIsDragging(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedOp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        setCurrentStep(prev => (prev < trace.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trace.length]);

  const renderVisuals = () => {
      // Common padding for binary visualizer based on max bits
      const pad = st.maxBits + 2; 

      return (
          <div className="flex flex-col items-center w-full gap-12 pointer-events-none relative pt-6 px-4">
              
              {selectedOpId === 'bitByBit' && st.ta !== undefined && (
                  <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-4xl">
                      
                      {/* Binary Grid Panel */}
                      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-sky-500"></div>
                          
                          <div className="flex flex-col gap-6 font-mono text-3xl md:text-4xl font-black relative">
                              
                              {/* Highlight Box over LSB */}
                              {st.hlLsb && !st.isSuccess && (
                                  <div className="absolute right-0 top-0 bottom-0 w-12 md:w-14 border-4 border-indigo-400 bg-indigo-500/10 rounded-lg -m-1 pointer-events-none animate-pulse z-0"></div>
                              )}

                              {/* A Row */}
                              <div className="flex items-center justify-end gap-6 relative z-10">
                                  <span className="text-sm text-slate-400 uppercase tracking-widest w-8">A</span>
                                  <div className="flex">
                                      <span className="text-slate-700 tracking-[0.2em]">{toBinary(st.ta, pad).slice(0, -1)}</span>
                                      <span className={`tracking-widest ${st.hlLsb || st.hlShift ? (st.ta & 1 ? 'text-indigo-600' : 'text-slate-400') : 'text-slate-700'}`}>{toBinary(st.ta, pad).slice(-1)}</span>
                                  </div>
                              </div>
                              
                              {/* B Row */}
                              <div className="flex items-center justify-end gap-6 relative z-10 border-b-2 border-slate-200 pb-6">
                                  <span className="text-sm text-slate-400 uppercase tracking-widest w-8">B</span>
                                  <div className="flex">
                                      <span className="text-slate-700 tracking-[0.2em]">{toBinary(st.tb, pad).slice(0, -1)}</span>
                                      <span className={`tracking-widest ${st.hlLsb || st.hlShift ? (st.tb & 1 ? 'text-indigo-600' : 'text-slate-400') : 'text-slate-700'}`}>{toBinary(st.tb, pad).slice(-1)}</span>
                                  </div>
                                  <div className="absolute left-6 -bottom-5 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-sm text-slate-500 border border-slate-200">OR</div>
                              </div>

                              {/* C Row (Target) */}
                              <div className="flex items-center justify-end gap-6 relative z-10 pt-2">
                                  <span className="text-sm text-sky-500 uppercase tracking-widest w-8">C</span>
                                  <div className="flex">
                                      <span className="text-sky-700 tracking-[0.2em]">{toBinary(st.tc, pad).slice(0, -1)}</span>
                                      <span className={`tracking-widest ${st.hlLsb || st.hlShift ? (st.tc & 1 ? 'text-sky-500' : 'text-sky-300') : 'text-sky-700'}`}>{toBinary(st.tc, pad).slice(-1)}</span>
                                  </div>
                              </div>

                              {/* Shift Animation Overlay */}
                              {st.hlShift && (
                                  <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col gap-8 opacity-60 animate-out slide-out-to-right-8 duration-700">
                                      <ArrowRight size={24} className="text-indigo-500"/>
                                      <ArrowRight size={24} className="text-indigo-500"/>
                                      <ArrowRight size={24} className="text-sky-500"/>
                                  </div>
                              )}
                          </div>
                      </div>

                      {/* Flips Counter Panel */}
                      <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl flex flex-col items-center justify-center min-w-[200px] relative">
                          {st.added > 0 && !st.isSuccess && (
                              <span className="absolute -top-4 right-4 bg-emerald-400 text-emerald-900 font-black px-3 py-1 rounded-full text-xs animate-in zoom-in slide-in-from-bottom-4 shadow-lg border border-emerald-200">
                                  +{st.added} Flip
                              </span>
                          )}
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Flips</span>
                          <span className={`text-6xl font-mono font-black transition-colors duration-300 ${st.isSuccess ? 'text-emerald-400' : 'text-white'}`}>{st.flips}</span>
                      </div>
                      
                  </div>
              )}

              {selectedOpId === 'bitCountMagic' && st.a !== undefined && (
                  <div className="flex flex-col items-center w-full max-w-3xl animate-in slide-in-from-bottom-8 duration-500">
                      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl w-full flex flex-col gap-4 relative overflow-hidden">
                          {/* Top Tag */}
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
                          
                          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-2">
                              <span className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><Cpu size={14}/> Bitwise Operation Map</span>
                          </div>

                          <div className="flex flex-col gap-3 font-mono text-2xl md:text-3xl font-black">
                              
                              {/* A Row */}
                              <div className="flex items-center justify-end gap-6 text-slate-400">
                                  <span className="text-[10px] uppercase tracking-widest w-12 text-right">A</span>
                                  <span className="tracking-[0.3em]">{toBinary(st.a, pad)}</span>
                              </div>
                              
                              {/* B Row */}
                              <div className="flex items-center justify-end gap-6 text-slate-400 border-b-2 border-slate-100 pb-3">
                                  <span className="text-[10px] uppercase tracking-widest w-12 text-right">B</span>
                                  <span className="tracking-[0.3em]">{toBinary(st.b, pad)}</span>
                              </div>

                              {/* A | B Row */}
                              <div className="flex items-center justify-end gap-6 text-slate-700 pt-1">
                                  <span className="text-[10px] uppercase tracking-widest w-12 text-right">A | B</span>
                                  <span className="tracking-[0.3em]">{toBinary(st.a | st.b, pad)}</span>
                              </div>

                              {/* C Row */}
                              <div className="flex items-center justify-end gap-6 text-sky-600 border-b-2 border-slate-200 pb-4">
                                  <span className="text-[10px] uppercase tracking-widest w-12 text-right">C</span>
                                  <span className="tracking-[0.3em]">{toBinary(st.c, pad)}</span>
                              </div>

                              {/* Diff Row */}
                              <div className={`flex items-center justify-end gap-6 transition-opacity duration-500 pt-2 ${st.hlDiff || st.hlBoth || st.isSuccess ? 'opacity-100' : 'opacity-20'}`}>
                                  <span className="text-[10px] uppercase tracking-widest w-12 text-right text-violet-500">Diff</span>
                                  <div className="flex">
                                      {toBinary(st.diff, pad).split('').map((bit, idx) => (
                                          <span key={idx} className={`w-[0.9em] text-center ${bit === '1' ? 'text-rose-500 bg-rose-50 rounded border border-rose-200' : 'text-slate-300'}`}>{bit}</span>
                                      ))}
                                  </div>
                              </div>

                              {/* BothOnes Row */}
                              <div className={`flex items-center justify-end gap-6 transition-opacity duration-500 ${st.hlBoth || st.isSuccess ? 'opacity-100' : 'opacity-20'}`}>
                                  <span className="text-[10px] uppercase tracking-widest w-12 text-right text-fuchsia-500">Both 1s</span>
                                  <div className="flex">
                                      {toBinary(st.bothOnes, pad).split('').map((bit, idx) => (
                                          <span key={idx} className={`w-[0.9em] text-center ${bit === '1' ? 'text-amber-500 bg-amber-50 rounded border border-amber-200' : 'text-slate-300'}`}>{bit}</span>
                                      ))}
                                  </div>
                              </div>
                          </div>

                          {/* Flips Summary */}
                          {(st.hlBoth || st.isSuccess) && (
                              <div className="mt-6 bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center justify-between shadow-inner animate-in slide-in-from-bottom-4">
                                  <div className="flex flex-col gap-1">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">bitCount(diff) + bitCount(bothOnes)</span>
                                      <span className="font-mono text-sm text-slate-300"><span className="text-rose-400">{bitCount(st.diff)} diffs</span> + <span className="text-amber-400">{bitCount(st.bothOnes)} double-flips</span></span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <span className="font-mono text-xl font-bold text-white bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                                          = <span className="text-emerald-400">{st.ans} Flips</span>
                                      </span>
                                  </div>
                              </div>
                          )}

                      </div>
                  </div>
              )}

          </div>
      );
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-600`}>
                {selectedOpId === 'bitByBit' ? <ToggleLeft className="text-white" size={28} /> : <Cpu className="text-white" size={28} />}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Minimum Flips to a OR b = c</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Multiple Bitwise Approaches
                  </span>
                  <span>•</span>
                  <span>LeetCode 1318</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto scrollbar-none">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" themeColor={themeColor}/>
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" themeColor={themeColor}/>
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" themeColor={themeColor}/>
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" themeColor={themeColor}/>
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-4">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Target size={28}/> Bitwise Alignment</div>
                    <div className="text-lg leading-relaxed max-w-3xl">
                      Given 3 positives numbers <code>a</code>, <code>b</code> and <code>c</code>. Return the minimum flips required in some bits of <code>a</code> and <code>b</code> to make <code>(a OR b) == c</code>.<br/><br/>
                      A flip operation consists of changing any single bit 1 to 0 or changing the bit 0 to 1 in their binary representation.
                    </div>
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-nowrap`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Input: a = 2, b = 6, c = 5</span>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300">
                           3
                       </span>
                       <span className="text-slate-500 block mt-3 text-xs italic">
                           Explanation: <br/>
                           a = 0010<br/>
                           b = 0110<br/>
                           c = 0101<br/>
                           We must flip 3 bits in a and b to make their OR equal to c.
                       </span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-amber-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">We are evaluating bits. If <code>c_bit == 1</code>, we need at least one of the input bits to be 1. If both are 0, we flip one (1 flip). If <code>c_bit == 0</code>, we strictly need BOTH input bits to be 0. If they are 1s, we must flip them (1 or 2 flips).</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600">We have two main strategies. <strong>Bit-by-Bit:</strong> Loop while any number is greater than 0, masking the rightmost bit with <code>&amp; 1</code>, calculating flips, and shifting right <code>&gt;&gt; 1</code>. <strong>BitCount Trick:</strong> Use <code>Integer.bitCount</code> to mathematically calculate differences using XOR and AND masks in $O(1)$ time.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-${op.theme}-600 text-white border-${op.theme}-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? `text-${op.theme}-100` : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[480px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> MinimumFlips.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 pb-10">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-1 w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Input A</label>
                            <input type="number" min="0" max="1000" value={aInput} onChange={(e) => setAInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="2" />
                        </div>
                        <div className="flex-1 w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Input B</label>
                            <input type="number" min="0" max="1000" value={bInput} onChange={(e) => setBInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="6" />
                        </div>
                        <div className="flex-1 w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-sky-500 pl-1`}>Target C</label>
                            <input type="number" min="0" max="1000" value={cInput} onChange={(e) => setCInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-inner font-bold`} placeholder="5" />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-8 py-3 bg-${themeColor}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> ANALYSIS COMPLETE</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Minimum flips required: {st.finalAns}</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlLogic || st.hlBoth || st.hlDiff ? `text-${themeColor}-400` : 'text-white'}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Network size={14} className={`text-${themeColor}-500`}/> State Visualizer</span>
                   </div>

                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                        </div>
                   </div>

                   <div ref={!isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                       <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-300 flex flex-col justify-start items-center pt-8" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
                           {renderVisuals()}
                       </div>
                   </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-800 space-y-12">
                
                <div className="text-center space-y-4 max-w-3xl mx-auto mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-indigo-100 text-indigo-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Mastering Bitwise Masking vs Sequential Bit Shifts.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Binary size={24} className="text-indigo-500"/> 1. The Core OR Constraints</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">The logic for evaluating each bit position `i` is strictly defined by the OR (`|`) truth table:</p>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600 font-mono">
                            <li><strong>If C[i] == 1:</strong> We need `A[i] | B[i]` to be `1`. If they are both `0`, we flip one of them. (Max 1 flip needed).</li>
                            <li><strong>If C[i] == 0:</strong> We need `A[i] | B[i]` to be `0`. This means BOTH must be `0`. If A is `1`, flip it. If B is `1`, flip it. (Up to 2 flips needed).</li>
                        </ul>
                    </div>

                    {/* Section 2 - TIME COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 2. Time Complexity: O(log(Max)) vs O(1)</h4>
                        <p className="mb-4 text-slate-600">The performance depends on the chosen approach.</p>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Bit-by-Bit:</strong> Runs a `while` loop, shifting right until all numbers are 0. The loop runs exactly as many times as there are bits in the largest number. This takes $O(\log(\max(A, B, C)))$ time.</li>
                            <li><strong>BitCount Magic:</strong> The Java `Integer.bitCount()` function operates on the entire 32-bit integer simultaneously using highly optimized parallel hardware instructions. This takes absolute $O(1)$ constant time regardless of how large the integers are.</li>
                        </ul>
                    </div>

                    {/* Section 3 - SPACE COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-violet-500"/> 3. Space Complexity Analysis: O(1)</h4>
                        <p className="mb-4 text-slate-600">Both solutions use absolutely minimal space.</p>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div>
                                <strong className="text-slate-800 block mb-1">Auxiliary Space: O(1) Constant</strong>
                                <span className="text-sm text-slate-600">We only declare a few integer variables (`flips`, `diff`, `bothOnes`, etc.). No arrays, sets, or recursive stacks are used. Memory footprint is virtually zero.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-emerald-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a fantastic problem to show off your command of Bit Manipulation. Interviewers love seeing the evolution from the manual Bit-by-Bit check to the mathematical BitCount single-liner."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-indigo-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-indigo-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Explain exactly how <code>int diff = (a | b) ^ c</code> works."</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "First, <code>(a | b)</code> calculates what the OR result currently is before any flips.</p>
                            <p>Next, we use XOR (<code>^</code>) against the target <code>c</code>. The XOR operator acts as a 'difference finder'. It puts a <code>1</code> in every bit position where <code>(a | b)</code> is different from <code>c</code>, and a <code>0</code> where they are identical. Thus, the number <code>diff</code> is a literal mask of every bit position that requires at least one flip!"</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "Why do we need <code>int bothOnes = a &amp; b &amp; diff</code>?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The <code>diff</code> mask tells us which bits need flipping, but it assumes 1 flip per bit. That's true for most cases, but there is one edge case: what if <code>c</code> is 0, but both <code>a</code> and <code>b</code> are 1?</p>
                            <p>In that specific scenario, we must flip <strong>both</strong> <code>a</code> and <code>b</code> (2 flips). To find these exact bit positions, we use <code>a &amp; b</code> (which isolates bits where both are 1) and we AND it with <code>diff</code> (to ensure it's a position that actually needs fixing). The resulting <code>bothOnes</code> mask identifies every bit that requires a second, extra flip."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Activity size={24}/></span>
                            <span>Q3: "Is <code>Integer.bitCount</code> actually $O(1)$? Isn't it just a loop under the hood?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It is effectively $O(1)$. In Java, <code>Integer.bitCount()</code> does not use a <code>while</code> loop. It uses a sequence of clever parallel bit-shift operations (often called a Hamming Weight algorithm) that executes in a fixed number of CPU instructions (usually about 12 operations) regardless of the number's size.</p>
                            <p>Furthermore, the JVM JIT compiler often replaces the method call entirely with a dedicated hardware instruction (like <code>POPCNT</code> on x86 architectures) which literally executes in a single CPU cycle."</p>
                        </div>
                    </div>

                </div>
            </div>
        )}

      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[450px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-50">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-${themeColor}-600 shadow-${themeColor}-900/50`}>
                              {selectedOpId === 'bitByBit' ? <ToggleLeft size={20}/> : <Cpu size={20}/>}
                          </div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                  </div>
                  <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 pb-10">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4 overflow-x-hidden">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                        ))}
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlShift || st.hlDiff || st.hlBoth ? `text-${themeColor}-400` : 'text-white'}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? `bg-${op.theme}-600 text-white shadow-md` : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="flex-1 w-20 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>A</label>
                              <input type="number" value={aInput} onChange={(e) => setAInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} />
                          </div>
                          <div className="flex-1 w-20 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>B</label>
                              <input type="number" value={bInput} onChange={(e) => setBInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} />
                          </div>
                          <div className="flex-1 w-20 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-sky-600`}>C</label>
                              <input type="number" value={cInput} onChange={(e) => setCInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-sky-500 font-bold`} />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={24}/></button>
                            <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-3 text-slate-600 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all`}><Minimize size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-50 flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 bg-${themeColor}-600 text-white rounded-[2rem] hover:bg-${themeColor}-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-${themeColor}-500 shadow-xl`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  <div ref={isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                      <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-500 flex flex-col justify-start items-center pt-24" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom * 1.3})`, transformOrigin: 'top center' }}>
                           {renderVisuals()}
                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                
                                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10"><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">COMPLETED</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Minimum Flips Calculated</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Final Answer</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed">{st.finalAns} Flips</div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20`}>
                                        <RotateCcw size={24}/> RESTART VIZ
                                    </button>
                                    <button onClick={toggleFullscreen} className="py-6 px-10 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all border border-slate-700 shadow-xl shadow-black/20">
                                        CLOSE
                                    </button>
                                </div>
                            </div>
                        </div>
                   )}
              </div>
          </div>
      )}
    </div>
  );
}