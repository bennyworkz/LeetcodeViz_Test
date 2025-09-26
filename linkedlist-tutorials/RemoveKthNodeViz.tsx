import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp, Scissors,
  GitCommit, MonitorPlay, ChevronLeft, ChevronRight, 
  Network, Database, RotateCcw, ListOrdered, RefreshCw,
  Zap, AlertCircle, Goal, Info, Layers, Trash2
} from 'lucide-react';

const OPERATIONS = {
  removeIterative: {
    id: 'removeIterative',
    title: 'Iterative (Optimal)',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public Node removeKthNode(Node head, int k) {
    if (head == null) return null;
    if (k == 1) return null; // Remove every node
    
    Node curr = head;
    
    while (curr != null) {
        // Traverse to the (k-1)th node
        for (int i = 1; i < k - 1 && curr != null; i++) {
            curr = curr.next;
        }
        
        // If we reached the end, or the k-th node doesn't exist
        if (curr == null || curr.next == null) {
            break;
        }
        
        // Bypass the k-th node
        curr.next = curr.next.next;
        
        // Move to the next node to start counting again
        curr = curr.next;
    }
    
    return head;
}`,
    desc: "Uses a single pointer to count nodes. When it reaches the node immediately preceding the k-th node, it leaps over the k-th node by updating its 'next' pointer. This uses no extra memory."
  },
  removeRecursive: {
    id: 'removeRecursive',
    title: 'Recursive Approach',
    icon: <RefreshCw size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public Node removeKthNode(Node head, int k) {
    if (k == 1) return null;
    return helper(head, k, 1);
}

private Node helper(Node curr, int k, int count) {
    if (curr == null) return null;
    
    // If this is the k-th node, skip it
    if (count == k) {
        return helper(curr.next, k, 1);
    }
    
    // Otherwise, attach the recursively processed remaining list
    curr.next = helper(curr.next, k, count + 1);
    return curr;
}`,
    desc: "Passes a 'count' variable down the call stack. When count equals k, the function simply skips the current node by returning the evaluation of the next node. Extremely elegant but uses O(N) stack space."
  }
};

// Data structures
interface ListNodeData {
  id: number;
  val: number;
  addr: string;
  nextId: number | null;
  x: number;
  y: number;
}

const OverviewTab = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6 text-rose-600">
          <Scissors size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Remove Every K-th Node</h2>
      </div>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given a singly linked list and an integer <code>k</code>, the task is to sequentially remove every <code>k-th</code> node of the linked list. Assume that <code>k</code> is always greater than 0.
        </p>

        <ul className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3 font-medium text-slate-700 list-none">
            <li className="flex items-center gap-3"><Info className="text-rose-500" size={18}/> <strong>Counting Restart:</strong> The count restarts immediately after a deletion. For example, if k=3, we remove the 3rd node, then the 6th node, then the 9th, and so on.</li>
            <li className="flex items-center gap-3"><Info className="text-rose-500" size={18}/> <strong>k = 1:</strong> A special edge case! If k=1, every single node must be removed, resulting in an empty list (null).</li>
        </ul>

        <div className="space-y-6 pt-4">
           <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs border-b pb-2">Examples</h4>
           
           <div className="grid md:grid-cols-2 gap-6">
               <div className="bg-rose-50/50 border border-rose-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-rose-800 uppercase tracking-widest text-[10px] items-center gap-2"><Goal size={14}/> Example 1: K = 3</div>
                   <div className="space-y-3">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-8 text-xs font-bold">List:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">1 <ArrowRight size={12} className="mx-1"/> 2 <ArrowRight size={12} className="mx-1 text-rose-400"/> <span className="text-rose-400 font-bold">3</span> <ArrowRight size={12} className="mx-1 text-rose-400"/> 4 <ArrowRight size={12} className="mx-1"/> 5 <ArrowRight size={12} className="mx-1 text-rose-400"/> <span className="text-rose-400 font-bold">6</span></div>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-rose-200/50 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold w-8">Out:</span> 
                          <div className="flex items-center text-emerald-700 font-bold bg-emerald-100 px-2 py-1 rounded border border-emerald-200 text-xs">1 <ArrowRight size={12} className="mx-1 text-emerald-400"/> 2 <ArrowRight size={12} className="mx-1 text-emerald-400"/> 4 <ArrowRight size={12} className="mx-1 text-emerald-400"/> 5</div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1">Nodes 3 and 6 are successfully bypassed.</p>
                   </div>
               </div>

               <div className="bg-sky-50/50 border border-sky-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-sky-800 uppercase tracking-widest text-[10px] items-center gap-2"><Goal size={14}/> Example 2: K = 2</div>
                   <div className="space-y-3">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-8 text-xs font-bold">List:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">10 <ArrowRight size={12} className="mx-1 text-sky-400"/> <span className="text-sky-400 font-bold">20</span> <ArrowRight size={12} className="mx-1 text-sky-400"/> 30 <ArrowRight size={12} className="mx-1 text-sky-400"/> <span className="text-sky-400 font-bold">40</span></div>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-sky-200/50 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold w-8">Out:</span> 
                          <div className="flex items-center text-emerald-700 font-bold bg-emerald-100 px-2 py-1 rounded border border-emerald-200 text-xs">10 <ArrowRight size={12} className="mx-1 text-emerald-400"/> 30</div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1">Alternate nodes (20, 40) are removed.</p>
                   </div>
               </div>
           </div>
        </div>

      </div>
    </div>
  </div>
);

