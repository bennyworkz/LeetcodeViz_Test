import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp, ArrowLeft,
  ChevronLeft, ChevronRight, Network, Database, RotateCcw, 
  ListOrdered, RefreshCw, Zap, Goal, Info, Layers, 
  ZoomIn, ZoomOut, Maximize, Hash, Trash2, Search,
  Scissors, ShieldAlert, Cpu, Lightbulb, PlayCircle,
  MonitorPlay, PartyPopper, CheckCircle2, XCircle, X,
  Filter, Terminal, Braces, Box, GitCommit, GitBranch,
  Split, GitMerge, Layout, Layers as LayersIcon
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
}

interface PointerLabelProps {
  label: string;
  color: string;
  position: string;
  offset?: number;
}

interface ListNodeBlockProps {
  val: number | null;
  address: string;
  themeColor?: string;
  isTarget: boolean;
  isBypassed: boolean;
  isDummy?: boolean;
}

const OPERATIONS = {
  removeAllIterative: {
    id: 'removeAllIterative',
    title: 'Iterative (Sentinel)',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public Node removeAllDuplicates(Node head) {
    // 1. Dummy node handles deletions at the head
    Node dummy = new Node(0);
    dummy.next = head;
    Node prev = dummy;
    
    while (head != null) {
        // 2. Detect a duplicate sub-sequence
        if (head.next != null && head.data == head.next.data) {
            // Skip all nodes with the same value
            while (head.next != null && head.data == head.next.data) {
                head = head.next;
            }
            // Bridge over the entire purged sequence
            prev.next = head.next;
        } else {
            // No duplicate, safe to advance prev
            prev = prev.next;
        }
        head = head.next;
    }
    return dummy.next;
}`,
    desc: "The gold standard interview solution. It uses a Sentinel (Dummy) node to maintain a stable reference to the list start, even if the original head is purged. By maintaining a 'prev' pointer that only advances on unique nodes, we can surgically remove entire segments of duplicates in O(1) space."
  },
  removeAllRecursive: {
    id: 'removeAllRecursive',
    title: 'Recursive Strategy',
    icon: <RefreshCw size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public Node removeAllDuplicates(Node head) {
    if (head == null || head.next == null) return head;

    if (head.data == head.next.data) {
        // Skip all occurrences of this value
        while (head.next != null && head.data == head.next.data) {
            head = head.next;
        }
        // Return result of call on next distinct node
        return removeAllDuplicates(head.next);
    } else {
        // Keep head and process sublist
        head.next = removeAllDuplicates(head.next);
        return head;
    }
}`,
    desc: "A declarative approach that leverages the call stack to process the list. If a duplicate cluster is found at the current level, it is entirely discarded, and the result of the recursive call on the next unique value is returned up the stack."
  }
};

// --- Sub-components (Defined before App to avoid ReferenceErrors) ---

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${
      active 
        ? 'bg-[#1e293b] text-white shadow-md scale-105' 
        : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
    }`}
  >
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|Node|true|false|System|out|print|println|static|removeAllDuplicates|head|next|data|dummy|prev)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-rose-500/20`, border: `border-rose-500`, text: `text-rose-400` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-rose-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'return', 'if', 'else', 'while', 'boolean', 'void', 'new'].includes(part);
            const isObject = ['Node', 'HashSet'].includes(part);
            const isNumber = !isNaN(parseInt(part));
            const isComment = part.startsWith('//');
            const isPointer = ['prev', 'curr', 'head', 'dummy', 'next', 'data'].includes(part);
            return (
              <span key={i} className={isComment ? 'text-slate-500 italic' : isKeyword ? 'text-pink-400 font-bold' : isObject ? 'text-sky-400 font-bold' : isNumber ? 'text-emerald-400' : isPointer ? 'text-rose-400' : ''}>
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

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, themeColor = 'slate', isTarget, isBypassed, isDummy }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800' }
    };
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-rose-300 shadow-xl z-20 scale-105` : `shadow-sm z-10`;

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500 ${isBypassed ? 'opacity-20 grayscale blur-[1px]' : ''}`}>
            <span className="text-[10px] text-slate-400 font-mono font-bold mb-1 opacity-80 tracking-tight">{isDummy ? 'Heap Sentinel' : address}</span>
            <div className={`flex items-center w-28 h-14 border-2 rounded-2xl transition-all duration-300 ${isDummy ? 'bg-slate-800 border-slate-600' : activeTheme.bg} ${isDummy ? '' : activeTheme.border} ${targetClasses} relative shadow-sm`}>
                <div className={`flex-1 flex justify-center font-mono font-black text-2xl ${isDummy ? 'text-white' : activeTheme.text}`}>
                    {isDummy ? 'D' : val}
                </div>
                <div className={`w-10 h-full border-l-2 flex flex-col items-center justify-center rounded-r-xl ${isDummy ? 'border-slate-600 bg-slate-700' : 'border-slate-200 bg-slate-50'}`}>
                    <span className={`text-[7px] font-black uppercase tracking-widest opacity-60 transform -rotate-90 ${isDummy ? 'text-slate-300' : ''}`}>NEXT</span>
                </div>
            </div>
        </div>
    );
};

