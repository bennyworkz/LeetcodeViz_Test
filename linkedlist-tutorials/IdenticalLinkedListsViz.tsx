import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp,
  GitCommit, MonitorPlay, ChevronLeft, ChevronRight, 
  Network, Database, RotateCcw, RefreshCcw, RefreshCw,
  GitCompare, Layers, LayoutTemplate, X, CheckCircle2,
  ZoomIn, ZoomOut, Maximize, Minimize
} from 'lucide-react';

// Component interfaces
interface PointerLabelProps {
  label: string;
  color: string;
  position: string;
  active?: boolean;
  offset?: number;
  strikethrough?: boolean;
}

interface ListNodeBlockProps {
  val: number;
  address: string;
  nextAddr: string;
  themeColor?: string;
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

const OPERATIONS = {
  checkIterative: {
    id: 'checkIterative',
    title: 'Iterative Approach',
    icon: <RefreshCcw size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public boolean areIdentical(Node head1, Node head2) {
    Node curr1 = head1;
    Node curr2 = head2;
    
    // Traverse both lists simultaneously
    while (curr1 != null && curr2 != null) {
        // If data differs, lists are not identical
        if (curr1.data != curr2.data) {
            return false;
        }
        // Advance both pointers
        curr1 = curr1.next;
        curr2 = curr2.next;
    }
    
    // Both must be null for lists to be identical (same length)
    return (curr1 == null && curr2 == null);
}`,
    desc: "Traverses both linked lists simultaneously. If we find any mismatch in data, we immediately return false. After the loop, we ensure both lists reached the end at the exact same time to confirm they have the same length."
  },
  checkRecursive: {
    id: 'checkRecursive',
    title: 'Recursive Approach',
    icon: <RefreshCw size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public boolean areIdentical(Node head1, Node head2) {
    // Both lists reached the end simultaneously
    if (head1 == null && head2 == null) return true;
    
    // One list ended before the other
    if (head1 == null || head2 == null) return false;
    
    // Data mismatch at current nodes
    if (head1.data != head2.data) return false;
    
    // Recursively check the rest of the nodes
    return areIdentical(head1.next, head2.next);
}`,
    desc: "A highly elegant solution. We check the base cases first (both null, one null, or data mismatch). If all checks pass, we recursively ask: 'Are the remaining portions of these lists identical?'"
  }
};

const OverviewTab = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6 text-sky-600">
          <GitCompare size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Identical Linked Lists</h2>
      </div>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given two singly linked lists, the task is to determine if they are identical. Two linked lists are considered identical if they meet three strict criteria:
        </p>
        
        <ul className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3 font-medium text-slate-700 list-none">
            <li className="flex items-center gap-3"><CheckCircle2 className="text-emerald-500" size={18}/> They must contain the exact same data values.</li>
            <li className="flex items-center gap-3"><CheckCircle2 className="text-emerald-500" size={18}/> The values must appear in the exact same sequence.</li>
            <li className="flex items-center gap-3"><CheckCircle2 className="text-emerald-500" size={18}/> They must have the exact same length.</li>
        </ul>

        <div className="space-y-6 pt-4">
           <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs border-b pb-2">Examples</h4>
           
           <div className="grid md:grid-cols-2 gap-6">
               <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-emerald-800 uppercase tracking-widest text-[10px] items-center gap-2"><Check size={14}/> Example 1: Match</div>
                   <div className="space-y-2">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-10 text-xs font-bold">L1:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">1 <ArrowRight size={12} className="mx-1"/> 2 <ArrowRight size={12} className="mx-1"/> 3</div>
                       </div>
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-10 text-xs font-bold">L2:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">1 <ArrowRight size={12} className="mx-1"/> 2 <ArrowRight size={12} className="mx-1"/> 3</div>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-emerald-200/50 flex items-center gap-2">
                      <span className="text-slate-400 text-xs font-bold w-10">Out:</span> <span className="text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded">true</span>
                   </div>
               </div>

