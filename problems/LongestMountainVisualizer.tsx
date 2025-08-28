import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, Mountain, TrendingUp, TrendingDown, ArrowDown, ArrowUp, Layout, Database
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  peakExpansion: {
    id: 'peakExpansion',
    title: '1. Peak Expansion (Optimal)',
    icon: <Mountain size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public int longestMountain(int[] arr) {
    int n = arr.length;
    int maxLen = 0;
    int i = 1;
    
    while (i < n - 1) {
        boolean isPeak = arr[i - 1] < arr[i] && arr[i] > arr[i + 1];
        
        if (!isPeak) {
            i++;
            continue;
        }
        
        // Expand Left
        int left = i - 1;
        while (left > 0 && arr[left - 1] < arr[left]) {
            left--;
        }
        
        // Expand Right
        int right = i + 1;
        while (right < n - 1 && arr[right] > arr[right + 1]) {
            right++;
        }
        
        // Calculate width and update max
        maxLen = Math.max(maxLen, right - left + 1);
        
        // Skip to the right base to save time
        i = right;
    }
    
    return maxLen;
}`,
    desc: "The O(1) space optimal approach. We iterate through the array looking for a 'Peak' (an element strictly greater than its left and right neighbors). Once found, we expand a left pointer down the left flank, and a right pointer down the right flank to find the bases. We calculate the length, update the max, and skip the explorer 'i' to the right base."
  },
  dynamicProgramming: {
    id: 'dynamicProgramming',
    title: '2. Dynamic Programming',
    icon: <Database size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public int longestMountain(int[] arr) {
    int n = arr.length;
    if (n < 3) return 0;
    
    int[] up = new int[n];
    int[] down = new int[n];
    
    // Pass 1: Calculate left-to-right climbing lengths
    for (int i = 1; i < n; i++) {
        if (arr[i] > arr[i - 1]) up[i] = up[i - 1] + 1;
    }
    
    // Pass 2: Calculate right-to-left descending lengths
    for (int i = n - 2; i >= 0; i--) {
        if (arr[i] > arr[i + 1]) down[i] = down[i + 1] + 1;
    }
    
    int maxLen = 0;
    // Pass 3: Evaluate valid mountains
    for (int i = 0; i < n; i++) {
        if (up[i] > 0 && down[i] > 0) {
            maxLen = Math.max(maxLen, up[i] + down[i] + 1);
        }
    }
    
    return maxLen;
}`,
    desc: "An intuitive O(N) space DP approach. We use two arrays: 'up' tracks the length of the increasing sequence ending at index i. 'down' tracks the length of the decreasing sequence starting at index i. For any index i, if both up[i] > 0 and down[i] > 0, it is a valid peak, and the mountain width is up[i] + down[i] + 1."
  }
};

// --- Helper UI Components ---

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
  theme?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|return|if|else|for|while|continue|break|new|length|Math|max)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  
  const activeStyles = theme === 'emerald' 
    ? { bg: `bg-emerald-500/20`, border: `border-emerald-400`, text: `text-emerald-300` }
    : { bg: `bg-indigo-500/20`, border: `border-indigo-400`, text: `text-indigo-300` };

  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? activeStyles.text + ' font-bold' : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'return', 'if', 'else', 'for', 'while', 'continue', 'break', 'new'].includes(part);
            const isObject = ['Math'].includes(part);
            const isVar = ['arr', 'n', 'maxLen', 'i', 'left', 'right', 'isPeak', 'up', 'down'].includes(part);
            const isMapCall = ['length', 'max'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&'].includes(part.trim());

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-amber-400 font-bold';
            else if (isVar) className = 'text-sky-200';
            else if (isMapCall) className = 'text-fuchsia-300';
            else if (isOperator) className = 'text-slate-400 font-bold';
            else if (!isNaN(parseInt(part.trim())) && part.trim() !== '') className = 'text-emerald-400';

            return (
              <span key={i} className={className}>
                {part}
              </span>
            );
        })}
      </pre>
    </div>
  );
};

// --- Main Application ---

