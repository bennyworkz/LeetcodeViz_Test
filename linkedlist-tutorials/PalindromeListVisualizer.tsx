import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp, ArrowLeft,
  GitCommit, MonitorPlay, ChevronLeft, ChevronRight, 
  Network, Database, RotateCcw, ListOrdered, FastForward,
  RefreshCw, Zap, AlertCircle, Goal, Info, Layers, Repeat,
  ZoomIn, ZoomOut, Maximize, Target, Hash, SplitSquareHorizontal,
  GitPullRequest, X, ShieldAlert, Cpu, Lightbulb
} from 'lucide-react';

// TypeScript interfaces for components
interface PointerLabelUIInternalProps {
  label: string;
  color: string;
  position: string;
  offset?: number;
}

interface TabButtonUIInternalProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

interface CodeLineRendererUIInternalProps {
  num: number;
  code: string;
  active: boolean;
  theme: string;
}

interface CheckCircle2Props {
  size: number;
  className?: string;
}

interface XCircleProps {
  size: number;
  className?: string;
}

const OPERATIONS = {
  palindromeReverse: {
    id: 'palindromeReverse',
    title: 'Iterative (Optimal)',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public boolean isPalindrome(Node head) {
    if (head == null || head.next == null) return true;
    
    // 1. Find the middle
    Node slow = head, fast = head;
    while (fast.next != null && fast.next.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // 2. Reverse second half
    Node secondHalf = reverse(slow.next);
    Node firstHalf = head;
    
    // 3. Compare halves
    while (secondHalf != null) {
        if (firstHalf.data != secondHalf.data) return false;
        firstHalf = firstHalf.next;
        secondHalf = secondHalf.next;
    }
    
    return true;
}`,
    desc: "The most memory-efficient approach. We find the middle using Tortoise and Hare, reverse the second half in-place, and compare it with the first half. Zero extra memory needed."
  },
  palindromeStack: {
    id: 'palindromeStack',
    title: 'Using Stack',
    icon: <Layers size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public boolean isPalindrome(Node head) {
    Stack<Integer> stack = new Stack<>();
    Node curr = head;
    
    // 1. Push all data to stack
    while (curr != null) {
        stack.push(curr.data);
        curr = curr.next;
    }
    
    // 2. Pop and compare with head
    curr = head;
    while (curr != null) {
        if (curr.data != stack.pop()) {
            return false;
        }
        curr = curr.next;
    }
    
    return true;
}`,
    desc: "Uses a Stack (LIFO). We push the entire list onto the stack. Popping from the stack gives us nodes in reverse order, which we compare against a standard forward traversal."
  },
  palindromeRecursive: {
    id: 'palindromeRecursive',
    title: 'Using Recursion',
    icon: <RefreshCw size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `Node left; // Persistent pointer

public boolean check(Node right) {
    if (right == null) return true;

    // Recurse to the end of the list
    boolean res = check(right.next);
    if (!res) return false;

    // Compare left and right as recursion unwinds
    boolean match = (left.data == right.data);
    left = left.next; 
    
    return match;
}

public boolean isPalindrome(Node head) {
    left = head;
    return check(head);
}`,
    desc: "Recursion creates an implicit stack. We dive to the tail first. As the recursion unwinds, we compare the tail node with the head node (using a persistent left pointer)."
  }
};

// --- Custom Icon Components for better reliability ---
const CheckCircle2: React.FC<CheckCircle2Props> = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>
    </svg>
);

const XCircle: React.FC<XCircleProps> = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
    </svg>
);

// --- Content Tabs ---

