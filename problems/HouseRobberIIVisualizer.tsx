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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, Divide, Ship, Package, Calendar, Anchor, Waves, Weight, SearchCode, Minus, Type, RefreshCw, BarChart, Home
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  circularDP: {
    id: 'circularDP',
    title: '1. Two-Pass DP (Circular Restraint)',
    icon: <Home size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    theme: 'emerald',
    code: `class Solution {
    public int rob(int[] nums) {
        if (nums.length == 1) return nums[0];
        
        int max1 = robHelper(nums, 0, nums.length - 2);
        int max2 = robHelper(nums, 1, nums.length - 1);
        
        return Math.max(max1, max2);
    }

    private int robHelper(int[] nums, int start, int end) {
        int rob1 = 0, rob2 = 0;
        for (int i = start; i <= end; i++) {
            int temp = Math.max(rob1 + nums[i], rob2);
            rob1 = rob2;
            rob2 = temp;
        }
        return rob2;
    }
}`,
    desc: "The Optimal Approach: The houses are arranged in a circle, meaning the first house and the last house are neighbors. Thus, we cannot rob BOTH the first and the last house. This breaks the problem into two simple sub-problems: 1) Find the max loot robbing from house 0 to n-2 (skipping the last house). 2) Find the max loot robbing from house 1 to n-1 (skipping the first house). The overall maximum loot is simply the maximum of these two linear scenarios. Each linear scenario is solved in O(N) time and O(1) space using standard House Robber dynamic programming tracking the best loot up to 2 houses back (rob1) and 1 house back (rob2)."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|new|for|while|String|rob|nums|length|max1|max2|robHelper|Math|max|start|end|rob1|rob2|temp)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isPointer = ['nums', 'max1', 'max2', 'start', 'end', 'rob1', 'rob2', 'temp'].includes(part);
            const isMapCall = ['rob', 'length', 'robHelper', 'max'].includes(part);
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

