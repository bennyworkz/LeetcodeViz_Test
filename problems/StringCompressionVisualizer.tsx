import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, Check, Copy, AlignLeft, Zap, Trophy, MessageSquare, Target, AlertCircle, Cpu, MousePointer2, Hash, Type, ArrowRight, Save } from 'lucide-react';

const APPROACHES = {
  optimal: {
    id: 'optimal',
    title: 'Optimal Two-Pointer',
    subtitle: 'Read/Write Synchronization',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int compress(char[] chars) {
        int write = 0, read = 0;
        while (read < chars.length) {
            char currentChar = chars[read];
            int count = 0;
            while (read < chars.length && chars[read] == currentChar) {
                read++;
                count++;
            }
            chars[write++] = currentChar;
            if (count > 1) {
                for (char c : Integer.toString(count).toCharArray()) {
                    chars[write++] = c;
                }
            }
        }
        return write;
    }
}`,
    explanation: "Standard two-pointer 'in-place' algorithm. The 'read' pointer scans the array to identify groups of identical characters, while the 'write' pointer overwrites the array from the beginning with the compressed result. This satisfies the constant auxiliary space constraint."
  }
};

const StringCompressionVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'learn' | 'interview'>('visualizer');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-200">
                <Hash className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">String Compression</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">443</span>
                <span>LeetCode 75 • Medium</span>
              </div>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<BookOpen size={16}/>} label="Learn" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'visualizer' && <VisualizerMode />}
        {activeTab === 'learn' && <LearnMode />}
        {activeTab === 'interview' && <InterviewHelper />}
        
      </div>
    </div>
  );
};

const VisualizerMode = () => {
  const [selectedApproach] = useState<keyof typeof APPROACHES>('optimal');
  const [charsInput, setCharsInput] = useState("a,a,b,b,c,c,c");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const initialChars = useMemo(() => charsInput.split(',').map(c => c.trim().charAt(0) || '?'), [charsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = initialChars.length;
    let chars = [...initialChars];
    let write = 0;
    let read = 0;

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ phase, description: desc, line, state: { ...state, chars: [...chars] } });
    };

    addStep("Init", "Initialize pointers: read = 0, write = 0.", 3, { read, write });

    while (read < n) {
      const currentChar = chars[read];
      let count = 0;
      const groupStart = read;
      
      addStep("Outer Loop", `Found group starting with '${currentChar}' at read index ${read}.`, 4, { read, write, currentChar });

      while (read < n && chars[read] === currentChar) {
        read++;
        count++;
        addStep("Counting", `Scanning identical character '${currentChar}'. Count: ${count}`, 7, { read, write, currentChar, groupStart, count });
      }

      const prevWrite = write;
      chars[write++] = currentChar;
      addStep("Write Char", `Writing group character '${currentChar}' to index ${prevWrite}.`, 11, { read, write, currentChar, groupStart, count, activeWrite: prevWrite });

      if (count > 1) {
        const countStr = count.toString();
        addStep("Writing Count", `Group length is ${count}. Converting to string: "${countStr}".`, 12, { read, write, currentChar, groupStart, count });
        for (let i = 0; i < countStr.length; i++) {
          const digit = countStr[i];
          const digitWrite = write;
          chars[write++] = digit;
          addStep("Write Digit", `Writing digit '${digit}' to index ${digitWrite}.`, 14, { read, write, currentChar, groupStart, count, activeWrite: digitWrite });
        }
      }
    }

    addStep("Finish", `Compression complete. Final length (write pointer): ${write}.`, 18, { read, write, finished: true });

    return steps;
  }, [initialChars]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const currentState = trace[currentStep] || trace[0];
  const { read, write, chars, currentChar, groupStart, activeWrite, finished } = currentState.state;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      
      {/* Left Column */}
      <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                      <Zap className="text-indigo-600" size={20} />
                  </div>
                  <div>
                      <h4 className="font-black text-sm uppercase tracking-tight">Standard Algorithm</h4>
                      <p className="text-xs text-slate-500">{APPROACHES.optimal.complexity}</p>
                  </div>
              </div>
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
                {APPROACHES.optimal.code.split('\n').map((line, idx) => (
                    <CodeLineRenderer key={idx} num={idx + 1} code={line} active={currentState.line === idx + 1} />
                ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                 <Cpu size={18} />
                 <h4 className="text-sm font-black uppercase tracking-widest">Efficiency Strategy</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{APPROACHES.optimal.explanation}</p>
          </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block pl-1">Input Array (chars separated by commas)</label>
            <input value={charsInput} onChange={(e) => { setCharsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" maxLength={30} />
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
              <span className="text-[10px] font-black uppercase tracking-widest">Simulation Context</span>
            </div>
            <div className="text-lg font-black tracking-tight mb-2 uppercase">{currentState.phase}</div>
            <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-700/50">{currentState.description}</p>
        </div>

        {/* Visual Arena */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[400px] relative overflow-hidden flex flex-col justify-center items-center gap-12">
            
            {/* Pointers Info */}
            {!finished && (
                <div className="flex gap-8 animate-in slide-in-from-top-4">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-2">
                            <MousePointer2 size={14} className="text-blue-500" />
                            <span className="text-[10px] font-black text-slate-400 uppercase">Read Pointer</span>
                        </div>
                        <div className="text-xl font-mono font-black text-blue-600 bg-blue-50 px-4 py-1 rounded-lg border border-blue-200">{read}</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-2">
                            <Save size={14} className="text-rose-500" />
                            <span className="text-[10px] font-black text-slate-400 uppercase">Write Pointer</span>
                        </div>
                        <div className="text-xl font-mono font-black text-rose-600 bg-rose-50 px-4 py-1 rounded-lg border border-rose-200">{write}</div>
                    </div>
                </div>
            )}

            {/* Character Array Display */}
            <div className="flex flex-wrap justify-center gap-3 relative px-10">
                {chars.map((char, idx) => {
                    const isReadPos = read === idx;
                    const isWritePos = write === idx;
                    const isActiveWrite = activeWrite === idx;
                    const isInGroup = idx >= groupStart && idx < read;
                    const isOverwritten = idx < write;

                    let bgClass = "bg-white";
                    let borderClass = "border-slate-200";
                    let textClass = "text-slate-700 font-bold";

                    if (isActiveWrite) {
                        bgClass = "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)] scale-110 z-20";
                        textClass = "text-white";
                        borderClass = "border-rose-600";
                    } else if (isReadPos) {
                        bgClass = "bg-blue-100 border-blue-400 ring-2 ring-blue-50 shadow-md";
                        textClass = "text-blue-700 font-black";
                    } else if (isInGroup) {
                        bgClass = "bg-indigo-50 border-indigo-200";
                        textClass = "text-indigo-600";
                    } else if (isOverwritten) {
                        bgClass = "bg-slate-100 border-slate-300";
                        textClass = "text-slate-900 font-black";
                    }

                    return (
                        <div key={idx} className="flex flex-col items-center transition-all duration-300">
                            <div className={`
                                w-12 h-14 border-2 rounded-xl flex items-center justify-center font-mono text-xl transition-all duration-300 relative
                                ${bgClass} ${borderClass} ${textClass}
                            `}>
                                {char}
                                {isReadPos && !finished && (
                                    <div className="absolute -top-6 text-blue-500 font-black text-[9px] flex flex-col items-center animate-bounce">
                                        <span>READ</span>
                                        <MousePointer2 size={10} className="rotate-180" />
                                    </div>
                                )}
                                {isWritePos && !finished && !isActiveWrite && (
                                    <div className="absolute -bottom-6 text-rose-500 font-black text-[9px] flex flex-col items-center animate-bounce">
                                        <Save size={10} />
                                        <span>WRITE</span>
                                    </div>
                                )}
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
                      <span className="text-xs font-black uppercase tracking-widest text-green-700">Returned Length</span>
                      <span className="text-4xl font-black text-slate-900">{write}</span>
                  </div>
               </div>
            )}
        </div>
      </div>
    </div>
  );
};

const LearnMode = () => {
    const [selectedTopic, setSelectedTopic] = useState('rules');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-3 space-y-2">
                <TopicButton active={selectedTopic === 'rules'} onClick={() => setSelectedTopic('rules')} title="1. Rules of Compression" desc="How groups are encoded" />
                <TopicButton active={selectedTopic === 'inplace'} onClick={() => setSelectedTopic('inplace')} title="2. In-Place Concept" desc="Constant space O(1)" />
                <TopicButton active={selectedTopic === 'pointers'} onClick={() => setSelectedTopic('pointers')} title="3. Two-Pointer Dance" desc="Read vs Write" />
            </div>

            <div className="lg:col-span-9 bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[600px] flex flex-col">
                {selectedTopic === 'rules' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold mb-1">
                            <AlignLeft size={16}/> Understanding 443
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">The Compression Format</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            We encode groups of repeating characters. If a character appears only once, it remains as is. If it appears multiple times, it is followed by its frequency count.
                        </p>
                        
                        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-4">
                            <h3 className="font-bold text-indigo-800 flex items-center gap-2"><Type size={20}/> The Transformation</h3>
                            <div className="flex items-center justify-between px-4">
                                <div className="text-center">
                                    <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Source Group</div>
                                    <div className="font-mono text-xl bg-white border-2 border-indigo-200 p-3 rounded-xl flex gap-1">
                                        <span className="text-indigo-600">['a', 'a', 'a']</span>
                                    </div>
                                </div>
                                <ArrowRight className="text-indigo-300 mx-4" size={32} />
                                <div className="text-center">
                                    <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Encoded result</div>
                                    <div className="font-mono text-xl bg-indigo-600 text-white p-3 rounded-xl flex gap-1 shadow-lg">
                                        <span>['a', '3']</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm italic">
                            Wait! If the count is 12, we write '1' and '2' as separate characters in the array.
                        </div>
                    </div>
                )}

                {selectedTopic === 'inplace' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800">The "In-Place" Constraint</h2>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            The problem requires <code className="bg-slate-100 px-1 rounded font-bold">O(1)</code> extra space. You cannot create a new list or string to store the results.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 border rounded-xl bg-slate-50 border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-700 mb-2">Memory Preservation</h3>
                                <p className="text-sm text-slate-600">We must modify the input <code>char[]</code> array directly. This is possible because the compressed string is <strong>always</strong> equal to or shorter than the original string.</p>
                            </div>
                            <div className="p-6 border rounded-xl bg-indigo-50 border-indigo-100 shadow-sm">
                                <h3 className="font-bold text-indigo-800 mb-2">Why it works</h3>
                                <p className="text-sm text-indigo-700">Since we process the original data ('read') faster than we write the new data ('write'), we never overwrite data we haven't read yet.</p>
                            </div>
                        </div>
                    </div>
                )}

                {selectedTopic === 'pointers' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800 font-black tracking-tight text-indigo-900">Synchronizing Read and Write</h2>
                        <p className="text-slate-600">The Two-Pointer approach manages the two "heads" of operation:</p>
                        
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">R</div>
                                <div>
                                    <span className="font-black text-blue-700 uppercase text-xs tracking-widest">Read Pointer</span>
                                    <p className="text-sm text-blue-900 mt-1">Explores the array to find the boundaries of the next character group.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start p-4 bg-rose-50 rounded-xl border border-rose-100">
                                <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">W</div>
                                <div>
                                    <span className="font-black text-rose-700 uppercase text-xs tracking-widest">Write Pointer</span>
                                    <p className="text-sm text-rose-900 mt-1">Records the results (char + optional digits) back into the same array starting from index 0.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 p-6 rounded-2xl text-white font-mono text-xs shadow-2xl">
                             <div className="text-slate-500 mb-2">// How the write pointer advances</div>
                             <div className="text-indigo-400">chars[write++] = currentChar;</div>
                             <div className="text-indigo-400">if (count &gt; 1) &#123;</div>
                             <div className="text-slate-300">&nbsp;&nbsp;for (char c : Integer.toString(count).toCharArray()) &#123;</div>
                             <div className="text-slate-300">&nbsp;&nbsp;&nbsp;&nbsp;chars[write++] = c;</div>
                             <div className="text-slate-300">&nbsp;&nbsp;&#125;</div>
                             <div className="text-indigo-400">&#125;</div>
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
                    Technical Interview FAQ
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"Can the compressed array ever be longer than the original?"</p>
                        <p>Answer: "No, according to the group encoding rules. A group of length 1 stays length 1 ('a' &rarr; 'a'). A group of length 2 stays length 2 ('aa' &rarr; 'a2'). Any group length 10+ is compressed from 10+ characters to 1 char + log10(n) digits, which is always smaller."</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-black text-slate-800 mb-1">"How do you handle character groups that wrap around?"</p>
                        <p>Answer: "Since we identify 'currentChar' at the start of the outer loop and then drain all identical characters in an inner loop, groups are naturally processed one-by-one with zero look-back required."</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg border-l-4 border-indigo-500">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 uppercase tracking-widest text-indigo-400">
                    <Target size={20} />
                    The Elite Pitch
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                    "I implemented an O(N) single-pass two-pointer solution that achieves optimal constant auxiliary space. By decoupling the 'read' scanner from the 'write' results, I ensured that we process character groups in linear time without the need for additional data structures. My solution handles multi-digit group lengths by converting numeric counts to character arrays, adhering strictly to the in-place modification constraints while maintaining clean, readable logic."
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
                        <span className="text-[10px] font-black text-indigo-600 block mb-1 uppercase tracking-widest tracking-tighter">DATA SAFETY</span>
                        <p className="text-xs text-slate-600">Emphasize why `write` never gets ahead of `read`. This proves the algorithm is "safe" and won't overwrite data that hasn't been scanned yet.</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-indigo-100 shadow-sm">
                        <span className="text-[10px] font-black text-indigo-600 block mb-1 uppercase tracking-widest tracking-tighter">API CHOICE</span>
                        <p className="text-xs text-slate-600">In Java, converting an integer to a string is `Integer.toString(count)`. Mention that for ultra-low-level constraints, you could extract digits using `% 10` and `/ 10` and then reverse them manually.</p>
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
                        O(N) (Linear)
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
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|char|Integer|toString|toCharArray|length)\b|\b\d+\b)/g).filter(Boolean);

  return (
    <div className={`flex relative z-10 group min-h-[20.8px] ${active ? 'font-bold' : ''}`}>
      <span className="w-8 select-none text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-xs">{num}</span>
      <pre className={`font-mono whitespace-pre text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-orange-300">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-cyan-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'void', 'for', 'char'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['String', 'Integer', 'toString', 'toCharArray', 'length'].includes(part)) return <span key={i} className="text-indigo-300 font-bold">{part}</span>;
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

export default StringCompressionVisualizer;