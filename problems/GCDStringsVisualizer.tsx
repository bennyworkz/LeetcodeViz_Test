import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight, Check, X, Divide, Code2, ArrowRight, BookOpen, Activity, Lightbulb, Scale, Layers, Zap, Calculator, Search, Target, FileText, Cpu, AlertCircle, MessageSquare, AlignLeft, Trophy } from 'lucide-react';

const APPROACHES = {
  optimal: {
    id: 'optimal',
    title: '1. Math Optimal',
    subtitle: 'Commutativity & GCD',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N + M) | Space: O(N + M)',
    code: `class Solution {
    public String gcdOfStrings(String str1, String str2) {
        if (!(str1 + str2).equals(str2 + str1)) {
            return "";
        }

        int gcdLength = gcd(str1.length(), str2.length());
        return str1.substring(0, gcdLength);
    }

    private int gcd(int a, int b) {
        return b == 0 ? a : gcd(b, a % b);
    }
}`,
    explanation: "The math-heavy efficient approach. If two strings share a common 'divisor' string, concatenating them in either order must yield the same result. If they commute, the length of the GCD string is the numeric GCD of the lengths of the two strings.",
  },
  brute: {
    id: 'brute',
    title: '2. Brute Force',
    subtitle: 'Prefix Iteration',
    icon: <Search size={16} />,
    complexity: 'Time: O(min(N,M) * (N+M))',
    code: `class Solution {
    public String gcdOfStrings(String str1, String str2) {
        int n1 = str1.length(), n2 = str2.length();
        for (int i = Math.min(n1, n2); i >= 1; i--) {
            if (n1 % i == 0 && n2 % i == 0) {
                String base = str1.substring(0, i);
                if (isDivisor(base, str1) && isDivisor(base, str2)) {
                    return base;
                }
            }
        }
        return "";
    }

    private boolean isDivisor(String base, String target) {
        return target.replace(base, "").isEmpty();
    }
}`,
    explanation: "Checks every possible prefix length starting from the shortest string's length down to 1. For each length that divides both string lengths, it checks if that prefix can perfectly 'rebuild' both strings through repetition.",
  }
};

const GCDStringsVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-200">
                <Divide className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">GCD of Strings</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">1071</span>
                <span>LeetCode 75 • Easy</span>
              </div>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <TabButton active={activeTab === 'problem'} onClick={() => setActiveTab('problem')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<BookOpen size={16}/>} label="Learn" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'problem' && <ProblemStatement />}
        {activeTab === 'visualizer' && <VisualizerMode />}
        {activeTab === 'learn' && <LearnMode />}
        {activeTab === 'interview' && <InterviewHelper />}
        
      </div>
    </div>
  );
};

