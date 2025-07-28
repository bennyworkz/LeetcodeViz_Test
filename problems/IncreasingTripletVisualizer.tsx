import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, Maximize, Target, Focus, Type, CheckCircle2, XCircle, ArrowDown, ArrowUp, Layout, TrendingUp
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  greedy: {
    id: 'greedy',
    title: '1. Greedy (Optimal)',
    icon: <TrendingUp size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public boolean increasingTriplet(int[] nums) {
    if (nums == null || nums.length < 3) return false;
    
    int first = Integer.MAX_VALUE;
    int second = Integer.MAX_VALUE;
    
    for (int num : nums) {
        if (num <= first) {
            // Update the smallest element found so far
            first = num;
        } 
        else if (num <= second) {
            // Update the second smallest element that comes AFTER a valid 'first'
            second = num;
        } 
        else {
            // If we find a number strictly greater than 'second', 
            // we have found our triplet!
            return true;
        }
    }
    
    return false;
}`,
    desc: "The Optimal Greedy approach. We maintain two variables, 'first' and 'second'. We iterate through the array, updating 'first' to the smallest value seen, and 'second' to the smallest value seen that is strictly greater than 'first'. If we ever encounter a value greater than 'second', we guarantee an increasing triplet exists."
  },
  bruteForce: {
    id: 'bruteForce',
    title: '2. Brute Force (Naive)',
    icon: <SearchCode size={16} />,
    complexity: 'Time: O(N³) | Space: O(1)',
    code: `public boolean increasingTriplet(int[] nums) {
    int n = nums.length;
    if (n < 3) return false;
    
    // Check every possible triplet combination
    for (int i = 0; i < n - 2; i++) {
        for (int j = i + 1; j < n - 1; j++) {
            for (int k = j + 1; k < n; k++) {
                if (nums[i] < nums[j] && nums[j] < nums[k]) {
                    return true;
                }
            }
        }
    }
    
    return false;
}`,
    desc: "The Naive method. We use three nested loops to explicitly check every single (i, j, k) triplet combination where i < j < k. Because of the three nested loops, this results in O(N³) time complexity, which will result in a Time Limit Exceeded (TLE) error for large arrays."
  }
};

// --- Helper UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|char|return|if|else|for|while|continue|break|new|length|String|charAt|substring|Math|max|min|increasingTriplet|nums|first|second|num|Integer|MAX_VALUE)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  
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
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'char', 'return', 'if', 'else', 'for', 'while', 'continue', 'break', 'new'].includes(part);
            const isObject = ['String', 'Math', 'Integer'].includes(part);
            const isVar = ['nums', 'first', 'second', 'num', 'n', 'i', 'j', 'k'].includes(part);
            const isMapCall = ['length', 'max', 'min', 'MAX_VALUE', 'increasingTriplet'].includes(part);
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

const NodeBlock = ({ val, idx, themeColor = 'slate', isTarget, isDimmed }) => {
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
    const displayVal = val === null ? '_' : String(val);

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center min-w-[48px] min-h-[56px] md:min-w-[56px] md:min-h-[64px] border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-2xl px-1 py-1 bg-white/60 ${activeTheme.text} ${isDimmed ? 'opacity-50' : 'opacity-100'}`}>
                    {displayVal}
                </div>
                {idx !== undefined && (
                    <div className={`flex w-full h-4 md:h-5 border-t border-black/10 ${activeTheme.index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className="text-[8px] md:text-[9px] font-black tracking-widest uppercase">Idx {idx}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Application ---

export default function IncreasingTripletVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('greedy');
  
  // Good default that shows 'first' updating after 'second' is already set
  const [numsInput, setNumsInput] = useState('2,1,5,0,4,6');
  const [baseNums, setBaseNums] = useState([2, 1, 5, 0, 4, 6]);
  
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

  // Debounce input to safely parse arrays
  useEffect(() => {
    const timer = setTimeout(() => {
      let parsedArr = numsInput.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      if (parsedArr.length === 0) parsedArr = [2, 1, 5, 0, 4, 6];
      if (parsedArr.length > 25) parsedArr = parsedArr.slice(0, 25);

      setBaseNums(parsedArr);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
    }, 400);
    return () => clearTimeout(timer);
  }, [numsInput, selectedOpId]);

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
    if (!baseNums || baseNums.length === 0) return [{ phase: 'Init', description: 'Enter valid array.', line: 1, state: { arr: [] } }];

    let arr = [...baseNums];
    let n = arr.length;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, description: ds, line: ln, 
        state: { arr: [...arr], n, ...st } 
    });

    if (selectedOpId === 'greedy') {
        let first = Infinity;
        let second = Infinity;
        let firstIdx = -1;
        let secondIdx = -1;
        
        add("Function Call", `public boolean increasingTriplet(int[] nums)`, 1, { first, second, firstIdx, secondIdx });
        
        if (n < 3) {
            add("Edge Case", `if (nums == null || nums.length < 3) return false;\nArray is too small to contain a triplet.`, 2, { first, second, firstIdx, secondIdx, isSuccess: true, finalAns: false });
            return steps;
        }

        add("Init Trackers", `int first = Integer.MAX_VALUE;\nint second = Integer.MAX_VALUE;`, 4, { first, second, firstIdx, secondIdx });
        
        for (let i = 0; i < n; i++) {
            let num = arr[i];
            add("Advance Index", `for (int num : nums)  // Index ${i}\nCurrent number being processed: ${num}`, 7, { first, second, firstIdx, secondIdx, i, num, isEvaluating: true });
            
            add("Check First", `if (num <= first)\nIs ${num} <= ${first === Infinity ? 'MAX' : first}?`, 8, { first, second, firstIdx, secondIdx, i, num, comparingFirst: true });
            
            if (num <= first) {
                let prevFirst = first;
                first = num;
                firstIdx = i;
                add("Update First", `first = num;\nYes! Updated 'first' from ${prevFirst === Infinity ? 'MAX' : prevFirst} to ${first}.`, 10, { first, second, firstIdx, secondIdx, i, num, hlFirstUpdate: true });
            } else {
                add("Check Second", `else if (num <= second)\nIs ${num} <= ${second === Infinity ? 'MAX' : second}?`, 12, { first, second, firstIdx, secondIdx, i, num, comparingSecond: true });
                if (num <= second) {
                    let prevSecond = second;
                    second = num;
                    secondIdx = i;
                    add("Update Second", `second = num;\nYes! Updated 'second' from ${prevSecond === Infinity ? 'MAX' : prevSecond} to ${second}.`, 14, { first, second, firstIdx, secondIdx, i, num, hlSecondUpdate: true });
                } else {
                    add("Found Triplet", `else { return true; }\n${num} > ${first} AND ${num} > ${second}. Triplet found!`, 18, { first, second, firstIdx, secondIdx, i, num, isSuccess: true, hlSuccess: true, finalAns: true, thirdIdx: i });
                    return steps;
                }
            }
        }
        
        add("Return Result", `return false;\nArray traversal complete. No valid triplet found.`, 22, { first, second, firstIdx, secondIdx, isSuccess: true, finalAns: false });

    } else if (selectedOpId === 'bruteForce') {
        if (n < 3) {
            add("Edge Case", `if (n < 3) return false;`, 3, { isSuccess: true, finalAns: false });
            return steps;
        }

        add("Start Brute Force", `Outer loop over i, middle over j, inner over k.`, 6, {});

        let found = false;
        loopOut:
        for (let i = 0; i < n - 2; i++) {
            for (let j = i + 1; j < n - 1; j++) {
                for (let k = j + 1; k < n; k++) {
                    add("Evaluate Triplet", `Testing indices (i=${i}, j=${j}, k=${k})\nValues: ${arr[i]}, ${arr[j]}, ${arr[k]}`, 9, { i, j, k, comparingTriplet: true });
                    
                    if (arr[i] < arr[j] && arr[j] < arr[k]) {
                        add("Found Triplet", `return true;\n${arr[i]} < ${arr[j]} < ${arr[k]}`, 10, { i, j, k, isSuccess: true, finalAns: true, hlSuccess: true });
                        found = true;
                        break loopOut;
                    }
                }
            }
        }
        
        if (!found) {
            add("Return False", `return false;\nChecked all combinations, no triplet exists.`, 16, { isSuccess: true, finalAns: false });
        }
    }

    return steps;
  }, [baseNums, selectedOpId]);

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

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { arr: [] } };
  const st = curStepData.state || { arr: [] };
  const isLastStep = currentStep === trace.length - 1;

  const themeColor = selectedOpId === 'greedy' ? 'emerald' : 'amber';

  // --- Rendering Helpers ---

  const renderArray = () => {
      if (!st.arr || st.arr.length === 0) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full mt-4">
              <div className="flex gap-2 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center items-center">
                  
                  {st.arr.map((val, idx) => {
                      let color = 'slate';
                      let isHl = false;
                      let isDimmed = false;
                      let labels = [];

                      // --- Greedy Visuals ---
                      if (selectedOpId === 'greedy') {
                          if (st.firstIdx === idx) {
                              labels.push({ text: 'First', color: 'sky', pos: 'top' });
                              color = 'sky';
                              isHl = true;
                          }
                          if (st.secondIdx === idx) {
                              labels.push({ text: 'Second', color: 'fuchsia', pos: 'bottom' });
                              color = 'fuchsia';
                              isHl = true;
                          }
                          if (st.i === idx) {
                              labels.push({ text: 'Current', color: 'slate', pos: 'top' });
                              isHl = true;
                              if (st.hlFirstUpdate) color = 'sky';
                              else if (st.hlSecondUpdate) color = 'fuchsia';
                              else color = 'amber';
                          }

                          if (st.hlSuccess) {
                              if (idx === st.firstIdx || idx === st.secondIdx || idx === st.thirdIdx) {
                                  color = 'emerald';
                                  isHl = true;
                                  if (idx === st.thirdIdx) labels.push({ text: 'Third', color: 'emerald', pos: 'bottom' });
                              } else {
                                  isDimmed = true;
                              }
                          }
                      } 
                      // --- Brute Force Visuals ---
                      else if (selectedOpId === 'bruteForce') {
                          if (st.i === idx) {
                              labels.push({ text: 'i', color: 'sky', pos: 'top' });
                              color = 'sky';
                              isHl = true;
                          }
                          if (st.j === idx) {
                              labels.push({ text: 'j', color: 'fuchsia', pos: 'bottom' });
                              color = 'fuchsia';
                              isHl = true;
                          }
                          if (st.k === idx) {
                              labels.push({ text: 'k', color: 'amber', pos: 'top' });
                              color = 'amber';
                              isHl = true;
                          }
                          
                          if (st.hlSuccess) {
                              if (idx === st.i || idx === st.j || idx === st.k) {
                                  color = 'emerald';
                                  isHl = true;
                              } else {
                                  isDimmed = true;
                              }
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
                              <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} isDimmed={isDimmed} />
                          </div>
                      )
                  })}
              </div>

              {/* Data Overlay */}
              {!st.isSuccess && selectedOpId === 'greedy' && (
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-4">
                    <div className={`bg-white border-2 rounded-2xl p-4 shadow-md flex flex-col items-center transition-all ${st.hlFirstUpdate ? 'border-sky-400 bg-sky-50 ring-4 ring-sky-200' : 'border-slate-200'}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2"><ArrowDown size={14}/> 'First' (Smallest)</span>
                        <div className="flex items-center gap-2 font-mono text-3xl font-bold">
                            <span className={st.hlFirstUpdate ? 'text-sky-600' : 'text-slate-700'}>
                                {st.first !== undefined ? (st.first === Infinity ? 'MAX' : st.first) : '-'}
                            </span>
                        </div>
                    </div>

                    <div className={`bg-white border-2 rounded-2xl p-4 shadow-md flex flex-col items-center transition-all ${st.hlSecondUpdate ? 'border-fuchsia-400 bg-fuchsia-50 ring-4 ring-fuchsia-200' : 'border-slate-200'}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2"><ArrowUp size={14}/> 'Second' Smallest</span>
                        <div className="flex items-center gap-2 font-mono text-3xl font-bold">
                            <span className={st.hlSecondUpdate ? 'text-fuchsia-600' : 'text-slate-700'}>
                                {st.second !== undefined ? (st.second === Infinity ? 'MAX' : st.second) : '-'}
                            </span>
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
                <Focus className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Increasing Triplet Subseq</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'emerald' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                      LC 334 • Greedy Sequence
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
                
                <p className="text-base leading-relaxed">
                  Given an integer array <code>nums</code>, return <code>true</code> if there exists a triple of indices <code>(i, j, k)</code> such that <code>i &lt; j &lt; k</code> and <code>nums[i] &lt; nums[j] &lt; nums[k]</code>. If no such indices exist, return <code>false</code>.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-emerald-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> nums = [1,2,3,4,5]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> true</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation: Any triplet where i &lt; j &lt; k is valid.
For instance, nums[0] &lt; nums[1] &lt; nums[2] (1 &lt; 2 &lt; 3).
                        </div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> nums = [5,4,3,2,1]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> false</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation:<br/>No triplet exists where earlier numbers are strictly smaller than later numbers.</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Traps</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-2">
                        <li>1 &lt;= nums.length &lt;= 5 * 10⁵</li>
                        <li>-2³¹ &lt;= nums[i] &lt;= 2³¹ - 1</li>
                        <li className={`font-bold mt-2 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            Follow-up: Could you implement a solution that runs in O(n) time complexity and O(1) space complexity? (Hint: The Greedy algorithm does exactly this!).
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
                                <span>Array 'nums' (Comma separated)</span>
                            </label>
                            <input 
                                type="text"
                                value={numsInput} 
                                onChange={(e) => setNumsInput(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-amber-500'}`} 
                                spellCheck={false}
                                placeholder="2,1,5,0,4,6"
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
                            <div className={`text-xl font-black tracking-tight uppercase font-mono flex items-center gap-3 ${st.finalAns ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {st.finalAns ? <PartyPopper size={20}/> : <XCircle size={20}/>} Evaluation Complete
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
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur ${themeColor === 'emerald' ? 'text-emerald-500' : 'text-amber-500'}`}><Layout size={14}/> Array Elements Tracker</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-amber-600'}`}><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-amber-600'}`}><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-amber-600'}`}><Maximize2 size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-20 pb-16 gap-4 items-center overflow-x-auto overflow-y-hidden scrollbar-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           {renderArray()}
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
                        <h3 className="font-black text-emerald-400 text-lg uppercase tracking-widest mb-6">The Magic of Two Variables</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>To find an increasing triplet <code>i &lt; j &lt; k</code>, we don't actually need to store the specific array indices. We just need to prove that the <strong>relationship</strong> existed at some point.</p>
                            <p>We do this using two variables: <code>first</code> and <code>second</code>.</p>
                            <p>We greedily keep <code>first</code> as small as possible. If we find a number bigger than <code>first</code> but smaller than <code>second</code>, we update <code>second</code>. By the time <code>second</code> is set, it serves as undeniable <strong>proof</strong> that a valid <code>first</code> was seen before it.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-amber-50 border border-amber-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-amber-700 text-lg uppercase tracking-widest mb-6">The Ultimate Trap: The Reset</h3>
                        <div className="space-y-4 text-sm text-amber-900/80 leading-relaxed font-medium">
                            <p>What happens if <code>second</code> is already set, but then we find a new, tiny <code>first</code> value? For example, in <code>[2, 1, 5, 0, 4, 6]</code>:</p>
                            <p>1. <code>first=1, second=5</code>.</p>
                            <p>2. We see <code>0</code>. We update <code>first=0</code>. Now <code>first</code> is chronologically AFTER <code>second</code>!</p>
                            <p>3. We see <code>4</code>. Because <code>4 &le; 5 (second)</code>, we update <code>second=4</code>.</p>
                            <p>4. We see <code>6</code>. Because <code>6 &gt; 4 (second)</code>, we return True!</p>
                            <p><strong>Even though `first` changed, `second` only ever exists because a valid `first` preceded it historically.</strong> The algorithm doesn't care exactly *where* the triplet is, only that it *exists*.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-emerald-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-emerald-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Explaining the "Historical Marker"</h3>
                    <p className="text-sm text-emerald-50 leading-relaxed italic max-w-2xl font-mono">"Interviewers will deliberately ask you: 'Wait, if first updates after second, your variables are out of order. Why does this still work?' You must confidently explain that `second` acts as a historical marker. It preserves the memory that a smaller element preceded it. You aren't finding the exact indices of the triplet, you are just proving one exists."</p>
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
                                "The brute force approach is to use three nested loops to test every combination of i, j, and k. This will take O(N³) time, which is incredibly slow and will easily result in a TLE."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><TrendingUp size={16}/></div>
                               2. Pivot to the Greedy State Approach
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "Because we just need to return a boolean proving existence, we don't need to save the array. We can accomplish this in O(N) time and O(1) space by greedily tracking the optimal candidates for the first and second elements of the triplet."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><ShieldAlert size={16}/></div>
                               3. Explain the `if/else` Ladder
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "I'll initialize `first` and `second` to Infinity. As I iterate through the array: if `num &lt;= first`, I update `first`. Else if `num &lt;= second`, I update `second`. Else, I have found a number strictly greater than both `first` and `second`, so I return `true`. The order of the `if/else` is critical because it forces `second` to only update if a valid `first` has already been established."
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
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? (themeColor === 'emerald' ? 'bg-emerald-900/40 border-emerald-800' : 'bg-amber-900/40 border-amber-800') : 'bg-slate-800/40 border-slate-700'}`}>
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
                          <div className="w-60 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>Array 'nums' (Comma separated)</label>
                              <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs uppercase focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-amber-500'}`} />
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
                           {renderArray()}
                      </div>
                  </div>
                  
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.finalAns ? 'border-emerald-500 shadow-emerald-500/30' : 'border-rose-500 shadow-rose-500/30'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.finalAns ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ${st.finalAns ? 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10' : 'bg-rose-500/20 text-rose-500 ring-rose-500/10'}`}>
                                    {st.finalAns ? <PartyPopper size={48} /> : <XCircle size={48}/>}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    COMPLETED
                                </h2>
                                <p className={`font-mono text-xl uppercase mb-8 tracking-widest ${st.finalAns ? 'text-emerald-400' : 'text-rose-400'} max-w-lg break-words`}>
                                    Result: <span className="font-black text-3xl text-white ml-2 block mt-2">{st.finalAns ? "TRUE" : "FALSE"}</span>
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg ${st.finalAns ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/20'}`}>
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