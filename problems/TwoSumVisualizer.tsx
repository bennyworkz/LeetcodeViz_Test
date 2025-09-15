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
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Target, Keyboard
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  onePassHash: {
    id: 'onePassHash',
    title: 'One-Pass Hash Table (Optimal)',
    icon: <Database size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();

    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];

        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }

        map.put(nums[i], i);
    }

    return null; // No solution found
}`,
    desc: "The optimal approach. We iterate through the array once. For each element, we calculate its required 'complement' (target - current). If the complement is already in our Hash Map, we found our pair! Otherwise, we store the current element and its index in the map."
  },
  bruteForce: {
    id: 'bruteForce',
    title: 'Brute Force',
    icon: <Search size={16} />,
    complexity: 'Time: O(N²) | Space: O(1)',
    code: `public int[] twoSum(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] == target) {
                return new int[] { i, j };
            }
        }
    }
    
    return null; // No solution found
}`,
    desc: "The naive approach. We use two nested loops to check every possible pair of numbers in the array. While it saves space (O(1)), it is extremely slow for large arrays due to the quadratic time complexity."
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
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|int|return|if|else|for|while|new|HashMap|Map|Integer|map|put|get|containsKey|nums|length|target|complement)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-indigo-500/20`, border: `border-indigo-500`, text: `text-indigo-400` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-indigo-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'int', 'return', 'if', 'else', 'for', 'while', 'new'].includes(part);
            const isObject = ['HashMap', 'Map', 'Integer'].includes(part);
            const isVar = ['nums', 'target', 'complement', 'map', 'length', 'i', 'j'].includes(part);
            const isMapCall = ['put', 'get', 'containsKey'].includes(part);
            return (
              <span 
                key={i} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-sky-400 font-bold' : 
                  isVar ? 'text-indigo-300' : 
                  isMapCall ? 'text-amber-400' :
                  isNaN(parseInt(part)) && part.trim() !== '<' && part.trim() !== '>' ? '' : 'text-emerald-400'
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
        indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300',
        rose: 'bg-rose-100 text-rose-700 border-rose-300',
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

interface ArrayNodeBlockProps {
  val: number;
  idx: number;
  themeColor?: string;
  isTarget?: boolean;
}

const ArrayNodeBlock: React.FC<ArrayNodeBlockProps> = ({ val, idx, themeColor = 'slate', isTarget }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700' }
    };
    
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-300`}>
            <div className={`flex flex-col items-center w-16 h-16 border-2 rounded-xl transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-xl bg-white/50 ${activeTheme.text}`}>
                    {String(val)}
                </div>
                <div className="flex w-full h-5 border-t border-black/10">
                    <div className="flex-1 flex items-center justify-center bg-slate-100">
                         <span className="text-[9px] font-black tracking-widest text-slate-400">{idx}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Application ---

export default function TwoSumVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('onePassHash');
  
  const [inputArray, setInputArray] = useState('2, 7, 11, 15');
  const [inputTarget, setInputTarget] = useState('9');
  
  const [baseArray, setBaseArray] = useState([]);
  const [targetVal, setTargetVal] = useState(9);
  
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

  const parseInput = (arrStr, tarStr) => {
      const parsedArr = arrStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      const parsedTar = parseInt(tarStr);
      return {
          arr: parsedArr,
          tar: isNaN(parsedTar) ? 0 : parsedTar
      };
  };

  useEffect(() => {
    const { arr, tar } = parseInput(inputArray, inputTarget);
    setBaseArray(arr);
    setTargetVal(tar);
    setCurrentStep(0);
    setPan({ x: 100, y: 150 });
  }, [inputArray, inputTarget, selectedOpId]);

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
    if (baseArray.length === 0) return [{ phase: 'Init', description: 'Enter array values.', line: 0, state: { arr: [] } }];
    
    let arr = [...baseArray];
    let target = targetVal;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            arr: [...arr],
            target,
            ...st 
        } 
    });

    if (selectedOpId === 'onePassHash') {
        let hashMap = new Map();
        
        add("Initialize", "Create an empty Hash Map to store (Value -> Index).", 2, { map: new Map(hashMap) });

        let found = false;
        for (let i = 0; i < arr.length; i++) {
            add("Loop Start", `Examine nums[${i}] = ${arr[i]}.`, 4, { i, map: new Map(hashMap) });

            let complement = target - arr[i];
            add("Calculate Complement", `complement = ${target} - ${arr[i]} = ${complement}. We need ${complement} to reach the target.`, 5, { i, complement, map: new Map(hashMap) });

            add("Check Hash Map", `Does map contain key ${complement}?`, 7, { i, complement, map: new Map(hashMap), checkingMap: complement });

            if (hashMap.has(complement)) {
                let j = hashMap.get(complement);
                add("Solution Found!", `Found ${complement} in the map at index ${j}! The pair is [${j}, ${i}].`, 8, { i, complement, map: new Map(hashMap), successPair: [j, i], isSuccess: true });
                found = true;
                break;
            } else {
                add("Not Found", `${complement} is not in the map yet.`, 10, { i, complement, map: new Map(hashMap) });
                
                hashMap.set(arr[i], i);
                add("Store in Map", `Add nums[${i}] to map: map.put(${arr[i]}, ${i}).`, 11, { i, complement, map: new Map(hashMap), justAdded: arr[i] });
            }
        }

        if (!found) {
            add("Complete", "Iterated through entire array. No pair sums up to the target.", 14, { map: new Map(hashMap), notFound: true });
        }

    } else if (selectedOpId === 'bruteForce') {
        let found = false;
        
        add("Initialize", "Starting outer loop.", 2, { i: null, j: null });

        outerLoop:
        for (let i = 0; i < arr.length; i++) {
            add("Outer Loop", `Set i = ${i}, nums[${i}] = ${arr[i]}.`, 2, { i, j: null });
            
            for (let j = i + 1; j < arr.length; j++) {
                add("Inner Loop", `Set j = ${j}, nums[${j}] = ${arr[j]}.`, 3, { i, j });
                
                let sum = arr[i] + arr[j];
                add("Check Sum", `Is ${arr[i]} + ${arr[j]} == ${target}? (Sum is ${sum})`, 4, { i, j, sum });

                if (sum === target) {
                    add("Solution Found!", `Found pair: nums[${i}] + nums[${j}] = ${target}. Return [${i}, ${j}].`, 5, { i, j, successPair: [i, j], isSuccess: true });
                    found = true;
                    break outerLoop;
                }
            }
        }

        if (!found) {
            add("Complete", "Checked all possible pairs. No solution found.", 10, { notFound: true });
        }
    }

    return steps;
  }, [baseArray, targetVal, selectedOpId]);

  // Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if user is currently typing in an input field
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

  // Calculate coordinates for nodes
  const startX = 60;
  const startY = 80;

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <Target className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Two Sum</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      Array & Hashing
                  </span>
                  <span>•</span>
                  <span>O(N) Time Optimization</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-indigo-600 font-black text-2xl uppercase tracking-tighter"><Target size={28}/> Finding the Pair</div>
                    <p className="text-lg leading-relaxed max-w-3xl">
                      Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>. You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.
                    </p>
                    <div className="bg-slate-900 border-l-4 border-indigo-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white space-y-2 overflow-x-auto whitespace-nowrap">
                       <div><span className="text-indigo-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Input Array</span>
                       nums = [2, 7, 11, 15]</div>
                       <div><span className="text-emerald-400 block mb-1 uppercase text-[10px] font-black tracking-widest mt-2">Target Sum</span>
                       target = 9</div>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> The Goal</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Find `i` and `j` where `nums[i] + nums[j] == target`. The brute force way checks every combination, taking $O(N^2)$ time. Can we do better?</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Zap size={16} className="text-amber-500"/> The Trick</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Instead of looking for a second number that sums to target, we calculate what number we <em>need</em> (the complement) and ask: "Have we seen this number before?". A Hash Map answers this in $O(1)$ time.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-indigo-600 text-white border-indigo-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-indigo-200' : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[420px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> TwoSum.java</span>
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
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-indigo-600 pl-1">Input Array (comma separated)</label>
                            <input type="text" value={inputArray} onChange={(e) => setInputArray(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
                        </div>
                        <div className="w-32 space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-emerald-600 pl-1">Target</label>
                            <input type="number" value={inputTarget} onChange={(e) => setInputTarget(e.target.value)} className="w-full bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner" />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center">
                            <div className="hidden lg:flex items-center gap-1.5 mr-2 text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                                <Keyboard size={14} />
                                <span className="text-[9px] font-mono uppercase tracking-widest font-bold">Use &larr; &rarr;</span>
                            </div>
                            <button onClick={handleReset} className="p-2.5 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-2.5 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess || st.notFound} className={`px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-6 shadow-xl border transition-all duration-300 min-h-[130px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : st.notFound ? 'bg-rose-900 border-rose-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={80} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-2 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Target Achieved</div>
                            <p className="text-sm leading-relaxed text-white mt-1 font-mono font-bold tracking-tight">{String(curStepData.description)}</p>
                         </div>
                    ) : st.notFound ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-rose-400 flex items-center gap-3"><XCircle size={20}/> No Solution</div>
                            <p className="text-sm leading-relaxed text-white mt-1 font-mono font-bold tracking-tight">{String(curStepData.description)}</p>
                         </div>
                    ) : (
                        <>
                            <div className="text-lg font-black tracking-tight mb-1 uppercase font-mono text-white leading-none truncate">{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-2 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 h-[340px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Layout size={14} className="text-indigo-500"/> Memory & State</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className="p-1.5 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className="p-1.5 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className="p-1.5 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><Maximize size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* Array Elements */}
                           <div className="absolute flex gap-4" style={{ left: startX, top: startY }}>
                               {(st.arr || []).map((val, idx) => {
                                  const isI = st.i === idx;
                                  const isJ = st.j === idx;
                                  const isSuccess = st.successPair?.includes(idx);
                                  
                                  let theme = 'slate';
                                  if (isSuccess) theme = 'emerald';
                                  else if (isI) theme = 'indigo';
                                  else if (isJ) theme = 'pink';

                                  const isTarget = isI || isJ || isSuccess;

                                  const labels = [];
                                  if (isI) labels.push({ text: "i", color: "indigo", pos: "top" });
                                  if (isJ) labels.push({ text: "j", color: "pink", pos: "bottom" });
                                  if (isSuccess && !isI && !isJ) labels.push({ text: "found", color: "emerald", pos: "top" });

                                  return (
                                      <div key={`arr-${idx}`} className="relative">
                                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                          
                                          <ArrayNodeBlock val={val} idx={idx} themeColor={theme} isTarget={isTarget} />
                                      </div>
                                  )
                               })}
                           </div>

                           {/* Brute Force Sum Visualization */}
                           {selectedOpId === 'bruteForce' && st.i !== null && st.j !== null && (
                               <div className="absolute left-1/2 -translate-x-1/2 bg-white border-2 border-slate-200 rounded-xl p-3 shadow-lg flex items-center gap-3 animate-in fade-in zoom-in" style={{ top: startY + 120 }}>
                                    <div className="flex gap-2 items-center text-lg font-mono font-black text-slate-600">
                                        <span className="text-indigo-600">{st.arr[st.i]}</span>
                                        <span>+</span>
                                        <span className="text-pink-500">{st.arr[st.j]}</span>
                                        <span>=</span>
                                        <span className={st.sum === st.target ? 'text-emerald-500' : 'text-slate-800'}>{st.sum}</span>
                                    </div>
                                    <div className="border-l-2 border-slate-200 pl-3 flex flex-col items-center">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">Target</span>
                                        <span className="font-mono font-black text-emerald-600">{st.target}</span>
                                    </div>
                               </div>
                           )}

                           {/* One-Pass Hash Map Visualization */}
                           {selectedOpId === 'onePassHash' && st.map && (
                               <div className="absolute left-[60px]" style={{ top: startY + 120 }}>
                                   
                                   {/* Complement Math Box */}
                                   {st.i !== undefined && (
                                       <div className="bg-white border-2 border-slate-200 rounded-xl p-3 shadow-lg flex flex-col mb-4 animate-in fade-in zoom-in w-fit">
                                            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Equation</div>
                                            <div className="flex gap-2 items-center text-sm font-mono font-black text-slate-600">
                                                <span className="text-emerald-600">Target({st.target})</span>
                                                <span>-</span>
                                                <span className="text-indigo-600">nums[{st.i}]({st.arr[st.i]})</span>
                                                <span>=</span>
                                                <span className="text-amber-500 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{st.complement ?? '?'}</span>
                                            </div>
                                       </div>
                                   )}

                                   {/* Hash Map UI */}
                                   <div className="bg-slate-800 border-2 border-slate-700 rounded-xl p-4 shadow-xl min-w-[240px] flex flex-col">
                                       <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 flex items-center justify-between border-b border-slate-700 pb-2">
                                           <div className="flex items-center gap-2"><Database size={14} className="text-amber-400"/> Hash Map</div>
                                           <div className="font-mono opacity-50">Value &rarr; Index</div>
                                       </div>
                                       
                                       <div className="flex gap-2 flex-wrap">
                                           {st.map.size === 0 && <div className="text-xs text-slate-500 font-mono italic">Map is empty</div>}
                                           {Array.from(st.map.entries()).map(([key, value]) => {
                                               const isJustAdded = st.justAdded === key;
                                               const isChecked = st.checkingMap === key;
                                               const isSuccess = st.successPair && st.successPair.includes(value);

                                               let boxStyle = "bg-slate-700 border-slate-600 text-slate-300";
                                               if (isSuccess) boxStyle = "bg-emerald-900 border-emerald-500 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-2 ring-emerald-400";
                                               else if (isChecked) boxStyle = "bg-amber-900 border-amber-500 text-amber-100 ring-2 ring-amber-400";
                                               else if (isJustAdded) boxStyle = "bg-sky-900 border-sky-500 text-sky-100 animate-in zoom-in";

                                               return (
                                                   <div key={key} className={`flex items-center rounded border shadow-sm transition-all duration-300 ${boxStyle}`}>
                                                       <div className="px-2 py-1 border-r border-inherit font-mono font-black">{key}</div>
                                                       <div className="px-2 py-1 font-mono text-xs opacity-80">{value}</div>
                                                   </div>
                                               );
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
                        <h3 className="font-black text-amber-400 text-lg uppercase tracking-widest mb-6">Space-Time Tradeoff</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium">
                            <p>Computer science is full of tradeoffs. In <strong>Brute Force</strong>, we use no extra memory ($O(1)$ Space), but we pay a massive penalty in Time ($O(N^2)$). For an array of $100,000$ elements, that's $10,000,000,000$ operations!</p>
                            <p>By introducing a <strong>Hash Map</strong>, we trade Memory for Speed. We allocate $O(N)$ Space to store the array elements. In return, lookups become instant ($O(1)$), reducing total time to $O(N)$.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-indigo-50 border border-indigo-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-indigo-700 text-lg uppercase tracking-widest mb-6">Why "Complement"?</h3>
                        <div className="space-y-4 text-sm text-indigo-900/80 leading-relaxed font-medium">
                            <p className="font-mono bg-white p-3 rounded-lg border border-indigo-200 shadow-sm">x + y = target <br/> y = target - x</p>
                            <p>Instead of iterating to find <code>y</code>, we mathematically derive it. If <code>target = 9</code> and we are at <code>x = 2</code>, we know we <em>must</em> find a <code>7</code>.</p>
                            <p>The Hash Map acts as a memory bank of "numbers we have seen in the past". We simply ask the bank: "Do you have a 7?".</p>
                        </div>
                    </div>

                    <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-emerald-700 text-lg uppercase tracking-widest mb-6">One-Pass vs Two-Pass</h3>
                        <div className="space-y-4 text-sm text-emerald-900/80 leading-relaxed font-medium">
                            <p><strong>Two-Pass:</strong> First loop adds everything to the map. Second loop checks for the complement. Risk: You might accidentally use the same element twice if the complement is the number itself.</p>
                            <p><strong>One-Pass (Our approach):</strong> We check the map <em>before</em> adding the current element. This naturally prevents reusing the same index and is strictly faster since we might find the answer halfway through the array!</p>
                        </div>
                    </div>

                    <div className="p-8 rounded-3xl bg-rose-50 border border-rose-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-rose-700 text-lg uppercase tracking-widest mb-6">The O(1) Catch</h3>
                        <div className="space-y-4 text-sm text-rose-900/80 leading-relaxed font-medium">
                            <p>We say Hash Map lookups are $O(1)$ Time. This is the <strong>Average Case</strong>. But what about the <strong>Worst Case</strong>?</p>
                            <p>If many keys hash to the same bucket (Hash Collisions), the underlying data structure degrades (often to a linked list). In the absolute worst case, lookup becomes $O(N)$, making our overall Two Sum time $O(N^2)$.</p>
                        </div>
                    </div>

                    <div className="p-8 md:col-span-2 rounded-3xl bg-slate-50 border border-slate-200 relative overflow-hidden shadow-inner flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
                            <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest mb-4">The "Sorted Array" Alternative</h3>
                            <p>If the array was already sorted (e.g., <code>[2, 7, 11, 15]</code>), we wouldn't even need a Hash Map! We could use the <strong>Two Pointers</strong> technique.</p>
                            <p>Place a pointer at the start (Left) and end (Right). If <code>sum &gt; target</code>, move Right leftwards to decrease the sum. If <code>sum &lt; target</code>, move Left rightwards to increase the sum. This achieves $O(N)$ Time with strictly $O(1)$ Space!</p>
                        </div>
                        <div className="w-full md:w-1/3 bg-white p-5 rounded-2xl shadow-sm border border-slate-200 font-mono text-xs">
                            <div className="text-slate-400 mb-2">// Two Pointers Concept</div>
                            <div className="text-indigo-600 font-bold mb-1">L = 0, R = len - 1</div>
                            <div className="text-pink-600 font-bold mb-1">while (L &lt; R) {'{'}</div>
                            <div className="text-slate-600 pl-4 mb-1">sum = arr[L] + arr[R]</div>
                            <div className="text-slate-600 pl-4 mb-1"><span className="text-pink-600">if</span> sum == target <span className="text-pink-600">return</span> [L, R]</div>
                            <div className="text-slate-600 pl-4 mb-1"><span className="text-pink-600">else if</span> sum &lt; target: L++</div>
                            <div className="text-slate-600 pl-4 mb-1"><span className="text-pink-600">else</span> R--</div>
                            <div className="text-pink-600 font-bold">{'}'}</div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-indigo-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-indigo-500">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Acing the First Question</h3>
                    <p className="text-sm text-indigo-100 leading-relaxed italic max-w-2xl font-mono">"Two Sum is notoriously the first problem on LeetCode. Do not just spit out the optimal solution. State the brute force approach first to show you understand the baseline, then say 'but we can optimize this to O(N) using a Hash Map' and write the optimal code."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 text-slate-700">
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-indigo-600 border-b pb-2">Common Follow-ups & Variations</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>What if the array is sorted?</strong> If sorted, you don't need a Hash Map. You can use the Two Pointer approach (one at start, one at end) to solve in $O(N)$ Time and $O(1)$ Space!</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Can we use the same element twice?</strong> The problem statement usually explicitly forbids this. The One-Pass approach naturally prevents this because we check the map <em>before</em> adding the current element.</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>What if there are multiple valid pairs?</strong> The standard problem guarantees exactly one solution. If there are multiple and you need to return all unique pairs, you must handle duplicates carefully. A common approach is to sort the array and use Two Pointers to easily skip duplicates (similar to the 3Sum problem).</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>What if the array is massive and doesn't fit in memory?</strong> This tests your system design intuition. You would chunk the data, use an external merge sort to sort the chunks on disk, and then apply the Two Pointer technique streaming from disk.</div></li>
                        </ul>
                    </div>
                    
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-rose-500 border-b pb-2">Edge Cases to Mention</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><ShieldAlert className="text-rose-400 shrink-0" size={20}/> <div><strong>Integer Overflow:</strong> What if <code>nums[i] + nums[j]</code> exceeds the 32-bit integer limit? In languages like Java or C++, mention checking bounds or casting to <code>long</code> before adding to show seniority.</div></li>
                            <li className="flex gap-4 items-start"><ShieldAlert className="text-rose-400 shrink-0" size={20}/> <div><strong>Negative Numbers:</strong> Does the Hash Map logic break with negatives? No. The math <code>target - nums[i]</code> inherently handles signs (e.g. Target -5, nums[i] = 2. Complement = -7). Mentioning this explicitly shows thoroughness.</div></li>
                        </ul>

                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm mt-8">
                            <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-500 mb-5">Interview Communication Checklist</h5>
                            <div className="space-y-3 font-mono text-[11px] text-slate-600 uppercase tracking-tight font-bold">
                                <div className="flex items-center gap-3"><CheckSquare size={16} className="text-indigo-500"/> Clarify constraints (negatives? duplicates?)</div>
                                <div className="flex items-center gap-3"><CheckSquare size={16} className="text-indigo-500"/> State Brute Force O(N²) Time / O(1) Space</div>
                                <div className="flex items-center gap-3"><CheckSquare size={16} className="text-indigo-500"/> Propose Hash Map O(N) Time / O(N) Space</div>
                                <div className="flex items-center gap-3"><CheckSquare size={16} className="text-indigo-500"/> Dry run with a small array out loud</div>
                                <div className="flex items-center gap-3"><CheckSquare size={16} className="text-indigo-500"/> Write clean code with clear variable names</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[450px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110]">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-900/50"><Code2 size={20}/></div>
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
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : st.notFound ? 'bg-rose-900/40 border-rose-800' : 'bg-slate-800/40 border-slate-700'}`}>
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
                  
                  {/* Floating Controls for Fullscreen (Approaches + Inputs) */}
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-56 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-indigo-600 pl-1">Input Array (comma separated)</label>
                              <input type="text" value={inputArray} onChange={(e) => setInputArray(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
                          </div>
                          <div className="w-24 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-emerald-600 pl-1">Target</label>
                              <input type="number" value={inputTarget} onChange={(e) => setInputTarget(e.target.value)} className="w-full bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner" />
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
                  
                  {!st.isSuccess && !st.notFound && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <Keyboard size={16} />
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess || st.notFound} className="px-12 py-6 bg-indigo-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-indigo-500 shadow-indigo-900/20">NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-500" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* Array Elements (Theater) */}
                           <div className="absolute flex gap-6" style={{ left: startX + 100, top: startY + 150 }}>
                               {(st.arr || []).map((val, idx) => {
                                  const isI = st.i === idx;
                                  const isJ = st.j === idx;
                                  const isSuccess = st.successPair?.includes(idx);
                                  
                                  let theme = 'slate';
                                  if (isSuccess) theme = 'emerald';
                                  else if (isI) theme = 'indigo';
                                  else if (isJ) theme = 'pink';

                                  const isTarget = isI || isJ || isSuccess;

                                  const labels = [];
                                  if (isI) labels.push({ text: "i", color: "indigo", pos: "top" });
                                  if (isJ) labels.push({ text: "j", color: "pink", pos: "bottom" });
                                  if (isSuccess && !isI && !isJ) labels.push({ text: "found", color: "emerald", pos: "top" });

                                  return (
                                      <div key={`arr-fs-${idx}`} className="relative">
                                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                          
                                          <ArrayNodeBlock val={val} idx={idx} themeColor={theme} isTarget={isTarget} />
                                      </div>
                                  )
                               })}
                           </div>

                            {/* Brute Force (Theater) */}
                           {selectedOpId === 'bruteForce' && st.i !== null && st.j !== null && (
                               <div className="absolute left-1/2 -translate-x-1/2 bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-2xl flex items-center gap-6 animate-in fade-in zoom-in" style={{ top: startY + 300 }}>
                                    <div className="flex gap-4 items-center text-3xl font-mono font-black text-slate-600">
                                        <span className="text-indigo-600">{st.arr[st.i]}</span>
                                        <span>+</span>
                                        <span className="text-pink-500">{st.arr[st.j]}</span>
                                        <span>=</span>
                                        <span className={st.sum === st.target ? 'text-emerald-500' : 'text-slate-800'}>{st.sum}</span>
                                    </div>
                                    <div className="border-l-4 border-slate-200 pl-6 flex flex-col items-center">
                                        <span className="text-sm uppercase font-bold text-slate-400">Target</span>
                                        <span className="font-mono font-black text-emerald-600 text-3xl">{st.target}</span>
                                    </div>
                               </div>
                           )}

                           {/* One-Pass Hash Map UI (Theater) */}
                           {selectedOpId === 'onePassHash' && st.map && (
                               <div className="absolute left-[160px]" style={{ top: startY + 300 }}>
                                   
                                   {st.i !== undefined && (
                                       <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-xl flex flex-col mb-6 animate-in fade-in zoom-in w-fit scale-110 origin-top-left">
                                            <div className="text-xs uppercase font-bold text-slate-400 mb-2">Equation</div>
                                            <div className="flex gap-3 items-center text-xl font-mono font-black text-slate-600">
                                                <span className="text-emerald-600">Target({st.target})</span>
                                                <span>-</span>
                                                <span className="text-indigo-600">nums[{st.i}]({st.arr[st.i]})</span>
                                                <span>=</span>
                                                <span className="text-amber-500 bg-amber-50 px-3 py-1 rounded border border-amber-200">{st.complement ?? '?'}</span>
                                            </div>
                                       </div>
                                   )}

                                   <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-6 shadow-2xl min-w-[300px] flex flex-col scale-110 origin-top-left">
                                       <div className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center justify-between border-b border-slate-700 pb-3">
                                           <div className="flex items-center gap-2"><Database size={18} className="text-amber-400"/> Hash Map</div>
                                           <div className="font-mono opacity-50">Value &rarr; Index</div>
                                       </div>
                                       
                                       <div className="flex gap-3 flex-wrap">
                                           {st.map.size === 0 && <div className="text-sm text-slate-500 font-mono italic">Map is empty</div>}
                                           {Array.from(st.map.entries()).map(([key, value]) => {
                                               const isJustAdded = st.justAdded === key;
                                               const isChecked = st.checkingMap === key;
                                               const isSuccess = st.successPair && st.successPair.includes(value);

                                               let boxStyle = "bg-slate-700 border-slate-600 text-slate-300";
                                               if (isSuccess) boxStyle = "bg-emerald-900 border-emerald-500 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.4)] ring-4 ring-emerald-400";
                                               else if (isChecked) boxStyle = "bg-amber-900 border-amber-500 text-amber-100 ring-4 ring-amber-400";
                                               else if (isJustAdded) boxStyle = "bg-sky-900 border-sky-500 text-sky-100 animate-in zoom-in";

                                               return (
                                                   <div key={key} className={`flex items-center rounded-lg border shadow-md transition-all duration-300 text-lg ${boxStyle}`}>
                                                       <div className="px-3 py-1.5 border-r border-inherit font-mono font-black">{key}</div>
                                                       <div className="px-3 py-1.5 font-mono opacity-80">{value}</div>
                                                   </div>
                                               );
                                           })}
                                       </div>
                                   </div>
                               </div>
                           )}

                       </div>
                  </div>
                  {(st.isSuccess || st.notFound) && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.isSuccess ? 'border-emerald-500 shadow-emerald-500/30' : 'border-rose-500 shadow-rose-500/30'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.isSuccess ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ${st.isSuccess ? 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10' : 'bg-rose-500/20 text-rose-500 ring-rose-500/10'}`}>
                                    {st.isSuccess ? <PartyPopper size={48}/> : <XCircle size={48}/>}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    {st.isSuccess ? 'TARGET PAIR FOUND' : 'NO SOLUTION FOUND'}
                                </h2>
                                <p className={`font-mono text-sm uppercase mb-8 tracking-widest ${st.isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {String(curStepData.description)}
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg ${st.isSuccess ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/20'}`}>
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