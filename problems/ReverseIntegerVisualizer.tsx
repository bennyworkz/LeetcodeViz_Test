import React, { useState, useMemo } from 'react';
import { 
  RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, ArrowRight, 
  ArrowDown, X, Binary, Timer, Network, ArrowUp, Calculator, Type, 
  ArrowLeftRight, Hash, ShieldAlert, Zap
} from 'lucide-react';

const APPROACHES = {
  mathOptimal: {
    id: 'mathOptimal',
    title: '1. Math Pop & Push',
    subtitle: 'Extract digits while checking 32-bit overflow.',
    icon: <Calculator size={16} />,
    complexity: 'Time: O(log(X)) | Space: O(1)',
    code: `class Solution {
    public int reverse(int x) {
        int rev = 0;
        
        while (x != 0) {
            int pop = x % 10;
            x /= 10;
            
            // Check for positive overflow
            if (rev > Integer.MAX_VALUE / 10 || (rev == Integer.MAX_VALUE / 10 && pop > 7)) {
                return 0;
            }
            // Check for negative overflow
            if (rev < Integer.MIN_VALUE / 10 || (rev == Integer.MIN_VALUE / 10 && pop < -8)) {
                return 0;
            }
            
            rev = rev * 10 + pop;
        }
        
        return rev;
    }
}`,
    explanation: "The optimal approach. We repeatedly 'pop' the last digit off of x (using modulo 10) and 'push' it onto the back of rev (using multiplication by 10). The crucial part is checking if multiplying rev by 10 will cause an integer overflow BEFORE we actually do it. We strictly adhere to the 32-bit signed integer limits."
  },
  stringReversal: {
    id: 'stringReversal',
    title: '2. String Reversal',
    subtitle: 'Convert to string, reverse, parse with try-catch.',
    icon: <Type size={16} />,
    complexity: 'Time: O(log(X)) | Space: O(log(X))',
    code: `class Solution {
    public int reverse(int x) {
        boolean isNegative = x < 0;
        String strX = String.valueOf(Math.abs((long)x));
        
        StringBuilder sb = new StringBuilder(strX);
        sb.reverse();
        
        try {
            int reversed = Integer.parseInt(sb.toString());
            return isNegative ? -reversed : reversed;
        } catch (NumberFormatException e) {
            // Catches values outside the 32-bit integer range
            return 0;
        }
    }
}`,
    explanation: "A simpler approach that converts the number to a string, uses standard library functions to reverse it, and relies on the NumberFormatException of Integer.parseInt() to handle the 32-bit overflow constraints. It uses O(N) extra space where N is the number of digits."
  }
};

