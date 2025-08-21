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
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Target, Keyboard, Type, KeyRound, Box, Landmark, Calculator, Plus, Minus, History, Grid3x3, LayoutGrid, AlertOctagon, Repeat1, AlignLeft, XSquare, ArrowRightLeft
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  prefixHash: {
    id: 'prefixHash',
    title: '1. Prefix Sum + HashMap (Optimal)',
    icon: <Database size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public int subarraySum(int[] nums, int k) {
    int count = 0, currSum = 0;
    HashMap<Integer, Integer> map = new HashMap<>();
    
    // Base case: A prefix sum of 0 has occurred 1 time
    map.put(0, 1);
    
    for (int i = 0; i < nums.length; i++) {
        currSum += nums[i];
        
        // If (currSum - k) exists, there is a valid subarray
        int target = currSum - k;
        if (map.containsKey(target)) {
            count += map.get(target);
        }
        
        // Add current prefix sum to the map
        map.put(currSum, map.getOrDefault(currSum, 0) + 1);
    }
    
    return count;
}`,
    desc: "The optimal O(N) approach. We maintain a running sum (currSum). If (currSum - k) exists in our HashMap, it means we've seen a previous prefix sum that we can 'chop off' to leave a subarray of exactly sum k. The HashMap stores the frequencies of all prefix sums we've encountered."
  },
  bruteForce: {
    id: 'bruteForce',
    title: '2. Cumulative Sum (Brute Force)',
    icon: <ArrowRightLeft size={16} />,
    complexity: 'Time: O(N²) | Space: O(1)',
    code: `public int subarraySum(int[] nums, int k) {
    int count = 0;
    
    // Check every possible starting point
    for (int i = 0; i < nums.length; i++) {
        int sum = 0;
        
        // Accumulate sum for every possible ending point
        for (int j = i; j < nums.length; j++) {
            sum += nums[j];
            
            if (sum == k) {
                count++;
            }
        }
    }
    
    return count;
}`,
    desc: "The naive approach. We use two nested loops to check the sum of every single contiguous subarray. We start at index i, and expand our subarray to j, keeping a running total. If the sum hits k, we increment our counter. Too slow for large arrays."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|return|if|else|for|while|continue|new|length|HashMap|Integer|put|containsKey|get|getOrDefault)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-indigo-500/20`, border: `border-indigo-400`, text: `text-indigo-300` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-indigo-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'return', 'if', 'else', 'for', 'while', 'continue', 'new'].includes(part);
            const isObject = ['HashMap', 'Integer'].includes(part);
            const isVar = ['nums', 'k', 'count', 'currSum', 'map', 'i', 'j', 'sum', 'target'].includes(part);
            const isMapCall = ['length', 'put', 'containsKey', 'get', 'getOrDefault'].includes(part);

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-sky-400 font-bold';
            else if (isVar) className = 'text-indigo-300';
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
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800', index: 'bg-indigo-100 text-indigo-600' },
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

