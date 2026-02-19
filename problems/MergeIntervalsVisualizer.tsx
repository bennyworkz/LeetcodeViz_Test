
import React, { useState, useMemo } from 'react';
import { 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Activity, 
  BookOpen, 
  Code2, 
  Check, 
  Copy, 
  Zap, 
  Trophy, 
  MessageSquare, 
  Target, 
  AlertCircle, 
  Cpu, 
  Layers, 
  Hash, 
  Database, 
  Calculator, 
  FileText, 
  ArrowRight, 
  ArrowDown, 
  Info, 
  BarChart3, 
  X, 
  GanttChartSquare,
  ListFilter,
  ArrowRightLeft,
  Timer
} from 'lucide-react';

const APPROACHES = {
  optimal: {
    id: 'optimal',
    title: '1. Sort & Merge',
    subtitle: 'Optimal O(N log N)',
    icon: <GanttChartSquare size={16} />,
    complexity: 'Time: O(N log N) | Space: O(log N) or O(N)',
    code: `class Solution {
    public int[][] merge(int[][] intervals) {
        if (intervals.length <= 1) return intervals;
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

        List<int[]> result = new ArrayList<>();
        int[] currentInterval = intervals[0];
        result.add(currentInterval);

        for (int[] interval : intervals) {
            int currentEnd = currentInterval[1];
            int nextStart = interval[0];
            int nextEnd = interval[1];

            if (currentEnd >= nextStart) {
                currentInterval[1] = Math.max(currentEnd, nextEnd);
            } else {
                currentInterval = interval;
                result.add(currentInterval);
            }
        }
        return result.toArray(new int[result.size()][]);
    }
}`,
    explanation: "The core insight is sorting. If we sort by start time, overlapping intervals must be adjacent. We maintain a 'current' interval and merge it with subsequent ones if they overlap, otherwise we start a new group."
  }
};

const MergeIntervalsVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproach] = useState<keyof typeof APPROACHES>('optimal');
  const [intervalsInput, setIntervalsInput] = useState("[1,3],[2,6],[8,10],[15,18]");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const parsedIntervals = useMemo(() => {
    try {
      const cleaned = intervalsInput.replace(/\]\s*,\s*\[/g, '|').replace(/[\[\]]/g, '');
      return cleaned.split('|').map(pair => pair.split(',').map(n => parseInt(n.trim()))).filter(pair => pair.length === 2 && !pair.some(isNaN));
    } catch (e) {
      return [[1, 3], [2, 6], [8, 10], [15, 18]];
    }
  }, [intervalsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = parsedIntervals.length;
    if (n === 0) return [];

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ 
        phase, 
        description: desc, 
        line, 
        state: { 
          intervals: [],
          merged: [],
          currentIdx: -1,
          activeInterval: null,
          isOverlap: false,
          currentEnd: null,
          nextStart: null,
          nextEnd: null,
          ...state 
        } 
      });
    };

    // Step 1: Guard Clause
    addStep("Pre-check", "Check if input length is 1 or less. If so, no merging is required.", 3, { 
      intervals: JSON.parse(JSON.stringify(parsedIntervals)) 
    });

    const sorted = [...parsedIntervals].sort((a, b) => a[0] - b[0]);
    // Step 2: Sorting
    addStep("Sorting", "Sort intervals by their start times. This guarantees that overlapping intervals will be next to each other.", 4, { 
      intervals: JSON.parse(JSON.stringify(sorted)) 
    });

    const merged: number[][] = [];
    // Step 3: Init Result List
    addStep("Setup", "Initialize a dynamic List to hold our final merged intervals.", 6, { 
      intervals: JSON.parse(JSON.stringify(sorted)), 
      merged: [] 
    });

    let currentInterval = [...sorted[0]];
    // Step 4: Init currentInterval
    addStep("Setup", "Set the first interval as our starting point for merging.", 7, { 
      intervals: JSON.parse(JSON.stringify(sorted)), 
      merged: [], 
      activeInterval: [...currentInterval] 
    });

    merged.push(currentInterval);
    // Step 5: Initial Add
    addStep("Setup", "Add this initial interval to our results list.", 8, { 
      intervals: JSON.parse(JSON.stringify(sorted)), 
      merged: JSON.parse(JSON.stringify(merged)), 
      activeInterval: [...currentInterval] 
    });

    for (let i = 0; i < sorted.length; i++) {
      const interval = sorted[i];
      
      // Step 6: Loop Header
      addStep("Iteration", `Processing interval at index ${i}: [${interval.join(',')}]`, 10, { 
        intervals: JSON.parse(JSON.stringify(sorted)), 
        merged: JSON.parse(JSON.stringify(merged)), 
        currentIdx: i, 
        activeInterval: [...currentInterval] 
      });

      const currentEnd = currentInterval[1];
      // Step 7: Capture currentEnd
      addStep("Variable Access", `Identify currentEnd: ${currentEnd}`, 11, { 
        intervals: JSON.parse(JSON.stringify(sorted)), 
        merged: JSON.parse(JSON.stringify(merged)), 
        currentIdx: i, 
        activeInterval: [...currentInterval],
        currentEnd 
      });

      const nextStart = interval[0];
      // Step 8: Capture nextStart
      addStep("Variable Access", `Identify nextStart (the start of the interval being scanned): ${nextStart}`, 12, { 
        intervals: JSON.parse(JSON.stringify(sorted)), 
        merged: JSON.parse(JSON.stringify(merged)), 
        currentIdx: i, 
        activeInterval: [...currentInterval],
        currentEnd, 
        nextStart 
      });

      const nextEnd = interval[1];
      // Step 9: Capture nextEnd
      addStep("Variable Access", `Identify nextEnd: ${nextEnd}`, 13, { 
        intervals: JSON.parse(JSON.stringify(sorted)), 
        merged: JSON.parse(JSON.stringify(merged)), 
        currentIdx: i, 
        activeInterval: [...currentInterval],
        currentEnd, 
        nextStart, 
        nextEnd 
      });

      // Step 10: Comparison
      const isOverlapping = currentEnd >= nextStart;
      addStep("Comparison", `Check overlap: Does currentEnd (${currentEnd}) >= nextStart (${nextStart})? ${isOverlapping ? 'YES' : 'NO'}`, 15, { 
        intervals: JSON.parse(JSON.stringify(sorted)), 
        merged: JSON.parse(JSON.stringify(merged)), 
        currentIdx: i, 
        activeInterval: [...currentInterval],
        currentEnd, 
        nextStart, 
        nextEnd,
        isOverlap: isOverlapping 
      });

      if (isOverlapping) {
        // Step 11: Merge
        const oldEnd = currentInterval[1];
        currentInterval[1] = Math.max(currentEnd, nextEnd);
        // Note: In Java, since it's a list of references, updating currentInterval[1] updates it in merged too.
        const lastIdx = merged.length - 1;
        merged[lastIdx] = [...currentInterval];

        addStep("Merge", `Overlap detected! Extend the end of the current group to max(${oldEnd}, ${nextEnd}) = ${currentInterval[1]}.`, 16, { 
          intervals: JSON.parse(JSON.stringify(sorted)), 
          merged: JSON.parse(JSON.stringify(merged)), 
          currentIdx: i, 
          activeInterval: [...currentInterval],
          isOverlap: true 
        });
      } else {
        // Step 11: Switch Interval
        currentInterval = [...interval];
        addStep("No Overlap", `Gap found! The current interval is finished. Move reference to new interval [${currentInterval.join(',')}].`, 18, { 
          intervals: JSON.parse(JSON.stringify(sorted)), 
          merged: JSON.parse(JSON.stringify(merged)), 
          currentIdx: i, 
          activeInterval: [...currentInterval],
          isOverlap: false 
        });

        // Step 12: Add New
        merged.push(currentInterval);
        addStep("Push New", `Add the new interval to the result list.`, 19, { 
          intervals: JSON.parse(JSON.stringify(sorted)), 
          merged: JSON.parse(JSON.stringify(merged)), 
          currentIdx: i, 
          activeInterval: [...currentInterval] 
        });
      }
    }

    // Step 13: Final Return
    addStep("Conclusion", "Traversal complete. Converting the list to a static array for return.", 22, { 
      intervals: JSON.parse(JSON.stringify(sorted)), 
      merged: JSON.parse(JSON.stringify(merged)), 
      finished: true 
    });

    return steps;
  }, [parsedIntervals]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(APPROACHES.optimal.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0];
  const { intervals: sortedInts, merged: currentMerged, currentIdx, activeInterval, isOverlap, finished, currentEnd, nextStart, nextEnd } = cur.state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center">
                <GanttChartSquare className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Merge Intervals</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-widest font-black text-[10px]">Algorithm Visualizer</span>
                <span>LC 56 • Medium</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
            <TabButton active={activeTab === 'problem'} onClick={() => setActiveTab('problem')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<BookOpen size={16}/>} label="Learn" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'problem' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 animate-in fade-in duration-700">
            <div className="max-w-3xl space-y-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-6 font-mono tracking-tighter">56. Merge Intervals</h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-lg leading-relaxed">
                  <p>Given an array of <code>intervals</code> where <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code>, merge all overlapping intervals.</p>
                  <p>Return <em>an array of the non-overlapping intervals that cover all the intervals in the input.</em></p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Hash size={16}/> Examples:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm shadow-inner space-y-3">
                        <p><span className="text-slate-400 font-bold uppercase text-[10px]">Input:</span> intervals = [[1,3],[2,6],[8,10],[15,18]]</p>
                        <p><span className="text-slate-400 font-bold uppercase text-[10px]">Output:</span> [[1,6],[8,10],[15,18]]</p>
                        <p className="text-xs text-slate-500 italic border-t border-slate-200 pt-2 leading-relaxed">Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm shadow-inner space-y-3">
                        <p><span className="text-slate-400 font-bold uppercase text-[10px]">Input:</span> intervals = [[1,4],[4,5]]</p>
                        <p><span className="text-slate-400 font-bold uppercase text-[10px]">Output:</span> [[1,5]]</p>
                        <p className="text-xs text-slate-500 italic border-t border-slate-200 pt-2 leading-relaxed">Explanation: Intervals [1,4] and [4,5] are considered overlapping.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <AlertCircle size={14} /> Constraints:
                </h3>
                <ul className="list-disc list-inside space-y-3 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <li><code className="bg-slate-100 px-1.5 rounded text-slate-800 font-bold text-indigo-600">1 {'<='} intervals.length {'<='} 10<sup>4</sup></code></li>
                  <li><code>intervals[i].length == 2</code></li>
                  <li><code>0 &lt;= start<sub>i</sub> &lt;= end<sub>i</sub> &lt;= 10<sup>4</sup></code></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-2 flex gap-2 shadow-sm">
                <div className="flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-100">
                    <span className="text-xs font-black uppercase tracking-tight">{APPROACHES.optimal.title}</span>
                    <span className="text-[10px] opacity-70 text-white">
                      {APPROACHES.optimal.complexity}
                    </span>
                </div>
              </div>

              <div className="bg-[#0f172a] rounded-3xl h-[520px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Code2 size={14} className="text-indigo-400" />
                    <span className="font-bold uppercase tracking-tight text-[10px]">Solution.java</span>
                  </div>
                  <button onClick={handleCopy} className="hover:text-white transition-colors">
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="p-6 font-mono text-[12px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="absolute left-0 right-0 bg-indigo-500/15 border-l-4 border-indigo-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${(cur.line * 19.6) + 24 - 19.6}px`, height: '19.6px' }} />
                    {APPROACHES.optimal.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} />
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-indigo-600">
                    <Info size={18} />
                    <h4 className="text-sm font-black uppercase tracking-widest font-mono">Algorithm Logic</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">{APPROACHES.optimal.explanation}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-indigo-600 uppercase block pl-1 tracking-widest font-mono">Input Intervals</label>
                    <input value={intervalsInput} onChange={(e) => { setIntervalsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" placeholder="e.g., [1,3],[2,6]" />
                </div>
                <div className="flex gap-3">
                  <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <ChevronLeft size={16}/> Prev
                  </button>
                  <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                    Next Step <ChevronRight size={16}/>
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-3xl p-7 shadow-2xl border border-slate-800 min-h-[160px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    <Layers size={100}/>
                </div>
                <div className="flex items-center gap-2 mb-3">
                   <Activity size={14} className="text-indigo-400"/>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono tracking-tighter">Execution Details</span>
                </div>
                <div className="text-lg font-black tracking-tight mb-2 uppercase font-mono flex items-center gap-3">
                    {cur.phase}
                </div>
                <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic">{cur.description}</p>
              </div>

              {/* Simulation Arena */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[480px] relative flex flex-col justify-between overflow-hidden shadow-inner transition-all duration-500">
                
                {/* State Variable Dashboard */}
                {!finished && (
                  <div className="w-full grid grid-cols-2 gap-4 z-10 mb-8">
                     <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex flex-col items-center justify-center shadow-sm relative overflow-hidden group">
                        <span className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest font-mono">Variables In Use</span>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 w-full mt-2">
                            <div className="flex justify-between border-b border-slate-200 py-1">
                                <span className="text-[8px] font-bold text-slate-400 uppercase">currEnd</span>
                                <span className="font-mono text-xs font-black text-indigo-600">{currentEnd !== null ? currentEnd : '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 py-1">
                                <span className="text-[8px] font-bold text-slate-400 uppercase">nextStart</span>
                                <span className="font-mono text-xs font-black text-indigo-600">{nextStart !== null ? nextStart : '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 py-1">
                                <span className="text-[8px] font-bold text-slate-400 uppercase">nextEnd</span>
                                <span className="font-mono text-xs font-black text-indigo-600">{nextEnd !== null ? nextEnd : '-'}</span>
                            </div>
                        </div>
                     </div>
                     <div className="bg-indigo-50/50 rounded-3xl p-5 border border-indigo-100 flex flex-col items-center justify-center shadow-sm">
                        <span className="text-[9px] font-black text-indigo-400 uppercase mb-1 tracking-widest font-mono">Overlap Status</span>
                        <div className={`text-xl font-black font-mono transition-all duration-300 ${isOverlap ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`}>
                            {isOverlap ? 'OVERLAPPING' : 'CLEAR'}
                        </div>
                        {activeInterval && (
                          <div className="mt-2 text-[10px] font-black text-indigo-700 bg-white px-2 py-1 rounded-lg border border-indigo-100 shadow-sm uppercase tracking-tighter">
                            Active Group: [{activeInterval.join(',')}]
                          </div>
                        )}
                     </div>
                  </div>
                )}

                {/* Timeline Visualization */}
                <div className="flex-1 flex flex-col items-center justify-center w-full px-4 overflow-hidden relative">
                    <div className="w-full h-px bg-slate-200 relative mb-20">
                      {/* Scale points */}
                      {[0, 5, 10, 15, 20].map(val => (
                        <div key={val} className="absolute flex flex-col items-center" style={{ left: `${(val / 20) * 100}%` }}>
                           <div className="h-2 w-px bg-slate-300"></div>
                           <span className="text-[10px] font-mono font-black text-slate-400 mt-1">{val}</span>
                        </div>
                      ))}
                    </div>

                    <div className="w-full relative h-48 space-y-4">
                        {/* Sorted Intervals */}
                        <div className="flex flex-col gap-2">
                           <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 flex items-center gap-2">
                             <ListFilter size={12}/> Sorted Queue
                           </span>
                           <div className="flex flex-wrap gap-2">
                              {sortedInts.map((int: number[], idx: number) => {
                                const isActive = currentIdx === idx;
                                return (
                                  <div key={idx} className={`px-2 py-1 border-2 rounded-lg font-mono text-[10px] font-bold transition-all duration-300 ${isActive ? 'bg-indigo-600 border-indigo-700 text-white scale-110 shadow-lg z-10' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                                    [{int[0]},{int[1]}]
                                    {isActive && !finished && (
                                       <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-indigo-600 animate-bounce">
                                          <ArrowDown size={14} strokeWidth={3}/>
                                       </div>
                                    )}
                                  </div>
                                );
                              })}
                           </div>
                        </div>

                        {/* Merged Results */}
                        <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                           <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                             <Check size={12}/> Merged Results
                           </span>
                           <div className="flex flex-wrap gap-2">
                              {currentMerged.map((int: number[], idx: number) => (
                                <div key={idx} className="px-2 py-1 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 rounded-lg font-mono text-[10px] font-bold animate-in zoom-in shadow-sm">
                                  [{int[0]},{int[1]}]
                                </div>
                              ))}
                              {currentMerged.length === 0 && <span className="text-[10px] text-slate-300 italic font-mono">Empty Result List</span>}
                           </div>
                        </div>
                    </div>
                </div>

                {/* Final State Banner */}
                {finished && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-indigo-600/5 backdrop-blur-[4px] animate-in fade-in duration-1000">
                    <div className="bg-white border-2 border-indigo-100 px-12 py-10 rounded-[3.5rem] shadow-2xl flex flex-col items-center gap-6 transform -rotate-1 hover:rotate-0 transition-transform">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-xl mb-2">
                          <Check size={48} strokeWidth={3}/>
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] block mb-2 font-mono">Result Ready</span>
                        <div className="text-4xl font-black font-mono text-indigo-600">
                           {currentMerged.length} Merged Set{currentMerged.length !== 1 ? 's' : ''}
                        </div>
                        <div className="mt-6 px-6 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest font-mono shadow-sm">
                           O(N log N) Sorting Overhead Included
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'learn' && (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-10">
            <div className="max-w-4xl space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 font-mono leading-tight">
                <BookOpen className="text-indigo-600"/> The Greedy Invariant
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed font-mono tracking-tight">
                Merge Intervals is the textbook example of <b>Greedy Search with Pre-sorting</b>. Without sorting, we would have to compare every interval with every other interval (O(N²)).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-indigo-900 flex items-center gap-2 uppercase tracking-tighter text-sm font-mono"><ListFilter size={18}/> The Sorting Contract</h3>
                        <p className="text-sm text-indigo-800 leading-relaxed italic border-l-2 border-indigo-200 pl-4">
                          "Sorting establishing a monotonic sequence in time."
                        </p>
                        <p className="text-xs text-indigo-700 leading-relaxed font-mono">
                          When we sort by <strong>start time</strong>, we guarantee that if <code>interval[i]</code> overlaps with any earlier interval, it <i>must</i> overlap with the one that starts immediately before it (or the chain it belongs to).
                        </p>
                    </div>
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm font-mono"><ArrowRightLeft size={18}/> The Comparison Rule</h3>
                        <p className="text-sm text-amber-700 leading-relaxed font-mono">
                          Overlap exists IF:
                          <br/><code>previous_end >= next_start</code>
                          <br/><br/>
                          New merged boundary is:
                          <br/><code>[prev_start, max(prev_end, next_end)]</code>
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Timer size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <BarChart3 size={32} className="text-indigo-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs font-mono">Efficiency Profile</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                      <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700 backdrop-blur-sm">
                          <span className="text-[10px] text-slate-500 block mb-1 uppercase font-black font-mono">Time Complexity</span>
                          <div className="font-mono text-xl font-black text-indigo-400">O(N log N)</div>
                          <p className="text-[9px] text-slate-500 mt-2 font-mono uppercase tracking-tighter">Dominated by Sorting</p>
                      </div>
                      <div className="p-5 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-500/20">
                          <span className="text-[10px] text-indigo-200 block mb-1 uppercase font-black font-mono">Space Complexity</span>
                          <div className="font-mono text-xl font-black">O(N)</div>
                          <p className="text-[9px] text-indigo-200 mt-2 font-mono uppercase tracking-tighter">Result Storage</p>
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                      <h4 className="text-[10px] font-black text-emerald-400 uppercase mb-1 flex items-center gap-2"><Zap size={12}/> Pro Tip: In-place Optimization</h4>
                      <p className="text-[10px] text-slate-300 leading-relaxed font-mono">
                        While the standard answer uses a List, you could perform the merge within the same array by moving a 'write' pointer only when overlaps are fully resolved.
                      </p>
                    </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <div className="space-y-6">
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                        <Trophy size={140} />
                    </div>
                    <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-amber-400 relative z-10 uppercase tracking-tight font-mono">
                        <Trophy size={24} /> Senior Interview Defense
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10 font-mono">
                        "Merging intervals is a fundamental greedy problem. I implemented an O(N log N) solution where sorting by start time creates the essential temporal relationship between elements. By maintaining a reference to the active merge candidate, I can resolve overlapping groups in a single O(N) linear scan. This approach ensures all potential overlaps are accounted for without redundant backtracking, and it handles nested intervals (where one completely contains another) by taking the maximum of the end boundaries."
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter font-mono font-black tracking-tight">
                        <MessageSquare className="text-indigo-500" size={20} /> Candidate Q&A
                    </h3>
                    <div className="space-y-4">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-mono">"What if intervals are sorted by end time?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed font-mono">
                                "Sorting by end time is common in <i>Interval Scheduling</i> problems (where you want to fit the most activities), but for <i>Merging</i>, sorting by start time is preferred because it ensures that once we move past a start boundary, we can't find another overlap for the current group."
                            </p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-mono">"How would you handle extremely large inputs?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed font-mono">
                                "If the data doesn't fit in memory, I'd use <b>External Sorting</b> to sort the intervals on disk, then perform a streaming merge pass where we only keep the current active group in memory."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-[2rem] p-8 shadow-sm">
                    <h3 className="text-lg font-black text-indigo-900 mb-6 uppercase tracking-widest flex items-center gap-2 font-mono">
                        <AlertCircle size={20}/> Leadership Strategy
                    </h3>
                    <ul className="space-y-8">
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">1</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight font-mono">Bias for Action</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1 font-mono">Start by establishing the sort order. Attempting to merge unsorted data is a major red flag that leads to inefficient O(N²) logic.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">2</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight font-mono">Dive Deep</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1 font-mono">Discuss boundary inclusivity. In this problem, <code>[1,4]</code> and <code>[4,5]</code> overlap. Clarifying this rule early demonstrates engineering precision.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                    <Calculator className="text-slate-400 mb-3" size={48} />
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest text-center mb-6 font-mono tracking-tighter">Bottleneck Analysis</p>
                    <div className="space-y-4 w-full">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase font-mono">Sorting Phase</span>
                                <span className="text-indigo-500 font-black font-mono tracking-tighter">O(N log N) - Heavy</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-full" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase font-mono">Linear Merge Phase</span>
                                <span className="text-emerald-500 font-black font-mono tracking-tighter">O(N) - Fast</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[10%]" />
                            </div>
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

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|void|String|boolean|new|this|for|Math|max|Arrays|ArrayList|List|sort|add|size|toArray|compare|Integer)\b|\b\d+\b)/g).filter(Boolean);

  return (
    <div className={`flex relative z-10 min-h-[19.6px] transition-colors duration-300 ${active ? 'bg-indigo-500/10 font-bold' : ''}`}>
      <span className="w-8 text-slate-600 text-right pr-4 border-r border-slate-800/50 mr-4 font-mono text-[10px] select-none shrink-0">{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean', 'void'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['String', 'Arrays', 'ArrayList', 'List', 'Math', 'Integer'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['sort', 'add', 'size', 'toArray', 'compare', 'max'].includes(part)) return <span key={i} className="text-blue-400">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-rose-400 font-bold">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default MergeIntervalsVisualizer;
