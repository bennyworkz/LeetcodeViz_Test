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
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Target, Keyboard, Type, KeyRound, Box, Landmark, Calculator, Plus, Minus, History
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  leftToRight: {
    id: 'leftToRight',
    title: '1. Left-to-Right Pass',
    icon: <ArrowRight size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public int romanToInt(String s) {
    int total = 0;
    
    for (int i = 0; i < s.length(); i++) {
        int currentVal = getValue(s.charAt(i));
        
        // If there's a next character and it's larger, subtract current
        if (i < s.length() - 1 && currentVal < getValue(s.charAt(i + 1))) {
            total -= currentVal;
        } 
        // Otherwise, add current
        else {
            total += currentVal;
        }
    }
    
    return total;
}

private int getValue(char c) {
    switch(c) {
        case 'I': return 1;
        case 'V': return 5;
        case 'X': return 10;
        case 'L': return 50;
        case 'C': return 100;
        case 'D': return 500;
        case 'M': return 1000;
        default: return 0;
    }
}`,
    desc: "The standard intuitive approach. We read the string from left to right. If the current character's value is less than the next character's value (e.g., 'I' before 'V'), it means we need to subtract the current value. Otherwise, we just add it."
  },
  rightToLeft: {
    id: 'rightToLeft',
    title: '2. Right-to-Left (Optimized)',
    icon: <History size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public int romanToInt(String s) {
    int total = 0;
    int prevValue = 0;
    
    for (int i = s.length() - 1; i >= 0; i--) {
        int currentVal = getValue(s.charAt(i));
        
        // If current is less than the previous, subtract it
        if (currentVal < prevValue) {
            total -= currentVal;
        } 
        // Otherwise, add it
        else {
            total += currentVal;
        }
        
        prevValue = currentVal;
    }
    
    return total;
}

private int getValue(char c) {
    switch(c) {
        case 'I': return 1;
        case 'V': return 5;
        case 'X': return 10;
        case 'L': return 50;
        case 'C': return 100;
        case 'D': return 500;
        case 'M': return 1000;
        default: return 0;
    }
}`,
    desc: "A highly elegant optimization. By scanning from right to left, we only ever need to keep track of the 'previous' value we saw. We don't have to do bound checks (i < s.length() - 1) or peek ahead. It makes the code cleaner and slightly faster."
  }
};

const ROMAN_MAP = {
    'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000
};

