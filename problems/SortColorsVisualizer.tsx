import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Database, ListOrdered, Zap, ArrowLeftRight, Timer,
  Palette, RefreshCw, Hash
} from 'lucide-react';

const APPROACHES = {
  optimalDNF: {
    id: 'optimalDNF',
    title: '1. Dutch National Flag',
    subtitle: 'Optimal: O(N) Time, O(1) Space, 1-Pass.',
    icon: <ArrowLeftRight size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public void sortColors(int[] nums) {
        int low = 0;
        int mid = 0;
        int high = nums.length - 1;
        
        while (mid <= high) {
            if (nums[mid] == 0) {
                // Swap nums[low] and nums[mid]
                int temp = nums[low];
                nums[low] = nums[mid];
                nums[mid] = temp;
                low++;
                mid++;
            } else if (nums[mid] == 1) {
                mid++;
            } else {
                // Swap nums[mid] and nums[high]
                int temp = nums[high];
                nums[high] = nums[mid];
                nums[mid] = temp;
                high--;
            }
        }
    }
}`,
    explanation: "The Dutch National Flag algorithm (invented by Edsger W. Dijkstra) sorts an array of 3 distinct values in a single pass. We use 3 pointers: 'low' tracks where the next 0 should go, 'high' tracks where the next 2 should go, and 'mid' is our current explorer. As 'mid' scans the array: if it finds a 0, we swap it to the 'low' boundary and move both up. If it finds a 1, it's already in the middle, so we just move 'mid' up. If it finds a 2, we swap it to the 'high' boundary and move 'high' down (but we DON'T move 'mid' because the newly swapped element needs to be evaluated!)."
  },
  countingSort: {
    id: 'countingSort',
    title: '2. Counting Sort',
    subtitle: 'Standard: O(N) Time, 2-Pass.',
    icon: <Hash size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public void sortColors(int[] nums) {
        int count0 = 0, count1 = 0, count2 = 0;
        
        // Pass 1: Count the occurrences of each color
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == 0) count0++;
            else if (nums[i] == 1) count1++;
            else if (nums[i] == 2) count2++;
        }
        
        // Pass 2: Overwrite array based on counts
        int i = 0;
        while (count0 > 0) {
            nums[i++] = 0;
            count0--;
        }
        while (count1 > 0) {
            nums[i++] = 1;
            count1--;
        }
        while (count2 > 0) {
            nums[i++] = 2;
            count2--;
        }
    }
}`,
    explanation: "Because there are only 3 specific values (0, 1, and 2), we can use a simple Counting Sort. We first iterate through the entire array and count exactly how many 0s, 1s, and 2s exist. Once we have the counts, we iterate through the array a second time and simply overwrite the elements in order: first putting all the 0s, then the 1s, then the 2s. While easy to understand, this requires two full passes over the array."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">75. Sort Colors</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given an array <code>nums</code> with <code>n</code> objects colored red, white, or blue, sort them <strong>in-place</strong> so that objects of the same color are adjacent, with the colors in the order red, white, and blue.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-violet-500 pl-4 bg-violet-50 py-2 mt-4">
          We will use the integers <code>0</code>, <code>1</code>, and <code>2</code> to represent the color red, white, and blue, respectively.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm flex gap-3 mt-6 items-start shadow-sm">
            <AlertCircle className="shrink-0 mt-0.5 text-amber-500" size={18} />
            <div className="space-y-2">
                <p><strong>Constraint:</strong> You must solve this problem without using the library's sort function.</p>
                <p><strong>Follow-up:</strong> Could you come up with a one-pass algorithm using only <code>O(1)</code> constant space?</p>
            </div>
        </div>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [2,0,2,1,1,0]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [0,0,1,1,2,2]</p>
              <div className="flex gap-2 mt-4">
                  <div className="w-6 h-6 rounded bg-red-500 shadow-sm border border-red-600"></div>
                  <div className="w-6 h-6 rounded bg-red-500 shadow-sm border border-red-600"></div>
                  <div className="w-6 h-6 rounded bg-slate-100 shadow-sm border border-slate-300"></div>
                  <div className="w-6 h-6 rounded bg-slate-100 shadow-sm border border-slate-300"></div>
                  <div className="w-6 h-6 rounded bg-blue-500 shadow-sm border border-blue-600"></div>
                  <div className="w-6 h-6 rounded bg-blue-500 shadow-sm border border-blue-600"></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [2,0,1]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [0,1,2]</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>n == nums.length</code></li>
              <li><code>1 &lt;= n &lt;= 300</code></li>
              <li><code>nums[i]</code> is either <code>0</code>, <code>1</code>, or <code>2</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const SortColorsVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('optimalDNF');
  const [numsInput, setNumsInput] = useState('2, 0, 2, 1, 1, 0');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let arr = numsInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 0 && n <= 2);
    if (arr.length === 0) arr = [2, 0, 2, 1, 1, 0];
    if (arr.length > 12) arr = arr.slice(0, 12); // Limit for UI stability
    return { arr };
  }, [numsInput]);

  const trace = useMemo(() => {
    const steps = [];
    const originalArr = [...parsedData.arr];
    
    const cloneArr = (arr) => [...arr];

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return;
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'optimalDNF') {
        let nums = cloneArr(originalArr);
        let low = 0, mid = 0, high = nums.length - 1;
        
        addStep("Initialization", `Set up pointers.\nlow = ${low} (Tracks next 0 position)\nmid = ${mid} (Current explorer)\nhigh = ${high} (Tracks next 2 position)`, 3, { nums: cloneArr(nums), low, mid, high });
        
        let iter = 0;
        while (mid <= high && iter++ < 100) {
            addStep("Loop Condition", `Line 7: while (mid <= high) \n${mid} <= ${high} is True. Continue sorting.`, 7, { nums: cloneArr(nums), low, mid, high, activeAction: 'checking' });
            
            if (nums[mid] === 0) {
                addStep("Check 0", `Line 8: nums[mid] == 0 is True.\nFound a 0 (Red) at index ${mid}. It belongs at the 'low' boundary.`, 8, { nums: cloneArr(nums), low, mid, high, activeAction: 'check0' });
                
                // Swap logic
                let temp = nums[low];
                nums[low] = nums[mid];
                nums[mid] = temp;
                addStep("Swap", `Line 10-12: Swap nums[low] and nums[mid].\nSwapping elements at index ${low} and ${mid}.`, 11, { nums: cloneArr(nums), low, mid, high, activeAction: 'swap', swapIdx1: low, swapIdx2: mid });
                
                low++;
                mid++;
                addStep("Update Pointers", `Line 13-14: low++, mid++.\n0 is safely placed. Advance both pointers. low=${low}, mid=${mid}.`, 14, { nums: cloneArr(nums), low, mid, high, activeAction: 'update' });
                
            } else if (nums[mid] === 1) {
                addStep("Check 1", `Line 15: nums[mid] == 1 is True.\nFound a 1 (White). It's already in the correct middle section.`, 15, { nums: cloneArr(nums), low, mid, high, activeAction: 'check1' });
                mid++;
                addStep("Update Pointer", `Line 16: mid++.\nJust advance explorer. mid=${mid}.`, 16, { nums: cloneArr(nums), low, mid, high, activeAction: 'update' });
            } else {
                addStep("Check 2", `Line 17: nums[mid] == 2 is True.\nFound a 2 (Blue). It belongs at the 'high' boundary.`, 17, { nums: cloneArr(nums), low, mid, high, activeAction: 'check2' });
                
                // Swap logic
                let temp = nums[high];
                nums[high] = nums[mid];
                nums[mid] = temp;
                addStep("Swap", `Line 19-21: Swap nums[mid] and nums[high].\nSwapping elements at index ${mid} and ${high}.`, 20, { nums: cloneArr(nums), low, mid, high, activeAction: 'swap', swapIdx1: mid, swapIdx2: high });
                
                high--;
                addStep("Update Pointer", `Line 22: high--.\n2 is safely placed at the end. high=${high}.\nNotice mid is NOT incremented, because the new nums[mid] is un-evaluated!`, 22, { nums: cloneArr(nums), low, mid, high, activeAction: 'update' });
            }
        }
        
        addStep("Termination", `Line 7: mid (${mid}) > high (${high}).\nLoop terminates. Array is sorted!`, 7, { nums: cloneArr(nums), low, mid, high, isSuccess: true });
        
    } else if (selectedApproachId === 'countingSort') {
        let nums = cloneArr(originalArr);
        let count0 = 0, count1 = 0, count2 = 0;
        
        addStep("Initialization", `Set up counters. count0=0, count1=0, count2=0.`, 3, { nums: cloneArr(nums), count0, count1, count2, i: null });
        
        // Pass 1
        for (let i = 0; i < nums.length; i++) {
            addStep("Pass 1: Counting", `Line 6: Iterating array to count occurrences. i=${i}.`, 6, { nums: cloneArr(nums), count0, count1, count2, i, pass: 1 });
            if (nums[i] === 0) {
                count0++;
                addStep("Count 0", `Line 7: Found a 0. count0 becomes ${count0}.`, 7, { nums: cloneArr(nums), count0, count1, count2, i, pass: 1, activeCount: 0 });
            }
            else if (nums[i] === 1) {
                count1++;
                addStep("Count 1", `Line 8: Found a 1. count1 becomes ${count1}.`, 8, { nums: cloneArr(nums), count0, count1, count2, i, pass: 1, activeCount: 1 });
            }
            else {
                count2++;
                addStep("Count 2", `Line 9: Found a 2. count2 becomes ${count2}.`, 9, { nums: cloneArr(nums), count0, count1, count2, i, pass: 1, activeCount: 2 });
            }
        }
        
        addStep("Pass 1 Complete", `Pass 1 done. Total counts: 0s: ${count0}, 1s: ${count1}, 2s: ${count2}.`, 11, { nums: cloneArr(nums), count0, count1, count2, i: null, pass: 2 });
        
        // Pass 2
        let i = 0;
        addStep("Pass 2: Reset pointer", `Line 12: Reset index pointer i = 0.`, 12, { nums: cloneArr(nums), count0, count1, count2, i, pass: 2 });
        
        while (count0 > 0) {
            addStep("Overwrite 0s", `Line 13: count0 > 0. Overwriting nums[${i}] with 0.`, 13, { nums: cloneArr(nums), count0, count1, count2, i, pass: 2, writing: 0 });
            nums[i++] = 0;
            count0--;
            addStep("Update", `Line 14-15: Decrement count0 to ${count0}. Move i to ${i}.`, 15, { nums: cloneArr(nums), count0, count1, count2, i, pass: 2 });
        }
        while (count1 > 0) {
            addStep("Overwrite 1s", `Line 17: count1 > 0. Overwriting nums[${i}] with 1.`, 17, { nums: cloneArr(nums), count0, count1, count2, i, pass: 2, writing: 1 });
            nums[i++] = 1;
            count1--;
            addStep("Update", `Line 18-19: Decrement count1 to ${count1}. Move i to ${i}.`, 19, { nums: cloneArr(nums), count0, count1, count2, i, pass: 2 });
        }
        while (count2 > 0) {
            addStep("Overwrite 2s", `Line 21: count2 > 0. Overwriting nums[${i}] with 2.`, 21, { nums: cloneArr(nums), count0, count1, count2, i, pass: 2, writing: 2 });
            nums[i++] = 2;
            count2--;
            addStep("Update", `Line 22-23: Decrement count2 to ${count2}. Move i to ${i}.`, 23, { nums: cloneArr(nums), count0, count1, count2, i, pass: 2 });
        }
        
        addStep("Termination", `All counts exhausted. Array is sorted!`, 25, { nums: cloneArr(nums), count0, count1, count2, i: null, isSuccess: true });
    }

    if (steps.length === 0) {
        addStep("Init", "Start", 1, { nums: parsedData.arr });
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
  const { isSuccess, nums, low, mid, high, swapIdx1, swapIdx2, count0, count1, count2, i, activeCount, writing } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Palette className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Sort Colors</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 75</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : 'bg-violet-500/20 border-violet-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
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
                    
                    {selectedApproachId === 'optimalDNF' ? (
                        <div className="grid grid-cols-3 gap-3">
                            <VariableCard label="low" val={low ?? null} arrVal={low !== undefined && nums ? nums[low] : null} color="rose" active={low !== null && low !== undefined} />
                            <VariableCard label="mid" val={mid ?? null} arrVal={mid !== undefined && nums ? nums[mid] : null} color="slate" active={mid !== null && mid !== undefined} />
                            <VariableCard label="high" val={high ?? null} arrVal={high !== undefined && nums ? nums[high] : null} color="sky" active={high !== null && high !== undefined} />
                        </div>
                    ) : (
                         <div className="grid grid-cols-4 gap-3">
                            <VariableCard label="0s Count" val={count0 ?? null} color="rose" active={count0 !== null} />
                            <VariableCard label="1s Count" val={count1 ?? null} color="slate" active={count1 !== null} />
                            <VariableCard label="2s Count" val={count2 ?? null} color="sky" active={count2 !== null} />
                            <VariableCard label="Index (i)" val={i ?? null} arrVal={i !== null && nums ? nums[i] : null} color="violet" active={i !== null} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Colors (0, 1, 2 only)</label>
                        <input type="text" value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="2, 0, 2, 1, 1, 0" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : <Palette size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : "text-violet-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line">{cur.description}</p>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-center justify-center">
                   
                   <div className="flex flex-col items-center justify-center w-full h-full relative z-10 gap-12 pt-8">
                      
                      {/* Array Representation */}
                      <div className="flex gap-2 flex-wrap justify-center relative w-full mb-8">
                          {nums?.map((v, idx) => {
                              // Define Colors
                              let bgClass = "bg-white";
                              let borderClass = "border-slate-200";
                              let textClass = "text-slate-800";
                              let glow = "";
                              
                              if (v === 0) {
                                  bgClass = "bg-red-500"; borderClass = "border-red-600"; textClass = "text-white";
                                  if (writing === 0) glow = "shadow-[0_0_20px_rgba(239,68,68,0.5)] scale-110 z-20";
                              } else if (v === 1) {
                                  bgClass = "bg-slate-100"; borderClass = "border-slate-300"; textClass = "text-slate-700";
                                  if (writing === 1) glow = "shadow-[0_0_20px_rgba(148,163,184,0.5)] scale-110 z-20";
                              } else if (v === 2) {
                                  bgClass = "bg-blue-500"; borderClass = "border-blue-600"; textClass = "text-white";
                                  if (writing === 2) glow = "shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-110 z-20";
                              }
                              
                              // Pointers & Highlights
                              let topPointers = [];
                              let bottomPointers = [];
                              
                              let isSwapping = swapIdx1 === idx || swapIdx2 === idx;
                              if (isSwapping) {
                                  glow = "ring-4 ring-amber-400 scale-110 z-30 shadow-2xl animate-pulse";
                              }

                              if (selectedApproachId === 'optimalDNF') {
                                  if (idx === mid) topPointers.push({ label: "mid", color: "text-slate-600" });
                                  if (idx === low) bottomPointers.push({ label: "low", color: "text-red-500" });
                                  if (idx === high) bottomPointers.push({ label: "high", color: "text-blue-500" });
                              } else if (selectedApproachId === 'countingSort') {
                                  if (idx === i) topPointers.push({ label: "i", color: "text-violet-600", active: true });
                              }

                              return (
                                  <div key={`${idx}-${v}-${isSwapping}`} className={`flex flex-col items-center relative transition-all duration-300 z-10`}>
                                      {/* Top Pointers */}
                                      <div className="absolute -top-12 flex flex-col items-center justify-end h-10 w-full gap-1">
                                          {topPointers.map((p, pIdx) => (
                                              <div key={pIdx} className={`flex flex-col items-center ${p.active || idx === mid ? 'animate-bounce' : ''}`}>
                                                  <span className={`text-[10px] font-black font-mono tracking-widest ${p.color} bg-white px-1 rounded`}>{p.label}</span>
                                                  <ArrowDown size={14} className={p.color} strokeWidth={3}/>
                                              </div>
                                          ))}
                                      </div>

                                      {/* Main Block */}
                                      <div className={`w-12 h-14 md:w-16 md:h-20 border-2 rounded-xl flex flex-col items-center justify-center font-mono font-black text-2xl transition-all duration-500 shadow-sm ${bgClass} ${borderClass} ${textClass} ${glow}`}>
                                          <span>{v}</span>
                                      </div>
                                      
                                      {/* Bottom Pointers */}
                                      <div className="absolute -bottom-14 flex flex-col items-center justify-start h-12 w-full gap-1">
                                          <span className="text-[10px] font-mono font-bold text-slate-400 mt-1">{idx}</span>
                                          {bottomPointers.length > 0 && (
                                              <div className="flex gap-1">
                                                  {bottomPointers.map((p, pIdx) => (
                                                      <div key={pIdx} className={`flex flex-col items-center`}>
                                                          <ArrowUp size={14} className={p.color} strokeWidth={3}/>
                                                          <span className={`text-[9px] font-black font-mono tracking-widest ${p.color} bg-white px-0.5 rounded`}>{p.label}</span>
                                                      </div>
                                                  ))}
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              );
                          })}
                      </div>

                      {/* Swap Indicator Overlay */}
                      {swapIdx1 !== undefined && swapIdx2 !== undefined && swapIdx1 !== swapIdx2 && (
                          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-40 opacity-70 animate-in fade-in slide-in-from-bottom-4">
                              <div className="bg-amber-100 text-amber-800 border-2 border-amber-400 px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-2xl">
                                  <RefreshCw size={18} className="animate-spin" /> Swapping {swapIdx1} & {swapIdx2}
                              </div>
                          </div>
                      )}

                      {/* Counting Sort Counters */}
                      {selectedApproachId === 'countingSort' && count0 !== undefined && (
                          <div className="flex gap-6 mt-8 p-6 bg-slate-50 border border-slate-200 rounded-3xl w-full max-w-md justify-between shadow-inner">
                              <div className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all w-24 ${activeCount === 0 || writing === 0 ? 'bg-red-100 border-red-500 scale-110 shadow-md' : 'bg-white border-slate-200'}`}>
                                  <span className="text-[10px] font-black uppercase text-slate-400 mb-1">0s Count</span>
                                  <span className={`text-2xl font-black font-mono ${activeCount === 0 || writing === 0 ? 'text-red-600' : 'text-slate-700'}`}>{count0}</span>
                              </div>
                              <div className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all w-24 ${activeCount === 1 || writing === 1 ? 'bg-slate-200 border-slate-400 scale-110 shadow-md' : 'bg-white border-slate-200'}`}>
                                  <span className="text-[10px] font-black uppercase text-slate-400 mb-1">1s Count</span>
                                  <span className={`text-2xl font-black font-mono ${activeCount === 1 || writing === 1 ? 'text-slate-700' : 'text-slate-700'}`}>{count1}</span>
                              </div>
                              <div className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all w-24 ${activeCount === 2 || writing === 2 ? 'bg-blue-100 border-blue-500 scale-110 shadow-md' : 'bg-white border-slate-200'}`}>
                                  <span className="text-[10px] font-black uppercase text-slate-400 mb-1">2s Count</span>
                                  <span className={`text-2xl font-black font-mono ${activeCount === 2 || writing === 2 ? 'text-blue-600' : 'text-slate-700'}`}>{count2}</span>
                              </div>
                          </div>
                      )}

                      {/* DNF Legend */}
                      {selectedApproachId === 'optimalDNF' && !isSuccess && (
                          <div className="flex gap-4 mt-8 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-mono text-slate-500 uppercase font-black tracking-widest shadow-inner">
                              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded border border-red-600"></span> 0s bound by low</div>
                              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-slate-200 rounded border border-slate-300"></span> 1s bound by mid</div>
                              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded border border-blue-600"></span> 2s bound by high</div>
                          </div>
                      )}

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-emerald-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-emerald-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">ARRAY SORTED</span>
                              <span className="text-xs font-black uppercase text-emerald-600 tracking-widest font-mono mb-4 block">In-Place Modification Complete</span>
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
                <Palette className="text-violet-600"/> The Dutch National Flag Problem
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Proposed by Edsger W. Dijkstra, this algorithm gets its name because sorting an array of 0s, 1s, and 2s mimics organizing the Red, White, and Blue bands of the Dutch national flag. It is the definitive solution for partitioning an array into three distinct regions in $O(N)$ time and $O(1)$ space.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ListOrdered size={18}/> The 3 Pointers Strategy
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            The array is conceptually divided into 4 regions, maintained by 3 pointers: <code>low</code>, <code>mid</code>, and <code>high</code>.
                        </p>
                        <ul className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-2">
                            <li><strong>Region 1 (0s):</strong> <code>[0, low-1]</code>. All 0s sit here.</li>
                            <li><strong>Region 2 (1s):</strong> <code>[low, mid-1]</code>. All 1s sit here.</li>
                            <li><strong>Region 3 (?):</strong> <code>[mid, high]</code>. Unexplored territory.</li>
                            <li><strong>Region 4 (2s):</strong> <code>[high+1, N-1]</code>. All 2s sit here.</li>
                        </ul>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Zap size={18}/> Handling Swaps
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            As <code>mid</code> explores the unknown region, it decides what to do based on the value it sees:
                        </p>
                        <p className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner">
                            <strong>If 0:</strong> Swap with <code>low</code>. 0 is now in the correct left region. We increment both <code>low</code> and <code>mid</code>.<br/><br/>
                            <strong>If 1:</strong> It's already in the middle region! Just increment <code>mid</code>.<br/><br/>
                            <strong>If 2:</strong> Swap with <code>high</code>. 2 is now in the correct right region. Decrement <code>high</code>. <strong>Crucially, do NOT increment `mid`</strong>, because the element swapped from `high` is unknown and must be evaluated.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Database size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-emerald-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Why not just use Arrays.sort()?</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed">
                        <p>
                           Using the built-in library sort (e.g., <code>Arrays.sort()</code> in Java or <code>.sort()</code> in JS) runs in <strong>$O(N \log N)$</strong> time. While fast, it ignores the critical constraint of the problem: there are only 3 unique values.
                        </p>
                        <p>
                           When sorting an array with a massively limited set of possible values (like 0,1,2), $O(N \log N)$ comparison-based sorting is overkill. We can achieve linear <strong>$O(N)$</strong> time using counting or the Dutch National Flag algorithm, operating in a single pass, which is significantly faster for large arrays.
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
                        "I solved this problem optimally using Dijkstra's Dutch National Flag algorithm. Since the array only contains 0s, 1s, and 2s, we can sort it in a single pass with $O(1)$ auxiliary space. I used three pointers: `low` to track the boundary for 0s, `high` for 2s, and `mid` to scan the array. As `mid` iterates, it swaps 0s to the front and 2s to the back. This is strictly better than the 2-pass Counting Sort approach, as it reads through memory only once, which is highly efficient for cache performance."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Why not increment 'mid' on a 2?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                When <code>nums[mid] == 2</code>, we swap it with <code>nums[high]</code>. We know a 2 went to the back, so we can do <code>high--</code>. However, the element that just got swapped into the <code>mid</code> position came from the unexamined end of the array. It could be a 0, 1, or 2! If we did <code>mid++</code>, we would skip evaluating this unknown element, potentially leaving a 0 or 2 stuck in the middle.
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
                                <p className="text-[10px] text-slate-500 mt-1">The `mid` pointer iterates through the array from left to right, and the `high` pointer moves from right to left. They meet in the middle. Every element is checked exactly once, making it strictly $O(N)$.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">The sorting happens entirely in-place. We only allocate three integer variables (`low`, `mid`, `high`) regardless of the array's size.</p>
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

const VariableCard: React.FC<{ label: string; val: any; arrVal?: any; color: string; active: boolean }> = ({ label, val, arrVal, color, active }) => {
    const bgMap = {
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        sky: 'bg-sky-50 border-sky-200 text-sky-700',
        rose: 'bg-rose-50 border-rose-200 text-rose-700',
        indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        slate: 'bg-slate-100 border-slate-300 text-slate-700',
        violet: 'bg-violet-50 border-violet-200 text-violet-700'
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

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active: boolean; theme?: string }> = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|Stack|nums|low|mid|high|count0|count1|count2|temp)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math', 'Arrays', 'ArrayList', 'ListNode', 'Stack'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['nums', 'temp'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['low', 'count0'].includes(part)) return <span key={i} className="text-rose-400 font-bold">{part}</span>;
          if (['mid', 'count1'].includes(part)) return <span key={i} className="text-slate-300 font-bold">{part}</span>;
          if (['high', 'count2'].includes(part)) return <span key={i} className="text-blue-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default SortColorsVisualizer;