const TheoryTab = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center gap-3 mb-6 text-fuchsia-600">
          <Trash2 size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Theory: Controlled Bypass</h2>
      </div>

      <p className="text-slate-600 leading-relaxed text-lg">
          To remove a node in a Linked List, we don't actually "delete" it directly. Instead, we rewire the preceding node to skip over it. Once the skipped node has no incoming references, the Java Garbage Collector automatically destroys it to free memory.
      </p>

      <div className="space-y-4 pt-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-black text-xl shrink-0">1</div>
              <div>
                  <h3 className="font-black text-slate-800 mb-1">Traverse to k-1</h3>
                  <p className="text-sm text-slate-500 font-mono"><code>for (int i = 1; i {'<'} k - 1; i++)</code></p>
                  <p className="text-xs text-slate-400 mt-2">We must stop exactly one node <strong>before</strong> the node we want to remove. If we stop ON the k-th node, we can't alter the pointer of the (k-1)th node because Singly Linked Lists cannot go backwards!</p>
              </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xl shrink-0">2</div>
              <div>
                  <h3 className="font-black text-slate-800 mb-1">Execute the Bypass</h3>
                  <p className="text-sm text-slate-500 font-mono"><code>curr.next = curr.next.next;</code></p>
                  <p className="text-xs text-slate-400 mt-2">We instruct the (k-1)th node to point its <code>next</code> reference to the (k+1)th node. The k-th node is instantly dropped from the sequence.</p>
              </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-black text-xl shrink-0">3</div>
              <div>
                  <h3 className="font-black text-slate-800 mb-1">Advance and Restart</h3>
                  <p className="text-sm text-slate-500 font-mono"><code>curr = curr.next;</code></p>
                  <p className="text-xs text-slate-400 mt-2">We move our <code>curr</code> pointer to the next valid node in the new chain, and our <code>for</code> loop counting starts fresh.</p>
              </div>
          </div>
      </div>
    </div>
  </div>
);

const InterviewTab = () => (
    <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-8 font-mono">
       <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
           <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
               <Trophy size={140} />
           </div>
           <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-rose-400 relative z-10 uppercase tracking-tight">
               <Trophy size={24} /> Interview Cheat Sheet
           </h3>
           <p className="text-sm text-slate-300 leading-relaxed italic relative z-10 mb-6">
               "This is a fundamental pointer arithmetic question. Your interviewer will be paying close attention to your <strong>Null Checks</strong>. Trying to access <code>curr.next.next</code> when <code>curr.next</code> is null will instantly throw a NullPointerException and fail the interview."
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
               <div className="p-5 rounded-2xl border bg-emerald-900/40 border-emerald-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1">Iterative (Expected)</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(N) <br/><strong>Space:</strong> O(1)</div>
                    <p className="text-[10px] text-emerald-200/70 leading-relaxed mt-2">Requires one pass. Utilizes an inner loop/counter to segment the logic. Ideal space complexity for real-world codebases.</p>
               </div>
               <div className="p-5 rounded-2xl border bg-fuchsia-900/40 border-fuchsia-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-fuchsia-400 mb-1">Recursive (Clean)</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(N) <br/><strong>Space:</strong> O(N)</div>
                    <p className="text-[10px] text-fuchsia-200/70 leading-relaxed mt-2">Highly concise code avoiding nested loops. However, allocating O(N) stack frames is a major liability for lists with millions of nodes.</p>
               </div>
           </div>
       </div>

       <div className="grid grid-cols-1 gap-6 mt-8">
           <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
               <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <Activity size={14} className="text-amber-500"/> Handling K = 1
               </h4>
               <p className="text-sm text-slate-600 leading-relaxed">
                   If <code>k == 1</code>, it means we must remove the 1st, 2nd, 3rd, 4th... effectively <strong>every single node</strong> in the list. The loop logic will break down if you try to traverse to <code>k-1</code> (which would be 0 steps). Always write an explicit edge case trap: <code>if (k == 1) return null;</code> at the top of your function.
               </p>
           </div>
       </div>
    </div>
);

