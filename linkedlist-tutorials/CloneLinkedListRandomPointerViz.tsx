import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp, ArrowLeft,
  ChevronLeft, ChevronRight, Network, Database, RotateCcw, 
  ListOrdered, RefreshCw, Zap, Goal, Info, Layers, 
  ZoomIn, ZoomOut, Maximize, Hash, Trash2, Search,
  Scissors, ShieldAlert, Cpu, Lightbulb, PlayCircle,
  MonitorPlay, PartyPopper, CheckCircle2, XCircle, X,
  Filter, Terminal, Braces, Layout, Minimize, Repeat,
  GitCommit, Split, GitMerge, Share2, MousePointer2, 
  Binary, Layers as LayersIcon, CircleDashed, CheckSquare, PlusSquare, ArrowLeftToLine, AlignVerticalSpaceAround,
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  inPlaceClone: {
    id: 'inPlaceClone',
    title: 'In-Place Interweaving (Optimal)',
    icon: <Replace size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public Node copyRandomList(Node head) {
    if (head == null) return null;

    // 1. Insert clone immediately after original
    Node curr = head;
    while (curr != null) {
        Node clone = new Node(curr.val);
        clone.next = curr.next;
        curr.next = clone;
        curr = clone.next;
    }

    // 2. Set random pointers for clones
    curr = head;
    while (curr != null) {
        if (curr.random != null) {
            curr.next.random = curr.random.next;
        }
        curr = curr.next.next;
    }

    // 3. Detach clones to form a separate list
    curr = head;
    Node cloneHead = head.next;
    while (curr != null) {
        Node clone = curr.next;
        curr.next = clone.next;
        if (clone.next != null) {
            clone.next = clone.next.next;
        }
        curr = curr.next;
    }

    return cloneHead;
}`,
    desc: "The optimal approach. Instead of using a HashMap, we interweave the cloned nodes directly into the original list (A -> A' -> B -> B'). This allows us to easily find the cloned random target by simply looking at curr.random.next. Finally, we safely untangle the two lists to restore the original and isolate the clone."
  },
  hashIterative: {
    id: 'hashIterative',
    title: 'Iterative Hashing',
    icon: <Database size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public Node copyRandomListHash(Node head) {
    if (head == null) return null;
    
    HashMap<Node, Node> map = new HashMap<>();
    Node curr = head;

    // 1. Traverse and create clone for each node
    while (curr != null) {
        map.put(curr, new Node(curr.val));
        curr = curr.next;
    }

    // 2. Traverse again to assign next and random
    curr = head;
    while (curr != null) {
        Node clone = map.get(curr);
        clone.next = map.get(curr.next);
        clone.random = map.get(curr.random);
        curr = curr.next;
    }

    return map.get(head);
}`,
    desc: "A naive but intuitive approach. We use a HashMap to maintain a 1:1 mapping between Original nodes and their respective Clones. We complete this in two passes: the first pass instantiates the clones, and the second pass wires up their 'next' and 'random' pointers using the map."
  },
  hashRecursive: {
    id: 'hashRecursive',
    title: 'Recursive Hashing',
    icon: <Layers size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `HashMap<Node, Node> map = new HashMap<>();

public Node copyRandomListRec(Node head) {
    if (head == null) return null;

    // If clone already exists in map, return it
    if (map.containsKey(head)) {
        return map.get(head);
    }

    // Create new clone and save in map immediately
    Node clone = new Node(head.val);
    map.put(head, clone);

    // Recursively set next and random pointers
    clone.next = copyRandomListRec(head.next);
    clone.random = copyRandomListRec(head.random);

    return clone;
}`,
    desc: "A highly elegant, graph-traversal style approach. We recursively deep-copy the list. To prevent infinite loops (due to circular random pointers), we cache created clones in a global HashMap. If a node is already in the map, we simply return its cached clone."
  }
};

