
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
  BrainCircuit,
  Timer,
  Network,
  Binary,
  Footprints,
  // Removed non-existent 'Stairs' icon import
  Search,
  MousePointer2
} from 'lucide-react';

const APPROACHES = {
  spaceOptimized: {
    id: 'spaceOptimized',
    title: '1. Space Optimized',
    subtitle: 'Optimal O(1) Space',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) {
            return n;
        }
        int first = 1;
        int second = 2;
        for (int i = 3; i <= n; i++) {
            int third = first + second;
            first = second;
            second = third;
        }
        return second;
    }
}`,
    explanation: "This approach uses the Fibonacci relationship: to reach step 'i', you can only come from 'i-1' or 'i-2'. By keeping only the last two values, we achieve constant space complexity."
  },
  dp: {
    id: 'dp',
    title: '2. Dynamic Prog',
    subtitle: 'Tabulation O(N)',
    icon: <Database size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public int climbStairs(int n) {
        if (n == 1) return 1;
        int[] dp = new int[n + 1];
        dp[1] = 1;
        dp[2] = 2;
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }
}`,
    explanation: "Bottom-up tabulation. We create an array to store the result of every subproblem (how many ways to reach each step). This provides a clear linear progression."
  }
};

const ClimbingStairsVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproach, setSelectedApproach] = useState<keyof typeof APPROACHES>('spaceOptimized');
  const [nInput, setNInput] = useState(5);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const n = useMemo(() => Math.min(Math.max(1, parseInt(nInput.toString()) || 1), 45), [nInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ 
        phase, 
        description: desc, 
        line, 
        state: { 
          n,
          i: -1,
          first: null,
          second: null,
          third: null,
          dp: null,
          ...state 
        } 
      });
    };

    if (selectedApproach === 'spaceOptimized') {
      addStep("Condition Check", `Checking if n (${n}) <= 2.`, 3, {});
      if (n <= 2) {
        addStep("Inside If", `The condition is true. Moving into the return block.`, 3, {});
        addStep("Base Return", `Returning n (${n}) immediately as it is a base case.`, 4, { finished: true, result: n });
      } else {
        addStep("Skipping If", `The condition is false (n > 2). Continuing to initialization.`, 3, {});
        let first = 1;
        addStep("Initialization", `Set ways to reach step 1: first = ${first}.`, 6, { first });
        let second = 2;
        addStep("Initialization", `Set ways to reach step 2: second = ${second}.`, 7, { first, second });

        for (let i = 3; i <= n; i++) {
          addStep("Loop Header", `Checking i (${i}) <= n (${n}).`, 8, { i, first, second });
          let third = first + second;
          addStep("Calculate", `dp[${i}] = dp[${i-1}] (${second}) + dp[${i-2}] (${first}) = ${third}.`, 9, { i, first, second, third });
          
          first = second;
          addStep("Shift Pointers", `Updating 'first' to ${second}.`, 10, { i, first, second, third });
          
          second = third;
          addStep("Shift Pointers", `Updating 'second' to ${third}.`, 11, { i, first, second, third });
        }
        addStep("Return", `Loop finished. Returning 'second' (${second}) as final answer.`, 13, { first, second, finished: true, result: second });
      }
    } else {
      // DP Tabulation
      addStep("Condition Check", `Checking if n (${n}) == 1.`, 3, {});
      if (n === 1) {
        addStep("Inside If", `n is 1. Entering return block.`, 3, {});
        addStep("Base Return", "Returning 1 immediately.", 3, { finished: true, result: 1 });
      } else {
        addStep("Skipping If", "n > 1. Proceeding to array allocation.", 3, {});
        const dpTable = new Array(n + 1).fill(0);
        addStep("Allocation", `Allocating dp[] array of size ${n + 1}.`, 4, { dp: [...dpTable] });
        
        dpTable[1] = 1;
        addStep("Base Entry", "Setting base case: dp[1] = 1.", 5, { dp: [...dpTable] });
        
        dpTable[2] = 2;
        addStep("Base Entry", "Setting base case: dp[2] = 2.", 6, { dp: [...dpTable] });

        for (let i = 3; i <= n; i++) {
          addStep("Loop Header", `Processing subproblem for step i = ${i}.`, 7, { i, dp: [...dpTable] });
          dpTable[i] = dpTable[i - 1] + dpTable[i - 2];
          addStep("Summation", `dp[${i}] = dp[${i-1}] (${dpTable[i-1]}) + dp[${i-2}] (${dpTable[i-2]}) = ${dpTable[i]}.`, 8, { i, dp: [...dpTable], computed: i });
        }
        addStep("Return", `Returning final result from dp[${n}]: ${dpTable[n]}.`, 10, { dp: [...dpTable], finished: true, result: dpTable[n] });
      }
    }

    return steps;
  }, [n, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(APPROACHES[selectedApproach].code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0];
  const { i: activeI, first, second, third, dp, finished, result, computed } = cur.state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center">
                {/* Replaced non-existent 'Stairs' icon usage with 'Footprints' */}
                <Footprints className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Climbing Stairs</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-2 font-mono">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded tracking-tighter uppercase font-black tracking-widest">Dynamic Programming</span>
                <span>LC 70 • Easy</span>
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
                <h2 className="text-3xl font-black text-slate-900 mb-6 font-mono tracking-tighter text-indigo-600 underline decoration-indigo-100 decoration-8 underline-offset-4">70. Climbing Stairs</h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-lg leading-relaxed font-mono">
                  <p>You are climbing a staircase. It takes <code>n</code> steps to reach the top.</p>
                  <p>Each time you can either climb <strong>1</strong> or <strong>2</strong> steps. In how many distinct ways can you climb to the top?</p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 font-mono">
                  <Hash size={16}/> Examples:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 font-mono text-sm shadow-inner space-y-3">
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Input:</span> n = 2</p>
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Output:</span> 2</p>
                    <p className="text-[10px] text-slate-400 italic leading-relaxed border-t pt-2">
                        Explanation: There are two ways to climb to the top.<br/>
                        1. 1 step + 1 step<br/>
                        2. 2 steps
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 font-mono text-sm shadow-inner space-y-3">
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Input:</span> n = 3</p>
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Output:</span> 3</p>
                    <p className="text-[10px] text-slate-400 italic leading-relaxed border-t pt-2">
                        Explanation: There are three ways to climb to the top.<br/>
                        1. 1 step + 1 step + 1 step<br/>
                        2. 1 step + 2 steps<br/>
                        3. 2 steps + 1 step
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <AlertCircle size={14} /> Constraints:
                </h3>
                <ul className="list-disc list-inside space-y-3 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <li><code className="bg-slate-100 px-1.5 rounded text-slate-800 font-bold">1 {'<='} n {'<='} 45</code></li>
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
                    <span className="font-bold uppercase tracking-tight text-white">ClimbStairs.java</span>
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
                    <h4 className="text-sm font-black uppercase tracking-widest">Execution Logic</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">{APPROACHES[selectedApproach].explanation}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-indigo-600 uppercase block pl-1 tracking-widest font-mono">Input: Stairs Count (n)</label>
                    <input type="number" min="1" max="45" value={nInput} onChange={(e) => { setNInput(parseInt(e.target.value) || 1); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
                </div>
                <div className="flex gap-3">
                  <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <ChevronLeft size={16}/> Prev
                  </button>
                  <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                    Next Action <ChevronRight size={16}/>
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-3xl p-7 shadow-2xl border border-slate-800 min-h-[160px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    <BrainCircuit size={100}/>
                </div>
                <div className="flex items-center gap-2 mb-3">
                   <Target size={14} className="text-blue-400"/>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono tracking-tighter">Execution Details</span>
                </div>
                <div className="text-lg font-black tracking-tight mb-2 uppercase font-mono">
                    {cur.phase}
                </div>
                <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono">{cur.description}</p>
              </div>

              {/* Simulation Arena */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[500px] relative flex flex-col justify-between overflow-hidden shadow-inner transition-all duration-500">
                
                {/* State Tracker */}
                {!finished && (
                  <div className="w-full grid grid-cols-2 gap-4 z-10 mb-8 font-mono">
                     <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex flex-col items-center justify-center shadow-sm relative overflow-hidden group">
                        <span className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Active Variable</span>
                        <div className="text-3xl font-black text-indigo-600">
                            {selectedApproach === 'spaceOptimized' ? (third !== null ? `third: ${third}` : '---') : (activeI !== -1 ? `dp[${activeI}]` : '---')}
                        </div>
                     </div>
                     <div className="bg-indigo-50/50 rounded-3xl p-5 border border-indigo-100 flex flex-col items-center justify-center shadow-sm">
                        <span className="text-[9px] font-black text-indigo-400 uppercase mb-1 tracking-widest">Memory Context</span>
                        <div className="text-xs font-black text-slate-800 text-center">
                            {selectedApproach === 'spaceOptimized' ? (first !== null ? `f:${first}, s:${second}` : '---') : (activeI >= 2 ? `dp[${activeI-1}]:${dp[activeI-1]}, dp[${activeI-2}]:${dp[activeI-2]}` : '---')}
                        </div>
                     </div>
                  </div>
                )}

                {/* Visual Representation */}
                <div className="flex-1 flex flex-col items-center justify-center w-full px-4 overflow-hidden relative">
                    <div className="flex items-end h-64 gap-1.5 w-full justify-center">
                        {Array.from({ length: n + 1 }).map((_, idx) => {
                            const isGoal = idx === n;
                            const isActive = activeI === idx;
                            const isProcessed = selectedApproach === 'dp' ? (dp?.[idx] > 0) : (idx < activeI);
                            const isWindow = selectedApproach === 'spaceOptimized' && (idx === activeI - 1 || idx === activeI - 2);
                            const isDependency = selectedApproach === 'dp' && (idx === activeI - 1 || idx === activeI - 2);

                            let height = (idx / n) * 100;
                            let theme = "bg-slate-50 border-slate-100 text-slate-200";
                            
                            if (isActive) { theme = "bg-indigo-600 border-indigo-700 text-white scale-110 shadow-lg z-20"; }
                            else if (isDependency || isWindow) { theme = "bg-blue-100 border-blue-400 text-blue-700"; }
                            else if (isGoal) { theme = "bg-amber-50 border-amber-200 text-amber-500 font-bold"; }
                            else if (isProcessed) { theme = "bg-indigo-50 border-indigo-100 text-indigo-300"; }

                            return (
                                <div key={idx} className="flex-1 flex flex-col justify-end relative transition-all duration-500" style={{ height: '100%' }}>
                                    <div className={`w-full border-t-2 border-x rounded-t-lg transition-all duration-500 flex items-center justify-center font-mono font-black text-[10px] ${theme}`} style={{ height: `${height + 10}%` }}>
                                        {idx}
                                        {isActive && !finished && (
                                            <div className="absolute -top-10 text-indigo-500 animate-bounce">
                                                <Footprints size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div className={`text-[8px] font-black text-center mt-2 font-mono h-3 transition-colors duration-300 ${isProcessed ? 'text-indigo-400' : 'text-transparent'}`}>
                                        {selectedApproach === 'dp' && dp?.[idx] > 0 ? dp[idx] : (selectedApproach === 'spaceOptimized' && idx < activeI ? 'Checked' : '')}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Final State Banner */}
                {finished && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-indigo-600/5 backdrop-blur-[4px] animate-in fade-in duration-1000">
                    <div className="bg-white border-2 border-indigo-100 px-12 py-10 rounded-[3.5rem] shadow-2xl flex flex-col items-center gap-6 transform -rotate-1 hover:rotate-0 transition-transform">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-xl mb-2">
                          <Check size={48} strokeWidth={3}/>
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] block mb-2 font-mono">Distinct Ways to Top</span>
                        <div className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums drop-shadow-sm font-mono italic underline decoration-blue-200 decoration-8 underline-offset-8">
                           {result}
                        </div>
                        <div className="mt-8 px-6 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest font-mono shadow-sm">
                           O(N) Calculation Verified
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
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <BookOpen className="text-indigo-600"/> The Logic of Dynamic Programming
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-indigo-100 pl-6">
                Climbing Stairs is the "Hello World" of Dynamic Programming. It demonstrates how to transform exponential complexity (recursion) into linear performance (DP).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-indigo-900 flex items-center gap-2 uppercase tracking-tighter text-sm"><Layers size={18}/> Optimal Substructure</h3>
                        <p className="text-sm text-indigo-800 leading-relaxed italic border-l-2 border-indigo-200 pl-4">
                          "The solution to a complex problem is the sum of its smaller parts."
                        </p>
                        <p className="text-xs text-indigo-700 leading-relaxed">
                          To reach step <code>i</code>, your final jump was either 1 step (from <code>i-1</code>) or 2 steps (from <code>i-2</code>). Thus, the total ways to reach <code>i</code> is simply <code>ways(i-1) + ways(i-2)</code>. This matches the Fibonacci sequence perfectly.
                        </p>
                    </div>
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm"><BrainCircuit size={18}/> Overlapping Subproblems</h3>
                        <p className="text-sm text-amber-700 leading-relaxed">
                          In naive recursion, <code>climb(3)</code> is recalculated many times while solving for <code>climb(5)</code>. DP avoids this by solving each subproblem exactly <strong>once</strong> and caching the result for instant lookup.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Timer size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <BarChart3 size={32} className="text-indigo-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Asymptotic Gains</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                      <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700 backdrop-blur-sm">
                          <span className="text-[10px] text-slate-500 block mb-1 uppercase font-black font-mono">Recursion</span>
                          <div className="font-mono text-2xl font-black text-indigo-400">O(2^N)</div>
                          <p className="text-[9px] text-slate-500 mt-2">Exponential - Crashing</p>
                      </div>
                      <div className="p-5 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-500/20">
                          <span className="text-[10px] text-indigo-200 block mb-1 uppercase font-black font-mono">DP Iterative</span>
                          <div className="font-mono text-2xl font-black">O(N)</div>
                          <p className="text-[9px] text-indigo-200 mt-2">Linear - Professional</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed italic relative z-10">
                      "With n=45, recursion takes billions of operations. DP takes exactly 45. This leap in efficiency is the fundamental skill required for senior engineering roles."
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
                        "The Climbing Stairs problem represents the fundamental property of state transitions. I implemented a space-optimized DP approach that achieves the theoretical optimal O(N) runtime while preserving memory with O(1) auxiliary space. By recognizing that the state at step 'n' only depends on 'n-1' and 'n-2', we eliminate the need for an O(N) array entirely. This ensures high throughput and low memory pressure, critical for large-scale microservices or mobile clients with strict resource constraints."
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter font-black tracking-tight">
                        <MessageSquare className="text-indigo-500" size={20} /> Candidate Q&A
                    </h3>
                    <div className="space-y-4">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter">"Why not use recursion with memoization?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                "While top-down memoization is O(N), it still consumes O(N) stack space. Iterative bottom-up DP is generally preferred in production because it avoids stack overflow risks on very large inputs and allows for easy O(1) space optimization."
                            </p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter">"What if you can jump up to K steps?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                "The recurrence expands to <code>ways[i] = Σ ways[i-j]</code> for <code>j</code> from 1 to K. We could solve this in O(N*K) using DP, or further optimize using a sliding window sum to reach O(N)."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-[2rem] p-8 shadow-sm">
                    <h3 className="text-lg font-black text-indigo-900 mb-6 uppercase tracking-widest flex items-center gap-2 font-black">
                        <AlertCircle size={20}/> Leadership Principles
                    </h3>
                    <ul className="space-y-8">
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">1</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight">Frugality</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1">Choosing the O(1) space variant demonstrates an obsession with resource preservation, directly reducing operating costs at scale.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">2</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight">Dive Deep</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1 font-mono">Understand that for massive n, this can be solved in O(log N) using Matrix Exponentiation. This shows deep mathematical grounding.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                    <Binary className="text-slate-400 mb-3" size={48} />
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest text-center mb-6 font-mono tracking-tighter font-black">Bottleneck Analysis</p>
                    <div className="space-y-4 w-full">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase">Optimal Time</span>
                                <span className="text-indigo-500 font-black font-mono">O(N) - Perfect Linear</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-400 w-full" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase">Optimal Space</span>
                                <span className="text-indigo-500 font-black font-mono">O(1) - Minimal Footprint</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-50 w-[1%]" />
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
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

export default ClimbingStairsVisualizer;