export default function LongestMountainVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('peakExpansion');
  
  const [inputString, setInputString] = useState('2, 1, 4, 7, 3, 2, 5');
  const [baseArray, setBaseArray] = useState([]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef(null);
  const selectedOp = OPERATIONS[selectedOpId];

  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 0, y: 0 }); 
    setZoom(1); 
  };

  const handleNext = () => { 
    if (currentStep < trace.length - 1) setCurrentStep(prev => prev + 1); 
  };
  
  const handlePrev = () => { 
    if (currentStep > 0) setCurrentStep(prev => prev - 1); 
  };

  const toggleFullscreen = () => setIsFullscreen(prev => !prev);
  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));

  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('textarea') || e.target.closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e) => { 
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handlePointerUp = () => setIsDragging(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedOp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parseInput = (str) => {
      const arr = str.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      return arr.slice(0, 16); // Limit max length for UI safety
  };

  useEffect(() => {
    const arr = parseInput(inputString);
    setBaseArray(arr);
    setCurrentStep(0);
    setPan({ x: 0, y: 0 });
  }, [inputString, selectedOpId]);

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
    if (!baseArray || baseArray.length < 3) {
        return [{ phase: 'Init', description: 'Enter at least 3 numbers to form a mountain.', line: 0, state: { arr: [] } }];
    }
    
    let arr = [...baseArray];
    let n = arr.length;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            arr: [...arr],
            n,
            ...st 
        } 
    });

    if (selectedOpId === 'peakExpansion') {
        let maxLen = 0;
        let i = 1;
        
        add("Init Data", `int maxLen = 0; int i = 1; Starting exploration from index 1.`, 4, { maxLen, i });

        while (i < n - 1) {
            add("Loop Condition", `while (i < ${n - 1}) -> Evaluating potential peak at index ${i}.`, 6, { maxLen, i });
            
            let isPeak = arr[i - 1] < arr[i] && arr[i] > arr[i + 1];
            add("Peak Check", `Is arr[${i}] (${arr[i]}) strictly greater than its neighbors? (${arr[i-1]} < ${arr[i]} > ${arr[i+1]}) -> ${isPeak}`, 7, { maxLen, i, isPeak, hlNeighbors: true });

            if (!isPeak) {
                add("Not a Peak", `No, it's not a peak. Increment i++.`, 10, { maxLen, i });
                i++;
                continue;
            }

            add("Peak Found", `Yes! Found a peak at index ${i}. Now we measure its width.`, 9, { maxLen, i, isPeak, peakIdx: i });
            
            // Expand Left
            let left = i - 1;
            add("Init Left Flank", `int left = i - 1 (${left}); Ready to traverse down the left side.`, 14, { maxLen, i, peakIdx: i, left });
            
            while (left > 0 && arr[left - 1] < arr[left]) {
                add("Traverse Left", `arr[${left-1}] < arr[${left}] (${arr[left-1]} < ${arr[left]}). Keep climbing down left.`, 16, { maxLen, i, peakIdx: i, left, leftScanning: true });
                left--;
            }
            add("Left Base Found", `Left base rests at index ${left}.`, 15, { maxLen, i, peakIdx: i, left, leftBase: left });

            // Expand Right
            let right = i + 1;
            add("Init Right Flank", `int right = i + 1 (${right}); Ready to traverse down the right side.`, 20, { maxLen, i, peakIdx: i, left, leftBase: left, right });
            
            while (right < n - 1 && arr[right] > arr[right + 1]) {
                add("Traverse Right", `arr[${right}] > arr[${right+1}] (${arr[right]} > ${arr[right+1]}). Keep climbing down right.`, 22, { maxLen, i, peakIdx: i, left, leftBase: left, right, rightScanning: true });
                right++;
            }
            add("Right Base Found", `Right base rests at index ${right}.`, 21, { maxLen, i, peakIdx: i, left, leftBase: left, right, rightBase: right });

            // Calculate Width
            let oldMax = maxLen;
            let currentLen = right - left + 1;
            maxLen = Math.max(maxLen, currentLen);
            
            add("Update Max Length", `maxLen = max(${oldMax}, ${right} - ${left} + 1) -> max(${oldMax}, ${currentLen}) = ${maxLen}.`, 26, { maxLen, i, peakIdx: i, left, leftBase: left, right, rightBase: right, currentLen, maxUpdated: oldMax !== maxLen });

            // Fast Forward
            i = right;
            add("Skip Segment", `i = right (${right}); Fast forward the explorer 'i' to the end of the mountain to save time.`, 29, { maxLen, i, lastPeakLen: currentLen });
        }

        add("Return Result", `Scan complete. Maximum mountain length is ${maxLen}.`, 32, { maxLen, isSuccess: true });

    } else if (selectedOpId === 'dynamicProgramming') {
        
        let up = new Array(n).fill(0);
        let down = new Array(n).fill(0);
        
        add("Init DP Arrays", `int[] up = new int[${n}]; int[] down = new int[${n}];`, 5, { up: [...up], down: [...down] });

        // Pass 1: Up
        for (let i = 1; i < n; i++) {
            add("Pass 1 (Up)", `for (int i = ${i}...) -> Check if climbing up from left.`, 9, { up: [...up], down: [...down], iUp: i });
            if (arr[i] > arr[i - 1]) {
                up[i] = up[i - 1] + 1;
                add("Climb Up Recorded", `arr[${i}] > arr[${i-1}] (${arr[i]} > ${arr[i-1]}). up[${i}] = ${up[i-1]} + 1 = ${up[i]}.`, 10, { up: [...up], down: [...down], iUp: i, writingUp: true });
            } else {
                add("No Climb Up", `arr[${i}] <= arr[${i-1}]. Streak broken. up[${i}] remains 0.`, 10, { up: [...up], down: [...down], iUp: i });
            }
        }

        // Pass 2: Down
        for (let i = n - 2; i >= 0; i--) {
            add("Pass 2 (Down)", `for (int i = ${i}...) -> Check if descending to right.`, 14, { up: [...up], down: [...down], iDown: i });
            if (arr[i] > arr[i + 1]) {
                down[i] = down[i + 1] + 1;
                add("Climb Down Recorded", `arr[${i}] > arr[${i+1}] (${arr[i]} > ${arr[i+1]}). down[${i}] = ${down[i+1]} + 1 = ${down[i]}.`, 15, { up: [...up], down: [...down], iDown: i, writingDown: true });
            } else {
                add("No Climb Down", `arr[${i}] <= arr[${i+1}]. Streak broken. down[${i}] remains 0.`, 15, { up: [...up], down: [...down], iDown: i });
            }
        }

        // Pass 3: Evaluate
        let maxLen = 0;
        add("Pass 3 (Evaluate)", `int maxLen = 0; Now we evaluate all indices to see if they form a valid peak.`, 18, { up: [...up], down: [...down], maxLen });

        for (let i = 0; i < n; i++) {
            add("Evaluate Peak", `Is index ${i} a valid peak? (up[${i}] > 0 && down[${i}] > 0)`, 20, { up: [...up], down: [...down], maxLen, iEval: i });
            if (up[i] > 0 && down[i] > 0) {
                let currentLen = up[i] + down[i] + 1;
                let oldMax = maxLen;
                maxLen = Math.max(maxLen, currentLen);
                add("Valid Peak Found", `Yes! Peak at ${i}. Length = ${up[i]} + ${down[i]} + 1 = ${currentLen}. maxLen = ${maxLen}.`, 21, { up: [...up], down: [...down], maxLen, iEval: i, currentLen, maxUpdated: oldMax !== maxLen });
            } else {
                add("Invalid Peak", `No. It lacks either a left climb or right descent.`, 20, { up: [...up], down: [...down], maxLen, iEval: i });
            }
        }

        add("Return Result", `Evaluation complete. Maximum mountain length is ${maxLen}.`, 26, { up: [...up], down: [...down], maxLen, isSuccess: true });
    }

    return steps;
  }, [baseArray, selectedOpId]);

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

  const themeColor = selectedOpId === 'peakExpansion' ? 'emerald' : 'indigo';

  // --- Rendering Helpers ---

  const renderBarChart = (isTheater = false) => {
      if (!st.arr || st.arr.length === 0) return null;

      const maxVal = Math.max(...st.arr, 1);
      const chartHeight = isTheater ? 280 : 180;
      
      const barWClass = isTheater ? "w-12" : "w-8"; 
      const gapClass = isTheater ? "gap-4" : "gap-2";

      return (
          <div className={`flex flex-col items-center bg-white rounded-[2rem] border-[3px] border-slate-200 shadow-xl max-w-full overflow-x-auto relative mt-4 ${isTheater ? 'p-10' : 'p-6'}`}>
              <div className={`relative flex items-end ${gapClass} border-b-[6px] border-slate-900 pb-0`} style={{ height: `${chartHeight}px` }}>

                  {/* Solid Pillars */}
                  {st.arr.map((val, idx) => {
                      const heightPx = Math.max((val / maxVal) * (chartHeight - 60), 4);
                      
                      let barColor = "bg-slate-300 border-slate-400";
                      let textColor = "text-slate-600";
                      let tag = null;
                      let isScaled = false;

                      // Theming for Peak Expansion
                      if (selectedOpId === 'peakExpansion') {
                          if (st.i === idx) {
                              barColor = "bg-slate-800 border-slate-900";
                              textColor = "text-white";
                              tag = "i";
                              isScaled = true;
                          }
                          if (st.hlNeighbors && (idx === st.i - 1 || idx === st.i + 1)) {
                              barColor = "bg-slate-400 border-slate-500";
                              isScaled = true;
                          }
                          if (st.peakIdx === idx) {
                              barColor = "bg-rose-500 border-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.6)]";
                              textColor = "text-rose-100";
                              tag = "Peak";
                              isScaled = true;
                          }
                          if (st.left !== undefined && idx === st.left) {
                              barColor = "bg-sky-500 border-sky-600 shadow-[0_0_15px_rgba(14,165,233,0.6)]";
                              textColor = "text-sky-100";
                              tag = "L";
                              isScaled = true;
                          }
                          if (st.right !== undefined && idx === st.right) {
                              barColor = "bg-amber-500 border-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.6)]";
                              textColor = "text-amber-100";
                              tag = "R";
                              isScaled = true;
                          }

                          // Flank coloring
                          if (st.leftBase !== undefined && st.peakIdx !== undefined && idx >= st.leftBase && idx < st.peakIdx) {
                              barColor = "bg-sky-400 border-sky-500";
                              textColor = "text-sky-100";
                          }
                          if (st.rightBase !== undefined && st.peakIdx !== undefined && idx > st.peakIdx && idx <= st.rightBase) {
                              barColor = "bg-amber-400 border-amber-500";
                              textColor = "text-amber-100";
                          }
                      }
                      // Theming for DP Array
                      else if (selectedOpId === 'dynamicProgramming') {
                          if (st.iUp === idx) {
                              barColor = "bg-sky-500 border-sky-600 shadow-[0_0_15px_rgba(14,165,233,0.6)]";
                              textColor = "text-sky-100";
                              tag = "Up";
                              isScaled = true;
                          } else if (st.iDown === idx) {
                              barColor = "bg-amber-500 border-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.6)]";
                              textColor = "text-amber-100";
                              tag = "Dwn";
                              isScaled = true;
                          } else if (st.iEval === idx) {
                              barColor = "bg-fuchsia-500 border-fuchsia-600 shadow-[0_0_15px_rgba(217,70,239,0.6)]";
                              textColor = "text-fuchsia-100";
                              tag = "Eval";
                              isScaled = true;
                          }
                      }

                      return (
                          <div key={idx} className="flex flex-col items-center justify-end h-full relative z-10 group">
                              
                              {/* Floating Pointer Bubble */}
                              <div className={`absolute ${isTheater ? '-top-16' : '-top-12'} flex flex-col items-center transition-all duration-300 ${tag ? 'opacity-100 translate-y-0 scale-110' : 'opacity-0 translate-y-4'}`}>
                                  <div className={`${isTheater ? 'w-12 h-12 text-xs' : 'w-8 h-8 text-[9px]'} rounded-full flex items-center justify-center font-black text-white shadow-lg leading-tight bg-slate-800`}>
                                      {tag}
                                  </div>
                                  <div className="w-0.5 h-3 bg-slate-800"></div>
                              </div>

                              {/* Physical Pillar */}
                              <div className={`${barWClass} transition-all duration-500 flex items-start justify-center pt-2 ${isScaled ? 'scale-y-[1.05] z-20' : 'z-10'} ${barColor} border-[3px] rounded-t-xl`} style={{ height: `${heightPx}px`, transformOrigin: 'bottom' }}>
                                   {/* Top Value Label */}
                                  <div className={`font-mono font-black transition-colors ${textColor} ${isTheater ? 'text-2xl' : 'text-sm'}`}>
                                      {val}
                                  </div>
                              </div>
                              
                              {/* Bottom Index Label */}
                              <div className="absolute -bottom-8 font-mono text-xs font-black text-slate-400">
                                  {idx}
                              </div>
                          </div>
                      );
                  })}
              </div>

              {/* DP Data Tables */}
              {selectedOpId === 'dynamicProgramming' && st.up && st.down && (
                  <div className="mt-12 flex flex-col gap-2 w-full max-w-full">
                      <div className="flex gap-2 items-center">
                          <span className={`w-16 font-black font-mono text-right ${isTheater ? 'text-sm' : 'text-[10px]'} text-sky-500 uppercase tracking-widest`}>Up[]</span>
                          <div className={`flex flex-1 ${gapClass} justify-start`}>
                              {st.up.map((v, i) => (
                                  <div key={`u-${i}`} className={`${barWClass} h-8 flex items-center justify-center font-mono font-bold rounded border transition-all ${st.writingUp && st.iUp === i ? 'bg-sky-100 border-sky-400 text-sky-700 scale-110 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>{v}</div>
                              ))}
                          </div>
                      </div>
                      <div className="flex gap-2 items-center">
                          <span className={`w-16 font-black font-mono text-right ${isTheater ? 'text-sm' : 'text-[10px]'} text-amber-500 uppercase tracking-widest`}>Down[]</span>
                          <div className={`flex flex-1 ${gapClass} justify-start`}>
                              {st.down.map((v, i) => (
                                  <div key={`d-${i}`} className={`${barWClass} h-8 flex items-center justify-center font-mono font-bold rounded border transition-all ${st.writingDown && st.iDown === i ? 'bg-amber-100 border-amber-400 text-amber-700 scale-110 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>{v}</div>
                              ))}
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
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
                <Mountain className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Longest Mountain</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'emerald' ? 'text-emerald-600 bg-emerald-50' : 'text-indigo-600 bg-indigo-50'}`}>
                      LC 845 • Arrays & Pointers
                  </span>
                  <span>•</span>
                  <span>Pattern Matching</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-8 flex flex-col">
                <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-indigo-600'}`}><AlignLeft size={28}/> Problem Statement</div>
                
                <p className="text-base leading-relaxed">
                  You may recall that an array <code>arr</code> is a <strong>mountain array</strong> if and only if:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                      <li><code>arr.length &gt;= 3</code></li>
                      <li>There exists some index <code>i</code> (0-indexed) with <code>0 &lt; i &lt; arr.length - 1</code> such that:<br/>
                      <code>arr[0] &lt; arr[1] &lt; ... &lt; arr[i - 1] &lt; arr[i]</code><br/>
                      <code>arr[i] &gt; arr[i + 1] &gt; ... &gt; arr[arr.length - 1]</code>
                      </li>
                  </ul>
                  <br/>
                  Given an integer array <code>arr</code>, return the length of the longest subarray, which is a mountain. Return <code>0</code> if there is no mountain subarray.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-emerald-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> arr = [2,1,4,7,3,2,5]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 5</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: The largest mountain is [1,4,7,3,2] which has length 5.</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-rose-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-rose-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> arr = [2,2,2]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 0</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: There is no mountain. Flat regions break the strictly increasing/decreasing rules.</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Follow-ups</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-1">
                        <li>1 &lt;= arr.length &lt;= 10<sup>4</sup></li>
                        <li>0 &lt;= arr[i] &lt;= 10<sup>4</sup></li>
                        <li className={`font-bold mt-2 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-indigo-600'}`}>Follow up: Can you solve it using only one pass? Can you solve it in O(1) space?</li>
                    </ul>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white border-emerald-600 scale-[1.02]' : 'bg-indigo-600 text-white border-indigo-600 scale-[1.02]') : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'text-emerald-200' : 'text-indigo-200') : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[440px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} />
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono pl-1 flex justify-between ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-indigo-600'}`}>
                                <span>Input Array (arr)</span>
                            </label>
                            <input 
                                type="text"
                                value={inputString} 
                                onChange={(e) => setInputString(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-indigo-500'}`} 
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-3 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 group disabled:opacity-30 ${themeColor === 'emerald' ? 'bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700' : 'bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700'}`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
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
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Scan Complete</div>
                            <p className="text-sm leading-relaxed text-white mt-1 font-mono font-bold tracking-tight">{String(curStepData.description)}</p>
                         </div>
                    ) : (
                        <>
                            <div className="text-lg font-black tracking-tight mb-1 uppercase font-mono text-white leading-none truncate">{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-2 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 min-h-[440px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur ${themeColor === 'emerald' ? 'text-emerald-500' : 'text-indigo-500'}`}><Layout size={14}/> Topography Map</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-indigo-600'}`}><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-indigo-600'}`}><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-indigo-600'}`}><Maximize2 size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-20 pb-16 gap-4 items-center overflow-x-auto overflow-y-hidden scrollbar-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* Variables */}
                           <div className="flex gap-4 min-w-max mb-4">
                                <div className={`flex flex-col items-center border-2 p-3 rounded-xl min-w-[100px] shadow-sm transition-all duration-300 ${st.maxUpdated ? 'bg-emerald-50 border-emerald-400 scale-110 shadow-emerald-200/50 z-20' : 'bg-white border-slate-200'}`}>
                                    <span className="text-[9px] uppercase tracking-widest font-black text-slate-500">Max Length</span>
                                    <span className={`font-mono font-black text-2xl ${st.maxUpdated ? 'text-emerald-600' : 'text-slate-800'}`}>{st.maxLen !== undefined ? st.maxLen : 0}</span>
                                </div>
                                {st.currentLen !== undefined && (
                                    <div className="flex flex-col items-center bg-white border-2 border-slate-200 p-3 rounded-xl min-w-[80px] shadow-sm animate-in slide-in-from-left-4">
                                        <span className="text-[9px] uppercase tracking-widest font-black text-slate-500">Current</span>
                                        <span className="font-mono font-black text-2xl text-slate-600">{st.currentLen}</span>
                                    </div>
                                )}
                           </div>

                           {/* Bar Chart Visualization */}
                           {renderBarChart(false)}

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
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Mountain size={120}/></div>
                        <h3 className="font-black text-emerald-400 text-lg uppercase tracking-widest mb-6">Peak Expansion</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>A mountain is simply a 'Peak' with valid bases on both sides. A point is a Peak if it is strictly greater than both its left and right neighbors.</p>
                            <p>Instead of doing complex state machine tracking, we just scan for Peaks. Once we find one, we expand two pointers outward (down the left slope and down the right slope) until they hit the bottom.</p>
                            <p>The width of the mountain is exactly <code>right - left + 1</code>. Because the right slope of one mountain can be the left slope of the next, we safely jump our explorer index <code>i</code> straight to the <code>right</code> base to continue searching. $O(N)$ Time!</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-indigo-50 border border-indigo-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-indigo-700 text-lg uppercase tracking-widest mb-6">Dynamic Programming</h3>
                        <div className="space-y-4 text-sm text-indigo-900/80 leading-relaxed font-medium">
                            <p>We can solve this using two auxiliary arrays: <code>up[]</code> and <code>down[]</code>.</p>
                            <p>In a left-to-right pass, we count how many consecutive upward steps lead to index <code>i</code> (stored in <code>up[i]</code>).</p>
                            <p>In a right-to-left pass, we count how many consecutive downward steps follow index <code>i</code> (stored in <code>down[i]</code>).</p>
                            <p>For any index <code>i</code>, if both <code>up[i] &gt; 0</code> and <code>down[i] &gt; 0</code>, it is a valid peak, and the total width is simply <code>up[i] + down[i] + 1</code>.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-emerald-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-emerald-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Securing the O(1) Space Follow-up</h3>
                    <p className="text-sm text-emerald-50 leading-relaxed italic max-w-2xl font-mono">"Interviewers will often accept the DP array solution, but will immediately push you for the O(1) space follow-up. Memorize the 'Peak Expansion' pattern, as it is incredibly robust against edge cases (flat plains, continuous slopes)."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Database size={16}/></div>
                               1. Acknowledge DP Baseline
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "The intuitive approach is to use Dynamic Programming. I could do two passes to build an 'up' array tracking consecutive increases, and a 'down' array tracking consecutive decreases. Then a final pass to find the max sum of up[i] + down[i] + 1. But this requires O(N) auxiliary space."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Mountain size={16}/></div>
                               2. Pivot to Peak Expansion
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "To achieve O(1) space, I don't need to track every slope. I only care about Mountains. A mountain must have a Peak. I can iterate through the array from index 1 to n-2. If arr[i-1] &lt; arr[i] &gt; arr[i+1], I know index 'i' is a peak."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><ArrowRightLeft size={16}/></div>
                               3. Fast Forward Optimization
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "Once a peak is found, I expand two local pointers outwards to find the left base and right base. I update my max length. The crucial optimization here is that the right base of the current mountain could be the left base of the next mountain, so I can safely jump my main loop index 'i' straight to the 'right' base. This guarantees an O(N) runtime with strictly O(1) space."
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
                          <div className={`p-2 rounded-lg text-white shadow-lg ${themeColor === 'emerald' ? 'bg-emerald-500 shadow-emerald-900/50' : 'bg-indigo-500 shadow-indigo-900/50'}`}><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 whitespace-pre-wrap">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4 overflow-x-auto">
                        <div className="min-w-max pr-4">
                            {selectedOp.code.split('\n').map((line, idx) => (
                                <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} />
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
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  {/* Floating Controls for Fullscreen */}
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white shadow-md' : 'bg-indigo-600 text-white shadow-md') : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-80 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-indigo-600'}`}>Input Array (arr)</label>
                              <input type="text" value={inputString} onChange={(e) => setInputString(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-indigo-500'}`} />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-indigo-50 hover:text-indigo-600'}`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-indigo-50 hover:text-indigo-600'}`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-indigo-50 hover:text-indigo-600'}`}><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 text-white rounded-[2rem] hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border shadow-2xl ${themeColor === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-400 shadow-emerald-900/30' : 'bg-indigo-600 hover:bg-indigo-700 border-indigo-400 shadow-indigo-900/30'}`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 min-w-full w-max min-h-full origin-top-left transition-transform duration-500 flex flex-col p-16 md:p-32 pt-40 gap-16 items-center overflow-visible" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* --- Strict Flexbox Layout (Theater) --- */}

                           {/* Variables */}
                           <div className="flex gap-8 origin-center mb-8 z-30">
                                <div className={`flex flex-col items-center border-[3px] p-6 rounded-2xl min-w-[150px] shadow-xl transition-all duration-500 ${st.maxUpdated ? 'bg-emerald-50 border-emerald-400 scale-110 shadow-[0_0_30px_rgba(52,211,153,0.5)] z-20' : 'bg-white border-slate-200'}`}>
                                    <span className="text-xs uppercase tracking-widest font-black text-slate-500">Max Length</span>
                                    <span className={`font-mono font-black text-5xl mt-2 ${st.maxUpdated ? 'text-emerald-600' : 'text-slate-800'}`}>{st.maxLen !== undefined ? st.maxLen : 0}</span>
                                </div>
                                {st.currentLen !== undefined && (
                                    <div className="flex flex-col items-center bg-white border-[3px] border-slate-200 p-6 rounded-2xl min-w-[150px] shadow-xl animate-in slide-in-from-left-6">
                                        <span className="text-xs uppercase tracking-widest font-black text-slate-500">Current</span>
                                        <span className="font-mono font-black text-5xl text-slate-600 mt-2">{st.currentLen}</span>
                                    </div>
                                )}
                           </div>

                           {/* Chart Render */}
                           <div className="origin-center">
                               {renderBarChart(true)}
                           </div>

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
                                    SCAN COMPLETE
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