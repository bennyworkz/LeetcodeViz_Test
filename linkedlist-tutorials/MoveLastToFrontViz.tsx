import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp, CornerUpLeft,
  GitCommit, MonitorPlay, ChevronLeft, ChevronRight, 
  Network, Database, RotateCcw, ListOrdered, RefreshCw,
  GitPullRequest, Zap, Scissors, AlertCircle,
  ZoomIn, ZoomOut, Maximize
} from 'lucide-react';

const OPERATIONS = {
  moveIterative: {
    id: 'moveIterative',
    title: 'Iterative (Optimal)',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public Node moveToFront(Node head) {
    // Edge case: Empty list or single node
    if (head == null || head.next == null) {
        return head;
    }
    
    Node secLast = null;
    Node last = head;
    
    // Traverse to the end, keeping track of second to last
    while (last.next != null) {
        secLast = last;
        last = last.next;
    }
    
    // 1. Sever the old tail
    secLast.next = null;
    
    // 2. Point old tail to old head
    last.next = head;
    
    // 3. Update head to the old tail
    head = last;
    
    return head;
}`,
    desc: "Traverses the list using two pointers to locate the last and second-to-last nodes. It then performs three simple O(1) pointer updates to sever the tail and attach it to the front."
  },
  moveRecursive: {
    id: 'moveRecursive',
    title: 'Recursive Approach',
    icon: <RefreshCw size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public Node moveToFront(Node head) {
    if (head == null || head.next == null) return head;
    return recurse(head, null, head);
}

private Node recurse(Node curr, Node prev, Node head) {
    // Base Case: We reached the last node
    if (curr.next == null) {
        prev.next = null; // Sever tail
        curr.next = head; // Point tail to head
        return curr;      // Return new head
    }
    
    // Keep traversing
    return recurse(curr.next, curr, head);
}`,
    desc: "Passes the 'prev' and 'curr' pointers down the call stack until 'curr' reaches the tail. The base case performs the exact same three pointer rewiring steps and bubbles the new head back up."
  }
};

// Component interfaces
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
      <div className="flex items-center gap-3 mb-6 text-indigo-600">
          <GitPullRequest size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Move Last Element to Front</h2>
      </div>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given a singly linked list, the task is to detach the <strong>very last node</strong> of the list and reattach it as the <strong>first node</strong> (the new head) of the list.
        </p>

        <div className="space-y-6 pt-4">
           <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs border-b pb-2">Examples</h4>
           
           <div className="grid md:grid-cols-2 gap-6">
               <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-emerald-800 uppercase tracking-widest text-[10px] items-center gap-2"><Zap size={14}/> Example 1: Standard List</div>
                   <div className="space-y-2">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-12 text-xs font-bold">Input:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">1 <ArrowRight size={12} className="mx-1"/> 2 <ArrowRight size={12} className="mx-1"/> 3 <ArrowRight size={12} className="mx-1"/> 4 <ArrowRight size={12} className="mx-1"/> 5</div>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-emerald-200/50 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold w-12">Output:</span> 
                          <div className="flex items-center text-emerald-700 font-bold bg-emerald-100 px-2 py-1 rounded border border-emerald-200 text-xs">5 <ArrowRight size={12} className="mx-1 text-emerald-400"/> 1 <ArrowRight size={12} className="mx-1 text-emerald-400"/> 2 <ArrowRight size={12} className="mx-1 text-emerald-400"/> 3 <ArrowRight size={12} className="mx-1 text-emerald-400"/> 4</div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1">Node 5 is detached and placed at the beginning.</p>
                   </div>
               </div>

               <div className="bg-sky-50/50 border border-sky-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-sky-800 uppercase tracking-widest text-[10px] items-center gap-2"><Zap size={14}/> Example 2: Two Nodes</div>
                   <div className="space-y-2">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-12 text-xs font-bold">Input:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">10 <ArrowRight size={12} className="mx-1"/> 20</div>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-sky-200/50 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold w-12">Output:</span> 
                          <div className="flex items-center text-sky-700 font-bold bg-sky-100 px-2 py-1 rounded border border-sky-200 text-xs">20 <ArrowRight size={12} className="mx-1 text-sky-400"/> 10</div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1">Node 20 becomes the new head, pointing to 10.</p>
                   </div>
               </div>
           </div>
        </div>

        <div className="bg-rose-50 border border-rose-200 p-6 rounded-3xl mt-8">
            <h3 className="text-sm font-black text-rose-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                <AlertCircle size={16}/> Edge Cases to Consider
            </h3>
            <ul className="text-sm text-rose-700 leading-relaxed list-disc pl-5 space-y-2">
                <li><strong>Empty List:</strong> If <code>head == null</code>, simply return null.</li>
                <li><strong>Single Node List:</strong> If <code>head.next == null</code>, the last node is already the front! Return the head immediately without making changes.</li>
            </ul>
        </div>
      </div>
    </div>
  </div>
);

