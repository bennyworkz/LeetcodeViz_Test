import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, 
  RotateCcw, ListOrdered, Lightbulb, MonitorPlay, PartyPopper,
  XCircle, Minimize, Layers as LayersIcon, ZoomIn, ZoomOut, Maximize, 
  SortAsc, AlertTriangle, Clock, Cpu, HelpCircle, Target, FastForward,
  Goal, Workflow, CheckSquare, ShieldAlert, ArrowUp, ArrowDown, Minus,
  Star, Award, Navigation, GitMerge, MoveHorizontal
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  twoPass: {
    id: 'twoPass',
    title: '1. Two-Pass Greedy',
    icon: <MoveHorizontal size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    theme: 'emerald',
    code: `class Solution {
    public int candy(int[] ratings) {
        int n = ratings.length;
        int[] candies = new int[n];
        Arrays.fill(candies, 1);
        
        // Left-to-Right Pass
        for (int i = 1; i < n; i++) {
            if (ratings[i] > ratings[i - 1]) {
                candies[i] = candies[i - 1] + 1;
            }
        }
        
        // Right-to-Left Pass
        for (int i = n - 2; i >= 0; i--) {
            if (ratings[i] > ratings[i + 1]) {
                candies[i] = Math.max(candies[i], candies[i + 1] + 1);
            }
        }
        
        int sum = 0;
        for (int candy : candies) {
            sum += candy;
        }
        return sum;
    }
}`,
    desc: "The standard O(N) space approach. We break the rules into two constraints: a child must have more candies than their LEFT neighbor if their rating is higher, AND more candies than their RIGHT neighbor. We do a Left-to-Right pass to satisfy the first rule. Then, we do a Right-to-Left pass to satisfy the second rule. We use Math.max() to ensure we don't break the first rule while enforcing the second!"
  },
  singlePass: {
    id: 'singlePass',
    title: '2. Peak/Valley (Constant Space)',
    icon: <Activity size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    theme: 'violet',
    code: `class Solution {
    public int candy(int[] ratings) {
        if (ratings.length == 0) return 0;
        int sum = 1;
        int up = 0, down = 0, peak = 0;
        
        for (int i = 1; i < ratings.length; i++) {
            if (ratings[i - 1] < ratings[i]) {
                up++;
                down = 0;
                peak = up;
                sum += 1 + up;
            } else if (ratings[i - 1] == ratings[i]) {
                up = 0;
                down = 0;
                peak = 0;
                sum += 1;
            } else {
                down++;
                up = 0;
                sum += 1 + down + (peak >= down ? 0 : 1);
            }
        }
        return sum;
    }
}`,
    desc: "An incredible O(1) space optimization. Instead of storing an array, we track the 'slope' of the ratings. Going UP requires giving 1 more candy than the last child (+up). Staying FLAT means resetting to 1 candy. Going DOWN requires giving the current child 1 candy, but we ALSO implicitly need to add 1 candy to every child behind them in the current downward slope (+down). The 'peak' variable ensures we elevate the peak child if the valley gets too deep!"
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
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|boolean|class|return|if|else|while|for|new|String|candy|Arrays|fill|Math|max|length|ratings|candies|sum|up|down|peak|n|i)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}\(\)])/g).filter(Boolean);
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
                return <span key={`code-${num}-${idx}`} className="text-slate-500 italic">{part}</span>;
            }
            
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'boolean', 'class', 'return', 'if', 'else', 'while', 'for', 'new'].includes(part);
            const isObject = ['Solution', 'Arrays', 'Math'].includes(part);
            const isPointer = ['ratings', 'candies', 'sum', 'up', 'down', 'peak', 'n', 'i'].includes(part);
            const isMapCall = ['candy', 'fill', 'max', 'length'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^', '{', '}', '(', ')'].includes(trimmed);
            
            return (
              <span 
                key={`code-${num}-${idx}`} 
                className={
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

export default function CandyVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('twoPass');
  
  const [ratingsInput, setRatingsInput] = useState('1, 0, 2, 3, 2, 1');
  const [ratingsArr, setRatingsArr] = useState<number[]>([1, 0, 2, 3, 2, 1]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1); 
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const codeContainerMainRef = useRef<HTMLDivElement>(null);
  const codeContainerFullscreenRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  // --- Effects for Data Processing ---

  const parseArrayInput = (inputStr: string, fallback: number[]) => {
      let rawTokens = inputStr.split(',');
      let parsedArr: number[] = [];
      for (let token of rawTokens) {
          let t = token.trim();
          let num = parseInt(t, 10);
          if (!isNaN(num) && num >= 0) {
              parsedArr.push(num);
          }
      }
      if (parsedArr.length === 0) parsedArr = fallback;
      if (parsedArr.length > 25) parsedArr = parsedArr.slice(0, 25); // Cap for visualization
      return parsedArr;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setRatingsArr(parseArrayInput(ratingsInput, [1, 0, 2, 3, 2, 1]));
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [ratingsInput, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.4), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    
    let ratings = [...ratingsArr];
    let n = ratings.length;
    
    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { ...st } 
    });

    if (selectedOpId === 'twoPass') {
        let candies = new Array(n).fill(1);
        let sum = 0;

        add("Init", `public int candy(int[] ratings)`, 2, { hlPhase: 'init', candies: [...candies] });
        add("Init Candies", `int[] candies = new int[n];\nArrays.fill(candies, 1);\nEvery child gets at least 1 candy initially.`, 4, { hlPhase: 'initData', candies: [...candies] });

        // Left to Right Pass
        for (let i = 1; i < n; i++) {
            if (steps.length > 2000) break;
            
            add("Left-To-Right Pass", `for (int i = 1; i < n; i++)\nIterating Left to Right. Checking child ${i}.`, 8, { hlPhase: 'L2R_loop', idx: i, candies: [...candies] });
            
            let isGreater = ratings[i] > ratings[i - 1];
            add("Compare Left Neighbor", `if (ratings[i] > ratings[i - 1])\nIs rating ${ratings[i]} > ${ratings[i-1]}? (${isGreater ? 'Yes' : 'No'})`, 9, { hlPhase: 'L2R_cmp', idx: i, prevIdx: i - 1, isGreater, candies: [...candies] });

            if (isGreater) {
                candies[i] = candies[i - 1] + 1;
                add("Update Candy (L2R)", `candies[i] = candies[i - 1] + 1;\nChild ${i} has a higher rating, gets ${candies[i-1]} + 1 = ${candies[i]} candies.`, 10, { hlPhase: 'L2R_upd', idx: i, prevIdx: i - 1, isGreater, candies: [...candies] });
            }
        }

        // Right to Left Pass
        for (let i = n - 2; i >= 0; i--) {
            if (steps.length > 2000) break;

            add("Right-To-Left Pass", `for (int i = n - 2; i >= 0; i--)\nIterating Right to Left. Checking child ${i}.`, 15, { hlPhase: 'R2L_loop', idx: i, candies: [...candies] });
            
            let isGreater = ratings[i] > ratings[i + 1];
            add("Compare Right Neighbor", `if (ratings[i] > ratings[i + 1])\nIs rating ${ratings[i]} > ${ratings[i+1]}? (${isGreater ? 'Yes' : 'No'})`, 16, { hlPhase: 'R2L_cmp', idx: i, nextIdx: i + 1, isGreater, candies: [...candies] });

            if (isGreater) {
                let maxVal = Math.max(candies[i], candies[i + 1] + 1);
                let wasUpdated = maxVal > candies[i];
                candies[i] = maxVal;
                add("Update Candy (R2L)", `candies[i] = Math.max(candies[i], candies[i + 1] + 1);\nChild ${i} needs at least ${candies[i+1] + 1} candies. We take the max of current (${candies[i]}) and needed. Result: ${maxVal}.`, 17, { hlPhase: 'R2L_upd', idx: i, nextIdx: i + 1, isGreater, wasUpdated, candies: [...candies] });
            }
        }

        // Sum Pass
        add("Init Sum", `int sum = 0;`, 21, { hlPhase: 'sum_init', candies: [...candies], sum });
        
        for (let i = 0; i < n; i++) {
            sum += candies[i];
            add("Accumulate Sum", `sum += candy;\nAdding ${candies[i]} to total sum. Current sum: ${sum}.`, 23, { hlPhase: 'sum_add', idx: i, candies: [...candies], sum });
        }

        add("Complete", `return sum;\nAll constraints met! Total minimum candies required is ${sum}.`, 25, { hlPhase: 'success', isSuccess: true, sum, candies: [...candies] });

    } 
    else if (selectedOpId === 'singlePass') {
        let sum = 0;
        let up = 0;
        let down = 0;
        let peak = 0;

        add("Init", `public int candy(int[] ratings)`, 2, { hlPhase: 'init' });

        if (n === 0) {
            add("Empty Array", `if (ratings.length == 0) return 0;`, 3, { hlPhase: 'success', isSuccess: true, sum: 0 });
            return steps;
        }

        sum = 1;
        add("Init Variables", `int sum = 1;\nint up = 0, down = 0, peak = 0;\nGive the first child 1 candy to start.`, 5, { hlPhase: 'initVars', sum, up, down, peak, idx: 0 });

        for (let i = 1; i < n; i++) {
            if (steps.length > 2000) break;

            add("Loop Next Child", `for (int i = 1; i < ratings.length; i++) {\nEvaluating slope between child ${i-1} and ${i}.`, 7, { hlPhase: 'loop', idx: i, sum, up, down, peak });

            let isUp = ratings[i - 1] < ratings[i];
            let isFlat = ratings[i - 1] === ratings[i];
            let isDown = ratings[i - 1] > ratings[i];

            add("Check Up Slope", `if (ratings[i - 1] < ratings[i])\nIs rating increasing? (${isUp ? 'Yes' : 'No'})`, 8, { hlPhase: 'checkUp', idx: i, isUp, sum, up, down, peak });
            
            if (isUp) {
                up++;
                down = 0;
                peak = up;
                sum += 1 + up;
                add("Process Up Slope", `up++; down = 0; peak = up;\nsum += 1 + up;\nRating increased! Give 1 more candy than previous child.`, 12, { hlPhase: 'processUp', idx: i, isUp, sum, up, down, peak });
            } else {
                add("Check Flat Slope", `else if (ratings[i - 1] == ratings[i])\nIs rating identical? (${isFlat ? 'Yes' : 'No'})`, 13, { hlPhase: 'checkFlat', idx: i, isFlat, sum, up, down, peak });
                
                if (isFlat) {
                    up = 0;
                    down = 0;
                    peak = 0;
                    sum += 1;
                    add("Process Flat Slope", `up = 0; down = 0; peak = 0;\nsum += 1;\nRating unchanged. Reset state and just give 1 candy.`, 17, { hlPhase: 'processFlat', idx: i, isFlat, sum, up, down, peak });
                } else {
                    add("Check Down Slope", `else { // ratings[i - 1] > ratings[i]\nRating is strictly decreasing.`, 18, { hlPhase: 'checkDown', idx: i, isDown, sum, up, down, peak });
                    
                    down++;
                    up = 0;
                    let extraPeakFix = peak >= down ? 0 : 1;
                    sum += 1 + down + extraPeakFix;
                    
                    add("Process Down Slope", `down++; up = 0;\nsum += 1 + down + (peak >= down ? 0 : 1);\nRating decreased. We give this child 1 candy, but mathematically must add 1 candy to EVERY child behind them in this slope (+down). Peak fix applied if valley exceeds peak height!`, 21, { hlPhase: 'processDown', idx: i, isDown, extraPeakFix, sum, up, down, peak });
                }
            }
        }

        add("Complete", `return sum;\nTraversal complete in single pass! Total minimum candies required is ${sum}.`, 24, { hlPhase: 'success', isSuccess: true, sum });
    }

    return steps;
  }, [ratingsArr, selectedOpId]);

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
      if (!ratingsArr || ratingsArr.length === 0) return null;

      let isSuccessEnd = st.hlPhase === 'success';

      if (selectedOpId === 'twoPass') {
          let isL2R = st.hlPhase?.startsWith('L2R');
          let isR2L = st.hlPhase?.startsWith('R2L');
          let isSum = st.hlPhase?.startsWith('sum');

          return (
              <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? 'border-emerald-400 ring-4 ring-emerald-100' : (isL2R ? 'border-sky-400 ring-4 ring-sky-100' : (isR2L ? 'border-rose-400 ring-4 ring-rose-100' : 'border-slate-200'))} scale-105 z-40`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1">
                      <Activity size={14}/> 
                      {isL2R ? "Left-to-Right Pass" : (isR2L ? "Right-to-Left Pass" : (isSum ? "Summation Pass" : "Algorithm State"))}
                  </span>
                  
                  {isSuccessEnd ? (
                      <div className="flex flex-wrap items-center justify-center gap-6 font-mono min-h-[80px] py-2 w-full">
                          <div className={`flex items-center gap-4 text-emerald-600 bg-emerald-50 border-emerald-300 font-mono font-black text-xl px-6 py-3 rounded-2xl border-2 shadow-md`}>
                              <span>Optimal Minimum Candies</span> <ArrowRight size={24} /> <span className={`bg-white px-4 py-2 rounded-xl shadow-sm border border-emerald-200`}>{st.sum}</span>
                          </div>
                      </div>
                  ) : isSum ? (
                      <div className="flex flex-wrap items-center justify-center gap-6 font-mono min-h-[80px] py-2 w-full">
                          <div className="flex flex-col items-center w-[120px] animate-in zoom-in">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-amber-500`}>Child [{st.idx}] Candies</span>
                              <div className={`border-2 text-3xl font-black px-4 py-2 w-full text-center rounded-xl bg-amber-50 border-amber-300 text-amber-800 shadow-inner`}>
                                  {st.candies ? st.candies[st.idx] : 0}
                              </div>
                          </div>
                          <div className="flex flex-col items-center justify-center text-slate-400 font-black text-2xl px-2">
                              <span>+</span>
                          </div>
                          <div className="flex flex-col items-center w-[120px] animate-in zoom-in">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-emerald-500`}>Running Total</span>
                              <div className={`border-2 text-3xl font-black px-4 py-2 w-full text-center rounded-xl bg-emerald-50 border-emerald-400 text-emerald-800 shadow-md scale-110`}>
                                  {st.sum}
                              </div>
                          </div>
                      </div>
                  ) : st.idx !== undefined && (st.prevIdx !== undefined || st.nextIdx !== undefined) ? (
                      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full">
                          
                          {/* Active Evaluation Block */}
                          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner">
                              
                              {/* Prev Neighbor (if L2R) */}
                              {isL2R && (
                                  <div className="flex flex-col items-center">
                                      <span className="text-[9px] font-bold uppercase text-slate-400">Child [{st.prevIdx}]</span>
                                      <div className="flex items-center gap-1 text-sky-700">
                                          <Star size={12}/> <span className="font-black">{ratingsArr[st.prevIdx]}</span>
                                      </div>
                                  </div>
                              )}

                              {isR2L && (
                                  <div className="flex flex-col items-center">
                                      <span className="text-[9px] font-bold uppercase text-slate-400">Child [{st.idx}]</span>
                                      <div className="flex items-center gap-1 text-rose-700">
                                          <Star size={12}/> <span className="font-black">{ratingsArr[st.idx]}</span>
                                      </div>
                                  </div>
                              )}
                              
                              {/* Comparison Operator */}
                              <div className="flex flex-col items-center justify-center font-black text-xl px-2 transition-colors">
                                  <span className={st.isGreater ? (isL2R ? 'text-sky-500' : 'text-rose-500') : 'text-slate-300'}>
                                      {st.isGreater ? '>' : '≤'}
                                  </span>
                              </div>

                              {/* Target Child (if L2R) */}
                              {isL2R && (
                                  <div className="flex flex-col items-center">
                                      <span className="text-[9px] font-bold uppercase text-slate-400">Child [{st.idx}]</span>
                                      <div className="flex items-center gap-1 text-sky-700">
                                          <Star size={12}/> <span className="font-black">{ratingsArr[st.idx]}</span>
                                      </div>
                                  </div>
                              )}

                              {/* Next Neighbor (if R2L) */}
                              {isR2L && (
                                  <div className="flex flex-col items-center">
                                      <span className="text-[9px] font-bold uppercase text-slate-400">Child [{st.nextIdx}]</span>
                                      <div className="flex items-center gap-1 text-rose-700">
                                          <Star size={12}/> <span className="font-black">{ratingsArr[st.nextIdx]}</span>
                                      </div>
                                  </div>
                              )}
                          </div>

                          <div className="w-px h-12 bg-slate-200 hidden md:block mx-2"></div>
                          
                          {/* Result Action */}
                          <div className="flex flex-col items-center min-w-[160px]">
                              <span className={`text-[9px] font-bold uppercase text-slate-400 mb-1`}>Action</span>
                              {st.isGreater && (st.hlPhase.includes('upd')) ? (
                                  <div className={`flex flex-col items-center gap-1 w-full bg-amber-50 p-2 rounded-xl border border-amber-300 shadow-sm transition-all animate-pulse`}>
                                      <span className="text-[10px] font-black uppercase text-amber-700">{isL2R ? '+1 Candies' : 'Math.max(C, C+1)'}</span>
                                      <span className="text-sm font-mono font-bold text-amber-900">
                                          Update to {st.candies[st.idx]}
                                      </span>
                                  </div>
                              ) : !st.isGreater ? (
                                  <div className="flex items-center justify-center h-full w-full bg-slate-100 rounded-xl border border-slate-200 text-slate-400 font-bold text-xs uppercase tracking-widest">
                                      Constraints Met
                                  </div>
                              ) : (
                                  <div className="flex items-center justify-center h-full w-full bg-slate-100 rounded-xl border border-slate-200 text-slate-400 font-bold text-xs uppercase tracking-widest">
                                      Evaluating...
                                  </div>
                              )}
                          </div>
                      </div>
                  ) : (
                      <div className="flex items-center justify-center w-full min-h-[80px]">
                          <span className="text-slate-400 italic text-sm font-mono">Initializing...</span>
                      </div>
                  )}
              </div>
          );
      } else {
          // Single Pass Peak/Valley
          return (
              <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? 'border-emerald-400 ring-4 ring-emerald-100' : 'border-violet-200'} scale-105 z-40`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Activity size={14}/> Peak & Valley Slope Tracker</span>
                  
                  {isSuccessEnd ? (
                      <div className="flex flex-wrap items-center justify-center gap-6 font-mono min-h-[80px] py-2 w-full">
                          <div className={`flex items-center gap-4 text-emerald-600 bg-emerald-50 border-emerald-300 font-mono font-black text-xl px-6 py-3 rounded-2xl border-2 shadow-md`}>
                              <span>Optimal Minimum Candies</span> <ArrowRight size={24} /> <span className={`bg-white px-4 py-2 rounded-xl shadow-sm border border-emerald-200`}>{st.sum}</span>
                          </div>
                      </div>
                  ) : st.idx !== undefined ? (
                      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full">
                          
                          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner">
                              <div className="flex flex-col items-center">
                                  <span className="text-[9px] font-bold uppercase text-slate-400">Child [{st.idx - 1}]</span>
                                  <div className="flex items-center gap-1 text-slate-700">
                                      <Star size={12}/> <span className="font-black">{ratingsArr[st.idx - 1]}</span>
                                  </div>
                              </div>
                              <div className="flex flex-col items-center justify-center font-black text-xl px-2">
                                  {st.isUp && <ArrowUp className="text-emerald-500" size={24}/>}
                                  {st.isDown && <ArrowDown className="text-rose-500" size={24}/>}
                                  {st.isFlat && <Minus className="text-slate-400" size={24}/>}
                                  {!st.isUp && !st.isDown && !st.isFlat && <span className="text-slate-300">?</span>}
                              </div>
                              <div className="flex flex-col items-center">
                                  <span className="text-[9px] font-bold uppercase text-slate-400">Child [{st.idx}]</span>
                                  <div className="flex items-center gap-1 text-slate-700">
                                      <Star size={12}/> <span className="font-black">{ratingsArr[st.idx]}</span>
                                  </div>
                              </div>
                          </div>
                          
                          <div className="w-px h-12 bg-slate-200 hidden md:block mx-2"></div>
                          
                          <div className="flex gap-4">
                              <div className={`flex flex-col items-center w-[70px] transition-all duration-300 ${st.hlPhase === 'processUp' ? 'scale-110' : ''}`}>
                                  <span className="text-[10px] font-bold uppercase text-emerald-500 mb-1">Up</span>
                                  <div className={`border-2 text-xl font-black w-full text-center rounded-xl py-1 ${st.hlPhase === 'processUp' ? 'bg-emerald-100 border-emerald-400 text-emerald-900 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>{st.up !== undefined ? st.up : 0}</div>
                              </div>
                              <div className={`flex flex-col items-center w-[70px] transition-all duration-300 ${st.hlPhase === 'processDown' ? 'scale-110' : ''}`}>
                                  <span className="text-[10px] font-bold uppercase text-rose-500 mb-1">Down</span>
                                  <div className={`border-2 text-xl font-black w-full text-center rounded-xl py-1 ${st.hlPhase === 'processDown' ? 'bg-rose-100 border-rose-400 text-rose-900 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>{st.down !== undefined ? st.down : 0}</div>
                              </div>
                              <div className={`flex flex-col items-center w-[70px] transition-all duration-300 ${st.hlPhase === 'processUp' ? 'scale-110' : ''}`}>
                                  <span className="text-[10px] font-bold uppercase text-indigo-500 mb-1">Peak</span>
                                  <div className={`border-2 text-xl font-black w-full text-center rounded-xl py-1 ${st.hlPhase === 'processUp' ? 'bg-indigo-100 border-indigo-400 text-indigo-900 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>{st.peak !== undefined ? st.peak : 0}</div>
                              </div>
                          </div>

                          <div className="w-px h-12 bg-slate-200 hidden md:block mx-2"></div>

                          <div className={`flex flex-col items-center w-[100px] transition-all duration-300 scale-110`}>
                              <span className="text-[10px] font-bold uppercase text-amber-500 mb-1 tracking-widest">Total Sum</span>
                              <div className={`border-2 text-2xl font-black w-full text-center rounded-xl py-1 bg-amber-100 border-amber-400 text-amber-900 shadow-lg`}>
                                  {st.sum !== undefined ? st.sum : 1}
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className="flex items-center justify-center w-full min-h-[80px]">
                          <span className="text-slate-400 italic text-sm font-mono">Initializing Variables...</span>
                      </div>
                  )}
              </div>
          );
      }
  };

  const renderVisuals = () => {
      if (ratingsArr.length === 0) return <span className="text-slate-400 italic mt-10">Initializing Queue...</span>;

      const nodeWidth = 60;
      const nodeGap = 20;
      const totalColWidth = nodeWidth + nodeGap;
      const containerWidth = ratingsArr.length * totalColWidth;
      
      // Calculate dynamic height based on ratings for visual plotting
      const maxRating = Math.max(...ratingsArr);
      const rowYBase = 200; // Base Y position for children
      
      const getVisualY = (rating: number) => {
          if (selectedOpId === 'singlePass') {
              // Plotted vertically for single pass to show slope visually
              return rowYBase - (rating * 30);
          }
          return rowYBase; // Flat line for two pass
      }

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-auto relative pt-4 px-4 pb-12 overflow-x-hidden">
              
              {/* Dynamic State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40">
                  {renderActiveDashboard()}
              </div>

              {/* Graphical Arrays Area */}
              <div className="flex flex-col items-center justify-center relative w-full max-w-6xl mt-4">
                  
                  <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-start mt-8 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner overflow-hidden`} style={{ minHeight: '400px' }}>
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                      <div className="relative w-0 h-full overflow-visible flex justify-center mt-12 pb-16">
                          
                          {/* Slope Connections for Single Pass */}
                          {selectedOpId === 'singlePass' && (
                              <svg className="absolute top-0 left-0 overflow-visible z-10" style={{ width: '1px', height: '1px' }}>
                                  <g style={{ transform: 'translateX(50%)' }}>
                                      {ratingsArr.map((val, idx) => {
                                          if (idx === 0) return null;
                                          let sx = -(containerWidth / 2) + (totalColWidth / 2) + ((idx - 1) * totalColWidth);
                                          let sy = getVisualY(ratingsArr[idx - 1]);
                                          let tx = -(containerWidth / 2) + (totalColWidth / 2) + (idx * totalColWidth);
                                          let ty = getVisualY(val);
                                          
                                          let isActiveSlope = st.idx === idx && !st.isSuccess;
                                          
                                          let strokeColor = '#cbd5e1'; 
                                          let strokeWidth = 2;
                                          let opacity = 0.5;

                                          if (isActiveSlope) {
                                              if (st.isUp) strokeColor = '#10b981'; // Emerald
                                              else if (st.isDown) strokeColor = '#f43f5e'; // Rose
                                              else if (st.isFlat) strokeColor = '#94a3b8'; // Slate
                                              else strokeColor = '#f59e0b'; // Amber evaluating
                                              
                                              strokeWidth = 6;
                                              opacity = 1;
                                          } else if (st.idx > idx || st.isSuccess) {
                                              strokeColor = '#94a3b8';
                                              strokeWidth = 3;
                                              opacity = 0.7;
                                          }

                                          return <line key={`slope-${idx}`} x1={sx} y1={sy} x2={tx} y2={ty} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className="transition-all duration-300"/>
                                      })}
                                  </g>
                              </svg>
                          )}

                          {/* Children / Ratings / Candies Arrays */}
                          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-visible">
                              {ratingsArr.map((rating, idx) => {
                                  let startX = -(containerWidth / 2) + (totalColWidth / 2) + (idx * totalColWidth);
                                  let startY = getVisualY(rating);
                                  
                                  let isL2RActive = selectedOpId === 'twoPass' && st.hlPhase?.startsWith('L2R') && (st.idx === idx || st.prevIdx === idx);
                                  let isR2LActive = selectedOpId === 'twoPass' && st.hlPhase?.startsWith('R2L') && (st.idx === idx || st.nextIdx === idx);
                                  let isSumActive = selectedOpId === 'twoPass' && st.hlPhase?.startsWith('sum') && st.idx === idx;
                                  
                                  let isSingleActive = selectedOpId === 'singlePass' && (st.idx === idx || st.idx === idx + 1);

                                  let isActive = isL2RActive || isR2LActive || isSumActive || isSingleActive;
                                  
                                  let bgClass = "bg-white border-slate-300 text-slate-500 shadow-sm"; 
                                  let scaleClass = "scale-100";

                                  if (isActive && !st.isSuccess) {
                                      if (isL2RActive) bgClass = "bg-sky-50 border-sky-400 ring-4 ring-sky-100 text-sky-900 shadow-xl z-30";
                                      else if (isR2LActive) bgClass = "bg-rose-50 border-rose-400 ring-4 ring-rose-100 text-rose-900 shadow-xl z-30";
                                      else if (isSumActive) bgClass = "bg-amber-50 border-amber-400 ring-4 ring-amber-100 text-amber-900 shadow-xl z-30";
                                      else if (isSingleActive) bgClass = "bg-violet-50 border-violet-400 ring-4 ring-violet-100 text-violet-900 shadow-xl z-30";
                                      
                                      scaleClass = "scale-110";
                                  } else if (st.isSuccess) {
                                      bgClass = "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-md opacity-90";
                                  }

                                  return (
                                      <div key={`child-${idx}`} className={`absolute flex flex-col items-center transition-all duration-500 ${scaleClass}`} style={{ left: `calc(50% + ${startX}px)`, top: `${startY}px`, transform: 'translate(-50%, -50%)' }}>
                                          
                                          {/* Rating Display */}
                                          <div className="flex flex-col items-center mb-2">
                                              <span className="text-[9px] font-black uppercase text-slate-400">Rating</span>
                                              <div className={`flex items-center justify-center gap-1 font-black text-sm px-2 py-0.5 rounded-full border ${isActive ? 'bg-white border-slate-300 shadow-sm text-slate-800' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                                                  <Star size={12} className={isActive ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}/> {rating}
                                              </div>
                                          </div>

                                          {/* Child Body */}
                                          <div className={`w-[50px] h-[50px] flex flex-col items-center justify-center border-[3px] rounded-xl transition-all duration-300 ${bgClass}`}>
                                              <span className="font-mono text-[9px] font-black uppercase tracking-widest opacity-50">C{idx}</span>
                                          </div>

                                          {/* Candy Assignment Display (Only for Two Pass) */}
                                          {selectedOpId === 'twoPass' && st.candies !== undefined && (
                                              <div className="flex flex-col items-center mt-3 animate-in fade-in slide-in-from-top-2">
                                                  <div className={`flex items-center justify-center gap-1 font-black text-base px-3 py-1 rounded-lg border-2 shadow-sm transition-colors ${st.idx === idx && st.hlPhase?.includes('upd') ? 'bg-amber-400 border-amber-600 text-amber-950 scale-125 z-40' : (st.candies[idx] > 1 ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-white border-slate-300 text-slate-600')}`}>
                                                      <Award size={14} className={st.candies[idx] > 1 ? 'text-emerald-500' : 'text-slate-400'}/> {st.candies[idx]}
                                                  </div>
                                              </div>
                                          )}
                                          
                                      </div>
                                  )
                              })}
                          </div>

                      </div>
                  </div>

              </div>

          </div>
      );
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col xl:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-600`}>
                <Award className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Candy Distribution</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Greedy Arrays
                  </span>
                  <span>•</span>
                  <span>LeetCode 135</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto scrollbar-none w-full xl:w-auto">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" themeColor={themeColor}/>
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" themeColor={themeColor}/>
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen size={16}/>} label="Theory" themeColor={themeColor}/>
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" themeColor={themeColor}/>
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-6 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-6">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><FileText size={28}/> Problem Statement</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>There are <code>n</code> children standing in a line. Each child is assigned a rating value given in the integer array <code>ratings</code>.</p>
                        <p>You are giving candies to these children subjected to the following requirements:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Each child must have at least one candy.</li>
                            <li>Children with a higher rating get more candies than their neighbors.</li>
                        </ul>
                        <p>Return the <strong>minimum number of candies</strong> you need to have to distribute the candies to the children.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1: Validating both sides</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> ratings = [1,0,2]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">5</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs leading-relaxed block">
                                You can allocate to the first, second and third child with 2, 1, 2 candies respectively.<br/>
                                The first child gets 2 because rating (1) &gt; rating (0).<br/>
                                The third child gets 2 because rating (2) &gt; rating (0).
                            </span>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2: Equal Ratings</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> ratings = [1,2,2]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">4</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs leading-relaxed block">
                                You can allocate to the first, second and third child with 1, 2, 1 candies respectively.<br/>
                                The third child gets 1 candy because it satisfies the "higher rating gets more" condition (2 is not &gt; 2).
                            </span>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4 max-w-2xl">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li><code>n == ratings.length</code></li>
                            <li><code>1 &le; n &le; 2 * 10^4</code></li>
                            <li><code>0 &le; ratings[i] &le; 2 * 10^4</code></li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Goal size={16} className="text-emerald-500"/> Two Pass Array Concept</h5>
                        <p className="text-sm leading-relaxed text-slate-600">The problem has two symmetrical rules: checking the left neighbor and checking the right neighbor. Instead of trying to satisfy both at once (which requires complex lookaheads), we split the problem! First, we do a left-to-right pass ensuring everyone is happy compared to their left neighbor. Then, we do a right-to-left pass ensuring everyone is happy compared to their right neighbor.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Activity size={16} className={`text-violet-500`}/> Single Pass Peak/Valley Concept</h5>
                        <p className="text-sm leading-relaxed text-slate-600">If we visualize the ratings as a mountain range, we only care about continuous slopes. A continuous UP slope requires increasing candies sequentially. A continuous DOWN slope requires the same, but backwards. By tracking the length of the current UP or DOWN slope, we can mathematically calculate the candies needed on the fly without storing any arrays!</p>
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
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className={`text-${themeColor}-400`} /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 pb-10 flex-1 scroll-smooth" ref={codeContainerMainRef}>
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={`code-line-${idx}`} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} idPrefix="main-"/>
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4 relative">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-1 w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Ratings Array</label>
                            <input type="text" value={ratingsInput} onChange={(e) => setRatingsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-slate-900 tracking-widest`} placeholder="1, 0, 2, 3, 2, 1" />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100 mt-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess === true} className={`px-8 py-3 bg-${themeColor}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden shrink-0 ${st.isSuccess === true ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess === true ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> DISTRIBUTION COMPLETE</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Minimum candies required is {st.sum}.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase?.includes('upd') || st.hlPhase?.includes('process') || st.hlPhase?.includes('sum_add') ? `text-${themeColor}-400` : 'text-white'}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-slate-100 rounded-[2.5rem] border border-slate-300 p-2 relative flex flex-col shadow-inner overflow-hidden flex-1 min-h-[400px]">
                   {renderVisuals()}
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
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Theory & Complexity Analysis</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding the separation of constraints in Greedy logic.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><MoveHorizontal size={24} className={`text-emerald-500`}/> 1. The Two-Pass Strategy</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">The rule "children with a higher rating get more candies than their neighbors" is actually two rules glued together:</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 font-mono text-sm bg-slate-100 p-4 rounded-xl border border-slate-200 mb-4">
                            <li>Rule L: If I am rated higher than my Left neighbor, I must have more candies than my Left neighbor.</li>
                            <li>Rule R: If I am rated higher than my Right neighbor, I must have more candies than my Right neighbor.</li>
                        </ul>
                        <p className="text-slate-600 leading-relaxed">Trying to satisfy both rules at once requires looking ahead into the array, which is messy. Instead, we fill an array with 1s. Then we sweep Left-to-Right, enforcing Rule L (<code>candies[i] = candies[i-1] + 1</code>). Then we sweep Right-to-Left, enforcing Rule R. By using <code>Math.max()</code> on the second sweep, we guarantee we don't violate the changes made during the first sweep!</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-violet-500"/> 2. Single Pass Peak/Valley Optimization</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">The $O(1)$ space optimization treats the array like a terrain map. You are either going UP an incline, DOWN a slope, or walking FLAT.</p>
                        <p className="text-slate-600 leading-relaxed">When going UP, it's easy: just give the current child <code>1 + up</code> candies. When going DOWN, you also give the current child 1 candy, but conceptually, you are pushing the entire descending slope upwards, which means adding <code>down</code> candies to the total sum. The only trick is ensuring the PEAK of the mountain doesn't get swallowed by a very long valley, which we handle via the <code>peak</code> variable.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Clock size={24} className="text-sky-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Two Pass Time/Space:</strong> We iterate over the array exactly three times (L2R, R2L, Sum). Time: <strong>O(N)</strong>. We allocate a <code>candies</code> array of size N. Space: <strong>O(N)</strong>.</li>
                            <li><strong>Single Pass Time/Space:</strong> We iterate through the array exactly once. Time: <strong>O(N)</strong>. We only use primitive integer variables (sum, up, down, peak). Space: <strong>O(1)</strong>.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Candy is a classic LeetCode Hard problem. The Two-Pass solution is the expected standard answer. If you can derive the Single-Pass Peak/Valley solution, it is considered an exceptional demonstration of mathematical reasoning."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "In the Two Pass algorithm, why do we use `Math.max()` on the right-to-left pass instead of just overriding?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To ensure we don't violate the constraints established during the first pass."</p>
                            <p>If we just did <code>candies[i] = candies[i+1] + 1</code>, we might lower a child's candy count that was previously elevated by the left-to-right pass. For example, if a child is a peak (higher than both neighbors), they need enough candies to satisfy BOTH sides. Using <code>Math.max</code> guarantees they satisfy whichever neighbor requires them to have more candies.</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q2: "What if two adjacent children have the exact same rating? Do they need the same amount of candies?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, they don't."</p>
                            <p>The problem states: 'Children with a HIGHER rating get more candies than their neighbors'. It says nothing about equal ratings. If two adjacent children have a rating of 2, the second one can safely receive 1 candy (saving us total candies) as long as it doesn't violate rules with its OTHER neighbor.</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-violet-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-violet-500 mt-0.5"><Cpu size={24}/></span>
                            <span>Q3: "In the Single Pass approach, what is the purpose of the `peak` variable?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It acts as a ceiling for the down slope."</p>
                            <p>When going down a slope, we implicitly add 1 candy to every child in that slope. If a down slope gets so long that its depth exceeds the height of the peak that preceded it, we must also retroactively add a candy to the peak child to maintain the strict <code>&gt;</code> relationship. <code>(peak &gt;= down ? 0 : 1)</code> mathematically handles this retroactive bump.</p>
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
                              {selectedOp.icon}
                          </div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                  </div>
                  <div ref={codeContainerFullscreenRef} className="flex-1 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 pb-10 relative scroll-smooth">
                    
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 mb-4 ${st.isSuccess === true ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase?.includes('upd') || st.hlPhase?.includes('process') || st.hlPhase?.includes('sum_add') ? `text-${themeColor}-400` : 'text-white'}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                    </div>

                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={`fs-code-${idx}`} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} idPrefix="fs-"/>
                        ))}
                    </div>

                  </div>
              </div>
              <div className="flex-1 relative bg-slate-100 overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px] flex flex-col">
                  
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? `bg-${themeColor}-600 text-white shadow-md` : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title.split('.')[1].trim()}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="flex w-64 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600 block`}>Ratings Array</label>
                              <input type="text" value={ratingsInput} onChange={(e) => setRatingsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-slate-900 tracking-widest`} placeholder="1, 0, 2, 3..." />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><RotateCcw size={24}/></button>
                            <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-3 text-slate-600 hover:text-rose-600 rounded-lg transition-colors`}><Minimize size={24}/></button>
                        </div>
                  </div>

                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-50 flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess === true} className={`px-12 py-6 bg-${themeColor}-600 text-white rounded-[2rem] hover:bg-${themeColor}-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-${themeColor}-500 shadow-xl`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  <div className="flex-1 w-full h-full flex flex-col pt-32 pb-10 px-10 overflow-y-auto">
                       {renderVisuals()}
                  </div>

                  {(st.isSuccess === true) && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 bg-emerald-500/20 text-emerald-500 ring-emerald-500/10`}>
                                    <PartyPopper size={48}/>
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">DISTRIBUTION COMPLETE</h2>
                                <p className={`font-mono text-xs uppercase mb-8 tracking-widest opacity-60 text-emerald-400`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-[10px] font-black uppercase tracking-widest mb-2 text-emerald-500`}>Total Candies Required</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center gap-2">{st.sum}</div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-${themeColor}-600 hover:bg-${themeColor}-700 shadow-${themeColor}-900/20`}>
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