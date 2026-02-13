import React, { useState, useMemo } from 'react';
import { 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Activity, 
  BookOpen, 
  Code2, 
  Check, 
  Copy, 
  Zap, 
  Trophy, 
  MessageSquare, 
  Target, 
  AlertCircle, 
  Cpu, 
  Layers, 
  Hash, 
  Database, 
  Calculator, 
  FileText, 
  ArrowRight, 
  ArrowDown, 
  Parentheses, 
  Info, 
  BarChart3, 
  X 
} from 'lucide-react';

const APPROACHES = {
  optimal: {
    id: 'optimal',
    title: '1. Stack-Based',
    subtitle: 'Optimal O(N) Linear',
    icon: <Layers size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if (c == ')' && top != '(') return false;
                if (c == ']' && top != '[') return false;
                if (c == '}' && top != '{') return false;
            }
        }
        return stack.isEmpty();
    }
}`,
    explanation: "This approach uses the LIFO (Last-In, First-Out) property of a Stack. We push every opening bracket onto the stack. When we see a closing bracket, it must match the 'most recent' opening bracket (the one on top)."
  },
  brute: {
    id: 'brute',
    title: '2. String Replace',
    subtitle: 'Recursive Shrinking',
    icon: <RotateCcw size={16} />,
    complexity: 'Time: O(N²) | Space: O(N)',
    code: `class Solution {
    public boolean isValid(String s) {
        int length;
        do {
            length = s.length();
            s = s.replace("()", "")
                 .replace("[]", "")
                 .replace("{}", "");
        } while (s.length() < length);
        return s.length() == 0;
    }
}`,
    explanation: "Repeatedly find and remove the innermost valid pairs. If the string eventually becomes empty, it was valid. However, string replacement in a loop is highly inefficient due to repeated scanning."
  }
};

const ValidParenthesesVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproach, setSelectedApproach] = useState<'optimal' | 'brute'>('optimal');
  const [inputS, setInputS] = useState("()[]{ }");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const cleanInput = useMemo(() => inputS.replace(/\s/g, ''), [inputS]);

  const trace = useMemo(() => {
    const steps = [];
    const s = cleanInput;
    const n = s.length;
    
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ 
        phase, 
        description: desc, 
        line, 
        state: { 
          s: cleanInput,
          stack: [],
          i: -1,
          popped: null,
          error: false,
          match: false,
          finished: false,
          success: false,
          currentS: "",
          ...state 
        } 
      });
    };

    if (selectedApproach === 'optimal') {
      const stack: string[] = [];
      addStep("Initialization", "Initialize an empty stack to track opening brackets.", 3, { stack: [] });

      for (let i = 0; i < n; i++) {
        const char = s[i];
        addStep("Iterative Scan", `Processing character '${char}' at index ${i}.`, 4, { stack: [...stack], i: i });

        if (char === '(' || char === '[' || char === '{') {
          addStep("Opening Found", `'${char}' is an opening bracket. Pushing to stack.`, 5, { stack: [...stack], i: i });
          stack.push(char);
          addStep("Push Action", `Stack updated. New top: '${char}'.`, 6, { stack: [...stack], i: i });
        } else {
          addStep("Closing Found", `'${char}' is a closing bracket. Checking the stack...`, 8, { stack: [...stack], i: i });
          
          if (stack.length === 0) {
            addStep("Stack Underflow", "Found a closing bracket but the stack is empty! No matching opener exists.", 9, { stack: [], i: i, error: true });
            return steps;
          }
          
          const top = stack.pop();
          addStep("Pop Action", `Popped '${top}' from stack to compare with '${char}'.`, 10, { stack: [...stack], i: i, popped: top });

          const isMatch = (char === ')' && top === '(') || (char === ']' && top === '[') || (char === '}' && top === '{');
          
          if (!isMatch) {
            const errorLine = char === ')' ? 11 : (char === ']' ? 12 : 13);
            addStep("Validation Error", `Mismatch! Expected partner for '${top}' but found '${char}'.`, errorLine, { stack: [...stack], i: i, error: true });
            return steps;
          } else {
            const matchLine = char === ')' ? 11 : (char === ']' ? 12 : 13);
            addStep("Validation Success", `Perfect match! '${top}' correctly resolved by '${char}'.`, matchLine, { stack: [...stack], i: i, match: true });
          }
        }
      }
      
      const isValid = stack.length === 0;
      addStep("Final Integrity Check", "Finished scanning string. Checking if any unmatched debt remains in the stack.", 16, { stack: [...stack], i: n });
      addStep("Conclusion", isValid ? "Stack is empty. Balanced string!" : "Stack contains unclosed brackets. Unbalanced!", 16, { stack: [...stack], i: n, finished: true, success: isValid });

    } else {
      let currentS = s;
      addStep("Brute Force Init", `Starting recursive string reduction on "${currentS}".`, 4, { currentS: currentS });
      
      let changed = true;
      while (changed) {
        const prevLen = currentS.length;
        currentS = currentS.replace("()", "").replace("[]", "").replace("{}", "");
        changed = currentS.length < prevLen;
        
        if (changed) {
          addStep("String Reduction", `Pairs found! String reduced to "${currentS || "(empty)"}".`, 7, { currentS: currentS });
        } else {
          addStep("Search Stalled", "No more matching adjacent pairs found.", 10, { currentS: currentS });
        }
      }
      const success = currentS.length === 0;
      addStep("Conclusion", success ? "String is empty. Valid!" : "Remaining characters cannot be paired. Invalid.", 11, { currentS: currentS, finished: true, success: success });
    }

    return steps;
  }, [cleanInput, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const cur = trace[currentStep] || trace[0];
  const { stack, i: activeIdx, popped, error, match, finished, success, currentS } = cur.state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center">
                <Parentheses className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Valid Parentheses</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-widest font-black text-[10px]">Data Structures</span>
                <span>LC 20 • Easy</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
            <TabButton active={activeTab === 'problem'} onClick={() => setActiveTab('problem')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<BookOpen size={16}/>} label="Learn" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'problem' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 animate-in fade-in duration-700">
            <div className="max-w-3xl space-y-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-6 font-mono tracking-tighter">20. Valid Parentheses</h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-lg leading-relaxed">
                  <p>Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.</p>
                  <p>An input string is valid if:</p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Open brackets must be closed by the <strong>same type</strong> of brackets.</li>
                    <li>Open brackets must be closed in the <strong>correct order</strong>.</li>
                    <li>Every close bracket has a corresponding open bracket of the same type.</li>
                  </ol>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Hash size={16}/> Examples:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm shadow-inner">
                        <p><span className="text-slate-400 font-bold">Input:</span> s = "()"</p>
                        <p><span className="text-slate-400 font-bold">Output:</span> true</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm shadow-inner">
                        <p><span className="text-slate-400 font-bold">Input:</span> s = "()[]{}"</p>
                        <p><span className="text-slate-400 font-bold">Output:</span> true</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm shadow-inner">
                        <p><span className="text-slate-400 font-bold">Input:</span> s = "(]"</p>
                        <p><span className="text-slate-400 font-bold">Output:</span> false</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm shadow-inner">
                        <p><span className="text-slate-400 font-bold">Input:</span> s = "([])"</p>
                        <p><span className="text-slate-400 font-bold">Output:</span> true</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <AlertCircle size={14} /> Constraints:
                </h3>
                <ul className="list-disc list-inside space-y-3 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">1 {'<='} s.length {'<='} 10<sup>4</sup></code></li>
                  <li><code>s</code> consists of parentheses only <code>'()[]{}'</code>.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-2 flex gap-2 shadow-sm">
                {(Object.keys(APPROACHES) as Array<keyof typeof APPROACHES>).map((key) => (
                  <button key={key} onClick={() => { setSelectedApproach(key); setCurrentStep(0); }} className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-indigo-600 text-white shadow-lg' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}>
                    <span className="text-xs font-black uppercase tracking-tight">{APPROACHES[key].title}</span>
                    <span className={`text-[10px] opacity-70 ${selectedApproach === key ? 'text-white' : 'text-slate-400'}`}>
                      {APPROACHES[key].complexity}
                    </span>
                  </button>
                ))}
              </div>

              <div className="bg-[#0f172a] rounded-3xl h-[480px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Code2 size={14} className="text-indigo-400" />
                    <span className="font-bold uppercase tracking-tight">Solution.java</span>
                  </div>
                  <button onClick={handleCopy} className="hover:text-white transition-colors">
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="p-6 font-mono text-[13px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="absolute left-0 right-0 bg-indigo-500/15 border-l-4 border-indigo-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${(cur.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} />
                    {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} />
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-indigo-600">
                    <Info size={18} />
                    <h4 className="text-sm font-black uppercase tracking-widest">Logic Insight</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">{APPROACHES[selectedApproach].explanation}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-indigo-600 uppercase block pl-1 tracking-widest">Input String (s)</label>
                    <input value={inputS} onChange={(e) => { setInputS(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" maxLength={20} />
                </div>
                <div className="flex gap-3">
                  <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <ChevronLeft size={16}/> Prev
                  </button>
                  <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                    Next Step <ChevronRight size={16}/>
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-3xl p-7 shadow-2xl border border-slate-800 min-h-[160px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    <Layers size={100}/>
                </div>
                <div className="flex items-center gap-2 mb-3">
                   <Activity size={14} className="text-indigo-400"/>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Flow</span>
                </div>
                <div className="text-lg font-black tracking-tight mb-2 uppercase font-mono flex items-center gap-3">
                    {error && <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[10px] animate-pulse">FAILURE</span>}
                    {match && <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] animate-pulse">MATCH!</span>}
                    {cur.phase}
                </div>
                <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3">{cur.description}</p>
              </div>

              {/* Simulation Arena */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[500px] relative flex flex-col justify-between overflow-hidden shadow-inner transition-all duration-500">
                
                {/* State Variables Dashboard */}
                {!finished && selectedApproach === 'optimal' && (
                  <div className="w-full grid grid-cols-2 gap-4 z-10 mb-8">
                     <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex flex-col items-center justify-center shadow-sm relative overflow-hidden group">
                        <span className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest font-mono">Current Char</span>
                        <div className="text-4xl font-black text-indigo-600 font-mono">{cleanInput[activeIdx] || 'EOF'}</div>
                     </div>
                     <div className="bg-indigo-50/50 rounded-3xl p-5 border border-indigo-100 flex flex-col items-center justify-center shadow-sm">
                        <span className="text-[9px] font-black text-indigo-400 uppercase mb-1 tracking-widest font-mono">Stack Top</span>
                        <div className={`text-4xl font-black font-mono ${stack?.length > 0 ? 'text-indigo-700' : 'text-slate-300'}`}>
                            {stack?.length > 0 ? stack[stack.length - 1] : 'Empty'}
                        </div>
                     </div>
                  </div>
                )}

                {/* Main Visual */}
                <div className="flex-1 flex flex-col items-center justify-center gap-10">
                    
                    {selectedApproach === 'optimal' ? (
                      <>
                        <div className="flex items-center gap-3 w-full justify-center">
                            {cleanInput.split('').map((val, idx) => (
                                <div key={idx} className={`w-10 h-12 border-2 rounded-xl flex items-center justify-center font-mono text-lg transition-all duration-300 relative ${activeIdx === idx ? 'bg-indigo-600 border-indigo-700 text-white shadow-lg scale-110' : 'bg-white text-slate-300 border-slate-100'}`}>
                                    {val}
                                    {activeIdx === idx && (
                                        <div className="absolute -top-7 text-indigo-500 animate-bounce">
                                            <ArrowDown size={18} strokeWidth={3}/>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="relative w-48 h-64 bg-slate-50 rounded-b-3xl border-x-4 border-b-4 border-slate-200 flex flex-col-reverse items-center p-3 gap-2 shadow-inner group">
                            <div className="absolute top-0 -translate-y-full left-0 right-0 py-2 text-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stack (LIFO)</span>
                            </div>
                            {stack?.map((char: string, idx: number) => (
                                <div key={idx} className="w-full py-3 bg-white border-2 border-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-black text-xl shadow-sm animate-in slide-in-from-top-4 duration-300">
                                    {char}
                                </div>
                            ))}
                            {stack?.length === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-200 font-black uppercase text-xs tracking-tighter opacity-50 select-none">Empty Stack</div>
                            )}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-6 w-full text-center">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Reduction</span>
                          <div className="text-4xl font-black text-slate-900 font-mono bg-slate-50 p-8 rounded-3xl border-2 border-dashed border-slate-200">
                              {currentS || "(Empty String)"}
                          </div>
                      </div>
                    )}
                </div>

                {/* Final State Banner */}
                {finished && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-indigo-600/5 backdrop-blur-[4px] animate-in fade-in duration-1000">
                    <div className="bg-white border-2 border-indigo-100 px-12 py-10 rounded-[3.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] flex flex-col items-center gap-6 transform -rotate-1 hover:rotate-0 transition-transform">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl mb-2 ${success ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
                          {success ? <Check size={48} strokeWidth={3}/> : <X size={48} strokeWidth={3}/>}
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] block mb-2 font-mono">Validation Result</span>
                        <div className={`text-4xl font-black font-mono ${success ? 'text-green-600' : 'text-rose-600'}`}>
                           {success ? 'VALID' : 'INVALID'}
                        </div>
                        <div className="mt-6 px-6 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest font-mono">
                           {success ? 'All pairs balanced' : 'Structural mismatch'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Visual Pointer for pop comparison */}
                {!finished && popped && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 flex items-center gap-6 animate-in zoom-in">
                        <div className="w-16 h-16 bg-white border-4 border-indigo-500 rounded-2xl flex items-center justify-center text-3xl font-black text-indigo-700 shadow-2xl ring-4 ring-indigo-100">
                            {popped}
                        </div>
                        <div className="text-slate-300 font-black text-xl uppercase tracking-widest">VS</div>
                        <div className="w-16 h-16 bg-indigo-600 border-4 border-indigo-700 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-2xl">
                            {cleanInput[activeIdx]}
                        </div>
                    </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'learn' && (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-10">
            <div className="max-w-4xl space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 font-mono">
                <BookOpen className="text-indigo-600"/> The Power of LIFO
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Brackets follow a hierarchical structure. In any valid nesting, the <strong>last</strong> bracket opened <strong>must</strong> be the <strong>first</strong> bracket closed. This is the definition of a Stack (Last-In, First-Out).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-indigo-900 flex items-center gap-2 uppercase tracking-tighter text-sm font-mono"><Layers size={18}/> Stack Invariants</h3>
                        <p className="text-sm text-indigo-800 leading-relaxed italic border-l-2 border-indigo-200 pl-4">
                          "The stack represents the path back to the root."
                        </p>
                        <p className="text-xs text-indigo-700 leading-relaxed">
                          Every time we push to the stack, we are adding a "debt" that must be repaid by a closing bracket of the same type. If we encounter a closer that doesn't match the debt on top, the hierarchy is broken.
                        </p>
                    </div>
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm font-mono"><Target size={18}/> Early Exit Strategy</h3>
                        <p className="text-sm text-amber-700 leading-relaxed">
                          In large systems, we want to fail fast. If the stack is empty when we see a closer, or if the string length is odd, we can return <code>false</code> immediately without scanning the rest of the string.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Calculator size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <BarChart3 size={32} className="text-indigo-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs font-mono">Algorithm Profile</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                      <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700 backdrop-blur-sm">
                          <span className="text-[10px] text-slate-500 block mb-1 uppercase font-black font-mono">Time Complexity</span>
                          <div className="font-mono text-2xl font-black text-indigo-400">O(N)</div>
                          <p className="text-[10px] text-slate-500 mt-2">Single pass across the string.</p>
                      </div>
                      <div className="p-5 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-500/20">
                          <span className="text-[10px] text-indigo-200 block mb-1 uppercase font-black font-mono">Space Complexity</span>
                          <div className="font-mono text-2xl font-black">O(N)</div>
                          <p className="text-[10px] text-indigo-200 mt-2">Worst case: All opening brackets.</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed italic relative z-10 font-mono">
                      "Stack memory scales linearly. While O(N) space is required, it is the most efficient way to maintain state for hierarchical symbols."
                    </p>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <div className="space-y-6">
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                        <Trophy size={140} />
                    </div>
                    <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-amber-400 relative z-10 uppercase tracking-tight font-mono">
                        <Trophy size={24} /> Senior Interview Defense
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10 font-mono">
                        "Validating nested hierarchies is a canonical application for the Stack data structure. I implemented an O(N) solution that leverages the LIFO principle to ensure that the most recently opened context is the first to be resolved. By utilizing a single-pass traversal and constant-time stack operations (push/pop), I've optimized for performance while ensuring robust error detection—returning false as soon as a mismatch or underflow is detected."
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter font-mono">
                        <MessageSquare className="text-indigo-500" size={20} /> Candidate Q&A
                    </h3>
                    <div className="space-y-4">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-mono">"Can you solve this without an explicit Stack?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed font-mono">
                                "Technically, yes, using <b>Recursion</b>. However, this is dangerous for strings with extreme depth as it might trigger a <code>StackOverflowError</code>. An explicit stack in the heap is much safer for large-scale data."
                            </p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-mono">"What if there are 1,000 different bracket types?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed font-mono">
                                "I would refactor the <code>if/else</code> chain into a <b>HashMap</b>. The key would be the closing bracket, and the value would be its matching opener. This keeps the lookup logic O(1) regardless of the count."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-[2rem] p-8 shadow-sm">
                    <h3 className="text-lg font-black text-indigo-900 mb-6 uppercase tracking-widest flex items-center gap-2 font-mono">
                        <AlertCircle size={20}/> Amazon Leadership Check
                    </h3>
                    <ul className="space-y-8">
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">1</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight font-mono">Dive Deep</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1 font-mono">Discuss boundary conditions. What happens if the string is <code>")("</code>? Mention that <code>stack.isEmpty()</code> check on line 9 handles this immediately.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">2</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight font-mono">Invent & Simplify</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1 font-mono">If the interviewer allows string manipulation, mention that <code>replace()</code> is O(N²) but clever. Showing you know multiple approaches demonstrates technical breadth.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|char|Stack|pop|push|isEmpty|toCharArray|replace|do|length)\b|\b\d+\b)/g).filter(Boolean);
  return (
    <div className={`flex relative z-10 min-h-[20.8px] transition-colors duration-300 ${active ? 'bg-indigo-500/10 font-bold' : ''}`}>
      <span className="w-10 text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 font-mono text-[11px] select-none shrink-0">{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for', 'do'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean', 'void', 'char'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['Stack', 'String'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['pop', 'push', 'isEmpty', 'toCharArray', 'replace', 'length'].includes(part)) return <span key={i} className="text-blue-400">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-rose-400 font-bold">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default ValidParenthesesVisualizer;
