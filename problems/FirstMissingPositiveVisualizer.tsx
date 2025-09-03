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
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Target, Keyboard, Type, KeyRound, Box, Landmark, Calculator, Plus, Minus, History, Grid3x3, LayoutGrid, AlertOctagon, Repeat1
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  cyclicSort: {
    id: 'cyclicSort',
    title: '1. Cyclic Sort (Optimal)',
    icon: <Repeat1 size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public int firstMissingPositive(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        // While num is in range (1 to n) and not at its correct index (num - 1)
        while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
            // Swap nums[i] to its correct position: nums[i] - 1
            int temp = nums[nums[i] - 1];
            nums[nums[i] - 1] = nums[i];
            nums[i] = temp;
        }
    }
    
    // Find the first index where the value doesn't match index + 1
    for (int i = 0; i < n; i++) {
        if (nums[i] != i + 1) {
            return i + 1;
        }
    }
    
    return n + 1;
}`,
    desc: "The optimal O(N) Time and O(1) Space approach. We treat the array itself as a hash map. If we see a '5', we swap it to index 4. We repeat this 'Cyclic Sort' until every valid positive integer is at its correct index (i.e., nums[i] == i + 1). Finally, we scan the array to find the first index that violates this rule."
  },
  booleanArray: {
    id: 'booleanArray',
    title: '2. Boolean Array (O(N) Space)',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public int firstMissingPositive(int[] nums) {
    int n = nums.length;
    boolean[] present = new boolean[n + 1];
    
    for (int num : nums) {
        if (num > 0 && num <= n) {
            present[num] = true;
        }
    }
    
    for (int i = 1; i <= n; i++) {
        if (!present[i]) {
            return i;
        }
    }
    
    return n + 1;
}`,
    desc: "The naive but highly intuitive approach. The answer must be between 1 and N+1. We create a boolean array of size N+1. We iterate through nums and mark present[num] = true. Then, we scan the boolean array from 1 to N to find the first false value."
  }
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|return|if|else|for|while|continue|new|length|true|false)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-amber-500/20`, border: `border-amber-400`, text: `text-amber-300` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-amber-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'return', 'if', 'else', 'for', 'while', 'continue', 'new', 'true', 'false'].includes(part);
            const isVar = ['nums', 'n', 'i', 'temp', 'num', 'present'].includes(part);
            const isMapCall = ['length'].includes(part);

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isVar) className = 'text-amber-200';
            else if (isMapCall) className = 'text-sky-400';
            else if (!isNaN(parseInt(part))) className = 'text-emerald-400';

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
        orange: 'bg-orange-100 text-orange-700 border-orange-300',
        slate: 'bg-slate-100 text-slate-600 border-slate-300'
    };
    const activeColorClass = colorClasses[color] || colorClasses['slate'];
    const alignClass = position === 'top' ? 'flex-col-reverse -top-10' : 'flex-col -bottom-10';

    return (
        <div className={`absolute ${alignClass} flex items-center justify-center animate-in zoom-in duration-300 z-30`} style={{ transform: `translateX(${offset}px)`}}>
            <span className={`text-[11px] font-black font-mono px-2 py-0.5 rounded border shadow-sm ${activeColorClass} whitespace-nowrap`}>
                {String(label)}
            </span>
            {position === 'top' ? <ArrowDown size={16} className={`text-${color}-500`} strokeWidth={3}/> : <ArrowUp size={16} className={`text-${color}-500`} strokeWidth={3}/>}
        </div>
    );
};

interface ArrayNodeBlockProps {
  val: number;
  idx: number;
  themeColor?: string;
  isTarget?: boolean;
}

const ArrayNodeBlock: React.FC<ArrayNodeBlockProps> = ({ val, idx, themeColor = 'slate', isTarget }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', index: 'bg-emerald-100 text-emerald-600' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', index: 'bg-rose-100 text-rose-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        orange: { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-800', index: 'bg-orange-100 text-orange-600' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', index: 'bg-fuchsia-100 text-fuchsia-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' }
    };
    
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center w-16 h-20 border-2 rounded-xl transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-2xl bg-white/60 ${activeTheme.text}`}>
                    {String(val)}
                </div>
                <div className={`flex w-full h-6 border-t border-black/10 ${activeTheme.index}`}>
                    <div className="flex-1 flex items-center justify-center">
                         <span className="text-[10px] font-black tracking-widest uppercase">Idx {idx}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Application ---

