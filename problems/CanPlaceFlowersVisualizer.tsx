import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Flower, Check, X, Code2, Copy, Sprout, MousePointer2, AlertCircle, Zap, AlignLeft, Trophy, MessageSquare, Target, Cpu, AlertTriangle } from 'lucide-react';

const APPROACHES = {
  optimal: {
    id: 'optimal',
    title: '1. Optimized Greedy',
    subtitle: 'Single Pass / O(1) Space',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public boolean canPlaceFlowers(int[] flowerbed, int n) {
        int i = 0, count = 0;
        while (i < flowerbed.length) {
            if (flowerbed[i] == 0 && 
               (i == 0 || flowerbed[i - 1] == 0) && 
               (i == flowerbed.length - 1 || flowerbed[i + 1] == 0)) {
                flowerbed[i] = 1;
                count++;
            }
            if (count >= n) return true;
            i++;
        }
        return count >= n;
    }
}`,
    explanation: "This is the standard greedy approach. It iterates through the bed and plants a flower at the first available valid spot. It uses boundary checks to handle the start and end of the array."
  },
  padding: {
    id: 'padding',
    title: '2. Padding Logic',
    subtitle: 'Virtual Boundaries',
    icon: <Cpu size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public boolean canPlaceFlowers(int[] flowerbed, int n) {
        // Create a new array with padding [0, ...bed, 0]
        int[] f = new int[flowerbed.length + 2];
        System.arraycopy(flowerbed, 0, f, 1, flowerbed.length);
        
        int count = 0;
        for (int i = 1; i < f.length - 1; i++) {
            if (f[i-1] == 0 && f[i] == 0 && f[i+1] == 0) {
                f[i] = 1;
                count++;
            }
        }
        return count >= n;
    }
}`,
    explanation: "By 'padding' the array with 0s at both ends, we eliminate the need for complex boundary conditions (i == 0, etc). Every plot is treated as having two neighbors."
  }
};

const CanPlaceFlowersVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'learn' | 'interview'>('visualizer');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-rose-600 p-3 rounded-xl shadow-lg shadow-rose-200">
                <Flower className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Can Place Flowers</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">605</span>
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
  const [flowerbedInput, setFlowerbedInput] = useState("1,0,0,0,1");
  const [nInput, setNInput] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const originalBed = flowerbedInput.split(',').map(n => parseInt(n.trim()) || 0);
    const n = parseInt(nInput.toString()) || 0;
    
    let i = 0;
    let count = 0;
    let bed = [...originalBed];

    const addStep = (phase: string, desc: string, line: number, extraState: any = {}) => {
      steps.push({ 
        phase, 
        description: desc, 
        line, 
        state: { i, count, flowerbed: [...bed], n, ...extraState } 
      });
    };

    if (selectedApproach === 'optimal') {
      addStep("Init", "Initialize i = 0, count = 0.", 3);
      while (i < bed.length) {
          const isCurrentEmpty = bed[i] === 0;
          const isLeftEmpty = (i === 0) || (bed[i - 1] === 0);
          const isRightEmpty = (i === bed.length - 1) || (bed[i + 1] === 0);
          const canPlant = isCurrentEmpty && isLeftEmpty && isRightEmpty;

          addStep("Loop Check", `i (${i}) < length (${bed.length}).`, 4);
          addStep("Check Plot", `Plot ${i}: ${isCurrentEmpty ? 'Empty' : 'Occupied'}. Neighbors ${isLeftEmpty && isRightEmpty ? 'clear' : 'blocked'}.`, 5, { checkDetails: { isCurrentEmpty, isLeftEmpty, isRightEmpty } });

          if (canPlant) {
              bed[i] = 1;
              count++;
              addStep("Plant Flower", `Conditions met! Planting flower at index ${i}. Count is now ${count}.`, 8, { justPlantedIndex: i });
          }

          if (count >= n) {
              addStep("Success Check", `Target reached! count (${count}) >= n (${n}).`, 11, { success: true });
              return steps;
          }

          i++;
          addStep("Iterate", `Incrementing i to ${i}.`, 12);
      }
      addStep("Finish", `End of bed. count (${count}) >= n (${n}) is ${count >= n}.`, 14, { success: count >= n });
    } else {
      // Padding Approach
      const padded = [0, ...bed, 0];
      // Fixed: First step of padding approach now includes the paddedView
      addStep("Init", "Create padded array [0, ...bed, 0] to simplify logic.", 4, { paddedView: [...padded] });
      
      let pCount = 0;
      addStep("Padded Array", "Working with padded array. Start loop from index 1.", 8, { paddedView: [...padded] });
      
      for (let pIdx = 1; pIdx < padded.length - 1; pIdx++) {
        const canPlant = padded[pIdx - 1] === 0 && padded[pIdx] === 0 && padded[pIdx + 1] === 0;
        addStep("Scan", `Checking index ${pIdx} (Original ${pIdx-1}). Neighbors: [${padded[pIdx-1]}, ${padded[pIdx]}, ${padded[pIdx+1]}]`, 9, { paddedIdx: pIdx, paddedView: [...padded] });
        
        if (canPlant) {
          padded[pIdx] = 1;
          pCount++;
          addStep("Plant", `Spot available in padded array. New count: ${pCount}`, 11, { paddedIdx: pIdx, paddedView: [...padded] });
        }
      }
      addStep("Return", "Return final comparison.", 14, { success: pCount >= n, count: pCount, paddedView: [...padded] });
    }

    return steps;
  }, [flowerbedInput, nInput, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const currentState = trace[currentStep] || trace[0];
  const { i, count, flowerbed, n, checkDetails, justPlantedIndex, success, paddedIdx, paddedView } = currentState.state;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      
      {/* Left Column */}
      <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-sm">
             {(Object.keys(APPROACHES) as Array<keyof typeof APPROACHES>).map((key) => (
                <button
                  key={key}
                  onClick={() => { setSelectedApproach(key); setCurrentStep(0); }}
                  className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-rose-600 text-white shadow-lg shadow-rose-100' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}
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
                <Code2 size={14} className="text-rose-400"/>
                <span className="font-bold text-slate-300">Solution.java</span>
              </div>
              <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors">
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                <span className={copied ? "text-green-400" : "text-slate-300"}>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-6 font-mono text-[13px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                <div className="absolute left-0 right-0 bg-rose-500/15 border-l-4 border-rose-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${(currentState.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} />
                {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                    <CodeLineRenderer key={idx} num={idx + 1} code={line} active={currentState.line === idx + 1} />
                ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-rose-600">
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
              <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest block pl-1">Flowerbed Array</label>
              <input value={flowerbedInput} onChange={(e) => { setFlowerbedInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-inner" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-purple-600 uppercase tracking-widest block pl-1">Target (n)</label>
              <input type="number" value={nInput} onChange={(e) => { setNInput(parseInt(e.target.value) || 0); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-6 border-t border-slate-100">
            <div className="w-full px-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                    <span>Initial State</span>
                    <span className="text-rose-500">Step {currentStep + 1} of {trace.length}</span>
                    <span>Result</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                    <div className="h-full bg-rose-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(225,29,72,0.5)]" style={{ width: `${(currentStep / (Math.max(1, trace.length - 1))) * 100}%` }} />
                </div>
            </div>
            <div className="flex items-center justify-between gap-4">
                <button onClick={() => setCurrentStep(0)} className="p-3 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-all" title="Reset Simulation"><RotateCcw size={20}/></button>
                <div className="flex gap-3 flex-1">
                    <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-all disabled:opacity-30 flex items-center justify-center gap-2">
                        <ChevronLeft size={18} /> Prev
                    </button>
                    <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] px-6 py-3 bg-rose-600 text-white hover:bg-rose-700 rounded-xl font-bold transition-all disabled:opacity-30 shadow-lg shadow-rose-200 flex items-center justify-center gap-2">
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[350px] relative overflow-hidden flex flex-col justify-center items-center">
            
            <div className="flex items-center gap-10 mb-12">
                <div className="text-center">
                    <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Flowers Planted</div>
                    <div className="text-3xl font-black text-rose-600">{count}</div>
                </div>
                <div className="h-10 w-px bg-slate-200"></div>
                <div className="text-center">
                    <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Target Needed</div>
                    <div className="text-3xl font-black text-slate-800">{n}</div>
                </div>
                {success !== undefined && (
                    <div className={`ml-4 px-6 py-2 rounded-2xl font-black uppercase text-xs border-2 ${success ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {success ? 'Goal Met ✓' : 'Failed ✗'}
                    </div>
                )}
            </div>

            <div className="flex items-end justify-center gap-3 overflow-x-auto w-full pb-10">
                {/* Fixed: Added fallback to empty array to prevent mapping undefined */}
                {(selectedApproach === 'padding' ? (paddedView || []) : (flowerbed || [])).map((val: number, idx: number) => {
                    const isFocus = selectedApproach === 'padding' ? paddedIdx === idx : i === idx;
                    const isJustPlanted = justPlantedIndex === (selectedApproach === 'padding' ? idx - 1 : idx);
                    const isNeighbor = selectedApproach === 'padding' 
                        ? (paddedIdx !== undefined && (idx === paddedIdx - 1 || idx === paddedIdx + 1))
                        : (i !== undefined && (idx === i - 1 || idx === i + 1));
                    
                    return (
                        <div key={idx} className="flex flex-col items-center flex-shrink-0 transition-all duration-500">
                            <div className={`
                                w-14 h-14 border-2 rounded-2xl flex items-center justify-center transition-all duration-500 relative
                                ${val === 1 ? 'bg-rose-50 border-rose-200 shadow-sm' : 'bg-slate-50 border-slate-200'}
                                ${isFocus ? 'ring-4 ring-rose-500/20 border-rose-500 scale-110 z-10' : ''}
                                ${isNeighbor && !isFocus ? 'border-blue-300 bg-blue-50/30' : ''}
                            `}>
                                {val === 1 && (
                                    <Flower 
                                        size={32} 
                                        className={`transition-all duration-700 ${isJustPlanted ? 'text-rose-600 animate-in zoom-in spin-in-180' : 'text-rose-400'}`} 
                                        fill="currentColor"
                                    />
                                )}
                                {val === 0 && <span className="text-[10px] text-slate-300 font-black">0</span>}
                                {selectedApproach === 'padding' && paddedView && (idx === 0 || idx === paddedView.length - 1) && (
                                    <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[8px] font-black px-1 rounded uppercase">Pad</div>
                                )}
                            </div>
                            <span className="text-[10px] font-mono font-black text-slate-400 mt-2">{idx}</span>
                            {isFocus && (
                                <div className="absolute -bottom-8 text-rose-500 animate-bounce">
                                    <MousePointer2 size={16} className="rotate-[-90deg]"/>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};

// --- MODE 2: LEARN MODE ---
const LearnMode = () => {
    const [selectedTopic, setSelectedTopic] = useState('problem');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-3 space-y-2">
                <TopicButton active={selectedTopic === 'problem'} onClick={() => setSelectedTopic('problem')} title="1. Problem Goal" desc="Rules of the Bed" />
                <TopicButton active={selectedTopic === 'greedy'} onClick={() => setSelectedTopic('greedy')} title="2. Greedy Strategy" desc="Why act fast?" />
                <TopicButton active={selectedTopic === 'logic'} onClick={() => setSelectedTopic('logic')} title="3. The Triple Check" desc="Checking Neighbors" />
            </div>

            <div className="lg:col-span-9 bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[600px] flex flex-col">
                {selectedTopic === 'problem' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold mb-1">
                            <AlignLeft size={16}/> Understanding 605
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">The Flowerbed Problem</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            You have a long flowerbed in which some of the plots are planted, and some are not. However, flowers cannot be planted in <strong>adjacent</strong> plots.
                        </p>
                        
                        <div className="bg-rose-50 border border-rose-100 rounded-xl p-6 space-y-4">
                            <h3 className="font-bold text-rose-800 flex items-center gap-2"><AlertCircle size={20}/> The Main Constraint</h3>
                            <p className="text-rose-900">
                                If you plant a flower at index <code>i</code>, indices <code>i-1</code> and <code>i+1</code> MUST be empty (0).
                            </p>
                            <div className="flex gap-2 justify-center">
                                <div className="w-10 h-10 bg-rose-200 border border-rose-300 rounded flex items-center justify-center font-bold text-rose-700">1</div>
                                <div className="w-10 h-10 bg-rose-200 border border-rose-300 rounded flex items-center justify-center font-bold text-rose-700 relative">
                                    1
                                    <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">X</div>
                                </div>
                                <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded flex items-center justify-center font-bold text-slate-300">0</div>
                            </div>
                            <p className="text-center text-xs text-rose-600 font-bold tracking-wider">INVALID: ADJACENT FLOWERS</p>
                        </div>
                    </div>
                )}

                {selectedTopic === 'greedy' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">The Greedy Approach</h2>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            Greedy works here because planting a flower as far left as possible never hurts your chances of planting more flowers later.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border p-6 rounded-xl bg-slate-50">
                                <h3 className="font-bold text-slate-700 mb-2">Scan & Act</h3>
                                <p className="text-sm text-slate-600 italic">
                                    "I walk through the bed. The first valid spot I see, I plant. I don't wait for a 'better' spot, because there is no such thing."
                                </p>
                            </div>
                            <div className="border p-6 rounded-xl bg-emerald-50 border-emerald-100">
                                <h3 className="font-bold text-emerald-800 mb-2">Benefit</h3>
                                <p className="text-sm text-emerald-700 leading-relaxed">
                                    This reduces the problem to a single pass <strong>O(N)</strong> with constant extra space <strong>O(1)</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {selectedTopic === 'logic' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">The Check Conditions</h2>
                        <p className="text-slate-600">To plant a flower at index <code>i</code>, three things must be true:</p>
                        <ul className="space-y-4">
                            <li className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold shrink-0">1</div>
                                <div>
                                    <span className="font-bold">Current is 0:</span> You can't plant on top of another flower.
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold shrink-0">2</div>
                                <div>
                                    <span className="font-bold">Left is 0:</span> Previous plot must be empty. (If <code>i=0</code>, it counts as empty).
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold shrink-0">3</div>
                                <div>
                                    <span className="font-bold">Right is 0:</span> Next plot must be empty. (If <code>i</code> is at the end, it counts as empty).
                                </div>
                            </li>
                        </ul>
                        <div className="mt-8 bg-slate-900 p-6 rounded-xl text-white font-mono text-xs">
                             <div className="text-emerald-400 mb-2">// The logic in code:</div>
                             <div className="text-slate-400">if (flowerbed[i] == 0 && (i == 0 || flowerbed[i-1] == 0) && (i == len-1 || flowerbed[i+1] == 0))</div>
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
                    <MessageSquare className="text-rose-500" size={20} />
                    Interview Q&A
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-bold text-slate-800 mb-1">"How do you decide where to plant flowers for maximum density?"</p>
                        <p>Answer: "I use a greedy strategy. By planting at the very first available valid plot from the left, I preserve the maximum amount of future space for later plots. This local optimal choice actually results in a global optimal density for this specific distancing rule."</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Target size={120} />
                </div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 relative z-10">
                    <Target className="text-amber-400" size={20} />
                    The "Elite" Pitch
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                    "I implemented an O(N) linear scan using a greedy placement strategy. By planting at the first valid spot, I ensure optimal usage of space. To maximize code clarity, I combined the boundary checks with the occupancy check in a single conditional. I also included an early-exit optimization: as soon as we meet the target 'n', we return true, saving unnecessary cycles on larger flowerbeds."
                </p>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-amber-800 flex items-center gap-2 mb-4">
                    <AlertCircle size={20} />
                    Technical Pro-Tips
                </h3>
                <div className="space-y-4 text-sm">
                    <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
                        <span className="text-[10px] font-black text-amber-600 block mb-1 uppercase tracking-widest">MUTATION</span>
                        <p className="text-xs text-slate-600 leading-relaxed">Mention that modifying the input array flowerbed[i] = 1 is space-efficient (O(1) extra space), but if the input shouldn't be mutated, you could simulate the check by skipping indices instead.</p>
                    </div>
                </div>
            </div>

            <div className="bg-rose-600 text-white rounded-xl p-6 shadow-lg shadow-rose-100">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                    <Check size={20} />
                    Final Complexity
                </h3>
                <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono">
                    <div className="bg-rose-700/50 p-4 rounded-xl border border-rose-400/30">
                        <div className="font-black text-rose-100 mb-1 uppercase tracking-widest text-[9px]">Time Complexity</div>
                        O(N)
                    </div>
                    <div className="bg-rose-700/50 p-4 rounded-xl border border-rose-400/30">
                        <div className="font-black text-rose-100 mb-1 uppercase tracking-widest text-[9px]">Space Complexity</div>
                        O(1) or O(N)
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|List|ArrayList|Math|System|arraycopy)\b|\b\d+\b|\b(?:length|canPlaceFlowers)\b)/g).filter(Boolean);

  return (
    <div className={`flex relative z-10 group min-h-[20.8px] ${active ? 'font-bold' : ''}`}>
      <span className="w-8 select-none text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-xs">{num}</span>
      <pre className={`font-mono whitespace-pre text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-orange-300">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-cyan-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'void'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['List', 'ArrayList', 'Math', 'String', 'System'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['length', 'canPlaceFlowers', 'arraycopy'].includes(part)) return <span key={i} className="text-indigo-300">{part}</span>;
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
        ? 'bg-rose-50 border-rose-500 shadow-md ring-1 ring-rose-200' 
        : 'bg-white border-slate-200 hover:border-rose-300 hover:bg-slate-50'}
    `}
  >
    <div className={`font-bold ${active ? 'text-rose-800' : 'text-slate-700 group-hover:text-rose-700'}`}>
      {title}
    </div>
    <div className={`text-xs mt-1 ${active ? 'text-rose-600' : 'text-slate-400'}`}>
      {desc}
    </div>
  </button>
);

export default CanPlaceFlowersVisualizer;