               <div className="bg-rose-50/50 border border-rose-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-rose-800 uppercase tracking-widest text-[10px] items-center gap-2"><X size={14}/> Example 2: Length Mismatch</div>
                   <div className="space-y-2">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-10 text-xs font-bold">L1:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">1 <ArrowRight size={12} className="mx-1"/> 2 <ArrowRight size={12} className="mx-1"/> 3</div>
                       </div>
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-10 text-xs font-bold">L2:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">1 <ArrowRight size={12} className="mx-1"/> 2</div>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-rose-200/50 flex items-center gap-2">
                      <span className="text-slate-400 text-xs font-bold w-10">Out:</span> <span className="text-rose-600 font-bold bg-rose-100 px-2 py-0.5 rounded">false</span>
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
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Theory: Structural vs. Referential Equality</h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl border border-slate-800">
              <div className="absolute -right-4 -top-4 opacity-10"><Code2 size={120}/></div>
              <h3 className="font-black text-fuchsia-400 uppercase tracking-widest text-sm mb-4">Referential Equality (==)</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  Using the <code>==</code> operator on two objects (like Nodes) checks if they point to the <strong>exact same memory address</strong>.
              </p>
              <div className="bg-black/50 p-4 rounded-xl border border-white/10 font-mono text-xs text-rose-300">
                  Node a = new Node(5);<br/>
                  Node b = new Node(5);<br/>
                  System.out.print(a == b); // false!
              </div>
              <p className="text-[11px] text-slate-400 mt-4 italic">Even though their data is the same, they live in different houses in RAM.</p>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl relative overflow-hidden shadow-sm border border-slate-200">
              <div className="absolute -right-4 -bottom-4 opacity-5"><LayoutTemplate size={120}/></div>
              <h3 className="font-black text-emerald-600 uppercase tracking-widest text-sm mb-4">Structural Equality (.data)</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  For "Identical Linked Lists", we are looking for structural equality. We must manually inspect the <strong>contents</strong> of the memory addresses, step-by-step.
              </p>
              <div className="bg-white p-4 rounded-xl border shadow-sm font-mono text-xs text-emerald-700">
                  Node a = new Node(5);<br/>
                  Node b = new Node(5);<br/>
                  System.out.print(a.data == b.data); // true!
              </div>
              <p className="text-[11px] text-slate-500 mt-4 italic">We must write a loop or recursive function to check every single node's data field across the entire chain.</p>
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
               "Comparing two linked lists is a foundational traversal problem. It tests your ability to handle multiple pointers simultaneously and clearly define exit conditions (lengths matching vs mismatching)."
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
               <div className="p-5 rounded-2xl border bg-emerald-900/40 border-emerald-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1">Iterative (Optimal)</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(Min(N, M)) <br/><strong>Space:</strong> O(1)</div>
                    <p className="text-[10px] text-emerald-200/70 leading-relaxed mt-2">Traverses both lists with two pointers. Returns instantly on mismatch. Uses zero extra memory. Highly preferred.</p>
               </div>
               <div className="p-5 rounded-2xl border bg-fuchsia-900/40 border-fuchsia-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-fuchsia-400 mb-1">Recursive</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(Min(N, M)) <br/><strong>Space:</strong> O(Min(N, M)) Aux</div>
                    <p className="text-[10px] text-fuchsia-200/70 leading-relaxed mt-2">Clean code, but pushes frames onto the call stack. Risks StackOverflow if comparing lists with millions of identical nodes.</p>
               </div>
           </div>
       </div>

       <div className="grid grid-cols-1 gap-6 mt-8">
           <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
               <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <Activity size={14} className="text-sky-500"/> Core Edge Cases to Mention
               </h4>
               <ul className="space-y-3 text-sm text-slate-600 leading-relaxed list-disc pl-5">
                   <li><strong>Both lists are empty (null):</strong> Should return <code>true</code>.</li>
                   <li><strong>Different lengths:</strong> Loop exits when one pointer hits null. The final check <code>curr1 == null && curr2 == null</code> safely catches this.</li>
                   <li><strong>Values differ at the head:</strong> Should exit immediately (O(1) time execution).</li>
               </ul>
           </div>
       </div>
    </div>
);

// Advanced Coordinate Math for 2D Memory Grid
const generateNode = (val, index, listNum, isLast) => ({
    id: `l${listNum}-${index}`,
    val: val,
    addr: listNum === 1
        ? '0x' + (100 + (index * 32)).toString(16).toUpperCase().padStart(3, '0')
        : '0x' + (200 + (index * 32)).toString(16).toUpperCase().padStart(3, '0'),
    nextId: isLast ? null : `l${listNum}-${index + 1}`,
    x: 100 + index * 220, // Spread horizontally
    y: listNum === 1 ? 80 : 260 // L1 on top row, L2 on bottom row
});

