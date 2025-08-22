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
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Target, Keyboard, Type, KeyRound, Box, Landmark, Calculator, Plus, Minus, History, Grid3x3, LayoutGrid, AlertOctagon, Repeat1, AlignLeft, XSquare, ArrowRightLeft, TrendingUp, SearchCode, Languages, Link2, Puzzle, Users, ArrowLeftRight
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  reverseOptimal: {
    id: 'reverseOptimal',
    title: '1. Array Reversal (Optimal)',
    icon: <ArrowLeftRight size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public void rotate(int[] nums, int k) {
    int n = nums.length;
    k = k % n;
    reverse(nums, 0, n - 1);
    reverse(nums, 0, k - 1);
    reverse(nums, k, n - 1);
}

private void reverse(int[] nums, int start, int end) {
    while (start < end) {
        int temp = nums[start];
        nums[start] = nums[end];
        nums[end] = temp;
        start++;
        end--;
    }
}`,
    desc: "The ingenious O(1) Space approach. It works in 3 phases: 1) Reverse the entire array. 2) Reverse the first 'k' elements. 3) Reverse the remaining 'n - k' elements. This effectively rotates the array in-place without needing extra memory."
  },
  extraArray: {
    id: 'extraArray',
    title: '2. Extra Array (O(N) Space)',
    icon: <Copy size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public void rotate(int[] nums, int k) {
    int n = nums.length;
    int[] a = new int[n];
    
    for (int i = 0; i < n; i++) {
        a[(i + k) % n] = nums[i];
    }
    
    for (int i = 0; i < n; i++) {
        nums[i] = a[i];
    }
}`,
    desc: "The intuitive approach. We create a new array of the same size. We iterate through the original array, placing each element at its new, rotated index using the modulo operator: (i + k) % n. Finally, we copy the new array back into the original."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|return|if|else|for|while|continue|new|length)\b|\b\d+\b|[\+\-\*\/\%\=\<\>])/g).filter(Boolean);
  const activeStyles = { bg: `bg-sky-500/20`, border: `border-sky-400`, text: `text-sky-300` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-sky-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'void', 'int', 'return', 'if', 'else', 'for', 'while', 'continue', 'new'].includes(part);
            const isVar = ['nums', 'k', 'n', 'start', 'end', 'temp', 'a', 'i', 'reverse'].includes(part);
            const isMapCall = ['length'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>'].includes(part.trim());

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isVar) className = 'text-sky-200';
            else if (isMapCall) className = 'text-amber-400';
            else if (isOperator) className = 'text-fuchsia-400 font-bold';
            else if (!isNaN(parseInt(part.trim())) && part.trim() !== '') className = 'text-emerald-400';

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
}

const PointerLabel: React.FC<PointerLabelProps> = ({ label, color, position }) => {
    const colorClasses = {
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
        sky: 'bg-sky-100 text-sky-700 border-sky-300',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300',
        cyan: 'bg-cyan-100 text-cyan-700 border-cyan-300',
        rose: 'bg-rose-100 text-rose-700 border-rose-300',
        amber: 'bg-amber-100 text-amber-700 border-amber-300',
        orange: 'bg-orange-100 text-orange-700 border-orange-300',
        indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
        slate: 'bg-slate-100 text-slate-600 border-slate-300'
    };
    const activeColorClass = colorClasses[color] || colorClasses['slate'];
    const alignClass = position === 'top' ? 'flex-col-reverse -top-10' : 'flex-col -bottom-10';

    return (
        <div className={`absolute ${alignClass} flex items-center justify-center animate-in zoom-in duration-300 z-30 pointer-events-none`}>
            <span className={`text-[11px] font-black font-mono px-2 py-0.5 rounded border shadow-sm ${activeColorClass} whitespace-nowrap`}>
                {String(label)}
            </span>
            {position === 'top' ? <ArrowDown size={14} className={`text-${color}-500`} strokeWidth={3}/> : <ArrowUp size={14} className={`text-${color}-500`} strokeWidth={3}/>}
        </div>
    );
};

interface NodeBlockProps {
  val: string | number | null;
  idx?: number;
  themeColor?: string;
  isTarget?: boolean;
}

