import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Database, ListOrdered, Zap, ArrowLeftRight, Timer
} from 'lucide-react';

const APPROACHES = {
  optimalIterative: {
    id: 'optimalIterative',
    title: '1. Iterative (Optimal)',
    subtitle: 'O(N) Time, O(1) Space.',
    icon: <ArrowLeftRight size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        if (head == null || k == 1) return head;
        
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        
        ListNode curr = head;
        int count = 0;
        while (curr != null) {
            count++;
            curr = curr.next;
        }
        
        ListNode prevGroupTail = dummy;
        while (count >= k) {
            curr = prevGroupTail.next;
            ListNode prev = null;
            ListNode next = null;
            
            for (int i = 0; i < k; i++) {
                next = curr.next;
                curr.next = prev;
                prev = curr;
                curr = next;
            }
            
            ListNode groupHead = prevGroupTail.next;
            prevGroupTail.next = prev;
            groupHead.next = curr;
            
            prevGroupTail = groupHead;
            count -= k;
        }
        
        return dummy.next;
    }
}`,
    explanation: "The optimal approach reverses the nodes exactly in place without using extra memory. We first count the total number of nodes to know exactly how many full groups of 'k' we can reverse. Then, using a series of pointers (`prev`, `curr`, `next`), we perform standard linked list reversals in sub-segments, carefully rewiring the `prevGroupTail` and `groupHead` to stitch the reversed sub-segment back into the main list."
  },
  stackBased: {
    id: 'stackBased',
    title: '2. Stack-Based',
    subtitle: 'Easier logic. O(N) Time, O(K) Space.',
    icon: <Database size={16} />,
    complexity: 'Time: O(N) | Space: O(K)',
    code: `class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        if (head == null || k == 1) return head;
        
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode prevGroupTail = dummy;
        ListNode curr = head;
        
        Stack<ListNode> stack = new Stack<>();
        
        while (curr != null) {
            ListNode temp = curr;
            for (int i = 0; i < k && temp != null; i++) {
                stack.push(temp);
                temp = temp.next;
            }
            
            if (stack.size() != k) break;
            
            while (!stack.isEmpty()) {
                prevGroupTail.next = stack.pop();
                prevGroupTail = prevGroupTail.next;
            }
            
            prevGroupTail.next = temp;
            curr = temp;
        }
        
        return dummy.next;
    }
}`,
    explanation: "The Stack approach leverages a Last-In-First-Out (LIFO) structure to naturally reverse the order of nodes. We push 'k' nodes into the stack. If we successfully gathered 'k' nodes, we pop them out one by one and attach them sequentially to our growing result list. This makes the logic much simpler to reason about, at the cost of O(K) extra memory to hold the stack."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">25. Reverse Nodes in k-Group</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given the <code>head</code> of a linked list, reverse the nodes of the list <code>k</code> at a time, and return the modified list.
        </p>

        <p className="text-lg leading-relaxed">
          <code>k</code> is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of <code>k</code> then left-out nodes, in the end, should remain as it is.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-violet-500 pl-4 bg-violet-50 py-2 mt-4">
          You may not alter the values in the list's nodes, only nodes themselves may be changed.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm flex gap-3 mt-6 items-start shadow-sm">
            <AlertCircle className="shrink-0 mt-0.5 text-amber-500" size={18} />
            <div className="space-y-2">
                <p><strong>Follow-up Challenge:</strong></p>
                <p>Can you solve the problem in <code>O(1)</code> extra memory space?</p>
            </div>
        </div>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2 flex flex-col items-center">
              <div className="w-full text-left mb-2 text-slate-400 font-bold">Input: head = [1,2,3,4,5], k = 2</div>
              <div className="flex items-center gap-2 font-bold text-lg text-slate-700">
                <span className="text-violet-600">2</span> <span>→</span> <span className="text-violet-600">1</span> <span>→</span>
                <span className="text-sky-600">4</span> <span>→</span> <span className="text-sky-600">3</span> <span>→</span>
                <span className="text-slate-400">5</span>
              </div>
              <div className="w-full text-left mt-2 text-slate-400 font-bold">Output: [2,1,4,3,5]</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2 flex flex-col items-center">
              <div className="w-full text-left mb-2 text-slate-400 font-bold">Input: head = [1,2,3,4,5], k = 3</div>
              <div className="flex items-center gap-2 font-bold text-lg text-slate-700">
                <span className="text-violet-600">3</span> <span>→</span> <span className="text-violet-600">2</span> <span>→</span> <span className="text-violet-600">1</span> <span>→</span>
                <span className="text-slate-400">4</span> <span>→</span> <span className="text-slate-400">5</span>
              </div>
              <div className="w-full text-left mt-2 text-slate-400 font-bold">Output: [3,2,1,4,5]</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ReverseKGroupVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('optimalIterative');
  const [numsInput, setNumsInput] = useState('1, 2, 3, 4, 5');
  const [kInput, setKInput] = useState('2');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let arr = numsInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    let k = parseInt(kInput.trim());
    if (isNaN(k) || k < 1) k = 1;
    if (arr.length === 0) arr = [1, 2, 3, 4, 5];
    if (arr.length > 8) arr = arr.slice(0, 8); // Limit size for visualizer stability
    return { arr, k };
  }, [numsInput, kInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { arr, k } = parsedData;
    
    // Internal state simulation helpers
    let nodes = { dummy: { id: 'dummy', val: 'D', next: arr.length > 0 ? '0' : null } };
    arr.forEach((val, i) => { 
        nodes[i.toString()] = { id: i.toString(), val, next: i < arr.length - 1 ? (i+1).toString() : null }; 
    });
    
    const cloneNodes = (n) => JSON.parse(JSON.stringify(n));

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return;
      steps.push({ phase, description: desc, line, state: { ...vars, nodes: cloneNodes(nodes) } });
    };

    let head = arr.length > 0 ? '0' : null;

    if (selectedApproachId === 'optimalIterative') {
        addStep("Init", "Start algorithm", 1, { head, k });
        addStep("Base Case", `Line 3: if (head == null || k == 1) return head;`, 3, { head, k });
        if (!head || k === 1) {
            addStep("Return Base", "Line 3: Returning unmodified list.", 3, { head, k, isSuccess: true });
            return steps;
        }

        let dummy = 'dummy';
        addStep("Dummy Node", "Line 5: ListNode dummy = new ListNode(0);", 5, { head, k, dummy });
        addStep("Connect Dummy", "Line 6: dummy.next = head;", 6, { head, k, dummy });

        let curr = head;
        let count = 0;
        addStep("Init Count", "Line 8-9: ListNode curr = head; int count = 0;", 9, { head, k, dummy, curr, count });

        while (curr !== null) {
            addStep("Count Loop", "Line 10: while (curr != null)", 10, { head, k, dummy, curr, count });
            count++;
            curr = nodes[curr].next;
            addStep("Counting", `Line 11-12: count++; curr = curr.next; (Count is ${count})`, 12, { head, k, dummy, curr, count });
        }
        addStep("Count End", `Line 10: Loop ends. Total count is ${count}.`, 10, { head, k, dummy, curr, count });

        let prevGroupTail = dummy;
        addStep("Init Reversal", "Line 15: ListNode prevGroupTail = dummy;", 15, { head, k, dummy, curr, count, prevGroupTail });

        let safeCounter = 0;
        while (count >= k && safeCounter++ < 50) {
            addStep("Check Group", `Line 16: while (count >= k) - ${count} >= ${k} is true.`, 16, { head, k, dummy, curr, count, prevGroupTail });
            
            curr = nodes[prevGroupTail].next;
            let prev = null;
            let next = null;
            addStep("Group Pointers", "Line 17-19: Setup pointers for reversing this group.", 19, { head, k, dummy, curr, count, prevGroupTail, prev, next });

            for (let i = 0; i < k; i++) {
                addStep("Reverse Loop", `Line 21: for i = ${i} to ${k-1}`, 21, { head, k, dummy, curr, count, prevGroupTail, prev, next, i });
                
                next = nodes[curr].next;
                addStep("Save Next", "Line 22: next = curr.next;", 22, { head, k, dummy, curr, count, prevGroupTail, prev, next, i });
                
                nodes[curr].next = prev;
                addStep("Reverse Link", `Line 23: curr.next = prev; (Node ${nodes[curr].val} points to ${prev ? nodes[prev].val : 'null'})`, 23, { head, k, dummy, curr, count, prevGroupTail, prev, next, i });
                
                prev = curr;
                addStep("Move Prev", "Line 24: prev = curr;", 24, { head, k, dummy, curr, count, prevGroupTail, prev, next, i });
                
                curr = next;
                addStep("Move Curr", "Line 25: curr = next;", 25, { head, k, dummy, curr, count, prevGroupTail, prev, next, i });
            }

            let groupHead = nodes[prevGroupTail].next;
            addStep("Find Group Head", "Line 28: ListNode groupHead = prevGroupTail.next;", 28, { head, k, dummy, curr, count, prevGroupTail, prev, next, groupHead });

            nodes[prevGroupTail].next = prev;
            addStep("Connect Prev Tail", `Line 29: prevGroupTail.next = prev; (Tail now points to ${nodes[prev].val})`, 29, { head, k, dummy, curr, count, prevGroupTail, prev, next, groupHead });

            nodes[groupHead].next = curr;
            addStep("Connect Group Head", `Line 30: groupHead.next = curr; (Head now points to ${curr ? nodes[curr].val : 'null'})`, 30, { head, k, dummy, curr, count, prevGroupTail, prev, next, groupHead });

            prevGroupTail = groupHead;
            count -= k;
            addStep("Update Variables", `Line 32-33: prevGroupTail = groupHead; count -= k; (Remaining count: ${count})`, 33, { head, k, dummy, curr, count, prevGroupTail, prev, next, groupHead });
        }
        
        addStep("Check Group", `Line 16: while (count >= k) - ${count} >= ${k} is false.`, 16, { head, k, dummy, curr, count, prevGroupTail });
        addStep("Return Result", "Line 36: return dummy.next;", 36, { head, k, dummy, curr, count, prevGroupTail, isSuccess: true });
        
    } else if (selectedApproachId === 'stackBased') {
        addStep("Init", "Start algorithm", 1, { head, k });
        addStep("Base Case", `Line 3: if (head == null || k == 1) return head;`, 3, { head, k });
        if (!head || k === 1) {
            addStep("Return Base", "Line 3: Returning unmodified list.", 3, { head, k, isSuccess: true });
            return steps;
        }

        let dummy = 'dummy';
        let prevGroupTail = dummy;
        let curr = head;
        addStep("Dummy & Pointers", "Line 5-8: Setup dummy, prevGroupTail, curr", 8, { head, k, dummy, prevGroupTail, curr });

        let stack = [];
        addStep("Init Stack", "Line 10: Stack<ListNode> stack = new Stack<>();", 10, { head, k, dummy, prevGroupTail, curr, stack: [...stack] });

        let safeCounter = 0;
        while (curr !== null && safeCounter++ < 50) {
            addStep("Main Loop", "Line 12: while (curr != null)", 12, { head, k, dummy, prevGroupTail, curr, stack: [...stack] });
            
            let temp = curr;
            addStep("Set Temp", "Line 13: ListNode temp = curr;", 13, { head, k, dummy, prevGroupTail, curr, temp, stack: [...stack] });

            for (let i = 0; i < k && temp !== null; i++) {
                addStep("Push Loop", `Line 14: Gathering node ${i+1}/${k}`, 14, { head, k, dummy, prevGroupTail, curr, temp, stack: [...stack], i });
                stack.push(temp);
                addStep("Push to Stack", `Line 15: stack.push(temp);`, 15, { head, k, dummy, prevGroupTail, curr, temp, stack: [...stack], i });
                temp = nodes[temp].next;
                addStep("Move Temp", `Line 16: temp = temp.next;`, 16, { head, k, dummy, prevGroupTail, curr, temp, stack: [...stack], i });
            }

            addStep("Check Size", `Line 19: if (stack.size() != k) break; (Size is ${stack.length})`, 19, { head, k, dummy, prevGroupTail, curr, temp, stack: [...stack] });
            if (stack.length !== k) {
                addStep("Break Loop", "Line 19: Not enough nodes to reverse. Break out of loop.", 19, { head, k, dummy, prevGroupTail, curr, temp, stack: [...stack] });
                break;
            }

            while (stack.length > 0) {
                addStep("Pop Loop", "Line 21: while (!stack.isEmpty())", 21, { head, k, dummy, prevGroupTail, curr, temp, stack: [...stack] });
                let popped = stack.pop();
                nodes[prevGroupTail].next = popped;
                addStep("Relink from Stack", `Line 22: prevGroupTail.next = stack.pop(); (Linking to ${nodes[popped].val})`, 22, { head, k, dummy, prevGroupTail, curr, temp, stack: [...stack] });
                prevGroupTail = popped;
                addStep("Move Tail", "Line 23: prevGroupTail = prevGroupTail.next;", 23, { head, k, dummy, prevGroupTail, curr, temp, stack: [...stack] });
            }

            nodes[prevGroupTail].next = temp;
            addStep("Connect Remainder", "Line 26: prevGroupTail.next = temp;", 26, { head, k, dummy, prevGroupTail, curr, temp, stack: [...stack] });
            
            curr = temp;
            addStep("Update Curr", "Line 27: curr = temp;", 27, { head, k, dummy, prevGroupTail, curr, temp, stack: [...stack] });
        }
        
        addStep("Main Loop Ends", "Line 12: while (curr != null) is false.", 12, { head, k, dummy, prevGroupTail, curr, stack: [...stack] });
        addStep("Return Result", "Line 30: return dummy.next;", 30, { head, k, dummy, prevGroupTail, curr, stack: [...stack], isSuccess: true });
    }

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
  const { isSuccess, head, k, dummy, curr, count, prevGroupTail, prev, next, groupHead, temp, stack, nodes } = state;

  const orderedIds = ['dummy', ...parsedData.arr.map((_, i) => i.toString())];

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Layers className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Rev. K-Group</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 25</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Linked List / Pointers</span>
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
                <div className="grid grid-cols-2 gap-3">
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : 'bg-violet-500/20 border-violet-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="violet" />
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Variables</h4>
                      </div>
                    </div>
                    
                    {selectedApproachId === 'optimalIterative' ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <VariableCard label="Count" val={count ?? null} color="sky" active={count !== null && count !== undefined} />
                            <VariableCard label="Target (k)" val={k ?? null} arrVal={undefined} color="purple" active={k !== null && k !== undefined} />
                            <VariableCard label="curr" val={curr ?? null} arrVal={curr !== null && curr !== undefined && nodes && nodes[curr] ? nodes[curr].val : null} color="rose" active={curr !== null && curr !== undefined} />
                            <VariableCard label="prevGrpTail" val={prevGroupTail ?? null} arrVal={prevGroupTail !== null && prevGroupTail !== undefined && nodes && nodes[prevGroupTail] ? nodes[prevGroupTail].val : null} color="indigo" active={prevGroupTail !== null && prevGroupTail !== undefined} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-3">
                            <VariableCard label="curr" val={curr ?? null} arrVal={curr !== null && nodes && nodes[curr] ? nodes[curr].val : null} color="rose" active={curr !== null} />
                            <VariableCard label="temp" val={temp ?? null} arrVal={temp !== null && nodes && nodes[temp] ? nodes[temp].val : null} color="fuchsia" active={temp !== null} />
                            <VariableCard label="prevGrpTail" val={prevGroupTail ?? null} arrVal={prevGroupTail !== null && nodes && nodes[prevGroupTail] ? nodes[prevGroupTail].val : null} color="indigo" active={prevGroupTail !== null} />
                            <VariableCard label="Stack Size" val={stack ? stack.length : null} arrVal={undefined} color="emerald" active={stack !== undefined} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">List Nodes (CSV)</label>
                        <input type="text" value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="1, 2, 3, 4, 5" />
                    </div>
                    
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Group Size (k)</label>
                        <input type="number" value={kInput} onChange={(e) => { setKInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner" placeholder="2" min="1" />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-violet-100 hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : <ArrowLeftRight size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : "text-violet-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line">{cur.description}</p>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-center justify-center">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 gap-10 pt-16">
                      
                      {/* Array Representation of Logical Nodes */}
                      <div className="flex gap-4 md:gap-6 flex-wrap justify-center relative w-full mb-8">
                          {nodes && orderedIds.map((nodeId, idx) => {
                              if (!nodes[nodeId]) return null;
                              const node = nodes[nodeId];
                              
                              let pointers = [];
                              if (head === nodeId) pointers.push({ label: 'head', bg: 'bg-violet-100', text: 'text-violet-700' });
                              if (curr === nodeId) pointers.push({ label: 'curr', bg: 'bg-rose-100', text: 'text-rose-700' });
                              if (prevGroupTail === nodeId) pointers.push({ label: 'prevGT', bg: 'bg-indigo-100', text: 'text-indigo-700' });
                              if (prev === nodeId) pointers.push({ label: 'prev', bg: 'bg-sky-100', text: 'text-sky-700' });
                              if (next === nodeId) pointers.push({ label: 'next', bg: 'bg-emerald-100', text: 'text-emerald-700' });
                              if (groupHead === nodeId) pointers.push({ label: 'grpHd', bg: 'bg-amber-100', text: 'text-amber-700' });
                              if (temp === nodeId) pointers.push({ label: 'temp', bg: 'bg-fuchsia-100', text: 'text-fuchsia-700' });

                              // Check if node is currently in the stack
                              const inStack = stack && stack.includes(nodeId);

                              return (
                                  <div key={`${idx}-${node.val}`} className={`flex flex-col items-center relative transition-all duration-300 ${inStack ? 'opacity-40 scale-90' : 'z-20'}`}>
                                      {/* Top Pointers */}
                                      <div className="absolute -top-16 flex flex-col items-center justify-end h-14 w-full gap-1">
                                          {pointers.map((p, i) => (
                                              <span key={i} className={`text-[9px] font-black font-mono tracking-widest px-1.5 py-0.5 rounded ${p.bg} ${p.text} shadow-sm border border-black/5`}>
                                                  {p.label}
                                              </span>
                                          ))}
                                      </div>

                                      {/* Main Node Circle */}
                                      <div className={`w-12 h-12 md:w-16 md:h-16 border-[3px] rounded-full flex flex-col items-center justify-center font-mono font-black text-lg md:text-xl transition-all duration-500 shadow-sm ${nodeId === 'dummy' ? 'bg-slate-50 border-slate-300 text-slate-400' : 'bg-white border-violet-500 text-violet-900'}`}>
                                          <span>{node.val}</span>
                                      </div>
                                      
                                      {/* Bottom Explicit Pointer */}
                                      <div className="mt-3 flex flex-col items-center z-10">
                                          <div className={`h-4 w-0.5 transition-colors ${node.next === null ? 'bg-slate-200' : 'bg-violet-400'}`}></div>
                                          <div className={`px-2 py-1 rounded shadow-sm text-[10px] font-mono font-bold whitespace-nowrap border transition-colors ${node.next === null ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-violet-50 text-violet-700 border-violet-200'}`}>
                                              {node.next === null ? 'null' : `➡ ${nodes[node.next]?.val}`}
                                          </div>
                                      </div>
                                  </div>
                              );
                          })}
                      </div>

                      {/* Stack Visualization */}
                      {selectedApproachId === 'stackBased' && stack !== undefined && (
                          <div className="absolute right-4 md:right-8 top-4 md:top-8 w-16 md:w-24 flex flex-col items-center">
                              <div className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest font-mono">Stack</div>
                              <div className="border-x-2 border-b-2 border-slate-300 rounded-b-xl w-full flex flex-col-reverse justify-start p-1.5 gap-1.5 bg-slate-50 min-h-[140px] shadow-inner">
                                  {stack.map((nodeId, idx) => (
                                      <div key={idx} className="bg-violet-500 border border-violet-700 rounded-lg text-center py-1.5 font-mono text-sm font-bold text-white shadow-sm animate-in zoom-in duration-300">
                                          {nodes[nodeId]?.val}
                                      </div>
                                  ))}
                                  {stack.length === 0 && <div className="text-center text-slate-300 text-[10px] font-mono mt-auto mb-2 tracking-widest">EMPTY</div>}
                              </div>
                          </div>
                      )}

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-emerald-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-emerald-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">REVERSAL COMPLETE</span>
                              <span className="text-xs font-black uppercase text-emerald-600 tracking-widest font-mono mb-4 block">Returned Modified List</span>
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
                <ArrowLeftRight className="text-violet-600"/> Reversing Linked Lists
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Reversing a linked list involves manipulating the <code>next</code> pointers of the nodes. Doing this in blocks of `k` adds complexity because we must correctly manage the "seams" — stitching the reversed block back into the unmodified parts of the list.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ListOrdered size={18}/> The Dummy Node Technique
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            The `dummy` node is a crucial pattern in linked list problems where the <strong>head of the list might change</strong>.
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-3 rounded-lg border border-sky-200">
                            By creating a `dummy` node and pointing it to `head` (`dummy.next = head`), we avoid writing complex `if` statements for handling the very first group reversal. We simply return `dummy.next` at the very end.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Zap size={18}/> Stack vs. In-Place
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            Using a <strong>Stack</strong> makes reversal trivial because a stack naturally reverses order (LIFO). However, it requires <code>O(K)</code> memory space.
                        </p>
                        <p className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-3 rounded-lg border border-amber-200">
                            The <strong>In-Place</strong> method satisfies the `O(1)` space constraint but requires juggling three pointers (`prev`, `curr`, `next`) inside a tight loop to safely rewire connections without losing the rest of the list.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Database size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-violet-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Managing the "Seams"</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed">
                        <p>
                           When reversing a sub-segment `A → B → C`, `A` becomes the tail and `C` becomes the head. We need to connect the node *before* the segment to `C`, and connect `A` to the node *after* the segment.
                        </p>
                        <div className="bg-violet-900/40 border border-violet-500/30 text-violet-300 p-4 rounded-xl mt-4 font-mono text-[10px]">
                           // Save the head of the un-reversed group:<br/>
                           ListNode groupHead = prevGroupTail.next;<br/><br/>
                           // Connect the old tail to the new head:<br/>
                           prevGroupTail.next = prev;<br/><br/>
                           // Connect the new tail to the un-reversed remainder:<br/>
                           groupHead.next = curr;
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
                        "I chose the iterative in-place approach to strictly satisfy the O(1) space complexity follow-up constraint. I utilized a `dummy` node to gracefully handle the case where the list's head changes. By iterating through the list first to count the nodes, I ensured that we never reverse a group smaller than `k`. During the reversal process, I maintained pointers to the tail of the previous group to carefully re-stitch the reversed segments back into the main list without causing cycles or losing node references."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Why not use Recursion?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                A recursive approach is highly elegant and requires fewer lines of code. However, recursive solutions utilize the implicit call stack. If the linked list is very large, this will result in an <code>O(N/K)</code> memory footprint, failing the strict <code>O(1)</code> memory requirement. It can also cause a StackOverflow Error on deeply nested lists.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We iterate through the list once to count the nodes <code>O(N)</code>, and then we process elements in groups of 'k' to reverse them, visiting each node at most one more time. Total time remains strictly linear.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We only allocate a few pointer references (`dummy`, `curr`, `prevGroupTail`, `next`, `prev`). The memory utilized does not scale with the size of the input list `N`.</p>
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

