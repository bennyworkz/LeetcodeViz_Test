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
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Target, Keyboard, Type, KeyRound, Box, Landmark, Calculator, Plus, Minus, History, Grid3x3, LayoutGrid, AlertOctagon, Repeat1, AlignLeft
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  linearMerge: {
    id: 'linearMerge',
    title: '1. Linear Merge (Optimal)',
    icon: <GitMerge size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public int[][] insert(int[][] intervals, int[] newInterval) {
    List<int[]> res = new ArrayList<>();
    int i = 0;
    int n = intervals.length;

    // 1. Add all intervals entirely BEFORE newInterval
    while (i < n && intervals[i][1] < newInterval[0]) {
        res.add(intervals[i]);
        i++;
    }

    // 2. Merge all overlapping intervals
    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    res.add(newInterval);

    // 3. Add all intervals entirely AFTER newInterval
    while (i < n) {
        res.add(intervals[i]);
        i++;
    }

    return res.toArray(new int[res.size()][]);
}`,
    desc: "The standard and most efficient O(N) approach. We iterate through the intervals in 3 distinct phases: Left of the new interval, overlapping with the new interval, and right of the new interval."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|return|if|else|for|while|continue|new|length|List|ArrayList|Math|min|max|add|toArray|size)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-sky-500/20`, border: `border-sky-400`, text: `text-sky-300` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-sky-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'return', 'if', 'else', 'for', 'while', 'continue', 'new'].includes(part);
            const isObject = ['List', 'ArrayList', 'Math'].includes(part);
            const isVar = ['intervals', 'newInterval', 'res', 'i', 'n'].includes(part);
            const isMapCall = ['length', 'min', 'max', 'add', 'toArray', 'size'].includes(part);

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-sky-400 font-bold';
            else if (isVar) className = 'text-sky-200';
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
        indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300',
        rose: 'bg-rose-100 text-rose-700 border-rose-300',
        amber: 'bg-amber-100 text-amber-700 border-amber-300',
        slate: 'bg-slate-100 text-slate-600 border-slate-300'
    };
    const activeColorClass = colorClasses[color] || colorClasses['slate'];
    const alignClass = position === 'top' ? 'flex-col-reverse -top-10' : 'flex-col -bottom-10';

    return (
        <div className={`absolute ${alignClass} flex items-center justify-center animate-in zoom-in duration-300 z-30 pointer-events-none`}>
            <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded border shadow-sm ${activeColorClass} whitespace-nowrap`}>
                {String(label)}
            </span>
            {position === 'top' ? <ArrowDown size={14} className={`text-${color}-500`} strokeWidth={3}/> : <ArrowUp size={14} className={`text-${color}-500`} strokeWidth={3}/>}
        </div>
    );
};

interface IntervalBlockProps {
  interval: number[];
  themeColor?: string;
  isTarget?: boolean;
  label?: string;
  idx?: number;
}

const IntervalBlock: React.FC<IntervalBlockProps> = ({ interval, themeColor = 'slate', isTarget, label, idx }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', accent: 'bg-emerald-200' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', accent: 'bg-sky-200' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800', accent: 'bg-indigo-200' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', accent: 'bg-fuchsia-200' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', accent: 'bg-slate-200' }
    };
    
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;

    if (!interval) return null;

    return (
        <div className="relative flex flex-col items-center justify-center group transition-all duration-500 m-2">
            {label && <span className={`absolute -top-6 text-[10px] font-black font-mono uppercase tracking-widest ${activeTheme.text}`}>{label}</span>}
            
            <div className={`flex flex-col items-center min-w-[80px] h-[48px] border-2 rounded-xl transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-lg bg-white/60 ${activeTheme.text} gap-3 px-4`}>
                    <span>{interval[0]}</span>
                    <span className="opacity-40">-</span>
                    <span>{interval[1]}</span>
                </div>
            </div>

            {idx !== undefined && <span className="absolute -bottom-6 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">i = {idx}</span>}
        </div>
    );
};

// --- Main Application ---

export default function InsertIntervalVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('linearMerge');
  
  const [inputIntervalsStr, setInputIntervalsStr] = useState('[1,2],[3,5],[6,7],[8,10],[12,16]');
  const [inputNewIntervalStr, setInputNewIntervalStr] = useState('[4,8]');
  
  const [baseIntervals, setBaseIntervals] = useState([]);
  const [baseNewInterval, setBaseNewInterval] = useState([]);
  
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

  const parseIntervals = (str) => {
      const matches = str.match(/\[\s*(-?\d+)\s*,\s*(-?\d+)\s*\]/g);
      if (!matches) return [];
      return matches.map(m => {
          const parts = m.match(/-?\d+/g);
          return [parseInt(parts[0]), parseInt(parts[1])];
      });
  };

  useEffect(() => {
    setBaseIntervals(parseIntervals(inputIntervalsStr));
    const ni = parseIntervals(inputNewIntervalStr);
    if (ni.length > 0) setBaseNewInterval(ni[0]);
    else setBaseNewInterval([]);

    setCurrentStep(0);
    setPan({ x: 0, y: 0 });
  }, [inputIntervalsStr, inputNewIntervalStr, selectedOpId]);

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
    if (!baseIntervals || baseIntervals.length === 0 || !baseNewInterval || baseNewInterval.length !== 2) {
         return [{ phase: 'Init', description: 'Enter valid intervals.', line: 0, state: { arr: [], newInt: [], res: [] } }];
    }
    
    let intervals = baseIntervals.map(i => [...i]);
    let newInt = [...baseNewInterval];
    let n = intervals.length;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            arr: intervals.map(i => [...i]),
            newInt: [...newInt],
            n,
            ...st 
        } 
    });

    if (selectedOpId === 'linearMerge') {
        let res = [];
        let i = 0;
        
        add("Initialize", `n = ${n}. Initialize empty result list and set i = 0. Phase 1: Skip non-overlapping.`, 4, { i, res: [...res], phaseId: 1 });

        // Phase 1
        while (true) {
            add("Check Condition (Phase 1)", `while (i < n && intervals[i][1] < newInterval[0]) -> Checking if interval completely precedes the new interval.`, 7, { i, res: [...res], hl: [i], phaseId: 1, checkingP1: true });
            
            if (i < n && intervals[i][1] < newInt[0]) {
                add("Condition Passed", `intervals[${i}][1] (${intervals[i][1]}) < ${newInt[0]}. No overlap. Proceed inside loop.`, 7, { i, res: [...res], hl: [i], phaseId: 1 });
                res.push([...intervals[i]]);
                add("Add to Result", `Added intervals[${i}] to the result list.`, 8, { i, res: [...res], hl: [i], phaseId: 1 });
                i++;
                add("Increment i", `i++ -> Moving to next interval.`, 9, { i, res: [...res], hl: [i], phaseId: 1 });
            } else {
                let failReason = i >= n ? "End of intervals reached." : `intervals[${i}][1] (${intervals[i][1]}) is NOT < ${newInt[0]}. Overlap or past boundary found!`;
                add("Condition Failed", `${failReason} Break out of Phase 1.`, 7, { i, res: [...res], hl: [i], phaseId: 1, isFailP1: true });
                break;
            }
        }

        add("Start Phase 2", `Phase 2: Merge Overlapping Intervals.`, 12, { i, res: [...res], phaseId: 2 });

        // Phase 2
        while (true) {
            add("Check Condition (Phase 2)", `while (i < n && intervals[i][0] <= newInterval[1]) -> Checking if current interval's start overlaps with newInterval's end.`, 13, { i, res: [...res], hl: [i], phaseId: 2, checkingP2: true });

            if (i < n && intervals[i][0] <= newInt[1]) {
                add("Condition Passed", `intervals[${i}][0] (${intervals[i][0]}) <= ${newInt[1]}. Overlap detected! Proceed inside loop.`, 13, { i, res: [...res], hl: [i], phaseId: 2 });
                
                let oldStart = newInt[0];
                newInt[0] = Math.min(newInt[0], intervals[i][0]);
                add("Update Start", `newInterval[0] = min(${oldStart}, ${intervals[i][0]}) = ${newInt[0]}`, 14, { i, res: [...res], hl: [i], phaseId: 2, updatedStart: true });
                
                let oldEnd = newInt[1];
                newInt[1] = Math.max(newInt[1], intervals[i][1]);
                add("Update End", `newInterval[1] = max(${oldEnd}, ${intervals[i][1]}) = ${newInt[1]}`, 15, { i, res: [...res], hl: [i], phaseId: 2, updatedEnd: true });
                
                i++;
                add("Increment i", `i++ -> Moving to next interval to see if it also overlaps.`, 16, { i, res: [...res], hl: [i], phaseId: 2 });
            } else {
                let failReason = i >= n ? "End of intervals reached." : `intervals[${i}][0] (${intervals[i][0]}) is NOT <= ${newInt[1]}. Intervals no longer overlap!`;
                add("Condition Failed", `${failReason} Break out of Phase 2.`, 13, { i, res: [...res], hl: [i], phaseId: 2, isFailP2: true });
                break;
            }
        }

        res.push([...newInt]);
        add("Insert Merged", `Phase 2 finished. Insert the fully merged newInterval into the result list.`, 18, { i, res: [...res], phaseId: 2 });

        add("Start Phase 3", `Phase 3: Add remaining intervals.`, 20, { i, res: [...res], phaseId: 3 });

        // Phase 3
        while (true) {
            add("Check Condition (Phase 3)", `while (i < n) -> Check if there are any intervals left.`, 21, { i, res: [...res], hl: [i], phaseId: 3, checkingP3: true });

            if (i < n) {
                add("Condition Passed", `i (${i}) < n (${n}). Proceed inside loop.`, 21, { i, res: [...res], hl: [i], phaseId: 3 });
                res.push([...intervals[i]]);
                add("Add to Result", `Added remaining intervals[${i}] to result.`, 22, { i, res: [...res], hl: [i], phaseId: 3 });
                i++;
                add("Increment i", `i++ -> Moving to next interval.`, 23, { i, res: [...res], hl: [i], phaseId: 3 });
            } else {
                add("Condition Failed", `i (${i}) is not < n. All intervals processed! Break out.`, 21, { i, res: [...res], hl: [i], phaseId: 3, isFailP3: true });
                break;
            }
        }

        add("Return Result", `Convert result List to Array and return. Algorithm complete!`, 26, { i, res: [...res], phaseId: 4, isSuccess: true });
    }

    return steps;
  }, [baseIntervals, baseNewInterval, selectedOpId]);

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

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { arr: [], res: [], newInt: [] } };
  const st = curStepData.state || { arr: [], res: [], newInt: [] };
  const isLastStep = currentStep === trace.length - 1;

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-sky-500 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <GitMerge className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Insert Interval</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                      LC 57 • Arrays
                  </span>
                  <span>•</span>
                  <span>Linear Merge</span>
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
                  You are given an array of non-overlapping intervals <code>intervals</code> where <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code> represent the start and the end of the <code>i<sup>th</sup></code> interval and <code>intervals</code> is sorted in ascending order by <code>start<sub>i</sub></code>. You are also given an interval <code>newInterval = [start, end]</code> that represents the start and end of another interval.<br/><br/>
                  Insert <code>newInterval</code> into <code>intervals</code> such that <code>intervals</code> is still sorted in ascending order by <code>start<sub>i</sub></code> and <code>intervals</code> still does not have any overlapping intervals (merge overlapping intervals if necessary). Return <code>intervals</code> after the insertion.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-900 border-l-4 border-sky-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-sky-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> intervals = [[1,3],[6,9]], newInterval = [2,5]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> [[1,5],[6,9]]</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: [2,5] overlaps with [1,3].</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-fuchsia-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-fuchsia-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> [[1,2],[3,10],[12,16]]</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: Because the new interval [4,8] overlaps with [3,5],[6,7],[8,10].</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 3 (Edge)</span>
                        <div><span className="text-white font-bold">Input:</span> intervals = [], newInterval = [5,7]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> [[5,7]]</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: The initial array is empty, so we just insert the new interval.</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-1">
                        <li>0 &lt;= intervals.length &lt;= 10<sup>4</sup></li>
                        <li>intervals[i].length == 2</li>
                        <li>0 &lt;= start<sub>i</sub> &lt;= end<sub>i</sub> &lt;= 10<sup>5</sup></li>
                        <li>intervals is sorted by start<sub>i</sub> in ascending order.</li>
                        <li>newInterval.length == 2</li>
                        <li>0 &lt;= start &lt;= end &lt;= 10<sup>5</sup></li>
                    </ul>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-sky-500 text-white border-sky-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-sky-100' : 'text-slate-400'}`}>{op.complexity}</div>
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
                                <span>Intervals [a,b],[c,d]...</span>
                            </label>
                            <input 
                                type="text"
                                value={inputIntervalsStr} 
                                onChange={(e) => setInputIntervalsStr(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-inner" 
                                spellCheck={false}
                            />
                        </div>
                        <div className="w-full xl:w-32 space-y-1.5 group shrink-0">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-fuchsia-600 pl-1 flex justify-between">
                                <span>New Int</span>
                            </label>
                            <input 
                                type="text"
                                value={inputNewIntervalStr} 
                                onChange={(e) => setInputNewIntervalStr(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all shadow-inner" 
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center w-full xl:w-auto mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep} className={`px-6 py-3 bg-sky-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-sky-200 hover:bg-sky-600 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
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
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Merging Complete</div>
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
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Layout size={14} className="text-sky-500"/> Variable State</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className="p-1.5 text-slate-600 hover:text-sky-600 rounded-lg transition-colors"><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className="p-1.5 text-slate-600 hover:text-sky-600 rounded-lg transition-colors"><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className="p-1.5 text-slate-600 hover:text-sky-600 rounded-lg transition-colors"><Maximize size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col items-center justify-center p-8 gap-8" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* --- Strict Flexbox Layout --- */}
                           
                           {/* Row 1: Source Intervals */}
                           <div className="flex flex-col items-center border border-slate-200 bg-white/80 p-4 rounded-3xl shadow-sm backdrop-blur-sm w-full max-w-2xl">
                               <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono mb-2 w-full border-b pb-2">Input: intervals[i]</div>
                               <div className="flex flex-wrap items-center justify-center gap-2 w-full min-h-[70px]">
                                   {st.arr && st.arr.length === 0 && <span className="text-slate-400 italic font-mono text-sm">[] (empty)</span>}
                                   {(st.arr || []).map((interval, idx) => {
                                       const isI = st.i === idx;
                                       let theme = 'slate';
                                       if (isI) theme = 'indigo';
                                       else if (st.i !== undefined && idx < st.i) theme = 'slate'; // already processed
                                       
                                       return (
                                           <div key={`arr-${idx}`} className={`transition-all duration-300 ${st.i !== undefined && idx < st.i ? 'opacity-40 grayscale scale-95' : ''}`}>
                                               <IntervalBlock interval={interval} themeColor={theme} isTarget={isI} idx={idx} />
                                           </div>
                                       )
                                   })}
                               </div>
                           </div>

                           {/* Row 2: Merge Zone */}
                           <div className="flex flex-col items-center border-2 border-fuchsia-200 bg-fuchsia-50/50 p-4 rounded-3xl shadow-md backdrop-blur-sm w-full max-w-sm">
                               <div className="text-[9px] font-black text-fuchsia-600 uppercase tracking-widest font-mono mb-2 w-full border-b border-fuchsia-200 pb-2 flex justify-between">
                                   <span>Merge Zone: newInterval</span>
                                   {(st.updatedStart || st.updatedEnd) && <span className="animate-pulse bg-fuchsia-200 text-fuchsia-800 px-2 rounded">MUTATED</span>}
                               </div>
                               <div className="flex items-center justify-center w-full min-h-[70px]">
                                   {st.newInt && st.newInt.length === 2 && (
                                       <div className={`transition-all duration-500 ${(st.updatedStart || st.updatedEnd) ? 'scale-110 shadow-[0_0_20px_rgba(217,70,239,0.4)]' : ''}`}>
                                           <IntervalBlock interval={st.newInt} themeColor="fuchsia" />
                                       </div>
                                   )}
                               </div>
                           </div>

                           {/* Row 3: Result Stream */}
                           <div className="flex flex-col items-center border border-emerald-200 bg-emerald-50/50 p-4 rounded-3xl shadow-md backdrop-blur-sm w-full max-w-2xl">
                               <div className="text-[9px] font-black text-emerald-600 uppercase tracking-widest font-mono mb-2 w-full border-b border-emerald-200 pb-2">Output: res List</div>
                               <div className="flex flex-wrap items-center justify-center gap-2 w-full min-h-[70px]">
                                    {st.res && st.res.length === 0 && <span className="text-emerald-300 italic font-mono text-sm">[] (empty)</span>}
                                    {(st.res || []).map((interval, idx) => {
                                       // Check if this was just added
                                       const isJustAdded = idx === st.res.length - 1 && st.phase === 'Add to Result' || (st.phase === 'Insert Merged' && idx === st.res.length -1);
                                       return (
                                           <div key={`res-${idx}`} className={`transition-all duration-500 ${isJustAdded ? 'animate-in slide-in-from-top-4 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.4)] z-20' : ''}`}>
                                               <IntervalBlock interval={interval} themeColor="emerald" />
                                           </div>
                                       )
                                   })}
                               </div>
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
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><GitMerge size={120}/></div>
                        <h3 className="font-black text-sky-400 text-lg uppercase tracking-widest mb-6">The 3-Phase Approach</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>Because the input array is strictly sorted by start times and non-overlapping, any new interval we insert will perfectly split the original array into three groups:</p>
                            <ol className="list-decimal list-inside space-y-2 text-sky-100 ml-2 font-mono text-xs p-4 bg-slate-800 rounded-xl">
                                <li>All intervals ending BEFORE the new one starts.</li>
                                <li>Intervals that OVERLAP with the new one.</li>
                                <li>All intervals starting AFTER the new one ends.</li>
                            </ol>
                            <p>We handle these three phases linearly using sequential `while` loops.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-sky-50 border border-sky-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-sky-700 text-lg uppercase tracking-widest mb-6">Merge Math Logic</h3>
                        <div className="space-y-4 text-sm text-sky-900/80 leading-relaxed font-medium">
                            <p>How do we know if two intervals `A` and `B` overlap?</p>
                            <p>They overlap if: <code>A.start &lt;= B.end AND A.end &gt;= B.start</code>.</p>
                            <p>When they overlap, we must forge a "Super Interval" that engulfs both. The math is simple: The new start is the absolute minimum of both starts. The new end is the absolute maximum of both ends.</p>
                            <p className="font-mono bg-white p-3 rounded-lg border border-sky-200 shadow-sm text-sky-700">newStart = min(A[0], B[0])<br/>newEnd = max(A[1], B[1])</p>
                        </div>
                    </div>

                    <div className="p-8 md:col-span-2 rounded-3xl bg-slate-50 border border-slate-200 relative overflow-hidden shadow-inner flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
                            <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest mb-4">Why Not Just Append & Sort?</h3>
                            <p>The naive solution is to just append `newInterval` to the end of the `intervals` array, and then call `Arrays.sort()`, followed by a standard interval merge.</p>
                            <p><strong>The Trap:</strong> Sorting takes $O(N \log N)$ time. By taking advantage of the fact that the input is <em>already sorted</em>, our 3-phase linear scan builds the result in strict $O(N)$ time.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-sky-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-sky-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering The Interval Question</h3>
                    <p className="text-sm text-sky-50 leading-relaxed italic max-w-2xl font-mono">"Interval questions are incredibly common. They test your ability to handle edge cases and reason about overlapping ranges. Be prepared for follow-up questions challenging your use of extra space or checking if binary search could be used."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-sky-500"/> Possible Interview Questions & Answers
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-sky-50/50 border border-sky-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-sky-800 text-sm uppercase tracking-widest">
                               <div className="bg-sky-200 p-2 rounded-lg text-sky-700"><Goal size={16}/></div>
                               Q: Can we do this in O(1) Extra Space?
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-sky-100 shadow-inner flex-1">
                                "A: Only if the return type allows it. If we return a dynamic list, mutating the input array 'in-place' is possible but computationally expensive. To remove elements from the middle of an array requires shifting all subsequent elements left, which takes O(N) time per deletion, potentially degrading to O(N²) worst-case. Allocating a new O(N) array is much safer and faster."
                            </p>
                        </div>

                        <div className="bg-sky-50/50 border border-sky-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-sky-800 text-sm uppercase tracking-widest">
                               <div className="bg-sky-200 p-2 rounded-lg text-sky-700"><Search size={16}/></div>
                               Q: Since it's sorted, can we use Binary Search?
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-sky-100 shadow-inner flex-1">
                                "A: Yes, we could use Binary Search in O(log N) time to find the exact insertion point for Phase 1. HOWEVER, since we still have to physically copy/insert elements into a new array (or shift elements in an existing one), that copy operation takes O(N) time. Therefore, the overall algorithmic bottleneck remains O(N), so linear scanning is preferred for simplicity."
                            </p>
                        </div>

                        <div className="bg-sky-50/50 border border-sky-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-sky-800 text-sm uppercase tracking-widest">
                               <div className="bg-sky-200 p-2 rounded-lg text-sky-700"><ShieldAlert size={16}/></div>
                               Q: What if the newInterval totally engulfs everything?
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-sky-100 shadow-inner flex-1">
                                "A: My Phase 2 logic handles this perfectly. E.g., if array is [[2,3],[4,5]] and new is [1,10]. Phase 1 skips entirely. Phase 2 absorbs both 2,3 and 4,5 into newInterval, making it [1,10]. Phase 3 skips. Result is correctly [[1,10]]."
                            </p>
                        </div>

                        <div className="bg-sky-50/50 border border-sky-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-sky-800 text-sm uppercase tracking-widest">
                               <div className="bg-sky-200 p-2 rounded-lg text-sky-700"><Layers size={16}/></div>
                               Q: What if the input array is empty?
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-sky-100 shadow-inner flex-1">
                                "A: The loop conditions 'while (i &lt; n)' immediately fail for Phase 1 and 2. We skip straight to 'res.add(newInterval)'. Phase 3 also fails. It correctly returns just the newInterval in the resulting array."
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
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : st.isFailP1 || st.isFailP2 || st.isFailP3 ? 'bg-slate-800/80 border-slate-600' : 'bg-slate-800/40 border-slate-700'}`}>
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
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? 'bg-sky-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-64 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-sky-600 pl-1">Intervals [a,b],[c,d]...</label>
                              <input type="text" value={inputIntervalsStr} onChange={(e) => setInputIntervalsStr(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-inner" />
                          </div>
                          <div className="w-24 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-fuchsia-600 pl-1">New Int</label>
                              <input type="text" value={inputNewIntervalStr} onChange={(e) => setInputNewIntervalStr(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all shadow-inner" />
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
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className="px-12 py-6 bg-sky-500 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(14,165,233,0.3)] hover:bg-sky-600 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-sky-400 shadow-sky-900/20">NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-500" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* Theater Layout: Strict Flexbox Rows without overlaps */}
                           <div className="p-16 pt-32 flex flex-col items-center justify-center gap-16 min-w-max h-full">
                               
                               {/* Row 1: Source Intervals */}
                               <div className="flex flex-col items-center border-2 border-slate-200 bg-white/90 p-8 rounded-[2rem] shadow-xl backdrop-blur-md w-full max-w-4xl scale-110">
                                   <div className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono mb-4 w-full border-b-2 border-slate-100 pb-3 flex items-center gap-2"><ListOrdered size={16}/> Input: intervals[i]</div>
                                   <div className="flex flex-wrap items-center justify-center gap-4 w-full min-h-[80px]">
                                       {st.arr && st.arr.length === 0 && <span className="text-slate-400 italic font-mono text-lg">[] (empty)</span>}
                                       {(st.arr || []).map((interval, idx) => {
                                           const isI = st.i === idx;
                                           let theme = 'slate';
                                           if (isI) theme = 'indigo';
                                           else if (st.i !== undefined && idx < st.i) theme = 'slate'; 
                                           
                                           return (
                                               <div key={`arr-fs-${idx}`} className={`transition-all duration-300 ${st.i !== undefined && idx < st.i ? 'opacity-40 grayscale scale-95' : ''}`}>
                                                   <IntervalBlock interval={interval} themeColor={theme} isTarget={isI} idx={idx} />
                                               </div>
                                           )
                                       })}
                                   </div>
                               </div>

                               {/* Row 2: Merge Zone */}
                               <div className="flex flex-col items-center border-[3px] border-fuchsia-300 bg-fuchsia-50/80 p-8 rounded-[2rem] shadow-2xl backdrop-blur-md w-full max-w-xl scale-110 z-10">
                                   <div className="text-xs font-black text-fuchsia-600 uppercase tracking-widest font-mono mb-4 w-full border-b-2 border-fuchsia-200 pb-3 flex justify-between items-center">
                                       <span className="flex items-center gap-2"><GitMerge size={16}/> Merge Zone: newInterval</span>
                                       {(st.updatedStart || st.updatedEnd) && <span className="animate-pulse bg-fuchsia-200 text-fuchsia-800 px-3 py-1 rounded-lg">MUTATED</span>}
                                   </div>
                                   <div className="flex items-center justify-center w-full min-h-[80px]">
                                       {st.newInt && st.newInt.length === 2 && (
                                           <div className={`transition-all duration-500 ${(st.updatedStart || st.updatedEnd) ? 'scale-125 shadow-[0_0_30px_rgba(217,70,239,0.5)]' : ''}`}>
                                               <IntervalBlock interval={st.newInt} themeColor="fuchsia" />
                                           </div>
                                       )}
                                   </div>
                               </div>

                               {/* Row 3: Result Stream */}
                               <div className="flex flex-col items-center border-2 border-emerald-300 bg-emerald-50/80 p-8 rounded-[2rem] shadow-xl backdrop-blur-md w-full max-w-4xl scale-110">
                                   <div className="text-xs font-black text-emerald-600 uppercase tracking-widest font-mono mb-4 w-full border-b-2 border-emerald-200 pb-3 flex items-center gap-2"><CheckCircle2 size={16}/> Output: res List</div>
                                   <div className="flex flex-wrap items-center justify-center gap-4 w-full min-h-[80px]">
                                        {st.res && st.res.length === 0 && <span className="text-emerald-400 italic font-mono text-lg">[] (empty)</span>}
                                        {(st.res || []).map((interval, idx) => {
                                           const isJustAdded = idx === st.res.length - 1 && st.phase === 'Add to Result' || (st.phase === 'Insert Merged' && idx === st.res.length -1);
                                           return (
                                               <div key={`res-fs-${idx}`} className={`transition-all duration-500 ${isJustAdded ? 'animate-in slide-in-from-top-6 scale-125 shadow-[0_0_20px_rgba(16,185,129,0.5)] z-20 mx-4' : ''}`}>
                                                   <IntervalBlock interval={interval} themeColor="emerald" />
                                               </div>
                                           )
                                       })}
                                   </div>
                               </div>

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