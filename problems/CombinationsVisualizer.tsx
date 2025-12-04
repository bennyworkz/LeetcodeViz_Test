import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, Calculator, ListOrdered, 
  ArrowRight, Hash, XSquare, Shuffle, FastForward, Blocks, CheckSquare,
  Search, Info
} from 'lucide-react';

const APPROACHES = {
  backtracking: {
    id: 'backtracking',
    title: 'Backtracking (DFS)',
    subtitle: 'Standard: O(k * C(n,k)) Time, O(k) Space.',
    icon: <Activity size={16} />,
    complexity: 'Time: O(k * C(n,k)) | Space: O(k)', 
    code: `class Solution {
    public List<List<Integer>> combine(int n, int k) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(1, new ArrayList<>(), n, k, res);
        return res;
    }
    
    private void backtrack(int start, List<Integer> current, int n, int k, List<List<Integer>> res) {
        // Base case: if current combination is of length k
        if (current.size() == k) {
            res.add(new ArrayList<>(current));
            return;
        }
        
        // Explore choices from 'start' up to 'n'
        for (int i = start; i <= n; i++) {
            // 1. Choose
            current.add(i);
            
            // 2. Explore (recurse with next start index)
            backtrack(i + 1, current, n, k, res);
            
            // 3. Un-choose (backtrack)
            current.remove(current.size() - 1);
        }
    }
}`,
    explanation: "We use backtracking to explore all possible combinations. We maintain a `current` list representing our path. We iterate through possible numbers starting from `start` up to `n`. For each number, we add it to our path, recursively call `backtrack` to find the remaining numbers (starting from `i + 1` to avoid permutations and duplicates), and then remove the number from our path (backtrack) to explore the next sibling branch. Once our path reaches length `k`, we add a copy of it to our results."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">77. Combinations</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given two integers <code>n</code> and <code>k</code>, return <em>all possible combinations of</em> <code>k</code> <em>numbers chosen from the range</em> <code>[1, n]</code>.
        </p>

        <p className="text-lg leading-relaxed">
          You may return the answer in <strong>any order</strong>.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> n = 4, k = 2</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]</p>
              <p className="text-slate-500 text-xs mt-2 font-sans border-t border-slate-200 pt-2">
                <strong>Explanation:</strong> There are 4 choose 2 = 6 total combinations.<br/> Note that combinations are unordered, i.e., [1,2] and [2,1] are considered to be the same combination.
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> n = 1, k = 1</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[1]]</p>
              <p className="text-slate-500 text-xs mt-2 font-sans border-t border-slate-200 pt-2">
                <strong>Explanation:</strong> There is 1 choose 1 = 1 total combination.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= n &lt;= 20</code></li>
              <li><code>1 &lt;= k &lt;= n</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const CombinationsVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('backtracking');
  
  const [nInput, setNInput] = useState('4');
  const [kInput, setKInput] = useState('2');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let n = parseInt(nInput, 10);
    let k = parseInt(kInput, 10);
    
    if (isNaN(n) || n < 1) n = 4;
    // Cap n at 6 for visualization sanity (otherwise trace is too huge)
    if (n > 6) n = 6; 
    
    if (isNaN(k) || k < 1) k = 2;
    if (k > n) k = n;

    return { n, k };
  }, [nInput, kInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { n, k } = parsedData;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2500) return; 
      // Deep copy to preserve exact state
      steps.push({ 
          phase, 
          description: desc, 
          line, 
          state: { 
              ...vars, 
              current: [...(vars.current || [])], 
              res: vars.res ? vars.res.map(arr => [...arr]) : [] 
          } 
      });
    };

    let res = [];
    
    addStep("Initialization", `Line 3-5: Initialize the result array and start the backtracking process.\n\nn = ${n}, k = ${k}`, 4, { n, k, res, current: [], start: 1, action: 'init' });

    const backtrack = (start, current) => {
        if (steps.length > 2500) return;

        addStep(`Check Base Case`, `Line 9-10: Checking if the current path size (${current.length}) equals k (${k}).`, 9, { n, k, res, current, start, action: 'check' });
        
        if (current.length === k) {
            res.push([...current]);
            addStep(`Valid Combination Found!`, `Line 10-11: current.size() == k.\nAdded [${current.join(', ')}] to results.\nReturning to previous state.`, 10, { n, k, res, current, start, action: 'match' });
            return;
        }

        addStep(`Loop Setup`, `Line 14: Setting up loop from i = ${start} to ${n}.`, 14, { n, k, res, current, start, action: 'explore' });

        for (let i = start; i <= n; i++) {
            if (steps.length > 2500) break;
            
            current.push(i);
            addStep(`Choose`, `Line 16: current.add(${i})\n\nAdding ${i} to our current path. Moving deeper.`, 16, { n, k, res, current, start, i, action: 'choose' });
            
            addStep(`Recurse`, `Line 19: backtrack(i + 1, current...)\n\nCalling backtrack with start = ${i + 1}.`, 19, { n, k, res, current, start, i, action: 'recurse' });
            backtrack(i + 1, current);
            
            if (steps.length > 2500) break;

            current.pop();
            addStep(`Un-Choose (Backtrack)`, `Line 22: current.remove(last)\n\nRemoving ${i} from path to explore other branches.`, 22, { n, k, res, current, start, i, action: 'backtrack' });
        }
        
        addStep(`End of Loop / Return`, `Loop finished for start = ${start}. Implicitly returning back up the call tree.`, 24, { n, k, res, current, start, action: 'return' });
    };

    backtrack(1, []);

    addStep("Algorithm Complete", `Line 5: return res;\n\nBacktracking finished. Found ${res.length} valid combinations.`, 5, { n, k, res, current: [], start: '-', action: 'success', isSuccess: true });

    if (steps.length === 0) {
        addStep("Init", "Start", 1, {});
    }

    return steps;
  }, [parsedData]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedApproach.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0] || { state: {} };
  const state = cur.state || {};
  const { isSuccess, action, n, k, res, current, start, i } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center">
                <Blocks className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Combinations</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 77</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Backtracking / DFS</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
            <TabButton active={activeTab === 'problem'} onClick={() => setActiveTab('problem')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<BookOpen size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'problem' && <ProblemStatement />}

        {activeTab === 'visualizer' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Col: Code & Context (5/12) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                
                {/* Approach Selector */}
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(APPROACHES).map((app) => {
                        const isSelected = selectedApproachId === app.id;
                        const [time, space] = app.complexity.split(' | ');
                        return (
                            <button 
                               key={app.id}
                               onClick={() => { setSelectedApproachId(app.id); setCurrentStep(0); }}
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                                    <span>{time}</span>
                                    <span>{space}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Code Window */}
                <div className="bg-[#0f172a] rounded-3xl h-[460px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={14} className="text-indigo-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess || action === 'match' ? 'bg-emerald-500/20 border-emerald-500' : (action === 'backtrack' || action === 'return' ? 'bg-rose-500/20 border-rose-500' : (action === 'choose' ? 'bg-amber-500/20 border-amber-500' : 'bg-indigo-500/20 border-indigo-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'backtrack' || action === 'return' ? 'rose' : (action === 'match' ? 'emerald' : (action === 'choose' ? 'amber' : 'indigo'))} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-indigo-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Backtracking State</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="Start Idx" val={start !== null && start !== undefined ? start : "-"} color="purple" active={start !== null && start !== undefined} />
                        <VariableCard label="Choice (i)" val={i !== null && i !== undefined ? i : "-"} color="amber" active={i !== null && i !== undefined} />
                        <VariableCard label="Path Size" val={current ? current.length : "-"} color="sky" active={current !== null && current !== undefined} />
                        <VariableCard label="Found" val={res ? res.length : "-"} color="emerald" active={res !== undefined && res.length > 0} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-indigo-600 uppercase block pl-1 tracking-widest font-mono">Pool Size (n)</label>
                        <input type="number" min="1" max="6" value={nInput} onChange={(e) => { setNInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner tracking-widest font-bold text-slate-700" placeholder="4" />
                        <p className="text-[9px] text-slate-400 pl-1">Max 6 (Visualization limit)</p>
                    </div>
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-indigo-600 uppercase block pl-1 tracking-widest font-mono">Pick Size (k)</label>
                        <input type="number" min="1" max={nInput} value={kInput} onChange={(e) => { setKInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner tracking-widest font-bold text-slate-700" placeholder="2" />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto pb-5">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess || action === 'match' ? 'bg-emerald-900 border-emerald-800' : (action === 'backtrack' || action === 'return' ? 'bg-rose-900 border-rose-800' : (action === 'choose' ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess || action === 'match' ? <Check size={100}/> : (action === 'backtrack' ? <Shuffle size={100}/> : (action === 'choose' ? <Target size={100}/> : <Blocks size={100}/>))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess || action === 'match' ? "text-emerald-400" : (action === 'backtrack' || action === 'return' ? 'text-rose-400' : (action === 'choose' ? 'text-amber-400' : 'text-slate-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess || action === 'match' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'backtrack' || action === 'return' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30')}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-3 uppercase font-mono text-white flex items-center gap-3 relative z-10">
                      {cur.phase}
                  </div>
                  <div className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 font-mono whitespace-pre-line overflow-y-auto max-h-[140px] scrollbar-thin relative z-10">
                      {cur.description}
                  </div>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-center justify-start pt-10">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pb-8 gap-8 overflow-y-auto overflow-x-hidden">
                      
                      {/* Top: Current Path Builder */}
                      <div className="w-full flex flex-col items-center border-b border-slate-200 pb-8 relative">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-4 flex items-center gap-2"><Target size={14}/> Current Path (List)</span>
                          
                          <div className="flex items-center bg-slate-900 border-4 border-slate-800 p-3 rounded-2xl shadow-xl min-w-[200px] h-20 justify-center">
                              {/* Display k slots */}
                              {Array.from({length: k || 1}).map((_, idx) => {
                                  let val = current && current.length > idx ? current[idx] : undefined;
                                  let isNew = action === 'choose' && idx === current.length - 1;
                                  let isRemoved = action === 'backtrack' && idx === current.length; // The one that just got popped

                                  let boxClass = "w-10 h-12 md:w-12 md:h-14 flex items-center justify-center font-mono font-black text-2xl mx-1 transition-all duration-500 border-b-4 ";
                                  
                                  if (val !== undefined) {
                                      if (isNew) {
                                          boxClass += "text-amber-400 border-amber-500 animate-in zoom-in slide-in-from-top-4";
                                      } else if (action === 'match') {
                                          boxClass += "text-emerald-400 border-emerald-500 animate-pulse";
                                      } else {
                                          boxClass += "text-white border-slate-500";
                                      }
                                  } else if (isRemoved) {
                                      boxClass += "text-rose-500 border-rose-800 animate-out zoom-out slide-out-to-top-4 opacity-0 absolute pointer-events-none";
                                  } else {
                                      boxClass += "border-slate-700 text-transparent";
                                  }

                                  return (
                                      <div key={`path-slot-${idx}`} className={boxClass}>
                                          {val || '-'}
                                      </div>
                                  )
                              })}
                          </div>
                          
                          <div className="text-xs font-mono font-bold text-slate-400 mt-3">
                              Size: {current ? current.length : 0} / {k}
                          </div>
                      </div>

                      {/* Middle: Available Numbers Array */}
                      {n !== undefined && (
                          <div className="w-full flex flex-col items-center">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-4 flex items-center gap-2"><ListOrdered size={14}/> Number Pool [1...{n}]</span>
                              
                              <div className="flex gap-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner min-w-max mx-auto overflow-x-auto items-center">
                                  {Array.from({length: n}).map((_, idx) => {
                                      const num = idx + 1;
                                      
                                      let isExcluded = num < start;
                                      let isInPath = current && current.includes(num);
                                      let isCurrentI = num === i && (action === 'choose' || action === 'explore' || action === 'backtrack');

                                      let boxClass = "relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl border-4 font-mono font-black text-xl transition-all duration-300 shrink-0 ";
                                      let textClass = "text-slate-700";

                                      if (isInPath) {
                                          boxClass += "bg-indigo-100 border-indigo-500 shadow-md scale-105 z-10";
                                          textClass = "text-indigo-900";
                                      } else if (isCurrentI) {
                                          boxClass += action === 'backtrack' ? "bg-rose-100 border-rose-500 scale-110 shadow-lg ring-4 ring-rose-300/30 z-20" : "bg-amber-100 border-amber-500 scale-110 shadow-lg ring-4 ring-amber-300/30 z-20";
                                          textClass = action === 'backtrack' ? "text-rose-900" : "text-amber-900";
                                      } else if (isExcluded) {
                                          boxClass += "bg-slate-200 border-slate-300 opacity-50";
                                          textClass = "text-slate-400";
                                      } else {
                                          boxClass += "bg-white border-slate-300 shadow-sm";
                                      }

                                      return (
                                          <div key={`pool-${num}`} className="flex flex-col items-center relative">
                                              <div className={boxClass}>
                                                  <span className={textClass}>{num}</span>
                                              </div>
                                              
                                              {/* Labels below */}
                                              {isCurrentI && (
                                                <div className={`absolute -bottom-6 text-[10px] font-mono font-bold ${action === 'backtrack' ? 'text-rose-500' : 'text-amber-500'}`}>
                                                    i={num}
                                                </div>
                                              )}
                                              {num === start && !isCurrentI && (
                                                  <div className={`absolute -bottom-6 text-[10px] font-mono font-bold text-purple-500`}>
                                                    start
                                                </div>
                                              )}
                                          </div>
                                      );
                                  })}
                              </div>
                          </div>
                      )}

                      {/* Bottom: Results Array */}
                      <div className="w-full flex flex-col items-center mt-6">
                           <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest font-mono mb-4 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Found Combinations (res)</span>
                           
                           <div className="flex flex-wrap gap-2 justify-center w-full max-w-lg">
                               {res && res.length > 0 ? res.map((comb, idx) => (
                                   <div key={`res-${idx}`} className={`px-3 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono font-bold rounded-lg shadow-sm text-sm ${action === 'match' && idx === res.length - 1 ? 'animate-in zoom-in slide-in-from-top-4' : ''}`}>
                                       [{comb.join(',')}]
                                   </div>
                               )) : (
                                   <div className="text-slate-400 italic text-sm font-mono border border-dashed border-slate-300 px-6 py-2 rounded-lg">Empty</div>
                               )}
                           </div>
                      </div>

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600`}>
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">SEARCH COMPLETE</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Found {res.length} combinations
                              </span>
                          </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Theory / Learn Tab */}
        {activeTab === 'learn' && (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-10 font-mono">
            <div className="max-w-4xl space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Shuffle className="text-indigo-600"/> Backtracking Fundamentals
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-indigo-100 pl-6">
                Backtracking is a general algorithmic technique that considers searching every possible combination in order to solve a computational problem. It builds candidates for the solution incrementally and abandons a candidate ("backtracks") as soon as it determines that the candidate cannot possibly be completed to a valid solution.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-purple-50 border border-purple-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-purple-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Layers size={18}/> The Decision Tree
                        </h3>
                        <p className="text-sm text-purple-800 leading-relaxed mb-4">
                            Think of this algorithm as exploring a tree. At each step, you make a decision: which number should I add next?
                        </p>
                        <div className="text-xs text-purple-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-purple-200 shadow-inner space-y-3">
                            <p>To avoid duplicates like `[1, 2]` and `[2, 1]`, we enforce a rule: the next number chosen must be strictly greater than the previously chosen number.</p>
                            <p>This is why we pass <code>i + 1</code> as the <code>start</code> parameter in our recursive call.</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowUp size={18}/> Push, Recurse, Pop
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            The core anatomy of a backtracking loop is almost always the same:
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>1. <strong>Make a choice:</strong> <code>current.add(i)</code></p>
                            <p>2. <strong>Explore consequences:</strong> <code>backtrack(...)</code></p>
                            <p>3. <strong>Undo the choice:</strong> <code>current.remove(...)</code></p>
                            <p>By undoing the choice, the <code>current</code> list acts as a reusable buffer, preventing us from having to clone the list at every single step of the recursion.</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}
        
        {/* Interview Tab */}
        {activeTab === 'interview' && (
             <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-8 font-mono">
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                        <Trophy size={140} />
                    </div>
                    <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-amber-400 relative z-10 uppercase tracking-tight">
                        <Trophy size={24} /> Interview Defense
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                        "I used backtracking (Depth First Search) to generate all combinations. I maintain a `start` index to ensure we only pick numbers greater than the current one, preventing permutations (like `[2,1]`) and redundant work. When the `current` path size reaches `k`, I create a deep copy and add it to the results. We can further optimize the `for` loop condition to `i &lt;= n - (k - current.size()) + 1`. This early pruning stops the loop if there aren't enough numbers left to fulfill the required length `k`."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-indigo-500"/> FAQ: The Pruning Optimization
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Instead of looping <code>i &lt;= n</code>, we can loop <code>i &lt;= n - (k - current.size()) + 1</code>. <br/><br/>If <code>n = 4</code>, <code>k = 4</code>, and we haven't picked anything yet (size=0), we need 4 numbers. If our loop considers starting at <code>i = 2</code>, we'd only have numbers 2, 3, and 4 available (3 numbers total). We can never reach a length of 4! The optimized bound prevents us from even starting down that doomed branch.
                            </div>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <Timer size={14} className="text-emerald-500"/> Time & Space Complexity
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Time Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(k * C(n, k))</span>
                                <p className="text-[10px] text-slate-500 mt-1">Where C(n, k) is the binomial coefficient ("n choose k"). There are C(n, k) valid combinations. For each combination, we spend O(k) time copying the array into the result list.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(k)</span>
                                <p className="text-[10px] text-slate-500 mt-1">The maximum depth of the recursive call stack is `k`. The temporary `current` array also holds at most `k` elements. (Excluding space required to hold the output).</p>
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

const VariableCard = ({ label, val, color, active }) => {
    const bgMap = {
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        sky: 'bg-sky-50 border-sky-200 text-sky-700',
        rose: 'bg-rose-50 border-rose-200 text-rose-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        slate: 'bg-slate-100 border-slate-300 text-slate-700',
        indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700'
    };
    
    const inactiveMap = 'bg-slate-50 border-slate-200 text-slate-300';

    return (
        <div className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden h-full ${active ? bgMap[color] : inactiveMap}`}>
             <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 truncate px-1">{label}</span>
             <div className={`text-xl font-black font-mono leading-none truncate w-full text-center px-2`}>
                 {val !== null && val !== undefined ? val : '-'}
             </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'indigo' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Map|HashMap|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|put|getOrDefault|containsKey|add|remove|get|substring|length|size|combine|backtrack)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
  const bgActive = `bg-${theme}-500/15`;
  const borderActive = `bg-${theme}-500`;
  const textActive = `text-${theme}-400`;

  return (
    <div className={`flex relative z-10 min-h-[16.5px] transition-colors duration-200 ${active ? bgActive : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${borderActive}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-[10px] ${active ? `${textActive} font-bold` : 'text-slate-700'}`}>{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"') || part.startsWith("'")) return <span key={i} className="text-green-300">{part}</span>;
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for', 'break', 'continue'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Map', 'HashMap', 'Math', 'Arrays', 'ArrayList', 'ListNode', 'TreeNode', 'Stack', 'StringBuilder'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['put', 'getOrDefault', 'containsKey', 'add', 'remove', 'get', 'substring', 'length', 'size', 'combine', 'backtrack'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['n', 'k', 's', 'words', 'res', 'wordLen', 'numWords', 'totalLen', 'counts', 'seen', 'i', 'j', 'wordIndex', 'word', 'start', 'current'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default CombinationsVisualizer;