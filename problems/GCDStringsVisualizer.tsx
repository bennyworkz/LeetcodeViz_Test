import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, Maximize, Target, Focus, Type, CheckCircle2, XCircle, ArrowDown, ArrowUp, Layout, TrendingUp, Clock, Layers, Calculator, Combine
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  mathApproach: {
    id: 'mathApproach',
    title: '1. Math + GCD (Optimal)',
    icon: <Calculator size={16} />,
    complexity: 'Time: O(N + M) | Space: O(N + M)',
    code: `public String gcdOfStrings(String str1, String str2) {
    String concat1 = str1 + str2;
    String concat2 = str2 + str1;
    if (!concat1.equals(concat2)) {
        return "";
    }
    int a = str1.length();
    int b = str2.length();
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return str1.substring(0, a);
}`,
    desc: "The Optimal Math Approach. If two strings have a common divisor string, then concatenating them in either order (str1+str2 and str2+str1) MUST yield the exact same result. If they match, the length of their Greatest Common Divisor string is simply the mathematical GCD of their lengths!"
  },
  bruteForce: {
    id: 'bruteForce',
    title: '2. Prefix Check (Naive)',
    icon: <SearchCode size={16} />,
    complexity: 'Time: O(min(N,M) * (N+M)) | Space: O(N+M)',
    code: `public String gcdOfStrings(String str1, String str2) {
    int minLen = Math.min(str1.length(), str2.length());
    for (int i = minLen; i >= 1; i--) {
        if (str1.length() % i == 0 && str2.length() % i == 0) {
            String base = str1.substring(0, i);
            String rep1 = base.repeat(str1.length() / i);
            String rep2 = base.repeat(str2.length() / i);
            if (rep1.equals(str1) && rep2.equals(str2)) {
                return base;
            }
        }
    }
    return "";
}`,
    desc: "The Brute Force / Prefix method. We find the length of the shorter string. We iterate backwards from this length down to 1. If the current length 'i' perfectly divides BOTH string lengths, we take the prefix of length 'i' and see if repeating it constructs both original strings."
  }
};

// --- Helper UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active = false, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|char|return|if|else|for|while|continue|break|new|length|String|StringBuilder|charAt|append|toString|gcdOfStrings|str1|str2|concat1|concat2|equals|substring|a|b|temp|minLen|base|rep1|rep2|repeat|Math|max|min)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  
  const activeStyles = theme === 'emerald' 
    ? { bg: `bg-emerald-500/20`, border: `border-emerald-400`, text: `text-emerald-300` }
    : { bg: `bg-sky-500/20`, border: `border-sky-400`, text: `text-sky-300` };

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
            const isKeyword = ['public', 'private', 'boolean', 'int', 'char', 'return', 'if', 'else', 'for', 'while', 'continue', 'break', 'new'].includes(part);
            const isObject = ['String', 'Math'].includes(part);
            const isVar = ['str1', 'str2', 'concat1', 'concat2', 'a', 'b', 'temp', 'minLen', 'base', 'rep1', 'rep2', 'i'].includes(part);
            const isMapCall = ['length', 'equals', 'substring', 'repeat', 'gcdOfStrings', 'max', 'min'].includes(part);
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

