import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, ArrowRight, Check, Copy, Info, AlignLeft, Zap, Type, Layers, ListFilter, Repeat, Trophy, MessageSquare, Target, AlertCircle, Cpu, FileText } from 'lucide-react';

const APPROACHES = {
  optimal: {
    id: 'optimal',
    title: '1. Tokenization',
    subtitle: 'Split & Reverse',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public String reverseWords(String s) {
        String[] words = s.trim().split("\\\\s+");
        int left = 0, right = words.length - 1;
        while (left < right) {
            String temp = words[left];
            words[left] = words[right];
            words[right] = temp;
            left++;
            right--;
        }
        return String.join(" ", words);
    }
}`,
    explanation: "This is the most readable high-level approach. It uses built-in library functions to split the string into a word array, reverses that array, and then joins them back together. Efficient and clean."
  },
  manual: {
    id: 'manual',
    title: '2. Manual Scan',
    subtitle: 'Deque Building',
    icon: <Cpu size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public String reverseWords(String s) {
        int left = 0, right = s.length() - 1;
        while (left <= right && s.charAt(left) == ' ') left++;
        while (left <= right && s.charAt(right) == ' ') right--;

        Deque<String> d = new ArrayDeque<>();
        StringBuilder word = new StringBuilder();

        while (left <= right) {
            char c = s.charAt(left);
            if (c != ' ' ) {
                word.append(c);
            } else if (word.length() > 0) {
                d.addFirst(word.toString());
                word.setLength(0);
            }
            left++;
        }
        d.addFirst(word.toString());
        return String.join(" ", d);
    }
}`,
    explanation: "Sometimes required in interviews that restrict library use. We manually scan the string character by character, build words, and push them to the front of a Deque to naturally achieve the reversed order."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">151. Reverse Words in a String</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given an input string <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">s</code>, reverse the order of the <strong>words</strong>.
        </p>
        <p className="text-lg leading-relaxed">
          A <strong>word</strong> is defined as a sequence of non-space characters. The <strong>words</strong> in <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold">s</code> will be separated by at least one space.
        </p>
        <p className="text-lg leading-relaxed">
          Return <em>a string of the words in reverse order concatenated by a single space.</em>
        </p>
        <p className="text-lg font-bold text-slate-800">Note that <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold">s</code> may contain leading or trailing spaces or multiple spaces between two words. The returned string should only have a single space separating the words. Do not include any extra spaces.</p>
        <div className="space-y-8 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "the sky is blue"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "blue is sky the"</p>
            </div>
          </div>
        </div>
        <div className="pt-10 border-t border-slate-100 mt-10">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <AlertCircle size={14} /> Constraints:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">1 {'<='} s.length {'<='} 10<sup>4</sup></code></li>
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">s</code> contains English letters (upper-case and lower-case), digits, and spaces <code className="bg-slate-100 px-1.5 rounded text-slate-800">' '</code>.</li>
            <li>There is <strong>at least one</strong> word in <code className="bg-slate-100 px-1.5 rounded text-slate-800">s</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const ReverseWordsVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-200">
                <Repeat className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reverse Words</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">151</span>
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
  const [inputS, setInputS] = useState("the sky is blue");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const s = inputS || "";
    
    const addStep = (phase: string, desc: string, line: number, extraState: any = {}) => {
      steps.push({ 
        phase, 
        description: desc, 
        line, 
        state: { ...extraState } 
      });
    };

    if (selectedApproach === 'optimal') {
      addStep("Init", "Start by cleaning the input string and tokenizing words.", 3);
      const words = s.trim().split(/\s+/).filter(w => w.length > 0);
      addStep("Tokenized", `Detected ${words.length} words.`, 3, { words: [...words] });
      
      let left = 0, right = words.length - 1;
      let wordArr = [...words];
      while (left < right) {
        addStep("Swap", `Swapping index ${left} ("${wordArr[left]}") and ${right} ("${wordArr[right]}").`, 6, { words: [...wordArr], left, right, swapping: true });
        let temp = wordArr[left];
        wordArr[left] = wordArr[right];
        wordArr[right] = temp;
        left++;
        right--;
        addStep("Post-Swap", "Pointers moved inward.", 10, { words: [...wordArr], left, right });
      }
      const result = wordArr.join(" ");
      addStep("Finish", `Join words with a space. Final: "${result}"`, 13, { words: [...wordArr], finished: true, result });
    } else {
      // Manual Approach
      addStep("Trim", "Removing leading/trailing spaces manually.", 4);
      const trimmed = s.trim();
      addStep("Init Building", "Starting character-by-character scan with a Deque.", 7);
      
      const deque: string[] = [];
      let currentWord = "";
      for (let i = 0; i < trimmed.length; i++) {
        const c = trimmed[i];
        if (c !== ' ') {
            currentWord += c;
            addStep("Scan", `Adding '${c}' to current word.`, 13, { i, currentWord, deque: [...deque] });
        } else if (currentWord.length > 0) {
            deque.unshift(currentWord);
            addStep("Add to Front", `Space found! Pushing "${currentWord}" to the front of the Deque.`, 15, { i, currentWord: "", deque: [...deque] });
            currentWord = "";
        }
      }
      if (currentWord.length > 0) {
        deque.unshift(currentWord);
        addStep("Final Word", `Pushing last word "${currentWord}" to the front.`, 20, { i: trimmed.length-1, currentWord: "", deque: [...deque] });
      }
      const result = deque.join(" ");
      addStep("Finish", `Joining Deque elements. Final: "${result}"`, 21, { deque: [...deque], finished: true, result });
    }

    return steps;
  }, [inputS, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const currentState = trace[currentStep] || trace[0];
  const { words, left, right, swapping, finished, result, deque, currentWord, i: scanIdx } = currentState.state;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      
      {/* Left Column */}
      <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-sm overflow-hidden">
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

          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[500px]">
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
                 <h4 className="text-sm font-black uppercase tracking-widest">Architectural Summary</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{APPROACHES[selectedApproach].explanation}</p>
          </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block pl-1">Input String</label>
            <input value={inputS} onChange={(e) => { setInputS(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" maxLength={30} />
          </div>

          <div className="flex flex-col gap-5 pt-6 border-t border-slate-100">
            <div className="w-full px-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                    <span>Initial</span>
                    <span className="text-indigo-500">Step {currentStep + 1} of {trace.length}</span>
                    <span>Result</span>
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
            <div className="text-lg font-black tracking-tight mb-2">{currentState.phase}</div>
            <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-700/50">{currentState.description}</p>
        </div>

        {/* Visual Arena */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[350px] relative overflow-hidden flex flex-col justify-center items-center">
            
            {selectedApproach === 'manual' && (
                <div className="w-full mb-10 flex flex-col items-center animate-in slide-in-from-top-4">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Deque (Front → Back)</div>
                    <div className="flex gap-2">
                        {(deque || []).map((w: string, idx: number) => (
                            <div key={idx} className="px-3 py-2 bg-indigo-50 border-2 border-indigo-200 text-indigo-700 font-bold rounded-xl shadow-sm animate-in zoom-in">
                                {w}
                            </div>
                        ))}
                        {(!deque || deque.length === 0) && <div className="text-xs text-slate-300 italic">Empty</div>}
                    </div>
                </div>
            )}

            <div className="flex flex-wrap justify-center gap-3 relative px-10">
                {selectedApproach === 'manual' ? (
                    <div className="flex flex-wrap justify-center gap-1 font-mono bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300">
                        {inputS.trim().split('').map((char, idx) => {
                            const isScan = scanIdx === idx;
                            return (
                                <span key={idx} className={`w-4 h-6 flex items-center justify-center transition-all duration-300 rounded ${isScan ? 'bg-indigo-500 text-white scale-125' : 'text-slate-400'}`}>
                                    {char === ' ' ? '␣' : char}
                                </span>
                            );
                        })}
                    </div>
                ) : (
                    (words || []).map((wordStr: string, idx: number) => {
                        const isLeft = left === idx;
                        const isRight = right === idx;
                        
                        let borderClass = "border-slate-200";
                        let bgClass = "bg-white";
                        let textClass = "text-slate-700 font-bold";

                        if (isLeft) borderClass = "border-blue-500 ring-2 ring-blue-100 scale-110";
                        else if (isRight) borderClass = "border-purple-500 ring-2 ring-purple-100 scale-110";
                        
                        if (swapping && (isLeft || isRight)) {
                            bgClass = "bg-green-500 animate-pulse";
                            textClass = "text-white";
                            borderClass = "border-green-600 shadow-lg shadow-green-200 scale-125 z-10";
                        }

                        return (
                            <div key={idx} className="flex flex-col items-center transition-all duration-500">
                                <div className={`
                                    px-4 py-3 border-2 rounded-xl flex items-center justify-center transition-all duration-300 relative
                                    ${bgClass} ${borderClass} ${textClass}
                                `}>
                                    {wordStr}
                                    {!finished && (
                                        <>
                                            {isLeft && <div className="absolute -top-6 text-blue-600 font-black text-[10px] animate-bounce">LEFT</div>}
                                            {isRight && <div className="absolute -top-6 text-purple-600 font-black text-[10px] animate-bounce">RIGHT</div>}
                                        </>
                                    )}
                                </div>
                                <span className="mt-2 text-[10px] font-mono font-black text-slate-300">[{idx}]</span>
                            </div>
                        );
                    })
                )}
            </div>

            {finished && (
                 <div className="mt-12 w-full max-w-lg animate-in zoom-in duration-500 text-center">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Final Joined Result</div>
                    <div className="bg-indigo-600 text-white p-6 rounded-3xl font-black text-xl shadow-xl shadow-indigo-100">
                        "{result}"
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
                <TopicButton active={selectedTopic === 'problem'} onClick={() => setSelectedTopic('problem')} title="1. Problem Rules" desc="Spaces & Words" />
                <TopicButton active={selectedTopic === 'tokenize'} onClick={() => setSelectedTopic('tokenize')} title="2. Tokenization" desc="Handling extra spaces" />
                <TopicButton active={selectedTopic === 'reverse'} onClick={() => setSelectedTopic('reverse')} title="3. Reversal Logic" desc="Array Swapping" />
                <TopicButton active={selectedTopic === 'complexity'} onClick={() => setSelectedTopic('complexity')} title="4. Complexity" desc="O(N) analysis" />
            </div>

            <div className="lg:col-span-9 bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[600px] flex flex-col">
                {selectedTopic === 'problem' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold mb-1">
                            <AlignLeft size={16}/> Understanding 151
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Reverse Words in a String</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Given an input string <code>s</code>, reverse the order of the <strong>words</strong>.
                        </p>
                        
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 space-y-4">
                            <h3 className="font-bold text-indigo-800 flex items-center gap-2"><Info size={20}/> The Rules</h3>
                            <ul className="space-y-3 text-indigo-900">
                                <li className="flex gap-2"><Check className="text-emerald-600" size={18}/> <strong>No Leading/Trailing Spaces:</strong> Result must not start or end with a space.</li>
                                <li className="flex gap-2"><Check className="text-emerald-600" size={18}/> <strong>Single Spaces:</strong> Words in the result must be separated by exactly one space.</li>
                                <li className="flex gap-2"><Check className="text-emerald-600" size={18}/> <strong>Word Definition:</strong> A word is a sequence of non-space characters.</li>
                            </ul>
                        </div>
                    </div>
                )}

                {selectedTopic === 'tokenize' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">Tokenization & Cleaning</h2>
                        <p className="text-slate-600 leading-relaxed">
                            The hardest part of this problem isn't the reversal; it's correctly identifying the words when there are multiple spaces.
                        </p>
                        
                        <div className="bg-slate-900 rounded-xl p-6 text-white space-y-4">
                            <div className="text-xs font-bold text-slate-400 uppercase">The Regex Solution</div>
                            <div className="font-mono text-sm bg-slate-800 p-4 rounded border border-slate-700">
                                <span className="text-blue-400">s.trim()</span>.split(<span className="text-emerald-400">"\\s+"</span>)
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div className="p-3 bg-slate-800 rounded border border-slate-700">
                                    <div className="text-blue-400 font-bold mb-1">trim()</div>
                                    Removes spaces from both ends of the string.
                                </div>
                                <div className="p-3 bg-slate-800 rounded border border-slate-700">
                                    <div className="text-emerald-400 font-bold mb-1">\s+</div>
                                    A regular expression that matches "one or more" whitespace characters.
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                            <h3 className="font-bold text-amber-900 mb-1">Manual Approach?</h3>
                            <p className="text-sm text-amber-800">
                                In some interviews, you might be asked <strong>not</strong> to use built-in functions like <code>split()</code>. In that case, you would use a manual loop to skip spaces and build word tokens manually.
                            </p>
                        </div>
                    </div>
                )}

                {selectedTopic === 'reverse' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">Reversing the Array</h2>
                        <p className="text-slate-600">
                            Once we have the words in an array (or list), we perform a standard in-place reversal using two pointers.
                        </p>
                        
                        <div className="flex items-center justify-center gap-4 py-8">
                             <div className="flex flex-col items-center gap-1">
                                <div className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold border border-blue-200 shadow-sm">Blue</div>
                                <span className="text-[10px] font-bold text-slate-400">Left</span>
                             </div>
                             <div className="px-2 py-1 bg-slate-100 text-slate-400 rounded">Is</div>
                             <div className="px-2 py-1 bg-slate-100 text-slate-400 rounded">Sky</div>
                             <div className="flex flex-col items-center gap-1">
                                <div className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg font-bold border border-purple-200 shadow-sm">The</div>
                                <span className="text-[10px] font-bold text-slate-400">Right</span>
                             </div>
                             <ArrowRight className="text-slate-300 mx-2" />
                             <div className="px-3 py-2 bg-green-500 text-white rounded-lg font-bold shadow-md animate-pulse">Swap!</div>
                        </div>

                        <p className="text-slate-600 text-sm italic border-t pt-4">
                            Note: If using Python, this is as simple as <code>words[::-1]</code>. In Java, <code>Collections.reverse(list)</code> works, or a manual loop as shown in the visualizer.
                        </p>
                    </div>
                )}

                {selectedTopic === 'complexity' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">Complexity Analysis</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                                <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><Zap className="text-blue-500" size={18}/> Time Complexity</h3>
                                <div className="text-3xl font-mono font-bold text-slate-900 mb-2">O(N)</div>
                                <p className="text-sm text-slate-500">
                                    We iterate through the string once to split it, once to reverse the list, and once to join it. N is the number of characters in the string.
                                </p>
                            </div>
                            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                                <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><Layers className="text-purple-500" size={18}/> Space Complexity</h3>
                                <div className="text-3xl font-mono font-bold text-slate-900 mb-2">O(N)</div>
                                <p className="text-sm text-slate-500">
                                    We store the words in an array. In the worst case (a string with only one-character words), the array size is proportional to the input length.
                                </p>
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
                    <MessageSquare className="text-indigo-500" size={20} />
                    Interview Q&A
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-bold text-slate-800 mb-1">Interviewer asks: "How do you reverse the words while cleaning up variable whitespace?"</p>
                        <p>Answer: "I use a robust tokenization strategy. By trimming and splitting using a regular expression that collapses multiple whitespace characters, I obtain a clean array of words. Reversing that array and joining with a single space satisfies all spacing requirements efficiently in O(N) time."</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-bold text-slate-800 mb-1">Interviewer asks: "Can you do this with O(1) auxiliary space?"</p>
                        <p>Answer: "In languages with mutable strings like C++, yes. I would reverse the entire string first, then iterate and reverse each word in-place. However, in Java or JS, strings are immutable, so the O(N) storage for word tokens is effectively mandatory for any solution."</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                    <Target className="text-amber-400" size={20} />
                    The "Elite" Pitch
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                    "My solution follows a three-stage pipeline: robust tokenization via regex, symmetric array reversal, and sanitized joining. This ensures the output is free of redundant spaces while maintaining a linear O(N) execution time. I proactively considered string immutability in the JVM, justifying the O(N) space complexity as the optimal trade-off for maintainable and performant code."
                </p>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-amber-800 flex items-center gap-2 mb-4">
                    <AlertCircle size={20} />
                    Senior Interviewer Pro-Tips
                </h3>
                <div className="space-y-4 text-sm">
                    <div className="bg-white p-3 rounded border border-amber-100 shadow-sm">
                        <span className="text-xs font-bold text-amber-600 block mb-1">REGEX PITFALLS</span>
                        <p className="text-xs text-slate-600">Explain why <code>split(" ")</code> is insufficient—it returns empty strings for multiple spaces. <code>split("\\s+")</code> is the professional choice for collapsing whitespace.</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-amber-100 shadow-sm">
                        <span className="text-xs font-bold text-amber-600 block mb-1">MANUAL WORD BUILDING</span>
                        <p className="text-xs text-slate-600">If the interviewer bans <code>split()</code>, demonstrate a manual character scan that skips spaces—it shows you understand the low-level mechanics of parsing.</p>
                    </div>
                </div>
            </div>

            <div className="bg-indigo-600 text-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                    <Check size={20} />
                    Complexity Overview
                </h3>
                <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono">
                    <div className="bg-indigo-700/50 p-3 rounded border border-indigo-400">
                        <div className="font-bold text-indigo-200 mb-1 uppercase tracking-widest text-[10px]">Time</div>
                        O(N)
                    </div>
                    <div className="bg-indigo-700/50 p-3 rounded border border-indigo-400">
                        <div className="font-bold text-indigo-200 mb-1 uppercase tracking-widest text-[10px]">Space</div>
                        O(N) for Token Storage
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const StepItem = ({ num, title, text }: { num: string, title: string, text: string }) => (
    <div className="flex gap-4 items-start">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0 shadow-sm">{num}</div>
        <div>
            <h4 className="font-bold text-slate-800">{title}</h4>
            <p className="text-slate-500 text-sm">{text}</p>
        </div>
    </div>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|List|ArrayList|Math|join|split|trim|Deque|ArrayDeque|StringBuilder|append|addFirst|length|setLength|charAt)\b|\b\d+\b)/g).filter(Boolean);

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
          if (['String', 'List', 'ArrayList', 'Math', 'Deque', 'ArrayDeque', 'StringBuilder'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['join', 'split', 'trim', 'append', 'addFirst', 'length', 'setLength', 'charAt'].includes(part)) return <span key={i} className="text-indigo-300 font-bold">{part}</span>;
          return part;
        })}
      </pre>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

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

export default ReverseWordsVisualizer;