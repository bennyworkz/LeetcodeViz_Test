import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp, ArrowLeft,
  ChevronLeft, ChevronRight, Network, Database, RotateCcw, 
  ListOrdered, RefreshCw, Zap, Goal, Info, Layers, 
  ZoomIn, ZoomOut, Maximize, Hash, Trash2, Search,
  Scissors, ShieldAlert, Cpu, Lightbulb, PlayCircle,
  MonitorPlay, PartyPopper, X
} from 'lucide-react';

// TypeScript interfaces for components
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
  theme: string;
}

interface PointerLabelProps {
  label: string;
  color: string;
  position: string;
  offset?: number;
}

interface ListNodeBlockProps {
  val: number;
  address: string;
  themeColor?: string;
  isTarget: boolean;
  isBypassed: boolean;
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
  removeHashing: {
    id: 'removeHashing',
    title: 'Hashing (Optimal)',
    icon: <Database size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public Node removeDuplicates(Node head) {
    if (head == null) return null;
    
    HashSet<Integer> seen = new HashSet<>();
    Node curr = head;
    Node prev = null;
    
    while (curr != null) {
        if (seen.contains(curr.data)) {
            // Duplicate found: bypass it
            prev.next = curr.next;
        } else {
            // First time seeing this: mark as seen
            seen.add(curr.data);
            prev = curr;
        }
        curr = curr.next;
    }
    return head;
}`,
    desc: "The standard optimal approach. We use a HashSet to remember every value we encounter. If we see a value again, we bridge the previous node to the current node's next, effectively removing the duplicate in a single pass."
  },
  removeBruteForce: {
    id: 'removeBruteForce',
    title: 'Nested Loops (O(1) Space)',
    icon: <Search size={16} />,
    complexity: 'Time: O(N²) | Space: O(1)',
    code: `public Node removeDuplicates(Node head) {
    Node ptr1 = head;
    
    while (ptr1 != null) {
        Node ptr2 = ptr1;
        
        while (ptr2.next != null) {
            if (ptr1.data == ptr2.next.data) {
                // Remove duplicate
                ptr2.next = ptr2.next.next;
            } else {
                ptr2 = ptr2.next;
            }
        }
        ptr1 = ptr1.next;
    }
    return head;
}`,
    desc: "The memory-constrained approach. For every node, we run a second pointer through the rest of the list. It takes longer but requires no extra data structures like HashSets."
  }
};

// --- Content Tabs ---

const OverviewTab = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center gap-3 mb-6 text-rose-600">
          <Trash2 size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Remove Duplicates from Unsorted Linked List</h2>
      </div>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given an unsorted singly linked list, remove all duplicate nodes from the list. Unlike sorted lists where duplicates are adjacent, unsorted lists require different strategies to identify and eliminate duplicates efficiently.
        </p>
        
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl space-y-4">
            <h4 className="font-black text-rose-800 uppercase tracking-widest text-xs">Problem Statement</h4>
            <p className="text-sm leading-relaxed text-rose-700">
              Remove all nodes that have duplicate values in an unsorted linked list, keeping only the first occurrence of each unique value.
            </p>
        </div>

        <div className="space-y-6 pt-4">
           <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs border-b pb-2">Examples</h4>
           
           <div className="grid md:grid-cols-2 gap-6">
               <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-emerald-800 uppercase tracking-widest text-[10px] items-center gap-2"><Goal size={14}/> Example 1</div>
                   <div className="space-y-2">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-12 text-xs font-bold">Input:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">12 <ArrowRight size={12} className="mx-1"/> 11 <ArrowRight size={12} className="mx-1"/> 12 <ArrowRight size={12} className="mx-1"/> 21 <ArrowRight size={12} className="mx-1"/> 11</div>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-emerald-200/50 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold w-12">Output:</span> 
                          <div className="flex items-center text-emerald-700 bg-emerald-100 px-2 py-1 rounded text-xs">12 <ArrowRight size={12} className="mx-1"/> 11 <ArrowRight size={12} className="mx-1"/> 21</div>
                      </div>
                   </div>
               </div>

               <div className="bg-sky-50/50 border border-sky-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-sky-800 uppercase tracking-widest text-[10px] items-center gap-2"><Goal size={14}/> Example 2</div>
                   <div className="space-y-2">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-12 text-xs font-bold">Input:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">1 <ArrowRight size={12} className="mx-1"/> 2 <ArrowRight size={12} className="mx-1"/> 3 <ArrowRight size={12} className="mx-1"/> 2</div>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-sky-200/50 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold w-12">Output:</span> 
                          <div className="flex items-center text-sky-700 bg-sky-100 px-2 py-1 rounded text-xs">1 <ArrowRight size={12} className="mx-1"/> 2 <ArrowRight size={12} className="mx-1"/> 3</div>
                      </div>
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
      <div className="flex items-center gap-3 mb-6 text-rose-600">
          <Database size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Algorithm Analysis</h2>
      </div>
      
      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Approach</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Time</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Space</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Trade-offs</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-b border-slate-100">
              <td className="p-4 font-bold text-rose-600">HashSet Approach</td>
              <td className="p-4 font-mono text-emerald-600">O(N)</td>
              <td className="p-4 font-mono text-rose-500">O(N)</td>
              <td className="p-4 text-slate-500 italic">Fast but uses extra memory for the hash table</td>
            </tr>
            <tr>
              <td className="p-4 font-bold text-amber-600">Nested Loops</td>
              <td className="p-4 font-mono text-rose-500">O(N²)</td>
              <td className="p-4 font-mono text-emerald-600">O(1)</td>
              <td className="p-4 text-slate-500 italic">Memory efficient but slower for large lists</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-rose-50 p-6 rounded-3xl relative overflow-hidden shadow-sm border border-rose-200">
              <h3 className="font-black text-rose-600 uppercase tracking-widest text-sm mb-4 flex items-center gap-2"><Database size={18}/> HashSet Strategy</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Use a HashSet to track seen values. For each node, check if its value exists in the set. If yes, remove it; if no, add it to the set and continue.
              </p>
              <div className="bg-white p-4 rounded-xl border shadow-sm font-mono text-xs text-rose-700">
                  if (seen.contains(curr.data)) <br/>
                  &nbsp;&nbsp;prev.next = curr.next;
              </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-3xl relative overflow-hidden shadow-sm border border-amber-200">
              <h3 className="font-black text-amber-600 uppercase tracking-widest text-sm mb-4 flex items-center gap-2"><Search size={18}/> Nested Loop Strategy</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  For each node, scan the remaining list to find and remove all duplicates of that node's value. No extra space needed.
              </p>
              <div className="bg-white p-4 rounded-xl border shadow-sm font-mono text-xs text-amber-700">
                  if (ptr1.data == ptr2.next.data) <br/>
                  &nbsp;&nbsp;ptr2.next = ptr2.next.next;
              </div>
          </div>
      </div>
    </div>
  </div>
);

const InterviewTab = () => (
    <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-8">
       <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
           <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
               <Trophy size={140} />
           </div>
           <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-rose-400 relative z-10 uppercase tracking-tight">
               <Trophy size={24} /> Interview Strategy
           </h3>
           <p className="text-sm text-slate-300 leading-relaxed italic relative z-10 mb-6">
               "This problem tests your understanding of hash tables vs. space-time trade-offs. I expect candidates to discuss both approaches and their implications."
           </p>
       </div>

       <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500"/> Key Points to Mention
            </h4>
            <ul className="space-y-3 text-sm list-disc pl-5">
              <li><strong>HashSet Approach:</strong> Optimal time complexity O(N) but requires O(N) extra space</li>
              <li><strong>Two Pointer Approach:</strong> O(1) space but O(N²) time complexity</li>
              <li><strong>Edge Cases:</strong> Empty list, single node, all duplicates, no duplicates</li>
              <li><strong>Memory Management:</strong> Properly handle node deletion to avoid memory leaks</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs flex items-center gap-2">
              <XCircle size={16} className="text-rose-500"/> Common Mistakes
            </h4>
            <ul className="space-y-3 text-sm list-disc pl-5">
              <li><strong>Losing Head Reference:</strong> Accidentally modifying the head pointer</li>
              <li><strong>Null Pointer Errors:</strong> Not checking for null before accessing next</li>
              <li><strong>Incomplete Removal:</strong> Forgetting to update previous node's next pointer</li>
              <li><strong>Wrong Complexity Analysis:</strong> Miscalculating time/space complexity</li>
            </ul>
          </div>
       </div>

       <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl">
           <h4 className="font-black text-rose-800 uppercase tracking-widest text-xs mb-4">Follow-up Questions</h4>
           <ul className="space-y-2 text-sm text-rose-700">
               <li>• How would you modify this for a sorted linked list?</li>
               <li>• What if you need to remove all occurrences (including the first)?</li>
               <li>• How would you handle very large lists that don't fit in memory?</li>
           </ul>
       </div>
    </div>
);

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

// --- Internal Helper Components ---

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${
      active 
        ? 'bg-[#1e293b] text-white shadow-md' 
        : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
    }`}
  >
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme }) => {
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|Node|true|false|System|out|print|println|static|removeDuplicates|HashSet|contains|add|seen|containsKey|seenSet|seen|seenMap|ptr1|ptr2|prev|curr)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-rose-500/20`, border: `border-rose-500`, text: `text-rose-400` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-rose-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'return', 'if', 'else', 'while', 'boolean', 'void'].includes(part);
            const isObject = ['Node', 'HashSet'].includes(part);
            const isNumber = !isNaN(parseInt(part));
            const isComment = part.startsWith('//');
            const isPointer = ['ptr1', 'ptr2', 'prev', 'curr'].includes(part);
            return (
              <span 
                key={i} 
                className={
                  isComment ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-sky-400 font-bold' : 
                  isNumber ? 'text-emerald-400' : 
                  isPointer ? 'text-rose-400' : ''
                }
              >
                {part}
              </span>
            );
        })}
      </pre>
    </div>
  );
};

const PointerLabel: React.FC<PointerLabelProps> = ({ label, color, position, offset = 0 }) => {
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
    const alignClass = position === 'top' ? 'flex-col-reverse -top-12' : 'flex-col -bottom-12';

    return (
        <div className={`absolute ${alignClass} flex items-center justify-center animate-in zoom-in duration-300 z-30`} style={{ transform: `translateX(${offset}px)`}}>
            <span className={`text-[9px] font-black font-mono tracking-widest px-2 py-0.5 rounded border shadow-sm ${activeColorClass}`}>
                {label}
            </span>
            {position === 'top' ? <ArrowDown size={14} className={`text-${color}-500`} strokeWidth={3}/> : <ArrowUp size={14} className={`text-${color}-500`} strokeWidth={3}/>}
        </div>
    );
};

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, themeColor = 'slate', isTarget, isBypassed }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700' }
    };
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-rose-300 shadow-xl z-20 scale-105` : `shadow-sm z-10`;

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500 ${isBypassed ? 'opacity-20 grayscale blur-[1px]' : ''}`}>
            <span className="text-[10px] text-slate-400 font-mono font-bold mb-1 opacity-80">{address}</span>
            <div className={`flex items-center w-28 h-14 border-2 rounded-2xl transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative`}>
                <div className={`flex-1 flex justify-center font-mono font-black text-2xl ${activeTheme.text}`}>
                    {val}
                </div>
                <div className={`w-10 h-full border-l-2 flex flex-col items-center justify-center rounded-r-xl border-slate-200 bg-slate-50`}>
                    <span className="text-[7px] font-black uppercase tracking-widest opacity-60 transform -rotate-90">NEXT</span>
                </div>
            </div>
        </div>
    );
};

// --- Main Application ---

export default function UnsortedDuplicateRemoverSinglyLinkedListViz() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('removeHashing');
  const [inputList, setInputList] = useState('12, 11, 12, 21, 11');
  const [baseList, setBaseList] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.85);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const selectedOp = OPERATIONS[selectedOpId];

  // Initialize nodes
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
    setPan({ x: 0, y: 0 });
  }, [inputList, selectedOpId]);

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

  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 2));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));

  const trace = useMemo(() => {
    const steps = [];
    if (baseList.length === 0) return steps;
    let list = baseList.map(n => ({...n}));
    let headId = list[0].id;

    const addStep = (phase, desc, line, stateProps) => {
      steps.push({ phase, description: desc, line, state: { list: list.map(n=>({...n})), ...stateProps } });
    };

    if (selectedOpId === 'removeHashing') {
        let currId = headId;
        let prevId = null;
        let seenSet = new Set();
        addStep("Method Call", "removeDuplicates(head) started.", 1, { currId: null, prevId: null, seenSet: new Set() });
        addStep("Setup", "HashSet and pointers initialized.", 4, { currId, prevId, seenSet: new Set() });
        while (currId !== null) {
            let currNode = list.find(n => n.id === currId);
            addStep("Traversal", `Inspecting Node(${String(currNode.val)}).`, 9, { currId, prevId, seenSet: new Set(seenSet) });
            if (seenSet.has(currNode.val)) {
                addStep("Duplicate Hit", `${String(currNode.val)} is in HashSet!`, 10, { currId, prevId, seenSet: new Set(seenSet), isDuplicate: true });
                if (prevId !== null) {
                    let pNode = list.find(n => n.id === prevId);
                    pNode.nextId = currNode.nextId;
                }
                addStep("Pointer Stretch", "Skipping duplicate node.", 11, { currId, prevId, seenSet: new Set(seenSet), isDuplicate: true, bypassedId: currId });
            } else {
                addStep("Unique Node", `Storing ${String(currNode.val)} in set.`, 13, { currId, prevId, seenSet: new Set(seenSet) });
                seenSet.add(currNode.val);
                prevId = currId;
                addStep("Pointer Step", "Advancing prev pointer.", 15, { currId, prevId, seenSet: new Set(seenSet) });
            }
            currId = currNode.nextId;
            addStep("Continue", "Moving forward.", 17, { currId, prevId, seenSet: new Set(seenSet) });
        }
        
        let finalNodes = [];
        let cur = headId;
        while(cur !== null) {
            let node = list.find(n => n.id === cur);
            finalNodes.push(node.val);
            cur = node.nextId;
        }
        addStep("Final Answer", `Return unique head. Sequence: [${finalNodes.join(' → ')}]`, 19, { isSuccess: true, seenSet: new Set(seenSet), finalSeq: finalNodes.join(' → ') });
    } else if (selectedOpId === 'removeBruteForce') {
        let p1Id = headId;
        addStep("Outer Start", "Outer pointer at head.", 2, { p1Id });
        while (p1Id !== null) {
            let p1Node = list.find(n => n.id === p1Id);
            let p2Id = p1Id;
            addStep("Inner Start", `Scanning for copies of ${String(p1Node.val)}.`, 5, { p1Id, p2Id });
            while (true) {
                let p2Node = list.find(n => n.id === p2Id);
                let nId = p2Node?.nextId;
                if (nId === null || nId === undefined) break;
                let nextNode = list.find(n => n.id === nId);
                addStep("Comparison", `Compare ${String(p1Node.val)} with ${String(nextNode.val)}.`, 9, { p1Id, p2Id, comparingId: nId });
                if (p1Node.val === nextNode.val) {
                    addStep("Match!", "Removing inner duplicate.", 11, { p1Id, p2Id, isDuplicate: true, bypassedId: nId });
                    p2Node.nextId = nextNode.nextId;
                    addStep("Bridge", "Pointers updated.", 11, { p1Id, p2Id, isDuplicate: true, bypassedId: nId });
                } else {
                    p2Id = nId;
                    addStep("No Match", "Moving inner scanner forward.", 13, { p1Id, p2Id });
                }
            }
            p1Id = p1Node.nextId;
            addStep("Outer Next", "Moving to next unique candidate.", 16, { p1Id });
        }
        let finalNodes = [];
        let cur = headId;
        while(cur !== null) {
            let node = list.find(n => n.id === cur);
            finalNodes.push(node.val);
            cur = node.nextId;
        }
        addStep("Final Answer", `Scan complete. Final Sequence: [${finalNodes.join(' → ')}]`, 18, { isSuccess: true, finalSeq: finalNodes.join(' → ') });
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

  const curStep = trace[currentStep] || trace[0] || { state: { list: [] } };
  const st = curStep.state || { list: [] };
  const themeColor = selectedOpId === 'removeHashing' ? 'indigo' : 'rose';
  const isLastStep = currentStep === trace.length - 1;

  const renderSvgArrows = () => {
    return st.list.map((node) => {
        if (node.nextId === null) return null;
        const target = st.list.find(n => n.id === node.nextId);
        if (!target) return null;
        const startX = node.x + 92, startY = node.y + 28, endX = target.x - 6, endY = target.y + 28;
        const isBypassAction = st.bypassedId === node.nextId && st.isDuplicate;
        const strokeColor = isBypassAction ? '#f43f5e' : '#cbd5e1';
        const strokeWidth = isBypassAction ? 4 : 2;
        const isLongJump = target.id > node.id + 1;
        const pathD = isLongJump 
            ? `M ${startX},${startY} C ${startX + 50},${startY + 95} ${endX - 50},${endY + 95} ${endX},${endY}`
            : `M ${startX},${startY} C ${startX + 15},${startY} ${endX - 15},${endY} ${endX},${endY}`;
        return <path key={`link-${node.id}-${target.id}`} d={pathD} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} markerEnd="url(#arrowhead-default)" className="transition-all duration-500" />;
    });
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-rose-600 p-4 rounded-2xl shadow-lg flex items-center justify-center"><Trash2 className="text-white" size={28} /></div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Remove Duplicates</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono"><span className="font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded tracking-widest uppercase">Physical Memory View</span><span>•</span><span>Data Structures</span></div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto max-w-full">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-4 rounded-2xl border text-left flex flex-col gap-2 transition-all shadow-sm ${selectedOpId === op.id ? `bg-rose-600 text-white border-rose-600 shadow-rose-200 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-xs font-black uppercase tracking-tight">{op.title}</span></div>
                            <div className={`text-[10px] font-mono ${selectedOpId === op.id ? 'text-rose-100' : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[400px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> LinkedList.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStep.line === idx + 1} theme={themeColor} />
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-end gap-4">
                    <div className="flex-1 space-y-1.5 w-full"><label className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-400 pl-1">Nodes (Max 8)</label><input type="text" value={inputList} onChange={(e) => setInputList(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-inner" /></div>
                    <div className="flex gap-2 shrink-0">
                        <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm"><RotateCcw size={20}/></button>
                        <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm"><ChevronLeft size={20}/></button>
                        <button 
                            onClick={handleNext} 
                            disabled={isLastStep}
                            className={`px-8 py-3 bg-rose-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all flex items-center gap-2 group disabled:opacity-30 disabled:hover:scale-100 disabled:bg-slate-400 disabled:shadow-none`}
                        >
                            STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                        </button>
                    </div>
                </div>

                <div className={`rounded-3xl p-6 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden shrink-0 ${st.isDuplicate ? 'bg-rose-900 border-rose-800' : st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-[#0f172a] border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Log</span></div>
                        <span>Line {String(curStep.line || 0)}</span>
                    </div>
                    
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3">
                                <PartyPopper size={24}/> COMPLETED
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold italic">
                                List unique sequence established.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-none truncate">{String(curStep.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-white/5 pt-3 italic font-mono relative z-10">{String(curStep.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col shadow-inner overflow-hidden min-h-[460px]">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Network size={14} className="text-rose-500"/> Physical Memory Heap</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2"><button onClick={zoomIn} title="Zoom In" className="p-2 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"><ZoomIn size={18}/></button><button onClick={zoomOut} title="Zoom Out" className="p-2 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"><ZoomOut size={18}/></button></div>
                        {selectedOpId === 'removeHashing' && st.seenSet && <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 w-36 flex flex-col shadow-2xl border-b-4 border-b-indigo-500"><span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-3 font-mono flex items-center justify-between">HashSet <Hash size={12}/></span><div className="flex flex-wrap gap-1.5 h-32 overflow-y-auto scrollbar-none content-start">{Array.from(st.seenSet).map((v, i) => <div key={i} className="bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 text-[10px] font-black font-mono py-1 px-2 rounded-lg animate-in zoom-in">{String(v)}</div>)}</div></div>}
                   </div>

                   {/* Final Result Card Pop-up */}
                   {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 pointer-events-none">
                            <div className="bg-[#1e293b] border-2 border-emerald-500 rounded-[2rem] p-8 shadow-2xl animate-in zoom-in duration-500 pointer-events-auto max-w-md w-full text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Trophy size={32}/>
                                </div>
                                <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">Final Answer</h2>
                                <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 font-mono text-emerald-400 text-lg font-bold break-all mb-6 shadow-inner">
                                    {String(st.finalSeq)}
                                </div>
                                <button onClick={handleReset} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                                    <RotateCcw size={18}/> START AGAIN
                                </button>
                            </div>
                        </div>
                   )}

                   <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:20px_20px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={() => setIsDragging(false)} onPointerLeave={() => setIsDragging(false)}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left pointer-events-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0"><defs><marker id="arrowhead-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker></defs>{renderSvgArrows()}</svg>
                           {st.list.map((nodeObj, idx) => {
                              const isCurr = st.currId === nodeObj.id; const isPrev = st.prevId === nodeObj.id;
                              const isP1 = st.p1Id === nodeObj.id; const isP2 = st.p2Id === nodeObj.id;
                              const isTarget = isCurr || isP1 || isP2 || st.comparingId === nodeObj.id;
                              const isDeleted = st.bypassedId === nodeObj.id && st.isDuplicate;
                              const lbls = [];
                              if (idx === 0) lbls.push({ text: "head", color: "emerald", pos: "top" });
                              if (isCurr) lbls.push({ text: "curr", color: "rose", pos: "bottom" });
                              if (isPrev) lbls.push({ text: "prev", color: "sky", pos: "top" });
                              if (isP1) lbls.push({ text: "ptr1", color: "rose", pos: "top" });
                              if (isP2) lbls.push({ text: "ptr2", color: "sky", pos: "bottom" });
                              if (st.comparingId === nodeObj.id) lbls.push({ text: "comp", color: "amber", pos: "top" });
                              return (
                                  <div key={nodeObj.id} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} nextAddr={nodeObj.nextId !== null ? (st.list.find(n=>n.id===nodeObj.nextId)?.addr ?? 'null') : 'null'} isTarget={isTarget} themeColor={isDeleted ? 'rose' : 'slate'} isBypassed={isDeleted}/>
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