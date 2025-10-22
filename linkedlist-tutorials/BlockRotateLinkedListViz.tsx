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
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Combine, Dices, BoxSelect, ArrowDownUp, Maximize2
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  blockWiseRotate: {
    id: 'blockWiseRotate',
    title: 'Block Circular Rotation',
    icon: <RotateCcw size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public Node rotateBlocks(Node head, int k, int d) {
    if (head == null || k <= 1 || d == 0) return head;

    Node dummy = new Node(0);
    dummy.next = head;
    Node prevTail = dummy;
    Node curr = head;

    while (curr != null) {
        // 1. Identify block and its size
        Node blockHead = curr;
        Node temp = curr;
        Node blockTail = null;
        int size = 0;
        
        while (temp != null && size < k) {
            blockTail = temp;
            temp = temp.next;
            size++;
        }
        Node nextBlockHead = temp;

        // 2. Normalize rotation to 'effective left rotations'
        int leftRots;
        if (d < 0) { // Left rotate
            leftRots = (-d) % size;
        } else { // Right rotate
            leftRots = (size - (d % size)) % size;
        }

        if (leftRots == 0) {
            prevTail = blockTail;
            curr = nextBlockHead;
            continue;
        }

        // 3. Find the new tail and head for the rotated block
        Node newTail = blockHead;
        for (int i = 0; i < leftRots - 1; i++) {
            newTail = newTail.next;
        }
        Node newHead = newTail.next;

        // 4. Perform the rotation and link to main list
        blockTail.next = blockHead; // Circularize temporarily
        newTail.next = nextBlockHead; // Break circle, link to next
        prevTail.next = newHead; // Link previous block to new head

        // 5. Advance
        prevTail = newTail;
        curr = nextBlockHead;
    }
    
    return dummy.next;
}`,
    desc: "This approach rotates each block circularly in O(1) space. By keeping track of a block's actual size (which is crucial for the final, potentially smaller block), we normalize any right/left rotation into an 'effective left rotation'. We then identify the 'new tail', temporarily make the block circular, and split it at the new tail to successfully rotate it in place."
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
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|int|return|if|else|while|for|Node|null|rotateBlocks|head|curr|temp|prevTail|nextBlockHead|blockHead|blockTail|newHead|newTail|next|data|size|k|d|leftRots|new)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-indigo-500/20`, border: `border-indigo-500`, text: `text-indigo-400` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-indigo-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'int', 'return', 'if', 'else', 'while', 'for', 'new'].includes(part);
            const isObject = ['Node'].includes(part);
            const isConst = ['null'].includes(part);
            const isPointer = ['head', 'curr', 'temp', 'prevTail', 'nextBlockHead', 'blockHead', 'blockTail', 'newHead', 'newTail', 'next'].includes(part);
            const isVar = ['size', 'k', 'd', 'leftRots'].includes(part);
            const isProp = ['data'].includes(part);
            return (
              <span 
                key={i} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-sky-400 font-bold' : 
                  isConst ? 'text-orange-400 font-bold' :
                  isPointer ? 'text-indigo-400' : 
                  isVar ? 'text-amber-400' :
                  isProp ? 'text-fuchsia-300' :
                  isNaN(parseInt(part)) && part.trim() !== '<' && part.trim() !== '>' && part.trim() !== '*' && part.trim() !== '+' && part.trim() !== '-' && part.trim() !== '%' ? '' : 'text-emerald-400'
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
    const colorClasses: Record<string, string> = {
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

interface ListNodeData {
  id: number;
  val: string;
  addr: string;
  nextId: number | null;
  x: number;
  y: number;
  isDummy?: boolean;
}

interface ListNodeBlockProps {
  val: string;
  address: string;
  themeColor?: string;
  isTarget?: boolean;
  isDummy?: boolean;
}

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, themeColor = 'slate', isTarget, isDummy }) => {
    const themes: Record<string, any> = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700' }
    };
    
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-105` : `shadow-sm z-10`;

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <span className="text-[10px] text-slate-400 font-mono font-bold mb-1 opacity-80 tracking-tight">{isDummy ? 'Sentinel' : String(address)}</span>
            <div className={`flex items-center w-24 h-14 border-2 rounded-2xl transition-all duration-300 ${isDummy ? 'bg-slate-800 border-slate-600' : activeTheme.bg} ${isDummy ? '' : activeTheme.border} ${targetClasses} relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-xl border-r border-black/10 ${isDummy ? 'text-slate-500' : activeTheme.text}`}>
                    {isDummy ? 'D' : String(val)}
                </div>
                <div className={`w-8 h-full flex flex-col items-center justify-center rounded-r-xl ${isDummy ? 'border-slate-600 bg-slate-700' : 'border-slate-200 bg-slate-50/50'}`}>
                    <span className={`text-[6px] font-black uppercase tracking-widest opacity-60 transform -rotate-90 ${isDummy ? 'text-slate-400' : ''}`}>NXT</span>
                </div>
            </div>
        </div>
    );
};

// --- Main Application ---

export default function BlockRotateLinkedListViz() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('blockWiseRotate');
  
  const [inputList, setInputList] = useState('1, 2, 3, 4, 5, 6, 7, 8, 9');
  const [inputK, setInputK] = useState('4');
  const [inputD, setInputD] = useState('1'); // Negative for left, Positive for right
  const [baseList, setBaseList] = useState<ListNodeData[]>([]);
  
  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 100, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];

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

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => { 
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

  const parseList = (inputStr: string) => {
      const parts = inputStr.split(',').map(s => s.trim()).filter(n => n !== '');
      let nodes: ListNodeData[] = [];
      for (let i = 0; i < parts.length; i++) {
          nodes.push({
              id: i,
              val: parts[i],
              addr: '0x' + (100 + (i * 16)).toString(16).toUpperCase().padStart(3, '0'),
              nextId: i < parts.length - 1 ? i + 1 : null,
              x: 180 + (i * 140),
              y: 100
          });
      }
      return nodes;
  };

  useEffect(() => {
    setBaseList(parseList(inputList));
    setCurrentStep(0);
    setPan({ x: 100, y: 150 });
  }, [inputList, inputK, inputD]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const recalculateLayout = (list: ListNodeData[], dummyId: number) => {
      const newLayout = list.map(n => ({...n}));
      let curr: number | null = dummyId;
      let x = 40;
      let failsafe = 0;
      while (curr !== null && failsafe < list.length * 2) {
          let nodeIndex = newLayout.findIndex(n => n.id === curr);
          if (nodeIndex !== -1) {
              newLayout[nodeIndex].x = x;
              newLayout[nodeIndex].y = 100;
              x += 140;
              curr = newLayout[nodeIndex].nextId;
          } else break;
          failsafe++;
      }
      return newLayout;
  };

  const trace = useMemo(() => {
    const steps: any[] = [];
    if (baseList.length === 0) return [{ phase: 'Init', description: 'Enter valid list.', state: { list: [] } }];
    
    let k = parseInt(inputK) || 0;
    if (k < 1) k = 1; // Prevent infinite loops
    let d = parseInt(inputD) || 0;

    let list = baseList.map(n => ({...n}));
    let dummyId = -1;
    let dummy = { id: dummyId, val: 'D', addr: 'DUMMY', nextId: list.length > 0 ? list[0].id : null, x: 40, y: 100, isDummy: true };
    list.unshift(dummy);

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            list: list.map(n=>({...n})),
            ...st 
        } 
    });

    if (selectedOpId === 'blockWiseRotate') {
        let prevTail = dummyId;
        let curr = dummy.nextId;

        add("Initialize", `Setting up dummy node. k = ${k}, d = ${d} (${d > 0 ? 'Right' : d < 0 ? 'Left' : 'None'}).`, 4, { curr, prevTail });

        while (curr !== null) {
            let blockHead = curr;
            let temp: number | null = curr;
            let blockTail: number | null = null;
            let size = 0;
            let blockNodeIds: number[] = [];
            
            // Identify Block
            while (temp !== null && size < k) {
                blockTail = temp;
                blockNodeIds.push(temp);
                let tempNode = list.find(n => n.id === temp);
                temp = tempNode?.nextId || null;
                size++;
            }
            let nextBlockHead = temp;

            add("Identify Block", `Found block of size ${size}. Calculating effective rotation.`, 13, { curr, prevTail, blockHead, blockTail, nextBlockHead, blockNodeIds });

            // Normalize Rotation
            let leftRots = 0;
            if (d < 0) { // Left
                leftRots = (-d) % size;
            } else { // Right
                leftRots = (size - (d % size)) % size;
            }

            add("Normalize Rotation", `Rotation d=${d}. Normalized to 'leftRots' = ${leftRots} for this block of size ${size}.`, 24, { curr, prevTail, blockHead, blockTail, nextBlockHead, leftRots, blockNodeIds });

            if (leftRots === 0) {
                add("No Rotation Needed", `leftRots is 0. Moving to the next block.`, 31, { curr, prevTail, blockHead, blockTail, nextBlockHead });
                prevTail = blockTail as number;
                curr = nextBlockHead;
                continue;
            }

            // Identify New Head/Tail
            let newTail = blockNodeIds[leftRots - 1];
            let newHead = blockNodeIds[leftRots];

            add("Identify Split Points", `To left-rotate by ${leftRots}, Node(${list.find(n=>n.id===newTail)?.val}) becomes the new tail, and Node(${list.find(n=>n.id===newHead)?.val}) becomes the new head.`, 39, { curr, prevTail, blockHead, blockTail, newTail, newHead, nextBlockHead });

            // Apply Rotation Pointers
            let ptNode = list.find(n => n.id === prevTail);
            let btNode = list.find(n => n.id === blockTail);
            let ntNode = list.find(n => n.id === newTail);

            if (ptNode && btNode && ntNode) {
                btNode.nextId = blockHead; // Circularize
                ntNode.nextId = nextBlockHead; // Break circle
                ptNode.nextId = newHead; // Link previous block
            }

            list = recalculateLayout(list, dummyId);
            add("Apply Pointers & Layout", `Pointers re-linked and block physically rotated in O(1) space.`, 43, { curr, prevTail, newTail, newHead, nextBlockHead });

            // Advance
            prevTail = newTail;
            curr = nextBlockHead;
            add("Advance", `Moving prevTail and curr forward to process the next block.`, 47, { curr, prevTail });
        }

        let finalSeq = [];
        let c = list.find(n => n.id === dummyId)?.nextId;
        while(c != null) {
            let n = list.find(x => x.id === c);
            if (n) {
                finalSeq.push(String(n.val));
                c = n.nextId;
            } else break;
        }

        add("Complete", "Linked list block-wise rotation fully resolved.", 50, { isSuccess: true, finalSeq: finalSeq.join(' → ') });
    }

    return steps;
  }, [baseList, selectedOpId, inputK, inputD]);

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { list: [] } };
  const st = curStepData.state || { list: [] };
  const isLastStep = currentStep === trace.length - 1;

  const renderSvgArrows = () => {
    const arrows: React.ReactElement[] = [];
    (st.list || []).forEach((node: ListNodeData) => {
        if (node.nextId !== null && node.nextId !== undefined) {
            const target = st.list.find((n: ListNodeData) => n.id === node.nextId);
            if (target) {
                let startX = node.x + 96; 
                let startY = node.y + 28;
                let endX = target.x - 6; 
                let endY = target.y + 28;
                
                let strokeColor = '#cbd5e1'; // slate-300
                let strokeWidth = 2;
                let pathD = '';
                let isReversed = false;

                if (target.x < node.x) {
                    // Backward Arrow
                    isReversed = true;
                    strokeColor = '#f43f5e'; // rose-500
                    startX = node.x + 48; // from middle
                    endX = target.x + 48; // to middle
                    pathD = `M ${startX},${startY - 28} C ${startX},${startY - 80} ${endX},${endY - 80} ${endX},${endY - 28}`;
                } else if (target.x > node.x + 160) {
                    // Forward jump
                    strokeColor = '#10b981'; // emerald-500
                    pathD = `M ${startX},${startY} C ${startX + 30},${startY + 60} ${endX - 30},${endY + 60} ${endX},${endY}`;
                } else {
                    // Normal adjacent
                    pathD = `M ${startX},${startY} L ${endX},${endY}`;
                }

                arrows.push(<path key={`next-${node.id}`} d={pathD} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} markerEnd={`url(#arrowhead-${isReversed ? 'rev' : 'fwd'})`} className="transition-all duration-500" opacity={0.8}/>);
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
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <RotateCcw className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Block Rotate</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      In-Place Cycle
                  </span>
                  <span>•</span>
                  <span>Math Normalization</span>
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
                    <div className="flex items-center gap-3 text-indigo-600 font-black text-2xl uppercase tracking-tighter"><RotateCcw size={28}/> Circular Segments</div>
                    <p className="text-lg leading-relaxed max-w-3xl">
                      Given a Linked List, a block length $k$, and a rotation amount $d$. Circularly rotate each block of size $k$ towards the right (if $d {'>'} 0$) or left (if $d {'<'} 0$). If the last block has fewer than $k$ nodes, it should rotate according to its actual size.
                    </p>
                    <div className="bg-slate-900 border-l-4 border-indigo-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-nowrap">
                       <span className="text-indigo-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Input: k = 3, d = 1 (Right Rotate by 1)</span>
                       1 → 2 → 3  |  4 → 5 → 6  |  7 → 8<br/>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-emerald-300">3 → 1 → 2  |  6 → 4 → 5  |  8 → 7</span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> Goal</h4>
                        <p className="text-sm leading-relaxed">Achieve this in $O(N)$ time and $O(1)$ space. We cannot allocate arrays to figure out the rotation. We must manipulate the <code>next</code> pointers directly to temporarily form circles and break them at the newly calculated boundaries.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><LayersIcon size={16} className="text-indigo-500"/> Challenge</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Handling left vs. right rotations is tricky, especially when $|d|$ is larger than the block size $k$, or when dealing with the smaller remaining tail block. Math modulo operations are essential.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-indigo-600 text-white border-indigo-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-indigo-100' : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[400px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> BlockRotate.java</span>
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
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-[2] w-full space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-indigo-600 pl-1">Target List</label>
                            <input type="text" value={inputList} onChange={(e) => setInputList(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
                        </div>
                        <div className="flex-[1] w-full flex gap-2">
                            <div className="flex-1 space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest font-mono text-fuchsia-600 pl-1">Size (k)</label>
                                <input type="number" value={inputK} onChange={(e) => setInputK(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 font-mono text-sm focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all shadow-inner" />
                            </div>
                            <div className="flex-1 space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest font-mono text-sky-600 pl-1">Rot (d)</label>
                                <input type="number" value={inputD} onChange={(e) => setInputD(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 font-mono text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-inner" />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 shrink-0 justify-end pt-2 border-t border-slate-100">
                        <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={20}/></button>
                        <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={20}/></button>
                        <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Memory Analysis</span></div>
                        <div className="flex items-center gap-2">
                           {st.leftRots !== undefined && <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Eff. Left Rots = {st.leftRots}</span>}
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> SUCCESS</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold italic tracking-tight">Block-wise circular rotation complete.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight text-white`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[400px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Network size={14} className="text-indigo-500"/> Sequence Arena</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomOut size={18}/></button>
                            <button onClick={toggleFullscreen} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><Maximize size={18}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-500" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0 pointer-events-none">
                               <defs>
                                  <marker id="arrowhead-fwd" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" opacity="0.8" /></marker>
                                  <marker id="arrowhead-rev" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" opacity="0.8" /></marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>
                           
                           {/* Active Block Highlight Frame */}
                           {st.blockNodes && st.blockNodes.length > 0 && (
                               <div 
                                  className="absolute bg-slate-100/50 border-2 border-dashed border-slate-300 rounded-3xl transition-all duration-700 pointer-events-none -z-10"
                                  style={{
                                      left: (st.list.find((n: ListNodeData) => n.id === st.blockNodes[0])?.x || 0) - 20,
                                      top: 60,
                                      width: ((st.blockNodes.length - 1) * 140) + 140,
                                      height: 110
                                  }}
                               />
                           )}

                           {(st.list || []).map((nodeObj: ListNodeData) => {
                              const isCurr = st.curr === nodeObj.id; 
                              const isPrevTail = st.prevTail === nodeObj.id;
                              const isNewHead = st.newHead === nodeObj.id;
                              const isNewTail = st.newTail === nodeObj.id;
                              const isBlockHead = st.blockHead === nodeObj.id;
                              const isBlockTail = st.blockTail === nodeObj.id;
                              const isNextBlockHead = st.nextBlockHead === nodeObj.id;
                              
                              let themeColor = nodeObj.isDummy ? 'slate' : 'slate';
                              if (isNewHead) themeColor = 'fuchsia';
                              else if (isNewTail) themeColor = 'amber';
                              else if (isBlockHead) themeColor = 'emerald';
                              else if (isBlockTail) themeColor = 'sky';
                              else if (isCurr && !nodeObj.isDummy) themeColor = 'indigo';
                              
                              const isTarget = isCurr || isPrevTail || isNewHead || isNewTail || isBlockHead || isBlockTail || isNextBlockHead;

                              const lbls = [];
                              if (isCurr && !nodeObj.isDummy) lbls.push({ text: "curr", color: "indigo", pos: "top" });
                              if (isPrevTail) lbls.push({ text: "prevTail", color: "amber", pos: "bottom" });
                              if (isBlockHead) lbls.push({ text: "b.head", color: "emerald", pos: "top" });
                              if (isBlockTail) lbls.push({ text: "b.tail", color: "sky", pos: "top" });
                              if (isNewHead) lbls.push({ text: "newHead", color: "fuchsia", pos: "bottom" });
                              if (isNewTail) lbls.push({ text: "newTail", color: "amber", pos: "bottom" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isTarget} themeColor={themeColor} isDummy={nodeObj.isDummy}/>
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
                    <h3 className="font-black text-indigo-400 text-lg uppercase tracking-widest mb-6">Algorithm Theory: The Unified Rotation</h3>
                    <div className="space-y-6 text-sm text-slate-300 leading-relaxed max-w-2xl font-medium text-lg">
                        <p>Handling left vs. right rotations separately requires bloated code with many edge cases. We can elegantly unify them by calculating the "Effective Left Rotations".</p>
                        <p><strong>1. Identify the Bounds:</strong> For a given segment, we first traverse to find its <code>size</code>. If we reach the end of the linked list early, <code>size</code> is less than $k$.</p>
                        <p><strong>2. The Formula:</strong>
                           <br/>- If $d {'<'} 0$ (Left), the effective left shifts are <code>|d| % size</code>.
                           <br/>- If $d {'>'} 0$ (Right), moving right by $d$ is mathematically identical to moving left by <code>(size - (d % size)) % size</code>.
                        </p>
                        <p><strong>3. Circular Shift:</strong> Once we know we must left-rotate by $L$, we traverse $L-1$ nodes from the block head. This node becomes the <code>newTail</code>. The node after it is the <code>newHead</code>. We link the old tail to the old head to create a circle, then break the circle at <code>newTail.next = nextBlockHead</code>.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-indigo-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-indigo-500">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Cracking the Block Rotate</h3>
                    <p className="text-sm text-indigo-50 leading-relaxed italic max-w-2xl font-mono">"In interviews, candidates often struggle by treating 'Left' and 'Right' as entirely different algorithms. The core secret is realizing that all circular rotations can be expressed as a Left rotation. Once you derive that single normalized integer, the pointer logic is universal."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 text-slate-700">
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-rose-600 border-b pb-2">Technical Checks</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Modulo Arithmetic:</strong> Never rotate $d$ times directly! If $d$ is 1,000,000, your code will TLE. Always do <code>d % size</code>.</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Zero Rotation Check:</strong> If <code>leftRots == 0</code>, the block doesn't change. You must add an `if` statement to skip the pointer rewiring, or you'll accidentally break the list!</div></li>
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
                          <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-900/50"><Code2 size={20}/></div>
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
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                {st.leftRots !== undefined && <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Eff Left = {st.leftRots}</span>}
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight text-white`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex gap-6 animate-in slide-in-from-bottom-10">
                          <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                          <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className="px-12 py-6 bg-indigo-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-indigo-500 shadow-indigo-900/20">NEXT <ChevronRight size={32}/></button>
                      </div>
                  )}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-500" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0 pointer-events-none">
                               <defs>
                                  <marker id="arrowhead-fwd-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" opacity="0.8" /></marker>
                                  <marker id="arrowhead-rev-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" opacity="0.8" /></marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>
                           
                           {/* Active Block Highlight Frame FS */}
                           {st.blockNodes && st.blockNodes.length > 0 && (
                               <div 
                                  className="absolute bg-slate-100/50 border-2 border-dashed border-slate-300 rounded-3xl transition-all duration-700 pointer-events-none -z-10"
                                  style={{
                                      left: (st.list.find((n: ListNodeData) => n.id === st.blockNodes[0])?.x || 0) - 20,
                                      top: 60,
                                      width: ((st.blockNodes.length - 1) * 140) + 140,
                                      height: 110
                                  }}
                               />
                           )}

                           {(st.list || []).map((nodeObj: ListNodeData) => {
                              const isCurr = st.curr === nodeObj.id; 
                              const isPrevTail = st.prevTail === nodeObj.id;
                              const isNewHead = st.newHead === nodeObj.id;
                              const isNewTail = st.newTail === nodeObj.id;
                              const isBlockHead = st.blockHead === nodeObj.id;
                              const isBlockTail = st.blockTail === nodeObj.id;
                              const isNextBlockHead = st.nextBlockHead === nodeObj.id;
                              
                              let themeColor = nodeObj.isDummy ? 'slate' : 'slate';
                              if (isNewHead) themeColor = 'fuchsia';
                              else if (isNewTail) themeColor = 'amber';
                              else if (isBlockHead) themeColor = 'emerald';
                              else if (isBlockTail) themeColor = 'sky';
                              else if (isCurr && !nodeObj.isDummy) themeColor = 'indigo';
                              
                              const isTarget = isCurr || isPrevTail || isNewHead || isNewTail || isBlockHead || isBlockTail || isNextBlockHead;

                              const lbls = [];
                              if (isCurr && !nodeObj.isDummy) lbls.push({ text: "curr", color: "indigo", pos: "top" });
                              if (isPrevTail) lbls.push({ text: "prevTail", color: "amber", pos: "bottom" });
                              if (isBlockHead) lbls.push({ text: "b.head", color: "emerald", pos: "top" });
                              if (isBlockTail) lbls.push({ text: "b.tail", color: "sky", pos: "top" });
                              if (isNewHead) lbls.push({ text: "newHead", color: "fuchsia", pos: "bottom" });
                              if (isNewTail) lbls.push({ text: "newTail", color: "amber", pos: "bottom" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isTarget} themeColor={themeColor} isDummy={nodeObj.isDummy}/>
                                  </div>
                              )
                           })}
                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className="bg-[#0f172a] border-4 border-emerald-500 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(16,185,129,0.3)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10"><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">ROTATION COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">All blocks successfully rotated</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center max-h-48 overflow-y-auto">
                                    <div className="font-mono text-white text-2xl font-black leading-relaxed">{st.finalSeq}</div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className="flex-1 py-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg shadow-emerald-900/20">
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