import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, LayoutList, GitBranch, 
  ShieldAlert, ArrowRight, CornerUpLeft, PlusSquare, XSquare, MinusSquare
} from 'lucide-react';

const APPROACHES = {
  backtracking: {
    id: 'backtracking',
    title: 'Backtracking (DFS)',
    subtitle: 'Optimal: O(N × 2^N) Time, O(N) Space.',
    icon: <GitBranch size={16} />,
    complexity: 'Time: O(N × 2^N) | Space: O(N)',
    code: `class Solution {
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        
        // 1. Sort the array so duplicates are adjacent
        Arrays.sort(nums);
        
        // 2. Start backtracking from index 0
        backtrack(result, new ArrayList<>(), nums, 0);
        
        return result;
    }
    
    private void backtrack(List<List<Integer>> result, List<Integer> current, int[] nums, int start) {
        // Every subset generated is valid, add a copy to results
        result.add(new ArrayList<>(current));
        
        // Iterate through all possible next elements
        for (int i = start; i < nums.length; i++) {
            // Pruning: Skip duplicates at the same tree level
            if (i > start && nums[i] == nums[i - 1]) {
                continue;
            }
            
            // Choose: Add the current element
            current.add(nums[i]);
            
            // Explore: Recurse forward
            backtrack(result, current, nums, i + 1);
            
            // Un-choose: Backtrack by removing the last element
            current.remove(current.size() - 1);
        }
    }
}`,
    explanation: "To generate all unique subsets, we use a Depth-First Search (Backtracking) approach. The key challenge is handling duplicates (e.g., if input is [1,2,2], we want [1,2] but not two identical [1,2] subsets). First, we MUST sort the array. This guarantees that duplicate numbers sit next to each other. During our backtracking loop, we check if `i > start` (meaning this isn't the first element we are picking at this specific depth level) AND `nums[i] == nums[i-1]`. If both are true, picking this number would create a duplicate branch of one we just explored, so we `continue` (skip it). Otherwise, we push the number, recurse `i + 1`, and pop the number to backtrack."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">90. Subsets II</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given an integer array <code>nums</code> that may contain duplicates, return <em>all possible subsets (the power set)</em>.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-rose-500 pl-4 bg-rose-50 py-2 mt-4">
          The solution set <strong>must not</strong> contain duplicate subsets. Return the solution in <strong>any order</strong>.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [1,2,2]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[],[1],[1,2],[1,2,2],[2],[2,2]]</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> nums = [0]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[],[0]]</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= nums.length &lt;= 10</code></li>
              <li><code>-10 &lt;= nums[i] &lt;= 10</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const SubsetsIIVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('backtracking');
  const [numsInput, setNumsInput] = useState('1,2,2');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let arr = numsInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    // Problem requires sorting to handle duplicates easily
    arr.sort((a, b) => a - b);
    
    // Fallback if empty
    if (arr.length === 0) arr = [1, 2, 2];
    
    // UI Safety cap to prevent browser-crashing execution traces (2^N complexity)
    if (arr.length > 5) arr = arr.slice(0, 5);

    return { nums: arr };
  }, [numsInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { nums } = parsedData;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return; // Hard limit for safety
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    let result = [];
    let current = [];

    addStep(
        "Initialization", 
        `Line 3-7: Arrays.sort(nums); backtrack(...);\n\nThe input array is sorted: [${nums.join(',')}]. We start backtracking from index 0 with an empty subset.`, 
        7, 
        { nums, current: [...current], result: [...result], start: 0, i: null, action: 'init', depth: 0 }
    );

    const backtrack = (start, depth) => {
        if (steps.length > 2000) return;

        result.push([...current]);
        
        addStep(
            `Record Subset (Depth ${depth})`, 
            `Line 12: result.add(new ArrayList<>(current));\n\nIn subsets problems, EVERY path is a valid subset! We add a copy of [${current.join(',')}] to our result list.`, 
            12, 
            { nums, current: [...current], result: [...result], start, i: null, action: 'record', depth }
        );

        for (let i = start; i < nums.length; i++) {
            
            addStep(
                `Iterate Next Elements (Depth ${depth})`, 
                `Line 15: for (int i = ${i}; i < nums.length; i++)\n\nLooking at index ${i} (value ${nums[i]}) to potentially add to our subset.`, 
                15, 
                { nums, current: [...current], result: [...result], start, i, action: 'loop', depth }
            );

            let isDuplicate = i > start && nums[i] === nums[i - 1];

            addStep(
                `Check Duplicate (Depth ${depth})`, 
                `Line 17: if (i > start && nums[i] == nums[i - 1])\n\ni (${i}) > start (${start}): ${i > start}\nnums[${i}] == nums[${i}-1]: ${i > 0 && nums[i] === nums[i - 1]}\n\nIs this a duplicate branch? ${isDuplicate ? 'YES! Skip.' : 'NO. Proceed.'}`, 
                17, 
                { nums, current: [...current], result: [...result], start, i, action: 'checkDup', depth, isDuplicate }
            );

            if (isDuplicate) {
                addStep(
                    `Skip Duplicate Branch`, 
                    `Line 18: continue;\n\nBecause ${nums[i]} is identical to the element we just tried at this exact depth level, using it would create a duplicate subset. We skip it!`, 
                    18, 
                    { nums, current: [...current], result: [...result], start, i, action: 'skip', depth }
                );
                continue;
            }

            current.push(nums[i]);
            addStep(
                `Choose Element`, 
                `Line 21: current.add(nums[i]);\n\nWe append ${nums[i]} to our current subset. Subset is now [${current.join(',')}].`, 
                21, 
                { nums, current: [...current], result: [...result], start, i, action: 'choose', depth }
            );

            addStep(
                `Explore Forward`, 
                `Line 24: backtrack(result, current, nums, ${i + 1});\n\nWe recurse deeper, starting the next loop from index ${i + 1} to build off this subset.`, 
                24, 
                { nums, current: [...current], result: [...result], start, i, action: 'recurse', depth }
            );

            backtrack(i + 1, depth + 1);

            let popped = current.pop();
            addStep(
                `Backtrack (Un-choose)`, 
                `Line 27: current.remove(current.size() - 1);\n\nWe returned from the recursion. We pop ${popped} from the subset to "un-choose" it, allowing the loop to try the next available number.`, 
                27, 
                { nums, current: [...current], result: [...result], start, i, action: 'backtrack', depth, popped }
            );
        }

        if (depth > 0) {
            addStep(
                `Return to Parent`, 
                `Line 29: Loop finished at Depth ${depth}. Returning to previous depth.`, 
                28, 
                { nums, current: [...current], result: [...result], start, i: null, action: 'return', depth }
            );
        }
    };

    backtrack(0, 0);

    addStep(
        "Algorithm Complete", 
        `Line 9: return result;\n\nBacktracking has fully unwound. We found ${result.length} unique subsets.`, 
        9, 
        { nums, current: [], result: [...result], start: null, i: null, action: 'success', isSuccess: true, ans: result.length, depth: 0 }
    );

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
  const { isSuccess, ans, action, nums, current, result, start: currStart, i: currI, depth, isDuplicate, popped } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <GitBranch className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Subsets II</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 90</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Arrays / Backtracking</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action === 'skip' || action === 'checkDup' && isDuplicate ? 'bg-rose-500/20 border-rose-500' : (action === 'choose' ? 'bg-emerald-500/20 border-emerald-500' : (action === 'backtrack' || action === 'return' ? 'bg-amber-500/20 border-amber-500' : 'bg-violet-500/20 border-violet-500')))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'skip' || action === 'checkDup' && isDuplicate ? 'rose' : (action === 'choose' ? 'emerald' : (action === 'backtrack' || action === 'return' ? 'amber' : 'violet'))} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Execution State</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        <VariableCard label="Depth" val={depth !== null && depth !== undefined ? depth : "-"} color="slate" active={depth !== null && depth !== undefined} />
                        <VariableCard label="Start Idx" val={currStart !== null && currStart !== undefined ? currStart : "-"} color="sky" active={currStart !== null && currStart !== undefined} />
                        <VariableCard label="Iter (i)" val={currI !== null && currI !== undefined ? currI : "-"} color="purple" active={currI !== null && currI !== undefined} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Input Array (nums)</label>
                        <input type="text" value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-widest font-bold text-slate-700" placeholder="1,2,2" />
                        <p className="text-[9px] text-slate-400 pl-1">Array will be automatically sorted. (Max 5 elements for UI).</p>
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action === 'skip' || action === 'checkDup' && isDuplicate ? 'bg-rose-900 border-rose-800' : (action === 'choose' ? 'bg-emerald-900 border-emerald-800' : (action === 'backtrack' || action === 'return' ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800')))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : (action === 'skip' ? <XSquare size={100}/> : (action === 'choose' ? <PlusSquare size={100}/> : (action === 'backtrack' ? <CornerUpLeft size={100}/> : <GitBranch size={100}/>)))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action === 'skip' || action === 'checkDup' && isDuplicate ? 'text-rose-400' : (action === 'choose' ? 'text-emerald-400' : (action === 'backtrack' || action === 'return' ? 'text-amber-400' : 'text-violet-400')))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'skip' || action === 'checkDup' && isDuplicate ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : (action === 'choose' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'backtrack' || action === 'return' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30')))}`}>Line {cur.line}</div>
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
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-center justify-start">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-4 pb-12 gap-8 overflow-y-auto overflow-x-hidden">
                      
                      {/* Array Visualization */}
                      {nums && (
                          <div className="flex flex-col items-center w-full max-w-full">
                              
                              <div className="flex gap-2 p-6 bg-slate-50 border border-slate-200 min-w-max mx-auto overflow-x-auto mt-4 shadow-sm rounded-3xl">
                                  {nums.map((val, idx) => {
                                      let isCurrentI = currI === idx && !isSuccess;
                                      let isCurrentStart = currStart === idx && !isSuccess;
                                      let isSkipArea = idx >= currStart && idx < currI && !isSuccess;

                                      let boxClass = "relative w-12 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-xl border-4 font-mono font-black text-xl md:text-2xl transition-all duration-300 shrink-0 ";
                                      let textClass = "text-slate-700";

                                      if (isSuccess) {
                                          boxClass += "bg-white border-slate-200 opacity-50";
                                          textClass = "text-slate-400";
                                      } else if (isCurrentI) {
                                          if (action === 'skip' || action === 'checkDup' && isDuplicate) {
                                              boxClass += "bg-rose-100 border-rose-500 scale-110 shadow-lg ring-4 ring-rose-300/30 z-20";
                                              textClass = "text-rose-900";
                                              if (action === 'skip') textClass += " line-through opacity-60";
                                          } else if (action === 'choose') {
                                              boxClass += "bg-emerald-100 border-emerald-500 scale-110 shadow-lg ring-4 ring-emerald-300/30 z-20";
                                              textClass = "text-emerald-900";
                                          } else {
                                              boxClass += "bg-purple-100 border-purple-500 scale-110 shadow-lg ring-4 ring-purple-300/30 z-20";
                                              textClass = "text-purple-900";
                                          }
                                      } else if (isSkipArea) {
                                          // Evaluated but skipped or already processed elements
                                          boxClass += "bg-slate-200 border-slate-400 shadow-inner z-10 opacity-70";
                                          textClass = "text-slate-500";
                                      } else if (idx < currStart) {
                                          // Elements that are fixed for this branch
                                          boxClass += "bg-emerald-50 border-emerald-200 shadow-sm opacity-60";
                                          textClass = "text-emerald-600";
                                      } else {
                                          boxClass += "bg-white border-slate-300 shadow-sm";
                                      }

                                      return (
                                          <div key={`cell-${idx}`} className="flex flex-col items-center relative group">
                                              
                                              {/* Start Pointer (Top) */}
                                              <div className="absolute -top-12 flex flex-col items-center justify-end h-10 w-full z-40">
                                                  {isCurrentStart && (
                                                      <div className={`flex flex-col items-center animate-in slide-in-from-top-2`}>
                                                          <span className="text-[10px] font-black font-mono tracking-widest text-sky-800 bg-sky-100 px-2 py-0.5 rounded border border-sky-300 shadow-sm mb-1">start</span>
                                                          <ArrowDown size={20} className="text-sky-500" strokeWidth={3}/>
                                                      </div>
                                                  )}
                                              </div>

                                              <div className={boxClass}>
                                                  <span className={textClass}>{val}</span>
                                              </div>
                                              
                                              {/* Read Pointer (Bottom) */}
                                              <div className="absolute -bottom-10 flex flex-col items-center h-8 w-full z-30">
                                                  {isCurrentI && (
                                                      <div className={`flex flex-col items-center animate-in slide-in-from-bottom-2`}>
                                                          <ArrowUp size={20} className={action === 'skip' || isDuplicate ? 'text-rose-500' : 'text-purple-500'} strokeWidth={3}/>
                                                          <span className={`text-[10px] font-black font-mono tracking-widest px-2 py-0.5 rounded border shadow-sm mt-1 ${action === 'skip' || isDuplicate ? 'text-rose-800 bg-rose-100 border-rose-300' : 'text-purple-800 bg-purple-100 border-purple-300'}`}>i</span>
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

                      {/* Execution Details Split */}
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                          
                          {/* Left Box: Current Subset Builder */}
                          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center relative overflow-hidden min-h-[140px]">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-4 flex items-center gap-2"><Target size={14}/> Current Subset (current)</span>
                              
                              <div className="flex items-center gap-2 font-mono font-black text-2xl flex-wrap justify-center min-h-[40px]">
                                  <span className="text-slate-300">[</span>
                                  {current && current.map((val, idx) => (
                                      <React.Fragment key={`curr-${idx}`}>
                                          <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 shadow-sm animate-in zoom-in">{val}</span>
                                          {idx < current.length - 1 && <span className="text-slate-300">,</span>}
                                      </React.Fragment>
                                  ))}
                                  <span className="text-slate-300">]</span>

                                  {action === 'backtrack' && popped !== undefined && (
                                       <span className="text-rose-400 bg-rose-50 px-2 py-1 rounded-lg border border-dashed border-rose-300 animate-out fade-out slide-out-to-right-4 duration-700 absolute right-8">
                                          <MinusSquare size={16} className="inline mr-1"/>{popped}
                                       </span>
                                  )}
                              </div>
                          </div>

                          {/* Right Box: Results List */}
                          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden min-h-[140px]">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-4 flex items-center justify-between w-full">
                                  <div className="flex items-center gap-2"><LayoutList size={14}/> Result Set (result)</div>
                                  <span className="bg-violet-100 text-violet-700 px-2 py-0.5 rounded shadow-sm">Count: {result ? result.length : 0}</span>
                              </span>
                              
                              <div className="flex items-center gap-2 font-mono font-bold text-sm flex-wrap overflow-y-auto max-h-[200px] content-start">
                                  {result && result.map((sub, idx) => {
                                      let isLastAdded = action === 'record' && idx === result.length - 1;
                                      return (
                                          <div key={`res-${idx}`} className={`px-2 py-1 rounded-lg border shadow-sm transition-all duration-500 ${isLastAdded ? 'bg-violet-600 text-white border-violet-700 scale-110 z-10 animate-in zoom-in' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                              [{sub.join(',')}]
                                          </div>
                                      );
                                  })}
                                  {(!result || result.length === 0) && <span className="text-slate-300 italic">Empty</span>}
                              </div>
                          </div>

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
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">BACKTRACKING COMPLETE</span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Generated {ans} Unique Subsets
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
                <GitBranch className="text-violet-600"/> Backtracking & Pruning
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Generating combinations or subsets inherently requires exploring a massive decision tree. Backtracking is the process of building a candidate incrementally, and abandoning ("pruning") a path as soon as we determine it's invalid or redundant.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Layers size={18}/> Why sort first?
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            Sorting is the secret weapon for handling duplicates.
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-2">
                            <p>If the array is <code>[2, 1, 2]</code>, the duplicate 2s are separated. Tracking them during recursion requires messy HashSets.</p>
                            <p>If we sort it to <code>[1, 2, 2]</code>, identical elements are guaranteed to be adjacent. We can spot a duplicate instantly just by comparing <code>nums[i] == nums[i-1]</code>!</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Target size={18}/> The i &gt; start Condition
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            <code>if (i &gt; start &amp;&amp; nums[i] == nums[i-1]) continue;</code>
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>Why check <code>i &gt; start</code>? Imagine the array is <code>[1, 2, 2]</code>.</p>
                            <p>We WANT the subset <code>[1, 2, 2]</code>! This means vertically, in the recursion depth, we MUST be allowed to pick the second '2'.</p>
                            <p>However, horizontally across the <code>for</code> loop, we don't want to start a BRAND NEW branch with the second '2' if we already did it for the first '2'. <code>i &gt; start</code> ensures we only skip horizontal duplicates, not vertical ones.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <ShieldAlert size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-rose-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Deep Copying the Subset</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            A classic mistake in backtracking is adding the raw <code>current</code> reference to the result list.
                            <br/><br/>
                            <code>result.add(current); // WRONG!</code>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-[10px] text-rose-300 space-y-2">
                            <p className="text-white">// In Java/JS, arrays are passed by reference.</p>
                            <p>// If you add the reference, and then modify 'current' later...</p>
                            <p>// ALL subsets in your result list will mutate and become empty!</p>
                            <br/>
                            <p className="text-emerald-400">// CORRECT:</p>
                            <p>result.add(new ArrayList&lt;&gt;(current));</p>
                            <p>// We must instantiate a brand new clone (deep copy).</p>
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
                        "To generate all unique subsets, I utilized a Depth-First Search with backtracking. Since the input array contains duplicates, the primary challenge is avoiding duplicate subsets in the power set. First, I sorted the array so that identical elements are strictly adjacent. During the recursive traversal, I loop through available elements starting from a `start` index. Inside the loop, I apply a pruning condition: `if (i &gt; start &amp;&amp; nums[i] == nums[i-1]) continue;`. This guarantees that at any given node in the recursion tree, we only branch out once for each unique value, while still allowing duplicate values to be picked vertically down the depth of the tree. I record a deep copy of the current subset at every recursive call, as every node in this traversal represents a valid subset."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Can we use a HashSet instead?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Yes, you could use a <code>Set&lt;List&lt;Integer&gt;&gt;</code> to automatically discard duplicate subsets. However, this is heavily frowned upon in interviews. Hashing entire lists is computationally expensive ($O(L)$ time per insertion). The sorting and pruning method prevents duplicates from being generated in the first place, saving significant time and memory overhead.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N × 2<sup>N</sup>)</span>
                                <p className="text-[10px] text-slate-500 mt-1">There are up to $2^N$ subsets. For each subset, we perform an $O(N)$ deep copy into our result list. Sorting takes $O(N \log N)$, which is dominated by the exponential term.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Ignoring the space required for the output list, the auxiliary space is strictly bounded by the maximum recursion call stack depth, which is $O(N)$.</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|subsetsWithDup|nums|result|sort|backtrack|current|start|length|add|remove|size)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['subsetsWithDup', 'length', 'size', 'add', 'remove'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['nums', 'result', 'current'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['start', 'backtrack', 'sort'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default SubsetsIIVisualizer;