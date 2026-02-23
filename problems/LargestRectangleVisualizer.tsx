import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, ArrowRight, 
  ArrowDown, X, Timer, ArrowUp, RefreshCw, 
  ShieldAlert, ArrowRightLeft, TrendingDown, ListOrdered, FastForward, Database, Network,
  Scissors, Filter, BarChart, Maximize, Maximize2, ArrowLeft
} from 'lucide-react';

const APPROACHES = {
  optimalStack: {
    id: 'optimalStack',
    title: '1. Monotonic Stack',
    subtitle: 'Track increasing heights to find boundaries.',
    icon: <Layers size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public int largestRectangleArea(int[] heights) {
        int maxArea = 0;
        Stack<Integer> stack = new Stack<>();
        int n = heights.length;
        
        for (int i = 0; i <= n; i++) {
            // Append a 0-height bar at the end to flush the stack
            int h = (i == n) ? 0 : heights[i];
            
            // If current height breaks the increasing order, process the stack
            while (!stack.isEmpty() && h < heights[stack.peek()]) {
                int height = heights[stack.pop()];
                // Right boundary is 'i', left boundary is the new stack top
                int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                maxArea = Math.max(maxArea, height * width);
            }
            stack.push(i);
        }
        
        return maxArea;
    }
}`,
    explanation: "The optimal O(N) approach uses a Monotonic Increasing Stack. The stack stores indices of the bars. We only push to the stack if the current bar is taller than or equal to the bar at the top of the stack. If we encounter a shorter bar, it means we have found the 'right boundary' for the bars currently in the stack! We pop them one by one, calculate their maximum possible area (since we know their left boundary is the new top of the stack, and their right boundary is our current index `i`), and update our maxArea."
  },
  bruteForce: {
    id: 'bruteForce',
    title: '2. Brute Force',
    subtitle: 'Check every possible pair of bars.',
    icon: <BarChart size={16} />,
    complexity: 'Time: O(N²) | Space: O(1)',
    code: `class Solution {
    public int largestRectangleArea(int[] heights) {
        int maxArea = 0;
        int n = heights.length;
        
        for (int i = 0; i < n; i++) {
            int minHeight = heights[i];
            
            for (int j = i; j < n; j++) {
                // Update the minimum height in the current range
                minHeight = Math.min(minHeight, heights[j]);
                int width = j - i + 1;
                maxArea = Math.max(maxArea, minHeight * width);
            }
        }
        
        return maxArea;
    }
}`,
    explanation: "The intuitive brute-force approach. For every possible starting bar `i`, we expand our rectangle to the right to every possible ending bar `j`. The bottleneck is always the shortest bar in this range `[i, j]`. We simply multiply this minimum height by the width `j - i + 1` and keep track of the absolute maximum area. This fails with Time Limit Exceeded (TLE) on LeetCode for large inputs."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">84. Largest Rectangle in Histogram</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
        <p className="text-lg leading-relaxed">
          Given an array of integers <code className="bg-slate-100 px-1.5 py-0.5 rounded text-violet-600 font-mono font-bold">heights</code> representing the histogram's bar height where the width of each bar is <code className="font-mono">1</code>, return <em>the area of the largest rectangle in the histogram</em>.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              <div className="flex items-end gap-1 h-32 border-b-2 border-slate-300 pb-1 w-fit pr-4">
                 {[2, 1, 5, 6, 2, 3].map((h, i) => (
                     <div key={i} className="flex flex-col items-center gap-1 group relative">
                        <div 
                           className={`w-8 rounded-t-sm transition-all duration-300 ${h >= 5 && i >= 2 && i <= 3 ? 'bg-violet-500' : 'bg-slate-300'}`} 
                           style={{ height: `${h * 15}px` }}
                        />
                        <span className="text-[10px] text-slate-500 font-bold">{h}</span>
                     </div>
                 ))}
              </div>
              <p><span className="text-slate-400 font-bold">Input:</span> heights = [2,1,5,6,2,3]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 10</p>
              <p className="text-slate-500 text-xs mt-2 border-t border-slate-200 pt-2"><span className="text-slate-400 font-bold">Explanation:</span> The above is a histogram where width of each bar is 1. The largest rectangle is shown in the shaded area, which has an area = 10 units (height 5 * width 2).</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> heights = [2,4]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 4</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const LargestRectangleVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState<keyof typeof APPROACHES>('optimalStack');
  const [numsInput, setNumsInput] = useState('2, 1, 5, 6, 2, 3');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedHeights = useMemo(() => {
    let arr = numsInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 0);
    if (arr.length === 0) return [2, 1, 5, 6, 2, 3];
    if (arr.length > 15) arr = arr.slice(0, 15); // Limit size for visualizer rendering
    return arr;
  }, [numsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    let heights = [...parsedHeights];
    const n = heights.length;
    
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({
        phase,
        description: desc,
        line,
        state: { heights: [...heights], ...state }
      });
    };

    if (n === 0) {
        addStep("Empty Array", "Array is empty, returning 0.", 2, { maxArea: 0, isSuccess: true });
        return steps;
    }

    if (selectedApproachId === 'optimalStack') {
        let maxArea = 0;
        let stack: number[] = [];
        
        addStep("Initialization", `Array length is ${n}. Initialize maxArea = 0 and an empty stack.`, 3, { maxArea, stack: [...stack], i: null, h: null });

        for (let i = 0; i <= n; i++) {
            addStep("Outer Loop Condition", `Check if i (${i}) <= n (${n}). It is true, continue loop.`, 7, { maxArea, stack: [...stack], i, h: null, leftBound: null, rightBound: null, calcHeight: null });
            
            let h = (i === n) ? 0 : heights[i];
            if (i < n) {
                addStep("Read Height", `i is not n. Read heights[${i}] = ${h}.`, 9, { maxArea, stack: [...stack], i, h, leftBound: null, rightBound: null, calcHeight: null });
            } else {
                addStep("Flush Stack", `i is n. Set height to 0 to flush remaining stack elements.`, 9, { maxArea, stack: [...stack], i, h, leftBound: null, rightBound: null, calcHeight: null });
            }

            while (true) {
                let isStackEmpty = stack.length === 0;
                let topHeight = !isStackEmpty ? heights[stack[stack.length - 1]] : null;
                
                if (isStackEmpty) {
                    addStep("While Condition Check", `Stack is empty. Condition (!stack.isEmpty() && h < heights[stack.peek()]) is false.`, 12, { maxArea, stack: [...stack], i, h, leftBound: null, rightBound: null, calcHeight: null });
                    break;
                } else if (h < topHeight!) {
                    addStep("While Condition Check", `Stack not empty. Current height ${h} < top of stack height ${topHeight}. Condition is true! Entering while loop.`, 12, { maxArea, stack: [...stack], i, h, comparing: true, leftBound: null, rightBound: null, calcHeight: null });
                } else {
                    addStep("While Condition Check", `Stack not empty, but current height ${h} >= top of stack height ${topHeight}. Condition is false. Breaking while loop.`, 12, { maxArea, stack: [...stack], i, h, comparing: true, leftBound: null, rightBound: null, calcHeight: null });
                    break;
                }
                
                let poppedIdx = stack.pop()!;
                let height = heights[poppedIdx];
                addStep("Pop Height", `Pop stack top index ${poppedIdx}. Its height is ${height}.`, 13, { maxArea, stack: [...stack], i, h, poppedIdx, calcHeight: height, leftBound: null, rightBound: null });
                
                let width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
                let leftBound = stack.length === 0 ? 0 : stack[stack.length - 1] + 1;
                addStep("Calculate Width", `Stack is ${stack.length === 0 ? 'empty' : 'not empty'}. Left bound is ${leftBound}. Right bound is ${i}. Width = ${i} - ${leftBound} = ${width}.`, 15, { maxArea, stack: [...stack], i, h, poppedIdx, calcHeight: height, calcWidth: width, leftBound, rightBound: i });
                
                let area = height * width;
                if (area > maxArea) {
                    maxArea = area;
                    addStep("Update Max Area", `Calculated area: ${height} * ${width} = ${area}. ${area} > current maxArea. New maxArea = ${maxArea}.`, 16, { 
                        maxArea, stack: [...stack], i, h, poppedIdx, calcHeight: height, calcWidth: width, leftBound, rightBound: i, calcArea: area, newMax: true 
                    });
                } else {
                    addStep("Update Max Area", `Calculated area: ${height} * ${width} = ${area}. ${area} <= current maxArea (${maxArea}). Max area unchanged.`, 16, { 
                        maxArea, stack: [...stack], i, h, poppedIdx, calcHeight: height, calcWidth: width, leftBound, rightBound: i, calcArea: area 
                    });
                }
            }
            
            if (i < n) {
                addStep("Push to Stack", `Push current index i (${i}) onto the stack.`, 18, { maxArea, stack: [...stack], i, h, leftBound: null, rightBound: null, calcHeight: null });
                stack.push(i);
            }
        }
        
        addStep("Outer Loop Condition", `Check if i (${n+1}) <= n (${n}). It is false, loop terminates.`, 7, { maxArea, stack: [...stack], i: n+1, leftBound: null, rightBound: null, calcHeight: null });
        addStep("Return Result", `Stack processed completely. Return final maxArea: ${maxArea}.`, 21, { maxArea, stack: [...stack], i: n, isSuccess: true, finalOutput: maxArea });
        
    } 
    else if (selectedApproachId === 'bruteForce') {
        let maxArea = 0;
        addStep("Initialization", `Array length is ${n}. Initialize maxArea = 0.`, 3, { maxArea, i: null, j: null });

        for (let i = 0; i < n; i++) {
            addStep("Outer Loop Condition", `Check if i (${i}) < n (${n}). True, entering outer loop.`, 6, { maxArea, i, j: null, leftBound: null, rightBound: null, calcHeight: null });
            
            let minHeight = heights[i];
            addStep("Initialize minHeight", `Set minHeight = heights[${i}] = ${minHeight}.`, 7, { maxArea, i, j: null, minHeight, leftBound: null, rightBound: null, calcHeight: null });
            
            for (let j = i; j < n; j++) {
                addStep("Inner Loop Condition", `Check if j (${j}) < n (${n}). True, entering inner loop.`, 9, { maxArea, i, j, minHeight, leftBound: null, rightBound: null, calcHeight: null });
                
                minHeight = Math.min(minHeight, heights[j]);
                addStep("Update minHeight", `minHeight = Math.min(${minHeight}, heights[${j}] (${heights[j]})) = ${minHeight}.`, 11, { maxArea, i, j, minHeight, leftBound: i, rightBound: j + 1, calcHeight: minHeight });
                
                let width = j - i + 1;
                addStep("Calculate Width", `width = j (${j}) - i (${i}) + 1 = ${width}.`, 12, { maxArea, i, j, minHeight, calcWidth: width, leftBound: i, rightBound: j + 1, calcHeight: minHeight });
                
                let area = minHeight * width;
                if (area > maxArea) {
                    maxArea = area;
                    addStep("Update maxArea", `area = ${minHeight} * ${width} = ${area}. ${area} > current maxArea. New maxArea = ${maxArea}.`, 13, { 
                        maxArea, i, j, minHeight, calcWidth: width, calcArea: area, leftBound: i, rightBound: j + 1, calcHeight: minHeight, newMax: true 
                    });
                } else {
                    addStep("Update maxArea", `area = ${minHeight} * ${width} = ${area}. ${area} <= current maxArea. Unchanged.`, 13, { 
                        maxArea, i, j, minHeight, calcWidth: width, calcArea: area, leftBound: i, rightBound: j + 1, calcHeight: minHeight
                    });
                }
            }
            addStep("Inner Loop Condition", `Check if j (${n}) < n (${n}). False, inner loop terminates.`, 9, { maxArea, i, j: n, minHeight, leftBound: null, rightBound: null, calcHeight: null });
        }

        addStep("Outer Loop Condition", `Check if i (${n}) < n (${n}). False, outer loop terminates.`, 6, { maxArea, i: n, j: null, leftBound: null, rightBound: null, calcHeight: null });
        addStep("Return Result", `Checked all pairs. Return final maxArea: ${maxArea}.`, 17, { maxArea, i: n, j: n, isSuccess: true, finalOutput: maxArea });
    }

    if (steps.length === 0) {
        addStep("Init", "Start", 1, {});
    }

    return steps;
  }, [parsedHeights, selectedApproachId]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedApproach.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0] || { state: {} };
  const state = cur.state || { heights: parsedHeights };
  const { isSuccess, heights, maxArea, stack, i, j, h, poppedIdx, calcHeight, calcWidth, leftBound, rightBound, newMax, finalOutput } = state;
  const n = heights.length;
  
  const maxH = useMemo(() => Math.max(...heights, 1), [heights]);

  // Stack auto-scroll ref
  const stackListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
     if (selectedApproachId === 'optimalStack' && stack && stackListRef.current) {
         stackListRef.current.scrollTop = 0; // Scroll to top for flex-col
     }
  }, [stack, selectedApproachId, currentStep]);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <BarChart className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Largest Rectangle</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 84</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Monotonic Stack</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
            <TabButton active={activeTab === 'problem'} onClick={() => setActiveTab('problem')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<BookOpen size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'problem' && <ProblemStatement />}

        {activeTab === 'visualizer' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Col: Code & Variable Context (5/12) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                
                {/* Approach Selector */}
                <div className="grid grid-cols-2 gap-3">
                    {Object.values(APPROACHES).map((app) => {
                        const isSelected = selectedApproachId === app.id;
                        const [time, space] = app.complexity.split(' | ');
                        return (
                            <button 
                               key={app.id}
                               onClick={() => { setSelectedApproachId(app.id as keyof typeof APPROACHES); setCurrentStep(0); }}
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-violet-600 border-violet-600 text-white shadow-violet-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-violet-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-violet-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-violet-100' : 'text-slate-400'}`}>
                                    <span>{time}</span>
                                    <span>{space}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="bg-[#0f172a] rounded-3xl h-[420px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={14} className="text-violet-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {/* Highlighter Bar */}
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : newMax ? 'bg-amber-500/15 border-amber-500' : 'bg-violet-500/20 border-violet-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="violet" />
                      ))}
                  </div>
                </div>

                {/* Left Side Variables */}
                <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-3 opacity-5">
                             <Maximize2 size={64}/>
                          </div>
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-2">Max Area</span>
                          <div className="text-5xl font-black font-mono text-violet-600 tabular-nums tracking-tighter">
                              {maxArea}
                          </div>
                     </div>

                     {selectedApproachId === 'optimalStack' && (
                         <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-2 h-32">
                             <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                               <div className="flex items-center gap-1.5 text-violet-600">
                                   <Layers size={14} />
                                   <h4 className="text-xs font-black uppercase tracking-widest font-mono">Stack</h4>
                               </div>
                               <span className="text-[9px] font-black text-slate-400 font-mono">Size: {stack?.length || 0}</span>
                             </div>
                             <div ref={stackListRef} className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 flex flex-col pr-1 gap-1">
                                 {stack?.slice().reverse().map((idx: number, it: number) => {
                                     const isTop = it === 0;
                                     return (
                                         <div key={`${idx}-${it}`} className={`px-3 py-1.5 rounded-lg border flex justify-between items-center transition-all duration-300 font-mono text-[10px] ${isTop ? 'bg-violet-50 border-violet-300 text-violet-800 font-bold shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                             <span>Idx: {idx}</span>
                                             <span className="opacity-70 border-l border-current pl-2">H: {heights[idx]}</span>
                                         </div>
                                     )
                                 })}
                                 {(!stack || stack.length === 0) && (
                                     <div className="text-center text-[10px] font-mono italic text-slate-400 mt-2">Empty</div>
                                 )}
                             </div>
                         </div>
                     )}
                     
                     {selectedApproachId === 'bruteForce' && (
                         <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-center gap-2 h-32">
                             <VariableCard label="Index i" val={i ?? null} arrVal={i !== undefined && i !== null && i < n ? heights[i] : null} color="sky" active={i !== undefined && i !== null && i < n} />
                             <VariableCard label="Index j" val={j ?? null} arrVal={j !== undefined && j !== null && j < n ? heights[j] : null} color="fuchsia" active={j !== null && j !== undefined && j < n} />
                         </div>
                     )}
                </div>
              </div>

              {/* Right Col: Simulation Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Heights (comma separated)</label>
                        <input type="text" value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner" placeholder="2, 1, 5, 6, 2, 3" />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-violet-100 hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Action Log / Status */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : newMax ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : newMax ? <Trophy size={100}/> : <BarChart size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : newMax ? "text-amber-400" : "text-violet-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : newMax ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line">{cur.description}</p>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[420px]">
                   
                   <div className="flex flex-col w-full h-full relative z-10 pt-4">
                      
                      {/* Histogram Visualization */}
                      <div className="flex items-end justify-center gap-1 sm:gap-2 h-64 border-b-2 border-slate-200 pb-1 relative w-full px-4">
                          
                          {/* Render Overlay Rectangle */}
                          {leftBound !== null && leftBound !== undefined && rightBound !== null && rightBound !== undefined && calcHeight !== null && calcHeight !== undefined && (
                              <div 
                                  className="absolute bottom-1 bg-amber-400/40 border-2 border-amber-500 z-20 flex items-center justify-center transition-all duration-500"
                                  style={{
                                      // Calculate width and left pos based on percentage of container
                                      left: `calc(1rem + ${leftBound * (100 / heights.length)}% + ${(leftBound * 2)}px)`, 
                                      width: `calc(${(rightBound - leftBound) * (100 / heights.length)}% - 4px)`,
                                      height: `${(calcHeight / maxH) * 100}%`,
                                      minHeight: '2px'
                                  }}
                              >
                                  {calcHeight > 0 && calcWidth > 0 && (
                                     <div className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1 py-0.5 rounded shadow-sm whitespace-nowrap hidden sm:block">
                                        {calcHeight} x {calcWidth} = {calcHeight * calcWidth}
                                     </div>
                                  )}
                              </div>
                          )}

                          {heights.map((val: number, idx: number) => {
                             const normalizedHeight = val === 0 ? 0 : (val / maxH) * 100;
                             
                             let barColor = "bg-slate-200";
                             let borderColor = "border-slate-300";
                             let zIndex = "z-10";

                             // Coloring logic
                             if (selectedApproachId === 'optimalStack') {
                                 if (stack && stack.includes(idx)) {
                                     barColor = "bg-violet-200";
                                     borderColor = "border-violet-400";
                                 }
                                 if (poppedIdx === idx) {
                                     barColor = "bg-rose-200";
                                     borderColor = "border-rose-400";
                                     zIndex = "z-30";
                                 }
                                 if (i === idx) {
                                     barColor = "bg-sky-200";
                                     borderColor = "border-sky-400";
                                     zIndex = "z-30";
                                 }
                             } else {
                                 if (i === idx) {
                                     barColor = "bg-sky-200";
                                     borderColor = "border-sky-400";
                                 }
                                 if (j === idx) {
                                     barColor = "bg-fuchsia-200";
                                     borderColor = "border-fuchsia-400";
                                 }
                             }

                             return (
                                 <div key={`bar-${idx}`} className={`flex flex-col items-center flex-1 relative h-full justify-end group`}>
                                     {/* Pointer Indicators */}
                                     <div className="absolute -top-6 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                         <span className="text-[9px] font-mono font-bold text-slate-400">i:{idx}</span>
                                     </div>
                                     
                                     {selectedApproachId === 'optimalStack' && i === idx && !isSuccess && (
                                         <div className="absolute -top-6 flex flex-col items-center animate-bounce z-40">
                                              <span className="text-[10px] font-black text-sky-600 font-mono">i</span>
                                              <ArrowDown size={12} className="text-sky-500" strokeWidth={3}/>
                                         </div>
                                     )}

                                     <div 
                                        className={`w-full rounded-t-sm transition-all duration-500 border-t-2 border-l-2 border-r-2 ${barColor} ${borderColor} ${zIndex}`} 
                                        style={{ height: `${normalizedHeight}%`, minHeight: val === 0 ? '1px' : '4px' }}
                                     >
                                         {val > 0 && <span className="w-full text-center block mt-1 text-[10px] font-bold opacity-60 mix-blend-multiply">{val}</span>}
                                     </div>
                                 </div>
                             )
                          })}
                      </div>
                      
                      {/* Array Indices */}
                      <div className="flex items-start justify-center gap-1 sm:gap-2 w-full px-4 mt-1">
                           {heights.map((_, idx) => (
                               <div key={`idx-${idx}`} className="flex-1 text-center text-[10px] font-mono text-slate-400 font-bold">
                                   {idx}
                               </div>
                           ))}
                      </div>

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-emerald-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-emerald-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">SEARCH COMPLETE</span>
                              <span className="text-xs font-black uppercase text-emerald-600 tracking-widest font-mono mb-4 block">Largest rectangle found</span>
                              
                              <div className="bg-slate-50 border border-slate-200 px-8 py-4 rounded-2xl shadow-inner mt-2 flex flex-col items-center">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-2">Max Area</span>
                                  <div className="flex gap-1 text-4xl font-mono font-black tracking-widest text-emerald-600">
                                      {finalOutput}
                                  </div>
                              </div>
                          </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Theory / Learn Tab */}
        {activeTab === 'learn' && (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-10 font-mono">
            <div className="max-w-4xl space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Layers className="text-violet-600"/> The Monotonic Stack
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                A Monotonic Stack is a stack whose elements are always sorted. For this problem, we maintain an <strong>strictly increasing stack of indices</strong>. This ingenious data structure allows us to find the left and right bounds of every bar in a single pass.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowRight size={18}/> Finding the Right Boundary
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            When do we stop expanding a rectangle to the right? When we hit a bar that is <em>shorter</em> than our current height.
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-3 rounded-lg border border-sky-200">
                            Because our stack only holds increasing heights, if the current bar <code>heights[i]</code> is shorter than the bar at the top of the stack, we have found the exact right boundary for the top bar! The right boundary index is simply <code>i</code>.
                        </p>
                    </div>
                    
                    <div className="p-8 bg-fuchsia-50 border border-fuchsia-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-fuchsia-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowLeft size={18}/> Finding the Left Boundary
                        </h3>
                        <p className="text-xs text-fuchsia-800 leading-relaxed mb-4">
                            When we pop a bar off the stack to calculate its area, how far left can its rectangle extend?
                        </p>
                        <p className="text-xs text-fuchsia-800 leading-relaxed font-bold bg-white p-3 rounded-lg border border-fuchsia-200">
                            Because the stack is strictly increasing, the element sitting <em>below</em> the popped element in the stack is guaranteed to be the first bar to its left that is shorter than it. Therefore, the left boundary starts exactly one index to the right of the new stack top!
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Maximize2 size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-violet-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">The "Flush" Trick</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed">
                        <p>
                           If the array is <code>[1, 2, 3, 4, 5]</code>, the stack will just keep growing and the loop will finish without calculating any areas!
                        </p>
                        <p>
                           To solve this elegantly without writing a second while loop outside the main for-loop, we loop up to <code>i &lt;= n</code> instead of <code>i &lt; n</code>. 
                        </p>
                        <div className="bg-violet-900/40 border border-violet-500/30 text-violet-300 p-4 rounded-xl mt-4 font-mono text-[10px] flex items-center justify-between">
                           <span>int h = (i == n) ? 0 : heights[i];</span>
                        </div>
                        <p className="text-violet-400 font-bold mt-2">
                            When we hit index <code>n</code>, we pretend there is a bar of height <code>0</code>. Since 0 is smaller than everything, it forces the `while` loop to trigger and pop/evaluate every remaining bar on the stack!
                        </p>
                    </div>
                </div>
            </div>
          </div>
        )}
        
        {/* Interview Tab */}
        {activeTab === 'interview' && (
             <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-8 font-mono">
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                        <Trophy size={140} />
                    </div>
                    <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-amber-400 relative z-10 uppercase tracking-tight">
                        <Trophy size={24} /> Interview Defense
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                        "While a brute force O(N²) approach expands outwards from every bar to find its maximum rectangle, it fails for large histograms due to redundant boundary checks. I optimized this to O(N) using a Monotonic Increasing Stack. The stack naturally keeps track of left boundaries. When we encounter a shorter bar, we immediately know the right boundary for the taller bars in the stack, allowing us to pop them, calculate their exact maximal area, and maintain purely linear time complexity since every index is pushed and popped exactly once."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Why store indices?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Why not just push the height itself to the stack? Because calculating the <strong>width</strong> of the rectangle requires knowing the distances (indices). By pushing the index, we can always retrieve the height via <code>heights[index]</code>, giving us both pieces of information required to calculate `width * height`.
                            </div>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <Timer size={14} className="text-emerald-500"/> Time & Space Complexity
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Time Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Although there is a nested `while` loop, every element is pushed to the stack exactly once and popped exactly once. 2N operations = O(N).</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">In the worst case (a strictly increasing array like `[1, 2, 3, 4]`), the stack will store all N indices before popping them at the very end.</p>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        )}

      </div>
    </div>
  );
};

const VariableCard = ({ label, val, arrVal, color, active }: { label: string, val: number | string | null, arrVal?: number | string | null, color: 'blue' | 'purple' | 'amber' | 'emerald' | 'sky' | 'violet' | 'fuchsia', active: boolean }) => {
    const bgMap = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        sky: 'bg-sky-50 border-sky-200 text-sky-700',
        violet: 'bg-violet-50 border-violet-200 text-violet-700',
        fuchsia: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700'
    };
    
    const inactiveMap = 'bg-slate-50 border-slate-200 text-slate-300';

    return (
        <div className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden h-full ${active ? bgMap[color] : inactiveMap}`}>
             <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 truncate px-1">{label}</span>
             <div className="text-xl font-black font-mono leading-none">
                 {val !== null ? val : '-'}
             </div>
             {active && arrVal !== undefined && arrVal !== null && (
                 <div className="absolute bottom-0 w-full text-center bg-black/5 text-[9px] font-black py-0.5 mt-2">
                     val: {arrVal}
                 </div>
             )}
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean, theme?: 'cyan' | 'violet' | 'rose' | 'emerald' | 'amber' | 'indigo' | 'fuchsia' | 'teal' | 'blue' }> = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|char|List|Integer|Set|Stack|Math)\b|\b\d+\b)/g).filter(Boolean);
  
  const bgActive = `bg-${theme}-500/15`;
  const borderActive = `bg-${theme}-500`;
  const textActive = `text-${theme}-400`;

  return (
    <div className={`flex relative z-10 min-h-[16.5px] transition-colors duration-200 ${active ? bgActive : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${borderActive}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-[10px] ${active ? `${textActive} font-bold` : 'text-slate-700'}`}>{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"') || part.startsWith("'")) return <span key={i} className="text-green-300">{part}</span>;
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'long', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'Stack', 'Math'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-yellow-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default LargestRectangleVisualizer;