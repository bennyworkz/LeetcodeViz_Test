import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ListOrdered, ArrowRight, Hash, XSquare, Blocks, 
  CheckSquare, Shuffle, Info, RotateCcw, Timer, Binary, Network, GitFork
} from 'lucide-react';

const APPROACHES = {
  dp: {
    id: 'dp',
    title: 'Dynamic Programming',
    subtitle: 'Optimal: O(N^2) Time, O(N) Space.',
    icon: <Blocks size={16} />,
    complexity: 'Time: O(N^2) | Space: O(N)', 
    code: `class Solution {
    public int numTrees(int n) {
        // G[i] = number of unique BSTs for a sequence of length i
        int[] G = new int[n + 1];
        
        // Base cases
        G[0] = 1; // Empty tree is 1 combination
        G[1] = 1; // 1 node is 1 combination
        
        // Build solutions for i nodes (from 2 to n)
        for (int i = 2; i <= n; i++) {
            // Pick each j as the root (from 1 to i)
            for (int j = 1; j <= i; j++) {
                // Left subtree has j-1 nodes
                // Right subtree has i-j nodes
                G[i] += G[j - 1] * G[i - j];
            }
        }
        
        return G[n];
    }
}`,
    explanation: "This problem can be solved using Dynamic Programming (which calculates Catalan numbers). If we pick `j` as the root of a tree with `i` nodes, the left subtree will be built from `1` to `j-1` (which is `j-1` nodes), and the right subtree will be built from `j+1` to `i` (which is `i-j` nodes). The total unique BSTs with root `j` is the product of unique left subtrees and right subtrees: `G[j-1] * G[i-j]`."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">96. Unique Binary Search Trees</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given an integer <code>n</code>, return <em>the number of structurally unique <strong>BST's</strong> (binary search trees) which has exactly </em><code>n</code><em> nodes of unique values from </em><code>1</code><em> to </em><code>n</code>.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              <p><span className="text-slate-400 font-bold">Input:</span> n = 3</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 5</p>
              <p className="text-slate-500 leading-relaxed">
                <span className="text-slate-400 font-bold">Explanation:</span>{"\n"}
                The 5 unique BSTs for n = 3 are:
              </p>
              <pre className="text-xs bg-white p-4 rounded-xl border border-slate-200">
{`   1         3     3      2      1
    \\       /     /      / \\      \\
     3     2     1      1   3      2
    /     /       \\                 \\
   2     1         2                 3`}
              </pre>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> n = 1</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 1</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= n &lt;= 19</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const UniqueBSTVisualizeri = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('dp');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const [nInput, setNInput] = useState('4');

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let n = parseInt(nInput);
    if (isNaN(n) || n < 1) n = 1;
    // Cap at 5 for UI visualizer performance and real estate
    if (n > 5) n = 5;
    return { n };
  }, [nInput]);

  const trace = useMemo(() => {
    const steps = [];
    let { n } = parsedData;
    let G = new Array(n + 1).fill(0);

    // Init
    G[0] = 1;
    if (n >= 1) G[1] = 1;
    
    steps.push({
        phase: 'Initialization',
        description: `Base Cases:\nG[0] = 1 (Empty tree has 1 combination)\nG[1] = 1 (Tree with 1 node has 1 combination)`,
        line: 6,
        state: { G: [...G], i: null, j: null, leftIdx: null, rightIdx: null, action: 'init' }
    });

    for (let i = 2; i <= n; i++) {
        steps.push({
            phase: `Outer Loop (i = ${i})`,
            description: `Calculating G[${i}]: Number of unique BSTs with ${i} nodes.\n\nWe will pick each node from 1 to ${i} as the root, and sum the possibilities.`,
            line: 10,
            state: { G: [...G], i, j: null, leftIdx: null, rightIdx: null, action: 'outer' }
        });

        for (let j = 1; j <= i; j++) {
            let leftIdx = j - 1;
            let rightIdx = i - j;
            let leftVal = G[leftIdx];
            let rightVal = G[rightIdx];

            steps.push({
                phase: `Inner Loop (Root j = ${j})`,
                description: `Choosing node ${j} as the root.\nLeft subtree nodes: 1 to ${j-1} (Size: ${leftIdx})\nRight subtree nodes: ${j+1} to ${i} (Size: ${rightIdx})\n\nFetching subproblem solutions:\nLeft combinations: G[${leftIdx}] = ${leftVal}\nRight combinations: G[${rightIdx}] = ${rightVal}`,
                line: 15,
                state: { G: [...G], i, j, leftIdx, rightIdx, leftVal, rightVal, action: 'eval' }
            });

            let product = leftVal * rightVal;
            G[i] += product;

            steps.push({
                phase: `Accumulate G[${i}]`,
                description: `Combinations with root ${j} = ${leftVal} * ${rightVal} = ${product}.\n\nAdding to total: G[${i}] += ${product}\nCurrent G[${i}] = ${G[i]}`,
                line: 15,
                state: { G: [...G], i, j, leftIdx, rightIdx, leftVal, rightVal, product, action: 'add' }
            });
        }
    }

    steps.push({
        phase: 'Algorithm Complete',
        description: `Successfully calculated unique BSTs for n = ${n}.\nResult is G[${n}] = ${G[n]}.`,
        line: 19,
        state: { G: [...G], i: null, j: null, leftIdx: null, rightIdx: null, action: 'complete', isSuccess: true }
    });

    return steps;
  }, [parsedData]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedApproach.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0] || { state: {} };
  const s = cur.state || {};
  const n = parsedData.n;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-100 flex items-center justify-center">
                <Network className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Unique BSTs</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 96</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Dynamic Programming / Trees</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto">
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
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
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
                      <Code2 size={14} className="text-emerald-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${s.isSuccess || s.action === 'init' ? 'bg-emerald-500/20 border-emerald-500' : (s.action === 'eval' ? 'bg-sky-500/20 border-sky-500' : (s.action === 'add' ? 'bg-amber-500/20 border-amber-500' : 'bg-emerald-500/20 border-emerald-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={s.isSuccess || s.action === 'init' ? 'emerald' : (s.action === 'eval' ? 'sky' : (s.action === 'add' ? 'amber' : 'emerald'))} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Iteration Variables</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="Nodes (i)" val={s.i !== null && s.i !== undefined ? s.i : "-"} color="purple" active={s.i !== null && s.i !== undefined} />
                        <VariableCard label="Root (j)" val={s.j !== null && s.j !== undefined ? s.j : "-"} color="indigo" active={s.j !== null && s.j !== undefined} />
                        <VariableCard label="Left (G[j-1])" val={s.leftVal !== null && s.leftVal !== undefined ? s.leftVal : "-"} color="sky" active={s.leftVal !== null && s.leftVal !== undefined} />
                        <VariableCard label="Right (G[i-j])" val={s.rightVal !== null && s.rightVal !== undefined ? s.rightVal : "-"} color="amber" active={s.rightVal !== null && s.rightVal !== undefined} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-end shrink-0">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-emerald-600 uppercase block pl-1 tracking-widest font-mono">Total Nodes (N)</label>
                        <input type="number" min="1" max="5" value={nInput} onChange={(e) => { setNInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-sm shadow-inner tracking-widest font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="4" />
                        <p className="text-[9px] text-slate-400 pl-1 font-mono">Range: 1 to 5 (for visualization)</p>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto pb-5">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 sm:flex-none sm:w-16 px-4 py-2.5 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] sm:flex-none sm:w-28 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-md shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-1">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group shrink-0 ${s.isSuccess || s.action === 'init' ? 'bg-emerald-900 border-emerald-800' : (s.action === 'eval' ? 'bg-sky-900 border-sky-800' : (s.action === 'add' ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {s.isSuccess || s.action === 'init' ? <Check size={100}/> : (s.action === 'eval' ? <RotateCcw size={100}/> : (s.action === 'add' ? <CheckSquare size={100}/> : <Activity size={100}/>))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={s.isSuccess || s.action === 'init' ? "text-emerald-400" : (s.action === 'eval' ? 'text-sky-400' : (s.action === 'add' ? 'text-amber-400' : 'text-slate-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${s.isSuccess || s.action === 'init' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (s.action === 'eval' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : (s.action === 'add' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'))}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-3 uppercase font-mono text-white flex items-center gap-3 relative z-10">
                      {cur.phase}
                  </div>
                  <div className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 font-mono whitespace-pre-line overflow-y-auto max-h-[100px] scrollbar-thin relative z-10">
                      {cur.description}
                  </div>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner items-center justify-start pt-8 min-h-[460px]">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 gap-8 overflow-y-auto overflow-x-auto">
                      
                      {/* DP Array (G) */}
                      <div className="w-full flex flex-col items-center">
                          <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest font-mono mb-4 flex items-center justify-center gap-2"><Target size={14}/> DP Array: G (Combinations)</span>
                          
                          <div className="flex gap-2 items-center justify-center pt-2">
                              {s.G && s.G.map((val, index) => {
                                  const isCurrentI = s.i === index && s.action !== 'init';
                                  const isLeftLookup = (s.action === 'eval' || s.action === 'add') && s.leftIdx === index;
                                  const isRightLookup = (s.action === 'eval' || s.action === 'add') && s.rightIdx === index;
                                  
                                  let boxClass = "relative flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 w-16 h-20 ";
                                  let valClass = "font-mono font-black text-2xl ";
                                  let idxClass = "absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-100 px-2 py-0.5 rounded text-[9px] font-bold text-slate-500 border border-slate-200 font-mono";

                                  if (isCurrentI) {
                                      boxClass += s.action === 'add' ? "bg-amber-100 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-110 z-20" : "bg-purple-50 border-purple-400 ring-2 ring-purple-100 scale-105 z-10";
                                      valClass += s.action === 'add' ? "text-amber-700" : "text-purple-700";
                                      idxClass = "absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-100 px-2 py-0.5 rounded text-[9px] font-bold text-purple-700 border border-purple-300 font-mono";
                                  } else if (isLeftLookup) {
                                      boxClass += "bg-sky-50 border-sky-400 scale-110 z-20 shadow-md";
                                      valClass += "text-sky-600";
                                      idxClass = "absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-100 px-2 py-0.5 rounded text-[9px] font-bold text-sky-700 border border-sky-300 font-mono";
                                  } else if (isRightLookup) {
                                      boxClass += "bg-rose-50 border-rose-400 scale-110 z-20 shadow-md";
                                      valClass += "text-rose-600";
                                      idxClass = "absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-100 px-2 py-0.5 rounded text-[9px] font-bold text-rose-700 border border-rose-300 font-mono";
                                  } else if (val > 0 || (index === 0 && val === 1)) {
                                      boxClass += "bg-emerald-50 border-emerald-300 text-emerald-700";
                                      valClass += "text-emerald-700";
                                  } else {
                                      boxClass += "bg-slate-50 border-slate-200 text-slate-400 border-dashed";
                                      valClass += "text-slate-400";
                                  }

                                  return (
                                      <div key={`G-${index}`} className="flex flex-col items-center relative mt-3">
                                          <div className={boxClass}>
                                              <span className={idxClass}>G[{index}]</span>
                                              <span className={valClass}>{val}</span>
                                          </div>
                                          
                                          {isLeftLookup && (
                                              <div className="absolute -bottom-6 whitespace-nowrap text-sky-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><ArrowRight size={10} className="rotate-[-90deg]"/> Left</div>
                                          )}
                                          {isRightLookup && (
                                              <div className="absolute -bottom-6 whitespace-nowrap text-rose-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><ArrowRight size={10} className="rotate-[-90deg]"/> Right</div>
                                          )}
                                      </div>
                                  );
                              })}
                          </div>
                      </div>

                      {/* Symbolic Tree Visualizer */}
                      {s.j !== null && s.j !== undefined && (
                         <div className="w-full mt-auto border-t border-slate-100 pt-8 flex flex-col items-center animate-in slide-in-from-bottom-4 fade-in duration-300">
                             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-4 flex items-center justify-center gap-2">
                                <GitFork size={14}/> Current Subtree Shape
                             </span>

                             <div className="flex flex-col items-center">
                                 {/* Root Node */}
                                 <div className="w-14 h-14 bg-indigo-100 border-2 border-indigo-500 rounded-full flex flex-col items-center justify-center relative z-20 shadow-lg">
                                     <span className="text-[8px] font-bold text-indigo-500 uppercase">Root</span>
                                     <span className="font-mono font-black text-indigo-900 text-lg">{s.j}</span>
                                 </div>
                                 
                                 <div className="flex gap-16 relative -mt-4 z-10">
                                     {/* Left Branch */}
                                     <div className="flex flex-col items-center">
                                        <svg className="w-16 h-12 text-slate-300 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                            <path d="M 100 0 C 100 50, 0 50, 0 100" fill="transparent" stroke="currentColor" strokeWidth="4"/>
                                        </svg>
                                        <div className={`w-20 h-16 rounded-2xl flex flex-col items-center justify-center border-2 shadow-sm ${s.leftIdx > 0 ? 'bg-sky-50 border-sky-400' : 'bg-slate-50 border-slate-200 border-dashed'}`}>
                                            <span className="text-[9px] font-bold text-slate-500 mb-1">Left Nodes</span>
                                            <span className={`font-mono font-black text-xl ${s.leftIdx > 0 ? 'text-sky-700' : 'text-slate-400'}`}>{s.leftIdx}</span>
                                            <span className={`text-[8px] font-bold mt-1 ${s.leftIdx > 0 ? 'text-sky-500' : 'text-slate-400'}`}>G[{s.leftIdx}] = {s.leftVal}</span>
                                        </div>
                                     </div>

                                     {/* Right Branch */}
                                     <div className="flex flex-col items-center">
                                        <svg className="w-16 h-12 text-slate-300 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                            <path d="M 0 0 C 0 50, 100 50, 100 100" fill="transparent" stroke="currentColor" strokeWidth="4"/>
                                        </svg>
                                        <div className={`w-20 h-16 rounded-2xl flex flex-col items-center justify-center border-2 shadow-sm ${s.rightIdx > 0 ? 'bg-rose-50 border-rose-400' : 'bg-slate-50 border-slate-200 border-dashed'}`}>
                                            <span className="text-[9px] font-bold text-slate-500 mb-1">Right Nodes</span>
                                            <span className={`font-mono font-black text-xl ${s.rightIdx > 0 ? 'text-rose-700' : 'text-slate-400'}`}>{s.rightIdx}</span>
                                            <span className={`text-[8px] font-bold mt-1 ${s.rightIdx > 0 ? 'text-rose-500' : 'text-slate-400'}`}>G[{s.rightIdx}] = {s.rightVal}</span>
                                        </div>
                                     </div>
                                 </div>
                                 
                                 {s.action === 'add' && (
                                     <div className="mt-6 bg-amber-100 text-amber-800 px-4 py-2 rounded-xl font-mono text-sm font-bold flex items-center gap-3 animate-in zoom-in border border-amber-300 shadow-md">
                                        <span>G[{s.i}] += </span>
                                        <span className="bg-white px-2 py-0.5 rounded text-sky-600">{s.leftVal}</span>
                                        <span className="text-amber-500">×</span>
                                        <span className="bg-white px-2 py-0.5 rounded text-rose-600">{s.rightVal}</span>
                                     </div>
                                 )}
                             </div>
                         </div>
                      )}

                   </div>

                  {/* Final Overlays */}
                  {s.isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600`}>
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">COMPUTATION COMPLETE</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Unique BSTs: {s.G[n]}
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
                <Network className="text-emerald-600"/> Catalan Numbers & BSTs
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-emerald-100 pl-6">
                The number of structurally unique Binary Search Trees for `n` nodes is governed by the Catalan Number sequence. We can elegantly build this using Dynamic Programming.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ListOrdered size={18}/> Step 1: Defining the Subproblem
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            Let <code>G(n)</code> be the number of unique BSTs for a sequence of length <code>n</code>.
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-3">
                            <p>To find <code>G(n)</code>, we can pick any number <code>j</code> (from 1 to n) to be the root of our tree.</p>
                            <p>Because it's a BST, all numbers less than <code>j</code> (which is <code>j-1</code> numbers) MUST form the left subtree.</p>
                            <p>All numbers greater than <code>j</code> (which is <code>n-j</code> numbers) MUST form the right subtree.</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-emerald-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Hash size={18}/> Step 2: The DP Recurrence
                        </h3>
                        <p className="text-xs text-emerald-800 leading-relaxed mb-4">
                            If we choose <code>j</code> as the root, the number of unique shapes is the product of left shapes and right shapes.
                        </p>
                        <div className="text-xs text-emerald-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-emerald-200 shadow-inner space-y-2">
                            <p><code>Shapes(root=j) = G(j-1) * G(n-j)</code></p>
                            <p>Since any <code>j</code> from 1 to <code>n</code> can be the root, the total combinations <code>G(n)</code> is the sum of all these possibilities:</p>
                            <p className="bg-emerald-100 p-2 text-center rounded text-emerald-900"><code>G(n) = Σ [ G(j-1) * G(n-j) ]</code></p>
                            <p>Base cases: <code>G(0) = 1</code> and <code>G(1) = 1</code>.</p>
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
                        "To solve for the number of unique BSTs, I use dynamic programming to build up the solutions from smaller subproblems. Let G[i] be the number of unique BSTs with i nodes. For any number of nodes i, we can iterate through each possible root j from 1 to i. The left subtree will have j-1 nodes and the right subtree will have i-j nodes. The total combinations for root j is simply the combinations of the left subtrees multiplied by the combinations of the right subtrees: G[j-1] * G[i-j]. We sum this up for all possible roots to get G[i]. I compute this iteratively from i=2 up to n, giving an O(N^2) time and O(N) space complexity."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-emerald-500"/> FAQ: Why is G[0] = 1?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Mathematically, if <code>G[0]</code> was 0, multiplying the subtrees (e.g., <code>G[j-1] * G[i-j]</code>) would result in 0 whenever a subtree is empty (which happens when the root is at the extreme left or right edge).
                                <br/><br/>
                                Conceptually, an empty tree is technically one valid shape of a tree (a `null` node). Therefore, <code>G[0] = 1</code> is required for the DP formula to work.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N²)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We have an outer loop running `n` times, and an inner loop running up to `i` times. This results in the sum of the first N integers, which is O(N^2) operations.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We allocate a DP array `G` of size `n+1` to store our computed answers. No deep recursion stack is used.</p>
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
        indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 shrink-0'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Math|Arrays|ArrayList|numTrees|size|add|get|length)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Math', 'Arrays', 'ArrayList'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['numTrees', 'size', 'add', 'get', 'length'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['G', 'i', 'j', 'n'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};


export default UniqueBSTVisualizeri;