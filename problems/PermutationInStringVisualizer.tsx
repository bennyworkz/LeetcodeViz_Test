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
    complexity: 'Time: O(S1 + S2) | Space: O(1)', // ASCII array is O(1) space
    code: `public boolean checkInclusion(String s1, String s2) {
    int[] targetFreq = new int[128];
    for (char c : s1.toCharArray()) {
        targetFreq[c]++;
    }
    int left = 0, matched = 0, required = s1.length();
    for (int right = 0; right < s2.length(); right++) {
        char rightChar = s2.charAt(right);
        if (targetFreq[rightChar] > 0) {
            matched++;
        }
        targetFreq[rightChar]--;
        if (right - left + 1 > required) {
            char leftChar = s2.charAt(left);
            if (targetFreq[leftChar] >= 0) {
                matched--;
            }
            targetFreq[leftChar]++;
            left++;
        }
        if (matched == required) {
            return true;
        }
    }
    return false;
}`,
    desc: "The Fixed-Size Sliding Window. Since a permutation must be exactly the length of 's1', we maintain a window that never exceeds 's1.length()'. As we slide the right edge forward, if the window gets too large, we simultaneously pull the left edge forward, behaving like a rigid frame moving across the string. If we match everything, we return true."
  },
  bruteForce: {
    id: 'bruteForce',
    title: '2. Brute Force (Naive)',
    icon: <SearchCode size={16} />,
    complexity: 'Time: O(S2 * S1) | Space: O(S1)',
    code: `public boolean checkInclusion(String s1, String s2) {
    int len1 = s1.length();
    if (s2.length() < len1) return false;
    
    // Check every possible substring of length s1
    for (int i = 0; i <= s2.length() - len1; i++) {
        String sub = s2.substring(i, i + len1);
        if (isPermutation(sub, s1)) {
            return true;
        }
    }
    return false;
}

private boolean isPermutation(String sub, String s1) {
    int[] counts = new int[128];
    for (char c : sub.toCharArray()) counts[c]++;
    for (char c : s1.toCharArray()) {
        if (--counts[c] < 0) return false;
    }
    return true;
}`,
    desc: "The Naive method isolates every possible substring of length 's1' in the string 's2' and manually verifies if it is a permutation by comparing character frequencies from scratch every single time. It is highly repetitive and inefficient."
  }
};

// --- Helper UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|char|return|if|else|for|while|continue|break|new|length|String|charAt|substring|Math|max|toCharArray|Integer|MAX_VALUE|checkInclusion|isPermutation)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  
  const activeStyles = theme === 'emerald' 
    ? { bg: `bg-emerald-500/20`, border: `border-emerald-400`, text: `text-emerald-300` }
    : { bg: `bg-rose-500/20`, border: `border-rose-400`, text: `text-rose-300` };

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
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'char', 'return', 'if', 'else', 'for', 'while', 'continue', 'break', 'new'].includes(part);
            const isObject = ['String', 'Math', 'Integer'].includes(part);
            const isVar = ['s1', 's2', 'targetFreq', 'left', 'matched', 'required', 'right', 'rightChar', 'leftChar', 'c', 'sub', 'counts', 'i', 'j', 'len1'].includes(part);
            const isMapCall = ['length', 'charAt', 'substring', 'max', 'toCharArray', 'MAX_VALUE', 'checkInclusion', 'isPermutation'].includes(part);
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

