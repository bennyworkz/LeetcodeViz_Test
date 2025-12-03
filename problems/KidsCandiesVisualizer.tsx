import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, User, Crown, Check, X, Code2, BarChart3, Info, Copy, Zap, AlignLeft, Lightbulb } from 'lucide-react';

const SOLUTION_CODE = `class Solution {
    public List<Boolean> kidsWithCandies(int[] candies, int extraCandies) {
        int maxCandies = 0;
        for (int candy : candies) {
            maxCandies = Math.max(candy, maxCandies);
        }

        List<Boolean> result = new ArrayList<>();
        for (int candy : candies) {
            result.add(candy + extraCandies >= maxCandies);
        }

        return result;
    }
}`;

const KidsCandiesVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'learn'>('visualizer');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <User className="text-pink-500" /> Kids With Greatest Candies
            </h1>
            <p className="text-slate-500 text-sm mt-1">1431. Kids With the Greatest Number of Candies</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('visualizer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'visualizer' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Activity size={16} /> Visualizer
            </button>
            <button 
              onClick={() => setActiveTab('learn')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'learn' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <BookOpen size={16} /> Learn & Understand
            </button>
          </div>
        </div>

        {activeTab === 'visualizer' ? <VisualizerMode /> : <LearnMode />}
        
      </div>
    </div>
  );
};

