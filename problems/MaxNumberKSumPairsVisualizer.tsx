import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, Check, Copy, AlignLeft, Zap, Trophy, MessageSquare, Target, AlertCircle, Cpu, MousePointer2, Calculator, Layers, ArrowRightLeft, Search, FileText } from 'lucide-react';

const APPROACHES = {
  sorting: {
    id: 'sorting',
    title: '1. Two Pointers',
    subtitle: 'Sort & Converge',
    icon: <ArrowRightLeft size={16} />,
    complexity: 'Time: O(N log N) | Space: O(1) or O(N)',
    code: `class Solution {
    public int maxOperations(int[] nums, int k) {
        Arrays.sort(nums);
        int left = 0, right = nums.length - 1;
        int operations = 0;

        while (left < right) {
            int sum = nums[left] + nums[right];
            if (sum == k) {
                operations++;
                left++;
                right--;
            } else if (sum < k) {
                left++;
            } else {
                right--;
            }
        }
        return operations;
    }
}`,
    explanation: "By sorting the array, we can use two pointers to find pairs that sum to k. If the sum is too small, we move the left pointer to increase it. If too large, we move the right pointer to decrease it. If exact, we've found a pair!"
  },
  hashmap: {
    id: 'hashmap',
    title: '2. Hash Map',
    subtitle: 'Frequency Tracking',
    icon: <Search size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public int maxOperations(int[] nums, int k) {
        Map<Integer, Integer> map = new HashMap<>();
        int count = 0;
        for (int i : nums) {
            int complement = k - i;
            if (map.getOrDefault(complement, 0) > 0) {
                count++;
                map.put(complement, map.get(complement) - 1);
            } else {
                map.put(i, map.getOrDefault(i, 0) + 1);
            }
        }
        return count;
    }
}`,
    explanation: "Uses a frequency map to track available numbers. For each number, we check if its 'complement' (k - i) is already in the map. If it is, we form a pair and decrement the complement's count."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">1679. Max Number of K-Sum Pairs</h2>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          You are given an integer array <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">nums</code> and an integer <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">k</code>.
        </p>
        
        <p className="text-lg leading-relaxed">
          In one operation, you can pick two numbers from the array whose sum equals <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">k</code> and remove them from the array.
        </p>

        <p className="text-lg leading-relaxed">
          Return <em>the maximum number of operations you can perform on the array.</em>
        </p>

        <div className="space-y-8 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [1,2,3,4], k = 5</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 2</p>
              <p className="text-xs text-slate-500 italic mt-2">Explanation: Starting with nums = [1,2,3,4]:<br/>- Remove numbers 1 and 4, then nums = [2,3]<br/>- Remove numbers 2 and 3, then nums = []<br/>There are no more pairs that sum up to 5, hence a total of 2 operations.</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [3,1,3,4,3], k = 6</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 1</p>
              <p className="text-xs text-slate-500 italic mt-2">Explanation: Starting with nums = [3,1,3,4,3]:<br/>- Remove the first two 3's, then nums = [1,4,3]<br/>There are no more pairs that sum up to 6, hence a total of 1 operation.</p>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-100 mt-10">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <AlertCircle size={14} /> Constraints:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">1 {'<='} nums.length {'<='} 10<sup>5</sup></code></li>
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">1 {'<='} nums[i] {'<='} 10<sup>9</sup></code></li>
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">1 {'<='} k {'<='} 10<sup>9</sup></code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const MaxNumberKSumPairsVisualizer = () => {
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Max K-Sum Pairs</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">1679</span>
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
  const [selectedApproach, setSelectedApproach] = useState<keyof typeof APPROACHES>('sorting');
  const [numsInput, setNumsInput] = useState("1,2,3,4");
  const [kInput, setKInput] = useState(5);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const initialNums = useMemo(() => {
    const arr = numsInput.split(',').map(n => parseInt(n.trim()) || 0);
    return selectedApproach === 'sorting' ? [...arr].sort((a, b) => a - b) : arr;
  }, [numsInput, selectedApproach]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = initialNums.length;
    let nums = [...initialNums];
    let k = parseInt(kInput.toString()) || 0;

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ phase, description: desc, line, state: { ...state, nums: [...nums], k } });
    };

    if (selectedApproach === 'sorting') {
      addStep("Sort", "Array sorted to enable two-pointer convergence.", 3, { left: -1, right: -1, ops: 0 });
      
      let left = 0, right = n - 1, ops = 0;
      addStep("Init", "Initialize pointers at both ends.", 4, { left, right, ops });

      while (left < right) {
        const sum = nums[left] + nums[right];
        addStep("Check Sum", `Summing ${nums[left]} + ${nums[right]} = ${sum}. Target is ${k}.`, 8, { left, right, ops, sum });

        if (sum === k) {
          ops++;
          addStep("Pair Found", `Exact match! Incrementing operations to ${ops} and moving both pointers.`, 11, { left, right, ops, sum, matched: true });
          left++;
          right--;
        } else if (sum < k) {
          addStep("Sum Too Low", `Sum ${sum} < ${k}. Incrementing left pointer to find a larger value.`, 14, { left, right, ops, sum, direction: 'right' });
          left++;
        } else {
          addStep("Sum Too High", `Sum ${sum} > ${k}. Decrementing right pointer to find a smaller value.`, 16, { left, right, ops, sum, direction: 'left' });
          right--;
        }
      }
      addStep("Finish", `Search complete. Total pairs: ${ops}`, 20, { finished: true, ops });
    } else {
        // Hash Map logic
        let count = 0;
        const map: Record<number, number> = {};
        addStep("Init", "Initialize frequency map.", 3, { count, map: { ...map }, curIdx: -1 });

        for (let i = 0; i < n; i++) {
            const val = nums[i];
            const complement = k - val;
            addStep("Scan", `Checking number ${val}. Looking for complement ${complement}.`, 6, { count, map: { ...map }, curIdx: i, val, complement });
            
            if (map[complement] && map[complement] > 0) {
                count++;
                map[complement]--;
                addStep("Match", `Complement ${complement} found in map! Pair formed. Total: ${count}`, 8, { count, map: { ...map }, curIdx: i, val, complement, matched: true });
            } else {
                map[val] = (map[val] || 0) + 1;
                addStep("Store", `No complement. Storing ${val} in map for future pairing.`, 11, { count, map: { ...map }, curIdx: i, val, complement });
            }
        }
        addStep("Finish", `All numbers processed. Total operations: ${count}`, 15, { count, map: { ...map }, finished: true });
    }

    return steps;
  }, [initialNums, kInput, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const currentState = trace[currentStep] || trace[0];
  const { left, right, ops, sum, matched, finished, k, nums, map, curIdx, val, complement } = currentState.state;

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

          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[450px]">
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
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block pl-1">Input Array</label>
              <input value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-purple-600 uppercase tracking-widest block pl-1">Target (k)</label>
              <input type="number" value={kInput} onChange={(e) => { setKInput(parseInt(e.target.value) || 0); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-inner" />
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-6 border-t border-slate-100">
            <div className="w-full px-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                    <span>Initial</span>
                    <span className="text-indigo-500">Step {currentStep + 1} of {trace.length}</span>
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
                        Next Step <ChevronRight size={18} />
                    </button>
                </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3 text-slate-400">
              <Target size={14}/>
              <span className="text-[10px] font-black uppercase tracking-widest">Simulation Tracker</span>
            </div>
            <div className="text-lg font-black tracking-tight mb-2 uppercase">{currentState.phase}</div>
            <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-700/50">{currentState.description}</p>
        </div>

        {/* Visual Arena */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[450px] relative overflow-hidden flex flex-col justify-center items-center gap-12">
            
            {/* Stats */}
            <div className="flex gap-12">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">Current Sum</span>
                    <div className={`text-3xl font-black transition-all duration-300 ${matched ? 'text-green-500 scale-125' : 'text-slate-900'}`}>{sum !== undefined ? sum : '-'}</div>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">Pairs Formed</span>
                    <div className="text-3xl font-black text-indigo-600">{(selectedApproach === 'sorting' ? ops : currentState.state.count) || 0}</div>
                </div>
            </div>

            {/* Approach Specific Visualization */}
            {selectedApproach === 'hashmap' && map && (
                <div className="w-full flex flex-col items-center animate-in slide-in-from-top-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Frequency Map</span>
                    <div className="flex flex-wrap justify-center gap-4 max-w-md">
                        {Object.entries(map).map(([key, val]) => (
                            <div key={key} className={`flex flex-col items-center p-3 border-2 rounded-xl transition-all duration-300 ${complement?.toString() === key && matched ? 'bg-green-50 border-green-500 scale-110' : 'bg-slate-50 border-slate-100'}`}>
                                <span className="text-xs font-black text-slate-400 uppercase">Val</span>
                                <span className="text-lg font-black text-slate-800">{key}</span>
                                <div className="h-px w-full bg-slate-200 my-1" />
                                <span className="text-xs font-black text-indigo-600">Count: {val as number}</span>
                            </div>
                        ))}
                        {Object.keys(map).length === 0 && <span className="text-slate-300 italic text-sm">Empty</span>}
                    </div>
                </div>
            )}

            {/* Array Elements */}
            <div className="flex flex-wrap justify-center gap-3 relative px-10">
                {nums.map((num: number, idx: number) => {
                    const isLeftPointer = selectedApproach === 'sorting' && left === idx;
                    const isRightPointer = selectedApproach === 'sorting' && right === idx;
                    const isScanning = selectedApproach === 'hashmap' && curIdx === idx;
                    const isActive = isLeftPointer || isRightPointer || isScanning;
                    
                    let bgClass = "bg-white";
                    let borderClass = "border-slate-200";
                    let textClass = "text-slate-700 font-bold";

                    if (isActive) {
                        bgClass = matched ? "bg-green-500" : "bg-indigo-50";
                        textClass = matched ? "text-white" : "text-indigo-700 font-black";
                        borderClass = matched ? "border-green-600" : "border-indigo-500 ring-2 ring-indigo-50 shadow-md";
                        if (matched) bgClass += " scale-110 z-20 shadow-xl";
                    } else if (idx < (selectedApproach === 'sorting' ? left : curIdx) || idx > (selectedApproach === 'sorting' ? right : Infinity)) {
                        bgClass = "bg-slate-50 border-slate-100 text-slate-300 opacity-50";
                    }

                    return (
                        <div key={idx} className="flex flex-col items-center transition-all duration-300">
                            <div className={`
                                w-14 h-16 border-2 rounded-xl flex items-center justify-center font-mono text-xl transition-all duration-300 relative
                                ${bgClass} ${borderClass} ${textClass}
                            `}>
                                {num}
                                {isLeftPointer && !finished && (
                                    <div className="absolute -top-7 text-indigo-500 font-black text-[10px] animate-bounce">LEFT</div>
                                )}
                                {isRightPointer && !finished && (
                                    <div className="absolute -top-7 text-indigo-500 font-black text-[10px] animate-bounce">RIGHT</div>
                                )}
                                {isScanning && !finished && (
                                    <div className="absolute -top-7 text-indigo-500 font-black text-[10px] animate-bounce">SCAN</div>
                                )}
                            </div>
                            <span className="mt-2 text-[10px] font-mono font-black text-slate-300">[{idx}]</span>
                        </div>
                    );
                })}
            </div>

            {finished && (
               <div className="animate-in zoom-in duration-500">
                  <div className="bg-green-50 border-2 border-green-200 px-10 py-6 rounded-3xl flex flex-col items-center gap-2 shadow-xl">
                      <Check className="text-green-600" size={40} />
                      <span className="text-xs font-black uppercase tracking-widest text-green-700">Finished</span>
                      <p className="text-lg font-bold text-slate-800">Total pairs formed: <span className="text-2xl text-green-700">{(selectedApproach === 'sorting' ? ops : currentState.state.count)}</span></p>
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
                <TopicButton active={selectedTopic === 'problem'} onClick={() => setSelectedTopic('problem')} title="1. Problem Goal" desc="K-Sum Mechanism" />
                <TopicButton active={selectedTopic === 'pointers'} onClick={() => setSelectedTopic('pointers')} title="2. The Sort Benefit" desc="Why sorting helps" />
                <TopicButton active={selectedTopic === 'hashmap'} onClick={() => setSelectedTopic('hashmap')} title="3. Hash Map Utility" desc="Time-Space Trade-off" />
            </div>

            <div className="lg:col-span-9 bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[550px] flex flex-col">
                {selectedTopic === 'problem' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold mb-1">
                            <AlignLeft size={16}/> Understanding 1679
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight leading-tight">The Max Number of K-Sum Pairs</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            You are given an array <code>nums</code> and an integer <code>k</code>. In one operation, you can pick two numbers from the array whose sum equals <code>k</code> and remove them from the array.
                        </p>
                        
                        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-4">
                            <h3 className="font-bold text-indigo-800 flex items-center gap-2"><Target size={20}/> The Challenge</h3>
                            <p className="text-indigo-900 leading-relaxed">
                                Return the <strong>maximum</strong> number of operations you can perform. Note that once a pair is used, those specific elements are "consumed" and cannot be used in another pair.
                            </p>
                        </div>
                    </div>
                )}

                {selectedTopic === 'pointers' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">The Power of Sorting</h2>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            If the array is sorted, we gain **monotonicity**. This means as we move pointers, the sum changes in a predictable way.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <span className="font-black text-emerald-700 text-xs uppercase tracking-widest">Sum &lt; K</span>
                                <p className="text-sm text-emerald-900 mt-1 italic">"We need a bigger sum. The only way to get that is to move the left pointer to the right."</p>
                            </div>
                            <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                                <span className="font-black text-rose-700 text-xs uppercase tracking-widest">Sum &gt; K</span>
                                <p className="text-sm text-rose-900 mt-1 italic">"The sum is too high. We must move the right pointer left to find a smaller value."</p>
                            </div>
                        </div>
                        
                        <p className="bg-slate-50 p-4 rounded-xl text-sm text-slate-500 italic border border-slate-200">
                            "Sorting takes O(N log N) time, but once sorted, finding all pairs takes only O(N) linear time with O(1) extra space."
                        </p>
                    </div>
                )}

                {selectedTopic === 'hashmap' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">The Hash Map Shortcut</h2>
                        <p className="text-slate-600 leading-relaxed">
                           Instead of sorting, we can trade **memory for speed**. We scan the array once and store counts of numbers we've seen.
                        </p>
                        
                        <div className="bg-slate-900 p-6 rounded-2xl text-white font-mono text-xs shadow-2xl">
                             <div className="text-slate-500 mb-2">// Complement logic</div>
                             <div className="text-blue-400">int complement = k - num;</div>
                             <div className="text-blue-400">if (counts.get(complement) &gt; 0) &#123;</div>
                             <div className="text-slate-300">&nbsp;&nbsp;operations++;</div>
                             <div className="text-slate-300">&nbsp;&nbsp;counts.put(complement, counts.get(complement) - 1);</div>
                             <div className="text-blue-400">&#125; else &#123;</div>
                             <div className="text-slate-300">&nbsp;&nbsp;counts.put(num, counts.getOrDefault(num, 0) + 1);</div>
                             <div className="text-blue-400">&#125;</div>
                        </div>
                        
                        <p className="text-sm text-slate-500 border-t pt-4">
                            This approach is <strong>O(N)</strong> time but requires <strong>O(N)</strong> auxiliary space to store the map.
                        </p>
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
                    Interview Logic
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"Which approach is better?"</p>
                        <p>Answer: "It's a trade-off. Sorting uses O(1) extra space but O(N log N) time. Hash Map uses O(N) space but O(N) time. If N is very large and memory is constrained, sorting is preferred. If memory is abundant and we need max speed, Hash Map wins."</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"Why does sorting allow a single pass?"</p>
                        <p>Answer: "Because it establishes the Two Sum property. Moving pointers inward allows us to 'greedily' decide which pointer to advance without ever needing to look back at elements we've already discounted."</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg border-l-4 border-indigo-500">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 uppercase tracking-widest text-blue-400">
                    <Target size={20} />
                    The Elite Pitch
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                    "I implemented the Two Pointers approach by first sorting the input array. This enables a single linear-time scan where we converge from both boundaries to identify valid K-sum pairs. This method is space-optimal at O(1) auxiliary complexity and ensures we find the maximum possible operations by exploiting the sorted order to discard impossible candidates efficiently."
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
                        <span className="text-[10px] font-black text-amber-600 block mb-1 uppercase tracking-widest">MAP GOTCHA</span>
                        <p className="text-xs text-slate-600 leading-relaxed">When using the Map approach, remember that if <code>k = 10</code> and <code>num = 5</code>, you must ensure you have *two* 5s to form a pair. Using <code>num</code> as its own complement requires careful frequency management.</p>
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
                        <div className="font-black text-indigo-100 mb-1 uppercase tracking-widest text-[9px]">Optimal Time</div>
                        O(N log N) (Sort)
                    </div>
                    <div className="bg-indigo-700/50 p-4 rounded-xl border border-indigo-400/30">
                        <div className="font-black text-indigo-100 mb-1 uppercase tracking-widest text-[9px]">Optimal Space</div>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|void|Arrays|sort|Map|HashMap|put|getOrDefault)\b|\b\d+\b)/g).filter(Boolean);

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
          if (['Arrays', 'sort', 'Map', 'HashMap', 'put', 'getOrDefault'].includes(part)) return <span key={i} className="text-indigo-300 font-bold">{part}</span>;
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

export default MaxNumberKSumPairsVisualizer;