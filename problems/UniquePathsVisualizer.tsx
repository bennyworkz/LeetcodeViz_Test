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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, GitPullRequest, Leaf, Route, Map as MapIcon, Key, Eye, Sigma, MapPin as MapPinIcon, Target as TargetIcon, Search as SearchIcon, Bug, Clock as ClockIcon, Keyboard, AlignLeft, AlignRight, SplitSquareVertical, IterationCcw, Home, Bot, Flag
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  bottomUpOptimized: {
    id: 'bottomUpOptimized',
    title: '1. Space-Optimized 1D DP',
    icon: <IterationCcw size={16} />,
    complexity: 'Time: O(M×N) | Space: O(N)',
    theme: 'emerald',
    code: `class Solution {
    public int uniquePaths(int m, int n) {
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[j] += dp[j - 1];
            }
        }
        
        return dp[n - 1];
    }
}`,
    desc: "The most memory-efficient approach. Because a cell only depends on the cell above it and the cell to its left, we don't need to keep the entire M x N grid in memory. We just need to keep the 'previous row'. By using a 1D array of size N, dp[j] acts as the 'above' cell (from the previous iteration of the outer loop), and dp[j-1] acts as the 'left' cell. We update the array in place, compressing space complexity to O(N)."
  },
  bottomUpArray: {
    id: 'bottomUpArray',
    title: '2. Standard 2D DP',
    icon: <Grid size={16} />,
    complexity: 'Time: O(M×N) | Space: O(M×N)',
    theme: 'sky',
    code: `class Solution {
    public int uniquePaths(int m, int n) {
        int[][] dp = new int[m][n];
        
        for (int i = 0; i < m; i++) dp[i][0] = 1;
        for (int j = 0; j < n; j++) dp[0][j] = 1;
        
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
            }
        }
        
        return dp[m - 1][n - 1];
    }
}`,
    desc: "A standard Tabulation 2D Dynamic Programming approach. We allocate an M x N grid where dp[i][j] represents the total number of unique paths to reach that specific cell. Because the robot can only move down or right, the top row and left column can only be reached in exactly 1 way. We seed these base cases, then loop through the rest of the grid. Any cell's paths is exactly equal to the sum of the paths from the cell directly Above it + the cell directly to its Left."
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
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|char|boolean|class|return|if|else|while|for|new|String|uniquePaths|Solution|Arrays|fill|dp|m|n|i|j)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
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
            const isObject = ['String', 'Solution', 'Arrays'].includes(part);
            const isPointer = ['m', 'n', 'dp', 'i', 'j'].includes(part);
            const isMapCall = ['uniquePaths', 'fill'].includes(part);
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

