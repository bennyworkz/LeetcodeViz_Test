
import React, { useState, useMemo } from 'react';
// Added missing 'Info' and 'BarChart3' icons to the lucide-react imports
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, Check, Copy, AlignLeft, Zap, Trophy, MessageSquare, Target, AlertCircle, Cpu, Search, Scale, ArrowRight, ArrowLeft, Layers, Calculator, FileText, Hash, Thermometer, Info, BarChart3 } from 'lucide-react';

const APPROACHES = {
  optimal: {
    id: 'optimal',
    title: '1. Two-Pointer',
    subtitle: 'Optimal O(N²)',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N²) | Space: O(log N) for sort',
    code: `class Solution {
    public int threeSumClosest(int[] nums, int target) {
        Arrays.sort(nums);
        int closest = nums[0] + nums[1] + nums[2];
        
        for (int i = 0; i < nums.length - 2; i++) {
            int left = i + 1, right = nums.length - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (Math.abs(target - sum) < Math.abs(target - closest)) {
                    closest = sum;
                }
                if (sum < target) {
                    left++;
                } else if (sum > target) {
                    right--;
                } else {
                    return sum;
                }
            }
        }
        return closest;
    }
}`,
    explanation: "This is the gold standard solution. First, we sort the array to establish order. Then, we fix one number 'i' and use two pointers ('left' and 'right') to find the best pair for it. This reduces a cubic search to a quadratic one."
  },
  brute: {
    id: 'brute',
    title: '2. Brute Force',
    subtitle: 'O(N³) Exhaustive',
    icon: <AlertCircle size={16} />,
    complexity: 'Time: O(N³) | Space: O(1)',
    code: `class Solution {
    public int threeSumClosest(int[] nums, int target) {
        int closest = nums[0] + nums[1] + nums[2];
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                for (int k = j + 1; k < n; k++) {
                    int sum = nums[i] + nums[j] + nums[k];
                    if (Math.abs(target - sum) < Math.abs(target - closest)) {
                        closest = sum;
                    }
                }
            }
        }
        return closest;
    }
}`,
    explanation: "Checks every single possible triplet in the array. While intuitive, checking all O(N³) combinations leads to extreme performance degradation as the array size grows."
  }
};

const ThreeSumClosestVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproach, setSelectedApproach] = useState<keyof typeof APPROACHES>('optimal');
  const [numsInput, setNumsInput] = useState("-1,2,1,-4");
  const [targetInput, setTargetInput] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const nums = useMemo(() => {
    const arr = numsInput.split(',').map(n => parseInt(n.trim()) || 0);
    return selectedApproach === 'optimal' ? [...arr].sort((a, b) => a - b) : arr;
  }, [numsInput, selectedApproach]);

  const targetValue = parseInt(targetInput.toString()) || 0;

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = nums.length;

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ phase, description: desc, line, state: { ...state, nums: [...nums], target: targetValue } });
    };

    if (selectedApproach === 'optimal') {
      addStep("Sorting", "Establish numerical order. This allows us to use two pointers to converge on the target sum.", 3, { closest: null });
      
      let closest = nums[0] + nums[1] + nums[2];
      addStep("Initialization", `Initialize 'closest' with the sum of the first three elements: ${nums[0]} + ${nums[1]} + ${nums[2]} = ${closest}.`, 4, { closest });

      for (let i = 0; i < n - 2; i++) {
        addStep("Fix Pointer", `Outer loop: Fixing index i = ${i} (value: ${nums[i]}).`, 6, { i, closest });
        
        let left = i + 1, right = n - 1;
        addStep("Pointers Setup", `Initialize inner pointers: left = ${left}, right = ${right}.`, 7, { i, left, right, closest });

        while (left < right) {
          const sum = nums[i] + nums[left] + nums[right];
          const diff = Math.abs(targetValue - sum);
          const currentClosestDiff = Math.abs(targetValue - closest);
          const isBetter = diff < currentClosestDiff;

          addStep("Calculate Sum", `Testing triplet [${nums[i]}, ${nums[left]}, ${nums[right]}]. Sum = ${sum}. Diff from target (${targetValue}) is ${diff}.`, 9, { i, left, right, closest, currentSum: sum, currentDiff: diff });

          if (isBetter) {
            closest = sum;
            addStep("Update Closest", `New record! ${sum} is closer to ${targetValue} than ${steps[steps.length-2].state.closest}.`, 10, { i, left, right, closest, currentSum: sum, isBetter: true });
          }

          if (sum < targetValue) {
            addStep("Move Left", `Sum (${sum}) < Target (${targetValue}). Moving 'left' pointer to increase total sum.`, 13, { i, left, right, closest, currentSum: sum });
            left++;
          } else if (sum > targetValue) {
            addStep("Move Right", `Sum (${sum}) > Target (${targetValue}). Moving 'right' pointer to decrease total sum.`, 15, { i, left, right, closest, currentSum: sum });
            right--;
          } else {
            addStep("Perfect Match", `Exact match found! Sum (${sum}) == Target (${targetValue}). Returning immediately.`, 18, { i, left, right, closest: sum, currentSum: sum, finished: true });
            return steps;
          }
          
          if (left < right) {
             addStep("Loop Check", `Continue: left (${left}) is still < right (${right}).`, 8, { i, left, right, closest });
          }
        }
      }
      addStep("Return", `All possibilities explored. Final closest sum is ${closest}.`, 22, { closest, finished: true });

    } else {
      // Brute Force
      let closest = nums[0] + nums[1] + nums[2];
      addStep("Initialization", `Initialize 'closest' with first triplet: ${closest}.`, 3, { closest });

      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          for (let k = j + 1; k < n; k++) {
            const sum = nums[i] + nums[j] + nums[k];
            const isBetter = Math.abs(targetValue - sum) < Math.abs(targetValue - closest);
            
            addStep("Brute Check", `Checking Indices [${i}, ${j}, ${k}]: ${nums[i]} + ${nums[j]} + ${nums[k]} = ${sum}.`, 7, { i, j, k, currentSum: sum, closest });
            
            if (isBetter) {
              closest = sum;
              addStep("Update Closest", `Found closer sum: ${sum}.`, 8, { i, j, k, currentSum: sum, closest, isBetter: true });
            }
          }
        }
      }
      addStep("Return", `Finished checking all triplets. Result: ${closest}`, 13, { closest, finished: true });
    }

    return steps;
  }, [nums, targetValue, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const cur = trace[currentStep] || trace[0];
  const { i: ptrI, left: ptrL, right: ptrR, j: ptrJ, k: ptrK, closest, currentSum, isBetter, finished } = cur.state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full transition-colors duration-500">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center">
                <Target className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">3Sum Closest</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-widest font-black">Amazon Prep</span>
                <span>LC 16 • Medium</span>
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
                <h2 className="text-3xl font-black text-slate-900 mb-6">16. 3Sum Closest</h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-lg leading-relaxed">
                  <p>Given an integer array <code>nums</code> of length <code>n</code> and an integer <code>target</code>, find three integers in <code>nums</code> such that the sum is <strong>closest</strong> to <code>target</code>.</p>
                  <p>Return <em>the sum of the three integers.</em></p>
                  <p>You may assume that each input would have <strong>exactly one</strong> solution.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Hash size={16}/> Example 1:
                  </h3>
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 font-mono text-sm space-y-3 shadow-inner">
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter">Input:</span> nums = [-1,2,1,-4], target = 1</p>
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter">Output:</span> 2</p>
                    <p className="text-slate-500 italic text-xs leading-relaxed border-t border-slate-200 pt-3">
                      Explanation: The sum that is closest to the target is 2. (-1 + 2 + 1 = 2).
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Hash size={16}/> Example 2:
                  </h3>
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 font-mono text-sm space-y-2 shadow-inner">
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter">Input:</span> nums = [0,0,0], target = 1</p>
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter">Output:</span> 0</p>
                    <p className="text-slate-500 italic text-xs border-t border-slate-200 pt-2">Explanation: The sum that is closest to the target is 0. (0 + 0 + 0 = 0).</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <AlertCircle size={14} /> Constraints:
                </h3>
                <ul className="list-disc list-inside space-y-3 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">3 {'<='} nums.length {'<='} 500</code></li>
                  <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">-1000 {'<='} nums[i] {'<='} 1000</code></li>
                  <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">-10<sup>4</sup> {'<='} target {'<='} 10<sup>4</sup></code></li>
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
                    <span className="font-bold uppercase tracking-tight">ThreeSumClosest.java</span>
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
                    {/* Fixed: Info icon is now imported and correctly referenced */}
                    <Info size={18} />
                    <h4 className="text-sm font-black uppercase tracking-widest">Approach Note</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">{APPROACHES[selectedApproach].explanation}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black text-indigo-600 uppercase block pl-1 tracking-widest">Array Data (nums)</label>
                    <input value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-purple-600 uppercase block pl-1 tracking-widest">Target (k)</label>
                    {/* Fixed: Parsing input string to number to match state type */}
                    <input type="number" value={targetInput} onChange={(e) => { setTargetInput(parseInt(e.target.value) || 0); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-purple-500 outline-none shadow-inner" />
                  </div>
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

              <div className="bg-slate-900 text-white rounded-3xl p-7 shadow-2xl border border-slate-800 min-h-[160px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    <Search size={100}/>
                </div>
                <div className="flex items-center gap-2 mb-3">
                   <Target size={14} className="text-indigo-400"/>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Execution Thread</span>
                </div>
                <div className="text-lg font-black tracking-tight mb-2 flex items-center gap-3">
                    {isBetter && <span className="px-2 py-0.5 bg-green-500 text-[10px] rounded-full animate-pulse shadow-lg shadow-green-500/20 uppercase tracking-tighter">New Record!</span>}
                    {cur.phase}
                </div>
                <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3">{cur.description}</p>
              </div>

              {/* Simulation Arena */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[450px] relative flex flex-col justify-between overflow-hidden shadow-inner transition-all duration-500">
                
                {/* Stats Header */}
                <div className="w-full grid grid-cols-2 gap-4 z-10">
                   <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex flex-col items-center justify-center shadow-sm relative overflow-hidden group">
                      <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Closest Sum</span>
                      <div className={`text-4xl font-black tabular-nums transition-all duration-500 ${isBetter ? 'text-green-600 scale-110' : 'text-indigo-600'}`}>
                          {closest ?? '???'}
                      </div>
                      {closest !== null && (
                         <div className="text-[9px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                            <Thermometer size={10}/> Distance: {Math.abs(targetValue - closest)}
                         </div>
                      )}
                   </div>
                   <div className="bg-indigo-50/50 rounded-3xl p-5 border border-indigo-100 flex flex-col items-center justify-center shadow-sm">
                      <span className="text-[9px] font-black text-indigo-400 uppercase mb-1 tracking-widest">Current Sum</span>
                      <div className={`text-4xl font-black tabular-nums transition-all duration-500 ${currentSum === targetValue ? 'text-green-500 scale-110' : 'text-slate-800'}`}>
                          {currentSum ?? '---'}
                      </div>
                      {currentSum !== undefined && (
                        <div className="text-[9px] font-bold text-indigo-400 mt-1 uppercase tracking-tighter">
                          i:{ptrI} + L:{ptrL} + R:{ptrR}
                        </div>
                      )}
                   </div>
                </div>

                {/* Array Visualization */}
                <div className="flex items-end justify-center gap-2.5 h-[220px] w-full px-5 relative z-10 border-b-4 border-slate-900 pb-2">
                  {nums.map((num, idx) => {
                    const isFix = ptrI === idx;
                    const isLeft = ptrL === idx;
                    const isRight = ptrR === idx;
                    const isBruteJ = ptrJ === idx;
                    const isBruteK = ptrK === idx;
                    const isActive = isFix || isLeft || isRight || isBruteJ || isBruteK;
                    
                    // Normalize bar height based on absolute values for visualization
                    const maxPossible = Math.max(...nums.map(Math.abs), 1);
                    const barHeight = (Math.abs(num) / maxPossible) * 100;
                    const isNegative = num < 0;

                    return (
                      <div key={idx} className="flex-1 h-full flex flex-col justify-end items-center relative group">
                        {/* Pointer Tags */}
                        {!finished && isActive && (
                           <div className={`absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-20`}>
                             <div className={`px-2 py-0.5 rounded-full text-[9px] font-black text-white shadow-xl mb-1 uppercase tracking-tighter ${isFix ? 'bg-indigo-600' : isLeft || isBruteJ ? 'bg-blue-500' : 'bg-purple-600'}`}>
                                {isFix ? 'Fixed' : isLeft || isBruteJ ? 'Left' : 'Right'}
                             </div>
                             <div className={`w-0.5 h-3 ${isFix ? 'bg-indigo-600' : isLeft || isBruteJ ? 'bg-blue-500' : 'bg-purple-600'}`}></div>
                           </div>
                        )}

                        {/* Bar Segment */}
                        <div 
                          className={`w-full transition-all duration-500 rounded-t-xl z-10 relative 
                            ${isActive ? 'bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] scale-x-110 ring-2 ring-indigo-400 ring-offset-2' : 'bg-slate-200'}
                            ${isBetter && isActive ? 'bg-green-500 ring-green-400' : ''}
                          `} 
                          style={{ height: `${barHeight}%` }}
                        >
                          {/* Sign indicator */}
                          {isNegative && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                            </div>
                          )}
                          
                          {/* Value on Hover */}
                          <div className={`absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black font-mono transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
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
                    <div className="bg-white border-2 border-indigo-100 px-12 py-10 rounded-[3.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] flex flex-col items-center gap-6 transform -rotate-1 hover:rotate-0 transition-transform">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-xl mb-2">
                          <Check size={48} strokeWidth={3}/>
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] block mb-2">Final Closest Sum</span>
                        <div className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums drop-shadow-sm">{closest}</div>
                        <div className="mt-4 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                           Goal: {targetValue}
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
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight flex items-center gap-3">
                <BookOpen className="text-indigo-600"/> The Mechanics of "Closest Search"
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed max-w-4xl">
                This problem is a variation of the classic "3Sum" problem. While 3Sum looks for an exact target (usually 0), <strong>3Sum Closest</strong> requires us to minimize the absolute difference between our running sum and a target value.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-3 shadow-sm">
                        <h3 className="font-black text-indigo-900 flex items-center gap-2 uppercase tracking-tighter text-sm"><Scale size={18}/> The Sorting Prerequisite</h3>
                        <p className="text-sm text-indigo-800 leading-relaxed font-mono bg-white/50 p-4 rounded-2xl border border-indigo-100 italic">
                          "Sorting is the bridge from O(N³) to O(N²)."
                        </p>
                        <p className="text-xs text-indigo-700 leading-relaxed">
                          By sorting the array, we create a <strong>directional relationship</strong> between the indices and the sums. If the sum is too small, moving the left pointer up <i>guarantees</i> a larger sum. If too large, moving the right pointer down <i>guarantees</i> a smaller one.
                        </p>
                    </div>
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-3 shadow-sm">
                        <h3 className="font-black text-slate-900 flex items-center gap-2 uppercase tracking-tighter text-sm"><Target size={18}/> Optimization Logic</h3>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          We iterate through the array once, fixing one element at a time (pointer <code>i</code>). For each <code>i</code>, we find the two other elements using two-pointer search on the remaining sorted sub-array.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Calculator size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      {/* Fixed: BarChart3 is now correctly referenced */}
                      <BarChart3 size={32} className="text-indigo-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Asymptotic Performance</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                      <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700 backdrop-blur-sm">
                          <span className="text-[10px] text-slate-500 block mb-1 uppercase font-black">Time Complexity</span>
                          <div className="font-mono text-2xl font-black text-indigo-400">O(N²)</div>
                          <p className="text-[10px] text-slate-500 mt-2">N log N (Sort) + N*N (Double Loop)</p>
                      </div>
                      <div className="p-5 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-500/20">
                          <span className="text-[10px] text-indigo-200 block mb-1 uppercase font-black">Space Complexity</span>
                          <div className="font-mono text-2xl font-black">O(log N)</div>
                          <p className="text-[10px] text-indigo-200 mt-2">Due to recursive sorting overhead.</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed italic relative z-10">
                      "While O(N²) is not as fast as linear time, it is significantly better than O(N³) brute force, allowing the solution to pass on arrays up to thousands of elements."
                    </p>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <div className="space-y-6">
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                        <Trophy size={140} />
                    </div>
                    <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-amber-400 relative z-10 uppercase tracking-tight">
                        <Trophy size={24} /> Senior Interview Defense
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                        "For Amazon systems where data volume and precision are paramount, I opted for an O(N²) two-pointer approach. Brute force is O(N³), which is unsustainable for the provided constraints (N=500). By sorting the array first, we establish monotonicity, allowing us to 'greedily' decide which pointer to adjust based on the current sum's relation to the target. This ensures we explore only the most promising triplets while maintaining a minimal memory footprint."
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter">
                        <MessageSquare className="text-indigo-500" size={20} /> Technical Q&A
                    </h3>
                    <div className="space-y-4">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter">"What if there are duplicate values in nums?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                "The algorithm handles duplicates naturally. However, as an optimization, we could skip identical values for pointer 'i' or pointers 'left/right' after finding a sum. While not required for 3Sum Closest (unlike 3Sum), it would prune unnecessary iterations and improve real-world performance."
                            </p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter">"Can we do better than O(N²)?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                "In a general sense, no. 3Sum and its variations are known to be 'sub-quadratic hard'. While there are complex optimizations for specific ranges of values, for standard integers and constraints, O(N²) is the expected optimal solution in most technical interviews."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-[2rem] p-8 shadow-sm">
                    <h3 className="text-lg font-black text-indigo-900 mb-6 uppercase tracking-widest flex items-center gap-2">
                        <AlertCircle size={20}/> Amazon Leadership Check
                    </h3>
                    <ul className="space-y-8">
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm">1</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight">Dive Deep</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1">Be ready to explain the `Math.abs` logic. We minimize `abs(target - sum)`, not just the raw sum. This demonstrates attention to detail in mathematical constraints.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm">2</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight">Bias for Action</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1">If you identify an exact match (sum == target), return immediately. This optimization is a senior-level 'early-out' that saves cycles on successful searches.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm">3</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight">Ownership</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1">Address the sorting overhead. Mention that while it takes O(N log N), it's negligible compared to the O(N²) main logic, showing you understand bottlenecks.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                    {/* Fixed: BarChart3 is now correctly referenced */}
                    <BarChart3 className="text-slate-400 mb-3" size={48} />
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest text-center mb-6">Benchmark: N = 500</p>
                    <div className="space-y-4 w-full">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase">Brute Force O(N³)</span>
                                <span className="text-rose-500 font-black">~125M Operations</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-400 w-full" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase">Two-Pointer O(N²)</span>
                                <span className="text-indigo-500 font-black">~250K Operations</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-[1%]" />
                            </div>
                        </div>
                    </div>
                    <p className="mt-6 text-[10px] text-slate-400 text-center leading-relaxed">
                        The optimized approach is <span className="text-indigo-600 font-black">500x faster</span> on standard constraints, making it the only viable choice for high-availability systems.
                    </p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|Math|max|min|abs|sort|Arrays|length)\b|\b\d+\b)/g).filter(Boolean);
  return (
    <div className={`flex relative z-10 min-h-[20.8px] transition-colors duration-300 ${active ? 'bg-indigo-500/10' : ''}`}>
      <span className="w-10 text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 font-mono text-[11px] select-none shrink-0">{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean', 'void'].includes(part)) return <span key={i} className="text-sky-400">{part}</span>;
          if (['Arrays', 'Math', 'String'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['abs', 'sort', 'max', 'min', 'length'].includes(part)) return <span key={i} className="text-blue-400">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-rose-400">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default ThreeSumClosestVisualizer;