// --- Content Components ---

const OverviewTab = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
      <div className="max-w-4xl space-y-12 text-slate-700">
        <section>
          <div className="flex items-center gap-3 mb-6 text-rose-600">
              <Filter size={32} />
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">The "Absolute Purge" Concept</h2>
          </div>
          <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
            <p className="text-lg leading-relaxed">
              Standard duplicate removal keeps one instance of every value. However, the <strong>Remove All Occurrences</strong> challenge requires us to delete <em>every node</em> associated with a duplicated value, leaving behind only the nodes that were unique from the very beginning.
            </p>
            <div className="bg-slate-50 border-l-4 border-rose-500 p-6 rounded-r-2xl font-mono text-sm shadow-sm flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1">
                  <span className="text-slate-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Unfiltered Sequence:</span>
                  "1 → 2 → 2 → 3 → 3 → 4" 
              </div>
              <ArrowRight size={24} className="text-rose-400 hidden md:block"/> 
              <div className="flex-1">
                  <span className="text-slate-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Filtered Outcome:</span>
                  <span className="text-rose-600 font-bold">"1 → 4"</span>
              </div>
            </div>
          </div>
        </section>
  
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform"><Layout size={80}/></div>
            <h4 className="flex items-center gap-2 font-black text-slate-800 uppercase tracking-widest text-xs mb-4">
              <ShieldAlert size={16} className="text-rose-500"/> Managing the Head
            </h4>
            <p className="text-sm leading-relaxed text-slate-600">
              If the first few nodes are duplicates (e.g., <code>1→1→2</code>), the <code>head</code> pointer itself must move. Without a <strong>Dummy Node</strong>, you would need complex conditional logic to handle deletions at the start of the list. 
            </p>
          </div>
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform"><Zap size={80}/></div>
            <h4 className="flex items-center gap-2 font-black text-slate-800 uppercase tracking-widest text-xs mb-4">
              <Goal size={16} className="text-indigo-500"/> The Purging Logic
            </h4>
            <p className="text-sm leading-relaxed text-slate-600">
              The algorithm doesn't just delete neighbors; it looks ahead. If <code>curr</code> and <code>curr.next</code> are identical, it fast-forwards through the entire sub-sequence before updating the link from <code>prev</code>.
            </p>
          </div>
        </section>
      </div>
    </div>
);
  