// --- Helper UI Components ---

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|void|return|if|else|while|Node|null|copyRandomList|copyRandomListHash|copyRandomListRec|head|curr|clone|next|random|val|new|HashMap|map|put|get|containsKey|cloneHead)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-indigo-500/20`, border: `border-indigo-500`, text: `text-indigo-400` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-indigo-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'void', 'return', 'if', 'else', 'while', 'new'].includes(part);
            const isObject = ['Node', 'HashMap'].includes(part);
            const isConst = ['null'].includes(part);
            const isPointer = ['head', 'curr', 'clone', 'cloneHead', 'next', 'random'].includes(part);
            const isMapCall = ['map', 'put', 'get', 'containsKey'].includes(part);
            return (
              <span 
                key={i} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-sky-400 font-bold' : 
                  isConst ? 'text-orange-400 font-bold' :
                  isPointer ? 'text-indigo-400' : 
                  isMapCall ? 'text-amber-400' :
                  isNaN(parseInt(part)) && part.trim() !== '<' && part.trim() !== '>' ? '' : 'text-emerald-400'
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

interface PointerLabelProps {
  label: string;
  color: string;
  position: string;
  offset?: number;
}

const PointerLabel: React.FC<PointerLabelProps> = ({ label, color, position, offset = 0 }) => {
    const colorClasses = {
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        sky: 'bg-sky-100 text-sky-700 border-sky-200',
        indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
        rose: 'bg-rose-100 text-rose-700 border-rose-200',
        amber: 'bg-amber-100 text-amber-700 border-amber-200',
        slate: 'bg-white text-slate-500 border-slate-200'
    };
    const activeColorClass = colorClasses[color] || colorClasses['slate'];
    const alignClass = position === 'top' ? 'flex-col-reverse -top-12' : 'flex-col -bottom-12';

    return (
        <div className={`absolute ${alignClass} flex items-center justify-center animate-in zoom-in duration-300 z-30`} style={{ transform: `translateX(${offset}px)`}}>
            <span className={`text-[10px] font-black font-mono tracking-widest px-2 py-0.5 rounded border shadow-sm ${activeColorClass}`}>
                {String(label)}
            </span>
            {position === 'top' ? <ArrowDown size={14} className={`text-${color}-500`} strokeWidth={3}/> : <ArrowUp size={14} className={`text-${color}-500`} strokeWidth={3}/>}
        </div>
    );
};

interface ListNodeBlockProps {
  val: string | number;
  address: string;
  themeColor?: string;
  isTarget?: boolean;
  nodeType?: string;
}

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, themeColor = 'slate', isTarget, nodeType }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700' }
    };
    
    const isClone = nodeType === 'clone';
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-105` : `shadow-sm z-10`;

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <span className="text-[10px] text-slate-400 font-mono font-bold mb-1 opacity-80 tracking-tight">{String(address)}</span>
            <div className={`flex flex-col items-center w-24 h-16 border-2 rounded-2xl transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-xl border-b border-black/10 ${activeTheme.text}`}>
                    {String(val)}
                    {isClone && <span className="text-xs ml-0.5 opacity-60">'</span>}
                </div>
                <div className="flex w-full h-5">
                    <div className={`flex-1 flex items-center justify-center border-r border-black/10 ${isClone ? 'bg-fuchsia-100' : 'bg-emerald-100'}`}>
                         <span className="text-[5px] font-black uppercase tracking-widest opacity-60">RND</span>
                    </div>
                    <div className={`flex-1 flex items-center justify-center ${isClone ? 'bg-fuchsia-50' : 'bg-emerald-50'}`}>
                         <span className="text-[5px] font-black uppercase tracking-widest opacity-60">NXT</span>
                    </div>
                </div>
            </div>
            {/* Top port for RND */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-200 border-x border-b border-slate-300 rounded-b opacity-50 flex items-center justify-center -translate-y-1"></div>
        </div>
    );
};

// --- Main Application ---

