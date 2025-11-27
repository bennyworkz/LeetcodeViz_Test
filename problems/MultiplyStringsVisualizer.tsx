import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, Calculator, Asterisk, 
  PlusSquare, ArrowRight, SplitSquareHorizontal, Hash
} from 'lucide-react';

const APPROACHES = {
  simulation: {
    id: 'simulation',
    title: '1. Manual Simulation (Optimal)',
    subtitle: 'Grade-School Math: O(M×N) Time.',
    icon: <Calculator size={16} />,
    complexity: 'Time: O(M × N) | Space: O(M + N)',
    code: `class Solution {
    public String multiply(String num1, String num2) {
        // Base case: if either is zero, product is zero
        if (num1.equals("0") || num2.equals("0")) {
            return "0";
        }
        
        int m = num1.length();
        int n = num2.length();
        int[] pos = new int[m + n];
        
        // Traverse both strings backwards
        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                int n1 = num1.charAt(i) - '0';
                int n2 = num2.charAt(j) - '0';
                int mul = n1 * n2;
                
                // Indices in the pos array corresponding to current digits
                int p1 = i + j;
                int p2 = i + j + 1;
                
                // Add the previously stored value at p2 to our product
                int sum = mul + pos[p2];
                
                // Carry over goes to p1, remainder stays at p2
                pos[p1] += sum / 10;
                pos[p2] = sum % 10;
            }
        }
        
        // Build the final string, skipping leading zeros
        StringBuilder sb = new StringBuilder();
        for (int p : pos) {
            if (!(sb.length() == 0 && p == 0)) {
                sb.append(p);
            }
        }
        
        return sb.toString();
    }
}`,
    explanation: "This algorithm beautifully mirrors how we perform multiplication manually on paper in grade school. If we multiply a number of length M and a number of length N, the maximum possible length of the product is M + N. We allocate an array `pos` of this size. We use nested loops traversing backwards from the least significant digits. Multiplying `num1[i]` by `num2[j]` affects exactly two indices in our `pos` array: `i + j` (for the tens/carry digit) and `i + j + 1` (for the ones/remainder digit). We add our product to whatever is already at `pos[p2]`, calculate the carry, and update both positions. Finally, we convert the `pos` array back into a string, ignoring any leading zeros."
  },
  naive: {
    id: 'naive',
    title: '2. Built-in BigInteger',
    subtitle: 'Cheat: O(M+N) Time.',
    icon: <Zap size={16} />,
    complexity: 'Time: O(M + N) | Space: O(M + N)',
    code: `import java.math.BigInteger;

class Solution {
    public String multiply(String num1, String num2) {
        // The problem explicitly forbids this approach!
        BigInteger b1 = new BigInteger(num1);
        BigInteger b2 = new BigInteger(num2);
        
        return b1.multiply(b2).toString();
    }
}`,
    explanation: "While using Java's built-in `BigInteger` (or similar arbitrary-precision libraries in other languages) makes the code trivial to write, it completely bypasses the algorithmic core of the problem. The interview question explicitly states: 'You must not use any built-in BigInteger library or convert the inputs to integer directly.' If you submit this in an interview, you will immediately be asked to rewrite it manually using array simulation."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">43. Multiply Strings</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given two non-negative integers <code>num1</code> and <code>num2</code> represented as strings, return the product of <code>num1</code> and <code>num2</code>, also represented as a string.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-rose-500 pl-4 bg-rose-50 py-2 mt-4">
          <strong>Note:</strong> You must not use any built-in BigInteger library or convert the inputs to integer directly.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> num1 = "2", num2 = "3"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "6"</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> num1 = "123", num2 = "45"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "5535"</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= num1.length, num2.length &lt;= 200</code></li>
              <li><code>num1</code> and <code>num2</code> consist of digits only.</li>
              <li>Both <code>num1</code> and <code>num2</code> do not contain any leading zero, except the number <code>"0"</code> itself.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const MultiplyStringsVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('simulation');
  
  const [num1Input, setNum1Input] = useState('123');
  const [num2Input, setNum2Input] = useState('45');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let s1 = num1Input.replace(/[^0-9]/g, '');
    let s2 = num2Input.replace(/[^0-9]/g, '');
    
    if (!s1) s1 = "123";
    if (!s2) s2 = "45";
    
    // UI Safety cap to prevent browser freezing. 5x5 = 25 loop iterations = ~80 steps.
    if (s1.length > 5) s1 = s1.substring(0, 5);
    if (s2.length > 5) s2 = s2.substring(0, 5);

    return { num1: s1, num2: s2 };
  }, [num1Input, num2Input]);

  const trace = useMemo(() => {
    const steps = [];
    const { num1, num2 } = parsedData;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2500) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'simulation') {
        let m = num1.length;
        let n = num2.length;
        let pos = new Array(m + n).fill(0);

        addStep(
            "Initialization", 
            `Line 3-9: Check for zero bases, then allocate 'pos' array.\n\nm = ${m}, n = ${n}. Maximum product length is m + n = ${m + n}.\nWe create an empty array 'pos' of size ${m + n}.`, 
            9, 
            { num1, num2, pos: [...pos], i: null, j: null, p1: null, p2: null, mul: null, sum: null, n1: null, n2: null, carry: null, rem: null, action: 'init' }
        );

        if (num1 === "0" || num2 === "0") {
            addStep(
                "Base Case Zero", 
                `Line 4: if (num1.equals("0") || num2.equals("0")) return "0";\n\nOne of the inputs is exactly zero. Multiplication by zero is always zero!`, 
                4, 
                { num1, num2, pos: [...pos], action: 'success', isSuccess: true, ans: "0" }
            );
            return steps;
        }

        for (let i = m - 1; i >= 0; i--) {
            for (let j = n - 1; j >= 0; j--) {
                let n1 = parseInt(num1[i]);
                let n2 = parseInt(num2[j]);
                let mul = n1 * n2;
                let p1 = i + j;
                let p2 = i + j + 1;
                
                addStep(
                    "Multiply Digits", 
                    `Line 15: int mul = (num1.charAt(${i}) - '0') * (num2.charAt(${j}) - '0');\n\nMultiplying '${n1}' by '${n2}' = ${mul}.`, 
                    15, 
                    { num1, num2, pos: [...pos], i, j, p1, p2, n1, n2, mul, sum: null, carry: null, rem: null, action: 'multiply' }
                );
                
                let oldP2Val = pos[p2];
                let sum = mul + pos[p2];
                
                addStep(
                    "Calculate Sum", 
                    `Line 20: int sum = mul + pos[p2];\n\nWe add our product (${mul}) to whatever value is already stored at pos[${p2}] (${oldP2Val}). Total sum = ${sum}.`, 
                    20, 
                    { num1, num2, pos: [...pos], i, j, p1, p2, n1, n2, mul, sum, oldP2Val, carry: null, rem: null, action: 'sum' }
                );
                
                let carry = Math.floor(sum / 10);
                let rem = sum % 10;
                
                pos[p1] += carry;
                pos[p2] = rem;
                
                addStep(
                    "Update Pos Array", 
                    `Line 23-24: pos[p1] += sum / 10; pos[p2] = sum % 10;\n\nWe distribute the sum (${sum}). The remainder (${rem}) stays at pos[${p2}]. The carry (${carry}) is added to pos[${p1}].`, 
                    24, 
                    { num1, num2, pos: [...pos], i, j, p1, p2, n1, n2, mul, sum, carry, rem, oldP2Val, action: 'update' }
                );
            }
        }

        let sb = "";
        let skipping = true;
        for (let p of pos) {
            if (p === 0 && skipping) continue;
            skipping = false;
            sb += p;
        }
        let ans = sb === "" ? "0" : sb;

        addStep(
            "Build Final String", 
            `Line 28-34: StringBuilder sb = new StringBuilder();\n\nWe iterate over 'pos' to construct the string, explicitly skipping any leading zeros. The final string is "${ans}".`, 
            34, 
            { num1, num2, pos: [...pos], action: "success", isSuccess: true, ans }
        );

    } else if (selectedApproachId === 'naive') {
        
        addStep("Initialize", "Line 4: Parsing strings into BigInteger objects.", 4, { action: 'init' });
        
        let b1 = BigInt(num1);
        let b2 = BigInt(num2);
        let ans = (b1 * b2).toString();
        
        addStep("Multiply & Return", "Line 8: return b1.multiply(b2).toString();\n\nDirectly computes the multiplication internally using the language's arbitrary-precision integers.", 8, { action: 'success', isSuccess: true, ans });
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
  const { isSuccess, ans, action, pos, i: currI, j: currJ, p1, p2, n1, n2, mul, sum, carry, rem, oldP2Val } = state;
  const { num1, num2 } = parsedData;

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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Multiply Strings</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 43</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Math / Strings / Arrays</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action === 'update' ? 'bg-emerald-500/20 border-emerald-500' : (action === 'sum' ? 'bg-sky-500/20 border-sky-500' : (action === 'multiply' ? 'bg-amber-500/20 border-amber-500' : 'bg-violet-500/20 border-violet-500')))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'update' ? 'emerald' : (action === 'sum' ? 'sky' : (action === 'multiply' ? 'amber' : 'violet'))} />
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
                    
                    {selectedApproachId === 'simulation' ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <VariableCard label="Ptr i (num1)" val={currI !== null && currI !== undefined ? currI : "-"} color="sky" active={currI !== null && currI !== undefined} />
                            <VariableCard label="Ptr j (num2)" val={currJ !== null && currJ !== undefined ? currJ : "-"} color="purple" active={currJ !== null && currJ !== undefined} />
                            <VariableCard label="Idx p1 (Carry)" val={p1 !== null && p1 !== undefined ? p1 : "-"} color="amber" active={p1 !== null && p1 !== undefined} />
                            <VariableCard label="Idx p2 (Rem)" val={p2 !== null && p2 !== undefined ? p2 : "-"} color="emerald" active={p2 !== null && p2 !== undefined} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            <VariableCard label="Method" val="BigInteger Implementation" color="slate" active={true} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Number 1 (String)</label>
                        <input type="number" value={num1Input} onChange={(e) => { setNum1Input(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-widest font-bold text-sky-700" placeholder="123" />
                        <p className="text-[9px] text-slate-400 pl-1">Max 5 digits for UI tracing.</p>
                    </div>
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Number 2 (String)</label>
                        <input type="number" value={num2Input} onChange={(e) => { setNum2Input(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-widest font-bold text-purple-700" placeholder="45" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action === 'update' ? 'bg-emerald-900 border-emerald-800' : (action === 'sum' ? 'bg-sky-900 border-sky-800' : (action === 'multiply' ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800')))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : (action === 'multiply' ? <Asterisk size={100}/> : (action === 'sum' ? <PlusSquare size={100}/> : <Calculator size={100}/>))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action === 'update' ? 'text-emerald-400' : (action === 'sum' ? 'text-sky-400' : (action === 'multiply' ? 'text-amber-400' : 'text-violet-400')))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'update' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'sum' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : (action === 'multiply' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30')))}`}>Line {cur.line}</div>
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
                      
                      {selectedApproachId === 'simulation' && pos !== undefined && (
                          <>
                              {/* Math Calculation Center Box */}
                              <div className="w-full flex justify-center mb-4 min-h-[140px] items-center border-b border-slate-200 pb-8">
                                  {action !== 'init' && !isSuccess ? (
                                      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 flex flex-col gap-5 shadow-sm w-max min-w-[340px] animate-in zoom-in">
                                         
                                         {/* Step 1: Multiply */}
                                         <div className={`flex items-center justify-between gap-4 font-mono text-xl transition-all duration-300 ${action === 'multiply' ? 'opacity-100 font-black scale-105' : 'opacity-40'}`}>
                                             <div className="flex items-center gap-3">
                                                <span className="bg-sky-100 text-sky-800 border-2 border-sky-300 px-3 py-1 rounded shadow-sm">n1: {n1}</span>
                                                <Asterisk size={18} className="text-slate-400" />
                                                <span className="bg-purple-100 text-purple-800 border-2 border-purple-300 px-3 py-1 rounded shadow-sm">n2: {n2}</span>
                                             </div>
                                             <div className="flex items-center gap-3">
                                                <span className="text-slate-400">=</span>
                                                <span className="bg-amber-100 text-amber-800 border-2 border-amber-400 px-4 py-1 rounded shadow-sm">{mul}</span>
                                             </div>
                                         </div>

                                         {/* Step 2: Sum */}
                                         {(action === 'sum' || action === 'update') && (
                                             <div className={`flex items-center justify-between gap-4 font-mono text-xl transition-all duration-300 ${action === 'sum' ? 'opacity-100 font-black scale-105' : 'opacity-40'}`}>
                                                 <div className="flex items-center gap-3">
                                                    <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">{mul}</span>
                                                    <PlusSquare size={18} className="text-slate-400" />
                                                    <span className="bg-slate-100 text-slate-700 border-2 border-slate-300 px-3 py-1 rounded shadow-sm text-sm flex items-center gap-2">pos[{p2}] <ArrowRight size={14}/> {oldP2Val}</span>
                                                 </div>
                                                 <div className="flex items-center gap-3">
                                                    <span className="text-slate-400">=</span>
                                                    <span className="bg-blue-100 text-blue-800 border-2 border-blue-400 px-4 py-1 rounded shadow-sm">{sum}</span>
                                                 </div>
                                             </div>
                                         )}

                                         {/* Step 3: Update */}
                                         {action === 'update' && (
                                             <div className={`flex flex-col gap-3 font-mono text-sm pt-4 border-t-2 border-dashed border-slate-200 transition-all duration-300 opacity-100 font-black animate-in slide-in-from-top-4`}>
                                                 <div className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                                     <span className="text-slate-500 uppercase tracking-widest text-[10px]">Carry to pos[{p1}]</span>
                                                     <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-lg border border-amber-300 shadow-sm">+= {carry}</span>
                                                 </div>
                                                 <div className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                                     <span className="text-slate-500 uppercase tracking-widest text-[10px]">Remain to pos[{p2}]</span>
                                                     <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-300 shadow-sm">= {rem}</span>
                                                 </div>
                                             </div>
                                         )}

                                      </div>
                                  ) : (
                                      <div className="flex flex-col items-center justify-center text-slate-300 opacity-50 font-mono font-bold italic h-full">
                                          {isSuccess ? 'Calculations finalized' : 'Awaiting traversal...'}
                                      </div>
                                  )}
                              </div>

                              {/* Grade School Math Arrays */}
                              <div className="flex flex-col items-end w-full max-w-lg mx-auto pl-8">
                                  
                                  {/* num1 Array */}
                                  <div className="flex gap-2 w-full justify-end mb-4">
                                      {num1.split('').map((char, idx) => {
                                          let isI = currI === idx && !isSuccess;
                                          return (
                                              <div key={`n1-${idx}`} className="flex flex-col items-center relative">
                                                  {isI && (
                                                      <div className="absolute -top-10 flex flex-col items-center animate-in slide-in-from-top-2">
                                                          <span className="text-[10px] font-black font-mono tracking-widest text-sky-800 bg-sky-100 px-1 py-0.5 rounded shadow-sm border border-sky-300 mb-1">i</span>
                                                          <ArrowDown size={14} className="text-sky-500" strokeWidth={3}/>
                                                      </div>
                                                  )}
                                                  <div className={`w-12 h-14 md:w-14 md:h-16 flex items-center justify-center rounded-xl border-4 font-mono font-black text-2xl transition-all duration-300 ${isI ? 'bg-sky-100 border-sky-500 text-sky-900 scale-110 shadow-lg ring-4 ring-sky-300/30 z-20' : 'bg-white border-slate-200 text-slate-700 shadow-sm'}`}>
                                                      {char}
                                                  </div>
                                                  <span className="text-[9px] text-slate-300 font-mono font-bold mt-2">{idx}</span>
                                              </div>
                                          )
                                      })}
                                  </div>

                                  {/* num2 Array */}
                                  <div className="flex gap-2 w-full justify-end relative mb-12">
                                      <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 scale-150"><Asterisk size={24} strokeWidth={3}/></div>
                                      {num2.split('').map((char, idx) => {
                                          let isJ = currJ === idx && !isSuccess;
                                          return (
                                              <div key={`n2-${idx}`} className="flex flex-col items-center relative">
                                                  <div className={`w-12 h-14 md:w-14 md:h-16 flex items-center justify-center rounded-xl border-4 font-mono font-black text-2xl transition-all duration-300 ${isJ ? 'bg-purple-100 border-purple-500 text-purple-900 scale-110 shadow-lg ring-4 ring-purple-300/30 z-20' : 'bg-white border-slate-200 text-slate-700 shadow-sm'}`}>
                                                      {char}
                                                  </div>
                                                  <span className="text-[9px] text-slate-300 font-mono font-bold mt-2">{idx}</span>
                                                  {isJ && (
                                                      <div className="absolute -bottom-10 flex flex-col items-center animate-in slide-in-from-bottom-2">
                                                          <ArrowUp size={14} className="text-purple-500" strokeWidth={3}/>
                                                          <span className="text-[10px] font-black font-mono tracking-widest text-purple-800 bg-purple-100 px-1 py-0.5 rounded shadow-sm border border-purple-300 mt-1">j</span>
                                                      </div>
                                                  )}
                                              </div>
                                          )
                                      })}
                                  </div>

                                  {/* pos Array */}
                                  <div className="flex gap-2 w-full justify-end border-t-4 border-slate-300 pt-8 relative">
                                      <span className="absolute left-0 top-12 text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono">pos arr</span>
                                      {pos.map((val, idx) => {
                                          let isP1 = p1 === idx && !isSuccess;
                                          let isP2 = p2 === idx && !isSuccess;

                                          let boxClass = "w-12 h-14 md:w-14 md:h-16 flex items-center justify-center rounded-xl border-4 font-mono font-black text-2xl transition-all duration-300 ";
                                          let textClass = "text-slate-700";

                                          if (isP1) {
                                              boxClass += "bg-amber-100 border-amber-500 scale-110 shadow-lg z-20 ";
                                              if (action === 'update') boxClass += "ring-4 ring-amber-300/30";
                                              textClass = "text-amber-900";
                                          } else if (isP2) {
                                              boxClass += "bg-emerald-100 border-emerald-500 scale-110 shadow-lg z-20 ";
                                              if (action === 'update') boxClass += "ring-4 ring-emerald-300/30";
                                              textClass = "text-emerald-900";
                                          } else {
                                              boxClass += "bg-slate-100 border-slate-300 shadow-inner ";
                                              textClass = "text-slate-400";
                                          }

                                          return (
                                              <div key={`pos-${idx}`} className="flex flex-col items-center relative">
                                                  <div className={boxClass}>
                                                      <span className={textClass}>{val}</span>
                                                  </div>
                                                  <span className="text-[9px] text-slate-400 font-mono font-bold mt-2">p{idx}</span>
                                                  
                                                  {/* Pointers mapping beneath pos */}
                                                  <div className="absolute -bottom-10 flex flex-col items-center h-8 w-full z-30">
                                                      {isP1 && (
                                                          <div className="flex flex-col items-center animate-in slide-in-from-bottom-2">
                                                              <ArrowUp size={14} className="text-amber-500" strokeWidth={3}/>
                                                              <span className="text-[10px] font-black font-mono tracking-widest px-1 py-0.5 rounded shadow-sm mt-1 text-amber-800 bg-amber-100 border-amber-300">p1</span>
                                                          </div>
                                                      )}
                                                      {isP2 && (
                                                          <div className="flex flex-col items-center animate-in slide-in-from-bottom-2">
                                                              <ArrowUp size={14} className="text-emerald-500" strokeWidth={3}/>
                                                              <span className="text-[10px] font-black font-mono tracking-widest px-1 py-0.5 rounded shadow-sm mt-1 text-emerald-800 bg-emerald-100 border-emerald-300">p2</span>
                                                          </div>
                                                      )}
                                                  </div>
                                              </div>
                                          )
                                      })}
                                  </div>

                              </div>
                          </>
                      )}

                      {/* Builtin Approach Fallback */}
                      {selectedApproachId === 'naive' && (
                          <div className="flex flex-col items-center justify-center h-full gap-8 text-center px-8">
                              <Zap size={64} className="text-violet-400 opacity-50" />
                              <div className="font-mono text-3xl font-black text-slate-800 tracking-widest bg-white px-8 py-6 rounded-[2rem] border-4 border-slate-200 shadow-xl">
                                  {isSuccess ? ans : '...'}
                              </div>
                              <p className="text-sm text-slate-500 font-bold max-w-sm">Calculated immediately under the hood by standard language libraries.</p>
                          </div>
                      )}

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && selectedApproachId === 'simulation' && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600`}>
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">MULTIPLICATION COMPLETE</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Final String Built: "{ans}"
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
                <Calculator className="text-violet-600"/> Grade-School Multiplication
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                When asked to multiply strings or implement BigInteger libraries from scratch, the only reliable way is to simulate exactly how humans are taught to multiply on paper.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Layers size={18}/> Array Size & Indexing
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            If you multiply a number of length <code>M</code> and length <code>N</code>, the maximum possible length of the product is exactly <code>M + N</code>.
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-3">
                            <p>e.g., 99 * 99 = 9801 (Length 2 + 2 = 4).</p>
                            <p>When multiplying <code>num1[i]</code> and <code>num2[j]</code>, their product directly corresponds to two specific indices in the result array: <code>p1 = i + j</code> and <code>p2 = i + j + 1</code>.</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <SplitSquareHorizontal size={18}/> Carry & Remainder
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            A product of two single digits can range from 0 to 81. We must handle this split across two slots in the array.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>We first add any existing value at <code>pos[p2]</code> to our multiplication product to get the total <code>sum</code>.</p>
                            <p>The <strong>carry</strong> (tens place) goes to <code>p1</code>: <code>sum / 10</code>.</p>
                            <p>The <strong>remainder</strong> (ones place) stays at <code>p2</code>: <code>sum % 10</code>.</p>
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
                        "Because the problem forbids built-in arbitrary-precision arithmetic, I implemented a manual simulation of grade-school multiplication. The product of strings of length M and N can have a maximum length of M + N, so I initialize an integer array `pos` of that size. I use nested loops to iterate backward through both strings. For each digit pair at indices `i` and `j`, their product influences the result array exactly at `p1 = i + j` and `p2 = i + j + 1`. I calculate the sum of the product and any existing value at `pos[p2]`, placing the remainder (`sum % 10`) at `p2` and adding the carry (`sum / 10`) to `p1`. Finally, I iterate over the `pos` array using a StringBuilder to construct the result, making sure to skip any leading zeros. This performs optimally in $O(M \times N)$ time with $O(M + N)$ auxiliary space."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Is pos[p1] safe from overflow?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Yes. When we do <code>pos[p1] += carry</code>, we might push the value at <code>pos[p1]</code> above 9 temporarily. However, this is perfectly safe because <code>pos[p1]</code> will become the <code>pos[p2]</code> of the very next inner loop iteration (or outer loop), where its total value will be evaluated in the <code>sum</code> calculation and re-distributed safely into carries and remainders!
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(M × N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We run a nested `for` loop, multiplying every digit of `num1` by every digit of `num2`. This results in strictly M * N constant-time multiplication and addition operations.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(M + N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We allocate an integer array `pos` of size `m + n` to store the intermediate products, and later a `StringBuilder` of equivalent maximum size to return the final string.</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|multiply|equals|length|charAt|append|toString|num1|num2|pos|mul|sum|p1|p2|BigInteger)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math', 'Arrays', 'ArrayList', 'ListNode', 'TreeNode', 'Stack', 'StringBuilder', 'BigInteger'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['multiply', 'equals', 'length', 'charAt', 'append', 'toString'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['num1', 'num2', 'pos', 'p1', 'p2', 'mul', 'sum'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default MultiplyStringsVisualizer;