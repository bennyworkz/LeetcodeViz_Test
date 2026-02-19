
import React, { useState, useMemo } from 'react';
import { 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Activity, 
  BookOpen, 
  Code2, 
  Check, 
  Copy, 
  AlignLeft, 
  Zap, 
  Trophy, 
  MessageSquare, 
  Target, 
  AlertCircle, 
  Cpu, 
  MousePointer2, 
  Waves, 
  Ruler, 
  Maximize, 
  X, 
  FileText, 
  ArrowRight,
  Calculator,
  History,
  TrendingUp,
  BarChart3,
  Hash,
  Info,
  ArrowDown
} from 'lucide-react';

const APPROACHES = {
  optimal: {
    id: 'optimal',
    title: '1. Two-Pointer Converge',
    subtitle: 'Optimal O(N)',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int maxArea(int[] height) {
        int left = 0, right = height.length - 1;
        int maxArea = 0;

        while (left < right) {
            int h = Math.min(height[left], height[right]);
            int w = right - left;
            maxArea = Math.max(maxArea, h * w);

            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxArea;
    }
}`,
    explanation: "We start with the widest possible width. By moving the shorter pointer inward, we trade width for the potential of a taller height. Moving the taller pointer is never optimal because the container's height is always capped by the shorter side."
  }
};

const ContainerWithMostWaterVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [heightsInput, setHeightsInput] = useState("1,8,6,2,5,4,8,3,7");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const heights = useMemo(() => heightsInput.split(',').map(n => parseInt(n.trim()) || 0), [heightsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = heights.length;
    
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ 
        phase, 
        description: desc, 
        line, 
        state: { 
          ...state, 
          heights: [...heights],
          n 
        } 
      });
    };

    let left = 0, right = n - 1, maxArea = 0;
    
    // Line 3: Init Pointers
    addStep("Init Pointers", `Initializing pointers. Left is at index 0, Right is at index ${n-1}.`, 3, { left, right, maxArea: 0 });
    
    // Line 4: Init maxArea
    addStep("Init Max", "Initializing global maximum area to 0.", 4, { left, right, maxArea: 0 });

    while (left < right) {
      // Line 6: Loop Check
      addStep("Loop Evaluation", `Checking condition: left (${left}) < right (${right}). Continuing search...`, 6, { left, right, maxArea });
      
      const h = Math.min(heights[left], heights[right]);
      // Line 7: Calc h
      addStep("Determine Height", `Finding the bottleneck height: min(height[${left}], height[${right}]) = min(${heights[left]}, ${heights[right]}) = ${h}.`, 7, { left, right, maxArea, h });
      
      const w = right - left;
      // Line 8: Calc w
      addStep("Measure Width", `Calculating current width: right (${right}) - left (${left}) = ${w}.`, 8, { left, right, maxArea, h, w });
      
      const currentArea = h * w;
      const oldMax = maxArea;
      maxArea = Math.max(maxArea, currentArea);
      const isNewMax = currentArea > oldMax;
      // Line 9: Update maxArea
      addStep("Update Global Best", isNewMax ? `New record! ${currentArea} is greater than ${oldMax}. Updating maxArea.` : `${currentArea} is not better than ${oldMax}. maxArea remains the same.`, 9, { left, right, maxArea, h, w, currentArea, isNewMax });

      const leftIsShorter = heights[left] < heights[right];
      // Line 11: If Condition
      addStep("Greedy Selection", `Evaluating move: Is height[left] (${heights[left]}) < height[right] (${heights[right]})? ${leftIsShorter ? 'YES' : 'NO'}.`, 11, { left, right, maxArea, h, w, currentArea });

      if (leftIsShorter) {
        // Line 12: Move Left
        addStep("Shift Pointer", `Moving the shorter pointer (left) inward to find a taller line.`, 12, { left, right, maxArea, h, w, currentArea, moving: 'left' });
        left++;
      } else {
        // Line 14: Move Right
        addStep("Shift Pointer", `Moving the shorter or equal pointer (right) inward to find a taller line.`, 14, { left, right, maxArea, h, w, currentArea, moving: 'right' });
        right--;
      }
    }
    
    // Final exit
    addStep("Loop Termination", "left is no longer < right. All logical container boundaries have been explored.", 6, { left, right, maxArea });
    addStep("Return Result", `Optimal area identified: ${maxArea}. Returning result.`, 17, { maxArea, finished: true });

    return steps;
  }, [heights]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(APPROACHES.optimal.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0];
  const { left, right, maxArea, currentArea, h, w, finished, moving, isNewMax } = cur.state;
  const globalMaxHeight = Math.max(...heights, 1);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center">
                <Waves className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Container With Most Water</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-2 font-mono">
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded tracking-tighter uppercase font-black tracking-widest">Two Pointers</span>
                <span>LC 11 • Medium</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
            <TabButton active={activeTab === 'problem'} onClick={() => setActiveTab('problem')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<BookOpen size={16}/>} label="Learn" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'problem' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 animate-in fade-in duration-700">
            <div className="max-w-3xl space-y-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-6 font-mono tracking-tighter">11. Container With Most Water</h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-lg leading-relaxed">
                  <p>You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>i<sup>th</sup></code> line are <code>(i, 0)</code> and <code>(i, height[i])</code>.</p>
                  <p>Find two lines that together with the x-axis form a container, such that the container contains the most water.</p>
                  <p>Return <em>the maximum amount of water a container can store.</em></p>
                  <p className="font-bold text-slate-800 italic underline decoration-blue-200">Notice that you may not slant the container.</p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 font-mono">
                  <Hash size={16}/> Example 1:
                </h3>
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col gap-6 shadow-inner">
                  <div className="flex items-end justify-center h-40 w-full gap-2 border-b-2 border-slate-300 pb-1">
                    {[1,8,6,2,5,4,8,3,7].map((h, i) => (
                      <div key={i} className={`w-4 rounded-t-sm transition-all ${(i === 1 || i === 8) ? 'bg-blue-600' : 'bg-slate-300'}`} style={{ height: `${(h / 8) * 100}%` }}></div>
                    ))}
                  </div>
                  <div className="font-mono text-sm space-y-2">
                    <p><span className="text-slate-400 font-bold uppercase text-[10px]">Input:</span> height = [1,8,6,2,5,4,8,3,7]</p>
                    <p><span className="text-slate-400 font-bold uppercase text-[10px]">Output:</span> 49</p>
                    <p className="text-xs text-slate-500 italic border-t pt-2">Explanation: The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49 (from index 1 to index 8).</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <AlertCircle size={14} /> Constraints:
                </h3>
                <ul className="list-disc list-inside space-y-3 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <li><code className="bg-slate-100 px-1.5 rounded text-slate-800 font-bold">n == height.length</code></li>
                  <li><code>2 &lt;= n &lt;= 10<sup>5</sup></code></li>
                  <li><code>0 &lt;= height[i] &lt;= 10<sup>4</sup></code></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-2 flex gap-2 shadow-sm">
                <div className="flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-100">
                    <span className="text-xs font-black uppercase tracking-tight">{APPROACHES.optimal.title}</span>
                    <span className="text-[10px] opacity-70 text-white">
                      {APPROACHES.optimal.complexity}
                    </span>
                </div>
              </div>

              <div className="bg-[#0f172a] rounded-3xl h-[520px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Code2 size={14} className="text-blue-400" />
                    <span className="font-bold uppercase tracking-tight">Solution.java</span>
                  </div>
                  <button onClick={handleCopy} className="hover:text-white transition-colors">
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="p-6 font-mono text-[13px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="absolute left-0 right-0 bg-blue-500/15 border-l-4 border-blue-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${(cur.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} />
                    {APPROACHES.optimal.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} />
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-blue-600">
                    <Info size={18} />
                    <h4 className="text-sm font-black uppercase tracking-widest font-mono">Algorithm Strategy</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">{APPROACHES.optimal.explanation}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-blue-600 uppercase block pl-1 tracking-widest font-mono">Height Data (csv)</label>
                    <input value={heightsInput} onChange={(e) => { setHeightsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner" />
                </div>
                <div className="flex gap-3">
                  <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <ChevronLeft size={16}/> Prev
                  </button>
                  <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                    Next Action <ChevronRight size={16}/>
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-3xl p-7 shadow-2xl border border-slate-800 min-h-[160px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    <Waves size={100}/>
                </div>
                <div className="flex items-center gap-2 mb-3">
                   <Activity size={14} className="text-indigo-400"/>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Thread</span>
                </div>
                <div className="text-lg font-black tracking-tight mb-2 uppercase font-mono flex items-center gap-3">
                    {isNewMax && <span className="bg-green-500 text-white px-2 py-0.5 rounded text-[10px] animate-pulse uppercase tracking-tighter">Record!</span>}
                    {cur.phase}
                </div>
                <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic">{cur.description}</p>
              </div>

              {/* Simulation Arena */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[480px] relative flex flex-col justify-between overflow-hidden shadow-inner transition-all duration-500">
                
                {/* Stats Dashboard */}
                {!finished && (
                  <div className="w-full grid grid-cols-2 gap-4 z-10 mb-8">
                     <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex flex-col items-center justify-center shadow-sm relative overflow-hidden group">
                        <span className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest font-mono">Current Area</span>
                        <div className={`text-4xl font-black tabular-nums transition-all duration-500 ${isNewMax ? 'text-green-600 scale-110' : 'text-blue-600'}`}>
                          {currentArea ?? 0}
                        </div>
                        {h && w && (
                          <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter font-mono">
                            h:{h} &times; w:{w}
                          </div>
                        )}
                     </div>
                     <div className="bg-indigo-50/50 rounded-3xl p-5 border border-indigo-100 flex flex-col items-center justify-center shadow-sm">
                        <span className="text-[9px] font-black text-indigo-400 uppercase mb-1 tracking-widest font-mono">Global Best</span>
                        <div className="text-4xl font-black tabular-nums text-slate-800 font-mono">
                            {maxArea ?? 0}
                        </div>
                     </div>
                  </div>
                )}

                {/* Main Visual: Terrain & Water */}
                <div className="flex-1 flex flex-col items-center justify-center gap-10 relative">
                    <div className="flex items-end justify-center gap-1 h-[220px] w-full px-5 relative z-10 border-b-4 border-slate-900 pb-1">
                      
                      {/* Water Overlay */}
                      {!finished && left !== undefined && right !== undefined && left < right && h > 0 && (
                        <div 
                          className="absolute bottom-1 bg-gradient-to-t from-blue-500/40 to-blue-400/20 border-t-2 border-dashed border-blue-400 transition-all duration-500 z-0 flex items-center justify-center"
                          style={{
                              left: `calc(1.25rem + ${(left / (heights.length - 1)) * (100 - (100/heights.length))}% )`,
                              width: `calc(${((right - left) / (heights.length - 1)) * (100 - (100/heights.length))}% )`,
                              height: `${(h / globalMaxHeight) * 100}%`
                          }}
                        >
                          <div className="animate-in zoom-in duration-300 scale-75 bg-white/80 backdrop-blur-sm p-1.5 rounded-xl border border-blue-200 font-mono text-[10px] font-black text-blue-600 shadow-xl">
                            {h * w}
                          </div>
                        </div>
                      )}

                      {heights.map((val, idx) => {
                        const isL = left === idx;
                        const isR = right === idx;
                        const isActive = isL || isR;
                        const barHeight = (val / globalMaxHeight) * 100;

                        return (
                          <div key={idx} className="flex-1 h-full flex flex-col justify-end items-center relative group">
                            {/* High-fidelity Pointer Arrow Tags */}
                            {!finished && isActive && (
                               <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-20">
                                 <div className={`px-2 py-0.5 rounded-full text-[9px] font-black text-white shadow-xl mb-1 uppercase tracking-tighter font-mono ${isL ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                                    {isL ? 'PTR L' : 'PTR R'}
                                 </div>
                                 <div className={`w-0.5 h-3 ${isL ? 'bg-blue-600' : 'bg-indigo-600'}`}></div>
                               </div>
                            )}

                            {/* Terrain Bar */}
                            <div 
                              className={`w-full transition-all duration-500 rounded-t-lg z-10 relative 
                                ${isActive ? 'bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)] scale-x-110 ring-2 ring-indigo-400 ring-offset-2' : 'bg-slate-700'}
                                ${moving === 'left' && isL ? 'animate-pulse bg-rose-500 ring-rose-400' : ''}
                                ${moving === 'right' && isR ? 'animate-pulse bg-rose-500 ring-rose-400' : ''}
                              `} 
                              style={{ height: `${barHeight}%` }}
                            >
                               <div className={`absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black font-mono transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                  {val}
                               </div>
                            </div>

                            {/* Horizontal Coordinate Labels */}
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-mono font-black text-slate-300">
                               {idx}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                </div>

                {/* Final Completion Result Banner */}
                {finished && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-indigo-600/5 backdrop-blur-[4px] animate-in fade-in duration-1000">
                    <div className="bg-white border-2 border-indigo-100 px-12 py-10 rounded-[3.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] flex flex-col items-center gap-6 transform -rotate-1 hover:rotate-0 transition-transform">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-xl mb-2">
                          <Check size={48} strokeWidth={3}/>
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] block mb-2 font-mono">Algorithm Complete</span>
                        <div className="text-7xl font-black text-slate-900 tracking-tighter tabular-nums drop-shadow-sm font-mono">{maxArea}</div>
                        <div className="mt-6 px-6 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest font-mono">
                           Verified Optimal O(N)
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'learn' && (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight flex items-center gap-3 font-mono">
                <BookOpen className="text-indigo-600"/> The Greedy Invariant Logic
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed max-w-4xl font-mono">
                The core of the optimal O(N) solution is <strong>directional inward convergence</strong>. Instead of checking every pair (O(N²)), we realize that most pairs are logically impossible to be better than our current one.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6 font-mono">
                    <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-indigo-900 flex items-center gap-2 uppercase tracking-tighter text-sm"><Ruler size={18}/> The Bottleneck Rule</h3>
                        <p className="text-sm text-indigo-800 leading-relaxed italic border-l-2 border-indigo-200 pl-4">
                          "Area is strictly limited by the shorter line."
                        </p>
                        <p className="text-xs text-indigo-700 leading-relaxed">
                          In the formula <code>Area = min(h1, h2) * width</code>, moving the <strong>shorter</strong> pointer inward is the only action that could potentially increase the area. Moving the <strong>taller</strong> pointer is guaranteed to decrease the area, as the width shrinks and the height bottleneck (the shorter line) remains or gets worse.
                        </p>
                    </div>
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm"><Maximize size={18}/> Monotonic Width Decay</h3>
                        <p className="text-sm text-amber-700 leading-relaxed">
                          Width always starts at its maximum (N-1) and strictly decreases by 1 at every step. This monotonicity allows us to discard an entire dimension of search space at every decision point.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden font-mono">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <History size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <BarChart3 size={32} className="text-indigo-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Asymptotic Performance</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                      <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700 backdrop-blur-sm">
                          <span className="text-[10px] text-slate-500 block mb-1 uppercase font-black">Brute Force</span>
                          <div className="font-mono text-2xl font-black text-indigo-400">O(N²)</div>
                          <p className="text-[9px] text-slate-500 mt-2 font-mono uppercase tracking-tighter">N-squared pairs</p>
                      </div>
                      <div className="p-5 bg-blue-600 rounded-3xl shadow-xl shadow-blue-500/20">
                          <span className="text-[10px] text-indigo-200 block mb-1 uppercase font-black">Two-Pointer</span>
                          <div className="font-mono text-2xl font-black">O(N)</div>
                          <p className="text-[9px] text-indigo-200 mt-2 font-mono uppercase tracking-tighter">Single linear pass</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed italic relative z-10">
                      "At N=100,000, O(N²) takes hours. O(N) takes milliseconds. This is the difference between an unrunnable service and a production-ready API."
                    </p>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <div className="space-y-6">
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-slate-800 font-mono">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                        <Trophy size={140} />
                    </div>
                    <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-amber-400 relative z-10 uppercase tracking-tight">
                        <Trophy size={24} /> Senior Interview Defense
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                        "For a dataset of 10⁵ elements, an O(N²) solution is theoretically invalid due to TLE. I implemented an O(N) two-pointer convergence that leverages the greedy choice property. By starting at the widest possible width and moving only the bottleneck pointer inward, we ensure that every potential improvement is considered while skipping logically inferior containers. This approach optimizes memory usage to O(1) by avoiding any auxiliary data structures, making it suitable for low-latency production environments."
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter font-black tracking-tight font-mono">
                        <MessageSquare className="text-indigo-500" size={20} /> Candidate Q&A
                    </h3>
                    <div className="space-y-4 font-mono">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-bold">"Why move the shorter line?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                "The area is limited by the shorter line. If we move the taller line, the width decreases but the height bottleneck stays the same (or gets worse). Thus, the area *must* decrease. Moving the shorter line is the only move that can *potentially* find a taller line to compensate for the lost width."
                            </p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-bold">"What if both lines are equal?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                "It doesn't matter which one you move. Either choice will decrease width, and since the heights were equal, both lines were bottlenecks. Moving either (or both) is logically equivalent for the purpose of the O(N) search."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-[2rem] p-8 shadow-sm font-mono">
                    <h3 className="text-lg font-black text-indigo-900 mb-6 uppercase tracking-widest flex items-center gap-2 font-black">
                        <AlertCircle size={20}/> Leadership Strategy
                    </h3>
                    <ul className="space-y-8">
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">1</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight">Customer Obsession</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1">Frame the O(N) solution as a way to ensure the algorithm works on low-memory mobile devices without performance degradation.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">2</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight">Bias for Action</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1">Implement the working optimal code immediately. Only mention Brute Force to contrast why it's unfit for purpose.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center border border-slate-200 shadow-sm font-mono">
                    <Calculator className="text-slate-400 mb-3" size={48} />
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest text-center mb-6">Bottleneck Analysis</p>
                    <div className="space-y-4 w-full">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase">Search Space (Pairs)</span>
                                <span className="text-rose-500 font-black">O(N²) - 10 Billion</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-400 w-full" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase">Actual Visits</span>
                                <span className="text-indigo-500 font-black font-mono">O(N) - 100,000</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-[1%]" />
                            </div>
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

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|Math|min|max|length)\b|\b\d+\b)/g).filter(Boolean);
  return (
    <div className={`flex relative z-10 min-h-[20.8px] transition-colors duration-300 ${active ? 'bg-indigo-500/10 font-bold' : ''}`}>
      <span className="w-10 text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 font-mono text-[11px] select-none shrink-0">{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean', 'void'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['Math', 'String'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['min', 'max', 'length'].includes(part)) return <span key={i} className="text-blue-400">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-rose-400 font-bold">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default ContainerWithMostWaterVisualizer;
