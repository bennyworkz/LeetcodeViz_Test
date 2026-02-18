import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, ArrowRight, Hash, 
  Plus, ListOrdered, ArrowLeft
} from 'lucide-react';

const APPROACHES = {
  rightToLeft: {
    id: 'rightToLeft',
    title: '1. Right-to-Left Traversal',
    subtitle: 'Optimal: O(N) Time, O(1) Space.',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N) | Space: O(1) or O(N)',
    code: `class Solution {
    public int[] plusOne(int[] digits) {
        int n = digits.length;
        
        // Traverse from right to left (least significant to most)
        for (int i = n - 1; i >= 0; i--) {
            // If the digit is less than 9, we can just increment it
            if (digits[i] < 9) {
                digits[i]++;
                return digits;
            }
            
            // If it is 9, it becomes 0, and the carry moves to the next loop
            digits[i] = 0;
        }
        
        // If we exit the loop, it means all digits were 9s (e.g., 999)
        // We need a new array with one extra length
        int[] newDigits = new int[n + 1];
        newDigits[0] = 1;
        
        return newDigits;
    }
}`,
    explanation: "We mimic how human addition works by starting at the least significant digit (the far right). We iterate backwards. If the current digit is strictly less than 9, adding 1 to it will NOT produce a carry (e.g., 4 + 1 = 5). So, we simply increment it and immediately return the array. If the digit IS 9, adding 1 makes it 10, which means we write down '0' and carry over the '1' to the next digit to the left. If our loop successfully finishes checking every single digit and hasn't returned, it means every digit was a 9 (like 999). In this special case, we create a new array that is 1 size larger, set the very first digit to 1, and return it (e.g., 1000)."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">66. Plus One</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          You are given a <strong>large integer</strong> represented as an integer array <code>digits</code>, where each <code>digits[i]</code> is the <code>i<sup>th</sup></code> digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. The large integer does not contain any leading <code>0</code>'s.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-violet-500 pl-4 bg-violet-50 py-2 mt-4">
          Increment the large integer by one and return <em>the resulting array of digits</em>.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> digits = [1,2,3]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [1,2,4]</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: The array represents the integer 123.</p>
                 <p>Incrementing by one gives 123 + 1 = 124.</p>
                 <p>Thus, the result should be [1,2,4].</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> digits = [4,3,2,1]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [4,3,2,2]</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: The array represents the integer 4321.</p>
                 <p>Incrementing by one gives 4321 + 1 = 4322.</p>
                 <p>Thus, the result should be [4,3,2,2].</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> digits = [9]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [1,0]</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: The array represents the integer 9.</p>
                 <p>Incrementing by one gives 9 + 1 = 10.</p>
                 <p>Thus, the result should be [1,0].</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= digits.length &lt;= 100</code></li>
              <li><code>0 &lt;= digits[i] &lt;= 9</code></li>
              <li><code>digits</code> does not contain any leading <code>0</code>'s.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const PlusOneVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('rightToLeft');
  const [digitsInput, setDigitsInput] = useState('1, 2, 9');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let arr = digitsInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (arr.length === 0) arr = [1, 2, 9];
    
    // UI Safeguards matching constraints (cap at 15 for visual clarity)
    if (arr.length > 15) arr = arr.slice(0, 15);
    
    // Ensure digits are 0-9
    arr = arr.map(d => Math.max(0, Math.min(9, d)));

    return { digits: arr };
  }, [digitsInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { digits: originalDigits } = parsedData;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'rightToLeft') {
        let digits = [...originalDigits];
        let n = digits.length;
        
        addStep(
            "Initialization", 
            `Line 3: int n = digits.length;\n\nWe determine the length of the array: n = ${n}.`, 
            3, 
            { digits: [...digits], n, i: null, action: 'init' }
        );

        let i = n - 1;
        let returnedEarly = false;

        for (; i >= 0; i--) {
            addStep(
                "Evaluate For-Loop Condition", 
                `Line 6: for (int i = ${i}; i >= 0; i--)\n\nWe are iterating backwards from the rightmost digit to the left. We are currently looking at index ${i} (value: ${digits[i]}).`, 
                6, 
                { digits: [...digits], n, i, action: 'loopCond' }
            );

            let isLessThan9 = digits[i] < 9;
            addStep(
                "Check Current Digit", 
                `Line 8: if (digits[i] < 9)\n\nIs digits[${i}] (${digits[i]}) strictly less than 9?\n${isLessThan9 ? `TRUE! We can safely increment this without a carry over.` : `FALSE. It is 9, meaning adding 1 will cause a carry over.`}`, 
                8, 
                { digits: [...digits], n, i, action: 'evalIf', isLessThan9 }
            );

            if (isLessThan9) {
                digits[i]++;
                addStep(
                    "Increment Digit", 
                    `Line 9: digits[i]++;\n\nWe increment digits[${i}] to ${digits[i]}. Since it didn't overflow 9, the addition is perfectly contained.`, 
                    9, 
                    { digits: [...digits], n, i, action: 'increment' }
                );

                addStep(
                    "Return Modified Array", 
                    `Line 10: return digits;\n\nBecause the addition was fully absorbed by this digit without a carry, the rest of the array to the left is unaffected! We return immediately.`, 
                    10, 
                    { digits: [...digits], n, i, action: 'success', isSuccess: true, ans: [...digits] }
                );
                returnedEarly = true;
                break;
            } else {
                digits[i] = 0;
                addStep(
                    "Handle Carry Over (Set to 0)", 
                    `Line 14: digits[i] = 0;\n\nBecause digits[${i}] was 9, 9 + 1 = 10. We write down '0' at this position. The '1' conceptually carries over to the next loop iteration (moving left).`, 
                    14, 
                    { digits: [...digits], n, i, action: 'carryZero' }
                );
            }
        }
        
        if (!returnedEarly) {
            addStep(
                "Loop Exhausted (All 9s Case)", 
                `Line 6: The loop finished and 'i' went below 0.\n\nThis means every single digit was a 9 (e.g., 99, 999). A massive carry has propagated all the way off the left edge of our array!`, 
                6, 
                { digits: [...digits], n, i: null, action: 'exhausted' }
            );

            let newDigits = Array(n + 1).fill(0);
            addStep(
                "Create Larger Array", 
                `Line 18: int[] newDigits = new int[n + 1];\n\nWe must allocate a brand new array that is 1 element larger (size ${n + 1}) to hold the extra carry digit. In Java, it initializes to all zeros.`, 
                18, 
                { digits: [...newDigits], original: [...digits], n, i: null, action: 'newArray' }
            );

            newDigits[0] = 1;
            addStep(
                "Set Leading One", 
                `Line 19: newDigits[0] = 1;\n\nWe place our final carried '1' at the very beginning of the new array.`, 
                19, 
                { digits: [...newDigits], n, i: null, action: 'setOne' }
            );

            addStep(
                "Return New Array", 
                `Line 21: return newDigits;\n\nThe all-9s edge case is handled. Return the resized array.`, 
                21, 
                { digits: [...newDigits], n, i: null, action: 'success', isSuccess: true, ans: [...newDigits] }
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
  const { isSuccess, ans, action, digits, n, i: currI, isLessThan9 } = state;
  const { digits: origDigits } = parsedData;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Plus className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Plus One</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 66</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Arrays / Math</span>
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
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="Length (n)" val={n !== null && n !== undefined ? n : "-"} color="slate" active={n !== null && n !== undefined} />
                        <VariableCard label="Index (i)" val={currI !== null && currI !== undefined ? currI : "-"} color="purple" active={currI !== null && currI !== undefined} />
                        <VariableCard label="Digit" val={currI !== null && currI !== undefined && digits ? digits[currI] : "-"} color="sky" active={currI !== null && currI !== undefined} />
                        <VariableCard label="Carry Over" val={action === 'carryZero' || (currI !== null && currI < n - 1 && !isSuccess) ? "Active" : "None"} color="amber" active={action === 'carryZero'} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Integer Array (digits)</label>
                        <input type="text" value={digitsInput} onChange={(e) => { setDigitsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner" placeholder="1, 2, 9" />
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
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-12 pb-8 gap-10 overflow-y-auto">
                      
                      {/* Array Representation */}
                      <div className="flex flex-col items-center relative w-full">
                          
                          {/* Carry Over Indicator Animation */}
                          {action === 'carryZero' && currI !== null && (
                              <div className="absolute -top-16 flex items-center gap-2 animate-in slide-in-from-right-8 fade-in duration-500" style={{ transform: 'translateX(-20px)'}}>
                                  <span className="text-amber-500 font-black font-mono bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 shadow-sm">+1 Carry</span>
                                  <ArrowLeft size={20} className="text-amber-500" strokeWidth={3} />
                              </div>
                          )}

                          <div className="flex gap-2 md:gap-4 p-4 bg-slate-100 border border-slate-200 rounded-3xl shadow-inner max-w-full overflow-x-auto relative">
                              {digits && digits.map((digit, idx) => {
                                  let isCurrent = currI === idx && !isSuccess;
                                  let isNewArray = action === 'newArray' || action === 'setOne';
                                  
                                  let boxClass = "relative w-14 h-16 md:w-16 md:h-20 flex items-center justify-center rounded-2xl border-4 font-mono font-black text-2xl md:text-3xl transition-all duration-500 shrink-0 ";
                                  let textClass = "text-slate-700";

                                  if (isSuccess) {
                                      boxClass += "bg-emerald-50 border-emerald-400 text-emerald-800 shadow-lg scale-105";
                                      textClass = "text-emerald-800";
                                  } else if (isNewArray) {
                                      if (idx === 0 && action === 'setOne') {
                                          boxClass += "bg-sky-100 border-sky-500 scale-110 shadow-xl ring-4 ring-sky-300/30 z-20";
                                          textClass = "text-sky-900";
                                      } else {
                                          boxClass += "bg-white border-slate-300 text-slate-400 animate-in fade-in duration-700";
                                          textClass = "text-slate-400";
                                      }
                                  } else if (isCurrent) {
                                      if (action === 'increment') {
                                          boxClass += "bg-emerald-100 border-emerald-500 scale-110 shadow-xl ring-4 ring-emerald-300/30 z-20";
                                          textClass = "text-emerald-900";
                                      } else if (action === 'carryZero') {
                                          boxClass += "bg-amber-100 border-amber-500 scale-110 shadow-xl ring-4 ring-amber-300/30 z-20";
                                          textClass = "text-amber-900";
                                      } else {
                                          boxClass += "bg-violet-100 border-violet-400 scale-110 shadow-lg z-20";
                                          textClass = "text-violet-900";
                                      }
                                  } else {
                                      boxClass += "bg-white border-slate-300 shadow-sm";
                                  }

                                  return (
                                      <div key={idx} className="flex flex-col items-center relative">
                                          {/* Pointer Arrow */}
                                          <div className="h-8 mb-2 flex items-end justify-center w-full relative z-30">
                                              {isCurrent && (
                                                  <div className="flex flex-col items-center animate-bounce">
                                                      <span className="text-[10px] font-black font-mono tracking-widest text-violet-700 bg-violet-100 px-1.5 rounded border border-violet-300 shadow-sm mb-1">i</span>
                                                      <ArrowDown size={16} className="text-violet-500" strokeWidth={3}/>
                                                  </div>
                                              )}
                                              {isNewArray && idx === 0 && (
                                                  <div className="flex flex-col items-center animate-in slide-in-from-top-2">
                                                      <span className="text-[10px] font-black font-mono tracking-widest text-sky-700 bg-sky-100 px-1.5 rounded border border-sky-300 shadow-sm mb-1">New Size</span>
                                                      <ArrowDown size={16} className="text-sky-500" strokeWidth={3}/>
                                                  </div>
                                              )}
                                          </div>

                                          <div className={boxClass}>
                                              <span className={textClass}>{digit}</span>
                                          </div>
                                          
                                          <div className="text-[10px] text-slate-400 font-mono mt-2">{idx}</div>
                                      </div>
                                  );
                              })}
                          </div>
                      </div>

                      {/* Status/Math Box */}
                      {!isSuccess && currI !== null && action !== 'newArray' && action !== 'setOne' && (
                          <div className="mt-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm w-full max-w-md flex flex-col items-center gap-4 animate-in zoom-in">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono flex items-center gap-1"><Zap size={14}/> Logic Evaluation</span>
                              
                              <div className="flex items-center gap-4 text-xl md:text-2xl font-black font-mono">
                                  <div className="flex flex-col items-center bg-slate-50 border border-slate-200 p-3 rounded-xl min-w-[80px]">
                                      <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Digit</span>
                                      <span className="text-purple-600">{digits[currI] === 0 && action === 'carryZero' ? 9 : digits[currI] - (action === 'increment' ? 1 : 0)}</span>
                                  </div>
                                  
                                  <div className="text-slate-300">&lt;</div>
                                  
                                  <div className="flex flex-col items-center bg-slate-50 border border-slate-200 p-3 rounded-xl min-w-[80px]">
                                      <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Threshold</span>
                                      <span className="text-slate-700">9</span>
                                  </div>
                              </div>
                              
                              {action === 'evalIf' && (
                                  <div className={`mt-2 px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-widest text-white animate-in slide-in-from-bottom-2 ${isLessThan9 ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                      {isLessThan9 ? 'True: Safe to Add 1' : 'False: Equals 9, Carry Required'}
                                  </div>
                              )}
                              {action === 'increment' && (
                                  <div className={`mt-2 px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-widest text-white bg-emerald-500 animate-in zoom-in`}>
                                      +1 Added Successfully
                                  </div>
                              )}
                              {action === 'carryZero' && (
                                  <div className={`mt-2 px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-widest text-white bg-amber-500 animate-in zoom-in`}>
                                      9 + 1 = 10 (Set 0, Carry 1)
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
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">ADDITION COMPLETE</span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Final Result: [{ans.join(', ')}]
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
                <ListOrdered className="text-violet-600"/> Large Integer Arithmetic
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Why use an array to represent a number? Because standard integer variables (like <code>int</code> or <code>long</code>) have strict maximum sizes (e.g., $2^{31}-1$ or $2^{63}-1$). An array of size 100 can represent a 100-digit number, which completely surpasses the capability of standard primitive math types!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowLeft size={18}/> The Right-to-Left Carry
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            When you add numbers by hand, you align them on the right side and move leftwards, carrying over the 10s. We do the exact same thing algorithmically.
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            If a digit is $0-8$, adding $1$ makes it $1-9$. It will NOT carry over.<br/><br/>
                            If a digit is $9$, adding $1$ makes it $10$. We must leave a $0$ in that place, and pass a $+1$ to the next digit to the left.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Zap size={18}/> Early Termination
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            A major optimization over standard manual addition is early termination.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>Because we are ONLY adding $+1$ (and not two giant numbers together), the moment we successfully increment a digit without an overflow, we are 100% finished.</p>
                            <p>No further carries will happen. We can immediately <code>return digits;</code> inside the loop, skipping the rest of the array completely.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <AlertCircle size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-rose-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">The "999" Edge Case</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            What happens if the array is <code>[9, 9, 9]</code>? 
                            <br/><br/>
                            Our loop will change every $9$ to a $0$. Then the loop ends, leaving us with <code>[0, 0, 0]</code>. But we needed to carry a $1$ into a new thousands place! The answer should be <code>[1, 0, 0, 0]</code>.
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-[10px] text-sky-300">
                            // If we exit the loop, ALL digits were 9.<br/>
                            // We need an array size n + 1.<br/>
                            int[] newDigits = new int[n + 1];<br/><br/>
                            // Java initializes integer arrays to all 0s by default.<br/>
                            // So we just need to set the very first digit to 1!<br/>
                            newDigits[0] = 1;<br/>
                            return newDigits;
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
                        "I chose to solve this by traversing the array from right to left, mirroring how manual addition with carry-overs works. I iterate backwards; if a digit is less than 9, I increment it and instantly return the array, as the addition cannot propagate further left. If the digit is 9, I set it to 0, conceptually carrying the '1' to the next iteration. If the loop completes without returning, it implies all digits were 9s resulting in an overflow (e.g., 999). To handle this edge case, I allocate a new array of size `n + 1`, assign the leading digit to 1, and return it. This requires $O(N)$ time and modifies the array in-place requiring $O(1)$ space, unless the all-9s case triggers a new array allocation requiring $O(N)$ space."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Convert to Integer, add 1, convert back?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Never do this. Interviewers will instantly fail this approach. The constraints explicitly state <code>digits.length &lt;= 100</code>. A 100-digit number is astronomically larger than what a 64-bit <code>long</code> can hold ($2^{63}-1$ is roughly 19 digits). You must manipulate the array elements directly.
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
                                <p className="text-[10px] text-slate-500 mt-1">In the worst case (like `[9,9,9]`), we iterate through the entire array of length $N$ exactly once.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1) or O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">In the best and average cases, we modify the array in-place using $O(1)$ space. In the worst case (all 9s), we allocate a new array of size $N+1$, meaning $O(N)$ space.</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|digits|length|newDigits)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['digits'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['newDigits'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (['length'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default PlusOneVisualizer;