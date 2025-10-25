import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp, ArrowLeft,
  GitCommit, MonitorPlay, ChevronLeft, ChevronRight, 
  Network, Database, RotateCcw, ListOrdered, FastForward,
  RefreshCw, Zap, AlertCircle, Goal, Info, Layers, Repeat,
  ZoomIn, ZoomOut, Maximize, Target, Hash
} from 'lucide-react';

const OPERATIONS = {
  countFastSlow: {
    id: 'countFastSlow',
    title: 'Fast & Slow (Floyd\'s)',
    icon: <FastForward size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public int countNodesinLoop(Node head) {
    Node slow = head;
    Node fast = head;
    
    // Fast moves 2 steps, Slow moves 1 step
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        
        // If they meet, cycle detected
        if (slow == fast) {
            int count = 1;
            Node temp = slow;
            while (temp.next != slow) {
                count++;
                temp = temp.next;
            }
            return count;
        }
    }
    
    return 0; // No cycle
}`,
    desc: "Floyd's algorithm detects the cycle. Once the slow and fast pointers meet, we know they are inside the cycle. We freeze the slow pointer and use a temporary pointer to walk exactly one full loop around the cycle, counting the nodes until it reaches the slow pointer again."
  },
  countHashMap: {
    id: 'countHashMap',
    title: 'Using HashMap',
    icon: <Database size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public int countNodesinLoop(Node head) {
    HashMap<Node, Integer> visited = new HashMap<>();
    Node curr = head;
    int timer = 1;
    
    while (curr != null) {
        // If seen before, calculate length
        if (visited.containsKey(curr)) {
            return timer - visited.get(curr);
        }
        
        // Store node and its arrival time
        visited.put(curr, timer);
        curr = curr.next;
        timer++;
    }
    
    return 0; // Reached the end
}`,
    desc: "We traverse the list, mapping each memory reference to a 'timer' value (its positional index). If we encounter a node that is already in our map, the cycle's length is simply our current timer minus the timer recorded when we first visited that node."
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
  isCycleNode?: boolean;
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
      <div className="flex items-center gap-3 mb-6 text-fuchsia-600">
          <Repeat size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Length of Cycle in Linked List</h2>
      </div>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given the <code>head</code> of a singly linked list, determine the <strong>number of nodes</strong> involved in the cycle. 
          If there is no cycle present in the linked list, your algorithm must return <code>0</code>.
        </p>

        <ul className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3 font-medium text-slate-700 list-none">
            <li className="flex items-center gap-3"><Info className="text-fuchsia-500" size={18}/> <strong>Beyond Detection:</strong> This problem requires two phases. First, you must confirm a cycle actually exists. Second, you must quantify its size.</li>
            <li className="flex items-center gap-3"><Info className="text-fuchsia-500" size={18}/> <strong>What counts?</strong> Only the nodes participating in the endless loop contribute to the length. The linear "tail" leading up to the loop is ignored.</li>
        </ul>

        <div className="space-y-6 pt-4">
           <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs border-b pb-2">Examples</h4>
           
           <div className="grid md:grid-cols-2 gap-6">
               <div className="bg-rose-50/50 border border-rose-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-rose-800 uppercase tracking-widest text-[10px] items-center gap-2"><Goal size={14}/> Example 1: Loop Length 3</div>
                   <div className="space-y-3">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-12 text-xs font-bold">List:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">
                               3 <ArrowRight size={12} className="mx-1"/> 2 <ArrowRight size={12} className="mx-1"/> 0 <ArrowRight size={12} className="mx-1"/> -4
                           </div>
                       </div>
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-12 text-xs font-bold">Cycle:</span>
                           <div className="text-rose-700 font-bold bg-rose-100 px-2 py-0.5 rounded text-xs">-4 points back to 2</div>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-rose-200/50 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold w-12">Out:</span> 
                          <div className="flex items-center text-rose-700 font-bold bg-rose-100 px-2 py-1 rounded border border-rose-200 text-xs">3</div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1">The loop consists of nodes (2, 0, -4).</p>
                   </div>
               </div>

               <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-emerald-800 uppercase tracking-widest text-[10px] items-center gap-2"><Goal size={14}/> Example 2: No Cycle</div>
                   <div className="space-y-3">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-12 text-xs font-bold">List:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">
                               1 <ArrowRight size={12} className="mx-1"/> 2 <ArrowRight size={12} className="mx-1"/> null
                           </div>
                       </div>
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-12 text-xs font-bold">Cycle:</span>
                           <div className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-xs">None (-1)</div>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-emerald-200/50 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold w-12">Out:</span> 
                          <div className="flex items-center text-emerald-700 font-bold bg-emerald-100 px-2 py-1 rounded border border-emerald-200 text-xs">0</div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1">The list terminates normally.</p>
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
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Theory: Measuring the Loop</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8 pt-4">
          <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl border border-slate-800">
              <div className="absolute -right-4 -top-4 opacity-10"><FastForward size={120}/></div>
              <h3 className="font-black text-fuchsia-400 uppercase tracking-widest text-sm mb-4 flex items-center gap-2">Phase 2: The Counting Walk</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  Once Floyd's algorithm guarantees a cycle (when slow meets fast), we know both pointers are currently standing somewhere <em>inside</em> the loop.
              </p>
              <ul className="text-[11px] text-slate-300 list-disc pl-4 space-y-2 mb-4">
                  <li>Freeze the <code>slow</code> pointer in place.</li>
                  <li>Spawn a <code>temp</code> pointer at the same spot.</li>
                  <li>Advance <code>temp</code> one node at a time until it completes a full lap and reaches <code>slow</code> again.</li>
              </ul>
              <div className="bg-black/50 p-4 rounded-xl border border-white/10 font-mono text-xs text-fuchsia-300">
                  // Each step counts the nodes!
              </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl relative overflow-hidden shadow-sm border border-slate-200">
              <div className="absolute -right-4 -bottom-4 opacity-5"><Hash size={120}/></div>
              <h3 className="font-black text-emerald-600 uppercase tracking-widest text-sm mb-4 flex items-center gap-2">Timer Math (HashMap)</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  The HashMap approach solves detection and measurement simultaneously by maintaining a global <code>timer</code>. 
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  If we arrive at a node we've seen before, we know exactly when we were last here. If we are at step 8, and the map says we first visited this node at step 3, the loop must be exactly <code>8 - 3 = 5</code> nodes long!
              </p>
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
           <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-fuchsia-400 relative z-10 uppercase tracking-tight">
               <Trophy size={24} /> Interview Cheat Sheet
           </h3>
           <p className="text-sm text-slate-300 leading-relaxed italic relative z-10 mb-6">
               "This extends standard cycle detection. Interviewers want to see that once you detect the collision, you don't overcomplicate the counting phase. You don't need to find the start of the loop to count its length—any node inside the loop works as a starting line!"
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
               <div className="p-5 rounded-2xl border bg-fuchsia-900/40 border-fuchsia-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-fuchsia-400 mb-1">Fast/Slow (Optimal)</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(N) <br/><strong>Space:</strong> O(1)</div>
                    <p className="text-[10px] text-fuchsia-200/70 leading-relaxed mt-2">The gold standard. Operates cleanly with zero auxiliary allocations. Easily adapted from the boolean `hasCycle` problem.</p>
               </div>
               <div className="p-5 rounded-2xl border bg-amber-900/40 border-amber-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-amber-400 mb-1">HashMap / Math</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(N) <br/><strong>Space:</strong> O(N)</div>
                    <p className="text-[10px] text-amber-200/70 leading-relaxed mt-2">Stores memory addresses mapped to integer positions. Good to mention as a brute-force approach before writing the optimal one.</p>
               </div>
           </div>
       </div>

       <div className="grid grid-cols-1 gap-6 mt-8">
           <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
               <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <Activity size={14} className="text-rose-500"/> Core Edge Cases
               </h4>
               <ul className="space-y-3 text-sm text-slate-600 leading-relaxed list-disc pl-5">
                   <li><strong>Empty List:</strong> Check <code>head == null</code> immediately.</li>
                   <li><strong>No Cycle:</strong> The fast pointer hits null, properly returning <code>0</code>.</li>
                   <li><strong>Cycle of Length 1:</strong> Node points to itself. The inner loop correctly counts <code>1</code> step before breaking.</li>
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

function CycleLengthViz() {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'overview' | 'theory' | 'interview'>('visualizer');
  const [selectedOpId, setSelectedOpId] = useState<keyof typeof OPERATIONS>('countFastSlow');
  
  const [inputList, setInputList] = useState('3, 2, 0, -4');
  const [cycleIndex, setCycleIndex] = useState('1'); // The node index the tail points to
  
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
      const vals = inputList.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)).slice(0, 10);
      let cycIdx = parseInt(cycleIndex);
      if (isNaN(cycIdx) || cycIdx < -1 || cycIdx >= vals.length) {
          cycIdx = -1; // -1 means no cycle
      }

      const nodes = vals.map((v, i) => {
          let nextId: number | null = i + 1;
          if (i === vals.length - 1) {
              nextId = cycIdx !== -1 ? cycIdx : null;
          }
          return generateNode(v, i, nextId, i);
      });

      setBaseList(nodes);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
  }, [inputList, cycleIndex]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    if (baseList.length === 0) return steps;

    let list = baseList.map(n => ({...n}));
    let h1: number | null = list[0].id;

    const addStep = (phase: string, desc: string, line: number, stateProps: any) => {
      steps.push({
        phase, description: desc, line, 
        state: { list: list.map(n=>({...n})), ...stateProps }
      });
    };

    if (selectedOpId === 'countFastSlow') {
        let slow: number | null = h1;
        let fast: number | null = h1;
        let count = 0;
        
        addStep("Method Call", `countNodesinLoop(head) called.`, 1, { slow: null, fast: null, isSuccess: null });
        addStep("Initialize Pointers", `Node slow = head; Node fast = head;`, 2, { slow, fast, isSuccess: null });

        let cycleFound = false;

        while (true) {
            let fastNode = fast !== null ? list.find(n => n.id === fast) : null;
            let fastNextIdx = fastNode?.nextId ?? null;
            let fastNextNode = fastNextIdx !== null ? list.find(n => n.id === fastNextIdx) : null;
            
            let fastAddr = fastNode ? fastNode.addr : 'null';
            let fastNextAddr = fastNextNode ? fastNextNode.addr : 'null';
            
            addStep("Phase 1: Detect Cycle", `while (fast != null && fast.next != null)`, 6, { slow, fast, isSuccess: null });
            
            if (fast === null || fastNextIdx === null) {
                addStep("Loop Ends", `fast or fast.next reached null. No cycle exists.`, 6, { slow, fast, isSuccess: null });
                break;
            }
            
            let slowNode = list.find(n => n.id === slow);
            slow = slowNode?.nextId ?? null;
            addStep("Advance Slow", `slow = slow.next; (Moves 1 step)`, 7, { slow, fast, isSuccess: null });
            
            fast = fastNextNode?.nextId ?? null;
            addStep("Advance Fast", `fast = fast.next.next; (Moves 2 steps)`, 8, { slow, fast, isSuccess: null });

            addStep("Check Meeting Point", `if (slow == fast)`, 11, { slow, fast, isSuccess: null, checking: true });
            
            if (slow !== null && slow === fast) {
                cycleFound = true;
                addStep("Cycle Detected!", `slow and fast point to the exact same node. Proceeding to count phase.`, 11, { slow, fast, meetNode: slow, isSuccess: null });
                break;
            }
        }

        if (cycleFound) {
            let temp = slow;
            count = 1;
            addStep("Phase 2: Begin Count", `int count = 1; Node temp = slow;`, 12, { slow, fast, temp, count, meetNode: slow });

            let loopSafety = 0; // prevent visualizer crashes just in case
            while(loopSafety < 20) {
                let tempNode = list.find(n => n.id === temp);
                addStep("Check Path", `while (temp.next != slow)`, 14, { slow, fast, temp, count, meetNode: slow, checking: true });
                
                if (tempNode?.nextId === slow) {
                     addStep("Cycle Fully Traversed", `temp.next is slow! We mapped the entire loop.`, 14, { slow, fast, temp, count, meetNode: slow });
                     addStep("Return Length", `return count;`, 18, { slow, fast, temp, count, meetNode: slow, isSuccess: true, output: count });
                     return steps;
                }
                
                count++;
                temp = tempNode?.nextId ?? null;
                addStep("Count Node", `count++; temp = temp.next;`, 16, { slow, fast, temp, count, meetNode: slow });
                loopSafety++;
            }
        }
        
        addStep("No Cycle Found", `return 0;`, 22, { slow, fast, isSuccess: false, output: 0 });
    } 
    else if (selectedOpId === 'countHashMap') {
        let curr: number | null = h1;
        let visitedMap: Record<number, number> = {};
        let timer = 1;
        
        addStep("Method Call", `countNodesinLoop(head) called.`, 1, { curr: null, visitedMap: {...visitedMap}, isSuccess: null });
        addStep("Initialize Variables", `HashMap<Node, Integer> visited = new HashMap<>(); Node curr = head; int timer = 1;`, 2, { curr, visitedMap: {...visitedMap}, timer, isSuccess: null });

        while (curr !== null) {
            let currNode = list.find(n => n.id === curr);
            let addr = currNode ? currNode.addr : 'null';

            addStep("Loop Condition", `while (curr != null) -> Inspecting ${addr}`, 6, { curr, visitedMap: {...visitedMap}, timer, isSuccess: null });
            
            let isVisited = visitedMap[curr] !== undefined;
            addStep("Check HashMap", `if (visited.containsKey(curr))`, 7, { curr, visitedMap: {...visitedMap}, timer, isSuccess: null, checking: true });
            
            if (isVisited) {
                let startTimer = visitedMap[curr];
                let length = timer - startTimer;
                addStep("Cycle Detected!", `We've seen ${addr} at timer ${startTimer}! Cycle length is ${timer} - ${startTimer} = ${length}.`, 8, { curr, visitedMap: {...visitedMap}, timer, meetNode: curr, isSuccess: true, output: length });
                return steps;
            }

            visitedMap[curr] = timer;
            addStep("Store & Advance Timer", `visited.put(curr, timer);`, 11, { curr, visitedMap: {...visitedMap}, timer, isSuccess: null });
            
            curr = currNode?.nextId ?? null;
            timer++;
            addStep("Advance Pointer", `curr = curr.next; timer++;`, 12, { curr, visitedMap: {...visitedMap}, timer, isSuccess: null });
        }
        
        addStep("Loop Terminates", `curr is null. Reached the end.`, 6, { curr, visitedMap: {...visitedMap}, timer, isSuccess: null });
        addStep("No Cycle Found", `Return 0.`, 16, { curr, visitedMap: {...visitedMap}, timer, isSuccess: false, output: 0 });
    }

    return steps;
  }, [baseList, selectedOpId]);

  useEffect(() => { setCurrentStep(0); }, [selectedOpId, inputList, cycleIndex]);

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
      isSuccess, output, slow, fast, temp, count, curr, visitedMap, timer, checking, meetNode
  } = state;

  const getThemeColor = () => selectedOpId === 'countFastSlow' ? 'fuchsia' : 'sky';
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

        const isCycleLink = target.id <= nodeObj.id; // It points backwards
        
        const strokeColor = isCycleLink ? '#f43f5e' : '#94a3b8'; // rose-500 for cycle link, slate-400 for standard
        const strokeWidth = isCycleLink ? 4 : 2;
        const strokeOpacity = 0.8;
        const strokeDasharray = isCycleLink ? "6 4" : "none";
        const marker = isCycleLink ? 'url(#arrowhead-cycle)' : 'url(#arrowhead-default)';

        let pathD = '';
        const diffX = endX - startX;
        const diffY = endY - startY;

        if (isCycleLink) {
            // It's a back pointer, draw a large dramatic arc underneath the nodes
            pathD = `M ${startX},${startY} C ${startX + 40},${startY + 140} ${endX - 40},${endY + 140} ${endX},${endY}`;
        }
        else if (Math.abs(diffY) > 30) {
            if (diffX < 0) {
                 pathD = `M ${startX},${startY} C ${startX + 60},${startY + 40} ${endX - 60},${endY - 40} ${endX},${endY}`;
            } else {
                 pathD = `M ${startX},${startY} C ${startX + 80},${startY + (diffY/2)} ${endX - 80},${endY - (diffY/2)} ${endX},${endY}`;
            }
        } else {
            if (diffX > 200) {
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
                strokeDasharray={strokeDasharray}
                markerEnd={marker} 
                className={`transition-all duration-500 ease-in-out ${isCycleLink ? 'animate-pulse' : ''}`} 
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
              <Repeat size={100} />
          </div>
          <div className="flex items-center gap-5 z-10">
            <div className={`bg-${activeTheme}-600 p-4 rounded-2xl shadow-lg shadow-${activeTheme}-100 flex items-center justify-center transition-colors duration-500`}>
                <Repeat className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Cycle Length</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className={`font-bold text-${activeTheme}-600 bg-${activeTheme}-50 px-2 py-0.5 rounded tracking-widest uppercase transition-colors duration-500`}>Linked Lists</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Algorithm Viz</span>
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
                        let btnColor = op.id === 'countFastSlow' ? 'fuchsia' : 'sky';
                        
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess !== null ? (isSuccess ? 'bg-rose-500/20 border-rose-500' : 'bg-emerald-500/20 border-emerald-500') : `bg-${activeTheme}-500/20 border-${activeTheme}-500`}`} style={{ top: `${((cur.line - 1) * 16.5) + 16}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedOp.code.split('\n').map((line: string, idx: number) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme={isSuccess !== null && cur.line === idx + 1 ? (isSuccess ? 'rose' : 'emerald') : activeTheme} />
                      ))}
                  </div>
                </div>

              </div>

              {/* Right Col: Simulation Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className={`text-[10px] font-black text-${activeTheme}-600 uppercase block pl-1 tracking-widest font-mono`}>Nodes Data</label>
                        <input type="text" value={inputList} onChange={(e) => { setInputList(e.target.value); setCurrentStep(0); }} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${activeTheme}-500 outline-none transition-all shadow-inner`} placeholder="3, 2, 0, -4" />
                    </div>
                    <div className="w-24 space-y-1.5 shrink-0">
                        <label className={`text-[10px] font-black text-${activeTheme}-600 uppercase block pl-1 tracking-widest font-mono`}>Cycle To</label>
                        <input type="number" min="-1" value={cycleIndex} onChange={(e) => { setCycleIndex(e.target.value); setCurrentStep(0); }} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${activeTheme}-500 outline-none transition-all shadow-inner`} placeholder="1" title="0-based index to point back to. Use -1 for no cycle." />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group ${isSuccess !== null ? (isSuccess ? 'bg-rose-900 border-rose-800' : 'bg-emerald-900 border-emerald-800') : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      <Repeat size={100}/>
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess !== null ? (isSuccess ? "text-rose-400" : "text-emerald-400") : `text-${activeTheme}-400`}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Execution Log</span>
                     </div>
                     <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess !== null ? (isSuccess ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30') : `bg-${activeTheme}-500/20 text-${activeTheme}-300 border-${activeTheme}-500/30`} border`}>Line {cur.line}</div>
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
                              <Network size={14} className={activeTheme === 'fuchsia' ? 'text-fuchsia-500' : 'text-sky-500'}/> Memory Canvas
                          </span>
                      </div>
                      
                      {/* Math/Variable Trackers */}
                      <div className="flex gap-2 pointer-events-auto">
                          {selectedOpId === 'countFastSlow' && count !== undefined && (
                              <div className="bg-white/90 text-slate-700 font-mono text-[11px] px-3 py-1.5 rounded-lg font-black border border-slate-200 shadow-sm animate-in fade-in backdrop-blur">
                                  count: {count}
                              </div>
                          )}
                          {selectedOpId === 'countHashMap' && timer !== undefined && (
                              <div className="bg-white/90 text-slate-700 font-mono text-[11px] px-3 py-1.5 rounded-lg font-black border border-slate-200 shadow-sm animate-in fade-in backdrop-blur">
                                  timer: {timer}
                              </div>
                          )}
                          {output !== undefined && output !== null && (
                              <div className={`font-mono text-[14px] px-4 py-1.5 rounded-xl border font-black tracking-widest animate-in zoom-in shadow-sm flex items-center gap-2 ${output > 0 ? 'bg-rose-100 text-rose-700 border-rose-300' : 'bg-emerald-100 text-emerald-700 border-emerald-300'}`}>
                                  Returns: {output}
                              </div>
                          )}
                      </div>
                   </div>

                   {/* Data Structures Dock */}
                   {selectedOpId === 'countHashMap' && visitedMap && Object.keys(visitedMap).length > 0 && (
                       <div className="absolute bottom-6 left-6 flex gap-4 z-20 pointer-events-none">
                           <div className={`bg-slate-900 border border-slate-700 rounded-xl p-3 w-40 flex flex-col shadow-xl pointer-events-auto animate-in slide-in-from-bottom-8`}>
                               <span className={`text-[10px] font-black uppercase text-sky-400 tracking-widest mb-2 font-mono flex items-center gap-1`}><Database size={10}/> visited (Map)</span>
                               <div className={`flex flex-col-reverse gap-1 justify-end h-32 w-full border-b-2 border-sky-500/50 pb-1 overflow-y-auto scrollbar-thin`}>
                                   {Object.entries(visitedMap).map(([idStr, t], i) => (
                                       <div key={i} className={`bg-slate-800 border border-slate-600 text-slate-300 text-[9px] font-black font-mono py-1 px-2 rounded animate-in zoom-in flex justify-between`}>
                                           <span>{state.list.find((n:any)=>n.id===parseInt(idStr))?.addr}</span>
                                           <span className="text-sky-400">t:{t}</span>
                                       </div>
                                   ))}
                               </div>
                           </div>
                       </div>
                   )}

                   {/* Fixed Zoom Controls */}
                   <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-40 pointer-events-auto bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur">
                      <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                      <button onClick={resetZoom} className="p-2 text-slate-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-lg transition-colors"><Maximize size={18}/></button>
                      <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-lg transition-colors"><ZoomOut size={18}/></button>
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
                                   <marker id="arrowhead-cycle" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
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
                              const isSlow = slow === nodeObj.id;
                              const isFast = fast === nodeObj.id;
                              const isTemp = temp === nodeObj.id;
                              const isCurr = curr === nodeObj.id;
                              const isMeet = meetNode === nodeObj.id;
                              
                              const isTarget = isSlow || isFast || isCurr || isMeet || (checking && isCurr) || isTemp;
                              const isVisited = visitedMap && visitedMap[nodeObj.id] !== undefined;

                              let themeColor = 'slate';
                              if (isMeet) themeColor = 'rose';
                              else if (checking && (isCurr || isTemp)) themeColor = 'amber';
                              else if (isTemp) themeColor = 'sky';
                              else if (isSlow || isFast) themeColor = 'fuchsia';
                              else if (isCurr) themeColor = 'sky';
                              else if (isVisited) themeColor = 'indigo';

                              const labels = [];
                              if (idx === 0 && selectedOpId === 'countFastSlow') labels.push({ text: "head", color: "slate", position: "top" });
                              if (idx === 0 && selectedOpId === 'countHashMap') labels.push({ text: "head", color: "slate", position: "top" });

                              if (isSlow) labels.push({ text: "slow", color: "amber", position: "bottom" });
                              if (isFast) labels.push({ text: "fast", color: "fuchsia", position: "top" });
                              if (isTemp) labels.push({ text: "temp", color: "sky", position: "top" });
                              
                              if (isCurr) labels.push({ text: "curr", color: "sky", position: "top" });
                              if (isMeet) labels.push({ text: "Cycle Start", color: "rose", position: "bottom" });

                              return (
                                  <div key={nodeObj.id} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      
                                      {/* Top Labels */}
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center z-20">
                                          {labels.filter(l => l.position === 'top').map((l, i) => (
                                              <PointerLabel key={i} label={l.text} color={l.color} position="top" active={true} offset={(isFast && idx === 0) || (isTemp && idx === 0) ? -32 : 0} />
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
                                          themeColor={themeColor as any}
                                          isCycleNode={nodeObj.nextId !== null && nodeObj.nextId <= nodeObj.id}
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
                                   {fast === null && selectedOpId === 'countFastSlow' && <PointerLabel label="fast" color="fuchsia" position="top" active={true} offset={0} />}
                                   {curr === null && selectedOpId === 'countHashMap' && <PointerLabel label="curr" color="sky" position="top" active={true} offset={0} />}
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

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, nextAddr, themeColor = 'slate', isTarget, isCycleNode }) => {
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

    const targetClasses = isTarget ? `ring-4 ring-${themeColor}-300 shadow-xl z-20 scale-110` : `shadow-sm z-10`;

    return (
        <div className="relative flex flex-col items-center group transition-all">
            <span className="text-[10px] text-slate-400 font-mono font-bold mb-1 opacity-80">{address}</span>
            <div className={`flex items-center w-28 h-14 border-2 rounded-2xl transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative`}>
                <div className={`flex-1 flex justify-center font-mono font-black text-2xl ${activeTheme.text}`}>
                    {val}
                </div>
                <div className={`w-10 h-full border-l-2 flex flex-col items-center justify-center rounded-r-xl ${isCycleNode ? 'border-rose-400 bg-rose-100/50' : activeTheme.border} ${isCycleNode ? '' : activeTheme.next}`}>
                    <span className={`text-[7px] font-black uppercase tracking-widest opacity-60 transform -rotate-90 ${isCycleNode ? 'text-rose-600' : ''}`}>NEXT</span>
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
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|Node|true|false|System|out|print|println|static|countNodesinLoop|HashMap|put|containsKey|get)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'boolean', 'String', 'Node', 'System', 'out', 'print', 'println', 'void', 'HashMap'].includes(part)) return <span key={i} className="text-indigo-400 font-bold">{part}</span>;
          if (['countNodesinLoop', 'put', 'containsKey', 'get'].includes(part)) return <span key={i} className={`text-${theme}-400 font-bold`}>{part}</span>;
          if (['true', 'false', 'null', 'None'].includes(part)) return <span key={i} className="text-orange-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-emerald-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default CycleLengthViz;