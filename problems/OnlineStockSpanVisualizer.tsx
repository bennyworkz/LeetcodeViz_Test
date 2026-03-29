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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  monotonicStack: {
    id: 'monotonicStack',
    title: '1. Monotonic Stack (Pairs)',
    icon: <TrendingUp size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    theme: 'emerald',
    code: `public int[] calculateSpans(int[] prices) {
    int n = prices.length;
    int[] spans = new int[n];
    Stack<int[]> stack = new Stack<>();
    for (int i = 0; i < n; i++) {
        int span = 1;
        while (!stack.isEmpty() && stack.peek()[0] <= prices[i]) {
            span += stack.pop()[1];
        }
        stack.push(new int[]{prices[i], span});
        spans[i] = span;
    }
    return spans;
}`,
    desc: "The Monotonic Stack approach storing [Price, Span] pairs. When processing a new daily price, we initialize its span to 1 (representing itself). We then look at the top of the stack. If the previous price is less than or equal to today's price, today's price 'eclipses' it. We pop that previous price off the stack and ADD its span to our current span. This compresses the historical data: we don't need to check all those smaller days again because their spans are now safely absorbed into our new, larger span pair."
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|boolean|char|return|if|else|while|for|continue|break|new|String|calculateSpans|prices|length|spans|Stack|stack|isEmpty|peek|pop|push|span|n|i)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Stack', 'Integer'].includes(part);
            const isPointer = ['prices', 'spans', 'stack', 'span', 'n', 'i'].includes(part);
            const isMapCall = ['calculateSpans', 'length', 'isEmpty', 'peek', 'pop', 'push'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^'].includes(part.trim());
            
            return (
              <span 
                key={idx} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-emerald-400 font-bold' : 
                  isMapCall ? 'text-sky-300' :
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

export default function OnlineStockSpanVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('monotonicStack');
  
  const [pricesInput, setPricesInput] = useState('100, 80, 60, 70, 60, 75, 85');
  
  const [basePrices, setBasePrices] = useState<number[]>([100, 80, 60, 70, 60, 75, 85]);
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
      let parsed = pricesInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      if (parsed.length === 0) parsed = [100, 80, 60, 70, 60, 75, 85];
      if (parsed.length > 12) parsed = parsed.slice(0, 12); // Limit strictly for UI rendering purposes
      
      setBasePrices(parsed);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [pricesInput, selectedOpId]);

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
    const prices = basePrices;
    const n = prices.length;

    let spans = new Array(n).fill(0);
    let stack: {price: number, span: number}[] = [];

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { prices, spans: [...spans], stack: [...stack], n, ...st } 
    });

    if (selectedOpId === 'monotonicStack') {
        
        add("Function Call", `public int[] calculateSpans(int[] prices)`, 1, {});
        
        // Line 2-4
        add("Initialize Structures", `int n = ${n};\nint[] spans = new int[n];\nStack<int[]> stack = new Stack<>();\nCreated spans array and an empty stack to hold [price, span] pairs.`, 4, { hlInit: true });

        // Line 5-12
        for (let i = 0; i < n; i++) {
            let currPrice = prices[i];
            add("For Loop Iteration", `for (int i = ${i}; i < n; i++)\nProcessing Day ${i} (Price: $${currPrice}).`, 5, { i, currPrice, hlI: true });

            // Line 6
            let currentSpan = 1;
            add("Initialize Span", `int span = 1;\nEvery price has a minimum span of 1 (itself).`, 6, { i, currPrice, currentSpan, hlInitSpan: true });

            // Line 7
            while (true) {
                let isEmpty = stack.length === 0;
                let topItem = !isEmpty ? stack[stack.length - 1] : null;
                let topPrice = topItem ? topItem.price : -1;
                let topSpan = topItem ? topItem.span : -1;
                let isEclipsing = !isEmpty && topPrice <= currPrice;

                add("While Condition Check", `while (!stack.isEmpty() && stack.peek()[0] <= prices[${i}])\nIs stack empty? (${isEmpty}). If not, is stack top price ($${topPrice}) <= $${currPrice}? (${!isEmpty ? (isEclipsing ? 'Yes' : 'No') : 'N/A'})`, 7, { i, currPrice, currentSpan, topItem, isCheckingWhile: true, isEclipsing, hlStackTop: !isEmpty });

                if (!isEmpty && isEclipsing) {
                    // Line 8
                    let popped = stack.pop();
                    currentSpan += popped!.span;
                    add("Pop and Accumulate", `span += stack.pop()[1];\nPopped [$${popped!.price}, Span:${popped!.span}]. Added its span to current. Total span is now ${currentSpan}.`, 8, { i, currPrice, currentSpan, poppedItem: popped, hlPop: true });
                } else {
                    break;
                }
            }

            // Line 10
            stack.push({price: currPrice, span: currentSpan});
            add("Push Pair to Stack", `stack.push(new int[]{prices[${i}], span});\nPushing [$${currPrice}, Span:${currentSpan}] onto the stack to compress history.`, 10, { i, currPrice, currentSpan, hlPush: true });

            // Line 11
            spans[i] = currentSpan;
            add("Update Output Array", `spans[${i}] = span;\nSaving final span ${currentSpan} for Day ${i}.`, 11, { i, currPrice, currentSpan, hlUpdateSpans: i });
        }

        // Line 13
        add("Return Result", `return spans;\nFinished calculating spans for all days.`, 13, { isSuccess: true, finalAns: spans });

    }

    return steps;
  }, [basePrices, selectedOpId]);

  // Derived state
  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  // --- Calculations for Bar Chart ---
  const priceStats = useMemo(() => {
      let prices = st.prices || basePrices;
      if (!prices || prices.length === 0) return { max: 100 };
      let max = Math.max(...prices);
      // Give 10% headroom
      max = Math.ceil(max * 1.1);
      return { max };
  }, [st.prices, basePrices]);

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
      if (st.prices === undefined) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-6 px-4 pb-12">
              
              {/* Top: Stock Prices Bar Chart */}
              <div className="flex flex-col items-center w-full">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-${themeColor}-50 text-${themeColor}-600 border-${themeColor}-200 flex items-center gap-2`}><BarChart2 size={12}/> Daily Stock Prices</span>
                  
                  <div className="flex flex-wrap justify-center gap-1 md:gap-2 relative z-10 w-full max-w-5xl px-4 items-end h-[160px] border-b-2 border-slate-200 pb-2">
                      
                      {/* Span Highlights (Draw a bracket under the active span) */}
                      {st.currentSpan !== undefined && st.i !== undefined && st.currentSpan > 1 && (
                          <div className="absolute bottom-[-16px] h-2 border-b-2 border-l-2 border-r-2 border-emerald-500 rounded-b-sm transition-all duration-500 z-0" 
                               style={{
                                   // A bit of a hacky positioning based on flex boxes, visually approximates the span
                                   right: `calc(50% - ${st.i * 2.5}rem + 1rem)`, // Adjusting roughly to align with the active item
                                   width: `${st.currentSpan * 3.5}rem`
                               }}>
                              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded shadow-sm">Span {st.currentSpan}</span>
                          </div>
                      )}

                      {st.prices.map((val: number, idx: number) => {
                          let isCurrentI = st.i === idx;
                          let isInCurrentSpan = st.i !== undefined && st.currentSpan !== undefined && idx <= st.i && idx > st.i - st.currentSpan;
                          let isTargetInStack = st.isCheckingWhile && st.topItem && st.topItem.price <= val && idx === st.i - st.currentSpan; // Roughly tracking
                          let isResolved = st.spans[idx] !== 0;

                          // Height calc
                          let pct = Math.max(5, (val / priceStats.max) * 100);
                          
                          let bgClass = "bg-slate-100 border-slate-300";
                          let textClass = "text-slate-500";
                          let heightFill = "bg-slate-300";

                          if (isCurrentI) {
                              bgClass = `bg-emerald-100 ring-4 ring-emerald-200 border-emerald-400 z-20 scale-105`;
                              textClass = `text-emerald-800`;
                              heightFill = "bg-gradient-to-t from-emerald-300 to-emerald-500";
                          } else if (isInCurrentSpan && !isCurrentI) {
                              bgClass = `bg-emerald-50 border-emerald-300 z-10`;
                              textClass = `text-emerald-600`;
                              heightFill = "bg-emerald-200 opacity-60";
                          } else if (st.isSuccess || isResolved) {
                              bgClass = "bg-white border-slate-200";
                              textClass = "text-slate-400";
                              heightFill = "bg-slate-200";
                          } else {
                              bgClass = "bg-white border-slate-300";
                              heightFill = "bg-slate-200";
                          }

                          return (
                              <div key={`price-${idx}`} className={`flex flex-col items-center gap-1 transition-all duration-500 relative`}>
                                  <div className={`w-10 md:w-12 border-2 rounded-t-md shadow-sm ${bgClass} transition-all duration-300 flex flex-col justify-end overflow-hidden relative`} style={{ height: '120px' }}>
                                      
                                      {/* Bar Fill */}
                                      <div className={`w-full ${heightFill} transition-all duration-500 absolute bottom-0 left-0 right-0`} style={{ height: `${pct}%` }}></div>
                                      
                                      <div className="absolute top-1 left-0 w-full flex justify-center z-10">
                                          <span className={`font-mono font-black text-xs md:text-sm ${textClass} bg-white/70 px-1 rounded`}>
                                              ${val}
                                          </span>
                                      </div>
                                  </div>
                                  <span className={`font-mono text-[9px] font-black tracking-widest ${isCurrentI ? 'text-emerald-600' : 'text-slate-400'}`}>Day {idx}</span>
                              </div>
                          )
                      })}
                  </div>
              </div>

              {/* Middle: Stack and Operations */}
              <div className="flex flex-col md:flex-row w-full max-w-4xl gap-8 justify-center items-stretch mt-6">
                  
                  {/* Left: The Monotonic Stack */}
                  <div className="flex-1 flex flex-col items-center">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-sky-50 text-sky-600 border-sky-200 flex items-center gap-2`}><Layers size={12}/> Monotonic Stack [Price, Span]</span>
                      
                      <div className="w-56 md:w-64 h-[240px] bg-slate-800 rounded-b-3xl rounded-t-lg border-4 border-slate-700 shadow-2xl flex flex-col justify-end p-3 relative overflow-hidden">
                          {/* Inner Shadow to look like a container */}
                          <div className="absolute inset-0 shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)] pointer-events-none z-0"></div>
                          
                          <div className="flex flex-col gap-1 w-full justify-end items-center relative z-10">
                              {st.stack.length === 0 && !st.hlPop && !st.hlPush && (
                                  <span className="text-slate-500 font-mono italic text-sm mb-4">Stack Empty</span>
                              )}

                              {/* Render stack items */}
                              {st.stack.map((item: any, sIdx: number) => {
                                  let isTop = sIdx === st.stack.length - 1;
                                  let isBeingPeeked = st.isCheckingWhile && isTop;
                                  
                                  let bgClass = "bg-slate-100 border-slate-400 text-slate-800";
                                  if (isBeingPeeked) {
                                      bgClass = st.isEclipsing ? "bg-rose-100 border-rose-400 text-rose-800 ring-2 ring-rose-300" : "bg-emerald-100 border-emerald-400 text-emerald-800 ring-2 ring-emerald-300";
                                  }

                                  return (
                                      <div key={`stack-${sIdx}`} className={`w-full py-2 px-3 rounded-lg border-2 shadow-md flex justify-between items-center transition-all duration-300 ${bgClass} ${isTop ? 'scale-100' : 'scale-95 opacity-80'}`}>
                                          <div className="flex flex-col items-start">
                                              <span className="text-[8px] font-black uppercase text-slate-400 leading-tight">Price</span>
                                              <span className="font-mono text-base font-black">${item.price}</span>
                                          </div>
                                          <div className="flex flex-col items-end">
                                              <span className="text-[8px] font-black uppercase text-slate-400 leading-tight">Span</span>
                                              <span className="font-mono text-base font-black text-indigo-600">{item.span}</span>
                                          </div>
                                      </div>
                                  )
                              })}

                              {/* Render Popping Item */}
                              {st.hlPop && st.poppedItem !== undefined && (
                                  <div className={`absolute -top-16 w-[calc(100%-1.5rem)] py-2 px-3 rounded-lg border-2 shadow-lg flex justify-between items-center bg-rose-200 border-rose-500 text-rose-900 animate-out slide-out-to-right-16 fade-out duration-700 z-20`}>
                                      <div className="flex flex-col items-start">
                                          <span className="text-[8px] font-black uppercase opacity-60 leading-tight">Price</span>
                                          <span className="font-mono text-base font-black">${st.poppedItem.price}</span>
                                      </div>
                                      <div className="flex flex-col items-end">
                                          <span className="text-[8px] font-black uppercase opacity-60 leading-tight">Span</span>
                                          <span className="font-mono text-base font-black">{st.poppedItem.span}</span>
                                      </div>
                                  </div>
                              )}

                              {/* Render Pushing Item */}
                              {st.hlPush && st.currPrice !== undefined && st.currentSpan !== undefined && (
                                  <div className={`absolute -top-16 w-[calc(100%-1.5rem)] py-2 px-3 rounded-lg border-2 shadow-lg flex justify-between items-center bg-emerald-200 border-emerald-500 text-emerald-900 animate-in slide-in-from-top-16 fade-in duration-500 z-20`}>
                                      <div className="flex flex-col items-start">
                                          <span className="text-[8px] font-black uppercase opacity-60 leading-tight">Price</span>
                                          <span className="font-mono text-base font-black">${st.currPrice}</span>
                                      </div>
                                      <div className="flex flex-col items-end">
                                          <span className="text-[8px] font-black uppercase opacity-60 leading-tight">Span</span>
                                          <span className="font-mono text-base font-black">{st.currentSpan}</span>
                                      </div>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>

                  {/* Right: Logic Box */}
                  <div className="flex-1 flex flex-col justify-center gap-4">
                      {st.isCheckingWhile && st.currPrice !== undefined && st.topItem && (
                          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xl animate-in slide-in-from-right-8 fade-in">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Is Past Price Eclipsed?</span>
                              <div className="flex items-center gap-3 font-mono font-black text-xl">
                                  <span className="text-slate-500">${st.topItem.price}</span>
                                  <span className="text-slate-400">&lt;=</span>
                                  <span className="text-emerald-600">${st.currPrice} ?</span>
                              </div>
                              <div className={`mt-3 px-3 py-1 rounded text-sm font-bold w-fit ${st.isEclipsing ? 'bg-rose-100 text-rose-700 border border-rose-300' : 'bg-slate-100 text-slate-500 border border-slate-300'}`}>
                                  {st.isEclipsing ? 'Yes! Pop and absorb span.' : 'No. Stack maintains order.'}
                              </div>
                          </div>
                      )}

                      {st.hlPop && st.poppedItem !== undefined && st.currentSpan !== undefined && (
                          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xl animate-in slide-in-from-right-8 fade-in border-rose-200 ring-2 ring-rose-100">
                              <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-2 block">Absorb Popped Span</span>
                              <div className="flex items-center gap-2 font-mono text-sm text-slate-600">
                                  <span>span</span>
                                  <span>+=</span>
                                  <span>popped.span (<span className="font-bold text-rose-500">{st.poppedItem.span}</span>)</span>
                              </div>
                              <div className="mt-2 text-2xl font-black font-mono text-emerald-500">
                                  = {st.currentSpan} days
                              </div>
                          </div>
                      )}
                      
                      {st.hlInitSpan && st.currentSpan !== undefined && (
                          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xl animate-in slide-in-from-right-8 fade-in">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Initialize Current Span</span>
                              <div className="text-2xl font-black font-mono text-emerald-500">
                                  span = {st.currentSpan}
                              </div>
                          </div>
                      )}
                  </div>
              </div>

              {/* Bottom: Answer Array */}
              <div className="flex flex-col items-center w-full mt-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center gap-2`}><Database size={12}/> Output Array: spans</span>
                  
                  <div className="flex flex-wrap justify-center gap-1 md:gap-2 relative z-10 w-full max-w-5xl px-4">
                      {st.spans.map((val: number, idx: number) => {
                          let isJustUpdated = st.hlUpdateSpans === idx;
                          let isResolved = val !== 0;

                          let bgClass = "bg-slate-100 border-slate-300";
                          let textClass = "text-slate-400"; // 0s are faded

                          if (isJustUpdated) {
                              bgClass = "bg-emerald-100 border-emerald-400 ring-4 ring-emerald-200 z-20 scale-110";
                              textClass = "text-emerald-700";
                          } else if (isResolved) {
                              bgClass = "bg-emerald-50 border-emerald-300";
                              textClass = "text-emerald-600";
                          }

                          return (
                              <div key={`ans-${idx}`} className={`flex flex-col items-center gap-1 transition-all duration-500`}>
                                  <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-2 rounded-xl shadow-sm ${bgClass} transition-all duration-300`}>
                                      <span className={`font-mono font-black text-xl ${textClass}`}>
                                          {val}
                                      </span>
                                  </div>
                                  <span className={`font-mono text-[9px] font-black tracking-widest ${isJustUpdated ? 'text-emerald-600' : 'text-slate-400'}`}>i={idx}</span>
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
                <TrendingUp className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Online Stock Span</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Monotonic Stack
                  </span>
                  <span>•</span>
                  <span>LeetCode 901</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><TrendingUp size={28}/> Online Stock Span</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Design a class <code>StockSpanner</code> which collects daily price quotes for some stock and returns <strong>the span</strong> of that stock's price for the current day.</p>
                        <p>The <strong>span</strong> of the stock's price in one day is the maximum number of consecutive days (starting from that day and going backward) for which the stock price was less than or equal to the price of that day.</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>For example, if the prices of the stock in the last four days is <code>[7, 2, 1, 2]</code> and the price of the stock today is <code>2</code>, then the span of today is <code>4</code> because starting from today, the price of the stock was less than or equal <code>2</code> for <code>4</code> consecutive days.</li>
                            <li>Also, if the prices of the stock in the last four days is <code>[7, 34, 1, 2]</code> and the price of the stock today is <code>8</code>, then the span of today is <code>3</code> because starting from today, the price of the stock was less than or equal <code>8</code> for <code>3</code> consecutive days.</li>
                        </ul>
                        <p className="font-bold mt-4">Implement the <code>StockSpanner</code> class:</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li><code>StockSpanner()</code> Initializes the object of the class.</li>
                            <li><code>int next(int price)</code> Returns the span of the stock's price given that today's price is <code>price</code>.</li>
                        </ul>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input</strong><br/>["StockSpanner", "next", "next", "next", "next", "next", "next", "next"]<br/>[[], [100], [80], [60], [70], [60], [75], [85]]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output</span>
                       <span className="text-slate-300 block mb-4">[null, 1, 1, 1, 2, 1, 4, 6]</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation</span>
                       <span className="text-slate-400 text-xs">StockSpanner stockSpanner = new StockSpanner();<br/>stockSpanner.next(100); // return 1<br/>stockSpanner.next(80);  // return 1<br/>stockSpanner.next(60);  // return 1<br/>stockSpanner.next(70);  // return 2<br/>stockSpanner.next(60);  // return 1<br/>stockSpanner.next(75);  // return 4, because the last 4 prices (including today's price of 75) were less than or equal to today's price.<br/>stockSpanner.next(85);  // return 6</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &lt;= price &lt;= 10^5</li>
                            <li>At most 10^4 calls will be made to next.</li>
                        </ul>
                    </div>
                </section>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> StockSpanner.java</span>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Stock Prices Input (Comma Separated)</label>
                            <input type="text" value={pricesInput} onChange={(e) => setPricesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="100, 80, 60, 70, 60, 75, 85" />
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
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Computed spans for all stock prices.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPop || st.hlUpdateSpans ? 'text-rose-400' : (st.hlPush || st.hlInitSpan ? `text-${themeColor}-400` : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Layers size={14} className={`text-${themeColor}-500`}/> Stack Compression Render</span>
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
                    <div className="inline-flex items-center justify-center p-4 bg-emerald-100 text-emerald-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Mastering Monotonic Stacks to compress historical state.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Layers size={24} className="text-emerald-500"/> 1. The Monotonic Stack Concept</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">"Monotonic" means strictly increasing or strictly decreasing. In this problem, we maintain a <strong>Monotonic Decreasing Stack</strong> of prices.</p>
                        <p className="text-slate-600 leading-relaxed">The invariant is: the prices stored in the stack will always be strictly decreasing from bottom to top. If we encounter a new price that breaks this rule (i.e., it's higher than the top of the stack), the new price completely "eclipses" the old one. We pop the smaller past prices off the stack because any future price that needs to look backward will hit our new, larger price first anyway!</p>
                    </div>

                    {/* Section 2 - TIME COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> 2. Time Complexity: Amortized O(N)</h4>
                        <p className="mb-4 text-slate-600">At first glance, a <code>while</code> loop inside a <code>next()</code> call looks like it could be $O(N)$ per call, making a full pass $O(N^2)$. But it is strictly amortized $O(1)$ per call.</p>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>The Proof:</strong> Look at what goes into and comes out of the stack. Every single price is pushed onto the stack exactly <strong>once</strong>.</li>
                            <li>Every price is popped from the stack at most <strong>once</strong>.</li>
                            <li>Therefore, the total number of operations inside the <code>while</code> loop across all $N$ calls is bounded by $N$. The average (amortized) time per <code>next()</code> call is $O(1)$.</li>
                        </ul>
                    </div>

                    {/* Section 3 - SPACE COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-sky-500"/> 3. Space Complexity Analysis: O(N)</h4>
                        <p className="mb-4 text-slate-600">The space complexity is defined by the stack.</p>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div>
                                <strong className="text-slate-800 block mb-1">Worst Case: O(N) Space</strong>
                                <span className="text-sm text-slate-600">If the prices are strictly decreasing (e.g., <code>[100, 90, 80, 70, 60]</code>), the `while` loop condition is never met. Every price pair is pushed onto the stack, making the stack size grow linearly with $N$.</span>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Online Stock Span is the quintessential problem for understanding data compression within stacks. Be prepared to explain exactly why we store pairs instead of just raw values or indices."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Why do we store an int array <code>[price, span]</code> in the stack instead of just the <code>price</code>?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "If we only stored prices, when we pop a smaller price, we would successfully remove it from the stack, but we would lose the information about how many days <em>that</em> smaller price had previously spanned.</p>
                            <p>By storing the pre-calculated span alongside the price, we effectively 'compress' the historical data. When a new high price pops a smaller price, it absorbs the smaller price's entire history in a single $O(1)$ addition step."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "In the 'Daily Temperatures' problem we just stored indices on the stack. Could we do that here?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Technically yes, if we had access to the full array of prices in advance. We could store the index, and calculate the span by doing <code>currentIndex - stack.peek()</code>.</p>
                            <p>However, Stock Spanner is an <em>Online</em> problem (designed as a class processing a stream via <code>next(price)</code>). In an online system, we don't hold the entire array in memory, and maintaining a strictly growing global index integer might not be ideal. Storing the <code>[price, span]</code> pairs makes the class completely self-contained and decoupled from global index tracking."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><Layers size={24}/></span>
                            <span>Q3: "If the input prices are [1, 2, 3, 4, 5], what does the stack look like at the end?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The stack will contain exactly one element: <code>[5, 5]</code>.</p>
                            <p>Because every new price is strictly greater than the previous one, it will pop the previous element and absorb its span. Day 1: <code>[1, 1]</code>. Day 2 pops it: <code>[2, 2]</code>. Day 3 pops it: <code>[3, 3]</code>. The Monotonic Stack perfectly compresses an increasing sequence into a single memory reference."</p>
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
                              <Layers size={20}/>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPop || st.hlUpdateSpans ? 'text-rose-400' : (st.hlPush || st.hlInitSpan ? `text-${themeColor}-400` : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Prices Input (Max 12)</label>
                              <input type="text" value={pricesInput} onChange={(e) => setPricesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="100, 80, 60..." />
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
                      <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-500 flex flex-col justify-start items-center pt-24" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom * 1.3})`, transformOrigin: 'top center' }}>
                           {renderVisuals()}
                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                
                                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10"><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">COMPLETED</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Calculated Stock Spans</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Final Answer Array</div>
                                    <div className="font-mono text-white text-3xl font-black leading-relaxed break-all">[{st.finalAns.join(', ')}]</div>
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