export default function HouseRobberIIVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('circularDP');
  
  const [numsInput, setNumsInput] = useState('2, 3, 2');
  const [baseNums, setBaseNums] = useState<number[]>([2, 3, 2]);

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
      let parsed = numsInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n >= 0);
      if (parsed.length === 0) parsed = [2, 3, 2];
      if (parsed.length > 15) parsed = parsed.slice(0, 15); // UI bounds limitation

      setBaseNums(parsed);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [numsInput, selectedOpId]);

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
    const nums = [...baseNums];
    const n = nums.length;

    let max1 = 0;
    let max2 = 0;
    let rob1 = 0;
    let rob2 = 0;
    let temp = 0;

    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            nums, n, max1, max2, rob1, rob2, temp, ...st 
        } 
    });

    add("Function Call", `public int rob(int[] nums)`, 2, { hlPhase: 'init' });
    add("Base Case Check", `if (nums.length == 1) return nums[0];\nChecking if there is only one house.`, 3, { hlPhase: 'baseCheck' });

    if (n === 1) {
        add("Return Base Case", `Only 1 house. Rob it. Max loot: ${nums[0]}.`, 3, { isSuccess: true, finalAns: nums[0] });
        return steps;
    }

    // Pass 1: 0 to n - 2
    add("Setup Pass 1", `int max1 = robHelper(nums, 0, nums.length - 2);\nInitiating Pass 1: Evaluate skipping the LAST house.`, 5, { hlPhase: 'setupPass1', passMode: 1 });
    
    add("Helper Init (Pass 1)", `private int robHelper(int[] nums, int start=0, int end=${n-2})`, 10, { hlPhase: 'helperInit', passMode: 1 });
    
    rob1 = 0;
    rob2 = 0;
    add("Init DP Trackers (Pass 1)", `int rob1 = 0, rob2 = 0;\nrob1 tracks max loot 2 steps back. rob2 tracks max loot 1 step back.`, 11, { hlPhase: 'helperVars', passMode: 1, start: 0, end: n - 2, rob1, rob2 });

    for (let i = 0; i <= n - 2; i++) {
        add("Loop Step (Pass 1)", `for (int i = start; i <= end; i++)\nArrived at House ${i} containing $${nums[i]}.`, 12, { hlPhase: 'loop', passMode: 1, start: 0, end: n - 2, activeIdx: i, rob1, rob2 });
        
        let robCurrent = rob1 + nums[i];
        let skipCurrent = rob2;
        temp = Math.max(robCurrent, skipCurrent);
        
        add("Calculate Max (Pass 1)", `int temp = Math.max(rob1 + nums[i], rob2);\nMax loot if we rob this house: (rob1: $${rob1} + house: $${nums[i]}) = $${robCurrent}\nMax loot if we skip it: (rob2) = $${skipCurrent}\nBest choice yields temp = $${temp}.`, 13, { hlPhase: 'calcTemp', passMode: 1, start: 0, end: n - 2, activeIdx: i, rob1, rob2, temp, robCurrent, skipCurrent });
        
        rob1 = rob2;
        add("Update rob1 (Pass 1)", `rob1 = rob2;\nShifting variables forward. rob1 becomes $${rob1}.`, 14, { hlPhase: 'updateRob1', passMode: 1, start: 0, end: n - 2, activeIdx: i, rob1, rob2, temp });
        
        rob2 = temp;
        add("Update rob2 (Pass 1)", `rob2 = temp;\nShifting variables forward. rob2 becomes $${rob2}.`, 15, { hlPhase: 'updateRob2', passMode: 1, start: 0, end: n - 2, activeIdx: i, rob1, rob2, temp });
    }
    
    max1 = rob2;
    add("Return Helper (Pass 1)", `return rob2;\nPass 1 finished. Max loot if we skip the last house is $${max1}.`, 17, { hlPhase: 'helperReturn', passMode: 1, max1 });


    // Pass 2: 1 to n - 1
    add("Setup Pass 2", `int max2 = robHelper(nums, 1, nums.length - 1);\nInitiating Pass 2: Evaluate skipping the FIRST house.`, 6, { hlPhase: 'setupPass2', passMode: 2, max1 });
    
    add("Helper Init (Pass 2)", `private int robHelper(int[] nums, int start=1, int end=${n-1})`, 10, { hlPhase: 'helperInit', passMode: 2, max1 });
    
    rob1 = 0;
    rob2 = 0;
    add("Init DP Trackers (Pass 2)", `int rob1 = 0, rob2 = 0;\nResetting trackers for new pass.`, 11, { hlPhase: 'helperVars', passMode: 2, start: 1, end: n - 1, rob1, rob2, max1 });

    for (let i = 1; i <= n - 1; i++) {
        add("Loop Step (Pass 2)", `for (int i = start; i <= end; i++)\nArrived at House ${i} containing $${nums[i]}.`, 12, { hlPhase: 'loop', passMode: 2, start: 1, end: n - 1, activeIdx: i, rob1, rob2, max1 });
        
        let robCurrent = rob1 + nums[i];
        let skipCurrent = rob2;
        temp = Math.max(robCurrent, skipCurrent);
        
        add("Calculate Max (Pass 2)", `int temp = Math.max(rob1 + nums[i], rob2);\nMax loot if we rob this house: (rob1: $${rob1} + house: $${nums[i]}) = $${robCurrent}\nMax loot if we skip it: (rob2) = $${skipCurrent}\nBest choice yields temp = $${temp}.`, 13, { hlPhase: 'calcTemp', passMode: 2, start: 1, end: n - 1, activeIdx: i, rob1, rob2, temp, robCurrent, skipCurrent, max1 });
        
        rob1 = rob2;
        add("Update rob1 (Pass 2)", `rob1 = rob2;\nShifting variables forward. rob1 becomes $${rob1}.`, 14, { hlPhase: 'updateRob1', passMode: 2, start: 1, end: n - 1, activeIdx: i, rob1, rob2, temp, max1 });
        
        rob2 = temp;
        add("Update rob2 (Pass 2)", `rob2 = temp;\nShifting variables forward. rob2 becomes $${rob2}.`, 15, { hlPhase: 'updateRob2', passMode: 2, start: 1, end: n - 1, activeIdx: i, rob1, rob2, temp, max1 });
    }
    
    max2 = rob2;
    add("Return Helper (Pass 2)", `return rob2;\nPass 2 finished. Max loot if we skip the first house is $${max2}.`, 17, { hlPhase: 'helperReturn', passMode: 2, max1, max2 });

    let finalAns = Math.max(max1, max2);
    add("Return Final Result", `return Math.max(max1, max2);\nOverall max is max(${max1}, ${max2}) = ${finalAns}.`, 8, { isSuccess: true, finalAns, max1, max2 });

    return steps;
  }, [baseNums, selectedOpId]);

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
      if (st.nums === undefined) return null;

      let isSuccessEnd = st.isSuccess;

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? 'border-emerald-400 ring-4 ring-emerald-100' : 'border-slate-200'} scale-105 z-40`}>
              
              <div className="flex gap-4 w-full mb-6 relative justify-between px-4 md:px-12">
                  <div className={`flex-1 rounded-xl py-2 px-4 text-center text-xs font-black uppercase tracking-widest transition-all ${st.passMode === 1 && !isSuccessEnd ? 'bg-sky-100 text-sky-700 border border-sky-300 shadow-sm scale-105' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>Pass 1: Skip Last</div>
                  <div className={`flex-1 rounded-xl py-2 px-4 text-center text-xs font-black uppercase tracking-widest transition-all ${st.passMode === 2 && !isSuccessEnd ? 'bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-300 shadow-sm scale-105' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>Pass 2: Skip First</div>
              </div>

              {isSuccessEnd ? (
                  <div className="flex flex-col items-center justify-center gap-2 font-mono w-full px-4 md:px-12">
                      <div className="flex gap-4 w-full justify-between mb-4">
                          <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-sky-500 mb-1">Max 1 (Skip Last)</span>
                              <div className="text-3xl font-black text-sky-700">{st.max1}</div>
                          </div>
                          <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1">Max 2 (Skip First)</span>
                              <div className="text-3xl font-black text-fuchsia-700">{st.max2}</div>
                          </div>
                      </div>
                      <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2 mt-4"><Trophy size={16}/> Final Maximum Loot</div>
                      <div className={`flex items-center justify-center text-emerald-700 bg-emerald-100 border-emerald-400 font-mono font-black text-4xl px-10 py-4 rounded-2xl border-2 shadow-md w-full`}>
                          ${st.finalAns}
                      </div>
                  </div>
              ) : st.rob1 !== undefined ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[80px]">
                      
                      {/* Rob 1 */}
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1 flex items-center gap-1">rob1 (2 Back)</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlPhase === 'updateRob1' ? 'bg-amber-100 border-amber-500 text-amber-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              ${st.rob1}
                          </div>
                      </div>

                      {/* Rob 2 */}
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-sky-500 mb-1 flex items-center gap-1">rob2 (1 Back)</span>
                          <div className={`border-2 text-3xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlPhase === 'updateRob2' || st.hlPhase === 'helperVars' ? 'bg-sky-100 border-sky-500 text-sky-800 scale-110 shadow-lg' : 'bg-sky-50 border-sky-200 text-sky-800'}`}>
                              ${st.rob2}
                          </div>
                      </div>

                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>

                      {/* Current House */}
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-emerald-500 mb-1 flex items-center gap-1"><Home size={12}/> Current House</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlPhase === 'loop' || st.hlPhase === 'calcTemp' ? 'bg-emerald-100 border-emerald-500 text-emerald-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.activeIdx !== undefined ? `$${st.nums[st.activeIdx]}` : '-'}
                          </div>
                      </div>
                      
                      <ArrowRight size={24} className="text-slate-300" />

                      {/* Temp (New Max) */}
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><Zap size={12}/> temp (New Max)</span>
                          <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlPhase === 'calcTemp' ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 scale-110 shadow-lg animate-in zoom-in' : 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800'}`}>
                              ${st.temp !== undefined ? st.temp : 0}
                          </div>
                      </div>

                  </div>
              ) : (
                  <span className="text-slate-400 italic text-sm py-4">Initializing Dynamic Programming Pointers...</span>
              )}

          </div>
      );
  };

  const renderVisuals = () => {
      if (st.nums === undefined) return <span className="text-slate-400 italic">empty</span>;

      const nodeWidth = 56;
      const nodeGap = 16;
      const totalColWidth = nodeWidth + nodeGap;
      const containerWidth = st.nums.length * totalColWidth;
      const startX = -(containerWidth / 2) + (totalColWidth / 2);
      
      const rowYInput = 80;

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Middle: Logic Dashboard */}
              <div className="flex flex-col items-center w-full mt-2 pointer-events-auto z-50">
                  {renderActiveDashboard()}
              </div>

              {/* Bottom: The Arrays */}
              <div className="flex flex-col items-center justify-center relative w-full max-w-6xl mt-4">
                  
                  <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-start mt-8 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner overflow-hidden`} style={{ minHeight: '350px' }}>
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                      <div className="relative w-0 h-full overflow-visible flex justify-center mt-12 pb-16">
                          
                          {/* Neighborhood Array Elements */}
                          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-visible">
                              
                              {/* Connection Line to simulate "Street" */}
                              <div className="absolute h-2 bg-slate-200 rounded-full" style={{
                                  left: startX,
                                  width: containerWidth - nodeGap,
                                  top: rowYInput,
                                  transform: 'translateY(-50%)',
                                  zIndex: 0
                              }}></div>

                              {/* Circular dashed line indicating connection between first and last */}
                              {st.nums.length > 2 && (
                                  <svg className="absolute top-0 left-0 w-full h-full overflow-visible z-0" style={{ width: '1px', height: '1px', transform: 'translateX(50%)' }}>
                                      <path 
                                          d={`M ${startX} ${rowYInput + 30} Q ${startX + containerWidth / 2} ${rowYInput + 100} ${startX + (st.nums.length - 1) * totalColWidth} ${rowYInput + 30}`} 
                                          fill="none" 
                                          stroke="#cbd5e1" 
                                          strokeWidth="3" 
                                          strokeDasharray="6 6"
                                      />
                                      <text x={startX + containerWidth / 2} y={rowYInput + 115} fontSize="10" fill="#94a3b8" textAnchor="middle" fontWeight="bold">CIRCULAR NEIGHBORHOOD</text>
                                  </svg>
                              )}

                              {st.nums.map((val: number, idx: number) => {
                                  let currentX = startX + (idx * totalColWidth);
                                  
                                  let isActive = st.activeIdx === idx && !st.isSuccess;
                                  let isExcluded = (st.passMode === 1 && idx === st.nums.length - 1) || (st.passMode === 2 && idx === 0);
                                  
                                  let isProcessed = st.activeIdx !== undefined && idx < st.activeIdx && !isExcluded;

                                  let bgClass = "bg-white border-slate-300 text-slate-700 shadow-sm"; 
                                  let scaleClass = "scale-100";

                                  if (isExcluded) {
                                      bgClass = "bg-slate-100 border-slate-300 text-slate-400 opacity-40 border-dashed shadow-none";
                                  } else if (isActive) {
                                      bgClass = "bg-emerald-100 border-emerald-500 text-emerald-900 shadow-xl ring-4 ring-emerald-200 z-30";
                                      scaleClass = "scale-125";
                                  } else if (isProcessed) {
                                      bgClass = "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm opacity-90";
                                  }

                                  if (st.isSuccess) {
                                       bgClass = "bg-slate-50 border-slate-200 text-slate-300 opacity-40";
                                  }

                                  return (
                                      <div key={`house-${idx}`} className={`absolute flex flex-col items-center transition-all duration-500 ${scaleClass} z-20`} style={{ left: `calc(50% + ${currentX}px)`, top: `${rowYInput}px`, transform: 'translate(-50%, -50%)' }}>
                                          
                                          {/* Element Box (House) */}
                                          <div className={`w-[${nodeWidth}px] h-[${nodeWidth}px] flex flex-col items-center justify-center border-[3px] rounded-xl transition-all duration-300 ${bgClass}`}>
                                              <Home size={16} className={`mb-0.5 ${isActive ? 'text-emerald-500' : isExcluded ? 'text-slate-300' : 'text-emerald-300'}`}/>
                                              <span className="font-mono font-black text-xl">${val}</span>
                                          </div>
                                          
                                          {/* Index & Pointer */}
                                          <span className="text-[10px] font-mono text-slate-400 mt-2 absolute top-full">i:{idx}</span>
                                          
                                          {isActive && (
                                              <div className="absolute -top-10 flex flex-col items-center animate-bounce z-50">
                                                  <span className="text-[9px] font-black uppercase text-emerald-700 tracking-widest bg-emerald-100 px-1 rounded border border-emerald-300 shadow-sm mb-0.5">visiting</span>
                                                  <ArrowDown size={16} className="text-emerald-500"/>
                                              </div>
                                          )}

                                          {isExcluded && !st.isSuccess && (
                                              <div className="absolute -top-6 flex flex-col items-center z-50">
                                                  <X size={24} className="text-rose-400"/>
                                                  <span className="text-[8px] font-black uppercase text-rose-500 bg-rose-50 px-1 rounded border border-rose-200">Excluded</span>
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
                <Home className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">House Robber II</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Dynamic Programming
                  </span>
                  <span>•</span>
                  <span>LeetCode 213</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Home size={28}/> Circular Neighborhood</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are <strong>arranged in a circle.</strong></p>
                        <p>That means the first house is the neighbor of the last one. Meanwhile, adjacent houses have a security system connected, and it will automatically contact the police if two adjacent houses were broken into on the same night.</p>
                        <p className="font-bold mt-4">Given an integer array <code>nums</code> representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> nums = [2,3,2]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">3</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">You cannot rob house 1 (money = 2) and then rob house 3 (money = 2), because they are adjacent houses.</span>
                    </div>

                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre mt-4`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> nums = [1,2,3,1]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">4</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs whitespace-normal">Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4.</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &lt;= nums.length &lt;= 100</li>
                            <li>0 &lt;= nums[i] &lt;= 1000</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><LayersIcon size={16} className="text-sky-500"/> The Circular Constraint</h4>
                        <p className="text-sm leading-relaxed">In the original House Robber problem, you just had a straight line. Here, the circle means if you choose to rob index `0`, you are permanently banned from robbing index `n-1`. Conversely, if you want to rob index `n-1`, you cannot have robbed index `0`.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><SplitSquareHorizontal size={16} className={`text-${themeColor}-500`}/> The Split Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600">We resolve the circle by running the original linear DP algorithm twice! First, we assume we definitely don't rob the last house (evaluating `0` to `n-2`). Second, we assume we definitely don't rob the first house (evaluating `1` to `n-1`). The global maximum is just the max of these two independent runs!</p>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Houses Array (Max 15)</label>
                            <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold tracking-[0.1em]`} placeholder="2, 3, 2" />
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
                                <PartyPopper size={24}/> HEIST COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Max achievable loot is ${st.finalAns}.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'calcTemp' ? 'text-fuchsia-400' : (st.hlPhase === 'updateRob1' || st.hlPhase === 'updateRob2' ? 'text-sky-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                            
                            {/* Persistent State Monitor */}
                            {st.nums !== undefined && !st.isSuccess && (
                                <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap gap-2">
                                    {st.max1 !== undefined && (
                                        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                            <span className="text-[10px] uppercase font-bold text-slate-400">max1</span>
                                            <span className="font-mono font-black text-sky-400">{st.max1}</span>
                                        </div>
                                    )}
                                    {st.max2 !== undefined && st.passMode === 2 && (
                                        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                            <span className="text-[10px] uppercase font-bold text-slate-400">max2</span>
                                            <span className="font-mono font-black text-fuchsia-400">{st.max2}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[440px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Home size={14} className={`text-${themeColor}-500`}/> Dynamic Programming View</span>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Mastering state transitions in linear DP.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Home size={24} className="text-emerald-500"/> 1. The Core DP Transition</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">For any straight line of houses, at house <code>i</code>, we have exactly two choices:</p>
                        <ol className="list-decimal pl-6 space-y-2 text-slate-600 mb-4">
                            <li><strong>Rob it:</strong> We gain <code>nums[i]</code>, but we cannot have robbed house <code>i-1</code>. So our total is <code>nums[i] + maxLootAt(i-2)</code>.</li>
                            <li><strong>Skip it:</strong> We don't get <code>nums[i]</code>, but we keep whatever our best loot was up to house <code>i-1</code>. So our total is <code>maxLootAt(i-1)</code>.</li>
                        </ol>
                        <p className="text-slate-600 leading-relaxed">This yields the classic DP formula: <code>DP[i] = max(DP[i-2] + nums[i], DP[i-1])</code>.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowRight size={24} className="text-sky-500"/> 2. State Space Optimization</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Notice that to calculate <code>DP[i]</code>, we only ever need to know <code>DP[i-1]</code> and <code>DP[i-2]</code>. We don't need the entire DP array!</p>
                        <p className="text-slate-600 leading-relaxed">We can optimize space from O(N) to O(1) by simply maintaining two integer pointers: <code>rob1</code> (acting as <code>DP[i-2]</code>) and <code>rob2</code> (acting as <code>DP[i-1]</code>). At each step, we calculate the new max (<code>temp</code>), shift <code>rob1 = rob2</code>, and shift <code>rob2 = temp</code>.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-fuchsia-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N).</strong> We run the linear DP algorithm twice. Each run takes exactly O(N) time where we do constant O(1) math operations per house. O(2N) simplifies to O(N).</li>
                            <li><strong>Space Complexity: O(1).</strong> Because we use the state space optimization (just tracking <code>rob1</code> and <code>rob2</code>), we require zero auxiliary arrays.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This problem is designed to test your ability to decompose a tricky constraint (the circle) into standard, known sub-problems (linear DP)."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we solve this in a single pass instead of running the helper twice?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Technically yes, but it makes the state tracking much messier."</p>
                            <p>To do it in one pass, you would need to track two sets of DP variables simultaneously inside the same loop (one set evaluating with index 0, one set evaluating without it). However, running two separate, clean O(N) loops is still asymptotically O(N) and is universally preferred in interviews because it demonstrates clear, modular code design."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "What happens if there are negative numbers in the array?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The current logic handles it, but mathematically you'd want a floor of 0."</p>
                            <p>If house values could be negative, the robber would simply choose to skip them (why rob a house that costs you money?). In our standard DP `Math.max(rob1 + nums[i], rob2)`, if `nums[i]` is negative, `rob2` (skipping) will naturally be strictly larger and win out. However, if *all* houses were negative, you'd want to explicitly ensure the return value is at least 0 (meaning you just don't rob anything tonight)."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "Why do we need the explicit check `if (nums.length == 1)`?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To prevent IndexOutOfBounds."</p>
                            <p>If the array size is 1, our logic calls `robHelper(nums, 0, nums.length - 2)`. `nums.length - 2` would evaluate to `-1`. A loop condition `for (int i = 0; i &lt;= -1; i++)` would immediately exit, returning 0, which is incorrect since we are absolutely allowed to rob the only house available! Adding the explicit base case protects against this."</p>
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
                              <Home size={20}/>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'calcTemp' ? 'text-fuchsia-400' : (st.hlPhase === 'updateRob1' || st.hlPhase === 'updateRob2' ? 'text-sky-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        
                        {/* Persistent State Monitor for Fullscreen */}
                        {st.nums !== undefined && !st.isSuccess && (
                            <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap gap-2">
                                {st.rob1 !== undefined && (
                                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">rob1</span>
                                        <span className="font-mono font-black text-amber-400">${st.rob1}</span>
                                    </div>
                                )}
                                {st.rob2 !== undefined && (
                                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">rob2</span>
                                        <span className="font-mono font-black text-sky-400">${st.rob2}</span>
                                    </div>
                                )}
                                {st.temp !== undefined && (
                                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">temp</span>
                                        <span className="font-mono font-black text-fuchsia-400">${st.temp}</span>
                                    </div>
                                )}
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Houses Array</label>
                              <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold tracking-[0.1em]`} placeholder="2, 3, 2" />
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">HEIST COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Successfully calculated maximum loot</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Final Maximum Loot</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center gap-2 break-all">${st.finalAns}</div>
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