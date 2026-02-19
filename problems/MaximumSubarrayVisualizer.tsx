
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
  Zap, 
  Trophy, 
  MessageSquare, 
  Target, 
  AlertCircle, 
  Cpu, 
  Layers, 
  Hash, 
  Database, 
  Calculator, 
  FileText, 
  ArrowRight, 
  ArrowDown, 
  Info, 
  BarChart3, 
  X, 
  TrendingUp,
  LineChart,
  History,
  Maximize2,
  Minimize2,
  MousePointer2
} from 'lucide-react';

const APPROACHES = {
  kadane: {
    id: 'kadane',
    title: "1. Kadane's Algorithm",
    subtitle: 'Optimal O(N) Greedy/DP',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int maxSubArray(int[] nums) {
        int currentSum = nums[0];
        int maxSum = nums[0];

        for (int i = 1; i < nums.length; i++) {
            if (currentSum < 0) {
                currentSum = nums[i];
            } else {
                currentSum += nums[i];
            }
            if (currentSum > maxSum) {
                maxSum = currentSum;
            }
        }
        return maxSum;
    }
}`,
    explanation: "Kadane's Algorithm is a dynamic programming approach that solves the problem in a single pass. At each position, we decide: should we extend the existing subarray sum, or start a fresh subarray from the current element? We restart whenever the previous sum becomes a 'drag' (negative)."
  },
  brute: {
    id: 'brute',
    title: '2. Brute Force',
    subtitle: 'O(N²) Exhaustive',
    icon: <AlertCircle size={16} />,
    complexity: 'Time: O(N²) | Space: O(1)',
    code: `class Solution {
    public int maxSubArray(int[] nums) {
        int max = Integer.MIN_VALUE;
        for (int i = 0; i < nums.length; i++) {
            int current = 0;
            for (int j = i; j < nums.length; j++) {
                current += nums[j];
                if (current > max) {
                    max = current;
                }
            }
        }
        return max;
    }
}`,
    explanation: "This checks every possible contiguous subarray. For each starting index 'i', we expand to 'j' and track the sum. It is intuitive but inefficient, performing redundant calculations for overlapping regions."
  }
};

const MaximumSubarrayVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproach, setSelectedApproach] = useState<keyof typeof APPROACHES>('kadane');
  const [numsInput, setNumsInput] = useState("-2,1,-3,4,-1,2,1,-5,4");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const nums = useMemo(() => numsInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)), [numsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = nums.length;
    if (n === 0) return [];

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ 
        phase, 
        description: desc, 
        line, 
        state: { 
          nums: [...nums],
          currentSum: 0,
          maxSum: 0,
          i: -1,
          j: -1,
          ...state 
        } 
      });
    };

    if (selectedApproach === 'kadane') {
      let currentSum = nums[0];
      let maxSum = nums[0];

      addStep("Initialization", `Set starting currentSum to first element: ${nums[0]}.`, 3, { currentSum, maxSum: nums[0] });
      addStep("Initialization", `Set initial global maxSum to first element: ${nums[0]}.`, 4, { currentSum, maxSum });

      for (let i = 1; i < n; i++) {
        addStep("Iteration", `Processing index ${i} (Value: ${nums[i]}).`, 6, { i, currentSum, maxSum });
        
        const isNegative = currentSum < 0;
        addStep("Deciding Strategy", `Is currentSum (${currentSum}) negative? ${isNegative ? "YES" : "NO"}.`, 7, { i, currentSum, maxSum });

        if (isNegative) {
          currentSum = nums[i];
          addStep("Restart Subarray", `Existing sum is a drag. Restarting subarray at current element: ${nums[i]}.`, 8, { i, currentSum, maxSum, reset: true });
        } else {
          const oldSum = currentSum;
          currentSum += nums[i];
          addStep("Extend Subarray", `Adding ${nums[i]} to current sum: ${oldSum} + ${nums[i]} = ${currentSum}.`, 10, { i, currentSum, maxSum, extend: true });
        }

        const isNewMax = currentSum > maxSum;
        addStep("Update Check", `Is currentSum (${currentSum}) > global maxSum (${maxSum})? ${isNewMax ? "YES" : "NO"}.`, 12, { i, currentSum, maxSum });

        if (isNewMax) {
          maxSum = currentSum;
          addStep("Record Found", `Updated global maximum subarray sum to ${maxSum}.`, 13, { i, currentSum, maxSum, found: true });
        }
      }
      addStep("Conclusion", `Traversal finished. Returning the highest sum found: ${maxSum}.`, 16, { maxSum, finished: true });

    } else {
      // Brute Force Trace
      let max = -Infinity;
      addStep("Init", "Initialize global max to negative infinity.", 3, { max });

      for (let i = 0; i < n; i++) {
        let current = 0;
        addStep("Outer Loop", `Fixing start index i = ${i}.`, 4, { i, current: 0, max });
        addStep("Reset Sum", "Reset current window sum to 0.", 5, { i, current: 0, max });

        for (let j = i; j < n; j++) {
          current += nums[j];
          addStep("Inner Loop", `Adding nums[${j}] (${nums[j]}) to window. Window [${i}...${j}] sum = ${current}.`, 7, { i, j, current, max });
          
          const isNewMax = current > max;
          addStep("Check Max", `Is ${current} > ${max}?`, 8, { i, j, current, max });
          if (isNewMax) {
            max = current;
            addStep("Update Max", `New global max found: ${max}.`, 9, { i, j, current, max, found: true });
          }
        }
      }
      addStep("Conclusion", `Checked all subarrays. Result: ${max}.`, 13, { max, finished: true });
    }

    return steps;
  }, [nums, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(APPROACHES[selectedApproach].code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0];
  const { currentSum, maxSum, i: activeI, j: activeJ, found, reset, extend, finished, max: bruteMax, current: bruteCurrent } = cur.state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full transition-all duration-500">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center">
                <TrendingUp className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Maximum Subarray</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-widest font-black text-[10px]">Kadane's Algorithm</span>
                <span>LC 53 • Medium</span>
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
                <h2 className="text-3xl font-black text-slate-900 mb-6 font-mono tracking-tighter text-indigo-600">53. Maximum Subarray</h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-lg leading-relaxed font-mono">
                  <p>Given an integer array <code>nums</code>, find the <strong>subarray</strong> with the largest sum, and return <em>its sum</em>.</p>
                  <p>A <strong>subarray</strong> is a <strong>contiguous</strong> part of an array.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Hash size={16}/> Examples:
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 font-mono text-sm shadow-inner space-y-3">
                        <p><span className="text-slate-400 font-bold uppercase tracking-tighter">Input:</span> nums = [-2,1,-3,4,-1,2,1,-5,4]</p>
                        <p><span className="text-slate-400 font-bold uppercase tracking-tighter">Output:</span> 6</p>
                        <p className="text-xs text-slate-500 italic border-t border-slate-200 pt-3 leading-relaxed">Explanation: The subarray [4,-1,2,1] has the largest sum 6.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <AlertCircle size={14} /> Constraints:
                </h3>
                <ul className="list-disc list-inside space-y-3 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <li><code className="bg-slate-100 px-1.5 rounded text-slate-800 font-bold">1 {'<='} nums.length {'<='} 10<sup>5</sup></code></li>
                  <li><code>-10<sup>4</sup> {'<='} nums[i] {'<='} 10<sup>4</sup></code></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-2 flex gap-2 shadow-sm">
                {(Object.keys(APPROACHES) as Array<keyof typeof APPROACHES>).map((key) => (
                  <button key={key} onClick={() => { setSelectedApproach(key); setCurrentStep(0); }} className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-indigo-600 text-white shadow-lg' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}>
                    <span className="text-xs font-black uppercase tracking-tight">{APPROACHES[key].title}</span>
                    <span className={`text-[10px] opacity-70 ${selectedApproach === key ? 'text-white' : 'text-slate-400'}`}>
                      {APPROACHES[key].complexity}
                    </span>
                  </button>
                ))}
              </div>

              <div className="bg-[#0f172a] rounded-3xl h-[480px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Code2 size={14} className="text-indigo-400" />
                    <span className="font-bold uppercase tracking-tight">Solution.java</span>
                  </div>
                  <button onClick={handleCopy} className="hover:text-white transition-colors">
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="p-6 font-mono text-[13px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="absolute left-0 right-0 bg-indigo-500/15 border-l-4 border-indigo-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${(cur.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} />
                    {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} />
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-indigo-600">
                    <Info size={18} />
                    <h4 className="text-sm font-black uppercase tracking-widest font-mono">Algorithm Strategy</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">{APPROACHES[selectedApproach].explanation}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-indigo-600 uppercase block pl-1 tracking-widest font-mono">Input Data (nums)</label>
                    <input value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
                </div>
                <div className="flex gap-3">
                  <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <ChevronLeft size={16}/> Prev
                  </button>
                  <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                    Next Action <ChevronRight size={16}/>
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-3xl p-7 shadow-2xl border border-slate-800 min-h-[160px] relative overflow-hidden group font-mono">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    <LineChart size={100}/>
                </div>
                <div className="flex items-center gap-2 mb-3">
                   <Activity size={14} className="text-indigo-400"/>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Execution Thread</span>
                </div>
                <div className="text-lg font-black tracking-tight mb-2 uppercase flex items-center gap-3">
                    {found && <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] animate-pulse shadow-lg">New Peak!</span>}
                    {reset && <span className="bg-amber-500 text-white px-2 py-0.5 rounded text-[10px] animate-pulse shadow-lg">Reset!</span>}
                    {cur.phase}
                </div>
                <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3">{cur.description}</p>
              </div>

              {/* Simulation Arena */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[450px] relative flex flex-col justify-between overflow-hidden shadow-inner transition-all duration-500">
                
                {/* Stats Header */}
                <div className="w-full grid grid-cols-2 gap-4 z-10">
                   <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex flex-col items-center justify-center shadow-sm relative overflow-hidden group">
                      <span className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest font-mono">Current Sum</span>
                      <div className={`text-4xl font-black tabular-nums transition-all duration-500 ${reset ? 'text-amber-500' : 'text-indigo-600'}`}>
                          {selectedApproach === 'kadane' ? currentSum : bruteCurrent}
                      </div>
                   </div>
                   <div className="bg-indigo-50/50 rounded-3xl p-5 border border-indigo-100 flex flex-col items-center justify-center shadow-sm">
                      <span className="text-[9px] font-black text-indigo-400 uppercase mb-1 tracking-widest font-mono">Global Max Sum</span>
                      <div className={`text-4xl font-black tabular-nums transition-all duration-500 ${found ? 'text-emerald-600 scale-110' : 'text-slate-800'}`}>
                          {selectedApproach === 'kadane' ? maxSum : bruteMax}
                      </div>
                   </div>
                </div>

                {/* Array Visualization */}
                <div className="flex items-end justify-center gap-2.5 h-[220px] w-full px-5 relative z-10 border-b-4 border-slate-900 pb-2">
                  {nums.map((num, idx) => {
                    const isScan = activeI === idx;
                    const isBruteJ = activeJ === idx;
                    const isInsideWindow = selectedApproach === 'brute' && idx >= activeI && idx <= activeJ;
                    const isActive = isScan || isBruteJ || isInsideWindow;
                    
                    const maxVal = Math.max(...nums.map(Math.abs), 1);
                    const barHeight = (Math.abs(num) / maxVal) * 100;
                    const isNegative = num < 0;

                    return (
                      <div key={idx} className="flex-1 h-full flex flex-col justify-end items-center relative group">
                        {/* Pointer Tags */}
                        {!finished && isScan && (
                           <div className={`absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-20`}>
                             <div className={`px-2 py-0.5 rounded-full text-[9px] font-black text-white shadow-xl mb-1 uppercase tracking-tighter ${selectedApproach === 'kadane' ? 'bg-indigo-600' : 'bg-blue-600'}`}>
                                {selectedApproach === 'kadane' ? 'Cur' : 'Start'}
                             </div>
                             <div className={`w-0.5 h-3 ${selectedApproach === 'kadane' ? 'bg-indigo-600' : 'bg-blue-600'}`}></div>
                           </div>
                        )}

                        {/* Bar Segment */}
                        <div 
                          className={`w-full transition-all duration-500 rounded-t-xl z-10 relative 
                            ${isActive ? 'bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] scale-x-110 ring-2 ring-indigo-400 ring-offset-2' : 'bg-slate-200'}
                            ${isNegative ? 'bg-rose-100 border-rose-200' : ''}
                            ${reset && isScan ? 'bg-amber-500 ring-amber-400' : ''}
                            ${extend && isScan ? 'bg-blue-500 ring-blue-400' : ''}
                          `} 
                          style={{ height: `${barHeight}%` }}
                        >
                          <div className={`absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black font-mono transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} ${isNegative ? 'text-rose-600' : 'text-slate-800'}`}>
                             {num}
                          </div>
                        </div>

                        {/* Index Label */}
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-mono font-black text-slate-300">
                           {idx}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Final State Banner */}
                {finished && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-indigo-600/5 backdrop-blur-[4px] animate-in fade-in duration-1000">
                    <div className="bg-white border-2 border-indigo-100 px-12 py-10 rounded-[3.5rem] shadow-2xl flex flex-col items-center gap-6 transform -rotate-1 hover:rotate-0 transition-transform">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-xl mb-2">
                          <Check size={48} strokeWidth={3}/>
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] block mb-2 font-mono">Max Subarray Sum</span>
                        <div className="text-7xl font-black text-slate-900 tracking-tighter tabular-nums drop-shadow-sm font-mono">{maxSum || bruteMax}</div>
                        <div className="mt-4 px-6 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest font-mono shadow-sm">
                           O(N) Complexity Achievement
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
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-10 font-mono">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight flex items-center gap-3">
                <BookOpen className="text-indigo-600"/> The Greedy/DP Paradigm
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed max-w-4xl">
                The Maximum Subarray problem is a fundamental challenge in computer science. The core difficulty lies in identifying when a sequence of negative numbers is worth "weathering" to get to a massive positive value later.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-indigo-900 flex items-center gap-2 uppercase tracking-tighter text-sm"><Layers size={18}/> Local vs Global</h3>
                        <p className="text-sm text-indigo-800 leading-relaxed font-mono bg-white/50 p-4 rounded-2xl border border-indigo-100 italic">
                          "At every element, we make a greedy choice."
                        </p>
                        <p className="text-xs text-indigo-700 leading-relaxed">
                          Kadane's maintains a <strong>local maximum</strong> (the best subarray ending at index <code>i</code>) and a <strong>global maximum</strong> (the best subarray found anywhere so far). If the local sum becomes worse than starting a new subarray, we discard the past and restart.
                        </p>
                    </div>
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm"><Calculator size={18}/> The Restart Condition</h3>
                        <p className="text-sm text-amber-700 leading-relaxed font-mono">
                          Sum is extended if <code>sum + nums[i] &gt; nums[i]</code>.
                          <br/><br/>
                          This simplifies to <code>sum &gt; 0</code>.
                          <br/><br/>
                          If we carry a negative total into a new element, we are objectively worse off than if we just started fresh with that element.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <History size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <BarChart3 size={32} className="text-indigo-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs font-mono">Performance Breakthrough</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                      <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700 backdrop-blur-sm">
                          <span className="text-[10px] text-slate-500 block mb-1 uppercase font-black font-mono">Brute Force</span>
                          <div className="font-mono text-2xl font-black text-indigo-400">O(N²)</div>
                          <p className="text-[10px] text-slate-500 mt-2">Checking all pairs.</p>
                      </div>
                      <div className="p-5 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-500/20">
                          <span className="text-[10px] text-indigo-200 block mb-1 uppercase font-black font-mono">Kadane's</span>
                          <div className="font-mono text-2xl font-black">O(N)</div>
                          <p className="text-[10px] text-indigo-200 mt-2">One linear pass.</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed italic relative z-10">
                      "At N=100,000, O(N²) takes minutes. Kadane's takes 1 millisecond. This efficiency is why DP is the bedrock of professional algorithm design."
                    </p>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500 font-mono">
            <div className="space-y-6">
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                        <Trophy size={140} />
                    </div>
                    <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-amber-400 relative z-10 uppercase tracking-tight">
                        <Trophy size={24} /> Senior Interview Defense
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                        "For large-scale data processing common in Amazon's infrastructure, an O(N²) exhaustive search is computationally invalid. I implemented Kadane's Algorithm, which optimizes the search to linear O(N) time with constant O(1) space. The algorithm leverages the optimal substructure property of Dynamic Programming: the maximum subarray ending at index 'i' is either the element itself or the sum of that element and the maximum subarray ending at 'i-1'. This 'restart-or-extend' logic ensures absolute peak performance on datasets of any size."
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter">
                        <MessageSquare className="text-indigo-500" size={20} /> Candidate Q&A
                    </h3>
                    <div className="space-y-4">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-bold">"What if the array is all negatives?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                "My implementation initializes both <code>currentSum</code> and <code>maxSum</code> to <code>nums[0]</code>. In an all-negative array, the algorithm will correctly return the largest (least negative) single element, as any summation would only lead to a smaller total."
                            </p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-bold">"Can you return the subarray itself?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                "Yes. We would track the <code>start</code> and <code>end</code> indices. We update <code>start</code> whenever <code>currentSum</code> restarts, and update a global <code>bestStart</code> and <code>bestEnd</code> whenever <code>maxSum</code> is updated."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-[2rem] p-8 shadow-sm">
                    <h3 className="text-lg font-black text-indigo-900 mb-6 uppercase tracking-widest flex items-center gap-2 font-black">
                        <AlertCircle size={20}/> Leadership Strategy
                    </h3>
                    <ul className="space-y-8">
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">1</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight">Frugality</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1">Frame the O(1) space complexity as a key requirement for low-latency systems. Avoiding an O(N) DP table saves memory allocation costs.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">2</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight">Dive Deep</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1">Discuss the 'Divide and Conquer' approach if asked. While O(N log N), it shows technical breadth and understanding of tree-based partitioning.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                    <Calculator className="text-slate-400 mb-3" size={48} />
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest text-center mb-6 font-mono tracking-tighter">Bottleneck Comparison</p>
                    <div className="space-y-4 w-full">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase">Brute Force O(N²)</span>
                                <span className="text-rose-500 font-black tracking-tighter">O(N²) - Quadratic</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-400 w-full" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase">Kadane's O(N)</span>
                                <span className="text-indigo-500 font-black tracking-tighter">O(N) - Perfect Linear</span>
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|Math|max|length)\b|\b\d+\b)/g).filter(Boolean);
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
          if (['max', 'length'].includes(part)) return <span key={i} className="text-blue-400">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-rose-400 font-bold">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default MaximumSubarrayVisualizer;
