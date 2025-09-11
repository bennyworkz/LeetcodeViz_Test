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
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Target, Keyboard, Type, KeyRound, Box, Landmark, Calculator, Plus, Minus, History, Grid3x3, LayoutGrid, AlertOctagon, Repeat1, AlignLeft, XSquare
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalSpace: {
    id: 'optimalSpace',
    title: '1. O(1) Extra Space (Optimal)',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] answer = new int[n];
    
    // 1. Build left prefix products directly in answer array
    answer[0] = 1;
    for (int i = 1; i < n; i++) {
        answer[i] = nums[i - 1] * answer[i - 1];
    }
    
    // 2. Traverse backwards, maintaining a running right suffix multiplier
    int R = 1;
    for (int i = n - 1; i >= 0; i--) {
        answer[i] = answer[i] * R;
        R = R * nums[i];
    }
    
    return answer;
}`,
    desc: "The most optimized approach. Instead of creating separate L and R arrays, we build the left prefix products directly into the return 'answer' array. Then, we traverse the array backwards, maintaining a single integer 'R' that accumulates the right suffix products, multiplying it into the answer array on the fly."
  },
  lrArrays: {
    id: 'lrArrays',
    title: '2. Left & Right Arrays',
    icon: <SplitSquareHorizontal size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] L = new int[n];
    int[] R = new int[n];
    int[] answer = new int[n];
    
    // 1. Build L array (products to the left of i)
    L[0] = 1;
    for (int i = 1; i < n; i++) {
        L[i] = nums[i - 1] * L[i - 1];
    }
    
    // 2. Build R array (products to the right of i)
    R[n - 1] = 1;
    for (int i = n - 2; i >= 0; i--) {
        R[i] = nums[i + 1] * R[i + 1];
    }
    
    // 3. Multiply them together
    for (int i = 0; i < n; i++) {
        answer[i] = L[i] * R[i];
    }
    
    return answer;
}`,
    desc: "The highly intuitive DP approach. We construct an array 'L' where L[i] holds the product of all elements to the left of i. We construct 'R' where R[i] holds the product of all elements to the right. The answer for index i is simply L[i] * R[i]."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|return|if|else|for|while|continue|new|length)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-fuchsia-500/20`, border: `border-fuchsia-400`, text: `text-fuchsia-300` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-fuchsia-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'return', 'if', 'else', 'for', 'while', 'continue', 'new'].includes(part);
            const isVar = ['nums', 'n', 'i', 'answer', 'L', 'R'].includes(part);
            const isMapCall = ['length'].includes(part);

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isVar) className = 'text-fuchsia-200';
            else if (isMapCall) className = 'text-amber-400';
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
}

const PointerLabel: React.FC<PointerLabelProps> = ({ label, color, position }) => {
    const colorClasses = {
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
        sky: 'bg-sky-100 text-sky-700 border-sky-300',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300',
        cyan: 'bg-cyan-100 text-cyan-700 border-cyan-300',
        rose: 'bg-rose-100 text-rose-700 border-rose-300',
        amber: 'bg-amber-100 text-amber-700 border-amber-300',
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

interface ArrayNodeBlockProps {
  val: number | null;
  idx: number;
  themeColor?: string;
  isTarget?: boolean;
}

const ArrayNodeBlock: React.FC<ArrayNodeBlockProps> = ({ val, idx, themeColor = 'slate', isTarget }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', index: 'bg-emerald-100 text-emerald-600' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', index: 'bg-sky-100 text-sky-600' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', index: 'bg-fuchsia-100 text-fuchsia-600' },
        cyan: { bg: 'bg-cyan-50', border: 'border-cyan-400', text: 'text-cyan-800', index: 'bg-cyan-100 text-cyan-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' }
    };
    
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;

    const displayVal = val === null ? '_' : String(val);

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center w-16 h-20 border-2 rounded-xl transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-2xl bg-white/60 ${activeTheme.text}`}>
                    {displayVal}
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

