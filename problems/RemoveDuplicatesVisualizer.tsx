import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, ArrowRight, 
  ArrowDown, X, Timer, ArrowUp, RefreshCw, 
  ShieldAlert, ArrowRightLeft, TrendingDown, ListOrdered, FastForward, Database, Network,
  Scissors, Filter
} from 'lucide-react';

const APPROACHES = {
  twoPointers: {
    id: 'twoPointers',
    title: '1. Two Pointers (Optimal)',
    subtitle: 'Modify in-place using slow and fast pointers.',
    icon: <Filter size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int removeDuplicates(int[] nums) {
        if (nums.length == 0) return 0;
        
        // i tracks the index of the last unique element found
        int i = 0; 
        
        // j scans through the array to find new unique elements
        for (int j = 1; j < nums.length; j++) {
            if (nums[j] != nums[i]) {
                i++; // Move the slow pointer forward
                nums[i] = nums[j]; // Overwrite the next position
            }
        }
        
        return i + 1; // Length of the unique prefix
    }
}`,
    explanation: "The optimal approach. Since the array is already sorted, all duplicates are grouped together. We can use a 'slow' pointer `i` to keep track of the end of the unique portion of the array, and a 'fast' pointer `j` to scan through the array. Whenever we find a new element (nums[j] != nums[i]), we increment `i` and copy the new element to nums[i]."
  },
  hashSet: {
    id: 'hashSet',
    title: '2. Extra Space (Set)',
    subtitle: 'Collect uniques, then rewrite the array.',
    icon: <Database size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public int removeDuplicates(int[] nums) {
        // LinkedHashSet maintains insertion order
        Set<Integer> set = new LinkedHashSet<>();
        
        // Add all elements to the set (duplicates are ignored)
        for (int num : nums) {
            set.add(num);
        }
        
        // Copy the unique elements back to the original array
        int i = 0;
        for (int num : set) {
            nums[i++] = num;
        }
        
        return set.size();
    }
}`,
    explanation: "A more brute-force conceptual approach. We use a LinkedHashSet to collect all unique elements while preserving their sorted order. Once collected, we iterate through the set and overwrite the beginning of the original array. This fails the O(1) space constraint of the problem but correctly identifies the unique elements."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">26. Remove Duplicates from Sorted Array</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
        <p className="text-lg leading-relaxed">
          Given an integer array <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-600 font-mono font-bold">nums</code> sorted in <strong>non-decreasing order</strong>, remove the duplicates <strong className="text-blue-700">in-place</strong> such that each unique element appears only <strong>once</strong>. The <strong>relative order</strong> of the elements should be kept the same.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-blue-500 pl-4 bg-blue-50 py-2">
          Since it is impossible to change the length of the array in some languages, you must instead have the result be placed in the <strong>first part</strong> of the array <code>nums</code>. More formally, if there are <code>k</code> elements after removing the duplicates, then the first <code>k</code> elements of <code>nums</code> should hold the final result.
        </p>
        
        <p className="text-lg leading-relaxed">
           It does not matter what you leave beyond the first <code>k</code> elements. Return <code>k</code> after placing the final result in the first <code>k</code> slots of <code>nums</code>.
        </p>

        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 text-sm flex gap-3 mt-4 items-start">
            <ShieldAlert className="shrink-0 mt-0.5 text-rose-500" size={18} />
            <div>
                <strong>Constraint:</strong> Do <strong>not</strong> allocate extra space for another array. You must do this by modifying the input array in-place with O(1) extra memory.
            </div>
        </div>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [1,1,2]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 2, nums = [1,2,_]</p>
              <p className="text-slate-500 text-xs mt-2 border-t border-slate-200 pt-2"><span className="text-slate-400 font-bold">Explanation:</span> Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively. It does not matter what you leave beyond the returned k (hence they are underscores).</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [0,0,1,1,1,2,2,3,3,4]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 5, nums = [0,1,2,3,4,_,_,_,_,_]</p>
              <p className="text-slate-500 text-xs mt-2 border-t border-slate-200 pt-2"><span className="text-slate-400 font-bold">Explanation:</span> Your function should return k = 5, with the first five elements of nums being 0, 1, 2, 3, and 4 respectively.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const RemoveDuplicatesVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState<keyof typeof APPROACHES>('twoPointers');
  const [numsInput, setNumsInput] = useState('0, 0, 1, 1, 1, 2, 2, 3, 3, 4');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedNums = useMemo(() => {
    let arr = numsInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (arr.length === 0) return [1, 1, 2];
    // Force sort to maintain constraint of the problem for the visualizer
    return arr.sort((a, b) => a - b);
  }, [numsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    let nums = [...parsedNums];
    const n = nums.length;
    
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({
        phase,
        description: desc,
        line,
        state: { nums: [...nums], ...state }
      });
    };

    if (n === 0) {
        addStep("Empty Array", "Array is empty, returning 0.", 2, { k: 0, isSuccess: true });
        return steps;
    }

    if (selectedApproachId === 'twoPointers') {
        let i = 0;
        addStep("Initialization", `Array length is ${n}. Initialize slow pointer 'i' at index 0.`, 4, { i, j: null });

        for (let j = 1; j < n; j++) {
            addStep("Scan & Compare", `Fast pointer 'j' is at index ${j}. Compare nums[j] (${nums[j]}) with nums[i] (${nums[i]}).`, 8, { i, j, comparing: true });
            
            if (nums[j] !== nums[i]) {
                addStep("Unique Found", `nums[${j}] != nums[${i}]. Found a new unique element! Increment slow pointer 'i'.`, 9, { i, j, incrementing: true });
                i++;
                
                nums[i] = nums[j];
                addStep("Overwrite", `Overwrite nums[${i}] with the new unique element ${nums[j]}.`, 10, { i, j, copying: true });
            } else {
                addStep("Duplicate Skipped", `nums[${j}] == nums[${i}]. It's a duplicate. Ignore it and move 'j' forward.`, 8, { i, j, duplicate: true });
            }
        }
        
        let k = i + 1;
        addStep("Complete", `Fast pointer 'j' reached the end. The number of unique elements 'k' is i + 1 = ${k}.`, 14, { i, j: n, isSuccess: true, k });
        
    } 
    else if (selectedApproachId === 'hashSet') {
        let set = new Set<number>();
        addStep("Initialization", "Create an empty LinkedHashSet to maintain insertion order while collecting unique elements.", 3, { set: Array.from(set), currNum: null, listI: null });

        for (let j = 0; j < nums.length; j++) {
            let num = nums[j];
            if (!set.has(num)) {
                set.add(num);
                addStep("Add to Set", `Element ${num} is not in the set. Adding it.`, 6, { set: Array.from(set), currNum: j, j });
            } else {
                addStep("Duplicate Ignored", `Element ${num} is already in the set. Skipping.`, 6, { set: Array.from(set), currNum: j, j, duplicate: true });
            }
        }

        let i = 0;
        addStep("Set Populated", `All unique elements collected. Now, copy them back into the original array.`, 10, { set: Array.from(set), currNum: null, j: null, listI: i });

        for (let num of set) {
            nums[i] = num;
            addStep("Overwrite Array", `Write ${num} to nums[${i}]. Increment i.`, 12, { set: Array.from(set), currNum: null, j: null, listI: i, copying: true, writingNum: num });
            i++;
        }

        addStep("Complete", `Returned set size: ${set.size}.`, 15, { set: Array.from(set), currNum: null, j: null, listI: i, isSuccess: true, k: set.size });
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
  const { isSuccess, nums, i, j, k, comparing, incrementing, copying, duplicate, set, currNum, listI, writingNum } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center">
                <Scissors className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Remove Duplicates</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 26</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Two Pointers</span>
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
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-blue-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
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
                      <Code2 size={14} className="text-blue-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {/* Highlighter Bar */}
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : duplicate ? 'bg-amber-500/15 border-amber-500' : 'bg-blue-500/20 border-blue-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="blue" />
                      ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Current Variables</h4>
                      </div>
                    </div>
                    
                    {selectedApproachId === 'twoPointers' ? (
                        <div className="grid grid-cols-2 gap-3">
                            <VariableCard label="Slow Pointer (i)" val={i ?? null} arrVal={i !== undefined && i !== null ? nums[i] : null} color="emerald" active={i !== undefined && i !== null} />
                            <VariableCard label="Fast Pointer (j)" val={j ?? null} arrVal={j !== undefined && j !== null && j < nums.length ? nums[j] : null} color="blue" active={j !== null && j !== undefined && j < nums.length} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <VariableCard label="Scan Index" val={currNum ?? null} arrVal={currNum !== null && currNum !== undefined ? nums[currNum] : null} color="blue" active={currNum !== null} />
                            <VariableCard label="Write Index (i)" val={listI ?? null} arrVal={writingNum ?? null} color="emerald" active={listI !== null} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Simulation Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-blue-600 uppercase block pl-1 tracking-widest font-mono">Sorted Array (comma separated)</label>
                        <input type="text" value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner" placeholder="0, 0, 1, 1, 1, 2, 2, 3, 3, 4" />
                        <span className="text-[9px] text-slate-400 font-bold block mt-1 px-1">Note: Array is automatically sorted if entered out of order.</span>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Action Log / Status */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : duplicate ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : duplicate ? <RefreshCw size={100}/> : <ListOrdered size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : duplicate ? "text-amber-400" : "text-blue-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : duplicate ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>Line {cur.line}</div>
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
                   {selectedApproachId === 'twoPointers' && (
                       <div className="flex flex-col items-center w-full relative z-10">
                          
                          {/* Top Prefix Indicator Line */}
                          <div className="w-full relative h-4 mb-4 mt-8 flex px-1">
                              {i !== undefined && i !== null && !isSuccess && (
                                  <div className="absolute h-1 bg-emerald-400 top-0 left-0 transition-all duration-500 rounded-full" style={{ width: `${Math.min(100, Math.max(0, ((i + 1) / nums.length) * 100))}%` }}>
                                      <div className="absolute right-0 -top-6 text-[10px] font-black text-emerald-600 font-mono whitespace-nowrap bg-emerald-50 px-2 rounded-full border border-emerald-200">Unique Prefix</div>
                                  </div>
                              )}
                          </div>

                          {/* Actual Array Blocks */}
                          <div className="flex gap-2 flex-wrap justify-center relative w-full">
                              {nums.map((val: number, idx: number) => {
                                  
                                  let bgClass = "bg-white";
                                  let borderClass = "border-slate-200";
                                  let textClass = "text-slate-800";
                                  let topPointer = null;
                                  let bottomPointer = null;

                                  const inPrefix = idx <= (i ?? -1);
                                  
                                  if (inPrefix) {
                                      bgClass = "bg-emerald-50";
                                      borderClass = "border-emerald-200";
                                      textClass = "text-emerald-800";
                                  } else {
                                      bgClass = "bg-slate-50 opacity-60";
                                  }

                                  if (idx === i) {
                                      bgClass = "bg-emerald-100 scale-110 shadow-md z-10";
                                      borderClass = "border-emerald-400";
                                      topPointer = { label: "i", color: "text-emerald-600", bounce: incrementing };
                                  }
                                  if (idx === j) {
                                      bgClass = duplicate ? "bg-amber-50 scale-110 shadow-md z-10 opacity-100" : "bg-blue-50 scale-110 shadow-md z-10 opacity-100";
                                      borderClass = duplicate ? "border-amber-400" : "border-blue-400";
                                      bottomPointer = { label: "j", color: duplicate ? "text-amber-500" : "text-blue-500", bounce: true };
                                      textClass = duplicate ? "text-amber-800" : "text-blue-800";
                                  }
                                  
                                  if (comparing && (idx === i || idx === j)) {
                                      borderClass = duplicate ? "border-amber-500 border-dashed" : "border-blue-500 border-dashed";
                                  }
                                  
                                  if (copying && idx === i) {
                                      bgClass = "bg-emerald-400 text-white scale-125 shadow-xl z-20";
                                      borderClass = "border-emerald-500";
                                      textClass = "text-white";
                                  }

                                  if (isSuccess) {
                                      if (idx < k) {
                                          bgClass = "bg-emerald-50 shadow-sm opacity-100";
                                          borderClass = "border-emerald-300";
                                          textClass = "text-emerald-800";
                                      } else {
                                          bgClass = "bg-slate-50 opacity-30 text-transparent"; // Fade out the irrelevant part
                                          borderClass = "border-slate-100";
                                      }
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
                                          <div className={`w-10 h-14 sm:w-12 sm:h-16 md:w-14 md:h-18 border-2 rounded-xl flex items-center justify-center font-mono font-black text-xl transition-all duration-500 ${bgClass} ${borderClass} ${textClass}`}>
                                              {val}
                                          </div>
                                          
                                          {/* Bottom Pointer & Index */}
                                          <div className="absolute -bottom-12 flex flex-col items-center justify-start h-10 w-full gap-1">
                                              <span className={`text-[10px] font-mono font-bold mt-1 ${isSuccess && idx < k ? 'text-emerald-400' : 'text-slate-300'}`}>{idx}</span>
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

                   {/* HASH SET APPROACH VISUAL */}
                   {selectedApproachId === 'hashSet' && (
                        <div className="w-full flex flex-col items-center gap-8 relative z-10">
                            
                            {/* Original Array Scan */}
                            <div className="w-full flex flex-col items-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-2">Original Array</span>
                                <div className="flex gap-2 flex-wrap justify-center relative w-full">
                                    {nums.map((val: number, idx: number) => {
                                        let bgClass = "bg-white";
                                        let borderClass = "border-slate-200 text-slate-400";
                                        
                                        if (currNum === idx) {
                                            bgClass = duplicate ? "bg-amber-100 scale-110 shadow-md z-10" : "bg-blue-100 scale-110 shadow-md z-10";
                                            borderClass = duplicate ? "border-amber-400 text-amber-800" : "border-blue-400 text-blue-800";
                                        } else if (listI !== null && idx === listI) {
                                            bgClass = "bg-emerald-100 scale-110 shadow-md z-10";
                                            borderClass = "border-emerald-400 text-emerald-800";
                                        } else if (listI !== null && idx < listI) {
                                            bgClass = "bg-emerald-50";
                                            borderClass = "border-emerald-200 text-emerald-700";
                                        } else if (listI !== null && idx > listI) {
                                            bgClass = "bg-slate-50 opacity-40";
                                        }

                                        if (copying && idx === listI) {
                                            bgClass = "bg-emerald-400 text-white scale-125 shadow-xl z-20";
                                            borderClass = "border-emerald-500";
                                        }

                                        if (isSuccess) {
                                              if (idx < k) {
                                                  bgClass = "bg-emerald-50 shadow-sm opacity-100";
                                                  borderClass = "border-emerald-300 text-emerald-800";
                                              } else {
                                                  bgClass = "bg-slate-50 opacity-30 text-transparent";
                                                  borderClass = "border-slate-100";
                                              }
                                        }

                                        return (
                                            <div key={`orig-${idx}`} className={`w-10 h-10 flex items-center justify-center border-2 rounded-lg font-mono font-black text-sm transition-all duration-300 ${bgClass} ${borderClass}`}>
                                                {val}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <ArrowDown size={24} className="text-slate-300" />

                            {/* Set Display */}
                            <div className="w-full max-w-lg bg-slate-100 border border-slate-200 rounded-3xl p-6 shadow-inner flex flex-col items-center min-h-[140px]">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono mb-4 flex items-center gap-2"><Database size={14}/> LinkedHashSet Memory O(N)</span>
                                <div className="flex gap-2 flex-wrap justify-center w-full">
                                    {set && set.length > 0 ? set.map((val: number, idx: number) => {
                                        const justAdded = currNum !== null && nums[currNum] === val && !duplicate;
                                        const isWriting = listI !== null && writingNum === val && copying;
                                        
                                        let bgClass = "bg-white border-blue-200 text-blue-800 shadow-sm";
                                        if (justAdded) bgClass = "bg-blue-500 border-blue-600 text-white scale-110 shadow-md animate-in zoom-in";
                                        if (isWriting) bgClass = "bg-emerald-100 border-emerald-400 text-emerald-800 scale-110 shadow-md";

                                        return (
                                            <div key={`set-${idx}`} className={`w-12 h-12 flex items-center justify-center border-2 rounded-full font-mono font-black transition-all duration-300 ${bgClass}`}>
                                                {val}
                                            </div>
                                        )
                                    }) : (
                                        <span className="text-slate-400 font-mono italic text-sm mt-2">Empty Set...</span>
                                    )}
                                </div>
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
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">DUPLICATES REMOVED</span>
                              <span className="text-xs font-black uppercase text-emerald-600 tracking-widest font-mono mb-4 block">Returned k = {k}</span>
                              
                              <div className="bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl shadow-inner mt-2 flex flex-col items-center">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-2">Final Array Output</span>
                                  <div className="flex gap-1 text-xl font-mono font-black tracking-widest">
                                      <span className="text-slate-500">[</span>
                                      {nums.map((num: number, idx: number) => (
                                          <span key={idx} className={idx < k ? "text-emerald-700" : "text-slate-300"}>
                                              {idx < k ? num : '_'}
                                              {idx < nums.length - 1 ? <span className="text-slate-300">, </span> : ''}
                                          </span>
                                      ))}
                                      <span className="text-slate-500">]</span>
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
                <Filter className="text-blue-600"/> The Slow & Fast Pointer Technique
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-blue-100 pl-6">
                When you need to process an array in-place and remove elements, the <strong>Slow & Fast Pointer</strong> strategy is your best friend. It allows you to logically split the array into a "processed" section and an "unprocessed" section without needing extra memory.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-emerald-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowDown size={18}/> The Slow Pointer (i)
                        </h3>
                        <p className="text-sm text-emerald-800 leading-relaxed mb-4">
                            Acts as the "Write Head".
                        </p>
                        <p className="text-xs text-emerald-800 leading-relaxed font-bold bg-white p-3 rounded-lg border border-emerald-200">
                            It marks the boundary of the unique elements we have successfully gathered so far. Everything from index 0 up to <code>i</code> is guaranteed to be unique. We only increment <code>i</code> when we find a brand new element to add to this valid prefix.
                        </p>
                    </div>
                    
                    <div className="p-8 bg-blue-50 border border-blue-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-blue-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowUp size={18}/> The Fast Pointer (j)
                        </h3>
                        <p className="text-xs text-blue-800 leading-relaxed mb-4">
                            Acts as the "Read Head" or "Scout".
                        </p>
                        <p className="text-xs text-blue-800 leading-relaxed font-bold bg-white p-3 rounded-lg border border-blue-200">
                            It relentlessly scans forward through the array. Because the array is sorted, duplicates are clumped together. The fast pointer ignores clumped duplicates and only stops when it detects a number that is different from the last known unique number (<code>nums[i]</code>).
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <ArrowRightLeft size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-blue-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Why sorting matters</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed">
                        <p>
                           If the array wasn't sorted, we would have to compare the fast pointer <code>j</code> against <em>every</em> element in the slow pointer's prefix to know if it's truly unique. That would take O(N²) time!
                        </p>
                        <p>
                           Because the input is sorted, we know that if <code>nums[j]</code> is a duplicate, it <strong>must</strong> be a duplicate of the very last unique number we found, which sits conveniently at <code>nums[i]</code>.
                        </p>
                        <div className="bg-blue-900/40 border border-blue-500/30 text-blue-300 p-4 rounded-xl mt-4 font-mono text-[10px] flex items-center justify-between">
                           <span>O(1) Comparison:</span>
                           <span className="font-bold">if (nums[j] != nums[i])</span>
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
                        "By taking advantage of the fact that the input array is already sorted, we can avoid the O(N) auxiliary space required by a HashSet. I implemented the two-pointer technique where the slow pointer maintains the bounds of the unique prefix, and the fast pointer iterates through the array sequentially. This allows us to modify the array in-place, achieving an optimal O(N) time complexity and O(1) space complexity."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Why not use Array.splice()?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                In languages like JavaScript or Python, it's tempting to use <code>splice()</code> or <code>pop()</code> to actually remove elements from the array. However, removing an element from the middle of an array requires shifting all subsequent elements left, which is an O(N) operation. Doing this inside a loop makes the algorithm <strong>O(N²)</strong>. The Two Pointers approach overwrites values instead of shifting, maintaining pure O(N) time.
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
                                <p className="text-[10px] text-slate-500 mt-1">Both the fast and slow pointers move in a single direction. We iterate through the array of length N exactly once.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We are only allocating two integer variables (i and j) for our pointers. Modifying the array is done strictly in-place.</p>
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

const VariableCard = ({ label, val, arrVal, color, active }: { label: string, val: number | string | null, arrVal?: number | string | null, color: 'blue' | 'purple' | 'amber' | 'emerald' | 'sky' | 'violet', active: boolean }) => {
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
             {active && arrVal !== undefined && arrVal !== null && (
                 <div className="absolute bottom-0 w-full text-center bg-black/5 text-[9px] font-black py-0.5 mt-2">
                     val: {arrVal}
                 </div>
             )}
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean, theme?: 'cyan' | 'violet' | 'rose' | 'emerald' | 'amber' | 'indigo' | 'fuchsia' | 'teal' | 'blue' }> = ({ num, code, active, theme = 'blue' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|char|List|Integer|Set|LinkedHashSet)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'LinkedHashSet'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-yellow-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default RemoveDuplicatesVisualizer;