const VisualizerMode = () => {
  // Inputs
  const [candiesInput, setCandiesInput] = useState("2,3,5,1,3");
  const [extraCandies, setExtraCandies] = useState(3);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  // Parse input
  const candies = useMemo(() => {
    return candiesInput.split(',').map(n => parseInt(n.trim()) || 0);
  }, [candiesInput]);

  // Logic Engine
  const trace = useMemo(() => {
    const steps: any[] = [];
    let max = 0;
    const resultList: boolean[] = [];

    // Helper
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ phase, description: desc, line, state: JSON.parse(JSON.stringify(state)) });
    };

    // Initial State
    addStep("Init", "Start solution. Initialize maxCandies = 0.", 3, { max, currentIdx: -1, result: [], checkingIdx: -1 });

    // Phase 1: Find Max
    for (let i = 0; i < candies.length; i++) {
        addStep("Find Max", `Checking kid ${i} with ${candies[i]} candies. Current max is ${max}.`, 4, { max, currentIdx: i, result: [], checkingIdx: -1 });
        
        if (candies[i] > max) {
            max = candies[i];
            addStep("Update Max", `New max found! Kid ${i} has ${max} candies.`, 5, { max, currentIdx: i, result: [], checkingIdx: -1 });
        }
    }

    // Phase 2: Build Result
    addStep("Init Result", "Found max. Initializing result list.", 8, { max, currentIdx: -1, result: [], checkingIdx: -1 });

    for (let i = 0; i < candies.length; i++) {
        const total = candies[i] + extraCandies;
        const isGreatest = total >= max;
        resultList.push(isGreatest);
        
        addStep(
            "Check Kid", 
            `Kid ${i}: ${candies[i]} + ${extraCandies} = ${total}. Is ${total} >= ${max}? ${isGreatest}`, 
            10, 
            { max, currentIdx: -1, result: [...resultList], checkingIdx: i, compareVal: total }
        );
    }

    addStep("Return", `Return final result: [${resultList.join(', ')}]`, 13, { max, currentIdx: -1, result: resultList, checkingIdx: -1 });

    return steps;
  }, [candies, extraCandies]);

  // Handlers
  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const loadExample = (arr: string, extra: number) => {
      setCandiesInput(arr);
      setExtraCandies(extra);
      setCurrentStep(0);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(SOLUTION_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentState = trace[currentStep] || trace[0];
  const { max, currentIdx, result, checkingIdx } = currentState.state;
  const maxVal = Math.max(...candies, 1);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-in fade-in duration-500">
      
      {/* Left: Code & Status */}
      <div className="flex flex-col gap-6">
         <div className="bg-[#1e1e1e] rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-full min-h-[400px]">
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
            <div className="p-4 font-mono text-sm leading-6 relative flex-1">
               {/* Line Highlighter */}
               <div 
                  className="absolute left-0 right-0 bg-pink-500/20 border-l-2 border-pink-500 transition-all duration-300 pointer-events-none"
                  style={{ top: `${(currentState.line * 24) + 16 - 24}px`, height: '24px' }}
               />
               <CodeLine num={1} code={`class Solution {`} />
               <CodeLine num={2} code={`  public List<Boolean> kidsWithCandies(int[] candies, int extraCandies) {`} />
               <CodeLine num={3} code={`    int maxCandies = 0;`} active={currentState.line===3} />
               <CodeLine num={4} code={`    for(int candy : candies) {`} active={currentState.line===4} />
               <CodeLine num={5} code={`      maxCandies = Math.max(candy, maxCandies);`} active={currentState.line===5} />
               <CodeLine num={6} code={`    }`} />
               <CodeLine num={7} code={``} />
               <CodeLine num={8} code={`    List<Boolean> result = new ArrayList<>();`} active={currentState.line===8} />
               <CodeLine num={9} code={`    for (int candy : candies) {`} active={currentState.line===9} />
               <CodeLine num={10} code={`      result.add(candy + extraCandies >= maxCandies);`} active={currentState.line===10} />
               <CodeLine num={11} code={`    }`} />
               <CodeLine num={12} code={``} />
               <CodeLine num={13} code={`    return result;`} active={currentState.line===13} />
               <CodeLine num={14} code={`  }`} />
               <CodeLine num={15} code={`}`} />
            </div>
         </div>

         <div className="bg-slate-800 text-slate-200 rounded-xl p-6 shadow-lg border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Current Phase</div>
              <div className="bg-pink-600 text-white text-[10px] px-2 py-0.5 rounded-full">{currentState.phase}</div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed border-t border-slate-600 pt-2">
              {currentState.description}
            </p>
        </div>
      </div>

      {/* Right: Visualization */}
      <div className="space-y-6">
        
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
           <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Candies Array</label>
                 <input 
                    value={candiesInput}
                    onChange={(e) => { setCandiesInput(e.target.value); setCurrentStep(0); }}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 font-mono focus:ring-2 focus:ring-pink-500 outline-none"
                 />
              </div>
              <div>
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Extra</label>
                 <input 
                    type="number"
                    value={extraCandies}
                    onChange={(e) => { setExtraCandies(parseInt(e.target.value)||0); setCurrentStep(0); }}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 font-mono focus:ring-2 focus:ring-pink-500 outline-none"
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
                        className="h-full bg-pink-500 transition-all duration-300 ease-out"
                        style={{ width: `${(currentStep / (Math.max(1, trace.length - 1))) * 100}%` }}
                    />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button onClick={() => setCurrentStep(0)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full"><RotateCcw size={20}/></button>
                <div className="flex gap-3">
                    <button 
                        onClick={handlePrev} 
                        disabled={currentStep===0} 
                        className="px-4 py-2 bg-slate-100 rounded-lg font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <ChevronLeft size={18} /> Prev
                    </button>
                    <button 
                        onClick={handleNext} 
                        disabled={currentStep===trace.length-1} 
                        className="px-6 py-2 bg-pink-600 rounded-lg font-medium text-white hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm shadow-pink-200"
                    >
                        Next <ChevronRight size={18} />
                    </button>
                </div>
              </div>
           </div>
           <div className="flex gap-2 text-xs justify-center pt-2 border-t border-slate-50 mt-2">
              <button onClick={() => loadExample("2,3,5,1,3", 3)} className="px-3 py-1 bg-slate-50 text-slate-600 rounded border border-slate-200 hover:bg-slate-100">Ex 1</button>
              <button onClick={() => loadExample("4,2,1,1,2", 1)} className="px-3 py-1 bg-slate-50 text-slate-600 rounded border border-slate-200 hover:bg-slate-100">Ex 2</button>
              <button onClick={() => loadExample("12,1,12", 10)} className="px-3 py-1 bg-slate-50 text-slate-600 rounded border border-slate-200 hover:bg-slate-100">Ex 3</button>
           </div>
        </div>

        {/* Visual Arena */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 min-h-[350px] relative flex items-end justify-center gap-4 md:gap-8 overflow-hidden">
            {/* Max Line */}
            {max > 0 && (
                <div 
                    className="absolute left-8 right-8 border-t-2 border-dashed border-slate-400 z-10 transition-all duration-500 flex items-end justify-end"
                    style={{ bottom: `${(max / (maxVal + extraCandies)) * 100}%` }}
                >
                    <span className="bg-slate-400 text-white text-[10px] px-1 rounded -mb-3 mr-2 shadow-sm flex items-center gap-1">
                        <Crown size={10} /> Max: {max}
                    </span>
                </div>
            )}
            
            {/* The Kids */}
            {candies.map((candy, idx) => {
                const isScanning = currentIdx === idx; // Phase 1
                const isChecking = checkingIdx === idx; // Phase 2
                const isResultTrue = result[idx] === true;
                const isResultFalse = result[idx] === false;
                
                // Calculate height percentages for chart
                const barHeight = (candy / (maxVal + extraCandies)) * 100;
                const extraHeightPercent = (extraCandies / (maxVal + extraCandies)) * 100;
                
                return (
                    <div key={idx} className="flex flex-col items-center justify-end h-64 w-12 gap-2 relative group transition-all duration-300">
                        
                        {/* Status Icons */}
                        <div className="h-6 flex items-end">
                            {isScanning && <div className="text-[10px] bg-slate-100 px-1 py-0.5 rounded text-slate-600 animate-bounce">Scan</div>}
                            {isResultTrue && <Check size={20} className="text-green-500 animate-in zoom-in" />}
                            {isResultFalse && <X size={20} className="text-red-500 animate-in zoom-in" />}
                        </div>

                        {/* Bar Container */}
                        <div className="w-full relative flex flex-col justify-end flex-1">
                            {/* Extra Candies Stack (Ghost) */}
                            {isChecking && (
                                <div 
                                    className="w-full bg-pink-200/80 border-x border-t border-pink-300 rounded-t-sm absolute bottom-0 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
                                    style={{ height: `${barHeight + extraHeightPercent}%` }}
                                >
                                    <div className="w-full text-center text-[10px] text-pink-700 font-bold -mt-5">+{extraCandies}</div>
                                </div>
                            )}

                            {/* Base Candies Stack */}
                            <div 
                                className={`w-full rounded-t-sm relative flex items-end justify-center transition-all duration-300 z-10
                                ${isScanning ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-slate-300'}
                                ${isChecking ? 'bg-pink-500 shadow-lg shadow-pink-200' : ''}
                                ${candy === max && currentStep > 3 ? 'bg-amber-400' : ''} 
                                `}
                                style={{ height: `${barHeight}%` }}
                            >
                                <span className={`mb-1 text-[10px] font-bold ${isChecking || isScanning ? 'text-white' : 'text-slate-500'}`}>{candy}</span>
                            </div>
                        </div>

                        {/* Kid Icon */}
                        <div className="flex flex-col items-center">
                           <User size={16} className={`${isChecking ? 'text-pink-500' : 'text-slate-300'}`} />
                           <div className="text-[10px] text-slate-400 font-mono">#{idx}</div>
                        </div>

                    </div>
                )
            })}
        </div>
      </div>
    </div>
  );
};

// --- MODE 2: LEARN MODE ---
const LearnMode = () => {
    const [selectedTopic, setSelectedTopic] = useState('problem');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            {/* Sidebar */}
            <div className="lg:col-span-3 space-y-2">
                <TopicButton active={selectedTopic === 'problem'} onClick={() => setSelectedTopic('problem')} title="1. Problem Statement" desc="Goal & Rules" />
                <TopicButton active={selectedTopic === 'logic'} onClick={() => setSelectedTopic('logic')} title="2. The Approach" desc="Greedy Logic" />
                <TopicButton active={selectedTopic === 'complexity'} onClick={() => setSelectedTopic('complexity')} title="3. Complexity" desc="Time & Space" />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9 bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[600px] flex flex-col">
                
                {selectedTopic === 'problem' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold mb-1">
                            <AlignLeft size={16}/> Problem Statement
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-3">Kids With the Greatest Number of Candies</h2>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            You are given an array <code className="bg-slate-100 px-1 rounded font-bold font-mono">candies</code> where <code className="font-mono">candies[i]</code> represents the number of candies the <em>i-th</em> kid has, and an integer <code className="bg-pink-50 text-pink-600 px-1 rounded font-bold font-mono">extraCandies</code>.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            Return a boolean array <code className="font-mono">result</code> of length <code className="font-mono">n</code>, where <code className="font-mono">result[i]</code> is <code className="font-bold text-green-600">true</code> if, after giving the <em>i-th</em> kid all the <code className="font-mono">extraCandies</code>, they will have the <strong>greatest</strong> number of candies among all the kids, or <code className="font-bold text-red-500">false</code> otherwise.
                        </p>

                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
                            <h3 className="font-bold text-blue-900 mb-1 flex items-center gap-2"><Info size={16}/> Note</h3>
                            <p className="text-blue-800 text-sm">
                                Note that multiple kids can have the greatest number of candies. It's not a competition where only one wins!
                            </p>
                        </div>
                    </div>
                )}

                {selectedTopic === 'logic' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                         <h2 className="text-2xl font-bold text-slate-800 mb-3">The Logic: Greedy Strategy</h2>
                         <p className="text-slate-600 leading-relaxed">
                            To determine if a kid <em>can</em> be the greatest, we first need a benchmark. What is the target to beat?
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Crown size={18} className="text-amber-500"/> Step 1: Find Max</h3>
                                <p className="text-sm text-slate-600 mb-2">
                                    We iterate through the array once to find the current maximum number of candies anyone holds.
                                </p>
                                <div className="text-center bg-white p-2 rounded font-mono text-sm border border-slate-200">
                                    Max = 5
                                </div>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Check size={18} className="text-green-500"/> Step 2: Comparison</h3>
                                <p className="text-sm text-slate-600 mb-2">
                                    For each kid, we simply check:
                                </p>
                                <div className="text-center bg-white p-2 rounded font-mono text-sm border border-slate-200 font-bold text-slate-700">
                                    kidCandies + extra {`>=`} Max
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-yellow-50 text-yellow-900 rounded-lg border border-yellow-200 mt-4">
                            <h4 className="font-bold flex items-center gap-2 mb-1"><Lightbulb size={16}/> Why is this efficient?</h4>
                            <p className="text-sm">
                                Without pre-calculating the Max, we would have to compare every kid against every other kid (Nested Loops), which is <strong>O(N²)</strong>. By finding Max first, we reduce it to <strong>O(N)</strong>.
                            </p>
                        </div>
                    </div>
                )}

                {selectedTopic === 'complexity' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-slate-800 mb-3">Complexity Analysis</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border p-6 rounded-xl bg-white shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <Activity className="text-blue-500"/> Time Complexity
                                </h3>
                                <div className="text-4xl font-mono font-bold text-slate-700 mb-2">O(N)</div>
                                <p className="text-slate-500 text-sm">
                                    We traverse the list of candies exactly twice. 
                                    <br/>1. Once to find the Max.
                                    <br/>2. Once to generate the result array.
                                    <br/>2N simplifies to O(N).
                                </p>
                            </div>

                            <div className="border p-6 rounded-xl bg-white shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <BarChart3 className="text-purple-500"/> Space Complexity
                                </h3>
                                <div className="text-4xl font-mono font-bold text-slate-700 mb-2">O(1)</div>
                                <p className="text-slate-500 text-sm">
                                    Ignoring the output array (which is required by the problem), we only use a single variable integer <code>maxCandies</code> for storage.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

const CodeLine: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  // Advanced syntax highlighting regex
  // Uses non-capturing groups (?:) to prevent split from returning delimiters as duplicate tokens
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|List|ArrayList|Math)\b|\b\d+\b)/g).filter(Boolean);

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
          if (['List', 'ArrayList', 'Math', 'String'].includes(part)) return <span key={i} className="text-yellow-300">{part}</span>;
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

export default KidsCandiesVisualizer;