export default function SubarraySumVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('prefixHash');
  
  const [inputString, setInputString] = useState('1, -1, 1, 1, 1, 1');
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
    setTargetK(isNaN(kVal) ? 0 : kVal);
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
    let k = targetK;
    let n = nums.length;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            nums: [...nums],
            k,
            n,
            ...st 
        } 
    });

    if (selectedOpId === 'prefixHash') {
        let count = 0;
        let currSum = 0;
        let map = new Map();
        
        add("Initialize", `Set count = 0, currSum = 0. We are looking for subarrays summing to k = ${k}.`, 2, { count, currSum, map: new Map(map) });
        
        map.set(0, 1);
        add("Base Case Map", `map.put(0, 1); We seed the map with {0: 1}. If currSum exactly equals k, (currSum - k) will be 0. We need 0 in the map to count this valid prefix.`, 6, { count, currSum, map: new Map(map), justAddedKey: 0 });

        for (let i = 0; i < n; i++) {
            add("Loop Start", `Entering loop for index i = ${i}. nums[${i}] = ${nums[i]}.`, 8, { i, count, currSum, map: new Map(map), hlIdx: i });
            
            let oldSum = currSum;
            currSum += nums[i];
            add("Update Prefix Sum", `currSum += nums[${i}] -> ${oldSum} + ${nums[i]} = ${currSum}.`, 9, { i, count, currSum, map: new Map(map), hlIdx: i, sumChanged: true });
            
            let target = currSum - k;
            add("Calculate Target", `target = currSum - k -> ${currSum} - ${k} = ${target}. We need to find if prefix sum ${target} occurred previously.`, 12, { i, count, currSum, target, map: new Map(map), hlIdx: i });
            
            add("Check HashMap", `if (map.containsKey(${target})) -> Does the map have ${target}?`, 13, { i, count, currSum, target, map: new Map(map), hlIdx: i, checkingMap: target });

            if (map.has(target)) {
                let occurrences = map.get(target);
                let oldCount = count;
                count += occurrences;
                add("Match Found!", `Map contains ${target}! It occurred ${occurrences} time(s). count = ${oldCount} + ${occurrences} = ${count}.`, 14, { i, count, currSum, target, map: new Map(map), hlIdx: i, matchFound: true, matchedKey: target });
            } else {
                add("No Match", `Map does not contain ${target}. No valid subarray ends exactly here.`, 13, { i, count, currSum, target, map: new Map(map), hlIdx: i });
            }
            
            let freq = map.get(currSum) || 0;
            map.set(currSum, freq + 1);
            add("Update HashMap", `Add current prefix sum to map. map.put(${currSum}, ${freq} + 1).`, 18, { i, count, currSum, map: new Map(map), hlIdx: i, justAddedKey: currSum });
        }
        
        add("Return", `Array fully processed. Total subarrays found: ${count}.`, 21, { count, currSum, map: new Map(map), isSuccess: true });

    } else if (selectedOpId === 'bruteForce') {
        let count = 0;
        
        add("Initialize", `Set count = 0. Target k = ${k}.`, 2, { count });

        for (let i = 0; i < n; i++) {
            add("Outer Loop (Start Point)", `Set starting pointer i = ${i}.`, 5, { i, count, hlI: i });
            
            let sum = 0;
            add("Reset Sum", `Initialize running sum = 0 for this new starting point.`, 6, { i, count, sum, hlI: i });
            
            for (let j = i; j < n; j++) {
                add("Inner Loop (End Point)", `Set ending pointer j = ${j}. Looking at subarray nums[${i}...${j}].`, 9, { i, j, count, sum, hlI: i, hlJ: j, subarrayRange: [i, j] });
                
                let oldSum = sum;
                sum += nums[j];
                add("Accumulate Sum", `sum += nums[${j}] -> ${oldSum} + ${nums[j]} = ${sum}.`, 10, { i, j, count, sum, hlI: i, hlJ: j, subarrayRange: [i, j] });
                
                add("Check Condition", `if (sum == k) -> Is ${sum} == ${k}?`, 12, { i, j, count, sum, hlI: i, hlJ: j, subarrayRange: [i, j] });
                
                if (sum === k) {
                    count++;
                    add("Subarray Found!", `Match! Increment count to ${count}.`, 13, { i, j, count, sum, hlI: i, hlJ: j, subarrayRange: [i, j], matchFound: true });
                } else {
                    add("No Match", `Sum ${sum} != ${k}. Continue inner loop.`, 12, { i, j, count, sum, hlI: i, hlJ: j, subarrayRange: [i, j] });
                }
            }
        }

        add("Return", `Checked all possible subarrays. Total found: ${count}.`, 18, { count, isSuccess: true });
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
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <Filter className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Subarray Sum Equals K</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      LC 560 • Arrays & Hashing
                  </span>
                  <span>•</span>
                  <span>Prefix Sums</span>
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
                <div className="flex items-center gap-3 text-indigo-600 font-black text-2xl uppercase tracking-tighter"><AlignLeft size={28}/> Problem Statement</div>
                
                <p className="text-base leading-relaxed">
                  Given an array of integers <code>nums</code> and an integer <code>k</code>, return the total number of subarrays whose sum equals to <code>k</code>.<br/><br/>
                  A subarray is a contiguous non-empty sequence of elements within an array.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-indigo-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-indigo-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> nums = [1,1,1], k = 2</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 2</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: The subarrays [1,1] (indices 0 to 1) and [1,1] (indices 1 to 2) sum to 2.</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-emerald-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> nums = [1,2,3], k = 3</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 2</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: The subarrays [1,2] and [3] sum to 3.</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Traps</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-1">
                        <li>1 &lt;= nums.length &lt;= 2 * 10<sup>4</sup></li>
                        <li className="font-bold text-rose-500">-1000 &lt;= nums[i] &lt;= 1000</li>
                        <li className="italic text-slate-500">Crucial Trap: Since nums[i] can be negative, the running sum does not strictly increase. This mathematically breaks the Sliding Window (Two Pointers) pattern!</li>
                        <li>-10<sup>7</sup> &lt;= k &lt;= 10<sup>7</sup></li>
                    </ul>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-indigo-600 text-white border-indigo-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-indigo-200' : 'text-slate-400'}`}>{op.complexity}</div>
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
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-indigo-600 pl-1 flex justify-between">
                                <span>Input Array (nums)</span>
                            </label>
                            <input 
                                type="text"
                                value={inputString} 
                                onChange={(e) => setInputString(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" 
                                spellCheck={false}
                            />
                        </div>
                        <div className="w-full xl:w-24 space-y-1.5 group shrink-0">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-emerald-600 pl-1 flex justify-between">
                                <span>Target K</span>
                            </label>
                            <input 
                                type="number"
                                value={inputK} 
                                onChange={(e) => setInputK(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner text-center font-black text-emerald-600" 
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center w-full xl:w-auto mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep} className={`px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-6 shadow-xl border transition-all duration-300 min-h-[130px] relative overflow-hidden flex-1 ${st.matchFound ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={80} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-2 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.matchFound ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Target Hit</div>
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
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Layout size={14} className="text-indigo-500"/> Variable State</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className="p-1.5 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className="p-1.5 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className="p-1.5 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><Maximize size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-16 pb-16 gap-8 items-center" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* --- Strict Flexbox Layout (No Overlaps) --- */}

                           {/* Row 1: Running Variables */}
                           <div className="flex gap-4 mb-4">
                                <div className="bg-slate-800 text-white p-3 rounded-xl border border-slate-700 shadow-md flex flex-col items-center min-w-[80px]">
                                    <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">Target k</span>
                                    <span className="font-mono text-xl font-black text-emerald-400">{st.k}</span>
                                </div>
                                <div className="bg-slate-800 text-white p-3 rounded-xl border border-slate-700 shadow-md flex flex-col items-center min-w-[80px]">
                                    <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">Total Count</span>
                                    <span className="font-mono text-xl font-black text-fuchsia-400">{st.count !== undefined ? st.count : 0}</span>
                                </div>
                                {selectedOpId === 'prefixHash' && st.currSum !== undefined && (
                                    <>
                                    <div className="bg-indigo-900 text-white p-3 rounded-xl border border-indigo-700 shadow-md flex flex-col items-center min-w-[80px]">
                                        <span className="text-[9px] uppercase tracking-widest font-bold text-indigo-300">currSum</span>
                                        <span className="font-mono text-xl font-black text-indigo-100">{st.currSum}</span>
                                    </div>
                                    {st.target !== undefined && (
                                        <div className="bg-amber-900 text-white p-3 rounded-xl border border-amber-700 shadow-md flex flex-col items-center min-w-[100px] animate-in slide-in-from-left-4">
                                            <span className="text-[9px] uppercase tracking-widest font-bold text-amber-300">Looking For</span>
                                            <div className="flex items-center gap-1 font-mono text-xs">
                                                <span>{st.currSum} - {st.k} =</span>
                                            </div>
                                            <span className="font-mono text-xl font-black text-amber-100">{st.target}</span>
                                        </div>
                                    )}
                                    </>
                                )}
                                {selectedOpId === 'bruteForce' && st.sum !== undefined && (
                                    <div className="bg-indigo-900 text-white p-3 rounded-xl border border-indigo-700 shadow-md flex flex-col items-center min-w-[80px]">
                                        <span className="text-[9px] uppercase tracking-widest font-bold text-indigo-300">Run Sum</span>
                                        <span className="font-mono text-xl font-black text-indigo-100">{st.sum}</span>
                                    </div>
                                )}
                           </div>

                           {/* Row 2: Input Array */}
                           <div className="flex flex-col items-center">
                               <div className="flex gap-3 p-4 border border-slate-200 bg-white/80 rounded-2xl shadow-sm backdrop-blur-sm min-w-max">
                                   {st.nums && st.nums.length === 0 && <span className="text-slate-400 italic">empty</span>}
                                   {(st.nums || []).map((val, idx) => {
                                       
                                       let isHl = false;
                                       let labels = [];

                                       if (selectedOpId === 'prefixHash') {
                                           isHl = st.hlIdx === idx;
                                           if (isHl) labels.push({ text: "i", color: "indigo", pos: "top" });
                                       } else {
                                           // Brute force subarray highlighting
                                           if (st.subarrayRange && idx >= st.subarrayRange[0] && idx <= st.subarrayRange[1]) {
                                               isHl = true;
                                           }
                                           if (st.hlI === idx) labels.push({ text: "i", color: "indigo", pos: "top" });
                                           if (st.hlJ === idx) labels.push({ text: "j", color: "fuchsia", pos: "bottom" });
                                       }

                                       return (
                                           <div key={`num-${idx}`} className="relative">
                                               <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                               <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                               
                                               <ArrayNodeBlock val={val} idx={idx} themeColor={isHl ? (st.matchFound && idx === (st.hlJ ?? st.hlIdx) ? 'emerald' : 'indigo') : 'slate'} isTarget={isHl} />
                                           </div>
                                       )
                                   })}
                               </div>
                           </div>

                           {/* Row 3: HashMap (Optimal Only) */}
                           {selectedOpId === 'prefixHash' && st.map && (
                               <div className="flex flex-col items-center mt-6 w-full max-w-md">
                                   <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest font-mono mb-2 flex items-center gap-1"><Database size={12}/> HashMap State</div>
                                   <div className="w-full bg-white border-2 border-amber-200 rounded-2xl shadow-lg overflow-hidden">
                                       <div className="grid grid-cols-2 bg-amber-50 text-[10px] font-black uppercase tracking-widest text-amber-800 border-b border-amber-200">
                                           <div className="p-2 text-center border-r border-amber-200">Key (Prefix Sum)</div>
                                           <div className="p-2 text-center">Value (Frequency)</div>
                                       </div>
                                       <div className="flex flex-col max-h-[160px] overflow-y-auto scrollbar-thin">
                                            {Array.from(st.map.entries()).sort((a,b)=>a[0]-b[0]).map(([key, freq]) => {
                                                const isJustAdded = st.justAddedKey === key;
                                                const isMatched = st.matchedKey === key;
                                                const isChecking = st.checkingMap === key;

                                                let rowClass = "border-b border-slate-100 last:border-0";
                                                let textClass = "text-slate-600";
                                                
                                                if (isMatched) { rowClass += " bg-emerald-100 border-emerald-300"; textClass = "text-emerald-800 font-bold"; }
                                                else if (isChecking) { rowClass += " bg-amber-100"; textClass = "text-amber-800 font-bold"; }
                                                else if (isJustAdded) { rowClass += " bg-indigo-50 animate-in slide-in-from-left-4"; textClass = "text-indigo-700 font-bold"; }

                                                return (
                                                    <div key={key} className={`grid grid-cols-2 font-mono text-sm transition-all duration-300 ${rowClass}`}>
                                                        <div className={`p-2 text-center border-r border-slate-100 ${textClass}`}>{key}</div>
                                                        <div className={`p-2 text-center ${textClass}`}>{freq}</div>
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
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Database size={120}/></div>
                        <h3 className="font-black text-indigo-400 text-lg uppercase tracking-widest mb-6">The Prefix Sum Insight</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>A "Prefix Sum" is the sum of all elements from index <code>0</code> up to index <code>i</code>.</p>
                            <p>Suppose the sum of elements from <code>0</code> to <code>j</code> is <code>currSum</code>. If we want a subarray ending at <code>j</code> to have a sum of <code>k</code>, there must exist some earlier index <code>i</code> where the sum from <code>0</code> to <code>i</code> is exactly <code>currSum - k</code>.</p>
                            <div className="bg-slate-800 p-4 rounded-xl font-mono text-center border border-slate-700 shadow-inner">
                                (Sum 0 to j) - (Sum 0 to i) = Sum (i+1 to j)<br/>
                                <span className="text-emerald-400">currSum - (currSum - k) = k</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-indigo-50 border border-indigo-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-indigo-700 text-lg uppercase tracking-widest mb-6">Why HashMap?</h3>
                        <div className="space-y-4 text-sm text-indigo-900/80 leading-relaxed font-medium">
                            <p>To find if <code>currSum - k</code> occurred previously, we could scan backward, but that takes $O(N)$ time per element (making it $O(N^2)$ total).</p>
                            <p>Instead, as we traverse, we store every <code>currSum</code> we calculate into a HashMap. The Key is the <code>currSum</code>, and the Value is the <strong>Frequency</strong> (how many times we've seen it).</p>
                            <p>Map lookups are $O(1)$. If <code>map.containsKey(currSum - k)</code> is true, we immediately know there is a valid subarray ending at our current index!</p>
                        </div>
                    </div>

                    <div className="p-8 md:col-span-2 rounded-3xl bg-amber-50 border border-amber-200 relative overflow-hidden shadow-inner flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-sm text-amber-900/80 leading-relaxed font-medium">
                            <h3 className="font-black text-amber-800 text-lg uppercase tracking-widest mb-4">The Crucial Base Case: map.put(0, 1)</h3>
                            <p>What if the subarray starting from index 0 exactly sums to <code>k</code>?</p>
                            <p>For example, <code>nums = [3], k = 3</code>. At index 0, <code>currSum = 3</code>. The target we look for is <code>currSum - k = 3 - 3 = 0</code>.</p>
                            <p>If our map is empty, we won't find 0! We must conceptually "seed" the map with the fact that a prefix sum of <code>0</code> has occurred exactly <code>1</code> time before the array even started. This handles all subarrays that begin at index 0 perfectly.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-indigo-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-indigo-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Navigating the "Two Pointers" Trap</h3>
                    <p className="text-sm text-indigo-50 leading-relaxed italic max-w-2xl font-mono">"This problem is notorious because candidates instantly jump to the 'Sliding Window' (Two Pointers) technique. You must prove to the interviewer why Sliding Window FAILS here before introducing the HashMap approach."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-indigo-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-indigo-800 text-sm uppercase tracking-widest">
                               <div className="bg-indigo-200 p-2 rounded-lg text-indigo-700"><XSquare size={16}/></div>
                               1. Destroy the Sliding Window
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-indigo-100 shadow-inner flex-1">
                                "Usually, for subarray sum problems, we use a Sliding Window. We expand the right pointer to increase sum, and shrink the left pointer to decrease sum. BUT, the constraints say nums[i] can be negative. Because adding a negative number decreases the sum, the window sum is NOT monotonic. We don't know whether to shrink or expand. Thus, Sliding Window cannot be used."
                            </p>
                        </div>

                        <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-indigo-800 text-sm uppercase tracking-widest">
                               <div className="bg-indigo-200 p-2 rounded-lg text-indigo-700"><ArrowRightLeft size={16}/></div>
                               2. Propose Brute Force
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-indigo-100 shadow-inner flex-1">
                                "Without a sliding window, the baseline is Brute Force. I can use two nested loops to check every contiguous subarray starting from i and ending at j. This guarantees correctness but takes O(N²) time, which will TLE for an array of size 20,000."
                            </p>
                        </div>

                        <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-indigo-800 text-sm uppercase tracking-widest">
                               <div className="bg-indigo-200 p-2 rounded-lg text-indigo-700"><Database size={16}/></div>
                               3. Introduce Prefix HashMap
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-indigo-100 shadow-inner flex-1">
                                "To optimize to O(N), I can use Prefix Sums. If I'm at index j with a running total of 'currSum', I just need to know if I've previously seen a prefix sum of 'currSum - k'. By storing the frequencies of all previous prefix sums in a HashMap, I can look this up in O(1) time."
                            </p>
                        </div>

                        <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-indigo-800 text-sm uppercase tracking-widest">
                               <div className="bg-indigo-200 p-2 rounded-lg text-indigo-700"><KeyRound size={16}/></div>
                               4. Explicitly state the Base Case
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-indigo-100 shadow-inner flex-1">
                                "The edge case is when a valid subarray starts at index 0. For this, 'currSum - k' will be 0. To ensure the map finds this, I must initialize the map with map.put(0, 1) before the loop begins. This represents the 'empty' prefix sum before index 0."
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
                          <div className="bg-indigo-500 p-2 rounded-lg text-white shadow-lg shadow-indigo-900/50"><Code2 size={20}/></div>
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
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.matchFound ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
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
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-64 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-indigo-600 pl-1">Input Array (nums)</label>
                              <input type="text" value={inputString} onChange={(e) => setInputString(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
                          </div>
                          <div className="w-24 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-emerald-600 pl-1">Target K</label>
                              <input type="number" value={inputK} onChange={(e) => setInputK(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner text-center font-black text-emerald-600" />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><RotateCcw size={24}/></button>
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
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className="px-12 py-6 bg-indigo-500 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(99,102,241,0.3)] hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-indigo-400 shadow-indigo-900/20">NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-500 flex flex-col p-16 pt-32 gap-16 items-center min-w-max h-full" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* --- Strict Flexbox Layout (Theater) --- */}

                           {/* Row 1: Running Variables */}
                           <div className="flex gap-8 mb-8 scale-110 origin-center">
                                <div className="bg-slate-800 text-white p-4 rounded-2xl border-2 border-slate-700 shadow-xl flex flex-col items-center min-w-[120px]">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Target k</span>
                                    <span className="font-mono text-3xl font-black text-emerald-400">{st.k}</span>
                                </div>
                                <div className="bg-slate-800 text-white p-4 rounded-2xl border-2 border-slate-700 shadow-xl flex flex-col items-center min-w-[120px]">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Total Count</span>
                                    <span className="font-mono text-3xl font-black text-fuchsia-400">{st.count !== undefined ? st.count : 0}</span>
                                </div>
                                {selectedOpId === 'prefixHash' && st.currSum !== undefined && (
                                    <>
                                    <div className="bg-indigo-900 text-white p-4 rounded-2xl border-2 border-indigo-700 shadow-xl flex flex-col items-center min-w-[120px]">
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-300 mb-1">currSum</span>
                                        <span className="font-mono text-3xl font-black text-indigo-100">{st.currSum}</span>
                                    </div>
                                    {st.target !== undefined && (
                                        <div className="bg-amber-900 text-white p-4 rounded-2xl border-2 border-amber-700 shadow-[0_10px_30px_rgba(245,158,11,0.3)] flex flex-col items-center min-w-[150px] animate-in slide-in-from-left-4">
                                            <span className="text-[10px] uppercase tracking-widest font-bold text-amber-300 mb-1">Looking For</span>
                                            <div className="flex items-center gap-1 font-mono text-sm opacity-80 mb-1">
                                                <span>{st.currSum} - {st.k} =</span>
                                            </div>
                                            <span className="font-mono text-4xl font-black text-amber-100">{st.target}</span>
                                        </div>
                                    )}
                                    </>
                                )}
                                {selectedOpId === 'bruteForce' && st.sum !== undefined && (
                                    <div className="bg-indigo-900 text-white p-4 rounded-2xl border-2 border-indigo-700 shadow-xl flex flex-col items-center min-w-[120px]">
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-300 mb-1">Run Sum</span>
                                        <span className="font-mono text-3xl font-black text-indigo-100">{st.sum}</span>
                                    </div>
                                )}
                           </div>

                           {/* Row 2: Input Array */}
                           <div className="flex flex-col items-center scale-125 origin-center">
                               <div className="flex gap-6 p-6 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-2xl backdrop-blur-md min-w-max">
                                   {st.nums && st.nums.length === 0 && <span className="text-slate-400 italic text-2xl px-10">empty</span>}
                                   {(st.nums || []).map((val, idx) => {
                                       
                                       let isHl = false;
                                       let labels = [];

                                       if (selectedOpId === 'prefixHash') {
                                           isHl = st.hlIdx === idx;
                                           if (isHl) labels.push({ text: "i", color: "indigo", pos: "top" });
                                       } else {
                                           // Brute force subarray highlighting
                                           if (st.subarrayRange && idx >= st.subarrayRange[0] && idx <= st.subarrayRange[1]) {
                                               isHl = true;
                                           }
                                           if (st.hlI === idx) labels.push({ text: "i", color: "indigo", pos: "top" });
                                           if (st.hlJ === idx) labels.push({ text: "j", color: "fuchsia", pos: "bottom" });
                                       }

                                       return (
                                           <div key={`num-fs-${idx}`} className="relative scale-110 mx-2">
                                               <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                               <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                               
                                               <ArrayNodeBlock val={val} idx={idx} themeColor={isHl ? (st.matchFound && idx === (st.hlJ ?? st.hlIdx) ? 'emerald' : 'indigo') : 'slate'} isTarget={isHl} />
                                           </div>
                                       )
                                   })}
                               </div>
                           </div>

                           {/* Row 3: HashMap (Optimal Only) */}
                           {selectedOpId === 'prefixHash' && st.map && (
                               <div className="flex flex-col items-center mt-12 w-full max-w-2xl scale-125 origin-center">
                                   <div className="text-xs font-black text-amber-600 uppercase tracking-widest font-mono mb-4 flex items-center gap-2 bg-amber-100 px-4 py-1.5 rounded-full"><Database size={16}/> HashMap State</div>
                                   <div className="w-full bg-white border-4 border-amber-200 rounded-[2rem] shadow-2xl overflow-hidden">
                                       <div className="grid grid-cols-2 bg-amber-50 text-xs font-black uppercase tracking-widest text-amber-800 border-b-2 border-amber-200">
                                           <div className="p-4 text-center border-r-2 border-amber-200">Key (Prefix Sum)</div>
                                           <div className="p-4 text-center">Value (Frequency)</div>
                                       </div>
                                       <div className="flex flex-col max-h-[300px] overflow-y-auto scrollbar-thin">
                                            {Array.from(st.map.entries()).sort((a,b)=>a[0]-b[0]).map(([key, freq]) => {
                                                const isJustAdded = st.justAddedKey === key;
                                                const isMatched = st.matchedKey === key;
                                                const isChecking = st.checkingMap === key;

                                                let rowClass = "border-b-2 border-slate-100 last:border-0";
                                                let textClass = "text-slate-600";
                                                
                                                if (isMatched) { rowClass += " bg-emerald-100 border-emerald-300"; textClass = "text-emerald-800 font-bold"; }
                                                else if (isChecking) { rowClass += " bg-amber-100"; textClass = "text-amber-800 font-bold"; }
                                                else if (isJustAdded) { rowClass += " bg-indigo-50 animate-in slide-in-from-left-4"; textClass = "text-indigo-700 font-bold"; }

                                                return (
                                                    <div key={`map-fs-${key}`} className={`grid grid-cols-2 font-mono text-xl transition-all duration-300 ${rowClass}`}>
                                                        <div className={`p-4 text-center border-r-2 border-slate-100 ${textClass}`}>{key}</div>
                                                        <div className={`p-4 text-center ${textClass}`}>{freq}</div>
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
                                    ALGORITHM COMPLETE
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