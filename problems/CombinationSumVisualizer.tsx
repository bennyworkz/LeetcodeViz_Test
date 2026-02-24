import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, ArrowRight, CornerDownRight, Zap, RefreshCw, Timer,
  AlignLeft, Type, Hash, ShieldCheck, GitMerge, ListPlus, Undo2, Database
} from 'lucide-react';

const APPROACHES = {
  standardBacktrack: {
    id: 'standardBacktrack',
    title: '1. Standard Backtracking',
    subtitle: 'Classic DFS. O(2^T) Time.',
    icon: <GitMerge size={16} />,
    complexity: 'Time: O(2^t) | Space: O(T)',
    code: `class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(candidates, target, 0, new ArrayList<>(), 0, res);
        return res;
    }

    private void backtrack(int[] candidates, int target, int start, List<Integer> current, int sum, List<List<Integer>> res) {
        // Base Case 1: Target reached
        if (sum == target) {
            res.add(new ArrayList<>(current));
            return;
        }
        // Base Case 2: Target exceeded (Dead end)
        if (sum > target) {
            return;
        }

        // Iterate through candidates starting from 'start'
        for (int i = start; i < candidates.length; i++) {
            // 1. Make a Choice
            current.add(candidates[i]);
            
            // 2. Explore Further (Note: we pass 'i', not 'i+1', to allow reuse)
            backtrack(candidates, target, i, current, sum + candidates[i], res);
            
            // 3. Undo Choice (Backtrack)
            current.remove(current.size() - 1);
        }
    }
}`,
    explanation: "This is the foundational Backtracking (Depth-First Search) template. We build a combination element by element. At each step, we have a choice: we can pick any candidate from the current index onwards. Because we are allowed to use the same number an unlimited number of times, when we recurse, we pass 'i' as the starting index, NOT 'i + 1'. If our running sum exactly equals the target, we save a copy of our combination. If it exceeds the target, we hit a dead end and return. Critically, after the recursive call finishes, we remove the last added element to 'backtrack' and try the next possible branch."
  },
  optimizedBacktrack: {
    id: 'optimizedBacktrack',
    title: '2. Optimized Backtracking',
    subtitle: 'Sort + Early Stopping. Faster.',
    icon: <Zap size={16} />,
    complexity: 'Time: O(2^t) | Space: O(T)',
    code: `class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> res = new ArrayList<>();
        // Optimization: Sort the array first
        Arrays.sort(candidates);
        backtrack(candidates, target, 0, new ArrayList<>(), 0, res);
        return res;
    }

    private void backtrack(int[] candidates, int target, int start, List<Integer> current, int sum, List<List<Integer>> res) {
        if (sum == target) {
            res.add(new ArrayList<>(current));
            return;
        }

        for (int i = start; i < candidates.length; i++) {
            // Early Stopping: If adding this number exceeds target, 
            // all subsequent numbers will too (because it's sorted!)
            if (sum + candidates[i] > target) {
                break;
            }
            
            current.add(candidates[i]);
            backtrack(candidates, target, i, current, sum + candidates[i], res);
            current.remove(current.size() - 1);
        }
    }
}`,
    explanation: "This approach applies a powerful optimization to the standard backtracking template. By first sorting the candidates array (O(N log N)), we guarantee that the numbers are evaluated in ascending order. Inside the loop, before we even make a recursive call, we check if adding the current candidate would exceed the target. If it does, we can instantly 'break' out of the loop! We know that any subsequent candidates in the sorted array will be even larger, so checking them is a waste of time. This prunes massive branches from the decision tree."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">39. Combination Sum</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given an array of <strong>distinct</strong> integers <code>candidates</code> and a target integer <code>target</code>, return <em>a list of all <strong>unique combinations</strong> of </em><code>candidates</code><em> where the chosen numbers sum to </em><code>target</code>. You may return the combinations in <strong>any order</strong>.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-violet-500 pl-4 bg-violet-50 py-2 mt-4">
          The <strong>same</strong> number may be chosen from <code>candidates</code> an <strong>unlimited number of times</strong>. Two combinations are unique if the frequency of at least one of the chosen numbers is different.
        </p>

        <p className="text-lg leading-relaxed">
          The test cases are generated such that the number of unique combinations that sum up to <code>target</code> is less than <code>150</code> combinations for the given input.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> candidates = [2,3,6,7], target = 7</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[2,2,3],[7]]</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation:</p>
                 <ul className="list-disc pl-4 mt-1">
                     <li>2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times.</li>
                     <li>7 is a candidate, and 7 = 7.</li>
                     <li>These are the only two combinations.</li>
                 </ul>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> candidates = [2,3,5], target = 8</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[2,2,2,2],[2,3,3],[3,5]]</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> candidates = [2], target = 1</p>
              <p><span className="text-slate-400 font-bold">Output:</span> []</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= candidates.length &lt;= 30</code></li>
              <li><code>2 &lt;= candidates[i] &lt;= 40</code></li>
              <li>All elements of <code>candidates</code> are <strong>distinct</strong>.</li>
              <li><code>1 &lt;= target &lt;= 40</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const CombinationSumVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('standardBacktrack');
  const [candidatesInput, setCandidatesInput] = useState('2, 3, 6, 7');
  const [targetInput, setTargetInput] = useState('7');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let arr = candidatesInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (arr.length === 0) arr = [2, 3, 6, 7];
    
    let target = parseInt(targetInput.trim());
    if (isNaN(target) || target < 1) target = 7;
    
    // UI Safeguards to prevent explosive recursion freezing the browser
    if (arr.length > 5) arr = arr.slice(0, 5);
    if (target > 15) target = 15;

    // Eliminate duplicates to match problem constraints
    arr = [...new Set(arr)];

    return { candidates: arr, target };
  }, [candidatesInput, targetInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { candidates, target } = parsedData;
    
    let workingCandidates = [...candidates];
    if (selectedApproachId === 'optimizedBacktrack') {
        workingCandidates.sort((a, b) => a - b);
    }

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 3000) return; // Hard safety cap
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    let res = [];

    const backtrack = (start, currentList, currentSum, depth) => {
        if (steps.length > 3000) return;

        let snapshot = [...currentList];
        
        if (selectedApproachId === 'standardBacktrack') {
            addStep(
                "Enter Backtrack Call", 
                `Line 7: private void backtrack(..., start=${start}, sum=${currentSum})\n\nEntering recursive function at depth ${depth}. Current combination path is [${snapshot.join(', ')}].`, 
                7, 
                { start, current: snapshot, sum: currentSum, res: [...res], i: null, action: 'enter' }
            );

            addStep(
                "Evaluate Base Case 1 (Success)", 
                `Line 9: if (sum == target)\n\nDoes our running sum (${currentSum}) perfectly equal the target (${target})?`, 
                9, 
                { start, current: snapshot, sum: currentSum, res: [...res], i: null, action: 'evalBase1' }
            );

            if (currentSum === target) {
                res.push([...currentList]);
                addStep(
                    "Combination Accepted!", 
                    `Line 10-11: res.add(new ArrayList<>(current));\n\nCondition met! We add a copy of [${snapshot.join(', ')}] to our results list, and immediately return to stop exploring this branch.`, 
                    10, 
                    { start, current: snapshot, sum: currentSum, res: [...res], i: null, action: 'successBranch' }
                );
                return;
            }

            addStep(
                "Evaluate Base Case 2 (Failure)", 
                `Line 14: if (sum > target)\n\nHas our running sum (${currentSum}) exceeded the target (${target})?`, 
                14, 
                { start, current: snapshot, sum: currentSum, res: [...res], i: null, action: 'evalBase2' }
            );

            if (currentSum > target) {
                addStep(
                    "Dead End Hit", 
                    `Line 15: return;\n\nOur sum (${currentSum}) is too large. Since all numbers are positive, adding more numbers will only make it worse. We return (backtrack) immediately.`, 
                    15, 
                    { start, current: snapshot, sum: currentSum, res: [...res], i: null, action: 'deadEnd' }
                );
                return;
            }

            addStep(
                "Start Candidate Loop", 
                `Line 19: for (int i = ${start}; i < candidates.length; i++)\n\nWe iterate through available choices. We start from index ${start} to prevent generating duplicate combinations (like [2,3] and [3,2]).`, 
                19, 
                { start, current: snapshot, sum: currentSum, res: [...res], i: null, action: 'loopStart' }
            );

            for (let i = start; i < workingCandidates.length; i++) {
                if (steps.length > 3000) break;
                
                let candidate = workingCandidates[i];
                
                addStep(
                    "Evaluate Choice", 
                    `Line 19: i = ${i}, candidate = ${candidate}.\n\nWe are preparing to try adding ${candidate} to our current combination.`, 
                    19, 
                    { start, current: snapshot, sum: currentSum, res: [...res], i, action: 'evalChoice' }
                );

                currentList.push(candidate);
                let addedSnapshot = [...currentList];
                addStep(
                    "Make Choice (Add)", 
                    `Line 21: current.add(candidates[i]);\n\nWe add ${candidate} to our path. Our combination is now [${addedSnapshot.join(', ')}].`, 
                    21, 
                    { start, current: addedSnapshot, sum: currentSum, res: [...res], i, action: 'add' }
                );

                addStep(
                    "Recurse Deeper", 
                    `Line 24: backtrack(..., i=${i}, ..., sum=${currentSum + candidate})\n\nWe recurse. Notice we pass 'i' as the start index, NOT 'i+1'. This is because we are allowed to reuse the same number ${candidate} again!`, 
                    24, 
                    { start, current: addedSnapshot, sum: currentSum + candidate, res: [...res], i, action: 'recurse' }
                );

                backtrack(i, currentList, currentSum + candidate, depth + 1);

                addStep(
                    "Return from Recursion", 
                    `Line 24: The recursive call finished.\n\nWe have explored all possible futures stemming from choosing ${candidate} at this level. We must now UNDO that choice to explore other branches.`, 
                    24, 
                    { start, current: addedSnapshot, sum: currentSum, res: [...res], i, action: 'returnRecurse' }
                );

                let removed = currentList.pop();
                let poppedSnapshot = [...currentList];
                addStep(
                    "Undo Choice (Backtrack)", 
                    `Line 27: current.remove(current.size() - 1);\n\nWe pop ${removed} off the list. Our combination reverts back to [${poppedSnapshot.join(', ')}]. This is the core of backtracking!`, 
                    27, 
                    { start, current: poppedSnapshot, sum: currentSum, res: [...res], i, action: 'remove' }
                );
            }
            
            addStep(
                "End of Function Reach", 
                `Line 29: }\n\nThe loop is exhausted for start=${start}. We have tried all candidates at this depth. We return to the caller.`, 
                28, 
                { start, current: snapshot, sum: currentSum, res: [...res], i: null, action: 'return' }
            );

        } else if (selectedApproachId === 'optimizedBacktrack') {
             addStep(
                "Enter Backtrack Call", 
                `Line 9: private void backtrack(..., start=${start}, sum=${currentSum})\n\nEntering recursive function at depth ${depth}. Current combination path is [${snapshot.join(', ')}].`, 
                9, 
                { start, current: snapshot, sum: currentSum, res: [...res], i: null, action: 'enter' }
            );

            addStep(
                "Evaluate Base Case 1 (Success)", 
                `Line 10: if (sum == target)\n\nDoes our running sum (${currentSum}) perfectly equal the target (${target})?`, 
                10, 
                { start, current: snapshot, sum: currentSum, res: [...res], i: null, action: 'evalBase1' }
            );

            if (currentSum === target) {
                res.push([...currentList]);
                addStep(
                    "Combination Accepted!", 
                    `Line 11-12: res.add(new ArrayList<>(current));\n\nCondition met! We add a copy of [${snapshot.join(', ')}] to our results list, and immediately return.`, 
                    11, 
                    { start, current: snapshot, sum: currentSum, res: [...res], i: null, action: 'successBranch' }
                );
                return;
            }

            addStep(
                "Start Candidate Loop", 
                `Line 15: for (int i = ${start}; i < candidates.length; i++)\n\nWe iterate through available choices starting from index ${start}.`, 
                15, 
                { start, current: snapshot, sum: currentSum, res: [...res], i: null, action: 'loopStart' }
            );

            for (let i = start; i < workingCandidates.length; i++) {
                if (steps.length > 3000) break;
                
                let candidate = workingCandidates[i];
                let potentialSum = currentSum + candidate;
                
                addStep(
                    "Evaluate Early Stopping", 
                    `Line 18: if (sum + candidates[i] > target)\n\nIs ${currentSum} + ${candidate} (${potentialSum}) > ${target}?`, 
                    18, 
                    { start, current: snapshot, sum: currentSum, res: [...res], i, action: 'evalEarlyStop' }
                );

                if (potentialSum > target) {
                    addStep(
                        "Prune Branch (Break)", 
                        `Line 19: break;\n\nSince the array is SORTED, if ${candidate} causes an overshoot, every number after it will ALSO cause an overshoot! We instantly break the loop, saving massive computation time.`, 
                        19, 
                        { start, current: snapshot, sum: currentSum, res: [...res], i, action: 'break' }
                    );
                    break;
                }

                currentList.push(candidate);
                let addedSnapshot = [...currentList];
                addStep(
                    "Make Choice (Add)", 
                    `Line 22: current.add(candidates[i]);\n\nWe add ${candidate} to our path. Our combination is now [${addedSnapshot.join(', ')}].`, 
                    22, 
                    { start, current: addedSnapshot, sum: currentSum, res: [...res], i, action: 'add' }
                );

                addStep(
                    "Recurse Deeper", 
                    `Line 23: backtrack(..., i=${i}, ..., sum=${currentSum + candidate})\n\nWe recurse. We pass 'i' as the start index to allow reuse of ${candidate}.`, 
                    23, 
                    { start, current: addedSnapshot, sum: currentSum + candidate, res: [...res], i, action: 'recurse' }
                );

                backtrack(i, currentList, currentSum + candidate, depth + 1);

                addStep(
                    "Return from Recursion", 
                    `Line 23: The recursive call finished.\n\nWe have explored all possible futures. Time to UNDO our choice.`, 
                    23, 
                    { start, current: addedSnapshot, sum: currentSum, res: [...res], i, action: 'returnRecurse' }
                );

                let removed = currentList.pop();
                let poppedSnapshot = [...currentList];
                addStep(
                    "Undo Choice (Backtrack)", 
                    `Line 24: current.remove(current.size() - 1);\n\nWe pop ${removed} off the list. Combination reverts to [${poppedSnapshot.join(', ')}].`, 
                    24, 
                    { start, current: poppedSnapshot, sum: currentSum, res: [...res], i, action: 'remove' }
                );
            }
        }
    };

    if (selectedApproachId === 'standardBacktrack') {
        addStep("Initialize Results List", `Line 3: List<List<Integer>> res = new ArrayList<>();\n\nCreate the master list to hold all valid combinations.`, 3, { start: null, current: [], sum: 0, res: [], i: null, action: 'init' });
        addStep("Initiate Algorithm", `Line 4: backtrack(candidates, target, 0, new ArrayList<>(), 0, res);\n\nLaunch the backtracking DFS from index 0 with an empty combination list and sum 0.`, 4, { start: null, current: [], sum: 0, res: [], i: null, action: 'init' });
        backtrack(0, [], 0, 0);
        addStep("Algorithm Complete", `Line 5: return res;\n\nThe full DFS tree has been traversed. We return the ${res.length} combinations found.`, 5, { start: null, current: [], sum: 0, res: [...res], i: null, action: 'success', isSuccess: true });
    } else {
        addStep("Initialize Results List", `Line 3: List<List<Integer>> res = new ArrayList<>();\n\nCreate the master list.`, 3, { start: null, current: [], sum: 0, res: [], i: null, action: 'init' });
        addStep("Sort Array", `Line 5: Arrays.sort(candidates);\n\nCRITICAL OPTIMIZATION: We sort the array so we can stop exploring the moment a branch exceeds the target.`, 5, { start: null, current: [], sum: 0, res: [], i: null, action: 'sort' });
        addStep("Initiate Algorithm", `Line 6: backtrack(candidates, target, 0, new ArrayList<>(), 0, res);`, 6, { start: null, current: [], sum: 0, res: [], i: null, action: 'init' });
        backtrack(0, [], 0, 0);
        addStep("Algorithm Complete", `Line 7: return res;\n\nOptimized DFS is finished. Returning ${res.length} combinations.`, 7, { start: null, current: [], sum: 0, res: [...res], i: null, action: 'success', isSuccess: true });
    }

    if (steps.length === 0) {
        addStep("Init", "Start", 1, {});
    }

    return { steps, workingCandidates };
  }, [parsedData, selectedApproachId]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.steps.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedApproach.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace.steps[currentStep] || trace.steps[0] || { state: {} };
  const state = cur.state || {};
  const { isSuccess, start, current: currentComb, sum, res, i: activeI, action } = state;
  const { target } = parsedData;
  const arr = trace.workingCandidates;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <GitMerge className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Combination Sum</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 39</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Backtracking / Recursion</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action === 'deadEnd' || action === 'break' ? 'bg-rose-500/20 border-rose-500' : 'bg-violet-500/20 border-violet-500')}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'deadEnd' || action === 'break' ? 'rose' : 'violet'} />
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Call Variables</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="Target" val={target} color="purple" active={true} />
                        <VariableCard label="Curr Sum" val={sum !== null ? sum : "-"} color={sum === target ? "emerald" : (sum > target ? "rose" : "sky")} active={sum !== null} />
                        <VariableCard label="Start Idx" val={start !== null ? start : "-"} color="slate" active={start !== null} />
                        <VariableCard label="Loop (i)" val={activeI !== null ? activeI : "-"} arrVal={activeI !== null && activeI < arr.length ? arr[activeI] : null} color="violet" active={activeI !== null} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Candidates (distinct)</label>
                        <input type="text" value={candidatesInput} onChange={(e) => { setCandidatesInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="2, 3, 6, 7" />
                    </div>
                    
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Target</label>
                        <input type="number" value={targetInput} onChange={(e) => { setTargetInput(e.target.value); setCurrentStep(0); }} min="1" max="15" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner" placeholder="7" />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.steps.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-violet-100 hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action === 'deadEnd' || action === 'break' ? 'bg-rose-900 border-rose-800' : 'bg-slate-900 border-slate-800')}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : <GitMerge size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action === 'deadEnd' || action === 'break' ? 'text-rose-400' : 'text-violet-400')}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'deadEnd' || action === 'break' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30')}`}>Line {cur.line}</div>
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
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px]">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-4 pb-8 gap-8 overflow-y-auto">
                      
                      {/* Candidates Array Representation */}
                      <div className="flex flex-col items-center w-full max-w-full overflow-x-auto pb-4">
                          <div className="flex items-center justify-between w-full max-w-md px-2 mb-2">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono flex items-center gap-2"><ListPlus size={12}/> Candidates {selectedApproachId === 'optimizedBacktrack' ? '(Sorted)' : ''}</span>
                          </div>
                          <div className="flex gap-2 p-3 bg-slate-100 border border-slate-200 rounded-3xl shadow-inner mx-auto">
                              {arr.map((num, idx) => {
                                  let isCurrentI = activeI === idx;
                                  let isPastStart = start !== null && idx < start;
                                  
                                  let cls = "relative w-12 h-14 md:w-16 md:h-20 flex flex-col items-center justify-center rounded-xl border-2 font-mono font-black text-xl md:text-2xl transition-all duration-300 z-10 ";
                                  
                                  if (isCurrentI) {
                                      if (action === 'add' || action === 'recurse') cls += "bg-sky-100 border-sky-500 text-sky-800 scale-110 shadow-lg ring-4 ring-sky-300/50 z-20 animate-pulse";
                                      else if (action === 'remove') cls += "bg-amber-100 border-amber-500 text-amber-800 scale-105 shadow-md z-20";
                                      else cls += "bg-violet-100 border-violet-400 text-violet-900 scale-110 shadow-md z-20";
                                  } else if (isPastStart) {
                                      cls += "bg-slate-50 border-slate-200 text-slate-300 border-dashed scale-95";
                                  } else {
                                      cls += "bg-white border-slate-300 text-slate-700 shadow-sm";
                                  }

                                  return (
                                      <div key={idx} className="flex flex-col items-center relative">
                                          <div className={cls}>
                                              {num}
                                              <span className="absolute top-1 left-1.5 text-[8px] md:text-[10px] font-mono text-slate-400 font-normal">{idx}</span>
                                              
                                              {isCurrentI && action === 'remove' && (
                                                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-lg">
                                                      <Undo2 className="text-amber-600" size={28} strokeWidth={3} />
                                                  </div>
                                              )}
                                          </div>
                                          {isCurrentI && (
                                              <div className="absolute -bottom-8 flex flex-col items-center animate-in slide-in-from-top-1">
                                                  <ArrowUp size={14} className="text-violet-600" strokeWidth={3}/>
                                                  <span className="text-[10px] font-black font-mono tracking-widest text-violet-600 bg-violet-100 px-1.5 rounded shadow-sm border border-violet-200">i={idx}</span>
                                              </div>
                                          )}
                                          {start === idx && !isCurrentI && (
                                              <div className="absolute -bottom-6 text-[9px] font-black font-mono tracking-widest text-slate-400">start</div>
                                          )}
                                      </div>
                                  );
                              })}
                          </div>
                      </div>

                      {/* Current Combination and Sum Progress */}
                      {currentComb !== undefined && (
                          <div className="w-full max-w-lg flex flex-col items-center gap-4 mt-6">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono text-center flex items-center gap-1"><Layers size={14} /> Current Path</span>
                              
                              <div className="flex gap-2 items-center flex-wrap justify-center min-h-[48px] bg-slate-50 px-6 py-3 rounded-2xl border-2 border-dashed border-slate-300 w-full shadow-inner">
                                  {currentComb.length === 0 ? (
                                      <span className="text-slate-400 font-mono text-sm italic">Empty</span>
                                  ) : (
                                      currentComb.map((num, idx) => {
                                          let isLast = idx === currentComb.length - 1;
                                          let cls = "w-10 h-10 flex items-center justify-center rounded-lg border-2 font-mono font-black text-lg shadow-sm transition-all duration-300 ";
                                          
                                          if (isLast && action === 'add') cls += "bg-emerald-100 border-emerald-400 text-emerald-800 scale-110 animate-in zoom-in";
                                          else if (isLast && action === 'remove') cls += "bg-rose-100 border-rose-400 text-rose-800 scale-90 opacity-50";
                                          else cls += "bg-white border-slate-300 text-slate-700";

                                          return <div key={idx} className={cls}>{num}</div>;
                                      })
                                  )}
                              </div>

                              {/* Progress Bar for Sum */}
                              <div className="w-full mt-2">
                                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono mb-1.5">
                                      <span>Sum: {sum}</span>
                                      <span className={sum > target ? "text-rose-500" : "text-slate-500"}>Target: {target}</span>
                                  </div>
                                  <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden relative shadow-inner">
                                      {/* Target Marker Line if overshoot is possible */}
                                      <div className="absolute top-0 bottom-0 w-0.5 bg-slate-800 z-20" style={{ left: '100%' }}></div>
                                      
                                      <div 
                                          className={`h-full transition-all duration-500 z-10 relative ${sum === target ? 'bg-emerald-500' : (sum > target ? 'bg-rose-500' : 'bg-sky-500')}`} 
                                          style={{ width: `${Math.min(100, (sum / target) * 100)}%` }}
                                      >
                                          {sum > target && (
                                              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZjQzZjVlIiAvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxIiAvPgo8L3N2Zz4=')] opacity-30"></div>
                                          )}
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* Results List Collection */}
                      {res !== undefined && (
                          <div className="w-full flex flex-col items-center border-t border-slate-200 pt-6 mt-2">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono text-center mb-4 flex items-center gap-1"><Database size={14} /> Valid Combinations Found ({res.length})</span>
                              
                              <div className="flex flex-wrap gap-3 justify-center w-full max-h-[120px] overflow-y-auto scrollbar-thin p-2">
                                  {res.length === 0 ? (
                                      <span className="text-slate-300 font-mono text-sm italic">None yet...</span>
                                  ) : (
                                      res.map((comb, idx) => {
                                          let isLatest = idx === res.length - 1 && action === 'successBranch';
                                          return (
                                              <div key={idx} className={`px-3 py-1.5 rounded-lg border-2 font-mono font-bold text-sm transition-all duration-500 ${isLatest ? 'bg-emerald-100 border-emerald-400 text-emerald-800 scale-110 shadow-md animate-in zoom-in' : 'bg-white border-slate-200 text-slate-600 shadow-sm'}`}>
                                                  [{comb.join(', ')}]
                                              </div>
                                          );
                                      })
                                  )}
                              </div>
                          </div>
                      )}

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600`}>
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">SEARCH EXHAUSTED</span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Found {res.length} Unique Combinations
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
                <GitMerge className="text-violet-600"/> The Backtracking Tree
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Combination Sum is the quintessential Backtracking problem. You are tasked with exploring a massive decision tree of possibilities. At every step, you choose a number, add it to your path, and delve deeper into the tree. If the path fails, you undo your last choice and try a different branch.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ListPlus size={18}/> Infinite Reuse (Passing 'i')
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            Most combination problems don't allow reusing elements, so you normally pass <code>i + 1</code> into the recursive call to ensure you move strictly forward.
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            Here, we are explicitly allowed to reuse the same element. Therefore, when we make the recursive call, we pass <code>i</code> as the start index instead of <code>i + 1</code>.<br/><br/>
                            This allows the algorithm to pick <code>[2, 2, 2...]</code> endlessly until the target is reached or exceeded.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Undo2 size={18}/> Preventing Duplicates
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            If the target is 7 and candidates are [2, 3], how do we prevent getting both <code>[2, 2, 3]</code> and <code>[3, 2, 2]</code> in our final answer?
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>We enforce a strict ordering using the <code>start</code> parameter.</p>
                            <p>The <code>for</code> loop always begins at <code>start</code>, never at 0. This means once we decide to explore branches starting with <code>3</code>, we are mathematically forbidden from ever looking "backwards" to pick a <code>2</code>.</p>
                            <p>This naturally prevents identical sets with different permutations from forming.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Zap size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-emerald-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">The Sorting Optimization (Pruning)</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            Without sorting, the algorithm must blindly try every number and wait for the recursion base case <code>(sum &gt; target)</code> to kill the branch. 
                            <br/><br/>
                            If the target is 7, and we are at sum 6, trying to add a 5 is a waste of time. But trying to add a 6, 7, or 8 right after it is also a waste of time.
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-[10px] text-emerald-300">
                            // 1. Sort array: [2, 3, 6, 7]<br/><br/>
                            // 2. Inside loop:<br/>
                            if (sum + candidates[i] &gt; target) &#123;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;break; // Prune the entire rest of loop!<br/>
                            &#125;<br/><br/>
                            // Because it's sorted, if '3' makes us<br/>
                            // overshoot, '6' and '7' guaranteed will too.
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
                        "I solved this using Backtracking. I utilized a recursive DFS function that builds combinations element by element. To handle the constraint that elements can be reused indefinitely, I pass the current loop index `i` into the recursive call instead of `i + 1`. To ensure combinations are perfectly unique and avoid duplicate permutations, the `for` loop always iterates starting from the passed index, never looking backwards. Finally, to optimize the time complexity, I sorted the candidates array beforehand. This allowed me to add an early termination `break` condition: if adding the current candidate exceeds the target, I can safely abandon the rest of the loop, pruning massive branches off the execution tree."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Why create a new ArrayList?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                When a valid combination is found, we must do <code>res.add(new ArrayList&lt;&gt;(current))</code>. The <code>current</code> list is an object reference that gets constantly modified (elements added/removed) throughout the backtracking process. If you just did <code>res.add(current)</code>, your final results list would just contain 15 references to the exact same empty list at the end of the algorithm!
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(2^t)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Loosely bounded. Where $t$ is the target value. In the worst case (e.g., candidates=[1], target=10), the recursion tree height is $t$, branching constantly, leading to exponential possibilities.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(t)</span>
                                <p className="text-[10px] text-slate-500 mt-1">The space complexity is determined by the maximum depth of the recursive call stack. In the worst case scenario, the combination length (and thus stack depth) will be $target / min(candidates)$.</p>
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

interface VariableCardProps {
  label: string;
  val: any;
  arrVal?: any;
  color: string;
  active: boolean;
}

const VariableCard: React.FC<VariableCardProps> = ({ label, val, arrVal, color, active }) => {
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
             {active && arrVal !== undefined && arrVal !== null && (
                 <div className="absolute bottom-0 w-full text-center bg-black/5 text-[9px] font-black py-0.5 mt-2">
                     val: {arrVal}
                 </div>
             )}
        </div>
    );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
  theme?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|candidates|target|start|current|sum|res|backtrack|add|remove|size|sort)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math', 'Arrays', 'ArrayList', 'ListNode', 'TreeNode', 'Stack', 'StringBuilder'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['candidates', 'res'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['target', 'sum'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (['start', 'current'].includes(part)) return <span key={i} className="text-violet-400 font-bold">{part}</span>;
          if (['backtrack', 'add', 'remove', 'size', 'sort'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default CombinationSumVisualizer;