export default function PermutationInStringVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('slidingWindow');
  
  const [s2Input, setS2Input] = useState('eidbaooo');
  const [s1Input, setS1Input] = useState('ab');
  
  const [baseS2, setBaseS2] = useState('eidbaooo');
  const [baseS1, setBaseS1] = useState('ab');
  
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

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      setBaseS2(s2Input.substring(0, 20).toLowerCase().replace(/[^a-z]/g, '')); 
      setBaseS1(s1Input.substring(0, 10).toLowerCase().replace(/[^a-z]/g, ''));
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
    }, 400);
    return () => clearTimeout(timer);
  }, [s2Input, s1Input, selectedOpId]);

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
    if (!baseS2 || !baseS1) return [{ phase: 'Init', description: 'Enter valid strings for s1 and s2.', line: 1, state: { s2Arr: [], counts: {} } }];

    let s2Arr = baseS2.split('');
    let s1Arr = baseS1.split('');
    let n = s2Arr.length;

    const cloneFreq = (obj) => ({...obj});

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, description: ds, line: ln, 
        state: { s2Arr: [...s2Arr], s1Arr: [...s1Arr], n, ...st } 
    });

    if (selectedOpId === 'slidingWindow') {
        let targetFreq = {};
        
        add("Function Call", `public boolean checkInclusion("${baseS1}", "${baseS2}")`, 1, { targetFreq: cloneFreq(targetFreq) });
        add("Init Frequency Map", `int[] targetFreq = new int[128];\nMap to track characters required to form a permutation.`, 2, { targetFreq: cloneFreq(targetFreq) });
        add("Loop Target String", `for (char c : s1.toCharArray()) { ... }\nPopulating required frequencies from s1.`, 3, { targetFreq: cloneFreq(targetFreq) });
        
        for(let i=0; i<s1Arr.length; i++) {
            let charC = s1Arr[i];
            targetFreq[charC] = (Number(targetFreq[charC]) || 0) + 1;
            add("Populate Frequencies", `targetFreq['${charC}']++;\nWe need ${targetFreq[charC]} '${charC}'s to make a permutation.`, 4, { targetFreq: cloneFreq(targetFreq) });
        }
        add("End Target Loop", `}`, 5, { targetFreq: cloneFreq(targetFreq) });

        let left = 0, matched = 0, required = baseS1.length;
        add("Init Pointers & Counters", `int left = 0, matched = 0, required = ${required};\n'matched' tracks useful characters. 'required' is target window size.`, 6, { targetFreq: cloneFreq(targetFreq), left, matched, required });

        for (let right = 0; right < n; right++) {
            add("Expand Window", `for (int right = ${right}; right < ${n}; right++) {\nSlide the right boundary of the window.`, 7, { targetFreq: cloneFreq(targetFreq), left, right, matched, required, isExpanding: true });
            
            let rightChar = s2Arr[right];
            add("Get Character", `char rightChar = s2.charAt(${right}); // '${rightChar}'`, 8, { targetFreq: cloneFreq(targetFreq), left, right, rightChar, matched, required, isExpanding: true });
            
            add("Check Requirement", `if (targetFreq['${rightChar}'] > 0) {\nDoes '${rightChar}' fulfill a missing permutation character? (${Number(targetFreq[rightChar]) || 0} > 0)`, 9, { targetFreq: cloneFreq(targetFreq), left, right, rightChar, matched, required, checkingExpand: true, isExpanding: true });
            
            if ((Number(targetFreq[rightChar]) || 0) > 0) {
                matched++;
                add("Increment Matched", `matched++;\nYes! '${rightChar}' is useful. Matched is now ${matched}.`, 10, { targetFreq: cloneFreq(targetFreq), left, right, rightChar, matched, required, isExpanding: true, hlMatch: true });
            }
            add("End If", `}`, 11, { targetFreq: cloneFreq(targetFreq), left, right, rightChar, matched, required, isExpanding: true });

            targetFreq[rightChar] = (Number(targetFreq[rightChar]) || 0) - 1;
            add("Decrement Target Freq", `targetFreq['${rightChar}']--;\nValue becomes ${targetFreq[rightChar]}. We process it into our window.`, 12, { targetFreq: cloneFreq(targetFreq), left, right, rightChar, matched, required, isExpanding: true });

            let currentWindowSize = right - left + 1;
            add("Check Window Size", `if (right - left + 1 > required)\nIs window (${currentWindowSize}) larger than s1 (${required})?`, 13, { targetFreq: cloneFreq(targetFreq), left, right, rightChar, matched, required, isExpanding: false, checkingShrink: true, currentWindowSize });
            
            if (currentWindowSize > required) {
                let leftChar = s2Arr[left];
                add("Get Left Character", `char leftChar = s2.charAt(${left}); // '${leftChar}'\nWindow is too big. Prepare to shrink from the left.`, 14, { targetFreq: cloneFreq(targetFreq), left, right, rightChar, leftChar, matched, required, isShrinking: true });

                add("Check if Broken", `if (targetFreq['${leftChar}'] >= 0)\nWas '${leftChar}' contributing to our match? (${Number(targetFreq[leftChar])} >= 0)`, 15, { targetFreq: cloneFreq(targetFreq), left, right, rightChar, leftChar, matched, required, isShrinking: true, checkingShrinkCond: true });
                
                if (Number(targetFreq[leftChar]) >= 0) {
                    matched--;
                    add("Decrement Matched", `matched--;\nYes, we lost a useful character. Matched is now ${matched}.`, 16, { targetFreq: cloneFreq(targetFreq), left, right, rightChar, leftChar, matched, required, isShrinking: true, hlLost: true });
                }
                add("End If", `}`, 17, { targetFreq: cloneFreq(targetFreq), left, right, rightChar, leftChar, matched, required, isShrinking: true });

                targetFreq[leftChar] = (Number(targetFreq[leftChar]) || 0) + 1;
                add("Restore Target Freq", `targetFreq['${leftChar}']++;\nValue becomes ${targetFreq[leftChar]}. We put the requirement back.`, 18, { targetFreq: cloneFreq(targetFreq), left, right, rightChar, leftChar, matched, required, isShrinking: true });

                left++;
                add("Move Left Pointer", `left++;\nShrink completed. 'left' is now ${left}.`, 19, { targetFreq: cloneFreq(targetFreq), left, right, rightChar, leftChar, matched, required, isShrinking: true });
            }
            add("End Size Check", `}`, 20, { targetFreq: cloneFreq(targetFreq), left, right, rightChar, matched, required });

            add("Check For Permutation", `if (matched == required)\nDo we have a permutation? (${matched} == ${required})`, 21, { targetFreq: cloneFreq(targetFreq), left, right, rightChar, matched, required, checkingAnagram: true });
            if (matched === required) {
                add("Found Permutation!", `return true;\nPermutation found! Window matches exactly.`, 22, { targetFreq: cloneFreq(targetFreq), left, right, rightChar, matched, required, hlSuccess: true, isSuccess: true, foundPermutation: true });
                return steps;
            }
            add("End If", `}`, 23, { targetFreq: cloneFreq(targetFreq), left, right, rightChar, matched, required });
        }
        add("End For", `}`, 24, { targetFreq: cloneFreq(targetFreq), left, right: n-1, matched, required });

        add("Return False", `return false;\nAlgorithm complete. No permutation was found.`, 25, { targetFreq: cloneFreq(targetFreq), left, right: n-1, matched, required, isSuccess: true, foundPermutation: false });

    } else if (selectedOpId === 'bruteForce') {
        let len1 = baseS1.length;
        add("Init", `int len1 = ${len1};`, 2, { len1 });

        if (n < len1) {
            add("Early Return", `if (s2.length() < len1) return false;\ns2 is smaller than s1. Impossible to have a permutation.`, 3, { len1, isSuccess: true, foundPermutation: false });
            return steps;
        }

        for (let i = 0; i <= n - len1; i++) {
            add("Outer Loop", `for (int i = ${i}; ...)\nStart analyzing substring at index ${i}.`, 6, { i, len1 });
            let sub = baseS2.substring(i, i + len1);
            add("Get Substring", `String sub = s2.substring(${i}, ${i + len1}); // "${sub}"`, 7, { i, len1, sub });
            
            add("Call isPermutation", `if (isPermutation("${sub}", "${baseS1}"))`, 8, { i, len1, sub, checkingSub: true });
            
            let tempCount = {};
            for (let c of baseS1) tempCount[c] = (Number(tempCount[c]) || 0) + 1;
            for (let c of sub) {
                if(tempCount[c] !== undefined) {
                     tempCount[c] = Number(tempCount[c]) - 1;
                } else {
                     tempCount[c] = -1; 
                }
            }
            let isPerm = Object.values(tempCount).every(v => Number(v) === 0);

            if (isPerm) {
                add("Valid Permutation!", `return true;\n"${sub}" is a permutation of "${baseS1}".`, 9, { i, len1, sub, validSub: true, isSuccess: true, foundPermutation: true });
                return steps;
            } else {
                add("Not Permutation", `Substrings do not match character frequencies.`, 8, { i, len1, sub, invalidSub: true });
            }
        }
        add("Return False", `return false;\nNo permutations were found.`, 12, { isSuccess: true, foundPermutation: false });
    }

    return steps;
  }, [baseS2, baseS1, selectedOpId]);

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

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { s2Arr: [], targetFreq: {} } };
  const st = curStepData.state || { s2Arr: [], targetFreq: {} };
  const isLastStep = currentStep === trace.length - 1;

  const themeColor = selectedOpId === 'slidingWindow' ? 'emerald' : 'rose';

  // --- Rendering Helpers ---

  const renderStringArray = () => {
      if (!st.s2Arr || st.s2Arr.length === 0) return <span className="text-slate-400 italic">empty</span>;

      const pSet = new Set(baseS1.split(''));

      return (
          <div className="flex flex-col items-center w-full mt-4">
              <div className="flex gap-2 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center items-center">
                  
                  {st.s2Arr.map((val, idx) => {
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
                          
                          if (st.rightChar !== undefined && idx === st.right && st.isExpanding) {
                              isHl = true;
                              color = 'amber';
                          }
                          if (st.leftChar !== undefined && idx === st.left && st.isShrinking) {
                              isHl = true;
                              color = 'amber';
                          }
                          if (st.hlSuccess && idx >= st.left && idx <= st.right) {
                              color = 'emerald';
                              isHl = true;
                          }
                      } 
                      // --- Brute Force Visuals ---
                      else if (selectedOpId === 'bruteForce') {
                          if (st.i === idx) labels.push({ text: 'i', color: 'indigo', pos: 'bottom' });

                          if ((st.checkingSub || st.validSub || st.invalidSub) && idx >= st.i && idx < st.i + st.len1) {
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
                            {Object.entries(st.targetFreq || {}).filter(([char, count]) => pSet.has(char) || Number(count) !== 0).map(([char, count]) => {
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
                                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Valid Permutation!</span>
                            ) : (
                                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Not Permutation</span>
                            )}
                        </div>
                    </div>

                    <div className={`bg-slate-800 border-2 border-slate-700 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center transition-all ${st.hlSuccess ? 'ring-4 ring-emerald-500 scale-105' : ''}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Result</span>
                        <div className="flex flex-wrap gap-1.5 justify-center">
                             <span className="font-mono text-2xl font-black text-slate-500 tracking-widest uppercase">FALSE</span>
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Permutation in String</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'emerald' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                      LC 567 • Sliding Window
                  </span>
                  <span>•</span>
                  <span>O(S1 + S2) Time</span>
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
                  Given two strings <code>s1</code> and <code>s2</code>, return <code>true</code> if <code>s2</code> contains a permutation of <code>s1</code>, or <code>false</code> otherwise.<br/><br/>
                  In other words, return <code>true</code> if one of <code>s1</code>'s permutations is the substring of <code>s2</code>.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-emerald-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> s1 = "ab", s2 = "eidbaooo"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> true</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation:<br/>s2 contains one permutation of s1 ("ba").</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> s1 = "ab", s2 = "eidboaoo"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> false</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation:<br/>s2 does not contain any full permutation block of s1.</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Traps</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-2">
                        <li>1 &lt;= s1.length, s2.length &lt;= 10⁴</li>
                        <li><code>s1</code> and <code>s2</code> consist of lowercase English letters.</li>
                        <li className={`font-bold mt-2 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            Trap: Because a permutation must contain the exact same quantity of characters as `s1`, a valid window's size will ALWAYS be exactly equal to `s1.length()`. You don't need a dynamic shrinking loop; a simple strict size condition `if (right - left + 1 &gt; s1.length())` is enough!
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
                                <span>Search String 's2'</span>
                            </label>
                            <input 
                                type="text"
                                value={s2Input} 
                                onChange={(e) => setS2Input(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm uppercase focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-rose-500'}`} 
                                spellCheck={false}
                                placeholder="eidbaooo"
                            />
                        </div>
                        <div className="w-32 shrink-0 space-y-1.5 group">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono pl-1 flex justify-between ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                <span>Target 's1'</span>
                            </label>
                            <input 
                                type="text"
                                value={s1Input} 
                                onChange={(e) => setS1Input(e.target.value)} 
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

                <div className={`rounded-3xl p-6 shadow-xl border transition-all duration-300 min-h-[130px] relative overflow-hidden flex-1 ${st.isSuccess ? (st.foundPermutation ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={80} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-2 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className={`text-xl font-black tracking-tight uppercase font-mono flex items-center gap-3 ${st.foundPermutation ? 'text-emerald-400' : 'text-rose-400'}`}>{st.foundPermutation ? <PartyPopper size={20}/> : <XCircle size={20}/>} Evaluation Complete</div>
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
                        <h3 className="font-black text-emerald-400 text-lg uppercase tracking-widest mb-6">The Rigid Frame</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>Unlike the "Minimum Window Substring" algorithm where the window expands and shrinks variably like an accordion, finding a Permutation requires a <strong>Fixed-Size Sliding Window</strong>.</p>
                            <p>A permutation is strictly a rearrangement of letters. Therefore, the length of the valid permutation MUST be exactly equal to the length of string <code>s1</code>. It cannot be any longer, and it cannot be any shorter.</p>
                            <p>Our algorithm pulls the <code>right</code> pointer forward to absorb characters. But the moment the width of our window <code>(right - left + 1)</code> exceeds <code>s1.length()</code>, we immediately pull the <code>left</code> pointer forward. It acts like a rigid, fixed-width frame moving across the text.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-emerald-700 text-lg uppercase tracking-widest mb-6">The `targetFreq` Secret</h3>
                        <div className="space-y-4 text-sm text-emerald-900/80 leading-relaxed font-medium">
                            <p>How do we avoid checking an entire Hash Map every single loop? We use a frequency array and a <code>matched</code> counter!</p>
                            <p>We populate <code>targetFreq</code> with the characters we NEED. E.g., if <code>s1="abc"</code>, then <code>targetFreq['a'] = 1</code>, <code>b = 1</code>, <code>c = 1</code>.</p>
                            <p>As we slide our rigid window to the right, we subtract from the array. <code>targetFreq[c]--</code>. If it was positive before subtracting, we know we just grabbed a "useful" character, so we increment <code>matched</code>.</p>
                            <p>When the window slides forward from the left, we push the character back out and add to the array: <code>targetFreq[c]++</code>. If it becomes positive, we know we just lost a "useful" character, so we decrement <code>matched</code>!</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-emerald-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-emerald-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering Fixed vs Dynamic Windows</h3>
                    <p className="text-sm text-emerald-50 leading-relaxed italic max-w-2xl font-mono">"Interviewers want to see if you can distinguish between a Dynamic Window (like LC 76 Min Window Substring, where shrinking happens inside a while-loop) and a Fixed Window (like LC 567, where shrinking happens inside a simple if-statement because the size is predetermined). Showing you understand this architectural difference is crucial."</p>
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
                                "The brute force approach is to iterate through 's2', taking every substring of length 's1', and using a helper function with frequency arrays to verify if it's a permutation. This takes O(S2 * S1) time, which scales poorly."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><ArrowRightLeft size={16}/></div>
                               2. Pivot to Fixed Sliding Window
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "Because the target is an exact permutation, our window size is strictly fixed to 's1.length()'. I will use a Sliding Window approach. I can expand the right pointer to add characters to my tracking map. Whenever the window size exceeds 's1.length()', I immediately remove the left pointer character and shift left forward."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><ShieldAlert size={16}/></div>
                               3. Detail the O(1) Check Mechanism
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "To verify the window is a valid permutation in O(1) time without looping over an entire hash map at every step, I will maintain a `matched` counter. When a character enters the window and is required, I increment `matched`. When a character leaves the window and is required, I decrement it. If `matched == s1.length()`, I instantly return true. This keeps the algorithm strictly O(S1 + S2) time."
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
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? (st.foundPermutation ? 'bg-emerald-900/40 border-emerald-800' : 'bg-rose-900/40 border-rose-800') : 'bg-slate-800/40 border-slate-700'}`}>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-rose-600'}`}>Search String 's2'</label>
                              <input type="text" value={s2Input} onChange={(e) => setS2Input(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs uppercase focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-rose-500'}`} />
                          </div>
                          <div className="w-32 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-rose-600'}`}>Target 's1'</label>
                              <input type="text" value={s1Input} onChange={(e) => setS1Input(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs uppercase focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-rose-500'}`} />
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
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.foundPermutation ? 'border-emerald-500 shadow-emerald-500/30' : 'border-rose-500 shadow-rose-500/30'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.foundPermutation ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ${st.foundPermutation ? 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10' : 'bg-rose-500/20 text-rose-500 ring-rose-500/10'}`}>
                                    {st.foundPermutation ? <PartyPopper size={48}/> : <XCircle size={48}/>}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    COMPLETED
                                </h2>
                                <p className={`font-mono text-sm uppercase mb-8 tracking-widest ${st.foundPermutation ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {String(curStepData.description)}
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg ${st.foundPermutation ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/20'}`}>
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