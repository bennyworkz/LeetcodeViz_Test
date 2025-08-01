import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, Maximize, Target, Focus, Type, CheckCircle2, XCircle, ArrowDown, ArrowUp, Layout, TrendingUp, Clock, Layers, Calculator, Combine, SquareSquare
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  slidingWindow: {
    id: 'slidingWindow',
    title: '1. Sliding Window (Optimal)',
    icon: <SquareSquare size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public int maxVowels(String s, int k) {
    int currentVowels = 0;
    for (int i = 0; i < k; i++) {
        if (isVowel(s.charAt(i))) {
            currentVowels++;
        }
    }
    
    int maxV = currentVowels;
    
    for (int i = k; i < s.length(); i++) {
        if (isVowel(s.charAt(i))) {
            currentVowels++;
        }
        if (isVowel(s.charAt(i - k))) {
            currentVowels--;
        }
        maxV = Math.max(maxV, currentVowels);
    }
    
    return maxV;
}`,
    desc: "The Optimal Sliding Window Approach. We count the vowels in the very first window of length 'k'. Then, we slide the window one character at a time. If the new character entering the window is a vowel, we increment our count. If the old character leaving the window was a vowel, we decrement our count. This completely eliminates redundant counting, making it O(N)."
  },
  bruteForce: {
    id: 'bruteForce',
    title: '2. Nested Loops (Naive)',
    icon: <SearchCode size={16} />,
    complexity: 'Time: O(N * K) | Space: O(1)',
    code: `public int maxVowels(String s, int k) {
    int maxV = 0;
    
    for (int i = 0; i <= s.length() - k; i++) {
        int currentVowels = 0;
        for (int j = i; j < i + k; j++) {
            if (isVowel(s.charAt(j))) {
                currentVowels++;
            }
        }
        maxV = Math.max(maxV, currentVowels);
    }
    
    return maxV;
}`,
    desc: "The Naive Brute Force Approach. We check every single possible substring of length k. For each starting index 'i', we run an inner loop 'j' to inspect the next k characters, checking each one to see if it is a vowel. Because we re-evaluate overlapping characters repeatedly, the time complexity becomes O(N * K)."
  }
};

// --- Helper UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active = false, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|double|int|char|return|if|else|for|while|continue|break|new|length|Math|max|min|maxVowels|isVowel|s|k|currentVowels|maxV|charAt|i|j)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  
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
            const isObject = ['String', 'Math', 'Integer'].includes(part);
            const isVar = ['s', 'k', 'currentVowels', 'maxV', 'i', 'j'].includes(part);
            const isMapCall = ['length', 'max', 'min', 'maxVowels', 'isVowel', 'charAt'].includes(part);
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

const NodeBlock = ({ val, idx = undefined, themeColor = 'slate', isTarget = false, isDimmed = false, subtext = undefined, showPlus = false, showMinus = false }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', index: 'bg-emerald-100 text-emerald-600' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', index: 'bg-sky-100 text-sky-600' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', index: 'bg-fuchsia-100 text-fuchsia-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', index: 'bg-rose-100 text-rose-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' },
        disabled: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-300', index: 'bg-slate-50 text-slate-300' }
    };
    
    let activeTheme = isDimmed ? themes['disabled'] : (themes[themeColor] || themes['slate']);
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;
    
    const displayVal = val === null || val === "" ? '\u00A0' : String(val);

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center min-w-[48px] md:min-w-[56px] min-h-[56px] md:min-h-[64px] border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-xl py-1 bg-white/60 ${activeTheme.text} ${isDimmed ? 'opacity-50' : 'opacity-100'} whitespace-nowrap tracking-tighter relative`}>
                    {showPlus && <span className="absolute top-1 right-1 text-[10px] text-emerald-600 font-bold">+</span>}
                    {showMinus && <span className="absolute top-1 right-1 text-[10px] text-rose-600 font-bold">-</span>}
                    {displayVal}
                </div>
                {(idx !== undefined || subtext !== undefined) && (
                    <div className={`flex w-full h-4 md:h-5 border-t border-black/10 ${activeTheme.index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className="text-[8px] md:text-[9px] font-black tracking-widest uppercase">{subtext !== undefined ? subtext : `${idx}`}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Application ---

export default function MaxVowelsSubstringVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('slidingWindow');
  
  const [sInput, setSInput] = useState('abciiidef');
  const [kInput, setKInput] = useState('3');
  
  const [baseS, setBaseS] = useState(['a', 'b', 'c', 'i', 'i', 'i', 'd', 'e', 'f']);
  const [baseK, setBaseK] = useState(3);
  
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
      let parsedS = sInput.trim().split('').filter(c => c !== ' ' && c !== ',');
      let parsedK = parseInt(kInput.trim(), 10);
      
      if (parsedS.length === 0) parsedS = ['a', 'b', 'c', 'i', 'i', 'i', 'd', 'e', 'f'];
      if (parsedS.length > 25) parsedS = parsedS.slice(0, 25); // Restrict to avoid overload
      
      if (isNaN(parsedK) || parsedK <= 0) parsedK = 1;
      if (parsedK > parsedS.length) parsedK = parsedS.length;

      setBaseS(parsedS);
      setBaseK(parsedK);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
    }, 400);
    return () => clearTimeout(timer);
  }, [sInput, kInput, selectedOpId]);

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
    if (!baseS || baseS.length === 0) return [{ phase: 'Init', description: 'Enter valid string.', line: 1, state: {} }];

    let arr = [...baseS];
    const n = arr.length;
    const k = baseK;
    
    const isV = (char) => ['a', 'e', 'i', 'o', 'u'].includes(char.toLowerCase());

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, description: ds, line: ln, 
        state: { arr: [...arr], n, k, ...st } 
    });

    if (selectedOpId === 'slidingWindow') {
        let currentVowels = 0;
        let maxV = 0;
        
        add("Function Call", `public int maxVowels(String s, int k)`, 1, { });
        
        add("Init currentVowels", `int currentVowels = 0;`, 2, { currentVowels });
        
        for (let i = 0; i < k; i++) {
            add("Initial Window Loop", `for (int i = ${i}; i < ${k}; i++)\nEvaluating condition.`, 3, { currentVowels, windowStart: 0, windowEnd: i, isEvaluatingFor: true, hlIter: i });
            
            let isVowel = isV(arr[i]);
            add("Check Vowel", `if (isVowel(s.charAt(${i})))\nIs '${arr[i]}' a vowel? (${isVowel ? 'Yes' : 'No'})`, 4, { currentVowels, windowStart: 0, windowEnd: i, hlAdd: i, isVowelCheck: true, isVowelResult: isVowel });
            
            if (isVowel) {
                currentVowels++;
                add("Increment Vowels", `currentVowels++;\nFound a vowel. Count is ${currentVowels}.`, 5, { currentVowels, windowStart: 0, windowEnd: i, hlAdd: i });
            }
        }
        add("Initial Window Loop", `for (int i = ${k}; i < ${k}; i++)\nCondition is false. Break loop.`, 3, { currentVowels, windowStart: 0, windowEnd: k - 1, isEvaluatingFor: true });
        
        maxV = currentVowels;
        add("Init maxV", `int maxV = currentVowels;\nSet the base max to the first window's vowel count (${currentVowels}).`, 8, { currentVowels, maxV, windowStart: 0, windowEnd: k - 1, isUpdatingMax: true });
        
        for (let i = k; i < n; i++) {
            let dropIdx = i - k;
            
            add("Slide Window Loop", `for (int i = ${i}; i < s.length(); i++)\nEvaluating condition to slide.`, 10, { currentVowels, maxV, windowStart: dropIdx, windowEnd: i, isEvaluatingFor: true, hlIter: i });
            
            let entering = arr[i];
            let isVowelEntering = isV(entering);
            add("Check Entering Vowel", `if (isVowel(s.charAt(${i})))\nIs the entering char '${entering}' a vowel? (${isVowelEntering ? 'Yes' : 'No'})`, 11, { currentVowels, maxV, windowStart: dropIdx + 1, windowEnd: i, hlAdd: i, isVowelCheck: true, isVowelResult: isVowelEntering });
            
            if (isVowelEntering) {
                currentVowels++;
                add("Increment Vowels", `currentVowels++;\nEntering char was a vowel. Count is ${currentVowels}.`, 12, { currentVowels, maxV, windowStart: dropIdx + 1, windowEnd: i, hlAdd: i });
            }
            
            let exiting = arr[dropIdx];
            let isVowelExiting = isV(exiting);
            add("Check Exiting Vowel", `if (isVowel(s.charAt(${dropIdx})))\nWas the exiting char '${exiting}' a vowel? (${isVowelExiting ? 'Yes' : 'No'})`, 14, { currentVowels, maxV, windowStart: dropIdx + 1, windowEnd: i, hlDrop: dropIdx, isVowelCheck: true, isVowelResult: isVowelExiting });
            
            if (isVowelExiting) {
                currentVowels--;
                add("Decrement Vowels", `currentVowels--;\nExiting char was a vowel. We lose one. Count is ${currentVowels}.`, 15, { currentVowels, maxV, windowStart: dropIdx + 1, windowEnd: i, hlDrop: dropIdx });
            }
            
            let prevMax = maxV;
            maxV = Math.max(maxV, currentVowels);
            add("Update Max", `maxV = Math.max(${prevMax}, ${currentVowels});\nmaxV becomes ${maxV}.`, 17, { currentVowels, maxV, windowStart: dropIdx + 1, windowEnd: i, isUpdatingMax: maxV > prevMax });
        }
        
        add("Slide Window Loop", `for (int i = ${n}; i < s.length(); i++)\nCondition is false. Loop terminates.`, 10, { currentVowels, maxV, windowStart: n - k, windowEnd: n - 1, isEvaluatingFor: true });
        
        add("Return Result", `return maxV;\nReturn max vowels found: ${maxV}`, 20, { currentVowels, maxV, windowStart: n - k, windowEnd: n - 1, isSuccess: true, finalAns: maxV });

    } else if (selectedOpId === 'bruteForce') {
        let maxV = 0; 
        
        add("Function Call", `public int maxVowels(String s, int k)`, 1, { });
        add("Init maxV", `int maxV = 0;`, 2, { maxV });
        
        for (let i = 0; i <= n - k; i++) {
            add("Outer Loop Eval", `for (int i = ${i}; i <= s.length() - k; i++)\nChoose substring start index.`, 4, { maxV, outerI: i, isEvaluatingOuter: true });
            
            let currentVowels = 0;
            add("Init currentVowels", `int currentVowels = 0;\nResetting vowel count for the new substring.`, 5, { maxV, outerI: i, currentVowels });
            
            for (let j = i; j < i + k; j++) {
                add("Inner Loop Eval", `for (int j = ${j}; j < i + k; j++)\nIterating next k characters.`, 6, { maxV, outerI: i, innerJ: j, currentVowels, isEvaluatingInner: true });
                
                let isVowel = isV(arr[j]);
                add("Check Vowel", `if (isVowel(s.charAt(${j})))\nIs '${arr[j]}' a vowel? (${isVowel ? 'Yes' : 'No'})`, 7, { maxV, outerI: i, innerJ: j, currentVowels, hlAdd: j, isVowelCheck: true, isVowelResult: isVowel });
                
                if (isVowel) {
                    currentVowels++;
                    add("Increment Vowels", `currentVowels++;\nFound a vowel. Count is ${currentVowels}.`, 8, { maxV, outerI: i, innerJ: j, currentVowels, hlAdd: j });
                }
            }
            
            add("Inner Loop End", `for (int j = ${i + k}; j < i + k; j++)\nFinished checking k characters.`, 6, { maxV, outerI: i, currentVowels });
            
            let prevMax = maxV;
            maxV = Math.max(maxV, currentVowels);
            add("Update Max", `maxV = Math.max(${prevMax}, ${currentVowels});\nmaxV becomes ${maxV}.`, 11, { maxV, outerI: i, currentVowels, isUpdatingMax: maxV > prevMax });
        }
        
        add("Outer Loop End", `Checked all possible substrings.`, 4, { maxV });
        add("Return Result", `return maxV;\nReturn max vowels found: ${maxV}`, 14, { maxV, isSuccess: true, finalAns: maxV });
    }

    return steps;
  }, [baseS, baseK, selectedOpId]);

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

  const themeColor = selectedOpId === 'slidingWindow' ? 'emerald' : 'amber';

  // --- Rendering Helpers ---

  const renderVisuals = () => {
      if (st.arr === undefined) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full mt-2 gap-6 w-full">
              
              {/* Target String Visualization */}
              <div className="flex flex-col items-center w-full max-w-5xl">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-slate-100 text-slate-500 border-slate-200 flex items-center gap-2`}><Layout size={12}/> Target String (s) in Memory</span>
                  
                  <div className="flex gap-1.5 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center items-center w-full min-h-[120px]">
                      {st.arr.map((val, idx) => {
                          let color = 'slate';
                          let isHl = false;
                          let isDimmed = true; // Default to dimmed, light up window
                          let labels = [];
                          let showPlus = false;
                          let showMinus = false;

                          if (selectedOpId === 'slidingWindow') {
                              // Identify the current window
                              let inWindow = false;
                              if (st.windowStart !== undefined && st.windowEnd !== undefined) {
                                  if (idx >= st.windowStart && idx <= st.windowEnd) {
                                      inWindow = true;
                                      isDimmed = false;
                                      color = 'sky';
                                  }
                              }

                              // Highlighting pointers
                              if (st.hlIter === idx) {
                                  labels.push({ text: 'i', color: 'sky', pos: 'bottom' });
                                  isHl = true;
                              }

                              if (st.hlAdd === idx) {
                                  color = 'emerald';
                                  showPlus = true;
                                  isHl = true;
                                  
                                  if (st.isVowelCheck) {
                                      labels.push({ text: st.isVowelResult ? 'Vowel' : 'Consonant', color: st.isVowelResult ? 'emerald' : 'slate', pos: 'top' });
                                  } else {
                                      labels.push({ text: 'Enter', color: 'emerald', pos: 'top' });
                                  }
                              }

                              if (st.hlDrop === idx) {
                                  color = 'rose';
                                  showMinus = true;
                                  isHl = true;
                                  isDimmed = false; // keep it visible for the drop frame
                                  
                                  if (st.isVowelCheck) {
                                      labels.push({ text: st.isVowelResult ? 'Vowel (Lose)' : 'Consonant', color: st.isVowelResult ? 'rose' : 'slate', pos: 'top' });
                                  } else {
                                      labels.push({ text: 'Drop (i-k)', color: 'rose', pos: 'top' });
                                  }
                              }
                              
                              if (st.isSuccess) {
                                  if (inWindow) color = 'emerald';
                                  isDimmed = !inWindow;
                                  isHl = false;
                              }

                          } else if (selectedOpId === 'bruteForce') {
                              // Outer loop 'i', inner loop 'j'
                              let inSubarray = false;
                              if (st.outerI !== undefined) {
                                  if (idx >= st.outerI && idx < st.outerI + st.k) {
                                      inSubarray = true;
                                      isDimmed = false;
                                      color = 'sky';
                                  }
                              }

                              if (st.outerI === idx) {
                                  labels.push({ text: 'i', color: 'amber', pos: 'bottom' });
                              }

                              if (st.innerJ === idx) {
                                  labels.push({ text: 'j', color: 'fuchsia', pos: 'top' });
                                  isHl = true;
                              }

                              if (st.hlAdd === idx) {
                                  color = 'emerald';
                                  if (st.isVowelCheck) {
                                      labels.push({ text: st.isVowelResult ? 'Vowel' : 'Consonant', color: st.isVowelResult ? 'emerald' : 'slate', pos: 'top' });
                                  }
                                  if (st.isVowelResult) showPlus = true;
                              }
                              
                              if (st.isSuccess) isDimmed = false;
                          }

                          return (
                              <React.Fragment key={`arr-${idx}`}>
                                  <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-1'} ${st.hlDrop === idx ? 'animate-in slide-in-from-top-4' : ''}`}>
                                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">
                                        {labels.filter(l => l.pos === 'top').map((l, j) => (
                                            <React.Fragment key={j}>
                                                <PointerLabel label={l.text} color={l.color} position="top" />
                                            </React.Fragment>
                                        ))}
                                      </div>
                                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                        {labels.filter(l => l.pos === 'bottom').map((l, j) => (
                                            <React.Fragment key={j}>
                                                <PointerLabel label={l.text} color={l.color} position="bottom" />
                                            </React.Fragment>
                                        ))}
                                      </div>
                                      <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} isDimmed={isDimmed} showPlus={showPlus} showMinus={showMinus} />
                                  </div>
                              </React.Fragment>
                          )
                      })}
                      {st.arr.length === 0 && <span className="text-slate-400 italic text-sm font-mono px-4">empty string</span>}
                  </div>
              </div>

              {/* State Variables Overlay */}
              {!st.isSuccess && (
                  <div className="flex w-full max-w-4xl gap-4 mt-6">
                      <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center w-32">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">k (Size)</span>
                          <span className="font-mono text-3xl font-black text-slate-600">{st.k}</span>
                      </div>
                      
                      <div className={`bg-white border-2 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center flex-1 transition-all ${st.currentVowels !== undefined ? 'border-sky-300 bg-sky-50' : 'border-slate-200'}`}>
                          <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 mb-2">Current Vowels</span>
                          <span className="font-mono text-4xl font-black text-sky-600">{st.currentVowels !== undefined ? st.currentVowels : '-'}</span>
                      </div>

                      <div className={`bg-slate-800 border-2 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center flex-1 transition-all ${st.isUpdatingMax ? 'border-emerald-400 ring-4 ring-emerald-500 scale-105' : 'border-slate-700'}`}>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Max Vowels</span>
                          <span className={`font-mono font-black text-4xl text-emerald-400`}>
                              {st.maxV !== undefined ? st.maxV : '-'}
                          </span>
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
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-amber-600'}`}>
                <SquareSquare className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Max Vowels in Substring</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'emerald' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                      LC 1456 • Sliding Window
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
                <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}><AlignLeft size={28}/> Problem Statement</div>
                
                <div className="text-base leading-relaxed">
                  Given a string <code>s</code> and an integer <code>k</code>, return the maximum number of vowel letters in any substring of <code>s</code> with length <code>k</code>.<br/><br/>
                  <strong>Vowel letters</strong> in English are <code>'a'</code>, <code>'e'</code>, <code>'i'</code>, <code>'o'</code>, and <code>'u'</code>.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-emerald-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> s = "abciiidef", k = 3</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 3</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation: The substring "iii" contains 3 vowel letters.
                        </div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> s = "aeiou", k = 2</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 2</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation: Any substring of length 2 contains 2 vowels.
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Traps</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-2">
                        <li>1 &lt;= s.length &lt;= 10⁵</li>
                        <li><code>s</code> consists of lowercase English letters.</li>
                        <li>1 &lt;= k &lt;= s.length</li>
                        <li className={`font-bold mt-2 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            Trap: A brute force approach checking every k-length substring involves O(N * K) steps, resulting in a Time Limit Exceeded error. You must slide a window to achieve O(N).
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
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white border-emerald-600 scale-[1.02]' : 'bg-amber-600 text-white border-amber-600 scale-[1.02]') : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'text-emerald-200' : 'text-amber-200') : 'text-slate-400'}`}>{op.complexity}</div>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono pl-1 flex justify-between ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                <span>String (s)</span>
                            </label>
                            <input 
                                type="text"
                                value={sInput} 
                                onChange={(e) => setSInput(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner lowercase ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-amber-500'}`} 
                                spellCheck={false}
                                placeholder="abciiidef"
                            />
                        </div>
                        <div className="w-24 space-y-1.5 group">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono pl-1 flex justify-between ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                <span>Size (k)</span>
                            </label>
                            <input 
                                type="number"
                                min="1"
                                value={kInput} 
                                onChange={(e) => setKInput(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner text-center ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-amber-500'}`} 
                                placeholder="3"
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-3 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 group disabled:opacity-30 ${themeColor === 'emerald' ? 'bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700' : 'bg-amber-600 shadow-amber-200 hover:bg-amber-700'}`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
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
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur ${themeColor === 'emerald' ? 'text-emerald-500' : 'text-amber-500'}`}><Layout size={14}/> Memory Tracker</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-amber-600'}`}><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-amber-600'}`}><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-amber-600'}`}><Maximize2 size={16}/></button>
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
                        <h3 className="font-black text-emerald-400 text-lg uppercase tracking-widest mb-6">The Sliding Window Pattern</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>Whenever a problem asks for information about a <strong>contiguous substring of fixed length 'k'</strong>, the Sliding Window technique is almost always the optimal solution.</p>
                            <p>Think of it like a physical window frame of length <code>k</code> sliding over a sequence of characters. Instead of checking every character inside the window every time it moves (which is redundant), we just look at the edges.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-emerald-700 text-lg uppercase tracking-widest mb-6">O(1) Math per Slide</h3>
                        <div className="space-y-4 text-sm text-emerald-900/80 leading-relaxed font-medium">
                            <p>If our window moves one step to the right, exactly <strong>two things</strong> change:</p>
                            <ol className="list-decimal pl-6 space-y-2">
                                <li>One new character enters the window from the right (if it's a vowel, we <strong>ADD</strong> 1 to our count).</li>
                                <li>One old character falls out of the window from the left (if it was a vowel, we <strong>SUBTRACT</strong> 1 from our count).</li>
                            </ol>
                            <p>This simple condition check runs in O(1) constant time per step, dropping the overall complexity of the problem from O(N*K) down to a strict O(N).</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-emerald-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-emerald-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Explaining the Overlap Redundancy</h3>
                    <p className="text-sm text-emerald-50 leading-relaxed italic max-w-2xl font-mono">"Interviewers want to see that you understand WHY the brute force approach is bad. Don't just jump straight to the sliding window code; explain that checking contiguous substrings from scratch recalculates the same overlapping inner characters repeatedly. Point out the overlap to justify the sliding window approach."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><SearchCode size={16}/></div>
                               1. Acknowledge the Nested Loops
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "The brute force approach would be to count the vowels for every possible substring of length `k`. We would have an outer loop for the start index, and an inner loop of size `k`. This takes O(N*K) time, which is too slow because we are redundantly checking the middle characters over and over."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><SquareSquare size={16}/></div>
                               2. Pivot to the Sliding Window
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "To optimize this to O(N), I will use a Sliding Window. First, I'll count the vowels in the very first window of size `k`. Then, as I slide the window one position to the right, I don't need to check from scratch. I simply adjust the count if the new character entering the window is a vowel, and if the character that just left was a vowel."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Code2 size={16}/></div>
                               3. Detail the Execution
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "I'll initialize `currentVowels` and loop from index 0 to `k-1` to build the initial window. I set `maxVowels` to this value. Then, I loop from `i = k` to the end of the string. In each iteration, I check `isVowel(s.charAt(i))` to increment, and `isVowel(s.charAt(i - k))` to decrement. I keep track of the maximum using `Math.max`. Finally, I return the maximum."
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
                          <div className={`p-2 rounded-lg text-white shadow-lg ${themeColor === 'emerald' ? 'bg-emerald-500 shadow-emerald-900/50' : 'bg-amber-500 shadow-amber-900/50'}`}><Code2 size={20}/></div>
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
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white shadow-md' : 'bg-amber-600 text-white shadow-md') : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-80 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>String (s)</label>
                              <input type="text" value={sInput} onChange={(e) => setSInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner lowercase ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-amber-500'}`} />
                          </div>
                          <div className="w-20 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>Size (k)</label>
                              <input type="number" min="1" value={kInput} onChange={(e) => setKInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner text-center ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-amber-500'}`} />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-amber-50 hover:text-amber-600'}`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-amber-50 hover:text-amber-600'}`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-amber-50 hover:text-amber-600'}`}><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 text-white rounded-[2rem] hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border shadow-2xl ${themeColor === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-400 shadow-emerald-900/30' : 'bg-amber-600 hover:bg-amber-700 border-amber-400 shadow-amber-900/30'}`}>NEXT <ChevronRight size={32}/></button>
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
                                    Max Vowels: <span className="font-black text-3xl text-white ml-2 block mt-2">{st.finalAns}</span>
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