const MAX_INT = 2147483647;
const MIN_INT = -2147483648;

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">7. Reverse Integer</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
        <p className="text-lg leading-relaxed">
          Given a signed 32-bit integer <code className="bg-slate-100 px-1.5 py-0.5 rounded text-amber-600 font-mono font-bold">x</code>, return <code className="bg-slate-100 px-1.5 py-0.5 rounded text-amber-600 font-mono font-bold">x</code><em> with its digits reversed</em>.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-amber-500 pl-4 bg-amber-50 py-2">
          If reversing <code className="font-mono">x</code> causes the value to go outside the signed 32-bit integer range <code>[-2<sup>31</sup>, 2<sup>31</sup> - 1]</code>, then return <code>0</code>.
        </p>

        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 text-sm flex gap-3 mt-4 items-start">
            <ShieldAlert className="shrink-0 mt-0.5 text-rose-500" size={18} />
            <div>
                <strong>Assume the environment does not allow you to store 64-bit integers (signed or unsigned).</strong> You must detect overflow before it happens within a 32-bit context.
            </div>
        </div>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> x = 123</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 321</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> x = -123</p>
              <p><span className="text-slate-400 font-bold">Output:</span> -321</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> x = 120</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 21</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ReverseIntegerVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState<keyof typeof APPROACHES>('mathOptimal');
  const [xInput, setXInput] = useState('123');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedX = useMemo(() => {
    let val = parseInt(xInput.replace(/[^0-9-]/g, ''));
    if (isNaN(val)) return 0;
    // Bound to exactly 32-bit integer inputs for initial state validation
    if (val > MAX_INT) return MAX_INT;
    if (val < MIN_INT) return MIN_INT;
    return val;
  }, [xInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({
        phase,
        description: desc,
        line,
        state: { ...state }
      });
    };

    if (selectedApproachId === 'mathOptimal') {
        let x = parsedX;
        let rev = 0;
        const MAX_DIV_10 = Math.trunc(MAX_INT / 10);
        const MIN_DIV_10 = Math.trunc(MIN_INT / 10);

        addStep("Initialization", `Starting with x = ${x}. Initialize rev = 0.`, 3, { x, rev, pop: null });

        while (x !== 0) {
            addStep("Loop Condition", `x is ${x}, which is not 0. Enter loop.`, 5, { x, rev, pop: null });
            
            // Pop
            let pop = x % 10;
            addStep("Pop Digit", `Extract last digit: pop = ${x} % 10 = ${pop}.`, 6, { x, rev, pop });
            
            // Truncate (like Java division)
            x = Math.trunc(x / 10);
            addStep("Reduce Original", `Remove last digit: x = x / 10 = ${x}.`, 7, { x, rev, pop });

            // Positive Bounds
            addStep("Positive Overflow Check", `Will rev*10 + pop exceed ${MAX_INT}? Checking if rev (${rev}) > ${MAX_DIV_10}.`, 10, { x, rev, pop, checkPos: true });
            if (rev > MAX_DIV_10 || (rev === MAX_DIV_10 && pop > 7)) {
                addStep("Overflow Detected!", `Multiplying rev by 10 will exceed the 32-bit positive limit. Return 0.`, 11, { x, rev, pop, isFailed: true, checkPos: true });
                return steps;
            }

            // Negative Bounds
            addStep("Negative Overflow Check", `Will rev*10 + pop exceed ${MIN_INT}? Checking if rev (${rev}) < ${MIN_DIV_10}.`, 14, { x, rev, pop, checkNeg: true });
            if (rev < MIN_DIV_10 || (rev === MIN_DIV_10 && pop < -8)) {
                addStep("Overflow Detected!", `Multiplying rev by 10 will exceed the 32-bit negative limit. Return 0.`, 15, { x, rev, pop, isFailed: true, checkNeg: true });
                return steps;
            }

            // Push
            rev = rev * 10 + pop;
            addStep("Push Digit", `Append popped digit: rev = (${rev - pop} / 10) * 10 + ${pop} = ${rev}.`, 18, { x, rev, pop });
        }

        addStep("Loop Terminates", `x is now 0. Search complete.`, 5, { x, rev, pop: null });
        addStep("Return Result", `Final reversed value within limits: ${rev}.`, 21, { x, rev, pop: null, isSuccess: true });
    } 
    else if (selectedApproachId === 'stringReversal') {
        let x = parsedX;
        let isNegative = x < 0;
        addStep("Determine Sign", `x is ${x}. isNegative = ${isNegative}.`, 3, { x, isNegative, strX: null, sb: null });
        
        // Emulate Math.abs with long to prevent Math.abs(MIN_VALUE) overflow
        let absVal = Math.abs(x); 
        let strX = absVal.toString();
        addStep("Convert to String", `Take absolute value and convert to string: "${strX}".`, 4, { x, isNegative, strX, sb: null });
        
        let sb = strX.split('').reverse().join('');
        addStep("Reverse String", `Reverse the characters: "${sb}".`, 7, { x, isNegative, strX, sb });
        
        addStep("Parse Attempt", `Try to parse "${sb}" back to a 32-bit integer.`, 10, { x, isNegative, strX, sb });
        
        let parsed = parseInt(sb);
        let finalVal = isNegative ? -parsed : parsed;
        
        if (finalVal > MAX_INT || finalVal < MIN_INT) {
             addStep("NumberFormatException", `Parsing failed! Value ${finalVal} is outside 32-bit boundaries. Caught exception.`, 13, { x, isNegative, strX, sb, isFailed: true });
             addStep("Return Zero", `Return 0.`, 15, { x, isNegative, strX, sb, isFailed: true, finalAns: 0 });
        } else {
             addStep("Parse Success", `Parsed successfully to ${parsed}. Apply sign: ${finalVal}.`, 11, { x, isNegative, strX, sb });
             addStep("Return Result", `Return ${finalVal}.`, 12, { x, isNegative, strX, sb, isSuccess: true, finalAns: finalVal });
        }
    }

    if (steps.length === 0) {
        addStep("Init", "Start", 1, {});
    }

    return steps;
  }, [parsedX, selectedApproachId]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedApproach.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0] || { state: {} };
  const state = cur.state || {};
  const { isSuccess, isFailed } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-amber-600 p-4 rounded-2xl shadow-lg shadow-amber-100 flex items-center justify-center">
                <RotateCcw className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Reverse Integer</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 7</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Math Bounds</span>
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
              
              {/* Left Col: Approaches, Code & Variable Context (5/12) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                
                {/* Approach Selector */}
                <div className="grid grid-cols-2 gap-3">
                    {Object.values(APPROACHES).map((app) => {
                        const isSelected = selectedApproachId === app.id;
                        const [time, space] = app.complexity.split(' | ');
                        return (
                            <button 
                               key={app.id}
                               onClick={() => { setSelectedApproachId(app.id as keyof typeof APPROACHES); setCurrentStep(0); }}
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-amber-600 border-amber-600 text-white shadow-amber-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-amber-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                                    <span>{time}</span>
                                    <span>{space}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="bg-[#0f172a] rounded-3xl h-[460px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={14} className="text-amber-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {/* Highlighter Bar */}
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isFailed ? 'bg-rose-500/20 border-rose-500' : isSuccess ? 'bg-emerald-500/20 border-emerald-500' : 'bg-amber-500/15 border-amber-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="amber" />
                      ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Current Variables</h4>
                      </div>
                    </div>
                    
                    {selectedApproachId === 'mathOptimal' ? (
                        <div className="grid grid-cols-3 gap-3">
                            <VariableCard label="x (remaining)" val={state.x ?? null} color="blue" active={state.x !== undefined} />
                            <VariableCard label="pop" val={state.pop ?? null} color="amber" active={state.pop !== null && state.pop !== undefined} />
                            <VariableCard label="rev (building)" val={state.rev ?? null} color="emerald" active={state.rev !== undefined} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <VariableCard label="Original x" val={state.x ?? null} color="blue" active={state.x !== undefined} />
                            <VariableCard label="String/Reversed" val={state.sb !== null ? state.sb : state.strX} color="purple" active={state.strX !== null && state.strX !== undefined} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Simulation Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-amber-600 uppercase block pl-1 tracking-widest font-mono">Input x (32-bit Integer)</label>
                        <input type="text" value={xInput} onChange={(e) => { setXInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-inner" placeholder="e.g. 123" />
                    </div>
                    
                    {/* Quick inputs */}
                    <div className="hidden md:flex gap-2">
                       <button onClick={() => {setXInput('1534236469'); setCurrentStep(0);}} className="text-[10px] font-black uppercase text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 hover:bg-rose-100 transition-colors">Test Overflow</button>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-amber-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-amber-100 hover:bg-amber-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Action Log / Status */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group ${isFailed ? 'bg-rose-900 border-rose-800' : isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isFailed ? <ShieldAlert size={100}/> : <Binary size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isFailed ? "text-rose-400" : isSuccess ? "text-emerald-400" : "text-amber-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isFailed ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>Line {cur.line}</div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line">{cur.description}</p>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[420px] relative flex flex-col overflow-hidden shadow-inner items-center justify-center">
                   
                   {selectedApproachId === 'mathOptimal' && state.x !== undefined && (
                       <div className="w-full max-w-lg flex flex-col gap-10 relative">
                           {/* Limit Gauge Visual */}
                           <div className="w-full mb-4 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center relative overflow-hidden">
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">32-Bit Integer Limits</span>
                               
                               <div className="flex justify-between w-full text-[10px] font-mono font-bold text-slate-400 px-2 mb-1">
                                   <span className={state.checkNeg ? "text-rose-600" : ""}>{MIN_INT}</span>
                                   <span>0</span>
                                   <span className={state.checkPos ? "text-rose-600" : ""}>{MAX_INT}</span>
                               </div>
                               
                               <div className="w-full h-3 bg-slate-200 rounded-full relative overflow-hidden flex">
                                   <div className="w-1/2 h-full bg-slate-300 border-r border-white/50 relative">
                                        {/* Dynamic red zone if close to min */}
                                        <div className={`absolute right-0 h-full bg-rose-400 transition-all duration-500 ${state.checkNeg ? 'w-full opacity-40' : 'w-0'}`} />
                                   </div>
                                   <div className="w-1/2 h-full bg-slate-300 relative">
                                        <div className={`absolute left-0 h-full bg-rose-400 transition-all duration-500 ${state.checkPos ? 'w-full opacity-40' : 'w-0'}`} />
                                   </div>
                                   
                                   {/* Current Value Marker */}
                                   <div 
                                      className="absolute top-0 bottom-0 w-1.5 bg-amber-500 rounded-full shadow transition-all duration-500 ease-out"
                                      style={{ left: `${Math.max(0, Math.min(100, ((state.rev - MIN_INT) / (MAX_INT - MIN_INT)) * 100))}%` }}
                                   />
                               </div>

                               {(state.checkPos || state.checkNeg) && (
                                   <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
                                       <span className="text-xs font-black uppercase tracking-widest text-rose-600 border border-rose-300 bg-rose-100 px-3 py-1 rounded-lg animate-pulse shadow-sm">
                                           {state.checkPos ? `Is ${state.rev} > ${Math.trunc(MAX_INT/10)}?` : `Is ${state.rev} < ${Math.trunc(MIN_INT/10)}?`}
                                       </span>
                                   </div>
                               )}
                           </div>

                           <div className="flex items-center justify-around relative">
                               {/* X (Original Shrinking) */}
                               <div className="flex flex-col items-center gap-2 z-10">
                                   <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest font-mono">x (Remaining)</span>
                                   <div className="px-8 py-6 bg-blue-50 border-2 border-blue-200 rounded-3xl shadow-inner min-w-[120px] flex justify-center items-center">
                                       <span className="text-4xl font-black font-mono text-blue-800 tracking-tighter">{state.x === 0 ? "0" : state.x}</span>
                                   </div>
                               </div>

                               {/* Digit Transfer Animation Indicator */}
                               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
                                   {state.pop !== null && state.pop !== undefined && (
                                       <div className="animate-in zoom-in slide-in-from-left-8 duration-500 flex flex-col items-center">
                                           <div className="w-12 h-12 bg-amber-100 border-2 border-amber-400 rounded-xl flex items-center justify-center shadow-lg transform rotate-12">
                                               <span className="text-2xl font-black font-mono text-amber-700">{state.pop}</span>
                                           </div>
                                           <div className="flex items-center gap-1 text-[8px] font-black text-amber-600 mt-2 uppercase tracking-widest bg-white/80 px-2 py-0.5 rounded-full">
                                               <ArrowRight size={10}/> Pop & Push
                                           </div>
                                       </div>
                                   )}
                               </div>

                               {/* Rev (Growing) */}
                               <div className="flex flex-col items-center gap-2 z-10">
                                   <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest font-mono">rev (Building)</span>
                                   <div className={`px-8 py-6 border-2 rounded-3xl shadow-inner min-w-[120px] flex justify-center items-center transition-colors duration-300 ${isFailed ? 'bg-rose-50 border-rose-300 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                                       <span className="text-4xl font-black font-mono tracking-tighter">{state.rev}</span>
                                   </div>
                               </div>
                           </div>
                       </div>
                   )}

                   {selectedApproachId === 'stringReversal' && state.x !== undefined && (
                       <div className="w-full flex flex-col items-center gap-8">
                           {/* String Conversion Pipeline */}
                           <div className="flex items-center gap-4 text-2xl font-mono font-black text-slate-800">
                               <div className="flex flex-col items-center">
                                   <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">Original</span>
                                   <div className="bg-slate-100 px-6 py-4 rounded-2xl border border-slate-200">{state.x}</div>
                               </div>
                               
                               <ArrowRight size={24} className="text-slate-300" />
                               
                               <div className="flex flex-col items-center">
                                   <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">String</span>
                                   <div className="bg-sky-50 px-6 py-4 rounded-2xl border border-sky-200 text-sky-800">
                                       "{state.strX !== null ? state.strX : '...'}"
                                   </div>
                               </div>
                               
                               <ArrowRight size={24} className="text-slate-300" />
                               
                               <div className="flex flex-col items-center">
                                   <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">Reversed</span>
                                   <div className="bg-purple-50 px-6 py-4 rounded-2xl border border-purple-200 text-purple-800">
                                       "{state.sb !== null ? state.sb : '...'}"
                                   </div>
                               </div>
                           </div>

                           {/* Try Catch Block Visualizer */}
                           {state.sb !== null && cur.phase.includes("Parse") && (
                               <div className="w-full max-w-md mt-6 p-6 border-2 border-dashed border-amber-200 rounded-3xl bg-amber-50/50 flex flex-col items-center text-center animate-in slide-in-from-bottom-4">
                                   <Zap className="text-amber-500 mb-3" size={24}/>
                                   <span className="font-bold text-amber-900 font-mono">Integer.parseInt("{state.sb}")</span>
                                   <span className="text-xs text-amber-700 mt-2 italic">Operating system attempts to map string characters back to a 32-bit signed memory space...</span>
                               </div>
                           )}
                       </div>
                   )}

                  {/* Final Overlays */}
                  {isFailed && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-rose-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-rose-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform rotate-1 pointer-events-auto">
                          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shadow-lg">
                              <ShieldAlert size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">OVERFLOW DETECTED</span>
                              <span className="text-xs font-black uppercase text-rose-600 tracking-widest font-mono">Returned 0</span>
                          </div>
                      </div>
                    </div>
                  )}
                  {isSuccess && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-emerald-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-emerald-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">REVERSAL COMPLETE</span>
                              <span className="text-xs font-black uppercase text-emerald-600 tracking-widest font-mono">Result: {selectedApproachId === 'mathOptimal' ? state.rev : state.finalAns}</span>
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
                <Target className="text-amber-600"/> The 32-Bit Boundary
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-amber-100 pl-6">
                The core difficulty of this problem is not reversing the digits, but rather doing so within a strictly confined memory space. A 32-bit signed integer can only safely hold values between <code className="font-bold text-rose-600">-2,147,483,648</code> and <code className="font-bold text-emerald-600">2,147,483,647</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Calculator size={18}/> Pop & Push Mechanics
                        </h3>
                        <p className="text-sm text-amber-800 leading-relaxed italic">
                            How to shift numbers without strings.
                        </p>
                        <p className="text-xs text-amber-700 leading-relaxed mt-2 bg-amber-100/50 p-3 rounded-xl border border-amber-200/50">
                           <strong className="text-amber-900">Pop:</strong> <code>pop = x % 10</code>. Modulo 10 always isolates the right-most digit. (e.g., 123 % 10 = 3).<br/><br/>
                           <strong className="text-amber-900">Reduce:</strong> <code>x /= 10</code>. Integer division removes the right-most digit. (e.g., 123 / 10 = 12).<br/><br/>
                           <strong className="text-amber-900">Push:</strong> <code>rev = rev * 10 + pop</code>. Multiplying by 10 shifts existing digits left, making room to add the popped digit.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <ShieldAlert size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-amber-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Preventing The Crash</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed">
                        <p>
                           If <code>rev</code> is currently <code>214,748,365</code>, executing <code>rev * 10</code> will instantly crash or wrap-around (overflow) the integer before you can even check the result.
                        </p>
                        <p>
                           Therefore, we must check <strong>before</strong> we multiply. We divide the maximum limit by 10: <code>214,748,364</code>.
                        </p>
                        <div className="bg-rose-900/40 border border-rose-500/30 text-rose-300 p-4 rounded-xl mt-4 font-mono text-[10px]">
                           if (rev &gt; 214748364)<br/>
                           &nbsp;&nbsp;return 0; // Guaranteed overflow!<br/>
                           if (rev == 214748364 && pop &gt; 7)<br/>
                           &nbsp;&nbsp;return 0; // The last digit of MAX_INT is 7!
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
                        "While converting the integer to a string or using a 64-bit 'long' variable to catch overflows is an easy bypass, interviewers explicitly state 'assume the environment cannot store 64-bit integers'. The math pop-and-push method demonstrates a fundamental understanding of bit/byte limits and proactive boundary checking. By verifying if 'rev' exceeds MAX/10 before the multiplication step, we write robust, fault-tolerant C/C++/Java code."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Modulo with Negatives
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                <strong className="text-slate-800">Java / C++ Behavior:</strong> The modulo operator <code>%</code> preserves the sign. Example: <code>-123 % 10 = -3</code>. This is incredibly useful because we don't need to treat negative numbers differently! The <code>pop</code> will be negative, and adding it to a negative <code>rev</code> correctly builds the negative reversed number.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(log₁₀(X))</span>
                                <p className="text-[10px] text-slate-500 mt-1">There are roughly log₁₀(X) digits in x. We process one digit per loop iteration.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We allocate only a few integer primitives (rev, pop), completely avoiding dynamic array or string heap allocations.</p>
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

const VariableCard = ({ label, val, color, active }: { label: string, val: number | string | null, color: 'blue' | 'purple' | 'amber' | 'emerald', active: boolean }) => {
    const bgMap = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700'
    };
    
    const inactiveMap = 'bg-slate-50 border-slate-200 text-slate-300';

    return (
        <div className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden ${active ? bgMap[color] : inactiveMap}`}>
             <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 truncate px-1">{label}</span>
             <div className="text-xl font-black font-mono leading-none">
                 {val !== null ? val : '-'}
             </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean, theme?: 'cyan' | 'violet' | 'rose' | 'emerald' | 'amber' }> = ({ num, code, active, theme = 'amber' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|try|catch|Integer|StringBuilder|Math)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'try', 'catch'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'long', 'boolean', 'String', 'Integer', 'StringBuilder', 'Math'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-yellow-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default ReverseIntegerVisualizer;