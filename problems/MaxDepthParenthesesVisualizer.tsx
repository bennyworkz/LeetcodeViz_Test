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
  Binary, Layers as LayersIcon, CircleDashed, CheckSquare, PlusSquare, ArrowLeftToLine,
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Combine, Dices, BoxSelect, ArrowDownUp, Maximize2, Variable,
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, Divide, Ship, Package, Calendar, Anchor, Waves, Weight, SearchCode, Minus, Type, RefreshCw, BarChart
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  depthCounter: {
    id: 'depthCounter',
    title: '1. Single Pass Depth Tracking',
    icon: <ArrowDownUp size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    theme: 'indigo',
    code: `class Solution {
    public int maxDepth(String s) {
        int currentDepth = 0;
        int maxDepth = 0;
        
        for (char c : s.toCharArray()) {
            if (c == '(') {
                currentDepth++;
                maxDepth = Math.max(maxDepth, currentDepth);
            } else if (c == ')') {
                currentDepth--;
            }
        }
        
        return maxDepth;
    }
}`,
    desc: "The Optimal Approach: Since we are only asked for the maximum depth and we are guaranteed a valid parentheses string, we don't need a Stack data structure! We can just use an integer counter to track the current depth. When we see an opening parenthesis '(', we dive one level deeper (currentDepth++). We then check if this is the deepest we've ever been and update maxDepth. When we see a closing parenthesis ')', we surface one level (currentDepth--). All other characters (numbers, operators) are ignored. This solves the problem perfectly in O(N) time and O(1) space."
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'indigo' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|new|for|while|String|maxDepth|s|currentDepth|c|toCharArray|Math|max)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'double', 'boolean', 'class', 'return', 'if', 'else', 'new', 'for', 'while'].includes(part);
            const isObject = ['String', 'Math'].includes(part);
            const isPointer = ['s', 'currentDepth', 'maxDepth', 'c'].includes(part);
            const isMapCall = ['toCharArray', 'max'].includes(part);
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

