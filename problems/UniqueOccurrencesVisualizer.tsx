import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, Maximize, Target, Focus, Type, CheckCircle2, XCircle, ArrowDown, ArrowUp, Layout, TrendingUp, Clock, Layers, Calculator, Combine, SquareSquare, Mountain, Hash, Network
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalO1: {
    id: 'optimalO1',
    title: '1. Map + Set (Optimal)',
    icon: <Network size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public boolean uniqueOccurrences(int[] arr) {
    Map<Integer, Integer> countMap = new HashMap<>();
    for (int num : arr) {
        countMap.put(num, countMap.getOrDefault(num, 0) + 1);
    }
    
    Set<Integer> uniqueCounts = new HashSet<>();
    for (int count : countMap.values()) {
        if (!uniqueCounts.add(count)) {
            return false;
        }
    }
    
    return true;
}`,
    desc: "The Optimal Hash Map & Set approach. We first iterate through the array to count the occurrences of each element using a HashMap. Then, we iterate through those frequency counts and attempt to add them to a HashSet. The 'Set.add()' method returns false if the item already exists in the set, allowing us to instantly detect duplicate counts in O(N) total time."
  },
  naiveON2: {
    id: 'naiveON2',
    title: '2. Nested Loops (Naive)',
    icon: <SearchCode size={16} />,
    complexity: 'Time: O(N²) | Space: O(N)',
    code: `public boolean uniqueOccurrences(int[] arr) {
    List<Integer> checked = new ArrayList<>();
    List<Integer> counts = new ArrayList<>();
    
    for (int i = 0; i < arr.length; i++) {
        if (!checked.contains(arr[i])) {
            int count = 0;
            for (int j = 0; j < arr.length; j++) {
                if (arr[i] == arr[j]) {
                    count++;
                }
            }
            if (counts.contains(count)) {
                return false;
            }
            counts.add(count);
            checked.add(arr[i]);
        }
    }
    return true;
}`,
    desc: "The Naive approach. For every element, we check if we've processed it before. If not, we use an inner loop to scan the entire array and count its occurrences. We then check if we've seen that specific count before. Due to the nested loops and list lookups, this runs in O(N²) time."
  }
};

// --- Helper UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active = false, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|double|int|char|return|if|else|for|while|continue|break|new|length|Math|max|min|uniqueOccurrences|arr|countMap|uniqueCounts|checked|counts|Map|HashMap|Set|HashSet|List|ArrayList|put|getOrDefault|values|add|contains|num|count|i|j)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  
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
            const isObject = ['String', 'Math', 'Integer', 'Map', 'HashMap', 'Set', 'HashSet', 'List', 'ArrayList'].includes(part);
            const isVar = ['arr', 'countMap', 'uniqueCounts', 'checked', 'counts', 'num', 'count', 'i', 'j'].includes(part);
            const isMapCall = ['length', 'max', 'min', 'uniqueOccurrences', 'put', 'getOrDefault', 'values', 'add', 'contains'].includes(part);
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

const NodeBlock = ({ val, idx = undefined, themeColor = 'slate', isTarget = false, isDimmed = false, subtext = undefined, isMap = false, mapKey = undefined }) => {
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
    
    const displayVal = val === null || val === "" ? '\u00A0' : String(val);

    if (isMap) {
        return (
            <div className={`relative flex flex-col items-center group transition-all duration-500`}>
                <div className={`flex flex-col items-center min-w-[56px] md:min-w-[64px] border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                    <div className={`flex w-full h-5 border-b border-black/10 ${themes['indigo'].index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className="text-[8px] md:text-[9px] font-black tracking-widest uppercase">KEY: {mapKey}</span>
                        </div>
                    </div>
                    <div className={`flex-1 flex justify-center items-center w-full h-8 font-mono font-black text-xl bg-white/60 ${activeTheme.text} ${isDimmed ? 'opacity-50' : 'opacity-100'} whitespace-nowrap tracking-tighter`}>
                        {displayVal}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center min-w-[40px] md:min-w-[48px] min-h-[48px] md:min-h-[56px] border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-xl py-1 bg-white/60 ${activeTheme.text} ${isDimmed ? 'opacity-50' : 'opacity-100'} whitespace-nowrap tracking-tighter relative`}>
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

export default function UniqueOccurrencesVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalO1');
  
  const [arrInput, setArrInput] = useState('1, 2, 2, 1, 1, 3');
  const [baseArr, setBaseArr] = useState([1, 2, 2, 1, 1, 3]);
  
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
      let parsedArr = arrInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      
      if (parsedArr.length === 0) parsedArr = [1, 2, 2, 1, 1, 3];
      if (parsedArr.length > 20) parsedArr = parsedArr.slice(0, 20);

      setBaseArr(parsedArr);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
    }, 400);
    return () => clearTimeout(timer);
  }, [arrInput, selectedOpId]);

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
    if (!baseArr || baseArr.length === 0) return [{ phase: 'Init', description: 'Enter valid array.', line: 1, state: {} }];

    let arr = [...baseArr];
    const n = arr.length;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, description: ds, line: ln, 
        state: { arr: [...arr], n, ...st } 
    });

    if (selectedOpId === 'optimalO1') {
        let map = {};
        let set = new Set();
        
        add("Function Call", `public boolean uniqueOccurrences(int[] arr)`, 1, { });
        
        add("Init Map", `Map<Integer, Integer> countMap = new HashMap<>();\nPrepares a HashMap to count frequencies.`, 2, { map: {...map}, set: Array.from(set) });
        
        for (let i = 0; i < n; i++) {
            let num = arr[i];
            add("Loop arr", `for (int num : arr)\nIterating array. Current: ${num}`, 3, { iter: i, num, isEvalArr: true, map: {...map}, set: Array.from(set) });
            
            let prevCount = map[num] || 0;
            map[num] = prevCount + 1;
            add("Update Map", `countMap.put(num, countMap.getOrDefault(num, 0) + 1);\nIncrementing count for key ${num}. It becomes ${map[num]}.`, 4, { iter: i, num, map: {...map}, set: Array.from(set), hlMapKey: num });
        }
        
        add("Loop End", `Finished populating the HashMap.`, 3, { map: {...map}, set: Array.from(set) });
        
        add("Init Set", `Set<Integer> uniqueCounts = new HashSet<>();\nPrepares a HashSet to check for duplicate counts.`, 7, { map: {...map}, set: Array.from(set) });
        
        let mapValues = Object.values(map);
        for (let i = 0; i < mapValues.length; i++) {
            let count = mapValues[i];
            
            add("Loop Map Values", `for (int count : countMap.values())\nIterating over the counts in the map. Current count: ${count}`, 8, { map: {...map}, set: Array.from(set), mapIter: i, count, isEvalMap: true });
            
            let added = !set.has(count);
            add("Check Add to Set", `if (!uniqueCounts.add(${count}))\nDoes the set already contain ${count}? (!${added})`, 9, { map: {...map}, set: Array.from(set), mapIter: i, count, isCheckingSet: true });
            
            if (!added) {
                add("Duplicate Found", `return false;\nDuplicate count ${count} detected! Not all counts are unique.`, 10, { map: {...map}, set: Array.from(set), mapIter: i, count, isSuccess: true, finalAns: false, hlSetDup: count });
                return steps;
            }
            
            set.add(count);
            add("Added to Set", `(Count ${count} successfully added to HashSet)`, 9, { map: {...map}, set: Array.from(set), mapIter: i, count, hlSetAdd: count });
        }
        
        add("Loop End", `Finished checking all counts.`, 8, { map: {...map}, set: Array.from(set) });
        add("Return True", `return true;\nNo duplicates were found in the set. All counts are unique!`, 14, { map: {...map}, set: Array.from(set), isSuccess: true, finalAns: true });

    } else if (selectedOpId === 'naiveON2') {
        let checked = [];
        let counts = [];
        
        add("Function Call", `public boolean uniqueOccurrences(int[] arr)`, 1, { });
        
        add("Init Lists", `List<Integer> checked = new ArrayList<>();\nList<Integer> counts = new ArrayList<>();`, 3, { checked: [...checked], counts: [...counts] });
        
        for (let i = 0; i < n; i++) {
            let num = arr[i];
            add("Outer Loop", `for (int i = 0; i < arr.length; i++)\nChecking element arr[${i}] = ${num}`, 5, { checked: [...checked], counts: [...counts], outerI: i, num, isEvalOuter: true });
            
            let isChecked = checked.includes(num);
            add("Check Processed", `if (!checked.contains(${num}))\nHave we counted this number before? (${isChecked ? 'Yes' : 'No'})`, 6, { checked: [...checked], counts: [...counts], outerI: i, num, isCheckingProcessed: true });
            
            if (!isChecked) {
                let count = 0;
                add("Init count", `int count = 0;`, 7, { checked: [...checked], counts: [...counts], outerI: i, num, count });
                
                for (let j = 0; j < n; j++) {
                    add("Inner Loop", `for (int j = 0; j < arr.length; j++)\nScanning entire array to count ${num}.`, 8, { checked: [...checked], counts: [...counts], outerI: i, innerJ: j, num, count, isEvalInner: true });
                    
                    let match = arr[i] === arr[j];
                    add("Compare", `if (arr[${i}] == arr[${j}])\nIs ${arr[i]} == ${arr[j]}?`, 9, { checked: [...checked], counts: [...counts], outerI: i, innerJ: j, num, count, isComparing: true });
                    
                    if (match) {
                        count++;
                        add("Increment Count", `count++;\nFound an occurrence. Count is now ${count}.`, 10, { checked: [...checked], counts: [...counts], outerI: i, innerJ: j, num, count, hlMatch: true });
                    }
                }
                
                add("Inner Loop End", `Finished scanning for ${num}. Total count is ${count}.`, 8, { checked: [...checked], counts: [...counts], outerI: i, num, count });
                
                let hasCount = counts.includes(count);
                add("Check Duplicate Count", `if (counts.contains(${count}))\nHave we seen a frequency of ${count} before? (${hasCount ? 'Yes' : 'No'})`, 13, { checked: [...checked], counts: [...counts], outerI: i, num, count, isCheckingCounts: true });
                
                if (hasCount) {
                    add("Return False", `return false;\nDuplicate count ${count} detected!`, 14, { checked: [...checked], counts: [...counts], outerI: i, num, count, isSuccess: true, finalAns: false, hlCountsDup: count });
                    return steps;
                }
                
                counts.push(count);
                add("Add to counts", `counts.add(${count});`, 16, { checked: [...checked], counts: [...counts], outerI: i, num, count, hlCountsAdd: true });
                
                checked.push(num);
                add("Add to checked", `checked.add(${num});\nMarking ${num} as fully processed.`, 17, { checked: [...checked], counts: [...counts], outerI: i, num, count, hlCheckedAdd: true });
            }
        }
        
        add("Outer Loop End", `Processed all elements.`, 5, { checked: [...checked], counts: [...counts] });
        add("Return True", `return true;\nAll frequencies are unique!`, 20, { checked: [...checked], counts: [...counts], isSuccess: true, finalAns: true });
    }

    return steps;
  }, [baseArr, selectedOpId]);

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

  const themeColor = selectedOpId === 'optimalO1' ? 'emerald' : 'amber';

  // --- Rendering Helpers ---

  const renderVisuals = () => {
      if (st.arr === undefined) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full mt-2 gap-8 w-full">
              
              {/* Array Visualization */}
              <div className="flex flex-col items-start w-full max-w-5xl">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-sky-50 text-sky-600 border-sky-200 flex items-center gap-2`}><Layout size={12}/> int[] arr</span>
                  <div className="flex gap-1.5 p-4 border-[3px] border-sky-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[90px]">
                      {st.arr.map((val, idx) => {
                          let isHl = false;
                          let color = 'sky';
                          let labels = [];
                          let isDimmed = false;

                          if (selectedOpId === 'optimalO1') {
                              if (st.iter === idx) {
                                  isHl = true;
                                  color = 'sky';
                                  labels.push({ text: 'i', color: 'sky', pos: 'bottom' });
                              }
                              if (st.iter !== undefined && idx > st.iter) isDimmed = true;
                          } else {
                              if (st.outerI === idx) {
                                  isHl = true;
                                  color = 'amber';
                                  labels.push({ text: 'i', color: 'amber', pos: 'bottom' });
                              }
                              if (st.innerJ === idx) {
                                  isHl = true;
                                  color = 'fuchsia';
                                  labels.push({ text: 'j', color: 'fuchsia', pos: 'top' });
                              }
                          }

                          return (
                              <React.Fragment key={`arr-${idx}`}>
                                  <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-0.5'}`}>
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
                  </div>
              </div>

              {/* Hash Map & Hash Set (Optimal O1) */}
              {selectedOpId === 'optimalO1' && (
                  <div className="flex flex-col xl:flex-row w-full max-w-6xl gap-6 items-start justify-center">
                      {/* HashMap */}
                      <div className="flex flex-col items-start w-full flex-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-indigo-50 text-indigo-600 border-indigo-200 flex items-center gap-2`}><Network size={12}/> countMap (HashMap)</span>
                          <div className={`flex gap-3 p-5 border-[3px] border-indigo-200 bg-indigo-50/50 rounded-[2rem] shadow-md flex-wrap justify-start items-center w-full min-h-[110px]`}>
                              {st.map && Object.entries(st.map).map(([keyStr, val], idx) => {
                                  let key = parseInt(keyStr, 10);
                                  let isHl = false;
                                  let color = 'indigo';
                                  
                                  if (st.hlMapKey === key) {
                                      isHl = true;
                                      color = 'emerald';
                                  }

                                  if (st.mapIter !== undefined && Object.values(st.map)[st.mapIter] === val && st.count === val && st.isCheckingSet === undefined) {
                                      // Soft highlight for values iteration
                                      color = 'sky';
                                  }

                                  return (
                                      <React.Fragment key={`map-${key}`}>
                                          <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20' : 'scale-100 z-10'} ${st.hlMapKey === key ? 'animate-in zoom-in' : ''}`}>
                                              <NodeBlock val={val} mapKey={key} themeColor={color} isTarget={isHl} isMap={true} />
                                          </div>
                                      </React.Fragment>
                                  )
                              })}
                              {(!st.map || Object.keys(st.map).length === 0) && <span className="text-indigo-300 italic text-sm font-mono px-4">empty</span>}
                          </div>
                      </div>

                      {/* HashSet */}
                      <div className="flex flex-col items-start w-full flex-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center gap-2`}><Hash size={12}/> uniqueCounts (HashSet)</span>
                          <div className={`flex gap-2 p-5 border-[3px] border-emerald-200 bg-emerald-50/50 rounded-[2rem] shadow-md flex-wrap justify-start items-center w-full min-h-[110px] ${st.isCheckingSet ? 'ring-4 ring-amber-300' : ''}`}>
                              {st.set && st.set.map((val, idx) => {
                                  let isHl = false;
                                  let color = 'emerald';
                                  
                                  if (st.hlSetAdd === val) {
                                      isHl = true;
                                      color = 'sky';
                                  }
                                  if (st.hlSetDup === val) {
                                      isHl = true;
                                      color = 'rose';
                                  }

                                  return (
                                      <React.Fragment key={`set-${val}`}>
                                          <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20' : 'scale-100 z-10'} ${st.hlSetAdd === val ? 'animate-in zoom-in' : ''}`}>
                                              <NodeBlock val={val} themeColor={color} isTarget={isHl} />
                                          </div>
                                      </React.Fragment>
                                  )
                              })}
                              {(!st.set || st.set.length === 0) && <span className="text-emerald-300 italic text-sm font-mono px-4">empty</span>}
                          </div>
                      </div>
                  </div>
              )}

              {/* Naive State Variables */}
              {!st.isSuccess && selectedOpId === 'naiveON2' && (
                  <div className="flex w-full max-w-4xl gap-4 mt-2">
                      <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center flex-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Target Element</span>
                          <span className="font-mono text-3xl font-black text-amber-600">{st.num !== undefined ? st.num : '-'}</span>
                      </div>
                      
                      <div className={`bg-white border-2 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center flex-1 transition-all ${st.hlMatch || st.hlCount ? 'border-sky-300 bg-sky-50 ring-2 ring-sky-300' : 'border-slate-200'}`}>
                          <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 mb-2">Count</span>
                          <span className="font-mono text-4xl font-black text-sky-600">{st.count !== undefined ? st.count : '-'}</span>
                      </div>
                  </div>
              )}

              {/* Lists (Only for Naive) */}
              {selectedOpId === 'naiveON2' && (
                  <div className="flex flex-col xl:flex-row w-full max-w-6xl gap-6 items-start justify-center mt-2">
                      {/* checked */}
                      <div className="flex flex-col items-start w-full flex-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-slate-100 text-slate-600 border-slate-200 flex items-center gap-2`}><Target size={12}/> checked (ArrayList)</span>
                          <div className={`flex gap-1 p-3 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-lg backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[80px] ${st.isCheckingProcessed ? 'ring-4 ring-amber-300' : ''}`}>
                              {st.checked && st.checked.map((val, idx) => {
                                  let isHl = st.hlCheckedAdd && idx === st.checked.length - 1;
                                  return (
                                      <React.Fragment key={`check-${idx}`}>
                                          <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 animate-in zoom-in' : 'scale-100 z-10 m-1'}`}>
                                              <NodeBlock val={val} idx={idx} themeColor="slate" isTarget={isHl} />
                                          </div>
                                      </React.Fragment>
                                  )
                              })}
                              {(!st.checked || st.checked.length === 0) && <span className="text-slate-400 italic text-sm font-mono px-4">empty</span>}
                          </div>
                      </div>

                      {/* counts */}
                      <div className="flex flex-col items-start w-full flex-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center gap-2`}><Target size={12}/> counts (ArrayList)</span>
                          <div className={`flex gap-1 p-3 border-[3px] border-emerald-300 bg-white/90 rounded-[2rem] shadow-lg backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[80px] ${st.isCheckingCounts ? 'ring-4 ring-amber-300' : ''}`}>
                              {st.counts && st.counts.map((val, idx) => {
                                  let isHl = st.hlCountsAdd && idx === st.counts.length - 1;
                                  let isDup = st.hlCountsDup === val;
                                  return (
                                      <React.Fragment key={`cnt-${idx}`}>
                                          <div className={`relative transition-all duration-300 ${isHl || isDup ? 'scale-110 z-20 animate-in zoom-in' : 'scale-100 z-10 m-1'}`}>
                                              <NodeBlock val={val} idx={idx} themeColor={isDup ? "rose" : "emerald"} isTarget={isHl || isDup} />
                                          </div>
                                      </React.Fragment>
                                  )
                              })}
                              {(!st.counts || st.counts.length === 0) && <span className="text-slate-400 italic text-sm font-mono px-4">empty</span>}
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
                <Network className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Unique Number of Occurrences</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'emerald' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                      LC 1207 • Hash Map & Set
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
                  Given an array of integers <code>arr</code>, return <code>true</code> if the number of occurrences of each value in the array is <strong>unique</strong>, or <code>false</code> otherwise.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-emerald-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> arr = [1,2,2,1,1,3]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> true</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation:
The value 1 has 3 occurrences.
The value 2 has 2 occurrences.
The value 3 has 1 occurrence.
No two values have the same number of occurrences.
                        </div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-rose-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-rose-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> arr = [1,2]</div>
                        <div><span className="text-rose-400 font-bold">Output:</span> false</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation:
The value 1 has 1 occurrence.
The value 2 has 1 occurrence.
Both have 1 occurrence, so it is not unique.
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Traps</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-2">
                        <li>1 &lt;= arr.length &lt;= 1000</li>
                        <li>-1000 &lt;= arr[i] &lt;= 1000</li>
                        <li className={`font-bold mt-2 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            Trap: Using nested loops and ArrayLists to count occurrences and verify uniqueness will be O(N²). You must use Hash Maps to count frequencies in O(N) and Hash Sets to verify uniqueness in O(1).
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
                                <span>'arr' Array (Comma separated)</span>
                            </label>
                            <input 
                                type="text"
                                value={arrInput} 
                                onChange={(e) => setArrInput(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-amber-500'}`} 
                                spellCheck={false}
                                placeholder="1, 2, 2, 1, 1, 3"
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-3 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 group disabled:opacity-30 ${themeColor === 'emerald' ? 'bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700' : 'bg-amber-600 shadow-amber-200 hover:bg-amber-700'}`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-6 shadow-xl border transition-all duration-300 min-h-[130px] relative overflow-hidden flex-1 ${st.isSuccess ? (st.finalAns === true ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={80} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-2 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className={`text-xl font-black tracking-tight uppercase font-mono flex items-center gap-3 ${st.finalAns === true ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {st.finalAns === true ? <PartyPopper size={20}/> : <XCircle size={20}/>} Evaluation Complete
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
                        <h3 className="font-black text-emerald-400 text-lg uppercase tracking-widest mb-6">Frequency Counting with HashMaps</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>Whenever a problem asks you to track "occurrences" or "frequencies" of elements, a <strong>HashMap</strong> is your best friend.</p>
                            <p>A HashMap allows us to store Key-Value pairs where the <code>Key</code> is the number from the array, and the <code>Value</code> is the count.</p>
                            <p>Because HashMaps provide O(1) constant time lookups and insertions, we can count the frequency of an entire array in a single O(N) pass.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-emerald-700 text-lg uppercase tracking-widest mb-6">Uniqueness with HashSets</h3>
                        <div className="space-y-4 text-sm text-emerald-900/80 leading-relaxed font-medium">
                            <p>Once we have our frequencies, the problem requires us to verify if they are all <strong>unique</strong>.</p>
                            <p>A <strong>HashSet</strong> is defined mathematically as a collection of unique items. If you try to add an item that already exists, the <code>.add()</code> operation simply returns <code>false</code>.</p>
                            <p>We can iterate through our HashMap values and attempt to add them to a HashSet. If <code>.add()</code> ever returns <code>false</code>, we immediately know there's a duplicate frequency, taking only O(N) time.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-emerald-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-emerald-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Combining Data Structures</h3>
                    <p className="text-sm text-emerald-50 leading-relaxed italic max-w-2xl font-mono">"Interviewers love problems that require the chained use of multiple data structures. The naive solution uses arrays and nested loops (O(N²)). By chaining a HashMap (to count) and a HashSet (to verify uniqueness), you demonstrate fluency with standard library collections and optimize the solution to O(N)."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><SearchCode size={16}/></div>
                               1. Acknowledge the Naive Approach
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "The brute force way would be to use a nested loop to count the occurrences of each element, store those counts in an ArrayList, and then use `.contains()` to check if a newly calculated count already exists. Because of the nested scanning and list lookups, this runs in O(N²) time."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Network size={16}/></div>
                               2. Pivot to Hash Map/Set
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "We can easily optimize this to O(N) time and space by chaining two hash-based structures. First, I'll use a HashMap to count the frequency of each number. Then, I'll use a HashSet to verify that all of those frequencies are distinct."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Code2 size={16}/></div>
                               3. Detail the Execution
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "I'll iterate over the array once, executing `countMap.put(num, countMap.getOrDefault(num, 0) + 1)` to build my frequencies. Next, I instantiate a HashSet. I iterate over `countMap.values()`, and call `!uniqueCounts.add(count)`. If that returns true, it means the Set rejected the addition because it was a duplicate, so I return `false`. If the loop finishes, I return `true`."
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
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? (st.finalAns === true ? 'bg-emerald-900/40 border-emerald-800' : 'bg-rose-900/40 border-rose-800') : 'bg-slate-800/40 border-slate-700'}`}>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>'arr' Array (Comma separated)</label>
                              <input type="text" value={arrInput} onChange={(e) => setArrInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-amber-500'}`} />
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
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.finalAns === true ? 'border-emerald-500 shadow-emerald-500/30' : 'border-rose-500 shadow-rose-500/30'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.finalAns === true ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ${st.finalAns === true ? 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10' : 'bg-rose-500/20 text-rose-500 ring-rose-500/10'}`}>
                                    {st.finalAns === true ? <PartyPopper size={48} /> : <XCircle size={48} />}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    COMPLETED
                                </h2>
                                <p className={`font-mono text-xl uppercase mb-8 tracking-widest ${st.finalAns === true ? 'text-emerald-400' : 'text-rose-400'} max-w-lg break-words`}>
                                    Result: <span className="font-black text-3xl text-white ml-2 block mt-2">{st.finalAns === true ? 'TRUE' : 'FALSE'}</span>
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg ${st.finalAns === true ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/20'}`}>
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