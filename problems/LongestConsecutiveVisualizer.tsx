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
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Target, Keyboard, Type, KeyRound, Box, Landmark, Calculator, Plus, Minus, History, Grid3x3, LayoutGrid, AlertOctagon, Repeat1, AlignLeft, XSquare, ArrowRightLeft, TrendingUp, SearchCode
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  hashSetOptimal: {
    id: 'hashSetOptimal',
    title: '1. HashSet Sequence (Optimal)',
    icon: <Database size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public int longestConsecutive(int[] nums) {
    Set<Integer> numSet = new HashSet<>();
    for (int num : nums) {
        numSet.add(num);
    }
    
    int longestStreak = 0;
    
    for (int num : numSet) {
        // Only check if it's the start of a sequence
        if (!numSet.contains(num - 1)) {
            int currentNum = num;
            int currentStreak = 1;
            
            // Incrementally find the rest of the sequence
            while (numSet.contains(currentNum + 1)) {
                currentNum += 1;
                currentStreak += 1;
            }
            
            longestStreak = Math.max(longestStreak, currentStreak);
        }
    }
    
    return longestStreak;
}`,
    desc: "The optimal O(N) approach. We load all elements into a HashSet for O(1) lookups. To prevent O(N²) time, we ONLY start a sequence check if the current number has no left-neighbor (i.e., !numSet.contains(num - 1)). This guarantees each number is visited at most twice across the entire algorithm."
  },
  sortingApproach: {
    id: 'sortingApproach',
    title: '2. Sorting (Alternative)',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N log N) | Space: O(1) or O(N)',
    code: `public int longestConsecutive(int[] nums) {
    if (nums.length == 0) return 0;
    
    Arrays.sort(nums);
    
    int longestStreak = 1;
    int currentStreak = 1;
    
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] != nums[i-1]) {
            if (nums[i] == nums[i-1] + 1) {
                currentStreak += 1;
            } else {
                longestStreak = Math.max(longestStreak, currentStreak);
                currentStreak = 1;
            }
        }
    }
    
    return Math.max(longestStreak, currentStreak);
}`,
    desc: "A highly intuitive alternative. We sort the array first. Then, we simply iterate through the array once, incrementing our streak if the current element is exactly 1 greater than the previous element. We must remember to ignore duplicates. It fails the strict O(N) constraint due to the O(N log N) sort."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|return|if|else|for|while|continue|new|length|Set|HashSet|Integer|add|contains|Math|max|Arrays|sort)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-teal-500/20`, border: `border-teal-400`, text: `text-teal-300` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-teal-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'return', 'if', 'else', 'for', 'while', 'continue', 'new'].includes(part);
            const isObject = ['Set', 'HashSet', 'Integer', 'Math', 'Arrays'].includes(part);
            const isVar = ['nums', 'numSet', 'num', 'longestStreak', 'currentStreak', 'currentNum', 'i'].includes(part);
            const isMapCall = ['length', 'add', 'contains', 'max', 'sort'].includes(part);

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-sky-400 font-bold';
            else if (isVar) className = 'text-teal-200';
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
        teal: 'bg-teal-100 text-teal-700 border-teal-300',
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
  idx?: number;
  themeColor?: string;
  isTarget?: boolean;
  shape?: 'square' | 'pill';
}