export default function ProductExceptSelfVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalSpace');
  
  const [inputString, setInputString] = useState('1, 2, 3, 4');
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
    if (!baseArray || baseArray.length === 0) return [{ phase: 'Init', description: 'Enter an array of numbers.', line: 0, state: { nums: [] } }];
    
    let nums = [...baseArray];
    let n = nums.length;

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

    if (selectedOpId === 'optimalSpace') {
        let ans = new Array(n).fill(null);
        
        add("Initialize", `Store length n = ${n}. Initialize 'answer' array of size n to store left prefix products.`, 3, { ans: [...ans] });
        
        ans[0] = 1;
        add("Base Case (Left)", "Set answer[0] = 1. There are no elements to the left of the 0th index, so the prefix product is mathematically 1.", 6, { ans: [...ans], hlAns: [0] });

        for (let i = 1; i < n; i++) {
            add("Loop Condition (Left)", `Check condition: for(int i = ${i}; ${i} < ${n}; i++)`, 7, { i, ans: [...ans], hlAns: [] });
            
            let prod = nums[i - 1] * ans[i - 1];
            add("Calculate Prefix", `Multiply the number immediately left (nums[${i - 1}] = ${nums[i-1]}) by its own prefix product (answer[${i - 1}] = ${ans[i-1]}).`, 8, { i, ans: [...ans], hlNums: [i-1], hlAns: [i-1], calc: `${nums[i-1]} * ${ans[i-1]} = ${prod}`, calcOp: 'left' });
            
            ans[i] = prod;
            add("Store Prefix", `answer[${i}] = ${prod}. It now holds the product of all elements to the left of index ${i}.`, 8, { i, ans: [...ans], hlAns: [i] });
        }
        add("Prefix Complete", "Left prefix products are successfully calculated in the answer array.", 7, { ans: [...ans], hlAns: [] });

        let R = 1;
        add("Init Right Multiplier", "Initialize a scalar variable R = 1. We will use this to track the suffix product dynamically from right-to-left.", 11, { ans: [...ans], rVal: R });

        for (let i = n - 1; i >= 0; i--) {
            add("Loop Condition (Right)", `Check condition: for(int i = ${i}; ${i} >= 0; i--)`, 12, { i, ans: [...ans], rVal: R });
            
            let oldAns = ans[i];
            ans[i] = ans[i] * R;
            add("Merge Suffix", `Multiply the accumulated left product (answer[${i}] = ${oldAns}) by the running right suffix (R = ${R}).`, 13, { i, ans: [...ans], hlAns: [i], rVal: R, calc: `${oldAns} * ${R} = ${ans[i]}`, calcOp: 'merge' });
            
            let oldR = R;
            R = R * nums[i];
            add("Update R", `Update the running right multiplier for the next iteration: R = ${oldR} * nums[${i}] (${nums[i]}) = ${R}.`, 14, { i, ans: [...ans], hlNums: [i], rVal: R, calc: `${oldR} * ${nums[i]} = ${R}`, calcOp: 'right' });
        }
        
        add("Return", "Both prefix and suffix products are merged! Return the final answer array.", 17, { ans: [...ans], isSuccess: true });

    } else if (selectedOpId === 'lrArrays') {
        let L = new Array(n).fill(null);
        let R = new Array(n).fill(null);
        let ans = new Array(n).fill(null);
        
        add("Initialize Arrays", `Create arrays L, R, and answer of size ${n}.`, 5, { L: [...L], R: [...R], ans: [...ans] });
        
        L[0] = 1;
        add("Base Case L", "L[0] = 1 (No elements to the left).", 8, { L: [...L], R: [...R], ans: [...ans], hlL: [0] });

        for (let i = 1; i < n; i++) {
            add("Loop Condition L", `for(int i = ${i}; ${i} < ${n}; i++)`, 9, { i, L: [...L], R: [...R], ans: [...ans] });
            L[i] = nums[i - 1] * L[i - 1];
            add("Calc L", `L[${i}] = nums[${i - 1}] (${nums[i-1]}) * L[${i - 1}] (${L[i-1]}) = ${L[i]}.`, 10, { i, L: [...L], R: [...R], ans: [...ans], hlNums: [i-1], hlL: [i-1, i], calc: `${nums[i-1]} * ${L[i-1]} = ${L[i]}`, calcOp: 'left' });
        }

        R[n - 1] = 1;
        add("Base Case R", `R[${n-1}] = 1 (No elements to the right).`, 13, { L: [...L], R: [...R], ans: [...ans], hlR: [n-1] });

        for (let i = n - 2; i >= 0; i--) {
            add("Loop Condition R", `for(int i = ${i}; ${i} >= 0; i--)`, 14, { i, L: [...L], R: [...R], ans: [...ans] });
            R[i] = nums[i + 1] * R[i + 1];
            add("Calc R", `R[${i}] = nums[${i + 1}] (${nums[i+1]}) * R[${i + 1}] (${R[i+1]}) = ${R[i]}.`, 15, { i, L: [...L], R: [...R], ans: [...ans], hlNums: [i+1], hlR: [i, i+1], calc: `${nums[i+1]} * ${R[i+1]} = ${R[i]}`, calcOp: 'right' });
        }

        add("Merge Phase Setup", "Arrays L and R are fully populated. Now we multiply them index by index.", 18, { L: [...L], R: [...R], ans: [...ans] });

        for (let i = 0; i < n; i++) {
            add("Loop Condition Merge", `for(int i = ${i}; ${i} < ${n}; i++)`, 18, { i, L: [...L], R: [...R], ans: [...ans] });
            ans[i] = L[i] * R[i];
            add("Merge Calculation", `answer[${i}] = L[${i}] (${L[i]}) * R[${i}] (${R[i]}) = ${ans[i]}.`, 19, { i, L: [...L], R: [...R], ans: [...ans], hlL: [i], hlR: [i], hlAns: [i], calc: `${L[i]} * ${R[i]} = ${ans[i]}`, calcOp: 'merge' });
        }

        add("Return", "Merge complete. Return answer array.", 22, { L: [...L], R: [...R], ans: [...ans], isSuccess: true });
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

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-fuchsia-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <XSquare className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Product Except Self</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-fuchsia-600 bg-fuchsia-50 px-2 py-0.5 rounded">
                      LC 238 • Array & Prefix Sum
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
                <div className="flex items-center gap-3 text-fuchsia-600 font-black text-2xl uppercase tracking-tighter"><AlignLeft size={28}/> Problem Statement</div>
                
                <p className="text-base leading-relaxed">
                  Given an integer array <code>nums</code>, return an array <code>answer</code> such that <code>answer[i]</code> is equal to the product of all the elements of <code>nums</code> except <code>nums[i]</code>.<br/><br/>
                  The product of any prefix or suffix of <code>nums</code> is guaranteed to fit in a <strong>32-bit</strong> integer.<br/><br/>
                  You must write an algorithm that runs in <code>O(n)</code> time and without using the division operation.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-fuchsia-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-fuchsia-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> nums = [1,2,3,4]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> [24,12,8,6]</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: For index 0 (1), product is 2*3*4 = 24. For index 1 (2), product is 1*3*4 = 12.</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-cyan-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-cyan-400 font-black uppercase tracking-widest text-[10px]">Example 2 (Zeroes)</span>
                        <div><span className="text-white font-bold">Input:</span> nums = [-1,1,0,-3,3]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> [0,0,9,0,0]</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: Only the index containing '0' has a non-zero product, because excluding it removes the zero multiplier.</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Follow-ups</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-1">
                        <li>2 &lt;= nums.length &lt;= 10<sup>5</sup></li>
                        <li>-30 &lt;= nums[i] &lt;= 30</li>
                        <li>No Division allowed.</li>
                        <li className="font-bold text-fuchsia-600 mt-2">Follow up: Can you solve the problem in O(1) extra space complexity? (The output array does not count as extra space for space complexity analysis.)</li>
                    </ul>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-fuchsia-600 text-white border-fuchsia-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-fuchsia-200' : 'text-slate-400'}`}>{op.complexity}</div>
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
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-fuchsia-600 pl-1 flex justify-between">
                                <span>Input Array (nums)</span>
                            </label>
                            <input 
                                type="text"
                                value={inputString} 
                                onChange={(e) => setInputString(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all shadow-inner" 
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center w-full xl:w-auto mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep} className={`px-6 py-3 bg-fuchsia-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-fuchsia-200 hover:bg-fuchsia-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
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
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Calculation Complete</div>
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
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Layout size={14} className="text-fuchsia-500"/> Variable State</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className="p-1.5 text-slate-600 hover:text-fuchsia-600 rounded-lg transition-colors"><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className="p-1.5 text-slate-600 hover:text-fuchsia-600 rounded-lg transition-colors"><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className="p-1.5 text-slate-600 hover:text-fuchsia-600 rounded-lg transition-colors"><Maximize size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-16 pb-16 gap-8 overflow-auto scrollbar-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* Flexbox Rows - No absolute overlapping */}

                           {/* Math Calc Box */}
                           {st.calc && (
                               <div className="self-center bg-slate-800 text-white font-mono font-black text-lg px-6 py-2 rounded-2xl shadow-xl border-2 border-slate-700 animate-in slide-in-from-top-4 mb-2 flex items-center gap-3 z-50">
                                   <Calculator size={20} className={st.calcOp === 'left' ? 'text-fuchsia-400' : st.calcOp === 'right' ? 'text-cyan-400' : 'text-emerald-400'}/>
                                   {st.calc}
                               </div>
                           )}
                           
                           {/* Row 1: nums */}
                           <div className="flex flex-col items-center">
                               <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono mb-2">Input: nums</div>
                               <div className="flex gap-4 p-4 border border-slate-200 bg-white/80 rounded-2xl shadow-sm backdrop-blur-sm min-w-max">
                                   {st.nums && st.nums.length === 0 && <span className="text-slate-400 italic">empty</span>}
                                   {(st.nums || []).map((val, idx) => {
                                       const isHl = st.hlNums && st.hlNums.includes(idx);
                                       return (
                                           <div key={`num-${idx}`} className="relative">
                                               {st.i === idx && <PointerLabel label="i" color="slate" position="top" />}
                                               <ArrayNodeBlock val={val} idx={idx} themeColor={isHl ? 'slate' : 'slate'} isTarget={isHl} />
                                           </div>
                                       )
                                   })}
                               </div>
                           </div>

                           {/* Approach 2 Specific: L and R Arrays */}
                           {selectedOpId === 'lrArrays' && (
                               <div className="flex flex-col items-center gap-8">
                                   {st.L && (
                                       <div className="flex flex-col items-center">
                                           <div className="text-[10px] font-black text-fuchsia-600 uppercase tracking-widest font-mono mb-2">Prefix: L</div>
                                           <div className="flex gap-4 p-4 border-2 border-fuchsia-200 bg-fuchsia-50/80 rounded-2xl shadow-md backdrop-blur-sm min-w-max">
                                               {st.L.map((val, idx) => {
                                                   const isHl = st.hlL && st.hlL.includes(idx);
                                                   return (
                                                       <div key={`L-${idx}`}>
                                                           <ArrayNodeBlock val={val} idx={idx} themeColor="fuchsia" isTarget={isHl} />
                                                       </div>
                                                   )
                                               })}
                                           </div>
                                       </div>
                                   )}
                                   {st.R && (
                                       <div className="flex flex-col items-center">
                                           <div className="text-[10px] font-black text-cyan-600 uppercase tracking-widest font-mono mb-2">Suffix: R</div>
                                           <div className="flex gap-4 p-4 border-2 border-cyan-200 bg-cyan-50/80 rounded-2xl shadow-md backdrop-blur-sm min-w-max">
                                               {st.R.map((val, idx) => {
                                                   const isHl = st.hlR && st.hlR.includes(idx);
                                                   return (
                                                       <div key={`R-${idx}`}>
                                                           <ArrayNodeBlock val={val} idx={idx} themeColor="cyan" isTarget={isHl} />
                                                       </div>
                                                   )
                                               })}
                                           </div>
                                       </div>
                                   )}
                               </div>
                           )}

                           {/* Answer/Output Array (Used by both) */}
                           {st.ans && (
                               <div className="flex flex-col items-center relative">
                                   {/* R Multiplier Label for Optimal */}
                                   {selectedOpId === 'optimalSpace' && st.rVal !== undefined && (
                                       <div className="absolute -left-10 md:left-4 top-1/2 -translate-y-1/2 bg-cyan-100 border-2 border-cyan-400 p-3 rounded-2xl flex flex-col items-center shadow-lg shadow-cyan-200/50 z-20">
                                            <span className="text-[10px] font-black text-cyan-800 uppercase tracking-widest font-mono mb-1">R Multiplier</span>
                                            <span className="font-mono font-black text-3xl text-cyan-600">{st.rVal}</span>
                                       </div>
                                   )}

                                   <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest font-mono mb-2">Output: answer</div>
                                   <div className="flex gap-4 p-4 border-2 border-emerald-300 bg-emerald-50/80 rounded-2xl shadow-xl backdrop-blur-sm min-w-max">
                                       {st.ans.map((val, idx) => {
                                           const isHl = st.hlAns && st.hlAns.includes(idx);
                                           // If we are in optimal, left pass colors it fuchsia, right pass colors it emerald
                                           let color = 'emerald';
                                           if (selectedOpId === 'optimalSpace' && !st.isSuccess && st.rVal === undefined) color = 'fuchsia';

                                           return (
                                               <div key={`ans-${idx}`}>
                                                   <ArrayNodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} />
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
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><SplitSquareHorizontal size={120}/></div>
                        <h3 className="font-black text-fuchsia-400 text-lg uppercase tracking-widest mb-6">Prefix & Suffix Insight</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>The problem strictly forbids using Division (otherwise we could just multiply all elements and divide by <code>nums[i]</code>).</p>
                            <p>Instead, realize that the product of an array <em>except</em> index <code>i</code> is simply the product of all elements to its <strong>Left</strong> multiplied by all elements to its <strong>Right</strong>.</p>
                            <p className="bg-slate-800 p-4 rounded-xl font-mono text-center text-emerald-400">Answer[i] = Left[i] * Right[i]</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-fuchsia-50 border border-fuchsia-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-fuchsia-700 text-lg uppercase tracking-widest mb-6">O(N) Extra Space Logic</h3>
                        <div className="space-y-4 text-sm text-fuchsia-900/80 leading-relaxed font-medium">
                            <p>We can easily compute these in $O(N)$ time by pre-calculating two arrays.</p>
                            <p><code>L[i]</code>: We loop left-to-right. <code>L[i] = nums[i-1] * L[i-1]</code>. This carries the running product forward.</p>
                            <p><code>R[i]</code>: We loop right-to-left. <code>R[i] = nums[i+1] * R[i+1]</code>. This carries the running product backward.</p>
                            <p>Finally, another loop multiplies them together. This uses $O(N)$ Space.</p>
                        </div>
                    </div>

                    <div className="p-8 md:col-span-2 rounded-3xl bg-emerald-50 border border-emerald-200 relative overflow-hidden shadow-inner flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
                            <h3 className="font-black text-emerald-800 text-lg uppercase tracking-widest mb-4">The O(1) Space Optimization Trap</h3>
                            <p>The problem states: <em>"The output array does not count as extra space."</em> This is the massive hint!</p>
                            <p>Instead of a separate <code>L</code> array, we just write the Left prefix products directly into our final <code>answer</code> array.</p>
                            <p>Instead of an <code>R</code> array, we only need the <strong>immediate previous suffix value</strong>. We can track this using a single integer variable <code>int R = 1</code>, updating it dynamically as we traverse backward, multiplying it into the <code>answer</code> array on the fly!</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-fuchsia-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-fuchsia-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering The Division Constraint</h3>
                    <p className="text-sm text-fuchsia-50 leading-relaxed italic max-w-2xl font-mono">"If division was allowed, what happens if there are zeros? Walk the interviewer through the logic constraint first. Then explain the Left/Right array DP concept, and seamlessly transition into the O(1) variable optimization."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-fuchsia-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-fuchsia-50/50 border border-fuchsia-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-fuchsia-800 text-sm uppercase tracking-widest">
                               <div className="bg-fuchsia-200 p-2 rounded-lg text-fuchsia-700"><Minus size={16}/></div>
                               1. Acknowledge The Division Trap
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-fuchsia-100 shadow-inner flex-1">
                                "If I could use division, I'd just calculate the total product and do 'total / nums[i]'. But division introduces an edge case: what if nums[i] is 0? I'd get a DivideByZero error. What if there are two zeros? The prompt forbids division, so I must compute prefix and suffix aggregates."
                            </p>
                        </div>

                        <div className="bg-fuchsia-50/50 border border-fuchsia-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-fuchsia-800 text-sm uppercase tracking-widest">
                               <div className="bg-fuchsia-200 p-2 rounded-lg text-fuchsia-700"><SplitSquareHorizontal size={16}/></div>
                               2. Propose O(N) Arrays First
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-fuchsia-100 shadow-inner flex-1">
                                "I can solve this in O(N) time and Space by maintaining an array L where L[i] is the product of everything to the left of i, and an array R where R[i] is the product of everything right. Then answer[i] = L[i] * R[i]."
                            </p>
                        </div>

                        <div className="bg-fuchsia-50/50 border border-fuchsia-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-fuchsia-800 text-sm uppercase tracking-widest">
                               <div className="bg-fuchsia-200 p-2 rounded-lg text-fuchsia-700"><Zap size={16}/></div>
                               3. Introduce Output Array Freebie
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-fuchsia-100 shadow-inner flex-1">
                                "The prompt mentions the output array doesn't count towards space complexity. Therefore, I don't need a separate L array. I can just build those left prefix products directly inside my 'answer' array to save space."
                            </p>
                        </div>

                        <div className="bg-fuchsia-50/50 border border-fuchsia-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-fuchsia-800 text-sm uppercase tracking-widest">
                               <div className="bg-fuchsia-200 p-2 rounded-lg text-fuchsia-700"><Layers size={16}/></div>
                               4. Introduce Scalar Variable R
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-fuchsia-100 shadow-inner flex-1">
                                "Furthermore, I don't need an R array at all! Since I only ever need the right suffix product for the exact index I'm currently computing, I can just use a single integer variable 'R' starting at 1, multiplying it on the fly as I loop backwards. This brings me to O(1) auxiliary space!"
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
                          <div className="bg-fuchsia-600 p-2 rounded-lg text-white shadow-lg shadow-fuchsia-900/50"><Code2 size={20}/></div>
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
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? 'bg-fuchsia-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-80 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-fuchsia-600 pl-1">Input Array (nums)</label>
                              <input type="text" value={inputString} onChange={(e) => setInputString(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all shadow-inner" />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-fuchsia-600 rounded-xl hover:bg-fuchsia-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-fuchsia-600 rounded-xl hover:bg-fuchsia-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className="p-3 text-slate-600 hover:text-fuchsia-600 rounded-xl hover:bg-fuchsia-50 transition-all"><RotateCcw size={24}/></button>
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
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className="px-12 py-6 bg-fuchsia-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(217,70,239,0.3)] hover:bg-fuchsia-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-fuchsia-400 shadow-fuchsia-900/20">NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-500" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* Theater Layout: Strict Flexbox Rows without overlaps */}
                           <div className="p-16 pt-32 flex flex-col items-center justify-center gap-16 min-w-max h-full">
                               
                               {/* Math Calc Box */}
                               {st.calc && (
                                   <div className="bg-slate-800 text-white font-mono font-black text-2xl px-10 py-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-2 border-slate-700 animate-in slide-in-from-top-6 flex items-center gap-4 z-50">
                                       <Calculator size={28} className={st.calcOp === 'left' ? 'text-fuchsia-400' : st.calcOp === 'right' ? 'text-cyan-400' : 'text-emerald-400'}/>
                                       {st.calc}
                                   </div>
                               )}

                               {/* Row 1: nums */}
                               <div className="flex flex-col items-center scale-110 mb-4">
                                   <div className="text-xs font-black text-slate-500 uppercase tracking-widest font-mono mb-4 bg-slate-200 px-4 py-1 rounded-full">Input: nums</div>
                                   <div className="flex gap-6 p-6 border-4 border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-md min-w-max">
                                       {st.nums && st.nums.length === 0 && <span className="text-slate-400 italic text-2xl">empty</span>}
                                       {(st.nums || []).map((val, idx) => {
                                           const isHl = st.hlNums && st.hlNums.includes(idx);
                                           return (
                                               <div key={`num-fs-${idx}`} className="relative scale-110 origin-center">
                                                   {st.i === idx && <PointerLabel label="i" color="slate" position="top" />}
                                                   <ArrayNodeBlock val={val} idx={idx} themeColor={isHl ? 'slate' : 'slate'} isTarget={isHl} />
                                               </div>
                                           )
                                       })}
                                   </div>
                               </div>

                               {/* Approach 2 Specific: L and R Arrays */}
                               {selectedOpId === 'lrArrays' && (
                                   <div className="flex gap-20">
                                       {st.L && (
                                           <div className="flex flex-col items-center scale-110">
                                               <div className="text-xs font-black text-fuchsia-600 uppercase tracking-widest font-mono mb-4 bg-fuchsia-100 px-4 py-1 rounded-full">Prefix: L</div>
                                               <div className="flex gap-6 p-6 border-4 border-fuchsia-200 bg-fuchsia-50/90 rounded-[2rem] shadow-xl backdrop-blur-md min-w-max">
                                                   {st.L.map((val, idx) => {
                                                       const isHl = st.hlL && st.hlL.includes(idx);
                                                       return (
                                                           <div key={`L-fs-${idx}`} className="scale-110 origin-center">
                                                               <ArrayNodeBlock val={val} idx={idx} themeColor="fuchsia" isTarget={isHl} />
                                                           </div>
                                                       )
                                                   })}
                                               </div>
                                           </div>
                                       )}
                                       {st.R && (
                                           <div className="flex flex-col items-center scale-110">
                                               <div className="text-xs font-black text-cyan-600 uppercase tracking-widest font-mono mb-4 bg-cyan-100 px-4 py-1 rounded-full">Suffix: R</div>
                                               <div className="flex gap-6 p-6 border-4 border-cyan-200 bg-cyan-50/90 rounded-[2rem] shadow-xl backdrop-blur-md min-w-max">
                                                   {st.R.map((val, idx) => {
                                                       const isHl = st.hlR && st.hlR.includes(idx);
                                                       return (
                                                           <div key={`R-fs-${idx}`} className="scale-110 origin-center">
                                                               <ArrayNodeBlock val={val} idx={idx} themeColor="cyan" isTarget={isHl} />
                                                           </div>
                                                       )
                                                   })}
                                               </div>
                                           </div>
                                       )}
                                   </div>
                               )}

                               {/* Answer/Output Array */}
                               {st.ans && (
                                   <div className="flex flex-col items-center relative scale-125 mt-10">
                                       {/* R Multiplier Label for Optimal */}
                                       {selectedOpId === 'optimalSpace' && st.rVal !== undefined && (
                                           <div className="absolute -left-48 top-1/2 -translate-y-1/2 bg-cyan-100 border-4 border-cyan-400 p-6 rounded-[2rem] flex flex-col items-center shadow-[0_20px_50px_rgba(34,211,238,0.4)] z-20">
                                                <span className="text-xs font-black text-cyan-800 uppercase tracking-widest font-mono mb-2 text-center">Right<br/>Multiplier</span>
                                                <span className="font-mono font-black text-5xl text-cyan-600">{st.rVal}</span>
                                           </div>
                                       )}

                                       <div className="text-xs font-black text-emerald-600 uppercase tracking-widest font-mono mb-4 bg-emerald-100 px-6 py-1.5 rounded-full">Output: answer</div>
                                       <div className="flex gap-8 p-8 border-[4px] border-emerald-300 bg-emerald-50/90 rounded-[2.5rem] shadow-2xl backdrop-blur-md min-w-max">
                                           {st.ans.map((val, idx) => {
                                               const isHl = st.hlAns && st.hlAns.includes(idx);
                                               let color = 'emerald';
                                               if (selectedOpId === 'optimalSpace' && !st.isSuccess && st.rVal === undefined) color = 'fuchsia';

                                               return (
                                                   <div key={`ans-fs-${idx}`} className="scale-125 origin-center mx-2">
                                                       <ArrayNodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} />
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
                                    CALCULATION COMPLETE
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