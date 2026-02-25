import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, ArrowRight, ArrowLeftRight, Zap, RefreshCw, Timer,
  Filter, Trash2, Hash, ShieldCheck, ListFilter
} from 'lucide-react';

const APPROACHES = {
  readerWriter: {
    id: 'readerWriter',
    title: '1. Reader/Writer Pointers',
    subtitle: 'Standard: O(N) Time, O(1) Space.',
    icon: <ListFilter size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int removeElement(int[] nums, int val) {
        int k = 0;
        
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] != val) {
                nums[k] = nums[i];
                k++;
            }
        }
        
        return k;
    }
}`,
    explanation: "This is the classic Fast/Slow Two Pointers technique. We maintain a 'reader' pointer (i) and a 'writer' pointer (k). The reader pointer scans through every element in the array. Whenever the reader finds an element that is NOT the target value, we copy that element to the writer's position, and then increment the writer pointer. If the reader finds the target value, we simply skip it (we do not write it, and we do not increment the writer). By the end of the loop, 'k' will hold the length of the new array, and all valid elements will have been shifted to the front."
  },
  swapWithLast: {
    id: 'swapWithLast',
    title: '2. Swap with Last Element',
    subtitle: 'Optimized for rare elements.',
    icon: <ArrowLeftRight size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int removeElement(int[] nums, int val) {
        int i = 0;
        int n = nums.length;
        
        while (i < n) {
            if (nums[i] == val) {
                nums[i] = nums[n - 1];
                n--;
            } else {
                i++;
            }
        }
        
        return n;
    }
}`,
    explanation: "This is an optimized Two Pointers approach. If the element to remove is rare, the standard approach does a lot of unnecessary copying (e.g., copying an element to its exact same position). Instead, we can maintain an 'end' pointer (n). When we encounter the target value at index 'i', we swap it with the very last element in our valid range (nums[n-1]), and then decrease the valid range ('n--'). We do NOT increment 'i' yet, because the element we just swapped in from the end might also be the target value! If the element is valid, we just increment 'i'."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">27. Remove Element</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given an integer array <code>nums</code> and an integer <code>val</code>, remove all occurrences of <code>val</code> in <code>nums</code> <a href="https://en.wikipedia.org/wiki/In-place_algorithm" target="_blank" rel="noreferrer" className="text-violet-600 font-bold hover:underline">in-place</a>. The order of the elements may be changed. Then return <em>the number of elements in </em><code>nums</code><em> which are not equal to </em><code>val</code>.
        </p>

        <p className="text-lg leading-relaxed">
          Consider the number of elements in <code>nums</code> which are not equal to <code>val</code> be <code>k</code>, to get accepted, you need to do the following things:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-slate-800 marker:text-violet-500 font-medium">
            <li>Change the array <code>nums</code> such that the first <code>k</code> elements of <code>nums</code> contain the elements which are not equal to <code>val</code>. The remaining elements of <code>nums</code> are not important as well as the size of <code>nums</code>.</li>
            <li>Return <code>k</code>.</li>
        </ul>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [3,2,2,3], val = 3</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 2, nums = [2,2,_,_]</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: Your function should return k = 2, with the first two elements of nums being 2. It does not matter what you leave beyond the returned k (hence they are underscores).</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [0,1,2,2,3,0,4,2], val = 2</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 5, nums = [0,1,4,0,3,_,_,_]</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: Your function should return k = 5, with the first five elements of nums containing 0, 0, 1, 3, and 4. Note that the five elements can be returned in any order.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>0 &lt;= nums.length &lt;= 100</code></li>
              <li><code>0 &lt;= nums[i] &lt;= 50</code></li>
              <li><code>0 &lt;= val &lt;= 100</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const RemoveElementVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('readerWriter');
  const [numsInput, setNumsInput] = useState('0, 1, 2, 2, 3, 0, 4, 2');
  const [valInput, setValInput] = useState('2');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let arr = numsInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (arr.length === 0) arr = [0, 1, 2, 2, 3, 0, 4, 2];
    
    let val = parseInt(valInput.trim());
    if (isNaN(val)) val = 2;
    
    // UI Safeguards
    if (arr.length > 12) arr = arr.slice(0, 12);

    return { nums: arr, val };
  }, [numsInput, valInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { nums: originalNums, val } = parsedData;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 3000) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'readerWriter') {
        let nums = [...originalNums];
        let k = 0;
        
        addStep(
            "Initialization", 
            `Line 3: int k = 0;\n\nWe initialize 'k', our WRITER pointer. This tells us exactly where the next valid (non-target) element should be placed in the array.`, 
            3, 
            { nums: [...nums], k, i: null, val, action: 'init' }
        );

        let iter = 0;
        let i = 0;

        for (i = 0; i < nums.length; i++) {
            if (iter++ > 100) break;

            addStep(
                "Evaluate For-Loop", 
                `Line 5: for (int i = ${i}; i < ${nums.length}; i++)\n\nOur READER pointer 'i' is currently at index ${i}. The loop condition (i < nums.length) is TRUE.`, 
                5, 
                { nums: [...nums], k, i, val, action: 'loopCond' }
            );

            addStep(
                "Check Current Element", 
                `Line 6: if (nums[i] != val)\n\nWe check if the element at index ${i} (${nums[i]}) is NOT equal to our target value (${val}).\n${nums[i] !== val ? `TRUE! ${nums[i]} != ${val}. We must keep it.` : `FALSE. ${nums[i]} == ${val}. We must discard it.`}`, 
                6, 
                { nums: [...nums], k, i, val, action: 'evalIf' }
            );

            if (nums[i] !== val) {
                let oldVal = nums[k];
                nums[k] = nums[i];
                addStep(
                    "Write Valid Element", 
                    `Line 7: nums[k] = nums[i];\n\nSince it's valid, we copy nums[${i}] (${nums[i]}) into the WRITER position at nums[${k}].\n(Notice: If i == k, it just overwrites itself, which is harmless).`, 
                    7, 
                    { nums: [...nums], k, i, val, action: 'write' }
                );

                k++;
                addStep(
                    "Advance Writer Pointer", 
                    `Line 8: k++;\n\nWe successfully locked in a valid element. We increment 'k' to ${k} to prepare for the next valid element.`, 
                    8, 
                    { nums: [...nums], k, i, val, action: 'incrementK' }
                );
            } else {
                addStep(
                    "Skip Target Element", 
                    `Line 6: Evaluated to FALSE.\n\nThe element is the target value! We DO NOT execute the if-block. The WRITER pointer 'k' stays put, effectively marking this element to be overwritten later.`, 
                    6, 
                    { nums: [...nums], k, i, val, action: 'skip' }
                );
            }
        }
        
        addStep(
            "Loop Terminates", 
            `Line 5: for (int i = ${i}; i < ${nums.length}; i++)\n\nThe loop condition is now FALSE. We have scanned the entire array.`, 
            5, 
            { nums: [...nums], k, i: null, val, action: 'loopEnd' }
        );

        addStep(
            "Return Result", 
            `Line 11: return k;\n\nWe return 'k' (${k}), which represents the length of the modified array. The first ${k} elements are guaranteed to be valid!`, 
            11, 
            { nums: [...nums], k, i: null, val, action: 'success', isSuccess: true }
        );

    } else if (selectedApproachId === 'swapWithLast') {
        let nums = [...originalNums];
        let i = 0;
        let n = nums.length;
        
        addStep(
            "Initialization", 
            `Line 3-4: int i = 0; int n = nums.length;\n\nWe initialize 'i' as our reader pointer (starting at 0), and 'n' as the length of our valid search space (starting at ${n}).`, 
            4, 
            { nums: [...nums], i, n, val, action: 'init' }
        );

        let iter = 0;

        while (i < n) {
            if (iter++ > 100) break;

            addStep(
                "Evaluate While-Loop", 
                `Line 6: while (i < n)\n\nIs our reader pointer 'i' (${i}) strictly less than our boundary 'n' (${n})? TRUE. Continue.`, 
                6, 
                { nums: [...nums], i, n, val, action: 'loopCond' }
            );

            addStep(
                "Check Current Element", 
                `Line 7: if (nums[i] == val)\n\nWe check if the element at index ${i} (${nums[i]}) is exactly equal to our target value (${val}).\n${nums[i] === val ? `TRUE! We need to remove this element.` : `FALSE. This element is safe.`}`, 
                7, 
                { nums: [...nums], i, n, val, action: 'evalIf' }
            );

            if (nums[i] === val) {
                let targetIdx = i;
                let swapIdx = n - 1;
                let swapVal = nums[swapIdx];
                
                nums[i] = nums[n - 1];
                
                addStep(
                    "Swap With Last Valid Element", 
                    `Line 8: nums[i] = nums[n - 1];\n\nWe take the element at the VERY END of our valid boundary (nums[${swapIdx}] = ${swapVal}) and overwrite our target element at index ${targetIdx}.\nWe don't care about preserving the order!`, 
                    8, 
                    { nums: [...nums], i, n, val, action: 'swap', swapFrom: swapIdx, swapTo: targetIdx }
                );

                n--;
                addStep(
                    "Shrink Valid Boundary", 
                    `Line 9: n--;\n\nWe decrease our valid boundary 'n' to ${n}. The target element is now outside our active array! \nNOTE: We do NOT increment 'i'. The newly swapped-in element at index ${i} must be evaluated on the next loop!`, 
                    9, 
                    { nums: [...nums], i, n, val, action: 'decrementN' }
                );
            } else {
                i++;
                addStep(
                    "Element is Safe (Increment)", 
                    `Line 11: i++;\n\nThe element at index ${i - 1} is safe. We increment our reader pointer 'i' to ${i} to check the next element.`, 
                    11, 
                    { nums: [...nums], i, n, val, action: 'incrementI' }
                );
            }
        }
        
        addStep(
            "Loop Terminates", 
            `Line 6: while (i < n)\n\nThe loop condition is now FALSE ('i' is ${i}, 'n' is ${n}). We have evaluated all elements inside the active boundary.`, 
            6, 
            { nums: [...nums], i, n, val, action: 'loopEnd' }
        );

        addStep(
            "Return Result", 
            `Line 15: return n;\n\nWe return 'n' (${n}), which represents the length of the valid array. The first ${n} elements are strictly non-target values.`, 
            15, 
            { nums: [...nums], i: null, n, val, action: 'success', isSuccess: true }
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
  const { isSuccess, nums, k, i: activeI, n: boundaryN, val, action, swapFrom, swapTo } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Filter className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Remove Element</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 27</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : 'bg-violet-500/20 border-violet-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'skip' ? 'rose' : 'violet'} />
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
                    
                    {selectedApproachId === 'readerWriter' ? (
                        <div className="grid grid-cols-3 gap-3">
                            <VariableCard label="Target (val)" val={val} color="amber" active={true} />
                            <VariableCard label="Reader (i)" val={activeI !== null ? activeI : "-"} arrVal={activeI !== null && activeI < nums.length ? nums[activeI] : null} color="sky" active={activeI !== null} />
                            <VariableCard label="Writer (k)" val={k !== null ? k : "-"} arrVal={k !== null && k < nums.length ? nums[k] : null} color="emerald" active={k !== null} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            <VariableCard label="Target (val)" val={val} color="amber" active={true} />
                            <VariableCard label="Reader (i)" val={activeI !== null ? activeI : "-"} arrVal={activeI !== null && activeI < nums.length ? nums[activeI] : null} color="sky" active={activeI !== null} />
                            <VariableCard label="Boundary (n)" val={boundaryN !== null ? boundaryN : "-"} color="purple" active={boundaryN !== null} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Array (nums)</label>
                        <input type="text" value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="0, 1, 2, 2, 3, 0, 4, 2" />
                    </div>
                    
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Target (val)</label>
                        <input type="number" value={valInput} onChange={(e) => { setValInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner" placeholder="2" />
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
                      {isSuccess ? <Check size={100}/> : <Filter size={100}/>}
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
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px]">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-12 pb-8 gap-8 overflow-y-auto">
                      
                      {/* Array Representation */}
                      <div className="flex flex-wrap justify-center w-full gap-y-16 gap-x-2 md:gap-x-3 mt-4">
                          {nums?.map((num, idx) => {
                              
                              let isReader = activeI === idx && !isSuccess;
                              let isWriter = k === idx && selectedApproachId === 'readerWriter' && !isSuccess;
                              let isBoundary = boundaryN === idx && selectedApproachId === 'swapWithLast' && !isSuccess;
                              
                              let isDiscarded = false;
                              if (isSuccess && selectedApproachId === 'readerWriter') isDiscarded = idx >= k;
                              if (isSuccess && selectedApproachId === 'swapWithLast') isDiscarded = idx >= boundaryN;
                              if (!isSuccess && selectedApproachId === 'swapWithLast' && boundaryN !== null) isDiscarded = idx >= boundaryN;

                              let isSwapSource = action === 'swap' && swapFrom === idx;
                              let isSwapTarget = action === 'swap' && swapTo === idx;
                              let isWriting = action === 'write' && k === idx;

                              let isTargetValue = num === val;

                              let cls = "relative w-12 h-14 md:w-14 md:h-16 flex flex-col items-center justify-center rounded-xl border-2 font-mono font-black text-xl md:text-2xl transition-all duration-300 z-10 ";
                              
                              if (isDiscarded) {
                                  cls += "bg-slate-50 border-slate-200 text-slate-300 border-dashed scale-95 opacity-60";
                              } else if (isSwapSource || isSwapTarget) {
                                  cls += "bg-amber-100 border-amber-500 text-amber-800 scale-110 shadow-lg ring-4 ring-amber-300/50 z-30 animate-pulse";
                              } else if (isWriting) {
                                  cls += "bg-emerald-100 border-emerald-500 text-emerald-800 scale-110 shadow-lg ring-4 ring-emerald-300/50 z-30";
                              } else if (isReader && isTargetValue) {
                                  cls += "bg-rose-100 border-rose-500 text-rose-800 scale-110 shadow-lg ring-4 ring-rose-300/50 z-20";
                              } else if (isReader) {
                                  cls += "bg-sky-100 border-sky-500 text-sky-800 scale-110 shadow-lg ring-4 ring-sky-300/50 z-20";
                              } else {
                                  cls += "bg-white border-slate-300 text-slate-700 shadow-sm";
                              }

                              return (
                                  <div key={idx} className="flex flex-col items-center relative">
                                      {/* Top Pointers */}
                                      <div className="absolute -top-12 flex flex-col items-center justify-end h-10 w-full gap-1 z-30">
                                          {isReader && (
                                              <div className="flex flex-col items-center animate-bounce">
                                                  <span className="text-[10px] font-black font-mono tracking-widest text-sky-700 bg-sky-100 px-1.5 rounded shadow-sm border border-sky-300">i</span>
                                                  <ArrowDown size={14} className="text-sky-500" strokeWidth={3}/>
                                              </div>
                                          )}
                                      </div>

                                      <div className={cls}>
                                          {num}
                                          <span className="absolute -top-2 -right-2 text-[8px] md:text-[10px] font-mono font-bold text-white bg-slate-800 rounded px-1 shadow-sm">{idx}</span>
                                          
                                          {/* Trash overlay for evaluating targets */}
                                          {isReader && isTargetValue && action === 'evalIf' && (
                                              <div className="absolute inset-0 flex items-center justify-center bg-rose-500/20 rounded-lg">
                                                  <Trash2 className="text-rose-600 opacity-80" size={24} />
                                              </div>
                                          )}
                                      </div>
                                      
                                      {/* Bottom Pointers */}
                                      <div className="absolute -bottom-14 flex flex-col items-center h-12 w-full gap-1 z-30">
                                          {isWriter && (
                                              <div className={`flex flex-col items-center ${action === 'incrementK' ? 'animate-bounce' : ''}`}>
                                                  <ArrowUp size={14} className="text-emerald-500" strokeWidth={3}/>
                                                  <span className="text-[10px] font-black font-mono bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-300 tracking-widest shadow-sm">k</span>
                                              </div>
                                          )}
                                          {isBoundary && (
                                              <div className={`flex flex-col items-center`}>
                                                  <ArrowUp size={14} className="text-purple-500" strokeWidth={3}/>
                                                  <span className="text-[10px] font-black font-mono bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded border border-purple-300 tracking-widest shadow-sm">n</span>
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              );
                          })}
                          
                          {/* Conceptual Array 'n' boundary for swap approach */}
                          {selectedApproachId === 'swapWithLast' && boundaryN === nums.length && !isSuccess && (
                              <div className="flex flex-col items-center relative">
                                  <div className="w-12 h-14 md:w-14 md:h-16 flex items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 opacity-40">
                                  </div>
                                  <div className="absolute -bottom-14 flex flex-col items-center h-12 w-full gap-1 z-30">
                                      <ArrowUp size={14} className="text-purple-500" strokeWidth={3}/>
                                      <span className="text-[10px] font-black font-mono bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded border border-purple-300 tracking-widest shadow-sm">n</span>
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
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">REMOVAL COMPLETE</span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Final Array Length: {selectedApproachId === 'readerWriter' ? k : boundaryN}
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
                <Filter className="text-violet-600"/> In-Place Array Modification
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                When a problem asks you to modify an array "in-place" with $O(1)$ extra memory, you cannot create a new array to store the filtered results. You must manipulate the existing array elements, usually by overwriting data you no longer need. Two Pointers is the definitive pattern for this.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ListFilter size={18}/> Reader / Writer Pattern
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            We use two pointers traversing from the same direction.
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            <strong>Reader (<code>i</code>):</strong> Fast pointer. Scans every single element in the array to evaluate it.<br/><br/>
                            <strong>Writer (<code>k</code>):</strong> Slow pointer. Represents the "end" of the new, valid array. It only moves forward when the Reader hands it a valid element to lock in.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowLeftRight size={18}/> Optimization: Swap with Last
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            The Reader/Writer pattern is great, but what if the array has 10,000 elements, and the target value only appears once at the very beginning?
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>The standard pattern will unnecessarily copy 9,999 elements one spot to the left!</p>
                            <p>Since the problem states "The order of elements may be changed", we can optimize! When we find the target, we simply grab the very last element in the array, overwrite the target with it, and shrink the array size by 1. This prevents massive cascading copies.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Trash2 size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-emerald-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Why return 'k'?</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            In languages like Java or C++, arrays have a fixed size. We literally cannot delete an index from an array. 
                            <br/><br/>
                            Therefore, we just shove all the elements we want to keep to the front of the array, and return an integer <code>k</code>. 
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-[10px] text-emerald-300">
                            // The LeetCode judging engine will do this:<br/><br/>
                            int k = solution.removeElement(nums, val);<br/><br/>
                            for (int i = 0; i &lt; k; i++) &#123;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;assert nums[i] != val;<br/>
                            &#125;<br/><br/>
                            // It ignores everything after index k-1!
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
                        "To solve this problem in-place with $O(1)$ extra space, I used the Two Pointers technique. In the standard approach, I maintain a 'reader' pointer that iterates through the array and a 'writer' pointer that tracks the end of the newly formed valid array. Whenever the reader encounters an element not equal to `val`, I copy it to the writer's index and increment the writer. This efficiently shifts all valid elements to the front in $O(N)$ time. If the interviewer asks to minimize write operations (useful when `val` is rare), I would switch to the 'Swap with Last' approach, overwriting any `val` found with the last valid element of the array and decrementing the boundary size, taking advantage of the fact that order does not need to be preserved."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Does setting to 'null' work?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                No. Since this is an array of primitive integers (<code>int[]</code>), you cannot assign a <code>null</code> value to an index. Primitive arrays in Java/C++ must always hold a value (defaulting to 0). You must physically copy the valid values over the invalid ones to "remove" them.
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
                                <p className="text-[10px] text-slate-500 mt-1">In both approaches, we iterate through the array of length N exactly once. The operations inside the loop (comparisons, assignments) are all constant time $O(1)$.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We modify the array entirely in-place. We only allocate a couple of integer variables for our pointers (`i`, `k`, `n`). We do not allocate any new arrays or data structures.</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|nums|val|length)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['val'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (['length'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default RemoveElementVisualizer;