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
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Combine, Dices, BoxSelect, ArrowDownUp, Maximize2, Variable,
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalO1Space: {
    id: 'optimalO1Space',
    title: '1. In-Place Reversal (Optimal)',
    icon: <Combine size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public int pairSum(ListNode head) {
    ListNode slow = head;
    ListNode fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    ListNode prev = null;
    ListNode curr = slow;
    while (curr != null) {
        ListNode nextNode = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextNode;
    }

    int maxSum = 0;
    ListNode start = head;
    while (prev != null) {
        maxSum = Math.max(maxSum, start.val + prev.val);
        start = start.next;
        prev = prev.next;
    }

    return maxSum;
}`,
    desc: "The optimal O(N) time and O(1) space solution. We find the middle of the linked list using the slow/fast pointer technique. Then, we reverse the second half of the list in-place. Finally, we use one pointer at the start of the list and one at the start of the reversed half to iteratively calculate and track the maximum twin sum."
  },
  naiveArray: {
    id: 'naiveArray',
    title: '2. Array Storage (Naive)',
    icon: <Database size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public int pairSum(ListNode head) {
    List<Integer> list = new ArrayList<>();
    ListNode curr = head;
    
    while (curr != null) {
        list.add(curr.val);
        curr = curr.next;
    }
    
    int maxSum = 0;
    int n = list.size();
    
    for (int i = 0; i < n / 2; i++) {
        int currentSum = list.get(i) + list.get(n - 1 - i);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}`,
    desc: "The naive O(N) space approach. We simply traverse the entire linked list and store all the values into an ArrayList. Once we have standard index-based access, we can easily sum the i-th and (n - 1 - i)-th elements using a standard for loop to find the maximum twin sum."
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
  theme?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'indigo' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|int|return|if|else|while|for|ListNode|null|pairSum|head|slow|fast|prev|curr|nextNode|start|maxSum|list|List|ArrayList|Math|max|get|size|add|n|i|currentSum|next|val)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  const activeStyles = theme === 'indigo' 
    ? { bg: `bg-indigo-500/20`, border: `border-indigo-500`, text: `text-indigo-400` }
    : { bg: `bg-amber-500/20`, border: `border-amber-500`, text: `text-amber-400` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `${activeStyles.text} font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'int', 'return', 'if', 'else', 'while', 'for'].includes(part);
            const isObject = ['ListNode', 'List', 'ArrayList', 'Math'].includes(part);
            const isConst = ['null'].includes(part);
            const isPointer = ['head', 'slow', 'fast', 'prev', 'curr', 'nextNode', 'start', 'next', 'val', 'list', 'maxSum', 'n', 'currentSum'].includes(part);
            const isMapCall = ['pairSum', 'max', 'get', 'size', 'add'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&'].includes(part.trim());
            
            return (
              <span 
                key={i} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-sky-400 font-bold' : 
                  isConst ? 'text-orange-400 font-bold' :
                  isMapCall ? 'text-emerald-300' :
                  isOperator ? 'text-slate-400 font-bold' :
                  isPointer ? (theme === 'indigo' ? 'text-indigo-300' : 'text-amber-300') : 
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
    const colorClasses: Record<string, string> = {
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
        sky: 'bg-sky-100 text-sky-700 border-sky-300',
        indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300',
        rose: 'bg-rose-100 text-rose-700 border-rose-300',
        amber: 'bg-amber-100 text-amber-700 border-amber-300',
        slate: 'bg-slate-100 text-slate-600 border-slate-300'
    };
    const activeColorClass = colorClasses[color] || colorClasses['slate'];
    const alignClass = position === 'top' ? 'flex-col-reverse -top-12' : 'flex-col -bottom-12';

    return (
        <div className={`absolute ${alignClass} flex items-center justify-center animate-in zoom-in duration-300 z-30 pointer-events-none`} style={{ transform: `translateX(${offset}px)`}}>
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
  originalIndex: number;
}

interface ListNodeBlockProps {
  val: string;
  address: string;
  themeColor?: string;
  isTarget?: boolean;
  originalIndex: number;
  isDimmed?: boolean;
}

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, themeColor = 'slate', isTarget, originalIndex, isDimmed = false }) => {
    const themes: Record<string, any> = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', accent: 'bg-emerald-200' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', accent: 'bg-sky-200' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', accent: 'bg-fuchsia-200' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', accent: 'bg-amber-200' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', accent: 'bg-rose-200' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800', accent: 'bg-indigo-200' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', accent: 'bg-slate-200' },
        disabled: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-400', accent: 'bg-slate-200' }
    };
    
    const activeTheme = isDimmed ? themes['disabled'] : (themes[themeColor] || themes['slate']);
    let targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-105` : `shadow-sm z-10`;

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <span className={`text-[10px] ${isDimmed ? 'text-slate-300' : 'text-slate-400'} font-mono font-bold mb-1 opacity-80 tracking-tight`}>{String(address)}</span>
            <div className={`flex flex-col items-center w-20 h-16 border-2 rounded-2xl transition-all duration-500 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative overflow-hidden`}>
                <div className={`w-full text-center text-[8px] font-black uppercase tracking-widest py-0.5 border-b border-black/10 ${activeTheme.accent} ${isDimmed ? 'opacity-50' : ''}`}>
                    IDX {originalIndex}
                </div>
                <div className="flex w-full h-full items-center justify-between">
                    <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-2xl border-r border-black/10 ${activeTheme.text} ${isDimmed ? 'opacity-50' : ''}`}>
                        {String(val)}
                    </div>
                    <div className={`w-6 h-full flex flex-col items-center justify-center rounded-br-xl border-slate-200 bg-slate-50/50`}>
                        <span className={`text-[5px] font-black uppercase tracking-widest opacity-60 transform -rotate-90`}>NXT</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Application ---

export default function MaximumTwinSumVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalO1Space');
  
  const [inputList, setInputList] = useState('5, 4, 2, 1');
  
  const [baseList, setBaseList] = useState<ListNodeData[]>([]);
  
  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85);
  // Adjusted initial pan so nodes are nicely centered and visible immediately
  const [pan, setPan] = useState({ x: 20, y: 60 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOpId === 'optimalO1Space' ? 'indigo' : 'amber';

  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 20, y: 60 }); 
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
      let parts = inputStr.split(',').map(s => s.trim()).filter(s => s !== '' && !isNaN(parseInt(s)));
      if (parts.length === 0) parts = ['5', '4', '2', '1'];
      // Guarantee even length per constraints
      if (parts.length % 2 !== 0) parts.push('0');
      // Limit size
      if (parts.length > 10) parts = parts.slice(0, 10);

      let nodes: ListNodeData[] = [];
      for (let i = 0; i < parts.length; i++) {
          nodes.push({
              id: i,
              val: parts[i],
              addr: '0x' + (100 + (i * 16)).toString(16).toUpperCase().padStart(3, '0'),
              nextId: i < parts.length - 1 ? i + 1 : null,
              x: 60 + (i * 140),
              y: 100,
              originalIndex: i // 0-based index for this logic
          });
      }
      return nodes;
  };

  useEffect(() => {
    setBaseList(parseList(inputList));
    setCurrentStep(0);
    setPan({ x: 20, y: 60 });
  }, [inputList, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const trace = useMemo(() => {
    const steps: any[] = [];
    if (baseList.length === 0) return [{ phase: 'Init', description: 'Enter a valid list.', line: 1, state: { list: [] } }];
    
    let list = baseList.map(node => ({...node}));
    let headId = list[0].id;
    let n = list.length;

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            list: list.map(nd=>({...nd})),
            n,
            ...st 
        } 
    });

    if (selectedOpId === 'optimalO1Space') {
        
        add("Function Entry", `public int pairSum(ListNode head)`, 1, { head: headId });

        let slow: number | null = headId;
        add("Init Slow Pointer", `ListNode slow = head;`, 2, { head: headId, slow });

        let fast: number | null = headId;
        add("Init Fast Pointer", `ListNode fast = head;`, 3, { head: headId, slow, fast });

        // Phase 1: Find Middle
        while (true) {
            let fastNode = list.find(nd => nd.id === fast);
            let fastNext = fastNode?.nextId ?? null;
            let cond = fast !== null && fastNext !== null;
            
            add("Check Middle Condition", `while (fast != null && fast.next != null)\nIs fast valid? (${cond})`, 4, { head: headId, slow, fast, isEvaluatingFor: true });
            if (!cond) break;

            let slowNode = list.find(nd => nd.id === slow);
            slow = slowNode?.nextId ?? null;
            add("Advance Slow", `slow = slow.next;\nSlow moves forward by 1 step.`, 5, { head: headId, slow, fast });

            let fastNextNode = list.find(nd => nd.id === fastNext);
            fast = fastNextNode?.nextId ?? null;
            add("Advance Fast", `fast = fast.next.next;\nFast moves forward by 2 steps.`, 6, { head: headId, slow, fast });
        }

        // Phase 2: Reverse Second Half
        let prev: number | null = null;
        add("Init Prev Pointer", `ListNode prev = null;\nPrepares to reverse the second half.`, 9, { head: headId, slow, fast, prev });

        let curr: number | null = slow;
        add("Init Curr Pointer", `ListNode curr = slow;\nStarts reversal at the middle node.`, 10, { head: headId, slow, fast, prev, curr });

        while (true) {
            add("Check Reverse Condition", `while (curr != null)\nIs curr valid? (${curr !== null})`, 11, { head: headId, slow, fast, prev, curr, isEvaluatingFor: true });
            if (curr === null) break;

            let currNodeIndex = list.findIndex(nd => nd.id === curr);
            let currNode = list[currNodeIndex];
            let nextNode: number | null = currNode.nextId;

            add("Save Next Node", `ListNode nextNode = curr.next;\nTemporarily save the rest of the list.`, 12, { head: headId, slow, fast, prev, curr, nextNode });

            list[currNodeIndex] = { ...currNode, nextId: prev }; // Mutate!
            add("Reverse Link", `curr.next = prev;\nPoint current node backwards to prev.`, 13, { head: headId, slow, fast, prev, curr, nextNode, isReversing: true });

            prev = curr;
            add("Advance Prev", `prev = curr;\nMove prev forward.`, 14, { head: headId, slow, fast, prev, curr, nextNode });

            curr = nextNode;
            add("Advance Curr", `curr = nextNode;\nMove curr forward.`, 15, { head: headId, slow, fast, prev, curr, nextNode });
        }

        // Phase 3: Compute Sums
        let maxSum = 0;
        add("Init Max Sum", `int maxSum = 0;`, 18, { head: headId, prev, maxSum });

        let start: number | null = headId;
        add("Init Start Pointer", `ListNode start = head;\nPointer at the beginning of the first half.`, 19, { head: headId, prev, start, maxSum });

        while (true) {
            add("Check Sum Condition", `while (prev != null)\nAre there more pairs to sum? (${prev !== null})`, 20, { head: headId, prev, start, maxSum, isEvaluatingFor: true });
            if (prev === null) break;

            let startNode = list.find(nd => nd.id === start);
            let prevNode = list.find(nd => nd.id === prev);

            if (startNode && prevNode) {
                let currentSum = parseInt(startNode.val) + parseInt(prevNode.val);
                let newMax = Math.max(maxSum, currentSum);
                add("Calculate Twin Sum", `maxSum = Math.max(maxSum, start.val + prev.val);\nTwin sum is ${startNode.val} + ${prevNode.val} = ${currentSum}. Max becomes ${newMax}.`, 21, { head: headId, prev, start, maxSum: newMax, currentSum, hlSum: true, p1: start, p2: prev });
                maxSum = newMax;

                start = startNode.nextId;
                add("Advance Start", `start = start.next;`, 22, { head: headId, prev, start, maxSum });

                prev = prevNode.nextId;
                add("Advance Prev", `prev = prev.next;`, 23, { head: headId, prev, start, maxSum });
            } else {
                break; // Fallback
            }
        }

        add("Return Complete", `return maxSum;\nMaximum twin sum found is ${maxSum}.`, 26, { isSuccess: true, finalAns: maxSum });

    } else if (selectedOpId === 'naiveArray') {
        
        let arrayList: string[] = [];
        
        add("Function Entry", `public int pairSum(ListNode head)`, 1, { head: headId, arrayList: [...arrayList] });
        add("Init List", `List<Integer> list = new ArrayList<>();\nAllocate O(N) memory to store values.`, 2, { head: headId, arrayList: [...arrayList] });
        
        let curr: number | null = headId;
        add("Init Curr", `ListNode curr = head;`, 3, { head: headId, arrayList: [...arrayList], curr });

        while (true) {
            add("Traverse Loop Cond", `while (curr != null)`, 5, { head: headId, arrayList: [...arrayList], curr, isEvaluatingFor: true });
            if (curr === null) break;

            let currNode = list.find(nd => nd.id === curr);
            if (currNode) {
                arrayList.push(currNode.val);
                add("Add Value", `list.add(curr.val);\nAdded ${currNode.val} to array.`, 6, { head: headId, arrayList: [...arrayList], curr, hlArrayAdd: true });

                curr = currNode.nextId;
                add("Advance Curr", `curr = curr.next;`, 7, { head: headId, arrayList: [...arrayList], curr });
            } else break;
        }

        let maxSum = 0;
        add("Init Max Sum", `int maxSum = 0;`, 10, { arrayList: [...arrayList], maxSum });
        
        let sz = arrayList.length;
        add("Get Size", `int n = list.size(); // n = ${sz}`, 11, { arrayList: [...arrayList], maxSum, sz });

        for (let i = 0; i < sz / 2; i++) {
            add("Loop Halves", `for (int i = ${i}; i < n / 2; i++)`, 13, { arrayList: [...arrayList], maxSum, sz, i, isEvaluatingFor: true });
            
            let val1 = parseInt(arrayList[i]);
            let val2 = parseInt(arrayList[sz - 1 - i]);
            let currentSum = val1 + val2;
            
            add("Compute Twin Sum", `int currentSum = list.get(${i}) + list.get(${sz - 1 - i});\nTwin sum is ${val1} + ${val2} = ${currentSum}.`, 14, { arrayList: [...arrayList], maxSum, sz, i, currentSum, hlArrIdx1: i, hlArrIdx2: sz - 1 - i });

            let newMax = Math.max(maxSum, currentSum);
            add("Update Max", `maxSum = Math.max(maxSum, currentSum);\nMax becomes ${newMax}.`, 15, { arrayList: [...arrayList], maxSum: newMax, sz, i, currentSum, hlArrIdx1: i, hlArrIdx2: sz - 1 - i, hlMaxUpdate: true });
            maxSum = newMax;
        }
        
        add("Loop Complete", `for (int i = ${sz/2}; i < n / 2; i++)`, 13, { arrayList: [...arrayList], maxSum, sz, isEvaluatingFor: true });
        add("Return Complete", `return maxSum;\nMaximum twin sum found is ${maxSum}.`, 18, { isSuccess: true, finalAns: maxSum });
    }

    return steps;
  }, [baseList, selectedOpId]);

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { list: [] } };
  const st = curStepData.state || { list: [] };
  const isLastStep = currentStep === trace.length - 1;

  // Use document-level event listener for robust keyboard navigation in embedded views
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        setCurrentStep(prev => (prev < trace.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [trace.length]);

  const renderSvgArrows = () => {
    const arrows: React.ReactElement[] = [];
    (st.list || []).forEach((node: ListNodeData) => {
        if (node.nextId !== null && node.nextId !== undefined) {
            const target = st.list.find((n: ListNodeData) => n.id === node.nextId);
            if (target) {
                let startX = node.x + 80; 
                let startY = node.y + 32; 
                let endX = target.x - 6; 
                let endY = target.y + 32;
                
                let strokeColor = themeColor === 'indigo' ? '#818cf8' : '#fbbf24'; // sky-400 or amber-400
                let strokeWidth = 2;
                let pathD = '';
                let markerId = `url(#arrowhead-forward-${themeColor})`;

                if (target.x < node.x) {
                    // REVERSED LINK (pointing backwards)
                    strokeColor = '#f43f5e'; // rose-500
                    strokeWidth = 3;
                    markerId = `url(#arrowhead-reverse)`;
                    
                    // Start from the LEFT side of the current node, curve under, and enter RIGHT side of target
                    startX = node.x;
                    startY = node.y + 64; // bottom edge
                    endX = target.x + 80;
                    endY = target.y + 64; // bottom edge

                    const cpY = node.y + 110; // Depth of the curve

                    pathD = `M ${startX},${startY} C ${startX},${cpY} ${endX},${cpY} ${endX},${endY}`;
                } else {
                    // Normal forward adjacent
                    pathD = `M ${startX},${startY} L ${endX},${endY}`;
                }

                arrows.push(<path key={`next-${node.id}`} d={pathD} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} markerEnd={markerId} className="transition-all duration-500" opacity={0.9}/>);
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
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'indigo' ? 'bg-indigo-600' : 'bg-amber-600'}`}>
                <Combine className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Maximum Twin Sum of Linked List</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'indigo' ? 'text-indigo-600 bg-indigo-50' : 'text-amber-600 bg-amber-50'}`}>
                      {selectedOpId === 'optimalO1Space' ? 'In-Place Reversal' : 'Array Storage'}
                  </span>
                  <span>•</span>
                  <span>LeetCode 2130</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto scrollbar-none">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Database size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-4">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'indigo' ? 'text-indigo-600' : 'text-amber-600'}`}><Combine size={28}/> Twin Node Pairs</div>
                    <div className="text-lg leading-relaxed max-w-3xl">
                      In a linked list of size <code>n</code> (where <code>n</code> is <strong>even</strong>), the <code>i-th</code> node (0-indexed) is the <strong>twin</strong> of the <code>(n - 1 - i)-th</code> node. <br/><br/>
                      For example, in a list of length 4:
                      <ul className="list-disc pl-8 mt-2 text-sm font-mono">
                          <li>Node 0 is the twin of Node 3 (4 - 1 - 0).</li>
                          <li>Node 1 is the twin of Node 2 (4 - 1 - 1).</li>
                      </ul>
                      <br/>
                      Find the maximum <strong>twin sum</strong> (the sum of a node and its twin) in the given linked list.
                    </div>
                    <div className="bg-slate-900 border-l-4 border-indigo-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-nowrap">
                       <span className="text-indigo-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Input: head = [5,4,2,1]</span>
                       <span className="text-emerald-300">5</span> &rarr; <span className="text-sky-300">4</span> &rarr; <span className="text-sky-300">2</span> &rarr; <span className="text-emerald-300">1</span><br/>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output: 6</span>
                       <span className="text-slate-400 block text-xs">Explanation: </span>
                       <span className="text-emerald-300">Twin 0 (5 + 1 = 6)</span><br/>
                       <span className="text-sky-300">Twin 1 (4 + 2 = 6)</span><br/>
                       <span className="text-white font-bold">Max is 6.</span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> The Trap</h4>
                        <p className="text-sm leading-relaxed">A singly linked list cannot be traversed backwards. The naive solution is to dump all values into an Array to allow index lookups, but this violates optimal space constraints ($O(N)$ memory). You must solve it using only pointer manipulation.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><LayersIcon size={16} className="text-indigo-500"/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600">First, locate the exact middle of the list using <code>slow</code> and <code>fast</code> pointers. Then, <strong>reverse the second half</strong> of the list in place. Finally, use one pointer at the original head and one at the new head of the reversed half, iterating them together to calculate sums.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-${themeColor}-600 text-white border-${themeColor}-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? `text-${themeColor}-100` : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[440px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> TwinSum.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700 pb-10">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-[2] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Linked List Nodes (Even Length)</label>
                            <input type="text" value={inputList} onChange={(e) => setInputList(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner`} />
                        </div>
                    </div>
                    <div className="flex gap-2 shrink-0 justify-end pt-2 border-t border-slate-100">
                        <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={20}/></button>
                        <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={20}/></button>
                        <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-8 py-3 bg-${themeColor}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
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
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> MAXIMUM TWIN SUM FOUND</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">The max sum is {st.finalAns}.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlSum ? 'text-emerald-400' : (st.isReversing ? 'text-fuchsia-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[360px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur`}><Network size={14} className={`text-${themeColor}-500`}/> Linked List Visualizer</span>
                       
                       {/* Max Sum Tracker */}
                       <div className={`bg-white border-2 border-slate-200 rounded-xl p-3 shadow-md flex items-center justify-between gap-4 transition-all duration-300 ${st.hlMaxUpdate || st.hlSum ? 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200 scale-105' : ''}`}>
                           <span className={`text-[10px] font-black uppercase tracking-widest ${st.hlMaxUpdate || st.hlSum ? 'text-emerald-600' : 'text-slate-400'}`}>Max Sum</span>
                           <span className={`font-mono text-2xl font-black ${st.hlMaxUpdate || st.hlSum ? 'text-emerald-600' : 'text-slate-700'}`}>{st.maxSum !== undefined ? st.maxSum : '-'}</span>
                       </div>
                   </div>

                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                            <button onClick={toggleFullscreen} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><Maximize size={18}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col justify-center items-center" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* SVG Arrows layer */}
                           <svg className="absolute inset-0 w-[5000px] h-[5000px] overflow-visible z-0 pointer-events-none -translate-x-[2500px] -translate-y-[2500px]">
                               <defs>
                                  <marker id="arrowhead-forward-indigo" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" opacity="0.9" /></marker>
                                  <marker id="arrowhead-forward-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" opacity="0.9" /></marker>
                                  <marker id="arrowhead-reverse" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" opacity="0.9" /></marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>

                           {/* Nodes layer */}
                           <div className="relative">
                               {(st.list || []).map((nodeObj: ListNodeData) => {
                                  const isHead = st.head === nodeObj.id;
                                  const isSlow = st.slow === nodeObj.id;
                                  const isFast = st.fast === nodeObj.id;
                                  const isPrev = st.prev === nodeObj.id;
                                  const isCurr = st.curr === nodeObj.id;
                                  const isNextNode = st.nextNode === nodeObj.id;
                                  const isStart = st.start === nodeObj.id;

                                  let isTarget = false;
                                  let nodeTheme = 'slate';
                                  
                                  const lbls = [];
                                  if (isHead && !isSlow && !isFast && !isStart && !isCurr && !isPrev) lbls.push({ text: "head", color: "slate", pos: "top" });

                                  if (selectedOpId === 'optimalO1Space') {
                                      // Phase 1 (slow/fast)
                                      if (isFast) { isTarget = true; nodeTheme = 'fuchsia'; lbls.push({ text: "fast", color: "fuchsia", pos: "top" }); }
                                      if (isSlow) { isTarget = true; nodeTheme = 'sky'; lbls.push({ text: "slow", color: "sky", pos: "bottom" }); }
                                      
                                      // Phase 2 (reverse)
                                      if (isCurr) { isTarget = true; nodeTheme = 'amber'; lbls.push({ text: "curr", color: "amber", pos: "bottom" }); }
                                      if (isPrev) { isTarget = true; nodeTheme = 'sky'; lbls.push({ text: "prev", color: "sky", pos: "top" }); }
                                      if (isNextNode) { lbls.push({ text: "nxt", color: "slate", pos: "top" }); }

                                      // Phase 3 (sum)
                                      if (st.hlSum) {
                                          if (st.p1 === nodeObj.id) { isTarget = true; nodeTheme = 'emerald'; lbls.push({ text: "start", color: "emerald", pos: "bottom" }); }
                                          if (st.p2 === nodeObj.id) { isTarget = true; nodeTheme = 'emerald'; lbls.push({ text: "prev", color: "emerald", pos: "top" }); }
                                      } else {
                                          if (isStart) { isTarget = true; nodeTheme = 'indigo'; lbls.push({ text: "start", color: "indigo", pos: "bottom" }); }
                                      }
                                  } else {
                                      // Naive Array
                                      if (isCurr) { isTarget = true; nodeTheme = 'amber'; lbls.push({ text: "curr", color: "amber", pos: "bottom" }); }
                                  }

                                  return (
                                      <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10 ${isTarget ? 'z-20' : ''}`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                          
                                          <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isTarget} themeColor={nodeTheme} originalIndex={nodeObj.originalIndex}/>
                                      </div>
                                  )
                               })}
                           </div>

                           {/* Null Pointer Overlay (for reversing phase) */}
                           {st.prev === null && st.curr !== undefined && selectedOpId === 'optimalO1Space' && (
                               <div className="absolute transition-all duration-700" style={{ left: 60 + (st.n/2 - 1) * 140, top: 100 }}>
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">
                                        <PointerLabel label="prev" color="sky" position="top" />
                                    </div>
                                    <div className="flex flex-col items-center w-20 h-16 border-2 border-dashed border-sky-300 rounded-2xl bg-sky-50/50 justify-center shadow-inner opacity-60">
                                        <span className="font-mono font-black text-sky-400">null</span>
                                    </div>
                               </div>
                           )}

                           {/* Array visualization for Naive approach */}
                           {selectedOpId === 'naiveArray' && st.arrayList !== undefined && (
                               <div className="absolute top-[240px] left-[60px] animate-in slide-in-from-bottom-8">
                                   <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-2 w-max`}><Database size={12}/> 'list' ArrayList O(N) Space</span>
                                   <div className="flex gap-1.5 p-4 border-[3px] border-amber-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-start items-center w-max min-h-[90px]">
                                        {st.arrayList.map((val: string, idx: number) => {
                                            let isHl = false;
                                            let color = 'slate';
                                            if (st.hlArrayAdd && idx === st.arrayList.length - 1) {
                                                isHl = true; color = 'amber';
                                            }
                                            if (st.hlArrIdx1 === idx || st.hlArrIdx2 === idx) {
                                                isHl = true; color = 'emerald';
                                            }

                                            return (
                                                <div key={`arr-${idx}`} className={`relative flex flex-col items-center min-w-[48px] min-h-[48px] border-2 transition-all duration-300 ${isHl ? 'scale-110 z-20 border-emerald-400 bg-emerald-50 text-emerald-800 ring-4 ring-emerald-200' : 'border-slate-300 bg-white text-slate-700 shadow-sm z-10'} rounded-xl overflow-hidden`}>
                                                    <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-xl py-1 bg-white/60 whitespace-nowrap tracking-tighter`}>
                                                        {val}
                                                    </div>
                                                    <div className="flex w-full h-4 border-t border-black/10 bg-slate-100">
                                                        <div className="flex-1 flex items-center justify-center">
                                                             <span className="text-[8px] font-black tracking-widest uppercase">{idx}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {st.arrayList.length === 0 && <span className="text-slate-400 italic text-sm font-mono px-4">empty</span>}
                                   </div>
                               </div>
                           )}

                       </div>
                   </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-10">
                <div className="p-8 rounded-3xl bg-[#0f172a] text-white border border-slate-800 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Combine size={120}/></div>
                    <h3 className="font-black text-indigo-400 text-lg uppercase tracking-widest mb-6">Algorithm Theory: Reversing to Meet the Twin</h3>
                    <div className="space-y-6 text-sm text-slate-300 leading-relaxed max-w-2xl font-medium text-lg">
                        <p><strong>1. The Traversal Problem:</strong> Finding twin pairs requires looking at the 0th node and the (n-1)th node. A singly linked list only goes forward, making backward traversal impossible without O(N) extra memory (like an Array).</p>
                        <p><strong>2. In-Place Reversal:</strong> If we cannot go backwards, we can flip the arrows of the second half of the list so they go forwards instead! By finding the middle node and reversing all <code>next</code> pointers from there to the end, the tail of the list becomes a new 'head' that points towards the middle.</p>
                        <p><strong>3. Twin Synchronization:</strong> With the first half pointing forwards normally, and the second half now reversed (also pointing "forwards" from its own new head), we can simply step through both halves simultaneously, summing the pairs at each step to find the max.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-indigo-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-indigo-500">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering Three Techniques in One</h3>
                    <p className="text-sm text-indigo-50 leading-relaxed italic max-w-2xl font-mono">"Interviewers love this problem because it tests three fundamental Linked List patterns at once: Fast/Slow pointer to find the middle, In-Place Reversal of a list segment, and Two-Pointer parallel traversal. If you can code this cleanly without dropping pointers, you demonstrate high proficiency."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-indigo-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-indigo-800 text-sm uppercase tracking-widest">
                               <div className="bg-indigo-200 p-2 rounded-lg text-indigo-700"><Database size={16}/></div>
                               1. Acknowledge the Naive Array Approach
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-indigo-100 shadow-inner flex-1">
                                "The naive approach is to traverse the entire linked list and dump all the values into an ArrayList. Once we have index-based access, we can easily sum the i-th and (n-1-i)-th elements to find the maximum. However, this requires O(N) extra space, which is suboptimal."
                            </p>
                        </div>

                        <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-indigo-800 text-sm uppercase tracking-widest">
                               <div className="bg-indigo-200 p-2 rounded-lg text-indigo-700"><RotateCcw size={16}/></div>
                               2. Pivot to In-Place Reversal
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-indigo-100 shadow-inner flex-1">
                                "To optimize the space complexity to O(1), we must manipulate the pointers directly. Since we cannot traverse a singly linked list backwards to find the twins, we can simply reverse the second half of the list in-place. This allows us to traverse both halves forward simultaneously."
                            </p>
                        </div>

                        <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-indigo-800 text-sm uppercase tracking-widest">
                               <div className="bg-indigo-200 p-2 rounded-lg text-indigo-700"><Code2 size={16}/></div>
                               3. Detail the Execution
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-indigo-100 shadow-inner flex-1">
                                "I will use a fast and slow pointer to find the exact middle of the list. Then, I'll reverse the second half of the list starting from the slow pointer using standard 4-step pointer reversal (<code>next = curr.next</code> &rarr; <code>curr.next = prev</code> &rarr; <code>prev = curr</code> &rarr; <code>curr = next</code>). Finally, I'll set a pointer at the original head and iterate it alongside <code>prev</code> (the new head of the reversed half), calculating the twin sums and tracking the maximum. This solves it in O(N) time and O(1) space."
                            </p>
                        </div>

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
                          <div className={`p-2 rounded-lg text-white shadow-lg ${themeColor === 'indigo' ? 'bg-indigo-600 shadow-indigo-900/50' : 'bg-amber-600 shadow-amber-900/50'}`}><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 pb-10">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                        ))}
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlSum ? 'text-emerald-400' : (st.isReversing ? 'text-fuchsia-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? `bg-${themeColor}-600 text-white shadow-md` : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-80 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>List Nodes (Even Length)</label>
                              <input type="text" value={inputList} onChange={(e) => setInputList(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500`} />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex gap-6 animate-in slide-in-from-bottom-10">
                          <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                          <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 bg-${themeColor}-600 text-white rounded-[2rem] hover:bg-${themeColor}-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-${themeColor}-500 shadow-[0_20px_50px_rgba(79,70,229,0.3)]`}>NEXT <ChevronRight size={32}/></button>
                      </div>
                  )}

                  {!st.isSuccess && (
                      <div className="absolute bottom-10 left-10 z-[110] flex flex-col gap-2 animate-in slide-in-from-bottom-10">
                          <div className={`bg-white border-4 border-slate-200 rounded-[2rem] p-6 shadow-2xl flex items-center justify-between gap-6 transition-all duration-300 ${st.hlMaxUpdate || st.hlSum ? 'border-emerald-400 bg-emerald-50 ring-4 ring-emerald-200 scale-105' : ''}`}>
                               <div className="flex flex-col">
                                   <span className={`text-xs font-black uppercase tracking-widest ${st.hlMaxUpdate || st.hlSum ? 'text-emerald-600' : 'text-slate-400'}`}>Max Twin Sum</span>
                               </div>
                               <span className={`font-mono text-5xl font-black ${st.hlMaxUpdate || st.hlSum ? 'text-emerald-600' : 'text-slate-700'}`}>{st.maxSum !== undefined ? st.maxSum : '-'}</span>
                           </div>
                      </div>
                  )}

                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-500" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           <svg className="absolute inset-0 w-[5000px] h-[5000px] overflow-visible z-0 pointer-events-none -translate-x-[2500px] -translate-y-[2500px]">
                               <defs>
                                  <marker id="arrowhead-forward-indigo" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" opacity="0.9" /></marker>
                                  <marker id="arrowhead-forward-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" opacity="0.9" /></marker>
                                  <marker id="arrowhead-reverse" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" opacity="0.9" /></marker>
                                </defs>
                               {renderSvgArrows()}
                           </svg>
                           
                           {(st.list || []).map((nodeObj: ListNodeData) => {
                              const isHead = st.head === nodeObj.id;
                              const isSlow = st.slow === nodeObj.id;
                              const isFast = st.fast === nodeObj.id;
                              const isPrev = st.prev === nodeObj.id;
                              const isCurr = st.curr === nodeObj.id;
                              const isNextNode = st.nextNode === nodeObj.id;
                              const isStart = st.start === nodeObj.id;

                              let isTarget = false;
                              let nodeTheme = 'slate';
                              
                              const lbls = [];
                              if (isHead && !isSlow && !isFast && !isStart && !isCurr && !isPrev) lbls.push({ text: "head", color: "slate", pos: "top" });

                              if (selectedOpId === 'optimalO1Space') {
                                  if (isFast) { isTarget = true; nodeTheme = 'fuchsia'; lbls.push({ text: "fast", color: "fuchsia", pos: "top" }); }
                                  if (isSlow) { isTarget = true; nodeTheme = 'sky'; lbls.push({ text: "slow", color: "sky", pos: "bottom" }); }
                                  
                                  if (isCurr) { isTarget = true; nodeTheme = 'amber'; lbls.push({ text: "curr", color: "amber", pos: "bottom" }); }
                                  if (isPrev) { isTarget = true; nodeTheme = 'sky'; lbls.push({ text: "prev", color: "sky", pos: "top" }); }
                                  if (isNextNode) { lbls.push({ text: "nxt", color: "slate", pos: "top" }); }

                                  if (st.hlSum) {
                                      if (st.p1 === nodeObj.id) { isTarget = true; nodeTheme = 'emerald'; lbls.push({ text: "start", color: "emerald", pos: "bottom" }); }
                                      if (st.p2 === nodeObj.id) { isTarget = true; nodeTheme = 'emerald'; lbls.push({ text: "prev", color: "emerald", pos: "top" }); }
                                  } else {
                                      if (isStart) { isTarget = true; nodeTheme = 'indigo'; lbls.push({ text: "start", color: "indigo", pos: "bottom" }); }
                                  }
                              } else {
                                  if (isCurr) { isTarget = true; nodeTheme = 'amber'; lbls.push({ text: "curr", color: "amber", pos: "bottom" }); }
                              }

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10 ${isTarget ? 'z-20' : ''}`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isTarget} themeColor={nodeTheme} originalIndex={nodeObj.originalIndex}/>
                                  </div>
                              )
                           })}

                           {/* Null Pointer Overlay (for reversing phase) */}
                           {st.prev === null && st.curr !== undefined && selectedOpId === 'optimalO1Space' && (
                               <div className="absolute transition-all duration-700" style={{ left: 60 + (st.n/2 - 1) * 140, top: 100 }}>
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">
                                        <PointerLabel label="prev" color="sky" position="top" />
                                    </div>
                                    <div className="flex flex-col items-center w-20 h-16 border-2 border-dashed border-sky-300 rounded-2xl bg-sky-50/50 justify-center shadow-inner opacity-60">
                                        <span className="font-mono font-black text-sky-400">null</span>
                                    </div>
                               </div>
                           )}

                           {/* Array visualization for Naive approach */}
                           {selectedOpId === 'naiveArray' && st.arrayList !== undefined && (
                               <div className="absolute top-[240px] left-[60px] animate-in slide-in-from-bottom-8">
                                   <span className={`text-[12px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-2 w-max`}><Database size={14}/> 'list' ArrayList O(N) Space</span>
                                   <div className="flex gap-2 p-5 border-[4px] border-amber-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-start items-center w-max min-h-[90px]">
                                        {st.arrayList.map((val: string, idx: number) => {
                                            let isHl = false;
                                            if (st.hlArrayAdd && idx === st.arrayList.length - 1) {
                                                isHl = true;
                                            }
                                            if (st.hlArrIdx1 === idx || st.hlArrIdx2 === idx) {
                                                isHl = true; 
                                            }

                                            return (
                                                <div key={`arr-${idx}`} className={`relative flex flex-col items-center min-w-[64px] min-h-[64px] border-2 transition-all duration-300 ${isHl ? 'scale-110 z-20 border-emerald-400 bg-emerald-50 text-emerald-800 ring-4 ring-emerald-200' : 'border-slate-300 bg-white text-slate-700 shadow-sm z-10'} rounded-xl overflow-hidden`}>
                                                    <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-2xl py-1 bg-white/60 whitespace-nowrap tracking-tighter`}>
                                                        {val}
                                                    </div>
                                                    <div className="flex w-full h-5 border-t border-black/10 bg-slate-100">
                                                        <div className="flex-1 flex items-center justify-center">
                                                             <span className="text-[10px] font-black tracking-widest uppercase">{idx}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {st.arrayList.length === 0 && <span className="text-slate-400 italic text-sm font-mono px-4">empty</span>}
                                   </div>
                               </div>
                           )}

                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                
                                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10"><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">COMPLETED</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Maximum Twin Sum Found</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Result</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed">{st.finalAns}</div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20`}>
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