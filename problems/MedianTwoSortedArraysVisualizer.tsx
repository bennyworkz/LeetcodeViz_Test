
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
  Maximize2,
  Binary,
  Divide,
  UnfoldVertical,
  Minus
} from 'lucide-react';

const APPROACHES = {
  optimal: {
    id: 'optimal',
    title: '1. Binary Search',
    subtitle: 'Optimal O(log(min(M,N)))',
    icon: <Zap size={16} />,
    complexity: 'Time: O(log(min(M,N))) | Space: O(1)',
    code: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
        int x = nums1.length, y = nums2.length;
        int low = 0, high = x;
        while (low <= high) {
            int partitionX = (low + high) / 2;
            int partitionY = (x + y + 1) / 2 - partitionX;
            int maxLeftX = (partitionX == 0) ? Integer.MIN_VALUE : nums1[partitionX - 1];
            int minRightX = (partitionX == x) ? Integer.MAX_VALUE : nums1[partitionX];
            int maxLeftY = (partitionY == 0) ? Integer.MIN_VALUE : nums2[partitionY - 1];
            int minRightY = (partitionY == y) ? Integer.MAX_VALUE : nums2[partitionY];
            if (maxLeftX <= minRightY && maxLeftY <= minRightX) {
                if ((x + y) % 2 == 0) {
                    return ((double)Math.max(maxLeftX, maxLeftY) + Math.min(minRightX, minRightY)) / 2;
                } else {
                    return (double)Math.max(maxLeftX, maxLeftY);
                }
            } else if (maxLeftX > minRightY) {
                high = partitionX - 1;
            } else {
                low = partitionX + 1;
            }
        }
        return 0.0;
    }
}`,
    explanation: "We perform a binary search on the partition point of the smaller array. The goal is to find a split such that all elements on the left side are smaller than all elements on the right side. This effectively finds the median without merging."
  },
  brute: {
    id: 'brute',
    title: '2. Merge & Find',
    subtitle: 'Linear O(M+N)',
    icon: <Layers size={16} />,
    complexity: 'Time: O(M+N) | Space: O(M+N)',
    code: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        int m = nums1.length, n = nums2.length;
        int[] merged = new int[m + n];
        int i = 0, j = 0, k = 0;
        while (i < m && j < n) {
            if (nums1[i] < nums2[j]) merged[k++] = nums1[i++];
            else merged[k++] = nums2[j++];
        }
        while (i < m) merged[k++] = nums1[i++];
        while (j < n) merged[k++] = nums2[j++];
        
        int total = m + n;
        if (total % 2 == 0) {
            return (merged[total/2 - 1] + merged[total/2]) / 2.0;
        } else {
            return merged[total/2];
        }
    }
}`,
    explanation: "Merge both arrays into one sorted array using the two-pointer merge strategy (like Merge Sort). Then simply return the middle element(s). Simple, but fails the logarithmic time requirement."
  }
};

const MedianTwoSortedArraysVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproach, setSelectedApproach] = useState<'optimal' | 'brute'>('optimal');
  const [nums1Input, setNums1Input] = useState("1,3");
  const [nums2Input, setNums2Input] = useState("2");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const nums1 = useMemo(() => nums1Input.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)), [nums1Input]);
  const nums2 = useMemo(() => nums2Input.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)), [nums2Input]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ 
        phase, 
        description: desc, 
        line, 
        state: { 
          n1: [...nums1],
          n2: [...nums2],
          ...state 
        } 
      });
    };

    if (selectedApproach === 'optimal') {
      let a = [...nums1];
      let b = [...nums2];
      
      addStep("Array Swap Check", "First, ensure nums1 is the shorter array to optimize the search space.", 3, { isSwapped: a.length > b.length });
      if (a.length > b.length) {
        [a, b] = [b, a];
      }

      const x = a.length;
      const y = b.length;
      addStep("Setup", `x=${x}, y=${y}. Initializing binary search boundaries for the shorter array.`, 4, { x, y });
      
      let low = 0, high = x;
      addStep("Bounds Init", `low=${low}, high=${high}.`, 5, { low, high, x, y });

      while (low <= high) {
        addStep("Binary Loop", `Checking boundaries: low(${low}) <= high(${high}).`, 6, { low, high, x, y });
        
        const partitionX = Math.floor((low + high) / 2);
        addStep("Partition X", `Calculate partition for X: (low + high) / 2 = ${partitionX}.`, 7, { low, high, x, y, pX: partitionX });
        
        const partitionY = Math.floor((x + y + 1) / 2) - partitionX;
        addStep("Partition Y", `Calculate partition for Y: (x + y + 1) / 2 - pX = ${partitionY}.`, 8, { low, high, x, y, pX: partitionX, pY: partitionY });

        const maxLeftX = (partitionX === 0) ? -Infinity : a[partitionX - 1];
        addStep("Boundaries", `maxLeftX: ${partitionX === 0 ? '-∞' : `a[${partitionX - 1}] (${maxLeftX})`}.`, 9, { low, high, pX: partitionX, pY: partitionY, maxLX: maxLeftX });
        
        const minRightX = (partitionX === x) ? Infinity : a[partitionX];
        addStep("Boundaries", `minRightX: ${partitionX === x ? '+∞' : `a[${partitionX}] (${minRightX})`}.`, 10, { low, high, pX: partitionX, pY: partitionY, maxLX: maxLeftX, minRX: minRightX });
        
        const maxLeftY = (partitionY === 0) ? -Infinity : b[partitionY - 1];
        addStep("Boundaries", `maxLeftY: ${partitionY === 0 ? '-∞' : `b[${partitionY - 1}] (${maxLeftY})`}.`, 11, { low, high, pX: partitionX, pY: partitionY, maxLX: maxLeftX, minRX: minRightX, maxLY: maxLeftY });
        
        const minRightY = (partitionY === y) ? Infinity : b[partitionY];
        addStep("Boundaries", `minRightY: ${partitionY === y ? '+∞' : `b[${partitionY}] (${minRightY})`}.`, 12, { low, high, pX: partitionX, pY: partitionY, maxLX: maxLeftX, minRX: minRightX, maxLY: maxLeftY, minRY: minRightY });

        addStep("Validation Check", `Check: maxLeftX (${maxLeftX}) <= minRightY (${minRightY}) AND maxLeftY (${maxLeftY}) <= minRightX (${minRightX})?`, 13, { low, high, pX: partitionX, pY: partitionY, maxLX: maxLeftX, minRX: minRightX, maxLY: maxLeftY, minRY: minRightY });

        if (maxLeftX <= minRightY && maxLeftY <= minRightX) {
          addStep("Found Partition", "Valid partition found! Determining if total length is even or odd.", 14, { low, high, pX: partitionX, pY: partitionY, maxLX: maxLeftX, minRX: minRightX, maxLY: maxLeftY, minRY: minRightY });
          if ((x + y) % 2 === 0) {
            const med = (Math.max(maxLeftX, maxLeftY) + Math.min(minRightX, minRightY)) / 2;
            addStep("Calculate Median", `Even total length: average of maxLeft and minRight: (${Math.max(maxLeftX, maxLeftY)} + ${Math.min(minRightX, minRightY)}) / 2 = ${med}.`, 15, { finished: true, result: med });
          } else {
            const med = Math.max(maxLeftX, maxLeftY);
            addStep("Calculate Median", `Odd total length: max element on the left side is ${med}.`, 17, { finished: true, result: med });
          }
          return steps;
        } else if (maxLeftX > minRightY) {
          addStep("Adjust Bounds", `maxLeftX (${maxLeftX}) > minRightY (${minRightY}). Partition X is too far right. Moving high pointer left.`, 20, { low, high, pX: partitionX, pY: partitionY });
          high = partitionX - 1;
        } else {
          addStep("Adjust Bounds", `maxLeftY (${maxLeftY}) > minRightX (${minRightX}). Partition X is too far left. Moving low pointer right.`, 22, { low, high, pX: partitionX, pY: partitionY });
          low = partitionX + 1;
        }
      }
    } else {
      // Brute Force Trace
      const m = nums1.length, n = nums2.length;
      const merged: number[] = [];
      addStep("Initialization", `m=${m}, n=${n}. Initializing merged array and pointers.`, 3, { merged: [] });
      
      let i = 0, j = 0;
      while (i < m && j < n) {
        addStep("Merge Loop", `Comparing nums1[${i}] (${nums1[i]}) and nums2[${j}] (${nums2[j]}).`, 6, { i, j, merged: [...merged] });
        if (nums1[i] < nums2[j]) {
          addStep("Merge Action", `nums1[${i}] is smaller. Adding to result.`, 7, { i, j, merged: [...merged, nums1[i]] });
          merged.push(nums1[i++]);
        } else {
          addStep("Merge Action", `nums2[${j}] is smaller or equal. Adding to result.`, 8, { i, j, merged: [...merged, nums2[j]] });
          merged.push(nums2[j++]);
        }
      }
      while (i < m) {
        addStep("Clean Up L1", `Adding remaining nums1[${i}] to result.`, 10, { i, j, merged: [...merged, nums1[i]] });
        merged.push(nums1[i++]);
      }
      while (j < n) {
        addStep("Clean Up L2", `Adding remaining nums2[${j}] to result.`, 11, { i, j, merged: [...merged, nums2[j]] });
        merged.push(nums2[j++]);
      }
      
      const total = m + n;
      addStep("Result Calc", `Total length is ${total}.`, 13, { merged: [...merged] });
      if (total % 2 === 0) {
        const res = (merged[Math.floor(total/2) - 1] + merged[Math.floor(total/2)]) / 2.0;
        addStep("Final Result", `Even length: avg of ${merged[total/2-1]} and ${merged[total/2]} is ${res}.`, 15, { merged: [...merged], finished: true, result: res });
      } else {
        const res = merged[Math.floor(total/2)];
        addStep("Final Result", `Odd length: middle element is ${res}.`, 17, { merged: [...merged], finished: true, result: res });
      }
    }

    return steps;
  }, [nums1, nums2, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(APPROACHES[selectedApproach].code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0];
  const { low, high, pX, pY, maxLX, minRX, maxLY, minRY, finished, result, merged, i, j } = cur.state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center">
                <Binary className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Median of Two Sorted Arrays</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-widest font-black text-[10px]">Hardest Array Problem</span>
                <span>LC 4 • Hard</span>
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
                <h2 className="text-3xl font-black text-slate-900 mb-6 font-mono tracking-tighter text-indigo-600">4. Median of Two Sorted Arrays</h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-lg leading-relaxed">
                  <p>Given two sorted arrays <code>nums1</code> and <code>nums2</code> of size <code>m</code> and <code>n</code> respectively, return <strong>the median</strong> of the two sorted arrays.</p>
                  <p className="font-bold text-slate-900 underline decoration-indigo-200 decoration-4">The overall run time complexity should be <code>O(log (m+n))</code>.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Hash size={16}/> Examples:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 font-mono text-sm shadow-inner">
                        <p className="mb-1"><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Input:</span> nums1 = [1,3], nums2 = [2]</p>
                        <p className="mb-2"><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Output:</span> 2.00000</p>
                        <p className="text-[10px] text-slate-500 italic">Explanation: merged array = [1,2,3] and median is 2.</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 font-mono text-sm shadow-inner">
                        <p className="mb-1"><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Input:</span> nums1 = [1,2], nums2 = [3,4]</p>
                        <p className="mb-2"><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Output:</span> 2.50000</p>
                        <p className="text-[10px] text-slate-500 italic">Explanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <AlertCircle size={14} /> Constraints:
                </h3>
                <ul className="list-disc list-inside space-y-3 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <li><code>nums1.length == m</code></li>
                  <li><code>nums2.length == n</code></li>
                  <li><code>0 &lt;= m, n &lt;= 1000</code></li>
                  <li><code>1 &lt;= m + n &lt;= 2000</code></li>
                  <li><code>-10<sup>6</sup> &lt;= nums1[i], nums2[i] &lt;= 10<sup>6</sup></code></li>
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
                  <button key={key} onClick={() => { setSelectedApproach(key); setCurrentStep(0); }} className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-indigo-600 text-white shadow-lg' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}>
                    <span className="text-xs font-black uppercase tracking-tight">{APPROACHES[key].title}</span>
                    <span className={`text-[10px] opacity-70 ${selectedApproach === key ? 'text-white' : 'text-slate-400'}`}>
                      {APPROACHES[key].complexity}
                    </span>
                  </button>
                ))}
              </div>

              <div className="bg-[#0f172a] rounded-3xl h-[520px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Code2 size={14} className="text-indigo-400" />
                    <span className="font-bold uppercase tracking-tight">MedianFinder.java</span>
                  </div>
                  <button onClick={handleCopy} className="hover:text-white transition-colors">
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="p-6 font-mono text-[13px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="absolute left-0 right-0 bg-indigo-500/15 border-l-4 border-indigo-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${(cur.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} />
                    {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} />
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-indigo-600">
                    <Info size={18} />
                    <h4 className="text-sm font-black uppercase tracking-widest font-mono">Algorithm Note</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">{APPROACHES[selectedApproach].explanation}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-blue-600 uppercase block pl-1 tracking-widest font-mono">nums1 (Sorted CSV)</label>
                        <input value={nums1Input} onChange={(e) => { setNums1Input(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-indigo-600 uppercase block pl-1 tracking-widest font-mono">nums2 (Sorted CSV)</label>
                        <input value={nums2Input} onChange={(e) => { setNums2Input(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
                    </div>
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
                    <Binary size={100}/>
                </div>
                <div className="flex items-center gap-2 mb-3">
                   <Activity size={14} className="text-indigo-400"/>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono tracking-tighter">Execution Details</span>
                </div>
                <div className="text-lg font-black tracking-tight mb-2 uppercase font-mono flex items-center gap-3">
                    {cur.phase}
                </div>
                <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3">{cur.description}</p>
              </div>

              {/* Simulation Arena */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[500px] relative flex flex-col justify-between overflow-hidden shadow-inner transition-all duration-500">
                
                {/* State Variable Dashboard */}
                {!finished && selectedApproach === 'optimal' && (
                  <div className="w-full grid grid-cols-2 gap-4 z-10 mb-8">
                     <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex flex-col items-center justify-center shadow-sm relative overflow-hidden group">
                        <span className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest font-mono">Boundaries</span>
                        <div className="text-xl font-black text-indigo-600 font-mono">low:{low} high:{high}</div>
                     </div>
                     <div className="bg-indigo-50/50 rounded-3xl p-5 border border-indigo-100 flex flex-col items-center justify-center shadow-sm">
                        <span className="text-[9px] font-black text-indigo-400 uppercase mb-1 tracking-widest font-mono">Partitions</span>
                        <div className="text-xl font-black text-slate-800 font-mono">pX:{pX ?? '-'} pY:{pY ?? '-'}</div>
                     </div>
                  </div>
                )}

                {/* Main Visuals: Array Rows or Merged Array */}
                <div className="flex-1 flex flex-col gap-10 justify-center">
                    {selectedApproach === 'optimal' ? (
                        <>
                            <div className="space-y-4">
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest px-1">Array nums1 (x)</span>
                                <div className="flex gap-2">
                                    {nums1.map((val, idx) => {
                                        const isLeft = pX !== undefined && idx < pX;
                                        const isRight = pX !== undefined && idx >= pX;
                                        return (
                                            <div key={idx} className="flex flex-col items-center flex-1 relative">
                                                <div className={`w-full h-12 border-2 rounded-xl flex items-center justify-center font-mono font-black text-sm transition-all duration-300 ${isLeft ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                                                    {val}
                                                </div>
                                                {pX === idx && <div className="absolute -left-1 h-full w-1 bg-rose-500 z-20 rounded-full" />}
                                            </div>
                                        );
                                    })}
                                    {pX === nums1.length && <div className="h-12 w-1 bg-rose-500 z-20 rounded-full" />}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest px-1">Array nums2 (y)</span>
                                <div className="flex gap-2">
                                    {nums2.map((val, idx) => {
                                        const isLeft = pY !== undefined && idx < pY;
                                        return (
                                            <div key={idx} className="flex flex-col items-center flex-1 relative">
                                                <div className={`w-full h-12 border-2 rounded-xl flex items-center justify-center font-mono font-black text-sm transition-all duration-300 ${isLeft ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                                                    {val}
                                                </div>
                                                {pY === idx && <div className="absolute -left-1 h-full w-1 bg-rose-500 z-20 rounded-full" />}
                                            </div>
                                        );
                                    })}
                                    {pY === nums2.length && <div className="h-12 w-1 bg-rose-500 z-20 rounded-full" />}
                                </div>
                            </div>

                            {/* Verification Block */}
                            {!finished && pX !== undefined && pY !== undefined && (
                                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase"><span>maxLX</span><span>minRY</span></div>
                                        <div className={`p-2 border rounded-xl flex justify-center items-center font-mono font-bold ${maxLX <= minRY ? 'bg-green-50 border-green-200 text-green-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                                            {maxLX === -Infinity ? '-∞' : maxLX} &le; {minRY === Infinity ? '∞' : minRY}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase"><span>maxLY</span><span>minRX</span></div>
                                        <div className={`p-2 border rounded-xl flex justify-center items-center font-mono font-bold ${maxLY <= minRX ? 'bg-green-50 border-green-200 text-green-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                                            {maxLY === -Infinity ? '-∞' : maxLY} &le; {minRX === Infinity ? '∞' : minRX}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="space-y-4 px-2">
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><Database size={12}/> Merged Progress</span>
                            <div className="flex flex-wrap gap-2 p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl min-h-[100px]">
                                {merged?.map((m: number, idx: number) => (
                                    <div key={idx} className="w-10 h-10 bg-white border border-indigo-200 text-indigo-700 rounded-lg flex items-center justify-center font-mono font-black text-xs shadow-sm animate-in zoom-in">
                                        {m}
                                    </div>
                                ))}
                                {(!merged || merged.length === 0) && <div className="text-xs text-slate-300 font-mono">Merging...</div>}
                            </div>
                        </div>
                    )}
                </div>

                {/* Final State Banner */}
                {finished && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-indigo-600/5 backdrop-blur-[4px] animate-in fade-in duration-1000">
                    <div className="bg-white border-2 border-indigo-100 px-12 py-10 rounded-[3.5rem] shadow-2xl flex flex-col items-center gap-6 transform -rotate-1 hover:rotate-0 transition-transform">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-xl mb-2">
                          <Check size={48} strokeWidth={3}/>
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] block mb-2 font-mono">Median Identified</span>
                        <div className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums drop-shadow-sm">{result.toFixed(2)}</div>
                        <div className="mt-4 px-6 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest font-mono shadow-sm">
                           Target Complexity O(log(min(M,N)))
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
                <BookOpen className="text-indigo-600"/> The Partitioning Principle
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed font-mono tracking-tight">
                Median is the element that splits a set into two equal-sized halves. To find the median of two sorted arrays, we don't need to merge them; we just need to find the correct <strong>split point</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-indigo-900 flex items-center gap-2 uppercase tracking-tighter text-sm font-mono"><UnfoldVertical size={18}/> The Split Rule</h3>
                        <p className="text-sm text-indigo-800 leading-relaxed italic border-l-2 border-indigo-200 pl-4">
                          "Divide and Conquer the Boundaries."
                        </p>
                        <p className="text-xs text-indigo-700 leading-relaxed font-mono">
                          If we split nums1 at index <code>i</code> and nums2 at index <code>j</code>, and total elements on the left match total elements on the right, we have a valid split if:<br/><br/>
                          1. <code>nums1[i-1] &le; nums2[j]</code><br/>
                          2. <code>nums2[j-1] &le; nums1[i]</code>
                        </p>
                    </div>
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm font-mono"><Calculator size={18}/> Handling Parity</h3>
                        <p className="text-sm text-amber-700 leading-relaxed font-mono">
                          - <strong>Even Length:</strong> The median is <code>(max(left) + min(right)) / 2</code>.<br/>
                          - <strong>Odd Length:</strong> The median is simply <code>max(left)</code>.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Binary size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <BarChart3 size={32} className="text-indigo-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs font-mono">Complexity Comparison</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                      <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700 backdrop-blur-sm">
                          <span className="text-[10px] text-slate-500 block mb-1 uppercase font-black font-mono">Standard Merge</span>
                          <div className="font-mono text-xl font-black text-indigo-400">O(M + N)</div>
                          <p className="text-[9px] text-slate-500 mt-2 font-mono uppercase tracking-tighter">Linear Search</p>
                      </div>
                      <div className="p-5 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-500/20">
                          <span className="text-[10px] text-indigo-200 block mb-1 uppercase font-black font-mono">Binary Partition</span>
                          <div className="font-mono text-xl font-black">O(log(min(M,N)))</div>
                          <p className="text-[9px] text-indigo-200 mt-2 font-mono uppercase tracking-tighter">Logarithmic Jump</p>
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                      <h4 className="text-[10px] font-black text-emerald-400 uppercase mb-1 flex items-center gap-2"><Zap size={12}/> Optimization Secret</h4>
                      <p className="text-[10px] text-slate-300 leading-relaxed font-mono">
                        Always perform the binary search on the <strong>shorter</strong> array. This guarantees the minimum number of steps and prevents index underflow in the dependent array calculation.
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
                        <Trophy size={24} /> Senior Interview Pitch
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10 font-mono">
                        "For calculating the median of two sorted arrays, I implement an O(log(min(m,n))) solution based on binary partitioning. While a merge-based approach is O(n), it fails to meet the theoretical logarithmic bound required for large-scale data processing. My approach treats the arrays as two parts of a whole, using binary search to find the perfect split point where every element in the combined left half is smaller than or equal to every element in the combined right half. This is space-optimal at O(1) and maximizes efficiency by focusing search effort on the shorter input array."
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter font-mono font-black tracking-tight">
                        <MessageSquare className="text-indigo-500" size={20} /> Candidate Q&A
                    </h3>
                    <div className="space-y-4">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-mono">"Why swap arrays at the start?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed font-mono">
                                "Binary search complexity is determined by the size of the search space. By selecting the shorter array, we minimize the number of iterations to log(min(m,n)). More importantly, it ensures that when calculating <code>partitionY</code>, we never get a negative index or an index beyond the bounds of nums2."
                            </p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-mono">"How do you handle Infinity?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed font-mono">
                                "We use <code>Integer.MIN_VALUE</code> and <code>Integer.MAX_VALUE</code> as 'sentinel' values to handle edge cases where a partition is at index 0 (everything on right) or at the end (everything on left). This simplifies our comparison logic and avoids complex nested if-statements."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-[2rem] p-8 shadow-sm">
                    <h3 className="text-lg font-black text-indigo-900 mb-6 uppercase tracking-widest flex items-center gap-2 font-mono">
                        <AlertCircle size={20}/> Leadership Principles
                    </h3>
                    <ul className="space-y-8">
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">1</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight font-mono">Invent and Simplify</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1 font-mono">By re-framing the median problem as a partitioning search, we simplify a complex O(N) problem into a sub-linear O(log N) one, saving massive compute resources at scale.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">2</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight font-mono">Deliver Results</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1 font-mono">Acknowledge that while binary search is harder to code, it is the only correct answer when performance is a critical success factor for the customer.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                    <Divide className="text-slate-400 mb-3" size={48} />
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest text-center mb-6 font-mono tracking-tighter">Scaling Profile</p>
                    <div className="space-y-4 w-full">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase font-mono">Linear Scan O(N)</span>
                                <span className="text-rose-500 font-black font-mono tracking-tighter">Heavy (10,000 items)</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-400 w-full" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase font-mono">Binary search O(log N)</span>
                                <span className="text-indigo-500 font-black font-mono tracking-tighter">Light (13 steps)</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-[1%]" />
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
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|double|void|String|boolean|new|this|for|char|Math|max|min|abs|length|Integer|MIN_VALUE|MAX_VALUE)\b|\b\d+\b)/g).filter(Boolean);
  return (
    <div className={`flex relative z-10 min-h-[20.8px] transition-colors duration-300 ${active ? 'bg-indigo-500/10 font-bold' : ''}`}>
      <span className="w-10 text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 font-mono text-[11px] select-none shrink-0">{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean', 'void', 'double'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['Integer', 'Math', 'String'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['max', 'min', 'length', 'abs', 'MIN_VALUE', 'MAX_VALUE'].includes(part)) return <span key={i} className="text-blue-400">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-rose-400 font-bold">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default MedianTwoSortedArraysVisualizer;
