import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, Check, Copy, AlignLeft, Zap, BarChart3, Trophy, MessageSquare, Target, AlertCircle, Cpu, Layers, MousePointer2, TrendingUp, AlertTriangle, X, FileText } from 'lucide-react';

const APPROACHES = {
  brute: {
    id: 'brute',
    title: '1. Brute Force',
    subtitle: 'Triple Nested Loop',
    icon: <AlertTriangle size={16} />,
    complexity: 'Time: O(N³) | Space: O(1)',
    code: `class Solution {
    public boolean increasingTriplet(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                for (int k = j + 1; k < n; k++) {
                    if (nums[i] < nums[j] && nums[j] < nums[k]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}`,
    explanation: "Checks every possible combination of three indices. Guaranteed to find a triplet if it exists, but the O(N³) complexity makes it unusable for arrays larger than a few hundred elements."
  },
  optimal: {
    id: 'optimal',
    title: '2. Greedy Optimal',
    subtitle: 'Min-Value Traps',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public boolean increasingTriplet(int[] nums) {
        int first = Integer.MAX_VALUE;
        int second = Integer.MAX_VALUE;
        
        for (int n : nums) {
            if (n <= first) {
                first = n; // Found a new smallest
            } else if (n <= second) {
                second = n; // Found a new middle
            } else {
                // If n > first AND n > second, we have a triplet!
                return true; 
            }
        }
        return false;
    }
}`,
    explanation: "Maintains two variables: the smallest ('first') and second smallest ('second') values seen so far that form an increasing pair. If we encounter a value larger than both, a triplet is confirmed."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">334. Increasing Triplet Subsequence</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given an integer array <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">nums</code>, return <code className="font-bold text-slate-800">true</code> <em>if there exists a triple of indices</em> <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">(i, j, k)</code> <em>such that</em> <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">i {'<'} j {'<'} k</code> <em>and</em> <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">nums[i] {'<'} nums[j] {'<'} nums[k]</code>. If no such indices exist, return <code className="font-bold text-slate-800">false</code>.
        </p>
        <div className="space-y-8 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [1,2,3,4,5]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> true</p>
              <p className="mt-2 text-slate-500 italic">Explanation: Any triplet where i {'<'} j {'<'} k is valid.</p>
            </div>
          </div>
        </div>
        <div className="pt-10 border-t border-slate-100 mt-10">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <AlertCircle size={14} /> Constraints:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">1 {'<='} nums.length {'<='} 5 * 10<sup>5</sup></code></li>
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">-2<sup>31</sup> {'<='} nums[i] {'<='} 2<sup>31</sup> - 1</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const IncreasingTripletVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-600 p-3 rounded-xl shadow-lg shadow-emerald-200">
                <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Increasing Triplet</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">334</span>
                <span>LeetCode 75 • Medium</span>
              </div>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <TabButton active={activeTab === 'problem'} onClick={() => setActiveTab('problem')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<BookOpen size={16}/>} label="Learn" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'problem' && <ProblemStatement />}
        {activeTab === 'visualizer' && <VisualizerMode />}
        {activeTab === 'learn' && <LearnMode />}
        {activeTab === 'interview' && <InterviewHelper />}
        
      </div>
    </div>
  );
};

const VisualizerMode = () => {
  const [selectedApproach, setSelectedApproach] = useState<keyof typeof APPROACHES>('optimal');
  const [numsInput, setNumsInput] = useState("2,1,5,0,4,6");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const nums = useMemo(() => numsInput.split(',').map(n => parseInt(n.trim()) || 0), [numsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = nums.length;
    
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ phase, description: desc, line, state: { ...state, nums: [...nums] } });
    };

    if (selectedApproach === 'brute') {
      addStep("Init", "Start solution with Brute Force search.", 3, { i: -1, j: -1, k: -1 });
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          for (let k = j + 1; k < n; k++) {
            const match = nums[i] < nums[j] && nums[j] < nums[k];
            addStep("Checking", `Testing triplet indices [${i}, ${j}, ${k}]: values (${nums[i]}, ${nums[j]}, ${nums[k]}).`, 7, { i, j, k, match });
            if (match) {
              addStep("Found", "Valid increasing triplet found!", 8, { i, j, k, match, finished: true });
              return steps;
            }
          }
        }
      }
      addStep("Fail", "No increasing triplet exists in the array.", 13, { finished: true });
    } else {
      // Optimal
      let first = Infinity;
      let second = Infinity;
      addStep("Init", "Initialize 'first' and 'second' traps to Infinity.", 3, { first, second, activeIdx: -1 });

      for (let i = 0; i < n; i++) {
        const val = nums[i];
        addStep("Scan", `Checking element at index ${i}: ${val}.`, 6, { first, second, activeIdx: i });
        
        if (val <= first) {
          first = val;
          addStep("Update First", `Value ${val} is smaller than or equal to 'first'. Updating 'first'.`, 8, { first, second, activeIdx: i, updateType: 'first' });
        } else if (val <= second) {
          second = val;
          addStep("Update Second", `Value ${val} is smaller than or equal to 'second'. Updating 'second'.`, 10, { first, second, activeIdx: i, updateType: 'second' });
        } else {
          addStep("Success", `Found value ${val} which is greater than both 'first' (${first}) and 'second' (${second})!`, 13, { first, second, activeIdx: i, finished: true, success: true });
          return steps;
        }
      }
      addStep("Fail", "Reached end of array without finding a valid triplet.", 16, { first, second, activeIdx: n, finished: true, success: false });
    }

    return steps;
  }, [nums, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const currentState = trace[currentStep] || trace[0];
  const { first, second, activeIdx, finished, updateType, success, i: bruteI, j: bruteJ, k: bruteK, match: bruteMatch } = currentState.state;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      
      {/* Left Column */}
      <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-sm overflow-hidden">
             {(Object.keys(APPROACHES) as Array<keyof typeof APPROACHES>).map((key) => (
                <button
                  key={key}
                  onClick={() => { setSelectedApproach(key); setCurrentStep(0); }}
                  className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}
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
                <Code2 size={14} className="text-emerald-400"/>
                <span className="font-bold text-slate-300">Solution.java</span>
              </div>
              <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors group">
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                <span className={copied ? "text-green-400" : "text-slate-300"}>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-6 font-mono text-[13px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                <div className="absolute left-0 right-0 bg-emerald-500/15 border-l-4 border-emerald-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${(currentState.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} />
                {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                    <CodeLineRenderer key={idx} num={idx + 1} code={line} active={currentState.line === idx + 1} />
                ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-600">
                 <Cpu size={18} />
                 <h4 className="text-sm font-black uppercase tracking-widest">Approach Analysis</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{APPROACHES[selectedApproach].explanation}</p>
          </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block pl-1">Input Array (nums)</label>
            <input value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner" maxLength={30} />
          </div>

          <div className="flex flex-col gap-5 pt-6 border-t border-slate-100">
            <div className="w-full px-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                    <span>Initial</span>
                    <span className="text-emerald-500">Step {currentStep + 1} of {trace.length}</span>
                    <span>Result</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                    <div className="h-full bg-emerald-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${(currentStep / (Math.max(1, trace.length - 1))) * 100}%` }} />
                </div>
            </div>
            <div className="flex items-center justify-between gap-4">
                <button onClick={() => setCurrentStep(0)} className="p-3 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-all" title="Reset Simulation"><RotateCcw size={20}/></button>
                <div className="flex gap-3 flex-1">
                    <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-all disabled:opacity-30 flex items-center justify-center gap-2">
                        <ChevronLeft size={18} /> Prev
                    </button>
                    <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] px-6 py-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-bold transition-all disabled:opacity-30 shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
                        Next Action <ChevronRight size={18} />
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
            <div className="text-lg font-black tracking-tight mb-2">{currentState.phase}</div>
            <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-700/50">{currentState.description}</p>
        </div>

        {/* Visual Arena */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[400px] relative overflow-hidden flex flex-col justify-center items-center gap-12">
            
            {/* Traps for Optimal Approach */}
            {selectedApproach === 'optimal' && (
                <div className="flex gap-8 animate-in slide-in-from-top-4">
                    <div className={`flex flex-col items-center p-4 border-2 rounded-2xl transition-all duration-500 ${updateType === 'first' ? 'bg-emerald-50 border-emerald-500 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200'}`}>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trap 1 (Smallest)</span>
                        <div className={`text-2xl font-mono font-black ${first === Infinity ? 'text-slate-300' : 'text-emerald-700'}`}>
                            {first === Infinity ? '∞' : first}
                        </div>
                    </div>
                    <div className={`flex flex-col items-center p-4 border-2 rounded-2xl transition-all duration-500 ${updateType === 'second' ? 'bg-emerald-50 border-emerald-500 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200'}`}>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trap 2 (Middle)</span>
                        <div className={`text-2xl font-mono font-black ${second === Infinity ? 'text-slate-300' : 'text-emerald-700'}`}>
                            {second === Infinity ? '∞' : second}
                        </div>
                    </div>
                </div>
            )}

            {/* Array Elements */}
            <div className="flex flex-wrap justify-center gap-3 relative px-10">
                {nums.map((num, idx) => {
                    const isActive = selectedApproach === 'optimal' ? activeIdx === idx : (idx === bruteI || idx === bruteJ || idx === bruteK);
                    const isSuccessIdx = finished && (selectedApproach === 'optimal' ? activeIdx === idx : bruteMatch && (idx === bruteI || idx === bruteJ || idx === bruteK));
                    
                    let bgClass = "bg-white";
                    let borderClass = "border-slate-200";
                    let textClass = "text-slate-700 font-bold";

                    if (isActive) {
                        borderClass = "border-blue-500 ring-2 ring-blue-100 scale-110 z-10 shadow-md";
                        bgClass = "bg-blue-50";
                        textClass = "text-blue-700 font-black";
                    }

                    if (isSuccessIdx && (selectedApproach === 'brute' || success)) {
                        bgClass = "bg-emerald-500 animate-bounce";
                        textClass = "text-white";
                        borderClass = "border-emerald-600 shadow-lg shadow-emerald-200 scale-125 z-20";
                    }

                    if (selectedApproach === 'brute') {
                        if (idx === bruteI) borderClass = "border-amber-500 ring-2 ring-amber-100 scale-110 shadow-sm";
                        if (idx === bruteJ) borderClass = "border-indigo-500 ring-2 ring-indigo-100 scale-110 shadow-sm";
                        if (idx === bruteK) borderClass = "border-purple-500 ring-2 ring-purple-100 scale-110 shadow-sm";
                    }

                    return (
                        <div key={idx} className="flex flex-col items-center transition-all duration-300">
                            <div className={`
                                w-12 h-14 border-2 rounded-xl flex items-center justify-center font-mono text-lg transition-all duration-300 relative
                                ${bgClass} ${borderClass} ${textClass}
                            `}>
                                {num}
                                {selectedApproach === 'brute' && (
                                    <>
                                        {idx === bruteI && <div className="absolute -top-6 text-amber-600 font-black text-[10px]">i</div>}
                                        {idx === bruteJ && <div className="absolute -top-6 text-indigo-600 font-black text-[10px]">j</div>}
                                        {idx === bruteK && <div className="absolute -top-6 text-purple-600 font-black text-[10px]">k</div>}
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
                  <div className={`px-8 py-4 rounded-3xl flex items-center gap-4 border-2 shadow-xl ${selectedApproach === 'optimal' ? (success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800') : (bruteMatch ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800')}`}>
                      { (selectedApproach === 'optimal' ? success : bruteMatch) ? <Check className="text-emerald-600" size={32} /> : <X className="text-red-600" size={32} /> }
                      <div className="flex flex-col">
                          <span className="text-xs font-black uppercase tracking-widest opacity-60">Result</span>
                          <span className="text-xl font-black">{ (selectedApproach === 'optimal' ? success : bruteMatch) ? 'Triplet Found!' : 'No Triplet Found' }</span>
                      </div>
                  </div>
               </div>
            )}
        </div>
      </div>
    </div>
  );
};

const LearnMode = () => {
    const [selectedTopic, setSelectedTopic] = useState('problem');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-3 space-y-2">
                <TopicButton active={selectedTopic === 'problem'} onClick={() => setSelectedTopic('problem')} title="1. The Requirement" desc="Indices vs Values" />
                <TopicButton active={selectedTopic === 'greedy'} onClick={() => setSelectedTopic('greedy')} title="2. Greedy Traps" desc="The 'Infinity' Approach" />
                <TopicButton active={selectedTopic === 'proof'} onClick={() => setSelectedTopic('proof')} title="3. Logical Proof" desc="Why updating 'first' works" />
            </div>

            <div className="lg:col-span-9 bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[600px] flex flex-col">
                {selectedTopic === 'problem' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold mb-1">
                            <AlignLeft size={16}/> Understanding 334
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Problem: Increasing Triplet Subsequence</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Given an integer array <code>nums</code>, return <code>true</code> if there exists a triple of indices <code>(i, j, k)</code> such that:
                            <br/>
                            <span className="font-bold text-emerald-600">i &lt; j &lt; k</span> AND <span className="font-bold text-emerald-600">nums[i] &lt; nums[j] &lt; nums[k]</span>.
                        </p>
                        
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 space-y-4">
                            <h3 className="font-bold text-emerald-800 flex items-center gap-2"><Check size={20}/> The Key Detail</h3>
                            <p className="text-emerald-900 leading-relaxed">
                                The triplet does <strong>not</strong> need to be contiguous (next to each other). They just need to appear in that order from left to right.
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <h3 className="font-bold text-slate-700">Contrasting Examples:</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <div className="text-[10px] font-bold text-emerald-600 uppercase mb-2">Valid [True]</div>
                                    <div className="font-mono">[2, 1, <span className="bg-emerald-200 px-1 rounded">5</span>, 0, <span className="bg-emerald-200 px-1 rounded">8</span>, 2, <span className="bg-emerald-200 px-1 rounded">10</span>]</div>
                                    <p className="text-xs text-slate-500 mt-2">The values 5, 8, 10 form an increasing triplet across the indices.</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <div className="text-[10px] font-bold text-red-600 uppercase mb-2">Invalid [False]</div>
                                    <div className="font-mono">[5, 4, 3, 2, 1]</div>
                                    <p className="text-xs text-slate-500 mt-2">The array is strictly decreasing; no triplet can exist.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {selectedTopic === 'greedy' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">The Greedy Logic</h2>
                        <p className="text-slate-600 leading-relaxed">
                            To find the triplet efficiently in O(N) time, we maintain two variables that represent the smallest and second-smallest values forming a potential increasing sequence.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 border rounded-xl bg-slate-50 border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">1</div>
                                    First Trap
                                </h3>
                                <p className="text-sm text-slate-600">The <strong>absolute smallest</strong> value we've found so far.</p>
                            </div>
                            <div className="p-6 border rounded-xl bg-slate-50 border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">2</div>
                                    Second Trap
                                </h3>
                                <p className="text-sm text-slate-600">A value larger than 'first', but as small as possible to leave room for a third element.</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                            <h3 className="font-bold text-blue-900 mb-1 flex items-center gap-2"><Target size={16}/> The Goal</h3>
                            <p className="text-sm text-blue-800 leading-relaxed">
                                Our mission is to find any <code>nums[k]</code> such that <code>nums[k] &gt; second</code>. Since <code>second</code> was already proven to be larger than some <code>first</code> that appeared earlier, we have our triplet.
                            </p>
                        </div>
                    </div>
                )}

                {selectedTopic === 'proof' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">Logical Proof: The "Ghost" First</h2>
                        <p className="text-slate-600 leading-relaxed">
                            One confusing part: what happens if we find a new <code>first</code> that appears <i>after</i> our current <code>second</code>?
                        </p>
                        
                        <div className="bg-slate-900 p-6 rounded-2xl text-white space-y-4 shadow-xl">
                            <div className="flex gap-2 items-center text-xs font-bold text-amber-400 uppercase tracking-widest">
                                <AlertCircle size={14}/> Case Study: [5, 6, 1, 8]
                            </div>
                            <div className="space-y-2 text-sm">
                                <p className="opacity-80"><span className="text-emerald-400">1.</span> Read 5: <code className="text-blue-300">first = 5</code></p>
                                <p className="opacity-80"><span className="text-emerald-400">2.</span> Read 6: <code className="text-blue-300">second = 6</code> (found a pair [5, 6])</p>
                                <p className="opacity-80 font-bold border-l-2 border-amber-500 pl-3 py-1"><span className="text-emerald-400">3.</span> Read 1: <code className="text-blue-300">first = 1</code>. Wait! Now first (1) is after second (6)?</p>
                                <p className="opacity-80"><span className="text-emerald-400">4.</span> Read 8: <code className="text-blue-300">8 &gt; 6 (second)</code>. TRUE! Triplet found.</p>
                            </div>
                        </div>

                        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl">
                            <h3 className="font-bold text-emerald-800 mb-2">Why this works:</h3>
                            <p className="text-sm text-emerald-900 leading-relaxed">
                                When we update <code>first</code> to 1, <code>second</code> remains 6. Even though 1 appears after 6, the fact that <code>second</code> is 6 implies there <strong>was</strong> a value (5) to its left. We don't need to know what that value was anymore; we only need to know that a valid increasing pair [x, 6] existed. Any value larger than 6 completes <i>a</i> triplet, even if it's not starting with the current <code>first</code>.
                            </p>
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
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <MessageSquare className="text-emerald-500" size={20} />
                    Interview Q&A
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-bold text-slate-800 mb-1">"Can this be solved with Longest Increasing Subsequence (LIS) logic?"</p>
                        <p>Answer: "Yes, this is effectively asking if <code>LIS(nums).length &ge; 3</code>. While a standard O(N log N) LIS would work, the greedy two-variable approach is more optimal because we only care about a fixed length of 3, allowing for O(N) time and O(1) space."</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-bold text-slate-800 mb-1">"Why does n &le; first come before n &le; second?"</p>
                        <p>Answer: "The order is critical for the greedy logic. We must always try to lower the smallest value possible. By updating <code>first</code> first, we ensure <code>second</code> is only updated when we've found a value larger than our current smallest, establishing the 'increasing' relationship."</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                    <Target className="text-amber-400" size={20} />
                    The "Elite" Pitch
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                    "I implemented a greedy O(N) solution using two 'min-value traps'. By maintaining the lowest possible values for the first two elements of a potential triplet, I maximize the chances of finding a third element. This approach is highly efficient as it performs a single linear scan with constant O(1) auxiliary space, bypassing the need for expensive dynamic programming or sorting while handling large datasets effortlessly."
                </p>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-amber-800 flex items-center gap-2 mb-4">
                    <AlertCircle size={20} />
                    Senior Interviewer Tips
                </h3>
                <div className="space-y-4 text-sm">
                    <div className="bg-white p-3 rounded border border-amber-100 shadow-sm">
                        <span className="text-xs font-bold text-amber-600 block mb-1 uppercase tracking-widest">SUBSEQUENCE VS SUBARRAY</span>
                        <p className="text-xs text-slate-600 leading-relaxed">Ensure you clarify that you understand the difference. A <strong>subsequence</strong> doesn't need to be contiguous, which is why we don't just check triplets in a sliding window.</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-amber-100 shadow-sm">
                        <span className="text-xs font-bold text-amber-600 block mb-1 uppercase tracking-widest">VARIABLE UPDATES</span>
                        <p className="text-xs text-slate-600 leading-relaxed">Explain that updating 'first' doesn't invalidate 'second'. 'second' is a legacy of a previous 'first'.</p>
                    </div>
                </div>
            </div>

            <div className="bg-emerald-600 text-white rounded-xl p-6 shadow-lg shadow-emerald-100 flex flex-col justify-center">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                    <Check size={20} />
                    Complexity Overview
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div className="bg-emerald-700/50 p-4 rounded-xl border border-emerald-400/30">
                        <div className="font-black text-emerald-100 mb-1 uppercase tracking-widest text-[9px]">Time</div>
                        O(N)
                    </div>
                    <div className="bg-emerald-700/50 p-4 rounded-xl border border-emerald-400/30">
                        <div className="font-black text-emerald-100 mb-1 uppercase tracking-widest text-[9px]">Space</div>
                        O(1)
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Define TabButton component
const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

// Define CodeLineRenderer component
const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|void|Integer|MAX_VALUE|Math|max|length)\b|\b\d+\b)/g).filter(Boolean);

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
          if (['Integer', 'MAX_VALUE', 'Math', 'max', 'length', 'String'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          return part;
        })}
      </pre>
    </div>
  );
};

// Define TopicButton component
const TopicButton: React.FC<{ active: boolean; onClick: () => void; title: string; desc: string }> = ({ active, onClick, title, desc }) => (
  <button 
    onClick={onClick}
    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group
      ${active 
        ? 'bg-emerald-50 border-emerald-500 shadow-md ring-1 ring-emerald-100' 
        : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50'}
    `}
  >
    <div className={`font-black uppercase tracking-tight text-sm ${active ? 'text-emerald-800' : 'text-slate-700 group-hover:text-emerald-700'}`}>
      {title}
    </div>
    <div className={`text-[10px] font-bold mt-1 ${active ? 'text-emerald-600' : 'text-slate-400'}`}>
      {desc}
    </div>
  </button>
);

export default IncreasingTripletVisualizer;