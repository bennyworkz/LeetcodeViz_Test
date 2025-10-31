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
  MoreHorizontal,
  ArrowUp
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
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproach, setSelectedApproach] = useState('heap');
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
    const steps = [];
    const k = parsedLists.length;
    const workingLists = parsedLists.map(l => [...l]);
    const result = [];

    const addStep = (phase, desc, line, state) => {
      steps.push({ 
        phase, 
        description: desc, 
        line, 
        state: { 
          lists: workingLists.map(l => [...l]),
          result: [...result],
          heap: [],
          activeNode: null,
          action: null,
          leftSublist: null,
          rightSublist: null,
          ...state 
        } 
      });
    };

    if (selectedApproach === 'heap') {
      addStep("Guard Clause", "Line 3: Check if the input lists array is null or empty. If so, there is nothing to merge.", 3, { });
      
      const heap = [];
      addStep("Heap Init", "Line 4: Initialize a Min-PriorityQueue `pq`. We pass a custom comparator `(a, b) -> a.val - b.val` so it strictly orders nodes from smallest to largest.", 4, { heap: [...heap] });

      for (let i = 0; i < k; i++) {
        addStep("Initial Loop", `Line 5: Iterating through the array of linked lists. Currently looking at list index ${i}.`, 5, { heap: [...heap], loopIdx: i });
        
        if (workingLists[i].length > 0) {
          addStep("Check Null", `Line 6: The list at index ${i} is not null. It contains elements.`, 6, { heap: [...heap], loopIdx: i });
          
          const val = workingLists[i].shift();
          heap.push({ val, listIdx: i });
          heap.sort((a, b) => a.val - b.val); // Simulate PQ internal rebalancing
          
          addStep("Add to Heap", `Line 7: Executing \`pq.add(list)\`. We add the head node (${val}) of list ${i} into our Min-Heap. The heap automatically sorts it to the correct position.`, 7, { heap: [...heap], loopIdx: i, action: 'add_pq', activeVal: val });
        } else {
          addStep("Check Null", `Line 6: The list at index ${i} is null/empty. We skip it to avoid NullPointerExceptions.`, 6, { heap: [...heap], loopIdx: i });
        }
      }

      addStep("Result Setup: Dummy", "Line 10: Create a `dummy` node with value 0. This is a standard linked-list trick to avoid edge cases when setting the very first head node.", 10, { heap: [...heap] });
      addStep("Result Setup: Tail", "Line 11: Create a `tail` pointer and point it to `dummy`. We will use `tail` to append new nodes to the end of our merged list.", 11, { heap: [...heap] });

      while (heap.length > 0) {
        addStep("While Loop Check", `Line 12: \`!pq.isEmpty()\` is true. There are currently ${heap.length} candidate nodes in the Min-Heap waiting to be merged.`, 12, { heap: [...heap] });
        
        const top = heap.shift();
        addStep("Poll Minimum Node", `Line 13: \`pq.poll()\` extracts the absolute smallest node from the heap. We store it in local variable \`node\`. Extracted value is ${top.val}.`, 13, { heap: [...heap], activeNode: top, action: 'poll_pq' });
        
        result.push(top.val);
        addStep("Link to Tail", `Line 14: \`tail.next = node\`. We append our extracted minimum node (${top.val}) to the end of our merged result list.`, 14, { heap: [...heap], activeNode: top, action: 'link' });
        
        addStep("Advance Tail", `Line 15: \`tail = tail.next\`. We move the tail pointer forward so it sits on the newly added node, ready for the next iteration.`, 15, { heap: [...heap], activeNode: top });

        addStep("Check Node Successor", `Line 16: \`if (node.next != null)\`. We check if the node we just extracted has a subsequent element in its original linked list.`, 16, { heap: [...heap], activeNode: top });
        
        if (workingLists[top.listIdx].length > 0) {
          const nextVal = workingLists[top.listIdx].shift();
          heap.push({ val: nextVal, listIdx: top.listIdx });
          heap.sort((a, b) => a.val - b.val);
          
          addStep("Add Successor to Heap", `Line 17: \`pq.add(node.next)\`. The next node in list ${top.listIdx} is ${nextVal}. We push it into the Min-Heap to maintain our frontier of available smallest elements.`, 17, { heap: [...heap], activeNode: top, action: 'add_next', nextVal });
        } else {
            addStep("End of Sublist", `Line 16: \`node.next\` is null. List ${top.listIdx} is fully exhausted. We do not add anything to the heap.`, 16, { heap: [...heap], activeNode: top });
        }
      }
      
      addStep("While Loop End", "Line 12: \`pq.isEmpty()\` is now true. The Min-Heap is empty, meaning all nodes from all lists have been processed.", 12, { heap: [] });
      addStep("Return Merged List", "Line 20: \`return dummy.next\`. The dummy node's next pointer holds the actual start of our fully merged, perfectly sorted linked list.", 20, { heap: [], finished: true });
    
    } else {
      // Divide & Conquer Approach Deep Trace
      addStep("Guard Clause", "Line 3: Checking if the input lists array is null or empty.", 3, { activeLists: [] });
      if (k === 0) {
         addStep("Return Null", "Line 3: Lists are empty, returning null.", 3, { finished: true });
         return steps;
      }
      addStep("Start MergeSort", `Line 4: Initializing recursion. Calling mergeSort(lists, start=0, end=${k-1}).`, 4, { activeLists: [] });

      const doMergeTwo = (l1, l2, isFinal) => {
        let merged = [];
        let l1Copy = [...l1];
        let l2Copy = [...l2];
        
        const getDCState = () => ({ leftSublist: [...l1Copy], rightSublist: [...l2Copy] });

        addStep("MergeTwoLists Setup", `Lines 14-15: We are merging two sorted sublists. Initializing \`dummy\` head and \`tail\` pointer.`, 14, getDCState());
        
        while (l1Copy.length > 0 && l2Copy.length > 0) {
            addStep("While Loop Check", `Line 16: Both sublists still have elements. Proceeding to compare.`, 16, getDCState());
            
            let chosenVal;
            if (l1Copy[0] < l2Copy[0]) {
                addStep("Compare Nodes", `Line 17: Check if l1 (${l1Copy[0]}) < l2 (${l2Copy[0]}). This is TRUE.`, 17, getDCState());
                chosenVal = l1Copy.shift();
                addStep("Link Left Node", `Line 18: \`tail.next = l1; l1 = l1.next\`. We take the smaller node from the Left sublist.`, 18, { ...getDCState(), activeNode: { val: chosenVal, listIdx: 'Left' } });
            } else {
                addStep("Compare Nodes", `Line 17: Check if l1 (${l1Copy[0]}) < l2 (${l2Copy[0]}). This is FALSE. Go to else block.`, 19, getDCState());
                chosenVal = l2Copy.shift();
                addStep("Link Right Node", `Line 20: \`tail.next = l2; l2 = l2.next\`. We take the smaller node from the Right sublist.`, 20, { ...getDCState(), activeNode: { val: chosenVal, listIdx: 'Right' } });
            }
            
            merged.push(chosenVal);
            if (isFinal) result.push(chosenVal); // update global result for UI
            
            addStep("Advance Tail", `Line 22: \`tail = tail.next\`. Move tail forward to prepare for the next node.`, 22, { ...getDCState(), activeNode: null });
        }
        
        if (l1Copy.length > 0) {
            addStep("Append Remainder", `Line 24: The Right sublist is fully exhausted. We append the entire remaining Left sublist directly to the tail.`, 24, getDCState());
            while(l1Copy.length > 0) {
                let v = l1Copy.shift();
                merged.push(v);
                if (isFinal) result.push(v);
            }
        } else if (l2Copy.length > 0) {
            addStep("Append Remainder", `Line 24: The Left sublist is fully exhausted. We append the entire remaining Right sublist directly to the tail.`, 24, getDCState());
            while(l2Copy.length > 0) {
                let v = l2Copy.shift();
                merged.push(v);
                if (isFinal) result.push(v);
            }
        }
        
        addStep("Return Merged Sublist", `Line 25: The two sublists are perfectly merged. \`return dummy.next\`.`, 25, { leftSublist: [], rightSublist: [] });
        return merged;
      };

      const doMergeSort = (start, end) => {
        addStep("Recursive MergeSort Call", `Line 6: Executing \`mergeSort(lists, start=${start}, end=${end})\`.`, 6, { });
        if (start === end) {
            addStep("Base Case Reached", `Line 7: start == end (${start}). This subproblem is a single list. Returning list[${start}].`, 7, { });
            return [...parsedLists[start]];
        }
        
        let mid = Math.floor(start + (end - start) / 2);
        addStep("Calculate Midpoint", `Line 8: \`mid = start + (end - start) / 2\`. Midpoint is index ${mid}.`, 8, { });
        
        addStep("Recurse Left Half", `Line 9: Recursively call \`mergeSort\` for the left half [${start} to ${mid}].`, 9, { });
        let left = doMergeSort(start, mid);
        
        addStep("Recurse Right Half", `Line 10: Recursively call \`mergeSort\` for the right half [${mid + 1} to ${end}].`, 10, { });
        let right = doMergeSort(mid + 1, end);
        
        addStep("Merge Subproblem Halves", `Line 11: Both halves are sorted. Now calling \`mergeTwoLists(left, right)\` for elements originally at indices [${start}-${end}].`, 11, { });
        
        let isFinal = (start === 0 && end === k - 1);
        return doMergeTwo(left, right, isFinal);
      };

      doMergeSort(0, k - 1);
      
      addStep("Finished", "Line 4: Divide and conquer algorithm successfully merged all K lists into one.", 4, { finished: true });
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
  const { heap, lists, result, activeNode, finished, action, loopIdx, nextVal, activeVal, leftSublist, rightSublist } = cur.state || {};

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
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto max-w-full">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            
            {/* Left Col: Code Window (5/12) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-2 flex gap-2 shadow-sm">
                {(Object.keys(APPROACHES)).map((key) => (
                  <button key={key} onClick={() => { setSelectedApproach(key); setCurrentStep(0); }} className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-indigo-600 text-white shadow-lg' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}>
                    <span className="text-xs font-black uppercase tracking-tight">{APPROACHES[key].title}</span>
                    <span className={`text-[10px] opacity-70 ${selectedApproach === key ? 'text-white' : 'text-slate-400'}`}>
                      {APPROACHES[key].complexity}
                    </span>
                  </button>
                ))}
              </div>

              <div className="bg-[#0f172a] rounded-3xl h-[600px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center z-10">
                  <div className="flex items-center gap-2">
                    <Code2 size={14} className="text-indigo-400" />
                    <span className="font-bold uppercase tracking-tight text-white">Solution.java</span>
                  </div>
                  <button onClick={handleCopy} className="hover:text-white transition-colors">
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="p-6 font-mono text-[11.5px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700 h-full">
                    {/* Highlight Box perfectly synced with line numbers */}
                    <div className="absolute left-0 right-0 bg-indigo-500/20 border-l-4 border-indigo-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${((cur.line - 1) * 19.5) + 24}px`, height: '19.5px' }} />
                    
                    {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                      <React.Fragment key={idx}>
                        <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} />
                      </React.Fragment>
                    ))}
                </div>
              </div>
            </div>

            {/* Right Col: Visualizer (7/12) */}
            <div className="lg:col-span-7 space-y-6 flex flex-col">
              
              {/* Controls */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-end shrink-0">
                <div className="flex-1 space-y-1.5 w-full">
                    <label className="text-[10px] font-black text-indigo-600 uppercase block pl-1 tracking-widest font-mono tracking-tighter">Input K Lists (Nested CSV)</label>
                    <div className="flex gap-2">
                      <input value={listsInput} onChange={(e) => { setListsInput(e.target.value); setCurrentStep(0); }} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" placeholder="[1,2],[1,3]..." />
                      <button onClick={() => setCurrentStep(0)} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors shadow-sm"><RotateCcw size={18}/></button>
                    </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto pb-5">
                  <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 sm:flex-none sm:w-20 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1 shadow-sm text-slate-700">
                    <ChevronLeft size={16}/> Prev
                  </button>
                  <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] sm:flex-none sm:w-32 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-1">
                    Next <ChevronRight size={16}/>
                  </button>
                </div>
              </div>

              {/* Execution Log */}
              <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group shrink-0 ${cur.phase.includes('Match') || cur.phase.includes('Link') || cur.phase.includes('Advance') ? 'bg-emerald-900 border-emerald-800' : (cur.phase.includes('Extract') || cur.phase.includes('Compare') || action === 'poll_pq' ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800')}`}>
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    <Activity size={100}/>
                </div>
                <div className="flex items-center justify-between mb-3 relative z-10">
                   <div className="flex items-center gap-2">
                      <Activity size={14} className={action === 'poll_pq' ? 'text-amber-400' : "text-indigo-400"}/>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono tracking-tighter">Execution Log</span>
                   </div>
                   <div className="px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Line {cur.line}</div>
                </div>
                <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3 relative z-10">
                    {cur.phase}
                </div>
                <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 font-mono relative z-10">{cur.description}</p>
              </div>

              {/* Non-Overlapping Simulation Arena */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[460px] relative flex flex-col shadow-inner pt-6 gap-8">
                
                {/* 1. Input Lists Track */}
                <div className="w-full flex flex-col gap-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono border-b border-slate-100 pb-2 mb-2 flex items-center gap-2">
                        <List size={14} /> 1. Remaining Input Lists 
                    </span>
                    {lists && lists.map((l, idx) => {
                        const isActiveList = loopIdx === idx || (activeNode && activeNode.listIdx === idx) || (action === 'add_next' && activeNode && activeNode.listIdx === idx);
                        
                        return (
                            <div key={idx} className={`flex items-center gap-3 p-2 rounded-xl border transition-all duration-300 ${isActiveList ? 'bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
                                <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-black shrink-0 font-mono ${isActiveList ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-200 text-slate-500'}`}>
                                    L{idx}
                                </div>
                                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-1">
                                    {l.length > 0 ? l.map((val, vIdx) => {
                                        const isPopping = (action === 'add_pq' && vIdx === 0 && loopIdx === idx) || (action === 'add_next' && vIdx === 0 && activeNode && activeNode.listIdx === idx);
                                        return (
                                            <React.Fragment key={vIdx}>
                                                <div className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 font-mono text-sm font-black transition-all ${isPopping ? 'bg-amber-100 border-amber-400 text-amber-700 scale-110 shadow-md animate-pulse z-10' : 'bg-white border-slate-200 text-slate-700'}`}>
                                                    {val}
                                                </div>
                                                {vIdx < l.length - 1 && <ArrowRight size={12} className="text-slate-300 shrink-0" />}
                                            </React.Fragment>
                                        );
                                    }) : (
                                        <span className="text-[10px] text-slate-300 italic font-mono uppercase font-black tracking-widest px-2">Empty</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 2. Priority Queue Track (Only for Heap Approach) */}
                {selectedApproach === 'heap' && !finished && (
                  <div className="w-full flex flex-col gap-2">
                      <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest font-mono border-b border-amber-100 pb-2 mb-2 flex items-center gap-2">
                          <Database size={14} /> 2. Min-Heap (PriorityQueue)
                      </span>
                      <div className="flex flex-wrap gap-3 p-4 bg-amber-50/30 rounded-2xl border-2 border-dashed border-amber-200 min-h-[80px] items-center">
                          {heap && heap.length > 0 ? heap.map((node, idx) => {
                              const isMin = idx === 0;
                              const isBeingPolled = isMin && action === 'poll_pq';
                              const isJustAdded = node.val === activeVal || node.val === nextVal;
                              
                              let nodeClass = "flex flex-col items-center justify-center w-14 h-14 rounded-xl border-2 transition-all duration-500 relative ";
                              
                              if (isBeingPolled) {
                                  nodeClass += "bg-emerald-100 border-emerald-400 text-emerald-800 scale-110 shadow-lg animate-pulse z-20 opacity-50 translate-y-4";
                              } else if (isJustAdded) {
                                  nodeClass += "bg-amber-100 border-amber-500 text-amber-800 scale-110 shadow-md z-10 animate-in zoom-in";
                              } else if (isMin) {
                                  nodeClass += "bg-white border-amber-400 text-amber-900 shadow-sm ring-2 ring-amber-100 ring-offset-1";
                              } else {
                                  nodeClass += "bg-white border-slate-200 text-slate-600";
                              }

                              return (
                                  <div key={idx} className={nodeClass}>
                                      {isMin && !isBeingPolled && <div className="absolute -top-2 bg-amber-500 text-white text-[8px] font-black uppercase px-1.5 rounded-full tracking-widest z-10">MIN</div>}
                                      <span className="text-xl font-black font-mono leading-none">{node.val}</span>
                                      <span className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">L{node.listIdx}</span>
                                  </div>
                              );
                          }) : (
                              <span className="text-xs text-amber-300 font-mono italic p-2 font-bold w-full text-center">Heap is empty</span>
                          )}
                      </div>
                  </div>
                )}

                {/* 2. Sublists Track (Only for Divide & Conquer Approach) */}
                {selectedApproach === 'divide' && !finished && leftSublist && rightSublist && (
                    <div className="w-full flex flex-col gap-2 animate-in slide-in-from-top-4 mb-2">
                        <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest font-mono border-b border-amber-100 pb-2 mb-2 flex items-center gap-2">
                            <GitMerge size={14} /> 2. Current Merge Round
                        </span>
                        <div className="flex gap-4 items-center">
                            {/* Left Sublist */}
                            <div className="flex-1 flex flex-col items-center p-3 bg-amber-50/50 rounded-2xl border-2 border-dashed border-amber-200">
                                <span className="text-[8px] font-black uppercase text-amber-600 mb-2 font-mono">Left Sublist</span>
                                <div className="flex gap-1 overflow-x-auto w-full justify-center">
                                    {leftSublist.length > 0 ? leftSublist.map((v, i) => {
                                        const isActiveHead = i === 0 && activeNode && activeNode.listIdx === 'Left';
                                        return (
                                            <div key={i} className={`w-8 h-8 flex items-center justify-center rounded-lg font-mono text-xs font-black transition-all ${isActiveHead ? 'bg-amber-200 border-2 border-amber-400 text-amber-900 scale-110 shadow-md animate-pulse z-10' : 'bg-white border-2 border-amber-300 text-amber-800'}`}>
                                                {v}
                                            </div>
                                        );
                                    }) : <span className="text-[10px] text-slate-400 italic font-mono uppercase font-black">Empty</span>}
                                </div>
                            </div>
                            
                            <span className="text-amber-300 font-black font-mono">VS</span>
                            
                            {/* Right Sublist */}
                            <div className="flex-1 flex flex-col items-center p-3 bg-amber-50/50 rounded-2xl border-2 border-dashed border-amber-200">
                                <span className="text-[8px] font-black uppercase text-amber-600 mb-2 font-mono">Right Sublist</span>
                                <div className="flex gap-1 overflow-x-auto w-full justify-center">
                                    {rightSublist.length > 0 ? rightSublist.map((v, i) => {
                                        const isActiveHead = i === 0 && activeNode && activeNode.listIdx === 'Right';
                                        return (
                                            <div key={i} className={`w-8 h-8 flex items-center justify-center rounded-lg font-mono text-xs font-black transition-all ${isActiveHead ? 'bg-amber-200 border-2 border-amber-400 text-amber-900 scale-110 shadow-md animate-pulse z-10' : 'bg-white border-2 border-amber-300 text-amber-800'}`}>
                                                {v}
                                            </div>
                                        );
                                    }) : <span className="text-[10px] text-slate-400 italic font-mono uppercase font-black">Empty</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Active Node Variables Track */}
                <div className="w-full flex flex-col gap-2">
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest font-mono border-b border-indigo-100 pb-2 mb-2 flex items-center gap-2">
                        <Cpu size={14} /> 3. Current In-Memory Variables
                    </span>
                    <div className="grid grid-cols-2 gap-4">
                        {/* ListNode node */}
                        <div className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-2xl border border-indigo-100 relative shadow-inner">
                            <span className="absolute top-2 left-3 text-[10px] font-black text-indigo-400 font-mono">ListNode {selectedApproach === 'heap' ? 'node' : 'active'}</span>
                            {activeNode ? (
                                <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border-2 transition-all duration-300 ${action === 'poll_pq' || selectedApproach === 'divide' ? 'bg-emerald-100 border-emerald-500 text-emerald-800 shadow-lg scale-110 animate-in zoom-in' : 'bg-white border-indigo-300 text-indigo-800 shadow-sm'}`}>
                                    <span className="text-xl font-black font-mono leading-none">{activeNode.val}</span>
                                    <span className="text-[7px] font-bold text-indigo-400 uppercase mt-0.5">
                                        From {selectedApproach === 'heap' ? `L${activeNode.listIdx}` : `${activeNode.listIdx}`}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-2xl font-black font-mono text-indigo-200 mt-4">null</span>
                            )}
                        </div>
                        
                        {/* Status Message Block */}
                        <div className="flex flex-col justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner">
                            <span className="text-[10px] font-black text-slate-400 font-mono mb-1">Logic State</span>
                            <span className="text-sm font-bold text-slate-700 font-mono leading-snug">
                                {action === 'poll_pq' && "Extracted minimum node from heap."}
                                {action === 'link' && "Attaching node to result tail."}
                                {action === 'add_pq' && "Adding list head to heap."}
                                {action === 'add_next' && "Adding successor to heap."}
                                {selectedApproach === 'divide' && activeNode && "Selected smaller sublist node."}
                                {!action && !activeNode && "Evaluating flow..."}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 4. Output Result List Track */}
                <div className="w-full flex flex-col gap-2 mt-auto">
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest font-mono border-b border-emerald-100 pb-2 mb-2 flex items-center gap-2">
                        <CornerDownRight size={14} /> 4. Resulting Merged List
                    </span>
                    <div className="flex items-center gap-2 p-4 bg-emerald-50/50 rounded-2xl border-2 border-emerald-100 min-h-[80px] overflow-x-auto scrollbar-thin">
                        <div className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-100 text-emerald-600 font-mono text-[10px] font-black shrink-0">
                            Dum
                        </div>
                        <ArrowRight size={14} className="text-emerald-300 shrink-0" />
                        
                        {result && result.map((val, idx) => {
                            const isJustLinked = (action === 'link' || selectedApproach === 'divide') && idx === result.length - 1;
                            const isTail = idx === result.length - 1;
                            
                            return (
                                <React.Fragment key={`res-${idx}`}>
                                    <div className="flex flex-col items-center relative shrink-0">
                                        <div className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 font-mono text-sm font-black transition-all duration-300 ${isJustLinked ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg scale-110 animate-in slide-in-from-top-4 z-10' : 'bg-white border-emerald-300 text-emerald-800 shadow-sm'}`}>
                                            {val}
                                        </div>
                                        {/* Tail Pointer Indicator */}
                                        {isTail && (
                                            <div className="absolute -bottom-6 flex flex-col items-center text-emerald-600 animate-pulse">
                                                <ArrowUp size={12} strokeWidth={3} />
                                                <span className="text-[8px] font-black uppercase">Tail</span>
                                            </div>
                                        )}
                                    </div>
                                    {/* Link to next or null */}
                                    <ArrowRight size={14} className="text-emerald-300 shrink-0" />
                                </React.Fragment>
                            );
                        })}
                        
                        {/* Always show tail pointing to null if we are waiting */}
                        <div className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-dashed border-slate-200 text-slate-400 font-mono text-[10px] font-black shrink-0">
                            null
                        </div>
                    </div>
                </div>

                {/* Final State Banner */}
                {finished && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-indigo-600/5 backdrop-blur-[4px] animate-in fade-in duration-1000">
                    <div className="bg-white border-2 border-indigo-100 px-12 py-10 rounded-[3.5rem] shadow-2xl flex flex-col items-center gap-6 transform -rotate-1 hover:rotate-0 transition-transform">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-xl mb-2 border border-green-200">
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

        {/* Theory / Learn Tab */}
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

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|double|void|String|boolean|new|this|for|ListNode|Math|max|PriorityQueue|poll|add|isEmpty|length|mergeSort|mergeKLists|mergeTwoLists)\b|\b\d+\b)/g).filter(Boolean);
  return (
    <div className={`flex relative z-10 min-h-[19.5px] transition-colors duration-300 ${active ? 'bg-indigo-500/10 font-bold' : ''}`}>
      <span className="w-10 text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 font-mono text-[10px] select-none shrink-0">{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean', 'void', 'double'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['PriorityQueue', 'ListNode', 'String'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['poll', 'add', 'isEmpty', 'length', 'max', 'mergeSort', 'mergeKLists', 'mergeTwoLists'].includes(part)) return <span key={i} className="text-blue-400">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-rose-400 font-bold">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default MergeKSortedListsVisualizer;
