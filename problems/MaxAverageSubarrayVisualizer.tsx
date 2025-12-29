import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, Check, Copy, AlignLeft, Zap, Trophy, MessageSquare, Target, AlertCircle, Cpu, MousePointer2, Calculator, ArrowRight, Minus, Plus, Search, History, BarChart3 } from 'lucide-react';

const APPROACHES = {
  brute: {
    id: 'brute',
    title: '1. Brute Force',
    subtitle: 'Exhaustive Summation',
    icon: <Search size={16} />,
    complexity: 'Time: O(N * K) | Space: O(1)',
    code: `class Solution {
    public double findMaxAverage(int[] nums, int k) {
        double max = -Double.MAX_VALUE;
        for (int i = 0; i <= nums.length - k; i++) {
            double currentSum = 0;
            for (int j = i; j < i + k; j++) {
                currentSum += nums[j];
            }
            max = Math.max(max, currentSum);
        }
        return max / k;
    }
}`,
    explanation: "The naive way. For every possible starting index 'i', we perform a full scan of the next 'k' elements to find their sum. This results in many redundant additions because overlapping elements are summed multiple times."
  },
  optimal: {
    id: 'optimal',
    title: '2. Sliding Window',
    subtitle: 'Incremental Updates',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public double findMaxAverage(int[] nums, int k) {
        double sum = 0;
        for (int i = 0; i < k; i++) {
            sum += nums[i];
        }
        
        double max = sum;
        for (int i = k; i < nums.length; i++) {
            sum += nums[i] - nums[i - k];
            max = Math.max(max, sum);
        }
        
        return max / k;
    }
}`,
    explanation: "The professional standard. We calculate the initial window sum once. Then, as we 'slide' the window, we simply subtract the element that fell off the back and add the new element at the front. This reduces the per-step cost to O(1)."
  }
};

const MaxAverageSubarrayVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'learn' | 'interview'>('visualizer');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-200">
                <Calculator className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Max Average Subarray</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">643</span>
                <span>LeetCode 75 • Easy</span>
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
  const [numsInput, setNumsInput] = useState("1,12,-5,-6,50,3");
  const [kInput, setKInput] = useState(4);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const nums = useMemo(() => numsInput.split(',').map(n => parseInt(n.trim()) || 0), [numsInput]);
  const k = parseInt(kInput.toString()) || 1;

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = nums.length;
    let max = -Infinity;

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ phase, description: desc, line, state: { ...state, nums: [...nums], k } });
    };

    if (selectedApproach === 'brute') {
      addStep("Init", "Initialize max sum to a very small value.", 3, { max: -Infinity });
      for (let i = 0; i <= n - k; i++) {
        let currentSum = 0;
        addStep("Outer Loop", `Starting new subarray scan from index ${i}.`, 4, { i, max, currentSum: 0 });
        for (let j = i; j < i + k; j++) {
            currentSum += nums[j];
            addStep("Inner Loop", `Adding nums[${j}] (${nums[j]}) to current sum.`, 6, { i, j, max, currentSum });
        }
        const prevMax = max;
        max = Math.max(max, currentSum);
        addStep("Compare", `Finished scan. Subarray sum is ${currentSum}. ${currentSum > prevMax ? 'New maximum!' : 'Maximum remains ' + max}.`, 9, { i, max, currentSum, highlightMax: currentSum > prevMax });
      }
    } else {
      // Optimal Sliding Window
      let sum = 0;
      addStep("Init", "Start by calculating the sum of the first window.", 3, { sum: 0, max: -Infinity, i: -1 });
      
      for (let i = 0; i < k && i < n; i++) {
          sum += nums[i];
          addStep("Warm Up", `Adding nums[${i}] (${nums[i]}) to initial window.`, 4, { sum, max: -Infinity, windowEnd: i });
      }
      
      max = sum;
      addStep("Base Set", `First window sum: ${sum}. Setting max benchmark.`, 8, { sum, max, windowStart: 0, windowEnd: k-1 });

      for (let i = k; i < n; i++) {
          const leavingIdx = i - k;
          const enteringIdx = i;
          const prevMax = max;
          sum = sum + nums[enteringIdx] - nums[leavingIdx];
          const isNewMax = sum > max;
          if (isNewMax) max = sum;

          addStep("Slide", `Subtract nums[${leavingIdx}] (${nums[leavingIdx]}), Add nums[${enteringIdx}] (${nums[enteringIdx]}).`, 11, { 
              sum, 
              max: prevMax, 
              windowStart: leavingIdx + 1, 
              windowEnd: enteringIdx,
              leaving: leavingIdx,
              entering: enteringIdx
          });
          
          if (isNewMax) {
              addStep("New Max", `New highest sum found: ${sum}!`, 12, { 
                  sum, 
                  max, 
                  windowStart: leavingIdx + 1, 
                  windowEnd: enteringIdx,
                  highlightMax: true
              });
          }
      }
    }

    addStep("Finish", `Final calculation: Max average = ${max} / ${k} = ${(max/k).toFixed(5)}`, 16, { max, finished: true });
    return steps;
  }, [nums, k, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(APPROACHES[selectedApproach].code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const currentState = trace[currentStep] || trace[0];
  const { sum: currentSumState, max, windowStart, windowEnd, leaving, entering, finished, highlightMax, i: bruteI, j: bruteJ } = currentState.state;

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

          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[450px]">
            <div className="bg-[#1e293b] px-4 py-3 text-xs font-mono text-slate-400 flex justify-between items-center border-b border-slate-800/50">
              <div className="flex items-center gap-2 text-blue-400 font-bold">Solution.java</div>
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
              <div className="flex items-center gap-2 text-blue-600">
                 <Cpu size={18} />
                 <h4 className="text-sm font-black uppercase tracking-widest">Logic Insight</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{APPROACHES[selectedApproach].explanation}</p>
          </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block pl-1">Input Array</label>
              <input value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-purple-600 uppercase tracking-widest block pl-1">Window Size (k)</label>
              <input type="number" value={kInput} onChange={(e) => { setKInput(parseInt(e.target.value) || 1); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner" />
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-6 border-t border-slate-100">
            <div className="w-full px-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                    <span>Scan</span>
                    <span className="text-indigo-500">Step {currentStep + 1} / {trace.length}</span>
                    <span>Result</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                    <div className="h-full bg-blue-500 transition-all duration-500 ease-out" style={{ width: `${(currentStep / (Math.max(1, trace.length - 1))) * 100}%` }} />
                </div>
            </div>
            <div className="flex items-center justify-between gap-4">
                <button onClick={() => setCurrentStep(0)} className="p-3 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-all" title="Reset Simulation"><RotateCcw size={20}/></button>
                <div className="flex gap-3 flex-1">
                    <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-all disabled:opacity-30 flex items-center justify-center gap-2">
                        <ChevronLeft size={18} /> Prev
                    </button>
                    <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold transition-all disabled:opacity-30 shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                        Advance Action <ChevronRight size={18} />
                    </button>
                </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3 text-slate-400">
              <Target size={14}/>
              <span className="text-[10px] font-black uppercase tracking-widest">Process Flow</span>
            </div>
            <div className="text-lg font-black tracking-tight mb-2 uppercase">{currentState.phase}</div>
            <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-700/50">{currentState.description}</p>
        </div>

        {/* Visual Arena */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[400px] relative overflow-hidden flex flex-col justify-center items-center gap-12">
            
            {/* Dashboard */}
            <div className="flex gap-10">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Window Sum</span>
                    <div className="text-3xl font-black text-slate-800 tabular-nums">
                        {selectedApproach === 'optimal' ? (currentSumState ?? 0) : (currentState.state.currentSum ?? 0)}
                    </div>
                </div>
                <div className="h-10 w-px bg-slate-100 self-end" />
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Max Found</span>
                    <div className={`text-3xl font-black tabular-nums transition-all duration-300 ${highlightMax ? 'text-green-500 scale-125' : 'text-blue-600'}`}>{max === -Infinity ? '-' : max}</div>
                </div>
            </div>

            {/* Sliding Visuals */}
            <div className="flex flex-wrap justify-center gap-3 relative px-10">
                {nums.map((val, idx) => {
                    let isInside = false;
                    let isLeaving = false;
                    let isEntering = false;
                    let isPointer = false;

                    if (selectedApproach === 'optimal') {
                        isInside = windowStart !== undefined && idx >= windowStart && idx <= windowEnd;
                        isLeaving = leaving === idx;
                        isEntering = entering === idx;
                    } else {
                        isInside = bruteI !== undefined && idx >= bruteI && idx < bruteI + k;
                        isPointer = bruteJ === idx;
                    }

                    let bgClass = "bg-white";
                    let borderClass = "border-slate-200";
                    let textClass = "text-slate-600 font-bold";

                    if (isInside) {
                        bgClass = "bg-blue-50 shadow-sm";
                        borderClass = "border-blue-400";
                        textClass = "text-blue-700 font-black";
                    }
                    
                    if (isLeaving) {
                        bgClass = "bg-rose-50";
                        borderClass = "border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.3)] scale-90 opacity-50";
                        textClass = "text-rose-600";
                    }

                    if (isEntering) {
                        bgClass = "bg-green-50 animate-pulse";
                        borderClass = "border-green-400 shadow-lg scale-110 z-10";
                        textClass = "text-green-700 font-black";
                    }

                    if (isPointer) {
                        borderClass = "border-blue-600 ring-2 ring-blue-100 z-10";
                    }

                    return (
                        <div key={idx} className="flex flex-col items-center transition-all duration-500">
                            <div className={`
                                w-14 h-16 border-2 rounded-xl flex items-center justify-center font-mono text-xl transition-all duration-300 relative
                                ${bgClass} ${borderClass} ${textClass}
                            `}>
                                {val}
                                {isLeaving && (
                                    <div className="absolute -top-6 text-rose-500 font-black text-[9px] flex items-center gap-0.5">
                                        <Minus size={10} strokeWidth={4} /> OUT
                                    </div>
                                )}
                                {isEntering && (
                                    <div className="absolute -top-6 text-green-500 font-black text-[9px] flex items-center gap-0.5">
                                        <Plus size={10} strokeWidth={4} /> IN
                                    </div>
                                )}
                            </div>
                            <span className="mt-2 text-[10px] font-mono font-black text-slate-300">[{idx}]</span>
                        </div>
                    );
                })}
            </div>

            {finished && (
                 <div className="bg-blue-50 border-2 border-blue-200 px-10 py-6 rounded-3xl flex flex-col items-center gap-2 shadow-xl animate-in zoom-in">
                    <Check className="text-green-600" size={40} />
                    <span className="text-xs font-black uppercase tracking-widest text-blue-700">Final Max Average</span>
                    <span className="text-4xl font-black text-slate-900">{(max/k).toFixed(5)}</span>
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
                <TopicButton active={selectedTopic === 'window'} onClick={() => setSelectedTopic('window')} title="1. Fixed Window" desc="Why reuse sums?" />
                <TopicButton active={selectedTopic === 'math'} onClick={() => setSelectedTopic('math')} title="2. The Slide Trick" desc="Add IN, Sub OUT" />
                <TopicButton active={selectedTopic === 'averages'} onClick={() => setSelectedTopic('averages')} title="3. Average vs Sum" desc="Numerical Precision" />
                <TopicButton active={selectedTopic === 'redundancy'} onClick={() => setSelectedTopic('redundancy')} title="4. Brute Redundancy" desc="The O(NK) Problem" />
            </div>

            <div className="lg:col-span-9 bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[550px] flex flex-col">
                {selectedTopic === 'window' && (
                    <div className="space-y-6 animate-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold mb-1">
                            <AlignLeft size={16}/> Core Pattern
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">The Fixed-Size Window</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Think of a sliding window as a physical frame on a conveyor belt. Instead of re-examining everything in the frame, you only care about the <strong>front</strong> and the <strong>back</strong>.
                        </p>
                        
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-4">
                            <h3 className="font-bold text-blue-800 flex items-center gap-2"><Target size={20}/> The Strategy</h3>
                            <p className="text-sm text-blue-900 leading-relaxed">
                                1. Calculate the initial sum of size <code>k</code>.<br/>
                                2. Slide the frame one position to the right.<br/>
                                3. Update the sum by adding the new element and removing the old one.
                            </p>
                        </div>
                    </div>
                )}

                {selectedTopic === 'math' && (
                    <div className="space-y-6 animate-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800 font-black tracking-tight text-indigo-900">Incremental Math</h2>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            Observe that as the window moves from index <code>i</code> to <code>i+1</code>, most of the numbers stay the same.
                        </p>
                        
                        <div className="flex justify-center py-6">
                            <div className="bg-slate-900 p-6 rounded-3xl text-white font-mono text-center shadow-2xl space-y-3">
                                <div className="text-rose-400 flex items-center gap-2 justify-center"><Minus size={14}/> Subtract leaving: <code>nums[i - k]</code></div>
                                <div className="text-green-400 flex items-center gap-2 justify-center"><Plus size={14}/> Add entering: <code>nums[i]</code></div>
                                <div className="h-px bg-slate-700 w-full" />
                                <div className="text-blue-400 font-black tracking-widest">RESULT: O(1) WORK PER STEP</div>
                            </div>
                        </div>
                    </div>
                )}

                {selectedTopic === 'averages' && (
                    <div className="space-y-6 animate-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">Sum First, Average Later</h2>
                        <p className="text-slate-600 leading-relaxed">
                           Professional implementations maintain the <b>Sum</b>, not the <b>Average</b>, while sliding.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <span className="font-black text-slate-700 text-xs uppercase tracking-widest">Precision</span>
                                <p className="text-xs text-slate-500 mt-2">Division introduces floating point errors. Summing integers first avoids cumulative error.</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <span className="font-black text-slate-700 text-xs uppercase tracking-widest">Performance</span>
                                <p className="text-xs text-slate-500 mt-2">Addition/Subtraction is faster than Division. One final division is cheaper than N divisions.</p>
                            </div>
                        </div>
                    </div>
                )}

                {selectedTopic === 'redundancy' && (
                    <div className="space-y-6 animate-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">The Brute Force Penalty</h2>
                        <p className="text-slate-600 leading-relaxed text-lg italic">
                           "If K is 10,000 and N is 1,000,000, Brute Force does 10 BILLION additions."
                        </p>
                        
                        <div className="bg-slate-900 p-6 rounded-2xl text-white space-y-4 shadow-2xl border-l-4 border-blue-500">
                            <div className="flex gap-2 items-center text-xs font-bold text-blue-400 uppercase tracking-widest">
                                <History size={14}/> Redundancy Map
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Scan 1: [A, B, C, D] <br/>
                                Scan 2: &nbsp;&nbsp;&nbsp;[B, C, D, E]
                                <br/><br/>
                                Notice B, C, and D are summed again in Scan 2. Sliding window reuses them, performing only 1 subtraction and 1 addition instead of 4 additions.
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
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 font-black uppercase tracking-tight">
                    <MessageSquare className="text-blue-500" size={20} />
                    Interview Q&A
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"Why not calculate average in the loop?"</p>
                        <p>Answer: "For precision and speed. Integers are more stable than doubles. Calculating the sum and doing a single division at the end maintains maximum accuracy and saves O(N) expensive division operations."</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"How do you handle k = 0?"</p>
                        <p>Answer: "Per constraints, k is usually &ge; 1. If k=0, the average is undefined. In production, I'd throw an IllegalArgumentException or check constraints before execution."</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 uppercase tracking-widest text-blue-400">
                    <Target size={20} />
                    The Senior Engineer Pitch
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                    "I implemented an O(N) sliding window solution with constant O(1) space. By decoupling the summation from the averaging, I minimized redundant arithmetic and ensured numerical precision. The window slides in linear time by incrementally updating the current total, which scales efficiently even for large window sizes where a brute-force O(NK) approach would degrade performance."
                </p>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-amber-800 flex items-center gap-2 mb-4 uppercase tracking-widest">
                    <AlertCircle size={20} />
                    Pro Insights
                </h3>
                <div className="space-y-4 text-sm">
                    <div className="bg-white p-3 rounded border border-amber-100 shadow-sm">
                        <span className="text-[10px] font-black text-amber-600 block mb-1 uppercase tracking-widest">WARM UP PHASE</span>
                        <p className="text-xs text-slate-600 leading-relaxed">Explicitly mention the warm-up loop. It shows you understand that the sliding logic only begins once the window is full.</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-amber-100 shadow-sm">
                        <span className="text-[10px] font-black text-amber-600 block mb-1 uppercase tracking-widest">OVERFLOW SAFETY</span>
                        <p className="text-xs text-slate-600 leading-relaxed">In Java, if the integers in <code>nums</code> are very large, the <code>sum</code> could overflow a 32-bit int. Use a <code>double</code> or <code>long</code> for the sum to be safe.</p>
                    </div>
                </div>
            </div>

            <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg shadow-blue-100">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                    <Check size={20} />
                    Complexity Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono">
                    <div className="bg-blue-700/50 p-4 rounded-xl border border-blue-400/30">
                        <div className="font-black text-blue-100 mb-1 uppercase tracking-widest text-[9px]">Time Complexity</div>
                        O(N) (Linear)
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
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|void|double|Math|max|Double|MAX_VALUE)\b|\b\d+\b)/g).filter(Boolean);

  return (
    <div className={`flex relative z-10 group min-h-[20.8px] ${active ? 'font-bold' : ''}`}>
      <span className="w-8 select-none text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-xs">{num}</span>
      <pre className={`font-mono whitespace-pre text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-orange-300">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-cyan-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'void', 'for'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean', 'double'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['Math', 'max', 'Double', 'MAX_VALUE'].includes(part)) return <span key={i} className="text-indigo-300 font-bold">{part}</span>;
          return part;
        })}
      </pre>
    </div>
  );
};

const TopicButton: React.FC<{ active: boolean; onClick: () => void; title: string; desc: string }> = ({ active, onClick, title, desc }) => (
  <button 
    onClick={onClick}
    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group
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

export default MaxAverageSubarrayVisualizer;