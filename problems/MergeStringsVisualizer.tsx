import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Code2, BookOpen, Activity, GitMerge, Layers, Zap, Copy, Check, Trophy, MessageSquare, Target, AlertCircle, Clock, Save, HardDrive, AlertTriangle, Cpu, AlignLeft, MousePointer2, ArrowRight, FileText } from 'lucide-react';

const APPROACHES = {
  brute: {
    id: 'brute',
    title: '1. Brute Force',
    subtitle: 'Naive Concatenation',
    icon: <AlertTriangle size={16} />,
    complexity: 'Time: O(N²)',
    code: `class Solution {
    public String mergeAlternately(String word1, String word2) {
        String result = ""; 
        int n1 = word1.length(), n2 = word2.length();
        int max = Math.max(n1, n2);
        
        for (int k = 0; k < max; k++) {
            if (k < n1) result += word1.charAt(k); 
            if (k < n2) result += word2.charAt(k); 
        }
        return result;
    }
}`,
    explanation: "Standard naive approach. It hiddenly suffers from O(N²) time complexity in languages with immutable strings because of repeated memory reallocation and copying during concatenation.",
    lag: "LAG ALERT: O(N²) Performance Trap due to String Immutability."
  },
  sequential: {
    id: 'sequential',
    title: '2. Sequential',
    subtitle: 'Block Logic',
    icon: <Layers size={16} />,
    complexity: 'Time: O(N+M)',
    code: `class Solution {
    public String mergeAlternately(String word1, String word2) {
        StringBuilder sb = new StringBuilder();
        int min = Math.min(word1.length(), word2.length());
        
        for (int i = 0; i < min; i++) {
            sb.append(word1.charAt(i));
            sb.append(word2.charAt(i));
        }
        
        if (word1.length() > min) {
            sb.append(word1.substring(min));
        } else {
            sb.append(word2.substring(min));
        }
        return sb.toString();
    }
}`,
    explanation: "Uses StringBuilder for O(N) efficiency. It splits the logic: first merging the overlapping indices, then appending the remaining 'tail' of the longer string.",
    lag: "MODULAR: Clean but slightly more verbose logic blocks."
  },
  optimal: {
    id: 'optimal',
    title: '3. Optimal',
    subtitle: 'Single-Pass Pointers',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N+M)',
    code: `class Solution {
    public String mergeAlternately(String word1, String word2) {
        StringBuilder res = new StringBuilder();
        int i = 0, j = 0;
        int n1 = word1.length(), n2 = word2.length();

        while (i < n1 || j < n2) {
            if (i < n1) res.append(word1.charAt(i++));
            if (j < n2) res.append(word2.charAt(j++));
        }
        return res.toString();
    }
}`,
    explanation: "The Gold Standard. A single loop with two pointers. Each condition is independent, allowing the loop to elegantly handle strings of different lengths.",
    lag: "ELEGANT: Peak performance with minimal, readable code."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">1768. Merge Strings Alternately</h2>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          You are given two strings <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">word1</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">word2</code>. Merge the strings by adding letters in alternating order, starting with <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">word1</code>. If a string is longer than the other, append the additional letters onto the end of the merged string.
        </p>
        
        <p className="text-lg font-bold text-slate-800">Return the merged string.</p>

        <div className="space-y-8 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> word1 = "abc", word2 = "pqr"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "apbqcr"</p>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-100 mt-10">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <AlertCircle size={14} /> Constraints:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">1 {'<='} word1.length, word2.length {'<='} 100</code></li>
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">word1</code> and <code className="bg-slate-100 px-1.5 rounded text-slate-800">word2</code> consist of lowercase English letters.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const MergeStringsVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-200">
                <GitMerge className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Merge Strings Alternately</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">1768</span>
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
  const [word1, setWord1] = useState("abc");
  const [word2, setWord2] = useState("pqr");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const w1 = word1 || "";
    const w2 = word2 || "";
    let i = 0, j = 0, k = 0;
    let res = "";

    const addStep = (phase: string, desc: string, line: number, extra: any = {}) => {
      steps.push({ phase, description: desc, line, state: { i, j, k, result: res }, ...extra });
    };

    if (selectedApproach === 'brute') {
      addStep("Init", "Initialize result string.", 3);
      const max = Math.max(w1.length, w2.length);
      for (k = 0; k < max; k++) {
        addStep("Loop", `Iteration k=${k}.`, 7);
        if (k < w1.length) {
          res += w1[k];
          addStep("Append W1", `Appending '${w1[k]}'.`, 8, { lag: true, activeWord: 1, activeIdx: k });
        }
        if (k < w2.length) {
          res += w2[k];
          addStep("Append W2", `Appending '${w2[k]}'.`, 9, { lag: true, activeWord: 2, activeIdx: k });
        }
      }
      addStep("Done", "Return result.", 11);
    } else if (selectedApproach === 'sequential') {
      addStep("Init", "Start overlap merge.", 3);
      const min = Math.min(w1.length, w2.length);
      for (i = 0; i < min; i++) {
        addStep("Merge", `Merging index ${i}.`, 7);
        res += w1[i];
        addStep("Append W1", `Append '${w1[i]}'.`, 8, { activeWord: 1, activeIdx: i });
        res += w2[i];
        addStep("Append W2", `Append '${w2[i]}'.`, 9, { activeWord: 2, activeIdx: i });
      }
      addStep("Over", "Overlap done. Checking tail.", 12);
      if (w1.length > min) {
        res += w1.substring(min);
        addStep("Tail", "Append Word 1 tail.", 14, { isTail: true, tailWord: 1 });
      } else {
        res += w2.substring(min);
        addStep("Tail", "Append Word 2 tail.", 16, { isTail: true, tailWord: 2 });
      }
      addStep("Done", "Final result ready.", 19);
    } else {
      addStep("Init", "Pointers i=0, j=0.", 4);
      while (i < w1.length || j < w2.length) {
        addStep("Loop", `Condition: i<${w1.length} || j<${w2.length}`, 7);
        if (i < w1.length) {
          res += w1[i];
          addStep("W1", `Appending word1[${i}]: '${w1[i]}'`, 8, { activeWord: 1, activeIdx: i });
          i++;
        }
        if (j < w2.length) {
          res += w2[j];
          addStep("W2", `Appending word2[${j}]: '${w2[j]}'`, 9, { activeWord: 2, activeIdx: j });
          j++;
        }
      }
      addStep("Done", "Merged complete.", 11);
    }
    return steps;
  }, [word1, word2, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const currentState = trace[currentStep] || trace[0];
  const { result: resStr } = currentState.state;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-sm overflow-hidden">
             {(Object.keys(APPROACHES) as Array<keyof typeof APPROACHES>).map((key) => (
                <button key={key} onClick={() => { setSelectedApproach(key); setCurrentStep(0); }} className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}>
                  <div className={`mb-1 ${selectedApproach === key ? 'scale-110' : ''}`}>{APPROACHES[key].icon}</div>
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
                <div className="absolute left-0 right-0 bg-blue-500/15 border-l-4 border-blue-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${(currentState.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} />
                {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                    <CodeLineRenderer key={idx} num={idx + 1} code={line} active={currentState.line === idx + 1} />
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
              <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block pl-1">Input word1</label>
              <input value={word1} onChange={(e) => { setWord1(e.target.value.toLowerCase()); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner" maxLength={20} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-purple-600 uppercase tracking-widest block pl-1">Input word2</label>
              <input value={word2} onChange={(e) => { setWord2(e.target.value.toLowerCase()); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-inner" maxLength={20} />
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-6 border-t border-slate-100">
            <div className="w-full px-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                    <span>Setup</span>
                    <span className="text-blue-500">Step {currentStep + 1}</span>
                    <span>Result</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                    <div className="h-full bg-blue-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${(currentStep / (Math.max(1, trace.length - 1))) * 100}%` }} />
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
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-blue-500/20 p-1.5 rounded-lg">
                <Target size={14} className="text-blue-400"/>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step Detail</span>
            </div>
            <div className="text-lg font-black tracking-tight mb-2 uppercase">{currentState.phase}</div>
            <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-700/50">{currentState.description}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[350px] flex flex-col justify-center gap-8">
            <div className="relative pl-14">
              <span className="absolute left-0 top-3 text-[10px] font-black text-blue-500 uppercase w-10 text-right">word1</span>
              <div className="flex gap-1 flex-wrap">
                {word1.split('').map((char, idx) => (
                    <div key={idx} className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center font-mono font-black text-xs transition-all duration-300 
                      ${currentState.activeWord === 1 && currentState.activeIdx === idx ? 'bg-blue-500 border-blue-600 text-white scale-110 shadow-lg' : (currentState.isTail && currentState.tailWord === 1 && idx >= Math.min(word1.length, word2.length) ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-100 text-slate-300')}`}>
                      {char}
                    </div>
                ))}
              </div>
            </div>
            <div className="relative pl-14">
              <span className="absolute left-0 top-3 text-[10px] font-black text-purple-500 uppercase w-10 text-right">word2</span>
              <div className="flex gap-1 flex-wrap">
                {word2.split('').map((char, idx) => (
                    <div key={idx} className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center font-mono font-black text-xs transition-all duration-300 
                      ${currentState.activeWord === 2 && currentState.activeIdx === idx ? 'bg-purple-500 border-purple-600 text-white scale-110 shadow-lg' : (currentState.isTail && currentState.tailWord === 2 && idx >= Math.min(word1.length, word2.length) ? 'bg-purple-50 border-purple-300 text-purple-700' : 'bg-white border-slate-100 text-slate-300')}`}>
                      {char}
                    </div>
                ))}
              </div>
            </div>
            {resStr && (
              <div className="pt-8 border-t border-slate-100 flex flex-col items-center">
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-3">Merged Result</span>
                <div className="px-6 py-3 bg-green-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-green-100 animate-in zoom-in duration-500">
                  "{resStr}"
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|StringBuilder|Math)\b|\b\d+\b|\b(?:substring|equals|length|min|max|append|toString|charAt)\b)/g).filter(Boolean);
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
          if (['substring', 'equals', 'length', 'min', 'max', 'append', 'toString', 'charAt'].includes(part)) return <span key={i} className="text-indigo-300 font-bold">{part}</span>;
          return part;
        })}
      </pre>
    </div>
  );
};

const LearnMode = () => {
  const [selectedTopic, setSelectedTopic] = useState('problem');
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
      <div className="lg:col-span-3 space-y-2">
         <TopicButton active={selectedTopic === 'problem'} onClick={() => setSelectedTopic('problem')} title="1. Merging Logic" desc="The Alternating Pattern" />
         <TopicButton active={selectedTopic === 'builder'} onClick={() => setSelectedTopic('builder')} title="2. StringBuilder" desc="Memory Efficiency" />
         <TopicButton active={selectedTopic === 'optimal'} onClick={() => setSelectedTopic('optimal')} title="3. Optimal Pointers" desc="One-Pass Solution" />
      </div>
      <div className="lg:col-span-9 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 min-h-[600px]">
         {selectedTopic === 'problem' && (
           <div className="space-y-6 animate-in slide-in-from-right-4">
             <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-black mb-1">
                 <AlignLeft size={16}/> Problem Analysis
             </div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">How Merging Works</h2>
             <p className="text-slate-600 leading-relaxed text-lg text-slate-600">The core idea is to take characters from each string one by one. If one string is longer than the other, you simply append the remaining characters at the end.</p>
           </div>
         )}
      </div>
    </div>
  );
};

const InterviewHelper = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
        <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4">
                    <MessageSquare className="text-blue-500" size={20} />
                    Common Interview Prep
                </h3>
                <p className="text-sm text-slate-600 italic">"My implementation uses a single-pass two-pointer strategy combined with a StringBuilder. By decoupling the iteration from the individual string lengths, the logic remains clean and performs in guaranteed linear O(N+M) time."</p>
            </div>
        </div>
        <div className="space-y-6">
            <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-xl shadow-blue-100 flex flex-col justify-center">
                <h3 className="text-lg font-black flex items-center gap-2 mb-4">
                    <Check size={20} />
                    Complexity Overview
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div className="bg-blue-700/50 p-4 rounded-xl">O(N+M) Time</div>
                    <div className="bg-blue-700/50 p-4 rounded-xl">O(N+M) Space</div>
                </div>
            </div>
        </div>
    </div>
);

const TopicButton = ({ active, onClick, title, desc }: { active: boolean; onClick: () => void; title: string; desc: string }) => (
  <button onClick={onClick} className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group ${active ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-100' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
    <div className={`font-black uppercase tracking-tight text-sm ${active ? 'text-blue-800' : 'text-slate-700 group-hover:text-blue-700'}`}>{title}</div>
    <div className={`text-[10px] font-bold mt-1 ${active ? 'text-blue-600' : 'text-slate-400'}`}>{desc}</div>
  </button>
);

export default MergeStringsVisualizer;