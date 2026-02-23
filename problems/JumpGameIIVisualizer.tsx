import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, ArrowRight, 
  ArrowDown, X, Timer, ShieldAlert, Database, 
  FastForward, TrendingUp, Maximize, MapPin, Hash, Zap
} from 'lucide-react';

const APPROACHES = {
  greedy: {
    id: 'greedy',
    title: '1. Greedy (Optimal)',
    subtitle: 'Track jump windows. O(N) Time, O(1) Space.',
    icon: <FastForward size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int jump(int[] nums) {
        int jumps = 0;
        int currentEnd = 0;
        int farthest = 0;
        
        for (int i = 0; i < nums.length - 1; i++) {
            farthest = Math.max(farthest, i + nums[i]);
            
            if (i == currentEnd) {
                jumps++;
                currentEnd = farthest;
            }
        }
        
        return jumps;
    }
}`,
    explanation: "The optimal Greedy approach. Instead of checking every possible path, we think in 'levels' or 'windows'. We maintain a window of indices we can currently reach (`currentEnd`). As we iterate through this window, we constantly track the absolute `farthest` index we could reach if we made a jump from any of these cells. Once we hit the end of our current window (`i == currentEnd`), we are forced to jump. We increment our jump count, and our new window officially extends out to the `farthest` index we found."
  },
  dp: {
    id: 'dp',
    title: '2. Dynamic Programming',
    subtitle: 'Calculate min jumps per cell. O(N²) Time.',
    icon: <Database size={16} />,
    complexity: 'Time: O(N²) | Space: O(N)',
    code: `class Solution {
    public int jump(int[] nums) {
        int n = nums.length;
        int[] dp = new int[n];
        
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (j + nums[j] >= i) {
                    if (dp[j] != Integer.MAX_VALUE) {
                        dp[i] = Math.min(dp[i], dp[j] + 1);
                    }
                }
            }
        }
        
        return dp[n - 1];
    }
}`,
    explanation: "The standard DP approach. We use an array `dp` where `dp[i]` represents the minimum number of jumps required to reach index `i`. For every cell `i`, we look back at all previous cells `j`. If cell `j` has enough jump power to reach `i` (`j + nums[j] >= i`), we update `dp[i]` to be the minimum of its current value or `dp[j] + 1` (the jumps to get to `j`, plus one jump to reach `i`). This is robust but slow (O(N²))."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">45. Jump Game II</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          You are given a <strong>0-indexed</strong> array of integers <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono font-bold">nums</code> of length <code className="font-mono">n</code>. You are initially positioned at <code>nums[0]</code>.
        </p>

        <p className="text-lg leading-relaxed">
          Each element <code>nums[i]</code> represents the maximum length of a forward jump from index <code>i</code>. In other words, if you are at <code>nums[i]</code>, you can jump to any <code>nums[i + j]</code> where:
        </p>
        
        <ul className="list-disc pl-6 space-y-2 text-slate-800 marker:text-indigo-500 font-medium">
            <li><code>0 &lt;= j &lt;= nums[i]</code></li>
            <li><code>i + j &lt; n</code></li>
        </ul>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-indigo-500 pl-4 bg-indigo-50 py-2 mt-4">
          Return <em>the <strong>minimum</strong> number of jumps to reach</em> <code>nums[n - 1]</code>. The test cases are generated such that you can always reach <code>nums[n - 1]</code>.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                 {[2,3,1,1,4].map((num, idx) => {
                     let highlight = '';
                     if (idx === 0 || idx === 1 || idx === 4) highlight = 'bg-indigo-100 border-indigo-400 text-indigo-800';
                     else highlight = 'bg-white border-slate-200 text-slate-600';
                     return (
                        <div key={idx} className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 font-bold ${highlight}`}>
                            {num}
                        </div>
                     )
                 })}
              </div>
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [2,3,1,1,4]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 2</p>
              <p className="text-slate-500 text-xs mt-2 border-t border-slate-200 pt-2"><span className="text-slate-400 font-bold">Explanation:</span> The minimum number of jumps to reach the last index is 2. Jump 1 step from index 0 to 1, then 3 steps to the last index.</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [2,3,0,1,4]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const JumpGameIIVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState<keyof typeof APPROACHES>('greedy');
  const [numsInput, setNumsInput] = useState('2, 3, 1, 1, 4');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedNums = useMemo(() => {
    let arr = numsInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 0);
    if (arr.length === 0) return [2, 3, 1, 1, 4];
    return arr;
  }, [numsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const nums = parsedNums;
    const n = nums.length;
    
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      if (steps.length > 500) return;
      steps.push({
        phase,
        description: desc,
        line,
        state: { nums, n, ...state }
      });
    };

    if (n <= 1) {
        addStep("Trivial Case", `Array length is ${n}. We are already at the last index. Jumps = 0.`, 2, { jumps: 0, isSuccess: true, finalAns: 0 });
        return steps;
    }

    if (selectedApproachId === 'greedy') {
        let jumps = 0, currentEnd = 0, farthest = 0;
        let windowStart = 0;
        
        addStep("Initialization", `Set jumps = 0, currentEnd = 0, farthest = 0. We start at index 0.`, 4, { jumps, currentEnd, farthest, i: null, windowStart });

        for (let i = 0; i < n - 1; i++) {
            addStep("Loop Condition", `Checking if i (${i}) < nums.length - 1 (${n - 1}). True, entering loop.`, 7, { jumps, currentEnd, farthest, i, windowStart });
            
            let reach = i + nums[i];
            addStep("Evaluate Reach", `From index ${i} (value ${nums[i]}), we can reach up to index ${i} + ${nums[i]} = ${reach}.`, 8, { jumps, currentEnd, farthest, i, windowStart, calculatingReach: reach });
            
            if (reach > farthest) {
                farthest = reach;
                addStep("Update Farthest", `This reach (${reach}) is better than our previous best (${farthest}). Update farthest = ${farthest}.`, 8, { jumps, currentEnd, farthest, i, windowStart });
            } else {
                addStep("Farthest Unchanged", `Reach (${reach}) is not better than our current best (${farthest}). Farthest remains unchanged.`, 8, { jumps, currentEnd, farthest, i, windowStart });
            }
            
            addStep("Check Window Boundary", `Have we reached the end of our current jump window? Is i (${i}) == currentEnd (${currentEnd})?`, 10, { jumps, currentEnd, farthest, i, windowStart, checkingWindow: true });
            
            if (i === currentEnd) {
                jumps++;
                addStep("Increment Jumps", `True! We explored the entire current window. We MUST make a jump now to proceed. jumps = ${jumps}.`, 11, { jumps, currentEnd, farthest, i, windowStart, jumping: true });
                
                windowStart = currentEnd + 1; // Purely for visualizer UI
                currentEnd = farthest;
                addStep("Update Window", `Our new jump window extends to the best reach we found: currentEnd = ${currentEnd}.`, 12, { jumps, currentEnd, farthest, i, windowStart });
            } else {
                addStep("Continue in Window", `False. We are still exploring the current window. Continue to the next cell.`, 10, { jumps, currentEnd, farthest, i, windowStart });
            }
        }
        
        addStep("Loop Terminates", `Checking if i (${n-1}) < nums.length - 1 (${n-1}). False, loop terminates. We have enough power to reach the end.`, 7, { jumps, currentEnd, farthest, i: n-1, windowStart });
        addStep("Return Result", `Algorithm finished. Minimum jumps required: ${jumps}.`, 16, { jumps, currentEnd, farthest, i: n-1, windowStart, isSuccess: true, finalAns: jumps });
        
    } 
    else if (selectedApproachId === 'dp') {
        let dp = new Array(n).fill(Number.MAX_SAFE_INTEGER);
        addStep("Initialize DP", `Create dp array of size ${n}. Fill with Infinity (max value) since we haven't found paths yet.`, 5, { dp: [...dp], i: null, j: null });
        
        dp[0] = 0;
        addStep("Base Case", `Set dp[0] = 0. It takes 0 jumps to reach the starting index.`, 6, { dp: [...dp], i: null, j: null });

        for (let i = 1; i < n; i++) {
            addStep("Outer Loop", `Evaluating target cell i = ${i}. We need to find the minimum jumps to reach here.`, 8, { dp: [...dp], i, j: null });
            
            for (let j = 0; j < i; j++) {
                addStep("Inner Loop", `Checking if we can reach target cell i=${i} from previous cell j=${j}.`, 9, { dp: [...dp], i, j });
                
                let reach = j + nums[j];
                addStep("Check Reach Limit", `Cell j=${j} has value ${nums[j]}. Max reach is ${j} + ${nums[j]} = ${reach}. Is reach (${reach}) >= target i (${i})?`, 10, { dp: [...dp], i, j, reach, checkingReach: true });
                
                if (reach >= i) {
                    if (dp[j] !== Number.MAX_SAFE_INTEGER) {
                        let newVal = dp[j] + 1;
                        let prevVal = dp[i];
                        
                        addStep("Evaluate Cost", `True! Cell ${j} CAN reach cell ${i}. The cost is jumps to ${j} (${dp[j]}) + 1 = ${newVal}.`, 12, { dp: [...dp], i, j, reach, prevVal, checkingMin: true });
                        
                        if (newVal < dp[i]) {
                            dp[i] = newVal;
                            addStep("Update DP", `This cost (${newVal}) is strictly better than the current known cost (${prevVal === Number.MAX_SAFE_INTEGER ? 'Infinity' : prevVal}). Update dp[${i}] = ${newVal}.`, 12, { dp: [...dp], i, j, reach, updating: true, prevVal });
                        } else {
                            addStep("Skip Update", `This cost (${newVal}) is NOT better than the current known cost (${prevVal}). Skip.`, 12, { dp: [...dp], i, j, reach, prevVal });
                        }
                    } else {
                         addStep("Skip Unreachable", `Cell j=${j} cannot even be reached yet (dp[j] is Infinity). Skip.`, 11, { dp: [...dp], i, j, reach });
                    }
                } else {
                    addStep("Cannot Reach", `False. Cell j=${j} cannot reach target cell i=${i}.`, 10, { dp: [...dp], i, j, reach });
                }
            }
        }
        
        addStep("Loops Terminate", `Calculated DP values for all cells. Target is the last cell.`, 8, { dp: [...dp], i: n, j: null });
        addStep("Return Result", `Return dp[n - 1] -> dp[${n-1}] = ${dp[n-1]}.`, 18, { dp: [...dp], i: n, j: null, isSuccess: true, finalAns: dp[n-1] });
    }

    if (steps.length === 0) {
        addStep("Init", "Start", 1, {});
    }

    return steps;
  }, [parsedNums, selectedApproachId]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedApproach.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0] || { state: {} };
  const state = cur.state || { nums: parsedNums };
  const { isSuccess, nums, n, finalAns, jumps, currentEnd, farthest, windowStart, calculatingReach, jumping, checkingWindow, dp, i, j, reach, checkingReach, checkingMin, updating, prevVal } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center">
                <TrendingUp className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Jump Game II</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 45</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Greedy / DP</span>
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
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                                    <span>{time}</span>
                                    <span>{space}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="bg-[#0f172a] rounded-3xl h-[460px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={14} className="text-indigo-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {/* Highlighter Bar */}
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : jumping || updating ? 'bg-amber-500/15 border-amber-500' : 'bg-indigo-500/20 border-indigo-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="indigo" />
                      ))}
                  </div>
                </div>

                {/* Left Side Variables */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-indigo-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Current Variables</h4>
                      </div>
                    </div>
                    
                    {selectedApproachId === 'greedy' ? (
                        <div className="grid grid-cols-2 gap-3">
                            <VariableCard label="Index (i)" val={i ?? null} arrVal={i !== null && i !== undefined && i < n ? nums[i] : null} color="sky" active={i !== undefined && i !== null} />
                            <VariableCard label="Total Jumps" val={jumps ?? null} color="emerald" active={jumps !== null && jumps !== undefined} />
                            <VariableCard label="Current End" val={currentEnd ?? null} color="violet" active={currentEnd !== undefined && currentEnd !== null} />
                            <VariableCard label="Farthest Reach" val={farthest ?? null} color="amber" active={farthest !== undefined && farthest !== null} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <VariableCard label="Target (i)" val={i ?? null} arrVal={i !== null && i !== undefined && i < n ? nums[i] : null} color="sky" active={i !== undefined && i !== null} />
                            <VariableCard label="Check (j)" val={j ?? null} arrVal={j !== null && j !== undefined && j < n ? nums[j] : null} color="violet" active={j !== null && j !== undefined} />
                            <div className="col-span-2">
                                <VariableCard label={`Reach from j`} val={reach ?? null} color="amber" active={reach !== null && reach !== undefined} />
                            </div>
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Simulation Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-indigo-600 uppercase block pl-1 tracking-widest font-mono">Array (comma separated)</label>
                        <input type="text" value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" placeholder="2, 3, 1, 1, 4" />
                    </div>

                    <div className="hidden xl:flex gap-2">
                       <button onClick={() => {setNumsInput('2, 3, 1, 1, 4'); setCurrentStep(0);}} className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors shadow-sm">Ex 1</button>
                       <button onClick={() => {setNumsInput('2, 1, 1, 1, 1'); setCurrentStep(0);}} className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors shadow-sm">Slow</button>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Action Log / Status */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : jumping || updating ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : jumping || updating ? <Zap size={100}/> : <MapPin size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : jumping || updating ? "text-amber-400" : "text-indigo-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : jumping || updating ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line">{cur.description}</p>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[420px]">
                   
                   <div className="flex flex-col items-center w-full relative z-10 pt-4 h-full">
                      
                      {/* Jump Window Visualizations (Greedy) */}
                      {selectedApproachId === 'greedy' && !isSuccess && windowStart !== undefined && currentEnd !== undefined && (
                          <div className="w-full relative h-6 mb-6 flex px-4">
                              {/* Current Window Arc */}
                              <div 
                                  className="absolute h-2 bg-indigo-500/20 border-t-2 border-indigo-500 rounded-t-xl transition-all duration-500 top-2"
                                  style={{
                                      left: `calc(1rem + ${windowStart * (100 / n)}% + ${(windowStart * 2)}px)`,
                                      width: `calc(${(Math.max(0, currentEnd - windowStart)) * (100 / n)}% + ${(Math.max(0, currentEnd - windowStart) * 2)}px + 3rem)`,
                                      maxWidth: `calc(100% - 2rem)`
                                  }}
                              >
                                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 rounded-full border border-indigo-200 shadow-sm whitespace-nowrap">
                                      Current Window
                                  </div>
                              </div>
                              
                              {/* Next Window Reach (Farthest) */}
                              {farthest > currentEnd && (
                                  <div 
                                      className="absolute h-2 bg-amber-500/10 border-t-2 border-amber-400 border-dashed rounded-t-xl transition-all duration-500 top-2"
                                      style={{
                                          left: `calc(1rem + ${currentEnd * (100 / n)}% + ${(currentEnd * 2)}px + 1.5rem)`,
                                          width: `calc(${(Math.max(0, farthest - currentEnd)) * (100 / n)}% + ${(Math.max(0, farthest - currentEnd) * 2)}px + 1.5rem)`,
                                          maxWidth: `calc(100% - 2rem)`
                                      }}
                                  >
                                      <div className="absolute -top-6 right-0 text-[10px] font-black text-amber-600 bg-amber-50 px-2 rounded-full border border-amber-200 shadow-sm whitespace-nowrap">
                                          Next Reach
                                      </div>
                                  </div>
                              )}
                          </div>
                      )}

                      {/* Arrays Display */}
                      <div className="w-full overflow-x-auto pb-4 pt-8">
                          <div className="flex gap-2 relative w-max mx-auto px-4">
                              {nums.map((v: number, idx: number) => {
                                  
                                  let bgClass = "bg-white";
                                  let borderClass = "border-slate-200";
                                  let textClass = "text-slate-800";
                                  let topPointer = null;
                                  let bottomBadge = null;
                                  let zIndex = "z-0";

                                  // Approach 1: Greedy
                                  if (selectedApproachId === 'greedy') {
                                      const inWindow = idx >= (windowStart || 0) && idx <= (currentEnd !== null ? currentEnd : -1);
                                      const isFarthest = idx === farthest && !isSuccess;
                                      
                                      if (inWindow) {
                                          bgClass = "bg-indigo-50";
                                          borderClass = "border-indigo-300";
                                      } else if (idx < (windowStart || 0)) {
                                          bgClass = "bg-slate-50 opacity-40"; // Processed
                                      }

                                      if (isFarthest && !inWindow) {
                                          borderClass = "border-amber-400 border-dashed";
                                          bgClass = "bg-amber-50/50";
                                      }

                                      if (idx === i) {
                                          bgClass = jumping ? "bg-amber-100 scale-110 shadow-lg" : "bg-sky-100 scale-110 shadow-md";
                                          borderClass = jumping ? "border-amber-500" : "border-sky-400";
                                          textClass = jumping ? "text-amber-800" : "text-sky-800";
                                          topPointer = { label: "i", color: jumping ? "text-amber-600" : "text-sky-600", bounce: true };
                                          zIndex = "z-20";
                                      }
                                      
                                      if (idx === currentEnd && !isSuccess) {
                                          bottomBadge = { label: "curEnd", bg: "bg-indigo-100 text-indigo-700 border-indigo-300" };
                                      }
                                      
                                      if (idx === farthest && !isSuccess) {
                                          bottomBadge = { label: "maxReach", bg: "bg-amber-100 text-amber-700 border-amber-300" };
                                      }
                                      
                                      if (calculatingReach !== undefined && idx === calculatingReach) {
                                          bgClass = "bg-emerald-50 scale-105 shadow-sm";
                                          borderClass = "border-emerald-400 border-dashed";
                                      }
                                      
                                      if (checkingWindow && idx === currentEnd && idx === i) {
                                          borderClass = "border-rose-400 border-dashed"; // Alert looking check
                                      }
                                  } 
                                  // Approach 2: DP
                                  else {
                                      if (idx === i) {
                                          bgClass = "bg-sky-100 scale-110 shadow-md";
                                          borderClass = "border-sky-400";
                                          textClass = "text-sky-800";
                                          topPointer = { label: "i", color: "text-sky-600", bounce: false };
                                          zIndex = "z-20";
                                      }
                                      if (idx === j) {
                                          bgClass = "bg-violet-100 scale-110 shadow-md";
                                          borderClass = "border-violet-400";
                                          topPointer = { label: "j", color: "text-violet-600", bounce: true };
                                          zIndex = "z-20";
                                      }
                                      if (checkingReach && idx === reach) {
                                          borderClass = "border-amber-400 border-dashed";
                                          bgClass = "bg-amber-50/50";
                                      }
                                  }

                                  if (isSuccess) {
                                      bgClass = "bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm";
                                      borderClass = "border-emerald-300";
                                      topPointer = null;
                                      bottomBadge = null;
                                  }

                                  return (
                                      <div key={`${idx}-${v}`} className={`flex flex-col items-center relative transition-all duration-300 mb-10 ${zIndex}`}>
                                          {/* Top Pointer */}
                                          <div className="absolute -top-10 flex flex-col items-center justify-end h-8 w-full gap-1">
                                              {topPointer && (
                                                  <div className={`flex flex-col items-center ${topPointer.bounce ? 'animate-bounce' : ''}`}>
                                                      <span className={`text-[9px] font-black font-mono tracking-widest ${topPointer.color} bg-white px-1 rounded`}>{topPointer.label}</span>
                                                      <ArrowDown size={14} className={topPointer.color} strokeWidth={3}/>
                                                  </div>
                                              )}
                                          </div>

                                          {/* Main Box */}
                                          <div className={`w-12 h-16 md:w-16 md:h-20 border-2 rounded-2xl flex flex-col items-center justify-center font-mono font-black text-2xl transition-all duration-300 ${bgClass} ${borderClass} ${textClass}`}>
                                              <span>{v}</span>
                                          </div>
                                          
                                          {/* Bottom Details */}
                                          <div className="absolute -bottom-10 flex flex-col items-center justify-start w-full gap-1">
                                              <span className="text-[10px] font-mono font-bold text-slate-400">idx:{idx}</span>
                                              {bottomBadge && (
                                                  <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${bottomBadge.bg}`}>
                                                      {bottomBadge.label}
                                                  </span>
                                              )}
                                          </div>
                                      </div>
                                  );
                              })}
                          </div>
                      </div>

                      {/* DP Array View */}
                      {selectedApproachId === 'dp' && dp && (
                          <div className="w-full max-w-lg mt-auto bg-slate-100 border border-slate-200 rounded-3xl p-6 shadow-inner flex flex-col items-center">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono mb-4 flex items-center gap-2"><Database size={14}/> DP Array (Min Jumps)</span>
                              <div className="flex gap-1 sm:gap-2 justify-center w-full">
                                  {dp.map((dval: number, idx: number) => {
                                      const isInf = dval === Number.MAX_SAFE_INTEGER;
                                      
                                      let dpBg = "bg-white border-slate-200 text-slate-500";
                                      if (idx === i) dpBg = "bg-sky-50 border-sky-300 text-sky-700 shadow-sm";
                                      if (idx === j) dpBg = "bg-violet-50 border-violet-300 text-violet-700 shadow-sm";
                                      if (updating && idx === i) dpBg = "bg-emerald-400 border-emerald-500 text-white scale-110 shadow-lg animate-in zoom-in";

                                      return (
                                          <div key={`dp-${idx}`} className="flex flex-col items-center gap-1">
                                              <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border-2 rounded-lg font-mono font-black text-xs sm:text-sm transition-all duration-300 ${dpBg}`}>
                                                  {isInf ? '∞' : dval}
                                              </div>
                                              <span className="text-[8px] font-mono text-slate-400">i:{idx}</span>
                                          </div>
                                      )
                                  })}
                              </div>
                          </div>
                      )}
                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-emerald-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-emerald-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">REACHED END</span>
                              <span className="text-xs font-black uppercase text-emerald-600 tracking-widest font-mono mb-4 block">Minimum jumps calculated</span>
                              
                              <div className="bg-slate-50 border border-slate-200 px-8 py-3 rounded-2xl shadow-inner mt-2 flex flex-col items-center">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Final Output</span>
                                  <div className="flex gap-1 text-5xl font-mono font-black tracking-widest text-emerald-600 drop-shadow-sm">
                                      {finalAns}
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
                <FastForward className="text-indigo-600"/> The Greedy BFS Window
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-indigo-100 pl-6">
                The optimal O(N) approach is technically an implicit <strong>Breadth-First Search (BFS)</strong>. Instead of maintaining a queue, we use two variables, <code>currentEnd</code> and <code>farthest</code>, to represent the "levels" of the BFS tree.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Layers size={18}/> Level-by-Level Jumps
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            Think of <code>currentEnd</code> as the boundary of the current "jump level". 
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-3 rounded-lg border border-sky-200">
                            If we are at Level 1, we can reach a certain set of indices. By evaluating every single index in Level 1, we figure out the absolute maximum <code>farthest</code> index we could reach if we took one more step (Level 2).
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Zap size={18}/> When do we actually jump?
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            We don't commit to a specific path immediately. We just explore everything within our current jump range.
                        </p>
                        <p className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-3 rounded-lg border border-amber-200">
                            We only physically increment the <code>jumps</code> counter when our loop index <code>i</code> finally hits the <code>currentEnd</code> boundary. At that moment, we have no choice but to take a jump to proceed, and we proudly set our new boundary to the <code>farthest</code> we discovered!
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <TrendingUp size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-indigo-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Visualizing the Loop</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed">
                        <p>
                           Why does the loop stop at <code>nums.length - 1</code> instead of checking the last element?
                        </p>
                        <div className="bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 p-4 rounded-xl mt-4 font-mono text-[10px]">
                           for (int i = 0; i {'<'} nums.length - 1; i++) &#123;<br/>
                           &nbsp;&nbsp;&nbsp;&nbsp;...<br/>
                           &#125;
                        </div>
                        <p className="text-indigo-400 font-bold mt-2">
                            Because if we are already sitting on the last index, we don't need to jump anywhere! The goal is just to *reach* the last index. If we included the last index in the loop, and it happened to be exactly on a <code>currentEnd</code> boundary, we would incorrectly increment <code>jumps</code> one extra time!
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
                        "While Dynamic Programming correctly solves this by calculating the minimum jumps to each state in O(N²), the Greedy approach reduces this to strictly O(N) time and O(1) space. I implemented an implicit BFS by maintaining a 'current window' of reachable indices. By iterating through the array, I continuously track the absolute farthest reach possible. I only increment the jump counter when I reach the end of the current window, at which point the window expands to the farthest known reach."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: What if it's impossible?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                The problem explicitly guarantees that "you can always reach the last index." If that guarantee wasn't there, you would need to add a check: if <code>i == currentEnd</code> and <code>farthest &lt;= i</code>, it means you are stuck and cannot progress any further, so you would return an error or -1.
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
                                <p className="text-[10px] text-slate-500 mt-1">We loop through the array exactly once. At each step, we just do a simple Math.max calculation.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We only use three primitive integer variables (`jumps`, `currentEnd`, `farthest`), avoiding the O(N) array overhead of DP.</p>
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean, theme?: 'cyan' | 'violet' | 'rose' | 'emerald' | 'amber' | 'indigo' | 'fuchsia' | 'teal' | 'blue' }> = ({ num, code, active, theme = 'indigo' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|char|List|Integer|Set|HashSet|Math|Arrays)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math', 'Arrays'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-yellow-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default JumpGameIIVisualizer;