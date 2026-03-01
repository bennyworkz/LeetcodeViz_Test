import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp, ArrowLeft,
  GitCommit, MonitorPlay, ChevronLeft, ChevronRight, 
  Network, Database, RotateCcw, ListOrdered, FastForward,
  Calculator, Zap, AlertCircle, Goal, Info, Layers, PlusCircle,
  ZoomIn, ZoomOut, Maximize
} from 'lucide-react';

const OPERATIONS = {
  sumTwoPointers: {
    id: 'sumTwoPointers',
    title: 'Two Pointers (Optimal)',
    icon: <FastForward size={16} />,
    complexity: 'Time: O(L) | Space: O(1)',
    code: `public int sumOfLastN(Node head, int n) {
    if (n <= 0 || head == null) return 0;
    
    Node main_ptr = head;
    Node ref_ptr = head;
    
    // 1. Move ref_ptr 'n' nodes ahead
    for (int i = 0; i < n; i++) {
        if (ref_ptr == null) return 0; // n > length
        ref_ptr = ref_ptr.next;
    }
    
    // 2. Move both pointers until ref_ptr hits the end
    while (ref_ptr != null) {
        main_ptr = main_ptr.next;
        ref_ptr = ref_ptr.next;
    }
    
    // 3. main_ptr is now exactly at the (L-n)th node
    int sum = 0;
    while (main_ptr != null) {
        sum += main_ptr.data;
        main_ptr = main_ptr.next;
    }
    
    return sum;
}`,
    desc: "Uses a sliding window technique. A 'ref_ptr' is moved 'n' nodes ahead. Then both 'main_ptr' and 'ref_ptr' move at the same speed. When 'ref_ptr' reaches the end, 'main_ptr' is exactly 'n' nodes from the end!"
  },
  sumStack: {
    id: 'sumStack',
    title: 'Using Stack (LIFO)',
    icon: <Layers size={16} />,
    complexity: 'Time: O(L) | Space: O(L)',
    code: `public int sumOfLastN(Node head, int n) {
    if (n <= 0 || head == null) return 0;
    
    Stack<Node> stack = new Stack<>();
    Node curr = head;
    
    // 1. Push all nodes onto the stack
    while (curr != null) {
        stack.push(curr);
        curr = curr.next;
    }
    
    int sum = 0;
    
    // 2. Pop 'n' times and accumulate the sum
    for (int i = 0; i < n; i++) {
        if (stack.isEmpty()) break;
        sum += stack.pop().data;
    }
    
    return sum;
}`,
    desc: "A highly intuitive approach. Since we want the LAST 'n' nodes, we push the entire linked list onto a Stack to reverse our access order. We then pop 'n' times, accumulating the values into a sum."
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
  isSummed?: boolean;
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
      <div className="flex items-center gap-3 mb-6 text-emerald-600">
          <Calculator size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Sum of Last N Nodes</h2>
      </div>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given a singly linked list and an integer <code>n</code>, calculate the sum of the <strong>last <code>n</code> nodes</strong>. 
          Constraints dictate that <code>0 &le; n &le; number of nodes</code>.
        </p>

        <ul className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3 font-medium text-slate-700 list-none">
            <li className="flex items-center gap-3"><Info className="text-emerald-500" size={18}/> <strong>Forward Only:</strong> Linked Lists cannot be traversed backwards inherently, meaning we can't just start from the tail and loop backward.</li>
            <li className="flex items-center gap-3"><Info className="text-emerald-500" size={18}/> <strong>Position Calculation:</strong> The last <code>n</code> nodes correspond to nodes starting from index <code>(Length - n)</code>.</li>
        </ul>

        <div className="space-y-6 pt-4">
           <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs border-b pb-2">Examples</h4>
           
           <div className="grid md:grid-cols-2 gap-6">
               <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-emerald-800 uppercase tracking-widest text-[10px] items-center gap-2"><Goal size={14}/> Example 1: Standard N</div>
                   <div className="space-y-3">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-8 text-xs font-bold">List:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">10 <ArrowRight size={12} className="mx-1"/> 20 <ArrowRight size={12} className="mx-1"/> 30 <ArrowRight size={12} className="mx-1"/> 40 <ArrowRight size={12} className="mx-1"/> 50</div>
                       </div>
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-8 text-xs font-bold">N:</span>
                           <div className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-xs">3</div>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-emerald-200/50 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold w-8">Out:</span> 
                          <div className="flex items-center text-emerald-700 font-bold bg-emerald-100 px-2 py-1 rounded border border-emerald-200 text-xs">120</div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1">Sum of last 3 nodes: 30 + 40 + 50 = 120.</p>
                   </div>
               </div>

               <div className="bg-sky-50/50 border border-sky-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-sky-800 uppercase tracking-widest text-[10px] items-center gap-2"><Goal size={14}/> Example 2: N = Length</div>
                   <div className="space-y-3">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-8 text-xs font-bold">List:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">5 <ArrowRight size={12} className="mx-1"/> 10 <ArrowRight size={12} className="mx-1"/> 15</div>
                       </div>
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-8 text-xs font-bold">N:</span>
                           <div className="text-sky-700 font-bold bg-sky-100 px-2 py-0.5 rounded text-xs">3</div>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-sky-200/50 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold w-8">Out:</span> 
                          <div className="flex items-center text-sky-700 font-bold bg-sky-100 px-2 py-1 rounded border border-sky-200 text-xs">30</div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1">Sum of all nodes: 5 + 10 + 15 = 30.</p>
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
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Theory: The Delay Window</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8 pt-4">
          <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl border border-slate-800">
              <div className="absolute -right-4 -top-4 opacity-10"><FastForward size={120}/></div>
              <h3 className="font-black text-emerald-400 uppercase tracking-widest text-sm mb-4 flex items-center gap-2">Two Pointers Method</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  We create a spatial "delay window" between two pointers, exactly <code>n</code> nodes wide.
              </p>
              <ul className="text-[11px] text-slate-300 list-disc pl-4 space-y-2 mb-4">
                  <li>Move <code>ref_ptr</code> forward by <code>n</code> steps.</li>
                  <li>Move both <code>ref_ptr</code> and <code>main_ptr</code> forward together.</li>
                  <li>When <code>ref_ptr</code> hits the end (null), <code>main_ptr</code> is guaranteed to be <code>n</code> steps from the end!</li>
              </ul>
              <div className="bg-black/50 p-4 rounded-xl border border-white/10 font-mono text-xs text-emerald-300">
                  // main_ptr is now exactly at Length - n
              </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl relative overflow-hidden shadow-sm border border-slate-200">
              <div className="absolute -right-4 -bottom-4 opacity-5"><Layers size={120}/></div>
              <h3 className="font-black text-fuchsia-600 uppercase tracking-widest text-sm mb-4 flex items-center gap-2">Stack Method (LIFO)</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  If you need to process items from the end to the start, a Stack is the universally correct Data Structure choice.
              </p>
              <ul className="text-[11px] text-slate-600 list-disc pl-4 space-y-2 mb-4">
                  <li>Traverse the entire list once, pushing every node to the Stack.</li>
                  <li>The top of the stack is now the last node.</li>
                  <li>Pop exactly <code>n</code> times, accumulating the sum.</li>
              </ul>
              <div className="bg-white p-4 rounded-xl border shadow-sm font-mono text-xs text-fuchsia-700">
                  sum += stack.pop().data;
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
               "This problem is a subtle variation of 'Find the Nth node from the End'. Demonstrating the Fast/Slow sliding window method proves you know how to operate strictly within O(1) space constraints."
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
               <div className="p-5 rounded-2xl border bg-emerald-900/40 border-emerald-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1">Two Pointers (Optimal)</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(L) <br/><strong>Space:</strong> O(1)</div>
                    <p className="text-[10px] text-emerald-200/70 leading-relaxed mt-2">Zero extra allocations. Traverses exactly L + N nodes across two pointers. Safest for large data structures in enterprise code.</p>
               </div>
               <div className="p-5 rounded-2xl border bg-amber-900/40 border-amber-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-amber-400 mb-1">Stack (Alternative)</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(L) <br/><strong>Space:</strong> O(L)</div>
                    <p className="text-[10px] text-amber-200/70 leading-relaxed mt-2">Pushes L references into heap memory. Extremely clean code, but poor space efficiency when L is millions of nodes.</p>
               </div>
           </div>
       </div>

       <div className="grid grid-cols-1 gap-6 mt-8">
           <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
               <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <Activity size={14} className="text-rose-500"/> Core Edge Cases
               </h4>
               <ul className="space-y-3 text-sm text-slate-600 leading-relaxed list-disc pl-5">
                   <li><strong>n = 0:</strong> Return 0 immediately. Avoid doing work if not needed.</li>
                   <li><strong>n &gt; Length of List:</strong> Return 0 or handle bounds. The Two Pointers approach naturally catches this when <code>ref_ptr == null</code> during the initial setup loop.</li>
               </ul>
           </div>
       </div>
    </div>
);

// Advanced Coordinate Math for 2D Memory Grid
const generateNode = (val: number, id: number, nextId: number | null, index: number): ListNodeData => {
    // 4 columns, spaced out grid
    const col = index % 4;
    const row = Math.floor(index / 4);
    
    const x = 60 + col * 200; 
    const y = 80 + row * 140 + (col % 2 === 1 ? 40 : 0); 

    return {
        id: id,
        val: val,
        addr: '0x' + (100 + (id * 32)).toString(16).toUpperCase().padStart(3, '0'),
        nextId: nextId,
        x, y
    };
};

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

export default function SumOfLastNNodesViz() {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'overview' | 'theory' | 'interview'>('visualizer');
  const [selectedOpId, setSelectedOpId] = useState<keyof typeof OPERATIONS>('sumTwoPointers');
  
  const [inputList, setInputList] = useState('10, 20, 30, 40, 50');
  const [inputN, setInputN] = useState('3');
  
  const [baseList, setBaseList] = useState<ListNodeData[]>([]);
  
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
      const v1 = inputList.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)).slice(0, 10);
      const n1 = v1.length ? v1.map((v, i) => generateNode(v, i, i < v1.length - 1 ? i + 1 : null, i)) : [];
      setBaseList(n1);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
  }, [inputList]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    if (baseList.length === 0) return steps;

    let list = baseList.map(n => ({...n}));
    let h1: number | null = list[0].id;
    let targetN = parseInt(inputN);
    if(isNaN(targetN)) targetN = 0;

    const addStep = (phase: string, desc: string, line: number, stateProps: any) => {
      steps.push({
        phase, description: desc, line, 
        state: { 
            list: getLogicalList(list.map(n=>({...n})), h1), 
            ...stateProps 
        }
      });
    };

    if (selectedOpId === 'sumTwoPointers') {
        let mainIdx: number | null = h1;
        let refIdx: number | null = h1;
        let sum = 0;
        
        addStep("Method Call", `sumOfLastN(head, n=${targetN}) called.`, 1, { mainIdx, refIdx, sum, summedNodes: [] });
        addStep("Edge Cases", `if (n <= 0 || head == null)`, 2, { mainIdx, refIdx, sum, summedNodes: [] });

        if (targetN <= 0) {
             addStep("Zero Return", `n is 0 or less. Return 0.`, 2, { mainIdx, refIdx, sum, summedNodes: [], isSuccess: true });
             return steps;
        }

        addStep("Initialize Pointers", `Node main_ptr = head; Node ref_ptr = head;`, 4, { mainIdx, refIdx, sum, summedNodes: [] });

        // Move ref_ptr 'n' steps
        for (let i = 0; i < targetN; i++) {
            addStep("Phase 1: Delay Loop", `i = ${i} < n (${targetN})`, 8, { mainIdx, refIdx, sum, summedNodes: [] });
            
            addStep("Bounds Check", `if (ref_ptr == null)`, 9, { mainIdx, refIdx, sum, summedNodes: [] });
            if (refIdx === null) {
                addStep("Out of Bounds", `n is larger than list length! Return 0.`, 9, { mainIdx, refIdx, sum, summedNodes: [], isSuccess: true });
                return steps;
            }
            
            let nextRef = list.find(node => node.id === refIdx)?.nextId ?? null;
            addStep("Advance ref_ptr", `ref_ptr = ref_ptr.next;`, 10, { mainIdx, refIdx: nextRef, sum, summedNodes: [] });
            refIdx = nextRef;
        }
        
        addStep("Phase 1 Complete", `ref_ptr is exactly ${targetN} nodes ahead of main_ptr.`, 8, { mainIdx, refIdx, sum, summedNodes: [] });

        // Slide the window
        while (refIdx !== null) {
            addStep("Phase 2: Slide Window", `while (ref_ptr != null)`, 14, { mainIdx, refIdx, sum, summedNodes: [] });
            
            let nextMain = list.find(node => node.id === mainIdx)?.nextId ?? null;
            let nextRef = list.find(node => node.id === refIdx)?.nextId ?? null;
            
            addStep("Advance Both Pointers", `main_ptr = main_ptr.next; ref_ptr = ref_ptr.next;`, 15, { mainIdx: nextMain, refIdx: nextRef, sum, summedNodes: [] });
            mainIdx = nextMain;
            refIdx = nextRef;
        }

        addStep("Phase 2 Complete", `ref_ptr is null. main_ptr is situated at the start of the last ${targetN} nodes!`, 14, { mainIdx, refIdx, sum, summedNodes: [] });

        // Sum the rest
        addStep("Initialize Sum", `int sum = 0;`, 20, { mainIdx, refIdx, sum, summedNodes: [] });
        
        let summedNodes: number[] = [];
        while (mainIdx !== null) {
            addStep("Phase 3: Summation", `while (main_ptr != null)`, 21, { mainIdx, refIdx, sum, summedNodes: [...summedNodes] });
            
            let val = list.find(node => node.id === mainIdx)?.val ?? 0;
            sum += val;
            summedNodes.push(mainIdx);
            
            addStep("Add to Sum", `sum += ${val} => ${sum}.`, 22, { mainIdx, refIdx, sum, summedNodes: [...summedNodes], activeNode: mainIdx });
            
            let nextMain = list.find(node => node.id === mainIdx)?.nextId ?? null;
            addStep("Advance main_ptr", `main_ptr = main_ptr.next;`, 23, { mainIdx: nextMain, refIdx, sum, summedNodes: [...summedNodes] });
            mainIdx = nextMain;
        }

        addStep("Operation Complete", `All target nodes summed. Return ${sum}.`, 26, { mainIdx, refIdx, sum, summedNodes: [...summedNodes], isSuccess: true });
    } 
    else if (selectedOpId === 'sumStack') {
        let currIdx: number | null = h1;
        let sum = 0;
        let stackData: {id: number, val: number}[] = [];
        
        addStep("Method Call", `sumOfLastN(head, n=${targetN}) called.`, 1, { currIdx, sum, stackData: [...stackData], summedNodes: [] });
        addStep("Edge Cases", `if (n <= 0 || head == null)`, 2, { currIdx, sum, stackData: [...stackData], summedNodes: [] });

        if (targetN <= 0) {
             addStep("Zero Return", `n is 0 or less. Return 0.`, 2, { currIdx, sum, stackData: [...stackData], summedNodes: [], isSuccess: true });
             return steps;
        }

        addStep("Initialize Stack", `Stack<Node> stack = new Stack<>(); Node curr = head;`, 4, { currIdx, sum, stackData: [...stackData], summedNodes: [] });

        // Push Phase
        while (currIdx !== null) {
            addStep("Phase 1: Push", `while (curr != null)`, 8, { currIdx, sum, stackData: [...stackData], summedNodes: [] });
            
            let val = list.find(node => node.id === currIdx)?.val ?? 0;
            stackData.push({id: currIdx, val});
            
            addStep("Push to Stack", `stack.push(curr) => Node(${val}).`, 9, { currIdx, sum, stackData: [...stackData], summedNodes: [] });
            
            let nextIdx = list.find(node => node.id === currIdx)?.nextId ?? null;
            addStep("Advance curr", `curr = curr.next;`, 10, { currIdx: nextIdx, sum, stackData: [...stackData], summedNodes: [] });
            currIdx = nextIdx;
        }
        
        addStep("Phase 1 Complete", `All nodes pushed into stack.`, 8, { currIdx, sum, stackData: [...stackData], summedNodes: [] });
        addStep("Initialize Sum", `int sum = 0;`, 13, { currIdx, sum, stackData: [...stackData], summedNodes: [] });

        // Pop Phase
        let summedNodes: number[] = [];
        for (let i = 0; i < targetN; i++) {
            addStep("Phase 2: Pop Loop", `i = ${i} < n (${targetN})`, 16, { currIdx, sum, stackData: [...stackData], summedNodes: [...summedNodes] });
            
            addStep("Empty Check", `if (stack.isEmpty())`, 17, { currIdx, sum, stackData: [...stackData], summedNodes: [...summedNodes] });
            if (stackData.length === 0) {
                addStep("Stack Exhausted", `Stack is empty (n > length). Break loop.`, 17, { currIdx, sum, stackData: [...stackData], summedNodes: [...summedNodes] });
                break;
            }

            let popped = stackData.pop();
            if (popped) {
                sum += popped.val;
                summedNodes.push(popped.id);
                addStep("Pop & Sum", `sum += stack.pop().data => ${sum - popped.val} + ${popped.val} = ${sum}.`, 18, { currIdx, sum, stackData: [...stackData], summedNodes: [...summedNodes], activeNode: popped.id });
            }
        }
        
        addStep("Operation Complete", `All target nodes summed. Return ${sum}.`, 21, { currIdx, sum, stackData: [...stackData], summedNodes: [...summedNodes], isSuccess: true });
    }

    if (steps.length === 0) steps.push({ phase: 'Ready', description: 'Click step to simulate.', line: 1, state: { list: baseList, summedNodes: [] } });
    return steps;
  }, [baseList, selectedOpId, inputN]);

  useEffect(() => { setCurrentStep(0); }, [selectedOpId, inputList, inputN]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleReset = () => { setCurrentStep(0); setPan({ x: 0, y: 0 }); setZoom(0.85); };

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

  const cur = trace[currentStep] || trace[0] || { state: { list: [] } };
  const state = cur.state || { list: [] };
  
  const { 
      isSuccess, mainIdx, refIdx, currIdx, sum, stackData, summedNodes, activeNode
  } = state;

  const getThemeColor = () => selectedOpId === 'sumTwoPointers' ? 'emerald' : 'amber';
  const activeTheme = getThemeColor();

  // SVG Drawing function for clean links
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

        const isSummed = summedNodes?.includes(nodeObj.id) && summedNodes?.includes(target.id);
        const strokeColor = isSummed ? '#0ea5e9' : '#94a3b8'; // sky-500 or slate-400
        const strokeWidth = isSummed ? 4 : 2;
        const strokeOpacity = 0.7;
        const marker = isSummed ? 'url(#arrowhead-sky)' : 'url(#arrowhead-default)';

        let pathD = '';
        const diffX = endX - startX;
        const diffY = endY - startY;

        if (Math.abs(diffY) > 30) {
            if (diffX < 0) {
                 pathD = `M ${startX},${startY} C ${startX + 60},${startY + 40} ${endX - 60},${endY - 40} ${endX},${endY}`;
            } else {
                 pathD = `M ${startX},${startY} C ${startX + 80},${startY + (diffY/2)} ${endX - 80},${endY - (diffY/2)} ${endX},${endY}`;
            }
        } else {
            if (diffX < 0) {
                 pathD = `M ${startX},${startY} C ${startX + 20},${startY - 60} ${endX - 20},${endY - 60} ${endX},${endY}`;
            } else if (diffX > 200) {
                 pathD = `M ${startX},${startY} C ${startX + 50},${startY + 80} ${endX - 50},${endY + 80} ${endX},${endY}`;
            } else {
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Sum Last N Nodes</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className={`font-bold text-${activeTheme}-600 bg-${activeTheme}-50 px-2 py-0.5 rounded tracking-widest uppercase transition-colors duration-500`}>Math & Sliding Window</span>
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
                        let btnColor = op.id === 'sumTwoPointers' ? 'emerald' : 'amber';
                        
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-sky-500/20 border-sky-500' : `bg-${activeTheme}-500/20 border-${activeTheme}-500`}`} style={{ top: `${((cur.line - 1) * 16.5) + 16}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedOp.code.split('\n').map((line: string, idx: number) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme={isSuccess && cur.line === idx + 1 ? 'sky' : activeTheme} />
                      ))}
                  </div>
                </div>

              </div>

              {/* Right Col: Simulation Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className={`text-[10px] font-black text-${activeTheme}-600 uppercase block pl-1 tracking-widest font-mono`}>Linked List Nodes</label>
                        <input type="text" value={inputList} onChange={(e) => { setInputList(e.target.value); setCurrentStep(0); }} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${activeTheme}-500 outline-none transition-all shadow-inner`} placeholder="10, 20, 30, 40, 50" />
                    </div>
                    <div className="w-24 space-y-1.5 shrink-0">
                        <label className={`text-[10px] font-black text-${activeTheme}-600 uppercase block pl-1 tracking-widest font-mono`}>Target N</label>
                        <input type="number" min="0" value={inputN} onChange={(e) => { setInputN(e.target.value); setCurrentStep(0); }} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${activeTheme}-500 outline-none transition-all shadow-inner`} placeholder="3" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group ${isSuccess ? `bg-sky-900 border-sky-800` : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      <Activity size={100}/>
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-sky-400" : `text-${activeTheme}-400`}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Execution Log</span>
                     </div>
                     <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-sky-500/20 text-sky-300 border-sky-500/30' : `bg-${activeTheme}-500/20 text-${activeTheme}-300 border-${activeTheme}-500/30`} border`}>Line {cur.line}</div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3 relative z-10">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line relative z-10">{cur.description}</p>
                </div>

                {/* 2D PHYSICAL MEMORY ARENA */}
                <div className="bg-slate-50 bg-[linear-gradient(to_right,#cbd5e130_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e130_1px,transparent_1px)] bg-[size:20px_20px] rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col shadow-inner overflow-hidden min-h-[460px]">
                  
                   <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 z-30 pointer-events-none">
                      <div className="flex items-center gap-4 pointer-events-auto">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-lg shadow-sm backdrop-blur border border-slate-200">
                              <Network size={14} className={activeTheme === 'emerald' ? 'text-emerald-500' : 'text-amber-500'}/> Memory Canvas
                          </span>
                      </div>
                      
                      {/* Math Trackers */}
                      <div className="flex gap-2 pointer-events-auto">
                          {sum !== undefined && (
                              <div className={`font-mono text-[14px] px-4 py-1.5 rounded-xl border font-black tracking-widest animate-in zoom-in shadow-sm ${isSuccess ? 'bg-sky-100 text-sky-700 border-sky-300' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                                  Total Sum = {sum}
                              </div>
                          )}
                      </div>
                   </div>

                   {/* Data Structures Dock */}
                   {selectedOpId === 'sumStack' && (
                       <div className="absolute bottom-6 left-6 flex gap-4 z-20 pointer-events-none">
                           <div className={`bg-slate-900 border border-slate-700 rounded-2xl p-4 w-28 flex flex-col items-center shadow-2xl pointer-events-auto animate-in slide-in-from-bottom-8`}>
                               <span className={`text-[10px] font-black uppercase text-amber-400 tracking-widest mb-3 font-mono flex items-center gap-2`}><Layers size={14}/> Stack</span>
                               <div className={`flex flex-col-reverse gap-1.5 justify-end h-32 w-full border-b-2 border-amber-500/50 pb-2 overflow-y-auto scrollbar-thin`}>
                                   {stackData && stackData.map((obj:any, i:number) => (
                                       <div key={i} className={`bg-amber-900/50 border border-amber-600 text-amber-300 text-xs font-black font-mono py-1 text-center rounded-lg animate-in zoom-in duration-300`}>{obj.val}</div>
                                   ))}
                               </div>
                           </div>
                       </div>
                   )}

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
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                                   </marker>
                                   <marker id="arrowhead-sky" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#0ea5e9" />
                                   </marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>

                           {/* HTML Layer for Node Blocks & Labels */}
                           {state.list && state.list.length === 0 && (
                                <div className="absolute font-mono text-slate-400 font-bold italic" style={{ left: 100, top: 100 }}>
                                    List is empty (null)
                                </div>
                           )}

                           {state.list && state.list.map((nodeObj: ListNodeData, idx: number) => {
                              const isMain = mainIdx === nodeObj.id;
                              const isRef = refIdx === nodeObj.id;
                              const isCurr = currIdx === nodeObj.id;
                              
                              const isTarget = isMain || isRef || isCurr || activeNode === nodeObj.id;
                              const isSummed = summedNodes?.includes(nodeObj.id);

                              let themeColor = 'slate';
                              if (isSummed) themeColor = 'sky';

                              const labels = [];
                              if (idx === 0 && selectedOpId === 'sumTwoPointers') labels.push({ text: "head", color: "slate", position: "top" });
                              if (idx === 0 && selectedOpId === 'sumStack') labels.push({ text: "head", color: "slate", position: "top" });

                              if (isMain) labels.push({ text: "main_ptr", color: "sky", position: "top" });
                              if (isRef) labels.push({ text: "ref_ptr", color: "emerald", position: "bottom" });
                              if (isCurr) labels.push({ text: "curr", color: "amber", position: "top" });

                              return (
                                  <div key={nodeObj.id} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      
                                      {/* Top Labels */}
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center z-20">
                                          {labels.filter(l => l.position === 'top').map((l, i) => (
                                              <PointerLabel key={i} label={l.text} color={l.color} position="top" active={true} offset={(isMain && idx === 0) ? -32 : 0} />
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
                                          nextAddr={nodeObj.nextId ? (state.list.find((n:any)=>n.id===nodeObj.nextId)?.addr ?? 'null') : 'null'} 
                                          isTarget={isTarget} 
                                          isSummed={isSummed}
                                          themeColor={themeColor as any}
                                      />

                                      {/* Null indicator embedded below if pointer is null */}
                                      {nodeObj.nextId === null && (
                                          <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-sm font-black font-mono text-slate-400">null</div>
                                      )}
                                  </div>
                              )
                          })}
                          
                          {/* Trailing Null Labels */}
                          {state.list.length > 0 && (
                               <div className="absolute transition-all duration-300 z-10" style={{ left: state.list[state.list.length-1].x + 220, top: state.list[state.list.length-1].y }}>
                                   {refIdx === null && selectedOpId === 'sumTwoPointers' && <PointerLabel label="ref_ptr" color="emerald" position="bottom" active={true} offset={0} />}
                                   {currIdx === null && selectedOpId === 'sumStack' && <PointerLabel label="curr" color="amber" position="top" active={true} offset={0} />}
                                   {mainIdx === null && selectedOpId === 'sumTwoPointers' && <PointerLabel label="main_ptr" color="sky" position="top" active={true} offset={0} />}
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

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, nextAddr, themeColor = 'slate', isTarget, isSummed }) => {
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

    const targetClasses = isTarget ? `ring-4 ring-${themeColor}-300 shadow-xl z-20 scale-110` : isSummed ? `shadow-md z-10 scale-105` : `shadow-sm z-10`;

    return (
        <div className="relative flex flex-col items-center group">
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|Node|true|false|System|out|print|println|static|sumOfLastN|Stack|push|pop|isEmpty)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['sumOfLastN', 'push', 'pop', 'isEmpty'].includes(part)) return <span key={i} className={`text-${theme}-400 font-bold`}>{part}</span>;
          if (['true', 'false', 'null', 'None'].includes(part)) return <span key={i} className="text-orange-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-emerald-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};