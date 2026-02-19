
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
  Plus,
  ArrowRightLeft,
  ListOrdered,
  Ghost
} from 'lucide-react';

const APPROACHES = {
  optimal: {
    id: 'optimal',
    title: '1. Two-Pointer',
    subtitle: 'Optimal O(N²)',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N²) | Space: O(log N) for sort',
    code: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int lo = i + 1, hi = nums.length - 1;
            while (lo < hi) {
                int sum = nums[i] + nums[lo] + nums[hi];
                if (sum < 0) {
                    lo++;
                } else if (sum > 0) {
                    hi--;
                } else {
                    res.add(Arrays.asList(nums[i], nums[lo], nums[hi]));
                    while (lo < hi && nums[lo] == nums[lo + 1]) lo++;
                    while (lo < hi && nums[hi] == nums[hi - 1]) hi--;
                    lo++; hi--;
                }
            }
        }
        return res;
    }
}`,
    explanation: "The standard O(N²) solution. By sorting the array, we can iterate through each number and use the Two-Pointer technique (converging from ends) to find pairs that sum to its negative. Handling duplicates is crucial for uniqueness."
  },
  brute: {
    id: 'brute',
    title: '2. Brute Force',
    subtitle: 'Triple Nested Loop',
    icon: <AlertCircle size={16} />,
    complexity: 'Time: O(N³) | Space: O(NK)',
    code: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Set<List<Integer>> res = new HashSet<>();
        Arrays.sort(nums);
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                for (int k = j + 1; k < n; k++) {
                    if (nums[i] + nums[j] + nums[k] == 0) {
                        res.add(Arrays.asList(nums[i], nums[j], nums[k]));
                    }
                }
            }
        }
        return new ArrayList<>(res);
    }
}`,
    explanation: "Checks every possible combination of three numbers. To avoid duplicates in the result, we either use a Set or sort the array and skip duplicates manually. O(N³) is too slow for most interview constraints."
  }
};

const ThreeSumVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproach, setSelectedApproach] = useState<'optimal' | 'brute'>('optimal');
  const [numsInput, setNumsInput] = useState("-1,0,1,2,-1,-4");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const nums = useMemo(() => {
    const arr = numsInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    return [...arr].sort((a, b) => a - b);
  }, [numsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = nums.length;
    const res: number[][] = [];

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ 
        phase, 
        description: desc, 
        line, 
        state: { 
          nums: [...nums],
          res: JSON.parse(JSON.stringify(res)),
          i: -1,
          lo: -1,
          hi: -1,
          sum: null,
          found: false,
          skip: false,
          ...state 
        } 
      });
    };

    if (selectedApproach === 'optimal') {
      addStep("Sorting", "Sort array to use two-pointer logic and skip duplicates efficiently.", 3, {});
      addStep("Initialization", "Create a result list to store unique triplets.", 4, {});

      for (let i = 0; i < n - 2; i++) {
        addStep("Outer Loop", `Fixing nums[i] at index ${i} (Value: ${nums[i]}).`, 5, { i });
        
        if (i > 0 && nums[i] === nums[i - 1]) {
          addStep("Skip Duplicate", `nums[i] (${nums[i]}) is same as nums[i-1]. Skipping to avoid duplicate triplets.`, 6, { i, skip: true });
          continue;
        }

        let lo = i + 1, hi = n - 1;
        addStep("Pointer Setup", `Initialize pointers: lo=${lo} (Value: ${nums[lo]}), hi=${hi} (Value: ${nums[hi]}).`, 7, { i, lo, hi });

        while (lo < hi) {
          const sum = nums[i] + nums[lo] + nums[hi];
          addStep("Calculate Sum", `Testing triplet: ${nums[i]} + ${nums[lo]} + ${nums[hi]} = ${sum}.`, 9, { i, lo, hi, sum });

          if (sum < 0) {
            addStep("Sum Too Low", `Sum ${sum} < 0. Moving lo pointer forward to increase sum.`, 11, { i, lo, hi, sum });
            lo++;
          } else if (sum > 0) {
            addStep("Sum Too High", `Sum ${sum} > 0. Moving hi pointer backward to decrease sum.`, 13, { i, lo, hi, sum });
            hi--;
          } else {
            const triplet = [nums[i], nums[lo], nums[hi]];
            res.push(triplet);
            addStep("Found Triplet!", `Sum is exactly 0! Adding [${triplet.join(', ')}] to results.`, 15, { i, lo, hi, sum, found: true });
            
            // Skip duplicates for lo
            while (lo < hi && nums[lo] === nums[lo + 1]) {
              addStep("Skip Lo Duplicate", `Next nums[lo] is also ${nums[lo]}. Skipping...`, 16, { i, lo, hi, sum });
              lo++;
            }
            // Skip duplicates for hi
            while (lo < hi && nums[hi] === nums[hi - 1]) {
              addStep("Skip Hi Duplicate", `Next nums[hi] is also ${nums[hi]}. Skipping...`, 17, { i, lo, hi, sum });
              hi--;
            }
            
            lo++; hi--;
            if (lo < hi) {
              addStep("Continue Search", "Moving both pointers inward to look for next potential sum.", 18, { i, lo, hi });
            }
          }
        }
      }
      addStep("Conclusion", `Traversal complete. Found ${res.length} unique triplets.`, 22, { finished: true });

    } else {
      // Brute Force Trace
      addStep("Initialization", "Create a Set to track uniqueness of triplets.", 3, {});
      addStep("Sorting", "Sorting input to ensure consistent triplet representation [a, b, c] where a <= b <= c.", 4, {});
      
      for (let i = 0; i < n; i++) {
        addStep("Outer Loop", `Scanning i=${i}`, 6, { i });
        for (let j = i + 1; j < n; j++) {
          addStep("Middle Loop", `Scanning j=${j}`, 7, { i, j });
          for (let k = j + 1; k < n; k++) {
            const sum = nums[i] + nums[j] + nums[k];
            addStep("Checking Triplet", `${nums[i]} + ${nums[j]} + ${nums[k]} = ${sum}`, 9, { i, j, k, sum });
            if (sum === 0) {
              const triplet = [nums[i], nums[j], nums[k]];
              const alreadyExists = res.some(t => t[0] === triplet[0] && t[1] === triplet[1] && t[2] === triplet[2]);
              if (!alreadyExists) res.push(triplet);
              addStep("Found Result", alreadyExists ? "Found sum 0, but triplet is already in results." : "Found new triplet! Adding to set.", 10, { i, j, k, sum, found: !alreadyExists });
            }
          }
        }
      }
      addStep("Finished", "Returning unique list from set.", 16, { finished: true });
    }

    return steps;
  }, [nums, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(APPROACHES[selectedApproach].code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0];
  const { i: activeI, lo: activeLo, hi: activeHi, j: activeJ, k: activeK, sum, found, finished, skip, res: currentResults } = cur.state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center">
                <Hash className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">3Sum Challenge</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-widest font-black text-[10px]">Sorting + Two Pointers</span>
                <span>LC 15 • Medium</span>
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
                <h2 className="text-3xl font-black text-slate-900 mb-6 font-mono tracking-tighter text-indigo-600">15. 3Sum</h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-lg leading-relaxed">
                  <p>Given an integer array <code>nums</code>, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, and <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>.</p>
                  <p className="font-bold text-slate-900 italic">Notice that the solution set must not contain duplicate triplets.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <ListOrdered size={16}/> Examples:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono shadow-inner">
                        <p className="mb-2"><span className="text-slate-400 font-bold">Input:</span> nums = [-1,0,1,2,-1,-4]</p>
                        <p className="mb-2"><span className="text-slate-400 font-bold">Output:</span> [[-1,-1,2],[-1,0,1]]</p>
                        <p className="text-[10px] text-slate-400 mt-4 leading-relaxed italic">Explanation: 
                          <br/>The distinct triplets are [-1,0,1] and [-1,-1,2].
                          <br/>Notice that the order of the output and the order of the triplets does not matter.
                        </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono shadow-inner">
                        <p className="mb-2"><span className="text-slate-400 font-bold">Input:</span> nums = [0,1,1]</p>
                        <p className="mb-2"><span className="text-slate-400 font-bold">Output:</span> []</p>
                        <p className="text-[10px] text-slate-400 mt-4 leading-relaxed italic">Explanation: The only possible triplet does not sum up to 0.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <AlertCircle size={14} /> Constraints:
                </h3>
                <ul className="list-disc list-inside space-y-3 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">3 {'<='} nums.length {'<='} 3000</code></li>
                  <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">-10<sup>5</sup> {'<='} nums[i] {'<='} 10<sup>5</sup></code></li>
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
                    <span className="font-bold uppercase tracking-tight">Solution.java</span>
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
                    <h4 className="text-sm font-black uppercase tracking-widest">Logic Insight</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">{APPROACHES[selectedApproach].explanation}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-indigo-600 uppercase block pl-1 tracking-widest font-mono">Input Array (nums)</label>
                    <input value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
                </div>
                <div className="flex gap-3">
                  <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <ChevronLeft size={16}/> Prev
                  </button>
                  <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                    Next Action <ChevronRight size={16}/>
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-3xl p-7 shadow-2xl border border-slate-800 min-h-[160px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    <ArrowRightLeft size={100}/>
                </div>
                <div className="flex items-center gap-2 mb-3">
                   <Activity size={14} className="text-indigo-400"/>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono tracking-tighter">Simulation Context</span>
                </div>
                <div className="text-lg font-black tracking-tight mb-2 uppercase font-mono flex items-center gap-3">
                    {skip && <span className="bg-amber-500 text-white px-2 py-0.5 rounded text-[10px] animate-pulse">SKIP</span>}
                    {found && <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] animate-pulse">RESULT!</span>}
                    {cur.phase}
                </div>
                <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3">{cur.description}</p>
              </div>

              {/* Simulation Arena */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[500px] relative flex flex-col justify-between overflow-hidden shadow-inner transition-all duration-500">
                
                {/* State Variables Dashboard */}
                {!finished && (
                  <div className="w-full grid grid-cols-2 gap-4 z-10 mb-8">
                     <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex flex-col items-center justify-center shadow-sm relative overflow-hidden group">
                        <span className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest font-mono">Current Sum</span>
                        <div className={`text-4xl font-black font-mono ${sum === 0 ? 'text-emerald-600 animate-bounce' : 'text-indigo-600'}`}>{sum ?? '---'}</div>
                        {sum !== null && <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">Goal: 0</span>}
                     </div>
                     <div className="bg-indigo-50/50 rounded-3xl p-5 border border-indigo-100 flex flex-col items-center justify-center shadow-sm">
                        <span className="text-[9px] font-black text-indigo-400 uppercase mb-1 tracking-widest font-mono">Unique Pairs Found</span>
                        <div className={`text-4xl font-black font-mono text-slate-800`}>
                            {currentResults?.length || 0}
                        </div>
                     </div>
                  </div>
                )}

                {/* Main Visual: Sorted Array with Pointers */}
                <div className="flex-1 flex flex-col items-center justify-center gap-10">
                    <div className="flex flex-wrap items-center gap-2 w-full justify-center px-4">
                        {nums.map((val, idx) => {
                            const isI = activeI === idx;
                            const isLo = activeLo === idx || activeJ === idx;
                            const isHi = activeHi === idx || activeK === idx;
                            const isPart = isI || isLo || isHi;

                            let bg = "bg-white";
                            let border = "border-slate-100";
                            let text = "text-slate-300";

                            if (isPart) {
                              if (sum === 0) {
                                bg = "bg-emerald-500";
                                text = "text-white font-black";
                                border = "border-emerald-600";
                              } else {
                                bg = "bg-indigo-600";
                                text = "text-white font-black";
                                border = "border-indigo-700";
                              }
                            }

                            return (
                                <div key={idx} className={`w-10 h-12 border-2 rounded-xl flex items-center justify-center font-mono text-sm transition-all duration-300 relative ${bg} ${border} ${text} ${isPart && !finished ? 'scale-110 shadow-lg' : ''}`}>
                                    {val}
                                    {isI && !finished && <div className="absolute -top-7 text-indigo-500 font-black text-[9px] flex flex-col items-center animate-bounce"><span>I</span><ArrowDown size={10}/></div>}
                                    {isLo && !finished && <div className="absolute -bottom-7 text-blue-500 font-black text-[9px] flex flex-col items-center animate-bounce"><ArrowDown className="rotate-180" size={10}/><span>LO</span></div>}
                                    {isHi && !finished && <div className="absolute -bottom-7 text-purple-500 font-black text-[9px] flex flex-col items-center animate-bounce"><ArrowDown className="rotate-180" size={10}/><span>HI</span></div>}
                                </div>
                            );
                        })}
                    </div>

                    {/* Result Buckets */}
                    <div className="w-full space-y-3">
                         <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest font-mono">Found Triplets (Unique Set)</span>
                        </div>
                        <div className="flex flex-wrap gap-2 min-h-[50px] p-4 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                            {currentResults?.map((triplet: number[], tIdx: number) => (
                                <div key={tIdx} className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 rounded-xl text-xs font-black font-mono shadow-sm animate-in zoom-in">
                                    [{triplet.join(', ')}]
                                </div>
                            ))}
                            {(!currentResults || currentResults.length === 0) && (
                                <div className="w-full flex items-center justify-center text-slate-300 gap-2 opacity-50">
                                    <Ghost size={16}/>
                                    <span className="text-[10px] font-black uppercase tracking-widest">No triplets identified yet</span>
                                </div>
                            )}
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
                        <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] block mb-2 font-mono">Validation Result</span>
                        <div className="text-5xl font-black text-slate-900 tracking-tighter tabular-nums drop-shadow-sm">{currentResults?.length || 0}</div>
                        <div className="mt-4 px-6 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest font-mono">
                           Unique Triplets Found
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
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-10 font-mono">
            <div className="max-w-4xl space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <BookOpen className="text-indigo-600"/> The Mechanics of 3Sum
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-indigo-100 pl-6">
                3Sum is a foundational problem that combines <b>Sorting</b> with the <b>Two-Pointer technique</b> to solve a combinatorial search in O(N²) time instead of the naive O(N³).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-indigo-900 flex items-center gap-2 uppercase tracking-tighter text-sm"><Layers size={18}/> Problem Reduction</h3>
                        <p className="text-xs text-indigo-700 leading-relaxed">
                          3Sum can be viewed as: For every number <code>x</code> in the array, find all pairs <code>(y, z)</code> such that <code>y + z = -x</code>.
                        </p>
                        <p className="text-[10px] text-indigo-500 uppercase font-black">Steps:</p>
                        <ul className="text-[10px] text-indigo-800 space-y-2 list-decimal list-inside">
                           <li>Sort the array (O(N log N)).</li>
                           <li>Fix one element <code>i</code>.</li>
                           <li>Search for the other two using <b>Two Sum II</b> logic (Two Pointers).</li>
                        </ul>
                    </div>
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm"><X size={18}/> Handling Duplicates</h3>
                        <p className="text-xs text-amber-700 leading-relaxed italic border-l-2 border-amber-200 pl-4">
                          "The hardest part is not finding the sum, but avoiding the same triplets."
                        </p>
                        <p className="text-xs text-amber-700 leading-relaxed">
                          To avoid duplicates without a heavy <code>Set</code>:
                          <br/>1. Skip <code>i</code> if <code>nums[i] == nums[i-1]</code>.
                          <br/>2. After finding a triplet, skip all identical <code>lo</code> and <code>hi</code> values.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Database size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <BarChart3 size={32} className="text-indigo-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Asymptotic Breakdown</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                      <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700 backdrop-blur-sm">
                          <span className="text-[10px] text-slate-500 block mb-1 uppercase font-black">Time Complexity</span>
                          <div className="font-mono text-2xl font-black text-indigo-400">O(N²)</div>
                          <p className="text-[9px] text-slate-500 mt-2">N iterations (outer) * N pointers (inner).</p>
                      </div>
                      <div className="p-5 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-500/20">
                          <span className="text-[10px] text-indigo-200 block mb-1 uppercase font-black">Space Complexity</span>
                          <div className="font-mono text-2xl font-black">O(1)</div>
                          <p className="text-[9px] text-indigo-200 mt-2">Assuming sort space is ignored.</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed italic relative z-10">
                      "In an interview, always mention that sorting helps establish a monotonic relationship, which is the prerequisite for the Two-Pointer optimization."
                    </p>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500 font-mono">
            <div className="space-y-6">
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                        <Trophy size={140} />
                    </div>
                    <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-amber-400 relative z-10 uppercase tracking-tight">
                        <Trophy size={24} /> Senior Interview Defense
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                        "Finding unique triplets is a classic problem of reducing search space. I implemented an O(N²) solution that leverages the two-pointer property of sorted arrays. By fixing the first element and using a converging scan for the remaining two, we eliminate the O(N³) complexity of brute force. To handle the uniqueness constraint, I utilize a greedy duplicate-skipping strategy at each pointer transition, ensuring zero redundant triplets are recorded without the overhead of an explicit HashSet."
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter">
                        <MessageSquare className="text-indigo-500" size={20} /> Candidate Q&A
                    </h3>
                    <div className="space-y-4">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter">"What if we can't sort the array?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                "If sorting is forbidden (e.g. for preserving input index order), we could use a <b>HashSet</b> approach for each outer iteration, similar to Two Sum with a Map. This remains O(N²) time but consumes O(N) auxiliary space."
                            </p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter">"What are the edge cases?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                "1. Array size less than 3 (return empty list).<br/>
                                 2. All zeros array (one result [0,0,0]).<br/>
                                 3. All positive or all negative values (no results).<br/>
                                 4. Highly redundant values (e.g. [0,0,0,0,0])."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-[2rem] p-8 shadow-sm">
                    <h3 className="text-lg font-black text-indigo-900 mb-6 uppercase tracking-widest flex items-center gap-2">
                        <AlertCircle size={20}/> Amazon Leadership Check
                    </h3>
                    <ul className="space-y-8">
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm">1</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight">Frugality</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1">Discuss why the sorting approach is more 'frugal' regarding memory compared to a HashSet approach, especially in constrained systems.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm">2</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight">Bias for Action</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1">Implement the working code first. Don't prematurely optimize if the interviewer asks for a quick prototype.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                    <BarChart3 className="text-slate-400 mb-3" size={48} />
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest text-center mb-6">Algorithm Scaling</p>
                    <div className="space-y-4 w-full">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase">Brute Force O(N³)</span>
                                <span className="text-rose-500 font-black">Exponential Growth</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-400 w-full" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase">Two-Pointer O(N²)</span>
                                <span className="text-indigo-500 font-black">Scalable Standard</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-[5%]" />
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
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|char|List|ArrayList|Arrays|asList|sort|length|continue|add)\b|\b\d+\b)/g).filter(Boolean);
  return (
    <div className={`flex relative z-10 min-h-[20.8px] transition-colors duration-300 ${active ? 'bg-indigo-500/10 font-bold' : ''}`}>
      <span className="w-10 text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 font-mono text-[11px] select-none shrink-0">{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for', 'continue'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean', 'void'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['List', 'ArrayList', 'Arrays', 'String'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['asList', 'sort', 'length', 'add'].includes(part)) return <span key={i} className="text-blue-400">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-rose-400 font-bold">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default ThreeSumVisualizer;
