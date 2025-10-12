import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp,
  GitCommit, MonitorPlay, ChevronLeft, ChevronRight, 
  Network, Database, RotateCcw, ListOrdered, FastForward,
  SplitSquareHorizontal, Goal, Zap, Footprints, Info,
  ZoomIn, ZoomOut, Maximize, Minimize
} from 'lucide-react';

// TypeScript interfaces for components
interface PointerLabelProps {
  label: string;
  color: string;
  position: string;
  active?: boolean;
  offset?: number;
  strikethrough?: boolean;
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
  middleTwoPass: {
    id: 'middleTwoPass',
    title: 'Two Passes Approach',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public Node middleNode(Node head) {
    int count = 0;
    Node curr = head;
    
    // Pass 1: Count total nodes
    while (curr != null) {
        count++;
        curr = curr.next;
    }
    
    // Pass 2: Traverse to count / 2
    curr = head;
    for (int i = 0; i < count / 2; i++) {
        curr = curr.next;
    }
    
    return curr;
}`,
    desc: "First, we traverse the entire list to count the total number of nodes. Then, we calculate the middle index (count / 2) and traverse the list a second time from the head to reach that middle node."
  },
  middleFastSlow: {
    id: 'middleFastSlow',
    title: 'Fast & Slow Pointers',
    icon: <FastForward size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public Node middleNode(Node head) {
    Node slow = head;
    Node fast = head;
    
    // Move fast by 2, slow by 1
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // When fast reaches the end, slow is at the middle
    return slow;
}`,
    desc: "The Tortoise and Hare algorithm. Two pointers start at the head. 'fast' moves twice as fast as 'slow'. By the time 'fast' reaches the end of the list, 'slow' has exactly reached the half-way point!"
  }
};

