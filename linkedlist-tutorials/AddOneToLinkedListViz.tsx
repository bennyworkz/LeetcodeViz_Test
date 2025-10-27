import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp, CornerUpLeft,
  GitCommit, MonitorPlay, ChevronLeft, ChevronRight, 
  Network, Database, RotateCcw, ListOrdered, RefreshCw,
  PlusCircle, Zap, AlertCircle, Goal, Info, Calculator, Layers,
  ZoomIn, ZoomOut, Maximize
} from 'lucide-react';

const OPERATIONS = {
  addIterative: {
    id: 'addIterative',
    title: 'Iterative (Rightmost non-9)',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public Node addOne(Node head) {
    Node lastNon9 = null;
    Node curr = head;
    
    // Find the rightmost node that is not 9
    while (curr != null) {
        if (curr.data != 9) lastNon9 = curr;
        curr = curr.next;
    }
    
    // If all nodes are 9, create a new head
    if (lastNon9 == null) {
        Node newHead = new Node(1);
        newHead.next = head;
        curr = head;
        while (curr != null) {
            curr.data = 0;
            curr = curr.next;
        }
        return newHead;
    }
    
    // Increment the rightmost non-9
    lastNon9.data++;
    curr = lastNon9.next;
    
    // Set all following 9s to 0
    while (curr != null) {
        curr.data = 0;
        curr = curr.next;
    }
    
    return head;
}`,
    desc: "An incredibly clever O(1) space approach. We find the rightmost node that isn't a 9. We increment it, and then set all nodes to its right to 0. If there is no such node (e.g., 999), we prepend a 1 to the head and set the rest to 0."
  },
  addRecursive: {
    id: 'addRecursive',
    title: 'Recursive Approach',
    icon: <RefreshCw size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public int addWithCarry(Node head) {
    // Base Case: end of list, return 1 to add
    if (head == null) return 1; 
    
    int sum = head.data + addWithCarry(head.next);
    head.data = sum % 10;
    return sum / 10; // Return carry
}

public Node addOne(Node head) {
    int carry = addWithCarry(head);
    
    // If a carry remains, we need a new head
    if (carry > 0) {
        Node newHead = new Node(carry);
        newHead.next = head;
        return newHead;
    }
    
    return head;
}`,
    desc: "A mathematically pure approach. We use the call stack to reach the end of the list, inject a +1, and then bubble the 'carry' back up to the head, updating nodes on the fly."
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
  isChanging?: boolean;
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
      <div className="flex items-center gap-3 mb-6 text-sky-600">
          <PlusCircle size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Add 1 to a Linked List Number</h2>
      </div>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          A number is represented in a linked list such that each digit corresponds to a node in the list. The head represents the most significant digit, and the tail represents the least significant digit. The task is to <strong>add 1</strong> to the entire number.
        </p>

        <div className="space-y-6 pt-4">
           <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs border-b pb-2">Examples</h4>
           
           <div className="grid md:grid-cols-2 gap-6">
               <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-emerald-800 uppercase tracking-widest text-[10px] items-center gap-2"><Goal size={14}/> Example 1: Standard Addition</div>
                   <div className="space-y-2">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-12 text-xs font-bold">Input:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">1 <ArrowRight size={12} className="mx-1"/> 2 <ArrowRight size={12} className="mx-1"/> 3</div>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-emerald-200/50 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold w-12">Output:</span> 
                          <div className="flex items-center text-emerald-700 font-bold bg-emerald-100 px-2 py-1 rounded border border-emerald-200 text-xs">1 <ArrowRight size={12} className="mx-1 text-emerald-400"/> 2 <ArrowRight size={12} className="mx-1 text-emerald-400"/> 4</div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1">123 + 1 = 124.</p>
                   </div>
               </div>

               <div className="bg-sky-50/50 border border-sky-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-sky-800 uppercase tracking-widest text-[10px] items-center gap-2"><Goal size={14}/> Example 2: Carry Overflow</div>
                   <div className="space-y-2">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-12 text-xs font-bold">Input:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">1 <ArrowRight size={12} className="mx-1"/> 9 <ArrowRight size={12} className="mx-1"/> 9</div>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-sky-200/50 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold w-12">Output:</span> 
                          <div className="flex items-center text-sky-700 font-bold bg-sky-100 px-2 py-1 rounded border border-sky-200 text-xs">2 <ArrowRight size={12} className="mx-1 text-sky-400"/> 0 <ArrowRight size={12} className="mx-1 text-sky-400"/> 0</div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1">199 + 1 = 200. The carry propagates backwards.</p>
                   </div>
               </div>
           </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl mt-8">
            <h3 className="text-sm font-black text-amber-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                <AlertCircle size={16}/> The Ultimate Edge Case: 999
            </h3>
            <p className="text-sm text-amber-700 leading-relaxed">
                If the linked list consists entirely of <code>9</code>s (e.g. <code>9 -{'>'} 9 -{'>'} 9</code>), adding 1 results in <code>1000</code>. This requires you to dynamically allocate a brand new node for the <code>1</code>, set it as the new <code>head</code>, and change the remaining nodes to <code>0</code>.
            </p>
        </div>
      </div>
    </div>
  </div>
);

const TheoryTab = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center gap-3 mb-6 text-emerald-600">
          <Calculator size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Theory: Dealing with Carry</h2>
      </div>
      
      <p className="text-slate-600 leading-relaxed text-lg">
          Addition naturally flows from right to left (least significant digit to most). However, Singly Linked Lists only flow left to right! How do we solve this?
      </p>

      <div className="space-y-4 pt-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-black text-xl shrink-0"><RotateCcw size={20}/></div>
              <div>
                  <h3 className="font-black text-slate-800 mb-1">Option 1: Reverse, Add, Reverse</h3>
                  <p className="text-sm text-slate-600">The brute force approach. Reverse the list, add 1 using standard logic moving left-to-right, then reverse the list back. Takes O(N) time but requires 3 full passes of the list.</p>
              </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center font-black text-xl shrink-0"><RefreshCw size={20}/></div>
              <div>
                  <h3 className="font-black text-slate-800 mb-1">Option 2: The Call Stack (Recursive)</h3>
                  <p className="text-sm text-slate-600">Recursion creates an implicit "stack". By recurring to the end first, the operations execute from right to left as the stack unwinds. Elegant, but takes O(N) auxiliary space.</p>
              </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-black text-xl shrink-0"><Zap size={20}/></div>
              <div>
                  <h3 className="font-black text-slate-800 mb-1">Option 3: The "Rightmost Non-9" (Iterative)</h3>
                  <p className="text-sm text-slate-600">The 100% optimal approach. In addition, only <code>9</code>s cause a carry. By finding the rightmost node that <em>isn't</em> a 9, we know exactly where the carry stops. We increment it, and flip all subsequent 9s to 0s!</p>
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
           <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-sky-400 relative z-10 uppercase tracking-tight">
               <Trophy size={24} /> Interview Cheat Sheet
           </h3>
           <p className="text-sm text-slate-300 leading-relaxed italic relative z-10 mb-6">
               "This problem is a classic because it merges basic arithmetic logic with Linked List constraints. The 'Rightmost Non-9' Iterative approach is a brilliant optimization that interviewers highly value over the messy double-reversal approach."
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
               <div className="p-5 rounded-2xl border bg-sky-900/40 border-sky-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-sky-400 mb-1">Iterative (Optimal)</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(N) <br/><strong>Space:</strong> O(1)</div>
                    <p className="text-[10px] text-sky-200/70 leading-relaxed mt-2">Finds the rightmost non-9 in one pass. Modifies nodes directly. Zero auxiliary space used.</p>
               </div>
               <div className="p-5 rounded-2xl border bg-fuchsia-900/40 border-fuchsia-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-fuchsia-400 mb-1">Recursive</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(N) <br/><strong>Space:</strong> O(N) Aux</div>
                    <p className="text-[10px] text-fuchsia-200/70 leading-relaxed mt-2">Passes the carry back up the call stack. A fantastic demonstration of recursive design, though technically heavier on memory.</p>
               </div>
           </div>
       </div>

       <div className="grid grid-cols-1 gap-6 mt-8">
           <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
               <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <Activity size={14} className="text-emerald-500"/> Implementation Trick: The Modulo
               </h4>
               <p className="text-sm text-slate-600 leading-relaxed">
                   In the recursive function, doing <code>sum = node.data + carry</code> is standard. But correctly isolating the digit vs the carry requires modulo math: <br/><br/>
                   <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200 inline-block font-mono text-xs">Digit = sum % 10</span> (e.g., 10 % 10 = 0)<br/>
                   <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200 inline-block font-mono text-xs mt-2">Carry = sum / 10</span> (e.g., 10 / 10 = 1)
               </p>
           </div>
       </div>
    </div>
);

