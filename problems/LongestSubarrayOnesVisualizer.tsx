import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, Check, Copy, AlignLeft, Zap, Trophy, MessageSquare, Target, AlertCircle, Cpu, Minus, Plus, Search, Expand, Trash2, History, Layers, Calculator } from 'lucide-react';

const APPROACHES = {
  brute: {
    id: 'brute',
    title: '1. Brute Force',
    subtitle: 'Check All Subarrays',
    icon: <Search size={16} />,
    complexity: 'Time: O(N²) | Space: O(1)',
    code: `class Solution {
    public int longestSubarray(int[] nums) {
        int n = nums.length;
        int max = 0;
        for (int i = 0; i < n; i++) {
            int zeros = 0;
            for (int j = i; j < n; j++) {
                if (nums[j] == 0) zeros++;
                if (zeros <= 1) {
                    // Length of window minus the one deletion
                    max = Math.max(max, j - i);
                } else {
                    break;
                }
            }
        }
        return max;
    }
}`,
    explanation: "The exhaustive approach: for every possible starting position, we scan forward and keep track of how many zeros we encounter. If we hit more than one zero, that subarray is invalid. We calculate the length of every valid subarray (minus one for the deletion) and keep the maximum."
  },
  optimal: {
    id: 'optimal',
    title: '2. Sliding Window',
    subtitle: 'The Zero Budget',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int longestSubarray(int[] nums) {
        int left = 0, right = 0;
        int zeros = 0, max = 0;
        
        while (right < nums.length) {
            if (nums[right] == 0) zeros++;
            
            while (zeros > 1) {
                if (nums[left] == 0) zeros--;
                left++;
            }
            
            max = Math.max(max, right - left);
            right++;
        }
        return max;
    }
}`,
    explanation: "By maintaining a sliding window that contains at most one zero, we can find the longest valid sequence in a single pass. The 'right' pointer expands the search, and the 'left' pointer contracts it only when the zero-count violates our budget."
  }
};

const LongestSubarrayOnesVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'learn' | 'interview'>('visualizer');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-200">
                <Trash2 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Longest Subarray of 1's</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">1493</span>
                <span>LeetCode 75 • Medium</span>
              </div>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<BookOpen size={16}/>} label="Learn" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'visualizer' && <VisualizerMode />}
        {activeTab === 'learn' && <LearnMode />}
        {activeTab === 'interview' && <InterviewHelper />}
        
      </div>
    </div>
  );
};

const VisualizerMode = () => {
  const [selectedApproach, setSelectedApproach] = useState<keyof typeof APPROACHES>('optimal');
  const [numsInput, setNumsInput] = useState("0,1,1,1,0,1,1,0,1");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const nums = useMemo(() => numsInput.split(',').map(n => parseInt(n.trim()) || 0), [numsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = nums.length;
    let maxLen = 0;

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ phase, description: desc, line, state: { ...state, nums: [...nums] } });
    };

    if (selectedApproach === 'brute') {
      addStep("Init", "Starting Brute Force scan.", 3, { maxLen: 0, i: -1, j: -1 });
      for (let i = 0; i < n; i++) {
        let zeros = 0;
        addStep("Outer Loop", `Checking starting at index ${i}.`, 5, { i, j: -1, zeros, maxLen });
        for (let j = i; j < n; j++) {
            if (nums[j] === 0) zeros++;
            
            if (zeros <= 1) {
                const currentLen = j - i; // right - left effectively
                const prevMax = maxLen;
                maxLen = Math.max(maxLen, currentLen);
                addStep("Inner Loop", `Valid window [${i}...${j}]. Zeros: ${zeros}. After deletion, length is ${currentLen}.`, 10, { i, j, zeros, maxLen, highlightMax: maxLen > prevMax });
            } else {
                addStep("Break", `Second zero found at ${j}. Breaking inner loop.`, 12, { i, j, zeros, maxLen, exceeded: true });
                break;
            }
        }
      }
    } else {
      // Optimal Sliding Window
      let left = 0, right = 0, zeros = 0;
      addStep("Init", "Initialize pointers at zero with a budget of 1 zero erasure.", 3, { left, right, zeros, maxLen: 0 });

      while (right < n) {
        if (nums[right] === 0) zeros++;
        addStep("Expand", `R at ${right}. Val: ${nums[right]}. Total zeros in window: ${zeros}.`, 8, { left, right, zeros, maxLen, activePtr: 'right' });

        while (zeros > 1) {
          addStep("Constraint Hit", `More than 1 zero (${zeros} > 1). Must shrink from left.`, 11, { left, right, zeros, maxLen, activePtr: 'left', error: true });
          if (nums[left] === 0) zeros--;
          left++;
          addStep("Shrink", `L moved to ${left}. Current zeros: ${zeros}.`, 13, { left, right, zeros, maxLen, activePtr: 'left' });
        }

        const currentLen = right - left; // Length after deleting one
        const prevMax = maxLen;
        maxLen = Math.max(maxLen, currentLen);
        addStep("Calculate", `Subarray length after deletion: ${currentLen}. Global Max: ${maxLen}.`, 16, { left, right, zeros, maxLen, currentLen, highlight: currentLen > prevMax });
        right++;
      }
    }

    addStep("Finish", `Search complete. Longest sequence of 1's after one deletion: ${maxLen}`, 20, { maxLen, finished: true });
    return steps;
  }, [nums, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const currentState = trace[currentStep] || trace[0];
  const { left, right, zeros, maxLen, activePtr, error, highlight, finished, i: bI, j: bJ, exceeded } = currentState.state;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      
      {/* Left Column */}
      <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-sm overflow-hidden">
             {(Object.keys(APPROACHES) as Array<keyof typeof APPROACHES>).map((key) => (
                <button
                  key={key}
                  onClick={() => { setSelectedApproach(key); setCurrentStep(0); }}
                  className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}
                >
                  <div className={`mb-1 transition-transform duration-300 ${selectedApproach === key ? 'scale-110' : ''}`}>
                    {APPROACHES[key].icon}
                  </div>
                  <span className="text-xs font-black uppercase tracking-tight">{APPROACHES[key].title}</span>
                  <span className={`text-[10px] opacity-70 ${selectedApproach === key ? 'text-white' : 'text-slate-400'}`}>{APPROACHES[key].complexity}</span>
                </button>
             ))}
          </div>

          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[500px]">
            <div className="bg-[#1e293b] px-4 py-3 text-xs font-mono text-slate-400 flex justify-between items-center border-b border-slate-800/50">
              <div className="flex items-center gap-2 text-indigo-400 font-bold">Solution.java</div>
              <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors">
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                <span className={copied ? "text-green-400" : "text-slate-300"}>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-6 font-mono text-[13px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                <div className="absolute left-0 right-0 bg-indigo-500/15 border-l-4 border-indigo-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${(currentState.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} />
                {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                    <CodeLineRenderer key={idx} num={idx + 1} code={line} active={currentState.line === idx + 1} />
                ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                 <Cpu size={18} />
                 <h4 className="text-sm font-black uppercase tracking-widest">Logic Insight</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{APPROACHES[selectedApproach].explanation}</p>
          </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block pl-1">Input Array (0s and 1s)</label>
            <input value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" maxLength={35} />
          </div>

          <div className="flex flex-col gap-5 pt-6 border-t border-slate-100">
            <div className="w-full px-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                    <span>Scan</span>
                    <span className="text-indigo-500">Step {currentStep + 1} / {trace.length}</span>
                    <span>Result</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                    <div className="h-full bg-indigo-500 transition-all duration-500 ease-out" style={{ width: `${(currentStep / (Math.max(1, trace.length - 1))) * 100}%` }} />
                </div>
            </div>
            <div className="flex items-center justify-between gap-4">
                <button onClick={() => setCurrentStep(0)} className="p-3 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-all" title="Reset Simulation"><RotateCcw size={20}/></button>
                <div className="flex gap-3 flex-1">
                    <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-all disabled:opacity-30 flex items-center justify-center gap-2">
                        <ChevronLeft size={18} /> Prev
                    </button>
                    <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold transition-all disabled:opacity-30 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
                        Advance Action <ChevronRight size={18} />
                    </button>
                </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3 text-slate-400">
              <Target size={14}/>
              <span className="text-[10px] font-black uppercase tracking-widest">Step Analysis</span>
            </div>
            <div className="text-lg font-black tracking-tight mb-2 uppercase">{currentState.phase}</div>
            <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-700/50">{currentState.description}</p>
        </div>

        {/* Visual Arena */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[400px] relative overflow-hidden flex flex-col justify-center items-center gap-12">
            
            {/* Dashboard */}
            <div className="flex gap-10">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Zeros in Window</span>
                    <div className={`text-3xl font-black tabular-nums transition-all duration-300 ${zeros > 1 ? 'text-red-500 scale-125' : 'text-indigo-600'}`}>
                        {zeros} / 1
                    </div>
                </div>
                <div className="h-10 w-px bg-slate-100 self-end" />
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Max</span>
                    <div className={`text-3xl font-black tabular-nums transition-all duration-300 ${highlight ? 'text-green-500 scale-125' : 'text-slate-800'}`}>{maxLen}</div>
                </div>
            </div>

            {/* Elements Display */}
            <div className="flex flex-wrap justify-center gap-2 relative px-10">
                {nums.map((num, idx) => {
                    let isInWindow = false;
                    let isActive = false;
                    let isZero = num === 0;

                    if (selectedApproach === 'brute') {
                        isInWindow = bI !== undefined && bJ !== undefined && idx >= bI && idx <= bJ;
                        isActive = idx === bJ;
                    } else {
                        isInWindow = idx >= left && idx <= right;
                        isActive = (activePtr === 'right' && idx === right) || (activePtr === 'left' && idx === left);
                    }

                    let bgClass = "bg-white";
                    let borderClass = "border-slate-200";
                    let textClass = num === 1 ? "text-slate-700 font-bold" : "text-slate-300";

                    if (isInWindow) {
                        bgClass = isZero ? "bg-indigo-600 shadow-md shadow-indigo-100" : "bg-indigo-50";
                        borderClass = "border-indigo-400";
                        textClass = isZero ? "text-white font-black" : "text-indigo-700 font-bold";
                    }

                    if (isActive && !finished) {
                        borderClass = activePtr === 'left' || (selectedApproach === 'brute' && exceeded) ? "border-rose-500 ring-2 ring-rose-100" : "border-emerald-500 ring-2 ring-emerald-100";
                        bgClass = activePtr === 'left' ? "bg-rose-50" : bgClass;
                        if (activePtr === 'left') textClass = "text-rose-700";
                    }

                    return (
                        <div key={idx} className="flex flex-col items-center transition-all duration-300">
                            <div className={`
                                w-10 h-12 border-2 rounded-xl flex items-center justify-center font-mono text-lg transition-all duration-300 relative
                                ${bgClass} ${borderClass} ${textClass}
                            `}>
                                {num}
                                {selectedApproach === 'optimal' && !finished && (
                                    <>
                                        {idx === left && <div className="absolute -top-6 text-rose-500 font-black text-[8px] animate-bounce">LEFT</div>}
                                        {idx === right && <div className="absolute -bottom-6 text-emerald-500 font-black text-[8px] animate-bounce">RIGHT</div>}
                                    </>
                                )}
                                {selectedApproach === 'brute' && !finished && (
                                    <>
                                        {idx === bI && <div className="absolute -top-6 text-indigo-500 font-black text-[8px]">START</div>}
                                        {idx === bJ && <div className="absolute -bottom-6 text-blue-500 font-black text-[8px]">SCAN</div>}
                                    </>
                                )}
                            </div>
                            <span className="mt-2 text-[10px] font-mono font-black text-slate-300">{idx}</span>
                        </div>
                    );
                })}
            </div>

            {finished && (
               <div className="animate-in zoom-in duration-500">
                  <div className="bg-indigo-50 border-2 border-indigo-200 px-10 py-6 rounded-3xl flex flex-col items-center gap-2 shadow-xl">
                      <Check className="text-indigo-600" size={40} />
                      <span className="text-xs font-black uppercase tracking-widest text-indigo-700">Scan Complete</span>
                      <span className="text-4xl font-black text-slate-900">{maxLen}</span>
                  </div>
               </div>
            )}
        </div>
      </div>
    </div>
  );
};

const LearnMode = () => {
    const [selectedTopic, setSelectedTopic] = useState('rules');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-3 space-y-2">
                <TopicButton active={selectedTopic === 'rules'} onClick={() => setSelectedTopic('rules')} title="1. The Rules" desc="Must Delete Exactly One" />
                <TopicButton active={selectedTopic === 'window'} onClick={() => setSelectedTopic('window')} title="2. Window Mapping" desc="Allowed Zeros = 1" />
                <TopicButton active={selectedTopic === 'math'} onClick={() => setSelectedTopic('math')} title="3. The Calculation" desc="Why subtract 1?" />
                <TopicButton active={selectedTopic === 'efficiency'} onClick={() => setSelectedTopic('efficiency')} title="4. Efficiency" desc="O(N) Progression" />
            </div>

            <div className="lg:col-span-9 bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[600px] flex flex-col">
                {selectedTopic === 'rules' && (
                    <div className="space-y-6 animate-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-black mb-1">
                            <AlignLeft size={16}/> Problem Intuition
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">The Deletion Constraint</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Unlike most subarray problems where you just find a range, here you <strong>must</strong> delete exactly one element from the array.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 border rounded-xl shadow-inner">
                                <span className="text-[10px] font-black text-indigo-600 uppercase mb-2">Mixed Array</span>
                                <div className="font-mono text-sm">[1, 1, 0, 1]</div>
                                <p className="text-xs text-slate-500 mt-2 italic">Delete the 0 to get length 3.</p>
                            </div>
                            <div className="p-4 bg-slate-50 border rounded-xl shadow-inner">
                                <span className="text-[10px] font-black text-rose-600 uppercase mb-2">All Ones Array</span>
                                <div className="font-mono text-sm">[1, 1, 1, 1]</div>
                                <p className="text-xs text-slate-500 mt-2 italic">Must delete one 1! Final length is 3.</p>
                            </div>
                        </div>
                    </div>
                )}

                {selectedTopic === 'window' && (
                    <div className="space-y-6 animate-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Sliding Window Mapping</h2>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            This problem is a specific case of "Max Consecutive Ones III". 
                        </p>
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-xl">
                            <p className="text-indigo-900 leading-relaxed">
                                <strong>Logic:</strong> If we can delete one element to maximize ones, we are looking for the longest subarray that contains <strong>at most one zero</strong>. We can treat that zero as "the element to be deleted".
                            </p>
                        </div>
                        <ul className="space-y-3 mt-4 text-sm text-slate-600">
                            <li className="flex gap-2"><Check className="text-emerald-500" size={18}/> <code>right</code> expands to find new ones and potential zeros.</li>
                            <li className="flex gap-2"><Check className="text-emerald-500" size={18}/> <code>left</code> contracts whenever zeros in window &gt; 1.</li>
                        </ul>
                    </div>
                )}

                {selectedTopic === 'math' && (
                    <div className="space-y-6 animate-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">The Length Calculation</h2>
                        <p className="text-slate-600 leading-relaxed">
                           Why is the formula <code>right - left</code> instead of <code>right - left + 1</code>?
                        </p>
                        
                        <div className="bg-slate-900 p-6 rounded-2xl text-white space-y-4 shadow-2xl">
                            <div className="flex gap-2 items-center text-xs font-bold text-indigo-400 uppercase tracking-widest">
                                <Calculator size={14}/> Proof by Substitution
                            </div>
                            <div className="font-mono text-sm space-y-2">
                                <p>1. Normal Width = (right - left + 1)</p>
                                <p>2. We MUST delete 1 element.</p>
                                <p>3. Adjusted Width = (right - left + 1) - 1</p>
                                <div className="h-px bg-slate-700 w-full" />
                                <p className="text-indigo-300 font-black">4. Final Result = right - left</p>
                            </div>
                        </div>
                    </div>
                )}

                {selectedTopic === 'efficiency' && (
                    <div className="space-y-6 animate-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Efficiency Analysis</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl space-y-3">
                                <div className="font-black text-blue-600 text-xs uppercase tracking-widest">Time Complexity</div>
                                <div className="text-2xl font-black text-slate-900">O(N)</div>
                                <p className="text-xs text-slate-500 leading-relaxed">We iterate through the array once with the 'right' pointer. The 'left' pointer also moves at most N times total. Total operations: 2N &rarr; O(N).</p>
                            </div>
                            <div className="p-6 bg-purple-50 border border-purple-100 rounded-2xl space-y-3">
                                <div className="font-black text-purple-600 text-xs uppercase tracking-widest">Space Complexity</div>
                                <div className="text-2xl font-black text-slate-900">O(1) Auxiliary</div>
                                <p className="text-xs text-slate-500 leading-relaxed">We only store a few integer pointers and counters. The memory footprint is independent of input size.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const InterviewHelper = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
        <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 font-black uppercase tracking-tight">
                    <MessageSquare className="text-indigo-500" size={20} />
                    Interview Strategy
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"How is this different from finding the longest streak of ones?"</p>
                        <p>Answer: "The 'deletion' requirement forces us to remove exactly one element. In a standard streak problem, if you have [1,1,1], the answer is 3. Here, because of the mandatory deletion, the answer is 2. Mapping the problem to a sliding window with a budget of exactly one zero handles both zero-heavy and one-heavy arrays correctly."</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"What if the input contains only zeros?"</p>
                        <p>Answer: "The logic holds. The window will allow at most one zero. The calculation <code>right - left</code> will result in 0 (e.g., [0], right=0, left=0, 0-0=0). This correctly reflects that even after deleting one 0, you have zero 1's left."</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg border-l-4 border-indigo-500">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 uppercase tracking-widest text-indigo-400">
                    <Target size={20} />
                    The Elite Pitch
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                    "I implemented a sliding window approach with a single pass O(N) complexity. By re-framing the problem as finding the largest window that contains at most one zero, I can efficiently track the valid sequence width. The mandatory deletion of one element is mathematically accounted for by using the <code>right - left</code> length formula, ensuring correctness for edge cases like arrays of only ones while maintaining constant auxiliary space."
                </p>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-amber-800 flex items-center gap-2 mb-4 uppercase tracking-widest">
                    <AlertCircle size={20} />
                    Senior Engineering Tips
                </h3>
                <div className="space-y-4 text-sm">
                    <div className="bg-white p-3 rounded border border-amber-100 shadow-sm">
                        <span className="text-[10px] font-black text-amber-600 block mb-1 uppercase tracking-widest tracking-tighter">PROBLEM GENERALIZATION</span>
                        <p className="text-xs text-slate-600 leading-relaxed">Always mention that this is a subset of the 'K-Flip' problem. It shows you recognize algorithmic patterns rather than just memorizing specific problems.</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-amber-100 shadow-sm">
                        <span className="text-[10px] font-black text-amber-600 block mb-1 uppercase tracking-widest tracking-tighter">DATA REDUNDANCY</span>
                        <p className="text-xs text-slate-600 leading-relaxed">Highlight why Brute Force is $O(N^2)$. It's not just 'slow'; it's mathematically redundant because it recalculates sums for overlapping regions.</p>
                    </div>
                </div>
            </div>

            <div className="bg-indigo-600 text-white rounded-xl p-6 shadow-lg shadow-indigo-100 flex flex-col justify-center">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                    <Check size={20} />
                    Complexity Overview
                </h3>
                <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono">
                    <div className="bg-indigo-700/50 p-4 rounded-xl border border-indigo-400/30">
                        <div className="font-black text-indigo-100 mb-1 uppercase tracking-widest text-[9px]">Time Complexity</div>
                        O(N) (One Pass)
                    </div>
                    <div className="bg-indigo-700/50 p-4 rounded-xl border border-indigo-400/30">
                        <div className="font-black text-indigo-100 mb-1 uppercase tracking-widest text-[9px]">Space Complexity</div>
                        O(1) Auxiliary
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|Math|max|length)\b|\b\d+\b)/g).filter(Boolean);

  return (
    <div className={`flex relative z-10 group min-h-[20.8px] ${active ? 'font-bold' : ''}`}>
      <span className="w-8 select-none text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-xs">{num}</span>
      <pre className={`font-mono whitespace-pre text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-orange-300">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-cyan-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'void', 'for'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['Math', 'max', 'length', 'String'].includes(part)) return <span key={i} className="text-indigo-300 font-bold">{part}</span>;
          return part;
        })}
      </pre>
    </div>
  );
};

const TopicButton: React.FC<{ active: boolean; onClick: () => void; title: string; desc: string }> = ({ active, onClick, title, desc }) => (
  <button 
    onClick={onClick}
    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group
      ${active 
        ? 'bg-indigo-50 border-indigo-500 shadow-md ring-1 ring-indigo-100' 
        : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}
    `}
  >
    <div className={`font-black uppercase tracking-tight text-sm ${active ? 'text-blue-800' : 'text-slate-700 group-hover:text-blue-700'}`}>
      {title}
    </div>
    <div className={`text-[10px] font-bold mt-1 ${active ? 'text-blue-600' : 'text-slate-400'}`}>
      {desc}
    </div>
  </button>
);

export default LongestSubarrayOnesVisualizer;
