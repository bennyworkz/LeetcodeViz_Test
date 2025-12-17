import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, MessageSquare, Hash,
  FastForward, PlusSquare, SplitSquareHorizontal, History
} from 'lucide-react';

const APPROACHES = {
  iterative: {
    id: 'iterative',
    title: 'Iterative String Building',
    subtitle: 'Optimal: O(L) Time, O(L) Space.',
    icon: <FastForward size={16} />,
    complexity: 'Time: O(L) | Space: O(L_n)',
    code: `class Solution {
    public String countAndSay(int n) {
        // Base case: the 1st term is always "1"
        String result = "1";
        
        // Iteratively generate terms from 2 up to n
        for (int i = 2; i <= n; i++) {
            StringBuilder sb = new StringBuilder();
            int count = 1;
            char c = result.charAt(0);
            
            // Scan the previous string to count adjacent identical chars
            for (int j = 1; j < result.length(); j++) {
                if (result.charAt(j) == c) {
                    count++; // Still the same character
                } else {
                    // Character changed! Append the count and the character
                    sb.append(count).append(c);
                    
                    // Reset for the new character
                    c = result.charAt(j);
                    count = 1;
                }
            }
            
            // Append the final group after the loop finishes
            sb.append(count).append(c);
            
            // Update result for the next iteration
            result = sb.toString();
        }
        
        return result;
    }
}`,
    explanation: "The 'Count and Say' sequence requires us to build the n-th term based purely on the (n-1)-th term. We start with a base case of `n=1` which evaluates to `\"1\"`. To find the next term, we use a loop to scan the current string. We maintain a `count` variable and a character `c` to track the current run of identical characters. Whenever we encounter a character that differs from `c` (or reach the end of the string), we've found the boundary of our chunk! We append the `count` followed by the character `c` to a new StringBuilder, and then reset our trackers for the newly discovered character. This chunking process perfectly translates the string into its 'count and say' representation."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">38. Count and Say</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          The <strong>count-and-say</strong> sequence is a sequence of digit strings defined by the recursive formula:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-slate-800 marker:text-violet-500 font-medium bg-slate-50 p-4 rounded-xl border border-slate-200 w-max">
            <li><code>countAndSay(1) = "1"</code></li>
            <li><code>countAndSay(n)</code> is the way you would "say" the digit string from <code>countAndSay(n-1)</code>, which is then converted into a different digit string.</li>
        </ul>

        <p className="text-base leading-relaxed mt-4">
          To determine how you "say" a digit string, split it into the <strong>minimal</strong> number of substrings such that each substring contains exactly <strong>one</strong> unique digit. Then for each substring, say the number of digits, then say the digit. Finally, concatenate every said digit.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 w-max shadow-sm font-mono text-sm text-amber-900">
            For example, the saying and conversion for digit string "3322251":<br/><br/>
            "33" -&gt; two 3's -&gt; "23"<br/>
            "222" -&gt; three 2's -&gt; "32"<br/>
            "5" -&gt; one 5 -&gt; "15"<br/>
            "1" -&gt; one 1 -&gt; "11"<br/>
            Result: "23321511"
        </div>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-emerald-500 pl-4 bg-emerald-50 py-2 mt-4">
          Given a positive integer <code>n</code>, return the <code>n<sup>th</sup></code> term of the <strong>count-and-say</strong> sequence.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> n = 1</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "1"</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: This is the base case.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> n = 4</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "1211"</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation:</p>
                 <ul className="list-disc pl-4 space-y-1 mt-1">
                     <li>countAndSay(1) = "1"</li>
                     <li>countAndSay(2) = say "1" = one 1 = "11"</li>
                     <li>countAndSay(3) = say "11" = two 1's = "21"</li>
                     <li>countAndSay(4) = say "21" = one 2 + one 1 = "12" + "11" = "1211"</li>
                 </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= n &lt;= 30</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const CountAndSayVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('iterative');
  
  const [nInput, setNInput] = useState('5');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let n = parseInt(nInput.trim(), 10);
    if (isNaN(n) || n < 1) n = 1;
    // UI Safety cap to prevent massive string freezing (n=30 generates huge strings)
    if (n > 10) n = 10;
    return { n };
  }, [nInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { n } = parsedData;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2500) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    let result = "1";
    let history = ["1"];

    addStep(
        "Initialization", 
        `Line 3: String result = "1";\n\nThe base case for n=1 is defined as "1".`, 
        3, 
        { n, result, history: [...history], i: null, sb: null, count: null, c: null, j: null, action: 'init' }
    );

    if (n === 1) {
        addStep(
            "Return Base Case", 
            `Line 24: return result;\n\nSince n=1, the loop is skipped and we return "1".`, 
            24, 
            { n, result, history: [...history], i: null, sb: null, count: null, c: null, j: null, action: 'success', isSuccess: true, ans: result }
        );
        return steps;
    }

    for (let i = 2; i <= n; i++) {
        let prev = result;
        let sb = "";
        let count = 1;
        let c = prev.charAt(0);

        addStep(
            "Start Next Term", 
            `Line 6-9: Generating term i=${i} based on term ${i-1} ("${prev}").\nInitialize StringBuilder, count=1, and char c='${c}'.`, 
            9, 
            { n, prev, result, history: [...history], i, sb, count, c, j: 1, action: 'startLoop' }
        );

        let iter = 0;
        for (let j = 1; j < prev.length; j++) {
            if (iter++ > 500) break; // safety
            
            addStep(
                "Evaluate Character", 
                `Line 12: if (result.charAt(${j}) == c)\n\nComparing character at index ${j} ('${prev.charAt(j)}') to our current tracking character ('${c}').`, 
                12, 
                { n, prev, result, history: [...history], i, sb, count, c, j, action: 'evalChar' }
            );

            if (prev.charAt(j) === c) {
                count++;
                addStep(
                    "Increment Count", 
                    `Line 13: count++;\n\nCharacters match! We increment our count to ${count}. We are still looking at the same group of '${c}'s.`, 
                    13, 
                    { n, prev, result, history: [...history], i, sb, count, c, j, action: 'increment' }
                );
            } else {
                sb += count.toString() + c;
                
                addStep(
                    "Group Finished: Append", 
                    `Line 16: sb.append(count).append(c);\n\nCharacters differ! We hit the end of a group. We append the count (${count}) and the character ('${c}') to our StringBuilder.\nStringBuilder is now "${sb}".`, 
                    16, 
                    { n, prev, result, history: [...history], i, sb, count, c, j, action: 'append' }
                );

                c = prev.charAt(j);
                count = 1;

                addStep(
                    "Reset Trackers", 
                    `Line 19-20: c = result.charAt(${j}); count = 1;\n\nWe reset our trackers for the new character '${c}'. Count is reset to 1.`, 
                    20, 
                    { n, prev, result, history: [...history], i, sb, count, c, j, action: 'reset' }
                );
            }
        }

        sb += count.toString() + c;
        result = sb;
        history.push(result);

        addStep(
            "Final Append & Store", 
            `Line 24-27: sb.append(count).append(c); result = sb.toString();\n\nLoop finished. We must append the final group (${count} of '${c}').\nStringBuilder complete: "${sb}".\nStored as result for n=${i}.`, 
            27, 
            { n, prev, result, history: [...history], i, sb, count: null, c: null, j: prev.length, action: 'finishLoop' }
        );
    }

    addStep(
        "Algorithm Complete", 
        `Line 30: return result;\n\nWe reached the target n=${n}. The final string is generated.`, 
        30, 
        { n, result, history: [...history], i: null, sb: null, count: null, c: null, j: null, action: 'success', isSuccess: true, ans: result }
    );

    if (steps.length === 0) {
        addStep("Init", "Start", 1, {});
    }

    return steps;
  }, [parsedData, selectedApproachId]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedApproach.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0] || { state: {} };
  const state = cur.state || {};
  const { isSuccess, ans, action, n, prev, result, history, i: currI, sb, count, c, j: currJ } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <MessageSquare className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Count and Say</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 38</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Strings / Iteration</span>
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
              
              {/* Left Col: Code & Context (5/12) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                
                {/* Approach Selector */}
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(APPROACHES).map((app) => {
                        const isSelected = selectedApproachId === app.id;
                        const [time, space] = app.complexity.split(' | ');
                        return (
                            <button 
                               key={app.id}
                               onClick={() => { setSelectedApproachId(app.id); setCurrentStep(0); }}
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-violet-600 border-violet-600 text-white shadow-violet-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-violet-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-violet-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-violet-100' : 'text-slate-400'}`}>
                                    <span>{time}</span>
                                    <span>{space}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Code Window */}
                <div className="bg-[#0f172a] rounded-3xl h-[460px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={14} className="text-violet-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action.includes('append') || action === 'finishLoop' ? 'bg-emerald-500/20 border-emerald-500' : (action === 'evalChar' || action === 'increment' ? 'bg-amber-500/20 border-amber-500' : 'bg-violet-500/20 border-violet-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action.includes('append') || action === 'finishLoop' ? 'emerald' : (action === 'evalChar' || action === 'increment' ? 'amber' : 'violet')} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Iteration Variables</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="Target (n)" val={n !== null && n !== undefined ? n : "-"} color="slate" active={n !== null && n !== undefined} />
                        <VariableCard label="Curr Term (i)" val={currI !== null && currI !== undefined ? currI : "-"} color="sky" active={currI !== null && currI !== undefined} />
                        <VariableCard label="Track Char (c)" val={c !== null && c !== undefined ? `'${c}'` : "-"} color="purple" active={c !== null && c !== undefined} />
                        <VariableCard label="Count" val={count !== null && count !== undefined ? count : "-"} color="amber" active={count !== null && count !== undefined} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Input Number (n)</label>
                        <input type="number" min="1" max="10" value={nInput} onChange={(e) => { setNInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-widest font-bold text-slate-700" placeholder="5" />
                        <p className="text-[9px] text-slate-400 pl-1">Max 10 for visualization (strings grow exponentially).</p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto pb-5">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-violet-100 hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action.includes('append') || action === 'finishLoop' ? 'bg-emerald-900 border-emerald-800' : (action === 'evalChar' || action === 'increment' ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : (action.includes('append') ? <PlusSquare size={100}/> : (action === 'increment' ? <Hash size={100}/> : <MessageSquare size={100}/>))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action.includes('append') || action === 'finishLoop' ? 'text-emerald-400' : (action === 'evalChar' || action === 'increment' ? 'text-amber-400' : 'text-violet-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action.includes('append') || action === 'finishLoop' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'evalChar' || action === 'increment' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'))}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-3 uppercase font-mono text-white flex items-center gap-3 relative z-10">
                      {cur.phase}
                  </div>
                  <div className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 font-mono whitespace-pre-line overflow-y-auto max-h-[140px] scrollbar-thin relative z-10">
                      {cur.description}
                  </div>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-start justify-start pt-16">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-4 pb-12 gap-10 overflow-y-auto overflow-x-hidden">
                      
                      {/* Current Iteration Zone */}
                      {!isSuccess && prev !== undefined && (
                          <div className="flex flex-col items-center w-full max-w-full gap-8">
                              
                              <div className="w-full flex justify-between items-end border-b border-slate-200 pb-2 px-2">
                                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono">Processing n = {currI}</span>
                                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono">Based on n = {currI - 1}</span>
                              </div>

                              {/* Previous String (Parsing Target) */}
                              <div className="flex flex-col items-center w-full">
                                  <span className="text-xs font-bold text-slate-500 mb-6 font-mono bg-slate-100 px-3 py-1 rounded-full">prev string</span>
                                  
                                  <div className="flex gap-1 md:gap-2 min-w-max mx-auto overflow-x-auto pb-12 px-4">
                                      {prev.split('').map((char, idx) => {
                                          let isCurrentJ = currJ === idx;
                                          // Highlight the current chunk being counted
                                          let isChunk = false;
                                          if (currJ !== null && currJ !== undefined && count !== null) {
                                              // chunk is from (j - count) to (j - 1) if evaluating a new char or appending
                                              // if j is pointing at the same char, it's from (j - count + 1) to j
                                              if (action === 'evalChar' || action === 'increment' || action === 'startLoop') {
                                                   if (idx >= currJ - count + 1 && idx <= currJ) isChunk = true;
                                                   if (action === 'evalChar' && prev.charAt(currJ) !== c) {
                                                       // Highlight only up to j-1 if evaluating a mismatch
                                                       isChunk = idx >= currJ - count && idx < currJ;
                                                   }
                                              } else if (action === 'append' || action === 'reset' || action === 'finishLoop') {
                                                   isChunk = idx >= currJ - count && idx < currJ;
                                              }
                                          }

                                          let boxClass = "relative w-10 h-12 md:w-12 md:h-14 flex items-center justify-center rounded-xl border-4 font-mono font-black text-xl transition-all duration-300 shrink-0 ";
                                          let textClass = "text-slate-700";

                                          if (isCurrentJ) {
                                              if (action === 'append' || action === 'reset') {
                                                  boxClass += "bg-white border-slate-300 opacity-50";
                                              } else {
                                                  boxClass += "bg-sky-100 border-sky-400 scale-110 shadow-lg ring-4 ring-sky-300/30 z-20";
                                                  textClass = "text-sky-900";
                                              }
                                          } else if (isChunk) {
                                              boxClass += "bg-amber-100 border-amber-400 shadow-md z-10 scale-105";
                                              textClass = "text-amber-900";
                                          } else if (idx < currJ) {
                                              boxClass += "bg-slate-100 border-slate-200 text-slate-400 opacity-40";
                                          } else {
                                              boxClass += "bg-white border-slate-200 shadow-sm";
                                          }

                                          return (
                                              <div key={`prev-${idx}`} className="flex flex-col items-center relative group">
                                                  <div className={boxClass}>
                                                      <span className={textClass}>{char}</span>
                                                  </div>
                                                  
                                                  {/* Read Pointer (Bottom) */}
                                                  <div className="absolute -bottom-10 flex flex-col items-center h-8 w-full z-30">
                                                      {isCurrentJ && (
                                                          <div className={`flex flex-col items-center animate-in slide-in-from-bottom-2`}>
                                                              <ArrowUp size={20} className="text-sky-500" strokeWidth={3}/>
                                                              <span className={`text-[10px] font-black font-mono tracking-widest px-1 py-0.5 rounded border shadow-sm mt-1 text-sky-800 bg-sky-100 border-sky-300`}>j</span>
                                                          </div>
                                                      )}
                                                  </div>
                                              </div>
                                          );
                                      })}
                                  </div>
                              </div>

                              <ArrowDown size={32} className="text-slate-300 my-2" strokeWidth={2}/>

                              {/* StringBuilder Result */}
                              <div className="flex flex-col items-center w-full">
                                  <span className="text-xs font-bold text-emerald-600 mb-4 font-mono bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shadow-sm">StringBuilder sb</span>
                                  
                                  <div className="flex items-center gap-2 font-mono font-black text-2xl h-16 px-6 bg-white border-2 border-slate-200 rounded-2xl shadow-inner min-w-[120px] max-w-full overflow-x-auto">
                                      <span className="text-slate-700 tracking-[0.2em]">{sb}</span>
                                      
                                      {/* Ghost animation for appending */}
                                      {action.includes('append') && (
                                           <span className="text-emerald-500 tracking-[0.2em] animate-in slide-in-from-top fade-in duration-500">
                                               <span className="text-amber-500">{count}</span>{c}
                                           </span>
                                      )}
                                      {action === 'finishLoop' && (
                                           <span className="text-emerald-500 tracking-[0.2em] animate-in slide-in-from-top fade-in duration-500">
                                               <span className="text-amber-500">{count}</span>{c}
                                           </span>
                                      )}
                                  </div>
                              </div>

                          </div>
                      )}

                      {/* Sequence History Box (Shown below processing zone, or main view on success) */}
                      <div className={`w-full bg-slate-900 rounded-[2rem] p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col ${isSuccess ? 'mt-0' : 'mt-8 border-t-4 border-slate-800'}`}>
                          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                              <History size={150} />
                          </div>
                          
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-6 flex items-center gap-2 relative z-10"><Layers size={14}/> Sequence History</span>
                          
                          <div className="flex flex-col gap-3 relative z-10 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                              {history && history.map((str, idx) => {
                                  let seqNum = idx + 1;
                                  let isNewlyAdded = !isSuccess && seqNum === currI && action === 'finishLoop';
                                  
                                  return (
                                      <div key={`hist-${seqNum}`} className={`flex items-start md:items-center gap-4 p-3 md:p-4 rounded-2xl border transition-all duration-500 ${isNewlyAdded ? 'bg-emerald-900/50 border-emerald-500 scale-[1.02] shadow-lg' : 'bg-slate-800 border-slate-700'}`}>
                                          <div className="bg-slate-950 text-slate-400 font-mono font-black text-xs px-3 py-1.5 rounded-lg border border-slate-700 shrink-0 w-16 text-center">
                                              n = {seqNum}
                                          </div>
                                          <div className={`font-mono text-sm md:text-base tracking-wider break-all ${isNewlyAdded ? 'text-emerald-400 font-black' : 'text-slate-300'}`}>
                                              "{str}"
                                          </div>
                                      </div>
                                  )
                              })}
                          </div>
                      </div>

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600`}>
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">SEQUENCE GENERATED</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Returned n={ans.length > 0 ? n : ''}
                              </span>
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
                <SplitSquareHorizontal className="text-violet-600"/> Run-Length Encoding
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                The "Count and Say" sequence is fundamentally a variation of <strong>Run-Length Encoding (RLE)</strong>. RLE is a basic form of data compression where runs of data (sequences of the same data value) are stored as a single data value and count.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Layers size={18}/> Chunking Logic
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            Parsing a string into contiguous chunks requires tracking two things:
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-3">
                            <p>1. The <code>char c</code> of the current chunk.</p>
                            <p>2. The <code>int count</code> of that character.</p>
                            <p>We iterate through the string. As long as the current character matches <code>c</code>, we increment <code>count</code>. The moment it differs, the chunk is complete! We output it, and instantly reset <code>c</code> and <code>count</code> for the new character.</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <AlertCircle size={18}/> The Final Append Trap
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            A very common bug in parsing algorithms is forgetting the very last chunk.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>Our loop only appends to the StringBuilder when a character <strong>changes</strong>.</p>
                            <p>But when we reach the end of the string, the loop terminates without a character change triggering the final append.</p>
                            <p>Therefore, we must always manually <code>sb.append(count).append(c)</code> one last time strictly <em>outside</em> the loop.</p>
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
                        "To generate the n-th term of the Count and Say sequence, I used an iterative string building approach based on Run-Length Encoding. I start with a base string of '1'. Then, in a loop from 2 to n, I parse the string generated in the previous step. I iterate through its characters, maintaining a running `count` and tracking the current character `c`. Whenever I hit a character that differs from `c`, it signifies the boundary of a chunk. I append the `count` and `c` to a `StringBuilder`, and reset the trackers for the new character. After the inner loop finishes, I append the final remaining chunk. I use a `StringBuilder` specifically because Java strings are immutable, and continuously concatenating strings in a loop would cause $O(K^2)$ memory allocations and significant performance degradation."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Can this be done recursively?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Yes. The recursive function signature would look like <code>String countAndSay(int n)</code>. The base case is <code>if(n==1) return "1";</code>. Otherwise, you call <code>String prev = countAndSay(n-1);</code> and run the exact same parsing logic on <code>prev</code>. However, iterative approaches are generally preferred in Java/C++ to avoid call stack overhead, even though the depth is only 30.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(L)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Where $L$ is the combined total length of all strings generated from 1 to $n$. The length of the strings grows somewhat exponentially (specifically by Conway's constant $\approx 1.303$ per step), so the time is proportional to the size of the final output.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(L_n)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We need to store the `result` string and the `StringBuilder` buffer for the current step. The space complexity is proportional to the length of the $n$-th string generated.</p>
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

const VariableCard = ({ label, val, color, active }) => {
    const bgMap = {
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        sky: 'bg-sky-50 border-sky-200 text-sky-700',
        rose: 'bg-rose-50 border-rose-200 text-rose-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        slate: 'bg-slate-100 border-slate-300 text-slate-700',
        violet: 'bg-violet-50 border-violet-200 text-violet-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700'
    };
    
    const inactiveMap = 'bg-slate-50 border-slate-200 text-slate-300';

    return (
        <div className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden h-full ${active ? bgMap[color] : inactiveMap}`}>
             <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 truncate px-1">{label}</span>
             <div className={`text-xl font-black font-mono leading-none truncate w-full text-center px-2`}>
                 {val !== null && val !== undefined ? val : '-'}
             </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|countAndSay|length|charAt|append|toString|result|sb|count|c|j|n)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
  const bgActive = `bg-${theme}-500/15`;
  const borderActive = `bg-${theme}-500`;
  const textActive = `text-${theme}-400`;

  return (
    <div className={`flex relative z-10 min-h-[16.5px] transition-colors duration-200 ${active ? bgActive : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${borderActive}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-[10px] ${active ? `${textActive} font-bold` : 'text-slate-700'}`}>{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"') || part.startsWith("'")) return <span key={i} className="text-green-300">{part}</span>;
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for', 'break', 'continue'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math', 'Arrays', 'ArrayList', 'ListNode', 'TreeNode', 'Stack', 'StringBuilder'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['countAndSay', 'length', 'charAt', 'append', 'toString'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['result', 'sb', 'count', 'c', 'j', 'n'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default CountAndSayVisualizer;