const ArrayNodeBlock: React.FC<ArrayNodeBlockProps> = ({ val, idx, themeColor = 'slate', isTarget, shape = 'square' }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', index: 'bg-emerald-100 text-emerald-600' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', index: 'bg-sky-100 text-sky-600' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', index: 'bg-rose-100 text-rose-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        teal: { bg: 'bg-teal-50', border: 'border-teal-400', text: 'text-teal-800', index: 'bg-teal-100 text-teal-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' }
    };
    
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;

    const displayVal = val === null ? '_' : String(val);
    const rounding = shape === 'pill' ? 'rounded-full px-4 min-w-[64px]' : 'rounded-xl w-16';
    const height = shape === 'pill' ? 'h-14' : 'h-20';

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center justify-center border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} ${rounding} ${height} relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-2xl bg-white/60 ${activeTheme.text}`}>
                    {displayVal}
                </div>
                {idx !== undefined && shape === 'square' && (
                    <div className={`flex w-full h-6 border-t border-black/10 ${activeTheme.index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className="text-[10px] font-black tracking-widest uppercase">Idx {idx}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Application ---

export default function LongestConsecutiveVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('hashSetOptimal');
  
  const [inputString, setInputString] = useState('100, 4, 200, 1, 3, 2');
  
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

    if (selectedOpId === 'hashSetOptimal') {
        let set = new Set();
        let longestStreak = 0;
        
        add("Initialize HashSet", `Initialize an empty HashSet.`, 2, { set: Array.from(set), longestStreak });
        
        for (let i = 0; i < n; i++) {
            set.add(nums[i]);
            add("Build Set", `Add nums[${i}] (${nums[i]}) to HashSet.`, 4, { hlNums: [i], set: Array.from(set), justAddedSet: nums[i], longestStreak });
        }

        add("Init Variables", `Set longestStreak = 0. Begin iterating through the Set.`, 7, { set: Array.from(set), longestStreak });

        // Iterate array for visual consistency (logic works same as iterating set)
        for (let i = 0; i < n; i++) {
            let num = nums[i];
            let checkStart = num - 1;
            
            add("Evaluate Element", `Checking element ${num} from Set.`, 9, { hlSetNum: num, num, set: Array.from(set), longestStreak });
            
            add("Check Sequence Start", `if (!numSet.contains(${checkStart})) -> Is ${num} the start of a sequence?`, 11, { hlSetNum: num, num, set: Array.from(set), checkingStart: checkStart, longestStreak });

            if (!set.has(checkStart)) {
                let currentNum = num;
                let currentStreak = 1;
                
                add("Start Confirmed", `${checkStart} is NOT in the set! ${num} is a sequence starter. Set currentStreak = 1.`, 13, { hlSetNum: currentNum, num, currentNum, currentStreak, set: Array.from(set), longestStreak });

                while (true) {
                    add("Check Next in Sequence", `while(numSet.contains(${currentNum + 1})) -> Does the sequence continue?`, 16, { hlSetNum: currentNum, num, currentNum, currentStreak, set: Array.from(set), checkingNext: currentNum + 1, longestStreak });
                    
                    if (set.has(currentNum + 1)) {
                        currentNum += 1;
                        currentStreak += 1;
                        add("Sequence Continues", `Found ${currentNum}! Increment currentStreak to ${currentStreak}.`, 18, { hlSetNum: currentNum, num, currentNum, currentStreak, set: Array.from(set), longestStreak });
                    } else {
                        add("Sequence Ends", `${currentNum + 1} is NOT in the set. The sequence ends here.`, 16, { hlSetNum: currentNum, num, currentNum, currentStreak, set: Array.from(set), longestStreak, failNext: currentNum + 1 });
                        break;
                    }
                }
                
                let oldLongest = longestStreak;
                longestStreak = Math.max(longestStreak, currentStreak);
                add("Update Longest Streak", `longestStreak = max(${oldLongest}, ${currentStreak}) = ${longestStreak}.`, 21, { num, set: Array.from(set), longestStreak, currentStreak, updatedLongest: true });
                
            } else {
                add("Not a Sequence Start", `${checkStart} IS in the set! ${num} is just a middle element of some sequence. Skip it to save time!`, 11, { hlSetNum: num, num, set: Array.from(set), longestStreak, isFailStart: true });
            }
        }
        
        add("Return Result", `All elements evaluated. The longest consecutive sequence is ${longestStreak}.`, 25, { set: Array.from(set), longestStreak, isSuccess: true });

    } else if (selectedOpId === 'sortingApproach') {
        
        add("Base Check", `if (nums.length == 0) return 0; length is ${n}. Proceed.`, 2, {});
        
        let sortedNums = [...nums].sort((a,b)=>a-b);
        add("Sort Array", `Arrays.sort(nums); Array is now sorted in ascending order.`, 4, { sortedNums: [...sortedNums] });
        
        let longestStreak = 1;
        let currentStreak = 1;
        
        add("Initialize Variables", `longestStreak = 1, currentStreak = 1.`, 7, { sortedNums: [...sortedNums], longestStreak, currentStreak });

        for (let i = 1; i < n; i++) {
            add("Loop Element", `Compare nums[${i}] (${sortedNums[i]}) with nums[${i-1}] (${sortedNums[i-1]}).`, 9, { i, sortedNums: [...sortedNums], longestStreak, currentStreak, hlSort: [i, i-1] });
            
            add("Check Duplicate", `if (${sortedNums[i]} != ${sortedNums[i-1]}) -> Skip if duplicate.`, 10, { i, sortedNums: [...sortedNums], longestStreak, currentStreak, hlSort: [i, i-1] });
            
            if (sortedNums[i] !== sortedNums[i-1]) {
                add("Check Consecutive", `if (${sortedNums[i]} == ${sortedNums[i-1]} + 1) -> Is it exactly 1 greater?`, 11, { i, sortedNums: [...sortedNums], longestStreak, currentStreak, hlSort: [i, i-1] });
                
                if (sortedNums[i] === sortedNums[i-1] + 1) {
                    currentStreak += 1;
                    add("Streak Continues", `Yes! Increment currentStreak to ${currentStreak}.`, 12, { i, sortedNums: [...sortedNums], longestStreak, currentStreak, hlSort: [i] });
                } else {
                    let oldLongest = longestStreak;
                    longestStreak = Math.max(longestStreak, currentStreak);
                    currentStreak = 1;
                    add("Streak Broken", `No. Sequence broken. Update longestStreak = max(${oldLongest}, ${currentStreak}) = ${longestStreak}. Reset currentStreak = 1.`, 15, { i, sortedNums: [...sortedNums], longestStreak, currentStreak, hlSort: [i], updatedLongest: true });
                }
            } else {
                add("Duplicate Found", `Numbers are identical. Ignore and continue.`, 10, { i, sortedNums: [...sortedNums], longestStreak, currentStreak, hlSort: [i] });
            }
        }

        longestStreak = Math.max(longestStreak, currentStreak);
        add("Final Return", `Final check and return max(${longestStreak}, ${currentStreak}) = ${longestStreak}.`, 21, { sortedNums: [...sortedNums], longestStreak, currentStreak, isSuccess: true });
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
            <div className="bg-teal-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <TrendingUp className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Longest Consecutive Sequence</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                      LC 128 • Arrays & Hashing
                  </span>
                  <span>•</span>
                  <span>O(N) Time Constraint</span>
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
                <div className="flex items-center gap-3 text-teal-600 font-black text-2xl uppercase tracking-tighter"><AlignLeft size={28}/> Problem Statement</div>
                
                <p className="text-base leading-relaxed">
                  Given an unsorted array of integers <code>nums</code>, return the length of the longest consecutive elements sequence.<br/><br/>
                  You must write an algorithm that runs in <code>O(n)</code> time.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-teal-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-teal-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> nums = [100, 4, 200, 1, 3, 2]</div>
                        <div><span className="text-amber-400 font-bold">Output:</span> 4</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> nums = [0,3,7,2,5,8,4,6,0,1]</div>
                        <div><span className="text-amber-400 font-bold">Output:</span> 9</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: The longest sequence is [0, 1, 2, 3, 4, 5, 6, 7, 8].</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Traps</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-1">
                        <li>0 &lt;= nums.length &lt;= 10<sup>5</sup></li>
                        <li>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></li>
                        <li className="italic text-slate-500 mt-2">Crucial Trap: Sorting takes O(N log N) time, which violates the primary constraint of the problem! You must use Hash structures to achieve O(N).</li>
                    </ul>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-teal-600 text-white border-teal-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-teal-200' : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[440px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-amber-400" /> : <Copy size={14} />}</button>
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
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-teal-600 pl-1 flex justify-between">
                                <span>Input Array (nums)</span>
                            </label>
                            <input 
                                type="text"
                                value={inputString} 
                                onChange={(e) => setInputString(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all shadow-inner" 
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center w-full xl:w-auto mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep} className={`px-6 py-3 bg-teal-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-teal-200 hover:bg-teal-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-6 shadow-xl border transition-all duration-300 min-h-[130px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={80} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-2 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-amber-400 flex items-center gap-3"><PartyPopper size={20}/> Evaluation Complete</div>
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
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Layout size={14} className="text-teal-500"/> Variable State</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className="p-1.5 text-slate-600 hover:text-teal-600 rounded-lg transition-colors"><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className="p-1.5 text-slate-600 hover:text-teal-600 rounded-lg transition-colors"><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className="p-1.5 text-slate-600 hover:text-teal-600 rounded-lg transition-colors"><Maximize size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-16 pb-16 gap-10 items-center" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* --- Strict Flexbox Layout (No Overlaps) --- */}

                           {/* Row 1: Running Variables */}
                           <div className="flex gap-4 mb-4">
                                <div className="bg-slate-800 text-white p-3 rounded-xl border border-slate-700 shadow-md flex flex-col items-center min-w-[100px]">
                                    <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">longestStreak</span>
                                    <span className={`font-mono text-xl font-black transition-colors ${st.updatedLongest ? 'text-emerald-400' : 'text-white'}`}>{st.longestStreak !== undefined ? st.longestStreak : 0}</span>
                                </div>
                                {(st.currentStreak !== undefined) && (
                                    <div className="bg-amber-900 text-white p-3 rounded-xl border border-amber-700 shadow-md flex flex-col items-center min-w-[100px]">
                                        <span className="text-[9px] uppercase tracking-widest font-bold text-amber-300">currentStreak</span>
                                        <span className="font-mono text-xl font-black text-amber-100">{st.currentStreak}</span>
                                    </div>
                                )}
                           </div>

                           {/* Row 2: Input Array (or Sorted Array) */}
                           <div className="flex flex-col items-center">
                               <div className="flex gap-3 p-4 border border-slate-200 bg-white/80 rounded-2xl shadow-sm backdrop-blur-sm min-w-max flex-wrap justify-center">
                                   {(st.sortedNums || st.nums || []).length === 0 && <span className="text-slate-400 italic">empty</span>}
                                   {(st.sortedNums || st.nums || []).map((val, idx) => {
                                       
                                       let isHl = false;
                                       let labels = [];

                                       if (selectedOpId === 'hashSetOptimal') {
                                            isHl = st.hlNums && st.hlNums.includes(idx);
                                       } else {
                                            isHl = st.hlSort && st.hlSort.includes(idx);
                                            if (st.i === idx) labels.push({ text: "i", color: "teal", pos: "top" });
                                            if (st.i - 1 === idx) labels.push({ text: "i-1", color: "slate", pos: "bottom" });
                                       }

                                       return (
                                           <div key={`num-${idx}`} className="relative">
                                               <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                               <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                               
                                               <ArrayNodeBlock val={val} idx={selectedOpId === 'sortingApproach' ? idx : undefined} themeColor={isHl ? 'teal' : 'slate'} isTarget={isHl} />
                                           </div>
                                       )
                                   })}
                               </div>
                           </div>

                           {/* Row 3: HashSet (Optimal Only) */}
                           {selectedOpId === 'hashSetOptimal' && st.set && (
                               <div className="flex flex-col items-center mt-6 w-full">
                                   <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest font-mono mb-3 flex items-center gap-1"><Database size={12}/> HashSet Memory</div>
                                   <div className="flex flex-wrap gap-4 p-6 bg-slate-800 border-2 border-slate-700 rounded-3xl shadow-xl justify-center items-center min-w-[300px]">
                                        {st.set.length === 0 && <span className="text-slate-500 font-mono italic">Set is empty</span>}
                                        {st.set.map((val, idx) => {
                                            const isJustAdded = st.justAddedSet === val;
                                            const isHl = st.hlSetNum === val;
                                            const isCheckingStart = st.checkingStart === val;
                                            const isCheckingNext = st.checkingNext === val;
                                            const isFailNext = st.failNext === val; // Used if we wanted to show a missing element, but we only render existing

                                            let color = 'slate';
                                            if (isHl) color = 'amber';
                                            else if (isJustAdded) color = 'emerald';
                                            else if (isCheckingStart || isCheckingNext) color = 'teal'; // active probing

                                            let labels = [];
                                            if (isCheckingStart) labels.push({ text: "num-1", color: "rose", pos: "top" });
                                            if (isCheckingNext) labels.push({ text: "curr+1", color: "teal", pos: "top" });
                                            if (st.isFailStart && st.num === val) labels.push({ text: "skip", color: "rose", pos: "bottom" });

                                            return (
                                                <div key={`set-${idx}`} className="relative">
                                                     <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                                     <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                                     <ArrayNodeBlock val={val} themeColor={color} isTarget={isHl || isCheckingStart || isCheckingNext} shape="pill" />
                                                </div>
                                            )
                                        })}
                                        {/* Fake ghost nodes to show failed checks if applicable */}
                                        {st.checkingStart !== undefined && !st.set.includes(st.checkingStart) && (
                                            <div className="relative opacity-50 grayscale border-dashed">
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center"><PointerLabel label="num-1" color="rose" position="top" /></div>
                                                <ArrayNodeBlock val={st.checkingStart} themeColor="rose" isTarget={false} shape="pill" />
                                            </div>
                                        )}
                                        {st.failNext !== undefined && !st.set.includes(st.failNext) && (
                                            <div className="relative opacity-50 grayscale border-dashed">
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center"><PointerLabel label="curr+1" color="rose" position="top" /></div>
                                                <ArrayNodeBlock val={st.failNext} themeColor="rose" isTarget={false} shape="pill" />
                                            </div>
                                        )}
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
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><SearchCode size={120}/></div>
                        <h3 className="font-black text-teal-400 text-lg uppercase tracking-widest mb-6">The Intelligent Start Check</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>The core logic of the O(N) solution rests on exactly one line of code: <code>if (!numSet.contains(num - 1))</code>.</p>
                            <p>Imagine the sequence <code>[1, 2, 3, 4]</code> is in our set. If we pick <code>3</code> randomly from the set, should we start counting upwards? No! Because <code>2</code> is in the set, we know <code>3</code> is just the middle of a sequence.</p>
                            <p>We ONLY start counting when we land on <code>1</code> (because <code>0</code> is not in the set). This ensures we only trace sequences from their absolute beginning.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-teal-50 border border-teal-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-teal-700 text-lg uppercase tracking-widest mb-6">Defending the O(N) Time</h3>
                        <div className="space-y-4 text-sm text-teal-900/80 leading-relaxed font-medium">
                            <p>It's a common misconception that a <code>while</code> loop nested inside a <code>for</code> loop automatically results in $O(N^2)$ time complexity.</p>
                            <p>Because of our "Intelligent Start Check", the <code>while</code> loop ONLY runs for the very first element of a sequence. It increments up through the sequence and stops.</p>
                            <p>This means across the ENTIRE algorithm, the while loop will visit each number exactly once. The outer loop also visits each number exactly once. $N + N = 2N$, which simplifies mathematically to strict $O(N)$ Time.</p>
                        </div>
                    </div>

                    <div className="p-8 md:col-span-2 rounded-3xl bg-amber-50 border border-amber-200 relative overflow-hidden shadow-inner flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-sm text-amber-900/80 leading-relaxed font-medium">
                            <h3 className="font-black text-amber-800 text-lg uppercase tracking-widest mb-4">Sorting Alternative (O(N log N))</h3>
                            <p>If you blank out in an interview and forget the HashSet trick, immediately pivot to Sorting.</p>
                            <p>By sorting the array, all consecutive numbers will physically sit next to each other. You just iterate once, tracking a running streak. If <code>nums[i] == nums[i-1] + 1</code>, the streak goes up. If they break, save the max streak and reset to 1.</p>
                            <p>Just remember to explicitly handle duplicate numbers (<code>nums[i] == nums[i-1]</code>)!</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-teal-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-teal-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Crushing The Complexity Trap</h3>
                    <p className="text-sm text-teal-50 leading-relaxed italic max-w-2xl font-mono">"This is arguably one of the best questions to show off your understanding of Big O analysis. You must proactively explain why the nested loop is not O(N²) without the interviewer having to ask you."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-teal-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-teal-50/50 border border-teal-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-teal-800 text-sm uppercase tracking-widest">
                               <div className="bg-teal-200 p-2 rounded-lg text-teal-700"><ListOrdered size={16}/></div>
                               1. State the Baseline
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-teal-100 shadow-inner flex-1">
                                "The immediate brute force way to find sequences is to sort the array first. Sorting takes O(N log N) time, and then we can linearly scan to find the longest streak. However, the problem explicitly demands an O(N) solution."
                            </p>
                        </div>

                        <div className="bg-teal-50/50 border border-teal-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-teal-800 text-sm uppercase tracking-widest">
                               <div className="bg-teal-200 p-2 rounded-lg text-teal-700"><Database size={16}/></div>
                               2. Introduce the Space Tradeoff
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-teal-100 shadow-inner flex-1">
                                "To drop the time complexity from O(N log N) to O(N), I need to trade space for time. I can load all the numbers into a HashSet, which allows me to check if neighboring consecutive numbers exist in O(1) time."
                            </p>
                        </div>

                        <div className="bg-teal-50/50 border border-teal-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-teal-800 text-sm uppercase tracking-widest">
                               <div className="bg-teal-200 p-2 rounded-lg text-teal-700"><SearchCode size={16}/></div>
                               3. Explain the Optimization
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-teal-100 shadow-inner flex-1">
                                "If I just iterate through the set and check forwards, I'd still be doing redundant work for numbers in the middle of a sequence. To prevent this, I will ONLY initiate a sequence check if the current number is the absolute start of a sequence. I know it's a start if 'set.contains(num - 1)' is false."
                            </p>
                        </div>

                        <div className="bg-teal-50/50 border border-teal-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-teal-800 text-sm uppercase tracking-widest">
                               <div className="bg-teal-200 p-2 rounded-lg text-teal-700"><ShieldAlert size={16}/></div>
                               4. Defend the Big O Proactively
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-teal-100 shadow-inner flex-1">
                                "Because of this specific check, my inner while loop only executes from the bottom of a sequence. This guarantees that across the entire run of the algorithm, the inner loop will only ever process each valid number exactly once. Therefore, despite the nesting, the time complexity is strictly O(N)."
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
                          <div className="bg-teal-500 p-2 rounded-lg text-white shadow-lg shadow-teal-900/50"><Code2 size={20}/></div>
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
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-amber-900/40 border-amber-800' : st.isFailStart ? 'bg-rose-900/40 border-rose-800' : 'bg-slate-800/40 border-slate-700'}`}>
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
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? 'bg-teal-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-64 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-teal-600 pl-1">Input Array (nums)</label>
                              <input type="text" value={inputString} onChange={(e) => setInputString(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-teal-500 outline-none transition-all shadow-inner" />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-teal-600 rounded-xl hover:bg-teal-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-teal-600 rounded-xl hover:bg-teal-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className="p-3 text-slate-600 hover:text-teal-600 rounded-xl hover:bg-teal-50 transition-all"><RotateCcw size={24}/></button>
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
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className="px-12 py-6 bg-teal-500 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(20,184,166,0.3)] hover:bg-teal-600 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-teal-400 shadow-teal-900/20">NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-500 flex flex-col p-16 pt-32 gap-16 items-center min-w-max h-full" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* --- Strict Flexbox Layout (Theater) --- */}

                           {/* Row 1: Running Variables */}
                           <div className="flex gap-8 mb-8 scale-110 origin-center">
                                <div className="bg-slate-800 text-white p-4 rounded-2xl border-2 border-slate-700 shadow-xl flex flex-col items-center min-w-[150px]">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">longestStreak</span>
                                    <span className={`font-mono text-4xl font-black transition-colors ${st.updatedLongest ? 'text-emerald-400' : 'text-white'}`}>{st.longestStreak !== undefined ? st.longestStreak : 0}</span>
                                </div>
                                {(st.currentStreak !== undefined) && (
                                    <div className="bg-amber-900 text-white p-4 rounded-2xl border-2 border-amber-700 shadow-xl flex flex-col items-center min-w-[150px]">
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-amber-300 mb-1">currentStreak</span>
                                        <span className="font-mono text-4xl font-black text-amber-100">{st.currentStreak}</span>
                                    </div>
                                )}
                           </div>

                           {/* Row 2: Input Array */}
                           <div className="flex flex-col items-center scale-125 origin-center">
                               <div className="flex gap-6 p-6 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-2xl backdrop-blur-md min-w-max flex-wrap justify-center max-w-4xl">
                                   {(st.sortedNums || st.nums || []).length === 0 && <span className="text-slate-400 italic text-2xl px-10">empty</span>}
                                   {(st.sortedNums || st.nums || []).map((val, idx) => {
                                       
                                       let isHl = false;
                                       let labels = [];

                                       if (selectedOpId === 'hashSetOptimal') {
                                            isHl = st.hlNums && st.hlNums.includes(idx);
                                       } else {
                                            isHl = st.hlSort && st.hlSort.includes(idx);
                                            if (st.i === idx) labels.push({ text: "i", color: "teal", pos: "top" });
                                            if (st.i - 1 === idx) labels.push({ text: "i-1", color: "slate", pos: "bottom" });
                                       }

                                       return (
                                           <div key={`num-fs-${idx}`} className="relative scale-110 mx-2 mb-4 mt-4">
                                               <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                               <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                               
                                               <ArrayNodeBlock val={val} idx={selectedOpId === 'sortingApproach' ? idx : undefined} themeColor={isHl ? 'teal' : 'slate'} isTarget={isHl} />
                                           </div>
                                       )
                                   })}
                               </div>
                           </div>

                           {/* Row 3: HashSet (Optimal Only) */}
                           {selectedOpId === 'hashSetOptimal' && st.set && (
                               <div className="flex flex-col items-center mt-12 w-full max-w-4xl scale-125 origin-center">
                                   <div className="text-xs font-black text-amber-600 uppercase tracking-widest font-mono mb-4 flex items-center gap-2 bg-amber-100 px-4 py-1.5 rounded-full"><Database size={16}/> HashSet Memory</div>
                                   <div className="flex flex-wrap gap-8 p-10 bg-slate-800 border-4 border-slate-700 rounded-[3rem] shadow-2xl justify-center items-center min-w-[500px]">
                                        {st.set.length === 0 && <span className="text-slate-500 font-mono italic text-2xl">Set is empty</span>}
                                        {st.set.map((val, idx) => {
                                            const isJustAdded = st.justAddedSet === val;
                                            const isHl = st.hlSetNum === val;
                                            const isCheckingStart = st.checkingStart === val;
                                            const isCheckingNext = st.checkingNext === val;
                                            const isFailNext = st.failNext === val;

                                            let color = 'slate';
                                            if (isHl) color = 'amber';
                                            else if (isJustAdded) color = 'emerald';
                                            else if (isCheckingStart || isCheckingNext) color = 'teal'; 

                                            let labels = [];
                                            if (isCheckingStart) labels.push({ text: "num-1", color: "rose", pos: "top" });
                                            if (isCheckingNext) labels.push({ text: "curr+1", color: "teal", pos: "top" });
                                            if (st.isFailStart && st.num === val) labels.push({ text: "skip", color: "rose", pos: "bottom" });

                                            return (
                                                <div key={`set-fs-${idx}`} className="relative scale-110 mx-2">
                                                     <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                                     <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                                     <ArrayNodeBlock val={val} themeColor={color} isTarget={isHl || isCheckingStart || isCheckingNext} shape="pill" />
                                                </div>
                                            )
                                        })}
                                        {/* Fake ghost nodes to show failed checks */}
                                        {st.checkingStart !== undefined && !st.set.includes(st.checkingStart) && (
                                            <div className="relative opacity-50 grayscale border-dashed scale-110 mx-2">
                                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center"><PointerLabel label="num-1" color="rose" position="top" /></div>
                                                <ArrayNodeBlock val={st.checkingStart} themeColor="rose" isTarget={false} shape="pill" />
                                            </div>
                                        )}
                                        {st.failNext !== undefined && !st.set.includes(st.failNext) && (
                                            <div className="relative opacity-50 grayscale border-dashed scale-110 mx-2">
                                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center"><PointerLabel label="curr+1" color="rose" position="top" /></div>
                                                <ArrayNodeBlock val={st.failNext} themeColor="rose" isTarget={false} shape="pill" />
                                            </div>
                                        )}
                                   </div>
                               </div>
                           )}

                      </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-amber-500 shadow-amber-500/30`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-amber-500`}></div>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 bg-amber-500/20 text-amber-500 ring-amber-500/10`}>
                                    <PartyPopper size={48}/>
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    ALGORITHM COMPLETE
                                </h2>
                                <p className={`font-mono text-sm uppercase mb-8 tracking-widest text-amber-400`}>
                                    {String(curStepData.description)}
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-amber-600 hover:bg-amber-700 shadow-amber-900/20`}>
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