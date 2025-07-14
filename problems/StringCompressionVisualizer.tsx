import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, Maximize, Target, Focus, Type, CheckCircle2, XCircle, ArrowDown, ArrowUp, Layout, TrendingUp, Clock, Layers, Calculator, Combine, Scissors
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  inPlaceTwoPointers: {
    id: 'inPlaceTwoPointers',
    title: '1. Two Pointers (Optimal)',
    icon: <ArrowRightLeft size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public int compress(char[] chars) {
    int write = 0;
    int read = 0;
    
    while (read < chars.length) {
        char currentChar = chars[read];
        int count = 0;
        
        while (read < chars.length && chars[read] == currentChar) {
            read++;
            count++;
        }
        
        chars[write] = currentChar;
        write++;
        
        if (count > 1) {
            for (char c : String.valueOf(count).toCharArray()) {
                chars[write] = c;
                write++;
            }
        }
    }
    
    return write;
}`,
    desc: "The Optimal In-Place Two Pointers Approach. We use a 'read' pointer to scan through groups of identical characters and count them. We use a 'write' pointer to overwrite the original array with the compressed characters and their counts. Because 'read' is always ahead of or equal to 'write', we never overwrite data we haven't processed yet."
  },
  stringBuilderNaive: {
    id: 'stringBuilderNaive',
    title: '2. StringBuilder (Naive)',
    icon: <Layers size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public int compress(char[] chars) {
    StringBuilder sb = new StringBuilder();
    int read = 0;
    
    while (read < chars.length) {
        char currentChar = chars[read];
        int count = 0;
        
        while (read < chars.length && chars[read] == currentChar) {
            read++;
            count++;
        }
        
        sb.append(currentChar);
        
        if (count > 1) {
            sb.append(count);
        }
    }
    
    for (int i = 0; i < sb.length(); i++) {
        chars[i] = sb.charAt(i);
    }
    
    return sb.length();
}`,
    desc: "The Extra Space / StringBuilder Approach. While technically O(N) time, this violates the problem's strict O(1) space constraint by allocating a secondary StringBuilder to hold the compressed string, and then copying it back over the original array at the very end."
  }
};