// --- Helper UI Components ---

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|int|return|if|else|for|while|new|String|switch|case|default|char)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-rose-500/20`, border: `border-rose-500`, text: `text-rose-400` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-rose-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'int', 'return', 'if', 'else', 'for', 'while', 'new', 'switch', 'case', 'default', 'char'].includes(part);
            const isObject = ['String'].includes(part);
            const isVar = ['s', 'total', 'currentVal', 'prevValue', 'i', 'c'].includes(part);
            const isMapCall = ['getValue', 'charAt', 'length'].includes(part);
            const isStringOrChar = (part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"));

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-sky-400 font-bold';
            else if (isVar) className = 'text-rose-300';
            else if (isMapCall) className = 'text-amber-400';
            else if (isStringOrChar || !isNaN(parseInt(part))) className = 'text-emerald-400';

            return (
              <span key={i} className={className}>
                {part}
              </span>
            );
        })}
      </pre>
    </div>
  );
};

interface PointerLabelProps {
  label: string;
  color: string;
  position: string;
  offset?: number;
}

const PointerLabel: React.FC<PointerLabelProps> = ({ label, color, position, offset = 0 }) => {
    const colorClasses = {
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
        sky: 'bg-sky-100 text-sky-700 border-sky-300',
        rose: 'bg-rose-100 text-rose-700 border-rose-300',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300',
        violet: 'bg-violet-100 text-violet-700 border-violet-300',
        amber: 'bg-amber-100 text-amber-700 border-amber-300',
        slate: 'bg-slate-100 text-slate-600 border-slate-300'
    };
    const activeColorClass = colorClasses[color] || colorClasses['slate'];
    const alignClass = position === 'top' ? 'flex-col-reverse -top-10' : 'flex-col -bottom-10';

    return (
        <div className={`absolute ${alignClass} flex items-center justify-center animate-in zoom-in duration-300 z-30`} style={{ transform: `translateX(${offset}px)`}}>
            <span className={`text-[11px] font-black font-mono px-2 py-0.5 rounded border shadow-sm ${activeColorClass}`}>
                {String(label)}
            </span>
            {position === 'top' ? <ArrowDown size={16} className={`text-${color}-500`} strokeWidth={3}/> : <ArrowUp size={16} className={`text-${color}-500`} strokeWidth={3}/>}
        </div>
    );
};

interface CharNodeBlockProps {
  val: string;
  idx?: number;
  themeColor?: string;
  isTarget?: boolean;
  subValue?: number;
}

const CharNodeBlock: React.FC<CharNodeBlockProps> = ({ val, idx, themeColor = 'slate', isTarget, subValue }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800' },
        violet: { bg: 'bg-violet-50', border: 'border-violet-400', text: 'text-violet-800' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700' }
    };
    
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-300`}>
            <div className={`flex flex-col items-center w-14 h-16 border-2 rounded-xl transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-serif font-black text-2xl bg-white/50 ${activeTheme.text}`}>
                    {String(val)}
                </div>
                {subValue !== undefined && (
                    <div className={`flex w-full h-5 border-t border-black/10 ${isTarget ? 'bg-rose-100' : 'bg-slate-100'}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className={`text-[9px] font-black tracking-widest font-mono ${isTarget ? 'text-rose-600' : 'text-slate-400'}`}>{subValue}</span>
                        </div>
                    </div>
                )}
            </div>
            {idx !== undefined && <span className="absolute -bottom-6 text-[10px] font-mono text-slate-400">{idx}</span>}
        </div>
    );
};

// --- Main Application ---

export default function RomanVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('leftToRight');
  
  const [inputString, setInputString] = useState('MCMXCIV');
  const [baseArray, setBaseArray] = useState([]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 100, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef(null);
  const selectedOp = OPERATIONS[selectedOpId];

  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 100, y: 150 }); 
    setZoom(1); 
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

  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e) => { 
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

  const parseInput = (str) => {
      return str.trim().toUpperCase().split('').filter(c => ROMAN_MAP[c] !== undefined);
  };

  useEffect(() => {
    const arr = parseInput(inputString);
    setBaseArray(arr);
    setCurrentStep(0);
    setPan({ x: 100, y: 150 });
  }, [inputString, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e) => {
        if (!canvasContainerRef.current?.contains(e.target)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const trace = useMemo(() => {
    const steps = [];
    if (baseArray.length === 0) return [{ phase: 'Init', description: 'Enter valid Roman Numeral.', line: 0, state: { arr: [] } }];
    
    let arr = [...baseArray];

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            arr: [...arr],
            ...st 
        } 
    });

    if (selectedOpId === 'leftToRight') {
        let total = 0;
        
        add("Initialize", "Set total = 0. Begin scanning from Left to Right.", 2, { total });

        for (let i = 0; i < arr.length; i++) {
            let curr = arr[i];
            let currVal = ROMAN_MAP[curr];
            
            add("Read Character", `Extract value of s[${i}]: '${curr}' = ${currVal}.`, 5, { i, curr, currVal, total, hl: [i] });

            if (i < arr.length - 1) {
                let next = arr[i+1];
                let nextVal = ROMAN_MAP[next];
                
                add("Check Condition", `Is there a next character? Yes. Is currentVal (${currVal}) < nextVal (${nextVal})?`, 8, { i, curr, currVal, nextI: i+1, next, nextVal, total, hl: [i, i+1] });

                if (currVal < nextVal) {
                    let oldTotal = total;
                    total -= currVal;
                    add("Subtract", `Condition met! Subtraction rule applies. Subtract ${currVal} from total.`, 9, { i, curr, currVal, nextI: i+1, next, nextVal, total, oldTotal, op: 'sub', hl: [i] });
                } else {
                    let oldTotal = total;
                    total += currVal;
                    add("Add", `Condition not met. Standard addition applies. Add ${currVal} to total.`, 13, { i, curr, currVal, nextI: i+1, next, nextVal, total, oldTotal, op: 'add', hl: [i] });
                }
            } else {
                add("Check Condition", `Is there a next character? No. We are at the end of the string.`, 8, { i, curr, currVal, total, hl: [i] });
                
                let oldTotal = total;
                total += currVal;
                add("Add Last", `Add the final value ${currVal} to total.`, 13, { i, curr, currVal, total, oldTotal, op: 'add', hl: [i] });
            }
        }

        add("Complete", `Iteration finished. Return final total: ${total}.`, 17, { total, isSuccess: true });

    } else if (selectedOpId === 'rightToLeft') {
        let total = 0;
        let prevValue = 0;
        
        add("Initialize", "Set total = 0 and prevValue = 0. Begin scanning from Right to Left.", 3, { total, prevValue });

        for (let i = arr.length - 1; i >= 0; i--) {
            let curr = arr[i];
            let currVal = ROMAN_MAP[curr];
            
            add("Read Character", `Extract value of s[${i}]: '${curr}' = ${currVal}.`, 6, { i, curr, currVal, total, prevValue, hl: [i] });

            add("Check Condition", `Is currentVal (${currVal}) < prevValue (${prevValue})?`, 9, { i, curr, currVal, total, prevValue, hl: [i] });

            if (currVal < prevValue) {
                let oldTotal = total;
                total -= currVal;
                add("Subtract", `Condition met! Subtraction rule applies. Subtract ${currVal}.`, 10, { i, curr, currVal, total, oldTotal, prevValue, op: 'sub', hl: [i] });
            } else {
                let oldTotal = total;
                total += currVal;
                add("Add", `Condition not met. Standard addition applies. Add ${currVal}.`, 14, { i, curr, currVal, total, oldTotal, prevValue, op: 'add', hl: [i] });
            }
            
            prevValue = currVal;
            add("Update Prev", `Update prevValue to remember current character: ${currVal}.`, 17, { i, curr, currVal, total, prevValue, hl: [i] });
        }

        add("Complete", `Iteration finished. Return final total: ${total}.`, 20, { total, prevValue, isSuccess: true });
    }

    return steps;
  }, [baseArray, selectedOpId]);

  // Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

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

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { arr: [] } };
  const st = curStepData.state || { arr: [] };
  const isLastStep = currentStep === trace.length - 1;

  const startX = 60;
  const startY = 80;

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-rose-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <Landmark className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Roman to Integer</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      LC 13 • String Parsing
                  </span>
                  <span>•</span>
                  <span>Math & Logic</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-rose-600 font-black text-2xl uppercase tracking-tighter"><Calculator size={28}/> Deciphering Rome</div>
                    <p className="text-lg leading-relaxed max-w-3xl">
                      Roman numerals are represented by seven different symbols: <code>I, V, x, L, C, D, M</code>. 
                      Typically, Roman numerals are written largest to smallest from left to right. However, the numeral for four is not <code>IIII</code>. Instead, the number four is written as <code>IV</code>. Because the one is before the five we subtract it making four.
                    </p>
                    <div className="bg-slate-900 border-l-4 border-rose-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white space-y-4 overflow-x-auto whitespace-nowrap">
                       <div><span className="text-rose-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Example Input</span>
                       s = "MCMXCIV"</div>
                       <div><span className="text-emerald-400 block mb-1 uppercase text-[10px] font-black tracking-widest mt-2">Expected Output</span>
                       1994 <span className="opacity-50 text-xs ml-2">// M=1000, CM=900, XC=90, IV=4</span></div>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> The Core Logic</h4>
                        <p className="text-sm leading-relaxed text-slate-600">The entire algorithm hinges on one simple rule: If a smaller numeral appears <strong>before</strong> a larger numeral, it must be subtracted instead of added. Everything else is pure addition.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><ArrowLeft size={16} className="text-amber-500"/> Reverse Thinking</h4>
                        <p className="text-sm leading-relaxed text-slate-600">While reading left-to-right is how humans read, reading right-to-left is often better for computers here. It eliminates the need to "look ahead" out of bounds, preventing `IndexOutOfBounds` exceptions naturally.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-rose-600 text-white border-rose-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-rose-200' : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[440px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-rose-600 pl-1">Input Roman Numeral</label>
                            <input type="text" value={inputString} onChange={(e) => setInputString(e.target.value.toUpperCase())} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-inner uppercase" />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center">
                            <div className="hidden lg:flex items-center gap-1.5 mr-2 text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                                <Keyboard size={14} />
                                <span className="text-[9px] font-mono uppercase tracking-widest font-bold">Use &larr; &rarr;</span>
                            </div>
                            <button onClick={handleReset} className="p-2.5 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-2.5 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-2.5 bg-rose-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-6 shadow-xl border transition-all duration-300 min-h-[130px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={80} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-2 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Parsing Complete</div>
                            <p className="text-sm leading-relaxed text-white mt-1 font-mono font-bold tracking-tight">{String(curStepData.description)}</p>
                         </div>
                    ) : (
                        <>
                            <div className="text-lg font-black tracking-tight mb-1 uppercase font-mono text-white leading-none truncate">{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-2 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 h-[380px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Layout size={14} className="text-rose-500"/> Memory & State</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className="p-1.5 text-slate-600 hover:text-rose-600 rounded-lg transition-colors"><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className="p-1.5 text-slate-600 hover:text-rose-600 rounded-lg transition-colors"><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className="p-1.5 text-slate-600 hover:text-rose-600 rounded-lg transition-colors"><Maximize size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* Roman Map Reference Guide */}
                           <div className="absolute top-4 left-32 bg-white border border-slate-200 rounded-xl p-2 flex gap-3 shadow-sm scale-90 opacity-80 pointer-events-none">
                               {Object.entries(ROMAN_MAP).map(([k, v]) => (
                                   <div key={k} className="flex flex-col items-center">
                                       <span className="font-serif font-black text-rose-700">{k}</span>
                                       <span className="text-[8px] font-mono text-slate-500">{v}</span>
                                   </div>
                               ))}
                           </div>

                           {/* Total Accumulator Box */}
                           {st.total !== undefined && (
                               <div className="absolute top-20 left-[60px] bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 shadow-xl flex items-center gap-6 min-w-[200px]">
                                   <div className="flex flex-col">
                                       <span className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-400">Running Total</span>
                                       <span className="text-3xl font-black font-mono text-emerald-400">{st.total}</span>
                                   </div>
                                   
                                   {/* Math Operation visual */}
                                   {st.op && st.currVal !== undefined && (
                                       <div className="animate-in slide-in-from-right-4 fade-in duration-300 flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                                            <span className="text-slate-300 font-mono text-sm">{st.oldTotal}</span>
                                            {st.op === 'add' ? <Plus size={14} className="text-emerald-400"/> : <Minus size={14} className="text-rose-400"/>}
                                            <span className={`font-mono font-bold ${st.op === 'add' ? 'text-emerald-400' : 'text-rose-400'}`}>{st.currVal}</span>
                                       </div>
                                   )}
                               </div>
                           )}

                           {/* Array Elements */}
                           <div className="absolute flex gap-3" style={{ left: startX, top: startY + 150 }}>
                               {(st.arr || []).map((val, idx) => {
                                  const isI = st.hl && st.hl.includes(idx);
                                  const isPast = selectedOpId === 'leftToRight' ? (st.i !== undefined && idx < st.i) : (st.i !== undefined && idx > st.i);
                                  
                                  let theme = 'slate';
                                  if (isI) theme = 'rose';
                                  else if (st.isSuccess) theme = 'emerald';
                                  else if (isPast) theme = 'slate'; 

                                  const labels = [];
                                  if (st.i === idx) labels.push({ text: "i", color: "rose", pos: "top" });
                                  if (st.nextI === idx) labels.push({ text: "i+1", color: "amber", pos: "bottom" });

                                  return (
                                      <div key={`arr-${idx}`} className={`relative ${isPast ? 'opacity-50 grayscale' : ''}`}>
                                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                          
                                          <CharNodeBlock val={val} idx={idx} themeColor={theme} isTarget={isI} subValue={ROMAN_MAP[val]} />
                                      </div>
                                  )
                               })}
                           </div>

                           {/* Variables Tracker */}
                           {selectedOpId === 'rightToLeft' && st.prevValue !== undefined && (
                               <div className="absolute left-[60px]" style={{ top: startY + 250 }}>
                                   <div className="bg-white border-2 border-slate-200 rounded-xl p-3 shadow-md flex items-center gap-3">
                                       <span className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-500">prevValue:</span>
                                       <span className="font-mono font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">{st.prevValue}</span>
                                   </div>
                               </div>
                           )}

                       </div>
                   </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-10">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-[#0f172a] text-white border border-slate-800 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Landmark size={120}/></div>
                        <h3 className="font-black text-rose-400 text-lg uppercase tracking-widest mb-6">The Subtraction Rule</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium">
                            <p>Roman numerals usually diminish in value from left to right (e.g., XVI = 10 + 5 + 1 = 16). The exception is when a smaller numeral appears <em>before</em> a larger one.</p>
                            <p>In the case of <code>IV</code>, the 1 appears before the 5. Mathematically, this is evaluating to <code>-1 + 5 = 4</code>. This logic holds true for all subtraction cases: IV (4), IX (9), XL (40), XC (90), CD (400), CM (900).</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-rose-50 border border-rose-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-rose-700 text-lg uppercase tracking-widest mb-6">Right-To-Left Brilliance</h3>
                        <div className="space-y-4 text-sm text-rose-900/80 leading-relaxed font-medium">
                            <p>Scanning left-to-right requires "peeking ahead" to index <code>i + 1</code>. This requires extra bound checking (<code>if i &lt; length - 1</code>) to prevent OutOfBounds exceptions.</p>
                            <p>If we scan <strong>Right-To-Left</strong>, we only need to look at what we've <em>already seen</em> (the previous character). Since the last character is always added, we can safely initialize our scan backwards. It's conceptually cleaner.</p>
                        </div>
                    </div>

                    <div className="p-8 md:col-span-2 rounded-3xl bg-slate-50 border border-slate-200 relative overflow-hidden shadow-inner flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
                            <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest mb-4">Hash Map vs Switch Statement</h3>
                            <p>In our code, we use <code>getValue(char)</code>. How should this be implemented? You have two choices:</p>
                            <ol className="list-decimal list-inside space-y-2 ml-4">
                                <li><strong>Hash Map:</strong> <code>map.get(c)</code>. Easy to write, extensible. But Hash Map lookups have a slight overhead.</li>
                                <li><strong>Switch Statement:</strong> <code>switch(c) {'{'} case 'I': return 1; ... {'}'}</code>. Hardcoded, but blazingly fast. Since the Roman alphabet is strictly 7 characters, a switch statement (or an array map of size 26) is technically the most performant.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-rose-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-rose-500">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Cracking the Roman Numeral</h3>
                    <p className="text-sm text-rose-100 leading-relaxed italic max-w-2xl font-mono">"This is a classic 'Easy' problem that tests your ability to translate a real-world human rule into code. State the rule out loud: 'If smaller is before larger, subtract. Else, add'. Then, write it exactly as you said it."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 text-slate-700">
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-rose-600 border-b pb-2">Technical Considerations</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Time Complexity:</strong> State clearly that it is $O(N)$. However, an advanced point to mention is that the maximum valid Roman numeral is usually 3999 (MMMCMXCIX), which is 15 characters long. Therefore, Time Complexity is technically $O(1)$ bounded.</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Invalid Inputs:</strong> The standard LeetCode problem guarantees valid input. However, an interviewer might ask "What if the string is invalid like 'IIII' or 'VX'?". Mention that verifying validity requires a much more complex regex or finite state machine.</div></li>
                        </ul>
                    </div>
                    
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-500 border-b pb-2">Interview Communication Checklist</h5>
                        <div className="space-y-3 font-mono text-[11px] text-slate-600 uppercase tracking-tight font-bold">
                            <div className="flex items-center gap-3"><CheckSquare size={16} className="text-rose-500"/> Explicitly state the subtraction rule.</div>
                            <div className="flex items-center gap-3"><CheckSquare size={16} className="text-rose-500"/> Propose left-to-right as the natural thought process.</div>
                            <div className="flex items-center gap-3"><CheckSquare size={16} className="text-rose-500"/> (Optional/Bonus) Propose right-to-left for cleaner code.</div>
                            <div className="flex items-center gap-3"><CheckSquare size={16} className="text-rose-500"/> Discuss Switch Statement vs Hash Map performance.</div>
                            <div className="flex items-center gap-3"><CheckSquare size={16} className="text-rose-500"/> Dry run code with a tricky case like "IX" or "MCM".</div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[550px] xl:w-[600px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110]">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className="bg-rose-600 p-2 rounded-lg text-white shadow-lg shadow-rose-900/50"><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                        ))}
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-tight">{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  {/* Floating Controls for Fullscreen */}
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? 'bg-rose-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-80 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-rose-600 pl-1">Input Roman Numeral</label>
                              <input type="text" value={inputString} onChange={(e) => setInputString(e.target.value.toUpperCase())} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-inner uppercase" />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className="p-3 text-slate-600 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all"><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <Keyboard size={16} />
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className="px-12 py-6 bg-rose-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(225,29,72,0.3)] hover:bg-rose-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-rose-500 shadow-rose-900/20">NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-500" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* Roman Map Reference Guide (Theater) */}
                           <div className="absolute top-8 left-32 bg-white border-2 border-slate-200 rounded-2xl p-4 flex gap-4 shadow-xl pointer-events-none">
                               {Object.entries(ROMAN_MAP).map(([k, v]) => (
                                   <div key={k} className="flex flex-col items-center">
                                       <span className="font-serif font-black text-rose-700 text-xl">{k}</span>
                                       <span className="text-xs font-mono text-slate-500 font-bold">{v}</span>
                                   </div>
                               ))}
                           </div>

                           {/* Total Accumulator Box (Theater) */}
                           {st.total !== undefined && (
                               <div className="absolute top-40 left-[120px] bg-slate-900 border-2 border-slate-800 rounded-[2rem] p-8 shadow-2xl flex items-center gap-10 min-w-[300px]">
                                   <div className="flex flex-col">
                                       <span className="text-xs font-black uppercase tracking-widest font-mono text-slate-400 mb-2">Running Total</span>
                                       <span className="text-6xl font-black font-mono text-emerald-400 leading-none">{st.total}</span>
                                   </div>
                                   
                                   {/* Math Operation visual */}
                                   {st.op && st.currVal !== undefined && (
                                       <div className="animate-in slide-in-from-right-4 fade-in duration-300 flex items-center gap-3 bg-slate-800 px-6 py-4 rounded-2xl border-2 border-slate-700 shadow-inner">
                                            <span className="text-slate-300 font-mono text-2xl font-bold">{st.oldTotal}</span>
                                            {st.op === 'add' ? <Plus size={24} className="text-emerald-400"/> : <Minus size={24} className="text-rose-400"/>}
                                            <span className={`font-mono font-black text-2xl ${st.op === 'add' ? 'text-emerald-400' : 'text-rose-400'}`}>{st.currVal}</span>
                                       </div>
                                   )}
                               </div>
                           )}

                           {/* Array Elements (Theater) */}
                           <div className="absolute flex gap-4" style={{ left: startX + 60, top: startY + 300 }}>
                               {(st.arr || []).map((val, idx) => {
                                  const isI = st.hl && st.hl.includes(idx);
                                  const isPast = selectedOpId === 'leftToRight' ? (st.i !== undefined && idx < st.i) : (st.i !== undefined && idx > st.i);
                                  
                                  let theme = 'slate';
                                  if (isI) theme = 'rose';
                                  else if (st.isSuccess) theme = 'emerald';
                                  else if (isPast) theme = 'slate'; 

                                  const labels = [];
                                  if (st.i === idx) labels.push({ text: "i", color: "rose", pos: "top" });
                                  if (st.nextI === idx) labels.push({ text: "i+1", color: "amber", pos: "bottom" });

                                  return (
                                      <div key={`arr-fs-${idx}`} className={`relative transition-all duration-500 scale-125 origin-top-left ${isPast ? 'opacity-40 grayscale' : ''}`}>
                                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                          
                                          <CharNodeBlock val={val} idx={idx} themeColor={theme} isTarget={isI} subValue={ROMAN_MAP[val]} />
                                      </div>
                                  )
                               })}
                           </div>

                           {/* Variables Tracker (Theater) */}
                           {selectedOpId === 'rightToLeft' && st.prevValue !== undefined && (
                               <div className="absolute left-[120px]" style={{ top: startY + 500 }}>
                                   <div className="bg-white border-4 border-slate-200 rounded-2xl p-6 shadow-2xl flex items-center gap-4 scale-110 origin-top-left">
                                       <span className="text-sm font-black uppercase tracking-widest font-mono text-slate-500">prevValue:</span>
                                       <span className="font-mono font-black text-rose-600 bg-rose-50 px-4 py-1 rounded-lg border-2 border-rose-200 text-2xl">{st.prevValue}</span>
                                   </div>
                               </div>
                           )}

                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-emerald-500/30`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 bg-emerald-500/20 text-emerald-500 ring-emerald-500/10`}>
                                    <PartyPopper size={48}/>
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    PARSING COMPLETE
                                </h2>
                                <p className={`font-mono text-sm uppercase mb-8 tracking-widest text-emerald-400`}>
                                    {String(curStepData.description)}
                                </p>
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