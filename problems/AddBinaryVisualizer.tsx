import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, PlusSquare, Binary, Calculator, ShieldAlert,
  ArrowLeftRight
} from 'lucide-react';

const APPROACHES = {
  bitByBit: {
    id: 'bitByBit',
    title: '1. Bit-by-Bit Addition',
    subtitle: 'Optimal: O(max(N, M)) Time, O(max(N, M)) Space.',
    icon: <Calculator size={16} />,
    complexity: 'Time: O(max(N, M)) | Space: O(max(N, M))',
    code: `class Solution {
    public String addBinary(String a, String b) {
        StringBuilder sb = new StringBuilder();
        int i = a.length() - 1;
        int j = b.length() - 1;
        int carry = 0;
        
        // Loop while there are bits left in either string OR a carry remains
        while (i >= 0 || j >= 0 || carry == 1) {
            int sum = carry;
            
            if (i >= 0) {
                sum += a.charAt(i--) - '0';
            }
            if (j >= 0) {
                sum += b.charAt(j--) - '0';
            }
            
            // Append the remainder (sum % 2) to our result
            sb.append(sum % 2);
            
            // Update carry for the next position (sum / 2)
            carry = sum / 2;
        }
        
        // Since we appended from right-to-left, we must reverse the result
        return sb.reverse().toString();
    }
}`,
    explanation: "This is the standard and most robust approach. We mimic how you would perform addition on paper, starting from the rightmost (least significant) digits. We maintain pointers `i` and `j` at the end of strings `a` and `b`, and a `carry` variable. In each step, we sum the current bits and the carry. Since it's binary (base 2), if the sum is 0 or 1, the resulting bit is just the sum and carry is 0. If the sum is 2 or 3, the resulting bit is `sum % 2`, and the carry becomes 1 (`sum / 2`). We append these bits to a StringBuilder, and because we build it backwards, we reverse it at the end before returning."
  },
  builtIn: {
    id: 'builtIn',
    title: '2. Built-In BigInteger',
    subtitle: 'Cheat: Easy to write, but often disallowed.',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N + M) | Space: O(max(N, M))',
    code: `import java.math.BigInteger;

class Solution {
    public String addBinary(String a, String b) {
        // Convert binary strings to BigInteger objects
        BigInteger num1 = new BigInteger(a, 2);
        BigInteger num2 = new BigInteger(b, 2);
        
        // Add them together
        BigInteger sum = num1.add(num2);
        
        // Convert back to a binary string
        return sum.toString(2);
    }
}`,
    explanation: "This approach uses Java's built-in `BigInteger` class (or Python's native arbitrary-precision integers) to directly parse the binary strings, add them, and format them back to binary strings. While this is valid code and will pass LeetCode, interviewers will almost always ask you to implement the underlying logic manually. Note: Standard `Integer.parseInt(a, 2)` will fail because the strings can be up to 10,000 characters long, far exceeding standard 32-bit or 64-bit integer limits!"
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">67. Add Binary</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given two binary strings <code>a</code> and <code>b</code>, return <em>their sum as a binary string</em>.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> a = "11", b = "1"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "100"</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: 11 (3 in decimal) + 1 (1 in decimal) = 100 (4 in decimal).</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> a = "1010", b = "1011"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "10101"</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: 1010 (10) + 1011 (11) = 10101 (21).</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= a.length, b.length &lt;= 10<sup>4</sup></code></li>
              <li><code>a</code> and <code>b</code> consist only of <code>'0'</code> or <code>'1'</code> characters.</li>
              <li>Each string does not contain leading zeros except for the zero itself.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const AddBinaryVisualizer =() =>{
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('bitByBit');
  const [aInput, setAInput] = useState('1010');
  const [bInput, setBInput] = useState('1011');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    // Sanitize to only binary characters
    let a = aInput.replace(/[^01]/g, '');
    let b = bInput.replace(/[^01]/g, '');
    
    if (!a) a = "0";
    if (!b) b = "0";
    
    // UI Safeguards to fit on screen reasonably
    if (a.length > 12) a = a.slice(0, 12);
    if (b.length > 12) b = b.slice(0, 12);

    return { a, b };
  }, [aInput, bInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { a, b } = parsedData;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'bitByBit') {
        let i = a.length - 1;
        let j = b.length - 1;
        let carry = 0;
        let sb = "";

        addStep(
            "Initialization", 
            `Line 3-6: StringBuilder sb = new StringBuilder();\nint i = ${i}, j = ${j}, carry = 0;\n\nWe initialize pointers to the end (least significant bit) of both strings. Carry is set to 0.`, 
            6, 
            { i, j, carry, sb, sum: null, action: 'init' }
        );

        let iter = 0;
        while (i >= 0 || j >= 0 || carry === 1) {
            if (iter++ > 100) break;

            addStep(
                "Evaluate Loop Condition", 
                `Line 9: while (i >= 0 || j >= 0 || carry == 1)\n\nAre there bits left in 'a' (${i >= 0}), bits left in 'b' (${j >= 0}), or an unresolved carry (${carry === 1})?\nTRUE. Proceed.`, 
                9, 
                { i, j, carry, sb, sum: null, action: 'evalCond' }
            );

            let sum = carry;
            addStep(
                "Initialize Sum with Carry", 
                `Line 10: int sum = carry;\n\nWe start the sum for this column with our current carry value (${carry}).`, 
                10, 
                { i, j, carry, sb, sum, action: 'initSum' }
            );

            if (i >= 0) {
                let bitA = a.charCodeAt(i) - '0'.charCodeAt(0);
                sum += bitA;
                
                addStep(
                    "Add Bit from String 'A'", 
                    `Line 12-13: if (i >= 0) sum += a.charAt(i--) - '0';\n\n'a' has a bit available at index ${i} ('${bitA}'). We add it to sum. sum = ${sum}.\nPointer 'i' is decremented to ${i - 1}.`, 
                    13, 
                    { i: i - 1, j, carry, sb, sum, action: 'addA', bitA }
                );
                i--;
            }

            if (j >= 0) {
                let bitB = b.charCodeAt(j) - '0'.charCodeAt(0);
                sum += bitB;
                
                addStep(
                    "Add Bit from String 'B'", 
                    `Line 15-16: if (j >= 0) sum += b.charAt(j--) - '0';\n\n'b' has a bit available at index ${j} ('${bitB}'). We add it to sum. sum = ${sum}.\nPointer 'j' is decremented to ${j - 1}.`, 
                    16, 
                    { i, j: j - 1, carry, sb, sum, action: 'addB', bitB }
                );
                j--;
            }

            let appendBit = sum % 2;
            sb += appendBit; // Simulating string builder (we will reverse it later)
            
            addStep(
                "Append Remainder Bit", 
                `Line 20: sb.append(sum % 2);\n\nIn base 2, the bit to write down is sum % 2.\n${sum} % 2 = ${appendBit}.\nWe append '${appendBit}' to our StringBuilder. (Current string: "${sb}")`, 
                20, 
                { i, j, carry, sb, sum, action: 'appendBit', appendBit }
            );

            let newCarry = Math.floor(sum / 2);
            addStep(
                "Calculate Next Carry", 
                `Line 23: carry = sum / 2;\n\nThe carry passed to the next column is sum / 2.\n${sum} / 2 = ${newCarry}.`, 
                23, 
                { i, j, carry: newCarry, sb, sum, action: 'updateCarry' }
            );
            carry = newCarry;
        }

        addStep(
            "Loop Terminates", 
            `Line 9: while (i >= 0 || j >= 0 || carry == 1)\n\nWe have exhausted both strings AND the carry is 0. The addition is complete!`, 
            9, 
            { i, j, carry, sb, sum: null, action: 'loopEnd' }
        );

        let finalResult = sb.split('').reverse().join('');
        addStep(
            "Reverse and Return", 
            `Line 27: return sb.reverse().toString();\n\nBecause we appended the bits from least significant to most significant (right-to-left), our StringBuilder is backwards. We reverse it to get "${finalResult}".`, 
            27, 
            { i, j, carry, sb, sum: null, action: 'success', isSuccess: true, ans: finalResult }
        );

    } else if (selectedApproachId === 'builtIn') {
        // Built in approach trace
        addStep(
            "Convert String A", 
            `Line 6: BigInteger num1 = new BigInteger("${a}", 2);\n\nParses string 'a' from base 2 (binary) into a BigInteger object.`, 
            6, 
            { a, b, action: 'init' }
        );
        addStep(
            "Convert String B", 
            `Line 7: BigInteger num2 = new BigInteger("${b}", 2);\n\nParses string 'b' from base 2 (binary) into a BigInteger object.`, 
            7, 
            { a, b, action: 'init' }
        );
        addStep(
            "Perform Addition", 
            `Line 10: BigInteger sum = num1.add(num2);\n\nInternally handles the addition logic using arbitrary-precision math.`, 
            10, 
            { a, b, action: 'calc' }
        );
        
        let sumStr = (BigInt("0b" + a) + BigInt("0b" + b)).toString(2);
        
        addStep(
            "Convert and Return", 
            `Line 13: return sum.toString(2);\n\nConverts the BigInteger back into a base 2 string representation.`, 
            13, 
            { a, b, action: 'success', isSuccess: true, ans: sumStr }
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
  const { isSuccess, ans, action, i: currI, j: currJ, carry, sb, sum, appendBit } = state;
  const { a, b } = parsedData;

  // Grid calculations for visual representation
  const maxVisualLen = Math.max(a.length, b.length) + 1; // +1 for potential overflow carry
  const aPadded = a.padStart(maxVisualLen, ' ');
  const bPadded = b.padStart(maxVisualLen, ' ');
  
  // Calculate which column is currently active (from right to left)
  // Initially, activeCol is maxVisualLen - 1. When i/j decrements, it shifts left.
  let activeCol = -1;
  if (!isSuccess && selectedApproachId === 'bitByBit') {
      // Sb length dictates how many columns we have processed
      let processedCols = sb ? sb.length : 0;
      if (action === 'appendBit' || action === 'updateCarry') {
           activeCol = maxVisualLen - 1 - (processedCols - 1);
      } else {
           activeCol = maxVisualLen - 1 - processedCols;
      }
  }

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Binary className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Add Binary</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 67</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Math / Strings / Bit Manipulation</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action === 'updateCarry' ? 'bg-amber-500/20 border-amber-500' : 'bg-violet-500/20 border-violet-500')}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'updateCarry' ? 'amber' : 'violet'} />
                        </React.Fragment>
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
                    
                    {selectedApproachId === 'bitByBit' ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <VariableCard label="Ptr i (Str A)" val={currI !== null && currI !== undefined ? currI : "-"} color="sky" active={currI !== null && currI !== undefined} />
                            <VariableCard label="Ptr j (Str B)" val={currJ !== null && currJ !== undefined ? currJ : "-"} color="purple" active={currJ !== null && currJ !== undefined} />
                            <VariableCard label="Col Sum" val={sum !== null && sum !== undefined ? sum : "-"} color="slate" active={sum !== null && sum !== undefined} />
                            <VariableCard label="Carry" val={carry !== null && carry !== undefined ? carry : "-"} color="amber" active={carry !== null && carry !== undefined && carry > 0} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            <VariableCard label="Status" val="Delegated to Built-in Library" color="slate" active={true} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Binary A</label>
                        <input type="text" value={aInput} onChange={(e) => { setAInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-[0.2em] font-bold" placeholder="1010" />
                    </div>
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Binary B</label>
                        <input type="text" value={bInput} onChange={(e) => { setBInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-[0.2em] font-bold" placeholder="1011" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action === 'updateCarry' ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800')}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : <Binary size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action === 'updateCarry' ? 'text-amber-400' : 'text-violet-400')}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'updateCarry' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30')}`}>Line {cur.line}</div>
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
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-4 pb-8 gap-10 overflow-x-auto">
                      
                      {selectedApproachId === 'bitByBit' && (
                          <div className="flex flex-col items-end w-max mx-auto font-mono text-3xl md:text-4xl font-black tracking-widest gap-2">
                              
                              {/* Carry Row */}
                              <div className="flex text-amber-500 opacity-80 pl-8 mb-2 h-10 items-end justify-end">
                                  {Array.from({length: maxVisualLen}).map((_, colIdx) => {
                                      let isCurrentCol = colIdx === activeCol;
                                      let hasFutureCarry = action === 'updateCarry' && colIdx === activeCol - 1 && carry > 0;
                                      let isExistingCarry = colIdx === activeCol && carry > 0 && action !== 'updateCarry';
                                      
                                      let displayVal = " ";
                                      if (hasFutureCarry || isExistingCarry) displayVal = "1";

                                      return (
                                          <div key={`carry-${colIdx}`} className={`w-10 md:w-14 text-center transition-all duration-300 ${hasFutureCarry ? 'animate-in slide-in-from-bottom-4 fade-in font-bold text-amber-600 scale-125' : ''}`}>
                                              {displayVal}
                                          </div>
                                      );
                                  })}
                              </div>

                              {/* String A */}
                              <div className="flex items-center w-full justify-end text-slate-800 h-14">
                                  <span className="text-lg text-slate-400 mr-4 tracking-normal font-sans">A</span>
                                  {aPadded.split('').map((char, colIdx) => {
                                      let isCurrentCol = colIdx === activeCol && !isSuccess;
                                      let isAAction = action === 'addA' && isCurrentCol;

                                      return (
                                          <div key={`a-${colIdx}`} className={`w-10 md:w-14 text-center rounded-lg transition-all duration-300 ${isAAction ? 'bg-sky-100 text-sky-700 ring-2 ring-sky-300 scale-110 z-10' : (isCurrentCol ? 'bg-slate-100 text-slate-900' : '')}`}>
                                              {char}
                                          </div>
                                      );
                                  })}
                              </div>

                              {/* String B */}
                              <div className="flex items-center w-full justify-end text-slate-800 h-14 pb-4 border-b-4 border-slate-300">
                                  <div className="flex items-center justify-between w-full">
                                    <span className="text-lg font-black text-rose-500 mr-4 tracking-normal font-sans"><PlusSquare size={20}/></span>
                                    <div className="flex justify-end">
                                        {bPadded.split('').map((char, colIdx) => {
                                            let isCurrentCol = colIdx === activeCol && !isSuccess;
                                            let isBAction = action === 'addB' && isCurrentCol;

                                            return (
                                                <div key={`b-${colIdx}`} className={`w-10 md:w-14 text-center rounded-lg transition-all duration-300 ${isBAction ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-300 scale-110 z-10' : (isCurrentCol ? 'bg-slate-100 text-slate-900' : '')}`}>
                                                    {char}
                                                </div>
                                            );
                                        })}
                                    </div>
                                  </div>
                              </div>

                              {/* Result Builder */}
                              <div className="flex items-center w-full justify-end text-emerald-600 h-14 pt-4">
                                  {Array.from({length: maxVisualLen}).map((_, colIdx) => {
                                      let isCurrentCol = colIdx === activeCol && !isSuccess;
                                      
                                      // Result bits are added right to left.
                                      // sb currently holds elements left-to-right from extraction order.
                                      // E.g., if we appended '1', '0', sb = "10". It really means rightmost is 1, next is 0.
                                      // To map colIdx (left to right visual) to sb:
                                      // Rightmost visual col = maxVisualLen - 1 -> sb index 0
                                      let sbIndex = maxVisualLen - 1 - colIdx;
                                      let char = sb ? sb[sbIndex] : null;

                                      let isAppendAction = action === 'appendBit' && isCurrentCol;

                                      return (
                                          <div key={`res-${colIdx}`} className={`w-10 md:w-14 text-center rounded-lg transition-all duration-500 ${isAppendAction ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-300 scale-125 z-10 animate-in zoom-in' : (isCurrentCol ? 'bg-slate-100 text-slate-900 opacity-20' : '')}`}>
                                              {char !== null && char !== undefined ? char : (isCurrentCol ? '?' : ' ')}
                                          </div>
                                      );
                                  })}
                              </div>

                              {/* Current Math Explanation Panel (Shows below the grid) */}
                              {!isSuccess && sum !== null && sum !== undefined && (
                                  <div className="w-full flex justify-center mt-8 font-sans tracking-normal">
                                      <div className="bg-slate-100 border-2 border-slate-200 rounded-2xl p-4 flex items-center gap-4 animate-in fade-in zoom-in">
                                          <div className="flex flex-col items-center">
                                              <span className="text-[10px] uppercase text-slate-400 font-black">Sum</span>
                                              <span className="text-2xl font-mono font-black text-slate-800">{sum}</span>
                                          </div>
                                          <div className="h-8 w-px bg-slate-300"></div>
                                          <div className="flex flex-col items-center">
                                              <span className="text-[10px] uppercase text-emerald-500 font-black">Append (Sum % 2)</span>
                                              <span className="text-2xl font-mono font-black text-emerald-600">{sum % 2}</span>
                                          </div>
                                          <div className="h-8 w-px bg-slate-300"></div>
                                          <div className="flex flex-col items-center">
                                              <span className="text-[10px] uppercase text-amber-500 font-black">Carry (Sum / 2)</span>
                                              <span className="text-2xl font-mono font-black text-amber-600">{Math.floor(sum / 2)}</span>
                                          </div>
                                      </div>
                                  </div>
                              )}
                          </div>
                      )}

                      {/* BuiltIn fallback visual */}
                      {selectedApproachId === 'builtIn' && (
                          <div className="flex flex-col items-center justify-center h-full gap-6">
                              <div className="flex items-center gap-4 text-3xl font-mono font-black">
                                  <span className="bg-sky-100 text-sky-800 px-6 py-4 rounded-3xl border-4 border-sky-300 shadow-inner">{a}</span>
                                  <PlusSquare className="text-rose-400" size={32} />
                                  <span className="bg-purple-100 text-purple-800 px-6 py-4 rounded-3xl border-4 border-purple-300 shadow-inner">{b}</span>
                              </div>
                              <ArrowDown className="text-slate-300" size={48} />
                              <div className="bg-emerald-100 text-emerald-800 px-8 py-5 rounded-3xl border-4 border-emerald-400 shadow-xl text-4xl font-mono font-black tracking-widest">
                                  {ans ? ans : '...'}
                              </div>
                          </div>
                      )}

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && selectedApproachId === 'bitByBit' && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600`}>
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">ADDITION COMPLETE</span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Final Binary String: {ans}
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
                <Binary className="text-violet-600"/> Base-2 Arithmetic
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Adding binary strings computationally is identical to the method you learned for decimal (Base-10) numbers in grade school. You align the numbers on the right, add column by column, write down the remainder, and carry over any excess. The only difference is the base limit!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Calculator size={18}/> The Modulo/Division Trick
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            In Base-10, if a column sums to 14, you write down <code>4</code> and carry <code>1</code>. How? <br/><code>14 % 10 = 4</code> (Remainder)<br/><code>14 / 10 = 1</code> (Carry)
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            In Base-2 (Binary), we do the exact same thing, just replacing 10 with 2!<br/><br/>
                            If a column sums to 3 (e.g. 1 + 1 + carry 1), you write down <code>1</code> and carry <code>1</code>.<br/><code>3 % 2 = 1</code> (Remainder)<br/><code>3 / 2 = 1</code> (Carry)
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowLeftRight size={18}/> Reversing the Result
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            Because strings in memory are constructed by appending characters to the end, building a number right-to-left results in a backward string.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>For example, if the answer is <code>"101"</code>, we calculate the rightmost <code>1</code> first, then the <code>0</code>, then the leftmost <code>1</code>.</p>
                            <p>Our StringBuilder would hold <code>"101"</code>. Wait, that's a palindrome.</p>
                            <p>Let's say the answer is <code>"110"</code>. We append <code>0</code>, then <code>1</code>, then <code>1</code>. String is <code>"011"</code>. We MUST call <code>sb.reverse()</code> at the end!</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <ShieldAlert size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-rose-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Why parseInt() or BigInteger is dangerous</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            A massive trap in interviews is using built-in string-to-int conversion methods. 
                            <br/><br/>
                            Look closely at the constraints: <code>a.length &lt;= 10^4</code>.
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-[10px] text-rose-300 space-y-2">
                            <p>// A 32-bit Integer holds up to 32 bits (chars).</p>
                            <p>// A 64-bit Long holds up to 64 bits (chars).</p>
                            <p>// These strings can be 10,000 characters long!</p>
                            <p className="text-white mt-2">Integer.parseInt(a, 2); // WILL CRASH</p>
                            <p className="text-emerald-300 mt-2">Bit-by-Bit addition is required because we handle processing digit by digit, completely bypassing language memory limits for numbers.</p>
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
                        "I solved this problem using a Bit-by-Bit Addition approach, exactly mirroring how binary addition is performed on paper. I initialized two pointers at the ends of both strings and a `carry` variable. Iterating from right to left, I extracted the numeric values of the bits using ASCII character math (`char - '0'`) and accumulated them into a `sum`. To handle Base-2 logic dynamically, I appended `sum % 2` to a StringBuilder, and updated the carry using `sum / 2`. The loop continues as long as there are bits remaining in either string, or if a final carry remains to be appended. Because the answer is built backwards, I reversed the StringBuilder before returning it. This approach guarantees an optimal $O(\max(N, M))$ time complexity and circumvents any 64-bit primitive integer overflow limitations."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Can we pad the strings first?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                You *could* pad the shorter string with leading zeros so both strings are equal length, and then run a simple `for` loop. However, padding requires creating new strings and takes extra pass time. The `while (i &gt;= 0 || j &gt;= 0)` logic gracefully handles strings of different lengths on the fly without any preprocessing overhead.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(max(N, M))</span>
                                <p className="text-[10px] text-slate-500 mt-1">We perform a single pass from right to left. The loop runs exactly as many times as the longest string, plus one potential extra iteration for a final carry.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(max(N, M))</span>
                                <p className="text-[10px] text-slate-500 mt-1">The StringBuilder used to construct the answer requires memory proportional to the length of the result, which is bounded by `max(N, M) + 1`.</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|BigInteger|add|toString|reverse|append|length|charAt|addBinary|carry|sum|a|b)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['a'].includes(part)) return <span key={i} className="text-sky-300 font-bold">{part}</span>;
          if (['b'].includes(part)) return <span key={i} className="text-purple-300 font-bold">{part}</span>;
          if (['carry'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (['sum'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['addBinary', 'length', 'charAt', 'append', 'reverse', 'toString', 'add'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default AddBinaryVisualizer;