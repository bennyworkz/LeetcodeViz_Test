import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, Check, Copy, AlignLeft, Zap, Trophy, MessageSquare, Target, AlertCircle, Cpu, MousePointer2, ListChecks, ArrowDown, X, FileText } from 'lucide-react';

const APPROACHES = {
  optimal: {
    id: 'optimal',
    title: 'Two-Pointer Scan',
    subtitle: 'Synchronous Traversal',
    icon: <Zap size={16} />,
    complexity: 'Time: O(T) | Space: O(1)',
    code: `class Solution {
    public boolean isSubsequence(String s, String t) {
        if (s.length() == 0) return true;
        int sIdx = 0, tIdx = 0;
        
        while (tIdx < t.length()) {
            if (s.charAt(sIdx) == t.charAt(tIdx)) {
                sIdx++;
                if (sIdx == s.length()) return true;
            }
            tIdx++;
        }
        return false;
    }
}`,
    explanation: "This approach uses two pointers. One pointer (tIdx) scans through the entire target string 't'. The other pointer (sIdx) only advances when we find a match in 't' for the current character in 's'. If the 's' pointer reaches the end, all characters were found in order."
  },
  recursive: {
    id: 'recursive',
    title: 'Recursive Check',
    subtitle: 'Top-Down Matching',
    icon: <Cpu size={16} />,
    complexity: 'Time: O(T) | Space: O(T) Stack',
    code: `class Solution {
    public boolean isSubsequence(String s, String t) {
        return check(s, t, 0, 0);
    }
    
    private boolean check(String s, String t, int i, int j) {
        if (i == s.length()) return true;
        if (j == t.length()) return false;
        
        if (s.charAt(i) == t.charAt(j)) {
            return check(s, t, i + 1, j + 1);
        }
        return check(s, t, i, j + 1);
    }
}`,
    explanation: "A declarative way to think about the problem. If characters match, move both pointers. If they don't, we must skip the current character in 't' and try again."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">392. Is Subsequence</h2>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given two strings <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">s</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">t</code>, return <code className="font-bold text-slate-800">true</code> if <code className="italic text-slate-800">s</code> is a <strong>subsequence</strong> of <code className="italic text-slate-800">t</code>, or <code className="font-bold text-slate-800">false</code> otherwise.
        </p>
        
        <p className="text-lg leading-relaxed">
          A <strong>subsequence</strong> of a string is a new string that is formed from the original string by deleting some (can be none) of the characters without disturbing the relative positions of the remaining characters. (i.e., <code className="bg-slate-100 px-1.5 rounded">"ace"</code> is a subsequence of <code className="bg-slate-100 px-1.5 rounded">"abcde"</code> while <code className="bg-slate-100 px-1.5 rounded">"aec"</code> is not).
        </p>

        <div className="space-y-8 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "abc", t = "ahbgdc"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> true</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "axc", t = "ahbgdc"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> false</p>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-100 mt-10">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <AlertCircle size={14} /> Constraints:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">0 {'<='} s.length {'<='} 100</code></li>
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">0 {'<='} t.length {'<='} 10<sup>4</sup></code></li>
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">s</code> and <code className="bg-slate-100 px-1.5 rounded text-slate-800">t</code> consist only of lowercase English letters.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const IsSubsequenceVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-200">
                <ListChecks className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Is Subsequence</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">392</span>
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
  const [sInput, setSInput] = useState("abc");
  const [tInput, setTInput] = useState("ahbgdc");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const s = sInput || "";
    const t = tInput || "";
    
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ phase, description: desc, line, state: { ...state } });
    };

    if (s.length === 0) {
        addStep("Check", "Empty string 's' is always a subsequence.", 3, { sIdx: 0, tIdx: 0, finished: true, success: true });
        return steps;
    }

    let sIdx = 0;
    let tIdx = 0;

    addStep("Init", "Initialize pointers at the start of both strings.", 4, { sIdx, tIdx });

    while (tIdx < t.length) {
      addStep("Check Char", `Comparing s[${sIdx}] ('${s[sIdx]}') with t[${tIdx}] ('${t[tIdx]}').`, 7, { sIdx, tIdx });
      
      if (s[sIdx] === t[tIdx]) {
        sIdx++;
        addStep("Match Found", `Characters match! Incrementing 's' pointer to ${sIdx}.`, 8, { sIdx, tIdx, matched: true });
        
        if (sIdx === s.length) {
            addStep("Complete", "All characters of 's' found in order. Returning true.", 9, { sIdx, tIdx, finished: true, success: true });
            return steps;
        }
      } else {
        addStep("No Match", "Characters do not match. Skipping this character in 't'.", 11, { sIdx, tIdx, matched: false });
      }
      
      tIdx++;
      if (tIdx < t.length) {
        addStep("Advance", `Moving to next character in 't' (index ${tIdx}).`, 11, { sIdx, tIdx });
      }
    }

    addStep("Fail", "Reached end of 't' without finding all characters of 's'.", 13, { sIdx, tIdx, finished: true, success: false });
    return steps;
  }, [sInput, tInput]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const currentState = trace[currentStep] || trace[0];
  const { sIdx, tIdx, finished, success, matched } = currentState.state;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      
      {/* Left Column */}
      <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-sm">
             {(Object.keys(APPROACHES) as Array<keyof typeof APPROACHES>).map((key) => (
                <button
                  key={key}
                  onClick={() => { setSelectedApproach(key); setCurrentStep(0); }}
                  className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}
                >
                  <div className={`mb-1 transition-transform duration-300 ${selectedApproach === key ? 'scale-110' : ''}`}>
                    {APPROACHES[key].icon}
                  </div>
                  <span className="text-xs font-black uppercase tracking-tight">{APPROACHES[key].title}</span>
                  <span className={`text-[10px] opacity-70 ${selectedApproach === key ? 'text-white' : 'text-slate-400'}`}>{APPROACHES[key].complexity}</span>
                </button>
             ))}
          </div>

          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[400px]">
            <div className="bg-[#1e293b] px-4 py-3 text-xs font-mono text-slate-400 flex justify-between items-center border-b border-slate-800/50">
              <div className="flex items-center gap-2">
                <Code2 size={14} className="text-indigo-400"/>
                <span className="font-bold text-slate-300">Solution.java</span>
              </div>
              <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors">
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                <span className={copied ? "text-green-400" : "text-slate-300"}>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-6 font-mono text-[13px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                <div className="absolute left-0 right-0 bg-indigo-500/15 border-l-4 border-indigo-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${(currentState.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} />
                {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                    <CodeLineRenderer key={idx} num={idx + 1} code={line} active={currentState.line === idx + 1} />
                ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                 <Cpu size={18} />
                 <h4 className="text-sm font-black uppercase tracking-widest">Logic Insight</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{APPROACHES[selectedApproach].explanation}</p>
          </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block pl-1">Subsequence (s)</label>
              <input value={sInput} onChange={(e) => { setSInput(e.target.value.toLowerCase()); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" maxLength={15} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block pl-1">Target (t)</label>
              <input value={tInput} onChange={(e) => { setTInput(e.target.value.toLowerCase()); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" maxLength={25} />
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-6 border-t border-slate-100">
            <div className="w-full px-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                    <span>Scan</span>
                    <span className="text-blue-500">Step {currentStep + 1} / {trace.length}</span>
                    <span>Done</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                    <div className="h-full bg-indigo-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(79,70,229,0.5)]" style={{ width: `${(currentStep / (Math.max(1, trace.length - 1))) * 100}%` }} />
                </div>
            </div>
            <div className="flex items-center justify-between gap-4">
                <button onClick={() => setCurrentStep(0)} className="p-3 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-all" title="Reset Simulation"><RotateCcw size={20}/></button>
                <div className="flex gap-3 flex-1">
                    <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-all disabled:opacity-30 flex items-center justify-center gap-2">
                        <ChevronLeft size={18} /> Prev
                    </button>
                    <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold transition-all disabled:opacity-30 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
                        Next Action <ChevronRight size={18} />
                    </button>
                </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3 text-slate-400">
              <Target size={14}/>
              <span className="text-[10px] font-black uppercase tracking-widest">Step Analysis</span>
            </div>
            <div className="text-lg font-black tracking-tight mb-2 uppercase">{currentState.phase}</div>
            <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-700/50">{currentState.description}</p>
        </div>

        {/* Visual Arena */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[400px] relative overflow-hidden flex flex-col justify-center items-center gap-12">
            
            {/* Subsequence Row */}
            <div className="flex flex-col items-center gap-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subsequence (s)</span>
                <div className="flex gap-2">
                    {sInput.split('').map((char, idx) => {
                        const isPointer = sIdx === idx;
                        const isMatched = idx < sIdx;
                        
                        let bgClass = "bg-white";
                        let borderClass = "border-slate-200";
                        let textClass = "text-slate-700 font-bold";

                        if (isPointer && !finished) {
                            bgClass = "bg-indigo-50 border-indigo-400 ring-2 ring-indigo-50";
                            textClass = "text-indigo-700 font-black";
                        } else if (isMatched) {
                            bgClass = "bg-green-50 border-green-200 text-green-700";
                        }

                        return (
                            <div key={idx} className={`w-12 h-14 border-2 rounded-xl flex items-center justify-center font-mono text-xl transition-all duration-300 relative ${bgClass} ${borderClass} ${textClass}`}>
                                {char}
                                {isPointer && !finished && (
                                    <div className="absolute -top-6 text-indigo-500 animate-bounce">
                                        <MousePointer2 size={16} />
                                    </div>
                                )}
                                {isMatched && (
                                    <div className="absolute -top-2 -right-1 bg-green-500 text-white rounded-full p-0.5 border border-white">
                                        <Check size={8} strokeWidth={4} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {sInput.length === 0 && <span className="text-slate-300 italic text-sm">Empty</span>}
                </div>
            </div>

            <div className="h-6 flex items-center justify-center text-slate-300">
                <ArrowDown size={24} className={matched ? "text-green-500 animate-bounce" : "opacity-30"} />
            </div>

            {/* Target Row */}
            <div className="flex flex-col items-center gap-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target String (t)</span>
                <div className="flex flex-wrap justify-center gap-2">
                    {tInput.split('').map((char, idx) => {
                        const isPointer = tIdx === idx;
                        
                        let bgClass = "bg-white";
                        let borderClass = "border-slate-200";
                        let textClass = "text-slate-700 font-bold";

                        if (isPointer && !finished) {
                            if (matched) {
                                bgClass = "bg-green-500 shadow-lg shadow-green-100 scale-110";
                                textClass = "text-white";
                                borderClass = "border-green-600";
                            } else {
                                bgClass = "bg-blue-50 border-blue-400 ring-2 ring-blue-50";
                                textClass = "text-blue-700 font-black";
                            }
                        }

                        return (
                            <div key={idx} className={`w-10 h-12 border-2 rounded-lg flex items-center justify-center font-mono text-lg transition-all duration-300 relative ${bgClass} ${borderClass} ${textClass}`}>
                                {char}
                                {isPointer && !finished && (
                                    <div className="absolute -bottom-6 text-blue-500 animate-bounce">
                                        <Target size={14} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {finished && (
               <div className="animate-in zoom-in duration-500">
                  <div className={`bg-white border-2 px-10 py-6 rounded-3xl flex flex-col items-center gap-2 shadow-xl ${success ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
                      {success ? <Check className="text-green-600" size={40} /> : <X className="text-red-600" size={40} />}
                      <span className={`text-xs font-black uppercase tracking-widest ${success ? 'text-green-700' : 'text-red-700'}`}>Result</span>
                      <span className="text-4xl font-black text-slate-900">{success ? 'True' : 'False'}</span>
                  </div>
               </div>
            )}
        </div>
      </div>
    </div>
  );
};

const LearnMode = () => {
    const [selectedTopic, setSelectedTopic] = useState('goal');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-3 space-y-2">
                <TopicButton active={selectedTopic === 'goal'} onClick={() => setSelectedTopic('goal')} title="1. Subsequence Rules" desc="Order Matters" />
                <TopicButton active={selectedTopic === 'pointers'} onClick={() => setSelectedTopic('pointers')} title="2. The Two Pointers" desc="Scanner vs Matcher" />
                <TopicButton active={selectedTopic === 'followup'} onClick={() => setSelectedTopic('followup')} title="3. Scaling Up" desc="Multi-query follow-up" />
            </div>

            <div className="lg:col-span-9 bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col">
                {selectedTopic === 'goal' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold mb-1">
                            <AlignLeft size={16}/> Understanding 392
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">What is a Subsequence?</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            A string <code>s</code> is a subsequence of <code>t</code> if it can be formed by deleting characters from <code>t</code> without changing the relative order of the remaining characters.
                        </p>
                        
                        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-4">
                            <h3 className="font-bold text-indigo-800 flex items-center gap-2"><Check size={20}/> Stability is Key</h3>
                            <p className="text-indigo-900">
                                If <code>'a'</code> comes before <code>'c'</code> in your subsequence, you <strong>must</strong> find an <code>'a'</code> in the target string that appears before a <code>'c'</code>.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <span className="font-black text-emerald-700 text-xs">VALID</span>
                                <p className="text-sm text-emerald-900 mt-1">s: "abc", t: "<u>a</u>h<u>b</u>gd<u>c</u>"</p>
                            </div>
                            <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                                <span className="font-black text-rose-700 text-xs">INVALID</span>
                                <p className="text-sm text-rose-900 mt-1">s: "acb", t: "<u>a</u>h<u>b</u>gd<u>c</u>" (b comes after c in target)</p>
                            </div>
                        </div>
                    </div>
                )}

                {selectedTopic === 'pointers' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">The Two-Pointer Rhythm</h2>
                        <p className="text-slate-600">The most efficient solution maintains two distinct pointers:</p>
                        
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">S</div>
                                <div>
                                    <span className="font-black text-emerald-700 uppercase text-xs tracking-widest">Matcher Pointer (s)</span>
                                    <p className="text-sm text-emerald-900 mt-1">Tracks which character of the subsequence we are currently looking for.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">T</div>
                                <div>
                                    <span className="font-black text-blue-700 uppercase text-xs tracking-widest">Scanner Pointer (t)</span>
                                    <p className="text-sm text-blue-900 mt-1">Iterates through every character of the target string searching for the next match.</p>
                                </div>
                            </div>
                        </div>
                        
                        <p className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 border border-slate-200 italic">
                            "If s[i] matches t[j], it means we found what we were looking for. We move to the next target character in 's'. Regardless of a match, we always move to the next character in 't' because we can never 'un-scan' the past."
                        </p>
                    </div>
                )}

                {selectedTopic === 'followup' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">Interviewer Follow-up</h2>
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-xl">
                            <p className="font-black text-amber-900 mb-2">"What if you have 1 billion subsequence strings to check against the same target string?"</p>
                            <p className="text-sm text-amber-800">
                                Scanning the target O(T) for every single query would be inefficient (O(N * T)). Instead, we should <strong>pre-process</strong> the target string.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-800">The Map-of-Indices Optimization:</h3>
                            <p className="text-sm text-slate-600">
                                Store a Map or Array where each key is a character ('a', 'b', etc.) and the value is a sorted list of indices where that character appears in <code>t</code>.
                            </p>
                            <div className="p-4 bg-slate-900 rounded-xl text-indigo-300 font-mono text-xs">
                                t = "abac"<br/>
                                map: &#123; 'a': [0, 2], 'b': [1], 'c': [3] &#125;
                            </div>
                            <p className="text-sm text-slate-600">
                                Now, for each character in query string <code>s</code>, use <strong>Binary Search</strong> on the map to find the first index that appears <i>after</i> the index of the previous match. This reduces query time to O(S log T).
                            </p>
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
                    <MessageSquare className="text-indigo-500" size={20} />
                    Interview Q&A
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"Why is this considered a 'Two Pointer' problem?"</p>
                        <p>Answer: "It involves maintaining two independent cursors moving at different rates. One cursor represents our progress through the 'goal' string, while the other represents our scan of the 'resource' string. The asymmetric speed of advancement is characteristic of two-pointer greedy approaches."</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"Can you solve this using Dynamic Programming?"</p>
                        <p>Answer: "Yes, you can solve this by finding the Longest Common Subsequence (LCS) and checking if its length equals <code>s.length()</code>. However, that would take O(S*T) time and space, which is significantly less efficient than the O(T) two-pointer solution."</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg border-l-4 border-indigo-500">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 uppercase tracking-widest text-indigo-400">
                    <Target size={20} />
                    The Elite Pitch
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                    "I implemented a linear O(T) single-pass greedy solution using two pointers. By maintaining independent indices for both the subsequence and the target, I ensured that we only traverse the target string once. This approach guarantees optimal O(1) space complexity. I also addressed the scalability requirements by suggesting a pre-indexed map with binary search for multi-query scenarios, reducing lookup time to logarithmic complexity relative to the target length."
                </p>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-indigo-800 flex items-center gap-2 mb-4 uppercase tracking-widest">
                    <AlertCircle size={20} />
                    Senior Engineering Tips
                </h3>
                <div className="space-y-4 text-sm">
                    <div className="bg-white p-3 rounded border border-indigo-100 shadow-sm">
                        <span className="text-[10px] font-black text-indigo-600 block mb-1 uppercase tracking-widest">EARLY EXIT</span>
                        <p className="text-xs text-slate-600">Mention that you check <code>if (sIdx == s.length()) return true;</code> inside the loop. This 'early exit' can save significant time if the subsequence is matched near the start of a very long target string.</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-indigo-100 shadow-sm">
                        <span className="text-[10px] font-black text-indigo-600 block mb-1 uppercase tracking-widest">EMPTY STRING CASE</span>
                        <p className="text-xs text-slate-600">Don't forget the edge case where <code>s</code> is empty. An empty string is mathematically a subsequence of any string. Explicitly handling this (or showing how the loop naturally handles it) demonstrates attention to detail.</p>
                    </div>
                </div>
            </div>

            <div className="bg-indigo-600 text-white rounded-xl p-6 shadow-lg shadow-indigo-100">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                    <Check size={20} />
                    Complexity Overview
                </h3>
                <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono">
                    <div className="bg-indigo-700/50 p-4 rounded-xl border border-indigo-400/30">
                        <div className="font-black text-indigo-100 mb-1 uppercase tracking-widest text-[9px]">Time Complexity</div>
                        O(T) (Target Length)
                    </div>
                    <div className="bg-indigo-700/50 p-4 rounded-xl border border-indigo-400/30">
                        <div className="font-black text-indigo-100 mb-1 uppercase tracking-widest text-[9px]">Space Complexity</div>
                        O(1) Auxiliary
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|void|boolean|charAt|length)\b|\b\d+\b)/g).filter(Boolean);

  return (
    <div className={`flex relative z-10 group min-h-[20.8px] ${active ? 'font-bold' : ''}`}>
      <span className="w-8 select-none text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-xs">{num}</span>
      <pre className={`font-mono whitespace-pre text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-orange-300">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-cyan-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'void', 'boolean'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['charAt', 'length'].includes(part)) return <span key={i} className="text-indigo-300 font-bold">{part}</span>;
          return part;
        })}
      </pre>
    </div>
  );
};

const TopicButton: React.FC<{ active: boolean; onClick: () => void; title: string; desc: string }> = ({ active, onClick, title, desc }) => (
  <button 
    onClick={onClick}
    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group
      ${active 
        ? 'bg-indigo-50 border-indigo-500 shadow-md ring-1 ring-indigo-200' 
        : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}
    `}
  >
    <div className={`font-bold ${active ? 'text-indigo-800' : 'text-slate-700 group-hover:text-indigo-700'}`}>
      {title}
    </div>
    <div className={`text-xs mt-1 ${active ? 'text-indigo-600' : 'text-slate-400'}`}>
      {desc}
    </div>
  </button>
);

export default IsSubsequenceVisualizer;