const TheoryTab = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
      <div className="max-w-4xl space-y-10 text-slate-700">
        <div className="flex items-center gap-3 mb-2 text-indigo-600">
            <Database size={28} />
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Technical Deep Dive</h2>
        </div>

        <div className="grid grid-cols-1 gap-8">
            <div className="p-8 rounded-3xl bg-[#0f172a] text-white relative overflow-hidden border border-slate-800 shadow-xl">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Terminal size={120}/></div>
                <h4 className="font-black text-rose-400 uppercase tracking-widest text-xs mb-6 flex items-center gap-2"><Braces size={16}/> Iterative Sentinel Pattern</h4>
                <div className="space-y-6 font-sans text-sm text-slate-300">
                    <p>The core difficulty lies in <strong>deleting the head</strong>. By using a Dummy node, the head of our resulting list is always <code>dummy.next</code>. We maintain two pointers:</p>
                    <ul className="list-none space-y-4">
                        <li className="flex gap-4">
                            <div className="p-2 bg-white/5 rounded-lg border border-white/10 h-fit text-rose-400"><Goal size={18}/></div>
                            <p><strong>Prev:</strong> Points to the last node that is confirmed to be unique and part of the final list. This is your "secure base".</p>
                        </li>
                        <li className="flex gap-4">
                            <div className="p-2 bg-white/5 rounded-lg border border-white/10 h-fit text-sky-400"><Search size={18}/></div>
                            <p><strong>Head (Scan Pointer):</strong> Explores forward. When it sees identical neighbors, it transforms into a "runner" that consumes the entire duplicate cluster.</p>
                        </li>
                    </ul>
                    <p className="bg-white/5 p-5 rounded-2xl border border-white/10 italic leading-relaxed text-slate-400 text-xs">
                        "The trick is only advancing the <code>prev</code> pointer when you are certain the current <code>head</code> is unique. If a duplicate sequence was found, <code>prev.next</code> is updated, but <code>prev</code> itself stays put because the new <code>prev.next</code> might also be a duplicate cluster."
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm hover:border-indigo-100 transition-colors">
                    <h5 className="font-black text-xs uppercase text-slate-400 mb-3 flex items-center gap-2"><Cpu size={14}/> Time: O(N)</h5>
                    <p className="text-sm text-slate-600 leading-relaxed">Each node is visited exactly once by the <code>head</code> pointer. The nested loop only advances the same pointer forward, resulting in a single linear pass.</p>
                </div>
                <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm hover:border-rose-100 transition-colors">
                    <h5 className="font-black text-xs uppercase text-slate-400 mb-3 flex items-center gap-2"><Maximize size={14}/> Space: O(1)</h5>
                    <p className="text-sm text-slate-600 leading-relaxed">No auxiliary data structures like sets or maps are needed because the list is sorted. Sorting provides adjacency information for free.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
);
  
const InterviewTab = () => (
    <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-12 font-sans text-slate-800">
         <div className="bg-rose-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-rose-500">
             <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
             <h3 className="text-2xl font-black flex items-center gap-3 mb-4 text-white relative z-10 uppercase tracking-tight">The "A+" Performance</h3>
             <p className="text-sm text-rose-50 leading-relaxed italic relative z-10 mb-6 max-w-2xl font-mono">
               "When an interviewer asks this, they are checking if you can visualize pointer jumps. Always mention the Dummy node first—it shows you anticipate head-deletion edge cases and are thinking about memory safety."
             </p>
         </div>

         <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
                <h4 className="font-black uppercase tracking-widest text-[11px] flex items-center gap-2 border-b pb-2 text-indigo-600">
                    <CheckCircle2 size={16} className="text-emerald-500"/> Tactical Strategy
                </h4>
                <div className="space-y-5">
                    <div className="flex gap-4 group">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg h-fit group-hover:scale-110 transition-transform"><GitCommit size={16}/></div>
                        <p className="text-sm text-slate-600 leading-relaxed"><strong>Pointer Hygiene:</strong> Explain why <code>prev</code> stays where it is after a purge—the new <code>prev.next</code> could be another duplicate cluster!</p>
                    </div>
                    <div className="flex gap-4 group">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg h-fit group-hover:scale-110 transition-transform"><Split size={16}/></div>
                        <p className="text-sm text-slate-600 leading-relaxed"><strong>Fast-Forward:</strong> Frame the inner <code>while</code> loop as a "purge filter" that collapses duplicate sequences into single links.</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h4 className="font-black uppercase tracking-widest text-[11px] flex items-center gap-2 border-b pb-2 text-rose-500">
                    <XCircle size={16} className="text-rose-500"/> Critical Red Flags
                </h4>
                <ul className="text-sm space-y-4 text-slate-600 list-disc pl-5">
                    <li><strong className="text-slate-900">Memory Leaks:</strong> In manual memory languages, purging must include <code>delete</code> or <code>free</code> on skipped nodes.</li>
                    <li><strong className="text-slate-900">Null Pointer:</strong> Attempting <code>head.next.data</code> without verifying <code>head.next</code> exists first.</li>
                    <li><strong className="text-slate-900">Off-by-One:</strong> Failing to correctly identify the boundary between the duplicate sequence and the next unique node.</li>
                </ul>
            </div>
         </div>
    </div>
);

