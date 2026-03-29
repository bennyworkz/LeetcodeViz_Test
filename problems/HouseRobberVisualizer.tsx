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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, GitPullRequest, Leaf, Route, Map as MapIcon, Key, Eye, Sigma, MapPin as MapPinIcon, Target as TargetIcon, Search as SearchIcon, Bug, Clock as ClockIcon, Keyboard, AlignLeft, AlignRight, SplitSquareVertical, IterationCcw, Home
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
    public int rob(int[] nums) {
        if (nums.length == 0) return 0;
        int prev2 = 0;
        int prev1 = 0;
        
        for (int i = 0; i < nums.length; i++) {
            int curr = Math.max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = curr;
        }
        
        return prev1;
    }
}`,
    desc: "The most memory-efficient approach. To calculate the maximum loot up to house `i`, we only ever need to know the maximum loot up to house `i-1` and `i-2`. Thus, we don't need a full `O(N)` array. We keep track of `prev1` (the max loot if we skip the current house) and `prev2` (the max loot up to two houses ago). We calculate `curr`, and then shift our window to the right."
  },
  bottomUpArray: {
    id: 'bottomUpArray',
    title: '2. Array Bottom-Up DP',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    theme: 'sky',
    code: `class Solution {
    public int rob(int[] nums) {
        if (nums.length == 0) return 0;
        if (nums.length == 1) return nums[0];
        
        int[] dp = new int[nums.length];
        dp[0] = nums[0];
        dp[1] = Math.max(nums[0], nums[1]);
        
        for (int i = 2; i < nums.length; i++) {
            dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
        }
        
        return dp[nums.length - 1];
    }
}`,
    desc: "A standard Tabulation Dynamic Programming approach. We allocate an array `dp` where `dp[i]` represents the absolute maximum loot we can have after considering house `i`. We seed the base cases: `dp[0]` is just the first house. `dp[1]` is the max of the first two. Then, we loop through the array. At each step, we choose between: skipping house `i` (taking `dp[i-1]`) OR robbing house `i` (taking `dp[i-2] + nums[i]`)."
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
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|char|boolean|class|return|if|else|while|for|new|String|rob|Solution|nums|dp|prev1|prev2|curr|i|Math|max|length)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
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
            const isPointer = ['nums', 'dp', 'prev1', 'prev2', 'curr', 'i'].includes(part);
            const isMapCall = ['rob', 'max', 'length'].includes(part);
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

export default function HouseRobberVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('bottomUpOptimized');
  
  const [numsInput, setNumsInput] = useState('2, 7, 9, 3, 1');
  const [baseNums, setBaseNums] = useState<number[]>([2, 7, 9, 3, 1]);

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

  const parseNums = (str: string) => {
      let arr = str.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      if (arr.length < 1) arr = [2, 7, 9, 3, 1];
      if (arr.length > 20) arr = arr.slice(0, 20); // Cap for visual sanity
      return arr;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setBaseNums(parseNums(numsInput));
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [numsInput, selectedOpId]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = baseNums.length;
    if (n === 0) return [];

    if (selectedOpId === 'bottomUpOptimized') {
        let prev2 = 0, prev1 = 0, curr = 0;
        
        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { prev2, prev1, curr, ...st } 
        });

        add("Function Call", `public int rob(int[] nums)`, 2, { hlPhase: 'init' });
        
        add("Length Check", `if (nums.length == 0) return 0;`, 3, { hlPhase: 'check0' });
        
        add("Init Pointers", `int prev2 = 0;\nint prev1 = 0;`, 4, { hlPhase: 'initVars' });

        for (let i = 0; i < n; i++) {
            add("Loop Execution", `for (int i = 0; i < nums.length; i++)\nArriving at house ${i} (Value: $${baseNums[i]}).`, 7, { hlPhase: 'loop', i });
            
            let robOpt = prev2 + baseNums[i];
            let skipOpt = prev1;
            curr = Math.max(skipOpt, robOpt);
            
            add("Evaluate Choice", `int curr = Math.max(prev1, prev2 + nums[i]);\nOption A (Skip): Keep prev1 ($${skipOpt}).\nOption B (Rob): prev2 ($${prev2}) + House[${i}] ($${baseNums[i]}) = $${robOpt}.\nMax is $${curr}.`, 8, { hlPhase: 'calc', i, robOpt, skipOpt, curr, costVal: baseNums[i] });

            prev2 = prev1;
            add("Shift Prev2", `prev2 = prev1;\nWindow slides. 'prev2' takes the old value of 'prev1' ($${prev2}).`, 9, { hlPhase: 'shiftPrev2', i });

            prev1 = curr;
            add("Shift Prev1", `prev1 = curr;\nWindow slides. 'prev1' updates to our newly calculated max ($${prev1}).`, 10, { hlPhase: 'shiftPrev1', i });
        }

        add("Return Result", `return prev1;\nFinished all houses. The maximum accumulated loot is $${prev1}.`, 13, { hlPhase: 'success', finalAns: prev1 });
    } 
    else if (selectedOpId === 'bottomUpArray') {
        let dp: number[] = new Array(n).fill(0);

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { dp: [...dp], ...st } 
        });

        add("Function Call", `public int rob(int[] nums)`, 2, { hlPhase: 'init' });
        
        add("Length Check", `if (nums.length == 0) return 0;`, 3, { hlPhase: 'check0' });
        
        add("Length Check 1", `if (nums.length == 1) return nums[0];\nChecking if there's only 1 house.`, 4, { hlPhase: 'check1' });
        if (n === 1) {
            add("Return Base Case", `return nums[0];\nOnly 1 house! Rob it and return $${baseNums[0]}.`, 4, { hlPhase: 'success', finalAns: baseNums[0], dp: [baseNums[0]] });
            return steps;
        }

        add("Init Array", `int[] dp = new int[nums.length];\nAllocating a DP array of size ${n}.`, 6, { hlPhase: 'initArray' });
        
        dp[0] = baseNums[0];
        add("Seed DP[0]", `dp[0] = nums[0];\nMax loot for just house 0 is $${dp[0]}.`, 7, { hlPhase: 'seed0', dp: [...dp] });
        
        dp[1] = Math.max(baseNums[0], baseNums[1]);
        add("Seed DP[1]", `dp[1] = Math.max(nums[0], nums[1]);\nFor house 0 and 1, we rob the richest one: max($${baseNums[0]}, $${baseNums[1]}) = $${dp[1]}.`, 8, { hlPhase: 'seed1', dp: [...dp] });

        for (let i = 2; i < n; i++) {
            add("Loop Execution", `for (int i = 2; i < nums.length; i++)\nArriving at house ${i} (Value: $${baseNums[i]}).`, 10, { hlPhase: 'loop', i, dp: [...dp] });
            
            let robOpt = dp[i-2] + baseNums[i];
            let skipOpt = dp[i-1];
            dp[i] = Math.max(skipOpt, robOpt);
            
            add("Calculate & Store", `dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);\nSkip: dp[${i-1}] = $${skipOpt}.\nRob: dp[${i-2}] ($${dp[i-2]}) + $${baseNums[i]} = $${robOpt}.\nStored max ($${dp[i]}) in dp[${i}].`, 11, { hlPhase: 'calc', i, robOpt, skipOpt, costVal: baseNums[i], dp: [...dp] });
        }

        let finalAns = dp[n-1];
        add("Return Result", `return dp[nums.length - 1];\nArray complete. The maximum loot is at the last index: $${finalAns}.`, 14, { hlPhase: 'success', finalAns, dp: [...dp] });
    }

    return steps;
  }, [baseNums, selectedOpId]);

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

      let decidedToRob = st.hlPhase === 'calc' && st.robOpt !== undefined && st.skipOpt !== undefined && st.robOpt > st.skipOpt;
      let decidedToSkip = st.hlPhase === 'calc' && st.robOpt !== undefined && st.skipOpt !== undefined && st.robOpt <= st.skipOpt;

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlPhase === 'calc' ? 'border-amber-400 ring-4 ring-amber-100 scale-105' : `border-${themeColor}-200`}`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Activity size={14}/> Dynamic Programming Evaluator</span>
              
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                  
                  <div className="flex flex-col items-center min-w-[80px]">
                      <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'loop' ? `text-${themeColor}-500` : 'text-slate-400'}`}>Current House</span>
                      <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.hlPhase === 'loop' ? `bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-900 shadow-md scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                          {st.i !== undefined ? `i=${st.i}` : '?'}
                      </div>
                  </div>

                  <div className="w-px h-12 bg-slate-200 hidden md:block"></div>

                  <div className="flex items-center gap-2 md:gap-4">
                      
                      {/* Rob Option */}
                      <div className="flex flex-col items-center min-w-[100px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${decidedToRob ? 'text-emerald-500' : 'text-slate-400'}`}>Opt A: ROB IT</span>
                          <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${decidedToRob ? 'bg-emerald-100 border-emerald-500 text-emerald-800 scale-105 shadow-md' : 'bg-slate-50 border-slate-300 text-slate-600 opacity-60'}`}>
                              <span>{st.robOpt !== undefined ? `$${st.robOpt}` : '?'}</span>
                              {decidedToRob && <CheckCircle2 size={16} className="text-emerald-600"/>}
                          </div>
                      </div>
                      
                      <span className="text-xl font-bold text-slate-400 font-sans">vs</span>
                      
                      {/* Skip Option */}
                      <div className="flex flex-col items-center min-w-[100px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${decidedToSkip ? 'text-emerald-500' : 'text-slate-400'}`}>Opt B: SKIP IT</span>
                          <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${decidedToSkip ? 'bg-emerald-100 border-emerald-500 text-emerald-800 scale-105 shadow-md' : 'bg-slate-50 border-slate-300 text-slate-600 opacity-60'}`}>
                              <span>{st.skipOpt !== undefined ? `$${st.skipOpt}` : '?'}</span>
                              {decidedToSkip && <CheckCircle2 size={16} className="text-emerald-600"/>}
                          </div>
                      </div>
                      
                      <ArrowRight size={24} className={st.hlPhase === 'calc' ? `text-amber-500 animate-pulse` : "text-slate-300"}/>
                      
                      {/* Max Chosen */}
                      <div className="flex flex-col items-center min-w-[100px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'calc' ? `text-amber-500` : 'text-slate-400'}`}>{selectedOpId === 'bottomUpOptimized' ? 'Next Max' : 'DP[i] Max'}</span>
                          <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.hlPhase === 'calc' ? `bg-amber-100 border-amber-500 text-amber-900 shadow-md scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                              {st.hlPhase === 'calc' ? `$${Math.max(st.robOpt, st.skipOpt)}` : '?'}
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
                      <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-center`} style={{ minHeight: `350px` }}>
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute top-0 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><IterationCcw size={12} className="inline mr-1"/> Sliding Window Memory</span>
                          
                          <div className="flex flex-col items-center w-full max-w-5xl mt-12 gap-8 px-4">
                              
                              {/* Sliding Memory Trackers */}
                              <div className="flex items-center justify-center gap-8 w-full relative mb-4">
                                  {['prev2', 'prev1'].map((vName, idx) => {
                                      let val = st[vName];
                                      let isShifting = (vName === 'prev2' && st.hlPhase === `shiftPrev2`) || (vName === 'prev1' && st.hlPhase === `shiftPrev1`);

                                      return (
                                          <div key={`ptr-${vName}`} className="flex flex-col items-center relative z-20">
                                              <div className={`w-24 h-20 md:w-32 md:h-24 flex flex-col items-center justify-center border-4 rounded-2xl transition-all duration-300 shadow-xl ${isShifting ? 'bg-amber-100 border-amber-500 text-amber-900 scale-110 ring-4 ring-amber-200' : 'bg-slate-800 border-slate-900 text-white'}`}>
                                                  <span className="font-mono font-black text-2xl md:text-3xl">{val !== undefined ? `$${val}` : '?'}</span>
                                              </div>
                                              <span className={`text-xs font-black font-mono mt-2 uppercase tracking-widest ${isShifting ? 'text-amber-500' : 'text-slate-500'}`}>{vName}</span>
                                          </div>
                                      );
                                  })}
                              </div>

                              {/* House Array Rendering */}
                              <div className="flex items-end justify-center gap-3 w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 pb-4">
                                  {baseNums.map((val: number, idx: number) => {
                                      let isCurrentlyCalculating = st.i === idx;
                                      let isPrev1 = st.i !== undefined && idx === st.i - 1;
                                      let isPrev2 = st.i !== undefined && idx === st.i - 2;
                                      
                                      let houseClass = "bg-slate-100 border-slate-300 text-slate-400"; // Future/Past houses
                                      let iconColor = "text-slate-300";
                                      
                                      if (isCurrentlyCalculating) {
                                          houseClass = "bg-amber-100 border-amber-500 text-amber-900 scale-110 z-20 shadow-xl ring-4 ring-amber-200";
                                          iconColor = "text-amber-500";
                                      } else if (isPrev1) {
                                          houseClass = "bg-sky-50 border-sky-400 text-sky-800 scale-105 z-10 shadow-md";
                                          iconColor = "text-sky-400";
                                      } else if (isPrev2) {
                                          houseClass = "bg-emerald-50 border-emerald-400 text-emerald-800 scale-105 z-10 shadow-md";
                                          iconColor = "text-emerald-400";
                                      } else if (idx < (st.i || 0)) {
                                          // Processed, but outside window
                                          houseClass = "bg-slate-50 border-slate-200 text-slate-300 opacity-40";
                                      }

                                      return (
                                          <div key={`house-${idx}`} className="flex flex-col items-center gap-2 shrink-0 transition-all duration-300">
                                              
                                              {isPrev1 && <span className="text-[9px] font-black font-mono text-sky-500 mb-1">prev1</span>}
                                              {isPrev2 && <span className="text-[9px] font-black font-mono text-emerald-500 mb-1">prev2</span>}
                                              {isCurrentlyCalculating && <span className="text-[9px] font-black font-mono text-amber-500 mb-1 animate-pulse">curr (i)</span>}
                                              {(!isPrev1 && !isPrev2 && !isCurrentlyCalculating) && <span className="h-3 mb-1"></span>}

                                              <div className={`flex flex-col items-center justify-center w-16 h-20 border-2 rounded-lg transition-all duration-300 ${houseClass}`}>
                                                  <Home size={24} className={`mb-2 ${iconColor}`}/>
                                                  <span className="font-mono font-black text-sm">${val}</span>
                                              </div>
                                              <span className="text-[9px] font-bold text-slate-400 font-mono opacity-80">idx {idx}</span>
                                          </div>
                                      );
                                  })}
                              </div>

                          </div>
                      </div>
                  ) : (
                      <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-center`} style={{ minHeight: `350px` }}>
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute top-0 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><ListOrdered size={12} className="inline mr-1"/> DP Array Tracking</span>
                          
                          <div className="flex flex-col items-center gap-6 mt-8 px-4 max-w-5xl w-full">
                              
                              {/* House (Input) Row */}
                              <div className="flex items-end gap-3 w-full overflow-x-auto scrollbar-none pb-2 justify-start md:justify-center">
                                  {baseNums.map((val: number, idx: number) => {
                                      let isCurrentlyCalculating = st.hlPhase === 'calc' && idx === st.i;
                                      let isRobSource = st.hlPhase === 'calc' && st.i !== undefined && idx === st.i - 2;
                                      
                                      let houseClass = "bg-slate-50 border-slate-200 text-slate-400";
                                      let iconColor = "text-slate-300";

                                      if (isCurrentlyCalculating) {
                                          houseClass = "bg-amber-100 border-amber-500 text-amber-900 shadow-md scale-105 z-10 ring-2 ring-amber-300";
                                          iconColor = "text-amber-500";
                                      } else if (isRobSource) {
                                          houseClass = "bg-emerald-50 border-emerald-400 text-emerald-800 shadow-sm";
                                          iconColor = "text-emerald-500";
                                      }

                                      return (
                                          <div key={`h-in-${idx}`} className={`flex flex-col items-center justify-center w-14 h-16 border-2 rounded-lg transition-all duration-300 shrink-0 ${houseClass}`}>
                                              <Home size={18} className={`mb-1 ${iconColor}`}/>
                                              <span className="font-mono font-black text-xs">${val}</span>
                                          </div>
                                      );
                                  })}
                              </div>

                              <div className="w-full h-px bg-slate-200"></div>

                              {/* DP Array Row */}
                              <div className="flex items-start gap-3 w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 pt-2 pb-4 justify-start md:justify-center">
                                  {st.dp && st.dp.map((val: number, idx: number) => {
                                      let isCalculated = val !== 0 || (idx === 0 && st.dp[0] === 0); // handle 0 cost houses
                                      let isCurrentlyCalculating = st.hlPhase === 'calc' && idx === st.i;
                                      let isRobSource = st.hlPhase === 'calc' && st.i !== undefined && idx === st.i - 2;
                                      let isSkipSource = st.hlPhase === 'calc' && st.i !== undefined && idx === st.i - 1;
                                      
                                      let cellClass = "bg-white border-slate-300 text-slate-700";
                                      if (isCurrentlyCalculating) cellClass = "bg-amber-400 border-amber-600 text-amber-950 shadow-xl scale-125 z-20 ring-4 ring-amber-200";
                                      else if (isRobSource) cellClass = "bg-emerald-100 border-emerald-500 text-emerald-900 shadow-md scale-110 z-10 ring-2 ring-emerald-300";
                                      else if (isSkipSource) cellClass = "bg-sky-100 border-sky-400 text-sky-900 shadow-md scale-110 z-10 ring-2 ring-sky-300";
                                      else if (!isCalculated) cellClass = "bg-slate-100 border-slate-200 text-slate-300 opacity-60";
                                      else if (isCalculated) cellClass = "bg-slate-800 border-slate-900 text-white shadow-sm";

                                      return (
                                          <div key={`dp-${idx}`} className="flex flex-col items-center gap-2 shrink-0">
                                              <div className={`flex items-center justify-center w-14 h-14 border-2 rounded-xl transition-all duration-300 font-mono text-base font-black ${cellClass}`}>
                                                  {isCalculated ? `$${val}` : ''}
                                              </div>
                                              <span className="text-[9px] font-bold text-slate-400 font-mono opacity-80">dp[{idx}]</span>
                                          </div>
                                      );
                                  })}
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
                <Home className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">House Robber</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Dynamic Programming
                  </span>
                  <span>•</span>
                  <span>LeetCode 198</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><DollarSign size={28}/> Maximize The Loot</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and <strong>it will automatically contact the police if two adjacent houses were broken into on the same night.</strong></p>
                        <p className="font-bold mt-4">Given an integer array <code>nums</code> representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-4`}>
                        <div className="w-full space-y-2">
                            <span className={`text-${themeColor}-400 block uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                            <div className="text-slate-300 break-all space-y-1">
                                <p><strong>Input:</strong> nums = [1, 2, 3, 1]</p>
                                <p><strong>Output:</strong> 4</p>
                                <p><strong>Explanation:</strong><br/>
                                Rob house 1 (money = 1) and then rob house 3 (money = 3).<br/>
                                Total amount you can rob = 1 + 3 = 4.</p>
                            </div>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-4 mt-4`}>
                        <div className="w-full space-y-2">
                            <span className={`text-${themeColor}-400 block uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                            <div className="text-slate-300 break-all space-y-1">
                                <p><strong>Input:</strong> nums = [2, 7, 9, 3, 1]</p>
                                <p><strong>Output:</strong> 12</p>
                                <p><strong>Explanation:</strong><br/>
                                Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1).<br/>
                                Total amount you can rob = 2 + 9 + 1 = 12.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &le; nums.length &le; 100</li>
                            <li>0 &le; nums[i] &le; 400</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-sky-500"/> The Core Insight</h4>
                        <p className="text-sm leading-relaxed">At every single house, you have exactly two choices: <strong>Rob it</strong> or <strong>Skip it</strong>. If you rob it, you cannot have robbed the previous house, so you add its value to the max loot from 2 houses ago. If you skip it, you just keep whatever maximum loot you had at the previous house. The answer for house <code>i</code> is simply the maximum of those two choices.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2"><strong>1. Array DP:</strong> Create an array <code>dp</code> of size <code>N</code>. <code>dp[i]</code> holds the max loot possible up to house <code>i</code>. We calculate it via <code>dp[i] = max(dp[i-1], dp[i-2] + nums[i])</code>.</p>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>2. Space-Optimized Variables:</strong> Notice that step <code>i</code> only cares about <code>i-1</code> and <code>i-2</code>. By just keeping two variables (<code>prev1</code> and <code>prev2</code>) to represent the last two optimal states, we can compress memory usage from $O(N)$ down to $O(1)$.</p>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Houses Array (nums)</label>
                            <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="2, 7, 9, 3, 1" />
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
                                <PartyPopper size={24}/> EVALUATION COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Maximum possible loot is ${String(st.finalAns)}.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'calc' ? 'text-amber-400' : (st.hlPhase === 'shiftPrev1' || st.hlPhase === 'shiftPrev2' ? 'text-rose-400' : (st.hlPhase === 'loop' || st.hlPhase === 'initVars' || st.hlPhase === 'initArray' ? `text-${themeColor}-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                        <p className="mb-4 text-slate-600 leading-relaxed">Dynamic Programming solves large problems by breaking them into overlapping subproblems. Here, the maximum loot possible up to house <code>i</code> is strictly defined by the formula: <code>DP[i] = max(DP[i-1], DP[i-2] + nums[i])</code>. This equation effectively asks: "Do I make more money skipping this house, or robbing it along with the loot from two houses ago?"</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Network size={24} className="text-sky-500"/> 2. Dealing with Base Cases</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">The algorithm fails if the array has 0 or 1 elements, because calculating <code>DP[2]</code> requires both <code>DP[1]</code> and <code>DP[0]</code> to exist. Therefore, we must explicitly write `if (nums.length == 0) return 0;` and `if (nums.length == 1) return nums[0];` before starting our loops to prevent `IndexOutOfBounds` exceptions.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> 3. Space Optimization</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Notice that calculating <code>curr</code> NEVER requires looking at <code>i - 3</code> or earlier. The historical data becomes useless! By simply keeping two temporary variables (<code>prev1</code> and <code>prev2</code>) and sliding them forward as we process the array, we eliminate the need for the DP array entirely, dropping space complexity to $O(1)$.</p>
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
                            <span>Q1: "Could we modify the original <code>nums</code> array instead of creating a <code>dp</code> array?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, we can do an in-place modification to achieve O(1) space.</p>
                            <p>We could simply overwrite <code>nums[i] = Math.max(nums[i-1], nums[i-2] + nums[i])</code>. This saves memory, but in production environments, mutating input variables is often considered a bad practice (side effects). Using two variables (<code>prev1</code>, <code>prev2</code>) achieves the same $O(1)$ space complexity while keeping the input pristine."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "What if we were asked to return the actual houses we robbed, not just the max amount?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "We would need the full DP array and a backpointer array.</p>
                            <p>We couldn't use the $O(1)$ space optimization. We would need a boolean array <code>robbed[i]</code> that stores whether taking <code>dp[i-2] + nums[i]</code> was strictly greater than <code>dp[i-1]</code>. Once we calculate the maximum cost at the end, we trace backward through the <code>robbed</code> array to reconstruct the exact houses we visited."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "How does this algorithm change for 'House Robber II' where the street is circular?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "If it's circular, robbing the first house means you CANNOT rob the last house.</p>
                            <p>To solve it, we just run this exact same $O(1)$ algorithm twice! First, we run it on houses <code>0</code> to <code>N-2</code> (ignoring the last house). Then, we run it on houses <code>1</code> to <code>N-1</code> (ignoring the first house). The maximum of those two runs is the final safe answer for a circular street."</p>
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
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'calc' ? 'text-amber-400' : (st.hlPhase === 'shiftPrev1' || st.hlPhase === 'shiftPrev2' ? 'text-rose-400' : (st.hlPhase === 'loop' || st.hlPhase === 'initVars' || st.hlPhase === 'initArray' ? `text-${themeColor}-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Houses Array (nums)</label>
                              <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder='2, 7, 9, 3, 1' />
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
                                    <div className={`text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2`}>Maximum Possible Loot</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center justify-center gap-4 max-w-full px-4 text-center">
                                        ${String(st.finalAns)}
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