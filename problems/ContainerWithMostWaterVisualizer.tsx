import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, Check, Copy, AlignLeft, Zap, Trophy, MessageSquare, Target, AlertCircle, Cpu, MousePointer2, Waves, Ruler, Maximize, X } from 'lucide-react';

const APPROACHES = {
  brute: {
    id: 'brute',
    title: '1. Brute Force',
    subtitle: 'Exhaustive Pairs',
    icon: <AlertCircle size={16} />,
    complexity: 'Time: O(N²) | Space: O(1)',
    code: `class Solution {
    public int maxArea(int[] height) {
        int max = 0;
        for (int i = 0; i < height.length; i++) {
            for (int j = i + 1; j < height.length; j++) {
                int h = Math.min(height[i], height[j]);
                int w = j - i;
                max = Math.max(max, h * w);
            }
        }
        return max;
    }
}`,
    explanation: "Checks every possible pair of lines to find the maximum volume. While guaranteed to find the result, checking all O(N²) pairs is too slow for large arrays."
  },
  optimal: {
    id: 'optimal',
    title: '2. Two-Pointer',
    subtitle: 'Optimal Inward Convergence',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int maxArea(int[] height) {
        int left = 0, right = height.length - 1;
        int maxArea = 0;

        while (left < right) {
            int h = Math.min(height[left], height[right]);
            int w = right - left;
            maxArea = Math.max(maxArea, h * w);

            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxArea;
    }
}`,
    explanation: "Starts with the widest possible container. By moving the shorter pointer inward, we sacrifice width in the hope of finding a significantly taller line to increase the total volume."
  }
};

const ContainerWithMostWaterVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'learn' | 'interview'>('visualizer');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-200">
                <Waves className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Container With Most Water</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">11</span>
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
  const [heightsInput, setHeightsInput] = useState("1,8,6,2,5,4,8,3,7");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const heights = useMemo(() => heightsInput.split(',').map(n => parseInt(n.trim()) || 0), [heightsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = heights.length;
    let maxArea = 0;

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ phase, description: desc, line, state: { ...state, heights: [...heights] } });
    };

    if (selectedApproach === 'brute') {
      addStep("Init", "Initialize max area to 0.", 3, { maxArea: 0, i: -1, j: -1 });
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const h = Math.min(heights[i], heights[j]);
          const w = j - i;
          const currentArea = h * w;
          const isNewMax = currentArea > maxArea;
          if (isNewMax) maxArea = currentArea;
          
          addStep("Compare", `Checking lines ${i} and ${j}. Area = ${h} (height) * ${w} (width) = ${currentArea}.`, 7, { i, j, maxArea, currentArea, h, w, isNewMax });
        }
      }
    } else {
      // Optimal
      let left = 0;
      let right = n - 1;
      addStep("Init", "Initialize pointers at ends: left = 0, right = last.", 3, { left, right, maxArea: 0 });

      while (left < right) {
        const h = Math.min(heights[left], heights[right]);
        const w = right - left;
        const currentArea = h * w;
        const isNewMax = currentArea > maxArea;
        if (isNewMax) maxArea = currentArea;

        addStep("Calculate", `Current container: left=${left}, right=${right}. Width=${w}, Height=${h}, Area=${currentArea}.`, 8, { left, right, maxArea, currentArea, h, w, isNewMax });

        if (heights[left] < heights[right]) {
          addStep("Move Left", `Left line (${heights[left]}) is shorter than right (${heights[right]}). Moving left pointer inward.`, 11, { left, right, maxArea, currentArea, moving: 'left' });
          left++;
        } else {
          addStep("Move Right", `Right line (${heights[right]}) is shorter or equal to left (${heights[left]}). Moving right pointer inward.`, 13, { left, right, maxArea, currentArea, moving: 'right' });
          right--;
        }
      }
    }

    addStep("Finish", `Search complete. Maximum area found: ${maxArea}`, 17, { finished: true, maxArea });
    return steps;
  }, [heights, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const currentState = trace[currentStep] || trace[0];
  const { left, right, maxArea, currentArea, h, w, finished, moving, i: bruteI, j: bruteJ } = currentState.state;

  const L = selectedApproach === 'optimal' ? left : bruteI;
  const R = selectedApproach === 'optimal' ? right : bruteJ;

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
            <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block pl-1">Heights Array (height)</label>
            <input value={heightsInput} onChange={(e) => { setHeightsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner" maxLength={40} />
          </div>

          <div className="flex flex-col gap-5 pt-6 border-t border-slate-100">
            <div className="w-full px-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                    <span>Initial</span>
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
              <span className="text-[10px] font-black uppercase tracking-widest">Simulation Context</span>
            </div>
            <div className="text-lg font-black tracking-tight mb-2 uppercase">{currentState.phase}</div>
            <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-700/50">{currentState.description}</p>
        </div>

        {/* Visual Arena */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[450px] relative overflow-hidden flex flex-col justify-center items-center gap-4">
            
            {/* Stats Dashboard */}
            <div className="w-full flex justify-around mb-4">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Area</span>
                    <div className={`text-2xl font-black transition-all duration-300 ${currentState.state.isNewMax ? 'text-green-500 scale-125' : 'text-blue-600'}`}>{currentArea || 0}</div>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max Area So Far</span>
                    <div className="text-2xl font-black text-indigo-700">{maxArea || 0}</div>
                </div>
            </div>

            {/* Container Visualization */}
            <div className="relative w-full h-[250px] flex items-end justify-center px-8">
                {/* Grid Lines */}
                <div className="absolute inset-0 border-b-2 border-slate-200 z-0"></div>
                
                {/* Water Shading */}
                {!finished && L !== undefined && R !== undefined && L !== -1 && R !== -1 && (
                    <div 
                        className="absolute bg-blue-400/20 border-t-2 border-dashed border-blue-400 transition-all duration-500 z-0"
                        style={{
                            left: `${(L / (heights.length - 1)) * 100}%`,
                            right: `${100 - (R / (heights.length - 1)) * 100}%`,
                            height: `${(h / Math.max(...heights, 1)) * 100}%`,
                            bottom: '0'
                        }}
                    >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black text-blue-600 uppercase bg-white/80 px-2 rounded-full border border-blue-100 shadow-sm">
                            Area: {h} &times; {w} = {currentArea}
                        </div>
                    </div>
                )}

                {/* Bars */}
                {heights.map((val, idx) => {
                    const isLeft = L === idx;
                    const isRight = R === idx;
                    const isActive = isLeft || isRight;
                    const isShorter = isActive && val === h && !finished;
                    
                    const barHeight = (val / Math.max(...heights, 1)) * 100;

                    return (
                        <div 
                            key={idx} 
                            className="flex-1 flex flex-col items-center group transition-all duration-300"
                            style={{ maxWidth: '40px' }}
                        >
                            <div className="relative h-full w-full flex items-end justify-center px-1">
                                <div 
                                    className={`
                                        w-full rounded-t-md transition-all duration-500 relative
                                        ${isActive ? 'bg-blue-600 shadow-lg' : 'bg-slate-200'}
                                        ${isShorter && moving ? 'ring-4 ring-rose-400/30' : ''}
                                    `}
                                    style={{ height: `${barHeight}%` }}
                                >
                                    {isActive && (
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono font-black text-xs text-blue-700">
                                            {val}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Pointer Labels */}
                                {isLeft && !finished && (
                                    <div className="absolute -bottom-10 flex flex-col items-center animate-in slide-in-from-bottom-2">
                                        <div className="bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase mb-1">Left</div>
                                        <Target size={12} className="text-blue-600" />
                                    </div>
                                )}
                                {isRight && !finished && (
                                    <div className="absolute -bottom-10 flex flex-col items-center animate-in slide-in-from-bottom-2">
                                        <div className="bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase mb-1">Right</div>
                                        <Target size={12} className="text-blue-600" />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {finished && (
               <div className="mt-12 animate-in zoom-in duration-500">
                  <div className="bg-green-50 border-2 border-green-200 px-10 py-6 rounded-3xl flex flex-col items-center gap-2 shadow-xl">
                      <Check className="text-green-600" size={40} />
                      <span className="text-xs font-black uppercase tracking-widest text-green-700">Result Max Area</span>
                      <span className="text-4xl font-black text-slate-900">{maxArea}</span>
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
                <TopicButton active={selectedTopic === 'problem'} onClick={() => setSelectedTopic('problem')} title="1. The Geometry" desc="Width vs Height" />
                <TopicButton active={selectedTopic === 'strategy'} onClick={() => setSelectedTopic('strategy')} title="2. Two-Pointer Logic" desc="Moving the shorter line" />
                <TopicButton active={selectedTopic === 'proof'} onClick={() => setSelectedTopic('proof')} title="3. Logical Proof" desc="Why not skip the tall line?" />
            </div>

            <div className="lg:col-span-9 bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col">
                {selectedTopic === 'problem' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold mb-1">
                            <AlignLeft size={16}/> Understanding 11
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">The Goal</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Find two vertical lines in an array such that the container formed by them holds the maximum amount of water.
                        </p>
                        
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-4">
                            <h3 className="font-bold text-blue-800 flex items-center gap-2"><Ruler size={20}/> The Formula</h3>
                            <div className="bg-white p-4 rounded-xl border border-blue-200 text-center shadow-inner">
                                <code className="text-2xl font-black text-blue-700">Area = min(h[L], h[R]) &times; (R - L)</code>
                            </div>
                            <ul className="space-y-2 text-sm text-blue-900">
                                <li className="flex gap-2"><Check size={16} className="text-emerald-600 font-bold"/> <strong>Height:</strong> Limited by the <i>shorter</i> of the two lines.</li>
                                <li className="flex gap-2"><Check size={16} className="text-emerald-600 font-bold"/> <strong>Width:</strong> The horizontal distance between the indices.</li>
                            </ul>
                        </div>
                    </div>
                )}

                {selectedTopic === 'strategy' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800 font-black tracking-tight text-blue-900">Optimal Strategy</h2>
                        <p className="text-slate-600">Why move the shorter line?</p>
                        
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start p-4 bg-amber-50 rounded-xl border border-amber-100">
                                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold shrink-0">!</div>
                                <div>
                                    <span className="font-black text-amber-700 uppercase text-xs tracking-widest">The Trade-off</span>
                                    <p className="text-sm text-amber-900 mt-1">When we move pointers inward, the <b>width</b> always decreases. To compensate and find a larger area, we <b>must</b> find a larger height.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shrink-0">✓</div>
                                <div>
                                    <span className="font-black text-emerald-700 uppercase text-xs tracking-widest">Moving Short Pointer</span>
                                    <p className="text-sm text-emerald-900 mt-1">Moving the shorter pointer might find a taller line. Moving the taller pointer <b>cannot</b> help, because the height is still capped by the shorter one!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {selectedTopic === 'proof' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">Greedy Inward Proof</h2>
                        <p className="text-slate-600 leading-relaxed text-lg italic">
                           "If we have lines at L and R, and height[L] &lt; height[R], then any pair involving L and any index between L and R will result in an area strictly smaller than our current one."
                        </p>
                        
                        <div className="bg-slate-900 p-6 rounded-2xl text-white space-y-4 shadow-2xl border-l-4 border-blue-500">
                            <div className="flex gap-2 items-center text-xs font-bold text-blue-400 uppercase tracking-widest">
                                <AlertCircle size={14}/> Core Observation
                            </div>
                            <p className="text-sm text-slate-300">
                                1. Width decreases. <br/>
                                2. Height is capped by height[L]. <br/>
                                3. Therefore, area <b>cannot</b> increase if we keep L. <br/>
                                4. We can safely discard L and move inward.
                            </p>
                        </div>
                        
                        <p className="text-sm text-slate-500 border-t pt-4">
                            This greedy decision-making reduces the problem from O(N²) checking all combinations to a single O(N) pass.
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
                    Interview Q&A
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"Why does the two-pointer approach work here?"</p>
                        <p>Answer: "It works because we exploit the monotonicity of width. Since width decreases with every step inward, the only way to find a better solution is to increase height. Moving the pointer that limits the height (the shorter one) is the only logical move that could possibly improve the area."</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"Is there any scenario where moving the taller line is better?"</p>
                        <p>Answer: "No. If you have lines of height 5 and 10, the container is height 5. If you move the 10, the new container height will either be &le; 5 (still capped by the original shorter line) or &le; (new height). In either case, the area decreases because width shrunk."</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 uppercase tracking-widest text-blue-400">
                    <Target size={20} />
                    The Pitch
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                    "I implemented an O(N) linear time two-pointer solution. By starting at the outermost boundaries and converging inward based on which line is shorter, I ensure that we check every potential candidate for the maximum volume. This approach achieves optimal constant O(1) auxiliary space and efficiently handles large input arrays by eliminating the need for nested iterations."
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
                        <span className="text-[10px] font-black text-amber-600 block mb-1 uppercase tracking-widest">EARLY EXIT?</span>
                        <p className="text-xs text-slate-600">While you can't strictly early exit, you can skip processing lines that are shorter than or equal to the heights already processed at that pointer position.</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-amber-100 shadow-sm">
                        <span className="text-[10px] font-black text-amber-600 block mb-1 uppercase tracking-widest">CONSTRAINTS</span>
                        <p className="text-xs text-slate-600">With 10⁵ elements, O(N²) is impossible. O(N) is the target. This problem is a classic "greedy choice property" demonstration.</p>
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
                        <div className="font-black text-blue-100 mb-1 uppercase tracking-widest text-[9px]">Time Complexity</div>
                        O(N) (One Pass)
                    </div>
                    <div className="bg-blue-700/50 p-4 rounded-xl border border-blue-400/30">
                        <div className="font-black text-blue-100 mb-1 uppercase tracking-widest text-[9px]">Space Complexity</div>
                        O(1)
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
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|void|Math|max|min|length)\b|\b\d+\b)/g).filter(Boolean);

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
          if (['Math', 'max', 'min', 'length'].includes(part)) return <span key={i} className="text-indigo-300 font-bold">{part}</span>;
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
        ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-200' 
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

export default ContainerWithMostWaterVisualizer;