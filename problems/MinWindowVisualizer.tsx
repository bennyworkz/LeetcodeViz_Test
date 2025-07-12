import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, Maximize, Target, Focus, Type, CheckCircle2, XCircle, ArrowDown, ArrowUp, Layout
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  slidingWindow: {
    id: 'slidingWindow',
    title: '1. Sliding Window (Optimal)',
    icon: <ArrowRightLeft size={16} />,
    complexity: 'Time: O(S + T) | Space: O(1)', // ASCII array is O(1) space
    code: `public String minWindow(String s, String t) {
    int[] targetFreq = new int[128];
    for (char c : t.toCharArray()) {
        targetFreq[c]++;
    }
    int left = 0, minLen = Integer.MAX_VALUE, minStart = 0;
    int matched = 0, required = t.length();
    for (int right = 0; right < s.length(); right++) {
        char rightChar = s.charAt(right);
        if (targetFreq[rightChar] > 0) {
            matched++;
        }
        targetFreq[rightChar]--;
        while (matched == required) {
            int windowLen = right - left + 1;
            if (windowLen < minLen) {
                minLen = windowLen;
                minStart = left;
            }
            char leftChar = s.charAt(left);
            targetFreq[leftChar]++;
            if (targetFreq[leftChar] > 0) {
                matched--;
            }
            left++;
        }
    }
    return minLen == Integer.MAX_VALUE ? "" : s.substring(minStart, minStart + minLen);
}`,
    desc: "The Sliding Window approach uses two pointers. We expand the 'right' pointer to find a valid window that contains all characters of 't'. Once a valid window is found, we shrink the 'left' pointer as much as possible to minimize the window length while keeping it valid."
  },
  bruteForce: {
    id: 'bruteForce',
    title: '2. Brute Force (Naive)',
    icon: <SearchCode size={16} />,
    complexity: 'Time: O(S³) | Space: O(T)',
    code: `public String minWindow(String s, String t) {
    int minLen = Integer.MAX_VALUE;
    String result = "";
    
    // Check every possible substring of s
    for (int i = 0; i < s.length(); i++) {
        for (int j = i; j < s.length(); j++) {
            String sub = s.substring(i, j + 1);
            
            // Check if sub contains all characters of t
            if (containsAll(sub, t)) {
                if (sub.length() < minLen) {
                    minLen = sub.length();
                    result = sub;
                }
                // Break early: making a valid substring longer won't minimize it
                break;
            }
        }
    }
    return result;
}

private boolean containsAll(String sub, String t) {
    int[] counts = new int[128];
    for (char c : sub.toCharArray()) counts[c]++;
    for (char c : t.toCharArray()) {
        if (--counts[c] < 0) return false;
    }
    return true;
}`,
    desc: "The Brute Force method tests every single contiguous substring of 's' to see if it contains all characters of 't'. Because it involves deeply nested loops and string generations, it is disastrously slow for large strings and will Time Out on modern platforms."
  }
};

