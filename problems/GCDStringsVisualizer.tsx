
import React, { useState, useMemo } from 'react';
// Added missing 'Copy' icon to the lucide-react imports
import { RotateCcw, ChevronRight, ChevronLeft, Code2, BookOpen, Activity, Divide, Zap, Trophy, MessageSquare, Target, AlertCircle, Cpu, AlignLeft, X, ArrowRight, FileText, AlertTriangle, Check, Calculator, Scale, Copy } from 'lucide-react';

const APPROACHES = {
  brute: {
    id: 'brute',
    title: '1. Brute Force',
    subtitle: 'Prefix Iteration',
    icon: <AlertTriangle size={16} />,
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
    explanation: "This approach tries every possible prefix length of the shorter string. For each length that evenly divides both total lengths, it checks if the actual string prefix can perfectly recreate both originals.",
    lag: "SEARCH LAG: This is inefficient for long strings. We perform string replacements or concatenations repeatedly inside a loop, leading to redundant work."
  },
  optimal: {
    id: 'optimal',
    title: '2. Math Optimal',
    subtitle: 'Concatenation GCD',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N + M)',
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
    explanation: "The Gold Standard. It uses a mathematical insight: if a GCD exists, str1+str2 must equal str2+str1. Then, the length of the GCD string is simply the numeric GCD of the two string lengths.",
    lag: "PERFECT SOLUTION: Linear time complexity. It uses the Euclidean algorithm for length calculation and a single comparison check. Zero architectural lag."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">1071. Greatest Common Divisor of Strings</h2>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          For two strings <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">s</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">t</code>, we say "<code className="italic text-slate-800 text-pink-600 font-bold">t</code> divides <code className="italic text-slate-800 text-pink-600 font-bold">s</code>" if and only if <code className="bg-slate-100 px-1.5 rounded font-mono font-bold">s = t + t + t + ... + t</code> (i.e., <code className="italic text-slate-800 text-pink-600 font-bold">t</code> is concatenated with itself one or more times).
        </p>
        
        <p className="text-lg leading-relaxed">
          Given two strings <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">str1</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">str2</code>, return <em>the largest string</em> <code className="italic text-slate-800 text-pink-600 font-bold">x</code> <em>such that</em> <code className="italic text-slate-800 text-pink-600 font-bold">x</code> <em>divides both</em> <code className="bg-slate-100 px-1.5 rounded text-pink-600 font-mono font-bold">str1</code> <em>and</em> <code className="bg-slate-100 px-1.5 rounded text-pink-600 font-mono font-bold">str2</code>.
        </p>

        <div className="space-y-8 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> str1 = "ABCABC", str2 = "ABC"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "ABC"</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> str1 = "ABABAB", str2 = "ABAB"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "AB"</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> str1 = "LEET", str2 = "CODE"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> ""</p>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-100 mt-10">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <AlertCircle size={14} /> Constraints:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">1 {'<='} str1.length, str2.length {'<='} 1000</code></li>
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">str1</code> and <code className="bg-slate-100 px-1.5 rounded text-slate-800">str2</code> consist of English uppercase letters.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const GCDStringsVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Main Header */}
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
  const [copied, setCopied] = useState(false);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const s1 = str1 || "";
    const s2 = str2 || "";
    let result = "";
    let gcdLenGlobal = 0;

    const addStep = (phase: string, desc: string, line: number, extraState: any = {}) => {
      steps.push({
        phase,
        description: desc,
        line,
        state: { str1: s1, str2: s2, result, gcdLen: gcdLenGlobal, ...extraState }
      });
    };

    if (selectedApproach === 'optimal') {
      addStep("Method Entry", "Execution begins for gcdOfStrings.", 2);
      const c1 = s1 + s2;
      const c2 = s2 + s1;
      addStep("Concatenation Check", `Comparing s1+s2 ("${c1}") and s2+s1 ("${c2}").`, 3, { checkConcat: true, c1, c2 });
      
      const passCheck = c1 === c2;
      addStep("Check Result", passCheck ? "Strings commute! A common divisor string is guaranteed to exist." : "Strings do not commute. No possible GCD string exists.", 3, { checkConcat: true, c1, c2, match: passCheck });

      if (!passCheck) {
        addStep("Return Empty", "Returning empty string as per fail condition.", 4, { finished: true, result: "" });
        return steps;
      }

      addStep("GCD Setup", `Now calculating numeric GCD of lengths: ${s1.length} and ${s2.length}.`, 7, { a: s1.length, b: s2.length });
      
      const runGcdTrace = (a: number, b: number) => {
        addStep("GCD Recursion", `Inside gcd(${a}, ${b}). Checking base case b == 0.`, 11, { a, b, isGcd: true });
        if (b === 0) {
            addStep("GCD Base Case", `b is 0. Numeric GCD is ${a}.`, 11, { a, b, isGcd: true, finalA: a });
            return a;
        }
        addStep("GCD Recurse", `Recursing: gcd(${b}, ${a} % ${b} = ${a % b}).`, 11, { a, b, isGcd: true });
        return runGcdTrace(b, a % b);
      };

      const finalGcd = runGcdTrace(s1.length, s2.length);
      gcdLenGlobal = finalGcd;
      result = s1.substring(0, finalGcd);
      
      addStep("Extraction", `Numeric GCD found: ${finalGcd}. Extracting prefix of str1 with length ${finalGcd}.`, 7, { finalGcd });
      addStep("Final Result", `Resulting GCD string: "${result}". returning.`, 8, { finished: true, result });

    } else {
      addStep("Method Entry", "Execution begins for Brute Force approach.", 2);
      addStep("Initialization", `Recording lengths: n1 = ${s1.length}, n2 = ${s2.length}.`, 3, { n1: s1.length, n2: s2.length });
      
      const minLen = Math.min(s1.length, s2.length);
      addStep("Loop Start", `Iterating from shortest string length (${minLen}) down to 1.`, 4, { i: minLen });

      for (let i = minLen; i >= 1; i--) {
        addStep("Iteration", `Checking if length i=${i} divides both string lengths.`, 4, { i });
        const dividesBoth = s1.length % i === 0 && s2.length % i === 0;
        // Fixed typo 'divitesBoth' to 'dividesBoth' on line 219
        addStep("Divisibility Check", `${i} divides ${s1.length} and ${s2.length}: ${dividesBoth ? 'YES' : 'NO'}`, 5, { i, dividesBoth });
        
        if (dividesBoth) {
          const base = s1.substring(0, i);
          addStep("Extract Potential Base", `Candidate prefix identified: "${base}" (length ${i}).`, 6, { i, base, showExtraction: true });
          
          addStep("Call isDivisor (str1)", `Verifying if "${base}" can rebuild str1.`, 7, { i, base, checkingStr: 1 });
          addStep("isDivisor Logic", `Using string replacement: "${s1}".replace("${base}", "") == "".`, 16, { i, base, checkingStr: 1, helper: true });
          const works1 = s1.split(base).join("") === "";
          addStep("isDivisor Result", `str1 check: ${works1 ? "PASS" : "FAIL"}`, 16, { i, base, checkingStr: 1, helper: true, helperResult: works1 });

          if (works1) {
            addStep("Call isDivisor (str2)", `Verifying if "${base}" can rebuild str2.`, 7, { i, base, checkingStr: 2 });
            addStep("isDivisor Logic", `Using string replacement: "${s2}".replace("${base}", "") == "".`, 16, { i, base, checkingStr: 2, helper: true });
            const works2 = s2.split(base).join("") === "";
            addStep("isDivisor Result", `str2 check: ${works2 ? "PASS" : "FAIL"}`, 16, { i, base, checkingStr: 2, helper: true, helperResult: works2 });

            if (works2) {
                result = base;
                gcdLenGlobal = i;
                addStep("Success", `Prefix "${base}" is a valid common divisor! Returning result.`, 8, { finished: true, result, i });
                return steps;
            }
          }
          addStep("Next Iteration", `Prefix "${base}" failed tests. Trying next...`, 7, { i });
        }
      }
      addStep("Fail", "No common divisor found. Returning empty string.", 12, { finished: true, result: "" });
    }

    return steps;
  }, [str1, str2, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const cur = trace[currentStep] || trace[0];
  const { state } = cur;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      
      {/* Left Column */}
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
              <div className="flex items-center gap-2">
                <Code2 size={14} className="text-blue-400"/>
                <span className="font-bold text-slate-300">Solution.java</span>
              </div>
              <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors group">
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                <span className={copied ? "text-green-400" : "text-slate-300"}>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-6 font-mono text-[13px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                <div className="absolute left-0 right-0 bg-blue-500/15 border-l-4 border-blue-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${(cur.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} />
                {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                    <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} />
                ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-blue-600">
                 <Cpu size={18} />
                 <h4 className="text-sm font-black uppercase tracking-widest">Architectural Summary</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{APPROACHES[selectedApproach].explanation}</p>
          </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block pl-1">Input str1</label>
              <input value={str1} onChange={(e) => { setStr1(e.target.value.toUpperCase()); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner" maxLength={20} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-purple-600 uppercase tracking-widest block pl-1">Input str2</label>
              <input value={str2} onChange={(e) => { setStr2(e.target.value.toUpperCase()); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-inner" maxLength={20} />
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-6 border-t border-slate-100">
            <div className="w-full px-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                    <span>Scan</span>
                    <span className="text-blue-500 font-bold">Step {currentStep + 1} / {trace.length}</span>
                    <span>Result</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                    <div className="h-full bg-blue-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${(currentStep / (Math.max(1, trace.length - 1))) * 100}%` }} />
                </div>
            </div>
            <div className="flex items-center justify-between gap-4">
                <button onClick={() => setCurrentStep(0)} className="p-3 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-all" title="Reset Simulation"><RotateCcw size={20}/></button>
                <div className="flex gap-3 flex-1">
                    <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        <ChevronLeft size={18} /> Prev
                    </button>
                    <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold transition-all disabled:opacity-30 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
                        Next Action <ChevronRight size={18} />
                    </button>
                </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-blue-500/20 p-1.5 rounded-lg">
                <Target size={14} className="text-blue-400"/>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step Detail</span>
            </div>
            <div className="text-lg font-black tracking-tight mb-2 flex items-center gap-3">
                {state.helper && <div className="px-2 py-0.5 bg-indigo-500 text-[10px] rounded">Helper</div>}
                {cur.phase}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-700/50">{cur.description}</p>
        </div>

        {/* Visual Arena */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[400px] relative overflow-hidden flex flex-col justify-center items-center gap-12">
            
            {state.checkConcat && (
                <div className="w-full space-y-4 animate-in zoom-in duration-500">
                    <div className="space-y-1">
                        <div className="flex justify-between px-1"><span className="text-[9px] font-black text-blue-500 uppercase">str1 + str2</span><span className="text-[9px] font-mono text-slate-400">LEN: {state.c1.length}</span></div>
                        <div className={`p-3 rounded-xl border-2 font-mono text-xs break-all transition-all duration-500 ${state.match === false ? 'border-red-300 bg-red-50 text-red-700' : 'border-blue-200 bg-slate-50 text-slate-800'}`}>
                            {state.c1}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between px-1"><span className="text-[9px] font-black text-purple-500 uppercase">str2 + str1</span><span className="text-[9px] font-mono text-slate-400">LEN: {state.c2.length}</span></div>
                        <div className={`p-3 rounded-xl border-2 font-mono text-xs break-all transition-all duration-500 ${state.match === false ? 'border-red-300 bg-red-50 text-red-700' : 'border-purple-200 bg-slate-50 text-slate-800'}`}>
                            {state.c2}
                        </div>
                    </div>
                </div>
            )}

            {state.isGcd && (
                <div className="bg-slate-900 rounded-2xl p-6 text-white w-full shadow-2xl animate-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Euclidean Lab</span>
                        <div className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded-full border border-indigo-500/30 font-mono">gcd(a, b)</div>
                    </div>
                    <div className="flex items-center justify-center gap-8 font-mono">
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] text-slate-500 mb-1">A</span>
                            <div className="text-3xl font-black">{state.a}</div>
                        </div>
                        <div className="text-2xl text-slate-600">%</div>
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] text-slate-500 mb-1">B</span>
                            <div className={`text-3xl font-black transition-all duration-300 ${state.b === 0 ? 'text-green-400 scale-110' : 'text-white'}`}>{state.b}</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full space-y-10">
                <div className="relative pl-14">
                    <span className="absolute left-0 top-3 text-[10px] font-black text-blue-500 uppercase w-10 text-right">str1</span>
                    <div className="flex gap-1 flex-wrap">
                        {str1.split('').map((char, idx) => {
                            const isCandidate = (selectedApproach === 'brute' && idx < (state.i || 0)) || (selectedApproach === 'optimal' && idx < state.gcdLen);
                            const isFocused = state.checkingStr === 1 && state.helper;
                            return (
                                <div key={idx} className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center font-mono font-black text-xs transition-all duration-300 
                                    ${isCandidate ? 'bg-green-50 border-green-300 text-green-700 scale-110 shadow-sm z-10' : 'bg-white border-slate-100 text-slate-300'}
                                    ${isFocused && !isCandidate ? 'animate-pulse bg-indigo-50 border-indigo-200' : ''}
                                `}>
                                    {char}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="relative pl-14">
                    <span className="absolute left-0 top-3 text-[10px] font-black text-purple-500 uppercase w-10 text-right">str2</span>
                    <div className="flex gap-1 flex-wrap">
                        {str2.split('').map((char, idx) => {
                            const isCandidate = (selectedApproach === 'brute' && idx < (state.i || 0)) || (selectedApproach === 'optimal' && idx < state.gcdLen);
                            const isFocused = state.checkingStr === 2 && state.helper;
                            return (
                                <div key={idx} className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center font-mono font-black text-xs transition-all duration-300 
                                    ${isCandidate ? 'bg-green-50 border-green-300 text-green-700 scale-110 shadow-sm z-10' : 'bg-white border-slate-100 text-slate-300'}
                                    ${isFocused && !isCandidate ? 'animate-pulse bg-indigo-50 border-indigo-200' : ''}
                                `}>
                                    {char}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {state.finished && (
               <div className="animate-in zoom-in duration-500 pt-4">
                  <div className={`bg-white border-2 px-12 py-8 rounded-[2.5rem] flex flex-col items-center gap-4 shadow-2xl transition-all duration-700 ${state.result ? 'border-green-200 ring-8 ring-green-50' : 'border-slate-200 opacity-80'}`}>
                      {state.result ? (
                         <div className="bg-green-100 p-4 rounded-full"><Check className="text-green-600" size={32} strokeWidth={3}/></div>
                      ) : (
                         <div className="bg-slate-100 p-4 rounded-full"><X className="text-slate-400" size={32} strokeWidth={3}/></div>
                      )}
                      <div className="text-center">
                          <span className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-1">GCD Result</span>
                          <span className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">
                            {state.result ? `"${state.result}"` : "Empty String"}
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

const LearnMode = () => {
  const [selectedTopic, setSelectedTopic] = useState('problem');
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
      <div className="lg:col-span-3 space-y-2">
         <TopicButton active={selectedTopic === 'problem'} onClick={() => setSelectedTopic('problem')} title="1. Divisibility" desc="Atomic Building Blocks" />
         <TopicButton active={selectedTopic === 'aha'} onClick={() => setSelectedTopic('aha')} title="2. Aha! Logic" desc="Commutativity Proof" />
         <TopicButton active={selectedTopic === 'algo'} onClick={() => setSelectedTopic('algo')} title="3. The Algorithm" desc="Euclidean Bridge" />
         <TopicButton active={selectedTopic === 'eff'} onClick={() => setSelectedTopic('eff')} title="4. Efficiency" desc="Complexity Deep-Dive" />
      </div>
      <div className="lg:col-span-9 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 min-h-[600px]">
         {selectedTopic === 'problem' && (
           <div className="space-y-6 animate-in slide-in-from-right-4">
             <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-black mb-1">
                 <AlignLeft size={16}/> Theoretical Foundation
             </div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">Understanding String Divisors</h2>
             <p className="text-slate-600 leading-relaxed text-lg">
                In mathematics, we say 2 divides 6. In strings, we say pattern <code className="font-bold text-blue-600">X</code> divides <code className="font-bold text-slate-900">S</code> if and only if <code className="font-bold">S</code> is just a repeated sequence of <code className="font-bold">X</code>.
             </p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner">
                   <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2"><Check className="text-green-500" size={18}/> Perfect Match</h3>
                   <p className="text-sm text-slate-500 leading-relaxed">"ABABAB" is divisible by "AB". Why? Because <span className="font-mono bg-white px-1">"AB" + "AB" + "AB"</span> creates the whole string with zero leftovers.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner">
                   <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2"><X className="text-red-500" size={18}/> The Fragment Failure</h3>
                   <p className="text-sm text-slate-500 leading-relaxed">"ABCDEF" is NOT divisible by "ABC". Even though "ABC" is a prefix, repeating it gives "ABCABC", which doesn't match the target.</p>
                </div>
             </div>
             <p className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm italic border-l-4 border-blue-500">
               CORE GOAL: Find the LARGEST string that divides both STR1 and STR2.
             </p>
           </div>
         )}
         {selectedTopic === 'aha' && (
           <div className="space-y-6 animate-in slide-in-from-right-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">The "Aha!" Logic: Commutativity</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Here is a professional-level insight: If two strings <code className="font-bold">s1</code> and <code className="font-bold">s2</code> share <span className="underline decoration-indigo-400">any</span> common divisor, they must "commute" when concatenated.
              </p>
              <div className="bg-slate-900 p-8 rounded-3xl text-center font-mono text-2xl text-blue-300 shadow-2xl border-4 border-slate-800">
                 str1 + str2 == str2 + str1
              </div>
              <div className="space-y-4 pt-4">
                <p className="text-sm text-slate-500 font-medium">The Proof:</p>
                <p className="text-sm text-slate-600 leading-relaxed">If both strings are built from the same "atom" <b>P</b>, then s1 = P<sup>n</sup> and s2 = P<sup>m</sup>. Therefore, both s1+s2 and s2+s1 will equal P<sup>n+m</sup>. If they do NOT match, it is mathematically impossible for a common divisor to exist.</p>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex gap-4 items-start shadow-sm">
                   <Zap className="shrink-0 text-amber-500" />
                   <p className="text-xs font-bold leading-relaxed">ENGINEERING SHORTCUT: This single check replaces expensive loops and recursion. If this condition fails, we return an empty string in O(N+M) time immediately.</p>
                </div>
              </div>
           </div>
         )}
         {selectedTopic === 'algo' && (
           <div className="space-y-6 animate-in slide-in-from-right-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">The Algorithm: Euclidean Bridge</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                Once we've proven a common pattern exists using the "Aha!" logic, how do we find the pattern's length? We use <b>Numeric Number Theory</b>.
              </p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 shadow-inner">
                 <p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-center mb-2">The Execution Bridge</p>
                 <div className="flex items-center gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex-1 text-center">
                       <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Existence Check</span>
                       <span className="text-xs font-bold text-green-600">Match Found</span>
                    </div>
                    <ArrowRight className="text-slate-300" />
                    <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex-1 text-center">
                       <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Numeric GCD</span>
                       <span className="text-lg font-black italic">GCD(len1, len2)</span>
                    </div>
                    <ArrowRight className="text-slate-300" />
                    <div className="bg-blue-600 p-4 rounded-xl shadow-lg text-white flex-1 text-center ring-4 ring-blue-100">
                       <span className="text-[10px] font-black uppercase opacity-70 block mb-1">Extract Result</span>
                       <span className="text-sm font-black italic">GCD String</span>
                    </div>
                 </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pt-4">
                The Greatest Common Divisor string MUST have a length equal to the Greatest Common Divisor of the two lengths. We use the **Euclidean Algorithm** (using modulo) to find this length in logarithmic time.
              </p>
           </div>
         )}
         {selectedTopic === 'eff' && (
           <div className="space-y-6 animate-in slide-in-from-right-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Efficiency Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl space-y-3">
                    <div className="font-black text-blue-600 text-xs uppercase tracking-widest">Time Complexity</div>
                    <div className="text-2xl font-black text-slate-900">O(N + M)</div>
                    <p className="text-xs text-slate-500 leading-relaxed">We perform a single string concatenation and comparison. The numeric GCD is nearly constant time for numbers of this scale.</p>
                 </div>
                 <div className="p-6 bg-purple-50 border border-purple-100 rounded-2xl space-y-3">
                    <div className="font-black text-purple-600 text-xs uppercase tracking-widest">Space Complexity</div>
                    <div className="text-2xl font-black text-slate-900">O(N + M)</div>
                    <p className="text-xs text-slate-500 leading-relaxed">Required to store the concatenated strings for the existence check.</p>
                 </div>
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
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <MessageSquare className="text-blue-500" size={20} />
                    Common Q&A
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"Why does s1+s2 == s2+s1 prove a common divisor exists?"</p>
                        <p className="leading-relaxed text-xs italic">"In string algebra, two strings commute if and only if they are both powers of the same base string. If they don't commute, no string can divide both."</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"Can we solve this without the math trick?"</p>
                        <p className="leading-relaxed text-xs italic">"Yes, using the Brute Force approach by iterating prefix lengths and checking divisibility, but that results in O(min(N,M) * (N+M)) complexity instead of the linear O(N+M) provided by the math property."</p>
                    </div>
                </div>
            </div>
            <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 relative z-10">
                    <Target className="text-amber-400" size={20} />
                    The Senior Engineer Pitch
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                    "My approach leverages the fundamental property of string commutativity. By verifying that str1 + str2 matches str2 + str1, I establish a O(N+M) existence check. For the result, I calculate the GCD of the lengths using the Euclidean algorithm, which is numerically optimal. This reduces the problem to a simple substring operation, ensuring peak performance on strings of any magnitude."
                </p>
            </div>
        </div>
        <div className="space-y-6 text-slate-800">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2 mb-4">
                    <AlertCircle size={20} />
                    Key Concepts
                </h3>
                <div className="space-y-4 text-xs">
                    <div className="bg-white p-4 rounded-xl border border-amber-100">
                        <span className="font-black text-amber-600 block mb-1 uppercase tracking-widest text-[10px]">RECURSION VS ITERATION</span>
                        <p className="leading-relaxed">Euclidean GCD is naturally recursive. Mentioning both versions (subtraction vs remainder) shows depth.</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-amber-100">
                        <span className="font-black text-amber-600 block mb-1 uppercase tracking-widest text-[10px]">TIME COMPLEXITY</span>
                        <p className="leading-relaxed">O(N + M) is the lower bound because we must visit every character once for the comparison.</p>
                    </div>
                </div>
            </div>
            <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-xl shadow-blue-100 flex flex-col justify-center">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                    <Check size={20} />
                    Performance Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4 text-[10px] font-mono">
                    <div className="bg-blue-700/50 p-4 rounded-xl border border-blue-400/30">
                        <div className="font-black opacity-60 uppercase mb-1">Time</div>
                        O(N + M)
                    </div>
                    <div className="bg-blue-700/50 p-4 rounded-xl border border-blue-400/30">
                        <div className="font-black opacity-60 uppercase mb-1">Space</div>
                        O(N + M)
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|StringBuilder|Math)\b|\b\d+\b|\b(?:substring|equals|length|min|max|gcd|isEmpty|replace)\b)/g).filter(Boolean);
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
          if (['substring', 'equals', 'length', 'min', 'max', 'gcd', 'isEmpty', 'replace'].includes(part)) return <span key={i} className="text-indigo-300 font-bold">{part}</span>;
          return part;
        })}
      </pre>
    </div>
  );
};

const TopicButton = ({ active, onClick, title, desc }: { active: boolean; onClick: () => void; title: string; desc: string }) => (
  <button onClick={onClick} className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group ${active ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-100' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
    <div className={`font-black uppercase tracking-tight text-sm ${active ? 'text-blue-800' : 'text-slate-700 group-hover:text-blue-700'}`}>{title}</div>
    <div className={`text-[10px] font-bold mt-1 ${active ? 'text-blue-600' : 'text-slate-400'}`}>{desc}</div>
  </button>
);

export default GCDStringsVisualizer;
