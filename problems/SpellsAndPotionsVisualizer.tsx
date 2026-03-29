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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles,
  ArrowRightLeft
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  binarySearch: {
    id: 'binarySearch',
    title: '1. Sort + Binary Search',
    icon: <Wand2 size={16} />,
    complexity: 'Time: O((M+N) log M) | Space: O(log M)',
    theme: 'fuchsia',
    code: `public int[] successfulPairs(int[] spells, int[] potions, long success) {
    Arrays.sort(potions);
    int[] pairs = new int[spells.length];
    
    for (int i = 0; i < spells.length; i++) {
        int spell = spells[i];
        int left = 0;
        int right = potions.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            long product = (long) spell * potions[mid];
            
            if (product >= success) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        pairs[i] = potions.length - left;
    }
    return pairs;
}`,
    desc: "The Optimal Binary Search Approach. First, we sort the 'potions' array. Why? Because if a potion of strength X forms a successful pair with a spell, then any potion stronger than X will ALSO form a successful pair! For each spell, we use Binary Search on the sorted potions array to find the *first* (weakest) potion that meets the success threshold. Once we find that boundary (which ends up at the 'left' pointer), we know that all potions from 'left' to the end of the array are successful. The number of successful pairs is simply the total number of potions minus the 'left' index."
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'fuchsia' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|boolean|class|return|if|else|new|String|successfulPairs|spells|potions|success|Arrays|sort|length|pairs|spell|left|right|mid|product)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'boolean', 'class', 'return', 'if', 'else', 'new', 'break'].includes(part);
            const isObject = ['String', 'Arrays'].includes(part);
            const isPointer = ['spells', 'potions', 'success', 'pairs', 'spell', 'left', 'right', 'mid', 'product', 'i'].includes(part);
            const isMapCall = ['successfulPairs', 'sort', 'length'].includes(part);
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

