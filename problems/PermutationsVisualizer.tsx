import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, Shuffle, GitMerge, ArrowLeftRight, Undo2, Database
} from 'lucide-react';

const APPROACHES = {
  visitedArray: {
    id: 'visitedArray',
    title: '1. Visited Array',
    subtitle: 'Classic Backtracking. O(N × N!) Time.',
    icon: <GitMerge size={16} />,
    complexity: 'Time: O(N × N!) | Space: O(N)',
    code: `class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        boolean[] visited = new boolean[nums.length];
        backtrack(res, new ArrayList<>(), nums, visited);
        return res;
    }

    private void backtrack(List<List<Integer>> res, List<Integer> curr, int[] nums, boolean[] visited) {
        // Base case: If current permutation length equals nums length, we have a full permutation
        if (curr.size() == nums.length) {
            res.add(new ArrayList<>(curr));
            return;
        }

        // Iterate through all possible candidates
        for (int i = 0; i < nums.length; i++) {
            // Skip candidates that are already in the current permutation
            if (visited[i]) continue;

            // 1. Make a choice
            visited[i] = true;
            curr.add(nums[i]);

            // 2. Explore further
            backtrack(res, curr, nums, visited);

            // 3. Undo the choice (Backtrack)
            curr.remove(curr.size() - 1);
            visited[i] = false;
        }
    }
}`,
    explanation: "This is the most intuitive backtracking approach. We build permutations from scratch in a temporary list called `curr`. At each step, we iterate through the entire `nums` array. To ensure we don't use the same number twice in a single permutation, we maintain a boolean `visited` array. If an element is already marked `true`, we skip it. Otherwise, we mark it as `true`, add it to our current combination, and recursively build the rest of the permutation. When the recursion returns, we 'backtrack' by removing the last element and un-marking it in the `visited` array so it can be used in other permutations."
  },
  swapping: {
    id: 'swapping',
    title: '2. In-Place Swapping',
    subtitle: 'Space Optimized. O(N × N!) Time.',
    icon: <ArrowLeftRight size={16} />,
    complexity: 'Time: O(N × N!) | Space: O(N)',
    code: `class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(res, nums, 0);
        return res;
    }

    private void backtrack(List<List<Integer>> res, int[] nums, int start) {
        // Base case: If start reaches the end of the array, the current arrangement is a permutation
        if (start == nums.length) {
            List<Integer> currentPermutation = new ArrayList<>();
            for (int num : nums) currentPermutation.add(num);
            res.add(currentPermutation);
            return;
        }

        for (int i = start; i < nums.length; i++) {
            // 1. Make a choice (Swap element at 'i' with 'start')
            swap(nums, start, i);

            // 2. Explore further (Lock in the 'start' index and move to the next)
            backtrack(res, nums, start + 1);

            // 3. Undo the choice (Backtrack by swapping back)
            swap(nums, start, i);
        }
    }

    private void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}`,
    explanation: "This space-optimized approach manipulates the original `nums` array in place. We use a `start` pointer to divide the array into two parts: 'locked in' permutations on the left, and 'available' candidates on the right. At each level of recursion, we loop through the available candidates (`i` from `start` to end). We physically swap the candidate at `i` into the `start` position, then recursively evaluate `start + 1`. When the recursion returns, we swap the elements back to perfectly restore the original array state for the next iteration. This eliminates the need for a separate `visited` array."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">46. Permutations</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given an array <code>nums</code> of distinct integers, return <em>all the possible permutations</em>. You can return the answer in <strong>any order</strong>.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [1,2,3]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [0,1]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[0,1],[1,0]]</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [1]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[1]]</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= nums.length &lt;= 6</code></li>
              <li><code>-10 &lt;= nums[i] &lt;= 10</code></li>
              <li>All the integers of <code>nums</code> are <strong>unique</strong>.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const PermutationsVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('visitedArray');
  const [numsInput, setNumsInput] = useState('1, 2, 3');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let arr = numsInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (arr.length === 0) arr = [1, 2, 3];
    
    // UI Safeguards to prevent explosive N! recursion freezing the browser
    // Cap at 4 items (4! = 24 permutations, entirely safe for visualization)
    if (arr.length > 4) arr = arr.slice(0, 4);
    
    // Ensure uniqueness as per problem constraints
    arr = [...new Set(arr)];

    return { nums: arr };
  }, [numsInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { nums: originalNums } = parsedData;
    const n = originalNums.length;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 3000) return; // Hard safety cap
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    let res = [];

    if (selectedApproachId === 'visitedArray') {
        let visited = Array(n).fill(false);
        
        addStep(
            "Initialization", 
            `Line 3-4: List<List<Integer>> res = ...;\nboolean[] visited = new boolean[${n}];\n\nInitialize the results list and a 'visited' array of size ${n} to keep track of which numbers are currently in our combination.`, 
            4, 
            { curr: [], visited: [...visited], res: [], i: null, action: 'init' }
        );

        addStep(
            "Initiate Backtracking", 
            `Line 5: backtrack(res, new ArrayList<>(), nums, visited);\n\nStart the recursion tree with an empty current combination.`, 
            5, 
            { curr: [], visited: [...visited], res: [], i: null, action: 'init' }
        );

        const backtrack = (currList, depth) => {
            if (steps.length > 3000) return;
            let snapshot = [...currList];

            addStep(
                "Enter Backtrack Call", 
                `Line 9: private void backtrack(..., List<Integer> curr, ...)\n\nEntering recursive function at depth ${depth}. Current path: [${snapshot.join(', ')}].`, 
                9, 
                { curr: snapshot, visited: [...visited], res: [...res], i: null, action: 'enter' }
            );

            addStep(
                "Evaluate Base Case", 
                `Line 11: if (curr.size() == nums.length)\n\nIs curr.size() (${snapshot.length}) equal to nums.length (${n})?`, 
                11, 
                { curr: snapshot, visited: [...visited], res: [...res], i: null, action: 'evalBase' }
            );

            if (snapshot.length === n) {
                res.push([...snapshot]);
                addStep(
                    "Permutation Complete!", 
                    `Line 12: res.add(new ArrayList<>(curr));\n\nCondition met! We have a complete permutation. We add a copy of [${snapshot.join(', ')}] to 'res' and return.`, 
                    12, 
                    { curr: snapshot, visited: [...visited], res: [...res], i: null, action: 'successBranch' }
                );
                return;
            }

            addStep(
                "Start Candidate Loop", 
                `Line 16: for (int i = 0; i < nums.length; i++)\n\nWe loop through ALL candidates from index 0 to ${n-1}.`, 
                16, 
                { curr: snapshot, visited: [...visited], res: [...res], i: null, action: 'loopStart' }
            );

            for (let i = 0; i < n; i++) {
                if (steps.length > 3000) break;
                
                addStep(
                    "Evaluate Candidate", 
                    `Line 18: if (visited[i]) continue;\n\nWe check candidate nums[${i}] = ${originalNums[i]}.\nIs visited[${i}] true? ${visited[i] ? 'YES. Skip it.' : 'NO. It is available!'}`, 
                    18, 
                    { curr: snapshot, visited: [...visited], res: [...res], i, action: 'evalChoice', candidate: originalNums[i] }
                );

                if (visited[i]) continue;

                // Make Choice
                visited[i] = true;
                currList.push(originalNums[i]);
                let addedSnapshot = [...currList];
                
                addStep(
                    "Make Choice (Add & Mark)", 
                    `Line 21-22: visited[${i}] = true; curr.add(${originalNums[i]});\n\nWe lock in our choice. We mark it visited and append it to our path. Path is now [${addedSnapshot.join(', ')}].`, 
                    22, 
                    { curr: addedSnapshot, visited: [...visited], res: [...res], i, action: 'add', candidate: originalNums[i] }
                );

                // Recurse
                addStep(
                    "Recurse Deeper", 
                    `Line 25: backtrack(...);\n\nWe recursively call backtrack to fill in the remaining ${n - addedSnapshot.length} spots in the permutation.`, 
                    25, 
                    { curr: addedSnapshot, visited: [...visited], res: [...res], i, action: 'recurse' }
                );

                backtrack(currList, depth + 1);

                // Undo Choice
                addStep(
                    "Return from Recursion", 
                    `Line 25: The recursive call finished.\n\nWe must now UNDO our choice of ${originalNums[i]} to explore other potential candidates at this position.`, 
                    25, 
                    { curr: addedSnapshot, visited: [...visited], res: [...res], i, action: 'returnRecurse' }
                );

                currList.pop();
                visited[i] = false;
                let poppedSnapshot = [...currList];
                
                addStep(
                    "Undo Choice (Backtrack)", 
                    `Line 28-29: curr.remove...; visited[${i}] = false;\n\nWe remove the last element and un-mark it. Path reverts to [${poppedSnapshot.join(', ')}].`, 
                    29, 
                    { curr: poppedSnapshot, visited: [...visited], res: [...res], i, action: 'remove', candidate: originalNums[i] }
                );
            }
            
            addStep(
                "End of Backtrack Call", 
                `Line 31: }\n\nThe loop finished. We have tried placing all valid candidates at this depth. Return to parent caller.`, 
                31, 
                { curr: snapshot, visited: [...visited], res: [...res], i: null, action: 'return' }
            );
        };

        backtrack([], 0);

        addStep(
            "Algorithm Complete", 
            `Line 6: return res;\n\nThe full DFS tree has been traversed. We successfully generated all ${res.length} permutations!`, 
            6, 
            { curr: [], visited: [...visited], res: [...res], i: null, action: 'success', isSuccess: true }
        );

    } else if (selectedApproachId === 'swapping') {
        
        let nums = [...originalNums];
        
        addStep(
            "Initialization", 
            `Line 3: List<List<Integer>> res = new ArrayList<>();\n\nInitialize the results list. Notice we don't need a visited array!`, 
            3, 
            { nums: [...nums], start: null, i: null, res: [], action: 'init' }
        );

        addStep(
            "Initiate Backtracking", 
            `Line 4: backtrack(res, nums, 0);\n\nStart the recursion tree, passing 'start' = 0. The 'start' pointer tracks the boundary between locked-in elements (left) and available elements (right).`, 
            4, 
            { nums: [...nums], start: null, i: null, res: [], action: 'init' }
        );

        const backtrackSwap = (start, depth) => {
            if (steps.length > 3000) return;
            
            addStep(
                "Enter Backtrack Call", 
                `Line 8: private void backtrack(..., int start = ${start})\n\nEntering recursive function at depth ${depth}. Current array state: [${nums.join(', ')}].`, 
                8, 
                { nums: [...nums], start, i: null, res: [...res], action: 'enter' }
            );

            addStep(
                "Evaluate Base Case", 
                `Line 10: if (start == nums.length)\n\nIs start (${start}) equal to nums.length (${n})?`, 
                10, 
                { nums: [...nums], start, i: null, res: [...res], action: 'evalBase' }
            );

            if (start === n) {
                res.push([...nums]);
                addStep(
                    "Permutation Complete!", 
                    `Line 11-13: res.add(currentPermutation);\n\nStart has reached the end! Every element is locked in. We clone the array [${nums.join(', ')}] into 'res' and return.`, 
                    13, 
                    { nums: [...nums], start, i: null, res: [...res], action: 'successBranch' }
                );
                return;
            }

            addStep(
                "Start Candidate Loop", 
                `Line 17: for (int i = ${start}; i < nums.length; i++)\n\nWe iterate through the AVAILABLE candidates from 'start' (${start}) to the end.`, 
                17, 
                { nums: [...nums], start, i: null, res: [...res], action: 'loopStart' }
            );

            for (let i = start; i < n; i++) {
                if (steps.length > 3000) break;

                addStep(
                    "Evaluate Choice (Swap Targets)", 
                    `Line 17: i = ${i}.\n\nWe will attempt to place nums[${i}] (${nums[i]}) into the 'start' position (index ${start}).`, 
                    17, 
                    { nums: [...nums], start, i, res: [...res], action: 'evalChoice' }
                );

                // Swap
                let temp = nums[start];
                nums[start] = nums[i];
                nums[i] = temp;

                addStep(
                    "Make Choice (Swap In)", 
                    `Line 19: swap(nums, ${start}, ${i});\n\nWe physically swap the elements to lock the candidate into the 'start' slot.\nArray is now: [${nums.join(', ')}].`, 
                    19, 
                    { nums: [...nums], start, i, res: [...res], action: 'swap' }
                );

                // Recurse
                addStep(
                    "Recurse Deeper", 
                    `Line 22: backtrack(res, nums, start + 1);\n\nWe lock in index ${start}, and recursively generate permutations for the remaining elements starting from ${start + 1}.`, 
                    22, 
                    { nums: [...nums], start, i, res: [...res], action: 'recurse' }
                );

                backtrackSwap(start + 1, depth + 1);

                addStep(
                    "Return from Recursion", 
                    `Line 22: The recursive call finished.\n\nWe must now UNDO the swap to restore the array to its original state before evaluating the next candidate for this slot.`, 
                    22, 
                    { nums: [...nums], start, i, res: [...res], action: 'returnRecurse' }
                );

                // Undo Swap
                temp = nums[start];
                nums[start] = nums[i];
                nums[i] = temp;

                addStep(
                    "Undo Choice (Swap Back)", 
                    `Line 25: swap(nums, ${start}, ${i});\n\nElements are swapped back. Array perfectly restored to: [${nums.join(', ')}].`, 
                    25, 
                    { nums: [...nums], start, i, res: [...res], action: 'undoSwap' }
                );
            }
            
            addStep(
                "End of Backtrack Call", 
                `Line 27: }\n\nThe loop finished. We have tried swapping all available candidates into index ${start}. Return.`, 
                27, 
                { nums: [...nums], start, i: null, res: [...res], action: 'return' }
            );
        }

        backtrackSwap(0, 0);

        addStep(
            "Algorithm Complete", 
            `Line 5: return res;\n\nIn-place DFS complete. Generated ${res.length} permutations!`, 
            5, 
            { nums: [...nums], start: null, i: null, res: [...res], action: 'success', isSuccess: true }
        );
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
  const { isSuccess, curr: currentComb, visited, res, action, start, i: activeI, nums: swappedNums } = state;
  const { nums: originalArr } = parsedData;

  // The array to visually render the candidates
  let displayArr = selectedApproachId === 'swapping' && swappedNums ? swappedNums : originalArr;

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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Permutations</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 46</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action === 'remove' || action === 'undoSwap' ? 'bg-amber-500/20 border-amber-500' : 'bg-violet-500/20 border-violet-500')}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'remove' || action === 'undoSwap' ? 'amber' : 'violet'} />
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
                    
                    {selectedApproachId === 'visitedArray' ? (
                        <div className="grid grid-cols-2 gap-3">
                            <VariableCard label="Loop (i)" val={activeI !== null ? activeI : "-"} arrVal={activeI !== null && activeI < originalArr.length ? originalArr[activeI] : null} color="violet" active={activeI !== null} />
                            <VariableCard label="Permutation Size" val={currentComb ? `${currentComb.length} / ${originalArr.length}` : "-"} color={currentComb && currentComb.length === originalArr.length ? "emerald" : "sky"} active={currentComb !== undefined} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <VariableCard label="Start Ptr" val={start !== null && start !== undefined ? start : "-"} color="purple" active={start !== null && start !== undefined} />
                            <VariableCard label="Loop (i)" val={activeI !== null && activeI !== undefined ? activeI : "-"} arrVal={activeI !== null && activeI !== undefined && activeI < displayArr.length ? displayArr[activeI] : null} color="violet" active={activeI !== null && activeI !== undefined} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Distinct Elements (nums)</label>
                        <input type="text" value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="1, 2, 3" />
                        <p className="text-[9px] text-slate-400 pl-1">Max 4 items to prevent browser freeze (4! = 24)</p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-violet-100 hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action === 'remove' || action === 'undoSwap' ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800')}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : <Shuffle size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action === 'remove' || action === 'undoSwap' ? 'text-amber-400' : 'text-violet-400')}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'remove' || action === 'undoSwap' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30')}`}>Line {cur.line}</div>
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
                      <div className="flex flex-col items-center w-full max-w-full overflow-x-auto pb-4 pt-8">
                          <div className="flex items-center justify-between w-full max-w-md px-2 mb-2">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono flex items-center gap-2"><Database size={12}/> {selectedApproachId === 'swapping' ? 'Current Array State' : 'Candidates Array'}</span>
                          </div>
                          
                          <div className="flex gap-2 p-3 bg-slate-100 border border-slate-200 rounded-3xl shadow-inner mx-auto relative">
                              {displayArr.map((num, idx) => {
                                  let isCurrentI = activeI === idx;
                                  
                                  // Visited Array logic
                                  let isVisited = visited && visited[idx];
                                  
                                  // Swapping Logic
                                  let isLocked = selectedApproachId === 'swapping' && start !== null && idx < start && !isSuccess;
                                  let isStartPtr = selectedApproachId === 'swapping' && start === idx && !isSuccess;
                                  let isSwapAction = (action === 'swap' || action === 'undoSwap') && (idx === start || idx === activeI);

                                  let cls = "relative w-12 h-14 md:w-16 md:h-16 flex flex-col items-center justify-center rounded-xl border-2 font-mono font-black text-xl md:text-2xl transition-all duration-500 z-10 ";
                                  
                                  if (isCurrentI && !isSuccess) {
                                      if (action === 'remove' || action === 'undoSwap') cls += "bg-amber-100 border-amber-500 text-amber-800 scale-105 shadow-md z-20";
                                      else cls += "bg-sky-100 border-sky-500 text-sky-800 scale-110 shadow-lg ring-4 ring-sky-300/50 z-20";
                                  } else if (isSwapAction) {
                                      cls += "bg-purple-100 border-purple-500 text-purple-900 scale-110 shadow-lg z-30 ring-4 ring-purple-300/50";
                                  } else if (isVisited || isLocked) {
                                      cls += "bg-slate-200 border-slate-300 text-slate-400 border-dashed scale-95 opacity-80";
                                  } else {
                                      cls += "bg-white border-slate-300 text-slate-700 shadow-sm";
                                  }

                                  return (
                                      <div key={idx} className="flex flex-col items-center relative group">
                                          {/* Start Pointer (Swapping) */}
                                          {isStartPtr && (
                                              <div className="absolute -top-10 flex flex-col items-center animate-bounce z-30">
                                                  <span className="text-[10px] font-black font-mono tracking-widest text-rose-700 bg-rose-100 px-1.5 rounded shadow-sm border border-rose-200">start</span>
                                                  <ArrowDown size={14} className="text-rose-600" strokeWidth={3}/>
                                              </div>
                                          )}

                                          <div className={cls}>
                                              {num}
                                              <span className="absolute top-1 left-1.5 text-[8px] md:text-[10px] font-mono text-slate-400 font-normal">{idx}</span>
                                              
                                              {isCurrentI && (action === 'remove' || action === 'undoSwap') && (
                                                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-lg">
                                                      <Undo2 className="text-amber-600" size={24} strokeWidth={3} />
                                                  </div>
                                              )}
                                              
                                              {isVisited && selectedApproachId === 'visitedArray' && (
                                                  <div className="absolute -top-2 -right-2 bg-emerald-100 border border-emerald-400 rounded-full p-0.5 shadow-sm">
                                                      <Check size={12} className="text-emerald-600" strokeWidth={4}/>
                                                  </div>
                                              )}
                                          </div>
                                          
                                          {/* I Pointer */}
                                          {isCurrentI && !isSuccess && (
                                              <div className={`absolute -bottom-8 flex flex-col items-center animate-in slide-in-from-top-1 z-30 ${action === 'remove' || action === 'undoSwap' ? 'text-amber-600' : 'text-sky-600'}`}>
                                                  <ArrowUp size={14} strokeWidth={3}/>
                                                  <span className={`text-[10px] font-black font-mono tracking-widest px-1.5 rounded shadow-sm border ${action === 'remove' || action === 'undoSwap' ? 'bg-amber-100 border-amber-200' : 'bg-sky-100 border-sky-200'}`}>i={idx}</span>
                                              </div>
                                          )}
                                      </div>
                                  );
                              })}
                          </div>
                      </div>

                      {/* Current Combination Progress (Visited Array Approach) */}
                      {selectedApproachId === 'visitedArray' && currentComb !== undefined && (
                          <div className="w-full max-w-md flex flex-col items-center gap-4 mt-2">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono text-center flex items-center gap-1"><Layers size={14} /> Current Permutation Builder</span>
                              
                              <div className="flex gap-2 items-center flex-wrap justify-center min-h-[56px] bg-slate-50 px-6 py-3 rounded-2xl border-2 border-dashed border-slate-300 w-full shadow-inner">
                                  {currentComb.length === 0 ? (
                                      <span className="text-slate-400 font-mono text-sm italic">Empty</span>
                                  ) : (
                                      currentComb.map((num, idx) => {
                                          let isLast = idx === currentComb.length - 1;
                                          let cls = "w-10 h-10 flex items-center justify-center rounded-lg border-2 font-mono font-black text-lg shadow-sm transition-all duration-300 ";
                                          
                                          if (isLast && action === 'add') cls += "bg-emerald-100 border-emerald-400 text-emerald-800 scale-110 animate-in zoom-in ring-2 ring-emerald-400/50";
                                          else if (isLast && action === 'remove') cls += "bg-amber-100 border-amber-400 text-amber-800 scale-90 opacity-50";
                                          else cls += "bg-white border-slate-300 text-slate-700";

                                          return <div key={idx} className={cls}>{num}</div>;
                                      })
                                  )}
                              </div>
                          </div>
                      )}

                      {/* Results List Collection */}
                      {res !== undefined && (
                          <div className="w-full flex flex-col items-center border-t border-slate-200 pt-6 mt-auto">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono text-center mb-4 flex items-center gap-1"><Database size={14} /> Valid Permutations Found ({res.length})</span>
                              
                              <div className="flex flex-wrap gap-2 justify-center w-full max-h-[140px] overflow-y-auto scrollbar-thin p-2">
                                  {res.length === 0 ? (
                                      <span className="text-slate-300 font-mono text-sm italic">Waiting for base case...</span>
                                  ) : (
                                      res.map((comb, idx) => {
                                          let isLatest = idx === res.length - 1 && action === 'successBranch';
                                          return (
                                              <div key={idx} className={`px-2.5 py-1 rounded-lg border-2 font-mono font-bold text-xs transition-all duration-500 ${isLatest ? 'bg-emerald-100 border-emerald-400 text-emerald-800 scale-110 shadow-md animate-in zoom-in ring-2 ring-emerald-400/50' : 'bg-white border-slate-200 text-slate-600 shadow-sm'}`}>
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
                                  Found {res.length} Unique Permutations
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
                <Shuffle className="text-violet-600"/> The Mathematics of Permutations
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                A permutation is an arrangement of all elements in a set into a specific sequence or order. For a set of $N$ distinct elements, there are mathematically $N!$ (N-factorial) possible permutations. Since $N!$ grows explosively ($10! = 3.6$ million), algorithms must be extremely efficient.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <GitMerge size={18}/> The Visited Array Strategy
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            We build the permutation list one element at a time. But how do we prevent using an element twice (e.g., <code>[1, 1, 2]</code>)?
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            We maintain a <code>boolean[] visited</code> array matching the size of our input. <br/><br/>
                            Before adding <code>nums[i]</code> to our combination, we check <code>visited[i]</code>. If it is <code>true</code>, we skip it. If <code>false</code>, we mark it <code>true</code>, recurse, and then crucially <strong>un-mark</strong> it (<code>false</code>) when backtracking!
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowLeftRight size={18}/> The Swapping Strategy
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            Instead of an external array and a boolean array, we can generate permutations by physically moving elements around in the original array.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>We use a <code>start</code> index. Everything to the left of <code>start</code> is "locked in". Everything from <code>start</code> to the end is a valid candidate.</p>
                            <p>We loop <code>i</code> from <code>start</code> to the end, <strong>swapping</strong> <code>nums[start]</code> with <code>nums[i]</code>.</p>
                            <p>We recurse for <code>start + 1</code>. When we return, we swap them back to restore the original array state. This saves $O(N)$ space!</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Undo2 size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-emerald-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">The Importance of Cloning</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            A classic mistake in backtracking is adding the reference of the current list to the results array:
                            <br/><br/>
                            <code>res.add(curr); // WRONG!</code>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-[10px] text-emerald-300">
                            // Because 'curr' is constantly modified (added to, removed from),<br/>
                            // if you just add the reference, your final 'res' list<br/>
                            // will just contain N! copies of the exact same empty list!<br/><br/>
                            // You MUST clone the state at the base case:<br/>
                            res.add(new ArrayList&lt;&gt;(curr)); // CORRECT!
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
                        "I used a Depth-First Search (DFS) Backtracking algorithm to generate all permutations. The key challenge in permutations is ensuring we use every distinct element exactly once per sequence. In the standard approach, I utilized a boolean `visited` array to keep track of elements currently residing in the active combination path. At each recursive step, I iterate through all candidates, skipping those already visited. Crucially, when returning from the recursive call, I backtrack by popping the last element and un-marking its `visited` status, restoring the state to explore sibling branches. For a slightly more space-optimized solution, I could implement the In-Place Swapping technique, which omits the `visited` array and temporary list entirely by directly swapping elements in the input array across a moving `start` boundary."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: ArrayList.contains() vs boolean[]
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Instead of a <code>visited</code> array, you could technically just write <code>if (curr.contains(nums[i])) continue;</code>. However, this is heavily frowned upon in interviews. <code>contains()</code> runs an $O(N)$ linear scan on the list every single time. A boolean array lookup is strict $O(1)$ constant time.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N × N!)</span>
                                <p className="text-[10px] text-slate-500 mt-1">There are $N!$ distinct permutations. For each permutation, we hit the base case and must copy $N$ elements into a new ArrayList. Therefore, generating and copying takes $O(N \times N!)$ time.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Excluding the space used for the final output array, the auxiliary space is bounded by the recursion call stack, which goes $N$ levels deep, and the temporary `curr` list / `visited` array which are size $N$.</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|nums|length|res|permute|backtrack|visited|curr|size|add|remove|start|swap|temp|currentPermutation)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['nums', 'res', 'temp'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['visited', 'start'].includes(part)) return <span key={i} className="text-rose-400 font-bold">{part}</span>;
          if (['curr', 'currentPermutation'].includes(part)) return <span key={i} className="text-purple-300 font-bold">{part}</span>;
          if (['permute', 'backtrack', 'swap', 'add', 'remove', 'size', 'length'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default PermutationsVisualizer;