const VisualizerMode = () => {
  const [selectedApproach, setSelectedApproach] = useState<keyof typeof APPROACHES>('optimal');
  const [str1, setStr1] = useState("ABCABC");
  const [str2, setStr2] = useState("ABC");
  const [currentStep, setCurrentStep] = useState(0);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const s1 = str1 || "";
    const s2 = str2 || "";
    
    const addStep = (phase: string, desc: string, line: number, extra: any = {}) => {
      steps.push({ phase, description: desc, line, state: { str1: s1, str2: s2, ...extra } });
    };

    if (selectedApproach === 'optimal') {
      const c1 = s1 + s2;
      const c2 = s2 + s1;
      addStep("Start", "Method execution starts.", 2);
      addStep("Verification", "Computing (str1 + str2) and (str2 + str1).", 3, { checkConcat: true, c1, c2 });
      
      const matched = c1 === c2;
      addStep("Equality Check", matched ? "Strings match! They share a common base." : "Strings do not match. No GCD exists.", 3, { checkConcat: true, c1, c2, matched });
      
      if (!matched) {
        addStep("Return", "Returning empty string.", 4, { result: "", checkConcat: true, c1, c2, matched: false });
        return steps;
      }

      let a = s1.length;
      let b = s2.length;
      addStep("GCD Entry", `Finding GCD of lengths: str1(${a}) and str2(${b}).`, 7, { a, b, gcdStart: true });
      
      let tempA = a, tempB = b;
      while (tempB !== 0) {
          const remainder = tempA % tempB;
          addStep("Euclidean GCD", `Line 12: Checking if divisor is zero. b is currently ${tempB}.`, 12, { a: tempA, b: tempB, remainder, gcdStep: true });
          addStep("Iteration", `Calculating remainder: ${tempA} % ${tempB} = ${remainder}. Shifting values.`, 12, { a: tempA, b: tempB, remainder, gcdStep: true });
          tempA = tempB;
          tempB = remainder;
      }
      const gcdLen = tempA;
      addStep("GCD Done", `Numerical GCD of lengths is ${gcdLen}. Returning from helper.`, 12, { gcdLen, finalGcd: true, a: gcdLen, b: 0 });
      
      const result = s1.substring(0, gcdLen);
      addStep("Extraction", `Taking prefix of str1 with length ${gcdLen}.`, 8, { result, highlightLen: gcdLen, extracting: true });
      addStep("Finish", `Final Result: "${result}"`, 8, { result, finished: true });

    } else {
      addStep("Init", "Initialize length variables.", 3, { n1: s1.length, n2: s2.length });
      const minLen = Math.min(s1.length, s2.length);
      
      for (let i = minLen; i >= 1; i--) {
        const dividesBoth = s1.length % i === 0 && s2.length % i === 0;
        addStep("For Loop", `Iterating i = ${i}.`, 4, { i, checkDivides: true });
        addStep("Divisor Check", `Checking if ${i} divides both lengths (${s1.length}, ${s2.length}). Result: ${dividesBoth ? 'YES' : 'NO'}`, 5, { i, checkDivides: true, dividesBoth });
        
        if (dividesBoth) {
          const base = s1.substring(0, i);
          addStep("Extract Base", `Line 6: Extracting potential pattern prefix: "${base}"`, 6, { i, base, showPattern: true });
          
          addStep("Verify Divisor", `Line 7: Verifying if "${base}" divides both strings.`, 7, { i, base, showPattern: true, verifying: true });
          
          const v1 = s1.split(base).join("") === "";
          const v2 = s2.split(base).join("") === "";
          
          if (v1 && v2) {
            addStep("Success", `Pattern "${base}" divides both strings perfectly!`, 8, { i, base, result: base, finished: true, success: true });
            return steps;
          } else {
            addStep("Try Next", `Pattern "${base}" does not divide strings. Continuing loop.`, 7, { i, base, showPattern: true, failedPattern: true });
          }
        }
      }
      addStep("Fail", "No common pattern found.", 11, { result: "", finished: true });
    }

    return steps;
  }, [str1, str2, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));

  const cur = trace[currentStep] || trace[0];
  const { state } = cur;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      {/* Left Column: Code and Strategy */}
      <div className="flex flex-col gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-sm overflow-hidden">
           {(Object.keys(APPROACHES) as Array<keyof typeof APPROACHES>).map((key) => (
              <button
                key={key}
                onClick={() => { setSelectedApproach(key); setCurrentStep(0); }}
                className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}
              >
                <div className={`mb-1 transition-transform duration-300 ${selectedApproach === key ? 'scale-110' : ''}`}>
                  {APPROACHES[key].icon}
                </div>
                <span className="text-xs font-black uppercase tracking-tight">{APPROACHES[key].title}</span>
                <span className={`text-[10px] opacity-70 ${selectedApproach === key ? 'text-white' : 'text-slate-400'}`}>{APPROACHES[key].complexity}</span>
              </button>
           ))}
        </div>

        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[500px]">
          <div className="bg-[#1e293b] px-4 py-3 text-xs font-mono text-slate-400 flex justify-between items-center border-b border-slate-800/50">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <Code2 size={14}/>
              <span>Solution.java</span>
            </div>
          </div>
          <div className="p-6 font-mono text-[13px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
              <div 
                className="absolute left-0 right-0 bg-blue-500/15 border-l-4 border-blue-500 transition-all duration-300 pointer-events-none z-0" 
                style={{ top: `${(cur.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} 
              />
              {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                  <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} />
              ))}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
               <Cpu size={18} />
               <h4 className="text-sm font-black uppercase tracking-widest">Logic Insight</h4>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{APPROACHES[selectedApproach].explanation}</p>
        </div>
      </div>

      {/* Right Column: Interactive Controls and Visual Board */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block pl-1">Input str1</label>
              <input 
                value={str1} 
                onChange={(e) => { setStr1(e.target.value.toUpperCase()); setCurrentStep(0); }} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner" 
                maxLength={15}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-purple-600 uppercase tracking-widest block pl-1">Input str2</label>
              <input 
                value={str2} 
                onChange={(e) => { setStr2(e.target.value.toUpperCase()); setCurrentStep(0); }} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-purple-500 outline-none shadow-inner" 
                maxLength={15}
              />
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-6 border-t border-slate-100">
            <div className="w-full px-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                    <span>Validation</span>
                    <span className="text-blue-500">Step {currentStep + 1} / {trace.length}</span>
                    <span>Result</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                    <div className="h-full bg-blue-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.3)]" style={{ width: `${(currentStep / (Math.max(1, trace.length - 1))) * 100}%` }} />
                </div>
            </div>
            <div className="flex items-center justify-between gap-4">
                <button onClick={() => setCurrentStep(0)} className="p-3 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-all" title="Reset Simulation"><RotateCcw size={20}/></button>
                <div className="flex gap-3 flex-1">
                    <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-all disabled:opacity-30 flex items-center justify-center gap-2">
                        <ChevronLeft size={18} /> Prev
                    </button>
                    <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold transition-all disabled:opacity-30 shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                        Next Action <ChevronRight size={18} />
                    </button>
                </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3 text-slate-400">
              <Target size={14}/>
              <span className="text-[10px] font-black uppercase tracking-widest">Logic Trace</span>
            </div>
            <div className="text-lg font-black tracking-tight mb-1 uppercase">{cur.phase}</div>
            <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-700/50">{cur.description}</p>
        </div>

        {/* Dynamic Board Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[450px] relative overflow-hidden flex flex-col justify-center items-center gap-10">
            
            {/* Concatenation Visual (Optimal Phase 1) */}
            {state.checkConcat && (
                <div className="w-full flex flex-col gap-6 animate-in slide-in-from-bottom-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] font-black text-blue-600 uppercase">str1 + str2</span>
                            <span className="text-[10px] font-bold text-slate-400 font-mono">Len: {state.c1.length}</span>
                        </div>
                        <div className="font-mono text-xl p-4 bg-slate-50 border-2 rounded-xl border-blue-200 text-slate-800 break-all shadow-inner relative overflow-hidden flex flex-wrap">
                           {state.c1.split('').map((char: string, idx: number) => (
                             <span key={idx} className={`transition-colors duration-300 ${state.matched === false && idx === (state.str1 + state.str2 === state.c1 ? state.c1.indexOf(state.c1[idx]) : -1) ? 'text-red-500 font-black underline' : ''}`}>{char}</span>
                           ))}
                        </div>
                    </div>
                    <div className="flex justify-center">
                         <div className="bg-slate-100 p-2 rounded-full border border-slate-200">
                            <ArrowRight size={20} className="text-slate-400 rotate-90" />
                         </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] font-black text-purple-600 uppercase">str2 + str1</span>
                            <span className="text-[10px] font-bold text-slate-400 font-mono">Len: {state.c2.length}</span>
                        </div>
                        <div className="font-mono text-xl p-4 bg-slate-50 border-2 rounded-xl border-purple-200 text-slate-800 break-all shadow-inner">
                            {state.c2}
                        </div>
                    </div>
                    {state.matched && (
                        <div className="flex justify-center animate-in zoom-in">
                            <div className="bg-green-50 text-green-700 px-5 py-2.5 rounded-full border-2 border-green-200 font-black text-xs uppercase flex items-center gap-2 shadow-sm">
                                <Check size={16} strokeWidth={3} /> Strings Commute Perfectly
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Euclidean Algorithm Lab (Optimal Phase 2) */}
            {(state.gcdStep || state.finalGcd || state.gcdStart) && !state.extracting && !state.finished && (
                <div className="w-full space-y-8 animate-in zoom-in duration-500">
                    <div className="flex items-center gap-4 justify-center">
                        <Calculator className="text-blue-500" size={32} />
                        <h3 className="text-xl font-black text-slate-800">Euclidean Algorithm Lab</h3>
                    </div>
                    <div className="bg-slate-900 rounded-3xl p-10 text-white shadow-2xl space-y-8 border-4 border-slate-800">
                        <div className="flex justify-between items-center text-xs font-black text-blue-400 uppercase tracking-widest border-b border-slate-800 pb-4">
                            <span>Recursion Stack</span>
                            <span>Formula: gcd(a, b) &rarr; gcd(b, a % b)</span>
                        </div>
                        <div className="flex items-center justify-center gap-8 font-mono text-4xl">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] mb-2 opacity-50 uppercase tracking-widest">Input A</span>
                                <div className="p-5 bg-slate-800 rounded-2xl border-2 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                                    {state.a}
                                </div>
                            </div>
                            <span className="opacity-30 text-5xl">%</span>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] mb-2 opacity-50 uppercase tracking-widest">Input B</span>
                                <div className={`p-5 bg-slate-800 rounded-2xl border-2 transition-all duration-500 ${state.b === 0 ? 'border-green-500 bg-green-900/20' : 'border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]'}`}>
                                    {state.b}
                                </div>
                            </div>
                            {state.remainder !== undefined && (
                                <>
                                    <span className="opacity-30 text-5xl">=</span>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] mb-2 opacity-50 uppercase tracking-widest">Remainder</span>
                                        <div className="p-5 bg-blue-900/50 rounded-2xl border-2 border-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.4)] animate-pulse">
                                            {state.remainder}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        {state.finalGcd && (
                            <div className="pt-4 text-center border-t border-slate-800 animate-in fade-in duration-700">
                                <p className="text-green-400 font-black tracking-widest uppercase text-sm flex items-center justify-center gap-2">
                                    <Trophy size={16}/> Calculated length: {state.gcdLen}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Pattern Visualization (Brute Force or Final Result) */}
            {(state.showPattern || state.extracting) && (
                <div className="w-full space-y-12 animate-in slide-in-from-top-6">
                    <div className="flex flex-col items-center gap-5">
                        <div className="flex justify-between items-center w-full max-w-lg">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">String 1 (Len: {str1.length})</span>
                            {state.verifying && <span className="text-[10px] font-black text-blue-600 animate-pulse uppercase">Verifying Divisions...</span>}
                        </div>
                        <div className="flex flex-wrap justify-center gap-1.5 p-4 bg-slate-50 border rounded-2xl w-full">
                            {str1.split('').map((char: string, idx: number) => {
                                const isPrefix = idx < (state.gcdLen || state.highlightLen || state.i || 0);
                                const isMatching = state.verifying === true;
                                return (
                                    <div key={idx} className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-mono font-black text-sm transition-all duration-500 
                                      ${isPrefix ? 'bg-blue-600 border-blue-700 text-white scale-110 shadow-lg z-10' : 'bg-white border-slate-200 text-slate-300'}
                                      ${isMatching && !isPrefix ? 'animate-pulse bg-blue-50 border-blue-200 text-blue-300' : ''}
                                    `}>
                                        {char}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-5">
                        <div className="flex justify-between items-center w-full max-w-lg">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">String 2 (Len: {str2.length})</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-1.5 p-4 bg-slate-50 border rounded-2xl w-full">
                            {str2.split('').map((char: string, idx: number) => {
                                const isPrefix = idx < (state.gcdLen || state.highlightLen || state.i || 0);
                                const isMatching = state.verifying === true;
                                return (
                                    <div key={idx} className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-mono font-black text-sm transition-all duration-500 
                                      ${isPrefix ? 'bg-purple-600 border-purple-700 text-white scale-110 shadow-lg z-10' : 'bg-white border-slate-200 text-slate-300'}
                                      ${isMatching && !isPrefix ? 'animate-pulse bg-purple-50 border-purple-200 text-purple-300' : ''}
                                    `}>
                                        {char}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Final Results Results */}
            {state.finished && (
               <div className="animate-in zoom-in duration-500 pt-6">
                  <div className={`bg-white border-2 px-12 py-10 rounded-[2.5rem] flex flex-col items-center gap-5 shadow-2xl transition-all duration-700 ${state.result || state.success ? 'border-green-200 ring-8 ring-green-50' : 'border-slate-200 shadow-slate-100'}`}>
                      {(state.result || state.success) ? (
                         <div className="bg-green-100 p-4 rounded-full">
                             <Check className="text-green-600" size={48} strokeWidth={3}/>
                         </div>
                      ) : (
                         <div className="bg-slate-100 p-4 rounded-full">
                             <X className="text-slate-400" size={48} strokeWidth={3}/>
                         </div>
                      )}
                      <div className="text-center">
                          <span className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2 font-mono tracking-tighter">Resulting GCD String</span>
                          <span className="text-5xl font-black text-slate-900 tracking-tighter">
                            {state.result ? `"${state.result}"` : "None"}
                          </span>
                      </div>
                  </div>
               </div>
            )}
        </div>
      </div>
    </div>
  );
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">1071. Greatest Common Divisor of Strings</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          For two strings <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">s</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">t</code>, we say <code className="font-bold text-slate-800">"t divides s"</code> if and only if <code className="italic text-slate-800">s = t + t + ... + t</code>.
        </p>
        <p className="text-lg leading-relaxed text-slate-800">
          Given two strings <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">str1</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">str2</code>, return the largest string <code className="italic font-bold text-slate-900">x</code> such that <code className="italic">x</code> divides both <code className="bg-slate-100 px-1.5 rounded">str1</code> and <code className="bg-slate-100 px-1.5 rounded">str2</code>.
        </p>
        <div className="pt-10 border-t border-slate-100 mt-10">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><AlertCircle size={14} /> Constraints:</h3>
          <ul className="list-disc list-inside space-y-2 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">1 {'<='} str1.length, str2.length {'<='} 1000</code></li>
            <li>Strings consist of English uppercase letters.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const LearnMode = () => {
    const [selectedTopic, setSelectedTopic] = useState('problem');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-3 space-y-2">
                <TopicButton active={selectedTopic === 'problem'} onClick={() => setSelectedTopic('problem')} title="1. Divisor Definition" desc="Repetition Patterns" />
                <TopicButton active={selectedTopic === 'math'} onClick={() => setSelectedTopic('math')} title="2. The Commutative Trick" desc="Concatenation Proof" />
                <TopicButton active={selectedTopic === 'algo'} onClick={() => setSelectedTopic('algo')} title="3. Euclidean Logic" desc="Length Synchronization" />
            </div>

            <div className="lg:col-span-9 bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[600px] flex flex-col">
                {selectedTopic === 'problem' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold mb-1">
                            <AlignLeft size={16}/> Concept Mastery
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">String Division</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            In math, <code>2</code> divides <code>6</code> because <code>2+2+2 = 6</code>. Similarly, string <code>T</code> divides <code>S</code> if repeating <code>T</code> some number of times yields <code>S</code>.
                        </p>
                        
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 space-y-4">
                            <h3 className="font-bold text-blue-800 flex items-center gap-2"><Check size={20}/> Valid Example</h3>
                            <div className="font-mono bg-white p-4 rounded border border-blue-200">
                                S: "ABABAB"<br/>
                                T: "AB"<br/>
                                <span className="text-blue-600 font-black">"AB" + "AB" + "AB" = "ABABAB" (YES)</span>
                            </div>
                        </div>
                    </div>
                )}

                {selectedTopic === 'math' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">The Concatenation Hack</h2>
                        <p className="text-slate-600 text-lg leading-relaxed">
                           If two strings share a common base pattern, they <strong>must</strong> be commutative under concatenation.
                        </p>
                        
                        <div className="bg-slate-900 p-10 rounded-3xl text-center font-mono text-3xl text-blue-300 shadow-2xl border-4 border-slate-800">
                            str1 + str2 == str2 + str1
                        </div>
                        
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-sm italic">
                            If this check fails, no common pattern exists, and we can immediately return an empty string. This reduces our search space to a single linear check.
                        </div>
                    </div>
                )}

                {selectedTopic === 'algo' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800 font-black tracking-tight text-indigo-900">Length Optimization</h2>
                        <p className="text-slate-600">Once we prove a GCD exists, how long is it?</p>
                        <p className="text-slate-600 leading-relaxed">
                           The largest possible pattern length that could divide both strings must be the <strong>Greatest Common Divisor</strong> of the strings' lengths.
                        </p>
                        <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-2xl shadow-inner text-indigo-900 font-black text-center text-xl">
                            GCD String Length = Numeric_GCD(str1.len, str2.len)
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const InterviewHelper = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
        <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 font-black uppercase tracking-tight">
                    <MessageSquare className="text-blue-50" size={20} />
                    Interview Pitch
                </h3>
                <p className="text-sm text-slate-600 italic">
                  "I implemented a math-optimized O(N+M) solution. By leveraging string commutativity, I can verify the existence of a common base pattern in linear time. Combining this with the Euclidean algorithm for string lengths allows me to identify the largest common divisor prefix with minimal string allocations, ensuring peak performance across large inputs."
                </p>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg shadow-blue-100 flex flex-col justify-center">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                    <Check size={20} />
                    Complexity Overview
                </h3>
                <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono">
                    <div className="bg-blue-700/50 p-4 rounded-xl border border-blue-400/30">
                        <div className="font-black text-blue-100 mb-1 uppercase tracking-widest text-[9px]">Time Complexity</div>
                        O(N + M)
                    </div>
                    <div className="bg-blue-700/50 p-4 rounded-xl border border-blue-400/30">
                        <div className="font-black text-blue-100 mb-1 uppercase tracking-widest text-[9px]">Space Complexity</div>
                        O(N + M)
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|StringBuilder|Math|substring|equals|isEmpty|replace|gcd|min)\b|\b\d+\b)/g).filter(Boolean);
  return (
    <div className={`flex relative z-10 group min-h-[20.8px] ${active ? 'font-bold' : ''}`}>
      <span className="w-8 select-none text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-xs">{num}</span>
      <pre className={`font-mono whitespace-pre text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-orange-300">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-cyan-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'void'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['String', 'StringBuilder', 'Math'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['substring', 'equals', 'isEmpty', 'replace', 'gcd', 'min'].includes(part)) return <span key={i} className="text-indigo-300 font-bold">{part}</span>;
          return part;
        })}
      </pre>
    </div>
  );
};

const TopicButton: React.FC<{ active: boolean; onClick: () => void; title: string; desc: string }> = ({ active, onClick, title, desc }) => (
  <button onClick={onClick} className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group ${active ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-100' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
    <div className={`font-black uppercase tracking-tight text-sm ${active ? 'text-blue-800' : 'text-slate-700 group-hover:text-blue-700'}`}>{title}</div>
    <div className={`text-[10px] font-bold mt-1 ${active ? 'text-blue-600' : 'text-slate-400'}`}>{desc}</div>
  </button>
);

export default GCDStringsVisualizer;