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
  boyerMoore: {
    id: 'boyerMoore',
    title: '1. Boyer-Moore Voting (Optimal)',
    icon: <Users size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public int majorityElement(int[] nums) {
    int count = 0;
    Integer candidate = null;
    
    for (int i = 0; i < nums.length; i++) {
        int num = nums[i];
        
        if (count == 0) {
            candidate = num;
        }
        
        if (candidate == num) {
            count++;
        } else {
            count--;
        }
    }
    
    return candidate;
}`,
    desc: "The ingenous Boyer-Moore Voting Algorithm. It runs in strictly O(N) time and O(1) space. It maintains a 'candidate' and a 'count'. When a number matches the candidate, the count goes up. When it differs, the count goes down. If the count hits 0, the next number becomes the new candidate. Because the majority element appears more than n/2 times, it will mathematically always survive the 'cancellations'."
  },
  hashMap: {
    id: 'hashMap',
    title: '2. HashMap Counting',
    icon: <Database size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public int majorityElement(int[] nums) {
    Map<Integer, Integer> map = new HashMap<>();
    int n = nums.length;
    
    for (int i = 0; i < n; i++) {
        int num = nums[i];
        
        int currentCount = map.getOrDefault(num, 0) + 1;
        map.put(num, currentCount);
        
        if (currentCount > n / 2) {
            return num;
        }
    }
    
    return -1;
}`,
    desc: "The standard intuitive approach. We use a HashMap to count the occurrences of each number as we iterate through the array. As soon as we see a number whose count exceeds n/2, we immediately return it. It is fast but requires O(N) auxiliary space."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|return|if|else|for|while|continue|new|length|Map|HashMap|Integer|put|getOrDefault|null)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-sky-500/20`, border: `border-sky-400`, text: `text-sky-300` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-sky-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'return', 'if', 'else', 'for', 'while', 'continue', 'new', 'null'].includes(part);
            const isObject = ['Map', 'HashMap', 'Integer'].includes(part);
            const isVar = ['nums', 'count', 'candidate', 'map', 'n', 'num', 'currentCount', 'i'].includes(part);
            const isMapCall = ['length', 'put', 'getOrDefault'].includes(part);

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-amber-400 font-bold';
            else if (isVar) className = 'text-sky-200';
            else if (isMapCall) className = 'text-amber-400';
            else if (part.startsWith("'") || part.startsWith('"') || !isNaN(parseInt(part))) className = 'text-emerald-400';

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
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', index: 'bg-rose-100 text-rose-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' }
    };
    
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;

    const displayVal = val === null ? 'null' : String(val);

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

export default function MajorityElementVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('boyerMoore');
  
  const [inputString, setInputString] = useState('2, 2, 1, 1, 1, 2, 2');
  
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

    if (selectedOpId === 'boyerMoore') {
        let count = 0;
        let candidate = null;
        
        add("Initialize", `Set count = 0 and candidate = null.`, 3, { count, candidate });

        for (let i = 0; i < n; i++) {
            add("Loop Condition", `for (int i = ${i}; i < ${n}; i++) -> Entering loop for index ${i}.`, 5, { i, count, candidate });
            
            let num = nums[i];
            add("Extract Number", `int num = nums[${i}]; -> Current number is ${num}.`, 6, { i, num, count, candidate, hlI: i });

            add("Check Count Zero", `if (count == 0) -> Is the vote count currently 0?`, 8, { i, num, count, candidate, hlI: i, checkingCount: true });

            if (count === 0) {
                candidate = num;
                add("Elect New Candidate", `Count is 0! The previous candidate (if any) lost all votes. Elect ${num} as the new candidate.`, 9, { i, num, count, candidate, hlI: i, elected: true });
            } else {
                add("Count Not Zero", `Count is ${count}, not 0. Candidate ${candidate} still holds power.`, 8, { i, num, count, candidate, hlI: i });
            }

            add("Compare Candidate", `if (candidate == num) -> Does ${num} match our candidate ${candidate}?`, 12, { i, num, count, candidate, hlI: i, checkingMatch: true });

            if (candidate === num) {
                let oldCount = count;
                count++;
                add("Increment Count", `Match! Increment count from ${oldCount} to ${count}.`, 13, { i, num, count, candidate, hlI: i, isInc: true });
            } else {
                let oldCount = count;
                count--;
                add("Decrement Count", `Mismatch! Different number votes against candidate. Decrement count from ${oldCount} to ${count}.`, 15, { i, num, count, candidate, hlI: i, isDec: true });
            }
        }
        
        add("Return Result", `Iteration complete. The mathematically surviving candidate is ${candidate}. Return ${candidate}.`, 19, { count, candidate, isSuccess: true });

    } else if (selectedOpId === 'hashMap') {
        
        let map = new Map();
        
        add("Initialize", `Create HashMap to store frequencies. n = ${n}. Target frequency is > ${Math.floor(n/2)}.`, 3, { map: new Map(map) });

        for (let i = 0; i < n; i++) {
            add("Loop Condition", `for (int i = ${i}; i < ${n}; i++) -> Entering loop for index ${i}.`, 5, { i, map: new Map(map) });
            
            let num = nums[i];
            add("Extract Number", `int num = nums[${i}]; -> Current number is ${num}.`, 6, { i, num, map: new Map(map), hlI: i });

            let freq = map.get(num) || 0;
            let currentCount = freq + 1;
            
            add("Calculate Count", `Calculate new count for ${num}: was ${freq}, now ${currentCount}.`, 8, { i, num, currentCount, map: new Map(map), hlI: i });

            map.set(num, currentCount);
            add("Update Map", `map.put(${num}, ${currentCount}); Update the hash map.`, 9, { i, num, currentCount, map: new Map(map), hlI: i, justAdded: num });

            add("Check Majority", `if (currentCount > n / 2) -> Is ${currentCount} > ${Math.floor(n/2)}?`, 11, { i, num, currentCount, map: new Map(map), hlI: i, checkingMajority: true });

            if (currentCount > n / 2) {
                add("Majority Found!", `Yes! ${num} has appeared more than n/2 times. Return ${num}.`, 12, { i, num, currentCount, map: new Map(map), hlI: i, isSuccess: true, result: num });
                return steps;
            } else {
                add("Not Yet Majority", `No. Continue counting.`, 11, { i, num, currentCount, map: new Map(map), hlI: i });
            }
        }

        add("Fallback", `Loop finished without finding majority (shouldn't happen per constraints). Return -1.`, 16, { map: new Map(map), isFail: true });
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
            <div className="bg-sky-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <Users className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Majority Element</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                      LC 169 • Arrays
                  </span>
                  <span>•</span>
                  <span>Boyer-Moore Voting</span>
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
                  Given an array <code>nums</code> of size <code>n</code>, return the majority element.<br/><br/>
                  The majority element is the element that appears more than <code>&lfloor;n / 2&rfloor;</code> times. You may assume that the majority element always exists in the array.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-sky-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-sky-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> nums = [3,2,3]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 3</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: 3 appears 2 times out of 3, which is &gt; 1.5.</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> nums = [2,2,1,1,1,2,2]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 2</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: 2 appears 4 times out of 7, which is &gt; 3.5.</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Follow-up</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-1">
                        <li>n == nums.length</li>
                        <li>1 &lt;= n &lt;= 5 * 10<sup>4</sup></li>
                        <li>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></li>
                        <li className="font-bold text-sky-600 mt-2">Follow-up: Could you solve the problem in linear time and in O(1) space?</li>
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
                        <div className="flex gap-2 shrink-0 justify-end items-center w-full xl:w-auto mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess || st.isFail} className={`px-6 py-3 bg-sky-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-sky-200 hover:bg-sky-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-6 shadow-xl border transition-all duration-300 min-h-[130px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : st.isFail ? 'bg-rose-900 border-rose-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={80} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-2 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Majority Found</div>
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
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-20 pb-16 gap-10 items-center" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* --- Strict Flexbox Layout --- */}

                           {/* Row 1: Running Variables */}
                           {selectedOpId === 'boyerMoore' && (
                               <div className="flex gap-8 mb-4">
                                    <div className={`p-4 rounded-2xl border-4 shadow-xl flex flex-col items-center min-w-[120px] transition-all duration-500 ${st.elected ? 'bg-sky-100 border-sky-400 scale-110 shadow-[0_0_20px_rgba(56,189,248,0.4)]' : 'bg-white border-slate-200'}`}>
                                        <span className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-1">Candidate</span>
                                        <span className="font-mono text-4xl font-black text-slate-800">{st.candidate === null ? '?' : st.candidate}</span>
                                    </div>
                                    <div className={`p-4 rounded-2xl border-4 shadow-xl flex flex-col items-center min-w-[120px] transition-all duration-500 ${st.isInc ? 'bg-emerald-100 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)] scale-110' : st.isDec ? 'bg-rose-100 border-rose-400 shadow-[0_0_20px_rgba(251,113,133,0.4)] scale-90' : 'bg-white border-slate-200'}`}>
                                        <span className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-1">Votes (Count)</span>
                                        <span className={`font-mono text-4xl font-black ${st.isInc ? 'text-emerald-600' : st.isDec ? 'text-rose-600' : 'text-slate-800'}`}>{st.count !== undefined ? st.count : 0}</span>
                                    </div>
                               </div>
                           )}

                           {selectedOpId === 'hashMap' && (
                               <div className="flex gap-6 mb-4">
                                    <div className="bg-slate-800 text-white p-4 rounded-2xl border-2 border-slate-700 shadow-xl flex flex-col items-center min-w-[120px]">
                                        <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Target (&gt; n/2)</span>
                                        <span className="font-mono text-3xl font-black text-emerald-400">&gt; {st.n ? Math.floor(st.n/2) : 0}</span>
                                    </div>
                                    {st.currentCount !== undefined && (
                                        <div className="bg-sky-900 text-white p-4 rounded-2xl border-2 border-sky-700 shadow-xl flex flex-col items-center min-w-[120px] animate-in slide-in-from-left-4">
                                            <span className="text-[10px] uppercase tracking-widest font-black text-sky-300 mb-1">currentCount</span>
                                            <span className="font-mono text-3xl font-black text-sky-100">{st.currentCount}</span>
                                        </div>
                                    )}
                               </div>
                           )}

                           {/* Row 2: Input Array */}
                           <div className="flex flex-col items-center w-full max-w-3xl">
                               <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono mb-2">Array nums</div>
                               <div className="flex gap-3 p-5 border-2 border-slate-200 bg-white/90 rounded-3xl shadow-lg backdrop-blur-sm flex-wrap justify-center w-full">
                                   {(st.nums || []).length === 0 && <span className="text-slate-400 italic">empty</span>}
                                   {(st.nums || []).map((val, idx) => {
                                       const isHl = st.hlI === idx;
                                       let color = 'slate';
                                       
                                       if (isHl) {
                                           if (selectedOpId === 'boyerMoore') {
                                               if (st.isInc) color = 'emerald';
                                               else if (st.isDec) color = 'rose';
                                               else if (st.elected) color = 'sky';
                                               else color = 'amber'; // generic active
                                           } else {
                                               color = 'sky';
                                           }
                                       }
                                       
                                       // In success state, highlight all majority elements
                                       if (st.isSuccess && val === (st.result !== undefined ? st.result : st.candidate)) {
                                            color = 'emerald';
                                       }

                                       return (
                                           <div key={`num-${idx}`} className="relative scale-90 md:scale-100 m-1">
                                               {isHl && <PointerLabel label="i" color={color} position="top" />}
                                               <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} />
                                           </div>
                                       )
                                   })}
                               </div>
                           </div>

                           {/* Row 3: HashMap (if HashMap approach) */}
                           {selectedOpId === 'hashMap' && st.map && (
                               <div className="flex flex-col items-center mt-4 w-full max-w-sm">
                                   <div className="text-[10px] font-black text-sky-600 uppercase tracking-widest font-mono mb-2 flex items-center gap-1"><Database size={12}/> Count HashMap</div>
                                   <div className="w-full bg-white border-2 border-sky-200 rounded-2xl shadow-xl overflow-hidden">
                                       <div className="grid grid-cols-2 bg-sky-50 text-[10px] font-black uppercase tracking-widest text-sky-800 border-b border-sky-200">
                                           <div className="p-3 text-center border-r border-sky-200">Number</div>
                                           <div className="p-3 text-center">Count</div>
                                       </div>
                                       <div className="flex flex-col max-h-[150px] overflow-y-auto scrollbar-thin">
                                            {st.map.size === 0 && <div className="p-4 text-center text-xs italic text-slate-400">Empty</div>}
                                            {Array.from(st.map.entries()).sort((a,b)=>a[0]-b[0]).map(([k, v]) => {
                                                const isJustAdded = st.justAdded === k;
                                                const isSuccess = st.isSuccess && st.result === k;
                                                
                                                let rowClass = "border-b border-slate-100 last:border-0";
                                                let textClass = "text-slate-600";
                                                
                                                if (isSuccess) { rowClass += " bg-emerald-100 border-emerald-300"; textClass = "text-emerald-800 font-black scale-110"; }
                                                else if (isJustAdded) { rowClass += " bg-sky-100"; textClass = "text-sky-800 font-bold"; }

                                                return (
                                                    <div key={k} className={`grid grid-cols-2 font-mono text-base transition-all duration-300 ${rowClass}`}>
                                                        <div className={`p-3 text-center border-r border-slate-100 ${textClass}`}>{k}</div>
                                                        <div className={`p-3 text-center ${textClass}`}>{v}</div>
                                                    </div>
                                                )
                                            })}
                                       </div>
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
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Users size={120}/></div>
                        <h3 className="font-black text-sky-400 text-lg uppercase tracking-widest mb-6">Boyer-Moore: Battle Royale</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>Think of the array as a giant battle royale. Every distinct number is a faction.</p>
                            <p>When two <strong>different</strong> numbers encounter each other, they cancel each other out (both die).</p>
                            <p>Because the problem guarantees the Majority Element exists and makes up <strong>more than half (&gt; &lfloor;n/2&rfloor;)</strong> of the array, it is mathematically impossible for all of its soldiers to be killed. Even if every other faction teams up exclusively against the Majority Faction, the Majority Faction will still have at least 1 survivor standing at the end.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-sky-50 border border-sky-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-sky-700 text-lg uppercase tracking-widest mb-6">The Rules of the Vote</h3>
                        <div className="space-y-4 text-sm text-sky-900/80 leading-relaxed font-medium">
                            <p>We maintain a <code>candidate</code> and a <code>count</code>.</p>
                            <ul className="list-disc ml-6 space-y-2">
                                <li>If <code>count == 0</code>, the previous candidate was completely cancelled out. The current number becomes the new <code>candidate</code>.</li>
                                <li>If the current number matches the <code>candidate</code>, they join forces (<code>count++</code>).</li>
                                <li>If the current number differs, they fight and cancel (<code>count--</code>).</li>
                            </ul>
                            <p>Whatever candidate is left in the variable at the end of the loop is the winner.</p>
                        </div>
                    </div>

                    <div className="p-8 md:col-span-2 rounded-3xl bg-slate-50 border border-slate-200 relative overflow-hidden shadow-inner flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
                            <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest mb-4">What if Majority Isn't Guaranteed?</h3>
                            <p>LeetCode 169 explicitly states: <em>"You may assume that the majority element always exists."</em></p>
                            <p>If this was NOT guaranteed, Boyer-Moore might return a false positive. For example, in <code>[1, 2, 3]</code>, the algorithm will return <code>3</code> as the candidate, but 3 is not a majority.</p>
                            <p>To fix this, you must run a <strong>second pass</strong> through the array to manually count the occurrences of the surviving <code>candidate</code> and verify it actually appears &gt; n/2 times.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-sky-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-sky-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering The Progression</h3>
                    <p className="text-sm text-sky-50 leading-relaxed italic max-w-2xl font-mono">"This question is designed to test your knowledge of space-time tradeoffs. Do not jump straight to Boyer-Moore. You must walk the interviewer through the O(N) Space approach, then the O(N log N) Time approach, before delivering the O(1) Space masterclass."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-sky-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-sky-50/50 border border-sky-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-sky-800 text-sm uppercase tracking-widest">
                               <div className="bg-sky-200 p-2 rounded-lg text-sky-700"><Database size={16}/></div>
                               1. Propose Hash Map Baseline
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-sky-100 shadow-inner flex-1">
                                "The most straightforward approach is to use a HashMap to maintain frequency counts. I iterate through the array once, increment the count for each element, and return the first element whose count exceeds n/2. This gives O(N) Time, but costs O(N) auxiliary Space."
                            </p>
                        </div>

                        <div className="bg-sky-50/50 border border-sky-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-sky-800 text-sm uppercase tracking-widest">
                               <div className="bg-sky-200 p-2 rounded-lg text-sky-700"><ListOrdered size={16}/></div>
                               2. Propose Sorting Tradeoff
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-sky-100 shadow-inner flex-1">
                                "If I need to optimize Space to O(1), I could sort the array. Since the majority element appears more than n/2 times, if I sort the array, the majority element will always be situated exactly at the middle index (nums[nums.length / 2]). However, sorting drops the Time complexity to O(N log N)."
                            </p>
                        </div>

                        <div className="bg-sky-50/50 border border-sky-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-sky-800 text-sm uppercase tracking-widest">
                               <div className="bg-sky-200 p-2 rounded-lg text-sky-700"><Users size={16}/></div>
                               3. Deliver Boyer-Moore Voting
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-sky-100 shadow-inner flex-1">
                                "To achieve strictly O(N) Time and O(1) Space, I will use the Boyer-Moore Voting Algorithm. Because the majority element holds more than 50% of the array, I can maintain a 'candidate' and a 'count'. Every time I see the candidate, I increment. Every time I see a different number, I decrement. If count hits 0, I swap candidates. The majority element is mathematically guaranteed to be the final survivor."
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
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : st.isFail ? 'bg-rose-900/40 border-rose-800' : 'bg-slate-800/40 border-slate-700'}`}>
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
                          <div className="w-80 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-sky-600 pl-1">Input Array (nums)</label>
                              <input type="text" value={inputString} onChange={(e) => setInputString(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-inner" />
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
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-500 flex flex-col p-16 pt-40 gap-20 items-center min-w-max h-full" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* --- Strict Flexbox Layout (Theater) --- */}

                           {/* Row 1: Running Variables */}
                           {selectedOpId === 'boyerMoore' && (
                               <div className="flex gap-12 scale-125 origin-center">
                                    <div className={`p-8 rounded-[2rem] border-[4px] shadow-2xl flex flex-col items-center min-w-[200px] transition-all duration-500 ${st.elected ? 'bg-sky-100 border-sky-400 scale-110 shadow-[0_0_30px_rgba(56,189,248,0.5)] z-20' : 'bg-white border-slate-200'}`}>
                                        <span className="text-sm uppercase tracking-widest font-black text-slate-500 mb-2">Candidate</span>
                                        <span className="font-mono text-6xl font-black text-slate-800">{st.candidate === null ? '?' : st.candidate}</span>
                                    </div>
                                    <div className={`p-8 rounded-[2rem] border-[4px] shadow-2xl flex flex-col items-center min-w-[200px] transition-all duration-500 ${st.isInc ? 'bg-emerald-100 border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.5)] scale-110 z-20' : st.isDec ? 'bg-rose-100 border-rose-400 shadow-[0_0_30px_rgba(251,113,133,0.5)] scale-90' : 'bg-white border-slate-200'}`}>
                                        <span className="text-sm uppercase tracking-widest font-black text-slate-500 mb-2">Votes (Count)</span>
                                        <span className={`font-mono text-6xl font-black ${st.isInc ? 'text-emerald-600' : st.isDec ? 'text-rose-600' : 'text-slate-800'}`}>{st.count !== undefined ? st.count : 0}</span>
                                    </div>
                               </div>
                           )}

                           {selectedOpId === 'hashMap' && (
                               <div className="flex gap-10 scale-125 origin-center">
                                    <div className="bg-slate-800 text-white p-8 rounded-[2rem] border-4 border-slate-700 shadow-2xl flex flex-col items-center min-w-[200px]">
                                        <span className="text-sm uppercase tracking-widest font-black text-slate-400 mb-2">Target (&gt; n/2)</span>
                                        <span className="font-mono text-5xl font-black text-emerald-400">&gt; {st.n ? Math.floor(st.n/2) : 0}</span>
                                    </div>
                                    {st.currentCount !== undefined && (
                                        <div className="bg-sky-900 text-white p-8 rounded-[2rem] border-4 border-sky-700 shadow-[0_10px_40px_rgba(2,132,199,0.4)] flex flex-col items-center min-w-[200px] animate-in slide-in-from-left-6">
                                            <span className="text-sm uppercase tracking-widest font-black text-sky-300 mb-2">currentCount</span>
                                            <span className="font-mono text-5xl font-black text-sky-100">{st.currentCount}</span>
                                        </div>
                                    )}
                               </div>
                           )}

                           {/* Row 2: Input Array */}
                           <div className="flex flex-col items-center w-full max-w-5xl scale-125 origin-center mt-10">
                               <div className="text-xs font-black text-slate-500 uppercase tracking-widest font-mono mb-4 bg-white/50 px-4 py-1.5 rounded-full shadow-sm">Array nums</div>
                               <div className="flex gap-6 p-8 border-4 border-slate-200 bg-white/90 rounded-[2rem] shadow-2xl backdrop-blur-md flex-wrap justify-center w-full">
                                   {(st.nums || []).length === 0 && <span className="text-slate-400 italic text-2xl">empty</span>}
                                   {(st.nums || []).map((val, idx) => {
                                       const isHl = st.hlI === idx;
                                       let color = 'slate';
                                       
                                       if (isHl) {
                                           if (selectedOpId === 'boyerMoore') {
                                               if (st.isInc) color = 'emerald';
                                               else if (st.isDec) color = 'rose';
                                               else if (st.elected) color = 'sky';
                                               else color = 'amber'; 
                                           } else {
                                               color = 'sky';
                                           }
                                       }
                                       
                                       if (st.isSuccess && val === (st.result !== undefined ? st.result : st.candidate)) {
                                            color = 'emerald';
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

                           {/* Row 3: HashMap (if HashMap approach) */}
                           {selectedOpId === 'hashMap' && st.map && (
                               <div className="flex flex-col items-center mt-10 w-full max-w-xl scale-125 origin-center">
                                   <div className="text-xs font-black text-sky-600 uppercase tracking-widest font-mono mb-4 flex items-center gap-2 bg-sky-100 px-4 py-1.5 rounded-full shadow-sm"><Database size={16}/> Count HashMap</div>
                                   <div className="w-full bg-white border-4 border-sky-200 rounded-[2rem] shadow-2xl overflow-hidden">
                                       <div className="grid grid-cols-2 bg-sky-50 text-xs font-black uppercase tracking-widest text-sky-800 border-b-2 border-sky-200">
                                           <div className="p-4 text-center border-r-2 border-sky-200">Number</div>
                                           <div className="p-4 text-center">Count</div>
                                       </div>
                                       <div className="flex flex-col max-h-[250px] overflow-y-auto scrollbar-thin">
                                            {st.map.size === 0 && <div className="p-8 text-center text-lg italic text-slate-400">Empty</div>}
                                            {Array.from(st.map.entries()).sort((a,b)=>a[0]-b[0]).map(([k, v]) => {
                                                const isJustAdded = st.justAdded === k;
                                                const isSuccess = st.isSuccess && st.result === k;
                                                
                                                let rowClass = "border-b-2 border-slate-100 last:border-0";
                                                let textClass = "text-slate-600";
                                                
                                                if (isSuccess) { rowClass += " bg-emerald-100 border-emerald-300"; textClass = "text-emerald-800 font-black scale-110"; }
                                                else if (isJustAdded) { rowClass += " bg-sky-100"; textClass = "text-sky-800 font-bold"; }

                                                return (
                                                    <div key={`map-fs-${k}`} className={`grid grid-cols-2 font-mono text-2xl transition-all duration-300 ${rowClass}`}>
                                                        <div className={`p-4 text-center border-r-2 border-slate-100 ${textClass}`}>{k}</div>
                                                        <div className={`p-4 text-center ${textClass}`}>{v}</div>
                                                    </div>
                                                )
                                            })}
                                       </div>
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
                                    MAJORITY FOUND
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