// Helper to generate node with fixed physical coordinates for the 2D layout.
// Using a 4-column compact grid.
const generateNode = (val: number, id: number, nextId: number | null, index: number): ListNodeData => {
    const col = index % 4;
    const row = Math.floor(index / 4);
    
    // Aligned Grid: Nodes are 96px wide. Space = 140px horizontally.
    const x = 30 + col * 140; 
    const y = 40 + row * 120;

    return {
        id: id,
        val: val,
        addr: '0x' + (100 + (id * 32)).toString(16).toUpperCase().padStart(3, '0'),
        nextId: nextId,
        x, y
    };
};

// Interface definitions
interface PointerLabelProps {
  label: string;
  color: string;
  position: 'top' | 'bottom';
  active?: boolean;
  offset?: number;
  strikethrough?: boolean;
}

interface ListNodeBlockProps {
  val: number;
  address: string;
  nextAddr: string;
  themeColor?: 'emerald' | 'amber' | 'indigo' | 'fuchsia' | 'rose' | 'sky' | 'slate';
  isTarget?: boolean;
  isDeleted?: boolean;
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
  theme?: string;
}

export default function RemoveKthNodeViz() {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'overview' | 'theory' | 'interview'>('visualizer');
  const [selectedOpId, setSelectedOpId] = useState<keyof typeof OPERATIONS>('removeIterative');
  
  const [inputList, setInputList] = useState('1, 2, 3, 4, 5, 6, 7, 8');
  const [inputK, setInputK] = useState('3');
  
  const [baseList, setBaseList] = useState<ListNodeData[]>([]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedOp = OPERATIONS[selectedOpId];

  // Parse inputs to Base States
  useEffect(() => {
      // Limit to 8 nodes to perfectly fit a 2-row, 4-column physical layout without scrolling.
      const vals = inputList.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)).slice(0, 8); 
      const newNodes = vals.map((v, i) => generateNode(v, i, i < vals.length - 1 ? i + 1 : null, i));
      setBaseList(newNodes);
      setCurrentStep(0);
  }, [inputList]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    if (baseList.length === 0) return steps;

    // Deep clone the base list for simulation (we manipulate nextIds, not positions!)
    let list = baseList.map(n => ({...n}));
    let h1: number | null = list[0].id;
    let deletedSet = new Set<number>();
    
    let k = parseInt(inputK);
    if(isNaN(k) || k <= 0) k = 3;

    const updateNextId = (targetId: number, newNextId: number | null) => {
        let node = list.find(n => n.id === targetId);
        if(node) node.nextId = newNextId;
    };

    const addStep = (phase: string, desc: string, line: number, stateProps: any) => {
      steps.push({
        phase, description: desc, line, 
        state: { 
            list: list.map(n=>({...n})), // Deep copy of the current pointer graph
            headIdx: h1,
            deletedSet: new Set(deletedSet),
            ...stateProps 
        }
      });
    };

    if (selectedOpId === 'removeIterative') {
        let currIdx: number | null = h1;
        
        addStep("Method Call", `removeKthNode(head, k=${k}) called.`, 1, { currIdx, activeLinkId: null });
        
        if (k === 1) {
             addStep("Edge Case (k=1)", `k == 1. All nodes must be removed.`, 3, { currIdx, activeLinkId: null });
             
             // Mark all deleted visually
             list.forEach(n => deletedSet.add(n.id));
             h1 = null;
             
             addStep("Operation Complete", `return null; Everything cleared.`, 3, { currIdx: null, activeLinkId: null, isSuccess: true });
             return steps;
        }

        addStep("Initialize Pointer", `Node curr = head;`, 5, { currIdx, activeLinkId: null });

        while (currIdx !== null) {
            addStep("Main Loop", `while (curr != null) -> Traversal sequence begins.`, 7, { currIdx, activeLinkId: null });
            
            let count = 1;
            let tempIdx: number | null = currIdx;
            
            while (count < k - 1 && tempIdx !== null) {
                let tempNode = list.find(n => n.id === tempIdx);
                addStep("Inner Loop", `for (i = ${count}; i < ${k-1} && curr != null; i++)`, 9, { currIdx: tempIdx, activeLinkId: null, kCount: count });
                
                tempIdx = tempNode?.nextId ?? null;
                count++;
                
                addStep("Advance", `curr = curr.next. Stepping toward (k-1)th node.`, 10, { currIdx: tempIdx, activeLinkId: null, kCount: count });
            }
            currIdx = tempIdx;
            
            addStep("Inner Loop Ends", `Arrived at node exactly before the target.`, 9, { currIdx, activeLinkId: null, kCount: count });

            let currNode = list.find(n => n.id === currIdx);
            let targetIdx = currNode?.nextId ?? null;

            addStep("Null Checks", `if (curr == null || curr.next == null)`, 14, { currIdx, targetIdx, activeLinkId: null });
            if (currIdx === null || targetIdx === null) {
                 addStep("Break Loop", `Reached the end of the list. No complete k-chunk remaining.`, 15, { currIdx, targetIdx, activeLinkId: null });
                 break;
            }

            let targetNode = list.find(n => n.id === targetIdx);
            let nextNextIdx = targetNode?.nextId ?? null;

            addStep("Bypass Setup", `Ready to leapfrog over the k-th node (${targetNode?.val}).`, 18, { currIdx, targetIdx, activeLinkId: null });

            updateNextId(currIdx, nextNextIdx);
            deletedSet.add(targetIdx);
            
            addStep("Bypass Node", `curr.next = curr.next.next; The target is detached!`, 18, { currIdx, targetIdx, activeLinkId: currIdx });

            currIdx = nextNextIdx;
            addStep("Restart Cycle", `curr = curr.next; Moving to next fresh node to restart counting.`, 21, { currIdx, activeLinkId: null });
        }

        addStep("Operation Complete", `Return head.`, 24, { currIdx: null, activeLinkId: null, isSuccess: true });
    } 
    else if (selectedOpId === 'removeRecursive') {
        
        addStep("Method Call", `removeKthNode(head, k=${k}) called.`, 1, { currIdx: h1, activeLinkId: null });
        
        if (k === 1) {
             addStep("Edge Case (k=1)", `if (k == 1) return null;`, 2, { currIdx: h1, activeLinkId: null });
             list.forEach(n => deletedSet.add(n.id));
             h1 = null;
             addStep("Operation Complete", `All nodes deleted.`, 2, { currIdx: null, activeLinkId: null, isSuccess: true });
             return steps;
        }

        let callStack: any[] = [];
        
        const recurse = (currIdx: number | null, kVal: number, count: number, depth: number): number | null => {
            callStack.push({ curr: currIdx, count, depth });
            let currNode = list.find(n => n.id === currIdx);
            let valStr = currNode ? currNode.val : 'null';
            
            addStep("Recursive Call", `helper(${valStr}, count=${count}) pushed to Stack (Depth ${depth}).`, 6, { currIdx, callStack: [...callStack], activeLinkId: null, targetIdx: count === k ? currIdx : null });
            
            addStep("Base Case", `if (curr == null)`, 7, { currIdx, callStack: [...callStack], activeLinkId: null });
            if (currIdx === null) {
                 addStep("Return Null", `Reached end of list.`, 7, { currIdx, callStack: [...callStack], activeLinkId: null });
                 callStack.pop();
                 return null;
            }

            addStep("Check K Match", `if (count == k) => (${count} == ${kVal})`, 10, { currIdx, callStack: [...callStack], activeLinkId: null, targetIdx: count === k ? currIdx : null });
            if (count === kVal) {
                 let nextIdx = currNode?.nextId ?? null;
                 deletedSet.add(currIdx);
                 addStep("Skip Target", `Count matches K! We skip this node entirely.`, 11, { currIdx, targetIdx: currIdx, callStack: [...callStack], activeLinkId: null });
                 
                 addStep("Recurse Forward", `return helper(curr.next, k, 1). Resetting count...`, 11, { currIdx, targetIdx: currIdx, callStack: [...callStack], activeLinkId: null });
                 let res = recurse(nextIdx, kVal, 1, depth + 1);
                 
                 addStep("Bubble Up Skip", `Returning the bypassed sublist up the stack.`, 11, { currIdx, callStack: [...callStack], activeLinkId: null });
                 callStack.pop();
                 return res;
            }

            let nextIdx = currNode?.nextId ?? null;
            addStep("Recurse Standard", `curr.next = helper(curr.next, k, ${count+1}). Pausing Depth ${depth}...`, 15, { currIdx, callStack: [...callStack], activeLinkId: null });
            
            let returnedNode = recurse(nextIdx, kVal, count + 1, depth + 1);

            updateNextId(currIdx, returnedNode);
            addStep("Resume & Link", `Resumed Depth ${depth}. curr.next updated to returned sublist.`, 15, { currIdx, callStack: [...callStack], activeLinkId: currIdx });

            addStep("Return Node", `return curr;`, 16, { currIdx, callStack: [...callStack], activeLinkId: null });
            callStack.pop();
            return currIdx;
        };

        h1 = recurse(h1, k, 1, 1);
        addStep("Operation Complete", `All stack frames popped. Filtered list returned.`, 3, { callStack: [], activeLinkId: null, isSuccess: true });
    }

    return steps;
  }, [baseList, selectedOpId, inputK]);

  useEffect(() => { setCurrentStep(0); }, [selectedOpId, inputList, inputK]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleReset = () => { setCurrentStep(0); };

  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedOp.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0] || { state: { list: baseList, headIdx: 0, deletedSet: new Set() } };
  const state = cur.state || { list: baseList, headIdx: 0, deletedSet: new Set() };
  
  const { 
      isSuccess, currIdx, targetIdx, activeLinkId, callStack, headIdx, deletedSet, kCount
  } = state;

  const getThemeColor = () => selectedOpId === 'removeIterative' ? 'rose' : 'fuchsia';
  const activeTheme = getThemeColor();

  // SVG Drawing function for clean, non-distracting links
  const renderSvgArrows = () => {
    return state.list.map((node: ListNodeData) => {
        if (node.nextId === null) return null;
        
        const target = state.list.find((n: ListNodeData) => n.id === node.nextId);
        if (!target) return null;
        
        // Don't draw arrows originating FROM a deleted node, it adds visual clutter.
        if (deletedSet.has(node.id)) return null;

        // Origin point: center of the "NEXT" box (Node width: 96px. NEXT box rightmost 32px. Center is 80px).
        const startX = node.x + 80; 
        const startY = node.y + 24;

        // Destination point: left middle of the target Node
        const endX = target.x - 6;
        const endY = target.y + 24;

        const isActive = activeLinkId === node.id;
        const strokeColor = isActive ? '#f43f5e' : '#cbd5e1'; // rose-500 or slate-300
        const strokeWidth = isActive ? 3 : 2;
        const strokeOpacity = isActive ? 1 : 0.6;
        const marker = isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead-default)';

        let pathD = '';
        
        // Deterministic routing logic based on physical IDs (which map to index positions)
        const isWrapRow = Math.floor(target.id / 4) > Math.floor(node.id / 4); // Jump to next row
        const isForwardJump = target.id > node.id + 1; // Bypassing nodes

        if (isWrapRow) {
            // Wrapping to next row: Wide S-Curve around the outside
            pathD = `M ${startX},${startY} C ${startX + 50},${startY + 20} ${endX - 50},${endY - 20} ${endX},${endY}`;
        } else if (isForwardJump) {
            // Jumping over a node: Arc LOW under the bottom to avoid intersecting the deleted node
            pathD = `M ${startX},${startY} C ${startX + 30},${startY + 60} ${endX - 30},${endY + 60} ${endX},${endY}`;
        } else {
            // Normal direct link (adjacent right)
            pathD = `M ${startX},${startY} C ${startX + 15},${startY} ${endX - 15},${endY} ${endX},${endY}`;
        }

        return (
            <path 
                key={`link-${node.id}-${target.id}`}
                d={pathD} 
                fill="none" 
                stroke={strokeColor} 
                strokeWidth={strokeWidth} 
                strokeOpacity={strokeOpacity}
                markerEnd={marker} 
                className="transition-all duration-500 ease-in-out" 
            />
        );
    });
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header Component */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Scissors size={100} />
          </div>
          <div className="flex items-center gap-5 z-10">
            <div className={`bg-${activeTheme}-600 p-4 rounded-2xl shadow-lg shadow-${activeTheme}-100 flex items-center justify-center transition-colors duration-500`}>
                <Scissors className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Remove K-th Node</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className={`font-bold text-${activeTheme}-600 bg-${activeTheme}-50 px-2 py-0.5 rounded tracking-widest uppercase transition-colors duration-500`}>Physical Memory View</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Data Structures</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto w-full md:w-auto z-10">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Database size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'theory' && <TheoryTab />}
        {activeTab === 'interview' && <InterviewTab />}

        {activeTab === 'visualizer' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Col: Code & Log (5/12) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                
                {/* Operations Selector */}
                <div className="grid grid-cols-2 gap-3">
                    {Object.values(OPERATIONS).map((op) => {
                        const isSelected = selectedOpId === op.id;
                        let btnColor = op.id === 'removeIterative' ? 'rose' : 'fuchsia';
                        
                        return (
                            <button 
                               key={op.id}
                               onClick={() => { setSelectedOpId(op.id as any); setCurrentStep(0); }}
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? `bg-${btnColor}-600 border-${btnColor}-600 text-white shadow-${btnColor}-200 scale-[1.02]` : `bg-white border-slate-200 text-slate-500 hover:border-${btnColor}-300 hover:bg-slate-50`}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? `bg-${btnColor}-500 text-white` : 'bg-slate-100 text-slate-400'}`}>{op.icon}</div>
                                  <span className="text-[12px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {op.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[10px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? `text-${btnColor}-100` : 'text-slate-400'}`}>
                                    <span>{op.complexity}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="bg-[#0f172a] rounded-3xl h-[420px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={14} className={`text-${activeTheme}-400`} />
                      <span className="font-bold uppercase text-[10px] text-white">LinkedList.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className={`text-${activeTheme}-400`} /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {/* Highlighter Bar */}
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : `bg-${activeTheme}-500/20 border-${activeTheme}-500`}`} style={{ top: `${((cur.line - 1) * 16.5) + 16}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedOp.code.split('\n').map((line: string, idx: number) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme={isSuccess && cur.line === idx + 1 ? 'emerald' : activeTheme} />
                      ))}
                  </div>
                </div>

              </div>

              {/* Right Col: Simulation Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className={`text-[10px] font-black text-${activeTheme}-600 uppercase block pl-1 tracking-widest font-mono`}>Nodes (Max 8)</label>
                        <input type="text" value={inputList} onChange={(e) => { setInputList(e.target.value); setCurrentStep(0); }} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${activeTheme}-500 outline-none transition-all shadow-inner`} placeholder="1, 2, 3, 4, 5, 6, 7, 8" />
                    </div>
                    <div className="w-24 space-y-1.5 shrink-0">
                        <label className={`text-[10px] font-black text-${activeTheme}-600 uppercase block pl-1 tracking-widest font-mono`}>Target K</label>
                        <input type="number" min="1" value={inputK} onChange={(e) => { setInputK(e.target.value); setCurrentStep(0); }} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${activeTheme}-500 outline-none transition-all shadow-inner`} placeholder="3" />
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                      <button onClick={handleReset} title="Reset Simulation" className="px-5 py-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm">
                        <RotateCcw size={16}/>
                      </button>
                      <button onClick={handlePrev} disabled={currentStep === 0} className="px-6 py-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className={`flex-1 md:w-32 px-6 py-3 bg-${activeTheme}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-${activeTheme}-100 hover:bg-${activeTheme}-700 transition-all flex items-center justify-center gap-2`}>
                        Step {currentStep < trace.length - 1 ? <ChevronRight size={16}/> : <Check size={16}/>}
                      </button>
                    </div>
                </div>

                {/* Action Log / Status */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group shrink-0 ${isSuccess ? `bg-emerald-900 border-emerald-800` : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      <Activity size={100}/>
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : `text-${activeTheme}-400`}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Execution Log</span>
                     </div>
                     <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : `bg-${activeTheme}-500/20 text-${activeTheme}-300 border-${activeTheme}-500/30`} border`}>Line {cur.line}</div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3 relative z-10">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line relative z-10">{cur.description}</p>
                </div>

                {/* 2D PHYSICAL MEMORY ARENA */}
                <div className="bg-slate-50 bg-[linear-gradient(to_right,#cbd5e130_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e130_1px,transparent_1px)] bg-[size:20px_20px] rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col shadow-inner overflow-hidden min-h-[360px]">
                  
                   <div className="flex items-center justify-between mb-2 pb-4 border-b border-slate-200 z-30">
                      <div className="flex items-center gap-4 bg-white/80 px-3 py-1 rounded backdrop-blur shadow-sm">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono flex items-center gap-2">
                              <Network size={14}/> Physical Memory Heap
                          </span>
                      </div>
                      
                      <div className="flex gap-2">
                          {kCount !== undefined && (
                              <div className="bg-white/80 border border-slate-200 text-slate-600 text-[10px] font-mono font-black px-2 py-1 rounded shadow-sm backdrop-blur animate-in fade-in">
                                  i: {kCount}
                              </div>
                          )}
                          <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500 bg-white/80 px-3 py-1 rounded backdrop-blur shadow-sm">
                             Nodes stay fixed in RAM. Pointers bypass.
                          </div>
                      </div>
                   </div>

                   {/* Recursive Call Stack UI */}
                   {selectedOpId === 'removeRecursive' && callStack && callStack.length > 0 && (
                       <div className="absolute bottom-6 left-6 flex gap-4 z-20 pointer-events-none">
                           <div className={`bg-slate-900 border border-slate-700 rounded-xl p-3 w-48 flex flex-col shadow-xl animate-in slide-in-from-bottom-4`}>
                               <span className={`text-[9px] font-black uppercase text-fuchsia-400 tracking-widest mb-2 font-mono flex items-center gap-1 justify-between`}>Call Stack <Layers size={10}/></span>
                               <div className={`flex flex-col-reverse gap-1 justify-end h-24 w-full border-b-2 border-fuchsia-500/50 pb-1 overflow-y-auto scrollbar-thin`}>
                                   {callStack.map((frame:any, i:number) => (
                                       <div key={i} className={`p-1.5 rounded flex justify-between items-center transition-all ${i === callStack.length - 1 ? 'bg-fuchsia-900/50 border border-fuchsia-500/30 text-fuchsia-300 shadow-md' : 'bg-slate-800/50 text-slate-500 text-[10px] font-mono'}`}>
                                            <span className="text-[10px] font-black font-mono">helper({state.list.find((n:any)=>n.id===frame.curr)?.val ?? 'null'})</span>
                                            <span className="opacity-50 text-[8px]">count:{frame.count}</span>
                                        </div>
                                   ))}
                               </div>
                           </div>
                       </div>
                   )}

                   {/* Interactive Canvas - No Scrollbars! */}
                   <div className="flex-1 w-full relative z-10 overflow-hidden">
                       {/* Container sized perfectly for 4 columns, 2 rows */}
                       <div className="absolute top-0 left-0 w-full h-full min-w-[500px] min-h-[300px]">
                           
                           {/* SVG Layer for Pointer Arrows */}
                           <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                               <defs>
                                   <marker id="arrowhead-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /> {/* slate-300 */}
                                   </marker>
                                   <marker id="arrowhead-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" /> {/* rose-500 */}
                                   </marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>

                           {/* HTML Layer for Node Blocks & Labels */}
                           {state.list.map((nodeObj: ListNodeData) => {
                              
                              const isHead = headIdx === nodeObj.id;
                              const isCurr = currIdx === nodeObj.id;
                              const isTargetNode = targetIdx === nodeObj.id;
                              
                              const isDeleted = deletedSet.has(nodeObj.id);

                              const isTarget = isHead || isCurr || isTargetNode;
                              
                              let themeColor = 'slate';
                              if (isTargetNode) themeColor = 'rose';
                              else if (isCurr) themeColor = activeTheme;
                              else if (isHead) themeColor = 'emerald';

                              const labels = [];
                              if (isHead && !isDeleted) labels.push({ text: "head", color: "emerald", position: "top" });
                              if (isCurr && !isDeleted) labels.push({ text: "curr", color: activeTheme, position: "bottom" });

                              return (
                                  <div key={nodeObj.id} className={`absolute transition-all duration-700 z-10 ${isDeleted ? 'opacity-30 grayscale scale-95' : ''}`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      
                                      {/* Top Labels */}
                                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center z-20">
                                          {labels.filter(l => l.position === 'top').map((l, i) => (
                                              <PointerLabel key={i} label={l.text} color={l.color} position="top" active={true} />
                                          ))}
                                      </div>

                                      {/* Bottom Labels */}
                                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center z-20">
                                          {labels.filter(l => l.position === 'bottom').map((l, i) => (
                                              <PointerLabel key={i} label={l.text} color={l.color} position="bottom" active={true} />
                                          ))}
                                      </div>

                                      {/* The Node Itself */}
                                      <div className="relative group">
                                          <span className="absolute -top-5 left-0 text-[10px] text-slate-400 font-mono font-bold opacity-80">{nodeObj.addr}</span>
                                          <div className={`flex items-center w-24 h-12 border-2 rounded-xl transition-all duration-300 shadow-sm ${isTarget ? `ring-4 ring-${themeColor}-200` : ''} bg-white border-${themeColor}-400`}>
                                              <div className={`flex-1 flex justify-center font-mono font-black text-xl text-${themeColor}-800`}>
                                                  {nodeObj.val}
                                              </div>
                                              <div className={`w-8 h-full border-l-2 flex flex-col items-center justify-center rounded-r-lg border-${themeColor}-400 bg-${themeColor}-50`}>
                                                  <span className="text-[6px] font-black uppercase tracking-widest opacity-60 transform -rotate-90">NEXT</span>
                                              </div>
                                          </div>
                                          
                                          {/* Deletion Cross */}
                                          {isDeleted && (
                                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                  <div className="w-full h-1 bg-rose-500 -rotate-12 absolute scale-125"></div>
                                                  <div className="w-full h-1 bg-rose-500 rotate-12 absolute scale-125"></div>
                                              </div>
                                          )}

                                          {/* Null indicator embedded below if pointer is null */}
                                          {nodeObj.nextId === null && !isDeleted && (
                                              <div className="absolute -right-6 top-1/2 -translate-y-1/2 text-[10px] font-black font-mono text-slate-400">null</div>
                                          )}
                                      </div>
                                  </div>
                              )
                          })}

                          {/* Trailing Null Pointer Label if curr reached end */}
                          {currIdx === null && isSuccess && headIdx !== null && (
                              <div className="absolute bottom-4 right-10 flex flex-col items-center animate-in zoom-in">
                                  <span className="text-[12px] font-mono text-slate-400 font-bold mb-2">null</span>
                                  <PointerLabel label="curr" color={activeTheme} position="bottom" active={true} />
                              </div>
                          )}

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
}

// Sub-components
const PointerLabel: React.FC<PointerLabelProps> = ({ label, color, position, strikethrough = false }) => {
    const colorClasses: Record<string, string> = {
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        sky: 'bg-sky-100 text-sky-700 border-sky-200',
        amber: 'bg-amber-100 text-amber-700 border-amber-200',
        rose: 'bg-rose-100 text-rose-700 border-rose-200',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
        indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        violet: 'bg-violet-100 text-violet-700 border-violet-200',
        slate: 'bg-white text-slate-500 border-slate-200'
    };
    const activeColorClass = colorClasses[color] || colorClasses['slate'];

    return (
        <div className={`flex flex-col items-center justify-center animate-in zoom-in duration-300 z-10`}>
            <span className={`text-[8px] font-black font-mono tracking-widest px-1.5 py-0.5 rounded border shadow-sm ${activeColorClass} ${strikethrough ? 'line-through opacity-50' : ''}`}>
                {label}
            </span>
        </div>
    );
};

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, nextAddr, themeColor = 'slate', isTarget }) => {
    // Rendered inline in parent to handle dynamic absolute positioning & labels
    return null;
};

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'rose' }) => {
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|Node|true|false|System|out|print|println|static|removeKthNode|helper)\b|\b\d+\b)/g).filter(Boolean);
  
  const activeStyles = { bg: `bg-${theme}-500/10`, border: `border-${theme}-500`, text: `text-${theme}-400` };

  return (
    <div className={`flex relative z-10 min-h-[16.5px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `${activeStyles.text} font-bold` : 'text-slate-700'}`}>{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//') || part.startsWith('#')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"') || part.startsWith("'")) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for', 'break', 'static'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'long', 'boolean', 'String', 'Node', 'System', 'out', 'print', 'println', 'void'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['removeKthNode', 'helper'].includes(part)) return <span key={i} className={`text-${theme}-400 font-bold`}>{part}</span>;
          if (['true', 'false', 'null', 'None'].includes(part)) return <span key={i} className="text-orange-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-emerald-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};