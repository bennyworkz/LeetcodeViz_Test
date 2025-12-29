import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, Check, Copy, AlignLeft, Zap, Trophy, MessageSquare, Target, AlertCircle, Cpu, Minus, Plus, Type, Layers, Search, History, FileText } from 'lucide-react';

const APPROACHES = {
  brute: {
    id: 'brute',
    title: '1. Brute Force',
    subtitle: 'Check All Substrings',
    icon: <Search size={16} />,
    complexity: 'Time: O(N * K) | Space: O(1)',
    code: `class Solution {
    public int maxVowels(String s, int k) {
        int max = 0;
        int n = s.length();
        for (int i = 0; i <= n - k; i++) {
            int currentCount = 0;
            for (int j = i; j < i + k; j++) {
                if (isVowel(s.charAt(j))) {
                    currentCount++;
                }
            }
            max = Math.max(max, currentCount);
            if (max == k) return k;
        }
        return max;
    }
    
    private boolean isVowel(char c) {
        return "aeiou".indexOf(c) != -1;
    }
}`,
    explanation: "The intuitive approach: extract every possible substring of length 'k' and count its vowels. While correct, it performs redundant counting for overlapping characters, leading to O(N*K) complexity."
  },
  optimal: {
    id: 'optimal',
    title: '2. Sliding Window',
    subtitle: 'Fixed-Size Frame',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int maxVowels(String s, int k) {
        int max = 0, current = 0;
        String vowels = "aeiou";
        
        for (int i = 0; i < s.length(); i++) {
            // 1. Add element entering the window
            if (vowels.indexOf(s.charAt(i)) != -1) current++;
            
            // 2. Remove element leaving the window
            if (i >= k && vowels.indexOf(s.charAt(i - k)) != -1) {
                current--;
            }
            
            // 3. Keep track of the record
            max = Math.max(max, current);
            if (max == k) return k; // Optimal early exit
        }
        return max;
    }
}`,
    explanation: "The professional standard. We maintain a 'running count' for a window of size 'k'. As we move forward, we only update the count based on the one character entering and the one character leaving, achieving true linear performance."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">1456. Maximum Number of Vowels in a Substring of Given Length</h2>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given a string <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">s</code> and an integer <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">k</code>, return <em>the maximum number of vowel letters in any substring of</em> <code className="bg-slate-100 px-1.5 rounded text-pink-600 font-mono font-bold">s</code> <em>with length</em> <code className="bg-slate-100 px-1.5 rounded text-pink-600 font-mono font-bold">k</code>.
        </p>
        
        <p className="text-lg leading-relaxed">
          <strong>Vowel letters</strong> in English are <code className="bg-slate-100 px-1.5 rounded text-slate-800">'a'</code>, <code className="bg-slate-100 px-1.5 rounded text-slate-800">'e'</code>, <code className="bg-slate-100 px-1.5 rounded text-slate-800">'i'</code>, <code className="bg-slate-100 px-1.5 rounded text-slate-800">'o'</code>, and <code className="bg-slate-100 px-1.5 rounded text-slate-800">'u'</code>.
        </p>

        <div className="space-y-8 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "abciiidef", k = 3</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 3</p>
              <p className="text-xs text-slate-500 italic mt-2">Explanation: The substring "iii" contains 3 vowels.</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "aeiou", k = 2</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 2</p>
              <p className="text-xs text-slate-500 italic mt-2">Explanation: Any substring of length 2 contains 2 vowels.</p>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-100 mt-10">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <AlertCircle size={14} /> Constraints:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">1 {'<='} s.length {'<='} 10<sup>5</sup></code></li>
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">s</code> consists of lowercase English letters.</li>
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">1 {'<='} k {'<='} s.length</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const MaxVowelsSubstringVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-purple-600 p-3 rounded-xl shadow-lg shadow-purple-200">
                <Type className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Max Vowels in Substring</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">1456</span>
                <span>LeetCode 75 • Medium</span>
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
  const [sInput, setSInput] = useState("abciiidef");
  const [kInput, setKInput] = useState(3);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const vowels = "aeiou";
  const isVowel = (c: string) => vowels.includes(c?.toLowerCase());

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = sInput.length;
    let maxCount = 0;

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ phase, description: desc, line, state: { ...state, s: sInput, k: kInput } });
    };

    if (selectedApproach === 'brute') {
      addStep("Init", "Initialize max count to 0.", 3, { maxCount: 0 });
      for (let i = 0; i <= n - kInput; i++) {
        let currentCount = 0;
        addStep("Outer Loop", `Scanning substring starting at index ${i}.`, 6, { i, maxCount, currentCount: 0 });
        for (let j = i; j < i + kInput; j++) {
            const char = sInput[j];
            const isV = isVowel(char);
            if (isV) currentCount++;
            addStep("Inner Loop", `Checking char '${char}' at index ${j}. ${isV ? 'Vowel found!' : 'Not a vowel.'}`, 8, { i, j, maxCount, currentCount });
        }
        const prevMax = maxCount;
        maxCount = Math.max(maxCount, currentCount);
        addStep("Compare", `Substring complete. Found ${currentCount} vowels. Current Max: ${maxCount}`, 13, { i, maxCount, currentCount, highlightMax: maxCount > prevMax });
        if (maxCount === kInput) {
            addStep("Early Exit", `Found maximum possible vowels (${kInput}). Ending search.`, 14, { i, maxCount, currentCount, finished: true });
            return steps;
        }
      }
    } else {
      // Optimal Sliding Window
      let currentCount = 0;
      addStep("Init", "Initialize counters and start linear scan.", 3, { currentCount: 0, maxCount: 0, i: -1 });

      for (let i = 0; i < n; i++) {
          const char = sInput[i];
          const enteringVowel = isVowel(char);
          if (enteringVowel) currentCount++;

          addStep("Add Char", `Element '${char}' enters window. ${enteringVowel ? 'Vowel count + 1.' : 'No change.'}`, 8, { 
              i, currentCount, maxCount, enteringIdx: i 
          });

          if (i >= kInput) {
              const leavingChar = sInput[i - kInput];
              const leavingVowel = isVowel(leavingChar);
              if (leavingVowel) currentCount--;
              addStep("Remove Char", `Element '${leavingChar}' leaves window. ${leavingVowel ? 'Was a vowel. count - 1.' : 'No change.'}`, 11, {
                  i, currentCount, maxCount, leavingIdx: i - kInput, enteringIdx: i
              });
          }

          const prevMax = maxCount;
          maxCount = Math.max(maxCount, currentCount);
          if (maxCount > prevMax) {
              addStep("Update Max", `New global record: ${maxCount} vowels in window!`, 16, { i, currentCount, maxCount, highlightMax: true });
          }
          
          if (maxCount === kInput) {
              addStep("Early Exit", `Found maximum possible vowels for size ${kInput}.`, 17, { i, currentCount, maxCount, finished: true });
              return steps;
          }
      }
    }

    addStep("Finish", `Search complete. Max vowels: ${maxCount}`, 20, { maxCount, finished: true });
    return steps;
  }, [sInput, kInput, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const currentState = trace[currentStep] || trace[0];
  const { currentCount, maxCount, i: activeIdx, j: innerIdx, leavingIdx, enteringIdx, finished, highlightMax } = currentState.state;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      
      {/* Left Column */}
      <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-sm overflow-hidden">
             {(Object.keys(APPROACHES) as Array<keyof typeof APPROACHES>).map((key) => (
                <button
                  key={key}
                  onClick={() => { setSelectedApproach(key); setCurrentStep(0); }}
                  className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}
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
                <Code2 size={14} className="text-purple-400"/>
                <span className="font-bold text-slate-300">Solution.java</span>
              </div>
              <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors">
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                <span className={copied ? "text-green-400" : "text-slate-300"}>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-6 font-mono text-[13px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                <div className="absolute left-0 right-0 bg-purple-500/15 border-l-4 border-purple-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${(currentState.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} />
                {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                    <CodeLineRenderer key={idx} num={idx + 1} code={line} active={currentState.line === idx + 1} />
                ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-purple-600">
                 <Cpu size={18} />
                 <h4 className="text-sm font-black uppercase tracking-widest">Logic Insight</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{APPROACHES[selectedApproach].explanation}</p>
          </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-[10px] font-black text-purple-600 uppercase tracking-widest block pl-1">Input String</label>
              <input value={sInput} onChange={(e) => { setSInput(e.target.value.toLowerCase()); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-inner" maxLength={20} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block pl-1">Window Size (k)</label>
              <input type="number" value={kInput} onChange={(e) => { setKInput(parseInt(e.target.value) || 1); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner" />
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-6 border-t border-slate-100">
            <div className="w-full px-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                    <span>Scan Phase</span>
                    <span className="text-purple-500">Step {currentStep + 1} / {trace.length}</span>
                    <span>Result</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                    <div className="h-full bg-purple-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: `${(currentStep / (Math.max(1, trace.length - 1))) * 100}%` }} />
                </div>
            </div>
            <div className="flex items-center justify-between gap-4">
                <button onClick={() => setCurrentStep(0)} className="p-3 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-all" title="Reset Simulation"><RotateCcw size={20}/></button>
                <div className="flex gap-3 flex-1">
                    <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-all disabled:opacity-30 flex items-center justify-center gap-2">
                        <ChevronLeft size={18} /> Prev
                    </button>
                    <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] px-6 py-3 bg-purple-600 text-white hover:bg-purple-700 rounded-xl font-bold transition-all disabled:opacity-30 shadow-lg shadow-purple-200 flex items-center justify-center gap-2">
                        Advance Action <ChevronRight size={18} />
                    </button>
                </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3 text-slate-400">
              <Target size={14}/>
              <span className="text-[10px] font-black uppercase tracking-widest">Simulation Context</span>
            </div>
            <div className="text-lg font-black tracking-tight mb-2 uppercase">{currentState.phase}</div>
            <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-700/50">{currentState.description}</p>
        </div>

        {/* Visual Arena */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[400px] relative overflow-hidden flex flex-col justify-center items-center gap-12">
            
            {/* Dashboard */}
            <div className="flex gap-10">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Window Vowels</span>
                    <div className="text-3xl font-black text-slate-800 tabular-nums">{currentCount ?? 0}</div>
                </div>
                <div className="h-10 w-px bg-slate-100 self-end" />
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Max Count Found</span>
                    <div className={`text-3xl font-black tabular-nums transition-all duration-300 ${highlightMax ? 'text-green-500 scale-125' : 'text-purple-600'}`}>{maxCount}</div>
                </div>
            </div>

            {/* Character View */}
            <div className="flex flex-wrap justify-center gap-3 relative px-10">
                {sInput.split('').map((char, idx) => {
                    const isV = vowels.includes(char.toLowerCase());
                    const isBruteActive = selectedApproach === 'brute' && activeIdx !== undefined && idx >= activeIdx && idx < activeIdx + kInput;
                    const isInnerScan = selectedApproach === 'brute' && innerIdx === idx;
                    
                    const isSlidingInside = selectedApproach === 'optimal' && enteringIdx !== undefined && leavingIdx !== undefined ? (idx > leavingIdx && idx <= enteringIdx) : (idx <= activeIdx && idx > activeIdx - kInput);
                    const isLeaving = selectedApproach === 'optimal' && leavingIdx === idx;
                    const isEntering = selectedApproach === 'optimal' && enteringIdx === idx;

                    let bgClass = "bg-white";
                    let borderClass = "border-slate-200";
                    let textClass = isV ? "text-purple-700 font-black" : "text-slate-400 font-bold";

                    if (selectedApproach === 'brute') {
                        if (isBruteActive) {
                            bgClass = isV ? "bg-purple-50" : "bg-slate-50";
                            borderClass = "border-purple-300 shadow-sm";
                        }
                        if (isInnerScan) {
                            borderClass = "border-purple-600 ring-2 ring-purple-100 scale-110 z-10";
                            bgClass = "bg-purple-100";
                        }
                    } else {
                        if (isSlidingInside) {
                            bgClass = isV ? "bg-purple-50" : "bg-slate-50";
                            borderClass = "border-purple-400";
                        }
                        if (isLeaving) {
                            bgClass = "bg-rose-50";
                            borderClass = "border-rose-400 opacity-50 scale-90";
                        }
                        if (isEntering) {
                            bgClass = "bg-green-50 animate-pulse";
                            borderClass = "border-green-400 shadow-lg scale-110 z-10";
                        }
                    }

                    return (
                        <div key={idx} className="flex flex-col items-center transition-all duration-500">
                            <div className={`
                                w-12 h-14 border-2 rounded-xl flex items-center justify-center font-mono text-xl transition-all duration-500 relative
                                ${bgClass} ${borderClass} ${textClass}
                            `}>
                                {char}
                                {isLeaving && <div className="absolute -top-6 text-rose-500 font-black text-[9px]">OUT</div>}
                                {isEntering && <div className="absolute -top-6 text-green-500 font-black text-[9px]">IN</div>}
                            </div>
                            <span className="mt-2 text-[10px] font-mono font-black text-slate-300">{idx}</span>
                        </div>
                    );
                })}
            </div>

            {finished && (
               <div className="animate-in zoom-in duration-500">
                  <div className="bg-green-50 border-2 border-green-200 px-10 py-6 rounded-3xl flex flex-col items-center gap-2 shadow-xl">
                      <Check className="text-green-600" size={40} />
                      <span className="text-xs font-black uppercase tracking-widest text-green-700">Final Result</span>
                      <span className="text-4xl font-black text-slate-900">{maxCount}</span>
                  </div>
               </div>
            )}
        </div>
      </div>
    </div>
  );
};

const LearnMode = () => {
    const [selectedTopic, setSelectedTopic] = useState('window');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-3 space-y-2">
                <TopicButton active={selectedTopic === 'window'} onClick={() => setSelectedTopic('window')} title="1. Fixed Sliding" desc="The O(1) Update Rule" />
                <TopicButton active={selectedTopic === 'vowels'} onClick={() => setSelectedTopic('vowels')} title="2. Vowel Detection" desc="Efficient Lookups" />
                <TopicButton active={selectedTopic === 'redundancy'} onClick={() => setSelectedTopic('redundancy')} title="3. Killing Redundancy" desc="Why Brute Force fails" />
                <TopicButton active={selectedTopic === 'exit'} onClick={() => setSelectedTopic('exit')} title="4. Early Exit" desc="Performance Optimization" />
            </div>

            <div className="lg:col-span-9 bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col">
                {selectedTopic === 'window' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold mb-1">
                            <AlignLeft size={16}/> Mastering the Window
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">The Fixed-Size Frame</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Think of a sliding window as a physical frame on a conveyor belt. Instead of re-examining every character in the frame, you only care about the <strong>front</strong> and the <strong>back</strong>.
                        </p>
                        
                        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 space-y-4">
                            <h3 className="font-bold text-purple-800 flex items-center gap-2"><History size={20}/> Incremental Updates</h3>
                            <p className="text-sm text-purple-900 leading-relaxed">
                                When the frame moves one step forward:
                                <br/> 1. A new character enters at index <code>i</code>.
                                <br/> 2. An old character leaves at index <code>i - k</code>.
                                <br/> 3. The total count changes by at most 1 in either direction.
                            </p>
                        </div>
                    </div>
                )}

                {selectedTopic === 'vowels' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">Fast Vowel Detection</h2>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            To maintain performance, we need to check if a character is a vowel in constant time.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <span className="font-black text-slate-700 text-xs uppercase tracking-widest">Constant String</span>
                                <code className="block mt-2 text-purple-600 font-bold">"aeiou".indexOf(c) != -1</code>
                                <p className="text-xs text-slate-500 mt-2">Simple and memory-efficient for small fixed sets.</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <span className="font-black text-slate-700 text-xs uppercase tracking-widest">HashSet / Boolean Array</span>
                                <code className="block mt-2 text-blue-600 font-bold">isVowel[c] == true</code>
                                <p className="text-xs text-slate-500 mt-2">Best for high-frequency checks or larger target sets.</p>
                            </div>
                        </div>
                    </div>
                )}

                {selectedTopic === 'redundancy' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">The Brute Force Penalty</h2>
                        <p className="text-slate-600 leading-relaxed text-lg italic">
                           "If K is 10,000 and N is 1,000,000, checking every substring results in 10 BILLION operations."
                        </p>
                        
                        <div className="bg-slate-900 p-6 rounded-2xl text-white space-y-4 shadow-2xl border-l-4 border-purple-500">
                            <div className="flex gap-2 items-center text-xs font-bold text-purple-400 uppercase tracking-widest">
                                <AlertCircle size={14}/> Visualizing Redundancy
                            </div>
                            <p className="text-sm text-slate-300">
                                Window 1: [A, B, C, D] <br/>
                                Window 2: &nbsp;&nbsp;&nbsp;[B, C, D, E]
                                <br/><br/>
                                In Brute Force, we count B, C, and D twice! Sliding Window skips this by reusing the work already done.
                            </p>
                        </div>
                    </div>
                )}

                {selectedTopic === 'exit' && (
                    <div className="space-y-6 animate-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">The "Early Exit" Hack</h2>
                        <p className="text-slate-600">
                           In an interview, mentioning this shows a deep focus on production performance:
                        </p>
                        <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl shadow-inner">
                            <h3 className="font-bold text-indigo-800 mb-2">The Rule:</h3>
                            <p className="text-sm text-indigo-700 font-mono">if (max == k) return k;</p>
                            <p className="text-xs text-indigo-600 mt-3 leading-relaxed">
                                Since a substring of size <code>k</code> can never contain more than <code>k</code> vowels, as soon as we reach that limit, we can terminate the loop immediately. We've mathematically proven that a better result cannot exist.
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
                    <MessageSquare className="text-purple-500" size={20} />
                    Interview Q&A
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"Why is Sliding Window better than Brute Force here?"</p>
                        <p>Answer: "Brute force checks O(N) substrings and counts O(K) characters in each, resulting in O(N*K). Sliding window processes each character exactly twice (once entering, once leaving), reducing time complexity to a perfect linear O(N)."</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"How do you handle uppercase vowels?"</p>
                        <p>Answer: "I would ensure the lookup string/set includes 'AEIOU' or convert characters to lowercase before checking. In production, I'd clarify if the input is restricted to ASCII or requires Unicode support."</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 uppercase tracking-widest text-purple-400">
                    <Target size={20} />
                    The Elite Pitch
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                    "I implemented an O(N) linear-time solution using a fixed-size sliding window. By maintaining a running total of vowels within a 'k'-sized frame and updating that count in constant time as the frame advances, I eliminated all redundant counting logic. I also included an early-exit optimization that terminates the search immediately upon finding a perfect substring, ensuring peak efficiency even on worst-case datasets."
                </p>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-amber-800 flex items-center gap-2 mb-4 uppercase tracking-widest">
                    <AlertCircle size={20} />
                    Pro Insights
                </h3>
                <div className="space-y-4 text-sm">
                    <div className="bg-white p-3 rounded border border-amber-100 shadow-sm">
                        <span className="text-[10px] font-black text-amber-600 block mb-1 uppercase tracking-widest">STRING BUILDER?</span>
                        <p className="text-xs text-slate-600">Don't create actual substrings! Just use pointers. Calling <code>s.substring()</code> creates new objects and consumes O(K) memory per call.</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-amber-100 shadow-sm">
                        <span className="text-[10px] font-black text-amber-600 block mb-1 uppercase tracking-widest">ASCII OPTIMIZATION</span>
                        <p className="text-xs text-slate-600">In systems-level interviews, mention that you could use a fixed-size bitmask or a 128-byte boolean array for O(1) vowel lookups with zero hashing overhead.</p>
                    </div>
                </div>
            </div>

            <div className="bg-purple-600 text-white rounded-xl p-6 shadow-lg shadow-purple-100">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                    <Check size={20} />
                    Complexity Overview
                </h3>
                <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono">
                    <div className="bg-purple-700/50 p-4 rounded-xl border border-purple-400/30">
                        <div className="font-black text-purple-100 mb-1 uppercase tracking-widest text-[9px]">Optimal Time</div>
                        O(N) (One Pass)
                    </div>
                    <div className="bg-purple-700/50 p-4 rounded-xl border border-purple-400/30">
                        <div className="font-black text-purple-100 mb-1 uppercase tracking-widest text-[9px]">Optimal Space</div>
                        O(1) Auxiliary
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|void|Math|max|indexOf|charAt|length)\b|\b\d+\b)/g).filter(Boolean);

  return (
    <div className={`flex relative z-10 group min-h-[20.8px] ${active ? 'font-bold' : ''}`}>
      <span className="w-8 select-none text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-xs">{num}</span>
      <pre className={`font-mono whitespace-pre text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-orange-300">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-cyan-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'void', 'for'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['Math', 'max', 'indexOf', 'charAt', 'length', 'String'].includes(part)) return <span key={i} className="text-indigo-300 font-bold">{part}</span>;
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

export default MaxVowelsSubstringVisualizer;