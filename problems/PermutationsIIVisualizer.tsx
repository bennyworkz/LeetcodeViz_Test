import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ListOrdered, ArrowRight, Hash, XSquare, Blocks, 
  CheckSquare, Shuffle, Info, RotateCcw, Timer
} from 'lucide-react';

const APPROACHES = {
  backtracking: {
    id: 'backtracking',
    title: 'Backtracking w/ Pruning',
    subtitle: 'Optimal: O(N * N!) Time, O(N) Space.',
    icon: <Shuffle size={16} />,
    complexity: 'Time: O(N * N!) | Space: O(N)', 
    code: `class Solution {
    public List<List<Integer>> permuteUnique(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        // 1. Sort the array to group duplicates together
        Arrays.sort(nums); 
        backtrack(res, new ArrayList<>(), nums, new boolean[nums.length]);
        return res;
    }
    
    private void backtrack(List<List<Integer>> res, List<Integer> path, int[] nums, boolean[] used) {
        // 2. Base case: a full permutation is formed
        if (path.size() == nums.length) {
            res.add(new ArrayList<>(path));
            return;
        }
        
        for (int i = 0; i < nums.length; i++) {
            // 3. Skip if the element is already in the current path
            if (used[i]) continue;
            
            // 4. Prune duplicate branches: 
            // If it's the same as the previous element AND the previous 
            // element was NOT used in this current depth/branch.
            if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]) {
                continue;
            }
            
            // 5. Choose
            used[i] = true;
            path.add(nums[i]);
            
            // 6. Explore
            backtrack(res, path, nums, used);
            
            // 7. Un-choose (Backtrack)
            used[i] = false;
            path.remove(path.size() - 1);
        }
    }
}`,
    explanation: "To generate unique permutations, we sort the array to place duplicates adjacent to each other. We use a boolean array `used` to track elements in our current path. The most critical part is the pruning condition: `nums[i] == nums[i-1] && !used[i-1]`. This ensures that among identical elements, we only ever use them in the relative order they appear in the sorted array, preventing parallel recursive branches from generating identical permutations."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">47. Permutations II</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given a collection of numbers, <code>nums</code>, that might contain duplicates, return <em>all possible unique permutations</em> <strong>in any order</strong>.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [1,1,2]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> <br/>
                [[1,1,2],<br/>
                 [1,2,1],<br/>
                 [2,1,1]]
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [1,2,3]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= nums.length &lt;= 8</code></li>
              <li><code>-10 &lt;= nums[i] &lt;= 10</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const PermutationsIIVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('backtracking');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const [numsInput, setNumsInput] = useState('1, 1, 2');

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let rawStr = numsInput.trim();
    if (!rawStr) rawStr = "1, 1, 2";
    
    // Parse to integers
    let numsArr = rawStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    if (numsArr.length === 0) numsArr = [1, 1, 2];
    
    // Cap to 4 elements to prevent browser freezing during visualization (4! = 24 traces)
    if (numsArr.length > 4) {
      numsArr = numsArr.slice(0, 4);
    }

    // Sort is required for the algorithm
    numsArr.sort((a, b) => a - b);
    
    return { nums: numsArr };
  }, [numsInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { nums } = parsedData;

    const addStep = (phase, desc, line, stateProps) => {
        if (steps.length > 2500) return;
        steps.push({
            phase,
            description: desc,
            line,
            state: { 
              ...stateProps, 
              path: [...(stateProps.path || [])],
              used: [...(stateProps.used || [])],
              res: stateProps.res ? stateProps.res.map(r => [...r]) : []
            }
        });
    };

    let res = [];
    let used = new Array(nums.length).fill(false);
    let path = [];

    addStep('Initialization', `Sorted input array to group duplicates together.\n\nnums = [${nums.join(', ')}]`, 5, { nums, path, used, res, i: null, action: 'init' });

    const backtrack = (currentDepth) => {
        if (steps.length > 2500) return;

        addStep('Check Base Case', `Checking if path length (${path.length}) == nums.length (${nums.length}).`, 10, { nums, path, used, res, i: null, action: 'check' });

        if (path.length === nums.length) {
            res.push([...path]);
            addStep('Permutation Found!', `Base case met. \n\nAdded [${path.join(', ')}] to results.`, 11, { nums, path, used, res, i: null, action: 'match' });
            return;
        }

        for (let i = 0; i < nums.length; i++) {
            if (steps.length > 2500) return;
            
            addStep(`Evaluate Choice i=${i}`, `Considering nums[${i}] = ${nums[i]}.`, 15, { nums, path, used, res, i, action: 'evaluate' });

            if (used[i]) {
                addStep('Prune: Already Used', `nums[${i}] is already in our current path.\nSkipping.`, 16, { nums, path, used, res, i, action: 'prune_used' });
                continue;
            }

            if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) {
                addStep('Prune: Duplicate Branch', `nums[${i}] == nums[${i-1}] (${nums[i]}) AND nums[${i-1}] is NOT used.\n\nThis means we are starting a parallel identical branch. Skipping to prevent duplicates!`, 19, { nums, path, used, res, i, action: 'prune_dup' });
                continue;
            }

            // Choose
            used[i] = true;
            path.push(nums[i]);
            addStep('Choose', `Selected nums[${i}] = ${nums[i]}.\n\nAdded to path, marked as used.`, 21, { nums, path, used, res, i, action: 'choose' });

            // Explore
            addStep('Recurse', `Recursing deeper to find the next element...`, 24, { nums, path, used, res, i, action: 'recurse' });
            backtrack(currentDepth + 1);

            if (steps.length > 2500) return;

            // Backtrack
            used[i] = false;
            let removed = path.pop();
            addStep('Backtrack', `Returned from recursion.\n\nRemoved ${removed} from path and marked nums[${i}] as unused to explore other combinations.`, 26, { nums, path, used, res, i, action: 'backtrack' });
        }
    };

    backtrack(0);

    addStep('Algorithm Complete', `Finished exploring all paths.\n\nGenerated ${res.length} unique permutations.`, 6, { nums, path: [], used: new Array(nums.length).fill(false), res, i: null, action: 'complete', isSuccess: true });

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
  const s = cur.state || {};

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Shuffle className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Permutations II</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 47</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Backtracking / Array</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto">
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
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-violet-600 border-violet-600 text-white shadow-violet-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-violet-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-violet-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-violet-100' : 'text-slate-400'}`}>
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
                      <Code2 size={14} className="text-violet-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${s.isSuccess || s.action === 'match' ? 'bg-emerald-500/20 border-emerald-500' : (s.action === 'prune_used' || s.action === 'prune_dup' ? 'bg-rose-500/20 border-rose-500' : (s.action === 'backtrack' ? 'bg-amber-500/20 border-amber-500' : 'bg-violet-500/20 border-violet-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={s.isSuccess || s.action === 'match' ? 'emerald' : (s.action === 'prune_used' || s.action === 'prune_dup' ? 'rose' : (s.action === 'backtrack' ? 'amber' : 'violet'))} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Iteration Variables</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="Index (i)" val={s.i !== null && s.i !== undefined ? s.i : "-"} color="purple" active={s.i !== null && s.i !== undefined} />
                        <VariableCard label="nums[i]" val={s.i !== null && s.i !== undefined ? s.nums[s.i] : "-"} color="sky" active={s.i !== null && s.i !== undefined} />
                        <VariableCard label="Depth" val={s.path ? s.path.length : "-"} color="amber" active={s.path !== undefined} />
                        <VariableCard label="Results" val={s.res ? s.res.length : "-"} color="emerald" active={s.res !== undefined && s.res.length > 0} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-end shrink-0">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Nums Array (CSV)</label>
                        <input type="text" value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-sm shadow-inner tracking-widest font-bold text-slate-700 outline-none focus:ring-2 focus:ring-violet-500" placeholder="1, 1, 2" />
                        <p className="text-[9px] text-slate-400 pl-1 font-mono">Max 4 elements</p>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto pb-5">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 sm:flex-none sm:w-16 px-4 py-2.5 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] sm:flex-none sm:w-28 px-4 py-2.5 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-md shadow-violet-200 hover:bg-violet-700 transition-all flex items-center justify-center gap-1">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group shrink-0 ${s.isSuccess || s.action === 'match' ? 'bg-emerald-900 border-emerald-800' : (s.action === 'prune_used' || s.action === 'prune_dup' ? 'bg-rose-900 border-rose-800' : (s.action === 'choose' ? 'bg-teal-900 border-teal-800' : (s.action === 'backtrack' ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800')))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {s.isSuccess || s.action === 'match' ? <Check size={100}/> : (s.action === 'prune_used' || s.action === 'prune_dup' ? <XSquare size={100}/> : (s.action === 'backtrack' ? <RotateCcw size={100}/> : <Activity size={100}/>))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={s.isSuccess || s.action === 'match' ? "text-emerald-400" : (s.action === 'prune_used' || s.action === 'prune_dup' ? 'text-rose-400' : (s.action === 'choose' ? 'text-teal-400' : (s.action === 'backtrack' ? 'text-amber-400' : 'text-slate-400')))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${s.isSuccess || s.action === 'match' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (s.action === 'prune_used' || s.action === 'prune_dup' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : (s.action === 'choose' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : (s.action === 'backtrack' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30')))}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-3 uppercase font-mono text-white flex items-center gap-3 relative z-10">
                      {cur.phase}
                  </div>
                  <div className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 font-mono whitespace-pre-line overflow-y-auto max-h-[100px] scrollbar-thin relative z-10">
                      {cur.description}
                  </div>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner items-center justify-start pt-8 min-h-[460px]">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 gap-8 overflow-y-auto overflow-x-auto">
                      
                      {/* Current Path */}
                      <div className="flex flex-col items-center border-b border-slate-200 pb-8 w-full">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-4 flex items-center gap-2"><Target size={14}/> Current Path</span>
                          <div className="flex gap-2 items-center bg-slate-900 border-4 border-slate-800 p-4 rounded-2xl shadow-xl min-w-[240px] h-20 justify-center relative">
                              {s.nums && Array.from({length: s.nums.length}).map((_, idx) => {
                                  let val = s.path && idx < s.path.length ? s.path[idx] : null;
                                  const isNew = s.action === 'choose' && idx === s.path.length - 1;
                                  
                                  let boxClass = "w-10 h-12 flex items-center justify-center font-mono font-black text-2xl mx-1 rounded-lg transition-all duration-300 border-2 ";
                                  
                                  if (val !== null) {
                                      if (isNew) {
                                          boxClass += "bg-teal-500/20 border-teal-500 text-teal-400 animate-in zoom-in";
                                      } else if (s.action === 'match') {
                                          boxClass += "bg-emerald-500/20 border-emerald-500 text-emerald-400 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.4)]";
                                      } else {
                                          boxClass += "bg-slate-800 border-slate-600 text-white";
                                      }
                                  } else {
                                      boxClass += "border-slate-700 bg-slate-800/50 text-transparent border-dashed";
                                  }

                                  return (
                                      <div key={`path-${idx}`} className={boxClass}>
                                          {val !== null ? val : '-'}
                                      </div>
                                  );
                              })}
                          </div>
                      </div>

                      {/* Source Nums Array */}
                      <div className="flex flex-col items-center w-full">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-4 flex items-center gap-2"><ListOrdered size={14}/> Sorted Nums Array & Used Flags</span>
                          <div className="flex gap-3 items-center">
                              {s.nums && s.nums.map((num, index) => {
                                  const isUsed = s.used && s.used[index];
                                  const isCurrent = s.i === index;
                                  const isPruneDup = isCurrent && s.action === 'prune_dup';
                                  const isPruneUsed = isCurrent && s.action === 'prune_used';
                                  
                                  let boxClass = "relative w-14 h-14 flex items-center justify-center rounded-xl border-4 font-mono font-black text-2xl transition-all duration-300 ";
                                  let textClass = "";

                                  if (isPruneDup || isPruneUsed) {
                                      boxClass += "bg-rose-100 border-rose-500 scale-110 shadow-lg ring-4 ring-rose-300/30 z-20";
                                      textClass = "text-rose-900";
                                  } else if (isCurrent) {
                                      boxClass += "bg-violet-100 border-violet-500 scale-110 shadow-lg ring-4 ring-violet-300/30 z-20";
                                      textClass = "text-violet-900";
                                  } else if (isUsed) {
                                      boxClass += "bg-slate-100 border-slate-300 opacity-60";
                                      textClass = "text-slate-400 line-through";
                                  } else {
                                      boxClass += "bg-white border-slate-300 shadow-sm hover:border-violet-300";
                                      textClass = "text-slate-700";
                                  }

                                  return (
                                      <div key={`nums-${index}`} className="flex flex-col items-center relative">
                                          <div className={boxClass}>
                                              <span className={textClass}>{num}</span>
                                              
                                              {/* Checkmark for Used */}
                                              {isUsed && !isCurrent && (
                                                <div className="absolute -top-2 -right-2 w-5 h-5 bg-slate-500 text-white rounded-full flex items-center justify-center shadow-md">
                                                    <Check size={12} strokeWidth={4}/>
                                                </div>
                                              )}
                                          </div>
                                          
                                          {/* Index Labels */}
                                          <div className={`mt-2 font-mono text-[10px] font-bold ${isCurrent ? 'text-violet-600' : 'text-slate-400'}`}>
                                              idx: {index}
                                          </div>
                                          
                                          {/* Explanatory Tags below current */}
                                          {isPruneDup && (
                                            <div className="absolute -bottom-8 whitespace-nowrap bg-rose-100 text-rose-700 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider animate-bounce">
                                                Duplicate Blocked
                                            </div>
                                          )}
                                      </div>
                                  );
                              })}
                          </div>
                      </div>

                      {/* Results Array */}
                      <div className="w-full flex flex-col items-center mt-auto border-t border-slate-200 pt-6">
                           <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest font-mono mb-4 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Results (res)</span>
                           
                           <div className="flex flex-wrap gap-2 justify-center w-full max-w-lg min-h-[40px]">
                               {s.res && s.res.length > 0 ? s.res.map((comb, idx) => (
                                   <div key={`res-${idx}`} className={`px-2 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono font-bold rounded-lg shadow-sm text-xs ${s.action === 'match' && idx === s.res.length - 1 ? 'animate-in zoom-in slide-in-from-top-4' : ''}`}>
                                       [{comb.join(',')}]
                                   </div>
                               )) : (
                                   <div className="text-slate-400 italic text-sm font-mono border border-dashed border-slate-300 px-6 py-1.5 rounded-lg">Empty</div>
                               )}
                           </div>
                      </div>

                   </div>

                  {/* Final Overlays */}
                  {s.isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600`}>
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">SEARCH COMPLETE</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Found {s.res.length} unique permutations
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
                <Shuffle className="text-violet-600"/> Backtracking & Duplicate Pruning
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Generating permutations is standard depth-first search (DFS). However, when the input contains duplicates (like <code>[1, 1, 2]</code>), a naive DFS will generate identical sequences. We must prune redundant branches.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ListOrdered size={18}/> Step 1: Sorting
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            The first mandatory step is to <strong>sort the array</strong>.
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-3">
                            <p>Sorting guarantees that all identical elements are placed immediately next to each other.</p>
                            <p>This allows us to easily check if the current element is a duplicate by simply comparing it to the previous element: <code>nums[i] == nums[i-1]</code>.</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-rose-50 border border-rose-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-rose-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <CheckSquare size={18}/> Step 2: The Magic Condition
                        </h3>
                        <p className="text-xs text-rose-800 leading-relaxed mb-4">
                            The core logic lies in this check: <br/><code>nums[i] == nums[i-1] && !used[i-1]</code>
                        </p>
                        <div className="text-xs text-rose-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-rose-200 shadow-inner space-y-2">
                            <p>If the current element is identical to the previous one, and the previous one is <strong>NOT used</strong>, we skip the current one.</p>
                            <p><strong>Why?</strong> If the previous identical element is NOT used, it means we just finished exploring the entire recursive subtree with that previous element at this exact position. Using the current identical element here would just generate the exact same subtree again!</p>
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
                        "To handle duplicates in permutations, I sort the input array first. This guarantees duplicates are adjacent. I use a backtracking algorithm with a `boolean[] used` array. Inside the recursive function, I iterate through all elements. If an element is already in the current path (`used[i] == true`), I skip it. The critical pruning condition is checking if `i &gt; 0 && nums[i] == nums[i - 1] && !used[i - 1]`. This checks if we are about to start a new recursive branch using a duplicate element whose identical predecessor was just explored and reverted (hence `!used`). Skipping this prevents generating identical permutation subtrees."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-violet-500"/> FAQ: Can we use used[i - 1] == true?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Interestingly, if you change the condition to <code>nums[i] == nums[i - 1] && used[i - 1]</code>, the code will still produce correct unique permutations! 
                                <br/><br/>
                                However, it is <strong>highly inefficient</strong>. Pruning when <code>!used[i-1]</code> prunes identical parallel branches at the root of the subtrees. Pruning when <code>used[i-1]</code> is true delays the pruning until deep into the leaf nodes, resulting in much more wasted computation. Always use <code>!used[i-1]</code>.
                            </div>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <Timer size={14} className="text-violet-500"/> Time & Space Complexity
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Time Complexity</span>
                                <span className="text-sm font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded">O(N &times; N!)</span>
                                <p className="text-[10px] text-slate-500 mt-1">In the worst case (all unique elements), there are N! permutations. For each permutation, we take O(N) time to copy the path array into the result list.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded">O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">The `used` array takes O(N) space. The recursion stack goes N levels deep. The temporary `path` list stores up to N elements. This doesn't count the output array space.</p>
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
        violet: 'bg-violet-50 border-violet-200 text-violet-700',
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 shrink-0'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Math|Arrays|ArrayList|permuteUnique|backtrack|sort|size|add|remove|length)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Math', 'Arrays', 'ArrayList'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['permuteUnique', 'backtrack', 'sort', 'size', 'add', 'remove', 'length'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['nums', 'res', 'path', 'used', 'i'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default PermutationsIIVisualizer;