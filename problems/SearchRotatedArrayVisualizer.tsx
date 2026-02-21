import React, { useState, useMemo } from 'react';
import { 
  RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Zap, Trophy, MessageSquare, Target, AlertCircle, 
  Cpu, Layers, Hash, Database, Calculator, FileText, ArrowRight, 
  ArrowDown, Info, BarChart3, X, GitBranch, Split, Binary, 
  MousePointer2, Trash2, ListFilter, Plus, Timer, Network, 
  Undo2, CornerRightDown, ArrowUp, History, Search, SearchCode,
  MapPin, Gauge, FastForward
} from 'lucide-react';

const APPROACHES = {
  linear: {
    id: 'linear',
    title: '1. Linear Search',
    subtitle: 'Brute force iteration over every element.',
    icon: <MousePointer2 size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int search(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == target) {
                return i;
            }
        }
        return -1;
    }
}`,
    explanation: "The simplest approach. Iterate through every element in the array until you find the target. This ignores the fact that the array is partially sorted."
  },
  twoPass: {
    id: 'twoPass',
    title: '2. Find Pivot + Binary Search',
    subtitle: 'Locate pivot, then search the sorted half.',
    icon: <Split size={16} />,
    complexity: 'Time: O(log N) | Space: O(1)',
    code: `class Solution {
    public int search(int[] nums, int target) {
        int n = nums.length;
        int left = 0, right = n - 1;
        
        // 1. Find the pivot (index of smallest element)
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] > nums[right]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        int pivot = left;
        left = 0;
        right = n - 1;
        
        // 2. Determine which sorted half the target belongs to
        if (target >= nums[pivot] && target <= nums[right]) {
            left = pivot;
        } else {
            right = pivot - 1;
        }
        
        // 3. Standard Binary Search on the selected half
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        
        return -1;
    }
}`,
    explanation: "First, use binary search to find the index of the minimum element (the pivot point). Once the pivot is found, the array is logically split into two perfectly sorted halves. We check which half our target falls into, and then run a standard binary search on that half."
  },
  onePass: {
    id: 'onePass',
    title: '3. One-Pass Binary Search',
    subtitle: 'Determine sorted halves on the fly.',
    icon: <SearchCode size={16} />,
    complexity: 'Time: O(log N) | Space: O(1)',
    code: `class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] == target) {
                return mid;
            }
            
            // Check if the left half is sorted
            if (nums[left] <= nums[mid]) {
                if (target >= nums[left] && target < nums[mid]) {
                    right = mid - 1; // Target in left half
                } else {
                    left = mid + 1;  // Target in right half
                }
            } 
            // Otherwise, the right half must be sorted
            else {
                if (target > nums[mid] && target <= nums[right]) {
                    left = mid + 1;  // Target in right half
                } else {
                    right = mid - 1; // Target in left half
                }
            }
        }
        
        return -1;
    }
}`,
    explanation: "Instead of finding the pivot first, we can do it in one pass. In any rotated sorted array, splitting it in half guarantees that AT LEAST one half is perfectly sorted. We check which half is sorted, and then easily check if our target falls within that sorted half's range. If it does, we narrow our search to that half. If not, we search the other half."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">33. Search in Rotated Sorted Array</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          There is an integer array <code className="bg-slate-100 px-1.5 py-0.5 rounded text-cyan-600 font-mono font-bold">nums</code> sorted in ascending order (with <strong>distinct</strong> values).
        </p>
        <p className="text-lg leading-relaxed">
          Prior to being passed to your function, <code>nums</code> is <strong>possibly rotated</strong> at an unknown pivot index <code>k</code> (<code>1 &lt;= k &lt; nums.length</code>) such that the resulting array is <code>[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]</code> (<strong>0-indexed</strong>). For example, <code>[0,1,2,4,5,6,7]</code> might be rotated at pivot index 3 and become <code>[4,5,6,7,0,1,2]</code>.
        </p>
        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-cyan-500 pl-4 bg-cyan-50 py-2">
          Given the array <code>nums</code> after the possible rotation and an integer <code>target</code>, return the index of <code>target</code> if it is in <code>nums</code>, or <code>-1</code> if it is not in <code>nums</code>.
        </p>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-4">
          You must write an algorithm with <code>O(log n)</code> runtime complexity.
        </p>

        <div className="space-y-8 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [4,5,6,7,0,1,2], target = 0</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 4</p>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [4,5,6,7,0,1,2], target = 3</p>
              <p><span className="text-slate-400 font-bold">Output:</span> -1</p>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [1], target = 0</p>
              <p><span className="text-slate-400 font-bold">Output:</span> -1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SearchRotatedArrayVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState<keyof typeof APPROACHES>('onePass');
  const [numsInput, setNumsInput] = useState('4,5,6,7,0,1,2');
  const [targetInput, setTargetInput] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedNums = useMemo(() => {
    return numsInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  }, [numsInput]);

  const target = useMemo(() => {
    const val = parseInt(targetInput.toString());
    return isNaN(val) ? 0 : val;
  }, [targetInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const nums = parsedNums.length > 0 ? parsedNums : [4,5,6,7,0,1,2];
    
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({
        phase,
        description: desc,
        line,
        state: {
          nums: [...nums],
          target,
          ...state
        }
      });
    };

    if (selectedApproachId === 'linear') {
        let foundIdx = -1;
        addStep("Initialize", `Starting linear scan from index 0 to ${nums.length - 1}.`, 3, { activeIdx: 0 });
        for(let i = 0; i < nums.length; i++) {
             addStep("Loop Iteration", `Checking if nums[${i}] (${nums[i]}) equals target (${target}).`, 4, { activeIdx: i });
             if (nums[i] === target) {
                 foundIdx = i;
                 addStep("Target Found", `Found target at index ${i}. Returning index.`, 5, { activeIdx: i, foundIdx: i, isSuccess: true });
                 break;
             }
        }
        if (foundIdx === -1) {
             addStep("Not Found", `Reached end of array. Target not found. Returning -1.`, 8, { isFailed: true });
        }
    } 
    else if (selectedApproachId === 'twoPass') {
        let l = 0, r = nums.length - 1;
        let n = nums.length;
        
        addStep("Phase 1: Find Pivot", "Initialize left and right pointers to find the minimum element.", 4, { l, r });
        
        while (l < r) {
             let mid = Math.floor(l + (r - l) / 2);
             addStep("Check Midpoint", `mid = left + (right-left)/2 = ${mid}. Check if nums[mid] (${nums[mid]}) > nums[right] (${nums[r]}).`, 8, { l, r, mid });
             
             if (nums[mid] > nums[r]) {
                  l = mid + 1;
                  addStep("Pivot in Right", `Yes, ${nums[mid]} > ${nums[r]}. The pivot must be to the right of mid. Update left = mid + 1 = ${l}.`, 9, { l, r, mid });
             } else {
                  r = mid;
                  addStep("Pivot in Left", `No, ${nums[mid]} <= ${nums[r]}. The pivot is at mid or to its left. Update right = mid = ${r}.`, 11, { l, r, mid });
             }
        }
        
        let pivot = l;
        addStep("Pivot Found", `The smallest element is at index ${pivot} (value ${nums[pivot]}).`, 15, { l: null, r: null, pivot });
        
        l = 0; r = n - 1;
        addStep("Phase 2: Target Range", `Determine which sorted half contains the target (${target}).`, 19, { l, r, pivot });
        
        if (target >= nums[pivot] && target <= nums[r]) {
            l = pivot;
            addStep("Target in Right Half", `Target is between pivot and right end. Update left = pivot = ${l}.`, 20, { l, r, pivot });
        } else {
            r = pivot - 1;
            addStep("Target in Left Half", `Target is in the left rotated portion. Update right = pivot - 1 = ${r}.`, 22, { l, r, pivot });
        }

        addStep("Phase 3: Binary Search", `Perform standard binary search on range [${l}, ${r}].`, 26, { l, r, pivot });
        let foundIdx = -1;
        while (l <= r) {
             let mid = Math.floor(l + (r - l) / 2);
             addStep("Check Midpoint", `mid = ${mid}, nums[mid] = ${nums[mid]}.`, 28, { l, r, mid, pivot });
             
             if (nums[mid] === target) {
                 foundIdx = mid;
                 addStep("Target Found", `Match found at index ${mid}.`, 28, { l, r, mid, pivot, foundIdx: mid, isSuccess: true });
                 break;
             } else if (nums[mid] < target) {
                 l = mid + 1;
                 addStep("Search Right", `Target is greater. Update left = mid + 1 = ${l}.`, 29, { l, r, mid, pivot });
             } else {
                 r = mid - 1;
                 addStep("Search Left", `Target is smaller. Update right = mid - 1 = ${r}.`, 30, { l, r, mid, pivot });
             }
        }
        if (foundIdx === -1) {
            addStep("Not Found", `Target not in array. Return -1.`, 33, { isFailed: true, pivot });
        }
    }
    else {
        // onePass
        let l = 0;
        let r = nums.length - 1;
        let foundIdx = -1;

        addStep("Initialize Pointers", `Array length is ${nums.length}. Setting left pointer to 0 and right pointer to ${r}.`, 3, { l, r });

        while (l <= r) {
          addStep("Loop Condition", `Check if left (${l}) <= right (${r}). Since it is, we continue searching.`, 5, { l, r });
          
          let mid = Math.floor(l + (r - l) / 2);
          addStep("Calculate Midpoint", `mid = left + (right - left) / 2\nmid = ${l} + (${r} - ${l}) / 2 = ${mid}.\nThe value at nums[${mid}] is ${nums[mid]}.`, 6, { l, r, mid });

          addStep("Check Target Match", `Is nums[mid] (${nums[mid]}) exactly equal to our target (${target})?`, 8, { l, r, mid });
          if (nums[mid] === target) {
            foundIdx = mid;
            addStep("Target Found!", `Match found at index ${mid}. We can immediately return this index.`, 9, { l, r, mid, foundIdx: mid, isSuccess: true });
            break;
          }

          addStep("Identify Sorted Half", `We need to find which half of the array is perfectly sorted without the pivot rotation. Checking if left element (${nums[l]}) <= mid element (${nums[mid]}).`, 13, { l, r, mid, checkingLeftSorted: true });
          
          if (nums[l] <= nums[mid]) {
            addStep("Left Half is Sorted", `Since ${nums[l]} <= ${nums[mid]}, the left sub-array [${l}..${mid}] is strictly increasing.`, 14, { l, r, mid, leftSorted: true });
            
            addStep("Check Range", `Does the target (${target}) lie within the sorted left boundary? Checking if target >= ${nums[l]} AND target < ${nums[mid]}.`, 14, { l, r, mid, leftSorted: true });
            
            if (target >= nums[l] && target < nums[mid]) {
              r = mid - 1;
              addStep("Target in Left Half", `Yes, the target is in the left boundary. We discard the right half. Update right = mid - 1 = ${r}.`, 15, { l, r, mid });
            } else {
              l = mid + 1;
              addStep("Target in Right Half", `No, the target is NOT in the left boundary. It must be in the right half. Update left = mid + 1 = ${l}.`, 17, { l, r, mid });
            }
          } else {
            addStep("Right Half is Sorted", `Since ${nums[l]} > ${nums[mid]}, the left half contains the pivot. Therefore, the right sub-array [${mid}..${r}] MUST be strictly increasing.`, 21, { l, r, mid, rightSorted: true });
            
            addStep("Check Range", `Does the target (${target}) lie within the sorted right boundary? Checking if target > ${nums[mid]} AND target <= ${nums[r]}.`, 22, { l, r, mid, rightSorted: true });
            
            if (target > nums[mid] && target <= nums[r]) {
              l = mid + 1;
              addStep("Target in Right Half", `Yes, the target is in the right boundary. We discard the left half. Update left = mid + 1 = ${l}.`, 23, { l, r, mid });
            } else {
              r = mid - 1;
              addStep("Target in Left Half", `No, the target is NOT in the right boundary. It must be in the left half. Update right = mid - 1 = ${r}.`, 25, { l, r, mid });
            }
          }
        }

        if (foundIdx === -1) {
          addStep("Loop Terminates", `left (${l}) is now strictly greater than right (${r}). The search space is exhausted.`, 5, { l, r, isFailed: true });
          addStep("Not Found", `The target ${target} does not exist in the array. Return -1.`, 30, { l, r, isFailed: true });
        }
    }

    return steps;
  }, [parsedNums, target, selectedApproachId]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedApproach.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0];
  const { l, r, mid, nums, foundIdx, isSuccess, isFailed, leftSorted, rightSorted, activeIdx, pivot } = cur.state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-cyan-600 p-4 rounded-2xl shadow-lg shadow-cyan-100 flex items-center justify-center">
                <Search className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Search Rotated Array</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 33</span>
                <span className="opacity-60">•</span>
                <span className="font-bold">MODIFIED BINARY SEARCH</span>
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
              {/* Left Col: Approaches, Code & Variable Context (5/12) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                
                {/* Approach Selector */}
                <div className="grid grid-cols-3 gap-3">
                    {Object.values(APPROACHES).map((app) => {
                        const isSelected = selectedApproachId === app.id;
                        const [time, space] = app.complexity.split(' | ');
                        return (
                            <button 
                               key={app.id}
                               onClick={() => { setSelectedApproachId(app.id as keyof typeof APPROACHES); setCurrentStep(0); }}
                               className={`px-2 py-3.5 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-1.5 shadow-sm ${isSelected ? 'bg-cyan-600 border-cyan-600 text-white shadow-cyan-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-cyan-300 hover:bg-slate-50'}`}
                            >
                                <span className="text-[10px] font-black uppercase tracking-tight leading-none truncate w-full px-1">
                                    {app.title}
                                </span>
                                <div className={`flex flex-col items-center text-[8px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-cyan-50' : 'text-slate-400'}`}>
                                    <span>{time}</span>
                                    <span>{space}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="bg-[#0f172a] rounded-3xl h-[520px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={14} className="text-cyan-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {/* Highlighter Bar */}
                      <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/10 border-emerald-500' : isFailed ? 'bg-rose-500/10 border-rose-500' : 'bg-cyan-500/15 border-cyan-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} />
                      ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-cyan-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Current Variables</h4>
                      </div>
                    </div>
                    
                    {selectedApproachId === 'linear' ? (
                        <div className="grid grid-cols-1 gap-3">
                            <VariableCard label="INDEX (i)" val={activeIdx ?? null} arrVal={activeIdx !== undefined && activeIdx !== null ? nums[activeIdx] : null} color="blue" active={activeIdx !== null} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            <VariableCard label="LEFT" val={l ?? null} arrVal={l !== null && l !== undefined ? nums[l] : null} color="blue" active={l !== null && l !== undefined} />
                            <VariableCard label="MID" val={mid ?? null} arrVal={mid !== null && mid !== undefined ? nums[mid] : null} color="amber" active={mid !== null && mid !== undefined} />
                            <VariableCard label="RIGHT" val={r ?? null} arrVal={r !== null && r !== undefined ? nums[r] : null} color="purple" active={r !== null && r !== undefined} />
                        </div>
                    )}
                    
                    {selectedApproachId === 'twoPass' && pivot !== undefined && (
                        <div className="mt-3">
                             <VariableCard label="PIVOT" val={pivot} arrVal={nums[pivot]} color="emerald" active={true} />
                        </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                       <div className="flex items-center gap-2">
                           <Target size={16} className="text-slate-400"/>
                           <span className="text-xs font-black uppercase text-slate-500 font-mono">Target Search</span>
                       </div>
                       <div className="text-xl font-black font-mono bg-slate-100 px-4 py-1 rounded-xl text-slate-800 shadow-inner">
                           {target}
                       </div>
                    </div>
                </div>
              </div>

              {/* Right Col: Simulation Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-cyan-600 uppercase block pl-1 tracking-widest font-mono">Array (comma separated)</label>
                        <input type="text" value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all shadow-inner" placeholder="e.g. 4,5,6,7,0,1,2" />
                    </div>
                    <div className="w-full md:w-32 space-y-1.5">
                        <label className="text-[10px] font-black text-cyan-600 uppercase block pl-1 tracking-widest font-mono">Target</label>
                        <input type="number" value={targetInput} onChange={(e) => { setTargetInput(parseInt(e.target.value)); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all shadow-inner" />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/> Prev
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-40 px-6 py-3 bg-cyan-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-cyan-100 hover:bg-cyan-700 transition-all flex items-center justify-center gap-2">
                        Next Step <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Action Log / Status */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group ${isFailed ? 'bg-rose-900 border-rose-800' : isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {selectedApproachId === 'linear' ? <FastForward size={100} /> : <Binary size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isFailed ? "text-rose-400" : isSuccess ? "text-emerald-400" : "text-cyan-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isFailed ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}`}>Line {cur.line}</div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line">{cur.description}</p>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[350px] relative flex flex-col justify-center items-center overflow-hidden shadow-inner">
                  
                  <div className="absolute top-8 left-8 flex items-center gap-2">
                     <MapPin size={16} className="text-cyan-600"/>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Array State (N={nums.length})</span>
                  </div>

                  {/* Array Visualization */}
                  <div className="relative mt-8 max-w-full overflow-x-auto pb-16 pt-8 px-4 flex items-center justify-center">
                      <div className="flex gap-2 relative">
                          {nums.map((num: number, idx: number) => {
                              let isEliminated = false;
                              let isMid = false;
                              let isLeft = false;
                              let isRight = false;
                              let isPivot = false;
                              let isFound = idx === foundIdx;
                              let isLinearActive = false;

                              if (selectedApproachId === 'linear') {
                                  isEliminated = idx < (activeIdx ?? 0);
                                  isLinearActive = idx === activeIdx;
                              } else {
                                  isEliminated = (l !== null && idx < l) || (r !== null && idx > r);
                                  isMid = idx === mid;
                                  isLeft = idx === l;
                                  isRight = idx === r;
                                  isPivot = idx === pivot;
                              }
                              
                              // Visual cues for sorted half
                              let borderClass = "border-slate-200";
                              let bgClass = "bg-white";
                              
                              if (isFound) {
                                  bgClass = "bg-emerald-500 text-white shadow-emerald-200 shadow-lg scale-110 z-10";
                                  borderClass = "border-emerald-600";
                              } else if (isEliminated) {
                                  bgClass = "bg-slate-50 text-slate-300 opacity-50";
                                  borderClass = "border-slate-100";
                              } else if (leftSorted && idx >= l && idx <= mid) {
                                  bgClass = "bg-green-50/50 border-green-200";
                              } else if (rightSorted && idx >= mid && idx <= r) {
                                  bgClass = "bg-green-50/50 border-green-200";
                              } else if (isMid) {
                                  bgClass = "bg-amber-50 border-amber-300 z-10";
                              } else if (isLinearActive) {
                                  bgClass = "bg-blue-50 border-blue-300 shadow-md scale-105 z-10";
                              }

                              return (
                                  <div key={idx} className="flex flex-col items-center relative transition-all duration-300">
                                      {/* Top Indicators */}
                                      <div className="absolute -top-10 flex flex-col items-center justify-end h-8 w-full gap-1">
                                          {isMid && !isFound && (
                                              <div className="flex flex-col items-center animate-in slide-in-from-top-2">
                                                  <span className="text-[9px] font-black text-amber-600 font-mono">MID</span>
                                                  <ArrowDown size={14} className="text-amber-500" strokeWidth={3}/>
                                              </div>
                                          )}
                                          {isLinearActive && !isFound && (
                                              <div className="flex flex-col items-center animate-in slide-in-from-top-2">
                                                  <span className="text-[9px] font-black text-blue-600 font-mono">i={idx}</span>
                                                  <ArrowDown size={14} className="text-blue-500" strokeWidth={3}/>
                                              </div>
                                          )}
                                          {isFound && (
                                              <div className="flex flex-col items-center animate-bounce">
                                                  <span className="text-[9px] font-black text-emerald-600 font-mono">FOUND</span>
                                                  <ArrowDown size={14} className="text-emerald-500" strokeWidth={3}/>
                                              </div>
                                          )}
                                      </div>

                                      {/* Main Box */}
                                      <div className={`w-12 h-16 md:w-16 md:h-20 border-2 rounded-2xl flex items-center justify-center font-mono font-black text-xl md:text-2xl transition-all duration-500 ${bgClass} ${borderClass}`}>
                                          {num}
                                      </div>
                                      
                                      {/* Index label */}
                                      <div className={`mt-3 text-[10px] font-mono font-black transition-colors ${isEliminated ? 'text-slate-200' : 'text-slate-400'}`}>
                                          {idx}
                                      </div>

                                      {/* Bottom Indicators (L and R, Pivot) */}
                                      <div className="absolute -bottom-12 flex flex-col gap-1 items-center justify-start h-10 w-full">
                                          {isPivot && (
                                              <div className="flex flex-col items-center animate-in zoom-in absolute top-0 text-emerald-500 bg-emerald-50 px-2 rounded-full border border-emerald-200">
                                                 <span className="text-[8px] font-black uppercase tracking-widest">Pivot</span>
                                              </div>
                                          )}
                                          <div className="flex gap-1 mt-auto">
                                              {isLeft && !isEliminated && (
                                                  <div className="flex flex-col items-center animate-in slide-in-from-bottom-2">
                                                      <ArrowUp size={14} className="text-blue-500" strokeWidth={3}/>
                                                      <span className="text-[9px] font-black text-blue-600 font-mono">L</span>
                                                  </div>
                                              )}
                                              {isRight && !isEliminated && idx !== l && (
                                                  <div className="flex flex-col items-center animate-in slide-in-from-bottom-2">
                                                      <ArrowUp size={14} className="text-purple-500" strokeWidth={3}/>
                                                      <span className="text-[9px] font-black text-purple-600 font-mono">R</span>
                                                  </div>
                                              )}
                                              {isRight && isLeft && !isEliminated && (
                                                   <div className="flex flex-col items-center animate-in slide-in-from-bottom-2">
                                                      <ArrowUp size={14} className="text-purple-500" strokeWidth={3}/>
                                                      <span className="text-[9px] font-black text-purple-600 font-mono">R</span>
                                                  </div>
                                              )}
                                          </div>
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  </div>

                  {/* Final State Overlays */}
                  {isFailed && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-rose-900/10 backdrop-blur-sm animate-in fade-in duration-500">
                      <div className="bg-white border-2 border-rose-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform rotate-2">
                          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shadow-lg">
                              <X size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">NOT FOUND</span>
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono">Returned -1</span>
                          </div>
                      </div>
                    </div>
                  )}
                  {isSuccess && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-emerald-900/10 backdrop-blur-sm animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-emerald-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">FOUND TARGET</span>
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono">Index: {foundIdx}</span>
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
                <Gauge className="text-cyan-600"/> The "One Sorted Half" Rule
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-cyan-100 pl-6">
                When you split a rotated sorted array perfectly in half, <strong>at least one of the two halves will always be perfectly sorted.</strong> We can use this property to perform a binary search without needing to find the rotation pivot first.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-cyan-50 border border-cyan-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-cyan-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Split size={18}/> Identifying the Sorted Half
                        </h3>
                        <p className="text-sm text-cyan-800 leading-relaxed italic font-bold">
                            "Check the endpoints of the sub-array."
                        </p>
                        <ul className="space-y-3 text-xs text-cyan-800 leading-relaxed list-none p-0 m-0">
                            <li className="flex gap-2"><ArrowRight size={14} className="shrink-0 mt-0.5 text-cyan-500"/> If <code>nums[left] &lt;= nums[mid]</code>, the <strong>left half</strong> is perfectly sorted. The rotation pivot must be in the right half.</li>
                            <li className="flex gap-2"><ArrowRight size={14} className="shrink-0 mt-0.5 text-cyan-500"/> Otherwise, the <strong>right half</strong> (<code>nums[mid] &lt;= nums[right]</code>) must be perfectly sorted, and the pivot is in the left.</li>
                        </ul>
                    </div>
                    
                    <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-indigo-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Target size={18}/> Narrowing the Search
                        </h3>
                        <p className="text-xs text-indigo-800 leading-relaxed">
                            Once you know which half is strictly sorted, you can easily check if your target value falls within that sorted half's range (between its minimum and maximum bounds).
                        </p>
                        <div className="bg-indigo-900 p-4 rounded-xl text-indigo-200 text-xs">
                           If Target is within the Sorted Half bounds:<br/>
                           <span className="text-emerald-400 font-bold">→ Search inside the sorted half.</span><br/><br/>
                           Otherwise:<br/>
                           <span className="text-rose-400 font-bold">→ Discard the sorted half, search the unsorted half.</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <GitBranch size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <BarChart3 size={32} className="text-cyan-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Visualizing the Rotation</h4>
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700 backdrop-blur-sm">
                            <span className="text-[10px] text-slate-400 block mb-2 uppercase font-black font-mono">Standard Array [0,1,2,3,4,5,6]</span>
                            <div className="flex items-end gap-1 h-12">
                                <div className="w-4 bg-slate-600 rounded-t-sm h-[10%]"></div>
                                <div className="w-4 bg-slate-600 rounded-t-sm h-[25%]"></div>
                                <div className="w-4 bg-slate-600 rounded-t-sm h-[40%]"></div>
                                <div className="w-4 bg-slate-600 rounded-t-sm h-[55%]"></div>
                                <div className="w-4 bg-slate-600 rounded-t-sm h-[70%]"></div>
                                <div className="w-4 bg-slate-600 rounded-t-sm h-[85%]"></div>
                                <div className="w-4 bg-slate-600 rounded-t-sm h-[100%]"></div>
                            </div>
                        </div>
                        <div className="p-5 bg-slate-800/80 rounded-3xl border border-cyan-900/50 backdrop-blur-sm">
                            <span className="text-[10px] text-cyan-400 block mb-2 uppercase font-black font-mono">Rotated [4,5,6,0,1,2,3]</span>
                            <div className="flex items-end gap-1 h-12">
                                {/* Left sorted chunk */}
                                <div className="w-4 bg-cyan-500 rounded-t-sm h-[70%]"></div>
                                <div className="w-4 bg-cyan-500 rounded-t-sm h-[85%]"></div>
                                <div className="w-4 bg-cyan-500 rounded-t-sm h-[100%]"></div>
                                {/* Gap / Pivot */}
                                <div className="w-0.5 bg-rose-500 h-full mx-1 relative"><span className="absolute -top-4 -left-2 text-[8px] text-rose-400">Pivot</span></div>
                                {/* Right sorted chunk */}
                                <div className="w-4 bg-indigo-400 rounded-t-sm h-[10%]"></div>
                                <div className="w-4 bg-indigo-400 rounded-t-sm h-[25%]"></div>
                                <div className="w-4 bg-indigo-400 rounded-t-sm h-[40%]"></div>
                                <div className="w-4 bg-indigo-400 rounded-t-sm h-[55%]"></div>
                            </div>
                            <p className="text-[9px] text-slate-400 mt-4 uppercase font-black tracking-widest leading-relaxed">
                                Notice how picking any midpoint will always land purely inside the Cyan block (Left sorted) OR purely inside the Indigo block (Right sorted).
                            </p>
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
                        "While it's possible to solve this by finding the rotation pivot point first (via binary search) and then doing a second binary search on the appropriate sub-array, the one-pass approach is cleaner. By identifying which half of the array is strictly increasing relative to the current mid-point, we can deterministically decide whether to search left or right in a single pass. The time complexity remains strictly O(log N) as we cut the search space in half at every step."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: What if there are duplicates?
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            This specific problem (LC 33) guarantees distinct values. If duplicates are allowed (LC 81), the condition <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-600">nums[left] &lt;= nums[mid]</code> is no longer sufficient. For example, in <code>[3, 1, 2, 3, 3, 3, 3]</code>, <code>nums[0] == nums[mid]</code>, but the left half is NOT sorted. We must handle this by doing <code>left++</code> and <code>right--</code>, degrading worst-case time to <strong>O(N)</strong>.
                        </p>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <Timer size={14} className="text-emerald-500"/> Time & Space Complexity
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Time Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(log N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We halve the search space at every step.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Only a few integer pointers are maintained regardless of array size.</p>
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

const VariableCard = ({ label, val, arrVal, color, active }: { label: string, val: number | null, arrVal?: number | null, color: 'blue' | 'purple' | 'amber' | 'emerald', active: boolean }) => {
    const bgMap = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700'
    };
    
    const inactiveMap = 'bg-slate-50 border-slate-200 text-slate-300';

    return (
        <div className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden ${active ? bgMap[color] : inactiveMap}`}>
             <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</span>
             <div className="text-xl font-black font-mono leading-none">
                 {val !== null ? val : '-'}
             </div>
             {active && arrVal !== undefined && arrVal !== null && (
                 <div className="absolute bottom-0 w-full text-center bg-black/5 text-[8px] font-black py-0.5 mt-2">
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

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|void|String|boolean|new|this|for|break)\b|\b\d+\b)/g).filter(Boolean);

  return (
    <div className={`flex relative z-10 min-h-[16.5px] transition-colors duration-200 ${active ? 'bg-cyan-500/10' : ''}`}>
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-[10px] ${active ? 'text-cyan-400 font-bold' : 'text-slate-700'}`}>{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'void', 'for', 'break'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-amber-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default SearchRotatedArrayVisualizer;