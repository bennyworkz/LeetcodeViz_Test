import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, Check, Copy, AlignLeft, Zap, Trophy, MessageSquare, Target, AlertCircle, Cpu, TrendingUp, BarChart3, ArrowUp, FileText } from 'lucide-react';

const APPROACHES = {
  brute: {
    id: 'brute',
    title: '1. Array Construction',
    subtitle: 'Full Prefix Storage',
    icon: <BarChart3 size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public int largestAltitude(int[] gain) {
        int n = gain.length;
        int[] altitudes = new int[n + 1];
        altitudes[0] = 0;
        int max = 0;
        
        for (int i = 0; i < n; i++) {
            altitudes[i + 1] = altitudes[i] + gain[i];
            max = Math.max(max, altitudes[i + 1]);
        }
        return max;
    }
}`,
    explanation: "This approach explicitly builds the entire altitude profile into a new array. It's great for visualization or if you need to return the whole trip history, but uses extra memory unnecessarily if you only need the peak."
  },
  optimal: {
    id: 'optimal',
    title: '2. Running Sum',
    subtitle: 'Space Optimized',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int largestAltitude(int[] gain) {
        int currentAltitude = 0;
        int maxAltitude = 0;
        
        for (int i : gain) {
            currentAltitude += i;
            maxAltitude = Math.max(maxAltitude, currentAltitude);
        }
        
        return maxAltitude;
    }
}`,
    explanation: "The professional standard for 'running total' problems. We only care about the current position and the record peak. By using two variables instead of an array, we achieve constant auxiliary space."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">1732. Find the Highest Altitude</h2>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          There is a biker going on a road trip. The road trip consists of <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">n + 1</code> points at different altitudes. The biker starts his trip on point <code className="font-bold text-slate-800">0</code> with altitude <code className="font-bold text-slate-800">0</code>.
        </p>
        
        <p className="text-lg leading-relaxed">
          You are given an integer array <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">gain</code> of length <code className="bg-slate-100 px-1.5 rounded font-mono font-bold">n</code> where <code className="bg-slate-100 px-1.5 rounded font-mono font-bold">gain[i]</code> is the <strong>net gain in altitude</strong> between points <code className="italic">i</code> and <code className="italic">i + 1</code> for all (<code className="bg-slate-100 px-1.5 rounded">0 {'<='} i {'<'} n</code>).
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 italic underline">
          Return the highest altitude of a point.
        </p>

        <div className="space-y-8 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> gain = [-5,1,5,0,-7]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 1</p>
              <p className="text-xs text-slate-500 italic mt-2">Explanation: The altitudes are [0,-5,-4,1,1,-6]. The highest is 1.</p>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-100 mt-10">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <AlertCircle size={14} /> Constraints:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">n == gain.length</code></li>
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">1 {'<='} n {'<='} 100</code></li>
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">-100 {'<='} gain[i] {'<='} 100</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const HighestAltitudeVisualizer = () => {
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Find Highest Altitude</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">1732</span>
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
  const [gainInput, setGainInput] = useState("-5,1,5,0,-7");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const gain = useMemo(() => gainInput.split(',').map(n => parseInt(n.trim()) || 0), [gainInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = gain.length;
    let currentAlt = 0;
    let maxAlt = 0;
    const altitudes = [0];

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ phase, description: desc, line, state: { ...state, gain: [...gain] } });
    };

    if (selectedApproach === 'brute') {
      addStep("Init", "Start at Point 0 with Altitude 0. Create altitudes array.", 5, { currentAlt, maxAlt, altitudes: [...altitudes], idx: -1 });
      for (let i = 0; i < n; i++) {
        currentAlt += gain[i];
        altitudes.push(currentAlt);
        const isNewMax = currentAlt > maxAlt;
        maxAlt = Math.max(maxAlt, currentAlt);
        addStep("Update", `Point ${i + 1}: ${altitudes[altitudes.length - 2]} + (${gain[i]}) = ${currentAlt}. Peak so far: ${maxAlt}.`, 9, { currentAlt, maxAlt, altitudes: [...altitudes], idx: i, isNewMax });
      }
    } else {
      addStep("Init", "Start at Point 0. Altitude = 0, Max = 0.", 3, { currentAlt: 0, maxAlt: 0, idx: -1 });
      for (let i = 0; i < n; i++) {
        const val = gain[i];
        currentAlt += val;
        const isNewMax = currentAlt > maxAlt;
        maxAlt = Math.max(maxAlt, currentAlt);
        addStep("Step", `Gain ${val} makes altitude ${currentAlt}. ${isNewMax ? 'New peak!' : 'Peak remains ' + maxAlt}.`, 7, { currentAlt, maxAlt, idx: i, isNewMax });
      }
    }

    addStep("Finish", `Final Point reached. The highest altitude recorded was ${maxAlt}.`, 13, { finished: true, currentAlt, maxAlt, altitudes: [...altitudes] });
    return steps;
  }, [gain, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const currentState = trace[currentStep] || trace[0];
  const { currentAlt, maxAlt, idx, isNewMax, finished } = currentState.state;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      
      {/* Left Column */}
      <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-sm overflow-hidden">
             {(Object.keys(APPROACHES) as Array<keyof typeof APPROACHES>).map((key) => (
                <button key={key} onClick={() => { setSelectedApproach(key); setCurrentStep(0); }} className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}>
                  <div className={`mb-1 transition-transform duration-300 ${selectedApproach === key ? 'scale-110' : ''}`}>{APPROACHES[key].icon}</div>
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
                 <h4 className="text-sm font-black uppercase tracking-widest">Architectural Summary</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{APPROACHES[selectedApproach].explanation}</p>
          </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block pl-1">Gain Array</label>
            <input value={gainInput} onChange={(e) => { setGainInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner" maxLength={30} />
          </div>

          <div className="flex flex-col gap-5 pt-6 border-t border-slate-100">
            <div className="w-full px-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                    <span>Point 0</span>
                    <span className="text-emerald-500">Progress Step {currentStep + 1}</span>
                    <span>Finish</span>
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
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-emerald-500/20 p-1.5 rounded-lg">
                <Target size={14} className="text-emerald-400"/>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Context</span>
            </div>
            <div className="text-lg font-black tracking-tight mb-2 uppercase">{currentState.phase}</div>
            <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-700/50">{currentState.description}</p>
        </div>

        {/* Visual Arena */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[350px] relative overflow-hidden flex flex-col justify-center items-center gap-12">
            
            <div className="flex gap-16">
                <div className="text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Altitude</span>
                    <div className="text-4xl font-black text-slate-900 tabular-nums">{currentAlt}</div>
                </div>
                <div className="w-px h-12 bg-slate-100" />
                <div className="text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Peak</span>
                    <div className={`text-4xl font-black transition-all duration-300 ${isNewMax ? 'text-emerald-600 scale-125' : 'text-indigo-600'}`}>{maxAlt}</div>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 relative px-10">
                {gain.map((val, gIdx) => {
                    const isActive = idx === gIdx;
                    const isProcessed = gIdx < idx;
                    
                    return (
                        <div key={gIdx} className="flex flex-col items-center transition-all duration-300">
                            <div className={`
                                w-12 h-14 border-2 rounded-xl flex items-center justify-center font-mono text-lg transition-all duration-300 relative
                                ${isActive ? 'bg-emerald-50 border-emerald-500 scale-110 shadow-lg z-10' : isProcessed ? 'bg-slate-50 border-slate-200 opacity-50' : 'bg-white border-slate-200'}
                                ${val >= 0 ? 'text-emerald-700' : 'text-rose-700'}
                            `}>
                                {val >= 0 ? `+${val}` : val}
                                {isActive && !finished && (
                                    <div className="absolute -top-6 text-emerald-600 animate-bounce">
                                        <ArrowUp size={16} />
                                    </div>
                                )}
                            </div>
                            <span className="mt-2 text-[10px] font-mono font-black text-slate-300">G{gIdx}</span>
                        </div>
                    );
                })}
            </div>

            {finished && (
               <div className="animate-in zoom-in duration-500">
                  <div className="bg-emerald-50 border-2 border-emerald-200 px-10 py-6 rounded-3xl flex flex-col items-center gap-2 shadow-xl">
                      <Check className="text-green-600" size={40} />
                      <span className="text-xs font-black uppercase tracking-widest text-green-700">Trip Ended</span>
                      <span className="text-4xl font-black text-slate-900">{maxAlt}</span>
                  </div>
               </div>
            )}
        </div>
      </div>
    </div>
  );
};

const LearnMode = () => {
    const [selectedTopic, setSelectedTopic] = useState('prefix');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-3 space-y-2">
                <TopicButton active={selectedTopic === 'prefix'} onClick={() => setSelectedTopic('prefix')} title="1. Prefix Sums" desc="The Accumulation Pattern" />
                <TopicButton active={selectedTopic === 'running'} onClick={() => setSelectedTopic('running')} title="2. Memory Saving" desc="Avoiding Arrays" />
                <TopicButton active={selectedTopic === 'starting'} onClick={() => setSelectedTopic('starting')} title="3. Point Zero" desc="The starting constraint" />
            </div>

            <div className="lg:col-span-9 bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col">
                {selectedTopic === 'prefix' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold mb-1">
                            <AlignLeft size={16}/> Accumulation Logic
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Prefix Sum Mechanics</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            A prefix sum is an array where each element is the sum of all previous elements in the source array. 
                        </p>
                        
                        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-4">
                            <h3 className="font-bold text-indigo-800">The Altitude Profile</h3>
                            <p className="text-indigo-900 text-sm">
                                If your <code>gains</code> are [-5, 1, 5], your altitudes are computed as:<br/>
                                <span className="font-mono mt-2 block">
                                    P0: 0 (Start)<br/>
                                    P1: 0 + (-5) = -5<br/>
                                    P2: -5 + (1) = -4<br/>
                                    P3: -4 + (5) = 1
                                </span>
                            </p>
                        </div>
                    </div>
                )}

                {selectedTopic === 'running' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800 font-black tracking-tight text-emerald-900">One Pass, Zero Waste</h2>
                        <p className="text-slate-600">Why build an array if you only need one number?</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 border rounded-xl">
                                <span className="font-black text-slate-800 uppercase text-xs">Standard Method</span>
                                <p className="text-sm text-slate-600 mt-2">Create an altitude array <code>A</code>. Then iterate through <code>A</code> to find the max. O(N) Time, O(N) Space.</p>
                            </div>
                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                                <span className="font-black text-emerald-800 uppercase text-xs">Optimal Method</span>
                                <p className="text-sm text-emerald-700 mt-2">Maintain <code>current</code> and <code>max</code>. Update both as you read the gains. O(N) Time, O(1) Space.</p>
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
                    <MessageSquare className="text-emerald-500" size={20} />
                    Interview Q&A
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"Why do we initialize maxAltitude to 0?"</p>
                        <p>Answer: "Because the trip starts at altitude 0. If every subsequent gain is negative (e.g., [-5, -10]), the starting point remains the highest point of the trip. Initializing to 0 correctly handles these cases."</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg border-l-4 border-emerald-500">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 uppercase tracking-widest text-emerald-400">
                    <Target size={20} />
                    The Elite Pitch
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                    "I implemented an O(N) linear-time accumulation solution that identifies the peak altitude in a single pass. By maintaining a simple running sum and a record-tracking variable, I bypassed the need for auxiliary array storage, achieving optimal constant O(1) space complexity. This approach ensures maximum efficiency regardless of trip length, handling the starting zero-altitude baseline implicitly."
                </p>
            </div>
        </div>

        <div className="space-y-6 text-slate-800">
            <div className="bg-emerald-600 text-white rounded-xl p-6 shadow-lg shadow-emerald-100 flex flex-col justify-center">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                    <Check size={20} />
                    Complexity Overview
                </h3>
                <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono">
                    <div className="bg-emerald-700/50 p-4 rounded-xl border border-emerald-400/30">
                        <div className="font-black text-indigo-100 mb-1 uppercase tracking-widest text-[9px]">Time Complexity</div>
                        O(N) (Linear)
                    </div>
                    <div className="bg-emerald-700/50 p-4 rounded-xl border border-emerald-400/30">
                        <div className="font-black text-indigo-100 mb-1 uppercase tracking-widest text-[9px]">Space Complexity</div>
                        O(1) Auxiliary
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
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
  <button onClick={onClick} className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group ${active ? 'bg-emerald-50 border-emerald-500 shadow-md ring-1 ring-emerald-100' : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50'}`}>
    <div className={`font-black uppercase tracking-tight text-sm ${active ? 'text-emerald-800' : 'text-slate-700 group-hover:text-emerald-700'}`}>{title}</div>
    <div className={`text-[10px] font-bold mt-1 ${active ? 'text-emerald-600' : 'text-slate-400'}`}>{desc}</div>
  </button>
);

export default HighestAltitudeVisualizer;