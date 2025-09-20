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
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Combine, Dices, BoxSelect
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  reservoirSampling: {
    id: 'reservoirSampling',
    title: 'Reservoir Sampling',
    icon: <Dices size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public int getRandom(Node head) {
    int result = head.data; // Initialize reservoir with 1st node
    Node curr = head.next;
    int n = 2; // Counter for current node index (1-based)
    
    while (curr != null) {
        // Generate random number from 0 to n-1
        int j = (int)(Math.random() * n);
        
        // If random number is 0, replace reservoir
        if (j == 0) {
            result = curr.data;
        }
        
        curr = curr.next;
        n++;
    }
    
    return result;
}`,
    desc: "The optimal O(N) Time and O(1) Space approach. We stream through the list, picking the 1st element with probability 1/1. Then we pick the 2nd element with probability 1/2. We pick the n-th element with probability 1/n. This mathematically guarantees that when we reach the end, every single node had an equal 1/N chance of being the final survivor in our 'reservoir'."
  },
  vectorMapping: {
    id: 'vectorMapping',
    title: 'Vector Mapping',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public int getRandomVector(Node head) {
    ArrayList<Integer> list = new ArrayList<>();
    Node curr = head;
    
    // 1. Copy all elements to a dynamically resizable array
    while (curr != null) {
        list.add(curr.data);
        curr = curr.next;
    }
    
    // 2. Select a random index from 0 to length-1
    int n = list.size();
    int randomIndex = (int)(Math.random() * n);
    
    // 3. Return the element at that index
    return list.get(randomIndex);
}`,
    desc: "A simpler approach using O(N) auxiliary space. We traverse the linked list once and copy all values into an Array/Vector. Once all values are in contiguous memory, we simply generate a random index between 0 and N-1 to pick our node in O(1) time."
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
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|void|return|if|else|while|Node|null|getRandom|getRandomVector|head|curr|result|data|new|int|j|n|Math|random|ArrayList|Integer|list|add|size|randomIndex|get)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-indigo-500/20`, border: `border-indigo-500`, text: `text-indigo-400` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-indigo-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'void', 'return', 'if', 'else', 'while', 'new', 'int'].includes(part);
            const isObject = ['Node', 'Math', 'ArrayList', 'Integer'].includes(part);
            const isConst = ['null'].includes(part);
            const isPointer = ['head', 'curr', 'list'].includes(part);
            const isVar = ['result', 'j', 'n', 'randomIndex'].includes(part);
            const isMethod = ['random', 'add', 'size', 'get'].includes(part);
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
                  isMethod ? 'text-fuchsia-300' :
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
}

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, themeColor = 'slate', isTarget }) => {
    const themes = {
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
            <span className="text-[10px] text-slate-400 font-mono font-bold mb-1 opacity-80 tracking-tight">{String(address)}</span>
            <div className={`flex items-center w-24 h-14 border-2 rounded-2xl transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-xl border-b border-black/10 ${activeTheme.text}`}>
                    {String(val)}
                </div>
                <div className={`w-8 h-full border-l-2 flex flex-col items-center justify-center rounded-r-xl border-slate-200 bg-slate-50`}>
                    <span className={`text-[6px] font-black uppercase tracking-widest opacity-60 transform -rotate-90`}>NXT</span>
                </div>
            </div>
        </div>
    );
};

// --- Main Application ---

export default function SelectRandomNodeLinkedListViz() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('reservoirSampling');
  
  const [inputList, setInputList] = useState('5, 20, 4, 3, 30, 99');
  const [baseList, setBaseList] = useState([]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [simulationSeed, setSimulationSeed] = useState(0); // Trigger re-rolls

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
    setSimulationSeed(s => s + 1); // Force a new random trace
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
      const parts = inputStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      let nodes = [];
      for (let i = 0; i < parts.length; i++) {
          nodes.push({
              id: i,
              val: parts[i],
              addr: '0x' + (100 + (i * 16)).toString(16).toUpperCase().padStart(3, '0'),
              nextId: i < parts.length - 1 ? i + 1 : null,
              x: 60 + (i * 140),
              y: 80
          });
      }
      return nodes;
  };

  useEffect(() => {
    setBaseList(parseList(inputList));
    setCurrentStep(0);
    setSimulationSeed(0);
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
    
    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            list: list.map(n=>({...n})),
            ...st 
        } 
    });

    if (selectedOpId === 'reservoirSampling') {
        let result = null;
        let resultSourceId = null;
        let curr = list[0]?.id;
        let n = 1;

        if (curr != null) {
            let node = list.find(x => x.id === curr);
            result = node.val;
            resultSourceId = curr;
            add("Init Reservoir", `result = head.data; Reservoir initialized with 1st element: ${result}.`, 2, { curr, result, resultSourceId, n });
            
            curr = node.nextId;
            n = 2;
            if (curr != null) add("Initialize Pointers", `curr = head.next; n = ${n};`, 3, { curr, result, resultSourceId, n });
        }

        while (curr != null) {
            let node = list.find(x => x.id === curr);
            
            // Random generation (seed doesn't matter, Math.random is fine because useMemo caches it for the lifetime of 'simulationSeed')
            let j = Math.floor(Math.random() * n); 

            add("Roll Dice", `Node(${node.val}) is element index ${n}. Generating random j from 0 to ${n-1}.`, 7, { curr, result, resultSourceId, n, isRolling: true });
            
            if (j === 0) {
                add("Dice Result: 0", `j = 0! The node beats the odds (1/${n}). Replacing reservoir.`, 11, { curr, result, resultSourceId, n, j, isWinning: true });
                result = node.val;
                resultSourceId = curr;
            } else {
                add("Dice Result: > 0", `j = ${j}. Did not roll a 0. Keeping current reservoir value: ${result}.`, 11, { curr, result, resultSourceId, n, j, isLosing: true });
            }

            curr = node.nextId;
            n++;
            
            if (curr != null) add("Advance", `curr = curr.next; n++; Moving to element ${n}.`, 14, { curr, result, resultSourceId, n });
        }

        add("Complete", `Reached end of list. Final randomly selected node is ${result}.`, 18, { isSuccess: true, result, resultSourceId });

    } else if (selectedOpId === 'vectorMapping') {
        let curr = list[0]?.id;
        let arr = [];
        
        add("Initialize Vector", "Create an empty dynamic ArrayList.", 2, { curr, arr: [...arr] });

        while (curr != null) {
            let node = list.find(x => x.id === curr);
            arr.push(node.val);
            add("Push Node", `list.add(${node.val}); Copying data into contiguous array memory.`, 7, { curr, arr: [...arr] });
            curr = node.nextId;
        }

        add("Vector Populated", "List traversal complete. All elements are now stored in an O(1) accessible array.", 11, { arr: [...arr], n: arr.length });

        let n = arr.length;
        let j = Math.floor(Math.random() * n);
        let result = arr[j];

        add("Select Random", `Generating a random index between 0 and ${n-1}. We rolled index ${j}.`, 13, { arr: [...arr], n, selectedIndex: j });
        
        add("Complete", `Returning list.get(${j}) which is ${result}.`, 16, { isSuccess: true, arr: [...arr], selectedIndex: j, result });
    }

    return steps;
  }, [baseList, selectedOpId, simulationSeed]); // Recalculate on input change OR explicit re-roll

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { list: [] } };
  const st = curStepData.state || { list: [] };
  const isLastStep = currentStep === trace.length - 1;

  const renderSvgArrows = () => {
    return (st.list || []).map((node) => {
        if (node.nextId === null || node.nextId === undefined) return null;
        const target = st.list.find((n) => n.id === node.nextId);
        if (!target) return null;
        
        const startX = node.x + 92; 
        const startY = node.y + 28;
        const endX = target.x - 6; 
        const endY = target.y + 28;
        
        return <path key={`link-${String(node.addr)}`} d={`M ${startX},${startY} L ${endX},${endY}`} fill="none" stroke="#cbd5e1" strokeWidth={2} markerEnd="url(#arrowhead-default)" className="transition-all duration-500" />;
    });
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <Dices className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Select Random Node</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      Uniform Probability
                  </span>
                  <span>•</span>
                  <span>1/N Distribution</span>
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
                    <div className="flex items-center gap-3 text-indigo-600 font-black text-2xl uppercase tracking-tighter"><Dices size={28}/> Fair Selection</div>
                    <p className="text-lg leading-relaxed max-w-3xl">
                      Given a singly linked list, select a random node from the list such that the probability of picking any node is exactly $1/N$ (where $N$ is the total number of nodes). 
                    </p>
                    <div className="bg-slate-900 border-l-4 border-indigo-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white">
                       <span className="text-indigo-400 block mb-1 uppercase text-[10px] font-black tracking-widest">List:</span>
                       5 → 20 → 4 → 3 → 30<br/>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output Distribution:</span>
                       <span className="text-slate-300">Each element has exactly a 20% chance of being selected.</span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> Challenge</h4>
                        <p className="text-sm leading-relaxed">If we don't know $N$ in advance, how can we pick a random node fairly in a single pass? We can't generate a random number from $1$ to $N$ if we haven't reached the end yet to count $N$!</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><LayersIcon size={16} className="text-indigo-500"/> Solutions</h4>
                        <p className="text-sm leading-relaxed text-slate-600">The naive way is to copy elements to an array ($O(N)$ Space). The brilliant way is <strong>Reservoir Sampling</strong>, which selects on the fly using $O(1)$ Space.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-indigo-600 text-white border-indigo-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-indigo-100' : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[400px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> RandomNode.java</span>
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
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-indigo-600 pl-1">Target List</label>
                            <input type="text" value={inputList} onChange={(e) => setInputList(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end">
                            <button onClick={handleReset} title="Re-roll the random numbers!" className="p-3 bg-fuchsia-100 text-fuchsia-600 rounded-xl hover:bg-fuchsia-200 shadow-sm transition-colors flex items-center gap-2"><Dices size={20}/> <span className="text-xs font-black uppercase tracking-widest hidden md:inline">Re-roll</span></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Memory Analysis</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> {String(st.result)} CHOSEN</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold italic tracking-tight">Hit 'Re-roll' above to generate a new random trace!</p>
                         </div>
                    ) : (
                        <>
                            <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-none truncate">{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[400px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Network size={14} className="text-indigo-500"/> Reservoir Arena</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomOut size={18}/></button>
                            <button onClick={toggleFullscreen} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><Maximize size={18}/></button>
                        </div>
                   </div>

                   {/* Probability Indicators / Arrays based on selection */}
                   <div className="absolute bottom-8 left-8 right-8 z-20 flex gap-4 pointer-events-none">
                       {selectedOpId === 'reservoirSampling' && (
                           <div className="flex gap-4 w-full">
                               <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex-1 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                                   <div className="absolute top-0 right-0 p-3 opacity-10"><Dices size={64}/></div>
                                   <span className="text-[10px] font-black uppercase text-amber-700 tracking-widest mb-1 relative z-10">Odds of Replacing</span>
                                   <div className="font-mono text-4xl font-black text-amber-900 relative z-10 flex items-baseline gap-2">
                                       {st.isRolling || st.j !== undefined ? (
                                           <>
                                              <span className={st.isWinning ? 'text-emerald-500' : st.isLosing ? 'text-rose-500' : ''}>1</span>
                                              <span className="text-xl text-amber-400">/</span>
                                              <span>{st.n}</span>
                                           </>
                                       ) : (
                                           <span className="opacity-30">-</span>
                                       )}
                                   </div>
                                   {(st.j !== undefined) && (
                                       <div className={`mt-2 px-3 py-1 rounded-lg text-xs font-black font-mono shadow-inner ${st.isWinning ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-rose-100 text-rose-700 border border-rose-300'}`}>
                                           Rolled: {st.j} {st.isWinning ? '(Success!)' : '(Failed)'}
                                       </div>
                                   )}
                               </div>

                               <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 flex-1 shadow-sm flex flex-col items-center justify-center relative">
                                   <div className="absolute top-0 right-0 p-3 opacity-10"><BoxSelect size={64}/></div>
                                   <span className="text-[10px] font-black uppercase text-indigo-700 tracking-widest mb-1 relative z-10">Current Reservoir</span>
                                   <div className="font-mono text-5xl font-black text-indigo-900 relative z-10">
                                       {st.result !== undefined && st.result !== null ? st.result : <span className="opacity-30">-</span>}
                                   </div>
                               </div>
                           </div>
                       )}

                       {selectedOpId === 'vectorMapping' && st.arr && (
                           <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 w-full shadow-sm">
                               <div className="text-[10px] font-black uppercase text-sky-700 tracking-widest mb-3 flex items-center justify-between">
                                   <span className="flex items-center gap-2"><ListOrdered size={14}/> ArrayList Memory</span>
                                   {st.selectedIndex !== undefined && <span className="bg-fuchsia-100 text-fuchsia-700 px-2 py-0.5 rounded font-mono border border-fuchsia-200">Rolled Index: {st.selectedIndex}</span>}
                               </div>
                               <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                                   {st.arr.map((val, idx) => {
                                       const isSelected = st.selectedIndex === idx;
                                       return (
                                           <div key={idx} className={`flex flex-col items-center min-w-[48px]`}>
                                               <span className="text-[9px] font-mono text-sky-500 font-bold mb-1">{idx}</span>
                                               <div className={`h-12 w-full rounded-xl flex items-center justify-center font-mono font-black text-lg border-2 shadow-sm transition-all ${isSelected ? 'bg-fuchsia-500 border-fuchsia-600 text-white scale-110 -translate-y-2' : 'bg-white border-sky-200 text-sky-800'}`}>
                                                   {val}
                                               </div>
                                           </div>
                                       );
                                   })}
                               </div>
                           </div>
                       )}
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0 pointer-events-none">
                               <defs>
                                  <marker id="arrowhead-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>

                           {(st.list || []).map((nodeObj) => {
                              const isCurr = st.curr === nodeObj.id; 
                              const isRes = st.resultSourceId === nodeObj.id;
                              
                              let themeColor = 'slate';
                              if (isRes) themeColor = 'indigo';
                              if (isCurr) themeColor = 'amber';
                              
                              const isTarget = isCurr || isRes;

                              const lbls = [];
                              if (isCurr) lbls.push({ text: "curr", color: "amber", pos: "top" });
                              if (isRes) lbls.push({ text: "in reservoir", color: "indigo", pos: "bottom" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isTarget} themeColor={themeColor}/>
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
                    <h3 className="font-black text-indigo-400 text-lg uppercase tracking-widest mb-6">Reservoir Sampling Proof</h3>
                    <div className="space-y-6 text-sm text-slate-300 leading-relaxed max-w-2xl font-medium text-lg">
                        <p>We want to prove that every node has exactly a $1/N$ chance of being selected by the time we reach the end of the list.</p>
                        <p>Let's look at the last node (the $N$-th node). We generate a random number from $0$ to $N-1$. The chance of rolling a $0$ is exactly <strong>$1/N$</strong>. So the last node has a $1/N$ chance of becoming the result.</p>
                        <p>What about the second-to-last node ($N-1$)? It had a $1/(N-1)$ chance of being selected when we processed it. However, to <em>survive</em> until the end, the $N$-th node must <em>fail</em> its roll (probability $(N-1)/N$).</p>
                        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl font-mono text-center shadow-inner text-emerald-400">
                            Survival Prob = [1 / (N-1)] * [(N-1) / N] = <strong>1 / N</strong>
                        </div>
                        <p>This inductive proof holds for every single node in the list. They all end up with a $1/N$ probability!</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-indigo-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-indigo-500">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Cracking the Reservoir</h3>
                    <p className="text-sm text-indigo-50 leading-relaxed italic max-w-2xl font-mono">"This is a pure algorithmic knowledge check. If you don't know Reservoir Sampling, you will default to the Array mapping or double-traversal method. Knowing this algorithm by name immediately signals seniority to the interviewer."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 text-slate-700">
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-rose-600 border-b pb-2">Technical Checks</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>0-based vs 1-based:</strong> Pay very close attention to your random number generator boundaries. If <code>n</code> is 1-based, <code>Math.random() * n</code> generates an integer from <code>0</code> to <code>n-1</code>. </div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Streaming Data:</strong> Note that Reservoir Sampling isn't just for Linked Lists. It's the standard answer for "Pick a random item from a data stream of unknown length." Mentioning this context earns bonus points.</div></li>
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
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View & Re-Roll" className="p-3 text-slate-600 hover:text-fuchsia-600 rounded-xl hover:bg-fuchsia-50 transition-all"><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {/* FS Dynamic Display */}
                  <div className="absolute bottom-8 left-8 right-32 z-20 flex gap-4 pointer-events-none">
                       {selectedOpId === 'reservoirSampling' && (
                           <div className="flex gap-4 w-96">
                               <div className="bg-amber-50/90 backdrop-blur border border-amber-200 rounded-2xl p-5 flex-1 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
                                   <span className="text-[10px] font-black uppercase text-amber-700 tracking-widest mb-1 relative z-10">Replacing Odds</span>
                                   <div className="font-mono text-4xl font-black text-amber-900 relative z-10 flex items-baseline gap-2">
                                       {st.isRolling || st.j !== undefined ? (
                                           <>
                                              <span className={st.isWinning ? 'text-emerald-500' : st.isLosing ? 'text-rose-500' : ''}>1</span>
                                              <span className="text-xl text-amber-400">/</span>
                                              <span>{st.n}</span>
                                           </>
                                       ) : <span className="opacity-30">-</span>}
                                   </div>
                               </div>

                               <div className="bg-indigo-50/90 backdrop-blur border border-indigo-200 rounded-2xl p-5 flex-1 shadow-2xl flex flex-col items-center justify-center relative">
                                   <span className="text-[10px] font-black uppercase text-indigo-700 tracking-widest mb-1 relative z-10">Reservoir</span>
                                   <div className="font-mono text-5xl font-black text-indigo-900 relative z-10">
                                       {st.result !== undefined && st.result !== null ? st.result : <span className="opacity-30">-</span>}
                                   </div>
                               </div>
                           </div>
                       )}
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
                                  <marker id="arrowhead-default-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>
                           
                           {/* Vector Array FS Mode */}
                           {selectedOpId === 'vectorMapping' && st.arr && (
                               <div className="absolute left-[60px] top-[260px] bg-sky-50/90 backdrop-blur border border-sky-200 rounded-2xl p-6 shadow-2xl min-w-[300px]">
                                   <div className="text-[10px] font-black uppercase text-sky-700 tracking-widest mb-3 flex items-center justify-between">
                                       <span className="flex items-center gap-2"><ListOrdered size={14}/> Extracted Array</span>
                                       {st.selectedIndex !== undefined && <span className="bg-fuchsia-100 text-fuchsia-700 px-3 py-1 rounded font-mono border border-fuchsia-200 text-sm">Rolled Idx: {st.selectedIndex}</span>}
                                   </div>
                                   <div className="flex gap-3">
                                       {st.arr.map((val, idx) => {
                                           const isSelected = st.selectedIndex === idx;
                                           return (
                                               <div key={idx} className={`flex flex-col items-center min-w-[56px]`}>
                                                   <span className="text-[11px] font-mono text-sky-500 font-bold mb-1">{idx}</span>
                                                   <div className={`h-14 w-full rounded-xl flex items-center justify-center font-mono font-black text-xl border-2 shadow-md transition-all ${isSelected ? 'bg-fuchsia-500 border-fuchsia-600 text-white scale-110 -translate-y-2' : 'bg-white border-sky-200 text-sky-800'}`}>
                                                       {val}
                                                   </div>
                                               </div>
                                           );
                                       })}
                                   </div>
                               </div>
                           )}

                           {(st.list || []).map((nodeObj) => {
                              const isCurr = st.curr === nodeObj.id; 
                              const isRes = st.resultSourceId === nodeObj.id;
                              
                              let themeColor = 'slate';
                              if (isRes) themeColor = 'indigo';
                              if (isCurr) themeColor = 'amber';
                              
                              const isTarget = isCurr || isRes;

                              const lbls = [];
                              if (isCurr) lbls.push({ text: "curr", color: "amber", pos: "top" });
                              if (isRes) lbls.push({ text: "in reservoir", color: "indigo", pos: "bottom" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isTarget} themeColor={themeColor}/>
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">{String(st.result)} CHOSEN</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Random Node Selection Complete</p>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className="flex-1 py-6 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg shadow-fuchsia-900/20 border border-fuchsia-500">
                                        <Dices size={24}/> RE-ROLL TRACE
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