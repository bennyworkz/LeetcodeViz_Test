import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp, ArrowLeft,
  GitCommit, MonitorPlay, ChevronLeft, ChevronRight, 
  Network, Database, RotateCcw, ListOrdered, RefreshCw,
  MinusSquare, Zap, AlertCircle, Goal, Info, Layers,
  ZoomIn, ZoomOut, Maximize
} from 'lucide-react';

const OPERATIONS = {
  subStack: {
    id: 'subStack',
    title: 'Using Stacks (LIFO)',
    icon: <Layers size={16} />,
    complexity: 'Time: O(N+M) | Space: O(N+M)',
    code: `public Node subtractLinkedLists(Node head1, Node head2) {
    // 1. Identify which list represents the larger number
    Node large = getLargerList(head1, head2);
    Node small = (large == head1) ? head2 : head1;
    
    Stack<Integer> s1 = new Stack<>();
    Stack<Integer> s2 = new Stack<>();
    
    while (large != null) { s1.push(large.data); large = large.next; }
    while (small != null) { s2.push(small.data); small = small.next; }
    
    Node resHead = null;
    int borrow = 0;
    
    // 2. Pop and subtract from right to left
    while (!s1.isEmpty()) {
        int v1 = s1.pop();
        int v2 = s2.isEmpty() ? 0 : s2.pop();
        
        int diff = v1 - v2 - borrow;
        if (diff < 0) {
            diff += 10;
            borrow = 1;
        } else {
            borrow = 0;
        }
        
        Node newNode = new Node(diff);
        newNode.next = resHead;
        resHead = newNode;
    }
    
    // 3. Trim leading zeros from the result
    return trimLeadingZeros(resHead);
}`,
    desc: "First, we determine the larger number. We then push both lists into Stacks so we can process the least significant digits first. As we pop, we subtract, manage the borrow, and prepend the results. Finally, we trim any leading zeros (e.g., 100 - 99 = 001 -> 1)."
  },
  subReverse: {
    id: 'subReverse',
    title: 'Reverse & Subtract',
    icon: <RefreshCw size={16} />,
    complexity: 'Time: O(N+M) | Space: O(1)',
    code: `public Node subtractLinkedLists(Node head1, Node head2) {
    Node large = getLargerList(head1, head2);
    Node small = (large == head1) ? head2 : head1;
    
    // 1. Reverse both lists to align ones digits
    large = reverseList(large);
    small = reverseList(small);
    
    Node dummy = new Node(0);
    Node curr = dummy;
    int borrow = 0;
    
    // 2. Subtract digit by digit
    while (large != null) {
        int v1 = large.data;
        int v2 = (small != null) ? small.data : 0;
        
        int diff = v1 - v2 - borrow;
        if (diff < 0) {
            diff += 10;
            borrow = 1;
        } else {
            borrow = 0;
        }
        
        curr.next = new Node(diff);
        curr = curr.next;
        
        large = large.next;
        if (small != null) small = small.next;
    }
    
    // 3. Reverse the result and remove leading zeros
    return trimLeadingZeros(reverseList(dummy.next));
}`,
    desc: "The O(1) space approach. We find the larger list, explicitly reverse both lists, and perform standard subtraction left-to-right on the reversed lists. Finally, we reverse the result to restore the correct order."
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
  isFaded?: boolean;
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
      <div className="flex items-center gap-3 mb-6 text-rose-600">
          <MinusSquare size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Subtract Two Numbers</h2>
      </div>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given two non-negative integers represented as linked lists (where the head is the most significant digit), subtract the smaller number from the larger one.
        </p>

        <ul className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3 font-medium text-slate-700 list-none">
            <li className="flex items-center gap-3"><Info className="text-rose-500" size={18}/> <strong>Order Independence:</strong> The lists can be given in any order. You must dynamically determine which is larger (<code>L1 - L2</code> or <code>L2 - L1</code>).</li>
            <li className="flex items-center gap-3"><Info className="text-rose-500" size={18}/> <strong>Leading Zeros:</strong> Inputs do not have leading zeros. However, subtraction often creates them (e.g., 1000 - 999 = 0001). The final result <strong>must</strong> have these trimmed off to return <code>1</code>.</li>
        </ul>

        <div className="space-y-6 pt-4">
           <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs border-b pb-2">Examples</h4>
           
           <div className="grid md:grid-cols-2 gap-6">
               <div className="bg-sky-50/50 border border-sky-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-sky-800 uppercase tracking-widest text-[10px] items-center gap-2"><Goal size={14}/> Example 1: Basic Borrow</div>
                   <div className="space-y-3">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-8 text-xs font-bold">L1:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">5 <ArrowRight size={12} className="mx-1"/> 4</div>
                           <span className="text-slate-400 text-[10px] italic">(54)</span>
                       </div>
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-8 text-xs font-bold">L2:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">2 <ArrowRight size={12} className="mx-1"/> 6</div>
                           <span className="text-slate-400 text-[10px] italic">(26)</span>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-sky-200/50 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold w-8">Out:</span> 
                          <div className="flex items-center text-rose-700 font-bold bg-rose-100 px-2 py-1 rounded border border-rose-200 text-xs">2 <ArrowRight size={12} className="mx-1 text-rose-400"/> 8</div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1">L1 is larger. 54 - 26 = 28.</p>
                   </div>
               </div>

               <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-amber-800 uppercase tracking-widest text-[10px] items-center gap-2"><AlertCircle size={14}/> Example 2: Reordered & Zeros</div>
                   <div className="space-y-3">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-8 text-xs font-bold">L1:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">1</div>
                       </div>
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-8 text-xs font-bold">L2:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">1 <ArrowRight size={12} className="mx-1"/> 0 <ArrowRight size={12} className="mx-1"/> 0</div>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-amber-200/50 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold w-8">Out:</span> 
                          <div className="flex items-center text-rose-700 font-bold bg-rose-100 px-2 py-1 rounded border border-rose-200 text-xs">9 <ArrowRight size={12} className="mx-1 text-rose-400"/> 9</div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1">L2 is larger. 100 - 1 = 099, trailing zeros stripped to 99.</p>
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
          <Database size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Theory: The Mechanics of Subtraction</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8 pt-4">
          <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl border border-slate-800">
              <div className="absolute -right-4 -top-4 opacity-10"><Activity size={120}/></div>
              <h3 className="font-black text-sky-400 uppercase tracking-widest text-sm mb-4 flex items-center gap-2">1. Finding the Larger</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  We cannot simply subtract <code>L1 - L2</code> blindly. Since inputs have no leading zeros, length comparison is highly effective:
              </p>
              <ul className="text-[11px] text-slate-300 list-disc pl-4 space-y-2 mb-4">
                  <li>If <code>Len(L1) {'>'} Len(L2)</code>, L1 is bigger.</li>
                  <li>If <code>Len(L2) {'>'} Len(L1)</code>, L2 is bigger.</li>
                  <li>If equal, traverse both until the first differing digit. The larger digit dictates the larger list!</li>
              </ul>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl relative overflow-hidden shadow-sm border border-slate-200">
              <div className="absolute -right-4 -bottom-4 opacity-5"><Layers size={120}/></div>
              <h3 className="font-black text-rose-600 uppercase tracking-widest text-sm mb-4 flex items-center gap-2">2. Processing the Borrow</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Just like addition, subtraction moves from right-to-left. Using Stacks or List Reversals allows us to align the ones digits.
              </p>
              <div className="bg-white p-4 rounded-xl border shadow-sm font-mono text-xs text-rose-700">
                  int diff = v1 - v2 - borrow;<br/>
                  if (diff {'<'} 0) &#123;<br/>
                  &nbsp;&nbsp;diff += 10;<br/>
                  &nbsp;&nbsp;borrow = 1;<br/>
                  &#125;
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
               "Subtraction adds a massive layer of complexity over Addition because commutativity is lost (L1 + L2 is the same as L2 + L1, but L1 - L2 != L2 - L1). Identifying the larger list is the crucial first step an interviewer expects to see."
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
               <div className="p-5 rounded-2xl border bg-amber-900/40 border-amber-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-amber-400 mb-1">Stack (Non-Mutating)</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(N+M) <br/><strong>Space:</strong> O(N+M)</div>
                    <p className="text-[10px] text-amber-200/70 leading-relaxed mt-2">Requires one pass to count lengths, one pass to push to stacks, and one pass to pop/subtract. Safest if inputs are read-only.</p>
               </div>
               <div className="p-5 rounded-2xl border bg-fuchsia-900/40 border-fuchsia-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-fuchsia-400 mb-1">Reverse (Mutating)</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(N+M) <br/><strong>Space:</strong> O(1)</div>
                    <p className="text-[10px] text-fuchsia-200/70 leading-relaxed mt-2">Optimal space complexity. Finding the larger list, reversing, subtracting, and re-reversing takes careful pointer tracking.</p>
               </div>
           </div>
       </div>
    </div>
);

// Helpers
const generateNode = (val: number, id: number, nextId: number | null, x: number, y: number): ListNodeData => ({
    id: id,
    val: val,
    addr: '0x' + (100 + (id * 32)).toString(16).toUpperCase().padStart(3, '0'),
    nextId: nextId,
    x: x,
    y: y
});

const getLogicalList = (list: ListNodeData[], headIdx: number | null) => {
    let res: ListNodeData[] = [];
    let curr = headIdx;
    while(curr !== null) {
        let node = list.find(n => n.id === curr);
        if(node) {
           res.push({...node});
           curr = node.nextId;
        } else break;
    }
    return res;
};

const reverseListState = (listState: ListNodeData[], headIdx: number | null) => {
    let prev: number | null = null;
    let curr = headIdx;
    let mutatedList = listState.map(n => ({...n}));
    
    while(curr !== null) {
        let node = mutatedList.find(n => n.id === curr);
        if(!node) break;
        let next = node.nextId;
        node.nextId = prev;
        prev = curr;
        curr = next;
    }
    return { newList: mutatedList, newHead: prev };
};

const getLargerListInfo = (l1: ListNodeData[], l2: ListNodeData[]) => {
    if (l1.length > l2.length) return { isL1Larger: true, isEq: false };
    if (l2.length > l1.length) return { isL1Larger: false, isEq: false };
    
    for (let i = 0; i < l1.length; i++) {
        if (l1[i].val > l2[i].val) return { isL1Larger: true, isEq: false };
        if (l2[i].val > l1[i].val) return { isL1Larger: false, isEq: false };
    }
    return { isL1Larger: true, isEq: true };
};

const SubtractTwoNumbersViz = () => {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'overview' | 'theory' | 'interview'>('visualizer');
  const [selectedOpId, setSelectedOpId] = useState<keyof typeof OPERATIONS>('subStack');
  
  const [inputL1, setInputL1] = useState('1, 0, 0');
  const [inputL2, setInputL2] = useState('5');
  
  const [baseL1, setBaseL1] = useState<ListNodeData[]>([]);
  const [baseL2, setBaseL2] = useState<ListNodeData[]>([]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  // Pan and Zoom State for Infinite Canvas
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.85);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const selectedOp = OPERATIONS[selectedOpId];

  // Parse inputs to Base States
  useEffect(() => {
      const v1 = inputL1.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 0 && n <= 9);
      const v2 = inputL2.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 0 && n <= 9);
      
      const n1 = v1.length ? v1.map((v, i) => generateNode(v, i, i < v1.length - 1 ? i + 1 : null, 100 + i * 200, 80)) : [generateNode(0, 0, null, 100, 80)];
      const n2 = v2.length ? v2.map((v, i) => generateNode(v, i + 100, i < v2.length - 1 ? i + 101 : null, 100 + i * 200, 240)) : [generateNode(0, 100, null, 100, 240)];

      setBaseL1(n1);
      setBaseL2(n2);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
  }, [inputL1, inputL2, selectedOpId]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    if (baseL1.length === 0 || baseL2.length === 0) return steps;

    let l1 = baseL1.map(n => ({...n}));
    let l2 = baseL2.map(n => ({...n}));
    let res: ListNodeData[] = [];
    
    let h1: number | null = l1[0].id;
    let h2: number | null = l2[0].id;
    let resHead: number | null = null;
    let nextResId = 200;

    const addStep = (phase: string, desc: string, line: number, stateProps: any) => {
      steps.push({
        phase, description: desc, line, 
        state: { 
            l1: getLogicalList(l1.map(n=>({...n})), h1), 
            l2: getLogicalList(l2.map(n=>({...n})), h2), 
            res: getLogicalList(res.map(n=>({...n})), resHead),
            ...stateProps 
        }
      });
    };

    // --- DETERMINE LARGER LOGIC ---
    let logicalL1 = getLogicalList(l1, h1);
    let logicalL2 = getLogicalList(l2, h2);
    let { isL1Larger, isEq } = getLargerListInfo(logicalL1, logicalL2);
    
    addStep("Determine Larger Number", `Comparing lists to find the minuend (large) and subtrahend (small).`, 2, { isL1Larger, isEq });
    
    if (isEq) {
        addStep("Identical Lists", `Both lists are identical! Returning early.`, 3, { isL1Larger, isEq, isSuccess: true, resVal: 0 });
        return steps;
    }
    
    let largeH = isL1Larger ? h1 : h2;
    let smallH = isL1Larger ? h2 : h1;
    let largeListObj = isL1Larger ? l1 : l2;
    let smallListObj = isL1Larger ? l2 : l1;
    
    addStep("Assigned Roles", `L${isL1Larger ? '1' : '2'} is Large. L${isL1Larger ? '2' : '1'} is Small.`, 4, { isL1Larger, isEq });

    if (selectedOpId === 'subStack') {
        let s1: number[] = [];
        let s2: number[] = [];
        
        addStep("Initialize Stacks", `Stack<Integer> s1 (Large) = new Stack<>(); Stack s2 (Small) = new Stack<>();`, 6, { isL1Larger, s1: [...s1], s2: [...s2] });

        let c1 = largeH;
        while (c1 !== null) {
            let val = largeListObj.find(n=>n.id===c1)?.val as number;
            s1.push(val);
            c1 = largeListObj.find(n=>n.id===c1)?.nextId ?? null;
            addStep("Push Large", `s1.push(${val});`, 9, { isL1Larger, s1: [...s1], s2: [...s2] });
        }

        let c2 = smallH;
        while (c2 !== null) {
            let val = smallListObj.find(n=>n.id===c2)?.val as number;
            s2.push(val);
            c2 = smallListObj.find(n=>n.id===c2)?.nextId ?? null;
            addStep("Push Small", `s2.push(${val});`, 10, { isL1Larger, s1: [...s1], s2: [...s2] });
        }

        let borrow = 0;
        addStep("Begin Subtraction", `Node resHead = null; int borrow = 0;`, 13, { isL1Larger, s1: [...s1], s2: [...s2], borrow, diff: 0 });

        let resX = Math.max(l1.length, l2.length) * 200 + 100;

        while (s1.length > 0) {
            addStep("Loop Condition", `while (!s1.isEmpty())`, 15, { isL1Larger, s1: [...s1], s2: [...s2], borrow });
            
            let v1 = s1.pop() as number;
            let v2 = s2.length > 0 ? s2.pop() as number : 0;
            
            let diff = v1 - v2 - borrow;
            addStep("Pop & Subtract", `diff = ${v1} (L) - ${v2} (S) - ${borrow} (Borrow) = ${diff}.`, 19, { isL1Larger, s1: [...s1], s2: [...s2], borrow, diff });
            
            if (diff < 0) {
                diff += 10;
                borrow = 1;
                addStep("Borrow Handled", `diff < 0. Adding 10 => ${diff}. Setting borrow to 1.`, 22, { isL1Larger, s1: [...s1], s2: [...s2], borrow, diff });
            } else {
                borrow = 0;
                addStep("No Borrow Needed", `diff >= 0. Setting borrow to 0.`, 24, { isL1Larger, s1: [...s1], s2: [...s2], borrow, diff });
            }
            
            let newNode = generateNode(diff, nextResId++, resHead, resX, 400);
            resX -= 200; // Move next physically leftwards
            res.push(newNode);
            resHead = newNode.id; // PREPEND
            
            addStep("Build Result List", `Prepended Node(${diff}).`, 28, { isL1Larger, s1: [...s1], s2: [...s2], borrow, diff, activeResNode: resHead });
        }

        // Trim zeros logic
        addStep("Trim Leading Zeros", `return trimLeadingZeros(resHead);`, 31, { isL1Larger, s1: [], s2: [], borrow: 0 });
        while (resHead !== null) {
            let resHeadNode = res.find(n=>n.id===resHead);
            if (resHeadNode && resHeadNode.val === 0 && resHeadNode.nextId !== null) {
                resHead = resHeadNode.nextId;
                addStep("Trim Zero", `Removing a leading zero.`, 31, { isL1Larger, s1: [], s2: [], borrow: 0, activeResNode: resHead });
            } else {
                break;
            }
        }

        addStep("Operation Complete", `Final result generated.`, 32, { isL1Larger, s1: [], s2: [], borrow: 0, isSuccess: true });
    } 
    else if (selectedOpId === 'subReverse') {
        
        addStep("Reverse Large", `large = reverseList(large);`, 6, { isL1Larger });
        let rev1 = reverseListState(largeListObj, largeH);
        largeListObj = rev1.newList;
        largeH = rev1.newHead;
        
        // Sync back to main state references for UI
        if(isL1Larger) { l1 = largeListObj; h1 = largeH; } else { l2 = largeListObj; h2 = largeH; }
        addStep("Large Reversed", `Least significant digit is now at the head.`, 6, { isL1Larger, macroReverseL: true });

        addStep("Reverse Small", `small = reverseList(small);`, 7, { isL1Larger, macroReverseL: true });
        let rev2 = reverseListState(smallListObj, smallH);
        smallListObj = rev2.newList;
        smallH = rev2.newHead;
        
        if(isL1Larger) { l2 = smallListObj; h2 = smallH; } else { l1 = smallListObj; h1 = smallH; }
        addStep("Small Reversed", `Least significant digit is now at the head.`, 7, { isL1Larger, macroReverseL: true, macroReverseS: true });

        let borrow = 0;
        let c1 = largeH;
        let c2 = smallH;
        let dummyId = 999;
        
        let resX = 100;
        let dummyNode = generateNode(0, dummyId, null, resX - 200, 400); // dummy physically off-screen left
        res.push(dummyNode);
        resHead = dummyId;
        let resCurr = dummyId;

        addStep("Begin Subtraction", `Node curr = dummy; int borrow = 0;`, 11, { isL1Larger, c1, c2, borrow, diff: 0, macroReverseL: true, macroReverseS: true });

        while (c1 !== null) {
            addStep("Loop Condition", `while (large != null)`, 14, { isL1Larger, c1, c2, borrow, macroReverseL: true, macroReverseS: true });
            
            let v1 = largeListObj.find(n=>n.id===c1)?.val as number;
            let v2 = c2 !== null ? smallListObj.find(n=>n.id===c2)?.val as number : 0;
            
            let diff = v1 - v2 - borrow;
            addStep("Compute Diff", `diff = ${v1} (L) - ${v2} (S) - ${borrow} (Borrow) = ${diff}.`, 18, { isL1Larger, c1, c2, borrow, diff, macroReverseL: true, macroReverseS: true });
            
            if (diff < 0) {
                diff += 10;
                borrow = 1;
                addStep("Borrow Handled", `diff < 0. Adding 10 => ${diff}. Setting borrow to 1.`, 21, { isL1Larger, c1, c2, borrow, diff, macroReverseL: true, macroReverseS: true });
            } else {
                borrow = 0;
                addStep("No Borrow Needed", `diff >= 0. Setting borrow to 0.`, 23, { isL1Larger, c1, c2, borrow, diff, macroReverseL: true, macroReverseS: true });
            }
            
            let newNode = generateNode(diff, nextResId++, null, resX, 400);
            resX += 200; // Append moves rightwards
            res.push(newNode);
            
            let currNode = res.find(n=>n.id === resCurr);
            if (currNode) currNode.nextId = newNode.id;
            resCurr = newNode.id; // APPEND
            
            addStep("Append to Result", `Appended Node(${diff}).`, 26, { isL1Larger, c1, c2, borrow, diff, activeResNode: resCurr, macroReverseL: true, macroReverseS: true });
            
            c1 = largeListObj.find(n=>n.id===c1)?.nextId ?? null;
            if (c2 !== null) c2 = smallListObj.find(n=>n.id===c2)?.nextId ?? null;
        }

        // Drop dummy
        let actualResHead = res.find(n=>n.id === dummyId)?.nextId ?? null;
        resHead = actualResHead;
        res = res.filter(n => n.id !== dummyId);

        addStep("Subtraction Complete", `Finished subtracting nodes. Now we must reverse the result list.`, 33, { isL1Larger, borrow: 0, macroReverseL: true, macroReverseS: true });

        // Macro Reverse Res
        addStep("Reverse Result", `return reverseList(dummy.next);`, 34, { isL1Larger, macroReverseL: true, macroReverseS: true });
        let revRes = reverseListState(res, resHead);
        res = revRes.newList;
        resHead = revRes.newHead;
        addStep("Result Reversed", `List is back in standard left-to-right order.`, 34, { isL1Larger, isSuccess: false, macroReverseL: true, macroReverseS: true, resReversed: true });
        
        // Trim zeros logic
        addStep("Trim Leading Zeros", `trimLeadingZeros(resHead);`, 34, { isL1Larger, borrow: 0, macroReverseL: true, macroReverseS: true, resReversed: true });
        while (resHead !== null) {
            let resHeadNode = res.find(n=>n.id===resHead);
            if (resHeadNode && resHeadNode.val === 0 && resHeadNode.nextId !== null) {
                resHead = resHeadNode.nextId;
                addStep("Trim Zero", `Removing a leading zero.`, 34, { isL1Larger, borrow: 0, activeResNode: resHead, macroReverseL: true, macroReverseS: true, resReversed: true });
            } else {
                break;
            }
        }
        
        addStep("Operation Complete", `Final answer ready!`, 34, { isL1Larger, isSuccess: true, macroReverseL: true, macroReverseS: true, resReversed: true });
    }

    if (steps.length === 0) steps.push({ phase: 'Ready', description: 'Click step to simulate.', line: 1, state: { l1: baseL1, l2: baseL2, res: [] } });
    return steps;
  }, [baseL1, baseL2, selectedOpId]);

  useEffect(() => { setCurrentStep(0); }, [selectedOpId, inputL1, inputL2]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleReset = () => { setCurrentStep(0); setPan({x:0, y:0}); setZoom(0.85); };

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
  const resetZoom = () => { setZoom(0.85); setPan({ x: 0, y: 0 }); };

  const cur = trace[currentStep] || trace[0] || { state: { l1: [], l2: [], res: [] } };
  const state = cur.state || { l1: [], l2: [], res: [] };
  
  const { 
      isSuccess, s1, s2, borrow, diff, c1, c2, activeResNode, isL1Larger, isEq, macroReverseL, macroReverseS, resVal, resReversed
  } = state;

  const getThemeColor = () => selectedOpId === 'subStack' ? 'amber' : 'rose';
  const activeTheme = getThemeColor();

  const renderSvgArrows = () => {
    const allNodes = [...(state.l1 || []), ...(state.l2 || []), ...(state.res || [])];
    
    return allNodes.map((node) => {
        if (node.nextId === null) return null;
        
        const target = allNodes.find(n => n.id === node.nextId);
        if (!target) return null;

        // Origin point: center of the "NEXT" box
        const startX = node.x + 92; 
        const startY = node.y + 28; 

        // Destination point: left middle of the target Node
        const endX = target.x - 6;
        const endY = target.y + 28;

        const isProcessingL1 = c1 === node.id || c1 === target.id;
        const isProcessingL2 = c2 === node.id || c2 === target.id;
        const isProcessingRes = activeResNode === node.id || activeResNode === target.id;

        let strokeColor = '#94a3b8'; // default slate-400
        if (isProcessingL1) strokeColor = isL1Larger ? '#d946ef' : '#0ea5e9'; // fuchsia or sky depending on size
        else if (isProcessingL2) strokeColor = !isL1Larger ? '#d946ef' : '#0ea5e9'; 
        else if (isProcessingRes) strokeColor = '#10b981'; // emerald-500

        const strokeWidth = (isProcessingL1 || isProcessingL2 || isProcessingRes) ? 4 : 2;
        const strokeOpacity = (isProcessingL1 || isProcessingL2 || isProcessingRes) ? 1 : 0.5;
        
        let pathD = '';
        const diffX = endX - startX;
        
        if (diffX < -10) {
             // Pointing backwards (e.g. after list is reversed)
             pathD = `M ${startX},${startY} C ${startX + 40},${startY - 60} ${endX - 40},${endY - 60} ${endX},${endY}`;
        } else if (diffX > 200) {
             // Jumping forward over a node
             pathD = `M ${startX},${startY} C ${startX + 50},${startY + 60} ${endX - 50},${endY + 60} ${endX},${endY}`;
        } else {
             // Normal adjacent forward link
             pathD = `M ${startX},${startY} C ${startX + 40},${startY} ${endX - 40},${endY} ${endX},${endY}`;
        }

        return (
            <path 
                key={`link-${node.id}-${target.id}`}
                d={pathD} 
                fill="none" 
                stroke={strokeColor} 
                strokeWidth={strokeWidth} 
                strokeOpacity={strokeOpacity}
                markerEnd="url(#arrowhead-default)" 
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
              <MinusSquare size={100} />
          </div>
          <div className="flex items-center gap-5 z-10">
            <div className={`bg-${activeTheme}-600 p-4 rounded-2xl shadow-lg shadow-${activeTheme}-100 flex items-center justify-center transition-colors duration-500`}>
                <MinusSquare className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Subtract Linked Lists</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className={`font-bold text-${activeTheme}-600 bg-${activeTheme}-50 px-2 py-0.5 rounded tracking-widest uppercase transition-colors duration-500`}>Math & Lists</span>
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
                        let btnColor = op.id === 'subStack' ? 'amber' : 'rose';
                        
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
              <div className="lg:col-span-7 space-y-6">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className={`text-[10px] font-black text-sky-600 uppercase block pl-1 tracking-widest font-mono`}>L1 Digits</label>
                        <input type="text" value={inputL1} onChange={(e) => { setInputL1(e.target.value); setCurrentStep(0); }} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-inner`} placeholder="1, 0, 0" />
                    </div>
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className={`text-[10px] font-black text-fuchsia-600 uppercase block pl-1 tracking-widest font-mono`}>L2 Digits</label>
                        <input type="text" value={inputL2} onChange={(e) => { setInputL2(e.target.value); setCurrentStep(0); }} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all shadow-inner`} placeholder="5" />
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
                <div className="bg-slate-50 bg-[linear-gradient(to_right,#cbd5e130_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e130_1px,transparent_1px)] bg-[size:20px_20px] rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col shadow-inner overflow-hidden min-h-[500px]">
                  
                   <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 z-30 pointer-events-none">
                      <div className="flex items-center gap-4 pointer-events-auto">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/80 px-3 py-1 rounded shadow-sm backdrop-blur">
                              <Network size={14}/> Subtraction Heap
                          </span>
                      </div>
                      
                      {/* Math Trackers */}
                      <div className="flex gap-2 pointer-events-auto">
                          {diff !== undefined && (
                              <div className="bg-white/90 text-slate-700 font-mono text-xs px-3 py-1 rounded-lg font-black border border-slate-200 shadow-sm animate-in zoom-in backdrop-blur">
                                  diff: {diff}
                              </div>
                          )}
                          {borrow !== undefined && (
                              <div className={`font-mono text-xs px-3 py-1 rounded-lg font-black border shadow-sm animate-in zoom-in backdrop-blur ${borrow > 0 ? 'bg-rose-100 text-rose-700 border-rose-300' : 'bg-white/90 text-slate-700 border-slate-200'}`}>
                                  borrow: {borrow}
                              </div>
                          )}
                          {resVal !== undefined && (
                              <div className="font-mono text-xs px-3 py-1 rounded-lg font-black border bg-emerald-100 text-emerald-700 border-emerald-300 shadow-sm animate-in zoom-in">
                                  Result: Node(0)
                              </div>
                          )}
                      </div>
                   </div>

                   {/* Data Structures Dock */}
                   {selectedOpId === 'subStack' && (
                       <div className="absolute bottom-6 right-6 flex gap-4 z-20 pointer-events-none">
                           <div className={`bg-slate-900 border border-slate-700 rounded-xl p-3 w-20 flex flex-col items-center shadow-xl`}>
                               <span className={`text-[9px] font-black uppercase text-white tracking-widest mb-2 font-mono flex items-center gap-1`}><Layers size={10}/> S1 (Large)</span>
                               <div className={`flex flex-col-reverse gap-1 justify-end h-24 w-full border-b-2 border-slate-500/50 pb-1`}>
                                   {s1 && s1.map((v:number, i:number) => (
                                       <div key={i} className={`bg-slate-800 border border-slate-600 text-slate-300 text-xs font-black font-mono py-1 text-center rounded animate-in zoom-in`}>{v}</div>
                                   ))}
                               </div>
                           </div>
                           <div className={`bg-slate-900 border border-slate-700 rounded-xl p-3 w-20 flex flex-col items-center shadow-xl`}>
                               <span className={`text-[9px] font-black uppercase text-white tracking-widest mb-2 font-mono flex items-center gap-1`}><Layers size={10}/> S2 (Small)</span>
                               <div className={`flex flex-col-reverse gap-1 justify-end h-24 w-full border-b-2 border-slate-500/50 pb-1`}>
                                   {s2 && s2.map((v:number, i:number) => (
                                       <div key={i} className={`bg-slate-800 border border-slate-600 text-slate-300 text-xs font-black font-mono py-1 text-center rounded animate-in zoom-in`}>{v}</div>
                                   ))}
                               </div>
                           </div>
                       </div>
                   )}

                   {/* Fixed Zoom Controls */}
                   <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-40 pointer-events-auto bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur">
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
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                                   </marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>

                           {/* Render L1 (Top Row) */}
                           <div className={`absolute text-[10px] font-black ${isL1Larger ? 'text-fuchsia-600 bg-fuchsia-100' : 'text-sky-600 bg-sky-100'} px-2 py-1 rounded font-mono tracking-widest uppercase origin-left -translate-y-12`} style={{ left: 40, top: 80 }}>L1 {isL1Larger && !isEq ? '(Large)' : isEq ? '(Eq)' : '(Small)'}</div>
                           {state.l1 && state.l1.map((nodeObj: ListNodeData) => {
                               const isTarget = isL1Larger ? c1 === nodeObj.id : c2 === nodeObj.id;
                               const isMacroReversed = isL1Larger ? macroReverseL : macroReverseS;
                               return (
                                   <div key={nodeObj.id} className="absolute transition-all duration-500 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className={`${isMacroReversed ? 'scale-x-[-1]' : ''}`}>
                                        <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} nextAddr={nodeObj.nextId ? '...' : 'null'} isTarget={isTarget} themeColor={isL1Larger ? 'fuchsia' : 'sky'} />
                                      </div>
                                   </div>
                               )
                           })}

                           {/* Render L2 (Middle Row) */}
                           <div className={`absolute text-[10px] font-black ${!isL1Larger ? 'text-fuchsia-600 bg-fuchsia-100' : 'text-sky-600 bg-sky-100'} px-2 py-1 rounded font-mono tracking-widest uppercase origin-left -translate-y-12`} style={{ left: 40, top: 240 }}>L2 {!isL1Larger && !isEq ? '(Large)' : isEq ? '(Eq)' : '(Small)'}</div>
                           {state.l2 && state.l2.map((nodeObj: ListNodeData) => {
                               const isTarget = !isL1Larger ? c1 === nodeObj.id : c2 === nodeObj.id;
                               const isMacroReversed = !isL1Larger ? macroReverseL : macroReverseS;
                               return (
                                   <div key={nodeObj.id} className="absolute transition-all duration-500 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className={`${isMacroReversed ? 'scale-x-[-1]' : ''}`}>
                                        <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} nextAddr={nodeObj.nextId ? '...' : 'null'} isTarget={isTarget} themeColor={!isL1Larger ? 'fuchsia' : 'sky'} />
                                      </div>
                                   </div>
                               )
                           })}

                           {/* Render Result (Bottom Row) */}
                           <div className="absolute text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-1 rounded font-mono tracking-widest uppercase origin-left -translate-y-12" style={{ left: 40, top: 400 }}>Result</div>
                           {state.res && state.res.map((nodeObj: ListNodeData) => {
                               const isTarget = activeResNode === nodeObj.id;
                               return (
                                   <div key={nodeObj.id} className="absolute transition-all duration-500 z-10 animate-in zoom-in slide-in-from-top-4" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                       <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center z-20">
                                           {nodeObj.id === state.resHead && <PointerLabel label="resHead" color="emerald" position="top" active={true} offset={0} />}
                                       </div>
                                       <div className={`${resReversed ? 'scale-x-[-1]' : ''}`}>
                                          <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} nextAddr={nodeObj.nextId ? '...' : 'null'} isTarget={isTarget} themeColor={'emerald'} />
                                       </div>
                                   </div>
                               )
                           })}
                           {state.res.length === 0 && <div className="absolute text-slate-300 text-xs font-mono italic" style={{ left: 100, top: 400 }}>Waiting...</div>}

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

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, nextAddr, themeColor = 'slate', isTarget, isFaded }) => {
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
        <div className={`relative flex flex-col items-center group transition-opacity ${isFaded ? 'opacity-40' : 'opacity-100'}`}>
            <span className="text-[9px] text-slate-400 font-mono font-bold mb-1 opacity-80">{address}</span>
            <div className={`flex items-center w-24 h-12 border-2 rounded-xl transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative`}>
                <div className={`flex-1 flex justify-center font-mono font-black text-lg ${activeTheme.text}`}>
                    {val}
                </div>
                <div className={`w-2/5 h-full border-l-2 flex flex-col items-center justify-center rounded-r-lg ${activeTheme.border} ${activeTheme.next}`}>
                    <span className="text-[5px] font-black uppercase tracking-widest opacity-60">NEXT</span>
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'rose' }) => {
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|Node|true|false|System|out|print|println|static|subtractLinkedLists|getLargerList|Stack|push|pop|isEmpty|trimLeadingZeros|reverseList)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'boolean', 'String', 'Node', 'System', 'out', 'print', 'println', 'void', 'Stack'].includes(part)) return <span key={i} className="text-indigo-400 font-bold">{part}</span>;
          if (['subtractLinkedLists', 'getLargerList', 'push', 'pop', 'isEmpty', 'trimLeadingZeros', 'reverseList'].includes(part)) return <span key={i} className={`text-${theme}-400 font-bold`}>{part}</span>;
          if (['true', 'false', 'null', 'None'].includes(part)) return <span key={i} className="text-orange-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-emerald-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default SubtractTwoNumbersViz;