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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, GitPullRequest, Leaf, Route, Map as MapIcon, Key, Eye, Sigma, MapPin as MapPinIcon, Target as TargetIcon, Search as SearchIcon, Bug, Clock as ClockIcon, Keyboard, AlignLeft, AlignRight, SplitSquareVertical, IterationCcw
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  bottomUpOptimized: {
    id: 'bottomUpOptimized',
    title: '1. Space-Optimized DP',
    icon: <IterationCcw size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    theme: 'emerald',
    code: `class Solution {
    public int minCostClimbingStairs(int[] cost) {
        int n = cost.length;
        int first = cost[0];
        int second = cost[1];
        
        for (int i = 2; i < n; i++) {
            int curr = cost[i] + Math.min(first, second);
            first = second;
            second = curr;
        }
        
        return Math.min(first, second);
    }
}`,
    desc: "The most memory-efficient approach. To calculate the minimum cost to reach step `i`, we only ever need the minimum cost to reach step `i-1` and `i-2`. Thus, we don't need a full `O(N)` array. We keep track of the `first` and `second` previous step costs, calculate `curr`, and then shift our window to the right. Finally, we return the minimum of the last two steps to reach the 'top' of the floor."
  },
  bottomUpArray: {
    id: 'bottomUpArray',
    title: '2. Array Bottom-Up DP',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    theme: 'sky',
    code: `class Solution {
    public int minCostClimbingStairs(int[] cost) {
        int n = cost.length;
        int[] dp = new int[n];
        dp[0] = cost[0];
        dp[1] = cost[1];
        
        for (int i = 2; i < n; i++) {
            dp[i] = cost[i] + Math.min(dp[i - 1], dp[i - 2]);
        }
        
        return Math.min(dp[n - 1], dp[n - 2]);
    }
}`,
    desc: "A standard Tabulation Dynamic Programming approach. We allocate an array `dp` where `dp[i]` represents the total accumulated minimum cost to reach and step ON step `i`. We seed the base cases `dp[0]` and `dp[1]` with their initial costs. Then, we loop through the array, pulling the minimum of the previous two steps and adding the current step's cost. Finally, the minimum of the last two `dp` elements represents stepping off the top."
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
  idPrefix?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'emerald', idPrefix = '' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|char|boolean|class|return|if|else|while|for|new|String|minCostClimbingStairs|Solution|cost|dp|n|first|second|curr|i|Math|min|length)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
  const activeStyles = { bg: `bg-${theme}-500/20`, border: `border-${theme}-500`, text: `text-${theme}-400` };
  
  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div id={`${idPrefix}code-line-${num}`} className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `${activeStyles.text} font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre 
        className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] whitespace-pre-wrap break-words ${active ? 'opacity-100' : 'opacity-60'}`}
        style={{ paddingLeft: `${leadingSpaces}ch`, textIndent: `-${leadingSpaces}ch` }}
      >
        {parts.map((part, idx) => {
            const trimmed = part.trim();
            if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
                return <span key={idx} className="text-slate-500 italic">{part}</span>;
            }
            
            const isKeyword = ['public', 'private', 'void', 'int', 'char', 'boolean', 'class', 'return', 'if', 'else', 'while', 'for', 'new'].includes(part);
            const isObject = ['String', 'Solution', 'Math'].includes(part);
            const isPointer = ['cost', 'dp', 'n', 'first', 'second', 'curr', 'i'].includes(part);
            const isMapCall = ['minCostClimbingStairs', 'min', 'length'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^', '{', '}'].includes(trimmed);
            
            return (
              <span 
                key={idx} 
                className={
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-emerald-400 font-bold' : 
                  isMapCall ? 'text-amber-300' :
                  isOperator ? 'text-slate-400 font-bold' :
                  isPointer ? `text-${theme}-300` : 
                  isNaN(parseInt(part)) && part.match(/^[a-zA-Z_]\w*$/) && !part.startsWith('"') && !part.startsWith("'") ? `text-${theme}-300` : 
                  (part.startsWith('"') || part.startsWith("'") ? 'text-emerald-300' : 'text-emerald-400')
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

export default function MinCostStairsVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('bottomUpOptimized');
  
  const [costInput, setCostInput] = useState('10, 15, 20');
  const [baseCost, setBaseCost] = useState<number[]>([10, 15, 20]);

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1); 
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const codeContainerMainRef = useRef<HTMLDivElement>(null);
  const codeContainerFullscreenRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  // --- Effects for Data Processing ---

  const parseCost = (str: string) => {
      let arr = str.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      if (arr.length < 2) arr = [10, 15, 20];
      if (arr.length > 20) arr = arr.slice(0, 20); // Cap for visual sanity
      return arr;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setBaseCost(parseCost(costInput));
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [costInput, selectedOpId]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = baseCost.length;
    if (n < 2) return [];

    if (selectedOpId === 'bottomUpOptimized') {
        let first = 0, second = 0, curr = 0;
        
        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { first, second, curr, ...st } 
        });

        add("Function Call", `public int minCostClimbingStairs(int[] cost)`, 2, { hlPhase: 'init' });
        
        add("Init Length", `int n = cost.length;`, 3, { hlPhase: 'init' });
        
        first = baseCost[0];
        add("Init First", `int first = cost[0];\nSetting first step cost to ${first}.`, 4, { hlPhase: 'initVars', first });
        
        second = baseCost[1];
        add("Init Second", `int second = cost[1];\nSetting second step cost to ${second}.`, 5, { hlPhase: 'initVars', first, second });

        for (let i = 2; i < n; i++) {
            add("Loop Condition", `for (int i = 2; i < n; i++)\nCalculating minimum cost to land on step ${i}.`, 7, { hlPhase: 'loop', i });
            
            let minPrev = Math.min(first, second);
            curr = baseCost[i] + minPrev;
            add("Calculate Curr", `int curr = cost[i] + Math.min(first, second);\nMin of prev two steps is ${minPrev}. Adding current step cost ${baseCost[i]} gives ${curr}.`, 8, { hlPhase: 'calc', i, minPrev, curr, costVal: baseCost[i] });

            first = second;
            add("Shift First", `first = second;\nSliding window right. 'first' pointer now holds ${first}.`, 9, { hlPhase: 'shiftFirst', i, first, second, curr });

            second = curr;
            add("Shift Second", `second = curr;\nSliding window right. 'second' pointer now holds ${second}.`, 10, { hlPhase: 'shiftSecond', i, first, second, curr });
        }

        let finalAns = Math.min(first, second);
        add("Return Result", `return Math.min(first, second);\nStepping off the top floor! Minimum cost is min(${first}, ${second}) = ${finalAns}.`, 13, { hlPhase: 'success', finalAns, first, second });
    } 
    else if (selectedOpId === 'bottomUpArray') {
        let dp: number[] = new Array(n).fill(0);

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { dp: [...dp], ...st } 
        });

        add("Function Call", `public int minCostClimbingStairs(int[] cost)`, 2, { hlPhase: 'init' });
        
        add("Init Variables", `int n = cost.length;\nint[] dp = new int[n];\nAllocating DP array of size ${n}.`, 3, { hlPhase: 'initArray' });
        
        dp[0] = baseCost[0];
        add("Seed Base Cases", `dp[0] = cost[0];\nBase case for step 0.`, 5, { hlPhase: 'seed0', dp: [...dp] });
        
        dp[1] = baseCost[1];
        add("Seed Base Cases", `dp[1] = cost[1];\nBase case for step 1.`, 6, { hlPhase: 'seed1', dp: [...dp] });

        for (let i = 2; i < n; i++) {
            add("Loop Condition", `for (int i = 2; i < n; i++)\nCalculating minimum accumulated cost to step on index ${i}.`, 8, { hlPhase: 'loop', i, dp: [...dp] });
            
            let minPrev = Math.min(dp[i-1], dp[i-2]);
            dp[i] = baseCost[i] + minPrev;
            add("Calculate & Store", `dp[i] = cost[i] + Math.min(dp[i - 1], dp[i - 2]);\nMin to reach step ${i} is min(${dp[i-1]}, ${dp[i-2]}) + cost[${i}](${baseCost[i]}) = ${dp[i]}.`, 9, { hlPhase: 'calc', i, minPrev, costVal: baseCost[i], dp: [...dp] });
        }

        let finalAns = Math.min(dp[n-1], dp[n-2]);
        add("Return Result", `return Math.min(dp[n - 1], dp[n - 2]);\nArray complete. We can step off the top from either index ${n-1} or ${n-2}. Min is ${finalAns}.`, 12, { hlPhase: 'success', finalAns, dp: [...dp] });
    }

    return steps;
  }, [baseCost, selectedOpId]);

  // Derived state
  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  // Auto-scroll code view to active line
  useEffect(() => {
    const prefix = isFullscreen ? 'fs-' : 'main-';
    const container = isFullscreen ? codeContainerFullscreenRef.current : codeContainerMainRef.current;
    
    if (!container) return;
    
    const activeLineEl = document.getElementById(`${prefix}code-line-${curStepData.line}`);
    if (activeLineEl) {
        const offsetTop = activeLineEl.offsetTop;
        container.scrollTo({ top: offsetTop - 60, behavior: 'smooth' });
    }
  }, [currentStep, curStepData.line, isFullscreen]);

  // --- UI Handlers ---
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

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('.scrollbar-thin')) return;
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

  const renderActiveDashboard = () => {
      if (st.finalAns !== undefined) return null;

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlPhase === 'calc' ? 'border-amber-400 ring-4 ring-amber-100 scale-105' : `border-${themeColor}-200`}`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Activity size={14}/> Math Inspector</span>
              
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                  
                  <div className="flex flex-col items-center min-w-[80px]">
                      <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'loop' ? `text-${themeColor}-500` : 'text-slate-400'}`}>Current i</span>
                      <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.hlPhase === 'loop' ? `bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-900 shadow-md scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                          {st.i !== undefined ? st.i : '?'}
                      </div>
                  </div>

                  <div className="w-px h-12 bg-slate-200 hidden md:block"></div>

                  <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center min-w-[70px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-emerald-500`}>Cost[i]</span>
                          <div className={`border-2 text-2xl font-black px-4 py-2 rounded-xl transition-all duration-300 bg-slate-50 border-slate-300 text-slate-700`}>
                              {st.costVal !== undefined ? st.costVal : '?'}
                          </div>
                      </div>
                      <span className="text-xl font-bold text-slate-400">+</span>
                      <div className="flex flex-col items-center min-w-[70px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-emerald-500`}>Min Prev</span>
                          <div className={`border-2 text-2xl font-black px-4 py-2 rounded-xl transition-all duration-300 bg-slate-50 border-slate-300 text-slate-700`}>
                              {st.minPrev !== undefined ? st.minPrev : '?'}
                          </div>
                      </div>
                      
                      <ArrowRight size={24} className={st.hlPhase === 'calc' ? `text-amber-500 animate-pulse` : "text-slate-300"}/>
                      
                      <div className="flex flex-col items-center min-w-[80px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'calc' ? `text-amber-500` : 'text-slate-400'}`}>{selectedOpId === 'bottomUpOptimized' ? 'Curr' : 'DP[i]'}</span>
                          <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.hlPhase === 'calc' ? `bg-amber-100 border-amber-500 text-amber-900 shadow-md scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                              {(st.curr !== undefined && st.curr !== 0) ? st.curr : (st.dp && st.i && st.dp[st.i] !== 0 ? st.dp[st.i] : '?')}
                          </div>
                      </div>
                  </div>

              </div>
          </div>
      );
  }

  const renderVisuals = () => {
      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Active State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40">
                  {renderActiveDashboard()}
              </div>

              {/* Graphical Visualizer */}
              <div className="flex flex-col items-center justify-center relative w-full mt-4 max-w-6xl pointer-events-none">
                  
                  {selectedOpId === 'bottomUpOptimized' ? (
                      <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-center`} style={{ minHeight: `300px` }}>
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute top-0 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><IterationCcw size={12} className="inline mr-1"/> Sliding Window Memory</span>
                          
                          <div className="flex flex-col items-center w-full max-w-3xl mt-12 gap-8">
                              <div className="flex items-center justify-center gap-8 w-full relative">
                                  {/* Pointers rendering */}
                                  {['first', 'second', 'curr'].map((vName, idx) => {
                                      let val = st[vName];
                                      let isShifting = (vName === 'first' && st.hlPhase === `shiftFirst`) || (vName === 'second' && st.hlPhase === `shiftSecond`);
                                      let isCalc = st.hlPhase === 'calc' && vName === 'curr';

                                      return (
                                          <div key={`ptr-${vName}`} className="flex flex-col items-center relative z-20">
                                              <div className={`w-20 h-20 md:w-24 md:h-24 flex flex-col items-center justify-center border-4 rounded-2xl transition-all duration-300 shadow-xl ${isShifting ? 'bg-rose-100 border-rose-500 text-rose-900 scale-110' : (isCalc ? 'bg-amber-100 border-amber-500 text-amber-950 scale-110 ring-4 ring-amber-200' : 'bg-white border-slate-300 text-slate-700')}`}>
                                                  <span className="font-mono font-black text-2xl md:text-3xl">{val !== undefined ? val : '?'}</span>
                                              </div>
                                              <span className={`text-sm font-bold font-mono mt-2 uppercase tracking-widest ${isShifting ? 'text-rose-500' : 'text-slate-500'}`}>{vName}</span>
                                          </div>
                                      );
                                  })}
                              </div>

                              {/* Shift Arrows (Visual Only) */}
                              <div className="absolute top-0 inset-x-0 w-full h-full pointer-events-none -z-10">
                                  <svg className="w-full h-full overflow-visible">
                                      <defs>
                                        <marker id="arrow-shift" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                                        </marker>
                                      </defs>
                                      {st.hlPhase === 'shiftFirst' && <path d="M 50% 60 Q 40% 100 35% 60" fill="none" stroke="#f43f5e" strokeWidth="4" strokeDasharray="4 4" markerEnd="url(#arrow-shift)" className="animate-pulse" />}
                                      {st.hlPhase === 'shiftSecond' && <path d="M 65% 60 Q 60% 100 50% 60" fill="none" stroke="#f43f5e" strokeWidth="4" strokeDasharray="4 4" markerEnd="url(#arrow-shift)" className="animate-pulse" />}
                                  </svg>
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-center`} style={{ minHeight: `300px` }}>
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute top-0 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><ListOrdered size={12} className="inline mr-1"/> DP Array Tracking</span>
                          
                          <div className="flex flex-col items-center gap-4 mt-8 px-4 max-w-5xl w-full">
                              {/* DP Array */}
                              <div className="flex items-end gap-2 w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 pb-4">
                                  {st.dp && st.dp.map((val: number, idx: number) => {
                                      let isCalculated = val !== 0 || idx === 0;
                                      let isCurrentlyCalculating = st.hlPhase === 'calc' && idx === st.i;
                                      let isSourceCell = st.hlPhase === 'calc' && st.i !== undefined && (idx === st.i - 1 || idx === st.i - 2);
                                      
                                      let cellClass = "bg-white border-slate-300 text-slate-700";
                                      if (isCurrentlyCalculating) cellClass = "bg-amber-400 border-amber-600 text-amber-950 shadow-xl scale-125 z-20 ring-4 ring-amber-200";
                                      else if (isSourceCell) cellClass = "bg-emerald-100 border-emerald-500 text-emerald-900 shadow-md scale-110 z-10 ring-2 ring-emerald-300";
                                      else if (!isCalculated) cellClass = "bg-slate-100 border-slate-200 text-slate-300 opacity-60";
                                      else if (isCalculated) cellClass = "bg-sky-50 border-sky-300 text-sky-800 shadow-sm";

                                      return (
                                          <div key={`col-${idx}`} className="flex flex-col items-center gap-2 shrink-0">
                                              {/* DP Value */}
                                              <div className="flex flex-col items-center gap-1 relative">
                                                  {isCurrentlyCalculating && (
                                                      <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-amber-500 text-white px-1.5 rounded shadow-lg animate-pulse`}>
                                                          dp[i]
                                                      </span>
                                                  )}
                                                  <div className={`flex items-center justify-center w-12 h-12 border-2 rounded-xl transition-all duration-300 font-mono text-base font-black ${cellClass}`}>
                                                      {isCalculated ? val : ''}
                                                  </div>
                                              </div>
                                              {/* Cost Value (Input) */}
                                              <div className="w-10 py-1 bg-slate-800 text-slate-300 text-center rounded text-[10px] font-mono border border-slate-700">
                                                  {baseCost[idx]}
                                              </div>
                                              <span className="text-[9px] font-bold text-slate-400 font-mono opacity-80">step {idx}</span>
                                          </div>
                                      );
                                  })}

                                  {/* Virtual 'TOP' Step */}
                                  <div className="flex flex-col items-center gap-2 shrink-0 ml-4 opacity-70">
                                       <div className={`flex items-center justify-center w-12 h-12 border-2 border-dashed border-rose-300 bg-rose-50 text-rose-500 rounded-xl transition-all duration-300 font-mono text-[10px] font-black ${st.isSuccess ? 'bg-emerald-100 border-solid border-emerald-500 text-emerald-900 scale-110 ring-4 ring-emerald-200 shadow-lg opacity-100' : ''}`}>
                                           {st.isSuccess ? st.finalAns : 'TOP'}
                                       </div>
                                       <div className="w-10 py-1 bg-transparent text-slate-400 text-center rounded text-[10px] font-mono">
                                            -
                                       </div>
                                       <span className="text-[9px] font-bold text-rose-400 font-mono">goal</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}

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
                <TrendingUp className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Min Cost Climbing Stairs</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Dynamic Programming
                  </span>
                  <span>•</span>
                  <span>LeetCode 746</span>
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
                <section className="space-y-6">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><TrendingUp size={28}/> Reaching the Top Floor</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are given an integer array <code>cost</code> where <code>cost[i]</code> is the cost of <code>i</code>th step on a staircase. Once you pay the cost, you can either climb one or two steps.</p>
                        <p>You can either start from the step with index <code>0</code>, or the step with index <code>1</code>.</p>
                        <p className="font-bold mt-4">Return the minimum cost to reach the top of the floor.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-4`}>
                        <div className="w-full space-y-2">
                            <span className={`text-${themeColor}-400 block uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                            <div className="text-slate-300 break-all space-y-1">
                                <p><strong>Input:</strong> cost = [10, 15, 20]</p>
                                <p><strong>Output:</strong> 15</p>
                                <p><strong>Explanation:</strong><br/>
                                You will start at index 1.<br/>
                                - Pay 15 and climb two steps to reach the top.<br/>
                                The total cost is 15.</p>
                            </div>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-4 mt-4`}>
                        <div className="w-full space-y-2">
                            <span className={`text-${themeColor}-400 block uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                            <div className="text-slate-300 break-all space-y-1">
                                <p><strong>Input:</strong> cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]</p>
                                <p><strong>Output:</strong> 6</p>
                                <p><strong>Explanation:</strong><br/>
                                You will start at index 0.<br/>
                                - Pay 1 and climb two steps to reach index 2.<br/>
                                - Pay 1 and climb two steps to reach index 4.<br/>
                                - Pay 1 and climb two steps to reach index 6.<br/>
                                - Pay 1 and climb one step to reach index 7.<br/>
                                - Pay 1 and climb two steps to reach index 9.<br/>
                                - Pay 1 and climb one step to reach the top.<br/>
                                The total cost is 6.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>2 &le; cost.length &le; 1000</li>
                            <li>0 &le; cost[i] &le; 999</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-sky-500"/> The Core Insight</h4>
                        <p className="text-sm leading-relaxed">This is a minimization problem with overlapping subproblems. To know the cheapest way to reach step 10, you must know the cheapest way to reach step 9 and step 8, because those are the only two places you can jump from. This perfect dependency on smaller identical problems makes it a classic Dynamic Programming problem.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2"><strong>1. Array DP:</strong> We can build an array <code>dp</code> where <code>dp[i]</code> holds the minimum total cost to reach step <code>i</code>. We calculate it via <code>dp[i] = cost[i] + min(dp[i-1], dp[i-2])</code>.</p>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>2. Space-Optimized Variables:</strong> Notice that step <code>i</code> only cares about <code>i-1</code> and <code>i-2</code>. Once we calculate step 10, we completely throw away the data for step 7. By just keeping two variables (<code>first</code> and <code>second</code>), we can compress memory usage from $O(N)$ down to $O(1)$.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-${op.theme}-600 text-white border-${op.theme}-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? `text-${op.theme}-100` : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[480px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div ref={codeContainerMainRef} className="p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 pb-10 flex-1 scroll-smooth">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} idPrefix="main-"/>
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4 relative">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Cost Array Input</label>
                            <input type="text" value={costInput} onChange={(e) => setCostInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="10, 15, 20" />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.finalAns !== undefined} className={`px-8 py-3 bg-${themeColor}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.finalAns !== undefined ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.finalAns !== undefined ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-emerald-400`}>
                                <PartyPopper size={24}/> CALCULATION COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Minimum cost to reach the top floor is {String(st.finalAns)}.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'calc' ? 'text-amber-400' : (st.hlPhase === 'shiftFirst' || st.hlPhase === 'shiftSecond' ? 'text-rose-400' : (st.hlPhase === 'loop' || st.hlPhase === 'initVars' || st.hlPhase === 'initArray' ? `text-${themeColor}-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-slate-100 rounded-[2.5rem] border border-slate-300 p-2 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   
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
                    <div className={`inline-flex items-center justify-center p-4 bg-${themeColor}-100 text-${themeColor}-600 rounded-2xl mb-2`}>
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Mastering 1D Dynamic Programming and Recurrence Relations.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-emerald-500"/> 1. The Recurrence Relation</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Dynamic Programming solves large problems by breaking them into overlapping subproblems. Here, the minimum cost to reach step <code>i</code> is strictly defined by the formula: <code>DP[i] = cost[i] + min(DP[i-1], DP[i-2])</code>. This equation tells the computer how to build the solution bottom-up without redundant calculations.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Network size={24} className="text-sky-500"/> 2. The "Top Floor" Trap</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">A very common trap in this problem is returning <code>DP[N-1]</code>. However, the problem asks for the cost to reach the <strong>top of the floor</strong>, which means stepping <em>past</em> the final step in the array. Since you can jump from index <code>N-1</code> or index <code>N-2</code>, the final answer is <code>min(DP[N-1], DP[N-2])</code>.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> 3. Space Optimization</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Notice that calculating <code>curr</code> NEVER requires looking at <code>i - 3</code> or earlier. The historical data becomes useless! By simply keeping two temporary variables (<code>first</code> and <code>second</code>) and sliding them forward, we eliminate the need for the array entirely, dropping space complexity to $O(1)$.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className={`text-${themeColor}-400`}/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a phenomenal 'warm-up' DP question. Interviewers use it to see if you instinctively reach for the space-optimized solution rather than wasting memory on a full array."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we modify the original <code>cost</code> array instead of creating a <code>dp</code> array?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, we can do an in-place modification to achieve O(1) space.</p>
                            <p>We could simply overwrite <code>cost[i] += Math.min(cost[i-1], cost[i-2])</code>. This saves memory, but in production environments, mutating input variables is often considered a bad practice (side effects). Using two variables (<code>first</code>, <code>second</code>) achieves the same $O(1)$ space complexity while keeping the input pristine."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "What if we were asked to return the actual path we took, not just the cost?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "We would need the full DP array and a backpointer array.</p>
                            <p>We couldn't use the $O(1)$ space optimization. We would need an array <code>parent[i]</code> that stores whether we came from <code>i-1</code> or <code>i-2</code>. Once we calculate the minimum cost at the top, we trace backward through the <code>parent</code> array to reconstruct the exact steps we took."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "Why do we initialize DP with <code>dp[0] = cost[0]</code> instead of 0?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because stepping ON a stair forces you to pay its cost.</p>
                            <p>The problem states you can start at step 0 or 1 (paying their respective costs) and THEN jump. Therefore, the absolute minimum cost to 'clear' step 0 is paying its toll, making <code>dp[0] = cost[0]</code> the mathematically correct base case."</p>
                        </div>
                    </div>

                </div>
            </div>
        )}

      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[480px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-50 shrink-0">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md shrink-0">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-${themeColor}-600 shadow-${themeColor}-900/50`}>
                              {selectedOp.icon}
                          </div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                  </div>
                  
                  {/* Fixed Explanation Box */}
                  <div className={`m-5 p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden shrink-0 ${st.finalAns !== undefined ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                      <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                          <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                          <div className="flex gap-2 items-center">
                              <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                          </div>
                      </div>
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'calc' ? 'text-amber-400' : (st.hlPhase === 'shiftFirst' || st.hlPhase === 'shiftSecond' ? 'text-rose-400' : (st.hlPhase === 'loop' || st.hlPhase === 'initVars' || st.hlPhase === 'initArray' ? `text-${themeColor}-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                      <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                  </div>

                  {/* Scrollable Code Box */}
                  <div className="flex-1 overflow-x-hidden overflow-y-auto px-5 pb-10 relative scroll-smooth scrollbar-thin scrollbar-thumb-slate-700" ref={codeContainerFullscreenRef}>
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 relative">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} idPrefix="fs-"/>
                        ))}
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-slate-100 overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  {/* Floating Context Panel for Fullscreen */}
                  {st.finalAns === undefined && (
                      <div className="absolute bottom-10 left-10 z-50 pointer-events-auto animate-in slide-in-from-bottom-10 w-full max-w-sm">
                           <div className={`w-full flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 border-slate-200`}>
                               <div className="flex justify-between items-center mb-2">
                                   <span className={`text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2`}>
                                       <Activity size={14}/> Loop Step
                                   </span>
                               </div>
                               <div className="flex gap-2 min-h-[40px] items-center overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 pb-2 items-center justify-center">
                                    <span className="font-mono text-4xl font-black text-slate-700">i = {st.i !== undefined ? st.i : '?'}</span>
                               </div>
                          </div>
                      </div>
                  )}

                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? `bg-${themeColor}-600 text-white shadow-md` : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title.split('.')[1].trim()}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Cost Array Input</label>
                              <input type="text" value={costInput} onChange={(e) => setCostInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder='10, 15, 20' />
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
                  
                  {st.finalAns === undefined && (
                      <div className="absolute bottom-10 right-10 z-50 flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.finalAns !== undefined} className={`px-12 py-6 bg-${themeColor}-600 text-white rounded-[2rem] hover:bg-${themeColor}-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-${themeColor}-500 shadow-xl`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  <div ref={isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                      <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-500 flex flex-col justify-start items-center pt-24" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
                           {renderVisuals()}
                       </div>
                  </div>
                  {st.finalAns !== undefined && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                
                                <div className={`w-24 h-24 bg-emerald-500/20 text-emerald-500 ring-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4`}>
                                    <Trophy size={48}/>
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">CALCULATION COMPLETE</h2>
                                <p className={`text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2`}>Mathematical Answer</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center justify-center gap-4 max-w-full px-4 text-center">
                                        Min Cost = {String(st.finalAns)}
                                    </div>
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