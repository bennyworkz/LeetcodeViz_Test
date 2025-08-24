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
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Target, Keyboard, Type, KeyRound, Box, Landmark, Calculator, Plus, Minus, History, Grid3x3, LayoutGrid, AlertOctagon, Repeat1, AlignLeft, XSquare, ArrowRightLeft, TrendingUp, SearchCode, Languages, Link2, Puzzle, Users
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  mathGauss: {
    id: 'mathGauss',
    title: '1. Math (Gauss Formula)',
    icon: <Calculator size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public int missingNumber(int[] nums) {
    int n = nums.length;
    int expectedSum = n * (n + 1) / 2;
    int actualSum = 0;
    
    for (int num : nums) {
        actualSum += num;
    }
    
    return expectedSum - actualSum;
}`,
    desc: "A beautiful mathematical approach using Gauss' formula. We know the array should contain all numbers from 0 to n. The sum of the first n natural numbers is mathematically n * (n + 1) / 2. If we subtract the actual sum of the array from this expected sum, the difference is exactly the missing number."
  },
  bitwiseXor: {
    id: 'bitwiseXor',
    title: '2. Bitwise XOR (Optimal)',
    icon: <Binary size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public int missingNumber(int[] nums) {
    int n = nums.length;
    int res = n;
    
    for (int i = 0; i < n; i++) {
        res = res ^ i ^ nums[i];
    }
    
    return res;
}`,
    desc: "The ultimate, overflow-proof approach. XORing a number with itself results in 0 (x ^ x = 0). If we XOR all indices [0...n] and all values in the array, every number that appears in BOTH the indices and the values will cancel out to 0. The only number left standing in our 'res' variable will be the missing number."
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
  theme?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'amber' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|return|if|else|for|while|continue|new|length)\b|\b\d+\b|[\^\+\-\*\/=])/g).filter(Boolean);
  
  const activeStyles = theme === 'amber' 
    ? { bg: `bg-amber-500/20`, border: `border-amber-400`, text: `text-amber-300` }
    : { bg: `bg-indigo-500/20`, border: `border-indigo-400`, text: `text-indigo-300` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? activeStyles.text + ' font-bold' : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'return', 'if', 'else', 'for', 'while', 'continue', 'new'].includes(part);
            const isVar = ['nums', 'n', 'expectedSum', 'actualSum', 'num', 'res', 'i'].includes(part);
            const isMapCall = ['length'].includes(part);
            const isOperator = ['^', '+', '-', '*', '/', '='].includes(part.trim());

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isVar) className = 'text-sky-200';
            else if (isMapCall) className = 'text-amber-400';
            else if (isOperator) className = 'text-rose-400 font-bold';
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
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800', index: 'bg-indigo-100 text-indigo-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' }
    };
    
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;

    const displayVal = val === null ? '?' : String(val);

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center min-w-[64px] min-h-[64px] border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
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

