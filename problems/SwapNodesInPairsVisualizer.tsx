import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, Link, ArrowRight,
  Repeat, Shuffle, IterationCcw, GitMerge
} from 'lucide-react';

const APPROACHES = {
  iterative: {
    id: 'iterative',
    title: '1. Iterative (Dummy Node)',
    subtitle: 'Optimal: O(N) Time, O(1) Space.',
    icon: <IterationCcw size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public ListNode swapPairs(ListNode head) {
        // Dummy node acts as the 'prev' for the very first pair
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode prev = dummy;
        
        // Loop while there is a valid pair to swap
        while (prev.next != null && prev.next.next != null) {
            // Identify the two nodes to swap
            ListNode first = prev.next;
            ListNode second = prev.next.next;
            
            // 1. Point 'prev' to the new head of this pair (second)
            prev.next = second;
            // 2. Point 'first' to the rest of the list
            first.next = second.next;
            // 3. Point 'second' back to 'first' to complete the swap
            second.next = first;
            
            // Advance 'prev' to the end of the swapped pair
            prev = first;
        }
        
        return dummy.next;
    }
}`,
    explanation: "The iterative approach uses a `dummy` node to gracefully handle swapping the very first pair without writing messy edge-case logic. We maintain a `prev` pointer (initially the dummy). In each step, we identify `first` (prev.next) and `second` (prev.next.next). We perform a 3-step pointer swap: 1) The node before the pair (`prev`) must point to `second`. 2) `first` must point to whatever comes after the pair (`second.next`). 3) `second` points back to `first`. Finally, we jump `prev` forward by two nodes (which is now the `first` node) to prepare for the next pair."
  },
  recursive: {
    id: 'recursive',
    title: '2. Recursive',
    subtitle: 'Elegant: O(N) Time, O(N) Space.',
    icon: <GitMerge size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public ListNode swapPairs(ListNode head) {
        // Base case: 0 or 1 node left, no swap possible
        if (head == null || head.next == null) {
            return head;
        }
        
        // Identify the pair
        ListNode first = head;
        ListNode second = head.next;
        
        // Recursive call: 'first' takes the result of the remaining swapped list
        first.next = swapPairs(second.next);
        
        // Complete the swap for the current pair
        second.next = first;
        
        // 'second' is now the new head of this pair
        return second;
    }
}`,
    explanation: "The recursive approach breaks the list down into smaller subproblems. We only care about swapping the current `first` and `second` nodes. What happens to the rest of the list? We trust the recursion to handle it! We say: `first.next` will simply point to the result of `swapPairs(second.next)`. Once the recursion returns that fully swapped sublist, we finalize our local swap by pointing `second.next` to `first`. We then return `second`, as it is the new head of our current pair. While elegant, this requires O(N) call stack space."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">24. Swap Nodes in Pairs</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem without modifying the values in the list's nodes (i.e., only nodes themselves may be changed.)
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> head = [1,2,3,4]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [2,1,4,3]</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: The first pair (1,2) is swapped to (2,1). The second pair (3,4) is swapped to (4,3).</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> head = []</p>
              <p><span className="text-slate-400 font-bold">Output:</span> []</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> head = [1]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [1]</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li>The number of nodes in the list is in the range <code>[0, 100]</code>.</li>
              <li><code>0 &lt;= Node.val &lt;= 100</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const SwapNodesInPairsVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('iterative');
  const [headInput, setHeadInput] = useState('1, 2, 3, 4, 5');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let arr = headInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    // UI Safeguard to prevent overflowing the visual arena
    if (arr.length > 8) arr = arr.slice(0, 8); 
    return { arr };
  }, [headInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { arr } = parsedData;

    const cloneNodes = (nodes) => {
        const cloned = {};
        for (const key in nodes) {
            cloned[key] = { ...nodes[key] };
        }
        return cloned;
    };

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 1500) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'iterative') {
        let nodes = {};
        nodes['dummy'] = { id: 'dummy', val: 'D', next: arr.length > 0 ? 'node_0' : null, type: 'dummy' };
        
        for (let i = 0; i < arr.length; i++) {
            nodes[`node_${i}`] = { 
                id: `node_${i}`, 
                val: arr[i], 
                next: i < arr.length - 1 ? `node_${i+1}` : null,
                type: 'standard'
            };
        }

        addStep(
            "Initialization", 
            `Line 3-5: ListNode dummy = new ListNode(0);\ndummy.next = head;\nListNode prev = dummy;\n\nWe initialize a dummy node to act as the 'prev' pointer for the very first pair.`, 
            5, 
            { nodes: cloneNodes(nodes), prev: 'dummy', first: null, second: null, action: 'init' }
        );

        let prev = 'dummy';
        let iter = 0;

        while (true) {
            if (iter++ > 50) break;
            
            let firstCheck = nodes[prev] ? nodes[prev].next : null;
            let secondCheck = firstCheck ? nodes[firstCheck].next : null;

            addStep(
                "Evaluate Loop Condition", 
                `Line 8: while (prev.next != null && prev.next.next != null)\n\nAre there at least two nodes ahead of 'prev' to form a pair?\n${(firstCheck && secondCheck) ? 'TRUE. We have a pair to swap.' : 'FALSE. Less than two nodes remain. Loop ends.'}`, 
                8, 
                { nodes: cloneNodes(nodes), prev, first: null, second: null, action: 'evalCond' }
            );

            if (!firstCheck || !secondCheck) {
                break;
            }

            let first = firstCheck;
            let second = secondCheck;

            addStep(
                "Identify Pair", 
                `Line 10-11: ListNode first = prev.next;\nListNode second = prev.next.next;\n\nWe identify the two nodes that need to be swapped.`, 
                11, 
                { nodes: cloneNodes(nodes), prev, first, second, action: 'identify' }
            );

            // 1. prev.next = second
            nodes[prev].next = second;
            addStep(
                "Swap Step 1: Link Prev to Second", 
                `Line 14: prev.next = second;\n\nThe node before the pair now bypasses 'first' and directly points to 'second'. This makes 'second' the new head of this sub-segment.`, 
                14, 
                { nodes: cloneNodes(nodes), prev, first, second, action: 'swap1' }
            );

            // 2. first.next = second.next
            nodes[first].next = nodes[second].next;
            addStep(
                "Swap Step 2: Link First to Rest", 
                `Line 16: first.next = second.next;\n\n'first' will become the tail of this pair, so it must point to the rest of the list (whatever comes after 'second').`, 
                16, 
                { nodes: cloneNodes(nodes), prev, first, second, action: 'swap2' }
            );

            // 3. second.next = first
            nodes[second].next = first;
            addStep(
                "Swap Step 3: Link Second to First", 
                `Line 18: second.next = first;\n\nThe internal swap is complete! 'second' now points back to 'first'.`, 
                18, 
                { nodes: cloneNodes(nodes), prev, first, second, action: 'swap3' }
            );

            // Advance prev
            prev = first;
            addStep(
                "Advance Prev Pointer", 
                `Line 21: prev = first;\n\nWe move 'prev' forward to point to 'first' (which is now the last node of the swapped pair), preparing for the next iteration.`, 
                21, 
                { nodes: cloneNodes(nodes), prev, first: null, second: null, action: 'movePrev' }
            );
        }

        addStep(
            "Return Result", 
            `Line 24: return dummy.next;\n\nThe loop has finished. We return dummy.next, which is the true new head of the swapped list.`, 
            24, 
            { nodes: cloneNodes(nodes), prev: null, first: null, second: null, action: 'success', isSuccess: true }
        );

    } else if (selectedApproachId === 'recursive') {
        
        let nodes = {};
        if (arr.length > 0) {
            for (let i = 0; i < arr.length; i++) {
                nodes[`node_${i}`] = { 
                    id: `node_${i}`, 
                    val: arr[i], 
                    next: i < arr.length - 1 ? `node_${i+1}` : null,
                    type: 'standard'
                };
            }
        }

        let initialHead = arr.length > 0 ? 'node_0' : null;

        addStep(
            "Initial Call", 
            `Starting recursive algorithm...`, 
            2, 
            { nodes: cloneNodes(nodes), callStack: [], head: initialHead, first: null, second: null, action: 'init' }
        );

        const recurse = (headId, depth, callStack) => {
            if (steps.length > 1500) return null;
            
            let currentStack = [...callStack, headId];

            addStep(
                `Enter swapPairs (Depth ${depth})`, 
                `Line 2: public ListNode swapPairs(ListNode head)\n\nEntering recursion. Current head is [${headId ? nodes[headId].val : 'null'}].`, 
                2, 
                { nodes: cloneNodes(nodes), callStack: currentStack, head: headId, first: null, second: null, action: 'enter' }
            );

            let hasNext = headId && nodes[headId].next;

            addStep(
                "Evaluate Base Case", 
                `Line 4: if (head == null || head.next == null)\n\nAre there fewer than 2 nodes left to swap?`, 
                4, 
                { nodes: cloneNodes(nodes), callStack: currentStack, head: headId, first: null, second: null, action: 'evalBase' }
            );

            if (!headId || !hasNext) {
                addStep(
                    "Base Case Hit", 
                    `Line 5: return head;\n\nNot enough nodes to form a pair. Returning the remaining head.`, 
                    5, 
                    { nodes: cloneNodes(nodes), callStack: currentStack, head: headId, first: null, second: null, action: 'returnBase' }
                );
                return headId;
            }

            let first = headId;
            let second = nodes[headId].next;
            let nextSublist = nodes[second].next;

            addStep(
                "Identify Pair", 
                `Line 9-10: ListNode first = head; ListNode second = head.next;\n\nWe identify 'first' and 'second' for the current pair.`, 
                10, 
                { nodes: cloneNodes(nodes), callStack: currentStack, head: headId, first, second, action: 'identify' }
            );

            addStep(
                "Recursive Call", 
                `Line 13: swapPairs(second.next);\n\nBefore we swap our current pair, we recursively swap the entire REST of the linked list starting from 'second.next'.`, 
                13, 
                { nodes: cloneNodes(nodes), callStack: currentStack, head: headId, first, second, action: 'callRecurse' }
            );

            let newSublistHead = recurse(nextSublist, depth + 1, currentStack);

            // Back from recursion
            nodes[first].next = newSublistHead;
            
            addStep(
                "Link First to Swapped Sublist", 
                `Line 13: first.next = swapPairs(...);\n\nRecursion returned! We link 'first.next' to the head of the newly swapped sublist.`, 
                13, 
                { nodes: cloneNodes(nodes), callStack: currentStack, head: headId, first, second, action: 'swap1' }
            );

            nodes[second].next = first;
            
            addStep(
                "Complete Local Swap", 
                `Line 16: second.next = first;\n\nWe complete the swap for the current pair by pointing 'second' back to 'first'.`, 
                16, 
                { nodes: cloneNodes(nodes), callStack: currentStack, head: headId, first, second, action: 'swap2' }
            );

            addStep(
                `Return New Head (Depth ${depth})`, 
                `Line 19: return second;\n\n'second' is now the head of this localized pair. We return it to the caller.`, 
                19, 
                { nodes: cloneNodes(nodes), callStack: currentStack, head: headId, first, second, action: 'return' }
            );

            return second;
        };

        let finalHead = recurse(initialHead, 0, []);

        addStep(
            "Algorithm Complete", 
            `Recursion has fully unwound. The list is completely swapped in pairs.`, 
            2, 
            { nodes: cloneNodes(nodes), callStack: [], head: finalHead, first: null, second: null, action: 'success', isSuccess: true }
        );
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
  const { isSuccess, action, nodes, prev, first, second, head: activeHead } = state;
  const { arr } = parsedData;

  // Flatten the linked list into an array for sequential rendering
  // We want to render ALL nodes so they don't disappear when temporarily detached
  const renderList = useMemo(() => {
      if (!nodes) return [];
      
      let ordered = [];
      let visited = new Set();
      
      // Start traversal from dummy (Iterative) or current top-level head (Recursive)
      let currentId = null;
      if (selectedApproachId === 'iterative') {
          currentId = 'dummy';
      } else {
          // Find the earliest node in the original sequence that isn't a dummy
          currentId = Object.keys(nodes).find(k => k.startsWith('node_'));
          // In recursion, the actual "front" of the list might change. 
          // To keep it stable, we just iterate through the nodes logically.
          // Wait, tracing from actual head is better for visual flow.
          // Let's trace from activeHead if available, fallback to node_0
          currentId = activeHead || (arr.length > 0 ? 'node_0' : null);
          
          // Actually, finding the true absolute head is tricky in mid-recursion. 
          // Let's just track from the "leftmost" unvisited node recursively.
      }

      // 1. Follow standard next pointers to build the main spine
      let safeIter = 0;
      let traceId = selectedApproachId === 'iterative' ? 'dummy' : (isSuccess ? activeHead : (arr.length > 0 ? 'node_0' : null));
      
      // In recursion, node_0 might point to node_3 temporarily. 
      // To prevent jumping, we will just render the boxes statically based on their original IDs, 
      // and draw explicit SVG-like arrows between them!
      // But standard flex row is easier. 
      
      // Let's do topological sort based on next pointers to form the main display line
      let front = traceId;
      while (front && safeIter < 50) {
          ordered.push(nodes[front]);
          visited.add(front);
          front = nodes[front].next;
          safeIter++;
      }

      // 2. Append any orphaned nodes (like 'first' during a swap step)
      Object.values(nodes).forEach((node: any) => {
          if (!visited.has(node.id)) {
              ordered.push(node);
          }
      });

      return ordered;
  }, [nodes, selectedApproachId, isSuccess, activeHead, arr.length]);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Shuffle className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Swap Nodes in Pairs</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 24</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Linked List / Recursion</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action.includes('swap') ? 'bg-amber-500/20 border-amber-500' : 'bg-violet-500/20 border-violet-500')}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action.includes('swap') ? 'amber' : 'violet'} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Pointers</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                        {selectedApproachId === 'iterative' && (
                            <VariableCard label="prev" val={prev ? `[${nodes[prev].val}]` : "-"} color="sky" active={prev !== null} />
                        )}
                        {selectedApproachId === 'recursive' && (
                            <VariableCard label="head" val={activeHead ? `[${nodes[activeHead].val}]` : "-"} color="sky" active={activeHead !== null} />
                        )}
                        <VariableCard label="first" val={first ? `[${nodes[first].val}]` : "-"} color="purple" active={first !== null} />
                        <VariableCard label="second" val={second ? `[${nodes[second].val}]` : "-"} color="amber" active={second !== null} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Linked List (head)</label>
                        <input type="text" value={headInput} onChange={(e) => { setHeadInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="1, 2, 3, 4" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : <Shuffle size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : "text-violet-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-3 uppercase font-mono text-white flex items-center gap-3 relative z-10">
                      {cur.phase}
                  </div>
                  <div className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 font-mono whitespace-pre-line overflow-y-auto max-h-[140px] scrollbar-thin relative z-10">
                      {cur.description}
                  </div>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-center justify-center">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-16 pb-12 overflow-x-auto">
                      
                      {/* Linked List Representation */}
                      <div className="flex items-center mt-12 px-4 gap-2 md:gap-3 w-max mx-auto min-w-full justify-start md:justify-center">
                          {renderList.map((node, renderIdx) => {
                              
                              let isPrev = node.id === prev;
                              let isFirst = node.id === first;
                              let isSecond = node.id === second;
                              let isHead = selectedApproachId === 'recursive' && node.id === activeHead;

                              let isDummy = node.type === 'dummy';

                              let cls = "relative w-12 h-12 md:w-16 md:h-16 flex flex-col items-center justify-center rounded-2xl border-4 font-mono font-black text-xl md:text-2xl transition-all duration-700 z-10 shrink-0 shadow-sm ";
                              
                              if (isSuccess) {
                                  cls += isDummy ? "bg-slate-100 border-slate-300 text-slate-400 hidden" : "bg-emerald-50 border-emerald-400 text-emerald-800";
                              } else if (isPrev || isHead) {
                                  cls += "bg-sky-100 border-sky-500 text-sky-900 scale-110 shadow-lg ring-4 ring-sky-300/30 z-30";
                              } else if (isFirst) {
                                  cls += "bg-purple-100 border-purple-500 text-purple-900 scale-110 shadow-lg ring-4 ring-purple-300/30 z-30";
                              } else if (isSecond) {
                                  cls += "bg-amber-100 border-amber-500 text-amber-900 scale-110 shadow-lg ring-4 ring-amber-300/30 z-30";
                              } else {
                                  cls += isDummy ? "bg-slate-100 border-slate-300 text-slate-400" : "bg-white border-slate-300 text-slate-700";
                              }

                              // Visual indication if a node points backwards (e.g. second.next = first)
                              // In our linear rendering, if node.next points to a node that rendered *before* it, it's a backwards link!
                              // We can't draw curved arrows easily, so we just use explicit labeling.

                              return (
                                  <React.Fragment key={node.id}>
                                      <div className={`flex flex-col items-center relative shrink-0 ${isSuccess && isDummy ? 'hidden' : ''}`}>
                                          {/* Top Pointers */}
                                          <div className="absolute -top-12 flex flex-col items-center justify-end h-10 w-full gap-1 z-40">
                                              {isPrev && (
                                                  <div className={`flex flex-col items-center ${action.includes('Prev') ? 'animate-bounce' : ''}`}>
                                                      <span className="text-[10px] font-black font-mono tracking-widest text-sky-800 bg-sky-100 px-1.5 py-0.5 rounded border border-sky-300 shadow-sm mb-1">prev</span>
                                                      <ArrowDown size={16} className="text-sky-500" strokeWidth={3}/>
                                                  </div>
                                              )}
                                              {isHead && (
                                                  <div className={`flex flex-col items-center`}>
                                                      <span className="text-[10px] font-black font-mono tracking-widest text-sky-800 bg-sky-100 px-1.5 py-0.5 rounded border border-sky-300 shadow-sm mb-1">head</span>
                                                      <ArrowDown size={16} className="text-sky-500" strokeWidth={3}/>
                                                  </div>
                                              )}
                                              {isFirst && (
                                                  <div className="flex flex-col items-center">
                                                      <span className="text-[10px] font-black font-mono tracking-widest text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded border border-purple-300 shadow-sm mb-1">first</span>
                                                      <ArrowDown size={16} className="text-purple-500" strokeWidth={3}/>
                                                  </div>
                                              )}
                                          </div>

                                          {/* Node Box */}
                                          <div className={cls} style={{
                                              transform: action.includes('swap') && (isFirst || isSecond) ? 'scale(1.15)' : 'none'
                                          }}>
                                              {node.val}
                                              {isDummy && <span className="absolute -top-2 text-[8px] bg-slate-200 text-slate-500 px-1 rounded-full border border-slate-300">DUMMY</span>}
                                              
                                              {/* Destination Tag to clarify linkages when they cross */}
                                              {!isSuccess && node.next && (
                                                   <span className="absolute -bottom-5 text-[8px] md:text-[9px] font-mono font-bold text-white bg-slate-700 rounded px-2 shadow-sm whitespace-nowrap z-50">
                                                       next: [{nodes[node.next].val}]
                                                   </span>
                                              )}
                                          </div>
                                          
                                          {/* Bottom Pointers */}
                                          <div className="absolute -bottom-14 flex flex-col items-center h-12 w-full gap-1 z-40">
                                              {isSecond && (
                                                  <div className="flex flex-col items-center animate-in slide-in-from-top-2">
                                                      <ArrowUp size={16} className="text-amber-500" strokeWidth={3}/>
                                                      <span className="text-[10px] font-black font-mono bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 tracking-widest shadow-sm mt-1">second</span>
                                                  </div>
                                              )}
                                          </div>
                                      </div>

                                      {/* Connector Arrow */}
                                      {(!isSuccess || !isDummy) && node.next && (
                                          <div className="flex flex-col items-center justify-center shrink-0 px-2 text-slate-300 transition-all duration-500">
                                              <ArrowRight size={24} strokeWidth={2} className={action.includes('swap') && (isPrev || isFirst || isSecond) ? 'text-amber-400' : 'text-slate-300'} />
                                          </div>
                                      )}
                                      
                                      {/* Null Terminator */}
                                      {!node.next && (
                                          <div className="flex items-center justify-center shrink-0 px-2 text-slate-400 font-mono font-bold text-sm opacity-50">
                                              null
                                          </div>
                                      )}
                                  </React.Fragment>
                              );
                          })}
                      </div>

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600`}>
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">SWAPPING COMPLETE</span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Returned {selectedApproachId === 'iterative' ? 'dummy.next' : 'new head'}
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
                <Shuffle className="text-violet-600"/> Modifying Linked List Pointers
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                A common pitfall in linked list problems is attempting to swap the <i>values</i> inside the nodes. This is universally rejected in interviews. You must physically detach and reattach the <code>next</code> pointers to reorder the nodes in memory.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <IterationCcw size={18}/> Iterative: The 3-Step Swap
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            To swap <code>first</code> and <code>second</code>, you actually need a third pointer: <code>prev</code>. 
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            If the list is <code>A -&gt; B -&gt; C -&gt; D</code>, and we want to swap B & C:<br/><br/>
                            1. <code>A.next = C</code> (Connect outer left boundary)<br/>
                            2. <code>B.next = D</code> (Connect outer right boundary)<br/>
                            3. <code>C.next = B</code> (Perform the internal swap)<br/>
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <GitMerge size={18}/> Recursive: Trusting the Subproblem
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            Recursion simplifies pointer manipulation by abstracting the "rest of the list" into a single function call.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>We only focus on the local pair: <code>first</code> and <code>second</code>.</p>
                            <p>We dictate: <code>first.next = swapPairs(second.next)</code>. We don't care how the rest of the list swaps, we just know it returns the correct new head.</p>
                            <p>Then we finalize locally: <code>second.next = first</code> and return <code>second</code>.</p>
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
                        "For solving Swap Nodes in Pairs, the iterative approach is preferred because it achieves $O(1)$ auxiliary space. I utilized a `dummy` node strategy. The dummy node acts as the `prev` pointer for the very first pair, eliminating the need for messy edge-case logic when the head itself changes. Inside a `while` loop, I ensure there are at least two nodes available. I identify `first` and `second`, and perform a three-step pointer reassignment: linking `prev` to `second`, linking `first` to whatever follows the pair, and finally linking `second` back to `first`. I then advance `prev` to `first` for the next iteration. Alternatively, this can be written recursively in fewer lines, but that incurs an $O(N)$ call stack penalty."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Why is value swapping banned?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Swapping values (e.g., <code>int temp = a.val; a.val = b.val;</code>) is trivial and avoids pointer logic entirely. However, in real-world systems, linked list nodes often carry massive objects or complex payloads. Copying that data is highly inefficient compared to simply updating an 8-byte memory address pointer.
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
                                <p className="text-[10px] text-slate-500 mt-1">Both iterative and recursive approaches touch every node in the linked list exactly once (or twice if counting pointer resolution).</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Iterative: O(1) | Recur: O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">The iterative approach only requires a few pointers (`dummy`, `prev`, `first`, `second`). The recursive approach pushes $N/2$ frames to the call stack.</p>
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

interface VariableCardProps {
  label: string;
  val: any;
  color: string;
  active: boolean;
}

const VariableCard: React.FC<VariableCardProps> = ({ label, val, color, active }) => {
    const bgMap = {
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        sky: 'bg-sky-50 border-sky-200 text-sky-700',
        rose: 'bg-rose-50 border-rose-200 text-rose-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        slate: 'bg-slate-100 border-slate-300 text-slate-700',
        violet: 'bg-violet-50 border-violet-200 text-violet-700',
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

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
  theme?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|swapPairs|head|dummy|prev|first|second|next)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math', 'Arrays', 'ArrayList', 'ListNode', 'TreeNode', 'Stack', 'StringBuilder'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['swapPairs', 'head'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['dummy', 'prev'].includes(part)) return <span key={i} className="text-sky-300 font-bold">{part}</span>;
          if (['first'].includes(part)) return <span key={i} className="text-purple-300 font-bold">{part}</span>;
          if (['second'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (['next'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default SwapNodesInPairsVisualizer;