import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, ArrowRight, ArrowLeft, Check, Copy, Info, AlignLeft, Zap, Type, BarChart3, Trophy, MessageSquare, Target, AlertCircle, Cpu, Layers, FileText } from 'lucide-react';

const APPROACHES = {
  optimal: {
    id: 'optimal',
    title: '1. Two-Pointer',
    subtitle: 'Inward Convergence',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public String reverseVowels(String s) {
        char[] word = s.toCharArray();
        int left = 0, right = s.length() - 1;
        String vowels = "aeiouAEIOU";
        
        while (left < right) {
            while (left < right && vowels.indexOf(word[left]) == -1) {
                left++;
            }
            while (left < right && vowels.indexOf(word[right]) == -1) {
                right--;
            }
            
            char temp = word[left];
            word[left] = word[right];
            word[right] = temp;
            
            left++;
            right--;
        }
        return new String(word);
    }
}`,
    explanation: "The standard optimal approach using two pointers. We move inward from both ends, identifying vowels and swapping them symmetrically. This avoids unnecessary memory for a second list."
  },
  collection: {
    id: 'collection',
    title: '2. List Collection',
    subtitle: 'Extract & Replace',
    icon: <Layers size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public String reverseVowels(String s) {
        List<Character> found = new ArrayList<>();
        String vowels = "aeiouAEIOU";
        for (char c : s.toCharArray()) {
            if (vowels.indexOf(c) != -1) found.add(c);
        }
        
        StringBuilder sb = new StringBuilder();
        int vIdx = found.size() - 1;
        for (char c : s.toCharArray()) {
            if (vowels.indexOf(c) != -1) {
                sb.append(found.get(vIdx--));
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }
}`,
    explanation: "This approach first extracts all vowels into a separate list. Then, it rebuilds the string, pulling from the end of the vowel list whenever a vowel spot is encountered. Easier to reason about but uses more auxiliary space."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">345. Reverse Vowels of a String</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given a string <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">s</code>, reverse only all the vowels in the string and return it.
        </p>
        <p className="text-lg leading-relaxed">
          The vowels are <code className="font-bold text-slate-800">'a'</code>, <code className="font-bold text-slate-800">'e'</code>, <code className="font-bold text-slate-800">'i'</code>, <code className="font-bold text-slate-800">'o'</code>, and <code className="font-bold text-slate-800">'u'</code>, and they can appear in both lower and upper cases, more than once.
        </p>
        <div className="space-y-8 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "IceCreAm"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "AceCreIm"</p>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "leetcode"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "leotcede"</p>
            </div>
          </div>
        </div>
        <div className="pt-10 border-t border-slate-100 mt-10">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <AlertCircle size={14} /> Constraints:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">1 {'<='} s.length {'<='} 3 * 10<sup>5</sup></code></li>
            <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">s</code> consists of printable ASCII characters.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const ReverseVowelsVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-amber-600 p-3 rounded-xl shadow-lg shadow-amber-200">
                <Type className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reverse Vowels</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">345</span>
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
  const [inputS, setInputS] = useState("IceCreAm");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const s = inputS || "";
    const vowels = "aeiouAEIOU";
    const isVowel = (c: string) => vowels.indexOf(c) !== -1;
    
    let word = s.split('');
    let left = 0;
    let right = word.length - 1;

    const addStep = (phase: string, desc: string, line: number, extraState: any = {}) => {
      steps.push({ 
        phase, 
        description: desc, 
        line, 
        state: { 
          left, 
          right, 
          word: [...word],
          ...extraState
        } 
      });
    };

    if (selectedApproach === 'optimal') {
      addStep("Init", "Initialize pointers at the start and end of the word.", 4);
      while (left < right) {
          addStep("Outer Loop", `Comparing left (${left}) and right (${right}).`, 8);
          
          while (left < right && !isVowel(word[left])) {
              left++;
              addStep("Scan Left", `Character at index ${left-1} is not a vowel. Moving left pointer.`, 10);
          }
          if (left < right) addStep("Left Found", `Found vowel '${word[left]}' at index ${left}.`, 11, { leftFound: true });

          while (left < right && !isVowel(word[right])) {
              right--;
              addStep("Scan Right", `Character at index ${right+1} is not a vowel. Moving right pointer.`, 13);
          }
          if (left < right) addStep("Right Found", `Found vowel '${word[right]}' at index ${right}.`, 14, { rightFound: true });

          if (left < right) {
              addStep("Swap", `Both pointers on vowels. Swapping '${word[left]}' and '${word[right]}'.`, 18, { swapping: true });
              let temp = word[left];
              word[left] = word[right];
              word[right] = temp;
              addStep("Post-Swap", "Swap complete. Moving pointers inward.", 23);
              left++;
              right--;
          }
      }
      addStep("Finish", "Pointers have met or crossed. Reverse complete.", 26, { finished: true });
    } else {
      // Collection Approach
      addStep("Init", "Start collection phase: Extract all vowels.", 3);
      const foundVowels = s.split('').filter(isVowel);
      addStep("Collected", `Found ${foundVowels.length} vowels: [${foundVowels.join(', ')}]`, 7, { collected: [...foundVowels] });
      
      let vIdx = foundVowels.length - 1;
      const res: string[] = [];
      for (let i = 0; i < s.length; i++) {
        if (isVowel(s[i])) {
            res.push(foundVowels[vIdx]);
            addStep("Replace", `Index ${i} is a vowel spot. Filling with collected vowel '${foundVowels[vIdx]}'.`, 14, { i, vIdx, word: [...res, ...s.substring(i+1).split('')], collected: [...foundVowels] });
            vIdx--;
        } else {
            res.push(s[i]);
            addStep("Keep", `Index ${i} is a consonant. Keeping '${s[i]}'.`, 16, { i, word: [...res, ...s.substring(i+1).split('')], collected: [...foundVowels] });
        }
      }
      addStep("Result", "String reconstruction finished.", 18, { finished: true, word: res });
    }

    return steps;
  }, [inputS, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const currentState = trace[currentStep] || trace[0];
  const { left, right, word, swapping, finished, collected, i: scanIdx } = currentState.state;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      
      {/* Left Column */}
      <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-sm overflow-hidden">
             {(Object.keys(APPROACHES) as Array<keyof typeof APPROACHES>).map((key) => (
                <button
                  key={key}
                  onClick={() => { setSelectedApproach(key); setCurrentStep(0); }}
                  className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-amber-600 text-white shadow-lg shadow-amber-100' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}
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
                <Code2 size={14} className="text-amber-400"/>
                <span className="font-bold text-slate-300">Solution.java</span>
              </div>
              <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors">
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                <span className={copied ? "text-green-400" : "text-slate-300"}>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-6 font-mono text-[13px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                <div className="absolute left-0 right-0 bg-amber-500/15 border-l-4 border-amber-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${(currentState.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} />
                {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                    <CodeLineRenderer key={idx} num={idx + 1} code={line} active={currentState.line === idx + 1} />
                ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-amber-600">
                 <Cpu size={18} />
                 <h4 className="text-sm font-black uppercase tracking-widest">Strategy Analysis</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{APPROACHES[selectedApproach].explanation}</p>
          </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest block pl-1">Input String</label>
            <input value={inputS} onChange={(e) => { setInputS(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-inner" maxLength={20} />
          </div>

          <div className="flex flex-col gap-5 pt-6 border-t border-slate-100">
            <div className="w-full px-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                    <span>Initial</span>
                    <span className="text-amber-500">Step {currentStep + 1} of {trace.length}</span>
                    <span>Result</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                    <div className="h-full bg-amber-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: `${(currentStep / (Math.max(1, trace.length - 1))) * 100}%` }} />
                </div>
            </div>
            <div className="flex items-center justify-between gap-4">
                <button onClick={() => setCurrentStep(0)} className="p-3 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-all" title="Reset Simulation"><RotateCcw size={20}/></button>
                <div className="flex gap-3 flex-1">
                    <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-all disabled:opacity-30 flex items-center justify-center gap-2">
                        <ChevronLeft size={18} /> Prev
                    </button>
                    <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] px-6 py-3 bg-amber-600 text-white hover:bg-amber-700 rounded-xl font-bold transition-all disabled:opacity-30 shadow-lg shadow-amber-200 flex items-center justify-center gap-2">
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
            
            {selectedApproach === 'collection' && collected && (
                <div className="w-full mb-10 flex flex-col items-center animate-in slide-in-from-top-4">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Vowel Extract</div>
                    <div className="flex gap-2">
                        {collected.map((v: string, idx: number) => (
                            <div key={idx} className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 ${currentState.state.vIdx === idx ? 'bg-amber-500 text-white border-amber-600 scale-125' : 'bg-amber-50 border-amber-200 text-amber-600'}`}>
                                {v}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-wrap justify-center gap-3 relative px-10">
                {(word || []).map((char: string, idx: number) => {
                    const isV = "aeiouAEIOU".indexOf(char) !== -1;
                    const isLeftPos = left === idx;
                    const isRightPos = right === idx;
                    const isScanning = scanIdx === idx;
                    
                    let bgClass = "bg-white";
                    let borderClass = "border-slate-200";
                    let textClass = "text-slate-700 font-bold";
                    
                    if (isV) {
                        bgClass = "bg-amber-50";
                        borderClass = "border-amber-300";
                        textClass = "text-amber-700 font-black";
                    }
                    
                    if (selectedApproach === 'optimal') {
                        if (isLeftPos) borderClass = "border-blue-500 ring-2 ring-blue-100 scale-110";
                        else if (isRightPos) borderClass = "border-purple-500 ring-2 ring-purple-100 scale-110";
                        if (swapping && (isLeftPos || isRightPos)) {
                            bgClass = "bg-green-500 animate-pulse";
                            textClass = "text-white";
                            borderClass = "border-green-600 shadow-lg shadow-green-200 scale-125 z-10";
                        }
                    } else if (isScanning) {
                        borderClass = "border-amber-500 ring-2 ring-amber-100 scale-110";
                    }

                    return (
                        <div key={idx} className="flex flex-col items-center transition-all duration-500">
                            <div className={`
                                w-12 h-14 border-2 rounded-xl flex items-center justify-center font-mono text-lg transition-all duration-300 relative
                                ${bgClass} ${borderClass} ${textClass}
                            `}>
                                {char}
                                {selectedApproach === 'optimal' && !finished && (
                                    <>
                                        {isLeftPos && <div className="absolute -top-6 text-blue-600 font-black text-[10px] animate-bounce">LEFT</div>}
                                        {isRightPos && <div className="absolute -top-6 text-purple-600 font-black text-[10px] animate-bounce">RIGHT</div>}
                                    </>
                                )}
                            </div>
                            <span className="mt-2 text-[10px] font-mono font-black text-slate-300">{idx}</span>
                        </div>
                    );
                })}
            </div>

            {finished && (
                 <div className="mt-12 flex flex-col items-center animate-in zoom-in duration-500">
                    <div className="bg-green-50 border border-green-200 px-6 py-3 rounded-2xl flex items-center gap-3">
                        <Check className="text-green-600" size={20} />
                        <span className="text-sm font-black text-green-700 uppercase tracking-widest">Reversal Complete</span>
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
                <TopicButton active={selectedTopic === 'problem'} onClick={() => setSelectedTopic('problem')} title="1. Problem Goal" desc="Vowels and Ordering" />
                <TopicButton active={selectedTopic === 'pointers'} onClick={() => setSelectedTopic('pointers')} title="2. Two-Pointer Swapping" desc="Symmetric Reversal" />
                <TopicButton active={selectedTopic === 'algorithm'} onClick={() => setSelectedTopic('algorithm')} title="3. The Algorithm" desc="Step-by-step logic" />
            </div>

            <div className="lg:col-span-9 bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[600px] flex flex-col">
                {selectedTopic === 'problem' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold mb-1">
                            <AlignLeft size={16}/> Understanding 345
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Reverse Vowels of a String</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Given a string <code>s</code>, reverse <strong>only</strong> all the vowels in the string and return it.
                        </p>
                        
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 space-y-4">
                            <h3 className="font-bold text-amber-800 flex items-center gap-2"><Zap size={20}/> What counts as a vowel?</h3>
                            <p className="text-amber-900">
                                The vowels are 'a', 'e', 'i', 'o', and 'u'. They can appear in both <strong>lowercase</strong> and <strong>uppercase</strong>.
                            </p>
                            <div className="flex justify-center gap-2">
                                {['a', 'E', 'i', 'O', 'u'].map((v, i) => (
                                    <div key={i} className="w-10 h-10 bg-white border border-amber-300 rounded flex items-center justify-center font-bold text-amber-600 shadow-sm">{v}</div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-700">Example Transformation:</h3>
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg">
                                <div className="text-center">
                                    <div className="text-xs text-slate-400 font-bold mb-1 uppercase">Input</div>
                                    <div className="font-mono text-xl bg-white border px-3 py-1 rounded">"IceCreAm"</div>
                                </div>
                                <ArrowRight className="text-slate-300" />
                                <div className="text-center">
                                    <div className="text-xs text-slate-400 font-bold mb-1 uppercase">Output</div>
                                    <div className="font-mono text-xl bg-amber-500 text-white border-amber-600 border px-3 py-1 rounded shadow-md">"AceCreIm"</div>
                                </div>
                            </div>
                            <p className="text-sm text-slate-500">Notice: 'I', 'e', 'e', 'A' become 'A', 'e', 'e', 'I' (reversed).</p>
                        </div>
                    </div>
                )}

                {selectedTopic === 'pointers' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">The Two-Pointer Strategy</h2>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            To reverse specific items in-place (or efficiently), we use two pointers starting from opposite ends of the array.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border p-6 rounded-xl bg-slate-50">
                                <h3 className="font-bold text-slate-700 mb-2">Left Pointer</h3>
                                <p className="text-sm text-slate-600">
                                    Moves from index <code>0</code> to the right, searching for the first vowel it encounters.
                                </p>
                            </div>
                            <div className="border p-6 rounded-xl bg-slate-50">
                                <h3 className="font-bold text-slate-700 mb-2">Right Pointer</h3>
                                <p className="text-sm text-slate-600">
                                    Moves from index <code>len - 1</code> to the left, searching for the first vowel it encounters.
                                </p>
                            </div>
                        </div>

                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                            <h3 className="font-bold text-blue-900 mb-1">Why this works</h3>
                            <p className="text-sm text-blue-800 leading-relaxed">
                                Once both pointers are "locked" on a vowel, we swap them. Because we do this from both ends simultaneously, we naturally achieve a reversed order for just those elements.
                            </p>
                        </div>
                    </div>
                )}

                {selectedTopic === 'algorithm' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">Step-by-Step Algorithm</h2>
                        <div className="space-y-4">
                            <StepItem num="1" title="Initialize" text="Convert the string to a character array and set pointers: left = 0, right = n - 1." />
                            <StepItem num="2" title="Scan Left" text="Increment left until it points to a vowel." />
                            <StepItem num="3" title="Scan Right" text="Decrement right until it points to a vowel." />
                            <StepItem num="4" title="Swap" text="If left < right, swap the characters at these positions." />
                            <StepItem num="5" title="Move Inward" text="Increment left and decrement right, then repeat until they meet." />
                        </div>

                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-8">
                            <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><BarChart3 size={18}/> Complexity Analysis</h3>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><strong>Time Complexity: O(N)</strong> - We visit each character at most once as the pointers converge.</li>
                                <li><strong>Space Complexity: O(N)</strong> - In most languages (like Java/Python/JS), strings are immutable, so we must create a char array or list to perform the swap.</li>
                            </ul>
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
                    <MessageSquare className="text-amber-500" size={20} />
                    Interview Q&A
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-bold text-slate-800 mb-1">Interviewer asks: "How do you reverse only a specific subset of characters in a string?"</p>
                        <p>Answer: "I use a symmetric two-pointer approach. By converging inward from both ends and only swapping when both pointers identify a target character (in this case, a vowel), we effectively reverse that specific subset in a single O(N) pass."</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-bold text-slate-800 mb-1">Interviewer asks: "How do you handle string immutability in languages like Java or JS?"</p>
                        <p>Answer: "Since we need to perform in-place swaps, I convert the string into a mutable character array first. This prevents the O(N²) overhead of repeated string concatenations, maintaining a linear O(N) time complexity."</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                    <Target className="text-amber-400" size={20} />
                    The "Elite" Pitch
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                    "My solution utilizes a two-pointer inward convergence algorithm. By identifying vowels at both boundaries simultaneously, I can perform a swap and advance both pointers in one cycle. This guarantees O(N) time complexity. For memory, I opted for a character array conversion to handle string immutability efficiently. I also ensured both upper and lowercase vowels are accounted for using a pre-defined constant string for O(1) character validation."
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
                        <span className="text-xs font-bold text-amber-600 block mb-1">LOOKUP EFFICIENCY</span>
                        <p className="text-xs text-slate-600">Mention that you use <code>vowels.indexOf()</code> which is fine for a small constant set of 10 chars. For a much larger set of target characters, you would use a <strong>HashSet</strong> for O(1) amortized lookups.</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-amber-100 shadow-sm">
                        <span className="text-xs font-bold text-amber-600 block mb-1">IN-PLACE VS NEW ARRAY</span>
                        <p className="text-xs text-slate-600">Explain that if the language supported mutable strings (like C++), this would be an O(1) space solution. In Java/JS, the O(N) space for the char array is the optimal lower bound.</p>
                    </div>
                </div>
            </div>

            <div className="bg-amber-600 text-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                    <Check size={20} />
                    Complexity Overview
                </h3>
                <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono">
                    <div className="bg-amber-700/50 p-3 rounded border border-amber-400">
                        <div className="font-bold text-amber-200 mb-1 uppercase tracking-widest text-[10px]">Time</div>
                        O(N)
                    </div>
                    <div className="bg-amber-700/50 p-3 rounded border border-amber-400">
                        <div className="font-bold text-amber-200 mb-1 uppercase tracking-widest text-[10px]">Space</div>
                        O(N) for Char Array
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const StepItem = ({ num, title, text }: { num: string, title: string, text: string }) => (
    <div className="flex gap-4 items-start">
        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold shrink-0 shadow-sm">{num}</div>
        <div>
            <h4 className="font-bold text-slate-800">{title}</h4>
            <p className="text-slate-500 text-sm">{text}</p>
        </div>
    </div>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|List|ArrayList|Math|char|indexOf|toCharArray|length|append|StringBuilder|found|size|get)\b|\b\d+\b)/g).filter(Boolean);

  return (
    <div className={`flex relative z-10 group min-h-[20.8px] ${active ? 'font-bold' : ''}`}>
      <span className="w-8 select-none text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-xs">{num}</span>
      <pre className={`font-mono whitespace-pre text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-orange-300">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-cyan-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'void'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean', 'char'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['List', 'ArrayList', 'Math', 'String', 'StringBuilder', 'found'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['indexOf', 'toCharArray', 'length', 'append', 'size', 'get'].includes(part)) return <span key={i} className="text-indigo-300 font-bold">{part}</span>;
          return part;
        })}
      </pre>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const TopicButton: React.FC<{ active: boolean; onClick: () => void; title: string; desc: string }> = ({ active, onClick, title, desc }) => (
  <button 
    onClick={onClick}
    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group
      ${active 
        ? 'bg-amber-50 border-amber-500 shadow-md ring-1 ring-amber-200' 
        : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-slate-50'}
    `}
  >
    <div className={`font-bold ${active ? 'text-amber-800' : 'text-slate-700 group-hover:text-amber-700'}`}>
      {title}
    </div>
    <div className={`text-xs mt-1 ${active ? 'text-amber-600' : 'text-slate-400'}`}>
      {desc}
    </div>
  </button>
);

export default ReverseVowelsVisualizer;