export default function MissingNumberVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('mathGauss');
  
  const [inputString, setInputString] = useState('9, 6, 4, 2, 3, 5, 7, 0, 1');
  
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
      // Clean and parse unique numbers
      let nums = str.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      // Removing duplicates to keep valid input structure for 'distinct numbers' rule
      nums = Array.from(new Set(nums));
      return nums;
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
    if (!baseArray || baseArray.length === 0) return [{ phase: 'Init', description: 'Enter an array of numbers.', line: 0, state: { nums: [] } }];

    let nums = [...baseArray];
    let n = nums.length;

    // Validation: ensure max value is not absurdly large for visualization
    let maxVal = Math.max(...nums);
    if (maxVal > 100) {
        return [{ phase: 'Init', description: 'Please keep numbers <= 100 for visualization.', line: 0, state: { nums: [] } }];
    }

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            nums: [...nums],
            n,
            ...st 
        } 
    });

    if (selectedOpId === 'mathGauss') {
        add("Length & Setup", `int n = nums.length; Array has ${n} elements. Range should be [0, ${n}].`, 2, {});
        
        let expectedSum = (n * (n + 1)) / 2;
        add("Gauss Formula", `int expectedSum = ${n} * (${n} + 1) / 2 = ${expectedSum}. If no number was missing, the sum would be ${expectedSum}.`, 3, { expectedSum });
        
        let actualSum = 0;
        add("Init Actual Sum", `int actualSum = 0; Prepare to count what we actually have.`, 4, { expectedSum, actualSum });

        for (let i = 0; i < n; i++) {
            add("Loop Execution", `for (int num : nums) -> Process nums[${i}] = ${nums[i]}.`, 6, { expectedSum, actualSum, i, hlIdx: i });
            
            let oldSum = actualSum;
            actualSum += nums[i];
            add("Accumulate Sum", `actualSum += ${nums[i]} -> ${oldSum} + ${nums[i]} = ${actualSum}.`, 7, { expectedSum, actualSum, i, hlIdx: i, sumChanged: true });
        }

        let missing = expectedSum - actualSum;
        add("Calculate Difference", `return expectedSum - actualSum; -> ${expectedSum} - ${actualSum} = ${missing}. The difference is exactly the missing number!`, 10, { expectedSum, actualSum, missing, isSuccess: true });

    } else if (selectedOpId === 'bitwiseXor') {
        
        add("Length & Setup", `int n = nums.length; Array has ${n} elements.`, 2, {});
        
        let res = n;
        add("Init Result Variable", `int res = n; Initialize result with ${n}. We will XOR this with all indices and values.`, 3, { res });

        for (let i = 0; i < n; i++) {
            add("Loop Condition", `for (int i = ${i}; i < ${n}; i++)`, 5, { res, i, hlIdx: i });
            
            let oldRes = res;
            res = res ^ i ^ nums[i];
            
            add("XOR Operation", `res = res ^ i ^ nums[${i}] -> ${oldRes} ^ ${i} ^ ${nums[i]} = ${res}. Duplicate numbers completely cancel out to 0.`, 6, { res, i, hlIdx: i, xorStep: `${oldRes} ^ ${i} ^ ${nums[i]} = ${res}` });
        }

        add("Return Result", `return res; All pairs cancelled out. The remaining value is ${res}, which is our missing number.`, 9, { res, isSuccess: true, missing: res });
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

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { nums: [] } };
  const st = curStepData.state || { nums: [] };
  const isLastStep = currentStep === trace.length - 1;

  const themeColor = selectedOpId === 'mathGauss' ? 'amber' : 'indigo';

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${selectedOpId === 'mathGauss' ? 'bg-amber-500' : 'bg-indigo-600'}`}>
                <Calculator className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Missing Number</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${selectedOpId === 'mathGauss' ? 'text-amber-600 bg-amber-50' : 'text-indigo-600 bg-indigo-50'}`}>
                      LC 268 • Arrays & Math
                  </span>
                  <span>•</span>
                  <span>O(1) Space</span>
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
                <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'amber' ? 'text-amber-600' : 'text-indigo-600'}`}><AlignLeft size={28}/> Problem Statement</div>
                
                <p className="text-base leading-relaxed">
                  Given an array <code>nums</code> containing <code>n</code> distinct numbers in the range <code>[0, n]</code>, return the only number in the range that is missing from the array.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> nums = [3,0,1]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 2</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: n=3 since there are 3 numbers, so all numbers are in the range [0,3]. 2 is the missing number.</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-indigo-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-indigo-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> nums = [0,1]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 2</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: n=2. The array is missing 2.</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-fuchsia-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-fuchsia-400 font-black uppercase tracking-widest text-[10px]">Example 3</span>
                        <div><span className="text-white font-bold">Input:</span> nums = [9,6,4,2,3,5,7,0,1]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 8</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: n=9. 8 is missing.</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Follow-up</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-1">
                        <li>n == nums.length</li>
                        <li>1 &lt;= n &lt;= 10<sup>4</sup></li>
                        <li>0 &lt;= nums[i] &lt;= n</li>
                        <li>All the numbers of nums are <b>unique</b>.</li>
                        <li className={`font-bold mt-2 ${themeColor === 'amber' ? 'text-amber-600' : 'text-indigo-600'}`}>Follow-up: Could you implement a solution using only O(1) extra space complexity and O(n) runtime complexity?</li>
                    </ul>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? (op.id === 'mathGauss' ? 'bg-amber-500 text-white border-amber-600 scale-[1.02]' : 'bg-indigo-600 text-white border-indigo-600 scale-[1.02]') : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? (op.id === 'mathGauss' ? 'text-amber-100' : 'text-indigo-200') : 'text-slate-400'}`}>{op.complexity}</div>
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
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} />
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-end">
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono pl-1 flex justify-between ${themeColor === 'amber' ? 'text-amber-600' : 'text-indigo-600'}`}>
                                <span>Input Array (nums)</span>
                            </label>
                            <input 
                                type="text"
                                value={inputString} 
                                onChange={(e) => setInputString(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'amber' ? 'focus:ring-amber-500' : 'focus:ring-indigo-500'}`} 
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center w-full xl:w-auto mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-3 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 group disabled:opacity-30 ${themeColor === 'amber' ? 'bg-amber-500 shadow-amber-200 hover:bg-amber-600' : 'bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700'}`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
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
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Missing Number Found</div>
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
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur ${themeColor === 'amber' ? 'text-amber-500' : 'text-indigo-500'}`}><Layout size={14}/> Variable State</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'amber' ? 'hover:text-amber-600' : 'hover:text-indigo-600'}`}><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'amber' ? 'hover:text-amber-600' : 'hover:text-indigo-600'}`}><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'amber' ? 'hover:text-amber-600' : 'hover:text-indigo-600'}`}><Maximize size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-20 pb-16 gap-10 items-center overflow-x-auto overflow-y-hidden scrollbar-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* --- Strict Flexbox Layout --- */}

                           {/* Row 1: Variables */}
                           {selectedOpId === 'mathGauss' && (
                               <div className="flex gap-4 md:gap-8 mb-4 min-w-max">
                                    <div className={`p-4 rounded-2xl border-4 shadow-xl flex flex-col items-center min-w-[120px] transition-all duration-500 ${st.expectedSum !== undefined ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'}`}>
                                        <span className={`text-[10px] uppercase tracking-widest font-black mb-1 ${st.expectedSum !== undefined ? 'text-amber-600' : 'text-slate-400'}`}>Expected Sum</span>
                                        <span className={`font-mono text-4xl font-black ${st.expectedSum !== undefined ? 'text-amber-700' : 'text-slate-300'}`}>{st.expectedSum !== undefined ? st.expectedSum : '?'}</span>
                                    </div>
                                    <div className={`p-4 rounded-2xl border-4 shadow-xl flex flex-col items-center min-w-[120px] transition-all duration-500 ${st.sumChanged ? 'bg-indigo-100 border-indigo-400 scale-110 shadow-[0_0_20px_rgba(99,102,241,0.4)]' : st.actualSum !== undefined ? 'bg-indigo-50 border-indigo-300' : 'bg-white border-slate-200'}`}>
                                        <span className={`text-[10px] uppercase tracking-widest font-black mb-1 ${st.actualSum !== undefined ? 'text-indigo-600' : 'text-slate-400'}`}>Actual Sum</span>
                                        <span className={`font-mono text-4xl font-black ${st.actualSum !== undefined ? 'text-indigo-700' : 'text-slate-300'}`}>{st.actualSum !== undefined ? st.actualSum : '?'}</span>
                                    </div>
                               </div>
                           )}

                           {selectedOpId === 'bitwiseXor' && (
                               <div className="flex gap-6 mb-4 min-w-max">
                                    <div className={`p-4 rounded-2xl border-4 shadow-xl flex flex-col items-center min-w-[150px] transition-all duration-500 ${st.xorStep ? 'bg-indigo-100 border-indigo-400 scale-110 shadow-[0_0_20px_rgba(99,102,241,0.4)]' : st.res !== undefined ? 'bg-indigo-50 border-indigo-300' : 'bg-white border-slate-200'}`}>
                                        <span className={`text-[10px] uppercase tracking-widest font-black mb-1 ${st.res !== undefined ? 'text-indigo-600' : 'text-slate-400'}`}>res (XOR)</span>
                                        <span className={`font-mono text-4xl font-black ${st.res !== undefined ? 'text-indigo-700' : 'text-slate-300'}`}>{st.res !== undefined ? st.res : '?'}</span>
                                        {st.xorStep && <div className="mt-2 text-xs font-mono font-bold text-indigo-500 animate-in zoom-in">{st.xorStep}</div>}
                                    </div>
                               </div>
                           )}

                           {/* Row 2: Input Array */}
                           <div className="flex flex-col items-center w-full max-w-4xl">
                               <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono mb-2 flex justify-between w-full">
                                   <span>Array nums</span>
                                   <span className="font-bold text-slate-400">n = {st.n !== undefined ? st.n : '?'}</span>
                               </div>
                               <div className="flex gap-3 p-4 border-2 border-slate-200 bg-white/90 rounded-3xl shadow-lg backdrop-blur-sm flex-wrap justify-center w-full">
                                   {(st.nums || []).length === 0 && <span className="text-slate-400 italic">empty</span>}
                                   {(st.nums || []).map((val, idx) => {
                                       const isHl = st.hlIdx === idx;
                                       let color = 'slate';
                                       
                                       if (isHl) {
                                           color = selectedOpId === 'mathGauss' ? 'amber' : 'indigo';
                                       }
                                       
                                       return (
                                           <div key={`num-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-90 md:scale-100 m-1'}`}>
                                               {isHl && <PointerLabel label="i" color={color} position="top" />}
                                               <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} />
                                           </div>
                                       )
                                   })}
                               </div>
                           </div>

                           {/* Row 3: Result Zone */}
                           {st.isSuccess && st.missing !== undefined && (
                               <div className="flex flex-col items-center mt-6 animate-in slide-in-from-bottom-8">
                                   <div className="bg-emerald-100 border-4 border-emerald-400 p-6 rounded-3xl shadow-[0_0_30px_rgba(52,211,153,0.5)] flex flex-col items-center min-w-[150px]">
                                        <span className="text-sm uppercase tracking-widest font-black text-emerald-700 mb-2">Missing Number</span>
                                        <span className="font-mono text-6xl font-black text-emerald-600">{st.missing}</span>
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
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Calculator size={120}/></div>
                        <h3 className="font-black text-amber-400 text-lg uppercase tracking-widest mb-6">Gauss' Formula</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>Legend has it that a young Carl Friedrich Gauss was asked by his teacher to sum all numbers from 1 to 100. He instantly replied 5050.</p>
                            <p>The formula for the sum of the first <code>n</code> natural numbers is exactly: <br/><code>Sum = n * (n + 1) / 2</code></p>
                            <p>If we calculate the total sum the array <strong>should</strong> have, and subtract the sum of the numbers the array <strong>actually</strong> has, the difference is strictly the missing number.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-indigo-50 border border-indigo-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-indigo-700 text-lg uppercase tracking-widest mb-6">The Power of XOR</h3>
                        <div className="space-y-4 text-sm text-indigo-900/80 leading-relaxed font-medium">
                            <p>XOR (Exclusive OR) is a bitwise operator with two magical properties for this problem:</p>
                            <ol className="list-decimal ml-6 space-y-2">
                                <li><code>x ^ x = 0</code> (A number XORed with itself cancels out).</li>
                                <li><code>x ^ 0 = x</code> (A number XORed with 0 remains unchanged).</li>
                                <li>It is commutative and associative.</li>
                            </ol>
                            <p>If we take all the numbers from <code>0</code> to <code>n</code>, and XOR them together with all the numbers present in our array <code>nums</code>, every number that appears twice (once in the range, once in the array) will cancel out to 0.</p>
                            <p>The missing number only appears once (in the range), so it survives.</p>
                        </div>
                    </div>

                    <div className="p-8 md:col-span-2 rounded-3xl bg-rose-50 border border-rose-200 relative overflow-hidden shadow-inner flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-sm text-rose-900/80 leading-relaxed font-medium">
                            <h3 className="font-black text-rose-800 text-lg uppercase tracking-widest mb-4">Why XOR is Better Than Math</h3>
                            <p>The Math approach is beautiful, but it holds a fatal flaw in low-level systems: <strong>Integer Overflow</strong>.</p>
                            <p>If <code>n</code> is very large (e.g., $10^5$), computing <code>n * (n + 1) / 2</code> can result in a number so massive that it exceeds the 32-bit limit of standard Integers, causing negative wrapping bugs.</p>
                            <p>The Bitwise XOR approach never adds numbers together. It merely flips bits back and forth. It is completely immune to integer overflow, making it the safest and most robust O(1) Space solution.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-indigo-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-indigo-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Acing The Simple Question</h3>
                    <p className="text-sm text-indigo-50 leading-relaxed italic max-w-2xl font-mono">"This is a classic 'Easy' problem. The goal isn't just to solve it, but to impress the interviewer by proactively pointing out the Integer Overflow risk of the Math approach before demonstrating the bitwise solution."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-indigo-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-indigo-800 text-sm uppercase tracking-widest">
                               <div className="bg-indigo-200 p-2 rounded-lg text-indigo-700"><Database size={16}/></div>
                               1. Acknowledge O(N) Space
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-indigo-100 shadow-inner flex-1">
                                "The most trivial way to solve this is to load all elements into a HashSet, and then loop from 0 to n checking which number is missing. However, this uses O(N) auxiliary space, and the problem asks for O(1) space."
                            </p>
                        </div>

                        <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-indigo-800 text-sm uppercase tracking-widest">
                               <div className="bg-indigo-200 p-2 rounded-lg text-indigo-700"><Calculator size={16}/></div>
                               2. Propose the Math Approach
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-indigo-100 shadow-inner flex-1">
                                "To achieve O(1) space, I can use Gauss' formula. The expected sum of numbers from 0 to n is n * (n + 1) / 2. If I sum up the actual elements in the array and subtract it from the expected sum, I will perfectly isolate the missing number."
                            </p>
                        </div>

                        <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-indigo-800 text-sm uppercase tracking-widest">
                               <div className="bg-indigo-200 p-2 rounded-lg text-indigo-700"><ShieldAlert size={16}/></div>
                               3. Introduce the Overflow Trap
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-indigo-100 shadow-inner flex-1">
                                "However, there is a risk with the Math approach. If 'n' is extremely large, adding all the numbers together or doing the initial multiplication could cause a 32-bit Integer Overflow. To be completely safe without casting to longs, we need an alternative."
                            </p>
                        </div>

                        <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-indigo-800 text-sm uppercase tracking-widest">
                               <div className="bg-indigo-200 p-2 rounded-lg text-indigo-700"><Binary size={16}/></div>
                               4. Deliver the Bitwise Fix
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-indigo-100 shadow-inner flex-1">
                                "The safest O(1) space approach uses Bitwise XOR. Since a number XORed with itself is 0, if I XOR all the indices [0...n] and all the values in the array, every number that appears twice will cancel out. Only the missing number will remain, and XORing never overflows."
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
                          <div className={`p-2 rounded-lg text-white shadow-lg ${themeColor === 'amber' ? 'bg-amber-500 shadow-amber-900/50' : 'bg-indigo-500 shadow-indigo-900/50'}`}><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 whitespace-pre-wrap">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4 overflow-x-auto">
                        <div className="min-w-max pr-4">
                            {selectedOp.code.split('\n').map((line, idx) => (
                                <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} />
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
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? (op.id === 'mathGauss' ? 'bg-amber-500 text-white shadow-md' : 'bg-indigo-600 text-white shadow-md') : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-80 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'amber' ? 'text-amber-600' : 'text-indigo-600'}`}>Input Array (nums)</label>
                              <input type="text" value={inputString} onChange={(e) => setInputString(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'amber' ? 'focus:ring-amber-500' : 'focus:ring-indigo-500'}`} />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'amber' ? 'hover:bg-amber-50 hover:text-amber-600' : 'hover:bg-indigo-50 hover:text-indigo-600'}`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'amber' ? 'hover:bg-amber-50 hover:text-amber-600' : 'hover:bg-indigo-50 hover:text-indigo-600'}`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'amber' ? 'hover:bg-amber-50 hover:text-amber-600' : 'hover:bg-indigo-50 hover:text-indigo-600'}`}><RotateCcw size={24}/></button>
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
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 text-white rounded-[2rem] hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border shadow-2xl ${themeColor === 'amber' ? 'bg-amber-500 hover:bg-amber-600 border-amber-400 shadow-amber-900/30' : 'bg-indigo-600 hover:bg-indigo-700 border-indigo-400 shadow-indigo-900/30'}`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-500 flex flex-col p-16 pt-40 gap-16 items-center min-w-max h-full" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* --- Strict Flexbox Layout (Theater) --- */}

                           {/* Row 1: Running Variables */}
                           {selectedOpId === 'mathGauss' && (
                               <div className="flex gap-10 min-w-max scale-110 origin-center mb-4">
                                    <div className={`p-8 rounded-[2rem] border-[4px] shadow-2xl flex flex-col items-center min-w-[220px] transition-all duration-500 ${st.expectedSum !== undefined ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'}`}>
                                        <span className={`text-xs uppercase tracking-widest font-black mb-2 ${st.expectedSum !== undefined ? 'text-amber-600' : 'text-slate-400'}`}>Expected Sum</span>
                                        <span className={`font-mono text-6xl font-black ${st.expectedSum !== undefined ? 'text-amber-700' : 'text-slate-300'}`}>{st.expectedSum !== undefined ? st.expectedSum : '?'}</span>
                                    </div>
                                    <div className={`p-8 rounded-[2rem] border-[4px] shadow-2xl flex flex-col items-center min-w-[220px] transition-all duration-500 ${st.sumChanged ? 'bg-indigo-100 border-indigo-400 scale-110 shadow-[0_0_30px_rgba(99,102,241,0.5)] z-20' : st.actualSum !== undefined ? 'bg-indigo-50 border-indigo-300' : 'bg-white border-slate-200'}`}>
                                        <span className={`text-xs uppercase tracking-widest font-black mb-2 ${st.actualSum !== undefined ? 'text-indigo-600' : 'text-slate-400'}`}>Actual Sum</span>
                                        <span className={`font-mono text-6xl font-black ${st.actualSum !== undefined ? 'text-indigo-700' : 'text-slate-300'}`}>{st.actualSum !== undefined ? st.actualSum : '?'}</span>
                                    </div>
                               </div>
                           )}

                           {selectedOpId === 'bitwiseXor' && (
                               <div className="flex gap-10 min-w-max scale-110 origin-center mb-4">
                                    <div className={`p-8 rounded-[2rem] border-[4px] shadow-2xl flex flex-col items-center min-w-[280px] transition-all duration-500 ${st.xorStep ? 'bg-indigo-100 border-indigo-400 scale-110 shadow-[0_0_30px_rgba(99,102,241,0.5)] z-20' : st.res !== undefined ? 'bg-indigo-50 border-indigo-300' : 'bg-white border-slate-200'}`}>
                                        <span className={`text-xs uppercase tracking-widest font-black mb-2 ${st.res !== undefined ? 'text-indigo-600' : 'text-slate-400'}`}>res (XOR Total)</span>
                                        <span className={`font-mono text-6xl font-black ${st.res !== undefined ? 'text-indigo-700' : 'text-slate-300'}`}>{st.res !== undefined ? st.res : '?'}</span>
                                        {st.xorStep && <div className="mt-4 text-base font-mono font-bold text-indigo-500 animate-in zoom-in">{st.xorStep}</div>}
                                    </div>
                               </div>
                           )}

                           {/* Row 2: Input Array */}
                           <div className="flex flex-col items-center w-full max-w-5xl scale-125 origin-center mt-10">
                               <div className="text-xs font-black text-slate-500 uppercase tracking-widest font-mono mb-4 flex justify-between w-full max-w-4xl">
                                   <span className="bg-white/50 px-4 py-1.5 rounded-full shadow-sm">Array nums</span>
                                   <span className="font-bold text-slate-500 bg-white/50 px-4 py-1.5 rounded-full shadow-sm">n = {st.n !== undefined ? st.n : '?'}</span>
                               </div>
                               <div className="flex gap-6 p-8 border-4 border-slate-200 bg-white/90 rounded-[2rem] shadow-2xl backdrop-blur-md flex-wrap justify-center w-full max-w-4xl">
                                   {(st.nums || []).length === 0 && <span className="text-slate-400 italic text-2xl">empty</span>}
                                   {(st.nums || []).map((val, idx) => {
                                       const isHl = st.hlIdx === idx;
                                       let color = 'slate';
                                       
                                       if (isHl) {
                                           color = selectedOpId === 'mathGauss' ? 'amber' : 'indigo';
                                       }

                                       return (
                                           <div key={`num-fs-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-4' : 'mx-2'}`}>
                                               {isHl && <PointerLabel label="i" color={color} position="top" />}
                                               <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} />
                                           </div>
                                       )
                                   })}
                               </div>
                           </div>

                           {/* Row 3: Result Zone */}
                           {st.isSuccess && st.missing !== undefined && (
                               <div className="flex flex-col items-center mt-10 w-full max-w-md animate-in slide-in-from-bottom-8 scale-150 origin-center">
                                   <div className="bg-emerald-100 border-4 border-emerald-400 p-8 rounded-[2rem] shadow-[0_0_40px_rgba(52,211,153,0.5)] flex flex-col items-center min-w-[200px]">
                                        <span className="text-sm uppercase tracking-widest font-black text-emerald-700 mb-3">Missing Number</span>
                                        <span className="font-mono text-7xl font-black text-emerald-600">{st.missing}</span>
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
                                    MISSING FOUND
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