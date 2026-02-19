
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
  List,
  GitMerge,
  Scale,
  Binary,
  Shapes,
  Box,
  CornerDownRight,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';

const APPROACHES = {
  heap: {
    id: 'heap',
    title: '1. Min-Heap',
    subtitle: 'Optimal O(N log k)',
    icon: <Shapes size={16} />,
    complexity: 'Time: O(N log k) | Space: O(k)',
    code: `class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;
        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);
        for (ListNode list : lists) {
            if (list != null) {
                pq.add(list);
            }
        }
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        while (!pq.isEmpty()) {
            ListNode node = pq.poll();
            tail.next = node;
            tail = tail.next;
            if (node.next != null) {
                pq.add(node.next);
            }
        }
        return dummy.next;
    }
}`,
    explanation: "Maintain a Min-Heap of size K, containing the head of each list. We repeatedly extract the minimum element and insert its successor. This ensures we always process the smallest available value across all lists."
  },
  divide: {
    id: 'divide',
    title: '2. Divide & Conquer',
    subtitle: 'Merge Sort Pattern',
    icon: <GitMerge size={16} />,
    complexity: 'Time: O(N log k) | Space: O(1)',
    code: `class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;
        return mergeSort(lists, 0, lists.length - 1);
    }
    private ListNode mergeSort(ListNode[] lists, int start, int end) {
        if (start == end) return lists[start];
        int mid = start + (end - start) / 2;
        ListNode left = mergeSort(lists, start, mid);
        ListNode right = mergeSort(lists, mid + 1, end);
        return mergeTwoLists(left, right);
    }
    private ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        while (l1 != null && l2 != null) {
            if (l1.val < l2.val) {
                tail.next = l1; l1 = l1.next;
            } else {
                tail.next = l2; l2 = l2.next;
            }
            tail = tail.next;
        }
        tail.next = (l1 != null) ? l1 : l2;
        return dummy.next;
    }
}`,
    explanation: "Group the K lists into pairs and merge each pair. Repeat the process until only one list remains. This uses the same principle as Merge Sort."
  }
};

const MergeKSortedListsVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproach, setSelectedApproach] = useState<'heap' | 'divide'>('heap');
  const [listsInput, setListsInput] = useState("[1,4,5],[1,3,4],[2,6]");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const parsedLists = useMemo(() => {
    try {
      const cleaned = listsInput.replace(/\]\s*,\s*\[/g, '|').replace(/[\[\]]/g, '');
      return cleaned.split('|').map(s => s.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)));
    } catch (e) {
      return [[1, 4, 5], [1, 3, 4], [2, 6]];
    }
  }, [listsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const k = parsedLists.length;
    const workingLists = parsedLists.map(l => [...l]);
    const result: number[] = [];

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ 
        phase, 
        description: desc, 
        line, 
        state: { 
          ...state, 
          lists: workingLists.map(l => [...l]),
          result: [...result]
        } 
      });
    };

    if (selectedApproach === 'heap') {
      addStep("Guard Clause", "Checking if the input array is null or empty.", 3, { activeLists: [] });
      
      const heap: { val: number, listIdx: number }[] = [];
      addStep("Heap Init", "Initializing Min-PriorityQueue to track the head of each sorted list.", 4, { heap: [] });

      for (let i = 0; i < k; i++) {
        addStep("Initial Loop", `Checking list at index ${i}...`, 5, { i, heap: [...heap] });
        if (workingLists[i].length > 0) {
          addStep("Add to Heap", `List ${i} is not empty. Adding its head (${workingLists[i][0]}) to the Min-Heap.`, 7, { i, heap: [...heap] });
          heap.push({ val: workingLists[i].shift()!, listIdx: i });
          heap.sort((a, b) => a.val - b.val);
          addStep("Heap State", "Heap re-balanced. Minimum element is now at the top.", 8, { i, heap: [...heap] });
        }
      }

      addStep("Result Setup", "Creating dummy head to build the resulting merged list.", 11, { heap: [...heap] });
      addStep("Result Setup", "Setting 'tail' pointer to the dummy head.", 12, { heap: [...heap] });

      while (heap.length > 0) {
        addStep("Heap extraction", "Min-Heap is not empty. Polling the smallest element.", 13, { heap: [...heap] });
        
        const top = heap.shift()!;
        addStep("Process Node", `Extracted ${top.val} from List ${top.listIdx}.`, 14, { heap: [...heap], activeNode: top });
        
        result.push(top.val);
        addStep("Link Node", `Adding ${top.val} to the merged list tail.`, 15, { heap: [...heap], activeNode: top });
        addStep("Advance Tail", "Moving tail pointer forward.", 16, { heap: [...heap], activeNode: top });

        addStep("Check Successor", `Checking if List ${top.listIdx} has more elements...`, 17, { heap: [...heap], activeNode: top });
        if (workingLists[top.listIdx].length > 0) {
          const nextVal = workingLists[top.listIdx].shift()!;
          addStep("Add Successor", `Found ${nextVal}. Adding to Min-Heap to maintain search scope.`, 18, { heap: [...heap], activeNode: top, nextVal });
          heap.push({ val: nextVal, listIdx: top.listIdx });
          heap.sort((a, b) => a.val - b.val);
          addStep("Heap Re-sort", `Heap updated with ${nextVal}. Smallest is now ${heap[0].val}.`, 19, { heap: [...heap] });
        }
      }
      
      addStep("Finished", "All lists are exhausted and Min-Heap is empty.", 21, { heap: [], finished: true });
    } else {
        // Divide and Conquer simplified trace for visualizer
        addStep("Divide & Conquer", "Splitting problem into sub-problems...", 3, {});
        // This problem is usually visualized via its recursive steps but here we'll simulate the heap for clarity or a simplified merge
        addStep("Recursive Step", "Merge Sort strategy: merge sub-groups of 2 lists at a time.", 7, {});
        // We'll show the result list forming as the merge happens
        let allItems = parsedLists.flat().sort((a,b) => a-b);
        for(let val of allItems) {
            result.push(val);
            addStep("Merge Progress", `Merging elements into result... Current: ${val}`, 18, { });
        }
        addStep("Finished", "Divide and conquer merging complete.", 22, { finished: true });
    }

    return steps;
  }, [parsedLists, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(APPROACHES[selectedApproach].code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0];
  const { heap, lists, result, activeNode, finished } = cur.state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center">
                <Layers className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Merge K Sorted Lists</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-widest font-black text-[10px]">Hard Level Algorithm</span>
                <span>LC 23 • Hard</span>
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
                <h2 className="text-3xl font-black text-slate-900 mb-6 font-mono tracking-tighter text-indigo-600 underline decoration-indigo-200 decoration-4">23. Merge k Sorted Lists</h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-lg leading-relaxed font-mono">
                  <p>You are given an array of <code>k</code> linked-lists <code>lists</code>, each linked-list is sorted in ascending order.</p>
                  <p>Merge all the linked-lists into one sorted linked-list and return it.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Hash size={16}/> Examples:
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 font-mono text-sm shadow-inner">
                        <p className="mb-1"><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Input:</span> lists = [[1,4,5],[1,3,4],[2,6]]</p>
                        <p className="mb-2"><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Output:</span> [1,1,2,3,4,4,5,6]</p>
                        <p className="text-[10px] text-slate-500 italic mt-4 border-t pt-2">Explanation: The linked-lists are:
                        <br/>[
                        <br/>&nbsp;&nbsp;1-&gt;4-&gt;5,
                        <br/>&nbsp;&nbsp;1-&gt;3-&gt;4,
                        <br/>&nbsp;&nbsp;2-&gt;6
                        <br/>]
                        <br/>Merging them into one sorted list:
                        <br/>1-&gt;1-&gt;2-&gt;3-&gt;4-&gt;4-&gt;5-&gt;6</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <AlertCircle size={14} /> Constraints:
                </h3>
                <ul className="list-disc list-inside space-y-3 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <li><code>k == lists.length</code></li>
                  <li><code>0 &lt;= k &lt;= 10<sup>4</sup></code></li>
                  <li><code>0 &lt;= lists[i].length &lt;= 500</code></li>
                  <li><code>-10<sup>4</sup> &lt;= lists[i][j] &lt;= 10<sup>4</sup></code></li>
                  <li><code>lists[i]</code> is sorted in <strong>ascending order</strong>.</li>
                  <li>The sum of <code>lists[i].length</code> will not exceed <code>10<sup>4</sup></code>.</li>
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
                    <span className="font-bold uppercase tracking-tight text-white">Solution.java</span>
                  </div>
                  <button onClick={handleCopy} className="hover:text-white transition-colors">
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="absolute left-0 right-0 bg-indigo-500/15 border-l-4 border-indigo-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${(cur.line * 18.5) + 24 - 18.5}px`, height: '18.5px' }} />
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
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-indigo-600 uppercase block pl-1 tracking-widest font-mono tracking-tighter">Input K Lists (Nested CSV)</label>
                    <div className="flex gap-2">
                      <input value={listsInput} onChange={(e) => { setListsInput(e.target.value); setCurrentStep(0); }} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" placeholder="[1,2],[1,3]..." />
                      <button onClick={() => setCurrentStep(0)} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"><RotateCcw size={18}/></button>
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
                    <Shapes size={100}/>
                </div>
                <div className="flex items-center gap-2 mb-3">
                   <Activity size={14} className="text-indigo-400"/>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono tracking-tighter font-black">Execution Details</span>
                </div>
                <div className="text-lg font-black tracking-tight mb-2 uppercase font-mono flex items-center gap-3">
                    {cur.phase}
                </div>
                <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3">{cur.description}</p>
              </div>

              {/* Simulation Arena */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[500px] relative flex flex-col overflow-hidden shadow-inner transition-all duration-500">
                
                {/* Min-Heap Section */}
                {selectedApproach === 'heap' && !finished && (
                  <div className="w-full space-y-2 mb-10 animate-in slide-in-from-top-4">
                     <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block font-mono pl-1">Min-Heap State (Size K)</span>
                     <div className="flex flex-wrap gap-2 p-4 bg-indigo-50/50 rounded-2xl border-2 border-dashed border-indigo-100">
                        {heap?.map((node: any, idx: number) => (
                           <div key={idx} className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${idx === 0 ? 'bg-indigo-600 border-indigo-700 text-white shadow-lg scale-110' : 'bg-white border-indigo-100 text-indigo-700'}`}>
                              <span className="text-[8px] font-black uppercase opacity-60">L:{node.listIdx}</span>
                              <span className="text-lg font-black font-mono">{node.val}</span>
                           </div>
                        ))}
                        {(!heap || heap.length === 0) && <span className="text-xs text-slate-300 font-mono italic p-2">Empty Heap...</span>}
                     </div>
                  </div>
                )}

                {/* Main Visuals: Array of Linked Lists */}
                <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono pl-1">K Input Lists</span>
                    <div className="space-y-3">
                        {lists.map((l: number[], idx: number) => (
                            <div key={idx} className="flex items-center gap-2 animate-in slide-in-from-left-4" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0">{idx}</div>
                                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                                    {l.map((val, vIdx) => (
                                        <React.Fragment key={vIdx}>
                                            <div className={`px-3 py-1.5 rounded-lg border-2 font-mono text-xs font-black transition-all ${vIdx === 0 && !finished ? 'bg-indigo-50 border-indigo-400 text-indigo-700' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                                                {val}
                                            </div>
                                            {vIdx < l.length - 1 && <ChevronRight size={12} className="text-slate-200" />}
                                        </React.Fragment>
                                    ))}
                                    {l.length === 0 && <span className="text-[10px] text-slate-300 italic font-mono uppercase font-black tracking-widest">exhausted</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Resulting List */}
                <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest font-mono pl-1">Merged Result List</span>
                    <div className="flex flex-wrap items-center gap-1.5 p-4 bg-emerald-50/30 rounded-2xl border-2 border-dashed border-emerald-100 min-h-[60px]">
                        {result.map((val: number, idx: number) => (
                             <React.Fragment key={idx}>
                                <div className="px-3 py-2 bg-white border-2 border-emerald-200 text-emerald-700 rounded-xl text-xs font-black font-mono shadow-sm animate-in zoom-in">
                                    {val}
                                </div>
                                {idx < result.length - 1 && <ArrowRight size={14} className="text-emerald-200" />}
                            </React.Fragment>
                        ))}
                        {!finished && <RefreshCw size={14} className="text-emerald-400 animate-spin ml-2" />}
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
                        <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] block mb-2 font-mono">Merge Completed</span>
                        <div className="text-5xl font-black text-slate-900 tracking-tighter tabular-nums drop-shadow-sm font-mono">
                           Success
                        </div>
                        <div className="mt-4 px-6 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest font-mono shadow-sm">
                           O(N log k) Time Complexity
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
                <BookOpen className="text-indigo-600"/> The Art of K-Way Merging
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed font-mono tracking-tight">
                When we have multiple sorted streams, the challenge is efficiently picking the <strong>next smallest element</strong> without comparing every stream's head every single time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-indigo-900 flex items-center gap-2 uppercase tracking-tighter text-sm font-mono"><Box size={18}/> The Min-Heap Advantage</h3>
                        <p className="text-sm text-indigo-800 leading-relaxed italic border-l-2 border-indigo-200 pl-4 font-black">
                          "Keep only the essentials in memory."
                        </p>
                        <p className="text-xs text-indigo-700 leading-relaxed font-mono">
                          Instead of comparing K elements at every step (O(K)), a Min-Heap allows us to find and remove the minimum in <strong>O(1)</strong> and re-balance in <strong>O(log K)</strong>. This reduces our total work significantly across N elements.
                        </p>
                    </div>
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm font-mono"><Calculator size={18}/> Divide & Conquer</h3>
                        <p className="text-sm text-amber-700 leading-relaxed font-mono">
                          Similar to Merge Sort, we merge lists in pairs. The number of merge rounds is <code>log K</code>, and each round processes <code>N</code> total nodes, resulting in the same <strong>O(N log K)</strong> complexity but with zero additional memory if done iteratively.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Binary size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <BarChart3 size={32} className="text-indigo-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs font-mono">Performance Profile</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                      <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700 backdrop-blur-sm">
                          <span className="text-[10px] text-slate-500 block mb-1 uppercase font-black font-mono">Heap Approach</span>
                          <div className="font-mono text-xl font-black text-indigo-400">O(N log K) / O(K)</div>
                          <p className="text-[9px] text-slate-500 mt-2 font-mono uppercase tracking-tighter">Fastest execution</p>
                      </div>
                      <div className="p-5 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-500/20">
                          <span className="text-[10px] text-indigo-200 block mb-1 uppercase font-black font-mono">Divide & Conquer</span>
                          <div className="font-mono text-xl font-black">O(N log K) / O(1)</div>
                          <p className="text-[9px] text-indigo-200 mt-2 font-mono uppercase tracking-tighter">Memory Champion</p>
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                      <h4 className="text-[10px] font-black text-emerald-400 uppercase mb-1 flex items-center gap-2 font-mono"><Zap size={12}/> Pro: PriorityQueue Trick</h4>
                      <p className="text-[10px] text-slate-300 leading-relaxed font-mono">
                        In many interviews, you only need to store the <strong>ListNode reference</strong> in the queue. This is more efficient than storing raw values because it gives you immediate access to the <code>next</code> pointer.
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
                        "For Amazon's heavy data-sync services, an O(NK) brute force merge is unacceptable. I implemented an O(N log K) solution using a Min-Heap. By maintaining a dynamic frontier of the smallest elements across all K lists, we transform a linear scan problem into a logarithmic one. My approach focuses on memory frugality—using O(K) space to handle potentially millions of nodes (N)—and utilizes the PriorityQueue data structure to ensure thread-safe, consistent ordering during the merge process."
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter font-mono font-black tracking-tight">
                        <MessageSquare className="text-indigo-500" size={20} /> Candidate Q&A
                    </h3>
                    <div className="space-y-4 font-mono">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-black">"Why not just put ALL nodes in a list and sort?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                "While putting all nodes in a list and sorting takes O(N log N) time, it ignores the <strong>pre-sorted</strong> property of the inputs. Our goal is to leverage that existing work to achieve O(N log K). If N is much larger than K, our approach is significantly faster."
                            </p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-black">"How do you handle the empty lists in the array?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                "The first loop in my algorithm explicitly checks <code>if (node != null)</code> before adding to the heap. This prevents <code>NullPointerExceptions</code> and ensures the heap only contains valid nodes, making it robust against sparse input arrays."
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
                    <ul className="space-y-8 font-mono">
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">1</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight">Invent and Simplify</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1">Re-frame the complex multi-list problem as a simple Min-Heap extraction cycle. This simplification makes the code more maintainable and reliable.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">2</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight">Deliver Results</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1 font-mono">Acknowledge that while Divide & Conquer is O(1) space, PriorityQueue is often more 'idiomatic' and readable in many languages, which is a key factor in collaborative enterprise environments.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                    <Binary className="text-slate-400 mb-3" size={48} />
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest text-center mb-6 font-mono tracking-tighter font-black">Efficiency Breakdown</p>
                    <div className="space-y-4 w-full font-mono">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase">Brute Merge O(NK)</span>
                                <span className="text-rose-500 font-black tracking-tighter">Linear-K growth</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-400 w-full" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase">Heap Merge O(N log K)</span>
                                <span className="text-indigo-500 font-black tracking-tighter">Logarithmic-K growth</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-50 w-[5%]" />
                            </div>
                        </div>
                    </div>
                    <p className="mt-6 text-[10px] text-slate-400 text-center leading-relaxed">
                        At K=10,000, <b>O(N log K)</b> is roughly <span className="text-indigo-600 font-black">1000x faster</span> than <b>O(NK)</b>, marking the difference between a real-time service and a batch-only process.
                    </p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|double|void|String|boolean|new|this|for|ListNode|Math|max|PriorityQueue|poll|add|isEmpty|length)\b|\b\d+\b)/g).filter(Boolean);
  return (
    <div className={`flex relative z-10 min-h-[18.5px] transition-colors duration-300 ${active ? 'bg-indigo-500/10 font-bold' : ''}`}>
      <span className="w-10 text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 font-mono text-[10px] select-none shrink-0">{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean', 'void', 'double'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['PriorityQueue', 'ListNode', 'String'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['poll', 'add', 'isEmpty', 'length', 'max'].includes(part)) return <span key={i} className="text-blue-400">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-rose-400 font-bold">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

const TopicButton: React.FC<{ active: boolean; onClick: () => void; title: string; desc: string }> = ({ active, onClick, title, desc }) => (
  <button onClick={onClick} className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group ${active ? 'bg-indigo-50 border-indigo-500 shadow-md ring-1 ring-indigo-100' : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}>
    <div className={`font-black uppercase tracking-tight text-sm ${active ? 'text-indigo-800' : 'text-slate-700 group-hover:text-indigo-700'}`}>{title}</div>
    <div className={`text-[10px] font-bold mt-1 ${active ? 'text-indigo-600' : 'text-slate-400'}`}>{desc}</div>
  </button>
);

export default MergeKSortedListsVisualizer;