const VariableCard = ({ label, val, arrVal, color, active }: { label: string; val: any; arrVal?: any; color: string; active: boolean }) => {
    const bgMap = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        sky: 'bg-sky-50 border-sky-200 text-sky-700',
        violet: 'bg-violet-50 border-violet-200 text-violet-700',
        rose: 'bg-rose-50 border-rose-200 text-rose-700',
        indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
        fuchsia: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700'
    };
    
    const inactiveMap = 'bg-slate-50 border-slate-200 text-slate-300';

    return (
        <div className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden h-full ${active ? bgMap[color] : inactiveMap}`}>
             <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 truncate px-1">{label}</span>
             <div className={`text-xl font-black font-mono leading-none`}>
                 {val !== null && val !== undefined ? val : '-'}
             </div>
             {active && arrVal !== undefined && arrVal !== null && (
                 <div className="absolute bottom-0 w-full text-center bg-black/5 text-[9px] font-black py-0.5 mt-2">
                     val: {arrVal}
                 </div>
             )}
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'violet' }: { key?: number; num: number; code: string; active: boolean; theme?: string }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|Stack)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for', 'continue', 'break'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'long', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math', 'Arrays', 'ArrayList', 'ListNode', 'Stack'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-yellow-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default ReverseKGroupVisualizer;