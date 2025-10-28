import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp,
  ChevronLeft, ChevronRight, Network, Database, RotateCcw, 
  ListOrdered, RefreshCw, Zap, Goal, Info, Layers, 
  ZoomIn, ZoomOut, Maximize, Hash, Trash2, Search,
  Scissors, ShieldAlert, Cpu, Lightbulb, PlayCircle,
  MonitorPlay, PartyPopper, CheckCircle2, XCircle, X,
  Filter, Terminal, Braces, Layout, Minimize, Repeat,
  GitCommit, Split, GitMerge, Share2, MousePointer2, 
  Binary, Layers as LayersIcon, MoveHorizontal, AlertCircle,
  PlusSquare, FunctionSquare
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  iterativeTwoPointer: {
    id: 'iterativeTwoPointer',
    title: 'Two-Pointer Merge (Optimal)',
    icon: <Share2 size={16} />,
    complexity: 'Time: O(N+M) | Space: O(N+M)',
    code: `public Node addPolynomials(Node p1, Node p2) {
    Node dummy = new Node(0, 0);
    Node curr = dummy;

    // Traverse while both have terms left
    while (p1 != null && p2 != null) {
        if (p1.pow > p2.pow) {
            curr.next = new Node(p1.coeff, p1.pow);
            p1 = p1.next;
        } else if (p1.pow < p2.pow) {
            curr.next = new Node(p2.coeff, p2.pow);
            p2 = p2.next;
        } else {
            // Powers are equal, sum the coefficients
            int sum = p1.coeff + p2.coeff;
            if (sum != 0) { // Only add non-zero terms
                curr.next = new Node(sum, p1.pow);
                curr = curr.next;
            }
            p1 = p1.next;
            p2 = p2.next;
            continue; 
        }
        curr = curr.next;
    }

    // Append remaining terms from p1 or p2
    while (p1 != null) { 
        curr.next = new Node(p1.coeff, p1.pow); 
        p1 = p1.next; curr = curr.next; 
    }
    while (p2 != null) { 
        curr.next = new Node(p2.coeff, p2.pow); 
        p2 = p2.next; curr = curr.next; 
    }

    return dummy.next;
}`,
    desc: "The standard merge-sort-like approach. Because the polynomials are already sorted by power in decreasing order, we can simultaneously traverse both lists. If powers match, we add coefficients. Otherwise, we take the term with the higher power."
  },
  mapHashing: {
    id: 'mapHashing',
    title: 'TreeMap Aggregation',
    icon: <Database size={16} />,
    complexity: 'Time: O((N+M)log(N+M)) | Space: O(N+M)',
    code: `public Node addPolynomialsMap(Node p1, Node p2) {
    // TreeMap automatically sorts keys in descending order
    TreeMap<Integer, Integer> map = new TreeMap<>(Collections.reverseOrder());
    
    // 1. Add all terms from Polynomial 1
    while (p1 != null) {
        map.put(p1.pow, map.getOrDefault(p1.pow, 0) + p1.coeff);
        p1 = p1.next;
    }
    
    // 2. Add all terms from Polynomial 2
    while (p2 != null) {
        map.put(p2.pow, map.getOrDefault(p2.pow, 0) + p2.coeff);
        p2 = p2.next;
    }
    
    // 3. Reconstruct the resulting linked list
    Node dummy = new Node(0, 0);
    Node curr = dummy;
    for (Map.Entry<Integer, Integer> entry : map.entrySet()) {
        if (entry.getValue() != 0) {
            curr.next = new Node(entry.getValue(), entry.getKey());
            curr = curr.next;
        }
    }
    
    return dummy.next;
}`,
    desc: "A more brute-force map approach. We dump every term into a TreeMap (where power is the key, coefficient is the value). It handles out-of-order lists perfectly, but the tree rebalancing makes it slower (O(K log K)) than the two-pointer method."
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
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|void|return|if|else|while|continue|for|Node|null|addPolynomials|addPolynomialsMap|p1|p2|dummy|curr|next|coeff|pow|sum|TreeMap|Collections|reverseOrder|Integer|map|put|getOrDefault|Map|Entry|entrySet|getValue|getKey)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-indigo-500/20`, border: `border-indigo-500`, text: `text-indigo-400` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-indigo-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'void', 'return', 'if', 'else', 'while', 'for', 'continue', 'new'].includes(part);
            const isObject = ['Node', 'TreeMap', 'Collections', 'Integer', 'Map', 'Entry'].includes(part);
            const isConst = ['true', 'false', 'null'].includes(part);
            const isPointer = ['p1', 'p2', 'dummy', 'curr', 'next', 'map', 'entry'].includes(part);
            const isProperty = ['coeff', 'pow', 'sum', 'reverseOrder', 'put', 'getOrDefault', 'entrySet', 'getValue', 'getKey'].includes(part);
            return (
              <span 
                key={i} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-sky-400 font-bold' : 
                  isConst ? 'text-orange-400 font-bold' :
                  isPointer ? 'text-indigo-400' : 
                  isProperty ? 'text-fuchsia-300' :
                  isNaN(parseInt(part)) ? '' : 'text-emerald-400'
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
  position: 'top' | 'bottom';
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
  coeff: number;
  power: number;
  address: string;
  themeColor?: string;
  isTarget?: boolean;
  isDummy?: boolean;
}

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ coeff, power, address, themeColor = 'slate', isTarget, isDummy }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', sup: 'text-emerald-600' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', sup: 'text-rose-600' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800', sup: 'text-indigo-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', sup: 'text-amber-600' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', sup: 'text-fuchsia-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', sup: 'text-slate-500' }
    };
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-indigo-300 shadow-xl z-20 scale-105` : `shadow-sm z-10`;

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <span className="text-[10px] text-slate-400 font-mono font-bold mb-1 opacity-80 tracking-tight">{isDummy ? 'Sentinel' : String(address)}</span>
            <div className={`flex items-center w-32 h-14 border-2 rounded-2xl transition-all duration-300 ${isDummy ? 'bg-slate-800 border-slate-600' : activeTheme.bg} ${isDummy ? '' : activeTheme.border} ${targetClasses} relative shadow-sm`}>
                <div className={`flex-1 flex justify-center font-mono font-black text-xl tracking-tighter ${isDummy ? 'text-slate-500' : activeTheme.text}`}>
                    {isDummy ? 'D' : (
                        <div className="flex items-center">
                            <span>{String(coeff)}</span>
                            {power !== 0 && (
                                <span className={`text-sm ml-0.5 ${activeTheme.sup}`}>
                                    x<sup className="text-[10px] font-bold">{String(power)}</sup>
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <div className={`w-8 h-full border-l-2 flex flex-col items-center justify-center rounded-r-xl ${isDummy ? 'border-slate-600 bg-slate-700' : 'border-slate-200 bg-slate-50'}`}>
                    <span className={`text-[6px] font-black uppercase tracking-widest opacity-60 transform -rotate-90`}>NXT</span>
                </div>
            </div>
        </div>
    );
};

// --- Main Application ---

export default function AddPolynomialsLLViz() {
  // 1. State Hooks
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('iterativeTwoPointer');
  
  // Format: coeff:pow, coeff:pow
  const [inputP1, setInputP1] = useState('5:2, 4:1, 2:0');
  const [inputP2, setInputP2] = useState('-5:1, -2:0');
  
  const [baseP1, setBaseP1] = useState([]);
  const [baseP2, setBaseP2] = useState([]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  // 2. Refs
  const canvasContainerRef = useRef(null);
  const selectedOp = OPERATIONS[selectedOpId];

  // 3. Early Interaction Handlers
  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 50, y: 50 }); 
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

  // 4. Initialization Logic
  const parsePolynomial = (inputStr, idOffset, rowY) => {
      const parts = inputStr.split(',').map(s => s.trim()).filter(Boolean);
      let nodes = [];
      for (let i = 0; i < parts.length; i++) {
          const cp = parts[i].split(':');
          const c = parseInt(cp[0] || '0');
          const p = parseInt(cp[1] || '0');
          if (!isNaN(c) && !isNaN(p)) {
              nodes.push({
                  id: idOffset + i,
                  coeff: c,
                  pow: p,
                  addr: '0x' + (100 + ((idOffset+i) * 16)).toString(16).toUpperCase().padStart(3, '0'),
                  nextId: i < parts.length - 1 ? idOffset + i + 1 : null,
                  x: 60 + (i * 180),
                  y: rowY,
                  listId: idOffset === 0 ? 'P1' : 'P2'
              });
          }
      }
      // Ensure sorted by power descending
      nodes.sort((a,b) => b.pow - a.pow);
      // Re-fix nextIds and X positions after sort
      for(let i=0; i<nodes.length; i++){
          nodes[i].nextId = i < nodes.length - 1 ? nodes[i+1].id : null;
          nodes[i].x = 60 + (i * 180);
      }
      return nodes;
  };

  useEffect(() => {
    setBaseP1(parsePolynomial(inputP1, 0, 100)); // P1 Row Y=100
    setBaseP2(parsePolynomial(inputP2, 20, 250)); // P2 Row Y=250
    setCurrentStep(0);
    setPan({ x: 50, y: 50 });
  }, [inputP1, inputP2]);

  // 5. Trackpad Zoom
  useEffect(() => {
    const handleWheel = (e) => {
        if (!canvasContainerRef.current?.contains(e.target)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // 6. Trace Memoization (The Execution Engine)
  const trace = useMemo(() => {
    const steps = [];
    if (baseP1.length === 0 && baseP2.length === 0) return [{ phase: 'Init', description: 'Enter polynomial values.', state: { p1: [], p2: [], res: [] } }];
    
    // Deep clone base states
    let p1Nodes = baseP1.map(n => ({...n}));
    let p2Nodes = baseP2.map(n => ({...n}));
    let resNodes = [];
    
    const dummy = { id: 100, coeff: 0, pow: 0, addr: 'RESULT_SENTINEL', nextId: null, x: 60, y: 400, isDummy: true, listId: 'RES' };
    resNodes.push(dummy);

    let curr1 = p1Nodes.length > 0 ? p1Nodes[0].id : null;
    let curr2 = p2Nodes.length > 0 ? p2Nodes[0].id : null;
    let resTail = dummy.id;
    let newIdCounter = 101;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            p1List: p1Nodes.map(n=>({...n})), 
            p2List: p2Nodes.map(n=>({...n})), 
            resList: resNodes.map(n=>({...n})),
            ...st 
        } 
    });

    if (selectedOpId === 'iterativeTwoPointer') {
        add("Initialize", "Create dummy node for Result list. Pointers p1 and p2 at heads.", 2, { curr1, curr2, resTail });

        while (curr1 !== null && curr2 !== null) {
            const n1 = p1Nodes.find(n => n.id === curr1);
            const n2 = p2Nodes.find(n => n.id === curr2);
            
            add("Compare Powers", `Comparing p1 power (${n1.pow}) with p2 power (${n2.pow}).`, 6, { curr1, curr2, resTail, isComparing: true });

            if (n1.pow > n2.pow) {
                add("p1 > p2", `p1 power is higher. Copying ${n1.coeff}x^${n1.pow} to result.`, 7, { curr1, curr2, resTail, isComparing: true });
                const newNode = { id: newIdCounter++, coeff: n1.coeff, pow: n1.pow, addr: '0xNEW'+newIdCounter, nextId: null, x: resNodes.find(n=>n.id===resTail).x + 180, y: 400, listId: 'RES' };
                resNodes.find(n=>n.id===resTail).nextId = newNode.id;
                resNodes.push(newNode);
                resTail = newNode.id;
                
                curr1 = n1.nextId;
                add("Advance p1", "Moving p1 to its next term.", 9, { curr1, curr2, resTail });

            } else if (n1.pow < n2.pow) {
                add("p1 < p2", `p2 power is higher. Copying ${n2.coeff}x^${n2.pow} to result.`, 10, { curr1, curr2, resTail, isComparing: true });
                const newNode = { id: newIdCounter++, coeff: n2.coeff, pow: n2.pow, addr: '0xNEW'+newIdCounter, nextId: null, x: resNodes.find(n=>n.id===resTail).x + 180, y: 400, listId: 'RES' };
                resNodes.find(n=>n.id===resTail).nextId = newNode.id;
                resNodes.push(newNode);
                resTail = newNode.id;
                
                curr2 = n2.nextId;
                add("Advance p2", "Moving p2 to its next term.", 12, { curr1, curr2, resTail });

            } else {
                add("Equal Powers", `Powers match (${n1.pow}). Summing coefficients: ${n1.coeff} + ${n2.coeff} = ${n1.coeff + n2.coeff}`, 15, { curr1, curr2, resTail, isComparing: true });
                const sum = n1.coeff + n2.coeff;
                if (sum !== 0) {
                    const newNode = { id: newIdCounter++, coeff: sum, pow: n1.pow, addr: '0xNEW'+newIdCounter, nextId: null, x: resNodes.find(n=>n.id===resTail).x + 180, y: 400, listId: 'RES' };
                    resNodes.find(n=>n.id===resTail).nextId = newNode.id;
                    resNodes.push(newNode);
                    resTail = newNode.id;
                    add("Add Sum", `Non-zero sum added to result list.`, 17, { curr1, curr2, resTail });
                } else {
                    add("Zero Sum", `Sum is 0. Term cancels out completely. Not added to result.`, 16, { curr1, curr2, resTail });
                }
                
                curr1 = n1.nextId;
                curr2 = n2.nextId;
                add("Advance Both", "Moving both p1 and p2 forward.", 20, { curr1, curr2, resTail });
            }
        }

        add("Main Loop End", "One or both polynomials exhausted. Processing remainders.", 26, { curr1, curr2, resTail });

        while (curr1 !== null) {
            const n1 = p1Nodes.find(n => n.id === curr1);
            add("Remainder P1", `Appending remaining p1 term: ${n1.coeff}x^${n1.pow}`, 27, { curr1, curr2, resTail });
            const newNode = { id: newIdCounter++, coeff: n1.coeff, pow: n1.pow, addr: '0xNEW'+newIdCounter, nextId: null, x: resNodes.find(n=>n.id===resTail).x + 180, y: 400, listId: 'RES' };
            resNodes.find(n=>n.id===resTail).nextId = newNode.id;
            resNodes.push(newNode);
            resTail = newNode.id;
            curr1 = n1.nextId;
        }

        while (curr2 !== null) {
            const n2 = p2Nodes.find(n => n.id === curr2);
            add("Remainder P2", `Appending remaining p2 term: ${n2.coeff}x^${n2.pow}`, 31, { curr1, curr2, resTail });
            const newNode = { id: newIdCounter++, coeff: n2.coeff, pow: n2.pow, addr: '0xNEW'+newIdCounter, nextId: null, x: resNodes.find(n=>n.id===resTail).x + 180, y: 400, listId: 'RES' };
            resNodes.find(n=>n.id===resTail).nextId = newNode.id;
            resNodes.push(newNode);
            resTail = newNode.id;
            curr2 = n2.nextId;
        }

    } else if (selectedOpId === 'mapHashing') {
        let treeMap = new Map(); // Mocking tree map order by sorting later
        add("Initialize Map", "Creating a TreeMap to automatically sort powers descending.", 3, { curr1, curr2, resTail });
        
        while (curr1 !== null) {
            const n1 = p1Nodes.find(n => n.id === curr1);
            add("Hash P1", `Adding P1 term ${n1.coeff}x^${n1.pow} to Map.`, 7, { curr1, curr2, resTail });
            treeMap.set(n1.pow, (treeMap.get(n1.pow) || 0) + n1.coeff);
            curr1 = n1.nextId;
        }

        while (curr2 !== null) {
            const n2 = p2Nodes.find(n => n.id === curr2);
            add("Hash P2", `Adding P2 term ${n2.coeff}x^${n2.pow} to Map. (Sums if key exists)`, 13, { curr1, curr2, resTail });
            treeMap.set(n2.pow, (treeMap.get(n2.pow) || 0) + n2.coeff);
            curr2 = n2.nextId;
        }

        add("Map Built", "All terms processed into Map. Generating result list from Map entries.", 17, { curr1, curr2, resTail });
        
        // Sort keys descending
        const sortedKeys = Array.from(treeMap.keys()).sort((a,b)=>b-a);
        for(let key of sortedKeys) {
            const val = treeMap.get(key);
            add("Iterate Map", `Evaluating Map Entry: Power=${key}, Coeff=${val}`, 19, { curr1, curr2, resTail, mapKey: key, mapVal: val });
            if (val !== 0) {
                const newNode = { id: newIdCounter++, coeff: val, pow: key, addr: '0xNEW'+newIdCounter, nextId: null, x: resNodes.find(n=>n.id===resTail).x + 180, y: 400, listId: 'RES' };
                resNodes.find(n=>n.id===resTail).nextId = newNode.id;
                resNodes.push(newNode);
                resTail = newNode.id;
                add("Create Node", `Non-zero coeff. Appended to result list.`, 21, { curr1, curr2, resTail });
            }
        }
    }

    // Build Math String
    let finalMath = [];
    let start = resNodes.find(n=>n.isDummy)?.nextId;
    while(start) {
        const n = resNodes.find(it => it.id === start);
        if(n) {
            let sign = finalMath.length > 0 && n.coeff > 0 ? '+' : '';
            let term = `${sign}${n.coeff}`;
            if(n.pow > 0) term += `x^${n.pow}`;
            finalMath.push(term);
            start = n.nextId;
        } else break;
    }
    let fStr = finalMath.join(' ') || '0';

    add("Complete", "Polynomial Addition finished.", 36, { isSuccess: true, finalSeq: fStr });

    return steps;
  }, [baseP1, baseP2, selectedOpId]);

  // Fallbacks
  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { p1List: [], p2List: [], resList: [] } };
  const st = curStepData.state || { p1List: [], p2List: [], resList: [] };
  const isLastStep = currentStep === trace.length - 1;

  const renderSvgArrows = () => {
    const allNodes = [...(st.p1List || []), ...(st.p2List || []), ...(st.resList || [])];
    return allNodes.map((node) => {
        if (node.nextId === null || node.nextId === undefined) return null;
        const target = allNodes.find((n) => n.id === node.nextId);
        if (!target) return null;
        const startX = node.x + 104, startY = node.y + 28, endX = target.x - 6, endY = target.y + 28;
        const strokeColor = node.isDummy ? '#6366f1' : '#cbd5e1';
        const pathD = `M ${startX},${startY} C ${startX + 20},${startY} ${endX - 20},${endY} ${endX},${endY}`;
        return <path key={`link-${String(node.addr)}`} d={pathD} fill="none" stroke={strokeColor} strokeWidth={2} markerEnd="url(#arrowhead-default)" className="transition-all duration-500" />;
    });
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <FunctionSquare className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Add Polynomials</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Math Operations
                  </span>
                  <span>•</span>
                  <span>Two-Pointer Traversal</span>
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
                    <div className="flex items-center gap-3 text-emerald-600 font-black text-2xl uppercase tracking-tighter"><PlusSquare size={28}/> Term Addition</div>
                    <p className="text-lg leading-relaxed max-w-3xl">
                      You are given two polynomials represented as Linked Lists. Each node contains a coefficient and a power. They are sorted in descending order of power. The goal is to add them to form a new sorted polynomial list.
                    </p>
                    <div className="bg-slate-900 border-l-4 border-emerald-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white">
                       <span className="text-emerald-400 block mb-1 uppercase text-[10px] font-black tracking-widest">P1:</span>
                       5x^2 + 4x^1 + 2 <br/>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">P2:</span>
                       5x^1 - 5 <br/>
                       <span className="text-fuchsia-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Result:</span>
                       5x^2 + 9x^1 - 3
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> Core Logic</h4>
                        <p className="text-sm leading-relaxed">If powers match, add their coefficients. If a power is missing in one polynomial, simply carry the term from the other directly into the result.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><LayersIcon size={16} className="text-indigo-500"/> Complexity</h4>
                        <p className="text-sm leading-relaxed leading-relaxed text-sm">Because both lists are sorted by power, the Two-Pointer approach achieves optimal <strong>O(N+M)</strong> time. We only need one pass.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-emerald-600 text-white border-emerald-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-emerald-100' : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[400px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> PolyAdd.java</span>
                    <button onClick={() => { navigator.clipboard.writeText(selectedOp.code); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-emerald-600 pl-1">P1 (coeff:power)</label>
                            <input type="text" value={inputP1} onChange={(e) => setInputP1(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner" />
                        </div>
                        <div className="flex-1 space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-sky-600 pl-1">P2 (coeff:power)</label>
                            <input type="text" value={inputP2} onChange={(e) => setInputP2(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-inner" />
                        </div>
                    </div>
                    <div className="flex gap-2 shrink-0 justify-end">
                        <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={20}/></button>
                        <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={20}/></button>
                        <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-8 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-fuchsia-900 border-fuchsia-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Memory Analysis</span></div>
                        <span>Line {String(curStepData.line || 0)}</span>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-fuchsia-400 flex items-center gap-3"><PartyPopper size={24}/> SUCCESS</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold italic tracking-tight italic">Final Polynomial Generated.</p>
                         </div>
                    ) : (
                        <>
                            <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-none truncate">{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[520px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Network size={14} className="text-emerald-500"/> Multi-List Arena</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-emerald-600 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-emerald-600 rounded-lg transition-colors"><ZoomOut size={18}/></button>
                            <button onClick={toggleFullscreen} className="p-2 text-slate-600 hover:text-emerald-600 rounded-lg transition-colors"><Maximize size={18}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left pointer-events-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0"><defs><marker id="arrowhead-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker></defs>{renderSvgArrows()}</svg>
                           
                           {/* Render all nodes from all 3 lists */}
                           {[...(st.p1List||[]), ...(st.p2List||[]), ...(st.resList||[])].map((nodeObj) => {
                              const isP1 = st.curr1 === nodeObj.id; 
                              const isP2 = st.curr2 === nodeObj.id;
                              
                              let themeColor = 'slate';
                              if (nodeObj.listId === 'P1') themeColor = 'emerald';
                              if (nodeObj.listId === 'P2') themeColor = 'sky';
                              if (nodeObj.listId === 'RES') themeColor = 'fuchsia';

                              const lbls = [];
                              if (isP1) lbls.push({ text: "p1", color: "emerald", pos: "top" });
                              if (isP2) lbls.push({ text: "p2", color: "sky", pos: "top" });
                              if (st.resTail === nodeObj.id) lbls.push({ text: "tail", color: "fuchsia", pos: "bottom" });

                              return (
                                  <div key={nodeObj.addr} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      {/* List ID Watermark */}
                                      {nodeObj.x === 60 && <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-xs font-black opacity-30 tracking-widest">{nodeObj.listId}</div>}
                                      
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">
                                        {lbls.filter(l => l.pos === 'top').map((l, i) => (
                                          <PointerLabel key={`top-${i}`} label={l.text} color={l.color} position={l.pos as 'top' | 'bottom'} />
                                        ))}
                                      </div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                        {lbls.filter(l => l.pos === 'bottom').map((l, i) => (
                                          <PointerLabel key={`bottom-${i}`} label={l.text} color={l.color} position={l.pos as 'top' | 'bottom'} />
                                        ))}
                                      </div>
                                      
                                      <ListNodeBlock coeff={nodeObj.coeff} power={nodeObj.pow} address={nodeObj.addr} isTarget={st.isComparing && (isP1||isP2)} themeColor={themeColor} isDummy={nodeObj.isDummy}/>
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
                    <h3 className="font-black text-emerald-400 text-lg uppercase tracking-widest mb-6">Algorithm Breakdown</h3>
                    <div className="space-y-6 text-sm text-slate-300 leading-relaxed max-w-2xl font-medium text-lg">
                        <p><strong>1. Dual Navigation:</strong> Since the polynomials are sorted by power descending, we can compare the <code>power</code> field of <code>p1</code> and <code>p2</code> like a standard merge-sort merge step.</p>
                        <p><strong>2. Conditional Merging:</strong> 
                           <br/>- If <code>p1.pow &gt; p2.pow</code>, we take <code>p1</code>'s term.
                           <br/>- If <code>p1.pow &lt; p2.pow</code>, we take <code>p2</code>'s term.
                           <br/>- If they are equal, we sum their coefficients. If the sum cancels to 0, we can safely ignore it.
                        </p>
                        <p><strong>3. Trailing Terms:</strong> When one list reaches <code>null</code> early, we simply iterate through the remaining nodes of the other list and append them to our result.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-emerald-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-emerald-500">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Zero-Sum Cancellation</h3>
                    <p className="text-sm text-emerald-50 leading-relaxed italic max-w-2xl font-mono">"A common edge case interviewers test is whether you add a node when $5x^2$ is added to $-5x^2$. A robust solution checks if <code>sum != 0</code> before appending to the result list."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 text-slate-700">
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-indigo-600 border-b pb-2">Technical Checks</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>New Nodes:</strong> Typically, you create <code>new Node()</code> for the result to avoid destroying the original polynomial objects.</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Sorting assumption:</strong> Always confirm with the interviewer if the lists are strictly ordered descending. If not, the TreeMap approach is required.</div></li>
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
                          <div className="bg-emerald-600 p-2 rounded-lg text-white shadow-lg shadow-emerald-900/50"><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                        ))}
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-fuchsia-900 border-fuchsia-800' : 'bg-slate-800 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <span>Line {String(curStepData.line || 0)}</span>
                        </div>
                        <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-tight">{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className="p-3 text-slate-600 hover:text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all"><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex gap-6 animate-in slide-in-from-bottom-10">
                          <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                          <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className="px-12 py-6 bg-emerald-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-emerald-500 shadow-emerald-900/20">NEXT <ChevronRight size={32}/></button>
                      </div>
                  )}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-75" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0"><defs><marker id="arrowhead-default-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker></defs>{renderSvgArrows()}</svg>
                           {[...(st.p1List||[]), ...(st.p2List||[]), ...(st.resList||[])].map((nodeObj) => {
                              const isP1 = st.curr1 === nodeObj.id; 
                              const isP2 = st.curr2 === nodeObj.id;
                              let blockTheme = 'slate';
                              if (nodeObj.listId === 'P1') blockTheme = 'emerald';
                              if (nodeObj.listId === 'P2') blockTheme = 'sky';
                              if (nodeObj.listId === 'RES') blockTheme = 'fuchsia';

                              const lbls = [];
                              if (isP1) lbls.push({ text: "p1", color: "emerald", pos: "top" });
                              if (isP2) lbls.push({ text: "p2", color: "sky", pos: "top" });
                              if (st.resTail === nodeObj.id) lbls.push({ text: "tail", color: "fuchsia", pos: "bottom" });

                              return (
                                  <div key={nodeObj.addr} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      {nodeObj.x === 60 && <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-xs font-black opacity-30 tracking-widest text-slate-800">{nodeObj.listId}</div>}
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">
                                        {lbls.filter(l => l.pos === 'top').map((l, i) => (
                                          <PointerLabel key={`fs-top-${i}`} label={l.text} color={l.color} position={l.pos as 'top' | 'bottom'} />
                                        ))}
                                      </div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                        {lbls.filter(l => l.pos === 'bottom').map((l, i) => (
                                          <PointerLabel key={`fs-bottom-${i}`} label={l.text} color={l.color} position={l.pos as 'top' | 'bottom'} />
                                        ))}
                                      </div>
                                      <ListNodeBlock coeff={nodeObj.coeff} power={nodeObj.pow} address={nodeObj.addr} isTarget={st.isComparing && (isP1||isP2)} themeColor={blockTheme} isDummy={nodeObj.isDummy}/>
                                  </div>
                              )
                           })}
                      </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className="bg-[#0f172a] border-4 border-fuchsia-500 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(217,70,239,0.3)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-fuchsia-500"></div>
                                <div className="w-24 h-24 bg-fuchsia-500/20 text-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-fuchsia-500/10"><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-white text-center">ADDITION COMPLETE</h2>
                                <p className="text-fuchsia-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Math string generation resolved</p>
                                <div className="bg-slate-800/80 rounded-[2rem] p-8 border border-slate-700 font-mono text-fuchsia-400 text-2xl font-bold break-all mb-10 shadow-2xl ring-1 ring-white/10 tracking-tighter text-center">
                                    {String(trace[trace.length - 1].state.finalSeq)}
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className="flex-1 py-6 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg shadow-fuchsia-900/20">
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