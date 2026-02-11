import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, Link, GitMerge, ListOrdered,
  ArrowRight, Repeat, IterationCcw
} from 'lucide-react';

const APPROACHES = {
  iterativeInPlace: {
    id: 'iterativeInPlace',
    title: 'Iterative In-Place Reversal',
    subtitle: 'Optimal: O(N) Time, O(1) Space.',
    icon: <IterationCcw size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public ListNode reverseBetween(ListNode head, int left, int right) {
        if (head == null || left == right) {
            return head;
        }
        
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode pre = dummy;
        
        // 1. Move 'pre' to the node immediately before the 'left' position
        for (int i = 0; i < left - 1; i++) {
            pre = pre.next;
        }
        
        // 'curr' is the first node to be reversed
        ListNode curr = pre.next;
        
        // 2. Reverse the sublist
        for (int i = 0; i < right - left; i++) {
            ListNode next = curr.next;
            curr.next = next.next;
            next.next = pre.next;
            pre.next = next;
        }
        
        return dummy.next;
    }
}`,
    explanation: "This is the most standard and efficient way to reverse a sublist. We use a `dummy` node pointing to `head` to gracefully handle cases where the reversal starts at the very first node. We first advance a `pre` pointer until it sits exactly one node *before* our target `left` position. The `curr` pointer is then set to `pre.next`. In the reversal loop, we continuously take the node immediately after `curr` (which we call `next`), detach it, and move it to the front of the reversed sublist, anchoring it right after `pre`. We repeat this shifting process `right - left` times."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">92. Reverse Linked List II</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given the <code>head</code> of a singly linked list and two integers <code>left</code> and <code>right</code> where <code>left &lt;= right</code>, reverse the nodes of the list from position <code>left</code> to position <code>right</code>, and return <em>the reversed list</em>.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> head = [1,2,3,4,5], left = 2, right = 4</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [1,4,3,2,5]</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: The sublist from position 2 to 4 (values 2, 3, 4) is reversed to become (4, 3, 2).</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> head = [5], left = 1, right = 1</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [5]</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li>The number of nodes in the list is <code>n</code>.</li>
              <li><code>1 &lt;= n &lt;= 500</code></li>
              <li><code>-500 &lt;= Node.val &lt;= 500</code></li>
              <li><code>1 &lt;= left &lt;= right &lt;= n</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const ReverseLinkedListIIVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('iterativeInPlace');
  const [headInput, setHeadInput] = useState('1, 2, 3, 4, 5');
  const [leftInput, setLeftInput] = useState('2');
  const [rightInput, setRightInput] = useState('4');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let arr = headInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (arr.length === 0) arr = [1, 2, 3, 4, 5];
    if (arr.length > 8) arr = arr.slice(0, 8); // UI cap
    
    let left = parseInt(leftInput.trim(), 10);
    let right = parseInt(rightInput.trim(), 10);
    
    if (isNaN(left) || left < 1) left = 1;
    if (isNaN(right) || right > arr.length) right = arr.length;
    if (left > right) {
        let temp = left;
        left = right;
        right = temp;
    }

    return { arr, left, right };
  }, [headInput, leftInput, rightInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { arr, left, right } = parsedData;

    // Helper to deeply clone the nodes map
    const cloneNodes = (nodes) => {
        const cloned = {};
        for (const key in nodes) {
            cloned[key] = { ...nodes[key] };
        }
        return cloned;
    };

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 1000) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'iterativeInPlace') {
        
        let nodes = {};
        nodes['dummy'] = { id: 'dummy', val: 'D', next: arr.length > 0 ? 'node_0' : null, type: 'dummy' };
        
        for (let i = 0; i < arr.length; i++) {
            nodes[`node_${i}`] = { 
                id: `node_${i}`, 
                val: arr[i], 
                next: i < arr.length - 1 ? `node_${i+1}` : null,
                type: 'standard'
            };
        }

        addStep(
            "Evaluate Edge Cases", 
            `Line 3: if (head == null || left == right)\n\nWe check if the list is empty or if left == right (meaning no reversal is needed).`, 
            3, 
            { nodes: cloneNodes(nodes), pre: null, curr: null, nxt: null, i: null, action: 'evalBase' }
        );

        if (arr.length === 0 || left === right) {
            addStep(
                "Return Early", 
                `Line 4: return head;\n\nNo reversal needed. Returning original list.`, 
                4, 
                { nodes: cloneNodes(nodes), pre: null, curr: null, nxt: null, i: null, action: 'success', isSuccess: true }
            );
            return steps;
        }

        let preId = 'dummy';

        addStep(
            "Initialize Dummy & Pre", 
            `Line 7-9: ListNode dummy = new ListNode(0);\ndummy.next = head;\nListNode pre = dummy;\n\nWe create a dummy node pointing to the head. 'pre' is initialized to 'dummy'. This handles edge cases where the reversal includes the 1st node.`, 
            9, 
            { nodes: cloneNodes(nodes), pre: preId, curr: null, nxt: null, i: null, action: 'initPre' }
        );

        // Move pre
        for (let i = 0; i < left - 1; i++) {
            addStep(
                "Advance Pre Pointer", 
                `Line 12: for (int i = 0; i < ${left - 1}; i++)\n\nWe must advance 'pre' exactly (left - 1) times so it sits just BEFORE the sublist we want to reverse.`, 
                12, 
                { nodes: cloneNodes(nodes), pre: preId, curr: null, nxt: null, i, action: 'loopPre' }
            );
            
            preId = nodes[preId].next;
            
            addStep(
                "Update Pre", 
                `Line 13: pre = pre.next;\n\n'pre' moves to the next node.`, 
                13, 
                { nodes: cloneNodes(nodes), pre: preId, curr: null, nxt: null, i, action: 'movePre' }
            );
        }

        let currId = nodes[preId].next;

        addStep(
            "Initialize Curr", 
            `Line 17: ListNode curr = pre.next;\n\n'curr' is the first node of our target sublist. It will eventually become the LAST node of the reversed sublist!`, 
            17, 
            { nodes: cloneNodes(nodes), pre: preId, curr: currId, nxt: null, i: null, action: 'initCurr' }
        );

        // Reversal loop
        for (let i = 0; i < right - left; i++) {
            addStep(
                "Start Reversal Loop", 
                `Line 20: for (int i = 0; i < ${right - left}; i++)\n\nWe need to perform (right - left) shifts. Current iteration i=${i}.`, 
                20, 
                { nodes: cloneNodes(nodes), pre: preId, curr: currId, nxt: null, i, action: 'loopReverse' }
            );

            let nxtId = nodes[currId].next;
            addStep(
                "Identify Next Node", 
                `Line 21: ListNode next = curr.next;\n\nWe identify 'next', the node immediately after 'curr'. This is the node we will pluck out and move to the front of the sublist.`, 
                21, 
                { nodes: cloneNodes(nodes), pre: preId, curr: currId, nxt: nxtId, i, action: 'defNext' }
            );

            nodes[currId].next = nodes[nxtId].next;
            addStep(
                "Detach Next Node", 
                `Line 22: curr.next = next.next;\n\nWe route 'curr.next' to skip over 'next'. We have effectively unlinked 'next' from its current position.`, 
                22, 
                { nodes: cloneNodes(nodes), pre: preId, curr: currId, nxt: nxtId, i, action: 'detachNext' }
            );

            nodes[nxtId].next = nodes[preId].next;
            addStep(
                "Point Next to Pre's Next", 
                `Line 23: next.next = pre.next;\n\nWe attach 'next' to the beginning of the reversed segment (which is whatever 'pre.next' currently points to).`, 
                23, 
                { nodes: cloneNodes(nodes), pre: preId, curr: currId, nxt: nxtId, i, action: 'attachNext1' }
            );

            nodes[preId].next = nxtId;
            addStep(
                "Anchor Next to Pre", 
                `Line 24: pre.next = next;\n\nWe finalize moving 'next' to the front by pointing 'pre.next' directly to it. The shift is complete!`, 
                24, 
                { nodes: cloneNodes(nodes), pre: preId, curr: currId, nxt: nxtId, i, action: 'attachNext2' }
            );
        }

        addStep(
            "Loop Terminates", 
            `Line 20: Loop finishes.\n\nWe have performed all ${right - left} shifts. The sublist is completely reversed!`, 
            20, 
            { nodes: cloneNodes(nodes), pre: preId, curr: currId, nxt: null, i: null, action: 'endLoop' }
        );

        addStep(
            "Return Result", 
            `Line 27: return dummy.next;\n\nWe return 'dummy.next', which points to the true head of our modified list.`, 
            27, 
            { nodes: cloneNodes(nodes), pre: null, curr: null, nxt: null, i: null, action: 'success', isSuccess: true }
        );
    }

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
  const { isSuccess, action, nodes, pre, curr: currentPtr, nxt, i: activeI } = state;
  const { left, right } = parsedData;

  // Flatten the linked list into an array for sequential rendering
  const renderList = useMemo(() => {
      if (!nodes) return [];
      let ordered = [];
      let currentId = 'dummy';
      // Fallback safeguard against infinite loops if graph breaks
      let safeIter = 0;
      while (currentId && safeIter < 50) {
          ordered.push(nodes[currentId]);
          currentId = nodes[currentId].next;
          safeIter++;
      }
      return ordered;
  }, [nodes]);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Link className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Reverse Linked List II</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 92</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : 'bg-violet-500/20 border-violet-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme="violet" />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Pointers</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="pre" val={pre ? `[${nodes[pre].val}]` : "-"} color="sky" active={pre !== null} />
                        <VariableCard label="curr" val={currentPtr ? `[${nodes[currentPtr].val}]` : "-"} color="purple" active={currentPtr !== null} />
                        <VariableCard label="next" val={nxt ? `[${nodes[nxt].val}]` : "-"} color="amber" active={nxt !== null} />
                        <VariableCard label="Loop (i)" val={activeI !== null ? activeI : "-"} color="slate" active={activeI !== null} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">List (head)</label>
                        <input type="text" value={headInput} onChange={(e) => { setHeadInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="1, 2, 3, 4, 5" />
                    </div>
                    
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Left</label>
                        <input type="number" value={leftInput} onChange={(e) => { setLeftInput(e.target.value); setCurrentStep(0); }} min="1" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner" placeholder="2" />
                    </div>

                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Right</label>
                        <input type="number" value={rightInput} onChange={(e) => { setRightInput(e.target.value); setCurrentStep(0); }} min="1" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner" placeholder="4" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : <IterationCcw size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : "text-violet-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'}`}>Line {cur.line}</div>
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
                      
                      {/* Sublist Target Indicator */}
                      {!isSuccess && renderList.length > 1 && (
                          <div className="absolute top-0 flex flex-col items-center w-full max-w-lg mb-8">
                             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono">Target Reversal Sublist</span>
                             <div className="flex items-center gap-2 mt-1">
                                 <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold border border-slate-200">left: {left}</span>
                                 <ArrowRight size={14} className="text-slate-300"/>
                                 <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold border border-slate-200">right: {right}</span>
                             </div>
                          </div>
                      )}

                      {/* Linked List Representation */}
                      <div className="flex items-center mt-12 px-4 gap-2 md:gap-3 w-max mx-auto min-w-full justify-start md:justify-center">
                          {renderList.map((node, renderIdx) => {
                              
                              let isPre = node.id === pre;
                              let isCurr = node.id === currentPtr;
                              let isNext = node.id === nxt;

                              let isDummy = node.type === 'dummy';

                              let cls = "relative w-12 h-12 md:w-16 md:h-16 flex flex-col items-center justify-center rounded-2xl border-4 font-mono font-black text-xl md:text-2xl transition-all duration-700 z-10 shrink-0 shadow-sm ";
                              
                              if (isSuccess) {
                                  cls += isDummy ? "bg-slate-100 border-slate-300 text-slate-400" : "bg-emerald-50 border-emerald-400 text-emerald-800";
                              } else if (isPre) {
                                  cls += "bg-sky-100 border-sky-500 text-sky-900 scale-110 shadow-lg ring-4 ring-sky-300/30 z-30";
                              } else if (isCurr) {
                                  cls += "bg-purple-100 border-purple-500 text-purple-900 scale-110 shadow-lg ring-4 ring-purple-300/30 z-30";
                              } else if (isNext) {
                                  cls += "bg-amber-100 border-amber-500 text-amber-900 scale-110 shadow-lg ring-4 ring-amber-300/30 z-30";
                              } else {
                                  cls += isDummy ? "bg-slate-100 border-slate-300 text-slate-400" : "bg-white border-slate-300 text-slate-700";
                              }

                              return (
                                  <React.Fragment key={node.id}>
                                      <div className="flex flex-col items-center relative shrink-0">
                                          {/* Top Pointers */}
                                          <div className="absolute -top-12 flex flex-col items-center justify-end h-10 w-full gap-1 z-40">
                                              {isPre && (
                                                  <div className={`flex flex-col items-center ${action.includes('Pre') ? 'animate-bounce' : ''}`}>
                                                      <span className="text-[10px] font-black font-mono tracking-widest text-sky-800 bg-sky-100 px-1.5 py-0.5 rounded border border-sky-300 shadow-sm mb-1">pre</span>
                                                      <ArrowDown size={16} className="text-sky-500" strokeWidth={3}/>
                                                  </div>
                                              )}
                                              {isCurr && (
                                                  <div className="flex flex-col items-center">
                                                      <span className="text-[10px] font-black font-mono tracking-widest text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded border border-purple-300 shadow-sm mb-1">curr</span>
                                                      <ArrowDown size={16} className="text-purple-500" strokeWidth={3}/>
                                                  </div>
                                              )}
                                          </div>

                                          {/* Node Box */}
                                          <div className={cls} style={{
                                              // Add a subtle transform if this node was just operated on to make it 'pop'
                                              transform: action === 'attachNext2' && isNext ? 'scale(1.15) translateY(-5px)' : 'none'
                                          }}>
                                              {node.val}
                                              {isDummy && <span className="absolute -top-2 text-[8px] bg-slate-200 text-slate-500 px-1 rounded-full border border-slate-300">DUMMY</span>}
                                              
                                              {/* Original Index Tag (for tracking visually how they reorder) */}
                                              {!isDummy && (
                                                   <span className="absolute -bottom-2 -right-2 text-[8px] md:text-[9px] font-mono font-bold text-white bg-slate-800 rounded px-1 shadow-sm">
                                                       {node.id.replace('node_', '')}
                                                   </span>
                                              )}
                                          </div>
                                          
                                          {/* Bottom Pointers */}
                                          <div className="absolute -bottom-14 flex flex-col items-center h-12 w-full gap-1 z-40">
                                              {isNext && (
                                                  <div className="flex flex-col items-center animate-in slide-in-from-top-2">
                                                      <ArrowUp size={16} className="text-amber-500" strokeWidth={3}/>
                                                      <span className="text-[10px] font-black font-mono bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 tracking-widest shadow-sm mt-1">next</span>
                                                  </div>
                                              )}
                                          </div>
                                      </div>

                                      {/* Connector Arrow */}
                                      {node.next && (
                                          <div className="flex items-center justify-center shrink-0 px-1 text-slate-300 transition-all duration-500">
                                              <ArrowRight size={24} strokeWidth={2} />
                                          </div>
                                      )}
                                      
                                      {/* Null Terminator */}
                                      {!node.next && (
                                          <div className="flex items-center justify-center shrink-0 px-2 text-slate-400 font-mono font-bold text-sm opacity-50">
                                              null
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
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">REVERSAL COMPLETE</span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Returned dummy.next
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
                <Link className="text-violet-600"/> Linked List In-Place Manipulation
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Reversing a portion of a linked list requires surgically breaking and reconnecting node pointers without losing reference to the rest of the list. We do this entirely "in-place", meaning we never instantiate new nodes or arrays, achieving strictly $O(1)$ extra space.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Target size={18}/> The Dummy Node Pattern
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            Why do we create a <code>dummy</code> node pointing to <code>head</code>?
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            If <code>left = 1</code>, we are asked to reverse starting from the very first node. This means the <code>head</code> of the list will physically change!<br/><br/>
                            By using a dummy node, we guarantee there is ALWAYS a node immediately before our target sublist (which we call <code>pre</code>). It standardizes the logic so we don't have to write messy `if (left == 1)` edge cases. At the end, returning <code>dummy.next</code> safely gives the correct new head.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <IterationCcw size={18}/> The Reversal Logic
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            We don't iteratively flip pointers backwards like a full list reversal. Instead, we repeatedly take the node *after* <code>curr</code> and shove it to the front!
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>1. Identify <code>next = curr.next</code>.</p>
                            <p>2. Detach it: <code>curr.next = next.next</code>.</p>
                            <p>3. Attach it to the front of the sublist: <code>next.next = pre.next</code>.</p>
                            <p>4. Secure the anchor: <code>pre.next = next</code>.</p>
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
                        "I used an iterative, in-place pointer manipulation approach. To handle the edge case where the reversal starts at the very head of the list, I introduced a `dummy` node pointing to `head`. I then advance a `pre` pointer to sit exactly one node before the `left` position. The node at `left` becomes `curr`. During the reversal loop, which runs `right - left` times, I repeatedly extract the node immediately following `curr` (which I call `next`) and insert it directly after `pre`. This effectively reverses the sublist by continuously shifting elements to the front of the segment. Finally, I return `dummy.next`. This guarantees a single pass $O(N)$ Time complexity, and because I only modify existing pointers, it strictly requires $O(1)$ auxiliary Space."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Why not extract values to an array?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                A naive approach is to traverse the list, extract all values to an array, reverse the array slice, and then write the values back into the nodes. While this passes LeetCode and is $O(N)$ time, it requires $O(N)$ space. More importantly, interviewers specifically ask linked list questions to test your ability to safely manipulate pointers. Bypassing pointer logic will result in an instant failure.
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
                                <p className="text-[10px] text-slate-500 mt-1">We perform exactly one pass. We traverse `left` nodes to position the pointers, and then process `right - left` nodes to perform the reversal. In the worst case (`right = N`), we visit every node exactly once.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We only allocate a single `dummy` node and three reference pointers (`pre`, `curr`, `next`). No matter how large the linked list is, the memory footprint remains constant.</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|head|left|right|dummy|pre|curr|next|reverseBetween)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['head', 'reverseBetween'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['left', 'right'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (['dummy', 'pre', 'curr', 'next'].includes(part)) return <span key={i} className="text-violet-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default ReverseLinkedListIIVisualizer;