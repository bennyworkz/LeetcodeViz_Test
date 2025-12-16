import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, LayoutList, GitBranch, 
  ShieldAlert, ArrowRight, CornerUpLeft, PlusSquare, XSquare, MinusSquare,
  ListOrdered, Grid2X2
} from 'lucide-react';

const APPROACHES = {
  backtracking: {
    id: 'backtracking',
    title: '1. Backtracking (DFS)',
    subtitle: 'Optimal: O(2^N) Time, O(N) Space.',
    icon: <GitBranch size={16} />,
    complexity: 'Time: O(2^N) | Space: O(N)',
    code: `class Solution {
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        List<List<Integer>> result = new ArrayList<>();
        Arrays.sort(candidates);
        backtrack(result, new ArrayList<>(), candidates, target, 0);
        return result;
    }
    
    private void backtrack(List<List<Integer>> result, List<Integer> current, int[] candidates, int remain, int start) {
        if (remain == 0) {
            result.add(new ArrayList<>(current));
            return;
        }
        for (int i = start; i < candidates.length; i++) {
            // Pruning: Skip duplicates and early stopping
            if (i > start && candidates[i] == candidates[i - 1]) continue;
            if (candidates[i] > remain) break;
            
            current.add(candidates[i]);
            backtrack(result, current, candidates, remain - candidates[i], i + 1);
            current.remove(current.size() - 1);
        }
    }
}`,
    explanation: "This is the industry standard approach. We use Depth-First Search to explore combinations incrementally. We sort the array to group duplicates and enable early stopping. The key optimization is `if (i > start && candidates[i] == candidates[i-1]) continue;`, which ensures we don't start duplicate parallel branches. Because we use recursion, our auxiliary space is limited to the call stack, which is max O(N)."
  },
  bfs: {
    id: 'bfs',
    title: '2. Iterative (BFS Queue)',
    subtitle: 'High Memory: O(2^N) Space.',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(2^N) | Space: O(2^N)',
    code: `class Solution {
    class State {
        List<Integer> list; int remain; int start;
        State(List<Integer> l, int r, int s) { list = l; remain = r; start = s; }
    }

    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<List<Integer>> result = new ArrayList<>();
        Queue<State> queue = new LinkedList<>();
        queue.offer(new State(new ArrayList<>(), target, 0));
        
        while (!queue.isEmpty()) {
            State curr = queue.poll();
            if (curr.remain == 0) {
                result.add(curr.list);
                continue;
            }
            for (int i = curr.start; i < candidates.length; i++) {
                if (i > curr.start && candidates[i] == candidates[i - 1]) continue;
                if (candidates[i] > curr.remain) break;
                
                List<Integer> nextList = new ArrayList<>(curr.list);
                nextList.add(candidates[i]);
                queue.offer(new State(nextList, curr.remain - candidates[i], i + 1));
            }
        }
        return result;
    }
}`,
    explanation: "Instead of going deep (DFS), we can go level-by-level using Breadth-First Search (BFS). We maintain a Queue of `State` objects, where each state holds the current combination built so far, the remaining target, and the next starting index. We apply the exact same duplicate pruning logic. Why is this worse? A queue stores ALL intermediate combinations for a given level in memory simultaneously. If there are 1,000 branches at depth 5, all 1,000 lists are sitting in RAM. DFS only stores 1 list at a time."
  },
  dp: {
    id: 'dp',
    title: '3. Dynamic Programming',
    subtitle: 'Causes MLE on LeetCode.',
    icon: <Grid2X2 size={16} />,
    complexity: 'Time: O(N * Target) | Space: O(Target * 2^N)',
    code: `class Solution {
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        Arrays.sort(candidates);
        
        // dp[i] stores a set of valid combinations that sum to i
        Set<List<Integer>>[] dp = new HashSet[target + 1];
        for (int i = 0; i <= target; i++) dp[i] = new HashSet<>();
        dp[0].add(new ArrayList<>()); // Base case
        
        for (int cand : candidates) {
            if (cand > target) break;
            
            // Traverse backwards to prevent reusing the same element
            for (int i = target; i >= cand; i--) {
                for (List<Integer> combo : dp[i - cand]) {
                    List<Integer> newCombo = new ArrayList<>(combo);
                    newCombo.add(cand);
                    dp[i].add(newCombo);
                }
            }
        }
        return new ArrayList<>(dp[target]);
    }
}`,
    explanation: "You can solve this using 1D DP (similar to Subset Sum / 0-1 Knapsack). We create an array `dp` where `dp[i]` holds a Hash Set of all unique combinations that sum up to `i`. We iterate through every candidate, and for every possible target sum, we append the candidate to the previous combinations. We iterate backwards to ensure each candidate is only used once. Why is this bad? DP is meant for counting combinations, not storing them. Holding thousands of heavy `ArrayList` objects inside `HashSet`s inside an array will instantly cause a Memory Limit Exceeded (MLE) error."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">40. Combination Sum II</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given a collection of candidate numbers (<code>candidates</code>) and a target number (<code>target</code>), find all unique combinations in <code>candidates</code> where the candidate numbers sum to <code>target</code>.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-rose-500 pl-4 bg-rose-50 py-2 mt-4">
          Each number in <code>candidates</code> may only be used <strong>once</strong> in the combination.
          <br/><br/>
          <span className="text-sm font-normal text-rose-700"><strong>Note:</strong> The solution set must not contain duplicate combinations.</span>
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> candidates = [10,1,2,7,6,1,5], target = 8</p>
              <p><span className="text-slate-400 font-bold">Output:</span> <br/>[<br/>&nbsp;&nbsp;[1,1,6],<br/>&nbsp;&nbsp;[1,2,5],<br/>&nbsp;&nbsp;[1,7],<br/>&nbsp;&nbsp;[2,6]<br/>]</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> candidates = [2,5,2,1,2], target = 5</p>
              <p><span className="text-slate-400 font-bold">Output:</span> <br/>[<br/>&nbsp;&nbsp;[1,2,2],<br/>&nbsp;&nbsp;[5]<br/>]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CombinationSumIIVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('backtracking');
  const [candidatesInput, setCandidatesInput] = useState('10,1,2,7,6,1,5');
  const [targetInput, setTargetInput] = useState('8');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let arr = candidatesInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    let t = parseInt(targetInput.trim(), 10);
    
    if (isNaN(t)) t = 8;
    if (arr.length === 0) arr = [10,1,2,7,6,1,5];
    
    arr.sort((a, b) => a - b);
    
    if (arr.length > 8) arr = arr.slice(0, 8); // UI cap

    return { candidates: arr, target: t };
  }, [candidatesInput, targetInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { candidates, target } = parsedData;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2500) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'backtracking') {
        let result = [];
        let current = [];

        addStep("Initialization", `Arrays.sort(candidates); backtrack(...);\n\nSorted: [${candidates.join(',')}]. Target: ${target}.`, 8, { candidates, current: [...current], result: [...result], start: 0, i: null, remain: target, action: 'init', depth: 0 });

        const backtrack = (remain, start, depth) => {
            if (steps.length > 2500) return;

            addStep(`Evaluate Base Case (Depth ${depth})`, `if (remain == 0)\n\nTarget remaining: ${remain}.`, 12, { candidates, current: [...current], result: [...result], start, i: null, remain, action: 'evalBase', depth });

            if (remain === 0) {
                result.push([...current]);
                addStep(`Target Reached!`, `result.add(new ArrayList<>(current));\n\nValid combination found!`, 14, { candidates, current: [...current], result: [...result], start, i: null, remain, action: 'record', depth });
                return;
            }

            for (let i = start; i < candidates.length; i++) {
                if (steps.length > 2500) break;
                
                addStep(`Iterate Next Elements`, `for (int i = ${i}; i < candidates.length; i++)`, 18, { candidates, current: [...current], result: [...result], start, i, remain, action: 'loop', depth });

                let isDuplicate = i > start && candidates[i] === candidates[i - 1];
                if (isDuplicate) {
                    addStep(`Skip Duplicate Branch`, `if (i > start && candidates[i] == candidates[i - 1]) continue;\n\nCandidate ${candidates[i]} is a duplicate. Skipping.`, 21, { candidates, current: [...current], result: [...result], start, i, remain, action: 'skip', depth, isDuplicate });
                    continue;
                }

                let exceedsLimit = candidates[i] > remain;
                if (exceedsLimit) {
                    addStep(`Early Pruning (Break)`, `if (candidates[i] > remain) break;\n\nCandidate ${candidates[i]} exceeds remain ${remain}. Since sorted, all next elements fail too. Breaking loop.`, 27, { candidates, current: [...current], result: [...result], start, i, remain, action: 'breakLimit', depth, exceedsLimit });
                    break;
                }

                current.push(candidates[i]);
                addStep(`Choose Element`, `current.add(candidates[i]);`, 30, { candidates, current: [...current], result: [...result], start, i, remain, action: 'choose', depth });

                addStep(`Explore Forward`, `backtrack(..., remain - candidates[i], i + 1);`, 33, { candidates, current: [...current], result: [...result], start, i, remain, action: 'recurse', depth });

                backtrack(remain - candidates[i], i + 1, depth + 1);

                let popped = current.pop();
                addStep(`Backtrack (Un-choose)`, `current.remove(current.size() - 1);`, 36, { candidates, current: [...current], result: [...result], start, i, remain, action: 'backtrack', depth, popped });
            }

            if (depth > 0) {
                addStep(`Return to Parent`, `Loop finished at Depth ${depth}. Returning.`, 37, { candidates, current: [...current], result: [...result], start, i: null, remain, action: 'return', depth });
            }
        };

        backtrack(target, 0, 0);
        addStep("Algorithm Complete", `return result;\n\nFound ${result.length} unique combinations.`, 10, { candidates, current: [], result: [...result], start: null, i: null, remain: target, action: 'success', isSuccess: true, ans: result.length, depth: 0 });

    } else if (selectedApproachId === 'bfs') {
        
        let result = [];
        let queue = [{ list: [], remain: target, start: 0 }];
        
        addStep("Init Queue", `Queue<State> queue = new LinkedList<>();\nqueue.offer(new State([], ${target}, 0));`, 10, { candidates, queue: [...queue], result: [...result], currState: null, action: 'init' });

        let iter = 0;
        while (queue.length > 0) {
            if (iter++ > 150) break; // prevent infinite loops
            if (steps.length > 2500) break;

            let curr = queue.shift();
            addStep("Poll State", `State curr = queue.poll();\n\nPopped State: [${curr.list.join(',')}], remain: ${curr.remain}, start: ${curr.start}`, 13, { candidates, queue: [...queue], result: [...result], currState: curr, action: 'poll' });

            if (curr.remain === 0) {
                result.push(curr.list);
                addStep("Target Reached", `if (curr.remain == 0) result.add(curr.list);\n\nValid combination added to results.`, 15, { candidates, queue: [...queue], result: [...result], currState: curr, action: 'record' });
                continue;
            }

            for (let i = curr.start; i < candidates.length; i++) {
                let isDuplicate = i > curr.start && candidates[i] === candidates[i - 1];
                let exceedsLimit = candidates[i] > curr.remain;

                addStep("Evaluate Next Candidate", `Looping i = ${i}, candidate = ${candidates[i]}`, 18, { candidates, queue: [...queue], result: [...result], currState: curr, i, action: 'loop' });

                if (isDuplicate) {
                    addStep("Skip Duplicate", `if (i > curr.start && candidates[i] == candidates[i - 1]) continue;`, 19, { candidates, queue: [...queue], result: [...result], currState: curr, i, action: 'skip' });
                    continue;
                }
                if (exceedsLimit) {
                    addStep("Early Pruning", `if (candidates[i] > curr.remain) break;`, 20, { candidates, queue: [...queue], result: [...result], currState: curr, i, action: 'breakLimit' });
                    break;
                }

                let nextList = [...curr.list, candidates[i]];
                let nextState = { list: nextList, remain: curr.remain - candidates[i], start: i + 1 };
                queue.push(nextState);
                
                addStep("Push New State", `queue.offer(new State(nextList, remain - c, i + 1));\n\nPushed: [${nextList.join(',')}], remain: ${nextState.remain}`, 24, { candidates, queue: [...queue], result: [...result], currState: curr, i, action: 'pushQueue', nextState });
            }
        }
        
        addStep("Algorithm Complete", `return result;\n\nQueue empty. Found ${result.length} combinations.`, 27, { candidates, queue: [], result: [...result], currState: null, action: 'success', isSuccess: true, ans: result.length });

    } else if (selectedApproachId === 'dp') {
        
        let dp = Array.from({length: target + 1}, () => []);
        dp[0].push([]);

        addStep("Init DP Array", `Set<List<Integer>>[] dp = new HashSet[${target + 1}];\ndp[0].add(new ArrayList<>());`, 7, { candidates, dp: dp.map(a => [...a]), result: null, action: 'init' });

        for (let cIdx = 0; cIdx < candidates.length; cIdx++) {
            if (steps.length > 2500) break;
            let cand = candidates[cIdx];
            
            addStep("Process Candidate", `for (int cand : candidates)\n\ncand = ${cand}`, 9, { candidates, dp: dp.map(a => [...a]), cIdx, cand, action: 'loopCand' });

            if (cand > target) {
                addStep("Prune Candidate", `if (cand > target) break;`, 10, { candidates, dp: dp.map(a => [...a]), cIdx, cand, action: 'breakLimit' });
                break;
            }

            for (let i = target; i >= cand; i--) {
                addStep("Traverse DP Backwards", `for (int i = target; i >= cand; i--)\n\ni = ${i}. Checking dp[i - cand] -> dp[${i - cand}].`, 13, { candidates, dp: dp.map(a => [...a]), cIdx, cand, i, action: 'loopDP' });

                let prevCombos = dp[i - cand];
                if (prevCombos.length === 0) continue;

                for (let combo of prevCombos) {
                    let newCombo = [...combo, cand];
                    let comboStr = newCombo.join(',');
                    
                    // Simulate HashSet duplicate filtering natively
                    let isDup = dp[i].some(c => c.join(',') === comboStr);
                    
                    if (!isDup) {
                        dp[i].push(newCombo);
                        addStep("Merge and Store", `dp[i].add(newCombo);\n\nAppended ${cand} to [${combo.join(',')}]. Stored in dp[${i}].`, 16, { candidates, dp: dp.map(a => [...a]), cIdx, cand, i, combo: newCombo, action: 'dpStore' });
                    }
                }
            }
        }

        addStep("Algorithm Complete", `return new ArrayList<>(dp[target]);\n\nFound ${dp[target].length} combinations at dp[target].`, 21, { candidates, dp: dp.map(a => [...a]), result: dp[target], action: 'success', isSuccess: true, ans: dp[target].length });
    }

    if (steps.length === 0) {
        addStep("Init", "Start", 1, {});
    }

    return steps;
  }, [parsedData, selectedApproachId]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedApproach.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0] || { state: {} };
  const state = cur.state || {};
  const { isSuccess, ans, action, candidates, current, result, start: currStart, i: currI, remain, depth, popped, queue, currState, nextState, dp, cIdx, cand, i: dpIdx, combo } = state;
  const target = parsedData.target;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <GitBranch className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Combination Sum II</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 40</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Arrays / Backtracking / DP</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action === 'skip' || action === 'breakLimit' ? 'bg-rose-500/20 border-rose-500' : (action === 'choose' || action === 'record' || action === 'dpStore' ? 'bg-emerald-500/20 border-emerald-500' : (action === 'backtrack' || action === 'return' ? 'bg-amber-500/20 border-amber-500' : 'bg-violet-500/20 border-violet-500')))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'skip' || action === 'breakLimit' ? 'rose' : (action === 'choose' || action === 'record' || action === 'dpStore' ? 'emerald' : (action === 'backtrack' || action === 'return' ? 'amber' : 'violet'))} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Execution State</h4>
                      </div>
                    </div>
                    
                    {selectedApproachId === 'backtracking' && (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <VariableCard label="Target Remain" val={remain !== null && remain !== undefined ? remain : "-"} color={remain === 0 ? "emerald" : "sky"} active={remain !== null && remain !== undefined} />
                            <VariableCard label="Depth" val={depth !== null && depth !== undefined ? depth : "-"} color="slate" active={depth !== null && depth !== undefined} />
                            <VariableCard label="Start Idx" val={currStart !== null && currStart !== undefined ? currStart : "-"} color="amber" active={currStart !== null && currStart !== undefined} />
                            <VariableCard label="Iter (i)" val={currI !== null && currI !== undefined ? currI : "-"} color="purple" active={currI !== null && currI !== undefined} />
                        </div>
                    )}
                    {selectedApproachId === 'bfs' && (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            <VariableCard label="Queue Size" val={queue ? queue.length : "-"} color="sky" active={queue !== undefined} />
                            <VariableCard label="Curr Remain" val={currState ? currState.remain : "-"} color="amber" active={currState !== null} />
                            <VariableCard label="Iter (i)" val={currI !== null && currI !== undefined ? currI : "-"} color="purple" active={currI !== null && currI !== undefined} />
                        </div>
                    )}
                    {selectedApproachId === 'dp' && (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            <VariableCard label="Candidate" val={cand !== null && cand !== undefined ? cand : "-"} color="sky" active={cand !== null && cand !== undefined} />
                            <VariableCard label="Target (i)" val={dpIdx !== null && dpIdx !== undefined ? dpIdx : "-"} color="amber" active={dpIdx !== null && dpIdx !== undefined} />
                            <VariableCard label="DP Check" val={dpIdx !== undefined && cand !== undefined ? `dp[${dpIdx - cand}]` : "-"} color="purple" active={dpIdx !== undefined && cand !== undefined} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Candidates (nums)</label>
                        <input type="text" value={candidatesInput} onChange={(e) => { setCandidatesInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-widest font-bold text-slate-700" placeholder="10,1,2,7,6,1,5" />
                    </div>
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Target</label>
                        <input type="number" value={targetInput} onChange={(e) => { setTargetInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-widest font-bold text-slate-700" placeholder="8" />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto pb-5">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-violet-100 hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action === 'skip' || action === 'breakLimit' ? 'bg-rose-900 border-rose-800' : (action === 'choose' || action === 'record' || action === 'dpStore' ? 'bg-emerald-900 border-emerald-800' : (action === 'backtrack' || action === 'return' ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800')))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess || action === 'record' || action === 'dpStore' ? <Check size={100}/> : (action === 'skip' || action === 'breakLimit' ? <XSquare size={100}/> : (action === 'choose' ? <PlusSquare size={100}/> : (action === 'backtrack' ? <CornerUpLeft size={100}/> : <GitBranch size={100}/>)))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action === 'skip' || action === 'breakLimit' ? 'text-rose-400' : (action === 'choose' || action === 'record' || action === 'dpStore' ? 'text-emerald-400' : (action === 'backtrack' || action === 'return' ? 'text-amber-400' : 'text-violet-400')))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'skip' || action === 'breakLimit' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : (action === 'choose' || action === 'record' || action === 'dpStore' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'backtrack' || action === 'return' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30')))}`}>Line {cur.line}</div>
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
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-center justify-start">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-4 pb-12 gap-8 overflow-y-auto overflow-x-hidden">
                      
                      {/* Array Visualization (Shared) */}
                      {candidates && (
                          <div className="flex flex-col items-center w-full max-w-full">
                              
                              <div className="flex gap-2 p-6 bg-slate-50 border border-slate-200 min-w-max mx-auto overflow-x-auto mt-4 shadow-sm rounded-3xl">
                                  {candidates.map((val, idx) => {
                                      let isCurrentI = false, isCurrentStart = false, isSkipArea = false, isDPActive = false;

                                      if (selectedApproachId === 'backtracking' || selectedApproachId === 'bfs') {
                                          let baseStart = selectedApproachId === 'bfs' && currState ? currState.start : currStart;
                                          isCurrentI = currI === idx && !isSuccess;
                                          isCurrentStart = baseStart === idx && !isSuccess;
                                          isSkipArea = idx >= baseStart && idx < currI && !isSuccess;
                                      } else if (selectedApproachId === 'dp') {
                                          isDPActive = cIdx === idx && !isSuccess;
                                          isSkipArea = idx < cIdx;
                                      }

                                      let boxClass = "relative w-12 h-14 md:w-14 md:h-16 flex items-center justify-center rounded-xl border-4 font-mono font-black text-xl md:text-2xl transition-all duration-300 shrink-0 ";
                                      let textClass = "text-slate-700";

                                      if (isSuccess) {
                                          boxClass += "bg-white border-slate-200 opacity-50";
                                          textClass = "text-slate-400";
                                      } else if (isCurrentI || isDPActive) {
                                          if (action === 'skip' || action === 'breakLimit') {
                                              boxClass += "bg-rose-100 border-rose-500 scale-110 shadow-lg ring-4 ring-rose-300/30 z-20";
                                              textClass = "text-rose-900 line-through opacity-60";
                                          } else if (action === 'choose' || action === 'dpStore') {
                                              boxClass += "bg-emerald-100 border-emerald-500 scale-110 shadow-lg ring-4 ring-emerald-300/30 z-20";
                                              textClass = "text-emerald-900";
                                          } else {
                                              boxClass += "bg-purple-100 border-purple-500 scale-110 shadow-lg ring-4 ring-purple-300/30 z-20";
                                              textClass = "text-purple-900";
                                          }
                                      } else if (isSkipArea) {
                                          boxClass += "bg-slate-200 border-slate-400 shadow-inner z-10 opacity-70";
                                          textClass = "text-slate-500";
                                      } else {
                                          boxClass += "bg-white border-slate-300 shadow-sm";
                                      }

                                      return (
                                          <div key={`cell-${idx}`} className="flex flex-col items-center relative group">
                                              
                                              {/* Top Pointer */}
                                              <div className="absolute -top-12 flex flex-col items-center justify-end h-10 w-full z-40">
                                                  {isCurrentStart && (
                                                      <div className={`flex flex-col items-center animate-in slide-in-from-top-2`}>
                                                          <span className="text-[10px] font-black font-mono tracking-widest text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 shadow-sm mb-1">start</span>
                                                          <ArrowDown size={20} className="text-amber-500" strokeWidth={3}/>
                                                      </div>
                                                  )}
                                                  {isDPActive && (
                                                      <div className={`flex flex-col items-center animate-in slide-in-from-top-2`}>
                                                          <span className="text-[10px] font-black font-mono tracking-widest text-sky-800 bg-sky-100 px-2 py-0.5 rounded border border-sky-300 shadow-sm mb-1">cand</span>
                                                          <ArrowDown size={20} className="text-sky-500" strokeWidth={3}/>
                                                      </div>
                                                  )}
                                              </div>

                                              <div className={boxClass}>
                                                  <span className={textClass}>{val}</span>
                                              </div>
                                              
                                              {/* Bottom Pointer */}
                                              <div className="absolute -bottom-10 flex flex-col items-center h-8 w-full z-30">
                                                  {isCurrentI && (
                                                      <div className={`flex flex-col items-center animate-in slide-in-from-bottom-2`}>
                                                          <ArrowUp size={20} className={action === 'skip' || action === 'breakLimit' ? 'text-rose-500' : 'text-purple-500'} strokeWidth={3}/>
                                                          <span className={`text-[10px] font-black font-mono tracking-widest px-2 py-0.5 rounded border shadow-sm mt-1 ${action === 'skip' || action === 'breakLimit' ? 'text-rose-800 bg-rose-100 border-rose-300' : 'text-purple-800 bg-purple-100 border-purple-300'}`}>i</span>
                                                      </div>
                                                  )}
                                              </div>
                                          </div>
                                      );
                                  })}
                                  {candidates.length === 0 && <span className="text-slate-400 italic font-mono text-sm px-4">Empty Array</span>}
                              </div>
                          </div>
                      )}

                      {/* DFS Specific UI */}
                      {selectedApproachId === 'backtracking' && (
                          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                              <div className={`bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center relative overflow-hidden min-h-[140px] transition-colors duration-500 ${action === 'record' ? 'ring-4 ring-emerald-300/30 border-emerald-400 bg-emerald-50' : ''}`}>
                                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-4 flex items-center gap-2"><Target size={14}/> Current Comb (current)</span>
                                  <div className="flex items-center gap-2 font-mono font-black text-2xl flex-wrap justify-center min-h-[40px]">
                                      <span className="text-slate-300">[</span>
                                      {current && current.map((val, idx) => (
                                          <React.Fragment key={`curr-${idx}`}>
                                              <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 shadow-sm animate-in zoom-in">{val}</span>
                                              {idx < current.length - 1 && <span className="text-slate-300">,</span>}
                                          </React.Fragment>
                                      ))}
                                      <span className="text-slate-300">]</span>

                                      {action === 'backtrack' && popped !== undefined && (
                                           <span className="text-rose-400 bg-rose-50 px-2 py-1 rounded-lg border border-dashed border-rose-300 animate-out fade-out slide-out-to-right-4 duration-700 absolute right-8">
                                              <MinusSquare size={16} className="inline mr-1"/>{popped}
                                           </span>
                                      )}
                                  </div>
                                  {!isSuccess && current !== undefined && (
                                      <div className="absolute bottom-3 right-4 flex items-center gap-1 text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                          Sum: <span className="text-sky-600 text-sm ml-1">{current.reduce((a, b) => a + b, 0)}</span> / {target}
                                      </div>
                                  )}
                              </div>

                              <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden min-h-[140px]">
                                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-4 flex items-center justify-between w-full">
                                      <div className="flex items-center gap-2"><LayoutList size={14}/> Result Set (result)</div>
                                      <span className="bg-violet-100 text-violet-700 px-2 py-0.5 rounded shadow-sm">Count: {result ? result.length : 0}</span>
                                  </span>
                                  <div className="flex items-center gap-2 font-mono font-bold text-sm flex-wrap overflow-y-auto max-h-[200px] content-start">
                                      {result && result.map((sub, idx) => {
                                          let isLastAdded = action === 'record' && idx === result.length - 1;
                                          return (
                                              <div key={`res-${idx}`} className={`px-2 py-1 rounded-lg border shadow-sm transition-all duration-500 ${isLastAdded ? 'bg-violet-600 text-white border-violet-700 scale-110 z-10 animate-in zoom-in' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                                  [{sub.join(',')}]
                                              </div>
                                          );
                                      })}
                                      {(!result || result.length === 0) && <span className="text-slate-300 italic">Empty</span>}
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* BFS Specific UI */}
                      {selectedApproachId === 'bfs' && (
                           <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                              <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col items-center relative overflow-hidden min-h-[160px]">
                                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-4 flex items-center gap-2"><ListOrdered size={14}/> BFS State Queue</span>
                                  
                                  {currState && action !== 'init' && (
                                       <div className="absolute top-4 right-4 bg-sky-900 text-sky-300 border border-sky-700 px-3 py-1 rounded-lg text-xs font-mono font-bold animate-in slide-in-from-top flex items-center gap-2">
                                           <span>Active:</span>
                                           <span className="text-white">[{currState.list.join(',')}]</span>
                                           <span>r: {currState.remain}</span>
                                       </div>
                                  )}

                                  <div className="flex gap-2 font-mono font-bold text-xs overflow-x-auto w-full pb-2 snap-x snap-mandatory mt-6">
                                      {queue && queue.map((st, idx) => {
                                          return (
                                              <div key={`q-${idx}`} className={`flex flex-col min-w-[120px] bg-slate-800 border border-slate-600 rounded-xl p-3 snap-center shadow-md`}>
                                                  <span className="text-slate-400 text-[10px] mb-1">List: <span className="text-emerald-400">[{st.list.join(',')}]</span></span>
                                                  <span className="text-slate-400 text-[10px] mb-1">Remain: <span className="text-amber-400">{st.remain}</span></span>
                                                  <span className="text-slate-400 text-[10px]">Start: <span className="text-sky-400">{st.start}</span></span>
                                              </div>
                                          );
                                      })}
                                      {(!queue || queue.length === 0) && <span className="text-slate-500 italic mt-4 mx-auto">Queue Empty</span>}
                                  </div>
                                  
                                  {action === 'pushQueue' && nextState && (
                                      <span className="text-emerald-400 text-xs font-bold font-mono absolute bottom-4 animate-in slide-in-from-bottom fade-in duration-500">+ Enqueued [{nextState.list.join(',')}]</span>
                                  )}
                              </div>

                              <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden min-h-[140px]">
                                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-4 flex items-center justify-between w-full">
                                      <div className="flex items-center gap-2"><LayoutList size={14}/> Result Set</div>
                                      <span className="bg-violet-100 text-violet-700 px-2 py-0.5 rounded shadow-sm">Count: {result ? result.length : 0}</span>
                                  </span>
                                  <div className="flex items-center gap-2 font-mono font-bold text-sm flex-wrap overflow-y-auto max-h-[200px] content-start">
                                      {result && result.map((sub, idx) => {
                                          let isLastAdded = action === 'record' && idx === result.length - 1;
                                          return (
                                              <div key={`res-${idx}`} className={`px-2 py-1 rounded-lg border shadow-sm transition-all duration-500 ${isLastAdded ? 'bg-violet-600 text-white border-violet-700 scale-110 z-10 animate-in zoom-in' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                                  [{sub.join(',')}]
                                              </div>
                                          );
                                      })}
                                      {(!result || result.length === 0) && <span className="text-slate-300 italic">Empty</span>}
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* DP Specific UI */}
                      {selectedApproachId === 'dp' && dp && (
                           <div className="w-full flex flex-col items-center mt-4">
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-2 flex items-center justify-between w-full max-w-lg">
                                    <div className="flex items-center gap-2"><Grid2X2 size={14}/> DP Array of Sets (dp[0...target])</div>
                                </span>
                                
                                <div className="flex flex-col gap-2 w-full max-w-lg">
                                    {dp.map((setList, idx) => {
                                        let isCurrentWrite = dpIdx === idx && action === 'dpStore';
                                        let isCurrentRead = cand !== undefined && dpIdx !== undefined && idx === dpIdx - cand && action.includes('dpStore');
                                        
                                        let rowClass = "flex items-center p-3 rounded-xl border-2 transition-all duration-300 min-h-[60px] ";
                                        if (isCurrentWrite) rowClass += "bg-emerald-50 border-emerald-400 shadow-md scale-[1.02] z-20";
                                        else if (isCurrentRead) rowClass += "bg-purple-50 border-purple-400 shadow-sm z-10";
                                        else rowClass += "bg-white border-slate-200";

                                        return (
                                            <div key={`dp-row-${idx}`} className={rowClass}>
                                                <div className="w-16 shrink-0 font-mono font-black text-sm text-slate-400 border-r-2 border-slate-100 mr-3 flex flex-col">
                                                    <span>dp[{idx}]</span>
                                                    {isCurrentWrite && <span className="text-[8px] text-emerald-500 uppercase tracking-widest">Write</span>}
                                                    {isCurrentRead && <span className="text-[8px] text-purple-500 uppercase tracking-widest">Read</span>}
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {setList.map((cList, cListIdx) => {
                                                        let isNew = isCurrentWrite && cListIdx === setList.length - 1;
                                                        return (
                                                            <div key={`c-${cListIdx}`} className={`px-2 py-1 rounded bg-slate-100 border font-mono text-xs font-bold ${isNew ? 'border-emerald-500 text-emerald-700 bg-emerald-100 animate-in zoom-in' : 'border-slate-300 text-slate-600'}`}>
                                                                [{cList.join(',')}]
                                                            </div>
                                                        )
                                                    })}
                                                    {setList.length === 0 && <span className="text-slate-300 text-xs italic">Empty Set</span>}
                                                </div>
                                            </div>
                                        )
                                    })}
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
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">EXECUTION COMPLETE</span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Generated {ans} Unique Combinations
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
                <GitBranch className="text-violet-600"/> Exploring Algorithms
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Why is Backtracking (DFS) the industry standard for this problem, while BFS and Dynamic Programming fail? The answer lies in the subtle difference between <strong>Counting</strong> combinations and <strong>Constructing</strong> combinations.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ListOrdered size={18}/> Why BFS uses too much memory
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            BFS explores the tree level by level. At depth 1, it stores all combinations of length 1. At depth 5, it stores all combinations of length 5 simultaneously!
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-2">
                            <p>If a tree branches out aggressively, the width of the bottom levels becomes massive ($O(2^N)$).</p>
                            <p>Storing millions of <code>ArrayList</code> objects in a queue at the same time causes heavy RAM spikes. DFS only stores ONE list at a time and backtracks!</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Grid2X2 size={18}/> Why DP causes MLE
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            DP is amazing for Knapsack problems when you need to return an <code>int</code> (the total count). But here, we must return actual Lists.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>In DP, <code>dp[i]</code> stores ALL valid lists summing to <code>i</code>.</p>
                            <p>If target is 30, <code>dp[29]</code> might hold 10,000 partial lists. <code>dp[28]</code> holds 8,000 lists. None of these might even be used to successfully reach 30, but they are permanently stored in memory regardless!</p>
                            <p>This strictly leads to Memory Limit Exceeded (MLE) on LeetCode.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Target size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-emerald-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">The DFS Optimization Trick</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            DFS survives because of two highly aggressive pruning techniques made possible entirely by sorting the array first.
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-[10px] text-emerald-300 space-y-2">
                            <p className="text-rose-400">// Pruning 1: Horizontal Duplicates</p>
                            <p>if (i &gt; start &amp;&amp; candidates[i] == candidates[i-1]) continue;</p>
                            <br/>
                            <p className="text-rose-400">// Pruning 2: Early Limit Stop</p>
                            <p>if (candidates[i] &gt; remain) break;</p>
                            <p className="text-white">// We BREAK instead of CONTINUE because the array is sorted!</p>
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
                        "While there are multiple ways to frame this problem, Backtracking (DFS) is the undisputed optimal approach. A DP tabular approach or a BFS Queue approach would both require storing intermediate, incomplete combinations in memory simultaneously, pushing the Space Complexity to an unacceptable $O(2^N)$, leading to Memory Limits. By utilizing DFS, we only maintain a single `current` list that grows and shrinks as we traverse the call stack, achieving an optimal $O(N)$ Space. To manage Time Complexity, I sort the array upfront. This allows me to aggressively prune the decision tree by skipping duplicate elements horizontally at the same depth (`i &gt; start &amp;&amp; candidates[i] == candidates[i-1]`) and by halting the iteration entirely the moment a candidate exceeds the remaining target."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Can we use a HashSet instead?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Yes, you could use a <code>Set&lt;List&lt;Integer&gt;&gt;</code> to automatically discard duplicate combinations. However, this is heavily frowned upon in interviews. Hashing entire lists is computationally expensive ($O(L)$ time per insertion). The sorting and pruning method prevents duplicates from being generated in the first place, saving significant execution time and memory.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(2<sup>N</sup>)</span>
                                <p className="text-[10px] text-slate-500 mt-1">In the worst case (e.g., all identical 1s and a huge target), we explore a binary decision tree of depth $N$. Sorting takes $O(N \log N)$, which is absorbed by the exponential term.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Ignoring the space required for the output list, the auxiliary space for DFS is strictly bounded by the maximum recursion call stack depth and the `current` list size, both of which are $O(N)$.</p>
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|combinationSum2|candidates|target|result|sort|backtrack|current|start|remain|length|add|remove|size|Queue|LinkedList|offer|poll|isEmpty|State)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math', 'Arrays', 'ArrayList', 'ListNode', 'TreeNode', 'Stack', 'StringBuilder', 'Queue', 'LinkedList', 'State'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['combinationSum2', 'length', 'size', 'add', 'remove', 'offer', 'poll', 'isEmpty'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['candidates', 'result', 'current'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['start', 'remain', 'target', 'backtrack', 'sort'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default CombinationSumIIVisualizer;