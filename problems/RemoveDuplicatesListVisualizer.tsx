import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, GitMerge, Scissors,
  ArrowRight, CheckSquare, XSquare, Link
} from 'lucide-react';

const APPROACHES = {
  iterative: {
    id: 'iterative',
    title: 'Iterative (Single Pass)',
    subtitle: 'Optimal: O(N) Time, O(1) Space.',
    icon: <FastForwardIcon size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        // Handle empty list
        if (head == null) return null;
        
        ListNode current = head;
        
        // Traverse the list until the end
        while (current != null && current.next != null) {
            // If current value equals the next value, we found a duplicate
            if (current.val == current.next.val) {
                // Bypass the duplicate node
                current.next = current.next.next;
            } else {
                // Values are distinct, safe to move forward
                current = current.next;
            }
        }
        
        return head;
    }
}`,
    explanation: "Because the linked list is already sorted, we know that any duplicate elements must be completely adjacent to each other. This allows us to solve the problem in a single O(N) pass. We initialize a `current` pointer at the `head` of the list. At each step, we peek at the value of the `next` node. If `current.val == current.next.val`, we have found a duplicate! To delete it from the sequence, we simply reroute `current.next` to point to `current.next.next`, effectively dropping the duplicate node so it can be garbage collected. If the values are different, the `current` node is safely unique, so we advance our pointer forward. We never advance `current` when a deletion occurs because there might be multiple identical duplicates in a row (e.g., 1 -> 1 -> 1)!"
  }
};

function FastForwardIcon({ size }) {
    return <Zap size={size} />;
}

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">83. Remove Duplicates from Sorted List</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given the <code>head</code> of a sorted linked list, <em>delete all duplicates such that each element appears only once</em>. Return <em>the linked list <strong>sorted</strong> as well</em>.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              <div className="flex items-center gap-4 text-slate-400 font-bold">
                 <span className="text-slate-800">1</span> <ArrowRight size={14}/> <span className="text-rose-500">1</span> <ArrowRight size={14}/> <span className="text-slate-800">2</span>
              </div>
              <p><span className="text-slate-400 font-bold">Input:</span> head = [1,1,2]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [1,2]</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              <div className="flex items-center gap-4 text-slate-400 font-bold">
                 <span className="text-slate-800">1</span> <ArrowRight size={14}/> <span className="text-rose-500">1</span> <ArrowRight size={14}/> <span className="text-slate-800">2</span> <ArrowRight size={14}/> <span className="text-slate-800">3</span> <ArrowRight size={14}/> <span className="text-rose-500">3</span>
              </div>
              <p><span className="text-slate-400 font-bold">Input:</span> head = [1,1,2,3,3]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [1,2,3]</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li>The number of nodes in the list is in the range <code>[0, 300]</code>.</li>
              <li><code>-100 &lt;= Node.val &lt;= 100</code></li>
              <li>The list is guaranteed to be <strong>sorted</strong> in ascending order.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const RemoveDuplicatesListVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('iterative');
  
  const [listInput, setListInput] = useState('1, 1, 2, 3, 3, 3, 4');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let arr = listInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    // The problem guarantees a sorted linked list. Auto-sort user input to match constraints.
    arr.sort((a, b) => a - b);
    
    // Fallback if empty
    if (arr.length === 0) arr = [1, 1, 2];
    
    // UI Safety cap to prevent massive horizontal scrolling
    if (arr.length > 10) arr = arr.slice(0, 10);

    return { arr };
  }, [listInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { arr } = parsedData;

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

    if (selectedApproachId === 'iterative') {
        
        addStep(
            "Evaluate Base Case", 
            `Line 3: if (head == null) return null;\n\nCheck if the list is completely empty.`, 
            3, 
            { nodes: cloneNodes(nodes), current: null, action: 'evalBase', removedId: null }
        );

        if (!headId) {
            addStep(
                "Return Base Case", 
                `Line 3: return null;\n\nThe list is empty, nothing to deduplicate.`, 
                3, 
                { nodes: cloneNodes(nodes), current: null, action: 'success', isSuccess: true, ans: null, removedId: null }
            );
            return steps;
        }

        let currId = headId;
        addStep(
            "Initialize Pointer", 
            `Line 5: ListNode current = head;\n\nWe place our 'current' pointer at the first node in the list.`, 
            5, 
            { nodes: cloneNodes(nodes), current: currId, action: 'init', removedId: null }
        );

        let iter = 0;
        while (currId && nodes[currId].next) {
            if (iter++ > 100) break; // Infinite loop safety
            
            let nextId = nodes[currId].next;

            addStep(
                "Evaluate Loop Condition", 
                `Line 8: while (current != null && current.next != null)\n\nBoth 'current' [${nodes[currId].val}] and 'current.next' [${nodes[nextId].val}] exist. Proceeding.`, 
                8, 
                { nodes: cloneNodes(nodes), current: currId, action: 'evalLoop', removedId: null }
            );

            let isDuplicate = nodes[currId].val === nodes[nextId].val;
            
            addStep(
                "Compare Adjacent Values", 
                `Line 10: if (current.val == current.next.val)\n\nIs current.val (${nodes[currId].val}) equal to current.next.val (${nodes[nextId].val})? \n${isDuplicate ? 'YES! Duplicate detected.' : 'NO. They are distinct.'}`, 
                10, 
                { nodes: cloneNodes(nodes), current: currId, action: 'evalCondition', removedId: null, isDuplicate }
            );

            if (isDuplicate) {
                let removedId = nextId;
                let newNextId = nodes[nextId].next;
                
                nodes[currId].next = newNextId;
                
                addStep(
                    "Bypass Duplicate Node", 
                    `Line 12: current.next = current.next.next;\n\nWe sever the link to the duplicate node [${nodes[removedId].val}]. The 'current' node's next pointer now bypasses it directly to the following node. \nNote: We DO NOT advance 'current' yet, because the newly attached node might also be a duplicate!`, 
                    12, 
                    { nodes: cloneNodes(nodes), current: currId, action: 'bypass', removedId }
                );
            } else {
                currId = nodes[currId].next;
                addStep(
                    "Advance Pointer", 
                    `Line 15: current = current.next;\n\nThe value is unique. It is safe to advance our 'current' pointer to the next node to verify the rest of the list.`, 
                    15, 
                    { nodes: cloneNodes(nodes), current: currId, action: 'advance', removedId: null }
                );
            }
        }

        addStep(
            "Loop Terminates", 
            `Line 8: while (current != null && current.next != null)\n\nWe have reached the end of the list. No more adjacent pairs to check.`, 
            8, 
            { nodes: cloneNodes(nodes), current: currId, action: 'loopEnd', removedId: null }
        );

        addStep(
            "Return Result", 
            `Line 19: return head;\n\nThe list is now completely deduplicated in-place.`, 
            19, 
            { nodes: cloneNodes(nodes), current: null, action: 'success', isSuccess: true, ans: headId, removedId: null }
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
  const { isSuccess, ans, action, nodes, current: currId, removedId, isDuplicate } = state;
  const { arr } = parsedData;

  // Flatten the linked list into an array for sequential rendering based strictly on current Next pointers
  const renderList = useMemo(() => {
      if (!nodes) return [];
      
      let ordered = [];
      let visited = new Set();
      
      let headId = arr.length > 0 ? 'node_0' : null;
      let walkId = headId;
      let safeIter = 0;

      while (walkId && safeIter < 50) {
          ordered.push(nodes[walkId]);
          visited.add(walkId);
          walkId = nodes[walkId].next;
          safeIter++;
      }

      // If a node is currently being bypassed, it won't be in the logical main list anymore,
      // but we want to render it floating/falling away!
      if (removedId && !visited.has(removedId)) {
          // Temporarily attach it for the visualizer step so it can be animated out
          // We need to find where it should sit visually. Usually right after current.
          let currIdx = ordered.findIndex(n => n.id === currId);
          if (currIdx !== -1) {
              ordered.splice(currIdx + 1, 0, { ...nodes[removedId], isDangling: true });
          }
      }

      return ordered;
  }, [nodes, arr.length, currId, removedId]);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Scissors className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Remove Duplicates List</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 83</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action === 'bypass' || action === 'evalCondition' && isDuplicate ? 'bg-rose-500/20 border-rose-500' : (action === 'advance' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-violet-500/20 border-violet-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'bypass' || action === 'evalCondition' && isDuplicate ? 'rose' : (action === 'advance' ? 'emerald' : 'violet')} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Node Pointers</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        <VariableCard label="Current Node" val={currId && nodes ? `[v:${nodes[currId].val}]` : "-"} color="purple" active={currId !== null && nodes !== undefined} />
                        <VariableCard label="Next Node" val={currId && nodes && nodes[currId].next ? `[v:${nodes[nodes[currId].next].val}]` : "-"} color="sky" active={currId !== null && nodes && nodes[currId].next !== null} />
                        <VariableCard label="Status" val={action === 'bypass' ? 'BYPASS' : (action === 'advance' ? 'ADVANCE' : '-')} color={action === 'bypass' ? 'rose' : 'emerald'} active={['bypass', 'advance'].includes(action)} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Sorted List (head)</label>
                        <input type="text" value={listInput} onChange={(e) => { setListInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="1, 1, 2, 3, 3, 3, 4" />
                        <p className="text-[9px] text-slate-400 pl-1">List will be automatically sorted to meet constraints.</p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto pb-5">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-violet-100 hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action === 'bypass' || action === 'evalCondition' && isDuplicate ? 'bg-rose-900 border-rose-800' : (action === 'advance' ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : (action === 'bypass' ? <Scissors size={100}/> : (action === 'evalCondition' && isDuplicate ? <XSquare size={100}/> : (action === 'advance' ? <ArrowRight size={100}/> : <Link size={100}/>)))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action === 'bypass' || action === 'evalCondition' && isDuplicate ? 'text-rose-400' : (action === 'advance' ? 'text-emerald-400' : 'text-violet-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'bypass' || action === 'evalCondition' && isDuplicate ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : (action === 'advance' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'))}`}>Line {cur.line}</div>
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
                      
                      {/* Comparison Evaluator View */}
                      {!isSuccess && action === 'evalCondition' && currId && nodes[currId].next && (
                          <div className="absolute top-0 flex items-center gap-3 text-lg font-mono font-black justify-center bg-slate-50 py-3 px-6 rounded-2xl border border-slate-200 shadow-sm animate-in zoom-in">
                              <span className="text-[10px] uppercase text-slate-400 tracking-widest absolute -top-2 left-4 bg-slate-50 px-1">Value Check</span>
                              <span className="text-purple-600 bg-purple-100 px-2 rounded border border-purple-200 shadow-sm">{nodes[currId].val}</span>
                              <span className="text-slate-400">==</span>
                              <span className="text-sky-600 bg-sky-100 px-2 rounded border border-sky-200 shadow-sm">{nodes[nodes[currId].next].val}</span>
                              <span className="ml-2 text-slate-300">➔</span>
                              {isDuplicate ? (
                                  <span className="text-rose-600 flex items-center gap-1 text-sm bg-rose-100 px-2 py-1 rounded-lg"><CheckSquare size={16}/> TRUE (Duplicate)</span>
                              ) : (
                                  <span className="text-emerald-600 flex items-center gap-1 text-sm bg-emerald-100 px-2 py-1 rounded-lg"><XSquare size={16}/> FALSE (Unique)</span>
                              )}
                          </div>
                      )}

                      {/* Linked List Representation */}
                      <div className="flex items-center mt-12 px-4 gap-2 md:gap-3 w-max mx-auto min-w-full justify-start md:justify-center transition-all duration-700">
                          {renderList.map((node, renderIdx) => {
                              
                              let isCurrent = node.id === currId;
                              let isNext = currId && nodes[currId] && nodes[currId].next === node.id;
                              let isBeingRemoved = node.isDangling; // The one we are bypassing in this exact step
                              
                              let isConnectorBypass = isCurrent && action === 'bypass';

                              let cls = "relative w-12 h-12 md:w-16 md:h-16 flex flex-col items-center justify-center rounded-2xl border-4 font-mono font-black text-xl md:text-2xl transition-all duration-700 z-10 shrink-0 shadow-sm ";
                              
                              if (isSuccess) {
                                  cls += "bg-emerald-50 border-emerald-400 text-emerald-800";
                              } else if (isBeingRemoved) {
                                  cls += "bg-rose-100 border-rose-500 text-rose-900 scale-95 opacity-50 shadow-none translate-y-12 rotate-12";
                              } else if (isCurrent) {
                                  cls += "bg-purple-100 border-purple-500 text-purple-900 scale-110 shadow-lg ring-4 ring-purple-300/30 z-30";
                              } else if (isNext) {
                                  cls += "bg-sky-100 border-sky-500 text-sky-900 scale-105 shadow-md ring-2 ring-sky-300/30 z-20";
                                  if (isDuplicate && action === 'evalCondition') cls = cls.replace('bg-sky-100 border-sky-500 text-sky-900', 'bg-rose-100 border-rose-500 text-rose-900 ring-rose-300/30');
                              } else {
                                  cls += "bg-white border-slate-300 text-slate-700";
                              }

                              return (
                                  <React.Fragment key={`${node.id}-${renderIdx}`}>
                                      <div className={`flex flex-col items-center relative shrink-0`}>
                                          {/* Top Pointer */}
                                          <div className="absolute -top-12 flex flex-col items-center justify-end h-10 w-full gap-1 z-40">
                                              {isCurrent && !isSuccess && (
                                                  <div className={`flex flex-col items-center animate-in slide-in-from-top-2 ${action === 'advance' ? 'animate-bounce' : ''}`}>
                                                      <span className="text-[10px] font-black font-mono tracking-widest text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded border border-purple-300 shadow-sm mb-1">current</span>
                                                      <ArrowDown size={16} className="text-purple-500" strokeWidth={3}/>
                                                  </div>
                                              )}
                                              {isNext && !isSuccess && !isBeingRemoved && (
                                                  <div className={`flex flex-col items-center animate-in slide-in-from-top-2 opacity-70`}>
                                                      <span className={`text-[9px] font-black font-mono tracking-widest px-1 py-0.5 rounded border shadow-sm mb-1 ${isDuplicate && action === 'evalCondition' ? 'text-rose-800 bg-rose-100 border-rose-300' : 'text-sky-800 bg-sky-100 border-sky-300'}`}>next</span>
                                                      <ArrowDown size={14} className={isDuplicate && action === 'evalCondition' ? 'text-rose-500' : 'text-sky-500'} strokeWidth={2}/>
                                                  </div>
                                              )}
                                          </div>

                                          {/* Node Box */}
                                          <div className={cls}>
                                              {node.val}
                                          </div>
                                          
                                          {/* Bottom Label */}
                                          <div className="absolute -bottom-6 flex flex-col items-center h-4 w-full z-40">
                                              {isBeingRemoved && (
                                                  <span className="text-[9px] font-black font-mono text-rose-500 uppercase tracking-widest animate-in fade-in bg-rose-50 px-1 rounded border border-rose-200">Dropped</span>
                                              )}
                                          </div>
                                      </div>

                                      {/* Connector Arrow */}
                                      {node.next && !isBeingRemoved && (
                                          <div className="flex flex-col items-center justify-center shrink-0 px-2 text-slate-300 transition-all duration-500 relative">
                                              <ArrowRight size={24} strokeWidth={2} className={isConnectorBypass ? 'text-rose-400' : (action === 'advance' && isCurrent ? 'text-emerald-400' : 'text-slate-300')} />
                                              
                                              {isConnectorBypass && (
                                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-rose-600 animate-in zoom-in spin-in shadow-xl bg-white rounded-full">
                                                      <Scissors size={20}/>
                                                  </div>
                                              )}
                                          </div>
                                      )}
                                      
                                      {/* Null Terminator */}
                                      {!node.next && !isBeingRemoved && (
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
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">DEDUPLICATION COMPLETE</span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Returned modified head
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
                <Scissors className="text-violet-600"/> Linked List Deletion
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Unlike arrays where deleting an element requires shifting all subsequent elements $O(N)$, deleting a node in a Linked List is strictly an $O(1)$ operation. You simply change the <code>next</code> pointer of the preceding node to completely bypass the target.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Layers size={18}/> Exploiting Sorted Data
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            If the linked list was unsorted (e.g. <code>2 -&gt; 1 -&gt; 2</code>), finding duplicates would require an auxiliary <code>HashSet</code> to remember which values we've seen before.
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-2">
                            <p>Because the list is explicitly <strong>sorted</strong>, all identical values are guaranteed to be clustered together seamlessly (e.g. <code>1 -&gt; 2 -&gt; 2</code>).</p>
                            <p>This transforms the problem. We don't need memory; we just need to compare adjacent neighbors!</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Target size={18}/> The Chained Duplicate Trap
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            A common mistake is advancing the pointer immediately after a deletion.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>Consider the list: <code>1 -&gt; 1 -&gt; 1</code></p>
                            <p>If <code>current</code> is at the first '1', it deletes the second '1'. The list is now <code>1 -&gt; 1</code>.</p>
                            <p>If we advance <code>current</code> now, it lands on the last '1', and the loop terminates. The final list still has duplicates!</p>
                            <p><strong>Solution:</strong> Only advance <code>current = current.next</code> in the <code>else</code> block, ensuring we verify the newly attached node.</p>
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
                        "To solve this, I leveraged the fact that the linked list is sorted, which guarantees all duplicates are adjacent. This allows for an optimal single-pass $O(N)$ algorithm with $O(1)$ extra space. I initialize a `current` pointer to traverse the list. As long as `current` and `current.next` are not null, I compare their values. If they match, I found a duplicate and simply bypass it by assigning `current.next = current.next.next`. Crucially, I do *not* advance the `current` pointer yet, as the newly linked node might also be a duplicate of the same value. If the values differ, the current node is safely unique, and I advance the pointer. Because no dummy nodes are required, I return the original `head` when the traversal is complete."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Does bypassing cause memory leaks?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                In managed languages like Java, C#, or Python, bypassing a node perfectly removes the only active reference to it (assuming nothing else points to it). The Garbage Collector automatically cleans it up later. In C/C++, you would explicitly need to call <code>delete</code> or <code>free()</code> on the bypassed pointer to prevent a memory leak!
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
                                <p className="text-[10px] text-slate-500 mt-1">We touch each node in the list exactly once. While a node might be compared multiple times if it's the anchor for a chained duplicate deletion, the total operations scale strictly linearly with the number of nodes.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We achieve pure constant space. Only a single reference pointer (`current`) is allocated, modifying the list architecture entirely in-place.</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|deleteDuplicates|head|current|next|val)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['deleteDuplicates', 'val'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['head', 'current', 'next'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default RemoveDuplicatesListVisualizer;