export default function MaxDepthParenthesesVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('depthCounter');
  
  const [sInput, setSInput] = useState('(1+(2*3)+((8)/4))+1');
  const [baseS, setBaseS] = useState<string>('(1+(2*3)+((8)/4))+1');

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
      // Basic sanitization
      let parsedS = sInput.trim();
      if (parsedS.length === 0) parsedS = "(1+(2*3)+((8)/4))+1";
      if (parsedS.length > 24) parsedS = parsedS.slice(0, 24); // UI bounds limitation

      setBaseS(parsedS);
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
    const sStr = baseS;

    let currentDepth = 0;
    let maxDepth = 0;
    let depthHistory: number[] = new Array(sStr.length).fill(0);

    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            sStr, currentDepth, maxDepth, depthHistory: [...depthHistory], ...st 
        } 
    });

    add("Function Call", `public int maxDepth(String s="${sStr}")`, 2, {});
    
    add("Init Variables", `int currentDepth = 0;\nint maxDepth = 0;\nInitializing depth counters.`, 3, { hlInit: true });

    for (let i = 0; i < sStr.length; i++) {
        let c = sStr[i];
        add("Traverse String", `for (char c : s.toCharArray())\nReading character '${c}' at index ${i}.`, 6, { hlLoop: true, activeIdx: i, curChar: c });
        
        if (c === '(') {
            add("Found Open Bracket", `if (c == '(')\nWe found an opening parenthesis. We are going deeper.`, 7, { hlIfOpen: true, activeIdx: i, curChar: c });
            
            currentDepth++;
            depthHistory[i] = currentDepth;
            add("Increment Depth", `currentDepth++;\nDepth increases to ${currentDepth}.`, 8, { hlIncDepth: true, activeIdx: i, curChar: c });
            
            let oldMax = maxDepth;
            maxDepth = Math.max(maxDepth, currentDepth);
            let updated = maxDepth > oldMax;
            add("Update Max Depth", `maxDepth = Math.max(maxDepth, currentDepth);\n${updated ? `New max depth reached! Updating maxDepth to ${maxDepth}.` : `Current depth (${currentDepth}) does not exceed maxDepth (${maxDepth}).`}`, 9, { hlUpdateMax: true, activeIdx: i, curChar: c, updatedMax: updated });
            
        } else if (c === ')') {
            add("Found Close Bracket", `else if (c == ')')\nWe found a closing parenthesis. We are surfacing.`, 10, { hlIfClose: true, activeIdx: i, curChar: c });
            
            depthHistory[i] = currentDepth; // Save depth before decrementing for visual continuity
            currentDepth--;
            add("Decrement Depth", `currentDepth--;\nDepth decreases to ${currentDepth}.`, 11, { hlDecDepth: true, activeIdx: i, curChar: c });
        } else {
            depthHistory[i] = currentDepth; // Just carry over the depth for visual line
            add("Ignore Character", `Character '${c}' is not a parenthesis. It is ignored, depth remains ${currentDepth}.`, 6, { hlIgnore: true, activeIdx: i, curChar: c });
        }
    }

    add("Return Result", `return maxDepth;\nFinished scanning the string. The maximum nesting depth found is ${maxDepth}.`, 15, { isSuccess: true, finalAns: maxDepth });

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
      if (st.sStr === undefined) return null;

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.isSuccess ? 'border-emerald-400 ring-4 ring-emerald-100' : 'border-slate-200'} scale-105 z-40`}>
              
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10 font-mono w-full min-h-[80px]">
                  
                  {st.isSuccess ? (
                      <div className="flex flex-col items-center justify-center gap-2 font-mono w-full">
                          <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2"><Trophy size={16}/> Final Maximum Depth</div>
                          <div className={`flex items-center justify-center text-emerald-700 bg-emerald-100 border-emerald-400 font-mono font-black text-4xl px-10 py-4 rounded-2xl border-2 shadow-md w-full`}>
                              {st.finalAns}
                          </div>
                      </div>
                  ) : (
                      <>
                          {/* Current Char */}
                          <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-amber-500 mb-1 flex items-center gap-1"><Type size={12}/> Current Char</span>
                              <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlLoop || st.hlIfOpen || st.hlIfClose || st.hlIgnore ? 'bg-amber-100 border-amber-500 text-amber-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                                  {st.curChar !== undefined ? st.curChar : '-'}
                              </div>
                          </div>

                          <ArrowRight size={24} className="text-slate-300" />
                          
                          {/* Current Depth */}
                          <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-sky-500 mb-1 flex items-center gap-1"><ArrowDownUp size={12}/> Current Depth</span>
                              <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlIncDepth || st.hlDecDepth ? 'bg-sky-100 border-sky-500 text-sky-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                                  {st.currentDepth !== undefined ? st.currentDepth : '-'}
                              </div>
                          </div>

                          <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>

                          {/* Max Depth Tracker */}
                          <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><Maximize2 size={12}/> Max Depth</span>
                              <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlUpdateMax && st.updatedMax ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 scale-110 shadow-lg animate-in zoom-in' : 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800'}`}>
                                  {st.maxDepth !== undefined ? st.maxDepth : '-'}
                              </div>
                          </div>
                      </>
                  )}

              </div>
          </div>
      );
  };

  const renderVisuals = () => {
      if (st.sStr === undefined) return <span className="text-slate-400 italic">empty</span>;

      const nodeWidth = 40;
      const nodeGap = 6;
      const totalColWidth = nodeWidth + nodeGap;
      const containerWidth = st.sStr.length * totalColWidth;
      const startX = -(containerWidth / 2) + (totalColWidth / 2);
      
      const rowYInput = 80;

      // Colors mapping for depth visualization
      const depthColors = [
          'bg-slate-200',    // Depth 0 (shouldn't really render a block)
          'bg-sky-400',      // Depth 1
          'bg-emerald-400',  // Depth 2
          'bg-amber-400',    // Depth 3
          'bg-rose-400',     // Depth 4
          'bg-fuchsia-400',  // Depth 5
          'bg-indigo-400',   // Depth 6
          'bg-violet-400'    // Depth 7
      ];

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Middle: Logic Dashboard */}
              <div className="flex flex-col items-center w-full mt-2 pointer-events-auto z-50">
                  {renderActiveDashboard()}
              </div>

              {/* Bottom: The Arrays */}
              <div className="flex flex-col items-center justify-center relative w-full max-w-6xl mt-4">
                  
                  <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-start mt-8 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner overflow-hidden`} style={{ minHeight: '450px' }}>
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                      <div className="relative w-0 h-full overflow-visible flex justify-center mt-12 pb-16">
                          
                          {/* Input Array Elements */}
                          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-visible">
                              {st.sStr.split('').map((char: string, idx: number) => {
                                  let currentX = startX + (idx * totalColWidth);
                                  let isActive = st.activeIdx === idx && !st.isSuccess;
                                  let isProcessed = st.activeIdx !== undefined && idx < st.activeIdx;
                                  
                                  let isParen = char === '(' || char === ')';

                                  let bgClass = "bg-white border-slate-300 text-slate-700 shadow-sm"; 
                                  let scaleClass = "scale-100";

                                  if (isActive) {
                                      if (st.hlIfOpen || st.hlIncDepth || st.hlUpdateMax) {
                                          bgClass = "bg-emerald-100 border-emerald-500 text-emerald-900 shadow-xl ring-4 ring-emerald-200 z-30";
                                      } else if (st.hlIfClose || st.hlDecDepth) {
                                          bgClass = "bg-rose-100 border-rose-500 text-rose-900 shadow-xl ring-4 ring-rose-200 z-30";
                                      } else {
                                          bgClass = "bg-amber-100 border-amber-500 text-amber-900 shadow-xl ring-4 ring-amber-200 z-30";
                                      }
                                      scaleClass = "scale-125";
                                  } else if (isProcessed) {
                                      if (isParen) {
                                          bgClass = "bg-slate-100 border-slate-300 text-slate-500 opacity-80 shadow-sm";
                                      } else {
                                          bgClass = "bg-slate-50 border-slate-200 text-slate-300 opacity-40 border-dashed";
                                      }
                                  }

                                  if (st.isSuccess) {
                                       bgClass = isParen ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-300 opacity-40 border-dashed";
                                  }

                                  return (
                                      <div key={`input-${idx}`} className={`absolute flex flex-col items-center transition-all duration-500 ${scaleClass}`} style={{ left: `calc(50% + ${currentX}px)`, top: `${rowYInput}px`, transform: 'translate(-50%, -50%)' }}>
                                          
                                          {/* Element Box */}
                                          <div className={`w-[${nodeWidth}px] h-[${nodeWidth}px] flex items-center justify-center border-[2px] rounded-lg transition-all duration-300 ${bgClass}`}>
                                              <span className="font-mono font-black text-xl">{char}</span>
                                          </div>
                                          
                                          {/* Index & Pointer */}
                                          {isActive && (
                                              <div className="absolute -top-10 flex flex-col items-center animate-bounce z-50">
                                                  <span className="text-[9px] font-black uppercase text-amber-700 tracking-widest bg-amber-100 px-1 rounded border border-amber-300 shadow-sm mb-0.5">i</span>
                                                  <ArrowDown size={16} className="text-amber-500"/>
                                              </div>
                                          )}

                                          {/* Visual Depth Bar Chart for Processed/Active elements */}
                                          {(isProcessed || isActive || st.isSuccess) && st.depthHistory[idx] > 0 && (
                                              <div className="absolute top-[30px] flex flex-col gap-[2px] pointer-events-none mt-2 justify-start items-center h-[150px] w-full">
                                                  {Array.from({length: st.depthHistory[idx]}).map((_, dIdx) => {
                                                      // To make it look like a stack building downwards
                                                      let depthLevel = dIdx + 1; 
                                                      let color = depthColors[depthLevel % depthColors.length];
                                                      let isCurrentLevel = isActive && depthLevel === st.currentDepth;
                                                      
                                                      return (
                                                          <div key={`block-${idx}-${dIdx}`} className={`w-3/4 h-3 rounded-sm ${color} transition-all duration-300 ${isCurrentLevel ? 'ring-2 ring-offset-1 ring-amber-400 animate-pulse scale-110' : 'opacity-80'}`}></div>
                                                      )
                                                  })}
                                                  {/* Optional Depth Number Label at the bottom of the stack */}
                                                  <span className="text-[8px] font-black text-slate-400 mt-1">{st.depthHistory[idx]}</span>
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
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-600`}>
                <Brackets className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Maximum Nesting Depth of the Parentheses</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      String &amp; Depth Tracking
                  </span>
                  <span>•</span>
                  <span>LeetCode 1614</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Brackets size={28}/> Measuring Depth</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>A string is a <strong>valid parentheses string</strong> (denoted VPS) if it meets one of the following:</p>
                        <ul className="list-disc pl-6 space-y-1 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-fit">
                            <li>It is an empty string <code>""</code>, or a single character not equal to <code>"("</code> or <code>")"</code>.</li>
                            <li>It can be written as <code>AB</code> (<code>A</code> concatenated with <code>B</code>), where <code>A</code> and <code>B</code> are VPS's.</li>
                            <li>It can be written as <code>(A)</code>, where <code>A</code> is a VPS.</li>
                        </ul>
                        <p>We can similarly define the <strong>nesting depth</strong> <code>depth(S)</code> of any VPS <code>S</code> as follows:</p>
                        <ul className="list-disc pl-6 space-y-1 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-fit">
                            <li><code>depth("") = 0</code></li>
                            <li><code>depth(C) = 0</code>, where <code>C</code> is a string with a single character not equal to <code>"("</code> or <code>")"</code>.</li>
                            <li><code>depth(A + B) = max(depth(A), depth(B))</code>, where <code>A</code> and <code>B</code> are VPS's.</li>
                            <li><code>depth("(" + A + ")") = 1 + depth(A)</code>, where <code>A</code> is a VPS.</li>
                        </ul>
                        <p className="font-bold mt-4">Given a VPS represented as string <code>s</code>, return the nesting depth of <code>s</code>.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> s = "(1+(2*3)+((8)/4))+1"</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">3</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">Digit 8 is inside of 3 nested parentheses in the string.</span>
                    </div>

                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre mt-4`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> s = "(1)+((2))+(((3)))"</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">3</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &lt;= s.length &lt;= 100</li>
                            <li>s consists of digits 0-9 and characters '+', '-', '*', '/', '(', and ')'.</li>
                            <li>It is guaranteed that parentheses expression s is a VPS.</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><LayersIcon size={16} className="text-sky-500"/> No Stack Needed</h4>
                        <p className="text-sm leading-relaxed">Usually, parentheses problems require a Stack. But because the string is guaranteed to be valid, and we only care about the <em>depth</em>, we can replace the heavy Stack data structure with a simple integer counter!</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The O(N) Scan</h4>
                        <p className="text-sm leading-relaxed text-slate-600">We iterate exactly once. `(` increases the depth by 1. `)` decreases the depth by 1. We keep a running tally of the maximum depth ever reached during this traversal. All other characters are completely ignored.</p>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Valid Parentheses String (Max 24 chars)</label>
                            <input type="text" value={sInput} onChange={(e) => setSInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold tracking-[0.1em]`} placeholder="(1+(2*3)+((8)/4))+1" />
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
                                <PartyPopper size={24}/> SCAN COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Successfully found the maximum depth.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlIncDepth || st.hlUpdateMax ? 'text-emerald-400' : (st.hlDecDepth ? 'text-rose-400' : (st.hlIgnore ? 'text-amber-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                            
                            {/* Persistent State Monitor */}
                            {st.sStr !== undefined && !st.isSuccess && (
                                <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap gap-2">
                                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">cur Depth</span>
                                        <span className="font-mono font-black text-sky-400">{st.currentDepth !== undefined ? st.currentDepth : '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">max Depth</span>
                                        <span className="font-mono font-black text-fuchsia-400">{st.maxDepth !== undefined ? st.maxDepth : '-'}</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[440px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Layers size={14} className={`text-${themeColor}-500`}/> Depth Tracker Visualizer</span>
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
                    <div className="inline-flex items-center justify-center p-4 bg-indigo-100 text-indigo-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Why we don't need a Stack.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><LayersIcon size={24} className="text-indigo-500"/> 1. The Integer Stack Trick</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Usually, parenthesis matching problems require a Stack to push opening brackets and pop them when matching closing brackets are found. However, because we are <strong>guaranteed</strong> that the input string is perfectly valid and only contains one type of bracket `()`, we don't actually need to store the brackets in memory!</p>
                        <p className="text-slate-600 leading-relaxed">The size of the stack is completely predictable. We can replace the entire Stack data structure with a single integer `currentDepth` that just counts how many brackets are currently "open".</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-sky-500"/> 2. Tracking the High-Water Mark</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">As we read through the string:</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
                            <li>An opening bracket `(` means we go deeper: `currentDepth++`.</li>
                            <li>A closing bracket `)` means we surface: `currentDepth--`.</li>
                            <li>Any other character is just content at the current depth and is ignored.</li>
                        </ul>
                        <p className="text-slate-600 leading-relaxed">To find the maximum nesting depth, we just need to record the highest value `currentDepth` ever reaches. We update `maxDepth = Math.max(maxDepth, currentDepth)` every time we go deeper.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Zap size={24} className="text-emerald-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N).</strong> We traverse the string exactly once. The operations inside the loop (incrementing, decrementing, and Math.max) are all strict O(1) constant time operations.</li>
                            <li><strong>Space Complexity: O(1).</strong> We only allocate memory for two integer variables (`currentDepth` and `maxDepth`). We do not use any auxiliary arrays or stacks, resulting in minimal constant space overhead.</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-indigo-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is an 'Easy' problem, often used as a warm-up. Interviewers expect you to solve this quickly without using a Stack. The key is clearly explaining *why* a Stack isn't needed here."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-indigo-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-indigo-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "When WOULD you need to use a Stack for parentheses?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "You need a Stack when there are multiple types of brackets (e.g., `()`, `[]`, `{}`) and you need to verify their structural validity."</p>
                            <p>For example, in the classic 'Valid Parentheses' problem, a string like `([)]` is invalid because the closing brackets are in the wrong order. A simple integer counter cannot detect this mismatch. A Stack is required to ensure that the most recently opened bracket is the first one closed."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "Can you optimize the code further?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It's already O(N) Time and O(1) Space, which is optimal. But we can write it slightly more concisely."</p>
                            <p className="font-mono bg-slate-100 p-3 rounded text-sm text-slate-800">
                                if (c == '(') maxDepth = Math.max(maxDepth, ++currentDepth);<br/>
                                else if (c == ')') currentDepth--;
                            </p>
                            <p>Using the pre-increment operator `++` collapses two lines into one. Additionally, instead of using `s.toCharArray()`, using `s.charAt(i)` in a standard for-loop avoids creating a new character array in memory, saving a small amount of space overhead."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "What if the string was NOT guaranteed to be a valid parentheses string (VPS)?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "We would need to add error checking."</p>
                            <p>If we encountered a `)` when `currentDepth` was already `0`, the string would be invalid (a closing bracket without a prior opening bracket). Similarly, if `currentDepth` was not exactly `0` at the very end of the string, it would mean there were unclosed opening brackets left over. We could easily add these two checks to our O(1) logic to validate the string while simultaneously finding the max depth."</p>
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
                              <ArrowDownUp size={20}/>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlIncDepth || st.hlUpdateMax ? 'text-emerald-400' : (st.hlDecDepth ? 'text-rose-400' : (st.hlIgnore ? 'text-amber-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        
                        {/* Persistent State Monitor for Fullscreen */}
                        {st.sStr !== undefined && !st.isSuccess && (
                            <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap gap-2">
                                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">cur Depth</span>
                                    <span className="font-mono font-black text-sky-400">{st.currentDepth !== undefined ? st.currentDepth : '-'}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">max Depth</span>
                                    <span className="font-mono font-black text-fuchsia-400">{st.maxDepth !== undefined ? st.maxDepth : '-'}</span>
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
                                  {op.icon} <span>{op.title.split('.')[1].trim()}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="flex-[3] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Valid Parentheses String (Max 24 chars)</label>
                              <input type="text" value={sInput} onChange={(e) => setSInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner font-bold tracking-[0.1em]`} placeholder="(1+(2*3)+((8)/4))+1" />
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">SCAN COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Successfully found the maximum depth</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Final Maximum Depth</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center gap-2 break-all">{st.finalAns}</div>
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