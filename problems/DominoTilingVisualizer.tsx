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
    public int numTilings(int n) {
        if (n == 1) return 1;
        if (n == 2) return 2;
        long MOD = 1_000_000_007;
        
        long dp0 = 1;
        long dp1 = 1;
        long dp2 = 2;
        
        for (int i = 3; i <= n; i++) {
            long curr = (2 * dp2 + dp0) % MOD;
            dp0 = dp1;
            dp1 = dp2;
            dp2 = curr;
        }
        
        return (int) dp2;
    }
}`,
    desc: "The most memory-efficient approach. Through algebraic substitution, the complex state transitions of the Domino and Tromino shapes simplify to a single recurrence relation: DP[i] = 2 * DP[i-1] + DP[i-3]. Because we only need to look back 3 steps at any given time, we don't need to allocate an array of size N. We just maintain a sliding window of 3 variables (dp0, dp1, dp2) and shift them forward, achieving O(1) space complexity."
  },
  bottomUpArray: {
    id: 'bottomUpArray',
    title: '2. Array Bottom-Up DP',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    theme: 'sky',
    code: `class Solution {
    public int numTilings(int n) {
        if (n == 1) return 1;
        if (n == 2) return 2;
        long MOD = 1_000_000_007;
        
        long[] dp = new long[n + 1];
        dp[0] = 1;
        dp[1] = 1;
        dp[2] = 2;
        
        for (int i = 3; i <= n; i++) {
            dp[i] = (2 * dp[i - 1] + dp[i - 3]) % MOD;
        }
        
        return (int) dp[n];
    }
}`,
    desc: "A standard Tabulation Dynamic Programming approach. We allocate an array `dp` where `dp[i]` represents the number of ways to fully tile a 2 x i board. We seed the base cases for lengths 0, 1, and 2. Then, we loop through the array up to `n`, calculating the combinations using our derived recurrence relation `dp[i] = 2 * dp[i-1] + dp[i-3]`. To prevent integer overflow, we use `long` arrays and apply the modulo 10^9 + 7 at each step."
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
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|char|boolean|class|return|if|else|while|for|new|String|numTilings|Solution|MOD|dp|dp0|dp1|dp2|curr|i|n)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
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
            
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'char', 'boolean', 'class', 'return', 'if', 'else', 'while', 'for', 'new'].includes(part);
            const isObject = ['String', 'Solution'].includes(part);
            const isPointer = ['n', 'MOD', 'dp', 'dp0', 'dp1', 'dp2', 'curr', 'i'].includes(part);
            const isMapCall = ['numTilings'].includes(part);
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

export default function DominoTilingVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('bottomUpOptimized');
  
  const [nInput, setNInput] = useState('5');
  const [baseN, setBaseN] = useState<number>(5);

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

  const parseInput = (str: string) => {
      let n = parseInt(str.trim(), 10);
      if (isNaN(n) || n < 1) n = 1;
      if (n > 60) n = 60; // Cap for visual sanity and preventing JS Number limits
      return n;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setBaseN(parseInput(nInput));
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [nInput, selectedOpId]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = baseN;
    if (n < 1) return [];

    const MOD = 1000000007;

    if (selectedOpId === 'bottomUpOptimized') {
        let dp0 = 1, dp1 = 1, dp2 = 2, curr = 0;
        
        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { dp0, dp1, dp2, curr, ...st } 
        });

        add("Function Call", `public int numTilings(int n)`, 2, { hlPhase: 'init' });
        
        add("Base Case Check", `if (n == 1) return 1;`, 3, { hlPhase: 'check1' });
        if (n === 1) {
            add("Return Base Case", `return 1;\nn is 1. Only 1 way to tile a 2x1 board (one vertical domino).`, 3, { hlPhase: 'success', finalAns: 1 });
            return steps;
        }

        add("Base Case Check", `if (n == 2) return 2;`, 4, { hlPhase: 'check2' });
        if (n === 2) {
            add("Return Base Case", `return 2;\nn is 2. There are 2 ways to tile a 2x2 board (two vertical or two horizontal dominoes).`, 4, { hlPhase: 'success', finalAns: 2 });
            return steps;
        }

        add("Init Variables", `long MOD = 1_000_000_007;\nlong dp0 = 1;\nlong dp1 = 1;\nlong dp2 = 2;`, 5, { hlPhase: 'initVars' });

        for (let i = 3; i <= n; i++) {
            add("Loop Execution", `for (int i = 3; i <= n; i++)\nCalculating the number of tilings for a 2 x ${i} board.`, 11, { hlPhase: 'loop', i });
            
            let calcRaw = (2 * dp2) + dp0;
            curr = calcRaw % MOD;
            
            add("Mathematical Recurrence", `long curr = (2 * dp2 + dp0) % MOD;\n(2 * ${dp2} + ${dp0}) = ${calcRaw}.\nApplying modulo: ${calcRaw} % ${MOD} = ${curr}.`, 12, { hlPhase: 'calc', i, raw: calcRaw, curr });

            dp0 = dp1;
            add("Shift Window", `dp0 = dp1;\nShifting dp1 (${dp1}) into dp0.`, 13, { hlPhase: 'shift0', i });

            dp1 = dp2;
            add("Shift Window", `dp1 = dp2;\nShifting dp2 (${dp2}) into dp1.`, 14, { hlPhase: 'shift1', i });

            dp2 = curr;
            add("Shift Window", `dp2 = curr;\nShifting new value (${curr}) into dp2.`, 15, { hlPhase: 'shift2', i });
        }

        add("Return Result", `return (int) dp2;\nLoop complete. Total number of tilings for 2x${n} board is ${dp2}.`, 18, { hlPhase: 'success', finalAns: dp2 });
    } 
    else if (selectedOpId === 'bottomUpArray') {
        let dp: number[] = new Array(n + 1).fill(0);
        const MOD = 1000000007;

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { dp: [...dp], ...st } 
        });

        add("Function Call", `public int numTilings(int n)`, 2, { hlPhase: 'init' });
        
        add("Base Case Check", `if (n == 1) return 1;`, 3, { hlPhase: 'check1' });
        if (n === 1) {
            add("Return Base Case", `return 1;\nn is 1. Returning 1 immediately.`, 3, { hlPhase: 'success', finalAns: 1, dp: [1, 1] }); // visually seed 0 and 1
            return steps;
        }

        add("Base Case Check", `if (n == 2) return 2;`, 4, { hlPhase: 'check2' });
        if (n === 2) {
            add("Return Base Case", `return 2;\nn is 2. Returning 2 immediately.`, 4, { hlPhase: 'success', finalAns: 2, dp: [1, 1, 2] });
            return steps;
        }

        add("Init Array & Consts", `long MOD = 1_000_000_007;\nlong[] dp = new long[n + 1];`, 5, { hlPhase: 'initArray' });
        
        dp[0] = 1;
        add("Seed DP[0]", `dp[0] = 1;\nMathematical base case for completely empty board.`, 8, { hlPhase: 'seed0', dp: [...dp] });
        
        dp[1] = 1;
        add("Seed DP[1]", `dp[1] = 1;\nOne vertical domino for length 1.`, 9, { hlPhase: 'seed1', dp: [...dp] });

        dp[2] = 2;
        add("Seed DP[2]", `dp[2] = 2;\nTwo vertical or two horizontal dominoes for length 2.`, 10, { hlPhase: 'seed2', dp: [...dp] });

        for (let i = 3; i <= n; i++) {
            add("Loop Execution", `for (int i = 3; i <= n; i++)\nCalculating ways for a 2 x ${i} board.`, 12, { hlPhase: 'loop', i, dp: [...dp] });
            
            let calcRaw = (2 * dp[i-1]) + dp[i-3];
            dp[i] = calcRaw % MOD;
            
            add("Calculate & Store", `dp[i] = (2 * dp[i - 1] + dp[i - 3]) % MOD;\n(2 * ${dp[i-1]} + ${dp[i-3]}) = ${calcRaw}.\nApplying modulo: ${calcRaw} % ${MOD} = ${dp[i]}.\nStored in dp[${i}].`, 13, { hlPhase: 'calc', i, raw: calcRaw, curr: dp[i], dp: [...dp] });
        }

        add("Return Result", `return (int) dp[n];\nArray complete. The number of tilings is at the last index: ${dp[n]}.`, 16, { hlPhase: 'success', finalAns: dp[n], dp: [...dp] });
    }

    return steps;
  }, [baseN, selectedOpId]);

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

      let isCalc = st.hlPhase === 'calc';

      let p1 = selectedOpId === 'bottomUpOptimized' ? st.dp2 : (st.dp && st.i ? st.dp[st.i - 1] : '?');
      let p3 = selectedOpId === 'bottomUpOptimized' ? st.dp0 : (st.dp && st.i ? st.dp[st.i - 3] : '?');

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isCalc ? 'border-amber-400 ring-4 ring-amber-100 scale-105' : `border-${themeColor}-200`}`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Activity size={14}/> Mathematical Recurrence Evaluator</span>
              
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                  
                  <div className="flex flex-col items-center min-w-[80px]">
                      <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'loop' ? `text-${themeColor}-500` : 'text-slate-400'}`}>Current N</span>
                      <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.hlPhase === 'loop' ? `bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-900 shadow-md scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                          {st.i !== undefined ? `i=${st.i}` : '?'}
                      </div>
                  </div>

                  <div className="w-px h-12 bg-slate-200 hidden md:block"></div>

                  <div className="flex items-center gap-2 md:gap-3">
                      
                      {/* Formula Element 1 */}
                      <div className="flex flex-col items-center">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${isCalc ? 'text-sky-500' : 'text-slate-400'}`}>2 * DP[i-1]</span>
                          <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${isCalc ? 'bg-sky-100 border-sky-500 text-sky-800 scale-105 shadow-md' : 'bg-slate-50 border-slate-300 text-slate-600 opacity-60'}`}>
                              <span>{isCalc && p1 !== undefined ? `2*${p1}` : '?'}</span>
                          </div>
                      </div>
                      
                      <span className="text-xl font-bold text-slate-400 font-sans">+</span>
                      
                      {/* Formula Element 2 */}
                      <div className="flex flex-col items-center">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${isCalc ? 'text-emerald-500' : 'text-slate-400'}`}>DP[i-3]</span>
                          <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${isCalc ? 'bg-emerald-100 border-emerald-500 text-emerald-800 scale-105 shadow-md' : 'bg-slate-50 border-slate-300 text-slate-600 opacity-60'}`}>
                              <span>{isCalc && p3 !== undefined ? p3 : '?'}</span>
                          </div>
                      </div>
                      
                      <ArrowRight size={24} className={isCalc ? `text-amber-500 animate-pulse mx-2` : "text-slate-300 mx-2"}/>
                      
                      {/* Modulo Application */}
                      <div className="flex flex-col items-center">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${isCalc ? `text-amber-500` : 'text-slate-400'}`}>% 10^9+7</span>
                          <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${isCalc ? `bg-amber-100 border-amber-500 text-amber-900 shadow-md scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                              {isCalc ? st.curr : '?'}
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
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute top-0 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><IterationCcw size={12} className="inline mr-1"/> 3-Variable Sliding Window Memory</span>
                          
                          <div className="flex flex-col items-center w-full max-w-5xl mt-12 gap-8 px-4">
                              
                              {/* Sliding Memory Trackers */}
                              <div className="flex items-center justify-center gap-4 md:gap-8 w-full relative mb-4">
                                  {['dp0', 'dp1', 'dp2'].map((vName, idx) => {
                                      let val = st[vName];
                                      let isShifting = (vName === 'dp0' && st.hlPhase === `shift0`) || 
                                                       (vName === 'dp1' && st.hlPhase === `shift1`) || 
                                                       (vName === 'dp2' && st.hlPhase === `shift2`);
                                      
                                      let colorClass = 'bg-slate-800 border-slate-900 text-white';

                                      if (isShifting) {
                                          colorClass = 'bg-amber-100 border-amber-500 text-amber-900 scale-110 ring-4 ring-amber-200';
                                      }
                                      
                                      if (st.hlPhase === 'calc') {
                                          if (vName === 'dp2') colorClass = 'bg-sky-100 border-sky-500 text-sky-900 scale-110 ring-4 ring-sky-200';
                                          if (vName === 'dp0') colorClass = 'bg-emerald-100 border-emerald-500 text-emerald-900 scale-110 ring-4 ring-emerald-200';
                                      }

                                      return (
                                          <div key={`ptr-${vName}`} className="flex flex-col items-center relative z-20">
                                              <div className={`w-24 h-20 md:w-32 md:h-24 flex flex-col items-center justify-center border-4 rounded-2xl transition-all duration-300 shadow-xl ${colorClass}`}>
                                                  <span className="font-mono font-black text-2xl md:text-3xl truncate px-2 max-w-full">{val !== undefined ? val : '?'}</span>
                                              </div>
                                              <span className={`text-xs font-black font-mono mt-2 uppercase tracking-widest ${isShifting ? 'text-amber-500' : 'text-slate-500'}`}>{vName}</span>
                                          </div>
                                      );
                                  })}
                              </div>

                              {/* Visualization of Virtual Window */}
                              <div className="flex items-end justify-center gap-3 w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 pb-4 mt-8 opacity-60">
                                  {Array.from({length: baseN + 1}).map((_, idx: number) => {
                                      let isCurrentlyCalculating = st.i === idx;
                                      let isDp2 = st.i !== undefined && idx === st.i - 1;
                                      let isDp1 = st.i !== undefined && idx === st.i - 2;
                                      let isDp0 = st.i !== undefined && idx === st.i - 3;
                                      
                                      let boxClass = "bg-slate-100 border-slate-300 text-slate-400"; 
                                      
                                      if (isCurrentlyCalculating) {
                                          boxClass = "bg-amber-100 border-amber-500 text-amber-900 scale-110 z-20 shadow-lg ring-2 ring-amber-200";
                                      } else if (isDp2) {
                                          boxClass = "bg-sky-100 border-sky-400 text-sky-800 scale-105 z-10 shadow-sm";
                                      } else if (isDp1) {
                                          boxClass = "bg-slate-200 border-slate-400 text-slate-800 scale-105 z-10 shadow-sm";
                                      } else if (isDp0) {
                                          boxClass = "bg-emerald-100 border-emerald-400 text-emerald-800 scale-105 z-10 shadow-sm";
                                      }

                                      return (
                                          <div key={`v-${idx}`} className="flex flex-col items-center gap-2 shrink-0 transition-all duration-300">
                                              {isDp0 && <span className="text-[9px] font-black font-mono text-emerald-500 mb-1">dp0</span>}
                                              {isDp1 && <span className="text-[9px] font-black font-mono text-slate-500 mb-1">dp1</span>}
                                              {isDp2 && <span className="text-[9px] font-black font-mono text-sky-500 mb-1">dp2</span>}
                                              {isCurrentlyCalculating && <span className="text-[9px] font-black font-mono text-amber-500 mb-1 animate-pulse">curr (i)</span>}
                                              {(!isDp0 && !isDp1 && !isDp2 && !isCurrentlyCalculating) && <span className="h-3 mb-1"></span>}

                                              <div className={`flex flex-col items-center justify-center w-12 h-12 border-2 rounded-lg transition-all duration-300 ${boxClass}`}>
                                                  <Layout size={16} className={`opacity-50`}/>
                                              </div>
                                              <span className="text-[9px] font-bold text-slate-400 font-mono opacity-80">N={idx}</span>
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
                              
                              {/* DP Array Row */}
                              <div className="flex items-start gap-3 w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 pt-10 pb-4 justify-start md:justify-center">
                                  {st.dp && st.dp.map((val: number, idx: number) => {
                                      let isCalculated = val !== 0 || (idx === 0 && st.dp[0] === 1); // handles valid 0 states
                                      let isCurrentlyCalculating = st.hlPhase === 'calc' && idx === st.i;
                                      
                                      // Specific sources for Domino Tiling DP[i] = 2*DP[i-1] + DP[i-3]
                                      let isSourceDP1 = st.hlPhase === 'calc' && st.i !== undefined && idx === st.i - 1;
                                      let isSourceDP3 = st.hlPhase === 'calc' && st.i !== undefined && idx === st.i - 3;
                                      
                                      let cellClass = "bg-white border-slate-300 text-slate-700";
                                      if (isCurrentlyCalculating) cellClass = "bg-amber-400 border-amber-600 text-amber-950 shadow-xl scale-125 z-20 ring-4 ring-amber-200";
                                      else if (isSourceDP1) cellClass = "bg-sky-100 border-sky-500 text-sky-900 shadow-md scale-110 z-10 ring-2 ring-sky-300";
                                      else if (isSourceDP3) cellClass = "bg-emerald-100 border-emerald-400 text-emerald-900 shadow-md scale-110 z-10 ring-2 ring-emerald-300";
                                      else if (!isCalculated) cellClass = "bg-slate-100 border-slate-200 text-slate-300 opacity-60";
                                      else if (isCalculated) cellClass = "bg-slate-800 border-slate-900 text-white shadow-sm";

                                      return (
                                          <div key={`dp-${idx}`} className="flex flex-col items-center gap-2 shrink-0">
                                              
                                              <div className="flex flex-col items-center gap-1 relative">
                                                  {isCurrentlyCalculating && (
                                                      <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-8 whitespace-nowrap bg-amber-500 text-white px-1.5 rounded shadow-lg animate-pulse`}>
                                                          dp[i]
                                                      </span>
                                                  )}
                                                  {isSourceDP1 && (
                                                      <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-8 whitespace-nowrap bg-sky-500 text-white px-1.5 rounded shadow-lg animate-bounce`}>
                                                          dp[i-1]
                                                      </span>
                                                  )}
                                                  {isSourceDP3 && (
                                                      <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-8 whitespace-nowrap bg-emerald-500 text-white px-1.5 rounded shadow-lg animate-bounce`}>
                                                          dp[i-3]
                                                      </span>
                                                  )}

                                                  <div className={`flex items-center justify-center w-14 h-14 border-2 rounded-xl transition-all duration-300 font-mono text-base font-black ${cellClass} overflow-hidden px-1`}>
                                                      <span className="truncate">{isCalculated ? val : ''}</span>
                                                  </div>
                                              </div>
                                              <span className="text-[9px] font-bold text-slate-400 font-mono opacity-80">N={idx}</span>
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
                <Layout className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Domino and Tromino Tiling</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Dynamic Programming
                  </span>
                  <span>•</span>
                  <span>LeetCode 790</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Layout size={28}/> Fill the Board</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You have two types of tiles: a <code>2 x 1</code> domino shape and a tromino shape (an L shape). You may rotate these shapes.</p>
                        <p className="font-bold mt-4">Given an integer <code>n</code>, return the number of ways to tile an <code>2 x n</code> board. Since the answer may be very large, return it modulo <code>10^9 + 7</code>.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-4`}>
                        <div className="w-full space-y-2">
                            <span className={`text-${themeColor}-400 block uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                            <div className="text-slate-300 break-all space-y-1">
                                <p><strong>Input:</strong> n = 3</p>
                                <p><strong>Output:</strong> 5</p>
                                <p><strong>Explanation:</strong> The five different ways to fully tile a 2 x 3 board using dominos and trominos.</p>
                            </div>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-4 mt-4`}>
                        <div className="w-full space-y-2">
                            <span className={`text-${themeColor}-400 block uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                            <div className="text-slate-300 break-all space-y-1">
                                <p><strong>Input:</strong> n = 1</p>
                                <p><strong>Output:</strong> 1</p>
                                <p><strong>Explanation:</strong> Only 1 way to tile a 2 x 1 board (one vertical domino).</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &le; n &le; 1000</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-sky-500"/> The Core Insight</h4>
                        <p className="text-sm leading-relaxed">Tiling problems are classic dynamic programming. By analyzing how a board of length <code>i</code> can be formed from smaller boards, we discover a complex set of partial states (boards missing one square) that mathematically simplifies down to a single beautiful recurrence relation: <code>DP[i] = 2 * DP[i-1] + DP[i-3]</code>.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2"><strong>1. Array DP:</strong> Create a <code>long</code> array of size <code>N+1</code>. Seed the base cases `dp[0]=1, dp[1]=1, dp[2]=2`. Iterate to <code>N</code> applying the formula and modulo 10^9+7.</p>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>2. Space-Optimized Variables:</strong> Notice that step <code>i</code> only cares about <code>i-1</code> and <code>i-3</code>. By maintaining a sliding window of exactly 3 variables (`dp0, dp1, dp2`), we can compress memory usage to strictly $O(1)$.</p>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Board Width (n)</label>
                            <input type="number" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="5" min="1" max="60"/>
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
                                Total combinations to tile a 2x{baseN} board is {String(st.finalAns)}.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'calc' ? 'text-amber-400' : (st.hlPhase === 'shift0' || st.hlPhase === 'shift1' || st.hlPhase === 'shift2' ? 'text-rose-400' : (st.hlPhase === 'loop' || st.hlPhase === 'initVars' || st.hlPhase === 'initArray' ? `text-${themeColor}-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Deriving the recurrence relation for Tiling.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-emerald-500"/> 1. The Recurrence Relation</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Let `dp[i]` be the number of ways to fully tile a `2 x i` board. Let `partial[i]` be the number of ways to tile a `2 x i` board with one corner missing.</p>
                        <p className="text-slate-600 leading-relaxed">The transitions are:<br/>
                        <code>dp[i] = dp[i-1] + dp[i-2] + 2 * partial[i-1]</code><br/>
                        <code>partial[i] = dp[i-2] + partial[i-1]</code><br/>
                        Through algebraic substitution, this simplifies exactly to: <br/><strong><code>dp[i] = 2 * dp[i-1] + dp[i-3]</code></strong>.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Network size={24} className="text-sky-500"/> 2. Modulo Arithmetic</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Because the number of combinations grows exponentially, it quickly exceeds the maximum limit of a 32-bit integer (2,147,483,647). Therefore, we must use 64-bit <code>long</code> variables during calculation and apply modulo <code>10^9 + 7</code> at every step to prevent silent overflow errors, before finally casting back to an <code>int</code>.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> 3. Space Optimization</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Notice that calculating <code>curr</code> NEVER requires looking at <code>i - 4</code> or earlier. The historical data becomes useless! By simply keeping three temporary variables (<code>dp0, dp1, dp2</code>) and sliding them forward as we process the loop, we eliminate the need for the array entirely, dropping space complexity to $O(1)$.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className={`text-${themeColor}-400`}/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a mathematically heavy DP question. Interviewers use it to see if you can methodically break down states on a whiteboard and recognize algebraic simplifications before coding."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we solve this using Matrix Exponentiation?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, absolutely.</p>
                            <p>Since the recurrence relation <code>dp[i] = 2 * dp[i-1] + dp[i-3]</code> is entirely linear, we can construct a 3x3 transformation matrix. By raising this matrix to the power of N using binary exponentiation, we can find the answer in blindingly fast $O(\log N)$ time, which is strictly necessary if $N$ is 1 billion."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "Why do we apply the modulo at EVERY addition step, rather than just returning <code>dp[N] % MOD</code> at the end?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To prevent silent integer overflow.</p>
                            <p>The combinations grow exponentially. Even if we use 64-bit <code>long</code> variables, <code>dp[N]</code> will exceed the maximum long limit far before $N = 1000$. Modulo arithmetic guarantees that $(A + B) \pmod M = (A \pmod M + B \pmod M) \pmod M$. By taking the modulo at every step, we keep the numbers small enough to fit safely in memory without altering the final mathematical result."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "If the interviewer asks you to prove the recurrence relation on the whiteboard, how do you start?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Draw the exact end-states."</p>
                            <p>Draw a 2xN grid. Look at the very last column. It can be filled by: 1 vertical domino (reduces to $N-1$), 2 horizontal dominoes (reduces to $N-2$), or 1 tromino. The tromino leaves a 1-square gap, creating a new 'partial' state. Draw the partial state, show how a domino or tromino can fill its gap, resulting in the two coupled equations. Then physically substitute the variables on the whiteboard."</p>
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
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'calc' ? 'text-amber-400' : (st.hlPhase === 'shift0' || st.hlPhase === 'shift1' || st.hlPhase === 'shift2' ? 'text-rose-400' : (st.hlPhase === 'loop' || st.hlPhase === 'initVars' || st.hlPhase === 'initArray' ? `text-${themeColor}-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Board Width (n)</label>
                              <input type="number" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder='5' min="1" max="60"/>
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">EVALUATION COMPLETE</h2>
                                <p className={`text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2`}>Total Configurations</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center justify-center gap-4 max-w-full px-4 text-center">
                                        {String(st.finalAns)}
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