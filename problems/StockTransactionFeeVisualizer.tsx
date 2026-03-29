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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, GitPullRequest, Leaf, Route, Map as MapIcon, Key, Eye, Sigma, MapPin as MapPinIcon, Target as TargetIcon, Search as SearchIcon, Bug, Clock as ClockIcon, Keyboard, AlignLeft, AlignRight, SplitSquareVertical, IterationCcw, Home, Bot, Flag, ArrowDownRight
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  spaceOptimized: {
    id: 'spaceOptimized',
    title: '1. Space-Optimized O(1) DP',
    icon: <IterationCcw size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    theme: 'emerald',
    code: `class Solution {
    public int maxProfit(int[] prices, int fee) {
        int cash = 0;
        int hold = -prices[0];
        
        for (int i = 1; i < prices.length; i++) {
            cash = Math.max(cash, hold + prices[i] - fee);
            hold = Math.max(hold, cash - prices[i]);
        }
        
        return cash;
    }
}`,
    desc: "A highly optimized State Machine DP. At any given day, we can be in one of two states: 'cash' (we don't own any stock) or 'hold' (we own a stock). To calculate today's optimal 'cash', we take the max of doing nothing (keeping yesterday's 'cash') OR selling the stock we 'hold' (adding today's price minus the fee). To calculate today's 'hold', we take the max of doing nothing (keeping yesterday's 'hold') OR buying today's stock (subtracting today's price from our 'cash'). Because we only depend on yesterday's states, we only need two variables!"
  },
  arrayDP: {
    id: 'arrayDP',
    title: '2. Standard O(N) Array DP',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    theme: 'sky',
    code: `class Solution {
    public int maxProfit(int[] prices, int fee) {
        int n = prices.length;
        int[] cash = new int[n];
        int[] hold = new int[n];
        
        cash[0] = 0;
        hold[0] = -prices[0];
        
        for (int i = 1; i < n; i++) {
            cash[i] = Math.max(cash[i - 1], hold[i - 1] + prices[i] - fee);
            hold[i] = Math.max(hold[i - 1], cash[i - 1] - prices[i]);
        }
        
        return cash[n - 1];
    }
}`,
    desc: "A standard Tabulation 1D Dynamic Programming approach. We allocate two arrays: `cash[i]` represents the max profit on day `i` if we end the day NOT holding a stock. `hold[i]` represents the max profit on day `i` if we end the day HOLDING a stock. We seed the base cases for day 0. Then we loop through the remaining days, actively choosing whether to 'Rest', 'Buy', or 'Sell' based on the maximum possible outcome derived from day `i-1`."
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
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|char|boolean|class|return|if|else|while|for|new|String|maxProfit|Solution|length|Math|max|cash|hold|prices|fee|n|i)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
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
            const isObject = ['String', 'Solution', 'Math'].includes(part);
            const isPointer = ['m', 'n', 'cash', 'hold', 'prices', 'fee', 'i'].includes(part);
            const isMapCall = ['maxProfit', 'length', 'max'].includes(part);
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

