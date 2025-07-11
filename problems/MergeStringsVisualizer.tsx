import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, Maximize, Target, Focus, Type, CheckCircle2, XCircle, ArrowDown, ArrowUp, Layout, TrendingUp, Clock, Layers
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  twoPointers: {
    id: 'twoPointers',
    title: '1. Two Pointers (Optimal)',
    icon: <ArrowRightLeft size={16} />,
    complexity: 'Time: O(N + M) | Space: O(N + M)',
    code: `public String mergeAlternately(String word1, String word2) {
    StringBuilder result = new StringBuilder();
    int i = 0, j = 0;
    
    while (i < word1.length() || j < word2.length()) {
        if (i < word1.length()) {
            result.append(word1.charAt(i));
            i++;
        }
        if (j < word2.length()) {
            result.append(word2.charAt(j));
            j++;
        }
    }
    
    return result.toString();
}`,
    desc: "The Optimal Two Pointers approach. We use a StringBuilder to efficiently build the new string. We use two pointers, 'i' and 'j', to track our positions in 'word1' and 'word2'. We loop as long as AT LEAST ONE string still has characters remaining, appending alternately."
  },
  stringConcat: {
    id: 'stringConcat',
    title: '2. String Concat (Naive)',
    icon: <SearchCode size={16} />,
    complexity: 'Time: O((N+M)²) | Space: O(N+M)',
    code: `public String mergeAlternately(String word1, String word2) {
    String result = "";
    int i = 0;
    
    while (i < word1.length() && i < word2.length()) {
        result += word1.charAt(i);
        result += word2.charAt(i);
        i++;
    }
    
    while (i < word1.length()) {
        result += word1.charAt(i);
        i++;
    }
    
    while (i < word2.length()) {
        result += word2.charAt(i);
        i++;
    }
    
    return result;
}`,
    desc: "The Naive String Concatenation method. While logically correct, using '+=' with standard Strings in Java creates a brand new String object in memory every single iteration. This leads to an O((N+M)²) time complexity due to constant reallocation and copying."
  }
};

// --- Helper UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|char|return|if|else|for|while|continue|break|new|length|String|StringBuilder|charAt|append|toString|mergeAlternately|word1|word2|result|i|j)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  
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
            const isObject = ['String', 'StringBuilder', 'Math', 'Integer'].includes(part);
            const isVar = ['word1', 'word2', 'result', 'i', 'j'].includes(part);
            const isMapCall = ['length', 'charAt', 'append', 'toString', 'mergeAlternately'].includes(part);
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

