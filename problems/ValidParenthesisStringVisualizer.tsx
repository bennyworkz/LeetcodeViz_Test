import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, 
  RotateCcw, ListOrdered, Lightbulb, MonitorPlay, PartyPopper,
  XCircle, Minimize, Layers as LayersIcon, ZoomIn, ZoomOut, Maximize, 
  SortAsc, AlertTriangle, Clock, Cpu, HelpCircle, Target, FastForward,
  Goal, Workflow, CheckSquare, ShieldAlert, ArrowUp, Hash, Brackets, SplitSquareHorizontal, MoveHorizontal
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  greedyMinMax: {
    id: 'greedyMinMax',
    title: '1. Greedy (Min/Max Open)',
    icon: <MoveHorizontal size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    theme: 'violet',
    code: `class Solution {
    public boolean checkValidString(String s) {
        int cmin = 0; // Minimum open parens
        int cmax = 0; // Maximum open parens
        
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            
            if (c == '(') {
                cmin++;
                cmax++;
            } else if (c == ')') {
                cmin--;
                cmax--;
            } else if (c == '*') {
                cmin--; // Treat * as )
                cmax++; // Treat * as (
            }
            
            // If max open becomes negative, it's invalid
            if (cmax < 0) return false;
            
            // We can never have negative open parentheses.
            // If cmin < 0, it means we assumed * was ), 
            // but we can just treat it as "" to fix it.
            cmin = Math.max(cmin, 0); 
        }
        
        // Valid if we can have exactly 0 open parens
        return cmin == 0;
    }
}`,
    desc: "An optimal Greedy approach. We maintain a range [cmin, cmax] representing the possible number of open '(' parentheses at any point. When we see a '(', both increase. When we see a ')', both decrease. When we see a '*', it acts as a wild card, so our range expands (cmin decreases, cmax increases). If cmax ever dips below 0, we have too many ')' and it's permanently invalid. We floor cmin at 0 because we can't have negative open parens!"
  },
  twoStacks: {
    id: 'twoStacks',
    title: '2. Two Stacks',
    icon: <LayersIcon size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    theme: 'sky',
    code: `class Solution {
    public boolean checkValidString(String s) {
        Stack<Integer> openStack = new Stack<>();
        Stack<Integer> starStack = new Stack<>();
        
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '(') {
                openStack.push(i);
            } else if (c == '*') {
                starStack.push(i);
            } else {
                if (!openStack.isEmpty()) {
                    openStack.pop();
                } else if (!starStack.isEmpty()) {
                    starStack.pop();
                } else {
                    return false; // No ( or * to match with )
                }
            }
        }
        
        // Match remaining ( with *
        while (!openStack.isEmpty() && !starStack.isEmpty()) {
            if (openStack.pop() > starStack.pop()) {
                return false; // * appeared BEFORE (, so it can't match!
            }
        }
        
        return openStack.isEmpty();
    }
}`,
    desc: "An intuitive approach using two Stacks. We store the STRING INDICES of '(' in one stack and '*' in another. When we encounter a ')', we try to pop from the '(' stack first, then the '*' stack. If both are empty, the string is invalid. At the end, we match any leftover '(' with remaining '*'. Because a '*' can only act as a ')' if it physically appears AFTER the '(', we verify that openStack.pop() < starStack.pop()!"
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'violet', idPrefix = '' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|boolean|class|return|if|else|while|for|new|String|checkValidString|Stack|Integer|openStack|starStack|cmin|cmax|charAt|length|push|pop|isEmpty|Math|max|s|c|i)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}\(\)])/g).filter(Boolean);
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
            
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'boolean', 'class', 'return', 'if', 'else', 'while', 'for', 'new', 'true', 'false'].includes(part);
            const isObject = ['Solution', 'Stack', 'Integer', 'String', 'Math'].includes(part);
            const isPointer = ['openStack', 'starStack', 'cmin', 'cmax', 's', 'c', 'i'].includes(part);
            const isMapCall = ['checkValidString', 'charAt', 'length', 'push', 'pop', 'isEmpty', 'max'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^', '{', '}', '(', ')'].includes(trimmed);
            
            // Special highlight for characters to make them pop
            let isChar = trimmed === "'('" || trimmed === "')'" || trimmed === "'*'";
            
            return (
              <span 
                key={`code-${num}-${idx}`} 
                className={
                  isChar ? 'text-amber-300 font-bold bg-amber-900/30 px-1 rounded' :
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

export default function ValidParenthesisStringVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('greedyMinMax');
  
  const [strInput, setStrInput] = useState('(*))');
  const [sArr, setSArr] = useState<string[]>(['(', '*', ')', ')']);

  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const codeContainerMainRef = useRef<HTMLDivElement>(null);
  const codeContainerFullscreenRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  // --- Effects for Data Processing ---

  const parseStringInput = (inputStr: string, fallback: string[]) => {
      let cleaned = inputStr.replace(/[^()*]/g, '');
      if (cleaned.length === 0) return fallback;
      if (cleaned.length > 20) cleaned = cleaned.substring(0, 20); // Cap
      return cleaned.split('');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSArr(parseStringInput(strInput, ['(', '*', ')', ')']));
      setCurrentStep(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [strInput, selectedOpId]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    
    let arr = [...sArr];
    
    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            arr: [...arr], ...st 
        } 
    });

    if (selectedOpId === 'greedyMinMax') {
        let cmin = 0;
        let cmax = 0;

        add("Init Function", `public boolean checkValidString(String s)`, 2, { hlPhase: 'init', cmin, cmax });
        add("Init Counters", `int cmin = 0;\nint cmax = 0;`, 4, { hlPhase: 'initCounters', cmin, cmax });

        let isSuccess = true;

        for (let i = 0; i < arr.length; i++) {
            let c = arr[i];
            
            add("Loop Next Char", `for (int i = 0; i < s.length(); i++) {\n  char c = s.charAt(i);`, 7, { hlPhase: 'loop', idx: i, char: c, cmin, cmax });

            if (c === '(') {
                add("Process '('", `if (c == '(')\nFound '('. The required number of open parens increases.`, 9, { hlPhase: 'checkOpen', idx: i, char: c, cmin, cmax });
                cmin++;
                cmax++;
                add("Update Ranges", `cmin++;\ncmax++;`, 11, { hlPhase: 'updateOpen', idx: i, char: c, cmin, cmax });
            } else if (c === ')') {
                add("Process ')'", `else if (c == ')')\nFound ')'. The required number of open parens decreases.`, 12, { hlPhase: 'checkClose', idx: i, char: c, cmin, cmax });
                cmin--;
                cmax--;
                add("Update Ranges", `cmin--;\ncmax--;`, 14, { hlPhase: 'updateClose', idx: i, char: c, cmin, cmax });
            } else if (c === '*') {
                add("Process '*'", `else if (c == '*')\nFound '*'. It acts as a wildcard!`, 15, { hlPhase: 'checkStar', idx: i, char: c, cmin, cmax });
                cmin--;
                cmax++;
                add("Expand Range", `cmin--; // Treat * as )\ncmax++; // Treat * as (\nRange expands because * gives us options.`, 17, { hlPhase: 'updateStar', idx: i, char: c, cmin, cmax });
            }

            add("Check Validity", `if (cmax < 0) return false;\nChecking if we have too many closing parentheses.`, 21, { hlPhase: 'checkCmax', idx: i, char: c, cmin, cmax });
            
            if (cmax < 0) {
                isSuccess = false;
                add("Invalid State", `cmax is ${cmax} (< 0)!\nThere are more ')' than possible '(' + '*'. The string is permanently invalid.`, 21, { hlPhase: 'failMax', idx: i, char: c, cmin, cmax, isSuccess: false });
                break;
            }

            add("Floor Minimum", `cmin = Math.max(cmin, 0);\nChecking if cmin < 0.`, 26, { hlPhase: 'checkCmin', idx: i, char: c, cmin, cmax });
            
            if (cmin < 0) {
                cmin = 0;
                add("Reset Minimum", `cmin = Math.max(cmin, 0);\nResetting cmin to 0. We assumed a '*' was ')', but it caused negative open parens. We can just treat that '*' as an empty string instead!`, 26, { hlPhase: 'resetCmin', idx: i, char: c, cmin, cmax });
            }
        }

        if (isSuccess) {
            add("Final Check", `return cmin == 0;\nLoop finished. Valid if cmin is exactly 0 (no unmatched '(' remaining).`, 30, { hlPhase: 'finalCheck', cmin, cmax });
            if (cmin === 0) {
                add("Success", `cmin == 0 is TRUE.\nThe string is perfectly valid!`, 30, { hlPhase: 'success', isSuccess: true, cmin, cmax });
            } else {
                add("Fail Leftovers", `cmin == 0 is FALSE. (cmin = ${cmin})\nThere are unmatched '(' remaining that cannot be closed.`, 30, { hlPhase: 'failLeftover', isSuccess: false, cmin, cmax });
            }
        }
    } 
    else if (selectedOpId === 'twoStacks') {
        let openStack: number[] = [];
        let starStack: number[] = [];
        
        const cloneStacks = () => ({ openStack: [...openStack], starStack: [...starStack] });

        add("Init Function", `public boolean checkValidString(String s)`, 2, { hlPhase: 'init', ...cloneStacks() });
        add("Init Stacks", `Stack<Integer> openStack = new Stack<>();\nStack<Integer> starStack = new Stack<>();`, 4, { hlPhase: 'initStacks', ...cloneStacks() });

        let isSuccess = true;

        for (let i = 0; i < arr.length; i++) {
            let c = arr[i];
            
            add("Loop Next Char", `for (int i = 0; i < s.length(); i++) {\n  char c = s.charAt(i);`, 7, { hlPhase: 'loop', idx: i, char: c, ...cloneStacks() });

            if (c === '(') {
                add("Process '('", `if (c == '(') { openStack.push(i); }`, 8, { hlPhase: 'checkOpen', idx: i, char: c, ...cloneStacks() });
                openStack.push(i);
                add("Push to Open", `openStack.push(i);\nPushed index ${i} to openStack.`, 9, { hlPhase: 'pushOpen', idx: i, char: c, ...cloneStacks() });
            } else if (c === '*') {
                add("Process '*'", `else if (c == '*') { starStack.push(i); }`, 10, { hlPhase: 'checkStar', idx: i, char: c, ...cloneStacks() });
                starStack.push(i);
                add("Push to Star", `starStack.push(i);\nPushed index ${i} to starStack.`, 11, { hlPhase: 'pushStar', idx: i, char: c, ...cloneStacks() });
            } else {
                add("Process ')'", `else { ... }\nEncountered ')'. We need to pop a match!`, 12, { hlPhase: 'checkClose', idx: i, char: c, ...cloneStacks() });
                
                add("Try Open Stack", `if (!openStack.isEmpty())`, 13, { hlPhase: 'tryOpen', idx: i, char: c, ...cloneStacks() });
                if (openStack.length > 0) {
                    let popped = openStack.pop();
                    add("Pop Open", `openStack.pop();\nPopped index ${popped} from openStack to match the ')'.`, 14, { hlPhase: 'popOpen', idx: i, char: c, poppedIdx: popped, poppedType: 'open', ...cloneStacks() });
                } else {
                    add("Try Star Stack", `else if (!starStack.isEmpty())\nopenStack is empty! Trying to use a '*' as a ')'.`, 15, { hlPhase: 'tryStar', idx: i, char: c, ...cloneStacks() });
                    if (starStack.length > 0) {
                        let popped = starStack.pop();
                        add("Pop Star", `starStack.pop();\nPopped index ${popped} from starStack to match the ')'.`, 16, { hlPhase: 'popStar', idx: i, char: c, poppedIdx: popped, poppedType: 'star', ...cloneStacks() });
                    } else {
                        isSuccess = false;
                        add("Failed to Match", `return false;\nBoth stacks are empty! No '(' or '*' available to match the ')'. Invalid!`, 18, { hlPhase: 'failMatch', idx: i, char: c, isSuccess: false, ...cloneStacks() });
                        break;
                    }
                }
            }
        }

        if (isSuccess) {
            add("End Phase 1", `Finished scanning string. Now checking for leftovers...`, 24, { hlPhase: 'endPhase1', ...cloneStacks() });

            while (openStack.length > 0 && starStack.length > 0) {
                add("Leftover Match Loop", `while (!openStack.isEmpty() && !starStack.isEmpty())`, 24, { hlPhase: 'leftoverLoop', ...cloneStacks() });
                
                let oIdx = openStack[openStack.length - 1];
                let sIdx = starStack[starStack.length - 1];
                
                add("Compare Indices", `if (openStack.pop() > starStack.pop())\nComparing topmost indices: open(${oIdx}) vs star(${sIdx})`, 25, { hlPhase: 'compareLeftovers', oIdx, sIdx, ...cloneStacks() });

                if (oIdx > sIdx) {
                    openStack.pop();
                    starStack.pop();
                    add("Invalid Leftover", `return false;\nThe '(' is at index ${oIdx}, but the '*' is at ${sIdx}. A '*' must appear AFTER a '(' to close it! Invalid!`, 26, { hlPhase: 'failLeftoverOrder', isSuccess: false, oIdx, sIdx, ...cloneStacks() });
                    isSuccess = false;
                    break;
                } else {
                    openStack.pop();
                    starStack.pop();
                    add("Valid Leftover", `The '*' is at ${sIdx}, appearing AFTER the '(' at ${oIdx}. Match valid! Popping both.`, 25, { hlPhase: 'matchLeftovers', oIdx, sIdx, ...cloneStacks() });
                }
            }

            if (isSuccess) {
                add("Final Check", `return openStack.isEmpty();\nChecking if any unmatched '(' are still trapped in the stack.`, 30, { hlPhase: 'finalCheck', ...cloneStacks() });
                if (openStack.length === 0) {
                    add("Success", `openStack.isEmpty() is TRUE.\nThe string is perfectly valid!`, 30, { hlPhase: 'success', isSuccess: true, ...cloneStacks() });
                } else {
                    add("Fail Remaining Open", `openStack.isEmpty() is FALSE.\nThere are unmatched '(' left over! Invalid!`, 30, { hlPhase: 'failRemaining', isSuccess: false, ...cloneStacks() });
                }
            }
        }
    }

    return steps;
  }, [sArr, selectedOpId]);

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
  };

  const handleNext = () => { 
    if (currentStep < trace.length - 1) setCurrentStep(prev => prev + 1); 
  };
  
  const handlePrev = () => { 
    if (currentStep > 0) setCurrentStep(prev => prev - 1); 
  };

  const toggleFullscreen = () => setIsFullscreen(prev => !prev);

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
      if (!st.arr) return null;

      let isSuccessEnd = st.hlPhase === 'success';
      let isFailEnd = st.hlPhase.startsWith('fail');

      if (selectedOpId === 'greedyMinMax') {
          return (
              <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? 'border-emerald-400 ring-4 ring-emerald-100' : (isFailEnd ? 'border-rose-400 ring-4 ring-rose-100' : 'border-violet-200')} scale-105 z-40`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Activity size={14}/> CMIN & CMAX Ranges</span>
                  
                  {isSuccessEnd || isFailEnd ? (
                      <div className="flex flex-wrap items-center justify-center gap-6 font-mono min-h-[80px] py-2 w-full">
                          <div className={`flex items-center gap-4 ${isSuccessEnd ? 'text-emerald-600 bg-emerald-50 border-emerald-300' : 'text-rose-600 bg-rose-50 border-rose-300'} font-mono font-black text-xl px-6 py-3 rounded-2xl border-2 shadow-md`}>
                              <span>{isSuccessEnd ? "Valid String!" : "Invalid String!"}</span> <ArrowRight size={24} /> <span className={`bg-white px-4 py-2 rounded-xl shadow-sm border ${isSuccessEnd ? 'border-emerald-200' : 'border-rose-200'}`}>Return {isSuccessEnd ? "true" : "false"}</span>
                          </div>
                      </div>
                  ) : st.cmin !== undefined && st.cmax !== undefined ? (
                      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full">
                          
                          {/* Char processing */}
                          {st.idx !== undefined && (
                              <>
                                  <div className="flex flex-col items-center w-[90px] animate-in zoom-in">
                                      <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-500`}>Char</span>
                                      <div className={`border-2 text-3xl font-black px-4 py-2 w-full text-center rounded-xl bg-slate-100 border-slate-400 text-slate-800 shadow-inner`}>
                                          {st.char}
                                      </div>
                                  </div>
                                  <div className="w-px h-12 bg-slate-200 hidden md:block mx-2"></div>
                              </>
                          )}

                          {/* Counters */}
                          <div className="flex gap-6 items-center">
                              <div className="flex flex-col items-center w-[110px] animate-in zoom-in">
                                  <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase.toLowerCase().includes('cmin') || st.hlPhase === 'updateOpen' || st.hlPhase === 'updateClose' || st.hlPhase === 'updateStar' ? 'text-amber-500' : 'text-slate-400'}`}>CMIN</span>
                                  <div className={`border-2 text-3xl font-black px-4 py-2 w-full text-center rounded-xl transition-colors duration-300 ${st.hlPhase.toLowerCase().includes('cmin') || st.hlPhase === 'updateOpen' || st.hlPhase === 'updateClose' || st.hlPhase === 'updateStar' ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-md scale-110' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                      {st.cmin}
                                  </div>
                              </div>

                              <div className="flex flex-col items-center justify-center text-slate-400 font-black text-2xl px-2">
                                  <span>&mdash;</span>
                              </div>

                              <div className="flex flex-col items-center w-[110px] animate-in zoom-in">
                                  <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase.toLowerCase().includes('cmax') || st.hlPhase === 'updateOpen' || st.hlPhase === 'updateClose' || st.hlPhase === 'updateStar' ? 'text-violet-500' : 'text-slate-400'}`}>CMAX</span>
                                  <div className={`border-2 text-3xl font-black px-4 py-2 w-full text-center rounded-xl transition-colors duration-300 ${st.hlPhase.toLowerCase().includes('cmax') || st.hlPhase === 'updateOpen' || st.hlPhase === 'updateClose' || st.hlPhase === 'updateStar' ? 'bg-violet-100 border-violet-400 text-violet-900 shadow-md scale-110' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                      {st.cmax}
                                  </div>
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className="flex items-center justify-center w-full min-h-[80px]">
                          <span className="text-slate-400 italic text-sm font-mono">Initializing Greedy Counters...</span>
                      </div>
                  )}
              </div>
          );
      } else {
          // Two Stacks
          return (
              <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? 'border-emerald-400 ring-4 ring-emerald-100' : (isFailEnd ? 'border-rose-400 ring-4 ring-rose-100' : 'border-slate-200')} scale-105 z-40`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Activity size={14}/> Stack Operations</span>
                  
                  {isSuccessEnd || isFailEnd ? (
                      <div className="flex flex-wrap items-center justify-center gap-6 font-mono min-h-[80px] py-2 w-full">
                          <div className={`flex items-center gap-4 ${isSuccessEnd ? 'text-emerald-600 bg-emerald-50 border-emerald-300' : 'text-rose-600 bg-rose-50 border-rose-300'} font-mono font-black text-xl px-6 py-3 rounded-2xl border-2 shadow-md`}>
                              <span>{isSuccessEnd ? "Valid String!" : "Invalid String!"}</span> <ArrowRight size={24} /> <span className={`bg-white px-4 py-2 rounded-xl shadow-sm border ${isSuccessEnd ? 'border-emerald-200' : 'border-rose-200'}`}>Return {isSuccessEnd ? "true" : "false"}</span>
                          </div>
                      </div>
                  ) : st.hlPhase?.includes('Leftover') ? (
                      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full">
                          <span className="text-sm font-bold text-sky-600 uppercase tracking-widest">Cleanup Phase</span>
                          <div className="w-px h-12 bg-slate-200 hidden md:block mx-2"></div>
                          {st.oIdx !== undefined && st.sIdx !== undefined ? (
                              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                  <div className="flex flex-col items-center">
                                      <span className="text-[10px] font-bold text-slate-500 uppercase">Open Idx</span>
                                      <span className="text-xl font-black text-sky-600">{st.oIdx}</span>
                                  </div>
                                  <span className="font-black text-slate-400 text-xl">&lt;</span>
                                  <div className="flex flex-col items-center">
                                      <span className="text-[10px] font-bold text-slate-500 uppercase">Star Idx</span>
                                      <span className="text-xl font-black text-amber-500">{st.sIdx}</span>
                                  </div>
                                  <ArrowRight size={20} className="text-slate-300 mx-2"/>
                                  {st.oIdx < st.sIdx ? (
                                      <span className="text-emerald-500 font-black uppercase text-sm tracking-widest bg-emerald-50 px-2 py-1 rounded border border-emerald-200">Valid</span>
                                  ) : (
                                      <span className="text-rose-500 font-black uppercase text-sm tracking-widest bg-rose-50 px-2 py-1 rounded border border-rose-200">Invalid</span>
                                  )}
                              </div>
                          ) : (
                              <span className="text-slate-400 italic text-sm">Checking remaining stacks...</span>
                          )}
                      </div>
                  ) : st.idx !== undefined ? (
                      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full">
                          <div className="flex flex-col items-center w-[90px] animate-in zoom-in">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-500`}>Char</span>
                              <div className={`border-2 text-3xl font-black px-4 py-2 w-full text-center rounded-xl bg-slate-100 border-slate-400 text-slate-800 shadow-inner`}>
                                  {st.char}
                              </div>
                          </div>
                          
                          <div className="w-px h-12 bg-slate-200 hidden md:block mx-2"></div>
                          
                          <div className="flex flex-col items-center min-w-[160px]">
                              <span className={`text-[9px] font-bold uppercase text-slate-400 mb-1`}>Stack Action</span>
                              {st.hlPhase.includes('push') ? (
                                  <div className={`flex flex-col items-center justify-center h-full w-full ${st.hlPhase === 'pushOpen' ? 'bg-sky-50 border-sky-300 text-sky-800' : 'bg-amber-50 border-amber-300 text-amber-800'} rounded-xl border-2 font-bold text-[10px] uppercase tracking-widest shadow-sm animate-pulse px-4 py-2 text-center`}>
                                      PUSH INDEX {st.idx} &rarr; {st.hlPhase === 'pushOpen' ? 'OPEN' : 'STAR'}
                                  </div>
                              ) : st.hlPhase.includes('pop') ? (
                                  <div className={`flex flex-col items-center justify-center h-full w-full ${st.hlPhase === 'popOpen' ? 'bg-sky-100 border-sky-400 text-sky-900' : 'bg-amber-100 border-amber-400 text-amber-900'} rounded-xl border-2 font-bold text-[10px] uppercase tracking-widest shadow-sm animate-pulse px-4 py-2 text-center scale-110`}>
                                      &larr; POP INDEX {st.poppedIdx} FROM {st.hlPhase === 'popOpen' ? 'OPEN' : 'STAR'}
                                  </div>
                              ) : (
                                  <div className="flex items-center justify-center h-full w-full bg-slate-100 rounded-xl border border-slate-200 text-slate-400 font-bold text-xs uppercase tracking-widest px-4 py-2 text-center">
                                      Evaluating...
                                  </div>
                              )}
                          </div>
                      </div>
                  ) : (
                      <div className="flex items-center justify-center w-full min-h-[80px]">
                          <span className="text-slate-400 italic text-sm font-mono">Initializing Stacks...</span>
                      </div>
                  )}
              </div>
          );
      }
  };

  const renderVisuals = () => {
      if (!st.arr) return <span className="text-slate-400 italic mt-10">Initializing Variables...</span>;

      const nodeWidth = 48;
      const nodeGap = 12;
      const totalColWidth = nodeWidth + nodeGap;
      const containerWidth = st.arr.length * totalColWidth;

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-auto relative pt-4 px-4 pb-12 overflow-x-hidden">
              
              {/* Dynamic State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40">
                  {renderActiveDashboard()}
              </div>

              {/* String Visualization Container */}
              <div className="flex flex-col items-center justify-center w-full max-w-5xl mt-4">
                  <span className="text-slate-400 font-black font-mono tracking-widest uppercase text-sm mb-6 flex items-center gap-2"><ListOrdered size={16}/> Input String (Indices)</span>
                  
                  <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-200 w-full justify-center px-4">
                      {st.arr.map((char: string, idx: number) => {
                          
                          let isActive = st.idx === idx && !st.isSuccess && !st.hlPhase?.startsWith('failLeftover') && !st.hlPhase?.startsWith('leftoverLoop') && !st.hlPhase?.startsWith('compareLeftovers') && !st.hlPhase?.startsWith('matchLeftovers') && !st.hlPhase?.startsWith('finalCheck') && !st.hlPhase?.startsWith('failRemaining');
                          
                          let isPoppedOpenMatch = selectedOpId === 'twoStacks' && st.hlPhase === 'popOpen' && st.poppedIdx === idx;
                          let isPoppedStarMatch = selectedOpId === 'twoStacks' && st.hlPhase === 'popStar' && st.poppedIdx === idx;
                          
                          let isCleanupO = selectedOpId === 'twoStacks' && st.oIdx === idx;
                          let isCleanupS = selectedOpId === 'twoStacks' && st.sIdx === idx;

                          let bgClass = "bg-white border-slate-300 text-slate-500 shadow-sm";
                          let scaleClass = "scale-100";

                          if (isActive) {
                              bgClass = "bg-slate-800 border-slate-900 text-white shadow-xl ring-4 ring-slate-300";
                              scaleClass = "scale-110 z-20";
                          } else if (isPoppedOpenMatch || isCleanupO) {
                              bgClass = "bg-sky-400 border-sky-600 text-white shadow-lg ring-4 ring-sky-200";
                              scaleClass = "scale-110 z-20 animate-pulse";
                          } else if (isPoppedStarMatch || isCleanupS) {
                              bgClass = "bg-amber-400 border-amber-600 text-amber-950 shadow-lg ring-4 ring-amber-200";
                              scaleClass = "scale-110 z-20 animate-pulse";
                          } else if (st.hlPhase?.startsWith('fail') && isActive) {
                              bgClass = "bg-rose-500 border-rose-600 text-white shadow-xl ring-4 ring-rose-200";
                              scaleClass = "scale-110 z-20 animate-bounce";
                          }

                          if (st.isSuccess) {
                              bgClass = "bg-emerald-50 border-emerald-300 text-emerald-700 opacity-80";
                          }

                          return (
                              <div key={`char-${idx}`} className={`shrink-0 flex flex-col items-center transition-all duration-300 ${scaleClass}`}>
                                  {isActive && !st.isSuccess && !st.hlPhase?.startsWith('fail') && (
                                      <span className="text-[10px] font-black uppercase text-slate-800 tracking-widest mb-2 animate-bounce">i</span>
                                  )}
                                  {(isPoppedOpenMatch || isPoppedStarMatch) && (
                                      <span className={`text-[10px] font-black uppercase ${isPoppedOpenMatch ? 'text-sky-600' : 'text-amber-600'} tracking-widest mb-2 animate-bounce`}>Match</span>
                                  )}
                                  
                                  <div className={`w-14 h-16 border-[3px] rounded-xl flex flex-col items-center justify-center relative ${bgClass}`}>
                                      <span className="font-mono font-black text-2xl">{char}</span>
                                  </div>
                                  <span className="text-[10px] font-mono text-slate-400 mt-2 font-bold">{idx}</span>
                              </div>
                          )
                      })}
                  </div>
              </div>

              {/* Data Structures */}
              {selectedOpId === 'twoStacks' && st.openStack && (
                  <div className="flex flex-col md:flex-row items-stretch justify-center w-full max-w-4xl mt-8 gap-8 px-4">
                      
                      {/* Open Stack */}
                      <div className="bg-sky-50 border-2 border-sky-200 shadow-inner rounded-3xl p-6 flex flex-col items-center w-full md:w-64 shrink-0 transition-all duration-300">
                          <span className="text-sky-600 font-black font-mono tracking-widest uppercase text-xs mb-4 flex items-center gap-2">openStack <span className="text-sky-400 font-normal">{'('}</span></span>
                          
                          <div className="flex flex-col-reverse gap-2 w-full h-[200px] overflow-y-auto border-x-4 border-b-4 border-sky-300 rounded-b-2xl p-2 bg-sky-100/50 scrollbar-none items-center">
                              {st.openStack.map((val: number, idx: number) => {
                                  let isTop = idx === st.openStack.length - 1;
                                  let isPopped = st.hlPhase === 'popOpen';
                                  return (
                                      <div key={`openStack-${idx}`} className={`w-[90%] bg-sky-500 text-white font-mono font-black text-sm py-2 rounded-lg text-center shadow-sm border border-sky-600 transition-all duration-300 ${isTop && isPopped ? 'scale-110 ring-4 ring-rose-300 opacity-50 translate-y-4' : 'scale-100'}`}>
                                          Idx: {val}
                                      </div>
                                  );
                              })}
                              {st.openStack.length === 0 && <span className="text-sky-400/60 font-mono italic text-xs my-auto">Empty</span>}
                          </div>
                      </div>

                      {/* Star Stack */}
                      <div className="bg-amber-50 border-2 border-amber-200 shadow-inner rounded-3xl p-6 flex flex-col items-center w-full md:w-64 shrink-0 transition-all duration-300">
                          <span className="text-amber-600 font-black font-mono tracking-widest uppercase text-xs mb-4 flex items-center gap-2">starStack <span className="text-amber-400 font-normal">{'*'}</span></span>
                          
                          <div className="flex flex-col-reverse gap-2 w-full h-[200px] overflow-y-auto border-x-4 border-b-4 border-amber-300 rounded-b-2xl p-2 bg-amber-100/50 scrollbar-none items-center">
                              {st.starStack.map((val: number, idx: number) => {
                                  let isTop = idx === st.starStack.length - 1;
                                  let isPopped = st.hlPhase === 'popStar';
                                  return (
                                      <div key={`starStack-${idx}`} className={`w-[90%] bg-amber-500 text-white font-mono font-black text-sm py-2 rounded-lg text-center shadow-sm border border-amber-600 transition-all duration-300 ${isTop && isPopped ? 'scale-110 ring-4 ring-rose-300 opacity-50 translate-y-4' : 'scale-100'}`}>
                                          Idx: {val}
                                      </div>
                                  );
                              })}
                              {st.starStack.length === 0 && <span className="text-amber-400/60 font-mono italic text-xs my-auto">Empty</span>}
                          </div>
                      </div>

                  </div>
              )}

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
                <Brackets className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Valid Parenthesis String</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      String Parsing
                  </span>
                  <span>•</span>
                  <span>LeetCode 678</span>
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
                        <p>Given a string <code>s</code> containing only three types of characters: <code>'('</code>, <code>')'</code> and <code>'*'</code>, return <code>true</code> if <code>s</code> is valid.</p>
                        <p>The following rules define a valid string:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Any left parenthesis <code>'('</code> must have a corresponding right parenthesis <code>')'</code>.</li>
                            <li>Any right parenthesis <code>')'</code> must have a corresponding left parenthesis <code>'('</code>.</li>
                            <li>Left parenthesis <code>'('</code> must go before the corresponding right parenthesis <code>')'</code>.</li>
                            <li><strong><code>'*'</code> could be treated as a single right parenthesis <code>')'</code> or a single left parenthesis <code>'('</code> or an empty string <code>""</code>.</strong></li>
                        </ul>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> s = "(*))"</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">true</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs leading-relaxed block">
                                The '*' acts as a '(' to match the extra ')'. Making the string "(())".
                            </span>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4 max-w-2xl">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li><code>1 &le; s.length &le; 100</code></li>
                            <li><code>s[i]</code> is <code>'('</code>, <code>')'</code> or <code>'*'</code>.</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Goal size={16} className="text-violet-500"/> Greedy Concept</h5>
                        <p className="text-sm leading-relaxed text-slate-600">Since `*` can be three things (open, close, or empty), we can't maintain a single 'open counter' like a normal parenthesis problem. Instead, we maintain a <strong>range</strong> of possible open parentheses: <code>[cmin, cmax]</code>. If we see a `*`, it could increase our open count (cmax++) or decrease it (cmin--). If cmax ever drops below 0, it's invalid. If cmin drops below 0, we just floor it to 0.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><LayersIcon size={16} className={`text-sky-500`}/> Stacks Concept</h5>
                        <p className="text-sm leading-relaxed text-slate-600">Alternatively, we can use two stacks to store the INDICES of `(` and `*`. When we see a `)`, we pop from the `(` stack first, then the `*` stack. At the end, we match leftovers. Crucially, a `*` can only act as a closing parenthesis if it appears physically AFTER the `(` in the string (i.e. its index is greater). This is why storing indices is required!</p>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Input String (Max 20 chars)</label>
                            <input type="text" value={strInput} onChange={(e) => setStrInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-slate-900 tracking-widest`} placeholder="(*))" />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100 mt-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess === true || st.isSuccess === false} className={`px-8 py-3 bg-${themeColor}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden shrink-0 ${st.isSuccess === true ? 'bg-emerald-900 border-emerald-800' : (st.isSuccess === false ? 'bg-rose-900 border-rose-800' : 'bg-slate-900 border-slate-800')}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess === true ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> VALID STRING</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">The string parentheses perfectly matched.</p>
                         </div>
                    ) : st.isSuccess === false ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-rose-400 flex items-center gap-3"><XCircle size={24}/> INVALID STRING</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Parentheses matching failed.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase?.includes('Open') ? 'text-sky-400' : (st.hlPhase?.includes('Star') ? 'text-amber-400' : (st.hlPhase?.includes('Close') ? 'text-rose-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding Min/Max Range Tracking and Physical Index Constraints.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><MoveHorizontal size={24} className={`text-violet-500`}/> 1. The Greedy Range Concept</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">In a standard valid parenthesis problem, we track the number of open parens <code>count</code>. If we see a <code>(</code>, we do <code>count++</code>. If we see a <code>)</code>, we do <code>count--</code>.</p>
                        <p className="text-slate-600 leading-relaxed">Because the <code>*</code> acts as a wildcard, the exact count of open parens branches into multiple parallel realities. Instead of tracking all possible branches, we track the <strong>minimum</strong> (<code>cmin</code>) and <strong>maximum</strong> (<code>cmax</code>) possible open parens. When we hit a <code>*</code>, we branch the range: <code>cmin--</code> (pretend it's a closing) and <code>cmax++</code> (pretend it's an opening).</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowUp size={24} className="text-sky-500"/> 2. Why Floor `cmin` at 0?</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">If <code>cmax &lt; 0</code>, it means that even if we turned every single <code>*</code> into an open parenthesis, we STILL have too many closing parentheses. The string is hopelessly broken, so we return false.</p>
                        <p className="text-slate-600 leading-relaxed">But what if <code>cmin &lt; 0</code>? This means that we eagerly turned a <code>*</code> into a closing parenthesis, but we didn't actually have a matching open parenthesis before it. Instead of failing, we can just "go back in time" and treat that <code>*</code> as an empty string instead! We enforce this logically by simply resetting <code>cmin = 0</code>.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Greedy Time/Space:</strong> We iterate over the string exactly once performing arithmetic operations. Time: <strong>O(N)</strong>. We only use two integer counters (cmin, cmax). Space: <strong>O(1)</strong>.</li>
                            <li><strong>Two Stacks Time/Space:</strong> We iterate through the string pushing and popping elements from two stacks. The final cleanup loops through the remaining stack elements. Time: <strong>O(N)</strong>. We allocate stacks that could potentially store all N indices. Space: <strong>O(N)</strong>.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a common FAANG problem. The Two-Stack solution is easier to derive in a high-pressure interview, but the O(1) Space Greedy solution shows mastery of state-space reduction."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "In the Two Stacks approach, why do we store INDICES instead of just counters?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because sequence ordering matters physically."</p>
                            <p>Consider the string <code>*(</code>. If we just counted, we would end up with 1 open parenthesis and 1 star. We might assume they cancel each other out. However, a <code>*</code> can only act as a closing parenthesis if it appears AFTER the opening parenthesis. By storing indices, we can verify that <code>openStack.pop() &lt; starStack.pop()</code>.</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q2: "In the Greedy approach, why do we return `cmin == 0` instead of `true` at the end?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To ensure all required open parentheses were actually closed."</p>
                            <p>If we finish the string and <code>cmin</code> is 2, it means that even if we used every single <code>*</code> to act as a closing parenthesis, we STILL have 2 unmatched open parentheses sitting around. The string is invalid. Returning <code>cmin == 0</code> asserts that it was mathematically possible to close everything.</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Cpu size={24}/></span>
                            <span>Q3: "Could you solve this using Dynamic Programming (Memoization)?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, but it takes O(N^2) space and time."</p>
                            <p>You can write a recursive function <code>dfs(index, openCount)</code>. When encountering a <code>*</code>, you recursively branch three times: <code>dfs(i+1, count+1) || dfs(i+1, count-1) || dfs(i+1, count)</code>. Memoizing this state requires an $N \times N$ matrix. It works, but it is vastly inferior to the $O(1)$ space Greedy trick.</p>
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
                    
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 mb-4 ${st.isSuccess === true ? 'bg-emerald-900/40 border-emerald-800' : (st.isSuccess === false ? 'bg-rose-900/40 border-rose-800' : 'bg-slate-800/40 border-slate-700')}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase?.includes('Open') ? 'text-sky-400' : (st.hlPhase?.includes('Star') ? 'text-amber-400' : (st.hlPhase?.includes('Close') || st.hlPhase?.startsWith('fail') ? 'text-rose-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600 block`}>Input String</label>
                              <input type="text" value={strInput} onChange={(e) => setStrInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-slate-900 tracking-widest`} placeholder="(*))" />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><RotateCcw size={24}/></button>
                            <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-3 text-slate-600 hover:text-rose-600 rounded-lg transition-colors`}><Minimize size={24}/></button>
                        </div>
                  </div>

                  {!st.isSuccess && st.isSuccess !== false && (
                      <div className="absolute bottom-10 right-10 z-50 flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess === true || st.isSuccess === false} className={`px-12 py-6 bg-${themeColor}-600 text-white rounded-[2rem] hover:bg-${themeColor}-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-${themeColor}-500 shadow-xl`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  <div className="flex-1 w-full h-full flex flex-col pt-32 pb-10 px-10 overflow-y-auto">
                       {renderVisuals()}
                  </div>

                  {(st.isSuccess === true || st.isSuccess === false) && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.isSuccess ? 'border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]' : 'border-rose-500 shadow-[0_0_150px_rgba(244,63,94,0.3)]'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.isSuccess ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ${st.isSuccess ? 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10' : 'bg-rose-500/20 text-rose-500 ring-rose-500/10'}`}>
                                    {st.isSuccess ? <PartyPopper size={48}/> : <XCircle size={48}/>}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">{st.isSuccess ? "VALID STRING!" : "INVALID STRING!"}</h2>
                                <p className={`font-mono text-xs uppercase mb-8 tracking-widest opacity-60 ${st.isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>{st.isSuccess ? "Parentheses matched perfectly." : `Failed matching process`}</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${st.isSuccess ? 'text-emerald-500' : 'text-rose-500'}`}>Final Result</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center gap-2">{st.isSuccess ? 'true' : 'false'}</div>
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