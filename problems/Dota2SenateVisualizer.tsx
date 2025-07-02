import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, Maximize, Target, Focus, Type, CheckCircle2, XCircle, ArrowDown, ArrowUp, Layout, TrendingUp, Clock, Layers, Calculator, Combine, SquareSquare, Mountain, Hash, Network, Grid3X3, Star, Eraser, Brackets, ListTree, Swords, Skull
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalTwoQueues: {
    id: 'optimalTwoQueues',
    title: '1. Two Queues (Optimal)',
    icon: <Combine size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public String predictPartyVictory(String senate) {
    Queue<Integer> rad = new LinkedList<>();
    Queue<Integer> dir = new LinkedList<>();
    int n = senate.length();
    
    for (int i = 0; i < n; i++) {
        if (senate.charAt(i) == 'R') {
            rad.add(i);
        } else {
            dir.add(i);
        }
    }
    
    while (!rad.isEmpty() && !dir.isEmpty()) {
        int r_idx = rad.poll();
        int d_idx = dir.poll();
        
        if (r_idx < d_idx) {
            rad.add(r_idx + n);
        } else {
            dir.add(d_idx + n);
        }
    }
    
    return rad.isEmpty() ? "Dire" : "Radiant";
}`,
    desc: "The Optimal Two-Queue approach. Instead of iterating over the string and modifying it, we push the indices of Radiant and Dire senators into two separate queues. During each turn, we poll the front senator from both queues. The one with the smaller index acts first, banning the other. The winning senator survives to vote in the NEXT round, so we add 'n' (the total number of senators) to their index and push them back into their queue."
  },
  naiveSimulation: {
    id: 'naiveSimulation',
    title: '2. Circular Array (Naive)',
    icon: <RotateCcw size={16} />,
    complexity: 'Time: O(N²) | Space: O(N)',
    code: `public String predictPartyVictory(String senate) {
    char[] arr = senate.toCharArray();
    int rCount = 0, dCount = 0;
    
    for (int k = 0; k < arr.length; k++) {
        if (arr[k] == 'R') rCount++;
        else dCount++;
    }
    
    int i = 0;
    while (rCount > 0 && dCount > 0) {
        if (arr[i] != 'X') {
            char target = arr[i] == 'R' ? 'D' : 'R';
            int j = (i + 1) % arr.length;
            
            while (arr[j] != target) {
                j = (j + 1) % arr.length;
            }
            
            arr[j] = 'X';
            if (target == 'R') rCount--;
            else dCount--;
        }
        i = (i + 1) % arr.length;
    }
    
    return rCount > 0 ? "Radiant" : "Dire";
}`,
    desc: "The Naive Circular Array Simulation. We track the active senators in a character array. When it is a senator's turn, they scan the array forward in a circle (using modulo wrapping) to find the first active opposing senator, and replace them with an 'X' (banned). In the worst case, scanning forward for targets over and over again takes O(N²) time."
  }
};

// --- Helper UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active = false, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:class|public|private|boolean|double|int|char|return|if|else|for|while|continue|break|new|length|Math|max|min|predictPartyVictory|Queue|LinkedList|rad|dir|n|senate|charAt|add|isEmpty|poll|r_idx|d_idx|arr|toCharArray|rCount|dCount|target|c|i|j|k)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  
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
            const isKeyword = ['class', 'public', 'private', 'boolean', 'double', 'int', 'char', 'return', 'if', 'else', 'for', 'while', 'continue', 'break', 'new'].includes(part);
            const isObject = ['String', 'Math', 'Integer', 'Queue', 'LinkedList'].includes(part);
            const isVar = ['rad', 'dir', 'n', 'senate', 'r_idx', 'd_idx', 'arr', 'rCount', 'dCount', 'target', 'c', 'i', 'j', 'k'].includes(part);
            const isMapCall = ['length', 'predictPartyVictory', 'charAt', 'add', 'isEmpty', 'poll', 'toCharArray'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '?'].includes(part.trim());

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

const NodeBlock = ({ val, idx = undefined, themeColor = 'slate', isTarget = false, isDimmed = false, subtext = undefined, isDeleted = false, compact = false }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', index: 'bg-emerald-100 text-emerald-600' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', index: 'bg-sky-100 text-sky-600' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', index: 'bg-fuchsia-100 text-fuchsia-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', index: 'bg-rose-100 text-rose-600' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800', index: 'bg-indigo-100 text-indigo-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' },
        disabled: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-400', index: 'bg-slate-50 text-slate-400' }
    };
    
    let activeTheme = isDimmed ? themes['disabled'] : (themes[themeColor] || themes['slate']);
    if (isDeleted) activeTheme = themes['disabled'];

    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;
    
    const displayVal = val === null || val === "" ? '\u00A0' : String(val);

    const dims = compact 
        ? "min-w-[40px] md:min-w-[48px] min-h-[40px] md:min-h-[48px] px-2" 
        : "min-w-[56px] md:min-w-[64px] min-h-[48px] md:min-h-[56px] px-3";
    
    const textSz = compact ? "text-xl md:text-2xl" : "text-2xl md:text-3xl";
    const subTextSz = compact ? "text-[8px]" : "text-[9px] md:text-[10px]";

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center ${dims} border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black ${textSz} py-1 ${isDeleted ? 'bg-slate-200 text-slate-400' : 'bg-white/60 ' + activeTheme.text} ${isDimmed && !isDeleted ? 'opacity-50' : 'opacity-100'} whitespace-nowrap tracking-tighter relative`}>
                    {isDeleted ? <Skull size={18} /> : displayVal}
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

