import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, Check, Copy, AlignLeft, Zap, Trophy, MessageSquare, Target, AlertCircle, Cpu, Scale, ArrowRight, ArrowLeft, Layers, FileText } from 'lucide-react';

const APPROACHES = {
  brute: {
    id: 'brute',
    title: '1. Brute Force',
    subtitle: 'Dual Nested Scans',
    icon: <Scale size={16} />,
    complexity: 'Time: O(N²) | Space: O(1)',
    code: `class Solution {
    public int pivotIndex(int[] nums) {
        for (int i = 0; i < nums.length; i++) {
            int leftSum = 0;
            for (int j = 0; j < i; j++) leftSum += nums[j];
            
            int rightSum = 0;
            for (int j = i + 1; j < nums.length; j++) rightSum += nums[j];
            
            if (leftSum == rightSum) return i;
        }
        return -1;
    }
}`,
    explanation: "The literal interpretation of the problem. For every index, we manually sum the left side and the right side independently. This results in quadratic time because we repeat millions of additions."
  },
  optimal: {
    id: 'optimal',
    title: '2. Optimal Prefix',
    subtitle: 'Constant Difference',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int pivotIndex(int[] nums) {
        int totalSum = 0, leftSum = 0;
        for (int x : nums) totalSum += x;
        
        for (int i = 0; i < nums.length; i++) {
            if (leftSum == totalSum - leftSum - nums[i]) {
                return i;
            }
            leftSum += nums[i];
        }
        return -1;
    }
}`,
    explanation: "The elegant mathematical solution. By pre-calculating the total sum, we can derive the 'right sum' in constant time using algebra: Right = Total - Left - Current. This reduces the problem to two linear passes."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">724. Find Pivot Index</h2>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given an array of integers <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">nums</code>, calculate the <strong>pivot index</strong> of this array.
        </p>
        
        <p className="text-lg leading-relaxed">
          The <strong>pivot index</strong> is the index where the sum of all the numbers <strong>strictly</strong> to the left of the index is equal to the sum of all the numbers strictly to the index's right.
        </p>

        <p className="text-lg leading-relaxed">
          If the index is on the left edge of the array, the left sum is <code className="font-bold text-slate-800">0</code> because there are no elements to the left. This also applies to the right edge of the array.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 italic underline">
          Return the leftmost pivot index. If no such index exists, return -1.
        </p>

        <div className="space-y-8 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [1,7,3,6,5,6]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 3</p>
              <p className="text-xs text-slate-500 italic mt-2">Explanation: Left sum = 1+7+3 = 11. Right sum = 5+6 = 11.</p>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-100 mt-10">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <AlertCircle size={14} /> Constraints:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">1 {'<='} nums.length {'<='} 10<sup>4</sup></code></li>
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">-1000 {'<='} nums[i] {'<='} 1000</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const PivotIndexVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-200">
                <Scale className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Find Pivot Index</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">724</span>
                <span>LeetCode 75 • Easy</span>
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
  const [numsInput, setNumsInput] = useState("1,7,3,6,5,6");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const nums = useMemo(() => numsInput.split(',').map(n => parseInt(n.trim()) || 0), [numsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = nums.length;
    let totalSum = 0;
    let leftSum = 0;

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ phase, description: desc, line, state: { ...state, nums: [...nums] } });
    };

    if (selectedApproach === 'brute') {
      addStep("Init", "Start checking each index sequentially.", 3, { pivot: -1, left: 0, right: 0 });
      for (let i = 0; i < n; i++) {
        let l = 0;
        addStep("Left Sum", `Calculating left sum for index ${i}.`, 5, { pivot: i, left: 0, right: 0, scanning: 'left' });
        for (let j = 0; j < i; j++) l += nums[j];
        
        let r = 0;
        addStep("Right Sum", `Calculating right sum for index ${i}.`, 8, { pivot: i, left: l, right: 0, scanning: 'right' });
        for (let j = i + 1; j < n; j++) r += nums[j];
        
        const match = l === r;
        addStep("Check", `Comparing sums: ${l} vs ${r}. ${match ? 'MATCH!' : 'Mismatch.'}`, 11, { pivot: i, left: l, right: r, matched: match });
        if (match) return steps;
      }
    } else {
      // Optimal
      addStep("Total Sum", "Step 1: Calculate the sum of the entire array.", 4, { left: 0, total: 0 });
      for (let x of nums) totalSum += x;
      addStep("Total Ready", `Sum calculated: ${totalSum}. Now iterating to find equilibrium.`, 5, { left: 0, total: totalSum });

      for (let i = 0; i < n; i++) {
        const rightSum = totalSum - leftSum - nums[i];
        const match = leftSum === rightSum;
        addStep("Evaluate", `Index ${i}: Left=${leftSum}, Right=${totalSum}-${leftSum}-${nums[i]}=${rightSum}.`, 7, { pivot: i, left: leftSum, right: rightSum, total: totalSum, matched: match });
        
        if (match) {
          addStep("Success", `Equilibrium found at index ${i}!`, 8, { pivot: i, left: leftSum, right: rightSum, total: totalSum, finished: true, success: true });
          return steps;
        }
        leftSum += nums[i];
      }
    }

    addStep("Fail", "Reached end of array. No pivot index exists.", 11, { finished: true, success: false });
    return steps;
  }, [nums, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const currentState = trace[currentStep] || trace[0];
  const { pivot, left, right, matched, finished, success, total } = currentState.state;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      
      {/* Left Column */}
      <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-sm overflow-hidden">
             {(Object.keys(APPROACHES) as Array<keyof typeof APPROACHES>).map((key) => (
                <button key={key} onClick={() => { setSelectedApproach(key); setCurrentStep(0); }} className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}>
                  <div className={`mb-1 transition-transform duration-300 ${selectedApproach === key ? 'scale-110' : ''}`}>{APPROACHES[key].icon}</div>
                  <span className="text-xs font-black uppercase tracking-tight">{APPROACHES[key].title}</span>
                  <span className={`text-[10px] opacity-70 ${selectedApproach === key ? 'text-white' : 'text-slate-400'}`}>{APPROACHES[key].complexity}</span>
                </button>
             ))}
          </div>

          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[400px]">
            <div className="bg-[#1e293b] px-4 py-3 text-xs font-mono text-slate-400 flex justify-between items-center border-b border-slate-800/50">
              <div className="flex items-center gap-2">
                <Code2 size={14} className="text-indigo-400"/>
                <span className="font-bold text-slate-300">Solution.java</span>
              </div>
              <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors group">
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
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block pl-1">Input Array</label>
            <input value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" maxLength={30} />
          </div>

          <div className="flex flex-col gap-5 pt-6 border-t border-slate-100">
            <div className="w-full px-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                    <span>Scan</span>
                    <span className="text-indigo-500">Step {currentStep + 1}</span>
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
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-indigo-500/20 p-1.5 rounded-lg">
                <Target size={14} className="text-indigo-400"/>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Simulation Details</span>
            </div>
            <div className="text-lg font-black tracking-tight mb-2 uppercase">{currentState.phase}</div>
            <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-700/50">{currentState.description}</p>
        </div>

        {/* Visual Arena */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[350px] relative overflow-hidden flex flex-col justify-center items-center gap-8">
            
            <div className="flex gap-12 items-center">
                <div className="text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Left Sum</span>
                    <div className="text-2xl font-black text-indigo-600">{left}</div>
                </div>
                <div className="flex flex-col items-center">
                    <Scale size={24} className={`${matched ? 'text-green-500' : 'text-slate-200'}`} />
                    <span className="text-[10px] font-black text-slate-400 uppercase mt-1">Balance</span>
                </div>
                <div className="text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Right Sum</span>
                    <div className="text-2xl font-black text-indigo-600">{right}</div>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 relative px-10">
                {nums.map((num, nIdx) => {
                    const isPivot = pivot === nIdx;
                    const isLeftRegion = nIdx < pivot;
                    const isRightRegion = nIdx > pivot;

                    let bgClass = "bg-white";
                    let borderClass = "border-slate-200";
                    let textClass = "text-slate-700 font-bold";

                    if (isPivot) {
                        bgClass = matched ? "bg-green-500" : "bg-indigo-600";
                        borderClass = matched ? "border-green-600" : "border-indigo-700";
                        textClass = "text-white font-black scale-125 z-10 shadow-lg";
                    } else if (isLeftRegion) {
                        bgClass = "bg-indigo-50";
                        borderClass = "border-indigo-200";
                        textClass = "text-indigo-700";
                    } else if (isRightRegion) {
                        bgClass = "bg-slate-50";
                        borderClass = "border-slate-200";
                        textClass = "text-slate-400";
                    }

                    return (
                        <div key={nIdx} className="flex flex-col items-center transition-all duration-300">
                            <div className={`
                                w-10 h-12 border-2 rounded-xl flex items-center justify-center font-mono text-lg transition-all duration-300 relative
                                ${bgClass} ${borderClass} ${textClass}
                            `}>
                                {num}
                            </div>
                            <span className="mt-2 text-[10px] font-mono font-black text-slate-300">[{nIdx}]</span>
                        </div>
                    );
                })}
            </div>

            {finished && (
               <div className="animate-in zoom-in duration-500">
                  <div className={`bg-white border-2 px-10 py-6 rounded-3xl flex flex-col items-center gap-2 shadow-xl ${success ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
                      {success ? <Check className="text-green-600" size={40} /> : <Target className="text-red-600" size={40} />}
                      <span className="text-xs font-black uppercase tracking-widest text-slate-500">Pivot Index</span>
                      <span className="text-4xl font-black text-slate-900">{success ? pivot : '-1'}</span>
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
                <TopicButton active={selectedTopic === 'rules'} onClick={() => setSelectedTopic('rules')} title="1. Pivot Logic" desc="The Strict Boundary Rule" />
                <TopicButton active={selectedTopic === 'math'} onClick={() => setSelectedTopic('math')} title="2. Math Optimization" desc="Total Sum Derivation" />
                <TopicButton active={selectedTopic === 'efficiency'} onClick={() => setSelectedTopic('efficiency')} title="3. Efficiency" desc="Complexity Deep-Dive" />
            </div>

            <div className="lg:col-span-9 bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col">
                {selectedTopic === 'rules' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold mb-1">
                            <AlignLeft size={16}/> Problem Intuition
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">What is a Pivot?</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            An index <code>i</code> is a pivot if <code>Sum(nums[0]...nums[i-1]) == Sum(nums[i+1]...nums[n-1])</code>.
                        </p>
                        
                        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-4">
                            <h3 className="font-bold text-indigo-800 flex items-center gap-2"><Scale size={20}/> Strictly Left/Right</h3>
                            <p className="text-indigo-900 text-sm">
                                The pivot element itself is <strong>not</strong> part of either sum. It is the center of the seesaw.
                            </p>
                        </div>
                    </div>
                )}

                {selectedTopic === 'math' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800 font-black tracking-tight text-indigo-900">Optimal Derivation</h2>
                        <p className="text-slate-600 leading-relaxed">
                            If you know the total sum, you don't need a loop to find the right side.
                        </p>
                        
                        <div className="bg-slate-900 p-6 rounded-2xl text-white space-y-4 shadow-2xl">
                             <div className="text-indigo-400 font-mono text-sm">RightSum = TotalSum - LeftSum - nums[i]</div>
                             <p className="text-sm text-slate-400">
                                This allows us to find the right sum in <b>constant O(1) time</b> for every index we check, reducing the overall complexity to linear.
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
        <div className="space-y-6 text-slate-800">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 font-black uppercase tracking-tight">
                    <MessageSquare className="text-indigo-500" size={20} />
                    Interview Q&A
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"Why do we pre-calculate the total sum?"</p>
                        <p>Answer: "To transform a nested summation O(N²) into a constant-time check. By deriving the right side from the total, we eliminate the need for repeated scans."</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg border-l-4 border-indigo-500">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 uppercase tracking-widest text-indigo-400">
                    <Target size={20} />
                    The Elite Pitch
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                    "I implemented an O(N) linear time solution that identifies the leftmost equilibrium point by utilizing a prefix sum technique. By first establishing the global sum, I can efficiently derive the right-hand sum in constant time for each element. This avoids the O(N²) quadratic cost of naive re-summation while maintaining optimal O(1) auxiliary space complexity."
                </p>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-indigo-600 text-white rounded-xl p-6 shadow-lg shadow-indigo-100 flex flex-col justify-center">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                    <Check size={20} />
                    Complexity Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono">
                    <div className="bg-indigo-700/50 p-4 rounded-xl border border-indigo-400/30">
                        <div className="font-black text-indigo-100 mb-1 uppercase tracking-widest text-[9px]">Time Complexity</div>
                        O(N) (Linear)
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
  <button onClick={onClick} className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group ${active ? 'bg-indigo-50 border-indigo-500 shadow-md ring-1 ring-indigo-100' : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}>
    <div className={`font-black uppercase tracking-tight text-sm ${active ? 'text-blue-800' : 'text-slate-700 group-hover:text-blue-700'}`}>{title}</div>
    <div className={`text-[10px] font-bold mt-1 ${active ? 'text-indigo-600' : 'text-slate-400'}`}>{desc}</div>
  </button>
);

export default PivotIndexVisualizer;