const NodeBlock = ({ val, idx = undefined, themeColor = 'slate', isTarget = false, isDimmed = false, subtext = undefined }) => {
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
            <div className={`flex flex-col items-center min-w-[36px] md:min-w-[42px] min-h-[48px] md:min-h-[56px] border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-xl py-1 bg-white/60 ${activeTheme.text} ${isDimmed ? 'opacity-50' : 'opacity-100'} whitespace-nowrap tracking-tighter`}>
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

export default function GCDStringsVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('mathApproach');
  
  const [str1Input, setStr1Input] = useState('ABABAB');
  const [str2Input, setStr2Input] = useState('ABAB');
  
  const [baseStr1, setBaseStr1] = useState('ABABAB');
  const [baseStr2, setBaseStr2] = useState('ABAB');
  
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
      let clean1 = str1Input.trim().replace(/[^a-zA-Z0-9]/g, '');
      let clean2 = str2Input.trim().replace(/[^a-zA-Z0-9]/g, '');
      
      setBaseStr1(clean1.slice(0, 15)); // Limit for visualizer size
      setBaseStr2(clean2.slice(0, 15));
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
    }, 400);
    return () => clearTimeout(timer);
  }, [str1Input, str2Input, selectedOpId]);

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
    if (!baseStr1 || !baseStr2) return [{ phase: 'Init', description: 'Enter valid strings.', line: 1, state: {} }];

    const len1 = baseStr1.length;
    const len2 = baseStr2.length;
    const w1Arr = baseStr1.split('');
    const w2Arr = baseStr2.split('');

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, description: ds, line: ln, 
        state: { w1Arr, w2Arr, len1, len2, ...st } 
    });

    if (selectedOpId === 'mathApproach') {
        add("Method Call", `public String gcdOfStrings(String str1, String str2)`, 1, { });
        
        let concat1 = baseStr1 + baseStr2;
        add("Create concat1", `String concat1 = str1 + str2;\nCreates "${concat1}"`, 2, { concat1 });
        
        let concat2 = baseStr2 + baseStr1;
        add("Create concat2", `String concat2 = str2 + str1;\nCreates "${concat2}"`, 3, { concat1, concat2 });
        
        add("Compare Concatenations", `if (!concat1.equals(concat2))\nAre "${concat1}" and "${concat2}" identical?`, 4, { concat1, concat2, isComparing: true });
        
        if (concat1 !== concat2) {
            add("Mismatch Detected", `Concatenations do NOT match.\nThis mathematically proves they do not share a common divisor.`, 4, { concat1, concat2, hlMismatch: true });
            add("Return Empty", `return "";`, 5, { concat1, concat2, isSuccess: true, finalAns: '""' });
            return steps;
        }
        
        add("Match Verified", `Strings match!\nThis proves a GCD exists. Now we just need the length of the GCD.`, 6, { concat1, concat2, hlMatch: true });
        
        let a = len1;
        add("Init 'a'", `int a = str1.length(); // a = ${a}`, 7, { a });
        let b = len2;
        add("Init 'b'", `int b = str2.length(); // b = ${b}`, 8, { a, b });
        
        while (b !== 0) {
            add("While Condition", `while (b != 0)\nIs ${b} != 0? (Yes)`, 9, { a, b, isEvaluatingMath: true });
            let temp = b;
            add("Store Temp", `int temp = b; // temp = ${temp}`, 10, { a, b, temp, isMath: true });
            let newB = a % b;
            add("Calculate Modulo", `b = a % b;\n${a} % ${b} = ${newB}`, 11, { a, b: newB, temp, isMath: true, calculatingMod: true, modA: a, modB: b });
            b = newB;
            a = temp;
            add("Reassign 'a'", `a = temp;\na becomes ${a}`, 12, { a, b, temp, isMath: true });
        }
        
        add("While Condition", `while (b != 0)\nIs ${b} != 0? (No, loop breaks)`, 9, { a, b, isEvaluatingMath: true });
        
        let finalAns = baseStr1.substring(0, a);
        add("Return Substring", `return str1.substring(0, a);\nExtracting substring from 0 to ${a}. Result: "${finalAns}"`, 14, { a, b, isSuccess: true, finalAns: `"${finalAns}"`, hlSubstring: a });

    } else if (selectedOpId === 'bruteForce') {
        
        add("Method Call", `public String gcdOfStrings(String str1, String str2)`, 1, { });
        
        let minLen = Math.min(len1, len2);
        add("Find Min Length", `int minLen = Math.min(str1.length(), str2.length());\nminLen = ${minLen}`, 2, { minLen });

        for (let i = minLen; i >= 1; i--) {
            add("Loop Initialization", `for (int i = ${i}; i >= 1; i--)\nTesting prefix of length ${i}.`, 3, { minLen, i });
            
            let mod1 = len1 % i === 0;
            let mod2 = len2 % i === 0;
            add("Check Divisibility", `if (str1.length() % i == 0 && str2.length() % i == 0)\nDoes ${i} perfectly divide both ${len1} and ${len2}?`, 4, { minLen, i, isEvaluatingMod: true });
            
            if (mod1 && mod2) {
                add("Length Valid", `Yes! ${i} perfectly divides both lengths. Proceeding to check string contents.`, 4, { minLen, i, hlModSuccess: true });
                
                let base = baseStr1.substring(0, i);
                add("Extract Base", `String base = str1.substring(0, ${i});\nbase = "${base}"`, 5, { minLen, i, base });
                
                let mult1 = len1 / i;
                let rep1 = base.repeat(mult1);
                add("Construct Rep1", `String rep1 = base.repeat(${mult1});\nCreates "${rep1}"`, 6, { minLen, i, base, rep1, mult1 });
                
                let mult2 = len2 / i;
                let rep2 = base.repeat(mult2);
                add("Construct Rep2", `String rep2 = base.repeat(${mult2});\nCreates "${rep2}"`, 7, { minLen, i, base, rep1, rep2, mult2 });
                
                add("Verify Equality", `if (rep1.equals(str1) && rep2.equals(str2))\nDo the constructed strings perfectly match the originals?`, 8, { minLen, i, base, rep1, rep2, mult1, mult2, isVerifying: true });
                
                if (rep1 === baseStr1 && rep2 === baseStr2) {
                    add("Strings Match!", `Yes! Perfect match found. Returning base.`, 8, { minLen, i, base, rep1, rep2, mult1, mult2, hlStrMatch: true });
                    add("Return Valid Base", `return base;`, 9, { minLen, i, base, rep1, rep2, mult1, mult2, isSuccess: true, finalAns: `"${base}"` });
                    return steps;
                } else {
                    add("Strings Do Not Match", `No. Constructed strings do not match original. Continuing loop.`, 8, { minLen, i, base, rep1, rep2, mult1, mult2, hlStrMismatch: true });
                }
            } else {
                add("Length Invalid", `No. ${i} does not divide both ${len1} and ${len2}. Skipping length ${i}.`, 4, { minLen, i, hlModFail: true });
            }
        }
        
        add("Loop End", `for loop finishes without finding any common divisor.`, 12, { minLen });
        add("Return Empty", `return "";`, 13, { minLen, isSuccess: true, finalAns: '""' });
    }

    return steps;
  }, [baseStr1, baseStr2, selectedOpId]);

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

  const themeColor = selectedOpId === 'mathApproach' ? 'emerald' : 'sky';

  // --- Rendering Helpers ---

  const renderVisuals = () => {
      if (st.w1Arr === undefined) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full mt-2 gap-6 w-full">
              
              {/* Dynamic Presentation Based on State */}
              
              {/* MATH: String Concat View */}
              {selectedOpId === 'mathApproach' && st.concat1 !== undefined && !st.isMath && (
                  <div className="flex flex-col items-center w-full max-w-4xl gap-6 animate-in fade-in duration-500">
                      
                      <div className="flex flex-col items-start w-full">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm ${st.isComparing || st.hlMatch || st.hlMismatch ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-sky-50 text-sky-600 border-sky-200'} flex items-center gap-2`}><Combine size={12}/> concat1 (str1 + str2)</span>
                          <div className={`flex gap-1 p-3 border-[3px] bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[70px] transition-colors ${st.hlMatch ? 'border-emerald-400' : (st.hlMismatch ? 'border-rose-400' : 'border-slate-200')}`}>
                              {st.concat1 && st.concat1.split('').map((val, idx) => {
                                  let color = idx < st.len1 ? 'sky' : 'fuchsia';
                                  return (
                                      <React.Fragment key={`c1-${idx}`}>
                                          <div className="relative transition-all duration-300 scale-100 m-0.5">
                                              <NodeBlock val={val} themeColor={color} />
                                          </div>
                                      </React.Fragment>
                                  )
                              })}
                          </div>
                      </div>

                      <div className="flex flex-col items-start w-full">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm ${st.isComparing || st.hlMatch || st.hlMismatch ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200'} flex items-center gap-2`}><Combine size={12}/> concat2 (str2 + str1)</span>
                          <div className={`flex gap-1 p-3 border-[3px] bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[70px] transition-colors ${st.hlMatch ? 'border-emerald-400' : (st.hlMismatch ? 'border-rose-400' : 'border-slate-200')}`}>
                              {st.concat2 && st.concat2.split('').map((val, idx) => {
                                  let color = idx < st.len2 ? 'fuchsia' : 'sky';
                                  return (
                                      <React.Fragment key={`c2-${idx}`}>
                                          <div className="relative transition-all duration-300 scale-100 m-0.5">
                                              <NodeBlock val={val} themeColor={color} />
                                          </div>
                                      </React.Fragment>
                                  )
                              })}
                          </div>
                      </div>

                      {st.isComparing && (
                          <div className="animate-in zoom-in slide-in-from-top-4 mt-2">
                             <span className="font-mono text-2xl font-black text-amber-600 bg-amber-50 px-6 py-2 rounded-2xl border-2 border-amber-200 shadow-md">Checking Equality...</span>
                          </div>
                      )}
                      {st.hlMatch && (
                          <div className="animate-in zoom-in slide-in-from-top-4 mt-2">
                             <span className="font-mono text-2xl font-black text-emerald-600 bg-emerald-50 px-6 py-2 rounded-2xl border-2 border-emerald-400 shadow-md">Matches Perfectly! GCD Exists.</span>
                          </div>
                      )}
                      {st.hlMismatch && (
                          <div className="animate-in zoom-in slide-in-from-top-4 mt-2">
                             <span className="font-mono text-2xl font-black text-rose-600 bg-rose-50 px-6 py-2 rounded-2xl border-2 border-rose-400 shadow-md">Mismatch! Return Empty.</span>
                          </div>
                      )}

                  </div>
              )}

              {/* MATH: GCD Calculation View */}
              {selectedOpId === 'mathApproach' && (st.isMath || st.isEvaluatingMath || st.a !== undefined) && !st.isComparing && !st.hlMismatch && !st.hlMatch && !st.isSuccess && (
                  <div className="flex flex-col items-center w-full max-w-2xl gap-8 mt-10 animate-in slide-in-from-right-8 duration-500">
                      <div className="bg-slate-800 text-white rounded-3xl p-8 shadow-2xl border-4 border-slate-700 w-full flex flex-col items-center">
                          <span className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><Calculator size={16}/> Euclidean GCD Algorithm</span>
                          
                          <div className="flex items-center gap-8 justify-center w-full">
                              <div className="flex flex-col items-center gap-2">
                                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Variable 'a'</span>
                                  <div className={`text-5xl font-black font-mono transition-all px-6 py-4 rounded-2xl ${st.calculatingMod ? 'text-emerald-400 bg-emerald-900/30 ring-2 ring-emerald-500' : 'text-white bg-slate-900'}`}>
                                      {st.modA !== undefined ? st.modA : st.a}
                                  </div>
                              </div>

                              <div className="text-4xl text-slate-500 font-black">%</div>

                              <div className="flex flex-col items-center gap-2">
                                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Variable 'b'</span>
                                  <div className={`text-5xl font-black font-mono transition-all px-6 py-4 rounded-2xl ${st.calculatingMod ? 'text-sky-400 bg-sky-900/30 ring-2 ring-sky-500' : 'text-white bg-slate-900'}`}>
                                      {st.modB !== undefined ? st.modB : st.b}
                                  </div>
                              </div>
                              
                              {st.calculatingMod && st.modA !== undefined && st.modB !== undefined && st.modB !== 0 && (
                                  <>
                                      <div className="text-4xl text-emerald-500 font-black animate-in slide-in-from-left-4">=</div>
                                      <div className="flex flex-col items-center gap-2 animate-in zoom-in">
                                          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">New 'b'</span>
                                          <div className="text-5xl font-black font-mono text-emerald-400 bg-emerald-900/30 px-6 py-4 rounded-2xl ring-4 ring-emerald-400">
                                              {st.modA % st.modB}
                                          </div>
                                      </div>
                                  </>
                              )}
                          </div>
                      </div>
                  </div>
              )}

              {/* SUCCESS VIEW: MATH */}
              {st.isSuccess && selectedOpId === 'mathApproach' && (
                  <div className="flex flex-col items-start w-full max-w-4xl animate-in slide-in-from-bottom-8">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 shadow-sm flex items-center gap-2"><Target size={12}/> GCD Result Extracted from str1</span>
                      <div className="flex gap-1 p-3 border-[3px] bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[70px] border-emerald-400">
                          {st.w1Arr.map((val, idx) => {
                              let isHl = idx < st.a;
                              let isDimmed = !isHl;
                              return (
                                  <React.Fragment key={`res1-${idx}`}>
                                      <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-1 shadow-lg shadow-emerald-500/20' : 'scale-100 z-10 m-0.5'}`}>
                                          <NodeBlock val={val} themeColor={isHl ? 'emerald' : 'slate'} isTarget={isHl} isDimmed={isDimmed} />
                                      </div>
                                  </React.Fragment>
                              )
                          })}
                      </div>
                  </div>
              )}

              {/* PREFIX BRUTE FORCE VISUALS */}
              {selectedOpId === 'bruteForce' && (
                 <>
                      {/* Original Strings display (always at top) */}
                      <div className="flex flex-col xl:flex-row w-full max-w-5xl gap-4 items-center justify-center">
                          <div className="flex flex-col items-start">
                              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 mb-1 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 shadow-sm flex items-center gap-2">str1 (len: {st.len1})</span>
                              <div className="flex gap-0.5 p-2 border-2 border-slate-200 bg-white/90 rounded-2xl shadow-sm justify-start flex-wrap">
                                  {st.w1Arr.map((val, idx) => <React.Fragment key={`b-w1-${idx}`}><NodeBlock val={val} themeColor="sky" /></React.Fragment>)}
                              </div>
                          </div>
                          <div className="flex flex-col items-start">
                              <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 mb-1 bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200 shadow-sm flex items-center gap-2">str2 (len: {st.len2})</span>
                              <div className="flex gap-0.5 p-2 border-2 border-slate-200 bg-white/90 rounded-2xl shadow-sm justify-start flex-wrap">
                                  {st.w2Arr.map((val, idx) => <React.Fragment key={`b-w2-${idx}`}><NodeBlock val={val} themeColor="fuchsia" /></React.Fragment>)}
                              </div>
                          </div>
                      </div>

                      {/* State Panel */}
                      {!st.isSuccess && (
                          <div className="flex items-center gap-4 mt-4 w-full max-w-5xl">
                              <div className={`flex flex-col items-center bg-white border-2 rounded-2xl p-4 shadow-md transition-all flex-1 ${st.isEvaluatingMod ? 'border-amber-400 bg-amber-50 ring-4 ring-amber-200' : 'border-slate-200'}`}>
                                  <span className={`text-[10px] font-black uppercase tracking-widest mb-2 ${st.isEvaluatingMod ? 'text-amber-600' : 'text-slate-400'}`}>Testing Prefix Length (i)</span>
                                  <span className={`font-mono text-3xl font-black ${st.isEvaluatingMod ? 'text-amber-700' : 'text-slate-700'}`}>{st.i !== undefined ? st.i : '-'}</span>
                              </div>

                              <div className={`flex flex-col items-center bg-white border-2 rounded-2xl p-4 shadow-md transition-all flex-1 ${st.hlModSuccess ? 'border-emerald-400 bg-emerald-50 ring-4 ring-emerald-200' : (st.hlModFail ? 'border-rose-400 bg-rose-50 ring-4 ring-rose-200' : 'border-slate-200')}`}>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Divides Both Lengths?</span>
                                  <span className={`font-mono text-xl font-black text-center leading-tight ${st.hlModSuccess ? 'text-emerald-600' : (st.hlModFail ? 'text-rose-600' : 'text-slate-400')}`}>
                                      {st.hlModSuccess ? "YES" : (st.hlModFail ? "NO" : "WAITING")}
                                  </span>
                              </div>
                          </div>
                      )}

                      {/* Base Construction Simulation */}
                      {st.base && !st.isSuccess && (
                          <div className="flex flex-col w-full max-w-5xl mt-4 gap-4 animate-in slide-in-from-bottom-8">
                               <div className="flex flex-col items-start">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 shadow-sm flex items-center gap-2"><CheckCircle2 size={12}/> Current Valid Base</span>
                                  <div className="flex gap-0.5 p-2 border-2 border-emerald-300 bg-emerald-50/50 rounded-2xl shadow-sm justify-start ring-2 ring-emerald-200 flex-wrap">
                                      {st.base.split('').map((val, idx) => <React.Fragment key={`base-${idx}`}><NodeBlock val={val} themeColor="emerald" /></React.Fragment>)}
                                  </div>
                              </div>
                              
                              {st.rep1 && (
                                  <div className="flex flex-col items-start animate-in slide-in-from-left-4 mt-2">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 shadow-sm flex items-center gap-2">Constructed Rep1 (x{st.mult1})</span>
                                      <div className={`flex gap-0.5 p-2 border-2 rounded-2xl shadow-sm justify-start transition-colors flex-wrap ${st.isVerifying ? 'border-amber-400 bg-amber-50' : (st.hlStrMatch ? 'border-emerald-400 bg-emerald-50' : (st.hlStrMismatch ? 'border-rose-400 bg-rose-50' : 'border-indigo-300 bg-indigo-50/50'))}`}>
                                          {st.rep1.split('').map((val, idx) => <React.Fragment key={`rep1-${idx}`}><NodeBlock val={val} themeColor={st.isVerifying ? 'amber' : (st.hlStrMatch ? 'emerald' : (st.hlStrMismatch ? 'rose' : 'indigo'))} /></React.Fragment>)}
                                      </div>
                                  </div>
                              )}
                              
                              {st.rep2 && (
                                  <div className="flex flex-col items-start animate-in slide-in-from-left-4">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 shadow-sm flex items-center gap-2">Constructed Rep2 (x{st.mult2})</span>
                                      <div className={`flex gap-0.5 p-2 border-2 rounded-2xl shadow-sm justify-start transition-colors flex-wrap ${st.isVerifying ? 'border-amber-400 bg-amber-50' : (st.hlStrMatch ? 'border-emerald-400 bg-emerald-50' : (st.hlStrMismatch ? 'border-rose-400 bg-rose-50' : 'border-indigo-300 bg-indigo-50/50'))}`}>
                                          {st.rep2.split('').map((val, idx) => <React.Fragment key={`rep2-${idx}`}><NodeBlock val={val} themeColor={st.isVerifying ? 'amber' : (st.hlStrMatch ? 'emerald' : (st.hlStrMismatch ? 'rose' : 'indigo'))} /></React.Fragment>)}
                                      </div>
                                  </div>
                              )}
                          </div>
                      )}
                 </>
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
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-sky-600'}`}>
                <Focus className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">GCD of Strings</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'emerald' ? 'text-emerald-600 bg-emerald-50' : 'text-sky-600 bg-sky-50'}`}>
                      LC 1071 • Math / String
                  </span>
                  <span>•</span>
                  <span>O(N+M) Time Constraint</span>
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
                <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-sky-600'}`}><AlignLeft size={28}/> Problem Statement</div>
                
                <p className="text-base leading-relaxed">
                  For two strings <code>s</code> and <code>t</code>, we say "<code>t</code> divides <code>s</code>" if and only if <code>s = t + t + t + ... + t + t</code> (i.e., <code>t</code> is concatenated with itself one or more times).<br/><br/>
                  Given two strings <code>str1</code> and <code>str2</code>, return the largest string <code>x</code> such that <code>x</code> divides both <code>str1</code> and <code>str2</code>.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-emerald-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> str1 = "ABCABC", str2 = "ABC"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> "ABC"</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation: "ABC" divides both strings cleanly.
str1 = "ABC" + "ABC"
str2 = "ABC"
                        </div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> str1 = "ABABAB", str2 = "ABAB"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> "AB"</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation: "AB" divides both strings.
str1 = "AB" + "AB" + "AB"
str2 = "AB" + "AB"
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Traps</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-2">
                        <li>1 &lt;= str1.length, str2.length &lt;= 1000</li>
                        <li><code>str1</code> and <code>str2</code> consist of English uppercase letters.</li>
                        <li className={`font-bold mt-2 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-sky-600'}`}>
                            Trap: Don't get stuck generating substrings manually. Notice the mathematical property: if they share a common building block, adding them together in either order (A+B vs B+A) will perfectly align!
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
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white border-emerald-600 scale-[1.02]' : 'bg-sky-600 text-white border-sky-600 scale-[1.02]') : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'text-emerald-200' : 'text-sky-200') : 'text-slate-400'}`}>{op.complexity}</div>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono pl-1 flex justify-between ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-sky-600'}`}>
                                <span>'str1'</span>
                            </label>
                            <input 
                                type="text"
                                value={str1Input} 
                                onChange={(e) => setStr1Input(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner uppercase ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-sky-500'}`} 
                                spellCheck={false}
                                placeholder="ABABAB"
                            />
                        </div>
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono pl-1 flex justify-between ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-sky-600'}`}>
                                <span>'str2'</span>
                            </label>
                            <input 
                                type="text"
                                value={str2Input} 
                                onChange={(e) => setStr2Input(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner uppercase ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-sky-500'}`} 
                                spellCheck={false}
                                placeholder="ABAB"
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-3 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 group disabled:opacity-30 ${themeColor === 'emerald' ? 'bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700' : 'bg-sky-600 shadow-sky-200 hover:bg-sky-700'}`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
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
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur ${themeColor === 'emerald' ? 'text-emerald-500' : 'text-sky-500'}`}><Layout size={14}/> State Tracker</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-sky-600'}`}><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-sky-600'}`}><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-sky-600'}`}><Maximize2 size={16}/></button>
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
                        <h3 className="font-black text-emerald-400 text-lg uppercase tracking-widest mb-6">The Magical Math Insight</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>How do we know if two strings have a common divisor WITHOUT checking every substring?</p>
                            <p>Think of strings as building blocks. If <code>str1</code> is made of 3 blocks of "AB" and <code>str2</code> is made of 2 blocks of "AB", then:</p>
                            <p><code>str1 + str2</code> = 5 blocks of "AB".</p>
                            <p><code>str2 + str1</code> = 5 blocks of "AB".</p>
                            <p><strong>If they are made of the same blocks, the order in which you concatenate them doesn't matter!</strong> If <code>(str1 + str2) != (str2 + str1)</code>, it mathematically proves no common divisor exists.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-sky-50 border border-sky-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-sky-700 text-lg uppercase tracking-widest mb-6">Extracting the GCD</h3>
                        <div className="space-y-4 text-sm text-sky-900/80 leading-relaxed font-medium">
                            <p>Once we prove a common divisor exists via concatenation, what is its length?</p>
                            <p>The length of the <strong>Greatest</strong> Common Divisor string is simply the mathematical GCD of the two string lengths!</p>
                            <p>If <code>str1</code> is length 6, and <code>str2</code> is length 4, the largest block size that perfectly fits into both is <code>gcd(6, 4) = 2</code>.</p>
                            <p>We just use the Euclidean Algorithm to find <code>2</code>, and return the substring from index 0 to 2.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-emerald-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-emerald-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Abstracting to Math</h3>
                    <p className="text-sm text-emerald-50 leading-relaxed italic max-w-2xl font-mono">"Interviewers use this problem to see if you can step back from writing messy `for` loops and identify a broader mathematical property. Finding the `str1 + str2 == str2 + str1` trick demonstrates strong lateral thinking and transforms a messy string parsing problem into a 4-line math equation."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><SearchCode size={16}/></div>
                               1. Acknowledge the Prefix Strategy
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "A naive approach is to iterate backwards from the minimum length of both strings, checking if the length perfectly divides both strings. If it does, we extract that prefix and simulate repeating it to see if it constructs both strings. This works but requires multiple string copies and iterations."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Combine size={16}/></div>
                               2. Pivot to the Mathematical Trick
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "We can optimize this completely by recognizing a mathematical property. If two strings share a common base string, they are essentially just multiples of that base. Therefore, concatenating them as `str1 + str2` must yield the exact same sequence as `str2 + str1`. If they don't equal, we instantly return an empty string."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Calculator size={16}/></div>
                               3. Explain the Final Extraction
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "Once we prove that a common divisor exists via the concatenation check, finding the 'greatest' common divisor is simple. The length of the answer is mathematically the Greatest Common Divisor (GCD) of `str1.length()` and `str2.length()`. I'll write a quick Euclidean algorithm helper to find the GCD of the two integers, and just return `str1.substring(0, gcdLength)`."
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
                          <div className={`p-2 rounded-lg text-white shadow-lg ${themeColor === 'emerald' ? 'bg-emerald-500 shadow-emerald-900/50' : 'bg-sky-500 shadow-sky-900/50'}`}><Code2 size={20}/></div>
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
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white shadow-md' : 'bg-sky-600 text-white shadow-md') : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-40 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-sky-600'}`}>'str1'</label>
                              <input type="text" value={str1Input} onChange={(e) => setStr1Input(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner uppercase ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-sky-500'}`} />
                          </div>
                          <div className="w-40 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-sky-600'}`}>'str2'</label>
                              <input type="text" value={str2Input} onChange={(e) => setStr2Input(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner uppercase ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-sky-500'}`} />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-sky-50 hover:text-sky-600'}`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-sky-50 hover:text-sky-600'}`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-sky-50 hover:text-sky-600'}`}><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 text-white rounded-[2rem] hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border shadow-2xl ${themeColor === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-400 shadow-emerald-900/30' : 'bg-sky-600 hover:bg-sky-700 border-sky-400 shadow-sky-900/30'}`}>NEXT <ChevronRight size={32}/></button>
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
                                    {st.finalAns !== '""' ? <PartyPopper size={48} /> : <XCircle size={48} />}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    COMPLETED
                                </h2>
                                <p className={`font-mono text-xl uppercase mb-8 tracking-widest text-emerald-400 max-w-lg break-words`}>
                                    Result: <span className="font-black text-3xl text-white ml-2 block mt-2">{st.finalAns}</span>
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