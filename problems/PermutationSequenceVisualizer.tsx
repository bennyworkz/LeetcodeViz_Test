import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, Calculator, ListOrdered, 
  ArrowRight, Hash, XSquare, Shuffle, FastForward, Blocks, CheckSquare
} from 'lucide-react';

const APPROACHES = {
  math: {
    id: 'math',
    title: 'Mathematical (Factorial Block)',
    subtitle: 'Optimal: O(N^2) Time, O(N) Space.',
    icon: <Calculator size={16} />,
    complexity: 'Time: O(N^2) | Space: O(N)',
    code: `class Solution {
    public String getPermutation(int n, int k) {
        List<Integer> numbers = new ArrayList<>();
        int[] factorial = new int[n + 1];
        StringBuilder sb = new StringBuilder();
        
        // 1. Precompute factorials: 0!, 1!, 2!...
        int sum = 1;
        factorial[0] = 1;
        for (int i = 1; i <= n; i++) {
            sum *= i;
            factorial[i] = sum;
            numbers.add(i); // Add available digits 1 to n
        }
        
        // 2. Convert k to 0-indexed for easier modulo math
        k--;
        
        // 3. Find the digit for each position one by one
        for (int i = 1; i <= n; i++) {
            // Number of permutations for the remaining (n - i) digits
            int blockSize = factorial[n - i];
            
            // Find which block the target k falls into
            int index = k / blockSize;
            
            // Append the chosen digit and remove it from available pool
            sb.append(numbers.get(index));
            numbers.remove(index);
            
            // Update k to the relative position within the new block
            k -= index * blockSize; 
            // equivalent to: k = k % blockSize;
        }
        
        return sb.toString();
    }
}`,
    explanation: "If we have `n` numbers, there are `n!` total permutations. If we fix the first digit, there are `(n-1)!` permutations for the remaining digits. We can think of these as 'blocks' of permutations. By dividing our target `k` (converted to 0-indexed) by `(n-1)!`, we can instantly mathematically determine the index of the digit we need for the first position! We append that digit to our result, remove it from our available list of digits, and update `k` to reflect our relative position within that specific sub-block (`k = k % blockSize`). We repeat this process for the remaining `n-1` positions. Because removing an element from an ArrayList takes O(N) time and we do it N times, the time complexity is O(N^2), but since N is at most 9, this runs almost instantaneously."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">60. Permutation Sequence</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          The set <code>[1, 2, 3, ..., n]</code> contains a total of <code>n!</code> unique permutations.
        </p>

        <p className="text-lg leading-relaxed">
          By listing and labeling all of the permutations in order, we get the following sequence for <code>n = 3</code>:
        </p>

        <ol className="list-decimal pl-6 space-y-2 text-slate-800 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max marker:text-slate-400 marker:font-sans marker:font-bold">
            <li><code>"123"</code></li>
            <li><code>"132"</code></li>
            <li><code>"213"</code></li>
            <li><code>"231"</code></li>
            <li><code>"312"</code></li>
            <li><code>"321"</code></li>
        </ol>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-violet-500 pl-4 bg-violet-50 py-2 mt-4">
          Given <code>n</code> and <code>k</code>, return the <code>k<sup>th</sup></code> permutation sequence.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> n = 3, k = 3</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "213"</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> n = 4, k = 9</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "2314"</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= n &lt;= 9</code></li>
              <li><code>1 &lt;= k &lt;= n!</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const PermutationSequenceVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('math');
  
  const [nInput, setNInput] = useState('4');
  const [kInput, setKInput] = useState('9');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  // Helper to compute factorial
  const fact = (n) => {
      let f = 1;
      for (let i = 2; i <= n; i++) f *= i;
      return f;
  };

  const parsedData = useMemo(() => {
    let n = parseInt(nInput.trim(), 10);
    let k = parseInt(kInput.trim(), 10);
    
    if (isNaN(n) || n < 1) n = 3;
    if (n > 9) n = 9; // Problem constraint

    let maxK = fact(n);
    if (isNaN(k) || k < 1) k = 1;
    if (k > maxK) k = maxK;

    return { n, k };
  }, [nInput, kInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { n, k } = parsedData;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 1000) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    let numbers = [];
    let factorials = new Array(n + 1).fill(1);

    addStep(
        "Initialization", 
        `Line 3-5: Initialize lists and variables.\n\nPreparing to find the ${k}th permutation for n = ${n}.`, 
        4, 
        { n, initialK: k, k: null, numbers: [], result: "", factArr: [], action: 'init' }
    );

    let sum = 1;
    for (let i = 1; i <= n; i++) {
        sum *= i;
        factorials[i] = sum;
        numbers.push(i);
    }

    addStep(
        "Precompute Data", 
        `Line 8-13: Precompute factorials and available numbers.\n\nFactorials: [${factorials.join(', ')}]\nNumbers available: [${numbers.join(', ')}]`, 
        13, 
        { n, initialK: k, k: null, numbers: [...numbers], result: "", factArr: [...factorials], action: 'precompute' }
    );

    let zeroIndexedK = k - 1;

    addStep(
        "Adjust Target K", 
        `Line 16: k--;\n\nThe permutations are 1-indexed (1st, 2nd, 3rd...). We convert k to 0-indexed for modulo arithmetic to work correctly.\nNew k = ${k} - 1 = ${zeroIndexedK}.`, 
        16, 
        { n, initialK: k, k: zeroIndexedK, numbers: [...numbers], result: "", factArr: [...factorials], action: 'adjustK' }
    );

    let resultStr = "";
    let currentK = zeroIndexedK;

    for (let i = 1; i <= n; i++) {
        let remainingDigits = n - i;
        let blockSize = factorials[remainingDigits];
        
        addStep(
            `Loop Iteration ${i}`, 
            `Line 19-21: We need to pick the ${i}-th digit.\nThere are ${remainingDigits} digits left to place after this one. So the 'block size' (permutations per digit) is ${remainingDigits}! = ${blockSize}.`, 
            21, 
            { n, initialK: k, k: currentK, numbers: [...numbers], result: resultStr, factArr: [...factorials], action: 'calcBlock', i, remainingDigits, blockSize }
        );

        let index = Math.floor(currentK / blockSize);
        let chosenDigit = numbers[index];

        addStep(
            "Calculate Index", 
            `Line 24: int index = k / blockSize;\n\nWhich block does our current k (${currentK}) fall into?\nIndex = Math.floor(${currentK} / ${blockSize}) = ${index}.\n\nLooking at our available numbers, the digit at index ${index} is ${chosenDigit}.`, 
            24, 
            { n, initialK: k, k: currentK, numbers: [...numbers], result: resultStr, factArr: [...factorials], action: 'calcIndex', i, remainingDigits, blockSize, index, chosenDigit }
        );

        resultStr += chosenDigit;
        
        let removedNumbers = [...numbers];
        removedNumbers.splice(index, 1);

        addStep(
            "Append & Remove", 
            `Line 27-28: Append chosen digit and remove from available pool.\n\nResult string becomes "${resultStr}".\nRemoving ${chosenDigit} from available numbers.`, 
            28, 
            { n, initialK: k, k: currentK, numbers: [...removedNumbers], result: resultStr, factArr: [...factorials], action: 'appendRemove', i, remainingDigits, blockSize, index, chosenDigit, oldNumbers: [...numbers] }
        );

        numbers = removedNumbers;
        
        let nextK = currentK % blockSize;

        addStep(
            "Update K", 
            `Line 31: k -= index * blockSize;\n\nWe must update k to its relative position within the new block we just entered.\nNew k = ${currentK} % ${blockSize} = ${nextK}.`, 
            31, 
            { n, initialK: k, k: nextK, numbers: [...numbers], result: resultStr, factArr: [...factorials], action: 'updateK', i, remainingDigits, blockSize, index, chosenDigit, oldK: currentK }
        );

        currentK = nextK;
    }

    addStep(
        "Algorithm Complete", 
        `Line 35: return sb.toString();\n\nAll ${n} digits have been placed. The ${k}-th permutation is "${resultStr}".`, 
        35, 
        { n, initialK: k, k: currentK, numbers: [], result: resultStr, factArr: [...factorials], action: 'success', isSuccess: true, ans: resultStr }
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
  const { isSuccess, ans, action, n, initialK, k: currK, numbers, result, factArr, remainingDigits, blockSize, index, chosenDigit, oldNumbers, oldK } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Shuffle className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Permutation Sequence</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 60</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Math / Combinatorics</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action === 'appendRemove' || action === 'updateK' ? 'bg-amber-500/20 border-amber-500' : (action === 'calcBlock' || action === 'calcIndex' ? 'bg-sky-500/20 border-sky-500' : 'bg-violet-500/20 border-violet-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'appendRemove' || action === 'updateK' ? 'amber' : (action === 'calcBlock' || action === 'calcIndex' ? 'sky' : 'violet')} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Iteration State</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="Curr K" val={currK !== null && currK !== undefined ? currK : "-"} color="purple" active={currK !== null && currK !== undefined} />
                        <VariableCard label="Block Size" val={blockSize !== null && blockSize !== undefined ? blockSize : "-"} color="sky" active={blockSize !== null && blockSize !== undefined} />
                        <VariableCard label="Calc Idx" val={index !== null && index !== undefined ? index : "-"} color="amber" active={index !== null && index !== undefined} />
                        <VariableCard label="Digit Pool" val={numbers ? numbers.length : "-"} color="slate" active={numbers !== undefined} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Number of Digits (n)</label>
                        <input type="number" min="1" max="9" value={nInput} onChange={(e) => { setNInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-widest font-bold text-slate-700" placeholder="4" />
                        <p className="text-[9px] text-slate-400 pl-1">Max 9 (Problem constraint).</p>
                    </div>
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Target Permutation (k)</label>
                        <input type="number" min="1" value={kInput} onChange={(e) => { setKInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-widest font-bold text-slate-700" placeholder="9" />
                        <p className="text-[9px] text-slate-400 pl-1">Max n! (e.g. 4! = 24).</p>
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action === 'appendRemove' || action === 'updateK' ? 'bg-amber-900 border-amber-800' : (action === 'calcBlock' || action === 'calcIndex' ? 'bg-sky-900 border-sky-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : (action === 'appendRemove' || action === 'updateK' ? <Shuffle size={100}/> : (action === 'calcBlock' || action === 'calcIndex' ? <Calculator size={100}/> : <Blocks size={100}/>))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action === 'appendRemove' || action === 'updateK' ? 'text-amber-400' : (action === 'calcBlock' || action === 'calcIndex' ? 'text-sky-400' : 'text-violet-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'appendRemove' || action === 'updateK' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : (action === 'calcBlock' || action === 'calcIndex' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'))}`}>Line {cur.line}</div>
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
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-center justify-start pt-12">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-4 pb-8 gap-8 overflow-y-auto overflow-x-hidden">
                      
                      {/* Top: Current String Builder */}
                      <div className="w-full flex flex-col items-center border-b border-slate-200 pb-8 relative">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-4 flex items-center gap-2"><Target size={14}/> Result String (sb)</span>
                          
                          <div className="flex items-center bg-slate-900 border-4 border-slate-800 p-3 rounded-2xl shadow-xl min-w-[200px] h-20 justify-center">
                              {/* Display result boxes for n total spots */}
                              {Array.from({length: n}).map((_, idx) => {
                                  let char = result ? result[idx] : undefined;
                                  let isNew = action === 'appendRemove' && idx === result.length - 1;

                                  let boxClass = "w-10 h-12 md:w-12 md:h-14 flex items-center justify-center font-mono font-black text-2xl mx-1 transition-all duration-500 border-b-4 ";
                                  
                                  if (char) {
                                      if (isNew) {
                                          boxClass += "text-emerald-400 border-emerald-500 animate-in zoom-in slide-in-from-bottom-4";
                                      } else {
                                          boxClass += "text-white border-slate-500";
                                      }
                                  } else {
                                      boxClass += "border-slate-700 text-transparent";
                                  }

                                  return (
                                      <div key={`res-slot-${idx}`} className={boxClass}>
                                          {char || '-'}
                                      </div>
                                  )
                              })}
                          </div>
                      </div>

                      {/* Middle: Math Calculation Panel */}
                      {!isSuccess && action !== 'init' && action !== 'precompute' && action !== 'adjustK' && (
                          <div className="w-full flex justify-center h-[120px]">
                              <div className="bg-sky-50 border-2 border-sky-200 rounded-3xl p-6 flex items-center justify-center shadow-sm w-full max-w-md relative overflow-hidden">
                                  
                                  {action === 'calcBlock' && blockSize !== undefined && (
                                      <div className="flex flex-col items-center animate-in slide-in-from-top-4">
                                          <span className="text-xs font-black text-sky-600 uppercase tracking-widest font-mono mb-2">Block Size</span>
                                          <div className="text-3xl font-mono font-black text-slate-800">
                                              ({n} - {state.i})! = <span className="text-sky-600 bg-sky-100 px-2 rounded">{blockSize}</span>
                                          </div>
                                      </div>
                                  )}

                                  {action === 'calcIndex' && index !== undefined && (
                                      <div className="flex flex-col items-center animate-in slide-in-from-bottom-4">
                                          <span className="text-xs font-black text-amber-600 uppercase tracking-widest font-mono mb-2">Digit Index</span>
                                          <div className="text-3xl font-mono font-black text-slate-800 flex items-center gap-3">
                                              <span className="flex flex-col items-center text-lg leading-none">
                                                  <span>{currK}</span>
                                                  <span className="w-full border-b-2 border-slate-800 my-1"></span>
                                                  <span>{blockSize}</span>
                                              </span>
                                              <span>=</span>
                                              <span className="text-amber-600 bg-amber-100 px-3 py-1 rounded-xl shadow-sm border border-amber-300">{index}</span>
                                          </div>
                                      </div>
                                  )}

                                  {action === 'updateK' && currK !== undefined && (
                                      <div className="flex flex-col items-center animate-in zoom-in">
                                          <span className="text-xs font-black text-purple-600 uppercase tracking-widest font-mono mb-2">Update K</span>
                                          <div className="text-3xl font-mono font-black text-slate-800">
                                              {oldK} % {blockSize} = <span className="text-purple-600 bg-purple-100 px-2 rounded">{currK}</span>
                                          </div>
                                      </div>
                                  )}

                                  {action === 'appendRemove' && chosenDigit !== undefined && (
                                      <div className="flex flex-col items-center animate-in zoom-in">
                                          <div className="text-2xl font-mono font-black text-emerald-600 bg-emerald-50 border-2 border-emerald-300 px-6 py-3 rounded-2xl shadow-sm flex items-center gap-3">
                                              <CheckSquare size={24} />
                                              Selected Digit: {chosenDigit}
                                          </div>
                                      </div>
                                  )}
                              </div>
                          </div>
                      )}

                      {/* Bottom: Available Numbers Array */}
                      {numbers && !isSuccess && (
                          <div className="w-full flex flex-col items-center mt-auto">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-4 flex items-center gap-2"><ListOrdered size={14}/> Available Digits List</span>
                              
                              <div className="flex gap-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner min-w-max mx-auto overflow-x-auto h-24 items-center">
                                  
                                  {/* Need to determine which list to show based on action to animate the removal nicely */}
                                  {(action === 'appendRemove' && oldNumbers ? oldNumbers : numbers).map((val, idx) => {
                                      
                                      let isTargetIndex = action === 'calcIndex' && index === idx;
                                      let isBeingRemoved = action === 'appendRemove' && index === idx;

                                      let boxClass = "relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl border-4 font-mono font-black text-xl transition-all duration-300 shrink-0 ";
                                      let textClass = "text-slate-700";

                                      if (isBeingRemoved) {
                                          boxClass += "bg-rose-100 border-rose-500 scale-90 opacity-0 -translate-y-8"; // Fly away
                                          textClass = "text-rose-900 line-through";
                                      } else if (isTargetIndex) {
                                          boxClass += "bg-amber-100 border-amber-500 scale-110 shadow-lg ring-4 ring-amber-300/30 z-20";
                                          textClass = "text-amber-900";
                                      } else {
                                          boxClass += "bg-white border-slate-300 shadow-sm";
                                      }

                                      return (
                                          <div key={`avail-${val}-${idx}`} className="flex flex-col items-center relative">
                                              <div className={boxClass}>
                                                  <span className={textClass}>{val}</span>
                                              </div>
                                              
                                              {/* Index label below */}
                                              <div className={`text-[9px] font-mono mt-2 font-bold transition-opacity ${isBeingRemoved ? 'opacity-0' : 'text-slate-400'}`}>
                                                  idx: {idx}
                                              </div>
                                          </div>
                                      );
                                  })}
                                  {numbers.length === 0 && action !== 'appendRemove' && <span className="text-slate-400 italic font-mono text-sm px-4">Empty</span>}
                              </div>
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
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">PERMUTATION FOUND</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  "{ans}"
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
                <Calculator className="text-violet-600"/> Combinatorial Mathematics
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Why generate permutations if we can calculate exactly what they look like? We can use the fundamental counting principle (Factorials) to instantly map an index <code>k</code> to a specific permutation sequence.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Layers size={18}/> Permutation Blocks
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            Consider <code>n = 4</code>. There are <code>4! = 24</code> total permutations.
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-3">
                            <p>If we lock the first digit as <code>1</code>, how many permutations are left for the remaining 3 digits? Exactly <code>3! = 6</code>.</p>
                            <p>Therefore, the permutations are grouped into perfectly even "blocks" of size 6.</p>
                            <p>Permutations 1-6 start with 1.<br/>Permutations 7-12 start with 2.<br/>Permutations 13-18 start with 3...</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Hash size={18}/> The Division Trick
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            If we want the 14th permutation (<code>k=14</code>), we first convert to 0-indexed: <code>k=13</code>.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>We divide <code>k</code> by our block size (6):</p>
                            <p><code>13 / 6 = 2</code>.</p>
                            <p>This tells us the digit we need is at <strong>Index 2</strong> of our available numbers array! (Available: <code>[1, 2, 3, 4]</code> -&gt; Index 2 is <code>3</code>).</p>
                            <p>We append <code>3</code>, remove it from the list, update <code>k = 13 % 6 = 1</code>, and repeat for the next position!</p>
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
                        "While we could use backtracking to generate permutations sequentially until we hit the k-th one, that takes $O(N \cdot K)$ time, scaling horribly up to $O(N!)$. Instead, I used a combinatorial math approach. By observing that fixing a leading digit leaves $(N-1)!$ permutations for the remaining suffix, I can treat these as 'blocks'. I convert $k$ to 0-indexed to simplify modulo arithmetic. In a loop, I calculate `index = k / (remaining_digits!)` to immediately find which number in my available pool belongs at the current position. I append it, remove it from the pool to prevent reuse, and update `k = k % (remaining_digits!)` to drill into the sub-block. Because `ArrayList.remove()` is $O(N)$ and I do it $N$ times, the final time complexity is $O(N^2)$, which is extremely optimal given $N \le 9$."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Why decrement K at the start?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                The problem gives us a 1-indexed <code>k</code> (e.g., asking for the 6th permutation). Math relies on 0-indexing. If a block size is 6, and we want the 6th permutation, <code>6 / 6 = 1</code>. This incorrectly pushes us to the next block! By making it 0-indexed, <code>k=5</code>, <code>5 / 6 = 0</code>, correctly keeping us in the first block.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N<sup>2</sup>)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We run a loop $N$ times. Inside the loop, we call `numbers.remove(index)`. Removing from an ArrayList shifts subsequent elements, taking $O(N)$ time. $N \times O(N) = O(N^2)$. Since $N \le 9$, it is strictly bounded by 81 operations.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We store a precomputed array of factorials up to $N$, and an ArrayList of available numbers from 1 to $N$, yielding linear space.</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|getPermutation|add|remove|get|toString|append)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['getPermutation', 'add', 'remove', 'get', 'toString', 'append'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['n', 'k', 'numbers', 'factorial', 'sb', 'sum', 'blockSize', 'index'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default PermutationSequenceVisualizer;