// --- Helper UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active = false, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|char|return|if|else|for|while|continue|break|new|length|String|StringBuilder|charAt|append|toString|compress|chars|write|read|currentChar|count|valueOf|toCharArray|sb|i|c)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  
  const activeStyles = theme === 'emerald' 
    ? { bg: `bg-emerald-500/20`, border: `border-emerald-400`, text: `text-emerald-300` }
    : { bg: `bg-fuchsia-500/20`, border: `border-fuchsia-400`, text: `text-fuchsia-300` };

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
            const isVar = ['chars', 'write', 'read', 'currentChar', 'count', 'sb', 'i', 'c'].includes(part);
            const isMapCall = ['length', 'charAt', 'append', 'compress', 'valueOf', 'toCharArray'].includes(part);
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
            <div className={`flex flex-col items-center min-w-[36px] md:min-w-[46px] min-h-[48px] md:min-h-[56px] border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
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

export default function StringCompressionVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('inPlaceTwoPointers');
  
  const [charsInput, setCharsInput] = useState('a,a,b,b,c,c,c');
  const [baseChars, setBaseChars] = useState(['a', 'a', 'b', 'b', 'c', 'c', 'c']);
  
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
      let parsed = charsInput.split(',').map(s => s.trim()).filter(s => s.length > 0).map(s => s[0]); // take first char only
      if (parsed.length === 0) parsed = ['a', 'a', 'b', 'b', 'c', 'c', 'c'];
      if (parsed.length > 25) parsed = parsed.slice(0, 25); // Limit for visualizer size
      
      setBaseChars(parsed);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
    }, 400);
    return () => clearTimeout(timer);
  }, [charsInput, selectedOpId]);

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
    if (!baseChars || baseChars.length === 0) return [{ phase: 'Init', description: 'Enter valid characters.', line: 1, state: {} }];

    let arr = [...baseChars];
    const n = arr.length;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, description: ds, line: ln, 
        state: { arr: [...arr], n, ...st } 
    });

    if (selectedOpId === 'inPlaceTwoPointers') {
        let write = 0;
        let read = 0;
        
        add("Function Call", `public int compress(char[] chars)`, 1, { write, read });
        add("Init Write Pointer", `int write = 0;\nPoints to the index where we will overwrite data.`, 2, { write, read });
        add("Init Read Pointer", `int read = 0;\nPoints to the index scanning the current group of characters.`, 3, { write, read });

        while (true) {
            let outerCond = read < n;
            add("Outer Loop Eval", `while (read < chars.length)\nIs ${read} < ${n}? (${outerCond ? 'Yes' : 'No'})`, 5, { write, read, isEvaluatingOuter: true });
            
            if (!outerCond) break;
            
            let currentChar = arr[read];
            add("Capture Character", `char currentChar = chars[read];\ncurrentChar is now '${currentChar}'.`, 6, { write, read, currentChar, hlRead: true });
            
            let count = 0;
            add("Init Count", `int count = 0;\nReset the occurrence counter for '${currentChar}'.`, 7, { write, read, currentChar, count });
            
            while (true) {
                let innerCond1 = read < n;
                let innerCond2 = innerCond1 ? (arr[read] === currentChar) : false;
                
                add("Inner Loop Eval", `while (read < chars.length && chars[read] == currentChar)\nIs ${read} < ${n} AND is '${innerCond1 ? arr[read] : '_'}' == '${currentChar}'? (${(innerCond1 && innerCond2) ? 'Yes' : 'No'})`, 9, { write, read, currentChar, count, isEvaluatingInner: true });
                
                if (!(innerCond1 && innerCond2)) break;
                
                read++;
                add("Increment Read", `read++;\nAdvanced read pointer to ${read}.`, 10, { write, read, currentChar, count, hlRead: true });
                
                count++;
                add("Increment Count", `count++;\nFound an occurrence of '${currentChar}'. Count is now ${count}.`, 11, { write, read, currentChar, count });
            }
            
            arr[write] = currentChar;
            add("Write Character", `chars[write] = currentChar;\nOverwrite index ${write} with '${currentChar}'.`, 14, { write, read, currentChar, count, hlWrite: true, isWriting: true });
            
            write++;
            add("Increment Write", `write++;\nAdvanced write pointer to ${write}.`, 15, { write, read, currentChar, count, hlWrite: true });
            
            let countCond = count > 1;
            add("If Condition Eval", `if (count > 1)\nDid we find more than one '${currentChar}'? Is ${count} > 1? (${countCond ? 'Yes' : 'No'})`, 17, { write, read, currentChar, count, isEvaluatingIf: true });
            
            if (countCond) {
                let countStr = count.toString();
                add("For Loop Init", `for (char c : String.valueOf(count).toCharArray())\nConvert count ${count} to characters: [${countStr.split('').map(x=>`'${x}'`).join(', ')}].`, 18, { write, read, currentChar, count, countStr });
                
                for (let i = 0; i < countStr.length; i++) {
                    let c = countStr[i];
                    add("For Loop Eval", `Extracting digit '${c}' from count ${count}.`, 18, { write, read, currentChar, count, countStr, c, cIdx: i });
                    
                    arr[write] = c;
                    add("Write Digit", `chars[write] = c;\nOverwrite index ${write} with digit '${c}'.`, 19, { write, read, currentChar, count, countStr, c, cIdx: i, hlWrite: true, isWriting: true });
                    
                    write++;
                    add("Increment Write", `write++;\nAdvanced write pointer to ${write}.`, 20, { write, read, currentChar, count, countStr, c, cIdx: i, hlWrite: true });
                }
            }
        }
        
        add("Return Length", `return write;\nArray compression is complete. The new length is ${write}.`, 25, { write, read: n, isSuccess: true, finalAns: write });

    } else if (selectedOpId === 'stringBuilderNaive') {
        let sb = [];
        let read = 0;
        
        add("Function Call", `public int compress(char[] chars)`, 1, { sb: [...sb], read });
        add("Init StringBuilder", `StringBuilder sb = new StringBuilder();\nAllocates extra O(N) memory.`, 2, { sb: [...sb], read });
        add("Init Read Pointer", `int read = 0;`, 3, { sb: [...sb], read });

        while (true) {
            let outerCond = read < n;
            add("Outer Loop Eval", `while (read < chars.length)\nIs ${read} < ${n}? (${outerCond ? 'Yes' : 'No'})`, 5, { sb: [...sb], read, isEvaluatingOuter: true });
            
            if (!outerCond) break;
            
            let currentChar = arr[read];
            add("Capture Character", `char currentChar = chars[read]; // '${currentChar}'`, 6, { sb: [...sb], read, currentChar, hlRead: true });
            
            let count = 0;
            add("Init Count", `int count = 0;`, 7, { sb: [...sb], read, currentChar, count });
            
            while (true) {
                let innerCond1 = read < n;
                let innerCond2 = innerCond1 ? (arr[read] === currentChar) : false;
                
                add("Inner Loop Eval", `while (read < chars.length && chars[read] == currentChar)\nMatch found? (${(innerCond1 && innerCond2) ? 'Yes' : 'No'})`, 9, { sb: [...sb], read, currentChar, count, isEvaluatingInner: true });
                
                if (!(innerCond1 && innerCond2)) break;
                
                read++;
                add("Increment Read", `read++;`, 10, { sb: [...sb], read, currentChar, count, hlRead: true });
                
                count++;
                add("Increment Count", `count++;`, 11, { sb: [...sb], read, currentChar, count });
            }
            
            sb.push(currentChar);
            add("Append Character", `sb.append(currentChar);\nAppend '${currentChar}' to StringBuilder.`, 14, { sb: [...sb], read, currentChar, count, hlAppend: true });
            
            let countCond = count > 1;
            add("If Condition Eval", `if (count > 1)\nIs ${count} > 1? (${countCond ? 'Yes' : 'No'})`, 16, { sb: [...sb], read, currentChar, count, isEvaluatingIf: true });
            
            if (countCond) {
                let countStr = count.toString();
                for (let c of countStr) sb.push(c);
                add("Append Count", `sb.append(count);\nAppended '${count}' to StringBuilder.`, 17, { sb: [...sb], read, currentChar, count, hlAppend: true });
            }
        }
        
        add("Copy Back Init", `for (int i = 0; i < sb.length(); i++)\nWe must now copy O(N) data back into the original array.`, 21, { sb: [...sb], read, isEvaluatingCopy: true });
        
        for(let i = 0; i < sb.length; i++) {
            arr[i] = sb[i];
            add("Copy Character", `chars[${i}] = sb.charAt(${i});\nOverwrite original array at index ${i} with '${sb[i]}'.`, 22, { sb: [...sb], read, i, isWriting: true });
        }
        
        add("Return Length", `return sb.length();\nReturn the length of the StringBuilder: ${sb.length}`, 25, { sb: [...sb], read, isSuccess: true, finalAns: sb.length });
    }

    return steps;
  }, [baseChars, selectedOpId]);

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

  const themeColor = selectedOpId === 'inPlaceTwoPointers' ? 'emerald' : 'fuchsia';

  // --- Rendering Helpers ---

  const renderVisuals = () => {
      if (st.arr === undefined) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full mt-2 gap-6 w-full">
              
              {/* Dynamic Presentation Based on State */}
              
              <div className="flex flex-col items-center w-full max-w-5xl">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm ${st.isWriting ? 'bg-amber-50 text-amber-600 border-amber-200 ring-2 ring-amber-300' : 'bg-slate-100 text-slate-500 border-slate-200'} flex items-center gap-2`}><Layout size={12}/> Target char[] Array in Memory</span>
                  
                  <div className="flex gap-1.5 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center items-center w-full min-h-[120px]">
                      {st.arr.map((val, idx) => {
                          let color = 'slate';
                          let isHl = false;
                          let isDimmed = false;
                          let labels = [];

                          if (selectedOpId === 'inPlaceTwoPointers') {
                              // If success, dim everything after 'write'
                              if (st.isSuccess && idx >= st.finalAns) {
                                  isDimmed = true;
                              } else if (st.isSuccess && idx < st.finalAns) {
                                  color = 'emerald';
                              }

                              if (st.read !== undefined && st.read === idx) {
                                  labels.push({ text: 'Read', color: 'sky', pos: 'top' });
                                  color = 'sky';
                                  isHl = true;
                              }
                              
                              if (st.write !== undefined && st.write === idx && !st.isSuccess) {
                                  labels.push({ text: 'Write', color: 'fuchsia', pos: 'bottom' });
                                  if (color !== 'sky') color = 'fuchsia'; // sky takes precedence if they overlap for background
                                  if (st.isWriting) color = 'amber';
                                  isHl = true;
                              }
                              
                              // Trail behind write is the "compressed" area
                              if (!st.isSuccess && st.write !== undefined && idx < st.write) {
                                  if (color === 'slate') color = 'emerald';
                              }
                          } else if (selectedOpId === 'stringBuilderNaive') {
                              if (st.read !== undefined && st.read === idx) {
                                  labels.push({ text: 'Read', color: 'sky', pos: 'top' });
                                  color = 'sky';
                                  isHl = true;
                              }
                              if (st.i !== undefined && st.i === idx && st.isWriting) {
                                  labels.push({ text: 'Copy i', color: 'fuchsia', pos: 'bottom' });
                                  color = 'amber';
                                  isHl = true;
                              }
                              if (st.isSuccess) {
                                  if (idx >= st.finalAns) isDimmed = true;
                                  else color = 'emerald';
                              }
                          }

                          return (
                              <React.Fragment key={`arr-${idx}`}>
                                  <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-1'} ${st.isWriting && (st.write === idx || st.i === idx) ? 'animate-in zoom-in duration-300' : ''}`}>
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
                                      <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} isDimmed={isDimmed} />
                                  </div>
                              </React.Fragment>
                          )
                      })}
                      {st.arr.length === 0 && <span className="text-slate-400 italic text-sm font-mono px-4">empty array</span>}
                  </div>
              </div>

              {/* State Variables Overlay */}
              {!st.isSuccess && selectedOpId === 'inPlaceTwoPointers' && (
                  <div className="flex w-full max-w-4xl gap-4 mt-6">
                      <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center flex-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Current Char</span>
                          <span className="font-mono text-3xl font-black text-sky-600">{st.currentChar !== undefined ? `'${st.currentChar}'` : '-'}</span>
                      </div>
                      
                      <div className={`bg-white border-2 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center flex-1 transition-all ${st.count !== undefined && st.count > 0 ? 'border-sky-300 bg-sky-50' : 'border-slate-200'}`}>
                          <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 mb-2">Count</span>
                          <span className="font-mono text-3xl font-black text-sky-600">{st.count !== undefined ? st.count : '-'}</span>
                      </div>

                      <div className={`bg-slate-800 border-2 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center flex-1 transition-all ${st.isWriting ? 'border-emerald-400 ring-4 ring-emerald-500 scale-105' : 'border-slate-700'}`}>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Write Index</span>
                          <span className="font-mono text-3xl font-black text-fuchsia-400">{st.write !== undefined ? st.write : '-'}</span>
                      </div>
                  </div>
              )}

              {/* StringBuilder View for Naive */}
              {selectedOpId === 'stringBuilderNaive' && !st.isSuccess && (
                 <div className="flex flex-col items-start w-full max-w-5xl mt-6">
                     <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm ${st.hlAppend ? 'bg-emerald-50 text-emerald-600 border-emerald-200 ring-2 ring-emerald-300' : 'bg-slate-100 text-slate-500 border-slate-200'} flex items-center gap-2`}><Layers size={12}/> Extra Space: StringBuilder</span>
                     <div className={`flex gap-1 p-3 border-[3px] bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[70px] transition-colors ${st.hlAppend ? 'border-emerald-400' : 'border-slate-200'}`}>
                         {st.sb && st.sb.map((val, idx) => {
                             let isNew = st.hlAppend && idx >= st.sb.length - (st.countStr ? st.countStr.length : 1);
                             return (
                                 <React.Fragment key={`sb-${idx}`}>
                                     <div className={`relative transition-all duration-500 ${isNew ? 'scale-110 z-20 animate-in zoom-in slide-in-from-top-4' : 'scale-100 z-10 m-0.5'}`}>
                                         <NodeBlock val={val} themeColor={isNew ? 'emerald' : 'sky'} isTarget={isNew} />
                                     </div>
                                 </React.Fragment>
                             )
                         })}
                         {(!st.sb || st.sb.length === 0) && <span className="text-slate-400 italic text-sm font-mono px-4">sb is empty</span>}
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
                <Scissors className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">String Compression</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'emerald' ? 'text-emerald-600 bg-emerald-50' : 'text-fuchsia-600 bg-fuchsia-50'}`}>
                      LC 443 • Two Pointers
                  </span>
                  <span>•</span>
                  <span>O(1) Space Constraint</span>
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
                  Given an array of characters <code>chars</code>, compress it using the following algorithm:<br/><br/>
                  Begin with an empty string <code>s</code>. For each group of <strong>consecutive repeating characters</strong> in <code>chars</code>:
                  <ul className="list-disc pl-8 mt-2 space-y-1">
                      <li>If the group's length is 1, append the character to <code>s</code>.</li>
                      <li>Otherwise, append the character followed by the group's length.</li>
                  </ul>
                  <br/>
                  The compressed string <code>s</code> <strong>should not be returned separately</strong>, but instead, be stored <strong>in the input character array <code>chars</code></strong>. After you are done modifying the input array, return the new length of the array.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-emerald-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> chars = ["a","a","b","b","c","c","c"]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> Return 6, chars = ["a","2","b","2","c","3"]</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation: The groups are "aa", "bb", and "ccc". This compresses to "a2b2c3".
                        </div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> chars = ["a","b","b","b","b","b","b","b","b","b","b","b","b"]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> Return 4, chars = ["a","b","1","2"]</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation: The groups are "a" and "bbbbbbbbbbbb". This compresses to "ab12". Note how 12 is split into '1' and '2'.
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Traps</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-2">
                        <li>1 &lt;= chars.length &lt;= 2000</li>
                        <li><code>chars[i]</code> is a lowercase English letter, uppercase English letter, digit, or symbol.</li>
                        <li className={`font-bold mt-2 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-fuchsia-600'}`}>
                            Trap: You MUST write an algorithm that uses only constant O(1) extra space. You cannot instantiate a new ArrayList, StringBuilder, or String to solve the problem and simply return its length. You must overwrite the provided array index by index.
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
                                <span>char[] Array (Comma separated chars)</span>
                            </label>
                            <input 
                                type="text"
                                value={charsInput} 
                                onChange={(e) => setCharsInput(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-fuchsia-500'}`} 
                                spellCheck={false}
                                placeholder="a, a, b, b, c, c, c"
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
                        <h3 className="font-black text-emerald-400 text-lg uppercase tracking-widest mb-6">Run-Length Encoding (RLE)</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>This problem asks you to implement a classic algorithm called <strong>Run-Length Encoding</strong>.</p>
                            <p>It's a form of lossless data compression where sequences of the same data value are stored as a single data value and count.</p>
                            <p>For example, if an image has 100 white pixels in a row, instead of saving <code>W W W W...</code> 100 times, we just save <code>W100</code>. This is extremely effective for data with lots of contiguous repeating elements.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-emerald-700 text-lg uppercase tracking-widest mb-6">In-Place Overwriting Safety</h3>
                        <div className="space-y-4 text-sm text-emerald-900/80 leading-relaxed font-medium">
                            <p>How can we safely overwrite the array while we are still reading from it? Won't we accidentally delete data we haven't checked yet?</p>
                            <p><strong>No.</strong> Because the compressed version of a string is ALWAYS shorter than or equal to the original string.</p>
                            <p>If we have <code>["a", "a", "a"]</code> (length 3), we overwrite it with <code>["a", "3"]</code> (length 2). Our <code>write</code> pointer will always trail behind or be exactly equal to our <code>read</code> pointer. It is mathematically impossible for <code>write</code> to outpace <code>read</code> and corrupt unread data.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-emerald-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-emerald-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering Array Overwrites</h3>
                    <p className="text-sm text-emerald-50 leading-relaxed italic max-w-2xl font-mono">"Interviewers use this problem to test your comfort level with in-place array mutations. Junior developers often panic and try to allocate a new Array or String. If you confidently explain the 'Read/Write Pointer' pattern and explain WHY it's safe from data corruption, you will ace this."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Layers size={16}/></div>
                               1. Acknowledge the Naive Space
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "The naive approach would be to allocate a `StringBuilder`. We could scan the array, append the character and its count to the builder, and at the end, copy the builder's characters back into the original array. However, this violates the strict O(1) space complexity requirement."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><ArrowRightLeft size={16}/></div>
                               2. Pivot to In-Place Pointers
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "To solve this in O(1) space, I'll use the Two Pointer technique. I will maintain a `read` pointer to scan and count the identical characters, and a `write` pointer to overwrite the array in place. Because the compressed format is always shorter or equal in length to the original, the `write` pointer will never outpace the `read` pointer, guaranteeing data safety."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Code2 size={16}/></div>
                               3. Explain the Nested Count Logic
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "I'll use a `while` loop that runs until `read` reaches the end. Inside, I capture the current character and use a nested `while` loop to increment `read` and a `count` variable as long as the character matches. Once the group ends, I write the character to `chars[write++]`. If `count &gt; 1`, I convert the count to a string, iterate over its digits, and write them sequentially to `chars[write++]`. Finally, I return the `write` pointer, which represents the new length."
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-fuchsia-600'}`}>char[] Array (Comma separated)</label>
                              <input type="text" value={charsInput} onChange={(e) => setCharsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner uppercase ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-fuchsia-500'}`} />
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
                                    New Array Length: <span className="font-black text-3xl text-white ml-2 block mt-2">{st.finalAns}</span>
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