const TheoryTab = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center gap-3 mb-6 text-indigo-600">
          <Database size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Theory: The 3-Step Pointer Rewire</h2>
      </div>
      
      <p className="text-slate-600 leading-relaxed text-lg">
          To avoid creating new nodes and wasting memory, we accomplish this strictly by reorganizing the existing memory addresses. We need to find the last node (<code>last</code>) and the node right before it (<code>secLast</code>).
      </p>

      <div className="space-y-4 pt-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-black text-xl shrink-0"><Scissors size={20}/></div>
              <div>
                  <h3 className="font-black text-slate-800 mb-1">1. Sever the Tail</h3>
                  <p className="text-sm text-slate-500 font-mono"><code>secLast.next = null;</code></p>
                  <p className="text-xs text-slate-400 mt-2">The second-to-last node must become the new tail of the list. We detach the old tail completely.</p>
              </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-black text-xl shrink-0"><CornerUpLeft size={20}/></div>
              <div>
                  <h3 className="font-black text-slate-800 mb-1">2. Wrap Around</h3>
                  <p className="text-sm text-slate-500 font-mono"><code>last.next = head;</code></p>
                  <p className="text-xs text-slate-400 mt-2">The old tail now points to the original beginning of the list, effectively bridging the gap.</p>
              </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xl shrink-0"><Trophy size={20}/></div>
              <div>
                  <h3 className="font-black text-slate-800 mb-1">3. Reassign Head</h3>
                  <p className="text-sm text-slate-500 font-mono"><code>head = last;</code></p>
                  <p className="text-xs text-slate-400 mt-2">The <code>head</code> variable is officially shifted to the old tail. The operation is complete!</p>
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
           <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-emerald-400 relative z-10 uppercase tracking-tight">
               <Trophy size={24} /> Interview Cheat Sheet
           </h3>
           <p className="text-sm text-slate-300 leading-relaxed italic relative z-10 mb-6">
               "This problem tests your fundamental understanding of linked list pointer manipulation. While you can solve it recursively, the Iterative approach is strictly preferred as it doesn't waste O(N) call stack memory."
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
               <div className="p-5 rounded-2xl border bg-emerald-900/40 border-emerald-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1">Iterative (Expected)</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(N) <br/><strong>Space:</strong> O(1)</div>
                    <p className="text-[10px] text-emerald-200/70 leading-relaxed mt-2">Requires one full pass of the list to locate the tail. Modifies existing pointers directly.</p>
               </div>
               <div className="p-5 rounded-2xl border bg-fuchsia-900/40 border-fuchsia-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-fuchsia-400 mb-1">Recursive (Alternative)</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(N) <br/><strong>Space:</strong> O(N) Aux</div>
                    <p className="text-[10px] text-fuchsia-200/70 leading-relaxed mt-2">Passes pointers into the stack until the tail is reached. Rarely used in production due to StackOverflow risks on large lists.</p>
               </div>
           </div>
       </div>

       <div className="grid grid-cols-1 gap-6 mt-8">
           <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
               <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <Activity size={14} className="text-indigo-500"/> Common Mistakes to Avoid
               </h4>
               <ul className="space-y-3 text-sm text-slate-600 leading-relaxed list-disc pl-5">
                   <li><strong>Losing the Head:</strong> If you do <code>head = last</code> before <code>last.next = head</code>, you overwrite the original head and permanently lose access to the rest of your list!</li>
                   <li><strong>NullPointerExceptions:</strong> Failing to check <code>head == null || head.next == null</code> will cause a crash when you try to access <code>last.next</code> on an empty list.</li>
               </ul>
           </div>
       </div>
    </div>
);

