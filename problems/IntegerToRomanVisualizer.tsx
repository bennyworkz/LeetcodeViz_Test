import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, Type, ArrowRight, Hash, 
  Building2, Coins, Calculator, AlignLeft
} from 'lucide-react';

const APPROACHES = {
  greedy: {
    id: 'greedy',
    title: '1. Greedy Subtraction',
    subtitle: 'Iterative: O(1) Time, O(1) Space.',
    icon: <Coins size={16} />,
    complexity: 'Time: O(1) | Space: O(1)',
    code: `class Solution {
    public String intToRoman(int num) {
        // Define all Roman symbols and their values, including subtractive forms
        int[] values = {1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1};
        String[] symbols = {"M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"};
        
        StringBuilder sb = new StringBuilder();
        
        // Loop through each symbol, starting from the largest
        for (int i = 0; i < values.length; i++) {
            // While the number is large enough, subtract the value and append symbol
            while (num >= values[i]) {
                num -= values[i];
                sb.append(symbols[i]);
            }
        }
        
        return sb.toString();
    }
}`,
    explanation: "This approach behaves like a greedy cashier giving change. We want to use the largest possible denominations ('M', then 'CM', then 'D', etc.) to minimize the total number of symbols. We create parallel arrays mapping values to their Roman symbols, specifically including the 6 subtractive edge cases (like 900 -> 'CM'). We iterate from largest to smallest. While our remaining number is greater than or equal to the current value, we subtract that value and append the corresponding symbol to our result string."
  },
  hardcoded: {
    id: 'hardcoded',
    title: '2. Hardcoded Math',
    subtitle: 'Optimal: O(1) Time, O(1) Space.',
    icon: <Calculator size={16} />,
    complexity: 'Time: O(1) | Space: O(1)',
    code: `class Solution {
    public String intToRoman(int num) {
        // Precompute all possible configurations for each decimal place
        String[] M = {"", "M", "MM", "MMM"};
        String[] C = {"", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"};
        String[] X = {"", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"};
        String[] I = {"", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"};
        
        // Extract each digit and map it directly
        return M[num / 1000] + 
               C[(num % 1000) / 100] + 
               X[(num % 100) / 10] + 
               I[num % 10];
    }
}`,
    explanation: "Because the input is strictly constrained between 1 and 3999, there is a finite, perfectly predictable set of Roman numerals for each decimal place (thousands, hundreds, tens, ones). We can hardcode 2D arrays mapping the digits 0-9 for each respective place value. Using simple division and modulo arithmetic, we isolate the digit for each place value and directly append the corresponding pre-computed string. This runs in strict O(1) time without any loops."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">12. Integer to Roman</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Seven different symbols represent Roman numerals with the following values:
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 w-max shadow-sm font-mono text-sm grid grid-cols-2 gap-x-8 gap-y-2">
            <div className="font-bold text-slate-500 border-b border-slate-200 pb-1">Symbol</div>
            <div className="font-bold text-slate-500 border-b border-slate-200 pb-1">Value</div>
            <div className="text-violet-700 font-black">I</div><div>1</div>
            <div className="text-violet-700 font-black">V</div><div>5</div>
            <div className="text-violet-700 font-black">X</div><div>10</div>
            <div className="text-violet-700 font-black">L</div><div>50</div>
            <div className="text-violet-700 font-black">C</div><div>100</div>
            <div className="text-violet-700 font-black">D</div><div>500</div>
            <div className="text-violet-700 font-black">M</div><div>1000</div>
        </div>

        <p className="text-lg leading-relaxed">
          Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not <code>IIII</code>. Instead, the number four is written as <code>IV</code>. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as <code>IX</code>. There are six instances where subtraction is used:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-slate-800 marker:text-violet-500 font-medium">
            <li><code>I</code> can be placed before <code>V</code> (5) and <code>X</code> (10) to make 4 and 9.</li>
            <li><code>X</code> can be placed before <code>L</code> (50) and <code>C</code> (100) to make 40 and 90.</li>
            <li><code>C</code> can be placed before <code>D</code> (500) and <code>M</code> (1000) to make 400 and 900.</li>
        </ul>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-violet-500 pl-4 bg-violet-50 py-2 mt-4">
          Given an integer, convert it to a Roman numeral.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> num = 3749</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "MMMDCCXLIX"</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation:</p>
                 <ul className="list-disc pl-4 mt-1">
                     <li>3000 = MMM as 1000 (M) + 1000 (M) + 1000 (M)</li>
                     <li>700 = DCC as 500 (D) + 100 (C) + 100 (C)</li>
                     <li>40 = XL as 50 (L) less 10 (X)</li>
                     <li>9 = IX as 10 (X) less 1 (I)</li>
                     <li>Note: 49 is not 50 less 1 (IL), as 'I' can only be placed before 'V' and 'X'.</li>
                 </ul>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> num = 58</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "LVIII"</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: L = 50, V = 5, III = 3.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> num = 1994</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "MCMXCIV"</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: M = 1000, CM = 900, XC = 90 and IV = 4.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= num &lt;= 3999</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const IntegerToRomanVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('greedy');
  const [numInput, setNumInput] = useState('3749');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let num = parseInt(numInput.trim(), 10);
    if (isNaN(num)) num = 3749;
    
    // UI Safeguards matching constraints
    if (num < 1) num = 1;
    if (num > 3999) num = 3999;

    return { num };
  }, [numInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { num: originalNum } = parsedData;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 3000) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'greedy') {
        let num = originalNum;
        
        const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
        const symbols = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
        
        addStep(
            "Initialization", 
            `Line 3-4: int[] values = {...}; String[] symbols = {...};\n\nWe initialize parallel arrays holding the fundamental Roman numeral values and their specific 6 subtractive edge cases in strictly descending order.`, 
            4, 
            { num, sb: "", i: null, values, symbols, action: 'init' }
        );

        let sb = "";
        addStep(
            "Create StringBuilder", 
            `Line 6: StringBuilder sb = new StringBuilder();\n\nWe create an empty StringBuilder to accumulate our Roman string answer.`, 
            6, 
            { num, sb, i: null, values, symbols, action: 'init' }
        );

        for (let i = 0; i < values.length; i++) {
            addStep(
                "Evaluate Value Map", 
                `Line 9: for (int i = ${i}; i < values.length; i++)\n\nWe are now looking at values[${i}] = ${values[i]} with symbol "${symbols[i]}".`, 
                9, 
                { num, sb, i, values, symbols, action: 'loopOuter' }
            );

            while (num >= values[i]) {
                addStep(
                    "Evaluate Denomination Check", 
                    `Line 11: while (num >= values[${i}])\n\nIs our current number (${num}) >= ${values[i]}?\nYES! This means we can subtract ${values[i]} at least once.`, 
                    11, 
                    { num, sb, i, values, symbols, action: 'evalInnerTrue' }
                );

                num -= values[i];
                addStep(
                    "Subtract Value", 
                    `Line 12: num -= values[${i}];\n\nWe subtract ${values[i]} from num. num becomes ${num}.`, 
                    12, 
                    { num, sb, i, values, symbols, action: 'subtract' }
                );

                sb += symbols[i];
                addStep(
                    "Append Symbol", 
                    `Line 13: sb.append("${symbols[i]}");\n\nWe append "${symbols[i]}" to our building string. Current string is "${sb}".`, 
                    13, 
                    { num, sb, i, values, symbols, action: 'append' }
                );
            }
            
            if (num > 0) {
                 addStep(
                    "Denomination Exhausted", 
                    `Line 11: while (num >= values[${i}])\n\nIs our current number (${num}) >= ${values[i]}?\nNO. We have exhausted the use of "${symbols[i]}". We move to the next smaller denomination.`, 
                    11, 
                    { num, sb, i, values, symbols, action: 'evalInnerFalse' }
                );
            } else {
                 addStep(
                    "Target Reached", 
                    `Line 11: while (num >= values[${i}])\n\nOur current number is exactly 0. We don't need to append any more symbols.`, 
                    11, 
                    { num, sb, i, values, symbols, action: 'evalInnerFalse' }
                );
            }
            
            if (num === 0) {
                break; // Optimization for visualizer
            }
        }
        
        addStep(
            "Return Result", 
            `Line 17: return sb.toString();\n\nWe have completely converted the integer. We return "${sb}".`, 
            17, 
            { num, sb, i: null, values, symbols, action: 'success', isSuccess: true, ans: sb }
        );

    } else if (selectedApproachId === 'hardcoded') {
        let num = originalNum;
        
        addStep(
            "Initialization: Thousands", 
            `Line 4: String[] M = {"", "M", "MM", "MMM"};\n\nBecause the input is bounded to 3999, there are only 4 possible ways to represent the thousands place (0 to 3000).`, 
            4, 
            { num, M: ["", "M", "MM", "MMM"], C: null, X: null, I: null, action: 'init', buildStep: 0 }
        );

        addStep(
            "Initialization: Hundreds", 
            `Line 5: String[] C = {"", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"};\n\nWe precompute all 10 possible configurations for the hundreds place (0 to 900).`, 
            5, 
            { num, M: ["", "M", "MM", "MMM"], C: ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"], X: null, I: null, action: 'init', buildStep: 0 }
        );
        
        addStep(
            "Initialization: Tens", 
            `Line 6: String[] X = {"", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"};\n\nWe precompute all 10 possible configurations for the tens place (0 to 90).`, 
            6, 
            { num, M: ["", "M", "MM", "MMM"], C: ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"], X: ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"], I: null, action: 'init', buildStep: 0 }
        );

        addStep(
            "Initialization: Ones", 
            `Line 7: String[] I = {"", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"};\n\nWe precompute all 10 possible configurations for the ones place (0 to 9).`, 
            7, 
            { num, M: ["", "M", "MM", "MMM"], C: ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"], X: ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"], I: ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"], action: 'init', buildStep: 0 }
        );

        let mIdx = Math.floor(num / 1000);
        let cIdx = Math.floor((num % 1000) / 100);
        let xIdx = Math.floor((num % 100) / 10);
        let iIdx = num % 10;
        
        const M = ["", "M", "MM", "MMM"];
        const C = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"];
        const X = ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"];
        const I = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

        addStep(
            "Calculate Thousands", 
            `Line 10: M[num / 1000]\n\nMath: ${num} / 1000 = ${mIdx}.\nWe lookup index ${mIdx} in the 'M' array -&gt; "${M[mIdx]}".`, 
            10, 
            { num, M, C, X, I, action: 'evalM', mIdx, cIdx: null, xIdx: null, iIdx: null, buildStep: 1, sb: M[mIdx] }
        );

        addStep(
            "Calculate Hundreds", 
            `Line 11: C[(num % 1000) / 100]\n\nMath: (${num} % 1000) / 100 = ${num % 1000} / 100 = ${cIdx}.\nWe lookup index ${cIdx} in the 'C' array -&gt; "${C[cIdx]}".`, 
            11, 
            { num, M, C, X, I, action: 'evalC', mIdx, cIdx, xIdx: null, iIdx: null, buildStep: 2, sb: M[mIdx] + C[cIdx] }
        );

        addStep(
            "Calculate Tens", 
            `Line 12: X[(num % 100) / 10]\n\nMath: (${num} % 100) / 10 = ${num % 100} / 10 = ${xIdx}.\nWe lookup index ${xIdx} in the 'X' array -&gt; "${X[xIdx]}".`, 
            12, 
            { num, M, C, X, I, action: 'evalX', mIdx, cIdx, xIdx, iIdx: null, buildStep: 3, sb: M[mIdx] + C[cIdx] + X[xIdx] }
        );

        addStep(
            "Calculate Ones", 
            `Line 13: I[num % 10]\n\nMath: ${num} % 10 = ${iIdx}.\nWe lookup index ${iIdx} in the 'I' array -&gt; "${I[iIdx]}".`, 
            13, 
            { num, M, C, X, I, action: 'evalI', mIdx, cIdx, xIdx, iIdx, buildStep: 4, sb: M[mIdx] + C[cIdx] + X[xIdx] + I[iIdx] }
        );

        let finalAns = M[mIdx] + C[cIdx] + X[xIdx] + I[iIdx];
        
        addStep(
            "Concatenate and Return", 
            `Line 10-13: return ...;\n\nWe concatenate the exact lookups to form "${finalAns}" and return it. Constant time execution complete.`, 
            10, 
            { num, M, C, X, I, action: 'success', mIdx, cIdx, xIdx, iIdx, buildStep: 5, sb: finalAns, isSuccess: true, ans: finalAns }
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
  const { isSuccess, ans, action, num, sb, i, values, symbols, mIdx, cIdx, xIdx, iIdx, buildStep } = state;
  const { num: originalNum } = parsedData;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Building2 className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Integer to Roman</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 12</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Math / Hash Table / Strings</span>
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
                    
                    {selectedApproachId === 'greedy' ? (
                        <div className="grid grid-cols-2 gap-3">
                            <VariableCard label="Remaining (num)" val={num !== null ? num : "-"} color={num === 0 ? "emerald" : "sky"} active={num !== null} />
                            <VariableCard label="Current Map (i)" val={i !== null && i !== undefined ? `[${values[i]} = ${symbols[i]}]` : "-"} color="purple" active={i !== null && i !== undefined} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-3">
                            <VariableCard label="Thous / 1000" val={mIdx !== null && mIdx !== undefined ? mIdx : "-"} color="sky" active={mIdx !== null && mIdx !== undefined} />
                            <VariableCard label="Hund / 100" val={cIdx !== null && cIdx !== undefined ? cIdx : "-"} color="purple" active={cIdx !== null && cIdx !== undefined} />
                            <VariableCard label="Tens / 10" val={xIdx !== null && xIdx !== undefined ? xIdx : "-"} color="rose" active={xIdx !== null && xIdx !== undefined} />
                            <VariableCard label="Ones / 1" val={iIdx !== null && iIdx !== undefined ? iIdx : "-"} color="amber" active={iIdx !== null && iIdx !== undefined} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Input Integer (num)</label>
                        <input type="number" value={numInput} onChange={(e) => { setNumInput(e.target.value); setCurrentStep(0); }} min="1" max="3999" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="3749" />
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
                      {isSuccess ? <Check size={100}/> : <Coins size={100}/>}
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
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-4 pb-8 gap-8 overflow-y-auto">
                      
                      {/* GREEDY VISUALIZATION */}
                      {selectedApproachId === 'greedy' && (
                          <div className="flex flex-col items-center w-full gap-8">
                              
                              {/* Remaining Num Visualization */}
                              <div className="w-full flex flex-col items-center">
                                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono text-center mb-2">Remaining Value to Convert</span>
                                  <div className="flex items-center gap-4">
                                      <div className={`text-4xl font-black font-mono transition-all duration-500 ${action === 'subtract' ? 'text-rose-500 scale-110 drop-shadow-md' : 'text-slate-800'}`}>
                                          {num}
                                      </div>
                                      {action === 'subtract' && values[i] !== undefined && (
                                          <div className="text-rose-500 font-bold font-mono animate-in slide-in-from-top-2 flex items-center gap-1">
                                              - {values[i]}
                                          </div>
                                      )}
                                  </div>
                              </div>

                              {/* Mapping Array */}
                              <div className="flex gap-2 flex-wrap justify-center max-w-lg p-4 bg-slate-100 rounded-3xl shadow-inner border border-slate-200">
                                  {values?.map((val, idx) => {
                                      let isCurrent = i === idx && !isSuccess;
                                      let isUsed = false; // We could track if it was used, but simple is fine
                                      
                                      let boxClass = "flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-300 w-[52px] h-[64px] relative ";
                                      
                                      if (isCurrent) {
                                          if (action === 'subtract' || action === 'append') {
                                              boxClass += "bg-emerald-100 border-emerald-500 text-emerald-900 scale-110 shadow-md ring-4 ring-emerald-300/30 z-20";
                                          } else {
                                              boxClass += "bg-sky-100 border-sky-400 text-sky-900 scale-105 shadow-md z-10";
                                          }
                                      } else {
                                          boxClass += "bg-white border-slate-300 text-slate-500 opacity-70";
                                      }

                                      return (
                                          <div key={idx} className={boxClass}>
                                              <span className="text-[10px] font-mono text-slate-400">{val}</span>
                                              <span className="text-lg font-black font-serif mt-1 text-slate-800">{symbols[idx]}</span>
                                              {isCurrent && (
                                                  <div className="absolute -bottom-6">
                                                      <ArrowUp className="text-sky-500" size={16} strokeWidth={3}/>
                                                  </div>
                                              )}
                                          </div>
                                      )
                                  })}
                              </div>

                          </div>
                      )}

                      {/* HARDCODED VISUALIZATION */}
                      {selectedApproachId === 'hardcoded' && (
                          <div className="flex flex-col items-center w-full gap-6">
                              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                                  {/* Thousands */}
                                  <div className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col gap-2 ${buildStep === 1 ? 'bg-sky-50 border-sky-400 shadow-md scale-[1.02]' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono">M (Thousands) : num/1000</span>
                                      <div className="flex gap-1 overflow-x-auto pb-1">
                                          {state.M?.map((str, idx) => (
                                              <div key={idx} className={`px-2 py-1 rounded text-xs font-mono font-bold border transition-colors ${mIdx === idx && buildStep >= 1 ? 'bg-sky-500 text-white border-sky-600' : 'bg-white border-slate-300 text-slate-500'}`}>
                                                  {str || '""'}
                                              </div>
                                          ))}
                                      </div>
                                  </div>

                                  {/* Hundreds */}
                                  <div className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col gap-2 ${buildStep === 2 ? 'bg-purple-50 border-purple-400 shadow-md scale-[1.02]' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono">C (Hundreds) : (num%1000)/100</span>
                                      <div className="flex gap-1 overflow-x-auto pb-1">
                                          {state.C?.map((str, idx) => (
                                              <div key={idx} className={`px-2 py-1 rounded text-xs font-mono font-bold border transition-colors ${cIdx === idx && buildStep >= 2 ? 'bg-purple-500 text-white border-purple-600' : 'bg-white border-slate-300 text-slate-500'}`}>
                                                  {str || '""'}
                                              </div>
                                          ))}
                                      </div>
                                  </div>

                                  {/* Tens */}
                                  <div className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col gap-2 ${buildStep === 3 ? 'bg-rose-50 border-rose-400 shadow-md scale-[1.02]' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono">X (Tens) : (num%100)/10</span>
                                      <div className="flex gap-1 overflow-x-auto pb-1">
                                          {state.X?.map((str, idx) => (
                                              <div key={idx} className={`px-2 py-1 rounded text-xs font-mono font-bold border transition-colors ${xIdx === idx && buildStep >= 3 ? 'bg-rose-500 text-white border-rose-600' : 'bg-white border-slate-300 text-slate-500'}`}>
                                                  {str || '""'}
                                              </div>
                                          ))}
                                      </div>
                                  </div>

                                  {/* Ones */}
                                  <div className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col gap-2 ${buildStep === 4 ? 'bg-amber-50 border-amber-400 shadow-md scale-[1.02]' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono">I (Ones) : num%10</span>
                                      <div className="flex gap-1 overflow-x-auto pb-1">
                                          {state.I?.map((str, idx) => (
                                              <div key={idx} className={`px-2 py-1 rounded text-xs font-mono font-bold border transition-colors ${iIdx === idx && buildStep >= 4 ? 'bg-amber-500 text-white border-amber-600' : 'bg-white border-slate-300 text-slate-500'}`}>
                                                  {str || '""'}
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* Result Builder Visualization */}
                      {sb !== undefined && (
                          <div className="w-full flex flex-col items-center mt-auto border-t border-slate-200 pt-8">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono text-center mb-3 flex items-center gap-1"><AlignLeft size={14}/> Constructed String</span>
                              
                              <div className="bg-sky-50 border-2 border-sky-300 text-sky-900 px-8 py-5 rounded-2xl font-serif font-black tracking-[0.3em] text-3xl shadow-inner min-w-[200px] min-h-[80px] text-center flex items-center justify-center relative overflow-hidden break-all">
                                  {sb}
                                  {!isSuccess && action === 'append' && (
                                     <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-r from-transparent to-sky-200 animate-pulse"></div>
                                  )}
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
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">CONVERSION COMPLETE</span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  {originalNum} = "{ans}"
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
                <Building2 className="text-violet-600"/> The Math of Roman Numerals
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Unlike our modern Base-10 (decimal) system which uses place value (position dictates weight), Roman numerals are essentially an additive/subtractive tally system. You just keep adding up the symbols.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Coins size={18}/> The "Cashier" Strategy
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            If you owe someone $14, you don't give them 14 $1 bills. You give them a $10 and four $1s. You act greedy, using the largest denominations first.
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            Roman numerals work exactly the same way. We want to chip away at the total value using the largest possible symbols first to minimize the string length.<br/><br/>
                            The trick is to treat the 6 subtractive forms (IV, IX, XL, XC, CD, CM) as <strong>their own unique denominations</strong>.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Calculator size={18}/> The Modulo Extraction
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            How do we isolate a specific digit from an integer (like the '7' in 3749)? We use Division and Modulo!
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p><strong>Modulo <code>%</code></strong> isolates the right side: <code>3749 % 1000 = 749</code>.</p>
                            <p><strong>Division <code>/</code></strong> truncates the right side: <code>749 / 100 = 7</code>.</p>
                            <p>Therefore, <code>(num % 1000) / 100</code> reliably extracts the Hundreds digit!</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Zap size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-emerald-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Why Hardcoding is O(1) Time & Space</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            Normally, a 2D array matrix implies $O(M \times N)$ space. However, Big-O notation measures how algorithms scale relative to <em>input size</em>. 
                            <br/><br/>
                            In this problem, the input is strictly limited to <code>num &lt; 4000</code>.
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-[10px] text-emerald-300">
                            // Our arrays are exactly size 4, 10, 10, 10.<br/>
                            // They NEVER grow, no matter the input.<br/>
                            // Thus, memory is constant: O(1).<br/><br/>
                            // We do exactly 4 math operations and 4 string concatenations.<br/>
                            // The operations NEVER loop or scale.<br/>
                            // Thus, time is constant: O(1).
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
                        "There are two highly optimal ways to solve this. The first is a Greedy Subtraction approach. I define arrays for the 13 possible Roman 'denominations' (including the subtractive forms like 'CM' for 900) in descending order. I iterate through them, continuously subtracting the value from `num` and appending the symbol until `num` is exhausted. The second approach is Hardcoded Math. Because the input is bounded to 3999, I can perfectly precompute arrays containing the 10 possible strings for the ones, tens, hundreds, and thousands places. Using division and modulo math to extract each decimal digit, I can construct the exact string via direct array lookups. Both run in strict $O(1)$ Time and Space since the input scale is strictly bounded by a constant."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Which one should I code?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                The Greedy approach is generally preferred in interviews. Hardcoding four separate arrays of strings requires memorizing 34 specific string permutations, which is incredibly prone to typos under pressure (e.g., typing "DCC" instead of "DCCC"). The Greedy approach only requires you to remember the 7 base symbols and their 6 obvious subtractive exceptions, making it much cleaner to write on a whiteboard.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Because the input `num` has a strict maximum constraint of 3999, the `while` loop in the Greedy solution will run a fixed maximum number of times (e.g., 3000 requires 3 iterations of 'M'). There is no $N$ that scales to infinity.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">The size of the pre-computed value/symbol arrays is constant (13 pairs). The final resulting string length is also bounded to a maximum of 15 characters (e.g., 3888 -&gt; "MMMDCCCLXXXVIII").</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|num|values|symbols|sb|append|length|M|C|X|I)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['num'].includes(part)) return <span key={i} className="text-sky-300 font-bold">{part}</span>;
          if (['values', 'M', 'C', 'X', 'I'].includes(part)) return <span key={i} className="text-purple-300 font-bold">{part}</span>;
          if (['sb', 'append'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['symbols', 'length'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default IntegerToRomanVisualizer;