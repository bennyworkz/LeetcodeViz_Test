import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, Link, RefreshCw, Scissors,
  GitMerge, CheckSquare, FastForward, ArrowRight
} from 'lucide-react';

const APPROACHES = {
  circular: {
    id: 'circular',
    title: 'Circular Linked List',
    subtitle: 'Optimal: O(N) Time, O(1) Space.',
    icon: <RefreshCw size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public ListNode rotateRight(ListNode head, int k) {
        // Base cases: empty list, single node, or no rotation
        if (head == null || head.next == null || k == 0) {
            return head;
        }
        
        // 1. Find the length of the list and the old tail
        ListNode tail = head;
        int n = 1;
        while (tail.next != null) {
            tail = tail.next;
            n++;
        }
        
        // 2. Connect the tail to the head to form a circle
        tail.next = head;
        
        // 3. Find the new tail (n - k % n - 1)
        int effectiveK = k % n;
        int stepsToNewTail = n - effectiveK;
        
        ListNode newTail = tail;
        while (stepsToNewTail > 0) {
            newTail = newTail.next;
            stepsToNewTail--;
        }
        
        // 4. Break the circle and determine the new head
        ListNode newHead = newTail.next;
        newTail.next = null;
        
        return newHead;
    }
}`,
    explanation: "Rotating a linked list to the right by `k` places means the last `k` nodes move to the front. To do this optimally, we first traverse the list to find its length `n` and the `tail` node. We then connect the `tail` to the `head`, creating a circular linked list! Because `k` can be much larger than `n` (e.g., rotating a 5-node list 2,000,000 times), we take `k % n` to find the effective number of rotations. The new tail will be at position `n - (k % n)` from the original tail. We traverse to this new tail, establish the node immediately after it as our `newHead`, and break the circle by setting `newTail.next = null`."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">61. Rotate List</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given the <code>head</code> of a linked list, rotate the list to the right by <code>k</code> places.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> head = [1,2,3,4,5], k = 2</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [4,5,1,2,3]</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation:</p>
                 <ul className="list-disc pl-4 space-y-1 mt-1">
                     <li>rotate 1 steps to the right: [5,1,2,3,4]</li>
                     <li>rotate 2 steps to the right: [4,5,1,2,3]</li>
                 </ul>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> head = [0,1,2], k = 4</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [2,0,1]</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation:</p>
                 <ul className="list-disc pl-4 space-y-1 mt-1">
                     <li>rotate 1 steps to the right: [2,0,1]</li>
                     <li>rotate 2 steps to the right: [1,2,0]</li>
                     <li>rotate 3 steps to the right: [0,1,2]</li>
                     <li>rotate 4 steps to the right: [2,0,1]</li>
                 </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li>The number of nodes in the list is in the range <code>[0, 500]</code>.</li>
              <li><code>-100 &lt;= Node.val &lt;= 100</code></li>
              <li><code>0 &lt;= k &lt;= 2 * 10<sup>9</sup></code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const RotateListVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('circular');
  const [headInput, setHeadInput] = useState('1, 2, 3, 4, 5');
  const [kInput, setKInput] = useState('2');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let arr = headInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    let k = parseInt(kInput.trim(), 10);
    if (isNaN(k) || k < 0) k = 0;
    
    // UI Safety cap
    if (arr.length > 8) arr = arr.slice(0, 8);

    return { arr, k };
  }, [headInput, kInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { arr, k } = parsedData;

    const cloneNodes = (nodes) => {
        const cloned = {};
        for (const key in nodes) {
            cloned[key] = { ...nodes[key] };
        }
        return cloned;
    };

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    let nodes = {};
    for (let i = 0; i < arr.length; i++) {
        nodes[`node_${i}`] = { 
            id: `node_${i}`, 
            val: arr[i], 
            next: i < arr.length - 1 ? `node_${i+1}` : null
        };
    }
    
    let headId = arr.length > 0 ? 'node_0' : null;

    addStep(
        "Evaluate Base Cases", 
        `Line 3: if (head == null || head.next == null || k == 0)\n\nWe immediately check if the list is empty, has only one node, or if we are rotating by 0. In these cases, no rotation is needed.`, 
        3, 
        { nodes: cloneNodes(nodes), tail: null, newTail: null, newHead: null, n: null, effectiveK: null, stepsLeft: null, action: 'evalBase' }
    );

    if (!headId || !nodes[headId].next || k === 0) {
        addStep(
            "Return Base Case", 
            `Line 4: return head;\n\nList requires no modification.`, 
            4, 
            { nodes: cloneNodes(nodes), tail: null, newTail: null, newHead: headId, n: arr.length, effectiveK: 0, stepsLeft: 0, action: 'success', isSuccess: true, ans: headId }
        );
        return steps;
    }

    let tailId = headId;
    let n = 1;

    addStep(
        "Initialize Length and Tail", 
        `Line 8-9: ListNode tail = head; int n = 1;\n\nWe start traversing to find the last node ('tail') and the total length ('n') of the list.`, 
        9, 
        { nodes: cloneNodes(nodes), tail: tailId, newTail: null, newHead: null, n, effectiveK: null, stepsLeft: null, action: 'initTail' }
    );

    let iter = 0;
    while (nodes[tailId].next != null) {
        if (iter++ > 100) break;
        
        addStep(
            "Traverse for Length", 
            `Line 10: while (tail.next != null)\n\nMoving tail forward to find the end of the list.`, 
            10, 
            { nodes: cloneNodes(nodes), tail: tailId, newTail: null, newHead: null, n, effectiveK: null, stepsLeft: null, action: 'loopTail' }
        );

        tailId = nodes[tailId].next;
        n++;

        addStep(
            "Update Tail & Length", 
            `Line 11-12: tail = tail.next; n++;\n\nTail is now pointing to [${nodes[tailId].val}]. Length 'n' is ${n}.`, 
            12, 
            { nodes: cloneNodes(nodes), tail: tailId, newTail: null, newHead: null, n, effectiveK: null, stepsLeft: null, action: 'incTail' }
        );
    }

    addStep(
        "Form Circular List", 
        `Line 16: tail.next = head;\n\nWe link the tail back to the head. The list is now a continuous circle! This allows us to easily wrap around.`, 
        16, 
        { nodes: cloneNodes(nodes), tail: tailId, newTail: null, newHead: null, n, effectiveK: null, stepsLeft: null, action: 'preCircle' }
    );

    nodes[tailId].next = headId; // form circle

    addStep(
        "Circle Formed", 
        `Line 16: tail.next = head;\n\nThe circle is connected! Tail [${nodes[tailId].val}] -> Head [${nodes[headId].val}].`, 
        16, 
        { nodes: cloneNodes(nodes), tail: tailId, newTail: null, newHead: null, n, effectiveK: null, stepsLeft: null, action: 'circleFormed' }
    );

    let effectiveK = k % n;
    let stepsToNewTail = n - effectiveK;

    addStep(
        "Calculate Steps", 
        `Line 19-20: int effectiveK = k % n;\nint stepsToNewTail = n - effectiveK;\n\nk is ${k}, length is ${n}.\neffectiveK = ${k} % ${n} = ${effectiveK}.\nSteps to the new tail from the current tail = ${n} - ${effectiveK} = ${stepsToNewTail}.`, 
        20, 
        { nodes: cloneNodes(nodes), tail: tailId, newTail: null, newHead: null, n, effectiveK, stepsLeft: stepsToNewTail, action: 'calcSteps' }
    );

    let newTailId = tailId;
    addStep(
        "Initialize newTail Pointer", 
        `Line 22: ListNode newTail = tail;\n\nWe start our 'newTail' pointer at the current 'tail' and will walk forward 'stepsToNewTail' times.`, 
        22, 
        { nodes: cloneNodes(nodes), tail: tailId, newTail: newTailId, newHead: null, n, effectiveK, stepsLeft: stepsToNewTail, action: 'initNewTail' }
    );

    iter = 0;
    while (stepsToNewTail > 0) {
        if (iter++ > 100) break;
        
        addStep(
            "Traverse to New Tail", 
            `Line 23: while (stepsToNewTail > 0)\n\nWe have ${stepsToNewTail} steps left to find the new end of our list.`, 
            23, 
            { nodes: cloneNodes(nodes), tail: tailId, newTail: newTailId, newHead: null, n, effectiveK, stepsLeft: stepsToNewTail, action: 'loopNewTail' }
        );

        newTailId = nodes[newTailId].next;
        stepsToNewTail--;

        addStep(
            "Update newTail", 
            `Line 24-25: newTail = newTail.next; stepsToNewTail--;\n\nnewTail moves to [${nodes[newTailId].val}]. Steps left: ${stepsToNewTail}.`, 
            25, 
            { nodes: cloneNodes(nodes), tail: tailId, newTail: newTailId, newHead: null, n, effectiveK, stepsLeft: stepsToNewTail, action: 'incNewTail' }
        );
    }

    let newHeadId = nodes[newTailId].next;

    addStep(
        "Determine New Head", 
        `Line 29: ListNode newHead = newTail.next;\n\nThe new head of our list is simply the node immediately following our new tail. newHead = [${nodes[newHeadId].val}].`, 
        29, 
        { nodes: cloneNodes(nodes), tail: tailId, newTail: newTailId, newHead: newHeadId, n, effectiveK, stepsLeft: stepsToNewTail, action: 'findNewHead' }
    );

    nodes[newTailId].next = null; // Break circle

    addStep(
        "Break the Circle", 
        `Line 30: newTail.next = null;\n\nWe break the circular link so the list properly terminates at 'newTail'.`, 
        30, 
        { nodes: cloneNodes(nodes), tail: tailId, newTail: newTailId, newHead: newHeadId, n, effectiveK, stepsLeft: stepsToNewTail, action: 'breakCircle' }
    );

    addStep(
        "Return Result", 
        `Line 32: return newHead;\n\nThe list has been successfully rotated. We return the new head.`, 
        32, 
        { nodes: cloneNodes(nodes), tail: tailId, newTail: newTailId, newHead: newHeadId, n, effectiveK, stepsLeft: stepsToNewTail, action: 'success', isSuccess: true, ans: newHeadId }
    );

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
  const { isSuccess, ans, action, nodes, tail, newTail, newHead, n, effectiveK, stepsLeft } = state;
  const { arr } = parsedData;

  // Derive the render order for the UI.
  // We want to render them in their *current valid traversal order* from the logical 'start'.
  // Before the circle is broken, the logical start is node_0.
  // After the circle is broken (isSuccess), the logical start is newHead.
  const renderList = useMemo(() => {
      if (!nodes) return [];
      
      let ordered = [];
      let visited = new Set();
      
      // Determine starting point for visual layout
      let startId = isSuccess && newHead ? newHead : (arr.length > 0 ? 'node_0' : null);
      
      let currentId = startId;
      let safeIter = 0;

      while (currentId && safeIter < arr.length + 2) {
          if (visited.has(currentId)) {
              // We hit the circle! We stop adding to the ordered list to avoid infinite UI loops,
              // but the last node's 'next' will visually indicate the loop.
              break; 
          }
          ordered.push({ ...nodes[currentId], _renderIdx: safeIter });
          visited.add(currentId);
          currentId = nodes[currentId].next;
          safeIter++;
      }

      // Add any orphaned nodes (though there shouldn't be any in this specific algorithm, safety first)
      Object.keys(nodes).forEach((key) => {
          if (!visited.has(key)) {
              ordered.push({ ...nodes[key], _renderIdx: safeIter++ });
          }
      });

      return ordered;
  }, [nodes, isSuccess, newHead, arr.length]);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <RefreshCw className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Rotate List</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 61</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Linked List / Pointers</span>
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
                <div className="grid grid-cols-1 gap-3">
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action.includes('Circle') ? 'bg-rose-500/20 border-rose-500' : (action.includes('new') || action.includes('New') ? 'bg-amber-500/20 border-amber-500' : 'bg-violet-500/20 border-violet-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action.includes('Circle') ? 'rose' : (action.includes('new') || action.includes('New') ? 'amber' : 'violet')} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Execution State</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="Length (n)" val={n !== null && n !== undefined ? n : "-"} color="sky" active={n !== null && n !== undefined} />
                        <VariableCard label="k % n" val={effectiveK !== null && effectiveK !== undefined ? effectiveK : "-"} color="purple" active={effectiveK !== null && effectiveK !== undefined} />
                        <VariableCard label="newTail" val={newTail ? `[${nodes[newTail].val}]` : "-"} color="amber" active={newTail !== null && newTail !== undefined} />
                        <VariableCard label="newHead" val={newHead ? `[${nodes[newHead].val}]` : "-"} color="emerald" active={newHead !== null && newHead !== undefined} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Linked List (head)</label>
                        <input type="text" value={headInput} onChange={(e) => { setHeadInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="1, 2, 3, 4, 5" />
                    </div>

                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Rotate (k)</label>
                        <input type="number" min="0" value={kInput} onChange={(e) => { setKInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate font-bold text-violet-700" placeholder="2" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action.includes('Circle') ? 'bg-rose-900 border-rose-800' : 'bg-slate-900 border-slate-800')}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : <RefreshCw size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action.includes('Circle') ? 'text-rose-400' : 'text-violet-400')}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action.includes('Circle') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30')}`}>Line {cur.line}</div>
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
                      
                      {/* Math/Calculations Banner above nodes */}
                      {!isSuccess && effectiveK !== null && effectiveK !== undefined && (
                          <div className="absolute top-0 flex items-center gap-4 text-xs font-mono font-black mb-8 px-6 py-2 bg-slate-50 border border-slate-200 rounded-full shadow-sm">
                              <span className="text-slate-400 uppercase tracking-widest">Calculations:</span>
                              <span className="text-purple-600 bg-purple-100 px-2 rounded">eff_k = {effectiveK}</span>
                              <span className="text-amber-600 bg-amber-100 px-2 rounded">steps = {stepsLeft}</span>
                          </div>
                      )}

                      {/* Linked List Representation */}
                      <div className="flex items-center mt-12 px-4 gap-2 md:gap-3 w-max mx-auto min-w-full justify-start md:justify-center transition-all duration-700">
                          {renderList.map((node, renderIdx) => {
                              
                              let isTail = node.id === tail;
                              let isNewTail = node.id === newTail;
                              let isNewHead = node.id === newHead;

                              let isCycleTarget = node.next && renderList.findIndex(r => r.id === node.next) < renderIdx;

                              let cls = "relative w-12 h-12 md:w-16 md:h-16 flex flex-col items-center justify-center rounded-2xl border-4 font-mono font-black text-xl md:text-2xl transition-all duration-700 z-10 shrink-0 shadow-sm ";
                              
                              if (isSuccess) {
                                  cls += "bg-emerald-50 border-emerald-400 text-emerald-800";
                              } else if (isNewHead) {
                                  cls += "bg-emerald-100 border-emerald-500 text-emerald-900 scale-110 shadow-lg ring-4 ring-emerald-300/30 z-30";
                              } else if (isNewTail) {
                                  cls += "bg-amber-100 border-amber-500 text-amber-900 scale-110 shadow-lg ring-4 ring-amber-300/30 z-30";
                              } else if (isTail) {
                                  cls += "bg-sky-100 border-sky-500 text-sky-900 scale-110 shadow-lg ring-4 ring-sky-300/30 z-30";
                              } else {
                                  cls += "bg-white border-slate-300 text-slate-700";
                              }

                              return (
                                  <React.Fragment key={`${node.id}-${renderIdx}`}>
                                      <div className={`flex flex-col items-center relative shrink-0`}>
                                          {/* Top Pointers */}
                                          <div className="absolute -top-12 flex flex-col items-center justify-end h-10 w-full gap-1 z-40">
                                              {isNewHead && (
                                                  <div className={`flex flex-col items-center animate-in slide-in-from-top-2`}>
                                                      <span className="text-[10px] font-black font-mono tracking-widest text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300 shadow-sm mb-1">newHead</span>
                                                      <ArrowDown size={16} className="text-emerald-500" strokeWidth={3}/>
                                                  </div>
                                              )}
                                              {isTail && !isNewHead && (
                                                  <div className={`flex flex-col items-center ${action.includes('Tail') ? 'animate-bounce' : ''}`}>
                                                      <span className="text-[10px] font-black font-mono tracking-widest text-sky-800 bg-sky-100 px-1.5 py-0.5 rounded border border-sky-300 shadow-sm mb-1">tail</span>
                                                      <ArrowDown size={16} className="text-sky-500" strokeWidth={3}/>
                                                  </div>
                                              )}
                                          </div>

                                          {/* Node Box */}
                                          <div className={cls}>
                                              {node.val}
                                              
                                              {/* Destination Tag to clarify linkages when they loop back */}
                                              {isCycleTarget && !isSuccess && (
                                                   <span className="absolute -bottom-6 text-[8px] md:text-[9px] font-mono font-bold text-white bg-rose-500 rounded px-2 py-0.5 shadow-md whitespace-nowrap z-50 flex items-center gap-1 animate-in zoom-in border border-rose-600">
                                                       <RefreshCw size={8} /> next: [{nodes[node.next].val}]
                                                   </span>
                                              )}
                                          </div>
                                          
                                          {/* Bottom Pointers */}
                                          <div className="absolute -bottom-14 flex flex-col items-center h-12 w-full gap-1 z-40">
                                              {isNewTail && (
                                                  <div className={`flex flex-col items-center animate-in slide-in-from-top-2 ${action.includes('newTail') ? 'animate-bounce' : ''}`}>
                                                      <ArrowUp size={16} className="text-amber-500" strokeWidth={3}/>
                                                      <span className="text-[10px] font-black font-mono bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 tracking-widest shadow-sm mt-1">newTail</span>
                                                  </div>
                                              )}
                                          </div>
                                      </div>

                                      {/* Connector Arrow */}
                                      {node.next && !isCycleTarget && (
                                          <div className="flex flex-col items-center justify-center shrink-0 px-2 text-slate-300 transition-all duration-500">
                                              <ArrowRight size={24} strokeWidth={2} className="text-slate-300" />
                                          </div>
                                      )}
                                      
                                      {/* Null Terminator */}
                                      {!node.next && (
                                          <div className="flex items-center justify-center shrink-0 px-2 text-slate-400 font-mono font-bold text-sm opacity-50 relative">
                                              null
                                              {action === 'breakCircle' && isNewTail && (
                                                   <span className="absolute -top-4 -left-4 text-rose-500 animate-in zoom-in spin-in"><Scissors size={24}/></span>
                                              )}
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
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">ROTATION COMPLETE</span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Returned newHead
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
                <RefreshCw className="text-violet-600"/> Circular Linked Lists
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Rotating a linked list could technically be done by finding the very last node, moving it to the front, and repeating <code>k</code> times. However, this takes $O(k \times N)$ time and will fail if <code>k</code> is a massive number like 2,000,000,000.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Target size={18}/> The Modulo Trick
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            If you rotate a list of length 5 exactly 5 times, it ends up in the exact same configuration it started in!
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            Therefore, rotating it 6 times is mathematically identical to rotating it 1 time.<br/><br/>
                            We can strip away all the redundant full rotations by calculating <code>effectiveK = k % length</code>. This guarantees our actual rotation amount is always strictly less than the length of the list.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Link size={18}/> Forming the Circle
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            Instead of moving nodes one by one, we can change the topology of the list itself.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>1. Connect the <code>tail</code> back to the <code>head</code>. You now have a continuous circle with no ends.</p>
                            <p>2. Traverse to the node that SHOULD be the new end of the list. (This is <code>length - effectiveK</code> steps from the old tail).</p>
                            <p>3. The node after the new tail is the new head.</p>
                            <p>4. Break the circle: <code>newTail.next = null</code>.</p>
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
                        "To rotate the list optimally, I used the Circular Linked List approach. A naive rotation would step through the list `k` times, resulting in a TLE if `k` is massive. First, I traverse the list to find its length `n` and identifying the `tail` node. I connect `tail.next` to `head` to create a circle. I calculate the effective rotations needed using `k % n`. The new tail of our list will be located exactly `n - (k % n)` steps from the old tail. I advance a `newTail` pointer this many steps, set `newHead` to `newTail.next`, and sever the loop by setting `newTail.next = null`. This guarantees $O(N)$ execution time and uses strict $O(1)$ constant space since we only modify existing pointers."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Why n - (k % n) steps?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Rotating <em>right</em> by <code>k</code> means taking the <strong>last <code>k</code> elements</strong> and moving them to the front. This means the element right before them (which is at index <code>n - k - 1</code> if 0-indexed) will become the new tail. Starting from our old tail (which acts as index -1 relatively), we must step forward exactly <code>n - k</code> times to land on this new tail.
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
                                <p className="text-[10px] text-slate-500 mt-1">We do exactly two passes over the list. One full pass to find the length and the tail, and one partial pass (up to N steps) to find the new tail. Total time is strictly bounded by $O(N)$.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We allocate no new nodes or auxiliary arrays. We only use primitive integer variables (`n`, `effectiveK`, `stepsToNewTail`) and a few reference pointers (`tail`, `newTail`, `newHead`).</p>
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

const VariableCard = ({ label, val, color, active }) => {
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

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|rotateRight|head|tail|newTail|newHead|next|effectiveK|stepsToNewTail)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['rotateRight', 'head', 'next'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['tail', 'newTail', 'newHead'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['effectiveK', 'stepsToNewTail'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default RotateListVisualizer;