const NodeBlock: React.FC<NodeBlockProps> = ({ val, idx, themeColor = 'slate', isTarget }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', index: 'bg-emerald-100 text-emerald-600' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', index: 'bg-sky-100 text-sky-600' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', index: 'bg-fuchsia-100 text-fuchsia-600' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', index: 'bg-rose-100 text-rose-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        orange: { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-800', index: 'bg-orange-100 text-orange-600' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800', index: 'bg-indigo-100 text-indigo-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' }
    };
    
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;

    const displayVal = val === null ? '_' : String(val);

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center min-w-[56px] min-h-[64px] border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-xl px-2 py-2 bg-white/60 ${activeTheme.text}`}>
                    {displayVal}
                </div>
                {idx !== undefined && (
                    <div className={`flex w-full h-5 border-t border-black/10 ${activeTheme.index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className="text-[9px] font-black tracking-widest uppercase">{idx}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Application ---

export default function RotateArrayVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('reverseOptimal');
  
  const [inputString, setInputString] = useState('1, 2, 3, 4, 5, 6, 7');
  const [inputK, setInputK] = useState('3');
  
  const [baseArray, setBaseArray] = useState([]);
  const [targetK, setTargetK] = useState(3);
  
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
    const kVal = parseInt(inputK);
    setBaseArray(arr);
    setTargetK(isNaN(kVal) ? 0 : Math.max(0, kVal));
    setCurrentStep(0);
    setPan({ x: 0, y: 0 });
  }, [inputString, inputK, selectedOpId]);

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
    if (!baseArray || baseArray.length === 0) return [{ phase: 'Init', description: 'Enter an array of numbers.', line: 0, state: { nums: [] } }];

    let nums = [...baseArray];
    let n = nums.length;
    let k = targetK;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            nums: [...nums],
            n,
            k,
            ...st 
        } 
    });

    if (selectedOpId === 'reverseOptimal') {
        add("Length Check", `int n = nums.length; Array length is ${n}.`, 2, {});
        
        let oldK = k;
        k = k % n;
        add("Effective K Calculation", `k = k % n -> ${oldK} % ${n} = ${k}. If k is larger than the array, this effectively drops redundant full rotations.`, 3, { k });

        const doReverse = (start, end, phaseName, callLine) => {
            add("Call Reverse", `reverse(nums, ${start}, ${end}); Initiate ${phaseName}.`, callLine, { start, end, phaseName });
            
            let s = start;
            let e = end;
            let temp = null;

            while (true) {
                add("While Condition", `while (start < end) -> Is ${s} < ${e}?`, 10, { start: s, end: e, phaseName, temp, checkingWhile: true });
                if (s >= e) {
                    add("While Ends", `No. ${s} is not < ${e}. Reverse complete.`, 10, { start: s, end: e, phaseName, temp, isFailWhile: true });
                    break;
                }

                add("Condition Passed", `Yes. ${s} < ${e}. Proceed to swap.`, 10, { start: s, end: e, phaseName, temp });
                
                temp = nums[s];
                add("Store Temp", `int temp = nums[start] -> temp = ${temp}.`, 11, { start: s, end: e, phaseName, temp, hlS: s });
                
                nums[s] = nums[e];
                add("Overwrite Start", `nums[start] = nums[end] -> nums[${s}] = ${nums[e]}.`, 12, { start: s, end: e, phaseName, temp, justSwappedS: true, hlS: s, hlE: e });
                
                nums[e] = temp;
                add("Overwrite End", `nums[end] = temp -> nums[${e}] = ${temp}.`, 13, { start: s, end: e, phaseName, temp, justSwappedE: true, hlS: s, hlE: e });
                
                s++;
                add("Increment Start", `start++ -> start moves to ${s}.`, 14, { start: s, end: e, phaseName, temp });
                
                e--;
                add("Decrement End", `end-- -> end moves to ${e}.`, 15, { start: s, end: e, phaseName, temp });
            }
        };

        if (n > 0 && k > 0) {
            doReverse(0, n - 1, "Phase 1: Full Array", 4);
            doReverse(0, k - 1, "Phase 2: First k Elements", 5);
            doReverse(k, n - 1, "Phase 3: Remaining Elements", 6);
        } else {
            add("Skip Reverse", `k is 0 or array is empty. No rotations needed.`, 4, {});
        }

        add("Return", `Array successfully rotated in O(1) space!`, 7, { isSuccess: true });

    } else if (selectedOpId === 'extraArray') {
        add("Length Check", `int n = nums.length; Array length is ${n}.`, 2, {});
        
        let a = new Array(n).fill(null);
        add("Allocate Extra Array", `int[] a = new int[n]; Initialize an empty array of size ${n}.`, 3, { a: [...a] });

        for (let i = 0; i < n; i++) {
            add("Loop 1 Condition", `for (int i = ${i}; i < ${n}; i++) -> Copy out phase.`, 4, { a: [...a], iPhase1: i });
            
            let targetIdx = (i + k) % n;
            add("Modulo Math", `target = (${i} + ${k}) % ${n} = ${targetIdx}.`, 5, { a: [...a], iPhase1: i, targetIdx, calcTarget: true });
            
            a[targetIdx] = nums[i];
            add("Copy to Target", `a[${targetIdx}] = nums[${i}] (${nums[i]}).`, 5, { a: [...a], iPhase1: i, targetIdx, justCopiedA: targetIdx });
        }

        add("Loop 1 End", `Finished copying elements to rotated positions in extra array 'a'.`, 6, { a: [...a] });

        for (let i = 0; i < n; i++) {
            add("Loop 2 Condition", `for (int i = ${i}; i < ${n}; i++) -> Copy back phase.`, 7, { a: [...a], iPhase2: i });
            
            nums[i] = a[i];
            add("Copy Back", `nums[${i}] = a[${i}] (${a[i]}).`, 8, { a: [...a], iPhase2: i, justCopiedNums: i });
        }

        add("Return", `Original array updated. Rotation complete.`, 10, { a: [...a], isSuccess: true });
    }

    return steps;
  }, [baseArray, targetK, selectedOpId]);

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

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { nums: [] } };
  const st = curStepData.state || { nums: [] };
  const isLastStep = currentStep === trace.length - 1;

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-sky-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <RotateCcw className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Rotate Array</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                      LC 189 • Arrays & Math
                  </span>
                  <span>•</span>
                  <span>O(1) Space Constraint</span>
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
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-8 flex flex-col">
                <div className="flex items-center gap-3 text-sky-600 font-black text-2xl uppercase tracking-tighter"><AlignLeft size={28}/> Problem Statement</div>
                
                <p className="text-base leading-relaxed">
                  Given an integer array <code>nums</code>, rotate the array to the right by <code>k</code> steps, where <code>k</code> is non-negative.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-sky-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-sky-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> nums = [1,2,3,4,5,6,7], k = 3</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> [5,6,7,1,2,3,4]</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation:<br/>rotate 1 steps to the right: [7,1,2,3,4,5,6]<br/>rotate 2 steps to the right: [6,7,1,2,3,4,5]<br/>rotate 3 steps to the right: [5,6,7,1,2,3,4]</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-orange-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-orange-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> nums = [-1,-100,3,99], k = 2</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> [3,99,-1,-100]</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: <br/>rotate 1 steps to the right: [99,-1,-100,3]<br/>rotate 2 steps to the right: [3,99,-1,-100]</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Follow-up</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-1">
                        <li>1 &lt;= nums.length &lt;= 10<sup>5</sup></li>
                        <li>-2<sup>31</sup> &lt;= nums[i] &lt;= 2<sup>31</sup> - 1</li>
                        <li>0 &lt;= k &lt;= 10<sup>5</sup></li>
                        <li className="font-bold text-sky-600 mt-2">Follow up: Could you do it in-place with O(1) extra space?</li>
                    </ul>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-sky-600 text-white border-sky-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-sky-200' : 'text-slate-400'}`}>{op.complexity}</div>
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
                    <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-end">
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-sky-600 pl-1 flex justify-between">
                                <span>Input Array (nums)</span>
                            </label>
                            <input 
                                type="text"
                                value={inputString} 
                                onChange={(e) => setInputString(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-inner" 
                                spellCheck={false}
                            />
                        </div>
                        <div className="w-full xl:w-24 space-y-1.5 group shrink-0">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-orange-600 pl-1 flex justify-between">
                                <span>Steps (k)</span>
                            </label>
                            <input 
                                type="number"
                                value={inputK} 
                                onChange={(e) => setInputK(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-inner text-center font-black text-orange-600" 
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center w-full xl:w-auto mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-3 bg-sky-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-sky-200 hover:bg-sky-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
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
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Rotation Complete</div>
                            <p className="text-sm leading-relaxed text-white mt-1 font-mono font-bold tracking-tight">{String(curStepData.description)}</p>
                         </div>
                    ) : (
                        <>
                            <div className="text-lg font-black tracking-tight mb-1 uppercase font-mono text-white leading-none truncate">{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-2 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 min-h-[440px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Layout size={14} className="text-sky-500"/> Variable State</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className="p-1.5 text-slate-600 hover:text-sky-600 rounded-lg transition-colors"><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className="p-1.5 text-slate-600 hover:text-sky-600 rounded-lg transition-colors"><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className="p-1.5 text-slate-600 hover:text-sky-600 rounded-lg transition-colors"><Maximize size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-20 pb-16 gap-8 items-center overflow-x-auto overflow-y-hidden scrollbar-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* --- Strict Flexbox Layout --- */}

                           {/* Row 1: Variables */}
                           <div className="flex gap-4 mb-2 flex-wrap justify-center">
                                <div className="bg-slate-800 text-white p-3 rounded-xl border border-slate-700 shadow-md flex flex-col items-center min-w-[80px]">
                                    <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">n (Length)</span>
                                    <span className="font-mono text-xl font-black text-white">{st.n !== undefined ? st.n : '?'}</span>
                                </div>
                                <div className="bg-slate-800 text-white p-3 rounded-xl border border-slate-700 shadow-md flex flex-col items-center min-w-[80px]">
                                    <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">k (Steps)</span>
                                    <span className="font-mono text-xl font-black text-orange-400">{st.k !== undefined ? st.k : '?'}</span>
                                </div>

                                {selectedOpId === 'reverseOptimal' && st.start !== undefined && (
                                    <>
                                    <div className="bg-sky-900 text-white p-3 rounded-xl border border-sky-700 shadow-md flex flex-col items-center min-w-[80px]">
                                        <span className="text-[9px] uppercase tracking-widest font-bold text-sky-300">Start Idx</span>
                                        <span className="font-mono text-xl font-black text-sky-100">{st.start}</span>
                                    </div>
                                    <div className="bg-fuchsia-900 text-white p-3 rounded-xl border border-fuchsia-700 shadow-md flex flex-col items-center min-w-[80px]">
                                        <span className="text-[9px] uppercase tracking-widest font-bold text-fuchsia-300">End Idx</span>
                                        <span className="font-mono text-xl font-black text-fuchsia-100">{st.end}</span>
                                    </div>
                                    {st.temp !== null && st.temp !== undefined && (
                                        <div className="bg-amber-900 text-white p-3 rounded-xl border border-amber-700 shadow-md flex flex-col items-center min-w-[80px] animate-in slide-in-from-left-2">
                                            <span className="text-[9px] uppercase tracking-widest font-bold text-amber-300">Temp</span>
                                            <span className="font-mono text-xl font-black text-amber-100">{st.temp}</span>
                                        </div>
                                    )}
                                    </>
                                )}

                                {selectedOpId === 'extraArray' && (st.iPhase1 !== undefined || st.iPhase2 !== undefined) && (
                                    <>
                                    <div className="bg-sky-900 text-white p-3 rounded-xl border border-sky-700 shadow-md flex flex-col items-center min-w-[80px]">
                                        <span className="text-[9px] uppercase tracking-widest font-bold text-sky-300">Index i</span>
                                        <span className="font-mono text-xl font-black text-sky-100">{st.iPhase1 !== undefined ? st.iPhase1 : st.iPhase2}</span>
                                    </div>
                                    {st.targetIdx !== undefined && (
                                        <div className="bg-emerald-900 text-white p-3 rounded-xl border border-emerald-700 shadow-md flex flex-col items-center min-w-[100px] animate-in slide-in-from-left-2">
                                            <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-300">Target Mod</span>
                                            <div className="font-mono text-[10px] text-emerald-200">({st.iPhase1} + {st.k}) % {st.n}</div>
                                            <span className="font-mono text-xl font-black text-emerald-100">{st.targetIdx}</span>
                                        </div>
                                    )}
                                    </>
                                )}
                           </div>

                           {/* Row 2: Input Array (nums) */}
                           <div className="flex flex-col items-center w-full max-w-4xl">
                               <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono mb-2">Original Array (nums)</div>
                               <div className="flex gap-2 p-3 border-2 border-slate-200 bg-white/90 rounded-2xl shadow-lg backdrop-blur-sm flex-wrap justify-center w-full">
                                   {(st.nums || []).length === 0 && <span className="text-slate-400 italic">empty</span>}
                                   {(st.nums || []).map((val, idx) => {
                                       let color = 'slate';
                                       let isHl = false;
                                       let labels = [];

                                       if (selectedOpId === 'reverseOptimal') {
                                           if (st.start === idx) {
                                               color = 'sky'; isHl = true;
                                               labels.push({ text: 'start', color: 'sky', pos: 'top' });
                                           }
                                           if (st.end === idx) {
                                               color = 'fuchsia'; isHl = true;
                                               labels.push({ text: 'end', color: 'fuchsia', pos: 'bottom' });
                                           }
                                           if (st.justSwappedS && st.start === idx) color = 'emerald';
                                           if (st.justSwappedE && st.end === idx) color = 'emerald';
                                       } else {
                                           if (st.iPhase1 === idx) {
                                               color = 'sky'; isHl = true;
                                               labels.push({ text: 'i', color: 'sky', pos: 'top' });
                                           }
                                           if (st.justCopiedNums === idx) {
                                               color = 'emerald'; isHl = true;
                                               labels.push({ text: 'pasted', color: 'emerald', pos: 'top' });
                                           }
                                           if (st.iPhase2 === idx) {
                                               color = 'orange'; isHl = true;
                                           }
                                       }

                                       if (st.isSuccess) color = 'emerald';

                                       return (
                                           <div key={`num-${idx}`} className="relative scale-90 md:scale-100 m-1">
                                               <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                               <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                               
                                               <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} />
                                           </div>
                                       )
                                   })}
                               </div>
                           </div>

                           {/* Row 3: Extra Array (if Extra Array approach) */}
                           {selectedOpId === 'extraArray' && st.a && (
                               <div className="flex flex-col items-center w-full max-w-4xl mt-4">
                                   <div className="text-[10px] font-black text-orange-600 uppercase tracking-widest font-mono mb-2 flex items-center gap-1"><Copy size={12}/> Extra Array (a)</div>
                                   <div className="flex gap-2 p-3 border-2 border-orange-200 bg-orange-50/80 rounded-2xl shadow-lg backdrop-blur-sm flex-wrap justify-center w-full">
                                        {(st.a || []).map((val, idx) => {
                                            let color = 'slate';
                                            let isHl = false;
                                            let labels = [];

                                            if (st.targetIdx === idx) {
                                                color = 'orange'; isHl = true;
                                                labels.push({ text: 'target', color: 'orange', pos: 'bottom' });
                                            }
                                            if (st.justCopiedA === idx) {
                                                color = 'emerald'; isHl = true;
                                            }
                                            if (st.iPhase2 === idx) {
                                                color = 'sky'; isHl = true;
                                                labels.push({ text: 'copying', color: 'sky', pos: 'bottom' });
                                            }

                                            return (
                                                <div key={`a-${idx}`} className="relative scale-90 md:scale-100 m-1">
                                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                                    
                                                    <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} />
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
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-10">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-[#0f172a] text-white border border-slate-800 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><ArrowLeftRight size={120}/></div>
                        <h3 className="font-black text-sky-400 text-lg uppercase tracking-widest mb-6">The 3-Step Reversal Trick</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>To rotate an array in O(1) space, we exploit a beautiful property of array reversals.</p>
                            <p>Assume <code>nums = [1,2,3,4,5,6,7]</code> and <code>k = 3</code>.</p>
                            <ol className="list-decimal ml-6 space-y-2 text-sky-200 font-mono">
                                <li>Reverse EVERYTHING:<br/><code>[7,6,5,4,3,2,1]</code></li>
                                <li>Reverse first <code>k</code> elements:<br/><code>[5,6,7, 4,3,2,1]</code></li>
                                <li>Reverse remaining <code>n-k</code> elements:<br/><code>[5,6,7, 1,2,3,4]</code></li>
                            </ol>
                            <p>Boom. The array is perfectly rotated right by 3 steps.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-orange-50 border border-orange-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-orange-700 text-lg uppercase tracking-widest mb-6">The K Modulo Trap</h3>
                        <div className="space-y-4 text-sm text-orange-900/80 leading-relaxed font-medium">
                            <p>What if the array length is 5, but you are asked to rotate it by <code>k = 12</code> steps?</p>
                            <p>If you rotate an array of length 5 exactly 5 times, it ends up in the exact same starting configuration. Rotating 10 times does the same.</p>
                            <p>To prevent redundant, expensive rotations (and out-of-bounds index errors), we must normalize <code>k</code> by taking the modulo of the array length.</p>
                            <p className="font-mono bg-white p-3 rounded-lg border border-orange-200">k = k % nums.length;</p>
                            <p>12 % 5 = 2. So rotating 12 times is mathematically identical to rotating just 2 times.</p>
                        </div>
                    </div>

                    <div className="p-8 md:col-span-2 rounded-3xl bg-slate-50 border border-slate-200 relative overflow-hidden shadow-inner flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
                            <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest mb-4">Why Extra Space works (O(N))</h3>
                            <p>The O(N) space approach is highly intuitive. You just map every index <code>i</code> to its new rotated index.</p>
                            <p>The math formula to find the new index in a circular array is <code>(i + k) % n</code>. Because writing to this new index inside the <em>same</em> array would overwrite data we haven't processed yet, we are forced to allocate a completely new <code>int[] a</code> array of the same size to hold the results safely before copying them back.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-sky-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-sky-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Acing the "In-Place" Follow Up</h3>
                    <p className="text-sm text-sky-50 leading-relaxed italic max-w-2xl font-mono">"Almost every candidate can solve this using O(N) space. The interviewer's real goal is the follow-up: 'Could you do it in-place with O(1) extra space?'. If you memorize the 3-step reversal pattern, you guarantee a strong pass."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-sky-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-sky-50/50 border border-sky-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-sky-800 text-sm uppercase tracking-widest">
                               <div className="bg-sky-200 p-2 rounded-lg text-sky-700"><Copy size={16}/></div>
                               1. State the Extra Space Baseline
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-sky-100 shadow-inner flex-1">
                                "The most straightforward solution is to allocate a new array of the same size. I can iterate through the original array and place element 'i' at its new target index using the formula (i + k) % n. After fully populating the new array, I copy it back. This takes O(N) time and O(N) space."
                            </p>
                        </div>

                        <div className="bg-sky-50/50 border border-sky-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-sky-800 text-sm uppercase tracking-widest">
                               <div className="bg-sky-200 p-2 rounded-lg text-sky-700"><Scissors size={16}/></div>
                               2. Point out the K Trap
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-sky-100 shadow-inner flex-1">
                                "Before doing anything, I must normalize 'k'. If k is larger than the array length, it wraps around. For example, rotating an array of size 5 by 6 steps is identical to rotating it by 1 step. So my first line of logic will always be 'k = k % nums.length'."
                            </p>
                        </div>

                        <div className="bg-sky-50/50 border border-sky-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-sky-800 text-sm uppercase tracking-widest">
                               <div className="bg-sky-200 p-2 rounded-lg text-sky-700"><ArrowLeftRight size={16}/></div>
                               3. Deliver the Reversal Optimization
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-sky-100 shadow-inner flex-1">
                                "To satisfy the O(1) space follow-up constraint, I will use the Array Reversal trick. If I reverse the entire array, the elements that need to shift to the front are correctly put at the front, but they are backwards. To fix their internal order, I do two more localized reversals: I reverse the first k elements, and then I reverse the remaining n-k elements. Since reversing only requires swapping elements with a temp variable, the space stays strictly O(1)."
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
                          <div className="bg-sky-500 p-2 rounded-lg text-white shadow-lg shadow-sky-900/50"><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 whitespace-pre-wrap">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4 overflow-x-auto">
                        <div className="min-w-max pr-4">
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
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? 'bg-sky-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-64 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-sky-600 pl-1">Input Array (nums)</label>
                              <input type="text" value={inputString} onChange={(e) => setInputString(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-inner" />
                          </div>
                          <div className="w-24 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-orange-600 pl-1">Steps (k)</label>
                              <input type="number" value={inputK} onChange={(e) => setInputK(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-inner text-center font-black text-orange-600" />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-sky-600 rounded-xl hover:bg-sky-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-sky-600 rounded-xl hover:bg-sky-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className="p-3 text-slate-600 hover:text-sky-600 rounded-xl hover:bg-sky-50 transition-all"><RotateCcw size={24}/></button>
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
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className="px-12 py-6 bg-sky-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(2,132,199,0.3)] hover:bg-sky-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-sky-500 shadow-sky-900/20">NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-500 flex flex-col p-16 pt-40 gap-16 items-center min-w-max h-full" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* --- Strict Flexbox Layout (Theater) --- */}

                           {/* Row 1: Variables */}
                           <div className="flex gap-8 mb-4 flex-wrap justify-center scale-125 origin-center">
                                <div className="bg-slate-800 text-white p-4 rounded-2xl border-2 border-slate-700 shadow-xl flex flex-col items-center min-w-[120px]">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">n (Length)</span>
                                    <span className="font-mono text-3xl font-black text-white">{st.n !== undefined ? st.n : '?'}</span>
                                </div>
                                <div className="bg-slate-800 text-white p-4 rounded-2xl border-2 border-slate-700 shadow-xl flex flex-col items-center min-w-[120px]">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">k (Steps)</span>
                                    <span className="font-mono text-3xl font-black text-orange-400">{st.k !== undefined ? st.k : '?'}</span>
                                </div>

                                {selectedOpId === 'reverseOptimal' && st.start !== undefined && (
                                    <>
                                    <div className="bg-sky-900 text-white p-4 rounded-2xl border-2 border-sky-700 shadow-xl flex flex-col items-center min-w-[120px]">
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-sky-300 mb-1">Start Idx</span>
                                        <span className="font-mono text-3xl font-black text-sky-100">{st.start}</span>
                                    </div>
                                    <div className="bg-fuchsia-900 text-white p-4 rounded-2xl border-2 border-fuchsia-700 shadow-xl flex flex-col items-center min-w-[120px]">
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-fuchsia-300 mb-1">End Idx</span>
                                        <span className="font-mono text-3xl font-black text-fuchsia-100">{st.end}</span>
                                    </div>
                                    {st.temp !== null && st.temp !== undefined && (
                                        <div className="bg-amber-900 text-white p-4 rounded-2xl border-2 border-amber-700 shadow-[0_10px_30px_rgba(245,158,11,0.3)] flex flex-col items-center min-w-[120px] animate-in slide-in-from-left-4">
                                            <span className="text-[10px] uppercase tracking-widest font-bold text-amber-300 mb-1">Temp</span>
                                            <span className="font-mono text-3xl font-black text-amber-100">{st.temp}</span>
                                        </div>
                                    )}
                                    </>
                                )}

                                {selectedOpId === 'extraArray' && (st.iPhase1 !== undefined || st.iPhase2 !== undefined) && (
                                    <>
                                    <div className="bg-sky-900 text-white p-4 rounded-2xl border-2 border-sky-700 shadow-xl flex flex-col items-center min-w-[120px]">
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-sky-300 mb-1">Index i</span>
                                        <span className="font-mono text-3xl font-black text-sky-100">{st.iPhase1 !== undefined ? st.iPhase1 : st.iPhase2}</span>
                                    </div>
                                    {st.targetIdx !== undefined && (
                                        <div className="bg-emerald-900 text-white p-4 rounded-2xl border-2 border-emerald-700 shadow-[0_10px_30px_rgba(16,185,129,0.3)] flex flex-col items-center min-w-[150px] animate-in slide-in-from-left-4">
                                            <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-300 mb-1">Target Mod</span>
                                            <div className="font-mono text-sm text-emerald-200 opacity-80 mb-1">({st.iPhase1} + {st.k}) % {st.n}</div>
                                            <span className="font-mono text-3xl font-black text-emerald-100">{st.targetIdx}</span>
                                        </div>
                                    )}
                                    </>
                                )}
                           </div>

                           {/* Row 2: Input Array (nums) */}
                           <div className="flex flex-col items-center w-full max-w-5xl scale-125 origin-center mt-10">
                               <div className="text-xs font-black text-slate-500 uppercase tracking-widest font-mono mb-4 bg-white/50 px-4 py-1.5 rounded-full shadow-sm">Original Array (nums)</div>
                               <div className="flex gap-4 p-6 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-2xl backdrop-blur-md flex-wrap justify-center w-full max-w-4xl">
                                   {(st.nums || []).length === 0 && <span className="text-slate-400 italic text-2xl">empty</span>}
                                   {(st.nums || []).map((val, idx) => {
                                       let color = 'slate';
                                       let isHl = false;
                                       let labels = [];

                                       if (selectedOpId === 'reverseOptimal') {
                                           if (st.start === idx) {
                                               color = 'sky'; isHl = true;
                                               labels.push({ text: 'start', color: 'sky', pos: 'top' });
                                           }
                                           if (st.end === idx) {
                                               color = 'fuchsia'; isHl = true;
                                               labels.push({ text: 'end', color: 'fuchsia', pos: 'bottom' });
                                           }
                                           if (st.justSwappedS && st.start === idx) color = 'emerald';
                                           if (st.justSwappedE && st.end === idx) color = 'emerald';
                                       } else {
                                           if (st.iPhase1 === idx) {
                                               color = 'sky'; isHl = true;
                                               labels.push({ text: 'i', color: 'sky', pos: 'top' });
                                           }
                                           if (st.justCopiedNums === idx) {
                                               color = 'emerald'; isHl = true;
                                               labels.push({ text: 'pasted', color: 'emerald', pos: 'top' });
                                           }
                                           if (st.iPhase2 === idx) {
                                               color = 'orange'; isHl = true;
                                           }
                                       }

                                       if (st.isSuccess) color = 'emerald';

                                       return (
                                           <div key={`num-fs-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-4' : 'mx-2'} my-4`}>
                                               <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                               <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                               
                                               <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} />
                                           </div>
                                       )
                                   })}
                               </div>
                           </div>

                           {/* Row 3: Extra Array (if Extra Array approach) */}
                           {selectedOpId === 'extraArray' && st.a && (
                               <div className="flex flex-col items-center w-full max-w-5xl scale-125 origin-center mt-10">
                                   <div className="text-xs font-black text-orange-600 uppercase tracking-widest font-mono mb-4 flex items-center gap-2 bg-orange-100 px-4 py-1.5 rounded-full shadow-sm"><Copy size={16}/> Extra Array (a)</div>
                                   <div className="flex gap-4 p-6 border-[3px] border-orange-200 bg-orange-50/90 rounded-[2rem] shadow-2xl backdrop-blur-md flex-wrap justify-center w-full max-w-4xl">
                                        {(st.a || []).map((val, idx) => {
                                            let color = 'slate';
                                            let isHl = false;
                                            let labels = [];

                                            if (st.targetIdx === idx) {
                                                color = 'orange'; isHl = true;
                                                labels.push({ text: 'target', color: 'orange', pos: 'bottom' });
                                            }
                                            if (st.justCopiedA === idx) {
                                                color = 'emerald'; isHl = true;
                                            }
                                            if (st.iPhase2 === idx) {
                                                color = 'sky'; isHl = true;
                                                labels.push({ text: 'copying', color: 'sky', pos: 'bottom' });
                                            }

                                            return (
                                                <div key={`a-fs-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-4' : 'mx-2'} my-4`}>
                                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                                    
                                                    <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} />
                                                </div>
                                            )
                                        })}
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
                                    ROTATION COMPLETE
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