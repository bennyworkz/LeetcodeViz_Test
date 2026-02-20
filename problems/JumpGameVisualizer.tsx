
import React, { useState, useMemo } from 'react';
import { 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Activity, 
  BookOpen, 
  Code2, 
  Check, 
  Copy, 
  Zap, 
  Trophy, 
  MessageSquare, 
  Target, 
  AlertCircle, 
  Cpu, 
  Layers, 
  Hash, 
  Database, 
  Calculator, 
  FileText, 
  ArrowRight, 
  ArrowDown, 
  Info, 
  BarChart3, 
  X, 
  TrendingUp,
  Map,
  Flag,
  FastForward,
  Compass,
  ZapOff,
  Search,
  MousePointer2,
  // Fixed: Added missing History and Timer icons to the lucide-react imports to resolve JSX component errors
  History,
  Timer
} from 'lucide-react';

const APPROACHES = {
  greedy: {
    id: 'greedy',
    title: '1. Greedy (Furthest)',
    subtitle: 'Optimal O(1) Space',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public boolean canJump(int[] nums) {
        int reachable = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > reachable) {
                return false;
            }
            reachable = Math.max(reachable, i + nums[i]);
            if (reachable >= nums.length - 1) {
                return true;
            }
        }
        return true;
    }
}`,
    explanation: "At each step, we update the maximum distance we can possibly reach. If the current index 'i' ever exceeds this distance, it means we've hit an unreachable gap (a zero that blocks all paths)."
  },
  backward: {
    id: 'backward',
    title: '2. Backward Strategy',
    subtitle: 'Last Good Position',
    icon: <History size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public boolean canJump(int[] nums) {
        int lastGoodPos = nums.length - 1;
        for (int i = nums.length - 1; i >= 0; i--) {
            if (i + nums[i] >= lastGoodPos) {
                lastGoodPos = i;
            }
        }
        return lastGoodPos == 0;
    }
}`,
    explanation: "We work backward from the goal. We track the closest index from which the goal is reachable. If we can reach the start (index 0) with this property, the whole path is valid."
  }
};

const JumpGameVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproach, setSelectedApproach] = useState<keyof typeof APPROACHES>('greedy');
  const [numsInput, setNumsInput] = useState("2,3,1,1,4");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const nums = useMemo(() => numsInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)), [numsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = nums.length;

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ 
        phase, 
        description: desc, 
        line, 
        state: { 
          nums: [...nums],
          i: -1,
          reachable: 0,
          ...state 
        } 
      });
    };

    if (n === 0) return steps;

    if (selectedApproach === 'greedy') {
      let reachable = 0;
      addStep("Initialization", "Set reachable limit to 0 (starting position).", 3, { reachable: 0 });

      for (let i = 0; i < n; i++) {
        addStep("Loop Header", `Checking index i = ${i} (Value: ${nums[i]}).`, 4, { i, reachable });
        
        // Granular IF check
        const isStuck = i > reachable;
        addStep("Condition Evaluation", `Is current index ${i} > reachable limit ${reachable}? ${isStuck ? 'YES' : 'NO'}.`, 5, { i, reachable, error: isStuck });
        
        if (isStuck) {
          addStep("Return False", `Index ${i} is beyond our horizon. We are trapped. Returning false.`, 6, { i, reachable, finished: true, success: false });
          return steps;
        }

        const potential = i + nums[i];
        const newReachable = Math.max(reachable, potential);
        const didImprove = potential > reachable;
        
        addStep("Update Reachable", `Calculating new potential: i(${i}) + nums[i](${nums[i]}) = ${potential}.`, 8, { i, reachable, potential });
        addStep("Apply Max", didImprove ? `Reachable improved! New horizon: ${newReachable}.` : `Reachable remains ${reachable}. Current jump doesn't extend our horizon.`, 8, { i, reachable: newReachable, potential });
        reachable = newReachable;

        const reachedEnd = reachable >= n - 1;
        addStep("End Check", `Can reachable (${reachable}) reach the last index (${n-1})? ${reachedEnd ? 'YES' : 'NO'}.`, 9, { i, reachable });
        
        if (reachedEnd) {
          addStep("Return True", "Target is within reach! Terminating early with success.", 10, { i, reachable, finished: true, success: true });
          return steps;
        }
      }
      addStep("Loop Finish", "Processed all elements. Final check.", 13, { reachable, finished: true, success: true });

    } else {
      // Backward Approach
      let lastGoodPos = n - 1;
      addStep("Initialization", `Set target "Good Position" to the last index: ${lastGoodPos}.`, 3, { lastGoodPos });

      for (let i = n - 1; i >= 0; i--) {
        addStep("Loop Header", `Evaluating index i = ${i} (Value: ${nums[i]}).`, 4, { i, lastGoodPos });
        
        const canReachTarget = i + nums[i] >= lastGoodPos;
        addStep("Condition Evaluation", `Can we reach ${lastGoodPos} from index ${i}? ${i} + ${nums[i]} >= ${lastGoodPos} is ${canReachTarget ? 'TRUE' : 'FALSE'}.`, 5, { i, lastGoodPos, match: canReachTarget });
        
        if (canReachTarget) {
          lastGoodPos = i;
          addStep("Update Target", `Found a new waypoint! Updating lastGoodPos to ${i}.`, 6, { i, lastGoodPos });
        }
      }
      
      const isComplete = lastGoodPos === 0;
      addStep("Final Check", `Did our target reach index 0? ${isComplete ? 'YES' : 'NO'}.`, 9, { lastGoodPos, finished: true, success: isComplete });
    }

    return steps;
  }, [nums, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(APPROACHES[selectedApproach].code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0];
  const { i: activeI, reachable: curReachable, lastGoodPos, potential, finished, success, error, match } = cur.state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center">
                <Flag className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Jump Game</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-2 font-mono">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded tracking-tighter uppercase font-black tracking-widest">Greedy Analysis</span>
                <span>LC 55 • Medium</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
            <TabButton active={activeTab === 'problem'} onClick={() => setActiveTab('problem')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<BookOpen size={16}/>} label="Learn" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'problem' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 animate-in fade-in duration-700">
            <div className="max-w-3xl space-y-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-6 font-mono tracking-tighter text-indigo-600 underline decoration-indigo-100 decoration-8 underline-offset-4">55. Jump Game</h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-lg leading-relaxed font-mono">
                  <p>You are given an integer array <code>nums</code>. You are initially positioned at the array's <strong>first index</strong>, and each element in the array represents your <strong>maximum jump length</strong> at that position.</p>
                  <p>Return <code>true</code> if you can reach the last index, or <code>false</code> otherwise.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 font-mono">
                    <Hash size={16}/> Examples:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 font-mono text-sm shadow-inner space-y-3">
                      <p><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Input:</span> nums = [2,3,1,1,4]</p>
                      <p><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Output:</span> true</p>
                      <p className="text-[10px] text-slate-400 italic leading-relaxed border-t pt-2">
                          Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 font-mono text-sm shadow-inner space-y-3">
                      <p><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Input:</span> nums = [3,2,1,0,4]</p>
                      <p><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Output:</span> false</p>
                      <p className="text-[10px] text-slate-400 italic leading-relaxed border-t pt-2">
                          Explanation: You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <AlertCircle size={14} /> Constraints:
                </h3>
                <ul className="list-disc list-inside space-y-3 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <li><code className="bg-slate-100 px-1.5 rounded text-slate-800 font-bold">1 {'<='} nums.length {'<='} 10<sup>4</sup></code></li>
                  <li><code>0 {'<='} nums[i] {'<='} 10<sup>5</sup></code></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-2 flex gap-2 shadow-sm">
                {(Object.keys(APPROACHES) as Array<keyof typeof APPROACHES>).map((key) => (
                  <button key={key} onClick={() => { setSelectedApproach(key); setCurrentStep(0); }} className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}>
                    <span className="text-xs font-black uppercase tracking-tight">{APPROACHES[key].title}</span>
                    <span className={`text-[10px] opacity-70 ${selectedApproach === key ? 'text-white' : 'text-slate-400'}`}>
                      {APPROACHES[key].complexity}
                    </span>
                  </button>
                ))}
              </div>

              <div className="bg-[#0f172a] rounded-3xl h-[420px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Code2 size={14} className="text-indigo-400" />
                    <span className="font-bold uppercase tracking-tight text-white">Solution.java</span>
                  </div>
                  <button onClick={handleCopy} className="hover:text-white transition-colors">
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="p-6 font-mono text-[13px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="absolute left-0 right-0 bg-indigo-500/15 border-l-4 border-indigo-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${(cur.line * 19.6) + 24 - 19.6}px`, height: '19.6px' }} />
                    {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} />
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 font-mono">
                <div className="flex items-center gap-2 text-indigo-600">
                    <Info size={18} />
                    <h4 className="text-sm font-black uppercase tracking-widest font-mono">Logic Insight</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">{APPROACHES[selectedApproach].explanation}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-indigo-600 uppercase block pl-1 tracking-widest font-mono">Jump Array (nums)</label>
                    <input value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" placeholder="2,3,0,1,4" />
                </div>
                <div className="flex gap-3">
                  <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <ChevronLeft size={16}/> Prev
                  </button>
                  <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                    Next Step <ChevronRight size={16}/>
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-3xl p-7 shadow-2xl border border-slate-800 min-h-[160px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    <Compass size={100}/>
                </div>
                <div className="flex items-center gap-2 mb-3">
                   <Target size={14} className="text-indigo-400"/>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono tracking-tighter">Execution Detail</span>
                </div>
                <div className="text-lg font-black tracking-tight mb-2 uppercase font-mono flex items-center gap-3">
                    {error && <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[10px] animate-pulse">UNREACHABLE</span>}
                    {match && <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] animate-pulse">WAYPOINT FOUND</span>}
                    {cur.phase}
                </div>
                <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono">{cur.description}</p>
              </div>

              {/* Simulation Arena */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[500px] relative flex flex-col justify-between overflow-hidden shadow-inner transition-all duration-500">
                
                {/* State Variables Dashboard */}
                {!finished && (
                  <div className="w-full grid grid-cols-2 gap-4 z-10 mb-8 font-mono">
                     <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex flex-col items-center justify-center shadow-sm relative overflow-hidden group">
                        <span className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">
                            {selectedApproach === 'greedy' ? 'Reachable Limit' : 'Last Good Pos'}
                        </span>
                        <div className="text-4xl font-black text-indigo-600">
                            {selectedApproach === 'greedy' ? curReachable : lastGoodPos}
                        </div>
                     </div>
                     <div className="bg-indigo-50/50 rounded-3xl p-5 border border-indigo-100 flex flex-col items-center justify-center shadow-sm">
                        <span className="text-[9px] font-black text-indigo-400 uppercase mb-1 tracking-widest">Active Search</span>
                        <div className="text-3xl font-black text-slate-800">
                           {activeI === -1 ? '-' : `Index ${activeI}`}
                        </div>
                     </div>
                  </div>
                )}

                {/* Grid Visual Representation */}
                <div className="flex-1 flex flex-wrap items-center justify-center gap-2 p-4">
                    {nums.map((val, idx) => {
                        const isActive = activeI === idx;
                        const isGoal = idx === nums.length - 1;
                        
                        // Greedy specific styles
                        const isReachable = selectedApproach === 'greedy' && idx <= curReachable;
                        const isBeyondReachable = selectedApproach === 'greedy' && idx > curReachable;
                        const isPotentialEnd = selectedApproach === 'greedy' && idx === potential;
                        
                        // Backward specific styles
                        const isGoodPos = selectedApproach === 'backward' && idx === lastGoodPos;
                        const canReachFromHere = selectedApproach === 'backward' && isActive && (idx + val >= lastGoodPos);

                        let theme = "bg-white border-slate-100 text-slate-200";
                        if (isActive) {
                           theme = "bg-indigo-600 border-indigo-700 text-white scale-110 shadow-lg z-20";
                           if (error) theme = "bg-rose-500 border-rose-600 text-white scale-110 shadow-lg animate-pulse";
                        } else if (selectedApproach === 'greedy') {
                            if (isReachable) theme = "bg-emerald-50 border-emerald-200 text-emerald-600";
                            if (isBeyondReachable) theme = "bg-slate-50 border-slate-200 text-slate-300 opacity-50";
                            if (isPotentialEnd && !finished) theme = "bg-amber-50 border-amber-300 text-amber-600 ring-2 ring-amber-100 ring-offset-2 scale-105";
                        } else if (selectedApproach === 'backward') {
                            if (isGoodPos) theme = "bg-emerald-600 border-emerald-700 text-white shadow-md z-10 scale-105";
                        }

                        return (
                            <div key={idx} className="flex flex-col items-center group relative">
                                <div className={`w-14 h-16 border-2 rounded-xl flex items-center justify-center font-mono font-black text-xl transition-all duration-300 ${theme}`}>
                                    {val}
                                    {isActive && !finished && (
                                        <div className="absolute -top-8 text-indigo-500 animate-bounce">
                                            <MousePointer2 size={20} className="rotate-[-45deg]"/>
                                        </div>
                                    )}
                                    {isGoal && !finished && !isActive && !isGoodPos && (
                                        <div className="absolute -right-1 -top-1">
                                            <Flag size={12} className="text-slate-400 fill-slate-400"/>
                                        </div>
                                    )}
                                </div>
                                <span className="text-[10px] font-black text-slate-300 mt-2 font-mono">{idx}</span>
                                
                                {/* Jump Visualization in Greedy */}
                                {selectedApproach === 'greedy' && isActive && !finished && val > 0 && (
                                    <div className="absolute top-1/2 left-full w-[200%] h-px bg-indigo-500/20 border-t-2 border-dashed border-indigo-400 z-0 pointer-events-none origin-left transform -rotate-12 translate-x-4">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                                            <Target size={12} className="text-indigo-400"/>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Final State Banner */}
                {finished && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-indigo-600/5 backdrop-blur-[4px] animate-in fade-in duration-1000">
                    <div className="bg-white border-2 border-indigo-100 px-12 py-10 rounded-[3.5rem] shadow-2xl flex flex-col items-center gap-6 transform -rotate-1 hover:rotate-0 transition-transform">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl mb-2 ${success ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
                          {success ? <Check size={48} strokeWidth={3}/> : <X size={48} strokeWidth={3}/>}
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] block mb-2 font-mono">Final Decision</span>
                        <div className={`text-6xl font-black tracking-tighter tabular-nums drop-shadow-sm font-mono ${success ? 'text-green-600' : 'text-rose-600'}`}>
                           {success ? 'SUCCESS' : 'FAILED'}
                        </div>
                        <div className={`mt-6 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest font-mono ${success ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-700'}`}>
                           {success ? 'Last index reached' : 'No valid path found'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'learn' && (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-10 font-mono">
            <div className="max-w-4xl space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 leading-tight">
                <BookOpen className="text-indigo-600"/> The Greedy Choice Principle
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-indigo-100 pl-6">
                Jump Game is a classic optimization problem. While it can be solved with Recursion (O(2^N)) or Dynamic Programming (O(N^2)), the Greedy approach allows us to solve it in linear time by making the local best choice at every step.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-indigo-900 flex items-center gap-2 uppercase tracking-tighter text-sm"><TrendingUp size={18}/> Optimal Substructure</h3>
                        <p className="text-sm text-indigo-800 leading-relaxed italic border-l-2 border-indigo-200 pl-4">
                          "Can I reach point B if I can reach point A?"
                        </p>
                        <p className="text-xs text-indigo-700 leading-relaxed">
                          The problem has optimal substructure: to reach index <code>i</code>, we must have been able to reach some index <code>{'j < i '}</code> such that <code>j + nums[j] >= i</code>.
                        </p>
                    </div>
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm"><Compass size={18}/> Horizon Tracking</h3>
                        <p className="text-sm text-amber-700 leading-relaxed">
                          Instead of exploring every jump path, we simply track our "furthest reachable horizon". As we walk towards the horizon, we look for any position that can push that horizon even further. If we reach our horizon and haven't found the end, we're stuck.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Timer size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <BarChart3 size={32} className="text-indigo-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Efficiency Benchmark</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                      <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700 backdrop-blur-sm">
                          <span className="text-[10px] text-slate-500 block mb-1 uppercase font-black font-mono">Dynamic Prog</span>
                          <div className="font-mono text-2xl font-black text-indigo-400">O(N^2)</div>
                          <p className="text-[9px] text-slate-500 mt-2 font-mono tracking-tighter">Checking all reachability</p>
                      </div>
                      <div className="p-5 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-500/20">
                          <span className="text-[10px] text-indigo-200 block mb-1 uppercase font-black font-mono">Greedy</span>
                          <div className="font-mono text-2xl font-black">O(N)</div>
                          <p className="text-[9px] text-indigo-200 mt-2 font-mono tracking-tighter">Single Linear Pass</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed italic relative z-10">
                      "By reducing the problem to a horizon check, we avoid building a dependency table, saving both Time and Memory."
                    </p>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500 font-mono">
            <div className="space-y-6">
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                        <Trophy size={140} />
                    </div>
                    <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-amber-400 relative z-10 uppercase tracking-tight">
                        <Trophy size={24} /> Senior Interview Defense
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                        "For the Jump Game, I implemented a greedy one-pass solution that achieves the theoretical lower bound of O(N) runtime and O(1) auxiliary space. While a top-down dynamic programming approach with memoization would work, it introduces O(N) space complexity for the recursion stack and state table. By maintaining a single 'reachable' pointer that tracks the furthest possible horizon, we effectively solve the problem by verifying the integrity of the reachable path without redundant subproblem calculations. This is both memory-frugal and highly performant for streaming data."
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter font-black tracking-tight">
                        <MessageSquare className="text-indigo-500" size={20} /> Candidate Q&A
                    </h3>
                    <div className="space-y-4">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter">"What if you need the shortest number of jumps?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                "That is Jump Game II. In that case, we still use Greedy but with a BFS-like logic: we track the furthest point reachable in the *current* jump range and increment our 'jumps' counter whenever we cross the current boundary. The complexity remains O(N)."
                            </p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter">"Is there any case where Greedy fails here?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                "Greedy works here because the jump lengths are 'inclusive' (you can jump *any* length up to nums[i]). If jump lengths were exact or had costs, we would need to revert to Dynamic Programming or Dijkstra's Algorithm."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-[2rem] p-8 shadow-sm">
                    <h3 className="text-lg font-black text-indigo-900 mb-6 uppercase tracking-widest flex items-center gap-2 font-black">
                        <AlertCircle size={20}/> Leadership Focus
                    </h3>
                    <ul className="space-y-8">
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">1</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight">Invent and Simplify</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1">Mention the 'Backward' approach as an alternative simple strategy. It trades index-tracking for a simpler waypoint logic, showing you can think from multiple perspectives.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">2</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight">Frugality</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1">Always frame the move from DP/Recursion to Greedy as an obsession with reducing compute resource consumption and improving responsiveness for the end customer.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                    <Search className="text-slate-400 mb-3" size={48} />
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest text-center mb-6 font-mono tracking-tighter font-black">Memory Analysis</p>
                    <div className="space-y-4 w-full">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase">Recursion/DP Space</span>
                                <span className="text-rose-500 font-black">O(N) - Scalability Risk</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-400 w-full" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase">Greedy Space</span>
                                <span className="text-indigo-500 font-black font-mono">O(1) - Constant</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-[1%]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|Math|max|length)\b|\b\d+\b)/g).filter(Boolean);
  return (
    <div className={`flex relative z-10 min-h-[19.6px] transition-colors duration-300 ${active ? 'bg-indigo-500/10 font-bold' : ''}`}>
      <span className="w-10 text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 font-mono text-[11px] select-none shrink-0">{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean', 'void'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['String'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['Math', 'max', 'length'].includes(part)) return <span key={i} className="text-blue-400">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-rose-400 font-bold">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default JumpGameVisualizer;
