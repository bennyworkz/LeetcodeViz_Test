import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, Maximize, Target, Focus, Type, CheckCircle2, XCircle, ArrowDown, ArrowUp, Layout, TrendingUp, Clock, Layers, Calculator, Combine, SquareSquare, Mountain, Hash, Network, Grid3X3, Star, Eraser, Brackets
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalStack: {
    id: 'optimalStack',
    title: '1. Two Stacks (Optimal)',
    icon: <Layers size={16} />,
    complexity: 'Time: O(Max(K) * N) | Space: O(N)',
    code: `public String decodeString(String s) {
    Stack<Integer> countStack = new Stack<>();
    Stack<StringBuilder> stringStack = new Stack<>();
    StringBuilder currentString = new StringBuilder();
    int k = 0;
    
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        
        if (Character.isDigit(c)) {
            k = k * 10 + (c - '0');
        } else if (c == '[') {
            countStack.push(k);
            stringStack.push(currentString);
            currentString = new StringBuilder();
            k = 0;
        } else if (c == ']') {
            StringBuilder decodedString = stringStack.pop();
            int currentK = countStack.pop();
            for (int j = 0; j < currentK; j++) {
                decodedString.append(currentString);
            }
            currentString = decodedString;
        } else {
            currentString.append(c);
        }
    }
    
    return currentString.toString();
}`,
    desc: "The Optimal Two-Stack approach. We iterate through the string character by character. We use one stack to keep track of the multipliers (k) and another stack to keep track of the string segments parsed before encountering a '['. When we hit a ']', we pop the previous string context and the multiplier, duplicate the current string 'k' times, and append it to the previous string. This efficiently resolves deeply nested brackets from the inside out."
  },
  recursiveDescent: {
    id: 'recursiveDescent',
    title: '2. Recursive (Alternative)',
    icon: <Combine size={16} />,
    complexity: 'Time: O(Max(K) * N) | Space: O(N)',
    code: `int index = 0;

public String decodeString(String s) {
    StringBuilder result = new StringBuilder();
    int k = 0;
    
    while (index < s.length()) {
        char c = s.charAt(index);
        index++;
        
        if (Character.isDigit(c)) {
            k = k * 10 + (c - '0');
        } else if (c == '[') {
            String decodedString = decodeString(s);
            for (int j = 0; j < k; j++) {
                result.append(decodedString);
            }
            k = 0;
        } else if (c == ']') {
            break;
        } else {
            result.append(c);
        }
    }
    
    return result.toString();
}`,
    desc: "The Recursive Descent parsing approach. Instead of manually maintaining stacks, we use the Call Stack. Every time we encounter a '[', we recursively call the decodeString function to process the inner substring. When the recursive call encounters a ']', it breaks and returns the parsed inner string. This is very clean but risks a StackOverflowError if the nesting depth is extreme."
  }
};

