import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ListOrdered, ArrowRight, XSquare, Hash, 
  Network, Scissors, Link as LinkIcon, SkipForward, Timer
} from 'lucide-react';

const APPROACHES = {
  twopointers: {
    id: 'twopointers',
    title: 'Dummy Node & Two Pointers',
    subtitle: 'Optimal: O(N) Time, O(1) Space.',
    icon: <LinkIcon size={16} />,
    complexity: 'Time: O(N) | Space: O(1)', 
    code: `class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        // 1. Create a dummy node to handle edge cases easily
        ListNode dummy = new ListNode(0, head);
        ListNode prev = dummy;
        
        // 2. Traverse the list
        while (head != null) {
            // 3. If we find a sequence of duplicates
            if (head.next != null && head.val == head.next.val) {
                // Skip all nodes with the identical value
                while (head.next != null && head.val == head.next.val) {
                    head = head.next;
                }
                // 4. Bypass the duplicates: connect prev to the node AFTER duplicates
                prev.next = head.next;
            } else {
                // 5. No duplicates, move prev forward safely
                prev = prev.next;
            }
            // 6. Move head forward to evaluate the next sequence
            head = head.next;
        }
        
        return dummy.next;
    }
}`,
    explanation: "Since the head of the list might be a duplicate and need to be removed, we use a `dummy` node that points to the head. We maintain a `prev` pointer initialized to `dummy`. As we iterate with `head`, we check if the current node and the next node share the same value. If they do, we advance `head` until the end of the duplicates, and rewire `prev.next` to skip the entire duplicate sublist (`prev.next = head.next`). If they don't, we simply advance `prev`. This guarantees `prev` only points to distinct elements."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">82. Remove Duplicates from Sorted List II</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given the <code>head</code> of a sorted linked list, <em>delete all nodes that have duplicate numbers, leaving only distinct numbers from the original list</em>. Return the linked list <strong>sorted</strong> as well.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4 flex flex-col items-start gap-2">
              <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-bold">Input:</span> 
                  <span className="bg-white px-3 py-1 rounded border border-slate-200">head = [1,2,3,3,4,4,5]</span>
              </div>
              <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-bold">Output:</span> 
                  <span className="bg-white px-3 py-1 rounded border border-slate-200">[1,2,5]</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4 flex flex-col items-start gap-2">
              <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-bold">Input:</span> 
                  <span className="bg-white px-3 py-1 rounded border border-slate-200">head = [1,1,1,2,3]</span>
              </div>
              <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-bold">Output:</span> 
                  <span className="bg-white px-3 py-1 rounded border border-slate-200">[2,3]</span>
              </div>
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

const RemoveDuplicatesSortedListVisualizer = () =>{
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('twopointers');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  // Default input array
  const [listInput, setListInput] = useState('1, 2, 3, 3, 4, 4, 5');

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    // Parse input string to array of numbers
    let rawStr = listInput.trim();
    if (!rawStr) rawStr = "1, 2, 3, 3, 4, 4, 5";
    
    let numsArr = rawStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    // Fallback if empty
    if (numsArr.length === 0) numsArr = [1, 2, 3, 3, 4, 4, 5];
    
    // Sort array just to ensure valid constraint
    numsArr.sort((a, b) => a - b);
    
    // Cap to 10 elements for UI safety
    if (numsArr.length > 10) {
      numsArr = numsArr.slice(0, 10);
    }

    // Nodes representation: Dummy at 0, actual nodes 1..N
    let nodes = [{ id: 0, val: 'D', isDummy: true }];
    numsArr.forEach((val, i) => {
        nodes.push({ id: i + 1, val, isDummy: false });
    });

    return { nums: numsArr, nodes };
  }, [listInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { nodes } = parsedData;
    
    // Initial State Variables
    let activeLinks = {};
    for (let i = 0; i < nodes.length; i++) {
        activeLinks[i] = i < nodes.length - 1 ? i + 1 : null;
    }
    let deleted = new Set();
    let prev = 0; // index of dummy
    let head = 1; // index of first node

    steps.push({
        phase: 'Initialization',
        description: `Created a Dummy node at the start.\nSet \`prev\` to point to Dummy.\nSet \`head\` to point to the first node.`,
        line: 4,
        state: { nodes, activeLinks: { ...activeLinks }, deleted: new Set(deleted), prev, head, action: 'init' }
    });

    while (head !== null && head < nodes.length) {
        steps.push({
            phase: `Traverse: Evaluate Node ${nodes[head].val}`,
            description: `Checking if \`head\` (${nodes[head].val}) and \`head.next\` have duplicate values.`,
            line: 7,
            state: { nodes, activeLinks: { ...activeLinks }, deleted: new Set(deleted), prev, head, action: 'eval' }
        });

        let nextIdx = activeLinks[head];
        
        if (nextIdx !== null && nodes[head].val === nodes[nextIdx].val) {
            // Duplicate sublist detected
            steps.push({
                phase: `Duplicate Detected!`,
                description: `Value ${nodes[head].val} is identical to the next node. Entering duplicate skipping loop.`,
                line: 9,
                state: { nodes, activeLinks: { ...activeLinks }, deleted: new Set(deleted), prev, head, action: 'dup_found' }
            });

            let dupVal = nodes[head].val;
            
            while (head !== null && head < nodes.length && nodes[head].val === dupVal) {
                deleted.add(head);
                steps.push({
                    phase: `Skipping Duplicate`,
                    description: `Node with value ${dupVal} marked for deletion.\nAdvancing \`head\` pointer.`,
                    line: 11,
                    state: { nodes, activeLinks: { ...activeLinks }, deleted: new Set(deleted), prev, head, action: 'skip_dup' }
                });
                head = activeLinks[head];
            }

            // Rewire prev.next
            activeLinks[prev] = head;
            steps.push({
                phase: `Bypass Duplicates`,
                description: `Reached end of duplicates for ${dupVal}.\nRewiring \`prev.next\` to bypass the deleted sublist, pointing to node ${head !== null ? nodes[head].val : 'null'}.`,
                line: 14,
                state: { nodes, activeLinks: { ...activeLinks }, deleted: new Set(deleted), prev, head, action: 'rewire' }
            });

        } else {
            // No duplicate
            prev = head;
            steps.push({
                phase: `No Duplicate Found`,
                description: `Node ${nodes[head].val} is distinct so far.\nSafely advancing \`prev\` to point to it.`,
                line: 17,
                state: { nodes, activeLinks: { ...activeLinks }, deleted: new Set(deleted), prev, head, action: 'safe_advance' }
            });
            head = activeLinks[head];
        }

        // Technically the java loop does `head = head.next` unconditionally at the end of the block 
        // in combination with standard list traversal, but my loop structure simulated the bypass correctly.
        // Wait, looking at the code provided:
        // if (head.val == head.next.val) { ... prev.next = head.next; }
        // then head = head.next;
        // This means head points to the last duplicate, prev.next = head.next, THEN head = head.next.
        // My simulation did `head = head.next` until it broke the loop, so `head` points to the exact node.
        // To match the exact code lines:
        if (head !== null && activeLinks[prev] !== head) {
            // Just aligning states conceptually.
        }
    }

    steps.push({
        phase: 'Algorithm Complete',
        description: `Reached the end of the list (\`head\` is null).\nReturning \`dummy.next\` as the new head of the cleaned list.`,
        line: 22,
        state: { nodes, activeLinks: { ...activeLinks }, deleted: new Set(deleted), prev, head: null, action: 'complete', isSuccess: true }
    });

    return steps;
  }, [parsedData]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedApproach.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0] || { state: {} };
  const s = cur.state || {};

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-fuchsia-600 p-4 rounded-2xl shadow-lg shadow-fuchsia-100 flex items-center justify-center">
                <Scissors className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Remove Duplicates II</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-fuchsia-600 bg-fuchsia-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 82</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Linked List / Two Pointers</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto">
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
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-fuchsia-600 border-fuchsia-600 text-white shadow-fuchsia-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-fuchsia-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-fuchsia-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-fuchsia-100' : 'text-slate-400'}`}>
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
                      <Code2 size={14} className="text-fuchsia-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${s.isSuccess || s.action === 'complete' ? 'bg-emerald-500/20 border-emerald-500' : (s.action === 'dup_found' || s.action === 'skip_dup' ? 'bg-rose-500/20 border-rose-500' : (s.action === 'rewire' || s.action === 'safe_advance' ? 'bg-fuchsia-500/20 border-fuchsia-500' : 'bg-slate-500/20 border-slate-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={s.isSuccess || s.action === 'complete' ? 'emerald' : (s.action === 'dup_found' || s.action === 'skip_dup' ? 'rose' : 'fuchsia')} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-fuchsia-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Iteration Variables</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="Prev Pointer" val={s.prev !== null && s.nodes[s.prev] ? (s.nodes[s.prev].isDummy ? 'Dummy' : s.nodes[s.prev].val) : "-"} color="purple" active={s.prev !== null} />
                        <VariableCard label="Head Pointer" val={s.head !== null && s.nodes[s.head] ? s.nodes[s.head].val : "null"} color="sky" active={s.head !== null} />
                        <VariableCard label="Is Duplicate?" val={s.action === 'dup_found' || s.action === 'skip_dup' ? 'YES' : (s.action === 'eval' ? '?' : 'NO')} color="rose" active={s.action === 'dup_found' || s.action === 'skip_dup'} />
                        <VariableCard label="Deleted Nodes" val={s.deleted ? s.deleted.size : "-"} color="amber" active={s.deleted && s.deleted.size > 0} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-end shrink-0">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-fuchsia-600 uppercase block pl-1 tracking-widest font-mono">Input Linked List (CSV)</label>
                        <input type="text" value={listInput} onChange={(e) => { setListInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-sm shadow-inner tracking-widest font-bold text-slate-700 outline-none focus:ring-2 focus:ring-fuchsia-500" placeholder="1, 2, 3, 3, 4, 4, 5" />
                        <p className="text-[9px] text-slate-400 pl-1 font-mono">Max 10 nodes for visualization</p>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto pb-5">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 sm:flex-none sm:w-16 px-4 py-2.5 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] sm:flex-none sm:w-28 px-4 py-2.5 bg-fuchsia-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-md shadow-fuchsia-200 hover:bg-fuchsia-700 transition-all flex items-center justify-center gap-1">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group shrink-0 ${s.isSuccess || s.action === 'complete' ? 'bg-emerald-900 border-emerald-800' : (s.action === 'dup_found' || s.action === 'skip_dup' ? 'bg-rose-900 border-rose-800' : (s.action === 'rewire' || s.action === 'safe_advance' ? 'bg-fuchsia-900 border-fuchsia-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {s.isSuccess || s.action === 'complete' ? <Check size={100}/> : (s.action === 'skip_dup' ? <XSquare size={100}/> : (s.action === 'rewire' ? <SkipForward size={100}/> : <Activity size={100}/>))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={s.isSuccess || s.action === 'complete' ? "text-emerald-400" : (s.action === 'dup_found' || s.action === 'skip_dup' ? 'text-rose-400' : (s.action === 'rewire' || s.action === 'safe_advance' ? 'text-fuchsia-400' : 'text-slate-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${s.isSuccess || s.action === 'complete' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (s.action === 'dup_found' || s.action === 'skip_dup' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : (s.action === 'rewire' || s.action === 'safe_advance' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'))}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-3 uppercase font-mono text-white flex items-center gap-3 relative z-10">
                      {cur.phase}
                  </div>
                  <div className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 font-mono whitespace-pre-line overflow-y-auto max-h-[100px] scrollbar-thin relative z-10">
                      {cur.description}
                  </div>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner items-start justify-center pt-8 min-h-[460px] overflow-x-auto">
                   
                   <div className="flex items-center w-max min-w-full h-full relative z-10 gap-8 py-20 px-10">
                      
                      {/* Linked List Nodes */}
                      {s.nodes && s.nodes.map((node, index) => {
                          const isDummy = node.isDummy;
                          const isDeleted = s.deleted.has(index);
                          const isPrev = s.prev === index;
                          const isHead = s.head === index;
                          const nextIdx = s.activeLinks[index];
                          const hasBypass = nextIdx !== null && nextIdx > index + 1 && isPrev;
                          
                          let boxClass = "w-14 h-14 flex items-center justify-center font-mono font-black text-xl rounded-xl transition-all duration-500 border-4 relative shrink-0 z-20 ";
                          let labelText = "";
                          let labelColor = "";

                          if (isDeleted) {
                              boxClass += "bg-slate-100 border-slate-200 text-slate-300 scale-90 translate-y-6 opacity-60";
                          } else if (isHead && (s.action === 'eval' || s.action === 'dup_found')) {
                              boxClass += "bg-sky-100 border-sky-400 text-sky-800 scale-110 shadow-lg shadow-sky-200";
                          } else if (isPrev) {
                              boxClass += "bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 scale-110 shadow-lg shadow-fuchsia-200";
                          } else if (isDummy) {
                              boxClass += "bg-slate-800 border-slate-700 text-white";
                          } else {
                              boxClass += "bg-white border-slate-300 text-slate-700 shadow-sm";
                          }

                          // Determine Pointers Labels
                          if (isPrev && isHead) {
                             labelText = "prev, head"; labelColor = "text-fuchsia-600";
                          } else if (isPrev) {
                             labelText = "prev"; labelColor = "text-fuchsia-600";
                          } else if (isHead) {
                             labelText = "head"; labelColor = "text-sky-600";
                          }

                          return (
                              <div key={`node-${index}`} className="flex flex-col items-center relative shrink-0 group">
                                  {/* Pointer Labels */}
                                  <div className="absolute -top-10 flex flex-col items-center h-8 justify-end w-32">
                                      {labelText && (
                                          <>
                                             <span className={`text-[10px] font-black uppercase font-mono tracking-widest ${labelColor} bg-white px-2 py-0.5 rounded shadow-sm border ${isPrev ? 'border-fuchsia-200' : 'border-sky-200'} mb-1`}>{labelText}</span>
                                             <div className={`w-0.5 h-3 ${isPrev ? 'bg-fuchsia-500' : 'bg-sky-400'}`}></div>
                                          </>
                                      )}
                                  </div>

                                  <div className={boxClass}>
                                      {node.val}
                                      {isDeleted && <XSquare size={24} className="absolute text-rose-400/50 -rotate-12" strokeWidth={3}/>}
                                  </div>

                                  {/* Node Index */}
                                  <div className="absolute -bottom-6 text-[10px] font-mono text-slate-400">
                                      {isDummy ? 'dummy' : `[${index-1}]`}
                                  </div>

                                  {/* Connecting Arrow */}
                                  {index < s.nodes.length - 1 && !isDeleted && (
                                      <div className={`absolute top-1/2 -right-8 w-8 flex items-center justify-center -translate-y-1/2 z-10 transition-opacity duration-300 ${nextIdx === null ? 'opacity-0' : 'opacity-100'}`}>
                                          <ArrowRight size={20} className={isPrev && s.action === 'rewire' ? "text-fuchsia-500 animate-pulse" : "text-slate-300"}/>
                                      </div>
                                  )}

                                  {/* Bypass Curving Arrow SVG Overlay (Logical mapping to activeLinks) */}
                                  {hasBypass && (
                                      <svg className="absolute top-1/2 left-full overflow-visible pointer-events-none z-30" style={{ width: `${(nextIdx - index) * 88 - 14}px`, height: '60px' }}>
                                          <path 
                                            d={`M 0,0 C ${(nextIdx - index)*44}, -80 ${(nextIdx - index)*44}, -80 ${(nextIdx - index)*88 - 24}, 0`} 
                                            fill="transparent" 
                                            stroke="currentColor" 
                                            strokeWidth="3" 
                                            strokeDasharray="5,5"
                                            className="text-fuchsia-500"
                                            markerEnd="url(#arrowhead)"
                                          />
                                          <defs>
                                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                              <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-fuchsia-500"/>
                                            </marker>
                                          </defs>
                                      </svg>
                                  )}
                              </div>
                          );
                      })}
                      
                      {/* End Null Indicator */}
                      <div className="flex flex-col items-center shrink-0">
                          <div className="text-sm font-mono font-black text-slate-300 border-2 border-dashed border-slate-300 w-14 h-14 rounded-xl flex items-center justify-center">
                              null
                          </div>
                      </div>

                   </div>

                  {/* Final Overlays */}
                  {s.isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600`}>
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">CLEANUP COMPLETE</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Duplicates gracefully bypassed
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
                <LinkIcon className="text-fuchsia-600"/> The Dummy Node Pattern
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-fuchsia-100 pl-6">
                When modifying a linked list, especially when the <code>head</code> itself might be deleted or altered, inserting a "Dummy Node" at the very beginning drastically simplifies logic by eliminating edge cases.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-indigo-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Layers size={18}/> Tracking "Prev"
                        </h3>
                        <p className="text-sm text-indigo-800 leading-relaxed mb-4">
                            To delete a node in a singly linked list, you need access to the node <em>immediately preceding</em> it so you can reroute its pointer.
                        </p>
                        <div className="text-xs text-indigo-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-indigo-200 shadow-inner space-y-3">
                            <p>We use a <code>prev</code> pointer to keep track of the last known "safe" node (a distinct node that will remain in the list).</p>
                            <p>If we discover the next few nodes are duplicates, we keep <code>prev</code> parked safely. We use our traversing pointer to scan past all the identical values.</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-rose-50 border border-rose-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-rose-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Scissors size={18}/> Bypassing the Duplicates
                        </h3>
                        <p className="text-xs text-rose-800 leading-relaxed mb-4">
                            Once our scanner pointer has reached the <em>last</em> duplicate of the current run, we perform the bypass.
                        </p>
                        <div className="text-xs text-rose-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-rose-200 shadow-inner space-y-2">
                            <p>We execute: <code>prev.next = head.next</code>.</p>
                            <p>This single command effectively snips the entire sequence of duplicates out of the active chain.</p>
                            <p>Note: We do <strong>not</strong> advance <code>prev</code> here, because the newly attached <code>head.next</code> node might be the start of a <em>different</em> sequence of duplicates! We must evaluate it on the next loop iteration.</p>
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
                        "To solve Remove Duplicates II, I use a dummy node pointing to the head to handle cases where the head itself needs deletion. I maintain a `prev` pointer initialized to the dummy, acting as the tail of our cleaned list. I iterate with `head`. If `head` and `head.next` have the same value, it's a duplicate run. I advance `head` to the end of this run, then bypass the run by setting `prev.next = head.next`. If they don't match, I simply advance `prev`. Because I traverse the list exactly once and modify pointers in place, the time complexity is O(N) and space complexity is O(1)."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-fuchsia-500"/> FAQ: Why not just `prev = head.next`?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                A common mistake is updating <code>prev = prev.next</code> immediately after linking <code>prev.next = head.next</code>.
                                <br/><br/>
                                This fails for adjacent duplicate clusters, like `[1, 2, 2, 3, 3]`. If you bypass the `2`s and link `1 -&gt; 3`, and immediately advance `prev` to point to `3`, you lose the ability to delete the `3`s! You must wait for the next while loop iteration to confirm the newly linked `3` is distinct before advancing `prev`.
                            </div>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <Timer size={14} className="text-fuchsia-500"/> Time & Space Complexity
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Time Complexity</span>
                                <span className="text-sm font-bold text-fuchsia-600 bg-fuchsia-50 px-2 py-1 rounded">O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We visit every node in the linked list exactly once. The inner while loop merely fast-forwards the outer loop's pointer, so it remains strictly linear.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-fuchsia-600 bg-fuchsia-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We only allocate two pointers (`dummy` and `prev`) regardless of the size of the input list. It operates entirely in-place.</p>
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
        cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700',
        teal: 'bg-teal-50 border-teal-200 text-teal-700',
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        sky: 'bg-sky-50 border-sky-200 text-sky-700',
        rose: 'bg-rose-50 border-rose-200 text-rose-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        slate: 'bg-slate-100 border-slate-300 text-slate-700',
        indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        fuchsia: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700'
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-fuchsia-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 shrink-0'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'fuchsia' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|ListNode|deleteDuplicates)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'ListNode'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['deleteDuplicates'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['dummy', 'prev', 'head', 'val', 'next'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default RemoveDuplicatesSortedListVisualizer;