const OverviewTab = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-4xl space-y-12 text-slate-700">
      <section>
        <div className="flex items-center gap-3 mb-6 text-indigo-600">
            <Activity size={28} />
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">The Palindrome Challenge</h2>
        </div>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
          <p className="text-lg leading-relaxed">
            In computer science, a <strong>Palindrome Linked List</strong> problem asks you to verify if a singly linked list's values form a palindrome. A sequence is a palindrome if it reads the same forward and backward.
          </p>
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-xl font-mono text-sm">
            "Input: 1 → 2 → 3 → 2 → 1 | Output: True" <br/>
            "Input: 1 → 2 → 3 | Output: False"
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="flex items-center gap-2 font-black text-slate-800 uppercase tracking-widest text-xs">
            <ShieldAlert size={16} className="text-rose-500"/> The Singly-Linked Constraint
          </h4>
          <p className="text-sm leading-relaxed">
            In a <strong>Doubly Linked List</strong>, this is trivial. However, in a <strong>Singly Linked List</strong>, nodes only point <em>forward</em>. We have no native way to traverse backward from the tail.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="flex items-center gap-2 font-black text-slate-800 uppercase tracking-widest text-xs">
            <Cpu size={16} className="text-emerald-500"/> Computational Efficiency
          </h4>
          <p className="text-sm leading-relaxed">
            While we could copy values into an array, that uses <strong>O(N) space</strong>. The gold standard is finding a solution that uses <strong>O(1) auxiliary space</strong> through pointer manipulation.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs border-b pb-2">Technical Breakdown</h4>
        <div className="grid gap-4">
          <div className="group p-5 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Lightbulb size={18}/></div>
              <h5 className="font-bold text-slate-900">Phase 1: Center Finding</h5>
            </div>
            <p className="text-sm pl-11">Use Slow & Fast pointers. By the time Fast reaches the end, Slow is at the middle.</p>
          </div>
          <div className="group p-5 rounded-2xl border border-slate-100 hover:border-fuchsia-200 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-fuchsia-100 text-fuchsia-600 rounded-lg"><Repeat size={18}/></div>
              <h5 className="font-bold text-slate-900">Phase 2: In-Place Reversal</h5>
            </div>
            <p className="text-sm pl-11">Take the second half of the list and reverse its pointers in-place.</p>
          </div>
          <div className="group p-5 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Check size={18}/></div>
              <h5 className="font-bold text-slate-900">Phase 3: Mirror Comparison</h5>
            </div>
            <p className="text-sm pl-11">Compare the head-start list with the reversed-tail list node-by-node.</p>
          </div>
        </div>
      </section>
    </div>
  </div>
);

const TheoryTab = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-4xl space-y-8 text-slate-700">
      <div className="flex items-center gap-3 mb-6 text-indigo-600">
          <Database size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Algorithmic Trade-offs</h2>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Approach</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Time</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Space</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Pros/Cons</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-b border-slate-100">
              <td className="p-4 font-bold text-indigo-600">Iterative Reversal</td>
              <td className="p-4">O(N)</td>
              <td className="p-4 font-mono font-bold text-emerald-600">O(1)</td>
              <td className="p-4 text-slate-500 italic">Optimal; Mutates original list temporarily.</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-4 font-bold text-amber-600">Stack (LIFO)</td>
              <td className="p-4">O(N)</td>
              <td className="p-4 font-mono text-rose-500">O(N)</td>
              <td className="p-4 text-slate-500 italic">Easy; Constant memory overhead.</td>
            </tr>
            <tr>
              <td className="p-4 font-bold text-fuchsia-600">Recursion</td>
              <td className="p-4">O(N)</td>
              <td className="p-4 font-mono text-rose-500">O(N)</td>
              <td className="p-4 text-slate-500 italic">Elegant; Risk of StackOverflow.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Database size={100}/></div>
          <h4 className="font-black text-amber-400 uppercase tracking-widest text-xs mb-4">Recursive Walkthrough</h4>
          <p className="text-sm text-slate-300 leading-relaxed font-mono">
            How Recursion "Reads backward": <br/>
            1. Recurse until head == null. <br/>
            2. As stack pops, you are at nodes in reverse. <br/>
            3. Compare with a pointer starting at the original head.
          </p>
      </div>
    </div>
  </div>
);

const InterviewTab = () => (
    <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-12 font-sans text-slate-800">
       <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
           <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={140} /></div>
           <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-emerald-400 relative z-10 uppercase tracking-tight">Interviewer Strategy</h3>
           <p className="text-sm text-slate-300 leading-relaxed italic relative z-10 mb-6">
             "I ask this to see if the candidate can coordinate three different concepts (Middle, Reverse, Compare) without losing track of pointer references."
           </p>
       </div>
       <div className="grid md:grid-cols-2 gap-8 text-slate-700">
          <div className="space-y-4">
            <h4 className="font-black uppercase tracking-widest text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500"/> Vital Edge Cases
            </h4>
            <ul className="text-sm space-y-3 list-disc pl-5">
              <li><strong>Empty List:</strong> Technically a palindrome. Return true.</li>
              <li><strong>Single Node:</strong> Always a palindrome.</li>
              <li><strong>Even vs Odd lengths:</strong> Test both [1,1] and [1,2,1] cases.</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-black uppercase tracking-widest text-xs flex items-center gap-2">
              <XCircle size={16} className="text-rose-500"/> Red Flags
            </h4>
            <ul className="text-sm space-y-3 list-disc pl-5">
              <li><strong>Losing Head:</strong> Overwriting head before storing the reference.</li>
              <li><strong>Memory Leak:</strong> Not acknowledging the O(N) cost of Stacks.</li>
            </ul>
          </div>
       </div>
    </div>
);

