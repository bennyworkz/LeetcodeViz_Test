import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, ArrowRight, Code2, BookOpen, Activity, GitMerge, Layers, Zap, Copy, Check, Info, AlignLeft } from 'lucide-react';

const SOLUTION_CODE = `class Solution {
    public String mergeAlternately(String word1, String word2) {
        StringBuilder result = new StringBuilder();
        int i=0, j=0;
        while (i < word1.length() || j < word2.length()) {
            if(i < word1.length()) {
                result.append(word1.charAt(i++));
            }
            if(j < word2.length()) {
                result.append(word2.charAt(j++));
            }
        }
        return result.toString();
    }
}`;

const MergeStringsVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'learn'>('visualizer');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Main Header & Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <GitMerge className="text-blue-600" /> Merge Strings Alternately
            </h1>
            <p className="text-slate-500 text-sm mt-1">1768. Merge Strings Alternately</p>
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
  const [word1, setWord1] = useState("abc");
  const [word2, setWord2] = useState("pqr");
  
  // Playback State
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  // --- Logic Engine ---
  const trace = useMemo(() => {
    const steps: any[] = [];
    const w1 = word1 || "";
    const w2 = word2 || "";
    let i = 0;
    let j = 0;
    let result = "";

    // Helper to add steps
    const addStep = (phase: string, desc: string, lineNum: number, extraData: any = {}) => {
      steps.push({
        phase,
        description: desc,
        line: lineNum,
        state: { i, j, result },
        ...extraData
      });
    };

    // Step 0: Initialization
    addStep("Init", "Initialize StringBuilder and pointers i=0, j=0", 3);

    // Loop
    while (i < w1.length || j < w2.length) {
        addStep("Loop Check", `Checking: i(${i}) < ${w1.length} || j(${j}) < ${w2.length}`, 5);

        // Check i
        addStep("Check i", `Checking if i(${i}) < word1.length(${w1.length})`, 6);
        if (i < w1.length) {
            const char = w1[i];
            result += char;
            i++;
            addStep("Append Word1", `Appended '${char}' from word1. Incremented i to ${i}.`, 7, { addedFrom: 'w1', addedIndex: i-1 });
        } else {
            addStep("Skip Word1", `i (${i}) is not less than length. Skipping.`, 6);
        }

        // Check j
        addStep("Check j", `Checking if j(${j}) < word2.length(${w2.length})`, 9);
        if (j < w2.length) {
            const char = w2[j];
            result += char;
            j++;
            addStep("Append Word2", `Appended '${char}' from word2. Incremented j to ${j}.`, 10, { addedFrom: 'w2', addedIndex: j-1 });
        } else {
             addStep("Skip Word2", `j (${j}) is not less than length. Skipping.`, 9);
        }
    }

    // Final Loop Check (Fail)
    addStep("Loop Exit", `Checking: i(${i}) < ${w1.length} || j(${j}) < ${w2.length} -> False`, 5);
    
    // Return
    addStep("Return", `Returning result: "${result}"`, 13);

    return steps;
  }, [word1, word2]);

  // Handlers
  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const loadExample = (w1: string, w2: string) => {
    setWord1(w1);
    setWord2(w2);
    setCurrentStep(0);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(SOLUTION_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentState = trace[currentStep] || trace[0];
  const { i, j, result } = currentState.state || { i: 0, j: 0, result: "" };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
      {/* LEFT COLUMN: Code View */}
      <div className="flex flex-col gap-6">
          <div className="bg-[#1e1e1e] rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="bg-[#2d2d2d] px-4 py-2 text-xs font-mono text-slate-400 flex justify-between items-center border-b border-slate-700">
              <span className="flex items-center gap-2"><Code2 size={14}/> Solution.java</span>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs hover:text-white transition-colors group"
                title="Copy Code"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                <span className={copied ? "text-green-400" : ""}>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            {/* Removed overflow-x-auto to allow wrapping */}
            <div className="p-4 font-mono text-sm leading-6 relative flex-1">
                {/* Line Highlighter */}
                <div 
                  className="absolute left-0 right-0 bg-blue-500/10 border-l-2 border-blue-500 transition-all duration-300 pointer-events-none"
                  style={{ 
                    top: `${(currentState.line * 24) + 16 - 24}px`, 
                    height: '24px' 
                  }}
                />
                <CodeLine num={1} code={`class Solution {`} />
                <CodeLine num={2} code={`    public String mergeAlternately(String word1, String word2) {`} />
                <CodeLine num={3} code={`        StringBuilder result = new StringBuilder();`} active={currentState.line===3} />
                <CodeLine num={4} code={`        int i=0, j=0;`} active={currentState.line===4} />
                <CodeLine num={5} code={`        while (i < word1.length() || j < word2.length()) {`} active={currentState.line===5} />
                <CodeLine num={6} code={`            if(i < word1.length()) {`} active={currentState.line===6} />
                <CodeLine num={7} code={`                result.append(word1.charAt(i++));`} active={currentState.line===7} />
                <CodeLine num={8} code={`            }`} />
                <CodeLine num={9} code={`            if(j < word2.length()) {`} active={currentState.line===9} />
                <CodeLine num={10} code={`                result.append(word2.charAt(j++));`} active={currentState.line===10} />
                <CodeLine num={11} code={`            }`} />
                <CodeLine num={12} code={`        }`} />
                <CodeLine num={13} code={`        return result.toString();`} active={currentState.line===13} />
                <CodeLine num={14} code={`    }`} />
                <CodeLine num={15} code={`}`} />
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

      {/* RIGHT COLUMN: Visuals & Controls */}
      <div className="space-y-6">
        
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">word1</label>
              <input 
                value={word1}
                onChange={(e) => { setWord1(e.target.value); setCurrentStep(0); }}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 font-mono focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                maxLength={12}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-purple-600 uppercase tracking-wider block mb-1">word2</label>
              <input 
                value={word2}
                onChange={(e) => { setWord2(e.target.value); setCurrentStep(0); }}
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
                <button onClick={() => {setCurrentStep(0);}} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full" title="Reset">
                  <RotateCcw size={20} />
                </button>

                <div className="flex gap-3">
                    <button 
                        onClick={handlePrev}
                        disabled={currentStep === 0}
                        className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <ChevronLeft size={18} /> Prev
                    </button>
                    <button 
                        onClick={handleNext}
                        disabled={currentStep === trace.length - 1}
                        className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm shadow-blue-200"
                    >
                        Next <ChevronRight size={18} />
                    </button>
                </div>
            </div>
          </div>

          <div className="flex gap-2 text-xs justify-center pt-2 border-t border-slate-50 mt-2">
              <button onClick={() => loadExample("abc", "pqr")} className="px-3 py-1 bg-slate-50 text-slate-600 rounded border border-slate-200 hover:bg-slate-100">Example 1 (Equal)</button>
              <button onClick={() => loadExample("ab", "pqrs")} className="px-3 py-1 bg-slate-50 text-slate-600 rounded border border-slate-200 hover:bg-slate-100">Example 2 (W2 Longer)</button>
              <button onClick={() => loadExample("abcd", "pq")} className="px-3 py-1 bg-slate-50 text-slate-600 rounded border border-slate-200 hover:bg-slate-100">Example 3 (W1 Longer)</button>
          </div>
        </div>

        {/* Visual Memory Area */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8 min-h-[300px]">
           
           {/* Word 1 Visual */}
           <div className="relative pl-12">
              <span className="absolute left-0 top-3 text-xs font-bold text-blue-600 uppercase w-8 text-right">word1</span>
              <div className="flex gap-2 flex-wrap">
                 {word1.split('').map((char, idx) => (
                    <div key={idx} className="relative">
                        <div className={`
                           w-10 h-10 border-2 rounded-lg flex items-center justify-center font-mono font-bold text-lg transition-all duration-300
                           ${idx < i ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-white border-blue-200 text-slate-800'}
                           ${idx === i && currentState.line <= 6 ? 'ring-2 ring-blue-400 ring-offset-2 border-blue-500' : ''}
                        `}>
                           {char}
                        </div>
                        <div className="text-[10px] text-center text-slate-400 mt-1 font-mono">{idx}</div>
                        {/* Pointer i */}
                        {idx === i && currentState.line <= 13 && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                <span className="text-[10px] font-bold text-blue-600">i</span>
                                <div className="w-0.5 h-3 bg-blue-600"></div>
                            </div>
                        )}
                    </div>
                 ))}
                 {/* End of String Marker */}
                 <div className="w-10 h-10 border-2 border-dashed border-slate-100 rounded-lg flex items-center justify-center text-slate-300 text-xs">EOS</div>
              </div>
           </div>

           {/* Word 2 Visual */}
           <div className="relative pl-12">
              <span className="absolute left-0 top-3 text-xs font-bold text-purple-600 uppercase w-8 text-right">word2</span>
              <div className="flex gap-2 flex-wrap">
                 {word2.split('').map((char, idx) => (
                    <div key={idx} className="relative">
                        <div className={`
                           w-10 h-10 border-2 rounded-lg flex items-center justify-center font-mono font-bold text-lg transition-all duration-300
                           ${idx < j ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-white border-purple-200 text-slate-800'}
                           ${idx === j && currentState.line >= 9 && currentState.line <= 10 ? 'ring-2 ring-purple-400 ring-offset-2 border-purple-500' : ''}
                        `}>
                           {char}
                        </div>
                        <div className="text-[10px] text-center text-slate-400 mt-1 font-mono">{idx}</div>
                         {/* Pointer j */}
                         {idx === j && currentState.line <= 13 && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                <span className="text-[10px] font-bold text-purple-600">j</span>
                                <div className="w-0.5 h-3 bg-purple-600"></div>
                            </div>
                        )}
                    </div>
                 ))}
                 <div className="w-10 h-10 border-2 border-dashed border-slate-100 rounded-lg flex items-center justify-center text-slate-300 text-xs">EOS</div>
              </div>
           </div>

           {/* Result Visual */}
           <div className="relative pl-12 pt-4 border-t border-slate-100">
              <span className="absolute left-0 top-7 text-xs font-bold text-green-600 uppercase w-8 text-right">Result</span>
              <div className="flex gap-2 flex-wrap min-h-[50px]">
                 {result.split('').map((char, idx) => (
                    <div key={idx} className="animate-in zoom-in duration-300">
                        <div className={`
                           w-10 h-10 border-2 rounded-lg flex items-center justify-center font-mono font-bold text-lg bg-green-50 border-green-200 text-green-800
                        `}>
                           {char}
                        </div>
                        <div className="text-[10px] text-center text-slate-400 mt-1 font-mono">{idx}</div>
                    </div>
                 ))}
                 {result.length === 0 && <span className="text-slate-400 italic text-sm py-2">Waiting to merge...</span>}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

// --- MODE 2: THE LEARNING MODE ---
const LearnMode = () => {
  const [selectedTopic, setSelectedTopic] = useState('problem');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
      {/* Navigation Sidebar */}
      <div className="lg:col-span-3 space-y-2">
         <TopicButton active={selectedTopic === 'problem'} onClick={() => setSelectedTopic('problem')} title="1. Problem Statement" desc="The Goal & Rules" />
         <TopicButton active={selectedTopic === 'pointers'} onClick={() => setSelectedTopic('pointers')} title="2. Two Pointers" desc="The core technique" />
         <TopicButton active={selectedTopic === 'alternating'} onClick={() => setSelectedTopic('alternating')} title="3. Alternating Logic" desc="How the zip works" />
         <TopicButton active={selectedTopic === 'leftovers'} onClick={() => setSelectedTopic('leftovers')} title="4. Handling Leftovers" desc="Different lengths" />
      </div>

      {/* Content Area */}
      <div className="lg:col-span-9 bg-white rounded-xl border border-slate-200 shadow-sm p-8 min-h-[600px] flex flex-col">
         
         {selectedTopic === 'problem' && (
           <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
             <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold mb-1">
                 <AlignLeft size={16}/> Problem Statement
             </div>
             <h2 className="text-2xl font-bold text-slate-800">Merge Strings Alternately</h2>
             <p className="text-slate-600 leading-relaxed text-lg">
               You are given two strings, <code className="font-mono bg-blue-50 text-blue-700 px-1 rounded">word1</code> and <code className="font-mono bg-purple-50 text-purple-700 px-1 rounded">word2</code>. 
               Your task is to merge them by adding letters in <strong>alternating order</strong>, starting with <code>word1</code>.
             </p>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                   <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Zap size={18} className="text-amber-500"/> Scenario 1: Equal Lengths</h3>
                   <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>word1</span> <span className="font-mono">"abc"</span></div>
                      <div className="flex justify-between"><span>word2</span> <span className="font-mono">"pqr"</span></div>
                      <div className="h-px bg-slate-300 my-2"></div>
                      <div className="flex justify-between font-bold"><span>Result</span> <span className="font-mono text-green-600">"apbqcr"</span></div>
                   </div>
                   <div className="mt-4 flex justify-center gap-1">
                      <div className="w-6 h-6 bg-blue-500 text-white flex items-center justify-center text-xs rounded shadow-sm">a</div>
                      <div className="w-6 h-6 bg-purple-500 text-white flex items-center justify-center text-xs rounded shadow-sm">p</div>
                      <div className="w-6 h-6 bg-blue-500 text-white flex items-center justify-center text-xs rounded shadow-sm">b</div>
                      <div className="w-6 h-6 bg-purple-500 text-white flex items-center justify-center text-xs rounded shadow-sm">q</div>
                      <div className="w-6 h-6 bg-blue-500 text-white flex items-center justify-center text-xs rounded shadow-sm">c</div>
                      <div className="w-6 h-6 bg-purple-500 text-white flex items-center justify-center text-xs rounded shadow-sm">r</div>
                   </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                   <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Layers size={18} className="text-indigo-500"/> Scenario 2: Uneven Lengths</h3>
                   <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>word1</span> <span className="font-mono">"ab"</span></div>
                      <div className="flex justify-between"><span>word2</span> <span className="font-mono">"pqrs"</span></div>
                      <div className="h-px bg-slate-300 my-2"></div>
                      <div className="flex justify-between font-bold"><span>Result</span> <span className="font-mono text-green-600">"apbqrs"</span></div>
                   </div>
                   <div className="mt-4 flex justify-center gap-1">
                      <div className="w-6 h-6 bg-blue-500 text-white flex items-center justify-center text-xs rounded shadow-sm">a</div>
                      <div className="w-6 h-6 bg-purple-500 text-white flex items-center justify-center text-xs rounded shadow-sm">p</div>
                      <div className="w-6 h-6 bg-blue-500 text-white flex items-center justify-center text-xs rounded shadow-sm">b</div>
                      <div className="w-6 h-6 bg-purple-500 text-white flex items-center justify-center text-xs rounded shadow-sm">q</div>
                      <div className="w-6 h-6 bg-purple-500 opacity-50 text-white flex items-center justify-center text-xs rounded shadow-sm">r</div>
                      <div className="w-6 h-6 bg-purple-500 opacity-50 text-white flex items-center justify-center text-xs rounded shadow-sm">s</div>
                   </div>
                   <p className="text-xs text-center mt-2 text-slate-500">Remaining letters are just appended.</p>
                </div>
             </div>
             
             <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm text-blue-900 mt-4">
                 <Info size={20} className="shrink-0 text-blue-600"/>
                 <div>
                    <strong>Constraints:</strong> 1 ≤ word1.length, word2.length ≤ 100. <br/>
                    Both strings consist of lowercase English letters.
                 </div>
             </div>
           </div>
         )}
         
         {selectedTopic === 'pointers' && (
           <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
             <h2 className="text-2xl font-bold text-slate-800">The Two Pointer Technique</h2>
             <p className="text-slate-600 leading-relaxed">
               Instead of creating a new complex data structure, we simply use two integer variables, <code>i</code> and <code>j</code>, to keep track of our position in each string independently.
             </p>
             <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <div className="flex justify-around items-center">
                   <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">i</div>
                      <div className="text-sm text-blue-800">Tracks position in Word1</div>
                   </div>
                   <div className="text-2xl text-slate-300">+</div>
                   <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">j</div>
                      <div className="text-sm text-purple-800">Tracks position in Word2</div>
                   </div>
                </div>
             </div>
           </div>
         )}

         {selectedTopic === 'alternating' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h2 className="text-2xl font-bold text-slate-800">The "Zipper" Effect</h2>
                <p className="text-slate-600">
                    The single <code>while</code> loop acts like a zipper slider. Inside the loop, we perform two checks sequentially: one for Word 1, then one for Word 2.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="border p-4 rounded-lg bg-slate-50">
                        <h3 className="font-bold text-slate-700 mb-2">Step A</h3>
                        <code className="text-sm bg-white p-1 rounded border">result.append(word1[i++])</code>
                        <p className="text-xs text-slate-500 mt-2">Take from left, move left pointer.</p>
                    </div>
                    <div className="border p-4 rounded-lg bg-slate-50">
                        <h3 className="font-bold text-slate-700 mb-2">Step B</h3>
                        <code className="text-sm bg-white p-1 rounded border">result.append(word2[j++])</code>
                        <p className="text-xs text-slate-500 mt-2">Take from right, move right pointer.</p>
                    </div>
                </div>
            </div>
         )}

        {selectedTopic === 'leftovers' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h2 className="text-2xl font-bold text-slate-800">Handling Uneven Lengths</h2>
                <p className="text-slate-600">
                    The condition <code>i &lt; word1.length()</code> protects us. If <code>word1</code> runs out, <code>i</code> stops incrementing, and that `if` block is simply skipped. The loop continues running solely for <code>word2</code> until it also finishes.
                </p>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-amber-900">
                    <strong>Why use one loop?</strong> We could have used three loops (one for both, one for leftovers of w1, one for leftovers of w2), but checking inside a single loop is cleaner and more concise code.
                </div>
            </div>
         )}

      </div>
    </div>
  );
};

const CodeLine: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  // Simple syntax highlighting regex. 
  // Using non-capturing groups (?:) inside the split regex to prevent the delimiter from being included in the result array twice (once as match, once as capture group).
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|StringBuilder)\b|\b\d+\b)/g).filter(Boolean);

  return (
    <div className={`flex relative z-10 group ${active ? 'bg-blue-900/30 font-bold' : ''}`}>
      <span className="w-8 select-none text-right pr-3 text-slate-600 border-r border-slate-700 mr-3 shrink-0">{num}</span>
      <pre className="font-mono whitespace-pre-wrap break-all text-slate-300">
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-green-600 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-orange-300">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-emerald-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'void'].includes(part)) return <span key={i} className="text-pink-400">{part}</span>;
          if (['int', 'boolean'].includes(part)) return <span key={i} className="text-blue-400">{part}</span>;
          if (['String', 'StringBuilder'].includes(part)) return <span key={i} className="text-yellow-300">{part}</span>;
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

export default MergeStringsVisualizer;