import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, ArrowRight, 
  ArrowDown, X, Timer, ShieldAlert, Database, 
  Search, RefreshCw, Hash, ArrowUp, Zap, ListOrdered, Filter, ScanSearch, ArrowRightLeft
} from 'lucide-react';

const APPROACHES = {
  cyclicSort: {
    id: 'cyclicSort',
    title: '1. Cyclic Sort (Optimal)',
    subtitle: 'O(N) Time, O(1) Space via In-Place Hashing.',
    icon: <RefreshCw size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;
        
        // 1. Place each number in its right place (e.g., 5 goes to index 4)
        for (int i = 0; i < n; i++) {
            while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                // Swap nums[i] with nums[nums[i] - 1]
                int temp = nums[nums[i] - 1];
                nums[nums[i] - 1] = nums[i];
                nums[i] = temp;
            }
        }
        
        // 2. Find the first index that doesn't have the correct number
        for (int i = 0; i < n; i++) {
            if (nums[i] != i + 1) {
                return i + 1;
            }
        }
        
        // 3. If all numbers from 1 to n are present, the answer is n + 1
        return n + 1;
    }
}`,
    explanation: "The optimal O(N) Time, O(1) Space approach uses Cyclic Sort (also known as In-Place Hashing). We know the answer MUST be between 1 and N+1. Therefore, we can ignore any negative numbers or numbers greater than N. For any valid number 'x' (where 1 <= x <= N), its correct position in a sorted 0-indexed array is 'x - 1'. We loop through the array and repeatedly swap elements to their correct indices. Finally, a second pass finds the first index 'i' where nums[i] != i + 1. The missing number is i + 1."
  },
  hashSet: {
    id: 'hashSet',
    title: '2. HashSet',
    subtitle: 'O(N) Time, O(N) Space via Memory.',
    icon: <Database size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public int firstMissingPositive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        
        // 1. Add all numbers to the set
        for (int num : nums) {
            set.add(num);
        }
        
        // 2. Starting from 1, find the first missing number
        int missing = 1;
        while (set.has(missing)) {
            missing++;
        }
        
        return missing;
    }
}`,
    explanation: "The brute force / extra memory approach. We simply dump every number into a HashSet. Then, starting from 1, we continually check if 'missing' exists in the set. The first number that evaluates to false is our answer. While simple and O(N) time, it violates the strict O(1) auxiliary space constraint of the problem."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">41. First Missing Positive</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given an unsorted integer array <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-600 font-mono font-bold">nums</code>, return the smallest missing positive integer.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm flex gap-3 mt-6 items-start shadow-sm">
            <Timer className="shrink-0 mt-0.5 text-amber-500" size={18} />
            <div>
                <strong>Constraint:</strong> You must implement an algorithm that runs in <code>O(n)</code> time and uses <code>O(1)</code> auxiliary space.
            </div>
        </div>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [1,2,0]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 3</p>
              <p className="text-slate-500 text-xs mt-2 border-t border-slate-200 pt-2"><span className="text-slate-400 font-bold">Explanation:</span> The numbers in the range [1,2] are all in the array.</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [3,4,-1,1]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 2</p>
              <p className="text-slate-500 text-xs mt-2 border-t border-slate-200 pt-2"><span className="text-slate-400 font-bold">Explanation:</span> 1 is in the array but 2 is missing.</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [7,8,9,11,12]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 1</p>
              <p className="text-slate-500 text-xs mt-2 border-t border-slate-200 pt-2"><span className="text-slate-400 font-bold">Explanation:</span> The smallest positive integer 1 is missing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FirstMissingPositiveVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState<keyof typeof APPROACHES>('cyclicSort');
  const [numsInput, setNumsInput] = useState('3, 4, -1, 1');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedNums = useMemo(() => {
    let arr = numsInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (arr.length === 0) return [3, 4, -1, 1];
    return arr;
  }, [numsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    let nums = [...parsedNums];
    const n = nums.length;
    
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      if (steps.length > 500) return; // safety fallback
      steps.push({
        phase,
        description: desc,
        line,
        state: { nums: [...nums], n, ...state }
      });
    };

    if (selectedApproachId === 'cyclicSort') {
        addStep("Initialization", `Array length n = ${n}. Starting Phase 1: Cyclic Sort.`, 3, { i: null, activePhase: 'sort' });
        
        for (let i = 0; i < n; i++) {
            addStep("Outer Loop Condition", `Evaluate outer loop: is i (${i}) < n (${n})? True.`, 6, { i, activePhase: 'sort' });
            
            while (true) {
                let val = nums[i];
                let correctIdx = val - 1;
                
                addStep("While Condition Check", `Evaluating: (nums[${i}] > 0 && nums[${i}] <= ${n} && nums[nums[${i}] - 1] != nums[${i}]). Current value is ${val}.`, 7, { i, val, correctIdx, activePhase: 'sort', checkingCondition: true });
                
                if (val > 0 && val <= n && nums[correctIdx] !== val) {
                    addStep("Condition Met (Swap)", `True! Value ${val} belongs at index ${correctIdx}. The element currently at index ${correctIdx} is ${nums[correctIdx]}, which is wrong. Swap them!`, 8, { i, val, correctIdx, activePhase: 'sort', swapping: true });
                    
                    // Perform Swap
                    let temp = nums[correctIdx];
                    nums[correctIdx] = nums[i];
                    nums[i] = temp;
                    
                    addStep("Swapped", `Values swapped. The new value at nums[${i}] is ${nums[i]}. We must re-evaluate this new number in the next while iteration!`, 10, { i, activePhase: 'sort' });
                } else {
                    let reason = "";
                    if (val <= 0) reason = `Value ${val} is <= 0 (Ignored).`;
                    else if (val > n) reason = `Value ${val} > n (${n}) (Ignored).`;
                    else reason = `Value ${val} is already at its correct index ${correctIdx}.`;
                    
                    addStep("Condition Failed", `False! ${reason} Breaking while loop, moving to next i.`, 7, { i, val, activePhase: 'sort' });
                    break;
                }
            }
        }
        addStep("Outer Loop Complete", `i = ${n}. Cyclic Sort phase complete! Array is rearranged. Starting Phase 2: Missing Scan.`, 6, { i: n, activePhase: 'sort' });
        
        for (let i = 0; i < n; i++) {
            addStep("Scan Loop Condition", `Evaluate: is i (${i}) < n (${n})? True.`, 15, { i, activePhase: 'scan' });
            addStep("Check Missing", `Check if nums[${i}] (${nums[i]}) != i + 1 (${i + 1}).`, 16, { i, activePhase: 'scan', checkingMissing: true });
            
            if (nums[i] !== i + 1) {
                addStep("Mismatch Found!", `True! We expected ${i + 1} at index ${i}, but found ${nums[i]}. The first missing positive is ${i + 1}.`, 17, { i, activePhase: 'scan', isSuccess: true, finalAns: i + 1 });
                return steps;
            } else {
                addStep("Match Ok", `False! nums[${i}] == ${i + 1}. Continue scanning.`, 16, { i, activePhase: 'scan' });
            }
        }
        
        addStep("Scan Complete", `All indices from 0 to ${n-1} contained their expected positive integers.`, 15, { i: n, activePhase: 'scan' });
        addStep("Return N+1", `Since numbers 1 to ${n} are all present, the first missing positive must be n + 1 (${n + 1}).`, 22, { activePhase: 'scan', isSuccess: true, finalAns: n + 1 });
        
    } 
    else if (selectedApproachId === 'hashSet') {
        let set = new Set<number>();
        addStep("Initialization", `Create an empty HashSet to track numbers.`, 3, { set: Array.from(set), activePhase: 'build' });

        for (let num of nums) {
            set.add(num);
            addStep("Add to Set", `Iterating array. Adding ${num} to Set.`, 7, { set: Array.from(set), currNum: num, activePhase: 'build' });
        }
        
        addStep("Set Built", `All numbers added. Set size is ${set.size}. Starting scan phase.`, 6, { set: Array.from(set), activePhase: 'build' });

        let missing = 1;
        addStep("Init Scan", `Initialize 'missing' = 1.`, 11, { set: Array.from(set), missing, activePhase: 'scan' });
        
        while (true) {
            addStep("Check Set", `Does the Set contain ${missing}?`, 12, { set: Array.from(set), missing, activePhase: 'scan', checking: true });
            if (set.has(missing)) {
                missing++;
                addStep("Found", `Yes, Set has ${missing - 1}. Increment 'missing' to ${missing}.`, 13, { set: Array.from(set), missing, activePhase: 'scan' });
            } else {
                addStep("Missing Number Located", `No! The Set does NOT contain ${missing}. This is our first missing positive!`, 12, { set: Array.from(set), missing, activePhase: 'scan', isSuccess: true, finalAns: missing });
                break;
            }
        }
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
  const state = cur.state || { nums: parsedNums, n: parsedNums.length };
  const { isSuccess, nums, n, activePhase, i, val, correctIdx, swapping, checkingCondition, checkingMissing, finalAns, set, currNum, missing, checking } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-100 flex items-center justify-center">
                <Search className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">First Missing Positive</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 41</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Cyclic Sort / In-Place</span>
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
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
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
                      <Code2 size={14} className="text-emerald-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {/* Highlighter Bar */}
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : swapping ? 'bg-amber-500/15 border-amber-500' : 'bg-emerald-500/15 border-emerald-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="emerald" />
                      ))}
                  </div>
                </div>

                {/* Left Side Variables */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Current Variables</h4>
                      </div>
                      {activePhase && <span className={`uppercase tracking-widest text-[9px] px-2 py-0.5 rounded text-white ${activePhase === 'sort' ? 'bg-amber-500' : activePhase === 'scan' ? 'bg-blue-500' : 'bg-slate-400'}`}>{activePhase === 'sort' ? 'Phase 1: Sort' : activePhase === 'scan' ? 'Phase 2: Scan' : 'Init'}</span>}
                    </div>
                    
                    {selectedApproachId === 'cyclicSort' ? (
                        <div className="grid grid-cols-2 gap-3">
                            <VariableCard label="Index (i)" val={i ?? null} arrVal={i !== null && i !== undefined && i < nums.length ? nums[i] : null} color="sky" active={i !== undefined && i !== null} />
                            <VariableCard label="Correct Idx" val={correctIdx !== undefined && correctIdx >= 0 && correctIdx < n ? correctIdx : null} color="amber" active={correctIdx !== undefined && correctIdx !== null && correctIdx >= 0 && correctIdx < n} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <VariableCard label="Current Num" val={currNum ?? null} color="sky" active={currNum !== null && currNum !== undefined} />
                            <VariableCard label="Missing Int" val={missing ?? null} color="amber" active={missing !== null && missing !== undefined} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Simulation Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-emerald-600 uppercase block pl-1 tracking-widest font-mono">Input Array (comma separated)</label>
                        <input type="text" value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner" placeholder="3, 4, -1, 1" />
                    </div>

                    <div className="hidden xl:flex gap-2">
                       <button onClick={() => {setNumsInput('1, 2, 0'); setCurrentStep(0);}} className="text-[10px] font-black uppercase text-blue-500 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors shadow-sm">Ex 1</button>
                       <button onClick={() => {setNumsInput('7, 8, 9, 11, 12'); setCurrentStep(0);}} className="text-[10px] font-black uppercase text-blue-500 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors shadow-sm">Ex 3</button>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Action Log / Status */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : swapping ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : swapping ? <RefreshCw size={100}/> : <Search size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : swapping ? "text-amber-400" : "text-emerald-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : swapping ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>Line {cur.line}</div>
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
                      <div className="flex gap-3 flex-wrap justify-center relative w-full mb-8">
                          {nums.map((v: number, idx: number) => {
                              
                              let bgClass = "bg-white";
                              let borderClass = "border-slate-200";
                              let textClass = "text-slate-800";
                              let topPointer = null;
                              let zIndex = "z-0";

                              // Approach 1: Cyclic Sort
                              if (selectedApproachId === 'cyclicSort') {
                                  const isCorrectPlacement = v === idx + 1;
                                  const isOutOfRange = v <= 0 || v > n;

                                  if (activePhase === 'sort') {
                                      // Visual hinting of correct vs incorrect
                                      if (isCorrectPlacement) {
                                          bgClass = "bg-emerald-50";
                                          borderClass = "border-emerald-200";
                                          textClass = "text-emerald-700";
                                      } else if (isOutOfRange) {
                                          bgClass = "bg-rose-50";
                                          borderClass = "border-rose-200";
                                          textClass = "text-rose-700 opacity-60";
                                      }

                                      if (idx === i) {
                                          bgClass = swapping ? "bg-amber-100 scale-110 shadow-lg" : "bg-sky-50 scale-105 shadow-md";
                                          borderClass = swapping ? "border-amber-400 border-dashed" : "border-sky-400";
                                          textClass = swapping ? "text-amber-800" : "text-sky-800";
                                          topPointer = { label: "i", color: "text-sky-600", bounce: true };
                                          zIndex = "z-20";
                                      }
                                      if (swapping && idx === correctIdx) {
                                          bgClass = "bg-amber-100 scale-110 shadow-lg";
                                          borderClass = "border-amber-400 border-dashed";
                                          textClass = "text-amber-800";
                                          topPointer = { label: "target", color: "text-amber-600", bounce: false };
                                          zIndex = "z-20";
                                      }
                                  } 
                                  else if (activePhase === 'scan' || isSuccess) {
                                      if (isCorrectPlacement) {
                                          bgClass = "bg-emerald-100";
                                          borderClass = "border-emerald-300";
                                          textClass = "text-emerald-800 opacity-50";
                                      }
                                      if (idx === i) {
                                          bgClass = "bg-blue-100 scale-110 shadow-md z-20";
                                          borderClass = "border-blue-400";
                                          textClass = "text-blue-800";
                                          topPointer = { label: "scan", color: "text-blue-600", bounce: true };
                                      }
                                      if (isSuccess && idx === i) {
                                          bgClass = "bg-rose-100 scale-125 shadow-xl z-30";
                                          borderClass = "border-rose-500";
                                          textClass = "text-rose-900 line-through";
                                          topPointer = { label: "MISMATCH", color: "text-rose-600", bounce: false };
                                      }
                                  }
                              } 
                              // Approach 2: HashSet
                              else {
                                  if (activePhase === 'build') {
                                      if (v === currNum) {
                                          bgClass = "bg-sky-100 scale-110 shadow-md z-20";
                                          borderClass = "border-sky-400";
                                          textClass = "text-sky-800";
                                      } else if (set && set.includes(v)) {
                                          bgClass = "bg-slate-100 opacity-60";
                                      }
                                  } else {
                                      bgClass = "bg-slate-50 opacity-40";
                                      borderClass = "border-slate-200";
                                  }
                              }

                              return (
                                  <div key={`${idx}-${v}`} className={`flex flex-col items-center relative transition-all duration-300 mb-8 mt-8 ${zIndex}`}>
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
                                      <div className={`w-12 h-16 md:w-16 md:h-20 border-2 rounded-2xl flex flex-col items-center justify-center font-mono font-black text-2xl transition-all duration-500 ${bgClass} ${borderClass} ${textClass}`}>
                                          <span>{v}</span>
                                      </div>
                                      
                                      {/* Bottom Index */}
                                      <div className="absolute -bottom-6 flex flex-col items-center justify-start w-full">
                                          <span className="text-[10px] font-mono font-bold text-slate-400">idx: {idx}</span>
                                          {selectedApproachId === 'cyclicSort' && <span className="text-[8px] font-mono text-emerald-600/70">exp: {idx+1}</span>}
                                      </div>
                                  </div>
                              );
                          })}
                      </div>

                      {/* HashSet Memory View */}
                      {selectedApproachId === 'hashSet' && (
                          <div className="w-full max-w-lg bg-slate-100 border border-slate-200 rounded-3xl p-6 shadow-inner flex flex-col items-center min-h-[140px] mt-6">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono mb-4 flex items-center gap-2"><Database size={14}/> HashSet Memory</span>
                              <div className="flex gap-2 flex-wrap justify-center w-full">
                                  {set && set.length > 0 ? set.map((sval: number, idx: number) => {
                                      const justAdded = activePhase === 'build' && sval === currNum;
                                      const checkingThis = activePhase === 'scan' && sval === missing;
                                      
                                      let setBg = "bg-white border-sky-200 text-sky-800 shadow-sm";
                                      if (justAdded) setBg = "bg-sky-500 border-sky-600 text-white scale-110 shadow-md animate-in zoom-in";
                                      if (checkingThis) setBg = "bg-amber-100 border-amber-400 text-amber-800 scale-110 shadow-md";

                                      return (
                                          <div key={`set-${idx}`} className={`w-12 h-12 flex items-center justify-center border-2 rounded-full font-mono font-black transition-all duration-300 ${setBg}`}>
                                              {sval}
                                          </div>
                                      )
                                  }) : (
                                      <span className="text-slate-400 font-mono italic text-sm mt-2">Empty Set...</span>
                                  )}
                              </div>
                              
                              {activePhase === 'scan' && (
                                  <div className="mt-6 flex flex-col items-center animate-in slide-in-from-bottom-2">
                                      <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Checking Target</span>
                                      <div className={`mt-1 text-2xl font-black font-mono border-2 border-dashed px-6 py-2 rounded-xl ${isSuccess ? 'border-emerald-500 text-emerald-600 bg-emerald-50 scale-110 shadow-lg' : 'border-amber-400 text-amber-700 bg-amber-50 scale-105'}`}>
                                          {missing}
                                      </div>
                                  </div>
                              )}
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
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">SEARCH COMPLETE</span>
                              <span className="text-xs font-black uppercase text-emerald-600 tracking-widest font-mono mb-4 block">Smallest Missing Positive</span>
                              
                              <div className="bg-slate-50 border border-slate-200 px-8 py-4 rounded-2xl shadow-inner mt-2 flex flex-col items-center">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-2">Final Output</span>
                                  <div className="flex gap-1 text-5xl font-mono font-black tracking-widest text-emerald-600 drop-shadow-sm">
                                      {finalAns}
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
                <RefreshCw className="text-emerald-600"/> The Pigeonhole Principle
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-emerald-100 pl-6">
                The core realization of this problem is understanding the strict bounds of the answer. If you have an array of length <code className="font-bold text-emerald-600">N</code>, the first missing positive integer <strong>must</strong> be in the range <code className="font-bold text-emerald-600">[1, N + 1]</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Target size={18}/> Why [1, N + 1]?
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            Think about it: to push the answer to <code>N + 1</code>, the array must perfectly contain exactly <code>1, 2, 3 ... N</code>. 
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-3 rounded-lg border border-sky-200">
                            If the array contains any negatives, duplicates, or numbers larger than <code>N</code>, those take up "slots" in the array. Since the array only has <code>N</code> slots, something between <code>1</code> and <code>N</code> is forced to be pushed out and thus becomes our missing positive.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowRightLeft size={18}/> In-Place Hashing
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            Since we only care about numbers from <code>1</code> to <code>N</code>, and our array has indices <code>0</code> to <code>N-1</code>, we can use the array itself as a hash table!
                        </p>
                        <p className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-3 rounded-lg border border-amber-200">
                            We simply map the number <code>x</code> to index <code>x - 1</code>. When we find a number like <code>5</code>, we throw it over to index <code>4</code>. We keep swapping until every number in the <code>[1, N]</code> range is sitting exactly where it belongs.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <ScanSearch size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Search size={32} className="text-emerald-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">The Final Scan</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed">
                        <p>
                           Once the cyclic sort (swapping phase) is done, the array is neatly organized. All the valid numbers we could find are sitting in their designated slots.
                        </p>
                        <div className="bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl mt-4 font-mono text-sm flex gap-4">
                           <span>[ 1, 2, <span className="text-rose-400">-1</span>, 4 ]</span>
                           <span>-&gt; Missing: 3</span>
                        </div>
                        <p className="text-emerald-400 font-bold mt-2">
                            We just walk down the array: Does index 0 hold 1? Yes. Does index 1 hold 2? Yes. Does index 2 hold 3? No! Therefore, 3 is the first missing positive.
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
                        "While a HashSet solves this trivially in O(N) time, it violates the strict O(1) auxiliary space constraint. By recognizing that the answer is strictly bounded between 1 and N+1 (via the Pigeonhole Principle), I utilized the input array itself as an in-place hash table. Using a Cyclic Sort, I continuously swapped elements into their correct index mapping (nums[i] to index nums[i]-1) until all valid elements were correctly positioned. A final linear scan then instantly reveals the first mismatch, achieving O(N) time with zero extra space."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Is the nested 'while' loop O(N²)?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                No! Even though there is a <code>while</code> loop inside a <code>for</code> loop, the algorithm is strictly O(N). Why? Because <strong>every swap strictly places at least one number into its final, correct position.</strong> Since there are N numbers, there can be at most N total swaps across the entire execution of the program. The inner loop amortizes perfectly to O(1) per outer iteration.
                            </div>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <Timer size={14} className="text-emerald-500"/> Handling Duplicates Safely
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                The condition <code>nums[nums[i] - 1] != nums[i]</code> is incredibly important. It prevents infinite loops when the array contains duplicates. If <code>nums[i]</code> is <code>5</code>, and the element at index <code>4</code> is already <code>5</code>, we immediately break the <code>while</code> loop instead of swapping identically endlessly.
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean, theme?: 'cyan' | 'violet' | 'rose' | 'emerald' | 'amber' | 'indigo' | 'fuchsia' | 'teal' | 'blue' }> = ({ num, code, active, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|char|List|Integer|Set|HashSet|Math)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-yellow-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default FirstMissingPositiveVisualizer;