// --- Internal Helper Components ---

const PointerLabelUIInternal: React.FC<PointerLabelUIInternalProps> = ({ label, color, position, offset = 0 }) => {
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
    const alignClass = position === 'top' ? 'flex-col-reverse -top-10' : 'flex-col -bottom-10';

    return (
        <div className={`absolute ${alignClass} h-8 flex items-center justify-center animate-in zoom-in duration-300 z-30`} style={{ transform: `translateX(${offset}px)`}}>
            <span className={`text-[9px] font-black font-mono tracking-widest px-1.5 py-0.5 rounded border shadow-sm ${activeColorClass}`}>
                {label}
            </span>
            {position === 'top' ? <ArrowDown size={14} className={`text-${color}-500`} strokeWidth={3}/> : <ArrowUp size={14} className={`text-${color}-500`} strokeWidth={3}/>}
        </div>
    );
};

const ListNodeBlockUIInternal = ({ val, address, nextAddr, themeColor = 'slate', isTarget }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700' }
    };
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-${themeColor}-300 shadow-xl z-20 scale-105` : `shadow-sm z-10`;

    return (
        <div className="relative flex flex-col items-center group transition-all">
            <span className="text-[10px] text-slate-400 font-mono font-bold mb-1 opacity-80">{address}</span>
            <div className={`flex items-center w-28 h-14 border-2 rounded-2xl transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative`}>
                <div className={`flex-1 flex justify-center font-mono font-black text-2xl ${activeTheme.text}`}>
                    {val}
                </div>
                <div className={`w-10 h-full border-l-2 flex flex-col items-center justify-center rounded-r-xl border-${themeColor}-400 bg-${themeColor}-50`}>
                    <span className="text-[7px] font-black uppercase tracking-widest opacity-60 transform -rotate-90">NEXT</span>
                </div>
            </div>
            {nextAddr === 'null' && (
                <div className="absolute -right-10 top-1/2 -translate-y-1/2 text-[10px] font-black font-mono text-slate-300">null</div>
            )}
        </div>
    );
};

const TabButtonUIInternal: React.FC<TabButtonUIInternalProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{icon} {label}</button>
);

const CodeLineRendererUIInternal: React.FC<CodeLineRendererUIInternalProps> = ({ num, code, active, theme }) => {
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|Node|true|false|System|out|print|println|static|isPalindrome|check|push|pop|reverse)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-${theme}-500/10`, border: `border-${theme}-500`, text: `text-${theme}-400` };
  return (
    <div className={`flex relative z-10 min-h-[16.5px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `${activeStyles.text} font-bold` : 'text-slate-700'}`}>{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'return', 'if', 'while', 'boolean', 'void'].includes(part);
            const isObject = ['Node', 'Stack'].includes(part);
            const isNumber = !isNaN(parseInt(part));
            const isComment = part.startsWith('//');
            return <span key={i} className={isComment ? 'text-slate-500 italic' : isKeyword ? 'text-pink-400 font-bold' : isObject ? 'text-sky-400 font-bold' : isNumber ? 'text-emerald-400' : ''}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

// --- Main Application ---

export default function PalindromeListVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('palindromeReverse');
  const [inputList, setInputList] = useState('1, 2, 2, 1');
  const [baseList, setBaseList] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.85);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const selectedOp = OPERATIONS[selectedOpId];

  useEffect(() => {
    const generateNodes = (input) => {
        const vals = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)).slice(0, 8);
        return vals.map((v, i) => {
            const col = i % 4;
            const row = Math.floor(i / 4);
            const x = 60 + col * 200; 
            const y = 80 + row * 160 + (col % 2 === 1 ? 40 : 0); 
            return { id: i, val: v, addr: '0x' + (100 + (i * 32)).toString(16).toUpperCase().padStart(3, '0'), nextId: i < vals.length - 1 ? i + 1 : null, x, y };
        });
    };
    setBaseList(generateNodes(inputList));
    setCurrentStep(0);
  }, [inputList]);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedOp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setPan({ x: 0, y: 0 });
    setZoom(0.85);
  };

  const trace = useMemo(() => {
    const steps = [];
    if (baseList.length === 0) return steps;
    let list = baseList.map(n => ({...n}));
    let headId = list[0].id;

    const addStep = (phase, desc, line, stateProps) => {
      steps.push({ phase, description: desc, line, state: { list: list.map(n=>({...n})), ...stateProps } });
    };

    if (selectedOpId === 'palindromeReverse') {
        let slow = headId, fast = headId;
        addStep("Method Call", `isPalindrome(head) called.`, 1, { slow, fast });
        while (true) {
            let fastNode = fast !== null ? list.find(n => n.id === fast) : null;
            let fastNextIdx = fastNode?.nextId ?? null;
            let fastNextNode = fastNextIdx !== null ? list.find(n => n.id === fastNextIdx) : null;
            addStep("Finding Middle", `Moving fast/slow pointers...`, 7, { slow, fast });
            if (fastNextIdx === null || fastNextNode?.nextId === null) break;
            slow = list.find(n => n.id === slow)?.nextId ?? null;
            fast = fastNextNode?.nextId ?? null;
        }
        let startToReverse = list.find(n => n.id === slow)?.nextId ?? null;
        addStep("Reverse Phase", `Preparing to reverse second half.`, 13, { slow, fast, startToReverse });
        let prev = null, curr = startToReverse;
        while(curr !== null) {
            let cNode = list.find(n => n.id === curr);
            if(!cNode) break;
            let next = cNode.nextId;
            cNode.nextId = prev;
            prev = curr;
            curr = next;
        }
        let secondHalfHead = prev;
        addStep("Compare Halves", `Matching both halves.`, 14, { firstHalf: headId, secondHalf: secondHalfHead });
        let p1 = headId, p2 = secondHalfHead;
        while (p2 !== null) {
            let node1 = list.find(n => n.id === p1);
            let node2 = list.find(n => n.id === p2);
            addStep("Check Values", `Match ${node1?.val} == ${node2?.val}?`, 18, { p1, p2, comparing: true });
            if (node1?.val !== node2?.val) {
                addStep("Mismatch!", `Not a palindrome.`, 18, { p1, p2, isSuccess: false, output: false });
                return steps;
            }
            p1 = node1?.nextId ?? null;
            p2 = node2?.nextId ?? null;
        }
        addStep("Final Result", `Palindrome detected.`, 24, { isSuccess: true, output: true });
    } else if (selectedOpId === 'palindromeStack') {
        let curr = headId, stack = [];
        addStep("Push Phase", `Adding elements to stack...`, 6, { curr, stack: [...stack] });
        while(curr !== null) {
            let node = list.find(n => n.id === curr);
            stack.push(node?.val ?? 0);
            curr = node?.nextId ?? null;
            addStep("Pushing", `Stored ${node?.val}.`, 8, { curr, stack: [...stack] });
        }
        curr = headId;
        while(curr !== null) {
            let node = list.find(n => n.id === curr);
            let popped = stack.pop();
            addStep("Pop & Match", `Match ${node?.val} == ${popped}?`, 15, { curr, stack: [...stack], comparing: true });
            if(node?.val !== popped) {
                addStep("Mismatch!", `Returning false.`, 16, { curr, stack: [...stack], isSuccess: false, output: false });
                return steps;
            }
            curr = node?.nextId ?? null;
        }
        addStep("Palindrome!", `Returning true.`, 21, { isSuccess: true, output: true });
    } else if (selectedOpId === 'palindromeRecursive') {
        let leftIdx = headId, callStack = [];
        const recurse = (rightIdx, depth) => {
            callStack.push({ curr: rightIdx, depth });
            let rightNode = list.find(n => n.id === rightIdx);
            addStep("Recursive Down", `Diving to tail (Depth ${depth}).`, 4, { leftIdx, rightIdx, callStack: [...callStack] });
            if (rightIdx === null) { callStack.pop(); return true; }
            let res = recurse(rightNode?.nextId ?? null, depth + 1);
            if (!res) { callStack.pop(); return false; }
            let leftNode = list.find(n => n.id === leftIdx);
            addStep("Unwinding", `Compare L:${leftNode?.val} R:${rightNode?.val}`, 12, { leftIdx, rightIdx, callStack: [...callStack], comparing: true });
            if (leftNode?.val !== rightNode?.val) { addStep("Mismatch", "Not palindrome.", 12, { leftIdx, isSuccess: false, output: false }); return false; }
            leftIdx = leftNode?.nextId ?? headId;
            callStack.pop();
            return true;
        };
        recurse(headId, 1);
        addStep("Recursive Result", "Complete.", 20, { isSuccess: true, output: true });
    }
    return steps;
  }, [baseList, selectedOpId]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));

  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handlePointerMove = (e) => { if (isDragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 2));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));

  const curStep = trace[currentStep] || trace[0] || { state: { list: [] } };
  const st = curStep.state || { list: [] };
  const themeColor = selectedOpId === 'palindromeReverse' ? 'emerald' : selectedOpId === 'palindromeStack' ? 'amber' : 'fuchsia';

  const renderSvgArrows = () => {
    return st.list.map((node) => {
        if (node.nextId === null) return null;
        const target = st.list.find(n => n.id === node.nextId);
        if (!target) return null;
        const startX = node.x + 92, startY = node.y + 28, endX = target.x - 6, endY = target.y + 28;
        const isBack = target.id < node.id;
        const pathD = isBack ? `M ${startX},${startY} C ${startX + 30},${startY - 90} ${endX - 30},${endY - 90} ${endX},${endY}` : `M ${startX},${startY} C ${startX + 15},${startY} ${endX - 15},${endY} ${endX},${endY}`;
        return <path key={`link-${node.id}-${target.id}`} d={pathD} fill="none" stroke={isBack ? '#d946ef' : '#94a3b8'} strokeWidth={isBack ? 4 : 2} markerEnd={isBack ? "url(#arrowhead-fuchsia)" : "url(#arrowhead-default)"} className="transition-all duration-500" />;
    });
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`bg-${themeColor}-600 p-4 rounded-2xl shadow-lg flex items-center justify-center`}><Repeat className="text-white" size={28} /></div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Palindrome List</h1>
              <div className="flex items-center gap-2 text-slate-50 text-[10px] mt-1.5 font-mono"><span className={`font-bold text-${themeColor}-600 bg-${themeColor}-50 px-2 py-0.5 rounded tracking-widest`}>Whiteboard Arena</span></div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10">
            <TabButtonUIInternal active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" />
            <TabButtonUIInternal active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" />
            <TabButtonUIInternal active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Database size={16}/>} label="Theory" />
            <TabButtonUIInternal active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'theory' && <TheoryTab />}
        {activeTab === 'interview' && <InterviewTab />}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-2">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-xl border text-left flex items-center gap-3 transition-all ${selectedOpId === op.id ? `bg-slate-800 text-white border-slate-800 shadow-lg` : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            {op.icon} <div className="flex-1"><div className="text-xs font-black uppercase tracking-tight">{op.title}</div><div className="text-[10px] opacity-70 font-mono">{op.complexity}</div></div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[380px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Palindrome.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRendererUIInternal key={idx} num={idx + 1} code={line} active={curStep.line === idx + 1} theme={themeColor} />
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-end gap-4">
                    <div className="flex-1 space-y-1.5"><label className="text-[10px] font-black uppercase tracking-widest font-mono pl-1">List Data</label><input type="text" value={inputList} onChange={(e) => setInputList(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                    <div className="flex gap-2"><button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200"><RotateCcw size={16}/></button><button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30"><ChevronLeft size={16}/></button><button onClick={handleNext} disabled={currentStep === trace.length - 1} className={`px-6 py-2 bg-${themeColor}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg`}>Step</button></div>
                </div>

                <div className={`rounded-3xl p-6 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group shrink-0 ${st.isSuccess === false ? 'bg-rose-900 border-rose-800' : st.isSuccess === true ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-60 uppercase font-black text-[10px] font-mono tracking-widest"><span>Log</span><span>Line {curStep.line}</span></div>
                    <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-none">{String(curStep.phase)}</div>
                    <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10">{String(curStep.description)}</p>
                    {st.output !== undefined && <div className="absolute top-6 right-6 font-black font-mono text-lg text-white bg-white/10 px-3 py-1 rounded-xl backdrop-blur">Return: {String(st.output)}</div>}
                </div>

                <div className="bg-slate-50 bg-[linear-gradient(to_right,#cbd5e130_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e130_1px,transparent_1px)] bg-[size:20px_20px] rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col shadow-inner overflow-hidden min-h-[460px]">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-lg shadow-sm border border-slate-200"><Network size={14}/> Memory Canvas</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 gap-2"><button onClick={zoomIn} className="p-2 text-slate-600 hover:text-indigo-600"><ZoomIn size={18}/></button><button onClick={zoomOut} className="p-2 text-slate-600 hover:text-indigo-600"><ZoomOut size={18}/></button></div>
                        {selectedOpId === 'palindromeStack' && st.stack && <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 w-28 flex flex-col shadow-2xl animate-in slide-in-from-right-8"><span className="text-[10px] font-black uppercase text-amber-400 tracking-widest mb-3 font-mono">Stack</span><div className="flex flex-col-reverse gap-1.5 h-32 overflow-y-auto scrollbar-thin border-b-2 border-amber-500/50 pb-2">{st.stack.map((v, i) => <div key={i} className="bg-amber-900/50 border border-amber-500/30 text-amber-300 text-xs font-black font-mono py-1 text-center rounded-lg animate-in zoom-in">{String(v)}</div>)}</div></div>}
                        {selectedOpId === 'palindromeRecursive' && st.callStack && <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 w-36 flex flex-col shadow-2xl animate-in slide-in-from-right-8"><span className="text-[10px] font-black uppercase text-fuchsia-400 tracking-widest mb-3 font-mono">Call Stack</span><div className="flex flex-col-reverse gap-1.5 h-32 overflow-y-auto scrollbar-thin border-b-2 border-fuchsia-500/50 pb-2">{st.callStack.map((f, i) => <div key={i} className="bg-fuchsia-900/50 border border-fuchsia-500/30 text-fuchsia-300 text-[9px] font-mono p-1 rounded flex justify-between"><span>D:{String(f.depth)}</span><span>R:{f.curr !== null ? String(f.curr) : 'null'}</span></div>)}</div></div>}
                   </div>

                   <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={() => setIsDragging(false)} onPointerLeave={() => setIsDragging(false)}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left pointer-events-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0"><defs><marker id="arrowhead-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" /></marker><marker id="arrowhead-fuchsia" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#d946ef" /></marker></defs>{renderSvgArrows()}</svg>
                           {st.list.map((nodeObj, idx) => {
                              const isSlow = st.slow === nodeObj.id, isFast = st.fast === nodeObj.id;
                              const isP1 = st.p1 === nodeObj.id, isP2 = st.p2 === nodeObj.id;
                              const isL = st.leftIdx === nodeObj.id, isR = st.rightIdx === nodeObj.id;
                              const isCurr = st.curr === nodeObj.id;
                              let blockTheme = 'slate';
                              if (st.comparing && (isP1 || isP2 || isL || isR || isCurr)) blockTheme = 'amber';
                              else if (isL || isR || isP1 || isP2) blockTheme = 'sky';
                              else if (isSlow || isFast) blockTheme = 'fuchsia';

                              const lbls = [];
                              if (idx === 0) lbls.push({ text: "head", color: "slate", pos: "top" });
                              if (isSlow) lbls.push({ text: "slow", color: "amber", pos: "bottom" });
                              if (isFast) lbls.push({ text: "fast", color: "fuchsia", pos: "top" });
                              if (isP1) lbls.push({ text: "p1", color: "indigo", pos: "top" });
                              if (isP2) lbls.push({ text: "p2", color: "indigo", pos: "bottom" });
                              if (isL) lbls.push({ text: "left", color: "sky", pos: "bottom" });
                              if (isR) lbls.push({ text: "right", color: "fuchsia", pos: "top" });
                              if (isCurr) lbls.push({ text: "curr", color: "amber", pos: "top" });

                              return (
                                  <div key={nodeObj.id} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabelUIInternal key={i} label={l.text} color={l.color} position="top" offset={(isFast && idx === 0) ? -32 : 0} />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabelUIInternal key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      <ListNodeBlockUIInternal val={nodeObj.val} address={nodeObj.addr} nextAddr={nodeObj.nextId !== null ? (st.list.find(n=>n.id===nodeObj.nextId)?.addr ?? 'null') : 'null'} isTarget={isSlow||isFast||isP1||isP2||isL||isR||isCurr} themeColor={blockTheme} />
                                  </div>
                              )
                           })}
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