export default function FirstMissingPositiveVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('cyclicSort');
  
  const [inputString, setInputString] = useState('3, 4, -1, 1');
  const [baseArray, setBaseArray] = useState([]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef(null);
  const selectedOp = OPERATIONS[selectedOpId];

  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 0, y: 0 }); 
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
    if (e.target.closest('button') || e.target.closest('textarea') || e.target.closest('input')) return;
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
      return str.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  };

  useEffect(() => {
    const arr = parseInput(inputString);
    setBaseArray(arr);
    setCurrentStep(0);
    setPan({ x: 0, y: 0 });
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
    if (!baseArray || baseArray.length === 0) return [{ phase: 'Init', description: 'Enter an array of numbers.', line: 0, state: { arr: [] } }];
    
    let arr = [...baseArray];
    let n = arr.length;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            arr: [...arr],
            n,
            ...st 
        } 
    });

    if (selectedOpId === 'cyclicSort') {
        add("Initialize", `Store length of array n = ${n}. Start Pass 1: Cyclic Sort.`, 2, {});

        // Pass 1: Cyclic Sort
        for (let i = 0; i < n; i++) {
            add("For Loop Start", `Evaluate index i = ${i}. Value here is ${arr[i]}.`, 3, { i, hl: [i] });

            while (true) {
                let val = arr[i];
                let targetIdx = val - 1;
                
                add("While Condition Check", `Check: Is (${val} > 0) AND (${val} <= ${n}) AND (nums[${targetIdx}] != ${val})?`, 4, { i, val, targetIdx, hl: [i] });

                if (val > 0 && val <= n && arr[targetIdx] !== val) {
                    add("Condition Passed", `Value ${val} belongs at index ${targetIdx}. Current value at index ${targetIdx} is ${arr[targetIdx]}. They differ. SWAP!`, 4, { i, val, targetIdx, isTargetActive: true, hl: [i, targetIdx] });
                    
                    // Do Swap
                    let temp = arr[targetIdx];
                    arr[targetIdx] = arr[i];
                    arr[i] = temp;
                    
                    add("Swap Executed", `Swapped element at index ${i} with element at index ${targetIdx}.`, 7, { i, targetIdx, hl: [i, targetIdx], isSwapped: true });
                } else {
                    let failReason = "";
                    if (val <= 0) failReason = "Value is <= 0 (out of bounds).";
                    else if (val > n) failReason = `Value is > n (${n}) (out of bounds).`;
                    else failReason = `Value ${val} is already at its correct index ${targetIdx}.`;

                    add("Condition Failed", `${failReason} Break out of while loop. Move to next i.`, 4, { i, val, hl: [i], failReason });
                    break;
                }
            }
        }

        add("Pass 1 Complete", "Array is now cyclically sorted. All valid positive integers are at their correct indices. Start Pass 2.", 9, { pass: 2 });

        // Pass 2: Find first missing
        let found = false;
        for (let i = 0; i < n; i++) {
            add("Pass 2: Check Index", `Check index i = ${i}. Expected value is ${i + 1}. Actual is ${arr[i]}.`, 10, { i, pass: 2, hl: [i] });
            
            add("If Condition", `if (nums[${i}] (${arr[i]}) != ${i + 1})`, 11, { i, pass: 2, hl: [i] });

            if (arr[i] !== i + 1) {
                add("Mismatch Found!", `Value ${arr[i]} does not match expected ${i + 1}. We found our first missing positive!`, 12, { i, pass: 2, isSuccess: true, result: i + 1, hl: [i] });
                found = true;
                break;
            } else {
                add("Match", `Value matches expected. Continue scanning.`, 11, { i, pass: 2, hl: [i] });
            }
        }

        if (!found) {
            add("Array Complete", `All indices 0 to ${n-1} had correct values 1 to ${n}. The next missing positive is n + 1 (${n + 1}).`, 15, { pass: 2, isSuccess: true, result: n + 1 });
        }

    } else if (selectedOpId === 'booleanArray') {
        let present = new Array(n + 1).fill(false);
        
        add("Initialize Arrays", `Create a boolean array 'present' of size ${n + 1} to track seen numbers.`, 3, { present: [...present] });

        for (let i = 0; i < n; i++) {
            let num = arr[i];
            add("Read Value", `Iterating array: Read num = ${num}.`, 5, { i, num, hl: [i], present: [...present] });
            
            add("Condition Check", `if (${num} > 0 && ${num} <= ${n}) -> Is it a valid positive in range?`, 6, { i, num, hl: [i], present: [...present] });

            if (num > 0 && num <= n) {
                present[num] = true;
                add("Mark Present", `Valid! Mark present[${num}] = true.`, 7, { i, num, hl: [i], present: [...present], justMarked: num });
            } else {
                add("Skip Item", `Invalid range. Ignore ${num}.`, 6, { i, num, hl: [i], present: [...present] });
            }
        }

        add("Pass 1 Complete", `All items evaluated. Now scan the boolean array from 1 to ${n}.`, 10, { present: [...present], pass: 2 });

        let found = false;
        for (let i = 1; i <= n; i++) {
            add("Scan Boolean Array", `Check present[${i}]. Is it false?`, 11, { i, pass: 2, present: [...present], checkingBool: i });
            
            if (!present[i]) {
                add("Missing Found!", `present[${i}] is false! Returning ${i}.`, 12, { i, pass: 2, present: [...present], isSuccess: true, result: i, checkingBool: i });
                found = true;
                break;
            }
        }

        if (!found) {
            add("All Present", `Boolean array had true for 1 to ${n}. Returning ${n + 1}.`, 16, { pass: 2, present: [...present], isSuccess: true, result: n + 1 });
        }
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

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-amber-500 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <Search className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">First Missing Positive</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      LC 41 • Array Hard
                  </span>
                  <span>•</span>
                  <span>Cyclic Sort</span>
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
                    <div className="flex items-center gap-3 text-amber-600 font-black text-2xl uppercase tracking-tighter"><Search size={28}/> Finding the Unseen</div>
                    <p className="text-lg leading-relaxed max-w-3xl">
                      Given an unsorted integer array <code>nums</code>, return the smallest missing positive integer. You must implement an algorithm that runs in <code>O(n)</code> time and uses <code>O(1)</code> auxiliary space.
                    </p>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white space-y-4 overflow-x-auto whitespace-nowrap">
                       <div><span className="text-amber-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Example Input</span>
                       nums = [3, 4, -1, 1]</div>
                       <div><span className="text-emerald-400 block mb-1 uppercase text-[10px] font-black tracking-widest mt-2">Expected Output</span>
                       2 <span className="opacity-50 text-xs ml-2">// 1 is present, 2 is the next missing positive.</span></div>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed text-slate-600">The <code>O(1)</code> space constraint is the real challenge. It means we cannot create a new boolean array or a HashSet to track which numbers we've seen. We must modify the input array in-place.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Repeat1 size={16} className="text-amber-500"/> The Cyclic Swap</h4>
                        <p className="text-sm leading-relaxed text-slate-600">We treat the array indices as the map keys. A number <code>x</code> belongs at index <code>x-1</code>. We loop through, and swap elements until every valid positive number is sitting exactly in its correct chair.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-amber-500 text-white border-amber-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-amber-100' : 'text-slate-400'}`}>{op.complexity}</div>
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

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-amber-600 pl-1 flex justify-between">
                                <span>Input Array (comma separated numbers)</span>
                            </label>
                            <input 
                                type="text"
                                value={inputString} 
                                onChange={(e) => setInputString(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-inner" 
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center">
                            <div className="hidden lg:flex items-center gap-1.5 mr-2 text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                                <Keyboard size={14} />
                                <span className="text-[9px] font-mono uppercase tracking-widest font-bold">Use &larr; &rarr;</span>
                            </div>
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep} className={`px-6 py-3 bg-amber-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
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
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Target Found</div>
                            <p className="text-sm leading-relaxed text-white mt-1 font-mono font-bold tracking-tight">{String(curStepData.description)}</p>
                         </div>
                    ) : (
                        <>
                            <div className="text-lg font-black tracking-tight mb-1 uppercase font-mono text-white leading-none truncate">{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-2 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 min-h-[380px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Layout size={14} className="text-amber-500"/> Array Memory Layout</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className="p-1.5 text-slate-600 hover:text-amber-600 rounded-lg transition-colors"><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className="p-1.5 text-slate-600 hover:text-amber-600 rounded-lg transition-colors"><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className="p-1.5 text-slate-600 hover:text-amber-600 rounded-lg transition-colors"><Maximize size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex items-center justify-center p-8" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* Flex Layout for nodes */}
                           <div className="flex flex-col gap-16 items-start w-max">
                               
                               <div className="flex gap-4">
                                   {(st.arr || []).map((val, idx) => {
                                      // Determine highlighting logic
                                      const isI = st.i === idx;
                                      const isTarget = st.targetIdx === idx && st.isTargetActive;
                                      const isCorrect = val === idx + 1 && (st.pass === 2 || selectedOpId === 'cyclicSort');

                                      let theme = 'slate';
                                      if (isTarget) theme = 'fuchsia';
                                      else if (isI) theme = 'amber';
                                      else if (isCorrect) theme = 'emerald';

                                      const labels = [];
                                      if (isI) labels.push({ text: "i", color: "amber", pos: "top" });
                                      if (isTarget) labels.push({ text: "val - 1", color: "fuchsia", pos: "bottom" });

                                      return (
                                          <div key={`arr-${idx}`} className="relative">
                                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                              
                                              <ArrayNodeBlock val={val} idx={idx} themeColor={theme} isTarget={isI || isTarget} />
                                          </div>
                                      )
                                   })}
                               </div>

                               {/* Boolean Array tracker if selected */}
                               {selectedOpId === 'booleanArray' && st.present && (
                                   <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-xl flex flex-col">
                                       <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                                           <Database size={14} className="text-amber-500"/> boolean[] present
                                       </div>
                                       <div className="flex gap-2">
                                           {st.present.map((isPres, idx) => {
                                               const isJustMarked = st.justMarked === idx;
                                               const isChecking = st.checkingBool === idx;
                                               let bgClass = isPres ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-slate-100 text-slate-400 border-slate-200';
                                               if (isJustMarked) bgClass += ' animate-in zoom-in ring-4 ring-emerald-300';
                                               if (isChecking) bgClass += ' ring-4 ring-amber-400 scale-110';
                                               
                                               return (
                                                   <div key={`bool-${idx}`} className={`flex flex-col items-center w-10 border rounded transition-all duration-300 shadow-sm ${bgClass}`}>
                                                       <span className="text-[8px] font-black font-mono border-b border-inherit w-full text-center py-0.5 opacity-80">{idx}</span>
                                                       <span className="font-mono text-xs font-black py-1">{isPres ? 'T' : 'F'}</span>
                                                   </div>
                                               )
                                           })}
                                       </div>
                                   </div>
                               )}
                           </div>

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
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Repeat1 size={120}/></div>
                        <h3 className="font-black text-amber-500 text-lg uppercase tracking-widest mb-6">Cyclic Sort Concept</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>The problem asks for $O(N)$ time and $O(1)$ space. The $O(1)$ space requirement implies we must mutate the input array to store information.</p>
                            <p>For an array of length $N$, the first missing positive integer must be in the range $[1, N+1]$. Why? Even if the array is perfectly packed <code>[1, 2, 3, 4]</code>, the answer is 5. Any number outside this range (e.g., -1, 0, or 100) is completely useless to us.</p>
                            <p>We try to place every valid number $x$ at index $x-1$. So 1 goes to index 0, 5 goes to index 4. We swap until we can't swap anymore.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-amber-50 border border-amber-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-amber-700 text-lg uppercase tracking-widest mb-6">The While Loop Danger</h3>
                        <div className="space-y-4 text-sm text-amber-900/80 leading-relaxed font-medium">
                            <p>You might notice a <code>while</code> loop inside the <code>for</code> loop. Doesn't that make it $O(N^2)$?</p>
                            <p>No! Every successful swap places at least one number in its correct, final position. Since there are only $N$ numbers, we can perform a maximum of $N$ successful swaps across the entire algorithm.</p>
                            <p>Thus, the inner while loop operations are amortized over the outer loop, resulting in a strict $O(N)$ overall time complexity.</p>
                        </div>
                    </div>

                    <div className="p-8 md:col-span-2 rounded-3xl bg-slate-50 border border-slate-200 relative overflow-hidden shadow-inner flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
                            <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest mb-4">Infinite Loop Trap</h3>
                            <p>Look carefully at the third condition in the while loop: <code>nums[nums[i] - 1] != nums[i]</code>.</p>
                            <p>This translates to: "Is the number at my target destination different from myself?"</p>
                            <p>If we have an array with duplicates, like <code>[1, 1]</code>. The first 1 is fine. The second 1 wants to go to index 0. But index 0 already has a 1! If we didn't check for this, we would infinitely swap the two 1s back and forth forever.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-amber-500 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-amber-600">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering Array 'Hard' Questions</h3>
                    <p className="text-sm text-amber-50 leading-relaxed italic max-w-2xl font-mono">"This is a classic 'Hard' problem because the logic trick (using indices as hash keys) is not immediately obvious. Walk the interviewer through your thought process step-by-step using these exact talking points."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-amber-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Card 1 */}
                        <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-amber-800 text-sm uppercase tracking-widest">
                               <div className="bg-amber-200 p-2 rounded-lg text-amber-700"><Goal size={16}/></div>
                               1. Establish Bounds
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-amber-100 shadow-inner flex-1">
                                "If an array has N elements, the absolute best-case scenario is that it contains exactly 1 through N. In that case, the missing number is N+1. Otherwise, the missing number must be $\le$ N. Therefore, we ONLY care about values in the range [1, N]."
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-amber-800 text-sm uppercase tracking-widest">
                               <div className="bg-amber-200 p-2 rounded-lg text-amber-700"><ListOrdered size={16}/></div>
                               2. Propose O(N) Space First
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-amber-100 shadow-inner flex-1">
                                "I can easily solve this using O(N) extra Space. I would create a boolean array of size N+1, iterate through the input to mark seen numbers as 'true', and then scan to find the first 'false'. But the prompt strictly asks for O(1) space..."
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-amber-800 text-sm uppercase tracking-widest">
                               <div className="bg-amber-200 p-2 rounded-lg text-amber-700"><Repeat1 size={16}/></div>
                               3. Introduce Cyclic Sort
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-amber-100 shadow-inner flex-1">
                                "...To achieve O(1) Space, I need to encode that boolean logic directly into the input array. Since we only care about numbers 1 to N, I can use the array indices as a hash map and swap every valid number 'x' to index 'x - 1'."
                            </p>
                        </div>

                        {/* Card 4 */}
                        <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-amber-800 text-sm uppercase tracking-widest">
                               <div className="bg-amber-200 p-2 rounded-lg text-amber-700"><Zap size={16}/></div>
                               4. Defend Time Complexity
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-amber-100 shadow-inner flex-1">
                                "You might notice a while loop inside the for loop. However, every successful swap places at least one number in its final position. With N slots, we do at most N successful swaps overall. This makes it strictly amortized O(N) time."
                            </p>
                        </div>

                        {/* Card 5 */}
                        <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-amber-800 text-sm uppercase tracking-widest">
                               <div className="bg-amber-200 p-2 rounded-lg text-amber-700"><ShieldAlert size={16}/></div>
                               5. Prevent Infinite Loops
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-amber-100 shadow-inner flex-1">
                                "There's a critical trap: duplicates. If the array is [1, 1], the second '1' tries to swap into index 0, but it already has a '1'. To prevent an infinite swap loop, my while condition MUST explicitly verify that the target destination doesn't already hold the same value (nums[nums[i] - 1] != nums[i])."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[650px] 2xl:w-[800px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110] shrink-0">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className="bg-amber-500 p-2 rounded-lg text-white shadow-lg shadow-amber-900/50"><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 whitespace-pre-wrap">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4 overflow-x-auto">
                        <div className="min-w-max">
                            {selectedOp.code.split('\n').map((line, idx) => (
                                <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                            ))}
                        </div>
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
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? 'bg-amber-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-80 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-amber-600 pl-1">Input Array (comma separated)</label>
                              <input type="text" value={inputString} onChange={(e) => setInputString(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-inner" />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-amber-600 rounded-xl hover:bg-amber-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-amber-600 rounded-xl hover:bg-amber-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className="p-3 text-slate-600 hover:text-amber-600 rounded-xl hover:bg-amber-50 transition-all"><RotateCcw size={24}/></button>
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
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className="px-12 py-6 bg-amber-500 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(245,158,11,0.3)] hover:bg-amber-600 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-amber-400 shadow-amber-900/20">NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-500" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* Theater Layout: Flex container forces perfect gap without overlaps */}
                           <div className="p-16 pt-40 flex flex-col items-center justify-center gap-20 min-w-max h-full">
                               
                               <div className="flex gap-6">
                                   {(st.arr || []).map((val, idx) => {
                                      // Determine highlighting logic
                                      const isI = st.i === idx;
                                      const isTarget = st.targetIdx === idx && st.isTargetActive;
                                      const isCorrect = val === idx + 1 && (st.pass === 2 || selectedOpId === 'cyclicSort');

                                      let theme = 'slate';
                                      if (isTarget) theme = 'fuchsia';
                                      else if (isI) theme = 'amber';
                                      else if (isCorrect) theme = 'emerald';

                                      const labels = [];
                                      if (isI) labels.push({ text: "i", color: "amber", pos: "top" });
                                      if (isTarget) labels.push({ text: "val - 1", color: "fuchsia", pos: "bottom" });

                                      return (
                                          <div key={`arr-fs-${idx}`} className="relative scale-125 mx-2">
                                              <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                              
                                              <ArrayNodeBlock val={val} idx={idx} themeColor={theme} isTarget={isI || isTarget} />
                                          </div>
                                      )
                                   })}
                               </div>

                               {/* Boolean Array tracker if selected (Theater) */}
                               {selectedOpId === 'booleanArray' && st.present && (
                                   <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-2xl flex flex-col mt-10 scale-125">
                                       <div className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
                                           <Database size={18} className="text-amber-500"/> boolean[] present memory
                                       </div>
                                       <div className="flex gap-3">
                                           {st.present.map((isPres, idx) => {
                                               const isJustMarked = st.justMarked === idx;
                                               const isChecking = st.checkingBool === idx;
                                               let bgClass = isPres ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-slate-100 text-slate-400 border-slate-200';
                                               if (isJustMarked) bgClass += ' animate-in zoom-in ring-4 ring-emerald-300';
                                               if (isChecking) bgClass += ' ring-4 ring-amber-400 scale-110';
                                               
                                               return (
                                                   <div key={`bool-fs-${idx}`} className={`flex flex-col items-center w-14 border-2 rounded-xl transition-all duration-300 shadow-md ${bgClass}`}>
                                                       <span className="text-[10px] font-black font-mono border-b-2 border-inherit w-full text-center py-1 opacity-80">{idx}</span>
                                                       <span className="font-mono text-lg font-black py-2">{isPres ? 'T' : 'F'}</span>
                                                   </div>
                                               )
                                           })}
                                       </div>
                                   </div>
                               )}
                           </div>
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
                                    MISSING FOUND: {st.result}
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