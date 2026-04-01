import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp, ArrowLeft,
  ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, Zap, Goal, Info, Layers, 
  ZoomIn, ZoomOut, Maximize, Hash, Trash2, Search,
  Scissors, ShieldAlert, Cpu, Lightbulb, PlayCircle,
  MonitorPlay, PartyPopper, CheckCircle2, XCircle, X,
  Filter, Terminal, Braces, Layout, Minimize, Repeat,
  Split, GitMerge, Share2, MousePointer2, 
  Binary, Layers as LayersIcon, CircleDashed, CheckSquare, PlusSquare, 
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Combine, Dices, BoxSelect, ArrowDownUp, Maximize2, Variable,
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, Divide, Ship, Package, Calendar, Anchor, Waves, Weight, SearchCode, Minus, Type
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  depthCounter: {
    id: 'depthCounter',
    title: '1. Nesting Depth Counter (O(1) Aux Space)',
    icon: <Brackets size={16} />,
    complexity: 'Time: O(N) | Space: O(N) for output',
    theme: 'emerald',
    code: `class Solution {
    public String removeOuterParentheses(String s) {
        StringBuilder sb = new StringBuilder();
        int opened = 0;
        
        for (char c : s.toCharArray()) {
            if (c == '(') {
                if (opened > 0) {
                    sb.append(c);
                }
                opened++;
            } else {
                opened--;
                if (opened > 0) {
                    sb.append(c);
                }
            }
        }
        
        return sb.toString();
    }
}`,
    desc: "The Optimal Approach: Depth Counting. We iterate through the string character by character while maintaining a counter for the current 'nesting depth' of parentheses. When we encounter an opening parenthesis '(', if our depth is > 0, it means this is an INNER parenthesis, so we add it to our result. Then we increase our depth. When we encounter a closing parenthesis ')', we decrease our depth first. If the new depth is > 0, it means it was an INNER closing parenthesis, so we add it. This elegantly filters out the outermost matching pairs (where depth transitions from 0 to 1, or 1 to 0) in exactly O(N) time without needing an explicit Stack data structure!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|new|String|StringBuilder|removeOuterParentheses|s|sb|opened|c|toCharArray|append|toString)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'double', 'boolean', 'class', 'return', 'if', 'else', 'new', 'break'].includes(part);
            const isObject = ['String', 'StringBuilder'].includes(part);
            const isPointer = ['s', 'sb', 'opened', 'c'].includes(part);
            const isMapCall = ['removeOuterParentheses', 'toCharArray', 'append', 'toString'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^'].includes(part.trim());
            const isCharLiteral = part.startsWith("'");
            
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
                  isCharLiteral ? 'text-amber-300' :
                  isNaN(parseInt(part)) ? (part.startsWith('"') ? 'text-amber-300' : '') : 'text-emerald-400'
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

export default function RemoveOutermostParenthesesVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('depthCounter');
  
  const [sInput, setSInput] = useState('(()())(())');
  
  const [baseS, setBaseS] = useState<string>('(()())(())');

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
      // Basic sanitization to only allow ( and )
      let parsed = sInput.replace(/[^()]/g, '');
      if (parsed.length === 0) parsed = "(()())(())";
      if (parsed.length > 24) parsed = parsed.slice(0, 24); // UI bounds limitation

      setBaseS(parsed);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [sInput, selectedOpId]);

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
    const s = baseS;
    const n = s.length;

    let sb = "";
    let opened = 0;
    
    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            s, sb, opened, ...st 
        } 
    });

    add("Function Call", `public String removeOuterParentheses(String s)`, 2, {});

    add("Init StringBuilder", `StringBuilder sb = new StringBuilder();\nCreating an empty result string.`, 3, { hlInit: true });
    
    add("Init Counter", `int opened = 0;\nSetting the initial nesting depth counter to 0.`, 4, { hlInit: true });

    for (let i = 0; i < n; i++) {
        let c = s[i];
        
        add("Traverse String", `for (char c : s.toCharArray())\nReading character at index ${i}: '${c}'.`, 6, { hlLoop: true, activeIdx: i, curChar: c });

        if (c === '(') {
            add("Check Open Parenthesis", `if (c == '(')\nCharacter is an opening parenthesis.`, 7, { hlIfOpen: true, activeIdx: i, curChar: c });
            
            let isInnerOpen = opened > 0;
            add("Check Depth", `if (opened > 0)\nCurrent depth is ${opened}. Is this an inner parenthesis? (${isInnerOpen ? 'Yes' : 'No, it is outermost'})`, 8, { hlCheckDepthOpen: true, activeIdx: i, curChar: c, isInnerOpen });
            
            if (isInnerOpen) {
                sb += c;
                add("Append Inner Open", `sb.append(c);\nAppending the inner '(' to the result.`, 9, { hlAppendOpen: true, activeIdx: i, curChar: c, isInnerOpen, appended: true });
            }

            let oldOpened = opened;
            opened++;
            add("Increase Depth", `opened++;\nMoving deeper into the structure. Depth increases from ${oldOpened} to ${opened}.`, 11, { hlIncOpened: true, activeIdx: i, curChar: c, isInnerOpen });

        } else {
            add("Check Close Parenthesis", `else\nCharacter is a closing parenthesis ')'.`, 12, { hlElse: true, activeIdx: i, curChar: c });

            let oldOpened = opened;
            opened--;
            add("Decrease Depth", `opened--;\nMoving out of the structure. Depth decreases from ${oldOpened} to ${opened}.`, 13, { hlDecOpened: true, activeIdx: i, curChar: c });

            let isInnerClose = opened > 0;
            add("Check Depth", `if (opened > 0)\nNew depth is ${opened}. Was this an inner closing parenthesis? (${isInnerClose ? 'Yes' : 'No, it closed the outermost primitive'})`, 14, { hlCheckDepthClose: true, activeIdx: i, curChar: c, isInnerClose });

            if (isInnerClose) {
                sb += c;
                add("Append Inner Close", `sb.append(c);\nAppending the inner ')' to the result.`, 15, { hlAppendClose: true, activeIdx: i, curChar: c, isInnerClose, appended: true });
            }
        }
    }

    add("Return Result", `return sb.toString();\nReturning the final string with all outermost parentheses stripped!`, 19, { isSuccess: true, finalAns: sb });

    return steps;
  }, [baseS, selectedOpId]);

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

  const renderActiveDashboard = () => {
      if (st.s === undefined) return null;

      let isSuccessEnd = st.isSuccess;

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? 'border-emerald-400 ring-4 ring-emerald-100' : 'border-slate-200'} scale-105 z-40`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Brackets size={14}/> Active Processing State</span>
              
              {isSuccessEnd ? (
                  <div className="flex flex-col items-center justify-center gap-2 font-mono min-h-[80px] w-full">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Final String</div>
                      <div className={`flex items-center justify-center text-emerald-600 bg-emerald-50 border-emerald-300 font-mono font-black text-3xl px-8 py-4 rounded-2xl border-2 shadow-md w-full break-all min-h-[80px]`}>
                          {st.finalAns === "" ? <span className="text-slate-400 italic font-normal text-lg">Empty String ""</span> : st.finalAns}
                      </div>
                  </div>
              ) : st.curChar !== undefined ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10 font-mono w-full min-h-[80px]">
                      
                      {/* Current Char */}
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-amber-500 mb-1 flex items-center gap-1"><Type size={12}/> Current Char</span>
                          <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-amber-50 border-amber-300 text-amber-800 shadow-md`}>
                              {st.curChar}
                          </div>
                      </div>
                      
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      
                      {/* Depth Counter */}
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-sky-500 mb-1 flex items-center gap-1"><LayersIcon size={12}/> Depth (opened)</span>
                          <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${(st.hlIncOpened || st.hlDecOpened) ? 'bg-sky-100 border-sky-500 text-sky-800 scale-110 shadow-lg' : 'bg-sky-50 border-sky-200 text-sky-800'}`}>
                              {st.opened}
                          </div>
                      </div>

                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>

                      {/* Action Taken */}
                      <div className="flex flex-col items-center min-w-[150px]">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Action</span>
                          <div className="flex flex-col items-center gap-2">
                              {st.appended ? (
                                  <span className={`text-sm font-black uppercase px-3 py-1.5 w-full text-center rounded text-emerald-700 bg-emerald-100 border border-emerald-300 shadow-sm animate-in zoom-in`}>
                                      APPENDED
                                  </span>
                              ) : st.hlCheckDepthOpen || st.hlCheckDepthClose || st.hlIfOpen || st.hlElse ? (
                                  <span className={`text-sm font-black uppercase px-3 py-1.5 w-full text-center rounded text-slate-500 bg-slate-100 border border-slate-300`}>
                                      Checking...
                                  </span>
                              ) : st.hlIncOpened || st.hlDecOpened ? (
                                  <span className={`text-sm font-black uppercase px-3 py-1.5 w-full text-center rounded ${st.isInnerOpen || st.isInnerClose ? 'text-slate-500 bg-slate-100 border border-slate-300' : 'text-rose-700 bg-rose-100 border border-rose-300 shadow-sm animate-in zoom-in'}`}>
                                      {st.isInnerOpen || st.isInnerClose ? 'Update Depth' : 'DISCARDED (Outer)'}
                                  </span>
                              ) : (
                                  <span className={`text-sm font-black uppercase px-3 py-1.5 w-full text-center rounded text-slate-500 bg-slate-100 border border-slate-300`}>
                                      -
                                  </span>
                              )}
                          </div>
                      </div>

                  </div>
              ) : (
                  <span className="text-slate-400 italic text-sm py-4">Initializing String Builder...</span>
              )}

          </div>
      );
  };

  const renderVisuals = () => {
      if (st.s === undefined) return <span className="text-slate-400 italic">empty</span>;

      const nodeWidth = 48;
      const nodeGap = 12;
      const totalColWidth = nodeWidth + nodeGap;
      const containerWidth = st.s.length * totalColWidth;
      const startX = -(containerWidth / 2) + (totalColWidth / 2);
      
      const rowYInput = 100;
      const rowYOutput = 280;

      // Track depth mathematically for rendering primitives
      let depths = [];
      let currentD = 0;
      let primitiveIds = [];
      let currentPrimId = 0;

      for (let i=0; i<st.s.length; i++) {
          if (st.s[i] === '(') {
              depths.push(currentD);
              primitiveIds.push(currentPrimId);
              currentD++;
          } else {
              currentD--;
              depths.push(currentD);
              primitiveIds.push(currentPrimId);
              if (currentD === 0) currentPrimId++;
          }
      }

      // Colors for primitives
      const primColors = [
          {bg: 'bg-sky-50', border: 'border-sky-300', text: 'text-sky-700'},
          {bg: 'bg-fuchsia-50', border: 'border-fuchsia-300', text: 'text-fuchsia-700'},
          {bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700'},
          {bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700'},
          {bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-700'},
      ];

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Middle: Logic Dashboard */}
              <div className="flex flex-col items-center w-full mt-2 pointer-events-auto z-50">
                  {renderActiveDashboard()}
              </div>

              {/* Bottom: The Arrays */}
              <div className="flex flex-col items-center justify-center relative w-full max-w-6xl mt-4">
                  
                  <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-start mt-8 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner overflow-hidden`} style={{ minHeight: '440px' }}>
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                      <div className="relative w-0 h-full overflow-visible flex justify-center mt-8 pb-16">
                          
                          {/* Labels */}
                          <span className="absolute text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 rounded -translate-x-1/2" style={{ left: `${startX - 80}px`, top: `${rowYInput}px` }}>s (Input)</span>
                          <span className="absolute text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 rounded border border-emerald-200 -translate-x-1/2" style={{ left: `${startX - 80}px`, top: `${rowYOutput}px` }}>sb (Output)</span>

                          {/* Dynamic Connection Arrow */}
                          <svg className="absolute top-0 left-0 w-full h-full overflow-visible z-10 pointer-events-none" style={{ width: '1px', height: '1px' }}>
                              <g style={{ transform: 'translateX(50%)' }}>
                                  {st.appended && st.activeIdx !== undefined && !st.isSuccess && (
                                      <path 
                                          d={`M ${startX + (st.activeIdx * totalColWidth)} ${rowYInput + 30} C ${startX + (st.activeIdx * totalColWidth)} ${rowYInput + 80}, ${startX + ((st.sb.length - 1) * totalColWidth)} ${rowYOutput - 80}, ${startX + ((st.sb.length - 1) * totalColWidth)} ${rowYOutput - 30}`} 
                                          fill="none" 
                                          stroke="#10b981" 
                                          strokeWidth="3" 
                                          strokeDasharray="6 6"
                                          markerEnd="url(#arrowheadAppend)"
                                          className="animate-pulse"
                                      />
                                  )}
                                  <defs>
                                      <marker id="arrowheadAppend" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                          <path d="M 0 0 L 6 3 L 0 6 Z" fill="#10b981" />
                                      </marker>
                                  </defs>
                              </g>
                          </svg>

                          {/* Input Array Elements */}
                          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-visible">
                              {st.s.split('').map((char: string, idx: number) => {
                                  let currentX = startX + (idx * totalColWidth);
                                  let isActive = st.activeIdx === idx && !st.isSuccess;
                                  let isProcessed = st.activeIdx !== undefined && idx < st.activeIdx;
                                  
                                  let pColor = primColors[primitiveIds[idx] % primColors.length];
                                  let isOuter = depths[idx] === 0;

                                  let bgClass = "bg-white border-slate-300 text-slate-400"; 
                                  let scaleClass = "scale-100";

                                  if (isActive) {
                                      bgClass = "bg-amber-100 border-amber-500 text-amber-900 shadow-xl ring-4 ring-amber-200 z-30";
                                      scaleClass = "scale-125";
                                  } else if (isProcessed) {
                                      if (isOuter) {
                                          bgClass = "bg-slate-100 border-slate-200 text-slate-300 opacity-40 border-dashed";
                                      } else {
                                          bgClass = `${pColor.bg} ${pColor.border} ${pColor.text} opacity-60 shadow-sm`;
                                      }
                                  } else {
                                      bgClass = "bg-white border-slate-300 text-slate-600 shadow-sm";
                                  }

                                  if (st.isSuccess) {
                                       bgClass = isOuter ? "bg-slate-100 border-slate-200 text-slate-300 opacity-20 border-dashed" : `${pColor.bg} ${pColor.border} ${pColor.text} opacity-80 shadow-sm`;
                                  }

                                  return (
                                      <div key={`input-${idx}`} className={`absolute flex flex-col items-center transition-all duration-500 ${scaleClass}`} style={{ left: `calc(50% + ${currentX}px)`, top: `${rowYInput}px`, transform: 'translate(-50%, -50%)' }}>
                                          
                                          {/* Discarded Mark */}
                                          {isProcessed && isOuter && !isActive && !st.isSuccess && (
                                              <span className="absolute -top-6 text-[12px] text-rose-400 font-black"><X size={16}/></span>
                                          )}

                                          {/* Element Box */}
                                          <div className={`w-[${nodeWidth}px] h-[${nodeWidth}px] flex items-center justify-center border-[3px] rounded-lg transition-all duration-300 ${bgClass}`}>
                                              <span className="font-mono font-black text-2xl">{char}</span>
                                          </div>
                                          
                                          {/* Index & Pointer */}
                                          {isActive && (
                                              <div className="absolute -bottom-10 flex flex-col items-center animate-bounce">
                                                  <ArrowUp size={16} className="text-amber-500 mb-0.5"/>
                                                  <span className="text-[9px] font-black uppercase text-amber-700 tracking-widest bg-amber-100 px-1 rounded border border-amber-300 shadow-sm">i</span>
                                              </div>
                                          )}

                                          {/* Visual Depth Stack Hint */}
                                          {!st.isSuccess && !isOuter && (
                                              <div className="absolute -top-8 flex flex-col-reverse gap-0.5 pointer-events-none opacity-40">
                                                  {Array.from({length: depths[idx]}).map((_, d) => (
                                                      <div key={`d-${d}`} className={`h-1 w-6 rounded-full ${pColor.bg.replace('50', '400')}`}></div>
                                                  ))}
                                              </div>
                                          )}
                                      </div>
                                  )
                              })}
                          </div>

                          {/* Output Array Elements */}
                          {st.sb !== undefined && (
                              <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-visible">
                                  {st.sb.split('').map((char: string, idx: number) => {
                                      let currentX = startX + (idx * totalColWidth);
                                      
                                      let isJustAppended = st.appended && idx === st.sb.length - 1 && !st.isSuccess;

                                      let bgClass = "bg-emerald-50 border-emerald-400 text-emerald-800 shadow-md"; 
                                      let scaleClass = "scale-100";

                                      if (isJustAppended) {
                                          bgClass = "bg-emerald-400 border-emerald-500 text-white shadow-xl ring-4 ring-emerald-200 z-30";
                                          scaleClass = "scale-125 animate-in zoom-in duration-300";
                                      } else if (st.isSuccess) {
                                          bgClass = "bg-emerald-500 border-emerald-600 text-white shadow-lg z-30";
                                      }

                                      return (
                                          <div key={`output-${idx}`} className={`absolute flex flex-col items-center transition-all duration-500 ${scaleClass}`} style={{ left: `calc(50% + ${currentX}px)`, top: `${rowYOutput}px`, transform: 'translate(-50%, -50%)' }}>
                                              
                                              {/* Element Box */}
                                              <div className={`w-[${nodeWidth}px] h-[${nodeWidth}px] flex items-center justify-center border-[3px] rounded-lg transition-all duration-300 ${bgClass}`}>
                                                  <span className="font-mono font-black text-2xl">{char}</span>
                                              </div>
                                          </div>
                                      )
                                  })}
                              </div>
                          )}

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
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-600`}>
                <Brackets className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Remove Outermost Parentheses</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      String &amp; Depth Counting
                  </span>
                  <span>•</span>
                  <span>LeetCode 1021</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Brackets size={28}/> Stripping the Shell</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>A valid parentheses string is either empty <code>""</code>, <code>"(" + A + ")"</code>, or <code>A + B</code>, where <code>A</code> and <code>B</code> are valid parentheses strings.</p>
                        <p>A valid parentheses string <code>s</code> is <strong>primitive</strong> if it is nonempty, and there does not exist a way to split it into <code>s = A + B</code>, with <code>A</code> and <code>B</code> nonempty valid parentheses strings.</p>
                        <p>Given a valid parentheses string <code>s</code>, consider its primitive decomposition: <code>s = P_1 + P_2 + ... + P_k</code>, where <code>P_i</code> are primitive valid parentheses strings.</p>
                        <p className="font-bold mt-4">Return <code>s</code> after removing the outermost parentheses of every primitive string in the primitive decomposition.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> s = "(()())(())"</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">"()()()"</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">The input string is "(()())(())", with primitive decomposition "(()())" + "(())".<br/>After removing outer parentheses of each part, this is "()()" + "()" = "()()()".</span>
                    </div>

                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre mt-4`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> s = "(()())(())(()(()))"</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">"()()()()(())"</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs whitespace-normal">The input string is "(()())(())(()(()))", with primitive decomposition "(()())" + "(())" + "(()(()))".<br/>After removing outer parentheses of each part, this is "()()" + "()" + "()(())" = "()()()()(())".</span>
                    </div>

                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre mt-4`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 3:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> s = "()()"</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">""</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs whitespace-normal">The input string is "()()", with primitive decomposition "()" + "()".<br/>After removing outer parentheses of each part, this is "" + "" = "".</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &lt;= s.length &lt;= 10^5</li>
                            <li>s[i] is either '(' or ')'</li>
                            <li>s is a valid parentheses string</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><LayersIcon size={16} className="text-sky-500"/> Nesting Depth</h4>
                        <p className="text-sm leading-relaxed">The key to solving this is tracking the "depth" of the parentheses. A depth of 0 means we are outside any group. When we see an opening parenthesis `(`, the depth increases. When we see a closing parenthesis `)`, the depth decreases. The "outermost" parentheses are exactly the ones that transition the depth from 0 &rarr; 1, and back from 1 &rarr; 0.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Single Pass Filter</h4>
                        <p className="text-sm leading-relaxed text-slate-600">We don't actually need to "split" the string into primitive components first and process them separately. We can just iterate through the string once! If we only append characters to our result when the depth indicates they are strictly <strong>inside</strong> a primitive structure, the outermost brackets are naturally filtered out.</p>
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
                        <div className="flex-[3] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Valid Parentheses String (Max length 24)</label>
                            <input type="text" value={sInput} onChange={(e) => setSInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold tracking-[0.2em]`} placeholder="(()())(())" />
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
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3">
                                <PartyPopper size={24}/> STRIPPING COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Final stripped string successfully generated.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlAppendOpen || st.hlAppendClose ? 'text-emerald-400' : (st.hlIncOpened ? 'text-sky-400' : (st.hlDecOpened ? 'text-rose-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                            
                            {/* Persistent State Monitor */}
                            {st.s !== undefined && !st.isSuccess && (
                                <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap gap-2">
                                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">opened (depth)</span>
                                        <span className="font-mono font-black text-sky-400">{st.opened !== undefined ? st.opened : '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">Current Char</span>
                                        <span className="font-mono font-black text-amber-400">{st.curChar !== undefined ? st.curChar : '-'}</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[440px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Type size={14} className={`text-${themeColor}-500`}/> String Builder Array Mapping</span>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding nesting depth as a stack replacement.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><LayersIcon size={24} className="text-emerald-500"/> 1. The Integer Stack Trick</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Usually, parenthesis matching problems require a Stack. However, because we are guaranteed that the input string is perfectly valid and only contains one type of bracket, the size of the stack is fully predictable. We can replace a heavy Stack data structure with a single integer <code>opened</code> that just counts the depth!</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Scissors size={24} className="text-amber-500"/> 2. Symmetrical Filtering</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">To discard the outermost parentheses, we just need to identify them.</p>
                        <p className="text-slate-600 leading-relaxed"><strong>Opening:</strong> The outermost opening parenthesis is the one that increases depth from 0 to 1. Therefore, if we only append an opening parenthesis when the depth is ALREADY &gt; 0, we effectively ignore the outermost one.</p>
                        <p className="text-slate-600 leading-relaxed"><strong>Closing:</strong> The outermost closing parenthesis is the one that decreases depth from 1 to 0. Therefore, we decrease depth FIRST, and if the remaining depth is &gt; 0, we know it's an inner parenthesis and append it.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-sky-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N).</strong> We traverse the string exactly once. Operations inside the loop (comparisons, increments, appends) are all O(1). Thus, total time is linear.</li>
                            <li><strong>Space Complexity: O(N).</strong> We allocate a <code>StringBuilder</code> (or character array) to construct the final answer, which in the worst-case (a completely flat, deeply nested primitive like <code>((()))</code>) will contain almost all characters from the original string. The auxiliary space for calculation (the <code>opened</code> counter) is strictly O(1).</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-emerald-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is considered an 'Easy' problem on LeetCode, but in an interview, the goal isn't just to solve it, but to solve it cleanly. Interviewers will look at how elegantly you handle the condition checks."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could you use two pointers to find primitive components and process them via substring extraction?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, but it's less efficient."</p>
                            <p>You could maintain a counter, find where the depth hits 0 (marking the end of a primitive string), and use <code>s.substring(start+1, end)</code> to append the inner part. However, extracting substrings repeatedly causes massive string allocation overhead and forces redundant iteration in memory, making it technically slower than single-pass char-by-char appending.</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "Can you optimize the code further? Maybe with fewer if-statements?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, we can use post-fix and pre-fix operators creatively."</p>
                            <p className="font-mono bg-slate-100 p-3 rounded text-sm text-slate-800">
                                if (c == '(' && opened++ &gt; 0) sb.append(c);<br/>
                                if (c == ')' && opened-- &gt; 1) sb.append(c);
                            </p>
                            <p>This collapses the increment and condition check into a single line for each branch. It's incredibly concise, but in a production environment, some teams prefer the explicit, readable multi-line version."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "What if the input string was NOT guaranteed to be valid?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The current approach would fail."</p>
                            <p>If the string could be invalid (e.g., <code>"())("</code>), our depth counter could go negative, which breaks the assumption of outer/inner layers. We would first need to either validate the string using an explicit stack or use two passes (forward and backward) to filter out invalid brackets before doing the outermost stripping.</p>
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
                              <Brackets size={20}/>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlAppendOpen || st.hlAppendClose ? 'text-emerald-400' : (st.hlIncOpened ? 'text-sky-400' : (st.hlDecOpened ? 'text-rose-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        
                        {/* Persistent State Monitor for Fullscreen */}
                        {st.s !== undefined && !st.isSuccess && (
                            <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap gap-2">
                                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">opened (depth)</span>
                                    <span className="font-mono font-black text-sky-400">{st.opened !== undefined ? st.opened : '-'}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">Current Char</span>
                                    <span className="font-mono font-black text-amber-400">{st.curChar !== undefined ? st.curChar : '-'}</span>
                                </div>
                            </div>
                        )}

                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? `bg-${themeColor}-600 text-white shadow-md` : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="flex-[3] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Valid Parentheses String (Max 24)</label>
                              <input type="text" value={sInput} onChange={(e) => setSInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold tracking-[0.2em]`} placeholder="(()())(())" />
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
                                
                                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10"><PartyPopper size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">STRIPPING COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Final stripped string generated</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Final String</div>
                                    <div className="font-mono text-white text-3xl font-black leading-relaxed flex items-center gap-2 break-all">{st.finalAns === "" ? <span className="text-slate-400 italic font-normal text-lg">Empty String ""</span> : st.finalAns}</div>
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