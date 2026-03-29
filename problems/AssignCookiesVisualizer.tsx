import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, 
  RotateCcw, ListOrdered, Lightbulb, MonitorPlay, PartyPopper,
  XCircle, Minimize, Layers as LayersIcon, ZoomIn, ZoomOut, Maximize, 
  SortAsc, AlertTriangle, Clock, Cpu, HelpCircle, Target, User, CircleDashed, CheckCircle2, FastForward,
  Goal, Workflow, CheckSquare, ShieldAlert
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  greedyTwoPointers: {
    id: 'greedyTwoPointers',
    title: '1. Greedy + Two Pointers',
    icon: <SortAsc size={16} />,
    complexity: 'Time: O(N log N) | Space: O(1)',
    theme: 'amber',
    code: `class Solution {
    public int findContentChildren(int[] g, int[] s) {
        Arrays.sort(g);
        Arrays.sort(s);
        
        int i = 0;
        int j = 0;
        
        while (i < g.length && j < s.length) {
            if (s[j] >= g[i]) {
                // Cookie fits! Child is happy.
                i++;
                j++;
            } else {
                // Cookie too small, try next cookie.
                j++;
            }
        }
        
        return i;
    }
}`,
    desc: "The standard optimal approach using a Greedy strategy. We sort both the children's greed array and the cookies array. We use two pointers (`i` for children, `j` for cookies). We always try to satisfy the least greedy child with the smallest cookie that fits. If a cookie is too small, we skip it (`j++`). If it fits, the child gets it, and we move to the next child and next cookie (`i++`, `j++`)."
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'amber', idPrefix = '' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|boolean|class|return|if|else|while|for|new|String|findContentChildren|Arrays|sort|length|g|s|i|j|Solution)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}\(\)])/g).filter(Boolean);
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
            
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'boolean', 'class', 'return', 'if', 'else', 'while', 'for', 'new'].includes(part);
            const isObject = ['Solution', 'Arrays'].includes(part);
            const isPointer = ['g', 's', 'i', 'j', 'length'].includes(part);
            const isMapCall = ['findContentChildren', 'sort'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^', '{', '}', '(', ')'].includes(trimmed);
            
            return (
              <span 
                key={idx} 
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

export default function AssignCookiesVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('greedyTwoPointers');
  
  const [gInput, setGInput] = useState('1, 2, 3');
  const [sInput, setSInput] = useState('1, 1');
  
  const [gArr, setGArr] = useState([1, 2, 3]);
  const [sArr, setSArr] = useState([1, 1]);

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1); 
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef(null);
  const codeContainerMainRef = useRef(null);
  const codeContainerFullscreenRef = useRef(null);
  const selectedOp = OPERATIONS[selectedOpId];
  const themeColor = selectedOp.theme;

  // --- Effects for Data Processing ---

  const parseArrayInput = (inputStr, fallback) => {
      let rawTokens = inputStr.split(',');
      let parsedArr = [];
      for (let token of rawTokens) {
          let t = token.trim();
          let num = parseInt(t, 10);
          if (!isNaN(num)) parsedArr.push(num);
      }
      if (parsedArr.length === 0) parsedArr = fallback;
      if (parsedArr.length > 20) parsedArr = parsedArr.slice(0, 20); // Cap for visualization
      return parsedArr;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setGArr(parseArrayInput(gInput, [1, 2, 3]));
      setSArr(parseArrayInput(sInput, [1, 1]));
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [gInput, sInput, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e) => {
        if (!canvasContainerRef.current?.contains(e.target)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.4), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps = [];
    
    // Arrays state tracking
    let g = [...gArr];
    let s = [...sArr];
    let i = 0;
    let j = 0;
    let matches = []; // [{ childIdx, cookieIdx }]

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            gState: [...g], sState: [...s], i, j, matches: [...matches], ...st 
        } 
    });

    add("Init", `public int findContentChildren(int[] g, int[] s)`, 2, { hlPhase: 'init', isUnsorted: true });

    g.sort((a, b) => a - b);
    add("Sort Greed Array", `Arrays.sort(g);\nSorting the children's greed factors in ascending order.`, 3, { hlPhase: 'sortG', isUnsorted: true });

    s.sort((a, b) => a - b);
    add("Sort Cookies Array", `Arrays.sort(s);\nSorting the cookie sizes in ascending order.`, 4, { hlPhase: 'sortS' });

    add("Init Pointer i", `int i = 0;\nPointer i tracks the current child.`, 6, { hlPhase: 'initPointers' });
    add("Init Pointer j", `int j = 0;\nPointer j tracks the current cookie.`, 7, { hlPhase: 'initPointers' });

    while (true) {
        if (steps.length > 500) break; // Infinite loop guard
        
        let conditionMet = i < g.length && j < s.length;
        add("Check Loop Condition", `while (i < g.length && j < s.length)\ni=${i}, len(g)=${g.length} | j=${j}, len(s)=${s.length}`, 9, { hlPhase: 'loop', loopCondition: conditionMet });

        if (!conditionMet) break;

        let curG = g[i];
        let curS = s[j];
        let fits = curS >= curG;

        add("Check Cookie Size", `if (s[j] >= g[i])\nDoes cookie ${curS} satisfy child ${curG}? (${fits ? 'Yes' : 'No'})`, 10, { hlPhase: 'checkFits', curG, curS, fits });

        if (fits) {
            matches.push({ childIdx: i, cookieIdx: j });
            add("Assign Cookie", `i++;\nChild ${i} is satisfied with cookie ${j}. Incrementing child pointer i.`, 12, { hlPhase: 'assignI', curG, curS });
            i++;
            add("Consume Cookie", `j++;\nCookie ${j} is consumed. Incrementing cookie pointer j.`, 13, { hlPhase: 'assignJ', curG, curS });
            j++;
        } else {
            add("Cookie Too Small", `j++;\nCookie ${j} (${curS}) is too small for child ${i} (${curG}). We must try a bigger cookie. Incrementing j.`, 16, { hlPhase: 'skipCookie', curG, curS });
            j++;
        }
    }

    add("Done", `return i;\nWe successfully satisfied ${i} children. Returning result!`, 20, { hlPhase: 'success', isSuccess: true, finalAns: i });

    return steps;
  }, [gArr, sArr, selectedOpId]);

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

  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('.scrollbar-thin')) return;
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

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
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
      if (!st.gState || !st.sState) return <span className="text-slate-400 italic mt-10">Initializing Arrays...</span>;

      // Coordinate layout config
      const nodeWidth = 60;
      const nodeGap = 20;
      const totalColWidth = nodeWidth + nodeGap;
      const rowY1 = 40; // G array (Children) Y pos
      const rowY2 = 200; // S array (Cookies) Y pos
      
      const maxLen = Math.max(st.gState.length, st.sState.length);
      const containerWidth = maxLen * totalColWidth;
      const startX = -(containerWidth / 2) + (totalColWidth / 2);

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Dynamic State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40">
                  <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlPhase === 'checkFits' || st.hlPhase === 'assignI' || st.hlPhase === 'assignJ' || st.hlPhase === 'skipCookie' ? 'border-amber-400 ring-4 ring-amber-100 scale-105' : 'border-slate-200'}`}>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Activity size={14}/> Greedy Evaluation State</span>
                      
                      {st.hlPhase === 'init' || st.hlPhase === 'sortG' || st.hlPhase === 'sortS' || st.hlPhase === 'initPointers' ? (
                          <div className="flex flex-wrap items-center justify-center gap-6 font-mono min-h-[80px] py-2 w-full">
                              <div className="flex items-center gap-4 text-slate-600 font-mono font-black text-xl bg-slate-50 px-6 py-3 rounded-2xl border-2 border-slate-300 shadow-md">
                                  <span>Pre-computation Phase</span> <ArrowRight size={24} /> <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">Sorting & Init</span>
                              </div>
                          </div>
                      ) : st.loopCondition === false || st.isSuccess ? (
                          <div className="flex flex-wrap items-center justify-center gap-6 font-mono min-h-[80px] py-2 w-full">
                              <div className="flex items-center gap-4 text-emerald-600 font-mono font-black text-xl bg-emerald-50 px-6 py-3 rounded-2xl border-2 border-emerald-300 shadow-md">
                                  <span>Traversal Complete</span> <ArrowRight size={24} /> <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-emerald-200">{st.i} Children Satisfied</span>
                              </div>
                          </div>
                      ) : st.curG !== undefined && st.curS !== undefined ? (
                          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full">
                              
                              {/* Child G[i] */}
                              <div className="flex flex-col items-center w-[120px]">
                                  <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-rose-500`}>Child g[{st.i}]</span>
                                  <div className={`border-2 text-3xl font-black px-6 py-2 w-full text-center rounded-xl bg-rose-100 border-rose-400 text-rose-900`}>
                                      {st.curG}
                                  </div>
                              </div>

                              {/* Operator */}
                              <div className="flex flex-col items-center justify-center text-slate-400 font-black text-2xl">
                                  <span>&le;</span>
                              </div>

                              {/* Cookie S[j] */}
                              <div className="flex flex-col items-center w-[120px]">
                                  <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-amber-500`}>Cookie s[{st.j}]</span>
                                  <div className={`border-2 text-3xl font-black px-6 py-2 w-full text-center rounded-xl bg-amber-50 border-amber-400 text-amber-800`}>
                                      {st.curS}
                                  </div>
                              </div>

                              <div className="w-px h-12 bg-slate-200 hidden md:block mx-2"></div>
                              
                              {/* Result */}
                              <div className="flex flex-col items-center min-w-[150px]">
                                  <span className={`text-[9px] font-bold uppercase text-slate-400 mb-1`}>Result</span>
                                  {st.fits ? (
                                      <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border-2 border-emerald-400 text-emerald-800 shadow-md">
                                          <CheckCircle2 size={20}/>
                                          <span className="font-black uppercase tracking-wider text-sm">Satisfied!</span>
                                      </div>
                                  ) : (
                                      <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl border-2 border-slate-300 text-slate-500 shadow-sm">
                                          <XCircle size={20}/>
                                          <span className="font-black uppercase tracking-wider text-sm">Too Small</span>
                                      </div>
                                  )}
                              </div>
                          </div>
                      ) : (
                          <div className="flex items-center justify-center w-full min-h-[80px]">
                              <span className="text-slate-400 italic text-sm font-mono">Evaluating Loop Condition...</span>
                          </div>
                      )}
                  </div>
              </div>

              {/* Free-floating Interactive Arrays */}
              <div className="flex flex-col items-center justify-center relative w-full mt-4 max-w-6xl">
                  
                  <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-start mt-8 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner`} style={{ minHeight: '400px' }}>
                      
                      {/* Fixed unified origin container */}
                      <div className="relative w-0 h-full overflow-visible flex justify-center mt-12 pb-16">

                          {/* Connections (Matches) */}
                          <svg className="absolute top-0 left-0 overflow-visible z-10" style={{ width: '1px', height: '1px' }}>
                              <g style={{ transform: 'translateX(50%)' }}>
                                  {st.matches && st.matches.map((match, idx) => {
                                      let sx = startX + (match.childIdx * totalColWidth);
                                      let sy = rowY1 + 30; // Bottom of child box
                                      let tx = startX + (match.cookieIdx * totalColWidth);
                                      let ty = rowY2 - 30; // Top of cookie box
                                      
                                      // Curve logic
                                      let controlY = (sy + ty) / 2;
                                      
                                      return (
                                          <path 
                                              key={`match-${idx}`} 
                                              d={`M ${sx} ${sy} C ${sx} ${controlY}, ${tx} ${controlY}, ${tx} ${ty}`} 
                                              fill="none" 
                                              stroke="#10b981" 
                                              strokeWidth="4" 
                                              className="transition-all duration-500 shadow-lg"
                                              opacity="0.8"
                                          />
                                      );
                                  })}
                              </g>
                          </svg>

                          {/* Children Array (G) */}
                          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-visible">
                              <div className="absolute text-rose-400 font-black font-mono tracking-widest uppercase text-sm -translate-x-1/2 whitespace-nowrap" style={{ left: `${startX - 100}px`, top: `${rowY1}px` }}>g (Children)</div>
                              {st.gState && st.gState.map((val, idx) => {
                                  let isMatched = st.matches && st.matches.some(m => m.childIdx === idx);
                                  let isActive = st.i === idx && !st.isSuccess;
                                  
                                  let bgClass = "bg-white border-slate-300 text-slate-500 shadow-sm"; 
                                  if (isActive) bgClass = "bg-rose-100 border-rose-500 ring-4 ring-rose-200 text-rose-900 shadow-xl z-30";
                                  else if (isMatched) bgClass = "bg-emerald-50 border-emerald-400 text-emerald-800 shadow-md opacity-90";
                                  else if (st.isUnsorted) bgClass = "bg-slate-100 border-slate-300 text-slate-600 shadow-sm";

                                  if (st.isSuccess && !isMatched) bgClass = "bg-slate-50 border-slate-200 text-slate-300 opacity-40 border-dashed";

                                  return (
                                      <div key={`g-${idx}`} className={`absolute flex flex-col items-center transition-all duration-500`} style={{ left: `calc(50% + ${startX + idx * totalColWidth}px)`, top: `${rowY1}px`, transform: 'translate(-50%, -50%)' }}>
                                          
                                          {isActive && (
                                              <span className={`text-[10px] font-black font-mono uppercase tracking-widest absolute -top-8 whitespace-nowrap bg-rose-500 text-white px-2 py-0.5 rounded shadow-sm animate-bounce`}>
                                                  i
                                              </span>
                                          )}
                                          
                                          <div className={`w-[50px] h-[50px] flex flex-col items-center justify-center border-4 rounded-xl transition-all duration-300 ${bgClass} ${isActive ? 'scale-110' : ''}`}>
                                              <User size={16} className={`mb-0.5 ${isActive ? 'text-rose-500' : (isMatched ? 'text-emerald-500' : 'text-slate-400')}`}/>
                                              <span className={`font-mono font-black text-sm leading-none`}>{val}</span>
                                          </div>
                                      </div>
                                  )
                              })}
                          </div>

                          {/* Cookies Array (S) */}
                          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-visible">
                              <div className="absolute text-amber-500 font-black font-mono tracking-widest uppercase text-sm -translate-x-1/2 whitespace-nowrap" style={{ left: `${startX - 100}px`, top: `${rowY2}px` }}>s (Cookies)</div>
                              {st.sState && st.sState.map((val, idx) => {
                                  let isMatched = st.matches && st.matches.some(m => m.cookieIdx === idx);
                                  let isActive = st.j === idx && !st.isSuccess;
                                  let isPassed = st.j > idx && !isMatched; // Cookie was skipped
                                  
                                  let bgClass = "bg-white border-slate-300 text-slate-500 shadow-sm"; 
                                  if (isActive) bgClass = "bg-amber-100 border-amber-500 ring-4 ring-amber-200 text-amber-900 shadow-xl z-30";
                                  else if (isMatched) bgClass = "bg-emerald-50 border-emerald-400 text-emerald-800 shadow-md opacity-90";
                                  else if (isPassed) bgClass = "bg-slate-100 border-slate-200 text-slate-300 border-dashed opacity-40";

                                  if (st.isSuccess && !isMatched) bgClass = "bg-slate-50 border-slate-200 text-slate-300 opacity-40 border-dashed";

                                  return (
                                      <div key={`s-${idx}`} className={`absolute flex flex-col items-center transition-all duration-500`} style={{ left: `calc(50% + ${startX + idx * totalColWidth}px)`, top: `${rowY2}px`, transform: 'translate(-50%, -50%)' }}>
                                          
                                          <div className={`w-[50px] h-[50px] flex flex-col items-center justify-center border-4 rounded-full transition-all duration-300 ${bgClass} ${isActive ? 'scale-110' : ''}`}>
                                              <CircleDashed size={16} className={`mb-0.5 ${isActive ? 'text-amber-500' : (isMatched ? 'text-emerald-500' : 'text-slate-400')}`}/>
                                              <span className={`font-mono font-black text-sm leading-none`}>{val}</span>
                                          </div>

                                          {isActive && (
                                              <span className={`text-[10px] font-black font-mono uppercase tracking-widest absolute -bottom-8 whitespace-nowrap bg-amber-500 text-white px-2 py-0.5 rounded shadow-sm animate-bounce`}>
                                                  j
                                              </span>
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
                <FastForward className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Assign Cookies</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Greedy Two Pointers
                  </span>
                  <span>•</span>
                  <span>LeetCode 455</span>
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
                        <p>Assume you are an awesome parent and want to give your children some cookies. But, you should give each child at most one cookie.</p>
                        <p>Each child <code>i</code> has a greed factor <code>g[i]</code>, which is the minimum size of a cookie that the child will be content with; and each cookie <code>j</code> has a size <code>s[j]</code>. If <code>s[j] &ge; g[i]</code>, we can assign the cookie <code>j</code> to the child <code>i</code>, and the child <code>i</code> will be content.</p>
                        <p>Your goal is to maximize the number of your content children and output the maximum number.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> g = [1,2,3], s = [1,1]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">1</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                You have 3 children and 2 cookies. The greed factors of 3 children are 1, 2, 3.<br/>
                                Even though you have 2 cookies, since their size is both 1, you can only make the child whose greed factor is 1 content.<br/>
                                You need to output 1.
                            </span>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> g = [1,2], s = [1,2,3]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">2</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                You have 2 children and 3 cookies. The greed factors of 2 children are 1, 2.<br/>
                                You have 3 cookies and their sizes are big enough to gratify all of the children.<br/>
                                You need to output 2.
                            </span>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4 max-w-2xl">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li><code>1 &le; g.length &le; 3 * 10^4</code></li>
                            <li><code>0 &le; s.length &le; 3 * 10^4</code></li>
                            <li><code>1 &le; g[i], s[j] &le; 2^31 - 1</code></li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Goal size={16} className="text-sky-500"/> The Core Concept</h5>
                        <p className="text-sm leading-relaxed">This is a classic introductory Greedy algorithm. The "greedy" locally optimal choice here is: <strong>Always try to satisfy the least greedy child with the smallest cookie that fits them.</strong> By doing this, we save larger cookies for greedier children later on.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy</h5>
                        <p className="text-sm leading-relaxed text-slate-600">To implement this efficiently, we must <strong>Sort</strong> both arrays first. Then, we place a pointer <code>i</code> at the start of the children array and a pointer <code>j</code> at the start of the cookies array. We walk through the cookies: if it fits, both pointers advance. If it doesn't fit, the cookie is wasted, so only <code>j</code> advances to try the next bigger cookie.</p>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-rose-500 pl-1`}>g Array (Children Greed)</label>
                            <input type="text" value={gInput} onChange={(e) => setGInput(e.target.value)} className={`w-full bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-inner font-bold text-rose-900`} placeholder="1, 2, 3" />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-amber-500 pl-1`}>s Array (Cookie Sizes)</label>
                            <input type="text" value={sInput} onChange={(e) => setSInput(e.target.value)} className={`w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-inner font-bold text-amber-900`} placeholder="1, 1" />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100 mt-2">
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
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> ASSIGNMENT COMPLETE</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Successfully satisfied {st.finalAns} children.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'assignI' || st.hlPhase === 'assignJ' ? 'text-emerald-400' : (st.hlPhase === 'skipCookie' ? 'text-rose-400' : (st.hlPhase === 'sortG' || st.hlPhase === 'sortS' ? `text-sky-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-slate-100 rounded-[2.5rem] border border-slate-300 p-2 h-[450px] relative flex flex-col shadow-inner overflow-hidden">
                   
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                        </div>
                   </div>

                   <div ref={!isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                       <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-300 flex flex-col justify-start items-center pt-4" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
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
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Theory & Complexity Analysis</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding Greedy Strategies and Array Sorting.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><SortAsc size={24} className={`text-${themeColor}-500`}/> 1. Why Sort First?</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Greedy algorithms inherently rely on evaluating choices in a specific order to ensure that making a "local" optimal choice leads to a "global" optimal solution.</p>
                        <p className="text-slate-600 leading-relaxed">If the arrays were unsorted, we might accidentally waste a massive cookie on a child with very low greed just because they happened to be evaluated first. By sorting both arrays, we guarantee that we are always pairing the <em>smallest possible cookie</em> that satisfies the <em>least greedy available child</em>. This minimizes waste.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowRight size={24} className="text-sky-500"/> 2. The Two-Pointer Technique</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Because both arrays are sorted, we can evaluate them in a single linear pass using two pointers:</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 font-mono text-sm bg-slate-100 p-4 rounded-xl border border-slate-200 mb-4">
                            <li>Pointer <code>i</code> points to the current child.</li>
                            <li>Pointer <code>j</code> points to the current cookie.</li>
                        </ul>
                        <p className="text-slate-600 leading-relaxed">If <code>s[j] &ge; g[i]</code>, the match is successful! We advance both pointers. If the cookie is too small, there's no point checking it against greedier children (since the arrays are sorted). We simply throw the cookie away and advance <code>j</code> to try a bigger one.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N log N + M log M).</strong> Sorting the `g` array takes <code>O(N log N)</code> where <code>N</code> is the number of children. Sorting the `s` array takes <code>O(M log M)</code> where <code>M</code> is the number of cookies. The while-loop traversal itself is strictly linear <code>O(N + M)</code>. Therefore, the sorting steps completely dominate the time complexity.</li>
                            <li><strong>Space Complexity: O(1) or O(log N).</strong> In Java, <code>Arrays.sort()</code> on primitives uses Dual-Pivot Quicksort, which typically operates in-place but requires <code>O(log N)</code> stack space. If we ignore language-specific sorting internals, the two-pointer logic itself requires strictly <strong>O(1)</strong> auxiliary space.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Assign Cookies is a classic warm-up question. Interviewers use it to see if you immediately recognize when sorting unlocks a linear time greedy solution."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we solve this without sorting?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, but it would be horribly inefficient."</p>
                            <p>Without sorting, you would have to evaluate every child against every cookie, searching for the 'best fit'. This would require nested loops resulting in an <code>O(N * M)</code> time complexity, which would fail the constraints (up to 30,000 elements). Sorting is mandatory for an optimal approach.</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q2: "What if the cookies array `s` is much, much larger than the children array `g`?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The <code>while (i &lt; g.length &amp;&amp; j &lt; s.length)</code> condition inherently protects us."</p>
                            <p>Because of the logical AND, the loop terminates the exact moment we run out of children to feed. Even if there are 1 million remaining cookies, the loop breaks instantly, saving execution time.</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Cpu size={24}/></span>
                            <span>Q3: "If the input arrays are already sorted for you, what is the time complexity?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It drops to strictly <code>O(N + M)</code>."</p>
                            <p>Since we bypass the <code>O(N log N)</code> sorting step, the only work performed is the single pass through the arrays with the two pointers. Each pointer only moves forward, meaning we do at most <code>N + M</code> checks.</p>
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
                    
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 mb-4 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'assignI' || st.hlPhase === 'assignJ' ? 'text-emerald-400' : (st.hlPhase === 'skipCookie' ? 'text-rose-400' : (st.hlPhase === 'sortG' || st.hlPhase === 'sortS' ? `text-sky-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                    </div>

                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} idPrefix="fs-"/>
                        ))}
                    </div>

                  </div>
              </div>
              <div className="flex-1 relative bg-slate-100 overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? `bg-${themeColor}-600 text-white shadow-md` : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title.split('.')[1].trim()}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="flex w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-rose-600 block`}>g (Greed)</label>
                              <input type="text" value={gInput} onChange={(e) => setGInput(e.target.value)} className={`w-32 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-rose-500 font-bold text-rose-900`} placeholder="1, 2, 3" />
                          </div>
                          <div className="flex w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-amber-600 block`}>s (Cookies)</label>
                              <input type="text" value={sInput} onChange={(e) => setSInput(e.target.value)} className={`w-32 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-amber-500 font-bold text-amber-900`} placeholder="1, 1" />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><RotateCcw size={24}/></button>
                            <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-3 text-slate-600 hover:text-rose-600 rounded-lg transition-colors`}><Minimize size={24}/></button>
                        </div>
                  </div>
                  
                  {/* Live Scoreboard */}
                  <div className="absolute top-8 right-24 z-30 pointer-events-auto">
                      <div className="flex flex-col bg-white/90 p-4 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur gap-1 animate-in zoom-in items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Satisfied</span>
                          <span className={`text-4xl font-mono font-black text-emerald-600`}>{st.finalAns !== undefined ? st.finalAns : (st.i || 0)}</span>
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
                                
                                <div className={`w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10`}><PartyPopper size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">EVALUATION COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Satisfied Children</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center gap-2">{st.finalAns}</div>
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