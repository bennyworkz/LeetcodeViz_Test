import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, User, Crown, Check, X, Code2, BarChart3, Info, Copy, Zap, AlignLeft, Lightbulb, Trophy, MessageSquare, Target, AlertCircle, Layers, ArrowRight, MousePointer2, Cpu, AlertTriangle } from 'lucide-react';

const APPROACHES = {
  brute: {
    id: 'brute',
    title: '1. Brute Force',
    subtitle: 'Nested Comparisons',
    icon: <AlertCircle size={16} />,
    complexity: 'Time: O(N²)',
    code: `class Solution {
    public List<Boolean> kidsWithCandies(int[] candies, int extra) {
        List<Boolean> result = new ArrayList<>();
        for (int i = 0; i < candies.length; i++) {
            boolean isGreatest = true;
            int currentTotal = candies[i] + extra;
            for (int j = 0; j < candies.length; j++) {
                if (currentTotal < candies[j]) {
                    isGreatest = false;
                    break;
                }
            }
            result.add(isGreatest);
        }
        return result;
    }
}`,
    explanation: "This approach checks every kid individually. For each kid, it simulates giving them extra candies and then scans the entire array again to see if anyone is still bigger. Simple, but redundant.",
    lag: "SCALABILITY LAG: With 10,000 kids, this performs 100 million comparisons. It re-scans the array for every single kid, ignoring the fact that the 'greatest' threshold is a global property."
  },
  optimal: {
    id: 'optimal',
    title: '2. Optimal',
    subtitle: 'Two-Pass Benchmark',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N)',
    code: `class Solution {
    public List<Boolean> kidsWithCandies(int[] candies, int extra) {
        int max = 0;
        for (int c : candies) max = Math.max(c, max);

        List<Boolean> result = new ArrayList<>();
        for (int c : candies) {
            result.add(c + extra >= max);
        }
        return result;
    }
}`,
    explanation: "The professional standard. We realize that the only thing a kid needs to beat is the current maximum. We find that maximum once, then use it as a constant benchmark for everyone else.",
    lag: "PERFECT SOLUTION: Linear time. We traverse the array exactly twice. This scales to millions of kids instantly because we eliminate the nested loop."
  }
};

const KidsCandiesVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'learn' | 'interview'>('visualizer');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-pink-600 p-3 rounded-xl shadow-lg shadow-pink-200">
                <User className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kids With Greatest Candies</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded">1431</span>
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
  const [candiesInput, setCandiesInput] = useState("2,3,5,1,3");
  const [extraCandies, setExtraCandies] = useState(3);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const candies = useMemo(() => candiesInput.split(',').map(n => parseInt(n.trim()) || 0), [candiesInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    let max = 0;
    const result: boolean[] = [];

    const addStep = (phase: string, desc: string, line: number, extraState: any = {}) => {
      steps.push({ phase, description: desc, line, state: { max, result: [...result], ...extraState } });
    };

    if (selectedApproach === 'brute') {
      addStep("Init", "Start solution with Brute Force. Creating results list.", 3);
      for (let i = 0; i < candies.length; i++) {
        let isGreatest = true;
        const total = candies[i] + extraCandies;
        addStep("Check Kid", `Evaluating Kid ${i}. Potential candies: ${candies[i]} + ${extraCandies} = ${total}.`, 5, { i, total });
        
        for (let j = 0; j < candies.length; j++) {
            addStep("Compare", `Comparing Kid ${i}'s ${total} against Kid ${j}'s ${candies[j]}.`, 8, { i, j, total });
            if (total < candies[j]) {
                isGreatest = false;
                addStep("Mismatch", `Kid ${j} has more candies! Kid ${i} cannot be the greatest.`, 10, { i, j, total, isGreatest: false });
                break;
            }
        }
        result.push(isGreatest);
        addStep("Store", `Kid ${i} result: ${isGreatest}. Adding to list.`, 13, { i, isGreatest });
      }
      addStep("Return", "All kids checked. Returning final list.", 15);
    } else {
      addStep("Init", "Starting Optimal approach. Initializing max = 0.", 3);
      for (let i = 0; i < candies.length; i++) {
        addStep("Find Max", `Scanning index ${i}: ${candies[i]}. Current max: ${max}`, 4, { i });
        if (candies[i] > max) {
            max = candies[i];
            addStep("Update Max", `New maximum benchmark found: ${max}`, 5, { i });
        }
      }
      addStep("Benchmark Ready", `Max found: ${max}. Starting second pass for comparisons.`, 8);
      for (let i = 0; i < candies.length; i++) {
        const canReach = candies[i] + extraCandies >= max;
        result.push(canReach);
        addStep("Evaluate", `Kid ${i}: ${candies[i]} + ${extraCandies} = ${candies[i] + extraCandies}. Is it >= ${max}? ${canReach}`, 10, { i, checking: true, canReach });
      }
      addStep("Return", "Completed comparison pass. Returning result.", 12);
    }

    return steps;
  }, [candies, extraCandies, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const currentState = trace[currentStep] || trace[0];
  const currentMaxInTrace = currentState.state.max;
  const globalMaxInput = Math.max(...candies, 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      
      {/* Left Column */}
      <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-sm overflow-hidden">
             {(Object.keys(APPROACHES) as Array<keyof typeof APPROACHES>).map((key) => (
                <button
                  key={key}
                  onClick={() => { setSelectedApproach(key); setCurrentStep(0); }}
                  className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-pink-600 text-white shadow-lg shadow-pink-100' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}
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
                <Code2 size={14} className="text-pink-400"/>
                <span className="font-bold text-slate-300">Solution.java</span>
              </div>
              <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors group">
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                <span className={copied ? "text-green-400" : "text-slate-300"}>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-6 font-mono text-[13px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                <div className="absolute left-0 right-0 bg-pink-500/15 border-l-4 border-pink-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${(currentState.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} />
                {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                    <CodeLineRenderer key={idx} num={idx + 1} code={line} active={currentState.line === idx + 1} />
                ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-pink-600">
                 <Cpu size={18} />
                 <h4 className="text-sm font-black uppercase tracking-widest">Architectural Summary</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{APPROACHES[selectedApproach].explanation}</p>
              <div className={`p-4 rounded-xl border flex gap-3 items-start transition-all duration-300 ${selectedApproach === 'optimal' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                {selectedApproach === 'optimal' ? <Zap className="shrink-0 mt-0.5" size={16}/> : <AlertTriangle className="shrink-0 mt-0.5" size={16}/>}
                <div className="text-xs font-bold leading-relaxed">{APPROACHES[selectedApproach].lag}</div>
              </div>
          </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-[10px] font-black text-pink-600 uppercase tracking-widest block pl-1">Candies Array</label>
              <input value={candiesInput} onChange={(e) => { setCandiesInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all shadow-inner" maxLength={25} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-purple-600 uppercase tracking-widest block pl-1">Extra</label>
              <input type="number" value={extraCandies} onChange={(e) => { setExtraCandies(parseInt(e.target.value) || 0); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-inner" />
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-6 border-t border-slate-100">
            <div className="w-full px-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                    <span>Initial State</span>
                    <span className="text-pink-500">Step {currentStep + 1} of {trace.length}</span>
                    <span>Result</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                    <div className="h-full bg-pink-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(236,72,153,0.5)]" style={{ width: `${(currentStep / (Math.max(1, trace.length - 1))) * 100}%` }} />
                </div>
            </div>
            <div className="flex items-center justify-between gap-4">
                <button onClick={() => setCurrentStep(0)} className="p-3 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-all" title="Reset Simulation"><RotateCcw size={20}/></button>
                <div className="flex gap-3 flex-1">
                    <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        <ChevronLeft size={18} /> Prev
                    </button>
                    <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] px-6 py-3 bg-pink-600 text-white hover:bg-pink-700 rounded-xl font-bold transition-all disabled:opacity-30 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-pink-200">
                        Next Step <ChevronRight size={18} />
                    </button>
                </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-pink-500/20 p-1.5 rounded-lg">
                <Target size={14} className="text-pink-400"/>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step Description</span>
            </div>
            <div className="text-lg font-black tracking-tight mb-2 flex items-center gap-3">
                {currentState.phase}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-700/50">{currentState.description}</p>
        </div>

        {/* Visual Arena */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[350px] relative overflow-hidden flex flex-col justify-end">
           {currentMaxInTrace > 0 && (
              <div className="absolute left-0 right-0 border-t-2 border-dashed border-slate-200 z-0 transition-all duration-500" 
                   style={{ bottom: `${(currentMaxInTrace / (globalMaxInput + extraCandies)) * 200 + 80}px` }}>
                <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded-full absolute right-4 -top-3 border border-slate-200">
                  <Crown size={10} className="inline mr-1 text-amber-500"/> BENCHMARK: {currentMaxInTrace}
                </span>
              </div>
           )}

           <div className="flex items-end justify-center gap-6 relative z-10">
              {candies.map((candy, idx) => {
                 const isI = currentState.state.i === idx;
                 const isJ = currentState.state.j === idx;
                 const resultVal = currentState.state.result[idx];
                 const isMax = candy === currentMaxInTrace && currentMaxInTrace > 0;
                 
                 const height = (candy / (globalMaxInput + extraCandies)) * 200;
                 const extraHeight = (extraCandies / (globalMaxInput + extraCandies)) * 200;

                 return (
                    <div key={idx} className="flex flex-col items-center gap-4 group">
                       <div className="h-6 flex items-end">
                          {resultVal === true && <Check className="text-green-500 animate-in zoom-in" size={24} />}
                          {resultVal === false && <X className="text-red-500 animate-in zoom-in" size={24} />}
                          {(selectedApproach === 'brute' ? isJ : isI) && <div className="text-[10px] font-black bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded animate-bounce">SCAN</div>}
                       </div>

                       <div className="w-12 relative flex flex-col justify-end">
                          {(selectedApproach === 'brute' ? isI : (currentState.state.checking && isI)) && (
                            <div className="absolute bottom-0 w-full bg-pink-100 border-x-2 border-t-2 border-pink-300 rounded-t-xl animate-in slide-in-from-bottom-4 duration-500 z-0"
                                 style={{ height: `${height + extraHeight}px` }}>
                               <div className="text-[10px] font-black text-pink-600 text-center -mt-5">+{extraCandies}</div>
                            </div>
                          )}
                          <div className={`w-full rounded-t-xl transition-all duration-500 flex items-center justify-center font-mono font-black text-sm relative z-10
                            ${isMax ? 'bg-amber-400 text-white shadow-lg ring-4 ring-amber-100' : 'bg-slate-200 text-slate-500'}
                            ${isI ? 'bg-pink-500 text-white shadow-xl shadow-pink-100' : ''}
                          `} style={{ height: `${height}px` }}>
                            {candy}
                          </div>
                       </div>

                       <div className="flex flex-col items-center">
                          <User size={20} className={isI ? 'text-pink-500' : 'text-slate-300'} />
                          <span className="text-[10px] font-black text-slate-400 mt-1">ID: {idx}</span>
                       </div>
                    </div>
                 );
              })}
           </div>
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
         <TopicButton active={selectedTopic === 'problem'} onClick={() => setSelectedTopic('problem')} title="1. The Candy Stash" desc="Rules of the Game" />
         <TopicButton active={selectedTopic === 'aha'} onClick={() => setSelectedTopic('aha')} title="2. Aha! Logic" desc="The Global Peak" />
         <TopicButton active={selectedTopic === 'algo'} onClick={() => setSelectedTopic('algo')} title="3. The Algorithm" desc="Two-Pass Linear Pipeline" />
         <TopicButton active={selectedTopic === 'eff'} onClick={() => setSelectedTopic('eff')} title="4. Efficiency" desc="Complexity Deep-Dive" />
      </div>

      <div className="lg:col-span-9 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 min-h-[600px] flex flex-col">
         {selectedTopic === 'problem' && (
           <div className="space-y-6 animate-in slide-in-from-right-4">
             <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-black mb-1">
                 <AlignLeft size={16}/> Problem Analysis
             </div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Mastering the Greatest Threshold</h2>
             <p className="text-slate-600 leading-relaxed text-lg">
                The challenge is simple: if we give a specific child <strong>all</strong> of our extra candies, can they match or exceed the highest current candy count in the group?
             </p>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner">
                   <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2"><Check className="text-green-500" size={18}/> Non-Exclusive Win</h3>
                   <p className="text-sm text-slate-500 leading-relaxed">Multiple kids can be "the greatest" simultaneously. The threshold is simply <code>current_kid + extras >= global_max</code>.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner">
                   <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2"><Layers size={18} className="text-pink-500"/> Independent Evaluations</h3>
                   <p className="text-sm text-slate-500 leading-relaxed">Giving extra candies to Kid A does <strong>not</strong> change the baseline for Kid B. Each kid's potential is compared against the initial state of the group.</p>
                </div>
             </div>
           </div>
         )}
         
         {selectedTopic === 'aha' && (
           <div className="space-y-6 animate-in slide-in-from-right-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">The "Aha!" Logic: Global Benchmarks</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                The professional engineer's realization: instead of comparing every kid to every other kid (N² operations), we identify the <strong>single property</strong> that matters.
              </p>
              <div className="bg-slate-900 p-8 rounded-3xl text-center font-mono text-2xl text-blue-300 shadow-2xl border-4 border-slate-800">
                 Threshold = MAX(initial_candies)
              </div>
              <div className="space-y-4 pt-4 text-slate-600">
                <p className="text-sm font-medium">Why is this a breakthrough?</p>
                <p className="text-sm leading-relaxed">If Kid A has 2 candies and the Max is 5, Kid A only needs to know if <code>2 + extras</code> reaches 5. They don't need to know what Kid B, C, or D have. This allows us to process the array in linear time.</p>
                <div className="p-4 bg-pink-50 rounded-xl border border-pink-200 text-pink-900 flex gap-4 items-start shadow-sm">
                   <Zap className="shrink-0 text-pink-500" />
                   <p className="text-xs font-bold leading-relaxed">SENIOR STRATEGY: Decoupling the data. Find the global max in pass one, then apply the comparison in pass two. This replaces nested complexity with simple sequential logic.</p>
                </div>
              </div>
           </div>
         )}

         {selectedTopic === 'algo' && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">The Algorithm: Two-Pass Execution</h2>
                <p className="text-slate-600 leading-relaxed text-lg italic">
                    The bridge between a working solution and an optimal one is the Two-Pass approach.
                </p>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 shadow-inner">
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-center mb-2">The Execution Bridge</p>
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex-1 text-center">
                            <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Pass 1</span>
                            <span className="text-xs font-black text-blue-600">Find Max</span>
                        </div>
                        <ArrowRight className="text-slate-300" />
                        <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex-1 text-center">
                            <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Benchmark</span>
                            <span className="text-lg font-black italic">Set Target</span>
                        </div>
                        <ArrowRight className="text-slate-300" />
                        <div className="bg-pink-600 p-4 rounded-xl shadow-lg text-white flex-1 text-center ring-4 ring-pink-100">
                            <span className="text-[10px] font-black uppercase opacity-70 block mb-1">Pass 2</span>
                            <span className="text-xs font-black italic">Compare</span>
                        </div>
                    </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed pt-4">
                    First, we scan the array to determine the highest count currently held by any kid. Once we have this <code>maxCandies</code> value, we iterate a second time, simply checking if each kid's current stash plus the <code>extraCandies</code> meets or exceeds that pre-calculated target.
                </p>
            </div>
         )}

         {selectedTopic === 'eff' && (
           <div className="space-y-6 animate-in slide-in-from-right-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Efficiency & Scaling</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl space-y-3">
                    <div className="font-black text-blue-600 text-xs uppercase tracking-widest">Time Complexity</div>
                    <div className="text-2xl font-black text-slate-900">O(N)</div>
                    <p className="text-xs text-slate-500 leading-relaxed">We traverse the array exactly twice. 2*N simplifies to linear O(N) time. This handles millions of inputs in milliseconds.</p>
                 </div>
                 <div className="p-6 bg-purple-50 border border-purple-100 rounded-2xl space-y-3">
                    <div className="font-black text-purple-600 text-xs uppercase tracking-widest">Space Complexity</div>
                    <div className="text-2xl font-black text-slate-900">O(1) Auxiliary</div>
                    <p className="text-xs text-slate-500 leading-relaxed">We only store a single variable (<code>max</code>). The result list is part of the output and typically doesn't count toward auxiliary space.</p>
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
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4">
                    <MessageSquare className="text-pink-500" size={20} />
                    Interview Q&A
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"Why not find the max and compare in one pass?"</p>
                        <p className="leading-relaxed text-xs italic">"Because the global maximum might be the very last element in the array. We cannot determine if the first kid could reach the maximum until we have scanned every single plot to find what that maximum actually is."</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"How do you handle edge cases like empty arrays?"</p>
                        <p className="leading-relaxed text-xs italic">"LeetCode constraints often guarantee N >= 2, but for robust production code, I'd include an immediate return for empty or null inputs to prevent errors during the max calculation."</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
                <h3 className="text-lg font-black flex items-center gap-2 mb-4 relative z-10">
                    <Target className="text-amber-400" size={20} />
                    The Senior Engineer Pitch
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                    "My solution implements an optimized two-pass linear scan. By isolating the 'find-maximum' operation, I establish a consistent global benchmark. This transforms the problem into a simple O(N) evaluation where each kid's potential is checked against a static property. This approach guarantees peak performance and minimal memory footprint, ensuring the logic scales effortlessly regardless of group size."
                </p>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-black text-amber-900 flex items-center gap-2 mb-4">
                    <AlertCircle size={20} />
                    Key Concepts
                </h3>
                <div className="space-y-4 text-xs">
                    <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
                        <span className="text-[10px] font-black text-amber-600 block mb-1 uppercase tracking-widest">THRESHOLD LOGIC</span>
                        <p className="text-xs text-slate-600 leading-relaxed">The only variable that changes Kid A's status is their own boost. The target is global.</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
                        <span className="text-[10px] font-black text-amber-600 block mb-1 uppercase tracking-widest">LINEAR SCAN</span>
                        <p className="text-xs text-slate-600 leading-relaxed">Always emphasize that N+N is still O(N). Avoid nested loops at all costs in simple search problems.</p>
                    </div>
                </div>
            </div>

            <div className="bg-pink-600 text-white rounded-2xl p-6 shadow-xl shadow-pink-100">
                <h3 className="text-lg font-black flex items-center gap-2 mb-2">
                    <Check size={20} />
                    Complexity Overview
                </h3>
                <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono">
                    <div className="bg-pink-700/50 p-4 rounded-xl border border-pink-400/30">
                        <div className="font-black text-pink-100 mb-1 uppercase tracking-widest text-[9px]">Time Complexity</div>
                        O(N)
                    </div>
                    <div className="bg-pink-700/50 p-4 rounded-xl border border-pink-400/30">
                        <div className="font-black text-pink-100 mb-1 uppercase tracking-widest text-[9px]">Space Complexity</div>
                        O(1) Auxiliary
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|List|ArrayList|Math)\b|\b\d+\b|\b(?:add|max|length)\b)/g).filter(Boolean);

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
          if (['List', 'ArrayList', 'Math', 'String'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['add', 'max', 'length'].includes(part)) return <span key={i} className="text-indigo-300">{part}</span>;
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
        ? 'bg-pink-50 border-pink-500 shadow-md ring-1 ring-pink-100' 
        : 'bg-white border-slate-200 hover:border-pink-300 hover:bg-slate-50'}
    `}
  >
    <div className={`font-black uppercase tracking-tight text-sm ${active ? 'text-pink-800' : 'text-slate-700 group-hover:text-pink-700'}`}>
      {title}
    </div>
    <div className={`text-[10px] font-bold mt-1 ${active ? 'text-pink-600' : 'text-slate-400'}`}>
      {desc}
    </div>
  </button>
);

export default KidsCandiesVisualizer;