// Coordinate Math for 2D Memory Grid
const generateNode = (val: number, id: number, nextId: number | null, index: number): ListNodeData => {
    // 3 columns, staggered layout to showcase sweeping pointer arcs
    const col = index % 3;
    const row = Math.floor(index / 3);
    
    const x = 100 + col * 260; 
    const y = 80 + row * 160 + (col % 2 === 1 ? 40 : 0); 

    return {
        id: id,
        val: val,
        addr: '0x' + (100 + (id * 32)).toString(16).toUpperCase().padStart(3, '0'),
        nextId: nextId,
        x, y
    };
};

export default function MoveLastToFrontViz() {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'overview' | 'theory' | 'interview'>('visualizer');
  const [selectedOpId, setSelectedOpId] = useState<keyof typeof OPERATIONS>('moveIterative');
  const [inputList, setInputList] = useState('10, 20, 30, 40, 50');
  
  const [baseList, setBaseList] = useState<ListNodeData[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  // Pan and Zoom State for Infinite Canvas
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const selectedOp = OPERATIONS[selectedOpId];

  // Initialize and synchronize base list from input
  useEffect(() => {
      const vals = inputList.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      const newNodes = vals.map((v, i) => generateNode(v, i, i < vals.length - 1 ? i + 1 : null, i));
      setBaseList(newNodes);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
  }, [inputList, selectedOpId]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    if (baseList.length === 0) return steps;

    let list = baseList.map(n => ({...n}));

    const updateNextId = (targetId: number, newNextId: number | null) => {
        list = list.map(n => n.id === targetId ? {...n, nextId: newNextId} : n);
    };

    const addStep = (phase: string, desc: string, line: number, stateProps: any) => {
      steps.push({
        phase, description: desc, line, 
        state: { list: list.map(n=>({...n})), ...stateProps }
      });
    };

    if (selectedOpId === 'moveIterative') {
        let headIdx = list[0].id;
        let secLastIdx: number | null = null;
        let lastIdx = headIdx;
        let activeLinkId: number | null = null;
        
        addStep("Method Call", `moveToFront(head) called.`, 1, { headIdx, secLastIdx, lastIdx, activeLinkId });
        addStep("Edge Case Check", `if (head == null || head.next == null)`, 3, { headIdx, secLastIdx, lastIdx, activeLinkId });
        
        if (list.length <= 1) {
            addStep("Return Immediately", `List has 1 or 0 nodes. No action needed.`, 4, { headIdx, secLastIdx, lastIdx, isSuccess: true, activeLinkId });
            return steps;
        }

        addStep("Initialize Pointers", `Node secLast = null; Node last = head;`, 7, { headIdx, secLastIdx, lastIdx, activeLinkId });

        while (list.find(n=>n.id===lastIdx)?.nextId !== null) {
            let lastNode = list.find(n=>n.id===lastIdx);
            addStep("Loop Condition", `last.next (${list.find(n=>n.id===lastNode?.nextId)?.addr}) != null`, 11, { headIdx, secLastIdx, lastIdx, activeLinkId });
            
            secLastIdx = lastIdx;
            addStep("Update secLast", `secLast = last;`, 12, { headIdx, secLastIdx, lastIdx, activeLinkId });
            
            lastIdx = lastNode?.nextId as number;
            addStep("Advance last", `last = last.next;`, 13, { headIdx, secLastIdx, lastIdx, activeLinkId });
        }

        addStep("Loop Terminates", `last.next is null. We found the tail!`, 11, { headIdx, secLastIdx, lastIdx, activeLinkId });
        
        // 1. Sever the old tail
        if (secLastIdx !== null) {
            updateNextId(secLastIdx, null);
            addStep("1. Sever the Tail", `secLast.next = null; The tail is detached.`, 17, { headIdx, secLastIdx, lastIdx, severing: true, activeLinkId: null });
        }
        
        // 2. Point old tail to old head
        updateNextId(lastIdx, headIdx);
        activeLinkId = lastIdx;
        addStep("2. Wrap Around", `last.next = head; The detached tail curves backward to the front!`, 20, { headIdx, secLastIdx, lastIdx, wrapping: true, activeLinkId });
        
        // 3. Update head
        headIdx = lastIdx;
        activeLinkId = null;
        addStep("3. Reassign Head", `head = last; The list is officially updated.`, 23, { headIdx, secLastIdx, lastIdx, wrapping: true, activeLinkId });

        addStep("Operation Complete", `Return new head.`, 25, { headIdx, secLastIdx, lastIdx, wrapping: true, isSuccess: true, activeLinkId });
    } 
    else if (selectedOpId === 'moveRecursive') {
        let headIdx = list[0].id;
        let callStack: any[] = [];
        let activeLinkId: number | null = null;
        
        addStep("Method Call", `moveToFront(head) called.`, 1, { headIdx, activeLinkId });
        addStep("Edge Case Check", `if (head == null || head.next == null)`, 2, { headIdx, activeLinkId });
        
        if (list.length <= 1) {
            addStep("Return Immediately", `List has 1 or 0 nodes.`, 2, { headIdx, isSuccess: true, activeLinkId });
            return steps;
        }

        const recurse = (currIdx: number, prevIdx: number | null, depth: number): number => {
            callStack.push({ curr: currIdx, prev: prevIdx, depth });
            
            addStep("Recursive Call", `recurse(curr, prev, head) added to Stack (Depth ${depth}).`, 6, { headIdx, currIdx, prevIdx, callStack: [...callStack], activeLinkId });
            
            let currNode = list.find(n=>n.id===currIdx);
            
            addStep("Base Case Check", `if (curr.next == null)`, 8, { headIdx, currIdx, prevIdx, callStack: [...callStack], activeLinkId });
            if (currNode?.nextId === null) {
                addStep("Tail Reached", `curr is the last node!`, 8, { headIdx, currIdx, prevIdx, callStack: [...callStack], activeLinkId });
                
                if (prevIdx !== null) {
                    updateNextId(prevIdx, null);
                    addStep("1. Sever Tail", `prev.next = null;`, 9, { headIdx, currIdx, prevIdx, callStack: [...callStack], severing: true, activeLinkId: null });
                }
                
                updateNextId(currIdx, headIdx);
                activeLinkId = currIdx;
                addStep("2. Wrap Around", `curr.next = head; The tail dynamically links back to head!`, 10, { headIdx, currIdx, prevIdx, callStack: [...callStack], wrapping: true, activeLinkId });
                
                addStep("Return new head", `return curr; Bubbling the new head back up the stack.`, 11, { headIdx, currIdx, prevIdx, callStack: [...callStack], wrapping: true, activeLinkId });
                callStack.pop();
                return currIdx;
            }
            
            let nextIdx = currNode?.nextId as number;
            addStep("Advance", `return recurse(curr.next, curr, head); Pausing Depth ${depth}...`, 15, { headIdx, currIdx, prevIdx, callStack: [...callStack], activeLinkId });
            
            let newHead = recurse(nextIdx, currIdx, depth + 1);
            
            activeLinkId = null;
            addStep("Bubble Up", `Resuming Depth ${depth}. Returning new head.`, 15, { headIdx, currIdx, prevIdx, callStack: [...callStack], activeLinkId });
            callStack.pop();
            return newHead;
        };

        let newHeadIdx = recurse(headIdx, null, 1);
        headIdx = newHeadIdx;
        addStep("Operation Complete", `All stack frames popped. New head is set.`, 3, { headIdx, isSuccess: true, wrapping: true, activeLinkId: null });
    }

    if (steps.length === 0) steps.push({ phase: 'Ready', description: 'Click step to simulate.', line: 1, state: { list: baseList } });
    return steps;
  }, [baseList, selectedOpId]);

  useEffect(() => { setCurrentStep(0); }, [selectedOpId, inputList]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleReset = () => { setCurrentStep(0); setPan({x:0, y:0}); setZoom(1); };

  const handleApply = () => {
     const finalState = trace[trace.length - 1].state;
     if (finalState && finalState.list && finalState.isSuccess && finalState.list.length > 1) {
         // Physically rearrange the array to match the logical pointer changes
         // so it renders sequentially in the UI on the next run
         let newArr: ListNodeData[] = [];
         let current = finalState.headIdx;
         let index = 0;
         while (current !== null) {
             let node = finalState.list.find((n: any) => n.id === current);
             if (node) {
                 const col = index % 3;
                 const row = Math.floor(index / 3);
                 const x = 100 + col * 260; 
                 const y = 80 + row * 160 + (col % 2 === 1 ? 40 : 0); 
                 newArr.push({...node, x, y});
                 current = node.nextId;
                 index++;
             } else {
                 break;
             }
         }
         setBaseList(newArr);
     }
     setCurrentStep(0);
  };

  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedOp.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  // Pan & Zoom Event Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handlePointerUp = () => setIsDragging(false);

  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 2));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));
  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const cur = trace[currentStep] || trace[0] || { state: { list: baseList } };
  const state = cur.state || { list: baseList };
  
  const { 
      isSuccess, headIdx, secLastIdx, lastIdx, currIdx, prevIdx, severing, wrapping, callStack, activeLinkId
  } = state;

  const getThemeColor = () => selectedOpId === 'moveIterative' ? 'indigo' : 'fuchsia';
  const activeTheme = getThemeColor();

  // Draw pure SVG lines to connect nodes logically
  const renderSvgArrows = () => {
    return state.list.map((nodeObj: ListNodeData) => {
        if (nodeObj.nextId === null) return null;
        
        const target = state.list.find((n: ListNodeData) => n.id === nodeObj.nextId);
        if (!target) return null;

        // Origin point: center of the "NEXT" box
        const startX = nodeObj.x + 92; 
        const startY = nodeObj.y + 28; 

        // Destination point: left middle of the target Node
        const endX = target.x - 6;
        const endY = target.y + 28;

        const isActive = activeLinkId === nodeObj.id;
        const strokeColor = isActive ? '#f59e0b' : '#94a3b8'; // amber-500 or slate-400
        const strokeWidth = isActive ? 4 : 2;
        const strokeOpacity = isActive ? 1 : 0.6;
        const marker = isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead-default)';

        let pathD = '';
        const diffX = endX - startX;
        const diffY = endY - startY;

        if (Math.abs(diffY) > 30) {
            // Target is on a different row (Wrap around logic)
            if (diffX < 0) {
                 pathD = `M ${startX},${startY} C ${startX + 60},${startY + 40} ${endX - 60},${endY - 40} ${endX},${endY}`;
            } else {
                 pathD = `M ${startX},${startY} C ${startX + 80},${startY + (diffY/2)} ${endX - 80},${endY - (diffY/2)} ${endX},${endY}`;
            }
        } else {
            // Target is on the SAME row
            if (diffX < -10) {
                 // Wrapping backwards to the very beginning (High arching wrap-around)
                 pathD = `M ${startX},${startY} C ${startX + 60},${startY - 120} ${endX - 60},${endY - 120} ${endX},${endY}`;
            } else if (diffX > 200) {
                 // Forward jump over nodes
                 pathD = `M ${startX},${startY} C ${startX + 50},${startY + 90} ${endX - 50},${endY + 90} ${endX},${endY}`;
            } else {
                 // Adjacent Right (Direct link)
                 pathD = `M ${startX},${startY} C ${startX + 40},${startY} ${endX - 40},${endY} ${endX},${endY}`;
            }
        }

        return (
            <path 
                key={`link-${nodeObj.id}-${target.id}`}
                d={pathD} 
                fill="none" 
                stroke={strokeColor} 
                strokeWidth={strokeWidth} 
                strokeOpacity={strokeOpacity}
                markerEnd={marker} 
                className={`transition-all duration-700 ease-in-out ${isActive ? 'animate-pulse' : ''}`} 
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
              <GitPullRequest size={100} />
          </div>
          <div className="flex items-center gap-5 z-10">
            <div className={`bg-${activeTheme}-600 p-4 rounded-2xl shadow-lg shadow-${activeTheme}-100 flex items-center justify-center transition-colors duration-500`}>
                <GitPullRequest className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Move Last to Front</h1>
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
                        let btnColor = op.id === 'moveIterative' ? 'indigo' : 'fuchsia';
                        
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
                  <div className="p-4 font-mono text-[12px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {/* Highlighter Bar */}
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : `bg-${activeTheme}-500/20 border-${activeTheme}-500`}`} style={{ top: `${((cur.line - 1) * 18) + 16}px`, height: '18px' }} />
                      )}
                      
                      {selectedOp.code.split('\n').map((line: string, idx: number) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme={isSuccess && cur.line === idx + 1 ? 'emerald' : activeTheme} />
                      ))}
                  </div>
                </div>

                {/* Method Description Box */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                   <h4 className={`text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2`}>
                      <BookOpen size={14} className={`text-${activeTheme}-600`}/> Concept
                   </h4>
                   <p className="text-sm text-slate-500 leading-relaxed italic">
                       {selectedOp.desc}
                   </p>
                </div>

              </div>

              {/* Right Col: Simulation Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className={`text-[10px] font-black text-${activeTheme}-600 uppercase block pl-1 tracking-widest font-mono`}>Linked List Nodes</label>
                        <input type="text" value={inputList} onChange={(e) => { setInputList(e.target.value); setCurrentStep(0); }} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${activeTheme}-500 outline-none transition-all shadow-inner`} placeholder="10, 20, 30, 40, 50" />
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
                <div className="bg-slate-50 bg-[linear-gradient(to_right,#cbd5e130_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e130_1px,transparent_1px)] bg-[size:20px_20px] rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col shadow-inner overflow-hidden min-h-[460px]">
                  
                   <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 z-30 pointer-events-none">
                      <div className="flex items-center gap-4 bg-white/90 px-4 py-2 rounded-xl backdrop-blur shadow-sm border border-slate-200 pointer-events-auto">
                          <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest font-mono flex items-center gap-2">
                              <Network size={16} className={activeTheme === 'indigo' ? 'text-indigo-500' : 'text-fuchsia-500'}/> Memory Canvas
                          </span>
                      </div>
                      
                      <div className="flex gap-2 pointer-events-auto">
                          {isSuccess && state.list.length > 1 && (
                              <button onClick={handleApply} className="text-[10px] font-black bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 uppercase tracking-widest flex items-center gap-1 transition-colors shadow-lg">
                                  <Check size={14}/> Confirm Physical Memory Move
                              </button>
                          )}
                      </div>
                   </div>

                   {/* Recursive Call Stack */}
                   <div className="absolute bottom-6 left-6 flex gap-4 z-40 pointer-events-none">
                       {callStack && callStack.length > 0 && (
                            <div className={`bg-slate-900 text-${activeTheme}-400 font-mono text-[10px] p-4 rounded-2xl border border-slate-700 w-64 shadow-2xl animate-in slide-in-from-bottom-4 pointer-events-auto`}>
                                <div className="text-slate-500 mb-3 border-b border-slate-700 pb-2 flex items-center justify-between">
                                   <span className="uppercase tracking-widest text-[9px] font-black">JVM Call Stack</span>
                                   <RefreshCw size={14}/>
                                </div>
                                <div className="flex flex-col-reverse gap-1.5 mt-2 max-h-[140px] overflow-y-auto scrollbar-thin">
                                    {callStack.map((frame: any, i: number) => (
                                        <div key={i} className={`p-2 rounded-lg flex justify-between items-center transition-all ${i === callStack.length - 1 ? `bg-${activeTheme}-900/50 border border-${activeTheme}-500/30 text-${activeTheme}-300 shadow-md transform scale-[1.02]` : 'bg-slate-800/50 text-slate-500'}`}>
                                            <span>recurse({state.list.find((n:any) => n.id === frame.curr)?.addr ?? 'null'})</span>
                                            <span className="opacity-50 text-[8px] ml-2">D:{frame.depth}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                       )}
                   </div>

                   {/* Fixed Zoom Controls */}
                   <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-40 pointer-events-auto bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur">
                      <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                      <button onClick={resetZoom} className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><Maximize size={18}/></button>
                      <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><ZoomOut size={18}/></button>
                   </div>

                   {/* Interactive Canvas */}
                   <div 
                    className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                   >
                       <div 
                          className="absolute top-0 left-0 w-full h-full origin-top-left pointer-events-none"
                          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
                       >
                           
                           {/* SVG Layer for Pointer Arrows */}
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0">
                               <defs>
                                   <marker id="arrowhead-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" /> {/* slate-400 */}
                                   </marker>
                                   <marker id="arrowhead-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" /> {/* amber-500 */}
                                   </marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>

                           {/* HTML Layer for Node Blocks & Labels */}
                           {state.list && state.list.map((nodeObj: ListNodeData, idx: number) => {
                              
                              const isHead = headIdx === nodeObj.id;
                              
                              // Iterative pointers
                              const isSecLast = secLastIdx === nodeObj.id;
                              const isLast = lastIdx === nodeObj.id;

                              // Recursive pointers
                              const isCurrRec = currIdx === nodeObj.id;
                              const isPrevRec = prevIdx === nodeObj.id;
                              
                              const isTarget = isHead || isSecLast || isLast || isCurrRec || isPrevRec;
                              
                              let themeColor = 'slate';
                              if (isLast || isCurrRec) themeColor = 'amber';
                              else if (isSecLast || isPrevRec) themeColor = 'rose';
                              else if (isHead) themeColor = 'emerald';

                              const labels = [];
                              if (isHead) labels.push({ text: "head", color: "emerald", position: "top" });
                              
                              if (isSecLast) labels.push({ text: "secLast", color: "rose", position: "bottom" });
                              if (isLast) labels.push({ text: "last", color: "amber", position: "top" });
                              
                              if (isPrevRec) labels.push({ text: "prev", color: "rose", position: "bottom" });
                              if (isCurrRec) labels.push({ text: "curr", color: "amber", position: "top" });

                              return (
                                  <div key={nodeObj.id} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      
                                      {/* Top Labels */}
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center z-20">
                                          {labels.filter(l => l.position === 'top').map((l, i) => (
                                              <PointerLabel key={i} label={l.text} color={l.color} position="top" active={true} offset={((isLast || isCurrRec) && isHead) ? -24 : 0} />
                                          ))}
                                      </div>

                                      {/* Bottom Labels */}
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center z-20">
                                          {labels.filter(l => l.position === 'bottom').map((l, i) => (
                                              <PointerLabel key={i} label={l.text} color={l.color} position="bottom" active={true} />
                                          ))}
                                      </div>

                                      {/* The Node Itself */}
                                      <div className="relative group">
                                          <span className="absolute -top-6 left-0 text-xs text-slate-400 font-mono font-bold opacity-80">{nodeObj.addr}</span>
                                          <div className={`flex items-center w-28 h-14 border-2 rounded-2xl transition-all duration-300 shadow-sm ${isTarget ? `ring-4 ring-${themeColor}-300 scale-105` : ''} bg-white border-${themeColor}-400`}>
                                              <div className={`flex-1 flex justify-center font-mono font-black text-2xl text-${themeColor}-800`}>
                                                  {nodeObj.val}
                                              </div>
                                              <div className={`w-10 h-full border-l-2 flex flex-col items-center justify-center rounded-r-xl border-${themeColor}-400 bg-${themeColor}-50`}>
                                                  <span className="text-[7px] font-black uppercase tracking-widest opacity-60 transform -rotate-90">NEXT</span>
                                              </div>
                                          </div>

                                          {/* Null indicator embedded below if pointer is null */}
                                          {nodeObj.nextId === null && (
                                              <div className="absolute -right-10 top-1/2 -translate-y-1/2 text-sm font-black font-mono text-slate-400">null</div>
                                          )}
                                      </div>
                                  </div>
                              )
                          })}
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
const PointerLabel: React.FC<PointerLabelProps> = ({ label, color, position, active = true, offset = 0, strikethrough = false }) => {
    const colorClasses: Record<string, string> = {
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        sky: 'bg-sky-100 text-sky-700 border-sky-200',
        amber: 'bg-amber-100 text-amber-700 border-amber-200',
        rose: 'bg-rose-100 text-rose-700 border-rose-200',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
        indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        violet: 'bg-violet-100 text-violet-700 border-violet-200',
        slate: 'bg-slate-100 text-slate-500 border-slate-200'
    };
    const activeColorClass = colorClasses[color] || colorClasses['slate'];

    const topPos = position === 'top' ? '-top-10' : '-bottom-10';
    const alignClass = position === 'top' ? 'flex-col-reverse' : 'flex-col';

    return (
        <div className={`absolute ${topPos} h-8 flex ${alignClass} items-center justify-center animate-in zoom-in duration-300 z-10`} style={{ transform: `translateX(${offset}px)`}}>
            <span className={`text-[9px] font-black font-mono tracking-widest px-1.5 py-0.5 rounded border shadow-sm ${activeColorClass} ${strikethrough ? 'line-through opacity-50' : ''}`}>
                {label}
            </span>
            {position === 'top' ? 
                <ArrowDown size={14} className={`text-${color}-500`} strokeWidth={3}/> : 
                <ArrowUp size={14} className={`text-${color}-500`} strokeWidth={3}/>
            }
        </div>
    );
};

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, nextAddr, themeColor = 'slate', isTarget }) => {
    return null; // Rendered inline in parent to handle dynamic absolute positioning & labels
};

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'indigo' }) => {
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|Node|true|false|System|out|print|println|static|moveToFront|recurse)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['moveToFront', 'recurse'].includes(part)) return <span key={i} className={`text-${theme}-400 font-bold`}>{part}</span>;
          if (['true', 'false', 'null', 'None'].includes(part)) return <span key={i} className="text-orange-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-emerald-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};