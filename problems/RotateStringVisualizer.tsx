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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, Divide, Ship, Package, Calendar, Anchor, Waves, Weight, SearchCode, Minus, Type, RefreshCw
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  stringConcatenation: {
    id: 'stringConcatenation',
    title: '1. String Concatenation Trick',
    icon: <RefreshCw size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    theme: 'fuchsia',
    code: `class Solution {
    public boolean rotateString(String s, String goal) {
        if (s.length() != goal.length()) {
            return false;
        }
        
        String doubled = s + s;
        return doubled.contains(goal);
    }
}`,
    desc: "The Optimal Approach: The Concatenation Trick. If we take string 's' and concatenate it with itself to form 's + s', the resulting string will inherently contain EVERY possible valid rotation of 's' as a contiguous substring! For example, if s = 'abcde', then 'abcdeabcde' contains 'abcde', 'bcdea', 'cdeab', 'deabc', and 'eabcd'. Therefore, we only need to check if the lengths match, and then check if 'goal' is a substring of 's + s'. This elegantly solves the problem in O(N) time without manual index shifting!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|new|String|rotateString|s|goal|length|doubled|contains)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'double', 'boolean', 'class', 'return', 'if', 'else', 'new', 'for'].includes(part);
            const isObject = ['String'].includes(part);
            const isPointer = ['s', 'goal', 'doubled'].includes(part);
            const isMapCall = ['rotateString', 'length', 'contains'].includes(part);
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

export default function RotateStringVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('stringConcatenation');
  
  const [sInput, setSInput] = useState('abcde');
  const [goalInput, setGoalInput] = useState('cdeab');
  
  const [baseS, setBaseS] = useState<string>('abcde');
  const [baseGoal, setBaseGoal] = useState<string>('cdeab');

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
      let parsedS = sInput.trim().replace(/[^a-zA-Z0-9]/g, '');
      let parsedGoal = goalInput.trim().replace(/[^a-zA-Z0-9]/g, '');
      
      if (parsedS.length === 0) parsedS = "abcde";
      if (parsedS.length > 10) parsedS = parsedS.slice(0, 10); // UI bounds limitation

      if (parsedGoal.length === 0) parsedGoal = "cdeab";
      if (parsedGoal.length > 10) parsedGoal = parsedGoal.slice(0, 10);

      setBaseS(parsedS);
      setBaseGoal(parsedGoal);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [sInput, goalInput, selectedOpId]);

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
    const gStr = baseGoal;

    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            sStr, gStr, ...st 
        } 
    });

    add("Function Call", `public boolean rotateString(String s="${sStr}", String goal="${gStr}")`, 2, {});

    add("Check Lengths", `if (s.length() != goal.length())\nChecking if lengths match: ${sStr.length} vs ${gStr.length}.`, 3, { hlLengthCheck: true });

    if (sStr.length !== gStr.length) {
        add("Length Mismatch", `return false;\nLengths differ (${sStr.length} != ${gStr.length}), so 's' can never be rotated into 'goal'.`, 4, { hlReturnFalseFast: true, isSuccess: true, finalAns: false });
        return steps;
    }

    let doubled = sStr + sStr;
    add("Concatenate String", `String doubled = s + s;\nCreating doubled string "${doubled}" to contain all possible rotations contiguous within it.`, 7, { hlConcat: true, doubled });

    add("Search Substring", `return doubled.contains(goal);\nInitiating substring search for "${gStr}" inside "${doubled}".`, 8, { hlContains: true, doubled });

    let found = false;
    let matchIdx = -1;

    // Simulate the internal behavior of .contains() sliding window
    for (let i = 0; i < sStr.length; i++) {
        let windowStr = doubled.substring(i, i + gStr.length);
        let isMatch = windowStr === gStr;

        add("Sliding Window Check", `Comparing internal window at shift ${i}: "${windowStr}" vs "${gStr}".`, 8, { hlContainsSearch: true, doubled, windowIdx: i, windowStr, isMatch });

        if (isMatch) {
            found = true;
            matchIdx = i;
            add("Match Found", `Found exact match at shift ${i}! Therefore, 'goal' is a valid rotation of 's'.`, 8, { hlContainsMatch: true, doubled, windowIdx: i, isMatch: true });
            break;
        }
    }

    if (found) {
        add("Return True", `Return true since the goal string was found within the doubled string.`, 8, { isSuccess: true, finalAns: true, matchIdx, doubled });
    } else {
        add("Return False", `Checked all possible rotation windows. None matched the goal string. Return false.`, 8, { isSuccess: true, finalAns: false, doubled });
    }

    return steps;
  }, [baseS, baseGoal, selectedOpId]);

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
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlContainsSearch ? (st.isMatch ? 'border-emerald-400 ring-4 ring-emerald-100' : 'border-rose-400 ring-4 ring-rose-100') : 'border-slate-200'} scale-105 z-40`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><SearchCode size={14}/> Active State Evaluation</span>
              
              {st.hlLengthCheck || st.hlReturnFalseFast ? (
                  <div className="flex flex-col items-center justify-center gap-2 font-mono min-h-[80px] w-full">
                      <div className="flex gap-10 items-center w-full justify-center">
                          <div className="flex flex-col items-center">
                              <span className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-1">s.length()</span>
                              <div className={`flex items-center justify-center text-sky-800 bg-sky-50 border-sky-300 font-mono font-black text-3xl px-6 py-2 rounded-xl border-2 shadow-sm`}>
                                  {st.sStr.length}
                              </div>
                          </div>
                          <span className="text-3xl font-black text-slate-300">vs</span>
                          <div className="flex flex-col items-center">
                              <span className="text-xs font-bold text-fuchsia-500 uppercase tracking-widest mb-1">goal.length()</span>
                              <div className={`flex items-center justify-center text-fuchsia-800 bg-fuchsia-50 border-fuchsia-300 font-mono font-black text-3xl px-6 py-2 rounded-xl border-2 shadow-sm`}>
                                  {st.gStr.length}
                              </div>
                          </div>
                      </div>
                      {st.hlReturnFalseFast && (
                          <div className="mt-4 text-sm font-black text-rose-600 bg-rose-50 border border-rose-300 px-4 py-1.5 rounded uppercase tracking-widest animate-in zoom-in">Lengths Differ - Impossible to Rotate</div>
                      )}
                  </div>
              ) : st.windowIdx !== undefined ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10 font-mono w-full min-h-[80px]">
                      
                      {/* Window Substring */}
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1 flex items-center gap-1">Window Substring</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-slate-50 border-slate-300 text-slate-700 shadow-md`}>
                              "{st.windowStr}"
                          </div>
                      </div>

                      <ArrowRight size={24} className="text-slate-300" />
                      
                      {/* Goal String */}
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1">Target Goal</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-fuchsia-50 border-fuchsia-300 text-fuchsia-800 shadow-md`}>
                              "{st.gStr}"
                          </div>
                      </div>

                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>

                      {/* Match Status */}
                      <div className="flex flex-col items-center min-w-[150px]">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Status</span>
                          <div className="flex flex-col items-center gap-2 w-full">
                              {st.hlContainsSearch || st.hlContainsMatch ? (
                                  <span className={`text-lg font-black uppercase px-3 py-2 w-full text-center rounded shadow-sm transition-all duration-300 ${st.isMatch ? 'text-emerald-700 bg-emerald-100 border border-emerald-300 animate-in zoom-in' : 'text-rose-700 bg-rose-100 border border-rose-300'}`}>
                                      {st.isMatch ? 'MATCH' : 'MISMATCH'}
                                  </span>
                              ) : (
                                  <span className={`text-sm font-black uppercase px-3 py-2 w-full text-center rounded text-slate-500 bg-slate-100 border border-slate-300`}>
                                      Checking...
                                  </span>
                              )}
                          </div>
                      </div>

                  </div>
              ) : (
                  <span className="text-slate-400 italic text-sm py-4">Initializing String Concatenation...</span>
              )}

          </div>
      );
  };

  const renderVisuals = () => {
      if (st.sStr === undefined) return <span className="text-slate-400 italic">empty</span>;

      const nodeWidth = 44;
      const nodeGap = 4;
      const totalColWidth = nodeWidth + nodeGap;
      
      // We render based on doubled length if it exists, otherwise sStr.length
      const renderStr = st.doubled ? st.doubled : st.sStr;
      const containerWidth = renderStr.length * totalColWidth;
      const startX = -(containerWidth / 2) + (totalColWidth / 2);
      
      const rowYGoal = 100;
      const rowYDoubled = 220;

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Middle: Logic Dashboard */}
              <div className="flex flex-col items-center w-full mt-2 pointer-events-auto z-50">
                  {renderActiveDashboard()}
              </div>

              {/* Bottom: The Arrays */}
              <div className="flex flex-col items-center justify-center relative w-full max-w-6xl mt-4">
                  
                  <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-start mt-8 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner overflow-hidden`} style={{ minHeight: '380px' }}>
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                      {st.hlLengthCheck || st.hlReturnFalseFast ? (
                          <div className="relative w-full h-full flex flex-col items-center justify-center z-10 font-mono text-slate-400 italic mt-20">
                              Displaying initial strings before generating doubled search space.
                              
                              {/* Simple render of s and goal */}
                              <div className="flex gap-16 mt-8">
                                  <div className="flex gap-1">
                                      <span className="absolute -translate-y-8 font-black text-sky-500 text-xs">s</span>
                                      {st.sStr.split('').map((c, i) => (
                                          <div key={`s-${i}`} className="w-10 h-10 bg-white border-2 border-slate-300 rounded flex items-center justify-center font-black text-lg text-slate-700 shadow-sm">{c}</div>
                                      ))}
                                  </div>
                                  <div className="flex gap-1">
                                      <span className="absolute -translate-y-8 font-black text-fuchsia-500 text-xs">goal</span>
                                      {st.gStr.split('').map((c, i) => (
                                          <div key={`g-${i}`} className="w-10 h-10 bg-white border-2 border-slate-300 rounded flex items-center justify-center font-black text-lg text-slate-700 shadow-sm">{c}</div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      ) : (
                          <div className="relative w-0 h-full overflow-visible flex justify-center mt-12 pb-16">
                              
                              {/* Dynamic Goal String (Sliding Window) */}
                              {st.windowIdx !== undefined && (
                                  <div className="absolute top-0 w-full h-full pointer-events-none z-30 transition-all duration-700 ease-in-out" 
                                       style={{ transform: `translateX(${st.windowIdx * totalColWidth}px)` }}>
                                      
                                      {st.gStr.split('').map((char: string, idx: number) => {
                                          let currentX = startX + (idx * totalColWidth);
                                          
                                          // Check char match
                                          let isCharMatch = char === st.doubled[st.windowIdx + idx];
                                          let bgClass = "bg-fuchsia-50 border-fuchsia-400 text-fuchsia-900 shadow-lg";

                                          if (st.hlContainsSearch || st.hlContainsMatch || st.isSuccess) {
                                              bgClass = isCharMatch ? "bg-emerald-100 border-emerald-500 text-emerald-900 shadow-lg scale-105" : "bg-rose-100 border-rose-500 text-rose-900 shadow-lg scale-95";
                                          }
                                          if (st.isSuccess && !st.finalAns) {
                                              bgClass = "bg-slate-100 border-slate-300 text-slate-400 opacity-50";
                                          }

                                          return (
                                              <div key={`goal-${idx}`} className="absolute flex flex-col items-center" style={{ left: `calc(50% + ${currentX}px)`, top: `${rowYGoal}px`, transform: 'translate(-50%, -50%)' }}>
                                                  <div className={`w-[${nodeWidth}px] h-[${nodeWidth}px] flex flex-col items-center justify-center border-[3px] rounded-lg transition-all duration-300 ${bgClass}`}>
                                                      <span className="font-mono font-black text-2xl">{char}</span>
                                                  </div>
                                                  {/* Goal index label */}
                                                  <span className="absolute -top-6 text-[9px] font-mono text-fuchsia-400 font-bold bg-fuchsia-50 px-1 rounded">g:{idx}</span>

                                                  {/* Connecting Line to Doubled String */}
                                                  {(st.hlContainsSearch || st.hlContainsMatch) && (
                                                      <div className={`absolute top-[40px] w-1 h-[60px] ${isCharMatch ? 'bg-emerald-400' : 'bg-rose-400'} opacity-60 z-0`}></div>
                                                  )}
                                              </div>
                                          );
                                      })}
                                      
                                      {/* Window Bracket Label */}
                                      <div className="absolute border-t-2 border-x-2 border-fuchsia-300 rounded-t-xl z-10 transition-all duration-500 opacity-60" 
                                           style={{ 
                                               left: startX - nodeWidth/2 - 4 + 50, // 50% offset from calc
                                               width: st.gStr.length * totalColWidth - nodeGap + 8,
                                               top: rowYGoal - 35,
                                               height: 15,
                                               transform: 'translateX(-50%)'
                                           }}
                                      >
                                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-fuchsia-600 uppercase tracking-widest whitespace-nowrap bg-fuchsia-50 px-2 py-0.5 rounded border border-fuchsia-200">goal</span>
                                      </div>
                                  </div>
                              )}

                              {/* Doubled Array Elements */}
                              <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-visible">
                                  {renderStr.split('').map((char: string, idx: number) => {
                                      let currentX = startX + (idx * totalColWidth);
                                      
                                      let isWithinWindow = st.windowIdx !== undefined && idx >= st.windowIdx && idx < st.windowIdx + st.gStr.length;
                                      
                                      let bgClass = "bg-white border-slate-300 text-slate-600 shadow-sm"; 
                                      let scaleClass = "scale-100";

                                      if (isWithinWindow) {
                                          let isCharMatch = char === st.gStr[idx - st.windowIdx];
                                          if (st.hlContainsSearch || st.hlContainsMatch || st.isSuccess) {
                                              bgClass = isCharMatch ? "bg-emerald-50 border-emerald-400 text-emerald-900 shadow-md" : "bg-rose-50 border-rose-400 text-rose-900 shadow-md";
                                          } else {
                                              bgClass = "bg-amber-50 border-amber-300 text-amber-800 shadow-md";
                                          }
                                      } else if (st.windowIdx !== undefined) {
                                          bgClass = "bg-slate-100 border-slate-200 text-slate-400 opacity-40 border-dashed";
                                          scaleClass = "scale-95";
                                      }
                                      
                                      if (st.isSuccess && !st.finalAns) {
                                          bgClass = "bg-slate-100 border-slate-200 text-slate-400 opacity-40 border-dashed";
                                      }

                                      // Differentiate the original 's' vs the appended 's' visually
                                      let isSecondHalf = idx >= st.sStr.length;

                                      return (
                                          <div key={`input-${idx}`} className={`absolute flex flex-col items-center transition-all duration-500 ${scaleClass}`} style={{ left: `calc(50% + ${currentX}px)`, top: `${rowYDoubled}px`, transform: 'translate(-50%, -50%)' }}>
                                              
                                              {/* Element Box */}
                                              <div className={`w-[${nodeWidth}px] h-[${nodeWidth}px] flex items-center justify-center border-[3px] rounded-lg transition-all duration-300 ${bgClass} ${isSecondHalf ? 'border-dashed' : ''}`}>
                                                  <span className="font-mono font-black text-2xl">{char}</span>
                                              </div>
                                              
                                              {/* Index & Pointer */}
                                              <span className="text-[10px] font-mono text-slate-400 mt-2 absolute top-full">idx:{idx}</span>
                                          </div>
                                      )
                                  })}

                                  {/* Label for 's' vs 's+s' */}
                                  <div className="absolute border-b-4 border-l-4 border-slate-300 rounded-bl-xl z-10 transition-all duration-500 opacity-60" 
                                       style={{ 
                                           left: startX - nodeWidth/2 - 4,
                                           width: st.sStr.length * totalColWidth - nodeGap + 8,
                                           top: rowYDoubled + 30,
                                           height: 15
                                       }}
                                  >
                                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap bg-slate-100 px-2 py-0.5 rounded border border-slate-300">Original 's'</span>
                                  </div>
                                  
                                  {st.doubled && (
                                      <div className="absolute border-b-4 border-r-4 border-slate-300 rounded-br-xl z-10 transition-all duration-500 opacity-60 border-dashed" 
                                           style={{ 
                                               left: startX + st.sStr.length * totalColWidth - nodeWidth/2 - 4,
                                               width: st.sStr.length * totalColWidth - nodeGap + 8,
                                               top: rowYDoubled + 30,
                                               height: 15
                                           }}
                                      >
                                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap bg-slate-100 px-2 py-0.5 rounded border border-slate-300 border-dashed">Appended 's'</span>
                                      </div>
                                  )}
                              </div>
                          </div>
                      )}
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
                <RefreshCw className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Rotate String</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      String Matching
                  </span>
                  <span>•</span>
                  <span>LeetCode 796</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><RefreshCw size={28}/> Shifting Characters</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given two strings <code>s</code> and <code>goal</code>, return <code>true</code> if and only if <code>s</code> can become <code>goal</code> after some number of <strong>shifts</strong> on <code>s</code>.</p>
                        <p>A <strong>shift</strong> on <code>s</code> consists of moving the leftmost character of <code>s</code> to the rightmost position.</p>
                        <p className="text-sm text-slate-500 italic mt-2">For example, if <code>s = "abcde"</code>, then it will be <code>"bcdea"</code> after one shift.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> s = "abcde", goal = "cdeab"</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">true</span>
                    </div>

                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre mt-4`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> s = "abcde", goal = "abced"</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">false</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &lt;= s.length, goal.length &lt;= 100</li>
                            <li>s and goal consist of lowercase English letters.</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Scissors size={16} className="text-sky-500"/> Simulation vs Logic</h4>
                        <p className="text-sm leading-relaxed">You could simulate this by physically removing the first character and appending it to the end, checking against `goal` each time. This takes $O(N^2)$ time because comparing two strings of length $N$ takes $O(N)$ time, and we do it $N$ times. We can do better!</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Concatenation Trick</h4>
                        <p className="text-sm leading-relaxed text-slate-600">If we append `s` to itself to form `s + s`, this new string will magically contain <strong>all possible rotations</strong> of `s`! For instance, if `s = "abc"`, `s + s = "abcabc"`. The substrings of length 3 are "abc", "bca", and "cab"—exactly the rotations! We just check if `goal` is inside `s + s`.</p>
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
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Original String (s)</label>
                            <input type="text" value={sInput} onChange={(e) => setSInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold tracking-[0.2em]`} placeholder="abcde" />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Target String (goal)</label>
                            <input type="text" value={goalInput} onChange={(e) => setGoalInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold tracking-[0.2em]`} placeholder="cdeab" />
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

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? (st.finalAns === false ? 'bg-rose-900 border-rose-800' : 'bg-emerald-900 border-emerald-800') : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 ${st.finalAns === false ? 'text-rose-400' : 'text-emerald-400'}`}>
                                {st.finalAns === false ? <XCircle size={24}/> : <PartyPopper size={24}/>} 
                                {st.finalAns === false ? "NOT A ROTATION" : "ROTATION FOUND"}
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                {st.finalAns === false ? "Goal string cannot be formed by rotating 's'." : `Goal is a valid rotation (found at shift ${st.matchIdx}).`}
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlLengthCheck ? 'text-sky-400' : (st.hlContainsSearch ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                            
                            {/* Persistent State Monitor */}
                            {st.sStr !== undefined && !st.isSuccess && (
                                <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap gap-2">
                                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">s.length</span>
                                        <span className="font-mono font-black text-sky-400">{st.sStr !== undefined ? st.sStr.length : '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">goal.length</span>
                                        <span className="font-mono font-black text-fuchsia-400">{st.gStr !== undefined ? st.gStr.length : '-'}</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[380px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Layers size={14} className={`text-${themeColor}-500`}/> Substring Verification Render</span>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding the string concatenation property.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><LayersIcon size={24} className="text-fuchsia-500"/> 1. The Doubling Trick</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">A rotation simply takes the first character and puts it at the back. If you do this $N$ times, you return to the original string. When you concatenate a string with itself (<code>s + s</code>), you create a sequence that naturally "loops" around the original string.</p>
                        <p className="text-slate-600 leading-relaxed">If <code>s = "abcd"</code>, then <code>s+s = "abcdabcd"</code>. Look closely at the substrings of length 4 within it: "abcd", "bcda", "cdab", "dabc". Those are all the exact valid rotations! Thus, <code>goal</code> must be a substring of <code>s + s</code>.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Scissors size={24} className="text-sky-500"/> 2. The Length Check</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Wait, isn't checking <code>(s + s).contains(goal)</code> enough? <strong>No!</strong></p>
                        <p className="text-slate-600 leading-relaxed">If <code>s = "abc"</code> and <code>goal = "ab"</code>, then <code>s + s = "abcabc"</code>, which DOES contain "ab". But "ab" is clearly not a rotation of "abc" because they have different lengths. You <strong>must</strong> verify <code>s.length() == goal.length()</code> first before applying the trick.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N).</strong> We create a new string of length $2N$, which takes $O(N)$ time. The built-in <code>.contains()</code> method searches for a substring. In Java, this can technically be up to $O(N^2)$ in the worst case (using naive matching), but is highly optimized and virtually $O(N)$ on average. If strictly enforced, KMP algorithm guarantees $O(N)$.</li>
                            <li><strong>Space Complexity: O(N).</strong> We must allocate memory for the <code>doubled</code> string, taking $O(N)$ space.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a classic 'trick' problem. If you know the trick, it's one line of code. Interviewers use it to see if you remember common string manipulation paradigms."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-fuchsia-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-fuchsia-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Can you solve this in O(1) space?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, by manually simulating the shift without concatenating."</p>
                            <p>Instead of creating <code>s + s</code>, we can loop over all possible starting indices <code>i</code> in <code>s</code>. Inside that loop, we use another loop over <code>j</code> from 0 to length-1, checking if <code>s[(i + j) % s.length] == goal[j]</code>. If they all match, we return true. This takes $O(N^2)$ time but uses strictly $O(1)$ auxiliary space."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "Are you sure `.contains()` is $O(N)$?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "In most languages, it's practically $O(N)$, but theoretically worst-case $O(N \times M)$."</p>
                            <p>For example, in Java, <code>String.contains</code> uses a naive search algorithm that can degrade to $O(N \times M)$ on highly repetitive strings (e.g., searching "aaaaab" in "aaaaaaaaab"). To guarantee absolute $O(N)$ time complexity regardless of the input, we would have to implement the KMP (Knuth-Morris-Pratt) algorithm ourselves.</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "What if both strings are empty?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The current code handles it safely."</p>
                            <p>If <code>s = ""</code> and <code>goal = ""</code>, lengths match (0 == 0). <code>doubled</code> becomes <code>"" + "" = ""</code>. And checking <code>"".contains("")</code> evaluates to <code>true</code> in Java, which is mathematically correct (an empty string is a valid 0-shift rotation of another empty string). However, LeetCode constraints guarantee lengths $\ge$ 1, so this edge case won't occur.</p>
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
                              <RefreshCw size={20}/>
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
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? (st.finalAns === false ? 'bg-rose-900/40 border-rose-800' : 'bg-emerald-900/40 border-emerald-800') : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlLengthCheck ? 'text-sky-400' : (st.hlContainsSearch ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        
                        {/* Persistent State Monitor for Fullscreen */}
                        {st.sStr !== undefined && !st.isSuccess && (
                            <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap gap-2">
                                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">s.length</span>
                                    <span className="font-mono font-black text-sky-400">{st.sStr !== undefined ? st.sStr.length : '-'}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">goal.length</span>
                                    <span className="font-mono font-black text-fuchsia-400">{st.gStr !== undefined ? st.gStr.length : '-'}</span>
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
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Original String (s)</label>
                              <input type="text" value={sInput} onChange={(e) => setSInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold tracking-[0.2em]`} placeholder="abcde" />
                          </div>
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Target String (goal)</label>
                              <input type="text" value={goalInput} onChange={(e) => setGoalInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold tracking-[0.2em]`} placeholder="cdeab" />
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
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.finalAns === false ? 'border-rose-500 shadow-[0_0_150px_rgba(244,63,94,0.3)]' : 'border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.finalAns === false ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                                
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ${st.finalAns === false ? 'bg-rose-500/20 text-rose-500 ring-rose-500/10' : 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10'}`}>
                                    {st.finalAns === false ? <XCircle size={48}/> : <PartyPopper size={48}/>}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">{st.finalAns === false ? "NOT A ROTATION" : "ROTATION FOUND"}</h2>
                                <p className={`font-mono text-xs uppercase mb-8 tracking-widest opacity-60 ${st.finalAns === false ? 'text-rose-400' : 'text-emerald-400'}`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${st.finalAns === false ? 'text-rose-500' : 'text-emerald-500'}`}>{st.finalAns === false ? "Mismatch" : "Match Shift"}</div>
                                    <div className="font-mono text-white text-3xl font-black leading-relaxed flex items-center gap-2 break-all">{st.finalAns === false ? <span className="text-slate-400 italic font-normal text-lg">No match found</span> : `Shift Index ${st.matchIdx}`}</div>
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