const OverviewTab = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6 text-indigo-600">
          <SplitSquareHorizontal size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Middle Node in a Linked List</h2>
      </div>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given the <code>head</code> of a singly linked list, find the middle node of the linked list.
        </p>
        
        <ul className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3 font-medium text-slate-700 list-none">
            <li className="flex items-center gap-3"><Info className="text-indigo-500" size={18}/> <strong>Odd Length:</strong> If the number of nodes is odd, return the exact middle node.</li>
            <li className="flex items-center gap-3"><Info className="text-indigo-500" size={18}/> <strong>Even Length:</strong> If the number of nodes is even, there are two middle nodes. You must return the <strong>second</strong> middle node.</li>
        </ul>

        <div className="space-y-6 pt-4">
           <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs border-b pb-2">Examples</h4>
           
           <div className="grid md:grid-cols-2 gap-6">
               <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-emerald-800 uppercase tracking-widest text-[10px] items-center gap-2"><Goal size={14}/> Example 1: Odd Nodes</div>
                   <div className="space-y-2">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-12 text-xs font-bold">Input:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">1 <ArrowRight size={12} className="mx-1"/> 2 <ArrowRight size={12} className="mx-1"/> 3 <ArrowRight size={12} className="mx-1"/> 4 <ArrowRight size={12} className="mx-1"/> 5</div>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-emerald-200/50 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold w-12">Output:</span> <span className="text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded">Node 3</span>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1">The middle node of the list is node 3.</p>
                   </div>
               </div>

               <div className="bg-sky-50/50 border border-sky-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-sky-800 uppercase tracking-widest text-[10px] items-center gap-2"><Goal size={14}/> Example 2: Even Nodes</div>
                   <div className="space-y-2">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-12 text-xs font-bold">Input:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">1 <ArrowRight size={12} className="mx-1"/> 2 <ArrowRight size={12} className="mx-1"/> 3 <ArrowRight size={12} className="mx-1"/> 4 <ArrowRight size={12} className="mx-1"/> 5 <ArrowRight size={12} className="mx-1"/> 6</div>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-sky-200/50 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold w-12">Output:</span> <span className="text-sky-600 font-bold bg-sky-100 px-2 py-0.5 rounded">Node 4</span>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1">Since the list has two middle nodes (3 and 4), we return the second one.</p>
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
      <div className="flex items-center gap-3 mb-6 text-amber-600">
          <Database size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Theory: The Tortoise and the Hare</h2>
      </div>
      
      <p className="text-slate-600 leading-relaxed">
          The <strong>Fast and Slow Pointers</strong> technique (often called the Tortoise and the Hare algorithm) is a genius way to find the middle of a linked list in exactly <strong>one pass</strong>.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-50 p-8 rounded-3xl relative overflow-hidden shadow-sm border border-slate-200">
              <div className="absolute -right-4 -bottom-4 opacity-10"><Footprints size={120}/></div>
              <h3 className="font-black text-emerald-600 uppercase tracking-widest text-sm mb-4 flex items-center gap-2"><Footprints size={18}/> The Slow Pointer</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  The slow pointer advances exactly <strong>one node</strong> at a time.
              </p>
              <div className="bg-white p-4 rounded-xl border shadow-sm font-mono text-xs text-emerald-700">
                  slow = slow.next;
              </div>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl border border-slate-800">
              <div className="absolute -right-4 -top-4 opacity-10"><Zap size={120}/></div>
              <h3 className="font-black text-amber-400 uppercase tracking-widest text-sm mb-4 flex items-center gap-2"><Zap size={18}/> The Fast Pointer</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  The fast pointer advances exactly <strong>two nodes</strong> at a time.
              </p>
              <div className="bg-black/50 p-4 rounded-xl border border-white/10 font-mono text-xs text-amber-300">
                  fast = fast.next.next;
              </div>
          </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-2xl text-indigo-900">
          <h4 className="font-black text-indigo-800 uppercase tracking-widest text-xs mb-2">Why does this work?</h4>
          <p className="text-sm leading-relaxed">
             Think of it like a race track. If runner A runs at 10mph and runner B runs at 20mph, when runner B crosses the finish line, runner A will be exactly at the halfway mark! 
             Because <code>fast</code> travels at 2x speed, when it hits the end of the list, <code>slow</code> will have traveled exactly 1x distance, perfectly landing on the middle node.
          </p>
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
               "While both approaches use O(N) time and O(1) space, the Fast & Slow pointer approach is the expected answer in an interview setting because it accomplishes the task in a single pass."
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
               <div className="p-5 rounded-2xl border bg-sky-900/40 border-sky-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-sky-400 mb-1">Two Passes (Naive)</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(N) + O(N/2) = O(N) <br/><strong>Space:</strong> O(1)</div>
                    <p className="text-[10px] text-sky-200/70 leading-relaxed mt-2">Traverses the list fully to count, then traverses halfway again. It's technically optimal complexity, but requires reading through the first half of the list twice.</p>
               </div>
               <div className="p-5 rounded-2xl border bg-emerald-900/40 border-emerald-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1">Fast & Slow (Optimal)</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(N/2) = O(N) <br/><strong>Space:</strong> O(1)</div>
                    <p className="text-[10px] text-emerald-200/70 leading-relaxed mt-2">Requires only a single pass through the list. When fast reaches the end, slow is at the middle. Elegantly handles both odd and even length lists.</p>
               </div>
           </div>
       </div>

       <div className="grid grid-cols-1 gap-6 mt-8">
           <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
               <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <Activity size={14} className="text-indigo-500"/> Null Safety Checklist
               </h4>
               <ul className="space-y-3 text-sm text-slate-600 leading-relaxed list-disc pl-5">
                   <li><strong>Empty List Check:</strong> In standard problems, verify <code>head == null</code> before starting traversal.</li>
                   <li><strong>Fast Pointer Bounds:</strong> The loop condition MUST check both <code>fast != null</code> AND <code>fast.next != null</code> to avoid NullPointerExceptions when jumping two nodes ahead.</li>
               </ul>
           </div>
       </div>
    </div>
);

