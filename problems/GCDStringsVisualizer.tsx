import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight, Check, X, Divide, Code2, ArrowRight, BookOpen, Activity, Lightbulb, Scale, Layers, Zap } from 'lucide-react';

const GCDStringsVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'learn'>('visualizer');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Main Header & Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Divide className="text-blue-600" /> GCD of Strings
            </h1>
            <p className="text-slate-500 text-sm mt-1">1071. Greatest Common Divisor of Strings</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('visualizer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'visualizer' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Activity size={16} /> Visualizer
            </button>
            <button 
              onClick={() => setActiveTab('learn')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'learn' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <BookOpen size={16} /> Learn & Understand
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'visualizer' ? <VisualizerMode /> : <LearnMode />}
        
      </div>
    </div>
  );
};

// --- MODE 1: THE INTERACTIVE VISUALIZER ---
const VisualizerMode = () => {
  // Inputs
  const [str1, setStr1] = useState("ABCABC");
  const [str2, setStr2] = useState("ABC");
  
  // Playback State
  const [currentStep, setCurrentStep] = useState(0);

  // --- Logic Engine ---
  const trace = useMemo(() => {
    const steps: any[] = [];
    const s1 = str1 || "";
    const s2 = str2 || "";
    
    // Helper to add steps with code mapping
    const addStep = (phase: string, desc: string, lineNum: number, extraData: any = {}) => {
      steps.push({
        phase,
        description: desc,
        line: lineNum,
        ...extraData
      });
    };

    // Step 0: Initial State
    addStep("Start", "Function called with str1 and str2.", 2, { 
       checkPassed: null, gcdState: null, result: null 
    });

    // --- Phase 1: Consistency Check ---
    const combo1 = s1 + s2;
    const combo2 = s2 + s1;
    const passed = combo1 === combo2;

    addStep("Concatenation Check", `Checking condition: (str1 + str2).equals(str2 + str1)`, 4, {
      checkData: { combo1, combo2, mismatchIndex: -1 },
      checkPassed: null,
      gcdState: null
    });

    // Find mismatch for visualization
    let mismatchIdx = -1;
    if (!passed) {
      for(let i=0; i<combo1.length; i++) {
        if(combo1[i] !== combo2[i]) {
          mismatchIdx = i;
          break;
        }
      }
    }

    addStep("Concatenation Check", passed 
        ? "Match! The concatenated strings are identical. Proceeding..." 
        : `Mismatch at index ${mismatchIdx}. The strings do not share a common divisor.`, 
      4, 
      {
        checkData: { combo1, combo2, mismatchIndex: mismatchIdx },
        checkPassed: passed,
        gcdState: null
      }
    );

    if (!passed) {
       addStep("Result", "Condition failed. Returning empty string.", 5, {
        checkPassed: false,
        result: ""
      });
      return steps;
    }

    // --- Phase 2: GCD Calculation ---
    let a = s1.length;
    let b = s2.length;
    
    addStep("GCD Calculation", `Calling helper: gcd(${a}, ${b})`, 8, {
      checkPassed: true,
      gcdState: { a, b, stepDesc: "Initial Call" }
    });

    // Simulate Euclidean Algorithm steps mapped to code lines
    while (b > 0) {
      addStep("GCD Recursion", `Inside gcd(${a}, ${b}). b is not 0.`, 13, {
         checkPassed: true,
         gcdState: { a, b, stepDesc: "Check base case (b==0)" }
      });

      const remainder = a % b;
      addStep("GCD Recursion", `Recursive call: gcd(${b}, ${a} % ${b}) -> gcd(${b}, ${remainder})`, 14, {
        checkPassed: true,
        gcdState: { a: b, b: remainder, stepDesc: `Calculated remainder ${remainder}` }
      });
      a = b;
      b = remainder;
    }

    addStep("GCD Recursion", `Inside gcd(${a}, ${b}). b is 0! Base case reached.`, 13, {
        checkPassed: true,
        gcdState: { a, b, stepDesc: "Base case met" }
    });
    
    // Return from GCD
    const gcdVal = a;
    addStep("GCD Calculation", `GCD function returns ${gcdVal}.`, 8, {
        checkPassed: true,
        gcdState: { a: gcdVal, b: 0, stepDesc: "Returned to main" }
    });

    // --- Phase 3: Result ---
    const resultStr = s1.substring(0, gcdVal);
    addStep("Result", `Returning substring(0, ${gcdVal}) -> "${resultStr}"`, 10, {
      checkPassed: true,
      gcdState: { a: gcdVal, b: 0 },
      result: resultStr,
      highlightLen: gcdVal
    });

    return steps;
  }, [str1, str2]);

  // Handlers
  const loadExample = (s1: string, s2: string) => {
    setStr1(s1);
    setStr2(s2);
    setCurrentStep(0);
  };

  const currentState = trace[currentStep] || trace[0];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-in fade-in duration-500">
      {/* LEFT COLUMN: Code View (5 cols) */}
      <div className="xl:col-span-5 flex flex-col gap-6">
          <div className="bg-[#1e1e1e] rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="bg-[#2d2d2d] px-4 py-2 text-xs font-mono text-slate-400 flex justify-between items-center border-b border-slate-700">
              <span className="flex items-center gap-2"><Code2 size={14}/> Solution.java</span>
            </div>
            <div className="p-4 overflow-x-auto font-mono text-sm leading-6 relative flex-1">
                {/* Line Highlighter */}
                <div 
                  className="absolute left-0 right-0 bg-blue-500/20 border-l-2 border-blue-500 transition-all duration-300 pointer-events-none"
                  style={{ 
                    top: `${(currentState.line * 24) + 16 - 24}px`, 
                    height: '24px' 
                  }}
                />
                <CodeLine num={1} code={`class Solution {`} />
                <CodeLine num={2} code={`    public String gcdOfStrings(String str1, String str2) {`} active={currentState.line===2} />
                <CodeLine num={3} code={`        // 1. Check consistency`} />
                <CodeLine num={4} code={`        if (!(str1 + str2).equals(str2 + str1)) {`} active={currentState.line===4} />
                <CodeLine num={5} code={`            return "";`} active={currentState.line===5} />
                <CodeLine num={6} code={`        }`} />
                <CodeLine num={7} code={`        // 2. GCD of lengths`} />
                <CodeLine num={8} code={`        int gcdLength = gcd(str1.length(), str2.length());`} active={currentState.line===8} />
                <CodeLine num={9} code={`        // 3. Result`} />
                <CodeLine num={10} code={`        return str1.substring(0, gcdLength);`} active={currentState.line===10} />
                <CodeLine num={11} code={`    }`} />
                <CodeLine num={12} code={``} />
                <CodeLine num={13} code={`    private int gcd(int a, int b) {`} active={currentState.line===13} />
                <CodeLine num={14} code={`        if (b == 0) return a;`} active={currentState.line===14} />
                <CodeLine num={15} code={`        return gcd(b, a % b);`} active={currentState.line===15} />
                <CodeLine num={16} code={`    }`} />
                <CodeLine num={17} code={`}`} />
            </div>
          </div>
          
          {/* Explanation Box */}
          <div className="bg-slate-800 text-slate-200 rounded-xl p-6 shadow-lg border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Current Action</div>
              <div className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">Line {currentState.line}</div>
            </div>
            <div className="text-lg font-bold text-white mb-2">{currentState.phase}</div>
            <p className="text-sm text-slate-300 leading-relaxed border-t border-slate-600 pt-2">
              {currentState.description}
            </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Visuals & Controls (7 cols) */}
      <div className="xl:col-span-7 space-y-6">
        
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">String 1</label>
              <input 
                value={str1}
                onChange={(e) => { setStr1(e.target.value.toUpperCase()); setCurrentStep(0); }}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 font-mono focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                maxLength={12}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-purple-600 uppercase tracking-wider block mb-1">String 2</label>
              <input 
                value={str2}
                onChange={(e) => { setStr2(e.target.value.toUpperCase()); setCurrentStep(0); }}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 font-mono focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                maxLength={12}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
            {/* Progress Bar */}
            <div className="w-full">
                <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
                    <span>Start</span>
                    <span>Step {currentStep + 1} / {trace.length}</span>
                    <span>End</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-blue-500 transition-all duration-300 ease-out"
                        style={{ width: `${(currentStep / (Math.max(1, trace.length - 1))) * 100}%` }}
                    />
                </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setCurrentStep(0)} 
                    disabled={currentStep === 0}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-30"
                    title="Reset"
                >
                    <RotateCcw size={20} />
                </button>

                <div className="flex gap-3">
                    <button 
                        onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                        disabled={currentStep === 0}
                        className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <ChevronLeft size={18} /> Prev
                    </button>
                    <button 
                        onClick={() => setCurrentStep(prev => Math.min(trace.length - 1, prev + 1))}
                        disabled={currentStep === trace.length - 1}
                        className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm shadow-blue-200"
                    >
                        Next <ChevronRight size={18} />
                    </button>
                </div>
            </div>
          </div>

          <div className="flex gap-2 text-xs justify-center pt-2 border-t border-slate-50 mt-2">
              <button onClick={() => loadExample("ABCABC", "ABC")} className="px-3 py-1 bg-slate-50 text-slate-600 rounded border border-slate-200 hover:bg-slate-100">Example 1 (Match)</button>
              <button onClick={() => loadExample("ABABAB", "ABAB")} className="px-3 py-1 bg-slate-50 text-slate-600 rounded border border-slate-200 hover:bg-slate-100">Example 2 (Match)</button>
              <button onClick={() => loadExample("LEET", "CODE")} className="px-3 py-1 bg-slate-50 text-slate-600 rounded border border-slate-200 hover:bg-slate-100">Example 3 (Fail)</button>
          </div>
        </div>

        {/* Phase 1: Concatenation Visualization */}
        <div className={`bg-white rounded-xl shadow-sm border p-6 transition-all duration-500 ${currentState.phase === "Concatenation Check" ? 'border-blue-500 ring-2 ring-blue-100 opacity-100' : 'border-slate-200 opacity-50'}`}>
          <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-700">1. Concatenation Check</h3>
              {currentState.checkPassed === true && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded flex items-center gap-1"><Check size={12}/> Passed</span>}
              {currentState.checkPassed === false && <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded flex items-center gap-1"><X size={12}/> Failed</span>}
          </div>

          <div className="space-y-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
            {/* Row 1: str1 + str2 */}
            <div className="flex items-center gap-4 min-w-max">
                <div className="w-20 text-xs font-bold text-slate-400 uppercase text-right">str1 + str2</div>
                <div className="flex">
                  <div className="flex border-2 border-blue-200 rounded-l-lg overflow-hidden">
                    {str1.split('').map((c, i) => (
                        <div key={i} className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-700 font-mono font-bold border-r border-blue-100 last:border-0">{c}</div>
                    ))}
                  </div>
                  <div className="flex border-2 border-purple-200 rounded-r-lg overflow-hidden -ml-[2px] z-10">
                    {str2.split('').map((c, i) => (
                        <div key={i} className="w-8 h-8 flex items-center justify-center bg-purple-50 text-purple-700 font-mono font-bold border-r border-purple-100 last:border-0">{c}</div>
                    ))}
                  </div>
                </div>
            </div>

            {/* Row 2: str2 + str1 */}
            <div className="flex items-center gap-4 min-w-max">
                <div className="w-20 text-xs font-bold text-slate-400 uppercase text-right">str2 + str1</div>
                <div className="flex relative">
                  <div className="flex border-2 border-purple-200 rounded-l-lg overflow-hidden">
                    {str2.split('').map((c, i) => (
                        <div key={i} className="w-8 h-8 flex items-center justify-center bg-purple-50 text-purple-700 font-mono font-bold border-r border-purple-100 last:border-0">{c}</div>
                    ))}
                  </div>
                  <div className="flex border-2 border-blue-200 rounded-r-lg overflow-hidden -ml-[2px] z-10">
                    {str1.split('').map((c, i) => (
                        <div key={i} className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-700 font-mono font-bold border-r border-blue-100 last:border-0">{c}</div>
                    ))}
                  </div>

                  {/* Error Highlight Overlay */}
                  {currentState.checkData?.mismatchIndex >= 0 && (
                      <div 
                        className="absolute top-0 bottom-0 border-2 border-red-500 bg-red-500/20 z-20"
                        style={{ 
                          left: `${currentState.checkData.mismatchIndex * 32}px`, 
                          width: '32px' 
                        }}
                      />
                  )}
                </div>
            </div>
          </div>
        </div>

        {/* Phase 2: GCD Math */}
        <div className={`bg-white rounded-xl shadow-sm border p-6 transition-all duration-500 ${currentState.phase.includes("GCD") ? 'border-amber-500 ring-2 ring-amber-100 opacity-100' : 'border-slate-200 opacity-50'}`}>
            <h3 className="font-bold text-slate-700 mb-4">2. Euclidean Algorithm (Lengths)</h3>
            
            <div className="flex items-center justify-center gap-8 py-4">
              <div className="flex flex-col items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase mb-1">Length A</span>
                  <div className="text-3xl font-mono font-bold text-slate-800">{currentState.gcdState?.a ?? str1.length}</div>
              </div>
              <div className="text-2xl text-slate-300 font-bold">%</div>
              <div className="flex flex-col items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase mb-1">Length B</span>
                  <div className="text-3xl font-mono font-bold text-slate-800">{currentState.gcdState?.b ?? str2.length}</div>
              </div>
              <ArrowRight className="text-slate-300" />
              <div className="flex flex-col items-center bg-slate-50 px-4 py-2 rounded">
                  <span className="text-xs text-slate-400 font-bold uppercase mb-1">Step</span>
                  <div className="text-sm font-medium text-slate-600">{currentState.gcdState?.stepDesc || "Waiting..."}</div>
              </div>
            </div>
        </div>

        {/* Phase 3: Result */}
        <div className={`bg-white rounded-xl shadow-sm border p-6 transition-all duration-500 ${currentState.phase === "Result" ? 'border-green-500 ring-2 ring-green-100 opacity-100' : 'border-slate-200 opacity-50'}`}>
            <h3 className="font-bold text-slate-700 mb-4">3. Final Result</h3>
            
            {currentState.result !== undefined && currentState.result !== null && (
              <div className="flex flex-col items-center">
                {currentState.result === "" ? (
                    <div className="text-red-500 font-bold flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-100">
                      <X size={20} /> Empty String (No GCD)
                    </div>
                ) : (
                    <div className="space-y-2 text-center">
                      <div className="flex justify-center border border-slate-200 rounded-lg p-1 bg-slate-50">
                          {str1.split('').map((c, i) => (
                            <div key={i} className={`
                                w-8 h-8 flex items-center justify-center font-mono font-bold rounded
                                ${i < currentState.highlightLen ? 'bg-green-500 text-white shadow-lg scale-110 z-10' : 'text-slate-300'}
                            `}>
                                {c}
                            </div>
                          ))}
                      </div>
                      <div className="text-green-600 font-mono font-bold text-xl mt-4">
                          "{currentState.result}"
                      </div>
                    </div>
                )}
              </div>
            )}
        </div>

      </div>
    </div>
  );
}