export default function Dota2SenateVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalTwoQueues');
  
  const [senateInput, setSenateInput] = useState('RDD');
  const [baseSenate, setBaseSenate] = useState('RDD');
  
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
      let cleaned = senateInput.toUpperCase().replace(/[^RD]/g, '');
      if (cleaned.length === 0) cleaned = 'RDD';
      if (cleaned.length > 25) cleaned = cleaned.slice(0, 25); 

      setBaseSenate(cleaned);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
    }, 400);
    return () => clearTimeout(timer);
  }, [senateInput, selectedOpId]);

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
    if (!baseSenate || baseSenate.length === 0) return [{ phase: 'Init', description: 'Enter valid senate string.', line: 1, state: {} }];

    const senate = baseSenate;
    const n = senate.length;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, description: ds, line: ln, 
        state: { senate, n, ...st } 
    });

    if (selectedOpId === 'optimalTwoQueues') {
        let rad = [];
        let dir = [];
        
        add("Function Call", `public String predictPartyVictory(String senate)`, 1, { rad: [...rad], dir: [...dir] });
        add("Init Queues", `Queue<Integer> rad = new LinkedList<>();\nQueue<Integer> dir = new LinkedList<>();`, 2, { rad: [...rad], dir: [...dir] });
        add("Init n", `int n = senate.length(); // n = ${n}`, 4, { rad: [...rad], dir: [...dir] });
        
        for (let i = 0; i < n; i++) {
            add("Loop Eval", `for (int i = ${i}; i < n; i++)\nIterating over the initial senate arrangement.`, 6, { rad: [...rad], dir: [...dir], iter: i, isEvaluatingFor: true });
            
            let c = senate[i];
            let isR = c === 'R';
            add("Check Radiant", `if (senate.charAt(${i}) == 'R')\nIs senator ${i} Radiant? (${isR ? 'Yes' : 'No'})`, 7, { rad: [...rad], dir: [...dir], iter: i, hlChar: i, isCheckingR: true });
            
            if (isR) {
                rad.push(i);
                add("Add to Radiant Queue", `rad.add(${i});\nQueued Radiant senator index ${i}.`, 8, { rad: [...rad], dir: [...dir], iter: i, hlRadAdd: true });
            } else {
                dir.push(i);
                add("Add to Dire Queue", `dir.add(${i});\nQueued Dire senator index ${i}.`, 10, { rad: [...rad], dir: [...dir], iter: i, hlDirAdd: true });
            }
        }
        
        add("Loop End", `for (int i = ${n}; i < n; i++)\nFinished populating the initial queues.`, 6, { rad: [...rad], dir: [...dir], isEvaluatingFor: true });
        
        while (true) {
            let radHas = rad.length > 0;
            let dirHas = dir.length > 0;
            let whileCond = radHas && dirHas;
            
            add("While Eval", `while (!rad.isEmpty() && !dir.isEmpty())\nAre there still opposing senators to battle? (${whileCond ? 'Yes' : 'No'})`, 13, { rad: [...rad], dir: [...dir], isEvalWhile: true });
            
            if (!whileCond) break;
            
            let r_idx = rad.shift();
            add("Poll Radiant", `int r_idx = rad.poll();\nRadiant senator ${r_idx} steps forward.`, 14, { rad: [...rad], dir: [...dir], r_idx, hlRadPoll: true });
            
            let d_idx = dir.shift();
            add("Poll Dire", `int d_idx = dir.poll();\nDire senator ${d_idx} steps forward.`, 15, { rad: [...rad], dir: [...dir], r_idx, d_idx, hlDirPoll: true });
            
            let rWins = r_idx < d_idx;
            add("Compare Indices", `if (r_idx < d_idx)\nWho has the smaller index? (${r_idx} < ${d_idx}?) -> ${rWins ? 'Radiant wins' : 'Dire wins'}`, 16, { rad: [...rad], dir: [...dir], r_idx, d_idx, isComparing: true });
            
            if (rWins) {
                let nextIdx = r_idx + n;
                add("Radiant Wins", `rad.add(r_idx + n);\nRadiant senator ${r_idx} bans Dire ${d_idx}. Radiant is pushed to the back with index ${r_idx} + ${n} = ${nextIdx} for the next round.`, 17, { rad: [...rad], dir: [...dir], r_idx, d_idx, hlRadWin: true });
                rad.push(nextIdx);
            } else {
                let nextIdx = d_idx + n;
                add("Dire Wins", `dir.add(d_idx + n);\nDire senator ${d_idx} bans Radiant ${r_idx}. Dire is pushed to the back with index ${d_idx} + ${n} = ${nextIdx} for the next round.`, 19, { rad: [...rad], dir: [...dir], r_idx, d_idx, hlDirWin: true });
                dir.push(nextIdx);
            }
        }
        
        let radWins = rad.length > 0;
        add("Return Result", `return rad.isEmpty() ? "Dire" : "Radiant";\n${radWins ? 'Radiant' : 'Dire'} stands alone and claims victory!`, 23, { rad: [...rad], dir: [...dir], isSuccess: true, finalAns: radWins ? 'Radiant' : 'Dire' });

    } else if (selectedOpId === 'naiveSimulation') {
        let arr = senate.split('');
        let rCount = 0;
        let dCount = 0;
        
        add("Function Call", `public String predictPartyVictory(String senate)`, 1, { arr: [...arr] });
        add("Init Array", `char[] arr = senate.toCharArray();`, 2, { arr: [...arr] });
        add("Init Counts", `int rCount = 0, dCount = 0;`, 3, { arr: [...arr], rCount, dCount });
        
        for (let k = 0; k < n; k++) {
            add("Count Loop Eval", `for (int k = ${k}; k < arr.length; k++)`, 5, { arr: [...arr], rCount, dCount, countIter: k, isEvalCountFor: true });
            
            let isR = arr[k] === 'R';
            add("Check Radiant Count", `if (arr[${k}] == 'R') rCount++; else dCount++;`, 6, { arr: [...arr], rCount, dCount, countIter: k, isCheckingCount: true });
            if (isR) rCount++;
            else dCount++;
            add("Update Count", `Counts: Radiant = ${rCount}, Dire = ${dCount}`, 6, { arr: [...arr], rCount, dCount, countIter: k });
        }
        add("Count Loop End", `Finished counting initial senators.`, 5, { arr: [...arr], rCount, dCount, isEvalCountFor: true });
        
        let i = 0;
        add("Init Index", `int i = 0;\nStarting simulation pointer.`, 10, { arr: [...arr], rCount, dCount, i });
        
        while (true) {
            let whileCond = rCount > 0 && dCount > 0;
            add("While Eval", `while (rCount > 0 && dCount > 0)\nAre both parties still standing? (${whileCond ? 'Yes' : 'No'})`, 11, { arr: [...arr], rCount, dCount, i, isEvalWhile: true });
            
            if (!whileCond) break;
            
            let isActive = arr[i] !== 'X';
            add("Check Active", `if (arr[${i}] != 'X')\nIs senator ${i} active? (${isActive ? 'Yes' : 'No'})`, 12, { arr: [...arr], rCount, dCount, i, hlI: true, isCheckingActive: true });
            
            if (isActive) {
                let target = arr[i] === 'R' ? 'D' : 'R';
                add("Set Target", `char target = arr[${i}] == 'R' ? 'D' : 'R';\nSenator ${arr[i]} wants to ban a '${target}'.`, 13, { arr: [...arr], rCount, dCount, i, hlI: true, target });
                
                let j = (i + 1) % n;
                add("Init Search Index", `int j = (${i} + 1) % ${n};\nStarting search at index ${j}.`, 14, { arr: [...arr], rCount, dCount, i, j, hlI: true, hlJ: true });
                
                while (true) {
                    let jValid = arr[j] === target;
                    add("Search Loop Eval", `while (arr[${j}] != '${target}')\nIs senator ${j} a valid target? (${jValid ? 'Found' : 'No, keep scanning'})`, 16, { arr: [...arr], rCount, dCount, i, j, target, hlI: true, hlJ: true, isEvalSearch: true });
                    
                    if (jValid) break;
                    
                    j = (j + 1) % n;
                    add("Increment j", `j = (${j} + 1) % ${n};\nWrapping circularly.`, 17, { arr: [...arr], rCount, dCount, i, j, target, hlI: true, hlJ: true });
                }
                
                add("Found Target", `Found valid target '${target}' at index ${j}.`, 16, { arr: [...arr], rCount, dCount, i, j, target, hlI: true, hlJ: true });
                
                arr[j] = 'X';
                add("Ban Target", `arr[${j}] = 'X';\nSenator ${j} has been banned!`, 20, { arr: [...arr], rCount, dCount, i, j, target, hlI: true, hlJTarget: true });
                
                if (target === 'R') rCount--;
                else dCount--;
                add("Update Counts", `if (target == 'R') rCount--; else dCount--;\nDecremented ${target} count. R: ${rCount}, D: ${dCount}`, 21, { arr: [...arr], rCount, dCount, i, j, target, hlI: true });
            }
            
            i = (i + 1) % n;
            add("Increment i", `i = (${i} + 1) % ${n};\nMoving pointer circularly to next senator.`, 24, { arr: [...arr], rCount, dCount, i });
        }
        
        let radWins = rCount > 0;
        add("Return Result", `return rCount > 0 ? "Radiant" : "Dire";\n${radWins ? 'Radiant' : 'Dire'} claims victory!`, 27, { arr: [...arr], rCount, dCount, isSuccess: true, finalAns: radWins ? 'Radiant' : 'Dire' });
    }

    return steps;
  }, [baseSenate, selectedOpId]);

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

  const themeColor = selectedOpId === 'optimalTwoQueues' ? 'emerald' : 'amber';

  // --- Rendering Helpers ---

  const renderVisuals = () => {
      if (st.senate === undefined && st.arr === undefined) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full mt-2 gap-8 w-full">
              
              {/* OPTIMAL APPROACH VISUALS */}
              {selectedOpId === 'optimalTwoQueues' && st.senate !== undefined && (
                  <div className="flex flex-col items-center w-full max-w-6xl gap-8 animate-in slide-in-from-bottom-4">
                      
                      {/* Original Senate String */}
                      <div className="flex flex-col items-start w-full max-w-3xl mx-auto">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-slate-100 text-slate-500 border-slate-200 flex items-center gap-2`}><Layout size={12}/> Original String 'senate'</span>
                          
                          <div className="flex gap-1.5 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center items-center w-full min-h-[90px]">
                              {st.senate.split('').map((char, idx) => {
                                  let isHl = false;
                                  let color = char === 'R' ? 'sky' : 'rose';
                                  let isDimmed = false;
                                  let labels = [];

                                  if (st.iter === idx) {
                                      isHl = true;
                                      labels.push({ text: 'i', color: color, pos: 'bottom' });
                                  }
                                  
                                  if (st.iter !== undefined && idx > st.iter) {
                                      isDimmed = true;
                                  }

                                  if (st.isEvaluatingFor || st.isCheckingR) {
                                      // just keep highlights
                                  } else if (st.iter !== undefined) {
                                      isDimmed = true; // dim completely once queued unless it's the target
                                  } else {
                                      isDimmed = true;
                                  }
                                  
                                  if (st.r_idx !== undefined || st.isSuccess) {
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

                      {/* Two Queues */}
                      <div className="flex flex-col xl:flex-row w-full gap-6">
                          {/* rad Queue */}
                          <div className="flex flex-col items-start w-full flex-1">
                              <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-sky-50 text-sky-600 border-sky-200 flex items-center gap-2`}><ListTree size={12}/> 'rad' Queue (Radiant)</span>
                              <div className={`flex gap-1.5 p-4 border-[3px] bg-sky-50/50 rounded-[2rem] shadow-xl flex-wrap justify-start items-center w-full min-h-[100px] transition-colors duration-300 ${st.hlRadAdd || st.hlRadWin ? 'border-sky-400 ring-4 ring-sky-200' : 'border-sky-200'}`}>
                                  {st.rad && st.rad.map((val, idx) => {
                                      let isHl = false;
                                      if ((st.hlRadAdd || st.hlRadWin) && idx === st.rad.length - 1) {
                                          isHl = true;
                                      }
                                      return (
                                          <React.Fragment key={`rad-${idx}-${val}`}>
                                              <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-1 animate-in zoom-in slide-in-from-right-8' : 'scale-100 z-10 m-0.5'}`}>
                                                  <NodeBlock val={val} themeColor="sky" isTarget={isHl} compact={true}/>
                                              </div>
                                          </React.Fragment>
                                      )
                                  })}
                                  {(!st.rad || st.rad.length === 0) && <span className="text-slate-400 italic text-sm font-mono px-4">empty</span>}
                              </div>
                          </div>

                          {/* dir Queue */}
                          <div className="flex flex-col items-start w-full flex-1">
                              <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-rose-50 text-rose-600 border-rose-200 flex items-center gap-2`}><ListTree size={12}/> 'dir' Queue (Dire)</span>
                              <div className={`flex gap-1.5 p-4 border-[3px] bg-rose-50/50 rounded-[2rem] shadow-xl flex-wrap justify-start items-center w-full min-h-[100px] transition-colors duration-300 ${st.hlDirAdd || st.hlDirWin ? 'border-rose-400 ring-4 ring-rose-200' : 'border-rose-200'}`}>
                                  {st.dir && st.dir.map((val, idx) => {
                                      let isHl = false;
                                      if ((st.hlDirAdd || st.hlDirWin) && idx === st.dir.length - 1) {
                                          isHl = true;
                                      }
                                      return (
                                          <React.Fragment key={`dir-${idx}-${val}`}>
                                              <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-1 animate-in zoom-in slide-in-from-right-8' : 'scale-100 z-10 m-0.5'}`}>
                                                  <NodeBlock val={val} themeColor="rose" isTarget={isHl} compact={true}/>
                                              </div>
                                          </React.Fragment>
                                      )
                                  })}
                                  {(!st.dir || st.dir.length === 0) && <span className="text-slate-400 italic text-sm font-mono px-4">empty</span>}
                              </div>
                          </div>
                      </div>

                      {/* Battle Arena */}
                      {(!st.isSuccess && st.r_idx !== undefined) && (
                          <div className="flex flex-col items-center w-full mt-4 animate-in slide-in-from-bottom-8">
                              <div className="bg-slate-900 border-2 border-slate-700 rounded-[2rem] p-8 shadow-2xl w-full max-w-3xl relative overflow-hidden">
                                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                                  <h3 className="text-xs font-black uppercase tracking-widest text-amber-500 mb-6 flex items-center justify-center gap-2 relative z-10"><Swords size={16}/> Battle Arena</h3>
                                  
                                  <div className="flex justify-between items-center gap-8 relative z-10 px-8">
                                      
                                      <div className="flex flex-col items-center">
                                          <span className="text-[10px] font-black uppercase tracking-widest text-sky-400 mb-2">r_idx (Radiant)</span>
                                          <div className={`relative transition-all duration-500 ${st.hlRadWin ? 'scale-125 z-20' : 'scale-100 z-10'} ${st.hlDirWin ? 'opacity-30 grayscale' : ''}`}>
                                              <NodeBlock val={st.r_idx} themeColor="sky" isTarget={st.hlRadWin || st.isComparing} isDeleted={st.hlDirWin}/>
                                          </div>
                                      </div>

                                      <div className="flex flex-col items-center justify-center">
                                          <span className={`font-mono text-4xl font-black ${st.isComparing ? 'text-amber-400' : 'text-slate-600'}`}>VS</span>
                                          {st.isComparing && <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Checking who is smaller</span>}
                                      </div>

                                      <div className="flex flex-col items-center">
                                          <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-2">d_idx (Dire)</span>
                                          <div className={`relative transition-all duration-500 ${st.hlDirWin ? 'scale-125 z-20' : 'scale-100 z-10'} ${st.hlRadWin ? 'opacity-30 grayscale' : ''}`}>
                                              <NodeBlock val={st.d_idx} themeColor="rose" isTarget={st.hlDirWin || st.isComparing} isDeleted={st.hlRadWin}/>
                                          </div>
                                      </div>

                                  </div>
                                  
                                  {(st.hlRadWin || st.hlDirWin) && (
                                      <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col items-center animate-in slide-in-from-bottom-4 relative z-10">
                                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2">Next Round Index Calculation</span>
                                          <span className="font-mono text-2xl font-black text-white bg-slate-800 px-6 py-2 rounded-xl shadow-inner border border-slate-700">
                                              {st.hlRadWin ? st.r_idx : st.d_idx} <span className="text-slate-500">+</span> {st.n} <span className="text-slate-500">=</span> <span className="text-emerald-400">{(st.hlRadWin ? st.r_idx : st.d_idx) + st.n}</span>
                                          </span>
                                      </div>
                                  )}
                              </div>
                          </div>
                      )}
                  </div>
              )}

              {/* NAIVE APPROACH VISUALS */}
              {selectedOpId === 'naiveSimulation' && st.arr !== undefined && (
                  <div className="flex flex-col items-center w-full max-w-6xl gap-8 animate-in slide-in-from-bottom-4">
                      
                      {/* State Variables Overlay */}
                      {!st.isSuccess && (
                          <div className="flex w-full gap-4 max-w-3xl mx-auto">
                              <div className={`bg-white border-2 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center flex-1 transition-all duration-300 ${st.isCheckingCount ? 'border-amber-400 bg-amber-50 ring-4 ring-amber-200 scale-105' : 'border-slate-200'}`}>
                                  <span className={`text-[10px] font-black uppercase tracking-widest mb-2 text-sky-600`}>rCount (Radiant)</span>
                                  <span className={`font-mono text-4xl font-black text-sky-600`}>{st.rCount !== undefined ? st.rCount : '-'}</span>
                              </div>

                              <div className={`bg-white border-2 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center flex-1 transition-all duration-300 ${st.isCheckingCount ? 'border-amber-400 bg-amber-50 ring-4 ring-amber-200 scale-105' : 'border-slate-200'}`}>
                                  <span className={`text-[10px] font-black uppercase tracking-widest mb-2 text-rose-600`}>dCount (Dire)</span>
                                  <span className={`font-mono text-4xl font-black text-rose-600`}>{st.dCount !== undefined ? st.dCount : '-'}</span>
                              </div>
                          </div>
                      )}

                      <div className="flex flex-col items-start w-full mt-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-2`}><RotateCcw size={12}/> Circular Array 'arr'</span>
                          
                          <div className={`flex gap-1.5 p-4 border-[3px] bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center items-center w-full min-h-[120px] transition-colors duration-300 border-amber-200`}>
                              {st.arr.map((val, idx) => {
                                  let isHl = false;
                                  let color = val === 'R' ? 'sky' : (val === 'D' ? 'rose' : 'slate');
                                  let isDeleted = val === 'X';
                                  let labels = [];

                                  if (st.hlI && st.i === idx) {
                                      isHl = true;
                                      color = 'amber';
                                      labels.push({ text: 'i', color: 'amber', pos: 'bottom' });
                                  }

                                  if (st.hlJ && st.j === idx) {
                                      isHl = true;
                                      color = 'fuchsia';
                                      labels.push({ text: 'j', color: 'fuchsia', pos: 'top' });
                                  }

                                  if (st.hlJTarget && st.j === idx) {
                                      isHl = true;
                                      color = 'rose'; // The one being deleted
                                  }

                                  if (st.countIter === idx) {
                                      isHl = true;
                                      color = 'amber';
                                  }

                                  return (
                                      <React.Fragment key={`arr-${idx}`}>
                                          <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-1'} ${st.hlJTarget && st.j === idx ? 'animate-out zoom-out fade-out' : ''}`}>
                                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">
                                                {labels.filter(l => l.pos === 'top').map((l, x) => (
                                                    <React.Fragment key={x}>
                                                        <PointerLabel label={l.text} color={l.color} position="top" />
                                                    </React.Fragment>
                                                ))}
                                              </div>
                                              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                                {labels.filter(l => l.pos === 'bottom').map((l, x) => (
                                                    <React.Fragment key={x}>
                                                        <PointerLabel label={l.text} color={l.color} position="bottom" />
                                                    </React.Fragment>
                                                ))}
                                              </div>
                                              <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} isDeleted={isDeleted} />
                                          </div>
                                      </React.Fragment>
                                  )
                              })}
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
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-amber-600'}`}>
                <Combine className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Dota2 Senate</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'emerald' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                      LC 649 • Queue / Simulation
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
                  In the world of Dota2, there are two parties: the Radiant and the Dire.<br/><br/>
                  The Dota2 senate consists of senators coming from two parties. Now the Senate wants to decide on a change in the Dota2 game. The voting for this change is a round-based procedure. In each round, each senator can exercise one of the two rights:
                  <ul className="list-disc pl-8 mt-2 space-y-1">
                      <li><strong>Ban one senator's right:</strong> A senator can make another senator lose all his rights in this and all the following rounds.</li>
                      <li><strong>Announce the victory:</strong> If this senator found the senators who still have rights to vote are all from the same party, he can announce the victory and decide on the change in the game.</li>
                  </ul>
                  <br/>
                  Given a string <code>senate</code> representing each senator's party belonging. The character <code>'R'</code> and <code>'D'</code> represent the Radiant party and the Dire party. Then if there are <code>n</code> senators, the size of the given string will be <code>n</code>.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-sky-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-sky-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> senate = "RD"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> "Radiant"</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation:
The first senator comes from Radiant and he can just ban the next senator's right in round 1. 
And the second senator can't exercise any rights anymore since his right has been banned. 
And in round 2, the first senator can just announce the victory since he is the only guy in the senate who can vote.
                        </div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-rose-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-rose-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> senate = "RDD"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> "Dire"</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation:
The first senator comes from Radiant and he can just ban the next senator's right in round 1.
The second senator can't exercise any rights.
The third senator comes from Dire and he can ban the first senator's right.
In round 2, the third senator can just announce the victory.
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Traps</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-2">
                        <li><code>n == senate.length</code></li>
                        <li>1 &lt;= n &lt;= 10⁴</li>
                        <li><code>senate[i]</code> is either <code>'R'</code> or <code>'D'</code>.</li>
                        <li className={`font-bold mt-2 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            Trap: Simulating this in place on an array by linearly searching for the next available opposing senator takes O(N) per ban. With N/2 bans, this leads to an O(N²) solution which is inefficient.
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
                                <span>'senate' String (Rs and Ds)</span>
                            </label>
                            <input 
                                type="text"
                                value={senateInput} 
                                onChange={(e) => setSenateInput(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner uppercase ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-amber-500'}`} 
                                spellCheck={false}
                                placeholder="RDD"
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
                        <h3 className="font-black text-emerald-400 text-lg uppercase tracking-widest mb-6">Greedy Choice Property</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>The problem states that a senator can ban ANY opposing senator. However, the optimal strategy for any senator is to be greedy: <strong>ban the next immediate opposing senator in the voting line.</strong></p>
                            <p>Why? If you ban someone behind you, they've already voted this round! You want to ban the person in front of you so they lose their vote before they get a chance to ban one of your allies.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-emerald-700 text-lg uppercase tracking-widest mb-6">The Two Queues Optimization</h3>
                        <div className="space-y-4 text-sm text-emerald-900/80 leading-relaxed font-medium">
                            <p>Simulating this greedy choice in a circular array is O(N²) because finding the "next" opponent takes O(N) scanning time per turn.</p>
                            <p>We can optimize this to O(N) by pre-sorting the senators into two queues containing their indices. By peeking at the queues, we instantly know who votes next. The senator with the smaller index acts first.</p>
                            <p>The winner survives to vote again in the next round, so we add <code>N</code> to their index to place them at the back of the "line" chronologically.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-emerald-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-emerald-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering the Round Simulation</h3>
                    <p className="text-sm text-emerald-50 leading-relaxed italic max-w-2xl font-mono">"Interviewers want to see if you can elegantly handle 'circular' arrays over multiple rounds. The mathematical trick of pushing the winner back to the queue with `index + N` is the silver bullet. It beautifully simulates them wrapping around the array without needing any complex modulo logic."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><RotateCcw size={16}/></div>
                               1. Discuss the Greedy Choice
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "The first thing to recognize is the optimal strategy: a senator should always greedily ban the next upcoming opposing senator. If we try to simulate this linearly on a string or array using `indexOf` or scanning, it will result in O(N²) time complexity because we re-scan for targets."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Combine size={16}/></div>
                               2. Pivot to Two Queues
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "To bring this down to O(N), we can use two Queues. One for the Radiant senators and one for the Dire senators, storing their indices. This gives us O(1) access to who is next in line for both parties."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Code2 size={16}/></div>
                               3. Detail the Execution
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "I'll populate both queues. Then, while both queues have elements, I'll poll the front of both. If `r_idx &lt; d_idx`, the Radiant senator acts first and bans the Dire senator. The Dire senator is discarded. The Radiant senator survives to the next round, so I push them back into their queue with `r_idx + n`. This `+ n` effectively puts them chronologically in the next round. I return the party of whichever queue is not empty at the end."
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>'senate' String</label>
                              <input type="text" value={senateInput} onChange={(e) => setSenateInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner uppercase ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-amber-500'}`} />
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
                                    Victory: <span className="font-black text-3xl text-white ml-2 block mt-2">{st.finalAns}</span>
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