// --- Main Application ---

export default function removeAllDuplicatesViz() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('removeAllIterative');
  const [inputList, setInputList] = useState('1, 1, 2, 3, 3, 4');
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
        const vals = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)).sort((a,b)=>a-b).slice(0, 10);
        return vals.map((v, i) => {
            const col = (i + 1) % 4;
            const row = Math.floor((i + 1) / 4);
            const x = 60 + col * 200; 
            const y = 80 + row * 160 + (col % 2 === 1 ? 40 : 0); 
            return { id: i, val: v, addr: '0x' + (100 + (i * 32)).toString(16).toUpperCase().padStart(3, '0'), nextId: i < vals.length - 1 ? i + 1 : null, x, y };
        });
    };
    setBaseList(generateNodes(inputList));
    setCurrentStep(0);
    setPan({ x: 0, y: 0 });
  }, [inputList, selectedOpId]);

  const trace = useMemo(() => {
    const steps = [];
    if (baseList.length === 0) return steps;
    const dummyNode = { id: -1, val: null, addr: "SENTINEL", nextId: 0, x: 60, y: 80, isDummy: true };
    const extendedList = [dummyNode, ...baseList.map(n => ({...n}))];

    const addStep = (phase, desc, line, stateProps) => {
      steps.push({ phase, description: desc, line, state: { list: extendedList.map(n=>({...n})), ...stateProps } });
    };

    if (selectedOpId === 'removeAllIterative') {
        let prevId = -1;
        let headId = 0;
        let purgedIds = new Set();
        addStep("Method Call", "removeAllDuplicates(head) started.", 1, { headId: null, prevId: null });
        addStep("Sentinel Init", "Dummy node placed at the start.", 4, { headId, prevId });

        while (headId !== null) {
            let currNode = extendedList.find(n => n.id === headId);
            let nextId = currNode?.nextId;
            let nextNode = extendedList.find(n => n.id === nextId);

            addStep("Scan Ahead", `Inspecting Node(${String(currNode.val)}).`, 10, { headId, prevId, purgedIds: new Set(purgedIds) });

            if (nextId !== null && currNode.val === nextNode.val) {
                addStep("Twins Identified", `Value ${String(currNode.val)} repeated. Beginning purge...`, 12, { headId, prevId, isPurging: true, purgedIds: new Set(purgedIds) });
                let runnerId = headId;
                while (true) {
                    let rNode = extendedList.find(n => n.id === runnerId);
                    let nRId = rNode?.nextId;
                    let nRNode = extendedList.find(n => n.id === nRId);
                    purgedIds.add(runnerId);
                    if (nRId === null || rNode.val !== nRNode.val) {
                        headId = runnerId;
                        break;
                    }
                    runnerId = nRId;
                }
                addStep("Bridge Link", "Bypassing every node in the redundant sequence.", 16, { headId, prevId, isPurging: true, purgedIds: new Set(purgedIds) });
                let pNode = extendedList.find(n => n.id === prevId);
                let currentAfterPurge = extendedList.find(n => n.id === headId);
                pNode.nextId = currentAfterPurge.nextId;
            } else {
                addStep("Unique Node", `Value ${String(currNode.val)} is unique. Keeping.`, 19, { headId, prevId });
                prevId = headId;
            }
            let hNode = extendedList.find(n => n.id === headId);
            headId = hNode.nextId;
            addStep("Next Position", "Advancing head pointer forward.", 21, { headId, prevId, purgedIds: new Set(purgedIds) });
        }

        let finalNodes = [];
        let curId = extendedList.find(n => n.id === -1).nextId;
        while(curId !== null) {
            let node = extendedList.find(n => n.id === curId);
            finalNodes.push(node.val);
            curId = node.nextId;
        }
        addStep("Final Answer", "Purge sequence complete.", 23, { isSuccess: true, finalSeq: finalNodes.length ? finalNodes.join(' → ') : 'NULL' });
    } else {
        let purgedIds = new Set();
        let headId = 0;
        addStep("Start Stack", "Initiating recursive calls.", 2, { headId });
        const recurse = (hId, depth) => {
            if (hId === null) return null;
            let node = extendedList.find(n => n.id === hId);
            let nextId = node.nextId;
            let nextNode = extendedList.find(n => n.id === nextId);
            addStep(`Depth ${String(depth)}`, `Checking Node(${String(node.val)}).`, 5, { headId: hId, depth });
            if (nextId !== null && node.val === nextNode.val) {
                addStep("Recurse Discard", "Group found. Skipping...", 7, { headId: hId, depth, isPurging: true });
                let runner = hId;
                while(true) {
                    let rNode = extendedList.find(n => n.id === runner);
                    let nRId = rNode.nextId;
                    let nRNode = extendedList.find(n => n.id === nRId);
                    purgedIds.add(runner);
                    if (nRId === null || rNode.val !== nRNode.val) break;
                    runner = nRId;
                }
                let nextDistinct = extendedList.find(n => n.id === runner).nextId;
                return recurse(nextDistinct, depth + 1);
            } else {
                addStep("Recurse Keep", "Node is unique. Moving deep.", 12, { headId: hId, depth });
                node.nextId = recurse(nextId, depth + 1);
                return hId;
            }
        };
        recurse(headId, 1);
        let finalNodes = [];
        let curId = extendedList.find(n => n.id === -1).nextId;
        while(curId !== null) {
            let node = extendedList.find(n => n.id === curId);
            finalNodes.push(node.val);
            curId = node.nextId;
        }
        addStep("Final Answer", "Recursive purge complete.", 15, { isSuccess: true, finalSeq: finalNodes.length ? finalNodes.join(' → ') : 'NULL', purgedIds });
    }
    return steps;
  }, [baseList, selectedOpId]);

  const handleNext = () => { if (currentStep < trace.length - 1) setCurrentStep(prev => prev + 1); };
  const handlePrev = () => { if (currentStep > 0) setCurrentStep(prev => prev - 1); };
  const handleReset = () => { setCurrentStep(0); setPan({ x: 0, y: 0 }); setZoom(0.85); };
  const handleCopy = () => { navigator.clipboard.writeText(selectedOp.code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 2));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));

  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handlePointerMove = (e) => { 
    if (isDragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); 
  };
  const handlePointerUp = () => setIsDragging(false);

  const curStepData = trace[currentStep] || trace[0] || { state: { list: [] } };
  const st = curStepData.state || { list: [] };
  const isLastStep = currentStep === trace.length - 1;

  const renderSvgArrows = () => {
    return st.list.map((node) => {
        if (node.nextId === null) return null;
        const target = st.list.find(n => n.id === node.nextId);
        if (!target) return null;
        const startX = node.x + 92, startY = node.y + 28, endX = target.x - 6, endY = target.y + 28;
        const isBypassAction = st.purgedIds?.has(node.nextId) || (st.prevId === node.id && st.isPurging);
        const strokeColor = isBypassAction ? '#f43f5e' : '#cbd5e1';
        const isLongJump = target.id > node.id + 1 || target.id === -1;
        const pathD = isLongJump 
            ? `M ${startX},${startY} C ${startX + 50},${startY + 95} ${endX - 50},${endY + 95} ${endX},${endY}`
            : `M ${startX},${startY} C ${startX + 15},${startY} ${endX - 15},${endY} ${endX},${endY}`;
        return <path key={`link-${node.id}-${target.id}`} d={pathD} fill="none" stroke={strokeColor} strokeWidth={isBypassAction ? 4 : 2} markerEnd="url(#arrowhead-default)" className="transition-all duration-500" />;
    });
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-rose-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <Trash2 className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Purge Duplicates</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono"><span className="font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded tracking-widest uppercase">Sorted List Mode</span></div>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Purge.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-end gap-4">
                    <div className="flex-1 space-y-1.5 w-full"><label className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-400 pl-1">Sorted Input</label><input type="text" value={inputList} onChange={(e) => setInputList(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-inner" /></div>
                    <div className="flex gap-2 shrink-0">
                        <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={20}/></button>
                        <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={20}/></button>
                        <button 
                            onClick={handleNext} 
                            disabled={isLastStep || st.isSuccess} 
                            className={`px-8 py-3 bg-rose-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all flex items-center gap-2 group disabled:opacity-30 disabled:grayscale`}
                        >
                            {isLastStep ? 'FINISH' : 'STEP'} <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                        </button>
                    </div>
                </div>

                <div className={`rounded-3xl p-6 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden shrink-0 ${st.isPurging ? 'bg-rose-900 border-rose-800' : st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-[#0f172a] border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <span>Line {String(curStepData.line || 0)}</span>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> COMPLETED</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold italic">List purged. Unique elements returned.</p>
                         </div>
                    ) : (
                        <>
                            <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-none truncate">{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-white/5 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col shadow-inner overflow-hidden min-h-[460px]">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Network size={14} className="text-rose-500"/> Whiteboard View</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2"><button onClick={zoomIn} title="Zoom In" className="p-2 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"><ZoomIn size={18}/></button><button onClick={zoomOut} title="Zoom Out" className="p-2 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"><ZoomOut size={18}/></button></div>
                   </div>

                   {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 pointer-events-none">
                            <div className="bg-[#1e293b] border-2 border-emerald-500 rounded-[2rem] p-8 shadow-2xl animate-in zoom-in duration-500 pointer-events-auto max-w-md w-full text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"><Trophy size={32}/></div>
                                <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2 tracking-widest">RESULT</h2>
                                <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 font-mono text-emerald-400 text-lg font-bold break-all mb-6 shadow-inner">{String(st.finalSeq)}</div>
                                <button onClick={handleReset} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"><RotateCcw size={18}/> RESTART VIZ</button>
                            </div>
                        </div>
                   )}

                   <div 
                    className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:20px_20px]" 
                    onPointerDown={handlePointerDown} 
                    onPointerMove={handlePointerMove} 
                    onPointerUp={handlePointerUp} 
                    onPointerLeave={handlePointerUp}
                   >
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left pointer-events-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0"><defs><marker id="arrowhead-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker></defs>{renderSvgArrows()}</svg>
                           {st.list.map((nodeObj, idx) => {
                              const isHead = st.headId === nodeObj.id; const isPrev = st.prevId === nodeObj.id;
                              const isTarget = isHead || isPrev;
                              const isDeleted = st.purgedIds?.has(nodeObj.id);
                              const lbls = [];
                              if (isHead && !isDeleted) lbls.push({ text: "head", color: "rose", pos: "bottom" });
                              if (isPrev) lbls.push({ text: "prev", color: "emerald", pos: "top" });
                              if (nodeObj.isDummy) lbls.push({ text: "sentinel", color: "slate", pos: "top" });
                              return (
                                  <div key={nodeObj.id} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isTarget} themeColor={isDeleted ? 'rose' : (nodeObj.isDummy ? 'slate' : 'emerald')} isBypassed={isDeleted} isDummy={nodeObj.isDummy}/>
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