// --- MODE 2: THE LEARNING MODE ---
const LearnMode = () => {
  const [selectedTopic, setSelectedTopic] = useState('problem');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
      {/* Navigation Sidebar (3 cols) */}
      <div className="lg:col-span-3 space-y-2">
         <TopicButton active={selectedTopic === 'problem'} onClick={() => setSelectedTopic('problem')} title="1. Problem Statement" desc="Understanding Divisors" />
         <TopicButton active={selectedTopic === 'logic'} onClick={() => setSelectedTopic('logic')} title="2. The 'Aha!' Logic" desc="The Concatenation Trick" />
         <TopicButton active={selectedTopic === 'algo'} onClick={() => setSelectedTopic('algo')} title="3. The Algorithm" desc="Why Euclidean Works" />
         <TopicButton active={selectedTopic === 'compare'} onClick={() => setSelectedTopic('compare')} title="4. Efficiency" desc="Brute Force vs Optimal" />
      </div>

      {/* Content Area (9 cols) */}
      <div className="lg:col-span-9 bg-white rounded-xl border border-slate-200 shadow-sm p-8 min-h-[600px] flex flex-col">
         
         {selectedTopic === 'problem' && (
           <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
             <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">What does it mean for a string to "divide" another?</h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  In math, <code className="bg-slate-100 px-1 rounded font-bold">3</code> divides <code className="bg-slate-100 px-1 rounded font-bold">6</code> because you can add <code className="bg-slate-100 px-1 rounded font-bold">3 + 3</code> to get exactly 6.
                  <br/>
                  In strings, <code className="bg-blue-100 text-blue-800 px-1 rounded font-bold">T</code> divides <code className="bg-slate-100 px-1 rounded font-bold">S</code> if you can repeat <code className="bg-blue-100 text-blue-800 px-1 rounded font-bold">T</code> some number of times to get exactly <code className="bg-slate-100 px-1 rounded font-bold">S</code>.
                </p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                   <h3 className="font-bold text-green-700 mb-4 flex items-center gap-2"><Check size={20}/> Valid Example</h3>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm text-slate-500">
                         <span>Target (S)</span>
                         <span className="font-mono">"ABABAB"</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-slate-500">
                         <span>Divisor (T)</span>
                         <span className="font-mono">"AB"</span>
                      </div>
                      <div className="p-3 bg-white rounded border border-slate-200 text-center">
                         <span className="text-blue-600 font-bold">AB</span> + 
                         <span className="text-blue-600 font-bold">AB</span> + 
                         <span className="text-blue-600 font-bold">AB</span> 
                         <div className="border-t mt-2 pt-2 text-slate-400 text-xs">Fits perfectly (3 times)</div>
                      </div>
                   </div>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                   <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2"><X size={20}/> Invalid Example</h3>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm text-slate-500">
                         <span>Target (S)</span>
                         <span className="font-mono">"ABAB"</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-slate-500">
                         <span>Divisor (T)</span>
                         <span className="font-mono">"ABA"</span>
                      </div>
                      <div className="p-3 bg-white rounded border border-slate-200 text-center relative overflow-hidden">
                         <span className="text-red-600 font-bold">ABA</span> + 
                         <span className="text-red-600 font-bold opacity-50">ABA...</span>
                         <div className="absolute top-0 right-0 bottom-0 bg-white/80 flex items-center justify-center text-red-600 font-bold text-xs rotate-12 border-l border-red-100">
                           Overflows!
                         </div>
                      </div>
                      <div className="text-center text-slate-400 text-xs mt-1">
                         ABA + ABA = ABAABA (Too long!)
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-bold text-blue-900 mb-2">Critical Rule: The Prefix Property</h3>
                <p className="text-blue-800 text-sm">
                   Any common divisor <strong>must</strong> start at index 0. We don't care about substrings in the middle (like "B" inside "ABA"). 
                   We only care about a string <code>X</code> that starts at the beginning and repeats until the end.
                </p>
             </div>
           </div>
         )}

         {selectedTopic === 'logic' && (
           <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div>
                 <h2 className="text-2xl font-bold text-slate-800 mb-2">Why does <code className="text-blue-600">S1 + S2 == S2 + S1</code> work?</h2>
                 <p className="text-slate-600 leading-relaxed text-lg">
                   This is the clever math trick. If two strings are made of the same repeating block, they are effectively "commutative" under addition (concatenation).
                 </p>
              </div>

              <div className="bg-white border-2 border-slate-100 rounded-xl p-6 shadow-sm">
                 <h3 className="text-lg font-bold text-slate-700 mb-6 text-center">The "Block" Proof</h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Visual Proof */}
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assume S1 has 2 blocks</div>
                          <div className="flex gap-1">
                             <div className="h-10 w-16 bg-blue-500 rounded text-white font-bold flex items-center justify-center">Block</div>
                             <div className="h-10 w-16 bg-blue-500 rounded text-white font-bold flex items-center justify-center">Block</div>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assume S2 has 1 block</div>
                          <div className="flex gap-1">
                             <div className="h-10 w-16 bg-purple-500 rounded text-white font-bold flex items-center justify-center">Block</div>
                          </div>
                       </div>
                    </div>

                    {/* Result */}
                    <div className="relative p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <div className="absolute -left-6 top-1/2 -translate-y-1/2">
                           <ArrowRight className="text-slate-300" />
                        </div>
                        <div className="space-y-4">
                           <div className="flex items-center gap-2">
                              <span className="w-16 font-mono font-bold text-slate-500 text-right">S1+S2</span>
                              <div className="flex gap-0.5 scale-75 origin-left">
                                 <div className="h-10 w-16 bg-blue-500 text-white flex items-center justify-center text-xs">Block</div>
                                 <div className="h-10 w-16 bg-blue-500 text-white flex items-center justify-center text-xs">Block</div>
                                 <div className="h-10 w-16 bg-purple-500 text-white flex items-center justify-center text-xs">Block</div>
                              </div>
                           </div>
                           <div className="flex items-center gap-2">
                              <span className="w-16 font-mono font-bold text-slate-500 text-right">S2+S1</span>
                              <div className="flex gap-0.5 scale-75 origin-left">
                                 <div className="h-10 w-16 bg-purple-500 text-white flex items-center justify-center text-xs">Block</div>
                                 <div className="h-10 w-16 bg-blue-500 text-white flex items-center justify-center text-xs">Block</div>
                                 <div className="h-10 w-16 bg-blue-500 text-white flex items-center justify-center text-xs">Block</div>
                              </div>
                           </div>
                        </div>
                        <div className="mt-4 text-center text-green-600 font-bold text-sm">
                           Since "Block" is the same content, the result is identical!
                        </div>
                    </div>
                 </div>
              </div>

              <div className="p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-900 rounded-r">
                 <h4 className="font-bold flex items-center gap-2"><Lightbulb size={18}/> Why is this check necessary?</h4>
                 <p className="mt-1 text-sm">
                    Without this check, we might find a numeric GCD (e.g., GCD of 6 and 4 is 2), but the substrings of length 2 might not actually match!
                    <br/>
                    Example: <code>"ABCDEF"</code> (len 6) and <code>"WXYZ"</code> (len 4). GCD is 2. 
                    But <code>"AB"</code> is not <code>"WX"</code>. The concatenation check catches this efficiently.
                 </p>
              </div>
           </div>
         )}

         {selectedTopic === 'algo' && (
           <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div>
                 <h2 className="text-2xl font-bold text-slate-800 mb-2">Why does the Math work?</h2>
                 <p className="text-slate-600 leading-relaxed text-lg">
                    Once we know a common divisor exists (from the concatenation check), finding the length of the <em>Greatest</em> Common Divisor string is purely a math problem.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 border-b pb-2">String View</h3>
                    <div className="space-y-2">
                       <div className="flex items-center gap-2">
                          <span className="font-mono text-sm w-8">S1</span>
                          <div className="flex">
                             <div className="w-12 h-8 bg-blue-100 border border-blue-300 flex items-center justify-center text-xs">X</div>
                             <div className="w-12 h-8 bg-blue-100 border border-blue-300 flex items-center justify-center text-xs">X</div>
                             <div className="w-12 h-8 bg-blue-100 border border-blue-300 flex items-center justify-center text-xs">X</div>
                             <div className="w-12 h-8 bg-blue-100 border border-blue-300 flex items-center justify-center text-xs">X</div>
                             <div className="w-12 h-8 bg-blue-100 border border-blue-300 flex items-center justify-center text-xs">X</div>
                             <div className="w-12 h-8 bg-blue-100 border border-blue-300 flex items-center justify-center text-xs">X</div>
                          </div>
                          <span className="text-xs text-slate-400">(6 times)</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="font-mono text-sm w-8">S2</span>
                          <div className="flex">
                             <div className="w-12 h-8 bg-blue-100 border border-blue-300 flex items-center justify-center text-xs">X</div>
                             <div className="w-12 h-8 bg-blue-100 border border-blue-300 flex items-center justify-center text-xs">X</div>
                             <div className="w-12 h-8 bg-blue-100 border border-blue-300 flex items-center justify-center text-xs">X</div>
                             <div className="w-12 h-8 bg-blue-100 border border-blue-300 flex items-center justify-center text-xs">X</div>
                          </div>
                          <span className="text-xs text-slate-400">(4 times)</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 border-b pb-2">Math View</h3>
                    <div className="space-y-4 text-sm">
                       <p>
                          Total Length S1 = 6 * len(X)<br/>
                          Total Length S2 = 4 * len(X)
                       </p>
                       <p className="text-slate-600">
                          We want the <strong>Greatest</strong> len(X) that satisfies this. 
                          This is exactly the definition of <strong>GCD(TotalLen1, TotalLen2)</strong>.
                       </p>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-900 rounded-xl p-6 text-white space-y-4">
                 <h3 className="font-bold flex items-center gap-2 text-green-400"><Layers size={20}/> Euclidean Algorithm Visualization</h3>
                 <div className="flex items-center gap-4 text-sm">
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center gap-2">
                          <span className="w-4">A</span>
                          <div className="w-48 h-4 bg-blue-500 rounded-full"></div>
                          <span className="text-blue-400 font-mono">6</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="w-4">B</span>
                          <div className="w-32 h-4 bg-purple-500 rounded-full"></div>
                          <span className="text-purple-400 font-mono">4</span>
                       </div>
                    </div>
                    <ArrowRight className="text-slate-500"/>
                    <div className="flex flex-col gap-2">
                       <div className="text-xs text-slate-400 uppercase">Remainder (6 % 4)</div>
                       <div className="w-16 h-4 bg-red-500 rounded-full"></div>
                       <span className="text-red-400 font-mono">2</span>
                    </div>
                    <ArrowRight className="text-slate-500"/>
                    <div className="flex flex-col gap-2">
                       <div className="text-xs text-slate-400 uppercase">GCD (4 % 2)</div>
                       <div className="w-16 h-4 bg-green-500 rounded-full"></div>
                       <span className="text-green-400 font-mono">0 (Stop)</span>
                    </div>
                 </div>
                 <p className="text-center text-slate-400 text-xs mt-2">
                    The remainder of the lengths (2) is the length of our answer!
                 </p>
              </div>
           </div>
         )}

         {selectedTopic === 'compare' && (
           <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div>
                 <h2 className="text-2xl font-bold text-slate-800 mb-2">Complexity Showdown</h2>
                 <p className="text-slate-600 text-lg">
                    Why do we prefer the Euclidean method? It's all about speed when things get big.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Brute Force Card */}
                 <div className="border-2 border-slate-200 bg-white p-6 rounded-xl hover:border-red-300 transition-colors group">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4 group-hover:text-red-600">
                       <Scale className="text-slate-400 group-hover:text-red-500" /> Brute Force Approach
                    </h3>
                    <div className="space-y-4">
                       <div className="text-sm bg-slate-100 p-3 rounded font-mono text-slate-600">
                          for (len = minLen; len &gt; 0; len--)
                       </div>
                       <p className="text-sm text-slate-600">
                          Imagine strings of length 1,000,000.
                          If the lengths are Prime numbers, this loop runs <strong>1,000,000 times</strong>.
                          Inside the loop, we do string operations.
                       </p>
                       <div className="flex items-center gap-2 text-red-600 font-bold bg-red-50 p-2 rounded">
                          <Zap size={16} fill="currentColor" /> Very Slow (Time Limit Exceeded)
                       </div>
                    </div>
                 </div>

                 {/* Optimal Card */}
                 <div className="border-2 border-blue-500 bg-blue-50/10 p-6 rounded-xl shadow-md">
                    <h3 className="font-bold text-blue-800 flex items-center gap-2 mb-4">
                       <Lightbulb className="text-blue-600" /> Euclidean Approach
                    </h3>
                    <div className="space-y-4">
                       <div className="text-sm bg-slate-800 p-3 rounded font-mono text-green-400">
                          return gcd(len1, len2);
                       </div>
                       <p className="text-sm text-slate-600">
                          Imagine strings of length 1,000,000.
                          The Euclidean algorithm finds the GCD in about <strong>20 steps</strong> (Logarithmic).
                          We only pay the cost of the initial concatenation check.
                       </p>
                       <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 p-2 rounded">
                          <Zap size={16} fill="currentColor" /> Blazingly Fast
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="bg-slate-100 p-4 rounded-lg text-sm text-slate-600 flex gap-4 items-start">
                 <div className="bg-white p-2 rounded shadow-sm text-lg">💡</div>
                 <div>
                    <strong>Interview Tip:</strong> Start by explaining the Brute Force approach to show you understand the basics. 
                    Then say, <em>"However, this is inefficient. We can use a math property to do this in O(N+M)..."</em>
                 </div>
              </div>
           </div>
         )}

      </div>
    </div>
  );
};

const CodeLine: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => (
  <div className={`flex relative z-10 group ${active ? 'bg-blue-900/30 text-white font-bold' : 'text-slate-500'}`}>
    <span className="w-8 select-none text-right pr-3 text-slate-600 border-r border-slate-700 mr-3 shrink-0">{num}</span>
    <pre className="font-mono whitespace-pre">{code}</pre>
  </div>
);

const TopicButton: React.FC<{ active: boolean; onClick: () => void; title: string; desc: string }> = ({ active, onClick, title, desc }) => (
  <button 
    onClick={onClick}
    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group
      ${active 
        ? 'bg-purple-50 border-purple-500 shadow-md ring-1 ring-purple-200' 
        : 'bg-white border-slate-200 hover:border-purple-300 hover:bg-slate-50'}
    `}
  >
    <div className={`font-bold ${active ? 'text-purple-800' : 'text-slate-700 group-hover:text-purple-700'}`}>
      {title}
    </div>
    <div className={`text-xs mt-1 ${active ? 'text-purple-600' : 'text-slate-400'}`}>
      {desc}
    </div>
  </button>
);

export default GCDStringsVisualizer;