// Advanced Coordinate Math for 2D Memory Grid
const generateNode = (val, id, nextId, index) => {
    // 3 columns, staggered layout to showcase leaping pointers clearly
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

const MiddleNodeInLinkedListViz = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('middleFastSlow');
  const [inputList, setInputList] = useState('10, 20, 30, 40, 50, 60');
  
  const [baseList, setBaseList] = useState([]);
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

  useEffect(() => {
      const vals = inputList.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)).slice(0, 10);
      const nodes = vals.map((v, i) => generateNode(v, i, i < vals.length - 1 ? i + 1 : null, i));
      setBaseList(nodes);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
  }, [inputList, selectedOpId]);

  const trace = useMemo(() => {
    const steps = [];
    if (baseList.length === 0) return steps;
    
    let list = baseList.map(n => ({...n}));

    const addStep = (phase, desc, line, stateProps) => {
      steps.push({
        phase, description: desc, line, 
        state: { list: list.map(n=>({...n})), ...stateProps }
      });
    };

    if (selectedOpId === 'middleTwoPass') {
        let curr = 0; // index/id mapping
        let count = 0;
        
        addStep("Method Call", `middleNode(head) called.`, 1, { curr, count, pass: 1 });
        addStep("Initialize Variables", `int count = 0; Node curr = head;`, 2, { curr, count, pass: 1 });

        // Pass 1: Count
        while (curr !== null) {
            addStep("Count Loop", `curr (${list[curr].addr}) != null.`, 6, { curr, count, pass: 1 });
            count++;
            addStep("Increment Count", `count++. Total nodes counted: ${count}.`, 7, { curr, count, pass: 1 });
            
            curr = list[curr].nextId;
            addStep("Advance Pointer", `curr = curr.next.`, 8, { curr, count, pass: 1 });
        }
        
        addStep("End of Pass 1", `curr is null. We found a total of ${count} nodes.`, 6, { curr: null, count, pass: 1 });
        
        // Pass 2: Traverse to Middle
        curr = 0;
        addStep("Reset Pointer", `curr = head. Starting Pass 2.`, 12, { curr, count, pass: 2 });
        
        let mid = Math.floor(count / 2);
        addStep("Calculate Target", `Target index is count / 2 = ${count} / 2 = ${mid}.`, 13, { curr, count, mid, pass: 2 });
        
        for (let i = 0; i < mid; i++) {
            addStep("Pass 2 Loop", `i (${i}) < count / 2 (${mid}).`, 13, { curr, count, mid, pass: 2, localI: i });
            curr = list[curr].nextId;
            addStep("Advance Pointer", `curr = curr.next.`, 14, { curr, count, mid, pass: 2, localI: i });
        }
        addStep("Reached Middle", `i is now ${mid}. Loop terminates.`, 13, { curr, count, mid, pass: 2, localI: mid });
        
        addStep("Return Result", `Returning curr (${list[curr].val}).`, 17, { curr, count, mid, isSuccess: true, result: list[curr].val });
    } 
    else if (selectedOpId === 'middleFastSlow') {
        let slow = 0;
        let fast = 0;
        
        addStep("Method Call", `middleNode(head) called.`, 1, { slow: null, fast: null });
        addStep("Initialize Pointers", `Node slow = head; Node fast = head;`, 2, { slow, fast });

        while (true) {
            let fastNode = fast !== null ? list[fast] : null;
            let fastNext = fastNode ? fastNode.nextId : null;
            let fastNextVal = fastNext !== null ? list[fastNext].addr : 'null';
            
            addStep("Loop Condition", `fast (${fastNode ? fastNode.addr : 'null'}) != null && fast.next (${fastNextVal}) != null.`, 6, { slow, fast });
            
            if (fast === null || fastNext === null) {
                addStep("Loop Terminates", `Condition failed. Reached end of list.`, 6, { slow, fast });
                break;
            }
            
            slow = list[slow].nextId;
            addStep("Advance Slow", `slow = slow.next (Advances 1 step).`, 7, { slow, fast });
            
            fast = list[fastNext].nextId;
            addStep("Advance Fast", `fast = fast.next.next (Advances 2 steps).`, 8, { slow, fast });
        }
        
        addStep("Return Result", `Returning slow (${list[slow].val}).`, 12, { slow, fast, isSuccess: true, result: list[slow].val });
    }

    return steps;
  }, [baseList, selectedOpId]);

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

  const cur = trace[currentStep] || trace[0] || { state: { list: baseList } };
  const state = cur.state || { list: baseList };
  
  const { 
      isSuccess, curr, slow, fast, pass, count, mid, result, localI
  } = state;

  const getThemeColor = () => selectedOpId === 'middleTwoPass' ? 'sky' : 'emerald';
  const activeTheme = getThemeColor();

  // SVG Drawing function
  const renderSvgArrows = () => {
    return state.list.map((nodeObj) => {
        if (nodeObj.nextId === null) return null;
        
        const target = state.list.find(n => n.id === nodeObj.nextId);
        if (!target) return null;

        // Origin point: center of the "NEXT" box
        const startX = nodeObj.x + 92; 
        const startY = nodeObj.y + 28; 

        // Destination point: left middle of the target Node
        const endX = target.x - 6;
        const endY = target.y + 28;

        const strokeColor = '#94a3b8'; // slate-400
        const strokeWidth = 2;
        const strokeOpacity = 0.6;
        const marker = 'url(#arrowhead-default)';

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
            pathD = `M ${startX},${startY} C ${startX + 40},${startY} ${endX - 40},${endY} ${endX},${endY}`;
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
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header Component */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <SplitSquareHorizontal size={100} />
          </div>
          <div className="flex items-center gap-5 z-10">
            <div className={`bg-${activeTheme}-600 p-4 rounded-2xl shadow-lg shadow-${activeTheme}-100 flex items-center justify-center transition-colors duration-500`}>
                <SplitSquareHorizontal className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Middle Node</h1>
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
                        let btnColor = op.id === 'middleTwoPass' ? 'sky' : 'emerald';
                        
                        return (
                            <button 
                               key={op.id}
                               onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }}
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-amber-500/20 border-amber-500' : `bg-${activeTheme}-500/20 border-${activeTheme}-500`}`} style={{ top: `${((cur.line - 1) * 18) + 16}px`, height: '18px' }} />
                      )}
                      
                      {selectedOp.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme={isSuccess && cur.line === idx + 1 ? 'amber' : activeTheme} />
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
                        <label className={`text-[10px] font-black text-${activeTheme}-600 uppercase block pl-1 tracking-widest font-mono`}>Linked List Nodes (Max 10)</label>
                        <input type="text" value={inputList} onChange={(e) => { setInputList(e.target.value); setCurrentStep(0); }} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${activeTheme}-500 outline-none transition-all shadow-inner`} placeholder="10, 20, 30, 40, 50, 60" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group shrink-0 ${isSuccess ? `bg-amber-900 border-amber-800` : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      <Activity size={100}/>
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-amber-400" : `text-${activeTheme}-400`}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Execution Log</span>
                     </div>
                     <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : `bg-${activeTheme}-500/20 text-${activeTheme}-300 border-${activeTheme}-500/30`} border`}>Line {cur.line}</div>
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
                          {selectedOpId === 'middleTwoPass' && pass && (
                              <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-mono font-black uppercase px-2 py-1 rounded">
                                  Pass {pass}/2
                              </div>
                          )}
                          {selectedOpId === 'middleTwoPass' && count !== undefined && (
                              <div className="bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-mono font-black px-2 py-1 rounded">
                                  count: {count}
                              </div>
                          )}
                          {selectedOpId === 'middleTwoPass' && localI !== undefined && (
                              <div className="bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-mono font-black px-2 py-1 rounded animate-in fade-in">
                                  i: {localI}
                              </div>
                          )}
                          {result !== null && result !== undefined && (
                              <div className={`font-mono text-[11px] px-3 py-1 rounded border shadow-sm font-black uppercase tracking-widest animate-in zoom-in flex items-center gap-2 bg-amber-100 text-amber-700 border-amber-300`}>
                                  Middle: {result}
                              </div>
                          )}
                      </div>
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

                           {state.list && state.list.map((nodeObj, idx) => {
                              const isCurr = curr === idx;
                              const isSlow = slow === idx;
                              const isFast = fast === idx;
                              const isHead = idx === 0;
                              
                              const isResult = isSuccess && ((selectedOpId === 'middleTwoPass' && isCurr) || (selectedOpId === 'middleFastSlow' && isSlow));
                              const nextAddrStr = nodeObj.nextId !== null ? state.list.find(n => n.id === nodeObj.nextId)?.addr : 'null';

                              const isTarget = isCurr || isSlow || isFast || isHead;

                              let themeColor = 'slate';
                              if (isResult) themeColor = 'amber';
                              else if (isSlow) themeColor = 'emerald';
                              else if (isFast) themeColor = 'rose';
                              else if (isCurr) themeColor = 'sky';

                              const labels = [];
                              if (isHead) labels.push({ text: "head", color: "slate", position: "top" });
                              if (isCurr) labels.push({ text: "curr", color: activeTheme, position: "bottom" });
                              if (isFast) labels.push({ text: "fast", color: "rose", position: "top" });
                              if (isSlow) labels.push({ text: "slow", color: "emerald", position: "bottom" });

                              return (
                                  <div key={nodeObj.id} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      
                                      {/* Top Labels */}
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center z-20">
                                          {labels.filter(l => l.position === 'top').map((l, i) => (
                                              <PointerLabel key={i} label={l.text} color={l.color} position="top" active={true} offset={(isFast && isHead) ? -24 : 0} />
                                          ))}
                                      </div>

                                      {/* Bottom Labels */}
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center z-20">
                                          {labels.filter(l => l.position === 'bottom').map((l, i) => (
                                              <PointerLabel key={i} label={l.text} color={l.color} position="bottom" active={true} offset={(isSlow && isCurr) ? -24 : 0} />
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
                          
                          {/* Trailing Null Pointers */}
                          {state.list.length > 0 && (
                               <div className="absolute transition-all duration-300 z-10" style={{ left: state.list[state.list.length-1].x + 220, top: state.list[state.list.length-1].y }}>
                                   {curr === null && <PointerLabel label="curr" color={activeTheme} position="bottom" active={true} offset={0} />}
                                   {fast === null && <PointerLabel label="fast" color="rose" position="top" active={true} offset={0} />}
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
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Find Middle Node</span>
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

                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${isSuccess ? 'bg-sky-900/40 border-sky-800' : 'bg-slate-800/40 border-slate-700'}`}>
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
                  {!isSuccess && (
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

                           {/* HTML Layer for Node Blocks & Labels */}
                           {state.list && state.list.map((nodeObj) => {
                              const isFast = fast === nodeObj.id;
                              const isSlow = slow === nodeObj.id;
                              const isCurr = curr === nodeObj.id;
                              const isMiddle = isSuccess && isSlow;
                              
                              const isTarget = isFast || isSlow || isCurr;
                              
                              let themeColor = 'slate';
                              if (isMiddle) themeColor = 'emerald';
                              else if (isFast) themeColor = 'rose';
                              else if (isSlow) themeColor = 'emerald';
                              else if (isCurr) themeColor = activeTheme;

                              const labels = [];
                              if (isFast) labels.push({ text: "fast", color: "rose", position: "top" });
                              if (isCurr) labels.push({ text: "curr", color: activeTheme, position: "bottom" });
                              if (isSlow) labels.push({ text: "slow", color: "emerald", position: "bottom" });

                              return (
                                  <div key={nodeObj.id} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      
                                      {/* Top Labels */}
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center z-20">
                                          {labels.filter(l => l.position === 'top').map((l, i) => (
                                              <PointerLabel key={i} label={l.text} color={l.color} position="top" active={true} offset={0} />
                                          ))}
                                      </div>

                                      {/* Bottom Labels */}
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center z-20">
                                          {labels.filter(l => l.position === 'bottom').map((l, i) => (
                                              <PointerLabel key={i} label={l.text} color={l.color} position="bottom" active={true} offset={0} />
                                          ))}
                                      </div>

                                      {/* The Node Itself */}
                                      <div className="relative group">
                                          <span className="absolute -top-6 left-0 text-xs text-slate-400 font-mono font-bold opacity-80">{nodeObj.addr}</span>
                                          <div className={`flex items-center w-28 h-14 border-2 rounded-2xl transition-all duration-300 shadow-sm ${isTarget ? `ring-4 ring-${themeColor}-300 scale-105` : ''} ${isMiddle ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-slate-400'}`}>
                                              <div className={`flex-1 flex justify-center font-mono font-black text-2xl ${isMiddle ? 'text-emerald-800' : 'text-slate-800'}`}>
                                                  {nodeObj.val}
                                              </div>
                                              <div className={`w-10 h-full border-l-2 flex flex-col items-center justify-center rounded-r-xl ${isMiddle ? 'border-emerald-400 bg-emerald-50' : 'border-slate-400 bg-slate-50'}`}>
                                                  <span className="text-[7px] font-black uppercase tracking-widest opacity-60 transform -rotate-90">NEXT</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              )
                          })}
                          
                          {/* Trailing Null Pointers */}
                          {state.list.length > 0 && (
                               <div className="absolute transition-all duration-300 z-10" style={{ left: state.list[state.list.length-1].x + 220, top: state.list[state.list.length-1].y }}>
                                   {curr === null && <PointerLabel label="curr" color={activeTheme} position="bottom" active={true} offset={0} />}
                                   {fast === null && <PointerLabel label="fast" color="rose" position="top" active={true} offset={0} />}
                               </div>
                           )}
                      </div>
                  </div>

                  {/* FS Success Overlay */}
                  {isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className="bg-[#0f172a] border-4 border-sky-500 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(14,165,233,0.3)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-sky-500"></div>
                                <div className="w-24 h-24 bg-sky-500/20 text-sky-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-sky-500/10"><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4">MIDDLE NODE FOUND</h2>
                                <p className="text-sky-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Successfully located the middle node using two pointers</p>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className="flex-1 py-6 bg-sky-600 hover:bg-sky-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg">
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
        slate: 'bg-slate-100 text-slate-700 border-slate-200'
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

const ListNodeBlock = ({ val, address, nextAddr, themeColor = 'slate', isTarget }) => {
    return null; // Rendered inline in parent to handle dynamic absolute positioning & labels
};

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'sky' }) => {
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|Node|true|false|System|out|print|println|static|middleNode)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['middleNode'].includes(part)) return <span key={i} className={`text-${theme}-400 font-bold`}>{part}</span>;
          if (['true', 'false', 'null', 'None'].includes(part)) return <span key={i} className="text-orange-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-emerald-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default MiddleNodeInLinkedListViz;