const PointerLabel = ({ label, color, position }) => {
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

const NodeBlock = ({ val, idx, themeColor = 'slate', isTarget, isDimmed, subtext }) => {
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

export default function MergeStringsVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('twoPointers');
  
  const [word1Input, setWord1Input] = useState('abc');
  const [word2Input, setWord2Input] = useState('pqrst');
  
  const [baseWord1, setBaseWord1] = useState('abc');
  const [baseWord2, setBaseWord2] = useState('pqrst');
  
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
      let clean1 = word1Input.trim().replace(/[^a-zA-Z0-9]/g, '');
      let clean2 = word2Input.trim().replace(/[^a-zA-Z0-9]/g, '');
      
      setBaseWord1(clean1.slice(0, 15)); // Limit for visualizer size
      setBaseWord2(clean2.slice(0, 15));
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
    }, 400);
    return () => clearTimeout(timer);
  }, [word1Input, word2Input, selectedOpId]);

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
    if (!baseWord1 && !baseWord2) return [{ phase: 'Init', description: 'Enter valid strings.', line: 1, state: {} }];

    const len1 = baseWord1.length;
    const len2 = baseWord2.length;
    const w1Arr = baseWord1.split('');
    const w2Arr = baseWord2.split('');

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, description: ds, line: ln, 
        state: { w1Arr, w2Arr, len1, len2, ...st } 
    });

    if (selectedOpId === 'twoPointers') {
        let result = [];
        let i = 0, j = 0;
        
        add("Method Call", `public String mergeAlternately(String word1, String word2)`, 1, { result: [...result], i, j });
        
        add("Init StringBuilder", `StringBuilder result = new StringBuilder();\nAllocates an efficient mutable sequence of characters.`, 2, { result: [...result], i, j });
        add("Init Pointers", `int i = 0, j = 0;\nPointer 'i' for word1, pointer 'j' for word2.`, 3, { result: [...result], i, j });

        while (true) {
            let evalCond = (i < len1 || j < len2);
            add("While Condition", `while (i < word1.length() || j < word2.length())\nIs ${i} < ${len1} OR ${j} < ${len2}? (${evalCond ? 'Yes' : 'No'})`, 5, { result: [...result], i, j, isEvaluating: true });
            
            if (!evalCond) break;

            // Check word1
            let checkW1 = (i < len1);
            add("Check word1 Length", `if (i < word1.length())\nIs ${i} < ${len1}? (${checkW1 ? 'Yes' : 'No'})`, 6, { result: [...result], i, j, checkW1: true });
            
            if (checkW1) {
                let char1 = w1Arr[i];
                result.push({char: char1, source: 'w1'});
                add("Append from word1", `result.append(word1.charAt(${i})); // '${char1}'\nAppended '${char1}' to the result builder.`, 7, { result: [...result], i, j, hlW1: i });
                
                i++;
                add("Increment i", `i++;\nPointer 'i' advances to ${i}.`, 8, { result: [...result], i, j });
            }
            
            // Check word2
            let checkW2 = (j < len2);
            add("Check word2 Length", `if (j < word2.length())\nIs ${j} < ${len2}? (${checkW2 ? 'Yes' : 'No'})`, 10, { result: [...result], i, j, checkW2: true });
            
            if (checkW2) {
                let char2 = w2Arr[j];
                result.push({char: char2, source: 'w2'});
                add("Append from word2", `result.append(word2.charAt(${j})); // '${char2}'\nAppended '${char2}' to the result builder.`, 11, { result: [...result], i, j, hlW2: j });
                
                j++;
                add("Increment j", `j++;\nPointer 'j' advances to ${j}.`, 12, { result: [...result], i, j });
            }
        }
        
        let finalStr = result.map(x => x.char).join('');
        add("Return String", `return result.toString();\nConvert the StringBuilder to an immutable String and return it.`, 16, { result: [...result], i, j, isSuccess: true, finalAns: finalStr });

    } else if (selectedOpId === 'stringConcat') {
        let result = [];
        let i = 0;
        
        add("Method Call", `public String mergeAlternately(String word1, String word2)`, 1, { result: [...result], i });
        add("Init String", `String result = "";\nInitialize an immutable string object.`, 2, { result: [...result], i });
        add("Init Pointer", `int i = 0;\nWe only need one pointer 'i' since we iterate both simultaneously.`, 3, { result: [...result], i });

        // First While Loop
        while (true) {
            let evalCond = (i < len1 && i < len2);
            add("Loop 1 Condition", `while (i < word1.length() && i < word2.length())\nIs ${i} < ${len1} AND ${i} < ${len2}? (${evalCond ? 'Yes' : 'No'})`, 5, { result: [...result], i, isEvaluating1: true });
            
            if (!evalCond) break;
            
            let char1 = w1Arr[i];
            result.push({char: char1, source: 'w1'});
            add("Concat word1", `result += word1.charAt(${i}); // '${char1}'\nCreates a NEW string in memory to append '${char1}'.`, 6, { result: [...result], i, hlW1: i });
            
            let char2 = w2Arr[i];
            result.push({char: char2, source: 'w2'});
            add("Concat word2", `result += word2.charAt(${i}); // '${char2}'\nCreates a NEW string in memory to append '${char2}'.`, 7, { result: [...result], i, hlW2: i });
            
            i++;
            add("Increment i", `i++;\nPointer 'i' advances to ${i}.`, 8, { result: [...result], i });
        }

        // Second While Loop (Remainder of word1)
        while (true) {
            let evalCond = (i < len1);
            add("Loop 2 Condition", `while (i < word1.length())\nDoes word1 have remaining characters? Is ${i} < ${len1}? (${evalCond ? 'Yes' : 'No'})`, 11, { result: [...result], i, isEvaluating2: true });
            
            if (!evalCond) break;
            
            let char1 = w1Arr[i];
            result.push({char: char1, source: 'w1'});
            add("Concat Remainder word1", `result += word1.charAt(${i}); // '${char1}'`, 12, { result: [...result], i, hlW1: i });
            
            i++;
            add("Increment i", `i++;`, 13, { result: [...result], i });
        }

        // Third While Loop (Remainder of word2)
        while (true) {
            let evalCond = (i < len2); // Note: visually we'll just track i vs len2
            add("Loop 3 Condition", `while (i < word2.length())\nDoes word2 have remaining characters? Is ${i} < ${len2}? (${evalCond ? 'Yes' : 'No'})`, 16, { result: [...result], i, isEvaluating3: true });
            
            if (!evalCond) break;
            
            let char2 = w2Arr[i];
            result.push({char: char2, source: 'w2'});
            add("Concat Remainder word2", `result += word2.charAt(${i}); // '${char2}'`, 17, { result: [...result], i, hlW2: i });
            
            i++;
            add("Increment i", `i++;`, 18, { result: [...result], i });
        }

        let finalStr = result.map(x => x.char).join('');
        add("Return String", `return result;\nReturn the final concatenated string.`, 21, { result: [...result], i, isSuccess: true, finalAns: finalStr });
    }

    return steps;
  }, [baseWord1, baseWord2, selectedOpId]);

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

  const themeColor = selectedOpId === 'twoPointers' ? 'emerald' : 'sky';

  // --- Rendering Helpers ---

  const renderVisuals = () => {
      if (st.w1Arr === undefined) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full mt-4 gap-8">
              
              {/* Word 1 Array */}
              <div className="flex flex-col items-start w-full max-w-4xl">
                  <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 mb-2 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 shadow-sm flex items-center gap-2"><Type size={12}/> Word 1</span>
                  <div className="flex gap-2 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[90px]">
                      {st.w1Arr.length > 0 ? st.w1Arr.map((val, idx) => {
                          let isHl = false;
                          let isDimmed = false;
                          let labels = [];
                          let color = 'sky';

                          if (selectedOpId === 'twoPointers') {
                              if (idx === st.i) {
                                  labels.push({ text: 'i', color: 'sky', pos: 'bottom' });
                                  isHl = true;
                              }
                              if (st.hlW1 === idx) {
                                  labels.push({ text: 'Append', color: 'emerald', pos: 'top' });
                                  color = 'emerald';
                                  isHl = true;
                              }
                              if (idx < (st.i || 0)) isDimmed = true;
                          } else {
                              // Naive
                              if (idx === st.i) {
                                  labels.push({ text: 'i', color: 'sky', pos: 'bottom' });
                                  isHl = true;
                              }
                              if (st.hlW1 === idx) {
                                  labels.push({ text: 'Concat', color: 'emerald', pos: 'top' });
                                  color = 'emerald';
                                  isHl = true;
                              }
                              if (idx < (st.i || 0)) isDimmed = true;
                          }

                          return (
                              <div key={`w1-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-0.5'}`}>
                                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">
                                    {labels.filter(l => l.pos === 'top').map((l, j) => (
                                        <React.Fragment key={j}><PointerLabel label={l.text} color={l.color} position="top" /></React.Fragment>
                                    ))}
                                  </div>
                                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                    {labels.filter(l => l.pos === 'bottom').map((l, j) => (
                                        <React.Fragment key={j}><PointerLabel label={l.text} color={l.color} position="bottom" /></React.Fragment>
                                    ))}
                                  </div>
                                  <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} isDimmed={isDimmed} subtext={undefined} />
                              </div>
                          )
                      }) : <span className="text-slate-400 italic text-sm font-mono px-4">empty string</span>}
                  </div>
              </div>

              {/* Word 2 Array */}
              <div className="flex flex-col items-start w-full max-w-4xl">
                  <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 mb-2 bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200 shadow-sm flex items-center gap-2"><Type size={12}/> Word 2</span>
                  <div className="flex gap-2 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[90px]">
                      {st.w2Arr.length > 0 ? st.w2Arr.map((val, idx) => {
                          let isHl = false;
                          let isDimmed = false;
                          let labels = [];
                          let color = 'fuchsia';

                          if (selectedOpId === 'twoPointers') {
                              if (idx === st.j) {
                                  labels.push({ text: 'j', color: 'fuchsia', pos: 'bottom' });
                                  isHl = true;
                              }
                              if (st.hlW2 === idx) {
                                  labels.push({ text: 'Append', color: 'emerald', pos: 'top' });
                                  color = 'emerald';
                                  isHl = true;
                              }
                              if (idx < (st.j || 0)) isDimmed = true;
                          } else {
                              // Naive
                              if (idx === st.i) {
                                  labels.push({ text: 'i', color: 'fuchsia', pos: 'bottom' });
                                  isHl = true;
                              }
                              if (st.hlW2 === idx) {
                                  labels.push({ text: 'Concat', color: 'emerald', pos: 'top' });
                                  color = 'emerald';
                                  isHl = true;
                              }
                              // We only dim if i has safely passed it in naive context
                              // but naive has 3 loops. Safest is just dim if idx < i
                              if (idx < (st.i || 0)) isDimmed = true;
                          }

                          return (
                              <div key={`w2-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-0.5'}`}>
                                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">
                                    {labels.filter(l => l.pos === 'top').map((l, j) => (
                                        <React.Fragment key={j}><PointerLabel label={l.text} color={l.color} position="top" /></React.Fragment>
                                    ))}
                                  </div>
                                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                    {labels.filter(l => l.pos === 'bottom').map((l, j) => (
                                        <React.Fragment key={j}><PointerLabel label={l.text} color={l.color} position="bottom" /></React.Fragment>
                                    ))}
                                  </div>
                                  <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} isDimmed={isDimmed} subtext={undefined}/>
                              </div>
                          )
                      }) : <span className="text-slate-400 italic text-sm font-mono px-4">empty string</span>}
                  </div>
              </div>

              {/* Result Array / StringBuilder */}
              <div className="flex flex-col items-start w-full max-w-4xl">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 shadow-sm flex items-center gap-2"><Target size={12}/> Result {selectedOpId === 'twoPointers' ? 'StringBuilder' : 'String'}</span>
                  <div className="flex gap-2 p-4 border-[3px] border-emerald-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[90px]">
                      {st.result && st.result.length > 0 ? st.result.map((item, idx) => {
                          let color = item.source === 'w1' ? 'sky' : 'fuchsia';
                          let isNew = idx === st.result.length - 1 && !st.isEvaluating && !st.isEvaluating1 && !st.isEvaluating2 && !st.isEvaluating3 && !st.checkW1 && !st.checkW2;
                          
                          return (
                              <div key={`res-${idx}`} className={`relative transition-all duration-500 ${isNew ? 'scale-110 z-20 animate-in zoom-in slide-in-from-top-4' : 'scale-100 z-10 m-0.5'}`}>
                                  <NodeBlock val={item.char} idx={idx} themeColor={color} isTarget={isNew} isDimmed={undefined} subtext={undefined} />
                              </div>
                          )
                      }) : <span className="text-slate-400 italic text-sm font-mono px-4">Result is empty</span>}
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
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-sky-600'}`}>
                <Focus className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Merge Strings Alternately</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'emerald' ? 'text-emerald-600 bg-emerald-50' : 'text-sky-600 bg-sky-50'}`}>
                      LC 1768 • Two Pointers
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
                  You are given two strings <code>word1</code> and <code>word2</code>. Merge the strings by adding letters in alternating order, starting with <code>word1</code>.<br/><br/>
                  If a string is longer than the other, append the additional letters onto the end of the merged string.<br/><br/>
                  Return the merged string.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-emerald-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> word1 = "abc", word2 = "pqr"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> "apbqcr"</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation: The merged string will be merged as so:
word1:  a   b   c
word2:    p   q   r
merged: a p b q c r
                        </div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> word1 = "ab", word2 = "pqrs"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> "apbqrs"</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation: Notice that as word2 is longer, "rs" is appended to the end.
word1:  a   b 
word2:    p   q   r   s
merged: a p b q   r   s
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Traps</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-2">
                        <li>1 &lt;= word1.length, word2.length &lt;= 100</li>
                        <li><code>word1</code> and <code>word2</code> consist of lowercase English letters.</li>
                        <li className={`font-bold mt-2 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-sky-600'}`}>
                            Trap: In Java, standard String concatenation (`+=`) creates a brand new String object every time in memory. Since we are doing this in a loop, it results in O((N+M)²) time complexity! Using a `StringBuilder` ensures O(N+M) optimal time.
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
                                <span>'word1'</span>
                            </label>
                            <input 
                                type="text"
                                value={word1Input} 
                                onChange={(e) => setWord1Input(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-sky-500'}`} 
                                spellCheck={false}
                                placeholder="abc"
                            />
                        </div>
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono pl-1 flex justify-between ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-sky-600'}`}>
                                <span>'word2'</span>
                            </label>
                            <input 
                                type="text"
                                value={word2Input} 
                                onChange={(e) => setWord2Input(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-sky-500'}`} 
                                spellCheck={false}
                                placeholder="pqrst"
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
                        <h3 className="font-black text-emerald-400 text-lg uppercase tracking-widest mb-6">The Single While Loop Elegance</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>A beginner's approach is often to loop until the SHORTEST string runs out, and then write two separate `while` loops to append the remainders of `word1` or `word2`.</p>
                            <p>While logically correct, it clutters the code.</p>
                            <p>By using a single `while (i &lt; len1 || j &lt; len2)` loop, and nesting `if (i &lt; len1)` and `if (j &lt; len2)` inside, we elegantly handle the alternating logic AND the remainder-appending logic in one clean block of code.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-sky-50 border border-sky-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-sky-700 text-lg uppercase tracking-widest mb-6">String Immutability in Java</h3>
                        <div className="space-y-4 text-sm text-sky-900/80 leading-relaxed font-medium">
                            <p>In languages like Java and Python, <code>String</code> objects are immutable. This means they cannot be changed once created.</p>
                            <p>If you write <code>result += "a"</code>, the computer must allocate a brand new block of memory, copy the old string over, and add "a".</p>
                            <p>If you do this in a loop <code>N</code> times, the 1st step copies 1 char, the 2nd copies 2, the 100th copies 100... resulting in <code>1 + 2 + ... + N = O(N&sup2;)</code> time complexity!</p>
                            <p>Using a <code>StringBuilder</code> bypasses this by allocating an internal, mutable char array that resizes efficiently, dropping the complexity down to O(N).</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-emerald-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-emerald-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering String Traps</h3>
                    <p className="text-sm text-emerald-50 leading-relaxed italic max-w-2xl font-mono">"This is considered an 'Easy' LeetCode question, but it's a common trap designed to catch junior developers who don't understand how memory allocation works in their language. If you use standard String concatenation (+), you will fail the performance aspect of the interview."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><SearchCode size={16}/></div>
                               1. Acknowledge The Naive Loop
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "The naive logic is to use a `while` loop that runs until one string is exhausted, appending a character from both strings in each iteration, and then following it up with two more `while` loops to append whichever string has remaining characters."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><ArrowRightLeft size={16}/></div>
                               2. Point Out the Memory Trap
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "However, if I just use a standard `String` and the `+=` operator to build the answer, I will incur an O((N+M)²) time complexity because Strings are immutable in Java. Every append creates a brand new copy of the string in memory."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Layout size={16}/></div>
                               3. Propose the Optimal Clean Approach
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "To fix the memory issue, I will use a `StringBuilder` which has an internal mutable array, granting an O(1) append time and keeping the total time complexity at an optimal O(N+M). To clean up the code logic, instead of 3 while loops, I will use a single loop with condition `i &lt; len1 || j &lt; len2`. Inside, independent `if` statements will check if `i` and `j` are still valid bounds, appending safely. This is much cleaner and highly efficient."
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-sky-600'}`}>'word1'</label>
                              <input type="text" value={word1Input} onChange={(e) => setWord1Input(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-sky-500'}`} />
                          </div>
                          <div className="w-40 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-sky-600'}`}>'word2'</label>
                              <input type="text" value={word2Input} onChange={(e) => setWord2Input(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-sky-500'}`} />
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
                                    <PartyPopper size={48} />
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    COMPLETED
                                </h2>
                                <p className={`font-mono text-xl uppercase mb-8 tracking-widest text-emerald-400 max-w-lg break-words`}>
                                    Merged String: <span className="font-black text-3xl text-white ml-2 block mt-2">"{st.finalAns}"</span>
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
