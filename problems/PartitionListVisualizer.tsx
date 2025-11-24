import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, GitMerge, SplitSquareHorizontal,
  ArrowRight, Scissors, Link as LinkIcon, Network, MoveRight, XSquare, CheckSquare
} from 'lucide-react';

const APPROACHES = {
  twoPointers: {
    id: 'twoPointers',
    title: 'Two Pointers (Dummy Nodes)',
    subtitle: 'Optimal: O(N) Time, O(1) Space.',
    icon: <SplitSquareHorizontal size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public ListNode partition(ListNode head, int x) {
        // 1. Initialize two dummy nodes to start our two partitions
        ListNode lessHead = new ListNode(0);
        ListNode greaterHead = new ListNode(0);
        
        // 2. Create pointers to build the lists
        ListNode less = lessHead;
        ListNode greater = greaterHead;
        
        ListNode curr = head;
        
        // 3. Traverse the original list and distribute nodes
        while (curr != null) {
            if (curr.val < x) {
                less.next = curr;
                less = less.next;
            } else {
                greater.next = curr;
                greater = greater.next;
            }
            curr = curr.next;
        }
        
        // 4. Connect the end of 'less' to the start of 'greater'
        less.next = greaterHead.next;
        
        // 5. Terminate the 'greater' list to prevent cycles!
        greater.next = null;
        
        return lessHead.next;
    }
}`,
    explanation: "To partition a linked list while maintaining the original relative order of nodes, trying to swap nodes in-place is extremely messy and prone to null-pointer exceptions. The elegant solution is to create two entirely separate 'virtual' linked lists: one for nodes strictly less than `x`, and one for nodes greater than or equal to `x`. We use Dummy Nodes (`lessHead` and `greaterHead`) to easily handle edge cases where one of these partitions might be completely empty. \n\nWe iterate through the original list using a `curr` pointer. If `curr.val < x`, we append it to our `less` list. Otherwise, we append it to our `greater` list. After traversing the entire list, we simply wire the tail of the `less` list to the head of the `greater` list (skipping its dummy node). Finally, we MUST set `greater.next = null` to severe any lingering old connections and prevent an infinite cycle!"
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">86. Partition List</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given the <code>head</code> of a linked list and a value <code>x</code>, partition it such that all nodes <strong>less than</strong> <code>x</code> come before nodes <strong>greater than or equal</strong> to <code>x</code>.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-violet-500 pl-4 bg-violet-50 py-2 mt-4">
          You should <strong>preserve</strong> the original relative order of the nodes in each of the two partitions.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              <div className="flex items-center gap-4 text-slate-400 font-bold overflow-x-auto pb-2">
                 <span className="text-slate-800">1</span> <MoveRight size={14}/> 
                 <span className="text-slate-800">4</span> <MoveRight size={14}/> 
                 <span className="text-slate-800">3</span> <MoveRight size={14}/> 
                 <span className="text-slate-800">2</span> <MoveRight size={14}/> 
                 <span className="text-slate-800">5</span> <MoveRight size={14}/> 
                 <span className="text-slate-800">2</span>
              </div>
              <p><span className="text-slate-400 font-bold">Input:</span> head = [1,4,3,2,5,2], x = 3</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [1,2,2,4,3,5]</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: The nodes less than 3 are 1, 2, and 2. They are moved to the front while maintaining their relative order. The remaining nodes 4, 3, and 5 follow, also in their original relative order.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> head = [2,1], x = 2</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [1,2]</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li>The number of nodes in the list is in the range <code>[0, 200]</code>.</li>
              <li><code>-100 &lt;= Node.val &lt;= 100</code></li>
              <li><code>-200 &lt;= x &lt;= 200</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const PartitionListVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('twoPointers');
  
  const [listInput, setListInput] = useState('1, 4, 3, 2, 5, 2');
  const [xInput, setXInput] = useState('3');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let arr = listInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    let x = parseInt(xInput.trim(), 10);
    
    if (isNaN(x)) x = 3;
    if (arr.length === 0) arr = [1, 4, 3, 2, 5, 2];
    
    // UI Safety cap
    if (arr.length > 10) arr = arr.slice(0, 10);

    return { arr, x };
  }, [listInput, xInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { arr, x } = parsedData;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'twoPointers') {
        
        let lessList = [];
        let greaterList = [];
        let currIdx = 0;

        addStep(
            "Initialization", 
            `Line 3-8: Initialize dummy nodes and pointers.\n\nlessHead and greaterHead act as anchors. We set 'curr' to the start of the original list.`, 
            8, 
            { arr, x, currIdx: 0, lessList: [...lessList], greaterList: [...greaterList], action: 'init' }
        );

        while (currIdx < arr.length) {
            let val = arr[currIdx];
            let isLess = val < x;
            
            addStep(
                "Evaluate Node", 
                `Line 12: if (curr.val < x)\n\nComparing current node value [${val}] with x (${x}).\nIs ${val} < ${x}? ${isLess ? 'YES.' : 'NO.'}`, 
                12, 
                { arr, x, currIdx, lessList: [...lessList], greaterList: [...greaterList], action: 'evalNode', isLess }
            );

            if (isLess) {
                lessList.push(val);
                addStep(
                    "Append to Less List", 
                    `Line 13-14: less.next = curr; less = less.next;\n\nBecause ${val} < ${x}, we wire it to the end of our 'less' partition list and advance the 'less' pointer.`, 
                    14, 
                    { arr, x, currIdx, lessList: [...lessList], greaterList: [...greaterList], action: 'appendLess' }
                );
            } else {
                greaterList.push(val);
                addStep(
                    "Append to Greater List", 
                    `Line 16-17: greater.next = curr; greater = greater.next;\n\nBecause ${val} >= ${x}, we wire it to the end of our 'greater' partition list and advance the 'greater' pointer.`, 
                    17, 
                    { arr, x, currIdx, lessList: [...lessList], greaterList: [...greaterList], action: 'appendGreater' }
                );
            }

            currIdx++;
            if (currIdx < arr.length) {
                addStep(
                    "Advance Curr Pointer", 
                    `Line 19: curr = curr.next;\n\nAdvance to the next node in the original list.`, 
                    19, 
                    { arr, x, currIdx, lessList: [...lessList], greaterList: [...greaterList], action: 'advance' }
                );
            } else {
                addStep(
                    "End of Traversal", 
                    `Line 11: while (curr != null)\n\nReached the end of the original list. Traversal is complete.`, 
                    11, 
                    { arr, x, currIdx: null, lessList: [...lessList], greaterList: [...greaterList], action: 'loopEnd' }
                );
            }
        }

        addStep(
            "Connect Partitions", 
            `Line 23: less.next = greaterHead.next;\n\nWe connect the tail of our 'less' list directly to the first real node of our 'greater' list (skipping the dummy node).`, 
            23, 
            { arr, x, currIdx: null, lessList: [...lessList], greaterList: [...greaterList], action: 'connectLists' }
        );

        addStep(
            "Prevent Cycles", 
            `Line 26: greater.next = null;\n\nCRITICAL STEP: The last node in the 'greater' list might still have its original 'next' pointer pointing to some node in the 'less' list. We must set it to null to sever the old connection and prevent an infinite loop!`, 
            26, 
            { arr, x, currIdx: null, lessList: [...lessList], greaterList: [...greaterList], action: 'terminateGreater' }
        );

        addStep(
            "Return Result", 
            `Line 28: return lessHead.next;\n\nWe return the first real node of our new partitioned list!`, 
            28, 
            { arr, x, currIdx: null, lessList: [...lessList], greaterList: [...greaterList], action: 'success', isSuccess: true }
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
  const { isSuccess, action, arr, x, currIdx, lessList, greaterList, isLess } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <SplitSquareHorizontal className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Partition List</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 86</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Linked List / Two Pointers</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action === 'appendGreater' || action === 'terminateGreater' ? 'bg-amber-500/20 border-amber-500' : (action === 'appendLess' || action === 'connectLists' ? 'bg-sky-500/20 border-sky-500' : 'bg-violet-500/20 border-violet-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'appendGreater' || action === 'terminateGreater' ? 'amber' : (action === 'appendLess' || action === 'connectLists' ? 'sky' : 'violet')} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Variables</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="Target (x)" val={x !== null && x !== undefined ? x : "-"} color="slate" active={x !== null && x !== undefined} />
                        <VariableCard label="Curr Val" val={currIdx !== null && currIdx !== undefined && arr ? arr[currIdx] : "-"} color="purple" active={currIdx !== null && currIdx !== undefined} />
                        <VariableCard label="Less Size" val={lessList ? lessList.length : "-"} color="sky" active={lessList !== undefined} />
                        <VariableCard label="Greater Size" val={greaterList ? greaterList.length : "-"} color="amber" active={greaterList !== undefined} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Linked List (head)</label>
                        <input type="text" value={listInput} onChange={(e) => { setListInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="1, 4, 3, 2, 5, 2" />
                    </div>
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Partition (x)</label>
                        <input type="number" value={xInput} onChange={(e) => { setXInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate font-bold text-violet-700" placeholder="3" />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto pb-1">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-violet-100 hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action === 'appendGreater' || action === 'terminateGreater' ? 'bg-amber-900 border-amber-800' : (action === 'appendLess' || action === 'connectLists' ? 'bg-sky-900 border-sky-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : (action.includes('connect') ? <LinkIcon size={100}/> : (action.includes('terminate') ? <Scissors size={100}/> : (action === 'evalNode' ? (isLess ? <CheckSquare size={100}/> : <XSquare size={100}/>) : <Network size={100}/>)))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action === 'appendGreater' || action === 'terminateGreater' ? 'text-amber-400' : (action === 'appendLess' || action === 'connectLists' ? 'text-sky-400' : 'text-violet-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'appendGreater' || action === 'terminateGreater' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : (action === 'appendLess' || action === 'connectLists' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'))}`}>Line {cur.line}</div>
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
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-start justify-start pt-10">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-4 pb-8 gap-10 overflow-y-auto overflow-x-auto custom-scrollbar">
                      
                      {/* Top Row: Original List Traversal */}
                      {!isSuccess && action !== 'connectLists' && action !== 'terminateGreater' && (
                          <div className="flex flex-col w-full min-w-max border-b border-slate-200 pb-10 relative">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-6 flex items-center gap-2"><ArrowRight size={14}/> Original List Traversal</span>
                              
                              <div className="flex items-center gap-2 px-4">
                                  {arr && arr.map((val, idx) => {
                                      let isCurr = currIdx === idx;
                                      let isProcessed = currIdx !== null && idx < currIdx;

                                      let boxClass = "relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl border-4 font-mono font-black text-xl transition-all duration-300 shrink-0 ";
                                      let textClass = "text-slate-700";

                                      if (isCurr) {
                                          boxClass += "bg-purple-100 border-purple-500 scale-110 shadow-lg ring-4 ring-purple-300/30 z-20";
                                          textClass = "text-purple-900";
                                      } else if (isProcessed) {
                                          boxClass += "bg-slate-100 border-slate-200 opacity-40 shadow-inner";
                                          textClass = "text-slate-400";
                                      } else {
                                          boxClass += "bg-white border-slate-300 shadow-sm";
                                      }

                                      return (
                                          <React.Fragment key={`orig-${idx}`}>
                                              <div className="flex flex-col items-center relative">
                                                  <div className={boxClass}>
                                                      <span className={textClass}>{val}</span>
                                                  </div>
                                                  
                                                  {/* Pointers */}
                                                  <div className="absolute -bottom-10 flex flex-col items-center h-8 w-full z-30">
                                                      {isCurr && (
                                                          <div className={`flex flex-col items-center animate-in slide-in-from-bottom-2`}>
                                                              <ArrowUp size={16} className="text-purple-500" strokeWidth={3}/>
                                                              <span className="text-[9px] font-black font-mono tracking-widest text-purple-800 bg-purple-100 px-1 py-0.5 rounded shadow-sm border border-purple-300 mt-1 leading-none">curr</span>
                                                          </div>
                                                      )}
                                                  </div>
                                              </div>
                                              
                                              {/* Connector */}
                                              {idx < arr.length - 1 && (
                                                  <MoveRight size={16} className={isProcessed ? "text-slate-200" : "text-slate-300"} />
                                              )}
                                          </React.Fragment>
                                      );
                                  })}
                                  <MoveRight size={16} className="text-slate-300" />
                                  <span className="text-slate-400 font-mono font-bold text-sm">null</span>
                              </div>

                              {/* Target Overlay */}
                              {action === 'evalNode' && currIdx !== null && (
                                  <div className="absolute top-0 right-4 bg-slate-800 text-white px-4 py-2 rounded-xl font-mono font-bold text-sm flex items-center gap-3 animate-in zoom-in shadow-xl border border-slate-700">
                                      <span>[v:{arr[currIdx]}] &lt; [x:{x}] ?</span>
                                      <span className={isLess ? "text-emerald-400" : "text-rose-400"}>{isLess ? 'TRUE' : 'FALSE'}</span>
                                  </div>
                              )}
                          </div>
                      )}

                      {/* Middle & Bottom Rows: Less and Greater Partitions */}
                      {!isSuccess && action !== 'connectLists' && action !== 'terminateGreater' && (
                          <div className="flex flex-col gap-10 w-full min-w-max">
                              
                              {/* Less List */}
                              <div className="flex flex-col w-full relative">
                                  <span className="text-[10px] font-black uppercase text-sky-600 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded w-max tracking-widest font-mono mb-4 flex items-center gap-2">Less Partition (&lt; {x})</span>
                                  <div className="flex items-center gap-2 px-4 h-16">
                                      {/* Dummy Node */}
                                      <div className="relative w-10 h-10 flex flex-col items-center justify-center rounded-full border-2 border-dashed border-slate-400 bg-slate-50 text-slate-400 font-mono font-bold text-xs shrink-0">
                                          Dum
                                          <div className="absolute -bottom-8 flex flex-col items-center w-full z-30">
                                              <span className="text-[8px] font-black font-mono text-slate-500 bg-slate-200 px-1 py-0.5 rounded leading-none">head</span>
                                          </div>
                                      </div>
                                      <MoveRight size={16} className="text-sky-300" />

                                      {/* Appended Nodes */}
                                      {lessList && lessList.map((val, idx) => {
                                          let isLast = idx === lessList.length - 1;
                                          let isNew = isLast && action === 'appendLess';

                                          let boxClass = "relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl border-4 font-mono font-black text-xl transition-all duration-300 shrink-0 ";
                                          
                                          if (isNew) {
                                              boxClass += "bg-sky-100 border-sky-500 text-sky-900 scale-110 shadow-lg ring-4 ring-sky-300/30 z-20 animate-in slide-in-from-top-4";
                                          } else {
                                              boxClass += "bg-sky-50 border-sky-300 text-sky-800 shadow-sm";
                                          }

                                          return (
                                              <React.Fragment key={`less-${idx}`}>
                                                  <div className="flex flex-col items-center relative">
                                                      <div className={boxClass}>
                                                          {val}
                                                      </div>
                                                      <div className="absolute -bottom-10 flex flex-col items-center h-8 w-full z-30">
                                                          {isLast && (
                                                              <div className={`flex flex-col items-center animate-in slide-in-from-bottom-2`}>
                                                                  <ArrowUp size={14} className="text-sky-500" strokeWidth={3}/>
                                                                  <span className="text-[9px] font-black font-mono tracking-widest text-sky-800 bg-sky-100 px-1 py-0.5 rounded shadow-sm border border-sky-300 mt-1 leading-none">less</span>
                                                              </div>
                                                          )}
                                                      </div>
                                                  </div>
                                                  <MoveRight size={16} className={isNew ? "text-sky-500 animate-pulse" : "text-sky-300"} />
                                              </React.Fragment>
                                          )
                                      })}
                                      {/* Null Terminator */}
                                      <span className="text-sky-300 font-mono font-bold text-sm">null</span>
                                  </div>
                              </div>

                              {/* Greater List */}
                              <div className="flex flex-col w-full relative">
                                  <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded w-max tracking-widest font-mono mb-4 flex items-center gap-2">Greater Partition (≥ {x})</span>
                                  <div className="flex items-center gap-2 px-4 h-16">
                                      {/* Dummy Node */}
                                      <div className="relative w-10 h-10 flex flex-col items-center justify-center rounded-full border-2 border-dashed border-slate-400 bg-slate-50 text-slate-400 font-mono font-bold text-xs shrink-0">
                                          Dum
                                          <div className="absolute -bottom-8 flex flex-col items-center w-full z-30">
                                              <span className="text-[8px] font-black font-mono text-slate-500 bg-slate-200 px-1 py-0.5 rounded leading-none">head</span>
                                          </div>
                                      </div>
                                      <MoveRight size={16} className="text-amber-300" />

                                      {/* Appended Nodes */}
                                      {greaterList && greaterList.map((val, idx) => {
                                          let isLast = idx === greaterList.length - 1;
                                          let isNew = isLast && action === 'appendGreater';

                                          let boxClass = "relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl border-4 font-mono font-black text-xl transition-all duration-300 shrink-0 ";
                                          
                                          if (isNew) {
                                              boxClass += "bg-amber-100 border-amber-500 text-amber-900 scale-110 shadow-lg ring-4 ring-amber-300/30 z-20 animate-in slide-in-from-top-4";
                                          } else {
                                              boxClass += "bg-amber-50 border-amber-300 text-amber-800 shadow-sm";
                                          }

                                          return (
                                              <React.Fragment key={`greater-${idx}`}>
                                                  <div className="flex flex-col items-center relative">
                                                      <div className={boxClass}>
                                                          {val}
                                                      </div>
                                                      <div className="absolute -bottom-10 flex flex-col items-center h-8 w-full z-30">
                                                          {isLast && (
                                                              <div className={`flex flex-col items-center animate-in slide-in-from-bottom-2`}>
                                                                  <ArrowUp size={14} className="text-amber-500" strokeWidth={3}/>
                                                                  <span className="text-[9px] font-black font-mono tracking-widest text-amber-800 bg-amber-100 px-1 py-0.5 rounded shadow-sm border border-amber-300 mt-1 leading-none">gtr</span>
                                                              </div>
                                                          )}
                                                      </div>
                                                  </div>
                                                  <MoveRight size={16} className={isNew ? "text-amber-500 animate-pulse" : "text-amber-300"} />
                                              </React.Fragment>
                                          )
                                      })}
                                      {/* Null Terminator */}
                                      <span className="text-amber-300 font-mono font-bold text-sm">null</span>
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* Final Combination View (Connect / Terminate / Success) */}
                      {(isSuccess || action === 'connectLists' || action === 'terminateGreater') && (
                           <div className="flex flex-col items-center justify-center w-full h-full min-w-max mt-10">
                                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest font-mono mb-8 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 shadow-sm flex items-center gap-2"><GitMerge size={16}/> Final Partitioned List</span>
                                
                                <div className="flex items-center gap-2 px-4 h-24">
                                      
                                      {/* Less Dummy */}
                                      <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 border-dashed border-sky-400 bg-sky-50 text-sky-400 font-mono font-bold text-xs shrink-0 transition-opacity ${isSuccess ? 'opacity-30' : 'opacity-100'}`}>Dum</div>
                                      <MoveRight size={16} className={`text-sky-300 transition-opacity ${isSuccess ? 'opacity-30' : 'opacity-100'}`} />

                                      {/* Less Nodes */}
                                      {lessList && lessList.map((val, idx) => (
                                          <React.Fragment key={`comb-l-${idx}`}>
                                              <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl border-4 font-mono font-black text-xl shrink-0 bg-sky-50 border-sky-400 text-sky-800 shadow-sm ${isSuccess ? 'scale-105 shadow-md bg-emerald-50 border-emerald-400 text-emerald-800' : ''}`}>
                                                  {val}
                                              </div>
                                              <MoveRight size={16} className={isSuccess ? "text-emerald-300" : "text-sky-300"} />
                                          </React.Fragment>
                                      ))}

                                      {/* Connection Joint */}
                                      <div className="flex flex-col items-center relative mx-2">
                                          {action === 'connectLists' && (
                                              <div className="absolute -top-12 flex flex-col items-center text-emerald-500 animate-in slide-in-from-top-4 font-mono font-black text-[10px] whitespace-nowrap">
                                                  <LinkIcon size={20} className="mb-1 animate-pulse"/>
                                                  less.next = greaterHead.next
                                              </div>
                                          )}
                                          {action !== 'connectLists' && (
                                              <MoveRight size={24} className="text-emerald-500 animate-pulse" strokeWidth={3}/>
                                          )}
                                      </div>

                                      {/* Greater Nodes */}
                                      {greaterList && greaterList.map((val, idx) => (
                                          <React.Fragment key={`comb-g-${idx}`}>
                                              <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl border-4 font-mono font-black text-xl shrink-0 bg-amber-50 border-amber-400 text-amber-800 shadow-sm ${isSuccess ? 'scale-105 shadow-md bg-emerald-50 border-emerald-400 text-emerald-800' : ''}`}>
                                                  {val}
                                              </div>
                                              <MoveRight size={16} className={isSuccess ? "text-emerald-300" : "text-amber-300"} />
                                          </React.Fragment>
                                      ))}

                                      {/* Termination Joint */}
                                      <div className="flex flex-col items-center relative">
                                          <span className={`font-mono font-bold text-sm ${action === 'terminateGreater' || isSuccess ? 'text-slate-400' : 'text-amber-300'}`}>null</span>
                                          {action === 'terminateGreater' && (
                                              <div className="absolute -bottom-10 flex flex-col items-center text-rose-500 animate-in slide-in-from-bottom-4 font-mono font-black text-[10px] whitespace-nowrap">
                                                  <Scissors size={20} className="mb-1 animate-pulse"/>
                                                  greater.next = null
                                              </div>
                                          )}
                                      </div>
                                </div>
                           </div>
                      )}

                   </div>
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
                <SplitSquareHorizontal className="text-violet-600"/> The Dummy Node Pattern
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Whenever a Linked List problem asks you to rearrange nodes, split lists, or filter elements, <strong>Dummy Nodes</strong> are your best friend. They completely eliminate the headache of handling edge cases where a list might be empty.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Layers size={18}/> In-Place vs Virtual Lists
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            Trying to swap nodes in-place to partition them is incredibly complex. You have to track previous pointers and handle head reassignments constantly.
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-3">
                            <p>Instead, we create two "virtual" lists anchored by <code>lessHead</code> and <code>greaterHead</code>.</p>
                            <p>We aren't allocating new memory for the nodes! We are simply taking the existing nodes from the original list and wiring their <code>next</code> pointers to one of our two new virtual lists. This guarantees strictly $O(1)$ space.</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Scissors size={18}/> The Infinite Cycle Trap
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            The most common bug when rearranging linked lists is accidentally creating a cycle.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>Imagine the original list is <code>[5, 2]</code> and <code>x = 3</code>.</p>
                            <p><code>5</code> goes to the Greater list. <code>2</code> goes to the Less list.</p>
                            <p>We connect Less to Greater: <code>2 -&gt; 5</code>.</p>
                            <p>But wait! In the original list, <code>5.next</code> was pointing to <code>2</code>! If we don't clear it, we get <code>2 -&gt; 5 -&gt; 2 -&gt; 5...</code></p>
                            <p><strong>Solution:</strong> Always explicitly terminate the final list: <code>greater.next = null;</code></p>
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
                        "To partition the linked list while preserving the relative order, I avoided complex in-place pointer swapping. Instead, I initialized two dummy nodes to act as the heads of two separate partitions: a 'less' list and a 'greater' list. I traversed the original list sequentially. If a node's value was strictly less than `x`, I appended it to the `less` list; otherwise, I appended it to the `greater` list. Because I process the original list from start to finish, the relative order is naturally preserved in both partitions. After the traversal, I connected the tail of the `less` list to the head of the `greater` list (skipping the dummy node). Crucially, I explicitly set the tail of the `greater` list to `null` to sever any old connections and prevent cycle formation. This yields an optimal $O(N)$ time complexity and strict $O(1)$ space since no new nodes are allocated."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Why use Dummy Nodes?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Without dummy nodes, you have to write boilerplate <code>if/else</code> checks every time you append a node to see if the `less` or `greater` list is currently empty, so you can initialize the head. Dummy nodes give us a guaranteed non-null starting point to easily wire `.next` pointers without ever worrying about initialization edge cases. We just return <code>dummy.next</code> at the end!
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
                                <p className="text-[10px] text-slate-500 mt-1">We perform exactly one pass through the original linked list. Each node evaluation and pointer reassignment is an $O(1)$ operation.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We allocate two dummy nodes and a few reference pointers (`less`, `greater`, `curr`). We do not instantiate any new nodes for the data itself, rewiring the existing nodes in memory.</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|partition|head|x|lessHead|greaterHead|less|greater|curr|val|next)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['partition', 'val', 'next'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['head', 'curr', 'x'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (['less', 'greater', 'lessHead', 'greaterHead'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default PartitionListVisualizer;