import React, { useState, useMemo } from 'react';
import { 
  RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, ArrowRight, 
  ArrowDown, BarChart3, X, GitBranch, Split, Binary, 
  MousePointer2, Timer, Network, Undo2, ArrowUp, History, 
  Calculator, Type, ArrowLeftRight, Hash, Scaling, Landmark, Coins, Plus, GitMerge, Link, ListOrdered
} from 'lucide-react';

const APPROACHES = {
  iterative: {
    id: 'iterative',
    title: '1. Iterative (Dummy Node)',
    subtitle: 'Use a dummy head and a curr pointer.',
    icon: <Link size={16} />,
    complexity: 'Time: O(N + M) | Space: O(1)',
    code: `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(-1);
        ListNode curr = dummy;
        
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                curr.next = list1;
                list1 = list1.next;
            } else {
                curr.next = list2;
                list2 = list2.next;
            }
            curr = curr.next;
        }
        
        // Append the remaining nodes
        if (list1 != null) {
            curr.next = list1;
        } else {
            curr.next = list2;
        }
        
        return dummy.next;
    }
}`,
    explanation: "The standard and most practical approach. We create a 'dummy' node to act as the guaranteed start of our new merged list. We use a 'curr' pointer to track the tail of our growing merged list. We repeatedly compare the heads of list1 and list2, append the smaller one to 'curr.next', and advance the respective pointers. Finally, we attach any remaining nodes from the non-empty list."
  },
  recursive: {
    id: 'recursive',
    title: '2. Recursive',
    subtitle: 'Elegantly link nodes via call stack.',
    icon: <GitMerge size={16} />,
    complexity: 'Time: O(N + M) | Space: O(N + M)',
    code: `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Base cases: if either list is empty, return the other
        if (list1 == null) return list2;
        if (list2 == null) return list1;
        
        // Recursive case: link the smaller node to the merged remainder
        if (list1.val <= list2.val) {
            list1.next = mergeTwoLists(list1.next, list2);
            return list1;
        } else {
            list2.next = mergeTwoLists(list1, list2.next);
            return list2;
        }
    }
}`,
    explanation: "A deeply elegant recursive solution. The logic is: 'The merged list starts with the smaller of list1.val and list2.val. The REST of the merged list is the result of merging the remaining nodes.' While beautiful and concise, it requires O(N+M) auxiliary space for the call stack, which could cause a StackOverflow for extremely long linked lists."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">21. Merge Two Sorted Lists</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
        <p className="text-lg leading-relaxed">
          You are given the heads of two sorted linked lists <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-600 font-mono font-bold">list1</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-600 font-mono font-bold">list2</code>.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-emerald-500 pl-4 bg-emerald-50 py-2">
          Merge the two lists into one <strong>sorted</strong> list. The list should be made by splicing together the nodes of the first two lists.
        </p>

        <p className="text-lg leading-relaxed">
          Return <em>the head of the merged linked list</em>.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              <div className="flex items-center gap-4 text-slate-700">
                 <span className="font-bold w-12 text-slate-400">List 1:</span>
                 <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-white border border-slate-300 rounded shadow-sm">1</span> <ArrowRight size={14}/>
                    <span className="px-3 py-1 bg-white border border-slate-300 rounded shadow-sm">2</span> <ArrowRight size={14}/>
                    <span className="px-3 py-1 bg-white border border-slate-300 rounded shadow-sm">4</span>
                 </div>
              </div>
              <div className="flex items-center gap-4 text-slate-700">
                 <span className="font-bold w-12 text-slate-400">List 2:</span>
                 <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-white border border-slate-300 rounded shadow-sm">1</span> <ArrowRight size={14}/>
                    <span className="px-3 py-1 bg-white border border-slate-300 rounded shadow-sm">3</span> <ArrowRight size={14}/>
                    <span className="px-3 py-1 bg-white border border-slate-300 rounded shadow-sm">4</span>
                 </div>
              </div>
              <div className="pt-3 border-t border-slate-200 flex items-center gap-4 text-emerald-800">
                 <span className="font-bold w-12 text-emerald-600">Output:</span>
                 <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 rounded shadow-sm font-bold">1</span> <ArrowRight size={14} className="text-emerald-400"/>
                    <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 rounded shadow-sm font-bold">1</span> <ArrowRight size={14} className="text-emerald-400"/>
                    <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 rounded shadow-sm font-bold">2</span> <ArrowRight size={14} className="text-emerald-400"/>
                    <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 rounded shadow-sm font-bold">3</span> <ArrowRight size={14} className="text-emerald-400"/>
                    <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 rounded shadow-sm font-bold">4</span> <ArrowRight size={14} className="text-emerald-400"/>
                    <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 rounded shadow-sm font-bold">4</span>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> list1 = [], list2 = []</p>
              <p><span className="text-slate-400 font-bold">Output:</span> []</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> list1 = [], list2 = [0]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [0]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

type MergedNode = { from: 'l1' | 'l2' | 'dummy', val: number | string, idx: number };

const MergeListsVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState<keyof typeof APPROACHES>('iterative');
  const [l1Input, setL1Input] = useState('1, 2, 4');
  const [l2Input, setL2Input] = useState('1, 3, 4');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  // Parse and automatically sort inputs to guarantee problem constraints
  const l1List = useMemo(() => l1Input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)).sort((a,b)=>a-b), [l1Input]);
  const l2List = useMemo(() => l2Input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)).sort((a,b)=>a-b), [l2Input]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({
        phase,
        description: desc,
        line,
        state: { l1List, l2List, ...state }
      });
    };

    let merged: MergedNode[] = [];

    if (selectedApproachId === 'iterative') {
        let l1 = 0;
        let l2 = 0;
        merged.push({ from: 'dummy', val: 'D', idx: -1 });
        
        addStep("Initialization", `Create a dummy node. Initialize 'curr' pointer to dummy. Set list1 and list2 pointers to their heads.`, 3, { l1, l2, merged: [...merged] });
        
        while (l1 < l1List.length && l2 < l2List.length) {
            addStep("Loop Condition", `Both list1 (val=${l1List[l1]}) and list2 (val=${l2List[l2]}) are not null.`, 6, { l1, l2, merged: [...merged] });
            addStep("Compare Nodes", `Is list1.val (${l1List[l1]}) <= list2.val (${l2List[l2]})?`, 7, { l1, l2, merged: [...merged], comparing: true });
            
            if (l1List[l1] <= l2List[l2]) {
                merged.push({ from: 'l1', val: l1List[l1], idx: l1 });
                addStep("Append from List 1", `Yes. list1 is smaller or equal. Link curr.next to list1.`, 8, { l1, l2, merged: [...merged], activeL1: true });
                l1++;
                addStep("Advance Pointer", `Advance list1 pointer: list1 = list1.next.`, 9, { l1, l2, merged: [...merged] });
            } else {
                merged.push({ from: 'l2', val: l2List[l2], idx: l2 });
                addStep("Append from List 2", `No. list2 is strictly smaller. Link curr.next to list2.`, 11, { l1, l2, merged: [...merged], activeL2: true });
                l2++;
                addStep("Advance Pointer", `Advance list2 pointer: list2 = list2.next.`, 12, { l1, l2, merged: [...merged] });
            }
            addStep("Advance Curr", `Move curr forward: curr = curr.next.`, 14, { l1, l2, merged: [...merged] });
        }
        
        addStep("Loop Terminates", `One or both lists are now null. Loop finishes.`, 6, { l1, l2, merged: [...merged] });
        
        if (l1 < l1List.length) {
            addStep("Append Remainder", `list1 still has nodes. Link curr.next to the remainder of list1.`, 19, { l1, l2, merged: [...merged] });
            while(l1 < l1List.length) {
                merged.push({ from: 'l1', val: l1List[l1], idx: l1 });
                l1++;
            }
            addStep("List 1 Appended", `All remaining nodes from list1 attached.`, 19, { l1, l2, merged: [...merged] });
        } else if (l2 < l2List.length) {
            addStep("Append Remainder", `list2 still has nodes. Link curr.next to the remainder of list2.`, 21, { l1, l2, merged: [...merged] });
            while(l2 < l2List.length) {
                merged.push({ from: 'l2', val: l2List[l2], idx: l2 });
                l2++;
            }
            addStep("List 2 Appended", `All remaining nodes from list2 attached.`, 21, { l1, l2, merged: [...merged] });
        }
        
        addStep("Return Result", `Return dummy.next (skipping the initial dummy node). Merge complete!`, 24, { l1, l2, merged: [...merged], isSuccess: true });
    } 
    else if (selectedApproachId === 'recursive') {
        let callStack: { depth: number, l1: number, l2: number }[] = [];
        
        const recurse = (i1: number, i2: number, depth: number) => {
            callStack.push({ depth, l1: i1, l2: i2 });
            let l1ValStr = i1 < l1List.length ? l1List[i1] : 'null';
            let l2ValStr = i2 < l2List.length ? l2List[i2] : 'null';
            
            addStep("Method Call", `mergeTwoLists(list1=${l1ValStr}, list2=${l2ValStr})`, 2, { l1: i1, l2: i2, merged: [...merged], callStack: [...callStack] });
            
            if (i1 >= l1List.length) {
                addStep("Base Case L1 Empty", `list1 is null. Returning remaining list2.`, 4, { l1: i1, l2: i2, merged: [...merged], callStack: [...callStack] });
                // For visualization, we append the rest of l2
                for(let k=i2; k<l2List.length; k++) merged.push({ from: 'l2', val: l2List[k], idx: k });
                callStack.pop();
                return;
            }
            if (i2 >= l2List.length) {
                addStep("Base Case L2 Empty", `list2 is null. Returning remaining list1.`, 5, { l1: i1, l2: i2, merged: [...merged], callStack: [...callStack] });
                for(let k=i1; k<l1List.length; k++) merged.push({ from: 'l1', val: l1List[k], idx: k });
                callStack.pop();
                return;
            }

            addStep("Compare Nodes", `Is list1.val (${l1List[i1]}) <= list2.val (${l2List[i2]})?`, 8, { l1: i1, l2: i2, merged: [...merged], callStack: [...callStack], comparing: true });
            
            if (l1List[i1] <= l2List[i2]) {
                addStep("Recurse L1", `Yes. list1 is the root. We set list1.next to the result of merging the rest.`, 9, { l1: i1, l2: i2, merged: [...merged], callStack: [...callStack], activeL1: true });
                merged.push({ from: 'l1', val: l1List[i1], idx: i1 });
                recurse(i1 + 1, i2, depth + 1);
                addStep("Return Linked L1", `Recursion unrolled. list1.next is linked. Returning list1.`, 10, { l1: i1, l2: i2, merged: [...merged], callStack: [...callStack] });
            } else {
                addStep("Recurse L2", `No. list2 is the root. We set list2.next to the result of merging the rest.`, 12, { l1: i1, l2: i2, merged: [...merged], callStack: [...callStack], activeL2: true });
                merged.push({ from: 'l2', val: l2List[i2], idx: i2 });
                recurse(i1, i2 + 1, depth + 1);
                addStep("Return Linked L2", `Recursion unrolled. list2.next is linked. Returning list2.`, 13, { l1: i1, l2: i2, merged: [...merged], callStack: [...callStack] });
            }
            callStack.pop();
        };

        recurse(0, 0, 0);
        addStep("Merge Complete", `Final recursive call returned. Merged list is built.`, 16, { l1: l1List.length, l2: l2List.length, merged: [...merged], callStack: [], isSuccess: true });
    }

    if (steps.length === 0) {
        // Fallback for empty lists
        addStep("Empty Inputs", "Both lists are empty.", 1, { l1: 0, l2: 0, merged: [], isSuccess: true });
    }

    return steps;
  }, [l1List, l2List, selectedApproachId]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedApproach.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0] || { state: {} };
  const state = cur.state || {};
  const { isSuccess, comparing, l1, l2, merged, callStack } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-100 flex items-center justify-center">
                <GitMerge className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Merge Sorted Lists</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 21</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Linked List</span>
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
              
              {/* Left Col: Approaches, Code & Variable Context (5/12) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                
                {/* Approach Selector */}
                <div className="grid grid-cols-2 gap-3">
                    {Object.values(APPROACHES).map((app) => {
                        const isSelected = selectedApproachId === app.id;
                        const [time, space] = app.complexity.split(' | ');
                        return (
                            <button 
                               key={app.id}
                               onClick={() => { setSelectedApproachId(app.id as keyof typeof APPROACHES); setCurrentStep(0); }}
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

                <div className="bg-[#0f172a] rounded-3xl h-[400px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
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
                      {/* Highlighter Bar */}
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : comparing ? 'bg-amber-500/15 border-amber-500' : 'bg-emerald-500/15 border-emerald-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="emerald" />
                      ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">
                              {selectedApproachId === 'iterative' ? 'Pointer States' : 'Call Stack'}
                          </h4>
                      </div>
                    </div>
                    
                    {selectedApproachId === 'iterative' ? (
                        <div className="grid grid-cols-2 gap-3">
                            <VariableCard label="list1 Node" val={l1 < l1List.length ? l1List[l1] : 'null'} color="sky" active={l1 < l1List.length} />
                            <VariableCard label="list2 Node" val={l2 < l2List.length ? l2List[l2] : 'null'} color="violet" active={l2 < l2List.length} />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pr-2">
                             {callStack && callStack.length > 0 ? callStack.slice().reverse().map((frame: any, idx: number) => (
                                 <div key={idx} className={`p-2.5 rounded-xl border flex items-center justify-between font-mono text-xs ${idx === 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-500 opacity-70'}`}>
                                     <span className="font-bold">merge({frame.l1 < l1List.length ? l1List[frame.l1] : 'null'}, {frame.l2 < l2List.length ? l2List[frame.l2] : 'null'})</span>
                                     <span className="text-[9px] uppercase tracking-widest opacity-60">Depth {frame.depth}</span>
                                 </div>
                             )) : <div className="text-xs text-slate-400 font-mono italic p-2 text-center">Stack Empty</div>}
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Simulation Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-emerald-600 uppercase block pl-1 tracking-widest font-mono">List 1 (sorted)</label>
                        <input type="text" value={l1Input} onChange={(e) => { setL1Input(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner" placeholder="e.g. 1, 2, 4" />
                    </div>
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-emerald-600 uppercase block pl-1 tracking-widest font-mono">List 2 (sorted)</label>
                        <input type="text" value={l2Input} onChange={(e) => { setL2Input(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner" placeholder="e.g. 1, 3, 4" />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Action Log / Status */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group ${comparing ? 'bg-amber-900 border-amber-800' : isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      <ListOrdered size={100}/>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={comparing ? "text-amber-400" : isSuccess ? "text-emerald-400" : "text-emerald-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${comparing ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>Line {cur.line}</div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line">{cur.description}</p>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[420px] relative flex flex-col overflow-hidden shadow-inner">
                  
                   {/* Top Legend */}
                   <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2"><Network size={14}/> Linked List Virtual Memory</span>
                      <div className="flex gap-4">
                         <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono"><div className="w-2.5 h-2.5 rounded-full bg-sky-400"/> List 1</div>
                         <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono"><div className="w-2.5 h-2.5 rounded-full bg-violet-400"/> List 2</div>
                      </div>
                   </div>

                   <div className="flex flex-col gap-10 overflow-x-auto pb-8 pt-4">
                       
                       {/* List 1 Track */}
                       <div className="flex items-center gap-2 min-w-max relative pl-20">
                          <div className="absolute left-0 text-xs font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100 w-16 text-center shadow-sm">L1</div>
                          {l1List.length === 0 && <span className="text-sm font-mono text-slate-300 italic px-4">null</span>}
                          {l1List.map((val, idx) => {
                              const isMerged = merged?.some(m => m.from === 'l1' && m.idx === idx);
                              const isCurrent = l1 === idx && !isMerged;
                              return (
                                <React.Fragment key={`l1-${idx}`}>
                                  <ListNodeBlock val={val} color="sky" isMerged={isMerged} isCurrent={isCurrent} pointerLabel={isCurrent ? 'list1' : undefined} />
                                  {idx < l1List.length - 1 && <ArrowRight size={16} className={isMerged ? "text-slate-200" : "text-sky-300"} />}
                                  {idx === l1List.length - 1 && <span className="text-xs font-mono text-slate-300 ml-2">null</span>}
                                </React.Fragment>
                              )
                          })}
                       </div>

                       {/* List 2 Track */}
                       <div className="flex items-center gap-2 min-w-max relative pl-20">
                          <div className="absolute left-0 text-xs font-black uppercase tracking-widest text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg border border-violet-100 w-16 text-center shadow-sm">L2</div>
                          {l2List.length === 0 && <span className="text-sm font-mono text-slate-300 italic px-4">null</span>}
                          {l2List.map((val, idx) => {
                              const isMerged = merged?.some(m => m.from === 'l2' && m.idx === idx);
                              const isCurrent = l2 === idx && !isMerged;
                              return (
                                <React.Fragment key={`l2-${idx}`}>
                                  <ListNodeBlock val={val} color="violet" isMerged={isMerged} isCurrent={isCurrent} pointerLabel={isCurrent ? 'list2' : undefined} />
                                  {idx < l2List.length - 1 && <ArrowRight size={16} className={isMerged ? "text-slate-200" : "text-violet-300"} />}
                                  {idx === l2List.length - 1 && <span className="text-xs font-mono text-slate-300 ml-2">null</span>}
                                </React.Fragment>
                              )
                          })}
                       </div>

                       {/* Merged Track */}
                       <div className="flex items-center gap-2 min-w-max relative pl-20 mt-6 pt-8 border-t-2 border-dashed border-emerald-100/50">
                          <div className="absolute left-0 text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 w-16 text-center shadow-md z-10">ANS</div>
                          {(!merged || merged.length === 0) && <span className="text-sm font-mono text-slate-300 italic px-4">... building ...</span>}
                          {merged?.map((m, idx) => {
                              const isLatest = idx === merged.length - 1;
                              const colorMap = { 'dummy': 'slate', 'l1': 'sky', 'l2': 'violet' };
                              return (
                                <React.Fragment key={`m-${idx}`}>
                                  <div className={`animate-in zoom-in slide-in-from-top-4 duration-300 flex items-center gap-2`}>
                                     <ListNodeBlock val={m.val} color={colorMap[m.from] as any} isMerged={false} isCurrent={isLatest && selectedApproachId === 'iterative'} pointerLabel={isLatest && selectedApproachId === 'iterative' ? 'curr' : undefined} isDummy={m.from === 'dummy'} />
                                  </div>
                                  <ArrowRight size={16} className="text-emerald-400 animate-in fade-in duration-500" strokeWidth={3} />
                                </React.Fragment>
                              )
                          })}
                          {merged && merged.length > 0 && <span className="text-xs font-mono text-slate-300 ml-2 animate-pulse">null</span>}
                       </div>
                   </div>

                  {/* Final Success Overlay */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-emerald-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-emerald-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto mt-20">
                          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">MERGE COMPLETE</span>
                              <span className="text-xs font-black uppercase text-emerald-600 tracking-widest font-mono">List successfully sorted</span>
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
                <Link className="text-emerald-600"/> Linked List Mechanics
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-emerald-100 pl-6">
                Merging linked lists is structurally different from merging arrays. Instead of allocating new memory to copy values, we simply <strong>rewire the pointers</strong> of the existing nodes to thread them together in the correct order.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-emerald-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Plus size={18}/> The "Dummy Node" Pattern
                        </h3>
                        <p className="text-sm text-emerald-800 leading-relaxed italic">
                            A common trick to handle edge cases effortlessly.
                        </p>
                        <p className="text-xs text-emerald-700 leading-relaxed mt-2">
                           When building a new linked list, the first node is always tricky because the head pointer starts as <code className="bg-emerald-200 px-1 rounded">null</code>. Instead of writing messy <code>if (head == null)</code> checks inside your loop, you create a "dummy" node. <br/><br/>
                           You attach all actual nodes to <code>dummy.next</code>. At the end, you just return <code>dummy.next</code> and let the garbage collector clean up the dummy!
                        </p>
                    </div>
                    
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowRight size={18}/> Pointer Traversal
                        </h3>
                        <p className="text-xs text-sky-800 leading-relaxed">
                            In an array, you do <code>i++</code>. In a linked list, you do <code>curr = curr.next</code>. In the iterative approach, we need three pointers moving simultaneously:
                        </p>
                        <ul className="text-xs text-sky-800 space-y-2 font-bold bg-sky-100/50 p-3 rounded-xl mt-2 list-none m-0">
                            <li>1. <code className="text-sky-600">list1</code>: Tracks our position in the first list.</li>
                            <li>2. <code className="text-violet-600">list2</code>: Tracks our position in the second list.</li>
                            <li>3. <code className="text-amber-600">curr</code>: Tracks the tail of our newly merged list, ready to attach the next smallest node.</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <GitMerge size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-emerald-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Appending the Remainder</h4>
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700 backdrop-blur-sm">
                            <p className="text-xs text-slate-300 leading-relaxed mb-4">
                                Because both input lists are already sorted, as soon as one list is completely exhausted (becomes <code>null</code>), the remaining nodes in the other list are guaranteed to be larger than everything we've merged so far, AND they are already connected in sorted order!
                            </p>
                            <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-700 pt-4 font-mono text-[10px] text-emerald-300 bg-emerald-900/30 p-3 rounded-xl">
                                // We don't need a loop to append the rest!<br/>
                                // Just one pointer reassignment:<br/><br/>
                                if (list1 != null) curr.next = list1;<br/>
                                else curr.next = list2;
                            </p>
                            <div className="mt-4 inline-block bg-sky-900/40 border border-sky-500/30 text-sky-400 px-3 py-1.5 rounded-lg text-[10px] uppercase font-black tracking-widest">
                                O(1) Final Splice
                            </div>
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
                        "While the recursive approach is mathematically elegant and demonstrates a deep understanding of recursive structures, the iterative approach using a dummy node is heavily preferred in production environments. The recursive approach consumes O(N+M) auxiliary space for the call stack, which can lead to a StackOverflowError if the linked lists are millions of nodes long. The iterative approach perfectly reorganizes the pointers in strictly O(1) auxiliary space, making it the robust, optimal choice."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Modifying inputs vs New Nodes
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                <strong className="text-slate-800">In-Place (Expected):</strong> We are asked to merge the lists by <em>splicing together the nodes</em>. This means we reassign the <code>.next</code> pointers of existing nodes. We do not instantiate <code>new ListNode()</code> (except the dummy).
                            </div>
                            <div className="text-xs text-slate-600 leading-relaxed">
                                <strong className="text-slate-800">Copying (Incorrect):</strong> If you create new nodes with the values and build an entirely new structure, it takes O(N+M) space and fails the implicit constraints of typical linked list algorithmic challenges.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N + M)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Where N and M are the lengths of the two lists. In the worst case, we traverse until both are exhausted.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1) Iterative / O(N+M) Recursive</span>
                                <p className="text-[10px] text-slate-500 mt-1">Iterative only uses a constant number of pointers (dummy, curr). Recursive pushes a frame to the call stack for every node processed.</p>
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

const VariableCard = ({ label, val, color, active }: { label: string, val: number | string | null, color: 'blue' | 'purple' | 'amber' | 'emerald' | 'sky' | 'violet', active: boolean }) => {
    const bgMap = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        sky: 'bg-sky-50 border-sky-200 text-sky-700',
        violet: 'bg-violet-50 border-violet-200 text-violet-700'
    };
    
    const inactiveMap = 'bg-slate-50 border-slate-200 text-slate-300';

    return (
        <div className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden ${active ? bgMap[color] : inactiveMap}`}>
             <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</span>
             <div className="text-xl font-black font-mono leading-none">
                 {val !== null ? val : '-'}
             </div>
        </div>
    );
};

const ListNodeBlock = ({ val, color, isMerged, isCurrent, pointerLabel, isDummy }: { val: number|string, color: 'sky' | 'violet' | 'slate', isMerged: boolean, isCurrent: boolean, pointerLabel?: string, isDummy?: boolean }) => {
    
    const colorMap = {
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', pointer: 'text-sky-600', dot: 'bg-sky-400' },
        violet: { bg: 'bg-violet-50', border: 'border-violet-400', text: 'text-violet-800', pointer: 'text-violet-600', dot: 'bg-violet-400' },
        slate: { bg: 'bg-slate-100', border: 'border-slate-400', text: 'text-slate-600', pointer: 'text-slate-600', dot: 'bg-slate-400' }
    };
    
    const activeColors = colorMap[color];
    const dimColors = { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-300', pointer: 'text-transparent', dot: 'bg-slate-200' };
    
    const style = isMerged ? dimColors : activeColors;

    return (
        <div className="relative flex flex-col items-center">
            {/* Pointer / Label */}
            <div className="absolute -top-8 h-6 flex flex-col items-center justify-end">
                {pointerLabel && (
                    <div className="flex flex-col items-center animate-in slide-in-from-top-2">
                        <span className={`text-[9px] font-black font-mono tracking-widest ${activeColors.pointer} bg-white px-1 rounded`}>{pointerLabel}</span>
                        <ArrowDown size={14} className={activeColors.pointer} strokeWidth={3}/>
                    </div>
                )}
            </div>

            {/* Node Box */}
            <div className={`flex items-center w-16 h-10 border-2 rounded-lg shadow-sm transition-all duration-300 ${style.bg} ${style.border} ${isCurrent ? 'scale-110 shadow-md ring-2 ring-amber-300 ring-offset-2 z-10' : ''}`}>
                <div className={`flex-1 flex justify-center font-mono font-black ${style.text} ${isDummy ? 'text-sm italic opacity-60' : 'text-lg'}`}>
                    {val}
                </div>
                <div className={`w-1/3 h-full border-l-2 ${style.border} flex items-center justify-center`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                </div>
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean, theme?: 'cyan' | 'violet' | 'rose' | 'emerald' }> = ({ num, code, active, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|ListNode)\b|\b\d+\b)/g).filter(Boolean);
  
  const bgActive = `bg-${theme}-500/10`;
  const borderActive = `bg-${theme}-500`;
  const textActive = `text-${theme}-400`;

  return (
    <div className={`flex relative z-10 min-h-[16.5px] transition-colors duration-200 ${active ? bgActive : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${borderActive}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-[10px] ${active ? `${textActive} font-bold` : 'text-slate-700'}`}>{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"') || part.startsWith("'")) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'void', 'for', 'break'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'long', 'boolean', 'String', 'ListNode'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-amber-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default MergeListsVisualizer;