import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, ArrowRight, 
  ArrowDown, X, Timer, ArrowUp, RefreshCw, 
  ShieldAlert, ArrowRightLeft, TrendingDown, ListOrdered, FastForward, Database, Network,
  ArrowLeftRight
} from 'lucide-react';

const APPROACHES = {
  bruteForce: {
    id: 'bruteForce',
    title: '1. Brute Force (All Perms)',
    subtitle: 'Generate all, sort, find next.',
    icon: <Database size={16} />,
    complexity: 'Time: O(N!) | Space: O(N!)',
    code: `class Solution {
    public void nextPermutation(int[] nums) {
        List<List<Integer>> perms = new ArrayList<>();
        generatePerms(nums, 0, perms); // O(N!) time
        
        // Sort permutations lexicographically
        perms.sort((a, b) -> {
            for (int i = 0; i < a.size(); i++) {
                if (!a.get(i).equals(b.get(i))) {
                    return a.get(i) - b.get(i);
                }
            }
            return 0;
        });
        
        // Find current array in the sorted list
        List<Integer> target = Arrays.stream(nums).boxed().collect(Collectors.toList());
        int idx = perms.indexOf(target);
        
        // Get the next one (wrap around to 0 if at the end)
        List<Integer> next = perms.get((idx + 1) % perms.size());
        
        for (int i = 0; i < nums.length; i++) {
            nums[i] = next.get(i);
        }
    }
}`,
    explanation: "This approach is purely conceptual for educational purposes and fails Time Limit Exceeded (TLE) constraints on LeetCode. You recursively generate every single possible permutation of the array (which takes O(N!) time), store them, sort them lexicographically, and then scan through to find the given input and return the one right after it."
  },
  optimalLinear: {
    id: 'optimalLinear',
    title: '2. Optimal In-Place',
    subtitle: 'Pivot, Swap, and Reverse Suffix',
    icon: <ArrowRightLeft size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public void nextPermutation(int[] nums) {
        int i = nums.length - 2;
        
        // 1. Find the first decreasing element from the end
        while (i >= 0 && nums[i] >= nums[i + 1]) {
            i--;
        }
        
        // 2. If found, find the next strictly greater element
        if (i >= 0) {
            int j = nums.length - 1;
            while (j >= 0 && nums[j] <= nums[i]) {
                j--;
            }
            // 3. Swap them
            swap(nums, i, j);
        }
        
        // 4. Reverse the suffix to make it the lowest possible order
        reverse(nums, i + 1, nums.length - 1);
    }
    
    private void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
    
    private void reverse(int[] nums, int start, int end) {
        while (start < end) {
            swap(nums, start, end);
            start++;
            end--;
        }
    }
}`,
    explanation: "The standard algorithm for generating the next lexicographical permutation. It relies on finding the longest non-increasing suffix. The element just before this suffix is the 'pivot'. We swap the pivot with the smallest element in the suffix that is greater than the pivot. Finally, reversing the suffix sorts it in ascending order, giving us the absolute next valid permutation."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">31. Next Permutation</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
        <p className="text-lg leading-relaxed">
          A <strong>permutation</strong> of an array of integers is an arrangement of its members into a sequence or linear order.
        </p>
        <p className="text-lg leading-relaxed">
          For example, for <code>arr = [1,2,3]</code>, the following are all the permutations of <code>arr</code>: <code>[1,2,3], [1,3,2], [2, 1, 3], [2, 3, 1], [3,1,2], [3,2,1]</code>.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-teal-500 pl-4 bg-teal-50 py-2">
          The <strong>next permutation</strong> of an array of integers is the next lexicographically greater permutation of its integer. More formally, if all the permutations of the array are sorted in one container according to their lexicographical order, then the next permutation of that array is the permutation that follows it in the sorted container.
        </p>
        
        <p className="text-lg leading-relaxed">
           If such arrangement is not possible, the array must be rearranged as the lowest possible order (i.e., sorted in ascending order).
        </p>

        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 text-sm flex gap-3 mt-4 items-start">
            <ShieldAlert className="shrink-0 mt-0.5 text-rose-500" size={18} />
            <div>
                <strong>Constraint:</strong> The replacement must be <strong>in place</strong> and use only constant extra memory.
            </div>
        </div>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [1,2,3]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [1,3,2]</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [3,2,1]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [1,2,3]</p>
              <p className="text-slate-500 text-xs mt-2 border-t border-slate-200 pt-2"><span className="text-slate-400 font-bold">Explanation:</span> This is the last permutation. The next one wraps around to the lowest possible order.</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [1,1,5]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [1,5,1]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const NextPermutationVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState<keyof typeof APPROACHES>('optimalLinear');
  const [numsInput, setNumsInput] = useState('1, 3, 5, 4, 2');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedNums = useMemo(() => {
    let arr = numsInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (arr.length === 0) return [1, 2, 3];
    // Limit array size for visualizer to prevent crash on Brute Force
    if (arr.length > 6) arr = arr.slice(0, 6);
    return arr;
  }, [numsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const nums = [...parsedNums];
    const n = nums.length;
    
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({
        phase,
        description: desc,
        line,
        state: { nums: [...nums], ...state }
      });
    };

    if (selectedApproachId === 'bruteForce') {
        // Generate unique permutations
        const permSet = new Set<string>();
        const generate = (arr: number[], curr: number[]) => {
           if (arr.length === 0) permSet.add(curr.join(','));
           for (let idx = 0; idx < arr.length; idx++) {
               generate(arr.filter((_, i) => i !== idx), [...curr, arr[idx]]);
           }
        };
        generate([...nums], []);
        
        let allPerms = Array.from(permSet).map(s => s.split(',').map(Number));
        
        addStep("Phase 1: Generation", `Recursively generated all ${allPerms.length} unique permutations of the array.`, 4, { allPerms: [], targetIdx: null, nextIdx: null });

        // Sort lexicographically
        allPerms.sort((a, b) => {
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) return a[i] - b[i];
            }
            return 0;
        });

        addStep("Phase 2: Sort", `Sorted the entire list of permutations lexicographically.`, 8, { allPerms, targetIdx: null, nextIdx: null });

        const targetStr = nums.join(',');
        const targetIdx = allPerms.findIndex(p => p.join(',') === targetStr);
        
        addStep("Phase 3: Find Target", `Iterating through the sorted list to find our current arrangement [${targetStr}]. Found at index ${targetIdx}.`, 18, { allPerms, targetIdx, nextIdx: null });

        const nextIdx = (targetIdx + 1) % allPerms.length;
        const nextArr = allPerms[nextIdx];

        addStep("Phase 4: Return Next", `The next permutation is simply the element at index ${(targetIdx + 1)} % ${allPerms.length} = ${nextIdx}. Array becomes [${nextArr.join(', ')}].`, 21, { allPerms, targetIdx, nextIdx, isSuccess: true });
        
    } 
    else if (selectedApproachId === 'optimalLinear') {
        let i = n - 2;
        addStep("Phase 1: Find Pivot", "Start from the right. Find the first element that is strictly smaller than the element to its right.", 3, { i, j: null, l: null, r: null, phaseIdx: 1 });

        while (i >= 0) {
            addStep("Check Decreasing", `Is nums[${i}] (${nums[i]}) >= nums[${i+1}] (${nums[i+1]})?`, 6, { i, comparePivot: true, phaseIdx: 1 });
            if (nums[i] >= nums[i + 1]) {
                i--;
                addStep("Move Left", `Yes. The suffix is still weakly decreasing. Move i left.`, 7, { i, phaseIdx: 1 });
            } else {
                addStep("Pivot Found", `No! ${nums[i]} < ${nums[i+1]}. Found the pivot at index ${i}.`, 6, { i, pivotFound: true, phaseIdx: 1 });
                break;
            }
        }

        if (i >= 0) {
            let j = n - 1;
            addStep("Phase 2: Find Successor", `Look to the right of the pivot for the smallest element strictly greater than the pivot (${nums[i]}). Start from the far right.`, 11, { i, j, phaseIdx: 2 });
            
            while (j >= 0) {
                addStep("Check Successor", `Is nums[${j}] (${nums[j]}) <= pivot (${nums[i]})?`, 13, { i, j, compareSuccessor: true, phaseIdx: 2 });
                if (nums[j] <= nums[i]) {
                    j--;
                    addStep("Move Left", `Yes, it's not strictly greater. Move j left.`, 14, { i, j, phaseIdx: 2 });
                } else {
                    addStep("Successor Found", `No! ${nums[j]} > ${nums[i]}. Found the successor at index ${j}.`, 13, { i, j, successorFound: true, phaseIdx: 2 });
                    break;
                }
            }

            addStep("Phase 3: Swap", `Swap pivot nums[${i}] and successor nums[${j}].`, 17, { i, j, swapping: true, phaseIdx: 3 });
            let temp = nums[i];
            nums[i] = nums[j];
            nums[j] = temp;
            addStep("Swapped", `Values swapped. The prefix is now officially strictly greater.`, 17, { i, j, phaseIdx: 3 });
        } else {
            addStep("No Pivot Found", `The entire array is in descending order. This is the last permutation. We will just reverse the whole array.`, 10, { i, phaseIdx: 1 });
        }

        let left = i + 1;
        let right = n - 1;
        addStep("Phase 4: Reverse Suffix", `The suffix from index ${left} to ${right} is currently in descending order. Reverse it to make it ascending (lowest possible order).`, 21, { i, l: left, r: right, phaseIdx: 4 });

        while (left < right) {
            addStep("Reverse Swap", `Swap nums[${left}] and nums[${right}].`, 32, { i, l: left, r: right, reversing: true, phaseIdx: 4 });
            let temp = nums[left];
            nums[left] = nums[right];
            nums[right] = temp;
            addStep("Reversed Pointers", `Values swapped. Update left and right pointers.`, 32, { i, l: left, r: right, phaseIdx: 4 });
            left++;
            right--;
        }

        addStep("Complete", `Algorithm finished. Next permutation generated!`, 22, { i, isSuccess: true, phaseIdx: 5 });
    }

    if (steps.length === 0) {
        addStep("Init", "Start", 1, {});
    }

    return steps;
  }, [parsedNums, selectedApproachId]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedApproach.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0] || { state: {} };
  const state = cur.state || { nums: parsedNums };
  const { isSuccess, nums, i, j, l, r, phaseIdx, comparePivot, compareSuccessor, swapping, reversing, allPerms, targetIdx, nextIdx } = state;

  // Auto-scroll the permutations list to the active item
  const permListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
     if (selectedApproachId === 'bruteForce' && targetIdx !== null && permListRef.current) {
         const targetElem = permListRef.current.children[targetIdx] as HTMLElement;
         if (targetElem) {
             targetElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
         }
     }
  }, [targetIdx, selectedApproachId, currentStep]);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-teal-600 p-4 rounded-2xl shadow-lg shadow-teal-100 flex items-center justify-center">
                <FastForward className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Next Permutation</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 31</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Array Manipulation</span>
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
              
              {/* Left Col: Code & Variable Context (5/12) */}
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
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-teal-600 border-teal-600 text-white shadow-teal-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-teal-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                                    <span>{time}</span>
                                    <span>{space}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="bg-[#0f172a] rounded-3xl h-[460px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={14} className="text-teal-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {/* Highlighter Bar */}
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : 'bg-teal-500/20 border-teal-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="teal" />
                      ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-teal-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Current Variables</h4>
                      </div>
                    </div>
                    
                    {selectedApproachId === 'optimalLinear' ? (
                        <div className="grid grid-cols-4 gap-2">
                            <VariableCard label="Pivot (i)" val={i >= 0 ? i : null} color="blue" active={i !== undefined && i >= 0} />
                            <VariableCard label="Succ (j)" val={j ?? null} color="violet" active={j !== null && j !== undefined} />
                            <VariableCard label="Rev (L)" val={l ?? null} color="amber" active={l !== null && l !== undefined} />
                            <VariableCard label="Rev (R)" val={r ?? null} color="amber" active={r !== null && r !== undefined} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            <VariableCard label="Total Perms" val={allPerms ? allPerms.length : null} color="blue" active={allPerms && allPerms.length > 0} />
                            <VariableCard label="Target Idx" val={targetIdx ?? null} color="amber" active={targetIdx !== null} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Simulation Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-teal-600 uppercase block pl-1 tracking-widest font-mono">Array (comma separated)</label>
                        <input type="text" value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all shadow-inner" placeholder="1, 3, 5, 4, 2" />
                        {parsedNums.length > 6 && <span className="text-[9px] text-amber-500 font-bold block mt-1 px-1 flex gap-1 items-center"><AlertCircle size={10}/> Limited to N=6 to prevent browser crash.</span>}
                    </div>
                    
                    <div className="hidden xl:flex gap-2">
                       <button onClick={() => {setNumsInput('3, 2, 1'); setCurrentStep(0);}} className="text-[10px] font-black uppercase text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 hover:bg-rose-100 transition-colors">Wrap Around</button>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-teal-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-teal-100 hover:bg-teal-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Action Log / Status */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      <ListOrdered size={100}/>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : "text-teal-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        {phaseIdx && (
                             <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter bg-slate-800 text-slate-300 border border-slate-700`}>Phase {phaseIdx} / 4</div>
                        )}
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line">{cur.description}</p>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner items-center justify-center min-h-[420px]">
                   
                   {/* OPTIMAL APPROACH VISUAL */}
                   {selectedApproachId === 'optimalLinear' && (
                       <div className="flex flex-col items-center w-full relative z-10">
                          
                          {/* Array Graph / Bars (Mental Model visualization) */}
                          <div className="flex items-end gap-2 mb-12 h-24 border-b-2 border-slate-100 pb-2 w-full justify-center">
                              {nums.map((val: number, idx: number) => {
                                 // Normalize heights for visualization
                                 const maxVal = Math.max(...nums) || 1;
                                 const minVal = Math.min(...nums) || 0;
                                 const normalizedHeight = maxVal === minVal ? 50 : 20 + ((val - minVal) / (maxVal - minVal)) * 80;
                                 
                                 let barColor = "bg-slate-200";
                                 if (idx === i) barColor = "bg-blue-400";
                                 if (idx === j) barColor = "bg-violet-400";
                                 if (phaseIdx === 4 && idx >= i + 1) barColor = "bg-amber-300";

                                 return (
                                     <div key={`bar-${idx}`} className="flex flex-col items-center gap-2 group">
                                         <div 
                                            className={`w-8 md:w-12 rounded-t-lg transition-all duration-500 ${barColor}`} 
                                            style={{ height: `${normalizedHeight}%` }}
                                         />
                                     </div>
                                 )
                              })}
                          </div>

                          {/* Actual Array Blocks */}
                          <div className="flex gap-2 flex-wrap justify-center relative w-full">
                              {nums.map((val: number, idx: number) => {
                                  
                                  let bgClass = "bg-white";
                                  let borderClass = "border-slate-200";
                                  let textClass = "text-slate-800";
                                  let topPointer = null;
                                  let bottomPointer = null;

                                  // Style logic based on phase and pointers
                                  if (phaseIdx === 1) {
                                      if (idx > i) {
                                          bgClass = "bg-rose-50 opacity-70"; // decreasing suffix
                                          borderClass = "border-rose-100";
                                      }
                                      if (idx === i) {
                                          bgClass = "bg-blue-50 scale-110 shadow-md z-10";
                                          borderClass = "border-blue-400";
                                          topPointer = { label: "i (pivot)", color: "text-blue-500", bounce: true };
                                      }
                                      if (comparePivot && (idx === i || idx === i + 1)) {
                                          borderClass = "border-blue-500 border-dashed";
                                      }
                                  } else if (phaseIdx === 2 || phaseIdx === 3) {
                                      if (idx > i) {
                                          bgClass = "bg-rose-50 opacity-70";
                                      }
                                      if (idx === i) {
                                          bgClass = "bg-blue-50";
                                          borderClass = "border-blue-400";
                                          topPointer = { label: "i (pivot)", color: "text-blue-500", bounce: false };
                                      }
                                      if (idx === j) {
                                          bgClass = "bg-violet-50 scale-110 shadow-md z-10";
                                          borderClass = "border-violet-400";
                                          bottomPointer = { label: "j (succ)", color: "text-violet-500", bounce: true };
                                      }
                                      if (swapping && (idx === i || idx === j)) {
                                          bgClass = "bg-teal-100 scale-125 shadow-xl z-20";
                                          borderClass = "border-teal-500";
                                      }
                                  } else if (phaseIdx === 4) {
                                      if (idx > i) {
                                          bgClass = "bg-amber-50";
                                          borderClass = "border-amber-200";
                                      }
                                      if (idx === l) {
                                          bgClass = "bg-amber-100 scale-110 shadow-md z-10";
                                          borderClass = "border-amber-400";
                                          bottomPointer = { label: "left", color: "text-amber-600", bounce: true };
                                      }
                                      if (idx === r) {
                                          bgClass = "bg-amber-100 scale-110 shadow-md z-10";
                                          borderClass = "border-amber-400";
                                          bottomPointer = { label: "right", color: "text-amber-600", bounce: true };
                                      }
                                      if (reversing && (idx === l || idx === r)) {
                                          bgClass = "bg-teal-100 scale-125 shadow-xl z-20";
                                          borderClass = "border-teal-500";
                                      }
                                  }

                                  if (isSuccess) {
                                      bgClass = "bg-emerald-50 shadow-sm";
                                      borderClass = "border-emerald-300";
                                      textClass = "text-emerald-800";
                                      topPointer = null;
                                      bottomPointer = null;
                                  }

                                  return (
                                      <div key={`${idx}-${val}`} className="flex flex-col items-center relative transition-all duration-300 mb-8 mt-8">
                                          {/* Top Pointer */}
                                          <div className="absolute -top-10 flex flex-col items-center justify-end h-8 w-full gap-1">
                                              {topPointer && (
                                                  <div className={`flex flex-col items-center ${topPointer.bounce ? 'animate-bounce' : ''}`}>
                                                      <span className={`text-[9px] font-black font-mono tracking-widest ${topPointer.color}`}>{topPointer.label}</span>
                                                      <ArrowDown size={14} className={topPointer.color} strokeWidth={3}/>
                                                  </div>
                                              )}
                                          </div>

                                          {/* Main Box */}
                                          <div className={`w-12 h-16 md:w-16 md:h-20 border-2 rounded-2xl flex items-center justify-center font-mono font-black text-2xl transition-all duration-500 ${bgClass} ${borderClass} ${textClass}`}>
                                              {val}
                                          </div>
                                          
                                          {/* Bottom Pointer & Index */}
                                          <div className="absolute -bottom-12 flex flex-col items-center justify-start h-10 w-full gap-1">
                                              <span className={`text-[10px] font-mono font-bold mt-1 ${isSuccess ? 'text-emerald-400' : 'text-slate-300'}`}>{idx}</span>
                                              {bottomPointer && (
                                                  <div className={`flex flex-col items-center ${bottomPointer.bounce ? 'animate-bounce' : ''}`}>
                                                      <ArrowUp size={14} className={bottomPointer.color} strokeWidth={3}/>
                                                      <span className={`text-[9px] font-black font-mono tracking-widest ${bottomPointer.color}`}>{bottomPointer.label}</span>
                                                  </div>
                                              )}
                                          </div>
                                      </div>
                                  );
                              })}
                          </div>
                       </div>
                   )}

                   {/* BRUTE FORCE APPROACH VISUAL */}
                   {selectedApproachId === 'bruteForce' && allPerms && (
                        <div className="w-full h-full flex flex-col items-center z-10 absolute inset-0 py-8 px-4 bg-slate-50/50">
                            <div className="flex items-center gap-2 mb-4 text-slate-500">
                                <Database size={16} />
                                <h3 className="font-black uppercase tracking-widest text-xs">Sorted Permutation Space ({allPerms.length} total)</h3>
                            </div>
                            <div ref={permListRef} className="flex-1 w-full max-w-sm overflow-y-auto bg-white border border-slate-200 rounded-3xl shadow-inner p-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-300 relative">
                                {allPerms.map((perm: number[], pIdx: number) => {
                                    const isTarget = targetIdx === pIdx;
                                    const isNext = nextIdx === pIdx;
                                    
                                    let itemClass = "text-slate-500 bg-white border-transparent hover:bg-slate-50";
                                    if (isTarget) itemClass = "text-blue-800 bg-blue-100 border-blue-300 shadow-md scale-[1.02] z-10 font-bold sticky top-0 bottom-0";
                                    else if (isNext) itemClass = "text-emerald-800 bg-emerald-100 border-emerald-300 shadow-md scale-[1.02] z-10 font-bold sticky top-0 bottom-0";

                                    return (
                                        <div key={pIdx} className={`flex items-center justify-between px-4 py-2 rounded-xl border transition-all duration-300 font-mono text-sm ${itemClass}`}>
                                            <div className="flex items-center gap-4">
                                                <span className="opacity-40 text-[10px] w-8">{pIdx}</span>
                                                <span>[{perm.join(', ')}]</span>
                                            </div>
                                            {isTarget && <span className="text-[10px] uppercase font-black tracking-widest text-blue-500 flex items-center gap-1"><ArrowRight size={12}/> Current</span>}
                                            {isNext && <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 flex items-center gap-1"><Check size={12}/> Next</span>}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                   )}

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-emerald-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-emerald-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">PERMUTATION COMPLETE</span>
                              <span className="text-xs font-black uppercase text-emerald-600 tracking-widest font-mono mb-4 block">Sorted lexicographically</span>
                              
                              <div className="bg-slate-50 border border-slate-200 px-6 py-3 rounded-2xl shadow-inner mt-2">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Final Output</span>
                                  <span className="text-xl font-mono font-black text-slate-800 tracking-widest">
                                      [ {(selectedApproachId === 'optimalLinear' ? nums : (allPerms && nextIdx !== null ? allPerms[nextIdx] : [])).join(', ')} ]
                                  </span>
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
                <TrendingDown className="text-teal-600"/> The "Mountain" Mental Model
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-teal-100 pl-6">
                To find the <em>next</em> greater permutation, we must change the array as little as possible. We want to find the right-most place where we can substitute a number for a slightly larger one.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowLeftRight size={18}/> Phase 1: The Longest Suffix
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            If an array is sorted in descending order (e.g., <code>[5, 4, 3, 2, 1]</code>), it is already at its absolute maximum value. No rearrangement can make it larger. 
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-3 rounded-lg border border-sky-200">
                            We scan from the right to find the longest decreasing suffix. The element just before this suffix is our "Pivot". It is the first number we can actually swap to make the overall array larger.
                        </p>
                    </div>
                    
                    <div className="p-8 bg-violet-50 border border-violet-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-violet-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Target size={18}/> Phase 2: The Smallest Upgrade
                        </h3>
                        <p className="text-xs text-violet-800 leading-relaxed mb-4">
                            We need to replace the Pivot with a number that is <em>larger</em> than it, but as small as possible to minimize the increase (since we want the <em>very next</em> permutation).
                        </p>
                        <p className="text-xs text-violet-800 leading-relaxed font-bold bg-white p-3 rounded-lg border border-violet-200">
                            We scan the suffix from the right again. Because the suffix is in descending order, the first number we find that is greater than the Pivot is guaranteed to be the smallest possible upgrade. We swap them.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <RefreshCw size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-teal-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Phase 3: The Reset (Reverse)</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed">
                        <p>
                           After the swap, the prefix of our array is perfectly set for the "next" permutation. However, the suffix is still sorted in descending order (maximum possible arrangement for those remaining digits).
                        </p>
                        <p>
                           To get the absolute <em>lowest</em> possible arrangement for the suffix, it needs to be sorted in ascending order.
                        </p>
                        <div className="bg-teal-900/40 border border-teal-500/30 text-teal-300 p-4 rounded-xl mt-4 font-mono text-[10px] flex items-center justify-between">
                           <span>[ 5, 4, 3, 2, 1 ]</span>
                           <ArrowRight size={14} className="text-teal-500" />
                           <span>[ 1, 2, 3, 4, 5 ]</span>
                        </div>
                        <p className="text-teal-400 font-bold mt-2">
                            Because the suffix is perfectly descending, we don't need an O(N log N) sort! A simple two-pointer O(N) reverse will perfectly sort it.
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
                        "The standard algorithm solves this perfectly in O(N) time and O(1) space. I avoided using sorting algorithms for the suffix because I recognized that the suffix is strictly guaranteed to be in descending order by the definition of the pivot finding step. Therefore, a simple two-pointer reversal is mathematically equivalent to sorting the suffix, dropping the time complexity from O(N log N) to purely linear O(N)."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: What if it's the last permutation?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                If the input is <code>[3, 2, 1]</code>, the first <code>while</code> loop will run until <code>i</code> becomes <code>-1</code>, meaning it never found a non-decreasing element (no pivot exists). The code gracefully bypasses the successor/swap logic (since <code>i &lt; 0</code>) and immediately drops down to the <code>reverse</code> function, reversing the entire array from <code>0</code> to <code>n-1</code> to produce <code>[1, 2, 3]</code>.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">In the worst case, we scan from right to left to find the pivot, scan again to find the successor, and then reverse the suffix. This constitutes at most 3 linear passes over the array.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">All manipulations (swapping, reversing) are done in-place by swapping indices. No additional arrays or data structures are allocated.</p>
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

const VariableCard = ({ label, val, color, active }: { label: string, val: number | string | null, color: 'blue' | 'purple' | 'amber' | 'emerald' | 'sky' | 'violet', active: boolean }) => {
    const bgMap = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        sky: 'bg-sky-50 border-sky-200 text-sky-700',
        violet: 'bg-violet-50 border-violet-200 text-violet-700'
    };
    
    const inactiveMap = 'bg-slate-50 border-slate-200 text-slate-300';

    return (
        <div className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden ${active ? bgMap[color] : inactiveMap}`}>
             <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 truncate px-1">{label}</span>
             <div className="text-xl font-black font-mono leading-none">
                 {val !== null ? val : '-'}
             </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean, theme?: 'cyan' | 'violet' | 'rose' | 'emerald' | 'amber' | 'indigo' | 'fuchsia' | 'teal' }> = ({ num, code, active, theme = 'teal' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|char|List|Integer|ArrayList|Arrays|Collectors)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'ArrayList', 'Arrays', 'Collectors'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-yellow-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default NextPermutationVisualizer;