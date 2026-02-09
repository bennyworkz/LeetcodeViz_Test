import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, ArrowRight, Hash, 
  Type, Calculator, ShieldAlert, FastForward
} from 'lucide-react';

const APPROACHES = {
  deterministic: {
    id: 'deterministic',
    title: 'Deterministic Parsing',
    subtitle: 'Optimal: O(N) Time, O(1) Space.',
    icon: <FastForward size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int myAtoi(String s) {
        int i = 0;
        int n = s.length();
        
        // 1. Skip leading whitespaces
        while (i < n && s.charAt(i) == ' ') {
            i++;
        }
        
        if (i >= n) return 0;
        
        // 2. Determine sign
        int sign = 1;
        if (s.charAt(i) == '+' || s.charAt(i) == '-') {
            sign = (s.charAt(i) == '-') ? -1 : 1;
            i++;
        }
        
        // 3. Accumulate digits & handle overflow safely
        int result = 0;
        int limit = Integer.MAX_VALUE / 10;
        
        while (i < n && Character.isDigit(s.charAt(i))) {
            int digit = s.charAt(i) - '0';
            
            // Overflow check BEFORE multiplying
            if (result > limit || (result == limit && digit > 7)) {
                return (sign == 1) ? Integer.MAX_VALUE : Integer.MIN_VALUE;
            }
            
            result = result * 10 + digit;
            i++;
        }
        
        return result * sign;
    }
}`,
    explanation: "This is a robust, deterministic parsing approach. We sequentially process the string in distinct phases: ignoring leading spaces, grabbing the sign, and accumulating digits until a non-digit is hit. The most critical part of this algorithm is the overflow check. In Java/C++, simply multiplying `result * 10` might overflow the 32-bit integer limit (2,147,483,647). To prevent this, we divide the max limit by 10 (`214,748,364`). If our current `result` is greater than this limit, we KNOW the next multiplication will overflow. If it equals the limit, we can safely add a digit up to 7 (since max ends in 7). If an overflow is detected, we instantly return the max or min integer bound."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">8. String to Integer (atoi)</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Implement the <code>myAtoi(string s)</code> function, which converts a string to a 32-bit signed integer (similar to C/C++'s <code>atoi</code> function).
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800">
          The algorithm for <code>myAtoi(string s)</code> is as follows:
        </p>

        <ul className="list-decimal pl-6 space-y-2 text-slate-800 marker:text-violet-500 font-medium">
            <li><strong>Whitespace:</strong> Ignore any leading whitespace (<code>" "</code>).</li>
            <li><strong>Sign:</strong> Determine the sign by checking if the next character is <code>'-'</code> or <code>'+'</code>. Assume positive if neither is present.</li>
            <li><strong>Conversion:</strong> Read in next the characters until the next non-digit character or the end of the input is reached. The rest of the string is ignored.</li>
            <li><strong>Rounding:</strong> If the integer is out of the 32-bit signed integer range <code>[-2<sup>31</sup>, 2<sup>31</sup> - 1]</code>, then clamp the integer so that it remains in the range. Specifically, integers less than <code>-2<sup>31</sup></code> should be clamped to <code>-2<sup>31</sup></code>, and integers greater than <code>2<sup>31</sup> - 1</code> should be clamped to <code>2<sup>31</sup> - 1</code>.</li>
        </ul>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "42"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 42</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: The parsed integer is 42. Since 42 is in the range [-231, 231 - 1], the final result is 42.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "   -042"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> -42</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: Step 1: "   -042" (leads spaces are read and ignored). Step 2: sign is '-', Step 3: Read "042", giving 42.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "1337c0d3"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 1337</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: Parsing stops at "c" because it is a non-digit character.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>0 &lt;= s.length &lt;= 200</code></li>
              <li><code>s</code> consists of English letters, digits, <code>' '</code>, <code>'+'</code>, <code>'-'</code>, and <code>'.'</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const AtoiVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('deterministic');
  const [sInput, setSInput] = useState('   -042');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let s = sInput;
    if (s.length > 20) s = s.substring(0, 20); // UI cap
    return { s };
  }, [sInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { s } = parsedData;
    const n = s.length;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'deterministic') {
        let i = 0;
        let sign = 1;
        let result = 0;
        let limit = 214748364; // Integer.MAX_VALUE / 10
        const INT_MAX = 2147483647;
        const INT_MIN = -2147483648;

        addStep(
            "Initialization", 
            `Line 3-4: int i = 0; int n = ${n};\n\nWe initialize our string pointer 'i' to 0 and record the string length.`, 
            4, 
            { i, n, sign: null, result: null, limit, action: 'init' }
        );

        // 1. Skip leading whitespaces
        let iter = 0;
        while (i < n && s.charAt(i) === ' ') {
            if (iter++ > 100) break;
            
            addStep(
                "Evaluate Whitespace Loop", 
                `Line 7: while (i < n && s.charAt(${i}) == ' ')\n\nThe character is a space. We continue scanning to the right.`, 
                7, 
                { i, n, sign: null, result: null, limit, action: 'loopSpace' }
            );
            i++;
            addStep(
                "Skip Whitespace", 
                `Line 8: i++;\n\n'i' is incremented to ${i}.`, 
                8, 
                { i, n, sign: null, result: null, limit, action: 'incSpace' }
            );
        }

        addStep(
            "Whitespace Skipped / Check Bounds", 
            `Line 11: if (i >= n)\n\nWe successfully passed any leading whitespace. Have we exhausted the string? ${i >= n ? 'Yes. String was entirely empty or spaces.' : 'No, we still have characters to process.'}`, 
            11, 
            { i, n, sign: null, result: null, limit, action: 'checkBounds' }
        );

        if (i >= n) {
            addStep(
                "Return Early (Empty)", 
                `Line 11: return 0;\n\nThe string contained no valid numbers or signs. Returning 0.`, 
                11, 
                { i, n, sign: null, result: null, limit, action: 'success', isSuccess: true, ans: 0 }
            );
            return steps;
        }

        // 2. Determine sign
        addStep(
            "Initialize Sign Flag", 
            `Line 14: int sign = 1;\n\nWe default the sign to positive (1).`, 
            14, 
            { i, n, sign, result: null, limit, action: 'initSign' }
        );

        addStep(
            "Evaluate Sign Character", 
            `Line 15: if (s.charAt(${i}) == '+' || s.charAt(${i}) == '-')\n\nWe check if the immediate character '${s.charAt(i)}' is an explicit sign modifier.`, 
            15, 
            { i, n, sign, result: null, limit, action: 'evalSign' }
        );

        if (s.charAt(i) === '+' || s.charAt(i) === '-') {
            sign = s.charAt(i) === '-' ? -1 : 1;
            addStep(
                "Capture Sign", 
                `Line 16: sign = (s.charAt(${i}) == '-') ? -1 : 1;\n\nExplicit sign found! Setting sign to ${sign}.`, 
                16, 
                { i, n, sign, result: null, limit, action: 'setSign' }
            );
            i++;
            addStep(
                "Advance Pointer", 
                `Line 17: i++;\n\nWe process the sign character and move the pointer 'i' to ${i}.`, 
                17, 
                { i, n, sign, result: null, limit, action: 'incSign' }
            );
        }

        // 3. Accumulate digits
        result = 0;
        addStep(
            "Initialize Result Accumulator", 
            `Line 21: int result = 0;\n\nWe initialize 'result' to begin building our integer.`, 
            21, 
            { i, n, sign, result, limit, action: 'initResult' }
        );

        iter = 0;
        while (i < n && s.charAt(i) >= '0' && s.charAt(i) <= '9') {
            if (iter++ > 100) break;

            addStep(
                "Evaluate Digit Loop", 
                `Line 24: while (... && Character.isDigit('${s.charAt(i)}'))\n\nThe character '${s.charAt(i)}' is a valid digit. We proceed to extract and accumulate it.`, 
                24, 
                { i, n, sign, result, limit, action: 'loopDigit' }
            );

            let digit = s.charCodeAt(i) - '0'.charCodeAt(0);
            
            addStep(
                "Extract Integer Digit", 
                `Line 25: int digit = s.charAt(${i}) - '0';\n\nWe convert the char '${s.charAt(i)}' into an actual integer by subtracting the ASCII value of '0'.\ndigit = ${digit}.`, 
                25, 
                { i, n, sign, result, limit, action: 'extractDigit', digit }
            );

            addStep(
                "Overflow Pre-Check", 
                `Line 28: if (result > limit || (result == limit && digit > 7))\n\nOur limit is 214748364. Our current result is ${result}. We must ensure that multiplying ${result} * 10 and adding ${digit} won't blow past a 32-bit integer!`, 
                28, 
                { i, n, sign, result, limit, action: 'checkOverflow', digit }
            );

            if (result > limit || (result === limit && digit > 7)) {
                let ans = sign === 1 ? INT_MAX : INT_MIN;
                addStep(
                    "Overflow Detected! (Clamp)", 
                    `Line 29: return (sign == 1) ? Integer.MAX_VALUE : Integer.MIN_VALUE;\n\nAdding this digit WILL trigger a massive integer overflow. The problem rules state we must clamp the answer to the 32-bit boundary.\nReturning ${ans}.`, 
                    29, 
                    { i, n, sign, result, limit, action: 'success', isSuccess: true, ans, overflow: true }
                );
                return steps;
            }

            let oldResult = result;
            result = result * 10 + digit;

            addStep(
                "Accumulate Result", 
                `Line 32: result = result * 10 + digit;\n\nWe shift the current result left by 1 digit (x10), and add the new digit.\nresult = ${oldResult} * 10 + ${digit} = ${result}.`, 
                32, 
                { i, n, sign, result, limit, action: 'accumulate', digit, oldResult }
            );

            i++;
            addStep(
                "Advance Pointer", 
                `Line 33: i++;\n\n'i' is incremented to ${i} to examine the next character.`, 
                33, 
                { i, n, sign, result, limit, action: 'incDigit', digit }
            );
        }

        addStep(
            "Loop Terminates", 
            `Line 24: Loop ends.\n\nWe hit the end of the string, or we encountered a non-digit character (like a letter, space, or punctuation). The extraction phase stops completely here!`, 
            24, 
            { i, n, sign, result, limit, action: 'endLoop' }
        );

        let finalAns = result * sign;
        addStep(
            "Apply Sign & Return", 
            `Line 36: return result * sign;\n\nWe apply our tracked sign (${sign}) to the final accumulated magnitude (${result}).\nFinal Answer = ${finalAns}.`, 
            36, 
            { i, n, sign, result, limit, action: 'success', isSuccess: true, ans: finalAns }
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
  const { isSuccess, ans, action, i: activeI, sign, result, digit, overflow, oldResult } = state;
  const { s } = parsedData;

  const charArray = s.split('');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Type className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">String to Integer</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 8</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Strings / Math / State Machine</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action === 'checkOverflow' || overflow ? 'bg-rose-500/20 border-rose-500' : 'bg-violet-500/20 border-violet-500')}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'checkOverflow' || overflow ? 'rose' : 'violet'} />
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
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="Index (i)" val={activeI !== null && activeI !== undefined ? activeI : "-"} color="purple" active={activeI !== null && activeI !== undefined} />
                        <VariableCard label="Char" val={activeI !== null && activeI !== undefined && activeI < charArray.length ? `'${charArray[activeI]}'` : "-"} color="sky" active={activeI !== null && activeI !== undefined && activeI < charArray.length} />
                        <VariableCard label="Sign" val={sign !== null && sign !== undefined ? (sign === 1 ? "+1" : "-1") : "-"} color={sign === 1 ? "emerald" : "rose"} active={sign !== null && sign !== undefined} />
                        <VariableCard label="Result" val={result !== null && result !== undefined ? result : "-"} color="amber" active={result !== null && result !== undefined} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Input String (s)</label>
                        <input type="text" value={sInput} onChange={(e) => { setSInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-[0.1em] font-bold" placeholder="   -042" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action === 'checkOverflow' || overflow ? 'bg-rose-900 border-rose-800' : 'bg-slate-900 border-slate-800')}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : <Type size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action === 'checkOverflow' || overflow ? 'text-rose-400' : 'text-violet-400')}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'checkOverflow' || overflow ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30')}`}>Line {cur.line}</div>
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
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-8 pb-8 gap-10 overflow-y-auto overflow-x-auto">
                      
                      {/* String Processing Tape */}
                      <div className="flex flex-col items-center w-full max-w-full relative">
                          
                          <div className="flex gap-2 p-4 bg-slate-100 border border-slate-200 rounded-3xl shadow-inner min-w-max mx-auto">
                              {charArray.map((char, idx) => {
                                  let isCurrent = activeI === idx && !isSuccess;
                                  let isPast = activeI !== null && idx < activeI;
                                  
                                  // Determine semantic type for color coding
                                  let isSpace = char === ' ';
                                  let isSign = char === '+' || char === '-';
                                  let isDigitChar = char >= '0' && char <= '9';
                                  let isInvalid = !isSpace && !isSign && !isDigitChar;

                                  let boxClass = "relative w-12 h-14 md:w-14 md:h-16 flex items-center justify-center rounded-2xl border-4 font-mono font-black text-xl md:text-2xl transition-all duration-300 shrink-0 ";
                                  let textClass = "text-slate-700";

                                  if (isCurrent) {
                                      boxClass += "bg-sky-100 border-sky-500 scale-110 shadow-lg ring-4 ring-sky-300/30 z-20";
                                      textClass = "text-sky-900";
                                      if (action === 'loopSpace') {
                                          boxClass += " animate-pulse";
                                      } else if (action === 'evalSign') {
                                          boxClass += " border-purple-500 bg-purple-100 ring-purple-300/30";
                                          textClass = "text-purple-900";
                                      } else if (action === 'extractDigit' || action === 'loopDigit' || action === 'accumulate') {
                                          boxClass += " border-amber-500 bg-amber-100 ring-amber-300/30";
                                          textClass = "text-amber-900";
                                      } else if (isInvalid) {
                                          boxClass += " border-rose-500 bg-rose-100 ring-rose-300/30";
                                          textClass = "text-rose-900";
                                      }
                                  } else if (isPast) {
                                      // Faded style for processed characters
                                      boxClass += "bg-white border-slate-200 shadow-sm opacity-60";
                                      if (isSpace) textClass = "text-slate-300";
                                      else if (isSign) textClass = "text-purple-400";
                                      else if (isDigitChar) textClass = "text-amber-500";
                                      else textClass = "text-rose-400";
                                  } else {
                                      boxClass += "bg-white border-slate-300 shadow-sm";
                                      if (isSpace) textClass = "text-slate-300"; // Lighten future spaces
                                  }

                                  return (
                                      <div key={idx} className="flex flex-col items-center relative">
                                          {/* Pointer Indicator */}
                                          <div className="h-10 w-full flex items-end justify-center mb-2 relative z-30">
                                              {isCurrent && (
                                                  <div className={`flex flex-col items-center animate-in slide-in-from-top-2`}>
                                                      <span className="text-[10px] font-black font-mono tracking-widest text-sky-700 bg-sky-100 px-2 py-0.5 rounded border border-sky-300 shadow-sm mb-1">i</span>
                                                      <ArrowDown size={18} className="text-sky-500" strokeWidth={3}/>
                                                  </div>
                                              )}
                                          </div>

                                          <div className={boxClass}>
                                              <span className={textClass}>{isSpace ? '_' : char}</span>
                                          </div>
                                          
                                          <div className="text-[10px] text-slate-400 font-mono mt-2">{idx}</div>
                                      </div>
                                  );
                              })}
                              {charArray.length === 0 && <span className="text-slate-400 italic font-mono text-sm px-4">Empty String</span>}
                          </div>
                      </div>

                      {/* Math & Accumulation Box */}
                      {result !== null && result !== undefined && (
                          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 mt-4">
                              
                              {/* Overflow Danger Box */}
                              <div className={`p-6 rounded-3xl border-4 transition-all duration-500 flex flex-col items-center ${action === 'checkOverflow' || overflow ? 'bg-rose-50 border-rose-400 shadow-lg scale-105' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono flex items-center gap-1 mb-2"><ShieldAlert size={14}/> Overflow Barrier</span>
                                  <div className="flex flex-col items-center">
                                      <span className="text-[10px] text-slate-500">MAX_VALUE / 10 =</span>
                                      <span className="text-xl font-black font-mono text-rose-600 tracking-widest">214748364</span>
                                  </div>
                              </div>

                              <ArrowRight className="text-slate-300 hidden md:block" size={32} />

                              {/* Accumulator Box */}
                              <div className={`p-6 rounded-3xl border-4 transition-all duration-500 flex flex-col items-center min-w-[200px] ${action === 'accumulate' ? 'bg-amber-100 border-amber-400 shadow-lg scale-110 ring-4 ring-amber-300/30' : 'bg-white border-slate-200 shadow-sm'}`}>
                                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono flex items-center gap-1 mb-2"><Calculator size={14}/> Current Integer Builder</span>
                                  
                                  <div className="flex items-center gap-2">
                                      {sign === -1 && <span className="text-3xl font-black text-rose-500">-</span>}
                                      <span className="text-4xl font-black font-mono text-slate-800">{result}</span>
                                  </div>

                                  {action === 'accumulate' && (
                                      <div className="text-xs font-mono font-bold text-amber-700 bg-amber-200 px-3 py-1 rounded-lg mt-3 animate-in slide-in-from-bottom-2">
                                          {oldResult} × 10 + {digit}
                                      </div>
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
                                  Final Return Value: {ans}
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
                <FastForward className="text-violet-600"/> Deterministic State Machines
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                String parsing algorithms often follow a strict "State Machine" pattern. Because we read characters sequentially from left to right, we transition through distinct logical states: Whitespace Phase $\rightarrow$ Sign Phase $\rightarrow$ Digit Extraction Phase. If anything violates the current phase, parsing immediately terminates.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Type size={18}/> Character Math
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            How do we convert a character like <code>'7'</code> into the integer <code>7</code>?
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            We use the inherent ASCII values of characters! The character <code>'0'</code> has an ASCII value of 48. The character <code>'7'</code> is 55. <br/><br/>
                            By subtracting the base character: <code>'7' - '0'</code> $\rightarrow 55 - 48 = 7$. This is a universal trick across almost all C-based languages (C, C++, Java).
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Calculator size={18}/> Accumulating Digits
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            When building a number from left to right, every new digit pushes the existing numbers into a higher magnitude place value.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>Formula: <code>result = (result * 10) + digit</code>.</p>
                            <p>String: "42"</p>
                            <p>1. Result = 0 $\times$ 10 + 4 = <strong>4</strong>.</p>
                            <p>2. Result = 4 $\times$ 10 + 2 = <strong>42</strong>.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <ShieldAlert size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-rose-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">The 32-Bit Overflow Trap</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            The hardest part of this problem is that <code>result * 10</code> can overflow a standard 32-bit integer <em>before</em> you have a chance to return it! You must detect the overflow BEFORE performing the multiplication.
                            <br/><br/>
                            <code>MAX_VALUE = 2147483647</code><br/>
                            <code>LIMIT = MAX_VALUE / 10 = 214748364</code>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-[10px] text-rose-300 space-y-2">
                            <p>// Case 1: Result &gt; LIMIT</p>
                            <p>If result is 214748365, multiplying by 10 makes it ~2.14 billion which overflows!</p>
                            <p>// Case 2: Result == LIMIT</p>
                            <p>If result is exactly 214748364, multiplying by 10 gives 2147483640. If the next digit is 8 or 9, adding it makes 2147483648, which overflows!</p>
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
                        "I used a Deterministic Parsing approach to build the integer sequentially. First, I use a `while` loop to safely skip any leading whitespaces. Next, I check for an explicit sign character and store it as a 1 or -1 multiplier. Finally, I enter a loop to extract digits using character ASCII math (`s.charAt(i) - '0'`). The most critical consideration is integer overflow: because I am accumulating the integer using `result = result * 10 + digit`, I must ensure that this operation won't exceed standard 32-bit limits. I accomplish this by dividing `Integer.MAX_VALUE` by 10 to establish a safe boundary. If my current result strictly exceeds this boundary, or if it equals the boundary and the incoming digit exceeds 7, I immediately clamp the result to the 32-bit `MAX` or `MIN` and return. This parses the string in $O(N)$ Time and strictly $O(1)$ Space."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Why not use a 64-bit 'long'?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Many candidates cheat by accumulating the result into a <code>long</code> variable, and then checking <code>if (result &gt; Integer.MAX_VALUE)</code>. While this passes LeetCode, strict interviewers will penalize this! The problem inherently assumes a 32-bit environment where a 64-bit integer simply does not exist. You must demonstrate how to check for overflow using pure math within 32-bit constraints.
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
                                <p className="text-[10px] text-slate-500 mt-1">We perform a single, sequential pass through the string of length N. We touch each character exactly once.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We only declare primitive variables (`i`, `sign`, `result`, `limit`). We do not instantiate any string builders, arrays, or auxiliary data structures.</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|Character|isDigit|MAX_VALUE|MIN_VALUE|myAtoi|charAt|length|result|limit|sign|digit)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math', 'Arrays', 'ArrayList', 'ListNode', 'TreeNode', 'Stack', 'StringBuilder', 'Character'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['result'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['sign'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (['limit', 'MAX_VALUE', 'MIN_VALUE'].includes(part)) return <span key={i} className="text-rose-400 font-bold">{part}</span>;
          if (['myAtoi', 'charAt', 'length', 'isDigit'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default AtoiVisualizer;