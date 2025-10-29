import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp, ArrowLeft,
  GitCommit, MonitorPlay, ChevronLeft, ChevronRight, 
  Network, Database, RotateCcw, ListOrdered, RefreshCw,
  PlusSquare, Zap, AlertCircle, Goal, Info, Layers,
  ZoomIn, ZoomOut, Maximize, Minimize
} from 'lucide-react';

const OPERATIONS = {
  addStack: {
    id: 'addStack',
    title: 'Using Stacks (LIFO)',
    icon: <Layers size={16} />,
    complexity: 'Time: O(N+M) | Space: O(N+M)',
    code: `public Node addTwoNumbers(Node head1, Node head2) {
    head1 = trimLeadingZeros(head1);
    head2 = trimLeadingZeros(head2);
    
    Stack<Integer> s1 = new Stack<>();
    Stack<Integer> s2 = new Stack<>();
    
    // Push all digits into stacks
    while (head1 != null) { s1.push(head1.data); head1 = head1.next; }
    while (head2 != null) { s2.push(head2.data); head2 = head2.next; }
    
    Node resHead = null;
    int carry = 0;
    
    // Pop and add from right to left
    while (!s1.isEmpty() || !s2.isEmpty() || carry != 0) {
        int sum = carry;
        if (!s1.isEmpty()) sum += s1.pop();
        if (!s2.isEmpty()) sum += s2.pop();
        
        // Prepend new node to result list
        Node newNode = new Node(sum % 10);
        newNode.next = resHead;
        resHead = newNode;
        carry = sum / 10;
    }
    
    return resHead == null ? new Node(0) : resHead;
}`,
    desc: "Because we must add from right-to-left (least significant digit first), we traverse both lists and push their values onto Stacks. By popping from the stacks, we easily process the digits backwards. We build the result list by prepending new nodes."
  },
  addReverse: {
    id: 'addReverse',
    title: 'Reverse & Add',
    icon: <RefreshCw size={16} />,
    complexity: 'Time: O(N+M) | Space: O(1)',
    code: `public Node addTwoNumbers(Node head1, Node head2) {
    head1 = trimLeadingZeros(head1);
    head2 = trimLeadingZeros(head2);
    
    // Reverse both lists to align least significant digits
    head1 = reverseList(head1);
    head2 = reverseList(head2);
    
    Node dummy = new Node(0);
    Node curr = dummy;
    int carry = 0;
    
    // Add digit by digit
    while (head1 != null || head2 != null || carry != 0) {
        int sum = carry;
        if (head1 != null) { sum += head1.data; head1 = head1.next; }
        if (head2 != null) { sum += head2.data; head2 = head2.next; }
        
        curr.next = new Node(sum % 10);
        curr = curr.next;
        carry = sum / 10;
    }
    
    // Reverse the result to restore original order
    return reverseList(dummy.next);
}`,
    desc: "The O(1) space approach. We explicitly reverse both input lists so their heads are the ones digits. We iterate through them, appending the sums to a new list, and then reverse the final result."
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

// Data structures with physical coordinates
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
      <div className="flex items-center gap-3 mb-6 text-emerald-600">
          <PlusSquare size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Add Two Numbers</h2>
      </div>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given two non-negative integers represented as linked lists, return a new linked list representing their sum. Each node contains a single digit. The most significant digit comes first.
        </p>

        <ul className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3 font-medium text-slate-700 list-none">
            <li className="flex items-center gap-3"><Info className="text-emerald-500" size={18}/> <strong>Forward Order:</strong> The head is the highest digit (e.g., <code>1 -{'>'} 2</code> is 12).</li>
            <li className="flex items-center gap-3"><Info className="text-emerald-500" size={18}/> <strong>Leading Zeros:</strong> Inputs may have leading zeros (<code>0 -{'>'} 4</code>). The output must NOT have leading zeros unless the sum is exactly 0.</li>
        </ul>

        <div className="space-y-6 pt-4">
           <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs border-b pb-2">Examples</h4>
           
           <div className="grid md:grid-cols-2 gap-6">
               <div className="bg-sky-50/50 border border-sky-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-sky-800 uppercase tracking-widest text-[10px] items-center gap-2"><Goal size={14}/> Example 1: Standard</div>
                   <div className="space-y-3">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-8 text-xs font-bold">L1:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">4 <ArrowRight size={12} className="mx-1"/> 5</div>
                           <span className="text-slate-400 text-[10px] italic">(45)</span>
                       </div>
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-8 text-xs font-bold">L2:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">3 <ArrowRight size={12} className="mx-1"/> 4 <ArrowRight size={12} className="mx-1"/> 5</div>
                           <span className="text-slate-400 text-[10px] italic">(345)</span>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-sky-200/50 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold w-8">Out:</span> 
                          <div className="flex items-center text-emerald-700 font-bold bg-emerald-100 px-2 py-1 rounded border border-emerald-200 text-xs">3 <ArrowRight size={12} className="mx-1 text-emerald-400"/> 9 <ArrowRight size={12} className="mx-1 text-emerald-400"/> 0</div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1">45 + 345 = 390.</p>
                   </div>
               </div>

               <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-amber-800 uppercase tracking-widest text-[10px] items-center gap-2"><AlertCircle size={14}/> Example 2: Leading Zeros</div>
                   <div className="space-y-3">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-8 text-xs font-bold">L1:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">0 <ArrowRight size={12} className="mx-1"/> 0 <ArrowRight size={12} className="mx-1"/> 3</div>
                       </div>
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-8 text-xs font-bold">L2:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">0 <ArrowRight size={12} className="mx-1"/> 4</div>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-amber-200/50 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold w-8">Out:</span> 
                          <div className="flex items-center text-emerald-700 font-bold bg-emerald-100 px-2 py-1 rounded border border-emerald-200 text-xs">7</div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1">003 (is 3) + 04 (is 4) = 7. Leading zeros stripped!</p>
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
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Theory: The Alignment Problem</h2>
      </div>
      
      <p className="text-slate-600 leading-relaxed text-lg">
          When adding numbers, you must align the <strong>ones digits</strong>. But linked lists align at the <strong>head</strong> (the highest digit). Since lists can be different lengths (e.g., 45 and 345), we cannot just add <code>head1 + head2</code>.
      </p>

      <div className="grid md:grid-cols-2 gap-8 pt-4">
          <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl border border-slate-800">
              <div className="absolute -right-4 -top-4 opacity-10"><Layers size={120}/></div>
              <h3 className="font-black text-amber-400 uppercase tracking-widest text-sm mb-4 flex items-center gap-2"><Layers size={18}/> Stack Inversion</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  By pushing both lists completely into Stacks, the last nodes (the ones digits) sit at the top of the stack. 
              </p>
              <div className="bg-black/50 p-4 rounded-xl border border-white/10 font-mono text-xs text-amber-300">
                  s1.pop() + s2.pop() + carry
              </div>
              <p className="text-[11px] text-slate-400 mt-4 italic">Automatically aligns the ones, tens, hundreds. Highly intuitive.</p>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl relative overflow-hidden shadow-sm border border-slate-200">
              <div className="absolute -right-4 -bottom-4 opacity-5"><RefreshCw size={120}/></div>
              <h3 className="font-black text-fuchsia-600 uppercase tracking-widest text-sm mb-4 flex items-center gap-2"><RefreshCw size={18}/> Pointer Reversal</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  We reverse the physical <code>next</code> pointers of both input lists. The ones digits become the new heads.
              </p>
              <div className="bg-white p-4 rounded-xl border shadow-sm font-mono text-xs text-fuchsia-700">
                  head1 = reverse(head1);<br/>
                  head2 = reverse(head2);
              </div>
              <p className="text-[11px] text-slate-500 mt-4 italic">Requires no O(N) extra memory, but mutates the original input data structures.</p>
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
               "A hallmark Microsoft and Amazon question. Always ask the interviewer: 'Am I allowed to modify the input linked lists?' If YES, use the O(1) Space Reverse method. If NO, use the O(N) Space Stack method."
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
               <div className="p-5 rounded-2xl border bg-amber-900/40 border-amber-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-amber-400 mb-1">Stack (Non-Mutating)</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(N+M) <br/><strong>Space:</strong> O(N+M)</div>
                    <p className="text-[10px] text-amber-200/70 leading-relaxed mt-2">Preferred when inputs are read-only. We push all N and M elements to two separate stacks.</p>
               </div>
               <div className="p-5 rounded-2xl border bg-fuchsia-900/40 border-fuchsia-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-fuchsia-400 mb-1">Reverse (Mutating)</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(N+M) <br/><strong>Space:</strong> O(1)</div>
                    <p className="text-[10px] text-fuchsia-200/70 leading-relaxed mt-2">Reverses lists in place. Builds result forwards, then reverses result. Most optimal if mutation is allowed.</p>
               </div>
           </div>
       </div>

       <div className="grid grid-cols-1 gap-6 mt-8">
           <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
               <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <Activity size={14} className="text-rose-500"/> Handling Leading Zeros
               </h4>
               <p className="text-sm text-slate-600 leading-relaxed">
                   Always trim leading zeros <strong>before</strong> pushing to stacks or reversing! <br/><br/>
                   <code>while (head != null && head.data == 0 && head.next != null) head = head.next;</code><br/><br/>
                   The <code>head.next != null</code> check ensures that if the input is <code>0 -{'>'} 0</code>, we keep the final <code>0</code>!
               </p>
           </div>
       </div>
    </div>
);

// Coordinate Generation for Physical Canvas Plotting
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
    let safeGuard = 0; // Prevent infinite loops in broken circular states
    while(curr !== null && safeGuard < 100) {
        let node = list.find(n => n.id === curr);
        if(node) {
           res.push(node);
           curr = node.nextId;
           safeGuard++;
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

export default function AddTwoNumbersViz() {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'overview' | 'theory' | 'interview'>('visualizer');
  const [selectedOpId, setSelectedOpId] = useState<keyof typeof OPERATIONS>('addStack');
  
  const [inputL1, setInputL1] = useState('0, 4, 5');
  const [inputL2, setInputL2] = useState('3, 4, 5');
  
  const [baseL1, setBaseL1] = useState<ListNodeData[]>([]);
  const [baseL2, setBaseL2] = useState<ListNodeData[]>([]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  // Pan and Zoom State for Infinite Canvas
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.9);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const selectedOp = OPERATIONS[selectedOpId];

  // Parse inputs to Base States
  useEffect(() => {
      const v1 = inputL1.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 0 && n <= 9);
      const v2 = inputL2.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 0 && n <= 9);
      
      // Plot L1 on top row (y=80), L2 on middle row (y=240)
      const n1 = v1.length ? v1.map((v, i) => generateNode(v, i, i < v1.length - 1 ? i + 1 : null, 100 + i * 200, 80)) : [generateNode(0, 0, null, 100, 80)];
      const n2 = v2.length ? v2.map((v, i) => generateNode(v, i + 100, i < v2.length - 1 ? i + 101 : null, 100 + i * 200, 240)) : [generateNode(0, 100, null, 100, 240)];

      setBaseL1(n1);
      setBaseL2(n2);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.9);
  }, [inputL1, inputL2, selectedOpId]);

  // Trackpad Zoom Logic
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        const delta = -e.deltaY * 0.005;
        setZoom(prev => {
            const next = prev + delta;
            return Math.min(Math.max(next, 0.3), 3);
        });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

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
            l1: l1.map(n=>({...n})), 
            l2: l2.map(n=>({...n})), 
            res: res.map(n=>({...n})),
            h1, h2, resHead,
            ...stateProps 
        }
      });
    };

    // --- SHARED TRIM ZERO LOGIC ---
    addStep("Trim Leading Zeros", "Removing leading zeros from inputs to avoid calculating padding.", 2, { c1: h1, c2: h2 });
    while (h1 !== null && l1.find(n=>n.id===h1)?.val === 0 && l1.find(n=>n.id===h1)?.nextId !== null) {
        h1 = l1.find(n=>n.id===h1)?.nextId ?? null;
    }
    while (h2 !== null && l2.find(n=>n.id===h2)?.val === 0 && l2.find(n=>n.id===h2)?.nextId !== null) {
        h2 = l2.find(n=>n.id===h2)?.nextId ?? null;
    }
    addStep("Trim Complete", "Inputs cleaned. Ready to process.", 3, { c1: h1, c2: h2 });

    if (selectedOpId === 'addStack') {
        let s1: number[] = [];
        let s2: number[] = [];
        
        addStep("Initialize Stacks", `Stack<Integer> s1 = new Stack<>(); Stack<Integer> s2 = new Stack<>();`, 5, { s1: [...s1], s2: [...s2], c1: h1, c2: h2 });

        let c1 = h1;
        while (c1 !== null) {
            let val = l1.find(n=>n.id===c1)?.val as number;
            s1.push(val);
            addStep("Push L1", `s1.push(${val});`, 9, { s1: [...s1], s2: [...s2], c1, c2: h2 });
            c1 = l1.find(n=>n.id===c1)?.nextId ?? null;
        }

        let c2 = h2;
        while (c2 !== null) {
            let val = l2.find(n=>n.id===c2)?.val as number;
            s2.push(val);
            addStep("Push L2", `s2.push(${val});`, 10, { s1: [...s1], s2: [...s2], c1: null, c2 });
            c2 = l2.find(n=>n.id===c2)?.nextId ?? null;
        }

        let carry = 0;
        addStep("Begin Addition", `Node resHead = null; int carry = 0;`, 13, { s1: [...s1], s2: [...s2], carry, sum: 0 });

        // Physical X-coordinate tracking for prepending (building right-to-left physically)
        let resX = Math.max(l1.length, l2.length) * 200 + 100;

        while (s1.length > 0 || s2.length > 0 || carry > 0) {
            addStep("Loop Condition", `while (!s1.isEmpty() || !s2.isEmpty() || carry != 0)`, 15, { s1: [...s1], s2: [...s2], carry });
            
            let v1 = s1.length > 0 ? s1.pop() as number : 0;
            let v2 = s2.length > 0 ? s2.pop() as number : 0;
            let sum = v1 + v2 + carry;
            
            addStep("Pop & Sum", `sum = ${v1} (L1) + ${v2} (L2) + ${carry} (Carry) = ${sum}.`, 18, { s1: [...s1], s2: [...s2], carry, sum });
            
            let digit = sum % 10;
            carry = Math.floor(sum / 10);
            
            let newNode = generateNode(digit, nextResId++, resHead, resX, 420);
            resX -= 200; // Move next physical placement to the left
            res.push(newNode);
            resHead = newNode.id; // PREPEND (Logically points right, physically placed left)
            
            addStep("Prepend to Result", `Prepended Node(${digit}) to resHead. New carry is ${carry}.`, 22, { s1: [...s1], s2: [...s2], carry, sum, activeResNode: resHead });
        }

        addStep("Operation Complete", `All digits processed. Return resHead.`, 26, { s1: [], s2: [], carry: 0, isSuccess: true });
    } 
    else if (selectedOpId === 'addReverse') {
        
        // Macro Reverse L1
        addStep("Reverse L1", `head1 = reverseList(head1);`, 6, { c1: h1, c2: h2 });
        let rev1 = reverseListState(l1, h1);
        l1 = rev1.newList;
        h1 = rev1.newHead;
        addStep("L1 Reversed", `L1 pointers flipped. Least significant digit is now the head.`, 6, { c1: h1, c2: h2, macroReverse1: true });

        // Macro Reverse L2
        addStep("Reverse L2", `head2 = reverseList(head2);`, 7, { c1: h1, c2: h2, macroReverse1: true });
        let rev2 = reverseListState(l2, h2);
        l2 = rev2.newList;
        h2 = rev2.newHead;
        addStep("L2 Reversed", `L2 pointers flipped. Least significant digit is now the head.`, 7, { c1: h1, c2: h2, macroReverse1: true, macroReverse2: true });

        let carry = 0;
        let c1 = h1;
        let c2 = h2;
        let dummyId = 999;
        
        // Place dummy node physically far left
        let resX = 100;
        let dummyNode = generateNode(0, dummyId, null, resX - 200, 420);
        res.push(dummyNode);
        resHead = dummyId;
        let resCurr = dummyId;

        addStep("Begin Addition", `Node curr = dummy; int carry = 0;`, 11, { c1, c2, carry, sum: 0, macroReverse1: true, macroReverse2: true });

        while (c1 !== null || c2 !== null || carry !== 0) {
            addStep("Loop Condition", `while (head1 != null || head2 != null || carry != 0)`, 13, { c1, c2, carry, macroReverse1: true, macroReverse2: true });
            
            let v1 = 0, v2 = 0;
            if (c1 !== null) {
                v1 = l1.find(n=>n.id===c1)?.val as number;
                c1 = l1.find(n=>n.id===c1)?.nextId ?? null;
            }
            if (c2 !== null) {
                v2 = l2.find(n=>n.id===c2)?.val as number;
                c2 = l2.find(n=>n.id===c2)?.nextId ?? null;
            }
            
            let sum = v1 + v2 + carry;
            addStep("Compute Sum", `sum = ${v1} + ${v2} + ${carry} = ${sum}.`, 16, { c1, c2, carry, sum, macroReverse1: true, macroReverse2: true });
            
            let digit = sum % 10;
            carry = Math.floor(sum / 10);
            
            let newNode = generateNode(digit, nextResId++, null, resX, 420);
            resX += 200; // Move next physical placement to the right
            res.push(newNode);
            
            let currNode = res.find(n=>n.id === resCurr);
            if (currNode) currNode.nextId = newNode.id;
            resCurr = newNode.id; // APPEND
            
            addStep("Append to Result", `Appended Node(${digit}). New carry is ${carry}.`, 19, { c1, c2, carry, sum, activeResNode: resCurr, macroReverse1: true, macroReverse2: true });
        }

        // Drop dummy conceptually by advancing head
        let actualResHead = res.find(n=>n.id === dummyId)?.nextId ?? null;
        resHead = actualResHead;
        
        // Remove dummy from physical array for cleaner view
        res = res.filter(n => n.id !== dummyId);
        
        addStep("Addition Complete", `Finished adding nodes. Now we must reverse the result list.`, 22, { carry: 0, macroReverse1: true, macroReverse2: true });

        // Macro Reverse Res
        addStep("Reverse Result", `return reverseList(dummy.next);`, 24, { macroReverse1: true, macroReverse2: true });
        let revRes = reverseListState(res, resHead);
        res = revRes.newList;
        resHead = revRes.newHead;
        addStep("Operation Complete", `Result reversed (pointers flipped backward). Final answer ready!`, 24, { isSuccess: true, macroReverse1: true, macroReverse2: true, resReversed: true });
    }

    if (steps.length === 0) steps.push({ phase: 'Ready', description: 'Click play to simulate.', line: 1, state: { l1: baseL1, l2: baseL2, res: [], h1: baseL1[0]?.id, h2: baseL2[0]?.id } });
    return steps;
  }, [baseL1, baseL2, selectedOpId]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleReset = () => { setCurrentStep(0); setPan({x:0, y:0}); setZoom(0.9); };

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
  const resetZoom = () => { setZoom(0.9); setPan({ x: 0, y: 0 }); };

  const cur = trace[currentStep] || trace[0] || { state: { l1: baseL1, l2: baseL2, res: [] } };
  const state = cur.state || { l1: baseL1, l2: baseL2, res: [] };
  
  const { 
      isSuccess, s1, s2, carry, sum, c1, c2, activeResNode, h1, h2, resHead, 
      macroReverse1, macroReverse2, resReversed
  } = state;

  const getThemeColor = () => selectedOpId === 'addStack' ? 'amber' : 'fuchsia';
  const activeTheme = getThemeColor();

  // Draw pure SVG lines to connect nodes
  const renderSvgArrows = () => {
    const allNodes = [...(state.l1 || []), ...(state.l2 || []), ...(state.res || [])];
    
    return allNodes.map((node) => {
        if (node.nextId === null) return null;
        
        const target = allNodes.find(n => n.id === node.nextId);
        if (!target) return null;

        // Origin point: center of the "NEXT" box (Node width: 112px. Center of rightmost part approx ~92px).
        const startX = node.x + 92; 
        const startY = node.y + 28; // height is 56 (h-14)

        // End at left middle of the target Node
        const endX = target.x - 6;
        const endY = target.y + 28;

        const isProcessingL1 = c1 === node.id || c1 === target.id;
        const isProcessingL2 = c2 === node.id || c2 === target.id;
        const isProcessingRes = activeResNode === node.id || activeResNode === target.id;

        let strokeColor = '#94a3b8'; // default slate-400
        if (isProcessingL1) strokeColor = '#0ea5e9'; // sky-500
        else if (isProcessingL2) strokeColor = '#d946ef'; // fuchsia-500
        else if (isProcessingRes) strokeColor = '#10b981'; // emerald-500

        const strokeWidth = (isProcessingL1 || isProcessingL2 || isProcessingRes) ? 4 : 2;
        const strokeOpacity = (isProcessingL1 || isProcessingL2 || isProcessingRes) ? 1 : 0.5;
        
        const markerMap: Record<string, string> = {
            '#0ea5e9': 'url(#arrowhead-sky)',
            '#d946ef': 'url(#arrowhead-fuchsia)',
            '#10b981': 'url(#arrowhead-emerald)',
            '#94a3b8': 'url(#arrowhead-default)'
        };
        const marker = markerMap[strokeColor] || markerMap['#94a3b8'];

        let pathD = '';
        const diffX = endX - startX;
        
        // Because L1, L2, Res stay in their own rows, diffY is always ~0 for lines
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
                markerEnd={marker} 
                className="transition-all duration-500 ease-in-out"
            />
        );
    });
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header Component */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <PlusSquare size={100} />
          </div>
          <div className="flex items-center gap-5 z-10">
            <div className={`bg-${activeTheme}-600 p-4 rounded-2xl shadow-lg shadow-${activeTheme}-100 flex items-center justify-center transition-colors duration-500`}>
                <PlusSquare className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Add Two Numbers</h1>
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
                        let btnColor = op.id === 'addStack' ? 'amber' : 'fuchsia';
                        
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
                        <label className={`text-[10px] font-black text-sky-600 uppercase block pl-1 tracking-widest font-mono`}>List 1 Digits</label>
                        <input type="text" value={inputL1} onChange={(e) => { setInputL1(e.target.value); setCurrentStep(0); }} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-inner`} placeholder="0, 4, 5" />
                    </div>
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className={`text-[10px] font-black text-fuchsia-600 uppercase block pl-1 tracking-widest font-mono`}>List 2 Digits</label>
                        <input type="text" value={inputL2} onChange={(e) => { setInputL2(e.target.value); setCurrentStep(0); }} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all shadow-inner`} placeholder="3, 4, 5" />
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
                <div className="bg-slate-50 bg-[linear-gradient(to_right,#cbd5e130_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e130_1px,transparent_1px)] bg-[size:20px_20px] rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col shadow-inner overflow-hidden min-h-[540px]">
                  
                   <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 z-30 pointer-events-none">
                      <div className="flex items-center gap-4 bg-white/90 px-4 py-2 rounded-xl backdrop-blur shadow-sm border border-slate-200 pointer-events-auto">
                          <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest font-mono flex items-center gap-2">
                              <Network size={16} className={activeTheme === 'amber' ? 'text-amber-500' : 'text-fuchsia-500'}/> Memory Canvas
                          </span>
                      </div>
                      
                      {/* Math Trackers */}
                      <div className="flex gap-2 pointer-events-auto">
                          {sum !== undefined && (
                              <div className="bg-white/90 text-slate-700 font-mono text-[11px] px-3 py-1.5 rounded-lg font-black border border-slate-200 shadow-sm animate-in zoom-in backdrop-blur">
                                  sum: {sum}
                              </div>
                          )}
                          {carry !== undefined && (
                              <div className={`font-mono text-[11px] px-3 py-1.5 rounded-lg font-black border shadow-sm animate-in zoom-in backdrop-blur ${carry > 0 ? 'bg-rose-100 text-rose-700 border-rose-300' : 'bg-white/90 text-slate-700 border-slate-200'}`}>
                                  carry: {carry}
                              </div>
                          )}
                      </div>
                   </div>

                   {/* Fixed Stacks UI (Only visible for addStack) */}
                   {selectedOpId === 'addStack' && (
                       <div className="absolute bottom-6 left-6 flex gap-4 z-40 pointer-events-none">
                           <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 w-24 flex flex-col items-center shadow-2xl animate-in slide-in-from-bottom-8 pointer-events-auto">
                               <span className="text-[10px] font-black uppercase text-sky-400 tracking-widest mb-3 font-mono">S1 (L1)</span>
                               <div className="flex flex-col-reverse gap-1.5 justify-end h-28 w-full border-b-2 border-sky-500/50 pb-2 overflow-y-auto scrollbar-thin">
                                   {s1 && s1.map((v:number, i:number) => (
                                       <div key={i} className="bg-sky-900/50 border border-sky-500/30 text-sky-300 text-xs font-black font-mono py-1 text-center rounded-lg animate-in zoom-in duration-300">{v}</div>
                                   ))}
                               </div>
                           </div>
                           <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 w-24 flex flex-col items-center shadow-2xl animate-in slide-in-from-bottom-8 pointer-events-auto delay-100">
                               <span className="text-[10px] font-black uppercase text-fuchsia-400 tracking-widest mb-3 font-mono">S2 (L2)</span>
                               <div className="flex flex-col-reverse gap-1.5 justify-end h-28 w-full border-b-2 border-fuchsia-500/50 pb-2 overflow-y-auto scrollbar-thin">
                                   {s2 && s2.map((v:number, i:number) => (
                                       <div key={i} className="bg-fuchsia-900/50 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-black font-mono py-1 text-center rounded-lg animate-in zoom-in duration-300">{v}</div>
                                   ))}
                               </div>
                           </div>
                       </div>
                   )}

                   {/* Fixed Zoom Controls */}
                   <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-40 pointer-events-auto bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur">
                      <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                      <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><ZoomOut size={18}/></button>
                      <button onClick={toggleFullscreen} className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><Maximize size={18}/></button>
                   </div>

                   {/* Interactive Canvas */}
                   <div 
                    ref={canvasContainerRef}
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
                                   <marker id="arrowhead-sky" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#0ea5e9" /> {/* sky-500 */}
                                   </marker>
                                   <marker id="arrowhead-fuchsia" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#d946ef" /> {/* fuchsia-500 */}
                                   </marker>
                                   <marker id="arrowhead-emerald" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" /> {/* emerald-500 */}
                                   </marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>

                           {/* Render List 1 (Top Row) */}
                           <div className="absolute text-[10px] font-black text-slate-400 font-mono tracking-widest uppercase origin-left" style={{ left: 40, top: 100 }}>List 1</div>
                           {state.l1 && state.l1.map((nodeObj: ListNodeData) => {
                               const isTarget = c1 === nodeObj.id;
                               return (
                                   <div key={nodeObj.id} className="absolute transition-all duration-500 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                       <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center z-20">
                                           {nodeObj.id === h1 && <PointerLabel label="head1" color="sky" position="top" active={true} offset={0} />}
                                       </div>
                                       <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center z-20">
                                           {isTarget && <PointerLabel label="head1 (local)" color="sky" position="bottom" active={true} offset={0} />}
                                       </div>

                                       <ListNodeBlock 
                                          val={nodeObj.val} 
                                          address={nodeObj.addr} 
                                          nextAddr={nodeObj.nextId ? (state.l1.find((n:any)=>n.id===nodeObj.nextId)?.addr ?? 'null') : 'null'} 
                                          isTarget={isTarget} 
                                          themeColor={'sky'}
                                       />
                                       
                                       {nodeObj.nextId === null && (
                                          <div className={`absolute top-1/2 -translate-y-1/2 text-xs font-black font-mono text-slate-400 ${macroReverse1 ? '-left-12' : '-right-12'}`}>null</div>
                                       )}
                                   </div>
                               )
                           })}

                           {/* Render List 2 (Middle Row) */}
                           <div className="absolute text-[10px] font-black text-slate-400 font-mono tracking-widest uppercase origin-left" style={{ left: 40, top: 280 }}>List 2</div>
                           {state.l2 && state.l2.map((nodeObj: ListNodeData) => {
                               const isTarget = c2 === nodeObj.id;
                               return (
                                   <div key={nodeObj.id} className="absolute transition-all duration-500 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                       <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center z-20">
                                           {nodeObj.id === h2 && <PointerLabel label="head2" color="fuchsia" position="top" active={true} offset={0} />}
                                       </div>
                                       <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center z-20">
                                           {isTarget && <PointerLabel label="head2 (local)" color="fuchsia" position="bottom" active={true} offset={0} />}
                                       </div>

                                       <ListNodeBlock 
                                          val={nodeObj.val} 
                                          address={nodeObj.addr} 
                                          nextAddr={nodeObj.nextId ? (state.l2.find((n:any)=>n.id===nodeObj.nextId)?.addr ?? 'null') : 'null'} 
                                          isTarget={isTarget} 
                                          themeColor={'fuchsia'}
                                       />
                                       
                                       {nodeObj.nextId === null && (
                                          <div className={`absolute top-1/2 -translate-y-1/2 text-xs font-black font-mono text-slate-400 ${macroReverse2 ? '-left-12' : '-right-12'}`}>null</div>
                                       )}
                                   </div>
                               )
                           })}

                           {/* Render Result List (Bottom Row) */}
                           <div className="absolute w-full border-t-2 border-dashed border-emerald-100/50" style={{ top: 400 }}></div>
                           <div className="absolute text-[10px] font-black text-emerald-600 font-mono tracking-widest uppercase origin-left" style={{ left: 40, top: 460 }}>Result</div>
                           {state.res && state.res.map((nodeObj: ListNodeData) => {
                               const isTarget = activeResNode === nodeObj.id;
                               return (
                                   <div key={nodeObj.id} className="absolute transition-all duration-500 z-10 animate-in zoom-in slide-in-from-top-8" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                       <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center z-20">
                                           {nodeObj.id === resHead && <PointerLabel label="resHead" color="emerald" position="top" active={true} offset={0} />}
                                       </div>

                                       <ListNodeBlock 
                                          val={nodeObj.val} 
                                          address={nodeObj.addr} 
                                          nextAddr={nodeObj.nextId ? (state.res.find((n:any)=>n.id===nodeObj.nextId)?.addr ?? 'null') : 'null'} 
                                          isTarget={isTarget} 
                                          themeColor={'emerald'}
                                       />
                                       
                                       {nodeObj.nextId === null && (
                                          <div className={`absolute top-1/2 -translate-y-1/2 text-xs font-black font-mono text-slate-400 ${resReversed ? '-left-12' : '-right-12'}`}>null</div>
                                       )}
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

      {/* --- Simulated Fullscreen Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              
              {/* LEFT SIDEBAR: Code & Logic */}
              <div className="w-[450px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110]">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800">
                      <div className="flex items-center gap-4">
                          <div className="bg-amber-600 p-2 rounded-lg text-white shadow-lg"><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Source Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all">
                          <Minimize size={20}/>
                      </button>
                  </div>

                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} />
                        ))}
                    </div>

                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Memory Operations</span></div>
                            <span>Line {String(cur.line || 0)}</span>
                        </div>
                        <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3 relative z-10">
                            {cur.phase}
                        </div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line relative z-10">{cur.description}</p>
                    </div>

                    {/* Operations Selector */}
                    <div className="grid grid-cols-1 gap-3 mt-4">
                        {Object.values(OPERATIONS).map((op) => {
                            const isSelected = selectedOpId === op.id;
                            let btnColor = op.id === 'addStack' ? 'amber' : 'fuchsia';
                            
                            return (
                                <button 
                                   key={op.id}
                                   onClick={() => { setSelectedOpId(op.id as any); setCurrentStep(0); }}
                                   className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? `bg-${btnColor}-600 border-${btnColor}-600 text-white shadow-${btnColor}-200 scale-[1.02]` : `bg-slate-800 border-slate-700 text-slate-300 hover:border-${btnColor}-500 hover:bg-slate-700`}`}
                                >
                                    <div className="flex items-center justify-center w-full gap-2">
                                      <div className={`p-1.5 rounded-lg ${isSelected ? `bg-${btnColor}-500 text-white` : 'bg-slate-700 text-slate-400'}`}>{op.icon}</div>
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

                    {/* Console Output */}
                    <div className="bg-black/40 rounded-2xl border border-white/5 p-4 mt-4">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 font-mono">Console Output</div>
                        <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                            <div className="text-emerald-400 font-mono text-xs">Step {currentStep + 1} of {trace.length}</div>
                            <div className="text-slate-300 font-mono text-xs">{cur.phase}: {cur.description}</div>
                        </div>
                    </div>
                  </div>
              </div>

              {/* RIGHT CANVAS: Full Remaining Space */}
              <div className="flex-1 bg-[#020617] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:25px_25px]">
                      
                      {/* Floating Zoom Controls */}
                      <div className="absolute top-6 right-6 flex flex-col gap-2 z-40 pointer-events-auto bg-slate-900/90 p-2 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur">
                          <button onClick={zoomIn} className="p-3 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"><ZoomIn size={20}/></button>
                          <button onClick={zoomOut} className="p-3 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"><ZoomOut size={20}/></button>
                          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-3 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"><RotateCcw size={20}/></button>
                      </div>

                      {/* Large Step Controls */}
                      <div className="absolute bottom-6 right-6 flex gap-4 z-40 pointer-events-auto">
                          <button onClick={handlePrev} disabled={currentStep === 0} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl border border-slate-700 flex items-center gap-3">
                              <ChevronLeft size={24}/> PREV STEP
                          </button>
                          <button onClick={handleNext} disabled={currentStep === trace.length - 1} className={`px-8 py-4 bg-${activeTheme}-600 hover:bg-${activeTheme}-700 disabled:opacity-30 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl flex items-center gap-3`}>
                              NEXT STEP <ChevronRight size={24}/>
                          </button>
                      </div>

                      {/* Math Trackers */}
                      <div className="absolute top-6 left-6 flex gap-3 z-40 pointer-events-none">
                          {sum !== undefined && (
                              <div className="bg-slate-900/90 text-slate-200 font-mono text-sm px-4 py-2 rounded-xl font-black border border-slate-700 shadow-xl animate-in zoom-in backdrop-blur">
                                  sum: {sum}
                              </div>
                          )}
                          {carry !== undefined && (
                              <div className={`font-mono text-sm px-4 py-2 rounded-xl font-black border shadow-xl animate-in zoom-in backdrop-blur ${carry > 0 ? 'bg-rose-900/90 text-rose-200 border-rose-700' : 'bg-slate-900/90 text-slate-200 border-slate-700'}`}>
                                  carry: {carry}
                              </div>
                          )}
                      </div>

                      {/* Stacks UI (Only visible for addStack) */}
                      {selectedOpId === 'addStack' && (
                          <div className="absolute bottom-6 left-6 flex gap-4 z-40 pointer-events-none">
                              <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 w-28 flex flex-col items-center shadow-2xl animate-in slide-in-from-bottom-8 pointer-events-auto backdrop-blur">
                                  <span className="text-[10px] font-black uppercase text-sky-400 tracking-widest mb-3 font-mono">S1 (L1)</span>
                                  <div className="flex flex-col-reverse gap-1.5 justify-end h-32 w-full border-b-2 border-sky-500/50 pb-2 overflow-y-auto scrollbar-thin">
                                      {s1 && s1.map((v:number, i:number) => (
                                          <div key={i} className="bg-sky-900/50 border border-sky-500/30 text-sky-300 text-xs font-black font-mono py-1 text-center rounded-lg animate-in zoom-in duration-300">{v}</div>
                                      ))}
                                  </div>
                              </div>
                              <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 w-28 flex flex-col items-center shadow-2xl animate-in slide-in-from-bottom-8 pointer-events-auto delay-100 backdrop-blur">
                                  <span className="text-[10px] font-black uppercase text-fuchsia-400 tracking-widest mb-3 font-mono">S2 (L2)</span>
                                  <div className="flex flex-col-reverse gap-1.5 justify-end h-32 w-full border-b-2 border-fuchsia-500/50 pb-2 overflow-y-auto scrollbar-thin">
                                      {s2 && s2.map((v:number, i:number) => (
                                          <div key={i} className="bg-fuchsia-900/50 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-black font-mono py-1 text-center rounded-lg animate-in zoom-in duration-300">{v}</div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* Interactive Canvas */}
                      <div 
                       className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10" 
                       onPointerDown={handlePointerDown} 
                       onPointerMove={handlePointerMove} 
                       onPointerUp={handlePointerUp} 
                       onPointerLeave={handlePointerUp}
                      >
                          <div className="absolute top-0 left-0 w-full h-full origin-top-left pointer-events-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                              
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
                                      <marker id="arrowhead-emerald" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                                      </marker>
                                  </defs>
                                  {renderSvgArrows()}
                              </svg>

                              {/* Render List 1 (Top Row) */}
                              <div className="absolute text-sm font-black text-slate-400 font-mono tracking-widest uppercase origin-left" style={{ left: 40, top: 100 }}>List 1</div>
                              {state.l1 && state.l1.map((nodeObj: ListNodeData) => {
                                  const isTarget = c1 === nodeObj.id;
                                  return (
                                      <div key={nodeObj.id} className="absolute transition-all duration-500 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center z-20">
                                              {nodeObj.id === h1 && <PointerLabel label="head1" color="sky" position="top" active={true} offset={0} />}
                                          </div>
                                          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center z-20">
                                              {isTarget && <PointerLabel label="head1 (local)" color="sky" position="bottom" active={true} offset={0} />}
                                          </div>

                                          <ListNodeBlock 
                                             val={nodeObj.val} 
                                             address={nodeObj.addr} 
                                             nextAddr={nodeObj.nextId ? (state.l1.find((n:any)=>n.id===nodeObj.nextId)?.addr ?? 'null') : 'null'} 
                                             isTarget={isTarget} 
                                             themeColor={'sky'}
                                          />
                                          
                                          {nodeObj.nextId === null && (
                                             <div className={`absolute top-1/2 -translate-y-1/2 text-sm font-black font-mono text-slate-400 ${macroReverse1 ? '-left-12' : '-right-12'}`}>null</div>
                                          )}
                                      </div>
                                  )
                              })}

                              {/* Render List 2 (Middle Row) */}
                              <div className="absolute text-sm font-black text-slate-400 font-mono tracking-widest uppercase origin-left" style={{ left: 40, top: 280 }}>List 2</div>
                              {state.l2 && state.l2.map((nodeObj: ListNodeData) => {
                                  const isTarget = c2 === nodeObj.id;
                                  return (
                                      <div key={nodeObj.id} className="absolute transition-all duration-500 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center z-20">
                                              {nodeObj.id === h2 && <PointerLabel label="head2" color="fuchsia" position="top" active={true} offset={0} />}
                                          </div>
                                          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center z-20">
                                              {isTarget && <PointerLabel label="head2 (local)" color="fuchsia" position="bottom" active={true} offset={0} />}
                                          </div>

                                          <ListNodeBlock 
                                             val={nodeObj.val} 
                                             address={nodeObj.addr} 
                                             nextAddr={nodeObj.nextId ? (state.l2.find((n:any)=>n.id===nodeObj.nextId)?.addr ?? 'null') : 'null'} 
                                             isTarget={isTarget} 
                                             themeColor={'fuchsia'}
                                          />
                                          
                                          {nodeObj.nextId === null && (
                                             <div className={`absolute top-1/2 -translate-y-1/2 text-sm font-black font-mono text-slate-400 ${macroReverse2 ? '-left-12' : '-right-12'}`}>null</div>
                                          )}
                                      </div>
                                  )
                              })}

                              {/* Render Result List (Bottom Row) */}
                              <div className="absolute w-full border-t-2 border-dashed border-emerald-500/30" style={{ top: 400 }}></div>
                              <div className="absolute text-sm font-black text-emerald-400 font-mono tracking-widest uppercase origin-left" style={{ left: 40, top: 460 }}>Result</div>
                              {state.res && state.res.map((nodeObj: ListNodeData) => {
                                  const isTarget = activeResNode === nodeObj.id;
                                  return (
                                      <div key={nodeObj.id} className="absolute transition-all duration-500 z-10 animate-in zoom-in slide-in-from-top-8" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center z-20">
                                              {nodeObj.id === resHead && <PointerLabel label="resHead" color="emerald" position="top" active={true} offset={0} />}
                                          </div>

                                          <ListNodeBlock 
                                             val={nodeObj.val} 
                                             address={nodeObj.addr} 
                                             nextAddr={nodeObj.nextId ? (state.res.find((n:any)=>n.id===nodeObj.nextId)?.addr ?? 'null') : 'null'} 
                                             isTarget={isTarget} 
                                             themeColor={'emerald'}
                                          />
                                          
                                          {nodeObj.nextId === null && (
                                             <div className={`absolute top-1/2 -translate-y-1/2 text-sm font-black font-mono text-slate-400 ${resReversed ? '-left-12' : '-right-12'}`}>null</div>
                                          )}
                                      </div>
                                  )
                              })}

                          </div>
                      </div>

                      {/* FS Result Overlay */}
                      {isSuccess && (
                            <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                                <div className="bg-[#0f172a] border-4 border-emerald-500 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(16,185,129,0.3)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                                    <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10"><Trophy size={48}/></div>
                                    <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4">ADDITION COMPLETE</h2>
                                    <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Mathematical operation successful</p>
                                    <div className="bg-slate-800/80 rounded-[2rem] p-8 border border-slate-700 font-mono text-emerald-400 text-2xl font-bold break-all mb-10 shadow-2xl ring-1 ring-white/10 tracking-tighter">
                                        Result: {state.res?.map((n: any) => n.val).join(' → ') || 'Complete'}
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={handleReset} className="flex-1 py-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg">
                                            <RotateCcw size={24}/> RESTART VIZ
                                        </button>
                                        <button onClick={toggleFullscreen} className="py-6 px-10 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all border border-slate-700">
                                            CLOSE
                                        </button>
                                    </div>
                                </div>
                            </div>
                       )}
                  </div>
              </div>
          </div>
      )}
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

    const targetClasses = isTarget ? `ring-4 ring-${themeColor}-300 shadow-xl z-20 scale-105` : 'shadow-sm hover:shadow-md z-10';

    return (
        <div className={`relative flex flex-col items-center group transition-opacity ${isFaded ? 'opacity-40' : 'opacity-100'}`}>
            <span className="text-[10px] text-slate-400 font-mono font-bold mb-1 opacity-80">{address}</span>
            <div className={`flex items-center w-28 h-14 border-2 rounded-2xl transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative`}>
                <div className={`flex-1 flex justify-center font-mono font-black text-2xl ${activeTheme.text}`}>
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
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|Node|true|false|System|out|print|println|static|addTwoNumbers|Stack|push|pop|isEmpty)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'boolean', 'String', 'Node', 'System', 'out', 'print', 'println', 'void', 'Stack'].includes(part)) return <span key={i} className="text-indigo-400 font-bold">{part}</span>;
          if (['addTwoNumbers', 'push', 'pop', 'isEmpty'].includes(part)) return <span key={i} className={`text-${theme}-400 font-bold`}>{part}</span>;
          if (['true', 'false', 'null', 'None'].includes(part)) return <span key={i} className="text-orange-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-emerald-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};