const IdenticalLinkedListsViz = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('checkIterative');
  const [inputL1, setInputL1] = useState('10, 20, 30');
  const [inputL2, setInputL2] = useState('10, 20, 30');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  // Pan and Zoom State for Infinite Canvas
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const selectedOp = OPERATIONS[selectedOpId];

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  // Trackpad Zoom Logic
  useEffect(() => {
    const handleWheel = (e) => {
        if (!isFullscreen) return;
        e.preventDefault();
        const delta = -e.deltaY * 0.005;
        setZoom(prev => {
            const next = prev + delta;
            return Math.min(Math.max(next, 0.3), 3);
        });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isFullscreen]);

  // Parse inputs to Base States
  const l1Nodes = useMemo(() => {
      const vals = inputL1.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      return vals.map((v, i) => generateNode(v, i, 1, i === vals.length - 1));
  }, [inputL1]);
  
  const l2Nodes = useMemo(() => {
      const vals = inputL2.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      return vals.map((v, i) => generateNode(v, i, 2, i === vals.length - 1));
  }, [inputL2]);

  const trace = useMemo(() => {
    const steps = [];
    
    const addStep = (phase, desc, line, stateProps) => {
      steps.push({
        phase, description: desc, line, 
        state: { l1: l1Nodes, l2: l2Nodes, ...stateProps }
      });
    };

    if (selectedOpId === 'checkIterative') {
        let c1 = l1Nodes.length > 0 ? 0 : null;
        let c2 = l2Nodes.length > 0 ? 0 : null;
        
        addStep("Method Call", `areIdentical(head1, head2) called.`, 1, { c1, c2, result: null });
        addStep("Initialize Pointers", `Node curr1 = head1; Node curr2 = head2;`, 3, { c1, c2, result: null });

        while (c1 !== null && c2 !== null) {
            let n1 = l1Nodes[c1];
            let n2 = l2Nodes[c2];
            
            addStep("Loop Condition", `curr1 (${n1.addr}) != null && curr2 (${n2.addr}) != null. Enter loop.`, 6, { c1, c2, result: null });
            
            addStep("Compare Data", `if (${n1.val} != ${n2.val})`, 8, { c1, c2, result: null, comparing: true });
            
            if (n1.val !== n2.val) {
                addStep("Mismatch Found", `Data differs! Returning false immediately.`, 9, { c1, c2, result: false, isError: true });
                return steps;
            }
            
            addStep("Advance Pointers", `Match! curr1 = curr1.next; curr2 = curr2.next;`, 12, { c1, c2, result: null });
            c1 = c1 + 1 < l1Nodes.length ? c1 + 1 : null;
            c2 = c2 + 1 < l2Nodes.length ? c2 + 1 : null;
        }

        addStep("Loop Terminates", `One or both pointers reached null. Loop ends.`, 6, { c1, c2, result: null });
        
        let sameLength = (c1 === null && c2 === null);
        addStep("Length Check", `return (curr1 == null && curr2 == null) => (${c1 === null} && ${c2 === null}) => ${sameLength}.`, 16, { 
            c1, c2, result: sameLength, isSuccess: sameLength, isError: !sameLength 
        });
    } 
    else if (selectedOpId === 'checkRecursive') {
        let callStack = [];
        
        const recurse = (c1, c2, depth) => {
            callStack.push({ c1, c2, depth });
            let n1 = c1 !== null ? l1Nodes[c1] : null;
            let n2 = c2 !== null ? l2Nodes[c2] : null;
            let v1 = n1 ? n1.addr : 'null';
            let v2 = n2 ? n2.addr : 'null';
            
            addStep("Method Call", `areIdentical(${v1}, ${v2}) pushed to Stack (Depth: ${depth}).`, 1, { c1, c2, callStack: [...callStack], result: null });
            
            addStep("Base Case 1", `if (head1 == null && head2 == null)`, 3, { c1, c2, callStack: [...callStack], result: null });
            if (c1 === null && c2 === null) {
                addStep("Both Null", `Both ended simultaneously. Returning true.`, 3, { c1, c2, callStack: [...callStack], result: true, isSuccess: true });
                callStack.pop();
                return true;
            }
            
            addStep("Base Case 2", `if (head1 == null || head2 == null)`, 6, { c1, c2, callStack: [...callStack], result: null });
            if (c1 === null || c2 === null) {
                addStep("Length Mismatch", `One is null but the other isn't. Returning false.`, 6, { c1, c2, callStack: [...callStack], result: false, isError: true });
                callStack.pop();
                return false;
            }
            
            addStep("Data Compare", `if (${n1.val} != ${n2.val})`, 9, { c1, c2, callStack: [...callStack], result: null, comparing: true });
            if (n1.val !== n2.val) {
                addStep("Mismatch Found", `Data differs! Returning false.`, 9, { c1, c2, callStack: [...callStack], result: false, isError: true });
                callStack.pop();
                return false;
            }
            
            addStep("Recursive Call", `return areIdentical(head1.next, head2.next). Pausing Depth ${depth}...`, 12, { c1, c2, callStack: [...callStack], result: null });
            
            let next1 = c1 + 1 < l1Nodes.length ? c1 + 1 : null;
            let next2 = c2 + 1 < l2Nodes.length ? c2 + 1 : null;
            let res = recurse(next1, next2, depth + 1);
            
            addStep("Return Value", `Resuming Depth ${depth}. Returning ${res} up the stack.`, 12, { c1, c2, callStack: [...callStack], result: res, isSuccess: res, isError: !res });
            callStack.pop();
            return res;
        };

        let finalRes = recurse(l1Nodes.length > 0 ? 0 : null, l2Nodes.length > 0 ? 0 : null, 1);
        addStep("Execution Complete", `All stack frames popped. Final Result: ${finalRes}.`, 12, { callStack: [], result: finalRes, isSuccess: finalRes, isError: !finalRes });
    }

    if (steps.length === 0) steps.push({ phase: 'Ready', description: 'Click step to simulate.', line: 1, state: { l1: l1Nodes, l2: l2Nodes } });
    return steps;
  }, [l1Nodes, l2Nodes, selectedOpId]);

  useEffect(() => { 
      setCurrentStep(0); 
      setPan({ x: 0, y: 0 });
      setZoom(1);
  }, [selectedOpId, inputL1, inputL2]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleReset = () => { 
      setCurrentStep(0); 
      setPan({ x: 0, y: 0 });
      setZoom(1);
  };

  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedOp.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  // Pan & Zoom Event Handlers
  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handlePointerUp = () => setIsDragging(false);

  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 2));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));
  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const cur = trace[currentStep] || trace[0] || { state: { l1: l1Nodes, l2: l2Nodes } };
  const state = cur.state || { l1: l1Nodes, l2: l2Nodes };
  
  const { 
      isSuccess, isError, c1, c2, result, callStack, comparing
  } = state;

  const getThemeColor = () => selectedOpId === 'checkIterative' ? 'sky' : 'fuchsia';
  const activeTheme = getThemeColor();

  // Draw pure SVG lines to connect nodes
  const renderSvgArrows = () => {
    const allNodes = [...(state.l1 || []), ...(state.l2 || [])];
    return allNodes.map((node) => {
        if (!node.nextId) return null;
        
        const target = allNodes.find((n) => n.id === node.nextId);
        if (!target) return null;

        // Start from NEXT box (Node width: 112px. Center of rightmost part approx ~92px).
        const startX = node.x + 92; 
        const startY = node.y + 28; // height is 56 (h-14)

        // End at left middle of the target Node
        const endX = target.x - 6;
        const endY = target.y + 28;

        const strokeColor = '#94a3b8'; // slate-400
        const strokeWidth = 2;
        const marker = 'url(#arrowhead-default)';

        // Direct adjacent line
        const pathD = `M ${startX},${startY} C ${startX + 40},${startY} ${endX - 40},${endY} ${endX},${endY}`;

        return (
            <path 
                key={`link-${node.id}-${target.id}`}
                d={pathD} 
                fill="none" 
                stroke={strokeColor} 
                strokeWidth={strokeWidth} 
                markerEnd={marker} 
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
              <GitCompare size={100} />
          </div>
          <div className="flex items-center gap-5 z-10">
            <div className={`bg-${activeTheme}-600 p-4 rounded-2xl shadow-lg shadow-${activeTheme}-100 flex items-center justify-center transition-colors duration-500`}>
                <GitCompare className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Identical Linked Lists</h1>
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
                        let btnColor = op.id === 'checkIterative' ? 'sky' : 'fuchsia';
                        
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

                <div className="bg-[#0f172a] rounded-3xl h-[400px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isError ? 'bg-rose-500/20 border-rose-500' : isSuccess ? 'bg-emerald-500/20 border-emerald-500' : comparing ? 'bg-amber-500/20 border-amber-500' : `bg-${activeTheme}-500/20 border-${activeTheme}-500`}`} style={{ top: `${((cur.line - 1) * 18) + 16}px`, height: '18px' }} />
                      )}
                      
                      {selectedOp.code.split('\n').map((line: string, idx: number) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme={isError && cur.line === idx + 1 ? 'rose' : isSuccess && cur.line === idx + 1 ? 'emerald' : comparing && cur.line === idx + 1 ? 'amber' : activeTheme} />
                      ))}
                  </div>
                </div>

              </div>

              {/* Right Col: Simulation Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className={`text-[10px] font-black text-${activeTheme}-600 uppercase block pl-1 tracking-widest font-mono`}>List 1 Nodes</label>
                        <input type="text" value={inputL1} onChange={(e) => setInputL1(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${activeTheme}-500 outline-none transition-all shadow-inner`} placeholder="10, 20, 30" />
                    </div>
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className={`text-[10px] font-black text-${activeTheme}-600 uppercase block pl-1 tracking-widest font-mono`}>List 2 Nodes</label>
                        <input type="text" value={inputL2} onChange={(e) => setInputL2(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${activeTheme}-500 outline-none transition-all shadow-inner`} placeholder="10, 20, 30" />
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                      <button onClick={handleReset} title="Reset Tracker" className="px-5 py-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm">
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group shrink-0 ${isError ? 'bg-rose-900 border-rose-800' : isSuccess ? `bg-emerald-900 border-emerald-800` : comparing ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      <Activity size={100}/>
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isError ? "text-rose-400" : isSuccess ? "text-emerald-400" : comparing ? "text-amber-400" : `text-${activeTheme}-400`}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Execution Log</span>
                     </div>
                     <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isError ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : isSuccess ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : comparing ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : `bg-${activeTheme}-500/20 text-${activeTheme}-300 border-${activeTheme}-500/30`} border`}>Line {cur.line}</div>
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
                      
                      {result !== null && result !== undefined && (
                          <div className={`font-mono text-[14px] px-5 py-2 rounded-xl border shadow-lg font-black tracking-widest animate-in zoom-in flex items-center gap-2 ${result ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-rose-600 text-white border-rose-700'}`}>
                              Result: {result ? 'true' : 'false'} {result ? <CheckCircle2 size={18}/> : <X size={18}/>}
                          </div>
                      )}
                   </div>

                   {/* Recursive Call Stack UI */}
                   <div className="absolute bottom-6 left-6 flex gap-4 pointer-events-none z-40">
                       {callStack && callStack.length > 0 && (
                            <div className={`bg-slate-900 text-${activeTheme}-400 font-mono text-[10px] p-4 rounded-2xl border border-slate-700 w-64 shadow-2xl animate-in slide-in-from-bottom-4 pointer-events-auto`}>
                                <div className="text-slate-500 mb-3 border-b border-slate-700 pb-2 flex items-center justify-between">
                                   <span className="uppercase tracking-widest text-[9px] font-black">JVM Call Stack</span>
                                   <Layers size={14}/>
                                </div>
                                <div className="flex flex-col-reverse gap-1.5 mt-2 max-h-[140px] overflow-y-auto scrollbar-thin">
                                    {callStack.map((frame, i) => {
                                        let v1 = frame.c1 !== null ? state.l1[frame.c1]?.addr : 'null';
                                        let v2 = frame.c2 !== null ? state.l2[frame.c2]?.addr : 'null';
                                        return (
                                            <div key={i} className={`p-2 rounded-lg flex justify-between items-center transition-all ${i === callStack.length - 1 ? `bg-${activeTheme}-900/50 border border-${activeTheme}-500/30 text-${activeTheme}-300 shadow-md transform scale-[1.02]` : 'bg-slate-800/50 text-slate-500'}`}>
                                                <span>areIdentical({v1}, {v2})</span>
                                                <span className="opacity-50 text-[8px] ml-2">D:{frame.depth}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                       )}
                   </div>

                   {/* Fixed Zoom Controls */}
                   <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-40 pointer-events-auto bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur">
                      <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                      <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"><ZoomOut size={18}/></button>
                      <button onClick={toggleFullscreen} title="Fullscreen" className="p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"><Maximize size={18}/></button>
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
                               </defs>
                               {renderSvgArrows()}
                           </svg>

                           {/* Render List 1 (Top Row) */}
                           {state.l1 && state.l1.length === 0 && (
                                <div className="absolute font-mono text-slate-400 font-bold italic" style={{ left: 100, top: 100 }}>
                                    L1 is empty (null)
                                </div>
                           )}
                           <div className="absolute text-[10px] font-black text-slate-400 font-mono tracking-widest uppercase -rotate-90 origin-left" style={{ left: 40, top: 120 }}>List 1</div>
                           
                           {state.l1 && state.l1.map((nodeObj, idx) => {
                               const isCurr1 = c1 === idx;
                               const isErrorHighlight = isError && isCurr1;
                               const isMatchHighlight = isSuccess && isCurr1;

                               return (
                                   <div key={nodeObj.id} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                       
                                       <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center z-20">
                                           {idx === 0 && <PointerLabel label="head1" color="sky" position="top" active={true} offset={0} />}
                                       </div>

                                       <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center z-20">
                                           {isCurr1 && <PointerLabel label={selectedOpId === 'checkIterative' ? "curr1" : "h1 (local)"} color={activeTheme} position="bottom" active={true} offset={0} />}
                                       </div>

                                       <ListNodeBlock 
                                          val={nodeObj.val} 
                                          address={nodeObj.addr} 
                                          nextAddr={nodeObj.nextId ? state.l1[idx+1].addr : 'null'} 
                                          isTarget={isCurr1} 
                                          themeColor={isErrorHighlight ? 'rose' : isMatchHighlight ? 'emerald' : comparing && isCurr1 ? 'amber' : 'slate'}
                                       />
                                       
                                       {nodeObj.nextId === null && (
                                          <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-xs font-black font-mono text-slate-400">null</div>
                                       )}
                                   </div>
                               )
                           })}
                           {/* Trailing Null Pointer Label if curr reached end */}
                           {c1 === null && state.l1.length > 0 && (
                               <div className="absolute transition-all duration-300 z-10" style={{ left: state.l1[state.l1.length-1].x + 220, top: state.l1[state.l1.length-1].y }}>
                                   <PointerLabel label={selectedOpId === 'checkIterative' ? "curr1" : "h1"} color={activeTheme} position="bottom" active={true} offset={0} />
                               </div>
                           )}

                           {/* Render List 2 (Bottom Row) */}
                           {state.l2 && state.l2.length === 0 && (
                                <div className="absolute font-mono text-slate-400 font-bold italic" style={{ left: 100, top: 300 }}>
                                    L2 is empty (null)
                                </div>
                           )}
                           <div className="absolute text-[10px] font-black text-slate-400 font-mono tracking-widest uppercase -rotate-90 origin-left" style={{ left: 40, top: 320 }}>List 2</div>
                           
                           {state.l2 && state.l2.map((nodeObj, idx) => {
                               const isCurr2 = c2 === idx;
                               const isErrorHighlight = isError && isCurr2;
                               const isMatchHighlight = isSuccess && isCurr2;

                               return (
                                   <div key={nodeObj.id} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                       
                                       <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center z-20">
                                           {idx === 0 && <PointerLabel label="head2" color="sky" position="top" active={true} offset={0} />}
                                       </div>

                                       <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center z-20">
                                           {isCurr2 && <PointerLabel label={selectedOpId === 'checkIterative' ? "curr2" : "h2 (local)"} color={activeTheme} position="bottom" active={true} offset={0} />}
                                       </div>

                                       <ListNodeBlock 
                                          val={nodeObj.val} 
                                          address={nodeObj.addr} 
                                          nextAddr={nodeObj.nextId ? state.l2[idx+1].addr : 'null'} 
                                          isTarget={isCurr2} 
                                          themeColor={isErrorHighlight ? 'rose' : isMatchHighlight ? 'emerald' : comparing && isCurr2 ? 'amber' : 'slate'}
                                       />
                                       
                                       {nodeObj.nextId === null && (
                                          <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-xs font-black font-mono text-slate-400">null</div>
                                       )}
                                   </div>
                               )
                           })}
                           {/* Trailing Null Pointer Label if curr reached end */}
                           {c2 === null && state.l2.length > 0 && (
                               <div className="absolute transition-all duration-300 z-10" style={{ left: state.l2[state.l2.length-1].x + 220, top: state.l2[state.l2.length-1].y }}>
                                   <PointerLabel label={selectedOpId === 'checkIterative' ? "curr2" : "h2"} color={activeTheme} position="bottom" active={true} offset={0} />
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

      {/* --- Fullscreen Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              
              {/* LEFT SIDEBAR: Code & Logic */}
              <div className="w-[450px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110]">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800">
                      <div className="flex items-center gap-4">
                          <div className="bg-sky-600 p-2 rounded-lg text-white shadow-lg"><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">List Comparison</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all">
                          <Minimize size={20}/>
                      </button>
                  </div>

                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="sky" />
                        ))}
                    </div>

                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${isSuccess ? 'bg-sky-900/40 border-sky-800' : isError ? 'bg-rose-900/40 border-rose-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Log</span></div>
                            <span>Line {cur.line}</span>
                        </div>
                        <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-tight">{cur.phase}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-white/5 pt-3 italic font-mono relative z-10">{cur.description}</p>
                    </div>
                  </div>
              </div>

              {/* RIGHT ARENA: The Canvas */}
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  {/* Floating Tool Corner */}
                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-sky-600 rounded-xl hover:bg-sky-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-sky-600 rounded-xl hover:bg-sky-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={resetZoom} title="Reset View" className="p-3 text-slate-600 hover:text-sky-600 rounded-xl hover:bg-sky-50 transition-all"><RotateCcw size={24}/></button>
                        </div>
                  </div>

                  {/* FS Corner Next Button */}
                  {!isSuccess && !isError && (
                      <div className="absolute bottom-10 right-10 z-[110] flex gap-4 animate-in slide-in-from-bottom-10">
                          <button 
                            onClick={handlePrev} 
                            disabled={currentStep === 0}
                            className="px-12 py-6 bg-slate-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(71,85,105,0.3)] hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-500 disabled:opacity-30"
                          >
                              <ChevronLeft size={32}/> PREV STEP
                          </button>
                          <button 
                            onClick={handleNext} 
                            disabled={currentStep === trace.length - 1}
                            className="px-12 py-6 bg-sky-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(14,165,233,0.3)] hover:bg-sky-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-sky-500 disabled:opacity-30"
                          >
                              NEXT STEP <ChevronRight size={32}/>
                          </button>
                      </div>
                  )}

                  {/* Large Scale Canvas */}
                  <div 
                    className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" 
                    onPointerDown={handlePointerDown} 
                    onPointerMove={handlePointerMove} 
                    onPointerUp={handlePointerUp} 
                    onPointerLeave={handlePointerUp}
                  >
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-75" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.5})` }}>
                           
                           {/* SVG Layer for Pointer Arrows */}
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0">
                               <defs>
                                   <marker id="arrowhead-default-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" />
                                   </marker>
                                   <marker id="arrowhead-active-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                                   </marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>

                           {/* HTML Layer for Node Blocks & Labels - List 1 */}
                           {state.l1 && state.l1.map((nodeObj) => {
                               const isCurr1 = c1 === nodeObj.id;
                               const isMatchHighlight = isSuccess && isCurr1;

                               return (
                                   <div key={nodeObj.id} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                       
                                       {/* Top Labels */}
                                       <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center z-20">
                                           {isCurr1 && (
                                               <PointerLabel label={selectedOpId === 'checkIterative' ? "curr1" : "h1"} color={activeTheme} position="top" active={true} offset={0} />
                                           )}
                                       </div>

                                       {/* The Node Itself */}
                                       <div className="relative group">
                                           <span className="absolute -top-6 left-0 text-xs text-slate-400 font-mono font-bold opacity-80">{nodeObj.addr}</span>
                                           <div className={`flex items-center w-28 h-14 border-2 rounded-2xl transition-all duration-300 shadow-sm ${isCurr1 ? `ring-4 ring-${activeTheme}-300 scale-105` : ''} ${isMatchHighlight ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-slate-400'}`}>
                                               <div className={`flex-1 flex justify-center font-mono font-black text-2xl ${isMatchHighlight ? 'text-emerald-800' : 'text-slate-800'}`}>
                                                   {nodeObj.val}
                                               </div>
                                               <div className={`w-10 h-full border-l-2 flex flex-col items-center justify-center rounded-r-xl ${isMatchHighlight ? 'border-emerald-400 bg-emerald-50' : 'border-slate-400 bg-slate-50'}`}>
                                                   <span className="text-[7px] font-black uppercase tracking-widest opacity-60 transform -rotate-90">NEXT</span>
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                               )
                           })}

                           {/* HTML Layer for Node Blocks & Labels - List 2 */}
                           {state.l2 && state.l2.map((nodeObj) => {
                               const isCurr2 = c2 === nodeObj.id;
                               const isMatchHighlight = isSuccess && isCurr2;

                               return (
                                   <div key={nodeObj.id} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                       
                                       {/* Bottom Labels */}
                                       <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center z-20">
                                           {isCurr2 && (
                                               <PointerLabel label={selectedOpId === 'checkIterative' ? "curr2" : "h2"} color={activeTheme} position="bottom" active={true} offset={0} />
                                           )}
                                       </div>

                                       {/* The Node Itself */}
                                       <div className="relative group">
                                           <span className="absolute -top-6 left-0 text-xs text-slate-400 font-mono font-bold opacity-80">{nodeObj.addr}</span>
                                           <div className={`flex items-center w-28 h-14 border-2 rounded-2xl transition-all duration-300 shadow-sm ${isCurr2 ? `ring-4 ring-${activeTheme}-300 scale-105` : ''} ${isMatchHighlight ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-slate-400'}`}>
                                               <div className={`flex-1 flex justify-center font-mono font-black text-2xl ${isMatchHighlight ? 'text-emerald-800' : 'text-slate-800'}`}>
                                                   {nodeObj.val}
                                               </div>
                                               <div className={`w-10 h-full border-l-2 flex flex-col items-center justify-center rounded-r-xl ${isMatchHighlight ? 'border-emerald-400 bg-emerald-50' : 'border-slate-400 bg-slate-50'}`}>
                                                   <span className="text-[7px] font-black uppercase tracking-widest opacity-60 transform -rotate-90">NEXT</span>
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                               )
                           })}
                      </div>
                  </div>

                  {/* FS Success/Error Overlay */}
                  {(isSuccess || isError) && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 ${isSuccess ? 'border-emerald-500' : 'border-rose-500'} rounded-[4rem] p-16 shadow-[0_0_150px_${isSuccess ? 'rgba(16,185,129,0.3)' : 'rgba(225,29,72,0.3)'}] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${isSuccess ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                <div className={`w-24 h-24 ${isSuccess ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'} rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ${isSuccess ? 'ring-emerald-500/10' : 'ring-rose-500/10'}`}>
                                    <Trophy size={48}/>
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4">
                                    {isSuccess ? 'LISTS IDENTICAL' : 'LISTS DIFFERENT'}
                                </h2>
                                <p className={`${isSuccess ? 'text-emerald-400' : 'text-rose-400'} font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>
                                    {isSuccess ? 'Both lists have identical structure and values' : 'Lists differ in structure or values'}
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 ${isSuccess ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'} text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg`}>
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
      )}
    </div>
  );
};

// Sub-components
const PointerLabel: React.FC<PointerLabelProps> = ({ label, color, position, active = true, offset = 0, strikethrough = false }) => {
    const colorClasses = {
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        sky: 'bg-sky-100 text-sky-700 border-sky-200',
        amber: 'bg-amber-100 text-amber-700 border-amber-200',
        rose: 'bg-rose-100 text-rose-700 border-rose-200',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
        indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        slate: 'bg-white text-slate-500 border-slate-200'
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

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, nextAddr, themeColor = 'slate', isTarget }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', next: 'text-emerald-600 bg-emerald-100/50' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', next: 'text-amber-600 bg-amber-100/50' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', next: 'text-fuchsia-600 bg-fuchsia-100/50' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', next: 'text-rose-600 bg-rose-100/50' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', next: 'text-sky-600 bg-sky-100/50' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', next: 'text-slate-500 bg-slate-50' }
    };
    const activeTheme = themes[themeColor] || themes['slate'];

    const targetClasses = isTarget ? `ring-4 ring-${themeColor}-300 scale-110 shadow-xl z-10` : 'shadow-sm hover:shadow-md';

    return (
        <div className="relative flex flex-col items-center group">
            <span className="text-[10px] text-slate-400 font-mono font-bold mb-1 opacity-80">{address}</span>
            <div className={`flex items-center w-28 h-14 border-2 rounded-xl transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative`}>
                <div className={`flex-1 flex justify-center font-mono font-black text-xl ${activeTheme.text}`}>
                    {val}
                </div>
                <div className={`w-2/5 h-full border-l-2 flex flex-col items-center justify-center rounded-r-lg ${activeTheme.border} ${activeTheme.next}`}>
                    <span className="text-[6px] font-black uppercase tracking-widest opacity-60">NEXT</span>
                    <span className={`text-[8px] font-mono font-bold ${nextAddr === 'null' ? 'italic opacity-60' : ''}`}>{nextAddr}</span>
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
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|Node|true|false|System|out|print|println|static|areIdentical)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'boolean', 'String', 'Node', 'System', 'out', 'print', 'println', 'void'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['areIdentical'].includes(part)) return <span key={i} className={`text-${theme}-400 font-bold`}>{part}</span>;
          if (['true', 'false', 'null', 'None'].includes(part)) return <span key={i} className="text-orange-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-emerald-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default IdenticalLinkedListsViz;