export default function StockTransactionFeeVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('spaceOptimized');
  
  const [pricesInput, setPricesInput] = useState('1, 3, 2, 8, 4, 9');
  const [feeInput, setFeeInput] = useState('2');
  
  const [basePrices, setBasePrices] = useState<number[]>([1, 3, 2, 8, 4, 9]);
  const [baseFee, setBaseFee] = useState<number>(2);

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

  const parseInputs = (pStr: string, fStr: string) => {
      let bProds = pStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 0);
      let tFee = parseInt(fStr.trim());
      
      if (bProds.length < 2) bProds = [1, 3, 2, 8, 4, 9];
      if (isNaN(tFee) || tFee < 0) tFee = 2;
      
      return { bProds: bProds.slice(0, 15), tFee }; // Cap to 15 items for UI spacing
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const { bProds, tFee } = parseInputs(pricesInput, feeInput);
      setBasePrices(bProds);
      setBaseFee(tFee);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [pricesInput, feeInput, selectedOpId]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    let prices = basePrices;
    let fee = baseFee;
    let n = prices.length;
    if (n < 2) return [];

    if (selectedOpId === 'spaceOptimized') {
        let cash = 0;
        let hold = -prices[0];
        
        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { cash, hold, prices, fee, ...st } 
        });

        add("Function Call", `public int maxProfit(int[] prices, int fee)`, 2, { hlPhase: 'init' });
        
        add("Init Cash", `int cash = 0;\nBase case: Max profit with NO stock on day 0 is 0.`, 3, { hlPhase: 'initVars' });
        add("Init Hold", `int hold = -prices[0];\nBase case: Max profit holding a stock on day 0 means buying it, so profit is -${prices[0]}.`, 4, { hlPhase: 'initVars' });

        for (let i = 1; i < n; i++) {
            add("Loop Next Day", `for (int i = 1; i < prices.length; i++)\nProcessing Day ${i} (Price: $${prices[i]}).`, 6, { hlPhase: 'loop', i });
            
            let oldCash = cash;
            let oldHold = hold;
            
            let sellProfit = oldHold + prices[i] - fee;
            let bestCash = Math.max(oldCash, sellProfit);
            cash = bestCash;
            
            add("Calculate Cash State", `cash = Math.max(cash, hold + prices[i] - fee);\nREST: Keep old cash ($${oldCash})\nSELL: oldHold ($${oldHold}) + Price ($${prices[i]}) - Fee ($${fee}) = $${sellProfit}\nMax Cash = $${bestCash}`, 7, { hlPhase: 'calcCash', i, oldCash, oldHold, sellProfit, bestCash });

            let buyProfit = oldCash - prices[i]; // Mathematically using 'cash' here is fine since if cash updated, buyProfit would be hold-fee which is <= hold.
            let bestHold = Math.max(oldHold, buyProfit);
            hold = bestHold;

            add("Calculate Hold State", `hold = Math.max(hold, cash - prices[i]);\nREST: Keep old hold ($${oldHold})\nBUY: cash ($${oldCash}) - Price ($${prices[i]}) = $${buyProfit}\nMax Hold = $${bestHold}`, 8, { hlPhase: 'calcHold', i, oldCash, oldHold, buyProfit, bestHold });
        }

        add("Return Result", `return cash;\nFinished all days! The absolute maximum profit ending with 0 stock is $${cash}.`, 11, { hlPhase: 'success', finalAns: cash });
    } 
    else if (selectedOpId === 'arrayDP') {
        let cashArr = new Array(n).fill(0);
        let holdArr = new Array(n).fill(0);

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { cashArr: [...cashArr], holdArr: [...holdArr], prices, fee, ...st } 
        });

        add("Function Call", `public int maxProfit(int[] prices, int fee)`, 2, { hlPhase: 'init' });
        
        add("Init Arrays", `int n = prices.length;\nint[] cash = new int[n];\nint[] hold = new int[n];\nAllocating arrays of size ${n}.`, 3, { hlPhase: 'initArrays' });

        cashArr[0] = 0;
        add("Seed Base Cash", `cash[0] = 0;\nBase case: Max profit with NO stock on day 0 is 0.`, 7, { hlPhase: 'seedCash', cashArr: [...cashArr] });
        
        holdArr[0] = -prices[0];
        add("Seed Base Hold", `hold[0] = -prices[0];\nBase case: Max profit holding a stock on day 0 means buying it: -${prices[0]}.`, 8, { hlPhase: 'seedHold', holdArr: [...holdArr] });

        for (let i = 1; i < n; i++) {
            add("Loop Next Day", `for (int i = 1; i < n; i++)\nProcessing Day ${i} (Price: $${prices[i]}).`, 10, { hlPhase: 'loop', i });
            
            let oldCash = cashArr[i-1];
            let oldHold = holdArr[i-1];
            
            let sellProfit = oldHold + prices[i] - fee;
            cashArr[i] = Math.max(oldCash, sellProfit);
            
            add("Calculate Cash Array", `cash[i] = Math.max(cash[i - 1], hold[i - 1] + prices[i] - fee);\nREST: Keep $${oldCash}\nSELL: $${oldHold} + $${prices[i]} - $${fee} = $${sellProfit}\ncash[${i}] = $${cashArr[i]}`, 11, { hlPhase: 'calcCash', i, oldCash, oldHold, sellProfit, bestCash: cashArr[i], cashArr: [...cashArr] });

            let buyProfit = cashArr[i-1] - prices[i];
            holdArr[i] = Math.max(oldHold, buyProfit);

            add("Calculate Hold Array", `hold[i] = Math.max(hold[i - 1], cash[i - 1] - prices[i]);\nREST: Keep $${oldHold}\nBUY: $${oldCash} - $${prices[i]} = $${buyProfit}\nhold[${i}] = $${holdArr[i]}`, 12, { hlPhase: 'calcHold', i, oldCash, oldHold, buyProfit, bestHold: holdArr[i], holdArr: [...holdArr] });
        }

        add("Return Result", `return cash[n - 1];\nArray completely filled. Returning the max profit from the final day: $${cashArr[n-1]}.`, 15, { hlPhase: 'success', finalAns: cashArr[n-1] });
    }

    return steps;
  }, [basePrices, baseFee, selectedOpId]);

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
    const code = OPERATIONS[selectedOpId as keyof typeof OPERATIONS].code;
    navigator.clipboard.writeText(code);
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

      let isCalcCash = st.hlPhase === 'calcCash';
      let isCalcHold = st.hlPhase === 'calcHold';
      
      let borderCol = isCalcCash ? 'border-emerald-400 ring-4 ring-emerald-100' : (isCalcHold ? 'border-rose-400 ring-4 ring-rose-100' : `border-${themeColor}-200`);

      if (isCalcCash || isCalcHold) {
          let oldState = isCalcCash ? st.oldCash : st.oldHold;
          let actionVal = isCalcCash ? st.sellProfit : st.buyProfit;
          let bestVal = isCalcCash ? st.bestCash : st.bestHold;
          let actionLabel = isCalcCash ? "SELL STOCK" : "BUY STOCK";
          let restLabel = isCalcCash ? "REST (KEEP CASH)" : "REST (KEEP HOLD)";
          
          let choseAction = actionVal > oldState;
          
          let actionColor = isCalcCash ? 'emerald' : 'rose';
          
          return (
              <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${borderCol} scale-105`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Activity size={14}/> DP State Machine Evaluator</span>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                      
                      {/* Day Block */}
                      <div className="flex flex-col items-center min-w-[80px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>Today</span>
                          <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 bg-slate-50 border-slate-300 text-slate-700`}>
                              Day {st.i}
                          </div>
                      </div>

                      <div className="w-px h-12 bg-slate-200 hidden md:block"></div>

                      <div className="flex items-center gap-2 md:gap-3">
                          
                          {/* Option 1: REST */}
                          <div className="flex flex-col items-center">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${!choseAction ? `text-${actionColor}-500` : 'text-slate-400'}`}>{restLabel}</span>
                              <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${!choseAction ? `bg-${actionColor}-100 border-${actionColor}-500 text-${actionColor}-800 scale-105 shadow-md` : 'bg-slate-50 border-slate-300 text-slate-600 opacity-60'}`}>
                                  <span>{oldState !== undefined ? `$${oldState}` : '?'}</span>
                                  {!choseAction && <CheckCircle2 size={16} className={`text-${actionColor}-600`}/>}
                              </div>
                          </div>
                          
                          <span className="text-xl font-bold text-slate-400 font-sans">vs</span>
                          
                          {/* Option 2: ACTION */}
                          <div className="flex flex-col items-center">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${choseAction ? `text-${actionColor}-500` : 'text-slate-400'}`}>{actionLabel}</span>
                              <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${choseAction ? `bg-${actionColor}-100 border-${actionColor}-500 text-${actionColor}-800 scale-105 shadow-md` : 'bg-slate-50 border-slate-300 text-slate-600 opacity-60'}`}>
                                  <span>{actionVal !== undefined ? `$${actionVal}` : '?'}</span>
                                  {choseAction && <CheckCircle2 size={16} className={`text-${actionColor}-600`}/>}
                              </div>
                          </div>
                          
                          <ArrowRight size={24} className={`text-${actionColor}-500 animate-pulse mx-2`}/>
                          
                          {/* Result */}
                          <div className="flex flex-col items-center animate-in slide-in-from-right-4">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-${actionColor}-600`}>{isCalcCash ? 'New Cash Max' : 'New Hold Max'}</span>
                              <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 bg-${actionColor}-100 border-${actionColor}-500 text-${actionColor}-900 shadow-md scale-110`}>
                                  ${bestVal}
                              </div>
                          </div>
                      </div>

                  </div>
              </div>
          );
      }
      return null;
  }

  const renderVisuals = () => {
      const numCols = basePrices.length;
      
      const maxGridWidth = 750;
      const maxGridHeight = 450;
      
      const cellW = maxGridWidth / (numCols + 1); // +1 for headers
      const cellH = maxGridHeight / 4; 
      const cellSize = Math.floor(Math.min(cellW, cellH, 60)); // max 60px per cell

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Active State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40 min-h-[140px]">
                  {renderActiveDashboard()}
              </div>

              {/* Graphical Visualizer */}
              <div className="flex flex-col items-center justify-center relative w-full mt-4 max-w-6xl pointer-events-none">
                  
                  {selectedOpId === 'spaceOptimized' ? (
                      <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-center`} style={{ minHeight: `350px` }}>
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute top-0 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><IterationCcw size={12} className="inline mr-1"/> O(1) Space State Machines</span>
                          
                          {/* Top floating vars */}
                          <div className="flex items-center justify-center gap-8 w-full relative mt-12 mb-8">
                               <div className="flex flex-col items-center relative z-20 transition-transform duration-500">
                                   <div className={`w-28 h-20 flex flex-col items-center justify-center border-4 rounded-2xl transition-all duration-300 shadow-xl ${st.hlPhase === 'calcCash' ? 'bg-emerald-100 border-emerald-500 text-emerald-900 scale-110 ring-4 ring-emerald-200' : 'bg-emerald-50 border-emerald-400 text-emerald-800'}`}>
                                       <span className="font-mono font-black text-2xl">${st.cash !== undefined ? st.cash : '0'}</span>
                                   </div>
                                   <span className={`text-xs font-black font-mono mt-2 uppercase tracking-widest text-emerald-600`}>Cash State</span>
                               </div>
                               <div className="flex flex-col items-center relative z-20 transition-transform duration-500">
                                   <div className={`w-28 h-20 flex flex-col items-center justify-center border-4 rounded-2xl transition-all duration-300 shadow-xl ${st.hlPhase === 'calcHold' ? 'bg-rose-100 border-rose-500 text-rose-900 scale-110 ring-4 ring-rose-200' : 'bg-rose-50 border-rose-400 text-rose-800'}`}>
                                       <span className="font-mono font-black text-2xl">${st.hold !== undefined ? st.hold : '0'}</span>
                                   </div>
                                   <span className={`text-xs font-black font-mono mt-2 uppercase tracking-widest text-rose-600`}>Hold State</span>
                               </div>
                          </div>

                          <div className="flex flex-col items-center w-full max-w-5xl gap-2 px-4 relative mt-4">
                              {/* Prices Array Rendering */}
                              <div className="flex gap-2 w-full justify-center px-4 relative items-end overflow-x-auto scrollbar-none pb-4">
                                  {basePrices.map((val: number, idx: number) => {
                                      let isCurrentlyCalculating = (st.hlPhase === 'calcMatch' || st.hlPhase === 'calcMismatch' || st.hlPhase === 'eval' || st.hlPhase === 'saveTemp' || st.hlPhase === 'calcCash' || st.hlPhase === 'calcHold') && idx === st.i;
                                      
                                      let cellClass = "bg-white border-slate-300 text-slate-700 shadow-sm"; 
                                      
                                      if (isCurrentlyCalculating) {
                                          cellClass = "bg-amber-100 border-amber-500 text-amber-900 border-solid shadow-md scale-110 z-30 ring-4 ring-amber-200";
                                      } else if (st.i !== undefined && idx < st.i) {
                                          cellClass = "bg-slate-100 border-slate-300 text-slate-400 opacity-60";
                                      }

                                      return (
                                          <div key={`p-${idx}`} className="flex flex-col items-center gap-1 shrink-0 transition-all duration-300 relative">
                                              <span className="text-[10px] font-bold text-slate-400 font-mono opacity-80 mb-1">Day {idx}</span>
                                              <div 
                                                  className={`relative flex items-center justify-center border-2 rounded-xl transition-all duration-300 font-mono font-black ${cellClass}`}
                                                  style={{ height: `${cellSize}px`, width: `${cellSize}px`, fontSize: `${cellSize * 0.4}px` }}
                                              >
                                                  {val}
                                              </div>
                                          </div>
                                      );
                                  })}
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-x-auto scrollbar-thin`} style={{ minHeight: `350px` }}>
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><Grid size={12} className="inline mr-1"/> O(N) 3-Row DP Matrix</span>
                          
                          <div 
                              className="grid gap-2 md:gap-3 mt-6 px-4" 
                              style={{ 
                                  gridTemplateColumns: `auto repeat(${numCols}, minmax(0, 1fr))`, // Auto for Row Headers
                                  width: `min(100%, ${(numCols + 1) * (cellSize + 12)}px)`
                              }}
                          >
                              {/* --- Header Row (Days) --- */}
                              <div className="flex items-end justify-center pb-1"><span className="text-slate-400 font-mono text-[10px] italic opacity-50">Day&rarr;</span></div>
                              {basePrices.map((_, cIdx) => (
                                  <div key={`h-col-${cIdx}`} className="flex items-end justify-center pb-1">
                                      <span className={`font-mono font-bold text-[10px] ${(st.i === cIdx && !st.isSuccess) ? 'text-amber-500 scale-125 font-black' : 'text-slate-500'}`}>{cIdx}</span>
                                  </div>
                              ))}

                              {/* --- Row 1: Prices --- */}
                              <div className="flex items-center justify-end pr-3 h-full">
                                  <span className={`font-mono font-black text-xs text-slate-500`}>prices</span>
                              </div>
                              {basePrices.map((val: number, cIdx: number) => {
                                  let isAct = st.i === cIdx;
                                  let bgC = isAct ? "bg-amber-100 border-amber-500 text-amber-900 shadow-md scale-110 z-20 ring-2 ring-amber-200" : "bg-slate-50 border-slate-300 text-slate-600";
                                  return (
                                      <div key={`pr-${cIdx}`} className={`relative flex items-center justify-center border-2 rounded-xl transition-all duration-300 font-mono font-black ${bgC}`} style={{ height: `${cellSize*0.8}px`, width: `${cellSize}px`, fontSize: `${cellSize * 0.35}px` }}>
                                          {val}
                                      </div>
                                  );
                              })}

                              {/* --- Row 2: Cash --- */}
                              <div className="flex items-center justify-end pr-3 h-full">
                                  <span className={`font-mono font-black text-xs text-emerald-600`}>cash</span>
                              </div>
                              {basePrices.map((_, cIdx) => {
                                  let val = st.cashArr ? st.cashArr[cIdx] : 0;
                                  let isCalculated = st.cashArr && (cIdx < (st.i || 0) || st.isSuccess || (cIdx === 0 && st.hlPhase !== 'initArrays'));
                                  let isCurrentlyCalculating = st.hlPhase === 'calcCash' && cIdx === st.i;
                                  let isSource = st.hlPhase === 'calcCash' && st.i !== undefined && cIdx === st.i - 1;
                                  let isSourceCross = st.hlPhase === 'calcHold' && st.i !== undefined && cIdx === st.i - 1;

                                  let cellClass = "bg-slate-50 border-slate-200 text-slate-300 border-dashed"; 
                                  
                                  if (isCurrentlyCalculating) cellClass = "bg-emerald-100 border-emerald-500 text-emerald-900 shadow-xl scale-125 z-30 ring-4 ring-emerald-200";
                                  else if (isSource) cellClass = "bg-emerald-50 border-emerald-400 text-emerald-700 shadow-md scale-110 z-20 border-solid ring-2 ring-emerald-300";
                                  else if (isSourceCross) cellClass = "bg-emerald-50 border-emerald-400 text-emerald-700 shadow-md scale-110 z-20 border-solid ring-2 ring-emerald-300";
                                  else if (isCalculated) cellClass = "bg-white border-slate-300 text-slate-700 border-solid shadow-sm";

                                  if (st.isSuccess && cIdx === numCols - 1) cellClass = "bg-emerald-500 border-emerald-600 text-white shadow-2xl scale-125 z-40 animate-pulse";

                                  return (
                                      <div key={`c-${cIdx}`} className={`relative flex items-center justify-center border-2 rounded-xl transition-all duration-300 font-mono font-black ${cellClass}`} style={{ height: `${cellSize}px`, width: `${cellSize}px`, fontSize: `${cellSize * 0.4}px` }}>
                                          {(isCalculated || isCurrentlyCalculating) ? `$${isCurrentlyCalculating ? st.bestCash : val}` : ''}
                                          {/* Arrow from left */}
                                          {isCurrentlyCalculating && <ArrowRight size={24} strokeWidth={3} className="absolute -left-6 text-emerald-500 z-50 animate-in slide-in-from-left-2" />}
                                          {/* Arrow from hold (cross) */}
                                          {isCurrentlyCalculating && <ArrowDownRight size={24} strokeWidth={3} className="absolute -left-5 top-5 text-emerald-500 z-50 animate-in zoom-in" style={{ transform: 'rotate(-45deg)' }}/>}
                                      </div>
                                  );
                              })}

                              {/* --- Row 3: Hold --- */}
                              <div className="flex items-center justify-end pr-3 h-full">
                                  <span className={`font-mono font-black text-xs text-rose-600`}>hold</span>
                              </div>
                              {basePrices.map((_, cIdx) => {
                                  let val = st.holdArr ? st.holdArr[cIdx] : 0;
                                  let isCalculated = st.holdArr && (cIdx < (st.i || 0) || st.isSuccess || (cIdx === 0 && st.hlPhase !== 'initArrays' && st.hlPhase !== 'seedCash'));
                                  let isCurrentlyCalculating = st.hlPhase === 'calcHold' && cIdx === st.i;
                                  let isSource = st.hlPhase === 'calcHold' && st.i !== undefined && cIdx === st.i - 1;
                                  let isSourceCross = st.hlPhase === 'calcCash' && st.i !== undefined && cIdx === st.i - 1;

                                  let cellClass = "bg-slate-50 border-slate-200 text-slate-300 border-dashed"; 
                                  
                                  if (isCurrentlyCalculating) cellClass = "bg-rose-100 border-rose-500 text-rose-900 shadow-xl scale-125 z-30 ring-4 ring-rose-200";
                                  else if (isSource) cellClass = "bg-rose-50 border-rose-400 text-rose-700 shadow-md scale-110 z-20 border-solid ring-2 ring-rose-300";
                                  else if (isSourceCross) cellClass = "bg-rose-50 border-rose-400 text-rose-700 shadow-md scale-110 z-20 border-solid ring-2 ring-rose-300";
                                  else if (isCalculated) cellClass = "bg-white border-slate-300 text-slate-700 border-solid shadow-sm";

                                  return (
                                      <div key={`h-${cIdx}`} className={`relative flex items-center justify-center border-2 rounded-xl transition-all duration-300 font-mono font-black ${cellClass}`} style={{ height: `${cellSize}px`, width: `${cellSize}px`, fontSize: `${cellSize * 0.4}px` }}>
                                          {(isCalculated || isCurrentlyCalculating) ? `$${isCurrentlyCalculating ? st.bestHold : val}` : ''}
                                          {/* Arrow from left */}
                                          {isCurrentlyCalculating && <ArrowRight size={24} strokeWidth={3} className="absolute -left-6 text-rose-500 z-50 animate-in slide-in-from-left-2" />}
                                          {/* Arrow from cash (cross) */}
                                          {isCurrentlyCalculating && <ArrowDownRight size={24} strokeWidth={3} className="absolute -left-5 -top-5 text-rose-500 z-50 animate-in zoom-in" style={{ transform: 'rotate(45deg)' }}/>}
                                      </div>
                                  );
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
                <TrendingUp className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Best Time to Buy & Sell Stock</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      State Machine DP
                  </span>
                  <span>•</span>
                  <span>LeetCode 714</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><DollarSign size={28}/> Profit Maximization</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i</code>th day, and an integer <code>fee</code> representing a transaction fee.</p>
                        <p>Find the maximum profit you can achieve. You may complete as many transactions as you like, but you need to pay the transaction fee for each transaction (each buy-sell pair).</p>
                        <p className="font-bold mt-4">Note: You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-4`}>
                        <div className="w-full space-y-2">
                            <span className={`text-${themeColor}-400 block uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                            <div className="text-slate-300 break-all space-y-1">
                                <p><strong>Input:</strong> prices = [1,3,2,8,4,9], fee = 2</p>
                                <p><strong>Output:</strong> 8</p>
                                <p><strong>Explanation:</strong> The maximum profit can be achieved by:<br/>
                                - Buying at prices[0] = 1<br/>
                                - Selling at prices[3] = 8<br/>
                                - Buying at prices[4] = 4<br/>
                                - Selling at prices[5] = 9<br/>
                                The total profit is ((8 - 1) - 2) + ((9 - 4) - 2) = 8.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &le; prices.length &le; 5 * 10^4</li>
                            <li>1 &le; prices[i] &lt; 5 * 10^4</li>
                            <li>0 &le; fee &lt; 5 * 10^4</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-sky-500"/> The Core Insight</h4>
                        <p className="text-sm leading-relaxed">Because we can perform unlimited transactions but cannot hold more than one stock at a time, this problem perfectly maps to a <strong>Finite State Machine</strong>. At the end of every day, we are strictly in one of two states: <code>cash</code> (we have no stock) or <code>hold</code> (we have a stock). The max profit of today's state depends entirely on the max profit of yesterday's states.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2"><strong>1. Array DP:</strong> We create two arrays `cash[]` and `hold[]`. For day `i`, `cash[i]` is the max of `cash[i-1]` (Rest) or `hold[i-1] + price - fee` (Sell). `hold[i]` is the max of `hold[i-1]` (Rest) or `cash[i-1] - price` (Buy).</p>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>2. Space-Optimized:</strong> Notice that day `i` ONLY depends on day `i-1`. We don't need arrays at all! We can just keep two variables `cash` and `hold` and continuously overwrite them as we loop through the prices, dropping space to O(1).</p>
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
                        <div className="flex-[3] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Prices Array</label>
                            <input type="text" value={pricesInput} onChange={(e) => setPricesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="1, 3, 2, 8..." />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Fee</label>
                            <input type="number" value={feeInput} onChange={(e) => setFeeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-center`} placeholder="2" min="0"/>
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
                                Maximum achievable profit is ${String(st.finalAns)}.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'calcCash' ? 'text-emerald-400' : (st.hlPhase === 'calcHold' ? 'text-rose-400' : (st.hlPhase === 'eval' ? `text-${themeColor}-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Mastering State Machine Dynamic Programming.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 1. The State Machine</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Instead of a 1D or 2D grid of numbers, think of this problem as a robot that can only be in two states: <code>CASH</code> (empty hands) or <code>HOLD</code> (carrying a stock). Every day, the robot can either do nothing (stay in current state) or take an action (buy or sell) to jump to the other state.</p>
                        <p className="text-slate-600 leading-relaxed">The max money the robot can have in the <code>CASH</code> state today is the MAX of: remaining in <code>CASH</code> from yesterday, OR transitioning from yesterday's <code>HOLD</code> state by selling the stock today (and paying the fee).</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><IterationCcw size={24} className="text-sky-500"/> 2. Spatial Compression</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Because the robot's decisions today ONLY depend on what the robot's max money was <em>yesterday</em>, we do not need to record the history of all previous days. We can completely throw away the $O(N)$ arrays and just keep two variables: <code>cash</code> and <code>hold</code>. We continuously overwrite them as we loop through the days, compressing space to $O(1)$.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Sigma size={24} className="text-rose-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Standard Array DP:</strong> Time is $O(N)$ because we loop through the prices once. Space is $O(N)$ to store the two full length DP arrays.</li>
                            <li><strong>Space-Optimized DP:</strong> Time is still $O(N)$, but Space is compressed to an absolute minimum of $O(1)$ constant time by just using two integer variables.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is the capstone problem for the legendary 'Stock Problem' series on LeetCode. Mastering the State Machine approach allows you to solve ALL stock problems (with cooldowns, k-transactions, etc.) effortlessly."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "In the O(1) solution, we update `cash`, then immediately use `cash` to calculate the new `hold`. Shouldn't we use a temporary variable `oldCash`?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Mathematically, it works out perfectly without it.</p>
                            <p>If we update <code>cash</code> (meaning we sold a stock today), then calculating <code>hold</code> with this new cash means we are evaluating buying the stock back on the exact same day. If we sell and buy on the same day, our net profit changes by exactly <code>-fee</code>, which is strictly worse than doing nothing. Therefore, the <code>Math.max</code> function naturally ignores the freshly updated cash and correctly falls back to the old <code>hold</code> state. It's a beautiful shortcut."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "How would this code change if the problem added a 1-day 'Cooldown' period after selling?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "We just add a third state.</p>
                            <p>Instead of just <code>cash</code> and <code>hold</code>, we have <code>hold</code>, <code>sold</code> (the cooldown state), and <code>rest</code> (cash available to buy). When we buy, we transition from <code>rest</code>. When we sell, we transition from <code>hold</code> to <code>sold</code>. On the next day, <code>sold</code> automatically transitions into <code>rest</code>. It's just a 3-node state machine!"</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "Why is the initial base case for <code>hold</code> set to <code>-prices[0]</code> instead of 0?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because we start with 0 money."</p>
                            <p>To be in the <code>hold</code> state on Day 0, we must have purchased the stock on Day 0. Since we start with a balance of $0, buying a stock worth $X leaves us with a profit balance of $-X$. It accurately represents our debt before we finally sell for a profit."</p>
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
                  <div className={`m-5 p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden shrink-0 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                      <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                          <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                          <div className="flex gap-2 items-center">
                              <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                          </div>
                      </div>
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'calcCash' ? 'text-emerald-400' : (st.hlPhase === 'calcHold' ? 'text-rose-400' : (st.hlPhase === 'eval' ? `text-${themeColor}-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                                    <span className="font-mono text-3xl font-black text-slate-700">i={st.i !== undefined ? st.i : '?'}</span>
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
                          <div className="flex-[3] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Prices Array</label>
                              <input type="text" value={pricesInput} onChange={(e) => setPricesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder='1, 3, 2...' />
                          </div>
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Fee</label>
                              <input type="number" value={feeInput} onChange={(e) => setFeeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder='2' min="0" />
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
                                    <div className={`text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2`}>Maximum Achievable Profit</div>
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