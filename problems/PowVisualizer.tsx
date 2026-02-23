import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Database, ListOrdered, Zap, ArrowLeftRight, Timer,
  Calculator, Divide, X as MultiplyIcon
} from 'lucide-react';

const APPROACHES = {
  optimalIterative: {
    id: 'optimalIterative',
    title: '1. Binary Exponentiation',
    subtitle: 'Optimal: O(log N) Time, O(1) Space.',
    icon: <Zap size={16} />,
    complexity: 'Time: O(log N) | Space: O(1)',
    code: `class Solution {
    public double myPow(double x, int n) {
        long nn = n;
        if (nn < 0) {
            nn = -1 * nn;
        }
        
        double ans = 1.0;
        while (nn > 0) {
            if (nn % 2 == 1) {
                ans = ans * x;
                nn = nn - 1;
            } else {
                x = x * x;
                nn = nn / 2;
            }
        }
        
        if (n < 0) {
            ans = (double)(1.0) / (double)(ans);
        }
        return ans;
    }
}`,
    explanation: "Binary Exponentiation is the optimal way to calculate powers. Instead of multiplying 'x' by itself 'n' times, we can square the base and halve the power. For example, x^10 is the same as (x^2)^5. If the power is odd, we multiply our result by the current base and subtract 1 from the power to make it even. This reduces the time complexity from O(N) to O(log N), completing calculations for even n=2,147,483,647 in just 31 steps."
  },
  bruteForce: {
    id: 'bruteForce',
    title: '2. Brute Force',
    subtitle: 'Naive: O(N) Time. Will TLE.',
    icon: <Database size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public double myPow(double x, int n) {
        long nn = n;
        if (nn < 0) {
            nn = -1 * nn;
        }
        
        double ans = 1.0;
        for (long i = 0; i < nn; i++) {
            ans = ans * x;
        }
        
        if (n < 0) {
            ans = (double)(1.0) / (double)(ans);
        }
        return ans;
    }
}`,
    explanation: "The Brute Force approach simply multiplies 'x' by itself 'n' times using a loop. While easy to understand, this approach is highly inefficient for large values of 'n'. On LeetCode, 'n' can be up to 2^31 - 1 (over 2 billion). A simple loop will result in a Time Limit Exceeded (TLE) error."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">50. Pow(x, n)</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Implement <a href="http://www.cplusplus.com/reference/valarray/pow/" className="text-violet-600 font-bold hover:underline" target="_blank" rel="noreferrer">pow(x, n)</a>, which calculates <code>x</code> raised to the power <code>n</code> (i.e., <code>x<sup>n</sup></code>).
        </p>

        <ul className="list-disc pl-6 space-y-2 text-slate-800 marker:text-violet-500 font-medium">
            <li><code>-100.0 &lt;= x &lt;= 100.0</code></li>
            <li><code>-2<sup>31</sup> &lt;= n &lt;= 2<sup>31</sup> - 1</code></li>
            <li><code>n</code> is an integer.</li>
            <li>Either <code>x</code> is not zero or <code>n &gt; 0</code>.</li>
            <li><code>-10<sup>4</sup> &lt;= x<sup>n</sup> &lt;= 10<sup>4</sup></code></li>
        </ul>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm flex gap-3 mt-6 items-start shadow-sm">
            <AlertCircle className="shrink-0 mt-0.5 text-amber-500" size={18} />
            <div className="space-y-2">
                <p><strong>Warning - Edge Case:</strong></p>
                <p>The minimum 32-bit signed integer is <code>-2,147,483,648</code>. If you try to negate this value into a standard 32-bit integer (e.g., <code>n = -n</code>), it will overflow and remain negative. You <strong>must</strong> cast <code>n</code> to a 64-bit integer (like <code>long</code> in Java) before negating it.</p>
            </div>
        </div>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> x = 2.00000, n = 10</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 1024.00000</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> x = 2.00000, n = -2</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 0.25000</p>
              <p className="text-slate-500 italic mt-2 text-xs">// Explanation: 2^-2 = 1/(2^2) = 1/4 = 0.25</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Utility to cleanly format floats for display without massive trails
const formatNum = (num) => {
    if (num === null || num === undefined) return '-';
    if (Number.isInteger(num)) return num.toString();
    
    // Avoid scientific notation for reasonably sized numbers in visualizer
    let str = parseFloat(num.toPrecision(7)).toString();
    if (str.length > 10) return num.toExponential(4);
    return str;
};

const PowVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('optimalIterative');
  const [xInput, setXInput] = useState('2.0');
  const [nInput, setNInput] = useState('10');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let x = parseFloat(xInput.trim());
    let n = parseInt(nInput.trim());
    if (isNaN(x)) x = 2.0;
    if (isNaN(n)) n = 10;
    
    // Safety caps for visualization to prevent browser freezing
    if (selectedApproachId === 'bruteForce') {
        if (n > 50) n = 50;
        if (n < -50) n = -50;
    } else {
        if (n > 1000000) n = 1000000;
        if (n < -1000000) n = -1000000;
    }

    return { x, n, originalN: n };
  }, [xInput, nInput, selectedApproachId]);

  const trace = useMemo(() => {
    const steps = [];
    const { x: originalX, originalN } = parsedData;
    
    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 1500) return; // Hard safety cap
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'optimalIterative') {
        let n = originalN;
        let x = originalX;
        
        addStep("Initialization", `Start algorithm with x = ${x}, n = ${n}`, 1, { x, n, nn: null, ans: null });
        
        let nn = n;
        addStep("Cast to Long", `Line 3: long nn = n;\nCast n to 64-bit integer to safely handle Integer.MIN_VALUE (-2147483648).`, 3, { x, n, nn, ans: null });
        
        addStep("Check Negative", `Line 4: if (nn < 0) { nn = -1 * nn; }\nCheck if power is negative.`, 4, { x, n, nn, ans: null });
        if (nn < 0) {
            nn = -1 * nn;
            addStep("Make Positive", `Line 5: nn = -1 * nn;\nPower was negative. Converting to positive ${nn} for calculation.`, 5, { x, n, nn, ans: null });
        }
        
        let ans = 1.0;
        addStep("Init Answer", `Line 8: double ans = 1.0;`, 8, { x, n, nn, ans });
        
        while (nn > 0) {
            addStep("Loop Check", `Line 9: while (nn > 0)\n${nn} > 0 is True. Continuing loop.`, 9, { x, n, nn, ans });
            
            addStep("Check Odd/Even", `Line 10: if (nn % 2 == 1)\nIs ${nn} odd or even?`, 10, { x, n, nn, ans, checkingMod: true });
            
            if (nn % 2 === 1) {
                let oldAns = ans;
                ans = ans * x;
                addStep("Odd Power", `Line 11: ans = ans * x;\nPower is ODD. Multiply ans by current base.\nans = ${formatNum(oldAns)} * ${formatNum(x)} = ${formatNum(ans)}`, 11, { x, n, nn, ans, action: 'multiply' });
                
                nn = nn - 1;
                addStep("Decrement Power", `Line 12: nn = nn - 1;\nMake power even to allow squaring next.`, 12, { x, n, nn, ans, action: 'decrement' });
            } else {
                let oldX = x;
                x = x * x;
                addStep("Even Power", `Line 14: x = x * x;\nPower is EVEN. Square the base.\nbase = ${formatNum(oldX)} * ${formatNum(oldX)} = ${formatNum(x)}`, 14, { x, n, nn, ans, action: 'square' });
                
                nn = Math.floor(nn / 2);
                addStep("Halve Power", `Line 15: nn = nn / 2;\nSince we squared the base, we halve the remaining power.`, 15, { x, n, nn, ans, action: 'halve' });
            }
        }
        
        addStep("Loop Ends", `Line 9: while (nn > 0)\n${nn} > 0 is False. Loop terminates.`, 9, { x, n, nn, ans });
        
        addStep("Check Original n", `Line 19: if (n < 0)\nWas the original power negative?`, 19, { x, n, nn, ans });
        if (originalN < 0) {
            let oldAns = ans;
            ans = 1.0 / ans;
            addStep("Invert Answer", `Line 20: ans = 1.0 / ans;\nOriginal power was negative, so we invert the final result.\n1.0 / ${formatNum(oldAns)} = ${formatNum(ans)}`, 20, { x, n, nn, ans, action: 'invert' });
        }
        
        addStep("Return", `Line 22: return ans;\nCalculation complete!`, 22, { x, n, nn, ans, isSuccess: true });
        
    } else if (selectedApproachId === 'bruteForce') {
        let n = originalN;
        let x = originalX;
        
        addStep("Initialization", `Start algorithm with x = ${x}, n = ${n}`, 1, { x, n, nn: null, ans: null });
        
        let nn = n;
        addStep("Cast to Long", `Line 3: long nn = n;`, 3, { x, n, nn, ans: null });
        
        addStep("Check Negative", `Line 4: if (nn < 0)`, 4, { x, n, nn, ans: null });
        if (nn < 0) {
            nn = -1 * nn;
            addStep("Make Positive", `Line 5: nn = -1 * nn;`, 5, { x, n, nn, ans: null });
        }
        
        let ans = 1.0;
        addStep("Init Answer", `Line 8: double ans = 1.0;`, 8, { x, n, nn, ans });
        
        let i = 0;
        addStep("Start Loop", `Line 9: for (long i = 0; i < nn; i++)`, 9, { x, n, nn, ans, i });
        
        for (i = 0; i < nn; i++) {
            if (steps.length > 200) {
                addStep("Loop Truncated", `... Skipping visualization of remaining loop iterations to prevent lag ...`, 9, { x, n, nn, ans, i });
                // Compute remaining instantly
                ans = ans * Math.pow(x, nn - i);
                i = nn;
                break;
            }
            
            addStep("Loop Iteration", `Line 9: i = ${i}. Check ${i} < ${nn}. True.`, 9, { x, n, nn, ans, i });
            
            let oldAns = ans;
            ans = ans * x;
            addStep("Multiply", `Line 10: ans = ans * x;\nans = ${formatNum(oldAns)} * ${formatNum(x)} = ${formatNum(ans)}`, 10, { x, n, nn, ans, i, action: 'multiply' });
        }
        
        addStep("Loop Ends", `Line 9: i = ${i}. Condition i < nn is False.`, 9, { x, n, nn, ans, i });
        
        addStep("Check Original n", `Line 13: if (n < 0)`, 13, { x, n, nn, ans, i });
        if (originalN < 0) {
            ans = 1.0 / ans;
            addStep("Invert Answer", `Line 14: ans = 1.0 / ans;`, 14, { x, n, nn, ans, i, action: 'invert' });
        }
        
        addStep("Return", `Line 16: return ans;`, 16, { x, n, nn, ans, i, isSuccess: true });
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
  const { isSuccess, x, n, nn, ans, action, checkingMod, i } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Calculator className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Pow(x, n)</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 50</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Math / Binary Exponentiation</span>
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
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="ans" val={ans !== null && ans !== undefined ? formatNum(ans) : null} color="emerald" active={ans !== null && ans !== undefined} />
                        <VariableCard label="base (x)" val={x !== null && x !== undefined ? formatNum(x) : null} color="rose" active={x !== null && x !== undefined} />
                        <VariableCard label="power (nn)" val={nn ?? null} color="sky" active={nn !== null && nn !== undefined} />
                        <VariableCard label={selectedApproachId === 'bruteForce' ? "Loop i" : "Original n"} val={selectedApproachId === 'bruteForce' ? (i ?? null) : (n ?? null)} color="indigo" active={true} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Base (x)</label>
                        <input type="number" step="0.00001" value={xInput} onChange={(e) => { setXInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="2.0" />
                    </div>
                    
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Power (n)</label>
                        <input type="number" value={nInput} onChange={(e) => { setNInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner" placeholder="10" />
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
                      {isSuccess ? <Check size={100}/> : <Calculator size={100}/>}
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
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 gap-8">
                      
                      {/* State Visualization Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl mt-4">
                          {/* Answer Box */}
                          <div className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all duration-500 relative ${action === 'multiply' || action === 'invert' ? 'bg-emerald-50 border-emerald-400 scale-105 shadow-lg z-20' : 'bg-white border-slate-200'}`}>
                              <span className="absolute -top-3 bg-white px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Ans</span>
                              <span className={`text-2xl font-black font-mono truncate max-w-full ${action === 'multiply' || action === 'invert' ? 'text-emerald-700' : 'text-slate-800'}`}>
                                  {ans !== null && ans !== undefined ? formatNum(ans) : '-'}
                              </span>
                          </div>

                          {/* Base Box */}
                          <div className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all duration-500 relative ${action === 'square' ? 'bg-rose-50 border-rose-400 scale-105 shadow-lg z-20' : 'bg-white border-slate-200'}`}>
                              <span className="absolute -top-3 bg-white px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Base (x)</span>
                              <span className={`text-2xl font-black font-mono truncate max-w-full ${action === 'square' ? 'text-rose-700' : 'text-slate-800'}`}>
                                  {x !== null && x !== undefined ? formatNum(x) : '-'}
                              </span>
                          </div>

                          {/* Power Box */}
                          <div className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all duration-500 relative ${action === 'halve' || action === 'decrement' || checkingMod ? 'bg-sky-50 border-sky-400 scale-105 shadow-lg z-20' : 'bg-white border-slate-200'}`}>
                              <span className="absolute -top-3 bg-white px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Power (nn)</span>
                              <span className={`text-2xl font-black font-mono truncate max-w-full ${action === 'halve' || action === 'decrement' || checkingMod ? 'text-sky-700' : 'text-slate-800'}`}>
                                  {nn !== null && nn !== undefined ? nn : '-'}
                              </span>
                          </div>
                      </div>

                      {/* Math Operation Visualizer */}
                      <div className="flex-1 flex items-center justify-center w-full">
                          {action === 'multiply' && (
                              <div className="flex items-center gap-4 text-3xl font-black font-mono animate-in slide-in-from-bottom-4 fade-in">
                                  <span className="text-emerald-600 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200 shadow-sm">ans</span>
                                  <MultiplyIcon className="text-slate-300" size={32} />
                                  <span className="text-rose-600 bg-rose-50 px-4 py-2 rounded-2xl border border-rose-200 shadow-sm">base</span>
                              </div>
                          )}
                          {action === 'square' && (
                              <div className="flex items-center gap-4 text-3xl font-black font-mono animate-in slide-in-from-bottom-4 fade-in">
                                  <span className="text-rose-600 bg-rose-50 px-4 py-2 rounded-2xl border border-rose-200 shadow-sm">base</span>
                                  <MultiplyIcon className="text-slate-300" size={32} />
                                  <span className="text-rose-600 bg-rose-50 px-4 py-2 rounded-2xl border border-rose-200 shadow-sm">base</span>
                              </div>
                          )}
                          {action === 'halve' && (
                              <div className="flex items-center gap-4 text-3xl font-black font-mono animate-in slide-in-from-bottom-4 fade-in">
                                  <span className="text-sky-600 bg-sky-50 px-4 py-2 rounded-2xl border border-sky-200 shadow-sm">nn</span>
                                  <Divide className="text-slate-300" size={32} />
                                  <span className="text-slate-600 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-300 shadow-sm">2</span>
                              </div>
                          )}
                          {action === 'decrement' && (
                              <div className="flex items-center gap-4 text-3xl font-black font-mono animate-in slide-in-from-bottom-4 fade-in">
                                  <span className="text-sky-600 bg-sky-50 px-4 py-2 rounded-2xl border border-sky-200 shadow-sm">nn</span>
                                  <span className="text-slate-300">-</span>
                                  <span className="text-slate-600 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-300 shadow-sm">1</span>
                              </div>
                          )}
                          {action === 'invert' && (
                              <div className="flex items-center gap-4 text-3xl font-black font-mono animate-in slide-in-from-bottom-4 fade-in">
                                  <span className="text-slate-600 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-300 shadow-sm">1.0</span>
                                  <Divide className="text-slate-300" size={32} />
                                  <span className="text-emerald-600 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200 shadow-sm">ans</span>
                              </div>
                          )}
                          {checkingMod && (
                              <div className="flex flex-col items-center gap-2 animate-in slide-in-from-bottom-4 fade-in">
                                  <div className="flex items-center gap-4 text-3xl font-black font-mono">
                                      <span className="text-sky-600 bg-sky-50 px-4 py-2 rounded-2xl border border-sky-200 shadow-sm">{nn}</span>
                                      <span className="text-slate-300">%</span>
                                      <span className="text-slate-600 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-300 shadow-sm">2</span>
                                  </div>
                                  <span className={`text-sm font-black uppercase tracking-widest px-3 py-1 rounded-full ${nn % 2 === 1 ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-slate-100 text-slate-500 border border-slate-300'}`}>
                                      {nn % 2 === 1 ? 'IS ODD (1)' : 'IS EVEN (0)'}
                                  </span>
                              </div>
                          )}
                          {!action && !checkingMod && !isSuccess && nn > 0 && (
                               <div className="text-slate-300 font-mono italic text-sm">Evaluating conditions...</div>
                          )}
                      </div>

                      {/* Binary representation helper (Only for Iterative optimal) */}
                      {selectedApproachId === 'optimalIterative' && nn !== null && nn !== undefined && nn > 0 && (
                          <div className="w-full flex flex-col items-center mt-auto bg-slate-50 border border-slate-200 rounded-3xl p-4 shadow-inner">
                              <span className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest font-mono">Power in Binary</span>
                              <div className="flex gap-1.5 font-mono text-lg font-black">
                                  {nn.toString(2).split('').map((bit, idx, arr) => {
                                      const isCurrentBit = idx === arr.length - 1;
                                      return (
                                          <span key={idx} className={`px-2.5 py-1 rounded-lg border transition-all duration-300 ${isCurrentBit ? (bit === '1' ? 'bg-amber-400 text-amber-900 border-amber-500 shadow-md scale-110' : 'bg-slate-300 text-slate-700 border-slate-400 shadow-md scale-110') : 'bg-white text-slate-400 border-slate-200 opacity-50'}`}>
                                              {bit}
                                          </span>
                                      )
                                  })}
                              </div>
                              <span className="text-[10px] text-slate-400 mt-2 font-mono">We process bits right-to-left. 1 = Multiply, 0 = Skip. Always Square.</span>
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
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">CALCULATION COMPLETE</span>
                              <span className="text-xs font-black uppercase text-emerald-600 tracking-widest font-mono mb-4 block">Final Result: {formatNum(ans)}</span>
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
                <Zap className="text-violet-600"/> Fast Exponentiation
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Calculating $x^n$ by multiplying $x$ by itself $n$ times is far too slow when $n$ is very large (e.g., $n = 10^9$). Binary Exponentiation (also known as Exponentiation by Squaring) allows us to calculate $x^n$ in just $O(\log_2 n)$ multiplications.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ListOrdered size={18}/> The Core Concept
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            Instead of taking steps of 1, we can double our progress at every step. We use the mathematical property: <strong>$(x^2)^{n/2} = x^n$</strong>.
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            If $n$ is EVEN: <br/>
                            $x^{10} = (x^2)^5$<br/>
                            We simply square the base $x$, and halve the power $n$.<br/><br/>
                            If $n$ is ODD: <br/>
                            $x^5 = x \times x^4$<br/>
                            We multiply our answer by $x$, then subtract 1 from $n$ (making it even).
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Zap size={18}/> Binary Representation
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            This algorithm perfectly aligns with the binary representation of $n$. Consider $x^{13}$. In binary, $13$ is $1101_2$.
                        </p>
                        <p className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner">
                            $13 = 8 + 4 + 1$<br/>
                            $x^{13} = x^8 \times x^4 \times x^1$<br/><br/>
                            As we continuously halve $n$, checking if $n \% 2 == 1$ is identical to checking if the right-most bit of $n$ is a $1$. If it is a $1$, we multiply our running `ans` by the current squared `base`.
                        </p>
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
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed">
                        <p>
                           A signed 32-bit integer in Java/C++ ranges from $-2,147,483,648$ to $2,147,483,647$.
                        </p>
                        <p>
                           If $n = -2,147,483,648$, and you try to make it positive using `n = -n`, it will cause an overflow because $2,147,483,648$ cannot fit into a 32-bit signed integer. It wraps around and remains negative, causing infinite loops or array out of bounds!
                        </p>
                        <div className="bg-rose-900/40 border border-rose-500/30 text-rose-300 p-4 rounded-xl mt-4 font-mono text-[10px]">
                           // WRONG (Will crash if n = Integer.MIN_VALUE):<br/>
                           int power = n;<br/>
                           if (power &lt; 0) power = -power;<br/><br/>
                           // CORRECT (Use 64-bit long first):<br/>
                           long power = n;<br/>
                           if (power &lt; 0) power = -1 * power;
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
                        "I used iterative Binary Exponentiation to solve this. Instead of a linear $O(N)$ multiplication, I exploit the fact that $x^n = (x^2)^{n/2}$. By iterating while $n &gt; 0$, I square the base and halve $n$ at each step. If the current $n$ is odd, I multiply the result by the current base. This guarantees $O(\log N)$ time and $O(1)$ space. I also made sure to cast $n$ to a long before doing `n = -n` to protect against integer overflow when $n = -2^{31}$."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Recursive vs Iterative?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                You can definitely write Binary Exponentiation recursively: <code>double half = myPow(x, n/2);</code> and return <code>half * half</code>. However, recursion requires <code>O(log N)</code> memory on the call stack. The iterative approach is slightly better because it uses strictly <code>O(1)</code> space. Both will easily pass interviews, but iterative shows a deeper optimization understanding.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(log N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Because we divide `nn` by 2 at every step, the number of operations is strictly proportional to the number of bits in the binary representation of `n`, which is at most 31 steps for a 32-bit integer.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We only allocate a few primitive variables (`ans`, `nn`). Memory usage does not scale with `n`.</p>
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
        indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
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

const CodeLineRenderer: React.FC<{ num: number; code: string; active: boolean; theme?: string }> = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|Stack)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default PowVisualizer;