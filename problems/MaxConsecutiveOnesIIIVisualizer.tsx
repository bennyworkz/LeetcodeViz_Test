import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, Check, Copy, AlignLeft, Zap, Trophy, MessageSquare, Target, AlertCircle, Cpu, Minus, Plus, Search, Expand, History, MousePointer2 } from 'lucide-react';

const APPROACHES = {
  brute: {
    id: 'brute',
    title: '1. Brute Force',
    subtitle: 'All Subarrays',
    icon: <Search size={16} />,
    complexity: 'Time: O(N²) | Space: O(1)',
    code: `class Solution {
    public int longestOnes(int[] nums, int k) {
        int max = 0;
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            int zeros = 0;
            for (int j = i; j < n; j++) {
                if (nums[j] == 0) zeros++;
                
                if (zeros <= k) {
                    max = Math.max(max, j - i + 1);
                } else {
                    break; // Budget exceeded
                }
            }
        }
        return max;
    }
}`,
    explanation: "This approach explores every possible contiguous subarray. For each starting point 'i', it expands 'j' until the number of zeros exceeds the budget 'k'. While simple, it re-counts the same elements millions of times."
  },
  optimal: {
    id: 'optimal',
    title: '2. Sliding Window',
    subtitle: 'Dynamic Frame',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int longestOnes(int[] nums, int k) {
        int left = 0, right = 0;
        int zeroCount = 0, max = 0;
        
        while (right < nums.length) {
            if (nums[right] == 0) zeroCount++;
            
            while (zeroCount > k) {
                if (nums[left] == 0) zeroCount--;
                left++;
            }
            
            max = Math.max(max, right - left + 1);
            right++;
        }
        return max;
    }
}`,
    explanation: "The professional standard. We maintain a 'sliding window' defined by two pointers. We stretch 'right' to include new elements and only shrink 'left' when the zero-count violates our budget 'k'. This ensures each element is visited at most twice."
  }
};

const MaxConsecutiveOnesIIIVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'learn' | 'interview'>('visualizer');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-200">
                <Expand className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Max Consecutive Ones III</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">1004</span>
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
  const [numsInput, setNumsInput] = useState("1,1,1,0,0,0,1,1,1,1,0");
  const [kInput, setKInput] = useState(2);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const nums = useMemo(() => numsInput.split(',').map(n => parseInt(n.trim()) || 0), [numsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = nums.length;
    let maxLen = 0;

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ phase, description: desc, line, state: { ...state, nums: [...nums], k: kInput } });
    };

    if (selectedApproach === 'brute') {
      addStep("Init", "Starting Brute Force scan.", 3, { maxLen: 0, i: -1, j: -1 });
      for (let i = 0; i < n; i++) {
        let zeros = 0;
        addStep("Outer Loop", `New starting point at index ${i}.`, 5, { i, j: -1, zeros, maxLen });
        for (let j = i; j < n; j++) {
            if (nums[j] === 0) zeros++;
            
            if (zeros <= kInput) {
                const currentSubLen = j - i + 1;
                const prevMax = maxLen;
                maxLen = Math.max(maxLen, currentSubLen);
                addStep("Inner Loop", `Subarray [${i}...${j}] has ${zeros} zeros. Length: ${currentSubLen}.`, 10, { i, j, zeros, maxLen, highlightMax: maxLen > prevMax });
            } else {
                addStep("Break", `Zero count (${zeros}) exceeds k (${kInput}). Breaking inner loop.`, 12, { i, j, zeros, maxLen, exceeded: true });
                break;
            }
        }
      }
    } else {
      // Optimal Sliding Window
      let left = 0, right = 0, zeroCount = 0;
      addStep("Init", "Initialize pointers at zero.", 3, { left, right, zeroCount, maxLen: 0 });

      while (right < n) {
        if (nums[right] === 0) zeroCount++;
        addStep("Expand", `R at ${right}. Val: ${nums[right]}. Total zeros in window: ${zeroCount}.`, 8, { left, right, zeroCount, maxLen, activePtr: 'right' });

        while (zeroCount > kInput) {
          addStep("Violated", `Budget exceeded (${zeroCount} > ${kInput}). Must shrink from L.`, 11, { left, right, zeroCount, maxLen, activePtr: 'left', violated: true });
          if (nums[left] === 0) zeroCount--;
          left++;
          addStep("Shrink", `L moved to ${left}. Current zeros: ${zeroCount}.`, 13, { left, right, zeroCount, maxLen, activePtr: 'left' });
        }

        const currentLen = right - left + 1;
        const prevMax = maxLen;
        maxLen = Math.max(maxLen, currentLen);
        addStep("Update Max", `Window [${left}...${right}] is valid. Size: ${currentLen}. Max: ${maxLen}.`, 16, { left, right, zeroCount, maxLen, highlightMax: maxLen > prevMax });
        right++;
      }
    }

    addStep("Finish", `Search complete. Longest subarray length is ${maxLen}.`, 20, { maxLen, finished: true });
    return steps;
  }, [nums, kInput, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const currentState = trace[currentStep] || trace[0];
  const { left, right, zeroCount, maxLen, activePtr, violated, highlightMax, finished, i: bI, j: bJ, exceeded } = currentState.state;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      
      {/* Left Column */}
      <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-sm overflow-hidden">
             {(Object.keys(APPROACHES) as Array<keyof typeof APPROACHES>).map((key) => (
                <button
                  key={key}
                  onClick={() => { setSelectedApproach(key); setCurrentStep(0); }}
                  className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}
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
              <div className="flex items-center gap-2">
                <Code2 size={14} className="text-blue-400"/>
                <span className="font-bold text-slate-300">Solution.java</span>
              </div>
              <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors group">
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                <span className={copied ? "text-green-400" : "text-slate-300"}>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-6 font-mono text-[13px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                <div className="absolute left-0 right-0 bg-blue-500/15 border-l-4 border-blue-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${(currentState.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} />
                {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                    <CodeLineRenderer key={idx} num={idx + 1} code={line} active={currentState.line === idx + 1} />
                ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-blue-600">
                 <Cpu size={18} />
                 <h4 className="text-sm font-black uppercase tracking-widest">Architectural Summary</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{APPROACHES[selectedApproach].explanation}</p>
          </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block pl-1">Binary Input</label>
              <input value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner" maxLength={35} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-purple-600 uppercase tracking-widest block pl-1">Flip Budget (k)</label>
              <input type="number" value={kInput} onChange={(e) => { setKInput(parseInt(e.target.value) || 0); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-purple-500 outline-none shadow-inner" />
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-6 border-t border-slate-100">
            <div className="w-full px-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                    <span>Scan</span>
                    <span className="text-blue-500">Step {currentStep + 1} / {trace.length}</span>
                    <span>Result</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                    <div className="h-full bg-blue-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${(currentStep / (Math.max(1, trace.length - 1))) * 100}%` }} />
                </div>
            </div>
            <div className="flex items-center justify-between gap-4">
                <button onClick={() => setCurrentStep(0)} className="p-3 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-all" title="Reset Simulation"><RotateCcw size={20}/></button>
                <div className="flex gap-3 flex-1">
                    <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        <ChevronLeft size={18} /> Prev
                    </button>
                    <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold transition-all disabled:opacity-30 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
                        Next Action <ChevronRight size={18} />
                    </button>
                </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3 text-slate-400">
              <Target size={14}/>
              <span className="text-[10px] font-black uppercase tracking-widest">Simulation Context</span>
            </div>
            <div className="text-lg font-black tracking-tight mb-2 uppercase">{currentState.phase}</div>
            <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-700/50">{currentState.description}</p>
        </div>

        {/* Visual Arena */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[400px] relative overflow-hidden flex flex-col justify-center items-center gap-12">
            
            {/* Dashboard */}
            <div className="flex gap-10">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Zeros Used</span>
                    <div className={`text-3xl font-black tabular-nums transition-all duration-300 ${(selectedApproach === 'optimal' ? zeroCount : (currentState.state.zeros ?? 0)) > kInput ? 'text-red-500 scale-125' : 'text-blue-600'}`}>
                        {(selectedApproach === 'optimal' ? zeroCount : (currentState.state.zeros ?? 0))} / {kInput}
                    </div>
                </div>
                <div className="h-10 w-px bg-slate-100 self-end" />
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Max</span>
                    <div className={`text-3xl font-black tabular-nums transition-all duration-300 ${highlightMax ? 'text-green-500 scale-125' : 'text-slate-800'}`}>{maxLen}</div>
                </div>
            </div>

            {/* Elements Display */}
            <div className="flex flex-wrap justify-center gap-2 relative px-10">
                {nums.map((num, idx) => {
                    let isInWindow = false;
                    let isActive = false;
                    let isFlipped = false;

                    if (selectedApproach === 'brute') {
                        isInWindow = bI !== undefined && bJ !== undefined && idx >= bI && idx <= bJ;
                        isActive = idx === bJ;
                        isFlipped = isInWindow && num === 0;
                    } else {
                        isInWindow = idx >= left && idx <= right;
                        isActive = (activePtr === 'right' && idx === right) || (activePtr === 'left' && idx === left);
                        isFlipped = isInWindow && num === 0;
                    }

                    let bgClass = "bg-white";
                    let borderClass = "border-slate-200";
                    let textClass = num === 1 ? "text-slate-700 font-bold" : "text-slate-300";

                    if (isInWindow) {
                        bgClass = isFlipped ? "bg-blue-600 shadow-md shadow-blue-100" : "bg-blue-50";
                        borderClass = "border-blue-400";
                        textClass = isFlipped ? "text-white font-black" : "text-blue-700 font-bold";
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
                  <div className="bg-green-50 border-2 border-green-200 px-10 py-6 rounded-3xl flex flex-col items-center gap-2 shadow-xl">
                      <Check className="text-green-600" size={40} />
                      <span className="text-xs font-black uppercase tracking-widest text-green-700">Scan Complete</span>
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
    const [selectedTopic, setSelectedTopic] = useState('window');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-3 space-y-2">
                <TopicButton active={selectedTopic === 'window'} onClick={() => setSelectedTopic('window')} title="1. Variable Sliding" desc="The Stretch & Shrink Pattern" />
                <TopicButton active={selectedTopic === 'budget'} onClick={() => setSelectedTopic('budget')} title="2. Zero Budget" desc="Resource Management" />
                <TopicButton active={selectedTopic === 'equivalence'} onClick={() => setSelectedTopic('equivalence')} title="3. Rephrasing" desc="How to spot this problem" />
                <TopicButton active={selectedTopic === 'performance'} onClick={() => setSelectedTopic('performance')} title="4. Efficiency" desc="Redundancy elimination" />
            </div>

            <div className="lg:col-span-9 bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col">
                {selectedTopic === 'window' && (
                    <div className="space-y-6 animate-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-black mb-1">
                            <AlignLeft size={16}/> Problem Intuition
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Expansion vs Contraction</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Unlike a fixed window (like "sum of every 3 elements"), a variable window grows as large as possible until a <strong>constraint</strong> is broken.
                        </p>
                        
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-4 shadow-inner">
                            <h3 className="font-bold text-blue-800 flex items-center gap-2"><Expand size={20}/> The Sliding Protocol</h3>
                            <ul className="space-y-3 text-blue-900">
                                <li className="flex gap-3"><span className="font-black">1. Expand:</span> Move <code>right</code> pointer to include the next element.</li>
                                <li className="flex gap-3"><span className="font-black">2. Evaluate:</span> Check if your current zero-count is still &le; <code>k</code>.</li>
                                <li className="flex gap-3"><span className="font-black">3. Shrink:</span> If the count is too high, move <code>left</code> until the condition is restored.</li>
                            </ul>
                        </div>
                    </div>
                )}

                {selectedTopic === 'budget' && (
                    <div className="space-y-6 animate-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">The "Zero-Flip" Budget</h2>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            Instead of literally "flipping" bits in memory (which would be slow and messy), we use a <b>counter</b> to track our resource usage.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                                <span className="font-black text-slate-700 text-xs uppercase tracking-widest">Resource Gain</span>
                                <code className="block mt-2 text-rose-600 font-bold">if (nums[right] == 0) zeroCount++;</code>
                                <p className="text-xs text-slate-500 mt-2">Spending one "flip" to continue the streak.</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                                <span className="font-black text-slate-700 text-xs uppercase tracking-widest">Resource Recovery</span>
                                <code className="block mt-2 text-emerald-600 font-bold">if (nums[left] == 0) zeroCount--;</code>
                                <p className="text-xs text-slate-500 mt-2">Moving the left boundary past a zero to "refund" a flip.</p>
                            </div>
                        </div>
                    </div>
                )}

                {selectedTopic === 'equivalence' && (
                    <div className="space-y-6 animate-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Problem Equivalence</h2>
                        <p className="text-slate-600 leading-relaxed text-lg">
                           In an interview, you might not see the word "flip". This problem is mathematically identical to:
                        </p>
                        
                        <div className="bg-slate-900 p-6 rounded-2xl text-white space-y-4 shadow-2xl border-l-4 border-blue-500">
                            <div className="flex gap-2 items-center text-xs font-bold text-blue-400 uppercase tracking-widest">
                                <Check size={14}/> Canonical Rephrasing
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed font-black">
                                "Find the longest subarray that contains at most K zeros."
                            </p>
                        </div>
                        
                        <p className="text-sm text-slate-500 border-t pt-4 italic">
                            Spotting this phrasing early allows you to jump straight to the Sliding Window template.
                        </p>
                    </div>
                )}

                {selectedTopic === 'performance' && (
                    <div className="space-y-6 animate-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight text-indigo-900">Killing Redundancy</h2>
                        <p className="text-slate-600">
                           Why is Sliding Window O(N) while Brute Force is O(N²)?
                        </p>
                        <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl shadow-inner space-y-4">
                            <h3 className="font-bold text-indigo-800 mb-2 flex items-center gap-2"><History size={16}/> Reusing the Past</h3>
                            <p className="text-xs text-indigo-700 leading-relaxed">
                                Brute force starts from scratch at every index. If a subarray [2...10] has 1 zero, and you move to [3...11], brute force re-scans indices 3 through 10. Sliding window remembers the zero-count from [2...10] and only looks at index 2 (leaving) and index 11 (entering).
                            </p>
                            <div className="h-1 w-full bg-indigo-200 rounded-full" />
                            <p className="text-xs text-indigo-500 font-mono">Operations reduced from O(N * (N/2)) avg to O(2N) absolute.</p>
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
                    <MessageSquare className="text-blue-500" size={20} />
                    Interview Q&A
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"What if K = 0?"</p>
                        <p>Answer: "The logic remains identical. The window will shrink immediately whenever a zero is encountered, effectively finding the longest sequence of ones. The template is robust."</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"Why move both pointers forward in the inner loop?"</p>
                        <p>Answer: "We must shrink the window from the left to recover budget. We continue shrinking until the specific zero that put us over the limit is 'released' behind the left pointer."</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 uppercase tracking-widest text-blue-400">
                    <Target size={20} />
                    The Elite Pitch
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                    "I implemented an O(N) variable-sized sliding window to identify the maximum contiguous sequence. By interpreting the problem as finding the longest subarray with at most K zeros, I maintained a dynamic resource counter. This approach avoids the O(N²) cost of redundant re-scans by incrementally updating the window boundaries, ensuring optimal performance with constant auxiliary space."
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
                        <span className="text-[10px] font-black text-amber-600 block mb-1 uppercase tracking-widest tracking-tighter">DATA STREAMING</span>
                        <p className="text-xs text-slate-600">Mention that this algorithm is suitable for data streams because it only processes elements sequentially and maintains minimal state.</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-amber-100 shadow-sm">
                        <span className="text-[10px] font-black text-amber-600 block mb-1 uppercase tracking-widest tracking-tighter">OFF-BY-ONE</span>
                        <p className="text-xs text-slate-600">Be extremely careful with the length calculation <code>right - left + 1</code>. Interviewers often look for clarity on whether the window is inclusive or exclusive.</p>
                    </div>
                </div>
            </div>

            <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg shadow-blue-100 flex flex-col justify-center">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                    <Check size={20} />
                    Complexity Overview
                </h3>
                <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono">
                    <div className="bg-blue-700/50 p-4 rounded-xl border border-blue-400/30">
                        <div className="font-black text-blue-100 mb-1 uppercase tracking-widest text-[9px]">Time Complexity</div>
                        O(N) (One Pass)
                    </div>
                    <div className="bg-blue-700/50 p-4 rounded-xl border border-blue-400/30">
                        <div className="font-black text-blue-100 mb-1 uppercase tracking-widest text-[9px]">Space Complexity</div>
                        O(1) Auxiliary
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
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
        ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-100' 
        : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}
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

export default MaxConsecutiveOnesIIIVisualizer;