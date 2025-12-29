import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, Check, Copy, AlignLeft, Zap, BarChart3, Trophy, MessageSquare, Target, AlertCircle, Cpu, Layers, MousePointer2, Calculator, FileText } from 'lucide-react';

const APPROACHES = {
  prefixSuffix: {
    id: 'prefixSuffix',
    title: '1. Prefix/Suffix',
    subtitle: 'Dual Pass Arrays',
    icon: <Layers size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] prefix = new int[n];
        int[] suffix = new int[n];
        
        prefix[0] = 1;
        for (int i = 1; i < n; i++) {
            prefix[i] = prefix[i - 1] * nums[i - 1];
        }
        
        suffix[n - 1] = 1;
        for (int i = n - 2; i >= 0; i--) {
            suffix[i] = suffix[i + 1] * nums[i + 1];
        }
        
        int[] res = new int[n];
        for (int i = 0; i < n; i++) {
            res[i] = prefix[i] * suffix[i];
        }
        return res;
    }
}`,
    explanation: "Constructs two arrays: one storing the product of everything to the left of an index, and another for everything to the right. The final answer is simply the product of these two pre-computed values. Very intuitive but uses extra space."
  },
  optimal: {
    id: 'optimal',
    title: '2. Space Optimal',
    subtitle: 'O(1) Aux Space',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] res = new int[n];
        
        // Use result array as prefix storage
        res[0] = 1;
        for (int i = 1; i < n; i++) {
            res[i] = res[i - 1] * nums[i - 1];
        }
        
        // Compute suffix on the fly
        int right = 1;
        for (int i = n - 1; i >= 0; i--) {
            res[i] *= right;
            right *= nums[i];
        }
        return res;
    }
}`,
    explanation: "Optimizes memory by using the output array to store prefix products first. Then, it makes a second pass from the right, maintaining a single 'running product' to update the array in-place. Follows the constraint of constant auxiliary space."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">238. Product of Array Except Self</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given an integer array <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">nums</code>, return <em>an array</em> <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">answer</code> <em>such that</em> <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">answer[i]</code> <em>is equal to the product of all the elements of</em> <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">nums</code> <em>except</em> <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">nums[i]</code>.
        </p>
        <p className="text-lg leading-relaxed">
          The product of any prefix or suffix of <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">nums</code> is <strong>guaranteed</strong> to fit in a <strong>32-bit</strong> integer.
        </p>
        <p className="text-lg font-bold text-slate-800 underline">You must write an algorithm that runs in O(n) time and without using the division operation.</p>
        <div className="space-y-8 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [1,2,3,4]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [24,12,8,6]</p>
            </div>
          </div>
        </div>
        <div className="pt-10 border-t border-slate-100 mt-10">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <AlertCircle size={14} /> Constraints:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">2 {'<='} nums.length {'<='} 10<sup>5</sup></code></li>
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">-30 {'<='} nums[i] {'<='} 30</code></li>
            <li>The product of any prefix or suffix of <code className="bg-slate-100 px-1.5 rounded text-slate-800">nums</code> is <strong>guaranteed</strong> to fit in a <strong>32-bit</strong> integer.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const ProductExceptSelfVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-200">
                <Calculator className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Product of Array Except Self</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">238</span>
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
  const [numsInput, setNumsInput] = useState("1,2,3,4");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const nums = useMemo(() => numsInput.split(',').map(n => parseInt(n.trim()) || 0), [numsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = nums.length;
    
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ phase, description: desc, line, state: { ...state, n, nums: [...nums] } });
    };

    if (selectedApproach === 'prefixSuffix') {
      const prefix = new Array(n).fill(null);
      const suffix = new Array(n).fill(null);
      const res = new Array(n).fill(null);

      addStep("Init", "Initialize prefix and suffix arrays.", 3, { prefix, suffix, res });

      prefix[0] = 1;
      addStep("Prefix Start", "Set prefix[0] = 1 (no elements to the left).", 7, { prefix, suffix, res, i: 0 });

      for (let i = 1; i < n; i++) {
        prefix[i] = prefix[i - 1] * nums[i - 1];
        addStep("Prefix Pass", `prefix[${i}] = prefix[${i-1}] (${prefix[i-1]}) * nums[${i-1}] (${nums[i-1]}) = ${prefix[i]}`, 8, { prefix: [...prefix], suffix, res, i });
      }

      suffix[n - 1] = 1;
      addStep("Suffix Start", "Set suffix[last] = 1 (no elements to the right).", 12, { prefix, suffix, res, i: n - 1 });

      for (let i = n - 2; i >= 0; i--) {
        suffix[i] = suffix[i + 1] * nums[i + 1];
        addStep("Suffix Pass", `suffix[${i}] = suffix[${i+1}] (${suffix[i+1]}) * nums[${i+1}] (${nums[i+1]}) = ${suffix[i]}`, 13, { prefix, suffix: [...suffix], res, i });
      }

      for (let i = 0; i < n; i++) {
        res[i] = prefix[i] * suffix[i];
        addStep("Merge Pass", `res[${i}] = prefix[${i}] (${prefix[i]}) * suffix[${i}] (${suffix[i]}) = ${res[i]}`, 18, { prefix, suffix, res: [...res], i });
      }

      addStep("Finish", "Result array is complete.", 20, { prefix, suffix, res, finished: true });

    } else {
      // Optimal
      const res = new Array(n).fill(null);
      addStep("Init", "Start with the result array.", 3, { res });

      res[0] = 1;
      addStep("Prefix Pass", "Set res[0] = 1.", 7, { res: [...res], i: 0 });

      for (let i = 1; i < n; i++) {
        res[i] = res[i - 1] * nums[i - 1];
        addStep("Prefix Pass", `Compute prefix product for index ${i}: ${res[i]}`, 8, { res: [...res], i });
      }

      let right = 1;
      addStep("Suffix Pass", "Initialize running product 'right' = 1.", 12, { res, right, i: n });

      for (let i = n - 1; i >= 0; i--) {
        const prevRes = res[i];
        res[i] *= right;
        addStep("Update Pass", `res[${i}] *= right (${right}) → ${res[i]}`, 14, { res: [...res], right, i, updating: true });
        right *= nums[i];
        addStep("Update Right", `Update right *= nums[${i}] (${nums[i]}) → ${right}`, 15, { res: [...res], right, i, updatingRight: true });
      }

      addStep("Finish", "All products calculated in-place.", 17, { res, finished: true });
    }

    return steps;
  }, [nums, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const currentState = trace[currentStep] || trace[0];
  const { prefix, suffix, res, i: activeIdx, finished, right, updating, updatingRight } = currentState.state;

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
              <div className="flex items-center gap-2">
                <Code2 size={14} className="text-indigo-400"/>
                <span className="font-bold text-slate-300">Solution.java</span>
              </div>
              <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors">
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
              <div className="flex items-center gap-2 text-indigo-600">
                 <Cpu size={18} />
                 <h4 className="text-sm font-black uppercase tracking-widest">Approach Summary</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{APPROACHES[selectedApproach].explanation}</p>
          </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block pl-1">Input Array (nums)</label>
            <input value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" maxLength={20} />
          </div>

          <div className="flex flex-col gap-5 pt-6 border-t border-slate-100">
            <div className="w-full px-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                    <span>Initial</span>
                    <span className="text-indigo-500">Step {currentStep + 1} of {trace.length}</span>
                    <span>Result</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                    <div className="h-full bg-indigo-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(79,70,229,0.5)]" style={{ width: `${(currentStep / (Math.max(1, trace.length - 1))) * 100}%` }} />
                </div>
            </div>
            <div className="flex items-center justify-between gap-4">
                <button onClick={() => setCurrentStep(0)} className="p-3 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-all" title="Reset Simulation"><RotateCcw size={20}/></button>
                <div className="flex gap-3 flex-1">
                    <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-all disabled:opacity-30 flex items-center justify-center gap-2">
                        <ChevronLeft size={18} /> Prev
                    </button>
                    <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold transition-all disabled:opacity-30 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[450px] relative overflow-hidden flex flex-col justify-center gap-8">
            
            {/* Input Array Display */}
            <div className="flex flex-col items-center">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Input Array (nums)</div>
              <div className="flex gap-2">
                {nums.map((num, idx) => (
                  <div key={idx} className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 ${activeIdx === idx ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-100 scale-110' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                    {num}
                  </div>
                ))}
              </div>
            </div>

            {/* Arrays for Approach 1 */}
            {selectedApproach === 'prefixSuffix' && (
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Prefix Products</div>
                  <div className="flex gap-2">
                    {prefix.map((val, idx) => (
                      <div key={idx} className={`w-12 h-10 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 ${activeIdx === idx && currentState.phase.includes("Prefix") ? 'bg-blue-100 border-blue-500 scale-110 shadow-sm' : val === null ? 'bg-slate-50 border-slate-100 text-slate-200' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                        {val === null ? '?' : val}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-2">Suffix Products</div>
                  <div className="flex gap-2">
                    {suffix.map((val, idx) => (
                      <div key={idx} className={`w-12 h-10 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 ${activeIdx === idx && currentState.phase.includes("Suffix") ? 'bg-purple-100 border-purple-500 scale-110 shadow-sm' : val === null ? 'bg-slate-50 border-slate-100 text-slate-200' : 'bg-purple-50 border-purple-200 text-purple-700'}`}>
                        {val === null ? '?' : val}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Working Result for Approach 2 */}
            <div className="flex flex-col items-center pt-4 border-t border-slate-100">
              <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">Result Array</div>
              <div className="flex gap-2 relative">
                {res.map((val, idx) => {
                  const isActive = activeIdx === idx;
                  const isUpdating = updating && isActive;
                  return (
                    <div key={idx} className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-mono font-black text-lg transition-all duration-500 ${isUpdating ? 'bg-green-500 border-green-600 text-white scale-125 z-10 shadow-xl' : isActive ? 'bg-indigo-50 border-indigo-500 scale-110' : val === null ? 'bg-slate-50 border-slate-100 text-slate-200' : 'bg-indigo-600 text-white border-indigo-700 shadow-md'}`}>
                      {val === null ? '?' : val}
                    </div>
                  );
                })}
                {selectedApproach === 'optimal' && right !== undefined && (
                  <div className={`absolute -right-20 top-0 w-14 h-14 rounded-full border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 ${updatingRight ? 'bg-amber-500 text-white border-amber-600 scale-110 rotate-12' : 'bg-amber-50 border-amber-300 text-amber-700'}`}>
                     <div className="text-[8px] font-black uppercase tracking-tighter">Right</div>
                     <div className="font-mono font-black text-sm">{right}</div>
                  </div>
                )}
              </div>
            </div>

            {finished && (
               <div className="flex justify-center mt-6 animate-in zoom-in duration-500">
                  <div className="bg-green-50 border border-green-200 px-6 py-3 rounded-2xl flex items-center gap-3">
                      <Check className="text-green-600" size={20} />
                      <span className="text-sm font-black text-green-700 uppercase tracking-widest">Calculated Successfully</span>
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
                <TopicButton active={selectedTopic === 'problem'} onClick={() => setSelectedTopic('problem')} title="1. The Constraint" desc="Division is Banned" />
                <TopicButton active={selectedTopic === 'prefix'} onClick={() => setSelectedTopic('prefix')} title="2. Pre-calculating" desc="Prefix and Suffix" />
                <TopicButton active={selectedTopic === 'optimal'} onClick={() => setSelectedTopic('optimal')} title="3. Space Saving" desc="The In-place Trick" />
            </div>

            <div className="lg:col-span-9 bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[600px] flex flex-col">
                {selectedTopic === 'problem' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold mb-1">
                            <AlignLeft size={16}/> Problem Goal
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">The Problem Statement</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Given an array <code>nums</code>, return an array <code>answer</code> such that <code>answer[i]</code> is equal to the product of all the elements of <code>nums</code> except <code>nums[i]</code>.
                        </p>
                        
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 space-y-4">
                            <h3 className="font-bold text-amber-800 flex items-center gap-2"><AlertCircle size={20}/> The "Catch"</h3>
                            <p className="text-amber-900 leading-relaxed">
                                1. You <strong>cannot</strong> use the division operator. (Using division would make it <code>total_product / nums[i]</code>, but that fails if there's a 0).<br/>
                                2. You must solve it in <strong>O(N)</strong> time.
                            </p>
                        </div>

                        <div className="flex items-center gap-6 py-6 border-t border-slate-100">
                          <div className="text-center">
                            <div className="text-xs font-bold text-slate-400 mb-2 uppercase">Input</div>
                            <div className="font-mono text-xl bg-slate-50 border p-3 rounded-lg">[1, 2, 3, 4]</div>
                          </div>
                          <ChevronRight className="text-slate-300 mt-6" />
                          <div className="text-center">
                            <div className="text-xs font-bold text-slate-400 mb-2 uppercase">Output</div>
                            <div className="font-mono text-xl bg-indigo-50 border-indigo-200 border p-3 rounded-lg text-indigo-700 font-bold">[24, 12, 8, 6]</div>
                          </div>
                        </div>
                    </div>
                )}

                {selectedTopic === 'prefix' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">Prefix and Suffix Logic</h2>
                        <p className="text-slate-600 leading-relaxed">
                            For any element <code>nums[i]</code>, the product of everything else is:
                            <br/>
                            <span className="font-bold text-indigo-600">(Product of elements to the LEFT) × (Product of elements to the RIGHT)</span>
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border p-6 rounded-xl bg-blue-50 border-blue-100">
                                <h3 className="font-bold text-blue-800 mb-2">Prefix Array</h3>
                                <p className="text-sm text-blue-700 leading-relaxed">
                                    Stores running product from left to right. <code>prefix[i]</code> contains the product of all numbers before index <code>i</code>.
                                </p>
                            </div>
                            <div className="border p-6 rounded-xl bg-purple-50 border-purple-100">
                                <h3 className="font-bold text-purple-800 mb-2">Suffix Array</h3>
                                <p className="text-sm text-purple-700 leading-relaxed">
                                    Stores running product from right to left. <code>suffix[i]</code> contains the product of all numbers after index <code>i</code>.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                           <div className="text-xs font-bold text-slate-400 uppercase mb-2">Mathematical View</div>
                           <div className="font-mono text-sm leading-relaxed text-slate-600">
                             result[i] = (nums[0] * ... * nums[i-1]) * (nums[i+1] * ... * nums[n-1])
                           </div>
                        </div>
                    </div>
                )}

                {selectedTopic === 'optimal' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">Space Optimization: O(1)</h2>
                        <p className="text-slate-600 leading-relaxed">
                            The prefix and suffix arrays are helpful for understanding, but we can do better by reusing the <strong>result array</strong>.
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0 shadow-sm">1</div>
                                <div>
                                    <span className="font-bold">First Pass:</span> Build the prefix products directly inside the result array.
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0 shadow-sm">2</div>
                                <div>
                                    <span className="font-bold">Second Pass:</span> Walk backward from the end. Maintain a single variable <code>right</code> for the running suffix product, and multiply it into each result element.
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-xl p-6 text-white font-mono text-xs mt-6">
                             <div className="text-indigo-400 mb-2">// The backward pass trick:</div>
                             <div className="text-slate-400">int right = 1;</div>
                             <div className="text-slate-400">for (int i = n - 1; i &gt;= 0; i--) &#123;</div>
                             <div className="text-slate-300">&nbsp;&nbsp;res[i] *= right;</div>
                             <div className="text-slate-300">&nbsp;&nbsp;right *= nums[i];</div>
                             <div className="text-slate-400">&#125;</div>
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
                    <MessageSquare className="text-indigo-500" size={20} />
                    Interview Q&A
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-bold text-slate-800 mb-1">"Why not just divide the total product by nums[i]?"</p>
                        <p>Answer: "Two reasons. First, the problem explicitly forbids it. Second, it's unsafe if the array contains zeros. If there is one zero, all products except the zero's index will be 0. If there are two or more zeros, all products will be 0. Division would require special cases for zeros, while this prefix/suffix method handles them naturally."</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-bold text-slate-800 mb-1">"How do you justify O(1) space if you're creating a result array?"</p>
                        <p>Answer: "In competitive programming and technical interviews, the space used for the output array (the final result) is typically not counted toward the 'auxiliary' space complexity. Only the extra variables or arrays used during the computation count."</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                    <Target className="text-amber-400" size={20} />
                    The "Elite" Pitch
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                    "I implemented an O(N) linear time solution that avoids the forbidden division operator and handles zeros seamlessly. By utilizing the result array to store prefix products and then calculating suffix products in-place with a single running variable, I achieved the optimal constant auxiliary space complexity. This dual-pass approach ensures robustness and performance even on large datasets."
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
                        <span className="text-xs font-bold text-amber-600 block mb-1">ZERO CASE VULNERABILITY</span>
                        <p className="text-xs text-slate-600">Be ready to explain how your code handles zeros. In the prefix/suffix approach, a <code>0</code> at <code>nums[i]</code> will cause all products except index <code>i</code> to become 0 in one of the two passes, which is correct.</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-amber-100 shadow-sm">
                        <span className="text-xs font-bold text-amber-600 block mb-1">NUMERICAL STABILITY</span>
                        <p className="text-xs text-slate-600">On extremely large arrays of large integers, products can overflow. Mention that in production, you might need to use 64-bit integers (longs) or handle overflow exceptions.</p>
                    </div>
                </div>
            </div>

            <div className="bg-indigo-600 text-white rounded-xl p-6 shadow-lg shadow-indigo-100">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                    <Check size={20} />
                    Complexity Overview
                </h3>
                <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono">
                    <div className="bg-indigo-700/50 p-4 rounded-xl border border-indigo-400/30">
                        <div className="font-black text-indigo-100 mb-1 uppercase tracking-widest text-[9px]">Time Complexity</div>
                        O(N) (Two Passes)
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
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|Math)\b|\b\d+\b|\b(?:length|substring|res|prefix|suffix|right)\b)/g).filter(Boolean);

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
          if (['String', 'Math', 'res', 'prefix', 'suffix', 'right'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['length', 'substring'].includes(part)) return <span key={i} className="text-indigo-300 font-bold">{part}</span>;
          return part;
        })}
      </pre>
    </div>
  );
};

const TopicButton: React.FC<{ active: boolean; onClick: () => void; title: string; desc: string }> = ({ active, onClick, title, desc }) => (
  <button 
    onClick={onClick}
    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group
      ${active 
        ? 'bg-indigo-50 border-indigo-500 shadow-md ring-1 ring-indigo-200' 
        : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}
    `}
  >
    <div className={`font-bold ${active ? 'text-indigo-800' : 'text-slate-700 group-hover:text-indigo-700'}`}>
      {title}
    </div>
    <div className={`text-xs mt-1 ${active ? 'text-indigo-600' : 'text-slate-400'}`}>
      {desc}
    </div>
  </button>
);

export default ProductExceptSelfVisualizer;