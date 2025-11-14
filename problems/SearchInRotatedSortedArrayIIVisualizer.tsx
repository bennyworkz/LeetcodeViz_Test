import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, Search, SplitSquareHorizontal,
  Shrink, CheckSquare, XSquare, ArrowLeftRight
} from 'lucide-react';

const APPROACHES = {
  binarySearch: {
    id: 'binarySearch',
    title: 'Binary Search (w/ Shrink)',
    subtitle: 'Optimal: O(log N) Avg, O(N) Worst.',
    icon: <Search size={16} />,
    complexity: 'Time: O(log N) Avg | Space: O(1)',
    code: `class Solution {
    public boolean search(int[] nums, int target) {
        int left = 0;
        int right = nums.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            // 1. Target found
            if (nums[mid] == target) {
                return true;
            }
            
            // 2. Ambiguous Case (Duplicates on both ends)
            // We cannot determine which half is properly sorted
            if (nums[left] == nums[mid] && nums[mid] == nums[right]) {
                left++;
                right--;
                continue;
            }
            
            // 3. Left half is strictly sorted
            if (nums[left] <= nums[mid]) {
                // Is the target within the sorted left half?
                if (nums[left] <= target && target < nums[mid]) {
                    right = mid - 1; // Search left
                } else {
                    left = mid + 1;  // Search right
                }
            } 
            // 4. Right half is strictly sorted
            else {
                // Is the target within the sorted right half?
                if (nums[mid] < target && target <= nums[right]) {
                    left = mid + 1;  // Search right
                } else {
                    right = mid - 1; // Search left
                }
            }
        }
        
        return false;
    }
}`,
    explanation: "Because the array is a rotated version of a sorted array, at least one half of the array (from left to mid, or mid to right) will ALWAYS be perfectly sorted. We can use this property to perform Binary Search! At each step, we calculate `mid`. If we haven't found the target, we figure out which half is perfectly sorted. Once we identify the sorted half, we can definitively check if our `target` falls within its boundaries. If it does, we narrow our search to that half. If it doesn't, the target MUST be in the other (unsorted) half. \n\nThe tricky part is when `nums[left] == nums[mid] == nums[right]`. This creates ambiguity (e.g., [1,0,1,1,1] vs [1,1,1,0,1]). We handle this edge case by simply incrementing `left` and decrementing `right` to slowly shrink the search space until the ambiguity resolves."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">81. Search in Rotated Sorted Array II</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          There is an integer array <code>nums</code> sorted in non-decreasing order (not necessarily with <strong>distinct</strong> values).
        </p>
        
        <p className="text-lg leading-relaxed">
            Before being passed to your function, <code>nums</code> is <strong>rotated</strong> at an unknown pivot index <code>k</code> (<code>0 &lt;= k &lt; nums.length</code>) such that the resulting array is <code>[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]</code> (<strong>0-indexed</strong>). For example, <code>[0,1,2,4,4,4,5,6,6,7]</code> might be rotated at pivot index <code>5</code> and become <code>[4,5,6,6,7,0,1,2,4,4]</code>.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-violet-500 pl-4 bg-violet-50 py-2 mt-4">
          Given the array <code>nums</code> <em>after</em> the rotation and an integer <code>target</code>, return <code>true</code><em> if </em><code>target</code><em> is in </em><code>nums</code><em>, or </em><code>false</code><em> if it is not in </em><code>nums</code><em>.</em>
        </p>

        <p className="text-sm italic text-slate-500 font-bold bg-slate-50 p-3 rounded-lg border border-slate-200">
            You must decrease the overall operation steps as much as possible.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [2,5,6,0,0,1,2], target = 0</p>
              <p><span className="text-slate-400 font-bold">Output:</span> true</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [2,5,6,0,0,1,2], target = 3</p>
              <p><span className="text-slate-400 font-bold">Output:</span> false</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= nums.length &lt;= 5000</code></li>
              <li><code>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>
              <li><code>nums</code> is guaranteed to be rotated at some pivot.</li>
              <li><code>-10<sup>4</sup> &lt;= target &lt;= 10<sup>4</sup></code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const SearchInRotatedSortedArrayIIVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('binarySearch');
  
  const [numsInput, setNumsInput] = useState('1,0,1,1,1');
  const [targetInput, setTargetInput] = useState('0');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let arr = numsInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    let t = parseInt(targetInput.trim(), 10);
    
    if (isNaN(t)) t = 0;
    if (arr.length === 0) arr = [1,0,1,1,1];
    
    // UI Safety cap to prevent browser freezing
    if (arr.length > 15) arr = arr.slice(0, 15);

    return { nums: arr, target: t };
  }, [numsInput, targetInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { nums, target } = parsedData;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'binarySearch') {
        let left = 0;
        let right = nums.length - 1;
        let mid = null;

        addStep(
            "Initialization", 
            `Line 3-4: int left = 0, right = nums.length - 1;\n\nWe start with our search boundaries encompassing the entire array. Looking for target ${target}.`, 
            4, 
            { nums, left, right, mid, action: 'init' }
        );

        let iter = 0;
        while (left <= right) {
            if (iter++ > 100) break; // Infinite loop safety
            
            addStep(
                "Evaluate Bounds", 
                `Line 6: while (left <= right)\n\nleft (${left}) <= right (${right}) is true. We continue our search.`, 
                6, 
                { nums, left, right, mid, action: 'evalBounds' }
            );

            mid = Math.floor(left + (right - left) / 2);
            
            addStep(
                "Calculate Midpoint", 
                `Line 7: int mid = left + (right - left) / 2;\n\nCalculated mid index as ${mid}. Value at mid is nums[${mid}] = ${nums[mid]}.`, 
                7, 
                { nums, left, right, mid, action: 'calcMid' }
            );

            addStep(
                "Check Target", 
                `Line 10: if (nums[mid] == target)\n\nIs the value at mid (${nums[mid]}) equal to our target (${target})?`, 
                10, 
                { nums, left, right, mid, action: 'checkTarget' }
            );

            if (nums[mid] === target) {
                addStep(
                    "Target Found!", 
                    `Line 11: return true;\n\nWe found the target! Exiting algorithm successfully.`, 
                    11, 
                    { nums, left, right, mid, action: 'success', isSuccess: true, ans: true }
                );
                return steps;
            }

            let isAmbiguous = nums[left] === nums[mid] && nums[mid] === nums[right];

            addStep(
                "Check Ambiguity (Duplicates)", 
                `Line 16: if (nums[left] == nums[mid] && nums[mid] == nums[right])\n\nChecking if ${nums[left]} == ${nums[mid]} == ${nums[right]}.\nIf true, we can't reliably know which half is properly sorted!`, 
                16, 
                { nums, left, right, mid, action: 'checkDuplicates', isAmbiguous }
            );

            if (isAmbiguous) {
                addStep(
                    "Shrink Search Space", 
                    `Line 17-19: left++; right--; continue;\n\nBecause the values are identical at the extremes and the middle, we cautiously shrink our search space from both sides to clear the duplicates.`, 
                    18, 
                    { nums, left, right, mid, action: 'shrink' }
                );
                left++;
                right--;
                continue;
            }

            let isLeftSorted = nums[left] <= nums[mid];

            addStep(
                "Determine Sorted Half", 
                `Line 23: if (nums[left] <= nums[mid])\n\nIs the left half sorted? (${nums[left]} <= ${nums[mid]}) -> ${isLeftSorted ? 'Yes, Left is sorted.' : 'No, Right must be sorted.'}`, 
                23, 
                { nums, left, right, mid, action: 'evalSorted', isLeftSorted }
            );

            if (isLeftSorted) {
                let targetInLeft = nums[left] <= target && target < nums[mid];
                
                addStep(
                    "Check Left Boundaries", 
                    `Line 25: if (nums[left] <= target && target < nums[mid])\n\nDoes target (${target}) fall strictly within the sorted left half [${nums[left]} to ${nums[mid]})?\n${targetInLeft ? 'YES.' : 'NO.'}`, 
                    25, 
                    { nums, left, right, mid, action: 'evalLeftHalf', targetInLeft }
                );

                if (targetInLeft) {
                    right = mid - 1;
                    addStep(
                        "Search Left Half", 
                        `Line 26: right = mid - 1;\n\nTarget must be in the left half. We move 'right' pointer to mid - 1 (${right}).`, 
                        26, 
                        { nums, left, right, mid, action: 'moveRight' }
                    );
                } else {
                    left = mid + 1;
                    addStep(
                        "Search Right Half", 
                        `Line 28: left = mid + 1;\n\nTarget is NOT in the sorted left half. It MUST be in the right half. We move 'left' pointer to mid + 1 (${left}).`, 
                        28, 
                        { nums, left, right, mid, action: 'moveLeft' }
                    );
                }
            } else {
                let targetInRight = nums[mid] < target && target <= nums[right];

                addStep(
                    "Check Right Boundaries", 
                    `Line 34: if (nums[mid] < target && target <= nums[right])\n\nDoes target (${target}) fall strictly within the sorted right half (${nums[mid]} to ${nums[right]}]?\n${targetInRight ? 'YES.' : 'NO.'}`, 
                    34, 
                    { nums, left, right, mid, action: 'evalRightHalf', targetInRight }
                );

                if (targetInRight) {
                    left = mid + 1;
                    addStep(
                        "Search Right Half", 
                        `Line 35: left = mid + 1;\n\nTarget must be in the right half. We move 'left' pointer to mid + 1 (${left}).`, 
                        35, 
                        { nums, left, right, mid, action: 'moveLeft' }
                    );
                } else {
                    right = mid - 1;
                    addStep(
                        "Search Left Half", 
                        `Line 37: right = mid - 1;\n\nTarget is NOT in the sorted right half. It MUST be in the left half. We move 'right' pointer to mid - 1 (${right}).`, 
                        37, 
                        { nums, left, right, mid, action: 'moveRight' }
                    );
                }
            }
        }

        addStep(
            "Target Not Found", 
            `Line 42: return false;\n\nThe search space has been completely exhausted (left > right). The target ${target} does not exist in the array.`, 
            42, 
            { nums, left, right, mid, action: 'fail', isSuccess: true, ans: false }
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
  const { isSuccess, ans, action, nums, left: currLeft, right: currRight, mid: currMid, isAmbiguous, isLeftSorted, targetInLeft, targetInRight } = state;
  const { target } = parsedData;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Search className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Search in Rotated Sorted Array II</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 81</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? (ans ? 'bg-emerald-500/20 border-emerald-500' : 'bg-rose-500/20 border-rose-500') : (action === 'shrink' || action === 'checkDuplicates' ? 'bg-rose-500/20 border-rose-500' : (action.includes('move') ? 'bg-amber-500/20 border-amber-500' : 'bg-violet-500/20 border-violet-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'shrink' || action === 'checkDuplicates' ? 'rose' : (action.includes('move') ? 'amber' : 'violet')} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Pointers & Values</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                        <VariableCard label="Left (L)" val={currLeft !== null && currLeft !== undefined ? `${currLeft} [v:${nums[currLeft]}]` : "-"} color="sky" active={currLeft !== null && currLeft !== undefined} />
                        <VariableCard label="Mid (M)" val={currMid !== null && currMid !== undefined ? `${currMid} [v:${nums[currMid]}]` : "-"} color="purple" active={currMid !== null && currMid !== undefined} />
                        <VariableCard label="Right (R)" val={currRight !== null && currRight !== undefined ? `${currRight} [v:${nums[currRight]}]` : "-"} color="amber" active={currRight !== null && currRight !== undefined} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Input Array (nums)</label>
                        <input type="text" value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-widest font-bold text-slate-700" placeholder="1,0,1,1,1" />
                        <p className="text-[9px] text-slate-400 pl-1">Max 15 elements visually.</p>
                    </div>
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Target</label>
                        <input type="number" value={targetInput} onChange={(e) => { setTargetInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-widest font-bold text-slate-700" placeholder="0" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? (ans ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : (action === 'shrink' || action === 'checkDuplicates' ? 'bg-rose-900 border-rose-800' : (action.includes('move') ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? (ans ? <Check size={100}/> : <XSquare size={100}/>) : (action === 'shrink' ? <Shrink size={100}/> : (action.includes('move') ? <ArrowLeftRight size={100}/> : <Search size={100}/>))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? (ans ? "text-emerald-400" : "text-rose-400") : (action === 'shrink' || action === 'checkDuplicates' ? 'text-rose-400' : (action.includes('move') ? 'text-amber-400' : 'text-violet-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? (ans ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30') : (action === 'shrink' || action === 'checkDuplicates' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : (action.includes('move') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'))}`}>Line {cur.line}</div>
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
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-center justify-start pt-16">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-4 pb-12 gap-10 overflow-y-auto overflow-x-hidden">
                      
                      {/* Array Visualization */}
                      {nums && (
                          <div className="flex flex-col items-center w-full max-w-full">
                              
                              {/* Evaluator box for Ambiguity */}
                              {!isSuccess && action === 'checkDuplicates' && currLeft !== null && currMid !== null && currRight !== null && (
                                  <div className="absolute top-0 flex items-center gap-2 bg-rose-50 border-2 border-rose-200 px-4 py-2 rounded-xl text-rose-700 font-mono font-bold text-sm animate-in fade-in slide-in-from-top-4 shadow-sm z-50">
                                      <span>{nums[currLeft]} == {nums[currMid]} == {nums[currRight]} ?</span>
                                      <span className="ml-2">{isAmbiguous ? '✅ AMBIGUOUS' : '❌ CLEAR'}</span>
                                  </div>
                              )}

                              <div className="flex gap-2 p-6 bg-slate-50 border border-slate-200 min-w-max mx-auto overflow-x-auto mt-8 shadow-sm rounded-3xl pb-16 pt-12">
                                  {nums.map((val, idx) => {
                                      let isLeft = currLeft === idx;
                                      let isRight = currRight === idx;
                                      let isMid = currMid === idx;
                                      
                                      let inBounds = currLeft !== null && currRight !== null && idx >= currLeft && idx <= currRight;
                                      let isEliminated = !inBounds && currLeft !== null;
                                      
                                      let isTargetFound = isSuccess && ans === true && isMid;

                                      let boxClass = "relative w-12 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-xl border-4 font-mono font-black text-xl md:text-2xl transition-all duration-300 shrink-0 ";
                                      let textClass = "text-slate-700";

                                      if (isTargetFound) {
                                          boxClass += "bg-emerald-100 border-emerald-500 scale-110 shadow-xl ring-4 ring-emerald-300/50 z-30";
                                          textClass = "text-emerald-900";
                                      } else if (isEliminated) {
                                          boxClass += "bg-slate-200/50 border-slate-300 opacity-40 shadow-inner z-10";
                                          textClass = "text-slate-400";
                                      } else {
                                          boxClass += "bg-white border-slate-300 shadow-sm z-20";
                                          if (isMid) {
                                              boxClass += " ring-4 ring-purple-300/30 border-purple-400 scale-105";
                                              textClass = "text-purple-900";
                                          } else if (isLeft) {
                                              boxClass += " border-sky-400";
                                          } else if (isRight) {
                                              boxClass += " border-amber-400";
                                          }
                                      }

                                      return (
                                          <div key={`cell-${idx}`} className="flex flex-col items-center relative group">
                                              
                                              {/* Top Pointer (MID) */}
                                              <div className="absolute -top-12 flex flex-col items-center justify-end h-10 w-full z-40">
                                                  {isMid && !isSuccess && (
                                                      <div className={`flex flex-col items-center animate-in slide-in-from-top-2`}>
                                                          <span className="text-[10px] font-black font-mono tracking-widest text-purple-800 bg-purple-100 px-2 py-0.5 rounded border border-purple-300 shadow-sm mb-1">mid</span>
                                                          <ArrowDown size={20} className="text-purple-500" strokeWidth={3}/>
                                                      </div>
                                                  )}
                                              </div>

                                              <div className={boxClass}>
                                                  <span className={textClass}>{val}</span>
                                              </div>
                                              
                                              {/* Index label */}
                                              <div className={`text-[9px] font-mono mt-2 font-bold ${isEliminated ? 'text-slate-300' : 'text-slate-400'}`}>
                                                  {idx}
                                              </div>

                                              {/* Bottom Pointers (LEFT & RIGHT) */}
                                              <div className="absolute -bottom-14 flex flex-col items-center h-12 w-full z-30">
                                                  {isLeft && !isSuccess && (
                                                      <div className={`flex flex-col items-center absolute left-0 animate-in slide-in-from-bottom-2 ${action === 'shrink' ? 'animate-bounce' : ''}`}>
                                                          <ArrowUp size={20} className="text-sky-500" strokeWidth={3}/>
                                                          <span className={`text-[10px] font-black font-mono tracking-widest px-1.5 py-0.5 rounded border shadow-sm mt-1 text-sky-800 bg-sky-100 border-sky-300`}>L</span>
                                                      </div>
                                                  )}
                                                  {isRight && !isSuccess && (
                                                      <div className={`flex flex-col items-center absolute right-0 animate-in slide-in-from-bottom-2 ${action === 'shrink' ? 'animate-bounce' : ''}`}>
                                                          <ArrowUp size={20} className="text-amber-500" strokeWidth={3}/>
                                                          <span className={`text-[10px] font-black font-mono tracking-widest px-1.5 py-0.5 rounded border shadow-sm mt-1 text-amber-800 bg-amber-100 border-amber-300`}>R</span>
                                                      </div>
                                                  )}
                                              </div>
                                          </div>
                                      );
                                  })}
                                  {nums.length === 0 && <span className="text-slate-400 italic font-mono text-sm px-4">Empty Array</span>}
                              </div>
                          </div>
                      )}

                      {/* Info Display Panels for Bounds logic */}
                      {!isSuccess && action.includes('eval') && currLeft !== null && currMid !== null && currRight !== null && (
                          <div className="w-full flex justify-center mt-4">
                                <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm animate-in zoom-in max-w-lg w-full flex flex-col gap-4">
                                    
                                    {/* Sorted check indication */}
                                    <div className="flex items-center justify-between text-sm font-mono font-bold">
                                        <span className="text-slate-500 uppercase tracking-widest text-[10px]">Sorted Halves?</span>
                                        <div className="flex gap-4">
                                            <span className={isLeftSorted ? "text-emerald-600 bg-emerald-50 px-2 py-1 rounded" : "text-rose-500 line-through opacity-50"}>Left Sorted: {nums[currLeft]} ≤ {nums[currMid]}</span>
                                            <span className={!isLeftSorted ? "text-emerald-600 bg-emerald-50 px-2 py-1 rounded" : "text-rose-500 line-through opacity-50"}>Right Sorted: {nums[currMid]} &lt; {nums[currRight]}</span>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-slate-100"></div>

                                    {/* Target bounding check */}
                                    {(action === 'evalLeftHalf' || action === 'evalRightHalf') && (
                                        <div className="flex flex-col gap-2">
                                            <span className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Target Bounding Check</span>
                                            <div className="flex items-center gap-3 text-lg font-mono font-black justify-center bg-slate-50 py-3 rounded-xl border border-slate-200">
                                                {action === 'evalLeftHalf' ? (
                                                    <>
                                                        <span className="text-sky-600">{nums[currLeft]}</span>
                                                        <span className="text-slate-400">≤</span>
                                                        <span className="text-violet-600 border-b-2 border-violet-600">{target}</span>
                                                        <span className="text-slate-400">&lt;</span>
                                                        <span className="text-purple-600">{nums[currMid]}</span>
                                                        <span className="ml-2">➔</span>
                                                        {targetInLeft ? <span className="text-emerald-500 text-sm bg-emerald-100 px-2 py-1 rounded-lg">TRUE</span> : <span className="text-rose-500 text-sm bg-rose-100 px-2 py-1 rounded-lg">FALSE</span>}
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-purple-600">{nums[currMid]}</span>
                                                        <span className="text-slate-400">&lt;</span>
                                                        <span className="text-violet-600 border-b-2 border-violet-600">{target}</span>
                                                        <span className="text-slate-400">≤</span>
                                                        <span className="text-amber-600">{nums[currRight]}</span>
                                                        <span className="ml-2">➔</span>
                                                        {targetInRight ? <span className="text-emerald-500 text-sm bg-emerald-100 px-2 py-1 rounded-lg">TRUE</span> : <span className="text-rose-500 text-sm bg-rose-100 px-2 py-1 rounded-lg">FALSE</span>}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                </div>
                          </div>
                      )}

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${ans ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                              {ans ? <Check size={32} strokeWidth={3}/> : <XSquare size={32} strokeWidth={3}/>}
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">SEARCH COMPLETE</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block ${ans ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  Target {ans ? 'found at mid index' : 'does not exist in array'}
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
                <Search className="text-violet-600"/> Modified Binary Search
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Standard Binary Search relies on the entire array being perfectly sorted. When a sorted array is <em>rotated</em>, it is split into two perfectly sorted sub-arrays. By observing <code>nums[left]</code> and <code>nums[mid]</code>, we can deduce exactly which half we are looking at!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <SplitSquareHorizontal size={18}/> Finding the Sorted Half
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            At any point, one half of the current search space <code>[left...right]</code> is guaranteed to be strictly sorted.
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-3">
                            <p>If <code>nums[left] &lt;= nums[mid]</code>, the left half is pristine and sorted. We can safely check if our target exists between <code>nums[left]</code> and <code>nums[mid]</code>.</p>
                            <p>Otherwise, the pivot must be in the left half, meaning the <strong>right half</strong> is perfectly sorted instead. We can safely check if the target exists between <code>nums[mid]</code> and <code>nums[right]</code>.</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Shrink size={18}/> The Duplicate Ambiguity
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            The presence of duplicates introduces a fatal flaw in the logic above.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>Consider the array <code>[1, 0, 1, 1, 1]</code>. <code>left = 1</code>, <code>mid = 1</code>.</p>
                            <p>Consider the array <code>[1, 1, 1, 0, 1]</code>. <code>left = 1</code>, <code>mid = 1</code>.</p>
                            <p>In both cases, <code>nums[left] == nums[mid]</code>. We absolutely cannot tell if the left half is sorted, or if the right half is sorted!</p>
                            <p><strong>Solution:</strong> We just do <code>left++</code> and <code>right--</code> to cautiously shrink the window until the duplicates clear up and the ambiguity is gone.</p>
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
                        "To achieve an optimal search time, I implemented a modified Binary Search. The core invariant is that in a rotated sorted array, at least one half of any given search space will remain perfectly sorted. By comparing `nums[left]` and `nums[mid]`, I can determine which half is sorted, and definitively check if the `target` falls within its bounds to halve the search space. The complication arises from duplicate values. If `nums[left] == nums[mid] == nums[right]`, it is mathematically impossible to determine which half contains the pivot. To handle this, I defensively increment `left` and decrement `right` to strip away the duplicates until the sorted half becomes identifiable. This yields an $O(\log N)$ average time complexity, gracefully degrading to $O(N)$ only when the array consists almost entirely of identical elements."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Why does it degrade to O(N)?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                If the array is <code>[1, 1, 1, 1, 1, 1, 1]</code> and we are searching for <code>0</code>, the algorithm will continuously hit the <code>nums[left] == nums[mid] == nums[right]</code> ambiguity condition. It will execute <code>left++</code> and <code>right--</code> on every single loop iteration, effectively performing a linear scan from the edges inward, touching every element. Thus, worst-case is $O(N)$.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(log N) Avg | O(N) Worst</span>
                                <p className="text-[10px] text-slate-500 mt-1">If duplicates are sparse, it halves the search space every step ($O(\log N)$). If duplicates are pervasive, it shrinks by 1 at a time ($O(N)$).</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We strictly use three constant integer pointers (`left`, `right`, `mid`) and perform an iterative `while` loop, requiring no extra memory or call stack space.</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|search|nums|target|left|right|mid|length)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['search', 'length'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['left', 'right', 'mid', 'nums', 'target'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default SearchInRotatedSortedArrayIIVisualizer;