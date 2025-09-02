import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, Droplets, Layout
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  twoPointers: {
    id: 'twoPointers',
    title: '1. Two Pointers (Optimal)',
    icon: <ArrowRightLeft size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public int maxArea(int[] height) {
    int left = 0;
    int right = height.length - 1;
    int maxArea = 0;
    
    while (left < right) {
        int currentArea = Math.min(height[left], height[right]) * (right - left);
        maxArea = Math.max(maxArea, currentArea);
        
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxArea;
}`,
    desc: "The O(N) optimal approach. We place pointers at the extreme ends of the array to maximize the width. The area is bounded by the shorter line. To find a potentially larger area, we MUST move the shorter line inward, hoping to find a taller line to compensate for the shrinking width."
  },
  bruteForce: {
    id: 'bruteForce',
    title: '2. Brute Force',
    icon: <SearchCode size={16} />,
    complexity: 'Time: O(N²) | Space: O(1)',
    code: `public int maxArea(int[] height) {
    int maxArea = 0;
    int n = height.length;
    
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int currentArea = Math.min(height[i], height[j]) * (j - i);
            maxArea = Math.max(maxArea, currentArea);
        }
    }
    
    return maxArea;
}`,
    desc: "The naive O(N²) approach. We check every single possible pair of lines in the array, calculating the water they can hold, and keeping track of the global maximum. It is too slow for large inputs."
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
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|return|if|else|for|while|continue|new|length|Math|min|max)\b|\b\d+\b|[\+\-\*\/\%\=\<\>])/g).filter(Boolean);
  const activeStyles = { bg: `bg-cyan-500/20`, border: `border-cyan-400`, text: `text-cyan-300` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-cyan-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'return', 'if', 'else', 'for', 'while', 'continue', 'new'].includes(part);
            const isObject = ['Math'].includes(part);
            const isVar = ['height', 'left', 'right', 'maxArea', 'currentArea', 'n', 'i', 'j'].includes(part);
            const isMapCall = ['length', 'min', 'max'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>'].includes(part.trim());

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-amber-400 font-bold';
            else if (isVar) className = 'text-cyan-200';
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

export default function ContainerWithMostWaterVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('twoPointers');
  
  const [inputString, setInputString] = useState('1, 8, 6, 2, 5, 4, 8, 3, 7');
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
      // Max length guard for UI performance
      return arr.slice(0, 20); 
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
    if (!baseArray || baseArray.length < 2) {
        return [{ phase: 'Init', description: 'Enter at least 2 heights.', line: 0, state: { heights: [] } }];
    }
    
    let heights = [...baseArray];
    let n = heights.length;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            heights: [...heights],
            n,
            ...st 
        } 
    });

    if (selectedOpId === 'twoPointers') {
        let left = 0;
        add("Init Left Pointer", `int left = 0; Start at the left edge.`, 2, { left });
        
        let right = n - 1;
        add("Init Right Pointer", `int right = height.length - 1; Start at the right edge.`, 3, { left, right });
        
        let maxArea = 0;
        add("Init Max Area", `int maxArea = 0; Track the global maximum.`, 4, { left, right, maxArea });

        while (true) {
            add("Loop Condition", `while (left < right) -> Is ${left} < ${right}?`, 6, { left, right, maxArea });
            if (left >= right) {
                add("Loop Terminates", `Pointers met. ${left} is not < ${right}. Loop ends.`, 6, { left, right, maxArea, isDone: true });
                break;
            }

            let hL = heights[left];
            let hR = heights[right];
            let minH = Math.min(hL, hR);
            let w = right - left;
            let currentArea = minH * w;

            add("Calculate Current Area", `Width = ${right} - ${left} = ${w}. Height is min(${hL}, ${hR}) = ${minH}. Area = ${minH} × ${w} = ${currentArea}.`, 7, { left, right, maxArea, currentArea, minH, w, hL, hR });

            let oldMax = maxArea;
            maxArea = Math.max(maxArea, currentArea);
            
            add("Update Max Area", `maxArea = max(${oldMax}, ${currentArea}) = ${maxArea}.`, 8, { left, right, maxArea, currentArea, minH, w, hL, hR, maxUpdated: oldMax !== maxArea });

            add("Height Comparison", `if (height[left] < height[right]) -> Is ${hL} < ${hR}?`, 10, { left, right, maxArea, currentArea, minH, w, hL, hR });

            if (hL < hR) {
                add("Move Left Pointer", `Yes. The left line (${hL}) is shorter. Moving left++ in search of a taller line.`, 11, { left, right, maxArea, currentArea, minH, w, hL, hR, moveDir: 'left' });
                left++;
            } else {
                add("Move Right Pointer", `No. The right line (${hR}) is shorter or equal. Moving right-- in search of a taller line.`, 13, { left, right, maxArea, currentArea, minH, w, hL, hR, moveDir: 'right' });
                right--;
            }
            
            add("Pointer Moved", `State updated. left=${left}, right=${right}.`, left === right ? 6 : 14, { left, right, maxArea });
        }

        add("Return Result", `return maxArea; The maximum water contained is ${maxArea}.`, 17, { maxArea, isSuccess: true });

    } else if (selectedOpId === 'bruteForce') {
        let maxArea = 0;
        add("Init Max Area", `int maxArea = 0;`, 2, { maxArea });
        add("Init Length", `int n = height.length; n = ${n}.`, 3, { maxArea });

        for (let i = 0; i < n; i++) {
            add("Outer Loop", `for (int i = ${i}; i < ${n}; i++) -> Left pointer at ${i}.`, 5, { maxArea, i });
            
            for (let j = i + 1; j < n; j++) {
                add("Inner Loop", `for (int j = ${j}; j < ${n}; j++) -> Right pointer at ${j}.`, 6, { maxArea, i, j });
                
                let hI = heights[i];
                let hJ = heights[j];
                let minH = Math.min(hI, hJ);
                let w = j - i;
                let currentArea = minH * w;

                add("Calculate Area", `Width = ${j} - ${i} = ${w}. Height = min(${hI}, ${hJ}) = ${minH}. Area = ${currentArea}.`, 7, { maxArea, i, j, currentArea, minH, w });

                let oldMax = maxArea;
                maxArea = Math.max(maxArea, currentArea);
                
                add("Update Max Area", `maxArea = max(${oldMax}, ${currentArea}) = ${maxArea}.`, 8, { maxArea, i, j, currentArea, minH, w, maxUpdated: oldMax !== maxArea });
            }
        }

        add("Return Result", `Checked all pairs. return maxArea = ${maxArea}.`, 13, { maxArea, isSuccess: true });
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

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { heights: [] } };
  const st = curStepData.state || { heights: [] };
  const isLastStep = currentStep === trace.length - 1;

  // --- Rendering Helpers ---

  const renderBarChart = (isTheater = false) => {
      if (!st.heights || st.heights.length === 0) return null;

      const maxVal = Math.max(...st.heights, 1);
      const chartHeight = isTheater ? 350 : 250;
      
      // Fixed sizes based on mode for exact pixel calculations
      const barW = isTheater ? 48 : 32; 
      const gapW = isTheater ? 24 : 16; 
      const barWidthClass = isTheater ? "w-[48px]" : "w-[32px]";
      const gapClass = isTheater ? "gap-[24px]" : "gap-[16px]";

      const pL = st.left !== undefined ? st.left : st.i;
      const pR = st.right !== undefined ? st.right : st.j;

      // Mathematical Positioning for the Water Bounding Box
      let waterLevelPx = 0;
      let leftPx = 0;
      let waterWidthPx = 0;

      if (pL !== undefined && pR !== undefined && st.minH !== undefined) {
          waterLevelPx = (st.minH / maxVal) * chartHeight; 
          leftPx = (pL * (barW + gapW)) + (barW / 2);
          waterWidthPx = (pR - pL) * (barW + gapW);
      }

      return (
          <div className="flex flex-col items-center mt-16 mb-12 w-max mx-auto">
              <div className={`relative flex items-end ${gapClass} border-b-[6px] border-slate-900 rounded-b-sm`} style={{ height: `${chartHeight}px` }}>

                  {/* Complete Water Body (Behind Bars) */}
                  {waterWidthPx > 0 && (
                      <div className="absolute z-0 bg-indigo-500/20 border-t-[3px] border-dashed border-indigo-500 transition-all duration-500 flex items-center justify-center"
                           style={{
                               left: `${leftPx}px`,
                               width: `${waterWidthPx}px`,
                               height: `${waterLevelPx}px`,
                               bottom: '0px'
                           }}>
                           {/* Dynamic Area Badge */}
                           {st.currentArea !== undefined && (
                               <div className="bg-white text-indigo-700 font-black text-xs md:text-sm px-4 py-1.5 rounded-full shadow-lg z-30 transform opacity-90 animate-in zoom-in border border-indigo-100 flex items-center gap-1.5 whitespace-nowrap -mt-6">
                                   <span className="text-slate-400">{st.w}</span>
                                   <span className="text-slate-300">×</span>
                                   <span className="text-slate-400">{st.minH}</span>
                                   <span className="text-indigo-300">=</span>
                                   <span className="text-indigo-600">{st.currentArea}</span>
                               </div>
                           )}
                      </div>
                  )}

                  {/* Solid Pillars */}
                  {st.heights.map((val, idx) => {
                      const heightPx = Math.max((val / maxVal) * chartHeight, 4);
                      const isL = pL === idx;
                      const isR = pR === idx;
                      const isActive = isL || isR;

                      return (
                          <div key={idx} className="flex flex-col items-center justify-end h-full relative z-10 group">
                              
                              {/* Floating Pointer Bubble */}
                              <div className={`absolute -top-16 flex flex-col items-center transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0 scale-110' : 'opacity-0 translate-y-4'}`}>
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg leading-tight ${isActive ? 'bg-indigo-600' : ''}`}>
                                      PTR<br/>{isL ? 'L' : 'R'}
                                  </div>
                                  <div className="w-0.5 h-4 bg-indigo-600"></div>
                              </div>

                              {/* Top Value Label */}
                              <div className={`absolute font-mono font-black transition-colors ${isActive ? 'text-indigo-800 scale-110' : 'text-slate-800'} ${isTheater ? 'text-xl -top-10' : 'text-sm -top-8'}`}>
                                  {val}
                              </div>

                              {/* Physical Pillar */}
                              <div className={`${barWidthClass} transition-all duration-500 ${isActive ? 'bg-indigo-500 border-[3px] border-indigo-200 rounded-t-xl shadow-[0_0_15px_rgba(99,102,241,0.6)]' : 'bg-slate-700 rounded-t-md'}`} style={{ height: `${heightPx}px` }}></div>
                              
                              {/* Bottom Index Label */}
                              <div className="absolute -bottom-8 font-mono text-xs font-black text-slate-300">
                                  {idx}
                              </div>
                          </div>
                      );
                  })}
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
            <div className="bg-cyan-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <Droplets className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Container With Most Water</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded">
                      LC 11 • Two Pointers
                  </span>
                  <span>•</span>
                  <span>O(N) Time Constraint</span>
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
                <div className="flex items-center gap-3 text-cyan-600 font-black text-2xl uppercase tracking-tighter"><AlignLeft size={28}/> Problem Statement</div>
                
                <p className="text-base leading-relaxed">
                  You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>i<sup>th</sup></code> line are <code>(i, 0)</code> and <code>(i, height[i])</code>.<br/><br/>
                  Find two lines that together with the x-axis form a container, such that the container contains the most water.<br/>
                  Return the maximum amount of water a container can store.
                </p>

                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-slate-900 border-l-4 border-cyan-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-cyan-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> height = [1,8,6,2,5,4,8,3,7]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 49</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49 (indices 1 and 8).</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Traps</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-1">
                        <li>n == height.length</li>
                        <li>2 &lt;= n &lt;= 10<sup>5</sup></li>
                        <li>0 &lt;= height[i] &lt;= 10<sup>4</sup></li>
                        <li className="font-bold text-amber-600 mt-2">Trap: You cannot slant the container. The water level is always determined by the strictly shorter line.</li>
                    </ul>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-cyan-600 text-white border-cyan-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-cyan-200' : 'text-slate-400'}`}>{op.complexity}</div>
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
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-cyan-600 pl-1 flex justify-between">
                                <span>Input Array (height)</span>
                            </label>
                            <input 
                                type="text"
                                value={inputString} 
                                onChange={(e) => setInputString(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all shadow-inner" 
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-3 bg-cyan-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-200 hover:bg-cyan-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
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
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-2 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 min-h-[440px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Layout size={14} className="text-cyan-500"/> Bar Chart & State</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className="p-1.5 text-slate-600 hover:text-cyan-600 rounded-lg transition-colors"><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className="p-1.5 text-slate-600 hover:text-cyan-600 rounded-lg transition-colors"><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className="p-1.5 text-slate-600 hover:text-cyan-600 rounded-lg transition-colors"><Maximize2 size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-20 pb-16 gap-10 items-center overflow-visible" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* Variables */}
                           <div className="flex gap-4 z-30">
                                <div className={`flex flex-col items-center border-2 p-3 rounded-xl min-w-[100px] shadow-sm transition-all duration-300 bg-white ${st.maxUpdated ? 'border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.4)] scale-110' : 'border-slate-200'}`}>
                                    <span className="text-[9px] uppercase tracking-widest font-black text-slate-500">Max Area</span>
                                    <span className={`font-mono font-black text-2xl ${st.maxUpdated ? 'text-emerald-600' : 'text-slate-800'}`}>{st.maxArea !== undefined ? st.maxArea : 0}</span>
                                </div>
                           </div>

                           {/* Dynamic Bar Chart Visualization */}
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
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Maximize2 size={120}/></div>
                        <h3 className="font-black text-cyan-400 text-lg uppercase tracking-widest mb-6">The Bounding Box Property</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>The area of water contained between any two lines is determined by the formula: <br/><code className="text-cyan-300">Area = min(height[left], height[right]) × (right - left)</code></p>
                            <p>This means the water level is ALWAYS bounded by the <strong>shorter</strong> of the two lines. Even if one line goes infinitely high, the water will simply spill over the shorter line.</p>
                            <p>Therefore, to maximize the area, we want to maximize BOTH the width (the distance between lines) AND the height (the shorter line).</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-cyan-50 border border-cyan-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-cyan-700 text-lg uppercase tracking-widest mb-6">Why Two Pointers Work</h3>
                        <div className="space-y-4 text-sm text-cyan-900/80 leading-relaxed font-medium">
                            <p>We start by placing pointers at the absolute left and right extremes. This gives us the <strong>maximum possible width</strong>.</p>
                            <p>Now, how do we search for a larger area?</p>
                            <ul className="list-disc ml-6 space-y-2">
                                <li>If we move the taller line inward, the width decreases, and the water height is <em>still bounded</em> by the shorter line. The area is guaranteed to decrease or stay the same.</li>
                                <li>If we move the <strong>shorter line</strong> inward, the width decreases, but we <em>might</em> find a significantly taller line that compensates for the lost width, thus increasing the total area!</li>
                            </ul>
                            <p>This mathematically proves that moving the shorter pointer is the only way to possibly find a larger area.</p>
                        </div>
                    </div>

                    <div className="p-8 md:col-span-2 rounded-3xl bg-slate-50 border border-slate-200 relative overflow-hidden shadow-inner flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
                            <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest mb-4">Brute Force vs Optimal</h3>
                            <p>The Brute Force approach checks every single combination of two lines using nested loops ($O(N^2)$). For an array of 100,000 lines, this requires 5 billion checks.</p>
                            <p>The Two Pointers approach makes exactly one intelligent decision per step, eliminating entire sets of pairs that we know mathematically cannot be the maximum. This drops the time to strictly $O(N)$, requiring only 100,000 checks.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-cyan-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-cyan-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Proving the Greedy Choice</h3>
                    <p className="text-sm text-cyan-50 leading-relaxed italic max-w-2xl font-mono">"Writing the Two Pointer solution takes 2 minutes. The rest of the interview will be spent explaining exactly WHY we discard the shorter line. You must confidently articulate the math to secure the 'Hire'."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-cyan-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-cyan-50/50 border border-cyan-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-cyan-800 text-sm uppercase tracking-widest">
                               <div className="bg-cyan-200 p-2 rounded-lg text-cyan-700"><SearchCode size={16}/></div>
                               1. Acknowledge Brute Force
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-cyan-100 shadow-inner flex-1">
                                "The naive solution is to use two nested loops to evaluate every single pair of lines, calculate the area, and track the maximum. This guarantees correctness but results in an O(N²) time complexity, which will result in a Time Limit Exceeded error for large arrays."
                            </p>
                        </div>

                        <div className="bg-cyan-50/50 border border-cyan-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-cyan-800 text-sm uppercase tracking-widest">
                               <div className="bg-cyan-200 p-2 rounded-lg text-cyan-700"><ArrowRightLeft size={16}/></div>
                               2. Introduce Two Pointers
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-cyan-100 shadow-inner flex-1">
                                "To optimize this to O(N), I will use the Two Pointers technique. I'll initialize a 'left' pointer at the start (index 0) and a 'right' pointer at the end (n-1). By starting at the extremes, I guarantee that I am testing the absolute maximum possible width first."
                            </p>
                        </div>

                        <div className="bg-cyan-50/50 border border-cyan-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-cyan-800 text-sm uppercase tracking-widest">
                               <div className="bg-cyan-200 p-2 rounded-lg text-cyan-700"><ShieldAlert size={16}/></div>
                               3. Explain the Core Logic (The "Why")
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-cyan-100 shadow-inner flex-1">
                                "At every step, the area is calculated using the minimum of the two heights. To decide which pointer to move inward, we look at the heights. If we move the taller line, the width decreases, but the water height remains bottlenecked by the shorter line, so the area strictly decreases. Therefore, the ONLY logical choice is to discard the shorter line and move its pointer inward, hoping to find a taller line that increases the bounding height enough to overcome the loss in width."
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
                          <div className="bg-cyan-500 p-2 rounded-lg text-white shadow-lg shadow-cyan-900/50"><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 whitespace-pre-wrap">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4 overflow-x-auto">
                        <div className="min-w-max pr-4">
                            {selectedOp.code.split('\n').map((line, idx) => (
                                <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
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
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-80 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-cyan-600 pl-1">Input Array (height)</label>
                              <input type="text" value={inputString} onChange={(e) => setInputString(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-cyan-500 outline-none transition-all shadow-inner" />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-cyan-600 rounded-xl hover:bg-cyan-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-cyan-600 rounded-xl hover:bg-cyan-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className="p-3 text-slate-600 hover:text-cyan-600 rounded-xl hover:bg-cyan-50 transition-all"><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className="px-12 py-6 bg-cyan-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(6,182,212,0.3)] hover:bg-cyan-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-cyan-400 shadow-cyan-900/20">NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 min-w-full w-max min-h-full origin-top-left transition-transform duration-500 flex flex-col p-16 md:p-32 pt-40 gap-16 items-center overflow-visible" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* Variables */}
                           <div className="flex gap-8 origin-center mb-8 z-30">
                                <div className={`flex flex-col items-center border-[3px] p-6 rounded-2xl min-w-[150px] shadow-xl transition-all duration-500 bg-white ${st.maxUpdated ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)] scale-110' : 'border-slate-200'}`}>
                                    <span className="text-xs uppercase tracking-widest font-black text-slate-500">Max Area</span>
                                    <span className={`font-mono font-black text-5xl mt-2 ${st.maxUpdated ? 'text-emerald-600' : 'text-slate-800'}`}>{st.maxArea !== undefined ? st.maxArea : 0}</span>
                                </div>
                           </div>

                           {/* Chart Render */}
                           <div className="origin-center w-full max-w-6xl">
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
                                    MAX AREA FOUND
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