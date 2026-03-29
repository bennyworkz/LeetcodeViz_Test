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
  bottomUpOptimized: {
    id: 'bottomUpOptimized',
    title: '1. Space-Optimized 1D DP',
    icon: <IterationCcw size={16} />,
    complexity: 'Time: O(M×N) | Space: O(min(M,N))',
    theme: 'emerald',
    code: `class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        if (text1.length() < text2.length()) {
            return longestCommonSubsequence(text2, text1);
        }
        int[] dp = new int[text2.length() + 1];
        
        for (int i = 1; i <= text1.length(); i++) {
            int prev = 0; // Represents dp[i-1][j-1]
            for (int j = 1; j <= text2.length(); j++) {
                int temp = dp[j];
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[j] = 1 + prev;
                } else {
                    dp[j] = Math.max(dp[j], dp[j - 1]);
                }
                prev = temp;
            }
        }
        return dp[text2.length()];
    }
}`,
    desc: "The most memory-efficient approach. Because calculating dp[i][j] only requires the current row (Left: dp[i][j-1]) and the previous row (Above: dp[i-1][j], Diagonal: dp[i-1][j-1]), we can compress the 2D grid into a single 1D array! The only trick is keeping track of the Diagonal value, which gets overwritten. We use a single 'prev' variable to hold that diagonal value before it's replaced, sliding it forward. This compresses space to O(min(M,N))."
  },
  bottomUpArray: {
    id: 'bottomUpArray',
    title: '2. Standard 2D DP',
    icon: <Grid size={16} />,
    complexity: 'Time: O(M×N) | Space: O(M×N)',
    theme: 'sky',
    code: `class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = 1 + dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        return dp[m][n];
    }
}`,
    desc: "A classic 2D Tabulation DP approach. We allocate an (M+1) x (N+1) grid, padded with a 0-row and 0-col representing empty strings. For each cell (i,j), we compare text1[i-1] and text2[j-1]. If they match, we add 1 to the LCS of the prefixes without these characters (Diagonal: dp[i-1][j-1]). If they mismatch, the LCS is the max of ignoring a character from text1 (Above: dp[i-1][j]) or ignoring a character from text2 (Left: dp[i][j-1])."
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
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|char|boolean|class|return|if|else|while|for|new|String|longestCommonSubsequence|Solution|length|charAt|Math|max|dp|temp|prev|text1|text2|m|n|i|j)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
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
            const isPointer = ['m', 'n', 'dp', 'i', 'j', 'text1', 'text2', 'prev', 'temp'].includes(part);
            const isMapCall = ['longestCommonSubsequence', 'length', 'charAt', 'max'].includes(part);
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

export default function LongestCommonSubsequenceVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('bottomUpArray');
  
  const [t1Input, setT1Input] = useState('abcde');
  const [t2Input, setT2Input] = useState('ace');
  
  const [baseT1, setBaseT1] = useState<string>('abcde');
  const [baseT2, setBaseT2] = useState<string>('ace');

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

  const parseInput = (str: string, defaultVal: string) => {
      let v = str.trim().toLowerCase().replace(/[^a-z]/g, '');
      if (v.length === 0) v = defaultVal;
      if (v.length > 10) v = v.substring(0, 10); // Cap for visual sanity 
      return v;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setBaseT1(parseInput(t1Input, 'abcde'));
      setBaseT2(parseInput(t2Input, 'ace'));
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [t1Input, t2Input, selectedOpId]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    let text1 = baseT1;
    let text2 = baseT2;
    if (text1.length < 1 || text2.length < 1) return [];

    let m = text1.length;
    let n = text2.length;

    if (selectedOpId === 'bottomUpOptimized') {
        // Handle swap logic to maintain exact code match
        let swapped = false;
        if (text1.length < text2.length) {
            swapped = true;
            let temp = text1;
            text1 = text2;
            text2 = temp;
            m = text1.length;
            n = text2.length;
        }

        let dp = new Array(n + 1).fill(0);
        let prev = 0;
        
        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { dp: [...dp], prev, text1, text2, ...st } 
        });

        add("Function Call", `public int longestCommonSubsequence(String text1, String text2)`, 2, { hlPhase: 'init' });
        
        add("Length Check", `if (text1.length() < text2.length())`, 3, { hlPhase: 'init' });
        if (swapped) {
            add("Swap Strings", `return longestCommonSubsequence(text2, text1);\nSwapping strings to ensure we use the shortest string for the 1D array to save space!`, 4, { hlPhase: 'swap', text1, text2 });
        }

        add("Init Array", `int[] dp = new int[text2.length() + 1];\nCreating a 1D array of size ${n + 1} (padded with a 0-col).`, 6, { hlPhase: 'initArray' });

        for (let i = 1; i <= m; i++) {
            add("Outer Loop", `for (int i = 1; i <= text1.length(); i++)\nProcessing Character '${text1[i-1]}' from text1.`, 8, { hlPhase: 'outerLoop', i });
            
            prev = 0;
            add("Init Prev (Diagonal)", `int prev = 0;\nSetting 'prev' to 0. This simulates dp[i-1][0] (the empty prefix column).`, 9, { hlPhase: 'initPrev', i, prev });
            
            for (let j = 1; j <= n; j++) {
                add("Inner Loop", `for (int j = 1; j <= text2.length(); j++)\nComparing '${text1[i-1]}' with '${text2[j-1]}'.`, 10, { hlPhase: 'innerLoop', i, j, c1: text1[i-1], c2: text2[j-1] });
                
                let temp = dp[j];
                add("Save Old Above Value", `int temp = dp[j];\nSaving the old 'Above' value (${temp}) before we overwrite dp[j], so it can become the 'Diagonal' for the next step.`, 11, { hlPhase: 'saveTemp', i, j, temp });

                let match = text1[i - 1] === text2[j - 1];
                add("Evaluate Match", `if (text1.charAt(i - 1) == text2.charAt(j - 1))\nDoes '${text1[i-1]}' == '${text2[j-1]}'? ${match ? 'YES!' : 'NO.'}`, 12, { hlPhase: 'eval', i, j, match, temp });

                if (match) {
                    let oldPrev = prev;
                    dp[j] = 1 + prev;
                    add("Match Calculation", `dp[j] = 1 + prev;\nCharacters match! Taking 1 + Diagonal (${oldPrev}) = ${dp[j]}.`, 13, { hlPhase: 'calcMatch', i, j, match, temp, oldPrev, curr: dp[j] });
                } else {
                    let above = dp[j];
                    let left = dp[j - 1];
                    dp[j] = Math.max(above, left);
                    add("Mismatch Calculation", `dp[j] = Math.max(dp[j], dp[j - 1]);\nMismatch. Taking max(Above: ${above}, Left: ${left}) = ${dp[j]}.`, 15, { hlPhase: 'calcMismatch', i, j, match, temp, above, left, curr: dp[j] });
                }
                
                prev = temp;
                add("Shift Prev", `prev = temp;\nUpdating 'prev' to hold ${temp} for the next column's diagonal.`, 17, { hlPhase: 'shiftPrev', i, j, prev });
            }
        }

        add("Return Result", `return dp[text2.length()];\nLoops complete! The final element in the array is the LCS length: ${dp[n]}.`, 20, { hlPhase: 'success', finalAns: dp[n] });
    } 
    else if (selectedOpId === 'bottomUpArray') {
        let dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { dp: dp.map(row => [...row]), text1, text2, ...st } 
        });

        add("Function Call", `public int longestCommonSubsequence(String text1, String text2)`, 2, { hlPhase: 'init' });
        
        add("Init Lengths & Grid", `int m = text1.length(), n = text2.length();\nint[][] dp = new int[m + 1][n + 1];\nAllocating a 2D array of size ${m + 1} x ${n + 1}. Row 0 and Col 0 represent empty string prefixes.`, 3, { hlPhase: 'initGrid' });

        for (let i = 1; i <= m; i++) {
            add("Outer Loop", `for (int i = 1; i <= m; i++)\nProcessing Character '${text1[i-1]}' from text1.`, 6, { hlPhase: 'outerLoop', i });
            
            for (let j = 1; j <= n; j++) {
                add("Inner Loop", `for (int j = 1; j <= n; j++)\nComparing '${text1[i-1]}' with '${text2[j-1]}'.`, 7, { hlPhase: 'innerLoop', i, j, c1: text1[i-1], c2: text2[j-1] });
                
                let match = text1[i-1] === text2[j-1];
                add("Evaluate Match", `if (text1.charAt(i - 1) == text2.charAt(j - 1))\nDoes '${text1[i-1]}' == '${text2[j-1]}'? ${match ? 'YES!' : 'NO.'}`, 8, { hlPhase: 'eval', i, j, match });

                if (match) {
                    let diag = dp[i-1][j-1];
                    dp[i][j] = 1 + diag;
                    add("Match Calculation", `dp[i][j] = 1 + dp[i - 1][j - 1];\nCharacters match! We add 1 to the Diagonal value (${diag}): 1 + ${diag} = ${dp[i][j]}.`, 9, { hlPhase: 'calcMatch', i, j, match, diag, curr: dp[i][j] });
                } else {
                    let above = dp[i-1][j];
                    let left = dp[i][j-1];
                    dp[i][j] = Math.max(above, left);
                    add("Mismatch Calculation", `dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\nMismatch. Taking max(Above: ${above}, Left: ${left}) = ${dp[i][j]}.`, 11, { hlPhase: 'calcMismatch', i, j, match, above, left, curr: dp[i][j] });
                }
            }
        }

        add("Return Result", `return dp[m][n];\nGrid completely filled. The target cell at the bottom-right contains ${dp[m][n]}.`, 16, { hlPhase: 'success', finalAns: dp[m][n] });
    }

    return steps;
  }, [baseT1, baseT2, selectedOpId]);

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

      let isMatch = st.match === true;
      let isMismatch = st.match === false;
      let isCalcMatch = st.hlPhase === 'calcMatch';
      let isCalcMismatch = st.hlPhase === 'calcMismatch';
      let isCalc = isCalcMatch || isCalcMismatch;
      
      let borderCol = isCalcMatch ? 'border-emerald-400 ring-4 ring-emerald-100' : (isCalcMismatch ? 'border-rose-400 ring-4 ring-rose-100' : `border-${themeColor}-200`);

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${borderCol} scale-105`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Activity size={14}/> Dynamic Programming Evaluator</span>
              
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                  
                  {/* Character Compare Block */}
                  <div className="flex flex-col items-center min-w-[120px]">
                      <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'eval' || isCalc ? (isMatch ? 'text-emerald-500' : 'text-rose-500') : 'text-slate-400'}`}>Character Match?</span>
                      <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${st.hlPhase === 'eval' || isCalc ? (isMatch ? `bg-emerald-100 border-emerald-500 text-emerald-900 shadow-md` : `bg-rose-100 border-rose-500 text-rose-900 shadow-md`) : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                          <span>'{st.c1 !== undefined ? st.c1 : '?'}'</span>
                          {isMatch ? <span className="text-emerald-500 mx-1">==</span> : <span className="text-rose-500 mx-1">!=</span>}
                          <span>'{st.c2 !== undefined ? st.c2 : '?'}'</span>
                      </div>
                  </div>

                  <div className="w-px h-12 bg-slate-200 hidden md:block"></div>

                  <div className="flex items-center gap-2 md:gap-3">
                      
                      {/* Formula Element 1 */}
                      {isCalcMatch ? (
                          <div className="flex items-center gap-2 md:gap-3 animate-in slide-in-from-left-4">
                              <span className="text-xl font-black text-emerald-600">1</span>
                              <span className="text-xl font-bold text-slate-400 font-sans">+</span>
                              <div className="flex flex-col items-center">
                                  <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-emerald-500`}>Diagonal</span>
                                  <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 bg-emerald-50 border-emerald-400 text-emerald-700 border-dashed scale-105 shadow-sm`}>
                                      <span>{st.diag !== undefined ? st.diag : (st.oldPrev !== undefined ? st.oldPrev : '?')}</span>
                                  </div>
                              </div>
                          </div>
                      ) : isCalcMismatch ? (
                          <div className="flex items-center gap-2 md:gap-3 animate-in slide-in-from-left-4">
                              <span className="text-sm font-black text-rose-600 uppercase tracking-widest">max(</span>
                              <div className="flex flex-col items-center">
                                  <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-sky-600`}>Above</span>
                                  <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 bg-sky-50 border-sky-400 text-sky-700 border-dashed scale-105 shadow-sm`}>
                                      <span>{st.above !== undefined ? st.above : '?'}</span>
                                  </div>
                              </div>
                              <span className="text-xl font-bold text-slate-400 font-sans">,</span>
                              <div className="flex flex-col items-center">
                                  <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-rose-600`}>Left</span>
                                  <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 bg-rose-50 border-rose-400 text-rose-700 border-dashed scale-105 shadow-sm`}>
                                      <span>{st.left !== undefined ? st.left : '?'}</span>
                                  </div>
                              </div>
                              <span className="text-sm font-black text-rose-600 uppercase tracking-widest">)</span>
                          </div>
                      ) : (
                          <div className="flex items-center justify-center min-h-[40px] px-8 text-slate-400 italic text-sm font-mono">
                              Waiting for match evaluation...
                          </div>
                      )}
                      
                      {isCalc && <ArrowRight size={24} className={isCalcMatch ? "text-emerald-500 mx-2" : "text-rose-500 mx-2"}/>}
                      
                      {/* Result */}
                      {isCalc && (
                          <div className="flex flex-col items-center animate-in slide-in-from-right-4">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${isCalcMatch ? 'text-emerald-600' : 'text-rose-600'}`}>{selectedOpId === 'bottomUpOptimized' ? 'dp[j] (New)' : 'dp[i][j]'}</span>
                              <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${isCalcMatch ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-md scale-110' : 'bg-rose-100 border-rose-500 text-rose-900 shadow-md scale-110'}`}>
                                  {st.curr !== undefined ? st.curr : '?'}
                              </div>
                          </div>
                      )}
                  </div>

              </div>
          </div>
      );
  }

  const renderVisuals = () => {
      // Dynamic Sizing based on strings
      let text1Str = st.text1 || baseT1 || "";
      let text2Str = st.text2 || baseT2 || "";
      
      const cols = text2Str.length;
      const rows = selectedOpId === 'bottomUpOptimized' ? 1 : text1Str.length;
      
      const maxGridWidth = 700;
      const maxGridHeight = 450;
      
      // Compute cellSize based on actual string bounds + padding for headers
      const cellW = maxGridWidth / (cols + 2); // +2 for row header and 0-col
      const cellH = maxGridHeight / (rows + 2); // +2 for col header and 0-row
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
                              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest font-mono text-white bg-violet-600 shadow-md flex items-center gap-2`}>
                                  Simulating Row i = {st.i !== undefined ? st.i : 0} 
                                  {st.i !== undefined && st.i > 0 && <span className="opacity-80 ml-2">( char '{text1Str[st.i-1]}' )</span>}
                              </span>
                          </div>

                          <div className="flex flex-col items-center w-full max-w-5xl gap-2 px-4 relative mt-16">
                              {/* 1D DP Array Rendering */}
                              <div className="flex gap-1 w-full justify-center px-4 relative items-end">
                                  
                                  {/* Row Header (Empty cell placeholder for alignment) */}
                                  <div className="flex flex-col items-center justify-end mr-4">
                                       <div className={`flex items-center justify-center font-mono font-black border-transparent bg-transparent text-slate-500`}
                                            style={{ height: `${cellSize}px`, width: `${cellSize}px`, fontSize: `${cellSize * 0.4}px` }}>
                                       </div>
                                  </div>

                                  {/* Actual DP Elements */}
                                  {st.dp && st.dp.map((val: number, idx: number) => {
                                      let isCurrentlyCalculating = (st.hlPhase === 'calcMatch' || st.hlPhase === 'calcMismatch' || st.hlPhase === 'eval' || st.hlPhase === 'saveTemp') && idx === st.j;
                                      let isSourceLeft = st.hlPhase === 'calcMismatch' && st.j !== undefined && idx === st.j - 1;
                                      let isEnd = idx === cols;
                                      
                                      let isMatch = st.match === true && isCurrentlyCalculating;
                                      let isMismatch = st.match === false && isCurrentlyCalculating;

                                      let cellClass = "bg-white border-slate-300 text-slate-700 border-solid shadow-sm"; 
                                      
                                      if (isCurrentlyCalculating) {
                                          if (isMatch) cellClass = "bg-emerald-100 border-emerald-500 text-emerald-900 border-solid shadow-md scale-110 z-30";
                                          else if (isMismatch) cellClass = "bg-violet-100 border-violet-500 text-violet-900 border-solid shadow-md scale-110 z-30";
                                          else cellClass = "bg-amber-100 border-amber-500 text-amber-900 border-solid shadow-md scale-110 z-30";
                                      } else if (isSourceLeft) {
                                          cellClass = "bg-rose-50 border-rose-400 border-dashed text-rose-700 shadow-sm scale-105 z-20";
                                      } 

                                      if (st.isSuccess && isEnd) {
                                          cellClass = "bg-emerald-500 border-emerald-600 border-solid text-white shadow-lg scale-110 z-40 animate-pulse";
                                      }

                                      return (
                                          <div key={`v-${idx}`} className="flex flex-col items-center gap-1 shrink-0 transition-all duration-300 relative">
                                              
                                              {/* Column Header */}
                                              {idx > 0 && (
                                                   <span className="text-slate-500 font-mono font-black mb-2 absolute -top-8">
                                                       '{text2Str[idx-1]}'
                                                   </span>
                                              )}
                                              {idx === 0 && (
                                                   <span className="text-slate-400 font-mono font-bold mb-2 absolute -top-8 text-[10px] italic">
                                                       (0-col)
                                                   </span>
                                              )}

                                              {/* Floating Diagonal / Prev Variable */}
                                              {isCurrentlyCalculating && (
                                                  <div className="absolute -top-[calc(100%+32px)] -left-[calc(100%+4px)] flex flex-col items-center z-20 animate-pulse">
                                                       <span className="text-[9px] font-black font-mono text-emerald-500 bg-emerald-50 px-1 rounded border border-emerald-200">Diag (prev)</span>
                                                       <div className={`w-8 h-8 border-2 border-emerald-400 border-dashed bg-emerald-50 text-emerald-700 rounded-md flex items-center justify-center font-bold text-xs shadow-md ${isMatch ? 'ring-2 ring-emerald-300' : ''}`}>
                                                           {st.oldPrev !== undefined ? st.oldPrev : st.prev}
                                                       </div>
                                                  </div>
                                              )}

                                              {/* Floating Above (Temp) Variable */}
                                              {isCurrentlyCalculating && (
                                                  <div className="absolute -top-[calc(100%+16px)] flex flex-col items-center z-20 animate-pulse">
                                                       <span className="text-[9px] font-black font-mono text-sky-500 bg-sky-50 px-1 rounded border border-sky-200">Above (dp[j])</span>
                                                       <div className={`w-8 h-8 border-2 border-sky-400 border-dashed bg-sky-50 text-sky-700 rounded-md flex items-center justify-center font-bold text-xs shadow-md ${isMismatch ? 'ring-2 ring-sky-300' : ''}`}>
                                                           {st.temp !== undefined ? st.temp : val}
                                                       </div>
                                                  </div>
                                              )}

                                              {/* Action Arrows */}
                                              {isCurrentlyCalculating && isMismatch && (
                                                  <ArrowDown size={24} strokeWidth={3} className="absolute -top-7 text-sky-500 z-50 animate-in slide-in-from-top-2" />
                                              )}
                                              {isCurrentlyCalculating && isSourceLeft && (
                                                  <ArrowRight size={24} strokeWidth={3} className="absolute -left-7 text-rose-500 z-50 animate-in slide-in-from-left-2" />
                                              )}
                                              {isCurrentlyCalculating && isMatch && (
                                                  <ArrowDownRight size={28} strokeWidth={3} className="absolute -top-6 -left-6 text-emerald-500 z-50 animate-in zoom-in" />
                                              )}

                                              <div 
                                                  className={`relative flex items-center justify-center border-2 rounded-xl transition-all duration-300 font-mono font-black ${cellClass}`}
                                                  style={{ height: `${cellSize}px`, width: `${cellSize}px`, fontSize: `${cellSize * 0.4}px` }}
                                              >
                                                  {isCurrentlyCalculating && (st.hlPhase === 'calcMatch' || st.hlPhase === 'calcMismatch') ? st.curr : val}
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
                              className="grid gap-1 md:gap-2 mt-6" 
                              style={{ 
                                  gridTemplateColumns: `auto repeat(${cols + 1}, minmax(0, 1fr))`, // Auto for Row Headers
                                  width: `min(100%, ${(cols + 2) * (cellSize + 8)}px)`
                              }}
                          >
                              {/* --- Header Row (Text 2 Characters) --- */}
                              {/* Empty top-left corners */}
                              <div className="flex items-end justify-center pb-2"><span className="text-slate-400 font-mono text-[10px] italic opacity-50">j&rarr;</span></div>
                              
                              {/* 0-Col Header */}
                              <div className="flex items-end justify-center pb-2">
                                  <span className="text-slate-400 font-mono text-[10px] italic">0</span>
                              </div>

                              {/* Text2 Chars */}
                              {text2Str.split('').map((char, cIdx) => (
                                  <div key={`h-col-${cIdx}`} className="flex items-end justify-center pb-2">
                                      <span className={`font-mono font-black text-lg ${(st.j === cIdx + 1 && !st.isSuccess) ? 'text-violet-500 scale-125' : 'text-slate-500'}`}>'{char}'</span>
                                  </div>
                              ))}

                              {/* --- Data Rows --- */}
                              {st.dp && st.dp.map((rowArr: number[], rIdx: number) => {
                                  
                                  // Determine Row Header
                                  let rowHeader = null;
                                  if (rIdx === 0) {
                                      rowHeader = <span className="text-slate-400 font-mono text-[10px] italic">0</span>;
                                  } else {
                                      let rowChar = text1Str[rIdx - 1];
                                      rowHeader = <span className={`font-mono font-black text-lg ${(st.i === rIdx && !st.isSuccess) ? 'text-violet-500 scale-125' : 'text-slate-500'}`}>'{rowChar}'</span>;
                                  }

                                  return (
                                      <React.Fragment key={`row-${rIdx}`}>
                                          {/* Row Header */}
                                          <div className="flex items-center justify-end pr-2 h-full">
                                              {rowHeader}
                                          </div>
                                          
                                          {/* Row Cells */}
                                          {rowArr.map((val: number, cIdx: number) => {
                                              let isCurrentlyCalculating = (st.hlPhase === 'calcMatch' || st.hlPhase === 'calcMismatch' || st.hlPhase === 'eval') && rIdx === st.i && cIdx === st.j;
                                              
                                              let isSourceAbove = st.hlPhase === 'calcMismatch' && st.i !== undefined && rIdx === st.i - 1 && cIdx === st.j;
                                              let isSourceLeft = st.hlPhase === 'calcMismatch' && st.i !== undefined && rIdx === st.i && cIdx === st.j - 1;
                                              let isSourceDiag = st.hlPhase === 'calcMatch' && st.i !== undefined && rIdx === st.i - 1 && cIdx === st.j - 1;
                                              
                                              let isEnd = rIdx === text1Str.length && cIdx === text2Str.length;

                                              let isMatch = st.match === true && isCurrentlyCalculating;
                                              let isMismatch = st.match === false && isCurrentlyCalculating;

                                              let cellClass = "bg-white border-slate-300 text-slate-700 shadow-sm"; // Empty or Filled
                                              
                                              if (rIdx === 0 || cIdx === 0) {
                                                  cellClass = "bg-slate-100 border-slate-200 text-slate-400 opacity-60"; // 0-padding
                                              }
                                              
                                              if (isCurrentlyCalculating) {
                                                  if (isMatch) cellClass = "bg-emerald-100 border-emerald-500 text-emerald-900 shadow-md scale-110 z-30";
                                                  else if (isMismatch) cellClass = "bg-violet-100 border-violet-500 text-violet-900 shadow-md scale-110 z-30";
                                                  else cellClass = "bg-amber-100 border-amber-500 text-amber-900 shadow-md scale-110 z-30";
                                              } else if (isSourceAbove) {
                                                  cellClass = "bg-sky-50 border-sky-400 border-dashed text-sky-700 shadow-sm scale-105 z-20";
                                              } else if (isSourceLeft) {
                                                  cellClass = "bg-rose-50 border-rose-400 border-dashed text-rose-700 shadow-sm scale-105 z-20";
                                              } else if (isSourceDiag) {
                                                  cellClass = "bg-emerald-50 border-emerald-400 border-dashed text-emerald-700 shadow-sm scale-105 z-20";
                                              }

                                              if (st.isSuccess && isEnd) {
                                                  cellClass = "bg-emerald-500 border-emerald-600 text-white shadow-2xl scale-125 z-40 ring-4 ring-emerald-200 animate-pulse";
                                              }

                                              return (
                                                  <div 
                                                      key={`cell-${rIdx}-${cIdx}`} 
                                                      className={`relative flex items-center justify-center border-2 rounded-xl transition-all duration-300 font-mono font-black ${cellClass}`}
                                                      style={{ height: `${cellSize}px`, width: `${cellSize}px`, fontSize: `${cellSize * 0.4}px` }}
                                                  >
                                                      {/* Values */}
                                                      {isCurrentlyCalculating && (st.hlPhase === 'calcMatch' || st.hlPhase === 'calcMismatch') ? st.curr : val}

                                                      {/* Arrows */}
                                                      {isCurrentlyCalculating && isSourceLeft && (
                                                          <ArrowRight size={24} strokeWidth={3} className="absolute -left-6 text-rose-500 z-50 animate-in slide-in-from-left-2" />
                                                      )}
                                                      {isCurrentlyCalculating && isSourceAbove && (
                                                          <ArrowDown size={24} strokeWidth={3} className="absolute -top-6 text-sky-500 z-50 animate-in slide-in-from-top-2" />
                                                      )}
                                                      {isCurrentlyCalculating && isSourceDiag && (
                                                          <ArrowDownRight size={28} strokeWidth={3} className="absolute -top-5 -left-5 text-emerald-500 z-50 animate-in zoom-in" />
                                                      )}

                                                      {/* Badges */}
                                                      {isEnd && (
                                                          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-0.5 shadow-sm border border-slate-200 z-50">
                                                              <Flag size={14} className="text-emerald-500" />
                                                          </div>
                                                      )}
                                                  </div>
                                              );
                                          })}
                                      </React.Fragment>
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
                <Code2 className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Longest Common Subsequence</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      2D Dynamic Programming
                  </span>
                  <span>•</span>
                  <span>LeetCode 1143</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Code2 size={28}/> String Matching DP</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given two strings <code>text1</code> and <code>text2</code>, return the length of their longest <strong>common subsequence</strong>. If there is no common subsequence, return 0.</p>
                        <p>A <strong>subsequence</strong> of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters. For example, "ace" is a subsequence of "abcde".</p>
                        <p className="font-bold mt-4">A common subsequence of two strings is a subsequence that is common to both strings.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-4`}>
                        <div className="w-full space-y-2">
                            <span className={`text-${themeColor}-400 block uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                            <div className="text-slate-300 break-all space-y-1">
                                <p><strong>Input:</strong> text1 = "abcde", text2 = "ace"</p>
                                <p><strong>Output:</strong> 3</p>
                                <p><strong>Explanation:</strong> The longest common subsequence is "ace" and its length is 3.</p>
                            </div>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-4 mt-4`}>
                        <div className="w-full space-y-2">
                            <span className={`text-${themeColor}-400 block uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                            <div className="text-slate-300 break-all space-y-1">
                                <p><strong>Input:</strong> text1 = "abc", text2 = "def"</p>
                                <p><strong>Output:</strong> 0</p>
                                <p><strong>Explanation:</strong> There is no such common subsequence, so the result is 0.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &le; text1.length, text2.length &le; 1000</li>
                            <li>text1 and text2 consist of only lowercase English characters.</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-sky-500"/> The Core Insight</h4>
                        <p className="text-sm leading-relaxed">When comparing two strings recursively, you evaluate them character by character. If the current characters match, you definitely include them in your subsequence (1 + LCS of the remaining prefixes). If they don't match, the longest subsequence might involve skipping a character from `text1` OR skipping a character from `text2`. You take the maximum of those two possibilities. This branching logic perfectly maps to a 2D Matrix DP.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2"><strong>1. 2D Array DP:</strong> Create an <code>(M+1) x (N+1)</code> matrix. The 0th row/col represent comparing against an empty string (base case = 0). Iterate through the matrix applying <code>dp[i][j] = 1 + dp[i-1][j-1]</code> for matches, or <code>max(dp[i-1][j], dp[i][j-1])</code> for mismatches.</p>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>2. Space-Optimized 1D Array:</strong> Notice that calculating a row only requires the current row being built and the immediately previous row. We can compress our massive matrix into a single 1D array of size <code>N+1</code>!</p>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Text 1 (Rows)</label>
                            <input type="text" value={t1Input} onChange={(e) => setT1Input(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="abcde" maxLength={10}/>
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Text 2 (Cols)</label>
                            <input type="text" value={t2Input} onChange={(e) => setT2Input(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="ace" maxLength={10}/>
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
                                Length of Longest Common Subsequence is {String(st.finalAns)}.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'calcMatch' ? 'text-emerald-400' : (st.hlPhase === 'calcMismatch' ? 'text-rose-400' : (st.hlPhase === 'eval' ? `text-${themeColor}-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding 2D Grid DP for Strings.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Grid size={24} className="text-emerald-500"/> 1. The 2D DP Matrix</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Let `dp[i][j]` be the length of the longest common subsequence of `text1[0..i-1]` and `text2[0..j-1]`. We build a matrix of size `(M+1) x (N+1)`. The extra row and column at index 0 represent comparing a string with an empty string, which inherently has an LCS of 0.</p>
                        <p className="text-slate-600 leading-relaxed">If the current characters match (`text1[i-1] == text2[j-1]`), they both contribute to the LCS. We take the LCS of the prefixes without these characters and add 1: <br/><strong><code>dp[i][j] = 1 + dp[i-1][j-1]</code> (Diagonal)</strong>.</p>
                        <p className="text-slate-600 leading-relaxed">If they do NOT match, the best we can do is the maximum LCS we found by either ignoring the current char from text1 or ignoring the current char from text2:<br/><strong><code>dp[i][j] = max(dp[i-1][j], dp[i][j-1])</code> (Above or Left)</strong>.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><IterationCcw size={24} className="text-sky-500"/> 2. Spatial Compression</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Notice that calculating a cell in Row `i` ONLY ever requires looking at cells in Row `i` (the Left cell) and Row `i-1` (the Above and Diagonal cells). We never need Row `i-2`. This means we can compress the $O(M \times N)$ 2D matrix into a single 1D array of size $N+1$!</p>
                        <p className="text-slate-600 leading-relaxed">The only tricky part is the Diagonal value (`dp[i-1][j-1]`). Because we update the 1D array in place, the 'Above' value gets overwritten and we lose the 'Diagonal' for the next step. To fix this, we store the Diagonal in a temporary <code>prev</code> variable before overwriting.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Standard DP:</strong> Time is $O(M \times N)$ because we visit every cell once. Space is $O(M \times N)$ to store the entire DP matrix.</li>
                            <li><strong>Space-Optimized DP:</strong> Time is still $O(M \times N)$, but Space is compressed to just $O(\min(M, N))$ by swapping the inputs to ensure the 1D array corresponds to the shorter string.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is the cornerstone problem for String DP. Mastering LCS unlocks the ability to solve Edit Distance, Longest Palindromic Subsequence, and Shortest Common Supersequence."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Can you return the ACTUAL longest common subsequence string, not just the length?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, using the 2D Matrix approach.</p>
                            <p>We cannot easily do this with the 1D space-optimized approach because we destroy historical paths. With the full 2D matrix, we start at the bottom-right `dp[m][n]` and backtrack. If `text1[i-1] == text2[j-1]`, we add it to our result string and move diagonally up-left. Otherwise, we move in the direction of the larger neighbor (Up or Left). Reverse the result string at the end."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "How is this related to 'Longest Palindromic Subsequence'?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It is exactly the same problem.</p>
                            <p>If you are given a string `S` and asked to find its Longest Palindromic Subsequence, you simply reverse `S` to create `S_rev`. The answer is literally just `longestCommonSubsequence(S, S_rev)`. It's a beautiful trick that lets you reuse the exact same code."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "Why did you add `if (text1.length() &lt; text2.length())` in the space-optimized solution?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To guarantee $O(\min(M, N))$ space."</p>
                            <p>The space complexity of the 1D array approach depends entirely on the string that represents the columns (the inner loop). By checking lengths at the very beginning and swapping the parameters if necessary, we mathematically guarantee that the array allocated is always based on the shorter string, minimizing RAM usage on huge mismatched inputs."</p>
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
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'calcMatch' ? 'text-emerald-400' : (st.hlPhase === 'calcMismatch' ? 'text-rose-400' : (st.hlPhase === 'eval' ? `text-${themeColor}-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Text 1</label>
                              <input type="text" value={t1Input} onChange={(e) => setT1Input(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder='abcde' maxLength={10}/>
                          </div>
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Text 2</label>
                              <input type="text" value={t2Input} onChange={(e) => setT2Input(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder='ace' maxLength={10}/>
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
                                    <div className={`text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2`}>Longest Common Subsequence Length</div>
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