export default function SpellsAndPotionsVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('binarySearch');
  
  const [spellsInput, setSpellsInput] = useState('5, 1, 3');
  const [potionsInput, setPotionsInput] = useState('1, 2, 3, 4, 5');
  const [successInput, setSuccessInput] = useState('7');
  
  const [baseSpells, setBaseSpells] = useState<number[]>([5, 1, 3]);
  const [basePotions, setBasePotions] = useState<number[]>([1, 2, 3, 4, 5]);
  const [baseSuccess, setBaseSuccess] = useState<number>(7);

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
      let parsedSpells = spellsInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      let parsedPotions = potionsInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      let parsedSuccess = parseInt(successInput.trim(), 10);
      
      if (parsedSpells.length === 0) parsedSpells = [5, 1, 3];
      if (parsedPotions.length === 0) parsedPotions = [1, 2, 3, 4, 5];
      if (isNaN(parsedSuccess)) parsedSuccess = 7;

      if (parsedSpells.length > 8) parsedSpells = parsedSpells.slice(0, 8); // UI bounds
      if (parsedPotions.length > 10) parsedPotions = parsedPotions.slice(0, 10);

      setBaseSpells(parsedSpells);
      setBasePotions(parsedPotions);
      setBaseSuccess(parsedSuccess);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [spellsInput, potionsInput, successInput, selectedOpId]);

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
    const spells = [...baseSpells];
    let potions = [...basePotions];
    const successTarget = baseSuccess;
    
    let pairs = new Array(spells.length).fill(0);

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            spells, potions: [...potions], success: successTarget, pairs: [...pairs], ...st 
        } 
    });

    add("Function Call", `public int[] successfulPairs(int[] spells, int[] potions, long success=${successTarget})`, 1, {});

    potions.sort((a, b) => a - b);
    add("Sort Potions", `Arrays.sort(potions);\nCrucial Step: Sorting the potions array in ascending order. This guarantees that if potion[i] is successful, all potions after it are also successful.`, 2, { hlSort: true });

    add("Initialize Pairs", `int[] pairs = new int[spells.length];\nCreate output array of length ${spells.length}.`, 3, { hlInit: true });

    for (let i = 0; i < spells.length; i++) {
        let spell = spells[i];
        add("Next Spell", `for (int i = ${i}; i < spells.length; i++)\nint spell = spells[${i}];\nProcessing spell of strength ${spell}.`, 5, { i, spell, hlSpellLoop: true });

        let left = 0;
        let right = potions.length - 1;
        add("Init Pointers", `int left = 0;\nint right = potions.length - 1;\nInitializing search boundaries for the potions array [0, ${right}].`, 7, { i, spell, left, right, hlPointers: true });

        while (left <= right) {
            if (steps.length > 2000) break; // Infinite loop safety

            add("Binary Search", `while (left <= right)\nSearch window: left=${left}, right=${right}. Valid window.`, 10, { i, spell, left, right, hlWhile: true });

            let mid = left + Math.floor((right - left) / 2);
            let product = spell * potions[mid];
            let isValid = product >= successTarget;

            add("Calculate Product", `int mid = left + (right - left) / 2;\nlong product = (long) spell * potions[mid];\nmid is ${mid}. Product = ${spell} * ${potions[mid]} = ${product}.`, 11, { i, spell, left, right, mid, product, hlProduct: true });

            add("Check Success Threshold", `if (product >= success)\nIs the product (${product}) >= success threshold (${successTarget})? (${isValid ? 'Yes' : 'No'})`, 14, { i, spell, left, right, mid, product, isValid, hlCheckValid: true });

            if (isValid) {
                let oldRight = right;
                right = mid - 1;
                add("Search Left (Find Weaker)", `right = mid - 1;\nThe potion works! But we need the *weakest* one that works. We discard the upper half by moving 'right' from ${oldRight} to ${right}.`, 15, { i, spell, left, right, mid, product, isValid, hlMoveRight: true });
            } else {
                let oldLeft = left;
                left = mid + 1;
                add("Search Right (Find Stronger)", `left = mid + 1;\nThe potion is too weak. We must look for a stronger one. We discard the lower half by moving 'left' from ${oldLeft} to ${left}.`, 17, { i, spell, left, right, mid, product, isValid, hlMoveLeft: true });
            }
        }

        let successfulCount = potions.length - left;
        pairs[i] = successfulCount;
        add("Record Successful Pairs", `pairs[i] = potions.length - left;\nSearch complete. The cutoff index is 'left' (${left}). Potions from index ${left} to ${potions.length - 1} are valid. Total valid: ${successfulCount}.`, 20, { i, spell, left, right, successfulCount, hlRecord: true, showCutoff: true });
    }

    add("Return Result", `return pairs;\nProcessed all spells. Returning the pairs array.`, 22, { isSuccess: true, finalAns: pairs, showCutoff: false });

    return steps;
  }, [baseSpells, basePotions, baseSuccess, selectedOpId]);

  // Derived state
  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

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
      if (st.spells === undefined) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top Section: Spells and Outputs */}
              <div className="flex flex-col md:flex-row w-full max-w-5xl gap-6 pointer-events-auto relative z-40 px-4 justify-center items-start">
                  
                  {/* Left: Spells Array */}
                  <div className="flex-1 flex flex-col items-center">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200 flex items-center gap-2`}><Wand2 size={12}/> Spells Array</span>
                      
                      <div className="flex gap-2 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm justify-center flex-wrap items-center w-full min-h-[90px]">
                          {st.spells.map((val: number, idx: number) => {
                              let isActive = st.i === idx;
                              let isProcessed = st.i !== undefined && idx < st.i;
                              
                              let bgClass = "bg-white border-slate-300";
                              let textClass = "text-slate-600";

                              if (isActive) {
                                  bgClass = "bg-fuchsia-100 border-fuchsia-500 ring-4 ring-fuchsia-200 scale-110 shadow-lg z-20";
                                  textClass = "text-fuchsia-900";
                              } else if (isProcessed) {
                                  bgClass = "bg-slate-100 border-slate-200 opacity-60";
                                  textClass = "text-slate-400";
                              }

                              return (
                                  <div key={`spell-${idx}`} className={`relative transition-all duration-300 flex flex-col items-center`}>
                                      {isActive && !st.isSuccess && (
                                          <div className="absolute -top-6 text-fuchsia-500 flex flex-col items-center animate-bounce">
                                              <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap bg-fuchsia-50 px-1 rounded border border-fuchsia-200 shadow-sm">i</span>
                                              <ArrowDown size={12} strokeWidth={3}/>
                                          </div>
                                      )}
                                      <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-2 rounded-xl shadow-sm ${bgClass} transition-all duration-300`}>
                                          <span className={`font-mono font-black text-lg md:text-xl ${textClass}`}>
                                              {val}
                                          </span>
                                      </div>
                                  </div>
                              )
                          })}
                      </div>
                  </div>

                  {/* Right: Pairs Output Array */}
                  <div className="flex-1 flex flex-col items-center">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center gap-2`}><Database size={12}/> Pairs Result Array</span>
                      
                      <div className="flex gap-2 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm justify-center flex-wrap items-center w-full min-h-[90px]">
                          {st.pairs.map((val: number, idx: number) => {
                              let isJustUpdated = st.hlRecord && st.i === idx;
                              let isResolved = val !== 0 || (st.i !== undefined && idx < st.i); // Has been computed
                              
                              let bgClass = "bg-white border-slate-300";
                              let textClass = "text-slate-400"; // placeholder

                              if (isJustUpdated) {
                                  bgClass = "bg-emerald-100 border-emerald-500 ring-4 ring-emerald-200 scale-110 shadow-lg z-20 animate-in zoom-in";
                                  textClass = "text-emerald-900";
                              } else if (isResolved) {
                                  bgClass = "bg-emerald-50 border-emerald-300";
                                  textClass = "text-emerald-700";
                              }

                              return (
                                  <div key={`pair-${idx}`} className={`relative transition-all duration-300 flex flex-col items-center`}>
                                      <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-2 rounded-xl shadow-sm ${bgClass} transition-all duration-300`}>
                                          <span className={`font-mono font-black text-lg md:text-xl ${textClass}`}>
                                              {isResolved ? val : 0}
                                          </span>
                                      </div>
                                  </div>
                              )
                          })}
                      </div>
                  </div>
              </div>

              {/* Middle: Binary Search Computation Dash */}
              <div className="flex flex-col items-center w-full mt-2 pointer-events-auto">
                  <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlCheckValid ? (st.isValid ? 'border-emerald-300 ring-4 ring-emerald-100' : 'border-rose-300 ring-4 ring-rose-100') : 'border-slate-200'}`}>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Calculator size={14}/> Active Calculation</span>
                      
                      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono">
                          
                          <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1">Spell[i]</span>
                              <div className="bg-fuchsia-50 border-2 border-fuchsia-200 text-fuchsia-800 text-3xl font-black px-4 py-2 rounded-xl">
                                  {st.spell !== undefined ? st.spell : '?'}
                              </div>
                          </div>
                          
                          <span className="text-2xl font-black text-slate-300">×</span>
                          
                          <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-sky-500 mb-1">Potion[mid]</span>
                              <div className="bg-sky-50 border-2 border-sky-200 text-sky-800 text-3xl font-black px-4 py-2 rounded-xl">
                                  {st.mid !== undefined && st.potions[st.mid] !== undefined ? st.potions[st.mid] : '?'}
                              </div>
                          </div>
                          
                          <span className="text-2xl font-black text-slate-300">=</span>
                          
                          <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-indigo-500 mb-1">Product</span>
                              <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.product !== undefined ? (st.isValid ? 'bg-emerald-100 border-emerald-400 text-emerald-800 scale-110' : 'bg-rose-100 border-rose-400 text-rose-800 scale-110') : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                                  {st.product !== undefined ? st.product : '?'}
                              </div>
                          </div>

                          <div className="flex flex-col items-center border-l-2 border-slate-100 pl-4 md:pl-8">
                              <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">&ge; Success Threshold</span>
                              <div className="flex items-center gap-3">
                                  <span className="bg-slate-800 text-white text-2xl font-black px-4 py-2 rounded-xl">
                                      {st.success}
                                  </span>
                                  {st.isValid !== undefined && (
                                      <span className={`text-sm font-black uppercase px-2 py-1 rounded ${st.isValid ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                                          {st.isValid ? 'Valid' : 'Weak'}
                                      </span>
                                  )}
                              </div>
                          </div>

                      </div>
                  </div>
              </div>

              {/* Bottom: Search Space Number Grid (Potions) */}
              <div className="flex flex-col items-center w-full mt-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-sky-50 text-sky-600 border-sky-200 flex items-center gap-2`}><FlaskConical size={12}/> Sorted Potions (Binary Search Space)</span>
                  
                  <div className="flex flex-wrap justify-center gap-1.5 md:gap-3 relative z-10 w-full max-w-5xl px-4 min-h-[100px] items-end">
                      {st.potions.map((val: number, idx: number) => {
                          let isMid = st.mid === idx;
                          let isLeft = st.left === idx;
                          let isRight = st.right === idx;
                          
                          let outOfBounds = st.left !== undefined && st.right !== undefined && (idx < st.left || idx > st.right);
                          
                          let isSuccessfulRange = st.showCutoff && st.left !== undefined && idx >= st.left;
                          let isFailedRange = st.showCutoff && st.left !== undefined && idx < st.left;
                          
                          let bgClass = "bg-white border-slate-300";
                          let textClass = "text-slate-700";

                          if (st.hlSort) {
                              bgClass = "bg-sky-100 border-sky-400 ring-2 ring-sky-200";
                              textClass = "text-sky-900";
                          } else if (isSuccessfulRange) {
                              bgClass = "bg-emerald-100 border-emerald-500 shadow-lg scale-105 z-20";
                              textClass = "text-emerald-900";
                          } else if (isFailedRange) {
                              bgClass = "bg-slate-100 border-slate-200 opacity-40";
                              textClass = "text-slate-400";
                          } else if (outOfBounds && !st.showCutoff) {
                              bgClass = "bg-slate-100 border-slate-200 opacity-30 scale-95";
                              textClass = "text-slate-400";
                          } else if (isMid) {
                              bgClass = "bg-amber-100 border-amber-500 ring-4 ring-amber-200 z-30 scale-110 shadow-lg";
                              textClass = "text-amber-900";
                          } else if (isLeft || isRight) {
                              bgClass = "bg-sky-50 border-sky-400 z-10";
                              textClass = "text-sky-800";
                          }

                          return (
                              <div key={`potion-${idx}`} className={`relative transition-all duration-500 flex flex-col items-center`}>
                                  
                                  {isMid && !st.showCutoff && (
                                      <div className="absolute -top-7 text-amber-500 flex flex-col items-center animate-bounce z-40">
                                          <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap bg-amber-50 px-1 rounded border border-amber-200 shadow-sm">mid</span>
                                          <ArrowDown size={12} strokeWidth={3}/>
                                      </div>
                                  )}
                                  
                                  {isLeft && st.showCutoff && !st.isSuccess && (
                                       <div className="absolute -top-7 text-emerald-500 flex flex-col items-center animate-in slide-in-from-top-4 z-40">
                                          <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap bg-emerald-50 px-1 rounded border border-emerald-200 shadow-sm">Cutoff Limit</span>
                                          <ArrowDown size={12} strokeWidth={3}/>
                                      </div>
                                  )}

                                  <div className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center border-2 rounded-xl shadow-sm ${bgClass} transition-all duration-300`}>
                                      <span className={`font-mono font-black text-base md:text-xl ${textClass}`}>
                                          {val}
                                      </span>
                                  </div>
                                  <span className={`font-mono text-[8px] font-bold mt-1 ${isLeft || isRight ? 'text-sky-600' : 'text-slate-400'}`}>i={idx}</span>

                                  <div className="h-6 w-full flex justify-center items-start pt-1 relative z-40">
                                      {isLeft && !outOfBounds && !st.showCutoff && <span className="absolute top-0 text-[9px] font-black text-sky-600 bg-sky-100 border border-sky-300 px-1 rounded shadow-sm z-40">L</span>}
                                      {isRight && !outOfBounds && !st.showCutoff && <span className="absolute top-0 text-[9px] font-black text-rose-500 bg-rose-50 border border-rose-200 px-1 rounded shadow-sm z-40">R</span>}
                                  </div>
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
                <Wand2 className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Successful Pairs of Spells</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Binary Search
                  </span>
                  <span>•</span>
                  <span>LeetCode 2300</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Sparkles size={28}/> Magic Pair Matching</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are given two positive integer arrays <code>spells</code> and <code>potions</code>, of length <code>n</code> and <code>m</code> respectively, where <code>spells[i]</code> represents the strength of the <code>ith</code> spell and <code>potions[j]</code> represents the strength of the <code>jth</code> potion.</p>
                        <p>You are also given an integer <code>success</code>. A spell and potion pair is considered <strong>successful</strong> if the product of their strengths is at least <code>success</code>.</p>
                        <p className="font-bold mt-4">Return an integer array <code>pairs</code> of length <code>n</code> where <code>pairs[i]</code> is the number of potions that will form a successful pair with the <code>ith</code> spell.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> spells = [5,1,3], potions = [1,2,3,4,5], success = 7</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">[4,0,3]</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">- 0th spell: 5 * [1,2,3,4,5] = [5,10,15,20,25]. 4 pairs are successful.<br/>- 1st spell: 1 * [1,2,3,4,5] = [1,2,3,4,5]. 0 pairs are successful.<br/>- 2nd spell: 3 * [1,2,3,4,5] = [3,6,9,12,15]. 3 pairs are successful.</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>n == spells.length, m == potions.length</li>
                            <li>1 &lt;= n, m &lt;= 10^5</li>
                            <li>1 &lt;= spells[i], potions[i] &lt;= 10^5</li>
                            <li>1 &lt;= success &lt;= 10^10</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-amber-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">Since the lengths of the arrays can be up to $10^5$, a brute-force double loop ($O(N \times M)$) evaluating every spell against every potion will result in a Time Limit Exceeded (TLE) error. We need to evaluate the potions for each spell in sub-linear time.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>Binary Search on Potions</strong>. If we sort the <code>potions</code> array first, a powerful mathematical rule emerges: if a spell works with potion $X$, it guarantees it will work with every potion stronger than $X$. We just need to binary search to find the exact boundary (the weakest successful potion), then math out the rest!</p>
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
                        <div className="flex-[2] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Spells Array (Max 8)</label>
                            <input type="text" value={spellsInput} onChange={(e) => setSpellsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="5, 1, 3" />
                        </div>
                        <div className="flex-[2] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Potions Array (Max 10)</label>
                            <input type="text" value={potionsInput} onChange={(e) => setPotionsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="1, 2, 3, 4, 5" />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Success Threshold</label>
                            <input type="number" min="1" value={successInput} onChange={(e) => setSuccessInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-center`} placeholder="7" />
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
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> COMPUTATION COMPLETE</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Successfully matched all spells to viable potions.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlMoveLeft || st.hlMoveRight ? 'text-amber-400' : (st.hlRecord ? 'text-emerald-400' : (st.hlProduct || st.hlMid ? `text-${themeColor}-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Layers size={14} className={`text-${themeColor}-500`}/> Binary Boundary Render</span>
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
                    <div className="inline-flex items-center justify-center p-4 bg-fuchsia-100 text-fuchsia-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Leveraging the mathematical properties of sorted arrays.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Sparkles size={24} className="text-fuchsia-500"/> 1. The Power of Sorted Data</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">The problem asks us to count how many potions multiply with a spell to exceed a success target. If the potions are randomly ordered, we have to check every single one. But if we <strong>sort</strong> the potions first, a powerful mathematical invariant appears.</p>
                        <p className="text-slate-600 leading-relaxed">If <code>spell * potion[i] &gt;= success</code> is TRUE, then logically <code>spell * potion[i+1] &gt;= success</code> MUST also be true because <code>potion[i+1]</code> is guaranteed to be larger than <code>potion[i]</code>. Thus, we don't need to count them one by one. We just need to use Binary Search to find the <em>first</em> index where the condition is met. Every potion to the right of that index is automatically a success!</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ShieldAlert size={24} className="text-rose-500"/> 2. Handling Overflow</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">A massive trap in this problem is integer overflow. The constraints specify that a spell or potion can be up to $10^5$. Multiplying them could yield $10^{10}$.</p>
                        <p className="text-slate-600 leading-relaxed">A standard 32-bit signed integer (<code>int</code> in Java) maxes out around $2 \times 10^9$. If you do <code>spell * potion[mid]</code>, it will overflow, wrap around to a negative number, and incorrectly fail the <code>&gt;= success</code> check. You must explicitly cast it to a 64-bit <code>long</code> before multiplication: <code>(long) spell * potions[mid]</code>.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O((M + N) log M).</strong> Let $N$ be the number of spells and $M$ be the number of potions. Sorting the potions takes $O(M \log M)$. Then, for each of the $N$ spells, we do a binary search on the potions array, which takes $O(\log M)$. Total time is $O(M \log M + N \log M)$.</li>
                            <li><strong>Space Complexity: O(log M).</strong> We sort the array in place, but sorting algorithms (like QuickSort/DualPivot) require $O(\log M)$ auxiliary stack space. The output array of size $N$ is required to return the answer and is typically not counted against algorithmic space complexity.</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-fuchsia-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a classic 'Find the First True' binary search template. Interviewers use it to see if you can manipulate search boundaries to find the leftmost edge of a valid range."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-fuchsia-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-fuchsia-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Why do we update <code>right = mid - 1</code> when the condition is met, instead of returning immediately?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "If we were just looking for <em>any</em> successful potion, we could return immediately. But we need to count <em>all</em> successful potions.</p>
                            <p>To do that, we must find the absolutely weakest potion that works (the leftmost valid boundary). If <code>mid</code> works, it's a valid candidate, but there might be an even weaker potion to its left that also works! By aggressively updating <code>right = mid - 1</code>, we force the search to keep sliding leftward until we have proven there are no valid potions weaker than our current find. At the end of the loop, <code>left</code> perfectly rests on that boundary."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "What happens if NO potions work for a given spell?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The algorithm elegantly handles it without special checks.</p>
                            <p>If no potions work, the condition <code>product &gt;= success</code> will always be false. Consequently, the algorithm will repeatedly update <code>left = mid + 1</code>. Eventually, <code>left</code> will be pushed entirely out of bounds, reaching <code>potions.length</code>. When we calculate <code>potions.length - left</code>, it equates to <code>potions.length - potions.length = 0</code>, correctly recording zero successful pairs."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><ArrowRightLeft size={24}/></span>
                            <span>Q3: "Could we sort the <code>spells</code> array instead of the <code>potions</code> array?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "We could, but it changes the entire approach. If we sort <code>spells</code>, we lose the original indices, so we'd have to store them as objects <code>[spell_value, original_index]</code> before sorting to assemble the output array correctly.</p>
                            <p>Then we would sort both arrays and use a <strong>Two-Pointer approach</strong>. As the spells get stronger, the minimum required potion gets weaker. We'd iterate spells from weakest to strongest, and decrement a pointer on the potions array. This gives an $O(N \log N + M \log M)$ time complexity, which is also extremely fast, but requires more code to manage the sorted spell indices."</p>
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
                              <Wand2 size={20}/>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlUpdateLeft || st.hlUpdateRight || st.hlRecord ? 'text-amber-400' : (st.hlApi || st.hlMid || st.hlProduct ? `text-${themeColor}-400` : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                          <div className="flex-[2] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Spells Array</label>
                              <input type="text" value={spellsInput} onChange={(e) => setSpellsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-center`} placeholder="5, 1, 3" />
                          </div>
                          <div className="flex-[2] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Potions Array</label>
                              <input type="text" value={potionsInput} onChange={(e) => setPotionsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-center`} placeholder="1, 2, 3, 4, 5" />
                          </div>
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Success Target</label>
                              <input type="number" min="1" value={successInput} onChange={(e) => setSuccessInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-center`} placeholder="7" />
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">COMPUTATION COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Successfully generated pairs array</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Final Answer Pairs</div>
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