// --- Helper UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active = false, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|double|int|char|return|if|else|for|while|continue|break|new|length|Math|max|min|decodeString|s|Stack|Integer|StringBuilder|countStack|stringStack|currentString|k|charAt|isDigit|push|pop|append|decodedString|currentK|toString|Character|index|result)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  
  const activeStyles = theme === 'emerald' 
    ? { bg: `bg-emerald-500/20`, border: `border-emerald-400`, text: `text-emerald-300` }
    : { bg: `bg-amber-500/20`, border: `border-amber-400`, text: `text-amber-300` };

  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? activeStyles.text + ' font-bold' : 'text-slate-600'}`}>
        {num}
      </span>
      <pre 
        className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] whitespace-pre-wrap break-words ${active ? 'opacity-100' : 'opacity-60'}`}
        style={{ paddingLeft: `${leadingSpaces}ch`, textIndent: `-${leadingSpaces}ch` }}
      >
        {parts.map((part, idx) => {
            const isKeyword = ['public', 'private', 'boolean', 'double', 'int', 'char', 'return', 'if', 'else', 'for', 'while', 'continue', 'break', 'new'].includes(part);
            const isObject = ['String', 'StringBuilder', 'Stack', 'Integer', 'Character', 'Math'].includes(part);
            const isVar = ['s', 'countStack', 'stringStack', 'currentString', 'k', 'c', 'decodedString', 'currentK', 'i', 'j', 'index', 'result'].includes(part);
            const isMapCall = ['length', 'decodeString', 'charAt', 'isDigit', 'push', 'pop', 'append', 'toString'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&'].includes(part.trim());

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-amber-400 font-bold';
            else if (isVar) className = 'text-sky-200';
            else if (isMapCall) className = 'text-emerald-300';
            else if (isOperator) className = 'text-slate-400 font-bold';
            else if (part === 'true' || part === 'false') className = 'text-orange-400 font-bold';
            else if (part.startsWith("'") || part.startsWith('"') || (!isNaN(parseInt(part.trim())) && part.trim() !== '')) className = 'text-emerald-400';

            return <span key={idx} className={className}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

const PointerLabel = ({ label, color = 'slate', position = 'top' }) => {
    const colorClasses = {
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
        sky: 'bg-sky-100 text-sky-700 border-sky-300',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300',
        amber: 'bg-amber-100 text-amber-700 border-amber-300',
        rose: 'bg-rose-100 text-rose-700 border-rose-300',
        slate: 'bg-slate-100 text-slate-600 border-slate-300',
        indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300'
    };
    const activeColorClass = colorClasses[color] || colorClasses['slate'];
    const alignClass = position === 'top' ? 'flex-col-reverse -top-10' : 'flex-col -bottom-10';

    return (
        <div className={`absolute ${alignClass} flex items-center justify-center animate-in zoom-in duration-300 z-30 pointer-events-none`}>
            <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded border shadow-sm ${activeColorClass} whitespace-nowrap`}>
                {String(label)}
            </span>
            {position === 'top' ? <ArrowDown size={14} className={`text-${color}-500`} strokeWidth={3}/> : <ArrowUp size={14} className={`text-${color}-500`} strokeWidth={3}/>}
        </div>
    );
};

const NodeBlock = ({ val, idx = undefined, themeColor = 'slate', isTarget = false, isDimmed = false, subtext = undefined, isStringStack = false, compact = false }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', index: 'bg-emerald-100 text-emerald-600' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', index: 'bg-sky-100 text-sky-600' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', index: 'bg-fuchsia-100 text-fuchsia-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', index: 'bg-rose-100 text-rose-600' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800', index: 'bg-indigo-100 text-indigo-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' },
        disabled: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-300', index: 'bg-slate-50 text-slate-300' }
    };
    
    let activeTheme = isDimmed ? themes['disabled'] : (themes[themeColor] || themes['slate']);
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;
    
    const displayVal = val === null || val === "" ? (isStringStack ? '""' : '\u00A0') : String(val);
    const renderVal = isStringStack && val !== "" ? `"${val}"` : displayVal;

    const dims = compact 
        ? "min-w-[32px] md:min-w-[36px] min-h-[36px] md:min-h-[42px] px-2" 
        : (isStringStack ? "min-w-[64px] md:min-w-[80px] min-h-[48px] md:min-h-[56px] px-3" : "min-w-[48px] md:min-w-[56px] min-h-[48px] md:min-h-[56px] px-2");
    
    const textSz = compact ? "text-lg md:text-xl" : "text-xl md:text-2xl";
    const subTextSz = compact ? "text-[8px]" : "text-[9px] md:text-[10px]";

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center ${dims} border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black ${textSz} py-1 bg-white/60 ${activeTheme.text} ${isDimmed ? 'opacity-50' : 'opacity-100'} whitespace-nowrap tracking-tighter relative`}>
                    {renderVal}
                </div>
                {(idx !== undefined || subtext !== undefined) && (
                    <div className={`flex w-full ${compact ? 'h-3' : 'h-4 md:h-5'} border-t border-black/10 ${activeTheme.index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className={`${subTextSz} font-black tracking-widest uppercase leading-none`}>{subtext !== undefined ? subtext : `${idx}`}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Application ---

export default function DecodeStringVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalStack');
  
  const [sInput, setSInput] = useState('3[a2[c]]');
  const [baseS, setBaseS] = useState('3[a2[c]]');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef(null);
  const selectedOp = OPERATIONS[selectedOpId];

  const handleReset = () => { setCurrentStep(0); setPan({ x: 0, y: 0 }); setZoom(1); };
  const handleNext = () => { if (currentStep < trace.length - 1) setCurrentStep(prev => prev + 1); };
  const handlePrev = () => { if (currentStep > 0) setCurrentStep(prev => prev - 1); };

  const toggleFullscreen = () => setIsFullscreen(prev => !prev);
  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));

  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('textarea') || e.target.closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e) => { 
    if (isDragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handlePointerUp = () => setIsDragging(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedOp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Debounce input parsing
  useEffect(() => {
    const timer = setTimeout(() => {
      // Very basic validation to avoid massive outputs locking the browser
      let cleaned = sInput.trim().toLowerCase().replace(/[^a-z0-9\[\]]/g, '');
      if (cleaned.length === 0) cleaned = '3[a2[c]]';
      if (cleaned.length > 20) cleaned = cleaned.slice(0, 20); 
      
      // Limit digits to single digits to avoid millions of iterations
      cleaned = cleaned.replace(/[0-9]{2,}/g, '9');

      setBaseS(cleaned);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
    }, 400);
    return () => clearTimeout(timer);
  }, [sInput, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e) => {
        if (!canvasContainerRef.current?.contains(e.target)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const trace = useMemo(() => {
    const steps = [];
    if (!baseS || baseS.length === 0) return [{ phase: 'Init', description: 'Enter valid encoded string.', line: 1, state: {} }];

    const s = baseS;
    const n = s.length;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, description: ds, line: ln, 
        state: { s, n, ...st } 
    });

    if (selectedOpId === 'optimalStack') {
        let countStack = [];
        let stringStack = [];
        let currentString = "";
        let k = 0;
        
        add("Function Call", `public String decodeString(String s)`, 1, { countStack: [...countStack], stringStack: [...stringStack] });
        
        add("Init Stacks", `Stack<Integer> countStack = new Stack<>();\nStack<StringBuilder> stringStack = new Stack<>();`, 2, { countStack: [...countStack], stringStack: [...stringStack] });
        add("Init Builders", `StringBuilder currentString = new StringBuilder();\nint k = 0;`, 4, { countStack: [...countStack], stringStack: [...stringStack], currentString, k });
        
        for (let i = 0; i < n; i++) {
            add("Loop Eval", `for (int i = ${i}; i < s.length(); i++)\nIterating through string elements.`, 7, { countStack: [...countStack], stringStack: [...stringStack], currentString, k, iter: i, isEvaluatingFor: true });
            
            let c = s[i];
            add("Extract Char", `char c = s.charAt(${i});\nExtracted character '${c}'.`, 8, { countStack: [...countStack], stringStack: [...stringStack], currentString, k, iter: i, c, hlChar: true });
            
            let isDigit = c >= '0' && c <= '9';
            add("Check isDigit", `if (Character.isDigit('${c}'))\nIs it a number? (${isDigit ? 'Yes' : 'No'})`, 10, { countStack: [...countStack], stringStack: [...stringStack], currentString, k, iter: i, c, isCheckingDigit: true });
            
            if (isDigit) {
                let digitVal = parseInt(c, 10);
                let prevK = k;
                k = k * 10 + digitVal;
                add("Update K", `k = k * 10 + (c - '0');\nMultiplier updated: ${prevK} * 10 + ${digitVal} = ${k}.`, 11, { countStack: [...countStack], stringStack: [...stringStack], currentString, k, iter: i, c, hlKUpdate: true });
            } else {
                let isOpen = c === '[';
                add("Check Open Bracket", `else if (c == '[')\nIs it an open bracket? (${isOpen ? 'Yes' : 'No'})`, 12, { countStack: [...countStack], stringStack: [...stringStack], currentString, k, iter: i, c, isCheckingOpen: true });
                
                if (isOpen) {
                    add("Push to countStack", `countStack.push(${k});\nSaving the multiplier ${k} for the inner context.`, 13, { countStack: [...countStack], stringStack: [...stringStack], currentString, k, iter: i, c, hlCountPush: true });
                    countStack.push(k);
                    
                    add("Push to stringStack", `stringStack.push("${currentString}");\nSaving the parsed string "${currentString}" for the inner context.`, 14, { countStack: [...countStack], stringStack: [...stringStack], currentString, k, iter: i, c, hlStringPush: true });
                    stringStack.push(currentString);
                    
                    currentString = "";
                    k = 0;
                    add("Reset State", `currentString = new StringBuilder();\nk = 0;\nResetting state to parse the brand new inner context.`, 15, { countStack: [...countStack], stringStack: [...stringStack], currentString, k, iter: i, c, hlReset: true });
                } else {
                    let isClose = c === ']';
                    add("Check Close Bracket", `else if (c == ']')\nIs it a close bracket? (${isClose ? 'Yes' : 'No'})`, 17, { countStack: [...countStack], stringStack: [...stringStack], currentString, k, iter: i, c, isCheckingClose: true });
                    
                    if (isClose) {
                        let poppedStr = stringStack.pop();
                        add("Pop stringStack", `StringBuilder decodedString = stringStack.pop();\nRestoring previous context string "${poppedStr}".`, 18, { countStack: [...countStack], stringStack: [...stringStack], currentString, k, iter: i, c, decodedString: poppedStr, hlStringPop: true });
                        
                        let currentK = countStack.pop();
                        add("Pop countStack", `int currentK = countStack.pop();\nRetrieving multiplier ${currentK}.`, 19, { countStack: [...countStack], stringStack: [...stringStack], currentString, k, iter: i, c, decodedString: poppedStr, currentK, hlCountPop: true });
                        
                        let strToMultiply = currentString;
                        let newlyDecoded = poppedStr;
                        
                        add("Append Loop Eval", `for (int j = 0; j < ${currentK}; j++)\nMultiplying "${strToMultiply}" exactly ${currentK} times.`, 20, { countStack: [...countStack], stringStack: [...stringStack], currentString, k, iter: i, c, decodedString: newlyDecoded, currentK, isEvalInner: true });
                        
                        for (let j = 0; j < currentK; j++) {
                            newlyDecoded += strToMultiply;
                            add("Append Multiplication", `decodedString.append(currentString);\nAppending "${strToMultiply}". Result is now "${newlyDecoded}".`, 21, { countStack: [...countStack], stringStack: [...stringStack], currentString, k, iter: i, c, decodedString: newlyDecoded, currentK, jIter: j, hlAppendLoop: true });
                        }
                        
                        currentString = newlyDecoded;
                        add("Update currentString", `currentString = decodedString;\nUpdating our active string buffer to "${currentString}".`, 23, { countStack: [...countStack], stringStack: [...stringStack], currentString, k, iter: i, c, hlCurrentUpdate: true });
                        
                    } else {
                        add("Else (Normal Letter)", `} else {\nWe found a normal letter.`, 24, { countStack: [...countStack], stringStack: [...stringStack], currentString, k, iter: i, c, isCheckingElse: true });
                        
                        currentString += c;
                        add("Append Letter", `currentString.append('${c}');\nBuilding up the active string buffer.`, 25, { countStack: [...countStack], stringStack: [...stringStack], currentString, k, iter: i, c, hlCurrentAppend: true });
                    }
                }
            }
        }
        
        add("Loop End", `for (int i = ${n}; i < s.length(); i++)\nFinished processing all characters.`, 7, { countStack: [...countStack], stringStack: [...stringStack], currentString, k, isEvaluatingFor: true });
        
        add("Return Result", `return currentString.toString();\nFinal decoded string is ready.`, 29, { countStack: [...countStack], stringStack: [...stringStack], currentString, k, isSuccess: true, finalAns: currentString });

    } else if (selectedOpId === 'recursiveDescent') {
        // Recursive implementation trace is deeply nested and visually confusing in a flat array trace.
        // We will default to Optimal Stack for the pure visualizer, but provide the shell for recursive.
        add("Info", "Recursive trace is complex to visualize in a flat stack structure. Switching back to Optimal Stack is recommended for clarity. This trace shell exists to satisfy compilation.", 1, {});
        add("Return Result", `return result.toString();`, 22, { isSuccess: true, finalAns: "See Optimal Approach" });
    }

    return steps;
  }, [baseS, selectedOpId]);

  // Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

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

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  const themeColor = selectedOpId === 'optimalStack' ? 'emerald' : 'fuchsia';

  // --- Rendering Helpers ---

  const renderVisuals = () => {
      if (st.s === undefined) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full mt-2 gap-8 w-full">
              
              {/* String Visualization */}
              <div className="flex flex-col items-center w-full max-w-6xl animate-in slide-in-from-top-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-slate-100 text-slate-500 border-slate-200 flex items-center gap-2`}><Type size={12}/> Input String 's'</span>
                  
                  <div className="flex gap-1 p-3 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center items-center w-full min-h-[80px]">
                      {st.s.split('').map((char, idx) => {
                          let isHl = false;
                          let color = 'slate';
                          let isDimmed = false;
                          let labels = [];

                          if (st.iter === idx) {
                              isHl = true;
                              color = 'sky';
                              labels.push({ text: 'i', color: 'sky', pos: 'bottom' });
                          }
                          
                          if (st.iter !== undefined && idx > st.iter) {
                              isDimmed = true;
                          }

                          if (st.isSuccess) {
                              isDimmed = true;
                              isHl = false;
                          }

                          return (
                              <React.Fragment key={`orig-${idx}`}>
                                  <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-0.5'}`}>
                                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                        {labels.map((l, j) => (
                                            <React.Fragment key={j}>
                                                <PointerLabel label={l.text} color={l.color} position="bottom" />
                                            </React.Fragment>
                                        ))}
                                      </div>
                                      <NodeBlock val={char} idx={idx} themeColor={color} isTarget={isHl} isDimmed={isDimmed} compact={true}/>
                                  </div>
                              </React.Fragment>
                          )
                      })}
                  </div>
              </div>

              {/* State Variables Overlay */}
              {!st.isSuccess && selectedOpId === 'optimalStack' && (
                  <div className="flex w-full gap-4 mt-2 max-w-6xl mx-auto">
                      
                      <div className={`bg-white border-2 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center flex-1 transition-all duration-300 ${st.hlChar ? 'border-sky-400 bg-sky-50 ring-4 ring-sky-200 scale-[1.02]' : 'border-slate-200'}`}>
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 ${st.hlChar ? 'text-sky-600' : 'text-slate-400'}`}>Current Char 'c'</span>
                          <span className={`font-mono text-3xl font-black ${st.hlChar ? 'text-sky-600' : 'text-slate-700'}`}>{st.c !== undefined ? `'${st.c}'` : '-'}</span>
                      </div>

                      <div className={`bg-white border-2 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center flex-1 transition-all duration-300 ${st.hlKUpdate || st.hlReset ? 'border-amber-400 bg-amber-50 ring-4 ring-amber-200 scale-[1.02]' : 'border-slate-200'}`}>
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 ${st.hlKUpdate || st.hlReset ? 'text-amber-600' : 'text-slate-400'}`}>Multiplier 'k'</span>
                          <span className={`font-mono text-3xl font-black ${st.hlKUpdate || st.hlReset ? 'text-amber-600' : 'text-slate-700'}`}>{st.k !== undefined ? st.k : '-'}</span>
                      </div>

                      <div className={`bg-slate-800 border-2 rounded-2xl p-4 shadow-xl flex flex-col items-center justify-center w-1/2 transition-all duration-300 ${st.hlCurrentUpdate || st.hlCurrentAppend || st.hlReset ? 'border-emerald-400 ring-4 ring-emerald-500 scale-[1.02]' : 'border-slate-700'}`}>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 text-center leading-tight">currentString (Buffer)</span>
                          <span className={`font-mono font-black text-2xl truncate px-4 w-full text-center text-emerald-400`}>
                              "{st.currentString !== undefined ? st.currentString : ''}"
                          </span>
                      </div>

                  </div>
              )}

              {/* The Two Stacks */}
              {!st.isSuccess && selectedOpId === 'optimalStack' && (
                  <div className="flex flex-col xl:flex-row w-full max-w-6xl gap-6 items-start justify-center mt-2 animate-in slide-in-from-bottom-8">
                      {/* countStack */}
                      <div className="flex flex-col items-start w-full flex-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-2`}><Layers size={12}/> countStack (Integers)</span>
                          
                          <div className={`flex gap-2 p-4 border-[3px] bg-amber-50/30 rounded-[2rem] shadow-lg flex-wrap justify-start items-center w-full min-h-[110px] transition-colors duration-300 ${st.hlCountPush ? 'border-emerald-400 bg-emerald-50/50 ring-4 ring-emerald-200' : (st.hlCountPop ? 'border-rose-400 bg-rose-50/50 ring-4 ring-rose-200' : 'border-amber-200')}`}>
                              {st.countStack && st.countStack.map((val, idx) => {
                                  let isHl = false;
                                  let color = 'amber';
                                  
                                  if (st.hlCountPush && idx === st.countStack.length - 1) {
                                      isHl = true;
                                      color = 'emerald';
                                  }

                                  return (
                                      <React.Fragment key={`cstk-${idx}`}>
                                          <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2 animate-in zoom-in slide-in-from-left-4' : 'scale-100 z-10 m-1'}`}>
                                              <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} />
                                          </div>
                                      </React.Fragment>
                                  )
                              })}
                              {(!st.countStack || st.countStack.length === 0) && <span className="text-slate-400 italic text-sm font-mono px-4">empty stack</span>}
                          </div>
                      </div>

                      {/* stringStack */}
                      <div className="flex flex-col items-start w-full flex-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-indigo-50 text-indigo-600 border-indigo-200 flex items-center gap-2`}><Layers size={12}/> stringStack (StringBuilders)</span>
                          
                          <div className={`flex gap-2 p-4 border-[3px] bg-indigo-50/30 rounded-[2rem] shadow-lg flex-wrap justify-start items-center w-full min-h-[110px] transition-colors duration-300 ${st.hlStringPush ? 'border-emerald-400 bg-emerald-50/50 ring-4 ring-emerald-200' : (st.hlStringPop ? 'border-rose-400 bg-rose-50/50 ring-4 ring-rose-200' : 'border-indigo-200')}`}>
                              {st.stringStack && st.stringStack.map((val, idx) => {
                                  let isHl = false;
                                  let color = 'indigo';
                                  
                                  if (st.hlStringPush && idx === st.stringStack.length - 1) {
                                      isHl = true;
                                      color = 'emerald';
                                  }

                                  return (
                                      <React.Fragment key={`sstk-${idx}`}>
                                          <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2 animate-in zoom-in slide-in-from-left-4' : 'scale-100 z-10 m-1'}`}>
                                              <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} isStringStack={true}/>
                                          </div>
                                      </React.Fragment>
                                  )
                              })}
                              {(!st.stringStack || st.stringStack.length === 0) && <span className="text-slate-400 italic text-sm font-mono px-4">empty stack</span>}
                          </div>
                      </div>
                  </div>
              )}

              {/* Decoder Working Area */}
              {!st.isSuccess && selectedOpId === 'optimalStack' && st.decodedString !== undefined && (
                  <div className="flex flex-col items-center w-full max-w-6xl mt-4 animate-in slide-in-from-bottom-8">
                      <div className="bg-fuchsia-50 border-2 border-fuchsia-300 rounded-2xl p-6 shadow-xl w-full">
                          <h3 className="text-xs font-black uppercase tracking-widest text-fuchsia-600 mb-4 border-b border-fuchsia-200 pb-2 flex items-center gap-2"><Combine size={14}/> Decoding Engine Active</h3>
                          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                              <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Popped Context</span>
                                  <span className="font-mono text-xl font-bold bg-white border px-3 py-1 rounded text-indigo-700 shadow-sm">"{st.decodedString}"</span>
                              </div>
                              <span className="font-black text-xl text-fuchsia-400">+</span>
                              <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Popped Multiplier</span>
                                  <span className="font-mono text-2xl font-bold bg-white border px-4 py-1 rounded text-amber-600 shadow-sm">{st.currentK}</span>
                              </div>
                              <span className="font-black text-xl text-fuchsia-400">×</span>
                              <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Current Buffer</span>
                                  <span className="font-mono text-xl font-bold bg-white border px-3 py-1 rounded text-emerald-600 shadow-sm">"{st.currentString}"</span>
                              </div>
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
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-fuchsia-600'}`}>
                <Brackets className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Decode String</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'emerald' ? 'text-emerald-600 bg-emerald-50' : 'text-fuchsia-600 bg-fuchsia-50'}`}>
                      LC 394 • Stack / Parsing
                  </span>
                  <span>•</span>
                  <span>O(N) Time Constraint</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-8 flex flex-col">
                <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-fuchsia-600'}`}><AlignLeft size={28}/> Problem Statement</div>
                
                <div className="text-base leading-relaxed">
                  Given an encoded string, return its decoded string.<br/><br/>
                  The encoding rule is: <code>k[encoded_string]</code>, where the <code>encoded_string</code> inside the square brackets is being repeated exactly <code>k</code> times. Note that <code>k</code> is guaranteed to be a positive integer.<br/><br/>
                  You may assume that the input string is always valid; there are no extra white spaces, square brackets are well-formed, etc. Furthermore, you may assume that the original data does not contain any digits and that digits are only for those repeat numbers, <code>k</code>.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-emerald-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> s = "3[a]2[bc]"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> "aaabcbc"</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation:
'a' is repeated 3 times.
'bc' is repeated 2 times.
They are appended together.
                        </div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> s = "3[a2[c]]"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> "accaccacc"</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation:
This involves NESTED brackets.
First, we resolve the innermost bracket: 2[c] -&gt; "cc".
Then we append it to 'a': "acc".
Then we resolve the outer bracket: 3[acc] -&gt; "accaccacc".
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Traps</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-2">
                        <li>1 &lt;= s.length &lt;= 30</li>
                        <li><code>s</code> consists of lowercase English letters, digits, and square brackets <code>[]</code>.</li>
                        <li><code>s</code> is guaranteed to be a valid input.</li>
                        <li className={`font-bold mt-2 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-fuchsia-600'}`}>
                            Trap: Multipliers can be multiple digits long (e.g. <code>"100[leetcode]"</code>). You must parse digits mathematically <code>k = k * 10 + digit</code> rather than assuming every number is a single character.
                        </li>
                    </ul>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white border-emerald-600 scale-[1.02]' : 'bg-fuchsia-600 text-white border-fuchsia-600 scale-[1.02]') : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'text-emerald-200' : 'text-fuchsia-200') : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-hidden relative">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <React.Fragment key={idx}>
                          <CodeLineRenderer num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-end">
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono pl-1 flex justify-between ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-fuchsia-600'}`}>
                                <span>Encoded String 's'</span>
                            </label>
                            <input 
                                type="text"
                                value={sInput} 
                                onChange={(e) => setSInput(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner lowercase ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-fuchsia-500'}`} 
                                spellCheck={false}
                                placeholder="3[a2[c]]"
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-3 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 group disabled:opacity-30 ${themeColor === 'emerald' ? 'bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700' : 'bg-fuchsia-600 shadow-fuchsia-200 hover:bg-fuchsia-700'}`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-6 shadow-xl border transition-all duration-300 min-h-[130px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={80} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-2 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className={`text-xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-emerald-400`}>
                                <PartyPopper size={20}/> Evaluation Complete
                            </div>
                            <p className="text-sm leading-relaxed text-white mt-1 font-mono font-bold tracking-tight">{String(curStepData.description)}</p>
                         </div>
                    ) : (
                        <>
                            <div className="text-lg font-black tracking-tight mb-1 uppercase font-mono text-white leading-none truncate">{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-2 italic font-mono relative z-10 whitespace-pre-wrap">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 min-h-[440px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur ${themeColor === 'emerald' ? 'text-emerald-500' : 'text-fuchsia-500'}`}><Layout size={14}/> Memory Tracker</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-fuchsia-600'}`}><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-fuchsia-600'}`}><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-fuchsia-600'}`}><Maximize2 size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-20 pb-16 gap-4 items-center overflow-x-auto overflow-y-hidden scrollbar-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           {renderVisuals()}
                       </div>
                   </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-10">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-[#0f172a] text-white border border-slate-800 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Target size={120}/></div>
                        <h3 className="font-black text-emerald-400 text-lg uppercase tracking-widest mb-6">Parsing Nested Grammars</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>This problem is a classic example of a <strong>Context-Free Grammar</strong> parser. The presence of nested brackets <code>[]</code> means the data is not strictly linear.</p>
                            <p>To parse nested structures, we must use a <strong>Stack</strong> (or recursion, which uses the Call Stack). Stacks inherently operate on a Last-In, First-Out (LIFO) principle.</p>
                            <p>LIFO is perfect here because when you encounter an inner closing bracket <code>]</code>, you must resolve the <em>most recently opened</em> bracket <code>[</code> before you can resolve the outer ones.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-emerald-700 text-lg uppercase tracking-widest mb-6">The State Machine Concept</h3>
                        <div className="space-y-4 text-sm text-emerald-900/80 leading-relaxed font-medium">
                            <p>You can think of this algorithm as a <strong>State Machine</strong>. At any given moment, you are building a <code>currentString</code> and a multiplier <code>k</code>.</p>
                            <p>When you see a <code>[</code>, your machine says: "I need to pause what I'm doing and start working on a new inner context." So, it pushes its current state (the string it was building, and the multiplier it just calculated) safely onto the stacks.</p>
                            <p>When it sees a <code>]</code>, the machine says: "I've finished the inner context. Let me pop my old state from the stacks, multiply what I just built, and attach it to the old state."</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-emerald-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-emerald-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering State and Context</h3>
                    <p className="text-sm text-emerald-50 leading-relaxed italic max-w-2xl font-mono">"Interviewers use this question to see if you can cleanly separate and manage 'State'. If you try to use complex regex or string manipulation loops, you will get completely lost in nested brackets. You must confidently explain that a Stack allows you to freeze the outer context while resolving the inner context."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><ShieldAlert size={16}/></div>
                               1. Acknowledge the Recursion/Stack Need
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "Because the string contains nested brackets, a simple linear pass won't work. We need to evaluate the innermost brackets first and work our way out. This LIFO requirement means we need to parse it using either Recursion or explicit Stacks."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Layers size={16}/></div>
                               2. Detail the Stack Architecture
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "I'll use an iterative Two-Stack approach: a `countStack` for multipliers and a `stringStack` for the text context. Using explicit stacks instead of recursion avoids StackOverflowErrors on deeply nested inputs and gives us very clean control over the memory state."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Code2 size={16}/></div>
                               3. Walk Through the State Machine
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "I'll maintain a `currentString` buffer and a multiplier `k`. I iterate over the string. If I see a digit, I update `k` taking care of multi-digit numbers. If I see an open bracket `[`, I push `k` and `currentString` to their respective stacks to save the outer context, and reset them to start processing the inner context. If I see a close bracket `]`, I pop the multiplier and the previous string context. I multiply my inner string, append it to the popped context, and make that my new `currentString`. Finally, I return the fully resolved string."
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        )}
      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[400px] xl:w-[450px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110] shrink-0">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg ${themeColor === 'emerald' ? 'bg-emerald-500 shadow-emerald-900/50' : 'bg-fuchsia-500 shadow-fuchsia-900/50'}`}><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-4 whitespace-pre-wrap flex flex-col">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4 overflow-hidden shrink-0">
                        <div className="w-full">
                            {selectedOp.code.split('\n').map((line, idx) => (
                                <React.Fragment key={idx}>
                                    <CodeLineRenderer num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} />
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-tight">{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-wrap">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  {/* Floating Controls for Fullscreen */}
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white shadow-md' : 'bg-fuchsia-600 text-white shadow-md') : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-80 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-fuchsia-600'}`}>Input String 's'</label>
                              <input type="text" value={sInput} onChange={(e) => setSInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner lowercase ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-fuchsia-500'}`} />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-fuchsia-50 hover:text-fuchsia-600'}`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-fuchsia-50 hover:text-fuchsia-600'}`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-fuchsia-50 hover:text-fuchsia-600'}`}><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 text-white rounded-[2rem] hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border shadow-2xl ${themeColor === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-400 shadow-emerald-900/30' : 'bg-fuchsia-600 hover:bg-fuchsia-700 border-fuchsia-400 shadow-fuchsia-900/30'}`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 min-w-full w-max min-h-full origin-top-left transition-transform duration-500 flex flex-col p-16 md:p-32 pt-40 gap-16 items-center overflow-visible" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           {renderVisuals()}
                      </div>
                  </div>
                  
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-emerald-500/30`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 bg-emerald-500/20 text-emerald-500 ring-emerald-500/10`}>
                                    <PartyPopper size={48} />
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    COMPLETED
                                </h2>
                                <p className={`font-mono text-xl uppercase mb-8 tracking-widest text-emerald-400 max-w-lg break-words`}>
                                    Result: <span className="font-black text-3xl text-white ml-2 block mt-2">"{st.finalAns}"</span>
                                </p>
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