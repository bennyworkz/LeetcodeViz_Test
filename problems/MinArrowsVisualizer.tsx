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
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Combine, Dices, BoxSelect, ArrowDownUp, Maximize2, Variable,
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalGreedy: {
    id: 'optimalGreedy',
    title: '1. O(N log N) Greedy Sort',
    icon: <Crosshair size={16} />,
    complexity: 'Time: O(N log N) | Space: O(1)',
    theme: 'sky',
    code: `public int findMinArrowShots(int[][] points) {
    if (points.length == 0) return 0;
    Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));
    int arrows = 1;
    int prevEnd = points[0][1];
    for (int i = 1; i < points.length; i++) {
        if (points[i][0] > prevEnd) {
            arrows++;
            prevEnd = points[i][1];
        }
    }
    return arrows;
}`,
    desc: "The Optimal Greedy Approach. We sort all balloons by their END coordinates. We shoot our first arrow exactly at the end coordinate of the first balloon (prevEnd). As we iterate through the rest of the balloons, if a balloon starts after our previous arrow's position, it cannot be burst by that arrow. Therefore, we must shoot a new arrow at this new balloon's end coordinate. If a balloon starts before or exactly at the previous arrow's position, it gets burst by the previous arrow, so we do nothing."
  }
};

// --- Helper UI Components ---

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  themeColor: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label, themeColor }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? `bg-${themeColor}-600 text-white shadow-md scale-105 border border-white/10` : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
  theme?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'sky' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|boolean|char|return|if|else|while|for|continue|break|new|String|findMinArrowShots|points|length|Arrays|sort|Integer|compare|a|b|arrows|prevEnd|i)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
  const activeStyles = { bg: `bg-${theme}-500/20`, border: `border-${theme}-500`, text: `text-${theme}-400` };
  
  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `${activeStyles.text} font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre 
        className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] whitespace-pre-wrap break-words ${active ? 'opacity-100' : 'opacity-60'}`}
        style={{ paddingLeft: `${leadingSpaces}ch`, textIndent: `-${leadingSpaces}ch` }}
      >
        {parts.map((part, idx) => {
            const isKeyword = ['public', 'private', 'void', 'int', 'boolean', 'char', 'return', 'if', 'else', 'while', 'for', 'continue', 'break', 'new'].includes(part);
            const isObject = ['String', 'Arrays', 'Integer'].includes(part);
            const isPointer = ['points', 'a', 'b', 'arrows', 'prevEnd', 'i'].includes(part);
            const isMapCall = ['findMinArrowShots', 'length', 'sort', 'compare'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^'].includes(part.trim());
            
            return (
              <span 
                key={idx} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-emerald-400 font-bold' : 
                  isMapCall ? 'text-amber-300' :
                  isOperator ? 'text-slate-400 font-bold' :
                  isPointer ? `text-${theme}-300` : 
                  isNaN(parseInt(part)) ? (part.startsWith('"') || part.startsWith("'") ? 'text-emerald-300' : '') : 'text-emerald-400'
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

// --- Main Application ---

export default function MinArrowsVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalGreedy');
  
  const [pointsInput, setPointsInput] = useState('[[10,16],[2,8],[1,6],[7,12]]');
  
  const [basePoints, setBasePoints] = useState<number[][]>([[10,16],[2,8],[1,6],[7,12]]);
  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85); 
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  // --- Effects for Data Processing ---

  useEffect(() => {
    const timer = setTimeout(() => {
      let parsed = [[10,16],[2,8],[1,6],[7,12]];
      try {
          let str = pointsInput.trim();
          if (!str.startsWith('[')) str = `[${str}]`;
          let temp = JSON.parse(str);
          if (Array.isArray(temp) && temp.every(a => Array.isArray(a) && a.length === 2 && typeof a[0] === 'number' && typeof a[1] === 'number')) {
              parsed = temp;
          }
      } catch (e) {
          // Fallback to default if parse fails
      }
      
      // Limit to 10 balloons for UI sanity
      if (parsed.length > 10) parsed = parsed.slice(0, 10);
      
      setBasePoints(parsed);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [pointsInput, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    let unsorted = [...basePoints.map(i => [...i])];

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { ...st } 
    });

    if (selectedOpId === 'optimalGreedy') {
        
        add("Function Call", `public int findMinArrowShots(int[][] points)`, 1, { points: unsorted });
        
        // Line 2
        add("Check Empty", `if (points.length == 0) return 0;\nArray has ${unsorted.length} balloons.`, 2, { points: unsorted });
        
        if (unsorted.length === 0) {
            add("Return", `return 0;`, 2, { points: unsorted, isSuccess: true, finalAns: 0 });
            return steps;
        }

        // Line 3: Sort
        let sorted = [...unsorted].sort((a, b) => a[1] - b[1]);
        add("Sort Balloons", `Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));\nCrucial Step: Sort all balloons by their END coordinates ascending.`, 3, { points: sorted, hlSort: true });

        // Line 4-5: Init
        let arrows = 1;
        let prevEnd = sorted[0][1];
        let burst = new Set<number>([0]);

        add("Init Counters", `int arrows = 1;\nint prevEnd = points[0][1];\nShoot first arrow at end of first balloon: ${prevEnd}.`, 5, { points: sorted, arrows, prevEnd, burst: new Set(burst), hlInit: true });

        // Line 6-11: Loop
        for (let i = 1; i < sorted.length; i++) {
            add("For Loop", `for (int i = 1; i < points.length; i++)\nEvaluating balloon [${sorted[i][0]}, ${sorted[i][1]}] at index ${i}.`, 6, { points: sorted, arrows, prevEnd, i, burst: new Set(burst), isEvaluating: i });

            let currStart = sorted[i][0];
            let currEnd = sorted[i][1];
            let needsNewArrow = currStart > prevEnd;

            add("Overlap Check", `if (points[i][0] > prevEnd)\nDoes current start (${currStart}) > previous arrow (${prevEnd})? (${needsNewArrow ? 'Yes, needs new arrow' : 'No, overlaps'})`, 7, { points: sorted, arrows, prevEnd, i, burst: new Set(burst), isEvaluating: i, hlCheck: true, needsNewArrow });

            if (needsNewArrow) {
                arrows++;
                prevEnd = currEnd;
                burst.add(i);
                add("Shoot New Arrow", `arrows++;\nprevEnd = points[i][1];\nShooting new arrow at ${prevEnd}. Total arrows: ${arrows}.`, 9, { points: sorted, arrows, prevEnd, i, burst: new Set(burst), hlShoot: true });
            } else {
                burst.add(i);
                add("Burst by Current Arrow", `// Implicit Else\nBalloon overlaps with current arrow at ${prevEnd}. No new arrow needed.`, 7, { points: sorted, arrows, prevEnd, i, burst: new Set(burst), hlBurst: true });
            }
        }

        // Line 12
        add("Return Result", `return arrows;\nFinished scanning. Total arrows needed: ${arrows}.`, 12, { points: sorted, arrows, prevEnd, burst: new Set(burst), isSuccess: true, finalAns: arrows });
    }

    return steps;
  }, [basePoints, selectedOpId]);

  // Derived state
  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  // --- Calculations for Timeline Graphics ---
  const timelineStats = useMemo(() => {
      let points = st.points || basePoints;
      if (!points || points.length === 0) return { min: 0, max: 10, span: 10 };
      
      let minStart = Math.min(...points.map(i => i[0]));
      let maxEnd = Math.max(...points.map(i => i[1]));
      
      // Add padding
      minStart -= 2;
      maxEnd += 2;
      
      let span = maxEnd - minStart;
      if (span === 0) span = 1;

      // Generate tick marks (limit them so they don't overlap if span is huge)
      let ticks = [];
      let tickStep = Math.ceil(span / 15);
      if (tickStep === 0) tickStep = 1;

      for (let i = minStart; i <= maxEnd; i += tickStep) {
          ticks.push(i);
      }

      return { min: minStart, max: maxEnd, span, ticks };
  }, [st.points, basePoints]);

  const getLeftPct = (val: number) => {
      return ((val - timelineStats.min) / timelineStats.span) * 100;
  }
  const getWidthPct = (start: number, end: number) => {
      return ((end - start) / timelineStats.span) * 100;
  }

  // --- UI Handlers ---
  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 0, y: 0 }); 
    setZoom(0.85); 
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

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => { 
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

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

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

  const renderVisuals = () => {
      if (st.points === undefined) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-6 px-4 pb-12">
              
              {/* Meta Data Panel */}
              <div className="flex flex-col lg:flex-row items-center w-full max-w-4xl gap-6 pointer-events-auto">
                  <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-lg flex-1 flex items-center justify-between w-full">
                       <div className="flex flex-col">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Variables Tracker</span>
                           <span className="text-xl font-black text-slate-700 font-mono">prevEnd = <span className="text-sky-500">{st.prevEnd !== undefined ? st.prevEnd : 'null'}</span></span>
                       </div>
                       {st.hlShoot && <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded text-xs font-bold animate-pulse">Arrow Shot</span>}
                  </div>
                  <div className="bg-slate-800 px-6 py-4 rounded-2xl border border-slate-700 shadow-xl flex-1 flex items-center justify-between w-full text-white">
                       <div className="flex flex-col">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Arrows Shot</span>
                           <span className="text-xl font-black text-emerald-400 font-mono">arrows = {st.arrows !== undefined ? st.arrows : 0}</span>
                       </div>
                       {st.hlShoot && <span className="bg-emerald-500 text-white px-3 py-1 rounded text-xs font-bold animate-in slide-in-from-bottom-2">+1 Arrow</span>}
                  </div>
              </div>

              {/* Timeline Container */}
              <div className="w-full max-w-5xl bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden mt-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-6 text-slate-500 flex items-center gap-2`}><AlignStartHorizontal size={14}/> Balloon & Arrow Timeline</span>
                  
                  <div className="relative w-full mt-10" style={{ height: `${st.points.length * 45 + 50}px` }}>
                      
                      {/* Grid Lines (Ticks) */}
                      {timelineStats.ticks.map((tick: number) => (
                          <div key={`tick-${tick}`} className="absolute top-0 bottom-0 border-l border-slate-100 flex flex-col justify-end pointer-events-none" style={{ left: `${getLeftPct(tick)}%` }}>
                              <span className="absolute -bottom-6 -translate-x-1/2 text-[10px] font-mono text-slate-400 font-bold">{tick}</span>
                          </div>
                      ))}

                      {/* The Arrow (prevEnd) */}
                      {st.prevEnd !== undefined && (
                          <div className="absolute top-0 bottom-6 w-0.5 bg-rose-500 z-30 transition-all duration-700 ease-in-out flex flex-col items-center justify-start shadow-[0_0_10px_rgba(244,63,94,0.8)]" style={{ left: `${getLeftPct(st.prevEnd)}%` }}>
                              <div className="text-rose-500 absolute -top-8 animate-bounce">
                                  <ArrowDown size={24} strokeWidth={3}/>
                              </div>
                              <div className="bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-md absolute -bottom-5 whitespace-nowrap z-40">Arrow</div>
                          </div>
                      )}

                      {/* Balloons (Interval Blocks) */}
                      {st.points.map((point: number[], idx: number) => {
                          const start = point[0];
                          const end = point[1];
                          const left = getLeftPct(start);
                          const width = getWidthPct(start, end);
                          
                          let isEvaluating = st.isEvaluating === idx;
                          let isBurst = st.burst && st.burst.has(idx);
                          
                          // Styling logic
                          let bgClass = "bg-slate-200 border-slate-300 text-slate-600";
                          let opacityClass = "opacity-100";
                          let transformClass = `translateY(${idx * 45}px)`;
                          let zIndex = 10;

                          if (isEvaluating) {
                              bgClass = st.hlCheck && st.needsNewArrow ? "bg-amber-100 border-amber-400 text-amber-800 ring-4 ring-amber-200" : "bg-amber-100 border-amber-400 text-amber-800 ring-4 ring-amber-200";
                              zIndex = 20;
                              transformClass = `translateY(${idx * 45}px) scale(1.05)`;
                          } else if (isBurst) {
                              bgClass = "bg-emerald-100 border-emerald-500 text-emerald-800 shadow-md";
                          } else if (st.hlSort) {
                              // Just during sort highlight, make them pop slightly to show movement
                              bgClass = "bg-sky-100 border-sky-400 text-sky-800";
                          }

                          return (
                              <div 
                                  key={`inv-${idx}`}
                                  className={`absolute h-8 rounded-full border-2 flex items-center justify-center font-mono font-black text-sm shadow-sm transition-all duration-700 ease-in-out overflow-hidden ${bgClass} ${opacityClass}`}
                                  style={{
                                      left: `${left}%`,
                                      width: `${width}%`,
                                      transform: transformClass,
                                      zIndex
                                  }}
                              >
                                  {/* Draw a little "tie" to make it look like a balloon */}
                                  <div className="absolute -left-1 w-2 h-2 bg-inherit border-inherit rotate-45 border-b-0 border-r-0"></div>
                                  <span className="relative z-10 px-2 bg-white/50 rounded text-[10px] md:text-xs">[{start}, {end}]</span>
                                  {st.hlBurst && isEvaluating && (
                                      <div className="absolute inset-0 bg-emerald-400/30 animate-pulse rounded-full"></div>
                                  )}
                              </div>
                          )
                      })}
                  </div>
              </div>

          </div>
      );
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-600`}>
                <Target className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Minimum Arrows to Burst Balloons</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Greedy Time Bounds
                  </span>
                  <span>•</span>
                  <span>LeetCode 452</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto scrollbar-none">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" themeColor={themeColor}/>
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" themeColor={themeColor}/>
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" themeColor={themeColor}/>
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" themeColor={themeColor}/>
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-4">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Target size={28}/> Maximize Arrow Efficiency</div>
                    <div className="text-lg leading-relaxed max-w-3xl">
                      There are some spherical balloons taped onto a flat wall that represents the XY-plane. The balloons are represented as a 2D integer array <code>points</code> where <code>points[i] = [xstart, xend]</code> denotes a balloon whose horizontal diameter stretches between xstart and xend.<br/><br/>
                      Arrows can be shot up directly vertically from the x-axis. An arrow shot at <code>x</code> bursts all balloons where <code>xstart &lt;= x &lt;= xend</code>. Find the minimum number of arrows that must be shot to burst all balloons.
                    </div>
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-nowrap`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Input: points = [[10,16],[2,8],[1,6],[7,12]]</span>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300">
                           2
                       </span>
                       <span className="text-slate-500 block mt-3 text-xs italic">
                           Explanation: <br/>
                           Shoot an arrow at x = 6, bursting the balloons [2,8] and [1,6].<br/>
                           Shoot another arrow at x = 11, bursting the balloons [10,16] and [7,12].
                       </span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-amber-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">This is mathematically isomorphic to "Non-overlapping Intervals". Finding the minimum number of arrows to pierce all overlapping balloons is exactly the same as finding the maximum size of a non-overlapping set of balloons.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Sort all balloons by their <strong>end coordinates</strong>. We greedily shoot our first arrow at the end coordinate of the first balloon (this covers the maximum possible distance to potentially hit other balloons). If the next balloon starts <em>after</em> our arrow's position, we are forced to shoot a new arrow at this new balloon's end coordinate.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-${op.theme}-600 text-white border-${op.theme}-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? `text-${op.theme}-100` : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[480px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> MinArrowShots.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 pb-10">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-1 w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Balloons Input (Max 10)</label>
                            <input type="text" value={pointsInput} onChange={(e) => setPointsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="[[10,16],[2,8],[1,6],[7,12]]" />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-8 py-3 bg-${themeColor}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> ALGORITHM COMPLETE</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Minimum arrows to burst all balloons: {st.finalAns}</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlSort || st.hlShoot || st.hlBurst ? `text-${themeColor}-400` : 'text-white'}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Layers size={14} className={`text-${themeColor}-500`}/> Time Space Render</span>
                   </div>

                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                        </div>
                   </div>

                   <div ref={!isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                       <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-300 flex flex-col justify-start items-center pt-8" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
                           {renderVisuals()}
                       </div>
                   </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-800 space-y-12">
                
                <div className="text-center space-y-4 max-w-3xl mx-auto mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-sky-100 text-sky-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Mastering Greedy Interval Selection and Integer Overflows.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Crosshair size={24} className="text-sky-500"/> 1. Why Sort by End Time?</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">To minimize the number of arrows, we must hit as many overlapping balloons as possible with a single arrow. Consider sorting by start time instead: <code>[1, 100], [2, 3], [4, 5]</code>.</p>
                        <p className="text-slate-600 leading-relaxed">If you sort by start time, you shoot an arrow through <code>[1, 100]</code>. But where? If you shoot it early, you miss <code>[4, 5]</code>. If you sort by <strong>end time</strong>, you are guaranteed that the balloon ending earliest is processed first. You shoot the arrow exactly at its end boundary, which maximizes the chances of piercing subsequent balloons.</p>
                    </div>

                    {/* Section 2 - TIME COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 2. Time Complexity: O(N log N)</h4>
                        <p className="mb-4 text-slate-600">The performance is bottlenecked entirely by the initial sorting step.</p>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Sorting:</strong> <code>Arrays.sort</code> in Java takes $O(N \log N)$ time.</li>
                            <li><strong>Iteration:</strong> We loop through the array exactly once, performing $O(1)$ comparisons at each step. This takes $O(N)$ time.</li>
                            <li><strong>Overall:</strong> $O(N \log N) + O(N)$ simplifies to $O(N \log N)$.</li>
                        </ul>
                    </div>

                    {/* Section 3 - SPACE COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-rose-500"/> 3. Space Complexity Analysis: O(1) or O(log N)</h4>
                        <p className="mb-4 text-slate-600">This depends on the language specification.</p>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div>
                                <strong className="text-slate-800 block mb-1">Auxiliary Variables: O(1) Constant</strong>
                                <span className="text-sm text-slate-600">We only use two integers (<code>arrows</code> and <code>prevEnd</code>) to track state.</span>
                            </div>
                            <div className="border-t border-slate-100 pt-4">
                                <strong className="text-slate-800 block mb-1">Sorting Overhead: O(log N)</strong>
                                <span className="text-sm text-slate-600">In Java, sorting an array of objects uses TimSort, which requires $O(N)$ space. In other languages (like C++ `std::sort`), it uses IntroSort which takes $O(\log N)$ stack space.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-emerald-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This problem is famous for containing a critical edge case that causes many people to fail on submission: Integer Overflow during the sorting phase."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q1: "Why do we use <code>Integer.compare(a[1], b[1])</code> instead of simply <code>a[1] - b[1]</code>?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "This prevents Integer Overflow, which is a classic trap in this LeetCode problem.</p>
                            <p>If <code>a[1]</code> is a very large positive number (e.g., $2^{31}-1$) and <code>b[1]</code> is a very large negative number (e.g., $-2^{31}$), subtracting them <code>a[1] - b[1]</code> results in a number mathematically larger than the maximum 32-bit integer. This causes the value to wrap around to a negative number, breaking the sort logic completely. <code>Integer.compare()</code> handles this safely."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "What is the difference between this problem and Non-Overlapping Intervals (LeetCode 435)?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Mathematically, they are isomorphic. LeetCode 435 asks you to find the minimum number of intervals to remove, which means maximizing the number of independent, non-overlapping intervals.</p>
                            <p>LeetCode 452 asks for the minimum arrows to pop all overlapping sets. An arrow represents exactly one independent interval space. Therefore, the minimum number of arrows required is exactly equal to the maximum number of non-overlapping intervals. The logic is identical."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><Activity size={24}/></span>
                            <span>Q3: "Notice the condition is <code>points[i][0] &gt; prevEnd</code>. Why strictly greater than?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The problem statement specifies that an arrow shot at $x$ bursts balloons where $xstart \le x \le xend$.</p>
                            <p>This means if a balloon ends exactly at $5$ and the next balloon begins exactly at $5$, a single arrow shot at $x = 5$ will pierce both of them. Because edges touching counts as an overlap in this specific problem, we only require a new arrow if the new balloon's start is strictly <em>greater than</em> our previous arrow's position."</p>
                        </div>
                    </div>

                </div>
            </div>
        )}

      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[450px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-50">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-${themeColor}-600 shadow-${themeColor}-900/50`}>
                              <Crosshair size={20}/>
                          </div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                  </div>
                  <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 pb-10">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4 overflow-x-hidden">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                        ))}
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlSort || st.hlShoot || st.hlBurst ? `text-${themeColor}-400` : 'text-white'}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? `bg-${op.theme}-600 text-white shadow-md` : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-80 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Balloons Input (Max 10)</label>
                              <input type="text" value={pointsInput} onChange={(e) => setPointsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="[[10,16],[2,8],[1,6],[7,12]]" />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={24}/></button>
                            <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-3 text-slate-600 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all`}><Minimize size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-50 flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 bg-${themeColor}-600 text-white rounded-[2rem] hover:bg-${themeColor}-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-${themeColor}-500 shadow-xl`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  <div ref={isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                      <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-500 flex flex-col justify-start items-center pt-24" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
                           {renderVisuals()}
                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                
                                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10"><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">COMPLETED</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Optimization Complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Final Answer</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed">{st.finalAns} Arrows</div>
                                </div>

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