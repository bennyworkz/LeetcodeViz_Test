import React, { useState, useMemo } from 'react';
import { 
  RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, ArrowRight, 
  ArrowDown, BarChart3, X, GitBranch, Split, Binary, 
  MousePointer2, Timer, Network, Undo2, ArrowUp, History, 
  Calculator, Type, ArrowLeftRight, Hash, Scaling, Landmark, Coins, Plus
} from 'lucide-react';

const APPROACHES = {
  leftToRight: {
    id: 'leftToRight',
    title: '1. Left-to-Right Pass',
    subtitle: 'Check the next character to determine subtraction.',
    icon: <ArrowRight size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int romanToInt(String s) {
        int ans = 0;
        for (int i = 0; i < s.length(); i++) {
            int val = getValue(s.charAt(i));
            
            // If the next numeral is larger, we subtract the current one
            if (i < s.length() - 1 && val < getValue(s.charAt(i + 1))) {
                ans -= val;
            } else {
                ans += val;
            }
        }
        return ans;
    }
    
    private int getValue(char c) {
        switch(c) {
            case 'I': return 1;
            case 'V': return 5;
            case 'X': return 10;
            case 'L': return 50;
            case 'C': return 100;
            case 'D': return 500;
            case 'M': return 1000;
            default: return 0;
        }
    }
}`,
    explanation: "We iterate from left to right. Roman numerals are usually written largest to smallest. If a smaller numeral appears BEFORE a larger numeral (like 'I' before 'V'), it represents subtraction. We peak at the next character to decide whether to add or subtract the current character's value."
  },
  rightToLeft: {
    id: 'rightToLeft',
    title: '2. Right-to-Left (Optimal)',
    subtitle: 'Track previous value to avoid lookaheads.',
    icon: <RotateCcw size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int romanToInt(String s) {
        int ans = 0, num = 0, prev = 0;
        
        // Traverse from right to left
        for (int i = s.length() - 1; i >= 0; i--) {
            switch(s.charAt(i)) {
                case 'I': num = 1; break;
                case 'V': num = 5; break;
                case 'X': num = 10; break;
                case 'L': num = 50; break;
                case 'C': num = 100; break;
                case 'D': num = 500; break;
                case 'M': num = 1000; break;
            }
            
            // If current is less than the previous, we subtract
            if (num < prev) {
                ans -= num;
            } else {
                ans += num;
            }
            prev = num;
        }
        return ans;
    }
}`,
    explanation: "A more elegant approach. By traversing backwards, we naturally process the larger numerals first in subtractive pairs (e.g., 'IV' -> process 'V' first, then 'I'). We just keep track of the previously seen value. If the current value is less than the previous value, we know it's a subtraction!"
  }
};