export default function UniquePathsVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('bottomUpOptimized');
  
  const [mInput, setMInput] = useState('3');
  const [nInput, setNInput] = useState('7');
  
  const [baseM, setBaseM] = useState<number>(3);
  const [baseN, setBaseN] = useState<number>(7);

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

  const parseInput = (str: string, defaultVal: number) => {
      let v = parseInt(str.trim(), 10);
      if (isNaN(v) || v < 1) v = 1;
      if (v > 12) v = 12; // Cap for visual sanity 
      return v;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setBaseM(parseInput(mInput, 3));
      setBaseN(parseInput(nInput, 7));
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [mInput, nInput, selectedOpId]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    const m = baseM;
    const n = baseN;
    if (m < 1 || n < 1) return [];

    if (selectedOpId === 'bottomUpOptimized') {
        let dp = new Array(n).fill(0);
        
        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { dp: [...dp], ...st } 
        });

        add("Function Call", `public int uniquePaths(int m, int n)`, 2, { hlPhase: 'init' });
        
        add("Init Array", `int[] dp = new int[n];`, 3, { hlPhase: 'initArray' });

        dp.fill(1);
        add("Fill Array", `Arrays.fill(dp, 1);\nSince the robot can only move right to stay in the first row, there is exactly 1 path to reach any cell in the top row.`, 4, { hlPhase: 'fill' });

        for (let i = 1; i < m; i++) {
            add("Outer Loop", `for (int i = 1; i < m; i++)\nProcessing Row ${i}`, 6, { hlPhase: 'outerLoop', i });
            
            for (let j = 1; j < n; j++) {
                add("Inner Loop", `for (int j = 1; j < n; j++)\nCalculating paths for cell [${i}, ${j}]`, 7, { hlPhase: 'innerLoop', i, j });
                
                let above = dp[j]; // The old value represents the cell directly above
                let left = dp[j - 1]; // The newly updated value represents the cell to the left
                let curr = above + left;
                
                add("Mathematical Recurrence", `dp[j] += dp[j - 1];\nPaths from Above: ${above}\nPaths from Left: ${left}\nTotal paths to reach here: ${above} + ${left} = ${curr}`, 8, { hlPhase: 'calc', i, j, above, left, curr });
                
                dp[j] = curr;
            }
        }

        add("Return Result", `return dp[n - 1];\nLoops complete! The bottom-right cell contains the final answer: ${dp[n - 1]}.`, 12, { hlPhase: 'success', finalAns: dp[n - 1] });
    } 
    else if (selectedOpId === 'bottomUpArray') {
        let dp: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { dp: dp.map(row => [...row]), ...st } 
        });

        add("Function Call", `public int uniquePaths(int m, int n)`, 2, { hlPhase: 'init' });
        
        add("Init Grid", `int[][] dp = new int[m][n];\nAllocating a 2D array of size ${m} x ${n}.`, 3, { hlPhase: 'initGrid' });
        
        for (let i = 0; i < m; i++) dp[i][0] = 1;
        add("Seed Left Column", `for (int i = 0; i < m; i++) dp[i][0] = 1;\nRobot can only move down to reach cells in the first column, so there's exactly 1 path to each.`, 5, { hlPhase: 'seedCol' });
        
        for (let j = 0; j < n; j++) dp[0][j] = 1;
        add("Seed Top Row", `for (int j = 0; j < n; j++) dp[0][j] = 1;\nRobot can only move right to reach cells in the first row, so there's exactly 1 path to each.`, 6, { hlPhase: 'seedRow' });

        for (let i = 1; i < m; i++) {
            add("Outer Loop", `for (int i = 1; i < m; i++)\nProcessing Row ${i}`, 8, { hlPhase: 'outerLoop', i });
            
            for (let j = 1; j < n; j++) {
                add("Inner Loop", `for (int j = 1; j < n; j++)\nCalculating paths for cell [${i}, ${j}]`, 9, { hlPhase: 'innerLoop', i, j });
                
                let above = dp[i - 1][j];
                let left = dp[i][j - 1];
                let curr = above + left;
                
                dp[i][j] = curr;
                add("Calculate Paths", `dp[i][j] = dp[i - 1][j] + dp[i][j - 1];\nPaths from Above: ${above}\nPaths from Left: ${left}\nTotal paths to reach [${i}, ${j}] is ${curr}`, 10, { hlPhase: 'calc', i, j, above, left, curr });
            }
        }

        add("Return Result", `return dp[m - 1][n - 1];\nGrid completely filled. The target cell at the bottom-right contains ${dp[m - 1][n - 1]}.`, 14, { hlPhase: 'success', finalAns: dp[m - 1][n - 1] });
    }

    return steps;
  }, [baseM, baseN, selectedOpId]);

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

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isCalc ? 'border-violet-400 ring-4 ring-violet-100 scale-105' : `border-${themeColor}-200`}`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Activity size={14}/> Dynamic Programming Evaluator</span>
              
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                  
                  <div className="flex flex-col items-center min-w-[80px]">
                      <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'outerLoop' || st.hlPhase === 'innerLoop' || isCalc ? `text-violet-500` : 'text-slate-400'}`}>Target Cell</span>
                      <div className={`border-2 text-2xl font-black px-4 py-2 rounded-xl transition-all duration-300 ${st.hlPhase === 'outerLoop' || st.hlPhase === 'innerLoop' || isCalc ? `bg-violet-100 border-violet-500 text-violet-900 shadow-md scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                          [{st.i !== undefined ? st.i : 'i'}, {st.j !== undefined ? st.j : 'j'}]
                      </div>
                  </div>

                  <div className="w-px h-12 bg-slate-200 hidden md:block"></div>

                  <div className="flex items-center gap-2 md:gap-3">
                      
                      {/* Formula Element 1 */}
                      <div className="flex flex-col items-center">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${isCalc ? 'text-sky-600' : 'text-slate-400'}`}>Above Cell</span>
                          <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${isCalc ? 'bg-sky-50 border-sky-400 text-sky-700 border-dashed scale-105 shadow-sm' : 'bg-slate-50 border-slate-300 border-dashed text-slate-400 opacity-60'}`}>
                              <span>{isCalc && st.above !== undefined ? `${st.above}` : '?'}</span>
                          </div>
                      </div>
                      
                      <span className="text-xl font-bold text-slate-400 font-sans">+</span>
                      
                      {/* Formula Element 2 */}
                      <div className="flex flex-col items-center">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${isCalc ? 'text-rose-600' : 'text-slate-400'}`}>Left Cell</span>
                          <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${isCalc ? 'bg-rose-50 border-rose-400 text-rose-700 border-dashed scale-105 shadow-sm' : 'bg-slate-50 border-slate-300 border-dashed text-slate-400 opacity-60'}`}>
                              <span>{isCalc && st.left !== undefined ? `${st.left}` : '?'}</span>
                          </div>
                      </div>
                      
                      <ArrowRight size={24} className={isCalc ? `text-violet-500 animate-pulse mx-2` : "text-slate-300 mx-2"}/>
                      
                      {/* Result */}
                      <div className="flex flex-col items-center">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${isCalc ? `text-violet-600` : 'text-slate-400'}`}>{selectedOpId === 'bottomUpOptimized' ? 'dp[j] (New)' : 'dp[i][j]'}</span>
                          <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${isCalc ? `bg-violet-100 border-violet-500 text-violet-900 shadow-md scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                              {isCalc ? st.curr : '?'}
                          </div>
                      </div>
                  </div>

              </div>
          </div>
      );
  }

  const renderVisuals = () => {
      // Dynamic Sizing
      const cols = baseN;
      const rows = selectedOpId === 'bottomUpOptimized' ? 1 : baseM;
      
      const maxGridWidth = 700;
      const maxGridHeight = 450;
      
      const cellW = maxGridWidth / cols;
      const cellH = maxGridHeight / Math.max(rows, 3); // minimum scaling for 1D row
      const cellSize = Math.floor(Math.min(cellW, cellH, 60)); // max 60px per cell

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
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute top-0 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><IterationCcw size={12} className="inline mr-1"/> 1D Array Sliding Over Virtual Matrix</span>
                          
                          {/* Row Indicator */}
                          <div className="mt-12 mb-4 flex justify-start items-center w-full max-w-4xl px-4 transition-opacity duration-300" style={{ opacity: st.i !== undefined ? 1 : 0 }}>
                              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest font-mono text-white bg-${themeColor}-600 shadow-md`}>
                                  Simulating Row i = {st.i !== undefined ? st.i : 0}
                              </span>
                          </div>

                          <div className="flex flex-col items-center w-full max-w-5xl gap-2 px-4 relative">
                              {/* 1D DP Array Rendering */}
                              <div className="flex gap-4 w-full justify-center mt-12 px-4 relative">
                                  {st.dp && st.dp.map((val: number, idx: number) => {
                                      let isCalculated = val > 0;
                                      let isCurrentlyCalculating = st.hlPhase === 'calc' && idx === st.j;
                                      let isSourceLeft = st.hlPhase === 'calc' && st.j !== undefined && idx === st.j - 1;
                                      let isEnd = idx === baseN - 1;
                                      
                                      let cellClass = "bg-transparent border-slate-300 border-dashed text-transparent"; 
                                      let textColor = "text-slate-800";

                                      if (st.hlPhase === 'fill') {
                                          cellClass = "bg-white border-slate-300 border-solid shadow-sm";
                                      } else if (isCurrentlyCalculating) {
                                          cellClass = "bg-violet-100 border-violet-500 border-solid shadow-md scale-110 z-30";
                                          textColor = "text-violet-900";
                                      } else if (isSourceLeft) {
                                          cellClass = "bg-rose-50 border-rose-400 border-dashed shadow-sm scale-105 z-20";
                                          textColor = "text-rose-700";
                                      } else if (isCalculated) {
                                          cellClass = "bg-white border-slate-300 border-solid shadow-sm";
                                      }

                                      if (st.isSuccess && isEnd) {
                                          cellClass = "bg-emerald-500 border-emerald-600 border-solid shadow-lg scale-110 z-40 animate-pulse";
                                          textColor = "text-white";
                                      }

                                      return (
                                          <div key={`v-${idx}`} className="flex flex-col items-center gap-2 shrink-0 transition-all duration-300 relative">
                                              
                                              {isCurrentlyCalculating && (
                                                  <div className="absolute -top-[calc(100%+16px)] flex flex-col items-center z-20">
                                                       <div className={`flex items-center justify-center border-2 rounded-xl bg-sky-50 border-sky-400 border-dashed text-sky-700 font-mono font-black shadow-sm scale-105`}
                                                            style={{ height: `${cellSize}px`, width: `${cellSize}px`, fontSize: `${cellSize * 0.4}px` }}>
                                                           {st.above}
                                                       </div>
                                                  </div>
                                              )}

                                              <div 
                                                  className={`relative flex items-center justify-center border-2 rounded-xl transition-all duration-300 font-mono font-black ${cellClass} ${textColor}`}
                                                  style={{ height: `${cellSize}px`, width: `${cellSize}px`, fontSize: `${cellSize * 0.4}px` }}
                                              >
                                                  {isCalculated || isCurrentlyCalculating ? (isCurrentlyCalculating ? st.curr : val) : ''}
                                                  
                                                  {isCurrentlyCalculating && isSourceLeft && (
                                                      <ArrowRight size={24} strokeWidth={3} className="absolute -left-7 text-rose-500 z-50 animate-in slide-in-from-left-2" />
                                                  )}
                                                  {isCurrentlyCalculating && (
                                                      <ArrowDown size={24} strokeWidth={3} className="absolute -top-7 text-sky-500 z-50 animate-in slide-in-from-top-2" />
                                                  )}
                                              </div>
                                              <span className="text-[9px] font-bold text-slate-400 font-mono opacity-80 mt-2">j={idx}</span>
                                          </div>
                                      );
                                  })}
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-xl border border-slate-200`} style={{ minHeight: `350px` }}>
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><Grid size={12} className="inline mr-1"/> 2D Grid Tracking</span>
                          
                          <div 
                              className="grid gap-3 md:gap-4 mt-6" 
                              style={{ 
                                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                                  width: `min(100%, ${cols * (cellSize + 16)}px)`
                              }}
                          >
                              {st.dp && st.dp.map((rowArr: number[], rIdx: number) => {
                                  return rowArr.map((val: number, cIdx: number) => {
                                      let isCalculated = val > 0;
                                      let isCurrentlyCalculating = st.hlPhase === 'calc' && rIdx === st.i && cIdx === st.j;
                                      
                                      let isSourceAbove = st.hlPhase === 'calc' && st.i !== undefined && rIdx === st.i - 1 && cIdx === st.j;
                                      let isSourceLeft = st.hlPhase === 'calc' && st.i !== undefined && rIdx === st.i && cIdx === st.j - 1;
                                      
                                      let isStart = rIdx === 0 && cIdx === 0;
                                      let isEnd = rIdx === baseM - 1 && cIdx === baseN - 1;

                                      let cellClass = "bg-transparent border-slate-300 border-dashed text-transparent"; // Empty
                                      let textColor = "text-slate-800";
                                      
                                      if (isCurrentlyCalculating) {
                                          cellClass = "bg-violet-100 border-violet-500 border-solid shadow-md scale-110 z-30";
                                          textColor = "text-violet-900";
                                      } else if (isSourceAbove) {
                                          cellClass = "bg-sky-50 border-sky-400 border-dashed shadow-sm scale-105 z-20";
                                          textColor = "text-sky-700";
                                      } else if (isSourceLeft) {
                                          cellClass = "bg-rose-50 border-rose-400 border-dashed shadow-sm scale-105 z-20";
                                          textColor = "text-rose-700";
                                      } else if ((st.hlPhase === 'seedCol' && cIdx === 0) || (st.hlPhase === 'seedRow' && rIdx === 0)) {
                                          cellClass = "bg-slate-100 border-slate-400 border-solid shadow-sm z-10";
                                      } else if (isCalculated) {
                                          cellClass = "bg-white border-slate-300 border-solid shadow-sm";
                                      }

                                      if (st.isSuccess && isEnd) {
                                          cellClass = "bg-emerald-500 border-emerald-600 border-solid shadow-lg scale-110 z-40 animate-pulse";
                                          textColor = "text-white";
                                      }

                                      return (
                                          <div 
                                              key={`${rIdx}-${cIdx}`} 
                                              className={`relative flex items-center justify-center border-2 rounded-xl transition-all duration-300 font-mono font-black ${cellClass} ${textColor}`}
                                              style={{ height: `${cellSize}px`, width: `${cellSize}px`, fontSize: `${cellSize * 0.4}px` }}
                                          >
                                              {/* Values */}
                                              {isCalculated || isCurrentlyCalculating ? (isCurrentlyCalculating ? st.curr : val) : ''}

                                              {/* Arrows */}
                                              {isCurrentlyCalculating && isSourceLeft && (
                                                  <ArrowRight size={24} strokeWidth={3} className="absolute -left-7 text-rose-500 z-50 animate-in slide-in-from-left-2" />
                                              )}
                                              {isCurrentlyCalculating && isSourceAbove && (
                                                  <ArrowDown size={24} strokeWidth={3} className="absolute -top-7 text-sky-500 z-50 animate-in slide-in-from-top-2" />
                                              )}

                                              {/* Badges */}
                                              {isStart && (
                                                  <div className="absolute -top-2 -left-2 bg-white rounded-full p-0.5 shadow-sm border border-slate-200 z-50">
                                                      <Bot size={14} className="text-indigo-500" />
                                                  </div>
                                              )}
                                              {isEnd && (
                                                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-0.5 shadow-sm border border-slate-200 z-50">
                                                      <Flag size={14} className="text-emerald-500" />
                                                  </div>
                                              )}
                                          </div>
                                      );
                                  });
                              })}
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
                <MapPin className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Unique Paths</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Dynamic Programming
                  </span>
                  <span>•</span>
                  <span>LeetCode 62</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><MapPin size={28}/> Navigate the Grid</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>There is a robot on an <code>m x n</code> grid. The robot is initially located at the <strong>top-left corner</strong> (i.e., <code>grid[0][0]</code>). The robot tries to move to the <strong>bottom-right corner</strong> (i.e., <code>grid[m - 1][n - 1]</code>).</p>
                        <p>The robot can only move either down or right at any point in time.</p>
                        <p className="font-bold mt-4">Given the two integers <code>m</code> and <code>n</code>, return the number of possible unique paths that the robot can take to reach the bottom-right corner.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-4`}>
                        <div className="w-full space-y-2">
                            <span className={`text-${themeColor}-400 block uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                            <div className="text-slate-300 break-all space-y-1">
                                <p><strong>Input:</strong> m = 3, n = 7</p>
                                <p><strong>Output:</strong> 28</p>
                            </div>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-4 mt-4`}>
                        <div className="w-full space-y-2">
                            <span className={`text-${themeColor}-400 block uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                            <div className="text-slate-300 break-all space-y-1">
                                <p><strong>Input:</strong> m = 3, n = 2</p>
                                <p><strong>Output:</strong> 3</p>
                                <p><strong>Explanation:</strong> From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:<br/>
                                1. Right -&gt; Down -&gt; Down<br/>
                                2. Down -&gt; Down -&gt; Right<br/>
                                3. Down -&gt; Right -&gt; Down</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &le; m, n &le; 100</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-sky-500"/> The Core Insight</h4>
                        <p className="text-sm leading-relaxed">Because the robot can ONLY move Down or Right, any specific cell in the grid can ONLY be reached from the cell directly <strong>Above</strong> it, or the cell directly to its <strong>Left</strong>. Therefore, the total number of unique paths to reach cell <code>(i, j)</code> is exactly the sum of the paths to reach <code>(i-1, j)</code> and <code>(i, j-1)</code>. This is a textbook 2D Dynamic Programming relationship.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2"><strong>1. 2D Array DP:</strong> Create an <code>M x N</code> matrix. Fill the top row and left column with 1s (only one way to go straight right or straight down). Iterate through the rest of the matrix applying <code>dp[i][j] = dp[i-1][j] + dp[i][j-1]</code>.</p>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>2. Space-Optimized 1D Array:</strong> Notice that calculating a cell only requires the current row and the row immediately above it. We can compress our $O(M \times N)$ grid into a single $O(N)$ row that we update in place continuously!</p>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Grid Rows (m)</label>
                            <input type="number" value={mInput} onChange={(e) => setMInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="3" min="1" max="12"/>
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Grid Cols (n)</label>
                            <input type="number" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="7" min="1" max="12"/>
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
                                Total unique paths to reach [{baseM-1}, {baseN-1}] is {String(st.finalAns)}.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'calc' ? 'text-amber-400' : (st.hlPhase === 'seedCol' || st.hlPhase === 'seedRow' || st.hlPhase === 'fill' ? 'text-rose-400' : (st.hlPhase === 'outerLoop' || st.hlPhase === 'innerLoop' || st.hlPhase === 'initArray' || st.hlPhase === 'initGrid' ? `text-${themeColor}-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Combinatorial Mathematics vs Dynamic Programming.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Grid size={24} className="text-emerald-500"/> 1. The Dynamic Programming State</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Let `dp[i][j]` be the number of unique paths to reach cell `(i, j)`. Because the robot can only move Down or Right, to reach `(i, j)`, the robot MUST have come from either `(i-1, j)` (the cell above) or `(i, j-1)` (the cell to the left).</p>
                        <p className="text-slate-600 leading-relaxed">This naturally gives us the recurrence relation: <br/><strong><code>dp[i][j] = dp[i-1][j] + dp[i][j-1]</code></strong>. By systematically calculating the grid row-by-row, we guarantee that the cells above and to the left are already computed before we need them.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><IterationCcw size={24} className="text-sky-500"/> 2. Spatial Compression</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Notice that when we are calculating a cell in Row 3, we never need to look at any cells in Row 1. We ONLY need the cells from the current row (left) and the immediately previous row (above). We can therefore compress our massive $M \times N$ matrix into a single 1D array of size $N$. As we iterate, <code>dp[j]</code> holds the value from the row above, and <code>dp[j-1]</code> holds the newly calculated value to the left.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Standard DP:</strong> Time is $O(M \times N)$ because we visit every cell once. Space is $O(M \times N)$ to store the entire DP grid.</li>
                            <li><strong>Space-Optimized DP:</strong> Time is still $O(M \times N)$, but Space is compressed to just $O(N)$ (or $O(\min(M, N))$ if we strategically choose the smaller dimension for our array).</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className={`text-${themeColor}-400`}/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a quintessential 2D DP problem. However, interviewers frequently ask the math-based follow-up to see if you remember high school combinatorics."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we solve this in pure $O(M)$ or $O(N)$ time using Mathematics?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, using Combinatorics.</p>
                            <p>To get from top-left to bottom-right, the robot MUST make exactly $(M-1)$ steps down and $(N-1)$ steps right. The total number of steps is always $(M+N-2)$. The question then becomes: out of all those steps, which ones are the 'Down' steps? This is a combination problem: $\binom[M+N-2][M-1]$. This formula can be calculated in $O(M)$ time using a single loop!"</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "If the math approach is faster, why do we bother with the DP approach?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The math approach breaks if the grid changes.</p>
                            <p>If the interviewer adds obstacles to the grid (LeetCode 63: Unique Paths II), the mathematical formula completely falls apart. The DP approach, however, handles obstacles trivially: just set <code>dp[i][j] = 0</code> if there's an obstacle, and the paths will naturally flow around it. Also, factorials cause massive integer overflow very quickly, requiring BigIntegers, whereas DP stays stable longer."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "How can we optimize the 1D array space even further?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "By choosing the smaller dimension."</p>
                            <p>Right now, we create an array of size $N$ (columns). But what if $M$ is 1000 and $N$ is 100,000? We can just swap $M$ and $N$ internally before allocating the array. Creating an array of size $\min(M, N)$ guarantees absolute minimum memory usage while producing the exact same mathematical result."</p>
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
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'calc' ? 'text-amber-400' : (st.hlPhase === 'seedCol' || st.hlPhase === 'seedRow' || st.hlPhase === 'fill' ? 'text-rose-400' : (st.hlPhase === 'outerLoop' || st.hlPhase === 'innerLoop' || st.hlPhase === 'initArray' || st.hlPhase === 'initGrid' ? `text-${themeColor}-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                                    <span className="font-mono text-3xl font-black text-slate-700">i={st.i !== undefined ? st.i : '?'}, j={st.j !== undefined ? st.j : '?'}</span>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Grid Rows (m)</label>
                              <input type="number" value={mInput} onChange={(e) => setMInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder='3' min="1" max="12"/>
                          </div>
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Grid Cols (n)</label>
                              <input type="number" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder='7' min="1" max="12"/>
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
                                    <div className={`text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2`}>Total Combinations</div>
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