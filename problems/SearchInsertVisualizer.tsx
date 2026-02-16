import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, Search, Split, Crosshair, ListOrdered
} from 'lucide-react';

const APPROACHES = {
  binarySearch: {
    id: 'binarySearch',
    title: '1. Binary Search',
    subtitle: 'Optimal: O(log N) Time, O(1) Space.',
    icon: <Split size={16} />,
    complexity: 'Time: O(log N) | Space: O(1)',
    code: `class Solution {
    public int searchInsert(int[] nums, int target) {
        int left = 0;
        int right = nums.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return left;
    }
}`,
    explanation: "Because the array is sorted, we can use Binary Search to find the target in O(log N) time. We maintain 'left' and 'right' pointers to represent our active search space. We repeatedly check the 'mid' element. If it's the target, we return its index. If the 'mid' element is less than the target, we discard the left half. If it's greater, we discard the right half. The magic of this algorithm is what happens when the target is missing: the loop terminates when 'left' crosses 'right' (left > right). At this exact moment, 'left' will precisely point to the index where the target *should* be inserted to maintain sorted order!"
  },
  linearSearch: {
    id: 'linearSearch',
    title: '2. Linear Search',
    subtitle: 'Intuitive: O(N) Time, O(1) Space.',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int searchInsert(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            
            if (nums[i] >= target) {
                return i;
            }
        }
        
        return nums.length;
    }
}`,
    explanation: "This is the most basic approach. We iterate through the sorted array from left to right. Since the array is sorted, the first time we encounter an element that is greater than or equal to our target, that exact index is our answer! If it's equal, we found it. If it's strictly greater, we've found the spot where the target should be inserted. If we finish the entire loop without triggering the return, it means the target is larger than every number in the array, so it belongs at the very end (index = nums.length)."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">35. Search Insert Position</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-violet-500 pl-4 bg-violet-50 py-2 mt-4">
          You must write an algorithm with <code>O(log n)</code> runtime complexity.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [1,3,5,6], target = 5</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 2</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [1,3,5,6], target = 2</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 1</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: 2 is not in the array. It would be inserted between 1 and 3, which is at index 1.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [1,3,5,6], target = 7</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 4</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: 7 is greater than all elements. It would be inserted at the very end, index 4.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>
              <li><code>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>
              <li><code>nums</code> contains <strong>distinct</strong> values sorted in <strong>ascending</strong> order.</li>
              <li><code>-10<sup>4</sup> &lt;= target &lt;= 10<sup>4</sup></code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const SearchInsertVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('binarySearch');
  const [numsInput, setNumsInput] = useState('1, 3, 5, 6');
  const [targetInput, setTargetInput] = useState('2');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let arr = numsInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (arr.length === 0) arr = [1, 3, 5, 6];
    
    // Sort and remove duplicates to match problem constraints perfectly
    arr = [...new Set(arr)].sort((a: number, b: number) => a - b);
    
    // UI Safeguards
    if (arr.length > 15) arr = arr.slice(0, 15);
    
    let target = parseInt(targetInput.trim(), 10);
    if (isNaN(target)) target = 2;

    return { nums: arr, target };
  }, [numsInput, targetInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { nums, target } = parsedData;
    const n = nums.length;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return; // Hard safety cap
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'binarySearch') {
        
        let left = 0;
        addStep(
            "Initialize Left Pointer", 
            `Line 3: int left = 0;\n\nWe initialize the 'left' pointer to index 0, representing the start of our active search space.`, 
            3, 
            { left, right: null, mid: null, action: 'init' }
        );

        let right = n - 1;
        addStep(
            "Initialize Right Pointer", 
            `Line 4: int right = nums.length - 1;\n\nWe initialize the 'right' pointer to index ${right} (the last element). The target must lie within these boundaries if it exists.`, 
            4, 
            { left, right, mid: null, action: 'init' }
        );

        let iter = 0;
        let found = false;

        while (left <= right) {
            if (iter++ > 100) break;

            addStep(
                "Evaluate While Condition", 
                `Line 6: while (left <= right)\n\nWe check if left (${left}) is less than or equal to right (${right}).\nThis evaluates to TRUE. The search space is valid, so we proceed.`, 
                6, 
                { left, right, mid: null, action: 'evalCond' }
            );

            let mid = left + Math.floor((right - left) / 2);
            let midVal = nums[mid];

            addStep(
                "Calculate Midpoint", 
                `Line 7: int mid = left + (right - left) / 2;\n\nWe calculate the exact middle index to prevent integer overflow: \nmid = ${left} + (${right} - ${left}) / 2 = ${mid}.\nThe value at nums[${mid}] is ${midVal}.`, 
                7, 
                { left, right, mid, midVal, action: 'calcMid' }
            );

            addStep(
                "Evaluate Target Match", 
                `Line 9: if (nums[mid] == target)\n\nIs nums[${mid}] (${midVal}) exactly equal to the target (${target})?\n${midVal === target ? 'YES! Target successfully matched.' : 'NO. We must adjust our search boundaries.'}`, 
                9, 
                { left, right, mid, midVal, action: 'checkEqual' }
            );

            if (midVal === target) {
                addStep(
                    "Target Found (Return)", 
                    `Line 10: return mid;\n\nThe target was found exactly at index ${mid}. We immediately return this index.`, 
                    10, 
                    { left, right, mid, midVal, action: 'success', isSuccess: true, ans: mid }
                );
                found = true;
                break;
            } else if (midVal < target) {
                addStep(
                    "Evaluate Less Than", 
                    `Line 11: else if (nums[mid] < target)\n\nIs nums[${mid}] (${midVal}) strictly less than the target (${target})?\nTRUE. Because the array is sorted, the target CANNOT be in the left half (indices 0 to ${mid}).`, 
                    11, 
                    { left, right, mid, midVal, action: 'checkLess' }
                );
                
                let oldLeft = left;
                left = mid + 1;
                
                addStep(
                    "Update Left Boundary", 
                    `Line 12: left = mid + 1;\n\nWe discard the left half by moving the 'left' pointer past 'mid'. 'left' is updated from ${oldLeft} to ${left}.`, 
                    12, 
                    { left, right, mid, midVal, action: 'updateLeft', oldLeft }
                );
            } else {
                addStep(
                    "Evaluate Greater Than", 
                    `Line 13: else\n\nnums[${mid}] (${midVal}) is strictly greater than the target (${target}).\nBecause the array is sorted, the target CANNOT be in the right half (indices ${mid} to the end).`, 
                    13, 
                    { left, right, mid, midVal, action: 'checkGreater' }
                );
                
                let oldRight = right;
                right = mid - 1;
                
                addStep(
                    "Update Right Boundary", 
                    `Line 14: right = mid - 1;\n\nWe discard the right half by moving the 'right' pointer before 'mid'. 'right' is updated from ${oldRight} to ${right}.`, 
                    14, 
                    { left, right, mid, midVal, action: 'updateRight', oldRight }
                );
            }
        }

        if (!found) {
            addStep(
                "While Loop Terminates", 
                `Line 6: while (left <= right)\n\nWe evaluate the condition: left (${left}) <= right (${right}).\nThis is now FALSE. The pointers have crossed, meaning the search space is exhausted. The target does not exist in the array.`, 
                6, 
                { left, right, mid: null, action: 'loopEnd' }
            );

            addStep(
                "Return Insertion Point", 
                `Line 19: return left;\n\nBecause the 'left' pointer always moves to the right of elements smaller than the target, it naturally settles on the exact index where the target SHOULD be inserted. We return ${left}.`, 
                19, 
                { left, right, mid: null, action: 'success', isSuccess: true, ans: left }
            );
        }

    } else if (selectedApproachId === 'linearSearch') {
        
        addStep(
            "Initialize Loop", 
            `Line 3: for (int i = 0; i < nums.length; i++)\n\nWe initialize 'i' to 0 to begin iterating through the sorted array from left to right.`, 
            3, 
            { i: 0, val: nums[0], action: 'init' }
        );

        let iter = 0;
        let found = false;

        for (let i = 0; i < n; i++) {
            if (iter++ > 100) break;

            if (i > 0) {
                 addStep(
                    "Evaluate Loop Condition", 
                    `Line 3: for (int i = ${i}; i < nums.length; i++)\n\n'i' is less than ${n}. We proceed to examine index ${i}.`, 
                    3, 
                    { i, val: nums[i], action: 'loop' }
                );
            }

            let isGreaterOrEq = nums[i] >= target;

            addStep(
                "Evaluate Threshold Condition", 
                `Line 5: if (nums[i] >= target)\n\nWe check if nums[${i}] (${nums[i]}) is greater than or equal to the target (${target}).\n${isGreaterOrEq ? `TRUE! We have found our stopping point.` : `FALSE. The target is larger, so we must keep searching.`}`, 
                5, 
                { i, val: nums[i], action: 'evalIf', isGreaterOrEq }
            );

            if (isGreaterOrEq) {
                let reason = nums[i] === target ? "The target was found exactly at this position!" : "We hit an element strictly larger than the target. Since the array is sorted, the target belongs exactly at this index.";
                addStep(
                    "Return Position", 
                    `Line 6: return i;\n\n${reason}\nWe return index ${i}.`, 
                    6, 
                    { i, val: nums[i], action: 'success', isSuccess: true, ans: i }
                );
                found = true;
                break;
            }
        }

        if (!found) {
            addStep(
                "Loop Exhausted", 
                `Line 3: The loop finished checking all ${n} elements.\n\nSince the return statement inside the loop was never triggered, it means EVERY number in the array is strictly smaller than the target (${target}).`, 
                3, 
                { i: null, action: 'loopEnd' }
            );

            addStep(
                "Return End Index", 
                `Line 11: return nums.length;\n\nBecause the target is strictly greater than all elements, it must be inserted at the very end of the array. We return length (${n}).`, 
                11, 
                { i: null, action: 'success', isSuccess: true, ans: n }
            );
        }
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
  const { isSuccess, ans, action, left, right, mid, i: activeI } = state;
  const { nums, target } = parsedData;

  // Determine array bounds for rendering inserted state
  let renderNums = [...nums];
  let isInserted = isSuccess && (!nums.includes(target));
  
  if (isInserted && ans !== undefined) {
      // Create a visual gap/ghost for insertion
      renderNums.splice(ans, 0, 'INSERT');
  }

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Crosshair className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Search Insert</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 35</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Binary Search / Arrays</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action === 'checkLess' || action === 'checkGreater' ? 'bg-rose-500/20 border-rose-500' : 'bg-violet-500/20 border-violet-500')}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'checkLess' || action === 'checkGreater' ? 'rose' : 'violet'} />
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
                    
                    {selectedApproachId === 'binarySearch' ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <VariableCard label="Target" val={target} color="amber" active={true} />
                            <VariableCard label="Left" val={left !== null && left !== undefined ? left : "-"} color="sky" active={left !== null && left !== undefined} />
                            <VariableCard label="Right" val={right !== null && right !== undefined ? right : "-"} color="rose" active={right !== null && right !== undefined} />
                            <VariableCard label="Mid" val={mid !== null && mid !== undefined ? mid : "-"} color="purple" active={mid !== null && mid !== undefined} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <VariableCard label="Target" val={target} color="amber" active={true} />
                            <VariableCard label="Loop (i)" val={activeI !== null && activeI !== undefined ? activeI : "-"} color="violet" active={activeI !== null && activeI !== undefined} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Sorted Array (nums)</label>
                        <input type="text" value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="1, 3, 5, 6" />
                    </div>
                    
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Target</label>
                        <input type="number" value={targetInput} onChange={(e) => { setTargetInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner" placeholder="2" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : <Crosshair size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : "text-violet-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'}`}>Line {cur.line}</div>
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
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-center justify-center">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-12 pb-8 gap-10 overflow-y-auto">
                      
                      {/* Array Representation */}
                      <div className="flex flex-wrap justify-center w-full gap-y-16 gap-x-2 md:gap-x-4 mt-8">
                          {renderNums.map((num, rawIdx) => {
                              
                              let isGhost = num === 'INSERT';
                              let actualIdx = isGhost ? ans : (rawIdx > ans && isInserted ? rawIdx - 1 : rawIdx);

                              let isMid = mid === actualIdx && !isGhost && !isSuccess;
                              let isLeft = left === actualIdx && !isGhost && !isSuccess;
                              let isRight = right === actualIdx && !isGhost && !isSuccess;
                              let isActiveIter = activeI === actualIdx && selectedApproachId === 'linearSearch' && !isGhost && !isSuccess;
                              
                              let isDiscarded = false;
                              if (selectedApproachId === 'binarySearch' && left !== null && right !== null && !isGhost && !isSuccess) {
                                  isDiscarded = actualIdx < left || actualIdx > right;
                              }

                              let isAnswerNode = isSuccess && ans === actualIdx;

                              let cls = "relative w-14 h-16 md:w-16 md:h-20 flex flex-col items-center justify-center rounded-xl border-4 font-mono font-black text-2xl md:text-3xl transition-all duration-500 z-10 ";
                              let textClass = "text-slate-700";
                              
                              if (isGhost) {
                                  cls += "bg-emerald-50 border-emerald-400 border-dashed scale-110 shadow-lg z-30 animate-in zoom-in fade-in";
                                  textClass = "text-emerald-600";
                              } else if (isAnswerNode) {
                                  cls += "bg-emerald-100 border-emerald-500 text-emerald-800 scale-110 shadow-lg ring-4 ring-emerald-300/50 z-30";
                                  textClass = "text-emerald-800";
                              } else if (isDiscarded) {
                                  cls += "bg-slate-50 border-slate-200 text-slate-300 border-dashed scale-95 opacity-60";
                                  textClass = "text-slate-300";
                              } else if (isMid) {
                                  if (action === 'checkLess' || action === 'checkGreater') {
                                      cls += "bg-rose-100 border-rose-500 scale-110 shadow-lg ring-4 ring-rose-300/50 z-30";
                                      textClass = "text-rose-800";
                                  } else {
                                      cls += "bg-purple-100 border-purple-500 scale-110 shadow-lg ring-4 ring-purple-300/50 z-30";
                                      textClass = "text-purple-800";
                                  }
                              } else if (isActiveIter) {
                                  cls += "bg-sky-100 border-sky-500 scale-110 shadow-lg ring-4 ring-sky-300/50 z-30";
                                  textClass = "text-sky-800";
                              } else {
                                  cls += "bg-white border-slate-300 shadow-sm";
                              }

                              return (
                                  <div key={rawIdx} className="flex flex-col items-center relative">
                                      {/* Top Pointers */}
                                      <div className="absolute -top-12 flex flex-col items-center justify-end h-10 w-full gap-1 z-30">
                                          {isLeft && (
                                              <div className="flex flex-col items-center">
                                                  <span className="text-[10px] font-black font-mono tracking-widest text-sky-700 bg-sky-100 px-1.5 rounded border border-sky-300 shadow-sm mb-1">left</span>
                                                  <ArrowDown size={14} className="text-sky-500" strokeWidth={3}/>
                                              </div>
                                          )}
                                          {isActiveIter && (
                                              <div className="flex flex-col items-center animate-bounce">
                                                  <span className="text-[10px] font-black font-mono tracking-widest text-sky-700 bg-sky-100 px-1.5 rounded border border-sky-300 shadow-sm mb-1">i</span>
                                                  <ArrowDown size={14} className="text-sky-500" strokeWidth={3}/>
                                              </div>
                                          )}
                                      </div>

                                      <div className={cls}>
                                          <span className={textClass}>{isGhost ? target : num}</span>
                                          {!isGhost && <span className="absolute -top-2 -right-2 text-[8px] md:text-[10px] font-mono font-bold text-white bg-slate-800 rounded px-1 shadow-sm">{actualIdx}</span>}
                                          {isGhost && <span className="absolute -top-3 text-[8px] font-mono font-black text-emerald-600 bg-emerald-100 border border-emerald-300 rounded px-1 shadow-sm tracking-widest uppercase">Insert</span>}
                                      </div>
                                      
                                      {/* Bottom Pointers */}
                                      <div className="absolute -bottom-14 flex flex-col items-center h-12 w-full gap-1 z-30">
                                          {isRight && (
                                              <div className={`flex flex-col items-center`}>
                                                  <ArrowUp size={14} className="text-rose-500" strokeWidth={3}/>
                                                  <span className="text-[10px] font-black font-mono bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded border border-rose-300 tracking-widest shadow-sm mt-1">right</span>
                                              </div>
                                          )}
                                          {isMid && (
                                              <div className={`flex flex-col items-center ${action === 'calcMid' ? 'animate-bounce' : ''}`}>
                                                  <ArrowUp size={14} className="text-purple-500" strokeWidth={3}/>
                                                  <span className="text-[10px] font-black font-mono bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded border border-purple-300 tracking-widest shadow-sm mt-1">mid</span>
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              );
                          })}

                          {/* Edge case: End insertion ghost */}
                          {isInserted && ans === nums.length && (
                              <div className="flex flex-col items-center relative">
                                  <div className="relative w-14 h-16 md:w-16 md:h-20 flex flex-col items-center justify-center rounded-xl border-4 border-emerald-400 border-dashed bg-emerald-50 scale-110 shadow-lg z-30 animate-in zoom-in fade-in">
                                      <span className="text-emerald-600 font-mono font-black text-2xl md:text-3xl">{target}</span>
                                      <span className="absolute -top-3 text-[8px] font-mono font-black text-emerald-600 bg-emerald-100 border border-emerald-300 rounded px-1 shadow-sm tracking-widest uppercase">Insert</span>
                                  </div>
                              </div>
                          )}

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
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  {nums.includes(target) ? `Target Found at Index ${ans}` : `Insert Position is Index ${ans}`}
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
                <Split className="text-violet-600"/> The Power of Sorted Data
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Searching for an element in an unsorted array requires checking every single item. This takes $O(N)$ time. However, if the array is perfectly sorted, we can leverage a divide-and-conquer strategy known as Binary Search to find the target in just $O(\log N)$ time.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Target size={18}/> Halving the Search Space
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            Binary Search works by comparing the target value to the middle element of the array.
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            If they match, we return the index.<br/><br/>
                            If the target is smaller, it CANNOT be in the right half. We move our <code>right</code> boundary to <code>mid - 1</code>.<br/><br/>
                            If the target is larger, it CANNOT be in the left half. We move our <code>left</code> boundary to <code>mid + 1</code>.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Crosshair size={18}/> The "Insert" Magic
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            The trickiest part of this problem is what to return if the target is NOT in the array. Why does returning <code>left</code> perfectly solve this?
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>The loop breaks when <code>left &gt; right</code>.</p>
                            <p>At the final step before breaking, <code>left == right == mid</code>.</p>
                            <p>If <code>target &gt; nums[mid]</code>, <code>left</code> shifts +1, placing it exactly right of the smaller number.</p>
                            <p>If <code>target &lt; nums[mid]</code>, <code>right</code> shifts -1, leaving <code>left</code> exactly on the larger number, pushing it rightwards if inserted.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <AlertCircle size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-rose-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">The Integer Overflow Trap</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            A classic LeetCode bug occurs during the calculation of the <code>mid</code> pointer. 
                            <br/><br/>
                            If you write <code>int mid = (left + right) / 2;</code>, you are risking an integer overflow! If <code>left</code> and <code>right</code> are both massive indices approaching $2^{31}-1$, adding them together will overflow into negative numbers before the division happens.
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-[10px] text-rose-300">
                            // DANGEROUS<br/>
                            int mid = (left + right) / 2;<br/><br/>
                            // SAFE MATHEMATICAL EQUIVALENT<br/>
                            // Finds the distance between pointers, halves it,<br/>
                            // and adds it to the left base.<br/>
                            int mid = left + (right - left) / 2;
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
                        "The problem strictly demands an $O(\log N)$ runtime, which immediately implies Binary Search on the sorted input array. I initialized `left` and `right` pointers to bound the search space. In a `while` loop, I dynamically calculate the `mid` point, taking care to use `left + (right - left) / 2` to prevent potential integer overflow in languages like Java or C++. If the `mid` element equals the target, I return the index. Otherwise, I halve the search space accordingly. The beauty of this algorithm is that if the target is not present, the `while` loop breaks exactly when `left` surpasses `right`. Due to the update logic, `left` will naturally settle on the exact index where the target must be inserted to maintain sorted order, allowing a clean `return left` at the end."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Why not return 'right'?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                When the loop terminates without finding the target, the condition <code>left &lt;= right</code> fails, meaning <code>right &lt; left</code>. This happens because the target falls exactly between <code>right</code> and <code>left</code>. To insert a new element while keeping the array sorted, you must place it at the index of the first element larger than it. <code>left</code> points to this larger element, while <code>right</code> points to the smaller one.
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
                                <p className="text-[10px] text-slate-500 mt-1">Binary search halves the active search window every single iteration. Thus, it scales logarithmically with the input array size $N$. An array of 1 million items takes at most ~20 operations.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We allocate memory only for a few primitive tracking pointers (`left`, `right`, `mid`). No new arrays or recursion call stacks are used, keeping auxiliary space strictly constant.</p>
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
  color: string;
  active: boolean;
}

const VariableCard: React.FC<VariableCardProps> = ({ label, val, color, active }) => {
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|nums|target|left|right|mid|length|searchInsert)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['nums'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['target'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (['left', 'right', 'mid'].includes(part)) return <span key={i} className="text-violet-400 font-bold">{part}</span>;
          if (['searchInsert', 'length'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default SearchInsertVisualizer;