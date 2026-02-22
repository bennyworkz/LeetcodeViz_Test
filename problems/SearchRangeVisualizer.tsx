import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, ArrowRight, 
  ArrowDown, X, Timer, ShieldAlert, Database, 
  Search, Crosshair, Split, Hash, Network, ArrowUp, FastForward, ScanSearch
} from 'lucide-react';

const APPROACHES = {
  doubleBinarySearch: {
    id: 'doubleBinarySearch',
    title: '1. Double Binary Search',
    subtitle: 'Optimal: O(log N) boundary finding.',
    icon: <Split size={16} />,
    complexity: 'Time: O(log N) | Space: O(1)',
    code: `class Solution {
    public int[] searchRange(int[] nums, int target) {
        int[] ans = {-1, -1};
        
        // Find the first occurrence
        ans[0] = binarySearch(nums, target, true);
        
        // If the target exists, find the last occurrence
        if (ans[0] != -1) {
            ans[1] = binarySearch(nums, target, false);
        }
        
        return ans;
    }
    
    private int binarySearch(int[] nums, int target, boolean findFirst) {
        int left = 0, right = nums.length - 1, ans = -1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] < target) {
                left = mid + 1;
            } else if (nums[mid] > target) {
                right = mid - 1;
            } else {
                ans = mid; // Match found! Record it.
                if (findFirst) {
                    right = mid - 1; // Keep searching LEFT for an earlier match
                } else {
                    left = mid + 1;  // Keep searching RIGHT for a later match
                }
            }
        }
        return ans;
    }
}`,
    explanation: "The optimal O(log N) approach. A standard binary search stops as soon as it finds the target. To find boundaries, we modify the binary search: when we find the target, we record its index, but DO NOT stop. If we are looking for the 'first' position, we force the search space to the LEFT half (`right = mid - 1`) to see if there are earlier matches. To find the 'last' position, we force the search space to the RIGHT half."
  },
  linearScan: {
    id: 'linearScan',
    title: '2. Linear Scan',
    subtitle: 'Brute Force: O(N) array traversal.',
    icon: <ScanSearch size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int[] searchRange(int[] nums, int target) {
        int first = -1, last = -1;
        
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == target) {
                if (first == -1) {
                    first = i; // Record the very first time we see it
                }
                last = i; // Continuously update the last time we see it
            }
        }
        
        return new int[]{first, last};
    }
}`,
    explanation: "The brute force approach. We iterate through the array from left to right. The first time we encounter the target, we lock in the 'first' index. Every time we encounter the target (including the first time), we update the 'last' index. This fails the O(log N) time constraint of the problem but serves as an intuitive baseline."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">34. Find First and Last Position of Element in Sorted Array</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given an array of integers <code className="bg-slate-100 px-1.5 py-0.5 rounded text-cyan-600 font-mono font-bold">nums</code> sorted in non-decreasing order, find the starting and ending position of a given <code className="font-mono font-bold text-cyan-700">target</code> value.
        </p>

        <p className="text-lg leading-relaxed">
          If <code className="font-mono">target</code> is not found in the array, return <code className="bg-slate-100 px-1.5 py-0.5 rounded text-rose-600 font-mono font-bold">[-1, -1]</code>.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm flex gap-3 mt-6 items-start shadow-sm">
            <Timer className="shrink-0 mt-0.5 text-amber-500" size={18} />
            <div>
                <strong>Constraint:</strong> You must write an algorithm with <code>O(log n)</code> runtime complexity. This strictly implies a Linear Scan is not an acceptable final solution.
            </div>
        </div>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                 {[5,7,7,8,8,10].map((num, idx) => (
                    <div key={idx} className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 font-bold ${num === 8 ? 'bg-cyan-100 border-cyan-400 text-cyan-800' : 'bg-white border-slate-200 text-slate-600'}`}>
                        {num}
                    </div>
                 ))}
              </div>
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [5,7,7,8,8,10], target = 8</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [3, 4]</p>
              <p className="text-slate-500 text-xs mt-2 border-t border-slate-200 pt-2"><span className="text-slate-400 font-bold">Explanation:</span> The target 8 starts at index 3 and ends at index 4.</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [5,7,7,8,8,10], target = 6</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [-1, -1]</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [], target = 0</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [-1, -1]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SearchRangeVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState<keyof typeof APPROACHES>('doubleBinarySearch');
  const [numsInput, setNumsInput] = useState('5, 7, 7, 8, 8, 10');
  const [targetInput, setTargetInput] = useState('8');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedNums = useMemo(() => {
    let arr = numsInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    // Force sort to maintain problem constraints, though user should enter sorted
    return arr.sort((a, b) => a - b);
  }, [numsInput]);

  const parsedTarget = useMemo(() => {
    let val = parseInt(targetInput.trim());
    return isNaN(val) ? 8 : val;
  }, [targetInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const nums = parsedNums;
    const target = parsedTarget;
    const n = nums.length;
    
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      if (steps.length > 500) return;
      steps.push({
        phase,
        description: desc,
        line,
        state: { nums, target, ...state }
      });
    };

    if (n === 0) {
        if (selectedApproachId === 'doubleBinarySearch') {
             addStep("Empty Array", `Input array is empty. binarySearch will fail immediately.`, 3, { ans: [-1, -1] });
             addStep("Return", `Returning default [-1, -1]`, 8, { ans: [-1, -1], isSuccess: true });
        } else {
             addStep("Empty Array", `Input array is empty. Loops bypassed.`, 3, { first: -1, last: -1 });
             addStep("Return", `Returning [-1, -1]`, 10, { first: -1, last: -1, isSuccess: true, finalAns: [-1, -1] });
        }
        return steps;
    }

    if (selectedApproachId === 'doubleBinarySearch') {
        let ansArray = [-1, -1];
        addStep("Initialization", `Allocate results array ans = [-1, -1].`, 3, { ansArray: [...ansArray], activePhase: 'main' });
        
        // --- FIND FIRST ---
        addStep("Trigger Find First", `Calling binarySearch(nums, target=${target}, findFirst=true)`, 4, { ansArray: [...ansArray], activePhase: 'findFirst' });
        
        let left = 0;
        let right = n - 1;
        let helperAns = -1;
        
        addStep("BS Init", `Initialize left=0, right=${n-1}, ans=-1.`, 16, { ansArray: [...ansArray], left, right, helperAns, activePhase: 'findFirst' });
        
        while (true) {
            addStep("Loop Condition", `Check if left (${left}) <= right (${right})`, 17, { ansArray: [...ansArray], left, right, helperAns, activePhase: 'findFirst' });
            if (left > right) {
                addStep("Loop End", `left > right. Search space exhausted.`, 17, { ansArray: [...ansArray], left, right, helperAns, activePhase: 'findFirst' });
                break;
            }
            
            let mid = Math.floor(left + (right - left) / 2);
            addStep("Calculate Mid", `mid = left + (right - left) / 2 = ${left} + (${right} - ${left}) / 2 = ${mid}. Value is nums[${mid}] = ${nums[mid]}.`, 18, { ansArray: [...ansArray], left, right, mid, helperAns, activePhase: 'findFirst' });
            
            addStep("Check Condition 1", `Is nums[mid] (${nums[mid]}) < target (${target})?`, 20, { ansArray: [...ansArray], left, right, mid, helperAns, activePhase: 'findFirst', checking: 'less' });
            if (nums[mid] < target) {
                left = mid + 1;
                addStep("Move Left Boundary", `Yes. Target must be to the right. Update left = mid + 1 = ${left}.`, 21, { ansArray: [...ansArray], left, right, mid, helperAns, activePhase: 'findFirst' });
            } else {
                addStep("Check Condition 2", `Is nums[mid] (${nums[mid]}) > target (${target})?`, 22, { ansArray: [...ansArray], left, right, mid, helperAns, activePhase: 'findFirst', checking: 'greater' });
                if (nums[mid] > target) {
                    right = mid - 1;
                    addStep("Move Right Boundary", `Yes. Target must be to the left. Update right = mid - 1 = ${right}.`, 23, { ansArray: [...ansArray], left, right, mid, helperAns, activePhase: 'findFirst' });
                } else {
                    addStep("Match Found!", `nums[mid] == target! This is a match. Record ans = ${mid}.`, 24, { ansArray: [...ansArray], left, right, mid, helperAns: mid, activePhase: 'findFirst', match: true });
                    helperAns = mid;
                    
                    addStep("Boundary Logic", `findFirst is TRUE. We want the EARLIEST occurrence. Force search left: right = mid - 1 = ${mid - 1}.`, 26, { ansArray: [...ansArray], left, right: mid - 1, mid, helperAns, activePhase: 'findFirst', match: true });
                    right = mid - 1;
                }
            }
        }
        addStep("Return Helper", `binarySearch(findFirst=true) completed. Returning ${helperAns}.`, 32, { ansArray: [...ansArray], left, right, helperAns, activePhase: 'findFirst' });
        
        ansArray[0] = helperAns;
        addStep("Update First Ans", `ans[0] updated to ${ansArray[0]}.`, 4, { ansArray: [...ansArray], activePhase: 'main' });
        
        addStep("Check if Target Exists", `Did we find the target? ans[0] != -1 (${ansArray[0] != -1}).`, 7, { ansArray: [...ansArray], activePhase: 'main' });
        
        if (ansArray[0] !== -1) {
            // --- FIND LAST ---
            addStep("Trigger Find Last", `Target exists. Calling binarySearch(nums, target=${target}, findFirst=false)`, 8, { ansArray: [...ansArray], activePhase: 'findLast' });
            
            left = 0;
            right = n - 1;
            helperAns = -1;
            
            addStep("BS Init", `Initialize left=0, right=${n-1}, ans=-1.`, 16, { ansArray: [...ansArray], left, right, helperAns, activePhase: 'findLast' });
            
            while (true) {
                addStep("Loop Condition", `Check if left (${left}) <= right (${right})`, 17, { ansArray: [...ansArray], left, right, helperAns, activePhase: 'findLast' });
                if (left > right) {
                    addStep("Loop End", `left > right. Search space exhausted.`, 17, { ansArray: [...ansArray], left, right, helperAns, activePhase: 'findLast' });
                    break;
                }
                
                let mid = Math.floor(left + (right - left) / 2);
                addStep("Calculate Mid", `mid = left + (right - left) / 2 = ${left} + (${right} - ${left}) / 2 = ${mid}. Value is nums[${mid}] = ${nums[mid]}.`, 18, { ansArray: [...ansArray], left, right, mid, helperAns, activePhase: 'findLast' });
                
                addStep("Check Condition 1", `Is nums[mid] (${nums[mid]}) < target (${target})?`, 20, { ansArray: [...ansArray], left, right, mid, helperAns, activePhase: 'findLast', checking: 'less' });
                if (nums[mid] < target) {
                    left = mid + 1;
                    addStep("Move Left Boundary", `Yes. Target must be to the right. Update left = mid + 1 = ${left}.`, 21, { ansArray: [...ansArray], left, right, mid, helperAns, activePhase: 'findLast' });
                } else {
                    addStep("Check Condition 2", `Is nums[mid] (${nums[mid]}) > target (${target})?`, 22, { ansArray: [...ansArray], left, right, mid, helperAns, activePhase: 'findLast', checking: 'greater' });
                    if (nums[mid] > target) {
                        right = mid - 1;
                        addStep("Move Right Boundary", `Yes. Target must be to the left. Update right = mid - 1 = ${right}.`, 23, { ansArray: [...ansArray], left, right, mid, helperAns, activePhase: 'findLast' });
                    } else {
                        addStep("Match Found!", `nums[mid] == target! This is a match. Record ans = ${mid}.`, 24, { ansArray: [...ansArray], left, right, mid, helperAns: mid, activePhase: 'findLast', match: true });
                        helperAns = mid;
                        
                        addStep("Boundary Logic", `findFirst is FALSE. We want the LATEST occurrence. Force search right: left = mid + 1 = ${mid + 1}.`, 28, { ansArray: [...ansArray], left: mid + 1, right, mid, helperAns, activePhase: 'findLast', match: true });
                        left = mid + 1;
                    }
                }
            }
            addStep("Return Helper", `binarySearch(findFirst=false) completed. Returning ${helperAns}.`, 32, { ansArray: [...ansArray], left, right, helperAns, activePhase: 'findLast' });
            
            ansArray[1] = helperAns;
            addStep("Update Last Ans", `ans[1] updated to ${ansArray[1]}.`, 8, { ansArray: [...ansArray], activePhase: 'main' });
        } else {
            addStep("Target Missing", `Target not found in first pass. Skip second pass.`, 7, { ansArray: [...ansArray], activePhase: 'main' });
        }
        
        addStep("Complete", `Algorithm finished. Returning final bounds.`, 11, { ansArray: [...ansArray], isSuccess: true, finalAns: ansArray, activePhase: 'main' });
        
    } 
    else if (selectedApproachId === 'linearScan') {
        let first = -1;
        let last = -1;
        addStep("Initialization", `Initialize first = -1, last = -1.`, 3, { first, last, i: null });

        for (let i = 0; i < n; i++) {
            addStep("Loop Condition", `Checking if i (${i}) < nums.length (${n}). Enter loop.`, 5, { first, last, i });
            addStep("Check Match", `Is nums[${i}] (${nums[i]}) == target (${target})?`, 6, { first, last, i, checking: true });
            
            if (nums[i] === target) {
                addStep("Match Found", `Yes! Target matched at index ${i}.`, 6, { first, last, i, match: true });
                
                addStep("Check First", `Is first still -1? (${first === -1})`, 7, { first, last, i, match: true });
                if (first === -1) {
                    first = i;
                    addStep("Update First", `Yes, this is the very first time we see target. Set first = ${first}.`, 8, { first, last, i, match: true });
                }
                
                last = i;
                addStep("Update Last", `Update last = ${i}. (Overwrites previous matches).`, 9, { first, last, i, match: true });
            } else {
                addStep("No Match", `No, ${nums[i]} != ${target}. Continue array traversal.`, 5, { first, last, i });
            }
        }
        
        addStep("Loop Condition", `Checking if i (${n}) < nums.length (${n}). False. Exit loop.`, 5, { first, last, i: n });
        addStep("Return Result", `Return [${first}, ${last}].`, 13, { first, last, i: n, isSuccess: true, finalAns: [first, last] });
    }

    if (steps.length === 0) {
        addStep("Init", "Start", 1, {});
    }

    return steps;
  }, [parsedNums, parsedTarget, selectedApproachId]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedApproach.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0] || { state: {} };
  const state = cur.state || { nums: parsedNums };
  const { isSuccess, nums, target, ansArray, activePhase, left, right, mid, helperAns, match, first, last, i, finalAns } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-cyan-600 p-4 rounded-2xl shadow-lg shadow-cyan-100 flex items-center justify-center">
                <Crosshair className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Find First and Last Position</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 34</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Binary Search</span>
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
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-cyan-600 border-cyan-600 text-white shadow-cyan-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-cyan-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-cyan-100' : 'text-slate-400'}`}>
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
                      <Code2 size={14} className="text-cyan-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {/* Highlighter Bar */}
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : match ? 'bg-amber-500/15 border-amber-500' : 'bg-cyan-500/20 border-cyan-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="cyan" />
                      ))}
                  </div>
                </div>

                {/* Left Side Variables */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-cyan-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Current Variables</h4>
                      </div>
                    </div>
                    
                    {selectedApproachId === 'doubleBinarySearch' ? (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2 flex justify-between bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs font-mono font-bold">
                                <span>ans: [{ansArray ? ansArray.join(', ') : '-1, -1'}]</span>
                                {activePhase && <span className={`uppercase tracking-widest text-[9px] px-2 py-0.5 rounded text-white ${activePhase === 'findFirst' ? 'bg-blue-500' : activePhase === 'findLast' ? 'bg-violet-500' : 'bg-slate-400'}`}>{activePhase}</span>}
                            </div>
                            <VariableCard label="Left" val={left ?? null} arrVal={left !== null && left !== undefined && left < nums.length ? nums[left] : null} color="sky" active={left !== undefined && left !== null} />
                            <VariableCard label="Right" val={right ?? null} arrVal={right !== null && right !== undefined && right >= 0 ? nums[right] : null} color="violet" active={right !== null && right !== undefined} />
                            <VariableCard label="Mid" val={mid ?? null} arrVal={mid !== null && mid !== undefined ? nums[mid] : null} color="amber" active={mid !== null && mid !== undefined} />
                            <VariableCard label="Helper Ans" val={helperAns ?? null} color="emerald" active={helperAns !== null && helperAns !== undefined} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2">
                                <VariableCard label="Index i" val={i ?? null} arrVal={i !== undefined && i !== null && i < nums.length ? nums[i] : null} color="sky" active={i !== undefined && i !== null} />
                            </div>
                            <VariableCard label="First Match" val={first ?? null} color="emerald" active={first !== null && first !== undefined} />
                            <VariableCard label="Last Match" val={last ?? null} color="emerald" active={last !== null && last !== undefined} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Simulation Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-cyan-600 uppercase block pl-1 tracking-widest font-mono">Sorted Array (comma separated)</label>
                        <input type="text" value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all shadow-inner" placeholder="5, 7, 7, 8, 8, 10" />
                    </div>
                    <div className="w-full md:w-32 space-y-1.5">
                        <label className="text-[10px] font-black text-cyan-600 uppercase block pl-1 tracking-widest font-mono">Target</label>
                        <input type="number" value={targetInput} onChange={(e) => { setTargetInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all shadow-inner" />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-cyan-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-cyan-100 hover:bg-cyan-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Action Log / Status */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : match ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : <Crosshair size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : match ? "text-amber-400" : "text-cyan-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : match ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line">{cur.description}</p>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner items-center justify-center min-h-[380px]">
                   
                   <div className="flex flex-col items-center w-full relative z-10 pt-4">
                      
                      {/* Actual Array Blocks */}
                      <div className="flex gap-2 flex-wrap justify-center relative w-full">
                          {nums.map((val: number, idx: number) => {
                              
                              let bgClass = "bg-white";
                              let borderClass = "border-slate-200";
                              let textClass = "text-slate-800";
                              let topPointer = null;
                              let bottomPointer = null;
                              let zIndex = "z-0";

                              // Approach 1: Double BS
                              if (selectedApproachId === 'doubleBinarySearch') {
                                  const isOutBounds = left !== null && right !== null && (idx < left || idx > right) && activePhase !== 'main';
                                  
                                  if (isOutBounds && !isSuccess) {
                                      bgClass = "bg-slate-50 opacity-40";
                                      borderClass = "border-slate-100";
                                  }
                                  
                                  if (activePhase === 'findFirst' || activePhase === 'findLast') {
                                      if (idx === left && idx !== mid) {
                                          borderClass = "border-sky-400";
                                          bottomPointer = { label: "L", color: "text-sky-500" };
                                      }
                                      if (idx === right && idx !== mid) {
                                          borderClass = "border-violet-400";
                                          if (bottomPointer) bottomPointer.label += ", R";
                                          else bottomPointer = { label: "R", color: "text-violet-500" };
                                      }
                                      if (idx === mid) {
                                          bgClass = match ? "bg-amber-100 scale-110 shadow-lg" : "bg-amber-50 scale-105 shadow-md";
                                          borderClass = "border-amber-400";
                                          textClass = "text-amber-800";
                                          topPointer = { label: "MID", color: "text-amber-600", bounce: true };
                                          zIndex = "z-20";
                                      }
                                  }
                                  
                                  // Highlight the locked answers
                                  if (ansArray) {
                                      if (idx === ansArray[0] || idx === ansArray[1]) {
                                          if (activePhase === 'main' || isSuccess) {
                                             bgClass = "bg-emerald-100 scale-110 shadow-lg";
                                             borderClass = "border-emerald-500";
                                             textClass = "text-emerald-900";
                                             zIndex = "z-10";
                                          }
                                      }
                                      // Range highlight in main phase
                                      if ((activePhase === 'main' || isSuccess) && ansArray[0] !== -1 && idx > ansArray[0] && idx < ansArray[1]) {
                                          bgClass = "bg-emerald-50";
                                          borderClass = "border-emerald-200";
                                      }
                                  }
                              } 
                              // Approach 2: Linear Scan
                              else {
                                  if (idx === i) {
                                      bgClass = match ? "bg-amber-100 scale-110 shadow-lg" : "bg-cyan-50 scale-105 shadow-md";
                                      borderClass = match ? "border-amber-400" : "border-cyan-400";
                                      topPointer = { label: "i", color: match ? "text-amber-600" : "text-cyan-600", bounce: true };
                                      zIndex = "z-20";
                                  } else if (idx < (i || 0)) {
                                      bgClass = "bg-slate-50 opacity-60";
                                  }

                                  if (idx === first || idx === last) {
                                      if (isSuccess || idx < (i || 0)) {
                                          bgClass = "bg-emerald-50 border-emerald-300";
                                          borderClass = "border-emerald-400";
                                          bottomPointer = { label: idx === first && idx === last ? "F, L" : idx === first ? "First" : "Last", color: "text-emerald-600" };
                                      }
                                  }
                                  
                                  if (isSuccess && first !== -1 && idx > first && idx < last) {
                                       bgClass = "bg-emerald-50";
                                       borderClass = "border-emerald-200";
                                  }
                              }

                              return (
                                  <div key={`${idx}-${val}`} className={`flex flex-col items-center relative transition-all duration-300 mb-8 mt-8 ${zIndex}`}>
                                      {/* Top Pointer */}
                                      <div className="absolute -top-10 flex flex-col items-center justify-end h-8 w-full gap-1">
                                          {topPointer && (
                                              <div className={`flex flex-col items-center ${topPointer.bounce ? 'animate-bounce' : ''}`}>
                                                  <span className={`text-[9px] font-black font-mono tracking-widest ${topPointer.color} bg-white px-1 rounded`}>{topPointer.label}</span>
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
                                                  <span className={`text-[9px] font-black font-mono tracking-widest ${bottomPointer.color} bg-white px-1 rounded whitespace-nowrap`}>{bottomPointer.label}</span>
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              );
                          })}
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
                              <span className="text-xs font-black uppercase text-emerald-600 tracking-widest font-mono mb-4 block">Boundaries located</span>
                              
                              <div className="bg-slate-50 border border-slate-200 px-8 py-4 rounded-2xl shadow-inner mt-2 flex flex-col items-center">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-2">Final Output</span>
                                  <div className="flex gap-1 text-3xl font-mono font-black tracking-widest text-emerald-600">
                                      [{finalAns ? finalAns.join(', ') : '-1, -1'}]
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
                <Split className="text-cyan-600"/> Modifying Binary Search
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-cyan-100 pl-6">
                A standard binary search is designed to return the <em>very first match it stumbles upon</em>. But in an array with duplicates, that match could be anywhere in the middle of a continuous block of identical numbers. We need to force it to keep searching.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowLeft size={18}/> Finding the First Position
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            When we find <code>nums[mid] == target</code>, we don't immediately return. We record <code>ans = mid</code> because it's the best candidate so far.
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-3 rounded-lg border border-sky-200">
                            Then, to see if there is an even earlier occurrence, we aggressively throw away the entire right half of the search space by setting <code>right = mid - 1</code>. We repeat this until the search space collapses, guaranteeing <code>ans</code> holds the left-most match.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-violet-50 border border-violet-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-violet-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowRight size={18}/> Finding the Last Position
                        </h3>
                        <p className="text-xs text-violet-800 leading-relaxed mb-4">
                            The exact opposite logic applies. When we match the target, we record <code>ans = mid</code>.
                        </p>
                        <p className="text-xs text-violet-800 leading-relaxed font-bold bg-white p-3 rounded-lg border border-violet-200">
                            To find if the block extends further right, we aggressively throw away the left half by setting <code>left = mid + 1</code>. The loop continues pushing the answer further right until the boundary is found.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Target size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Code2 size={32} className="text-cyan-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Code Reusability</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed">
                        <p>
                           Instead of writing two almost identical binary search functions (one for the start index, one for the end index), we can pass a boolean flag <code>findFirst</code>.
                        </p>
                        <div className="bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 p-4 rounded-xl mt-4 font-mono text-[10px]">
                           if (nums[mid] == target) &#123;<br/>
                           &nbsp;&nbsp;&nbsp;&nbsp;ans = mid;<br/>
                           &nbsp;&nbsp;&nbsp;&nbsp;if (findFirst) right = mid - 1;<br/>
                           &nbsp;&nbsp;&nbsp;&nbsp;else left = mid + 1;<br/>
                           &#125;
                        </div>
                        <p className="text-cyan-400 font-bold mt-2">
                            This makes the code cleaner, less prone to copy-paste errors, and shows interviewers you understand DRY (Don't Repeat Yourself) principles.
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
                        "Because the array is sorted and the problem explicitly demands an O(log N) runtime complexity, a standard linear scan is disqualified. We must use Binary Search. To find the exact boundaries of duplicate numbers, I perform two separate binary searches. The first searches for the target and continuously pushes the right boundary leftward to isolate the first occurrence. The second pushes the left boundary rightward to isolate the last occurrence. Total time is 2 * O(log N), which simplifies perfectly to O(log N)."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Why not BS then Linear scan?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                A common mistake is to do a standard Binary Search to find <em>any</em> match, and then use two <code>while</code> loops to step left and right to find the boundaries. <br/><br/><strong>Why is this bad?</strong> If the entire array consists of the target number (e.g., <code>[8,8,8,8,8...8]</code>), the while loops will degenerate into a full linear scan, pushing your worst-case time complexity to <strong>O(N)</strong>, failing the prompt constraints.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(log N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We run the <code>binarySearch</code> helper function at most twice. Each execution halves the search space at every step, taking O(log N) time. Total: O(log N) + O(log N) = O(log N).</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">The binary search is implemented iteratively using only a few primitive integer pointers (left, right, mid, ans). No extra arrays or call stacks are created.</p>
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean, theme?: 'cyan' | 'violet' | 'rose' | 'emerald' | 'amber' | 'indigo' | 'fuchsia' | 'teal' | 'blue' }> = ({ num, code, active, theme = 'cyan' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|char|List|Integer|Set|Stack|Math)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'Stack', 'Math'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-yellow-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default SearchRangeVisualizer;