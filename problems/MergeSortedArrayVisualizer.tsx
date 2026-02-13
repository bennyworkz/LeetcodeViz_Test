
import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, Check, Copy, AlignLeft, Zap, Trophy, MessageSquare, Target, AlertCircle, Cpu, Layers, ArrowDown, List, Info, BarChart3, Calculator, FileText, Hash } from 'lucide-react';

const APPROACHES = {
  optimal: {
    id: 'optimal',
    title: '1. Three-Pointer (End)',
    subtitle: 'Optimal In-Place',
    icon: <Zap size={16} />,
    complexity: 'Time: O(M+N) | Space: O(1)',
    code: `class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int p1 = m - 1;
        int p2 = n - 1;
        int p = m + n - 1;

        while (p2 >= 0) {
            if (p1 >= 0 && nums1[p1] > nums2[p2]) {
                nums1[p] = nums1[p1];
                p1--;
            } else {
                nums1[p] = nums2[p2];
                p2--;
            }
            p--;
        }
    }
}`,
    explanation: "Merging from the end is the architectural insight. Since nums1 has extra space at the tail, we can place the largest elements first without overwriting any unread data from nums1."
  },
  sort: {
    id: 'sort',
    title: '2. Merge & Sort',
    subtitle: 'Naive Approach',
    icon: <AlertCircle size={16} />,
    complexity: 'Time: O((M+N) log (M+N)) | Space: O(1)',
    code: `class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        for (int i = 0; i < n; i++) {
            nums1[m + i] = nums2[i];
        }
        Arrays.sort(nums1);
    }
}`,
    explanation: "The simplest logic: append and sort. While functional, it ignores the pre-sorted property of the inputs, making it sub-optimal for large-scale data processing."
  }
};

const MergeSortedArrayVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproach, setSelectedApproach] = useState<keyof typeof APPROACHES>('optimal');
  const [nums1Input, setNums1Input] = useState("1,2,3,0,0,0");
  const [mInput, setMInput] = useState(3);
  const [nums2Input, setNums2Input] = useState("2,5,6");
  const [nInput, setNInput] = useState(3);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const nums1 = useMemo(() => nums1Input.split(',').map(x => parseInt(x.trim()) || 0), [nums1Input]);
  const nums2 = useMemo(() => nums2Input.split(',').map(x => parseInt(x.trim()) || 0), [nums2Input]);
  const m = parseInt(mInput.toString()) || 0;
  const n = parseInt(nInput.toString()) || 0;

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n1 = [...nums1];
    const n2 = [...nums2];

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ phase, description: desc, line, state: { ...state, nums1: [...n1], nums2: [...n2], m, n } });
    };

    if (selectedApproach === 'optimal') {
      let p1 = m - 1;
      let p2 = n - 1;
      let p = m + n - 1;

      addStep("Initialization", "Setting pointers at the end of valid data in both arrays.", 3, { p1, p2, p });
      addStep("Initialization", "Pointers: p1 (last of m elements in nums1), p2 (last of n in nums2), p (last index of nums1).", 5, { p1, p2, p });

      while (p2 >= 0) {
        addStep("Loop Condition", `While p2 (${p2}) >= 0. We still have elements in nums2 to merge.`, 7, { p1, p2, p });
        
        addStep("Compare", `Check: Is p1 >= 0 AND nums1[p1] (${p1 >= 0 ? n1[p1] : 'N/A'}) > nums2[p2] (${n2[p2]})?`, 8, { p1, p2, p, comparing: true });

        if (p1 >= 0 && n1[p1] > n2[p2]) {
          addStep("Action", `nums1[p1] is larger. Move it to target index p (${p}).`, 9, { p1, p2, p, moveFrom: 'p1' });
          n1[p] = n1[p1];
          addStep("Action", `Decrement p1 to ${p1 - 1}.`, 10, { p1: p1 - 1, p2, p, moveFrom: 'p1' });
          p1--;
        } else {
          addStep("Action", `nums2[p2] is larger or equal. Move it to target index p (${p}).`, 12, { p1, p2, p, moveFrom: 'p2' });
          n1[p] = n2[p2];
          addStep("Action", `Decrement p2 to ${p2 - 1}.`, 13, { p1, p2: p2 - 1, p, moveFrom: 'p2' });
          p2--;
        }
        addStep("Target Update", `Decrementing write pointer p to ${p - 1}.`, 15, { p1, p2, p: p - 1 });
        p--;
      }
      addStep("Finished", "All elements from nums2 are merged. Any remaining elements in nums1 are already in their correct places.", 17, { p1, p2, p, finished: true });

    } else {
      addStep("Loop", "Iterate through nums2 and place elements into the end buffer of nums1.", 3, { i: -1 });
      for (let i = 0; i < n; i++) {
        n1[m + i] = n2[i];
        addStep("Append", `Copying nums2[${i}] (${n2[i]}) to nums1[${m + i}].`, 4, { i, appendIdx: m + i });
      }
      addStep("Sort", "Sorting the entire merged array in nums1.", 6, { sorting: true });
      n1.sort((a, b) => a - b);
      addStep("Return", "Merge and sort complete.", 7, { finished: true });
    }

    return steps;
  }, [nums1, nums2, m, n, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const cur = trace[currentStep] || trace[0];
  const { p1, p2, p, nums1: curNums1, nums2: curNums2, moveFrom, comparing, finished, appendIdx, sorting } = cur.state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-100">
                <List className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Merge Sorted Array</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-widest font-black text-[10px]">Must Know</span>
                <span>LC 88 • Easy</span>
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
                <h2 className="text-3xl font-black text-slate-900 mb-6 font-mono tracking-tighter">88. Merge Sorted Array</h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-lg leading-relaxed">
                  <p>You are given two integer arrays <code>nums1</code> and <code>nums2</code>, sorted in <strong>non-decreasing order</strong>, and two integers <code>m</code> and <code>n</code>, representing the number of elements in <code>nums1</code> and <code>nums2</code> respectively.</p>
                  <p>Merge <code>nums1</code> and <code>nums2</code> into a single array sorted in non-decreasing order.</p>
                  <p>The final sorted array should not be returned by the function, but instead be <strong>stored inside the array <code>nums1</code></strong>. To accommodate this, <code>nums1</code> has a length of <code>m + n</code>, where the first <code>m</code> elements denote the elements that should be merged, and the last <code>n</code> elements are set to 0 and should be ignored. <code>nums2</code> has a length of <code>n</code>.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Hash size={16}/> Example:
                  </h3>
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 font-mono text-sm space-y-3 shadow-inner">
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter">Input:</span> nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3</p>
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter">Output:</span> [1,2,2,3,5,6]</p>
                    <p className="text-slate-500 italic text-xs leading-relaxed border-t border-slate-200 pt-3">
                      Explanation: The arrays we are merging are [1,2,3] and [2,5,6].<br/>
                      The result of the merge is [1,2,2,3,5,6].
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <AlertCircle size={14} /> Constraints:
                </h3>
                <ul className="list-disc list-inside space-y-3 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                  <li><code>nums1.length == m + n</code></li>
                  <li><code>nums2.length == n</code></li>
                  <li><code>0 &lt;= m, n &lt;= 200</code></li>
                  <li><code>1 &lt;= m + n &lt= 400</code></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-2 flex gap-2 shadow-sm">
                {(Object.keys(APPROACHES) as Array<keyof typeof APPROACHES>).map((key) => (
                  <button key={key} onClick={() => { setSelectedApproach(key); setCurrentStep(0); }} className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-blue-600 text-white shadow-lg' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}>
                    <span className="text-xs font-black uppercase tracking-tight">{APPROACHES[key].title}</span>
                    <span className={`text-[10px] opacity-70 ${selectedApproach === key ? 'text-white' : 'text-slate-400'}`}>
                      {APPROACHES[key].complexity}
                    </span>
                  </button>
                ))}
              </div>

              <div className="bg-[#0f172a] rounded-3xl h-[480px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Code2 size={14} className="text-blue-400" />
                    <span className="font-bold uppercase tracking-tight">MergeSortedArray.java</span>
                  </div>
                  <button onClick={handleCopy} className="hover:text-white transition-colors">
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="p-6 font-mono text-[13px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="absolute left-0 right-0 bg-blue-500/15 border-l-4 border-blue-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${(cur.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} />
                    {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} />
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-blue-600">
                    <Info size={18} />
                    <h4 className="text-sm font-black uppercase tracking-widest">Logic Insight</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">{APPROACHES[selectedApproach].explanation}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-blue-600 uppercase block pl-1 tracking-widest">nums1 (CSV)</label>
                        <input value={nums1Input} onChange={(e) => { setNums1Input(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-indigo-600 uppercase block pl-1 tracking-widest">nums2 (CSV)</label>
                        <input value={nums2Input} onChange={(e) => { setNums2Input(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase block pl-1 tracking-widest">Valid size m</label>
                        <input type="number" value={mInput} onChange={(e) => { setMInput(parseInt(e.target.value) || 0); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-slate-500 outline-none shadow-inner" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase block pl-1 tracking-widest">Valid size n</label>
                        <input type="number" value={nInput} onChange={(e) => { setNInput(parseInt(e.target.value) || 0); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-slate-500 outline-none shadow-inner" />
                    </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <ChevronLeft size={16}/> Prev
                  </button>
                  <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                    Next Step <ChevronRight size={16}/>
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-3xl p-7 shadow-2xl border border-slate-800 min-h-[160px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    <Layers size={100}/>
                </div>
                <div className="flex items-center gap-2 mb-3">
                   <Target size={14} className="text-blue-400"/>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Execution Thread</span>
                </div>
                <div className="text-lg font-black tracking-tight mb-2 uppercase">
                    {cur.phase}
                </div>
                <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3">{cur.description}</p>
              </div>

              {/* Simulation Arena */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[450px] relative flex flex-col justify-between overflow-hidden shadow-inner transition-all duration-500">
                
                {/* Pointers State Dashboard */}
                {!finished && selectedApproach === 'optimal' && (
                  <div className="w-full grid grid-cols-3 gap-3 z-10 mb-8">
                     <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center ${comparing || moveFrom === 'p1' ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-slate-50/50'}`}>
                        <span className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">p1 Index</span>
                        <div className="text-xl font-black text-blue-600">{p1 >= 0 ? p1 : 'End'}</div>
                     </div>
                     <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center ${comparing || moveFrom === 'p2' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 bg-slate-50/50'}`}>
                        <span className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">p2 Index</span>
                        <div className="text-xl font-black text-indigo-600">{p2 >= 0 ? p2 : 'End'}</div>
                     </div>
                     <div className={`p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 flex flex-col items-center`}>
                        <span className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Write p</span>
                        <div className="text-xl font-black text-slate-800">{p}</div>
                     </div>
                  </div>
                )}

                {/* Arrays Visualisation */}
                <div className="flex-1 flex flex-col gap-10">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Array: nums1 (m+n)</span>
                            <span className="text-[10px] font-mono font-bold text-slate-400">PTR: write head at {p}</span>
                        </div>
                        <div className="flex gap-2">
                            {curNums1.map((num, idx) => {
                                const isP1 = p1 === idx;
                                const isP = p === idx;
                                const isAppend = appendIdx === idx;
                                
                                let bgClass = "bg-white";
                                let borderClass = "border-slate-200";
                                let textClass = "text-slate-800";

                                if (isP) {
                                    bgClass = "bg-blue-600 shadow-xl shadow-blue-100 ring-4 ring-blue-100";
                                    textClass = "text-white";
                                    borderClass = "border-blue-700";
                                } else if (isP1) {
                                    bgClass = "bg-blue-50";
                                    borderClass = "border-blue-400 scale-105";
                                    textClass = "text-blue-700";
                                } else if (isAppend) {
                                    bgClass = "bg-amber-100 border-amber-500 animate-pulse";
                                } else if (sorting) {
                                    bgClass = "bg-emerald-50 border-emerald-500 animate-pulse";
                                }

                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center relative">
                                        <div className={`w-full h-14 border-2 rounded-xl flex items-center justify-center font-mono font-black text-lg transition-all duration-300 ${bgClass} ${borderClass} ${textClass}`}>
                                            {num}
                                        </div>
                                        <span className="mt-2 text-[8px] font-mono font-black text-slate-300">[{idx}]</span>
                                        {!finished && isP && (
                                            <div className="absolute -top-7 text-blue-600 animate-bounce">
                                                <ArrowDown size={18} strokeWidth={3}/>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Array: nums2 (n)</span>
                        </div>
                        <div className="flex gap-2 max-w-sm">
                            {curNums2.map((num, idx) => {
                                const isP2 = p2 === idx;
                                const isUsed = p2 < idx;

                                let bgClass = "bg-white";
                                let borderClass = "border-slate-200";
                                let textClass = "text-slate-800";

                                if (isP2) {
                                    bgClass = "bg-indigo-50";
                                    borderClass = "border-indigo-400 scale-110";
                                    textClass = "text-indigo-700";
                                } else if (isUsed) {
                                    bgClass = "bg-slate-50 opacity-40";
                                    borderClass = "border-slate-100";
                                    textClass = "text-slate-300";
                                }

                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center relative">
                                        <div className={`w-full h-14 border-2 rounded-xl flex items-center justify-center font-mono font-black text-lg transition-all duration-300 ${bgClass} ${borderClass} ${textClass}`}>
                                            {num}
                                        </div>
                                        <span className="mt-2 text-[8px] font-mono font-black text-slate-300">[{idx}]</span>
                                        {!finished && isP2 && (
                                            <div className="absolute -top-7 text-indigo-600 animate-bounce">
                                                <Target size={18} strokeWidth={3}/>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Final State Banner */}
                {finished && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-blue-600/5 backdrop-blur-[4px] animate-in fade-in duration-1000">
                    <div className="bg-white border-2 border-blue-100 px-12 py-10 rounded-[3.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] flex flex-col items-center gap-6 transform -rotate-1 hover:rotate-0 transition-transform">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-xl mb-2">
                          <Check size={48} strokeWidth={3}/>
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] block mb-2 font-mono">Merge Complete</span>
                        <div className="flex gap-2">
                           {curNums1.map((n, i) => <span key={i} className="text-2xl font-black text-slate-900 font-mono">{n}{i < curNums1.length -1 ? ',' : ''}</span>)}
                        </div>
                        <div className="mt-6 px-6 py-2 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest font-mono">
                           In-Place O(M+N)
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
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight flex items-center gap-3 font-mono">
                <BookOpen className="text-blue-600"/> The Backward Merge Logic
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed max-w-4xl">
                Most array merging starts at index 0. But in this specific LeetCode problem, <code>nums1</code> provides its own extra space at the end. Merging from the front would require <strong>shifting elements</strong> (expensive) or a <strong>temporary array</strong> (memory usage).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl space-y-3 shadow-sm">
                        <h3 className="font-black text-blue-900 flex items-center gap-2 uppercase tracking-tighter text-sm font-mono"><Layers size={18}/> Why Back-to-Front?</h3>
                        <p className="text-sm text-blue-800 leading-relaxed italic">
                          "The end of nums1 is a safe zone. By filling from largest to smallest, we ensure the read pointers are always ahead of the write pointer."
                        </p>
                        <p className="text-xs text-blue-700 leading-relaxed">
                          This effectively turns the O(N) space requirement into O(1) auxiliary space, as we leverage the existing capacity of the input array.
                        </p>
                    </div>
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-3 shadow-sm">
                        <h3 className="font-black text-slate-900 flex items-center gap-2 uppercase tracking-tighter text-sm font-mono"><Target size={18}/> Pointer Maintenance</h3>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          We manage three cursors: <code>p1</code> for data in nums1, <code>p2</code> for data in nums2, and <code>p</code> for the insertion point. The loop terminates when <code>p2</code> is exhausted, because any leftover <code>p1</code> items are already sorted and in place.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Calculator size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <BarChart3 size={32} className="text-blue-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs font-mono">Efficiency Profile</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                      <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700 backdrop-blur-sm">
                          <span className="text-[10px] text-slate-500 block mb-1 uppercase font-black font-mono">Time Complexity</span>
                          <div className="font-mono text-2xl font-black text-blue-400">O(M + N)</div>
                          <p className="text-[10px] text-slate-500 mt-2">Single pass through both datasets.</p>
                      </div>
                      <div className="p-5 bg-blue-600 rounded-3xl shadow-xl shadow-blue-500/20">
                          <span className="text-[10px] text-indigo-200 block mb-1 uppercase font-black font-mono">Space Complexity</span>
                          <div className="font-mono text-2xl font-black">O(1)</div>
                          <p className="text-[10px] text-indigo-200 mt-2">In-place merge, no extra buffers.</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed italic relative z-10 font-mono">
                      "Professional-grade algorithms avoid re-allocating memory. O(1) space is the gold standard for high-performance data pipelines at companies like Amazon."
                    </p>
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
                        "For high-throughput systems where memory overhead causes cache misses, I implemented an O(M+N) two-pointer merge from the end. While a naive merge-and-sort is simpler to write (O(N log N)), it ignores the pre-sorted property of the inputs. My approach ensures linear time complexity and constant auxiliary space, satisfying both the time and memory efficiency requirements expected for Amazon's large-scale data services."
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter font-mono">
                        <MessageSquare className="text-indigo-500" size={20} /> Candidate Q&A
                    </h3>
                    <div className="space-y-4">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-mono">"What if m = 0?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed font-mono">
                                "If <code>m = 0</code>, <code>nums1</code> is logically empty. The while loop handles this gracefully—it will pull all elements from <code>nums2</code> into <code>nums1</code>. This is the 'Bias for Action' principle: ensuring the code handles null-like states robustly."
                            </p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-mono">"Why only check p2 &gt;= 0?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed font-mono">
                                "If <code>p2</code> finishes, any remaining items in <code>p1</code> are already at the front of <code>nums1</code> in their correct sorted positions. Stopping early is a micro-optimization that shows attention to detail."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-[2rem] p-8 shadow-sm">
                    <h3 className="text-lg font-black text-indigo-900 mb-6 uppercase tracking-widest flex items-center gap-2 font-mono">
                        <AlertCircle size={20}/> Amazon Leadership Check
                    </h3>
                    <ul className="space-y-8">
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">1</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight font-mono">Frugality</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1 font-mono">Achieving O(1) space instead of O(N) demonstrates an obsession with resource preservation and reducing cloud compute costs.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">2</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight font-mono">Dive Deep</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1 font-mono">Understand boundary conditions. Ensure pointers never underflow (e.g., checking <code>p1&gt;= 0</code> before access).</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                    <BarChart3 className="text-slate-400 mb-3" size={48} />
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest text-center mb-6 font-mono">Execution Performance</p>
                    <div className="space-y-4 w-full">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase font-mono">Merge & Sort O(N log N)</span>
                                <span className="text-rose-500 font-black font-mono">~10,000 Ops</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-400 w-full" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase font-mono">Three-Pointer O(N)</span>
                                <span className="text-indigo-500 font-black font-mono">~400 Ops</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-[4%]" />
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|Arrays|sort|length)\b|\b\d+\b)/g).filter(Boolean);
  return (
    <div className={`flex relative z-10 min-h-[20.8px] transition-colors duration-300 ${active ? 'bg-blue-500/10 font-bold' : ''}`}>
      <span className="w-10 text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 font-mono text-[11px] select-none shrink-0">{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean', 'void'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['Arrays', 'sort', 'length', 'String'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-rose-400 font-bold">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

const TopicButton: React.FC<{ active: boolean; onClick: () => void; title: string; desc: string }> = ({ active, onClick, title, desc }) => (
  <button onClick={onClick} className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group ${active ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-100' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
    <div className={`font-black uppercase tracking-tight text-sm ${active ? 'text-blue-800' : 'text-slate-700 group-hover:text-blue-700'}`}>{title}</div>
    <div className={`text-[10px] font-bold mt-1 ${active ? 'text-blue-600' : 'text-slate-400'}`}>{desc}</div>
  </button>
);

export default MergeSortedArrayVisualizer;
