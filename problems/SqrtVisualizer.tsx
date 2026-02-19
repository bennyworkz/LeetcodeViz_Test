import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, ArrowRight, Hash, 
  Calculator, SquareStack, Split, ArrowLeftRight
} from 'lucide-react';

const APPROACHES = {
  binarySearch: {
    id: 'binarySearch',
    title: '1. Binary Search',
    subtitle: 'Optimal: O(log X) Time, O(1) Space.',
    icon: <Split size={16} />,
    complexity: 'Time: O(log x) | Space: O(1)',
    code: `class Solution {
    public int mySqrt(int x) {
        if (x == 0) return 0;
        
        int left = 1, right = x, ans = 0;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            // Use division instead of mid * mid to prevent integer overflow
            if (mid <= x / mid) {
                ans = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return ans;
    }
}`,
    explanation: "Because we are looking for the square root of 'x', we know the answer must lie somewhere between 1 and 'x' (inclusive). Because this sequence of numbers is naturally sorted, we can use Binary Search! We pick a 'mid' point and square it. If mid * mid is less than or equal to 'x', then 'mid' is a potential answer, and we search the right half for a larger potential answer. If mid * mid is greater than 'x', 'mid' is too big, so we search the left half. Crucially, we write the condition as 'mid <= x / mid' to avoid standard 32-bit integer overflow when multiplying two large 'mid' values."
  },
  newtonsMethod: {
    id: 'newtonsMethod',
    title: '2. Newton\'s Method',
    subtitle: 'Math: O(log X) Time, O(1) Space.',
    icon: <Calculator size={16} />,
    complexity: 'Time: O(log x) | Space: O(1)',
    code: `class Solution {
    public int mySqrt(int x) {
        if (x == 0) return 0;
        
        long r = x;
        
        while (r > x / r) {
            r = (r + x / r) / 2;
        }
        
        return (int) r;
    }
}`,
    explanation: "Newton's Method is a mathematical algorithm for finding successively better approximations to the roots (or zeroes) of a real-valued function. To find the square root of 'x', we establish a guess 'r' (starting at 'x'). As long as our guess squared is greater than 'x' (meaning 'r > x / r'), we update our guess to the average of 'r' and 'x / r'. This geometric average converges to the true integer square root extremely quickly, often in fewer steps than a standard binary search."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">69. Sqrt(x)</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given a non-negative integer <code>x</code>, return <em>the square root of </em><code>x</code><em> rounded down to the nearest integer</em>. The returned integer should be <strong>non-negative</strong> as well.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-violet-500 pl-4 bg-violet-50 py-2 mt-4">
          You <strong>must not use</strong> any built-in exponent function or operator.
          <br/>
          For example, do not use <code>pow(x, 0.5)</code> in c++ or <code>x ** 0.5</code> in python.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> x = 4</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 2</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: The square root of 4 is 2, so we return 2.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> x = 8</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 2</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: The square root of 8 is 2.82842..., and since we round it down to the nearest integer, 2 is returned.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>0 &lt;= x &lt;= 2<sup>31</sup> - 1</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const SqrtVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('binarySearch');
  const [xInput, setXInput] = useState('64');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let x = parseInt(xInput.trim(), 10);
    if (isNaN(x) || x < 0) x = 64;
    // Cap at 2^31 - 1
    if (x > 2147483647) x = 2147483647;

    return { x };
  }, [xInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { x } = parsedData;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'binarySearch') {
        
        addStep(
            "Evaluate Base Case", 
            `Line 3: if (x == 0) return 0;\n\nWe check if x is 0. Is ${x} == 0? ${x === 0 ? 'Yes.' : 'No.'}`, 
            3, 
            { action: 'evalBase', x, left: null, right: null, mid: null, ans: null }
        );

        if (x === 0) {
            addStep(
                "Return Base Case", 
                `Line 3: return 0;\n\nThe square root of 0 is exactly 0.`, 
                3, 
                { action: 'success', isSuccess: true, ans: 0, x, left: null, right: null, mid: null }
            );
            return steps;
        }

        let left = 1;
        let right = x;
        let ans = 0;

        addStep(
            "Initialize Pointers", 
            `Line 5: int left = 1, right = x, ans = 0;\n\nSince x > 0, the integer square root must be between 1 and ${x}. We set our search boundaries: left = 1, right = ${x}. We also initialize 'ans' to store the best valid square root found so far.`, 
            5, 
            { action: 'init', x, left, right, mid: null, ans }
        );

        let iter = 0;
        while (left <= right) {
            if (iter++ > 100) break; // Infinite loop safeguard

            addStep(
                "Evaluate While Loop", 
                `Line 7: while (left <= right)\n\nIs left (${left}) <= right (${right})? TRUE. Our search space is valid, so we continue binary searching.`, 
                7, 
                { action: 'evalWhile', x, left, right, mid: null, ans }
            );

            let mid = left + Math.floor((right - left) / 2);
            addStep(
                "Calculate Midpoint", 
                `Line 8: int mid = left + (right - left) / 2;\n\nWe find the exact center of our current search space to test it.\nmid = ${left} + (${right} - ${left}) / 2 = ${mid}.`, 
                8, 
                { action: 'calcMid', x, left, right, mid, ans }
            );

            let div = Math.floor(x / mid);
            let isLessOrEqual = mid <= div;

            addStep(
                "Evaluate Target Condition", 
                `Line 11: if (mid <= x / mid)\n\nNormally, we would check if (mid * mid <= x). But if mid is large (e.g., 50000), mid * mid will overflow a 32-bit integer! Instead, we divide: Is mid <= x / mid?\nIs ${mid} <= ${x} / ${mid} (${div})? ${isLessOrEqual ? 'TRUE. Mid is a potential answer.' : 'FALSE. Mid is too large.'}`, 
                11, 
                { action: 'evalCond', x, left, right, mid, ans, div, isLessOrEqual }
            );

            if (isLessOrEqual) {
                ans = mid;
                addStep(
                    "Update Potential Answer", 
                    `Line 12: ans = mid;\n\nBecause ${mid}^2 <= ${x}, ${mid} is a valid floor square root candidate! We lock it in as our best answer so far: ans = ${ans}.`, 
                    12, 
                    { action: 'updateAns', x, left, right, mid, ans }
                );

                let oldLeft = left;
                left = mid + 1;
                addStep(
                    "Search Right Half", 
                    `Line 13: left = mid + 1;\n\nWe already know ${mid} works, but is there a LARGER number that also works? We eliminate the left half and continue searching the right half.\nleft becomes ${left}.`, 
                    13, 
                    { action: 'updateLeft', x, left, right, mid, ans }
                );
            } else {
                let oldRight = right;
                right = mid - 1;
                addStep(
                    "Search Left Half", 
                    `Line 15: right = mid - 1;\n\nBecause ${mid}^2 > ${x}, ${mid} is strictly too large. Therefore, any number larger than mid is ALSO too large. We eliminate the right half and move our right boundary.\nright becomes ${right}.`, 
                    15, 
                    { action: 'updateRight', x, left, right, mid, ans }
                );
            }
        }
        
        addStep(
            "While Loop Terminates", 
            `Line 7: while (left <= right)\n\nIs left (${left}) <= right (${right})? FALSE. The pointers have crossed. We have exhausted the search space.`, 
            7, 
            { action: 'endWhile', x, left, right, mid: null, ans }
        );

        addStep(
            "Return Final Answer", 
            `Line 19: return ans;\n\nThe largest valid integer whose square is <= ${x} is ${ans}. We return it.`, 
            19, 
            { action: 'success', isSuccess: true, x, left, right, mid: null, ans }
        );

    } else if (selectedApproachId === 'newtonsMethod') {
        
        addStep(
            "Evaluate Base Case", 
            `Line 3: if (x == 0) return 0;\n\nWe check if x is 0. Is ${x} == 0? ${x === 0 ? 'Yes.' : 'No.'}`, 
            3, 
            { action: 'evalBase', x, r: null }
        );

        if (x === 0) {
            addStep(
                "Return Base Case", 
                `Line 3: return 0;`, 
                3, 
                { action: 'success', isSuccess: true, ans: 0, x, r: null }
            );
            return steps;
        }

        let r = x;
        
        addStep(
            "Initialize Guess (r)", 
            `Line 5: long r = x;\n\nWe initialize our guess 'r' to be x itself (${r}). We use a 64-bit 'long' to completely avoid any intermediate overflow during mathematical operations.`, 
            5, 
            { action: 'init', x, r }
        );

        let iter = 0;
        while (r > Math.floor(x / r)) {
            if (iter++ > 100) break;
            
            let div = Math.floor(x / r);

            addStep(
                "Evaluate Convergence", 
                `Line 7: while (r > x / r)\n\nIs our current guess (${r}) strictly greater than x / r (${div})?\nTRUE. The guess is still too high, so we must refine it.`, 
                7, 
                { action: 'evalWhile', x, r, div }
            );

            let newR = Math.floor((r + div) / 2);
            
            addStep(
                "Refine Guess via Average", 
                `Line 8: r = (r + x / r) / 2;\n\nWe refine our guess by taking the geometric average of our current guess 'r' (${r}) and 'x / r' (${div}).\nNew r = (${r} + ${div}) / 2 = ${newR}.`, 
                8, 
                { action: 'updateR', x, r: newR, oldR: r }
            );
            
            r = newR;
        }
        
        let finalDiv = Math.floor(x / r);
        addStep(
            "Convergence Reached", 
            `Line 7: while (r > x / r)\n\nIs our current guess (${r}) strictly greater than x / r (${finalDiv})?\nFALSE. The guess has successfully converged to the integer square root.`, 
            7, 
            { action: 'endWhile', x, r, div: finalDiv }
        );

        addStep(
            "Return Result", 
            `Line 11: return (int) r;\n\nWe cast the 64-bit long back to a 32-bit int and return ${r}.`, 
            11, 
            { action: 'success', isSuccess: true, ans: r, x, r }
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
  const { isSuccess, ans, action, x, left, right, mid, ans: currAns, r, div, oldR } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <SquareStack className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Sqrt(x)</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 69</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Math / Binary Search</span>
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
                    
                    {selectedApproachId === 'binarySearch' ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <VariableCard label="Left" val={left !== null && left !== undefined ? left : "-"} color="rose" active={left !== null && left !== undefined} />
                            <VariableCard label="Right" val={right !== null && right !== undefined ? right : "-"} color="sky" active={right !== null && right !== undefined} />
                            <VariableCard label="Mid" val={mid !== null && mid !== undefined ? mid : "-"} color="purple" active={mid !== null && mid !== undefined} />
                            <VariableCard label="Ans" val={currAns !== null && currAns !== undefined ? currAns : "-"} color="emerald" active={currAns !== null && currAns !== undefined} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <VariableCard label="Target (x)" val={x !== null && x !== undefined ? x : "-"} color="slate" active={x !== null && x !== undefined} />
                            <VariableCard label="Current Guess (r)" val={r !== null && r !== undefined ? r : "-"} color="purple" active={r !== null && r !== undefined} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Target Number (x)</label>
                        <input type="number" value={xInput} onChange={(e) => { setXInput(e.target.value); setCurrentStep(0); }} min="0" max="2147483647" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner" placeholder="64" />
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
                      {isSuccess ? <Check size={100}/> : <Hash size={100}/>}
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
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 gap-10">
                      
                      {/* Binary Search Visualization */}
                      {selectedApproachId === 'binarySearch' && (
                          <div className="flex flex-col items-center w-full gap-8">
                              
                              {/* Conceptual Search Space Bar */}
                              <div className="w-full flex flex-col items-center">
                                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono text-center mb-6">Conceptual Search Space</span>
                                  
                                  <div className="relative w-full max-w-lg h-12 bg-slate-100 border border-slate-300 rounded-2xl shadow-inner flex items-center">
                                      {/* Bar fills/indicators based on L and R. Since L and R can be huge, we map them as percentages of x */}
                                      {left !== null && right !== null && x > 0 && (
                                          <>
                                             <div 
                                                className="absolute top-0 bottom-0 bg-violet-200/50 border-y border-violet-300 transition-all duration-500 ease-in-out"
                                                style={{
                                                    left: `${(left / x) * 100}%`,
                                                    width: `${((right - left) / x) * 100}%`
                                                }}
                                             ></div>
                                             
                                             {/* Left Pointer */}
                                             <div 
                                                className="absolute -top-8 flex flex-col items-center transition-all duration-500 ease-in-out"
                                                style={{ left: `${(left / x) * 100}%`, transform: 'translateX(-50%)' }}
                                             >
                                                <span className="text-[10px] font-black font-mono tracking-widest text-rose-700 bg-rose-100 px-1.5 rounded border border-rose-300 shadow-sm mb-1">{left}</span>
                                                <ArrowDown size={14} className="text-rose-500" strokeWidth={3}/>
                                             </div>

                                             {/* Right Pointer */}
                                             <div 
                                                className="absolute -bottom-8 flex flex-col items-center transition-all duration-500 ease-in-out"
                                                style={{ left: `${(right / x) * 100}%`, transform: 'translateX(-50%)' }}
                                             >
                                                <ArrowUp size={14} className="text-sky-500" strokeWidth={3}/>
                                                <span className="text-[10px] font-black font-mono tracking-widest text-sky-700 bg-sky-100 px-1.5 rounded border border-sky-300 shadow-sm mt-1">{right}</span>
                                             </div>

                                             {/* Mid Pointer */}
                                             {mid !== null && (
                                                <div 
                                                    className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-500 ease-in-out z-20"
                                                    style={{ left: `${(mid / x) * 100}%`, transform: 'translate(-50%, -50%)' }}
                                                >
                                                    <div className={`p-1.5 rounded-full border-2 bg-white shadow-md ${action === 'evalCond' ? 'border-amber-400 ring-4 ring-amber-400/30 animate-pulse' : 'border-purple-500'}`}>
                                                        <Target size={16} className={action === 'evalCond' ? 'text-amber-500' : 'text-purple-600'} />
                                                    </div>
                                                </div>
                                             )}
                                          </>
                                      )}
                                      
                                      <div className="absolute -left-6 text-[10px] font-mono text-slate-400">1</div>
                                      <div className="absolute -right-6 text-[10px] font-mono text-slate-400">{x}</div>
                                  </div>
                              </div>

                              {/* Math Evaluation Box */}
                              {mid !== null && (
                                  <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm w-full max-w-md flex flex-col items-center gap-4 animate-in zoom-in">
                                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono flex items-center gap-1"><Calculator size={14}/> Overflow-Safe Comparison</span>
                                      
                                      <div className="flex items-center gap-4 text-xl md:text-2xl font-black font-mono">
                                          <div className="flex flex-col items-center bg-slate-50 border border-slate-200 p-3 rounded-xl min-w-[100px]">
                                              <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Mid</span>
                                              <span className="text-purple-600">{mid}</span>
                                          </div>
                                          
                                          <div className="text-slate-300">≤</div>
                                          
                                          <div className="flex flex-col items-center bg-slate-50 border border-slate-200 p-3 rounded-xl min-w-[100px]">
                                              <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">x / Mid</span>
                                              <span className="text-amber-600">{div !== undefined ? div : Math.floor(x/mid)}</span>
                                          </div>
                                      </div>
                                      
                                      {action === 'evalCond' && (
                                          <div className={`mt-2 px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-widest text-white animate-in slide-in-from-bottom-2 ${state.isLessOrEqual ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                              {state.isLessOrEqual ? 'True: Update Ans & Go Right' : 'False: Too Big, Go Left'}
                                          </div>
                                      )}
                                  </div>
                              )}

                          </div>
                      )}

                      {/* NEWTON'S VISUALIZATION */}
                      {selectedApproachId === 'newtonsMethod' && (
                          <div className="flex flex-col items-center w-full gap-8 pt-8">
                              
                              <div className="text-center space-y-2">
                                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono flex items-center justify-center gap-1"><ArrowLeftRight size={14}/> Convergence Tracking</span>
                                  <p className="text-xs text-slate-500">We average our guess <code className="text-purple-600 font-bold bg-purple-50 px-1 rounded">r</code> with <code className="text-amber-600 font-bold bg-amber-50 px-1 rounded">x/r</code> to pull it towards the true root.</p>
                              </div>

                              <div className="flex items-center gap-4 md:gap-8 w-full justify-center text-xl md:text-3xl font-black font-mono">
                                  {/* R Block */}
                                  <div className={`flex flex-col items-center p-6 rounded-3xl border-4 transition-all duration-500 ${action === 'updateR' ? 'bg-purple-100 border-purple-400 scale-110 shadow-xl' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
                                      <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">Guess (r)</span>
                                      <span className="text-purple-700">{r !== null && r !== undefined ? r : "-"}</span>
                                  </div>

                                  <div className="flex flex-col items-center text-slate-300">
                                      <ArrowLeftRight size={32} strokeWidth={2}/>
                                  </div>

                                  {/* x/R Block */}
                                  <div className={`flex flex-col items-center p-6 rounded-3xl border-4 transition-all duration-500 bg-slate-50 border-slate-200 shadow-sm`}>
                                      <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">Target (x / r)</span>
                                      <span className="text-amber-600">{div !== undefined ? div : "-"}</span>
                                  </div>
                              </div>

                              {action === 'updateR' && oldR !== undefined && (
                                  <div className="bg-sky-50 border border-sky-200 text-sky-800 px-6 py-3 rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-sm animate-in slide-in-from-bottom-2">
                                      <Calculator size={14} /> Next Guess = ({oldR} + {div}) / 2 = {r}
                                  </div>
                              )}

                          </div>
                      )}

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600`}>
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">COMPUTATION COMPLETE</span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Floor Square Root of {x} is {ans}
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
                <SquareStack className="text-violet-600"/> Finding Roots Fast
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                When you need to find an integer square root, a brute force approach checking {"$1^2, 2^2, 3^2...$"} up to {"$N$"} takes {"$O(\\sqrt{N})$"} time. For extremely large numbers like {"$2^{31}-1$"}, that's around 46,000 operations. We can do much better by leveraging sorted ranges or calculus.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Split size={18}/> Binary Search on the Answer Range
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            We know the answer must be between $1$ and $x$. Since this sequence of numbers $[1, 2, 3... x]$ is inherently sorted, we can use Binary Search.
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            If we guess a <code>mid</code> value, and <code>mid * mid &gt; x</code>, then our guess is strictly too large. We can immediately discard the entire right half of the search space. This cuts the search space in half every single step, guaranteeing {"$O(\\log X)$"} time. (Max ~31 iterations for a 32-bit integer).
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Calculator size={18}/> Newton's Method
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            Newton's Method (Newton-Raphson) is a calculus technique for finding roots of functions. For {"$f(r) = r^2 - x = 0$"}, it simplifies beautifully.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>We want to find {"$r$"} such that {"$r = \\frac{x}{r}$"}.</p>
                            <p>If our guess {"$r$"} is too large, then {"$\\frac{x}{r}$"} will be too small. The true square root must lie exactly between them.</p>
                            <p>We continuously update our guess to be the exact average: {"$r_{new} = \\frac{r_{old} + \\frac{x}{r_{old}}}{2}$"}. It converges extremely fast.</p>
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
                            A classic LeetCode bug occurs during the condition check in Binary Search. 
                            <br/><br/>
                            If you write <code>if (mid * mid &lt;= x)</code>, and <code>mid</code> is 50,000, <code>mid * mid</code> evaluates to 2.5 billion. A standard 32-bit signed integer can only hold up to 2.14 billion!
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-[10px] text-rose-300">
                            // DANGEROUS<br/>
                            int mid = 50000;<br/>
                            // 50000 * 50000 overflows to negative number!<br/>
                            if (mid * mid &lt;= x) &#123; ... &#125;<br/><br/>
                            // SAFE MATHEMATICAL EQUIVALENT<br/>
                            // Uses division, keeping numbers small.<br/>
                            if (mid &lt;= x / mid) &#123; ... &#125;
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
                        "I used Binary Search to find the square root because the search space of integers $[1 ... x]$ is implicitly sorted, allowing us to find the target in {"$O(\\log X)$"} time instead of {"$O(\\sqrt{X})$"}. I initialized my boundaries from $1$ to $x$. During each iteration, I calculated the `mid` point safely using `left + (right - left) / 2` to prevent pointer overflow. Crucially, when evaluating if `mid` is a valid root, I used division `mid &lt;= x / mid` instead of multiplication `mid * mid &lt;= x`. This entirely prevents standard 32-bit integer overflow issues that arise when squaring large midpoints. If `mid` satisfies the condition, I save it as a potential answer and search the right half for a larger valid root. Otherwise, I discard the right half."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Why does Newton's work with longs?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                In Newton's Method, our initial guess <code>r</code> starts equal to <code>x</code>. The very first operation is <code>r = (r + x / r) / 2</code>. If <code>x</code> is the maximum 32-bit integer, <code>r + x / r</code> will slightly exceed the 32-bit limit before dividing by 2. By initializing <code>r</code> as a 64-bit <code>long</code>, we give it enough memory ceiling to perform intermediate math safely before casting the final result back to an <code>int</code>.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(log X)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Binary search halves the active search window every single iteration. Thus, it scales logarithmically with the input value. Newton's method converges at a similar or technically faster rate, but simplifies to the same Big-O bound.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We allocate memory only for a few primitive tracking variables (`left`, `right`, `mid`, `ans`, or `r`). No arrays or dynamic structures are instantiated.</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|x|left|right|mid|ans|r)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['x'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (['left', 'right', 'r'].includes(part)) return <span key={i} className="text-rose-400 font-bold">{part}</span>;
          if (['mid', 'ans'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default SqrtVisualizer;