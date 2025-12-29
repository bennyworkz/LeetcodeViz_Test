import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, Check, Copy, AlignLeft, Zap, Trophy, MessageSquare, Target, AlertCircle, Cpu, MousePointer2, ArrowRightLeft, CircleDashed, Layers, PlusSquare } from 'lucide-react';

const APPROACHES = {
  brute: {
    id: 'brute',
    title: '1. Brute Force',
    subtitle: 'Extra Array',
    icon: <Layers size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public void moveZeroes(int[] nums) {
        int n = nums.length;
        int[] temp = new int[n];
        int pos = 0;
        
        // 1. Copy non-zeroes to new array
        for (int x : nums) {
            if (x != 0) temp[pos++] = x;
        }
        
        // 2. Copy back to original
        for (int i = 0; i < n; i++) {
            nums[i] = temp[i];
        }
    }
}`,
    explanation: "The simplest logic: create a temporary buffer. We scan the input and pack all non-zero elements into the front of the buffer. While easy to understand, it violates the 'in-place' constraint often requested in interviews."
  },
  suboptimal: {
    id: 'suboptimal',
    title: '2. Two-Pass',
    subtitle: 'Overwrite & Fill',
    icon: <PlusSquare size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public void moveZeroes(int[] nums) {
        int pos = 0;
        // Pass 1: Overwrite non-zeroes at front
        for (int x : nums) {
            if (x != 0) nums[pos++] = x;
        }
        
        // Pass 2: Fill remaining with zeroes
        while (pos < nums.length) {
            nums[pos++] = 0;
        }
    }
}`,
    explanation: "A standard in-place technique. First, we shift all non-zero elements to the front by overwriting indices. Then, we manually set every remaining index to zero. It's efficient but requires two separate loops."
  },
  optimal: {
    id: 'optimal',
    title: '3. Optimal Swap',
    subtitle: 'One-Pass Partition',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public void moveZeroes(int[] nums) {
        int lastNonZero = 0;
        for (int cur = 0; cur < nums.length; cur++) {
            if (nums[cur] != 0) {
                int temp = nums[lastNonZero];
                nums[lastNonZero] = nums[cur];
                nums[cur] = temp;
                lastNonZero++;
            }
        }
    }
}`,
    explanation: "The most elegant version. Using a partitioning logic similar to QuickSort, we swap non-zero elements with the leftmost available zero. This handles everything in a single pass."
  }
};

const MoveZeroesVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'learn' | 'interview'>('visualizer');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-200">
                <CircleDashed className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Move Zeroes</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">283</span>
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
  const [numsInput, setNumsInput] = useState("0,1,0,3,12");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const initialNums = useMemo(() => numsInput.split(',').map(n => parseInt(n.trim()) || 0), [numsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = initialNums.length;
    let nums = [...initialNums];

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ phase, description: desc, line, state: { ...state, nums: [...nums] } });
    };

    if (selectedApproach === 'brute') {
      let temp = new Array(n).fill(0);
      let pos = 0;
      addStep("Init", "Creating temporary array for results.", 4, { pos, temp: [...temp] });
      
      for (let i = 0; i < n; i++) {
        addStep("Scan", `Checking index ${i}: ${nums[i]}`, 8, { cur: i, pos, temp: [...temp] });
        if (nums[i] !== 0) {
          temp[pos] = nums[i];
          addStep("Copy", `Non-zero ${nums[i]} found. Adding to temp[${pos}].`, 9, { cur: i, pos: pos + 1, temp: [...temp], writing: pos });
          pos++;
        }
      }
      
      addStep("Intermediate", "Phase 1 complete. All non-zeroes are in the temp array. Now copying back.", 12, { pos, temp: [...temp] });
      
      for (let i = 0; i < n; i++) {
        nums[i] = temp[i];
        addStep("Write Back", `Setting original[${i}] to temp[${i}] (${temp[i]}).`, 14, { cur: i, temp: [...temp], writeBack: true });
      }

    } else if (selectedApproach === 'suboptimal') {
      let pos = 0;
      addStep("Init", "First pass: Shift non-zeroes to the front.", 3, { pos });
      
      for (let i = 0; i < n; i++) {
        addStep("Scan", `Index ${i}: ${nums[i]}`, 5, { cur: i, pos });
        if (nums[i] !== 0) {
          nums[pos] = nums[i];
          addStep("Overwrite", `Placing ${nums[i]} at write index ${pos}.`, 6, { cur: i, pos: pos + 1, overwriting: pos });
          pos++;
        }
      }
      
      addStep("Transition", "Phase 1 complete. Now filling remaining slots with zeroes.", 9, { pos });
      
      while (pos < n) {
        nums[pos] = 0;
        addStep("Fill Zero", `Setting index ${pos} to zero.`, 11, { pos: pos + 1, filling: pos });
        pos++;
      }

    } else {
      // Optimal (Swap)
      let lastNonZero = 0;
      addStep("Init", "Start with pointers: lastNonZero = 0, cur = 0.", 3, { lastNonZero, cur: -1 });

      for (let cur = 0; cur < n; cur++) {
        addStep("Loop Check", `Iteration: cur = ${cur}. Value: ${nums[cur]}`, 4, { lastNonZero, cur });
        
        if (nums[cur] !== 0) {
          addStep("Non-Zero Found", `Value ${nums[cur]} is non-zero. Swapping with index ${lastNonZero}.`, 7, { lastNonZero, cur, activeSwap: true });
          
          let temp = nums[lastNonZero];
          nums[lastNonZero] = nums[cur];
          nums[cur] = temp;
          
          lastNonZero++;
          addStep("Post-Swap", `Advanced lastNonZero to ${lastNonZero}.`, 11, { lastNonZero, cur, justSwapped: true });
        } else {
          addStep("Zero Skip", `Value at index ${cur} is zero. Incrementing cur only.`, 5, { lastNonZero, cur });
        }
      }
    }

    addStep("Finish", "Execution complete.", 20, { finished: true });
    return steps;
  }, [initialNums, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const currentState = trace[currentStep] || trace[0];
  const { lastNonZero, cur, nums, activeSwap, finished, temp, writing, writeBack, overwriting, filling, pos } = currentState.state;

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
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block pl-1">Input Array</label>
            <input value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner" maxLength={30} />
          </div>

          <div className="flex flex-col gap-5 pt-6 border-t border-slate-100">
            <div className="w-full px-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                    <span>Start</span>
                    <span className="text-blue-500">Step {currentStep + 1} / {trace.length}</span>
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
                        Next Action <ChevronRight size={18} />
                    </button>
                </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3 text-slate-400">
              <Target size={14}/>
              <span className="text-[10px] font-black uppercase tracking-widest">Current Action</span>
            </div>
            <div className="text-lg font-black tracking-tight mb-2 uppercase">{currentState.phase}</div>
            <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-700/50">{currentState.description}</p>
        </div>

        {/* Visual Arena */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[400px] relative overflow-hidden flex flex-col justify-center items-center gap-12">
            
            {/* Pointers Info */}
            {!finished && (
                <div className="flex gap-8 animate-in slide-in-from-top-4">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-2">
                            <MousePointer2 size={14} className={selectedApproach === 'optimal' ? "text-emerald-500" : "text-blue-500"} />
                            <span className="text-[10px] font-black text-slate-400 uppercase">
                                {selectedApproach === 'optimal' ? 'Slow Pointer' : 'Write Head'}
                            </span>
                        </div>
                        <div className={`text-xl font-mono font-black px-4 py-1 rounded-lg border ${selectedApproach === 'optimal' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-blue-600 bg-blue-50 border-blue-200'}`}>
                            {selectedApproach === 'optimal' ? lastNonZero : pos}
                        </div>
                    </div>
                    {cur !== undefined && cur !== -1 && (
                      <div className="flex flex-col items-center">
                          <div className="flex items-center gap-2 mb-2">
                              <Activity size={14} className="text-indigo-500" />
                              <span className="text-[10px] font-black text-slate-400 uppercase">Current Scanner</span>
                          </div>
                          <div className="text-xl font-mono font-black text-indigo-600 bg-indigo-50 px-4 py-1 rounded-lg border border-indigo-200">{cur}</div>
                      </div>
                    )}
                </div>
            )}

            {/* Arrays View */}
            <div className="space-y-12 w-full flex flex-col items-center">
                {/* Temp Array (Brute Force Only) */}
                {selectedApproach === 'brute' && temp && (
                    <div className="flex flex-col items-center animate-in slide-in-from-top-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase mb-3">Temporary Buffer</span>
                        <div className="flex gap-2">
                            {temp.map((val: number, idx: number) => (
                                <div key={idx} className={`w-10 h-12 border-2 rounded-lg flex items-center justify-center font-mono text-sm transition-all ${writing === idx ? 'bg-blue-500 border-blue-600 text-white scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
                                    {val}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Array */}
                <div className="flex flex-col items-center">
                    {selectedApproach === 'brute' && <span className="text-[10px] font-black text-slate-400 uppercase mb-3">Original Array</span>}
                    <div className="flex flex-wrap justify-center gap-3 relative px-10">
                        {nums.map((val: number, idx: number) => {
                            const isSlow = lastNonZero === idx;
                            const isFast = cur === idx;
                            const isWriteHead = pos === idx;
                            const isSwapping = activeSwap && (isSlow || isFast);
                            const isActionIdx = (selectedApproach === 'suboptimal' && (overwriting === idx || filling === idx)) || (selectedApproach === 'brute' && writeBack && cur === idx);

                            let bgClass = "bg-white";
                            let borderClass = "border-slate-200";
                            let textClass = "text-slate-700 font-bold";

                            if (isSwapping || isActionIdx) {
                                bgClass = "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110 z-20";
                                textClass = "text-white";
                                borderClass = "border-blue-600";
                            } else if (isFast) {
                                bgClass = "bg-indigo-50 border-indigo-400 ring-2 ring-indigo-50";
                                textClass = "text-indigo-700 font-black";
                            } else if (isSlow || isWriteHead) {
                                bgClass = "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-50";
                                textClass = "text-emerald-700 font-black";
                            } else if (val === 0) {
                                bgClass = "bg-slate-50 border-slate-100 text-slate-300";
                            }

                            return (
                                <div key={idx} className="flex flex-col items-center transition-all duration-300">
                                    <div className={`
                                        w-12 h-14 border-2 rounded-xl flex items-center justify-center font-mono text-xl transition-all duration-300 relative
                                        ${bgClass} ${borderClass} ${textClass}
                                    `}>
                                        {val}
                                        {isFast && !finished && (
                                            <div className="absolute -top-6 text-indigo-500 font-black text-[9px] flex flex-col items-center animate-bounce">
                                                <span>SCAN</span>
                                                <MousePointer2 size={10} className="rotate-180" />
                                            </div>
                                        )}
                                        {(isSlow || isWriteHead) && !finished && !isActionIdx && (
                                            <div className="absolute -bottom-6 text-emerald-500 font-black text-[9px] flex flex-col items-center animate-bounce">
                                                <Target size={10} />
                                                <span>PTR</span>
                                            </div>
                                        )}
                                    </div>
                                    <span className="mt-2 text-[10px] font-mono font-black text-slate-300">{idx}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {finished && (
               <div className="animate-in zoom-in duration-500">
                  <div className="bg-green-50 border-2 border-green-200 px-10 py-6 rounded-3xl flex flex-col items-center gap-2 shadow-xl">
                      <Check className="text-green-600" size={40} />
                      <span className="text-xs font-black uppercase tracking-widest text-green-700">Finished</span>
                      <p className="text-sm font-bold text-slate-600">Operation Successful.</p>
                  </div>
               </div>
            )}
        </div>
      </div>
    </div>
  );
};

const LearnMode = () => {
    const [selectedTopic, setSelectedTopic] = useState('goal');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-3 space-y-2">
                <TopicButton active={selectedTopic === 'goal'} onClick={() => setSelectedTopic('goal')} title="1. The Mission" desc="Preserving Order" />
                <TopicButton active={selectedTopic === 'progression'} onClick={() => setSelectedTopic('progression')} title="2. Progression" desc="From O(N) Space to O(1)" />
                <TopicButton active={selectedTopic === 'optimal'} onClick={() => setSelectedTopic('optimal')} title="3. Optimal Swap" desc="Single Pass Logic" />
            </div>

            <div className="lg:col-span-9 bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col">
                {selectedTopic === 'goal' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold mb-1">
                            <AlignLeft size={16}/> Understanding 283
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Move Zeroes</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Given an integer array <code>nums</code>, move all <code>0</code>'s to the end of it while maintaining the <strong>relative order</strong> of the non-zero elements.
                        </p>
                        
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-4">
                            <h3 className="font-bold text-blue-800 flex items-center gap-2"><AlertCircle size={20}/> The Constraints</h3>
                            <ul className="space-y-2 text-sm text-blue-900">
                                <li className="flex gap-2"><Check size={16} className="text-emerald-600"/> <strong>In-Place:</strong> You must modify the array directly. No extra arrays!</li>
                                <li className="flex gap-2"><Check size={16} className="text-emerald-600"/> <strong>Stability:</strong> The non-zero elements must keep their original order.</li>
                            </ul>
                        </div>
                    </div>
                )}

                {selectedTopic === 'progression' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800 font-black tracking-tight text-blue-900">Logical Progression</h2>
                        <p className="text-slate-600">Engineering solutions often evolve from simple to optimized:</p>
                        
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 border rounded-xl flex gap-4">
                                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold">1</div>
                                <div>
                                    <span className="font-bold text-slate-800">Brute Force:</span> Creating a temporary array is easy but uses extra memory.
                                </div>
                            </div>
                            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex gap-4">
                                <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center font-bold">2</div>
                                <div>
                                    <span className="font-bold text-indigo-800">Two-Pass In-Place:</span> We shift non-zeroes in Pass 1, then fill zeroes in Pass 2. This hits O(1) space but traverses twice.
                                </div>
                            </div>
                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-4">
                                <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center font-bold">3</div>
                                <div>
                                    <span className="font-bold text-emerald-800">Optimal One-Pass:</span> Swapping non-zeroes with the first available slot completes everything in a single loop.
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {selectedTopic === 'optimal' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">The Power of Swapping</h2>
                        <p className="text-slate-600 leading-relaxed text-lg">
                           Instead of just overwriting, we "bubble" zeroes to the end by swapping them with non-zero values found later in the array.
                        </p>
                        
                        <div className="bg-slate-900 p-6 rounded-2xl text-white font-mono text-xs shadow-2xl">
                             <div className="text-slate-500 mb-2">// Partitioning logic</div>
                             <div className="text-blue-400">if (nums[cur] != 0) &#123;</div>
                             <div className="text-slate-300">&nbsp;&nbsp;swap(nums[lastNonZero], nums[cur]);</div>
                             <div className="text-slate-300">&nbsp;&nbsp;lastNonZero++;</div>
                             <div className="text-blue-400">&#125;</div>
                        </div>
                        
                        <p className="text-sm text-slate-500 italic border-t pt-4">
                            Crucially, `lastNonZero` only points to the leftmost index that *might* be a zero. Every time we swap, we advance that boundary.
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
                    <MessageSquare className="text-blue-500" size={20} />
                    Interview Strategy
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"Why is swapping better than two passes?"</p>
                        <p>Answer: "Both are O(N) time and O(1) space, but swapping is a single-pass solution. In scenarios where data is large or stored in memory that is expensive to visit twice (like cache-heavy systems), minimizing the number of visits is a critical optimization."</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"Can you optimize the optimal approach further?"</p>
                        <p>Answer: "Yes. If `cur == lastNonZero`, the element is already in the correct spot and swapping is redundant. Adding a simple equality check avoids thousands of useless write operations in arrays that are mostly non-zero."</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 uppercase tracking-widest text-blue-400">
                    <Target size={20} />
                    The Elite Pitch
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                    "I implemented a single-pass partitioning algorithm using slow and fast pointers. This approach maintains a write boundary and swaps non-zero elements into position in real-time. By utilizing the swap trick, I ensure zeroes are naturally pushed to the end without requiring a second cleanup pass. This guarantees O(N) linear time and constant O(1) space while preserving the stability of the original dataset."
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
                        <span className="text-[10px] font-black text-amber-600 block mb-1 uppercase tracking-widest">SUB-OPTIMAL PITFALL</span>
                        <p className="text-xs text-slate-600 leading-relaxed">Don't forget that Pass 1 of the suboptimal approach doesn't 'delete' zeroes; it just shifts values. You *must* perform Pass 2 to clear the remaining indices, otherwise your array will contain duplicated data at the end.</p>
                    </div>
                </div>
            </div>

            <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg shadow-blue-100">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                    <Check size={20} />
                    Complexity Overview
                </h3>
                <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono">
                    <div className="bg-blue-700/50 p-4 rounded-xl border border-blue-400/30">
                        <div className="font-black text-blue-100 mb-1 uppercase tracking-widest text-[9px]">Optimal Time</div>
                        O(N) (Single Pass)
                    </div>
                    <div className="bg-blue-700/50 p-4 rounded-xl border border-blue-400/30">
                        <div className="font-black text-blue-100 mb-1 uppercase tracking-widest text-[9px]">Optimal Space</div>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|void)\b|\b\d+\b)/g).filter(Boolean);

  return (
    <div className={`flex relative z-10 group min-h-[20.8px] ${active ? 'font-bold' : ''}`}>
      <span className="w-8 select-none text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-xs">{num}</span>
      <pre className={`font-mono whitespace-pre text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-orange-300">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-cyan-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'void', 'for'].includes(part)) return <span key={i} className="text-blue-400 font-bold">{part}</span>;
          if (['int', 'boolean'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
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
        ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-100' 
        : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}
    `}
  >
    <div className={`font-bold ${active ? 'text-blue-800' : 'text-slate-700 group-hover:text-blue-700'}`}>
      {title}
    </div>
    <div className={`text-xs mt-1 ${active ? 'text-blue-600' : 'text-slate-400'}`}>
      {desc}
    </div>
  </button>
);

export default MoveZeroesVisualizer;