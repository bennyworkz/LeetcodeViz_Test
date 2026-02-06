import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, PlusSquare, Binary, Calculator, ShieldAlert,
  ArrowLeftRight, DivideSquare, MinusSquare, FastForward
} from 'lucide-react';

const APPROACHES = {
  bitwise: {
    id: 'bitwise',
    title: '1. Bitwise Shift (Optimal)',
    subtitle: 'Optimal: O(log² N) Time, O(1) Space.',
    icon: <FastForward size={16} />,
    complexity: 'Time: O(log² N) | Space: O(1)',
    code: `class Solution {
    public int divide(int dividend, int divisor) {
        // 1. Handle Overflow Edge Case
        if (dividend == Integer.MIN_VALUE && divisor == -1) {
            return Integer.MAX_VALUE;
        }
        
        // 2. Determine Sign
        int sign = (dividend < 0) ^ (divisor < 0) ? -1 : 1;
        
        // 3. Convert to positive longs to prevent overflow
        long dvd = Math.abs((long) dividend);
        long dvs = Math.abs((long) divisor);
        int quotient = 0;
        
        // 4. Repeatedly subtract the largest possible shifted divisor
        while (dvd >= dvs) {
            long temp = dvs;
            long multiple = 1;
            
            // Double the divisor until it's bigger than the remaining dividend
            while (dvd >= (temp << 1)) {
                temp <<= 1;
                multiple <<= 1;
            }
            
            dvd -= temp;
            quotient += multiple;
        }
        
        return sign == 1 ? quotient : -quotient;
    }
}`,
    explanation: "Because we cannot use multiplication or division, the naive approach is to subtract the divisor from the dividend repeatedly (e.g., 10 - 3 - 3 - 3). However, if the dividend is 2 Billion and the divisor is 1, this takes 2 Billion operations (O(N) time) and will result in a Time Limit Exceeded error. The optimal solution uses Bitwise Left Shifts (<< 1), which essentially multiplies a number by 2. We take our divisor and repeatedly double it (3 -> 6 -> 12...) until it exceeds the dividend. Then, we subtract that massive chunk all at once and add the corresponding multiple to our quotient. We repeat this for the remainder. This exponentially speeds up the process to O(log² N)!"
  },
  naive: {
    id: 'naive',
    title: '2. Repeated Subtraction',
    subtitle: 'Naive: O(N) Time (Will TLE).',
    icon: <MinusSquare size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int divide(int dividend, int divisor) {
        if (dividend == Integer.MIN_VALUE && divisor == -1) {
            return Integer.MAX_VALUE;
        }
        
        int sign = (dividend < 0) ^ (divisor < 0) ? -1 : 1;
        long dvd = Math.abs((long) dividend);
        long dvs = Math.abs((long) divisor);
        int quotient = 0;
        
        // Too slow! Will TLE on large inputs.
        while (dvd >= dvs) {
            dvd -= dvs;
            quotient++;
        }
        
        return sign == 1 ? quotient : -quotient;
    }
}`,
    explanation: "This is the most intuitive approach: division is simply repeated subtraction. We convert everything to positive `long` values to avoid negative number weirdness and standard overflow. Then, we run a `while` loop, subtracting the divisor from the dividend one at a time while incrementing the quotient. While logically correct, this algorithm is fatally slow. If the inputs are `dividend = 2147483647` and `divisor = 1`, this loop runs 2 billion times. LeetCode will reject this with a Time Limit Exceeded (TLE) error."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">29. Divide Two Integers</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given two integers <code>dividend</code> and <code>divisor</code>, divide two integers <strong>without</strong> using multiplication, division, and mod operator.
        </p>
        <p className="text-lg leading-relaxed">
          The integer division should truncate toward zero, which means losing its fractional part. For example, <code>8.345</code> would be truncated to <code>8</code>, and <code>-2.7335</code> would be truncated to <code>-2</code>.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-rose-500 pl-4 bg-rose-50 py-2 mt-4">
          Return the quotient after dividing <code>dividend</code> by <code>divisor</code>.
          <br/><br/>
          <span className="text-sm font-normal text-rose-700"><strong>Note:</strong> Assume we are dealing with an environment that could only store integers within the 32-bit signed integer range: <code>[-2<sup>31</sup>, 2<sup>31</sup> - 1]</code>. For this problem, if the quotient is strictly greater than <code>2<sup>31</sup> - 1</code>, then return <code>2<sup>31</sup> - 1</code>, and if the quotient is strictly less than <code>-2<sup>31</sup></code>, then return <code>-2<sup>31</sup></code>.</span>
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> dividend = 10, divisor = 3</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 3</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: 10/3 = 3.33333.. which is truncated to 3.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> dividend = 7, divisor = -3</p>
              <p><span className="text-slate-400 font-bold">Output:</span> -2</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: 7/-3 = -2.33333.. which is truncated to -2.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>-2<sup>31</sup> &lt;= dividend, divisor &lt;= 2<sup>31</sup> - 1</code></li>
              <li><code>divisor != 0</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const DivideTwoIntegersVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('bitwise');
  const [dividendInput, setDividendInput] = useState('10');
  const [divisorInput, setDivisorInput] = useState('3');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let dvd = parseInt(dividendInput.trim(), 10);
    let dvs = parseInt(divisorInput.trim(), 10);
    
    if (isNaN(dvd)) dvd = 10;
    if (isNaN(dvs) || dvs === 0) dvs = 3; // Prevent div by zero
    
    // UI Safeguards to prevent massive loops freezing browser in naive approach
    if (selectedApproachId === 'naive') {
        if (Math.abs(dvd) > 1000) dvd = dvd > 0 ? 1000 : -1000;
    }

    return { dvd, dvs };
  }, [dividendInput, divisorInput, selectedApproachId]);

  const trace = useMemo(() => {
    const steps = [];
    const { dvd: rawDvd, dvs: rawDvs } = parsedData;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    const INT_MAX = 2147483647;
    const INT_MIN = -2147483648;

    addStep(
        "Initialization", 
        `Start processing dividend: ${rawDvd}, divisor: ${rawDvs}`, 
        2, 
        { rawDvd, rawDvs, action: 'init' }
    );

    addStep(
        "Evaluate Edge Cases", 
        `Line 3: if (dividend == Integer.MIN_VALUE && divisor == -1)\n\nWe check for the strict overflow edge case. If we divide -2147483648 by -1, the math result is 2147483648, which exceeds the 32-bit positive limit!`, 
        3, 
        { rawDvd, rawDvs, action: 'evalEdge' }
    );

    if (rawDvd === INT_MIN && rawDvs === -1) {
        addStep(
            "Overflow Handled", 
            `Line 4: return Integer.MAX_VALUE;\n\nOverflow detected. The rules state we must return Integer.MAX_VALUE (${INT_MAX}).`, 
            4, 
            { rawDvd, rawDvs, action: 'success', isSuccess: true, ans: INT_MAX }
        );
        return steps;
    }

    // Determine sign using XOR
    let isDvdNeg = rawDvd < 0;
    let isDvsNeg = rawDvs < 0;
    let sign = (isDvdNeg !== isDvsNeg) ? -1 : 1;

    addStep(
        "Determine Final Sign", 
        `Line 8: int sign = (dividend < 0) ^ (divisor < 0) ? -1 : 1;\n\nWe use XOR to determine the sign. If the signs are different, the result is negative. Otherwise, positive.\nSign = ${sign}.`, 
        8, 
        { rawDvd, rawDvs, sign, action: 'evalSign' }
    );

    // Convert to positive longs
    let dvd = Math.abs(rawDvd);
    let dvs = Math.abs(rawDvs);
    let quotient = 0;

    addStep(
        "Convert to Absolute Values", 
        `Line 11-13: long dvd = Math.abs(...);\n\nWe convert both numbers to absolute values and store them as 64-bit 'longs' to completely prevent overflow during manipulation.\ndvd = ${dvd}, dvs = ${dvs}, quotient = 0.`, 
        12, 
        { rawDvd, rawDvs, sign, dvd, dvs, quotient, action: 'initVars' }
    );

    let originalDvd = dvd; // For visual scaling

    if (selectedApproachId === 'bitwise') {
        let iter = 0;
        
        while (dvd >= dvs) {
            if (iter++ > 100) break;

            addStep(
                "Outer Loop (Chunk Subtraction)", 
                `Line 16: while (dvd >= dvs)\n\nThe remaining dividend (${dvd}) is still greater than or equal to the divisor (${dvs}). We need to subtract more chunks.`, 
                16, 
                { rawDvd, rawDvs, sign, dvd, dvs, quotient, originalDvd, action: 'outerLoop' }
            );

            let temp = dvs;
            let multiple = 1;

            addStep(
                "Initialize Chunk Trackers", 
                `Line 17-18: long temp = dvs; long multiple = 1;\n\nWe prepare to find the LARGEST multiple of the divisor we can subtract at once. We start with 1x multiplier.`, 
                18, 
                { rawDvd, rawDvs, sign, dvd, dvs, quotient, temp, multiple, originalDvd, action: 'initChunk' }
            );

            let innerIter = 0;
            // Shift operations
            while (dvd >= (temp * 2)) {
                if (innerIter++ > 31) break;

                addStep(
                    "Evaluate Inner Loop (Doubling)", 
                    `Line 21: while (dvd >= (temp << 1))\n\nCan we double the current chunk (${temp} -> ${temp * 2}) and still fit inside the remaining dividend (${dvd})?\nTRUE! Let's double it.`, 
                    21, 
                    { rawDvd, rawDvs, sign, dvd, dvs, quotient, temp, multiple, originalDvd, action: 'evalInnerTrue' }
                );

                temp *= 2; // Simulated shift left
                multiple *= 2;

                addStep(
                    "Bitwise Shift (Multiply by 2)", 
                    `Line 22-23: temp <<= 1; multiple <<= 1;\n\nWe shifted left! temp is now ${temp}. multiple is now ${multiple}.`, 
                    23, 
                    { rawDvd, rawDvs, sign, dvd, dvs, quotient, temp, multiple, originalDvd, action: 'shiftInner' }
                );
            }

            addStep(
                "Inner Loop Terminates", 
                `Line 21: while (dvd >= (temp << 1))\n\nIf we double temp again (${temp * 2}), it exceeds the remaining dividend (${dvd}). We stop shifting.\nWe found our max chunk!`, 
                21, 
                { rawDvd, rawDvs, sign, dvd, dvs, quotient, temp, multiple, originalDvd, action: 'evalInnerFalse' }
            );

            let oldDvd = dvd;
            dvd -= temp;
            quotient += multiple;

            addStep(
                "Execute Subtraction", 
                `Line 26-27: dvd -= temp; quotient += multiple;\n\nWe aggressively subtract the massive chunk (${temp}) from dividend. Remainder = ${dvd}.\nWe add ${multiple} to our quotient. Total Quotient = ${quotient}.`, 
                27, 
                { rawDvd, rawDvs, sign, dvd, dvs, quotient, temp, multiple, originalDvd, oldDvd, action: 'subtract' }
            );
        }

        addStep(
            "Outer Loop Terminates", 
            `Line 16: while (dvd >= dvs)\n\nThe remaining dividend (${dvd}) is strictly less than the divisor (${dvs}). We cannot divide anymore. The math is done.`, 
            16, 
            { rawDvd, rawDvs, sign, dvd, dvs, quotient, originalDvd, action: 'endOuter' }
        );

    } else if (selectedApproachId === 'naive') {
        
        let iter = 0;
        while (dvd >= dvs) {
            if (iter++ > 2000) {
                 addStep(
                    "Execution Halted (TLE Safeguard)", 
                    `The naive approach is taking too long. This loop would iterate millions of times. Visualizer halted to prevent freezing.`, 
                    14, 
                    { rawDvd, rawDvs, sign, dvd, dvs, quotient, originalDvd, action: 'tle' }
                );
                break;
            }

            let oldDvd = dvd;
            dvd -= dvs;
            quotient++;

            addStep(
                "Execute Naive Subtraction", 
                `Line 14-15: dvd -= dvs; quotient++;\n\nWe subtract ${dvs} from the dividend. Remainder = ${dvd}. We increment the quotient to ${quotient}.`, 
                15, 
                { rawDvd, rawDvs, sign, dvd, dvs, quotient, temp: dvs, multiple: 1, originalDvd, oldDvd, action: 'subtract' }
            );
        }

        addStep(
            "Loop Terminates", 
            `Line 13: while (dvd >= dvs)\n\nThe remaining dividend (${dvd}) is less than the divisor. Loop ends.`, 
            13, 
            { rawDvd, rawDvs, sign, dvd, dvs, quotient, originalDvd, action: 'endOuter' }
        );
    }

    let finalAns = sign === 1 ? quotient : -quotient;

    // Final boundary checks per LC spec
    if (finalAns > INT_MAX) finalAns = INT_MAX;
    if (finalAns < INT_MIN) finalAns = INT_MIN;

    addStep(
        "Apply Sign & Return", 
        `Line 30: return sign == 1 ? quotient : -quotient;\n\nWe apply our tracked sign (${sign}) to the final quotient. Result is ${finalAns}.`, 
        30, 
        { rawDvd, rawDvs, sign, dvd, dvs, quotient, originalDvd, action: 'success', isSuccess: true, ans: finalAns }
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
  const { isSuccess, ans, action, rawDvd, rawDvs, sign, dvd, dvs, quotient, temp, multiple, originalDvd, oldDvd } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <DivideSquare className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Divide Two Integers</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 29</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Math / Bit Manipulation</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action.includes('subtract') ? 'bg-amber-500/20 border-amber-500' : 'bg-violet-500/20 border-violet-500')}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action.includes('subtract') ? 'amber' : 'violet'} />
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
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="Rem. Dvd" val={dvd !== null && dvd !== undefined ? dvd : "-"} color="sky" active={dvd !== null && dvd !== undefined} />
                        <VariableCard label="Divisor" val={dvs !== null && dvs !== undefined ? dvs : "-"} color="slate" active={dvs !== null && dvs !== undefined} />
                        <VariableCard label="Quotient" val={quotient !== null && quotient !== undefined ? quotient : "-"} color="emerald" active={quotient !== null && quotient !== undefined} />
                        <VariableCard label="Target Sign" val={sign !== null && sign !== undefined ? (sign === 1 ? "+" : "-") : "-"} color={sign === -1 ? "rose" : "emerald"} active={sign !== null && sign !== undefined} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Dividend</label>
                        <input type="number" value={dividendInput} onChange={(e) => { setDividendInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner font-bold" placeholder="10" />
                    </div>
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Divisor</label>
                        <input type="number" value={divisorInput} onChange={(e) => { setDivisorInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner font-bold" placeholder="3" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action.includes('subtract') ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800')}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : <DivideSquare size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action.includes('subtract') ? 'text-amber-400' : 'text-violet-400')}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action.includes('subtract') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30')}`}>Line {cur.line}</div>
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
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-4 pb-8 overflow-y-auto overflow-x-hidden">
                      
                      {dvd !== undefined && originalDvd > 0 && action !== 'evalEdge' && (
                          <div className="flex flex-col items-center w-full max-w-lg gap-8 mt-4">
                              
                              {/* Remaining Dividend Visualization Bar */}
                              <div className="w-full flex flex-col gap-2 relative">
                                  <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono">
                                      <span>Remaining Dividend (dvd)</span>
                                      <span className="text-sky-600 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">{dvd}</span>
                                  </div>
                                  
                                  {/* Progress Bar Background */}
                                  <div className="w-full h-12 bg-slate-100 rounded-xl border border-slate-200 shadow-inner relative overflow-hidden flex justify-end">
                                      
                                      {/* Subtraction Ghost (The piece being removed) */}
                                      {action === 'subtract' && oldDvd !== undefined && temp !== undefined && (
                                          <div 
                                              className="absolute right-0 top-0 bottom-0 bg-rose-400 transition-all duration-500 ease-in-out z-10 flex items-center justify-center opacity-80"
                                              style={{ width: `${(temp / originalDvd) * 100}%` }}
                                          >
                                              <span className="text-white font-mono font-black text-xs animate-pulse">- {temp}</span>
                                          </div>
                                      )}

                                      {/* The Actual Remaining Bar */}
                                      <div 
                                          className={`absolute left-0 top-0 bottom-0 bg-sky-400 transition-all duration-700 ease-in-out z-20 flex items-center justify-end pr-3 border-r-4 ${action === 'subtract' ? 'border-rose-500' : 'border-sky-600'}`}
                                          style={{ width: `${((action === 'subtract' ? dvd : (oldDvd || dvd)) / originalDvd) * 100}%` }}
                                      ></div>
                                  </div>
                              </div>

                              <div className="w-full h-px bg-slate-200"></div>

                              {/* Temp / Multiple Shifting Sub-Arena */}
                              {temp !== undefined && multiple !== undefined && (
                                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                                      
                                      {/* Temp Tracker */}
                                      <div className={`p-5 rounded-3xl border-4 transition-all duration-300 flex flex-col items-center relative overflow-hidden ${action.includes('shift') ? 'bg-amber-100 border-amber-400 scale-105 shadow-md' : 'bg-slate-50 border-slate-200'}`}>
                                          {action.includes('shift') && <div className="absolute inset-0 bg-amber-300 opacity-20 animate-ping"></div>}
                                          <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-black">Subtractor (temp)</span>
                                          <span className={`text-3xl font-black font-mono relative z-10 ${action.includes('shift') ? 'text-amber-700' : 'text-slate-700'}`}>{temp}</span>
                                          {action === 'shiftInner' && <span className="text-xs font-bold text-amber-600 mt-1 bg-amber-50 px-2 rounded-lg relative z-10 border border-amber-200">Double! (x2)</span>}
                                      </div>

                                      {/* Multiple Tracker */}
                                      <div className={`p-5 rounded-3xl border-4 transition-all duration-300 flex flex-col items-center relative overflow-hidden ${action.includes('shift') ? 'bg-purple-100 border-purple-400 scale-105 shadow-md' : 'bg-slate-50 border-slate-200'}`}>
                                          {action.includes('shift') && <div className="absolute inset-0 bg-purple-300 opacity-20 animate-ping"></div>}
                                          <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-black">Quotient Add (mult)</span>
                                          <span className={`text-3xl font-black font-mono relative z-10 ${action.includes('shift') ? 'text-purple-700' : 'text-slate-700'}`}>{multiple}</span>
                                          {action === 'shiftInner' && <span className="text-xs font-bold text-purple-600 mt-1 bg-purple-50 px-2 rounded-lg relative z-10 border border-purple-200">Double! (x2)</span>}
                                      </div>

                                  </div>
                              )}

                              {/* Condition Evaluator Display */}
                              {temp !== undefined && (action === 'evalInnerTrue' || action === 'evalInnerFalse') && (
                                  <div className="bg-white border-2 border-slate-200 rounded-xl p-4 flex flex-col items-center shadow-sm animate-in zoom-in">
                                      <span className="text-[10px] uppercase text-slate-400 tracking-widest font-black mb-2 flex items-center gap-1"><Zap size={14}/> Shift Check</span>
                                      <div className="flex items-center gap-4 text-xl font-mono font-black">
                                          <span className="text-sky-600">{dvd}</span>
                                          <span className="text-slate-400">≥</span>
                                          <div className="flex items-center gap-1 text-amber-600">
                                              <span>{temp}</span>
                                              <span className="text-slate-300 text-sm">{"<< 1"}</span>
                                              <span className="text-slate-400">=</span>
                                              <span>{temp * 2}</span>
                                          </div>
                                      </div>
                                      <span className={`mt-2 text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-widest ${action === 'evalInnerTrue' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                          {action === 'evalInnerTrue' ? 'True (Shift Left)' : 'False (Stop Shifting)'}
                                      </span>
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
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">DIVISION COMPLETE</span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Final Quotient: {ans}
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
                <FastForward className="text-violet-600"/> Exponential Subtraction
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                When division and multiplication are strictly forbidden, you must rely on addition or subtraction. However, subtracting $1$ from $2,000,000,000$ takes two billion operations. We need a way to subtract massive chunks at once. This is where <strong>Bitwise Shifts</strong> save the day.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Calculator size={18}/> Bitwise Left Shift (&lt;&lt;)
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            In binary arithmetic, shifting a number's bits to the left by 1 position perfectly multiplies that number by 2.
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            <code>3 &lt;&lt; 1 = 6</code><br/>
                            <code>6 &lt;&lt; 1 = 12</code><br/><br/>
                            We can rapidly multiply our divisor by 2, 4, 8, 16... finding the absolutely largest multiple that still fits inside our dividend without using a single <code>*</code> operator!
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Layers size={18}/> Chunking the Remainder
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            Once we find the largest chunk that fits, we subtract it and add its multiple to our quotient.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>Example: 10 / 3.</p>
                            <p>1. Divisor is 3. Double it: 6. Double again: 12 (Too big!)</p>
                            <p>2. Max chunk is 6 (which is $3 \times 2$).</p>
                            <p>3. Subtract: $10 - 6 = 4$. Quotient += 2.</p>
                            <p>4. Loop again on remainder 4. Max chunk is 3 ($3 \times 1$).</p>
                            <p>5. Subtract: $4 - 3 = 1$. Quotient += 1.</p>
                            <p>Total Quotient: 2 + 1 = 3.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <ShieldAlert size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-rose-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">The 32-Bit Overflow Edge Case</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            The problem explicitly states the environment can only hold 32-bit signed integers: $[-2^{31}, 2^{31}-1]$.
                            <br/><br/>
                            A 32-bit integer cannot hold positive $2^{31}$. It overflows to a negative number.
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-[10px] text-rose-300 space-y-2">
                            <p>// INT_MIN = -2147483648</p>
                            <p>// INT_MAX =  2147483647</p>
                            <p className="text-white mt-2">if (dividend == INT_MIN && divisor == -1)</p>
                            <p>// Mathematically, -2147483648 / -1 = +2147483648</p>
                            <p>// This is exactly 1 higher than INT_MAX!</p>
                            <p className="text-amber-400 mt-2">return INT_MAX; // We must clamp it.</p>
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
                        "Since multiplication and division are banned, I used a Bitwise Left Shift approach to perform exponentially accelerating subtraction. First, I handled the explicit overflow edgecase where `Integer.MIN_VALUE` divided by `-1` produces a number larger than `Integer.MAX_VALUE`. After determining the final sign using an XOR operation, I cast the inputs to absolute `long` values to prevent intermediate overflow. In the main loop, instead of subtracting the divisor one by one, I repeatedly left-shift (`&lt;&lt;= 1`) the divisor to double it until it exceeds the remaining dividend. I subtract that massive chunk from the dividend and add the corresponding multiple to the quotient. I repeat this for the remainder until the dividend is less than the divisor. This drops the runtime from $O(N)$ to a highly optimal $O(\log^2 N)$."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Is using 'long' cheating?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                The problem description says "Assume we are dealing with an environment which could only store integers within the 32-bit signed integer range". Strictly speaking, using 64-bit <code>long</code> violates this constraint. However, performing this algorithm purely with 32-bit negative numbers (since negatives have a larger absolute capacity) is extremely confusing to read and write. 95% of interviewers accept the <code>long</code> conversion as long as you handle the <code>MIN_VALUE / -1</code> edgecase explicitly.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(log² N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We halve the problem space roughly every iteration. The outer loop runs at most $O(\log N)$ times, and the inner doubling loop runs at most $O(\log N)$ times, giving a heavily bounded execution time.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We only use a few primitive long/int variables (`dvd`, `dvs`, `temp`, `multiple`, `quotient`) which requires constant space.</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|MIN_VALUE|MAX_VALUE|abs|divide|dividend|divisor|dvd|dvs|quotient|temp|multiple|sign)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['divide', 'dividend', 'divisor'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['dvd', 'dvs', 'temp'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (['quotient', 'multiple'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['MIN_VALUE', 'MAX_VALUE', 'abs', 'sign'].includes(part)) return <span key={i} className="text-rose-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default DivideTwoIntegersVisualizer;