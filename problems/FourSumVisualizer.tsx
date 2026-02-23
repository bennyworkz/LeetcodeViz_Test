import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, ArrowRight, 
  ArrowDown, X, Timer, ShieldAlert, Database, 
  ListOrdered, FastForward, Hash, ArrowUp, Zap, Split, ArrowLeftRight
} from 'lucide-react';

const APPROACHES = {
  optimalTwoPointers: {
    id: 'optimalTwoPointers',
    title: '1. Sort & Two Pointers',
    subtitle: 'Optimal: O(N³) Time, O(1) Space.',
    icon: <ArrowLeftRight size={16} />,
    complexity: 'Time: O(N³) | Space: O(1)',
    code: `class Solution {
    public List<List<Integer>> fourSum(int[] nums, int target) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(nums);
        int n = nums.length;
        
        for (int i = 0; i < n - 3; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            
            for (int j = i + 1; j < n - 2; j++) {
                if (j > i + 1 && nums[j] == nums[j - 1]) continue;
                
                int left = j + 1, right = n - 1;
                while (left < right) {
                    long sum = (long)nums[i] + nums[j] + nums[left] + nums[right];
                    if (sum == target) {
                        res.add(Arrays.asList(nums[i], nums[j], nums[left], nums[right]));
                        left++;
                        right--;
                        while (left < right && nums[left] == nums[left - 1]) left++;
                        while (left < right && nums[right] == nums[right + 1]) right--;
                    } else if (sum < target) {
                        left++;
                    } else {
                        right--;
                    }
                }
            }
        }
        return res;
    }
}`,
    explanation: "The optimal approach extends the classic 3Sum solution. First, we sort the array to easily skip duplicates and enable the two-pointer technique. We use two nested outer loops (pointers 'i' and 'j') to fix the first two numbers. For the remaining two numbers, we use a 'left' and 'right' pointer sweeping inwards. By calculating their total sum, we can intelligently move the left pointer up to increase the sum, or the right pointer down to decrease the sum. We carefully skip identical adjacent numbers to ensure all resulting quadruplets are completely unique."
  },
  bruteForce: {
    id: 'bruteForce',
    title: '2. Brute Force (Naive)',
    subtitle: 'Check all combinations. O(N⁴) Time.',
    icon: <Database size={16} />,
    complexity: 'Time: O(N⁴) | Space: O(N)',
    code: `class Solution {
    public List<List<Integer>> fourSum(int[] nums, int target) {
        Set<List<Integer>> set = new HashSet<>();
        Arrays.sort(nums);
        int n = nums.length;
        
        for (int i = 0; i < n - 3; i++) {
            for (int j = i + 1; j < n - 2; j++) {
                for (int k = j + 1; k < n - 1; k++) {
                    for (int l = k + 1; l < n; l++) {
                        long sum = (long)nums[i] + nums[j] + nums[k] + nums[l];
                        if (sum == target) {
                            set.add(Arrays.asList(nums[i], nums[j], nums[k], nums[l]));
                        }
                    }
                }
            }
        }
        return new ArrayList<>(set);
    }
}`,
    explanation: "The brute-force approach simply uses four nested loops to check every single combination of 4 numbers in the array. To prevent duplicate quadruplets, we store the sorted results in a HashSet. This approach is highly inefficient and will result in a Time Limit Exceeded (TLE) error on LeetCode for larger arrays."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">18. 4Sum</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given an array <code className="bg-slate-100 px-1.5 py-0.5 rounded text-violet-600 font-mono font-bold">nums</code> of <code>n</code> integers, return <em>an array of all the <strong>unique</strong> quadruplets</em> <code>[nums[a], nums[b], nums[c], nums[d]]</code> such that:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-slate-800 marker:text-violet-500 font-medium">
            <li><code>0 &lt;= a, b, c, d &lt; n</code></li>
            <li><code>a</code>, <code>b</code>, <code>c</code>, and <code>d</code> are <strong>distinct</strong>.</li>
            <li><code>nums[a] + nums[b] + nums[c] + nums[d] == target</code></li>
        </ul>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-violet-500 pl-4 bg-violet-50 py-2 mt-4">
          You may return the answer in <strong>any order</strong>.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm flex gap-3 mt-6 items-start shadow-sm">
            <AlertCircle className="shrink-0 mt-0.5 text-amber-500" size={18} />
            <div className="space-y-2">
                <p><strong>Warning - Integer Overflow:</strong></p>
                <p>The sum of four integers can easily exceed the 32-bit signed integer limit <code>(2^31 - 1)</code>. You must safely cast to a <code>long</code> (64-bit) when adding the numbers together to prevent incorrect overflow comparisons.</p>
            </div>
        </div>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [1,0,-1,0,-2,2], target = 0</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [2,2,2,2,2], target = 8</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[2,2,2,2]]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FourSumVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState<keyof typeof APPROACHES>('optimalTwoPointers');
  const [numsInput, setNumsInput] = useState('1, 0, -1, 0, -2, 2');
  const [targetInput, setTargetInput] = useState('0');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let arr = numsInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    let target = parseInt(targetInput.trim());
    if (isNaN(target)) target = 0;
    if (arr.length === 0) arr = [1, 0, -1, 0, -2, 2];
    if (arr.length > 8) arr = arr.slice(0, 8); // Limit size for visualizer stability
    return { arr, target };
  }, [numsInput, targetInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const originalNums = [...parsedData.arr];
    const target = parsedData.target;
    
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      if (steps.length > 2000) return; // safety
      steps.push({
        phase,
        description: desc,
        line,
        state: { originalNums, target, ...state }
      });
    };

    if (selectedApproachId === 'optimalTwoPointers') {
        let res: number[][] = [];
        let nums = [...originalNums];
        
        addStep("Initialization", `Line 3: List<List<Integer>> res = new ArrayList<>();\nCreate result array.`, 3, { res: [...res], nums: [...nums], i: null, j: null, left: null, right: null });
        
        nums.sort((a, b) => a - b);
        let n = nums.length;
        addStep("Sort Array", `Line 4-5: Arrays.sort(nums); n = ${n};\nSorting the array is crucial to allow skipping duplicates and using the two-pointer technique.`, 5, { res: [...res], nums: [...nums], n, i: null, j: null, left: null, right: null });

        for (let i = 0; i < n - 3; i++) {
            addStep("Outer Loop i", `Line 7: for (int i = 0; i < n - 3; i++)\nEvaluate i = ${i}. Check if i < ${n - 3}. True.`, 7, { res: [...res], nums: [...nums], n, i, j: null, left: null, right: null });
            
            addStep("Duplicate Check (i)", `Line 8: if (i > 0 && nums[i] == nums[i - 1])\nCheck if this number is the same as the previous one to avoid duplicate quadruplets.`, 8, { res: [...res], nums: [...nums], n, i, j: null, left: null, right: null, checkingDupI: true });
            if (i > 0 && nums[i] === nums[i - 1]) {
                addStep("Skip Duplicate", `Line 8: nums[${i}] == nums[${i-1}] (${nums[i]} == ${nums[i-1]}). Skipping to prevent duplicates!`, 8, { res: [...res], nums: [...nums], n, i, j: null, left: null, right: null });
                continue;
            }
            
            for (let j = i + 1; j < n - 2; j++) {
                addStep("Inner Loop j", `Line 10: for (int j = i + 1; j < n - 2; j++)\nEvaluate j = ${j}. Check if j < ${n - 2}. True.`, 10, { res: [...res], nums: [...nums], n, i, j, left: null, right: null });
                
                addStep("Duplicate Check (j)", `Line 11: if (j > i + 1 && nums[j] == nums[j - 1])\nCheck if this second number is identical to the previous 'j' to avoid duplicates.`, 11, { res: [...res], nums: [...nums], n, i, j, left: null, right: null, checkingDupJ: true });
                if (j > i + 1 && nums[j] === nums[j - 1]) {
                    addStep("Skip Duplicate", `Line 11: nums[${j}] == nums[${j-1}] (${nums[j]} == ${nums[j-1]}). Skipping!`, 11, { res: [...res], nums: [...nums], n, i, j, left: null, right: null });
                    continue;
                }
                
                let left = j + 1;
                let right = n - 1;
                addStep("Initialize Pointers", `Line 13: int left = j + 1, right = n - 1;\nSet left = ${left} and right = ${right}. We will sweep these inwards.`, 13, { res: [...res], nums: [...nums], n, i, j, left, right });
                
                while (left < right) {
                    addStep("While Loop", `Line 14: while (left < right)\nCheck if left (${left}) < right (${right}). True.`, 14, { res: [...res], nums: [...nums], n, i, j, left, right });
                    
                    let sum = nums[i] + nums[j] + nums[left] + nums[right];
                    addStep("Calculate Sum", `Line 15: sum = nums[i] + nums[j] + nums[left] + nums[right]\nsum = ${nums[i]} + ${nums[j]} + ${nums[left]} + ${nums[right]} = ${sum}.`, 15, { res: [...res], nums: [...nums], n, i, j, left, right, currentSum: sum });
                    
                    addStep("Check Target Match", `Line 16: if (sum == target)\nDoes ${sum} == ${target}?`, 16, { res: [...res], nums: [...nums], n, i, j, left, right, currentSum: sum, checkingSum: 'match' });
                    
                    if (sum === target) {
                        res.push([nums[i], nums[j], nums[left], nums[right]]);
                        addStep("Quadruplet Found!", `Line 17: sum == target! Adding [${nums[i]}, ${nums[j]}, ${nums[left]}, ${nums[right]}] to results.`, 17, { res: [...res], nums: [...nums], n, i, j, left, right, currentSum: sum, found: true });
                        
                        left++;
                        right--;
                        addStep("Move Both Pointers", `Line 18-19: left++; right--;\nMove left to ${left} and right to ${right} to search for completely new combinations.`, 19, { res: [...res], nums: [...nums], n, i, j, left, right, currentSum: sum });
                        
                        addStep("Skip Left Duplicates", `Line 20: while (left < right && nums[left] == nums[left - 1]) left++;\nSkip identical numbers to avoid reporting the exact same quadruplet again.`, 20, { res: [...res], nums: [...nums], n, i, j, left, right, skippingLeft: true });
                        while (left < right && nums[left] === nums[left - 1]) {
                            left++;
                            addStep("Skipping...", `Line 20: Skipped duplicate. left is now ${left}.`, 20, { res: [...res], nums: [...nums], n, i, j, left, right, skippingLeft: true });
                        }
                        
                        addStep("Skip Right Duplicates", `Line 21: while (left < right && nums[right] == nums[right + 1]) right--;\nSimilarly, skip identical numbers on the right side.`, 21, { res: [...res], nums: [...nums], n, i, j, left, right, skippingRight: true });
                        while (left < right && nums[right] === nums[right + 1]) {
                            right--;
                            addStep("Skipping...", `Line 21: Skipped duplicate. right is now ${right}.`, 21, { res: [...res], nums: [...nums], n, i, j, left, right, skippingRight: true });
                        }
                        
                    } else {
                        addStep("Check Sum < Target", `Line 22: else if (sum < target)\nDoes ${sum} < ${target}?`, 22, { res: [...res], nums: [...nums], n, i, j, left, right, currentSum: sum, checkingSum: 'less' });
                        if (sum < target) {
                            left++;
                            addStep("Increase Sum", `Line 23: left++;\nSum is too small. Move the left pointer rightward (to a larger number) to increase the sum.`, 23, { res: [...res], nums: [...nums], n, i, j, left, right, currentSum: sum });
                        } else {
                            addStep("Decrease Sum", `Line 24-25: else { right--; }\nSum is too large (${sum} > ${target}). Move the right pointer leftward (to a smaller number) to decrease the sum.`, 25, { res: [...res], nums: [...nums], n, i, j, left, right, currentSum: sum, checkingSum: 'greater' });
                            right--;
                        }
                    }
                }
                addStep("While Loop Ends", `Line 14: left (${left}) is no longer < right (${right}). Finished scanning for j=${j}.`, 14, { res: [...res], nums: [...nums], n, i, j, left: null, right: null });
            }
            addStep("Inner Loop Ends", `Line 10: Finished inner loop for i=${i}.`, 10, { res: [...res], nums: [...nums], n, i, j: null, left: null, right: null });
        }
        
        addStep("Outer Loop Ends", `Line 7: Finished all iterations.`, 7, { res: [...res], nums: [...nums], n, i: null, j: null, left: null, right: null });
        addStep("Return Results", `Line 29: return res;\nReturning all ${res.length} unique quadruplets found!`, 29, { res: [...res], nums: [...nums], n, i: null, j: null, left: null, right: null, isSuccess: true });
        
    } 
    else if (selectedApproachId === 'bruteForce') {
        let res: number[][] = [];
        let nums = [...originalNums];
        nums.sort((a,b) => a-b);
        let n = nums.length;
        let set = new Set<string>();
        
        addStep("Initialization", `Line 3-5: Initialize HashSet to prevent duplicates, sort array, get length n=${n}.`, 5, { res: [...res], nums: [...nums], i: null, j: null, k: null, l: null });

        for (let i = 0; i < n - 3; i++) {
            for (let j = i + 1; j < n - 2; j++) {
                for (let k = j + 1; k < n - 1; k++) {
                    for (let l = k + 1; l < n; l++) {
                        let sum = nums[i] + nums[j] + nums[k] + nums[l];
                        addStep("Evaluate Combo", `Line 11: sum = ${nums[i]} + ${nums[j]} + ${nums[k]} + ${nums[l]} = ${sum}.`, 11, { res: [...res], nums: [...nums], i, j, k, l, currentSum: sum });
                        
                        if (sum === target) {
                            let str = `${nums[i]},${nums[j]},${nums[k]},${nums[l]}`;
                            if (!set.has(str)) {
                                set.add(str);
                                res.push([nums[i], nums[j], nums[k], nums[l]]);
                                addStep("Target Match", `Line 12: sum == target! Added to set to ensure uniqueness.`, 13, { res: [...res], nums: [...nums], i, j, k, l, currentSum: sum, found: true });
                            } else {
                                addStep("Duplicate Found", `Line 12: sum == target, but [${str}] is already in the Set. Ignored.`, 12, { res: [...res], nums: [...nums], i, j, k, l, currentSum: sum });
                            }
                        }
                    }
                }
            }
        }
        addStep("Return Results", `Line 20: Converted HashSet to List and returning ${res.length} quadruplets.`, 20, { res: [...res], nums: [...nums], i: null, j: null, k: null, l: null, isSuccess: true });
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
  const state = cur.state || { nums: parsedData.arr };
  const { isSuccess, nums, originalNums, res, target, i, j, left, right, k, l, currentSum, checkingSum, found, checkingDupI, checkingDupJ, skippingLeft, skippingRight } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Layers className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">4Sum</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 18</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Arrays / Two Pointers</span>
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
                      {/* Highlighter Bar */}
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : found ? 'bg-amber-500/20 border-amber-500' : 'bg-violet-500/20 border-violet-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="violet" />
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Variables</h4>
                      </div>
                    </div>
                    
                    {selectedApproachId === 'optimalTwoPointers' ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <VariableCard label="Index i" val={i ?? null} arrVal={i !== null && i !== undefined ? nums[i] : null} color="sky" active={i !== null && i !== undefined} />
                            <VariableCard label="Index j" val={j ?? null} arrVal={j !== null && j !== undefined ? nums[j] : null} color="indigo" active={j !== null && j !== undefined} />
                            <VariableCard label="Left Ptr" val={left ?? null} arrVal={left !== null && left !== undefined ? nums[left] : null} color="emerald" active={left !== null && left !== undefined} />
                            <VariableCard label="Right Ptr" val={right ?? null} arrVal={right !== null && right !== undefined ? nums[right] : null} color="rose" active={right !== null && right !== undefined} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-3">
                            <VariableCard label="Idx i" val={i ?? null} arrVal={i !== null ? nums[i] : null} color="sky" active={i !== null} />
                            <VariableCard label="Idx j" val={j ?? null} arrVal={j !== null ? nums[j] : null} color="indigo" active={j !== null} />
                            <VariableCard label="Idx k" val={k ?? null} arrVal={k !== null ? nums[k] : null} color="emerald" active={k !== null} />
                            <VariableCard label="Idx l" val={l ?? null} arrVal={l !== null ? nums[l] : null} color="rose" active={l !== null} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Array (comma separated)</label>
                        <input type="text" value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="1, 0, -1, 0, -2, 2" />
                    </div>
                    
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Target</label>
                        <input type="number" value={targetInput} onChange={(e) => { setTargetInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner" placeholder="0" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : found ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : <ArrowLeftRight size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : found ? "text-amber-400" : "text-violet-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : found ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line">{cur.description}</p>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-center justify-center">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 gap-10 pt-6">
                      
                      {/* Array Representation */}
                      <div className="flex gap-2 flex-wrap justify-center relative w-full mb-8">
                          {nums?.map((v: number, idx: number) => {
                              let bgClass = "bg-white";
                              let borderClass = "border-slate-200";
                              let textClass = "text-slate-800";
                              
                              let topPointer = null;
                              let bottomPointer = null;
                              let zIndex = "z-0";

                              if (selectedApproachId === 'optimalTwoPointers') {
                                  // State highlights
                                  if (idx === i) {
                                      bgClass = "bg-sky-50"; borderClass = "border-sky-400"; textClass = "text-sky-800";
                                      topPointer = { label: "i", color: "text-sky-500", bounce: checkingDupI };
                                      zIndex = "z-20";
                                  }
                                  if (idx === j) {
                                      bgClass = "bg-indigo-50"; borderClass = "border-indigo-400"; textClass = "text-indigo-800";
                                      if (topPointer) topPointer.label += ", j";
                                      else topPointer = { label: "j", color: "text-indigo-500", bounce: checkingDupJ };
                                      zIndex = "z-20";
                                  }
                                  if (idx === left) {
                                      bgClass = "bg-emerald-50"; borderClass = "border-emerald-400"; textClass = "text-emerald-800";
                                      bottomPointer = { label: "L", color: "text-emerald-500", bounce: skippingLeft };
                                      zIndex = "z-20";
                                  }
                                  if (idx === right) {
                                      bgClass = "bg-rose-50"; borderClass = "border-rose-400"; textClass = "text-rose-800";
                                      if (bottomPointer) bottomPointer.label += ", R";
                                      else bottomPointer = { label: "R", color: "text-rose-500", bounce: skippingRight };
                                      zIndex = "z-20";
                                  }

                                  // Found styling
                                  if (found && (idx === i || idx === j || idx === left || idx === right)) {
                                      bgClass = "bg-amber-100 scale-110 shadow-lg";
                                      borderClass = "border-amber-400";
                                      textClass = "text-amber-900";
                                      zIndex = "z-30";
                                  }
                              } else {
                                  // Brute force highlights
                                  if (idx === i) topPointer = { label: "i", color: "text-sky-500", bounce: false };
                                  if (idx === j) { if (topPointer) topPointer.label += ", j"; else topPointer = { label: "j", color: "text-indigo-500", bounce: false }; }
                                  if (idx === k) bottomPointer = { label: "k", color: "text-emerald-500", bounce: false };
                                  if (idx === l) { if (bottomPointer) bottomPointer.label += ", l"; else bottomPointer = { label: "l", color: "text-rose-500", bounce: false }; }
                                  
                                  if (idx === i || idx === j || idx === k || idx === l) {
                                      borderClass = "border-slate-400";
                                  }
                                  if (found && (idx === i || idx === j || idx === k || idx === l)) {
                                      bgClass = "bg-amber-100 scale-110 shadow-lg"; borderClass = "border-amber-400"; textClass = "text-amber-900"; zIndex = "z-30";
                                  }
                              }

                              return (
                                  <div key={`${idx}-${v}`} className={`flex flex-col items-center relative transition-all duration-300 ${zIndex}`}>
                                      {/* Top Pointer */}
                                      <div className="absolute -top-10 flex flex-col items-center justify-end h-8 w-full gap-1">
                                          {topPointer && (
                                              <div className={`flex flex-col items-center ${topPointer.bounce ? 'animate-bounce' : ''}`}>
                                                  <span className={`text-[10px] font-black font-mono tracking-widest ${topPointer.color} bg-white px-1 rounded`}>{topPointer.label}</span>
                                                  <ArrowDown size={14} className={topPointer.color} strokeWidth={3}/>
                                              </div>
                                          )}
                                      </div>

                                      {/* Main Box */}
                                      <div className={`w-10 h-14 md:w-14 md:h-16 border-2 rounded-2xl flex flex-col items-center justify-center font-mono font-black text-xl transition-all duration-500 ${bgClass} ${borderClass} ${textClass}`}>
                                          <span>{v}</span>
                                      </div>
                                      
                                      {/* Bottom Pointer & Index */}
                                      <div className="absolute -bottom-12 flex flex-col items-center justify-start h-10 w-full gap-1">
                                          <span className="text-[10px] font-mono font-bold text-slate-400 mt-1">{idx}</span>
                                          {bottomPointer && (
                                              <div className={`flex flex-col items-center ${bottomPointer.bounce ? 'animate-bounce' : ''}`}>
                                                  <ArrowUp size={14} className={bottomPointer.color} strokeWidth={3}/>
                                                  <span className={`text-[10px] font-black font-mono tracking-widest ${bottomPointer.color} bg-white px-1 rounded whitespace-nowrap`}>{bottomPointer.label}</span>
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              );
                          })}
                      </div>

                      {/* Equation UI */}
                      {currentSum !== undefined && currentSum !== null && (
                          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center animate-in slide-in-from-bottom-2">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-3">Sum Evaluation</span>
                              <div className="flex items-center gap-2 md:gap-4 text-lg md:text-2xl font-mono font-black">
                                  <span className="text-sky-600">{nums[i]}</span>
                                  <span className="text-slate-300">+</span>
                                  <span className="text-indigo-600">{nums[j]}</span>
                                  <span className="text-slate-300">+</span>
                                  <span className="text-emerald-600">{selectedApproachId === 'optimalTwoPointers' ? nums[left] : nums[k]}</span>
                                  <span className="text-slate-300">+</span>
                                  <span className="text-rose-600">{selectedApproachId === 'optimalTwoPointers' ? nums[right] : nums[l]}</span>
                                  
                                  <span className="text-slate-400 mx-2">=</span>
                                  
                                  <span className={`px-4 py-1 rounded-xl border-2 transition-colors ${found ? 'bg-amber-100 text-amber-700 border-amber-400' : 'bg-white text-slate-700 border-slate-300'}`}>
                                      {currentSum}
                                  </span>

                                  <span className="text-slate-400 mx-2">{checkingSum === 'match' ? '==' : checkingSum === 'less' ? '<' : checkingSum === 'greater' ? '>' : 'vs'}</span>
                                  <span className="text-slate-800 border-b-2 border-slate-800 border-dashed">{target}</span>
                              </div>
                          </div>
                      )}

                      {/* Results Array */}
                      <div className="flex-1 flex flex-col w-full mt-4">
                          <div className="flex justify-between items-end mb-2 px-1">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono flex items-center gap-2"><Database size={14}/> Result Array (res)</span>
                              {res && <span className="text-[10px] font-black text-slate-400 font-mono">{res.length} Found</span>}
                          </div>
                          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-3xl p-4 overflow-y-auto shadow-inner flex flex-wrap content-start gap-2 max-h-32">
                              {res && res.map((subset: number[], rIdx: number) => {
                                  const isJustAdded = rIdx === res.length - 1 && found;
                                  return (
                                      <div key={rIdx} className={`px-2.5 py-1 rounded-lg border flex items-center justify-center font-mono text-[10px] sm:text-xs font-bold transition-all duration-300 ${isJustAdded ? 'bg-amber-100 border-amber-400 text-amber-800 scale-105 shadow-sm' : 'bg-white border-slate-200 text-slate-700'}`}>
                                          [{subset.join(', ')}]
                                      </div>
                                  )
                              })}
                              {(!res || res.length === 0) && (
                                  <div className="w-full text-center py-4 text-slate-400 font-mono italic text-xs">Waiting for quadruplets...</div>
                              )}
                          </div>
                      </div>

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-emerald-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-emerald-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">SEARCH COMPLETE</span>
                              <span className="text-xs font-black uppercase text-emerald-600 tracking-widest font-mono mb-4 block">Found {res?.length} unique quadruplets</span>
                              
                              <div className="bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl shadow-inner mt-2 flex flex-col items-center max-w-[280px] sm:max-w-md max-h-[150px] overflow-y-auto scrollbar-thin">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-2 sticky top-0 bg-slate-50 w-full text-center pb-1">Final Output Array</span>
                                  <div className="flex flex-col gap-1 font-mono text-sm font-bold text-slate-700">
                                      {res.length > 0 ? res.map((row: number[], i: number) => (
                                          <div key={i}>[{row.join(', ')}]</div>
                                      )) : <div>[]</div>}
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
                <ArrowLeftRight className="text-violet-600"/> The K-Sum Pattern
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                4Sum is a natural extension of 2Sum and 3Sum. The core pattern for any K-Sum problem is to use <code className="font-bold text-violet-600">K - 2</code> nested loops to fix the first numbers, and then use the <strong>Two Pointer</strong> technique to find the remaining two numbers in <code className="font-bold text-violet-600">O(N)</code> time.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ListOrdered size={18}/> Why must we sort?
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            Sorting the array (O(N log N)) is the crucial first step that enables everything else. 
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-3 rounded-lg border border-sky-200">
                            1. It allows the Two Pointer technique to work (we know moving left increases sum, moving right decreases sum).<br/><br/>
                            2. It puts identical numbers next to each other, making it trivial to skip duplicates to satisfy the "unique quadruplets" constraint.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Zap size={18}/> Skipping Duplicates
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            If the array is <code>[2, 2, 2, 3]</code>, and we use the first '2' for pointer `i`, we shouldn't use the second '2' for pointer `i` in the next iteration, because it will just generate the exact same combinations.
                        </p>
                        <p className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-3 rounded-lg border border-amber-200">
                            We simply check <code>if (nums[i] == nums[i-1]) continue;</code>. We do this for all four pointers (i, j, left, right) to ensure perfectly unique results without needing a slow HashSet.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Database size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-violet-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">The Overflow Trap (Long Casting)</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed">
                        <p>
                           In LeetCode, arrays can contain large numbers like <code>1,000,000,000</code>. If you add four of these together, the sum is <code>4,000,000,000</code>.
                        </p>
                        <p>
                           A standard 32-bit signed integer in Java/C++ can only hold up to <code>2,147,483,647</code>. If you exceed this, the number "overflows" and wraps around to a negative number, causing your <code>sum == target</code> check to mysteriously fail.
                        </p>
                        <div className="bg-violet-900/40 border border-violet-500/30 text-violet-300 p-4 rounded-xl mt-4 font-mono text-[10px]">
                           // WRONG:<br/>
                           int sum = nums[i] + nums[j] + nums[left] + nums[right];<br/><br/>
                           // CORRECT (Cast the very first element to force a 64-bit operation):<br/>
                           long sum = (long)nums[i] + nums[j] + nums[left] + nums[right];
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
                        "I solved this using the optimal Two Pointers approach. While a brute force solution checks every combination in O(N⁴) time, we can optimize this heavily. By first sorting the array, I can use two outer loops to anchor the first two numbers, and then use two pointers sweeping inwards to find the remaining sum in linear time. This reduces the total time complexity to O(N³). Sorting also naturally groups identical numbers together, allowing me to trivially skip duplicates at all four pointer levels to guarantee unique quadruplets without relying on O(N) extra space for a HashSet."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Can we optimize further to O(N²)?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                You *can* achieve O(N²) time using a Hash Map that stores the sums of all pairs. However, this comes at the cost of O(N²) auxiliary space, and handling the "unique quadruplets" and "distinct indices" constraints becomes incredibly complex and messy. The O(N³) Two Pointer approach is universally considered the best balance of time, O(1) space, and clean code for this specific problem.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N³)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Sorting takes O(N log N). The two nested outer loops take O(N²). The inner while loop processes the remaining elements in O(N). Total time is dominated by the loops: O(N³).</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1) or O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Ignoring the output array, the two-pointer logic itself requires O(1) memory. However, many built-in sorting algorithms (like Timsort in Java) require O(N) auxiliary space.</p>
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

const VariableCard = ({ label, val, arrVal, color, active }: { label: string, val: number | string | null, arrVal?: number | string | null, color: 'blue' | 'purple' | 'amber' | 'emerald' | 'sky' | 'violet' | 'rose' | 'indigo', active: boolean }) => {
    const bgMap = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        sky: 'bg-sky-50 border-sky-200 text-sky-700',
        violet: 'bg-violet-50 border-violet-200 text-violet-700',
        rose: 'bg-rose-50 border-rose-200 text-rose-700',
        indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700'
    };
    
    const inactiveMap = 'bg-slate-50 border-slate-200 text-slate-300';

    return (
        <div className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden h-full ${active ? bgMap[color] : inactiveMap}`}>
             <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 truncate px-1">{label}</span>
             <div className={`text-xl font-black font-mono leading-none`}>
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean, theme?: 'cyan' | 'violet' | 'rose' | 'emerald' | 'amber' | 'indigo' | 'fuchsia' | 'teal' | 'blue' }> = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for', 'continue', 'break'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'long', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math', 'Arrays', 'ArrayList'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-yellow-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default FourSumVisualizer;