// --- Helper UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|char|return|if|else|for|while|continue|break|new|length|String|charAt|substring|Math|max|toCharArray|Integer|MAX_VALUE)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  
  const activeStyles = theme === 'emerald' 
    ? { bg: `bg-emerald-500/20`, border: `border-emerald-400`, text: `text-emerald-300` }
    : { bg: `bg-rose-500/20`, border: `border-rose-400`, text: `text-rose-300` };

  // Calculate indentation to ensure wrapped lines align perfectly with the original indentation
  const leadingSpaces = code.match(/^\s*/)[0].length;

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
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'char', 'return', 'if', 'else', 'for', 'while', 'continue', 'break', 'new'].includes(part);
            const isObject = ['String', 'Math', 'Integer'].includes(part);
            const isVar = ['s', 't', 'targetFreq', 'left', 'minLen', 'minStart', 'matched', 'required', 'right', 'rightChar', 'windowLen', 'leftChar', 'c', 'sub', 'result', 'counts', 'i', 'j'].includes(part);
            const isMapCall = ['length', 'charAt', 'substring', 'max', 'toCharArray', 'MAX_VALUE', 'containsAll'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&'].includes(part.trim());

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-amber-400 font-bold';
            else if (isVar) className = 'text-sky-200';
            else if (isMapCall) className = 'text-emerald-300';
            else if (isOperator) className = 'text-slate-400 font-bold';
            else if (part.startsWith("'") || part.startsWith('"') || (!isNaN(parseInt(part.trim())) && part.trim() !== '')) className = 'text-emerald-400';

            return <span key={i} className={className}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

const PointerLabel = ({ label, color, position }) => {
    const colorClasses = {
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
        sky: 'bg-sky-100 text-sky-700 border-sky-300',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300',
        amber: 'bg-amber-100 text-amber-700 border-amber-300',
        rose: 'bg-rose-100 text-rose-700 border-rose-300',
        slate: 'bg-slate-100 text-slate-600 border-slate-300'
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

const NodeBlock = ({ val, idx, themeColor = 'slate', isTarget }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', index: 'bg-emerald-100 text-emerald-600' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', index: 'bg-sky-100 text-sky-600' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', index: 'bg-fuchsia-100 text-fuchsia-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', index: 'bg-rose-100 text-rose-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' },
    };
    
    let activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;
    const displayVal = val === null ? '_' : String(val);

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center min-w-[48px] min-h-[56px] md:min-w-[56px] md:min-h-[64px] border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-2xl px-1 py-1 bg-white/60 ${activeTheme.text}`}>
                    {displayVal}
                </div>
                {idx !== undefined && (
                    <div className={`flex w-full h-4 md:h-5 border-t border-black/10 ${activeTheme.index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className="text-[8px] md:text-[9px] font-black tracking-widest uppercase">{idx}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Application ---

export default function MinWindowVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('slidingWindow');
  
  const [sInput, setSInput] = useState('ADOBECODEBANC');
  const [tInput, setTInput] = useState('ABC');
  
  const [baseS, setBaseS] = useState('ADOBECODEBANC');
  const [baseT, setBaseT] = useState('ABC');
  
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

  // Debounce input to avoid massive calculations
  useEffect(() => {
    const timer = setTimeout(() => {
      setBaseS(sInput.substring(0, 20).toUpperCase().replace(/[^A-Z]/g, '')); 
      setBaseT(tInput.substring(0, 10).toUpperCase().replace(/[^A-Z]/g, ''));
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
    }, 400);
    return () => clearTimeout(timer);
  }, [sInput, tInput, selectedOpId]);

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
    if (!baseS || !baseT) return [{ phase: 'Init', description: 'Enter valid strings for s and t.', line: 1, state: { sArr: [], counts: {} } }];

    let sArr = baseS.split('');
    let tArr = baseT.split('');
    let n = sArr.length;

    // Helper to deeply clone the targetFreq map for trace states
    const cloneFreq = (obj) => ({...obj});

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, description: ds, line: ln, 
        state: { sArr: [...sArr], tArr: [...tArr], n, ...st } 
    });

    if (selectedOpId === 'slidingWindow') {
        let targetFreq = {};
        
        add("Function Call", `public String minWindow("${baseS}", "${baseT}")`, 1, { targetFreq: cloneFreq(targetFreq) });
        add("Init Frequency Map", `int[] targetFreq = new int[128];\nCreate map to track required characters.`, 2, { targetFreq: cloneFreq(targetFreq) });
        add("Loop Target String", `for (char c : t.toCharArray()) { ... }\nPopulating required frequencies from t.`, 3, { targetFreq: cloneFreq(targetFreq) });
        
        for(let i=0; i<tArr.length; i++) {
            let charC = tArr[i];
            targetFreq[charC] = (Number(targetFreq[charC]) || 0) + 1;
            add("Populate Frequencies", `targetFreq['${charC}']++;\nWe need ${targetFreq[charC]} '${charC}'s.`, 4, { targetFreq: cloneFreq(targetFreq) });
        }
        add("End Target Loop", `}`, 5, { targetFreq: cloneFreq(targetFreq) });

        let left = 0, minLen = 999999, minStart = 0;
        add("Init Pointers", `int left = 0, minLen = MAX_VALUE, minStart = 0;\nInitialize sliding window and minimum trackers.`, 6, { targetFreq: cloneFreq(targetFreq), left, minLen, minStart });
        
        let matched = 0, required = baseT.length;
        add("Init Counters", `int matched = 0, required = ${required};\n'matched' tracks total required characters found so far.`, 7, { targetFreq: cloneFreq(targetFreq), left, minLen, minStart, matched, required });

        for (let right = 0; right < n; right++) {
            add("Expand Window", `for (int right = ${right}; right < ${n}; right++) {\nExpand the right boundary of the window.`, 8, { targetFreq: cloneFreq(targetFreq), left, right, minLen, minStart, matched, required, isExpanding: true });
            
            let rightChar = sArr[right];
            add("Get Character", `char rightChar = s.charAt(${right}); // '${rightChar}'`, 9, { targetFreq: cloneFreq(targetFreq), left, right, rightChar, minLen, minStart, matched, required, isExpanding: true });
            
            add("Check Requirement", `if (targetFreq['${rightChar}'] > 0) {\nDoes '${rightChar}' fulfill a missing required character? (${Number(targetFreq[rightChar]) || 0} > 0)`, 10, { targetFreq: cloneFreq(targetFreq), left, right, rightChar, minLen, minStart, matched, required, checkingExpand: true, isExpanding: true });
            
            if ((Number(targetFreq[rightChar]) || 0) > 0) {
                matched++;
                add("Increment Matched", `matched++;\nYes! We matched a required character. Matched is now ${matched}.`, 11, { targetFreq: cloneFreq(targetFreq), left, right, rightChar, minLen, minStart, matched, required, isExpanding: true, hlMatch: true });
            }
            add("End If", `}`, 12, { targetFreq: cloneFreq(targetFreq), left, right, rightChar, minLen, minStart, matched, required, isExpanding: true });

            targetFreq[rightChar] = (Number(targetFreq[rightChar]) || 0) - 1;
            add("Decrement Target Freq", `targetFreq['${rightChar}']--;\nValue becomes ${targetFreq[rightChar]}. Negative means excess/unneeded.`, 13, { targetFreq: cloneFreq(targetFreq), left, right, rightChar, minLen, minStart, matched, required, isExpanding: true });

            add("Check Validity Loop", `while (matched == required)\nAre all required characters in the window? (${matched} == ${required})`, 14, { targetFreq: cloneFreq(targetFreq), left, right, minLen, minStart, matched, required, isValidating: true });
            
            while (matched === required) {
                let windowLen = right - left + 1;
                add("Calculate Window Length", `int windowLen = right - left + 1;\nLength is ${right} - ${left} + 1 = ${windowLen}.`, 15, { targetFreq: cloneFreq(targetFreq), left, right, windowLen, minLen, minStart, matched, required, inWhile: true });
                
                add("Check Min Length", `if (windowLen < minLen)\nIs ${windowLen} < ${minLen === 999999 ? 'MAX' : minLen}?`, 16, { targetFreq: cloneFreq(targetFreq), left, right, windowLen, minLen, minStart, matched, required, inWhile: true });
                if (windowLen < minLen) {
                    minLen = windowLen;
                    add("Update Min Length", `minLen = windowLen;\nNew minimum length is ${minLen}.`, 17, { targetFreq: cloneFreq(targetFreq), left, right, windowLen, minLen, minStart, matched, required, hlUpdate: true, inWhile: true });
                    minStart = left;
                    add("Update Min Start", `minStart = left;\nNew min start index is ${minStart}.`, 18, { targetFreq: cloneFreq(targetFreq), left, right, windowLen, minLen, minStart, matched, required, hlUpdate: true, inWhile: true });
                }
                add("End If", `}`, 19, { targetFreq: cloneFreq(targetFreq), left, right, windowLen, minLen, minStart, matched, required, inWhile: true });

                let leftChar = sArr[left];
                add("Get Left Character", `char leftChar = s.charAt(${left}); // '${leftChar}'\nPrepare to shrink the window from the left.`, 20, { targetFreq: cloneFreq(targetFreq), left, right, leftChar, windowLen, minLen, minStart, matched, required, inWhile: true });

                targetFreq[leftChar] = (Number(targetFreq[leftChar]) || 0) + 1;
                add("Restore Target Freq", `targetFreq['${leftChar}']++;\nValue becomes ${targetFreq[leftChar]}. Restoring frequency as we drop it.`, 21, { targetFreq: cloneFreq(targetFreq), left, right, leftChar, windowLen, minLen, minStart, matched, required, inWhile: true });

                add("Check if Broken", `if (targetFreq['${leftChar}'] > 0)\nDid dropping '${leftChar}' break our required match? (${Number(targetFreq[leftChar])} > 0)`, 22, { targetFreq: cloneFreq(targetFreq), left, right, leftChar, windowLen, minLen, minStart, matched, required, checkingShrink: true, inWhile: true });
                if (Number(targetFreq[leftChar]) > 0) {
                    matched--;
                    add("Decrement Matched", `matched--;\nYes! We lost a required character. Matched is now ${matched}. Window becomes invalid.`, 23, { targetFreq: cloneFreq(targetFreq), left, right, leftChar, windowLen, minLen, minStart, matched, required, inWhile: true, hlLost: true });
                }
                add("End If", `}`, 24, { targetFreq: cloneFreq(targetFreq), left, right, leftChar, windowLen, minLen, minStart, matched, required, inWhile: true });

                left++;
                add("Move Left Pointer", `left++;\nShrink the window. 'left' is now ${left}.`, 25, { targetFreq: cloneFreq(targetFreq), left, right, windowLen, minLen, minStart, matched, required, inWhile: true });
                
                add("Re-Evaluate While", `while (matched == required)\nLoop again. Valid? (${matched} == ${required})`, 14, { targetFreq: cloneFreq(targetFreq), left, right, windowLen, minLen, minStart, matched, required, inWhile: true, isValidating: true });
            }
            add("End While", `}\nWindow is invalid. Continue expanding right.`, 26, { targetFreq: cloneFreq(targetFreq), left, right, minLen, minStart, matched, required });
        }
        add("End For", `}`, 27, { targetFreq: cloneFreq(targetFreq), left, right: n-1, minLen, minStart, matched, required });

        let finalAns = minLen === 999999 ? '""' : `"${baseS.substring(minStart, minStart + minLen)}"`;
        add("Return Result", `return minLen == Integer.MAX_VALUE ? "" : s.substring(minStart, minStart + minLen);\nAlgorithm complete! Shortest window is ${finalAns}.`, 28, { targetFreq: cloneFreq(targetFreq), left, right: n-1, minLen, minStart, matched, required, isSuccess: true, finalAns });

    } else if (selectedOpId === 'bruteForce') {
        // Adding abbreviated Brute Force trace for comparison.
        let minLen = 999999;
        let result = "";
        add("Init", `int minLen = Integer.MAX_VALUE;\nString result = "";`, 2, { minLen, result });

        for (let i = 0; i < n; i++) {
            add("Outer Loop", `for (int i = ${i}; ...)\nStart sub-string at index ${i}.`, 5, { minLen, result, i });
            for (let j = i; j < n; j++) {
                let sub = baseS.substring(i, j + 1);
                add("Inner Loop", `for (int j = ${j}; ...)\nEnd at ${j}. Substring = "${sub}"`, 6, { minLen, result, i, j, sub });
                
                add("Check containsAll", `if (containsAll("${sub}", "${baseT}"))`, 9, { minLen, result, i, j, sub, checkingSub: true });
                
                // Helper mock check safely typed with Number
                let tempCount = {};
                for (let c of baseT) tempCount[c] = (Number(tempCount[c]) || 0) + 1;
                for (let c of sub) {
                    if(tempCount[c] !== undefined) {
                         tempCount[c] = Number(tempCount[c]) - 1;
                    }
                }
                let contains = Object.values(tempCount).every(v => Number(v) <= 0);

                if (contains) {
                    add("Is Valid Substring", `Valid! Contains all characters.`, 10, { minLen, result, i, j, sub, validSub: true });
                    add("Check minLen", `if (${sub.length} < ${minLen === 999999 ? 'MAX' : minLen})`, 10, { minLen, result, i, j, sub, validSub: true });
                    if (sub.length < minLen) {
                        minLen = sub.length;
                        result = sub;
                        add("Update Min", `minLen = ${minLen};\nresult = "${result}";`, 11, { minLen, result, i, j, sub, validSub: true, updateMin: true });
                    }
                    add("Break Optimization", `break;\nSince "${sub}" is valid, making it longer by advancing 'j' won't make it smaller. Break to next 'i'.`, 15, { minLen, result, i, j, sub, validSub: true });
                    break;
                } else {
                    add("Not Valid", `Invalid. Missing characters.`, 9, { minLen, result, i, j, sub, invalidSub: true });
                }
            }
        }
        add("Return Result", `return result;\n-> "${result}"`, 20, { minLen, result, isSuccess: true });
    }

    return steps;
  }, [baseS, baseT, selectedOpId]);

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

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { sArr: [], targetFreq: {} } };
  const st = curStepData.state || { sArr: [], targetFreq: {} };
  const isLastStep = currentStep === trace.length - 1;

  const themeColor = selectedOpId === 'slidingWindow' ? 'emerald' : 'rose';

  // --- Rendering Helpers ---

  const renderStringArray = () => {
      if (!st.sArr || st.sArr.length === 0) return <span className="text-slate-400 italic">empty</span>;

      // Extract unique characters in T to display only relevant frequencies
      const tSet = new Set(baseT.split(''));

      return (
          <div className="flex flex-col items-center w-full mt-4">
              <div className="flex gap-2 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center items-center">
                  
                  {st.sArr.map((val, idx) => {
                      let color = 'slate';
                      let isHl = false;
                      let labels = [];

                      // --- Sliding Window Visuals ---
                      if (selectedOpId === 'slidingWindow') {
                          if (st.left !== undefined && st.right !== undefined && idx >= st.left && idx <= st.right) {
                              color = (st.matched === st.required) ? 'emerald' : 'sky';
                              isHl = true;
                          }
                          if (st.left === idx) labels.push({ text: 'L', color: 'indigo', pos: 'bottom' });
                          if (st.right === idx) labels.push({ text: 'R', color: 'fuchsia', pos: 'top' });
                          
                          if (st.rightChar !== undefined && idx === st.right) {
                              isHl = true;
                              color = 'amber';
                          }
                          if (st.leftChar !== undefined && idx === st.left) {
                              isHl = true;
                              color = 'amber';
                          }
                          if (st.hlUpdate && idx >= st.minStart && idx < st.minStart + st.minLen) {
                              color = 'emerald';
                              isHl = true;
                          }
                      } 
                      // --- Brute Force Visuals ---
                      else if (selectedOpId === 'bruteForce') {
                          if (st.i === idx) labels.push({ text: 'i', color: 'indigo', pos: 'bottom' });
                          if (st.j === idx) labels.push({ text: 'j', color: 'fuchsia', pos: 'top' });

                          if ((st.checkingSub || st.validSub || st.invalidSub) && idx >= st.i && idx <= st.j) {
                              color = st.invalidSub ? 'rose' : (st.validSub ? 'emerald' : 'sky');
                              isHl = true;
                          }
                      }

                      return (
                          <div key={`char-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-1 md:mx-2' : 'scale-100 z-10 m-0.5 md:m-1'}`}>
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
                              <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} />
                          </div>
                      )
                  })}
              </div>

              {/* Data Overlay */}
              {!st.isSuccess && selectedOpId === 'slidingWindow' && (
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl px-4">
                    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">targetFreq Map</span>
                        <div className="flex flex-wrap justify-center gap-1.5 min-h-[32px]">
                            {/* Display only characters that are in 't' or have a non-zero count to avoid clutter safely parsing unknown types to Number */}
                            {Object.entries(st.targetFreq || {}).filter(([char, count]) => tSet.has(char) || Number(count) !== 0).map(([char, count]) => {
                                const numCount = Number(count);
                                return (
                                <div key={char} className={`flex items-center rounded border overflow-hidden text-xs font-mono shadow-sm transition-colors ${numCount < 0 ? 'bg-rose-50 border-rose-200' : numCount > 0 ? 'bg-amber-50 border-amber-200' : 'bg-slate-100 border-slate-200'}`}>
                                    <span className="bg-slate-200 px-1.5 py-0.5 font-bold text-slate-700">{char}</span>
                                    <span className={`px-1.5 py-0.5 font-bold ${numCount < 0 ? 'text-rose-600' : numCount > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{numCount}</span>
                                </div>
                                );
                            })}
                            {Object.keys(st.targetFreq || {}).length === 0 && <span className="text-slate-300 text-xs italic">Empty</span>}
                        </div>
                        <span className="text-[9px] text-slate-400 mt-2 font-mono text-center leading-tight">Values &gt; 0 indicate required characters missing.<br/>Values &lt; 0 indicate excess characters in window.</span>
                    </div>
                    
                    <div className={`border-2 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center transition-colors duration-300 ${st.hlMatch ? 'bg-emerald-100 border-emerald-400' : st.hlLost ? 'bg-rose-100 border-rose-400' : st.matched === st.required && st.required > 0 ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200'}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Requirement Check</span>
                        <div className="flex items-center gap-2 font-mono text-xl font-bold text-slate-700">
                            <span className="text-emerald-600" title="Matched Required Chars">{st.matched !== undefined ? st.matched : 0}</span>
                            <span className="text-slate-400">/</span>
                            <span className="text-blue-600" title="Total Required Chars">{st.required !== undefined ? st.required : 0}</span>
                        </div>
                        <div className="mt-1">
                            {st.matched === st.required && st.required > 0 ? (
                                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Valid Window</span>
                            ) : (
                                <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Invalid Window</span>
                            )}
                        </div>
                    </div>

                    <div className={`bg-slate-800 border-2 border-slate-700 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center transition-all ${st.hlUpdate ? 'ring-4 ring-emerald-500 scale-105' : ''}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Current Minimum</span>
                        <div className="flex flex-col items-center">
                            <span className="font-mono text-3xl font-black text-emerald-400">{st.minLen === 999999 ? 'MAX' : st.minLen}</span>
                            {st.minLen !== 999999 && st.minLen !== undefined && (
                                <span className="text-[10px] text-slate-400 font-mono mt-1 tracking-widest uppercase">Start: {st.minStart}</span>
                            )}
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
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                <Focus className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Min Window Substring</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'emerald' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                      LC 76 • Sliding Window
                  </span>
                  <span>•</span>
                  <span>O(S + T) Time</span>
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
                <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-rose-600'}`}><AlignLeft size={28}/> Problem Statement</div>
                
                <p className="text-base leading-relaxed">
                  Given two strings <code>s</code> and <code>t</code> of lengths <code>m</code> and <code>n</code> respectively, return the <strong>minimum window substring</strong> of <code>s</code> such that every character in <code>t</code> (<strong>including duplicates</strong>) is included in the window.<br/><br/>
                  If there is no such substring, return the empty string <code>""</code>.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-emerald-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> s = "ADOBECODEBANC", t = "ABC"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> "BANC"</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: The minimum window substring "BANC" includes 'A', 'B', and 'C' from string t.</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> s = "a", t = "aa"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> ""</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: Both 'a's from t must be included. Since s only has one 'a', return empty string.</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Traps</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-2">
                        <li><code>m == s.length</code>, <code>n == t.length</code></li>
                        <li>1 &lt;= m, n &lt;= 10⁵</li>
                        <li><code>s</code> and <code>t</code> consist of uppercase and lowercase English letters.</li>
                        <li className={`font-bold mt-2 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            Trap: The target string `t` can have duplicate characters! (e.g., if t="AAB", finding a window with "AB" is NOT enough, you must find two "A"s). This is why a simple boolean array won't work; you must track integer frequencies.
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
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white border-emerald-600 scale-[1.02]' : 'bg-rose-600 text-white border-rose-600 scale-[1.02]') : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'text-emerald-200' : 'text-rose-200') : 'text-slate-400'}`}>{op.complexity}</div>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono pl-1 flex justify-between ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                <span>Search String 's'</span>
                            </label>
                            <input 
                                type="text"
                                value={sInput} 
                                onChange={(e) => setSInput(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm uppercase focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-rose-500'}`} 
                                spellCheck={false}
                                placeholder="ADOBECODEBANC"
                            />
                        </div>
                        <div className="w-32 shrink-0 space-y-1.5 group">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono pl-1 flex justify-between ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                <span>Target 't'</span>
                            </label>
                            <input 
                                type="text"
                                value={tInput} 
                                onChange={(e) => setTInput(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm uppercase focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-rose-500'}`} 
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-3 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 group disabled:opacity-30 ${themeColor === 'emerald' ? 'bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700' : 'bg-rose-600 shadow-rose-200 hover:bg-rose-700'}`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
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
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Evaluation Complete</div>
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
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur ${themeColor === 'emerald' ? 'text-emerald-500' : 'text-rose-500'}`}><Layout size={14}/> Window Tracker</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-rose-600'}`}><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-rose-600'}`}><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-rose-600'}`}><Maximize2 size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-20 pb-16 gap-4 items-center overflow-x-auto overflow-y-hidden scrollbar-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           {renderStringArray()}
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
                        <h3 className="font-black text-emerald-400 text-lg uppercase tracking-widest mb-6">The Accordion Logic</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>Think of the sliding window like an accordion playing a tune.</p>
                            <p><strong>Step 1: Expand (Pull the Accordion)</strong><br/>Move the right pointer forward, absorbing characters into the window. Keep expanding until the window contains <i>every single character</i> required by string <code>t</code>. At this point, the window is "valid", but it might be huge and contain lots of garbage characters.</p>
                            <p><strong>Step 2: Shrink (Squeeze the Accordion)</strong><br/>Move the left pointer forward, dropping characters out of the window. We want to squeeze out all the excess garbage. The moment we drop a character that we actually <i>needed</i>, the window breaks and becomes "invalid". We record the length right before it broke, and then go back to expanding!</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-emerald-700 text-lg uppercase tracking-widest mb-6">The `targetFreq` Secret</h3>
                        <div className="space-y-4 text-sm text-emerald-900/80 leading-relaxed font-medium">
                            <p>How do we efficiently check if a window is valid? By using a clever frequency array trick!</p>
                            <p>Initially, <code>targetFreq</code> stores positive counts for characters we NEED. E.g., if <code>t="AAB"</code>, then <code>targetFreq['A'] = 2</code>.</p>
                            <p>As we expand the right pointer, we DECREMENT the array for every character we see. <code>targetFreq[c]--</code>.</p>
                            <p><strong>Positive Number (&gt; 0):</strong> We still NEED this many of this character.<br/><strong>Zero (0):</strong> We have exactly enough of this character!<br/><strong>Negative Number (&lt; 0):</strong> We have an EXCESS of this character inside our window, or it's a garbage character that wasn't in <code>t</code> to begin with.</p>
                            <p>Because of this math, if a value is <code>&gt; 0</code> before we decrement it, we know we just found a truly useful character!</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-emerald-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-emerald-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">The "matched" Variable Optimization</h3>
                    <p className="text-sm text-emerald-50 leading-relaxed italic max-w-2xl font-mono">"Interviewers will closely scrutinize how you verify if the window is valid. A naive approach iterates through the entire frequency map (26 or 128 keys) at EVERY step to check if all values are &lt;= 0. This adds an O(K) multiplier. Using a single `matched` integer variable is the true sign of a Senior Engineer."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><SearchCode size={16}/></div>
                               1. Acknowledge Brute Force
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "The brute force approach is to generate every possible substring of 's' using two nested loops, and then use a helper function to verify if that substring contains all characters of 't'. This would take O(S³) time, or O(S²) with some map optimizations, which is unacceptable."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><ArrowRightLeft size={16}/></div>
                               2. Pivot to Sliding Window
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "Since we are looking for a contiguous substring, this is a textbook Sliding Window problem. I'll use two pointers: `left` and `right`. I will expand `right` until I have a valid window that contains all characters of `t`. Then, I will shrink `left` to find the local minimum, recording the global minimum length as I go."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><ShieldAlert size={16}/></div>
                               3. Detail the O(1) Check Mechanism
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "To verify window validity in O(1) time instead of looping through a map, I will use a `matched` integer. The total required matches is `t.length()`. When moving `right`, if `targetFreq[char] &gt; 0`, it means I needed this character, so I increment `matched`. When shrinking `left`, I increment `targetFreq[char]`, and if it becomes `&gt; 0`, it means I just lost a required character, so I decrement `matched` and break the inner while-loop. This keeps the entire algorithm strictly O(S + T) time complexity."
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
              <div className="w-[650px] 2xl:w-[800px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110] shrink-0">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg ${themeColor === 'emerald' ? 'bg-emerald-500 shadow-emerald-900/50' : 'bg-rose-500 shadow-rose-900/50'}`}><Code2 size={20}/></div>
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
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white shadow-md' : 'bg-rose-600 text-white shadow-md') : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-60 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-rose-600'}`}>Search String 's'</label>
                              <input type="text" value={sInput} onChange={(e) => setSInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs uppercase focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-rose-500'}`} />
                          </div>
                          <div className="w-32 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-rose-600'}`}>Target 't'</label>
                              <input type="text" value={tInput} onChange={(e) => setTInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs uppercase focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-rose-500'}`} />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-rose-50 hover:text-rose-600'}`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-rose-50 hover:text-rose-600'}`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-rose-50 hover:text-rose-600'}`}><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 text-white rounded-[2rem] hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border shadow-2xl ${themeColor === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-400 shadow-emerald-900/30' : 'bg-rose-600 hover:bg-rose-700 border-rose-400 shadow-rose-900/30'}`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 min-w-full w-max min-h-full origin-top-left transition-transform duration-500 flex flex-col p-16 md:p-32 pt-40 gap-16 items-center overflow-visible" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           {renderStringArray()}
                      </div>
                  </div>
                  
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-emerald-500/30`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 bg-emerald-500/20 text-emerald-500 ring-emerald-500/10`}>
                                    <PartyPopper size={48}/>
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    COMPLETED
                                </h2>
                                <p className={`font-mono text-sm uppercase mb-8 tracking-widest text-emerald-400`}>
                                    {String(curStepData.description)}
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