const ROMAN_VALUES: Record<string, number> = {
    'I': 1, 'V': 5, 'X': 10, 'L': 50,
    'C': 100, 'D': 500, 'M': 1000
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">13. Roman to Integer</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
        <p className="text-lg leading-relaxed">
          Roman numerals are represented by seven different symbols: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-rose-600 font-mono font-bold">I, V, X, L, C, D, M</code>.
        </p>
        
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm inline-block min-w-[200px]">
            <div className="flex justify-between border-b border-slate-200 pb-2 mb-2">
                <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Symbol</span>
                <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Value</span>
            </div>
            <div className="space-y-1">
                <div className="flex justify-between"><span>I</span><span className="text-rose-600 font-bold">1</span></div>
                <div className="flex justify-between"><span>V</span><span className="text-rose-600 font-bold">5</span></div>
                <div className="flex justify-between"><span>X</span><span className="text-rose-600 font-bold">10</span></div>
                <div className="flex justify-between"><span>L</span><span className="text-rose-600 font-bold">50</span></div>
                <div className="flex justify-between"><span>C</span><span className="text-rose-600 font-bold">100</span></div>
                <div className="flex justify-between"><span>D</span><span className="text-rose-600 font-bold">500</span></div>
                <div className="flex justify-between"><span>M</span><span className="text-rose-600 font-bold">1000</span></div>
            </div>
        </div>

        <p className="text-lg leading-relaxed mt-4">
          For example, <code>2</code> is written as <code>II</code> in Roman numeral, just two ones added together. <code>12</code> is written as <code>XII</code>, which is simply <code>X + II</code>.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-rose-500 pl-4 bg-rose-50 py-2">
          Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not <code>IIII</code>. Instead, the number four is written as <code>IV</code>. Because the one is before the five we subtract it making four.
        </p>

        <p className="text-lg leading-relaxed">
          There are six instances where subtraction is used:
        </p>
        <ul className="list-disc pl-6 space-y-1 marker:text-rose-500">
            <li><code>I</code> can be placed before <code>V</code> (5) and <code>X</code> (10) to make 4 and 9.</li>
            <li><code>X</code> can be placed before <code>L</code> (50) and <code>C</code> (100) to make 40 and 90.</li>
            <li><code>C</code> can be placed before <code>D</code> (500) and <code>M</code> (1000) to make 400 and 900.</li>
        </ul>

        <p className="text-lg leading-relaxed mt-4">
          Given a roman numeral, convert it to an integer.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "III"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 3</p>
              <p className="text-slate-500 text-xs mt-2 border-t border-slate-200 pt-2"><span className="text-slate-400 font-bold">Explanation:</span> III = 3.</p>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "LVIII"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 58</p>
              <p className="text-slate-500 text-xs mt-2 border-t border-slate-200 pt-2"><span className="text-slate-400 font-bold">Explanation:</span> L = 50, V= 5, III = 3.</p>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "MCMXCIV"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 1994</p>
              <p className="text-slate-500 text-xs mt-2 border-t border-slate-200 pt-2"><span className="text-slate-400 font-bold">Explanation:</span> M = 1000, CM = 900, XC = 90 and IV = 4.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const RomanVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState<keyof typeof APPROACHES>('rightToLeft');
  const [sInput, setSInput] = useState('MCMXCIV');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  // Clean input to only valid uppercase Roman chars
  const sValid = useMemo(() => {
    return sInput.toUpperCase().replace(/[^IVXLCDM]/g, '');
  }, [sInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const s = sValid.length > 0 ? sValid : 'I';
    
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({
        phase,
        description: desc,
        line,
        state: { s, ...state }
      });
    };

    if (selectedApproachId === 'leftToRight') {
        let ans = 0;
        addStep("Initialization", `Set ans = 0. Starting traversal from left to right.`, 3, { ans, i: -1 });
        
        for (let i = 0; i < s.length; i++) {
            let val = ROMAN_VALUES[s[i]];
            let nextVal = i < s.length - 1 ? ROMAN_VALUES[s[i+1]] : 0;
            
            addStep("Read Value", `Reading character s[${i}] ('${s[i]}'). Its value is ${val}.`, 5, { ans, i, val, nextVal: null, operation: null });
            addStep("Lookahead Check", `Check if there is a next character and if its value is greater than the current value.`, 8, { ans, i, val, nextVal, operation: null });
            
            if (i < s.length - 1 && val < nextVal) {
                ans -= val;
                addStep("Subtractive Notation", `'${s[i]}' (${val}) is before a larger numeral '${s[i+1]}' (${nextVal}). We SUBTRACT ${val}.`, 9, { ans, i, val, nextVal, operation: 'sub' });
            } else {
                ans += val;
                addStep("Additive Notation", `'${s[i]}' (${val}) is NOT before a larger numeral. We ADD ${val}.`, 11, { ans, i, val, nextVal, operation: 'add' });
            }
        }
        addStep("Return Answer", `Traversal complete. Final answer is ${ans}.`, 14, { ans, i: s.length, isSuccess: true });
    } 
    else if (selectedApproachId === 'rightToLeft') {
        let ans = 0, num = 0, prev = 0;
        addStep("Initialization", `Set ans = 0, num = 0, prev = 0. Starting traversal from right to left.`, 3, { ans, num, prev, i: s.length });
        
        for (let i = s.length - 1; i >= 0; i--) {
            num = ROMAN_VALUES[s[i]];
            addStep("Read Value", `Reading character s[${i}] ('${s[i]}') via switch statement. Its value is ${num}.`, 6, { ans, num, prev, i, operation: null });
            
            addStep("Compare with Previous", `Check if current value (${num}) is less than previously processed value (${prev}).`, 14, { ans, num, prev, i, operation: null });
            
            if (num < prev) {
                ans -= num;
                addStep("Subtractive Notation", `${num} < ${prev}, meaning it's the smaller prefix of a subtractive pair. SUBTRACT ${num}.`, 15, { ans, num, prev, i, operation: 'sub' });
            } else {
                ans += num;
                addStep("Additive Notation", `${num} >= ${prev}. This is a standard additive numeral. ADD ${num}.`, 17, { ans, num, prev, i, operation: 'add' });
            }
            prev = num;
            addStep("Update Previous", `Set prev = ${num} for the next iteration.`, 19, { ans, num, prev, i, operation: null });
        }
        addStep("Return Answer", `Traversal complete. Final answer is ${ans}.`, 21, { ans, num, prev, i: -1, isSuccess: true });
    }

    return steps;
  }, [sValid, selectedApproachId]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedApproach.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0];
  const state = cur.state || {};
  const { isSuccess } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-rose-600 p-4 rounded-2xl shadow-lg shadow-rose-100 flex items-center justify-center">
                <Landmark className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Roman to Integer</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 13</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">String Parsing</span>
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
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-rose-600 border-rose-600 text-white shadow-rose-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-rose-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-rose-100' : 'text-slate-400'}`}>
                                    <span>{time}</span>
                                    <span>{space}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="bg-[#0f172a] rounded-3xl h-[480px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={14} className="text-rose-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {/* Highlighter Bar */}
                      <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/10 border-emerald-500' : state.operation === 'sub' ? 'bg-amber-500/15 border-amber-500' : 'bg-rose-500/15 border-rose-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="rose" />
                      ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-rose-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Current Variables</h4>
                      </div>
                    </div>
                    
                    {selectedApproachId === 'leftToRight' ? (
                        <div className="grid grid-cols-3 gap-3">
                            <VariableCard label="INDEX" val={state.i >= 0 && state.i < state.s?.length ? state.i : null} color="blue" active={state.i >= 0 && state.i < state.s?.length} />
                            <VariableCard label="VAL" val={state.val ?? null} color="amber" active={state.val !== undefined} />
                            <VariableCard label="NEXT VAL" val={state.nextVal ?? null} color="purple" active={state.nextVal !== null && state.nextVal !== undefined} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            <VariableCard label="INDEX" val={state.i >= 0 && state.i < state.s?.length ? state.i : null} color="blue" active={state.i >= 0 && state.i < state.s?.length} />
                            <VariableCard label="NUM" val={state.num ?? null} color="amber" active={state.num !== undefined} />
                            <VariableCard label="PREV" val={state.prev ?? null} color="emerald" active={state.prev !== undefined} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Simulation Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-rose-600 uppercase block pl-1 tracking-widest font-mono">Input Roman Numeral</label>
                        <input type="text" value={sInput} onChange={(e) => { setSInput(e.target.value.toUpperCase()); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-inner uppercase" placeholder="e.g. MCMXCIV" />
                        {sInput !== sValid && <span className="text-[9px] text-amber-500 font-bold block mt-1 px-1 flex gap-1 items-center"><AlertCircle size={10}/> Invalid characters filtered out.</span>}
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/> Prev
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-40 px-6 py-3 bg-rose-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all flex items-center justify-center gap-2">
                        Next Step <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Action Log / Status */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group ${state.operation === 'sub' ? 'bg-amber-900 border-amber-800' : isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      <Landmark size={100}/>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={state.operation === 'sub' ? "text-amber-400" : isSuccess ? "text-emerald-400" : "text-rose-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${state.operation === 'sub' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>Line {cur.line}</div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line">{cur.description}</p>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[380px] relative flex flex-col items-center overflow-hidden shadow-inner justify-between">
                  
                  {/* String Representation */}
                  <div className="flex flex-col items-center mt-6 w-full relative z-10">
                      <div className="flex gap-2 flex-wrap justify-center relative">
                          {state.s?.split('').map((char: string, idx: number) => {
                              const isActive = idx === state.i;
                              const isNext = selectedApproachId === 'leftToRight' && idx === state.i + 1 && state.nextVal !== null;
                              
                              let bgClass = "bg-white";
                              let borderClass = "border-slate-200";
                              let textClass = "text-slate-800";

                              // Approach visual specifics
                              if (selectedApproachId === 'leftToRight') {
                                  if (idx < (state.i ?? -1)) {
                                      bgClass = "bg-slate-50 opacity-40";
                                  } else if (isActive) {
                                      bgClass = state.operation === 'sub' ? "bg-amber-50 border-amber-400 text-amber-800 scale-105 shadow-md" : "bg-blue-50 border-blue-400 text-blue-800 scale-105 shadow-md";
                                      borderClass = state.operation === 'sub' ? "border-amber-400" : "border-blue-400";
                                  } else if (isNext) {
                                      bgClass = "bg-purple-50 border-purple-300 border-dashed text-purple-700";
                                      borderClass = "border-purple-300";
                                  }
                              } else {
                                  // Right to Left
                                  if (idx > (state.i ?? state.s.length)) {
                                      bgClass = "bg-slate-50 opacity-40";
                                  } else if (isActive) {
                                      bgClass = state.operation === 'sub' ? "bg-amber-50 border-amber-400 text-amber-800 scale-105 shadow-md" : "bg-blue-50 border-blue-400 text-blue-800 scale-105 shadow-md";
                                      borderClass = state.operation === 'sub' ? "border-amber-400" : "border-blue-400";
                                  }
                              }

                              return (
                                  <div key={idx} className="flex flex-col items-center relative transition-all duration-300 mb-6">
                                      {/* Pointer */}
                                      <div className="absolute -top-8 flex flex-col items-center justify-end h-6 w-full gap-1">
                                          {isActive && (
                                              <div className="flex flex-col items-center animate-in slide-in-from-top-2">
                                                  <ArrowDown size={14} className={state.operation === 'sub' ? 'text-amber-500' : 'text-blue-500'} strokeWidth={3}/>
                                              </div>
                                          )}
                                      </div>

                                      {/* Main Box */}
                                      <div className={`w-10 h-14 md:w-14 md:h-16 border-2 rounded-xl flex items-center justify-center font-serif font-black text-2xl md:text-3xl transition-all duration-500 ${bgClass} ${borderClass} ${textClass}`}>
                                          {char}
                                      </div>
                                      
                                      {/* Numerator Value Label */}
                                      <div className={`absolute -bottom-6 text-[10px] font-mono font-black ${isActive || isNext ? 'text-slate-600' : 'text-slate-300'}`}>
                                          {ROMAN_VALUES[char]}
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  </div>

                  {/* Running Total & Equation Box */}
                  <div className="mt-8 w-full max-w-sm flex flex-col gap-4 relative z-10 animate-in slide-in-from-bottom-4">
                      
                      {state.operation && (
                         <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full border border-slate-200 shadow-lg text-sm font-black font-mono flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                             {state.operation === 'sub' ? (
                                <>
                                  <span className="text-amber-600 flex items-center gap-1"><ArrowDown size={14}/> SUBTRACT</span>
                                  <span className="text-amber-700 bg-amber-100 px-2 rounded">- {selectedApproachId === 'leftToRight' ? state.val : state.num}</span>
                                </>
                             ) : (
                                <>
                                  <span className="text-blue-600 flex items-center gap-1"><ArrowUp size={14}/> ADD</span>
                                  <span className="text-blue-700 bg-blue-100 px-2 rounded">+ {selectedApproachId === 'leftToRight' ? state.val : state.num}</span>
                                </>
                             )}
                         </div>
                      )}

                      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col items-center shadow-inner relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-5">
                             <Coins size={64}/>
                          </div>
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-2">Running Total (ans)</span>
                          <div className="text-5xl font-black font-mono text-slate-800 tabular-nums tracking-tighter">
                              {state.ans}
                          </div>
                      </div>
                  </div>

                  {/* Final Success Overlay */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-emerald-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-emerald-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">CONVERSION COMPLETE</span>
                              <span className="text-xs font-black uppercase text-emerald-600 tracking-widest font-mono">Result: {state.ans}</span>
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
                <Landmark className="text-rose-600"/> Demystifying Roman Numerals
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-rose-100 pl-6">
                Roman numerals are inherently an <strong>additive numbering system</strong>, with a small twist to save space: <strong>subtractive notation</strong>. By understanding this single exception rule, we can parse any valid Roman string easily.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-rose-50 border border-rose-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-rose-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Plus size={18}/> The Additive Rule
                        </h3>
                        <p className="text-sm text-rose-800 leading-relaxed italic">
                            Generally, symbols are placed in order of value, starting with the largest values. 
                        </p>
                        <p className="text-xs text-rose-700 font-bold bg-rose-200/50 p-3 rounded-xl mt-2">
                           VI = 5 + 1 = 6<br/>
                           LXX = 50 + 10 + 10 = 70<br/>
                           MD = 1000 + 500 = 1500
                        </p>
                    </div>
                    
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowLeftRight size={18}/> The Subtractive Rule
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed">
                            To avoid writing four characters in a row (like IIII), a smaller character placed <strong>before</strong> a larger character indicates subtraction.
                        </p>
                        <ul className="text-xs text-amber-800 space-y-2 font-bold bg-amber-200/50 p-3 rounded-xl mt-2 list-none m-0">
                            <li>IV = 5 - 1 = 4</li>
                            <li>IX = 10 - 1 = 9</li>
                            <li>XL = 50 - 10 = 40</li>
                            <li>CM = 1000 - 100 = 900</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Coins size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-rose-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Why Right-to-Left is Elegant</h4>
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700 backdrop-blur-sm">
                            <p className="text-xs text-slate-300 leading-relaxed mb-4">
                                If we process left-to-right, we always have to look ahead. <br/><br/>
                                "I see an <strong className="text-rose-400">I</strong>. Should I add 1? Let me check the next character. Ah, it's a <strong className="text-amber-400">V</strong>! I need to subtract 1 instead."
                            </p>
                            <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-700 pt-4">
                                If we process right-to-left, we carry the "largest seen" context with us. <br/><br/>
                                "I see a <strong className="text-amber-400">V</strong>. I add 5. Next, I step left and see an <strong className="text-rose-400">I</strong>. Since 1 is less than the 5 I just processed, it MUST be a subtraction! I subtract 1."
                            </p>
                            <div className="mt-4 inline-block bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-lg text-[10px] uppercase font-black tracking-widest">
                                No Lookahead Required
                            </div>
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
                        "While mapping characters to their integer values using a HashMap is very common, I prefer using a switch statement. In Java, switch statements over characters are highly optimized and compile down to tableswitch or lookupswitch bytecodes, completely bypassing the hashing overhead, object creation (boxing/unboxing), and memory footprint of a HashMap. Coupled with a right-to-left traversal, we process the string in exactly one pass O(N) time with strictly O(1) auxiliary space, requiring no lookahead bounds checking."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: HashMap vs Switch
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                <strong className="text-slate-800">HashMap:</strong> Clean code, easily extensible if new symbols are added (unlikely for Romans). Has constant factor overhead for hashing.
                            </div>
                            <div className="text-xs text-slate-600 leading-relaxed">
                                <strong className="text-slate-800">Switch/Array Lookup:</strong> Fastest execution. Uses CPU caching perfectly. This is the difference between a 3ms solution and a 0ms solution on LeetCode.
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
                                <p className="text-[10px] text-slate-500 mt-1">Where N is the length of the string. We look at every character exactly once.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We only use a few integer variables (ans, num, prev) and a hardcoded switch statement. Memory usage does not scale with input size.</p>
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

const VariableCard = ({ label, val, color, active }: { label: string, val: number | null, color: 'blue' | 'purple' | 'amber' | 'emerald', active: boolean }) => {
    const bgMap = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700'
    };
    
    const inactiveMap = 'bg-slate-50 border-slate-200 text-slate-300';

    return (
        <div className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden ${active ? bgMap[color] : inactiveMap}`}>
             <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</span>
             <div className="text-xl font-black font-mono leading-none">
                 {val !== null ? val : '-'}
             </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean, theme?: 'cyan' | 'violet' | 'rose' }> = ({ num, code, active, theme = 'rose' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|switch|case|default)\b|\b\d+\b)/g).filter(Boolean);
  
  let bgActive = 'bg-rose-500/10';
  let borderActive = 'bg-rose-500';
  let textActive = 'text-rose-400';

  if (theme === 'cyan') {
     bgActive = 'bg-cyan-500/10'; borderActive = 'bg-cyan-500'; textActive = 'text-cyan-400';
  } else if (theme === 'violet') {
     bgActive = 'bg-violet-500/10'; borderActive = 'bg-violet-500'; textActive = 'text-violet-400';
  }

  return (
    <div className={`flex relative z-10 min-h-[16.5px] transition-colors duration-200 ${active ? bgActive : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${borderActive}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-[10px] ${active ? `${textActive} font-bold` : 'text-slate-700'}`}>{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"') || part.startsWith("'")) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'void', 'for', 'break', 'switch', 'case', 'default'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'long', 'boolean', 'String'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-amber-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default RomanVisualizer;