import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, ArrowRight, 
  ArrowDown, X, Timer, ShieldAlert, Database, 
  Network, RotateCcw, ListPlus, Split, Share2, Binary, Brackets, CornerDownRight
} from 'lucide-react';

const APPROACHES = {
  backtracking: {
    id: 'backtracking',
    title: '1. Backtracking (DFS)',
    subtitle: 'Explore all paths via Decision Tree.',
    icon: <Network size={16} />,
    complexity: 'Time: O(N * 2^N) | Space: O(N)',
    code: `class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(0, nums, new ArrayList<>(), res);
        return res;
    }

    private void backtrack(int start, int[] nums, List<Integer> path, List<List<Integer>> res) {
        // Add the current subset (tree node) to our result
        res.add(new ArrayList<>(path));
        
        // Explore branches (adding remaining elements)
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);                  // Branch DOWN (Include)
            backtrack(i + 1, nums, path, res);  // RECURSE
            path.remove(path.size() - 1);       // Climb UP (Backtrack)
        }
    }
}`,
    explanation: "The Backtracking approach builds a 'Decision Tree'. We start at the root (an empty subset). At each node, we branch out by iterating through the remaining numbers we haven't considered yet. When we take a branch, we add a number to our path, save that subset, and recursively explore further down that branch. When we hit a dead end, we 'backtrack' (climb up the tree by removing the number) to explore other parallel branches."
  },
  cascading: {
    id: 'cascading',
    title: '2. Cascading (Iterative)',
    subtitle: 'Iteratively double subsets. O(N * 2^N)',
    icon: <ListPlus size={16} />,
    complexity: 'Time: O(N * 2^N) | Space: O(N * 2^N)',
    code: `class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        res.add(new ArrayList<>()); // Start with empty subset
        
        for (int num : nums) {
            int n = res.size();
            // Take existing subsets and append 'num' to them
            for (int i = 0; i < n; i++) {
                List<Integer> subset = new ArrayList<>(res.get(i));
                subset.add(num);
                res.add(subset);
            }
        }
        return res;
    }
}`,
    explanation: "The Cascading approach is an intuitive, iterative way to build the power set without a tree. We start with the empty subset `[]`. For each number in the input array, we take all subsets we've generated so far, clone them, append the current number to each clone, and add these new subsets back into our results list. The list size doubles with every new number."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">78. Subsets</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given an integer array <code className="bg-slate-100 px-1.5 py-0.5 rounded text-fuchsia-600 font-mono font-bold">nums</code> of <strong>unique</strong> elements, return <em>all possible subsets (the power set)</em>.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-fuchsia-500 pl-4 bg-fuchsia-50 py-2 mt-4">
          The solution set <strong>must not</strong> contain duplicate subsets. Return the solution in <strong>any order</strong>.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm flex gap-3 mt-6 items-start shadow-sm">
            <AlertCircle className="shrink-0 mt-0.5 text-amber-500" size={18} />
            <div>
                <strong>Combinatorics Fact:</strong> An array of length <code>N</code> will always have exactly <code>2^N</code> subsets. This includes the empty subset <code>[]</code> and the full array itself.
            </div>
        </div>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [1,2,3]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [0]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[],[0]]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- Recursive Tree UI Component ---
const RecursionTree = ({ node, activeId, visitedIds }: { node: any, activeId: string | null, visitedIds: string[] }) => {
    const isRoot = node.id === 'root';
    const isActive = activeId === node.id;
    const isVisited = visitedIds.includes(node.id);

    let bg = 'bg-white border-slate-200 text-slate-300';
    if (isActive) bg = 'bg-fuchsia-500 border-fuchsia-600 text-white shadow-lg scale-110 z-20 ring-4 ring-fuchsia-100';
    else if (isVisited) bg = 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm z-10';

    return (
        <div className="flex items-center">
            <div className={`px-2.5 py-1.5 rounded-lg border-2 font-mono text-[10px] sm:text-xs font-black transition-all duration-500 shrink-0 relative ${bg}`}>
                {isRoot ? 'Ø' : `[${node.path.join(',')}]`}
                {isActive && <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-fuchsia-400 animate-ping" />}
            </div>
            {node.children && node.children.length > 0 && (
                <div className="flex flex-col gap-2 border-l-2 border-slate-200/80 ml-3 pl-3 py-1">
                    {node.children.map((child: any) => (
                        <div key={child.id} className="relative flex items-center">
                            <div className="absolute top-1/2 -left-3 w-3 border-t-2 border-slate-200/80 -translate-y-1/2" />
                            <RecursionTree node={child} activeId={activeId} visitedIds={visitedIds} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const SubsetsVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState<keyof typeof APPROACHES>('backtracking');
  const [numsInput, setNumsInput] = useState('1, 2, 3');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedNums = useMemo(() => {
    let arr = numsInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (arr.length > 4) arr = arr.slice(0, 4); // Limit to 4 to keep tree readable
    if (arr.length === 0) return [1, 2, 3];
    return arr;
  }, [numsInput]);

  // Build the static tree structure for the visualizer
  const treeRoot = useMemo(() => {
      const build = (start: number, currentPath: number[]): any => {
          const id = currentPath.length === 0 ? "root" : currentPath.join(',');
          const node = { id, path: [...currentPath], children: [] as any[] };
          for (let i = start; i < parsedNums.length; i++) {
              node.children.push(build(i + 1, [...currentPath, parsedNums[i]]));
          }
          return node;
      };
      return build(0, []);
  }, [parsedNums]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const nums = parsedNums;
    const n = nums.length;
    
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      if (steps.length > 2000) return; // safety
      steps.push({
        phase,
        description: desc,
        line,
        state: { nums, ...state }
      });
    };

    if (selectedApproachId === 'backtracking') {
        let res: number[][] = [];
        let callStack: { start: number, path: number[] }[] = [];
        let visitedIds = new Set<string>();
        
        addStep("Init Results", `Line 3: We initialize the 'res' array which will hold every subset we discover in our tree.`, 3, { res: [...res], path: [], callStack: [...callStack], start: null, i: null, activeNodeId: null, visitedIds: [] });
        
        addStep("Start DFS", `Line 4: We trigger our DFS. We start at the 'root' of the tree (an empty path []) and tell it to consider elements from index 0 onwards.`, 4, { res: [...res], path: [], callStack: [...callStack], start: null, i: null, activeNodeId: null, visitedIds: [] });
        
        const runBacktrack = (start: number, path: number[]) => {
            const currentId = path.length === 0 ? "root" : path.join(',');
            visitedIds.add(currentId);
            callStack.push({ start, path: [...path] });
            
            addStep("Enter Tree Node", `Line 8: We arrived at node ${currentId === 'root' ? '[ Ø ]' : `[${path.join(', ')}]`}. We are allowed to branch using elements from index ${start} onwards.`, 8, { res: [...res], path: [...path], callStack: [...callStack], start, i: null, activeNodeId: currentId, visitedIds: Array.from(visitedIds) });
            
            res.push([...path]);
            addStep("Save Subset", `Line 10: Every single node in this tree is a valid subset! We clone the current path and save it to our final 'res' collection.`, 10, { res: [...res], path: [...path], callStack: [...callStack], start, i: null, activeNodeId: currentId, visitedIds: Array.from(visitedIds), addingToRes: true });
            
            addStep("Scan for Branches", `Line 13: We loop from i = ${start} to ${n-1} to see what branches we can take to go deeper.`, 13, { res: [...res], path: [...path], callStack: [...callStack], start, i: start, activeNodeId: currentId, visitedIds: Array.from(visitedIds) });
            
            for (let i = start; i < n; i++) {
                addStep("Evaluate Branch", `Line 13: i = ${i}. We can take the branch for nums[${i}] (${nums[i]}).`, 13, { res: [...res], path: [...path], callStack: [...callStack], start, i, activeNodeId: currentId, visitedIds: Array.from(visitedIds) });
                
                path.push(nums[i]);
                addStep("Branch Down (Include)", `Line 14: path.add(${nums[i]}). We take the branch! We physically add the number to our path, moving towards a deeper tree node.`, 14, { res: [...res], path: [...path], callStack: [...callStack], start, i, modifyingPath: true, activeNodeId: currentId, visitedIds: Array.from(visitedIds) });
                
                addStep("Recurse Deeper", `Line 15: We recursively call backtrack to explore everything originating from this new branch, restricting future choices to index ${i + 1}.`, 15, { res: [...res], path: [...path], callStack: [...callStack], start, i, activeNodeId: currentId, visitedIds: Array.from(visitedIds) });
                
                // RECURSE
                runBacktrack(i + 1, path);
                
                // RETURNED FROM RECURSION - Re-orient to current node
                addStep("Return up the Tree", `Line 15: The recursive exploration finished. We have returned back up to node ${currentId === 'root' ? '[ Ø ]' : `[${path.join(', ')}]`}.`, 15, { res: [...res], path: [...path], callStack: [...callStack], start, i, activeNodeId: currentId, visitedIds: Array.from(visitedIds) });
                
                path.pop();
                addStep("Backtrack (Exclude)", `Line 16: BACKTRACK! We remove ${nums[i]} from our path. We are "undoing" the branch we just took so we can evaluate the next branch cleanly.`, 16, { res: [...res], path: [...path], callStack: [...callStack], start, i, modifyingPath: true, activeNodeId: currentId, visitedIds: Array.from(visitedIds) });
            }
            
            addStep("Node Exhausted", `Line 13: The loop i < nums.length is false. We've explored all possible branches from node ${currentId === 'root' ? '[ Ø ]' : `[${path.join(', ')}]`}.`, 13, { res: [...res], path: [...path], callStack: [...callStack], start, i: n, activeNodeId: currentId, visitedIds: Array.from(visitedIds) });
            
            addStep("Exit Node", `Line 18: Function ends. We pop this frame off the call stack and return to the parent node.`, 18, { res: [...res], path: [...path], callStack: [...callStack], start, i: n, activeNodeId: currentId, visitedIds: Array.from(visitedIds) });
            callStack.pop();
        };

        runBacktrack(0, []);
        
        addStep("Return Final", `Line 5: The entire Decision Tree has been traversed. Returning the ${res.length} subsets we collected.`, 5, { res: [...res], path: [], callStack: [], start: null, i: null, activeNodeId: null, visitedIds: Array.from(visitedIds), isSuccess: true });
    } 
    else if (selectedApproachId === 'cascading') {
        let res: number[][] = [];
        addStep("Initialize List", `Line 3: Create 'res' to store our growing collection of subsets.`, 3, { res: [...res], currentNum: null, nSize: null, i: null });
        
        res.push([]);
        addStep("Add Base Case", `Line 4: Insert the empty subset []. This is the foundation we will build upon.`, 4, { res: [...res], currentNum: null, nSize: null, i: null, addingToRes: true });

        for (let num of nums) {
            addStep("Outer Loop", `Line 6: Process the next number from the input array: num = ${num}.`, 6, { res: [...res], currentNum: num, nSize: null, i: null });
            
            let currentSize = res.length;
            addStep("Snapshot Size", `Line 7: Capture current size n = ${currentSize}. We only iterate over subsets created *before* this iteration.`, 7, { res: [...res], currentNum: num, nSize: currentSize, i: null });
            
            addStep("Inner Loop Init", `Line 9: Prepare to iterate through the first ${currentSize} subsets.`, 9, { res: [...res], currentNum: num, nSize: currentSize, i: 0 });

            for (let i = 0; i < currentSize; i++) {
                addStep("Inner Loop Check", `Line 9: i < n (${i} < ${currentSize}) is true. Grab subset at index ${i}.`, 9, { res: [...res], currentNum: num, nSize: currentSize, i });
                
                let subset = [...res[i]];
                addStep("Clone Subset", `Line 10: Clone the existing subset [${res[i].join(', ')}] so we don't mutate the original.`, 10, { res: [...res], currentNum: num, nSize: currentSize, i, cloningSubset: subset });
                
                subset.push(num);
                addStep("Append Number", `Line 11: Append ${num} to the cloned subset. It becomes [${subset.join(', ')}].`, 11, { res: [...res], currentNum: num, nSize: currentSize, i, modifiedSubset: subset });
                
                res.push(subset);
                addStep("Add New Subset", `Line 12: Add [${subset.join(', ')}] to 'res'. List size doubles!`, 12, { res: [...res], currentNum: num, nSize: currentSize, i, addingToRes: true, modifiedSubset: subset });
            }
            addStep("Inner Loop Exhausted", `Line 9: i < n (${currentSize} < ${currentSize}) is false. Finished expanding existing subsets with ${num}.`, 9, { res: [...res], currentNum: num, nSize: currentSize, i: currentSize });
        }
        
        addStep("Outer Loop Exhausted", `Line 6: No more numbers in the input array to process.`, 6, { res: [...res], currentNum: null, nSize: null, i: null });
        addStep("Return Final", `Line 15: Power set generation complete. Returning ${res.length} subsets.`, 15, { res: [...res], currentNum: null, nSize: null, i: null, isSuccess: true });
    }

    if (steps.length === 0) {
        addStep("Init", "Start", 1, {});
    }

    return steps;
  }, [parsedNums, selectedApproachId, treeRoot]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedApproach.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0] || { state: {} };
  const state = cur.state || { nums: parsedNums };
  const { isSuccess, nums, res, path, callStack, start, i, addingToRes, modifyingPath, currentNum, nSize, cloningSubset, modifiedSubset, activeNodeId, visitedIds } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-fuchsia-600 p-4 rounded-2xl shadow-lg shadow-fuchsia-100 flex items-center justify-center">
                <Brackets className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Subsets</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-fuchsia-600 bg-fuchsia-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 78</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Backtracking / Combinatorics</span>
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
                <div className="grid grid-cols-2 gap-3">
                    {Object.values(APPROACHES).map((app) => {
                        const isSelected = selectedApproachId === app.id;
                        const [time, space] = app.complexity.split(' | ');
                        return (
                            <button 
                               key={app.id}
                               onClick={() => { setSelectedApproachId(app.id as keyof typeof APPROACHES); setCurrentStep(0); }}
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-fuchsia-600 border-fuchsia-600 text-white shadow-fuchsia-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-fuchsia-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-fuchsia-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-fuchsia-100' : 'text-slate-400'}`}>
                                    <span>{time}</span>
                                    <span>{space}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Code Window */}
                <div className="bg-[#0f172a] rounded-3xl h-[420px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={14} className="text-fuchsia-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {/* Highlighter Bar */}
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : addingToRes ? 'bg-amber-500/20 border-amber-500' : 'bg-fuchsia-500/20 border-fuchsia-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="fuchsia" />
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-fuchsia-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Variables</h4>
                      </div>
                      {res && <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Subsets Generated: {res.length}</span>}
                    </div>
                    
                    {selectedApproachId === 'backtracking' ? (
                        <div className="grid grid-cols-2 gap-3">
                            <VariableCard label="Start Idx" val={start ?? null} color="purple" active={start !== null && start !== undefined} />
                            <VariableCard label="Loop Idx (i)" val={i ?? null} arrVal={i !== null && i !== undefined && i < nums.length ? nums[i] : null} color="sky" active={i !== null && i !== undefined} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            <VariableCard label="num" val={currentNum ?? null} color="blue" active={currentNum !== null && currentNum !== undefined} />
                            <VariableCard label="n (size)" val={nSize ?? null} color="amber" active={nSize !== null && nSize !== undefined} />
                            <VariableCard label="i" val={i ?? null} color="sky" active={i !== null && i !== undefined} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-fuchsia-600 uppercase block pl-1 tracking-widest font-mono">Array (comma separated)</label>
                        <input type="text" value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all shadow-inner" placeholder="1, 2, 3" />
                        {parsedNums.length > 4 && <span className="text-[9px] text-amber-500 font-bold block mt-1 px-1 flex gap-1 items-center"><AlertCircle size={10}/> Limited to N=4 to prevent UI overload.</span>}
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-fuchsia-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-fuchsia-100 hover:bg-fuchsia-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : addingToRes ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : selectedApproachId === 'backtracking' ? <Network size={100}/> : <ListPlus size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : addingToRes ? "text-amber-400" : "text-fuchsia-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : addingToRes ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30'}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line">{cur.description}</p>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px]">
                   
                   <div className="flex flex-col w-full h-full relative z-10 gap-8">
                      
                      {/* Array Header */}
                      <div className="flex flex-col items-center gap-4 border-b border-slate-100 pb-6">
                          
                          <div className="flex flex-col items-center">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-2">Input 'nums' Array</span>
                              <div className="flex gap-2">
                                  {nums.map((v: number, idx: number) => {
                                      let bgClass = "bg-slate-50 border-slate-200 text-slate-500";
                                      
                                      if (selectedApproachId === 'backtracking') {
                                          if (idx === i) bgClass = "bg-sky-100 border-sky-400 text-sky-800 scale-110 shadow-md";
                                          else if (start !== null && start !== undefined && idx >= start) bgClass = "bg-white border-slate-300 text-slate-700"; // Can be explored
                                      } else {
                                          if (v === currentNum) bgClass = "bg-fuchsia-100 border-fuchsia-400 text-fuchsia-800 scale-110 shadow-md";
                                          else if (idx < nums.indexOf(currentNum)) bgClass = "bg-slate-100 opacity-50";
                                      }

                                      return (
                                          <div key={idx} className="flex flex-col items-center">
                                              <div className={`w-10 h-10 flex items-center justify-center border-2 rounded-lg font-mono font-black text-sm transition-all duration-300 ${bgClass}`}>
                                                  {v}
                                              </div>
                                              <span className="text-[8px] font-mono text-slate-400 mt-1">{idx}</span>
                                          </div>
                                      )
                                  })}
                              </div>
                          </div>
                      </div>

                      {/* Split Working Area for Backtracking */}
                      {selectedApproachId === 'backtracking' && (
                          <div className="flex flex-col md:flex-row flex-1 gap-6 min-h-0">
                              {/* Left: The Recursion Tree */}
                              <div className="flex-[2] flex flex-col min-w-0 bg-slate-50 rounded-3xl p-5 border border-slate-200 shadow-inner overflow-x-auto overflow-y-auto scrollbar-thin">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-4 flex items-center gap-2 sticky top-0 bg-slate-50 z-30 pb-2"><Network size={14}/> Decision Tree Exploration</span>
                                  <div className="pr-4 pb-4">
                                     <RecursionTree node={treeRoot} activeId={activeNodeId} visitedIds={visitedIds || []} />
                                  </div>
                              </div>

                              {/* Right: Path & Stack & Result snippet */}
                              <div className="flex-1 flex flex-col gap-4 min-w-[200px]">
                                  {/* Current Path */}
                                  <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col items-center">
                                      <span className="text-[10px] font-black text-fuchsia-600 uppercase tracking-widest font-mono mb-2">Current Node Path</span>
                                      <div className={`px-4 py-2 rounded-xl border-2 flex gap-1 transition-all duration-500 w-full justify-center ${modifyingPath ? 'bg-fuchsia-100 border-fuchsia-400 shadow-md scale-105' : 'bg-slate-50 border-slate-200'}`}>
                                          <span className="text-slate-400 font-mono text-sm">[</span>
                                          <span className="text-sm font-mono font-black text-slate-800">{path ? path.join(', ') : ''}</span>
                                          <span className="text-slate-400 font-mono text-sm">]</span>
                                      </div>
                                  </div>

                                  {/* Call Stack */}
                                  <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
                                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono mb-2 border-b border-slate-100 pb-2">Call Stack Frame</span>
                                      <div className="flex flex-col-reverse gap-1 overflow-y-auto scrollbar-thin pr-1 flex-1">
                                          {callStack && callStack.map((frame: any, idx: number) => (
                                              <div key={idx} className={`text-[10px] font-mono font-bold px-2 py-1.5 rounded text-center border transition-all duration-300 ${idx === callStack.length - 1 ? 'bg-fuchsia-100 border-fuchsia-300 text-fuchsia-800 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500 opacity-60'}`}>
                                                  bt(start: {frame.start})
                                              </div>
                                          ))}
                                          {(!callStack || callStack.length === 0) && <span className="text-[10px] text-slate-400 italic text-center mt-2">Empty</span>}
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* Cascading Working Area */}
                      {selectedApproachId === 'cascading' && (
                          <div className="flex items-center gap-6 mt-4 w-full justify-center">
                              {cloningSubset && (
                                 <div className="flex flex-col items-center animate-in slide-in-from-bottom-2">
                                      <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest font-mono mb-2">Clone</span>
                                      <div className={`px-4 py-2 rounded-xl border border-sky-300 bg-sky-50 text-sky-800 font-mono font-bold shadow-sm`}>
                                          [{cloningSubset.join(', ')}]
                                      </div>
                                  </div>
                              )}
                              
                              {cloningSubset && <Plus className="text-slate-300" />}
                              
                              {currentNum !== null && currentNum !== undefined && (
                                  <div className="flex flex-col items-center animate-in slide-in-from-top-2">
                                      <span className="text-[10px] font-black text-fuchsia-600 uppercase tracking-widest font-mono mb-2">Add</span>
                                      <div className={`px-4 py-2 rounded-xl border border-fuchsia-300 bg-fuchsia-50 text-fuchsia-800 font-mono font-bold shadow-sm`}>
                                          {currentNum}
                                      </div>
                                  </div>
                              )}

                              {modifiedSubset && <ArrowRight className="text-slate-300" />}

                              {modifiedSubset && (
                                  <div className="flex flex-col items-center animate-in slide-in-from-left-2">
                                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest font-mono mb-2">New Subset</span>
                                      <div className={`px-4 py-2 rounded-xl border-2 border-emerald-400 bg-emerald-100 text-emerald-800 font-mono font-black shadow-md scale-105`}>
                                          [{modifiedSubset.join(', ')}]
                                      </div>
                                  </div>
                              )}
                          </div>
                      )}

                      {/* Bottom 'res' Array Grid (for Cascading, or compacted for Backtracking) */}
                      <div className={`flex-1 flex flex-col w-full bg-slate-50 border border-slate-200 rounded-3xl p-4 shadow-inner ${selectedApproachId === 'backtracking' ? 'max-h-24 min-h-[6rem]' : ''}`}>
                          <div className="flex justify-between items-end mb-2 px-1">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono flex items-center gap-2"><Database size={14}/> Result Array (res)</span>
                              {res && <span className="text-[10px] font-black text-slate-400 font-mono">{res.length} Collected</span>}
                          </div>
                          
                          <div className="flex-1 overflow-y-auto scrollbar-thin flex flex-wrap content-start gap-2">
                              {res && res.map((subset: number[], rIdx: number) => {
                                  const isJustAdded = rIdx === res.length - 1 && addingToRes;
                                  const isBeingCloned = selectedApproachId === 'cascading' && i === rIdx;
                                  
                                  let bgClass = "bg-white border-slate-200 text-slate-700 shadow-sm";
                                  if (isJustAdded) bgClass = "bg-amber-100 border-amber-400 text-amber-800 shadow-md scale-105 animate-in zoom-in-95";
                                  else if (isBeingCloned) bgClass = "bg-sky-100 border-sky-400 text-sky-800 shadow-sm scale-105";

                                  return (
                                      <div key={rIdx} className={`px-2.5 py-1 rounded-lg border flex items-center justify-center font-mono text-[10px] sm:text-xs font-bold transition-all duration-300 ${bgClass}`}>
                                          [{subset.join(', ')}]
                                      </div>
                                  )
                              })}
                              {(!res || res.length === 0) && (
                                  <div className="w-full text-center py-4 text-slate-400 font-mono italic text-xs">Waiting to add subsets...</div>
                              )}
                          </div>
                      </div>

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-emerald-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-emerald-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">ALL SUBSETS FOUND</span>
                              <span className="text-xs font-black uppercase text-emerald-600 tracking-widest font-mono mb-4 block">Generated {res?.length} combinations</span>
                              
                              <div className="bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl shadow-inner mt-2 flex flex-col items-center max-w-[280px] sm:max-w-md max-h-[150px] overflow-y-auto scrollbar-thin">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-2 sticky top-0 bg-slate-50 w-full text-center pb-1">Final Power Set</span>
                                  <div className="flex flex-wrap gap-1 justify-center text-sm font-mono font-bold text-emerald-700">
                                      {res?.map((s: number[], i: number) => (
                                          <span key={i} className="bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">[{s.join(',')}]</span>
                                      ))}
                                  </div>
                              </div>
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
                <Share2 className="text-fuchsia-600"/> Generating the Power Set
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-fuchsia-100 pl-6">
                To generate all combinations of an array, you basically make a binary choice for every single element: <strong>Do I include this element, or do I exclude it?</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Network size={18}/> Backtracking (DFS Tree)
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            Backtracking builds subsets by walking down a decision tree. 
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-3 rounded-lg border border-sky-200">
                            We add an element to our path, dive as deep as we can recursively to see what subsets we can form with it. When we hit a dead end, we <strong>backtrack</strong> by popping that element off the path, and then exploring the branch where we never picked it up in the first place.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ListPlus size={18}/> Cascading (Iterative Cloning)
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            Cascading builds subsets level-by-level without recursion.
                        </p>
                        <p className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-3 rounded-lg border border-amber-200">
                            Start with `[[]]`. <br/>
                            Process `1`: clone `[]`, add `1`. Result: `[[], [1]]`. <br/>
                            Process `2`: clone existing, add `2`. Result: `[[], [1], [2], [1, 2]]`. <br/>
                            It explicitly doubles the result size at every step.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Binary size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-fuchsia-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Why add new ArrayList&lt;&gt;(path)?</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed">
                        <p>
                           In Java and Python, objects like Lists are passed by <strong>reference</strong>. 
                        </p>
                        <div className="bg-fuchsia-900/40 border border-fuchsia-500/30 text-fuchsia-300 p-4 rounded-xl mt-4 font-mono text-[10px]">
                           // WRONG WAY<br/>
                           res.add(path); // Adds a pointer to the exact same list in memory
                        </div>
                        <p className="text-fuchsia-400 font-bold mt-2">
                            If you just do <code>res.add(path)</code>, you are putting a pointer to your `path` variable into the result list. When you later call <code>path.remove()</code>, it will erase the item from the list *inside* your results! By the end, you'd just have a giant list of empty subsets `[[], [], [], ...]`. You MUST create a new copy/snapshot of the array at that exact moment.
                        </p>
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
                        "I implemented the solution using Backtracking DFS. It's an optimal space approach compared to iterative cascading because it only maintains a single `path` array in memory that grows and shrinks up to a maximum depth of N, whereas cascading requires cloning huge amounts of arrays into memory all at once. By systematically choosing to include an element, recursing, and then popping it off (excluding it), we traverse the entire decision space in O(N * 2^N) time to safely yield all valid unique subsets."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Why is the time complexity so high?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Generating a power set fundamentally requires exponential time because the output size itself is exponential. For an array of N elements, there are strictly <code>2^N</code> subsets. Furthermore, for each of those subsets, we have to spend O(N) time copying the subset array into our final result list. Therefore, the absolute lower bound for time complexity is <code>O(N * 2^N)</code>.
                            </div>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <Timer size={14} className="text-emerald-500"/> Space Complexity Breakdown
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity (Auxiliary)</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">If we don't count the output array `res`, the only extra memory we use is the `path` list and the recursion call stack. Both will grow to a maximum depth/size of N.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity (Total)</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N * 2^N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">If the interviewer asks to include the output array, storing all 2^N subsets (which have an average length of N/2) will cost O(N * 2^N) memory.</p>
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

const VariableCard = ({ label, val, arrVal, color, active }: { label: string, val: number | string | null, arrVal?: number | string | null, color: 'blue' | 'purple' | 'amber' | 'emerald' | 'sky' | 'violet' | 'fuchsia', active: boolean }) => {
    const bgMap = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        sky: 'bg-sky-50 border-sky-200 text-sky-700',
        violet: 'bg-violet-50 border-violet-200 text-violet-700',
        fuchsia: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700'
    };
    
    const inactiveMap = 'bg-slate-50 border-slate-200 text-slate-300';

    return (
        <div className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden h-full ${active ? bgMap[color] : inactiveMap}`}>
             <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 truncate px-1">{label}</span>
             <div className="text-xl font-black font-mono leading-none">
                 {val !== null ? val : '-'}
             </div>
             {active && arrVal !== undefined && arrVal !== null && (
                 <div className="absolute bottom-0 w-full text-center bg-black/5 text-[9px] font-black py-0.5 mt-2">
                     val: {arrVal}
                 </div>
             )}
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-fuchsia-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean, theme?: 'cyan' | 'violet' | 'rose' | 'emerald' | 'amber' | 'indigo' | 'fuchsia' | 'teal' | 'blue' }> = ({ num, code, active, theme = 'fuchsia' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|char|List|Integer|ArrayList|Arrays)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'long', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'ArrayList', 'Arrays'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-yellow-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

// Simple Plus icon fallback if lucide-react Plus is missing
const Plus = ({ className, size = 24 }: { className?: string, size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default SubsetsVisualizer;