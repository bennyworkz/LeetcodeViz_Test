import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ListOrdered, ArrowRight, Hash, XSquare, Blocks, 
  CheckSquare, Shuffle, Info, RotateCcw, Timer, Binary
} from 'lucide-react';

const APPROACHES = {
  mirroring: {
    id: 'mirroring',
    title: 'Iterative Reflection',
    subtitle: 'Intuitive: O(2^N) Time, O(2^N) Space.',
    icon: <Layers size={16} />,
    complexity: 'Time: O(2^N) | Space: O(2^N)', 
    code: `class Solution {
    public List<Integer> grayCode(int n) {
        List<Integer> res = new ArrayList<>();
        // 1. Base case: 0-bit gray code is just [0]
        res.add(0);
        
        // 2. Iteratively generate for each bit position
        for (int i = 0; i < n; i++) {
            int size = res.size();
            // Prefix adds a '1' at the i-th bit position
            int prefix = 1 << i; 
            
            // 3. Iterate backwards (mirror reflection)
            for (int j = size - 1; j >= 0; j--) {
                // OR operation appends the prefix to the mirrored value
                res.add(res.get(j) | prefix);
            }
        }
        
        return res;
    }
}`,
    explanation: "This approach builds the Gray Code sequence iteratively. For each new bit `i`, we take the existing sequence, reflect it (read backwards), and prepend a '1' to each of the reflected elements. Reading backwards ensures that the boundary between the original sequence and the reflected sequence only differs by exactly 1 bit (the newly added '1')."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">89. Gray Code</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          An <strong>n-bit gray code sequence</strong> is a sequence of <code>2^n</code> integers where:
        </p>
        <ul className="list-disc pl-6 space-y-2">
            <li>Every integer is in the inclusive range <code>[0, 2^n - 1]</code>,</li>
            <li>The first integer is <code>0</code>,</li>
            <li>An integer appears <strong>no more than once</strong> in the sequence,</li>
            <li>The binary representation of every pair of <strong>adjacent</strong> integers differs by <strong>exactly one bit</strong>, and</li>
            <li>The binary representation of the <strong>first</strong> and <strong>last</strong> integers differs by <strong>exactly one bit</strong>.</li>
        </ul>
        <p className="text-lg leading-relaxed mt-4">
          Given an integer <code>n</code>, return <em>any valid <strong>n-bit gray code sequence</strong></em>.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> n = 2</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [0,1,3,2]</p>
              <p className="text-slate-500 mt-4 leading-relaxed whitespace-pre-line">
                <span className="text-slate-400 font-bold">Explanation:</span>{"\n"}
                The binary representation of [0,1,3,2] is [00,01,11,10].{"\n"}
                - 00 and 01 differ by one bit{"\n"}
                - 01 and 11 differ by one bit{"\n"}
                - 11 and 10 differ by one bit{"\n"}
                - 10 and 00 differ by one bit
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> n = 1</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [0,1]</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= n &lt;= 16</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const GrayCodeVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('mirroring');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const [nInput, setNInput] = useState('3');

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let n = parseInt(nInput);
    if (isNaN(n) || n < 1) n = 1;
    // Cap at 4 for UI visualizer performance and screen real estate (16 elements max)
    if (n > 4) n = 4;
    return { n };
  }, [nInput]);

  const trace = useMemo(() => {
    const steps = [];
    let { n } = parsedData;
    let res = [];

    // Init
    res.push(0);
    steps.push({
        phase: 'Initialization',
        description: `Start with the base case.\n0-bit Gray Code is simply [0].`,
        line: 4,
        state: { res: [...res], i: null, j: null, prefix: null, size: null, action: 'init' }
    });

    for (let i = 0; i < n; i++) {
        let size = res.length;
        let prefix = 1 << i;
        
        steps.push({
            phase: `Outer Loop i=${i}`,
            description: `Generating sequence for ${i + 1} bits.\n\nCurrent sequence size = ${size}.\nPrefix to add = ${prefix} (binary ${prefix.toString(2).padStart(n, '0')}).`,
            line: 7,
            state: { res: [...res], i, j: null, prefix, size, action: 'outer_loop' }
        });

        for (let j = size - 1; j >= 0; j--) {
            steps.push({
                phase: `Reflection j=${j}`,
                description: `Looking at the mirrored element res[${j}] = ${res[j]}.\n\nBy traversing backwards, we ensure the boundary element differs by only 1 bit.`,
                line: 11,
                state: { res: [...res], i, j, prefix, size, action: 'mirror_look' }
            });

            let newVal = res[j] | prefix;
            res.push(newVal);

            steps.push({
                phase: `Append New Value`,
                description: `Prepending the '1' bit to the mirrored element:\n${res[j]} | ${prefix} = ${newVal}\n\nAdded ${newVal} to the result list.`,
                line: 13,
                state: { res: [...res], i, j, prefix, size, action: 'append', newlyAdded: newVal, sourceIndex: j }
            });
        }
    }

    steps.push({
        phase: 'Algorithm Complete',
        description: `Successfully generated all ${res.length} elements for a ${n}-bit Gray Code sequence!`,
        line: 17,
        state: { res: [...res], i: null, j: null, prefix: null, size: null, action: 'complete', isSuccess: true }
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
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center">
                <Binary className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Gray Code</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 89</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Math / Backtracking / Bitwise</span>
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
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
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
                      <Code2 size={14} className="text-indigo-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${s.isSuccess || s.action === 'init' ? 'bg-emerald-500/20 border-emerald-500' : (s.action === 'mirror_look' ? 'bg-amber-500/20 border-amber-500' : (s.action === 'append' ? 'bg-teal-500/20 border-teal-500' : 'bg-indigo-500/20 border-indigo-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={s.isSuccess || s.action === 'init' ? 'emerald' : (s.action === 'mirror_look' ? 'amber' : (s.action === 'append' ? 'teal' : 'indigo'))} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-indigo-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Iteration Variables</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="Bit Index (i)" val={s.i !== null && s.i !== undefined ? s.i : "-"} color="purple" active={s.i !== null && s.i !== undefined} />
                        <VariableCard label="Prefix (1<<i)" val={s.prefix !== null && s.prefix !== undefined ? s.prefix : "-"} color="sky" active={s.prefix !== null && s.prefix !== undefined} />
                        <VariableCard label="Mirror Index (j)" val={s.j !== null && s.j !== undefined ? s.j : "-"} color="amber" active={s.j !== null && s.j !== undefined} />
                        <VariableCard label="Array Size" val={s.size !== null && s.size !== undefined ? s.size : (s.res ? s.res.length : "-")} color="emerald" active={true} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-end shrink-0">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-indigo-600 uppercase block pl-1 tracking-widest font-mono">Number of Bits (N)</label>
                        <input type="number" min="1" max="4" value={nInput} onChange={(e) => { setNInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-sm shadow-inner tracking-widest font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="3" />
                        <p className="text-[9px] text-slate-400 pl-1 font-mono">Range: 1 to 4 (for visualization)</p>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto pb-5">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 sm:flex-none sm:w-16 px-4 py-2.5 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] sm:flex-none sm:w-28 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-1">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group shrink-0 ${s.isSuccess || s.action === 'init' ? 'bg-emerald-900 border-emerald-800' : (s.action === 'mirror_look' ? 'bg-amber-900 border-amber-800' : (s.action === 'append' ? 'bg-teal-900 border-teal-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {s.isSuccess || s.action === 'init' ? <Check size={100}/> : (s.action === 'mirror_look' ? <RotateCcw size={100}/> : (s.action === 'append' ? <ArrowRight size={100}/> : <Activity size={100}/>))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={s.isSuccess || s.action === 'init' ? "text-emerald-400" : (s.action === 'mirror_look' ? 'text-amber-400' : (s.action === 'append' ? 'text-teal-400' : 'text-slate-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${s.isSuccess || s.action === 'init' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (s.action === 'mirror_look' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : (s.action === 'append' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'))}`}>Line {cur.line}</div>
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
                      
                      <div className="w-full">
                          <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest font-mono mb-4 flex items-center justify-center gap-2"><Target size={14}/> Result Array (res)</span>
                          
                          <div className="flex flex-wrap gap-4 items-center justify-center pt-4">
                              {s.res && s.res.map((val, index) => {
                                  const binaryStr = val.toString(2).padStart(n, '0');
                                  
                                  const isSource = s.action === 'mirror_look' && index === s.sourceIndex;
                                  const isNewlyAdded = s.action === 'append' && index === s.res.length - 1;
                                  const isPastSize = s.size !== null && index >= s.size;
                                  
                                  let boxClass = "relative flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-500 w-20 h-24 ";
                                  let binClass = "font-mono font-black text-lg tracking-widest mt-1 ";
                                  let decClass = "font-mono text-[10px] uppercase font-bold text-slate-400 mt-2";

                                  if (isNewlyAdded) {
                                      boxClass += "bg-teal-50 border-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.3)] scale-110 z-20";
                                      binClass += "text-teal-700";
                                      decClass = "font-mono text-[10px] uppercase font-bold text-teal-600 mt-2";
                                  } else if (isSource) {
                                      boxClass += "bg-amber-50 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-110 z-20";
                                      binClass += "text-amber-700";
                                      decClass = "font-mono text-[10px] uppercase font-bold text-amber-600 mt-2";
                                  } else if (isPastSize) {
                                      boxClass += "bg-slate-50 border-slate-300 text-slate-600";
                                      binClass += "text-slate-600";
                                  } else {
                                      boxClass += "bg-white border-slate-200 shadow-sm text-slate-700";
                                      binClass += "text-slate-700";
                                  }

                                  return (
                                      <div key={`res-${index}`} className="flex flex-col items-center relative">
                                          {/* Connecting Line if it's an append */}
                                          {isNewlyAdded && s.sourceIndex !== undefined && (
                                              <div className="absolute -top-6 left-1/2 w-px h-6 bg-teal-400 border-l border-dashed border-teal-400 pointer-events-none"></div>
                                          )}

                                          <div className={boxClass}>
                                              <span className="absolute top-2 left-2 text-[8px] font-black text-slate-300 font-mono">[{index}]</span>
                                              
                                              <div className={binClass}>
                                                  {/* Highlight the flipped bit if newly added */}
                                                  {isNewlyAdded ? (
                                                      binaryStr.split('').map((bit, bIdx) => {
                                                          const isFlipped = bIdx === (n - 1 - s.i);
                                                          return (
                                                              <span key={bIdx} className={isFlipped ? "text-teal-500 font-black scale-125 inline-block" : ""}>
                                                                  {bit}
                                                              </span>
                                                          )
                                                      })
                                                  ) : binaryStr}
                                              </div>
                                              
                                              <span className={decClass}>Dec: {val}</span>
                                          </div>
                                          
                                          {isSource && (
                                              <div className="absolute -bottom-8 whitespace-nowrap bg-amber-100 text-amber-700 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider animate-bounce">
                                                  Source
                                              </div>
                                          )}
                                      </div>
                                  );
                              })}
                          </div>
                      </div>

                      {/* Mirror separator visual */}
                      {s.size > 0 && s.i !== null && !s.isSuccess && (
                          <div className="w-full max-w-md border-t-2 border-dashed border-indigo-200 mt-10 relative flex justify-center">
                              <span className="bg-white px-3 py-1 absolute -top-3 text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono rounded-full border border-indigo-100">Mirror Line (Size: {s.size})</span>
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
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">SEQUENCE COMPLETE</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Generated {s.res.length} integers
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
                <Layers className="text-indigo-600"/> Gray Code Generation
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-indigo-100 pl-6">
                A Gray code sequence is a binary numeral system where two successive values differ in only one bit. There are two beautiful ways to construct this sequence: Iterative Reflection and the Direct XOR Formula.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Layers size={18}/> Method 1: Iterative Reflection (Visualized)
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            We can build an `n`-bit sequence using the `(n-1)`-bit sequence.
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-3">
                            <p>1. Start with n=1: <code>[0, 1]</code>.</p>
                            <p>2. To get n=2, first <strong>reflect</strong> the previous sequence: <code>[1, 0]</code>.</p>
                            <p>3. Add a leading '1' to the reflected part (adding 2^1): <code>[11, 10]</code> (which is 3, 2).</p>
                            <p>4. Concatenate: <code>[0, 1] + [3, 2] = [0, 1, 3, 2]</code>.</p>
                            <p>Because we reflected it, the boundary (1 and 3, i.e., 01 and 11) only differs by the newly added bit!</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-purple-50 border border-purple-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-purple-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Hash size={18}/> Method 2: Direct Formula (XOR)
                        </h3>
                        <p className="text-xs text-purple-800 leading-relaxed mb-4">
                            There is a mathematical mapping from a standard integer `i` to its Gray Code equivalent: <br/><code>G(i) = i ^ (i &gt;&gt; 1)</code>
                        </p>
                        <div className="text-xs text-purple-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-purple-200 shadow-inner space-y-2">
                            <p>If you loop <code>i</code> from <code>0</code> to <code>2^n - 1</code>, adding <code>i ^ (i &gt;&gt; 1)</code> to the result will naturally generate the Gray Code sequence.</p>
                            <p><strong>Why?</strong> When going from `i` to `i+1`, standard binary flips multiple bits (e.g., 011 to 100). By XORing `i` with `i` shifted right by 1, the carry-overs in binary addition are perfectly cancelled out, resulting in exactly one bit changing!</p>
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
                        "To generate the Gray Code sequence, I prefer the Iterative Reflection approach. We start with the base sequence `[0]`. For each bit position `i` from `0` to `n-1`, we take the existing numbers in our sequence, iterate backwards, and add a '1' at the `i`-th bit position (`value | 1 &lt;&lt; i`). We append these new numbers to the sequence. Iterating backwards ensures that the boundary where the two halves meet differs by exactly one bit. This takes O(2^N) time, which is optimal since we must generate 2^N elements."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-indigo-500"/> FAQ: Should I use the XOR Formula?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                You can absolutely write the XOR solution: <code>res.add(i ^ (i &gt;&gt; 1))</code>. It is $O(1)$ space and $O(2^n)$ time, resulting in a tiny, 4-line function.
                                <br/><br/>
                                <strong>However</strong>, be prepared to prove <em>why</em> it works! Interviewers love to ask "Can you prove that adjacent elements differ by exactly 1 bit?" If you can't prove the math, the Iterative Reflection approach is much safer because you can easily trace and explain the logic intuitively.
                            </div>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <Timer size={14} className="text-indigo-500"/> Time & Space Complexity
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Time Complexity</span>
                                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">O(2^N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">The outer loop runs `N` times. In each iteration, the inner loop runs `size` times, where `size` doubles each time (1, 2, 4, 8...). The total number of iterations sums exactly to `2^N`.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">O(2^N) or O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">If the output array is not considered extra space, it is $O(1)$ auxiliary space. Otherwise, it requires $O(2^N)$ space to store the $2^N$ generated integers.</p>
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 shrink-0'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'indigo' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Math|Arrays|ArrayList|grayCode|size|add|get|length)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['grayCode', 'size', 'add', 'get', 'length'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['res', 'i', 'j', 'prefix', 'n'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};
 
export default GrayCodeVisualizer;