export default function CloneLinkedListRandomPointerViz() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('inPlaceClone');
  
  // Format: val:random_index
  const [inputList, setInputList] = useState('7:null, 13:0, 11:4, 10:2, 1:0');
  const [baseList, setBaseList] = useState([]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 100, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef(null);
  const selectedOp = OPERATIONS[selectedOpId];

  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 100, y: 150 }); 
    setZoom(0.85); 
  };

  const handleNext = () => { 
    if (currentStep < trace.length - 1) setCurrentStep(prev => prev + 1); 
  };
  
  const handlePrev = () => { 
    if (currentStep > 0) setCurrentStep(prev => prev - 1); 
  };

  const toggleFullscreen = () => setIsFullscreen(prev => !prev);
  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));

  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e) => { 
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handlePointerUp = () => setIsDragging(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedOp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parseList = (inputStr) => {
      const parts = inputStr.split(',').map(s => s.trim()).filter(Boolean);
      let nodes = [];
      for (let i = 0; i < parts.length; i++) {
          const [vStr, rStr] = parts[i].split(':');
          const v = parseInt(vStr);
          let r = null;
          if (rStr && rStr.toLowerCase() !== 'null') {
              r = parseInt(rStr);
          }
          nodes.push({
              id: i,
              val: isNaN(v) ? 0 : v,
              addr: '0x' + (100 + (i * 16)).toString(16).toUpperCase().padStart(3, '0'),
              nextId: i < parts.length - 1 ? i + 1 : null,
              randomIdTargetIdx: r, // Temp store index
              randomId: null, // Resolved later
              x: 60 + (i * 160),
              y: 100,
              type: 'original'
          });
      }
      
      // Resolve random indices to actual IDs
      for(let n of nodes) {
          if (n.randomIdTargetIdx !== null && n.randomIdTargetIdx >= 0 && n.randomIdTargetIdx < nodes.length) {
              n.randomId = nodes[n.randomIdTargetIdx].id;
          }
      }
      return nodes;
  };

  useEffect(() => {
    setBaseList(parseList(inputList));
    setCurrentStep(0);
    setPan({ x: 100, y: 150 });
  }, [inputList, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e) => {
        if (!canvasContainerRef.current?.contains(e.target)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const trace = useMemo(() => {
    const steps = [];
    if (baseList.length === 0) return [{ phase: 'Init', description: 'Enter list values.', state: { list: [] } }];
    
    let list = baseList.map(n => ({...n}));
    let headId = list[0].id;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            list: list.map(n=>({...n})),
            ...st 
        } 
    });

    if (selectedOpId === 'inPlaceClone') {
        let curr = headId;
        let cloneIdCounter = 100;

        add("Initialize", "Start Phase 1: Interweaving clone nodes.", 4, { curr });

        // Phase 1: Insert Clones
        while (curr !== null) {
            let currNode = list.find(n => n.id === curr);
            let nextId = currNode.nextId;
            
            add("Read Original", `Evaluating Original Node(${currNode.val}).`, 6, { curr });
            
            let cloneId = cloneIdCounter++;
            let cloneNode = {
                id: cloneId,
                val: currNode.val,
                addr: '0xC' + (cloneId * 16).toString(16).toUpperCase().padStart(3, '0'),
                nextId: nextId,
                randomId: null,
                x: currNode.x + 80, // Temporarily place right next to it
                y: currNode.y + 60, // Slightly below to signify instantiation
                type: 'clone',
                originalId: currNode.id // Link back to original
            };
            list.push(cloneNode);
            
            add("Instantiate Clone", `Created Clone Node(${cloneNode.val}').`, 7, { curr, clone: cloneId });

            currNode.nextId = cloneId;
            
            // Adjust X layout to make space for interweaving
            list.forEach(n => {
                if (n.id !== cloneId && n.id !== currNode.id && n.x > currNode.x) {
                    n.x += 160;
                }
            });
            cloneNode.x = currNode.x + 160;
            cloneNode.y = currNode.y;

            add("Interweave Next", `Linked Original -> Clone -> Next Original.`, 9, { curr, clone: cloneId });

            curr = nextId;
            add("Advance Pointer", `curr = clone.next; Moving to next original node.`, 10, { curr });
        }

        // Phase 2: Set Random Pointers
        curr = headId;
        add("Phase 2 Init", "Start Phase 2: Setting random pointers for clones.", 14, { curr });

        while (curr !== null) {
            let currNode = list.find(n => n.id === curr);
            let cloneNode = list.find(n => n.id === currNode.nextId);
            
            add("Evaluate Random", `Checking random pointer of Original Node(${currNode.val}).`, 16, { curr });

            if (currNode.randomId !== null) {
                let origRandom = list.find(n => n.id === currNode.randomId);
                let cloneRandom = list.find(n => n.id === origRandom.nextId); // Clone is always next to original
                
                cloneNode.randomId = cloneRandom.id;
                add("Set Clone Random", `curr.next.random = curr.random.next; Clone now points to Clone(${cloneRandom.val}').`, 17, { curr });
            } else {
                add("Null Random", "Original random is null. Clone random remains null.", 16, { curr });
            }

            curr = cloneNode.nextId;
        }

        // Phase 3: Detach
        curr = headId;
        let cloneHeadId = list.find(n => n.id === headId).nextId;
        add("Phase 3 Init", "Start Phase 3: Detaching the two interwoven lists.", 23, { curr, cloneHead: cloneHeadId });

        while (curr !== null) {
            let currNode = list.find(n => n.id === curr);
            let cloneNode = list.find(n => n.id === currNode.nextId);
            
            let nextOrig = cloneNode.nextId;
            
            add("Identify Nodes", `Ready to detach Clone(${cloneNode.val}') from Original(${currNode.val}).`, 26, { curr, clone: cloneNode.id });

            currNode.nextId = nextOrig; // Restore original list
            if (nextOrig !== null) {
                let nextClone = list.find(n => n.id === nextOrig).nextId;
                cloneNode.nextId = nextClone;
            } else {
                cloneNode.nextId = null;
            }

            // Visual separation: Move original back up, clone down
            currNode.y = 80;
            cloneNode.y = 260;
            
            // Compress X coordinates back
            let cxOrig = 60;
            let cOrig = headId;
            while(cOrig !== null) {
                let n = list.find(x => x.id === cOrig);
                n.x = cxOrig;
                cxOrig += 160;
                cOrig = n.nextId;
            }

            let cxClone = 60;
            let cClone = cloneHeadId;
            while(cClone !== null) {
                let n = list.find(x => x.id === cClone);
                n.x = cxClone;
                cxClone += 160;
                cClone = n.nextId;
            }

            add("Detach Sub-chain", "Original and Clone lists decoupled for this segment.", 29, { curr });
            curr = nextOrig;
        }

        add("Complete", "O(1) space cloning successfully concluded.", 34, { isSuccess: true });

    } else if (selectedOpId === 'hashIterative') {
        let curr = headId;
        let cloneIdCounter = 100;
        let hashMap = new Map(); // id -> cloneId
        
        add("Initialize", "Created HashMap to track Original -> Clone mappings.", 4, { curr });

        // Pass 1
        while (curr !== null) {
            let currNode = list.find(n => n.id === curr);
            add("Read Original", `Traversing Node(${currNode.val}).`, 8, { curr });

            let cloneId = cloneIdCounter++;
            let cloneNode = {
                id: cloneId,
                val: currNode.val,
                addr: '0xC' + (cloneId * 16).toString(16).toUpperCase().padStart(3, '0'),
                nextId: null,
                randomId: null,
                x: currNode.x,
                y: 260, // Place directly below in hash view
                type: 'clone'
            };
            list.push(cloneNode);
            hashMap.set(curr, cloneId);

            add("Create & Map", `map.put(curr, new Node(${cloneNode.val}));`, 9, { curr, clone: cloneId, mappedPairs: Array.from(hashMap.entries()) });
            
            curr = currNode.nextId;
        }

        add("Pass 1 Complete", "All clones instantiated and mapped. Starting Pass 2.", 13, { curr: headId });
        curr = headId;

        // Pass 2
        while (curr !== null) {
            let currNode = list.find(n => n.id === curr);
            let cloneId = hashMap.get(curr);
            let cloneNode = list.find(n => n.id === cloneId);

            add("Retrieve Clone", `clone = map.get(Node(${currNode.val}))`, 15, { curr, clone: cloneId });

            let nextCloneId = currNode.nextId ? hashMap.get(currNode.nextId) : null;
            cloneNode.nextId = nextCloneId;
            add("Wire Next", `clone.next = map.get(curr.next);`, 16, { curr, clone: cloneId });

            let randomCloneId = currNode.randomId ? hashMap.get(currNode.randomId) : null;
            cloneNode.randomId = randomCloneId;
            add("Wire Random", `clone.random = map.get(curr.random);`, 17, { curr, clone: cloneId });

            curr = currNode.nextId;
        }

        add("Complete", "Hashmap approach cloning successfully concluded.", 21, { isSuccess: true });
    } else if (selectedOpId === 'hashRecursive') {
        let hashMap = new Map();
        let cloneIdCounter = 100;
        let callStack = [];

        const recurse = (currId, depth) => {
            callStack.push({ curr: currId, depth });
            let currNode = list.find(n => n.id === currId);
            
            add("Recursive Call", `copyRandomListRec(Node(${currNode?.val ?? 'null'})) entered.`, 3, { currId, callStack: [...callStack] });

            if (currId === null) {
                add("Base Case", "Node is null, returning null up stack.", 4, { currId, callStack: [...callStack] });
                callStack.pop();
                return null;
            }

            add("Check Map", `Checking if Node(${currNode.val}) already exists in cache.`, 7, { currId, callStack: [...callStack] });
            if (hashMap.has(currId)) {
                let existingCloneId = hashMap.get(currId);
                add("Cache Hit", `Found Clone(${list.find(n=>n.id===existingCloneId).val}'). Returning cached reference to prevent cycles.`, 8, { currId, clone: existingCloneId, callStack: [...callStack] });
                callStack.pop();
                return existingCloneId;
            }

            let cloneId = cloneIdCounter++;
            let cloneNode = {
                id: cloneId,
                val: currNode.val,
                addr: '0xC' + (cloneId * 16).toString(16).toUpperCase().padStart(3, '0'),
                nextId: null,
                randomId: null,
                x: currNode.x,
                y: 260,
                type: 'clone'
            };
            list.push(cloneNode);
            hashMap.set(currId, cloneId);

            add("Create & Cache", `New clone created and cached. map.put(curr, clone);`, 13, { currId, clone: cloneId, callStack: [...callStack] });

            add("Recurse Next", `Pausing Node(${currNode.val}) to resolve 'next' pointer.`, 16, { currId, clone: cloneId, callStack: [...callStack] });
            let nextCloneId = recurse(currNode.nextId, depth + 1);
            list.find(n=>n.id===cloneId).nextId = nextCloneId;

            add("Recurse Random", `Resuming Node(${currNode.val}). Now resolving 'random' pointer.`, 17, { currId, clone: cloneId, callStack: [...callStack] });
            let randomCloneId = recurse(currNode.randomId, depth + 1);
            list.find(n=>n.id===cloneId).randomId = randomCloneId;

            add("Resolve Node", `Node(${currNode.val})'s clone fully built. Returning up stack.`, 19, { currId, clone: cloneId, callStack: [...callStack] });
            callStack.pop();
            return cloneId;
        };

        recurse(headId, 1);
        add("Complete", "Recursive cloning fully unwound and completed.", 19, { isSuccess: true, callStack: [] });
    }

    return steps;
  }, [baseList, selectedOpId]);

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { list: [] } };
  const st = curStepData.state || { list: [] };
  const isLastStep = currentStep === trace.length - 1;

  const renderSvgArrows = () => {
    const arrows = [];
    (st.list || []).forEach((node) => {
        // Draw Next Pointer
        if (node.nextId !== null && node.nextId !== undefined) {
            const target = st.list.find((n) => n.id === node.nextId);
            if (target) {
                const startX = node.x + 92; 
                const startY = node.y + 28;
                const endX = target.x - 6; 
                const endY = target.y + 28;
                
                let strokeColor = node.type === 'clone' ? '#c084fc' : '#cbd5e1'; // fuchsia-400 or slate-300
                const pathD = `M ${startX},${startY} L ${endX},${endY}`;
                arrows.push(<path key={`next-${String(node.addr)}`} d={pathD} fill="none" stroke={strokeColor} strokeWidth={2} markerEnd="url(#arrowhead-next)" className="transition-all duration-500" />);
            }
        }

        // Draw Random Pointer
        if (node.randomId !== null && node.randomId !== undefined) {
            const target = st.list.find((n) => n.id === node.randomId);
            if (target) {
                const startX = node.x + 48; // Top middle of node
                const startY = node.y - 6;
                const endX = target.x + 48; 
                const endY = target.y - 6;
                
                let strokeColor = node.type === 'clone' ? '#f472b6' : '#38bdf8'; // pink-400 or sky-400
                
                // Arc calculations based on distance
                const dist = Math.abs(endX - startX);
                const heightFactor = Math.min(dist / 2, 80);
                
                let pathD = '';
                if (startX === endX) {
                    // Points to itself
                    pathD = `M ${startX},${startY} C ${startX-30},${startY-40} ${endX+30},${endY-40} ${endX},${endY}`;
                } else if (endX > startX) {
                    // Arc right
                    pathD = `M ${startX},${startY} Q ${(startX+endX)/2},${startY - heightFactor} ${endX},${endY}`;
                } else {
                    // Arc left (higher to avoid overlapping forward arcs)
                    pathD = `M ${startX},${startY} Q ${(startX+endX)/2},${startY - heightFactor - 30} ${endX},${endY}`;
                }

                arrows.push(<path key={`random-${String(node.addr)}`} d={pathD} fill="none" stroke={strokeColor} strokeWidth={2} strokeDasharray="4,4" markerEnd="url(#arrowhead-random)" className="transition-all duration-500" opacity={0.7} />);
            }
        }
    });
    return arrows;
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-fuchsia-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <Replace className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Clone Random List</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-fuchsia-600 bg-fuchsia-50 px-2 py-0.5 rounded">
                      Graph Deep Copy
                  </span>
                  <span>•</span>
                  <span>O(1) Space Masterclass</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Database size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-fuchsia-600 font-black text-2xl uppercase tracking-tighter"><Replace size={28}/> The Deep Copy Graph</div>
                    <p className="text-lg leading-relaxed max-w-3xl">
                      A linked list is given such that each node contains an additional <code>random</code> pointer, which could point to any node in the list, or null. Construct a <strong>deep copy</strong> of the list. The cloned nodes must be entirely new instances in memory.
                    </p>
                    <div className="bg-slate-900 border-l-4 border-fuchsia-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-nowrap">
                       <span className="text-fuchsia-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Format: value:random_index</span>
                       Input: 7:null, 13:0, 11:4, 10:2, 1:0
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> Goal</h4>
                        <p className="text-sm leading-relaxed">If we copy the `next` pointers first, we don't know where the `random` pointers should point in the new list, because those cloned nodes might not exist yet, or we don't know their memory addresses.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><LayersIcon size={16} className="text-indigo-500"/> Challenge</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Using a HashMap mapping <code>OriginalNode -{'>'} CloneNode</code> solves this instantly in O(N) space. The real challenge is doing it in <strong>O(1) auxiliary space</strong>.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-fuchsia-600 text-white border-fuchsia-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-fuchsia-100' : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[400px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> CloneRandom.java</span>
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
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-fuchsia-600 pl-1">Input (val:random_idx)</label>
                            <input type="text" value={inputList} onChange={(e) => setInputList(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all shadow-inner" />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-8 py-3 bg-fuchsia-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-fuchsia-200 hover:bg-fuchsia-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-sky-900 border-sky-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Memory Analysis</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-sky-400 flex items-center gap-3"><PartyPopper size={24}/> SUCCESS</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold italic tracking-tight">Deep copy successfully generated.</p>
                         </div>
                    ) : (
                        <>
                            <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-none truncate">{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[400px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Network size={14} className="text-fuchsia-500"/> Object Heap Arena</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-fuchsia-600 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-fuchsia-600 rounded-lg transition-colors"><ZoomOut size={18}/></button>
                            <button onClick={toggleFullscreen} className="p-2 text-slate-600 hover:text-fuchsia-600 rounded-lg transition-colors"><Maximize size={18}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0 pointer-events-none">
                               <defs>
                                  <marker id="arrowhead-next" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker>
                                  <marker id="arrowhead-random" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" /></marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>

                           {/* Render Hashmap UI for Hash approaches */}
                           {['hashIterative', 'hashRecursive'].includes(selectedOpId) && st.mappedPairs && (
                               <div className="absolute left-[60px] top-[400px] bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm min-w-[200px]">
                                   <div className="text-[10px] font-black uppercase text-amber-700 tracking-widest mb-2 flex items-center gap-2"><Database size={14}/> Node Map</div>
                                   <div className="flex gap-2">
                                       {st.mappedPairs.map(([origId, cloneId]) => (
                                           <div key={origId} className="flex flex-col items-center bg-white p-1 rounded border border-amber-100 shadow-sm">
                                               <span className="text-[9px] font-mono text-slate-500">O:{origId}</span>
                                               <span className="text-[9px] font-mono text-fuchsia-600 font-bold">C:{cloneId}</span>
                                           </div>
                                       ))}
                                   </div>
                               </div>
                           )}

                           {(st.list || []).map((nodeObj) => {
                              const isCurr = st.curr === nodeObj.id || st.currId === nodeObj.id; 
                              const isCloneTarget = st.clone === nodeObj.id;
                              
                              let themeColor = nodeObj.type === 'clone' ? 'fuchsia' : 'slate';
                              if (isCurr && nodeObj.type === 'original') themeColor = 'indigo';
                              if (isCurr && nodeObj.type === 'clone') themeColor = 'sky'; // Edge case for recursive curr being a clone sometimes
                              
                              const isTarget = isCurr || isCloneTarget;

                              const lbls = [];
                              if (isCurr) lbls.push({ text: "curr", color: "indigo", pos: "bottom" });
                              if (isCloneTarget) lbls.push({ text: "clone", color: "fuchsia", pos: "top" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isTarget} themeColor={themeColor} nodeType={nodeObj.type}/>
                                  </div>
                              )
                           })}
                       </div>
                   </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-10">
                <div className="p-8 rounded-3xl bg-[#0f172a] text-white border border-slate-800 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Braces size={120}/></div>
                    <h3 className="font-black text-fuchsia-400 text-lg uppercase tracking-widest mb-6">The Interweaving Trick</h3>
                    <div className="space-y-6 text-sm text-slate-300 leading-relaxed max-w-2xl font-medium text-lg">
                        <p><strong>1. Copy Next to Origin:</strong> The hardest part of $O(1)$ space cloning is figuring out where the cloned random node lives relative to the original random node. If we inject <code>A'</code> directly after <code>A</code>, they are physically bonded.</p>
                        <p><strong>2. The Magic Lookup:</strong> If <code>A.random = C</code>, then we know <code>A'.random</code> must be <code>C'</code>. Because we interwoven them, <code>C'</code> is guaranteed to be exactly at <code>C.next</code>. Thus: <code>A.next.random = A.random.next</code>.</p>
                        <p><strong>3. Restoration:</strong> Once all pointers are mapped securely inside the weave, we perform a standard linked-list split to peel the clones out into their own list, restoring the original list in the process.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-fuchsia-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-fuchsia-500">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering the Clone</h3>
                    <p className="text-sm text-fuchsia-50 leading-relaxed italic max-w-2xl font-mono">"Start by explaining the HashMap approach to guarantee you have a working O(N) Space solution. The interviewer will almost certainly ask 'Can you do this without the map?'. This is your cue to execute the 3-pass interweaving method."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 text-slate-700">
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-indigo-600 border-b pb-2">Technical Checks</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Null Checks on Random:</strong> In Pass 2 of the interwoven approach, always check <code>if (curr.random != null)</code> before doing <code>curr.random.next</code> to avoid a NullPointerException!</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Restore Original:</strong> In Pass 3, you must cleanly reconstruct the <code>next</code> pointers of the original list. Leaving it interwoven or mangled is considered a failure.</div></li>
                        </ul>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[450px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110]">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className="bg-fuchsia-600 p-2 rounded-lg text-white shadow-lg shadow-fuchsia-900/50"><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                        ))}
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-sky-900/40 border-sky-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-tight">{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-fuchsia-600 rounded-xl hover:bg-fuchsia-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-fuchsia-600 rounded-xl hover:bg-fuchsia-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className="p-3 text-slate-600 hover:text-fuchsia-600 rounded-xl hover:bg-fuchsia-50 transition-all"><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex gap-6 animate-in slide-in-from-bottom-10">
                          <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                          <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className="px-12 py-6 bg-fuchsia-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(217,70,239,0.3)] hover:bg-fuchsia-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-fuchsia-500 shadow-fuchsia-900/20">NEXT <ChevronRight size={32}/></button>
                      </div>
                  )}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-500" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0 pointer-events-none">
                               <defs>
                                   <marker id="arrowhead-next-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker>
                                   <marker id="arrowhead-random-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" /></marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>
                           
                           {/* Call Stack UI for Recursive */}
                           {selectedOpId === 'hashRecursive' && st.callStack && st.callStack.length > 0 && (
                               <div className="absolute left-10 top-10 bg-white/90 border border-slate-200 rounded-xl p-4 shadow-xl z-50 backdrop-blur-md w-48">
                                   <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest mb-3 font-mono flex items-center gap-2 border-b pb-2"><Layers size={14}/> Call Stack</span>
                                   <div className="flex flex-col-reverse gap-1.5 text-[10px] font-mono text-slate-500">
                                       {st.callStack.map((frame, i) => {
                                           const frNode = (st.list || []).find(n=>n.id===frame.currId);
                                           return (
                                               <div key={i} className={`px-2 py-1.5 rounded ${i === st.callStack.length - 1 ? 'bg-indigo-100 text-indigo-700 font-bold shadow-sm border border-indigo-200' : 'bg-slate-50 border border-slate-100'}`}>
                                                   recurse({frNode ? frNode.val : 'null'})
                                               </div>
                                           );
                                       })}
                                   </div>
                               </div>
                           )}

                           {(st.list || []).map((nodeObj) => {
                              const isCurr = st.curr === nodeObj.id || st.currId === nodeObj.id; 
                              const isCloneTarget = st.clone === nodeObj.id;
                              
                              let themeColor = nodeObj.type === 'clone' ? 'fuchsia' : 'slate';
                              if (isCurr && nodeObj.type === 'original') themeColor = 'indigo';
                              if (isCurr && nodeObj.type === 'clone') themeColor = 'sky';
                              
                              const isTarget = isCurr || isCloneTarget;

                              const lbls = [];
                              if (isCurr) lbls.push({ text: "curr", color: "indigo", pos: "bottom" });
                              if (isCloneTarget) lbls.push({ text: "clone", color: "fuchsia", pos: "top" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isTarget} themeColor={themeColor} nodeType={nodeObj.type}/>
                                  </div>
                              )
                           })}
                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className="bg-[#0f172a] border-4 border-sky-500 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(14,165,233,0.3)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-sky-500"></div>
                                <div className="w-24 h-24 bg-sky-500/20 text-sky-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-sky-500/10"><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">DEEP COPY COMPLETE</h2>
                                <p className="text-sky-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">All next and random pointers resolved</p>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className="flex-1 py-6 bg-sky-600 hover:bg-sky-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg shadow-sky-900/20">
                                        <RotateCcw size={24}/> RESTART VIZ
                                    </button>
                                    <button onClick={toggleFullscreen} className="py-6 px-10 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all border border-slate-700 shadow-xl shadow-black/20">
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
}