// Advanced Coordinate Math for 2D Memory Grid
const generateNode = (val: number, id: number, nextId: number | null): ListNodeData => {
    const col = id % 4;
    const row = Math.floor(id / 4);
    
    // Spread horizontally and stagger to allow curved pointers to be visible
    const x = 100 + col * 200; 
    const y = 100 + row * 160 + (col % 2 === 1 ? 40 : 0); 

    return {
        id: id,
        val: val,
        addr: '0x' + (100 + (id * 32)).toString(16).toUpperCase().padStart(3, '0'),
        nextId: nextId,
        x, y
    };
};

// Helper to extract logical linked list order
const getLogicalList = (list: ListNodeData[], headIdx: number | null) => {
    let res: ListNodeData[] = [];
    let curr = headIdx;
    while(curr !== null) {
        let node = list.find(n => n.id === curr);
        if(node) {
           res.push(node);
           curr = node.nextId;
        } else break;
    }
    return res;
};

export default function AddOneToLinkedListViz() {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'overview' | 'theory' | 'interview'>('visualizer');
  const [selectedOpId, setSelectedOpId] = useState<keyof typeof OPERATIONS>('addIterative');
  const [inputList, setInputList] = useState('1, 9, 9');
  
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
      const vals = inputList.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 0 && n <= 9);
      if (vals.length === 0) {
          setBaseList([generateNode(0, 0, null)]);
      } else {
          const newNodes = vals.map((v, i) => generateNode(v, i, i < vals.length - 1 ? i + 1 : null));
          setBaseList(newNodes);
      }
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
  }, [inputList, selectedOpId]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    if (baseList.length === 0) return steps;

    let list = baseList.map(n => ({...n}));
    let nextNodeId = baseList.length;

    const addStep = (phase: string, desc: string, line: number, stateProps: any) => {
      const headIdx = stateProps.headIdx !== undefined ? stateProps.headIdx : 0;
      // Deep copy to prevent mutations from overwriting past steps
      const listSnapshot = list.map(n => ({...n}));
      const logicalList = getLogicalList(listSnapshot, headIdx);

      steps.push({
        phase, description: desc, line, 
        state: { list: logicalList, headIdx, ...stateProps }
      });
    };

    if (selectedOpId === 'addIterative') {
        let headIdx = 0;
        let lastNon9Idx: number | null = null;
        let currIdx: number | null = headIdx;
        
        addStep("Method Call", `addOne(head) called.`, 1, { headIdx, currIdx, lastNon9Idx });
        addStep("Initialize Pointers", `Node lastNon9 = null; Node curr = head;`, 2, { headIdx, currIdx, lastNon9Idx });

        while (currIdx !== null) {
            let nodeData = list.find(n => n.id === currIdx)?.val;
            addStep("Loop Condition", `curr != null. Inspecting node with value ${nodeData}.`, 6, { headIdx, currIdx, lastNon9Idx });
            
            addStep("Check non-9", `if (curr.data != 9) => (${nodeData} != 9)`, 7, { headIdx, currIdx, lastNon9Idx });
            
            if (nodeData !== 9) {
                lastNon9Idx = currIdx;
                addStep("Update Tracker", `Node is not 9! Updating lastNon9 to point here.`, 7, { headIdx, currIdx, lastNon9Idx });
            }
            
            let nextId = list.find(n => n.id === currIdx)?.nextId ?? null;
            currIdx = nextId;
            addStep("Advance Pointer", `curr = curr.next;`, 8, { headIdx, currIdx, lastNon9Idx });
        }

        addStep("Pass 1 Ends", `Found the rightmost non-9 node.`, 6, { headIdx, currIdx, lastNon9Idx });
        
        addStep("Check All-9s Case", `if (lastNon9 == null)`, 12, { headIdx, currIdx, lastNon9Idx });

        if (lastNon9Idx === null) {
            addStep("All 9s Detected", `Every node was a 9! We need a new head.`, 13, { headIdx, currIdx, lastNon9Idx });
            
            let newHeadNode = generateNode(1, nextNodeId, headIdx);
            list.push(newHeadNode);
            headIdx = nextNodeId;
            addStep("Create New Head", `Node newHead = new Node(1); newHead.next = head; Allocated at ${newHeadNode.addr}.`, 13, { headIdx, currIdx, lastNon9Idx, changingId: nextNodeId });
            
            currIdx = newHeadNode.nextId;
            addStep("Reset Curr", `curr = head (the old head)`, 15, { headIdx, currIdx, lastNon9Idx });
            
            while (currIdx !== null) {
                addStep("Zeroing Loop", `curr != null. Set curr.data = 0;`, 17, { headIdx, currIdx, lastNon9Idx, changingId: currIdx });
                
                let targetNode = list.find(n => n.id === currIdx);
                if (targetNode) targetNode.val = 0;
                
                currIdx = targetNode?.nextId ?? null;
                addStep("Advance", `curr = curr.next;`, 18, { headIdx, currIdx, lastNon9Idx });
            }
            addStep("Operation Complete", `Return newHead.`, 20, { headIdx, currIdx, lastNon9Idx, isSuccess: true });
            return steps;
        }

        addStep("Increment Target", `lastNon9.data++`, 24, { headIdx, currIdx, lastNon9Idx });
        let target = list.find(n => n.id === lastNon9Idx);
        if (target) target.val++;
        addStep("Target Incremented", `The rightmost non-9 became ${target?.val}.`, 24, { headIdx, currIdx, lastNon9Idx, changingId: lastNon9Idx });
        
        currIdx = target?.nextId ?? null;
        addStep("Reset Curr", `curr = lastNon9.next;`, 25, { headIdx, currIdx, lastNon9Idx });

        while (currIdx !== null) {
            addStep("Zeroing Loop", `curr != null. Set curr.data = 0;`, 28, { headIdx, currIdx, lastNon9Idx, changingId: currIdx });
            
            let tNode = list.find(n => n.id === currIdx);
            if (tNode) tNode.val = 0;
            
            currIdx = tNode?.nextId ?? null;
            addStep("Advance", `curr = curr.next;`, 29, { headIdx, currIdx, lastNon9Idx });
        }

        addStep("Operation Complete", `Return head.`, 32, { headIdx, currIdx, lastNon9Idx, isSuccess: true });
    } 
    else if (selectedOpId === 'addRecursive') {
        let headIdx = 0;
        let callStack: any[] = [];
        
        addStep("Method Call", `addOne(head) called.`, 9, { headIdx, currIdx: headIdx });
        addStep("Start Recursion", `int carry = addWithCarry(head);`, 10, { headIdx, currIdx: headIdx });

        const recurse = (currIdx: number | null, depth: number): number => {
            callStack.push({ curr: currIdx, depth });
            let addrStr = currIdx !== null ? list.find(n=>n.id===currIdx)?.addr : 'null';
            
            addStep("Recursive Call", `addWithCarry(${addrStr}) pushed (Depth ${depth}).`, 1, { headIdx, currIdx, callStack: [...callStack] });
            
            addStep("Base Case Check", `if (head == null)`, 3, { headIdx, currIdx, callStack: [...callStack] });
            if (currIdx === null) {
                addStep("End of List", `Reached end. Return 1 (this is the +1 we want to add!).`, 3, { headIdx, currIdx, callStack: [...callStack] });
                callStack.pop();
                return 1;
            }

            let node = list.find(n => n.id === currIdx);
            let nextIdx = node?.nextId ?? null;
            
            addStep("Dive Deeper", `Calling addWithCarry(head.next). Pausing Depth ${depth}...`, 5, { headIdx, currIdx, callStack: [...callStack] });
            
            let carry = recurse(nextIdx, depth + 1);
            
            addStep("Resume & Calculate", `Resuming Depth ${depth}. Received carry = ${carry}.`, 5, { headIdx, currIdx, callStack: [...callStack], carryState: carry });
            
            let sum = (node?.val || 0) + carry;
            addStep("Calculate Sum", `int sum = head.data + carry => ${node?.val} + ${carry} = ${sum};`, 5, { headIdx, currIdx, callStack: [...callStack], sumState: sum });
            
            if (node) node.val = sum % 10;
            addStep("Update Node", `head.data = sum % 10 => ${sum} % 10 = ${node?.val}.`, 6, { headIdx, currIdx, callStack: [...callStack], sumState: sum, changingId: currIdx });
            
            let outCarry = Math.floor(sum / 10);
            addStep("Return Carry", `return sum / 10 => ${sum} / 10 = ${outCarry}. Popping Stack.`, 7, { headIdx, currIdx, callStack: [...callStack], carryState: outCarry });
            
            callStack.pop();
            return outCarry;
        };

        let finalCarry = recurse(headIdx, 1);
        
        addStep("Recursion Finished", `Returned to main. carry = ${finalCarry}.`, 10, { headIdx, currIdx: null, finalCarry });
        addStep("Check Final Carry", `if (carry > 0) => (${finalCarry} > 0)`, 13, { headIdx, currIdx: null, finalCarry });

        if (finalCarry > 0) {
            let newHeadNode = generateNode(finalCarry, nextNodeId, headIdx);
            list.push(newHeadNode);
            headIdx = nextNodeId;
            addStep("Create New Head", `Carry overflowed! Prepended new node with value ${finalCarry}.`, 14, { headIdx, currIdx: null, changingId: nextNodeId });
            addStep("Operation Complete", `Return newHead.`, 16, { headIdx, currIdx: null, isSuccess: true });
        } else {
            addStep("Operation Complete", `Return head.`, 19, { headIdx, currIdx: null, isSuccess: true });
        }
    }

    if (steps.length === 0) steps.push({ phase: 'Ready', description: 'Click step to simulate.', line: 1, state: { list: getLogicalList(baseList, 0), headIdx: 0 } });
    return steps;
  }, [baseList, selectedOpId]);

  useEffect(() => { setCurrentStep(0); }, [selectedOpId, inputList]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleReset = () => { 
      setCurrentStep(0); 
      setPan({ x: 0, y: 0 });
      setZoom(1);
  };

  const handleApply = () => {
     const finalState = trace[trace.length - 1].state;
     if (finalState && finalState.list && finalState.isSuccess) {
         setBaseList([...finalState.list]);
     }
     setCurrentStep(0);
  };

  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedOp.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  // Pan & Zoom Handlers
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

  const cur = trace[currentStep] || trace[0] || { state: { list: getLogicalList(baseList, 0), headIdx: 0 } };
  const state = cur.state || { list: getLogicalList(baseList, 0), headIdx: 0 };
  
  const { 
      isSuccess, headIdx, currIdx, lastNon9Idx, changingId, 
      callStack, carryState, sumState, finalCarry
  } = state;

  const getThemeColor = () => selectedOpId === 'addIterative' ? 'sky' : 'fuchsia';
  const activeTheme = getThemeColor();

  // Draw pure SVG lines to connect nodes logically
  const renderSvgArrows = () => {
    return state.list.map((nodeObj: ListNodeData) => {
        if (nodeObj.nextId === null) return null;
        
        const target = state.list.find((n: ListNodeData) => n.id === nodeObj.nextId);
        if (!target) return null;

        // Start from NEXT box (Node width: 112px. Center of rightmost part approx ~92px).
        const startX = nodeObj.x + 92; 
        const startY = nodeObj.y + 28; // height is 56 (h-14)

        // End at left middle of the target Node
        const endX = target.x - 6;
        const endY = target.y + 28;

        const isActive = (currIdx === nodeObj.id) || (changingId === nodeObj.id);
        const strokeColor = isActive ? (activeTheme === 'sky' ? '#0ea5e9' : '#d946ef') : '#94a3b8'; // sky-500, fuchsia-500, or slate-400
        const strokeWidth = isActive ? 4 : 2;
        const marker = `url(#arrowhead-${isActive ? activeTheme : 'default'})`;

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
            if (diffX < 0) {
                 // Backwards 
                 pathD = `M ${startX},${startY} C ${startX + 20},${startY - 60} ${endX - 20},${endY - 60} ${endX},${endY}`;
            } else if (diffX > 200) {
                 // Forward jump over nodes
                 pathD = `M ${startX},${startY} C ${startX + 50},${startY + 80} ${endX - 50},${endY + 80} ${endX},${endY}`;
            } else {
                 // Adjacent Right
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
              <PlusCircle size={100} />
          </div>
          <div className="flex items-center gap-5 z-10">
            <div className={`bg-${activeTheme}-600 p-4 rounded-2xl shadow-lg shadow-${activeTheme}-100 flex items-center justify-center transition-colors duration-500`}>
                <PlusCircle className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Add 1 to Linked List</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className={`font-bold text-${activeTheme}-600 bg-${activeTheme}-50 px-2 py-0.5 rounded tracking-widest uppercase transition-colors duration-500`}>Physical Memory View</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Math & Pointers</span>
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
                        let btnColor = op.id === 'addIterative' ? 'sky' : 'fuchsia';
                        
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
              <div className="lg:col-span-7 space-y-6">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className={`text-[10px] font-black text-${activeTheme}-600 uppercase block pl-1 tracking-widest font-mono`}>Single Digits Input</label>
                        <input type="text" value={inputList} onChange={(e) => { setInputList(e.target.value); setCurrentStep(0); }} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${activeTheme}-500 outline-none transition-all shadow-inner`} placeholder="1, 9, 9" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group ${isSuccess ? `bg-emerald-900 border-emerald-800` : 'bg-slate-900 border-slate-800'}`}>
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
                  
                   <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 z-30">
                      <div className="flex items-center gap-4 bg-white/90 px-4 py-2 rounded-xl backdrop-blur shadow-sm">
                          <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest font-mono flex items-center gap-2">
                              <Network size={16} className="text-sky-500"/> Memory Canvas
                          </span>
                      </div>
                      
                      <div className="flex gap-2">
                          {isSuccess && state.list.length > 0 && (
                              <button onClick={handleApply} className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl hover:bg-emerald-200 uppercase tracking-widest flex items-center gap-1 transition-colors shadow-lg z-30 pointer-events-auto">
                                  <Check size={14}/> Confirm Structure
                              </button>
                          )}
                      </div>
                   </div>

                   {/* Variable Trackers */}
                   <div className="absolute top-24 right-8 flex flex-col gap-2 z-20 items-end pointer-events-none">
                       {sumState !== undefined && (
                            <div className="bg-sky-100 text-sky-700 font-mono text-xs px-3 py-1.5 rounded-xl font-black border border-sky-300 shadow-sm animate-in fade-in slide-in-from-right-4">
                                sum: {sumState}
                            </div>
                       )}
                       {carryState !== undefined && (
                            <div className="bg-amber-100 text-amber-700 font-mono text-xs px-3 py-1.5 rounded-xl font-black border border-amber-300 shadow-sm animate-in fade-in slide-in-from-right-4 delay-100">
                                carry: {carryState}
                            </div>
                       )}
                       {finalCarry !== undefined && (
                            <div className="bg-rose-100 text-rose-700 font-mono text-xs px-3 py-1.5 rounded-xl font-black border border-rose-300 shadow-sm animate-in fade-in slide-in-from-right-4">
                                final carry: {finalCarry}
                            </div>
                       )}
                   </div>

                   {/* Recursive Call Stack */}
                   <div className="absolute bottom-6 left-6 flex gap-4 z-40 pointer-events-none">
                       {callStack && callStack.length > 0 && (
                            <div className="bg-slate-900 text-fuchsia-400 font-mono text-[10px] p-4 rounded-2xl border border-slate-700 w-64 shadow-2xl animate-in slide-in-from-bottom-4 pointer-events-auto">
                                <div className="text-slate-500 mb-3 border-b border-slate-700 pb-2 flex items-center justify-between">
                                   <span className="uppercase tracking-widest text-[9px] font-black">JVM Call Stack</span>
                                   <RefreshCw size={14}/>
                                </div>
                                <div className="flex flex-col-reverse gap-1.5 mt-2 max-h-[140px] overflow-y-auto scrollbar-thin">
                                    {callStack.map((frame: any, i: number) => (
                                        <div key={i} className={`p-2 rounded-lg flex justify-between items-center transition-all ${i === callStack.length - 1 ? 'bg-fuchsia-900/50 border border-fuchsia-500/30 text-fuchsia-300 shadow-md transform scale-[1.02]' : 'bg-slate-800/50 text-slate-500'}`}>
                                            <span>addWithCarry({state.list.find((n:any) => n.id === frame.curr)?.addr ?? 'null'})</span>
                                            <span className="opacity-50 text-[8px] ml-2">D:{frame.depth}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                       )}
                   </div>

                   {/* Fixed Zoom Controls */}
                   <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-40 pointer-events-auto bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur">
                      <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                      <button onClick={resetZoom} className="p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"><Maximize size={18}/></button>
                      <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"><ZoomOut size={18}/></button>
                   </div>

                   {/* Interactive Canvas - No Scrollbars! */}
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
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                                   </marker>
                                   <marker id="arrowhead-sky" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#0ea5e9" />
                                   </marker>
                                   <marker id="arrowhead-fuchsia" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#d946ef" />
                                   </marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>

                           {/* HTML Layer for Node Blocks & Labels */}
                           {state.list && state.list.map((nodeObj: ListNodeData, idx: number) => {
                              
                              const isCurr = currIdx === nodeObj.id;
                              const isLastNon9 = lastNon9Idx === nodeObj.id;
                              const isHead = headIdx === nodeObj.id;
                              
                              const isChanging = changingId === nodeObj.id;
                              const isTarget = isCurr || isLastNon9 || isChanging || isHead;
                              
                              let theme: any = 'slate';
                              if (isChanging) theme = 'amber';
                              else if (isCurr) theme = activeTheme;
                              else if (isLastNon9) theme = 'emerald';
                              else if (isHead) theme = 'rose';

                              const labels = [];
                              if (isHead) labels.push({ text: "head", color: "rose", position: "top" });
                              if (isLastNon9) labels.push({ text: "lastNon9", color: "emerald", position: "top" });
                              
                              if (isCurr) labels.push({ text: selectedOpId === 'addIterative' ? "curr" : "head (local)", color: activeTheme, position: selectedOpId === 'addIterative' ? "bottom" : "top" });

                              return (
                                <React.Fragment key={`node-${nodeObj.id}`}>
                                  <div className={`absolute flex flex-col items-center group transition-all duration-500 z-10 ${isChanging ? 'scale-105' : ''}`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      
                                      {/* Top Labels */}
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center z-20">
                                          {labels.filter(l => l.position === 'top').map((l, i) => (
                                              <PointerLabel key={i} label={l.text} color={l.color} position="top" active={true} />
                                          ))}
                                      </div>

                                      {/* Bottom Labels */}
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center z-20">
                                          {labels.filter(l => l.position === 'bottom').map((l, i) => (
                                              <PointerLabel key={i} label={l.text} color={l.color} position="bottom" active={true} />
                                          ))}
                                      </div>

                                      <ListNodeBlock 
                                          val={nodeObj.val} 
                                          address={nodeObj.addr} 
                                          nextAddr={nodeObj.nextId !== null ? (state.list.find((n:any)=>n.id===nodeObj.nextId)?.addr ?? 'null') : 'null'} 
                                          isTarget={isTarget} 
                                          themeColor={theme}
                                          isChanging={isChanging}
                                      />

                                      {/* Null indicator embedded below if pointer is null */}
                                      {nodeObj.nextId === null && (
                                          <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-xs font-black font-mono text-slate-400">null</div>
                                      )}
                                  </div>
                                </React.Fragment>
                              )
                          })}

                          {/* Trailing Null Line tracking */}
                          {currIdx === null && state.list.length > 0 && selectedOpId === 'addIterative' && (
                              <div className="absolute transition-all duration-300 z-10" style={{ left: state.list[state.list.length-1].x + 220, top: state.list[state.list.length-1].y }}>
                                  <div className="relative flex flex-col items-center animate-in zoom-in">
                                      <span className="text-[12px] font-mono text-slate-400 font-bold mb-4 mt-2">null</span>
                                      <PointerLabel label="curr" color={activeTheme} position="bottom" active={true} offset={0} />
                                  </div>
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
            <span className={`text-[9px] font-black font-mono tracking-widest px-2 py-1 rounded-lg border shadow-sm ${activeColorClass} ${strikethrough ? 'line-through opacity-50' : ''}`}>
                {label}
            </span>
            {position === 'top' ? 
                <ArrowDown size={14} className={`text-${color}-500`} strokeWidth={3}/> : 
                <ArrowUp size={14} className={`text-${color}-500`} strokeWidth={3}/>
            }
        </div>
    );
};

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, nextAddr, themeColor = 'slate', isTarget, isChanging }) => {
    const themes: Record<string, { bg: string, border: string, text: string, next: string }> = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', next: 'text-emerald-600 bg-emerald-100/50' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', next: 'text-amber-600 bg-amber-100/50' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', next: 'text-fuchsia-600 bg-fuchsia-100/50' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', next: 'text-rose-600 bg-rose-100/50' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', next: 'text-sky-600 bg-sky-100/50' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800', next: 'text-indigo-600 bg-indigo-100/50' },
        violet: { bg: 'bg-violet-50', border: 'border-violet-400', text: 'text-violet-800', next: 'text-violet-600 bg-violet-100/50' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', next: 'text-slate-500 bg-slate-50' }
    };
    const activeTheme = themes[themeColor] || themes['slate'];

    const targetClasses = isTarget ? `ring-4 ring-${themeColor}-300 shadow-xl z-20` : 'shadow-sm hover:shadow-md z-10';

    return (
        <div className="relative flex flex-col items-center group">
            <span className="text-[10px] text-slate-400 font-mono font-bold mb-1 opacity-80">{address}</span>
            <div className={`flex items-center w-28 h-14 border-2 rounded-2xl transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative`}>
                <div className={`flex-1 flex justify-center font-mono font-black text-2xl ${activeTheme.text} ${isChanging ? 'animate-pulse text-amber-600' : ''}`}>
                    {val}
                </div>
                <div className={`w-10 h-full border-l-2 flex flex-col items-center justify-center rounded-r-xl ${activeTheme.border} ${activeTheme.next}`}>
                    <span className="text-[7px] font-black uppercase tracking-widest opacity-60 transform -rotate-90">NEXT</span>
                </div>
            </div>
        </div>
    );
};

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'sky' }) => {
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|Node|true|false|System|out|print|println|static|addOne|addWithCarry)\b|\b\d+\b)/g).filter(Boolean);
  
  const activeStyles = { bg: `bg-${theme}-500/10`, border: `border-${theme}-500`, text: `text-${theme}-400` };

  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `${activeStyles.text} font-bold` : 'text-slate-700'}`}>{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//') || part.startsWith('#')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"') || part.startsWith("'")) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for', 'break', 'static'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'long', 'boolean', 'String', 'Node', 'System', 'out', 'print', 'println', 'void'].includes(part)) return <span key={i} className="text-indigo-400 font-bold">{part}</span>;
          if (['addOne', 'addWithCarry'].includes(part)) return <span key={i} className={`text-${theme}-400 font-bold`}>{part}</span>;
          if (['true', 'false', 'null', 'None'].includes(part)) return <span key={i} className="text-orange-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-emerald-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};