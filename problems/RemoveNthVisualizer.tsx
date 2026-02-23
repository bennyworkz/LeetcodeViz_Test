import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Database, ListOrdered, Zap, ArrowLeftRight, Timer,
  ArrowRight, FastForward, Play, Trash2, Hash
} from 'lucide-react';

const APPROACHES = {
  onePass: {
    id: 'onePass',
    title: '1. Fast & Slow Pointers (1-Pass)',
    subtitle: 'Optimal: O(L) Time, O(1) Space.',
    icon: <FastForward size={16} />,
    complexity: 'Time: O(L) | Space: O(1)',
    code: `class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        // Create a dummy node to handle edge cases (like removing the head)
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        
        ListNode fast = dummy;
        ListNode slow = dummy;
        
        // Move fast pointer n + 1 steps ahead to create a gap
        for (int i = 0; i <= n; i++) {
            fast = fast.next;
        }
        
        // Move both pointers until fast reaches the end
        while (fast != null) {
            fast = fast.next;
            slow = slow.next;
        }
        
        // slow is now just BEFORE the node we want to remove
        slow.next = slow.next.next;
        
        return dummy.next;
    }
}`,
    explanation: "This elegant one-pass approach uses two pointers with a fixed 'gap' between them. We first move the 'fast' pointer exactly (n + 1) steps ahead of 'slow'. Once the gap is established, we move both pointers forward at the same speed (1 node per step). When 'fast' falls off the end of the list (becomes null), 'slow' will be exactly 'n' nodes from the end! We start both at a 'dummy' node to gracefully handle cases where we have to remove the very first node of the list."
  },
  twoPass: {
    id: 'twoPass',
    title: '2. Count Length (2-Pass)',
    subtitle: 'Standard: O(L) Time, O(1) Space.',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(L) | Space: O(1)',
    code: `class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        
        // Pass 1: Find the total length of the list
        int length = 0;
        ListNode curr = head;
        while (curr != null) {
            length++;
            curr = curr.next;
        }
        
        // Calculate steps needed from dummy to reach the node BEFORE target
        int steps = length - n;
        curr = dummy;
        
        // Pass 2: Traverse to the calculated position
        for (int i = 0; i < steps; i++) {
            curr = curr.next;
        }
        
        // Remove the target node
        curr.next = curr.next.next;
        
        return dummy.next;
    }
}`,
    explanation: "The two-pass approach is highly intuitive. First, we traverse the entire list to count how many nodes exist in total (let's call this 'L'). If we want to remove the 'n-th' node from the end, that is mathematically equivalent to the (L - n + 1)-th node from the beginning. We traverse a second time from our dummy node taking exactly (L - n) steps to land exactly on the node right before our target, and then adjust its 'next' pointer."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">19. Remove Nth Node From End of List</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given the <code>head</code> of a linked list, remove the <code>n<sup>th</sup></code> node from the end of the list and return its head.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              <div className="flex flex-col items-center">
                 <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center font-bold text-slate-600">1</span> <ArrowRight className="text-slate-300"/>
                    <span className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center font-bold text-slate-600">2</span> <ArrowRight className="text-slate-300"/>
                    <span className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center font-bold text-slate-600">3</span> <ArrowRight className="text-slate-300"/>
                    <span className="w-8 h-8 rounded-full border-2 border-rose-400 bg-rose-50 flex items-center justify-center font-bold text-rose-600 relative">
                        4
                        <span className="absolute -top-6 text-[10px] text-rose-500 font-black whitespace-nowrap bg-rose-100 px-1 rounded">Remove</span>
                    </span> <ArrowRight className="text-slate-300"/>
                    <span className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center font-bold text-slate-600">5</span>
                 </div>
                 <ArrowDown className="text-slate-300 my-1"/>
                 <div className="flex items-center gap-2 mt-2">
                    <span className="w-8 h-8 rounded-full border-2 border-emerald-400 bg-emerald-50 flex items-center justify-center font-bold text-emerald-700">1</span> <ArrowRight className="text-emerald-300"/>
                    <span className="w-8 h-8 rounded-full border-2 border-emerald-400 bg-emerald-50 flex items-center justify-center font-bold text-emerald-700">2</span> <ArrowRight className="text-emerald-300"/>
                    <span className="w-8 h-8 rounded-full border-2 border-emerald-400 bg-emerald-50 flex items-center justify-center font-bold text-emerald-700">3</span> <ArrowRight className="text-emerald-300"/>
                    <span className="w-8 h-8 rounded-full border-2 border-emerald-400 bg-emerald-50 flex items-center justify-center font-bold text-emerald-700">5</span>
                 </div>
              </div>
              <p><span className="text-slate-400 font-bold">Input:</span> head = [1,2,3,4,5], n = 2</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [1,2,3,5]</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> head = [1], n = 1</p>
              <p><span className="text-slate-400 font-bold">Output:</span> []</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> head = [1,2], n = 1</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [1]</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm flex gap-3 mt-8 items-start shadow-sm">
            <AlertCircle className="shrink-0 mt-0.5 text-amber-500" size={18} />
            <div className="space-y-2">
                <p><strong>Follow-up:</strong></p>
                <p>Could you do this in one pass?</p>
            </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li>The number of nodes in the list is <code>sz</code>.</li>
              <li><code>1 &lt;= sz &lt;= 30</code></li>
              <li><code>0 &lt;= Node.val &lt;= 100</code></li>
              <li><code>1 &lt;= n &lt;= sz</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const RemoveNthVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('onePass');
  const [listInput, setListInput] = useState('1, 2, 3, 4, 5');
  const [nInput, setNInput] = useState('2');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let arr = listInput.split(',').map(s => parseInt(s.trim())).filter(num => !isNaN(num));
    if (arr.length === 0) arr = [1, 2, 3, 4, 5];
    if (arr.length > 10) arr = arr.slice(0, 10); // Safeguard for UI
    
    let n = parseInt(nInput.trim());
    if (isNaN(n) || n < 1) n = 1;
    if (n > arr.length) n = arr.length; // Constraint: n <= sz

    return { arr, n };
  }, [listInput, nInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { arr, n } = parsedData;
    
    // Virtual nodes representation for visualizer
    // dummy is index -1. array elements are 0 to arr.length - 1
    // links map index to next index.
    const initialLinks = { '-1': 0 };
    for (let i = 0; i < arr.length; i++) {
        initialLinks[i] = i < arr.length - 1 ? i + 1 : null;
    }

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return;
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'onePass') {
        let links = { ...initialLinks };
        
        addStep(
            "Initialize Dummy Node", 
            `Line 4: ListNode dummy = new ListNode(0);\n\nWe instantiate a 'dummy' node. This is a common linked list trick to gracefully handle edge cases, such as removing the very first node of the list.`, 
            4, 
            { fast: null, slow: null, links: { ...links }, dummy: -1, i: null }
        );

        addStep(
            "Link Dummy to Head", 
            `Line 5: dummy.next = head;\n\nWe physically link the dummy node to point to the actual head of our list.`, 
            5, 
            { fast: null, slow: null, links: { ...links }, dummy: -1, i: null }
        );
        
        let fast = -1;
        addStep(
            "Initialize Fast Pointer", 
            `Line 7: ListNode fast = dummy;\n\nInitialize our 'fast' pointer, pointing it to the dummy node to start.`, 
            7, 
            { fast, slow: null, links: { ...links }, dummy: -1, i: null }
        );

        let slow = -1;
        addStep(
            "Initialize Slow Pointer", 
            `Line 8: ListNode slow = dummy;\n\nInitialize our 'slow' pointer, also pointing it to the dummy node to start. Both pointers are now at the starting line.`, 
            8, 
            { fast, slow, links: { ...links }, dummy: -1, i: null }
        );

        for (let i = 0; i <= n; i++) {
            addStep(
                "Evaluate For-Loop Condition", 
                `Line 11: for (int i = ${i}; i <= ${n}; i++)\n\nWe evaluate if 'i' (${i}) is less than or equal to 'n' (${n}).\nThis evaluates to TRUE, so we enter the loop.`, 
                11, 
                { fast, slow, links: { ...links }, dummy: -1, i }
            );

            fast = links[fast];
            addStep(
                "Advance Fast Pointer", 
                `Line 12: fast = fast.next;\n\nWe move the 'fast' pointer one node ahead. It is now ${i + 1} step(s) ahead of 'slow'.`, 
                12, 
                { fast, slow, links: { ...links }, dummy: -1, i }
            );
        }
        
        addStep(
            "For-Loop Terminates", 
            `Line 11: for (int i = ${n + 1}; i <= ${n}; i++)\n\nThe condition is now FALSE. The loop terminates.\nThe 'fast' pointer is exactly ${n + 1} steps ahead of the 'slow' pointer, creating our fixed 'gap'.`, 
            11, 
            { fast, slow, links: { ...links }, dummy: -1, i: n+1 }
        );

        while (fast !== null) {
            let fastVal = fast === -1 ? 'D' : arr[fast];
            addStep(
                "Evaluate While-Loop Condition", 
                `Line 16: while (fast != null)\n\nCurrently, fast is pointing to node [${fastVal}], which is NOT null.\nThis evaluates to TRUE. We will shift our entire window down the list.`, 
                16, 
                { fast, slow, links: { ...links }, dummy: -1, i: null, action: 'sliding' }
            );
            
            fast = links[fast];
            addStep(
                "Advance Fast Pointer", 
                `Line 17: fast = fast.next;\n\nThe 'fast' pointer takes one step forward.`, 
                17, 
                { fast, slow, links: { ...links }, dummy: -1, i: null }
            );

            slow = links[slow];
            addStep(
                "Advance Slow Pointer", 
                `Line 18: slow = slow.next;\n\nThe 'slow' pointer takes one step forward. The gap between them is maintained.`, 
                18, 
                { fast, slow, links: { ...links }, dummy: -1, i: null }
            );
        }
        
        addStep(
            "While-Loop Terminates", 
            `Line 16: while (fast != null)\n\nThe 'fast' pointer has fallen off the edge of the list and is now 'null'. This evaluates to FALSE.\nBecause of the rigid gap, 'slow' is mathematically guaranteed to be positioned exactly immediately BEFORE our target node!`, 
            16, 
            { fast, slow, links: { ...links }, dummy: -1, i: null, action: 'found' }
        );
        
        let nodeToRemove = links[slow];
        let newNext = links[nodeToRemove];
        
        addStep(
            "Prepare to Delete Target Node", 
            `Line 22: slow.next = slow.next.next;\n\nThe node we want to remove is currently slow.next (Node [${arr[nodeToRemove]}]). We are preparing to reroute 'slow.next' to completely bypass it.`, 
            22, 
            { fast, slow, links: { ...links }, dummy: -1, i: null, action: 'prepare-remove', target: nodeToRemove }
        );

        // Perform removal
        links[slow] = newNext;
        
        addStep(
            "Target Node Deleted", 
            `Line 22: Execution completes.\n\nThe pointer is physically rerouted to 'slow.next.next'. The target node is successfully unlinked and will be garbage collected!`, 
            22, 
            { fast, slow, links: { ...links }, dummy: -1, i: null, action: 'removed', target: nodeToRemove }
        );
        
        addStep(
            "Return Updated List", 
            `Line 24: return dummy.next;\n\nWe return the new head of the list. By returning 'dummy.next', if the original head was the node we deleted, we correctly return the new head!`, 
            24, 
            { fast, slow, links: { ...links }, dummy: -1, i: null, action: 'success', isSuccess: true }
        );

    } else if (selectedApproachId === 'twoPass') {
        let links = { ...initialLinks };
        
        addStep(
            "Initialize Dummy Node", 
            `Line 3: ListNode dummy = new ListNode(0);\n\nWe instantiate a 'dummy' node to gracefully handle edge cases.`, 
            3, 
            { curr: null, links: { ...links }, dummy: -1, length: null, steps: null, action: 'init' }
        );

        addStep(
            "Link Dummy to Head", 
            `Line 4: dummy.next = head;\n\nWe connect our dummy node so it points to the beginning of the list.`, 
            4, 
            { curr: null, links: { ...links }, dummy: -1, length: null, steps: null, action: 'init' }
        );
        
        let length = 0;
        addStep(
            "Initialize Length Tracker", 
            `Line 7: int length = 0;\n\nWe create a variable to hold the total number of nodes in the list.`, 
            7, 
            { curr: null, links: { ...links }, dummy: -1, length, steps: null }
        );
        
        let curr = 0; // head
        if (arr.length === 0) curr = null; // safety check
        addStep(
            "Initialize Current Pointer", 
            `Line 8: ListNode curr = head;\n\nWe point 'curr' to the actual head of the list to begin our first traversal pass.`, 
            8, 
            { curr, links: { ...links }, dummy: -1, length, steps: null }
        );
        
        while (curr !== null) {
            let currVal = curr === -1 ? 'D' : arr[curr];
            addStep(
                "Evaluate Pass 1 While-Loop Condition", 
                `Line 9: while (curr != null)\n\n'curr' points to node [${currVal}], which is NOT null. Evaluates to TRUE.`, 
                9, 
                { curr, links: { ...links }, dummy: -1, length, steps: null }
            );

            length++;
            addStep(
                "Increment Length Count", 
                `Line 10: length++;\n\nWe successfully saw a node, so we increment 'length' to ${length}.`, 
                10, 
                { curr, links: { ...links }, dummy: -1, length, steps: null }
            );

            curr = links[curr];
            addStep(
                "Advance Current Pointer", 
                `Line 11: curr = curr.next;\n\nWe move 'curr' to the next node in the list.`, 
                11, 
                { curr, links: { ...links }, dummy: -1, length, steps: null }
            );
        }
        
        addStep(
            "Pass 1 Completes", 
            `Line 9: while (curr != null)\n\n'curr' is now null. Evaluates to FALSE. Loop terminates.\nThe entire list has been counted. Total 'length' = ${length}.`, 
            9, 
            { curr, links: { ...links }, dummy: -1, length, steps: null }
        );
        
        let targetSteps = length - n;
        addStep(
            "Calculate Target Steps for Pass 2", 
            `Line 15: int steps = length - n;\n\nsteps = ${length} - ${n} = ${targetSteps}.\nThis is the precise mathematical number of steps we must take from the dummy node to land exactly 1 node BEFORE our target.`, 
            15, 
            { curr: null, links: { ...links }, dummy: -1, length, steps: targetSteps }
        );
        
        curr = -1; // reset to dummy
        addStep(
            "Reset Current Pointer to Dummy", 
            `Line 16: curr = dummy;\n\nWe reset our pointer back to the dummy node to begin Pass 2.`, 
            16, 
            { curr, links: { ...links }, dummy: -1, length, steps: targetSteps }
        );
        
        for (let i = 0; i < targetSteps; i++) {
            addStep(
                "Evaluate Pass 2 For-Loop Condition", 
                `Line 19: for (int i = ${i}; i < ${targetSteps}; i++)\n\ni (${i}) is less than steps (${targetSteps}). Evaluates to TRUE. We enter the loop.`, 
                19, 
                { curr, links: { ...links }, dummy: -1, length, steps: targetSteps, i }
            );

            curr = links[curr];
            addStep(
                "Advance Current Pointer", 
                `Line 20: curr = curr.next;\n\nWe take 1 step forward in the list.`, 
                20, 
                { curr, links: { ...links }, dummy: -1, length, steps: targetSteps, i }
            );
        }
        
        addStep(
            "Pass 2 Completes", 
            `Line 19: for (int i = ${targetSteps}; i < ${targetSteps}; i++)\n\ni (${targetSteps}) is NOT less than steps (${targetSteps}). Evaluates to FALSE.\n'curr' is successfully positioned right before the target node!`, 
            19, 
            { curr, links: { ...links }, dummy: -1, length, steps: targetSteps, action: 'found' }
        );
        
        let nodeToRemove = links[curr];
        let newNext = links[nodeToRemove];
        
        addStep(
            "Prepare to Delete Target Node", 
            `Line 24: curr.next = curr.next.next;\n\nWe identify the target node to delete and prepare to reroute the 'curr.next' pointer.`, 
            24, 
            { curr, links: { ...links }, dummy: -1, length, steps: targetSteps, action: 'prepare-remove', target: nodeToRemove }
        );
        
        links[curr] = newNext;
        
        addStep(
            "Target Node Deleted", 
            `Line 24: Execution completes.\n\nThe link is physically changed to completely bypass the target node. It is deleted!`, 
            24, 
            { curr, links: { ...links }, dummy: -1, length, steps: targetSteps, action: 'removed', target: nodeToRemove }
        );
        
        addStep(
            "Return Updated List", 
            `Line 26: return dummy.next;\n\nAlgorithm concludes successfully. We return the new head of the list.`, 
            26, 
            { curr, links: { ...links }, dummy: -1, length, steps: targetSteps, action: 'success', isSuccess: true }
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
  const { isSuccess, fast, slow, curr, links, target, action, length, steps } = state;
  const { arr, n } = parsedData;

  // Build the visual nodes array for rendering
  const visualNodes = [{ id: -1, val: 'D' }];
  for (let i = 0; i < arr.length; i++) {
      visualNodes.push({ id: i, val: arr[i] });
  }

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <FastForward className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Remove Nth Node</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 19</span>
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
                <div className="grid grid-cols-2 gap-3">
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
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="violet" />
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
                    
                    {selectedApproachId === 'onePass' ? (
                        <div className="grid grid-cols-2 gap-3">
                            <VariableCard label="Fast Pointer" val={fast === null ? "null" : (fast === -1 ? 'D' : arr[fast])} color="sky" active={fast !== undefined} />
                            <VariableCard label="Slow Pointer" val={slow === null ? "null" : (slow === -1 ? 'D' : arr[slow])} color="rose" active={slow !== undefined} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            <VariableCard label="Curr" val={curr === null ? "null" : (curr === -1 ? 'D' : arr[curr])} color="purple" active={curr !== undefined} />
                            <VariableCard label="Total Len" val={length ?? null} color="slate" active={length !== null && length !== undefined} />
                            <VariableCard label="Steps Req" val={steps ?? null} color="amber" active={steps !== null && steps !== undefined} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">List (head)</label>
                        <input type="text" value={listInput} onChange={(e) => { setListInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="1, 2, 3, 4, 5" />
                    </div>
                    
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Remove (n)</label>
                        <input type="number" value={nInput} onChange={(e) => { setNInput(e.target.value); setCurrentStep(0); }} min="1" max={arr.length} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner" placeholder="2" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[180px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : <FastForward size={100}/>}
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
                  <div className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 font-mono whitespace-pre-line overflow-y-auto max-h-[120px] scrollbar-thin relative z-10">
                      {cur.description}
                  </div>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-center justify-center">
                   
                   <div className="flex flex-col items-center justify-center w-full h-full relative z-10 pt-4 pb-8 gap-6">
                      
                      {/* Substring Array Visualization */}
                      <div className="flex flex-wrap justify-center w-full gap-y-16 gap-x-2 md:gap-x-4">
                          {visualNodes.map((node) => {
                              let isDummy = node.id === -1;
                              let isFast = fast === node.id;
                              let isSlow = slow === node.id;
                              let isCurr = curr === node.id;
                              
                              // Check if node is the one being removed or is already removed
                              let isTarget = target === node.id;
                              let isRemoved = false;
                              
                              if (links) {
                                  // A node is removed if nothing points to it (except its own previous state which we bypass)
                                  // Technically, we can check if it exists as a value in the links map.
                                  // Dummy is always present implicitly.
                                  let pointedTo = false;
                                  for (const key in links) {
                                      if (links[key] === node.id) pointedTo = true;
                                  }
                                  if (!pointedTo && !isDummy) isRemoved = true;
                              }

                              // Base styling
                              let boxClass = "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full border-4 font-mono font-black text-xl transition-all duration-500 z-20 relative shadow-sm ";
                              let textClass = "text-slate-700";
                              
                              if (isDummy) {
                                  boxClass += "bg-slate-100 border-slate-300 text-slate-500";
                              } else if (isRemoved || (isTarget && action === 'removed')) {
                                  boxClass += "bg-rose-50 border-rose-200 text-rose-300 scale-90 opacity-60";
                                  textClass = "text-rose-300";
                              } else if (isTarget && action === 'prepare-remove') {
                                  boxClass += "bg-amber-100 border-amber-400 text-amber-800 scale-110 shadow-lg ring-4 ring-amber-400/30 animate-pulse";
                                  textClass = "text-amber-800";
                              } else {
                                  boxClass += "bg-white border-violet-400 text-violet-900";
                                  textClass = "text-violet-900";
                              }

                              return (
                                  <React.Fragment key={`node-${node.id}`}>
                                      <div className="flex items-center relative group">
                                          <div className="flex flex-col items-center shrink-0 relative">
                                              
                                              {/* Top Pointers */}
                                              <div className="absolute -top-12 flex flex-col items-center justify-end h-10 w-full gap-1 z-30">
                                                  {isFast && (
                                                      <div className="flex flex-col items-center">
                                                          <span className="text-[10px] font-black font-mono bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded border border-sky-300 tracking-widest shadow-sm">fast</span>
                                                          <ArrowDown size={14} className="text-sky-500" strokeWidth={3}/>
                                                      </div>
                                                  )}
                                                  {isCurr && (
                                                      <div className="flex flex-col items-center">
                                                          <span className="text-[10px] font-black font-mono bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded border border-purple-300 tracking-widest shadow-sm">curr</span>
                                                          <ArrowDown size={14} className="text-purple-500" strokeWidth={3}/>
                                                      </div>
                                                  )}
                                              </div>

                                              <div className={boxClass}>
                                                  {node.val}
                                                  {isTarget && action === 'prepare-remove' && (
                                                      <Trash2 size={24} className="absolute text-amber-600/30" />
                                                  )}
                                              </div>
                                              
                                              <div className="text-[10px] text-slate-400 font-mono mt-2 tracking-tighter">
                                                  {isDummy ? 'dummy' : `idx:${node.id}`}
                                              </div>

                                              {/* Bottom Pointers */}
                                              <div className="absolute -bottom-14 flex flex-col items-center h-12 w-full gap-1 z-30">
                                                  {isSlow && (
                                                      <div className="flex flex-col items-center">
                                                          <ArrowUp size={14} className="text-rose-500" strokeWidth={3}/>
                                                          <span className="text-[10px] font-black font-mono bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded border border-rose-300 tracking-widest shadow-sm">slow</span>
                                                      </div>
                                                  )}
                                              </div>
                                          </div>
                                          
                                          {/* Connecting Arrow */}
                                          {links && links[node.id] !== undefined && links[node.id] !== null && (
                                              <div className={`flex items-center z-10 transition-all duration-500 mx-1 md:mx-2 ${action === 'removed' && isSlow ? 'text-emerald-500 scale-x-150 transform origin-left w-12' : 'text-slate-300 w-6 md:w-8'}`}>
                                                   <div className={`h-1 w-full rounded-full transition-colors ${action === 'removed' && isSlow ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-300'}`}></div>
                                                   <ArrowRight className={`-ml-2 transition-colors ${action === 'removed' && isSlow ? 'text-emerald-400' : 'text-slate-300'}`} />
                                              </div>
                                          )}
                                      </div>
                                  </React.Fragment>
                              )
                          })}
                          
                          {/* Null End Node Indicator */}
                          <div className="flex items-center relative">
                              <div className="flex flex-col items-center shrink-0">
                                  {/* Top Null Pointers */}
                                  <div className="absolute -top-12 flex flex-col items-center justify-end h-10 w-full gap-1 z-30">
                                      {fast === null && selectedApproachId === 'onePass' && (
                                          <div className="flex flex-col items-center">
                                              <span className="text-[10px] font-black font-mono bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded border border-sky-300 tracking-widest shadow-sm">fast</span>
                                              <ArrowDown size={14} className="text-sky-500" strokeWidth={3}/>
                                          </div>
                                      )}
                                      {curr === null && selectedApproachId === 'twoPass' && (
                                          <div className="flex flex-col items-center">
                                              <span className="text-[10px] font-black font-mono bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded border border-purple-300 tracking-widest shadow-sm">curr</span>
                                              <ArrowDown size={14} className="text-purple-500" strokeWidth={3}/>
                                          </div>
                                      )}
                                  </div>
                                  <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 font-mono font-black text-sm text-slate-400">
                                      null
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Info Banner */}
                      {selectedApproachId === 'onePass' && fast !== null && slow !== null && fast !== -1 && (
                         <div className="bg-sky-50 border border-sky-200 text-sky-800 px-6 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-sm animate-in fade-in zoom-in absolute bottom-8">
                             <Zap size={14} /> Gap between Fast & Slow is exactly {n} nodes.
                         </div>
                      )}

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600">
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">REMOVAL COMPLETE</span>
                              <span className="text-xs font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600">
                                  Node successfully deleted.
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
                <FastForward className="text-violet-600"/> The One-Pass Magic
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Removing the $n$-th node from the <strong>beginning</strong> is easy: just walk $n$ steps. But removing from the <strong>end</strong> is tricky because singly linked lists only go one way. How do you know when you are $n$ steps from the end if you don't know where the end is?
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ListOrdered size={18}/> The Dummy Node Trap
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            What if the list has 1 node, and you want to remove the 1st node from the end? You have to remove the head!
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            To delete a node, we MUST have a pointer to the node immediately <strong>before</strong> it so we can re-route its <code>next</code> pointer.<br/><br/>
                            By attaching a <code>dummy</code> node before the head, we guarantee that every real node in the list (including the head) has a predecessor.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Zap size={18}/> The "Measuring Stick"
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            Think of the <code>fast</code> and <code>slow</code> pointers as the two ends of a rigid measuring stick of length $n + 1$.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>First, we advance <code>fast</code> by $n+1$ steps while <code>slow</code> stays at the dummy node. This creates our "stick".</p>
                            <p>Next, we slide the entire stick down the list by moving both pointers together at the same speed.</p>
                            <p>When the front of the stick (<code>fast</code>) hits the end of the list (null), the back of the stick (<code>slow</code>) is perfectly positioned right before the node we want to delete!</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <ArrowLeftRight size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-emerald-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Two-Pass vs One-Pass</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed grid grid-cols-2 gap-8">
                        <div>
                            <span className="text-purple-400 font-bold block mb-2">Two-Pass (Length Count)</span>
                            <p>You walk the entire list to find Length $L$. Then you do the math: $Steps = L - n$. Then you walk the list AGAIN from the start, taking exactly that many steps.</p>
                            <p className="mt-2 text-slate-500 italic">Technically O(2L) time. While this simplifies to O(L) in Big-O notation, you are iterating through the elements almost twice.</p>
                        </div>
                        <div>
                            <span className="text-sky-400 font-bold block mb-2">One-Pass (Fast/Slow)</span>
                            <p>You send a scout (`fast`) ahead by $n$ steps. Then the scout and the main body (`slow`) walk together. When the scout hits the edge, the main body strikes.</p>
                            <p className="mt-2 text-slate-500 italic">Strictly O(L) time. We touch each node exactly once. This is considered the elegant, optimal standard for this problem.</p>
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
                        "I chose the One-Pass Fast and Slow Pointer method to optimize traversal time. To handle edge cases, such as removing the head node of the list, I instantiated a `dummy` node pointing to the head. I advanced a `fast` pointer $n+1$ steps ahead to create a specific gap between it and a `slow` pointer (which starts at dummy). By advancing both pointers uniformly, when the `fast` pointer reaches the end (`null`), the `slow` pointer guarantees its position is immediately preceding the target node. I then securely detach the target by updating `slow.next = slow.next.next`, completing the algorithm in exactly $O(L)$ time with $O(1)$ space."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Is One-Pass actually faster?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                In Big-O terms, $O(L)$ and $O(2L)$ are identical: linear time. However, the One-Pass solution is technically faster in real-world clock time because memory access and pointer dereferencing (`.next`) only happen once per node instead of twice. Furthermore, it demonstrates a deeper understanding of pointer manipulation to the interviewer.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(L)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Where $L$ is the length of the linked list. The `fast` pointer touches every node exactly once until it reaches `null`. The `slow` pointer touches a subset of nodes once.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We allocate memory only for three `ListNode` references (`dummy`, `fast`, `slow`). No dynamic structures are created that scale with input size.</p>
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

const VariableCard: React.FC<{ label: string; val: string | number | null; color: string; active: boolean }> = ({ label, val, color, active }) => {
    const bgMap: Record<string, string> = {
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

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active: boolean; theme?: string }> = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|Stack|dummy|fast|slow|head|curr|length|steps)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for', 'continue', 'break'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math', 'Arrays', 'ArrayList', 'ListNode', 'Stack'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['dummy', 'head'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['fast', 'curr'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['slow'].includes(part)) return <span key={i} className="text-rose-400 font-bold">{part}</span>;
          if (['length', 'steps'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default RemoveNthVisualizer;